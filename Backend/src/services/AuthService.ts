import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/UserRepository";
import { RegisterDto, LoginDto } from "../dtos/auth.dto";
import { ApiError } from "../utils/ApiError";

export class AuthService {
    // We inject the Repository so the Service can talk to the DB
    constructor(private userRepo: UserRepository) {}

    async register(data: RegisterDto) {
        // 1. Logic: Check if user already exists
        const existingUser = await this.userRepo.findByEmail(data.email);
        if (existingUser) {
            throw new ApiError(409, "User with this email already exists");
        }

        // 2. Logic: Hash the password (Security Best Practice)
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        // 3. Action: Save to Database
        const newUser = await this.userRepo.create({
            ...data,
            password: hashedPassword,
        });

        // 4. Cleanup: Remove password before returning
        const { password, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    }

    async login(data: LoginDto) {
        // 1. Logic: Find user
        const user = await this.userRepo.findByEmail(data.email);
        if (!user) {
            throw new ApiError(401, "Invalid email or password");
        }

        // 2. Logic: Compare passwords
        const isMatch = await bcrypt.compare(data.password, user.password);
        if (!isMatch) {
            throw new ApiError(401, "Invalid email or password");
        }

        // 3. Logic: Generate JWT Token
        const secret = process.env.JWT_SECRET!;

        const token = jwt.sign(
            { id: user.id, email: user.email },
            secret,
            { expiresIn: "1d" } // Token expires in 1 day
        );

        const { password, ...userWithoutPassword } = user;

        // Return both the User info and the Token
        return { user: userWithoutPassword, token };
    }
}
