// Optional, privacy-minimized workout analytics. Never blocks workout functionality.
const EVENTS=new Set(['workout_started','workout_completed','workout_abandoned','workout_restarted']);
export function trackWorkoutEvent(name,session){
  if(!EVENTS.has(name)||!session)return false;
  try{
    const tracker=globalThis.window?.umami;
    if(typeof tracker?.track!=='function')return false;
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
    const result=tracker.track(name,data);
    // Analytics must not create unhandled rejections or interrupt a session.
    result?.catch?.(()=>{});
    return true;
  }catch{return false;}
}
