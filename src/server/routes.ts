import express, { Request, Response } from 'express';

import { createArtist, verifyArtist } from '@/controllers/artist';
import { createVoucher, redeemVoucher } from '@/controllers/voucher';
import { createWhitelist } from '@/controllers/whitelist';
import { AuthRequest } from '@/middlewares/auth';
import { handleMongoError } from '@/utils/helpers';

const ROUTES = express.Router();

ROUTES.get('/verify', async (req: Request, res: Response) => {
  try {
    const address = (req as AuthRequest).signer;
    const response = await verifyArtist(address);
    res.status(200).json({ response });
  } catch (err) {
    console.error('Error verifying artist:', (err as Error)?.message ?? err);
    handleMongoError(res, err);
  }
});

ROUTES.get('/verify/:address', async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const response = await verifyArtist(address);
    res.status(200).json({ response });
  } catch (err) {
    console.error('Error verifying artist:', (err as Error)?.message ?? err);
    handleMongoError(res, err);
  }
});

ROUTES.post('/artist', async (req: Request, res: Response) => {
  try {
    const address = (req as AuthRequest).signer;
    const response = await createArtist(address, req.body);
    res.status(201).json({ response });
  } catch (err) {
    console.error('Error creating artist:', (err as Error)?.message ?? err);
    handleMongoError(res, err);
  }
});

ROUTES.post('/voucher', async (req: Request, res: Response) => {
  try {
    const address = (req as AuthRequest).signer;
    const response = await createVoucher(address, req.body);
    res.status(201).json({ response });
  } catch (err) {
    console.error('Error creating voucher:', (err as Error)?.message ?? err);
    handleMongoError(res, err);
  }
});

ROUTES.post('/redeem', async (req: Request, res: Response) => {
  try {
    const address = (req as AuthRequest).signer;
    const response = await redeemVoucher(address, Number(req.body.tokenID));
    res.status(201).json({ response });
  } catch (err) {
    console.error('Error redeeming voucher:', (err as Error)?.message ?? err);
    handleMongoError(res, err);
  }
});

ROUTES.post('/whitelist', async (req: Request, res: Response) => {
  try {
    const address = (req as AuthRequest).signer;
    const response = await createWhitelist(address, req.body.ethAddress);
    res.status(201).json({ response });
  } catch (err) {
    console.error(
      'Error whitelisting address:',
      (err as Error)?.message ?? err
    );
    handleMongoError(res, err);
  }
});

export { ROUTES };
