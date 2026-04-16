import React from "react";
import { Compass } from "lucide-react";
import { LevelGrid } from "../components/community/LevelGrid";

const BrowseLevelsPage: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
            <div className="mb-6 md:mb-7 rounded-2xl border border-neutral-200 bg-white/90 backdrop-blur-sm px-5 py-5 md:px-6 md:py-6">
                <div className="flex items-center gap-2 mb-1">
                    <Compass size={18} className="text-black" />
                    <h1 className="text-2xl font-bold tracking-tight text-black">
                        Browse Levels
                    </h1>
                </div>
                <p className="text-sm text-neutral-500">
                    Discover and download levels created by the community.
                </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white/75 p-3 md:p-4">
                <LevelGrid />
            </div>
        </div>
    );
};

export default BrowseLevelsPage;
