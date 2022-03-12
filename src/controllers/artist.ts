import { Artist } from 'models/artist';
import { ArtistInterface } from 'utils/types';

export const createArtist = async (
  record: ArtistInterface
): Promise<ArtistInterface> => {
  // eslint-disable-next-line no-param-reassign
  record.createdVouchers = [];
  const artist = await Artist.create(record);
  return artist;
};
