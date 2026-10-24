const range=(start,end,step)=>Array.from({length:Math.floor((end-start)/step)+1},(_,i)=>start+i*step);
export const SETTING_OPTIONS={
 workSec:[...range(5,120,5),...range(130,300,10),...range(330,600,30)],
 restSec:[...range(0,120,5),...range(130,300,10)],
 rounds:range(1,20,1)
};
export function optionsFor(field,current){
 const base=SETTING_OPTIONS[field];
 if(!base)return [];
 return base.includes(current)?base:[...base,current].sort((a,b)=>a-b);
}
export function stepSetting(field,current,direction){
 const values=optionsFor(field,current),index=values.indexOf(current);
 return values[Math.max(0,Math.min(values.length-1,index+(direction>0?1:-1)))];
}
