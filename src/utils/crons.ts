import cron from 'node-cron';

import { getSnapshot } from '@/utils/snapshot';

const merkleRootCron = async () => {
  try {
    console.log('merkle root cron', new Date().toUTCString());
    await getSnapshot(true);
  } catch (error) {
    console.error(
      'error updating merkle root:',
      (error as { error: { reason: string } })?.error?.reason ??
        (error as Error)?.message ??
        error
    );
  }
};

export const scheduleCrons = async () => {
  await merkleRootCron();
  cron.schedule('0 0 * * *', merkleRootCron);
};
