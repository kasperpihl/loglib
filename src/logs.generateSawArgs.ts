import { getDefaults, LogCommand } from './logs.utils';

/**
 * Generate the CLI args for the log command
 */
export function generateSawArgs(logGroup: string, command: LogCommand) {
  const { getProfile } = getDefaults();
  const profile = getProfile(command.stage);

  // Args for the log command
  const sawArgs: string[] = ['saw', 'watch', logGroup];

  if (command.time && command.time !== 'tail') {
    sawArgs[1] = 'get';
    sawArgs.push('--rawString');

    const [start, stop] = command.time.split(',');
    sawArgs.push('--start', start);

    if (stop) {
      sawArgs.push('--stop', stop);
    }
  } else {
    sawArgs.push('--raw');
  }

  if (command.filter) {
    sawArgs.push('--filter', command.filter);
  }

  if (profile) {
    sawArgs.push(`--profile`, profile);
  }

  return sawArgs;
}
