import mongoose from "mongoose";
import { DB_URL, NODE_ENV } from "../config/env.js";

if (!DB_URL) {
  throw new Error("DB_URL environment variable is not set.");
}


const connectToDB = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log(`Connected to database via ${NODE_ENV}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectToDB;
