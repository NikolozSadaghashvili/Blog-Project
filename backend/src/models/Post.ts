import mongoose, { Document, Model, Types, Schema } from "mongoose";
import { IUser } from "./User";

export interface Like {
  user: mongoose.Types.ObjectId;
}

export interface IPost extends Document {
  title: string;
  description: string;
  image: string;
  author: mongoose.Types.ObjectId | IUser;
  likes: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const postSchema: Schema<IPost> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, default: "" },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Post: Model<IPost> = mongoose.model<IPost>("Post", postSchema);

export default Post;
