import {
  GoogleSpreadsheet,
  GoogleSpreadsheetRow,
  GoogleSpreadsheetWorksheet,
} from 'google-spreadsheet';

import { set } from 'lodash';

const PLEACE_HOLDER_BEGIN = '{\n\n\n';
const REG_PLEACE_HOLDER_BEGIN = '\\{\\n\\n\\n';
const PLEACE_HOLDER_END = '\n\n\n}';
const REG_PLEACE_HOLDER_END = '\\n\\n\\n\\}';

export const translate = async (
  allWords: string[],
  params: {
    from: Locales;
    locales: Locales[];
    servicesAccount: {
      private_key: string;
      client_email: string;
    };
  },
) => {
  const { locales, from, servicesAccount } = params;
  if (allWords.length === 0) {
    throw new Error('Empty words');
  }
  if (locales.length === 0) {
    throw new Error('Empty locales');
  }
  const doc = new GoogleSpreadsheet();
  await doc.useServiceAccountAuth(servicesAccount);

  await doc.createNewSpreadsheetDocument({ title: 'translate' });

  const automationSheet = doc.sheetsByIndex[0];

  const newWordsText = allWords
    .map((item, index) => `${PLEACE_HOLDER_BEGIN}${item}${PLEACE_HOLDER_END}`)
    .join('\n');

  const rows = [newWordsText].map((word, index) => {
    const rowIndex = index + 2;
    return [
      `=B${rowIndex}`, // key
      word, // from
      ...locales.map((_, sIndex) => {
        const currentIndex = sIndex + 1;

        // =GOOGLETRANSLATE($B2,$B$1,D$1)
        return `=GOOGLETRANSLATE($B${rowIndex}, $B$1, ${getCellCharCodeByIndex(
          currentIndex + 1,
        )}$1)`;
      }),
    ];
  });

  try {
    await automationSheet.setHeaderRow(['key', from, ...locales]);
    await automationSheet.addRows(rows, {
      insert: true,
      raw: false,
    });
    const rawRows = await getSheetData(automationSheet);
    const formatData = Object.keys(rawRows).map(item => {
      return {
        lan: item,
        value: rawRows[item],
      };
    });

    const map: Record<string, any> = {};

    formatData.forEach(item => {
      if (!map[item.lan]) {
        map[item.lan] = {};
      }
      const key = Object.keys(item.value)[0];
      const value = Object.values(item.value)[0];

      const keys = key.match(
        new RegExp(
          `(?<=(${REG_PLEACE_HOLDER_BEGIN}))([\\d\\D]+?)(?=(${REG_PLEACE_HOLDER_END}))`,
          'img',
        ),
      );
      if (!keys) {
        throw new Error(`keys: ${item.lan}`);
      }

      const words = value.match(
        new RegExp(
          `(?<=(${REG_PLEACE_HOLDER_BEGIN}))([\\d\\D]+?)(?=(${REG_PLEACE_HOLDER_END}))`,
          'img',
        ),
      );
      if (!words) {
        throw new Error(`value: ${item.lan}`);
      }

      if (keys.length !== allWords.length || words.length !== allWords.length) {
        const missingWords = allWords.filter(item => !keys.includes(item));
        throw new Error(`lan ${item.lan}：missing words: ${missingWords.join(', ')}`);
      }

      keys.forEach((k, index) => {
        map[item.lan][k] = words[index];
      });
    });

    await automationSheet.clear();

    return map;
  } catch (error) {
    await automationSheet.clear();
    throw error;
  }
};

async function getSheetData(sheet: GoogleSpreadsheetWorksheet) {
  const rawRows = await sheet.getRows();
  const languageCodeMap: Record<
    string,
    Record<string, string>
  > = getLanguageCodeMapFromRow(rawRows[0]);
  const mapData: Record<string, Record<string, string>> = {};
  for (let i = 0; i < rawRows.length; i++) {
    const rawRow = rawRows[i];
    const translationKey = rawRow.key;

    // skip if row should be ignored
    if (translationKey.indexOf('ignore') !== -1) {
      continue;
    }

    const languageCodeMapKeys = Object.keys(languageCodeMap);
    for (let j = 0; j < languageCodeMapKeys.length; j++) {
      const languageCodeKey = languageCodeMapKeys[j];
      const languageCodeValue = languageCodeMap[languageCodeKey];
      const translatedString = rawRow[languageCodeValue as any];
      if (!mapData[languageCodeKey]) {
        mapData[languageCodeKey] = {};
      }
      mapData[languageCodeKey][translationKey] = translatedString;
    }
  }

  return mapData;
}

function getLanguageCodeMapFromRow(rawRow: GoogleSpreadsheetRow) {
  if (!rawRow) return {};
  const keys = Object.keys(rawRow);
  const map = {};
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (key === 'key' || key.startsWith('_')) {
      continue;
    }
    set(map, key, key);
  }
  return map;
}

const getCellCharCodeByIndex = (n: number) => {
  const ordA = 'A'.charCodeAt(0);
  const ordZ = 'Z'.charCodeAt(0);
  const len = ordZ - ordA + 1;
  let s = '';
  while (n >= 0) {
    s = String.fromCharCode((n % len) + ordA) + s;
    n = Math.floor(n / len) - 1;
  }
  return s;
};

export type Locales =
  | 'en'
  | 'zh-Hans'
  | 'zh-Hant'
  | 'da'
  | 'nl'
  | 'fr'
  | 'de'
  | 'hu'
  | 'it'
  | 'pt'
  | 'ru'
  | 'es'
  | 'sv'
  | 'hr'
  | 'cs'
  | 'fi'
  | 'el'
  | 'ja'
  | 'ko'
  | 'nb'
  | 'pl'
  | 'ro'
  | 'tr'
  | 'id'
  | 'sl'
  | 'sk'
  | 'bg'
  | 'th'
  | 'ar'
  | 'he'
  | 'ca'
  | 'ms'
  | 'vi'
  | 'hi'
  | 'uk'
  | 'lt'
  | 'sr'
  | 'lv'
  | 'et';
