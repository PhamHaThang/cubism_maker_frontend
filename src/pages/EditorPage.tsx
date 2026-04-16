import React, { useEffect, useState } from "react";
import { VoxelEditor } from "../components/editor/VoxelEditor";
import { PublishModal } from "../components/editor/PublishModal";
import { PieceListPanel } from "../components/editor/PieceListPanel";
import { useEditorStore } from "../store/editorStore";

const EditorPage: React.FC = () => {
    const [showPublish, setShowPublish] = useState(false);
    const { editingLevel } = useEditorStore();

    useEffect(() => {
        const prevBodyOverflow = document.body.style.overflow;
        const prevHtmlOverflow = document.documentElement.style.overflow;
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = prevBodyOverflow;
            document.documentElement.style.overflow = prevHtmlOverflow;
        };
    }, []);

    return (
        <div className="relative h-[calc(100svh-4.5rem)] md:h-[calc(100svh-5.5rem)] mx-3 mb-3 md:mx-6 md:mb-6 rounded-2xl overflow-hidden border border-neutral-200 bg-white/65">
            <VoxelEditor />
            <PieceListPanel onPublish={() => setShowPublish(true)} />

            {editingLevel && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
                    <div className="bg-white/90 backdrop-blur border border-neutral-200 rounded-full px-4 py-2 shadow-sm">
                        <p className="text-[11px] text-neutral-600 flex items-center gap-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-neutral-100 border border-neutral-200 text-[10px] font-semibold uppercase tracking-wider text-neutral-700">
                                Editing
                            </span>
                            <span className="font-medium text-neutral-700 max-w-[220px] truncate">
                                {editingLevel.name}
                            </span>
                            <span className="text-neutral-400">
                                #{editingLevel.code}
                            </span>
                        </p>
                    </div>
                </div>
            )}

            {/* Help hint */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 w-[calc(100%-1rem)] md:w-auto">
                <div className="bg-white/95 backdrop-blur border border-neutral-200 rounded-2xl px-3 py-2 md:px-4 md:py-2.5 shadow-sm">
                    <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-[0.12em] mb-1.5 text-center">
                        Editor Controls
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-1.5 md:gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-neutral-50 px-2 py-1 text-[11px] text-neutral-600">
                            <kbd className="px-1.5 py-0.5 bg-white rounded border border-neutral-200 text-[10px] font-mono">
                                Click
                            </kbd>
                            Place
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-neutral-50 px-2 py-1 text-[11px] text-neutral-600">
                            <kbd className="px-1.5 py-0.5 bg-white rounded border border-neutral-200 text-[10px] font-mono">
                                Right-Click
                            </kbd>
                            Remove
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-neutral-50 px-2 py-1 text-[11px] text-neutral-600">
                            <kbd className="px-1.5 py-0.5 bg-white rounded border border-neutral-200 text-[10px] font-mono">
                                Scroll
                            </kbd>
                            Zoom
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-neutral-50 px-2 py-1 text-[11px] text-neutral-600">
                            <kbd className="px-1.5 py-0.5 bg-white rounded border border-neutral-200 text-[10px] font-mono">
                                Middle-Drag
                            </kbd>
                            Pan
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-neutral-50 px-2 py-1 text-[11px] text-neutral-600">
                            <kbd className="px-1.5 py-0.5 bg-white rounded border border-neutral-200 text-[10px] font-mono">
                                Shift+Click
                            </kbd>
                            Pick Piece
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-neutral-50 px-2 py-1 text-[11px] text-neutral-600">
                            <kbd className="px-1.5 py-0.5 bg-white rounded border border-neutral-200 text-[10px] font-mono">
                                Hover
                            </kbd>
                            Preview
                        </span>
                    </div>
                </div>
            </div>

            <PublishModal
                isOpen={showPublish}
                onClose={() => setShowPublish(false)}
            />
        </div>
    );
};

export default EditorPage;
