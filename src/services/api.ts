import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const buildApiUrl = (path: string): string => {
    if (/^https?:\/\//i.test(path)) {
        return path;
    }

    if (!API_BASE_URL) {
        return path;
    }

    const base = API_BASE_URL.replace(/\/+$/, "");
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${base}${normalizedPath}`;
};

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach auth token to every request
api.interceptors.request.use((config) => {
    const stored = localStorage.getItem("cubism-auth");
    if (stored) {
        try {
            const { state } = JSON.parse(stored);
            if (state?.token) {
                config.headers.Authorization = `Bearer ${state.token}`;
            }
        } catch {
            // ignore parse errors
        }
    }
    return config;
});

// Handle 401 responses globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const requestUrl = String(error.config?.url || "");
            const isAuthAttempt =
                requestUrl.includes("/api/auth/login") ||
                requestUrl.includes("/api/auth/register");

            if (isAuthAttempt) {
                return Promise.reject(error);
            }

            const stored = localStorage.getItem("cubism-auth");
            if (stored) {
                localStorage.removeItem("cubism-auth");
                if (
                    window.location.pathname !== "/login" &&
                    window.location.pathname !== "/register"
                ) {
                    window.location.href = "/login";
                }
            }
        }
        return Promise.reject(error);
    },
);

// Keep default export for backward compat with authStore
export default api;
