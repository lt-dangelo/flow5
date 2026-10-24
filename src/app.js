import {EXERCISES, EXERCISE_BY_ID, PRESETS, PRESET_BY_ID} from './data.js';
import {buildPlan, planStats, IntervalEngine} from './engine.js';
import {illustration} from './art.js';
import {illustration13,isStudy} from './art13.js';
import {optionsFor,stepSetting} from './config.js';
import {CueAudio} from './audio.js';
import {t,exerciseText,presetText} from './i18n.js';
import {validSelection,removeExercise,chooseExercise} from './selection.js';

const STORAGE_KEY='flow5-prefs-v13-preview';
const DEFAULTS={presetId:'full', custom:{},workSec:40,restSec:20,rounds:3,includeFinalRest:true,sound:true,lang:'en'};
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
  next.lang=next.lang==='de'?'de':'en';
  if(!next.custom||typeof next.custom!=='object')next.custom={};
  const knownIds=new Set(EXERCISES.map(e=>e.id));
  for(const [key,value] of Object.entries(next.custom)){
   if(!PRESET_BY_ID[key]||!validSelection(value,knownIds)) delete next.custom[key];
  }
  return next;
 } catch {return {...DEFAULTS};}
}
let prefs=loadPreferences();
document.documentElement.lang=prefs.lang;
let view='setup';
let swapIndex=null;
let swapQuery='';
let engine=null;
let tickHandle=null;
let wakeLock=null;
const cueAudio=new CueAudio();
let audioWarning=false;
let installPrompt=null;
let lastPhaseKey='';
let pendingExit=false;
let workoutCount=5;
const knownIds=new Set(EXERCISES.map(e=>e.id));
const T=(key,params)=>t(prefs.lang,key,params);
const E=id=>exerciseText(EXERCISE_BY_ID[id],prefs.lang);
const P=p=>presetText(p,prefs.lang);
const countLabel=n=>`${n} ${T(n===1?'exerciseOne':'exerciseMany')}`;
const summaryLabel=()=>`${prefs.rounds} ${T(prefs.rounds===1?'roundOne':'roundMany')} × ${countLabel(currentIds().length)} · ${prefs.workSec}s / ${prefs.restSec}s`;
const restHelp=()=>T('finalRestOn',{time:humanDuration((prefs.workSec+prefs.restSec)*currentIds().length*prefs.rounds*1000)});

function save(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(prefs));}catch{/* Privater Modus möglich */}}
function currentIds(){return prefs.custom[prefs.presetId]||PRESET_BY_ID[prefs.presetId].ids;}
function currentConfig(){return {workSec:prefs.workSec,restSec:prefs.restSec,rounds:prefs.rounds,includeFinalRest:prefs.includeFinalRest};}
function currentPlan(){return buildPlan(currentIds(),currentConfig());}
function secsLabel(ms){const sec=Math.ceil(Math.max(0,ms)/1000);return `${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`;}
function humanDuration(ms){const minutes=Math.floor(ms/60000),seconds=Math.round(ms%60000/1000);return seconds?(prefs.lang==='de'?`${minutes} Min. ${seconds} Sek.`:`${minutes} min ${seconds} sec`):(prefs.lang==='de'?`${minutes} Min.`:`${minutes} min`);}
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
function stepper(field,label,unit){
 const values=optionsFor(field,prefs[field]), index=values.indexOf(prefs[field]);
 const options=values.map(value=>`<option value="${value}" ${value===prefs[field]?'selected':''}>${value}</option>`).join('');
 return `<div class="input-card"><span id="label-${field}">${label}</span><div class="stepper-row"><button type="button" class="step-btn" data-action="adjust" data-field="${field}" data-direction="-1" aria-label="${label} −" ${index===0?'disabled':''}>−</button><div class="picker-field"><select data-config="${field}" aria-labelledby="label-${field}">${options}</select><span class="picker-unit">${unit}</span><span class="picker-chevron" aria-hidden="true">⌄</span></div><button type="button" class="step-btn" data-action="adjust" data-field="${field}" data-direction="1" aria-label="${label} +" ${index===values.length-1?'disabled':''}>+</button></div></div>`;
}
function updatePicker(field){
 const select=app.querySelector(`[data-config="${field}"]`);if(!select)return;
 const values=optionsFor(field,prefs[field]);
 if(![...select.options].some(opt=>Number(opt.value)===prefs[field])) select.innerHTML=values.map(n=>`<option value="${n}">${n}</option>`).join('');
 select.value=String(prefs[field]);
 for(const direction of [-1,1]){
  const btn=app.querySelector(`[data-action="adjust"][data-field="${field}"][data-direction="${direction}"]`);
  if(btn)btn.disabled=prefs[field]===values[direction<0?0:values.length-1];
 }
}
function render(){if(view==='setup')renderSetup();else if(view==='workout')renderWorkout();else renderDone();}
function renderSetup(){
 const preset=P(PRESET_BY_ID[prefs.presetId]),ids=currentIds(),count=ids.length,stats=planStats(currentPlan());
 const cards=PRESETS.map(raw=>{const p=P(raw);return `<button class="preset-card ${p.id===prefs.presetId?'selected':''}" type="button" data-action="preset" data-value="${p.id}" aria-pressed="${p.id===prefs.presetId}"><div class="preset-icon">${p.icon}</div><span class="preset-tag">${escapeHtml(p.tag)}</span><strong>${escapeHtml(p.name)}</strong><small>${escapeHtml(p.subtitle)}</small></button>`;}).join('');
 const rows=ids.map((id,i)=>{const e=E(id);return `<div class="exercise-row"><div class="thumb">${illustration(e.pose,e.name,prefs.lang)}</div><span class="exercise-index">${String(i+1).padStart(2,'0')}</span><div class="exercise-info"><strong>${escapeHtml(e.name)}</strong><small>${escapeHtml(e.group)} <span aria-hidden="true">·</span> ${T(['','easy','medium','advanced'][e.level])}</small></div><div class="exercise-actions"><button type="button" class="swap-btn" data-action="swap" data-index="${i}" aria-label="${T('swap')}: ${escapeHtml(e.name)}">${icon('swap')}<span>${T('swap')}</span></button><button type="button" class="remove-btn" data-action="remove" data-index="${i}" aria-label="${T('remove')}: ${escapeHtml(e.name)}" ${count===1?'disabled':''}>${icon('close')}<span>${T('remove')}</span></button></div></div>`;}).join('');
 app.innerHTML=`<div class="site-shell">
 <header class="topbar">${brand()}<div class="topbar-actions"><button type="button" class="language-btn" data-action="language" aria-label="${T('switchLanguage')}" title="${T('switchLanguage')}"><span aria-hidden="true">${prefs.lang==='de'?'🇩🇪':'🇬🇧'}</span><span>${prefs.lang.toUpperCase()}</span></button><button class="icon-button help-button" type="button" data-action="help" aria-label="${T('help')}">${icon('info')}</button></div></header>
 <main class="layout"><section class="intro"><div class="eyebrow"><span class="live-dot"></span> ${T('heroEyebrow')}</div><h1>${T('heroFirst')}<br/><em>${T('heroSecond')}</em></h1><p>${T('heroDesc')}</p><div class="intro-stats"><span>${icon('clock')} ${T('flexible')}</span><span>${icon('sun')} ${T('awake')}</span></div></section>
 <div class="preview-intro"><span>FLOW5 · v1.3 PREVIEW</span><p>${prefs.lang==='de'?'Neues Layout und drei anatomische Illustrationen testen. Die Live-App bleibt unverändert.':'Test the new workout layout and three anatomical studies. Your live app is unchanged.'}</p><button type="button" data-action="try-studies">${prefs.lang==='de'?'Squats · Push-ups · Plank testen':'Try Squats · Push-ups · Plank'} ${icon('arrow')}</button></div>
 <section class="panel preset-panel"><div class="section-heading"><div><span class="step-label">01 / ${T('focus').toUpperCase()}</span><h2>${T('focus')}</h2></div><span class="subtle">${PRESETS.length} ${T('programs')}</span></div><div class="preset-list">${cards}</div></section>
 <section class="panel lineup-panel"><div class="section-heading"><div><span class="step-label">02 / ${T('exercisesTitle').toUpperCase()}</span><h2>${T('exercisesTitle')} <span class="exercise-count">${count}/5</span></h2></div>${prefs.custom[prefs.presetId]?`<button class="reset-btn" type="button" data-action="reset">${T('reset')}</button>`:`<span class="subtle">${escapeHtml(preset.name)}</span>`}</div><div class="exercise-list">${rows}</div>${count<5?`<button type="button" class="add-exercise-btn" data-action="add"><strong>＋</strong> ${T('add')} <span>${count}/5</span></button>`:''}<p class="hint">${icon('swap')} ${T('removeHint')}</p></section>
 <section class="panel config-panel"><div class="section-heading"><div><span class="step-label">03 / ${T('timing').toUpperCase()}</span><h2>${T('timing')}</h2></div></div>
 <div class="config-grid">${stepper('workSec',T('work'),T('sec'))}${stepper('restSec',T('rest'),T('sec'))}${stepper('rounds',T('rounds'),'× '+count)}</div>
 <label class="toggle-line"><div><strong>${T('finalRest')}</strong><small>${restHelp()}</small></div><input type="checkbox" data-config="includeFinalRest" ${prefs.includeFinalRest?'checked':''}/><span class="toggle" aria-hidden="true"></span></label>
 <label class="toggle-line"><div><strong>${T('sounds')}</strong><small>${T('soundsDesc')}</small></div><input type="checkbox" data-config="sound" ${prefs.sound?'checked':''}/><span class="toggle" aria-hidden="true"></span></label>
 </section>
 <aside class="summary-panel"><div class="summary-head"><span>${T('plan')}</span>${icon('spark')}</div><div class="total-time">${secsLabel(stats.totalMs)}</div><span class="summary-note">${T('duration')}</span><div class="meter"><div class="meter-work" style="width:${stats.workMs/stats.totalMs*100}%"></div></div><div class="summary-breakdown"><span><i class="dot work-dot"></i> ${T('workBreakdown')} <b>${secsLabel(stats.workMs)}</b></span><span><i class="dot rest-dot"></i> ${T('restBreakdown')} <b>${secsLabel(stats.restMs)}</b></span></div><div class="summary-desc">${summaryLabel()}</div><button type="button" data-action="start" class="primary-btn">${T('start')} ${icon('arrow')}</button><small class="footnote">${T('footnote')}</small></aside>
 </main><footer class="footer">${T('footer')}</footer>
 </div>${swapIndex!==null?renderSwapDialog():''}`;
}
function updateSettingsSummary(){
 if(view!=='setup')return;
 const stats=planStats(currentPlan()),put=(sel,val)=>{const n=app.querySelector(sel);if(n)n.textContent=val;};
 put('.total-time',secsLabel(stats.totalMs));
 const bar=app.querySelector('.meter-work');if(bar)bar.style.width=`${stats.workMs/stats.totalMs*100}%`;
 const labels=app.querySelectorAll('.summary-breakdown b');
 if(labels[0])labels[0].textContent=secsLabel(stats.workMs);
 if(labels[1])labels[1].textContent=secsLabel(stats.restMs);
 put('.summary-desc',summaryLabel());
 const note=app.querySelector('.toggle-line small');if(note)note.textContent=restHelp();
}
function renderSwapDialog(){
 const isAdd=swapIndex===-1,selected=new Set(currentIds());
 const filtered=EXERCISES.filter(raw=>{const e=exerciseText(raw,prefs.lang);return !selected.has(e.id)&&`${e.name} ${e.group}`.toLocaleLowerCase(prefs.lang).includes(swapQuery.toLocaleLowerCase(prefs.lang));});
 return `<div class="modal-backdrop" data-action="dismiss-swap"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="swap-title"><div class="modal-head"><div><span class="step-label">${T(isAdd?'addEyebrow':'swapEyebrow')}</span><h2 id="swap-title">${T(isAdd?'addTitle':'swapTitle')}</h2></div><button type="button" class="icon-button" data-action="close-swap" aria-label="${T('close')}">${icon('close')}</button></div><input class="search-input" data-search placeholder="${T('search')}" aria-label="${T('searchAria')}" value="${escapeHtml(swapQuery)}"/><div class="swap-choices">${filtered.map(raw=>{const e=exerciseText(raw,prefs.lang);return `<button class="choice-row" type="button" data-action="choose" data-value="${e.id}"><span class="thumb">${illustration(e.pose,e.name,prefs.lang)}</span><span><strong>${escapeHtml(e.name)}</strong><small>${escapeHtml(e.group)} · ${T(['','easy','medium','advanced'][e.level])}</small><span class="choice-cue">${escapeHtml(e.cue)}</span></span>${icon('arrow')}</button>`;}).join('')||`<p class="empty">${T('noMatches')}</p>`}</div></div></div>`;
}
function nextWork(index){if(!engine)return null;return engine.phases.slice(index+1).find(p=>p.kind==='work')||null;}
function renderWorkout(){
 if(!engine)return;
 const snap=engine.snapshot();
 if(snap.status==='completed'){view='done';renderDone();return;}
 const p=snap.phase,isRest=p.kind==='rest',next=nextWork(snap.index);
 const present=E(isRest&&next?next.exerciseId:p.exerciseId);
 const shownPosition=(isRest&&next)?next.position:p.position;
 const shownRound=(isRest&&next)?next.round:p.round;
 const group=T(isRest?'restCaps':'workCaps');
 const cue=isRest?(next?present.cue:T('restFinished')):present.cue;
 const after=isRest?(next?T('afterWork'):T('afterFinish')):(next?T('nextPrefix')+E(next.exerciseId).name:T('afterDone'));
 const actionLabel=isRest?(next?T('readySoon'):T('restCaps')):(isStudy(present.pose)?(present.pose==='plank'?(prefs.lang==='de'?'HALTEN':'HOLD'):(prefs.lang==='de'?'START → ENDE':'START → END')):'');
 lastPhaseKey=String(snap.index);
 app.innerHTML=`<div class="training-screen v13 v13-clean ${isRest?'rest-mode':''}">
 <header class="training-header v13-header"><div class="v13-wordmark" aria-label="Flow5">Flow<span>5</span></div><button type="button" class="quiet-btn" data-action="exit" aria-label="${T('exit')}">${icon('close')} <span>${T('exit')}</span></button></header>
 <main class="v13-workout">
  <div class="v13-timing">
    <div class="v13-current"><span class="v13-state ${isRest?'v13-rest':''}">${group}</span><strong id="phase-time" aria-label="${T('remaining')}">${secsLabel(snap.remainingMs)}</strong></div>
    <div class="v13-session"><span>${T('roundLabel')} ${p.round}/${prefs.rounds} · ${T('exerciseLabel')} ${p.position}/${workoutCount}</span><div class="v13-total"><span>${T('remaining')}</span> <strong id="remaining-time">${secsLabel(snap.totalRemainingMs)}</strong></div></div>
  </div>
  <div class="whole-track v13-progress" role="progressbar" aria-label="${T('remaining')}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(snap.overallProgress*100)}"><div id="whole-progress" style="width:${snap.overallProgress*100}%"></div></div>
  <section class="v13-art" aria-label="${present.name}">
    <div class="v13-art-heading"><span class="v13-art-index">${String(shownPosition).padStart(2,'0')} / ${String(workoutCount).padStart(2,'0')}</span><h1>${escapeHtml(present.name)}</h1>${actionLabel?`<span class="v13-motion-label">${actionLabel}</span>`:''}</div>
    <div class="v13-drawing">${illustration13(present.pose,present.name,prefs.lang)}</div>
    <p class="v13-art-cue">${escapeHtml(cue)}</p>
  </section>
  <div class="v13-next"><span>${after}</span>${prefs.sound? `<span class="v13-audio-mark" aria-label="${T('sounds')}">${icon('sound')}</span>`:''}</div>
 </main>
 <footer class="training-controls v13-controls"><div class="controls-row"><button type="button" class="primary-btn control-primary" data-action="pause">${icon(snap.status==='paused'?'play':'pause')} <span>${T(snap.status==='paused'?'resume':'pause')}</span></button><button type="button" class="secondary-btn" data-action="skip">${icon('skip')} <span>${T('skip')}</span></button></div><div id="wake-indicator" class="wake-indicator visually-hidden" aria-live="polite">${T('checkingWake')}</div>${audioWarning?`<p class="warning">${T('audioWarn')}</p>`:''}</footer>
 <div class="visually-hidden" id="phase-announcement" aria-live="polite">${group}: ${present.name}</div></div>`;
 updateClock();updateWakeIndicator();
}
function renderDone(){
 const stats=engine?planStats(engine.phases):planStats(currentPlan());
 view='done';
 app.innerHTML=`<div class="done-page"><header>${brand()}</header><main><div class="done-check">${icon('check')}</div><span class="eyebrow">${T('complete')}</span><h1>${T('wellDone')}</h1><p>${T('doneMessage')}</p><div class="done-stats"><div><strong>${secsLabel(stats.totalMs)}</strong><small>${T('planned')}</small></div><div><strong>${prefs.rounds} × ${workoutCount}</strong><small>${T('exercisesDone')}</small></div></div><button class="primary-btn" data-action="restart">${T('repeat')} ${icon('rotate')}</button><button class="text-btn" data-action="setup">${T('backToPlan')}</button></main></div>`;
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
function phaseSound(phase){if(prefs.sound)audioWarning=!cueAudio.play(phase.kind==='work'?'work':'rest');}
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
 node.innerHTML=`${icon('sun')} ${T(wakeLock?'awakeOn':'awakeOff')}`;
}
function beginWorkout(){
 try{
  // Der erste Ton wird synchron beim Start-Tipp abgespielt.
  workoutCount=currentIds().length;
  engine=new IntervalEngine(currentPlan(),{
   onPhase:(phase,previous)=>{
    if(previous)phaseSound(phase);
    if(view==='workout')renderWorkout();
   },
   onComplete:()=>{if(prefs.sound)cueAudio.play('done');stopTicking();releaseWake();view='done';renderDone();},
   onChange:()=>{if(view==='workout')renderWorkout();}
  });
  view='workout';engine.start();phaseSound(engine.phases[0]);
  startTicking();acquireWake();
  window.scrollTo({top:0,behavior:'instant'});
 }catch(err){window.alert(T('startError')+err.message);}
}
function exitWorkout(){stopTicking();cueAudio.stop();releaseWake();engine=null;pendingExit=false;view='setup';render();}
function showHelp(){window.alert(T('helpMessage'));}
app.addEventListener('click',event=>{
 const button=event.target.closest('[data-action]');if(!button)return;
 const action=button.dataset.action;
 if(action==='preset'){prefs.presetId=button.dataset.value;save();render();}
 else if(action==='reset'){delete prefs.custom[prefs.presetId];save();render();}
 else if(action==='try-studies'){prefs.presetId='full';prefs.custom.full=['squat','pushup','plank'];prefs.rounds=2;prefs.workSec=25;prefs.restSec=10;save();render();}
 else if(action==='language'){prefs.lang=prefs.lang==='en'?'de':'en';document.documentElement.lang=prefs.lang;save();render();}
 else if(action==='remove'){
  const old=currentIds(),ids=removeExercise(old,Number(button.dataset.index));
  if(ids.length!==old.length){prefs.custom[prefs.presetId]=ids;save();render();}
 }
 else if(action==='add'){
  if(currentIds().length<5){swapIndex=-1;swapQuery='';render();document.querySelector('[data-search]')?.focus();}
 }
 else if(action==='swap'){swapIndex=Number(button.dataset.index);swapQuery='';render();document.querySelector('[data-search]')?.focus();}
 else if(action==='choose'){
  const id=button.dataset.value,ids=[...currentIds()];
  if(swapIndex===null)return;
  const chosen=chooseExercise(ids,swapIndex,id,knownIds);
  if(!chosen)return;
  prefs.custom[prefs.presetId]=chosen;swapIndex=null;swapQuery='';save();render();
 }
 else if(action==='close-swap'){swapIndex=null;swapQuery='';render();}
 else if(action==='dismiss-swap' && event.target===button){swapIndex=null;swapQuery='';render();}
 else if(action==='start'){beginWorkout();}
 else if(action==='adjust'){const field=button.dataset.field;if(!['workSec','restSec','rounds'].includes(field))return;prefs[field]=stepSetting(field,prefs[field],Number(button.dataset.direction));save();updatePicker(field);updateSettingsSummary();}
 else if(action==='pause'&&engine){
  if(engine.status==='running'){engine.pause();releaseWake();}
  else if(engine.status==='paused'){engine.resume();acquireWake();}
  renderWorkout();
 }
 else if(action==='skip'&&engine){engine.skip();if(view==='workout')renderWorkout();}
 else if(action==='exit'){
  if(window.confirm(T('exitConfirm')))exitWorkout();
 }
 else if(action==='restart'){beginWorkout();}
 else if(action==='setup'){engine=null;view='setup';render();}
 else if(action==='help'){showHelp();}
});
app.addEventListener('change',event=>{
 const field=event.target.dataset.config;if(!field)return;
 if(field==='sound'||field==='includeFinalRest'){prefs[field]=event.target.checked;if(field==='sound'&&!prefs.sound)cueAudio.stop();}
 else if(['workSec','restSec','rounds'].includes(field)){const value=Number(event.target.value);if(optionsFor(field,prefs[field]).includes(value))prefs[field]=value;updatePicker(field);}
 else return;
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
