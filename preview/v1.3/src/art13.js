// Flow5 v1.3 anatomical studies. No external resources; SVG remains crisp offline.
import {illustration as previous} from './art.js';
const ink='#654B37', paper='#F2EADB', motion='#BC703E', guide='#82A76F';
const path=(d,width=2,color=ink)=>`<path d="${d}" stroke="${color}" stroke-width="${width}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
const shaded=(d,fill='#E8D7C2')=>`<path d="${d}" fill="${fill}" stroke="${ink}" stroke-width="1.8" stroke-linejoin="round"/>`;
const faint=d=>path(d,1.2,'#A68C76');
const arrow=d=>`<path d="${d}" stroke="${motion}" stroke-width="3" fill="none" stroke-linecap="round" marker-end="url(#arrowTip)"/>`;
const head=(x,y,scale=1)=>`<g transform="translate(${x} ${y}) scale(${scale})">${shaded('M-10 -17 Q2 -26 13 -15 Q20 -10 17 1 L23 8 L18 11 L17 18 Q6 25 -7 18 L-12 9 Q-18 -4 -10 -17Z','#EEDCC5')}${path('M-11 -14 Q-3 -24 8 -19 L16 -12',2.7)}${faint('M11 1 L17 0 M17 8 L23 8 M6 15 L15 15')}</g>`;
const base=(body,name)=>`<svg class="study-svg" viewBox="0 0 540 322" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${name.replaceAll('&','&amp;').replaceAll('"','&quot;')}"><defs><marker id="arrowTip" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0 0L6 3L0 6" fill="none" stroke="${motion}" stroke-width="1.5"/></marker></defs>${body}<path d="M20 297H518" stroke="${ink}" stroke-width="1" opacity=".20"/></svg>`;

function squats(name){
 const standing=[
  shaded('M118 81 Q104 85 101 106 L104 169 Q119 181 141 167 L144 112 Q143 91 132 84Z'),
  shaded('M105 163 L144 162 L147 184 L105 185Z','#AD9680'),
  shaded('M109 185 Q105 227 99 280 L114 280 L126 205 L129 242 L132 280 L148 280 L145 206 L140 183Z','#F0E0CD'),
  shaded('M97 278 L115 277 L123 287 L119 293 L91 293Z','#B29B83'),
  shaded('M132 279 L149 277 L157 290 L151 294 L129 294Z','#B29B83'),
  shaded('M110 94 Q127 87 145 104 L179 112 L207 114 L208 122 L178 121 L142 117 L124 106Z','#ECD8BF'),
  head(126,60),
  path('M108 112 Q115 130 107 157 M116 114 Q129 128 140 119',1.7),
  faint('M113 143 L131 148 M111 155 L133 157 M113 190 L109 237 M135 197 L143 239 M126 91 L133 107 M117 92 L113 104')
 ].join('');
 const bent=[
  shaded('M384 121 Q367 118 354 142 L333 191 Q328 209 350 226 L384 216 L405 149Q402 135 384 121Z'),
  shaded('M340 196 L385 209 L379 228 L330 222Z','#AD9680'),
  shaded('M341 226 Q368 219 393 228 L413 240 L410 277 L394 278 L393 248 L370 242 L352 254 L347 280 L332 281 L328 246Z','#F0E0CD'),
  shaded('M331 279 L349 277 L356 290 L345 295 L321 294Z','#B29B83'),
  shaded('M393 277 L411 275 L419 290 L408 293 L389 292Z','#B29B83'),
  shaded('M375 132 Q386 125 409 141 L434 152 L478 155 L484 164 L432 161 L406 159 L385 151Z','#ECD8BF'),
  head(401,105,.97),
  faint('M366 141 Q376 148 380 162 M355 173 L374 184 M341 202 L374 211 M347 235 L365 239 M390 235 L402 248 M339 255 L339 271')
 ].join('');
 return base(standing+bent+arrow('M260 119Q242 166 257 209')+arrow('M280 210Q295 167 282 128'),name);
}
function pushups(name){
 // Side-view poses stacked vertically: straight body line and elbow flexion.
 const stance=(low)=>{
  const k=low?132:0;
  const y=low?132:0;
  const torso=low?'M112 62 L266 77 L331 81 L365 93 L364 114 L329 108 L264 96 L111 82Z':'M112 64 L267 63 L332 55 L366 61 L365 80 L328 78 L265 80 L110 80Z';
  return `<g transform="translate(20 ${y}) scale(1 .71)">`+
   shaded(torso)+shaded(low?'M108 61 L142 64 L144 82 L109 80Z':'M109 63 L143 62 L143 81 L109 80Z','#B5A08B')+
   path(low?'M111 77 L72 102 L28 135 M109 82 L69 109 L28 135':'M111 73 L69 104 L29 129 M110 80 L69 108 L29 129',3.8)+
   path(low?'M328 89 L324 127 L346 161 M354 95 L371 128 L389 161':'M327 72 L341 114 L341 158 M351 72 L375 115 L374 158',4.3)+
   head(395,low?98:68,1.04)+
   faint(low?'M211 73 Q246 81 264 80 M283 83 L320 90 M335 109 L335 136':'M209 70 Q244 74 267 69 M284 69 L319 67 M339 82 L349 112')+
   path(low?'M18 137 L41 137 M333 163 L357 163 M379 163 L401 163':'M18 130 L43 130 M329 161 L356 161 M364 161 L394 161',2.4)+'</g>';
 };
 return base(stance(false)+stance(true)+arrow('M471 104 Q499 167 471 220'),name);
}
function plank(name){
 return base(
 shaded('M107 173 Q169 149 248 130 Q311 115 358 125 L390 120 L400 144 L360 147 Q315 141 257 158 L184 184 L109 196Z')+
 shaded('M179 152 L251 129 L267 157 L202 179Z','#B29E88')+
 head(425,127,1.23)+
 path('M369 136 L366 195 L348 256 M385 135 L394 182 L428 253',4.5)+
 path('M111 183 L64 210 L26 252 M106 190 L68 220 L28 254',4.3)+
 shaded('M333 253 L362 252 L371 268 L362 275 L325 273Z','#B7A087')+
 shaded('M414 251 L444 250 L454 261 L446 270 L412 269Z','#B7A087')+
 shaded('M16 250 L34 247 L44 259 L39 264 L14 263Z','#B7A087')+
 faint('M204 162 Q239 147 270 141 M282 138 Q309 130 338 129 M380 149 L378 170 M65 216 L45 235')+
 `<path d="M27 236 Q183 169 394 122" stroke="${guide}" stroke-width="2.3" fill="none" stroke-dasharray="7 7"/>`+
 [ [109,188],[260,155],[381,141] ].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="5.5" fill="${guide}"/>`).join('')
 ,name);
}
export function illustration13(pose,name,lang='en'){
 if(pose==='squat')return squats(name);
 if(pose==='pushup')return pushups(name);
 if(pose==='plank')return plank(name);
 return previous(pose,name,lang).replaceAll('#eaf2f9','#654B37').replaceAll('#b8c9d7','#90715B').replaceAll('#a7f86d','#d2bea6').replaceAll('#7894a8','#a38e78');
}
export function isStudy(pose){return pose==='squat'||pose==='pushup'||pose==='plank';}
