import {
  TypedDataDomain,
  TypedDataField
} from '@ethersproject/abstract-signer';
import { Response } from 'express';

import { CONFIG } from '@/utils/config';

export const handleMongoError = (res: Response, err: unknown) => {
  console.log((err as Error).name);
  const { name } = err as Error;
  const { message } = err as Error;
  if (
    name === 'ValidationError' ||
    (name === 'MongoServerError' && message.includes('duplicate key error'))
  ) {
    res.status(400).json({ error: message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getTypedDataOptions = (): {
  domain: TypedDataDomain;
  types: Record<string, Array<TypedDataField>>;
} => {
  const domain: TypedDataDomain = {
    name: 'PoignardVoucher',
    version: '1',
    verifyingContract: CONFIG.POIGNART_CONTRACT,
    chainId: CONFIG.CHAIN_ID
  };

  const types: Record<string, Array<TypedDataField>> = {
    NFTVoucher: [
      { name: 'tokenId', type: 'uint256' },
      { name: 'minPrice', type: 'uint256' },
      { name: 'uri', type: 'string' }
    ]
  };

  return { domain, types };
};
