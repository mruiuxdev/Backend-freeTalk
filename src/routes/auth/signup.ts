import { NextFunction, Request, Response, Router } from "express";
import User from "../../models/user/user";
import jwt from "jsonwebtoken";

const router = Router();

router.post(
  "/signup",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        const error = new Error(
          "User with the same email already exists"
        ) as CustomError;
        error.status = 400;
        return next(error);
      }

      const newUser = new User({ email, password });
      await newUser.save();

      req.session = {
        jwt: jwt.sign({ email, userId: newUser._id }, process.env.JWT_SECRET!, {
          expiresIn: "10h",
        }),
      };

      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  }
);

export { router as signupRouter };
