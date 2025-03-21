import { Router } from "express";
import { authorise } from "../middleware/auth.middleware.js";
import { deleteUser, getUser, updateUser } from "../controller/user.js";

export const userRouter = Router();

// Get user by ID
userRouter.get("/:id", authorise, getUser);

// Update user by ID
userRouter.put("/update-user/:id", authorise, updateUser);
userRouter.delete("/delete-user/:id", authorise, deleteUser);
