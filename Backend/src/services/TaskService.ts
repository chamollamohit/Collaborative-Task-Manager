import { TaskRepository } from "../repositories/TaskRepository";
import { CreateTaskDto, UpdateTaskDto } from "../dtos/task.dto";
import { ApiError } from "../utils/ApiError";

export class TaskService {
    constructor(private taskRepo: TaskRepository) {}

    async create(userId: number, data: CreateTaskDto) {
        return await this.taskRepo.create(data, userId);
    }

    async getAll() {
        return await this.taskRepo.findAll();
    }

    async getById(id: number) {
        const task = await this.taskRepo.findById(id);
        if (!task) {
            throw new ApiError(404, "Task not found");
        }
        return task;
    }

    async update(id: number, data: UpdateTaskDto) {
        // 1. Check if task exists
        const existingTask = await this.taskRepo.findById(id);
        if (!existingTask) {
            throw new ApiError(404, "Task not found");
        }

        // 2. Perform Update
        return await this.taskRepo.update(id, data);
    }

    async delete(id: number) {
        // 1. Check if task exists
        const existingTask = await this.taskRepo.findById(id);
        if (!existingTask) {
            throw new ApiError(404, "Task not found");
        }

        // 2. Perform Delete
        return await this.taskRepo.delete(id);
    }
}
