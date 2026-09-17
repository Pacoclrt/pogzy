/* L'épreuve du mot de passe — CYBERTOUR Rouen 2026 */
(function(){
"use strict";

/* ============ réglages ============ */
var QR_FALLBACK="https://www.cybermalveillance.gouv.fr"; /* QR hors ligne ; en ligne il pointe vers le jeu */
var RATE=1e12;                                        /* ferme de cartes graphiques */
var ATTRACT_DELAY=30000;                              /* ms d'inactivité avant la démo */

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
function findWord(n,p){
  var best=null;
  function scan(list,base,step){
    for(var i=0;i<list.length;i++){var w=list[i];
      if(w.length>=3&&n.substr(p,w.length)===w&&(!best||w.length>best.len))
        best={len:w.length,guesses:base+i*step,word:w,list:list};}
  }
  scan(TOP,1,1); scan(NOMS,4000,60); scan(MOTS,25000,320);
  return best;
}
function charsetOf(s){
  var n=0;
  if(/[a-z]/.test(s))n+=26; if(/[A-Z]/.test(s))n+=26; if(/[0-9]/.test(s))n+=10;
  if(/ /.test(s))n+=1; if(/[àâäéèêëîïôöùûüçœ]/i.test(s))n+=16;
  if(/[^a-zA-Z0-9 àâäéèêëîïôöùûüçœ]/.test(s))n+=33;
  return n||1;
}
function isSeq(c){
  if(c.length<3)return false;
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
      var kind = w.list===TOP?"top" : w.list===NOMS?"name" : "word";
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
function shortNum(g){
  if(g<1000) return Math.round(g)+" essais";
  if(g<1e6) return Math.round(g/1000)+" k essais";
  if(g<1e9) return Math.round(g/1e6)+" M essais";
  return "10^"+Math.floor(Math.log(g)/Math.LN10)+" essais";
}
var KIND={
  top:  ["bad","top mondial"],
  name: ["bad","prénom"],
  word: ["bad","mot connu"],
  date: ["bad","date"],
  seq:  ["bad","suite"],
  repeat:["bad","répétition"],
  digits:["mid","chiffres"],
  brute:["good","au hasard"]
};

var VERDICTS=[[0,"Nul","var(--ko)"],[4,"Faible","var(--ko)"],[7,"Moyen","var(--warn)"],
              [10,"Correct","var(--warn)"],[14,"Solide","var(--ok)"],[19,"Costaud","var(--ok)"],
              [25,"Béton","var(--ok)"]];
function verdictOf(L){var v=VERDICTS[0];for(var i=0;i<VERDICTS.length;i++) if(L>=VERDICTS[i][0]) v=VERDICTS[i]; return v;}

/* ============ règles ============ */
var RULES=[
 {t:"8 caractères minimum",s:"ANSSI",w:"En dessous, c'est cassé en quelques secondes.",f:function(x){return x.pw.length>=8}},
 {t:"Une majuscule et une minuscule",s:"CNIL",w:"Deux casses, c'est l'alphabet doublé.",f:function(x){return x.a.lower&&x.a.upper}},
 {t:"Au moins un chiffre",s:"CNIL",w:"Mais pas à la fin : tout le monde fait ça.",f:function(x){return x.a.digit}},
 {t:"Au moins un caractère spécial",s:"CNIL",w:"Ponctuation, symbole, espace : tout compte.",f:function(x){return x.a.symbol}},
 {t:"Pas dans le top des mots de passe",s:"Cybermalveillance",w:"Celui-là est testé en tout premier.",f:function(x){return !x.a.top}},
 {t:"12 caractères minimum",s:"ANSSI · CNIL",w:"C'est le seuil recommandé par l'État.",f:function(x){return x.pw.length>=12}},
 {t:"Pas de suite clavier ni de répétition",s:"ANSSI",w:"azerty, 1234, aaa : déjà dans les listes.",f:function(x){return !x.a.seq&&!x.a.repeat}},
 {t:"Pas d'année ni de date",s:"Cybermalveillance",w:"Ta date de naissance se trouve en ligne.",f:function(x){return !x.a.date}},
 {t:"Pas de mot connu — sauf quatre d'affilée",s:"ANSSI",w:"Un mot seul tombe, même en l33t. Quatre mots tiennent.",f:function(x){return x.a.words.length===0||x.a.words.length>=4}},
 {t:"16 caractères minimum",s:"Bonne pratique",w:"Chaque caractère en plus multiplie le travail.",f:function(x){return x.pw.length>=16}},
 {t:"Tenir plus de 100 ans",s:"Objectif",w:"C'est le temps affiché plus haut. Vise le siècle.",f:function(x){return x.a.guesses/2/RATE>=100*YEAR}}
];

/* ============ DOM ============ */
var $=function(i){return document.getElementById(i)};
var pwEl=$("pw"),field=$("field"),rulesEl=$("rules"),lockedEl=$("locked"),progEl=$("progress"),
    winEl=$("win"),countEl=$("count"),timeEl=$("time"),vwordEl=$("vword"),meter=$("meter"),
    dotsEl=$("dots"),liveEl=$("live"),partsEl=$("parts"),blocksEl=$("blocks"),todayEl=$("today");
var lastEtat="",liveT=null;

var SEGS=26,segs=[];
for(var i=0;i<SEGS;i++){var d=document.createElement("i");meter.appendChild(d);segs.push(d);}
var dots=[];
for(var i2=0;i2<RULES.length;i2++){var dd=document.createElement("i");dotsEl.appendChild(dd);dots.push(dd);}

var NORA=[
 "Crochet commence par les mots de passe courts. Donne-moi au moins 8 caractères.",
 "Bien. Il teste maintenant tout en minuscules. Mélange les casses.",
 "Ajoute un chiffre. Pas à la fin : il connaît ce réflexe.",
 "Un symbole, maintenant. Ça va l'embrouiller.",
 "Attention : il charge la liste des mots de passe les plus utilisés.",
 "Il accélère. Monte à 12 caractères.",
 "Il essaie les suites de clavier : azerty, 1234…",
 "Il fouille tes réseaux sociaux. Aucune date de naissance.",
 "Il lance son dictionnaire. Un mot seul ne tiendra pas. Quatre, oui.",
 "Presque. Rallonge encore : 16 caractères.",
 "Dernière défense. Il faut tenir un siècle."
];
var TAUNTS=["Trop facile.","Déjà cassé. Suivant.","Je l'avais dans ma liste.","Moins d'une seconde. Merci."];
var reduceMotion=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
var sayT=null,lastSay="",speaker="nora";
function say(who,msg){
  if(who+msg===lastSay) return;
  lastSay=who+msg; speaker=who;
  $("radio").className="radio"+(who==="crochet"?" crochet":"");
  $("radio-who").textContent= who==="crochet" ? "Crochet · le pirate" : "Nora · cellule cyber";
  var el=$("radio-msg"); clearInterval(sayT);
  el.innerHTML='<span></span><span class="ghost"></span>';
  var shown=el.firstChild,rest=el.lastChild;
  if(reduceMotion){ shown.textContent=msg; return; }
  var i=0; rest.textContent=msg;
  sayT=setInterval(function(){
    i++; shown.textContent=msg.slice(0,i); rest.textContent=msg.slice(i);
    if(i>=msg.length) clearInterval(sayT);
  },16);
}
var unlocked=1,nodes=[],bestLog=0;
function buildRule(idx){
  var r=RULES[idx],li=document.createElement("li");
  li.className="rule new";
  li.innerHTML='<span class="n" aria-hidden="true">'+String(idx+1).padStart(2,"0")+'</span>'+
    '<span class="etat sr-only"></span>'+
    '<span class="body"><span class="lbl"></span><span class="src"></span><span class="why"></span></span>'+
    '<span class="mark" aria-hidden="true"></span>';
  li.querySelector(".lbl").textContent=r.t;
  li.querySelector(".src").textContent=r.s;
  li.querySelector(".why").textContent=r.w;
  rulesEl.appendChild(li); nodes.push(li);
  setTimeout(function(){li.classList.remove("new")},320);
  say("nora",NORA[idx]);
}
buildRule(0);

var prevPassed=0,tauntT=null;
function render(){
  var pw=pwEl.value,a=analyse(pw),st={pw:pw,a:a};
  var sec=a.guesses/2/RATE;
  var L=pw?Math.log(a.guesses)/Math.LN10:0;
  var v=verdictOf(L);

  field.classList.toggle("filled",pw.length>0);
  countEl.textContent=pw.length;
  countEl.classList.toggle("good",pw.length>=16);
  timeEl.textContent=pw?humanTime(sec):"—";
  vwordEl.textContent=pw?v[1]:"À toi";
  vwordEl.style.setProperty("--vc",pw?v[2]:"var(--ink-2)");

  /* décomposition */
  partsEl.classList.toggle("on",pw.length>0);
  if(pw.length){
    blocksEl.innerHTML="";
    a.parts.forEach(function(p){
      var k=KIND[p.k]||KIND.brute,el=document.createElement("div");
      el.className="blk "+k[0];
      el.innerHTML='<u></u><em></em>';
      el.firstChild.textContent=p.t;
      el.lastChild.textContent=k[1]+" · "+shortNum(p.g);
      blocksEl.appendChild(el);
    });
  }

  var lit=pw?Math.max(1,Math.min(SEGS,Math.round(L))):0;
  for(var i=0;i<SEGS;i++){
    segs[i].classList.toggle("on",i<lit);
    if(i<lit) segs[i].style.setProperty("--mc",v[2]);
  }

  var allOk=true;
  for(var k=0;k<unlocked;k++){ if(!RULES[k].f(st)){ allOk=false; break; } }
  if(allOk&&pw&&unlocked<RULES.length){ unlocked++; buildRule(unlocked-1); }

  var passed=0;
  for(var j=0;j<unlocked;j++){
    var ok=pw?RULES[j].f(st):false;
    if(ok) passed++;
    nodes[j].classList.toggle("ok",ok);
    nodes[j].classList.toggle("ko",!ok);
    nodes[j].querySelector(".mark").textContent=ok?"✓":"✕";
    nodes[j].querySelector(".etat").textContent="Règle "+(j+1)+", "+(ok?"validée. ":"pas encore. ");
  }
  for(var q=0;q<RULES.length;q++) dots[q].className = q>=unlocked ? "" : (pw&&RULES[q].f(st)?"ok":"ko");

  if(passed>prevPassed) beep(880,.07); else if(passed<prevPassed) beep(150,.13,"sawtooth");
  prevPassed=passed;

  var reste=RULES.length-unlocked;
  lockedEl.style.display = reste>0 ? "flex" : "none";
  if(reste>0) lockedEl.lastChild.innerHTML="Encore <b>"+reste+"</b> règle"+(reste>1?"s":"")+" à débloquer.";

  var full=passed===RULES.length;
  progEl.textContent=passed+" / "+RULES.length;
  clearTimeout(tauntT);
  if(full){ say("nora","Il abandonne. Ton compte tient. Mais écoute la suite…"); if(!attractOn) noteWin(pw); }
  else if(pw&&sec<1){ tauntT=setTimeout(function(){ say("crochet",TAUNTS[rnd(TAUNTS.length)]); },1100); }
  else if(speaker==="crochet"){ say("nora",NORA[unlocked-1]); }
  if(full&&!winEl.classList.contains("show")){ beep(660,.1); setTimeout(function(){beep(990,.18)},130); }
  winEl.classList.toggle("show",full);
  if(L>bestLog){ bestLog=L; }

  var etat = full ? "Les 11 règles sont validées."
                  : passed+" règle"+(passed>1?"s":"")+" validée"+(passed>1?"s":"")+" sur "+unlocked+
                    ". Cassé en "+(pw?humanTime(sec):"—")+".";
  if(etat!==lastEtat){ lastEtat=etat; clearTimeout(liveT); liveT=setTimeout(function(){ liveEl.textContent=etat; },700); }

  if(!attractOn) noteTest(pw,L,sec);
  return {passed:passed,L:L,sec:sec};
}

function resetGame(){
  pwEl.value="";
  unlocked=1; nodes=[]; prevPassed=0; rulesEl.innerHTML=""; buildRule(0);
  winEl.classList.remove("show");
  $("domino").classList.remove("on"); $("quiz").classList.remove("on");
  $("domino-concl").classList.remove("on");
  render();
}

/* ============ son ============ */
var soundOn=false,actx=null;
function beep(f,dur,type){
  if(!soundOn) return;
  try{
    if(!actx) actx=new (window.AudioContext||window.webkitAudioContext)();
    if(actx.state==="suspended") actx.resume();
    var o=actx.createOscillator(),g=actx.createGain();
    o.type=type||"sine"; o.frequency.value=f;
    g.gain.setValueAtTime(.05,actx.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001,actx.currentTime+dur);
    o.connect(g); g.connect(actx.destination);
    o.start(); o.stop(actx.currentTime+dur);
  }catch(e){}
}
function setSound(on){
  soundOn=on;
  $("sound").setAttribute("aria-pressed",on);
  $("sound").textContent=on?"Son activé":"Son coupé";
  $("a-sound").textContent=on?"Couper le son":"Activer le son";
  if(on) beep(660,.08);
}
$("sound").onclick=function(){ setSound(!soundOn); };
$("a-sound").onclick=function(){ setSound(!soundOn); };

/* ============ compteur du jour (reste sur cet appareil) ============ */
var STORE="cybertour-mdp-stats",seen={},wonSeen={},noteT=null;
function todayKey(){ var d=new Date(); return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); }
function emptyStats(){ return {date:todayKey(),count:0,wins:0,bestLog:0,bestTime:"—"}; }
function loadStats(){
  var s=null;
  try{ s=JSON.parse(localStorage.getItem(STORE)); }catch(e){}
  return (s&&s.date===todayKey()) ? s : emptyStats();
}
var stats=loadStats();
function saveStats(){ try{ localStorage.setItem(STORE,JSON.stringify(stats)); }catch(e){} }
function paintStats(){
  todayEl.style.display="inline";
  todayEl.innerHTML="Aujourd'hui · <b>"+stats.count+"</b> essai"+(stats.count>1?"s":"")+" · <b>"+stats.wins+"</b> compte"+(stats.wins>1?"s":"")+" sauvé"+(stats.wins>1?"s":"");
  $("a-stat").innerHTML="Essais comptés : <b>"+stats.count+"</b><br>Comptes sauvés : <b>"+stats.wins+"</b><br>Meilleur score : <b>"+stats.bestTime+"</b>";
}
function freshDay(){ if(stats.date!==todayKey()){ stats=emptyStats(); seen={}; wonSeen={}; } }
function noteWin(pw){
  freshDay();
  if(wonSeen[pw]) return;
  wonSeen[pw]=1; stats.wins++; saveStats(); paintStats();
}
function noteTest(pw,L,sec){
  if(pw.length<6) return;
  clearTimeout(noteT);
  noteT=setTimeout(function(){
    freshDay();
    if(seen[pw]) return;
    seen[pw]=1; stats.count++;
    if(L>stats.bestLog){ stats.bestLog=L; stats.bestTime=humanTime(sec); }
    saveStats(); paintStats();
  },2500);
}
$("a-zero").onclick=function(){ stats=emptyStats(); seen={}; wonSeen={}; saveStats(); paintStats(); };
paintStats();

/* ============ QR code ============ */
try{
  var online=/^https?:$/.test(location.protocol)&&!/^(localhost|127\.|\[::1\])/.test(location.hostname);
  var target=online ? location.origin+location.pathname : QR_FALLBACK;
  if(online){
    $("qr-h").textContent="Rejoue chez toi";
    $("qr-p").textContent="Scanne pour retrouver le jeu sur ton téléphone, avec les conseils et les numéros utiles.";
  }
  if(window.qrcode){
    var qr=qrcode(0,"M"); qr.addData(target); qr.make();
    var cv=$("qrc"),ctx=cv.getContext("2d"),n=qr.getModuleCount(),quiet=2,cell=Math.max(3,Math.floor(150/(n+quiet*2)));
    var dim=cell*(n+quiet*2);
    cv.width=dim; cv.height=dim;
    ctx.fillStyle="#FFFFFF"; ctx.fillRect(0,0,dim,dim);
    ctx.fillStyle="#0D3A46";
    for(var qy=0;qy<n;qy++) for(var qx=0;qx<n;qx++)
      if(qr.isDark(qy,qx)) ctx.fillRect((qx+quiet)*cell,(qy+quiet)*cell,cell,cell);
    $("qr").classList.add("on");
  }
}catch(e){}

/* ============ défi 60 s ============ */
var chronoT=null,chronoLeft=0;
function startChrono(){
  stopAttract(); resetGame();
  chronoLeft=60;
  $("chrono").classList.add("on");
  $("chrono-txt").textContent="Crochet arrive. Tiens le plus de défenses possible.";
  tickChrono();
  chronoT=setInterval(tickChrono,1000);
  pwEl.focus();
}
function tickChrono(){
  $("chrono-n").textContent=chronoLeft;
  $("chrono-bar").style.width=(chronoLeft/60*100)+"%";
  if(chronoLeft<=0){
    clearInterval(chronoT); chronoT=null;
    var r=render();
    $("chrono-n").textContent="0";
    $("chrono-txt").textContent="Crochet est là. Tu tiens "+r.passed+" défense"+(r.passed>1?"s":"")+" sur 11.";
    say(r.passed===11?"nora":"crochet", r.passed===11?"Il est reparti bredouille. Bien joué.":"Merci pour le mot de passe.");
    beep(520,.12); setTimeout(function(){beep(392,.22)},140);
    return;
  }
  if(chronoLeft<=5) beep(700,.05);
  chronoLeft--;
}
function stopChrono(){
  if(chronoT){ clearInterval(chronoT); chronoT=null; }
  $("chrono").classList.remove("on");
}
$("challenge").onclick=startChrono;
$("a-chrono").onclick=function(){ startChrono(); closeAnim(); };

/* ============ domino de la réutilisation ============ */
var COMPTES=["Réseau social","Messagerie","Jeu en ligne","Boîte mail","Espace scolaire","Boutique en ligne"];
$("go-domino").onclick=function(){
  var box=$("tiles"); box.innerHTML="";
  $("domino").classList.add("on");
  $("domino-concl").classList.remove("on");
  COMPTES.forEach(function(nom,i){
    var t=document.createElement("div");
    t.className="tile"; t.innerHTML='<span></span><b></b>';
    t.firstChild.textContent=nom;
    t.lastChild.textContent="intact";
    box.appendChild(t);
    setTimeout(function(){
      t.classList.add(i===0?"first":"down");
      t.lastChild.textContent=i===0?"piraté":"tombé";
      beep(i===0?200:300-i*20,.09,"sawtooth");
      if(i===COMPTES.length-1) setTimeout(function(){ $("domino-concl").classList.add("on"); },350);
    }, 450+i*380);
  });
  $("domino").scrollIntoView({behavior:"smooth",block:"nearest"});
};

/* ============ quiz éclair ============ */
var QUIZ=[
 {q:"Ajouter un « ! » à la fin de mon mot de passe le rend beaucoup plus solide.",a:0,
  e:"Faux. Le symbole ajouté au bout est le premier réflexe testé. C'est la longueur qui compte."},
 {q:"Si mon mot de passe est très solide, je peux l'utiliser sur tous mes comptes.",a:0,
  e:"Faux. Un seul site piraté, et tous tes comptes tombent avec lui."},
 {q:"Quatre mots au hasard sont plus solides que « P@ssw0rd! ».",a:1,
  e:"Vrai. Bien plus longs, et absents des listes d'attaque."}
];
var qi=0,qscore=0;
function showQ(){
  $("qnum").textContent="Débriefing · question "+(qi+1)+" sur "+QUIZ.length;
  $("qtext").textContent=QUIZ[qi].q;
  $("qfb").className="qfb";
  Array.prototype.forEach.call(document.querySelectorAll(".qacts button"),function(b){b.disabled=false});
}
$("go-quiz").onclick=function(){
  qi=0; qscore=0; $("quiz").classList.add("on"); showQ();
  $("quiz").scrollIntoView({behavior:"smooth",block:"nearest"});
};
Array.prototype.forEach.call(document.querySelectorAll(".qacts button"),function(b){
  b.onclick=function(){
    var good=+b.dataset.a===QUIZ[qi].a;
    if(good) qscore++;
    beep(good?880:180,.12,good?"sine":"sawtooth");
    var fb=$("qfb");
    fb.className="qfb on "+(good?"yes":"no");
    fb.textContent=QUIZ[qi].e;
    Array.prototype.forEach.call(document.querySelectorAll(".qacts button"),function(x){x.disabled=true});
    setTimeout(function(){
      qi++;
      if(qi<QUIZ.length){ showQ(); }
      else{
        $("qnum").textContent="Débriefing terminé";
        $("qtext").textContent=qscore+" bonne"+(qscore>1?"s":"")+" réponse"+(qscore>1?"s":"")+" sur "+QUIZ.length+".";
        $("qfb").className="qfb on yes";
        $("qfb").textContent="À retenir : un mot de passe par compte, la double authentification partout, et jamais le donner à personne.";
        Array.prototype.forEach.call(document.querySelectorAll(".qacts button"),function(x){x.style.display="none"});
      }
    },2600);
  };
});

/* ============ mode vitrine ============ */
var attractOn=false,attractT=null,idleT=null,typeT=null;
var DEMO=[{p:"Lucas2011",hold:2600},{p:"tortue-Orage-pixel-fromage!42",hold:3800}];
function typeIn(text,done){
  var i=0;
  (function step(){
    if(!attractOn) return;
    pwEl.value=text.slice(0,++i); render();
    if(i<text.length) typeT=setTimeout(step,70); else typeT=setTimeout(done,0);
  })();
}
function eraseAll(done){
  (function step(){
    if(!attractOn) return;
    var v=pwEl.value;
    if(!v.length){ typeT=setTimeout(done,250); return; }
    pwEl.value=v.slice(0,-1); render(); typeT=setTimeout(step,28);
  })();
}
function attractLoop(n){
  if(!attractOn) return;
  var step=DEMO[n%DEMO.length];
  resetGame();
  typeIn(step.p,function(){
    typeT=setTimeout(function(){ eraseAll(function(){ attractLoop(n+1); }); },step.hold);
  });
}
function startAttract(){
  if(attractOn) return;
  attractOn=true;
  document.body.classList.add("attract-on");
  $("attract").classList.add("on");
  attractLoop(0);
}
function stopAttract(){
  if(!attractOn) return;
  attractOn=false;
  clearTimeout(typeT);
  document.body.classList.remove("attract-on");
  $("attract").classList.remove("on");
  resetGame();
}
function resetIdle(){
  clearTimeout(idleT);
  idleT=setTimeout(startAttract,ATTRACT_DELAY);
}
["keydown","pointerdown","touchstart","wheel"].forEach(function(ev){
  document.addEventListener(ev,function(){ stopAttract(); resetIdle(); },{passive:true});
});
$("a-attract").onclick=function(){ closeAnim(); resetIdle(); setTimeout(startAttract,60); };

/* ============ panneau animateur ============ */
var CAS=[
 {p:"123456",n:"Le plus utilisé au monde. Cassé instantanément."},
 {p:"Marseille13!",n:"Ville + code postal + symbole : le faux sentiment de sécurité."},
 {p:"Lucas2011",n:"Prénom + année de naissance. Les deux se trouvent en ligne."},
 {p:"P@ssw0rd!",n:"Le l33t : les logiciels font la substitution tout seuls."},
 {p:"aaaaaaaaaaaa",n:"Douze caractères… mais une seule répétition."},
 {p:"tortue-Orage-pixel-fromage!42",n:"La phrase de passe. Toutes les règles d'un coup."}
];
var casBox=$("a-cases");
CAS.forEach(function(c){
  var b=document.createElement("button");
  b.className="demo"; b.type="button";
  b.innerHTML="<u></u><em></em>";
  b.firstChild.textContent=c.p; b.lastChild.textContent=c.n;
  b.onclick=function(){ stopAttract(); pwEl.value=c.p; render(); pwEl.focus(); };
  casBox.appendChild(b);
});
function openAnim(){ $("anim").classList.add("on"); }
function closeAnim(){ $("anim").classList.remove("on"); }
$("anim-open").onclick=openAnim;
$("anim-close").onclick=closeAnim;
$("a-reset").onclick=function(){ stopAttract(); stopChrono(); resetGame(); closeAnim(); pwEl.focus(); };
document.addEventListener("keydown",function(e){
  if(e.ctrlKey&&e.altKey&&(e.key==="a"||e.key==="A")){
    e.preventDefault();
    $("anim").classList.toggle("on");
  }
  if(e.key==="Escape") closeAnim();
});

/* ============ contrôles ============ */
function rnd(n){
  if(window.crypto&&crypto.getRandomValues){var a=new Uint32Array(1);crypto.getRandomValues(a);return a[0]%n;}
  return (Math.random()*n)|0;
}
$("gen").onclick=function(){
  var pool=GEN.slice(),w=[];
  for(var i=0;i<4;i++) w.push(pool.splice(rnd(pool.length),1)[0]);
  var u=rnd(4); w[u]=w[u].charAt(0).toUpperCase()+w[u].slice(1);
  pwEl.value=w.join("-")+"!"+(rnd(90)+10);
  pwEl.focus(); render();
};
Array.prototype.forEach.call(document.querySelectorAll(".chip[data-pw]"),function(b){
  b.onclick=function(){ pwEl.value=b.dataset.pw; pwEl.focus(); render(); };
});
$("clear").onclick=function(){ pwEl.value=""; pwEl.focus(); render(); };

var root=document.documentElement;
root.lang="fr";
$("theme").onclick=function(){
  if(root.getAttribute("data-theme")==="dark"){ root.setAttribute("data-theme","light"); this.textContent="Mode sombre"; }
  else { root.setAttribute("data-theme","dark"); this.textContent="Mode clair"; }
};
if(window.matchMedia&&matchMedia("(prefers-color-scheme:dark)").matches) $("theme").textContent="Mode clair";

pwEl.addEventListener("input",function(){ stopAttract(); render(); });
pwEl.value="Azerty2011"; seen["Azerty2011"]=1;
render();
resetIdle();
setTimeout(function(){pwEl.focus();pwEl.select()},200);
})();
