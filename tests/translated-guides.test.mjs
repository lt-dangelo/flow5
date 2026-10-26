import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {decodeSharedWorkout} from '../src/share.js';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const langs=['en','de','it','fr','es'];
const sections=['what-is-calisthenics','little-time','travelling','no-equipment','getting-started','before-after','workout-goals','beyond-calisthenics','common-questions'];
const expected=new Set(['fullbody-15','hotel-10','full-beginner','core-beginner','upper-beginner','legs-beginner']);
const origin='https://pick5go.com/';
const preview='https://pick5go.com/';
const english=read('about-calisthenics/index.html');
const sw=read('sw.js');
const topic={de:['Krafttraining','ohne Geräte'],it:['corpo libero','senza attrezzi'],fr:['poids du corps','sans matériel'],es:['calistenia','sin material']};
assert.ok(sw.includes("pick5go-v1.3-production-4"));
for(const lang of langs){
 const guidePath=(lang==='en'?'':lang+'/')+'about-calisthenics/index.html';
 const homePath=(lang==='en'?'':lang+'/')+'index.html';
 const html=read(guidePath),home=read(homePath);
 const publicGuide=origin+(lang==='en'?'':lang+'/')+'about-calisthenics/';
 const previewGuide=new URL((lang==='en'?'':lang+'/')+'about-calisthenics/',preview);
 assert.ok(html.includes('<html lang="'+lang+'">'),lang+' html lang');
 assert.ok(html.includes('<link rel="canonical" href="'+publicGuide+'"/>'),lang+' self canonical');
 assert.ok(!html.includes('name="robots" content="noindex,follow"'),lang+' production must index');
 assert.ok(html.includes('guide-languages'),lang+' language switch');
 const expectedCss=lang==='en'?'./guide.css':'../../about-calisthenics/guide.css';
 const expectedConsent=lang==='en'?'../src/consent.js?build=1.3.42':'../../src/consent.js?build=1.3.42';
 assert.ok(html.includes('href="'+expectedCss+'"'),lang+' stylesheet');
 assert.ok(html.includes('src="'+expectedConsent+'"'),lang+' consent source');
 assert.ok(html.includes('id="analytics-settings"'),lang+' opt-in settings');
 assert.ok(html.includes('data-umami-event="guide_workout_opened"'),lang+' consent-gated event');
 assert.equal((html.match(/class="guide-chapter" id="/g)||[]).length,9,lang+' chapter count');
 assert.equal((html.match(/class="guide-back-top" href="#contents"/g)||[]).length,9,lang+' return links');
 for(const section of sections){
  assert.ok(html.includes('class="guide-chapter" id="'+section+'"'),lang+' chapter '+section);
  assert.ok(html.includes('href="#'+section+'"'),lang+' table of contents '+section);
 }
 for(const alt of ['en','de','it','fr','es','x-default']){
  const altHref=origin+(alt==='en'||alt==='x-default'?'':alt+'/')+'about-calisthenics/';
  assert.ok(html.includes('rel="alternate" hreflang="'+alt+'" href="'+altHref+'"'),lang+' hreflang '+alt);
 }
 const switchLinks=[...html.matchAll(/<nav class="guide-languages"[^>]*>([\s\S]*?)<\/nav>/g)].flatMap(m=>[...m[1].matchAll(/<a href="([^"]+)"[^>]*>([A-Z]{2})<\/a>/g)].map(x=>[x[1],x[2].toLowerCase()]));
 assert.equal(switchLinks.length,5,lang+' 5 language navigation items');
 for(const [href,target] of switchLinks)assert.equal(new URL(href,previewGuide).pathname,new URL((target==='en'?'':target+'/')+'about-calisthenics/',preview).pathname,lang+' language nav '+target);
 const ctas=[...html.matchAll(/href="([^"]*\?w=[^"]+)"[^>]*data-umami-event="guide_workout_opened"[^>]*data-umami-event-workout="([^"]+)"/g)];
 assert.equal(ctas.length,6,lang+' six workouts');
 assert.deepEqual(new Set(ctas.map(x=>x[2])),expected,lang+' same six sets');
 for(const [,href,key] of ctas){
  const url=new URL(href,previewGuide);
  assert.equal(url.pathname,new URL(lang==='en'?'./':lang+'/',preview).pathname,lang+' builder target '+key);
  const plan=decodeSharedWorkout(url.search);
  assert.ok(plan,lang+' workout can load '+key);
  assert.ok([2,3].includes(plan.rounds));
 }
 assert.equal((html.match(/<li id="source-/g)||[]).length,6,lang+' preserved references');
 if(lang==='en')assert.ok(home.includes('href="./about-calisthenics/"'),'English homepage link');
 else {
  assert.ok(home.includes('href="./'+lang+'/about-calisthenics/"'),lang+' homepage link');
  for(const word of topic[lang])assert.ok(html.toLowerCase().includes(word.toLowerCase()),lang+' local keyword '+word);
 }
 const expectedApp=lang==='en'?'../':'../';
 assert.ok(html.includes('href="'+expectedApp+'"'),lang+' links back to builder');
 assert.ok(sw.includes("'./"+(lang==='en'?'':lang+'/')+"about-calisthenics/index.html'"),lang+' offline cache');
}
console.log('OK: 5 fully translated static guides, reciprocal hreflang, local keywords, six workouts, footer links and offline assets');
