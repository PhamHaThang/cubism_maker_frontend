import React, { useCallback, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
    Box,
    CalendarDays,
    Download,
    Edit3,
    Loader2,
    Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import { api, buildApiUrl } from "../services/api";
import { Level } from "../types";
import { useAuthStore } from "../store/authStore";
import { useEditorStore } from "../store/editorStore";
import { Button } from "../components/ui/Button";

const MyLevelsPage: React.FC = () => {
    const { user } = useAuthStore();
    const { loadLevel } = useEditorStore();
    const navigate = useNavigate();
    const [levels, setLevels] = useState<Level[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingCode, setDeletingCode] = useState<string | null>(null);

    const fetchLevels = useCallback(async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            const res = await api.get(`/api/levels/user/${user.id}`);
            setLevels(res.data.levels ?? []);
        } catch {
            setLevels([]);
            toast.error("Failed to load your levels");
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        fetchLevels();
    }, [fetchLevels]);

    if (!user) return <Navigate to="/login" />;

    const handleEdit = (level: Level) => {
        loadLevel(level);
        navigate("/editor");
    };

    const handleDelete = async (level: Level) => {
        const confirmed = window.confirm(
            `Delete "${level.meta?.name || "Untitled Level"}"? This cannot be undone.`,
        );
        if (!confirmed) return;

        setDeletingCode(level.code);
        try {
            await api.delete(`/api/levels/${level.code}`);
            toast.success("Level deleted");
            await fetchLevels();
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || "Failed to delete level",
            );
        } finally {
            setDeletingCode(null);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
            <div className="mb-6 md:mb-7 rounded-2xl border border-neutral-200 bg-white/90 backdrop-blur-sm px-5 py-5 md:px-6 md:py-6">
                <div className="flex items-center gap-2 mb-1">
                    <Box size={18} className="text-black" />
                    <h1 className="text-2xl font-bold tracking-tight text-black">
                        My Levels
                    </h1>
                </div>
                <p className="text-sm text-neutral-500">
                    Manage the levels you created. Edit them in the editor or
                    delete them permanently.
                </p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-24 rounded-2xl border border-dashed border-neutral-200 bg-white/75">
                    <Loader2
                        size={24}
                        className="animate-spin text-neutral-400"
                    />
                </div>
            ) : levels.length === 0 ? (
                <div className="text-center py-24 rounded-2xl border border-dashed border-neutral-200 bg-white/75">
                    <div className="text-4xl mb-3">🧱</div>
                    <p className="text-sm text-neutral-500">
                        You have not created any levels yet
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">
                        Open the editor, build a level, and publish it to see it
                        here.
                    </p>
                    <div className="mt-6 flex justify-center">
                        <Button
                            variant="primary"
                            onClick={() => navigate("/editor")}>
                            Open Editor
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 card-stagger">
                    {levels.map((level) => {
                        const previewColors = (level.pieces || [])
                            .map((piece) => `#${piece.color}`)
                            .slice(0, 6);

                        return (
                            <article
                                key={level._id}
                                className="group bg-white border border-neutral-200 rounded-2xl overflow-hidden hover:border-black hover:shadow-[0_24px_48px_-30px_rgba(0,0,0,0.85)] transition-all duration-150 ease-in-out">
                                <div className="relative h-40 bg-gradient-to-b from-neutral-50 to-white flex items-center justify-center overflow-hidden">
                                    <div className="grid grid-cols-3 gap-2 p-5">
                                        {previewColors.length > 0 ? (
                                            previewColors.map(
                                                (color, index) => (
                                                    <div
                                                        key={`${color}-${index}`}
                                                        className="w-8 h-8 rounded-md border border-white/70 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35)] transition-transform duration-250 group-hover:scale-110"
                                                        style={{
                                                            backgroundColor:
                                                                color,
                                                        }}
                                                    />
                                                ),
                                            )
                                        ) : (
                                            <div className="col-span-3 text-xs text-neutral-400">
                                                No preview
                                            </div>
                                        )}
                                    </div>

                                    <div className="absolute top-3 left-3">
                                        <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200">
                                            {level.meta?.difficulty || "medium"}
                                        </span>
                                    </div>

                                    <div className="absolute top-3 right-3 flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                window.open(
                                                    buildApiUrl(
                                                        `/api/levels/vr/download/${level.code}`,
                                                    ),
                                                    "_blank",
                                                )
                                            }
                                            className="p-2 rounded-full bg-white/90 border border-neutral-200 text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                                            title="Download">
                                            <Download size={14} />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-4 md:p-5">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <h2 className="text-sm font-semibold text-black truncate flex-1">
                                            {level.meta?.name ||
                                                "Untitled Level"}
                                        </h2>
                                        <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 rounded-full border border-neutral-200 px-2 py-0.5">
                                            {level.code}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-4">
                                        <CalendarDays size={12} />
                                        <span>
                                            {level.publishedAt
                                                ? new Date(
                                                      level.publishedAt,
                                                  ).toLocaleDateString()
                                                : "Recently published"}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 pt-3 border-t border-neutral-100">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => handleEdit(level)}
                                            className="flex-1">
                                            <Edit3 size={14} />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            isLoading={
                                                deletingCode === level.code
                                            }
                                            onClick={() => handleDelete(level)}>
                                            <Trash2 size={14} />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyLevelsPage;
