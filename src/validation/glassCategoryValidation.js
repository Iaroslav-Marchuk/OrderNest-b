import Joi from 'joi';

export const glassCategorySchema = Joi.object({
  label: Joi.string().trim().min(3).required(),
});
