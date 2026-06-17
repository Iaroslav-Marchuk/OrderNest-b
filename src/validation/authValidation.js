import Joi from 'joi';

export const loginUserSchema = Joi.object({
  tel: Joi.string()
    .trim()
    .pattern(/^\d{9}$/)
    .required(),
  password: Joi.string().trim().min(6).max(16).required(),
});

export const changePasswordSchema = Joi.object({
  oldPass: Joi.string().trim().min(6).max(16).required(),
  newPass: Joi.string().trim().min(6).max(16).required(),
});

export const locationOfUserSchema = Joi.object({
  location: Joi.string().valid('line_1', 'line_2', 'line_3').required(),
});
