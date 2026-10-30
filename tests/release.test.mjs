import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {EXERCISES,PRESETS,presetIds} from '../src/data.js';
import {LANGUAGES,exerciseText} from '../src/i18n.js';
import {WORKOUTS,WORKOUT_GROUPS} from '../src/workout-catalog.js';
import {buildPlan,planStats} from '../src/engine.js';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const languages=['en','de','it','fr','es'];
const app=read('src/app.js'),sw=read('sw.js'),home=read('index.html');
const manifest=JSON.parse(read('manifest.webmanifest'));
assert.equal(manifest.id,'./','preserve existing installed PWA identity');
assert.equal(manifest.name,'Pick5Go – Fitness, simplified.');
assert.equal(manifest.short_name,'Pick5Go');
assert.equal(manifest.icons.length,3);
assert.ok(!manifest.name.includes('Preview'));
assert.ok(app.includes("const STORAGE_KEY='pick5go-prefs-v13'"),'retain existing user preferences');
assert.ok(app.includes("PRIOR_KEYS=['flow5-prefs-v13-preview','flow5-prefs-v1']"),'migrate old clients');
assert.ok(app.includes("key+':beginner'"),'migrate legacy custom workout choices');
assert.equal(EXERCISES.length,32);
assert.equal(PRESETS.length,4);
assert.deepEqual(PRESETS.map(p=>p.id),['full','core','upper','legs']);
for(const p of PRESETS)for(const level of ['beginner','intermediate']){
 const ids=presetIds(p.id,level);
 assert.equal(ids.length,5);assert.equal(new Set(ids).size,5);
}
for(const l of LANGUAGES)for(const e of EXERCISES){
 const x=exerciseText(e,l.code);assert.ok(x.name&&x.cue&&x.tip,l.code+'/'+e.id);
}
for(const id of ['inclinePushup','kneeForearmPlank','stepJack','gluteBridgeMarch','supportedSplitSquat']){
 const bytes=readFileSync(new URL('../artwork/'+id+'-master-v1347.webp',import.meta.url));
 assert.equal(bytes.toString('ascii',0,4),'RIFF');
 assert.equal(bytes.toString('ascii',8,12),'WEBP');
 assert.ok(sw.includes('./artwork/'+id+'-master-v1347.webp'),'offline workout illustration');
 assert.ok(sw.includes('./artwork/thumbs/'+id+'-muscles.webp'),'offline muscle thumbnail');
}
assert.equal(WORKOUTS.length,11);
assert.deepEqual(Object.keys(WORKOUT_GROUPS),['quick','everyday','targeted']);
assert.ok(WORKOUTS.some(w=>w.ids.length===3)&&WORKOUTS.some(w=>w.ids.length===4)&&WORKOUTS.some(w=>w.ids.length===5));
assert.ok(app.includes('data-action="open-next"'),'recommended workout opens setup');
assert.ok(app.includes('data-action="prepare-now"'),'preparation can be skipped');
assert.ok(app.includes("view='prepare'"),'initial ten-second countdown');
assert.ok(app.includes('data-action="start"'),'timer starts from home');
assert.ok(app.includes('trackExerciseCompleted'),'Umami workout exercise event');
assert.ok(!home.includes('analytics-debug.js'),'do not load preview diagnostics');
assert.ok(home.includes('src/consent.js?build=1.3.60'));
assert.ok(home.includes('src/app.js?build=1.3.60'));
assert.ok(!home.includes('name="robots" content="noindex'),'production homepage must index');
assert.ok(!home.includes('Pick5Go Preview'));
assert.ok(home.includes('<title>Free Bodyweight Workout Builder &amp; Timer | Pick5Go</title>'));
assert.ok(home.includes('<link rel="canonical" href="https://pick5go.com/"/>'));
assert.ok(sw.includes("pick5go-v1.3-production-5"));
assert.ok(sw.includes("url.pathname.startsWith(root+'preview/')"),'do not intercept preview');
assert.ok(sw.includes("key==='flow5-v1.2.0'"),'purge old production cache');
assert.ok(!sw.includes("key.startsWith('pick5go-v1.3-preview-')"),'do not delete preview cache');
const sitemap=read('sitemap.xml'),robots=read('robots.txt');
assert.ok(robots.includes('Sitemap: https://pick5go.com/sitemap.xml'));
const urls=[...languages.map(l=>'https://pick5go.com/'+(l==='en'?'':l+'/')),
 ...languages.map(l=>'https://pick5go.com/'+(l==='en'?'':l+'/')+'about-calisthenics/'),
 'https://pick5go.com/workouts/'];
assert.equal((sitemap.match(/<loc>/g)||[]).length,11);
for(const u of urls)assert.ok(sitemap.includes('<loc>'+u+'</loc>'),'sitemap '+u);
for(const l of languages)for(const base of ['','about-calisthenics/']){
 const pathname=(l==='en'?'':l+'/')+base+'index.html';
 const html=read(pathname);
 const url='https://pick5go.com/'+(l==='en'?'':l+'/')+base;
 assert.ok(!html.includes('content="noindex'),'not indexable '+pathname);
 assert.ok(html.includes('<link rel="canonical" href="'+url+'"/>'),'canonical '+pathname);
 for(const alt of ['en','de','it','fr','es','x-default'])
  assert.ok(html.includes('hreflang="'+alt+'"'),'alternates '+pathname+'/'+alt);
}
const gallery=read('workouts/index.html');
assert.ok(gallery.includes('<link rel="canonical" href="https://pick5go.com/workouts/"/>'));
assert.ok(!gallery.includes('name="robots" content="noindex'));
assert.equal((gallery.match(/<article class="gallery-card">/g)||[]).length,11);
const schemas=[...home.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
assert.ok(schemas.some(s=>s['@type']==='WebSite'));
assert.ok(schemas.some(s=>s['@type']==='WebApplication'));
const plan=buildPlan(['inclinePushup','deadBug'],{workSec:40,restSec:20,rounds:3,includeFinalRest:true});
assert.equal(planStats(plan).totalMs,360000);
console.log('OK production release: 32 exercises, 5 WebPs, 11 workouts, progression flow, icons, 11 SEO URLs and isolated PWA cache');
