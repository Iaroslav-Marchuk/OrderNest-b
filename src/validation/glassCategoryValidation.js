import Joi from 'joi';

export const addNewGlassCategorySchema = Joi.object({
  label: Joi.string().trim().min(3).required(),
  isLaminated: Joi.boolean().required(),
});

export const patchGlassCategorySchema = Joi.object({
  label: Joi.string().trim().min(3),
  isLaminated: Joi.boolean(),
});
