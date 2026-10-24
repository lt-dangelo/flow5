import {EXERCISES, EXERCISE_BY_ID, PRESETS, PRESET_BY_ID} from './data.js';
import {buildPlan, planStats, IntervalEngine} from './engine.js';
import {illustration} from './art.js';

const STORAGE_KEY='flow5-prefs-v1';
const DEFAULTS={presetId:'full', custom:{},workSec:40,restSec:20,rounds:3,includeFinalRest:true,sound:true};
const app=document.getElementById('app');

function loadPreferences(){
 try {
  const raw=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');
  const next={...DEFAULTS,...raw};
  if(!PRESET_BY_ID[next.presetId]) next.presetId='full';
  for(const [key,min,max] of [['workSec',5,600],['restSec',0,300],['rounds',1,20]]){
   next[key]=Number.isInteger(next[key])?Math.max(min,Math.min(max,next[key])):DEFAULTS[key];
  }
  next.includeFinalRest=!!next.includeFinalRest;
  next.sound=!!next.sound;
  if(!next.custom||typeof next.custom!=='object')next.custom={};
  for(const [key,value] of Object.entries(next.custom)){
   if(!PRESET_BY_ID[key]||!Array.isArray(value)||value.length!==5||value.some(id=>!EXERCISE_BY_ID[id])||new Set(value).size!==5) delete next.custom[key];
  }
  return next;
 } catch {return {...DEFAULTS};}
}
let prefs=loadPreferences();
let view='setup';
let swapIndex=null;
let swapQuery='';
let engine=null;
let tickHandle=null;
let wakeLock=null;
let audioCtx=null;
let audioWarning=false;
let installPrompt=null;
let lastPhaseKey='';
let pendingExit=false;

function save(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(prefs));}catch{/* Privater Modus möglich */}}
function currentIds(){return prefs.custom[prefs.presetId]||PRESET_BY_ID[prefs.presetId].ids;}
function currentConfig(){return {workSec:prefs.workSec,restSec:prefs.restSec,rounds:prefs.rounds,includeFinalRest:prefs.includeFinalRest};}
function currentPlan(){return buildPlan(currentIds(),currentConfig());}
function secsLabel(ms){const sec=Math.ceil(Math.max(0,ms)/1000);return `${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`;}
function humanDuration(ms){const minutes=Math.floor(ms/60000),seconds=Math.round(ms%60000/1000);return seconds?`${minutes} Min. ${seconds} Sek.`:`${minutes} Min.`;}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function icon(name){
 const paths={
  swap:'<path d="M7 7h13m0 0-4-4m4 4-4 4M17 17H4m0 0 4-4m-4 4 4 4"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/>',
  sound:'<path d="M5 9v6h4l5 4V5L9 9H5z"/><path d="M18 9a4 4 0 0 1 0 6"/>',
  mute:'<path d="M5 9v6h4l5 4V5L9 9H5z"/><path d="m17 9 5 6m0-6-5 6"/>',
  arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',
  play:'<path d="m8 5 12 7-12 7V5z"/>',
  pause:'<path d="M8 5v14M16 5v14"/>',
  skip:'<path d="m4 5 10 7-10 7V5zM18 5v14"/>',
  close:'<path d="M5 5 19 19M19 5 5 19"/>',
  back:'<path d="M19 12H5m6-6-6 6 6 6"/>',
  check:'<path d="m4 12 5 5L20 6"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.3"/>',
  sun:'<rect x="7" y="7" width="10" height="10" rx="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3"/>',
  rotate:'<path d="M4 10a8 8 0 1 1 1 6"/><path d="M4 4v6h6"/>',
  install:'<path d="M12 3v12m-4-4 4 4 4-4M4 18v3h16v-3"/>',
  spark:'<path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z"/>'};
 return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||paths.info}</svg>`;
}
function brand(){return `<div class="brand"><div class="brand-mark"><span>5</span><i></i></div><div><strong>FLOW<span>5</span></strong><small>CALISTHENICS TIMER</small></div></div>`;}
function render(){if(view==='setup')renderSetup();else if(view==='workout')renderWorkout();else renderDone();}
function renderSetup(){
 const preset=PRESET_BY_ID[prefs.presetId];
 const ids=currentIds();const stats=planStats(currentPlan());
 const presetCards=PRESETS.map(p=>`<button class="preset-card ${p.id===prefs.presetId?'selected':''}" type="button" data-action="preset" data-value="${p.id}" aria-pressed="${p.id===prefs.presetId}"><div class="preset-icon">${p.icon}</div><span class="preset-tag">${p.tag}</span><strong>${p.name}</strong><small>${p.subtitle}</small></button>`).join('');
 const rows=ids.map((id,i)=>{
  const e=EXERCISE_BY_ID[id];return `<div class="exercise-row"><div class="thumb">${illustration(e.pose,e.name)}</div><span class="exercise-index">${String(i+1).padStart(2,'0')}</span><div class="exercise-info"><strong>${e.name}</strong><small>${e.group} <span aria-hidden="true">·</span> ${['','Leicht','Mittel','Fortgeschritten'][e.level]}</small></div><button type="button" class="swap-btn" data-action="swap" data-index="${i}" aria-label="${e.name} austauschen">${icon('swap')}<span>Tauschen</span></button></div>`;
 }).join('');
 app.innerHTML=`<div class="site-shell">
 <header class="topbar">${brand()}<button class="icon-button help-button" type="button" data-action="help" aria-label="Installationshilfe">${icon('info')}</button></header>
 <main class="layout"><section class="intro"><div class="eyebrow"><span class="live-dot"></span> DEIN WORKOUT. DEIN RHYTHMUS.</div><h1>Fünf Übungen.<br/><em>Ein Flow.</em></h1><p>Stell dir dein Calisthenics-Training zusammen. Starten, mitmachen, automatisch durchwechseln.</p><div class="intro-stats"><span>${icon('clock')} Flexibler Intervalltimer</span><span>${icon('sun')} Display bleibt aktiv*</span></div></section>
 <section class="panel preset-panel"><div class="section-heading"><div><span class="step-label">01 / AUSWAHL</span><h2>Wähle deinen Fokus</h2></div><span class="subtle">${PRESETS.length} Programme</span></div><div class="preset-list">${presetCards}</div></section>
 <section class="panel lineup-panel"><div class="section-heading"><div><span class="step-label">02 / ÜBUNGEN</span><h2>Deine 5 Übungen</h2></div>${prefs.custom[prefs.presetId]?`<button class="reset-btn" type="button" data-action="reset">Zurücksetzen</button>`:`<span class="subtle">${escapeHtml(preset.name)}</span>`}</div><div class="exercise-list">${rows}</div><p class="hint">${icon('swap')} Tippe auf „Tauschen“, um eine Übung zu ersetzen.</p></section>
 <section class="panel config-panel"><div class="section-heading"><div><span class="step-label">03 / INTERVALLE</span><h2>Dein Timing</h2></div></div>
 <div class="config-grid">
  <label class="input-card"><span>Belastung</span><div class="input-line"><input aria-label="Belastung in Sekunden" type="number" min="5" max="600" step="5" inputmode="numeric" data-config="workSec" value="${prefs.workSec}"/><b>Sek.</b></div></label>
  <label class="input-card"><span>Erholung</span><div class="input-line"><input aria-label="Erholung in Sekunden" type="number" min="0" max="300" step="5" inputmode="numeric" data-config="restSec" value="${prefs.restSec}"/><b>Sek.</b></div></label>
  <label class="input-card"><span>Runden</span><div class="input-line"><input aria-label="Anzahl Runden" type="number" min="1" max="20" step="1" inputmode="numeric" data-config="rounds" value="${prefs.rounds}"/><b>× 5</b></div></label>
 </div>
 <label class="toggle-line"><div><strong>Erholung nach der letzten Übung</strong><small>Ein: genau ${humanDuration((prefs.workSec+prefs.restSec)*5*prefs.rounds*1000)} bei durchgängigen Intervallen. Aus: Training endet unmittelbar nach der letzten Belastung.</small></div><input type="checkbox" data-config="includeFinalRest" ${prefs.includeFinalRest?'checked':''}/><span class="toggle" aria-hidden="true"></span></label>
 <label class="toggle-line"><div><strong>Akustische Signale</strong><small>Töne beim Wechsel zwischen Belastung und Erholung.</small></div><input type="checkbox" data-config="sound" ${prefs.sound?'checked':''}/><span class="toggle" aria-hidden="true"></span></label>
 </section>
 <aside class="summary-panel"><div class="summary-head"><span>DEIN TRAININGSPLAN</span>${icon('spark')}</div><div class="total-time">${secsLabel(stats.totalMs)}</div><span class="summary-note">Gesamtdauer</span><div class="meter"><div class="meter-work" style="width:${stats.workMs/stats.totalMs*100}%"></div></div><div class="summary-breakdown"><span><i class="dot work-dot"></i> Belastung <b>${secsLabel(stats.workMs)}</b></span><span><i class="dot rest-dot"></i> Erholung <b>${secsLabel(stats.restMs)}</b></span></div><div class="summary-desc">${prefs.rounds} ${prefs.rounds===1?'Runde':'Runden'} × 5 Übungen · ${prefs.workSec}s / ${prefs.restSec}s</div><button type="button" data-action="start" class="primary-btn">Training starten ${icon('arrow')}</button><small class="footnote">* Auf unterstützten Geräten, solange die App sichtbar ist und iOS die Funktion zulässt.</small></aside>
 </main><footer class="footer">FLOW5 · Dein Training läuft lokal im Browser. Keine Anmeldung, kein Tracking.</footer>
 </div>${swapIndex!==null?renderSwapDialog():''}`;
}
function updateSettingsSummary(){
 // Keine Neurenderung während Number-Input-Change/Blur: vermeidet reentrante DOM-Änderungen.
 if(view!=='setup')return;
 const stats=planStats(currentPlan());
 const put=(selector,value)=>{const el=app.querySelector(selector);if(el)el.textContent=value;};
 put('.total-time',secsLabel(stats.totalMs));
 const bar=app.querySelector('.meter-work');if(bar)bar.style.width=`${stats.workMs/stats.totalMs*100}%`;
 const breakdown=app.querySelectorAll('.summary-breakdown b');
 if(breakdown[0])breakdown[0].textContent=secsLabel(stats.workMs);
 if(breakdown[1])breakdown[1].textContent=secsLabel(stats.restMs);
 put('.summary-desc',`${prefs.rounds} ${prefs.rounds===1?'Runde':'Runden'} × 5 Übungen · ${prefs.workSec}s / ${prefs.restSec}s`);
 const lastLabel=app.querySelector('.toggle-line small');
 if(lastLabel)lastLabel.textContent=`Ein: genau ${humanDuration((prefs.workSec+prefs.restSec)*5*prefs.rounds*1000)} bei durchgängigen Intervallen. Aus: Training endet unmittelbar nach der letzten Belastung.`;
}
function renderSwapDialog(){
 const selected=new Set(currentIds());
 const filtered=EXERCISES.filter(e=>!selected.has(e.id) && `${e.name} ${e.group}`.toLocaleLowerCase('de').includes(swapQuery.toLocaleLowerCase('de')));
 return `<div class="modal-backdrop" data-action="dismiss-swap"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="swap-title"><div class="modal-head"><div><span class="step-label">ÜBUNG AUSTAUSCHEN</span><h2 id="swap-title">Neue Übung wählen</h2></div><button type="button" class="icon-button" data-action="close-swap" aria-label="Schließen">${icon('close')}</button></div><input class="search-input" data-search placeholder="Übung oder Muskelgruppe suchen …" aria-label="Übungen durchsuchen" value="${escapeHtml(swapQuery)}"/><div class="swap-choices">${filtered.map(e=>`<button class="choice-row" type="button" data-action="choose" data-value="${e.id}"><span class="thumb">${illustration(e.pose,e.name)}</span><span><strong>${e.name}</strong><small>${e.group} · ${['','Leicht','Mittel','Fortgeschritten'][e.level]}</small><span class="choice-cue">${e.cue}</span></span>${icon('arrow')}</button>`).join('')||'<p class="empty">Keine weiteren passenden Übungen gefunden.</p>'}</div></div></div>`;
}
function nextWork(index){if(!engine)return null;return engine.phases.slice(index+1).find(p=>p.kind==='work')||null;}
function renderWorkout(){
 if(!engine)return;
 const snap=engine.snapshot();if(snap.status==='completed'){view='done';renderDone();return;}
 const p=snap.phase;const isRest=p.kind==='rest';
 const next=nextWork(snap.index);
 const present=isRest&&next?EXERCISE_BY_ID[next.exerciseId]:EXERCISE_BY_ID[p.exerciseId];
 const title=isRest?(next?'Als Nächstes: '+present.name:'Letzte Erholung'):present.name;
 const descr=isRest?(next?present.cue:'Du hast alle Übungen geschafft. Atme ruhig durch.'):present.cue;
 const group=isRest?'ERHOLUNG':'BELASTUNG';
 lastPhaseKey=`${snap.index}`;
 app.innerHTML=`<div class="training-screen ${isRest?'rest-mode':''}"><header class="training-header"><div>${brand()}<div class="status-row"><span class="status-pill ${isRest?'is-rest':''}"><i></i>${group}</span><span class="training-meta">Runde ${p.round}/${prefs.rounds} · Übung ${p.position}/5</span></div></div><button type="button" class="quiet-btn" data-action="exit">${icon('close')} Beenden</button></header>
 <main class="training-main"><div class="clock-side"><div class="timer-ring" id="timer-ring" style="--progress:${snap.phaseProgress*100}%"><div class="timer-inner"><span class="ring-label">${isRest?'PAUSE':'NOCH'}</span><strong id="phase-time" aria-label="Verbleibende Intervallzeit">${secsLabel(snap.remainingMs)}</strong><span class="ring-hint">Minuten : Sekunden</span></div></div><div class="whole-timer"><span>Training verbleibend</span><strong id="remaining-time">${secsLabel(snap.totalRemainingMs)}</strong></div><div class="whole-track"><div id="whole-progress" style="width:${snap.overallProgress*100}%"></div></div></div>
 <div class="exercise-side"><div class="training-illustration">${illustration(present.pose,present.name)}<span class="art-tag">${isRest?'GLEICH GEHT’S WEITER':present.group.toUpperCase()}</span></div><div class="workout-exercise"><span class="step-label">${isRest?'VORSCHAU AUF DIE NÄCHSTE ÜBUNG':'AKTUELLE ÜBUNG'}</span><h1>${escapeHtml(title)}</h1><p>${escapeHtml(descr)}</p><small>${escapeHtml(present.tip)}</small></div><div class="up-next">${icon('arrow')} <span>${isRest?(next?'Anschließend beginnt die Belastung':'Danach ist das Training beendet'):(next?'Danach: '+EXERCISE_BY_ID[next.exerciseId].name:'Danach: Trainingsabschluss')}</span></div></div></main>
 <footer class="training-controls"><div id="wake-indicator" class="wake-indicator">${icon('sun')} Display-Aktivhaltung wird geprüft …</div><div class="controls-row"><button type="button" class="primary-btn control-primary" data-action="pause">${icon(snap.status==='paused'?'play':'pause')} <span>${snap.status==='paused'?'Fortsetzen':'Pausieren'}</span></button><button type="button" class="secondary-btn" data-action="skip">${icon('skip')} <span>Weiter</span></button></div>${audioWarning?'<p class="warning">Tonsignale sind auf diesem Gerät eventuell nicht verfügbar.</p>':''}</footer>
 <div class="visually-hidden" id="phase-announcement" aria-live="polite">${group}: ${title}</div></div>`;
 updateClock();updateWakeIndicator();
}
function renderDone(){
 const stats=engine?planStats(engine.phases):planStats(currentPlan());
 view='done';
 app.innerHTML=`<div class="done-page"><header>${brand()}</header><main><div class="done-check">${icon('check')}</div><span class="eyebrow">WORKOUT COMPLETE</span><h1>Stark gemacht.</h1><p>Du hast dein Training abgeschlossen. Gönn dir etwas Wasser und eine kurze Erholung.</p><div class="done-stats"><div><strong>${secsLabel(stats.totalMs)}</strong><small>Geplante Dauer</small></div><div><strong>${prefs.rounds} × 5</strong><small>Übungen</small></div></div><button class="primary-btn" data-action="restart">Nochmal trainieren ${icon('rotate')}</button><button class="text-btn" data-action="setup">Zum Trainingsplan</button></main></div>`;
}
function updateClock(){
 if(!engine||view!=='workout')return;
 engine.tick();if(view!=='workout')return;
 const snap=engine.snapshot();
 const phaseTime=document.getElementById('phase-time');
 if(phaseTime)phaseTime.textContent=secsLabel(snap.remainingMs);
 const remaining=document.getElementById('remaining-time');
 if(remaining)remaining.textContent=secsLabel(snap.totalRemainingMs);
 const ring=document.getElementById('timer-ring');
 if(ring)ring.style.setProperty('--progress',`${snap.phaseProgress*100}%`);
 const progress=document.getElementById('whole-progress');
 if(progress)progress.style.width=`${snap.overallProgress*100}%`;
}
function startTicking(){stopTicking();tickHandle=setInterval(updateClock,100);}
function stopTicking(){if(tickHandle){clearInterval(tickHandle);tickHandle=null;}}
function prepareAudio(){
 if(!prefs.sound)return;
 try{
  const A=window.AudioContext||window.webkitAudioContext;
  if(!A){audioWarning=true;return;}
  if(!audioCtx)audioCtx=new A();
  audioCtx.resume().catch(()=>{audioWarning=true;});
 }catch{audioWarning=true;}
}
function beep(frequency=740,duration=0.12,delay=0){
 if(!prefs.sound||!audioCtx)return;
 try{
  const start=audioCtx.currentTime+delay;
  const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();
  osc.type='sine';osc.frequency.setValueAtTime(frequency,start);
  gain.gain.setValueAtTime(0.0001,start);
  gain.gain.exponentialRampToValueAtTime(0.14,start+0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001,start+duration);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start(start);osc.stop(start+duration+.02);
 }catch{audioWarning=true;}
}
function phaseSound(phase){
 if(phase.kind==='work'){beep(880,.11);beep(1050,.14,.18);}
 else beep(570,.20);
}
async function acquireWake(){
 try{
  if(!('wakeLock' in navigator)||document.visibilityState!=='visible')return;
  if(wakeLock)return;
  wakeLock=await navigator.wakeLock.request('screen');
  wakeLock.addEventListener('release',()=>{wakeLock=null;updateWakeIndicator();});
 }catch{wakeLock=null;}
 updateWakeIndicator();
}
async function releaseWake(){if(wakeLock){try{await wakeLock.release();}catch{}wakeLock=null;}updateWakeIndicator();}
function updateWakeIndicator(){
 const node=document.getElementById('wake-indicator');if(!node)return;
 node.classList.toggle('is-awake',!!wakeLock);
 node.innerHTML=`${icon('sun')} ${wakeLock?'Display bleibt möglichst aktiv':'Display-Aktivhaltung nicht verfügbar – Auto-Sperre ggf. deaktivieren'}`;
}
function beginWorkout(){
 try{
  prepareAudio(); // Im direkten Kontext des Tippen-Ereignisses Audio entsperren.
  engine=new IntervalEngine(currentPlan(),{
   onPhase:(phase,previous)=>{
    if(previous)phaseSound(phase);
    if(view==='workout')renderWorkout();
   },
   onComplete:()=>{beep(820,.15);beep(1100,.24,.2);stopTicking();releaseWake();view='done';renderDone();},
   onChange:()=>{if(view==='workout')renderWorkout();}
  });
  view='workout';engine.start();phaseSound(engine.phases[0]);
  startTicking();acquireWake();
  window.scrollTo({top:0,behavior:'instant'});
 }catch(err){window.alert('Training konnte nicht gestartet werden: '+err.message);}
}
function exitWorkout(){stopTicking();releaseWake();engine=null;pendingExit=false;view='setup';render();}
function showHelp(){
 const message='INSTALLATION AUF DEM IPHONE\n\n1. Diese Website per HTTPS in Safari öffnen.\n2. Auf Teilen tippen.\n3. „Zum Home-Bildschirm“ wählen und hinzufügen.\n\nDer Trainingsmodus funktioniert auch ohne Installation. Für Offline-Nutzung die installierte App nach dem ersten Online-Aufruf erneut öffnen.\n\nWichtig: Für die Display-Aktivhaltung muss die App sichtbar bleiben; iOS kann Wake Lock z. B. im Stromsparmodus verweigern.';
 window.alert(message);
}
app.addEventListener('click',event=>{
 const button=event.target.closest('[data-action]');if(!button)return;
 const action=button.dataset.action;
 if(action==='preset'){prefs.presetId=button.dataset.value;save();render();}
 else if(action==='reset'){delete prefs.custom[prefs.presetId];save();render();}
 else if(action==='swap'){swapIndex=Number(button.dataset.index);swapQuery='';render();document.querySelector('[data-search]')?.focus();}
 else if(action==='choose'){
  const id=button.dataset.value,ids=[...currentIds()];
  if(!EXERCISE_BY_ID[id]||ids.includes(id)||swapIndex===null)return;
  ids[swapIndex]=id;prefs.custom[prefs.presetId]=ids;swapIndex=null;swapQuery='';save();render();
 }
 else if(action==='close-swap'){swapIndex=null;swapQuery='';render();}
 else if(action==='dismiss-swap' && event.target===button){swapIndex=null;swapQuery='';render();}
 else if(action==='start'){beginWorkout();}
 else if(action==='pause'&&engine){
  if(engine.status==='running'){engine.pause();releaseWake();}
  else if(engine.status==='paused'){prepareAudio();engine.resume();acquireWake();}
  renderWorkout();
 }
 else if(action==='skip'&&engine){engine.skip();if(view==='workout')renderWorkout();}
 else if(action==='exit'){
  if(window.confirm('Training wirklich beenden? Dein Fortschritt geht verloren.'))exitWorkout();
 }
 else if(action==='restart'){beginWorkout();}
 else if(action==='setup'){engine=null;view='setup';render();}
 else if(action==='help'){showHelp();}
});
app.addEventListener('change',event=>{
 const field=event.target.dataset.config;if(!field)return;
 if(field==='sound'||field==='includeFinalRest')prefs[field]=event.target.checked;
 else {
  const bounds={workSec:[5,600],restSec:[0,300],rounds:[1,20]};
  const [min,max]=bounds[field]||[];if(min===undefined)return;
  const value=Number(event.target.value);
  if(Number.isFinite(value))prefs[field]=Math.max(min,Math.min(max,Math.round(value)));
 }
 save();updateSettingsSummary();
});
app.addEventListener('input',event=>{
 if(!event.target.matches('[data-search]'))return;
 swapQuery=event.target.value;
 const pos=event.target.selectionStart;
 render();const input=document.querySelector('[data-search]');
 if(input){input.focus();input.setSelectionRange(pos,pos);}
});
document.addEventListener('keydown',event=>{
 if(event.key==='Escape'&&swapIndex!==null){swapIndex=null;swapQuery='';render();}
});
document.addEventListener('visibilitychange',()=>{
 if(document.visibilityState==='visible'&&engine&&view==='workout'){
  engine.tick();if(engine.status==='running')acquireWake();updateClock();
 }
});
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;});
if('serviceWorker' in navigator && (location.protocol==='https:'||location.hostname==='localhost'||location.hostname==='127.0.0.1')){
 window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
}
render();
