import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PREPARATION_MS,PreparationCountdown} from '../src/preparation.js';
import {buildPlan,planStats,IntervalEngine} from '../src/engine.js';
import {coachText} from '../src/coach-i18n.js';

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
test('preparation is exactly ten seconds, monotonic, idempotent and cancelable',()=>{
 let now=100;
 const p=new PreparationCountdown({clock:()=>now});
 assert.equal(PREPARATION_MS,10000);
 assert.equal(p.remainingMs(),10000);
 p.start();
 p.start(); // duplicate startup cannot extend preparation.
 now=4100;
 assert.equal(p.remainingMs(),6000);
 assert.equal(p.tick(),false);
 now=10100;
 assert.equal(p.remainingMs(),0);
 assert.equal(p.tick(),true);
 assert.equal(p.tick(),false);
 const canceled=new PreparationCountdown({clock:()=>now});
 canceled.start();canceled.cancel();
 now+=30000;
 assert.equal(canceled.tick(),false);
 assert.equal(canceled.status,'cancelled');
});
test('first workout phase is a full work interval and preparation never alters total time',()=>{
 let now=0,completed=0;
 const phases=buildPlan(['inclinePushup','birdDog','squat'],{workSec:40,restSec:20,rounds:2,includeFinalRest:true});
 const total=planStats(phases).totalMs;
 const e=new IntervalEngine(phases,{clock:()=>now,onComplete:()=>completed++});
 const p=new PreparationCountdown({clock:()=>now});
 p.start();
 now=9999;
 assert.equal(e.status,'idle');assert.equal(e.snapshot().totalMs,total);
 assert.equal(p.tick(),false);
 now=10000;
 assert.equal(p.tick(),true);
 e.start();
 assert.equal(e.snapshot().remainingMs,40000);
 assert.equal(e.snapshot().totalRemainingMs,total);
 now=10001;
 e.tick();
 assert.equal(e.snapshot().remainingMs,39999);
 assert.equal(completed,0);
});
test('preparation layout previews first exercise, clearly announces countdown and excludes timer progress',()=>{
 const app=read('src/app.js'),sw=read('sw.js'),css=read('styles.css');
 const prep=app.slice(app.indexOf('function renderPreparation(){'),app.indexOf('function renderWorkout(){'));
 assert.ok(prep.includes("E(engine.phases[0].exerciseId)"),'the first exercise, not a random pose');
 assert.ok(prep.includes('studyPicture(first.pose,first.name,prefs.lang,first.id)'),'proper original illustration');
 assert.ok(prep.includes("C('prepIn')"),'announce this is a countdown to start');
 assert.ok(prep.includes("C('prepState')"),'prepare rather than exercise');
 assert.ok(prep.includes("C('prepFirst')"),'first exercise clearly signposted');
 assert.ok(prep.includes("C('prepMessage')"),'pose preparation guidance');
 assert.ok(prep.includes('secsLabel(engine.totalMs)'),'display the real workout duration without ten seconds');
 assert.ok(prep.includes('aria-valuenow="0"'),'progress starts at zero');
 assert.ok(prep.includes('style="width:0%"'),'progress bar not advanced');
 assert.ok(prep.includes('data-action="prepare-now"'),'user can skip the preparation');
 assert.ok(css.includes('.v13-clean.prep-mode'),'distinct prep-screen styling');
 assert.ok(sw.includes("'./src/preparation.js'"),'offline PWA has preparation module');
});
test('preparation holds the interval engine idle until ten seconds elapse',()=>{
 const app=read('src/app.js');
 const begin=app.slice(app.indexOf('function beginWorkout('),app.indexOf('function exitWorkout(){'));
 assert.ok(begin.includes('new PreparationCountdown({durationMs:PREPARATION_MS})'));
 assert.ok(begin.includes("view='prepare';"),'preparation precedes exercise');
 assert.ok(begin.includes("view='workout';\n engine.start();"),'exercise clock starts afterward');
 assert.ok(!begin.slice(0,begin.indexOf('function startActualWorkout(){')).includes('engine.start()'),'start button cannot begin work early');
 const clock=app.slice(app.indexOf('function updateClock(){'),app.indexOf('function startTicking(){'));
 assert.ok(clock.includes("if(view==='prepare'&&preparation)"),'tick prep separately');
 assert.ok(clock.includes('if(preparation.tick()){startActualWorkout();return;}'),'switch when countdown ends');
 const exit=app.slice(app.indexOf('function exitWorkout(){'),app.indexOf('function showHelp(){'));
 assert.ok(exit.includes("if(view!=='prepare')trackWorkoutEvent('workout_abandoned'"),'canceling preparation is not an abandoned workout');
 assert.ok(exit.includes('preparation?.cancel();preparation=null;'),'no delayed start after exit');
});
test('all five languages explain countdown and Open workout',()=>{
 for(const lang of ['en','de','it','fr','es']){
  for(const key of ['openWorkout','prepState','prepIn','prepFirst','prepMessage','prepNow','prepWorkoutTime']){
   const value=coachText(lang,key);
   assert.equal(typeof value,'string',lang+'/'+key);
   assert.ok(value.length>=4,lang+'/'+key);
  }
 }
 assert.equal(coachText('en','openWorkout'),'Open workout');
});
