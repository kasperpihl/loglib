import { findAndReplaceVariables } from './logs.findAndReplaceVariables';
import { spawn } from 'child_process';

import { generateCWArgs } from './logs.generateCWArgs';
import { generatePrettyArgs } from './logs.generatePrettyArgs';
import { urlToCommand } from './logs.urlToCommand';
import { getDefaults, LogHistory, saveHistory } from './logs.utils';

export async function runCLICommand(history: LogHistory) {
  // Find variables for the chosen filters
  const replacedUrl = await findAndReplaceVariables(history);

  saveHistory(history);
  const command = urlToCommand(replacedUrl);

  const defaults = getDefaults();

  console.log('');
  console.log('Running...');

  // Filter log groups
  const groups = (command.group?.split(',') ?? []).filter((v) => !!v);

  defaults.groups
    .filter((group) => !groups.length || groups.includes(group))
    .forEach((group) => {
      const logGroup = defaults.getLogGroup(command.stage, group);

      const cwArgs = generateCWArgs(logGroup, command);
      const prettyArgs = generatePrettyArgs(command);

      console.log(cwArgs.join(' '));
      const logThread = spawn(cwArgs[0], cwArgs.slice(1));

      const prettyThread = spawn(prettyArgs[0], prettyArgs.slice(1));

      // Pipe log output to pretty
      logThread.stdout.pipe(prettyThread.stdin);

      // Log output
      prettyThread.stdout.pipe(process.stdout);

      // Errors
      logThread.stderr.pipe(process.stderr);
      prettyThread.stderr.pipe(process.stderr);
    });
}
