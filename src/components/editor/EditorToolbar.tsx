import React, { useState } from "react";
import { Undo2, Redo2, Trash2, Palette, Group } from "lucide-react";
import { useEditorStore } from "../../store/editorStore";
import { DEFAULT_COLORS } from "../../utils/helpers";

export const EditorToolbar: React.FC<{ onPublish: () => void }> = ({
    onPublish,
}) => {
    const { currentColor, setCurrentColor, undo, redo, clearAll, newPiece } =
        useEditorStore();

    const [showColorPicker, setShowColorPicker] = useState(false);
    const [customColor, setCustomColor] = useState(currentColor);

    void onPublish;

    return (
        <div className="absolute top-3 left-3 md:top-4 md:left-4 z-10 w-20 flex flex-col gap-2.5 md:gap-3">
            {/* Main toolbar */}
            <div className="bg-white/95 border border-neutral-200 rounded-2xl shadow-lg p-2 flex flex-col items-center gap-1.5">
                {/* Color Palette */}
                <div className="relative">
                    <button
                        onClick={() => setShowColorPicker(!showColorPicker)}
                        className="w-10 h-10 rounded-xl border-2 border-neutral-300 hover:border-black transition-colors cursor-pointer flex items-center justify-center"
                        style={{ backgroundColor: currentColor }}
                        title="Color">
                        <Palette
                            size={14}
                            className="text-white mix-blend-difference"
                        />
                    </button>
                    <span className="text-[10px] font-medium text-neutral-500">
                        Color
                    </span>

                    {showColorPicker && (
                        <div className="absolute left-14 top-0 bg-white border border-neutral-200 rounded-2xl shadow-xl p-3.5 min-w-[196px] animate-fade-in">
                            <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                                Presets
                            </p>
                            <div className="grid grid-cols-5 gap-1.5 mb-3">
                                {DEFAULT_COLORS.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => {
                                            setCurrentColor(color);
                                            setCustomColor(color);
                                        }}
                                        className={`w-7 h-7 rounded-md cursor-pointer transition-all hover:scale-110 ${
                                            currentColor === color
                                                ? "ring-2 ring-black ring-offset-1"
                                                : "border border-neutral-200"
                                        }`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                            <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                                Custom
                            </p>
                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    value={customColor}
                                    onChange={(e) => {
                                        setCustomColor(e.target.value);
                                        setCurrentColor(e.target.value);
                                    }}
                                    className="w-8 h-8 rounded cursor-pointer border border-neutral-200"
                                />
                                <input
                                    type="text"
                                    value={customColor}
                                    onChange={(e) => {
                                        setCustomColor(e.target.value);
                                        if (
                                            /^#[0-9A-Fa-f]{6}$/.test(
                                                e.target.value,
                                            )
                                        ) {
                                            setCurrentColor(e.target.value);
                                        }
                                    }}
                                    className="flex-1 px-2 py-1 text-xs font-mono border border-neutral-200 rounded-md outline-none focus:border-black"
                                    placeholder="#000000"
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="h-px bg-neutral-100 my-1" />

                {/* Piece management */}
                <button
                    onClick={newPiece}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                    title="New Piece Group">
                    <Group size={16} />
                </button>
                <span className="text-[10px] font-medium text-neutral-500 -mt-1">
                    New Piece
                </span>

                <div className="h-px bg-neutral-100 my-1" />

                {/* Undo / Redo */}
                <button
                    onClick={undo}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                    title="Undo">
                    <Undo2 size={16} />
                </button>
                <span className="text-[10px] font-medium text-neutral-500 -mt-1">
                    Undo
                </span>
                <button
                    onClick={redo}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                    title="Redo">
                    <Redo2 size={16} />
                </button>
                <span className="text-[10px] font-medium text-neutral-500 -mt-1">
                    Redo
                </span>

                <div className="h-px bg-neutral-100 my-1" />

                {/* Clear */}
                <button
                    onClick={clearAll}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-neutral-500 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Clear All">
                    <Trash2 size={16} />
                </button>
                <span className="text-[10px] font-medium text-neutral-500 -mt-1">
                    Clear
                </span>
            </div>
        </div>
    );
};
