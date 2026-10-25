// Localized legal notices share Pick5Go's saved language, with manual override.
// A full-language fallback remains available when scripts are disabled.
(function(){
 'use strict';
 const LANG=['en','de','it','fr','es'];
 const names={en:'English',de:'Deutsch',it:'Italiano',fr:'Français',es:'Español'};
 const LABELS={
  en:{imprint:'Legal notice',privacy:'Privacy notice',back:'Back to Pick5Go',language:'Language'},
  de:{imprint:'Impressum',privacy:'Datenschutzerklärung',back:'Zurück zu Pick5Go',language:'Sprache'},
  it:{imprint:'Note legali',privacy:'Informativa sulla privacy',back:'Torna a Pick5Go',language:'Lingua'},
  fr:{imprint:'Mentions légales',privacy:'Politique de confidentialité',back:'Retour à Pick5Go',language:'Langue'},
  es:{imprint:'Aviso legal',privacy:'Política de privacidad',back:'Volver a Pick5Go',language:'Idioma'}
 };
 const saved=()=>{
  for(const key of ['flow5-prefs-v13-preview','pick5go-prefs-v13']){
   try{const raw=localStorage.getItem(key);if(raw){const l=JSON.parse(raw)?.lang;if(LANG.includes(l))return l;}}catch{}
  }
  return 'en';
 };
 const params=new URLSearchParams(location.search);
 let lang=LANG.includes(params.get('lang'))?params.get('lang'):saved();
 const isPrivacy=location.pathname.endsWith('/privacy.html');
 const select=document.getElementById('legal-language');
 if(!select)return;
 select.innerHTML=LANG.map(code=>'<option value="'+code+'">'+names[code]+'</option>').join('');
 function render(){
  document.documentElement.lang=lang;
  document.querySelectorAll('section.lang[lang]').forEach(el=>{el.hidden=el.lang!==lang;});
  select.value=lang;
  const labels=LABELS[lang];
  const headline=document.querySelector('main header h1');
  if(headline)headline.textContent=isPrivacy?labels.privacy:labels.imprint;
  const switchLabel=document.getElementById('legal-language-label');
  if(switchLabel)switchLabel.textContent=labels.language;
  document.querySelectorAll('[data-legal-back]').forEach(a=>a.textContent='← '+labels.back);
  document.querySelectorAll('[data-legal-imprint]').forEach(a=>{
   a.textContent=labels.imprint;
   a.href='./imprint.html?lang='+lang;
  });
  document.querySelectorAll('[data-legal-privacy]').forEach(a=>{
   a.textContent=labels.privacy;
   a.href='./privacy.html?lang='+lang;
  });
  const url=new URL(location.href);url.searchParams.set('lang',lang);
  history.replaceState(null,'',url.pathname+url.search+url.hash);
 }
 select.addEventListener('change',()=>{if(LANG.includes(select.value)){lang=select.value;render();}});
 render();
})();
