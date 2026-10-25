// Framework-unabhängige Zeitlogik. Misst reale Zeit statt Timer-Ticks zu zählen.
export function buildPlan(exerciseIds, config) {
  const {workSec, restSec, rounds, includeFinalRest} = config;
  if (!Array.isArray(exerciseIds) || exerciseIds.length < 1 || exerciseIds.length > 5 ||
      new Set(exerciseIds).size !== exerciseIds.length ||
      !Number.isInteger(workSec) || workSec < 5 || workSec > 600 ||
      !Number.isInteger(restSec) || restSec < 0 || restSec > 300 ||
      !Number.isInteger(rounds) || rounds < 1 || rounds > 20) {
    throw new Error('Ungültige Trainingskonfiguration');
  }
  const phases = [];
  for (let round = 1; round <= rounds; round++) {
    exerciseIds.forEach((exerciseId, position) => {
      phases.push({kind:'work', exerciseId, round, position:position + 1,
                   durationMs:workSec*1000});
      const isLast = round === rounds && position === exerciseIds.length-1;
      if (restSec > 0 && (!isLast || includeFinalRest)) {
        phases.push({kind:'rest',exerciseId,round,position:position + 1,
                     durationMs:restSec*1000});
      }
    });
  }
  return phases;
}

export function planStats(phases) {
  const ms = (kind) => phases.filter(p=>p.kind===kind).reduce((a,p)=>a+p.durationMs,0);
  return {workMs:ms('work'), restMs:ms('rest'), totalMs:phases.reduce((a,p)=>a+p.durationMs,0)};
}

export class IntervalEngine {
  constructor(phases, {clock=()=>performance.now(), onPhase=()=>{}, onComplete=()=>{}, onChange=()=>{}, onExerciseComplete=()=>{}}={}) {
    if (!phases.length || phases.some(p=>!(p.durationMs>0))) throw new Error('Leerer oder ungültiger Ablauf');
    this.phases=phases; this.clock=clock;
    this.onPhase=onPhase; this.onComplete=onComplete; this.onChange=onChange; this.onExerciseComplete=onExerciseComplete;
    this.status='idle';this.index=0;this.deadline=0;this.pausedMs=0;
    this.totalMs=planStats(phases).totalMs;
    this.afterMs=[];
    let acc=0;
    for (let i=phases.length-1;i>=0;i--){this.afterMs[i]=acc;acc+=phases[i].durationMs;}
  }
  start() {
    if(this.status!=='idle') return;
    this.status='running';this.index=0;
    this.deadline=this.clock()+this.phases[0].durationMs;
    this.onPhase(this.phases[0], null); this.onChange(this.status);
  }
  tick() {
    if(this.status!=='running') return;
    const now=this.clock();
    if(now<this.deadline) return;
    const previous=this.phases[this.index];
    while(this.index<this.phases.length && now>=this.deadline){
      const finished=this.phases[this.index];
      // Only elapsed work intervals count; skip() never invokes this callback.
      if(finished.kind==='work')this.onExerciseComplete(finished);
      this.index++;
      if(this.index<this.phases.length) this.deadline+=this.phases[this.index].durationMs;
    }
    if(this.index>=this.phases.length){
      this.status='completed';this.index=this.phases.length;
      this.onChange(this.status);this.onComplete();
    }else{
      this.onPhase(this.phases[this.index],previous);this.onChange(this.status);
    }
  }
  pause(){
    if(this.status!=='running')return;
    this.tick();if(this.status!=='running')return;
    this.pausedMs=Math.max(0,this.deadline-this.clock());
    this.status='paused';this.onChange(this.status);
  }
  resume(){
    if(this.status!=='paused')return;
    this.deadline=this.clock()+this.pausedMs;
    this.status='running';this.onChange(this.status);
  }
  skip(){
    if(!['running','paused'].includes(this.status))return;
    const previous=this.phases[this.index];this.index++;
    if(this.index>=this.phases.length){
      this.status='completed';this.onChange(this.status);this.onComplete();return;
    }
    const next=this.phases[this.index];
    if(this.status==='paused')this.pausedMs=next.durationMs;
    else this.deadline=this.clock()+next.durationMs;
    this.onPhase(next,previous);this.onChange(this.status);
  }
  snapshot(){
    const phase=this.phases[this.index]||null;
    const remainingMs=this.status==='completed'?0:this.status==='idle'?
      this.phases[0].durationMs:(this.status==='paused'?this.pausedMs:Math.max(0,this.deadline-this.clock()));
    const totalRemainingMs=phase?remainingMs+this.afterMs[this.index]:0;
    return {status:this.status,index:this.index,phase,
            remainingMs,totalRemainingMs,totalMs:this.totalMs,
            phaseProgress:phase?Math.min(1,Math.max(0,1-remainingMs/phase.durationMs)):1,
            overallProgress:Math.min(1,Math.max(0,1-totalRemainingMs/this.totalMs))};
  }
}
