import joi from "joi";

export const transactionSchema = joi.object({
    description: joi.string().min(3).required(),
    value: joi.number().positive().precision(2).strict().required(),
    type: joi.string().valid("input", "output").required()
  });