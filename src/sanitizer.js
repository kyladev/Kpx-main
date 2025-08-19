import Joi from 'joi';

export const loginSchema = Joi.object({
  user: Joi.string()
    .trim()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9._-]+$/)
    .required(),

  pass: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^[a-zA-Z0-9!@#$%^&*()_\-+=\[\]{};:'",.<>?/|\\]+$/)
    .required()
});