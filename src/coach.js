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
  const suitable=candidates.find(other=>levelById[other]<=(difficulty==='beginner'?1:2))||
                 candidates.find(other=>levelById[other]<=2)||candidates[0];
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
 const original=[...session.ids],next=[...original],changes=[],unchanged=[];
 const taken=new Set(original);
 for(let i=0;i<original.length;i++){
  const id=original[i],rating=ratings[id];
  if(rating!=='easy'&&rating!=='hard')continue;
  const candidate=PROGRESSIONS[id]?.[rating==='easy'?'harder':'easier'];
  if(!candidate||!allowedExercise(candidate,options)||taken.has(candidate)){
   unchanged.push(id);continue;
  }
  taken.delete(id);taken.add(candidate);next[i]=candidate;
  changes.push({from:id,to:candidate,reason:rating});
 }
 return {session:{...session,ids:next},changes,unchanged,rated:original.filter(id=>['easy','ok','hard'].includes(ratings[id])).length};
}
