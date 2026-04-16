import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Box, Heart, LogOut, User } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useEditorStore } from "../../store/editorStore";
import { Button } from "../ui/Button";

export const Navbar: React.FC = () => {
    const { user, logout } = useAuthStore();
    const { clearEditorState } = useEditorStore();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <header className="sticky top-0 z-40 px-3 pt-3 md:px-6 md:pt-4">
            <div className="max-w-7xl mx-auto px-3 py-2.5 md:px-5 md:py-3 glass-surface rounded-2xl shadow-[0_10px_30px_-20px_rgba(0,0,0,0.7)]">
                <div className="h-10 md:h-10 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <Box
                            size={19}
                            className="text-black group-hover:rotate-12 transition-transform duration-150"
                        />
                        <span className="text-xs sm:text-sm font-bold tracking-[0.08em] text-black">
                            CUBISM MAKER
                        </span>
                    </Link>

                    {/* Nav Links */}
                    <nav className="hidden md:flex items-center gap-1.5">
                        <Link
                            to="/"
                            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all duration-150 ease-in-out ${
                                isActive("/")
                                    ? "bg-black text-white shadow-sm"
                                    : "text-neutral-600 hover:text-black hover:bg-neutral-100 hover:-translate-y-[1px]"
                            }`}>
                            Home
                        </Link>
                        <Link
                            to="/levels"
                            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all duration-150 ease-in-out ${
                                isActive("/levels")
                                    ? "bg-black text-white shadow-sm"
                                    : "text-neutral-600 hover:text-black hover:bg-neutral-100 hover:-translate-y-[1px]"
                            }`}>
                            Browse Levels
                        </Link>
                        <Link
                            to="/editor"
                            onClick={clearEditorState}
                            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all duration-150 ease-in-out ${
                                isActive("/editor")
                                    ? "bg-black text-white shadow-sm"
                                    : "text-neutral-600 hover:text-black hover:bg-neutral-100 hover:-translate-y-[1px]"
                            }`}>
                            Editor
                        </Link>
                        {user && (
                            <Link
                                to="/my-levels"
                                className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all duration-150 ease-in-out ${
                                    isActive("/my-levels")
                                        ? "bg-black text-white shadow-sm"
                                        : "text-neutral-600 hover:text-black hover:bg-neutral-100 hover:-translate-y-[1px]"
                                }`}>
                                My Levels
                            </Link>
                        )}
                    </nav>

                    {/* Auth */}
                    <div className="flex items-center gap-2">
                        {user ? (
                            <div className="flex items-center gap-3">
                                <Link
                                    to="/favorites"
                                    className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                                        isActive("/favorites")
                                            ? "border-black bg-black text-white"
                                            : "border-neutral-200 text-neutral-500 hover:text-black hover:bg-neutral-100"
                                    }`}
                                    title="Favorites">
                                    <Heart size={15} />
                                </Link>
                                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-neutral-50 rounded-xl border border-neutral-200">
                                    <User
                                        size={14}
                                        className="text-neutral-500"
                                    />
                                    <span className="text-xs font-medium text-neutral-700">
                                        {user.username}
                                    </span>
                                </div>
                                <button
                                    onClick={logout}
                                    className="p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                                    title="Logout">
                                    <LogOut size={16} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/login">
                                    <Button variant="ghost" size="sm">
                                        Sign In
                                    </Button>
                                </Link>
                                <Link to="/register">
                                    <Button variant="primary" size="sm">
                                        Sign Up
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                <nav
                    className={`md:hidden mt-2 grid gap-2 ${
                        user ? "grid-cols-4" : "grid-cols-3"
                    }`}>
                    <Link
                        to="/"
                        className={`px-3 py-2 text-[11px] text-center font-semibold rounded-xl transition-all duration-150 ease-in-out ${
                            isActive("/")
                                ? "bg-black text-white shadow-sm"
                                : "text-neutral-600 bg-white hover:text-black hover:bg-neutral-100 border border-neutral-200"
                        }`}>
                        Home
                    </Link>
                    <Link
                        to="/levels"
                        className={`px-3 py-2 text-[11px] text-center font-semibold rounded-xl transition-all duration-150 ease-in-out ${
                            isActive("/levels")
                                ? "bg-black text-white shadow-sm"
                                : "text-neutral-600 bg-white hover:text-black hover:bg-neutral-100 border border-neutral-200"
                        }`}>
                        Browse
                    </Link>
                    <Link
                        to="/editor"
                        onClick={clearEditorState}
                        className={`px-3 py-2 text-[11px] text-center font-semibold rounded-xl transition-all duration-150 ease-in-out ${
                            isActive("/editor")
                                ? "bg-black text-white shadow-sm"
                                : "text-neutral-600 bg-white hover:text-black hover:bg-neutral-100 border border-neutral-200"
                        }`}>
                        Editor
                    </Link>
                    {user && (
                        <Link
                            to="/my-levels"
                            className={` px-3 py-2 text-[11px] text-center font-semibold rounded-xl transition-all duration-150 ease-in-out ${
                                isActive("/my-levels")
                                    ? "bg-black text-white shadow-sm"
                                    : "text-neutral-600 bg-white hover:text-black hover:bg-neutral-100 border border-neutral-200"
                            }`}>
                            My Levels
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
};
