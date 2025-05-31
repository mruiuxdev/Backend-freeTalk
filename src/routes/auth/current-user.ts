import { Router, Request, Response, NextFunction } from "express";
import { currentUser } from "../../middlewares/current-user";

const router = Router();

router.get(
  "/current-user",
  currentUser,
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.currentUser) {
      const error = new Error("No user found") as CustomError;
      error.status = 400;
      return next(error);
    }

    res.status(200).json({ currentUser: req.currentUser });
  }
);

export { router as currentUserRouter };
