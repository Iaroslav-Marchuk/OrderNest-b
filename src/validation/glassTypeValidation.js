import Joi from 'joi';

export const addNewGlassTypeSchema = Joi.object({
  label: Joi.string().trim().min(3).required(),
  category: Joi.string().required(),
  thickness: Joi.array().items(Joi.string()).required(),
  temper: Joi.string().valid('required', 'forbidden', 'optional').required(),
});

export const patchGlassTypeSchema = Joi.object({
  label: Joi.string().trim().min(3),
  category: Joi.string(),
  thickness: Joi.array().items(Joi.string()),
  temper: Joi.string().valid('required', 'forbidden', 'optional'),
}).min(1);
