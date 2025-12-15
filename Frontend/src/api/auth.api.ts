import type {
    ApiResponse,
    RegisterData,
    LoginData,
    User,
} from "../types/index";
import { api } from "./axios";

// Auth Requests
export const loginRequest = async (data: LoginData) => {
    return await api.post<ApiResponse<User>>("/auth/login", data);
};

export const registerRequest = async (data: RegisterData) => {
    return await api.post<ApiResponse<User>>("/auth/register", data);
};

export const logoutRequest = async () => {
    return await api.post<ApiResponse<{}>>("/auth/logout");
};

// We will use this later to check if user is still logged in on page refresh
export const getProfileRequest = async () => {};
