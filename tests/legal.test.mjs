import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=(path)=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const index=read('index.html');
const imprint=read('imprint.html');
const privacy=read('privacy.html');
const consent=read('src/consent.js');
const sw=read('sw.js');

assert.ok(index.includes('href="./imprint.html"'));
assert.ok(index.includes('href="./privacy.html"'));
assert.ok(index.includes('id="analytics-settings"'));
assert.ok(index.includes('src/consent.js?build=1.3.37'));
assert.ok(!index.includes('cloud.umami.is/script.js'),'Never inject Umami before opt-in');
assert.ok(consent.includes("if(read()==='yes')load()"));
assert.ok(consent.includes("save('no')"));
assert.ok(consent.includes("save('yes')"));
assert.ok(consent.includes('789229c5-0473-4aab-bdfb-cddc54b1c37d'));
assert.ok(sw.includes('src/consent.js?build=1.3.37'));
assert.ok(sw.includes('./src/legal-language.js'));
assert.ok(!index.includes('by Lorenzo D\'Angelo'));
const legalI18n=read('src/legal-language.js');
assert.ok(legalI18n.includes("['en','de','it','fr','es']"));
assert.ok(legalI18n.includes('flow5-prefs-v13-preview'));
for(const lang of ['en','de','it','fr','es']){
 for(const file of [imprint,privacy]){
  assert.ok(file.includes('<section class="lang" lang="'+lang+'">'), 'missing legal locale '+lang);
 }
}
assert.ok(consent.includes('flow5-prefs-v13-preview'));
assert.ok(consent.includes('pick5go:languagechange'));
assert.ok(index.includes('data-legal="imprint"') && index.includes('data-legal="privacy"'));
for(const file of [imprint,privacy]){
  assert.ok(file.includes('content="noindex,nofollow,nosnippet"'));
  assert.ok(!file.includes('impressum-address.png'));
  assert.ok(file.includes('Lorenzo D\'Angelo'));
  assert.ok(!file.includes('Eppelheim'), 'No address provider must remain');
  assert.ok(file.includes('Neuweg 6') && file.includes('55218 Ingelheim am Rhein'));
  assert.ok(file.includes('Deutschland') && file.includes('Germany'));
  assert.ok(!file.includes('Freilassinger') && !file.includes('81825'));
  const email=Array.from('impressum@pick5go.com').map(c=>'&#'+c.charCodeAt(0)+';').join('');
  assert.ok(file.includes('mailto:'+email));
}
assert.ok(!sw.includes('impressum-address.png'));
assert.ok(sw.includes('./imprint.html') && sw.includes('./privacy.html'));
assert.ok(privacy.includes('www.datenschutz.rlp.de') && !privacy.includes('www.lda.bayern.de'));
assert.ok(privacy.includes('GitHub Pages')&&privacy.includes('Umami Cloud'));
assert.ok(privacy.includes('six months')&&privacy.includes('sechs Monate'));
