import express from "express";
import { NODE_ENV, PORT } from "./config/env.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth.js";
import { userRouter } from "./routes/user.js";
import connectToDB from "./database/mongodb.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://amazon-price-tracker-web-application-mox86k6r1.vercel.app",
    ], // Allow frontend
    credentials: true, // Allow cookies
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.options("*", cors()); // Handle CORS preflight requests

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);

// Error middleware should be AFTER routes
app.use(errorMiddleware);

// Default route for unknown endpoints
app.all("*", (req, res) => {
  res.status(200).json({ message: "API SUCCESSFUL" });
});

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT} in ${NODE_ENV}`);
  await connectToDB();
});
