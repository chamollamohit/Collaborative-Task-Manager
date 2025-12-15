import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { RegisterSchema, LoginSchema } from "../dtos/auth.dto";
import { ApiResponse } from "../utils/ApiResponse";

export class AuthController {
    constructor(private authService: AuthService) {}

    register = async (req: Request, res: Response) => {
        // 1. Validate Input
        const validatedData = RegisterSchema.parse(req.body);

        // 2. Call Service
        const user = await this.authService.register(validatedData);

        // 3. Send Response
        res.status(201).json(
            new ApiResponse(201, user, "User registered successfully")
        );
    };

    login = async (req: Request, res: Response) => {
        // 1. Validate Input
        const validatedData = LoginSchema.parse(req.body);

        // 2. Call Service
        const { user, token } = await this.authService.login(validatedData);

        // 3. Set Secure Cookie (Mandatory Requirement)
        res.cookie("jwt", token, {
            httpOnly: true, //(XSS protection)
            maxAge: 24 * 60 * 60 * 1000, // 1 Day
            secure: true,
            sameSite: "none",
        });

        res.status(200).json(new ApiResponse(200, user, "Login successful"));
    };

    logout = async (req: Request, res: Response) => {
        // Clear the cookie
        res.clearCookie("jwt");
        res.status(200).json(new ApiResponse(200, {}, "Login successful"));
    };
}
