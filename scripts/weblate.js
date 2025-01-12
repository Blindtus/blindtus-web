// eslint-disable-next-line @typescript-eslint/no-require-imports
const weblateSyncLocal = require('weblate-sync-tool');

const config = {
  weblateApiKey: 'wlu_PbKnP2tzLvW79vbGFEZemelrpIWnWIXJlCtJ',
  weblateProjectUrl: 'https://weblate.cl3tusdev.com/api',
  weblateProject: 'blindtus',
  weblateComponent: 'web',
  supportedLanguages: ['en', 'fr'],
  translationFunction: '__',
  sourceDirectory: 'src',
  localesDirectory: 'src/locales',
  temporaryDirectory: 'locales_tmp',
};

weblateSyncLocal(config);
