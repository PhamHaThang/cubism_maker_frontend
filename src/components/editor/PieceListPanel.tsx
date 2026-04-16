import React, { useEffect, useMemo, useRef } from "react";
import {
    Layers,
    Layers3,
    Plus,
    Redo2,
    Trash2,
    Undo2,
    Upload,
} from "lucide-react";
import { useEditorStore } from "../../store/editorStore";
import { Button } from "../ui/Button";

export const PieceListPanel: React.FC<{ onPublish: () => void }> = ({
    onPublish,
}) => {
    const {
        pieces,
        voxels,
        currentPieceId,
        selectPiece,
        newPiece,
        setPieceColor,
        undo,
        redo,
        clearAll,
    } = useEditorStore();
    const buttonRefs = useRef<Map<number, HTMLButtonElement>>(new Map());
    const totalVoxels = Object.keys(voxels).length;

    const pieceVoxelCount = useMemo(() => {
        const countMap = new Map<number, number>();
        Object.values(voxels).forEach((v) => {
            countMap.set(v.pieceId, (countMap.get(v.pieceId) || 0) + 1);
        });
        return countMap;
    }, [voxels]);

    useEffect(() => {
        const activeButton = buttonRefs.current.get(currentPieceId);
        if (!activeButton) return;

        activeButton.scrollIntoView({ block: "nearest", behavior: "smooth" });
        activeButton.focus({ preventScroll: true });
    }, [currentPieceId]);

    return (
        <div className="absolute top-3 right-3 md:top-4 md:right-4 z-10 w-62 bg-white/95 border border-neutral-200 rounded-2xl shadow-lg overflow-hidden">
            <div className="px-3.5 py-3 border-b border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700">
                    <Layers3 size={14} className="text-neutral-500" />
                    Piece List
                </div>
                <button
                    type="button"
                    onClick={newPiece}
                    className="p-1.5 rounded-lg border border-neutral-200 text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                    title="Create new piece">
                    <Plus size={13} />
                </button>
            </div>

            <div className="max-h-64 overflow-y-auto p-2.5 space-y-1.5">
                <div className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl border border-neutral-300 bg-neutral-100/70">
                    <span className="w-4 h-4 rounded-md border border-neutral-300 shrink-0 bg-gradient-to-br from-neutral-300 to-neutral-500" />
                    <span className="text-xs font-semibold text-neutral-700 flex-1 truncate">
                        All Pieces
                    </span>
                    <span className="text-[11px] text-neutral-500">
                        {totalVoxels}
                    </span>
                </div>

                {pieces.map((piece) => {
                    const isActive = piece.id === currentPieceId;
                    const voxelCount = pieceVoxelCount.get(piece.id) || 0;

                    return (
                        <div
                            key={piece.id}
                            className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl border transition-all ${
                                isActive
                                    ? "border-black bg-neutral-100"
                                    : "border-neutral-200 bg-white hover:bg-neutral-50"
                            }`}>
                            <button
                                type="button"
                                ref={(el) => {
                                    if (el)
                                        buttonRefs.current.set(piece.id, el);
                                    else buttonRefs.current.delete(piece.id);
                                }}
                                onClick={() => selectPiece(piece.id)}
                                className="flex items-center gap-2 flex-1 text-left cursor-pointer">
                                <span
                                    className="w-4 h-4 rounded-md border border-neutral-300 shrink-0"
                                    style={{ backgroundColor: piece.color }}
                                />
                                <span className="text-xs font-semibold text-neutral-700 flex-1 truncate">
                                    Piece #{piece.id + 1}
                                </span>
                                <span className="text-[11px] text-neutral-500">
                                    {voxelCount}
                                </span>
                            </button>
                            <input
                                type="color"
                                value={piece.color}
                                onChange={(e) =>
                                    setPieceColor(piece.id, e.target.value)
                                }
                                onClick={(e) => e.stopPropagation()}
                                className="w-6 h-6 rounded-md border border-neutral-200 cursor-pointer"
                                title={`Change color for Piece #${piece.id + 1}`}
                            />
                        </div>
                    );
                })}
            </div>

            <div className="px-3 py-2.5 border-t border-neutral-100 space-y-2.5">
                <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-1.5 text-center">
                        <div className="text-[10px] text-neutral-400 uppercase tracking-wider">
                            Voxels
                        </div>
                        <div className="text-xs font-semibold text-neutral-700">
                            {totalVoxels}
                        </div>
                    </div>
                    <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-1.5 text-center">
                        <div className="text-[10px] text-neutral-400 uppercase tracking-wider">
                            Pieces
                        </div>
                        <div className="text-xs font-semibold text-neutral-700">
                            {pieces.length}
                        </div>
                    </div>
                    <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-1.5 text-center">
                        <div className="text-[10px] text-neutral-400 uppercase tracking-wider">
                            Active
                        </div>
                        <div className="text-xs font-semibold text-neutral-700">
                            #{currentPieceId + 1}
                        </div>
                    </div>
                </div>

                <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={onPublish}
                    disabled={totalVoxels === 0}>
                    <Upload size={14} />
                    Publish Level
                </Button>

                <div className="grid grid-cols-3 gap-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={undo}
                        className="!px-2"
                        title="Undo">
                        <Undo2 size={14} />
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={redo}
                        className="!px-2"
                        title="Redo">
                        <Redo2 size={14} />
                    </Button>
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={clearAll}
                        className="!px-2"
                        title="Clear">
                        <Trash2 size={14} />
                    </Button>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-neutral-500">
                    <span className="italic">
                        Manage, recolor, edit history and publish from this
                        panel
                    </span>
                </div>
            </div>
        </div>
    );
};
