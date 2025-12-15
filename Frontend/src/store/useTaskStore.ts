import { create } from "zustand";
import type { Task } from "../types";

interface TaskState {
    tasks: Task[];
    setTasks: (tasks: Task[]) => void;
    addTask: (task: Task) => void;
    updateTask: (id: number, updatedData: Partial<Task>) => void;
    deleteTask: (id: number) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
    tasks: [],

    // Set All Task
    setTasks: (tasks) => set({ tasks }),

    // Add Task
    addTask: (task) =>
        set((state) => ({
            tasks: [task, ...state.tasks],
        })),

    // Update Task
    updateTask: (id, updatedData) =>
        set((state) => ({
            tasks: state.tasks.map((task) =>
                task.id === id ? { ...task, ...updatedData } : task
            ),
        })),

    // Delete Task
    deleteTask: (id) =>
        set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== id),
        })),
}));
