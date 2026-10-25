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
assert.ok(imprint.includes('§ 18 Abs. 1 MStV'));

// Intentionally block a production release until the serviceable address,
// direct contact email, and data-retention period have been reviewed and filled.
// Do not remove this test simply to get a green build.
const missing=/\[(?:STRAẞE|POSTLEITZAHL|KONTAKT-EMAIL|STREET|POSTCODE|CONTACT-EMAIL|VOLLSTÄNDIGE|FULL SERVICEABLE|TARIF UND|CONFIRM PLAN)/;
assert.doesNotMatch(imprint+privacy,missing,
 'Complete real legal contact details and Umami retention before publishing.');
