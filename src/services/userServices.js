import bcrypt from 'bcrypt';

import createHttpError from 'http-errors';

import { UsersCollection } from '../db/models/userModel.js';
import { SessionsCollection } from '../db/models/sessionModel.js';

export const getAllUsersService = async () => {
  const users = await UsersCollection.find();
  return users;
};

export const getUserByIdService = async (userId) => {
  const user = await UsersCollection.findById(userId);

  if (!user) throw createHttpError(404, 'User not found!');

  return user;
};

export const createUserService = async ({ name, tel, role, password }) => {
  const user = await UsersCollection.findOne({ tel: tel });

  if (user) throw createHttpError(409, 'Phone in use!');

  const encryptedPassword = await bcrypt.hash(password, 10);
  return await UsersCollection.create({
    name,
    tel,
    role,
    password: encryptedPassword,
  });
};

export const patchUserService = async (userId, updateData) => {
  const user = await UsersCollection.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  });
  if (!user) throw createHttpError(404, 'User not found!');
  return user;
};

export const changeUserPasswordService = async (userId, newPass) => {
  const user = await UsersCollection.findById(userId);
  if (!user) throw createHttpError(404, 'User not found!');

  const encryptedNewPassword = await bcrypt.hash(newPass, 10);

  user.password = encryptedNewPassword;
  await user.save();

  await SessionsCollection.deleteOne({ userId: user._id });
};

export const deleteUserService = async (userId) => {
  const user = await UsersCollection.findByIdAndDelete(userId);
  if (!user) throw createHttpError(404, 'User not found!');
};
