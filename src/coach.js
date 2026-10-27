// Local, deterministic training guidance. No account, network request or workout history.
import {EXERCISES} from './data.js';
const exerciseIds = new Set(EXERCISES.map(e=>e.id));
export const MOVEMENTS=Object.freeze({
 squat:'squat',pushup:'push',reverseLunge:'squat',plank:'core',mountainClimber:'cardio',
 wallPushup:'push',gluteBridge:'hinge',birdDog:'core',march:'cardio',deadBug:'core',
 bicycle:'core',sidePlankL:'core',sidePlankR:'core',pikePushup:'push',shoulderTap:'push',
 snowAngel:'mobility',calfRaise:'squat',wallSit:'squat',jumpingJack:'cardio',
 superman:'core',heelTouch:'core',bearHold:'core',hipHinge:'hinge',bandRow:'pull',
 kneePushup:'push',singleLegBridge:'hinge',assistedSingleLegSquat:'squat'
});
export const PROGRESSIONS=Object.freeze({
 wallPushup:{harder:'kneePushup'},kneePushup:{easier:'wallPushup',harder:'pushup'},
 pushup:{easier:'kneePushup'},squat:{harder:'reverseLunge'},
 reverseLunge:{easier:'squat',harder:'assistedSingleLegSquat'},
 assistedSingleLegSquat:{easier:'reverseLunge'},
 gluteBridge:{harder:'singleLegBridge'},singleLegBridge:{easier:'gluteBridge'},
 march:{harder:'jumpingJack'},jumpingJack:{easier:'march'},
 plank:{harder:'shoulderTap'},shoulderTap:{easier:'plank'}
});
const FALLBACKS={
 full:['snowAngel','birdDog','plank','gluteBridge','wallSit','calfRaise','deadBug','bearHold'],
 upper:['plank','bearHold','superman','shoulderTap','snowAngel','wallPushup','pikePushup'],
 core:['deadBug','birdDog','plank','bearHold','heelTouch','superman'],
 legs:['squat','gluteBridge','calfRaise','wallSit','hipHinge','reverseLunge']
};
const levelById=Object.fromEntries(EXERCISES.map(e=>[e.id,e.level]));
export function allowedExercise(id,{equipment='none',quiet=false}={}){
 if(!exerciseIds.has(id))return false;
 if(equipment!=='band'&&id==='bandRow')return false;
 if(quiet&&['jumpingJack','mountainClimber'].includes(id))return false;
 return true;
}
// Incompatible exercises are replaced where possible, without new assets or false 'pull' equivalences.
export function adaptWorkout(ids,options={},focus='full',difficulty='beginner'){
 const taken=new Set(ids.filter(id=>allowedExercise(id,options)));
 const fallbacks=FALLBACKS[focus]||FALLBACKS.full;
 return ids.map(id=>{
  if(allowedExercise(id,options))return id;
  const candidates=fallbacks.filter(other=>!taken.has(other)&&allowedExercise(other,options));
  const suitable=candidates.find(other=>levelById[other]<=(difficulty==='beginner'?1:2));
  // Do not silently turn a beginner workout into an intermediate/advanced one.
  if(suitable)taken.add(suitable);
  return suitable||null;
 }).filter(Boolean);
}
export function balanceWarnings(ids,focus='full'){
 const types=new Set(ids.map(id=>MOVEMENTS[id]));
 const warnings=[];
 if(['full','upper'].includes(focus)&&!types.has('pull'))warnings.push('noPull');
 if(['full','upper'].includes(focus)&&!types.has('push'))warnings.push('noPush');
 if(['full','legs'].includes(focus)&&!types.has('squat')&&!types.has('hinge'))warnings.push('noLegs');
 return warnings;
}
// Ratings are only held in memory for the end screen. The existing URL codec saves the suggested plan.
export function recommendWorkout(session,ratings={},options={}){
 const original=[...session.ids],next=[...original];
 const requests=original.map(id=>{
  const rating=ratings[id]||'ok';
  if(rating!=='easy'&&rating!=='hard')return null;
  const target=PROGRESSIONS[id]?.[rating==='easy'?'harder':'easier']||null;
  return target&&allowedExercise(target,options)?target:null;
 });
 // Accept only collision-free substitutions. Iteration supports progression
 // chains (A -> B, B -> C) if C is not already selected. No duplicates,
 // silent removals, or jumping over intermediate progression steps.
 let changed=true;
 while(changed){
  changed=false;
  for(let i=original.length-1;i>=0;i--){
   const candidate=requests[i];
   if(!candidate||next[i]!==original[i]||next.includes(candidate))continue;
   next[i]=candidate;changed=true;
  }
 }
 const changes=[],unchanged=[];
 for(let i=0;i<original.length;i++){
  const id=original[i],rating=ratings[id]||'ok';
  if(next[i]!==id)changes.push({from:id,to:next[i],reason:rating});
  else if(rating==='easy'||rating==='hard')unchanged.push(id);
 }
 return {session:{...session,ids:next},changes,unchanged,rated:original.length};
}
