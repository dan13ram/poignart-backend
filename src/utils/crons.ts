import cron from 'node-cron';
import { getMerkleRoot, updateMerkleRoot } from 'utils/contract';
import { getSnapshot } from 'utils/snapshot';

const computeMerkleRoot = async (): Promise<string> => {
  const snapshot = await getSnapshot(true);
  return snapshot.getMerkleRoot();
};

const merkleRootCron = async () => {
  try {
    console.log('merkle root cron', new Date().toUTCString());
    const oldRoot = await getMerkleRoot();
    const newRoot = await computeMerkleRoot();

    if (newRoot !== oldRoot) {
      console.log('merkle root has changed, updating...');
      await updateMerkleRoot(newRoot);
      console.log(`updated merkle root, oldRoot ${oldRoot} newRoot ${newRoot}`);
    } else {
      console.log('merkle root has not changed, skipping...');
    }
  } catch (error) {
    console.error(
      'error updating merkle root:',
      error?.error?.reason ?? error?.message
    );
  }
};

export const scheduleCrons = async () => {
  await merkleRootCron();
  cron.schedule('0 0 * * *', merkleRootCron);
};
