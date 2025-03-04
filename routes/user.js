import { Router } from "express";
import { authorise } from "../middleware/auth.middleware.js";
import { getUser } from "../controller/user.js";

export const userRouter = Router();

userRouter.get("/", authorise, getUser);
