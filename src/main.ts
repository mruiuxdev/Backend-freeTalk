import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import connectDB from "./db/db";
import { postRouter } from "./routes/post/post";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
// ! *the extended: true option will work fine with postman but not with front-end apps*
app.use(express.urlencoded({ extended: false }));

app.use("/api/post", postRouter);

declare global {
  interface CustomError extends Error {
    status?: number;
  }
}

app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  err.status
    ? res.status(err.status).json({ message: err.message })
    : res.status(500).json({ message: "Something went wrong" });
});

app.listen(process.env.PORT || 8000, () =>
  console.log("Server is up running on port 8000")
);
