// Curated gallery. One canonical catalog powers all languages and filters.
// Static HTML cards remain available before JavaScript loads.
import {WORKOUTS,WORKOUT_GROUPS,CATALOG_LANGUAGES} from './workout-catalog.js';
import {sharedWorkoutUrl} from './share.js';
import {languageUrl} from './seo-languages.js';
const root=new URL('./',document.baseURI);
const choices={
 en:{title:'Find your workout',intro:'Ready-to-use bodyweight workouts for different goals and experience levels. Open one, change anything you like and go.',back:'Back to builder',focus:'Focus',level:'Level',language:'Language',all:'All',full:'Full body',core:'Core & stability',upper:'Upper body & core',legs:'Legs & glutes',beginner:'Beginner',intermediate:'Intermediate',start:'Open workout',minute:'min',note:'These are general examples, not personalized medical or training plans. Select an exercise level you can perform with controlled technique. Without suitable equipment, resisted pulling work is limited.',footer:'Free · no signup · preferences stay on your device.',empty:'No workouts match both filters.'},
 de:{title:'Finde dein Training',intro:'Fertige Bodyweight-Trainings für verschiedene Ziele und Erfahrungsstufen. Öffne einen Vorschlag, passe ihn an und starte.',back:'Zum Trainingsplaner',focus:'Schwerpunkt',level:'Niveau',language:'Sprache',all:'Alle',full:'Ganzkörper',core:'Core & Stabilität',upper:'Oberkörper & Core',legs:'Beine & Po',beginner:'Einsteiger',intermediate:'Mittelstufe',start:'Training öffnen',minute:'Min.',note:'Allgemeine Trainingsbeispiele, keine personalisierten medizinischen oder sportlichen Pläne. Wähle eine Belastung, bei der du kontrolliert trainierst. Ohne geeignete Ausrüstung sind Zugübungen mit Widerstand eingeschränkt.',footer:'Kostenlos · ohne Anmeldung · Einstellungen bleiben auf deinem Gerät.',empty:'Keine Trainings für beide Filter gefunden.'},
 it:{title:'Trova il tuo allenamento',intro:'Allenamenti a corpo libero pronti per obiettivi e livelli diversi. Aprine uno, personalizzalo e inizia.',back:'Torna al generatore',focus:'Obiettivo',level:'Livello',language:'Lingua',all:'Tutti',full:'Corpo intero',core:'Core e stabilità',upper:'Parte superiore e core',legs:'Gambe e glutei',beginner:'Principiante',intermediate:'Intermedio',start:'Apri allenamento',minute:'min',note:'Questi sono esempi generali, non programmi medici o personalizzati. Scegli esercizi che puoi eseguire con controllo. Senza attrezzatura adatta la resistenza di trazione è limitata.',footer:'Gratis · senza account · preferenze salvate sul dispositivo.',empty:'Nessun allenamento per questi filtri.'},
 fr:{title:'Trouvez votre séance',intro:'Des séances au poids du corps prêtes à démarrer, selon vos objectifs et votre niveau. Ouvrez, adaptez et entraînez-vous.',back:'Retour au créateur',focus:'Objectif',level:'Niveau',language:'Langue',all:'Tous',full:'Corps entier',core:'Gainage et stabilité',upper:'Haut du corps et gainage',legs:'Jambes et fessiers',beginner:'Débutant',intermediate:'Intermédiaire',start:'Ouvrir la séance',minute:'min',note:'Ces exemples ne sont ni des prescriptions médicales ni des programmes personnalisés. Choisissez des mouvements maîtrisés. Sans équipement adapté, les tirages avec résistance restent limités.',footer:'Gratuit · sans compte · préférences locales.',empty:'Aucune séance pour ces filtres.'},
 es:{title:'Encuentra tu entrenamiento',intro:'Rutinas de peso corporal listas para diferentes objetivos y niveles. Abre una, personalízala y empieza.',back:'Volver al generador',focus:'Objetivo',level:'Nivel',language:'Idioma',all:'Todos',full:'Cuerpo completo',core:'Core y estabilidad',upper:'Tren superior y core',legs:'Piernas y glúteos',beginner:'Principiante',intermediate:'Intermedio',start:'Abrir entrenamiento',minute:'min',note:'Estos ejemplos no son programas médicos ni planes personalizados. Elige variantes que puedas realizar con control. Sin equipo adecuado, los ejercicios de tracción con resistencia son limitados.',footer:'Gratis · sin registro · preferencias en el dispositivo.',empty:'No hay rutinas para ambos filtros.'}
};

const params=new URLSearchParams(location.search);
let lang=CATALOG_LANGUAGES.includes(params.get('lang'))?params.get('lang'):'en';
let focus='all',level='all';
const el=id=>document.getElementById(id);
const rootLink=l=>languageUrl(root.href,l);
function fillSelect(select,keys,value){
 const t=choices[lang];
 select.innerHTML=keys.map(k=>'<option value="'+k+'">'+(t[k]||k)+'</option>').join('');
 select.value=value;
}
function renderCard(r,t,idx){
 const plan={presetId:r.focus,difficulty:r.level,ids:r.ids,workSec:r.workSec,restSec:r.restSec,rounds:r.rounds};
 const href=sharedWorkoutUrl(root.href,lang,plan);
 const mins=Math.round(r.ids.length*r.rounds*(r.workSec+r.restSec)/60);
 const count=r.ids.length;
 return '<article class="gallery-card"><span class="meta">'+t[r.focus]+' · '+t[r.level]+' · '+count+' '+(lang==='de'?'Übungen':lang==='it'?'esercizi':lang==='fr'?'exercices':lang==='es'?'ejercicios':'exercises')+' · '+mins+' '+t.minute+'</span><h3>'+r.title[idx]+'</h3><p>'+r.description[idx]+'</p><a href="'+href+'">'+t.start+' →</a></article>';
}
function render(){
 const t=choices[lang],idx=CATALOG_LANGUAGES.indexOf(lang);
 document.documentElement.lang=lang;
 document.title=t.title+' | Pick5Go';
 el('gallery-title').textContent=t.title;el('gallery-description').textContent=t.intro;
 el('gallery-back').textContent='← '+t.back;el('gallery-back').href=rootLink(lang);
 el('gallery-footer-link').href=rootLink(lang);
 el('goal-label').textContent=t.focus;el('level-label').textContent=t.level;el('lang-label').textContent=t.language;
 el('gallery-note').textContent=t.note;el('gallery-footer-note').textContent=t.footer;
 fillSelect(el('gallery-goal'),['all','full','core','upper','legs'],focus);
 fillSelect(el('gallery-level'),['all','beginner','intermediate'],level);
 el('gallery-lang').innerHTML=CATALOG_LANGUAGES.map((code,i)=>'<option value="'+code+'">'+['English','Deutsch','Italiano','Français','Español'][i]+'</option>').join('');
 el('gallery-lang').value=lang;
 const filtered=WORKOUTS.filter(r=>(focus==='all'||r.focus===focus)&&(level==='all'||r.level===level));
 el('gallery-list').innerHTML=Object.entries(WORKOUT_GROUPS).map(([group,labels])=>{
  const within=filtered.filter(r=>r.category===group);
  if(!within.length)return '';
  return '<section class="gallery-group" aria-labelledby="gallery-group-'+group+'"><h2 id="gallery-group-'+group+'">'+labels[idx]+'</h2><div class="gallery-grid">'+within.map(r=>renderCard(r,t,idx)).join('')+'</div></section>';
 }).join('')||'<p class="gallery-empty">'+t.empty+'</p>';
}
el('gallery-goal').addEventListener('change',e=>{focus=e.target.value;render();});
el('gallery-level').addEventListener('change',e=>{level=e.target.value;render();});
el('gallery-lang').addEventListener('change',e=>{
 lang=e.target.value;
 const url=new URL(location.href);url.searchParams.set('lang',lang);history.replaceState(null,'',url.href);render();
});
render();
