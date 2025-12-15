import { api } from "./axios";
import type { ApiResponse, CreateTaskData, Task } from "../types";

export const getTasksRequest = async () => {
    return await api.get<ApiResponse<Task[]>>("/tasks");
};

export const createTaskRequest = async (data: CreateTaskData) => {
    return await api.post<ApiResponse<Task>>("/tasks", data);
};

export const updateTaskRequest = async (
    id: number,
    data: Partial<CreateTaskData>
) => {
    return await api.put<ApiResponse<Task>>(`/tasks/${id}`, data);
};

export const deleteTaskRequest = async (id: number) => {
    return await api.delete<ApiResponse<{}>>(`/tasks/${id}`);
};
