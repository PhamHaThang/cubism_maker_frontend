import React from "react";
import { Link } from "react-router-dom";
import { Box } from "lucide-react";

export const Footer: React.FC = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="mt-auto border-t border-neutral-200 bg-white">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-12">
                <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr_1fr] gap-10 md:gap-12">
                    <div>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2.5 group">
                            <Box
                                size={18}
                                className="text-black group-hover:rotate-12 transition-transform duration-150"
                            />
                            <span className="text-xs font-bold tracking-[0.08em] text-black">
                                CUBECUBE MAKER
                            </span>
                        </Link>
                        <p className="mt-4 text-sm text-neutral-500 max-w-sm leading-relaxed">
                            Design CubeCube VR puzzle levels in the browser,
                            publish with a unique code, and share with players
                            worldwide.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400 mb-4">
                            Explore
                        </h3>
                        <ul className="space-y-2.5">
                            <li>
                                <Link
                                    to="/"
                                    className="text-sm text-neutral-600 hover:text-black transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/levels"
                                    className="text-sm text-neutral-600 hover:text-black transition-colors">
                                    Browse Levels
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/editor"
                                    className="text-sm text-neutral-600 hover:text-black transition-colors">
                                    Editor
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400 mb-4">
                            Account
                        </h3>
                        <ul className="space-y-2.5">
                            <li>
                                <Link
                                    to="/login"
                                    className="text-sm text-neutral-600 hover:text-black transition-colors">
                                    Sign In
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/register"
                                    className="text-sm text-neutral-600 hover:text-black transition-colors">
                                    Sign Up
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/my-levels"
                                    className="text-sm text-neutral-600 hover:text-black transition-colors">
                                    My Levels
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/favorites"
                                    className="text-sm text-neutral-600 hover:text-black transition-colors">
                                    Favorites
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <p className="text-xs text-neutral-400">
                        © {year} CubeCube Maker. All rights reserved.
                    </p>
                    <p className="text-xs text-neutral-400">
                        Built for CubeCube VR · .cube format
                    </p>
                </div>
            </div>
        </footer>
    );
};
