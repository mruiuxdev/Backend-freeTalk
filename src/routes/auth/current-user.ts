import { Router, Request, Response, NextFunction } from "express";
import { currentUser } from "../../middlewares/current-user";
import { NotFoundError } from "../../errors";

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
