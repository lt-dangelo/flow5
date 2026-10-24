const CLIPS={work:new URL('../audio/work.wav',import.meta.url).href,rest:new URL('../audio/rest.wav',import.meta.url).href,done:new URL('../audio/done.wav',import.meta.url).href};
export class CueAudio {
 constructor(){this.media=typeof Audio==='function'?new Audio():null;this.lastError='';if(this.media){this.media.preload='auto';this.media.volume=1;this.media.setAttribute('aria-hidden','true');}}
 play(kind){
  if(!CLIPS[kind]||!this.media){this.lastError='Audioausgabe nicht verfügbar';return false;}
  try{
   if(typeof navigator!=='undefined'&&navigator.audioSession){try{navigator.audioSession.type='playback';}catch{}}
   this.media.pause();this.media.src=CLIPS[kind];this.media.load();const attempt=this.media.play();this.lastError='';
   if(attempt&&typeof attempt.catch==='function')attempt.catch(error=>{this.lastError=error?.message||'Audio blockiert';});
   return true;
  }catch(error){this.lastError=error?.message||'Audio blockiert';return false;}
 }
 stop(){if(this.media){this.media.pause();try{this.media.currentTime=0;}catch{}}}
}
