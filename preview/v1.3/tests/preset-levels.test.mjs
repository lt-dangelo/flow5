import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {EXERCISES, PRESETS, PRESET_BY_ID, DIFFICULTIES, presetIds} from '../src/data.js';
import {exerciseText,levelText,presetText,t} from '../src/i18n.js';
import {validSelection,chooseExercise} from '../src/selection.js';

const ids=new Set(EXERCISES.map(e=>e.id));
assert.equal(EXERCISES.length,27);
assert.equal(ids.size,27);
assert.deepEqual(PRESETS.map(p=>p.id),['full','core','upper','legs']);
assert.deepEqual(DIFFICULTIES,['beginner','intermediate']);
assert.equal(Object.keys(PRESET_BY_ID).length,4);
for(const preset of PRESETS){
 const beginner=presetIds(preset.id,'beginner');
 const intermediate=presetIds(preset.id,'intermediate');
 assert.equal(beginner.length,5);
 assert.equal(intermediate.length,5);
 assert.equal(validSelection(beginner,ids),true);
 assert.equal(validSelection(intermediate,ids),true);
 assert.notDeepEqual(beginner,intermediate,preset.id+' should change with difficulty');
 for(const id of beginner) assert.equal(EXERCISES.find(e=>e.id===id).level,1,preset.id+' beginner contains '+id);
 for(const id of intermediate) assert.ok(EXERCISES.find(e=>e.id===id).level<=2,preset.id+' intermediate contains advanced '+id);
}
for(const lang of ['en','de']){
 assert.ok(t(lang,'levelHeading'));
 assert.ok(t(lang,'bandRequired'));
 assert.ok(t(lang,'placeholder'));
 assert.ok(levelText(1,lang));
 assert.ok(levelText(2,lang));
 assert.ok(levelText(3,lang));
 for(const e of EXERCISES){
  const translated=exerciseText(e,lang);
  assert.ok(translated.name&&translated.cue&&translated.tip,e.id+' '+lang);
  assert.ok(translated.cue.length<=170,e.id+' '+lang+' cue too long');
 }
 for(const p of PRESETS) assert.ok(presetText(p,lang).name);
}
assert.deepEqual(EXERCISES.filter(e=>e.equipment).map(e=>e.id),['bandRow']);
assert.equal(EXERCISES.find(e=>e.id==='plank').level,2);
assert.equal(EXERCISES.find(e=>e.id==='jumpingJack').level,1);
assert.equal(EXERCISES.find(e=>e.id==='pikePushup').level,3);
assert.ok(chooseExercise(presetIds('legs','beginner'),0,'pikePushup',ids),'manual swap must ignore difficulty filter');
const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const art=readFileSync(new URL('../src/art.js',import.meta.url),'utf8');
assert.ok(app.includes("prefs.custom[currentCustomKey()]"),'edits saved per focus-level combination');
assert.ok(app.includes('data-action="difficulty"'),'difficulty controls present');
assert.ok(!app.includes("try-studies"),'test-only banner removed');
assert.ok(!app.includes("preview-intro"),'test-only banner removed');
assert.ok(app.includes("T('bandRequired')"),'band requirement visible');
assert.ok(app.includes("T('placeholder')"),'workout placeholder is labelled');
assert.ok(art.includes("pose-placeholder"),'lineup placeholder has no misleading squat');
const sw=readFileSync(new URL('../sw.js',import.meta.url),'utf8');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert.ok(sw.includes('flow5-v1.3-preview-28'));
assert.ok(html.includes('build=1.3.28'));
console.log('OK: difficulty presets, equipment flag, placeholders, bilingual cues, caching');
