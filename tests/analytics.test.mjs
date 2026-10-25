import assert from 'node:assert/strict';
import {trackWorkoutEvent} from '../src/analytics.js';

const session={ids:['squat','pushup','plank','march','gluteBridge'],presetId:'full',difficulty:'beginner',rounds:3,workSec:40,restSec:20,customized:false,skippedPhases:1};
const previous=globalThis.window;
try{
  delete globalThis.window;
  assert.equal(trackWorkoutEvent('workout_started',session),false);
  const calls=[];
  globalThis.window={location:{pathname:'/preview/v1.3/'},umami:{track:(...args)=>{calls.push(args);return Promise.resolve();}}};
  assert.equal(trackWorkoutEvent('workout_started',session),true);
  assert.deepEqual(calls[0],[ 'workout_started',{
    environment:'preview',preset:'full',difficulty:'beginner',exercises:5,rounds:3,
    planned_minutes:15,customized:false,skipped_phases:1
  }]);
  assert.equal(trackWorkoutEvent('invalid',session),false);
  assert.equal(calls.length,1);
  globalThis.window.location.pathname='/flow5/';
  trackWorkoutEvent('workout_completed',session);
  assert.equal(calls[1][1].environment,'production');
  globalThis.window.umami.track=()=>{throw new Error('Blocked by browser');};
  assert.equal(trackWorkoutEvent('workout_abandoned',session),false);
  globalThis.window.umami.track=()=>Promise.reject(new Error('Network unavailable'));
  assert.equal(trackWorkoutEvent('workout_restarted',session),true);
}finally{
  if(previous===undefined)delete globalThis.window;
  else globalThis.window=previous;
}
