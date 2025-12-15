export interface User {
    id: number;
    name: string;
    email: string;
}

export interface Task {
    id: number;
    title: string;
    description?: string;
    status: "TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED";
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    dueDate?: string;
    createdAt: string;
    creatorId: number;
    assignedTo?: User;
}

export interface ApiResponse<T> {
    statusCode: number;
    data: T;
    message: string;
    success: boolean;
    errors?: any[];
}

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export interface CreateTaskData {
    title: string;
    description?: string;
    status?: "TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED";
    priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    dueDate?: string;
    assignedToId?: number;
}

export interface TaskCardProps {
    task: Task;
    onDelete: (id: number) => void;
    onStatusChange: (id: number, newStatus: Task["status"]) => void;
}
