import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=p=>readFileSync(new URL('../'+p,import.meta.url));
const cream=[244,240,230];
function checkPng(file,size){
 const b=read('icons/'+file);
 assert.equal(b.subarray(0,8).toString('hex'),'89504e470d0a1a0a',file+' PNG signature');
 assert.equal(b.toString('ascii',12,16),'IHDR',file+' IHDR');
 assert.equal(b.readUInt32BE(16),size,file+' width');
 assert.equal(b.readUInt32BE(20),size,file+' height');
 assert.equal(b[25],2,file+' uses opaque RGB; no alpha/transparency');
 assert.equal(b.subarray(b.length-8,b.length-4).toString('ascii'),'IEND',file+' complete PNG');
 assert.ok(b.length>1000,file+' not empty');
 return b;
}
checkPng('apple-touch-icon.png',180);
checkPng('home-192.png',192);
checkPng('home-512.png',512);
checkPng('home-maskable-512.png',512);
const manifest=JSON.parse(read('manifest.webmanifest').toString());
assert.ok(manifest.name.includes('Preview'),'keep preview identity distinct from production');
assert.deepEqual(manifest.icons,[
 {src:'./icons/home-192.png',sizes:'192x192',type:'image/png',purpose:'any'},
 {src:'./icons/home-512.png',sizes:'512x512',type:'image/png',purpose:'any'},
 {src:'./icons/home-maskable-512.png',sizes:'512x512',type:'image/png',purpose:'maskable'}
]);
for(const lang of ['en','de','it','fr','es']){
 const html=read((lang==='en'?'':lang+'/')+'index.html').toString();
 assert.ok(html.includes('href="./manifest.webmanifest?icons=cream1"'),lang+' fresh manifest');
 assert.ok(html.includes('href="./icons/apple-touch-icon.png?icons=cream1"'),lang+' fresh iOS installed icon');
 assert.ok(html.includes('href="./icons/pick5go-mark.svg"'),lang+' original mark remains');
}
const sw=read('sw.js').toString();
assert.ok(sw.includes("pick5go-v1.3-preview-55"),'cache refreshed');
for(const path of ['manifest.webmanifest?icons=cream1','icons/apple-touch-icon.png?icons=cream1','icons/home-192.png','icons/home-512.png','icons/home-maskable-512.png'])assert.ok(sw.includes("'./"+path+"'"),path+' precached');
assert.ok(sw.includes("'./icons/icon-192.png'")&&sw.includes("'./icons/icon-512.png'"),'transparent favicon files remain intact');
console.log('OK: opaque 180/192/512 PNG icon assets, maskable safe-zone, separate transparent favicon, manifest and offline cache');
