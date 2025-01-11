import { Router } from "express";
import UserController from "./controllers/UserController";
import UserService from "./services/UserService";
import AuthService from "./services/AuthService";
import EncryptService from "./services/EncryptService";
import AuthController from "./controllers/AuthController";
import { userMiddleware } from "./middlewares/userMiddleware";


export default function createAPI(): Router {
    const router = Router()

    const encryptService = new EncryptService()
    const authService = new AuthService(encryptService)
    const userService = new UserService(authService)

    const userController = new UserController(userService)
    const authController = new AuthController(authService, userService)

    router.use(userMiddleware(authService, userService))

    router.use("/user", userController.router)
    router.use("/auth", authController.router)

    return router
}