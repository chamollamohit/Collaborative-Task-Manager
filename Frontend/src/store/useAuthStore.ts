import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types";

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    setAuth: (user: User) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,

            // Call this when Login/Register succeeds
            setAuth: (user) => set({ user, isAuthenticated: true }),

            // Call this on Logout
            logout: () => set({ user: null, isAuthenticated: false }),
        }),
        {
            name: "auth-storage", // The key name in localStorage
        }
    )
);
