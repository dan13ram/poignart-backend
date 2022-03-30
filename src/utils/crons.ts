import { CronJob } from 'cron';

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

const merkleRootJob = new CronJob(
  '0 0 * * *',
  merkleRootCron,
  null,
  false,
  'UTC'
);

export const getNextDates = () => ({
  lastDate: merkleRootJob.lastDate()?.toUTCString(),
  lastDateEpoch: merkleRootJob.lastDate()?.getTime(),
  nextDate: new Date(merkleRootJob.nextDates().unix() * 1000).toUTCString(),
  nextDateEpoch: merkleRootJob.nextDates().unix() * 1000
});

export const scheduleCrons = async () => {
  await merkleRootCron();
  merkleRootJob.start();
};
