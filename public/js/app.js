(function(){
"use strict";
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
const SC="https://shared.akamai.steamstatic.com/store_item_assets/";
const LT="https://raw.githubusercontent.com/libretro-thumbnails/";

/* ===================== textos ===================== */
const GENRE_ES={accion:"Acción",aventura:"Aventura",rpg:"Rol (RPG)",estrategia:"Estrategia",simulacion:"Simulación",gestion:"Gestión",puzle:"Puzle",plataformas:"Plataformas",shooter:"Disparos",shmup:"Matamarcianos",lucha:"Lucha",beatemup:"Beat 'em up",carreras:"Carreras",deportes:"Deportes",terror:"Terror",roguelike:"Roguelike",metroidvania:"Metroidvania",novela:"Novela visual",pointclick:"Point & click",supervivencia:"Supervivencia",mundoabierto:"Mundo abierto",ritmo:"Música y ritmo",cartas:"Cartas y tablero",casual:"Casual",arcade:"Arcade",sigilo:"Sigilo",mmo:"MMO",party:"Party",educativo:"Educativo"};
const GENRE_HUE={accion:8,aventura:165,rpg:275,estrategia:215,simulacion:190,gestion:45,puzle:300,plataformas:100,shooter:355,shmup:325,lucha:18,beatemup:30,carreras:200,deportes:130,terror:340,roguelike:258,metroidvania:235,novela:315,pointclick:175,supervivencia:80,mundoabierto:150,ritmo:290,cartas:55,casual:120,arcade:40,sigilo:245,mmo:225,party:60,educativo:140};
const TAG_ES={"Atmospheric":"Atmosférico","Story Rich":"Gran historia","Pixel Graphics":"Pixel art","Exploration":"Exploración","Cute":"Adorable","Colorful":"Colorido","First-Person":"Primera persona","Fantasy":"Fantasía","Funny":"Divertido","Sci-fi":"Ciencia ficción","Female Protagonist":"Protagonista femenina","Relaxing":"Relajante","Family Friendly":"Para toda la familia","Difficult":"Difícil","Third Person":"Tercera persona","Top-Down":"Vista cenital","Comedy":"Comedia","Great Soundtrack":"Gran banda sonora","Stylized":"Estilizado","Realistic":"Realista","Violent":"Violento","Mystery":"Misterio","Choices Matter":"Decisiones importantes","Minimalist":"Minimalista","Physics":"Físicas","Cartoony":"Caricaturesco","Dark":"Oscuro","Side Scroller":"Scroll lateral","Building":"Construcción","Multiple Endings":"Varios finales","Space":"Espacio","Hand-drawn":"Dibujado a mano","Character Customization":"Personalización","Linear":"Lineal","Procedural Generation":"Generación procedimental","Turn-Based Combat":"Combate por turnos","Historical":"Histórico","Magic":"Magia","Old School":"Vieja escuela","Turn-Based":"Por turnos","Immersive Sim":"Simulación inmersiva","Zombies":"Zombis","Replay Value":"Rejugable","Cartoon":"Dibujos animados","Isometric":"Isométrico","Dark Fantasy":"Fantasía oscura","War":"Guerra","Surreal":"Surrealista","1990's":"Años 90","Futuristic":"Futurista","Post-apocalyptic":"Postapocalíptico","Fast-Paced":"Ritmo frenético","Text-Based":"Basado en texto","Emotional":"Emotivo","Military":"Militar","Classic":"Clásico","Short":"Corto","Nature":"Naturaleza","Abstract":"Abstracto","1980s":"Años 80","Perma Death":"Muerte permanente","Dark Humor":"Humor negro","Cinematic":"Cinematográfico","Narration":"Narración","Demons":"Demonios","Psychological":"Psicológico","Aliens":"Alienígenas","Lovecraftian":"Lovecraftiano","Pirates":"Piratas","Dragons":"Dragones","Vampire":"Vampiros","Cats":"Gatos","Dog":"Perros","Underwater":"Submarino","Time Travel":"Viajes en el tiempo","Crafting":"Crafteo","Loot":"Botín","Base-Building":"Construir bases","Resource Management":"Gestión de recursos","Precision Platformer":"Plataformas de precisión","Wholesome":"Entrañable","Cozy":"Acogedor","Detective":"Detectives","Investigation":"Investigación","Dark Comedy":"Comedia negra","Superhero":"Superhéroes","Mythology":"Mitología","World War II":"II Guerra Mundial","Trains":"Trenes","Cooking":"Cocina","Fishing":"Pesca","Life Sim":"Simulador de vida","Beautiful":"Precioso","Lore-Rich":"Mucho trasfondo","Nonlinear":"No lineal","Drama":"Drama","Romance":"Romance","Robots":"Robots","Medieval":"Medieval","Thriller":"Thriller","Memes":"Memes","Cyberpunk":"Cyberpunk","Souls-like":"Soulslike","Collectathon":"Coleccionables","Dungeon Crawler":"Mazmorras","Party-Based RPG":"RPG de grupo","Deckbuilding":"Construcción de mazos","Card Battler":"Batallas de cartas","Inventory Management":"Gestión de inventario","Bullet Hell":"Bullet hell","Twin Stick Shooter":"Twin stick","Hack and Slash":"Hack and slash","Action RPG":"RPG de acción","Tactical RPG":"RPG táctico","Turn-Based Tactics":"Tácticas por turnos","City Builder":"Construcción de ciudades","Colony Sim":"Colonias","Farming Sim":"Granjas","Space Sim":"Simulador espacial","Automobile Sim":"Simulador de coches","Grid-Based Movement":"Movimiento por casillas","Spectacle fighter":"Acción espectacular","Martial Arts":"Artes marciales","Noir":"Noir","Western":"Western","Steampunk":"Steampunk","Ninja":"Ninjas","Mechs":"Mechas","Dinosaurs":"Dinosaurios","Supernatural":"Sobrenatural","Conversation":"Conversación","Tutorial":"Tutorial","Episodic":"Por episodios","Sequel":"Secuela","Remake":"Remake","Cult Classic":"De culto","Experimental":"Experimental","Escape Room":"Escape room","Typing":"Mecanografía","Programming":"Programación","Philosophical":"Filosófico","Political":"Político","Parody":"Parodia","Satire":"Sátira","Heist":"Atracos","Crime":"Crimen","Hunting":"Caza","Horses":"Caballos","Snow":"Nieve","Mars":"Marte","Underground":"Subterráneo","Naval":"Naval","Flight":"Vuelo","Sniper":"Francotirador","Stealth":"Sigilo","Parkour":"Parkour","Rhythm":"Ritmo","Open World":"Mundo abierto","Sandbox":"Sandbox","Bikes":"Bicis","Boxing":"Boxeo","Golf":"Golf","Chess":"Ajedrez","Solitaire":"Solitario","Mahjong":"Mahjong","Football (Soccer)":"Fútbol","Basketball":"Baloncesto","Tennis":"Tenis","Agriculture":"Agricultura","Economy":"Economía","Trading":"Comercio","Medical Sim":"Simulador médico","Political Sim":"Simulador político","God Game":"Dios","Asynchronous Multiplayer":"Multijugador asíncrono","Time Manipulation":"Manipular el tiempo","Destruction":"Destrucción","Gun Customization":"Personalizar armas","Vehicular Combat":"Combate con vehículos","Combat Racing":"Carreras de combate","Mystery Dungeon":"Mazmorras misteriosas","Creature Collector":"Colecciona criaturas","Artificial Intelligence":"Inteligencia artificial","Alternate History":"Historia alternativa","Dystopian":"Distópico","Transhumanism":"Transhumanismo","Comic Book":"Cómic","Hand-Drawn":"Dibujado a mano","Lore Rich":"Mucho trasfondo"};
const tagName=t=>TAG_ES[t]||t;
const MOODS=[
  {k:"chill",n:"Tarde tranquila",c:"#2fd0b5",f:{genres:["casual","puzle","simulacion"],tags:["Relaxing","Cozy","Cute","Wholesome"],dur:"mid"}},
  {k:"hard",n:"Quiero sufrir",c:"#ff5a36",f:{tags:["Difficult","Souls-like","Precision Platformer","Perma Death"],origin:"pc"}},
  {k:"story",n:"Historia que engancha",c:"#a07cff",f:{tags:["Story Rich","Choices Matter","Multiple Endings","Emotional"],players:"solo",score:"80"}},
  {k:"sofa",n:"Sofá con amigos",c:"#ffc93c",f:{players:"local",control:"padany"}},
  {k:"online",n:"Online con colegas",c:"#7383ff",f:{players:"coop",origin:"pc",score:"75"}},
  {k:"16bit",n:"Nostalgia 16 bits",c:"#ff7ab4",f:{origin:"retro",systems:["snes","md","pce"],cover:true}},
  {k:"fear",n:"Pasar miedo",c:"#c23a5a",f:{genres:["terror"]}},
  {k:"short",n:"Algo corto para hoy",c:"#43d38e",f:{dur:"short",origin:"pc",score:"80"}},
  {k:"gems",n:"Joyas indie",c:"#ffb057",f:{disc:"gems",origin:"pc"}},
  {k:"open",n:"Perderme horas",c:"#4fb3ff",f:{genres:["mundoabierto","rpg"],dur:"epic",score:"80"}},
  {k:"hand",n:"Portátiles clásicas",c:"#c6e04a",f:{origin:"retro",systems:["gb","gbc","gba","nds","psp","gg"],cover:true}},
  {k:"ps",n:"Era PlayStation",c:"#6a8cff",f:{origin:"retro",systems:["ps1","ps2"],cover:true}},
  {k:"free",n:"Gratis y bueno",c:"#2fd0b5",f:{price:"free",origin:"pc",score:"80",reviews:"1000"}},
  {k:"es",n:"Doblado al español",c:"#ffc93c",f:{esvoz:true,origin:"pc",score:"80"}},
];

/* ===================== estado ===================== */
const NOW=new Date().getFullYear();
// DEFAULTS está congelado: los filtros activos siempre son una copia (antes compartían las listas y
// marcar un género cambiaba también los valores por defecto, así que «Restablecer» no los quitaba).
const DEFAULTS=Object.freeze({origin:"all",systems:Object.freeze([]),genres:Object.freeze([]),xgenres:Object.freeze([]),tags:Object.freeze([]),control:"any",players:"any",dur:"any",from:0,to:0,disc:"balanced",mix:60,score:"0",reviews:"0",price:"any",es:false,esvoz:false,nojp:false,norepeat:true,cover:false,adult:true,vr:true,early:false,linux:false,mood:""});
const freshFilters=()=>JSON.parse(JSON.stringify(DEFAULTS));
const cloneF=f=>JSON.parse(JSON.stringify(f));
const store={get(k,d){try{const v=localStorage.getItem("pp2:"+k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem("pp2:"+k,JSON.stringify(v))}catch(e){}}};
const isObj=v=>v&&typeof v==="object"&&!Array.isArray(v);
const asArr=v=>Array.isArray(v)?v:[];
// Lo guardado se valida al arrancar (sanitizeFilters / loadSaved): datos corruptos o de otra versión no rompen la página.
let F=freshFilters();
let LIST=[],DISC=new Set(),HIST=[];
let CFG=Object.assign({sound:true,r2s:"auto",autoplay:false,steamApi:true,rstyle:"reel",cards:5,duel:8},isObj(store.get("cfg",null))?store.get("cfg",{}):{});delete CFG.rawg;
if(!["reel","wheel"].includes(CFG.rstyle))CFG.rstyle="reel";if(![3,5,7].includes(CFG.cards))CFG.cards=5;if(![4,8,16].includes(CFG.duel))CFG.duel=8;
let PC,RETRO,ALL=[],BYID=new Map(),KEYS=new Map(),POOL=[],BROWSE=[],CUM=null,SIM=null,XALL=false,FL={},GI={},SYSK=[];
let VIEW="ruleta";

/* ===================== utilidades ===================== */
const fmt=n=>n.toLocaleString("es-ES");
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function rng(seed){let a=seed>>>0;return()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
const has=(g,k)=>g.s===0&&((g.f>>>FL[k])&1)===1;
function genresOf(g){const o=[];for(let i=0;i<PC.genres.length;i++)if(g.gm>>>i&1)o.push(PC.genres[i]);return o}
const sysOf=g=>RETRO.systems[g.sys];
const platShort=g=>g.s?sysOf(g).short:(has(g,"gog")?"GOG":"PC");
const devOf=g=>(g.s?RETRO.devs:PC.devs)[g.dv]||"";
function save(){store.set("filters",F)}
/* ---------- identificadores estables ----------
   Mi lista, el historial y los descartados se guardan con una clave que no depende de la posición del juego en los
   datos (steam:<appid>, gog:<nombre>, r:<consola>:<nombre>), así sobreviven a regenerar el catálogo con tools/. */
function keyOf(g){return g.s?`r:${SYSK[g.sys]}:${g.lc}`:g.app?`steam:${g.app}`:`gog:${g.lc}`}
function gameFrom(ref){if(typeof ref!=="string")return null;return /^[pr]\d+$/.test(ref)?BYID.get(ref)||null:KEYS.get(ref)||null}
function saveList(){store.set("list",LIST.map(x=>({k:keyOf(BYID.get(x.id)),played:!!x.played})))}
function saveHist(){store.set("history",HIST.map(id=>keyOf(BYID.get(id))))}
function saveDisc(){store.set("discarded",[...DISC].map(id=>keyOf(BYID.get(id))))}
function loadSaved(){
  const ids=arr=>{const out=[];for(const r of asArr(arr)){const g=gameFrom(r);if(g&&!out.includes(g.id))out.push(g.id)}return out};
  HIST=ids(store.get("history",[])).slice(0,120);
  DISC=new Set(ids(store.get("discarded",[])));
  LIST=[];for(const x of asArr(store.get("list",[]))){if(!isObj(x))continue;const g=gameFrom(x.k||x.id);if(g&&!LIST.some(y=>y.id===g.id))LIST.push({id:g.id,played:!!x.played})}
  saveList();saveHist();saveDisc();   // migra el formato antiguo (posiciones) al nuevo
}
function sanitizeFilters(raw){
  const f=freshFilters();if(!isObj(raw))return f;
  const pick=(k,ok)=>{if(ok(raw[k]))f[k]=raw[k]};
  const inList=list=>v=>list.includes(v);
  pick("origin",inList(["all","pc","retro"]));
  f.systems=asArr(raw.systems).filter(v=>SYSK.includes(v));
  f.genres=asArr(raw.genres).filter(v=>Object.hasOwn(GI,v));
  f.xgenres=asArr(raw.xgenres).filter(v=>Object.hasOwn(GI,v)&&!f.genres.includes(v));
  f.tags=asArr(raw.tags).filter(v=>PC.tags.includes(v));
  pick("control",inList(["any","pad","padany","kbm","mouse","kb"]));
  pick("players",inList(["any","solo","coop","local","online","pvp"]));
  pick("dur",inList(["any","short","mid","long","epic"]));
  pick("disc",inList(["popular","balanced","gems","chaos"]));
  pick("score",inList(["0","70","80","90","95"]));
  pick("reviews",inList(["0","100","1000","10000"]));
  pick("price",inList(["any","free","u5","u15","u30"]));
  for(const k of ["from","to"])pick(k,v=>v===0||(Number.isInteger(v)&&v>=1975&&v<=NOW));
  pick("mix",v=>Number.isInteger(v)&&v>=0&&v<=100);
  for(const k of ["es","esvoz","nojp","norepeat","cover","adult","vr","early","linux"])pick(k,v=>typeof v==="boolean");
  pick("mood",v=>v===""||MOODS.some(m=>m.k===v));
  if(f.from&&f.to&&f.from>f.to)[f.from,f.to]=[f.to,f.from];
  return f;
}
function svgI(name){return ICONS[name]||""}
const ICONS={
 pad:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7h10a5 5 0 0 1 4.8 6.4l-1.2 4A2.6 2.6 0 0 1 16 18.6L14.6 16H9.4L8 18.6a2.6 2.6 0 0 1-4.6-1.2l-1.2-4A5 5 0 0 1 7 7z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M7.5 10v3M6 11.5h3" stroke="currentColor" stroke-width="1.8"/><circle cx="16" cy="10.5" r="1.1" fill="currentColor"/><circle cx="18" cy="12.5" r="1.1" fill="currentColor"/></svg>',
 kb:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="6" width="20" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M6 10h1M9.5 10h1M13 10h1M16.5 10h1M7 14h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
 mouse:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="3" width="12" height="18" rx="6" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 3v6" stroke="currentColor" stroke-width="1.8"/></svg>',
 star:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" fill="currentColor"/></svg>',
 x:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
 sim:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="12" r="5.5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="15" cy="12" r="5.5" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
 dice:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/><circle cx="15.5" cy="15.5" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>',
 play:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="rgba(0,0,0,.5)"/><path d="M10 8l6 4-6 4z" fill="currentColor"/></svg>',
 studio:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20V9l8-5 8 5v11M9 20v-6h6v6" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
};

/* ===================== datos ===================== */
const pending={};
window.ppData=function(name,obj){if(pending[name]){pending[name](obj);delete pending[name]}};
function loadScript(name,path){return new Promise((res,rej)=>{pending[name]=res;const s=document.createElement("script");s.src=path;s.async=true;s.onerror=()=>{delete pending[name];rej(new Error("no "+path))};document.head.appendChild(s)})}
async function loadFetch(path){const t=await (await fetch(path)).text();return JSON.parse(t.slice(t.indexOf(",")+1,t.lastIndexOf(")")))}
function loadData(name,path){
  if(location.protocol==="file:")return loadScript(name,path);
  return loadFetch(path).catch(()=>loadScript(name,path));
}
async function load(){
  const [p,r]=await Promise.all([loadData("pc","data/pc.js"),loadData("retro","data/retro.js")]);
  PC=p;RETRO=r;FL=p.flags;p.genres.forEach((g,i)=>GI[g]=i);SYSK=r.systems.map(s=>s.key);
  p.games.forEach((a,i)=>ALL.push({id:"p"+i,s:0,i,n:a[0],app:a[1],y:a[2],gm:a[3],tg:a[4],f:a[5],rp:a[6],rc:a[7],h:a[8]/10,pr:a[9],dv:a[10],mc:a[11],hl:a[12],img:a[13]}));
  r.games.forEach((a,i)=>ALL.push({id:"r"+i,s:1,i,n:a[0],sys:a[1],y:a[2],gm:a[3],dv:a[4],us:a[5],rg:a[6],ad:a[7],th:a[8],tm:a[9]}));
  // muchos juegos para adultos no tienen etiquetas en el volcado: se marcan también por el nombre
  const ADULT_RE=/\b(hentai|nsfw|porn\w*|nude|nudity|lewd|erotic\w*|xxx|r18|strip ?poker)\b/i;
  ALL.forEach(g=>{BYID.set(g.id,g);g.lc=g.n.toLowerCase();if(ADULT_RE.test(g.n)){if(g.s)g.ad=1;else g.f|=1<<FL.adult}});
  ALL.forEach(g=>KEYS.set(keyOf(g),g));
}
const descCache={};
function desc(g){
  const k=(g.s?"r":"p")+String(g.i%40).padStart(2,"0");
  if(!descCache[k])descCache[k]=loadData(k,`data/desc/${k}.js`).catch(()=>({}));
  return descCache[k].then(d=>d[g.i]);
}

/* ===================== imágenes ===================== */
// Solo se considera que las imágenes externas están bloqueadas cuando el navegador lo dice (política de seguridad de la página).
let IMG_BLOCKED=false;
document.addEventListener("securitypolicyviolation",e=>{const d=e.effectiveDirective||e.violatedDirective||"";if(/img-src|default-src/.test(d)&&/^https?:/.test(e.blockedURI||""))IMG_BLOCKED=true});
const imagesBlocked=()=>IMG_BLOCKED;
const FAILED=new Set();
function headerUrl(g){if(!g.img)return `${SC}steam/apps/${g.app}/header.jpg`;if(g.img.startsWith("h:"))return `${SC}steam/apps/${g.app}/${g.img.slice(2)}/header.jpg`;return g.img}
function steamAsset(g,file){return `${SC}steam/apps/${g.app}/${file}`}
function thumb(g,type){return `${LT}${sysOf(g).repo}/master/Named_${type}/${encodeURIComponent(g.th)}.png`}
function coverSources(g){
  if(g.s===0){const out=[];if(g.app&&!(g.img&&!g.img.startsWith("h:")))out.push({src:steamAsset(g,"library_600x900.jpg")});out.push({src:headerUrl(g),wide:true});return out}
  const o=[];if(g.th){if(g.tm&1)o.push({src:thumb(g,"Boxarts"),wide:true});if(g.tm&4)o.push({src:thumb(g,"Titles"),wide:true});if(g.tm&2)o.push({src:thumb(g,"Snaps"),wide:true})}return o;
}
function heroSources(g){
  if(g.s===0){const o=[];if(g.app&&!(g.img&&!g.img.startsWith("h:")))o.push({src:steamAsset(g,"library_hero.jpg")});o.push({src:headerUrl(g),soft:true});return o}
  const o=[];if(g.th){if(g.tm&2)o.push({src:thumb(g,"Snaps"),soft:true});if(g.tm&4)o.push({src:thumb(g,"Titles"),soft:true});if(g.tm&1)o.push({src:thumb(g,"Boxarts"),soft:true})}return o;
}
function chainImg(img,list,onEach,onFail){
  let k=0;
  const next=()=>{while(k<list.length&&FAILED.has(list[k].src))k++;if(k>=list.length||imagesBlocked()){onFail();return}const s=list[k++];onEach&&onEach(s);img.src=s.src};
  img.onerror=()=>{if(img.src)FAILED.add(img.src);next()};img.referrerPolicy="no-referrer";next();
}
const COVERFIX=new Map(),CFQ=new Map();let cfT=0;
function exactCover(app,cb){
  if(!SERVED||STATE.proxy===false||imagesBlocked())return;
  if(COVERFIX.has(app)){const u=COVERFIX.get(app);if(u)cb(u);return}
  if(!CFQ.has(app))CFQ.set(app,[]);CFQ.get(app).push(cb);clearTimeout(cfT);cfT=setTimeout(flushCovers,150);
}
async function flushCovers(){
  const batch=[...CFQ.entries()].slice(0,50);batch.forEach(([a])=>{CFQ.delete(a);COVERFIX.set(a,null)});if(CFQ.size)cfT=setTimeout(flushCovers,300);
  const input={ids:batch.map(([a])=>({appid:+a})),context:{language:"spanish",country_code:"ES",steam_realm:1},data_request:{include_assets:true}};
  try{
    const j=await getJSON(local(`steam-api/IStoreBrowseService/GetItems/v1/?input_json=${encodeURIComponent(JSON.stringify(input))}`),12000);
    for(const it of (j.response&&j.response.store_items)||[]){const a=it.assets||{},f=a.library_capsule||a.library_capsule_2x;if(!it.appid||!f)continue;
      const u=SC+(a.asset_url_format||`steam/apps/${it.appid}/\${FILENAME}`).replace("${FILENAME}",f);COVERFIX.set(it.appid,u);const cbs=batch.find(([x])=>+x===it.appid);if(cbs)cbs[1].forEach(cb=>cb(u))}
  }catch(e){}
}
function genCanvas(g,W,H){const c=document.createElement("canvas");c.width=W;c.height=H;drawCover(c,g);return c}
function coverEl(g,opt={}){
  const el=document.createElement("div");el.className="cv";
  const tag=document.createElement("span");tag.className="tagsys";tag.textContent=platShort(g);
  const srcs=coverSources(g);
  const fallback=()=>{el.querySelectorAll("img").forEach(i=>i.remove());el.classList.remove("wide");el.prepend(genCanvas(g,300,450))};
  if(!srcs.length||imagesBlocked())fallback();
  else{
    const img=new Image();img.className="main";img.alt="";img.decoding="async";if(opt.lazy!==false)img.loading="lazy";
    let bg=null;el.appendChild(img);
    chainImg(img,srcs,s=>{el.classList.toggle("wide",!!s.wide);if(s.wide){if(!bg){bg=new Image();bg.className="bg";bg.alt="";bg.loading="lazy";bg.referrerPolicy="no-referrer";el.prepend(bg)}bg.src=s.src}else if(bg){bg.remove();bg=null}
      // juego de PC sin carátula vertical en la ruta clásica: se pide la ruta exacta a Steam (solo con el servidor de Docker)
      if(g.s===0&&g.app&&s.wide)exactCover(g.app,u=>{const t=new Image();t.referrerPolicy="no-referrer";t.onload=()=>{img.src=u;el.classList.remove("wide");if(bg){bg.remove();bg=null}};t.src=u})},fallback);
  }
  if(opt.badge!==false)el.appendChild(tag);
  if(LIST.some(x=>x.id===g.id)){const f=document.createElement("span");f.className="fav";f.innerHTML=ICONS.star;el.appendChild(f)}
  return el;
}
function drawCover(canvas,g){
  const c=canvas.getContext("2d"),W=canvas.width,H=canvas.height,r=rng(hash(g.n+g.id));
  const gs=genresOf(g);const h1=gs.length?GENRE_HUE[gs[0]]:Math.floor(r()*360),h2=gs.length>1?GENRE_HUE[gs[1]]:(h1+40+r()*80)%360;
  const grd=c.createLinearGradient(0,0,W,H);grd.addColorStop(0,`hsl(${h1} 70% ${g.s?28:22}%)`);grd.addColorStop(1,`hsl(${h2} 78% ${g.s?44:40}%)`);
  c.fillStyle=grd;c.fillRect(0,0,W,H);c.save();
  if(g.s===0){for(let i=0;i<7;i++){c.globalAlpha=.1+r()*.18;c.fillStyle=r()<.5?`hsl(${h2} 90% 70%)`:`hsl(${h1} 85% 62%)`;c.beginPath();const x=r()*W,y=r()*H,s=W*.2+r()*W*.5;
      if(r()<.5)c.arc(x,y,s/2,0,Math.PI*2);else{c.moveTo(x,y-s/2);c.lineTo(x+s/2,y+s/2);c.lineTo(x-s/2,y+s/2);c.closePath()}c.fill()}
    c.globalAlpha=.1;c.strokeStyle="#fff";c.lineWidth=2;for(let x=-H;x<W;x+=24){c.beginPath();c.moveTo(x,H);c.lineTo(x+H,0);c.stroke()}}
  else{const px=Math.max(W,H)/40;c.globalAlpha=.16;for(let y=0;y<H;y+=px)for(let x=0;x<W;x+=px)if(r()<.22){c.fillStyle=r()<.5?"#fff":"#000";c.fillRect(x,y,px-1,px-1)}
    c.globalAlpha=1;c.fillStyle="rgba(0,0,0,.55)";c.fillRect(0,0,W,H*.11);}
  c.restore();
  const pad=W*.08;let fs=Math.round(Math.min(W*.15,H*.12));const maxW=W-pad*2;let lines;
  const maxL=H>W?5:3;
  for(;;){c.font=`800 ${fs}px Figtree, system-ui, sans-serif`;lines=wrap(c,g.n,maxW);if(lines.length<=maxL||fs<=Math.max(10,Math.min(W,H)*.06))break;fs-=2}if(lines.length>maxL){lines=lines.slice(0,maxL);lines[maxL-1]=lines[maxL-1].replace(/.{0,2}$/,"…")}
  c.textAlign="left";c.textBaseline="alphabetic";c.fillStyle="#fff";c.shadowColor="rgba(0,0,0,.45)";c.shadowBlur=H*.02;
  const lh=fs*1.06,y0=H-pad-lh*(lines.length-1);lines.forEach((l,i)=>c.fillText(l,pad,y0+i*lh));
}
function wrap(c,text,maxW){const words=text.split(/\s+/),lines=[];let cur="";for(const w of words){const t=cur?cur+" "+w:w;if(c.measureText(t).width>maxW&&cur){lines.push(cur);cur=w}else cur=t}if(cur)lines.push(cur);return lines}

/* ===================== filtros ===================== */
function buildFilters(){
  const counts={};for(const g of ALL)for(let i=0;i<PC.genres.length;i++)if(g.gm>>>i&1)counts[i]=(counts[i]||0)+1;
  const order=PC.genres.map((g,i)=>i).sort((a,b)=>(counts[b]||0)-(counts[a]||0));
  $("#f-genres").innerHTML=order.map(i=>`<button class="chip" type="button" data-g="${PC.genres[i]}">${GENRE_ES[PC.genres[i]]}<span class="c">${fmt(counts[i]||0)}</span></button>`).join("");
  const groups={};RETRO.systems.forEach(s=>(groups[s.group]=groups[s.group]||[]).push(s));
  $("#f-sys").innerHTML=Object.entries(groups).map(([n,a])=>`<div class="sysg"><b>${n}</b><div class="chips">${a.map(s=>`<button class="chip" type="button" data-sys="${s.key}" title="${esc(s.label)} · emulador: ${esc(s.emu)}">${esc(s.short)}<span class="c">${fmt(s.count)}</span></button>`).join("")}</div></div>`).join("");
  const yrs=[];for(let y=NOW;y>=1975;y--)yrs.push(y);
  $("#f-from").innerHTML=`<option value="0">Sin mínimo</option>`+yrs.slice().reverse().map(y=>`<option value="${y}">Desde ${y}</option>`).join("");
  $("#f-to").innerHTML=`<option value="0">Sin máximo</option>`+yrs.map(y=>`<option value="${y}">Hasta ${y}</option>`).join("");
  $("#moods").innerHTML=MOODS.map(m=>`<button class="mood" type="button" data-mood="${m.k}"><i style="background:${m.c}"></i>${m.n}</button>`).join("");
  renderTagChips();

  // Cualquier cambio a mano desmarca el ambiente (los filtros se quedan): el chip solo se ve activo si describe los filtros.
  const user=fn=>(...a)=>{fn(...a);F.mood="";change()};
  $("#f-genres").addEventListener("click",e=>{const b=e.target.closest("[data-g]");if(!b)return;const g=b.dataset.g;user(()=>{
    if(F.genres.includes(g)){F.genres=F.genres.filter(x=>x!==g);F.xgenres=[...F.xgenres,g]}else if(F.xgenres.includes(g)){F.xgenres=F.xgenres.filter(x=>x!==g)}else F.genres=[...F.genres,g]})()});
  $("#f-sys").addEventListener("click",e=>{const b=e.target.closest("[data-sys]");if(!b)return;user(()=>{tog("systems",b.dataset.sys);if(F.origin==="pc")F.origin="all"})()});
  $("#f-tags").addEventListener("click",e=>{const b=e.target.closest("[data-tag]");if(!b)return;user(()=>tog("tags",b.dataset.tag))();renderTagChips()});
  $("#tagSearch").addEventListener("input",renderTagChips);
  for(const [id,k] of [["#f-origin","origin"],["#f-dur","dur"],["#f-disc","disc"]])$(id).addEventListener("click",e=>{const b=e.target.closest("button");if(b)user(()=>{F[k]=b.dataset.v})()});
  for(const [id,k] of [["#f-control","control"],["#f-players","players"],["#f-score","score"],["#f-reviews","reviews"],["#f-price","price"]])$(id).addEventListener("change",e=>user(()=>{F[k]=e.target.value})());
  const years=()=>{if(F.from&&F.to&&F.from>F.to){[F.from,F.to]=[F.to,F.from];toast(`He ordenado los años: de ${F.from} a ${F.to}`)}};
  $("#f-from").addEventListener("change",e=>user(()=>{F.from=+e.target.value;years()})());
  $("#f-to").addEventListener("change",e=>user(()=>{F.to=+e.target.value;years()})());
  $("#f-mix").addEventListener("input",e=>user(()=>{F.mix=+e.target.value})());
  for(const k of ["es","esvoz","nojp","norepeat","cover","adult","vr","early","linux"])$("#f-"+k).addEventListener("change",e=>user(()=>{F[k]=e.target.checked})());
  $("#reset").addEventListener("click",()=>{const undo=snapshot();F=freshFilters();SIM=null;change();renderTagChips();toast("Filtros restablecidos",undo)});
  $("#moods").addEventListener("click",e=>{const b=e.target.closest("[data-mood]");if(!b)return;const m=MOODS.find(x=>x.k===b.dataset.mood);
    const undo=snapshot();
    if(F.mood===m.k){F=freshFilters()}else{F=Object.assign(freshFilters(),cloneF(m.f),{mood:m.k})}
    SIM=null;change();renderTagChips();toast(F.mood?`Ambiente: ${m.n}`:"Ambiente quitado",undo)});
}
// Foto de filtros + «Parecidos» para poder deshacer cambios grandes (ambientes, restablecer, etiquetas desde la ficha)
function snapshot(){const f=cloneF(F),sim=SIM,sort=$("#xSort").value;return()=>{F=f;SIM=sim;change();renderTagChips();if(sim&&sort==="sim")$("#xSort").value="sim";if(VIEW==="explorar")renderExplore(true)}}
function tog(k,v){F[k]=F[k].includes(v)?F[k].filter(x=>x!==v):[...F[k],v]}
let TAGCOUNT=null;
function renderTagChips(){
  if(!TAGCOUNT){TAGCOUNT=new Array(PC.tags.length).fill(0);for(const g of ALL)if(g.s===0)for(const t of g.tg)TAGCOUNT[t]++}
  const q=($("#tagSearch").value||"").trim().toLowerCase();
  let idx=PC.tags.map((t,i)=>i);
  if(q)idx=idx.filter(i=>PC.tags[i].toLowerCase().includes(q)||tagName(PC.tags[i]).toLowerCase().includes(q));
  idx.sort((a,b)=>TAGCOUNT[b]-TAGCOUNT[a]);
  const sel=F.tags.map(t=>PC.tags.indexOf(t)).filter(i=>i>=0);
  const show=[...new Set([...sel,...idx.slice(0,q?40:18)])];
  $("#f-tags").innerHTML=show.map(i=>`<button class="chip" type="button" data-tag="${esc(PC.tags[i])}" aria-pressed="${F.tags.includes(PC.tags[i])}">${esc(tagName(PC.tags[i]))}<span class="c">${fmt(TAGCOUNT[i])}</span></button>`).join("")||'<span class="hintline">Ninguna etiqueta coincide.</span>';
}
function activeCount(){let n=0;for(const k in DEFAULTS){if(k==="mood")continue;const a=F[k],b=DEFAULTS[k];if(Array.isArray(b)?a.length:a!==b)n++}return n}
function syncFilters(){
  for(const [id,k] of [["#f-origin","origin"],["#f-dur","dur"],["#f-disc","disc"]])$(id).querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.v===String(F[k])));
  $$("[data-g]").forEach(b=>b.dataset.state=F.genres.includes(b.dataset.g)?1:F.xgenres.includes(b.dataset.g)?2:0);
  $$("[data-sys]").forEach(b=>b.setAttribute("aria-pressed",F.systems.includes(b.dataset.sys)));
  $$("[data-mood]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.mood===F.mood));
  for(const k of ["control","players","score","reviews","price"])$("#f-"+k).value=F[k];
  $("#f-from").value=F.from;$("#f-to").value=F.to;$("#f-mix").value=F.mix;$("#mixLbl").textContent=`${F.mix} / ${100-F.mix}`;
  for(const k of ["es","esvoz","nojp","norepeat","cover","adult","vr","early","linux"])$("#f-"+k).checked=!!F[k];
  $("#sysWrap").hidden=F.origin==="pc";$("#sysHint").textContent=F.systems.length?F.systems.length+" marcadas":"todas";
  const n=activeCount()+(SIM?1:0);for(const id of ["#fCount1","#fCount2"]){$(id).hidden=!n;$(id).textContent=n}
  renderSimbar();
  $("#discInfo").textContent=F.tags.length||F.dur!=="any"||F.esvoz?"Las etiquetas, la duración y las voces solo existen en juegos de PC, así que esos filtros dejan fuera las consolas.":"";
}
let chT=0;
function change(){save();XALL=false;syncFilters();clearTimeout(chT);chT=setTimeout(()=>{rebuildPool();onPoolChange()},80)}

/* ===================== pool y sorteo ===================== */
// passes() no mira el historial: "No repetir" solo afecta a los modos al azar (Ruleta, Cartas, Duelo), no a Explorar.
function passes(g,x){
  if(DISC.has(g.id))return false;
  if(F.origin==="pc"&&g.s)return false;
  if(F.origin==="retro"&&!g.s)return false;
  if(g.s&&x.sys&&!x.sys.has(g.sys))return false;
  if(x.gm&&!(g.gm&x.gm))return false;
  if(x.xgm&&(g.gm&x.xgm))return false;
  if(F.from&&(!g.y||g.y<F.from))return false;
  if(F.to&&(!g.y||g.y>F.to))return false;
  if(SIM&&!SIM.scores.has(g.id))return false;
  if(g.s===0){
    if(F.adult&&has(g,"adult"))return false;
    if(F.vr&&has(g,"vronly"))return false;
    if(F.early&&has(g,"early"))return false;
    if(F.linux&&!has(g,"linux"))return false;
    if(F.es&&!has(g,"es"))return false;
    if(F.esvoz&&!has(g,"esvoz"))return false;
    if(x.tags){let ok=false;for(const t of g.tg)if(x.tags.has(t)){ok=true;break}if(!ok)return false}
    switch(F.control){case"pad":if(!(has(g,"fullpad")||has(g,"padrec")))return false;break;case"padany":if(!(has(g,"fullpad")||has(g,"partpad")||has(g,"padrec")))return false;break;
      case"kbm":if(has(g,"vronly")||has(g,"touch"))return false;break;case"mouse":if(!(has(g,"mouseonly")||has(g,"mousefr")))return false;break;case"kb":if(!has(g,"kbonly"))return false;break}
    switch(F.players){case"solo":if(!has(g,"single"))return false;break;case"coop":if(!(has(g,"cooponl")||has(g,"cooploc")))return false;break;
      case"local":if(!(has(g,"cooploc")||has(g,"pvploc")))return false;break;case"online":if(!(has(g,"cooponl")||has(g,"pvponl")||has(g,"mmo")))return false;break;case"pvp":if(!(has(g,"pvponl")||has(g,"pvploc")))return false;break}
    if(F.dur!=="any"){const h=g.h;if(!h)return false;if(F.dur==="short"&&h>=5||F.dur==="mid"&&(h<5||h>15)||F.dur==="long"&&(h<15||h>40)||F.dur==="epic"&&h<40)return false}
    if(+F.score&&g.rp<+F.score)return false;
    if(+F.reviews&&g.rc<+F.reviews)return false;
    if(F.price==="free"&&!has(g,"free"))return false;
    if(F.price.startsWith("u")){const lim={u5:500,u15:1500,u30:3000}[F.price];if(!(has(g,"free")||(g.pr>=0&&g.pr<=lim)))return false}
    if(F.disc==="gems"&&!(g.rc>=10&&g.rc<=1500&&g.rp>=90))return false;
  }else{
    if(F.adult&&g.ad)return false;
    if(x.tags||F.dur!=="any"||F.esvoz)return false;
    if(["kbm","mouse","kb"].includes(F.control))return false;
    if(F.players==="online")return false;
    if(["coop","local","pvp"].includes(F.players)&&!(g.us>=2))return false;
    if(F.cover&&!(g.tm&1))return false;
    if(F.nojp&&g.rg==="JP")return false;
    if(F.es&&!/EU|ES|WLD/.test(g.rg))return false;
    if(F.disc==="gems"&&!(g.gm&&g.y))return false;
  }
  return true;
}
/* ---------- parecidos ----------
   Puntuación: misma saga (por el título) + etiquetas de Steam compartidas, ponderadas por lo raras que son
   + géneros en común + mismo estudio. Entre PC y consola solo cuenta la misma saga.
   Se guardan los SIM_MAX más parecidos de todo el catálogo; los filtros se aplican después. */
const SIM_MAX=300;
const STOPW=new Set(["the","a","an","of","and","de","la","el","los","las","le","les","del","to","in","on","for","y"]);
const ROMAN=/^(\d+|ii|iii|iv|v|vi|vii|viii|ix|x|xi|xii)$/;
function toks(g){return g._tk||(g._tk=g.n.toLowerCase().replace(/&/g," and ").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g," ").trim().split(" ").filter(Boolean))}
function sameSeries(a,b){
  const x=toks(a),y=toks(b);let k=0;while(k<x.length&&k<y.length&&x[k]===y[k])k++;if(!k)return false;
  const strong=x.slice(0,k).filter(w=>!STOPW.has(w)&&!/^\d+$/.test(w));
  if(strong.length>=2)return true;                       // "Risk of Rain …", "Super Mario …", "Half-Life 2 …"
  if(k!==Math.min(x.length,y.length)||!strong.length)return false;
  const [sg,lg]=x.length<=y.length?[a,b]:[b,a];          // "Portal" / "Portal 2", "Celeste" / "Celeste: Farewell"
  if(ROMAN.test(toks(lg)[k]))return true;
  const ln=lg.n.toLowerCase(),sn=sg.n.toLowerCase().trim();
  return ln.startsWith(sn)&&/^\s*[:\-–—]/.test(ln.slice(sn.length));
}
let TAG_IDF=null;
function tagIdf(){if(TAG_IDF)return TAG_IDF;const df=new Array(PC.tags.length).fill(0);let n=0;for(const g of ALL)if(!g.s){n++;for(const t of g.tg)df[t]++}return TAG_IDF=df.map(d=>Math.log((n+1)/(d+1)))}
const bitCount=m=>{let c=0;while(m){m&=m-1;c++}return c};
function simScore(g,t){
  if(g.id===t.id)return 0;
  const series=sameSeries(g,t);
  if(g.s!==t.s)return series?3:0;
  const inter=bitCount(g.gm&t.gm),uni=bitCount(g.gm|t.gm),gj=uni?inter/uni:0;
  let sc=0,ok=series;
  if(g.s===0){
    const w=tagIdf();let tot=0,sh=0;for(const x of t.tg){tot+=w[x];if(g.tg.includes(x))sh+=w[x]}
    const ts=tot?sh/tot:0;
    if(inter&&(t.tg.length>=2?ts>=.3:gj>=.6))ok=true;
    sc=2*ts+1.5*gj;
  }else{
    const near=g.y&&t.y&&Math.abs(g.y-t.y)<=4,grp=sysOf(g).group===sysOf(t).group;
    if(gj>=.5&&(grp||near))ok=true;
    sc=1.5*gj+(grp?.4:0)+(near?.4:0)+(g.sys===t.sys?.3:0);
  }
  if(!ok)return 0;
  if(series)sc+=3;
  if(g.dv>=0&&g.dv===t.dv)sc+=.8;
  return sc;
}
function findSimilar(t){
  const res=[];for(const g of ALL){const v=simScore(g,t);if(v>0)res.push([g,v])}
  res.sort((a,b)=>b[1]-a[1]||((b[0].rc||0)-(a[0].rc||0)));
  return new Map(res.slice(0,SIM_MAX).map(([g,v])=>[g.id,v]));
}
function startSimilar(g){
  const scores=findSimilar(g);
  if(!scores.size){toast(`No he encontrado juegos parecidos a ${g.n}`);return false}
  SIM={g,scores};XALL=false;$("#xSearch").value="";$("#xSort").value="sim";
  setView("explorar");change();
  return true;
}
function stopSimilar(){if(!SIM)return;SIM=null;if($("#xSort").value==="sim")$("#xSort").value="rand";change()}
function renderSimbar(){
  const bar=$("#simbar");bar.hidden=!SIM;$("#xSort").querySelector('[value="sim"]').hidden=!SIM;
  if(!SIM){bar.innerHTML="";delete bar.dataset.id;if($("#xSort").value==="sim")$("#xSort").value="rand";return}
  if(bar.dataset.id===SIM.g.id)return;bar.dataset.id=SIM.g.id;
  bar.innerHTML=`<div class="txt">Mostrando juegos parecidos a <b>${esc(SIM.g.n)}</b><small>Los ${fmt(SIM.scores.size)} más parecidos de todo el catálogo, ordenados por parecido. Tus filtros se siguen aplicando.</small></div><div class="acts"><button class="btn" type="button" data-a="ficha">Ver su ficha</button><button class="btn sun" type="button" data-a="quitar">Quitar</button></div>`;
  bar.prepend(coverEl(SIM.g,{lazy:false,badge:false}));
  bar.querySelector('[data-a="ficha"]').onclick=()=>openDetail(SIM.g,"Juego de referencia");
  bar.querySelector('[data-a="quitar"]').onclick=stopSimilar;
}
function weight(g){
  if(SIM){const v=SIM.scores.get(g.id)||0;return v*v}       // con "Parecidos" salen antes los más parecidos
  if(F.disc==="chaos"||F.disc==="gems")return 1;
  if(g.s===0){const q=Math.max(g.rp,0)/100,l=Math.log10(g.rc+1);return F.disc==="popular"?Math.pow(l,2.6)*q*q*q+0.002:Math.log10(g.rc+10)*Math.pow(0.25+q,2)}
  return (g.gm?1:0.45)*(g.y?1.15:1)*(g.dv>=0?1.15:1)*(g.tm&1?1.3:0.6);
}
function rebuildPool(){
  const x={seen:new Set(HIST),sys:F.systems.length?new Set(F.systems.map(k=>SYSK.indexOf(k))):null,
    gm:F.genres.reduce((m,g)=>m|(1<<GI[g]),0),xgm:F.xgenres.reduce((m,g)=>m|(1<<GI[g]),0),
    tags:F.tags.length?new Set(F.tags.map(t=>PC.tags.indexOf(t)).filter(i=>i>=0)):null};
  BROWSE=ALL.filter(g=>passes(g,x));
  POOL=F.norepeat?BROWSE.filter(g=>!x.seen.has(g.id)):BROWSE;
  let sp=0,sr=0;const w=new Float64Array(POOL.length);
  POOL.forEach((g,i)=>{w[i]=weight(g);if(g.s)sr+=w[i];else sp+=w[i]});
  if(sp>0&&sr>0){const share=Math.min(.99,Math.max(.01,F.mix/100));const k=(sp*(1-share)/share)/sr;POOL.forEach((g,i)=>{if(g.s)w[i]*=k})}
  CUM=new Float64Array(POOL.length);let acc=0;for(let i=0;i<w.length;i++){acc+=w[i];CUM[i]=acc}
  const nr=POOL.reduce((a,g)=>a+g.s,0),seen=BROWSE.length-POOL.length;
  const seenTxt=seen?` · ${fmt(seen)} ya ${seen===1?"salió":"salieron"} (no se repiten)`:"";
  $$(".poolN").forEach(e=>e.textContent=fmt(POOL.length));
  $$(".poolSplit").forEach(e=>e.textContent=(POOL.length?`juegos encajan · PC ${fmt(POOL.length-nr)} · emulado ${fmt(nr)}`:"ningún juego disponible")+seenTxt);
  const fc=$("#filtersClose");if(fc)fc.textContent=`Ver ${fmt(POOL.length)} ${POOL.length===1?"juego":"juegos"}`;
}
// Por qué no hay juegos para sortear: ya salieron todos (No repetir) o los filtros no dejan ninguno.
function emptyInfo(){
  if(BROWSE.length&&!POOL.length)return{msg:`Ya te han salido los ${fmt(BROWSE.length)} juegos que encajan con tus filtros.`,acts:[["repeat","Permitir repetidos"],["clearhist","Vaciar historial"]]};
  return{msg:SIM?"Ningún juego parecido encaja con tus filtros.":"Ningún juego encaja con estos filtros.",acts:SIM?[["nosim","Quitar «Parecidos»"],["reset","Restablecer filtros"]]:[["reset","Restablecer filtros"]]};
}
function emptyAction(a){
  if(a==="repeat"){F.norepeat=false;change();toast("Ahora pueden repetirse juegos que ya salieron",()=>{F.norepeat=true;change()})}
  if(a==="clearhist")clearHistory();
  if(a==="nosim")stopSimilar();
  if(a==="reset")$("#reset").click();
}
function emptyHTML(){const e=emptyInfo();return `<div class="empty nopool"><strong>${esc(e.msg)}</strong><div class="controls" style="margin-top:10px">${e.acts.map(([k,t])=>`<button class="btn" type="button" data-a="${k}">${t}</button>`).join("")}</div></div>`}
function pick(){const t=Math.random()*CUM[CUM.length-1];let lo=0,hi=CUM.length-1;while(lo<hi){const m=(lo+hi)>>1;if(CUM[m]<t)lo=m+1;else hi=m}return POOL[lo]}
function sample(n,exclude){const out=[],ids=new Set(exclude||[]);let tries=0;const want=Math.min(n,POOL.length-ids.size);while(out.length<want&&tries<n*30){tries++;const g=pick();if(!ids.has(g.id)){ids.add(g.id);out.push(g)}}return out}
function noPool(){if(POOL.length)return false;const e=emptyInfo();toast(e.msg,()=>emptyAction(e.acts[0][0]),e.acts[0][1]);return true}
function onPoolChange(){
  if(VIEW==="ruleta"){if(!spinning){if(CFG.rstyle==="reel")buildReelIdle();else wheelIdle()}}
  if(VIEW==="explorar")renderExplore(true);
}
// Con «No repetir» el sorteo se recalcula en cuanto sale un juego (antes no se hacía hasta tocar un filtro).
function addHist(g){HIST=[g.id,...HIST.filter(x=>x!==g.id)].slice(0,120);saveHist();renderLast();if(F.norepeat)rebuildPool()}
function clearHistory(){const old=HIST.slice();HIST=[];saveHist();rebuildPool();renderLast();refreshView();toast("Historial vaciado",()=>{HIST=old;saveHist();rebuildPool();renderLast();refreshView()})}
function toggleFav(g){
  const i=LIST.findIndex(x=>x.id===g.id);
  if(i<0){LIST.unshift({id:g.id,played:false});saveList();toast("Guardado en tu lista")}
  else{const [old]=LIST.splice(i,1);saveList();toast("Quitado de tu lista",()=>{LIST.splice(Math.min(i,LIST.length),0,old);saveList();$("#nList").textContent=LIST.length;refreshView()})}
  $("#nList").textContent=LIST.length;
}
// «No me interesa»: sale del sorteo, de Explorar y de Guardados. Se puede deshacer.
function discard(g){
  const li=LIST.findIndex(x=>x.id===g.id),saved=li>=0?LIST.splice(li,1)[0]:null;
  DISC.add(g.id);saveDisc();saveList();$("#nList").textContent=LIST.length;rebuildPool();refreshView(g);
  toast("Descartado. No volverá a salir.",()=>{DISC.delete(g.id);saveDisc();if(saved){LIST.splice(li,0,saved);saveList();$("#nList").textContent=LIST.length}rebuildPool();refreshView()});
}
// Vuelve a pintar la vista actual cuando cambia algo que muestra (lista, descartes…)
function refreshView(removed){
  if(VIEW==="lista")renderList();
  if(VIEW==="explorar"){if($("#xSearch").value.trim()||!removed)renderExplore(true);else{$$(`#xGrid .tile[data-id="${removed.id}"]`).forEach(t=>t.remove());$("#xPoolN").textContent=fmt(Math.max(0,num($("#xPoolN").textContent)-1))}}
}
const num=s=>Number(String(s).replace(/\D/g,""))||0;

/* ===================== sonido ===================== */
let actx=null;
function audio(){if(!CFG.sound)return null;try{actx=actx||new (window.AudioContext||window.webkitAudioContext)();if(actx.state==="suspended")actx.resume();return actx}catch(e){return null}}
function tick(f=1500){const a=audio();if(!a)return;try{const o=a.createOscillator(),g=a.createGain();o.type="square";o.frequency.value=f+Math.random()*200;g.gain.setValueAtTime(.045,a.currentTime);g.gain.exponentialRampToValueAtTime(.0001,a.currentTime+.04);o.connect(g).connect(a.destination);o.start();o.stop(a.currentTime+.05)}catch(e){}}
function ding(){const a=audio();if(!a)return;try{[660,880,1320].forEach((f,i)=>{const o=a.createOscillator(),g=a.createGain();o.type="triangle";o.frequency.value=f;const t=a.currentTime+i*.09;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.12,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+.35);o.connect(g).connect(a.destination);o.start(t);o.stop(t+.4)})}catch(e){}}
function whoosh(){const a=audio();if(!a)return;try{const o=a.createOscillator(),g=a.createGain();o.type="sawtooth";o.frequency.setValueAtTime(220,a.currentTime);o.frequency.exponentialRampToValueAtTime(880,a.currentTime+.15);g.gain.setValueAtTime(.03,a.currentTime);g.gain.exponentialRampToValueAtTime(.0001,a.currentTime+.18);o.connect(g).connect(a.destination);o.start();o.stop(a.currentTime+.2)}catch(e){}}

/* ===================== RULETA: carrete ===================== */
let spinning=false,REEL=[],reelX=0;
const strip=$("#strip"),reelbox=$("#reelbox");
function itemW(){return innerWidth<640?120:168}
function renderStrip(items){
  strip.innerHTML="";strip.classList.remove("dim");strip.style.setProperty("--rw",itemW()+"px");
  for(const g of items){const d=document.createElement("div");d.className="ritem";d.appendChild(coverEl(g,{lazy:false}));const n=document.createElement("div");n.className="nm";n.textContent=g.n;d.appendChild(n);strip.appendChild(d)}
}
function setX(x){reelX=x;strip.style.transform=`translate3d(${x}px,0,0)`}
function centerOn(i,jit=0){const step=itemW()+12,bw=reelbox.clientWidth;return -(i*step+itemW()/2-bw/2)+jit}
function buildReelIdle(){reelbox.classList.toggle("isempty",!POOL.length);if(!POOL.length){strip.innerHTML=emptyHTML();setX(0);return}
  REEL=sample(Math.min(11,POOL.length));renderStrip(REEL);setX(centerOn(Math.floor(REEL.length/2)))}
function spinReel(){
  if(spinning||noPool())return;audio();
  const N=Math.min(60,Math.max(POOL.length,1)),WIN=N-8>4?N-8:N-1;
  const prev=REEL.slice(0,Math.min(REEL.length,11));
  const fresh=sample(N);if(!fresh.length)return;
  // conserva lo visible al principio para que el giro arranque sin saltos
  const items=prev.concat(fresh).slice(0,prev.length+fresh.length);
  const startIdx=Math.floor(prev.length/2),winIdx=Math.min(items.length-1,prev.length+Math.min(WIN,fresh.length-1));
  REEL=items;reelbox.classList.remove("isempty");renderStrip(items);spinning=true;$("#spinBtn").disabled=true;
  const step=itemW()+12,x0=centerOn(startIdx),x1=centerOn(winIdx,(Math.random()-.5)*itemW()*.7);
  setX(x0);const dur=reduce?700:6200+Math.random()*1200,t0=performance.now();let lastI=-1;
  const frame=now=>{const p=Math.min(1,(now-t0)/dur),e=1-Math.pow(1-p,5);const x=x0+(x1-x0)*e;setX(x);
    const ci=Math.floor((reelbox.clientWidth/2-x)/step);if(ci!==lastI){lastI=ci;tick()}
    if(p<1)requestAnimationFrame(frame);else finishSpin(items[winIdx],strip.children[winIdx])};
  requestAnimationFrame(frame);
}
function finishSpin(g,el){
  spinning=false;$("#spinBtn").disabled=false;ding();addHist(g);
  if(el){strip.classList.add("dim");el.classList.add("win")}
  setTimeout(()=>openDetail(g,"¡Te toca jugar!"),reduce?100:750);
}

/* ===================== RULETA: rueda ===================== */
const wcv=$("#wheel"),wcx=wcv.getContext("2d");let WHEEL=[],rot=-Math.PI/2,wspeed=0,lights=0;
function sizeWheel(){const r=wcv.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);if(r.width){wcv.width=Math.round(r.width*d);wcv.height=Math.round(r.width*d)}}
function drawWheel(){
  const W=wcv.width;if(!W)return;const R=W/2,c=W/2;wcx.clearRect(0,0,W,W);
  const cols=["#ff5a36","#7383ff","#ffc93c","#2fd0b5","#ff7ab4","#a07cff"],n=Math.max(WHEEL.length,1),seg=Math.PI*2/n;
  wcx.beginPath();wcx.arc(c,c,R*.985,0,Math.PI*2);wcx.fillStyle="#05040d";wcx.fill();const rr=R*.9;
  for(let i=0;i<n;i++){const a0=rot+i*seg;wcx.beginPath();wcx.moveTo(c,c);wcx.arc(c,c,rr,a0,a0+seg);wcx.closePath();wcx.fillStyle=WHEEL.length?cols[i%6]:"#221f40";wcx.fill();wcx.strokeStyle="#05040d";wcx.lineWidth=Math.max(1.5,W/300);wcx.stroke();
    if(!WHEEL.length)continue;const g=WHEEL[i],light=[2,3,4].includes(i%6),mid=a0+seg/2,flip=Math.cos(mid)<0;
    wcx.save();wcx.translate(c,c);wcx.rotate(flip?mid+Math.PI:mid);wcx.globalAlpha=Math.max(0,1-wspeed*1.6);wcx.fillStyle=light?"#14122b":"#fff";
    const fs=Math.round(W*.026);wcx.font=`700 ${fs}px Figtree, system-ui, sans-serif`;wcx.textAlign=flip?"left":"right";wcx.textBaseline="middle";
    let t=g.n;while(wcx.measureText(t).width>rr*.66&&t.length>3)t=t.slice(0,-2);if(t!==g.n)t=t.trim()+"…";const tx=flip?-(rr-W*.03):rr-W*.03;
    wcx.fillText(t,tx,-fs*.28);wcx.font=`600 ${Math.round(fs*.72)}px "JetBrains Mono", monospace`;wcx.globalAlpha*=.8;wcx.fillText(platShort(g),tx,fs*.75);wcx.restore()}
  for(let i=0;i<28;i++){const a=i/28*Math.PI*2,on=spinning?((i+lights)%2===0):(i%2===0);wcx.beginPath();wcx.arc(c+Math.cos(a)*R*.943,c+Math.sin(a)*R*.943,R*.018,0,Math.PI*2);wcx.fillStyle=on?"#ffc93c":"rgba(255,255,255,.2)";wcx.fill()}
  wcx.beginPath();wcx.arc(c,c,R*.17,0,Math.PI*2);wcx.fillStyle="#18162f";wcx.fill();wcx.lineWidth=W/90;wcx.strokeStyle="#05040d";wcx.stroke();
  wcx.fillStyle="#ff5a36";wcx.font=`${Math.round(W*.07)}px "Rubik Mono One", Impact, sans-serif`;wcx.textAlign="center";wcx.textBaseline="middle";wcx.fillText("?",c,c+W*.004);
}
function spinWheel(){
  if(spinning||noPool())return;audio();WHEEL=sample(12);if(!WHEEL.length)return;spinning=true;$("#spinBtn").disabled=true;
  const n=WHEEL.length,seg=Math.PI*2/n,win=Math.floor(Math.random()*n);let target=-Math.PI/2-(win+.5)*seg+(Math.random()-.5)*seg*.6;
  const turns=reduce?1:6+Math.floor(Math.random()*3);while(target<rot+turns*Math.PI*2)target+=Math.PI*2;
  const start=rot,dist=target-start,dur=reduce?650:4800+Math.random()*900,t0=performance.now();let last=Math.floor((-Math.PI/2-start)/seg),prev=start;
  const frame=now=>{const p=Math.min(1,(now-t0)/dur),e=1-Math.pow(1-p,4);rot=start+dist*e;wspeed=Math.min(1,(rot-prev)/.35);prev=rot;lights=Math.floor(now/120);
    const s=Math.floor((-Math.PI/2-rot)/seg);if(s!==last){last=s;tick()}drawWheel();
    if(p<1)requestAnimationFrame(frame);else{wspeed=0;drawWheel();finishSpin(WHEEL[win],null)}};
  requestAnimationFrame(frame);
}
function setRStyle(v){CFG.rstyle=v;store.set("cfg",CFG);$$("#rStyle button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.v===v));
  $("#reelArea").hidden=v!=="reel";$("#wheelArea").hidden=v!=="wheel";if(v==="wheel")wheelIdle();else buildReelIdle()}
// Rueda en reposo: candidatos nuevos o, si no hay juegos, el motivo y qué hacer (igual que el carrete)
function wheelIdle(){sizeWheel();WHEEL=sample(12);drawWheel();const e=$("#wheelEmpty");e.hidden=!!POOL.length;e.innerHTML=POOL.length?"":emptyHTML()}
function renderLast(){const el=$("#lastThumbs");el.innerHTML="";const items=HIST.slice(0,12).map(id=>BYID.get(id)).filter(Boolean);
  if(!items.length){el.innerHTML='<span class="hintline" style="grid-column:1/-1">Aquí aparecerán los juegos que te salgan.</span>';return}
  for(const g of items){const b=document.createElement("button");b.type="button";b.title=g.n;b.appendChild(coverEl(g,{badge:false}));b.onclick=()=>openDetail(g,"De tu historial");el.appendChild(b)}}

/* ===================== CARTAS ===================== */
let HAND=[],REROLLS=3,FLIPPED=new Set();
function deal(){
  if(noPool())return;whoosh();HAND=sample(CFG.cards);REROLLS=3;FLIPPED=new Set();renderHand(true);
}
function renderHand(anim){
  const el=$("#deal");el.innerHTML="";$("#rerolls").textContent=`Cambios: ${REROLLS}`;
  HAND.forEach((g,i)=>{const c=document.createElement("div");c.className="card";c.dataset.i=i;
    c.innerHTML=`<button class="face back" type="button" aria-label="Voltear carta ${i+1}"><div style="text-align:center"><span>?</span><small>CARTA ${i+1}</small></div></button><div class="face front"></div>`;
    const front=c.querySelector(".front");front.appendChild(coverEl(g));
    const info=document.createElement("div");info.className="info";
    info.innerHTML=`<h4>${esc(g.n)}</h4><div class="meta">${esc([platShort(g),g.y||"",genresOf(g).slice(0,2).map(x=>GENRE_ES[x]).join(", ")].filter(Boolean).join(" · "))}</div><div class="acts"><button type="button" data-a="re" ${REROLLS?"":"disabled"}>Cambiar</button><button type="button" class="go" data-a="go">Ficha</button></div>`;
    front.appendChild(info);
    if(FLIPPED.has(i))c.classList.add("flipped");
    c.querySelector(".back").onclick=()=>{c.classList.add("flipped");FLIPPED.add(i);whoosh();addHist(g)};
    info.querySelector('[data-a="go"]').onclick=()=>openDetail(g,"Tu carta");
    info.querySelector('[data-a="re"]').onclick=()=>{if(!REROLLS)return;const n=sample(1,HAND.map(x=>x.id))[0];
      if(!n){toast("No quedan más juegos para cambiar esta carta");return}
      REROLLS--;HAND[i]=n;FLIPPED.add(i);renderHand();addHist(n)};
    el.appendChild(c);
    if(anim&&!reduce){c.style.opacity=0;c.style.transform="translateY(30px) rotate(-6deg)";setTimeout(()=>{c.style.transition="opacity .35s, transform .7s cubic-bezier(.3,1.3,.5,1)";c.style.opacity=1;c.style.transform=""},60+i*90);setTimeout(()=>{c.style.transition=""},900+i*90)}
  });
  if(!HAND.length)el.innerHTML='<div class="empty"><strong>Pulsa “Repartir”</strong>Saldrán cartas boca abajo con juegos que encajan con tus filtros.</div>';
}

/* ===================== DUELO ===================== */
let BR=null;
function duelStart(){
  if(noPool())return;const n=CFG.duel;const ps=sample(n);if(ps.length<2){toast("Hacen falta al menos 2 juegos para un duelo.");return}
  BR={round:ps,next:[],i:0,total:ps.length-1,done:0};renderDuel();
}
function roundName(len){return len<=2?"Final":len<=4?"Semifinal":len<=8?"Cuartos de final":"Octavos de final"}
function renderDuel(){
  const el=$("#duelArea");
  if(!BR){el.innerHTML='<div class="empty"><strong>Pulsa “Nuevo duelo”</strong>Saldrán parejas de juegos y tú eliges cuál sigue. El último en pie es tu próxima partida.</div>';return}
  if(BR.champ){const g=BR.champ;el.innerHTML="";const w=document.createElement("div");w.className="champ";const cv=coverEl(g);w.appendChild(cv);
    const r=document.createElement("div");r.innerHTML=`<h3>CAMPEÓN DEL DUELO</h3><h2>${esc(g.n)}</h2><div class="meta" style="color:var(--muted);margin-bottom:14px">${esc([platShort(g),g.y||"",devOf(g)].filter(Boolean).join(" · "))}</div><div class="controls" style="justify-content:flex-start"><button class="btn primary" type="button" id="chOpen">Ver ficha</button><button class="btn" type="button" id="chAgain">Otro duelo</button></div>`;
    w.appendChild(r);el.appendChild(w);$("#chOpen").onclick=()=>openDetail(g,"Campeón del duelo");$("#chAgain").onclick=duelStart;return}
  const a=BR.round[BR.i],b=BR.round[BR.i+1];
  const fights=Math.floor(BR.round.length/2),bye=BR.round.length%2?" · uno pasa directo":"";
  el.innerHTML=`<div class="round"><span>${roundName(BR.round.length)}</span><span class="minilabel">combate ${BR.i/2+1} de ${fights}${bye}</span><span class="dots">${Array.from({length:BR.total},(_,k)=>`<i class="${k<BR.done?"done":""}"></i>`).join("")}</span></div><div class="duel"></div>`;
  const d=el.querySelector(".duel");
  const mk=(g,side)=>{const f=document.createElement("div");f.className="fighter";
    const pa=document.createElement("button");pa.type="button";pa.className="pickarea";pa.title="Elegir este juego";pa.appendChild(coverEl(g,{lazy:false}));
    const t=document.createElement("div");t.innerHTML=`<h4>${esc(g.n)}</h4><div class="meta">${esc([platShort(g),g.y||"",g.s===0&&g.rp>=0?g.rp+" % positivas":""].filter(Boolean).join(" · "))}</div><div class="gl">${genresOf(g).slice(0,3).map(x=>`<span>${GENRE_ES[x]}</span>`).join("")}</div>`;
    pa.appendChild(t);pa.onclick=()=>duelPick(side);
    const ac=document.createElement("div");ac.className="facts2";
    ac.innerHTML=`<button type="button" data-a="ficha">${ICONS.play}Ver ficha</button><button type="button" class="go" data-a="pick">Elegir</button>`;
    ac.querySelector('[data-a="ficha"]').onclick=()=>openDuelDetail(side);
    ac.querySelector('[data-a="pick"]').onclick=()=>duelPick(side);
    f.append(pa,ac);return f};
  d.appendChild(mk(a,0));const vs=document.createElement("div");vs.className="vs";vs.textContent="VS";d.appendChild(vs);d.appendChild(mk(b,1));
}
function openDuelDetail(side){
  if(!BR||BR.champ)return;const g=BR.round[BR.i+side],rival=BR.round[BR.i+1-side];
  openDetail(g,`Duelo · ${roundName(BR.round.length)}`,{duel:{side,rival}});
}
function duelPick(side){
  if(!BR||BR.champ)return;const w=BR.round[BR.i+side];whoosh();BR.next.push(w);BR.i+=2;BR.done++;
  if(BR.i>=BR.round.length-1){if(BR.i===BR.round.length-1)BR.next.push(BR.round[BR.i]);BR.round=BR.next;BR.next=[];BR.i=0}
  if(BR.round.length===1){BR.champ=BR.round[0];ding();addHist(BR.champ)}
  renderDuel();
}

/* ===================== EXPLORAR ===================== */
let XLIST=[],XN=0,XSEED=Math.random()*1e9|0;
function renderExplore(reset){
  const q=$("#xSearch").value.trim().toLowerCase(),s=$("#xSort").value;
  const match=g=>g.lc.includes(q)||devOf(g).toLowerCase().includes(q);
  let list=BROWSE,notice="";
  if(q){
    list=list.filter(match);
    // "todo el catálogo" se salta los filtros, pero no la preferencia de ocultar contenido adulto
    const everywhere=ALL.filter(g=>match(g)&&!(F.adult&&(g.s?g.ad:has(g,"adult")))),hidden=everywhere.length-list.length;
    const shown=new Set(list.map(g=>g.id)),disc=everywhere.filter(g=>DISC.has(g.id)&&!shown.has(g.id)).length;
    const why=SIM?"tus filtros o el modo «Parecidos»":"tus filtros",one=hidden===1;
    const reason=disc===hidden?`${one?"lo":"los"} descartaste`:`${why} ${one?"lo ocultan":"los ocultan"}${disc?` (${fmt(disc)} ${disc===1?"lo descartaste":"los descartaste"})`:""}`;
    if(XALL){list=everywhere;notice=`<span>Buscando <b>«${esc(q)}»</b> en todo el catálogo, sin filtros ni descartes.</span><button class="btn" type="button" data-x="back">Volver a mis filtros</button>`}
    else if(hidden>0)notice=`<span><b>${fmt(hidden)}</b> ${one?"juego más coincide":"juegos más coinciden"} con «${esc(q)}», pero ${reason}.</span><button class="btn sun" type="button" data-x="all">${one?"Mostrarlo":"Mostrarlos"}</button>`;
  }
  const nb=$("#xNotice");nb.hidden=!notice;nb.innerHTML=notice;
  if(notice){const b=nb.querySelector("[data-x]");b.onclick=()=>{XALL=b.dataset.x==="all";renderExplore(true)}}
  list=list.slice();
  if(s==="sim"&&SIM)list.sort((a,b)=>(SIM.scores.get(b.id)||0)-(SIM.scores.get(a.id)||0)||((b.rc||0)-(a.rc||0)));
  else if(s==="rand"){const r=rng(XSEED);for(let i=list.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[list[i],list[j]]=[list[j],list[i]]}}
  else if(s==="score")list.sort((a,b)=>((b.s?-1:b.rp*Math.min(1,Math.log10(b.rc+1)/3))-(a.s?-1:a.rp*Math.min(1,Math.log10(a.rc+1)/3))));
  else if(s==="pop")list.sort((a,b)=>(b.s?-1:b.rc)-(a.s?-1:a.rc));
  else if(s==="new")list.sort((a,b)=>(b.y||0)-(a.y||0));
  else if(s==="old")list.sort((a,b)=>(a.y||9999)-(b.y||9999));
  else if(s==="az")list.sort((a,b)=>a.n.localeCompare(b.n,"es"));
  const nr=list.reduce((a,g)=>a+g.s,0);$("#xPoolN").textContent=fmt(list.length);
  $("#xPoolSplit").textContent=list.length?`${list.length===1?"juego":"juegos"} · PC ${fmt(list.length-nr)} · emulado ${fmt(nr)}`:"ningún juego";
  const empty=SIM&&!q?`<strong>Ningún juego parecido encaja con tus filtros</strong>Prueba a quitar algún filtro o pulsa «Quitar» arriba para volver al catálogo completo.`:`<strong>No hay resultados</strong>Cambia la búsqueda o los filtros.`;
  XLIST=list;XN=0;$("#xGrid").innerHTML=list.length?"":`<div class="empty" style="grid-column:1/-1">${empty}</div>`;moreExplore();
}
function tileEl(g,extra){
  const b=document.createElement(extra?"div":"button");if(!extra)b.type="button";b.className="tile";b.dataset.id=g.id;
  const cv=coverEl(g);const n=document.createElement("div");n.className="nm";n.textContent=g.n;
  const m=document.createElement("div");m.className="meta";
  m.innerHTML=esc([g.s?sysOf(g).short:"PC",g.y||""].filter(Boolean).join(" · "))+(g.s===0&&g.rp>=0?` · <span class="sc">${g.rp}%</span>`:"");
  if(extra){const open=document.createElement("button");open.type="button";open.style.cssText="border:0;padding:0;background:none;text-align:left;display:grid;gap:7px";open.append(cv,n);open.onclick=()=>openDetail(g,extra);b.append(open,m)}
  else{b.append(cv,n,m);b.onclick=()=>openDetail(g,"Explorando")}
  return b;
}
function moreExplore(){const el=$("#xGrid"),frag=document.createDocumentFragment();const end=Math.min(XLIST.length,XN+48);for(;XN<end;XN++)frag.appendChild(tileEl(XLIST[XN]));el.appendChild(frag)}

/* ===================== MI LISTA ===================== */
let LTAB="list";
function renderList(){
  $$("#lTabs .chip").forEach(b=>b.setAttribute("aria-pressed",b.dataset.v===LTAB));
  const el=$("#lGrid");el.innerHTML="";
  const ids=LTAB==="list"?LIST.map(x=>x.id):LTAB==="hist"?HIST:[...DISC];
  const items=ids.map(id=>BYID.get(id)).filter(Boolean);
  if(!items.length){el.innerHTML=`<div class="empty" style="grid-column:1/-1"><strong>${LTAB==="list"?"Tu lista está vacía":LTAB==="hist"?"Aún no ha salido ningún juego":"No has descartado nada"}</strong>${LTAB==="list"?"Abre la ficha de un juego y pulsa “Guardar”.":LTAB==="hist"?"Gira la ruleta, reparte cartas o haz un duelo.":"Los juegos que marques con “No me interesa” aparecerán aquí."}</div>`;return}
  const kick={list:"De tu lista",hist:"De tu historial",disc:"Descartado"}[LTAB];
  for(const g of items){const t=tileEl(g,kick);const acts=document.createElement("div");acts.className="listacts";
    if(LTAB==="list"){const x=LIST.find(x=>x.id===g.id);if(x.played)t.classList.add("played");
      acts.innerHTML=`<label><input type="checkbox" ${x.played?"checked":""}> Jugado</label><button type="button">Quitar</button>`;
      acts.querySelector("input").onchange=e=>{x.played=e.target.checked;saveList();t.classList.toggle("played",x.played)};
      acts.querySelector("button").onclick=()=>{toggleFav(g);renderList()}}
    else if(LTAB==="disc"){acts.innerHTML=`<button type="button">Recuperar</button>`;acts.querySelector("button").onclick=()=>{DISC.delete(g.id);saveDisc();rebuildPool();renderList();toast(`${g.n} vuelve a poder salir`)}}
    t.appendChild(acts);el.appendChild(t)}
  if(LTAB==="hist"){const b=document.createElement("div");b.style.gridColumn="1/-1";b.innerHTML='<button class="link" type="button">Vaciar historial</button>';b.querySelector("button").onclick=clearHistory;el.prepend(b)}
}

/* ===================== MEDIOS EXTERNOS ===================== */
// PC: capturas y descripción con rawg-to-steam-redirect (/api), tráileres y descripción en español con el proxy de la tienda de Steam (/steam-store).
// Ambos los sirve el docker-compose incluido en la misma dirección que la página, porque Steam no permite peticiones desde otras webs.
const mediaCache=new Map();
const HOSTED_R2S="https://rawg2steam.phalco.de/api";
const SERVED=/^https?:$/.test(location.protocol);
const STATE={r2s:null,r2sDead:new Set(),proxy:SERVED?undefined:false,getItemsDown:false};
const local=path=>new URL(path,location.href).href;
function withTimeout(p,ms){return Promise.race([p,new Promise((_,r)=>setTimeout(()=>r(new Error("timeout")),ms))])}
async function getJSON(url,ms){
  const r=await withTimeout(fetch(url),ms);const isJson=(r.headers.get("content-type")||"").includes("json");
  if(!r.ok){const e=new Error("HTTP "+r.status);e.status=r.status;e.json=isJson;throw e}
  if(!isJson){const e=new Error("no es JSON");e.json=false;throw e}
  return r.json();
}
function r2sBases(){const c=(CFG.r2s||"").trim();if(c&&c!=="auto")return [c.replace(/\/+$/,"")];const b=[];if(SERVED)b.push(local("api").replace(/\/+$/,""));b.push(HOSTED_R2S);return b}
async function r2sMedia(g){
  if(!g.app||imagesBlocked())return null;
  const bases=STATE.r2s?[STATE.r2s]:r2sBases().filter(x=>!STATE.r2sDead.has(x));
  for(const base of bases){
    try{
      const sh=await getJSON(`${base}/games/${g.app}/screenshots`,15000);STATE.r2s=base;
      let det=null;try{det=await getJSON(`${base}/games/${g.app}`,20000)}catch(e){}
      return {shots:(sh.results||[]).filter(x=>x.image).map(x=>({full:x.image,thumb:x.image.replace(".1920x1080.",".600x338.")})),bg:det&&det.background_image||"",desc:det&&det.description_raw||""};
    }catch(e){if(e.json){STATE.r2s=base;return null}STATE.r2sDead.add(base)}
  }
  return null;
}
async function storeMedia(g){
  if(!g.app||STATE.proxy===false||imagesBlocked())return null;
  try{
    const j=await getJSON(local(`steam-store/api/appdetails?appids=${g.app}&l=spanish&cc=es`),15000);STATE.proxy=true;
    const d=j&&j[g.app]&&j[g.app].success&&j[g.app].data;if(!d)return null;
    const https=u=>(u||"").replace(/^http:/,"https:");
    const videos=[];
    for(const m of d.movies||[]){const srcs=[];
      if(m.mp4&&(m.mp4.max||m.mp4["480"]))srcs.push({src:https(m.mp4.max||m.mp4["480"]),type:"video/mp4"});
      if(m.webm&&(m.webm.max||m.webm["480"]))srcs.push({src:https(m.webm.max||m.webm["480"]),type:"video/webm"});
      if(m.hls_h264)srcs.push({src:https(m.hls_h264),type:"application/x-mpegURL"});
      if(srcs.length)videos.push({srcs,poster:https(m.thumbnail),name:m.name||"Tráiler"})}
    return {videos,shots:(d.screenshots||[]).filter(x=>x.path_full).map(x=>({full:https(x.path_full),thumb:https(x.path_thumbnail||x.path_full)})),desc:d.short_description||""};
  }catch(e){if(!e.json)STATE.proxy=false;return null}
}
// Último recurso sin servidor: la API pública de Steam (suele bloquear peticiones desde otras webs).
async function steamMedia(g){
  if(!CFG.steamApi||STATE.getItemsDown||!g.app||imagesBlocked())return null;
  const input={ids:[{appid:g.app}],context:{language:"spanish",country_code:"ES",steam_realm:1},data_request:{include_screenshots:true,include_basic_info:true}};
  try{
    const j=await getJSON("https://api.steampowered.com/IStoreBrowseService/GetItems/v1/?input_json="+encodeURIComponent(JSON.stringify(input)),8000);
    const it=j&&j.response&&j.response.store_items&&j.response.store_items[0];if(!it)return null;
    const ss=it.screenshots||{},shots=[];
    for(const x of [...(ss.all_ages_screenshots||[]),...(ss.mature_content_screenshots||[])]){const f=x.filename||"";if(!f)continue;const u=f.startsWith("http")?f:SC+(f.includes("/")?f:`steam/apps/${g.app}/${f}`);shots.push({full:u,thumb:u})}
    return {shots,desc:it.basic_info&&it.basic_info.short_description||""};
  }catch(e){if(e instanceof TypeError)STATE.getItemsDown=true;return null}
}
function getMedia(g){
  if(!mediaCache.has(g.id))mediaCache.set(g.id,(async()=>{
    if(g.s)return {};
    const [r,st]=await Promise.all([r2sMedia(g),storeMedia(g)]);
    const direct=(!r&&!st)?await steamMedia(g):null;
    return {r2s:r,store:st,direct};
  })());
  return mediaCache.get(g.id);
}
let hlsP=null;
function loadHls(){return hlsP||(hlsP=new Promise((res,rej)=>{const sc=document.createElement("script");sc.src="https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.13/hls.min.js";sc.onload=()=>res(window.Hls);sc.onerror=rej;document.head.appendChild(sc)}))}
async function testConnection(){
  const st=$("#r2sStatus");st.className="status";st.textContent="Probando…";
  const saved=CFG.r2s;CFG.r2s=$("#r2sUrl").value.trim()||"auto";const out=[];let ok=false;
  for(const base of r2sBases()){try{await getJSON(`${base}/games/620/screenshots`,15000);out.push(`rawg-to-steam responde en ${base}`);ok=true;break}catch(e){out.push(e.json?`rawg-to-steam responde en ${base}`:`Sin respuesta de ${base}`);if(e.json){ok=true;break}}}
  if(SERVED){try{await getJSON(local("steam-store/api/appdetails?appids=620&l=spanish"),15000);out.push("Proxy de la tienda de Steam (tráileres): funciona")}catch(e){out.push("Proxy de la tienda de Steam (tráileres): no disponible")}}
  else out.push("Abriste el archivo con doble clic: para tráileres usa la versión de Docker en http://localhost:8080");
  CFG.r2s=saved;st.textContent=out.join(" · ");st.classList.add(ok?"ok":"bad");
}

/* ===================== FICHA ===================== */
let CUR=null;
function controlsHTML(g){
  if(g.s===1){const s=sysOf(g);let t=`<span class="ico">${ICONS.pad} Mando (emulado)</span>`;if(s.key==="nds"||s.key==="3ds")t+=`<span class="ico">${ICONS.mouse} Táctil con ratón</span>`;if(s.key==="wii")t+=`<span class="ico">Wiimote: mando o ratón</span>`;return t}
  const o=[];if(has(g,"fullpad"))o.push(`<span class="ico">${ICONS.pad} Mando: soporte completo</span>`);else if(has(g,"partpad"))o.push(`<span class="ico">${ICONS.pad} Mando: parcial</span>`);else if(has(g,"padrec"))o.push(`<span class="ico">${ICONS.pad} Mando recomendado</span>`);
  if(has(g,"vronly"))o.push("Solo realidad virtual");else if(has(g,"kbonly"))o.push(`<span class="ico">${ICONS.kb} Solo teclado</span>`);
  if(has(g,"mouseonly"))o.push(`<span class="ico">${ICONS.mouse} Solo ratón</span>`);
  if(!has(g,"vronly")&&!has(g,"mouseonly")&&!has(g,"kbonly"))o.push(`<span class="ico">${ICONS.kb}${ICONS.mouse} Teclado y ratón</span>`);return o.join("")}
function playersTxt(g){if(g.s)return g.us>=2?`Hasta ${g.us} jugadores`:g.us===1?"1 jugador":"Sin datos";
  const m=[["single","Un jugador"],["cooponl","Coop online"],["cooploc","Coop local"],["pvponl","PvP online"],["pvploc","PvP local"],["mmo","MMO"],["remoteplay","Remote Play Together"]];const t=m.filter(([k])=>has(g,k)).map(x=>x[1]);return t.length?t.join(" · "):"Sin datos"}
function reviewLabel(p){return p>=95?"Extremadamente positivas":p>=80?"Muy positivas":p>=70?"Mayormente positivas":p>=40?"Variadas":"Mayormente negativas"}
const enc=encodeURIComponent;
function openDetail(g,kicker,opt={}){
  const duel=opt.duel&&BR&&!BR.champ?opt.duel:null;
  CUR=g;const dl=$("#detail"),sh=$("#dsheet");sh.scrollTop=0;
  try{history.replaceState(null,"","#"+(g.s===0&&g.app?"steam-"+g.app:(g.s?"r-":"p-")+g.i))}catch(e){}
  setAmbient(g);
  const gs=genresOf(g),plat=g.s?sysOf(g).label:(has(g,"gog")?"PC · GOG":"PC · Steam"),dv=devOf(g),fav=LIST.some(x=>x.id===g.id);
  const rows=[["Controles",controlsHTML(g)],["Jugadores",esc(playersTxt(g))]];
  if(g.s===0){
    if(g.rp>=0)rows.push(["Reseñas",`<span class="score">${g.rp} %</span><span class="meter"><i style="width:${g.rp}%"></i></span><br><span style="color:var(--muted)">${reviewLabel(g.rp)} · ${fmt(g.rc)} en Steam</span>`]);
    if(g.mc)rows.push(["Metacritic",`<span class="score">${g.mc}</span>`]);
    if(g.h)rows.push(["Duración",`<span class="score">${g.h.toLocaleString("es-ES",{maximumFractionDigits:1})} h</span> la historia principal`]);
    rows.push(["Precio",has(g,"free")?"Gratis":g.pr>0?`<span class="score">${(g.pr/100).toLocaleString("es-ES",{style:"currency",currency:"USD"})}</span> <span style="color:var(--faint)">(referencia)</span>`:"Sin datos"]);
    rows.push(["Español",has(g,"esvoz")?"Textos y voces":has(g,"es")?"Textos":"No"]);
    const sy=["Windows"];if(has(g,"mac"))sy.push("macOS");if(has(g,"linux"))sy.push("Linux");rows.push(["Sistemas",sy.join(" · ")]);
  }else{rows.push(["Emulador",esc(sysOf(g).emu)]);if(g.rg)rows.push(["Regiones",esc(g.rg.replace(/,/g," · "))])}
  const links=[];
  links.push([`https://www.youtube.com/results?search_query=${enc(g.n+" "+(g.s?sysOf(g).label:"")+" trailer gameplay")}`,"Tráiler en YouTube","yt"]);
  links.push([`https://www.google.com/search?q=${enc('"'+g.n+'" '+(g.s?sysOf(g).label:"PC")+" videojuego")}`,"Buscar en Google"]);
  if(g.s===0){if(g.app)links.push([`https://store.steampowered.com/app/${g.app}`,"Steam"]);else links.push([`https://www.gog.com/en/games?query=${enc(g.n)}`,"GOG"]);
    links.push([g.hl?`https://howlongtobeat.com/game/${g.hl}`:`https://howlongtobeat.com/?q=${enc(g.n)}`,"HowLongToBeat"]);links.push([`https://www.pcgamingwiki.com/w/index.php?search=${enc(g.n)}`,"PCGamingWiki"])}
  else{links.push([`https://howlongtobeat.com/?q=${enc(g.n)}`,"HowLongToBeat"])}
  const tags=g.s===0&&g.tg.length?`<div class="dsec"><h3>Etiquetas</h3><div class="tagl">${g.tg.map(t=>`<button type="button" data-tag="${esc(PC.tags[t])}" title="Buscar con esta etiqueta">${esc(tagName(PC.tags[t]))}</button>`).join("")}</div></div>`:"";
  sh.innerHTML=`<button class="dclose" type="button" aria-label="Cerrar ficha">${ICONS.x}</button>
   <div class="dhero"><div class="hbg" id="hbg"></div><div class="dhead"><div id="dcover"></div><div>
     <div class="minilabel" style="color:var(--sun)">${esc(kicker||"")}</div>
     <img class="dlogo" id="dlogo" alt="" hidden>
     <h2 class="dtitle" id="dtitle">${esc(g.n)}</h2>${dv?`<div class="ddev">${esc(dv)}</div>`:""}
     <div class="badges"><span class="badge plat">${esc(plat)}</span>${g.y?`<span class="badge">${g.y}</span>`:""}${gs.map(x=>`<span class="badge g">${GENRE_ES[x]}</span>`).join("")}</div></div></div></div>
   <div class="dacts">${duel?`
     <button class="btn duelgo" type="button" id="aDuelGo">${ICONS.star}Este pasa de ronda</button>
     <button class="btn" type="button" id="aRival">${ICONS.sim}Ver el rival: ${esc(duel.rival.n.length>34?duel.rival.n.slice(0,32)+"…":duel.rival.n)}</button>
     <button class="btn ${fav?"on":""}" type="button" id="aFav">${ICONS.star}${fav?"Guardado":"Guardar"}</button>`:`
     <button class="btn ${fav?"on":""}" type="button" id="aFav">${ICONS.star}${fav?"Guardado":"Guardar"}</button>
     <button class="btn" type="button" id="aSim">${ICONS.sim}Parecidos</button>
     ${dv?`<button class="btn" type="button" id="aDev">${ICONS.studio}Más de este estudio</button>`:""}
     <button class="btn" type="button" id="aOther">${ICONS.dice}Otro al azar</button>
     <button class="btn" type="button" id="aNo">${ICONS.x}No me interesa</button>`}</div>
   <div class="dbody">
     <div class="dsec"><h3>Imágenes y vídeo</h3><div class="viewer" id="viewer"></div><div class="mthumbs" id="mthumbs"></div><div class="msrc" id="msrc"></div></div>
     <div class="dsec" style="gap:16px"><div class="dsec"><h3>Ficha</h3><dl class="facts">${rows.map(([a,b])=>`<dt>${a}</dt><dd>${b}</dd>`).join("")}</dl></div>
       <div class="dsec"><h3>De qué va</h3><p class="ddesc" id="ddesc"><span class="loading">Cargando…</span></p></div>${tags}
       <div class="dsec"><h3>Más información</h3><div class="links">${links.map(([u,t,c])=>`<a class="${c||""}" href="${u}" target="_blank" rel="noopener">${t} ↗</a>`).join("")}</div></div></div>
   </div>`;
  // portada y fondo
  $("#dcover").appendChild(coverEl(g,{lazy:false}));
  const hb=$("#hbg");const himg=new Image();himg.alt="";hb.appendChild(himg);
  const heroFail=()=>{himg.remove();hb.appendChild(genCanvas(g,960,400))};
  const hs=heroSources(g);if(!hs.length||imagesBlocked())heroFail();else chainImg(himg,hs,s=>hb.classList.toggle("soft",!!s.soft),heroFail);
  if(g.s===0&&g.app&&!imagesBlocked()){const lg=$("#dlogo");lg.referrerPolicy="no-referrer";lg.onload=()=>{lg.hidden=false;$("#dtitle").classList.add("withlogo")};lg.onerror=()=>{lg.remove()};lg.src=steamAsset(g,"logo.png")}
  // acciones
  $(".dclose").onclick=()=>dl.close();
  $("#aFav").onclick=e=>{toggleFav(g);const on=LIST.some(x=>x.id===g.id);e.currentTarget.classList.toggle("on",on);e.currentTarget.innerHTML=ICONS.star+(on?"Guardado":"Guardar")};
  if(duel){
    $("#aDuelGo").onclick=()=>{dl.close();duelPick(duel.side)};
    $("#aRival").onclick=()=>openDuelDetail(1-duel.side);
  }else{
    $("#aSim").onclick=()=>{dl.close();startSimilar(g)};
    if(dv)$("#aDev").onclick=()=>{dl.close();setView("explorar");$("#xSearch").value=dv;renderExplore(true)};
    $("#aOther").onclick=()=>{if(noPool())return;const n=pick();addHist(n);openDetail(n,"Otro al azar")};
    $("#aNo").onclick=()=>{discard(g);dl.close()};
  }
  // Etiqueta: muestra en Explorar los juegos con esa etiqueta (sustituye filtros y «Parecidos»; se puede deshacer)
  if(!duel)sh.querySelectorAll(".tagl [data-tag]").forEach(b=>b.onclick=()=>{const undo=snapshot();
    F=Object.assign(freshFilters(),{tags:[b.dataset.tag],origin:"pc"});SIM=null;XALL=false;$("#xSearch").value="";
    dl.close();setView("explorar");change();renderTagChips();toast(`Juegos con la etiqueta «${tagName(b.dataset.tag)}»`,undo)});
  // descripción
  desc(g).then(d=>{if(CUR!==g)return;const el=$("#ddesc");if(!el||el.dataset.es)return;let text="",extra="";
    if(g.s===0){text=Array.isArray(d)?d[0]:(d||"");if(Array.isArray(d)&&d[1]){const a=[...sh.querySelectorAll(".links a")].find(x=>x.textContent.startsWith("GOG"));if(a)a.href=d[1]}}
    else if(d){text=d[0];extra=[d[1]&&"Editora: "+d[1],d[2]&&"Saga: "+d[2]].filter(Boolean).join(" · ")}
    el.dataset.en=text?"1":"";el.innerHTML=(text?esc(text)+' <span style="color:var(--faint);font-size:12px">(en inglés)</span>':"No hay descripción en la base de datos.")+(extra?`<br><span style="color:var(--muted);font-size:13.5px">${esc(extra)}</span>`:"")});
  renderMedia(g);
  if(!dl.open)dl.showModal();
}
function setAmbient(g){const a=$("#ambient");const src=(coverSources(g)[0]||{}).src;a.style.backgroundImage=src&&!imagesBlocked()?`url("${src}")`:"none"}
async function renderMedia(g){
  const viewer=$("#viewer"),th=$("#mthumbs"),src=$("#msrc");
  let items=[];
  if(g.s===0){if(!imagesBlocked()){items.push({type:"img",full:headerUrl(g),thumb:headerUrl(g),lbl:"Portada"});if(g.app&&!(g.img&&!g.img.startsWith("h:")))items.push({type:"img",full:steamAsset(g,"library_hero.jpg"),thumb:steamAsset(g,"library_hero.jpg"),lbl:"Arte"})}}
  else if(g.th&&!imagesBlocked()){if(g.tm&2)items.push({type:"img",full:thumb(g,"Snaps"),thumb:thumb(g,"Snaps"),lbl:"Partida",pixel:true});if(g.tm&4)items.push({type:"img",full:thumb(g,"Titles"),thumb:thumb(g,"Titles"),lbl:"Título",pixel:true});if(g.tm&1)items.push({type:"img",full:thumb(g,"Boxarts"),thumb:thumb(g,"Boxarts"),lbl:"Caja"})}
  let cur=0;
  const draw=()=>{th.innerHTML="";items.forEach((it,i)=>{const b=document.createElement("button");b.type="button";b.setAttribute("aria-current",i===cur);b.setAttribute("aria-label",it.lbl||("Imagen "+(i+1)));
      const im=new Image();im.loading="lazy";im.alt="";im.referrerPolicy="no-referrer";im.src=it.thumb||it.poster||"";im.onerror=()=>{if(it.type==="img"&&i!==cur){it.dead=true;b.remove()}else im.remove()};b.appendChild(im);
      if(it.type==="video"){const p=document.createElement("span");p.className="play";p.innerHTML=ICONS.play;b.appendChild(p)}
      if(it.lbl){const l=document.createElement("span");l.className="lbl";l.textContent=it.lbl;b.appendChild(l)}
      b.onclick=()=>{cur=i;show();draw()};th.appendChild(b)})};
  const show=()=>{viewer.innerHTML="";const it=items[cur];
    if(!it){viewer.innerHTML=`<div class="note">${imagesBlocked()?"Esta vista no puede cargar imágenes externas. Abre la versión descargada para ver carátulas, capturas y tráileres.":"No hay imágenes para este juego."}</div>`;return}
    if(it.type==="video"){const v=document.createElement("video");v.controls=true;v.playsInline=true;v.preload="metadata";if(it.poster)v.poster=it.poster;if(CFG.autoplay){v.autoplay=true;v.muted=true}
      const fail=()=>{if(!viewer.contains(v))return;viewer.innerHTML=`<div class="note"><div>No se pudo reproducir este tráiler aquí.<br><a href="${g.app?`https://store.steampowered.com/app/${g.app}`:"#"}" target="_blank" rel="noopener">Verlo en Steam ↗</a></div></div>`};
      const files=it.srcs.filter(x=>!/mpegurl/i.test(x.type)),hls=it.srcs.find(x=>/mpegurl/i.test(x.type));
      if(files.length){files.forEach((x,k)=>{const so=document.createElement("source");so.src=x.src;so.type=x.type;if(k===files.length-1&&!hls)so.onerror=fail;v.appendChild(so)})}
      if(!files.length&&hls){if(v.canPlayType("application/vnd.apple.mpegurl"))v.src=hls.src;else loadHls().then(H=>{if(!H||!H.isSupported())return fail();const h=new H();h.loadSource(hls.src);h.attachMedia(v);h.on(H.Events.ERROR,(_,d)=>{if(d&&d.fatal)fail()});if(CFG.autoplay)v.play().catch(()=>{})}).catch(fail)}
      viewer.appendChild(v)}
    else{const im=new Image();im.alt="";im.referrerPolicy="no-referrer";if(it.pixel)im.style.imageRendering="pixelated";im.src=it.full;im.onerror=()=>{if(it.thumb&&im.src!==it.thumb)im.src=it.thumb;else{items.splice(cur,1);cur=Math.max(0,cur-1);show();draw()}};viewer.appendChild(im)}};
  show();draw();
  src.textContent=imagesBlocked()?"":"Buscando capturas y tráileres…";
  const m=await getMedia(g);if(CUR!==g)return;
  const vids=[],imgs=[],from=[];
  if(m.store&&m.store.videos.length){m.store.videos.slice(0,4).forEach(v=>vids.push({type:"video",srcs:v.srcs,poster:v.poster,thumb:v.poster,lbl:"Tráiler"}));from.push("tienda de Steam")}
  let shots=[];
  if(m.r2s&&m.r2s.shots.length){shots=m.r2s.shots;from.push("rawg-to-steam")}
  else if(m.store&&m.store.shots.length){shots=m.store.shots;if(!from.length)from.push("tienda de Steam")}
  else if(m.direct&&m.direct.shots.length){shots=m.direct.shots;from.push("Steam")}
  shots.slice(0,16).forEach(x=>imgs.push({type:"img",full:x.full,thumb:x.thumb}));
  if(m.r2s&&m.r2s.bg&&!items.some(x=>x.full===m.r2s.bg))imgs.push({type:"img",full:m.r2s.bg,thumb:m.r2s.bg,lbl:"Fondo"});
  // descripción: primero la de la tienda en español, si no la de rawg-to-steam (inglés) cuando la base de datos no tiene
  const el=$("#ddesc"),es=(m.store&&m.store.desc)||(m.direct&&m.direct.desc)||"";
  if(el&&es){el.dataset.es="1";el.textContent=new DOMParser().parseFromString(es,"text/html").body.textContent}
  else if(el&&m.r2s&&m.r2s.desc&&!el.dataset.en){el.dataset.es="1";const t=m.r2s.desc.length>700?m.r2s.desc.slice(0,700).replace(/\s+\S*$/,"")+"…":m.r2s.desc;el.innerHTML=esc(t)+' <span style="color:var(--faint);font-size:12px">(en inglés)</span>'}
  if(vids.length||imgs.length){items=[...vids,...imgs,...items];cur=0;show();draw()}
  if(imagesBlocked()){src.textContent="";return}
  if(g.s)src.textContent="Caja, pantalla de título y captura de libretro-thumbnails. El tráiler, con el botón de YouTube.";
  else if(from.length)src.textContent=`Capturas y tráileres: ${from.join(" y ")}.`;
  else src.textContent=SERVED?"No ha llegado nada de Steam para este juego. Comprueba en Ajustes que el servidor responde.":"Para ver capturas y tráileres abre la versión de Docker (http://localhost:8080, mira el README).";
}

/* ===================== vistas, ajustes, toast ===================== */
function setView(v){VIEW=v;$$(".modes button").forEach(b=>b.setAttribute("aria-selected",b.dataset.view===v));$$(".view").forEach(s=>s.classList.toggle("on",s.id==="view-"+v));
  if(v==="ruleta"&&!spinning){if(CFG.rstyle==="wheel")wheelIdle();else buildReelIdle()}
  if(v==="cartas"&&!HAND.length)renderHand();
  if(v==="duelo")renderDuel();
  if(v==="explorar")renderExplore(true);
  if(v==="lista")renderList();
  closeFilters();
}
function openFilters(){$("#filters").classList.add("open");$("#scrim").classList.add("on")}
function closeFilters(){$("#filters").classList.remove("open");$("#scrim").classList.remove("on")}
let tT=0;function toast(msg,action,label="Deshacer"){$("#toastTxt").textContent=msg;const b=$("#toastBtn");b.hidden=!action;b.textContent=label;b.onclick=()=>{$("#toast").classList.remove("on");action&&action()};$("#toast").classList.add("on");clearTimeout(tT);tT=setTimeout(()=>$("#toast").classList.remove("on"),action?7000:4200)}
function daily(){const d=new Date(),key=d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate(),r=rng(key*7919);const retroDay=key%3===0;
  const c=ALL.filter(g=>retroDay?(g.s&&g.gm&&g.y&&g.dv>=0&&!g.ad&&(g.tm&1)):(!g.s&&g.rc>=3000&&g.rp>=88&&!has(g,"adult")&&!has(g,"vronly")));return c[Math.floor(r()*c.length)]}
function surprise(){for(let k=0;k<50;k++){const g=ALL[Math.floor(Math.random()*ALL.length)];if(DISC.has(g.id))continue;if(g.s===0&&(has(g,"adult")||has(g,"vronly")))continue;if(g.s&&g.ad)continue;return g}return ALL[0]}
function openSettings(){$("#r2sUrl").value=CFG.r2s==="auto"?"":CFG.r2s;$("#autoplay").checked=CFG.autoplay;$("#steamApi").checked=CFG.steamApi;$("#r2sStatus").textContent="";$("#r2sStatus").className="status";$("#settings").showModal()}

/* ===================== arranque ===================== */
async function boot(){
  try{await load()}catch(e){$("#bootMsg").textContent="No se pudo cargar el catálogo. Comprueba que la carpeta data está junto a index.html y recarga.";$(".spinner").remove();return}
  F=sanitizeFilters(store.get("filters",null));save();loadSaved();
  buildFilters();syncFilters();rebuildPool();
  try{await document.fonts.ready}catch(e){}
  $("#boot").remove();$("#nList").textContent=LIST.length;
  $$(".modes button").forEach(b=>b.addEventListener("click",()=>setView(b.dataset.view)));
  $("#filtersBtn").onclick=openFilters;$("#scrim").onclick=closeFilters;$("#filtersClose").onclick=closeFilters;
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&$("#filters").classList.contains("open"))closeFilters()});
  // botones de «sin juegos» (ruleta vacía)
  $("#main").addEventListener("click",e=>{const b=e.target.closest(".nopool [data-a]");if(b)emptyAction(b.dataset.a)});
  $("#settingsBtn").onclick=openSettings;
  $("#r2sTest").onclick=testConnection;
  $("#settings").addEventListener("close",()=>{if($("#settings").returnValue==="ok"){CFG.r2s=$("#r2sUrl").value.trim()||"auto";CFG.autoplay=$("#autoplay").checked;CFG.steamApi=$("#steamApi").checked;STATE.r2s=null;STATE.r2sDead.clear();STATE.getItemsDown=false;if(SERVED)STATE.proxy=undefined;store.set("cfg",CFG);mediaCache.clear();toast("Ajustes guardados")}});
  $("#detail").addEventListener("close",()=>{$$("#viewer video").forEach(v=>v.pause());try{history.replaceState(null,"",location.pathname+location.search)}catch(e){}});
  $("#detail").addEventListener("click",e=>{if(e.target===$("#detail"))$("#detail").close()});
  // ruleta
  $$("#rStyle button").forEach(b=>b.onclick=()=>setRStyle(b.dataset.v));
  $("#spinBtn").onclick=()=>CFG.rstyle==="wheel"?spinWheel():spinReel();
  $("#dailyBtn").onclick=()=>{const g=daily();if(g)openDetail(g,"Juego del día")};
  $("#surpriseBtn").onclick=()=>{const g=surprise();addHist(g);openDetail(g,"Sorpresa sin filtros")};
  const sb=$("#soundBtn"),sv=()=>{sb.setAttribute("aria-pressed",CFG.sound);$("#soundWaves").style.opacity=CFG.sound?1:.15};sv();sb.onclick=()=>{CFG.sound=!CFG.sound;store.set("cfg",CFG);sv()};
  // cartas
  $$("#cCount button").forEach(b=>{b.setAttribute("aria-pressed",+b.dataset.v===CFG.cards);b.onclick=()=>{CFG.cards=+b.dataset.v;store.set("cfg",CFG);$$("#cCount button").forEach(x=>x.setAttribute("aria-pressed",x===b));deal()}});
  $("#dealBtn").onclick=deal;$("#flipAll").onclick=()=>{$$("#deal .card:not(.flipped)").forEach((c,i)=>setTimeout(()=>c.querySelector(".back").click(),i*120))};
  // duelo
  $$("#dSize button").forEach(b=>{b.setAttribute("aria-pressed",+b.dataset.v===CFG.duel);b.onclick=()=>{CFG.duel=+b.dataset.v;store.set("cfg",CFG);$$("#dSize button").forEach(x=>x.setAttribute("aria-pressed",x===b));duelStart()}});
  $("#duelStart").onclick=duelStart;
  // explorar
  let xs=0;$("#xSearch").addEventListener("input",()=>{clearTimeout(xs);xs=setTimeout(()=>{XALL=false;renderExplore(true)},200)});
  $("#xSort").onchange=()=>renderExplore(true);$("#xShuffle").onclick=()=>{XSEED=Math.random()*1e9|0;$("#xSort").value="rand";renderExplore(true)};
  new IntersectionObserver(es=>{if(es[0].isIntersecting&&VIEW==="explorar"&&XN<XLIST.length)moreExplore()},{rootMargin:"600px"}).observe($("#xSentinel"));
  // lista
  $("#lTabs").addEventListener("click",e=>{const b=e.target.closest("[data-v]");if(b){LTAB=b.dataset.v;renderList()}});
  // teclado
  document.addEventListener("keydown",e=>{
    if($("#detail").open||$("#settings").open)return;
    const tag=document.activeElement&&document.activeElement.tagName;if(/INPUT|SELECT|TEXTAREA/.test(tag))return;
    if(e.code==="Space"&&VIEW==="ruleta"&&tag!=="BUTTON"){e.preventDefault();$("#spinBtn").click()}
    if(VIEW==="duelo"&&BR&&!BR.champ){if(e.key==="ArrowLeft")duelPick(0);if(e.key==="ArrowRight")duelPick(1)}
  });
  addEventListener("resize",()=>{if(CFG.rstyle==="wheel"){sizeWheel();drawWheel()}});
  renderLast();setRStyle(CFG.rstyle);setView("ruleta");
  const m=/^#(?:steam-(\d+)|([pr])-(\d+))$/.exec(location.hash),fh=m&&(m[1]?KEYS.get("steam:"+m[1]):BYID.get(m[2]+m[3]));if(fh)openDetail(fh,"Enlace compartido");
}
boot();
})();
