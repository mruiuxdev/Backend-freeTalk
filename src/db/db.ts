import mongoose from "mongoose";
import { DatabaseConnectionError } from "../errors";

const connectDB = async () => {
  if (!process.env.MONGO_URI) throw new Error("MONGO URI is required");

  await mongoose
    .connect(process.env.MONGO_URI)
    .then((db) => console.log(db.connection.host))
    .catch((err) => {
      console.error(err);
      new DatabaseConnectionError();
    });
};

export default connectDB;
