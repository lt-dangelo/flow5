// Flow5 final recovery illustration. Original SVG, no third-party dependencies.
const ink='#654B37',skin='#EDDAC2',soft='#A68C76',guide='#82A76F';
const shape=(d,color=skin)=>`<path d="${d}" fill="${color}" stroke="${ink}" stroke-width="2.2" stroke-linejoin="round"/>`;
const line=(d,w=1.4,color=ink)=>`<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const hatch=lines=>lines.map(d=>line(d,.9,soft)).join('');
export function recoveryIllustration(lang='en'){
 const label=lang==='de'?'Erholung: ruhig stehen und atmen':'Recovery: stand at ease and breathe';
 const body=[
  shape('M260 81 Q245 82 240 98 L231 145 Q229 161 238 177 L255 190 L288 186 Q306 168 300 145 L300 100 Q295 84 281 81Z'),
  shape('M236 170 Q257 178 298 169 L299 192 L235 193Z','#AB947D'),
  shape('M241 192 Q234 226 230 276 L247 277 L263 218 L276 275 L296 277 Q292 220 289 193Z'),
  shape('M229 272 L250 274 L257 286 L252 291 L217 291Z','#B6A087'),
  shape('M272 274 L298 272 L310 287 L302 292 L270 291Z','#B6A087'),
  shape('M242 100 Q224 106 218 124 L205 184 L216 201 L230 191 L236 155 L253 115Z'),
  shape('M295 102 Q311 106 318 129 L331 181 L320 202 L304 192 L300 155 L282 116Z'),
  shape('M257 43 Q263 30 281 34 Q299 39 299 58 Q299 76 283 85 L265 81 Q251 72 254 56Z'),
  shape('M254 45 Q261 25 282 30 Q295 32 300 49 Q287 43 280 39 Q273 46 254 49Z','#9B806C'),
  line('M269 55 Q275 52 278 56 M290 54L296 54 M280 62Q285 64 290 63 M275 72Q282 75 287 72',1.1),
  line('M245 110Q258 118 267 116 M272 116Q284 119 292 109 M248 130Q269 138 289 131 M249 147Q268 156 291 147 M252 164Q267 170 285 164',1.35),
  line('M232 113Q222 134 217 152 M303 115Q312 136 315 157 M240 215Q239 240 236 252 M283 215Q289 240 290 252',1.25),
  hatch(['M244 119l7 5','M251 122l7 5','M261 123l6 4','M281 123l7 4','M244 140l7 4','M253 142l7 4','M263 144l7 4','M278 142l7 4',
    'M241 161l8 4','M251 163l8 4','M282 163l8 4','M230 138l5 4','M226 149l5 4','M309 145l5 4','M311 157l5 4',
    'M239 207l6 4','M244 218l6 4','M281 210l6 4','M283 222l6 4','M234 248l5 4','M288 245l6 4'])
 ].join('');
 const circ='<circle cx="268" cy="152" r="123" fill="none" stroke="#BCA58B" stroke-width="1.2" opacity=".53"/>'+
  '<circle cx="268" cy="152" r="99" fill="none" stroke="#C6B197" stroke-width="1.1" opacity=".30" stroke-dasharray="3 8"/>';
 const breath=`<path d="M193 118Q181 143 199 164 M340 118Q353 143 336 164" stroke="${guide}" stroke-width="2.4" stroke-dasharray="4 6" stroke-linecap="round" fill="none"/><path d="M194 155L199 164L208 160 M342 155L336 164L327 160" stroke="${guide}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
 return `<svg class="study-svg study-recovery" viewBox="0 0 540 322" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}"><path d="M45 295H497" stroke="${ink}" stroke-width="1.2" opacity=".27"/>${circ}${body}${breath}</svg>`;
}
