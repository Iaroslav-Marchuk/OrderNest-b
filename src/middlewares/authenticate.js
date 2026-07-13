import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';

import { getEnvVariable } from '../utils/getEnvVariable.js';
import { UsersCollection } from '../db/models/userModel.js';
import { SessionsCollection } from '../db/models/sessionModel.js';

const secretKey = getEnvVariable('JWT_SECRET');

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(createHttpError(401, 'Not authorized'));
  }

  const actualAccessToken = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(actualAccessToken, secretKey);
    const user = await UsersCollection.findById(decoded.userId).select(
      '-password',
    );

    if (!user) {
      return next(createHttpError(401, 'User not found!'));
    }

    if (!user.isActive) {
      return next(createHttpError(403, 'Account is deactivated'));
    }

    let location = null;
    if (user.role === 'assembly') {
      const session = await SessionsCollection.findOne({
        userId: user._id,
      }).select('location');
      location = session?.location ?? null;
    }

    req.user = { ...user.toObject(), location };

    next();
  } catch {
    next(createHttpError(401, 'Token is expired or invalid'));
  }
};
