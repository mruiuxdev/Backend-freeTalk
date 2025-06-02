import { NextFunction, Request, Response, Router } from "express";
import User from "../../models/user/user";
import { authenticationService } from "../../utils/auth";
import jwt from "jsonwebtoken";
import { BadRequestError } from "../../errors";
import { validationRequest } from "../../middlewares";
import { body } from "express-validator";

const router = Router();

router.post(
  "/signin",
  [body("email").notEmpty(), body("password").notEmpty()],
  validationRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return next(new BadRequestError("Invalid Credentials"));
      } else {
        const matchedPassword = await authenticationService.pwdCompare(
          user.password,
          password
        );
        if (!matchedPassword) next(new BadRequestError("Invalid Credentials"));

        const token = jwt.sign(
          { email, userId: user._id },
          process.env.JWT_SECRET!,
          { expiresIn: "10h" }
        );

        req.session = { jwt: token };

        const { password: _, ...userWithoutPassword } = user.toObject();

        res.status(200).json(userWithoutPassword);
      }
    } catch (error) {
      next(error);
    }
  }
);

export { router as signinRouter };
