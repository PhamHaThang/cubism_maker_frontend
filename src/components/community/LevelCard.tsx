import React from "react";
import {
    Heart,
    Download,
    User,
    Copy,
    Check,
    Clock3,
    Boxes,
} from "lucide-react";
import { Level } from "../../types";
import { Badge } from "../ui/Badge";
import { getDifficultyColor } from "../../utils/helpers";
import { useAuthStore } from "../../store/authStore";
import { api, buildApiUrl } from "../../services/api";
import { LevelPreview3D } from "./LevelPreview3D";
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

    const levelName = level.meta?.name || "Untitled Level";
    const levelDifficulty = level.meta?.difficulty || "medium";
    const levelTimeSeconds = Math.max(
        0,
        Number(level.meta?.timeLimitSeconds || 0),
    );
    const totalVoxels = (level.pieces || []).reduce(
        (sum, piece) => sum + (piece.segments?.length || 0),
        0,
    );

    const formattedTime =
        levelTimeSeconds > 0
            ? levelTimeSeconds >= 60
                ? `${Math.floor(levelTimeSeconds / 60)}m ${levelTimeSeconds % 60}s`
                : `${levelTimeSeconds}s`
            : "No limit";

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
        <div className="group relative h-full bg-white/95 border border-neutral-200 rounded-2xl overflow-hidden hover:border-black hover:shadow-[0_24px_48px_-30px_rgba(0,0,0,0.85)] transition-all duration-150 ease-in-out hover:-translate-y-0.5">
            {/* Preview Area */}
            <div className="relative h-48 bg-linear-to-b from-neutral-50 to-white overflow-hidden flex items-center justify-center">
                <LevelPreview3D level={level} />

                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
                    <span className="inline-flex items-center rounded-full border border-neutral-200 bg-white/85 backdrop-blur px-2 py-0.5 text-[10px] font-medium text-neutral-500">
                        Drag to rotate • Scroll to zoom
                    </span>
                </div>

                {/* Piece count badge */}
                <div className="absolute top-3 left-3 z-10">
                    <Badge>{level.pieces?.length || 0} pieces</Badge>
                </div>

                {/* Favorite button */}
                <button
                    onClick={handleFavorite}
                    disabled={favLoading}
                    className={`absolute top-3 right-3 z-10 h-10 w-10 inline-flex items-center justify-center rounded-full transition-all duration-150 cursor-pointer ${
                        isFavorited
                            ? "bg-red-50 text-red-500 border border-red-200"
                            : "bg-white/80 text-neutral-400 border border-neutral-200 hover:text-red-500 hover:border-red-200"
                    }`}>
                    <Heart
                        size={16}
                        fill={isFavorited ? "currentColor" : "none"}
                    />
                </button>
            </div>

            {/* Content */}
            <div className="p-4 md:p-5 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2.5">
                    <h3 className="text-sm leading-5 font-semibold text-black line-clamp-2 flex-1">
                        {levelName}
                    </h3>
                    <span
                        className="inline-flex items-center h-6 px-2.5 text-[10px] font-semibold uppercase tracking-wider rounded-full shrink-0"
                        style={{
                            backgroundColor: `${getDifficultyColor(levelDifficulty)}18`,
                            color: getDifficultyColor(levelDifficulty),
                            border: `1px solid ${getDifficultyColor(levelDifficulty)}30`,
                        }}>
                        {levelDifficulty}
                    </span>
                </div>

                {/* Author */}
                <div className="flex items-center gap-1.5">
                    <User size={12} className="text-neutral-400" />
                    <span className="text-xs text-neutral-500">
                        {typeof level.author === "object" &&
                        level.author !== null
                            ? (level.author as any).username
                            : "Anonymous"}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                    <span className="inline-flex items-center justify-center gap-1 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[11px] text-neutral-600">
                        <Clock3 size={11} className="text-neutral-400" />
                        {formattedTime}
                    </span>
                    <span className="inline-flex items-center justify-center gap-1 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[11px] text-neutral-600">
                        <Boxes size={11} className="text-neutral-400" />
                        {totalVoxels} voxels
                    </span>
                </div>

                {/* Footer */}
                <div className="mt-auto flex items-center gap-2.5 pt-3 border-t border-neutral-100">
                    <button
                        onClick={handleCopyCode}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors cursor-pointer border border-neutral-200 min-h-9">
                        {copied ? <Check size={12} /> : <Copy size={12} />}
                        {level.code}
                    </button>

                    <div className="ml-auto flex items-center gap-2.5">
                        <span className="text-[11px] text-neutral-400 inline-flex items-center gap-1">
                            <Heart size={10} />
                            {level.favorites || 0}
                        </span>

                        <span className="text-[11px] text-neutral-400 inline-flex items-center gap-1">
                            <Download size={10} />
                            {level.downloads || 0}
                        </span>

                        <button
                            onClick={handleDownload}
                            className="h-9 w-9 inline-flex items-center justify-center text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer border border-neutral-200"
                            title="Download .cube file">
                            <Download size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
