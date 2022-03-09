import { Token as token } from '../models/token';

import { TokenInterface } from '../utils/types';

export const createToken = async (
  record: TokenInterface
): Promise<TokenInterface> => {
  const response = await token.create(record);
  return response;
};

export const updateTokenById = async (
  id: string,
  record: TokenInterface
): Promise<TokenInterface> => {
  await token.updateOne({ _id: id }, { $set: record });
  const updatedToken = await token.findById(id);
  return updatedToken;
};
