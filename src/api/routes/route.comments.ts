import { Router } from "express";
import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from "../controllers/controller.comments";

const comments_router = Router();

comments_router.get("/:post_id", getComments);

comments_router.post("/create", createComment);
comments_router.put("/update/:comment_id", updateComment);
comments_router.delete("/delete/:comment_id", deleteComment);

export default comments_router;
