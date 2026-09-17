/* Teste ton mot de passe — CYBERTOUR Rouen 2026 */
(function(){
"use strict";

/* ============ listes ============ */
var TOP=("123456 password 123456789 12345678 azerty qwerty 111111 1234567890 motdepasse 1234567 abc123 "+
"azertyuiop qwertyuiop 000000 iloveyou 123123 admin loulou soleil 654321 doudou chouchou password1 "+
"motdepasse1 azerty123 bonjour 666666 121212 aaaaaa dragon monkey 1q2w3e4r qwerty123 superman batman "+
"starwars pokemon minecraft fortnite roblox naruto football marseille psg paris france liverpool "+
"chocolat nutella princesse licorne jetaime bisous coucou secret test root sunshine princess whatever "+
"trustno1 letmein welcome master shadow hunter caramel biscuit vacances anniversaire maison amour "+
"liberte bonsoir salut chaton rouen normandie").split(" ");

var NOMS=("lucas emma hugo lea nathan chloe enzo manon louis camille jules ines gabriel sarah raphael "+
"jade arthur louise paul alice tom clara theo eva maxime julie antoine marie pierre sophie thomas "+
"laura kevin celine mehdi yanis amine sofia noah lina adam mila leo rose ethan anna nolan zoe mathis "+
"lola tiago ambre aaron juliette sacha alba nino romane gaspard elena martin agathe victor nina "+
"baptiste oceane quentin pauline florian melissa jeremy sabrina karim leila samir nadia mohamed "+
"fatima david rachel jonathan elodie").split(" ");

var MOTS=("voiture ordinateur telephone musique guitare piano basket tennis natation danse cinema serie "+
"livre dessin couleur rouge bleu vert jaune noir blanc orange violet lune etoile ciel montagne foret "+
"fleur arbre jardin plage neige pluie orage vent terre temps jour nuit matin soir semaine annee "+
"printemps automne hiver janvier fevrier mars avril juin juillet aout septembre octobre novembre "+
"decembre lundi mardi mercredi jeudi vendredi samedi dimanche college lycee ecole maman papa mamie "+
"papy frere soeur famille copain copine cantine cahier stylo trousse cartable bureau chambre cuisine "+
"salon fenetre porte escalier chien chat lapin cheval poisson oiseau tortue hamster souris renard "+
"loup ours tigre lion panda requin dauphin baleine abeille papillon pizza burger frite gateau bonbon "+
"fraise banane pomme citron cerise glace crepe gaufre sandwich fromage cookie love hello world money "+
"dream happy summer winter night light shadow power ninja gamer player master legend hacker angel "+
"eagle wolf shark coffee guitar galaxy planet rocket robot laser pixel level score joueur victoire "+
"manette console ecran clavier casque").split(" ");

var GEN=("tortue banane orage pixel dragon fromage comete tambour cactus renard velours bambou salade "+
"sirene marteau nuage hibou pirate lanterne violon caillou sardine chapeau mousse trefle balcon girafe "+
"muffin ancre bison vitrail koala carotte grelot momie rocher pinceau flamme tulipe donjon biscuit "+
"narval canari brume ruche sabot manoir calamar chariot lutin poivre kayak sorbet myrtille zebre").split(" ");

var LEET={"4":"a","@":"a","3":"e","1":"i","!":"i","|":"i","0":"o","5":"s","$":"s","7":"t","+":"t","8":"b","9":"g","6":"g","2":"z"};
var SEQS=["azertyuiop","qwertyuiop","qsdfghjklm","asdfghjkl","wxcvbn","zxcvbnm","abcdefghijklmnopqrstuvwxyz","01234567890","9876543210"];

/* ============ analyse ============ */
function normalize(s){var o="";for(var i=0;i<s.length;i++){o+=LEET[s[i]]||s[i].toLowerCase();}return o;}
/* index construit une fois : recherche en O(longueur) au lieu de parcourir 450 mots à chaque lettre */
var DICT=new Map(),TOPIDX=new Map(),MAXW=0;
function index(list,base,step,kind){
  list.forEach(function(w,i){
    if(w.length<3||DICT.has(w)) return;           /* doublon : le top mondial garde la priorité */
    DICT.set(w,{g:base+i*step,kind:kind});
    if(w.length>MAXW) MAXW=w.length;
  });
}
TOP.forEach(function(w,i){ if(!TOPIDX.has(w)) TOPIDX.set(w,i); });
index(TOP,1,1,"top"); index(NOMS,4000,60,"name"); index(MOTS,25000,320,"word");
function findWord(n,p){
  for(var L=Math.min(MAXW,n.length-p);L>=3;L--){
    var e=DICT.get(n.substr(p,L));
    if(e) return {len:L,guesses:e.g,word:n.substr(p,L),kind:e.kind};
  }
  return null;
}
function charsetOf(s){
  var n=0;
  if(/[a-z]/.test(s))n+=26; if(/[A-Z]/.test(s))n+=26; if(/[0-9]/.test(s))n+=10;
  if(/ /.test(s))n+=1; if(/[àâäéèêëîïôöùûüçœ]/i.test(s))n+=16;
  if(/[^a-zA-Z0-9 àâäéèêëîïôöùûüçœ]/.test(s))n+=33;
  return n||1;
}
function isSeq(c){
  if(c.length<(/^[0-9]+$/.test(c)?3:4)) return false;
  var a=c.toLowerCase(),b=a.split("").reverse().join("");
  for(var i=0;i<SEQS.length;i++) if(SEQS[i].indexOf(a)>=0||SEQS[i].indexOf(b)>=0) return true;
  return false;
}
function analyse(pw){
  var r={guesses:1,words:[],parts:[],top:false,name:false,word:false,leet:false,seq:false,repeat:false,date:false,
         lower:/[a-z]/.test(pw),upper:/[A-Z]/.test(pw),digit:/[0-9]/.test(pw),symbol:/[^a-zA-Z0-9]/.test(pw)};
  if(!pw) return r;
  var norm=normalize(pw),i=0,prod=1,count=0,buf="";
  function push(t,k,g){ r.parts.push({t:t,k:k,g:g}); }
  function flush(){
    if(buf){ var g=Math.pow(charsetOf(buf),buf.length); prod*=g; count++; push(buf,"brute",g); buf=""; }
  }

  while(i<pw.length){
    var rep=1;
    while(i+rep<pw.length&&pw[i+rep].toLowerCase()===pw[i].toLowerCase()) rep++;
    if(rep>=3){ flush(); r.repeat=true; var gr=charsetOf(pw[i])*rep;
      prod*=gr; count++; push(pw.substr(i,rep),"repeat",gr); i+=rep; continue; }

    var sl=0;
    for(var L=Math.min(8,pw.length-i);L>=3;L--){ if(isSeq(pw.substr(i,L))){ sl=L; break; } }
    if(sl){ flush(); r.seq=true; var gs=60*sl;
      prod*=gs; count++; push(pw.substr(i,sl),"seq",gs); i+=sl; continue; }

    if(/[0-9]/.test(pw[i])){
      var d=0; while(i+d<pw.length&&/[0-9]/.test(pw[i+d])) d++;
      if(d>=2){
        flush(); var num=pw.substr(i,d),g,kind="digits";
        if(d===4&&+num>=1900&&+num<=2035){ g=140; r.date=true; kind="date"; }
        else if(d===6||d===8){ g=40000; r.date=true; kind="date"; }
        else if(d<=2){ g=100; }
        else { g=Math.pow(10,d); }
        prod*=g; count++; push(num,kind,g); i+=d; continue;
      }
    }

    var w=findWord(norm,i);
    if(w){
      flush();
      var raw=pw.substr(i,w.len),cf=1,lf=1;
      if(/^[A-Z][a-z]*$/.test(raw)||/^[A-Z]+$/.test(raw)) cf=2;
      else if(/[A-Z]/.test(raw)&&/[a-z]/.test(raw)) cf=Math.pow(2,Math.min(w.len,7));
      for(var k=0;k<raw.length;k++) if(LEET[raw[k]]){ lf=Math.min(lf*2,64); r.leet=true; }
      var kind=w.kind;
      if(kind==="top") r.top=true; else if(kind==="name") r.name=true; else r.word=true;
      r.words.push(w.word);
      var gw=Math.max(2,w.guesses*cf*lf);
      prod*=gw; count++; push(raw,kind,gw); i+=w.len; continue;
    }
    buf+=pw[i]; i++;
  }
  flush();
  if(count>1) prod*=Math.min(Math.pow(6,count-1),1e6);
  r.guesses=Math.max(1,Math.min(prod,Math.pow(charsetOf(pw),pw.length)));

  /* phrase de passe : au moins 4 blocs de lettres de 3 caractères ou plus */
  r.phrase=pw.split(/[^A-Za-zÀ-ÖØ-öø-ÿ]+/).filter(function(c){return c.length>=3;}).length>=4;

  /* le mot de passe entier est dans le top mondial (y compris 123456, 1q2w3e4r…) */
  var lw=pw.toLowerCase();
  if(TOPIDX.has(lw)){
    r.top=true;
    r.guesses=Math.min(r.guesses,(TOPIDX.get(lw)+1)*(pw===lw?1:2));
    r.parts=[{t:pw,k:"top",g:r.guesses}];
  }
  return r;
}

/* ============ mise en forme ============ */
var YEAR=31557600;
var NF=new Intl.NumberFormat("fr-FR",{maximumFractionDigits:0});

function humanTime(s){
  if(s<1) return "moins d'une seconde";
  var st=[[60,"seconde",1],[3600,"minute",60],[86400,"heure",3600],[2629800,"jour",86400],
          [YEAR,"mois",2629800],[100*YEAR,"an",YEAR],[1000*YEAR,"siècle",100*YEAR],[1e6*YEAR,"millénaire",1000*YEAR]];
  for(var i=0;i<st.length;i++){
    if(s<st[i][0]){
      var n=Math.max(1,Math.round(s/st[i][2])),u=st[i][1];
      if(n>1) u = u==="an"?"ans" : u==="mois"?"mois" : u+"s";
      return NF.format(n)+" "+u;
    }
  }
  var y=s/YEAR;
  if(y<1e9) return NF.format(Math.round(y/1e6))+" millions d'années";
  if(y<1.4e10) return NF.format(Math.round(y/1e9))+" milliards d'années";
  return "plus que l'âge de l'Univers";
}

/* ============ réglages ============ */
var RATE=1e12;          /* essais par seconde : une ferme de cartes graphiques */

/* ============ niveaux ============ */
var LEVELS=[
  {n:"À toi de jouer", c:"#3F6C78"},
  {n:"NUL",            c:"#FF4D6D"},
  {n:"FAIBLE",         c:"#FF9F43"},
  {n:"MOYEN",          c:"#FFD23F"},
  {n:"FORT",           c:"#26D0F2"},
  {n:"INCASSABLE",     c:"#7CE05A"}
];
var FULL_LOG=Math.log(100*YEAR*2*RATE)/Math.LN10;   /* barre pleine = 100 ans */

/* ============ les 8 défis ============ */
function found(x,kinds){
  for(var i=0;i<x.a.parts.length;i++) if(kinds.indexOf(x.a.parts[i].k)>=0) return x.a.parts[i].t;
  return "";
}
function quote(t,suite){ return t ? "« "+t+" » "+suite : ""; }
var RULES=[
  {t:"12 caractères minimum",
   ok:function(x){ return x.pw.length>=12; },
   hint:function(x){ var n=12-x.pw.length; return "Encore "+n+" caractère"+(n>1?"s":"")+"."; }},
  {t:"Des majuscules et des minuscules",
   ok:function(x){ return x.a.lower&&x.a.upper; },
   hint:function(x){ return x.a.upper ? "Ajoute une minuscule." : "Ajoute une MAJUSCULE."; }},
  {t:"Au moins un chiffre",
   ok:function(x){ return x.a.digit; },
   hint:function(){ return "Pas seulement à la fin : tout le monde fait ça."; }},
  {t:"Au moins un symbole",
   ok:function(x){ return x.a.symbol; },
   hint:function(){ return "Par exemple ! ? # @ ou un espace."; }},
  {t:"Pas un mot de passe connu",
   ok:function(x){ return !(x.a.top&&!x.a.phrase); },
   hint:function(x){ return quote(found(x,["top"]),"est testé en premier.")||"Il est testé en premier."; }},
  {t:"Pas de prénom ni de mot seul",
   ok:function(x){ return !(x.a.name||x.a.word)||x.a.phrase; },
   hint:function(x){ return quote(found(x,["name","word"]),"est dans les listes.")+" Astuce : 4 mots au hasard."; }},
  {t:"Pas de date ni d'année",
   ok:function(x){ return !x.a.date; },
   hint:function(x){ return quote(found(x,["date"]),"se devine en une seconde.")||"Ça se devine en une seconde."; }},
  {t:"Pas de suite ni de répétition",
   ok:function(x){ return !x.a.seq&&!x.a.repeat; },
   hint:function(x){ return quote(found(x,["seq","repeat"]),"est bien trop facile.")||"C'est bien trop facile."; }}
];
var TODO="À réussir";

/* ============ interface ============ */
var $=function(id){ return document.getElementById(id); };
var pwEl=$("pw"),fieldEl=$("field"),countEl=$("count"),hudEl=$("hud"),lvlEl=$("lvl"),rankEl=$("rank"),
    barEl=$("bar"),timeEl=$("timeline"),doneEl=$("done"),rulesEl=$("rules"),liveEl=$("live");
var reduceMotion=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;

var SEGS=20,segs=[];
for(var i=0;i<SEGS;i++){ segs.push(barEl.appendChild(document.createElement("i"))); }

var cards=RULES.map(function(r,idx){
  var li=document.createElement("li");
  li.className="rule"; li.dataset.state="todo";
  li.innerHTML='<span class="hex" aria-hidden="true"></span><span class="txt"><strong></strong><em></em><span class="sr-only"></span></span>';
  li.querySelector(".hex").textContent=idx+1;
  li.querySelector("strong").textContent=r.t;
  li.querySelector("em").textContent=TODO;
  rulesEl.appendChild(li);
  return {li:li,hex:li.querySelector(".hex"),em:li.querySelector("em"),sr:li.querySelector(".sr-only"),state:"todo"};
});

var prevLvl=0,liveT=null;
function render(){
  var pw=pwEl.value, a=analyse(pw), x={pw:pw,a:a};
  var sec=a.guesses/2/RATE, L=pw?Math.log(a.guesses)/Math.LN10:0;

  fieldEl.classList.toggle("filled",pw.length>0);
  countEl.textContent=pw.length;

  /* défis */
  var passed=0;
  RULES.forEach(function(r,idx){
    var c=cards[idx], ok=pw?r.ok(x):false, state=!pw?"todo":(ok?"ok":"ko");
    if(ok) passed++;
    if(state!==c.state){
      if(state==="ok"&&!reduceMotion){ c.li.classList.remove("pop"); void c.li.offsetWidth; c.li.classList.add("pop"); }
      c.state=state; c.li.dataset.state=state;
      c.hex.textContent= state==="ok" ? "✓" : idx+1;
      c.sr.textContent= state==="ok" ? " Réussi." : state==="ko" ? " Pas encore." : "";
    }
    c.em.textContent= state==="ok" ? "Réussi !" : state==="ko" ? r.hint(x) : TODO;
  });
  doneEl.textContent=passed+" / "+RULES.length;
  doneEl.classList.toggle("zero",passed===0);

  /* niveau */
  var lvl= !pw ? 0 : sec<1 ? 1 : sec<86400 ? 2 : sec<100*YEAR ? 3 : passed===RULES.length ? 5 : 4;
  var lv=LEVELS[lvl];
  hudEl.dataset.lvl=lvl;
  document.documentElement.style.setProperty("--lv",lv.c);
  lvlEl.textContent="LV "+lvl;
  rankEl.textContent=lv.n;
  if(pw){ timeEl.innerHTML="Un pirate le trouve en <b></b>"; timeEl.lastChild.textContent=humanTime(sec); }
  else timeEl.textContent="Écris un mot de passe pour lancer l'attaque.";

  var lit= lvl===5 ? SEGS : pw ? Math.max(1,Math.min(SEGS-1,Math.round(L/FULL_LOG*SEGS))) : 0;
  for(var s=0;s<SEGS;s++) segs[s].classList.toggle("on",s<lit);

  if(lvl>prevLvl&&pw&&!reduceMotion){ hudEl.classList.remove("up"); void hudEl.offsetWidth; hudEl.classList.add("up"); }
  if(lvl===5&&prevLvl<5) confetti();
  prevLvl=lvl;

  clearTimeout(liveT);
  liveT=setTimeout(function(){
    liveEl.textContent= pw ? "Niveau "+lv.n+". Trouvé en "+humanTime(sec)+". "+passed+" défis sur "+RULES.length+"." : "";
  },800);
}

/* ============ idée de mot de passe : 4 mots au hasard ============ */
function rnd(n){
  if(window.crypto&&crypto.getRandomValues){ var b=new Uint32Array(1); crypto.getRandomValues(b); return b[0]%n; }
  return Math.floor(Math.random()*n);
}
var WORDS=GEN.filter(function(w){ return !TOPIDX.has(w); });
function makeIdea(){
  var pool=WORDS.slice(),w=[];
  for(var i=0;i<4;i++) w.push(pool.splice(rnd(pool.length),1)[0]);
  var u=rnd(4); w[u]=w[u].charAt(0).toUpperCase()+w[u].slice(1);
  return w.join("-")+"!"+(rnd(90)+10);
}
function ideaOk(p){
  var x={pw:p,a:analyse(p)};
  return x.a.guesses/2/RATE>=100*YEAR&&RULES.every(function(r){ return r.ok(x); });
}
$("idea").onclick=function(){
  var p=makeIdea();
  for(var n=0;n<40&&!ideaOk(p);n++) p=makeIdea();
  pwEl.value=p; render();
};

/* ============ confettis (niveau INCASSABLE) ============ */
var fx=$("fx"),ctx=fx.getContext("2d"),bits=[],fxRun=false;
function confetti(){
  if(reduceMotion) return;
  var dpr=Math.min(window.devicePixelRatio||1,2);
  fx.width=innerWidth*dpr; fx.height=innerHeight*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
  var cols=["#7CE05A","#26D0F2","#FFD23F","#FF9F43","#F2FBFD"];
  var r=hudEl.getBoundingClientRect(),ox=r.left+r.width/2,oy=Math.max(40,r.top+20);
  for(var i=0;i<90;i++){
    var ang=-Math.PI/2+(Math.random()-.5)*2.4, sp=5+Math.random()*7;
    bits.push({x:ox,y:oy,vx:Math.cos(ang)*sp,vy:Math.sin(ang)*sp,s:4+Math.random()*5,
               c:cols[i%cols.length],r:Math.random()*6,vr:(Math.random()-.5)*.4,life:70+Math.random()*40});
  }
  if(!fxRun){ fxRun=true; requestAnimationFrame(tick); }
}
function tick(){
  ctx.clearRect(0,0,innerWidth,innerHeight);
  bits=bits.filter(function(b){ return b.life>0; });
  bits.forEach(function(b){
    b.vy+=.25; b.vx*=.99; b.x+=b.vx; b.y+=b.vy; b.r+=b.vr; b.life--;
    ctx.save(); ctx.globalAlpha=Math.min(1,b.life/25); ctx.translate(b.x,b.y); ctx.rotate(b.r);
    ctx.fillStyle=b.c; ctx.fillRect(-b.s/2,-b.s/2,b.s,b.s*.6); ctx.restore();
  });
  if(bits.length) requestAnimationFrame(tick); else { fxRun=false; ctx.clearRect(0,0,innerWidth,innerHeight); }
}

/* ============ contrôles ============ */
pwEl.addEventListener("input",render);
pwEl.addEventListener("keydown",function(e){ if(e.key==="Enter") pwEl.blur(); });   /* ferme le clavier */
$("clear").onclick=function(){ pwEl.value=""; render(); pwEl.focus(); };
render();
})();
