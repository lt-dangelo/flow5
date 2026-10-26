import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../src/consent.js',import.meta.url),'utf8');
function simulate(choice,lang='de'){
 const imprint={href:'',textContent:''},privacy={href:'',textContent:''},settings={textContent:'',addEventListener(){}},scripts=[];
 const document={
  documentElement:{lang:'en'},head:{appendChild(s){scripts.push(s)}},
  body:{append(){}},
  querySelector(selector){return selector.includes('[data-legal="imprint"]')?imprint:selector.includes('[data-legal="privacy"]')?privacy:null;},
  getElementById(id){return id==='analytics-settings'?settings:null;},
  createElement(){return {dataset:{},setAttribute(){},append(){},addEventListener(){}}}
 };
 const storage={getItem(k){return k==='pick5go-analytics-consent-v1'?choice:k==='flow5-prefs-v13-preview'?JSON.stringify({lang}):null;},setItem(){}};
 const location={pathname:'/flow5/preview/v1.3/about-calisthenics/',hostname:'lt-dangelo.github.io'};
 const window={location,addEventListener(){},dispatchEvent(){}};
 vm.runInNewContext(source,{document,localStorage:storage,window,location,Event:class{}});
 return {imprint,privacy,settings,scripts};
}
const accepted=simulate('yes');
assert.equal(accepted.scripts.length,1);
assert.equal(accepted.scripts[0].src,'https://cloud.umami.is/script.js');
assert.equal(accepted.scripts[0].dataset.websiteId,'789229c5-0473-4aab-bdfb-cddc54b1c37d');
assert.equal(accepted.imprint.href,'../imprint.html?lang=en');
assert.equal(accepted.privacy.href,'../privacy.html?lang=en');
assert.equal(accepted.settings.textContent,'Privacy settings');
const denied=simulate('no');
assert.equal(denied.scripts.length,0,'no Umami script before consent');
assert.equal(denied.privacy.href,'../privacy.html?lang=en');
console.log('OK: guide Umami requires consent, shares existing opt-in and uses correct English legal URLs');
