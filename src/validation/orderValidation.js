import Joi from 'joi';

export const createOrderSchema = Joi.object({
  ep: Joi.number().integer().positive().min(1).max(20000).required(),
  client: Joi.string().required(),
  items: Joi.array()
    .min(1)
    .items(
      Joi.object({
        type: Joi.string().required(),
        sizeX: Joi.number().integer().positive().min(1).max(6000).required(),
        sizeY: Joi.number().integer().positive().min(1).max(6000).required(),
        thickness: Joi.string().min(1).max(20).required(),
        isTempered: Joi.boolean().required(),
        quantity: Joi.number().integer().positive().min(1).required(),
        reason: Joi.string().max(100).required(),
        notes: Joi.string().max(100).allow(''),
      }).required(),
    ),
});

export const patchOrderSchema = Joi.object({
  ep: Joi.number().integer().positive().min(1).max(20000),
  client: Joi.string(),
});

export const addItemToOrderOrderSchema = Joi.object({
  type: Joi.string().required(),
  sizeX: Joi.number().integer().positive().min(1).max(6000).required(),
  sizeY: Joi.number().integer().positive().min(1).max(6000).required(),
  thickness: Joi.string().min(1).max(20).required(),
  isTempered: Joi.boolean().required(),
  quantity: Joi.number().integer().positive().min(1).required(),
  reason: Joi.string().max(100).required(),
  notes: Joi.string().max(100).allow(''),
});

export const patchOrderItemSchema = Joi.object({
  type: Joi.string(),
  sizeX: Joi.number().integer().positive().min(1).max(6000),
  sizeY: Joi.number().integer().positive().min(1).max(6000),
  thickness: Joi.string().min(1).max(20),
  isTempered: Joi.boolean(),
  quantity: Joi.number().integer().positive().min(1),
  reason: Joi.string().max(100),
  notes: Joi.string().max(100),
});

export const updateOrderItemStatusSchema = Joi.object({
  status: Joi.string().valid('created', 'in_progress', 'completed').required(),
});
