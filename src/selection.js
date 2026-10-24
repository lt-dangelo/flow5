// Pure helpers: a workout round contains 1–5 distinct exercises.
export function validSelection(ids,knownIds){
 return Array.isArray(ids)&&ids.length>=1&&ids.length<=5&&ids.every(id=>knownIds.has(id))&&new Set(ids).size===ids.length;
}
export function removeExercise(ids,index){
 if(ids.length<=1||!Number.isInteger(index)||index<0||index>=ids.length)return [...ids];
 return ids.filter((_,i)=>i!==index);
}
export function chooseExercise(ids,index,id,knownIds){
 if(!knownIds.has(id)||ids.includes(id))return null;
 if(index===-1)return ids.length<5?[...ids,id]:null;
 if(!Number.isInteger(index)||index<0||index>=ids.length)return null;
 return ids.map((x,i)=>i===index?id:x);
}
