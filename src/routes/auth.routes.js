import { Router } from "express";
import { getUser, signIn, signUp } from "../controllers/auth.controller.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { authValidation } from "../middlewares/auth.middleware.js";
import { signInSchema } from "../schemas/login.schema.js";
import { signUpSchema } from "../schemas/auth.schema.js";

const authRouter = Router();

authRouter.post("/cadastro", validateSchema(signUpSchema), signUp);
authRouter.post("/", validateSchema(signInSchema), signIn);
authRouter.get("/", authValidation, getUser);

export default authRouter;