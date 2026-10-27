// Curated starting points, not adaptive programs. All links use the existing share codec.
import {sharedWorkoutUrl} from './share.js';
import {languageUrl} from './seo-languages.js';
const root=new URL('./',document.baseURI);
const choices={
 en:{title:'Find your workout',intro:'Ready-to-use bodyweight workouts for different goals and experience levels. Open one, change anything you like and go.',back:'Back to builder',focus:'Focus',level:'Level',language:'Language',all:'All',full:'Full body',core:'Core & stability',upper:'Upper body',legs:'Legs & glutes',beginner:'Beginner',intermediate:'Intermediate',start:'Open workout',minute:'min',note:'These are general examples, not personalized medical or training plans. Select an exercise level you can perform with controlled technique. Without suitable equipment, resisted pulling work is limited.',footer:'Free · no signup · preferences stay on your device.',empty:'No workouts match both filters.'},
 de:{title:'Finde dein Training',intro:'Fertige Bodyweight-Trainings für verschiedene Ziele und Erfahrungsstufen. Öffne einen Vorschlag, passe ihn an und starte.',back:'Zum Trainingsplaner',focus:'Schwerpunkt',level:'Niveau',language:'Sprache',all:'Alle',full:'Ganzkörper',core:'Core & Stabilität',upper:'Oberkörper',legs:'Beine & Po',beginner:'Einsteiger',intermediate:'Mittelstufe',start:'Training öffnen',minute:'Min.',note:'Allgemeine Trainingsbeispiele, keine personalisierten medizinischen oder sportlichen Pläne. Wähle eine Belastung, bei der du kontrolliert trainierst. Ohne geeignete Ausrüstung sind Zugübungen mit Widerstand eingeschränkt.',footer:'Kostenlos · ohne Anmeldung · Einstellungen bleiben auf deinem Gerät.',empty:'Keine Trainings für beide Filter gefunden.'},
 it:{title:'Trova il tuo allenamento',intro:'Allenamenti a corpo libero pronti per obiettivi e livelli diversi. Aprine uno, personalizzalo e inizia.',back:'Torna al generatore',focus:'Obiettivo',level:'Livello',language:'Lingua',all:'Tutti',full:'Corpo intero',core:'Core e stabilità',upper:'Parte superiore',legs:'Gambe e glutei',beginner:'Principiante',intermediate:'Intermedio',start:'Apri allenamento',minute:'min',note:'Questi sono esempi generali, non programmi medici o personalizzati. Scegli esercizi che puoi eseguire con controllo. Senza attrezzatura adatta la resistenza di trazione è limitata.',footer:'Gratis · senza account · preferenze salvate sul dispositivo.',empty:'Nessun allenamento per questi filtri.'},
 fr:{title:'Trouvez votre séance',intro:'Des séances au poids du corps prêtes à démarrer, selon vos objectifs et votre niveau. Ouvrez, adaptez et entraînez-vous.',back:'Retour au créateur',focus:'Objectif',level:'Niveau',language:'Langue',all:'Tous',full:'Corps entier',core:'Gainage et stabilité',upper:'Haut du corps',legs:'Jambes et fessiers',beginner:'Débutant',intermediate:'Intermédiaire',start:'Ouvrir la séance',minute:'min',note:'Ces exemples ne sont ni des prescriptions médicales ni des programmes personnalisés. Choisissez des mouvements maîtrisés. Sans équipement adapté, les tirages avec résistance restent limités.',footer:'Gratuit · sans compte · préférences locales.',empty:'Aucune séance pour ces filtres.'},
 es:{title:'Encuentra tu entrenamiento',intro:'Rutinas de peso corporal listas para diferentes objetivos y niveles. Abre una, personalízala y empieza.',back:'Volver al generador',focus:'Objetivo',level:'Nivel',language:'Idioma',all:'Todos',full:'Cuerpo completo',core:'Core y estabilidad',upper:'Tren superior',legs:'Piernas y glúteos',beginner:'Principiante',intermediate:'Intermedio',start:'Abrir entrenamiento',minute:'min',note:'Estos ejemplos no son programas médicos ni planes personalizados. Elige variantes que puedas realizar con control. Sin equipo adecuado, los ejercicios de tracción con resistencia son limitados.',footer:'Gratis · sin registro · preferencias en el dispositivo.',empty:'No hay rutinas para ambos filtros.'}
};
const recipes=[
 {focus:'full',level:'beginner',ids:['squat','kneePushup','hipHinge','birdDog','march'],rounds:3,minutes:15,title:['Everyday full body','Ganzkörper für jeden Tag','Corpo intero quotidiano','Corps entier au quotidien','Cuerpo completo diario'],description:['An accessible combination of legs, push and stability.','Ein gut zugänglicher Mix aus Beinen, Drücken und Stabilität.','Una combinazione accessibile di gambe, spinta e stabilità.','Un mélange accessible de jambes, poussée et stabilité.','Una mezcla accesible de piernas, empuje y estabilidad.']},
 {focus:'full',level:'intermediate',ids:['reverseLunge','pushup','singleLegBridge','plank','mountainClimber'],rounds:3,minutes:15,title:['Step up the challenge','Etwas anspruchsvoller','Un passo avanti','Montez d’un niveau','Sube el nivel'],description:['A tougher combination of strength and conditioning.','Anspruchsvollere Kombination aus Kraft und Ausdauer.','Più forza e condizionamento.','Plus de force et de conditionnement.','Más fuerza y acondicionamiento.']},
 {focus:'core',level:'beginner',ids:['deadBug','birdDog','gluteBridge','heelTouch','hipHinge'],rounds:3,minutes:15,title:['Core foundations','Grundlagen für die Mitte','Fondamenti del core','Bases du gainage','Fundamentos del core'],description:['Controlled core movements with accessible starting positions.','Kontrollierte Rumpfübungen mit einfachen Ausgangspositionen.','Movimenti del core controllati e accessibili.','Mouvements de gainage contrôlés et accessibles.','Movimientos controlados y accesibles para el core.']},
 {focus:'core',level:'intermediate',ids:['plank','bicycle','sidePlankL','sidePlankR','bearHold'],rounds:3,minutes:15,title:['Build core stability','Rumpfstabilität ausbauen','Stabilità del core','Renforcer la stabilité','Más estabilidad central'],description:['Different holding and anti-rotation challenges.','Unterschiedliche Halte- und Stabilisationsaufgaben.','Tenute e sfide di stabilità differenti.','Des maintiens et défis de stabilité variés.','Diferentes retos de estabilidad y control.']},
 {focus:'upper',level:'beginner',ids:['wallPushup','kneePushup','snowAngel','plank','birdDog'],rounds:3,minutes:15,title:['Upper body — no band','Oberkörper ohne Band','Parte superiore senza elastico','Haut du corps sans bande','Tren superior sin banda'],description:['Gentle pressing and shoulder-control movements. No resisted pulling included.','Drücken und Schulterkontrolle ohne Zugwiderstand.','Spinte e controllo delle spalle, senza trazione resistita.','Poussée et contrôle des épaules, sans tirage résisté.','Empuje y control del hombro, sin tracción resistida.']},
 {focus:'upper',level:'intermediate',ids:['pushup','kneePushup','bandRow','snowAngel','shoulderTap'],rounds:3,minutes:15,title:['Upper body — with band','Oberkörper mit Band','Parte superiore con elastico','Haut du corps avec bande','Tren superior con banda'],description:['Press and pull. Requires a secured resistance band for effective rows.','Drücken und Ziehen mit sicher befestigtem Widerstandsband.','Spinta e trazione con elastico fissato in sicurezza.','Poussée et tirage avec bande correctement fixée.','Empuje y tracción con banda bien sujeta.']},
 {focus:'legs',level:'beginner',ids:['squat','hipHinge','gluteBridge','calfRaise','wallSit'],rounds:3,minutes:15,title:['Low-impact legs','Beine ohne Sprünge','Gambe senza salti','Jambes sans sauts','Piernas sin saltos'],description:['Lower-body movements without jumping.','Unterkörpertraining ohne Springen.','Gambe e glutei senza salti.','Jambes et fessiers sans sauts.','Piernas y glúteos sin saltos.']},
 {focus:'full',level:'beginner',ids:['squat','kneePushup','hipHinge','birdDog','march'],rounds:1,minutes:5,title:['Five-minute reset','Fünf Minuten Bewegung','Cinque minuti di movimento','Bouger cinq minutes','Cinco minutos de movimiento'],description:['A shorter circuit for days when time is limited.','Kurzer Zirkel für wenig Zeit.','Circuito breve quando hai poco tempo.','Petit circuit quand le temps manque.','Circuito corto cuando hay poco tiempo.']},
 {focus:'full',level:'beginner',ids:['squat','kneePushup','hipHinge','birdDog','march'],rounds:2,minutes:10,title:['Ten-minute full body','Zehn Minuten Ganzkörper','Dieci minuti corpo intero','Dix minutes corps entier','Diez minutos cuerpo completo'],description:['A practical middle ground between five and fifteen minutes.','Zwischen fünf und fünfzehn Minuten.','Via di mezzo tra cinque e quindici minuti.','Entre cinq et quinze minutes.','Entre cinco y quince minutos.']}
];
const params=new URLSearchParams(location.search);
let lang=Object.hasOwn(choices,params.get('lang'))?params.get('lang'):'en';
let focus='all',level='all';
const rootLink=(l)=>languageUrl(root.href,l);
const el=id=>document.getElementById(id);
function fillSelect(select,keys,value){
 const t=choices[lang];select.innerHTML=keys.map(k=>'<option value="'+k+'">'+(t[k]||k)+'</option>').join('');select.value=value;
}
function render(){
 const t=choices[lang],idx=Object.keys(choices).indexOf(lang);
 document.documentElement.lang=lang;
 document.title=t.title+' | Pick5Go';
 el('gallery-title').textContent=t.title;el('gallery-description').textContent=t.intro;
 el('gallery-back').textContent='← '+t.back;el('gallery-back').href=rootLink(lang);
 el('gallery-footer-link').href=rootLink(lang);
 el('goal-label').textContent=t.focus;el('level-label').textContent=t.level;el('lang-label').textContent=t.language;
 el('gallery-note').textContent=t.note;el('gallery-footer-note').textContent=t.footer;
 fillSelect(el('gallery-goal'),['all','full','core','upper','legs'],focus);
 fillSelect(el('gallery-level'),['all','beginner','intermediate'],level);
 el('gallery-lang').innerHTML=Object.keys(choices).map((code,i)=>'<option value="'+code+'">'+['English','Deutsch','Italiano','Français','Español'][i]+'</option>').join('');
 el('gallery-lang').value=lang;
 const filtered=recipes.filter(r=>(focus==='all'||r.focus===focus)&&(level==='all'||r.level===level));
 el('gallery-list').innerHTML=filtered.map(r=>{
  const plan={presetId:r.focus,difficulty:r.level,ids:r.ids,workSec:40,restSec:20,rounds:r.rounds};
  const href=sharedWorkoutUrl(root.href,lang,plan);
  return '<article class="gallery-card"><span class="meta">'+t[r.focus]+' · '+t[r.level]+' · '+r.minutes+' '+t.minute+'</span><h2>'+r.title[idx]+'</h2><p>'+r.description[idx]+'</p><a href="'+href+'">'+t.start+' →</a></article>';
 }).join('')||'<p>'+t.empty+'</p>';
}
el('gallery-goal').addEventListener('change',e=>{focus=e.target.value;render();});
el('gallery-level').addEventListener('change',e=>{level=e.target.value;render();});
el('gallery-lang').addEventListener('change',e=>{
 lang=e.target.value;const url=new URL(location.href);url.searchParams.set('lang',lang);history.replaceState(null,'',url.href);render();
});
render();
