import {ELEMENTS,BY_Z,CATEGORIES,MODES,SCOPES} from './data.js?v=2.2.0';
import {escapeHTML as esc,dayKey,shuffle,pool,questionFor,makeQuestions,dailyQuestions,judge,blankProgress,recordAnswer,dueQuestions,streakDays,validateProgress,STORAGE_KEY,signed} from './core.js?v=2.2.0';
const $=s=>document.querySelector(s);
const iconPaths={play:'M8 5l11 7-11 7V5z',map:'M9 4L3 7v14l6-3 6 3 6-3V4l-6 3-6-3zM9 4v14M15 7v14',chart:'M4 20V4M4 20h17M8 15v-4M13 15V7M18 15v-8',search:'M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',moon:'M20 14A8 8 0 0 1 10 4a8 8 0 1 0 10 10z',sun:'M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1 1M18 18l1 1M5 19l1-1M18 6l1-1M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0',arrow:'M5 12h14M14 7l5 5-5 5',check:'M5 12l4 4L20 5',x:'M6 6l12 12M18 6L6 18',bolt:'M13 2L4 14h7l-1 8 10-13h-8l1-7z',leaf:'M20 3C5 1 0 13 8 19s14-3 12-16zM5 22L16 9',target:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0M12 10v4M10 12h4',type:'M4 5h16M12 5v15M8 20h8',layers:'M12 3L2 8l10 5 10-5-10-5zM2 13l10 5 10-5M2 18l10 5 10-5',link:'M10 13a5 5 0 0 0 7 0l4-4a5 5 0 0 0-7-7l-3 3M14 11a5 5 0 0 0-7 0l-4 4a5 5 0 0 0 7 7l3-3',hash:'M9 3L7 21M17 3l-2 18M3 9h18M2 15h18',scale:'M12 3v17M6 20h12M4 7h16M6 7l-4 7h8L6 7zM18 7l-4 7h8l-4-7z',atom:'M12 2c6 0 6 20 0 20S6 2 12 2M3 6c3-5 21 5 18 10S0 11 3 6M3 18C0 13 18 3 21 8S6 23 3 18',rows:'M3 4h18v6H3V4zM3 14h18v6H3v-6z',columns:'M4 3h6v18H4V3zM14 3h6v18h-6V3z',trend:'M3 18l6-7 5 3 7-11M15 3h6v6',network:'M8 6l8 5M8 18l8-5M8 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 19a3 3 0 1 1-6 0 3 3 0 0 1 6 0M22 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0',flask:'M9 2h6M10 2v7L4 19q-1 3 2 3h12q3 0 2-3L14 9V2M7 15h10',info:'M12 10v7M12 6v1M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',clock:'M12 6v6l4 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',refresh:'M3 8a9 9 0 1 1 1 10M3 3v5h5',trophy:'M7 3h10v6a5 5 0 0 1-10 0V3zM7 5H3v3q0 5 5 5M17 5h4v3q0 5-5 5M12 14v7M8 21h8',download:'M12 3v12M7 10l5 5 5-5M3 16v5h18v-5',upload:'M12 15V3M7 8l5-5 5 5M3 16v5h18v-5'};
const ico=(name,cls='')=>`<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${iconPaths[name]||iconPaths.atom}"/></svg>`;
let progress=blankProgress(),storageOK=true;
try{const raw=localStorage.getItem(STORAGE_KEY);if(raw)progress=validateProgress(JSON.parse(raw));}catch{storageOK=false;}
const state={view:'play',category:'memory',mode:'map',scope:'20',count:10,findBy:'name',labels:false,timed:false,selected:8,search:'',filter:'all',heatMode:'map',zoom:0,optionsOpen:false,session:null};
let timer=null,toastTimer=null,installPrompt=null;
const modeInfo=id=>MODES.find(m=>m.id===id);
const modeName=id=>({daily:'Mixed quiz',review:'Review',retry:'Retry',focus:'Element practice'})[id]||modeInfo(id)?.name||'Practice';
const deckMode=id=>['trends','connections','polyatomic'].includes(id);
function save(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(progress));storageOK=true;}catch{storageOK=false;}}
function toast(message){$('#toast').textContent=message;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),3500);}
function button(label,action,cls='',extra=''){return `<button class="button ${cls}" data-action="${action}" ${extra}>${label}</button>`;}
function render(){
 const scrolls=Object.fromEntries([...document.querySelectorAll('.table-scroll')].map(el=>[el.id,el.scrollLeft]));
 document.documentElement.dataset.theme=progress.settings.theme;
 const active=['setup','quiz','result'].includes(state.view)?'play':state.view;
 $('#app').innerHTML=`<header class="app-header"><div class="header-inner"><button class="brand" data-nav="play" aria-label="Element Atlas home"><img src="./logo.svg" alt="Ea"><span>Element Atlas</span></button><nav class="nav" aria-label="Main navigation">${[['play','Play'],['explore','Explore'],['progress','Progress']].map(([id,label])=>`<button data-nav="${id}" class="${active===id?'active':''}" ${active===id?'aria-current="page"':''}>${label}</button>`).join('')}</nav><button class="icon-button" data-action="theme" aria-label="Switch to ${progress.settings.theme==='dark'?'light':'dark'} theme">${ico(progress.settings.theme==='dark'?'sun':'moon')}</button></div></header>
 <main id="main" class="app-main ${state.view==='play'?'home':''}" tabindex="-1">
 ${!storageOK?'<div class="storage-warning" role="status">Progress may not save in this browser. Use Progress → Backup to export it.</div>':''}
 ${state.view==='play'?renderPlay():state.view==='setup'?renderSetup(modeInfo(state.mode)):state.view==='explore'?renderExplore():state.view==='progress'?renderProgress():state.view==='quiz'?renderQuiz():renderResults()}
 </main><footer class="footer"><button data-action="help">Help</button><button data-action="about">Sources & notes</button></footer>`;
 for(const [id,left] of Object.entries(scrolls)){const el=document.getElementById(id);if(el)el.scrollLeft=left;}
 if(state.view==='quiz')updateTimer();
}

// Decorative diagrams give each quiz a recognizable tile without adding instructions.
function modeArt(id){
 const label=(x,y,value,size=14,extra='')=>`<text x="${x}" y="${y}" font-size="${size}" ${extra}>${value}</text>`;
 const element=(x,y,symbol,number,weight='')=>`<rect class="art-paper" x="${x}" y="${y}" width="48" height="59" rx="4"/><path class="art-faint" d="M${x+7} ${y+19}h34"/>${label(x+7,y+14,number,9)}${label(x+24,y+42,symbol,25,'text-anchor="middle" font-weight="600"')}${weight?label(x+24,y+53,weight,8,'text-anchor="middle"'):''}`;
 const miniTable=(variant)=>ELEMENTS.map(e=>{
  const marked=variant==='family'?e.col===18:variant==='period'?e.period===3:variant==='group'?e.col===2:e.z===8;
  return `<rect class="${marked?'art-fill':'art-soft'}" x="${17+(e.col-1)*7}" y="${9+(e.row-1)*6.5}" width="5.5" height="5" rx=".7"/>`;
 }).join('');
 const art={
  map:()=>miniTable('map')+'<path d="M75 17h14M82 10v14"/>',
  name:()=>element(26,12,'Na','11')+'<path d="M84 40h17m-5-5 5 5-5 5"/><rect class="art-paper" x="111" y="25" width="30" height="31" rx="4"/>'+label(126,47,'?',22,'text-anchor="middle"'),
  spot:()=>miniTable('spot')+'<circle cx="118" cy="18" r="8"/><path d="m124 24 6 6"/>',
  family:()=>miniTable('family'),
  match:()=>element(24,9,'Li','3')+element(87,17,'Na','11')+'<path d="M72 36h15M77 32l-5 4 5 4M82 32l5 4-5 4"/>',
  number:()=>element(54,12,'C','6','12.011')+'<circle cx="61" cy="23" r="12"/><path d="M28 23h20M28 19v8"/>',
  mass:()=>'<path d="M79 16v51M63 70h32M45 28h68M46 28l-14 26h28L46 28zM112 28 98 54h28l-14-26z"/><path class="art-soft" d="M32 54q14 14 28 0M98 54q14 14 28 0"/><circle class="art-fill" cx="79" cy="23" r="4"/>'+label(46,48,'C',12,'text-anchor="middle"')+label(112,48,'12',11,'text-anchor="middle"'),
  valence:()=>'<circle class="art-soft" cx="80" cy="42" r="12"/><circle cx="80" cy="42" r="21"/><circle class="art-faint" cx="80" cy="42" r="35"/><circle class="art-fill" cx="59" cy="42" r="3"/><circle class="art-fill" cx="101" cy="42" r="3"/>'+[0,60,120,180,240,300].map(a=>`<circle class="art-fill" cx="${80+35*Math.cos(a*Math.PI/180)}" cy="${42+35*Math.sin(a*Math.PI/180)}" r="3"/>`).join('')+label(80,46,'O',11,'text-anchor="middle"'),
  ion:()=>'<circle class="art-paper" cx="51" cy="42" r="26"/><circle class="art-soft" cx="111" cy="42" r="26"/>'+label(49,49,'Na',22,'text-anchor="middle"')+label(67,30,'+',13)+label(109,49,'Cl',22,'text-anchor="middle"')+label(123,30,'−',13),
  period:()=>miniTable('period')+'<path d="M13 25H4m4-3-4 3 4 3"/>',
  group:()=>miniTable('group')+'<path d="M26 2v6m-3-3 3 3 3-3"/>',
  trends:()=>'<path class="art-faint" d="M30 15v54h99M30 51h99M30 33h99M48 15v54M66 15v54M84 15v54M102 15v54M120 15v54"/><circle class="art-soft" cx="47" cy="53" r="12"/><circle class="art-soft" cx="79" cy="39" r="8"/><circle class="art-fill" cx="111" cy="23" r="4"/><path d="m40 28 71-18m-10-4 10 4-6 9"/>',
  connections:()=>'<path d="M67 14h19v5h-3v20l21 30q3 6-4 6H53q-7 0-4-6l21-30V19h-3z"/><path class="art-soft" d="M58 55h37l9 14q3 6-4 6H53q-7 0-4-6z"/><path d="M88 59h8M91 65h9"/><circle cx="72" cy="55" r="3"/><circle class="art-fill" cx="81" cy="65" r="2"/><path class="art-faint" d="M27 35h20m-5-5 5 5-5 5M112 22h18M121 13v18"/>',
  polyatomic:()=>'<path d="M69 39 48 27M72 48 57 61M85 42h26M85 46h26"/><circle class="art-soft" cx="79" cy="43" r="12"/><circle class="art-paper" cx="38" cy="22" r="13"/><circle class="art-paper" cx="48" cy="68" r="12"/><circle class="art-paper" cx="124" cy="44" r="13"/>'+label(79,47,'N',11,'text-anchor="middle"')+label(38,26,'O',11,'text-anchor="middle"')+label(48,72,'O',11,'text-anchor="middle"')+label(124,48,'O',11,'text-anchor="middle"')+'<path class="art-faint" d="M20 8h-7v71h7M143 8h7v71h-7"/>'+label(152,10,'−',11)
 };
 return `<svg class="tile-art" viewBox="0 0 164 84" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${art[id]()}</svg>`;
}
function renderPlay(){
 return `<h1 class="home-title">What would you like to learn?</h1><div class="mode-groups">${[['memory','Map & memory'],['chemistry','Chemistry'],['connections','Connections']].map(([id,label])=>`<section class="mode-group" data-category="${id}" aria-labelledby="group-${id}"><h2 id="group-${id}"><span class="group-mark" aria-hidden="true"></span>${label}</h2><div class="mode-list">${MODES.filter(m=>m.category===id).map(m=>`<button class="mode-button" data-mode="${m.id}"><span class="tile-illustration">${modeArt(m.id)}</span><span class="tile-caption"><span>${m.name}</span>${ico('arrow')}</span></button>`).join('')}</div></section>`).join('')}</div>`;
}
function chooseMode(id){
 state.mode=id;state.category=modeInfo(id).category;state.optionsOpen=false;state.view='setup';render();window.scrollTo(0,0);$('#setup-title').focus({preventScroll:true});
}

function renderSetup(m){
 const available=makeQuestions(m.id,state.scope,'all').length,match=m.id==='match';
 const count=match?available:state.count==='all'?available:Math.min(+state.count,available);
 const note={mass:'Approximate weights; answers within ±0.5 count.',valence:'Main-group elements only. Helium has 2.',ion:'Common monatomic ions only; include + or −.',group:'Groups 1–18; detached series excluded.',match:'Match up to 6 distinct families.'}[m.id];
 return `<section class="setup"><button class="back-button" data-nav="play">← All quizzes</button><div class="setup-heading" data-category="${m.category}"><span class="setup-icon">${ico(m.icon)}</span><h1 id="setup-title" tabindex="-1">${m.name}</h1></div><div class="setup-card">
 ${deckMode(m.id)?`<p class="deck-note">${available} questions · Fixed question set</p>`:`<label for="scope">Elements</label><select id="scope" data-setting="scope">${SCOPES.map(([v,l])=>`<option value="${v}" ${state.scope===v?'selected':''}>${l}</option>`).join('')}</select>`}
 ${!match?`<div class="field-label" id="length-label">Questions</div><div class="segmented" role="group" aria-labelledby="length-label">${[10,20,'all'].map(v=>`<button data-count="${v}" class="${String(state.count)===String(v)?'active':''}" aria-pressed="${String(state.count)===String(v)}">${v==='all'?'All':v}</button>`).join('')}</div>`:''}
 ${note?`<p class="setup-note">${note}</p>`:''}
 ${!match?`<details class="extra-settings" id="extra-settings" ${state.optionsOpen?'open':''}><summary>More options${state.timed||m.id==='map'&&(state.labels||state.findBy!=='name')?' · changed':''}</summary><label class="toggle-label"><input type="checkbox" data-setting="timed" ${state.timed?'checked':''}>90-second timer</label>${m.id==='map'?`<label for="find-by">Prompt</label><select id="find-by" data-setting="findBy"><option value="name" ${state.findBy==='name'?'selected':''}>Element name</option><option value="symbol" ${state.findBy==='symbol'?'selected':''}>Element symbol</option><option value="number" ${state.findBy==='number'?'selected':''}>Atomic number</option></select><label class="toggle-label"><input type="checkbox" data-setting="labels" ${state.labels?'checked':''}>Show symbols (assisted)</label>`:''}</details>`:''}
 ${button('Start quiz','start','full start',available?'':'disabled')}<p class="round-summary">${available?`${count} ${match?'pairs':'questions'}${state.timed&&!match?' · 90 seconds':''}`:'No questions for this selection. Choose other elements.'}</p></div></section>`;
}

function legendHTML(interactive=false){return `<div class="legend" aria-label="Element categories">${Object.entries(CATEGORIES).map(([id,c])=>interactive?`<button data-filter="${id}" class="${state.filter===id?'active':''}" aria-pressed="${state.filter===id}" style="--cell-color:${c.color}"><i></i>${c.name}</button>`:`<span style="--cell-color:${c.color}"><i></i>${c.name}</span>`).join('')}</div>`;}
function tableHTML({id='table',caption=false,quiz=false,heat=false}={}){
 const s=state.session,q=quiz?s.questions[s.index]:null,map=q?.mode==='map',spot=q?.mode==='spot',showAnswers=!quiz||Boolean(s.feedback),valid=quiz?new Set(pool('map',s.scope).map(e=>e.z)):null;
 const first=ELEMENTS.find(e=>!quiz||(!map&&!spot)||valid.has(e.z))?.z||1;
 return `<div class="table-scroll" id="${id}" tabindex="0" role="region" aria-label="Periodic table. Arrow keys move between tiles; Enter selects."><div class="periodic-table" ${state.zoom?`style="min-width:${state.zoom===1?1080:1320}px"`:''}>
 ${Array.from({length:18},(_,i)=>`<span class="table-number" style="grid-column:${i+2};grid-row:1">${i+1}</span>`).join('')}${Array.from({length:7},(_,i)=>`<span class="table-number" style="grid-column:1;grid-row:${i+2}">${i+1}</span>`).join('')}
 ${caption?'':''}
 <div class="table-placeholder" style="grid-column:4;grid-row:7">57–71<br>↓</div><div class="table-placeholder" style="grid-column:4;grid-row:8">89–103<br>↓</div><span class="table-number" style="grid-column:2/4;grid-row:10">Period 6</span><span class="table-number" style="grid-column:2/4;grid-row:11">Period 7</span>
 ${ELEMENTS.map(e=>{
 const found=matchesSearch(e),dim=quiz?map&&!valid.has(e.z):state.view==='explore'?!found:false;
 const target=spot&&e.z===q.e.z,correct=quiz&&s.feedback&&e.z===q.e.z,wrong=quiz&&map&&s.feedback&&!s.feedback.correct&&Number(s.feedback.input)===e.z;
 const labeled=showAnswers||(map&&s.labels);let label=labeled?`${e.name}, ${e.symbol}, atomic number ${e.z}`:`${e.row>7?`${e.family}, position ${e.col-2}`:`Period ${e.period}, group ${e.group}`}${target?', highlighted':''}`;
 const stat=progress.skills[`${state.heatMode}:${e.z}`];const heatColor=stat?(stat.streak>=3?'#699375':stat.streak>0?'#b6c99d':'#e7b88e'):'#e7e8e0';
 if(heat)label+=stat?`, ${stat.correct} correct of ${stat.attempts} attempts, ${stat.streak>=3?'strong':stat.streak>0?'building':'revisit'}`:', not practiced in this mode';
 return `<button class="cell ${dim?'dim':''} ${target?'target':''} ${!quiz&&state.view==='explore'&&state.selected===e.z?'selected':''} ${correct?'correct':''} ${wrong?'incorrect':''}" style="--cell-color:${heat?heatColor:CATEGORIES[e.cat].color};grid-column:${e.col+1};grid-row:${e.row+1}" data-element="${e.z}" data-row="${e.row}" data-col="${e.col}" aria-label="${label}" ${quiz&&(!map||s.feedback||!valid.has(e.z))?'disabled':''} tabindex="${e.z===(state.view==='explore'?state.selected:first)?0:-1}">${labeled?`${!quiz||showAnswers?`<span class="number">${e.z}</span>`:''}<span class="symbol">${e.symbol}</span>${!quiz?`<span class="cell-name">${e.name}</span>`:''}`:target?'<span class="mark">?</span>':correct?'<span class="mark">✓</span>':''}</button>`;
 }).join('')}</div></div>`;
}
function matchesSearch(e){const search=state.search.trim().toLowerCase();return (state.filter==='all'||e.cat===state.filter)&&(!search||e.name.toLowerCase().includes(search)||e.symbol.toLowerCase()===search||String(e.z)===search||({aluminium:13,caesium:55,sulphur:16})[search]===e.z);}
function renderExplore(){
 const e=BY_Z[state.selected],found=ELEMENTS.filter(matchesSearch);
 return `<h1>Periodic table</h1><div class="search-row"><label class="search-box">${ico('search')}<input id="search" type="search" value="${esc(state.search)}" placeholder="Name, symbol, or number" aria-label="Search elements"></label><select class="field" id="category-filter" aria-label="Filter by category"><option value="all">All categories</option>${Object.entries(CATEGORIES).map(([k,c])=>`<option value="${k}" ${state.filter===k?'selected':''}>${c.name}</option>`).join('')}</select><button class="text-button" data-action="clear-filter">Clear</button></div>
 <div class="atlas-card"><div class="table-toolbar"><span id="search-count" aria-live="polite">${found.length} elements</span><button class="text-button" data-action="zoom">${state.zoom?'Reset zoom':'Larger tiles'}</button></div>${tableHTML({id:'explore-table'})}<p class="table-hint">Select an element. Swipe the table if needed.</p><details class="color-key"><summary>Color key</summary>${legendHTML()}</details><p id="no-search-results" class="filter-empty" ${found.length?'hidden':''}>No matching elements.</p></div>
 <section class="detail-panel" aria-label="${e.name} details"><div class="element-badge" style="--cell-color:${CATEGORIES[e.cat].color}"><span>${e.z}</span><strong>${e.symbol}</strong><small>${e.name}</small></div><div class="element-info"><h2>${e.name}</h2><dl class="facts"><div><dt>${e.isotope?'Isotope mass number':'Atomic weight ≈'}</dt><dd>${e.isotope?'[':''}${e.weight}${e.isotope?']':''}</dd></div><div><dt>Period</dt><dd>${e.period}</dd></div><div><dt>Group</dt><dd>${e.group??'Detached series'}</dd></div><div><dt>Family</dt><dd>${e.family}</dd></div><div><dt>Valence electrons</dt><dd>${e.valence??'Not covered'}</dd></div><div><dt>Common ion charges</dt><dd>${e.ions.length?e.ions.map(signed).join(', '):'Not covered'}</dd></div></dl></div>${button('Practice '+e.symbol,'practice-element','secondary')}</section><p class="table-hint">Weights are approximate. “Not covered” means outside this quiz’s scope.</p>`;
}

function elementNote(e){return e.family;}

function renderProgress(){
 const skills=Object.values(progress.skills),attempts=skills.reduce((a,s)=>a+s.attempts,0),correct=skills.reduce((a,s)=>a+s.correct,0),due=dueQuestions(progress).length;
 return `<section class="progress-page"><h1>Progress</h1><div class="progress-stats"><div><strong>${attempts}</strong><span>Answers</span></div><div><strong>${attempts?Math.round(correct/attempts*100)+'%':'—'}</strong><span>Correct</span></div><div><strong>${due}</strong><span>Due for review</span></div></div><div class="review-action">${button('Review due questions','review','',due?'':'disabled')}${!attempts?'<p>Complete a quiz to start tracking progress.</p>':due?'<p>Up to 20 questions.</p>':'<p>No questions due right now.</p>'}</div>
 <section class="recent"><h2>Recent quizzes</h2>${progress.sessions.length?`<ul class="history">${progress.sessions.slice(-5).reverse().map(s=>`<li><span>${esc(modeName(s.mode))}<small>${esc(new Date(s.date).toLocaleDateString(undefined,{month:'short',day:'numeric'}))}</small></span><strong>${s.correct} / ${s.total}</strong></li>`).join('')}</ul>`:'<p>No completed quizzes yet.</p>'}</section>
 <details class="data-tools"><summary>Backup & reset</summary><p>Progress is saved in this browser. Export a backup to move it to another device.</p><div class="settings-actions">${button('Export','export','secondary')}${button('Import','import','secondary')}${button('Reset progress','reset','secondary')}</div><input type="file" id="import-file" accept="application/json,.json" hidden></details></section>`;
}

function startSession(questions,{mode=state.mode,daily=false,review=false,scope=state.scope,timed=state.timed,labels=state.labels,findBy=state.findBy}={}){
 if(!questions.length){toast('No questions available. Choose a different set.');return;}
 clearInterval(timer);
 state.session={questions,index:0,answers:[],feedback:null,assisted:false,mode,daily,review,scope,labels:mode==='map'&&labels,findBy,start:Date.now(),deadline:timed&&!daily&&!review&&mode!=='match'?Date.now()+90000:null,match:mode==='match'?{selected:null,done:[],recorded:[],families:shuffle(questions.map(q=>q.answer)),message:'Choose an element, then its family.'}:null,initialXP:progress.xp};
 state.view='quiz';render();window.scrollTo(0,0);focusQuestion();
 if(state.session.deadline)timer=setInterval(()=>{if(state.view!=='quiz'){clearInterval(timer);return;}if(Date.now()>=state.session.deadline){if($('#dialog').open)$('#dialog').close();finishSession(true);}else updateTimer();},250);
}
function focusQuestion(){setTimeout(()=>{const input=$('#answer');if(input&&window.innerWidth>=700)input.focus({preventScroll:true});else{const heading=$('#question-title');if(heading)heading.focus({preventScroll:true});}},30);}
function updateTimer(){const s=state.session,el=$('#timer');if(el&&s?.deadline){const n=Math.max(0,Math.ceil((s.deadline-Date.now())/1000));el.textContent=`${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`;}}
function renderQuiz(){
 const s=state.session;if(s.match)return renderMatch();
 const q=s.questions[s.index],fb=s.feedback,assisted=s.assisted||s.labels;
 const prompt=q.mode==='map'?s.findBy==='symbol'?`Find ${q.e.symbol}`:s.findBy==='number'?`Find atomic number ${q.e.z}`:q.prompt:q.prompt;
 return `<div class="quiz-heading"><h2>${modeName(s.mode)}</h2><div class="quiz-chips"><span class="badge">${s.answers.filter(a=>a.correct).length} correct</span>${s.deadline?'<span class="badge" aria-label="Time remaining">'+ico('clock')+' <span id="timer"></span></span>':''}<button class="text-button" data-action="end">End round</button></div></div><div class="progress-track" role="progressbar" aria-label="Questions answered" aria-valuemin="0" aria-valuemax="${s.questions.length}" aria-valuenow="${s.answers.length}"><div class="progress-fill" style="width:${s.answers.length/s.questions.length*100}%"></div></div>
 <section class="quiz-card"><div class="question-content"><div class="question-meta"><span>Question ${s.index+1} of ${s.questions.length}</span><span>${q.mode!==s.mode?modeName(q.mode):''}${assisted?(q.mode!==s.mode?' · ':'')+'Assisted':''}</span></div><h1 id="question-title" tabindex="-1">${esc(prompt)}</h1><p class="instruction">${q.mode==='map'?'Select its position on the table.':q.mode==='spot'?'Name the highlighted element.':q.options?'Choose an answer.':q.mode==='mass'?'Whole-number or decimal approximation; tolerance ±0.5.':q.mode==='ion'?'Include a sign, for example +2 or 2+.':q.mode==='name'?'Type the element name.':'Type your answer.'}</p>
 ${q.mode==='name'?`<div class="big-symbol">${q.e.symbol}</div>`:''}
 ${q.options?`<div class="options">${q.options.map((o,i)=>`<button class="option ${fb&&o===q.answer?'correct':''} ${fb&&!fb.correct&&o===fb.input?'wrong':''}" data-option="${i}" ${fb?'disabled':''}><span class="key">${i+1}</span><span>${esc(o)}</span>${fb&&o===q.answer?ico('check'):''}</button>`).join('')}</div>`:q.mode!=='map'?`<form class="answer-form" id="answer-form"><label class="sr-only" for="answer">Your answer</label><input id="answer" autocomplete="off" autocapitalize="none" spellcheck="false" inputmode="${['number','mass','period','group','valence'].includes(q.mode)?'decimal':'text'}" placeholder="${['name','spot'].includes(q.mode)?'Element name'+(q.mode==='spot'?' or symbol':''):q.mode==='ion'?'+2, 2+, −1…':'Your answer…'}" value="${fb?esc(fb.input):''}" ${fb?'disabled':''}><button class="button" ${fb?'disabled':''}>Check ${ico('arrow')}</button></form>`:''}
 ${!fb?`<div class="quiz-tools"><button data-action="hint" ${s.assisted?'disabled':''}>${ico('info')}Hint</button><span class="muted">·</span><button data-action="skip">Skip</button></div>`:''}${s.assisted&&!fb?`<div class="hint-box">${esc(q.hint)} <small>Assisted answer.</small></div>`:''}</div>

 ${fb?`<div class="feedback ${fb.correct?'':'wrong'}" role="status">${ico(fb.correct?'check':'refresh')}<div><h3>${fb.correct?fb.assisted?'Correct · assisted':'Correct':fb.skipped?'Skipped':'Incorrect'}</h3>${!fb.correct?`<p><strong>Answer: ${esc(q.mode==='map'?q.e.name+' ('+q.e.symbol+')':q.answer)}</strong></p>`:''}<p>${esc(q.explanation)}</p></div>${button(`${s.index+1===s.questions.length?'Results':'Next'} ${ico('arrow')}`,'next','','id="next-button"')}</div>`:''}
 ${q.mode==='map'||q.mode==='spot'?`<div class="quiz-table">${tableHTML({id:'quiz-table',quiz:true})}<p class="table-hint">Swipe the table if needed.</p></div>`:''}</section>`;
}
function submitAnswer(input,{skipped=false}={}){
 const s=state.session;if(!s||s.feedback||state.view!=='quiz'||s.match)return;
 if(s.deadline&&Date.now()>=s.deadline){finishSession(true);return;}
 if(!skipped&&String(input).trim()===''){toast('Enter an answer, or choose “Skip”.');return;}
 const q=s.questions[s.index],correct=!skipped&&judge(q,input),assisted=s.assisted||s.labels;
 s.feedback={correct,input,assisted,skipped};s.answers.push({key:q.key,correct,input,assisted,skipped});recordAnswer(progress,q,correct,assisted);save();render();$('#next-button')?.focus();
}
function nextQuestion(){const s=state.session;if(!s.feedback)return;if(++s.index>=s.questions.length){finishSession();return;}s.feedback=null;s.assisted=false;render();focusQuestion();}
function renderMatch(){
 const s=state.session,m=s.match,all=m.done.length===s.questions.length;
 return `<div class="quiz-heading"><h2>Family match</h2><div class="quiz-chips"><span class="badge">${m.done.length} / ${s.questions.length} paired</span><button class="text-button" data-action="end">End round</button></div></div><section class="quiz-card"><div class="question-content"><h1 tabindex="-1" id="question-title">Match each element to its family.</h1><p class="instruction">Select an element, then a family. First attempts are scored.</p><div class="match-grid"><div class="match-column">${s.questions.map(q=>`<button data-match-element="${q.id}" class="${m.selected===q.id?'selected':''} ${m.done.includes(q.id)?'done':''}" aria-pressed="${m.selected===q.id}" ${m.done.includes(q.id)?'disabled':''}><b>${q.e.symbol}</b>${q.e.name}${m.done.includes(q.id)?' ✓':''}</button>`).join('')}</div><div class="match-column">${m.families.map((f,i)=>{const done=s.questions.some(q=>q.answer===f&&m.done.includes(q.id));return `<button data-match-family="${i}" class="${done?'done':''}" ${done?'disabled':''}>${esc(f)}${done?' ✓':''}</button>`;}).join('')}</div></div><p class="match-status" role="status">${esc(m.message)}</p>${all?button(`Results ${ico('arrow')}`,'finish'):''}</div></section>`;
}
function matchFamily(index){
 const s=state.session,m=s.match;if(!m.selected){toast('Choose an element first.');return;}
 const q=s.questions.find(q=>q.id===m.selected),correct=q.answer===m.families[index];
 if(!m.recorded.includes(q.id)){s.answers.push({key:q.key,correct,input:m.families[index],assisted:false});recordAnswer(progress,q,correct,false);m.recorded.push(q.id);save();}
 if(correct){m.done.push(q.id);m.selected=null;m.message=m.done.length===s.questions.length?'All pairs matched.':`${q.e.name} → ${q.answer}. Choose your next element.`;}
 else m.message=`${q.e.name} does not belong to the ${m.families[index].toLowerCase()}. Try again.`;
 render();
}
function finishSession(early=false){
 clearInterval(timer);const s=state.session;if(!s||state.view==='result')return;
 s.early=early;s.elapsed=Math.max(1,Math.round((Date.now()-s.start)/1000));
 if(s.answers.length){progress.sessions.push({date:new Date().toISOString(),mode:s.mode,total:s.answers.length,correct:s.answers.filter(a=>a.correct).length});progress.sessions=progress.sessions.slice(-50);}
 if(s.daily&&!early&&s.answers.length===s.questions.length&&progress.daily[s.dailyDate??dayKey()]===undefined)progress.daily[s.dailyDate??dayKey()]=s.answers.filter(a=>a.correct).length;
 save();state.view='result';render();window.scrollTo(0,0);$('#results-title')?.focus({preventScroll:true});
}
function reviewQuestion(key){const [mode,id]=key.split(':');const q=questionFor(mode==='match'?'family':mode,Number.isNaN(Number(id))?id:Number(id));if(q&&mode==='match')q.key=key;return q;}
function renderResults(){
 const s=state.session,n=s.answers.length,right=s.answers.filter(a=>a.correct).length,miss=s.answers.filter(a=>!a.correct||a.assisted);
 return `<section class="results"><h1 id="results-title" tabindex="-1">${s.early?'Quiz ended':'Results'}</h1><p class="result-mode">${modeName(s.mode)}</p><div class="score">${right}<span> / ${n}</span></div><p>${n?Math.round(right/n*100)+'% correct':'No answers recorded.'}${s.early?` · ${s.questions.length-n} unanswered`:''}</p>${s.answers.some(a=>a.assisted)?'<p class="result-note">Includes assisted answers.</p>':''}<div class="result-actions">${button('Play again','again')}${miss.length?button(`Retry ${miss.length}`,'retry','secondary'):''}</div><button class="text-button" data-nav="play">Choose another quiz</button>
 ${miss.length?`<details class="answer-review"><summary>Review answers (${miss.length})</summary><div class="review-list">${miss.map(a=>{const q=reviewQuestion(a.key);return `<article class="review-item"><small>${a.assisted?'Assisted':a.skipped?'Skipped':'Incorrect'}</small><h3>${esc(q.prompt)}</h3><p><strong>${esc(q.mode==='map'?q.e.name:q.answer)}</strong> · ${esc(q.explanation)}</p></article>`;}).join('')}</div></details>`:''}</section>`;
}

function navigate(view){if(state.view==='quiz')finishSession(true);state.view=view;render();window.scrollTo(0,0);$('#main').focus({preventScroll:true});}

function showDialog(html){const d=$('#dialog');d.innerHTML=html;if(!d.open)d.showModal();}
function confirmDialog(title,message,label,callback){showDialog(`<h2 id="dialog-title">${title}</h2><p>${message}</p><div class="dialog-actions">${button('Cancel','close-dialog','secondary')}${button(label,'confirm-dialog')}</div>`);$('#dialog [data-action="confirm-dialog"]').onclick=()=>{$('#dialog').close();callback();};}
function about(){showDialog(`<h2 id="dialog-title">Sources & notes</h2><ul><li><a href="https://iupac.org/what-we-do/periodic-table-of-elements/" target="_blank" rel="noopener">IUPAC</a> · names and periodic-table structure</li><li><a href="https://ciaaw.org/abridged-atomic-weights.htm" target="_blank" rel="noopener">CIAAW</a> · atomic weights</li><li><a href="https://openstax.org/books/chemistry-2e/pages/2-3-atomic-structure-and-symbolism" target="_blank" rel="noopener">OpenStax Chemistry 2e</a> · chemistry concepts</li></ul><details><summary>Quiz conventions</summary><p>Weights are approximate. Bracketed values are selected isotope mass numbers, excluded from weight quizzes. Use your instructor’s values for coursework.</p><p>Valence practice covers main-group atoms through radon. Ion charges are selected common monatomic examples, not every oxidation state. Group 3 within the detached series is not tested.</p><p>Category boundaries follow a classroom convention. Many superheavy-element properties remain uncertain. Ea is the app logo, not a chemical symbol.</p></details><p>Progress stays in this browser. No account or cloud sync.</p><div class="dialog-actions">${button('Close','close-dialog')}</div>`);}

function help(){showDialog(`<h2 id="dialog-title">Help</h2><p>Choose a quiz, select your elements, then press Start.</p><ul><li><kbd>Enter</kbd> checks an answer or continues.</li><li><kbd>1</kbd>–<kbd>4</kbd> choose an option.</li><li>Use arrow keys on the table; Enter selects.</li><li>Hints count as assisted answers.</li><li>The optional timer includes feedback time.</li></ul><div class="dialog-actions">${button('Install app','install','secondary')}${button('Close','close-dialog')}</div>`);}

function exportProgress(){const blob=new Blob([JSON.stringify(progress,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`element-atlas-progress-${dayKey()}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);toast('Progress backup downloaded.');}
async function importProgress(file){if(!file)return;if(file.size>2000000){toast('This backup is too large.');return;}try{const restored=validateProgress(JSON.parse(await file.text()));confirmDialog('Replace this browser’s progress?','The imported backup will replace your current study history. Export the current history first if you want to keep it.','Import backup',()=>{progress=restored;save();render();toast('Progress restored.');});}catch(error){toast(error.message||'This file is not a valid progress backup.');}}
function updateSearch(){const selected=ELEMENTS.filter(matchesSearch);for(const b of document.querySelectorAll('#explore-table [data-element]'))b.classList.toggle('dim',!matchesSearch(BY_Z[b.dataset.element]));$('#search-count').textContent=`${selected.length} elements`;$('#no-search-results').hidden=selected.length>0;}
const actions={
 start:()=>startSession(makeQuestions(state.mode,state.scope,state.count)),
 daily:()=>{startSession(dailyQuestions(),{mode:'daily',daily:true,scope:'36',timed:false,labels:false,findBy:'name'});state.session.dailyDate=dayKey();},
 review:()=>startSession(dueQuestions(progress).slice(0,20),{mode:'review',review:true,scope:'all',labels:false,timed:false,findBy:'name'}),
 retry:()=>{const questions=state.session.answers.filter(a=>!a.correct||a.assisted).map(a=>reviewQuestion(a.key));startSession(shuffle(questions),{mode:'retry',review:true,scope:'all',labels:false,timed:false,findBy:'name'});},
 next:nextQuestion,skip:()=>submitAnswer('',{skipped:true}),
 hint:()=>{state.session.assisted=true;render();focusQuestion();},
 end:()=>finishSession(true),
 finish:()=>finishSession(),
 again:()=>{const s=state.session;if(modeInfo(s.mode)){startSession(makeQuestions(s.mode,s.scope,state.count),{mode:s.mode,scope:s.scope,timed:Boolean(s.deadline),labels:s.labels,findBy:s.findBy});}else startSession(shuffle(s.questions.map(q=>reviewQuestion(q.key))),{mode:s.mode,scope:'all',timed:false,labels:false,findBy:'name'});},
 'back-play':()=>navigate('play'),'see-progress':()=>navigate('progress'),
 theme:()=>{progress.settings.theme=progress.settings.theme==='dark'?'light':'dark';save();render();},
 about,help,
 'close-dialog':()=>$('#dialog').close(),
 'first20':()=>{state.mode='map';state.category='memory';state.scope='20';state.count=10;state.timed=false;navigate('play');},
 'clear-filter':()=>{state.search='';state.filter='all';render();},
 zoom:()=>{state.zoom=state.zoom?0:1;render();},
 'practice-element':()=>{const qs=['map','name','spot','number','mass','valence','ion','period','group','family'].map(m=>questionFor(m,state.selected)).filter(Boolean);startSession(shuffle(qs),{mode:'focus',scope:'all',timed:false,labels:false,findBy:'name'});},
 export:exportProgress,import:()=>$('#import-file').click(),
 reset:()=>confirmDialog('Reset all practice history?','This clears your study history from this browser. Export a backup first to keep a copy.','Reset progress',()=>{const theme=progress.settings.theme;progress=blankProgress();progress.settings.theme=theme;save();render();toast('Progress reset.');}),
 install:async()=>{if(installPrompt){await installPrompt.prompt();installPrompt=null;}else showDialog(`<h2 id="dialog-title">Install app</h2><p>On iPhone or iPad, open this site in Safari, tap Share, then Add to Home Screen. In Chrome or Edge, look for the install option in the browser menu or address bar.</p><p>Visit once while online so the app can save its files for offline use. If it is already installed, launch it from your home screen.</p><div class="dialog-actions">${button('Got it','close-dialog')}</div>`);}
};
document.addEventListener('click',ev=>{
 const b=ev.target.closest('button');if(!b||b.disabled)return;
 if(b.dataset.nav){navigate(b.dataset.nav);return;}
 if(b.dataset.action){actions[b.dataset.action]?.();return;}
 if(b.dataset.category){state.category=b.dataset.category;state.mode=MODES.find(m=>m.category===state.category).id;render();return;}
 if(b.dataset.mode){chooseMode(b.dataset.mode);return;}
 if(b.dataset.count){state.count=b.dataset.count;render();return;}
 if(b.dataset.filter){state.filter=state.filter===b.dataset.filter?'all':b.dataset.filter;render();return;}
 if(b.dataset.option!==undefined){submitAnswer(state.session.questions[state.session.index].options[+b.dataset.option]);return;}
 if(b.dataset.element){const z=+b.dataset.element;if(state.view==='quiz'){if(state.session.questions[state.session.index].mode==='map')submitAnswer(z);}else{state.selected=z;if(state.view!=='explore'){state.search='';state.filter='all';state.view='explore';}render();if(window.innerWidth<700)document.querySelector('.detail-panel').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'nearest'});}return;}
 if(b.dataset.matchElement){state.session.match.selected=+b.dataset.matchElement;render();return;}
 if(b.dataset.matchFamily!==undefined){matchFamily(+b.dataset.matchFamily);return;}
});
document.addEventListener('change',ev=>{
 const el=ev.target;if(el.dataset.setting){if(['timed','labels','findBy'].includes(el.dataset.setting))state.optionsOpen=true;state[el.dataset.setting]=el.type==='checkbox'?el.checked:el.value;render();}
 else if(el.id==='category-filter'){state.filter=el.value;render();}
 else if(el.id==='heat-mode'){state.heatMode=el.value;render();}
 else if(el.id==='import-file'){importProgress(el.files[0]);el.value='';}
});
document.addEventListener('toggle',ev=>{if(ev.target.id==='extra-settings')state.optionsOpen=ev.target.open;},true);
document.addEventListener('input',ev=>{if(ev.target.id==='search'){state.search=ev.target.value;updateSearch();}});
document.addEventListener('submit',ev=>{if(ev.target.id==='answer-form'){ev.preventDefault();submitAnswer($('#answer').value);}});
document.addEventListener('keydown',ev=>{
 if($('#dialog').open)return;
 const tile=ev.target.closest('[data-element]');
 if(tile&&['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(ev.key)){
 ev.preventDefault();const all=[...tile.closest('.periodic-table').querySelectorAll('button:not(:disabled)')],r=+tile.dataset.row,c=+tile.dataset.col,h=ev.key==='ArrowLeft'||ev.key==='ArrowRight',dir=ev.key==='ArrowLeft'||ev.key==='ArrowUp'?-1:1;
 const candidates=all.filter(b=>h?(+b.dataset.col-c)*dir>0:(+b.dataset.row-r)*dir>0).sort((a,b)=>{const score=x=>h?Math.abs(+x.dataset.row-r)*100+Math.abs(+x.dataset.col-c):Math.abs(+x.dataset.row-r)*100+Math.abs(+x.dataset.col-c);return score(a)-score(b);});
 if(candidates[0]){all.forEach(b=>b.tabIndex=-1);candidates[0].tabIndex=0;candidates[0].focus();}return;
 }
 if(state.view==='quiz'&&!state.session.match&&!['INPUT','SELECT','TEXTAREA'].includes(ev.target.tagName)){
 const s=state.session,q=s.questions[s.index];if(!s.feedback&&q.options&&/^[1-4]$/.test(ev.key)){const i=+ev.key-1;if(q.options[i]){ev.preventDefault();submitAnswer(q.options[i]);}}
 else if(s.feedback&&ev.key==='Enter'&&ev.target.id!=='next-button'&&ev.target.tagName!=='BUTTON'){ev.preventDefault();nextQuestion();}
 }
});
window.addEventListener('beforeinstallprompt',ev=>{ev.preventDefault();installPrompt=ev;});
window.addEventListener('storage',ev=>{if(ev.key===STORAGE_KEY&&state.view!=='quiz'){try{progress=ev.newValue?validateProgress(JSON.parse(ev.newValue)):blankProgress();render();}catch{toast('Could not read progress from another tab.');}}});
render();
if('serviceWorker' in navigator&&location.protocol!=='file:')navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).catch(()=>toast('Offline setup could not finish. You can still practice online.'));
