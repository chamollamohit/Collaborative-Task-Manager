import { Router } from "express";
import { TaskController } from "../controllers/TaskController";
import { TaskService } from "../services/TaskService";
import { TaskRepository } from "../repositories/TaskRepository";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// --- Dependency Injection ---

const taskRepo = new TaskRepository();
const taskService = new TaskService(taskRepo);
const taskController = new TaskController(taskService);

// --- Apply Auth Middleware ---
// All the Routes require a valid JWT cookie
router.use(authenticate);

// --- Routes ---
router.post("/", taskController.create); // POST /api/tasks
router.get("/", taskController.getAll); // GET /api/tasks
router.get("/:id", taskController.getOne); // GET /api/tasks/:id
router.put("/:id", taskController.update); // PUT /api/tasks/:id
router.delete("/:id", taskController.delete); // DELETE /api/tasks/:id

export default router;
