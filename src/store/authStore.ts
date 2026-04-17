import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../services/api";
import { User } from "../types";

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (
        username: string,
        email: string,
        password: string,
    ) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isLoading: false,

            login: async (email, password) => {
                set({ isLoading: true });
                try {
                    const { data } = await api.post("/api/auth/login", {
                        email,
                        password,
                    });
                    set({
                        user: data.user,
                        token: data.token,
                        isLoading: false,
                    });
                } catch (error: any) {
                    set({ isLoading: false });
                    throw new Error(
                        error.response?.data?.message || "Login failed",
                    );
                }
            },

            register: async (username, email, password) => {
                set({ isLoading: true });
                try {
                    const { data } = await api.post("/api/auth/register", {
                        username,
                        email,
                        password,
                    });
                    set({
                        user: data.user,
                        token: data.token,
                        isLoading: false,
                    });
                } catch (error: any) {
                    set({ isLoading: false });
                    throw new Error(
                        error.response?.data?.message || "Registration failed",
                    );
                }
            },

            logout: () => {
                set({ user: null, token: null });
            },

            checkAuth: async () => {
                const token = get().token;
                if (!token) return;

                try {
                    const { data } = await api.get("/api/auth/me");
                    set({ user: data.user });
                } catch {
                    set({ user: null, token: null });
                }
            },
        }),
        {
            name: "CubeCube-auth",
            partialize: (state) => ({ token: state.token, user: state.user }),
        },
    ),
);
