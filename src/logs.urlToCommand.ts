import { getDefaults, LogCommand } from './logs.utils';

export function urlToCommand(urlString: string) {
  const { defaultStage } = getDefaults();
  const command: LogCommand = {
    stage: defaultStage,
    filter: '',
    time: 'tail',
    keys: 'all',
    group: '',
  };

  if (!urlString.startsWith('logs:')) {
    return command;
  }

  const url = new URL(urlString);

  if (url.pathname) {
    command.stage = url.pathname;
  }

  let level = 0;
  const filters: string[] = [];
  url.searchParams.forEach((value, key) => {
    if (key === 'level') {
      if (value.toLowerCase() === 'info') {
        level = 20;
      }
      if (value.toLowerCase() === 'warn') {
        level = 30;
      }
      if (value.toLowerCase() === 'error') {
        level = 40;
      }

      filters.push(`$.level > ${level}`);
    } else if (key === 'time') {
      command.time = value;
    } else if (key === 'keys') {
      command.keys = value;
    } else if (key === 'group') {
      command.group = value;
    } else if (key === 'search') {
      command.filter = `"${value}"`;
    } else {
      filters.push(`$.${key} = "${value}"`);
    }
  });

  if (filters.length) {
    if (command.filter) {
      console.warn(
        'Search and other filters are mutually exclusive, ignoring search.',
      );
    }
    command.filter = `{ ${filters.join(' && ')} }`;
  }

  return command;
}
