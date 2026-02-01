import express from "express";
import { createAccout, loginAccount } from "../contollers/auth.contoller";

const router = express.Router();

// router.get("/");
router.post("/register", createAccout);
router.post("/login", loginAccount);

export default router;
