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

/**
 * Picker candidates: never expose a selected exercise, regardless of whether
 * the user is adding a sixth choice or replacing the exercise in that slot.
 * Levels 1→3; within each level: upper body, core, legs, then cardio.
 */
export function pickerChoices(exercises, selectedIds, query='', locale='en'){
 const chosen=new Set(selectedIds);
 const groupOrder={'Oberkörper':0,'Upper body':0,'Parte superiore':0,'Haut du corps':0,'Tren superior':0,'Core':1,'Gainage':1,'Zona media':1,'Beine':2,'Legs':2,'Gambe':2,'Jambes':2,'Piernas':2,'Cardio':3};
 const needle=query.trim().toLocaleLowerCase(locale);
 return exercises
  .filter(e=>!chosen.has(e.id) && (!needle || `${e.name} ${e.group}`.toLocaleLowerCase(locale).includes(needle)))
  .sort((a,b)=>a.level-b.level ||
    (groupOrder[a.group]??4)-(groupOrder[b.group]??4) ||
    a.name.localeCompare(b.name,locale));
}
