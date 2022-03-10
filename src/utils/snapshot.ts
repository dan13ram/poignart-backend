import keccak256 from 'keccak256';
import { promises as fs } from 'fs';
import path from 'path';
import MerkleTree from 'merkletreejs';
import { getAddress, solidityKeccak256 } from 'ethers/lib/utils';

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

  public verifyAddress(address: string, proof: string[]) {
    const leaf = generateLeaf(address);
    const root = this.getMerkleRoot();
    return this.merkleTree.verify(proof, leaf, root);
  }
}

const whitelistFile = path.join(__dirname, 'whitelist.txt');

let snapshot: Snapshot;

export const getSnapshot = async (rebuild = false): Promise<Snapshot> => {
  if (snapshot && !rebuild) return snapshot;
  const data = await fs.readFile(whitelistFile);

  // TODO fetch this from mongodb and add api to add to it
  const additionalAddresses = ['0xc9f2d9adfa6c24ce0d5a999f2ba3c6b06e36f75e'];

  const addresses = data
    .toString()
    .split('\n')
    .concat(...additionalAddresses)
    .filter(a => !!a);

  snapshot = new Snapshot(addresses);

  return snapshot;
};
