
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {EXERCISES,PRESETS,presetIds} from '../src/data.js';
import {LANGUAGES,exerciseText,t} from '../src/i18n.js';
import {buildPlan} from '../src/engine.js';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const manifest=JSON.parse(read('manifest.webmanifest'));
const app=read('src/app.js'),sw=read('sw.js'),index=read('index.html'),pkg=JSON.parse(read('package.json'));
assert.equal(pkg.version,'1.3.0');
assert.equal(manifest.id,'./','retain installed PWA identity');
assert.equal(manifest.name,'Pick5Go – Fitness, simplified.');
assert.equal(manifest.short_name,'Pick5Go');
assert.ok(!manifest.name.includes('Preview'));
assert.ok(index.includes('<title>Pick5Go – Fitness, simplified.</title>'));
assert.ok(!index.includes('v1.3 Preview'));
assert.ok(index.includes('styles.css?build=1.3.2'));
assert.ok(index.includes('src/app.js?build=1.3.2'));
assert.ok(app.includes("const STORAGE_KEY='pick5go-prefs-v13'"));
assert.ok(app.includes("'flow5-prefs-v13-preview'"));
assert.ok(app.includes("'flow5-prefs-v1'"));
assert.ok(app.includes("migrated[key+':beginner']"));
assert.ok(app.includes('next.includeFinalRest=true'));
assert.ok(app.includes('includeFinalRest:true};}'));
assert.ok(!app.includes('data-config="includeFinalRest"'));
assert.ok(!app.includes('class="intro-stats"'));
assert.ok(sw.includes("pick5go-v1.3-production-3"));
assert.ok(sw.includes("key==='flow5-v1.2.0'"),'evict old worker cache');
assert.ok(sw.includes("key.startsWith('pick5go-v1.3-production-')"));
assert.ok(!sw.includes("key.startsWith('pick5go-v1.3-preview-')"));
assert.ok(sw.includes("url.pathname.startsWith(root+'preview/')"),'root worker must not intercept preview');
assert.deepEqual(LANGUAGES.map(x=>x.code),['en','de','it','fr','es']);
assert.equal(EXERCISES.length,27);
assert.equal(PRESETS.length,4);
for(const p of PRESETS){
  for(const level of ['beginner','intermediate']){
    const ids=presetIds(p.id,level);
    assert.equal(ids.length,5);
    assert.equal(new Set(ids).size,5);
  }
}
for(const l of LANGUAGES){for(const e of EXERCISES){const t=exerciseText(e,l.code);assert.ok(t.name&&t.cue&&t.tip)}}
assert.equal(t('en','footer'),'Your workout stays on your device. No registration, no setup, no workout tracking');
const phases=buildPlan(['squat','pushup'],{workSec:40,restSec:20,rounds:3,includeFinalRest:true});
assert.equal(phases.at(-1).kind,'rest');
console.log('OK: Pick5Go production identity, migration, offline scoping, 27 exercise catalogue, five languages');
