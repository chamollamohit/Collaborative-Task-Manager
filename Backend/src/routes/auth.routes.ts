import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { AuthService } from "../services/AuthService";
import { UserRepository } from "../repositories/UserRepository";

const router = Router();

// --- Dependency Injection ---

// 1. Create the Repository (The Database Access)
const userRepo = new UserRepository();

// 2. Inject Repository into Service (The Logic)
const authService = new AuthService(userRepo);

// 3. Inject Service into Controller (The HTTP Handler)
const authController = new AuthController(authService);

// --- Routes ---
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

export default router;
