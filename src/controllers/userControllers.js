import {
  createUserService,
  deleteUserService,
  getAllUsersService,
  getUserByIdService,
  patchUserService,
  resetUserPasswordService,
} from '../services/userServices.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseUserFilterParams } from '../utils/parseUserFilterParams.js';

export const getAllUsersController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query, [
    'name',
    'role',
    'createdAt',
  ]);
  const filter = parseUserFilterParams(req.query);

  const allUsers = await getAllUsersService({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.status(200).json({
    message: 'Users found successfully!',
    data: allUsers,
  });
};

export const getUserByIdController = async (req, res) => {
  const { userId } = req.params;
  const user = await getUserByIdService(userId);

  res.status(200).json({
    message: 'User found successfully!',
    data: { user },
  });
};

export const createUserController = async (req, res) => {
  const user = await createUserService(req.body);

  res.status(201).json({
    message: 'New user created successfully!',
    data: { user },
  });
};

export const patchUserController = async (req, res) => {
  const { userId } = req.params;

  const updatedUser = await patchUserService(userId, req.body);

  res.status(200).json({
    message: 'User updated successfully!',
    data: { updatedUser },
  });
};

export const resetUserPasswordController = async (req, res) => {
  const { userId } = req.params;
  const { newPass } = req.body;

  await resetUserPasswordService(userId, newPass);

  res.status(200).json({
    message: 'Password changed successfully',
  });
};

export const deleteUserController = async (req, res) => {
  const { userId } = req.params;

  await deleteUserService(userId);

  res.status(204).end();
};
