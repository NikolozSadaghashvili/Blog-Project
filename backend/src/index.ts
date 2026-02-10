import express from "express";
import { connectDB } from "./config/db";
import dotenv from "dotenv";
import authRouter from "./routes/auth.router";
import postRouter from "./routes/post.router";
import commentRouter from "./routes/comment.router";
import adminRouter from "./routes/adminRouter";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/post", postRouter);
app.use("/api/comment", commentRouter);

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log("Server is running http:localhost:5000");
});
