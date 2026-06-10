import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

export const isValidId =
  (paramName = 'id') =>
  (req, res, next) => {
    const id = req.params[paramName];
    if (!isValidObjectId(id)) {
      throw createHttpError(400, 'Bad request!');
    }
    next();
  };
