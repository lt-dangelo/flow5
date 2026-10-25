// Preview-only diagnostics, enabled by ?debugAnalytics=1. Never bypasses consent.
(function(){
  'use strict';
  const query=new URLSearchParams(location.search);
  if(query.get('debugAnalytics')!=='1'||!/\/preview\/v1\.3\//.test(location.pathname))return;
  const pane=document.createElement('aside');
  pane.id='analytics-debug';
  pane.setAttribute('role','region');
  pane.setAttribute('aria-label','Umami diagnostics');
  pane.style.cssText='position:fixed;z-index:11000;inset:auto 10px 10px auto;width:min(420px,calc(100vw - 20px));max-height:70vh;overflow:auto;padding:15px;background:#fffef6;color:#17291f;border:2px solid #39785c;border-radius:12px;box-shadow:0 8px 28px #0005;font:13px/1.5 system-ui,sans-serif';
  const title=document.createElement('strong');
  title.textContent='Umami diagnostics — preview only';
  title.style.cssText='display:block;font-size:15px;margin-bottom:8px';
  const status=document.createElement('pre');
  status.style.cssText='white-space:pre-wrap;overflow-wrap:anywhere;margin:0;padding:8px;background:#edf1e8;border-radius:6px;font:12px/1.65 monospace';
  const actions=document.createElement('div');
  actions.style.cssText='display:flex;flex-wrap:wrap;gap:8px;margin-top:10px';
  const refresh=document.createElement('button');refresh.textContent='Refresh status';
  const test=document.createElement('button');test.textContent='Send test event';
  const note=document.createElement('p');note.style.cssText='margin:10px 0 0';
  note.textContent='Test events appear as preview_diagnostic in Umami. This panel does not transmit anything until you consent and press Send test event.';
  for(const b of [refresh,test])b.style.cssText='padding:7px 10px;background:#e8efe6;border:1px solid #9cac97;border-radius:6px;cursor:pointer;color:#17291f';
  actions.append(refresh,test);pane.append(title,status,actions,note);document.body.append(pane);
  let latest='not attempted';
  const read=()=>{try{return localStorage.getItem('pick5go-analytics-consent-v1')}catch{return 'storage unavailable'}};
  const update=()=>{
    const script=document.querySelector('script[src="https://cloud.umami.is/script.js"]');
    const consent=read();
    const ready=typeof window.umami?.track==='function';
    status.textContent=[
      'Site: '+location.hostname,
      'Path: '+location.pathname,
      'Consent saved: '+(consent??'not chosen'),
      'Umami script inserted: '+(script?'YES':'NO'),
      'Tracker function ready: '+(ready?'YES':'NO'),
      'Script load state: '+(script?.dataset.pick5goState??(script?'pending':'not requested')),
      'Test event: '+latest
    ].join('\n');
    test.disabled=consent!=='yes'||!ready;
    test.style.opacity=test.disabled?'0.45':'1';
  };
  refresh.addEventListener('click',update);
  test.addEventListener('click',()=>{
    if(read()!=='yes'||typeof window.umami?.track!=='function'){latest='unavailable';update();return;}
    latest='sending...';update();
    try{
      Promise.resolve(window.umami.track('preview_diagnostic',{environment:'preview'}))
        .then(()=>{latest='tracker call returned (verify in Umami)';update();})
        .catch(err=>{latest='tracker call failed: '+String(err?.message||err);update();});
    }catch(err){latest='tracker threw: '+String(err?.message||err);update();}
  });
  for(const e of ['pick5go:analyticsloading','pick5go:analyticsready','pick5go:analyticsunavailable','pick5go:consentchange']){
    window.addEventListener(e,update);
  }
  update();
})();
