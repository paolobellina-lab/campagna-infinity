
(function(){
"use strict";
const NODI=[{"id": "min", "n": "Minerario", "x": 1558, "y": 309, "t": "inst", "pr": 15, "dr": 0, "sc": "Provisioning"}, {"id": "raff", "n": "Raffineria Idrica", "x": 97, "y": 442, "t": "inst", "pr": 15, "dr": 0, "sc": "Provisioning"}, {"id": "hub", "n": "Hub", "x": 792, "y": 565, "t": "inst", "pr": 5, "dr": 2, "sc": "Zone of Interest"}, {"id": "qgp", "n": "QG PanOceania", "x": 202, "y": 624, "t": "hq", "pr": 20, "dr": 0, "sc": "Critical Intervention"}, {"id": "qgn", "n": "QG Nomadi", "x": 1408, "y": 712, "t": "hq", "pr": 20, "dr": 0, "sc": "Critical Intervention"}, {"id": "lab", "n": "Laboratorio Xeno", "x": 801, "y": 368, "t": "inst", "pr": 0, "dr": 4, "sc": "Corporate Appropriation"}, {"id": "porto", "n": "Spazioporto Tharsis", "x": 1012, "y": 776, "t": "inst", "pr": 10, "dr": 3, "sc": "Last Launch"}, {"id": "acc", "n": "Accademia Militare", "x": 1082, "y": 678, "t": "inst", "pr": 5, "dr": 1, "sc": "Akial Interference"}, {"id": "osp", "n": "Ospedale da Campo", "x": 1540, "y": 633, "t": "inst", "pr": 5, "dr": 1, "sc": "Evacuation"}, {"id": "fab", "n": "Fabbrica Armamenti", "x": 343, "y": 761, "t": "inst", "pr": 5, "dr": 1, "sc": "Evacuation"}, {"id": "avo", "n": "Avamposto Ovest", "x": 1311, "y": 574, "t": "inst", "pr": 10, "dr": 0, "sc": "Battleground"}, {"id": "ave", "n": "Avamposto Est", "x": 114, "y": 786, "t": "inst", "pr": 10, "dr": 0, "sc": "Battleground"}, {"id": "tr1", "n": "Cava Esausta", "x": 1364, "y": 368, "t": "tr", "pr": 0, "dr": 0, "sc": "Annihilation"}, {"id": "tr2", "n": "Serre Idroponiche", "x": 361, "y": 260, "t": "tr", "pr": 0, "dr": 0, "sc": "Annihilation"}, {"id": "vo", "n": "Viadotto Ovest", "x": 1223, "y": 466, "t": "tr", "pr": 0, "dr": 0, "sc": "Crossing Lines"}, {"id": "ve", "n": "Viadotto Est", "x": 396, "y": 520, "t": "tr", "pr": 0, "dr": 0, "sc": "Crossing Lines"}, {"id": "tun", "n": "Tunnel di Servizio", "x": 933, "y": 643, "t": "tr", "pr": 0, "dr": 0, "sc": "B-Pong"}, {"id": "tr4", "n": "Depuratore", "x": 871, "y": 231, "t": "tr", "pr": 0, "dr": 0, "sc": "Hardlock"}, {"id": "tr3", "n": "Svincolo 7", "x": 704, "y": 270, "t": "tr", "pr": 0, "dr": 0, "sc": "Uplink Center"}, {"id": "tr5", "n": "Deposito Rotabili", "x": 466, "y": 270, "t": "tr", "pr": 0, "dr": 0, "sc": "Hardlock"}, {"id": "nido-o", "n": "Nido ovest", "x": 1241, "y": 241, "t": "ost", "pr": 0, "dr": 0, "sc": "Outbreak"}, {"id": "nido-e", "n": "Nido est", "x": 220, "y": 98, "t": "ost", "pr": 0, "dr": 0, "sc": "Outbreak"}, {"id": "nido-madre", "n": "Nido Madre", "x": 836, "y": 859, "t": "ost", "pr": 0, "dr": 0, "sc": "Outbreak"}, {"id": "milizia", "n": "QG Milizia", "x": 625, "y": 142, "t": "ost", "pr": 0, "dr": 0, "sc": "Cutthroat"}];
const KEY='tabellone.ashkar.v1';
let S=null, db=null, selId=null, puoScrivere=true, unsub=null, mioEcho=0;
const $=s=>document.querySelector(s);
const el=(t,c,x)=>{const e=document.createElement(t); if(c)e.className=c; if(x!=null)e.textContent=x; return e};
function vuoto(){
  const terr={}; NODI.forEach(n=>terr[n.id]= n.id==='qgn'?'nomadi':(n.id==='qgp'?'panoceania':(n.id==='avo'?'nomadi':(n.id==='ave'?'panoceania':null))));
  return {v:1,turno:1,minaccia:0,pve:true,terr,log:[]};
}
async function carica(){
  try{ db=await window.claude?.use?.('db') }catch(e){ db=null }
  if(db){ try{ const d=await db.doc('campagna/pubblico').get(); const v=d&&d.exists?d.data():null; if(v&&v.v===1) return v }catch(e){} }
  try{ const r=localStorage.getItem(KEY); if(r) return JSON.parse(r) }catch(e){}
  return vuoto();
}
let tt=null;
function salva(){
  try{ localStorage.setItem(KEY,JSON.stringify(S)) }catch(e){}
  try{ localStorage.setItem('campagna_pubblico',JSON.stringify(pubblico())) }catch(e){}
  if(!db||!puoScrivere) return;
  clearTimeout(tt);
  tt=setTimeout(()=>{ mioEcho=Date.now();
    db.doc('campagna/pubblico').set(S).catch(e=>{ stato('Scrittura rifiutata: '+(e&&e.code||'errore')+'. Serve il livello Contributor.') }) },600);
}
const pubblico=()=>({v:1,turno:S.turno,minaccia:S.minaccia,terr:S.terr});
const conta=f=>NODI.filter(n=>n.t!=='ost'&&S.terr[n.id]===f).length;
function log(t){ S.log.unshift({t:S.turno,txt:t}); if(S.log.length>250)S.log.pop() }

function anelli(){
  const svg=document.querySelector('.geo svg'); if(!svg) return;
  let g=document.getElementById('ctrl');
  if(!g){ g=document.createElementNS('http://www.w3.org/2000/svg','g'); g.id='ctrl'; svg.appendChild(g) }
  g.textContent='';
  NODI.forEach(n=>{
    const c=S.terr[n.id]; if(!c) return;
    const k=document.createElementNS('http://www.w3.org/2000/svg','circle');
    k.setAttribute('cx',n.x); k.setAttribute('cy',n.y);
    k.setAttribute('r', n.t==='hq'?26:(n.t==='tr'?15:21));
    k.setAttribute('class','ctrlring');
    k.setAttribute('stroke', c==='nomadi'?'#ffa63c':'#4aa8ff');
    g.appendChild(k);
  });
}
function head(){
  $('#p-turno').textContent=S.turno; $('#p-min').textContent=S.minaccia;
  $('#p-nom').textContent=conta('nomadi'); $('#p-pan').textContent=conta('panoceania');
}
function scheda(){
  const n=NODI.find(x=>x.id===selId);
  if(!n){ $('#r-name').textContent='—'; $('#r-kind').textContent='nessun nodo selezionato'; $('#r-data').textContent=''; return }
  $('#r-name').textContent=n.n;
  const c=S.terr[n.id];
  $('#r-kind').textContent={hq:'quartier generale',inst:'installazione',tr:'nodo di transito',ost:'obiettivo ostile'}[n.t];
  const dl=$('#r-data'); dl.textContent='';
  [['Rendita',(n.pr?n.pr+' PR':'')+(n.dr?(n.pr?' · ':'')+n.dr+' DR':'')||'nessuna'],
   ['Scenario ITS17', n.sc||'—'],
   ['Controllo', c==='nomadi'?'Nomadi':(c==='panoceania'?'PanOceania':'neutrale')]].forEach(([k,v])=>{
    dl.appendChild(el('dt',null,k)); dl.appendChild(el('dd',null,v));
  });
  document.querySelectorAll('#r-seg button').forEach(b=>b.classList.toggle('on',(b.dataset.c||null)===(c||null)));
  $('#r-seg').style.display = n.t==='ost'?'none':'flex';
}
function tabTerr(){
  const c=$('#tab-terr'); c.innerHTML='';
  const t=el('table'), tb=el('tbody');
  NODI.filter(n=>n.t!=='ost').forEach(n=>{
    const tr=el('tr'); tr.appendChild(el('td',null,n.n));
    const v=S.terr[n.id];
    const td=el('td','n',v==='nomadi'?'Nomadi':(v==='panoceania'?'PanOceania':'—'));
    td.style.color = v==='nomadi'?'var(--am)':(v==='panoceania'?'var(--bl)':'var(--mut)');
    tr.appendChild(td); tb.appendChild(tr);
  });
  t.appendChild(tb); c.appendChild(t);
}
function registro(){
  const L=$('#log'); L.innerHTML='';
  if(!S.log.length) L.appendChild(el('div',null,'Nessuna partita registrata.'));
  S.log.forEach(r=>{const d=el('div'); d.appendChild(el('b',null,'T'+r.t+' ')); d.appendChild(document.createTextNode(r.txt)); L.appendChild(d)});
}
function render(){ head(); anelli(); scheda(); tabTerr(); registro(); }
function stato(txt){ const e=document.getElementById('p-net'); if(e) e.textContent=txt }
function ascolta(){
  if(!db||unsub) return;
  try{
    unsub=db.doc('campagna/pubblico').onSnapshot(snap=>{
      const v=snap&&snap.exists?snap.data():null;
      if(!v||v.v!==1) return;
      if(Date.now()-mioEcho<1200) return;
      S=v; render(); stato('in rete · aggiornato');
    }, e=>{ stato('rete interrotta: '+(e&&e.code||'errore')) });
  }catch(e){}
}
function bloccaSeLettore(){
  if(puoScrivere) return;
  document.querySelectorAll('#r-seg button,#seg-pve button,#btn-reg,#btn-turno').forEach(b=>b.disabled=true);
  stato('sola lettura');
}

document.addEventListener('click',e=>{
  const g=e.target.closest('.geo .node'); if(!g) return;
  selId=g.dataset.id; scheda();
  document.querySelector('.readout').scrollIntoView({block:'nearest'});
});
document.querySelectorAll('#r-seg button').forEach(b=>b.onclick=()=>{
  if(!selId) return; const n=NODI.find(x=>x.id===selId); if(!n||n.t==='ost') return;
  S.terr[selId]=b.dataset.c||null;
  log(n.n+': controllo a '+(b.dataset.c==='nomadi'?'Nomadi':(b.dataset.c==='panoceania'?'PanOceania':'nessuno'))+'.');
  salva(); render();
});
document.querySelectorAll('#seg-pve button').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('#seg-pve button').forEach(x=>x.classList.toggle('on',x===b));
  S.pve=b.dataset.p==='1'; salva();
});
$('#btn-reg').onclick=()=>{
  const id=$('#m-nodo').value, tipo=$('#m-tipo').value, v=$('#m-vinc').value;
  const n=NODI.find(x=>x.id===id); const out=[];
  if(v!=='neutrali' && n.t!=='ost' && tipo!=='int'){ S.terr[id]=v; out.push('nodo a '+(v==='nomadi'?'Nomadi':'PanOceania')) }
  if(tipo==='int'&&v!=='neutrali'){ out.push('intercettazione: il nodo resta neutrale') }
  if(n.t==='ost'&&v!=='neutrali'){
    if(id==='nido-madre'){ S.minaccia=Math.max(0,S.minaccia-2); out.push('Minaccia −2') }
    else if(id.startsWith('nido')){ S.minaccia=Math.max(0,S.minaccia-1); out.push('Minaccia −1') }
    else out.push('milizia decapitata');
  }
  if(tipo==='pve') S.pve=true;
  log('Partita a '+n.n+' ('+{pve:'PvE',pvp:'PvP',int:'intercettazione',patt:'pattugliamento'}[tipo]+'): '
      +(v==='neutrali'?'nessun vincitore':'vince '+(v==='nomadi'?'Nomadi':'PanOceania'))+(out.length?' — '+out.join(', '):'')+'.');
  $('#m-msg').textContent='Registrata. '+out.join(', ');
  salva(); render();
};
$('#btn-turno').onclick=()=>{
  if(!S.pve){ S.minaccia=Math.min(3,S.minaccia+1); log('Nessuna missione PvE: Minaccia a '+S.minaccia+'.') }
  S.turno++; S.pve=true;
  document.querySelectorAll('#seg-pve button').forEach(x=>x.classList.toggle('on',x.dataset.p==='1'));
  log('Inizio del turno '+S.turno+'.'); salva(); render();
};
$('#btn-sync').onclick=async()=>{
  const txt=JSON.stringify(pubblico());
  try{ localStorage.setItem('campagna_pubblico',txt) }catch(e){}
  try{ await navigator.clipboard.writeText(txt); alert('Stato pubblico copiato. Incollalo nella scheda Sincronizza delle plance.') }
  catch(e){ prompt('Copia questo testo nelle plance:',txt) }
};
carica().then(async d=>{
  S=d||vuoto();
  if(db){
    stato('in rete');
    try{ const u=await window.claude?.use?.('user'); const w=u?await u.can('data.write'):null; if(w===false) puoScrivere=false }catch(e){}
    ascolta(); bloccaSeLettore();
  }
  const sel=$('#m-nodo'); NODI.forEach(n=>{const o=el('option',null,n.n+(n.t==='ost'?' (ostile)':'')); o.value=n.id; sel.appendChild(o)});
  render();
});
})();
