// Explicit, optional iPhone Shortcuts pilot. Does not write to HealthKit itself.
export function healthWorkoutPayload(session){
 const start=Date.parse(session?.startedAt),end=Date.parse(session?.endedAt);
 if(!Number.isFinite(start)||!Number.isFinite(end)||end<=start)return null;
 const durationMinutes=Math.max(0.1,Math.round((end-start)/6000)/10);
 // Session elapsed time includes any pauses; never imply measured active exercise.
 return {version:1,source:'Pick5Go',type:'Functional Strength Training',
   start:new Date(start).toISOString(),end:new Date(end).toISOString(),durationMinutes};
}
export function appleShortcutUrl(session,shortcutName='Pick5Go Health'){
 const payload=healthWorkoutPayload(session);
 if(!payload||typeof shortcutName!=='string'||!shortcutName.trim())return null;
 return 'shortcuts://run-shortcut?name='+encodeURIComponent(shortcutName)+'&input=text&text='+encodeURIComponent(JSON.stringify(payload));
}
