import { Whitelist } from '@/models/whitelist';
import { getSnapshot } from '@/utils/snapshot';
import { WhitelistInterface } from '@/utils/types';

export const createWhitelist = async (
  artistAddress: string,
  whitelistAddress: string | undefined
): Promise<WhitelistInterface> => {
  const snapshot = await getSnapshot();
  const verified = snapshot.verifyAddress(artistAddress);
  if (!verified) {
    const e = new Error(`Whitelist validation failed: not whilelisted`);
    e.name = 'ValidationError';
    throw e;
  }
  const record: WhitelistInterface = {
    createdBy: artistAddress,
    ethAddress: whitelistAddress?.toLowerCase() ?? ''
  };
  const artist = await Whitelist.create(record);
  return artist;
};
