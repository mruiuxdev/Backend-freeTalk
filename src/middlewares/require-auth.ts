import { NextFunction, Request, Response } from "express";
import { NotAuthorizedError } from "../errors";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    return next(new NotAuthorizedError());
  }

  next();
};
