import { NextFunction, Request, Response } from "express";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    const error = new Error("Not Authorized") as CustomError;
    error.status = 401;
    return next(error);
  }
};
