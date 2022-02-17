#!/usr/bin/env node

import { run } from './runner';

function handleUncaughtException(err) {
  console.error(
    'It looks like you may have hit a bug in giraffql.'
  );
  console.error('');
  console.error(
    'It would be super helpful if you could report this here: https://github.com/Produce8/giraffql/issues/new'
  );
  console.error('');
  console.error(err.stack);
  process.exit(3);
}

process.on('uncaughtException', handleUncaughtException);

run(process.stdout, process.stdin, process.stderr, process.argv)
  .then(exitCode => process.exit(exitCode))
  .catch(err => handleUncaughtException(err));
