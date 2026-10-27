import {UI_EXTRA} from './locales-ui.js';
import {EXERCISE_EXTRA,GROUP_EXTRA} from './locales-exercises.js';

const EX_EN={
squat:['Squats','Legs','Stand with feet shoulder-width apart. Sit back and down, keeping your back neutral.','Track your knees over your toes. Push through your whole foot.'],
pushup:['Push-ups','Upper body','Hands under shoulders; lower your body in a straight line, then push back up.','Easier: keep your knees on the floor. Do not flare your elbows too widely.'],
reverseLunge:['Reverse lunges','Legs','Step one foot backward at a time, bend both knees, then stand tall.','Keep your front knee aligned over the foot. Use a wall for balance if needed.'],
plank:['Forearm plank','Core','Place forearms on the floor, brace your abdomen and glutes, and keep a straight line.','Avoid arching your lower back. Drop your knees if needed.'],
mountainClimber:['Mountain climbers','Cardio','From a high plank, alternately drive each knee toward your chest.','Keep shoulders above wrists. Slow down for better control.'],
wallPushup:['Wall push-ups','Upper body','Lean your straight body toward a wall, bend your elbows, then push away.','The farther your feet are from the wall, the harder the exercise.'],
gluteBridge:['Glute bridges','Legs','Lie on your back with knees bent, raise your hips, and lower them with control.','Brace your core at the top; avoid arching your back.'],
birdDog:['Bird dog','Core','From all fours, extend opposite arm and leg, return, then switch sides.','Keep your pelvis steady; move slowly and deliberately.'],
march:['Standing knee raises','Cardio','Stand tall and alternately lift your knees toward hip height.','Keep your torso upright. Slow down if needed.'],
deadBug:['Dead bug','Core','On your back, raise your arms and legs. Slowly lower one arm and the opposite leg, bring both back up, then switch sides.','Gently keep your lower back in contact with the floor.'],
bicycle:['Bicycle crunches','Core','On your back, turn one shoulder toward the opposite knee as the other leg extends; switch sides.','Rotate through your torso; do not pull on your neck.'],
sidePlankL:['Side plank – left','Core','Balance on your left forearm, lift your hips, and hold your body straight.','Keep the elbow under your shoulder. Easier: rest your bottom knee.'],
sidePlankR:['Side plank – right','Core','Balance on your right forearm, lift your hips, and hold your body straight.','Keep the elbow under your shoulder. Easier: rest your bottom knee.'],
pikePushup:['Pike push-ups','Upper body','From an inverted V, lower your head between your hands, then press back up.','Move slowly and keep your neck neutral. Only lower as far as comfortable.'],
shoulderTap:['Plank shoulder taps','Upper body','From a high plank, touch the opposite shoulder with each hand in turn.','Place feet wider apart to reduce hip movement.'],
snowAngel:['Reverse snow angels','Upper body','Lie face down. Sweep slightly raised straight arms out and overhead, then back; keep legs down.','Use small movements; keep your neck long and relaxed.'],
calfRaise:['Calf raises','Legs','Stand tall, raise your heels slowly, then lower them again.','Hold on lightly if needed. Avoid bouncing.'],
wallSit:['Wall sit','Legs','Back against a wall, feet slightly forward; slide down and hold.','Choose a comfortable knee angle and keep knees aligned with feet.'],
jumpingJack:['Jumping jacks','Cardio','Jump feet apart as arms rise overhead, then return to the starting position.','Low-impact option: step one foot out at a time.'],
superman:['Superman hold','Core','Lie face down and gently lift arms and legs, then hold.','Look down at the floor; avoid excessive back extension.'],
heelTouch:['Heel touches','Core','Lie on your back, knees bent and feet flat; reach toward each same-side heel alternately.','Use small side-to-side movements and lift shoulders slightly.'],
bearHold:['Bear hold','Core','From all fours, tuck your toes, lift knees a few centimetres and hold.','Keep your back neutral and breathe calmly. Lower knees if needed.'],
hipHinge:['Hip hinge','Legs','Bend your knees slightly, push hips back and stand tall with a neutral spine.','Hinge at your hips and keep weight across your whole foot.'],
bandRow:['Resistance-band row','Upper body','Row with a band around both feet; alternatively pull a long towel taut and hold.','Keep the band secure around your feet and your shoulders down.'],
kneePushup:['Knee push-ups','Upper body','From your knees, lower your chest with control and press back up.','Keep a straight line from head to knees.'],
singleLegBridge:['Single-leg glute bridge','Legs','On your back, lift one leg and raise then lower your hips using the planted foot.','Keep your hips level; switch legs halfway through.'],
assistedSingleLegSquat:['Assisted single-leg squat','Legs','Hold a stable support, bend one leg slowly, then stand back up.','Lower only as far as controlled; switch legs halfway through.'],
inclinePushup:["Incline push-ups","Upper body","Place hands on a stable, raised surface. Keeping your body straight, lower your chest toward it and press away.","Use a non-slip, sturdy surface. Lower support height makes this harder."],
kneeForearmPlank:["Knee forearm plank","Core","Place forearms and knees on the floor. Brace your core and hold a straight line from your head to your knees.","Keep elbows under shoulders and avoid sagging at the hips."],
stepJack:["Low-impact step jacks","Cardio","Step one foot sideways while lifting your arms, return to centre, then alternate legs.","No jumping. Keep your steps light and pace comfortable."],
gluteBridgeMarch:["Glute bridge march","Legs","Hold a glute bridge while lifting one foot slightly off the floor, alternating legs.","Keep hips level and lower both feet if your pelvis twists."],
supportedSplitSquat:["Supported split squats","Legs","Hold a stable support in a split stance, bend both knees with control, then stand tall.","Keep a comfortable stance and switch the front leg halfway through."],
};
const PRESET_EN={
full:['Full body','Balanced & effective',''],
core:['Core & stability','Core strength and posture',''],
upper:['Upper body','Pressing & stability',''],
legs:['Legs & glutes','Strength from the ground up','']
};
const STRINGS={
en:{
switchLanguage:'Switch to German',help:'Installation help',
heroEyebrow:'FITNESS, SIMPLIFIED.',heroFirst:'pick five',heroSecond:'go',
heroDesc:'Choose your exercises, set your pace, and let the timer guide you.',
healthNotice:'Train only if you are fit for strength exercise. If you have health concerns or are unsure, seek medical advice first.',
workoutRecord:'YOUR WORKOUT',recordHint:'Share this workout as a link—your exercise order and intervals are included.',shareWorkout:'Share workout',shareMessage:'Try this bodyweight workout with Pick5Go.',shareCopied:'Workout link copied.',shareFailed:'Could not create a workout link.',sharePrompt:'Copy your workout link:',recordExercises:'Exercise order',recordIntervals:'Intervals',recordTotal:'Planned duration',recordDate:'Date',recordFinalRest:'Final rest',recordYes:'Included',recordNo:'Not included',recordCustom:'Customized',
flexible:'Flexible interval timer',awake:'Keep screen awake*',
focus:'Choose your focus',programs:'programs',exercisesTitle:'Your exercises',reset:'Reset to 5',swap:'Swap',remove:'Remove',add:'Add exercise',removeHint:'Swap or remove exercises. Keep between 1 and 5 per round.',
timing:'Set your intervals',work:'Work',rest:'Rest',rounds:'Rounds',sec:'sec',perRound:'per round',
finalRest:'Rest after the last exercise',finalRestOn:'On: continuous intervals for exactly {time}. Off: finish immediately after the last work interval.',
sounds:'Sound cues',soundsDesc:'Play a tone when switching between work and rest.',
plan:'YOUR WORKOUT PLAN',duration:'Total duration',workBreakdown:'Work',restBreakdown:'Rest',roundOne:'round',roundMany:'rounds',exerciseOne:'exercise',exerciseMany:'exercises',start:'Start workout',
footnote:'* On supported devices while the app remains visible, subject to iOS limitations.',
footer:'Your exercise choices stay on your device. No registration, no setup, no personal workout history',
swapEyebrow:'SWAP EXERCISE',addEyebrow:'ADD EXERCISE',swapTitle:'Choose a replacement',addTitle:'Choose an exercise',
close:'Close',search:'Search exercise or muscle group…',searchAria:'Search exercises',noMatches:'No matching exercises found.',
easy:'Beginner',medium:'Intermediate',advanced:'Advanced',levelHeading:'Training level',levelHint:'Changes the five exercises in each focus. You can still swap any exercise.',bandRequired:'Resistance band or long towel',placeholder:'Illustration coming soon',
workCaps:'WORK',restCaps:'REST',nextPrefix:'Next: ',lastRest:'Final rest',
restFinished:'You have finished every exercise. Breathe and recover.',
recoveryCue:'Breathe slowly. Relax your shoulders. Let your body recover.',
roundLabel:'Round',exerciseLabel:'Exercise',pauseLabel:'REST',leftLabel:'LEFT',clockHint:'Minutes : seconds',remaining:'Workout remaining',
readySoon:'UP NEXT',activeExercise:'CURRENT EXERCISE',nextPreview:'NEXT EXERCISE PREVIEW',
afterWork:'Work interval begins next',afterFinish:'Your workout ends next',afterPrefix:'Up next: ',afterDone:'Up next: workout complete',
checkingWake:'Checking screen wake lock…',awakeOn:'Keeping screen awake where supported',awakeOff:'Screen wake lock unavailable – adjust auto-lock if needed',
resume:'Resume',pause:'Pause',skip:'Next',exit:'Exit',audioWarn:'Sound cues may not be available on this device.',
complete:'WORKOUT COMPLETE',wellDone:'Well done.',doneMessage:'Workout complete. Drink some water and take a moment to recover.',planned:'Planned duration',exercisesDone:'Exercises',repeat:'Repeat workout',backToPlan:'Back to workout plan',
exitConfirm:'End this workout? Your progress will be lost.',startError:'Could not start workout: ',
helpMessage:'INSTALL PICK5GO ON IPHONE\n\n1. Open this HTTPS website in Safari.\n2. Tap Share.\n3. Choose Add to Home Screen.\n\nWorkout mode works in Safari as well. For offline use, reopen the installed app once while online.\n\nKeep the app visible for screen wake lock. iOS may disable it in Low Power Mode.'
},
de:{
switchLanguage:'Zu Englisch wechseln',help:'Installationshilfe',
heroEyebrow:'FITNESS, GANZ EINFACH.',heroFirst:'pick five',heroSecond:'go',
heroDesc:'Wähle deine Übungen, bestimme dein Tempo und lass dich vom Timer begleiten.',
healthNotice:'Trainiere nur, wenn du gesundheitlich für Krafttraining geeignet bist. Bei Beschwerden oder Unsicherheit hole vorher ärztlichen Rat ein.',
workoutRecord:'DEIN TRAINING',recordHint:'Teile dieses Training als Link – Übungen und Intervalle sind enthalten.',shareWorkout:'Training teilen',shareMessage:'Probier dieses Bodyweight-Training mit Pick5Go.',shareCopied:'Trainingslink kopiert.',shareFailed:'Trainingslink konnte nicht erstellt werden.',sharePrompt:'Trainingslink kopieren:',recordExercises:'Übungsreihenfolge',recordIntervals:'Intervalle',recordTotal:'Geplante Dauer',recordDate:'Datum',recordFinalRest:'Letzte Pause',recordYes:'Enthalten',recordNo:'Entfällt',recordCustom:'Angepasst',
flexible:'Flexibler Intervalltimer',awake:'Display bleibt aktiv*',
focus:'Wähle deinen Fokus',programs:'Programme',exercisesTitle:'Deine Übungen',reset:'Auf 5 zurücksetzen',swap:'Tauschen',remove:'Entfernen',add:'Übung hinzufügen',removeHint:'Übungen tauschen oder entfernen. Pro Runde bleiben 1 bis 5 Übungen.',
timing:'Dein Timing',work:'Belastung',rest:'Erholung',rounds:'Runden',sec:'Sek.',perRound:'pro Runde',
finalRest:'Erholung nach der letzten Übung',finalRestOn:'Ein: genau {time} bei durchgängigen Intervallen. Aus: Training endet unmittelbar nach der letzten Belastung.',
sounds:'Akustische Signale',soundsDesc:'Töne beim Wechsel zwischen Belastung und Erholung.',
plan:'DEIN TRAININGSPLAN',duration:'Gesamtdauer',workBreakdown:'Belastung',restBreakdown:'Erholung',roundOne:'Runde',roundMany:'Runden',exerciseOne:'Übung',exerciseMany:'Übungen',start:'Training starten',
footnote:'* Auf unterstützten Geräten, solange die App sichtbar ist und iOS die Funktion zulässt.',
footer:'Deine Übungsauswahl bleibt auf deinem Gerät. Keine Anmeldung, keine Einrichtung, kein persönliches Trainingsprotokoll.',
swapEyebrow:'ÜBUNG AUSTAUSCHEN',addEyebrow:'ÜBUNG HINZUFÜGEN',swapTitle:'Neue Übung wählen',addTitle:'Übung auswählen',
close:'Schließen',search:'Übung oder Muskelgruppe suchen …',searchAria:'Übungen durchsuchen',noMatches:'Keine weiteren passenden Übungen gefunden.',
easy:'Einsteiger',medium:'Mittelstufe',advanced:'Fortgeschritten',levelHeading:'Trainingsniveau',levelHint:'Passt die fünf Übungen je Schwerpunkt an. Jede Übung kann frei getauscht werden.',bandRequired:'Widerstandsband oder langes Handtuch',placeholder:'Illustration folgt',
workCaps:'BELASTUNG',restCaps:'ERHOLUNG',nextPrefix:'Als Nächstes: ',lastRest:'Letzte Erholung',
restFinished:'Du hast alle Übungen geschafft. Atme ruhig durch.',
recoveryCue:'Atme ruhig und gleichmäßig. Entspanne die Schultern. Komm zur Ruhe.',
roundLabel:'Runde',exerciseLabel:'Übung',pauseLabel:'PAUSE',leftLabel:'NOCH',clockHint:'Minuten : Sekunden',remaining:'Training verbleibend',
readySoon:'GLEICH GEHT’S WEITER',activeExercise:'AKTUELLE ÜBUNG',nextPreview:'VORSCHAU AUF DIE NÄCHSTE ÜBUNG',
afterWork:'Anschließend beginnt die Belastung',afterFinish:'Danach ist das Training beendet',afterPrefix:'Danach: ',afterDone:'Danach: Trainingsabschluss',
checkingWake:'Display-Aktivhaltung wird geprüft …',awakeOn:'Display bleibt möglichst aktiv',awakeOff:'Display-Aktivhaltung nicht verfügbar – Auto-Sperre ggf. deaktivieren',
resume:'Fortsetzen',pause:'Pausieren',skip:'Weiter',exit:'Beenden',audioWarn:'Tonsignale sind auf diesem Gerät eventuell nicht verfügbar.',
complete:'WORKOUT ABGESCHLOSSEN',wellDone:'Stark gemacht.',doneMessage:'Du hast dein Training abgeschlossen. Gönn dir etwas Wasser und eine kurze Erholung.',planned:'Geplante Dauer',exercisesDone:'Übungen',repeat:'Nochmal trainieren',backToPlan:'Zum Trainingsplan',
exitConfirm:'Training wirklich beenden? Dein Fortschritt geht verloren.',startError:'Training konnte nicht gestartet werden: ',
helpMessage:'INSTALLATION AUF DEM IPHONE\n\n1. Diese HTTPS-Website in Safari öffnen.\n2. Auf Teilen tippen.\n3. „Zum Home-Bildschirm“ wählen.\n\nDer Trainingsmodus funktioniert auch ohne Installation. Für die Offline-Nutzung die installierte App nach dem ersten Online-Aufruf erneut öffnen.\n\nFür die Display-Aktivhaltung muss die App sichtbar bleiben; iOS kann die Funktion im Stromsparmodus verweigern.'
}
};
// Public language list: English and German from the original app; 3 complete new locales.
export const LANGUAGES=[
 {code:'en',label:'English',short:'EN',locale:'en-GB'},
 {code:'de',label:'Deutsch',short:'DE',locale:'de-DE'},
 {code:'it',label:'Italiano',short:'IT',locale:'it-IT'},
 {code:'fr',label:'Français',short:'FR',locale:'fr-FR'},
 {code:'es',label:'Español',short:'ES',locale:'es-ES'}
];
const VALID_LANGUAGES=new Set(LANGUAGES.map(l=>l.code));
export function normalizeLang(lang){return VALID_LANGUAGES.has(lang)?lang:'en';}
export function localeFor(lang){return LANGUAGES.find(l=>l.code===normalizeLang(lang)).locale;}
export function t(lang,key,params={}){
 const chosen=normalizeLang(lang),dictionary=chosen==='en'||chosen==='de'?STRINGS[chosen]:UI_EXTRA[chosen];
 const template=dictionary[key];
 if(template===undefined)throw Error('Missing '+chosen+' translation: '+key);
 return template.replace(/\{(\w+)\}/g,(_,k)=>String(params[k]??''));
}
export function exerciseText(exercise,lang){
 const chosen=normalizeLang(lang);
 if(chosen==='de')return exercise;
 if(chosen==='en'){
  const en=EX_EN[exercise.id];if(!en)throw Error('Missing exercise: '+exercise.id);
  return {...exercise,name:en[0],group:en[1],cue:en[2],tip:en[3]};
 }
 const entry=EXERCISE_EXTRA[chosen][exercise.id];
 if(!entry)throw Error('Missing '+chosen+' exercise: '+exercise.id);
 return {...exercise,name:entry[0],group:GROUP_EXTRA[chosen][exercise.group],cue:entry[1],tip:entry[2]};
}
export function presetText(preset,lang){
 const chosen=normalizeLang(lang);
 if(chosen==='de')return preset;
 const entry=PRESET_EN[preset.id];if(!entry)throw Error('Missing preset: '+preset.id);
 if(chosen==='en')return {...preset,name:entry[0],subtitle:entry[1],tag:entry[2]};
 const extra=PRESET_EXTRA[chosen][preset.id];
 return {...preset,name:extra[0],subtitle:extra[1],tag:''};
}
const PRESET_EXTRA={
 it:{full:['Corpo intero','Allenamento equilibrato'],core:['Core e stabilità','Forza e postura'],upper:['Parte superiore','Spinta e stabilità'],legs:['Gambe e glutei','Forza dalla base']},
 fr:{full:['Corps entier','Séance équilibrée'],core:['Gainage et stabilité','Force et posture'],upper:['Haut du corps','Poussée et stabilité'],legs:['Jambes et fessiers','Renforcement ciblé']},
 es:{full:['Cuerpo completo','Entrenamiento equilibrado'],core:['Zona media y estabilidad','Fuerza y postura'],upper:['Tren superior','Empuje y estabilidad'],legs:['Piernas y glúteos','Fuerza desde la base']}
};
export function levelText(level,lang){return level?t(lang,['','easy','medium','advanced'][level]):'';}
