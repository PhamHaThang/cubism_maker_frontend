import React, { useEffect, useState, useCallback } from "react";
import { Heart, Loader2 } from "lucide-react";
import { api } from "../services/api";
import { Level } from "../types";
import { LevelCard } from "../components/community/LevelCard";
import { useAuthStore } from "../store/authStore";
import { Navigate } from "react-router-dom";

const FavoritesPage: React.FC = () => {
    const { user } = useAuthStore();
    const [favorites, setFavorites] = useState<Level[]>([]);
    const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);

    const fetchFavorites = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get("/api/favorites");
            // Server returns { levels: [...] }
            const levels: Level[] = res.data.levels ?? [];
            setFavorites(levels);
            setFavoriteIds(new Set(levels.map((l) => l._id)));
        } catch {
            setFavorites([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    if (!user) return <Navigate to="/login" />;

    const handleFavoriteToggle = () => {
        fetchFavorites(); // refetch to sync
    };

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
            <div className="mb-6 md:mb-7 rounded-2xl border border-neutral-200 bg-white/85 backdrop-blur-sm px-5 py-5 md:px-6 md:py-6">
                <div className="flex items-center gap-2 mb-1">
                    <Heart size={18} className="text-red-500" />
                    <h1 className="text-2xl font-bold tracking-tight text-black">
                        My Favorites
                    </h1>
                </div>
                <p className="text-sm text-neutral-500">
                    Levels you've saved for later
                </p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-24 rounded-2xl border border-dashed border-neutral-200 bg-white/75">
                    <Loader2
                        size={24}
                        className="animate-spin text-neutral-400"
                    />
                </div>
            ) : favorites.length === 0 ? (
                <div className="text-center py-24 rounded-2xl border border-dashed border-neutral-200 bg-white/75">
                    <div className="text-4xl mb-3">💔</div>
                    <p className="text-sm text-neutral-500">
                        No favorite levels yet
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">
                        Click the heart icon on a level to save it here
                    </p>
                </div>
            ) : (
                <div className="rounded-2xl border border-neutral-200 bg-white/70 p-3 md:p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 card-stagger">
                        {favorites.map((level) => (
                            <LevelCard
                                key={level._id}
                                level={level}
                                isFavorited={favoriteIds.has(level._id)}
                                onFavoriteToggle={handleFavoriteToggle}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FavoritesPage;
