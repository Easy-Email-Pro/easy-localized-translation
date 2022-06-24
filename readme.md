# extract-i18n

## Introduction

Based on `grep`, extract text from project directory

## Install

```sh
$ npm install --save-dev extract-i18n
```

or

```sh
$ yarn add -D extract-i18n
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
  const word2 = t(`word`);
  const word3 = t('Hello, word');
  return (
    <div>
      {word1}
      {word2}
      {word3}
    </div>
  );
}
```

```tsx
import { extract } from 'extract-i18n';

const words = extract({
  path: 'example', // your folder/file
});

console.log(words);

//output
// ['Hello', 'word', 'Hello, word'];
```
