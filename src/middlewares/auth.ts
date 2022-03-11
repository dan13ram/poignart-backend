import { CONFIG } from 'config';
import { utils } from 'ethers';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

type PoignartRequest = Request & { signer: string };

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
      signature as string
    );
    return address;
  } catch (error) {
    console.error('error verify token:', error);
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
