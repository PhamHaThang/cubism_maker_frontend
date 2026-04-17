import React from "react";
import { Box, ArrowRight, Layers, Download, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";

const HomePage: React.FC = () => {
    return (
        <div className="pb-8 md:pb-12">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-16">
                    <div className="relative rounded-[28px] border border-neutral-200/80 bg-white px-5 py-12 md:px-12 md:py-20">
                        <div className="max-w-2xl animate-fade-in">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-100 rounded-full text-xs font-semibold text-neutral-600 mb-5 md:mb-6 border border-neutral-200">
                                <Box size={12} />
                                Community-Driven Level Design
                            </div>
                            <h1 className="text-5xl md:text-7xl font-bold text-black leading-[1.02] tracking-tight">
                                Create. Share.
                                <br />
                                <span className="text-neutral-400">
                                    Play in VR.
                                </span>
                            </h1>
                            <p className="text-base md:text-lg text-neutral-500 mt-4 md:mt-5 max-w-xl leading-relaxed">
                                Design custom CubeCube VR levels in your
                                browser, publish them with a unique code, and
                                let players worldwide download them to their
                                headset.
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
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-10 md:mt-12 pt-7 md:pt-8 border-t border-neutral-100">
                            <div className="flex items-center gap-2.5 rounded-xl border border-neutral-100 bg-neutral-50/70 px-3 py-2">
                                <Layers
                                    size={16}
                                    className="text-neutral-400"
                                />
                                <span className="text-sm text-neutral-600">
                                    <strong className="text-black">3D</strong>{" "}
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
                                <Users size={16} className="text-neutral-400" />
                                <span className="text-sm text-neutral-600">
                                    <strong className="text-black">
                                        Community
                                    </strong>{" "}
                                    Hub
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Background decoration */}
                <div className="absolute top-10 right-10 w-64 h-64 bg-neutral-100 rounded-3xl rotate-12 -z-10 opacity-50" />
                <div className="absolute bottom-10 right-40 w-32 h-32 bg-neutral-50 rounded-2xl -rotate-6 -z-10" />
            </section>
        </div>
    );
};

export default HomePage;
