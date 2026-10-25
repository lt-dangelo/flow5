import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {EXERCISES,PRESETS} from '../src/data.js';
import {exerciseText,t} from '../src/i18n.js';
import {pickerChoices,chooseExercise} from '../src/selection.js';

const known=new Set(EXERCISES.map(e=>e.id));
const selected=['squat','pushup','plank','birdDog','bandRow'];
for(const language of ['en','de']){
 const localized=EXERCISES.map(e=>exerciseText(e,language));
 const list=pickerChoices(localized,selected,'',language);
 assert.equal(list.length,EXERCISES.length-selected.length);
 assert.ok(list.every(e=>!selected.includes(e.id)),'selected items hidden in '+language);
 assert.equal(new Set(list.map(e=>e.id)).size,list.length);
 const priorities={'Oberkörper':0,'Upper body':0,'Core':1,'Beine':2,'Legs':2,'Cardio':3};
 for(let i=1;i<list.length;i++){
  const prev=list[i-1],next=list[i];
  const compare=prev.level-next.level || priorities[prev.group]-priorities[next.group] || prev.name.localeCompare(next.name,language);
  assert.ok(compare<=0,`picker sorting failed at ${prev.id}/${next.id} ${language}`);
 }
 const q=pickerChoices(localized,selected,language==='de'?'Beine':'Legs',language);
 assert.ok(q.every(e=>e.group===(language==='de'?'Beine':'Legs')));
 assert.ok(q.every(e=>!selected.includes(e.id)));
 assert.ok(t(language,'healthNotice').length>50);
 assert.ok(t(language,'recordHint').length>15);
}
// Both the currently edited item and any other already selected item remain unselectable.
for(const position of [-1,0,1,2,3,4]){
 for(const picked of selected) assert.equal(chooseExercise(selected,position,picked,known),null);
}
assert.equal(chooseExercise(selected,0,'squat',known),null);
assert.equal(chooseExercise(selected,0,'gluteBridge',known)?.[0],'gluteBridge');
assert.equal(chooseExercise(selected,-1,'gluteBridge',known),null);
const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../styles.css',import.meta.url),'utf8');
assert.match(app,/pickerChoices\(localized,currentIds\(\),swapQuery,prefs.lang\)/);
assert.match(app,/class="health-notice"/);
assert.ok(app.includes("by Lorenzo D'Angelo"));
assert.ok(app.includes('workoutSession={ids,presetId:'));
for(const selector of ['workout-record','record-top','record-stats','record-intervals','record-exercises','record-bottom']){
 assert.ok(app.includes(selector),'record markup missing '+selector);
 assert.ok(css.includes('.'+selector),'record styling missing '+selector);
}
assert.ok(css.includes('.v13-clean .v13-art-heading h1{grid-column:1 / -1'),'long titles require full line');
assert.ok(!app.includes('class="v13-next"'),'redundant up-next row removed');
assert.ok(!app.includes('class="v13-audio-mark"'),'no audio glyph between artwork and controls');
assert.ok(!app.includes('class="record-focus"'),'no focus/level subtitle under Well Done');
assert.ok(!app.includes("T('recordFinalRest')"),'no final rest note on completion record');
assert.ok(!app.includes("performance.stats"),'no claim of measured intensity/volume');
const sw=readFileSync(new URL('../sw.js',import.meta.url),'utf8');
const index=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert.ok(sw.includes('pick5go-v1.3-production-1'));
assert.ok(index.includes('build=1.3.0'));
console.log('OK: unique and ordered picker, bilingual readiness text, long titles, screenshot record');
