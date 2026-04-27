import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { useEditorStore } from "../../store/editorStore";
import { useAuthStore } from "../../store/authStore";
import { api, buildApiUrl } from "../../services/api";
import { Copy, Check, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

interface PublishModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const PublishModal: React.FC<PublishModalProps> = ({
    isOpen,
    onClose,
}) => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const {
        generateBlueprint,
        voxels,
        editingLevel,
        clearEditingLevel,
        updateEditingLevel,
    } = useEditorStore();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [difficulty, setDifficulty] = useState("medium");
    const [timeSeconds, setTimeSeconds] = useState("0");
    const [publishing, setPublishing] = useState(false);
    const [publishedCode, setPublishedCode] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const isEditing = !!editingLevel;

    React.useEffect(() => {
        if (!isOpen) return;
        setName(editingLevel?.name || "");
        setDifficulty(editingLevel?.difficulty || "medium");
        setTimeSeconds(String(editingLevel?.timeLimitSeconds ?? 0));
    }, [editingLevel, isOpen]);

    const handlePublish = async () => {
        if (!user) {
            toast.error("Please sign in to publish levels");
            return;
        }
        if (!name.trim()) {
            toast.error("Please enter a level name");
            return;
        }
        if (Object.keys(voxels).length === 0) {
            toast.error("Add some voxels before publishing");
            return;
        }

        const parsedTimeSeconds = Number(timeSeconds);
        if (
            Number.isNaN(parsedTimeSeconds) ||
            parsedTimeSeconds < 0 ||
            !Number.isFinite(parsedTimeSeconds)
        ) {
            toast.error("Time must be a non-negative number of seconds");
            return;
        }

        const normalizedTimeSeconds = Math.floor(parsedTimeSeconds);

        setPublishing(true);
        try {
            const blueprint = generateBlueprint();
            if (isEditing && editingLevel?.code) {
                await api.put(`/api/levels/${editingLevel.code}`, {
                    meta: {
                        name: name.trim(),
                        difficulty,
                        timeLimitSeconds: normalizedTimeSeconds,
                    },
                    grid: blueprint.grid,
                    pieces: blueprint.pieces,
                });
                // Update editing level in store with new metadata
                updateEditingLevel({
                    name: name.trim(),
                    difficulty,
                    timeLimitSeconds: normalizedTimeSeconds,
                });
                setPublishedCode(editingLevel.code);
                toast.success("Level updated successfully!");
            } else {
                const res = await api.post("/api/levels", {
                    name: name.trim(),
                    description: description.trim(),
                    difficulty,
                    timeSeconds: normalizedTimeSeconds,
                    blueprint,
                });
                setPublishedCode(res.data.code);
                toast.success("Level published successfully!");
            }
        } catch (error: any) {
            toast.error(
                error.response?.data?.message ||
                    (isEditing ? "Failed to update" : "Failed to publish"),
            );
        } finally {
            setPublishing(false);
        }
    };

    const handleCopy = async () => {
        if (!publishedCode) return;
        await navigator.clipboard.writeText(publishedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClose = () => {
        setPublishedCode(null);
        setName("");
        setDescription("");
        setDifficulty("medium");
        setTimeSeconds("0");
        if (!isEditing) {
            clearEditingLevel();
        }
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={isEditing ? "Update Level" : "Publish Level"}>
            {publishedCode ? (
                /* Success state */
                <div className="text-center space-y-5 animate-fade-in py-1">
                    <div className="text-4xl">🎉</div>
                    <h3 className="text-lg font-semibold">
                        {isEditing ? "Level Updated!" : "Level Published!"}
                    </h3>
                    <p className="text-sm text-neutral-500">
                        {isEditing
                            ? "Your changes have been saved. The level code stays the same:"
                            : "Share this code with VR players:"}
                    </p>

                    <div className="flex items-center justify-center gap-2.5">
                        <div className="px-6 py-3 bg-neutral-100 rounded-xl border border-neutral-200">
                            <span className="text-2xl font-mono font-bold tracking-wider">
                                {publishedCode}
                            </span>
                        </div>
                        <button
                            onClick={handleCopy}
                            className="p-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer">
                            {copied ? <Check size={18} /> : <Copy size={18} />}
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2.5 justify-center pt-1">
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() =>
                                window.open(
                                    buildApiUrl(
                                        `/api/levels/vr/download/${publishedCode}`,
                                    ),
                                    "_blank",
                                )
                            }>
                            <ExternalLink size={14} />
                            {isEditing
                                ? "Download Updated .cube"
                                : "Download .cube"}
                        </Button>
                        {isEditing && (
                            <Button
                                variant="primary"
                                onClick={() => {
                                    handleClose();
                                    navigate("/my-levels");
                                }}>
                                View in My Levels
                            </Button>
                        )}
                    </div>
                </div>
            ) : (
                /* Publish form */
                <div className="space-y-4.5 md:space-y-5">
                    <Input
                        label="Level Name"
                        placeholder="My Amazing Puzzle"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        maxLength={50}
                        required
                    />

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-[0.14em]">
                            Description
                        </label>
                        <textarea
                            placeholder="Describe your level..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            maxLength={200}
                            rows={4}
                            className="w-full px-3.5 py-3 text-sm bg-white border border-neutral-300 rounded-xl outline-none transition-all duration-150 placeholder:text-neutral-400 focus:border-black focus:ring-2 focus:ring-black/10 resize-none"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-[0.14em]">
                            Difficulty
                        </label>
                        <select
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                            className="w-full px-3.5 py-3 text-sm bg-white border border-neutral-300 rounded-xl outline-none focus:border-black focus:ring-2 focus:ring-black/10 cursor-pointer">
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                            <option value="expert">Expert</option>
                        </select>
                    </div>

                    <Input
                        label="Time (seconds)"
                        type="number"
                        min={0}
                        step={1}
                        value={timeSeconds}
                        onChange={(e) => setTimeSeconds(e.target.value)}
                        placeholder="0"
                    />

                    <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-100">
                        <div className="text-xs text-neutral-500">
                            <span className="font-semibold text-black">
                                {Object.keys(voxels).length}
                            </span>{" "}
                            voxels will be included in this level.
                        </div>
                    </div>

                    <div className="flex gap-2.5 pt-2">
                        <Button
                            variant="secondary"
                            onClick={handleClose}
                            className="flex-1">
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handlePublish}
                            isLoading={publishing}
                            className="flex-1">
                            {isEditing ? "Save Changes" : "Publish"}
                        </Button>
                    </div>
                </div>
            )}
        </Modal>
    );
};
