import { Router } from "express";
import { loginUser, registerUser } from "../controllers/controller.user";
import { authenticateToken, logout } from "../../app/app.service";

const auth_router = Router();

auth_router.post("/login", loginUser);
auth_router.post("/register", registerUser);
auth_router.delete("/logout", authenticateToken, logout);

export default auth_router;
