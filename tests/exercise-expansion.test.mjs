import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {EXERCISES,PRESETS} from '../src/data.js';
import {WORKOUTS,WORKOUT_GROUPS,CATALOG_LANGUAGES} from '../src/workout-catalog.js';
import {exerciseText} from '../src/i18n.js';
import {PROGRESSIONS,recommendWorkout} from '../src/coach.js';
import {decodeSharedWorkout,encodeSharedWorkout} from '../src/share.js';

const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const newIds=['inclinePushup','kneeForearmPlank','stepJack','gluteBridgeMarch','supportedSplitSquat'];
test('five exercises are fully localized, with dedicated muscle maps and full-size workout artwork',()=>{
 const app=read('src/app.js'),data=new Map(EXERCISES.map(e=>[e.id,e]));
 assert.equal(EXERCISES.length,32);
 for(const id of newIds){
  const ex=data.get(id);assert.ok(ex,id);
  assert.ok(ex.pose&&!app.includes(ex.pose+"-master.webp"),'no unrelated artwork for '+id);
  for(const lang of ['en','de','it','fr','es']){
   const localized=exerciseText(ex,lang);
   assert.ok(localized.name&&localized.cue&&localized.tip,id+' / '+lang);
   assert.ok(localized.cue.length<=175,id+' overly long '+lang);
  }
 }
 assert.ok(!app.includes('NEW_EXERCISE_IDS.has(e.id)'),'picker thumbnails no longer placeholders');
 for(const id of newIds){
  const thumb=read('src/app.js');
  assert.ok(thumb.includes(id+":'"+id+'-muscles.webp'),id+' new muscle map');
  const bytes=readFileSync(new URL('../artwork/thumbs/'+id+'-muscles.webp',import.meta.url));
  assert.equal(bytes.subarray(0,4).toString('ascii'),'RIFF');
 }
 assert.ok(app.includes('NEW_EXERCISE_IDS.has(exerciseId)'),'new exercise artwork mapping');
 assert.ok(app.includes('${exerciseId}-master-v1347.webp'),'uses exercise-specific full-resolution WebP');
});
test('new presets and guide workout links stay aligned across languages',()=>{
 const choices=new Map(PRESETS.map(x=>[x.id,x]));
 assert.ok(choices.get('upper').ids.includes('inclinePushup'));
 assert.ok(choices.get('core').ids.includes('kneeForearmPlank'));
 assert.ok(choices.get('legs').ids.includes('stepJack'));
 assert.ok(choices.get('upper').ids.includes('deadBug'));
 assert.equal(choices.get('upper').ids.filter(id=>['wallPushup','inclinePushup','kneePushup','pushup'].includes(id)).length,1);
 assert.ok(choices.get('legs').intermediateIds.includes('gluteBridgeMarch'));
 for(const lang of ['en','de','it','fr','es']){
  const path=(lang==='en'?'':lang+'/')+'about-calisthenics/index.html',html=read(path);
  const link=lang==='en'?'../workouts/?lang=en':'../../workouts/?lang='+lang;
  assert.ok(html.includes(link),path+' discover workouts');
  for(const preset of PRESETS){
   const marker='data-umami-event-workout="'+preset.id+'-beginner"';
   const before=html.slice(0,html.indexOf(marker));
   assert.ok(before.length>0&&before.length<html.length,'guide preset '+preset.id);
   const href=before.match(/href="([^\"]*\?w=[^\"]*)"[^<>]*$/)?.[1];
   assert.ok(href,marker+' href');
   const ids=decodeSharedWorkout(new URL(href,'https://example.test/preview/v1.3/'+(lang==='en'?'':lang+'/')+'about-calisthenics/').search)?.ids;
   assert.deepEqual(ids,preset.ids,lang+'/'+preset.id);
  }
 }
});
test('all 11 ready-made workouts use categorized, unique and safe shareable sessions',()=>{
 const gallery=read('workouts/index.html'),source=read('src/gallery.js');
 assert.equal(WORKOUTS.length,11);
 assert.deepEqual(Object.keys(WORKOUT_GROUPS),['quick','everyday','targeted']);
 assert.deepEqual([3,3,5],Object.keys(WORKOUT_GROUPS).map(x=>WORKOUTS.filter(r=>r.category===x).length));
 assert.ok(source.includes("from './workout-catalog.js'"),'filtered gallery uses canonical catalog');
 assert.ok(gallery.includes('type="module" src="./src/gallery.js'),'filters load as an external module');
 const cards=[...gallery.matchAll(/<article class="gallery-card">[\s\S]*?<\/article>/g)];
 assert.equal(cards.length,11,'static cards survive JavaScript failure');
 const groups=[...gallery.matchAll(/<section class="gallery-group"/g)];assert.equal(groups.length,3);
 const chains=[
  ['wallPushup','inclinePushup','kneePushup','pushup'],
  ['kneeForearmPlank','plank','shoulderTap'],
  ['march','stepJack','jumpingJack'],
  ['gluteBridge','gluteBridgeMarch','singleLegBridge'],
  ['squat','supportedSplitSquat','reverseLunge','assistedSingleLegSquat']
 ];
 const known=new Map(EXERCISES.map(e=>[e.id,e]));
 for(let i=0;i<WORKOUTS.length;i++){
  const w=WORKOUTS[i],raw=cards[i][0];
  assert.ok([3,4,5].includes(w.ids.length),'short workouts supported');
  assert.ok(w.ids.every(id=>known.has(id)));
  assert.equal(new Set(w.ids).size,w.ids.length,'no duplicate movements');
  assert.ok(w.title.length===5&&w.description.length===5);
  assert.ok(w.title.every(Boolean)&&w.description.every(Boolean));
  assert.ok(w.ids.every(id=>known.get(id).level<=(w.level==='beginner'?1:2)),w.title[0]+' respects level');
  for(const chain of chains)assert.ok(w.ids.filter(id=>chain.includes(id)).length<=1,w.title[0]+' no redundant difficulty variants');
  const href=raw.match(/href="([^"]*\?w=[^"]*)"/)?.[1];
  assert.ok(href,'missing static workout link');
  const decoded=decodeSharedWorkout(new URL(href,'https://example.test/preview/v1.3/').search);
  assert.deepEqual(decoded?.ids,w.ids,w.title[0]+' static links match canonical data');
  assert.equal(decoded?.rounds,w.rounds);
 }
 assert.deepEqual(CATALOG_LANGUAGES,['en','de','it','fr','es']);
 assert.ok(WORKOUTS.some(w=>w.ids.length===3));
 assert.ok(WORKOUTS.some(w=>w.ids.length===4));
 assert.ok(WORKOUTS.some(w=>w.ids.length===5));
});

test('progression next-workout links accept the five new exercise IDs',()=>{
 const session={ids:newIds,presetId:'full',difficulty:'beginner',rounds:3,workSec:40,restSec:20};
 const ratings=Object.fromEntries(newIds.map(id=>[id,'easy']));
 const next=recommendWorkout(session,ratings,{equipment:'none',quiet:true});
 assert.equal(next.session.ids.length,5);
 assert.equal(new Set(next.session.ids).size,5);
 assert.ok(next.changes.length>=3);
 assert.deepEqual(decodeSharedWorkout('?w='+encodeURIComponent(encodeSharedWorkout(next.session))).ids,next.session.ids);
});
test('work and rest UI keep instructions and science advice in separate blocks',()=>{
 const app=read('src/app.js'),workout=app.slice(app.indexOf('function renderWorkout(){'),app.indexOf('function renderDone(){'));
 const before=workout.indexOf('</section>'),rest=workout.indexOf('coach-rest-tip');
 assert.ok(before>=0&&rest>before,'rest advice must be outside the yellow workout box');
 assert.ok(workout.includes("isRest?'':`<p class=\"v13-art-cue\""),'no active exercise cue during rest');
 const css=read('styles.css');
 assert.match(css,/\.v13-clean \.coach-rest-tip\{[\s\S]*?background:transparent/);
});

test('completion is simplified and last rest has no misleading guidance',()=>{
 const app=read('src/app.js'),sw=read('sw.js');
 assert.match(app,/data-action="setup">\$\{escapeHtml\(C\('backToStart'\)\)\}/);
 assert.ok(!app.includes('data-action="restart"'),'repeat button removed');
 assert.ok(!app.includes("T('backToPlan')"),'bottom back to plan removed');
 assert.ok(!app.includes('health-export'),'no Apple health UI action');
 assert.ok(!app.includes('healthWorkoutPayload'),'no Apple health logic');
 assert.ok(!sw.includes('./src/health-export.js'),'no health script cached');
 assert.ok(!sw.includes('./health-shortcut/'),'no Apple shortcut guide cached');
 assert.ok(app.includes("isRest&&!finalRest?"),'last recovery interval shows no unnecessary science guidance');
});


test('all five new workout illustrations are valid, full-size WebPs, cached and referenced',()=>{
 const app=read('src/app.js'),sw=read('sw.js');
 for(const id of newIds){
  const name=id+'-master-v1347.webp';
  const asset=readFileSync(new URL('../artwork/'+name,import.meta.url));
  assert.ok(asset.length>50000,id+' source art must retain illustrative detail');
  assert.equal(asset.subarray(0,4).toString('ascii'),'RIFF',id);
  assert.equal(asset.subarray(8,12).toString('ascii'),'WEBP',id);
  assert.equal(asset.subarray(12,16).toString('ascii'),'VP8 ',id);
  assert.equal(asset.readUInt16LE(26)&0x3fff,1440,id+' width');
  assert.equal(asset.readUInt16LE(28)&0x3fff,960,id+' height');
  assert.ok(sw.includes('./artwork/'+name),id+' offline availability');
 }
 assert.ok(app.includes('${exerciseId}-master-v1347.webp'),'workout image path interpolates approved exercise ID');
});

test('compact movement note has no title or positive filler',async()=>{
 const app=read('src/app.js');
 assert.ok(app.includes("needsPullNotice=balanceWarnings(ids,prefs.presetId).includes('noPull')"));
 assert.ok(app.includes('needsPullNotice?'),'notice only shown when pulling is missing');
 assert.ok(!app.includes("C('balanced')"),'no movement-check title');
 assert.ok(!app.includes("C('fineCue')"),'no default positive callout');
 const {coachText}=await import('../src/coach-i18n.js');
 assert.equal(coachText('en','noPull'),'This workout does not include resisted pulling. A band row can improve upper-body balance');
});

test('final rest always shows the original hydration illustration after any new exercise',()=>{
 const app=read('src/app.js');
 const start=app.indexOf('function studyPicture(');
 const end=app.indexOf('\nfunction renderWorkout(){',start);
 assert.ok(start>=0&&end>start,'image renderer function present');
 const source=app.slice(start,end);
 const render=new Function('NEW_EXERCISE_IDS','STUDY_IMAGE','escapeHtml','T',
   source+'\nreturn studyPicture;')(
   new Set(newIds),
   {recovery:'recovery-hydration-corrected.webp'},
   value=>value,
   ()=> 'Illustration pending'
 );
 for(const id of newIds){
  const rest=render('recovery','Final rest','en',id);
  assert.ok(rest.includes('recovery-hydration-corrected.webp'),id+' should use recovery artwork');
  assert.ok(!rest.includes(id+'-master-v1347.webp'),id+' must not override recovery art');
  const exercise=render('new-pose','Exercise','en',id);
  assert.ok(exercise.includes(id+'-master-v1347.webp'),id+' still uses new exercise art while active');
 }
 assert.ok(app.includes("finalRest?'':present.id"),'final-rest call must ignore last exercise id');
});

test('Open workout takes the user to a persisted preselected builder, not the timer',()=>{
 const app=read('src/app.js');
 assert.ok(app.includes('data-action="open-next"'),'completion CTA available');
 assert.ok(app.includes("C('openWorkout')"),'five-language CTA');
 assert.ok(!app.includes('data-action="start-next"'),'old immediate-start CTA removed');
 const start=app.indexOf("else if(action==='open-next'");
 const end=app.indexOf("else if(action==='start'){",start);
 assert.ok(start>=0&&end>start);
 const handler=app.slice(start,end);
 assert.ok(handler.includes('recommendWorkout(workoutSession,workoutRatings'),'ratings used for new plan');
 assert.ok(handler.includes('prefs.custom[currentCustomKey()]=[...next.ids]'),'suggested IDs preselected');
 assert.ok(handler.includes('workSec:next.workSec'),'interval settings preserved');
 assert.ok(handler.includes('save();'),'preselection saved between visits');
 assert.ok(handler.includes("searchParams.delete('w')"),'stale shared URL cannot replace saved workout');
 assert.ok(handler.includes("view='setup';render();"),'returns to home builder');
 assert.ok(!handler.includes('beginWorkout('),'does not start workout');
});


test('ready-made workouts link sits below the workout plan card and is localized',async()=>{
 const app=read('src/app.js'),css=read('styles.css');
 const setup=app.slice(app.indexOf('function renderSetup(){'),app.indexOf('function updateSettingsSummary(){'));
 const intro=setup.slice(setup.indexOf('<section class="intro">'),setup.indexOf('<section class="panel preset-panel">'));
 assert.ok(!intro.includes('coach-gallery-link'),'intro must not contain the link');
 const after=setup.indexOf('<nav class="coach-gallery-after"');
 const summary=setup.indexOf('<aside class="summary-panel">');
 const mainEnd=setup.indexOf('</main>',summary);
 const footer=setup.indexOf('<footer class="footer">',mainEnd);
 assert.ok(summary>=0&&mainEnd>summary&&after>mainEnd&&footer>after,'link follows workout plan, before footer');
 assert.ok(setup.includes('href="./workouts/?lang=${prefs.lang}"'),'workout link preserves language');
 assert.equal((setup.match(/class="coach-gallery-link"/g)||[]).length,1);
 assert.ok(css.includes('.coach-gallery-after'),'placement has styling');
 const {coachText}=await import('../src/coach-i18n.js');
 assert.equal(coachText('en','explore'),'Browse more ready-made workouts');
 for(const lang of ['de','it','fr','es'])assert.ok(coachText(lang,'explore').length>12,lang+' label localized');
});

test('ready-made wording and versioned coach localization cannot drift across cached page versions',async()=>{
 const app=read('src/app.js'),sw=read('sw.js'),html=read('index.html');
 const {coachText}=await import('../src/coach-i18n.js');
 assert.equal(coachText('en','explore'),'Browse more ready-made workouts');
 assert.ok(app.includes("from './coach-i18n.js?build=1.3.53'"),'app imports cache-busted translations');
 assert.ok(sw.includes("'./src/coach-i18n.js?build=1.3.53'"),'SW precaches same translation module version');
 assert.ok(html.includes('src/app.js?build=1.3.53'),'new page loads refreshed app');
 assert.ok(app.includes("${escapeHtml(C('explore'))} →"),'visible link comes from translated key');
});
