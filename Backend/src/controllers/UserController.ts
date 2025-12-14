import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { ApiResponse } from "../utils/ApiResponse";

export class UserController {
    constructor(private userService: UserService) {}

    getAll = async (req: Request, res: Response) => {
        const users = await this.userService.getAll();
        res.status(200).json(
            new ApiResponse(200, users, "Users fetched successfully")
        );
    };
    updateProfile = async (req: Request, res: Response) => {
        const userId = req.user!.id;
        const { name, password } = req.body;

        const updatedUser = await this.userService.update(userId, {
            name,
            password,
        });
        res.status(200).json(
            new ApiResponse(200, updatedUser, "Profile updated successfully")
        );
    };
}
