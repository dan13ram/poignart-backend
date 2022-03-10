import { utils } from 'ethers';
import express, { Request, Response } from 'express';
import { createArtist } from '../controllers/artist';
import { createToken } from '../controllers/token';
import { getSnapshot } from '../utils/snapshot';

const ROUTES = express.Router();

ROUTES.get('/verify', async (req: Request, res: Response) => {
  try {
    const { ethAddress } = req.body;
    if (!utils.isAddress(ethAddress)) {
      res
        .status(400)
        .json({ error: 'Request body must contain a valid "ethAddress"' });
      return;
    }
    const snapshot = await getSnapshot();
    const proof = snapshot.getMerkleProof(ethAddress);
    const verified = snapshot.verifyAddress(ethAddress, proof);
    res.status(200).json({ response: { verified, proof, ethAddress } });
  } catch (err) {
    res.status(500).json(err);
  }
});

ROUTES.post('/artist', async (req: Request, res: Response) => {
  try {
    const response = await createArtist(req.body);
    res.status(201).json(response);
  } catch (err) {
    res.status(500).json(err);
  }
});

ROUTES.post('/token', async (req: Request, res: Response) => {
  try {
    const response = await createToken(req.body);
    res.status(201).json(response);
  } catch (err) {
    res.status(500).json(err);
  }
});

export { ROUTES };
