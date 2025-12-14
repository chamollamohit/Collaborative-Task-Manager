import prisma from "../config/db";
import { CreateTaskDto, UpdateTaskDto } from "../dtos/task.dto";

export class TaskRepository {
    async create(data: CreateTaskDto, creatorId: number) {
        return await prisma.task.create({
            data: {
                ...data,
                creatorId,
            },
            include: {
                assignedTo: { select: { id: true, name: true, email: true } },
                creator: { select: { id: true, name: true } },
            },
        });
    }

    async findAll() {
        return await prisma.task.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                assignedTo: { select: { id: true, name: true } },
                creator: { select: { id: true, name: true } },
            },
        });
    }

    async findById(id: number) {
        return await prisma.task.findUnique({
            where: { id },
            include: {
                assignedTo: { select: { id: true, name: true } },
                creator: { select: { id: true, name: true } },
            },
        });
    }

    async update(id: number, data: UpdateTaskDto) {
        return await prisma.task.update({
            where: { id },
            data,
            include: { assignedTo: true },
        });
    }

    async delete(id: number) {
        return await prisma.task.delete({
            where: { id },
        });
    }
}
