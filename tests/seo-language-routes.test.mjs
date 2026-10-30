import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {SEO_LANGUAGES,languageForPath,languageUrl} from '../src/seo-languages.js';

const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const origin='https://pick5go.com/';
const root='https://lt-dangelo.github.io/flow5/preview/v1.3/';
const alternates=['en','de','it','fr','es','x-default'];
assert.deepEqual(SEO_LANGUAGES,['en','de','it','fr','es']);
for(const lang of SEO_LANGUAGES){
 const path=lang==='en'?'index.html':lang+'/index.html';
 const html=read(path);
 const canonical=origin+(lang==='en'?'':lang+'/');
 assert.ok(html.includes('<html lang="'+lang+'">'),path+' lang');
 assert.ok(html.includes('<link rel="canonical" href="'+canonical+'"/>'),path+' canonical');
 assert.ok(html.includes('name="robots" content="noindex,follow"'),path+' preview must not index');
 if(lang!=='en')assert.ok(html.includes('<base href="../"/>'),path+' shared asset base');
 for(const target of alternates){
  const url=origin+(target==='en'||target==='x-default'?'':target+'/');
  assert.ok(html.includes('<link rel="alternate" hreflang="'+target+'" href="'+url+'"/>'),path+' hreflang '+target);
 }
 assert.ok(html.match(/\.\/src\/app\.js\?build=1\.3\.\d+/),path+' shared workout engine');
 assert.ok(html.match(/\.\/src\/consent\.js\?build=1\.3\.\d+/),path+' analytics consent');
 assert.ok(html.match(/\.\/src\/analytics-debug\.js\?build=1\.3\.\d+/),path+' preview diagnostics');
 assert.equal(languageForPath(new URL(languageUrl(root,lang)).pathname,new URL(root).pathname),lang,lang+' preview route');
 assert.equal(languageForPath(new URL(languageUrl(origin,lang)).pathname,'/'),lang,lang+' prod route');
}
assert.equal(languageForPath('/flow5/preview/v1.3/de/index.html','/flow5/preview/v1.3/'),'de');
assert.equal(languageForPath('/flow5/preview/v1.3/','/flow5/preview/v1.3/'),'en');
assert.equal(languageForPath('/flow5/preview/v1.3/dentist/','/flow5/preview/v1.3/'),'en');
const js=read('src/app.js'),consent=read('src/consent.js'),sw=read('sw.js');
assert.ok(js.includes('window.location.assign(target)'),'language selector updates real URL');
assert.ok(js.includes('location.replace(languageUrl(appRoot.href,prefs.lang))'),'migrate saved language preference');
assert.ok(consent.includes('location.pathname.match'),'consent uses page locale');
for(const lang of ['de','it','fr','es'])assert.ok(sw.includes("'./"+lang+"/'"),lang+' offline');
console.log('OK: five distinct language URLs, self-canonicals, reciprocal hreflang, shared assets, offline and consent');
