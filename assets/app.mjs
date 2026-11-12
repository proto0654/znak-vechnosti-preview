import {slides} from './data.mjs';
import {createInquiry} from './logic.mjs';
import {imageSources} from './images.mjs';

const $ = (selector,root=document) => root.querySelector(selector);
const $$ = (selector,root=document) => [...root.querySelectorAll(selector)];
const requestDialog = $('#request-dialog');
let lastFocused;
let toastTimer;

function toast(message) {
  const target=$('#toast');
  target.textContent=message;
  target.hidden=false;
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>{target.hidden=true;},5500);
}

function openRequest(context,question=false) {
  lastFocused=document.activeElement;
  const form=$('form[data-inquiry]',requestDialog);
  form.elements.context.value=context;
  $('#request-title').textContent=question?'Задать вопрос':'Оставить заявку';
  $('#request-context').textContent=context;
  $('.question-field',form).classList.toggle('hidden',!question);
  form.elements.question.required=question;
  $('.form-status',form).replaceChildren();
  $$('[data-error]',form).forEach(el=>el.textContent='');
  $$('[aria-invalid]',form).forEach(el=>el.removeAttribute('aria-invalid'));
  requestDialog.showModal();
  closeContactMenu();
  document.body.style.overflow='hidden';
  $('.floating-contact').hidden=true;
  requestAnimationFrame(()=>form.elements.phone.focus());
}

document.addEventListener('click',event=>{
  const button=event.target.closest('[data-request]');
  if(button) openRequest(button.dataset.request);
  if(event.target.closest('[data-question]')) openRequest('Вопрос специалисту',true);
  const unavailable=event.target.closest('[data-unavailable]');
  if(unavailable)toast(unavailable.dataset.unavailable);
  if(event.target.closest('[data-close-dialog]'))event.target.closest('dialog').close();
});

requestDialog.addEventListener('close',()=>{
  document.body.style.overflow='';
  updateFloatingVisibility();
  lastFocused?.focus();
});

$$('[data-inquiry]').forEach(form=>{
  form.addEventListener('submit',event=>{
    event.preventDefault();
    const button=$('[type="submit"]',form);
    const status=$('.form-status',form);
    const values=Object.fromEntries(new FormData(form));
    values.consent=form.elements.consent.checked;
    values.questionRequired=form.elements.question.required;
    $$('[data-error]',form).forEach(el=>el.textContent='');
    $$('[aria-invalid]',form).forEach(el=>el.removeAttribute('aria-invalid'));
    status.replaceChildren();
    let result;
    try {
      result=createInquiry(values,location.pathname);
      if(!result.valid){
        for(const [name,message] of Object.entries(result.errors)) {
          $(`[data-error="${name}"]`,form).textContent=message;
          form.elements[name]?.setAttribute('aria-invalid','true');
        }
        form.elements[Object.keys(result.errors)[0]]?.focus();
        return;
      }
      button.disabled=true;
      const confirmation=document.createElement('div');
      confirmation.className='form-success';
      const heading=document.createElement('strong');
      heading.textContent='Демо-заявка сформирована';
      const description=document.createElement('div');
      description.textContent=`Тема: ${result.inquiry.context}. Отправка в бюро пока не подключена.`;
      confirmation.append(heading,description);
      status.append(confirmation);
    } catch {
      status.classList.add('form-error');
      status.textContent='Не удалось подготовить заявку. Данные сохранены в форме — попробуйте ещё раз.';
    } finally {
      button.disabled=false;
    }
  });
  form.addEventListener('input',()=>$('.form-status',form).replaceChildren());
});

const menuButton=$('.mobile-menu');
function closeMenu(){
  $('.site-header').classList.remove('menu-open');
  menuButton.setAttribute('aria-expanded','false');
  menuButton.setAttribute('aria-label','Открыть меню');
}
menuButton.addEventListener('click',()=>{
  const isOpen=$('.site-header').classList.toggle('menu-open');
  menuButton.setAttribute('aria-expanded',String(isOpen));
  menuButton.setAttribute('aria-label',isOpen?'Закрыть меню':'Открыть меню');
  closeContactMenu();
});
document.addEventListener('click',event=>{if(!event.target.closest('.site-header'))closeMenu();});

const contactButton=$('[data-contact-menu]');
const contactOptions=$('#contact-options');
function closeContactMenu(){contactOptions.hidden=true;contactButton.setAttribute('aria-expanded','false');}
contactButton.addEventListener('click',()=>{
  contactOptions.hidden=!contactOptions.hidden;
  contactButton.setAttribute('aria-expanded',String(!contactOptions.hidden));
  closeMenu();
});
document.addEventListener('click',event=>{if(!event.target.closest('.floating-contact'))closeContactMenu();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeContactMenu();closeMenu();}});

let currentSlide=0;
function changeSlide(index){
  currentSlide=(index+slides.length)%slides.length;
  const slide=slides[currentSlide];
  const image=imageSources(slide.imageKey);
  const heroImage=$('.hero-photo');
  heroImage.srcset=image.srcset;
  heroImage.src=image.src;
  heroImage.alt=image.alt;
  $('#slide-label').textContent=slide.label;
  const title=$('#slide-title');
  title.replaceChildren();
  slide.title.split('\n').forEach((line,i)=>{if(i)title.append(document.createElement('br'));title.append(document.createTextNode(line));});
  $('#slide-text').textContent=slide.text;
  $('#slide-link').href=slide.href;
  $('#slide-link span').textContent=slide.button;
  $('#slide-number').textContent=String(currentSlide+1).padStart(2,'0');
  $$('[data-slide]').forEach((button,i)=>button.setAttribute('aria-pressed',String(i===currentSlide)));
}
if($('.hero-frame')){
  $('[data-slide-prev]').addEventListener('click',()=>changeSlide(currentSlide-1));
  $('[data-slide-next]').addEventListener('click',()=>changeSlide(currentSlide+1));
  $$('[data-slide]').forEach(button=>button.addEventListener('click',()=>changeSlide(Number(button.dataset.slide))));
  let start;
  $('.hero-frame').addEventListener('touchstart',event=>{start={x:event.touches[0].clientX,y:event.touches[0].clientY};},{passive:true});
  $('.hero-frame').addEventListener('touchend',event=>{
    if(!start)return;
    const dx=event.changedTouches[0].clientX-start.x,dy=event.changedTouches[0].clientY-start.y;
    if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.4)changeSlide(currentSlide+(dx<0?1:-1));
    start=null;
  },{passive:true});
}

$$('[data-price-track]').forEach(track=>{
  const section=track.closest('section');
  const scroll=direction=>{
    const cards=$$('.price-card',track);
    const step=cards[0].getBoundingClientRect().width+parseFloat(getComputedStyle(track).gap);
    const max=track.scrollWidth-track.clientWidth;
    if(max<2)return;
    const next=track.scrollLeft+step*direction;
    track.scrollTo({left:next>max+5?0:next< -5?max:Math.max(0,Math.min(max,next)),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  };
  $('[data-price-prev]',section)?.addEventListener('click',()=>scroll(-1));
  $('[data-price-next]',section)?.addEventListener('click',()=>scroll(1));
  const updateControls=()=>{
    const controls=$('.track-controls',section);
    if(controls)controls.hidden=track.scrollWidth-track.clientWidth<2;
  };
  new ResizeObserver(updateControls).observe(track);
});

const visibleForms=new Set();
function updateFloatingVisibility(){
  const hidden=visibleForms.size>0||requestDialog.open;
  $('.floating-contact').hidden=hidden;
  if(hidden)closeContactMenu();
}
const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting)visibleForms.add(entry.target);else visibleForms.delete(entry.target);});
  updateFloatingVisibility();
},{threshold:0});
$$('main [data-inquiry]').forEach(form=>observer.observe(form));
