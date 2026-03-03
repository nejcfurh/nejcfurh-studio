import { cronJobs } from 'convex/server';

import { internal } from './_generated/api';

const crons = cronJobs();

crons.interval(
  'delete-marked-files',
  { minutes: 1 }, // 1 minute
  internal.files.deleteMarkedFilesForDeletion
);

export default crons;
