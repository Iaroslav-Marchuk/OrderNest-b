import { REFRESH_TOKEN_EXP } from '../constants/constants.js';

import {
  changeMyPasswordService,
  getCurrentUserService,
  loginUserService,
  logoutUserService,
  refreshSessionService,
} from '../services/authServices.js';

export const loginUserController = async (req, res) => {
  const { accessToken, refreshToken, user } = await loginUserService(req.body);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + REFRESH_TOKEN_EXP),
    sameSite: 'None',
    secure: true,
    path: '/',
  });

  res.status(200).json({
    message: 'User is successfully logged in!',
    data: { accessToken, user },
  });
};

export const logoutUserController = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (refreshToken) {
    await logoutUserService(refreshToken);
  }

  res.clearCookie('refreshToken', {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
    path: '/',
  });

  res.status(204).end();
};

export const refreshSessionController = async (req, res) => {
  const { refreshToken } = req.cookies;

  const {
    accessToken,
    refreshToken: newRefreshToken,
    user,
  } = await refreshSessionService(refreshToken);

  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + REFRESH_TOKEN_EXP),
    sameSite: 'None',
    secure: true,
    path: '/',
  });

  res.status(200).json({
    message: 'Token refreshed successfully!',
    data: { accessToken, user },
  });
};

export const getCurrentUserController = async (req, res) => {
  const userId = req.user._id;

  const currentUser = await getCurrentUserService(userId);

  res.status(200).json({
    message: 'Current user found!',
    data: { currentUser },
  });
};

export const changeMyPasswordController = async (req, res) => {
  const userId = req.user._id;
  const { oldPass, newPass } = req.body;

  const { accessToken, refreshToken, user } = await changeMyPasswordService(
    userId,
    oldPass,
    newPass,
  );

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + REFRESH_TOKEN_EXP),
    sameSite: 'None',
    secure: true,
    path: '/',
  });

  res.status(200).json({
    message: 'Password changed successfully!',
    data: { accessToken, user },
  });
};
