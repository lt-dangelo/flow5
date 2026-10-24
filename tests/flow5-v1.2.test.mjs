import assert from 'node:assert/strict';
import {EXERCISES,PRESETS} from '../src/data.js';
import {t,exerciseText,presetText,levelText} from '../src/i18n.js';
import {validSelection,removeExercise,chooseExercise} from '../src/selection.js';
import {buildPlan,planStats,IntervalEngine} from '../src/engine.js';

const known=new Set(EXERCISES.map(e=>e.id));
assert.equal(PRESETS.length,5);
assert.equal(EXERCISES.length,22);
for(const lang of ['en','de']){
 assert.ok(t(lang,'start'));
 assert.ok(t(lang,'remove'));
 assert.ok(t(lang,'add'));
 assert.ok(t(lang,'finalRestOn',{time:'15 min'}).includes('15 min'));
 for(const e of EXERCISES){
  const local=exerciseText(e,lang);
  assert.ok(local.name && local.group && local.cue && local.tip,`Missing ${lang} exercise ${e.id}`);
 }
 for(const p of PRESETS){assert.ok(presetText(p,lang).name);}
 for(let n=1;n<=3;n++)assert.ok(levelText(n,lang));
}
assert.equal(exerciseText(EXERCISES[0],'en').name,'Squats');
assert.equal(exerciseText(EXERCISES[0],'de').name,'Kniebeugen');

const config={workSec:40,restSec:20,rounds:3,includeFinalRest:true};
const preset=PRESETS[0];
for(let n=1;n<=5;n++){
 const ids=preset.ids.slice(0,n);
 assert.equal(validSelection(ids,known),true);
 const phases=buildPlan(ids,config);
 assert.equal(phases.length,6*n);
 assert.deepEqual(planStats(phases),{workMs:n*120000,restMs:n*60000,totalMs:n*180000});
 assert.equal(phases[0].position,1);
 assert.equal(phases.at(-1).position,n);
 assert.equal(phases.at(-1).round,3);
 assert.equal(planStats(buildPlan(ids,{...config,includeFinalRest:false})).totalMs,n*180000-20000);
 assert.equal(planStats(buildPlan(ids,{...config,restSec:0})).totalMs,n*120000);
}
assert.equal(validSelection([],known),false);
assert.equal(validSelection([...preset.ids,'bearHold'],known),false);
assert.equal(validSelection(['squat','squat'],known),false);
assert.equal(validSelection(['doesNotExist'],known),false);
let ids=[...preset.ids];
for(let i=0;i<4;i++)ids=removeExercise(ids,0);
assert.deepEqual(ids,['mountainClimber']);
assert.deepEqual(removeExercise(ids,0),ids);
assert.deepEqual(removeExercise(ids,-1),ids);
assert.deepEqual(chooseExercise(ids,-1,'squat',known),['mountainClimber','squat']);
assert.deepEqual(chooseExercise(ids,0,'squat',known),['squat']);
assert.equal(chooseExercise(ids,-1,'mountainClimber',known),null);
assert.equal(chooseExercise([...preset.ids],-1,'bearHold',known),null);
assert.equal(chooseExercise(ids,-1,'invalid',known),null);

const one=buildPlan(['squat'],{...config,rounds:2,includeFinalRest:false});
let currentTime=0,completions=0;
const engine=new IntervalEngine(one,{clock:()=>currentTime,onComplete:()=>completions++});
engine.start();
assert.equal(engine.snapshot().totalRemainingMs,100000);
currentTime=41000;engine.tick();
assert.equal(engine.snapshot().phase.kind,'rest');
currentTime=60000;engine.tick();
assert.equal(engine.snapshot().phase.round,2);
engine.pause();currentTime+=60000;engine.tick();
assert.equal(engine.status,'paused');
engine.resume();currentTime+=40000;engine.tick();
assert.equal(engine.status,'completed');
assert.equal(completions,1);
console.log('OK: bilingual UI and 22 exercises; 1–5 workout blocks, duration, persistence helpers, timer');
