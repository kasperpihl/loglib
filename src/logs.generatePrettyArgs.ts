import { LogCommand } from './logs.utils';

export function generatePrettyArgs(command: LogCommand) {
  // Args for the pino-pretty command
  const prettyArgs: string[] = [
    'pino-pretty',
    '--colorize',
    '-t',
    'SYS:d/m HH:MM:ss.l',
    '-l',
    '--messageFormat',
    '{msg} ({awsRequestId})',
  ];

  // By default, pino-pretty will show all keys
  if (command.keys.toLowerCase() === 'none') {
    // Hide object
    prettyArgs.push('-H');
  } else if (command.keys && command.keys.toLowerCase() !== 'all') {
    // Show only the specified keys
    const keys = command.keys.split(',');

    // Add level and time if they are not already included
    if (!keys.includes('level')) {
      keys.push('level');
    }
    if (!keys.includes('time')) {
      keys.push('time');
    }

    prettyArgs.push('-I', `${keys.join(',')}`);
  }

  return prettyArgs;
}
