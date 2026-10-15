const app = document.getElementById('app');
const c = course(new URLSearchParams(location.search).get('c'));
if (!c || !c.live) { app.innerHTML = '<p>Course not found. <a href="index.html">Back to courses</a></p>'; }
else {
  const ns = Object.keys(c.sets).map(Number).sort((a,b)=>a-b);
  const total = ns.reduce((s,n)=>s+c.sets[n].questions.length,0);
  const num = n => { const st = c.sets[n]; return st.label ? (st.label === 'Extra' ? '+' : Math.floor(n) + (n % 1 ? 'b' : 'a')) : n; };
  const best = k => { const b = ls.get('best:'+c.id+':'+k); return b ? `<span class="pill g">Best ${b.score}/${b.total}</span>` : '<span>Not attempted</span>'; };
  app.innerHTML = `<div class="crumb"><a href="index.html">Courses</a> / ${c.short}</div>
  <div class="banner"><img src="${c.cover}" alt=""><div class="in"><h1>${c.title}</h1><p>${c.desc}</p></div></div>${c.note?`<div class="notice">${c.note}</div>`:''}
  <div class="feature"><div><h3>Combined quiz: all ${ns.length} ${c.unit.toLowerCase()}s</h3><p>${total} questions. Choose how many, shuffle them, practice or test.</p></div><a class="btn" href="quiz.html?c=${c.id}&set=all">Start combined quiz &rarr;</a></div>
  <h2 class="sec">${c.unit}s <small>${ns.length} quizzes</small></h2>
  <div class="tiles">${ns.map(n => `<a class="tile" href="quiz.html?c=${c.id}&set=${n}"><span class="num">${num(n)}</span><h4>${c.sets[n].label||c.unit+' '+n}</h4>${c.sets[n].title?`<p>${c.sets[n].title}</p>`:''}<div class="foot"><span>${c.sets[n].questions.length} questions</span>${best(n)}</div></a>`).join('')}</div>`;
}
