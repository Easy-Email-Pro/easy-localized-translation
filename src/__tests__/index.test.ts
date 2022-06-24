import * as path from 'path';
import { extract } from '../index';

describe('Test extract', () => {
  test('rener as expect when path is folder', () => {
    const words = extract({
      path: path.resolve(process.cwd(), 'example'),
    });
    expect(words).toEqual(['Hello', 'word', 'Hello, word']);
  });

  test('rener as expect when path is file', () => {
    const words = extract({
      path: path.resolve(process.cwd(), 'example/default.tsx'),
    });
    expect(words).toEqual(['Hello', 'word', 'Hello, word']);
  });

  test('rener as expect when keyword', () => {
    const words = extract({
      path: path.resolve(process.cwd(), 'example'),
      keyword: 'translate',
    });
    expect(words).toEqual(['keyword: Hello', 'keyword: word', 'keyword: Hello, word']);
  });
  test('rener as expect when extract empty', () => {
    const words = extract({
      path: path.resolve(process.cwd(), 'example/empty.tsx'),
    });
    expect(words).toEqual([]);
  });
});
