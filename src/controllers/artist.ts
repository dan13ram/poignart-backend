import { Artist as artist } from '../models/artist';

import { ArtistInterface } from '../utils/types';

export const createArtist = async (
  record: ArtistInterface
): Promise<ArtistInterface> => {
  const response = await artist.create(record);
  return response;
};

export const updateArtistById = async (
  id: string,
  record: ArtistInterface
): Promise<ArtistInterface> => {
  await artist.updateOne({ _id: id }, { $set: record });
  const updatedArtist = await artist.findById(id);
  return updatedArtist;
};
