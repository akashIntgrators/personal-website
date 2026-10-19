const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('#nav-links');

const setHeaderState = () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 16);
};

setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

if (menuButton && navLinks) {
  const closeMenu = () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.querySelector('.sr-only').textContent = 'Open navigation';
    navLinks.classList.remove('is-open');
  };

  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.querySelector('.sr-only').textContent = isOpen ? 'Open navigation' : 'Close navigation';
    navLinks.classList.toggle('is-open', !isOpen);
  });

  navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
      menuButton.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 860) closeMenu();
  });
}

const revealItems = document.querySelectorAll('.reveal');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  revealItems.forEach((item) => observer.observe(item));
}

// Expertise highlights: native touch/trackpad scroll, arrows, dots and keyboard.
(() => {
  const track = document.querySelector('.expertise-track');
  if (!track) return;
  const slides = Array.from(track.children);
  const controls = document.querySelector('.expertise-controls');
  const prev = controls.querySelector('[data-carousel-prev]');
  const next = controls.querySelector('[data-carousel-next]');
  const dots = Array.from(controls.querySelectorAll('[data-carousel-dot]'));
  const status = controls.querySelector('[data-carousel-status]');
  let current = 0;
  const play = controls.querySelector('[data-carousel-play]');
  let autoplay = null;
  const stop = () => { clearInterval(autoplay); autoplay=null; if(play){play.textContent='▶';play.setAttribute('aria-pressed','false');play.setAttribute('aria-label','Play highlights');} };
  play?.addEventListener('click',()=>{
    if(autoplay){stop();return;}
    play.textContent='Ⅱ';play.setAttribute('aria-pressed','true');play.setAttribute('aria-label','Pause highlights');
    autoplay=setInterval(()=>go((current+1)%slides.length),6000);
  });
  track.addEventListener('touchstart',stop,{passive:true});
  track.addEventListener('pointerdown',stop);
  track.addEventListener('keydown',stop);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
  if('IntersectionObserver' in window) new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)stop();}).observe(track);

  slides.forEach((slide, i) => {
    const config = window.expertiseMedia?.[i] || {};
    const slot = slide.querySelector('.expertise-media');
    if (config.type === 'animation') {
      const illustration = document.createElement('div');
      illustration.className = 'smart-animation'; illustration.setAttribute('aria-hidden','true');
      illustration.innerHTML = '<div class="smart-house"><span></span><span></span></div>';
      slot.append(illustration);
    } else if (config.type === 'video') {
      const video = document.createElement('video');
      video.src = config.src; video.poster = config.poster || '';
      video.controls = true; video.playsInline = true; video.preload = 'none';
      video.setAttribute('aria-label',config.alt || 'Service video');
      slot.append(video);
    } else if (config.src) {
      const img = document.createElement('img');
      img.src = config.type === 'gif' && reducedMotion ? (config.poster || '') : config.src;
      img.alt = config.alt || ''; img.loading = 'lazy'; img.decoding = 'async';
      if (img.getAttribute('src')) slot.append(img);
    }
  });
  const go = index => {
    index = Math.max(0,Math.min(slides.length-1,index));
    const inset = parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0;
    const offset = slides[index].getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft - inset;
    track.scrollTo({left:offset,behavior:reducedMotion ? 'auto':'smooth'});
  };
  const update = () => {
    const left = track.getBoundingClientRect().left;
    current = slides.reduce((best,slide,i) => Math.abs(slide.getBoundingClientRect().left-left) < Math.abs(slides[best].getBoundingClientRect().left-left) ? i : best,0);
    // The final slide may be clamped to the track's right edge.
    if (track.scrollLeft >= track.scrollWidth-track.clientWidth-2) current=slides.length-1;
    dots.forEach((dot,i)=>dot.setAttribute('aria-current',String(i===current)));
    prev.disabled=current===0; next.disabled=current===slides.length-1;
    status.textContent=slides[current].getAttribute('aria-label');
    slides.forEach((slide,i)=>{if(i!==current)slide.querySelectorAll('video').forEach(video=>video.pause());});
  };
  controls.hidden=false;
  prev.addEventListener('click',()=>{stop();go(current-1);}); next.addEventListener('click',()=>{stop();go(current+1);});
  dots.forEach((dot,i)=>dot.addEventListener('click',()=>{stop();go(i);}));
  track.addEventListener('keydown',event=>{
    if(event.target!==track)return;
    if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) {
      event.preventDefault(); go(event.key==='Home'?0:event.key==='End'?slides.length-1:current+(event.key==='ArrowRight'?1:-1));
    }
  });
  let timer;
  track.addEventListener('scroll',()=>{clearTimeout(timer);timer=setTimeout(update,100);},{passive:true});
  window.addEventListener('resize',update);
  update();
})();
