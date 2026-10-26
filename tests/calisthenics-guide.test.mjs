import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const home=read('index.html');
const guide=read('about-calisthenics/index.html');
const css=read('about-calisthenics/guide.css');
const sw=read('sw.js');
const sections=['what-is-calisthenics','little-time','travelling','no-equipment','getting-started','before-after','workout-goals','beyond-calisthenics','common-questions'];
assert.ok(home.includes('<a href="./about-calisthenics/" hreflang="en">About calisthenics</a>'),'footer entry point');
assert.ok(home.includes('id="pick5go-legal"'),'footer link must stay next to existing legal navigation');
assert.ok(!home.includes('id="guide-title"'),'workout homepage remains uncluttered');
assert.ok(guide.includes('<html lang="en">'),'English only for now');
assert.ok(!guide.includes('name="robots" content="noindex,follow"'),'production guide is indexable');
assert.ok(guide.includes('<link rel="canonical" href="https://pick5go.com/about-calisthenics/"/>'),'future production canonical');
assert.ok(guide.includes('<nav class="guide-contents" id="contents"'),'contents menu');
assert.equal((guide.match(/class="guide-chapter" id="/g)||[]).length,9);
assert.equal((guide.match(/class="guide-back-top" href="#contents"/g)||[]).length,9);
for(const s of sections){
 assert.ok(guide.includes('<section class="guide-chapter" id="'+s+'"'),s+' missing section');
 assert.ok(guide.includes('<a href="#'+s+'">'),s+' missing contents link');
}
assert.ok(guide.includes('href="#top"'),'page back to top');
assert.ok(guide.includes('href="../"'),'return to existing builder');
assert.ok(guide.includes('data-umami-event="guide_workout_opened"'),'guide links expose consent-gated click events');
assert.equal((guide.match(/data-umami-event="guide_workout_opened"/g)||[]).length,6,'two examples and four focused workouts');
assert.ok(guide.includes('src="../src/consent.js?build=1.3.42"'),'guide loads consent controller');
assert.ok(guide.includes('id="analytics-settings"'),'guide provides privacy settings');
for(const term of ['World Health Organization','American College of Sports Medicine','CDC','NHS']){
 assert.ok(guide.includes(term),'missing authoritative source '+term);
}
assert.ok(!/<script\s+src=/.test(guide),'readable without app JavaScript');
assert.ok(css.includes('@media(max-width:650px)'),'responsive layout');
assert.ok(css.includes('prefers-reduced-motion'),'accessible motion preferences');
assert.ok(sw.includes("pick5go-v1.3-production-4"),'new offline cache');
for(const path of ['./about-calisthenics/','./about-calisthenics/index.html','./about-calisthenics/guide.css']){
 assert.ok(sw.includes(path),'offline precache '+path);
}
// Confirm SEO improvements stay grounded in the actual workout catalogue.
assert.ok(guide.includes('<title>Calisthenics at Home: Beginner &amp; 15-Minute Workouts | Pick5Go</title>'));
assert.ok(guide.includes('name="description" content="Explore calisthenics at home'));
assert.ok(guide.includes('<h1 id="guide-title">About <em>calisthenics.</em></h1>'),'visual heading unchanged');
for(const term of ['15-minute bodyweight workout','hotel room','work out at home without equipment','beginners start and progress']){
 assert.ok(guide.toLowerCase().includes(term.toLowerCase()),'search topic missing: '+term);
}
const routines=[...guide.matchAll(/<ol class="guide-routine-list">([\s\S]*?)<\/ol>/g)];
assert.equal(routines.length,2,'one home and one hotel workout');
const readNames=(html)=>[...html.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(match=>match[1].replace(/<span>.*?<\/span>/g,'').replace(/<[^>]+>/g,'').trim());
const names=readNames(routines[0][1]);
assert.deepEqual(names,['Squats','Knee push-ups','Hip hinge','Bird dog','Standing knee raises'],'match the actual beginner full-body exercise set');
assert.deepEqual(readNames(routines[1][1]),['Slow squats','Wall push-ups','Hip hinge','Bird dog','Standing knee raises'],'quiet hotel exercises');
assert.ok(guide.includes('<b>3</b> rounds'),'15-minute routine rounds');
assert.ok(guide.includes('2 rounds · 40 seconds per exercise + 20 seconds rest'),'10-minute hotel routine');
assert.equal(5*(40+20)*3,900,'home circuit lasts 15 minutes');
assert.equal(5*(40+20)*2,600,'hotel circuit lasts 10 minutes');

console.log('OK: guide, nine chapter anchors, footer link, references, responsive design, safe preview and offline support');
