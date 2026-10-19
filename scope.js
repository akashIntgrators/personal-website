// Optional overrides: window.scopeMedia = [{type:'video',src:'assets/clip.mp4',poster:'assets/still.avif'}, ...]
// image/gif use src and alt; GIFs need a still poster for reduced-motion users.
(() => {
 const track=document.querySelector('.scope-track'); if(!track)return;
 const slides=Array.from(track.children),controls=document.querySelector('.scope-controls');
 const prev=controls.querySelector('[data-scope-prev]'),next=controls.querySelector('[data-scope-next]');
 const dots=Array.from(controls.querySelectorAll('[data-scope-dot]')),play=controls.querySelector('[data-scope-play]');
 const status=controls.querySelector('[data-scope-status]');
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 let current=0,timer=null,scrollTimer;
 slides.forEach((slide,i)=>{
  const config=window.scopeMedia?.[i]; if(!config)return;
  const slot=slide.querySelector('.scope-media');
  if(config.type==='video'){
   const video=document.createElement('video');video.src=config.src;video.poster=config.poster||'';video.controls=true;video.playsInline=true;video.preload='none';video.setAttribute('aria-label',config.alt||'Process video');slot.replaceChildren(video);
  }else if(config.src){
   const img=document.createElement('img');img.src=config.type==='gif'&&reduce?(config.poster||slot.querySelector('img').src):config.src;img.alt=config.alt||'';img.loading='lazy';slot.replaceChildren(img);
  }
 });
 const stop=()=>{clearInterval(timer);timer=null;play.textContent='▶';play.setAttribute('aria-label','Play scope highlights');play.setAttribute('aria-pressed','false');};
 const go=index=>{
  index=Math.max(0,Math.min(slides.length-1,index));
  const inset=parseFloat(getComputedStyle(track).scrollPaddingLeft)||0;
  track.scrollTo({left:slides[index].getBoundingClientRect().left-track.getBoundingClientRect().left+track.scrollLeft-inset,behavior:reduce?'auto':'smooth'});
 };
 const update=()=>{
  const left=track.getBoundingClientRect().left+(parseFloat(getComputedStyle(track).scrollPaddingLeft)||0);
  current=slides.reduce((best,slide,i)=>Math.abs(slide.getBoundingClientRect().left-left)<Math.abs(slides[best].getBoundingClientRect().left-left)?i:best,0);
  if(track.scrollLeft>=track.scrollWidth-track.clientWidth-2)current=slides.length-1;
  dots.forEach((dot,i)=>dot.setAttribute('aria-current',String(i===current)));
  prev.disabled=current===0;next.disabled=current===slides.length-1;
  status.textContent=slides[current].getAttribute('aria-label');
  slides.forEach((slide,i)=>{if(i!==current)slide.querySelectorAll('video').forEach(v=>v.pause());});
 };
 prev.addEventListener('click',()=>{stop();go(current-1);});next.addEventListener('click',()=>{stop();go(current+1);});
 dots.forEach((dot,i)=>dot.addEventListener('click',()=>{stop();go(i);}));
 play.addEventListener('click',()=>{if(timer){stop();return;}play.textContent='Ⅱ';play.setAttribute('aria-label','Pause scope highlights');play.setAttribute('aria-pressed','true');timer=setInterval(()=>go((current+1)%slides.length),6000);});
 track.addEventListener('scroll',()=>{clearTimeout(scrollTimer);scrollTimer=setTimeout(update,100);},{passive:true});
 track.addEventListener('pointerdown',stop);track.addEventListener('touchstart',stop,{passive:true});
 track.addEventListener('keydown',event=>{if(event.target!==track)return;const key=event.key;if(['ArrowLeft','ArrowRight','Home','End'].includes(key)){event.preventDefault();stop();go(key==='Home'?0:key==='End'?slides.length-1:current+(key==='ArrowRight'?1:-1));}});
 window.addEventListener('resize',update);document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
 if('IntersectionObserver'in window)new IntersectionObserver(entries=>{if(!entries[0].isIntersecting){stop();slides.forEach(slide=>slide.querySelectorAll('video').forEach(v=>v.pause()));}}).observe(track);
 controls.hidden=false;update();
})();
