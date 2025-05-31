import { NextFunction, Request, Response, Router } from "express";
import Post from "../../models/post/post";
import { BadRequestError, NotFoundError } from "../../errors";
import { requireAuth } from "../../middlewares";
import User from "../../models/user/user";

const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
});

router.get(
  "/:id",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const post = await Post.findById(req.params.id).populate("comments");

      if (!post) {
        return next(new BadRequestError("Post not found"));
      }

      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/new",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, content } = req.body;

      if (!title || !content) {
        return next(new BadRequestError("Title and content are required!"));
      }

      const newPost = Post.build({ title, content });
      await newPost.save();

      await User.findOneAndUpdate(
        { _id: req.currentUser!.userId },
        { $push: { posts: newPost._id } },
        { new: true }
      );

      res.status(201).json(newPost);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/update/:id",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!id) {
      return next(new BadRequestError("Post id is required!"));
    }

    const checkedId = await Post.findById(id);
    if (!checkedId) next(new NotFoundError());
    let updatedPost;
    try {
      /*  
    ? ✅ Purpose of { new: true }
    ? The new option tells Mongoose (assuming you're using Mongoose with MongoDB):
    ? ✅ Return the updated document, not the original one.
    */
      updatedPost = await Post.findOneAndUpdate(
        { _id: checkedId },
        { $set: { title, content } },
        { new: true }
      );
    } catch (error) {
      next(error);
    }

    res.status(200).json(updatedPost);
  }
);

router.delete(
  "/delete/:id",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!id) {
      return next(new BadRequestError("Post id is required!"));
    }

    const checkedPost = await Post.findById(id);
    if (!checkedPost) {
      return next(new NotFoundError());
    }

    try {
      await Post.findOneAndDelete({ _id: checkedPost._id });
      await User.findOneAndUpdate(
        { _id: req.currentUser!.userId },
        {
          $pull: { posts: checkedPost._id },
        },
        { new: true }
      );
    } catch (error) {
      next(error);
    }

    res.status(200).json({ message: "Post deleted successfully" });
  }
);

export { router as postRouter };
