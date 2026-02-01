import mongoose from "mongoose";

export const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI || "";
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Mongo DataBase Connected Success");
  } catch (error) {
    console.log("Database connected faild", error);
  }
};
