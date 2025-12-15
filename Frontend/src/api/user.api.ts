import { api } from "./axios";
import type { ApiResponse, User } from "../types";

export const getUsersRequest = async () => {
    return await api.get<ApiResponse<User[]>>("/users");
};

export const updateProfileRequest = async (data: {
    name?: string;
    password?: string;
}) => {
    return await api.put<ApiResponse<User>>("/users/profile", data);
};
