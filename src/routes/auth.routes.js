import { Router } from "express";
import { sigIn, signUp } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/cadastro", signUp);
authRouter.post("/", sigIn);

export default authRouter;