import axios from "axios";

export const api = axios.create({
    baseURL: "",
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
