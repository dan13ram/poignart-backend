import express, { Request, Response } from 'express';

import { createArtist } from '@/controllers/artist';
import {
  createVoucher,
  getNextTokenID,
  redeemVoucher
} from '@/controllers/voucher';
import { createWhitelist } from '@/controllers/whitelist';
import { AuthRequest } from '@/middlewares/auth';
import { Artist } from '@/models/artist';
import { handleMongoError } from '@/utils/helpers';
import { getSnapshot } from '@/utils/snapshot';

const ROUTES = express.Router();

ROUTES.get('/verify', async (req: Request, res: Response) => {
  try {
    const address = (req as AuthRequest).signer;
    const [snapshot, artist, nextTokenID] = await Promise.all([
      getSnapshot(),
      Artist.findOne({
        ethAddress: address
      }).populate('createdVouchers'),
      getNextTokenID()
    ]);
    const proof = snapshot.getMerkleProof(address);
    const verified = snapshot.verifyAddress(address);

    res
      .status(200)
      .json({ response: { verified, proof, artist, nextTokenID } });
  } catch (err) {
    console.error('Error verifying artist:', (err as Error)?.message ?? err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

ROUTES.post('/artist', async (req: Request, res: Response) => {
  try {
    const address = (req as AuthRequest).signer;
    const snapshot = await getSnapshot();
    const verified = snapshot.verifyAddress(address);
    if (!verified || address !== req.body.ethAddress?.toLowerCase()) {
      const e = new Error(`Artist validation failed: not whilelisted`);
      e.name = 'ValidationError';
      throw e;
    }
    const response = await createArtist(address, req.body);
    res.status(201).json(response);
  } catch (err) {
    console.error('Error creating artist:', (err as Error)?.message ?? err);
    handleMongoError(res, err);
  }
});

ROUTES.post('/voucher', async (req: Request, res: Response) => {
  try {
    const nextTokenID = await getNextTokenID();
    if (Number(req.body.tokenID) !== nextTokenID) {
      const e = new Error(
        `Voucher validation failed: tokenID: Next available tokenID is ${nextTokenID} (${req.body.tokenID})`
      );
      e.name = 'ValidationError';
      throw e;
    }
    const address = (req as AuthRequest).signer;
    const response = await createVoucher(address, req.body);
    res.status(201).json(response);
  } catch (err) {
    console.error('Error creating voucher:', (err as Error)?.message ?? err);
    handleMongoError(res, err);
  }
  getNextTokenID(true); // rebuild cache
});

ROUTES.put('/redeem', async (req: Request, res: Response) => {
  try {
    const address = (req as AuthRequest).signer;
    const response = await redeemVoucher(address, req.body);
    res.status(201).json(response);
  } catch (err) {
    console.error('Error redeeming voucher:', (err as Error)?.message ?? err);
    handleMongoError(res, err);
  }
  getNextTokenID(true); // rebuild cache
});

ROUTES.post('/whitelist', async (req: Request, res: Response) => {
  try {
    const address = (req as AuthRequest).signer;
    const snapshot = await getSnapshot();
    const verified = snapshot.verifyAddress(address);
    if (!verified) {
      const e = new Error(`Whitelist validation failed: not whilelisted`);
      e.name = 'ValidationError';
      throw e;
    }
    const response = await createWhitelist(address, req.body.ethAddress);
    res.status(201).json(response);
  } catch (err) {
    console.error(
      'Error whitelisting address:',
      (err as Error)?.message ?? err
    );
    handleMongoError(res, err);
  }
});

export { ROUTES };
