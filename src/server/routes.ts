import { createArtist } from 'controllers/artist';
import { createVoucher, getNextTokenID } from 'controllers/voucher';
import express, { Request, Response } from 'express';
import { AuthRequest } from 'middlewares/auth';
import { Artist } from 'models/artist';
import { getSnapshot } from 'utils/snapshot';

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
    const verified = snapshot.verifyAddress(address, proof);

    res
      .status(200)
      .json({ response: { verified, proof, artist, nextTokenID } });
  } catch (err) {
    console.error('Error verifying artist:', (err as Error)?.message ?? err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const handleMongoError = (res: Response, err: unknown) => {
  if (['ValidationError', 'DuplicateKeyError'].includes((err as Error)?.name)) {
    res.status(400).json({ error: (err as Error).message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

ROUTES.post('/artist', async (req: Request, res: Response) => {
  try {
    const response = await createArtist(req.body);
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

export { ROUTES };
