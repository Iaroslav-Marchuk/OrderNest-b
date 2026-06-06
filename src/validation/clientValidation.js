import Joi from 'joi';

export const clientSchema = Joi.object({
  name: Joi.string().trim().min(3).required(),
});
