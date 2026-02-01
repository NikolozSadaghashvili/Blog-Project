import mongoose, { Document, Schema, Model } from "mongoose";

export interface IComment extends Document {
  post: mongoose.Types.ObjectId; // Post ID
  user: {
    id: string;
    name: string;
    email: string;
  };
  content: string;
  createdAt: Date;
}

const commentSchema: Schema<IComment> = new Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    user: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      email: { type: String, required: true },
    },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const Comment: Model<IComment> = mongoose.model<IComment>(
  "Comment",
  commentSchema
);

export default Comment;
