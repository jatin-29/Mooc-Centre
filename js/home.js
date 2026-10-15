const app = document.getElementById('app');
app.innerHTML = `<h1>MOOC Centre</h1><p class="sub">Attempt assignment quizzes for MOOCs and learn from detailed step-by-step solutions.</p><div class="grid">` +
 COURSES.map(c => c.live
  ? `<a class="card" href="course.html?c=${c.id}"><h3>${c.title}</h3><p>${c.desc}</p><span class="tag">${c.count} assignments + combined quiz</span></a>`
  : `<div class="card dim"><h3>${c.title}</h3><p>${c.desc}</p><span class="tag soon">Coming soon</span></div>`).join('') + `</div>`;
