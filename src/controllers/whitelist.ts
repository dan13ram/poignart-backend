import { Whitelist } from '@/models/whitelist';
import { WhitelistInterface } from '@/utils/types';

export const createWhitelist = async (
  artistAddress: string,
  whitelistAddress: string | undefined
): Promise<WhitelistInterface> => {
  const record: WhitelistInterface = {
    createdBy: artistAddress,
    ethAddress: whitelistAddress?.toLowerCase() ?? ''
  };
  const artist = await Whitelist.create(record);
  return artist;
};
