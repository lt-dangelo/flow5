// Ten-second, wall-clock-based preview before interval training begins.
// This preparation is intentionally not an IntervalEngine phase or part of planStats().
export const PREPARATION_MS=10_000;
export class PreparationCountdown {
 constructor({clock=()=>performance.now(),durationMs=PREPARATION_MS}={}){
  if(!Number.isFinite(durationMs)||durationMs<=0)throw Error('Invalid preparation duration');
  this.clock=clock;
  this.durationMs=durationMs;
  this.deadline=null;
  this.status='idle';
 }
 start(){
  if(this.status!=='idle')return;
  this.deadline=this.clock()+this.durationMs;
  this.status='running';
 }
 remainingMs(){
  if(this.status==='idle')return this.durationMs;
  if(this.status!=='running')return 0;
  return Math.max(0,this.deadline-this.clock());
 }
 tick(){
  if(this.status!=='running')return false;
  if(this.remainingMs()>0)return false;
  this.status='completed';
  return true;
 }
 cancel(){
  this.status='cancelled';
 }
}
