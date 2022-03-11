import { createArtist } from 'controllers/artist';
import { createVoucher, getNextTokenID } from 'controllers/voucher';
import { utils } from 'ethers';
import express, { Request, Response } from 'express';
import { Artist } from 'models/artist';
import { getSnapshot } from 'utils/snapshot';

const ROUTES = express.Router();

ROUTES.get('/verify/:address', async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    if (!utils.isAddress(address)) {
      res.status(400).json({
        error: 'Request must contain a valid "address" in /verify/:address'
      });
      return;
    }
    const [snapshot, artist, nextTokenID] = await Promise.all([
      getSnapshot(),
      Artist.findOne({ ethAddress: address }).populate('createdNFTs'),
      getNextTokenID()
    ]);
    const proof = snapshot.getMerkleProof(address);
    const verified = snapshot.verifyAddress(address, proof);

    res
      .status(200)
      .json({ response: { verified, proof, artist, nextTokenID } });
  } catch (err) {
    res.status(500).json(err);
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
      // eslint-disable-next-line no-throw-literal
      throw {
        name: 'ValidationError',
        message: `Token validation failed: tokenID: Next available tokenID is ${nextTokenID} (${req.body.tokenID})`
      } as Error;
    }
    const response = await createVoucher(req.body);
    res.status(201).json(response);
  } catch (err) {
    console.error('Error creating voucher:', (err as Error)?.message ?? err);
    handleMongoError(res, err);
  }
  getNextTokenID(true); // rebuild cache
});

export { ROUTES };
