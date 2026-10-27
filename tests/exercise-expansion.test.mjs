import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {EXERCISES,PRESETS} from '../src/data.js';
import {exerciseText} from '../src/i18n.js';
import {PROGRESSIONS,recommendWorkout} from '../src/coach.js';
import {decodeSharedWorkout,encodeSharedWorkout} from '../src/share.js';

const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const newIds=['inclinePushup','kneeForearmPlank','stepJack','gluteBridgeMarch','supportedSplitSquat'];
test('five exercises are fully localized and kept as visible placeholders',()=>{
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
 assert.ok(app.includes('NEW_EXERCISE_IDS.has(e.id)'),'picker thumbnail placeholder');
 assert.ok(app.includes('NEW_EXERCISE_IDS.has(exerciseId)'),'workout placeholder');
});
test('new presets and guide workout links stay aligned across languages',()=>{
 const choices=new Map(PRESETS.map(x=>[x.id,x]));
 assert.ok(choices.get('upper').ids.includes('inclinePushup'));
 assert.ok(choices.get('core').ids.includes('kneeForearmPlank'));
 assert.ok(choices.get('legs').ids.includes('supportedSplitSquat'));
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
test('curated gallery surfaces all five new exercises and has static, usable links',()=>{
 const gallery=read('workouts/index.html'),source=read('src/gallery.js');
 for(const id of newIds){assert.ok(gallery.includes(id),'gallery '+id);assert.ok(source.includes(id),'gallery JS '+id);}
 const cards=[...gallery.matchAll(/<article class="gallery-card">[\s\S]*?<\/article>/g)];
 assert.ok(cards.length>=14,'static cards must render without JavaScript');
 for(const card of cards){
  const href=card[0].match(/href="([^\"]*\?w=[^\"]*)"/)?.[1];
  assert.ok(href,'missing workout link in static card');
  assert.ok(decodeSharedWorkout(new URL(href,'https://example.test/preview/v1.3/workouts/').search),'invalid gallery share link');
 }
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
