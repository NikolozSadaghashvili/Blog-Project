import express from "express";
import {
  createPost,
  deletePost,
  getMyPosts,
  getPosts,
  getSinglePost,
  likePost,
  updatePost,
} from "../contollers/post.contoller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", getPosts);
router.get("/my", authMiddleware, getMyPosts);
router.get("/:id", getSinglePost);
router.post("/", authMiddleware, createPost);
router.put("/:id", authMiddleware, updatePost);
router.delete("/:id", authMiddleware, deletePost);
router.put("/like/:postId", authMiddleware, likePost);

export default router;
