import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=(path)=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const index=read('index.html');
const imprint=read('imprint.html');
const privacy=read('privacy.html');
const consent=read('src/consent.js');
const sw=read('sw.js');
const image=readFileSync(new URL('../assets/impressum-address.png',import.meta.url));

assert.ok(index.includes('href="./imprint.html"'));
assert.ok(index.includes('href="./privacy.html"'));
assert.ok(index.includes('id="analytics-settings"'));
assert.ok(index.includes('src/consent.js?build=1.3.36'));
assert.ok(!index.includes('cloud.umami.is/script.js'),'Never inject Umami before opt-in');
assert.ok(consent.includes("if(read()==='yes')load()"));
assert.ok(consent.includes("save('no')"));
assert.ok(consent.includes("save('yes')"));
assert.ok(consent.includes('789229c5-0473-4aab-bdfb-cddc54b1c37d'));
assert.ok(sw.includes('src/consent.js?build=1.3.36'));
for(const file of [imprint,privacy]){
  assert.ok(file.includes('content="noindex,nofollow,nosnippet,noimageindex"'));
  assert.ok(file.includes('src="./assets/impressum-address.png"'));
  assert.ok(file.includes('Lorenzo D\'Angelo'));
  assert.ok(!file.includes('Eppelheim'), 'No address provider must remain');
  // Check the exact address remains an image, not a scrapeable HTML string.
  assert.ok(!file.includes('Freilassinger')&&!file.includes('81825'));
  const email=Array.from('impressum@pick5go.com').map(c=>'&#'+c.charCodeAt(0)+';').join('');
  assert.ok(file.includes('mailto:'+email));
}
assert.deepEqual([...image.subarray(0,8)],[137,80,78,71,13,10,26,10], 'Must be a real PNG, not text or a placeholder');
assert.equal(image.readUInt32BE(16),960);
assert.equal(image.readUInt32BE(20),238);
assert.ok(sw.includes('./assets/impressum-address.png')&&sw.includes('./imprint.html')&&sw.includes('./privacy.html'));
assert.ok(privacy.includes('GitHub Pages')&&privacy.includes('Umami Cloud'));
assert.ok(privacy.includes('six months')&&privacy.includes('sechs Monate'));
