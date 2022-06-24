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
  const result = shell.exec(
    `${grep} -Phrzoe "(?<=[^a-zA-Z]${keyword}\\()[\\n\\s\\t]*([\\"\\\`\\'])([\\d\\D]*?)(?=\\1([\\n\\s]*)(\\)|,))" ${config.path} | ${grep} -Phzoe "(?<=[\\"\\\`\\']).*" > ${tempFile}`,
  );
  if (result.code === 1) {
    fs.rmSync(tempFile);
    console.log('\x1b[31m', 'No match content');
    return [];
  }
  if (result.code !== 0) throw new Error(result.stderr);

  const content = fs.readFileSync(tempFile, {
    encoding: 'utf-8',
  });
  fs.rmSync(tempFile);
  const groups = content.split('\x00').filter(Boolean);
  words.push(...groups);

  return [...new Set(words)];
}
