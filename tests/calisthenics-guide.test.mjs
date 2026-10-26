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
assert.ok(guide.includes('name="robots" content="noindex,follow"'),'preview not indexable');
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
assert.ok(!guide.includes('data-action="preset"')&&!guide.includes('?workout=')&&!guide.includes('?preset='),'no preconfigured workout links');
for(const term of ['World Health Organization','American College of Sports Medicine','CDC','NHS']){
 assert.ok(guide.includes(term),'missing authoritative source '+term);
}
assert.ok(!/<script\s+src=/.test(guide),'readable without app JavaScript');
assert.ok(css.includes('@media(max-width:650px)'),'responsive layout');
assert.ok(css.includes('prefers-reduced-motion'),'accessible motion preferences');
assert.ok(sw.includes("pick5go-v1.3-preview-45"),'new offline cache');
for(const path of ['./about-calisthenics/','./about-calisthenics/index.html','./about-calisthenics/guide.css']){
 assert.ok(sw.includes(path),'offline precache '+path);
}
console.log('OK: guide, nine chapter anchors, footer link, references, responsive design, safe preview and offline support');
