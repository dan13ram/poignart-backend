/* eslint-disable no-param-reassign */
import { Artist } from '@/models/artist';
import { ArtistInterface } from '@/utils/types';

export const createArtist = async (
  artistAddress: string,
  record: ArtistInterface
): Promise<ArtistInterface> => {
  record.createdVouchers = [];
  record.ethAddress = artistAddress;
  const artist = await Artist.create(record);
  return artist;
};
