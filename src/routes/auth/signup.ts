import { NextFunction, Request, Response, Router } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { BadRequestError } from "../../errors";
import { validationRequest } from "../../middlewares";
import User from "../../models/user/user";

const router = Router();

router.post(
  "/signup",
  [
    body("email")
      .not()
      .isEmpty()
      .isEmail()
      .withMessage("A valid email is required!"),

    body("password")
      .not()
      .isEmpty()
      .isLength({ min: 6 })
      .withMessage("A valid password is required!"),
  ],
  validationRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return next(
          new BadRequestError("User with the same email already exists")
        );
      }

      const newUser = User.build({ email, password });
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
