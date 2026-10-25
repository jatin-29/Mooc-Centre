const app = document.getElementById('app');
const c = course(new URLSearchParams(location.search).get('c'));
if (!c || !c.live) { app.innerHTML = '<p>Course not found. <a href="index.html">Back to courses</a></p>'; }
else {
  const all = Object.keys(c.sets).map(Number).sort((a,b)=>a-b);
  const ns = all.filter(n => !c.sets[n].group);
  const cnt0 = list => list.reduce((s,n)=>s+c.sets[n].questions.length,0);
  const comb = all.filter(n => !c.sets[n].group || c.sets[n].inCombined), extraQ = cnt0(comb) - cnt0(ns);
  const groups = [...new Set(all.map(n => c.sets[n].group).filter(Boolean))].sort().reverse();
  const cnt = list => list.reduce((s,n)=>s+c.sets[n].questions.length,0);
  const best = k => { const b = ls.get('best:'+c.id+':'+k); return b ? `<span class="pill g">Best ${b.score}/${b.total}</span>` : '<span>Not attempted</span>'; };
  const num = n => { const st = c.sets[n]; if (st.badge) return st.badge; if (st.group) return n % 100; return st.label ? (st.label === 'Extra' ? '+' : Math.floor(n) + (n % 1 ? 'b' : 'a')) : n; };
  const tile = n => `<a class="tile" href="quiz.html?c=${c.id}&set=${n}"><span class="num">${num(n)}</span><h4>${c.sets[n].label||c.unit+' '+n}</h4>${c.sets[n].title?`<p>${c.sets[n].title}</p>`:''}<div class="foot"><span>${c.sets[n].questions.length} questions</span>${best(n)}</div></a>`;
  app.innerHTML = `<div class="crumb"><a href="index.html">Courses</a> / ${c.short}</div>
  <div class="banner"><img src="${c.cover}" alt=""><div class="in"><h1>${c.title}</h1><p>${c.desc}</p></div></div>${c.note?`<div class="notice">${c.note}</div>`:''}
  <div class="feature"><div><h3>Combined quiz: all ${ns.length} ${c.unit.toLowerCase()}s</h3><p>${cnt(comb)} questions${extraQ?` (incl. ${extraQ} extra, optional)`:''}. Choose how many, shuffle them, practice or test.</p></div><a class="btn" href="quiz.html?c=${c.id}&set=all">Start combined quiz &rarr;</a></div>
  <h2 class="sec">${c.unit}s <small>${ns.length} quizzes</small></h2>
  <div class="tiles">${ns.map(tile).join('')}</div>` +
  groups.map(g => { const gl = all.filter(n => c.sets[n].group === g), f = c.sets[gl[0]];
    if (f.single) return `<h2 class="sec">${f.groupTitle||g} <small>${cnt(gl)} questions</small></h2>${f.note?`<div class="notice">${f.note}</div>`:''}<div class="tiles" style="margin-top:16px">${gl.map(tile).join('')}</div>`;
    return `<h2 class="sec">Previous year: ${g} <small>${cnt(gl)} questions</small></h2>
  <div class="feature alt"><div><h3>${g} combined quiz</h3><p>All ${gl.length} weeks from the ${g} run of this course.</p></div><a class="btn" href="quiz.html?c=${c.id}&set=all&grp=${g}">Start ${g} combined quiz &rarr;</a></div>
  <div class="tiles" style="margin-top:16px">${gl.map(tile).join('')}</div>`; }).join('');
}
