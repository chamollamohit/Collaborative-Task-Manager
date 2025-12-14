import prisma from "../config/db";
import { RegisterDto } from "../dtos/auth.dto";

export class UserRepository {
    // Check if a user exists by email
    async findByEmail(email: string) {
        return await prisma.user.findUnique({
            where: { email },
        });
    }

    // Create a new user
    async create(data: RegisterDto) {
        return await prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                password: data.password,
            },
        });
    }

    // Fetch All User
    async findAll() {
        return await prisma.user.findMany({
            select: { id: true, name: true, email: true },
        });
    }

    // Update User
    async update(id: number, data: any) {
        return await prisma.user.update({
            where: { id },
            data,
            select: { id: true, name: true, email: true },
        });
    }

    // Find by ID
    async findById(id: number) {
        return await prisma.user.findUnique({
            where: { id },
        });
    }
}
