import { Router, Request, Response, NextFunction } from "express";
import { NotFoundError } from "../../errors";
import { currentUser } from "../../middlewares";

const router = Router();

router.get(
  "/current-user",
  currentUser,
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.currentUser) {
      return next(new NotFoundError());
    }

    res.status(200).json({ currentUser: req.currentUser });
  }
);

export { router as currentUserRouter };
