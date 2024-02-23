import { bold } from 'colorette';

import { LogHistory, rl } from './logs.utils';

export async function findAndReplaceVariables(
  history: LogHistory,
): Promise<string> {
  let found = false;
  let didPrint = false;

  const linkRegex = /{{([^}]+)}}/gm;
  let matchArr = linkRegex.exec(history.url);
  while (matchArr !== null) {
    const [, name] = matchArr;
    const [key, defVal] = name.split('=');
    let answer = '';
    if (!didPrint) {
      console.log('');
      console.log(bold('Replacing variables:'));
      didPrint = true;
    }

    while (!answer) {
      let q = `${key}: `;
      const previous = history.variables[key] || defVal;
      if (previous) {
        q = `${q} [${previous || defVal}] `;
      }

      answer = (await rl.question(bold(q))) || previous;
      if (answer && answer !== previous) {
        found = true;
        history.variables[key] = answer;
      }
    }

    matchArr = linkRegex.exec(history.url);
  }

  rl.close();

  return history.url.replace(/{{([^}]+)}}/g, (_, capture) => {
    const [key] = capture.split('=');
    return history.variables[key];
  });
}
