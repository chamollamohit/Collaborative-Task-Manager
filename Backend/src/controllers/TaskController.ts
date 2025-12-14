import { Request, Response } from "express";
import { TaskService } from "../services/TaskService";
import { CreateTaskSchema, UpdateTaskSchema } from "../dtos/task.dto";
import { ApiResponse } from "../utils/ApiResponse";
import { socketService } from "../services/SocketService";

export class TaskController {
    constructor(private taskService: TaskService) {}

    create = async (req: Request, res: Response) => {
        // 1. Validate Input
        const validatedData = CreateTaskSchema.parse(req.body);

        // 2. Get User ID from the Auth Middleware (req.user)
        const userId = req.user!.id;

        // 3. Call Service
        const task = await this.taskService.create(userId, validatedData);

        // 4. Socket Io to update
        socketService.emit("task:created", task);

        res.status(201).json(
            new ApiResponse(201, task, "Task created successfully")
        );
    };

    getAll = async (req: Request, res: Response) => {
        const tasks = await this.taskService.getAll();
        res.status(200).json(new ApiResponse(200, tasks, "Fetched All Tasks"));
    };

    getOne = async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const task = await this.taskService.getById(id);
        res.status(200).json(new ApiResponse(200, task, "Fetched Task"));
    };

    update = async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const validatedData = UpdateTaskSchema.parse(req.body);

        const updatedTask = await this.taskService.update(id, validatedData);

        socketService.emit("task:updated", updatedTask);

        res.status(200).json(
            new ApiResponse(200, updatedTask, "Task updated successfully")
        );
    };

    delete = async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        await this.taskService.delete(id);
        socketService.emit("task:deleted", { id });
        res.status(200).json(
            new ApiResponse(200, {}, "Task deleted successfully")
        );
    };
}
