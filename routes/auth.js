import { Router } from "express";
import { signin, signup } from "../controller/user.js";

const authRouter = Router();

authRouter.post("/sign-up", signup);
authRouter.post("/sign-in", signin);

authRouter.post("/sign-out", (req, res) =>
  res.send({ message: "The sign out route" })
);
export default authRouter;
