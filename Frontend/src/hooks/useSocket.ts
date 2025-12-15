import { useEffect } from "react";
import { io } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";

const SOCKET_URL =
    import.meta.env.VITE_API_URL?.replace("/api", "") ||
    "http://localhost:5000";

export const useSocket = () => {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();

    useEffect(() => {
        if (!user) return;

        const socket = io(SOCKET_URL, {
            withCredentials: true,
        });

        socket.on("connect", () => {
            console.log("✅ Connected to Socket.io");
        });

        // Listen for Events

        socket.on("task:created", (newTask) => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });

            if (newTask.assignedToId === user.id) {
                toast.success(
                    `You were assigned a new task: "${newTask.title}"`,
                    {
                        duration: 5000,
                        icon: "👋",
                    }
                );
            }
        });

        socket.on("task:updated", (updatedTask) => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });

            if (updatedTask.creatorId === user.id) {
                if (updatedTask.status === "COMPLETED") {
                    toast.success(
                        `Task "${updatedTask.title}" marked as Completed! 🎉`
                    );
                } else {
                    toast(`Task "${updatedTask.title}" updated`, {
                        icon: "📝",
                        duration: 3000,
                    });
                }
            }
        });

        socket.on("task:deleted", () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        });

        return () => {
            socket.disconnect();
        };
    }, [queryClient, user]);
};
