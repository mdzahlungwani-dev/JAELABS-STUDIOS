const menu=document.getElementById('menu');
const nav=document.getElementById('nav');
const pages=[...document.querySelectorAll('.page')];
function showPage(name,updateHistory=true){
  const target=document.getElementById('page-'+name);
  if(!target)return;
  pages.forEach(page=>page.classList.toggle('active',page===target));
  document.querySelectorAll('.nav [data-page]').forEach(link=>{
    if(link.dataset.page===name)link.setAttribute('aria-current','page');
    else link.removeAttribute('aria-current');
  });
  if(updateHistory)history.pushState({page:name},'', '#'+name);
  window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='☰';
  target.querySelectorAll('.reveal').forEach(el=>el.classList.remove('visible'));
  observeReveals();
}
document.querySelectorAll('[data-page]').forEach(link=>link.addEventListener('click',event=>{
  event.preventDefault();
  if(link.dataset.service){const select=document.getElementById('service');if(select)select.value=link.dataset.service;}
  showPage(link.dataset.page);
}));
window.addEventListener('popstate',()=>{const name=location.hash.slice(1)||'home';showPage(document.getElementById('page-'+name)?name:'home',false);});
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'✕':'☰';});
let observer;
function observeReveals(){
  if(observer)observer.disconnect();
  if('IntersectionObserver'in window){
    observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.12});
    document.querySelectorAll('.page.active .reveal:not(.visible)').forEach(el=>observer.observe(el));
  }else document.querySelectorAll('.page.active .reveal').forEach(el=>el.classList.add('visible'));
}
document.getElementById('year').textContent=new Date().getFullYear();
document.getElementById('inquiry').addEventListener('submit',event=>{
  event.preventDefault();const form=event.currentTarget;
  const subject=encodeURIComponent('Project inquiry — JAELABS Studios');
  const body=encodeURIComponent(`Name: ${form.elements.namedItem('name').value}\nEmail: ${form.elements.namedItem('email').value}\nService: ${form.elements.namedItem('service').value}\n\nProject details:\n${form.elements.namedItem('details').value}`);
  const toast=document.getElementById('toast');toast.textContent='Your email app should open with the inquiry prepared. Review it and press Send. If it does not open, email MDZA.HLUNGWANI@gmail.com directly.';toast.classList.add('show');
  window.location.href=`mailto:MDZA.HLUNGWANI@gmail.com?subject=${subject}&body=${body}`;
});
const initial=location.hash.slice(1);
showPage(document.getElementById('page-'+initial)?initial:'home',false);
