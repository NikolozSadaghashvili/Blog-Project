import { Response, Request } from "express";
import Post from "../models/Post";
import { AuthRequest } from "../middleware/auth.middleware";
import mongoose from "mongoose";

interface Params {
  id: string;
}

interface IPostUpdate {
  title: string;
  description: string;
  image: string;
}

// ================== CREATE POST ==================
export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, image } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    const newPost = await Post.create({
      title,
      description,
      image,
      author: req.user?.userId,
    });

    res.status(201).json({
      success: true,
      message: "Post successfully created",
      data: newPost,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error from create post",
    });
  }
};

// ================== GET MY POSTS ==================
export const getMyPosts = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res
        .status(403)
        .json({ success: false, message: "User not found" });
    }

    const posts = await Post.find({ author: userId }).populate(
      "author",
      "email name",
    );

    res.status(200).json({ success: true, count: posts.length, data: posts });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error from my posts",
    });
  }
};

// ================== GET ALL POSTS ==================
export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find({}).populate("author", "email name");
    res.status(200).json({ success: true, count: posts.length, data: posts });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error all posts",
    });
  }
};

// ================== GET SINGLE POST ==================
export const getSinglePost = async (req: Request<Params>, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid post ID" });
    }

    const post = await Post.findById(id).populate("author", "name email id");
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    res.status(200).json({ success: true, data: post });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error single post",
    });
  }
};

// ================== UPDATE POST ==================
export const updatePost = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const { title, description, image } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid post ID" });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    const userId = req.user?.userId;
    if (post.author.toString() !== userId) {
      return res
        .status(403)
        .json({ success: false, message: "You are not post author" });
    }

    const updateData: Partial<IPostUpdate> = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (image) updateData.image = image;

    const updatedPost = await Post.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: updatedPost,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error update post",
    });
  }
};

// ================== DELETE POST ==================

export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;

    // Check valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid post ID" });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    const userId = req.user?.userId;
    const userRole = req.user?.role;

    // Author or Admin permission
    if (post.author.toString() !== userId && userRole !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this post",
      });
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// ================== LIKE / UNLIKE POST ==================
export const likePost = async (req: AuthRequest, res: Response) => {
  try {
    const postId = req.params.postId as string;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const isLiked = post.likes.some((id) => id.equals(userObjectId));

    if (!isLiked) {
      post.likes.push(userObjectId);
    } else {
      post.likes = post.likes.filter((id) => !id.equals(userObjectId));
    }

    await post.save();

    res.status(200).json({
      success: true,
      isLiked,
      message: isLiked ? "Post unliked" : "Post liked",
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error like post",
    });
  }
};
