import assert from 'node:assert/strict';
import { assistantUrl, initialLanguage } from '../src/assistantNavigation.ts';
assert.equal(assistantUrl('zh'), 'https://wikinb.kainnne.com/gemini/?lang=zh-TW');
assert.equal(assistantUrl('en'), 'https://wikinb.kainnne.com/gemini/?lang=en');
assert.equal(initialLanguage('?lang=zh-TW', 'en'), 'zh');
assert.equal(initialLanguage('?lang=en', 'zh'), 'en');
assert.equal(initialLanguage('', 'en'), 'en');
assert.equal(initialLanguage('?lang=invalid', null), 'zh');
console.log('Assistant entry preserves the selected language, including return from WikiNB.');
