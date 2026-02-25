// AEOESS Navigation + Dark Mode
function toggleDrawer(){
  document.querySelector('.burger').classList.toggle('open');
  const d=document.querySelector('.drawer');
  if(d.classList.contains('open')){d.classList.remove('open');setTimeout(()=>d.style.display='none',300)}
  else{d.style.display='block';requestAnimationFrame(()=>d.classList.add('open'))}
}
document.querySelectorAll('.drawer a').forEach(a=>a.addEventListener('click',()=>{
  document.querySelector('.burger').classList.remove('open');
  const d=document.querySelector('.drawer');d.classList.remove('open');setTimeout(()=>d.style.display='none',300);
}));

// Dark mode
function toggleTheme(){
  const isDark=document.documentElement.getAttribute('data-theme')==='dark';
  const next=isDark?'light':'dark';
  document.documentElement.setAttribute('data-theme',next);
  localStorage.setItem('aeoess-theme',next);
  updateToggleIcon();
}
function updateToggleIcon(){
  const btn=document.querySelector('.theme-toggle');
  if(!btn)return;
  btn.textContent=document.documentElement.getAttribute('data-theme')==='dark'?'☀':'☾';
}
// Init theme
(function(){
  const saved=localStorage.getItem('aeoess-theme');
  if(saved==='dark')document.documentElement.setAttribute('data-theme','dark');
  else if(!saved&&window.matchMedia('(prefers-color-scheme:dark)').matches)document.documentElement.setAttribute('data-theme','dark');
  // Set icon after DOM
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',updateToggleIcon);
  else updateToggleIcon();
})();
