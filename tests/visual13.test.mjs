import assert from 'node:assert/strict';
import {illustration13,isStudy} from '../src/art13.js';
import {recoveryIllustration} from '../src/recovery13.js';
import {buildPlan,planStats} from '../src/engine.js';
for(const pose of ['squat','pushup','plank']){
 const svg=illustration13(pose,pose,'en');
 assert.match(svg,/<svg/);
 assert.match(svg,/viewBox="0 0 540 322"/);
 assert.match(svg,/#[0-9A-F]{6}/);
 assert.equal(isStudy(pose),true);
}
assert.match(illustration13('squat','Squats'),/marker-end/);
assert.match(illustration13('pushup','Push-ups'),/marker-end/);
assert.match(illustration13('plank','Plank'),/stroke-dasharray/);
assert.equal(isStudy('lunge'),false);
assert.match(illustration13('lunge','Lunges'),/<svg/);
for(let count=1;count<=5;count++){
 const ids=['squat','pushup','plank','reverseLunge','birdDog'].slice(0,count);
 const stats=planStats(buildPlan(ids,{workSec:40,restSec:20,rounds:3,includeFinalRest:true}));
 assert.equal(stats.totalMs,count*180000);
}
console.log('Flow5 v1.3 visual studies and timer logic: OK');

for(const lang of ['en','de']){
 const svg=recoveryIllustration(lang);
 assert.match(svg,/study-recovery/);
 assert.match(svg,/viewBox="0 0 540 322"/);
 assert.match(svg,/stroke-dasharray/);
 assert.doesNotMatch(svg,/<text/);
}
const lastRest=buildPlan(['squat'],{workSec:40,restSec:20,rounds:1,includeFinalRest:true}).at(-1);
assert.equal(lastRest.kind,'rest');
assert.equal(lastRest.exerciseId,'squat');
assert.equal(buildPlan(['squat'],{workSec:40,restSec:20,rounds:1,includeFinalRest:false}).at(-1).kind,'work');
