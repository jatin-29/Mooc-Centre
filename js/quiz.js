const app = document.getElementById('app');
const P = new URLSearchParams(location.search);
const c = course(P.get('c')), setId = P.get('set');
const L = ['A','B','C','D'];
if (!c || !c.live || (setId !== 'all' && !c.sets[setId])) { app.innerHTML = '<p>Quiz not found. <a href="index.html">Back</a></p>'; throw 0; }
const isAll = setId === 'all';
const title = isAll ? 'Combined quiz · all assignments' : `Assignment ${setId} · ${c.sets[setId].title}`;
let pool = [];
Object.keys(c.sets).map(Number).sort((a,b)=>a-b).forEach(n => {
  if (isAll || String(n) === setId) c.sets[n].questions.forEach((q,i) => pool.push({...q, tag:`A${n} Q${i+1}`}));
});
let Q = [], ans = [], cur = 0, mode = 'practice';
const shuffle = a => { a = a.slice(); for (let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const doubt = q => `https://github.com/${REPO}/issues/new?title=${encodeURIComponent('Doubt: '+c.short+' '+q.tag)}&body=${encodeURIComponent('Course: '+c.title+'\nQuestion: '+q.tag+'\n\nMy doubt:\n')}`;
const crumb = `<div class="crumb"><a href="index.html">Courses</a> / <a href="course.html?c=${c.id}">${c.short}</a> / ${isAll?'Combined':'Assignment '+setId}</div>`;
const fig = q => q.img ? `<figure class="fig"><img src="${q.img}" alt="${(q.cap||'Figure').replace(/"/g,'')}">${q.cap?`<figcaption>${q.cap}</figcaption>`:''}</figure>` : '';
const sol = q => `<div class="sol"><h4>Step-by-step solution</h4><ol>${q.s.map((s,i)=>`<li><span class="n">${i+1}</span><div class="t"><small>Step ${i+1}</small>${s}</div></li>`).join('')}</ol><div class="fin">Correct answer: ${L[q.a]}. ${q.o[q.a]}</div></div>`;

function setup() {
  let m = 'practice';
  app.innerHTML = `${crumb}<div class="setup"><div class="qcard"><span class="qtag">${isAll?pool.length+' questions':'10 questions'}</span><h1 style="margin-top:12px">${title}</h1>
  <p style="color:var(--mut);margin:6px 0 0">Choose how you want to attempt this quiz.</p>
  <div class="modes"><button class="mode on" data-m="practice"><b>Practice</b><span>Instant feedback with a step-by-step solution after each answer.</span></button><button class="mode" data-m="test"><b>Test</b><span>Answer everything, submit, then review all solutions.</span></button></div>
  ${isAll ? `<div class="field"><label for="n">Number of questions (max ${pool.length})</label><input type="number" id="n" min="1" max="${pool.length}" value="${pool.length}"></div><div class="field"><label class="chk"><input type="checkbox" id="sh" checked> Shuffle questions</label></div>` : ''}
  <button class="btn" id="go">Start quiz &rarr;</button></div></div>`;
  app.querySelectorAll('.mode').forEach(b => b.onclick = () => { m = b.dataset.m; app.querySelectorAll('.mode').forEach(x => x.classList.toggle('on', x === b)); });
  document.getElementById('go').onclick = () => {
    mode = m; let q = pool;
    if (isAll) { if (document.getElementById('sh').checked) q = shuffle(pool); q = q.slice(0, Math.max(1, Math.min(pool.length, +document.getElementById('n').value || pool.length))); }
    Q = q; ans = Q.map(() => null); cur = 0; show();
  };
  window.scrollTo(0,0);
}

function dotCls(i) {
  let k = 'dot';
  if (i === cur) k += ' cur';
  if (ans[i] != null) k += mode === 'practice' ? (ans[i] === Q[i].a ? ' ok' : ' no') : ' done';
  return k;
}
function show() {
  const q = Q[cur], a = ans[cur], reveal = mode === 'practice' && a != null;
  const answered = ans.filter(x => x != null).length;
  app.innerHTML = `${crumb}<div class="qhead"><h1>${title}</h1><div class="qinfo"><span>Question ${cur+1} of ${Q.length}</span><span>${answered} answered &middot; ${mode==='test'?'Test':'Practice'} mode</span></div>
  <div class="bar"><i style="width:${(cur+1)/Q.length*100}%"></i></div><div class="dots">${Q.map((_,i)=>`<button class="${dotCls(i)}" data-i="${i}">${i+1}</button>`).join('')}</div></div>
  <div class="qcard"><span class="qtag">${q.tag}</span>${fig(q)}<div class="qtext">${q.q}</div>
  ${q.o.map((o,i)=>`<button class="opt ${a===i&&!reveal?'sel':''} ${reveal&&i===q.a?'right':''} ${reveal&&a===i&&i!==q.a?'wrong':''}" data-o="${i}" ${reveal?'disabled':''}><span class="l">${L[i]}</span><span>${o}</span></button>`).join('')}
  ${reveal ? `<div class="verdict ${a===q.a?'ok':'no'}">${a===q.a?'&#10003; Correct! Well done.':'&#10007; Not quite. You chose '+L[a]+'. See the solution below.'}</div>${sol(q)}` : ''}</div>
  <div class="nav2"><button class="btn ghost" id="prev" ${cur===0?'disabled':''}>&larr; Previous</button>${cur<Q.length-1?'<button class="btn" id="next">Next &rarr;</button>':''}
  <span class="sp"></span><a class="btn ghost" target="_blank" rel="noopener" href="${doubt(q)}">Ask a doubt</a><button class="btn ghost" id="fin">${mode==='test'?'Submit test':'Finish'}</button></div>`;
  app.querySelectorAll('.opt').forEach(b => b.onclick = () => { ans[cur] = +b.dataset.o; show(); });
  app.querySelectorAll('.dot').forEach(b => b.onclick = () => { cur = +b.dataset.i; show(); });
  const p = document.getElementById('prev'); if (p) p.onclick = () => { cur--; show(); };
  const n = document.getElementById('next'); if (n) n.onclick = () => { cur++; show(); };
  document.getElementById('fin').onclick = () => {
    const un = ans.filter(x=>x==null).length;
    if (un && !confirm(`${un} question(s) unanswered. Finish anyway?`)) return;
    results();
  };
  typeset(app);
}

function results() {
  const score = Q.reduce((s,q,i)=>s+(ans[i]===q.a?1:0),0), skipped = ans.filter(x=>x==null).length, pct = Math.round(score/Q.length*100);
  const key = 'best:'+c.id+':'+setId, b = ls.get(key);
  if (!b || score/Q.length >= b.score/b.total) ls.set(key,{score,total:Q.length});
  const msg = pct>=80?'Excellent work!':pct>=50?'Good effort. Review the steps below.':'Keep practising. The solutions below will help.';
  app.innerHTML = `${crumb}<div class="res"><div class="ring" style="--p:${pct}"><div><span>${pct}%<small>${score}/${Q.length}</small></span></div></div>
  <div><h1>${msg}</h1><p class="sub">${title}<br>${score} correct &middot; ${Q.length-score-skipped} wrong &middot; ${skipped} skipped</p>
  <div class="row"><button class="btn" id="again">Try again</button><a class="btn ghost" href="course.html?c=${c.id}">Back to course</a></div></div></div>
  <h2 class="sec">Review with solutions</h2>` +
  Q.map((q,i)=>{ const k = ans[i]==null?'sk':ans[i]===q.a?'ok':'no';
  return `<details class="rev"><summary><span class="st ${k}">${k==='ok'?'&#10003;':k==='no'?'&#10007;':'&ndash;'}</span><span class="q"><small style="color:var(--mut)">${q.tag}</small> ${q.q}</span></summary><div class="in">${fig(q)}<div class="qtext">${q.q}</div>
  ${q.o.map((o,j)=>`<div class="opt ${j===q.a?'right':''} ${ans[i]===j&&j!==q.a?'wrong':''}" style="cursor:default"><span class="l">${L[j]}</span><span>${o}</span></div>`).join('')}${sol(q)}
  <p><a target="_blank" rel="noopener" href="${doubt(q)}">Ask a doubt about this question</a></p></div></details>`; }).join('');
  document.getElementById('again').onclick = setup;
  typeset(app); window.scrollTo(0,0);
}
setup();
