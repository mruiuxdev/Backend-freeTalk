import cookieSession from "cookie-session";
import cors from "cors";
import dotenv from "dotenv";
import type { ErrorRequestHandler } from "express";
import express from "express";
import path from "path";
import connectDB from "./db/db";
import { NotFoundError } from "./errors";
import { errorHandler, requireAuth } from "./middlewares";
import { currentUser } from "./middlewares/current-user";
import { currentUserRouter } from "./routes/auth/current-user";
import { signinRouter } from "./routes/auth/signin";
import { signoutRouter } from "./routes/auth/signout";
import { signupRouter } from "./routes/auth/signup";
import { commentRouter } from "./routes/comment/comment";
import { postRouter } from "./routes/post/post";

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
app.use("/uploads", express.static(path.join(process.cwd(), "src", "uploads")));

app.use("/api", signinRouter);
app.use("/api", signupRouter);
app.use("/api", signoutRouter);
app.use("/api", currentUserRouter);

app.use("/api/post", postRouter);
app.use("/api/comment", requireAuth, commentRouter);

app.use("/api", (_req, _res, next) => {
  return next(new NotFoundError());
});

app.use(errorHandler as ErrorRequestHandler);

app.listen(process.env.PORT || 8000, () =>
  console.log("Server is up running on port 8000")
);
