import assert from 'node:assert/strict';
import {buildPlan,IntervalEngine} from '../src/engine.js';

const phases=buildPlan(['squat','pushup'],{workSec:5,restSec:5,rounds:2,includeFinalRest:true});
let now=0;
const completed=[];
let ended=0;
const engine=new IntervalEngine(phases,{
 clock:()=>now,
 onExerciseComplete:phase=>completed.push([phase.exerciseId,phase.round]),
 onComplete:()=>ended++
});
engine.start();
now=5000;engine.tick();
assert.deepEqual(completed,[['squat',1]],'normal work interval counts');
engine.skip(); // skip rest, no exercise event
engine.skip(); // skip pushup work, no exercise event
assert.deepEqual(completed,[['squat',1]],'skipping work or rest never counts');
now=20000;engine.tick(); // catch up rest, squat work, squat rest in one tick
assert.deepEqual(completed,[['squat',1],['squat',2]],'background/catch-up tick counts each naturally elapsed work phase');
now=25000;engine.tick();
assert.deepEqual(completed,[['squat',1],['squat',2],['pushup',2]]);
engine.skip(); // skip final rest; completion is distinct from exercise completion
assert.equal(ended,1);
engine.tick();
assert.equal(completed.length,3,'cannot count again after completion');
// Completion of a final work phase counts even if the plan has no rest.
let instant=0;const last=[];
const single=new IntervalEngine(buildPlan(['plank'],{workSec:5,restSec:0,rounds:1,includeFinalRest:true}),{
 clock:()=>instant,onExerciseComplete:phase=>last.push(phase.exerciseId)
});
single.start();instant=5000;single.tick();single.tick();
assert.deepEqual(last,['plank']);
const skipped=[];
let pausedNow=0;
const paused=new IntervalEngine(buildPlan(['march'],{workSec:5,restSec:0,rounds:1,includeFinalRest:true}),{
 clock:()=>pausedNow,onExerciseComplete:p=>skipped.push(p.exerciseId)
});
paused.start();paused.pause();pausedNow=20000;paused.tick();
assert.equal(skipped.length,0,'time spent paused must not count');
paused.skip();
assert.equal(skipped.length,0,'skipped final work must not count');

// Test that the Umami property uses canonical exercise IDs and respects consent.
const previousWindow=globalThis.window,previousStorage=globalThis.localStorage;
try{
 const sent=[],listeners={};
 globalThis.window={location:{pathname:'/preview/v1.3/'},addEventListener:(name,fn)=>{listeners[name]=fn}};
 let permitted=false;
 globalThis.localStorage={getItem:()=>permitted?'yes':'no'};
 const {trackExerciseCompleted}=await import('../src/analytics.js?exercise-completion-test');
 assert.equal(trackExerciseCompleted('squat'),false,'no consent = no tracking');
 permitted=true;
 assert.equal(trackExerciseCompleted('squat'),true,'queue when script is loading');
 assert.equal(trackExerciseCompleted('pushup'),true,'multiple events can queue');
 globalThis.window.umami={track:(...params)=>{sent.push(params);return Promise.resolve();}};
 listeners['pick5go:analyticsready']();
 assert.deepEqual(sent.map(x=>x[0]),['exercise_completed','exercise_completed']);
 assert.deepEqual(sent[0][1],{environment:'preview',exercise_id:'squat'});
 assert.deepEqual(sent[1][1],{environment:'preview',exercise_id:'pushup'});
 assert.equal(trackExerciseCompleted(''),false);
 assert.equal(trackExerciseCompleted('unknown id with spaces'),false);
 assert.equal(trackExerciseCompleted('plank'),true);
 assert.equal(sent.length,3);
 globalThis.localStorage.getItem=()=> 'no';
 assert.equal(trackExerciseCompleted('squat'),false,'consent revoked');
 assert.equal(sent.length,3);
}finally{
 if(previousWindow===undefined)delete globalThis.window;else globalThis.window=previousWindow;
 if(previousStorage===undefined)delete globalThis.localStorage;else globalThis.localStorage=previousStorage;
}
console.log('OK: only elapsed exercise phases count, skips/pauses excluded, consented Umami event payload');