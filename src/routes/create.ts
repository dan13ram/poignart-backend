import express, { Request, Response } from 'express';
import { createArtist } from '../controllers/artist';
import { createToken } from '../controllers/token';

const ROUTES = express.Router();

ROUTES.post('/artist', async (req: Request, res: Response) => {
  try {
    console.log({ requestBody: req.body });
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

export default ROUTES;
