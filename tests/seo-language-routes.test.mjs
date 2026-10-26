import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {SEO_LANGUAGES,languageForPath,languageUrl} from '../src/seo-languages.js';

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const origin='https://pick5go.com/';
const root='https://lt-dangelo.github.io/flow5/';
const alternates=['en','de','it','fr','es','x-default'];
const sitemap=read('sitemap.xml');
assert.deepEqual(SEO_LANGUAGES,['en','de','it','fr','es']);
const foundUrls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match=>match[1]);
assert.deepEqual(foundUrls,SEO_LANGUAGES.map(l=>origin+(l==='en'?'':l+'/')));
for(const lang of SEO_LANGUAGES){
 const path=lang==='en'?'index.html':lang+'/index.html';
 const html=read(path);
 const canonical=origin+(lang==='en'?'':lang+'/');
 assert.ok(html.includes('<html lang="'+lang+'">'),path+' page language');
 assert.ok(html.includes('<link rel="canonical" href="'+canonical+'"/>'),path+' self canonical');
 assert.ok(!html.includes('name="robots" content="noindex'),'production language must be indexable');
 if(lang!=='en')assert.ok(html.includes('<base href="../"/>'),path+' shared asset base');
 for(const alternate of alternates){
  const url=origin+(alternate==='en'||alternate==='x-default'?'':alternate+'/');
  assert.ok(html.includes('<link rel="alternate" hreflang="'+alternate+'" href="'+url+'"/>'),path+' reciprocal hreflang '+alternate);
 }
 assert.ok(html.includes('./src/app.js?build=1.3.42'),path+' same production workout engine');
 assert.ok(html.includes('./src/consent.js?build=1.3.42'),path+' same consent setup');
 assert.ok(!html.includes('analytics-debug.js'),path+' production must not include preview debug');
 const json=html.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/);
 assert.ok(json,path+' missing structured data');
 const schema=JSON.parse(json[1]);
 assert.equal(schema['@type'],'WebApplication');
 assert.equal(schema['@context'],'https://schema.org');
 assert.equal(schema.name,'Pick5Go');
 assert.equal(schema.url,canonical);
 assert.equal(schema.inLanguage,lang);
 assert.equal(schema.applicationCategory,'HealthApplication');
 assert.equal(schema.isAccessibleForFree,true);
 assert.equal(schema.offers.price,0);
 assert.ok(!('review' in schema)&&!('aggregateRating' in schema),'no invented reviews');
 assert.equal(languageForPath(new URL(languageUrl(origin,lang)).pathname,'/'),lang,lang+' production path');
 assert.equal(languageForPath(new URL(languageUrl(root,lang)).pathname,'/flow5/'),lang,lang+' GitHub Pages path');
}
assert.equal(languageForPath('/de/index.html','/'),'de');
assert.equal(languageForPath('/flow5/preview/v1.3/de/','/flow5/'),'en','separate preview routes are not production locales');
const js=read('src/app.js'),consent=read('src/consent.js'),sw=read('sw.js');
assert.ok(js.includes("const STORAGE_KEY='pick5go-prefs-v13'"),'preserve installed production preferences');
assert.ok(js.includes('window.location.assign(target)'),'selector changes locale URL');
assert.ok(js.includes('location.replace(languageUrl(appRoot.href,prefs.lang))'),'existing visitor language persisted');
assert.ok(consent.includes('location.pathname.match'),'consent uses URL locale');
assert.ok(sw.includes("pick5go-v1.3-production-3"),'cache update');
assert.ok(sw.includes("url.pathname.startsWith(root+'preview/')"),'root service worker excludes preview');
for(const lang of ['de','it','fr','es'])assert.ok(sw.includes("'./"+lang+"/'"),'offline page '+lang);
assert.ok(sw.includes('./src/seo-languages.js'),'locale router offline');
console.log('OK: 5 indexable locale URLs, canonical and hreflang, WebApplication JSON-LD, sitemap, consent and offline assets');
