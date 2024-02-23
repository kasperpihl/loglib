import { runCLICommand } from './logs.runCLICommand';
import {
  getHistory,
  LogDefaults,
  printCommand,
  rl,
  saveHistory,
  setupLogs,
} from './logs.utils';
import { bold } from 'colorette';
import { argv } from 'process';

export async function loglib(settings: LogDefaults) {
  setupLogs(settings);
  const history = getHistory();

  const urlString = argv[2];
  if (urlString?.startsWith('logs:')) {
    history.url = urlString;
    await runCLICommand(history);
    return;
  }

  // Clear console and print command
  console.log('');
  console.log('');
  console.log('');

  if (history.savedUrls.length) {
    console.log(bold('Saved Commands:'));
    history.savedUrls.forEach((c, i) => {
      console.log(` ${i + 1} - ${c.name} `);
    });
    console.log('');
  }

  printCommand(history);

  // Choose action
  const answer = await rl.question(`\n${bold('Run command?')} `);

  // Run command
  if (!answer) {
    await runCLICommand(history);
    return;
  }

  // Change command
  if (answer.startsWith('logs:')) {
    history.url = answer;
  }

  // Delete command
  if (answer.toLowerCase() === 'delete') {
    const savedI = history.savedUrls.findIndex((c) => c.url === history.url);

    if (savedI > -1) {
      history.savedUrls.splice(savedI, 1);
    }
  }

  // Save command
  if (answer.toLowerCase() === 'save') {
    // Get name of command
    const name =
      (await rl.question(bold('Name of command? '))) || 'Unnamed command';
    // Save command
    history.savedUrls.push({ url: history.url, name });
  }

  // Choose saved command
  const savedCommand = history.savedUrls[parseInt(answer, 10) - 1];
  if (savedCommand) {
    history.url = savedCommand.url;
  }

  saveHistory(history);

  // Run again
  return await loglib(settings);
}
