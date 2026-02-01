import express from "express";
import {
  addComment,
  deleteComment,
  getComment,
} from "../contollers/coment.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/", authMiddleware, addComment);
router.get("/:id", getComment);
router.delete("/:id", authMiddleware, deleteComment);
export default router;
