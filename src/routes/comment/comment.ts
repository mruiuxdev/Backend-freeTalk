import { NextFunction, Request, Response, Router } from "express";
import { BadRequestError } from "../../errors";
import Comment from "../../models/comment/comment";
import Post from "../../models/post/post";

const router = Router();

router.post(
  "/new/:postId",
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, content } = req.body;
    const { postId } = req.params;

    if (!postId) {
      return next(new BadRequestError("Post id is required!"));
    }

    if (!content) {
      return next(new BadRequestError("Content is required!"));
    }

    try {
      const post = await Post.findById(postId);
      if (!post) {
        return next(new BadRequestError("Post not found!"));
      } else {
        const newComment = Comment.build({
          username: username ?? "anonymous",
          content,
        });

        await newComment.save();

        await Post.findByIdAndUpdate(
          postId,
          { $push: { comments: newComment } },
          { new: true }
        );

        res.status(201).json(newComment);
      }
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/delete/:commentId/:postId",
  async (req: Request, res: Response, next: NextFunction) => {
    const { commentId, postId } = req.params;

    if (!commentId || !postId) {
      return next(new BadRequestError("Comment and post id are required!"));
    }

    try {
      const post = await Post.findById(postId);
      if (!post) {
        return next(new BadRequestError("Post not found!"));
      }

      const comment = await Comment.findById(commentId);
      if (!comment) {
        return next(new BadRequestError("Comment not found!"));
      }

      await Comment.findByIdAndDelete(commentId);

      await Post.findByIdAndUpdate(
        postId,
        { $pull: { comments: commentId } },
        { new: true }
      );

      res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
);

export { router as commentRouter };
