import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Box } from "lucide-react";
import toast from "react-hot-toast";

export const LoginForm: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, isLoading } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
            toast.success("Welcome back!");
            navigate("/");
        } catch (error: any) {
            toast.error(error.message || "Login failed");
        }
    };

    return (
        <div className="min-h-[calc(100vh-5.25rem)] md:min-h-[calc(100vh-6.5rem)] flex items-center justify-center px-4 py-6 md:py-8">
            <div className="w-full max-w-md animate-fade-in rounded-3xl border border-neutral-200 bg-white/85 backdrop-blur-sm shadow-[0_28px_60px_-45px_rgba(0,0,0,0.9)] p-5 md:p-8">
                {/* Header */}
                <div className="text-center mb-6 md:mb-7">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-black rounded-2xl mb-4 shadow-sm">
                        <Box size={24} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-black tracking-tight">
                        Welcome back
                    </h1>
                    <p className="text-sm text-neutral-500 mt-1.5">
                        Sign in to your Cubism Maker account
                    </p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-3.5 md:space-y-4">
                    <Input
                        label="Email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="w-full"
                        isLoading={isLoading}>
                        Sign In
                    </Button>
                </form>

                {/* Footer */}
                <p className="text-center text-xs text-neutral-500 mt-6 md:mt-7">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="text-black font-medium hover:underline">
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
};
