window.R = String.raw;
window.M = rows => '\\begin{bmatrix}' + rows.map(r => r.join('&')).join('\\\\') + '\\end{bmatrix}';
window.COURSES = [
  {id:'ala', title:'Applied Linear Algebra', short:'ALA', live:true, count:11, qs:110, unit:'Assignment', prefix:'A', cover:'assets/cover-ala.svg', tag:'Mathematics · Signal Processing · ML',
   desc:'Vectors, matrices, SVD, LMMSE, MIMO/OFDM, PCA and sparse recovery. All 11 weekly assignments.', sets:{}},
  {id:'wildlife', title:'Wildlife Ecology', short:'WE', live:true, count:12, qs:120, unit:'Week', prefix:'W', brief:true, cover:'assets/cover-wildlife.svg', tag:'Ecology · Conservation · Field methods',
   desc:'Ecology basics, food chains, populations, communities, habitat loss and conservation. Weeks 1 to 12.', sets:{}},
  {id:'iot', title:'Introduction to Internet of Things', short:'IoT', live:true, count:9, qs:125, unit:'Week', prefix:'W', brief:true, cover:'assets/cover-iot.svg', tag:'Sensors · Networks · Embedded',
   desc:'IoT basics, networking protocols, sensor networks, Arduino, Python, Raspberry Pi, SDN and cloud. Weeks 1 to 9 (Week 9 partial).', sets:{}}
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
