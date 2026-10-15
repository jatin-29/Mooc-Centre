window.R = String.raw;
window.M = rows => '\\begin{bmatrix}' + rows.map(r => r.join('&')).join('\\\\') + '\\end{bmatrix}';
window.REPO = 'jatin-29/mooc-centre';
window.COURSES = [
  {id:'ala', title:'Applied Linear Algebra', short:'ALA', live:true, count:11,
   desc:'Vectors, matrices, SVD, LMMSE, MIMO/OFDM, PCA, sparse recovery and more - all 11 weekly assignments.', sets:{}},
  {id:'prob', title:'Probability & Statistics', live:false, desc:'Coming soon'},
  {id:'dsa', title:'Data Structures & Algorithms', live:false, desc:'Coming soon'},
  {id:'ml', title:'Machine Learning', live:false, desc:'Coming soon'}
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
