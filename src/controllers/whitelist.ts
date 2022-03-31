import { WhitelistDocument, WhitelistModel } from '@/models/whitelist';
import { getSnapshot } from '@/utils/snapshot';

export const createWhitelist = async (
  artistAddress: string,
  whitelistAddress: string | undefined
): Promise<WhitelistDocument> => {
  const snapshot = await getSnapshot();
  const verified = snapshot.verifyAddress(artistAddress);
  if (!verified) {
    const e = new Error(`Whitelist validation failed: not whilelisted`);
    e.name = 'ValidationError';
    throw e;
  }
  const record = {
    createdBy: artistAddress,
    ethAddress: whitelistAddress?.toLowerCase() ?? ''
  };
  const artist = await WhitelistModel.create(record);
  return artist;
};
