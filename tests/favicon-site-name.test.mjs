import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url));
for(const [path,size] of [['icons/icon-192.png',192],['icons/icon-512.png',512],['icons/apple-touch-icon.png',192]]){
 const data=read(path);
 assert.equal(data.subarray(0,8).toString('hex'),'89504e470d0a1a0a',path+' PNG signature');
 assert.equal(data.toString('ascii',12,16),'IHDR',path+' IHDR header');
 assert.equal(data.readUInt32BE(16),size,path+' width');
 assert.equal(data.readUInt32BE(20),size,path+' height');
 assert.ok(data.length>1000,path+' plausible file length');
 assert.equal(data.subarray(-8,-4).toString('ascii'),'IEND',path+' PNG ending');
}
const html=read('index.html').toString('utf8');
assert.ok(html.includes('<link rel="icon" type="image/png" sizes="192x192" href="./icons/icon-192.png?v=2"/>'),'square PNG favicon');
assert.ok(html.includes('href="./icons/pick5go-mark.svg"'),'original header mark retained');
const schemas=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(x=>JSON.parse(x[1]));
assert.ok(schemas.some(s=>s['@type']==='WebSite'&&s.name==='Pick5Go'&&s.url==='https://pick5go.com/'),'site name metadata');
assert.ok(schemas.some(s=>s['@type']==='WebApplication'),'existing WebApplication data preserved');
assert.ok(html.includes('<title>Free Bodyweight Workout Builder &amp; Timer | Pick5Go</title>'),'existing SEO title retained');
console.log('OK: square PNG files have valid PNG structure, 192/512 dimensions, and site-name schema');
