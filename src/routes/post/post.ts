import { NextFunction, Request, Response, Router } from "express";
import Post from "../../models/post/post";

const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      const error = new Error("Post not found") as CustomError;
      error.status = 404;
      return next(error);
    }

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
});
router.post("/new", async (req: Request, res: Response, next: NextFunction) => {
  const { title, content } = req.body;

  if (!title || !content) {
    const error = new Error("Title and content are required!") as CustomError;
    error.status = 400;
    return next(error);
  }

  const newPost = new Post({ title, content });

  await newPost.save();

  res.status(201).json({ newPost });
});

router.post(
  "/update/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!id) {
      const error = new Error("Post id is required!") as CustomError;
      error.status = 400;
      return next(error);
    }

    const checkedId = await Post.findById(id);
    if (!checkedId) {
      const error = new Error("Post id is not found!") as CustomError;
      error.status = 404;
      return next(error);
    }
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
    } catch (err) {
      const error = new Error("Post can not update, Try again!") as CustomError;
      error.status = 500;
      return next(error);
    }

    res.status(200).json(updatedPost);
  }
);

router.delete(
  "/delete/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!id) {
      const error = new Error("Post id is required!") as CustomError;
      error.status = 400;
      return next(error);
    }

    const checkedId = await Post.findById(id);
    if (!checkedId) {
      const error = new Error("Post id is not found!") as CustomError;
      error.status = 404;
      return next(error);
    }
    try {
      await Post.findOneAndDelete({ _id: checkedId });
    } catch (err) {
      const error = new Error("Post can not delete, Try again!") as CustomError;
      error.status = 500;
      return next(error);
    }

    res.status(200).json({ message: "Post deleted successfully" });
  }
);

export { router as postRouter };
