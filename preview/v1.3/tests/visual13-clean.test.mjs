import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../styles.css',import.meta.url),'utf8');
const sw=readFileSync(new URL('../sw.js',import.meta.url),'utf8');
const workout=app.slice(app.indexOf('function renderWorkout(){'),app.indexOf('function renderDone(){'));
assert.match(workout,/v13-clean/);
assert.match(workout,/v13-wordmark/);
assert.match(workout,/v13-art-heading/);
assert.match(workout,/v13-art-cue/);
assert.match(workout,/<h1>.*?displayName.*?<\/h1>/);
assert.ok(workout.indexOf('v13-art-cue') > workout.indexOf('v13-drawing'));
assert.doesNotMatch(workout,/v13-instruction/);
assert.doesNotMatch(workout,/CALISTHENICS TIMER/);
assert.doesNotMatch(workout,/ANATOMICAL STUDY|CLASSIC STUDY|PREVIEW · 1\.3/);
assert.match(workout,/id="phase-time"/);
assert.match(workout,/id="remaining-time"/);
assert.match(workout,/id="whole-progress"/);
assert.match(workout,/data-action="pause"/);
assert.match(workout,/data-action="skip"/);
assert.match(workout,/id="wake-indicator"/);
assert.match(css,/\.v13-clean \.v13-art-cue/);
assert.ok(sw.includes('flow5-v1.3-preview-13'));
console.log('OK: integrated illustration and instructions, clean header and timer, preserved controls');

assert.doesNotMatch(app,/CALISTHENICS TIMER/);

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert.ok(html.includes('styles.css?build=1.3.13'));
assert.ok(html.includes('src/app.js?build=1.3.13'));
assert.match(sw,/cache:'no-store'/);
assert.match(app,/studyPicture\(finalRest\?'recovery':present\.pose/);
assert.match(app,/finalRest\?T\('recoveryCue'\)/);

for(const name of ['squat','pushup','plank','recovery']){
 const image=readFileSync(new URL('../artwork/'+name+'-master.webp',import.meta.url));
 assert.ok(image.byteLength>10000);
 assert.equal(image.subarray(0,4).toString('ascii'),'RIFF');
}
assert.match(css,/v13-study-image/);
assert.ok(sw.includes('artwork/recovery.webp'));
assert.ok(app.includes("recovery:'recovery-hydration-corrected.webp'"));
assert.ok(app.includes("lunge:'lunge-master.webp'"));
assert.ok(app.includes("mountain:'mountain-master.webp'"));
assert.ok(app.includes("bridge:'bridge-master.webp'"));
assert.ok(readFileSync(new URL('../artwork/recovery.webp',import.meta.url)).byteLength>2000);

assert.match(app,/width="1440" height="960"/);
for(const name of ['squat','pushup','plank'])assert.ok(app.includes(name+'-master.webp'));

assert.doesNotMatch(sw,/OPTIONAL_ART/);
assert.match(sw,/cache\.addAll\(CORE\)/);
assert.match(app,/data-pose/);
for(const name of ['lunge','mountain','bridge'])assert.ok(sw.includes(name+'-master.webp')||sw.includes(name+'.webp'));
assert.ok(sw.includes('recovery-hydration-corrected.webp'));

for(const name of ['lunge','mountain','bridge','recovery-hydration']){
 const file=readFileSync(new URL('../artwork/'+name+'-master.webp',import.meta.url));
 assert.ok(file.byteLength>40000,name+' artwork should be high-resolution');
 assert.equal(file.subarray(0,4).toString('ascii'),'RIFF');
}

// Three additional illustration assets and side-specific orientation.
for(const name of ['march','bicycle','sideplank']){
 const image=readFileSync(new URL('../artwork/'+name+'-master.webp',import.meta.url));
 assert.ok(image.byteLength>60000,name+' artwork should contain detailed image data');
 assert.equal(image.subarray(0,4).toString('ascii'),'RIFF');
 assert.ok(app.includes(name+':\''+name+'-master.webp\''));
 assert.ok(sw.includes('artwork/'+name+'-master.webp'));
}
assert.match(app,/exerciseId==='sidePlankL'/);
assert.match(app,/transform:scaleX\(-1\)/);
assert.match(app,/displayName,prefs.lang,present.id/);

// v1.3.12: four new illustration assets, no accidental reuse for Snow Angels.
for(const name of ['birddog','deadbug','superman']){
 const content=readFileSync(new URL('../artwork/'+name+'-master.webp',import.meta.url));
 assert.ok(content.byteLength>100000,name+' illustration should contain high quality WebP data');
 assert.equal(content.subarray(0,4).toString('ascii'),'RIFF');
 assert.ok(app.includes(name+':\''+name+'-master.webp\''),name+' must be in image registry');
 assert.ok(sw.includes('artwork/'+name+'-master.webp'),name+' must be available offline');
}
assert.match(app,/pose==='superman'&&exerciseId==='snowAngel'/);
assert.match(app,/return illustration13\(pose,name,lang\)/);

// v1.3.13: verify correction assets, localized Dead Bug follow-through, and offline caching.
for (const asset of ['shouldertap-corrected.webp','recovery-hydration-corrected.webp']) {
 const image=readFileSync(new URL('../artwork/'+asset,import.meta.url));
 assert.ok(image.byteLength>100000,asset+' must contain nontrivial high-quality image data');
 assert.equal(image.subarray(0,4).toString('ascii'),'RIFF');
 assert.ok(sw.includes('artwork/'+asset),asset+' must be precached');
 assert.ok(app.includes(asset),asset+' must be mapped in the app');
}
assert.ok(!app.includes("shouldertap:'shouldertap-master.webp'"));
assert.ok(!app.includes("recovery:'recovery-hydration-master.webp'"));
const data=readFileSync(new URL('../src/data.js',import.meta.url),'utf8');
const i18n=readFileSync(new URL('../src/i18n.js',import.meta.url),'utf8');
assert.match(data,/beide zurückführen und die Seite wechseln/);
assert.match(i18n,/bring both back up, then switch sides/);
