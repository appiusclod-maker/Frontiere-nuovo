'use strict';
(async()=>{
  const appParts=['./gparts-0.txt','./gparts-1.txt','./gparts-2.txt','./gparts-3.txt','./gparts-4.txt','./gparts-5.txt'];
  async function gunzipB64(b64){
    const bytes=Uint8Array.from(atob(b64.trim()),c=>c.charCodeAt(0));
    return new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).text();
  }
  try{
    const [appB64,cssB64]=await Promise.all([
      Promise.all(appParts.map(p=>fetch(p).then(r=>{if(!r.ok)throw new Error(p+' '+r.status);return r.text()}))).then(x=>x.join('')),
      fetch('./styles-b64.txt').then(r=>{if(!r.ok)throw new Error('styles '+r.status);return r.text()})
    ]);
    const [appText,cssText]=await Promise.all([gunzipB64(appB64),gunzipB64(cssB64)]);
    const style=document.createElement('style');style.textContent=cssText;document.head.appendChild(style);
    (0,eval)(appText);
  }catch(err){
    console.error(err);
    document.body.innerHTML='<main style="font-family:system-ui;padding:24px"><h1>Frontiere</h1><p>Errore nel caricamento dell’app. Ricarica la pagina.</p><pre>'+String(err)+'</pre></main>';
  }
})();
