import express, { Request, Response } from 'express';

import { createArtist, updateArtist, verifyArtist } from '@/controllers/artist';
import {
  createVoucher,
  redeemVoucher,
  updateVoucher
} from '@/controllers/voucher';
import { createWhitelist } from '@/controllers/whitelist';
import { AuthRequest } from '@/middlewares/auth';
import { getNextDates } from '@/utils/crons';
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

ROUTES.patch('/artist/update', async (req: Request, res: Response) => {
  try {
    const address = (req as AuthRequest).signer;
    const response = await updateArtist(address, req.body);
    res.status(201).json({ response });
  } catch (err) {
    console.error('Error updating artist:', (err as Error)?.message ?? err);
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

ROUTES.patch('/voucher/update', async (req: Request, res: Response) => {
  try {
    const address = (req as AuthRequest).signer;
    const response = await updateVoucher(address, req.body);
    res.status(201).json({ response });
  } catch (err) {
    console.error('Error updating voucher:', (err as Error)?.message ?? err);
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

const WHITELIST_ADMINS = [
  '0x8760E565273B47195F76A22455Ce0B68A11aF5B5', // kyle
  '0xE68967c95f5A9BCcfDd711A2Cbc23Ec958F147Ef', // saimano
  '0x53D7B5bcFcebE7DF3F8d8947be4976D814275a8E', // cyberfox
  '0x9da847cd29d0da97fbfaee0692d336857cf00cd3', // dahveed
  '0x1e9c89aff77215f3ad26bffe0c50d4fdeba6a352' // dan13ram
].map(a => a.toLowerCase());

ROUTES.post('/whitelist', async (req: Request, res: Response) => {
  try {
    const address = (req as AuthRequest).signer;
    if (
      process.env.NODE_ENV !== 'development' &&
      !WHITELIST_ADMINS.includes(address)
    ) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const response = await createWhitelist(address, req.body.ethAddress);
    res.status(201).json({ response: { ...response, status: getNextDates() } });
  } catch (err) {
    console.error(
      'Error whitelisting address:',
      (err as Error)?.message ?? err
    );
    handleMongoError(res, err);
  }
});

ROUTES.get('/status', async (_req: Request, res: Response) => {
  res.status(200).json({ response: { ...getNextDates() } });
});

export { ROUTES };
