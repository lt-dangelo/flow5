
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
bearHold:['Bear hold','Core','From all fours, tuck your toes, lift knees a few centimetres and hold.','Keep your back neutral and breathe calmly. Lower knees if needed.']
};
const PRESET_EN={
full:['Full body','Balanced & effective','Popular'],
beginner:['Beginner','A gentle introduction','Easy'],
core:['Core & stability','Core strength and posture','Moderate'],
upper:['Upper body','Pressing & stability','Intense'],
legs:['Legs & glutes','Strength from the ground up','Moderate']
};
const STRINGS={
en:{
switchLanguage:'Switch to German',help:'Installation help',
heroEyebrow:'YOUR WORKOUT. YOUR RHYTHM.',heroFirst:'Five exercises.',heroSecond:'One flow.',
heroDesc:'Build your calisthenics workout. Start, move, and let the timer guide you.',
flexible:'Flexible interval timer',awake:'Keep screen awake*',
focus:'Choose your focus',programs:'programs',exercisesTitle:'Your exercises',reset:'Reset to 5',swap:'Swap',remove:'Remove',add:'Add exercise',removeHint:'Swap or remove exercises. Keep between 1 and 5 per round.',
timing:'Set your intervals',work:'Work',rest:'Rest',rounds:'Rounds',sec:'sec',perRound:'per round',
finalRest:'Rest after the last exercise',finalRestOn:'On: continuous intervals for exactly {time}. Off: finish immediately after the last work interval.',
sounds:'Sound cues',soundsDesc:'Play a tone when switching between work and rest.',
plan:'YOUR WORKOUT PLAN',duration:'Total duration',workBreakdown:'Work',restBreakdown:'Rest',roundOne:'round',roundMany:'rounds',exerciseOne:'exercise',exerciseMany:'exercises',start:'Start workout',
footnote:'* On supported devices while the app remains visible, subject to iOS limitations.',
footer:'FLOW5 v1.3 PREVIEW · Your workout stays on this device. No account, no tracking.',
swapEyebrow:'SWAP EXERCISE',addEyebrow:'ADD EXERCISE',swapTitle:'Choose a replacement',addTitle:'Choose an exercise',
close:'Close',search:'Search exercise or muscle group…',searchAria:'Search exercises',noMatches:'No matching exercises found.',
easy:'Easy',medium:'Moderate',advanced:'Advanced',
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
helpMessage:'INSTALL FLOW5 ON IPHONE\n\n1. Open this HTTPS website in Safari.\n2. Tap Share.\n3. Choose Add to Home Screen.\n\nWorkout mode works in Safari as well. For offline use, reopen the installed app once while online.\n\nKeep the app visible for screen wake lock. iOS may disable it in Low Power Mode.'
},
de:{
switchLanguage:'Zu Englisch wechseln',help:'Installationshilfe',
heroEyebrow:'DEIN WORKOUT. DEIN RHYTHMUS.',heroFirst:'Fünf Übungen.',heroSecond:'Ein Flow.',
heroDesc:'Stell dir dein Calisthenics-Training zusammen. Starten, mitmachen, automatisch durchwechseln.',
flexible:'Flexibler Intervalltimer',awake:'Display bleibt aktiv*',
focus:'Wähle deinen Fokus',programs:'Programme',exercisesTitle:'Deine Übungen',reset:'Auf 5 zurücksetzen',swap:'Tauschen',remove:'Entfernen',add:'Übung hinzufügen',removeHint:'Übungen tauschen oder entfernen. Pro Runde bleiben 1 bis 5 Übungen.',
timing:'Dein Timing',work:'Belastung',rest:'Erholung',rounds:'Runden',sec:'Sek.',perRound:'pro Runde',
finalRest:'Erholung nach der letzten Übung',finalRestOn:'Ein: genau {time} bei durchgängigen Intervallen. Aus: Training endet unmittelbar nach der letzten Belastung.',
sounds:'Akustische Signale',soundsDesc:'Töne beim Wechsel zwischen Belastung und Erholung.',
plan:'DEIN TRAININGSPLAN',duration:'Gesamtdauer',workBreakdown:'Belastung',restBreakdown:'Erholung',roundOne:'Runde',roundMany:'Runden',exerciseOne:'Übung',exerciseMany:'Übungen',start:'Training starten',
footnote:'* Auf unterstützten Geräten, solange die App sichtbar ist und iOS die Funktion zulässt.',
footer:'FLOW5 v1.3 PREVIEW · Dein Training bleibt auf diesem Gerät. Keine Anmeldung, kein Tracking.',
swapEyebrow:'ÜBUNG AUSTAUSCHEN',addEyebrow:'ÜBUNG HINZUFÜGEN',swapTitle:'Neue Übung wählen',addTitle:'Übung auswählen',
close:'Schließen',search:'Übung oder Muskelgruppe suchen …',searchAria:'Übungen durchsuchen',noMatches:'Keine weiteren passenden Übungen gefunden.',
easy:'Leicht',medium:'Mittel',advanced:'Fortgeschritten',
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
export function t(lang,key,params={}){const template=STRINGS[lang==='de'?'de':'en'][key];if(template===undefined)throw Error('Missing translation: '+key);return template.replace(/\{(\w+)\}/g,(_,k)=>String(params[k]??''));}
export function exerciseText(exercise,lang){if(lang==='de')return exercise;const text=EX_EN[exercise.id];if(!text)throw Error('Missing exercise: '+exercise.id);return {...exercise,name:text[0],group:text[1],cue:text[2],tip:text[3]};}
export function presetText(preset,lang){if(lang==='de')return preset;const text=PRESET_EN[preset.id];if(!text)throw Error('Missing preset: '+preset.id);return {...preset,name:text[0],subtitle:text[1],tag:text[2]};}
export function levelText(level,lang){return level? t(lang,['','easy','medium','advanced'][level]):'';}
