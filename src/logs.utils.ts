import {
  bgBlue,
  bgCyan,
  bgGreenBright,
  bgMagenta,
  bgRed,
  bgYellow,
  black,
  white,
} from 'colorette';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { stdin as input, stdout as output } from 'node:process';
import * as readline from 'node:readline/promises';

import { urlToCommand } from './logs.urlToCommand';

export type LogDefaults = {
  getProfile: (stage: string) => string;
  getLogGroup: (stage: string, group: string) => string;
  groups: string[];
  defaultStage: string;
};

export type LogCommand = {
  stage: string;
  filter?: string;
  search?: string;
  time: string;
  keys: string;
  group: string;
};

export type LogHistory = {
  version: number;
  variables: Record<string, string>;
  url: string;
  savedUrls: {
    name: string;
    url: string;
  }[];
};

export const colorGroup = (s: string) => bgMagenta(white(` ${s} `));
export const colorStage = (s: string) => bgRed(white(` ${s} `));
export const colorFilter = (s: string) => bgYellow(black(` ${s} `));
export const colorKeys = (s: string) => bgBlue(black(` ${s} `));
export const colorTime = (s: string) => bgCyan(black(` ${s} `));
export const colorUrl = (s: string) => bgGreenBright(black(` ${s} `));

export const rl = readline.createInterface({ input, output });

export function printCommand(history: LogHistory) {
  const command = urlToCommand(history.url);
  const { getLogGroup } = getDefaults();
  const { stage, filter, time, keys, group } = command;

  const colorFuncs = [
    colorUrl,
    colorGroup,
    colorStage,
    colorFilter,
    colorTime,
    colorKeys,
  ];
  let funcName = 'Custom';
  const savedI = history.savedUrls.findIndex((c) => c.url === history.url);
  if (savedI > -1) {
    funcName = history.savedUrls[savedI].name;
  }

  const names = [funcName, 'Log Group', 'Stage', 'Filter', 'Time', 'Keys'];
  const longestName = names.reduce((a, b) =>
    a.length > b.length ? a : b,
  ).length;
  const values = [
    history.url,
    group ? getLogGroup(stage, group) : '',
    stage,
    filter,
    time,
    keys,
  ];

  names.forEach((n, i) => {
    const cf = colorFuncs[i];
    const padding = ' '.repeat(longestName - n.length);
    const value = values[i] ?? '';
    if (!value) return;
    if (i === 0) console.log(`${cf(n)}  ${padding}${value}`);
    else {
      value.split(',').forEach((v, j) => {
        if (j === 0) {
          console.log(`${cf(n)}  ${padding}${v}`);
        } else {
          console.log(`${' '.repeat(longestName + 4)}${v}`);
        }
      });
    }
  });
}

const defaults: LogDefaults = {
  getProfile: () => '',
  getLogGroup: () => '',
  groups: [],
  defaultStage: '',
};

export function getDefaults() {
  return defaults;
}
export function setupLogs(d: typeof defaults) {
  Object.assign(defaults, d);
}

export function getHistory() {
  try {
    const historyFile = readFileSync(
      join(__dirname, '.log-history.json'),
      'utf-8',
    );
    return JSON.parse(historyFile) as LogHistory;
  } catch (e) {
    const defaultHistory: LogHistory = {
      version: 1,
      variables: {},
      url: 'logs:',
      savedUrls: [],
    };
    return defaultHistory;
  }
}

export function saveHistory(history: LogHistory) {
  writeFileSync(
    join(__dirname, '.log-history.json'),
    JSON.stringify(history),
    'utf-8',
  );
}
