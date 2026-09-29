
(function(){
"use strict";
const TERR=[
 {id:'qgn',n:'QG Nomadi',t:'hq',pr:20,dr:0,di:'nomadi'},
 {id:'qgp',n:'QG PanOceania',t:'hq',pr:20,dr:0,di:'panoceania'},
 {id:'avo',n:'Avamposto Ovest',t:'inst',pr:10,dr:0,b:['inf','add'],di:'nomadi'},
 {id:'ave',n:'Avamposto Est',t:'inst',pr:10,dr:0,b:['inf','add'],di:'panoceania'},
 {id:'min',n:'Minerario',t:'inst',pr:15,dr:0},
 {id:'raff',n:'Raffineria Idrica',t:'inst',pr:15,dr:0},
 {id:'lab',n:'Laboratorio Xeno',t:'inst',pr:0,dr:4},
 {id:'porto',n:'Spazioporto Tharsis',t:'inst',pr:10,dr:3},
 {id:'hub',n:'Hub',t:'inst',pr:5,dr:2},
 {id:'osp',n:'Ospedale da Campo',t:'inst',pr:5,dr:1,b:['inf','perdite']},
 {id:'acc',n:'Accademia Militare',t:'inst',pr:5,dr:1,b:['add']},
 {id:'fab',n:'Fabbrica Armamenti',t:'inst',pr:5,dr:1,b:['hw']},
 {id:'tr1',n:'Cava Esausta',t:'tr'},{id:'tr2',n:'Serre Idroponiche',t:'tr'},
 {id:'tr3',n:'Svincolo 7',t:'tr'},{id:'tr4',n:'Depuratore',t:'tr'},
 {id:'tr5',n:'Deposito Rotabili',t:'tr'},{id:'vo',n:'Viadotto Ovest',t:'tr'},
 {id:'ve',n:'Viadotto Est',t:'tr'},{id:'tun',n:'Tunnel di Servizio',t:'tr'},
 {id:'nido-o',n:'Nido ovest',t:'ost'},{id:'nido-e',n:'Nido est',t:'ost'},
 {id:'nido-m',n:'Nido Madre',t:'ost'},{id:'mil',n:'QG Milizia',t:'ost'}
];
const TECH=[
 {id:'sdc',n:'Supporto da Campo',dr:2,p:[],c:'#6fe0a8',cls:['Medico-Tecnico'],ab:['Dottore','Paramedico','Ingegnere']},
 {id:'ott',n:'Ottica Avanzata',dr:3,p:[],c:'#63d2ea',cls:['Ottica'],ab:['Visore Multispettrale L1','X-Visor']},
 {id:'ge',n:'Guerra Elettronica',dr:3,p:[],c:'#7fb8ff',cls:['Elettronica'],ab:['Hacker','Ripetitore']},
 {id:'bal',n:'Balistica Pesante',dr:4,p:[],c:'#ff9a6e',cls:['Supporto Pesante'],ab:[]},
 {id:'sim',n:'Simulatore Tattico',dr:4,p:[],c:'#c9a3ff',cls:[],ab:[],eff:'+1 slot addestramento'},
 {id:'dep',n:'Deposito Logistico',dr:4,p:[],c:'#c9a3ff',cls:[],ab:[],eff:'+5 PR a fine turno'},
 {id:'tra',n:'Traumatologia',dr:4,p:['sdc'],c:'#6fe0a8',cls:[],ab:[],eff:'+1 infermeria, cure a 8 PR'},
 {id:'ana',n:'Analisi Spettrale',dr:5,p:['ott'],c:'#63d2ea',cls:[],ab:['Visore Multispettrale L2','Visore Multispettrale L3']},
 {id:'occ',n:'Occultamento Attivo',dr:5,p:['ott','ge'],c:'#63d2ea',cls:['Tute'],ab:['Mimetismo','Infiltrazione']},
 {id:'con',n:'Contromisure',dr:4,p:['ge'],c:'#7fb8ff',cls:[],ab:['Hacking Device Plus','Deployable Repeater']},
 {id:'bai',n:'Baia Robotica',dr:5,p:['ge'],c:'#c9a3ff',cls:[],ab:[],unit:'REM'},
 {id:'mp',n:'Munizioni Perforanti',dr:3,p:['bal'],c:'#ffc46a',cls:[],ab:[],mun:'AP, Shock'},
 {id:'tp',n:'Tiro di Precisione',dr:4,p:['bal'],c:'#ff9a6e',cls:['Tiratore Scelto'],ab:[]},
 {id:'art',n:'Artiglieria Portatile',dr:5,p:['bal'],c:'#ff9a6e',cls:['Artiglieria'],ab:[]},
 {id:'ter',n:'Termo-ottica',dr:7,p:['occ','ana'],c:'#63d2ea',cls:[],ab:['TO Camouflage','Salto di Combattimento']},
 {id:'aes',n:'Armi Esotiche',dr:7,p:['art','ana'],c:'#ff9a6e',cls:['Guerra Ravvicinata'],ab:[]},
 {id:'mpe',n:'Munizioni Pesanti',dr:5,p:['mp','art'],c:'#ffc46a',cls:[],ab:[],mun:'DA, T2, E/M'},
 {id:'off',n:'Officina Corazzata',dr:8,p:['bai'],c:'#c9a3ff',cls:[],ab:[],unit:'HI'},
 {id:'mes',n:'Munizioni Esotiche',dr:8,p:['mpe','aes'],c:'#ffc46a',cls:[],ab:[],mun:'EXP, Viral, Plasma, K1'},
 {id:'han',n:'Hangar',dr:12,p:['off','art'],c:'#c9a3ff',cls:[],ab:[],unit:'TAG'}
];
const CLASSI=[['LI','Fanteria Leggera',null],['MI','Fanteria Media',null],['SK','Skirmisher',null],
 ['WB','Guerriero',null],['REM','Remote',{u:'REM',n:'Baia Robotica'}],
 ['HI','Fanteria Pesante',{u:'HI',n:'Officina Corazzata'}],['TAG','TAG',{u:'TAG',n:'Hangar'}]];
const BASE=['Armeria Base'];
const SOFTWARE=['Sesto Senso','Coraggio','Arti Marziali L1','Arti Marziali L2','Cinematica','Fuoco di Copertura',
 'Doppia Arma','Stealth','Terreno (Montano)','Terreno (Acquatico)','Terreno (Giungla)','Terreno (Desertico)','Specialista Operativo'];
const MAL=[['bs','BS'],['wip','WIP'],['ph','PH'],['arm','ARM'],['sal','Salv.']];
const STADI=['Nessuna attività neutrale: profili base, armi CC e Sagome.',"Un Impetuoso oltre l'AVA, armi da tiro base.",
 'Munizioni Shock e Viral, una Sagoma Grande.','Profili pesanti in campo. Il mondo sta cedendo.'];
const KEY='comando.campagna.v2';
let S=null, db=null;
const $=s=>document.querySelector(s);
const el=(t,c,x)=>{const e=document.createElement(t); if(c)e.className=c; if(x!=null)e.textContent=x; return e};

function vuoto(io,nome){
  const terr={}; TERR.forEach(t=>terr[t.id]= t.di? (t.di===io?'mine':'avv') : null);
  return {v:2,io,nome:nome||'',turno:1,minaccia:0,pve:true,pr:200,dr:0,tech:[],terr,truppe:[],armeria:[],log:[],seq:1};
}
const nid=()=>'x'+(S.seq++).toString(36)+Date.now().toString(36).slice(-3);
async function carica(){
  try{ db=await window.claude?.use?.('db') }catch(e){ db=null }
  if(db){ try{ const d=await db.doc('campagna/stato').get(); const v=d&&d.exists?d.data():null; if(v&&v.v===2){S=v; return 'db'} }catch(e){} }
  try{ const raw=localStorage.getItem(KEY); if(raw){const d=JSON.parse(raw); if(d.v===2){S=d; return db?'db':'local'}} }catch(e){}
  return null;
}
let tSalva=null;
function salva(){
  try{ localStorage.setItem(KEY,JSON.stringify(S)) }catch(e){}
  if(!db) return;
  clearTimeout(tSalva); tSalva=setTimeout(()=>{ db.doc('campagna/stato').set(S).catch(()=>{}) },700);
}
const has=id=>S.tech.includes(id);
const mine=()=>TERR.filter(t=>S.terr[t.id]==='mine');
function rendita(){ let pr=0,dr=0; mine().forEach(t=>{pr+=t.pr||0;dr+=t.dr||0}); if(has('dep'))pr+=5; return {pr,dr} }
function slot(){ let inf=2,add=1; mine().forEach(t=>(t.b||[]).forEach(b=>{if(b==='inf')inf++; if(b==='add')add++})); if(has('tra'))inf++; if(has('sim'))add++; return {inf,add} }
const modPerdite=()=> mine().some(t=>(t.b||[]).includes('perdite'))?2:0;
const vive=()=>S.truppe.filter(t=>t.stato!=='morto');
const veterano=t=>MAL.every(([k])=>t.mal[k]===0);
const classiOk=()=>CLASSI.filter(c=>!c[2]||TECH.some(n=>n.unit===c[2].u&&has(n.id)));
function classiArmi(){ const o=BASE.slice(); TECH.forEach(n=>{ if(has(n.id)) n.cls.forEach(c=>o.push(c)) }); return o }
function abilitaHw(){ const o=[]; TECH.forEach(n=>{ if(has(n.id)) n.ab.forEach(a=>o.push(a)) }); return o }
function munizioni(){ const o=[]; TECH.forEach(n=>{ if(n.mun&&has(n.id)) o.push(n.mun) }); return o }
function log(t){ S.log.unshift({t:S.turno,txt:t}); if(S.log.length>250)S.log.pop() }

function renderTutto(){ head(); quadro(); roster(); armeria(); tech(); terr(); partita(); dopo(); exportv(); }
function head(){
  $('#h-tit').textContent = S.io==='nomadi'?'Comando Nomade':'Comando PanOceaniano';
  $('#h-sub').textContent = (S.nome? S.nome+' · ':'')+'gestione campagna · Infinity N5';
  $('#p-turno').textContent=S.turno; $('#p-pr').textContent=S.pr; $('#p-dr').textContent=S.dr; $('#p-min').textContent=S.minaccia;
  document.title='Comando — '+(S.io==='nomadi'?'Nomadi':'PanOceania');
}
function quadro(){
  const r=rendita(), sl=slot(), v=vive();
  $('#q-min').textContent=STADI[Math.min(S.minaccia,3)];
  const rows=[['Punti Reclutamento',S.pr],['Dati di Ricerca',S.dr],['Rendita a fine turno',r.pr+' PR · '+r.dr+' DR'],
   ['Nodi controllati',mine().length+' su '+TERR.filter(t=>t.t!=='ost').length],
   ['Truppe in servizio',v.filter(t=>t.stato==='attivo').length+' / '+v.length],
   ['Infermeria',v.filter(t=>t.stato==='infermeria').length+' / '+sl.inf],
   ['Addestramento',v.filter(t=>t.stato==='addestramento').length+' / '+sl.add],
   ['Veterani',v.filter(veterano).length],['Caduti',S.truppe.filter(t=>t.stato==='morto').length]];
  const c=$('#q-box'); c.innerHTML=''; const tb=el('table'), tbody=el('tbody');
  rows.forEach(([k,x])=>{const tr=el('tr'); tr.appendChild(el('td',null,k)); tr.appendChild(el('td','n',String(x))); tbody.appendChild(tr)});
  tb.appendChild(tbody); c.appendChild(tb);
  const u=$('#q-unl'); u.innerHTML='';
  const cls=classiArmi().slice(1), ab=abilitaHw(), un=classiOk().filter(x=>x[2]).map(x=>x[1]), mu=munizioni();
  if(!cls.length&&!ab.length&&!un.length&&!mu.length) u.appendChild(el('span',null,'Nessuno: apri il primo nodo di Ricerca.'));
  cls.forEach(x=>u.appendChild(el('span','hw',x)));
  ab.forEach(x=>u.appendChild(el('span','hw',x)));
  mu.forEach(x=>u.appendChild(el('span','hw',x)));
  un.forEach(x=>u.appendChild(el('span','sw',x+' arruolabile')));
  const L=$('#log'); L.innerHTML='';
  if(!S.log.length) L.appendChild(el('div','empty','Vuoto. Si riempie registrando le partite.'));
  S.log.forEach(r=>{const d=el('div'); d.appendChild(el('b',null,'T'+r.t+' ')); d.appendChild(document.createTextNode(r.txt)); L.appendChild(d)});
}
let rf='tutte';
function roster(){
  const sel=$('#r-classe'); sel.innerHTML='';
  CLASSI.forEach(([k,n,req])=>{
    const ok=!req||TECH.some(x=>x.unit===req.u&&has(x.id));
    const o=el('option',null,ok?n:(n+' — richiede '+req.n)); o.value=k; o.disabled=!ok; sel.appendChild(o);
  });
  const tb=$('#t-roster tbody'); tb.innerHTML='';
  let list=S.truppe.slice();
  if(rf==='vive') list=list.filter(t=>t.stato!=='morto');
  if(rf==='vet') list=list.filter(t=>t.stato!=='morto'&&veterano(t));
  if(!list.length){const tr=el('tr'); const td=el('td','empty','Nessun Trooper.'); td.colSpan=11; tr.appendChild(td); tb.appendChild(tr)}
  list.sort((a,b)=>a.nome.localeCompare(b.nome)).forEach(t=>{
    const tr=el('tr'); if(t.stato==='morto')tr.className='dead';
    const nm=el('td'); nm.appendChild(el('b',null,t.nome)); nm.appendChild(el('div','rend',t.classe||'LI')); tr.appendChild(nm);
    tr.appendChild(el('td',null,t.alias));
    const st=el('td'); st.appendChild(el('span','tag '+{attivo:'att',infermeria:'inf',addestramento:'add',morto:'mor'}[t.stato],
      t.stato+(t.rientro?(' → T'+t.rientro):''))); tr.appendChild(st);
    const pa=el('td','n'); pa.appendChild(el('span','pa',String(t.pa||0))); tr.appendChild(pa);
    MAL.forEach(([k])=>{
      const td=el('td'), w=el('div','mal'), b=el('button','mini','−');
      b.disabled=(t.mal[k]<=0)||((t.pa||0)<=0)||t.stato==='morto';
      b.onclick=()=>{t.mal[k]--;t.pa--;salva();renderTutto()};
      w.appendChild(b); w.appendChild(el('i',null,String(t.mal[k]))); td.appendChild(w); tr.appendChild(td);
    });
    const hw=S.armeria.filter(i=>i.a===t.id).map(i=>i.nome);
    tr.appendChild(el('td',null,(t.abilita||[]).concat(hw).join(', ')||'—'));
    const az=el('td'), del=el('button','mini','×');
    del.onclick=()=>{ if(confirm('Rimuovere '+t.nome+'?')){S.truppe=S.truppe.filter(x=>x.id!==t.id); S.armeria.forEach(i=>{if(i.a===t.id)i.a=null}); salva(); renderTutto()} };
    az.appendChild(del); tr.appendChild(az); tb.appendChild(tr);
  });
  const vets=vive().filter(t=>t.stato==='attivo'&&veterano(t));
  const sl=slot(), occ=vive().filter(t=>t.stato==='addestramento').length;
  $('#c-addestra').style.display = vets.length? 'block':'none';
  if(vets.length){
    $('#a-sub').textContent='Solo Veterani. Slot occupati '+occ+' su '+sl.add+'. Costa 10 PR e una partita saltata.';
    const c=$('#ad-chi'); c.innerHTML='';
    vets.forEach(t=>{const o=el('option',null,t.nome+' · '+t.alias); o.value=t.id; c.appendChild(o)});
    const a=$('#ad-ab'); a.innerHTML='';
    SOFTWARE.forEach(x=>{const o=el('option',null,x); o.value=x; a.appendChild(o)});
    $('#btn-addestra').disabled = occ>=sl.add || S.pr<10;
  }
}
function armeria(){
  const sel=$('#a-classe'); sel.innerHTML='';
  const ok=classiArmi();
  ok.forEach(c=>{const o=el('option',null,c); o.value=c; sel.appendChild(o)});
  TECH.forEach(n=>{ if(!has(n.id)) n.cls.forEach(c=>{const o=el('option',null,c+' — richiede '+n.n); o.disabled=true; sel.appendChild(o)}) });
  const ab=abilitaHw();
  $('#a-msg').textContent = ab.length? ('Dotazioni assegnabili sbloccate: '+ab.join(', ')+'.') : 'Nessuna dotazione speciale sbloccata: solo Armeria Base.';
  const tb=$('#t-armeria tbody'); tb.innerHTML='';
  if(!S.armeria.length){const tr=el('tr'); const td=el('td','empty','Magazzino vuoto.'); td.colSpan=5; tr.appendChild(td); tb.appendChild(tr); return}
  S.armeria.forEach(it=>{
    const tr=el('tr');
    tr.appendChild(el('td',null,it.nome)); tr.appendChild(el('td',null,it.classe));
    const as=el('td'), s2=el('select'); const o0=el('option',null,'— in magazzino'); o0.value=''; s2.appendChild(o0);
    vive().forEach(t=>{const o=el('option',null,t.nome); o.value=t.id; if(it.a===t.id)o.selected=true; s2.appendChild(o)});
    s2.onchange=()=>{it.a=s2.value||null; salva(); roster(); exportv()};
    as.appendChild(s2); tr.appendChild(as);
    tr.appendChild(el('td',null,it.orig||'—'));
    const az=el('td'), del=el('button','mini','×');
    del.onclick=()=>{S.armeria=S.armeria.filter(x=>x.id!==it.id); salva(); renderTutto()};
    az.appendChild(del); tr.appendChild(az); tb.appendChild(tr);
  });
}
function tech(){
  const NS='http://www.w3.org/2000/svg';
  const TIERS=[['sdc','ott','ge','bal','sim','dep'],['tra','ana','occ','con','bai','mp','tp','art'],
               ['ter','aes','mpe','off'],['mes','han']];
  const ETI=['FONDAMENTALI','SPECIALIZZAZIONI','ALTA TECNOLOGIA','TERMINALI'];
  const W=138,H=74,GAP=12,ROW=168,TOP=44;
  const pos={};
  TIERS.forEach((t,r)=>{
    const tot=t.length*(W+GAP)-GAP, x0=(1200-tot)/2;
    t.forEach((id,i)=>{ pos[id]={x:x0+i*(W+GAP), y:TOP+r*ROW, r}; });
  });
  const svg=$('#tech'); svg.textContent='';
  svg.setAttribute('viewBox','0 0 1200 '+(TOP+TIERS.length*ROW-ROW+H+40));
  const mk=(t,a)=>{const e=document.createElementNS(NS,t); for(const k in a) e.setAttribute(k,a[k]); return e};
  ETI.forEach((e,r)=>{ const tx=mk('text',{x:14,y:TOP+r*ROW-12,class:'ttier'}); tx.textContent=e; svg.appendChild(tx) });
  TECH.forEach(n=>n.p.forEach(pid=>{
    const a=pos[pid], b=pos[n.id]; if(!a||!b) return;
    const x1=a.x+W/2, y1=a.y+H, x2=b.x+W/2, y2=b.y, my=(y1+y2)/2;
    svg.appendChild(mk('path',{d:`M${x1} ${y1} C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2}`,
      class:'tlink'+(has(pid)&&has(n.id)?' on':'')}));
  }));
  TECH.forEach(n=>{
    const p=pos[n.id]; if(!p) return;
    const done=has(n.id), ok=n.p.every(x=>has(x)), can=!done&&ok&&S.dr>=n.dr;
    const g=mk('g',{class:'tn-box'+(done?' done':(ok?'':' lock'))+(can?' can':''),tabindex:can?'0':'-1',role:'button'});
    const r=mk('rect',{x:p.x,y:p.y,width:W,height:H,rx:3}); if(!done) r.setAttribute('stroke',ok?n.c:'#2b4a60');
    g.appendChild(r);
    g.appendChild(mk('rect',{x:p.x,y:p.y,width:4,height:H,fill:n.c}));
    const parole=n.n.split(' '); let l1=parole[0], l2=parole.slice(1).join(' ');
    if(!l2&&l1.length>13){ l2=l1.slice(11); l1=l1.slice(0,11) }
    [l1,l2].forEach((t,i)=>{ if(!t) return;
      const tx=mk('text',{x:p.x+12,y:p.y+24+i*17,class:'tt'}); tx.textContent=t; g.appendChild(tx) });
    const c=mk('text',{x:p.x+W-12,y:p.y+H-12,class:'tc','text-anchor':'end',fill:done?'#6fe0a8':n.c});
    c.textContent=done?'✓':n.dr+' DR'; g.appendChild(c);
    const apre=[].concat(n.cls,n.ab,n.mun?['munizioni '+n.mun]:[],n.unit?['arruolamento '+n.unit]:[],n.eff?[n.eff]:[]).join(' · ');
    const ti=mk('title'); ti.textContent=n.n+(apre?' — '+apre:'')+(ok?'':' · richiede '+n.p.map(x=>TECH.find(y=>y.id===x).n).join(' + '));
    g.appendChild(ti);
    const azione=()=>{
      if(done) return $('#tech-msg').textContent=n.n+' è già sbloccato'+(apre?': '+apre:'')+'.';
      if(!ok) return $('#tech-msg').textContent=n.n+' richiede '+n.p.map(x=>TECH.find(y=>y.id===x).n).join(' e ')+'.';
      if(S.dr<n.dr) return $('#tech-msg').textContent=n.n+' costa '+n.dr+' DR, ne hai '+S.dr+'.';
      S.dr-=n.dr; S.tech.push(n.id);
      log('Sbloccato '+n.n+' ('+n.dr+' DR)'+(apre?': '+apre:'')+'.');
      salva(); renderTutto(); $('#tech-msg').textContent='Sbloccato '+n.n+(apre?': '+apre:'')+'.';
    };
    g.addEventListener('click',azione);
    g.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){e.preventDefault();azione()} });
    svg.appendChild(g);
  });
}
function terr(){
  if(!document.getElementById("terr")) return;
  const c=$('#terr'); c.innerHTML='';
  TERR.forEach(t=>{
    const cur=S.terr[t.id];
    const d=el('div','tr '+(cur==='mine'?'mine':cur==='avv'?'avv':'neu'));
    const nm=el('div','nm'); nm.appendChild(el('b',null,t.n));
    nm.appendChild(el('div','rend',(t.pr?t.pr+' PR ':'')+(t.dr?'· '+t.dr+' DR':'')||{tr:'transito',ost:'obiettivo ostile',hq:'quartier generale'}[t.t]||'—'));
    d.appendChild(nm);
    d.appendChild(el('span','tag '+(cur==='mine'?'att':(cur==='avv'?'mor':'')), cur==='mine'?'tuo':(cur==='avv'?'avversario':(t.t==='ost'?'ostile':'neutrale'))));
    c.appendChild(d);
  });
}
function partita(){
  const s2=$('#m-nodo'); s2.innerHTML='';
  TERR.forEach(t=>{const o=el('option',null,t.n+(t.t==='ost'?' (ostile)':'')); o.value=t.id; s2.appendChild(o)});
}
function registraPartita(){
  const id=$('#m-nodo').value, tipo=$('#m-tipo').value, es=$('#m-esito').value;
  const t=TERR.find(x=>x.id===id);
  let pr=20, txt=[];
  if(tipo==='patt'){ if(S.pr<10) return $('#m-msg').textContent='Servono 10 PR di mobilitazione.'; S.pr-=10; pr=0; txt.push('pattugliamento (−10 PR)') }
  if(es==='v'){ pr+=(tipo==='patt'?0:10);
    if(t.t==='ost'&&id==='mil'){ S.pr+=20; txt.push('+20 PR di bottino') } }
  S.pr+=pr; if(pr) txt.push('+'+pr+' PR');
  if(tipo==='pve') S.pve=true;
  log('Partita a '+t.n+' ('+{pve:'PvE',pvp:'PvP',patt:'pattugliamento'}[tipo]+'): '+{v:'vittoria',p:'pareggio',s:'sconfitta'}[es]+(txt.length?' — '+txt.join(', '):'')+'.');
  $('#m-msg').textContent='Registrata: qui entrano solo i tuoi PR. Il controllo del nodo si assegna sul Tabellone. '+txt.join(', ');
  salva(); renderTutto();
}
function importaPubblico(txt){
  try{
    const d=JSON.parse(txt); if(!d||!d.terr) throw new Error('formato non riconosciuto');
    let n=0;
    TERR.forEach(t=>{ const c=d.terr[t.id]; if(c===undefined) return;
      S.terr[t.id]= c===S.io?'mine':(c?'avv':null); n++ });
    if(typeof d.turno==='number') S.turno=d.turno;
    if(typeof d.minaccia==='number') S.minaccia=d.minaccia;
    log('Stato pubblico importato dal tabellone: turno '+S.turno+', '+n+' nodi aggiornati.');
    $('#sy-msg').textContent='Importato: turno '+S.turno+', Minaccia '+S.minaccia+', '+n+' nodi aggiornati.';
    salva(); renderTutto();
  }catch(e){ $('#sy-msg').textContent='Import fallito: '+e.message }
}
const ds={};
function dopo(){
  const tb=$('#t-dopo tbody'); tb.innerHTML='';
  const list=vive().filter(t=>t.stato==='attivo');
  if(!list.length){const tr=el('tr'); const td=el('td','empty','Nessun Trooper attivo.'); td.colSpan=3; tr.appendChild(td); tb.appendChild(tr); return}
  list.forEach(t=>{
    const tr=el('tr'); tr.appendChild(el('td',null,t.nome));
    const e=el('td'), ch=el('div','chips');
    [['no','Non schierato'],['viv','Sopravvissuto'],['ob','Sopravvissuto + obiettivo'],['null','In stato Nullo']].forEach(([v,lab])=>{
      const b=el('button','chip'+((ds[t.id]||'no')===v?' on':''),lab); b.onclick=()=>{ds[t.id]=v; dopo()}; ch.appendChild(b);
    });
    e.appendChild(ch); tr.appendChild(e);
    const cu=el('td'), cb=el('button','chip'+(ds['c'+t.id]?' on':''),'+5');
    cb.onclick=()=>{ds['c'+t.id]=!ds['c'+t.id]; dopo()}; cu.appendChild(cb); tr.appendChild(cu);
    tb.appendChild(tr);
  });
}
function risolvi(){
  const doc=$('#d-doc').classList.contains('on')?2:0, mp=modPerdite(), sl=slot();
  let occ=vive().filter(t=>t.stato==='infermeria').length; const out=[];
  vive().filter(t=>t.stato==='attivo').forEach(t=>{
    const st=ds[t.id]||'no';
    if(st==='null'||st==='no'){
      const bon=(st==='no'?5:0)+(ds['c'+t.id]?5:0)+doc+mp, d=1+Math.floor(Math.random()*20), tot=d+bon;
      const sfx=' (1d20='+d+(bon?'+'+bon:'')+')';
      if(tot<=5){ t.stato='morto'; out.push(t.nome+': caduto in azione'+sfx) }
      else if(tot<=12){
        if(occ<sl.inf){t.stato='infermeria'; t.rientro=S.turno+1; occ++; out.push(t.nome+': ferito grave, in infermeria'+sfx)}
        else out.push(t.nome+': ferito grave ma infermeria piena'+sfx+' — decidi fra cure d\u2019urgenza, dimissione forzata o perdita');
      } else out.push(t.nome+': recuperato'+sfx);
    } else { const pa=(st==='ob')?3:2; t.pa=(t.pa||0)+pa; t.missioni=(t.missioni||0)+1; out.push(t.nome+': +'+pa+' PA') }
    delete ds[t.id]; delete ds['c'+t.id];
  });
  if(!out.length) return alert('Nessun Trooper attivo.');
  out.forEach(o=>log(o));
  $('#d-note').innerHTML='<b>Esito:</b><br>'+out.join('<br>');
  salva(); renderTutto();
}
const sel=new Set();
const schierabili=()=>vive().filter(t=>t.stato==='attivo');
function exportv(){
  const c=$('#e-sel'); c.innerHTML='';
  const list=schierabili();
  if(!list.length) c.appendChild(el('span','empty','Nessun Trooper disponibile.'));
  list.forEach(t=>{
    const b=el('button','chip'+(sel.has(t.id)?' on':''),t.nome);
    b.onclick=()=>{ if(sel.has(t.id))sel.delete(t.id); else{ if(sel.size>=15) return alert('Massimo 15 Trooper.'); sel.add(t.id)} exportv() };
    c.appendChild(b);
  });
  const n=[...sel].length;
  $('#e-msg').textContent=n?(n+' selezionati.'):'Seleziona chi scende in campo.';
  $('#e-pre').textContent=JSON.stringify(build(),null,1);
  $('#e-nota').innerHTML='Il pulsante scrive la squadra sotto <b>'+chiave()+'</b> in formato 2. Funziona se questa pagina è servita dalla stessa cartella del calcolatore; altrimenti usa il JSON.';
}
const chiave=()=> S.io==='nomadi'?'infinityRosters_Nomads':'infinityRosters_Panoceania';
function build(){
  const unita=schierabili().filter(t=>sel.has(t.id)).map(t=>{
    const hw=S.armeria.filter(i=>i.a===t.id).map(i=>i.nome);
    return {alias:t.alias,name:t.nome,tipo:t.classe||'LI',
      bs:Math.max(0,t.st.bs-t.mal.bs),ph:Math.max(0,t.st.ph-t.mal.ph),cc:t.st.cc,
      wip:Math.max(0,t.st.wip-t.mal.wip),arm:Math.max(0,t.st.arm-t.mal.arm),
      bts:t.st.bts,w:t.st.w,s:t.st.s,
      weapon:[t.weapon].concat(hw).filter(Boolean).join(', '),
      skills:(t.abilita||[]).join(', '),equip:'',modSalvezza:t.mal.sal};
  });
  return {formato:2,unita,strutture:[],terreni:[]};
}
function avanza(){
  const r=rendita(); S.pr+=r.pr; S.dr+=r.dr;
  log('Rendita: +'+r.pr+' PR, +'+r.dr+' DR.');
  S.truppe.forEach(t=>{ if((t.stato==='infermeria'||t.stato==='addestramento')&&t.rientro&&t.rientro<=S.turno){log(t.nome+' rientra in servizio.'); t.stato='attivo'; t.rientro=null} });
  if(!S.pve){ S.minaccia=Math.min(3,S.minaccia+1); log('Nessuna missione PvE: Minaccia a '+S.minaccia+'.') }
  S.turno++; S.pve=true; log('Inizio del turno '+S.turno+'.');
  $('#pve-si').classList.add('on'); $('#pve-no').classList.remove('on');
  salva(); renderTutto();
}
function arruola(){
  const nome=$('#r-nome').value.trim(), alias=$('#r-alias').value.trim(), costo=parseInt($('#r-costo').value,10)||0;
  if(!nome||!alias) return $('#r-msg').textContent='Servono il nome proprio e l\u2019alias del profilo.';
  if(S.pr<costo) return $('#r-msg').textContent='PR insufficienti: ne servono '+costo+', ne hai '+S.pr+'.';
  const g=i=>parseInt($('#r-'+i).value,10)||0;
  S.pr-=costo;
  S.truppe.push({id:nid(),nome,alias,classe:$('#r-classe').value,weapon:$('#r-weapon').value.trim(),
    st:{bs:g('bs'),ph:g('ph'),cc:g('cc'),wip:g('wip'),arm:g('arm'),bts:g('bts'),w:g('w'),s:g('s')},
    mal:{bs:2,wip:2,ph:2,arm:2,sal:2},pa:0,abilita:[],stato:'attivo',rientro:null,missioni:0,turno:S.turno});
  log('Arruolato '+nome+' ('+alias+') per '+costo+' PR.');
  $('#r-nome').value=''; $('#r-msg').textContent='';
  salva(); renderTutto();
}
async function scarica(f,txt){
  let dl=null; try{ dl=await window.claude?.use?.('downloads') }catch(e){}
  if(dl){ try{ await dl.save({filename:f,data:txt}); return }catch(e){} }
  const b=new Blob([txt],{type:'application/json'}), u=URL.createObjectURL(b);
  const a=document.createElement('a'); a.href=u; a.download=f; a.click(); setTimeout(()=>URL.revokeObjectURL(u),2000);
}
document.addEventListener('click',e=>{
  const n=e.target.closest('#nav button'); if(!n) return;
  document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('on',b===n));
  document.querySelectorAll('main section').forEach(s=>s.classList.toggle('on',s.id==='s-'+n.dataset.t));
});
document.querySelectorAll('[data-rf]').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('[data-rf]').forEach(x=>x.classList.toggle('on',x===b)); rf=b.dataset.rf; roster();
});
$('#pve-si').onclick=()=>{S.pve=true;$('#pve-si').classList.add('on');$('#pve-no').classList.remove('on');salva()};
$('#pve-no').onclick=()=>{S.pve=false;$('#pve-no').classList.add('on');$('#pve-si').classList.remove('on');salva()};
$('#btn-turno').onclick=avanza;
$('#btn-arruola').onclick=arruola;
$('#btn-addestra').onclick=()=>{
  const t=S.truppe.find(x=>x.id===$('#ad-chi').value), ab=$('#ad-ab').value;
  if(!t) return;
  const sl=slot(), occ=vive().filter(x=>x.stato==='addestramento').length;
  if(occ>=sl.add) return alert('Slot addestramento pieni.');
  if(S.pr<10) return alert('Servono 10 PR.');
  S.pr-=10; t.abilita=(t.abilita||[]).concat(ab); t.stato='addestramento'; t.rientro=S.turno+1;
  log(t.nome+' in addestramento: '+ab+' (10 PR, salta una partita).');
  salva(); renderTutto();
};
$('#btn-additem').onclick=()=>{
  const nome=$('#a-nome').value.trim(); if(!nome) return;
  const cl=$('#a-classe');
  if(cl.selectedOptions[0]&&cl.selectedOptions[0].disabled) return;
  S.armeria.push({id:nid(),classe:cl.value,nome,orig:$('#a-orig').value,a:null});
  log('In armeria: '+nome+' ('+cl.value+').'); $('#a-nome').value=''; salva(); renderTutto();
};
$('#btn-partita').onclick=registraPartita;
$('#btn-sy').onclick=()=>importaPubblico($('#sy-txt').value.trim());
$('#btn-sy-loc').onclick=()=>{ const t=localStorage.getItem('campagna_pubblico');
  if(!t) return $('#sy-msg').textContent='Canale locale vuoto: apri il tabellone dalla stessa cartella e premi Copia stato pubblico.';
  importaPubblico(t); };
$('#d-doc').onclick=()=>$('#d-doc').classList.toggle('on');
$('#btn-dopo').onclick=risolvi;
$('#btn-copia').onclick=async()=>{ try{await navigator.clipboard.writeText(JSON.stringify(build())); alert('JSON copiato.')}catch(e){alert('Copia non riuscita: seleziona il testo nell\u2019anteprima.')} };
$('#btn-scarica').onclick=()=>scarica('squadra_'+S.io+'.json',JSON.stringify(build(),null,2));
$('#btn-canale').onclick=()=>{
  const nome=($('#e-nome').value||'MISSIONE').toUpperCase(), k=chiave();
  try{ const d=JSON.parse(localStorage.getItem(k)||'{}'); d[nome]=build(); localStorage.setItem(k,JSON.stringify(d));
    alert('Squadra "'+nome+'" scritta in '+k+'.'); }catch(e){ alert('Scrittura non riuscita: '+e.message) }
};
$('#btn-esporta-tutto').onclick=()=>scarica('campagna_'+S.io+'_T'+S.turno+'.json',JSON.stringify(S,null,2));
$('#file-imp').onchange=e=>{
  const f=e.target.files[0]; if(!f) return;
  const r=new FileReader();
  r.onload=()=>{ try{ const d=JSON.parse(r.result); if(d.v!==2||!d.io) throw new Error('file non riconosciuto');
    S=d; salva(); renderTutto(); alert('Campagna importata: turno '+S.turno+'.') }catch(err){ alert('Import fallito: '+err.message) } };
  r.readAsText(f); e.target.value='';
};
$('#btn-reset').onclick=()=>{ if(confirm('Azzerare tutto? Esporta prima, se non l\u2019hai fatto.')){ S=vuoto(S.io,S.nome); salva(); renderTutto() } };
$('#g-ok').onclick=()=>{ S=vuoto($('#g-faz').value,$('#g-nome').value.trim()); $('#gate').style.display='none'; salva(); renderTutto() };

carica().then(modo=>{
  $('#dati-stato').textContent = modo==='db'
    ? 'Stato salvato sul server di questo artefatto e legato al tuo account; l\u2019archivio del browser resta come copia di lavoro.'
    : 'Stato salvato nell\u2019archivio di questo browser. Esporta il file dopo ogni sessione.';
  if(!S){ $('#gate').style.display='flex'; return }
  renderTutto();
});
})();
