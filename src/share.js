// Shareable workout configuration, v1. No account, backend, or personal workout history.
// Format: ?w=1~preset~difficulty~exerciseId,exerciseId~workSec~restSec~rounds
import {EXERCISES,PRESET_BY_ID,DIFFICULTIES} from './data.js';
import {validSelection} from './selection.js';
import {languageUrl} from './seo-languages.js';

const knownIds=new Set(EXERCISES.map(e=>e.id));
const whole=(part,min,max)=>/^(0|[1-9][0-9]*)$/.test(part) && Number(part)>=min && Number(part)<=max ? Number(part) : null;

export function decodeSharedWorkout(search){
 try{
  const params=new URLSearchParams(search);
  const found=params.getAll('w');
  if(found.length!==1||found[0].length>220)return null;
  const parts=found[0].split('~');
  if(parts.length!==7||parts[0]!=='1')return null;
  const [,presetId,difficulty,exerciseList,work,rest,roundCount]=parts;
  if(!Object.hasOwn(PRESET_BY_ID,presetId)||!DIFFICULTIES.includes(difficulty))return null;
  const ids=exerciseList.split(',');
  if(!validSelection(ids,knownIds))return null;
  const workSec=whole(work,5,600),restSec=whole(rest,0,300),rounds=whole(roundCount,1,20);
  if(workSec===null||restSec===null||rounds===null)return null;
  return {presetId,difficulty,ids,workSec,restSec,rounds};
 }catch{return null;}
}

export function encodeSharedWorkout({presetId,difficulty,ids,workSec,restSec,rounds}){
 if(!Object.hasOwn(PRESET_BY_ID,presetId)||!DIFFICULTIES.includes(difficulty)||!validSelection(ids,knownIds))return null;
 if(![workSec,restSec,rounds].every(Number.isInteger)||workSec<5||workSec>600||restSec<0||restSec>300||rounds<1||rounds>20)return null;
 return ['1',presetId,difficulty,ids.join(','),workSec,restSec,rounds].join('~');
}

export function sharedWorkoutUrl(rootHref,language,session){
 const code=encodeSharedWorkout(session);
 if(!code)return null;
 const url=new URL(languageUrl(rootHref,language));
 url.searchParams.set('w',code);
 return url.href;
}
