import createHttpError from 'http-errors';

export const checkRole =
  (...roles) =>
  (req, res, next) => {
    console.log('user role:', req.user.role);
    console.log('allowed roles:', roles);
    if (!roles.includes(req.user.role)) {
      return next(createHttpError(403, 'Forbidden'));
    }
    next();
  };
