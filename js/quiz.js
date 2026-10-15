const app = document.getElementById('app');
const P = new URLSearchParams(location.search);
const c = course(P.get('c')), setId = P.get('set');
const L = ['A','B','C','D'];
if (!c || !c.live || (setId !== 'all' && !c.sets[setId])) { app.innerHTML = '<p>Quiz not found. <a href="index.html">Back</a></p>'; throw 0; }
const isAll = setId === 'all';
const title = isAll ? 'Combined quiz (all assignments)' : `Assignment ${setId}: ${c.sets[setId].title}`;
let pool = [];
Object.keys(c.sets).map(Number).sort((a,b)=>a-b).forEach(n => {
  if (isAll || String(n) === setId) c.sets[n].questions.forEach((q,i) => pool.push({...q, tag:`A${n} Q${i+1}`}));
});
let Q = [], ans = [], cur = 0, mode = 'practice', done = false;
const shuffle = a => { a = a.slice(); for (let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const doubt = q => `https://github.com/${REPO}/issues/new?title=${encodeURIComponent('Doubt: '+c.short+' '+q.tag)}&body=${encodeURIComponent('Course: '+c.title+'\nQuestion: '+q.tag+'\n\nMy doubt:\n')}`;

function setup() {
  app.innerHTML = `<p><a href="course.html?c=${c.id}">&larr; ${c.title}</a></p><h1>${title}</h1><p class="sub">${pool.length} questions available.</p>
  <div class="field"><label>Mode</label><select id="mode"><option value="practice">Practice - instant feedback + step-by-step solution</option><option value="test">Test - answer everything, then submit</option></select></div>
  ${isAll ? `<div class="field"><label>Number of questions</label><input type="number" id="n" min="1" max="${pool.length}" value="${pool.length}"></div>
  <div class="field"><label><input type="checkbox" id="sh" checked> Shuffle questions</label></div>` : ''}
  <button class="btn" id="go">Start</button>`;
  document.getElementById('go').onclick = () => {
    mode = document.getElementById('mode').value;
    let q = pool;
    if (isAll) { if (document.getElementById('sh').checked) q = shuffle(pool); q = q.slice(0, Math.max(1, Math.min(pool.length, +document.getElementById('n').value || pool.length))); }
    Q = q; ans = Q.map(() => null); cur = 0; done = false; show();
  };
}
const sol = q => `<div class="sol"><h4>Step-by-step solution</h4><ol>${q.s.map((s,i)=>`<li><b class="st">Step ${i+1}</b>${s}</li>`).join('')}</ol><div class="fin">Correct answer: ${L[q.a]}. ${q.o[q.a]}</div></div>`;
const chips = () => `<div class="chips">${Q.map((_,i)=>`<button class="chip ${ans[i]!=null?'done':''} ${i===cur?'cur':''}" data-i="${i}">${i+1}</button>`).join('')}</div>`;

function show() {
  const q = Q[cur], a = ans[cur], reveal = mode === 'practice' && a != null;
  const answered = ans.filter(x => x != null).length;
  app.innerHTML = `<p><a href="course.html?c=${c.id}">&larr; ${c.title}</a></p><h1 style="font-size:20px">${title}</h1>
  <div class="qmeta">Question ${cur+1} of ${Q.length} &middot; ${q.tag} &middot; ${answered} answered</div>
  <div class="bar"><i style="width:${(cur+1)/Q.length*100}%"></i></div>${chips()}
  <div class="qtext">${q.q}</div>
  ${q.o.map((o,i)=>`<button class="opt ${a===i?'sel':''} ${reveal&&i===q.a?'right':''} ${reveal&&a===i&&i!==q.a?'wrong':''}" data-o="${i}" ${reveal?'disabled':''}><span class="l">${L[i]}</span><span>${o}</span></button>`).join('')}
  ${reveal ? `<div class="verdict ${a===q.a?'ok':'no'}">${a===q.a?'Correct!':'Not quite. You chose '+L[a]+'.'}</div>${sol(q)}` : ''}
  <div class="row" style="margin-top:14px"><button class="btn ghost" id="prev" ${cur===0?'disabled':''}>Previous</button>
  ${cur<Q.length-1 ? '<button class="btn" id="next">Next</button>' : ''}
  <button class="btn" id="fin">${mode==='test'?'Submit test':'Finish & see score'}</button>
  <a class="btn ghost" target="_blank" rel="noopener" href="${doubt(q)}">Ask a doubt</a></div>`;
  app.querySelectorAll('.opt').forEach(b => b.onclick = () => { ans[cur] = +b.dataset.o; show(); });
  app.querySelectorAll('.chip').forEach(b => b.onclick = () => { cur = +b.dataset.i; show(); });
  const p = document.getElementById('prev'); if (p) p.onclick = () => { cur--; show(); };
  const n = document.getElementById('next'); if (n) n.onclick = () => { cur++; show(); };
  document.getElementById('fin').onclick = () => {
    const un = ans.filter(x=>x==null).length;
    if (un && !confirm(`${un} question(s) unanswered. Finish anyway?`)) return;
    results();
  };
  typeset(app); window.scrollTo(0,0);
}

function results() {
  const score = Q.reduce((s,q,i)=>s+(ans[i]===q.a?1:0),0);
  const key = 'best:'+c.id+':'+setId, b = ls.get(key);
  if (!b || score/Q.length >= b.score/b.total) ls.set(key,{score,total:Q.length});
  app.innerHTML = `<p><a href="course.html?c=${c.id}">&larr; ${c.title}</a></p><h1>Results</h1><div class="score">${score} / ${Q.length}</div>
  <p class="sub">${Math.round(score/Q.length*100)}% &middot; ${title}</p>
  <div class="row"><button class="btn" id="again">Try again</button><a class="btn ghost" href="course.html?c=${c.id}">Back to course</a></div><h2>Review with solutions</h2>` +
  Q.map((q,i)=>`<div class="rev"><div class="qmeta">Q${i+1} &middot; ${q.tag} &middot; <b style="color:var(${ans[i]===q.a?'--ok':'--bad'})">${ans[i]==null?'Unanswered':ans[i]===q.a?'Correct':'Wrong (you chose '+L[ans[i]]+')'}</b></div>
  <div class="qtext">${q.q}</div>${q.o.map((o,j)=>`<div class="opt ${j===q.a?'right':''} ${ans[i]===j&&j!==q.a?'wrong':''}" style="cursor:default"><span class="l">${L[j]}</span><span>${o}</span></div>`).join('')}${sol(q)}
  <p><a target="_blank" rel="noopener" href="${doubt(q)}">Ask a doubt about this question</a></p></div>`).join('');
  document.getElementById('again').onclick = setup;
  typeset(app); window.scrollTo(0,0);
}
setup();
