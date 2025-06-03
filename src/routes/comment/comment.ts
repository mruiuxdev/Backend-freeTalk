import { NextFunction, Request, Response, Router } from "express";
import { body, param } from "express-validator";
import { BadRequestError } from "../../errors";
import { validationRequest } from "../../middlewares";
import Comment from "../../models/comment/comment";
import Post from "../../models/post/post";

const router = Router();

router.post(
  "/new/:postId",
  [
    param("postId").notEmpty().withMessage("Post ID is required"),
    body("content").notEmpty().withMessage("Content is required"),
    body("username").optional(),
  ],
  validationRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, content } = req.body;
    const { postId } = req.params;

    try {
      const post = await Post.findById(postId);
      if (!post) {
        return next(new BadRequestError("Post not found!"));
      }

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
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/delete/:commentId/:postId",
  [
    param("postId").notEmpty().withMessage("Post ID is required"),
    param("commentId").notEmpty().withMessage("Comment ID is required"),
  ],
  validationRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { commentId, postId } = req.params;

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
