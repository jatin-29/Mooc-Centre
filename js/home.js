const app = document.getElementById('app');
const ala = course('ala'), nQ = 110;
const card = c => c.live
 ? `<a class="ccard" href="course.html?c=${c.id}"><div class="cover"><img src="${c.cover}" alt=""><span class="badge"><i></i>Live</span></div><div class="body"><h3>${c.title}</h3><p>${c.desc}</p><div class="meta"><span class="pill">11 assignments</span><span class="pill">${nQ} questions</span><span class="pill g">Combined quiz</span></div></div></a>`
 : `<div class="ccard soon"><div class="cover"><img src="${c.cover}" alt=""><span class="badge soon"><i></i>Coming soon</span></div><div class="body"><h3>${c.title}</h3><p>${c.desc}</p><div class="meta"><span class="pill m">${c.tag}</span></div></div></div>`;
app.innerHTML = `<section class="hero"><span class="eyebrow">&#9889; Free MOOC practice</span>
<h1>Practice assignments.<br><em>Understand every step.</em></h1>
<p>Attempt NPTEL-style assignment quizzes, get instant feedback and detailed step-by-step solutions for every question.</p>
<div class="row"><a class="btn" href="course.html?c=ala">Start with ALA &rarr;</a><a class="btn ghost" href="#courses">Browse courses</a></div>
<div class="stats"><div><b>${nQ}</b><span>questions</span></div><div><b>11</b><span>assignments</span></div><div><b>Step&nbsp;by&nbsp;step</b><span>solutions</span></div></div></section>
<h2 class="sec" id="courses">Courses <small>pick a subject to begin</small></h2><div class="courses">${COURSES.map(card).join('')}</div>`;
