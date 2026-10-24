// Lokal erzeugte, schematische SVG-Illustrationen; keine externen Bilder oder Downloads.
const P = {
 squat:{head:[182,50], paths:['M182 80 L169 137 L148 158','M182 91 L144 111 L159 133','M182 91 L215 113 L202 137','M148 158 L112 184 L104 210','M148 158 L188 181 L194 210','M104 210 L83 210','M194 210 L219 210']},
 lunge:{head:[181,47],paths:['M181 77 L172 142','M180 92 L151 129 L174 137','M180 92 L208 128 L197 141','M172 142 L208 173 L213 207','M172 142 L128 170 L102 206','M213 207 L239 207','M102 206 L78 206']},
 march:{head:[166,44],paths:['M166 73 L169 144','M165 87 L132 115 L135 140','M168 87 L201 113 L200 139','M169 144 L161 184 L160 216','M169 144 L207 161 L222 183','M160 216 L141 216','M222 183 L245 182']},
 calf:{head:[178,42],paths:['M178 70 L179 145','M177 85 L151 123 L153 150','M179 85 L205 121 L204 148','M179 145 L158 205 L160 218','M179 145 L203 205 L205 218','M160 218 L146 212','M205 218 L219 211']},
 jumping:{head:[180,47],paths:['M180 76 L180 143','M179 88 L129 72 L101 40','M180 89 L232 72 L258 40','M180 143 L132 195 L116 216','M180 143 L225 195 L241 216']},
 wall:{head:[180,55],paths:['M180 84 L143 151','M170 96 L208 105 L255 107','M170 96 L208 123 L255 128','M143 151 L124 210 L110 218','M143 151 L169 207 L181 218']},
 wallsit:{head:[137,57],paths:['M137 86 L137 147','M137 98 L166 134 L171 150','M137 99 L115 133 L110 151','M137 147 L185 147 L205 200','M137 147 L182 170 L183 212','M183 212 L211 212','M205 200 L229 200']},
 plank:{head:[258,123],paths:['M239 135 L150 143 L89 148','M229 139 L212 176 L200 209','M212 176 L234 207','M89 148 L69 193 L48 204']},
 pushup:{head:[263,121],paths:['M242 137 L151 147 L81 161','M226 138 L235 167 L222 209','M242 139 L256 177 L242 210','M81 161 L52 207 L34 210']},
 mountain:{head:[266,100],paths:['M242 117 L161 143 L83 162','M235 123 L239 178 L245 210','M216 126 L215 177 L200 208','M161 143 L150 183 L182 210','M83 162 L55 210 L35 213']},
 shouldertap:{head:[258,112],paths:['M239 127 L153 145 L88 157','M234 130 L218 180 L222 212','M240 129 L198 121 L183 143','M88 157 L61 209 L42 212']},
 bear:{head:[252,103],paths:['M232 120 L176 137 L119 137','M232 120 L238 177 L244 212','M198 133 L189 181 L185 211','M119 137 L105 178 L101 197','M119 137 L151 172 L155 197']},
 pike:{head:[252,148],paths:['M237 148 L185 70 L119 147','M236 150 L250 189 L244 213','M232 152 L215 190 L210 213','M119 147 L89 211 L67 213']},
 birddog:{head:[245,105],paths:['M226 116 L163 133 L108 133','M207 122 L219 171 L218 208','M167 134 L159 174 L156 211','M108 133 L65 121 L40 114','M108 133 L119 184 L120 209']},
 sideplank:{head:[255,92],paths:['M240 106 L175 118 L104 137','M219 117 L231 169 L219 209','M104 137 L69 184 L49 211','M216 117 L218 69 L214 42']},
 bridge:{head:[274,172],paths:['M256 180 L227 179 L178 120 L133 150','M133 150 L102 207 L84 211','M178 120 L149 207 L128 212','M250 181 L227 207 L213 210','M222 181 L201 207 L187 210']},
 deadbug:{head:[269,182],paths:['M248 184 L189 184 L131 186','M219 183 L212 113 L184 81','M205 183 L232 124 L246 96','M153 186 L129 143 L100 142','M153 186 L113 210 L77 210']},
 bicycle:{head:[273,177],paths:['M248 181 L183 176 L129 185','M219 180 L190 123 L152 108','M218 177 L238 151 L246 127','M129 185 L94 153 L77 160','M129 185 L102 211 L65 210']},
 heeltouch:{head:[271,180],paths:['M248 185 L184 180 L136 186','M213 183 L232 205 L250 209','M186 182 L174 201 L150 209','M136 186 L112 155 L91 158','M136 186 L95 208 L70 210']},
 superman:{head:[263,181],paths:['M243 185 L166 184 L105 187','M216 183 L186 153 L141 142','M229 183 L201 164 L167 156','M105 187 L61 170 L38 163','M105 187 L55 204 L31 198']},
};
export function illustration(pose='squat', label='Exercise', lang='en') {
 const p=P[pose]||P.squat;
 const paths=p.paths.map((d,i)=>`<path d="${d}" stroke="${i===0?'#eaf2f9':'#b8c9d7'}" stroke-width="${i===0?19:12}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`).join('');
 const wall=pose==='wall'||pose==='wallsit' ? '<path d="M278 24 V218" stroke="#62788b" stroke-width="3" stroke-dasharray="7 7" opacity=".45"/>':'';
 return `<svg class="pose-svg" viewBox="0 0 360 238" role="img" aria-label="${lang==='de'?'Schematische Illustration':'Exercise illustration'}: ${label}" xmlns="http://www.w3.org/2000/svg"><circle cx="178" cy="112" r="104" fill="#a7f86d" opacity=".07"/><circle cx="178" cy="112" r="72" fill="none" stroke="#a7f86d" stroke-width="1" opacity=".11"/>${wall}<path d="M41 218 H320" stroke="#7894a8" stroke-width="2" opacity=".26" stroke-linecap="round"/>${paths}<circle cx="${p.head[0]}" cy="${p.head[1]}" r="19" fill="#eaf2f9"/><circle cx="${p.head[0]+6}" cy="${p.head[1]-5}" r="3" fill="#344854" opacity=".65"/></svg>`;
}
