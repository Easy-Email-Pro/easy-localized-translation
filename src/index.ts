import * as fs from 'fs';
import * as path from 'path';
import * as shell from 'shelljs';
import * as os from 'os';

export interface Config {
  path: string;
  keyword?: string;
}

export function extract(config: Config) {
  const { keyword = 't' } = config;
  const grep = os.platform() === 'darwin' ? 'ggrep' : 'grep';
  const words: string[] = [];
  const tempFile = path.join(process.cwd(), `./_translate${+new Date()}.txt`);
  shell
    .exec(
      `${grep} -Phrzoe "(?<=[^a-zA-Z]${keyword}\\()[\\n\\s\\t]*([\\"\`\\'])([\\d\\D]*?)\\1(?=([\\n\\s\\t]*)[\\),])" ${config.path}`,
      { silent: true },
    )
    .exec(`${grep} -Pzoe "(?<=([\\"\\\`\\']))[\\d\\D]*(?=\\1)" `, { silent: true })
    .to(tempFile);
  const content = fs.readFileSync(tempFile, {
    encoding: 'utf-8',
  });
  fs.rmSync(tempFile);
  const groups = content.split('\x00').filter(Boolean);
  words.push(...groups);

  return [...new Set(words)];
}
