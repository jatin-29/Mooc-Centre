window.R = String.raw;
window.M = rows => '\\begin{bmatrix}' + rows.map(r => r.join('&')).join('\\\\') + '\\end{bmatrix}';
window.COURSES = [
  {id:'ala', title:'Applied Linear Algebra', short:'ALA', live:true, count:11, qs:110, unit:'Assignment', prefix:'A', cover:'assets/cover-ala.svg', tag:'Mathematics · Signal Processing · ML',
   desc:'Vectors, matrices, SVD, LMMSE, MIMO/OFDM, PCA and sparse recovery. All 11 weekly assignments.', sets:{}},
  {id:'wildlife', title:'Wildlife Ecology', short:'WE', live:true, shuffleRetry:true, count:13, qs:147, pill:'12 weeks + 27 extra', unit:'Week', prefix:'W', brief:true, cover:'assets/cover-wildlife.svg', tag:'Ecology · Conservation · Field methods',
   desc:'Ecology basics, food chains, populations, communities, habitat loss and conservation. Weeks 1 to 12.', sets:{}},
  {id:'iot', title:'Introduction to Internet of Things', short:'IoT', live:true, count:61, qs:905, pill:'12 weeks + 4 previous years', unit:'Week', prefix:'W', brief:true, cover:'assets/cover-iot.svg', tag:'Sensors · Networks · Embedded',
   desc:'IoT basics, networking protocols, sensor networks, Arduino, Python, Raspberry Pi, SDN and cloud. Weeks 1 to 12, plus previous-year papers (2022-2025).', sets:{}},
  {id:'envdev', title:'Environment and Development', short:'E&D', live:true, count:12, qs:120, unit:'Week', prefix:'W', brief:true, math:false, cover:'assets/cover-envdev.svg', tag:'Environment · Sustainability · Policy',
   desc:'Sustainable development, environmental issues and policy. Weeks 1 to 12.', note:'Compiled from NPTEL assignment documents and accepted answers. Explanations are learning-oriented expansions, not quotes from the source.', sets:{}},
  {id:'forests', title:'Forests and Their Management', short:'FTM', live:true, count:14, qs:136, pill:'Weeks 0-12 + Extra', unit:'Week', prefix:'W', brief:true, math:false, cover:'assets/cover-forests.svg', tag:'Forestry · Ecology · Management',
   desc:'Forest ecosystems, silviculture and forest management. Weeks 0 to 12 plus extra questions.', note:'Based on the January-April 2026 question bank. Check the latest NPTEL/SWAYAM course page as questions and answers may change.', sets:{}},
  {id:'psychology', title:'Psychology of Learning', short:'PoL', live:true, count:13, qs:130, pill:'12 weeks', unit:'Week', prefix:'W', brief:true, math:false, cover:'assets/cover-psychology.svg', tag:'Psychology · Learning · Behaviour',
   desc:'How people learn: theories of learning, memory and motivation. Weeks 1 to 12.', note:'Week 7 has two different assignments (2025 and 2026). Practise both.', sets:{}},
  {id:'python', title:'The Joy of Computing using Python', short:'JoC', live:true, count:11, qs:220, unit:'Week', prefix:'W', brief:true, math:false, cover:'assets/cover-python.svg', tag:'Programming · Python · Problem solving',
   desc:'Programming fundamentals in Python with scenario and code-based questions. Weeks 1 to 11, 20 questions each.', note:'Many questions are scenario-based (read the scenario and any code first) and some are multiple-answer.', sets:{}},
  {id:'startup', title:'Understanding Incubation and Entrepreneurship', short:'UIE', live:true, count:11, qs:110, unit:'Assignment', prefix:'A', brief:true, math:false, cover:'assets/cover-startup.svg', tag:'Startups · Incubation · Innovation',
   desc:'Startups, incubation, business models and innovation. Assignments 1 to 11.', sets:{}}
];
window.addSet = (cid, n, obj) => { COURSES.find(c => c.id === cid).sets[n] = obj; };
window.course = id => COURSES.find(c => c.id === id);
window.ls = {
  get(k){ try{ return JSON.parse(localStorage.getItem(k)); }catch(e){ return null; } },
  set(k,v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
};
window.typeset = el => {
  if (window.renderMathInElement) renderMathInElement(el, {delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}], throwOnError:false});
};
window.shell = () => {
  document.body.insertAdjacentHTML('afterbegin', `<header class="nav"><div class="wrap"><a class="brand" href="index.html"><span class="logo"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-5 9 5-9 5-9-5z"/><path d="M7 12v4c0 1.5 2.2 3 5 3s5-1.5 5-3v-4"/></svg></span>MOOC Centre</a><a class="lnk" href="index.html#courses">Courses</a></div></header>`);
  document.body.insertAdjacentHTML('beforeend', `<footer>MOOC Centre · Practice quizzes with step-by-step solutions.</footer>`);
};
shell();
