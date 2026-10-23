import {ELEMENTS,BY_Z,FAMILY_NAMES,CONCEPTS,POLYATOMIC,TREND_PAIRS,MODES} from './data.js?v=2.3.3';
export const VERSION=2;
export const STORAGE_KEY='element-atlas-progress-v2';
export const escapeHTML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const dayKey=(date=new Date())=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
export function seedRandom(seed){let a=2166136261;for(const c of seed)a=Math.imul(a^c.charCodeAt(0),16777619);return()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
export function shuffle(input,rng=Math.random){const a=[...input];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export function pool(mode,scope='20'){
 let list=ELEMENTS.filter(e=>scope==='all'||scope==='main'?(scope==='all'||e.group===1||e.group===2||e.group>=13):['alk','hal','nob'].includes(scope)?e.cat===scope:e.z<=Number(scope));
 if(mode==='valence')list=list.filter(e=>e.valence!==null);
 if(mode==='ion')list=list.filter(e=>e.ions.length);
 if(mode==='group')list=list.filter(e=>e.group!==null);
 if(mode==='family'||mode==='match')list=list.filter(e=>e.z!==1);
 if(mode==='mass')list=list.filter(e=>!e.isotope);
 return list;
}
export const signed=n=>n>0?`+${n}`:`${n}`;
export function questionFor(mode,id,rng=Math.random){
 if(!MODES.some(m=>m.id===mode))return null;
 const key=`${mode}:${id}`,e=BY_Z[id];
 if(mode==='connections'){const c=CONCEPTS.find(c=>c.id===id);if(!c)return null;return {key,mode,id,prompt:c.prompt,answer:c.options[c.answer],options:shuffle(c.options,rng),explanation:c.explanation,hint:'Think about which particle or charge is changing.'};}
 if(mode==='polyatomic'){const item=POLYATOMIC.find(x=>x[0]===id);if(!item)return null;const [name,formula,charge]=item;return {key,mode,id,prompt:`Which formula represents ${name}?`,answer:formula,options:shuffle([formula,...shuffle(POLYATOMIC.filter(x=>x!==item),rng).slice(0,3).map(x=>x[1])],rng),explanation:`${name[0].toUpperCase()+name.slice(1)} is ${formula}, with an overall ${signed(charge)} charge.`,hint:`Its overall charge is ${signed(charge)}.`};}
 if(mode==='trends'){const pair=TREND_PAIRS[id];if(!pair)return null;const [a,b,property,correct]=pair,A=BY_Z[a],B=BY_Z[b],vertical=A.group===B.group;return {key,mode,id,prompt:`Which neutral atom has ${property==='radius'?'the larger atomic radius':'the higher first ionization energy'}?`,answer:BY_Z[correct].name,options:shuffle([A.name,B.name],rng),explanation:property==='radius'?(vertical?'Radius generally grows down a group as occupied shells are added.':'Across a period, increasing effective nuclear charge generally draws electrons closer.'):(vertical?'First ionization energy generally falls down a group as outer electrons become easier to remove.':'Across a period, first ionization energy generally rises. These selected pairs follow that trend.'),hint:vertical?'Compare positions down the same group.':'Compare positions across the same period.',pair:[a,b]};}
 if(!e||!pool(mode,'all').some(x=>x.z===e.z))return null;
 const named=`${e.name} (${e.symbol})`;
 const prompts={map:`Find ${e.name}`,name:'Name this element',spot:'Which element is highlighted?',number:`What is the atomic number of ${e.name}?`,mass:`What is the approximate atomic weight of ${e.name}?`,valence:`How many valence electrons does ${e.name} have?`,ion:`Give one common monatomic ion charge for ${e.name}.`,period:`Which period contains ${e.name}?`,group:`Which group contains ${e.name}?`,family:`Which family includes ${e.name}?`,match:`Match ${e.name} to its family.`};
 const answers={map:e.z,name:e.name,spot:named,number:e.z,mass:e.weight,valence:e.valence,ion:e.ions.map(signed).join(' or '),period:e.period,group:e.group,family:e.family,match:e.family};
 const explanations={map:`${named} is in period ${e.period}${e.group?`, group ${e.group}`:`, in the ${e.family.toLowerCase()}`}.`,name:`${e.symbol} is the symbol for ${e.name}, atomic number ${e.z}.`,spot:`${named} occupies this position in period ${e.period}.`,number:`${e.name} has ${e.z} protons. A neutral atom also has ${e.z} electrons.`,mass:`The classroom reference is ${e.weight}. Atomic weight reflects isotopic composition, not the mass number of one isotope.`,valence:e.z===2?'Helium’s first shell is full with two electrons.':`For this main-group atom, group ${e.group} corresponds to ${e.valence} valence electron${e.valence===1?'':'s'}.`,ion:`Selected common monatomic charges: ${e.ions.map(signed).join(' and ')}. Positive ions lose electrons; negative ions gain them.`,period:`Periods are horizontal rows. ${e.name} belongs to period ${e.period}${e.group?'':', even though this series is displayed below the main table'}.`,group:`${e.name} sits in vertical group ${e.group}.`,family:`${e.name} belongs to the ${e.family.toLowerCase()}${e.group&&e.group>12?`, group ${e.group}`:''}.`,match:`${e.name} belongs to the ${e.family.toLowerCase()}.`};
 return {key,mode,id:e.z,e,prompt:prompts[mode],answer:answers[mode],explanation:explanations[mode],hint:mode==='map'||mode==='spot'?`Look in period ${e.period}${e.group?`, group ${e.group}`:`, among the ${e.family.toLowerCase()}`}.`:mode==='name'?`The name starts with “${e.name[0]}” and has ${e.name.length} letters.`:mode==='ion'?`This element forms ${e.ions[0]>0?'positive':'negative'} ions in this deck.`:`Use ${e.name}’s position: period ${e.period}${e.group?`, group ${e.group}`:''}.`,options:mode==='family'?shuffle([e.family,...shuffle(FAMILY_NAMES.filter(x=>x!==e.family),rng).slice(0,3)],rng):null};
}
export function makeQuestions(mode,scope,count=10,rng=Math.random){
 const ids=mode==='connections'?CONCEPTS.map(c=>c.id):mode==='polyatomic'?POLYATOMIC.map(c=>c[0]):mode==='trends'?TREND_PAIRS.map((_,i)=>i):pool(mode,scope).map(e=>e.z);
 if(mode==='match'){const groups=shuffle([...new Set(pool(mode,scope).map(e=>e.family))],rng).slice(0,6);return groups.map(g=>questionFor(mode,shuffle(pool(mode,scope).filter(e=>e.family===g),rng)[0].z,rng));}
 return shuffle(ids,rng).slice(0,count==='all'?undefined:Number(count)).map(id=>questionFor(mode,id,rng));
}
export function dailyQuestions(date=dayKey()) {const rng=seedRandom(`atlas-${date}`),ids=shuffle(pool('map','36'),rng).slice(0,10);return ids.map((e,i)=>questionFor(e.z===1&&i%5===3?'number':['map','name','number','family','map'][i%5],e.z,rng));}
export function judge(q,input){
 let s=String(input).trim().toLowerCase();
 if(q.options)return s===String(q.answer).toLowerCase();
 if(q.mode==='name'||q.mode==='spot'){s=({aluminium:'aluminum',caesium:'cesium',sulphur:'sulfur'})[s]||s;return s===q.e.name.toLowerCase()||(q.mode==='spot'&&s===q.e.symbol.toLowerCase());}
 if(q.mode==='ion'){s=s.replace(/\s/g,'').replace(/−/g,'-');if(/^[+-]$/.test(s))s+='1';const m=s.match(/^([+-])?(\d)([+-])?$/);if(!m||(!m[1]&&!m[3])||(m[1]&&m[3]))return false;const n=Number(m[2])*((m[1]||m[3])==='-'?-1:1);return q.e.ions.includes(n);}
 if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(s))return false;
 return q.mode==='mass'?Math.abs(Number(s)-Number(q.answer))<=0.5:Number(s)===Number(q.answer);
}
export const blankProgress=()=>({version:VERSION,xp:0,skills:{},days:[],sessions:[],daily:{},settings:{theme:'light'}});
export function recordAnswer(p,q,correct,assisted=false,now=Date.now()){
 const s=p.skills[q.key]||{attempts:0,correct:0,streak:0,due:0,last:0};
 s.attempts++;if(correct)s.correct++;
 s.streak=correct&&!assisted?Math.min(s.streak+1,6):0;
 const days=[0,1,3,7,14,30,60][s.streak];
 s.due=correct&&!assisted?now+days*86400000:now+600000;s.last=now;p.skills[q.key]=s;
 p.xp+=correct?(assisted?5:10):2;
 const day=dayKey(new Date(now));if(!p.days.includes(day))p.days.push(day);
 return p;
}
export const dueQuestions=(p,now=Date.now())=>Object.entries(p.skills).filter(([,s])=>s.due<=now).sort((a,b)=>a[1].due-b[1].due).map(([key])=>{const [mode,id]=key.split(':');const q=questionFor(mode==='match'?'family':mode,Number.isNaN(Number(id))?id:Number(id));if(q&&mode==='match')q.key=key;return q;}).filter(Boolean);
export function streakDays(p,now=new Date()) {let n=0,d=new Date(now);if(!p.days.includes(dayKey(d)))d.setDate(d.getDate()-1);while(p.days.includes(dayKey(d))){n++;d.setDate(d.getDate()-1);}return n;}
export function validateProgress(raw){
 if(!raw||raw.version!==VERSION||typeof raw.skills!=='object'||!raw.skills||Array.isArray(raw.skills))throw Error('Choose an Element Atlas version 2 progress backup.');
 const p=blankProgress(),finite=(x,max=1e9)=>typeof x==='number'&&Number.isFinite(x)&&x>=0&&x<=max;
 if(Object.keys(raw.skills).length>3000)throw Error('This backup contains too many records.');
 for(const [key,s] of Object.entries(raw.skills)){const [mode,id,...rest]=key.split(':');if(rest.length||!questionFor(mode,Number.isNaN(Number(id))?id:Number(id))||!s||!['attempts','correct','streak','due','last'].every(k=>finite(s[k],k==='due'||k==='last'?1e15:1e8))||s.correct>s.attempts||s.streak>6)throw Error('This backup has an invalid study record.');p.skills[key]={attempts:Math.floor(s.attempts),correct:Math.floor(s.correct),streak:Math.floor(s.streak),due:s.due,last:s.last};}
 p.xp=finite(raw.xp)?Math.floor(raw.xp):0;
 p.days=Array.isArray(raw.days)?[...new Set(raw.days.filter(d=>/^\d{4}-\d{2}-\d{2}$/.test(d)))].slice(-4000):[];
 p.sessions=Array.isArray(raw.sessions)?raw.sessions.filter(s=>s&&typeof s.date==='string'&&finite(s.total,10000)&&finite(s.correct,10000)&&s.correct<=s.total).slice(-50).map(s=>({date:s.date.slice(0,30),mode:String(s.mode).slice(0,40),total:s.total,correct:s.correct})):[];
 for(const [d,v] of Object.entries(raw.daily||{})){if(/^\d{4}-\d{2}-\d{2}$/.test(d)&&finite(v,10))p.daily[d]=v;}
 p.settings={theme:raw.settings?.theme==='dark'?'dark':'light'};
 return p;
}
