/* eslint-disable @typescript-eslint/no-require-imports */

const weblateSyncLocal = require('weblate-sync-tool');
const dotenv = require('dotenv');

dotenv.config();

const config = {
  weblateApiKey: process.env.WEBLATE_API_KEY_WEB,
  weblateProjectUrl: 'https://weblate.cl3tusdev.com/api',
  weblateProject: 'blindtus',
  weblateComponent: 'web',
  supportedLanguages: ['en', 'fr'],
  translationFunction: ['__', '__.rich'],
  sourceDirectory: 'src',
  localesDirectory: 'src/locales',
  temporaryDirectory: 'locales_tmp',
};

weblateSyncLocal(config);
