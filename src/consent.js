// Optional analytics. Do not contact Umami before a visitor explicitly agrees.
// Local consent storage is used exclusively to remember this choice.
(function(){
  'use strict';
  const KEY='pick5go-analytics-consent-v1';
  const ALLOWED=['pick5go.com','www.pick5go.com'];
  const allowedHere=()=>ALLOWED.includes(location.hostname) ||
    (location.hostname==='lt-dangelo.github.io' && /^\/flow5\/preview\/v1\.3\//.test(location.pathname));
  const HOSTS=[...ALLOWED,'lt-dangelo.github.io'];
  const TXT={
    de:{intro:'Pick5Go verwendet auf Wunsch Umami, um Seitenaufrufe und die Nutzung der Workout-Funktionen auszuwerten. Ohne Ihre Zustimmung wird kein Analyse-Skript geladen.',accept:'Statistik erlauben',decline:'Ablehnen',settings:'Datenschutz-Einstellungen',privacy:'Datenschutzerklärung',imprint:'Impressum'},
    en:{intro:'If you agree, Pick5Go uses Umami to measure page visits and workout usage. No analytics script loads unless you opt in.',accept:'Allow analytics',decline:'Decline',settings:'Privacy settings',privacy:'Privacy notice',imprint:'Legal notice'},
    it:{intro:'Con il tuo consenso, Pick5Go usa Umami per statistiche sulle visite e sugli allenamenti. Nessuno script di analisi viene caricato prima del consenso.',accept:'Consenti statistiche',decline:'Rifiuta',settings:'Preferenze privacy',privacy:'Informativa sulla privacy',imprint:'Note legali'},
    fr:{intro:'Avec votre accord, Pick5Go utilise Umami pour mesurer les visites et l’utilisation des entraînements. Aucun script d’analyse sans consentement.',accept:'Autoriser',decline:'Refuser',settings:'Préférences de confidentialité',privacy:'Politique de confidentialité',imprint:'Mentions légales'},
    es:{intro:'Con tu consentimiento, Pick5Go usa Umami para medir visitas y uso de entrenamientos. No se carga ningún script de análisis sin consentimiento.',accept:'Permitir estadísticas',decline:'Rechazar',settings:'Preferencias de privacidad',privacy:'Política de privacidad',imprint:'Aviso legal'}
  };
  // Guide pages have their own explicit language routes, independent of saved app preferences.
  const onGuide=()=>/\/about-calisthenics\/(?:index\.html)?$/.test(location.pathname);
  const guideLang=()=>location.pathname.match(/\/(de|it|fr|es)\/about-calisthenics\/(?:index\.html)?$/)?.[1]||'en';
  const legalRoot=()=>onGuide()?(guideLang()==='en'?'../':'../../'):'./';
  const currentLang=()=>{
    if(onGuide())return guideLang();
    // Language URLs take precedence over saved settings when opening a translated page.
    const route=location.pathname.match(/\/(de|it|fr|es)\/(?:index\.html)?$/);
    if(route)return route[1];
    for(const key of ['flow5-prefs-v13-preview','pick5go-prefs-v13']){
      try{
        const value=localStorage.getItem(key);
        if(value){const lang=JSON.parse(value)?.lang;if(Object.hasOwn(TXT,lang))return lang;}
      }catch{/* Storage may be disabled */}
    }
    return Object.hasOwn(TXT,document.documentElement.lang)?document.documentElement.lang:'en';
  };
  const translations=()=>TXT[currentLang()];
  const updateLegalNav=()=>{
    const t=translations(),lang=currentLang();
    const imprint=document.querySelector('#pick5go-legal [data-legal="imprint"]');
    const privacy=document.querySelector('#pick5go-legal [data-legal="privacy"]');
    const settings=document.getElementById('analytics-settings');
    if(imprint){imprint.textContent=t.imprint;imprint.href=legalRoot()+'imprint.html?lang='+lang;}
    if(privacy){privacy.textContent=t.privacy;privacy.href=legalRoot()+'privacy.html?lang='+lang;}
    if(settings)settings.textContent=t.settings;
  };
  const read=()=>{try{return localStorage.getItem(KEY)}catch{return null}};
  const save=(v)=>{try{localStorage.setItem(KEY,v)}catch{}};
  let loaded=false;
  const load=()=>{
    if(loaded || !allowedHere())return;
    loaded=true;
    const s=document.createElement('script');
    s.defer=true;
    s.src='https://cloud.umami.is/script.js';
    s.dataset.websiteId='789229c5-0473-4aab-bdfb-cddc54b1c37d';
    s.dataset.domains=HOSTS.join(',');
    s.onload=()=>{
      s.dataset.pick5goState='loaded';
      window.dispatchEvent(new Event('pick5go:analyticsready'));
    };
    s.onerror=()=>{
      loaded=false;
      s.dataset.pick5goState='error';
      window.dispatchEvent(new Event('pick5go:analyticsunavailable'));
    };
    s.dataset.pick5goState='pending';
    document.head.appendChild(s);
    window.dispatchEvent(new Event('pick5go:analyticsloading'));
  };
  const close=()=>document.getElementById('analytics-consent')?.remove();
  const show=()=>{
    close();
    const t=translations();
    const panel=document.createElement('section');
    panel.id='analytics-consent';
    panel.className='analytics-consent';
    panel.setAttribute('role','region');
    panel.setAttribute('aria-label',t.settings);
    const desc=document.createElement('p');
    desc.textContent=t.intro+' ';
    const privacy=document.createElement('a');
    privacy.href=legalRoot()+'privacy.html?lang='+currentLang();
    privacy.textContent=t.privacy;
    desc.append(privacy);
    const buttons=document.createElement('div');
    buttons.className='analytics-consent-actions';
    const decline=document.createElement('button');
    decline.type='button';decline.textContent=t.decline;
    const accept=document.createElement('button');
    accept.type='button';accept.textContent=t.accept;
    decline.addEventListener('click',()=>{
      save('no');close();
      // If tracking was already active, unload the tracker immediately by reloading.
      if(loaded)location.reload();
    });
    accept.addEventListener('click',()=>{save('yes');close();window.dispatchEvent(new Event('pick5go:consentchange'));load()});
    buttons.append(decline,accept);
    panel.append(desc,buttons);
    document.body.append(panel);
  };
  document.getElementById('analytics-settings')?.addEventListener('click',show);
  window.addEventListener('pick5go:languagechange',()=>{
    updateLegalNav();
    if(document.getElementById('analytics-consent'))show();
  });
  updateLegalNav();
  if(read()==='yes')load();else if(read()!=='no')show();
})();
