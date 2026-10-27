import test from 'node:test';
import assert from 'node:assert/strict';
import {EXERCISES,PRESETS} from '../src/data.js';
import {MOVEMENTS,PROGRESSIONS,allowedExercise,adaptWorkout,balanceWarnings,recommendWorkout} from '../src/coach.js';
import {encodeSharedWorkout,decodeSharedWorkout} from '../src/share.js';
const idSet=new Set(EXERCISES.map(e=>e.id));
test('movement metadata covers all curated exercises',()=>{
 assert.deepEqual(Object.keys(MOVEMENTS).sort(),[...idSet].sort());
 for(const [id,variants] of Object.entries(PROGRESSIONS)){
  assert.ok(idSet.has(id));
  for(const other of Object.values(variants))assert.ok(idSet.has(other));
 }
});
test('equipment and quiet filters exclude only unsuitable movements',()=>{
 assert.equal(allowedExercise('bandRow',{equipment:'none'}),false);
 assert.equal(allowedExercise('bandRow',{equipment:'band'}),true);
 assert.equal(allowedExercise('jumpingJack',{quiet:true}),false);
 assert.equal(allowedExercise('mountainClimber',{quiet:true}),false);
 assert.equal(allowedExercise('squat',{equipment:'none',quiet:true}),true);
});
test('presets maintain unique, eligible exercises with no equipment',()=>{
 for(const p of PRESETS)for(const level of ['beginner','intermediate']){
  const start=level==='beginner'?p.ids:p.intermediateIds;
  const ids=adaptWorkout(start,{equipment:'none',quiet:true},p.id,level);
  assert.ok(ids.length>0&&ids.length<=5);
  assert.equal(new Set(ids).size,ids.length);
  assert.ok(ids.every(id=>allowedExercise(id,{equipment:'none',quiet:true})));
 }
});
test('feedback suggests validated progressions without duplication',()=>{
 const session={presetId:'upper',difficulty:'beginner',ids:['wallPushup','gluteBridge','birdDog'],workSec:40,restSec:20,rounds:3};
 const recommendation=recommendWorkout(session,{wallPushup:'easy',gluteBridge:'easy',birdDog:'hard'},{equipment:'none'});
 assert.deepEqual(recommendation.session.ids,['kneePushup','singleLegBridge','birdDog']);
 assert.equal(recommendation.changes.length,2);
 assert.deepEqual(session.ids,['wallPushup','gluteBridge','birdDog']);
 assert.equal(new Set(recommendation.session.ids).size,3);
});
test('unavailable alternatives never cause duplications or equipment surprises',()=>{
 const session={presetId:'upper',difficulty:'intermediate',ids:['wallPushup','kneePushup','pushup'],workSec:40,restSec:20,rounds:3};
 const result=recommendWorkout(session,{wallPushup:'easy',kneePushup:'easy',pushup:'easy'},{equipment:'none'});
 assert.deepEqual(result.session.ids,session.ids);
 assert.equal(result.unchanged.length,3);
});
test('recommendation round trips through the existing safe share-code format',()=>{
 const session={presetId:'full',difficulty:'beginner',ids:['wallPushup','gluteBridge','birdDog'],workSec:40,restSec:20,rounds:3};
 const recommendation=recommendWorkout(session,{wallPushup:'easy',gluteBridge:'easy'},{equipment:'none'}).session;
 assert.deepEqual(decodeSharedWorkout('?w='+encodeURIComponent(encodeSharedWorkout(recommendation))).ids,recommendation.ids);
});
test('balance guidance does not pretend floor movements equal band rows',()=>{
 assert.ok(balanceWarnings(['squat','pushup','snowAngel','plank'],'full').includes('noPull'));
 assert.ok(!balanceWarnings(['squat','pushup','bandRow','plank'],'full').includes('noPull'));
});


test('simultaneous valid progression chain advances both exercises when collision-free',()=>{
 const session={presetId:'upper',difficulty:'beginner',ids:['wallPushup','kneePushup','birdDog'],workSec:40,restSec:20,rounds:3};
 const result=recommendWorkout(session,{wallPushup:'easy',kneePushup:'easy',birdDog:'ok'},{equipment:'none'});
 assert.deepEqual(result.session.ids,['kneePushup','pushup','birdDog']);
 assert.equal(result.changes.length,2);
});
test('about-right is neutral and implicit for every exercise',()=>{
 const session={presetId:'full',difficulty:'beginner',ids:['squat','wallPushup','birdDog'],workSec:40,restSec:20,rounds:3};
 assert.deepEqual(recommendWorkout(session,{},{}).session.ids,session.ids);
 assert.equal(recommendWorkout(session,{squat:'ok'},{}).changes.length,0);
});
test('recommendations never manufacture a missing variation or duplicate exercises',()=>{
 const session={presetId:'core',difficulty:'intermediate',ids:['plank','shoulderTap','deadBug'],workSec:40,restSec:20,rounds:3};
 const result=recommendWorkout(session,{plank:'easy',shoulderTap:'hard',deadBug:'easy'},{equipment:'none'});
 assert.deepEqual(result.session.ids,session.ids);
 assert.equal(new Set(result.session.ids).size,3);
 assert.equal(result.unchanged.length,3);
});

test('all five added exercises have reversible difficulty chains',()=>{
 const progressions=[
  ['wallPushup','inclinePushup','kneePushup','pushup'],
  ['kneeForearmPlank','plank','shoulderTap'],
  ['march','stepJack','jumpingJack'],
  ['gluteBridge','gluteBridgeMarch','singleLegBridge'],
  ['squat','supportedSplitSquat','reverseLunge','assistedSingleLegSquat']
 ];
 for(const chain of progressions){
  for(let i=1;i<chain.length;i++){
   assert.equal(PROGRESSIONS[chain[i-1]].harder,chain[i],'harder link '+chain[i-1]);
   assert.equal(PROGRESSIONS[chain[i]].easier,chain[i-1],'easier link '+chain[i]);
  }
 }
});
test('new exercises are eligible, localized and usable in shared workouts',()=>{
 const added=['inclinePushup','kneeForearmPlank','stepJack','gluteBridgeMarch','supportedSplitSquat'];
 for(const id of added){assert.ok(idSet.has(id));assert.equal(allowedExercise(id,{equipment:'none',quiet:true}),true);}
 const share=encodeSharedWorkout({presetId:'full',difficulty:'beginner',ids:added,workSec:40,restSec:20,rounds:3});
 assert.ok(share);
 assert.deepEqual(decodeSharedWorkout('?w='+encodeURIComponent(share)).ids,added);
});
test('no progression ratings cause duplication, including with new steps',()=>{
 const available=['wallPushup','inclinePushup','kneePushup','pushup','kneeForearmPlank','plank','shoulderTap','march','stepJack','jumpingJack','gluteBridge','gluteBridgeMarch','singleLegBridge','squat','supportedSplitSquat','reverseLunge'];
 const cases=[
  available.slice(0,5),available.slice(4,9),available.slice(9,14),available.slice(11,16),
  ['inclinePushup','kneeForearmPlank','stepJack','gluteBridgeMarch','supportedSplitSquat']
 ];
 for(const ids of cases){
  for(let k=0;k<243;k++){
   let n=k;const ratings={};for(const id of ids){ratings[id]=['easy','ok','hard'][n%3];n=Math.floor(n/3);}
   const session={presetId:'full',difficulty:'intermediate',ids,workSec:40,restSec:20,rounds:3};
   const result=recommendWorkout(session,ratings,{equipment:'none',quiet:true}).session.ids;
   assert.equal(result.length,5);
   assert.equal(new Set(result).size,5);
   assert.ok(result.every(id=>allowedExercise(id,{equipment:'none',quiet:true})));
  }
 }
});
