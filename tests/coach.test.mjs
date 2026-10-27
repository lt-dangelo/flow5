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
