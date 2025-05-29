import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    username: {
      type: String,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
