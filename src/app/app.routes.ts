import { Router } from "express";
import comments_router from "../api/routes/route.comments";
import posts_router from "../api/routes/route.posts";
import auth_router from "../api/routes/route.users";
import { authenticateToken } from "./app.service";

const app_router = Router();

app_router.use("/auth", auth_router);

app_router.use("/posts", authenticateToken, posts_router);
app_router.use("/comments", authenticateToken, comments_router);

export default app_router;
