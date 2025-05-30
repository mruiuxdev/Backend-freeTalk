import { NextFunction, Request, Response, Router } from "express";
import Comment from "../../models/comment/comment";
import Post from "../../models/post/post";

const router = Router();

// router.get("/", async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const posts = await Post.find();
//     res.status(200).json(posts);
//   } catch (error) {
//     next(error);
//   }
// });

// router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const post = await Post.findById(req.params.id);

//     if (!post) {
//       const error = new Error("Post not found") as CustomError;
//       error.status = 404;
//       return next(error);
//     }

//     res.status(200).json(post);
//   } catch (error) {
//     next(error);
//   }
// });

router.post(
  "/new/:postId",
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, content } = req.body;
    const { postId } = req.params;

    if (!postId) {
      const error = new Error("Post id is required!") as CustomError;
      error.status = 400;
      return next(error);
    }

    if (!content) {
      const error = new Error("Content is required!") as CustomError;
      error.status = 400;
      return next(error);
    }

    try {
      const post = await Post.findById(postId);
      if (!post) {
        const error = new Error("Post not found!") as CustomError;
        error.status = 404;
        return next(error);
      }

      const newComment = new Comment({
        username: username ?? "anonymous",
        content,
      });

      await newComment.save();

      post.comments.push(newComment._id);
      await post.save();

      res.status(201).json(newComment);
    } catch (error) {
      next(error);
    }
  }
);

// router.post(
//   "/update/:id",
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { id } = req.params;
//     const { title, content } = req.body;

//     if (!id) {
//       const error = new Error("Post id is required!") as CustomError;
//       error.status = 400;
//       return next(error);
//     }

//     const checkedId = await Post.findById(id);
//     if (!checkedId) {
//       const error = new Error("Post id is not found!") as CustomError;
//       error.status = 404;
//       return next(error);
//     }
//     let updatedPost;
//     try {
//       /*
//     ? ✅ Purpose of { new: true }
//     ? The new option tells Mongoose (assuming you're using Mongoose with MongoDB):
//     ? ✅ Return the updated document, not the original one.
//     */
//       updatedPost = await Post.findOneAndUpdate(
//         { _id: checkedId },
//         { $set: { title, content } },
//         { new: true }
//       );
//     } catch (err) {
//       const error = new Error("Post can not update, Try again!") as CustomError;
//       error.status = 500;
//       return next(error);
//     }

//     res.status(200).json(updatedPost);
//   }
// );

router.delete(
  "/delete/:commentId/:postId",
  async (req: Request, res: Response, next: NextFunction) => {
    const { commentId, postId } = req.params;

    if (!commentId || !postId) {
      const error = new Error(
        "Comment and post id are required!"
      ) as CustomError;
      error.status = 400;
      return next(error);
    }

    try {
      const post = await Post.findById(postId);
      if (!post) {
        const error = new Error("Post not found!") as CustomError;
        error.status = 404;
        return next(error);
      }

      const comment = await Comment.findById(commentId);
      if (!comment) {
        const error = new Error("Comment not found!") as CustomError;
        error.status = 404;
        return next(error);
      }

      await Comment.findByIdAndDelete(commentId);

      await Post.findByIdAndUpdate(
        postId,
        { $pull: { comments: commentId } },
        { new: true }
      );

      res.status(200).json({ message: "Comment deleted successfully" });
    } catch (err) {
      const error = new Error(
        "Comment cannot be deleted, try again!"
      ) as CustomError;
      error.status = 500;
      return next(error);
    }
  }
);

export { router as commentRouter };
