import { NextFunction, Request, Response, Router } from "express";

const router = Router();

router.post(
  "/signout",
  async (req: Request, res: Response, next: NextFunction) => {
    req.session = {};
    res.send({});
  }
);

export { router as signoutRouter };
