import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { authenticate } from "../middlewares/auth.middleware";
import { UserRepository } from "../repositories/UserRepository";
import { UserService } from "../services/UserService";

const router = Router();
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.get("/", authenticate, userController.getAll);
router.put("/profile", authenticate, userController.updateProfile);

export default router;
