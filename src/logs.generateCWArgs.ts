import { getDefaults, LogCommand } from './logs.utils';

/**
 * Generate the CLI args for the log command
 */
export function generateCWArgs(logGroup: string, command: LogCommand) {
  const { getProfile } = getDefaults();
  const profile = getProfile(command.stage);

  // Args for the log command
  const logArgs: string[] = ['cw', 'tail', logGroup, '-f'];

  if (command.time && command.time !== 'tail') {
    const [start, stop] = command.time.split(',');
    logArgs.push('--start', start);

    if (stop) {
      logArgs.push('--end', stop);
    }
  }

  if (command.filter) {
    logArgs.push('-g', command.filter);
  }

  if (profile) {
    logArgs.push(`--profile=${profile}`);
  }

  return logArgs;
}
