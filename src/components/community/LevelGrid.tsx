import React, { useEffect, useState, useCallback } from "react";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";
import { Level } from "../../types";
import { api } from "../../services/api";
import { LevelCard } from "./LevelCard";
import { useAuthStore } from "../../store/authStore";

export const LevelGrid: React.FC = () => {
    const { user } = useAuthStore();
    const [levels, setLevels] = useState<Level[]>([]);
    const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState<"newest" | "popular" | "name">("newest");
    const [difficulty, setDifficulty] = useState<string>("all");

    const fetchLevels = useCallback(async () => {
        setLoading(true);
        try {
            const params: Record<string, string> = { sort };
            if (search) params.search = search;
            if (difficulty !== "all") params.difficulty = difficulty;

            const res = await api.get("/api/levels", { params });
            // Server returns { levels: [...], pagination: {...} }
            setLevels(res.data.levels ?? res.data ?? []);
        } catch {
            setLevels([]);
        } finally {
            setLoading(false);
        }
    }, [sort, search, difficulty]);

    const fetchFavorites = useCallback(async () => {
        if (!user) return;
        try {
            const res = await api.get("/api/favorites");
            // Server returns { levels: [...] }
            const faved: Level[] = res.data.levels ?? [];
            setFavoriteIds(new Set(faved.map((l) => l._id)));
        } catch {
            /* ignore */
        }
    }, [user]);

    useEffect(() => {
        fetchLevels();
    }, [fetchLevels]);
    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    const handleFavoriteToggle = (levelId: string) => {
        setFavoriteIds((prev) => {
            const next = new Set(prev);
            if (next.has(levelId)) next.delete(levelId);
            else next.add(levelId);
            return next;
        });
    };

    return (
        <div className="space-y-5 md:space-y-6">
            {/* Filters Bar */}
            <div className="flex flex-col lg:flex-row gap-2.5 md:gap-3 p-3 md:p-4 rounded-2xl border border-neutral-200 bg-white/80 backdrop-blur-sm">
                <div className="relative flex-1">
                    <Search
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                    />
                    <input
                        type="text"
                        placeholder="Search levels..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && fetchLevels()}
                        className="w-full pl-10 pr-4 py-2.5 md:py-3 text-sm bg-white border border-neutral-200 rounded-xl outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition-all"
                    />
                </div>

                <div className="flex items-center gap-2 w-full lg:w-auto">
                    <SlidersHorizontal
                        size={14}
                        className="text-neutral-400 shrink-0"
                    />
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className="w-full lg:w-auto px-3.5 py-2.5 md:py-3 text-xs bg-white border border-neutral-200 rounded-xl outline-none focus:border-black focus:ring-2 focus:ring-black/10 cursor-pointer">
                        <option value="all">All Levels</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                        <option value="expert">Expert</option>
                    </select>
                </div>

                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as any)}
                    className="w-full lg:w-auto px-3.5 py-2.5 md:py-3 text-xs bg-white border border-neutral-200 rounded-xl outline-none focus:border-black focus:ring-2 focus:ring-black/10 cursor-pointer">
                    <option value="newest">Newest First</option>
                    <option value="popular">Most Popular</option>
                    <option value="name">Alphabetical</option>
                </select>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2
                        size={24}
                        className="animate-spin text-neutral-400"
                    />
                </div>
            ) : levels.length === 0 ? (
                <div className="text-center py-20 rounded-2xl border border-dashed border-neutral-200 bg-white/75">
                    <div className="text-4xl mb-3">🧊</div>
                    <p className="text-sm text-neutral-500">No levels found</p>
                    <p className="text-xs text-neutral-400 mt-1">
                        Be the first to create and publish a level!
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 card-stagger">
                    {levels.map((level) => (
                        <LevelCard
                            key={level._id}
                            level={level}
                            isFavorited={favoriteIds.has(level._id)}
                            onFavoriteToggle={() =>
                                handleFavoriteToggle(level._id)
                            }
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
