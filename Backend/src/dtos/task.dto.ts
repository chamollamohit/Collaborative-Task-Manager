import { z } from "zod";

const StatusEnum = z.enum(["TODO", "IN_PROGRESS", "REVIEW", "COMPLETED"]);
const PriorityEnum = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);

export const CreateTaskSchema = z.object({
    title: z.string().min(1, "Title is required").max(100),
    description: z.string().optional(),

    dueDate: z.string().datetime().optional(),

    status: StatusEnum.default("TODO"),
    priority: PriorityEnum.default("MEDIUM"),

    assignedToId: z.number().int().optional(),
});

// For updates, everything is optional
export const UpdateTaskSchema = CreateTaskSchema.partial();

export type CreateTaskDto = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskDto = z.infer<typeof UpdateTaskSchema>;
