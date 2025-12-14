import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";

export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // 1. Get the token from the cookie
    const token = req.cookies.jwt;

    if (!token) {
        throw new ApiError(401, "Access denied. Please log in.");
    }

    try {
        // 2. Verify the token signature
        const secret = process.env.JWT_SECRET!;
        const decoded = jwt.verify(token, secret);

        // 3. Attach user info to the request object
        req.user = decoded as { id: number; email: string };

        // 4. Move to the next function (The Controller)
        next();
    } catch (error) {
        throw new ApiError(401, "Invalid or expired token");
    }
};
