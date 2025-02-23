import express from "express";
import { NODE_ENV, PORT } from "./config/env.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.js";
import connectToDB from "./database/mongodb.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(errorMiddleware);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", (req, res) => {
  res.json({ message: "API for user management" });
});
app.all("*", (req, res) => {
  res.status(200).json({ message: "API SUCCESSFUL" });
});

app.listen(PORT, async () => {
  console.log(
    `Server is running on port http//localhost:${PORT} in ${NODE_ENV}`
  );
  await connectToDB();
});
