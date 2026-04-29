import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Layout } from "./components/layout/Layout";
import { useAuthStore } from "./store/authStore";

import HomePage from "./pages/HomePage";
import BrowseLevelsPage from "./pages/BrowseLevelsPage";
import EditorPage from "./pages/EditorPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import FavoritesPage from "./pages/FavoritesPage";
import MyLevelsPage from "./pages/MyLevelsPage";

const App: React.FC = () => {
    const { checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return (
        <BrowserRouter>
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: "#000",
                        color: "#fff",
                        fontSize: "13px",
                        borderRadius: "10px",
                        padding: "10px 16px",
                    },
                }}
            />
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/levels" element={<BrowseLevelsPage />} />
                    <Route path="/editor" element={<EditorPage />} />
                    <Route path="/admin/editor" element={<Navigate to="/editor" replace />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
                    <Route path="/my-levels" element={<MyLevelsPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
