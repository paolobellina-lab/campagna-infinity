
const MAL=[['bs','BS'],['wip','WIP'],['ph','PH'],['arm','ARM'],['sal','Salv.']];
let S={pr:200,dr:0,tech:[],truppe:[],armeria:[],turno:1};
function nid(){return 'x'+Math.random().toString(36).slice(2,7)}
// arruolamento
const costo=12;
S.pr-=costo;
S.truppe.push({id:'t1',nome:'Vasquez',alias:'Alguacil (Combi Rifle)',classe:'LI',weapon:'Combi Rifle, Pistol',
 st:{bs:11,ph:10,cc:13,wip:12,arm:1,bts:0,w:1,s:2},mal:{bs:2,wip:2,ph:2,arm:2,sal:2},pa:0,abilita:[],stato:'attivo'});
const t=S.truppe[0];
console.log('reclute: malus iniziali',JSON.stringify(t.mal),'PR',S.pr);
// dopo-partita: sopravvissuto con obiettivo => 3 PA
t.pa+=3;
// spendo 3 PA su BS, BS, WIP
['bs','bs','wip'].forEach(k=>{ if(t.mal[k]>0&&t.pa>0){t.mal[k]--;t.pa--} });
console.log('dopo 3 PA          ',JSON.stringify(t.mal),'PA residui',t.pa);
// armeria: creo un pezzo, va in magazzino, poi lo assegno
S.armeria.push({id:'a1',classe:'Tiratore Scelto',nome:'MULTI Sniper Rifle',orig:'looting',a:null,turno:1});
console.log('magazzino          ',S.armeria[0].nome,'assegnato a:',S.armeria[0].a);
S.armeria[0].a='t1';
console.log('dopo assegnazione  ','assegnato a:',S.armeria[0].a);
// export
const hw=S.armeria.filter(i=>i.a===t.id).map(i=>i.nome);
const u={alias:t.alias,name:t.nome,tipo:t.classe,
 bs:Math.max(0,t.st.bs-t.mal.bs),ph:Math.max(0,t.st.ph-t.mal.ph),cc:t.st.cc,
 wip:Math.max(0,t.st.wip-t.mal.wip),arm:Math.max(0,t.st.arm-t.mal.arm),
 bts:t.st.bts,w:t.st.w,s:t.st.s,
 weapon:[t.weapon].concat(hw).filter(Boolean).join(', '),
 skills:(t.abilita||[]).join(', '),equip:'',modSalvezza:t.mal.sal};
console.log('unita esportata    ',JSON.stringify(u));
console.log('atteso: BS 11-0=11? no: malus bs residuo',t.mal.bs,'-> bs',u.bs);
