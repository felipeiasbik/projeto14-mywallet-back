import { Router } from "express";
import { transactionsUser } from "../controllers/transactions.controller.js";
import { authValidation } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { transactionSchema } from "../schemas/transactions.schema.js";


const transactionsRouter = Router();

transactionsRouter.post("/home", authValidation, validateSchema(transactionSchema), transactionsUser);

export default transactionsRouter;