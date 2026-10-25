// Optional, privacy-minimized workout analytics. Never blocks workout functionality.
const EVENTS=new Set(['workout_started','workout_completed','workout_abandoned','workout_restarted']);
const pending=[];
const consented=()=>{try{return globalThis.localStorage?.getItem('pick5go-analytics-consent-v1')==='yes'}catch{return false}};
function flush(){
 if(!consented()){pending.length=0;return;}
 const track=globalThis.window?.umami?.track;
 if(typeof track!=='function')return;
 while(pending.length){
  const [name,data]=pending.shift();
  try{track(name,data)?.catch?.(()=>{});}catch{/* Tracking remains optional */}
 }
}
if(typeof globalThis.window!=='undefined'){
 globalThis.window.addEventListener('pick5go:analyticsready',flush);
 globalThis.window.addEventListener('pick5go:analyticsunavailable',()=>{pending.length=0});
}
export function trackWorkoutEvent(name,session){
  if(!EVENTS.has(name)||!session)return false;
  try{
    const tracker=globalThis.window?.umami;
    if(typeof tracker?.track!=='function' && !consented())return false;
    const path=globalThis.window.location?.pathname||'';
    const data={
      environment:/\/preview\/v1\.3(?:\/|$)/.test(path)?'preview':'production',
      preset:session.presetId,
      difficulty:session.difficulty,
      exercises:session.ids.length,
      rounds:session.rounds,
      planned_minutes:Math.round(session.ids.length*session.rounds*(session.workSec+session.restSec)/60*10)/10,
      customized:Boolean(session.customized),
      skipped_phases:session.skippedPhases||0
    };
    if(typeof tracker?.track!=='function'){
      // A visitor may start working out before the consented script finishes loading.
      pending.push([name,data]);
      return true;
    }
    flush();
    const result=tracker.track(name,data);
    // Analytics must not create unhandled rejections or interrupt a session.
    result?.catch?.(()=>{});
    return true;
  }catch{return false;}
}
