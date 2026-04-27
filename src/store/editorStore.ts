import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PRESET_COLORS } from "../utils/helpers";
import { Level } from "../types";

/* ─── Types ─── */
export interface VoxelData {
    position: { x: number; y: number; z: number };
    color: string;
    pieceId: number;
}

export interface EditorPiece {
    id: number;
    color: string;
}

interface HistorySnapshot {
    voxels: Record<string, VoxelData>;
    pieces: EditorPiece[];
    currentPieceId: number;
}

interface EditorState {
    // Voxel data (key = "x,y,z")
    voxels: Record<string, VoxelData>;
    currentColor: string;
    currentPieceId: number;
    pieces: EditorPiece[];
    editingLevel: {
        code: string;
        name: string;
        difficulty: string;
        timeLimitSeconds?: number;
        status: "public" | "private";
    } | null;

    // History
    undoStack: HistorySnapshot[];
    redoStack: HistorySnapshot[];

    // Actions
    addVoxel: (pos: { x: number; y: number; z: number }, color: string) => void;
    removeVoxel: (key: string) => void;
    setCurrentColor: (color: string) => void;
    setPieceColor: (id: number, color: string) => void;
    newPiece: () => void;
    selectPiece: (id: number) => void;
    deletePiece: (id: number) => void;
    loadLevel: (level: Level) => void;
    updateEditingLevel: (updates: {
        name?: string;
        difficulty?: string;
        timeLimitSeconds?: number;
        status?: "public" | "private";
    }) => void;
    clearEditingLevel: () => void;
    clearEditorState: () => void;
    undo: () => void;
    redo: () => void;
    clearAll: () => void;
    generateBlueprint: () => {
        grid: number[][];
        pieces: { color: string; segments: number[][] }[];
    };
}

const voxelKey = (pos: { x: number; y: number; z: number }) =>
    `${pos.x},${pos.y},${pos.z}`;

const snapshot = (state: EditorState): HistorySnapshot => ({
    voxels: { ...state.voxels },
    pieces: [...state.pieces],
    currentPieceId: state.currentPieceId,
});

export const useEditorStore = create<EditorState>()(
    persist(
        (set, get) => ({
            voxels: {},
            currentColor: PRESET_COLORS[0],
            currentPieceId: 0,
            pieces: [{ id: 0, color: PRESET_COLORS[0] }],
            editingLevel: null,
            undoStack: [],
            redoStack: [],

            addVoxel: (pos, color) => {
                const state = get();
                const key = voxelKey(pos);
                if (state.voxels[key]) return; // Already occupied

                const snap = snapshot(state);
                set({
                    voxels: {
                        ...state.voxels,
                        [key]: {
                            position: pos,
                            color,
                            pieceId: state.currentPieceId,
                        },
                    },
                    undoStack: [...state.undoStack, snap].slice(-50),
                    redoStack: [],
                });
            },

            removeVoxel: (key) => {
                const state = get();
                if (!state.voxels[key]) return;

                const snap = snapshot(state);
                const newVoxels = { ...state.voxels };
                delete newVoxels[key];
                set({
                    voxels: newVoxels,
                    undoStack: [...state.undoStack, snap].slice(-50),
                    redoStack: [],
                });
            },

            setCurrentColor: (color) => set({ currentColor: color }),

            setPieceColor: (id, color) => {
                const state = get();
                const target = state.pieces.find((p) => p.id === id);
                if (!target || target.color === color) return;

                const snap = snapshot(state);
                const pieces = state.pieces.map((piece) =>
                    piece.id === id ? { ...piece, color } : piece,
                );

                const voxels: Record<string, VoxelData> = {};
                Object.entries(state.voxels).forEach(([key, voxel]) => {
                    voxels[key] =
                        voxel.pieceId === id ? { ...voxel, color } : voxel;
                });

                set({
                    pieces,
                    voxels,
                    currentColor:
                        state.currentPieceId === id
                            ? color
                            : state.currentColor,
                    undoStack: [...state.undoStack, snap].slice(-50),
                    redoStack: [],
                });
            },

            newPiece: () => {
                const state = get();
                const nextId =
                    Math.max(...state.pieces.map((p) => p.id), -1) + 1;
                const nextColor =
                    PRESET_COLORS[nextId % PRESET_COLORS.length] ||
                    state.currentColor;
                set({
                    pieces: [...state.pieces, { id: nextId, color: nextColor }],
                    currentPieceId: nextId,
                    currentColor: nextColor,
                });
            },

            selectPiece: (id) => {
                const piece = get().pieces.find((p) => p.id === id);
                if (piece) {
                    set({ currentPieceId: id, currentColor: piece.color });
                }
            },

            deletePiece: (id) => {
                const state = get();
                const targetPiece = state.pieces.find(
                    (piece) => piece.id === id,
                );
                if (!targetPiece) return;

                const remainingPieces = state.pieces.filter(
                    (piece) => piece.id !== id,
                );
                const remainingVoxels: Record<string, VoxelData> = {};

                Object.entries(state.voxels).forEach(([key, voxel]) => {
                    if (voxel.pieceId !== id) {
                        remainingVoxels[key] = voxel;
                    }
                });

                const snap = snapshot(state);
                const nextPieces =
                    remainingPieces.length > 0
                        ? remainingPieces
                        : [{ id: 0, color: PRESET_COLORS[0] }];
                const nextActivePiece =
                    nextPieces.find((piece) => piece.id !== id) ??
                    nextPieces[0];

                set({
                    pieces: nextPieces,
                    voxels: remainingVoxels,
                    currentPieceId: nextActivePiece?.id ?? 0,
                    currentColor: nextActivePiece?.color ?? PRESET_COLORS[0],
                    undoStack: [...state.undoStack, snap].slice(-50),
                    redoStack: [],
                });
            },

            loadLevel: (level) => {
                const pieces = level.pieces?.length
                    ? level.pieces.map((piece, index) => ({
                          id: index,
                          color: `#${piece.color.replace("#", "")}`,
                      }))
                    : [{ id: 0, color: PRESET_COLORS[0] }];

                const voxels: Record<string, VoxelData> = {};
                pieces.forEach((piece, pieceIndex) => {
                    const segments = level.pieces?.[pieceIndex]?.segments || [];
                    segments.forEach((segment) => {
                        const [x, y, z] = segment;
                        voxels[`${x},${y},${z}`] = {
                            position: { x, y, z },
                            color: piece.color,
                            pieceId: piece.id,
                        };
                    });
                });

                set({
                    voxels,
                    pieces,
                    currentPieceId: pieces[0]?.id ?? 0,
                    currentColor: pieces[0]?.color ?? PRESET_COLORS[0],
                    editingLevel: {
                        code: level.code,
                        name: level.meta?.name || "Untitled Level",
                        difficulty: level.meta?.difficulty || "medium",
                        timeLimitSeconds: level.meta?.timeLimitSeconds ?? 0,
                        status:
                            level.status === "private" ? "private" : "public",
                    },
                    undoStack: [],
                    redoStack: [],
                });
            },

            clearEditingLevel: () => set({ editingLevel: null }),

            updateEditingLevel: (updates) => {
                const state = get();
                if (!state.editingLevel) return;
                set({
                    editingLevel: {
                        ...state.editingLevel,
                        name: updates.name ?? state.editingLevel.name,
                        difficulty:
                            updates.difficulty ?? state.editingLevel.difficulty,
                        timeLimitSeconds:
                            updates.timeLimitSeconds ??
                            state.editingLevel.timeLimitSeconds,
                        status: updates.status ?? state.editingLevel.status,
                    },
                });
            },

            clearEditorState: () => {
                set({
                    voxels: {},
                    currentColor: PRESET_COLORS[0],
                    currentPieceId: 0,
                    pieces: [{ id: 0, color: PRESET_COLORS[0] }],
                    editingLevel: null,
                    undoStack: [],
                    redoStack: [],
                });
            },

            undo: () => {
                const state = get();
                if (state.undoStack.length === 0) return;
                const prev = state.undoStack[state.undoStack.length - 1];
                const snap = snapshot(state);
                set({
                    voxels: prev.voxels,
                    pieces: prev.pieces,
                    currentPieceId: prev.currentPieceId,
                    undoStack: state.undoStack.slice(0, -1),
                    redoStack: [...state.redoStack, snap],
                });
            },

            redo: () => {
                const state = get();
                if (state.redoStack.length === 0) return;
                const next = state.redoStack[state.redoStack.length - 1];
                const snap = snapshot(state);
                set({
                    voxels: next.voxels,
                    pieces: next.pieces,
                    currentPieceId: next.currentPieceId,
                    undoStack: [...state.undoStack, snap],
                    redoStack: state.redoStack.slice(0, -1),
                });
            },

            clearAll: () => {
                const state = get();
                const snap = snapshot(state);
                set({
                    voxels: {},
                    pieces: [{ id: 0, color: PRESET_COLORS[0] }],
                    currentPieceId: 0,
                    currentColor: PRESET_COLORS[0],
                    editingLevel: null,
                    undoStack: [...state.undoStack, snap].slice(-50),
                    redoStack: [],
                });
            },

            generateBlueprint: () => {
                const { voxels, pieces } = get();
                const entries = Object.values(voxels);

                // Build grid from all voxel positions
                const grid = entries.map((v) => [
                    v.position.x,
                    v.position.y,
                    v.position.z,
                ]);

                // Group voxels by pieceId
                const pieceMap = new Map<
                    number,
                    { color: string; segments: number[][] }
                >();
                for (const piece of pieces) {
                    pieceMap.set(piece.id, {
                        color: piece.color.replace("#", ""),
                        segments: [],
                    });
                }
                for (const v of entries) {
                    let p = pieceMap.get(v.pieceId);
                    if (!p) {
                        p = { color: v.color.replace("#", ""), segments: [] };
                        pieceMap.set(v.pieceId, p);
                    }
                    p.segments.push([v.position.x, v.position.y, v.position.z]);
                }

                // Only include pieces with at least one segment
                const blueprintPieces = Array.from(pieceMap.values()).filter(
                    (p) => p.segments.length > 0,
                );

                return { grid, pieces: blueprintPieces };
            },
        }),
        {
            name: "CubeCube-editor",
            partialize: (state) => ({
                voxels: state.voxels,
                pieces: state.pieces,
                currentColor: state.currentColor,
                currentPieceId: state.currentPieceId,
                editingLevel: state.editingLevel,
            }),
        },
    ),
);
