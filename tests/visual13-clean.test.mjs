import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../styles.css',import.meta.url),'utf8');
const sw=readFileSync(new URL('../sw.js',import.meta.url),'utf8');
const workout=app.slice(app.indexOf('function renderWorkout(){'),app.indexOf('function renderDone(){'));
assert.match(workout,/v13-clean/);
assert.match(workout,/pick5go-mark/);
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
assert.ok(sw.includes('pick5go-v1.3-production-2'));
console.log('OK: integrated illustration and instructions, clean header and timer, preserved controls');

assert.doesNotMatch(app,/CALISTHENICS TIMER/);

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert.ok(html.includes('styles.css?build=1.3.42'));
assert.ok(html.includes('src/app.js?build=1.3.42'));
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
for(const name of ['birddog','superman']){
 const content=readFileSync(new URL('../artwork/'+name+'-master.webp',import.meta.url));
 assert.ok(content.byteLength>100000,name+' illustration should contain high quality WebP data');
 assert.equal(content.subarray(0,4).toString('ascii'),'RIFF');
 assert.ok(app.includes(name+':\''+name+'-master.webp\''),name+' must be in image registry');
 assert.ok(sw.includes('artwork/'+name+'-master.webp'),name+' must be available offline');
}
assert.match(app,/exerciseId==='snowAngel'\?STUDY_IMAGE\.snowangel/);
assert.ok(app.includes("T('placeholder')"),'unillustrated exercises must display honest temporary artwork');

// v1.3.13: verify correction assets, localized Dead Bug follow-through, and offline caching.
for (const asset of ['shouldertap-clean-v1315.webp','recovery-hydration-corrected.webp']) {
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

// v1.3.14: neutral Shoulder Tap palette without altering the recovery artwork.
assert.ok(app.includes("shouldertap:'shouldertap-clean-v1315.webp'"));
assert.ok(app.includes("recovery:'recovery-hydration-corrected.webp'"));
assert.ok(!app.includes("shouldertap:'shouldertap-corrected.webp'"));
assert.ok(sw.includes('./artwork/shouldertap-clean-v1315.webp'));

// v1.3.15 – New clean anatomical studies replace the composite-source images.
for(const [pose,file] of [['deadbug','deadbug-clean-v1315.webp'],['shouldertap','shouldertap-clean-v1315.webp']]){
 const data=readFileSync(new URL('../artwork/'+file,import.meta.url));
 assert.ok(data.byteLength>100000,file+' must contain source illustration detail');
 assert.equal(data.subarray(0,4).toString('ascii'),'RIFF');
 assert.ok(app.includes(pose+":'"+file+"'"),file+' should be active');
 assert.ok(sw.includes('./artwork/'+file),file+' should be precached');
}
assert.doesNotMatch(app,/deadbug:'deadbug-master.webp'/);
assert.doesNotMatch(app,/shouldertap:'shouldertap-neutral.webp'/);

// v1.3.16: validated, complete wall-push-up study, mapped and cached offline.
const wallAsset=readFileSync(new URL('../artwork/wallpushup-master-v1317.webp',import.meta.url));
assert.ok(wallAsset.byteLength > 100000);
assert.equal(wallAsset.subarray(0,4).toString('ascii'),'RIFF');
// WebP VP8 lossy image width/height are 14-bit little-endian at offsets 26/28.
const wallView = wallAsset.subarray(12,16).toString('ascii');
assert.equal(wallView,'VP8 ');
const wallWidth = wallAsset.readUInt16LE(26)&0x3fff;
const wallHeight = wallAsset.readUInt16LE(28)&0x3fff;
assert.equal(wallWidth,1440);
assert.equal(wallHeight,960);
assert.ok(app.includes("wall:'wallpushup-master-v1317.webp'"));
assert.ok(sw.includes('./artwork/wallpushup-master-v1317.webp'));

// v1.3.17 palette-matched Wall Push-ups; preserve the v1.3.16 artwork for rollback.
const matchedWallAsset=readFileSync(new URL('../artwork/wallpushup-master-v1317.webp',import.meta.url));
assert.equal(matchedWallAsset.subarray(0,4).toString('ascii'),'RIFF');
assert.equal(matchedWallAsset.subarray(12,16).toString('ascii'),'VP8 ');
assert.equal(matchedWallAsset.readUInt16LE(26)&0x3fff,1440);
assert.equal(matchedWallAsset.readUInt16LE(28)&0x3fff,960);
assert.ok(matchedWallAsset.length>100000);
assert.ok(app.includes("wall:'wallpushup-master-v1317.webp'"));
assert.ok(!app.includes("wall:'wallpushup-master-v1316.webp'"));
assert.ok(sw.includes('pick5go-v1.3-production-2'));
assert.ok(sw.includes('./artwork/wallpushup-master-v1317.webp'));
const updatedHTML=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert.ok(updatedHTML.includes('build=1.3.42'));

// v1.3.18 Pike Push-ups: asset is a real Retina-sized two-pose WebP, not a placeholder.
const pikeAsset=readFileSync(new URL('../artwork/pikepushup-master-v1318.webp',import.meta.url));
assert.ok(pikeAsset.byteLength > 90000);
assert.equal(pikeAsset.subarray(0,4).toString('ascii'),'RIFF');
assert.equal(pikeAsset.subarray(12,16).toString('ascii'),'VP8 ');
assert.equal(pikeAsset.readUInt16LE(26)&0x3fff,1440);
assert.equal(pikeAsset.readUInt16LE(28)&0x3fff,960);
assert.ok(app.includes("pike:'pikepushup-master-v1318.webp'"));
assert.ok(sw.includes('./artwork/pikepushup-master-v1318.webp'));

// v1.3.20: two new full-resolution exercises, verified independently of the older SVG placeholders.
for (const [pose,file] of [ ['wallsit','wallsit-master-v1319.webp'], ['jumping','jumpingjacks-master-v1320.webp'] ]) {
 const bytes=readFileSync(new URL('../artwork/'+file,import.meta.url));
 assert.ok(bytes.length>85000, file+' must have detailed image data');
 assert.equal(bytes.subarray(0,4).toString('ascii'),'RIFF');
 assert.equal(bytes.subarray(12,16).toString('ascii'),'VP8 ');
 assert.equal(bytes.readUInt16LE(26)&0x3fff,1440);
 assert.equal(bytes.readUInt16LE(28)&0x3fff,960);
 assert.ok(app.includes(pose+":'"+file+"'"));
 assert.ok(sw.includes('./artwork/'+file));
}
assert.ok(sw.includes('pick5go-v1.3-production-2'));
assert.ok(readFileSync(new URL('../index.html',import.meta.url),'utf8').includes('build=1.3.42'));

// v1.3.21: calf raises (flat feet vs lifted heels), verified WebP file and offline mapping.
const calf=readFileSync(new URL('../artwork/calfraise-master-v1321.webp',import.meta.url));
assert.ok(calf.byteLength>70000,'Calf Raises image contains meaningful artwork');
assert.equal(calf.subarray(0,4).toString('ascii'),'RIFF');
assert.equal(calf.subarray(12,16).toString('ascii'),'VP8 ');
assert.equal(calf.readUInt16LE(26)&0x3fff,1440);
assert.equal(calf.readUInt16LE(28)&0x3fff,960);
assert.ok(app.includes("calf:'calfraise-master-v1321.webp'"));
assert.ok(sw.includes('./artwork/calfraise-master-v1321.webp'));
assert.ok(sw.includes('pick5go-v1.3-production-2'));
assert.ok(readFileSync(new URL('../index.html',import.meta.url),'utf8').includes('build=1.3.42'));

// v1.3.22 – Final three placeholders replaced with reviewed 1440 x 960 WebP artwork.
for(const [pose,file] of [['bear','bear-master-v1322.webp'],['heeltouch','heeltouch-master-v1322.webp'],['snowangel','snowangel-master-v1322.webp']]){
 const asset=readFileSync(new URL('../artwork/'+file,import.meta.url));
 assert.ok(asset.length>90000,pose+' must contain complete anatomical artwork');
 assert.equal(asset.subarray(0,4).toString('ascii'),'RIFF');
 assert.equal(asset.subarray(12,16).toString('ascii'),'VP8 ');
 assert.equal(asset.readUInt16LE(26)&0x3fff,1440);
 assert.equal(asset.readUInt16LE(28)&0x3fff,960);
 assert.ok(app.includes(pose+":'"+file+"'"));
 assert.ok(sw.includes('./artwork/'+file));
}
assert.ok(app.includes("exerciseId==='snowAngel'?STUDY_IMAGE.snowangel"));
assert.ok(app.includes("superman:'superman-master.webp'"));
assert.ok(sw.includes('pick5go-v1.3-production-2'));
assert.ok(html.includes('src/app.js?build=1.3.42'));


// v1.3.23 technique audit: short bilingual cues, no illustration asset changes.
const EXERCISES_DE = (await import('../src/data.js')).EXERCISES;
const exerciseTextEN = (await import('../src/i18n.js')).exerciseText;
assert.equal(EXERCISES_DE.length,27);
for (const exercise of EXERCISES_DE) {
  const translated=exerciseTextEN(exercise,'en');
  assert.ok(exercise.cue.length<=165, exercise.id+' German cue too long');
  assert.ok(translated.cue.length<=165, exercise.id+' English cue too long');
  assert.ok(exercise.tip&&translated.tip,exercise.id+' coaching tip is present');
}
for (const [id,deFragment,enFragment] of [
 ['pushup','wieder hochdrücken','push back up'],
 ['birdDog','zurückführen','return'],
 ['bicycle','anderes Bein strecken','other leg extends'],
 ['pikePushup','wieder hochdrücken','press back up'],
 ['snowAngel','Beine bleiben unten','keep legs down'],
 ['wallSit','Füße davor','feet slightly forward'],
 ['jumpingJack','Arme über Kopf','arms rise overhead'],
 ['heelTouch','gleichseitigen Ferse','same-side heel'],
 ['bearHold','Zehen aufstellen','tuck your toes']
]) {
 const ex=EXERCISES_DE.find(e=>e.id===id);
 assert.ok(ex.cue.includes(deFragment),id+' German movement cue');
 assert.ok(exerciseTextEN(ex,'en').cue.includes(enFragment),id+' English movement cue');
}


// v1.3.27 — validated anatomy artwork and resilient offline-cached mappings.
for(const [pose,name] of [['hiphinge','hiphinge-master-v1327.webp'],['kneepushup','kneepushup-master-v1328.webp'],['bandrow','bandrow-master-v1328.webp']]){
 const img=readFileSync(new URL('../artwork/'+name,import.meta.url));
 assert.equal(img.subarray(0,4).toString('ascii'),'RIFF',name+' WebP header');
 assert.ok(img.byteLength>50000,name+' nonempty artwork');
 assert.equal(img.subarray(12,16).toString('ascii'),'VP8 ');
 assert.equal(img.readUInt16LE(26)&0x3fff,1440);
 assert.equal(img.readUInt16LE(28)&0x3fff,960);
 assert.ok(app.includes(pose+":'"+name+"'"));
 assert.ok(sw.includes('./artwork/'+name));
}

// v1.3.30: replacement files, exact dimensions and localized long-towel option.
for(const name of ['kneepushup-master-v1328.webp','bandrow-master-v1328.webp']){
 const b=readFileSync(new URL('../artwork/'+name,import.meta.url));
 assert.ok(b.byteLength>110000,name+' full-resolution imagery');
 assert.equal(b.subarray(0,4).toString('ascii'),'RIFF');
 assert.equal(b.subarray(12,16).toString('ascii'),'VP8 ');
 assert.equal(b.readUInt16LE(26)&0x3fff,1440);
 assert.equal(b.readUInt16LE(28)&0x3fff,960);
 assert.ok(sw.includes('./artwork/'+name));
}
assert.ok(EXERCISES_DE.find(e=>e.id==='bandRow').cue.includes('Handtuch'));
assert.ok(exerciseTextEN(EXERCISES_DE.find(e=>e.id==='bandRow'),'en').cue.includes('towel'));


// v1.3.30: final two anatomy images; both have exact dimensions, valid WebP,
// distinct mappings, and the full 27-exercise catalogue has no active placeholders.
for(const [pose,file] of [['singlelegbridge','singlelegbridge-master-v1329.webp'],['assistedsquat','assistedsquat-master-v1329.webp']]){
 const bytes=readFileSync(new URL('../artwork/'+file,import.meta.url));
 assert.ok(bytes.byteLength>100000,'Detailed anatomical artwork required: '+pose);
 assert.equal(bytes.subarray(0,4).toString('ascii'),'RIFF',pose);
 assert.equal(bytes.subarray(12,16).toString('ascii'),'VP8 ',pose);
 assert.equal(bytes.readUInt16LE(26)&0x3fff,1440,pose);
 assert.equal(bytes.readUInt16LE(28)&0x3fff,960,pose);
 assert.ok(app.includes(pose+":'"+file+"'"),'Workout uses final image '+pose);
 assert.ok(sw.includes('./artwork/'+file),'Offline cache contains '+pose);
}
const activeMap=app.slice(app.indexOf('const STUDY_IMAGE='),app.indexOf('function studyPicture('));
for(const e of EXERCISES_DE){
 if(e.id==='snowAngel'){assert.ok(activeMap.includes("snowangel:'snowangel-master-v1322.webp'"));continue;}
 assert.ok(activeMap.includes(e.pose+":"),'Missing illustration map for '+e.id+' ('+e.pose+')');
}

// Pick5Go headline is intentionally untranslated; tagline and instructions are localized.
assert.match(i18n,/heroEyebrow:'FITNESS, SIMPLIFIED.',heroFirst:'pick five',heroSecond:'go'/);
assert.match(i18n,/heroEyebrow:'FITNESS, GANZ EINFACH.',heroFirst:'pick five',heroSecond:'go'/);

// v1.3.31: exercise-list/picker muscle maps are valid offline-cached WebP thumbnails.
for(const [id,file] of [['squat','squat'],['kneePushup','kneePushup'],['hipHinge','hipHinge'],['birdDog','birdDog'],['march','march']]){
 const name=file+'-muscles.webp';
 const bytes=readFileSync(new URL('../artwork/thumbs/'+name,import.meta.url));
 assert.ok(bytes.byteLength>3000,name+' should contain useful detail');
 assert.equal(bytes.subarray(0,4).toString('ascii'),'RIFF');
 assert.equal(bytes.subarray(12,16).toString('ascii'),'VP8 ');
 assert.equal(bytes.readUInt16LE(26)&0x3fff,192);
 assert.equal(bytes.readUInt16LE(28)&0x3fff,154);
 assert.ok(sw.includes('./artwork/thumbs/'+name),'Thumbnail available offline: '+name);
 assert.ok(app.includes(id+":'"+name+"'"),'Thumbnail mapped: '+id);
}
assert.ok(app.includes('${exerciseThumbnail(e)}'),'Exercise rows and picker use thumbnails');

// v1.3.32: ten newly-generated exercise thumbnails use consistent WebP assets.
for(const id of ["pushup","wallPushup","bandRow","snowAngel","plank","deadBug","gluteBridge","singleLegBridge","calfRaise","jumpingJack"]){
 const name=id+'-muscles.webp';
 const bytes=readFileSync(new URL('../artwork/thumbs/'+name,import.meta.url));
 assert.ok(bytes.length>10000,name+' nonempty WebP asset');
 assert.equal(bytes.subarray(0,4).toString('ascii'),'RIFF',name);
 assert.equal(bytes.subarray(8,12).toString('ascii'),'WEBP',name);
 assert.equal(bytes.subarray(12,16).toString('ascii'),'VP8 ',name);
 assert.equal(bytes.readUInt16LE(26)&0x3fff,640,name+' width');
 assert.equal(bytes.readUInt16LE(28)&0x3fff,512,name+' height');
 assert.ok(sw.includes('./artwork/thumbs/'+name),name+' available offline');
 assert.ok(app.includes(id+":'"+name+"'"),name+' exercise mapped');
}

// Regression guard: every catalogue exercise has a dedicated anatomical WebP.
// Avoid hard-coding the artwork catalogue in this test: new exercises must be mapped.
const thumbnailMap=app.slice(app.indexOf('const MUSCLE_THUMBNAILS='),app.indexOf('function exerciseThumbnail('));
assert.equal(EXERCISES_DE.length,27);
for(const exercise of EXERCISES_DE){
 const name=exercise.id+'-muscles.webp';
 const bytes=readFileSync(new URL('../artwork/thumbs/'+name,import.meta.url));
 assert.ok(bytes.byteLength>3000,exercise.id+' non-empty thumbnail');
 assert.equal(bytes.subarray(0,4).toString('ascii'),'RIFF',exercise.id+' RIFF');
 assert.equal(bytes.subarray(8,12).toString('ascii'),'WEBP',exercise.id+' WebP');
 assert.equal(bytes.subarray(12,16).toString('ascii'),'VP8 ',exercise.id+' VP8');
 assert.ok(thumbnailMap.includes(exercise.id+":'"+name+"'"),exercise.id+' has JS mapping');
 assert.ok(sw.includes('./artwork/thumbs/'+name),exercise.id+' is offline cached');
}
const completed=app.slice(app.indexOf('function renderDone(){'),app.indexOf('function updateClock(){'));
assert.ok(completed.includes('session.ids.map((id,i)=>{const e=E(id)'), 'Record uses exercises from finished session');
assert.ok(completed.includes('class="record-exercise-thumb"'), 'Record renders each exercise image');
assert.ok(completed.includes('${exerciseThumbnail(e)}'), 'Record reuses anatomical thumbnails');
assert.ok(css.includes('.record-exercises .record-exercise-thumb'), 'Record thumbnails are styled');
