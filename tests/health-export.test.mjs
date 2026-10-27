import test from 'node:test';
import assert from 'node:assert/strict';
import {healthWorkoutPayload,appleShortcutUrl} from '../src/health-export.js';
test('never invent active calories or distance',()=>{
 const session={startedAt:'2026-10-27T12:00:00.000Z',endedAt:'2026-10-27T12:15:00.000Z'};
 assert.deepEqual(healthWorkoutPayload(session),{version:1,source:'Pick5Go',type:'Functional Strength Training',start:session.startedAt,end:session.endedAt,durationMinutes:15});
});
test('reject incomplete or invalid workout times',()=>{
 assert.equal(healthWorkoutPayload({startedAt:'bad',endedAt:'2026-10-27'}),null);
 assert.equal(healthWorkoutPayload({startedAt:'2026-10-27T12:15:00Z',endedAt:'2026-10-27T12:00:00Z'}),null);
 assert.equal(appleShortcutUrl({}),null);
});
test('documented Shortcuts URL passes parseable JSON input',()=>{
 const session={startedAt:'2026-10-27T12:00:00Z',endedAt:'2026-10-27T12:15:30Z'};
 const url=appleShortcutUrl(session);
 assert.ok(url.startsWith('shortcuts://run-shortcut?'));
 const query=url.slice(url.indexOf('?')+1);
 const params=new URLSearchParams(query);
 assert.equal(params.get('name'),'Pick5Go Health');
 assert.equal(params.get('input'),'text');
 assert.equal(JSON.parse(params.get('text')).durationMinutes,15.5);
});
