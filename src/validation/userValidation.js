import Joi from 'joi';

export const createUserSchema = Joi.object({
  name: Joi.string().trim().min(3).max(30).required(),
  tel: Joi.string().trim().required(),
  role: Joi.string()
    .valid(
      'admin',
      'cutting',
      'hardening',
      'assembly',
      'quality',
      'logistics',
      'guest',
    )
    .required(),
  password: Joi.string().trim().min(6).max(16).required(),
});

export const patchUserSchema = Joi.object({
  name: Joi.string().trim().min(3).max(30),
  tel: Joi.string().trim(),
  role: Joi.string().valid(
    'admin',
    'cutting',
    'hardening',
    'assembly',
    'quality',
    'logistics',
    'guest',
  ),
  isActive: Joi.boolean(),
  telegramChatId: Joi.string().allow(null),
}).min(1);

export const changeUserPasswordSchema = Joi.object({
  newPass: Joi.string().trim().min(6).max(16).required(),
});
