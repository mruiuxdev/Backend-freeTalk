import cookieSession from "cookie-session";
import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import connectDB from "./db/db";
import { currentUser } from "./middlewares/current-user";
import { requireAuth } from "./middlewares/require-auth";
import { signinRouter } from "./routes/auth/signin";
import { signoutRouter } from "./routes/auth/signout";
import { signupRouter } from "./routes/auth/signup";
import { commentRouter } from "./routes/comment/comment";
import { postRouter } from "./routes/post/post";
import { currentUserRouter } from "./routes/auth/current-user";

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: "*", optionsSuccessStatus: 200 }));
app.set("trust proxy", true);
app.use(express.json());
// ! *the extended: true option will work fine with postman but not with front-end apps*
app.use(express.urlencoded({ extended: false }));
app.use(cookieSession({ signed: false, secure: false }));

app.use(currentUser);

app.use("/api", signinRouter);
app.use("/api", signupRouter);
app.use("/api", signoutRouter);
app.use("/api", currentUserRouter);

app.use("/api/post", postRouter);
app.use("/api/comment", requireAuth, commentRouter);

app.use("/api", (_req, _res, next) => {
  const error = new Error("Endpoint Not Found!") as CustomError;
  error.status = 404;
  return next(error);
});

declare global {
  interface CustomError extends Error {
    status?: number;
  }
}

app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  err.status
    ? res.status(err.status).json({ message: err.message })
    : res.status(500).json({ message: "Something went wrong" });

  next();
});

app.listen(process.env.PORT || 8000, () =>
  console.log("Server is up running on port 8000")
);
