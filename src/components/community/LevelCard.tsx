import React from "react";
import { Heart, Download, User, Copy, Check } from "lucide-react";
import { Level } from "../../types";
import { Badge } from "../ui/Badge";
import { getDifficultyColor } from "../../utils/helpers";
import { useAuthStore } from "../../store/authStore";
import { api, buildApiUrl } from "../../services/api";
import toast from "react-hot-toast";

interface LevelCardProps {
    level: Level;
    isFavorited?: boolean;
    onFavoriteToggle?: () => void;
}

export const LevelCard: React.FC<LevelCardProps> = ({
    level,
    isFavorited = false,
    onFavoriteToggle,
}) => {
    const { user } = useAuthStore();
    const [copied, setCopied] = React.useState(false);
    const [favLoading, setFavLoading] = React.useState(false);

    // level.pieces holds {color, segments} from blueprint
    const pieceColors = level.pieces?.map((p) => `#${p.color}`) || [];
    const uniqueColors = [...new Set(pieceColors)].slice(0, 6);

    const levelName = level.meta?.name || "Untitled Level";
    const levelDifficulty = level.meta?.difficulty || "medium";

    const handleCopyCode = async () => {
        await navigator.clipboard.writeText(level.code);
        setCopied(true);
        toast.success(`Code ${level.code} copied!`);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleFavorite = async () => {
        if (!user) {
            toast.error("Please sign in to favorite levels");
            return;
        }
        setFavLoading(true);
        try {
            await api.post(`/api/favorites/${level._id}`);
            onFavoriteToggle?.();
        } catch {
            toast.error("Failed to update favorite");
        } finally {
            setFavLoading(false);
        }
    };

    const handleDownload = () => {
        window.open(
            buildApiUrl(`/api/levels/vr/download/${level.code}`),
            "_blank",
        );
    };

    return (
        <div className="group relative bg-white/95 border border-neutral-200 rounded-2xl overflow-hidden hover:border-black hover:shadow-[0_24px_48px_-30px_rgba(0,0,0,0.85)] transition-all duration-150 ease-in-out hover:-translate-y-[2px]">
            {/* Preview Area */}
            <div className="relative h-44 bg-gradient-to-b from-neutral-50 to-white overflow-hidden flex items-center justify-center">
                <div className="grid grid-cols-3 gap-2 p-5 md:p-6">
                    {uniqueColors.length > 0
                        ? uniqueColors.map((color, i) => (
                              <div
                                  key={i}
                                  className="w-8 h-8 rounded-md transform transition-transform duration-250 group-hover:scale-110 group-hover:rotate-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.3)]"
                                  style={{
                                      backgroundColor: color,
                                      opacity: 0.9,
                                  }}
                              />
                          ))
                        : Array.from({ length: 4 }).map((_, i) => (
                              <div
                                  key={i}
                                  className="w-8 h-8 rounded-md bg-neutral-200"
                              />
                          ))}
                </div>

                {/* Piece count badge */}
                <div className="absolute top-3 left-3">
                    <Badge>{level.pieces?.length || 0} pieces</Badge>
                </div>

                {/* Favorite button */}
                <button
                    onClick={handleFavorite}
                    disabled={favLoading}
                    className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-150 cursor-pointer ${
                        isFavorited
                            ? "bg-red-50 text-red-500 border border-red-200"
                            : "bg-white/80 text-neutral-400 border border-neutral-200 hover:text-red-500 hover:border-red-200"
                    }`}>
                    <Heart
                        size={14}
                        fill={isFavorited ? "currentColor" : "none"}
                    />
                </button>
            </div>

            {/* Content */}
            <div className="p-4 md:p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-sm font-semibold text-black truncate flex-1">
                        {levelName}
                    </h3>
                    <span
                        className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full flex-shrink-0"
                        style={{
                            backgroundColor: `${getDifficultyColor(levelDifficulty)}18`,
                            color: getDifficultyColor(levelDifficulty),
                            border: `1px solid ${getDifficultyColor(levelDifficulty)}30`,
                        }}>
                        {levelDifficulty}
                    </span>
                </div>

                {/* Author */}
                <div className="flex items-center gap-1.5 mb-3.5">
                    <User size={12} className="text-neutral-400" />
                    <span className="text-xs text-neutral-500">
                        {typeof level.author === "object" &&
                        level.author !== null
                            ? (level.author as any).username
                            : "Anonymous"}
                    </span>
                </div>

                {/* Footer */}
                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-neutral-100">
                    <button
                        onClick={handleCopyCode}
                        className="flex items-center gap-1 px-2 py-1 text-[11px] font-mono bg-neutral-100 rounded-md hover:bg-neutral-200 transition-colors cursor-pointer border border-neutral-200">
                        {copied ? <Check size={10} /> : <Copy size={10} />}
                        {level.code}
                    </button>

                    <div className="flex-1 min-w-[12px]" />

                    <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                        <Heart size={10} />
                        {level.favorites || 0}
                    </span>

                    <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                        <Download size={10} />
                        {level.downloads || 0}
                    </span>

                    <button
                        onClick={handleDownload}
                        className="p-1.5 ml-auto text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-md transition-colors cursor-pointer"
                        title="Download .cube file">
                        <Download size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};
