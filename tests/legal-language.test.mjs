import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const source=(p)=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
function element(){
 const handlers={};
 return {handlers,children:[],textContent:'',href:'',setAttribute(){},
  addEventListener(name,fn){handlers[name]=fn},
  append(...nodes){this.children.push(...nodes)},
  remove(){this.removed=true}
 };
}
function storage(lang,value='no'){
 const map=new Map([['flow5-prefs-v13-preview',JSON.stringify({lang})]]);
 if(value!==null)map.set('pick5go-analytics-consent-v1',value);
 return {map,getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v)};
}
// Simulate a German-language browser with an Italian app preference.
{
 const prefs=storage('it');
 const imprint=element(),privacy=element(),settings=element(),head=element();
 const listeners={},document={
  documentElement:{lang:'en'},head,body:element(),
  querySelector:s=>s.includes('imprint')?imprint:s.includes('privacy')?privacy:null,
  getElementById:id=>id==='analytics-settings'?settings:null,
  createElement:()=>element()
 };
 const window={location:{pathname:'/preview/v1.3/',hostname:'pick5go.com'},addEventListener:(n,fn)=>{listeners[n]=fn}};
 vm.runInNewContext(source('src/consent.js'),{window,document,localStorage:prefs,location:window.location});
 assert.equal(imprint.textContent,'Note legali');
 assert.equal(privacy.href,'./privacy.html?lang=it');
 assert.equal(settings.textContent,'Preferenze privacy');
 assert.equal(head.children.length,0,'tracker must not load after refusal');
 prefs.setItem('flow5-prefs-v13-preview',JSON.stringify({lang:'fr'}));
 listeners['pick5go:languagechange']();
 assert.equal(imprint.textContent,'Mentions légales');
 assert.equal(settings.textContent,'Préférences de confidentialité');
 assert.equal(privacy.href,'./privacy.html?lang=fr');
}
// The legal notice must load the requested translation, and switching language
// on that page must update content, links, and the URL without modifying app prefs.
{
 const languages=['en','de','it','fr','es'];
 const sections=languages.map(lang=>({lang,hidden:false}));
 const select=element(),title=element(),label=element(),back=element(),imprint=element(),privacy=element();
 const listeners={};
 const document={
  documentElement:{lang:'de'},
  getElementById:id=>id==='legal-language'?select:id==='legal-language-label'?label:null,
  querySelector:s=>s==='main header h1'?title:null,
  querySelectorAll:s=>s==='section.lang[lang]'?sections:
    s==='[data-legal-back]'?[back]:
    s==='[data-legal-imprint]'?[imprint]:
    s==='[data-legal-privacy]'?[privacy]:[]
 };
 const location={pathname:'/preview/v1.3/privacy.html',search:'?lang=es',href:'https://pick5go.com/preview/v1.3/privacy.html?lang=es'};
 const history={replaceState(_a,_b,url){this.url=url}};
 vm.runInNewContext(source('src/legal-language.js'),{document,location,history,URL,URLSearchParams,localStorage:storage('it')});
 assert.equal(select.value,'es');
 assert.equal(title.textContent,'Política de privacidad');
 assert.equal(sections.filter(s=>!s.hidden).length,1);
 assert.equal(sections.find(s=>!s.hidden).lang,'es');
 assert.equal(imprint.href,'./imprint.html?lang=es');
 select.value='fr';select.handlers.change();
 assert.equal(title.textContent,'Politique de confidentialité');
 assert.equal(sections.find(s=>!s.hidden).lang,'fr');
 assert.equal(privacy.href,'./privacy.html?lang=fr');
 assert.ok(history.url.includes('lang=fr'));
}
console.log('OK: opt-out and legal notice follow the chosen app language; live switching works');
