import * as fs from 'fs';
import * as path from 'path';
import * as shell from 'shelljs';
import * as os from 'os';
import { ShellString } from 'shelljs';

export interface Config {
  path: string;
  keyword?: string;
  includes?: string[];
  excludes?: string[];
  excludeDir?: string[];
}

export function extract(config: Config) {
  const { keyword = 't' } = config;
  const grep = os.platform() === 'darwin' ? 'ggrep' : 'grep';
  const words = [];
  const tempFile = path.join(process.cwd(), `./_translate${+new Date()}.txt`);
  // shell.exec(`chcp 65001`, { silent: true });

  const includesStr = config.includes?.map(item => `--include=${item}`).join(' ') || '';
  const excludesStr = config.excludes?.map(item => `--exclude=${item}`).join(' ') || '';
  const excludeDirStr =
    config.excludeDir?.map(item => `--exclude-dir=${item}`).join(' ') || '';

  const result = shell
    .exec(
      `${grep} -Phrzoe "(?<=[^a-zA-Z]${keyword}\\()[\\n\\s\\t]*([\\"\\\`\\'])([\\d\\D]*?)\\1(?=([\\n\\s\\t]*)[\\),])" ${includesStr} ${excludesStr} ${excludeDirStr} ${config.path}`,
      { silent: true },
    )
    .exec(`${grep} -Pzoe "(?<=([\\"\\\`\\']))[\\d\\D]*(?=\\1)" `, {
      silent: true,
    })
    .to(tempFile) as any as ShellString;

  if (result.code === 1) {
    try {
      fs.rmSync(tempFile);
    } catch (error) {}
    console.log('\x1b[31m', 'No match content');
    return [];
  }
  if (result.code !== 0) throw new Error(result.stderr);

  const content = fs.readFileSync(tempFile, {
    encoding: 'utf-8',
  });
  fs.rmSync(tempFile);
  const groups = content
    .split('\x00')
    .map(item => item.trim())
    .filter(Boolean);
  words.push(...groups);

  return [...new Set(words)];
}
