import { utils } from 'ethers';
import express, { Request, Response } from 'express';
import { createArtist } from '../controllers/artist';
import { createToken } from '../controllers/token';
import { getSnapshot } from '../utils/snapshot';

const ROUTES = express.Router();

ROUTES.get('/verify/:address', async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    if (!utils.isAddress(address)) {
      res.status(400).json({
        error:
          'Request must contain a valid "ethAddress" in /verify/:ethAddress'
      });
      return;
    }
    const snapshot = await getSnapshot();
    const proof = snapshot.getMerkleProof(address);
    const verified = snapshot.verifyAddress(address, proof);
    res.status(200).json({ response: { verified, proof, address } });
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
