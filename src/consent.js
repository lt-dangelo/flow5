// Optional analytics. Do not contact Umami before a visitor explicitly agrees.
// Local consent storage is used exclusively to remember this choice.
(function(){
  'use strict';
  const KEY='pick5go-analytics-consent-v1';
  const ALLOWED=['pick5go.com','www.pick5go.com'];
  const TXT={
    de:{intro:'Pick5Go verwendet auf Wunsch Umami, um Seitenaufrufe und die Nutzung der Workout-Funktionen auszuwerten. Ohne Ihre Zustimmung wird kein Analyse-Skript geladen.',accept:'Statistik erlauben',decline:'Ablehnen',settings:'Datenschutz-Einstellungen',privacy:'Datenschutzerklärung'},
    en:{intro:'If you agree, Pick5Go uses Umami to measure page visits and workout usage. No analytics script loads unless you opt in.',accept:'Allow analytics',decline:'Decline',settings:'Privacy settings',privacy:'Privacy notice'},
    it:{intro:'Con il tuo consenso, Pick5Go usa Umami per statistiche sulle visite e sugli allenamenti. Nessuno script di analisi viene caricato prima del consenso.',accept:'Consenti statistiche',decline:'Rifiuta',settings:'Preferenze privacy',privacy:'Informativa privacy'},
    fr:{intro:'Avec votre accord, Pick5Go utilise Umami pour mesurer les visites et l’utilisation des entraînements. Aucun script d’analyse sans consentement.',accept:'Autoriser',decline:'Refuser',settings:'Préférences de confidentialité',privacy:'Confidentialité'},
    es:{intro:'Con tu consentimiento, Pick5Go usa Umami para medir visitas y uso de entrenamientos. No se carga ningún script de análisis sin consentimiento.',accept:'Permitir estadísticas',decline:'Rechazar',settings:'Preferencias de privacidad',privacy:'Privacidad'}
  };
  const lang=(navigator.language||'en').toLowerCase().split('-')[0];
  const t=TXT[lang]||TXT.en;
  const read=()=>{try{return localStorage.getItem(KEY)}catch{return null}};
  const save=(v)=>{try{localStorage.setItem(KEY,v)}catch{}};
  let loaded=false;
  const load=()=>{
    if(loaded || !ALLOWED.includes(location.hostname))return;
    loaded=true;
    const s=document.createElement('script');
    s.defer=true;
    s.src='https://cloud.umami.is/script.js';
    s.dataset.websiteId='789229c5-0473-4aab-bdfb-cddc54b1c37d';
    s.dataset.domains=ALLOWED.join(',');
    s.onerror=()=>{loaded=false};
    document.head.appendChild(s);
  };
  const close=()=>document.getElementById('analytics-consent')?.remove();
  const show=()=>{
    close();
    const panel=document.createElement('section');
    panel.id='analytics-consent';
    panel.className='analytics-consent';
    panel.setAttribute('role','region');
    panel.setAttribute('aria-label',t.settings);
    const desc=document.createElement('p');
    desc.textContent=t.intro+' ';
    const privacy=document.createElement('a');
    privacy.href='./privacy.html';
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
    accept.addEventListener('click',()=>{save('yes');close();load()});
    buttons.append(decline,accept);
    panel.append(desc,buttons);
    document.body.append(panel);
  };
  document.getElementById('analytics-settings')?.addEventListener('click',show);
  if(read()==='yes')load();else if(read()!=='no')show();
})();
