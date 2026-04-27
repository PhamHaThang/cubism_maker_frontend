import React, { useCallback, useEffect, useState } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import {
    Box,
    CalendarDays,
    Download,
    Edit3,
    Loader2,
    Search,
    SlidersHorizontal,
    Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import { api, buildApiUrl } from "../services/api";
import { Level, LevelPagination } from "../types";
import { useAuthStore } from "../store/authStore";
import { useEditorStore } from "../store/editorStore";
import { Button } from "../components/ui/Button";
import { LevelPreview3D } from "../components/community/LevelPreview3D";
import { Pagination } from "../components/ui/Pagination";

const MyLevelsPage: React.FC = () => {
    const { user } = useAuthStore();
    const { loadLevel } = useEditorStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [levels, setLevels] = useState<Level[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingCode, setDeletingCode] = useState<string | null>(null);
    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<
        "all" | "public" | "private"
    >("all");
    const [sort, setSort] = useState<"newest" | "oldest" | "name">("newest");
    const [pagination, setPagination] = useState<LevelPagination>({
        page: 1,
        limit: 12,
        total: 0,
        pages: 0,
    });

    const fetchLevels = useCallback(
        async (page = 1) => {
            if (!user?.id) return;
            setLoading(true);
            try {
                const params: Record<string, string | number> = {
                    page,
                    limit: 6,
                    sort,
                };
                if (searchTerm) params.search = searchTerm;
                if (difficultyFilter !== "all") {
                    params.difficulty = difficultyFilter;
                }
                if (statusFilter !== "all") {
                    params.status = statusFilter;
                }

                const res = await api.get(`/api/levels/user/${user.id}`, {
                    params,
                });
                setLevels(res.data.levels ?? []);
                if (res.data.pagination) {
                    setPagination(res.data.pagination);
                }
            } catch {
                setLevels([]);
                toast.error("Failed to load your levels");
            } finally {
                setLoading(false);
            }
        },
        [user?.id, sort, searchTerm, difficultyFilter, statusFilter],
    );

    useEffect(() => {
        const timer = window.setTimeout(() => {
            const nextSearch = searchInput.trim();
            setSearchTerm((prev) => (prev === nextSearch ? prev : nextSearch));
        }, 400);

        return () => window.clearTimeout(timer);
    }, [searchInput]);

    useEffect(() => {
        fetchLevels(1);
    }, [fetchLevels]);

    // Refetch when navigating back to this page
    useEffect(() => {
        fetchLevels(1);
    }, [location.pathname]);

    // Refetch when page becomes visible (tab focus)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                fetchLevels(pagination.page);
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange,
            );
        };
    }, [fetchLevels, pagination.page]);

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
            await fetchLevels(pagination.page);
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

            <div className="mb-5 md:mb-6 flex flex-col lg:flex-row gap-2.5 md:gap-3 p-3 md:p-4 rounded-2xl border border-neutral-200 bg-white/80 backdrop-blur-sm">
                <div className="relative flex-1">
                    <Search
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                    />
                    <input
                        type="text"
                        placeholder="Search your levels..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                setSearchTerm(searchInput.trim());
                            }
                        }}
                        className="w-full pl-10 pr-4 py-2.5 md:py-3 text-sm bg-white border border-neutral-200 rounded-xl outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition-all"
                    />
                </div>

                <div className="flex items-center gap-2 w-full lg:w-auto">
                    <SlidersHorizontal
                        size={14}
                        className="text-neutral-400 shrink-0"
                    />
                    <select
                        value={difficultyFilter}
                        onChange={(e) => setDifficultyFilter(e.target.value)}
                        className="w-full lg:w-auto px-3.5 py-2.5 md:py-3 text-xs bg-white border border-neutral-200 rounded-xl outline-none focus:border-black focus:ring-2 focus:ring-black/10 cursor-pointer">
                        <option value="all">All Difficulties</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                        <option value="expert">Expert</option>
                    </select>
                </div>

                <select
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(
                            e.target.value as "all" | "public" | "private",
                        )
                    }
                    className="w-full lg:w-auto px-3.5 py-2.5 md:py-3 text-xs bg-white border border-neutral-200 rounded-xl outline-none focus:border-black focus:ring-2 focus:ring-black/10 cursor-pointer">
                    <option value="all">All Statuses</option>
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                </select>

                <select
                    value={sort}
                    onChange={(e) =>
                        setSort(e.target.value as "newest" | "oldest" | "name")
                    }
                    className="w-full lg:w-auto px-3.5 py-2.5 md:py-3 text-xs bg-white border border-neutral-200 rounded-xl outline-none focus:border-black focus:ring-2 focus:ring-black/10 cursor-pointer">
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="name">Alphabetical</option>
                </select>
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
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 card-stagger">
                        {levels.map((level) => {
                            return (
                                <article
                                    key={level._id}
                                    className="group bg-white border border-neutral-200 rounded-2xl overflow-hidden hover:border-black hover:shadow-[0_24px_48px_-30px_rgba(0,0,0,0.85)] transition-all duration-150 ease-in-out">
                                    <div className="relative h-48 bg-linear-to-b from-neutral-50 to-white overflow-hidden flex items-center justify-center">
                                        <LevelPreview3D level={level} />

                                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
                                            <span className="inline-flex items-center rounded-full border border-neutral-200 bg-white/85 backdrop-blur px-2 py-0.5 text-[10px] font-medium text-neutral-500">
                                                Drag to rotate • Scroll to zoom
                                            </span>
                                        </div>

                                        <div className="absolute top-3 left-3">
                                            <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200">
                                                {level.meta?.difficulty ||
                                                    "medium"}
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
                                            <div className="flex items-center gap-1.5">
                                                <span
                                                    className={`text-[10px] font-semibold uppercase tracking-wider rounded-full border px-2 py-0.5 ${
                                                        level.status ===
                                                        "private"
                                                            ? "text-amber-700 border-amber-200 bg-amber-50"
                                                            : "text-emerald-700 border-emerald-200 bg-emerald-50"
                                                    }`}>
                                                    {level.status || "public"}
                                                </span>
                                                <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 rounded-full border border-neutral-200 px-2 py-0.5">
                                                    {level.code}
                                                </span>
                                            </div>
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
                                                onClick={() =>
                                                    handleEdit(level)
                                                }
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
                                                onClick={() =>
                                                    handleDelete(level)
                                                }>
                                                <Trash2 size={14} />
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                    <Pagination
                        currentPage={pagination.page}
                        totalPages={pagination.pages}
                        totalItems={pagination.total}
                        itemsPerPage={pagination.limit}
                        onPageChange={(page) => fetchLevels(page)}
                    />
                </>
            )}
        </div>
    );
};

export default MyLevelsPage;
