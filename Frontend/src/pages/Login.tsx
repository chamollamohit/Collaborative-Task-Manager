import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginRequest } from "../api/auth.api";
import { useAuthStore } from "../store/useAuthStore";

export const Login = () => {
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const response = await loginRequest(formData);

            setAuth(response.data.data);
            navigate("/");
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message || "Invalid credentials";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const inputClasses =
        "w-full px-3 py-2 rounded-lg border border-border bg-surface text-main focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md bg-surface p-8 rounded-xl shadow-lg border border-border">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-main">
                        Welcome Back
                    </h1>
                    <p className="text-muted mt-2">
                        Enter your credentials to access your tasks
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-main">
                            Email Address
                        </label>
                        <input
                            name="email"
                            type="email"
                            required
                            className={inputClasses}
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-main">
                            Password
                        </label>
                        <input
                            name="password"
                            type="password"
                            required
                            className={inputClasses}
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full px-4 py-2 rounded-lg font-medium bg-primary hover:bg-primary-hover text-black shadow-sm shadow-primary/30 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                    >
                        {isLoading ? (
                            <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-muted">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="text-primary hover:underline font-medium"
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};
