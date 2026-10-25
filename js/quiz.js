const app = document.getElementById('app');
const P = new URLSearchParams(location.search);
const c = course(P.get('c')), setId = P.get('set');
const L = ['A','B','C','D','E'];
if (!c || !c.live || (setId !== 'all' && !c.sets[setId])) { app.innerHTML = '<p>Quiz not found. <a href="index.html">Back</a></p>'; throw 0; }
const isAll = setId === 'all', grp = P.get('grp');
const setName = n => c.sets[n].label || `${c.unit} ${n}`;
const title = isAll ? (grp ? 'Combined quiz · ' + grp : 'Combined quiz · all ' + c.unit.toLowerCase() + 's') : setName(setId) + (c.sets[setId].title ? ' · ' + c.sets[setId].title : '');
const tx = el => { if (c.math !== false) typeset(el); };
let pool = [];
Object.keys(c.sets).map(Number).sort((a,b)=>a-b).forEach(n => {
  if ((isAll && ((c.sets[n].group || '') === (grp || '') || (!grp && c.sets[n].inCombined))) || String(n) === setId) c.sets[n].questions.forEach((q,i) => pool.push({...q, tag:`${c.sets[n].tag||c.prefix+n} Q${i+1}`, _extra: !!c.sets[n].inCombined}));
});
let Q = [], ans = [], sub = [], cur = 0, mode = 'practice';
const shuffle = a => { a = a.slice(); for (let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const setNote = (!isAll && c.sets[setId].note) ? `<div class="notice" style="margin:0 0 14px">${c.sets[setId].note}</div>` : '';
/* Wildlife Ecology: re-attempts shuffle the questions and the options. Options that depend on position ("a or b", "All of the above", "None of these"...) keep their order. */
const posDependent = q => q.o.some(o => /\b(all|none|neither|both)\b[^.]{0,20}\b(these|above)\b|\([a-e]\)|^\s*[a-e]\s+or\s+[a-e]\s*$/i.test(o.replace(/<[^>]+>/g, ' ')));
const shuffleOptions = q => {
  if (posDependent(q)) return q;
  const perm = shuffle(q.o.map((_, i) => i)), k = Array.isArray(q.a) ? q.a : [q.a];
  const a = k.map(x => perm.indexOf(x));
  return {...q, o: perm.map(i => q.o[i]), a: Array.isArray(q.a) ? a.sort((x, y) => x - y) : a[0]};
};
const attemptKey = 'att:' + c.id + ':' + setId + (grp ? '-' + grp : '');
const crumb = `<div class="crumb"><a href="index.html">Courses</a> / <a href="course.html?c=${c.id}">${c.short}</a> / ${isAll?(grp?'Combined '+grp:'Combined'):setName(setId)}</div>`;
const fig = q => q.img ? `<figure class="fig"><img src="${q.img}" alt="${(q.cap||'Figure').replace(/"/g,'')}">${q.cap?`<figcaption>${q.cap}</figcaption>`:''}</figure>` : '';
/* answers: q.a is an index, or an array of indices for multiple-answer (MSQ) questions */
const key = q => (Array.isArray(q.a) ? q.a : [q.a]).slice().sort((x,y)=>x-y);
const multi = q => !!q.m || Array.isArray(q.a);
const picked = i => ans[i] == null ? [] : (Array.isArray(ans[i]) ? ans[i] : [ans[i]]);
const has = i => picked(i).length > 0;
const correct = i => { const p = picked(i).slice().sort((x,y)=>x-y), k = key(Q[i]); return p.length === k.length && p.every((v,j)=>v===k[j]); };
const revealed = i => mode === 'practice' && has(i) && (!multi(Q[i]) || sub[i]);
const letters = q => key(q).map(i=>L[i]).join(', ');
const answerText = q => key(q).map(i=>q.o[i]).join(' &nbsp;|&nbsp; ');
const sol = q => c.brief
  ? `<div class="sol">${q.s[0]?`<h4>Explanation</h4><div>${q.s[0]}</div>`:''}${q.r?`<div class="ref">${q.r}</div>`:''}<div class="fin" style="margin-top:12px">Correct answer: ${letters(q)}. ${answerText(q)}</div></div>`
  : `<div class="sol"><h4>Step-by-step solution</h4><ol>${q.s.map((s,i)=>`<li><span class="n">${i+1}</span><div class="t"><small>Step ${i+1}</small>${s}</div></li>`).join('')}</ol><div class="fin">Correct answer: ${letters(q)}. ${answerText(q)}</div></div>`;

function setup() {
  let m = 'practice';
  const extraN = pool.filter(x => x._extra).length;
  const active = () => { const e = document.getElementById('ex'); return e && !e.checked ? pool.filter(x => !x._extra) : pool; };
  app.innerHTML = `${crumb}<div class="setup"><div class="qcard"><span class="qtag" id="cnt">${pool.length} questions</span><h1 style="margin-top:12px">${title}</h1>
  <p style="color:var(--mut);margin:6px 0 14px">Choose how you want to attempt this quiz.</p>${setNote}
  <div class="modes"><button class="mode on" data-m="practice"><b>Practice</b><span>Instant feedback with the solution after each answer.</span></button><button class="mode" data-m="test"><b>Test</b><span>Answer everything, submit, then review all solutions.</span></button></div>
  ${isAll && extraN ? `<div class="field"><label class="chk"><input type="checkbox" id="ex" checked> Include the ${extraN} extra practice questions</label><div style="color:var(--mut);font-size:13.5px;margin-top:4px">Untick to practise only the ${pool.length - extraN} weekly assignment questions.</div></div>` : ''}
  ${isAll ? `<div class="field"><label for="n" id="nlab">Number of questions (max ${pool.length})</label><input type="number" id="n" min="1" max="${pool.length}" value="${pool.length}"></div><div class="field"><label class="chk"><input type="checkbox" id="sh" checked> Shuffle questions</label></div>` : ''}
  <button class="btn" id="go">Start quiz &rarr;</button></div></div>`;
  app.querySelectorAll('.mode').forEach(b => b.onclick = () => { m = b.dataset.m; app.querySelectorAll('.mode').forEach(x => x.classList.toggle('on', x === b)); });
  const ex = document.getElementById('ex');
  if (ex) ex.onchange = () => { const k = active().length, n = document.getElementById('n');
    n.max = k; n.value = k; document.getElementById('nlab').textContent = `Number of questions (max ${k})`; document.getElementById('cnt').textContent = `${k} questions`; };
  document.getElementById('go').onclick = () => {
    mode = m; const base = active(); let q = base;
    if (isAll) { if (document.getElementById('sh').checked) q = shuffle(base); q = q.slice(0, Math.max(1, Math.min(base.length, +document.getElementById('n').value || base.length))); }
    const done = ls.get(attemptKey) || 0; ls.set(attemptKey, done + 1);
    if (c.shuffleRetry && done > 0) { q = shuffle(q).map(shuffleOptions); }
    Q = q; ans = Q.map(() => null); sub = Q.map(() => false); cur = 0; show();
  };
  window.scrollTo(0,0);
}

function dotCls(i) {
  let k = 'dot';
  if (i === cur) k += ' cur';
  if (has(i)) k += mode === 'practice' ? (revealed(i) ? (correct(i) ? ' ok' : ' no') : ' done') : ' done';
  return k;
}
function show() {
  const q = Q[cur], rev = revealed(cur), mq = multi(q), p = picked(cur), k = key(q);
  const answered = Q.filter((_,i)=>has(i)).length;
  app.innerHTML = `${crumb}<div class="qhead"><h1>${title}</h1><div class="qinfo"><span>Question ${cur+1} of ${Q.length}</span><span>${answered} answered &middot; ${mode==='test'?'Test':'Practice'} mode</span></div>
  <div class="bar"><i style="width:${(cur+1)/Q.length*100}%"></i></div><div class="dots">${Q.map((_,i)=>`<button class="${dotCls(i)}" data-i="${i}">${i+1}</button>`).join('')}</div></div>
  ${setNote}<div class="qcard"><span class="qtag">${q.tag}</span>${mq?'<span class="qtag msq">Select all that apply</span>':''}${fig(q)}<div class="qtext">${q.q}</div>
  ${q.o.map((o,i)=>`<button class="opt ${p.includes(i)&&!rev?'sel':''} ${rev&&k.includes(i)?'right':''} ${rev&&p.includes(i)&&!k.includes(i)?'wrong':''}" data-o="${i}" ${rev?'disabled':''}><span class="l">${L[i]}</span><span>${o}</span></button>`).join('')}
  ${mq && mode==='practice' && !rev ? `<button class="btn" id="chk" style="margin-top:6px" ${p.length?'':'disabled'}>Check answer</button>` : ''}
  ${rev ? `<div class="verdict ${correct(cur)?'ok':'no'}">${correct(cur)?'&#10003; Correct! Well done.':'&#10007; Not quite. See the solution below.'}</div>${sol(q)}` : ''}</div>
  <div class="nav2"><button class="btn ghost" id="prev" ${cur===0?'disabled':''}>&larr; Previous</button>${cur<Q.length-1?'<button class="btn" id="next">Next &rarr;</button>':''}
  <span class="sp"></span><button class="btn ghost" id="fin">${mode==='test'?'Submit test':'Finish'}</button></div>`;
  app.querySelectorAll('.opt').forEach(b => b.onclick = () => {
    const o = +b.dataset.o;
    if (mq) { const s = new Set(p); s.has(o) ? s.delete(o) : s.add(o); ans[cur] = [...s].sort((x,y)=>x-y); } else ans[cur] = o;
    show();
  });
  const chk = document.getElementById('chk'); if (chk) chk.onclick = () => { sub[cur] = true; show(); };
  app.querySelectorAll('.dot').forEach(b => b.onclick = () => { cur = +b.dataset.i; show(); });
  const pv = document.getElementById('prev'); if (pv) pv.onclick = () => { cur--; show(); };
  const nx = document.getElementById('next'); if (nx) nx.onclick = () => { cur++; show(); };
  document.getElementById('fin').onclick = () => {
    const un = Q.filter((_,i)=>!has(i)).length;
    if (un && !confirm(`${un} question(s) unanswered. Finish anyway?`)) return;
    results();
  };
  tx(app);
}

function results() {
  const score = Q.reduce((s,_,i)=>s+(correct(i)?1:0),0), skipped = Q.filter((_,i)=>!has(i)).length, pct = Math.round(score/Q.length*100);
  const bk = 'best:'+c.id+':'+setId+(grp?'-'+grp:''), b = ls.get(bk);
  if (!b || score/Q.length >= b.score/b.total) ls.set(bk,{score,total:Q.length});
  const msg = pct>=80?'Excellent work!':pct>=50?'Good effort. Review the solutions below.':'Keep practising. The solutions below will help.';
  app.innerHTML = `${crumb}<div class="res"><div class="ring" style="--p:${pct}"><div><span>${pct}%<small>${score}/${Q.length}</small></span></div></div>
  <div><h1>${msg}</h1><p class="sub">${title}<br>${score} correct &middot; ${Q.length-score-skipped} wrong &middot; ${skipped} skipped</p>
  <div class="row"><button class="btn" id="again">Try again</button><a class="btn ghost" href="course.html?c=${c.id}">Back to course</a></div></div></div>
  <h2 class="sec">Review with solutions</h2>` +
  Q.map((q,i)=>{ const st = !has(i)?'sk':correct(i)?'ok':'no', p = picked(i), k = key(q);
  return `<details class="rev"><summary><span class="st ${st}">${st==='ok'?'&#10003;':st==='no'?'&#10007;':'&ndash;'}</span><span class="q"><small style="color:var(--mut)">${q.tag}</small> ${q.q}</span></summary><div class="in">${fig(q)}<div class="qtext">${q.q}</div>
  ${q.o.map((o,j)=>`<div class="opt ${k.includes(j)?'right':''} ${p.includes(j)&&!k.includes(j)?'wrong':''}" style="cursor:default"><span class="l">${L[j]}</span><span>${o}</span></div>`).join('')}${sol(q)}</div></details>`; }).join('');
  document.getElementById('again').onclick = setup;
  tx(app); window.scrollTo(0,0);
}
setup();
