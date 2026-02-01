import { Response, Request } from "express";
import Post from "../models/Post";
import { AuthRequest } from "../middleware/auth.middleware";
import mongoose, { mongo, Types } from "mongoose";

interface Params {
  id: string;
}

interface IPostUpdate {
  title: string;
  description: string;
  image: string;
}

export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, image } = req.body;

    if (!title || !description) {
      return res
        .status(401)
        .json({ success: false, message: "title and descripton is required" });
    }

    const newPost = await Post.create({
      title,
      description,
      image,
      author: req?.user?.userId,
    });

    res.status(201).json({
      success: true,
      message: "post successfully created",
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

export const getMyPosts = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId.toString();

    if (!userId) {
      return res
        .status(403)
        .json({ success: false, message: "user not found" });
    }
    const posts = await Post.find({ author: userId }).populate(
      "author",
      "email name"
    );
    res.status(200).json({ success: true, count: posts.length, data: posts });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "internal server error from my posts",
    });
  }
};

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
      message: error.message || "internal server error single post",
    });
  }
};

export const updatePost = async (req: AuthRequest, res: Response) => {
  const updatePost: Partial<IPostUpdate> = {};

  try {
    const { id } = req.params;
    const { title, description, image } = req.body;

    if (title) updatePost.title = title;
    if (description) updatePost.description = description;
    if (image) updatePost.image = image;

    const objectId = new mongoose.Types.ObjectId(id);

    if (!objectId) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid post ID" });
    }

    const post = await Post.findById(id);

    if (!post) {
      res.status(404).json({ success: false, message: "post not found" });
    }
    const postAuthor = post?.author.toString();
    const userId = req.user?.userId;

    if (postAuthor !== userId) {
      return res
        .status(403)
        .json({ success: false, message: "you are not post author" });
    }

    const update = await Post.findByIdAndUpdate(id, updatePost, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "post updated successfully",
      data: update,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "internal server error single post",
    });
  }
};

export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.query.id as string;
    const objectId = new mongoose.Types.ObjectId(id);
    if (!objectId) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Post ID" });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }
    const postAuthorId = post.author.toString();
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (postAuthorId !== userId) {
      return res
        .status(403)
        .json({ success: false, message: "you are not post author" });
    }

    await post.deleteOne();
    return res
      .status(200)
      .json({ success: true, message: "Post Deleted successfully" });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "internal server error from delete post",
    });
  }
};

export const likePost = async (req: AuthRequest, res: Response) => {
  try {
    // დარწმუნება, რომ postId არის string
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

    // ObjectId შექმნა TS-სთვის
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Likes array-ში არსებობის შემოწმება
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
      message: isLiked ? "Post Unliked" : "Post Liked",
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error from likes",
    });
  }
};
