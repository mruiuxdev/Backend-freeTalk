import { NextFunction, Request, Response, Router } from "express";
import User from "../../models/user/user";
import { authenticationService } from "../../utils/auth";
import jwt from "jsonwebtoken";

const router = Router();

router.post(
  "/signin",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error("Invalid Credentials") as CustomError;
        error.status = 400;
        return next(error);
      }

      const matchedPassword = await authenticationService.pwdCompare(
        user.password,
        password
      );
      if (matchedPassword) {
        const error = new Error("Invalid Credentials") as CustomError;
        error.status = 400;
        return next(error);
      }

      const token = jwt.sign(
        { email, userId: user._id },
        process.env.JWT_SECRET!,
        { expiresIn: "10h" }
      );

      req.session = { jwt: token };
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
);

export { router as signinRouter };
