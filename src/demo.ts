import { extract } from './extract';
import { translate } from './translate';
import * as fs from 'fs';

import * as dotenv from 'dotenv';

const config = dotenv.config();

async function main() {
  const words = extract({
    path: 'example',
    excludes: ['\\*.json'],
    excludeDir: ['node_modules'],
    includes: ['\\*.tsx'],
  });
  console.log(words);

  const translateWords = await translate(words, {
    from: 'en',
    locales: ['zh-Hans', 'ja', 'ko', 'it'],
    servicesAccount: {
      private_key: config.parsed!.private_key!,
      client_email: config.parsed!.client_email!,
    },
  });
  fs.writeFileSync('./locales.json', JSON.stringify(translateWords));
}
main();
