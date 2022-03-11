import { utils } from 'ethers';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import { CONFIG } from '../config';

type PoignartRequest = Request & { signer: string };

export const verifyToken = (req: Request): null | string => {
  const { authorization } = req.headers;
  const token = authorization && authorization.split(' ')[1];

  if (!token) {
    return null;
  }

  try {
    const signature = verify(token, CONFIG.JWT_SECRET);
    const address = utils.recoverAddress(
      'Welcome to PoingART!',
      signature as string
    );
    return address;
  } catch (err) {
    return null;
  }
};

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const signer = verifyToken(req);
  if (!signer) {
    res.status(401).json({ error: 'Unauthorized' });
  } else {
    (req as PoignartRequest).signer = signer;
    next();
  }
};
