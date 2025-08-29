import Joi from 'joi';
import { min_username_len, max_username_len, min_password_len, max_password_len } from './run-settings.js';

export const loginSchema = Joi.object({
  user: Joi.string()
    .trim()
    .min(min_username_len)
    .max(max_username_len)
    .regex(/^[a-zA-Z0-9._-]+$/)
    .required(),

  pass: Joi.string()
    .min(min_password_len)
    .max(max_password_len)
    .pattern(/^[a-zA-Z0-9!@#$%^&*()_\-+=\[\]{};:'",.<>?/|\\]+$/)
    .required()
});