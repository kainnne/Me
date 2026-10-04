import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { navigationThemeReducer as reduce } from '../src/navigationTheme.ts';

for (const mood of ['dream', 'dusk']) {
  for (const first of ['products', 'contact']) {
    const other = first === 'products' ? 'contact' : 'products';
    let state = { menu: null, mood };
    state = reduce(state, { type: 'toggle-menu', menu: first });
    assert.deepEqual(state, { menu: first, mood: 'dusk' });
    assert.equal(reduce(state, { type: 'toggle-mood' }).mood, 'dusk');
    // Switching directly has no intermediate closed/light state.
    state = reduce(state, { type: 'toggle-menu', menu: other });
    assert.deepEqual(state, { menu: other, mood: 'dusk' });
    assert.deepEqual(reduce(state, { type: 'close-menu' }), { menu: null, mood: 'dream' });
    assert.deepEqual(reduce(state, { type: 'toggle-menu', menu: other }), { menu: null, mood: 'dream' });
  }
}
assert.deepEqual(reduce({ menu: null, mood: 'dream' }, { type: 'toggle-mood' }), { menu: null, mood: 'dusk' });
assert.deepEqual(reduce({ menu: null, mood: 'dusk' }, { type: 'toggle-mood' }), { menu: null, mood: 'dream' });
const app = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');
assert.match(app, /navigationRef\.current\.contains\(event\.target as Node\)/);
assert.match(app, /aria-label="主要導覽" ref=\{navigationRef\}/);
const labels = app.slice(app.indexOf('{disciplines.map'), app.indexOf('</motion.div>', app.indexOf('{disciplines.map')));
assert.doesNotMatch(labels, /onClick|switch site colors|切換網站色彩/);
console.log('Navigation: open stays dark, menu switching stays dark, all close paths return light, title toggles, labels are decorative.');
