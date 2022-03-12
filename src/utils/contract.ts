import { ethers } from 'ethers';
import { CONFIG } from 'utils/config';

export const verifyOwnership = async (
  minterAddress: string,
  tokenID: number
): Promise<boolean> => {
  const abi = new ethers.utils.Interface([
    'function ownerOf(tokenId uint256) public view returns (address)'
  ]);

  const contract = new ethers.Contract(
    CONFIG.POIGNART_CONTRACT,
    abi,
    CONFIG.CRON_WALLET
  );

  const ownerAddress = await contract.ownerOf(tokenID);
  return minterAddress === ownerAddress.toLowerCase();
};

export const ensureValidCronWallet = async (): Promise<void> => {
  const balance = await CONFIG.CRON_WALLET.getBalance();
  if (balance.lte(0)) {
    throw new Error('CRON_PRIVATE_KEY must have non-zero balance');
  }

  const abi = new ethers.utils.Interface([
    'function CRON_JOB() public view returns (bytes32)',
    'function hasRole(bytes32 role, address account) public view returns (bool)'
  ]);

  const contract = new ethers.Contract(
    CONFIG.POIGNART_CONTRACT,
    abi,
    CONFIG.CRON_WALLET
  );

  const { address } = CONFIG.CRON_WALLET;
  const role = await contract.CRON_JOB();

  const hasRole = await contract.hasRole(role, address);

  if (!hasRole) {
    throw new Error('CRON_PRIVATE_KEY must have CRON_JOB role');
  }
};

export const isVettedAddress = async (address: string): Promise<boolean> => {
  const abi = new ethers.utils.Interface([
    'function MINTER_ROLE() public view returns (bytes32)',
    'function hasRole(bytes32 role, address account) public view returns (bool)'
  ]);

  const contract = new ethers.Contract(
    CONFIG.POIGNART_CONTRACT,
    abi,
    CONFIG.CRON_WALLET
  );

  const role = await contract.MINTER_ROLE();

  return contract.hasRole(role, address);
};

export const getMerkleRoot = async (): Promise<string> => {
  const abi = new ethers.utils.Interface([
    'function _merkleRoot() public view returns (bytes32)'
  ]);

  const contract = new ethers.Contract(
    CONFIG.POIGNART_CONTRACT,
    abi,
    CONFIG.CRON_WALLET
  );

  // eslint-disable-next-line no-underscore-dangle
  return contract._merkleRoot();
};

export const updateMerkleRoot = async (
  root: string
): Promise<ethers.providers.TransactionResponse> => {
  const abi = new ethers.utils.Interface([
    'function cronJobRoot(bytes32 newRoot) external'
  ]);

  const contract = new ethers.Contract(
    CONFIG.POIGNART_CONTRACT,
    abi,
    CONFIG.CRON_WALLET
  );

  return contract.cronJobRoot(root);
};
