import express from "express";
import { securtyPassword } from "../contollers/admin.controller";

const router = express.Router();

router.post("/panel", securtyPassword);

export default router;
