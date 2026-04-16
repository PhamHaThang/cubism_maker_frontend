import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Box } from "lucide-react";
import toast from "react-hot-toast";

export const RegisterForm: React.FC = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { register, isLoading } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        try {
            await register(username, email, password);
            toast.success("Account created successfully!");
            navigate("/");
        } catch (error: any) {
            toast.error(error.message || "Registration failed");
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
                        Create account
                    </h1>
                    <p className="text-sm text-neutral-500 mt-1.5">
                        Join the Cubism Maker community
                    </p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-3.5 md:space-y-4">
                    <Input
                        label="Username"
                        type="text"
                        placeholder="cubism_creator"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        minLength={3}
                        maxLength={20}
                        required
                    />
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
                        minLength={6}
                        required
                    />
                    <Input
                        label="Confirm Password"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="w-full"
                        isLoading={isLoading}>
                        Create Account
                    </Button>
                </form>

                {/* Footer */}
                <p className="text-center text-xs text-neutral-500 mt-6 md:mt-7">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-black font-medium hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};
