# easy-localized-translation

## Introduction

Based on `grep`, extract text from project directory

## Install

```sh
$ npm install --save-dev easy-localized-translation
```

or

```sh
$ yarn add -D easy-localized-translation
```

### Noted

If you are using a Mac, you need to install `grep`

```bash
brew install grep
```

## Usage

example/default.ts

```tsx
import React from 'react';

export function App() {
  const word1 = t('Hello');
  const word2 = t(`world`);
  const word3 = t('Hello, world');
  return (
    <div>
      {word1}
      {word2}
      {word3}
    </div>
  );
}
```

### Extract

```tsx
import { extract, translate } from 'easy-localized-translation';

const words = extract({
  path: 'example', // your folder/file
});

console.log(words);

//output
// ['Hello', 'word', 'Hello, word'];
```

### Translate

```tsx
import { extract, translate } from 'easy-localized-translation';

// Need google services account with spreadsheet permission
const translateWords = await translate(words, {
  from: 'en',
  locales: ['zh-Hans', 'ja', 'ko', 'it'],
  servicesAccount: {
    private_key: process.env.private_key!,
    client_email: process.env.client_email!,
  },
});

//output
// {
//   "en": { "Hello": "Hello", "world": "world", "Hello, world": "Hello, world" },
//   "zh-Hans": { "Hello": "你好", "world": "世界", "Hello, world": "你好世界" },
//   "ja": { "Hello": "こんにちは", "world": "世界", "Hello, world": "こんにちは世界" },
//   "ko": { "Hello": "안녕하십니까", "world": "세계", "Hello, world": "안녕하세요, 세상" },
//   "it": { "Hello": "Ciao", "world": "mondo", "Hello, world": "Ciao mondo" }
// }
```
