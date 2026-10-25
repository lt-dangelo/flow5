import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=(path)=>readFileSync(new URL('../'+path,import.meta.url),'utf8');

const index=read('index.html');
const consent=read('src/consent.js');
const privacy=read('privacy.html');
const imprint=read('imprint.html');
const sw=read('sw.js');

assert.ok(index.includes('href="./imprint.html"'));
assert.ok(index.includes('href="./privacy.html"'));
assert.ok(index.includes('id="analytics-settings"'));
assert.ok(index.includes('src/consent.js'));
assert.ok(!index.includes('https://cloud.umami.is/script.js'), 'Tracker must not load before consent');
assert.ok(consent.includes("if(read()==='yes')load()"));
assert.ok(consent.includes("save('no')"));
assert.ok(consent.includes("save('yes')"));
assert.ok(sw.includes('./privacy.html') && sw.includes('./imprint.html'));
assert.ok(privacy.includes('GitHub Pages') && privacy.includes('Umami Cloud'));
assert.ok(privacy.includes('sechs Monate') && privacy.includes('six months'));
assert.ok(imprint.includes('noindex,nosnippet') && privacy.includes('noindex,nosnippet'));
assert.ok(imprint.includes('https://impressum-ohne-adresse.de/'), 'Free provider requires an imprint backlink');
assert.ok(imprint.includes('69214 Eppelheim') && privacy.includes('69214 Eppelheim'));
// The contact email is HTML-entity encoded to deter trivial address harvesters, not to conceal it from users.
const encodedEmail=Array.from('impressum@pick5go.com').map(char=>'&#'+char.charCodeAt(0)+';').join('');
assert.ok(imprint.includes('mailto:'+encodedEmail) && privacy.includes('mailto:'+encodedEmail));
assert.ok(imprint.includes('§ 18 Abs. 1 MStV'));

// Intentionally block a production release until the serviceable address,
// direct contact email, have been reviewed and filled.
// Do not remove this test simply to get a green build.
const missing=/\[(?:BESTÄTIGTE ZUORDNUNG|CONFIRMED CUSTOMER IDENTIFIER|STRAẞE|POSTLEITZAHL|KONTAKT-EMAIL|STREET|POSTCODE|CONTACT-EMAIL|VOLLSTÄNDIGE|FULL SERVICEABLE|TARIF UND|CONFIRM PLAN)/;
assert.doesNotMatch(imprint+privacy,missing,
 'Confirm the address-service contract and replace the assigned c/o identifier before publication.');
