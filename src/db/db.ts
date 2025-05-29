import mongoose from "mongoose";

const connectDB = async () => {
  if (!process.env.MONGO_URI) throw new Error("MONGO URI is required");

  await mongoose
    .connect(process.env.MONGO_URI)
    .then((db) => console.log(db.connection.host))
    .catch((err) => {
      throw new Error(err.message);
    });
};

export default connectDB;
