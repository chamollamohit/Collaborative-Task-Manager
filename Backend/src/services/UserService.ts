import bcrypt from "bcrypt";
import { UserRepository } from "../repositories/UserRepository";
import { ApiError } from "../utils/ApiError";

export class UserService {
    constructor(private userRepository: UserRepository) {}

    async getAll() {
        return await this.userRepository.findAll();
    }

    async update(userId: number, data: { name?: string; password?: string }) {
        if (!data.name && !data.password) {
            throw new ApiError(
                400,
                "Please provide a name or password to update"
            );
        }

        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not Exist");
        }
        const updateData: any = {};

        if (data.name) {
            updateData.name = data.name;
        }

        if (data.password) {
            if (data.password.length < 6) {
                throw new ApiError(
                    400,
                    "Password must be at least 6 characters"
                );
            }
            updateData.password = await bcrypt.hash(data.password, 10);
        }

        return await this.userRepository.update(userId, updateData);
    }
}
