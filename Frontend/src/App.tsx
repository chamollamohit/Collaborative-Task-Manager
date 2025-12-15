import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore"; // 👈 Import Store
import { Toaster } from "react-hot-toast";

import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { Profile } from "./pages/Profile";

function App() {
    // 1. Get the real auth status from Zustand
    const { isAuthenticated } = useAuthStore();

    return (
        <>
            <Toaster position="top-right" />
            <BrowserRouter>
                <Routes>
                    {/* Public Routes - If logged in, redirect to Dashboard */}
                    <Route
                        path="/login"
                        element={
                            !isAuthenticated ? <Login /> : <Navigate to="/" />
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            !isAuthenticated ? (
                                <Register />
                            ) : (
                                <Navigate to="/" />
                            )
                        }
                    />

                    {/* Protected Routes - If NOT logged in, redirect to Login */}
                    <Route
                        path="/"
                        element={
                            isAuthenticated ? (
                                <Dashboard />
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            isAuthenticated ? (
                                <Profile />
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    />

                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
