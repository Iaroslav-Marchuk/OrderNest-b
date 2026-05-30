import {
  changeUserPasswordService,
  createUserService,
  deleteUserService,
  getAllUsersService,
  getUserByIdService,
  patchUserService,
} from '../services/userServices.js';

export const getAllUsersController = async (req, res) => {
  const allUsers = await getAllUsersService();

  res.status(200).json({
    message: 'Users found successfully!',
    data: { allUsers },
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
  await createUserService(req.body);

  res.status(201).json({
    message: 'New user created successfully!',
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

export const changeUserPasswordController = async (req, res) => {
  const { userId } = req.params;
  const { newPass } = req.body;

  await changeUserPasswordService(userId, newPass);

  res.status(200).json({
    message: 'Password changed successfully',
  });
};

export const deleteUserController = async (req, res) => {
  const { userId } = req.params;

  await deleteUserService(userId);

  res.status(204).end();
};
