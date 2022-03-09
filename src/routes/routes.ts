import express, { Request, Response } from 'express';
import multer from 'multer';
import { createArtist } from '../controllers/artist';
import { createToken } from '../controllers/token';
import { uploadToPinataAndCallContract } from '../utils/pinata';

const upload = multer({ dest: 'data/uploads/' });

const ROUTES = express.Router();

interface MulterRequest extends Request {
  file: any;
}

ROUTES.get(
  'creator/mint',
  upload.single('image'),
  (req: MulterRequest, res: Response) => {
    uploadToPinataAndCallContract(req.body.address, req.file.filename);
    res.send('success');
  }
);

ROUTES.post('creator/verify', (req: Request, res: Response) => {
  res.send('verify');
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

export default ROUTES;
