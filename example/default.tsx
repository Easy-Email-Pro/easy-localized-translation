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
