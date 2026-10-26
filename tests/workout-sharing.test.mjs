import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {decodeSharedWorkout,encodeSharedWorkout,sharedWorkoutUrl} from '../src/share.js';
import {PRESETS} from '../src/data.js';
import {t} from '../src/i18n.js';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');

const root='https://lt-dangelo.github.io/flow5/preview/v1.3/';
const prod='https://pick5go.com/';
const original={presetId:'full',difficulty:'beginner',ids:['squat','kneePushup','hipHinge','birdDog','march'],workSec:40,restSec:20,rounds:3};
const encoded=encodeSharedWorkout(original);
assert.equal(encoded,'1~full~beginner~squat,kneePushup,hipHinge,birdDog,march~40~20~3');
assert.deepEqual(decodeSharedWorkout('?w='+encodeURIComponent(encoded)),original);
for(const lang of ['en','de','it','fr','es']){
 const url=sharedWorkoutUrl(root,lang,original);
 assert.equal(new URL(url).pathname,'/flow5/preview/v1.3/'+(lang==='en'?'':lang+'/'));
 assert.deepEqual(decodeSharedWorkout(new URL(url).search),original);
 assert.equal(new URL(sharedWorkoutUrl(prod,lang,original)).pathname,'/'+(lang==='en'?'':lang+'/'));
 for(const key of ['shareWorkout','shareMessage','shareCopied','shareFailed','sharePrompt']){
  assert.ok(t(lang,key)&&t(lang,key)!==key,lang+' missing '+key);
 }
 assert.ok(!t(lang,'recordHint').toLowerCase().includes('screenshot'),lang+' screenshot guidance remains');
}
for(const bad of [
 '?w=2~full~beginner~squat~40~20~3',
 '?w=1~full~beginner~squat,squat~40~20~3',
 '?w=1~full~beginner~unknown~40~20~3',
 '?w=1~unknown~beginner~squat~40~20~3',
 '?w=1~full~expert~squat~40~20~3',
 '?w=1~full~beginner~squat~0~20~3',
 '?w=1~full~beginner~squat~40~301~3',
 '?w=1~full~beginner~squat~40~20~21',
 '?w=1~full~beginner~squat~abc~20~3',
 '?w=1~full~beginner~squat~40~20~3&w=1~full~beginner~squat~40~20~3',
 '?w='+('x'.repeat(250))
]){
 assert.equal(decodeSharedWorkout(bad),null,'must reject '+bad.slice(0,65));
}
assert.equal(encodeSharedWorkout({...original,ids:['squat','squat']}),null);
assert.equal(encodeSharedWorkout({...original,rounds:0}),null);
assert.equal(encodeSharedWorkout({...original,ids:['evil']}),null);
const app=read('src/app.js'),home=read('index.html'),sw=read('sw.js'),guide=read('about-calisthenics/index.html'),consent=read('src/consent.js');
assert.ok(app.includes('initialSharedWorkout=decodeSharedWorkout(location.search)'),'load deep link on arrival');
assert.ok(app.includes("prefs.custom[presetId+':'+difficulty]=[...ids]"),'restore ordered exercises');
assert.ok(app.includes("!initialSharedWorkout"),'do not redirect away from incoming root share links');
assert.ok(app.includes("view==='done'&&workoutSession"),'share the completed session');
assert.ok(app.includes("data-action=\"share\""),'share available in app');
assert.ok((app.match(/data-action="share"/g)||[]).length>=2,'share before and after workout');
assert.ok(app.includes('navigator.share'),'native share option');
assert.ok(app.includes('navigator.clipboard?.writeText'),'copy fallback');
assert.ok(sw.includes('./src/share.js'),'offline import');
assert.ok(sw.includes("pick5go-v1.3-preview-47"),'cache version bumped');
assert.ok(consent.includes("if(onGuide())return guideLang()"),'guide language follows URL rather than stored preferences');
assert.ok(guide.includes('src="../src/consent.js?build=1.3.41"'),'guide uses same consent script');
assert.ok(guide.includes('id="analytics-settings"'),'guide can change analytics consent');
assert.ok(guide.includes('data-umami-event="guide_workout_opened"'),'consented Umami click events');
const links=[...guide.matchAll(/href="(\.\.\/\?w=[^"]+)"[^>]*data-umami-event="guide_workout_opened"[^>]*data-umami-event-workout="([^"]+)"/g)];
assert.equal(links.length,6,'two examples and four focus presets');
const plans=new Map(links.map(([,href,key])=>[key,decodeSharedWorkout(new URL(href,new URL('about-calisthenics/',root)).search)]));
assert.deepEqual(plans.get('fullbody-15'),original);
assert.deepEqual(plans.get('hotel-10'),{...original,ids:['squat','wallPushup','hipHinge','birdDog','march'],rounds:2});
for(const preset of PRESETS){
 assert.deepEqual(plans.get(preset.id+'-beginner'),{...original,presetId:preset.id,ids:preset.ids},'guide '+preset.id+' uses app preset');
}
assert.equal(guide.includes('name="robots" content="noindex,follow"'),true,'preview remains noindex');
console.log('OK: share round-trips, rejects invalid links, works in all 5 languages, guide ready workouts and optional Umami');
