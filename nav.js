// AEOESS Navigation
function toggleDrawer(){
  document.querySelector('.burger').classList.toggle('open');
  const d=document.querySelector('.drawer');
  if(d.classList.contains('open')){d.classList.remove('open');setTimeout(()=>d.style.display='none',300)}
  else{d.style.display='block';requestAnimationFrame(()=>d.classList.add('open'))}
}
// Close drawer on link click
document.querySelectorAll('.drawer a').forEach(a=>a.addEventListener('click',()=>{
  document.querySelector('.burger').classList.remove('open');
  const d=document.querySelector('.drawer');d.classList.remove('open');setTimeout(()=>d.style.display='none',300);
}));
