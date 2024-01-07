import { Router } from "express";
import {
  createPost,
  deletePost,
  findPost,
  getPosts,
  updatePost,
} from "../controllers/controller.posts";

const posts_router = Router();

posts_router.get("/", getPosts);
posts_router.get("/find/:post_id", findPost);

posts_router.post("/create", createPost);
posts_router.put("/update/:post_id", updatePost);
posts_router.delete("/delete/:post_id", deletePost);

export default posts_router;
