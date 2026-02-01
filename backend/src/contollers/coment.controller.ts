import mongoose from "mongoose";
import { AuthRequest } from "../middleware/auth.middleware";
import { Response, Request } from "express";
import Comment from "../models/Comment";

export const addComment = async (req: AuthRequest, res: Response) => {
  try {
    const postId = req.body.postId as string;
    const content = req.body.content as string;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Post ID" });
    }
    if (!content.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Please Enter content " });
    }
    if (content.trim().length < 10) {
      return res
        .status(400)
        .json({ success: false, message: "Your comment is very low" });
    }
    if (!postId || !content) {
      return res.status(400).json({ success: false, message: "" });
    }

    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "Unatorized" });
    }

    const comment = await Comment.create({
      post: postId,
      content: content,
      user: { id: user.userId, name: user.name, email: user.email },
    });

    return res.status(201).json({
      success: true,
      message: "Comment successfully created",
      data: comment,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "internal server error add coment",
    });
  }
};

export const getComment = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Post Id" });
    }
    const comment = await Comment.find({ post: id });
    return res.status(200).json({
      success: true,
      message: "Get comment successfully",
      comments: comment,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "internal server error from get comment",
    });
  }
};

export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Comment Id" });
    }
    const comment = await Comment.findOne({ _id: id });
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }
    await Comment.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ success: true, message: "delete comment successfully" });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "internal server error from delete comment",
    });
  }
};
