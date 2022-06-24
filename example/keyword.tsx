import React from 'react';

export function App() {
  const word1 = translate('keyword: Hello');
  const word2 = translate(`keyword: word`);
  const word3 = translate('keyword: Hello, word');
  return (
    <div>
      {word1}
      {word2}
      {word3}
    </div>
  );
}
