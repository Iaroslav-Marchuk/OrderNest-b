import bcrypt from 'bcrypt';

import createHttpError from 'http-errors';

import { UsersCollection } from '../db/models/userModel.js';
import { SessionsCollection } from '../db/models/sessionModel.js';
import { SORT_ORDER } from '../constants/constants.js';
import { calculatePaginationData } from '../utils/parsePaginationParams.js';

export const getUsersService = async ({
  page = 1,
  perPage = 20,
  sortOrder = SORT_ORDER.ASC,
  sortBy = 'createdAt',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;
  const mongoFilter = {};

  if (filter.name) {
    mongoFilter.name = {
      $regex: filter.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      $options: 'i',
    };
  }
  if (filter.tel) {
    mongoFilter.tel = {
      $regex: filter.tel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
    };
  }
  if (filter.role) mongoFilter.role = filter.role;
  if (filter.isActive !== undefined) {
    mongoFilter.isActive = filter.isActive;
  }

  const usersCount = await UsersCollection.countDocuments(mongoFilter);

  const users = await UsersCollection.find(mongoFilter)
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit)
    .lean();

  const paginationData = calculatePaginationData(usersCount, page, perPage);

  return { users, ...paginationData };
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
  const user = await UsersCollection.findById(userId);
  if (!user) throw createHttpError(404, 'User not found!');
  if (user.role === 'admin')
    throw createHttpError(403, 'Cannot modify admin account!');

  const updatedUser = await UsersCollection.findByIdAndUpdate(
    userId,
    updateData,
    {
      new: true,
      runValidators: true,
    },
  );
  return updatedUser;
};

export const resetUserPasswordService = async (userId, newPass) => {
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
