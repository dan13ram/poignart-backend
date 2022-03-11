import { Artist } from 'models/artist';
import { ArtistInterface } from 'utils/types';

export const createArtist = async (
  record: ArtistInterface
): Promise<ArtistInterface> => {
  const response = await Artist.create(record);
  return response;
};

export const updateArtistById = async (
  id: string,
  record: ArtistInterface
): Promise<ArtistInterface> => {
  await Artist.updateOne({ _id: id }, { $set: record });
  const updatedArtist = await Artist.findById(id);
  return updatedArtist;
};
