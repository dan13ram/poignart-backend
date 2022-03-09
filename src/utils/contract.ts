import YourContract from './YourContract.json';

// TODO fetching whitelisted addresses from snapshot
export const clientAddress = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';
export const whitelistAddresses = [clientAddress];

// TODO move to env. This is very unsafe
export const privateKey =
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

// TODO fetch address from env
export const contractAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

export const { abi } = YourContract;
