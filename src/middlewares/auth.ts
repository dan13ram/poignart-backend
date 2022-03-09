import { Request, Response, NextFunction } from 'express';
import { verify, sign } from 'jsonwebtoken';

import { CONFIG } from '../config';

export const verifyToken = (req: Request): boolean => {
  const { authorization } = req.headers;
  const token = authorization && authorization.split(' ')[1];

  if (token == null) {
    return false;
  }

  try {
    verify(token, CONFIG.JWT_SECRET);
    return true;
  } catch (err) {
    return false;
  }
};

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  if (!verifyToken(req)) {
    res.status(401).send('Unauthorized');
  } else {
    next();
  }
};
