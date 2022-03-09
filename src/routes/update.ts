import express, { Request, Response } from 'express';

import { updateArtistById } from '../controllers/artist';
import { updateTokenById } from '../controllers/token';

const UPDATE_ROUTER = express.Router();

UPDATE_ROUTER.patch('/artist/:id', async (req: Request, res: Response) => {
  try {
    await updateArtistById(req.params.id, req.body);
    res.status(200).json(req.body);
  } catch (err) {
    res.status(500).json(err);
  }
});

UPDATE_ROUTER.patch('/token/:id', async (req: Request, res: Response) => {
  try {
    await updateTokenById(req.params.id, req.body);
    res.status(200).json(req.body);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default UPDATE_ROUTER;
