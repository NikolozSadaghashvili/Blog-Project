import express from "express";
import {
  createAccout,
  deleteAccount,
  getUsers,
  loginAccount,
} from "../contollers/auth.contoller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

// router.get("/");
router.get("/", authMiddleware, getUsers);
router.post("/register", createAccout);
router.post("/login", loginAccount);
router.delete("/:id", authMiddleware, deleteAccount);

export default router;
