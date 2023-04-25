import { Router } from "express";
import { transactionsGetUser, transactionsUser } from "../controllers/transactions.controller.js";
import { authValidation } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { transactionSchema } from "../schemas/transactions.schema.js";


const transactionsRouter = Router();

transactionsRouter.post("/nova-transacao", authValidation, validateSchema(transactionSchema), transactionsUser);
transactionsRouter.get("/home", authValidation, transactionsGetUser);

export default transactionsRouter;