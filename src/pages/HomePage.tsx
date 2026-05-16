import React, { useEffect, useMemo, useState } from "react";
import {
    Box,
    ArrowRight,
    Layers,
    Download,
    Users,
    Sparkles,
    Palette,
    Globe,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { api } from "../services/api";
import { Level } from "../types";
import { LevelPreview3D } from "../components/community/LevelPreview3D";

const HomePage: React.FC = () => {
    const [levels, setLevels] = useState<Level[]>([]);
    const [loadingLevels, setLoadingLevels] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchLevels = async () => {
            setLoadingLevels(true);
            try {
                const res = await api.get("/api/levels", {
                    params: { sort: "newest", limit: 7 },
                });
                if (!isMounted) return;
                setLevels(res.data.levels ?? []);
            } catch {
                if (!isMounted) return;
                setLevels([]);
            } finally {
                if (!isMounted) return;
                setLoadingLevels(false);
            }
        };

        fetchLevels();
        return () => {
            isMounted = false;
        };
    }, []);

    const liveLevels = useMemo(() => levels.slice(0, 4), [levels]);
    const recentLevels = useMemo(() => levels.slice(0, 3), [levels]);
    const latestDrop = liveLevels[0];

    return (
        <div className="pb-12 md:pb-16">
            {/* Hero */}
            <section className="relative border-b border-neutral-100 bg-neutral-50/40">
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-center">
                            <div className="animate-fade-in">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-neutral-600 border border-neutral-200 bg-neutral-100/80 mb-5">
                                    <Sparkles size={12} />
                                    Build bold VR puzzles in minutes
                                </div>
                                <h1 className="text-5xl md:text-7xl font-bold text-black leading-[1.02] tracking-tight font-['Space_Grotesk']">
                                    Design. Launch.
                                    <br />
                                    <span className="text-neutral-400">
                                        Play in VR.
                                    </span>
                                </h1>
                                <p className="text-base md:text-lg text-neutral-500 mt-4 md:mt-5 max-w-xl leading-relaxed">
                                    Craft CubeCube VR levels right in the
                                    browser, publish with a unique code, and
                                    share with players across the globe in
                                    seconds.
                                </p>
                                <div className="flex flex-wrap items-center gap-3 mt-7 md:mt-9">
                                    <Link to="/editor">
                                        <Button variant="primary" size="lg">
                                            Open Editor
                                            <ArrowRight size={16} />
                                        </Button>
                                    </Link>
                                    <Link to="/levels">
                                        <Button variant="secondary" size="lg">
                                            Browse Levels
                                        </Button>
                                    </Link>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-9 pt-7 border-t border-neutral-100">
                                    <div className="flex items-center gap-2.5 rounded-xl border border-neutral-100 bg-neutral-50/70 px-3 py-2">
                                        <Layers
                                            size={16}
                                            className="text-neutral-400"
                                        />
                                        <span className="text-sm text-neutral-600">
                                            <strong className="text-black">
                                                3D
                                            </strong>{" "}
                                            Voxel Editor
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2.5 rounded-xl border border-neutral-100 bg-neutral-50/70 px-3 py-2">
                                        <Download
                                            size={16}
                                            className="text-neutral-400"
                                        />
                                        <span className="text-sm text-neutral-600">
                                            <strong className="text-black">
                                                .cube
                                            </strong>{" "}
                                            VR Format
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2.5 rounded-xl border border-neutral-100 bg-neutral-50/70 px-3 py-2">
                                        <Users
                                            size={16}
                                            className="text-neutral-400"
                                        />
                                        <span className="text-sm text-neutral-600">
                                            <strong className="text-black">
                                                Global
                                            </strong>{" "}
                                            Community
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="rounded-2xl border border-neutral-200 bg-white p-5 md:p-6 shadow-[0_35px_80px_-55px_rgba(0,0,0,0.6)]">
                                    <div className="relative z-10 flex items-center justify-between mb-5">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-black text-white shadow-sm">
                                            <Box
                                                size={12}
                                                className="text-white"
                                            />
                                            Live Build
                                        </div>
                                        <span className="text-[11px] text-neutral-500">
                                            Preview
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {loadingLevels
                                            ? Array.from({ length: 4 }).map(
                                                  (_, idx) => (
                                                      <div
                                                          key={`skeleton-${idx}`}
                                                          className="rounded-2xl border border-neutral-200 bg-white p-3">
                                                          <div className="h-3 w-24 rounded-full bg-neutral-100" />
                                                          <div className="mt-2 h-16 rounded-xl bg-neutral-100" />
                                                          <div className="mt-2 h-2 w-16 rounded-full bg-neutral-100" />
                                                      </div>
                                                  ),
                                              )
                                            : liveLevels.map((level, idx) => (
                                                  <div
                                                      key={level._id}
                                                      className="rounded-2xl border border-neutral-200 bg-white p-3">
                                                      <div className="text-xs font-semibold text-neutral-700 truncate">
                                                          {level.meta?.name ||
                                                              "Untitled Level"}
                                                      </div>
                                                      <div className="mt-2 h-16 rounded-xl border border-neutral-200 bg-neutral-50 overflow-hidden relative">
                                                          <LevelPreview3D
                                                              level={level}
                                                          />
                                                      </div>
                                                      <div className="mt-2 text-[10px] text-neutral-400">
                                                          Code: {level.code}
                                                      </div>
                                                  </div>
                                              ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
            </section>

            {/* Highlights */}
            <section className="py-10 md:py-14">
                <div className="max-w-6xl mx-auto px-4 md:px-6">
                    <div className="flex items-center justify-between gap-4 mb-8">
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">
                                Why builders stay
                            </p>
                            <h2 className="text-3xl md:text-4xl font-bold text-black font-['Space_Grotesk']">
                                Design, deploy, repeat.
                            </h2>
                        </div>
                        <div className="hidden md:flex items-center gap-2 text-xs text-neutral-500">
                            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                            Live updates for the VR app sync
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                            <Palette size={18} className="text-neutral-500" />
                            <h3 className="mt-4 text-lg font-semibold text-black">
                                Fast creative flow
                            </h3>
                            <p className="mt-2 text-sm text-neutral-500">
                                Sculpt and refine puzzle geometry without
                                leaving the browser.
                            </p>
                        </div>
                        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                            <Layers size={18} className="text-neutral-500" />
                            <h3 className="mt-4 text-lg font-semibold text-black">
                                Smart voxel tooling
                            </h3>
                            <p className="mt-2 text-sm text-neutral-500">
                                Build consistent challenges with precise grids,
                                pieces, and rules.
                            </p>
                        </div>
                        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                            <Globe size={18} className="text-neutral-500" />
                            <h3 className="mt-4 text-lg font-semibold text-black">
                                Share instantly
                            </h3>
                            <p className="mt-2 text-sm text-neutral-500">
                                Publish once and let the community download via
                                a single code.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Steps */}
            <section className="py-10 md:py-14">
                <div className="max-w-6xl mx-auto px-4 md:px-6">
                    <div className="rounded-[28px] border border-neutral-200 bg-neutral-50/70 px-5 py-8 md:px-8 md:py-10">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">
                                    How it works
                                </p>
                                <h2 className="text-3xl md:text-4xl font-bold text-black font-['Space_Grotesk']">
                                    Three steps to ship.
                                </h2>
                            </div>
                            <Link to="/editor">
                                <Button variant="primary">
                                    Start building
                                </Button>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                            {[
                                {
                                    step: "01",
                                    title: "Block out the puzzle",
                                    text: "Shape your voxel grid and drop in core pieces.",
                                },
                                {
                                    step: "02",
                                    title: "Tune the challenge",
                                    text: "Adjust time limits, difficulty, and layout flow.",
                                },
                                {
                                    step: "03",
                                    title: "Publish to VR",
                                    text: "Generate a code and distribute it in seconds.",
                                },
                            ].map((item) => (
                                <div
                                    key={item.step}
                                    className="rounded-2xl border border-neutral-200 bg-white p-5">
                                    <span className="text-xs font-semibold text-neutral-400">
                                        {item.step}
                                    </span>
                                    <h3 className="mt-3 text-lg font-semibold text-black">
                                        {item.title}
                                    </h3>
                                    <p className="mt-2 text-sm text-neutral-500">
                                        {item.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Community spotlight */}
            <section className="py-10 md:py-14">
                <div className="max-w-6xl mx-auto px-4 md:px-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">
                                Community spotlight
                            </p>
                            <h2 className="text-3xl md:text-4xl font-bold text-black font-['Space_Grotesk']">
                                Recent launches
                            </h2>
                        </div>
                        <Link to="/levels">
                            <Button variant="secondary">View all levels</Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {loadingLevels
                            ? Array.from({ length: 3 }).map((_, idx) => (
                                  <div
                                      key={`recent-skeleton-${idx}`}
                                      className="rounded-2xl border border-neutral-200 bg-white p-5">
                                      <div className="h-4 w-20 rounded-full bg-neutral-100" />
                                      <div className="mt-4 h-4 w-28 rounded-full bg-neutral-100" />
                                      <div className="mt-2 h-3 w-24 rounded-full bg-neutral-100" />
                                      <div className="mt-5 h-24 rounded-2xl bg-neutral-100" />
                                  </div>
                              ))
                            : recentLevels.map((level, idx) => (
                                  <div
                                      key={level._id}
                                      className="rounded-2xl border border-neutral-200 bg-white p-5">
                                      <div className="flex items-center justify-between">
                                          <span className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-600">
                                              {level.meta?.difficulty ||
                                                  "medium"}
                                          </span>
                                          <span className="text-[10px] text-neutral-400">
                                              {(
                                                  level.downloads || 0
                                              ).toLocaleString()}{" "}
                                              downloads
                                          </span>
                                      </div>
                                      <h3 className="mt-4 text-lg font-semibold text-black">
                                          {level.meta?.name || "Untitled Level"}
                                      </h3>
                                      <p className="mt-2 text-sm text-neutral-500">
                                          Built by{" "}
                                          {typeof level.author === "object" &&
                                          level.author
                                              ? (level.author as any).username
                                              : "Anonymous"}
                                      </p>
                                      <div className="mt-5 h-24 rounded-2xl border border-neutral-200 bg-neutral-50 overflow-hidden relative">
                                          <LevelPreview3D level={level} />
                                      </div>
                                  </div>
                              ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-10 md:py-14">
                <div className="max-w-6xl mx-auto px-4 md:px-6">
                    <div className="rounded-[28px] border border-neutral-200 bg-black px-6 py-10 md:px-10 md:py-12 text-white">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                                    Ready to ship
                                </p>
                                <h2 className="text-3xl md:text-4xl font-bold font-['Space_Grotesk']">
                                    Build your next VR challenge today.
                                </h2>
                                <p className="mt-3 text-sm text-white/70 max-w-xl">
                                    Jump into the editor, publish a code, and
                                    invite the world to play.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Link to="/editor">
                                    <Button variant="primary" size="lg">
                                        Open Editor
                                        <ArrowRight size={16} />
                                    </Button>
                                </Link>
                                <Link to="/levels">
                                    <Button variant="secondary" size="lg">
                                        Browse Levels
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
