const app = document.getElementById('app');
const c = course(new URLSearchParams(location.search).get('c'));
if (!c || !c.live) { app.innerHTML = '<p>Course not found. <a href="index.html">Back</a></p>'; }
else {
  const ns = Object.keys(c.sets).map(Number).sort((a,b)=>a-b);
  const total = ns.reduce((s,n)=>s+c.sets[n].questions.length,0);
  const best = k => { const b = ls.get('best:'+c.id+':'+k); return b ? `<span class="tag best">Best ${b.score}/${b.total}</span>` : ''; };
  app.innerHTML = `<p><a href="index.html">&larr; All courses</a></p><h1>${c.title}</h1><p class="sub">${c.desc}</p>
  <a class="card" style="border-color:var(--pri)" href="quiz.html?c=${c.id}&set=all"><h3>Combined quiz - all ${ns.length} assignments</h3><p>${total} questions. Choose how many, shuffle, practice or test mode.</p>${best('all')}</a>
  <h2>Assignments</h2><div class="grid">` + ns.map(n => `<a class="card" href="quiz.html?c=${c.id}&set=${n}"><h3>Assignment ${n}</h3><p>${c.sets[n].title}</p><span class="tag">${c.sets[n].questions.length} questions</span> ${best(n)}</a>`).join('') + `</div>`;
}
