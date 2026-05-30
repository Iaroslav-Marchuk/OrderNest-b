import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';

import { UsersCollection } from '../db/models/userModel.js';
import { SessionsCollection } from '../db/models/sessionModel.js';

import { ACCESS_TOKEN_EXP, REFRESH_TOKEN_EXP } from '../constants/constants.js';

import { getEnvVariable } from '../utils/getEnvVariable.js';

const JWT_SECRET = getEnvVariable('JWT_SECRET');

export const loginUserService = async ({ tel, password }) => {
  const user = await UsersCollection.findOne({ tel: tel });
  if (!user) throw createHttpError(401, 'Invalid email or password!');

  const isEqual = await bcrypt.compare(password, user.password);
  if (!isEqual) throw createHttpError(401, 'Invalid email or password!');

  await SessionsCollection.deleteOne({ userId: user._id });

  const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXP / 1000,
  });

  const refreshToken = randomBytes(30).toString('base64');

  await SessionsCollection.create({
    userId: user._id,
    refreshToken,
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_EXP),
  });

  return {
    accessToken,
    refreshToken,
    user: {
      name: user.name,
      tel: user.tel,
      role: user.role,
    },
  };
};

export const logoutUserService = async (refreshToken) => {
  await SessionsCollection.deleteOne({ refreshToken });
};

export const refreshSessionService = async (refreshToken) => {
  if (!refreshToken) throw createHttpError(401, 'No refresh token!');

  const currentSession = await SessionsCollection.findOne({
    refreshToken: refreshToken,
  });

  if (!currentSession) throw createHttpError(401, 'Session not found!');

  const isRefreshTokenExpired =
    new Date() > new Date(currentSession.refreshTokenValidUntil);

  if (isRefreshTokenExpired)
    throw createHttpError(401, 'Refresh token expired!');

  await SessionsCollection.deleteOne({ refreshToken });

  const newAccessToken = jwt.sign(
    { userId: currentSession.userId },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXP / 1000 },
  );

  const newRefreshToken = randomBytes(30).toString('base64');

  await SessionsCollection.create({
    userId: currentSession.userId,
    refreshToken: newRefreshToken,
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_EXP),
  });

  const user = await UsersCollection.findById(currentSession.userId).select(
    '-password',
  );

  return { accessToken: newAccessToken, refreshToken: newRefreshToken, user };
};

export const getCurrentUserService = async (userId) => {
  const user = await UsersCollection.findById(userId).select('-password');

  if (!user) throw createHttpError(404, 'User not found!');

  return user;
};

export const changeMyPasswordService = async (userId, oldPass, newPass) => {
  const user = await UsersCollection.findById(userId);
  if (!user) throw createHttpError(404, 'User not found!');

  const isEqual = await bcrypt.compare(oldPass, user.password);
  if (!isEqual) throw createHttpError(401, 'Invalid password!');

  const encryptedNewPassword = await bcrypt.hash(newPass, 10);

  user.password = encryptedNewPassword;
  await user.save();

  await SessionsCollection.deleteOne({ userId: user._id });
  const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXP / 1000,
  });
  const refreshToken = randomBytes(30).toString('base64');

  await SessionsCollection.create({
    userId: user._id,
    refreshToken,
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_EXP),
  });

  return {
    accessToken,
    refreshToken,
    user: {
      name: user.name,
      tel: user.tel,
    },
  };
};
