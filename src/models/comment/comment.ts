import mongoose from "mongoose";

export interface CommentDoc extends mongoose.Document {
  username: string;
  content: string;
}

export interface CreateCommentDto {
  username: string;
  content: string;
}

export interface CommentModel extends mongoose.Model<CommentDoc> {
  build(dto: CreateCommentDto): CommentDoc;
}

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

commentSchema.statics.build = (createCommentDto: CreateCommentDto) =>
  new Comment(createCommentDto);

const Comment = mongoose.model<CommentDoc, CommentModel>(
  "Comment",
  commentSchema
);

export default Comment;
