import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { updateProfileRequest } from "../api/user.api";

interface ProfileForm {
    name: string;
    email: string;
    password?: string;
    confirmPassword?: string;
}

export const Profile = () => {
    const navigate = useNavigate();
    const { user, setAuth } = useAuthStore();
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<ProfileForm>({
        defaultValues: {
            name: user?.name || "",
            email: user?.email || "",
            password: "",
            confirmPassword: "",
        },
    });

    const password = watch("password");

    const onSubmit = async (data: ProfileForm) => {
        setIsSaving(true);
        setMessage(null);

        const payload: { name?: string; password?: string } = {
            name: data.name,
        };
        if (data.password) {
            payload.password = data.password;
        }

        try {
            const res = await updateProfileRequest(payload);

            if (user) {
                setAuth({ ...user, name: res.data.data.name });
            }

            setMessage({
                type: "success",
                text: "Profile updated successfully!",
            });

            reset({
                name: res.data.data.name,
                email: user?.email,
                password: "",
                confirmPassword: "",
            });
        } catch (err: any) {
            const errorMsg =
                err.response?.data?.message || "Failed to update profile";
            setMessage({ type: "error", text: errorMsg });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-background p-6 flex justify-center items-start pt-10">
            <div className="w-full max-w-2xl bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
                {/* Header Banner */}
                <div className="bg-slate-100 p-6 border-b border-border flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-md">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-main">
                                {user?.name}
                            </h1>
                            <p className="text-sm text-muted">
                                Manage your account settings
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate("/")}
                        className="text-sm font-medium text-primary hover:underline"
                    >
                        &larr; Back to Board
                    </button>
                </div>

                <div className="p-8">
                    {/* Notification Message */}
                    {message && (
                        <div
                            className={`p-4 rounded-lg mb-6 flex items-center gap-3 text-sm font-medium animate-fade-in-down ${
                                message.type === "success"
                                    ? "bg-green-50 text-green-700 border border-green-200"
                                    : "bg-red-50 text-red-700 border border-red-200"
                            }`}
                        >
                            <span>
                                {message.type === "success" ? "✅" : "⚠️"}
                            </span>
                            {message.text}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        {/* Section 1: Personal Details */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-bold text-main border-b border-border pb-2">
                                Personal Details
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-muted mb-1.5">
                                        Email Address
                                    </label>
                                    <input
                                        {...register("email")}
                                        disabled
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed"
                                    />
                                    <p className="text-xs text-slate-400 mt-1">
                                        Email cannot be changed.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-main mb-1.5">
                                        Full Name
                                    </label>
                                    <input
                                        {...register("name", {
                                            required: "Name is required",
                                            minLength: 2,
                                        })}
                                        className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    />
                                    {errors.name && (
                                        <span className="text-red-500 text-xs mt-1 block">
                                            {errors.name.message}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Security */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-bold text-main border-b border-border pb-2">
                                Security
                            </h2>
                            <p className="text-sm text-muted">
                                Leave blank if you don't want to change your
                                password.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-main mb-1.5">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        {...register("password", {
                                            minLength: {
                                                value: 6,
                                                message:
                                                    "Must be at least 6 chars",
                                            },
                                        })}
                                        placeholder="••••••••"
                                        className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    />
                                    {errors.password && (
                                        <span className="text-red-500 text-xs mt-1 block">
                                            {errors.password.message}
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-main mb-1.5">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        {...register("confirmPassword", {
                                            validate: (val) => {
                                                if (!password) return true;
                                                return (
                                                    val === password ||
                                                    "Passwords do not match"
                                                );
                                            },
                                        })}
                                        placeholder="••••••••"
                                        className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    />
                                    {errors.confirmPassword && (
                                        <span className="text-red-500 text-xs mt-1 block">
                                            {errors.confirmPassword.message}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex justify-end pt-4 border-t border-border">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="bg-primary hover:bg-primary-hover text-black px-8 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-70 flex items-center gap-2 shadow-lg shadow-primary/20"
                            >
                                {isSaving ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Saving...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
