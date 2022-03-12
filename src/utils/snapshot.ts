import { getAddress, solidityKeccak256 } from 'ethers/lib/utils';
import { promises as fs } from 'fs';
import keccak256 from 'keccak256';
import MerkleTree from 'merkletreejs';
import path from 'path';

import { Whitelist } from '@/models/whitelist';
import { getMerkleRoot, updateMerkleRoot } from '@/utils/contract';

const unique = (a: Array<string>): Array<string> => {
  const seen: Record<string, boolean> = {};
  // eslint-disable-next-line no-return-assign
  return a.filter((item: string) =>
    // eslint-disable-next-line no-prototype-builtins
    seen.hasOwnProperty(item) ? false : (seen[item] = true)
  );
};

const generateLeaf = (address: string): Buffer =>
  Buffer.from(
    // Hash in appropriate Merkle format
    solidityKeccak256(['address'], [address]).slice(2),
    'hex'
  );

class Snapshot {
  private merkleTree: MerkleTree;

  private snapshot: string[];

  constructor(snapshot: Array<string>) {
    this.snapshot = snapshot.map(address => getAddress(address));
    this.snapshot = unique(this.snapshot);

    this.merkleTree = new MerkleTree(
      // Generate leafs
      this.snapshot.map(address => generateLeaf(address)),
      // Hashing function
      keccak256,
      { sortPairs: true }
    );
  }

  public getMerkleRoot(): string {
    return this.merkleTree.getHexRoot();
  }

  public getMerkleProof(address: string): string[] {
    const leaf = generateLeaf(address);
    return this.merkleTree.getHexProof(leaf);
  }

  public verifyAddress(address: string) {
    const leaf = generateLeaf(address);
    const proof = this.merkleTree.getHexProof(leaf);
    const root = this.getMerkleRoot();
    return this.merkleTree.verify(proof, leaf, root);
  }
}

const updateMerkleRootInContract = async (newRoot: string) => {
  const oldRoot = await getMerkleRoot();

  if (newRoot !== oldRoot) {
    console.log('merkle root has changed, updating...');
    await updateMerkleRoot(newRoot);
    console.log('updated merkle root');
    console.log('old root:', oldRoot);
    console.log('new root:', newRoot);
  } else {
    console.log('merkle root has not changed, skipping...');
  }
};

const whitelistFile = path.join(__dirname, 'whitelist.txt');

let snapshot: Snapshot;

export const getSnapshot = async (rebuild = false): Promise<Snapshot> => {
  if (snapshot && !rebuild) return snapshot;

  const data = await fs.readFile(whitelistFile);

  const addedAddresses: string[] = [];
  const added = await Whitelist.find();
  added.forEach(a => addedAddresses.push(a.ethAddress));

  const addresses = data
    .toString()
    .split('\n')
    .concat(...addedAddresses)
    .filter(a => !!a);

  snapshot = new Snapshot(addresses);

  await updateMerkleRootInContract(snapshot.getMerkleRoot());

  return snapshot;
};
