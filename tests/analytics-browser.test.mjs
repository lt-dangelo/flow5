import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const read=(file)=>readFileSync(new URL('../'+file,import.meta.url),'utf8');
function simulate(host,path,choice){
 const handlers={};const nodes={};
 const script={dataset:{}};
 const document={
  documentElement:{lang:'en'},head:{appendChild(s){this.script=s;}},body:{append(){}},
  querySelector(){return null},getElementById(){return null},
  createElement(type){return type==='script'?script:{setAttribute(){},append(){},addEventListener(){}}}
 };
 const storage={getItem:key=>key==='pick5go-analytics-consent-v1'?choice:null};
 const window={location:{hostname:host,pathname:path},addEventListener:(name,fn)=>{handlers[name]=fn},dispatchEvent(e){handlers[e.type]?.()}};
 const context={window,location:window.location,document,localStorage:storage,Event:class{constructor(type){this.type=type}}};
 vm.runInNewContext(read('src/consent.js'),context);
 return {document,script,window,context};
}
const primary=simulate('pick5go.com','/preview/v1.3/','yes');
assert.equal(primary.document.head.script?.src,'https://cloud.umami.is/script.js');
assert.equal(primary.document.head.script?.dataset.websiteId,'789229c5-0473-4aab-bdfb-cddc54b1c37d');
const legacy=simulate('lt-dangelo.github.io','/flow5/preview/v1.3/','yes');
assert.equal(legacy.document.head.script?.src,'https://cloud.umami.is/script.js');
const declined=simulate('pick5go.com','/preview/v1.3/','no');
assert.equal(declined.document.head.script,undefined);
const external=simulate('example.com','/preview/v1.3/','yes');
assert.equal(external.document.head.script,undefined);
const githubProduction=simulate('lt-dangelo.github.io','/flow5/','yes');
assert.equal(githubProduction.document.head.script,undefined);
const {trackWorkoutEvent}=await import('../src/analytics.js');
const session={ids:['squat'],presetId:'full',difficulty:'beginner',rounds:1,workSec:20,restSec:10,skippedPhases:0};
const previousWindow=globalThis.window,previousStorage=globalThis.localStorage;
try{
 const handlers={};const calls=[];
 globalThis.localStorage={getItem:()=> 'yes'};
 globalThis.window={location:{pathname:'/preview/v1.3/'},addEventListener:(n,fn)=>{handlers[n]=fn}};
 // Import cache-busted module so listeners attach to the simulated window.
 const mod=await import('../src/analytics.js?test-browser-queue');
 assert.equal(mod.trackWorkoutEvent('workout_started',session),true);
 assert.equal(mod.trackWorkoutEvent('workout_completed',session),true);
 globalThis.window.umami={track:(...args)=>{calls.push(args);return Promise.resolve();}};
 handlers['pick5go:analyticsready']();
 assert.deepEqual(calls.map(x=>x[0]),['workout_started','workout_completed']);
 assert.equal(calls[0][1].environment,'preview');
}finally{
 if(previousWindow===undefined)delete globalThis.window;else globalThis.window=previousWindow;
 if(previousStorage===undefined)delete globalThis.localStorage;else globalThis.localStorage=previousStorage;
}
console.log('OK: consent loads on both preview domains, never without opt-in, and queues fast-start workout events');