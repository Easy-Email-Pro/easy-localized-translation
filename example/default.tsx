import React from 'react';

export function App() {
  const word1 = t('Hello');
  const word2 = t(`word`);
  const word3 = t('Hello, word');
  const word4 = t(`The subscriber will see this email as the FROM address of the email.
  You will receive a confirmation email if you haven't confirmed this address earlier.`);
  return (
    <div>
      {word1}
      {word2}
      {word3}
      {word4}
    </div>
  );
}
