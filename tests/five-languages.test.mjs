
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {EXERCISES,PRESETS} from '../src/data.js';
import {LANGUAGES,normalizeLang,localeFor,t,exerciseText,presetText} from '../src/i18n.js';
import {UI_EXTRA} from '../src/locales-ui.js';
import {EXERCISE_EXTRA} from '../src/locales-exercises.js';
import {pickerChoices} from '../src/selection.js';
import {buildPlan,planStats} from '../src/engine.js';

const codes=['en','de','it','fr','es'];
assert.deepEqual(LANGUAGES.map(l=>l.code),codes);
assert.equal(normalizeLang('xx'),'en');
for(const lang of codes){
 assert.ok(localeFor(lang).startsWith(lang));
 for(const key of Object.keys(UI_EXTRA.it)){
  const string=t(lang,key,{time:'15 min'});
  assert.ok(typeof string==='string'&&string.trim(),lang+' missing UI '+key);
  assert.ok(!string.includes('{time}'),lang+' interpolated '+key);
 }
 const localized=EXERCISES.map(e=>exerciseText(e,lang));
 assert.equal(localized.length,27);
 for(const ex of localized){
  assert.ok(ex.name&&ex.group&&ex.cue&&ex.tip,lang+' '+ex.id);
  assert.ok(ex.cue.length<=175,lang+' verbose cue '+ex.id);
 }
 const choices=pickerChoices(localized,['squat','plank'],'',lang);
 assert.equal(choices.length,25);
 assert.ok(!choices.some(e=>['squat','plank'].includes(e.id)));
 for(const preset of PRESETS)assert.ok(presetText(preset,lang).name);
}
for(const lang of ['it','fr','es']){
 assert.equal(Object.keys(EXERCISE_EXTRA[lang]).length,27);
 assert.equal(Object.keys(UI_EXTRA[lang]).length,100);
}
assert.equal(t('en','footer'),'Your exercise choices stay on your device. No registration, no setup, no personal workout history');
const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const sw=readFileSync(new URL('../sw.js',import.meta.url),'utf8');
assert.ok(app.includes('next.includeFinalRest=true'),'stored preferences must be overridden');
assert.ok(app.includes('includeFinalRest:true};}'),'all plans must include final rest');
assert.ok(!app.includes('data-config="includeFinalRest"'),'remove obsolete final-rest toggle');
assert.ok(!app.includes('class="intro-stats"'),'remove timer/screen-wake labels');
assert.ok(!app.includes('class="footnote"'),'remove orphan asterisk footnote');
assert.ok(app.includes('data-language'),'language choice must be interactive');
assert.ok(app.includes('document.documentElement.lang=prefs.lang'));
assert.ok(sw.includes('pick5go-v1.3-preview-39'));
for(const module of ['locales-ui.js','locales-exercises.js'])assert.ok(sw.includes('./src/'+module),'offline languages '+module);
const plan=buildPlan(['squat','plank'],{workSec:40,restSec:20,rounds:3,includeFinalRest:true});
assert.equal(plan.at(-1).kind,'rest');
assert.equal(planStats(plan).totalMs,6*60000);
console.log('OK: 5 languages, 27 exercises, preset/picker coverage, fixed final rest, offline locale modules');
