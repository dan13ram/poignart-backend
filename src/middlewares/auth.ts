import { constants, utils } from 'ethers';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import { CONFIG } from '@/utils/config';

export interface AuthRequest extends Request {
  signer: string;
}

export const verifyToken = (req: Request): null | string => {
  const { authorization } = req.headers;
  const token = authorization && authorization.split(' ')[1];

  if (!token) {
    return null;
  }

  try {
    const signature = verify(token, CONFIG.JWT_SECRET);
    const address = utils.verifyMessage(
      'Welcome to PoignART!',
      signature.toString()
    );
    return address.toLowerCase();
  } catch (error) {
    console.error('error verify token:', error);
    return null;
  }
};

const UNAUTHENTICATED_URLS = ['/api/status'];

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (UNAUTHENTICATED_URLS.includes(req.originalUrl)) {
    next();
  } else {
    const signer = verifyToken(req);
    if (!signer || signer === constants.AddressZero) {
      res.status(401).json({ error: 'Unauthorized' });
    } else {
      (req as AuthRequest).signer = signer;
      next();
    }
  }
};
