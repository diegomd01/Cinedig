/* Animación fluida del fondo (NO TOCADA) */
const blobs = [
  {el: document.querySelector('.b1'), baseX: -150, baseY: -100, ampX: 200, ampY: 180, speed: 0.00025, offset: 0},
  {el: document.querySelector('.b2'), baseX: window.innerWidth - 400, baseY: 200, ampX: 260, ampY: 200, speed: 0.00022, offset: 1000},
  {el: document.querySelector('.b3'), baseX: 200, baseY: window.innerHeight - 300, ampX: 230, ampY: 230, speed: 0.00027, offset: 2000}
];
function animate(time){
  blobs.forEach(b=>{
    const t = time * b.speed + b.offset;
    const x = b.baseX + Math.sin(t) * b.ampX;
    const y = b.baseY + Math.cos(t * 1.2) * b.ampY;
    const s = 1.1 + Math.sin(t * 1.5) * 0.2;
    b.el.style.transform = `translate(${x}px,${y}px) scale(${s})`;
  });
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

window.addEventListener('resize',()=>{
  blobs[1].baseX = window.innerWidth - 400;
  blobs[2].baseY = window.innerHeight - 300;
});

/* (opcional) cerrar la tarjeta flotante */
document.getElementById('close').addEventListener('click',()=> {
  document.querySelector('.float').style.display='none';
});

/* ===== Zoom NOTORIO y elegante en .heroPoster con JavaScript ===== */
(function (){
  const hero = document.querySelector('.heroPoster');
  if (!hero) return;
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  const old = hero.querySelector('.zoom-layer');
  if (old) old.remove();
  const imgUrl = 'https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=1600&auto=format&fit=crop';

  hero.style.position = 'relative';
  hero.style.overflow  = 'hidden';
  hero.style.background = 'none';

  const layer = document.createElement('div');
  layer.className = 'zoom-layer';
  Object.assign(layer.style, {
    position: 'absolute',
    inset: '0',
    background: `url('${imgUrl}') center / cover no-repeat`,
    transform: 'scale(1) translate3d(0,0,0)',
    willChange: 'transform',
    filter: 'saturate(1.1) contrast(1.04)'
  });
  hero.appendChild(layer);

  const MIN=1.00, MAX=1.45, CYCLE=120000, PAN=18;
  let dir=1, t0=performance.now();
  const ease = p => p<0.5 ? 4*p*p*p : 1 - Math.pow(-2*p+2,3)/2;

  function tick(now){
    const elapsed = now - t0;
    let p = Math.min(elapsed/CYCLE, 1);
    p = ease(p);
    const scale = dir===1 ? MIN + (MAX-MIN)*p : MAX - (MAX-MIN)*p;
    const orbit = now/40000;
    const tx = Math.cos(orbit)*PAN*(scale-1);
    const ty = Math.sin(orbit*0.9)*PAN*(scale-1);
    layer.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${scale})`;
    if (elapsed >= CYCLE){ dir*=-1; t0=now; }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();

/* ================================ */
/*  CARRUSEL TIPO LUNDEV INTEGRADO  */
/* ================================ */
(function initLundevCarousel(){
  const root = document.getElementById('heroCarousel');
  if(!root) return;

  const nextDom = root.querySelector('#ld-next');
  const prevDom = root.querySelector('#ld-prev');

  const carouselDom = root;                                   // .ld-carousel
  const sliderDom   = carouselDom.querySelector('.ld-list');  // lista grande
  const thumbDom    = carouselDom.querySelector('.ld-thumbnail'); // miniaturas
  const timeDom     = carouselDom.querySelector('.ld-time');

  const timeRunning = 3000;   // duración animación
  const timeAutoNext = 7000;  // autoplay

  // Asegura que haya al menos 1 thumb presente
  let thumbItems = thumbDom.querySelectorAll('.ld-item');
  if (thumbItems.length) thumbDom.appendChild(thumbItems[0]);

  nextDom.addEventListener('click', ()=> showSlider('next'));
  prevDom.addEventListener('click', ()=> showSlider('prev'));

  let runTimeOut;
  let runNextAuto = setTimeout(()=> { nextDom.click(); }, timeAutoNext);

  function showSlider(type){
    const sliderItems = sliderDom.querySelectorAll('.ld-item');
    const thumbItems  = thumbDom.querySelectorAll('.ld-item');

    if (type === 'next'){
      sliderDom.appendChild(sliderItems[0]);
      thumbDom.appendChild(thumbItems[0]);
      carouselDom.classList.add('next');
    } else {
      sliderDom.prepend(sliderItems[sliderItems.length - 1]);
      thumbDom.prepend(thumbItems[thumbItems.length - 1]);
      carouselDom.classList.add('prev');
    }

    // reinicia clase de estado después de la transición
    clearTimeout(runTimeOut);
    runTimeOut = setTimeout(()=>{
      carouselDom.classList.remove('next');
      carouselDom.classList.remove('prev');
    }, timeRunning);

    // reinicia autoplay
    clearTimeout(runNextAuto);
    runNextAuto = setTimeout(()=> { nextDom.click(); }, timeAutoNext);

    // reinicia barra de tiempo
    if (timeDom){
      timeDom.style.animation = 'none';
      // force reflow
      void timeDom.offsetWidth;
      timeDom.style.animation = null;
    }
  }
})();

/* ===== Scroll Reveal para las cards de “¿Por qué Cinedig?” ===== */
(function initReveal(){
  const els = document.querySelectorAll('.feat-card.reveal');
  if (!els.length) return;

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if (e.isIntersecting){
        e.target.classList.add('show');
        // si no quieres que “desaparezcan” al subir, descomenta:
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.18 });

  els.forEach(el=> io.observe(el));
})();

/* ========= INTRO de partículas: “CINEDIG” con brillo interno por partícula ========= */
(function introParticles(){
  const WRD = 'CINEDIG';
  const DENSITY = 1.5; 
  const HOLD_SOLID_MS = 3000; // palabra sólida (3s)
  const SHIMMER_MS    = 3000; // barrido interno fluido
  const FADE_MS       = 900;  // desvanecido
  const BUILD_MS      = 1800; // converge partículas

  const wrap  = document.getElementById('cx-intro');
  const cvs   = document.getElementById('cx-intro-canvas');
  if(!wrap || !cvs) return;

  const ctx   = cvs.getContext('2d', { alpha:false, desynchronized:true });

  /* ⬇️ Optimización 1: DPR adaptativo para pantallas grandes */
  const DPR = (window.innerWidth * window.innerHeight > 1600*900)
    ? 1.0
    : Math.min(window.devicePixelRatio || 1, 1.25);

  let W = 0, H = 0, t0 = 0, phase = 'build', rafId = 0;

  // Partículas
  let pts = [];         // {x,y, tx,ty, vx,vy, r, li, seed}
  let wordMinX=0, wordMaxX=0, wordMinY=0, wordMaxY=0;

  const MAX_PTS_DESKTOP = 1400;
  const MAX_PTS_MOBILE  = 900;

  // Utilidades
  const easeInOutCubic = p => p<0.5 ? 4*p*p*p : 1 - Math.pow(-2*p+2,3)/2;
  const clamp01 = v => Math.max(0, Math.min(1, v));

  function resize(){
    const bw = cvs.clientWidth  = window.innerWidth;
    const bh = cvs.clientHeight = window.innerHeight;
    W = Math.floor(bw * DPR);
    H = Math.floor(bh * DPR);
    cvs.width  = W;
    cvs.height = H;
    if(phase === 'build'){
      makeTargets();
    }
  }

  // ====== (OPTIMIZADO) Dibujo batch de partículas ======
  function drawWordParticles(alpha=1){
    if(alpha !== 1){ ctx.save(); ctx.globalAlpha = alpha; }
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    for(let i=0;i<pts.length;i++){
      const a = pts[i];
      ctx.moveTo(a.tx + a.r, a.ty);
      ctx.arc(a.tx, a.ty, a.r, 0, Math.PI*2);
    }
    ctx.fill();
    if(alpha !== 1) ctx.restore();
  }

  // Construcción de targets y límites de la palabra
  function makeTargets(){
    pts = [];

    const off = document.createElement('canvas');
    const octx = off.getContext('2d');

    const baseW = Math.min(W, H * 2.0);
    off.width  = Math.max(600, Math.floor(baseW * 0.75));
    off.height = Math.max(180, Math.floor(off.width * 0.28));

    const size = Math.floor(off.height * 0.8);
    octx.fillStyle = '#fff';
    octx.font = `900 ${size}px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif`;
    octx.textAlign = 'left';
    octx.textBaseline = 'middle';

    const letters = WRD.split('');
    const widths = letters.map(ch => octx.measureText(ch).width);
    const TRACK = Math.floor(size * 0.06);
    const totalW = widths.reduce((a,b)=>a+b,0) + TRACK*(letters.length-1);

    const startX = Math.floor((off.width - totalW)/2);
    const midY   = off.height/2;

    let cursorX = startX;
    const allTargets = [];
    const STEP_BASE = Math.max(3, Math.floor(off.width / 170));

    let gMinX=Infinity, gMaxX=-Infinity, gMinY=Infinity, gMaxY=-Infinity;

    for(let li=0; li<letters.length; li++){
      const ch = letters[li];
      const w  = widths[li];

      octx.clearRect(0,0,off.width,off.height);
      octx.fillStyle = '#fff';
      octx.fillText(ch, cursorX, midY);

      const img = octx.getImageData(0,0,off.width,off.height).data;
      const STEP = STEP_BASE;

      for(let y=0; y<off.height; y+=STEP){
        for(let x=0; x<off.width; x+=STEP){
          if (x < cursorX || x > cursorX + w) continue;
          const idx = (y*off.width + x)*4;
          const a = img[idx] + img[idx+1] + img[idx+2];
          if (a > 500){
            const gx = Math.floor((W - off.width) / 2) + x;
            const gy = Math.floor((H - off.height)/ 2) + y;
            allTargets.push({ x: gx, y: gy, li });

            if (gx<gMinX) gMinX=gx; if (gx>gMaxX) gMaxX=gx;
            if (gy<gMinY) gMinY=gy; if (gy>gMaxY) gMaxY=gy;
          }
        }
      }

      cursorX += w + TRACK;
    }

    // limitar densidad con cap dinámico (⬇️ Optimización 2)
    let targets = allTargets;

    function computeCap(){
      const area = (W * H) / (1280 * 720);
      const base   = 820 * DENSITY;
      const varAdj = 260 * DENSITY * Math.log2(area + 1);
      let cap = Math.floor(base + varAdj);
      if (area > 2.2) cap = Math.floor(cap * 0.85);  // recorta un poco en áreas grandes
      cap = Math.min(cap, Math.floor(2000 * DENSITY));
      return Math.max(Math.floor(650 * DENSITY), cap);
    }

    const cap = computeCap();

    if (targets.length > cap){
      const ratio = targets.length / cap;
      const slim = [];
      for(let i = 0; i < targets.length; i += ratio){
        slim.push(targets[Math.floor(i)]);
      }
      targets = slim;
    }

    // origen anular (todos lados)
    pts = targets.map(t => {
      const ang = Math.random() * Math.PI * 2;
      const rad = Math.max(W, H) * (0.55 + Math.random()*0.35);
      const sx = Math.floor(W/2 + Math.cos(ang)*rad);
      const sy = Math.floor(H/2 + Math.sin(ang)*rad);
      return {
        x: sx, y: sy,
        tx: t.x, ty: t.y,
        vx: 0,  vy: 0,
        r: Math.random() * (1.2*DPR) + (0.7*DPR),
        li: t.li,
        seed: Math.random()*1000
      };
    });

    wordMinX = gMinX; wordMaxX = gMaxX; wordMinY = gMinY; wordMaxY = gMaxY;

    t0 = performance.now();
    phase = 'build';
  }

  // Brillo interno por partícula (⬇️ Optimización 3)
  function drawInternalGlow(progress, now){
    const p = easeInOutCubic(clamp01(progress));
    const baseFront = wordMinX + (wordMaxX - wordMinX) * p;

    // Escala por área para abaratar en pantallas grandes
    const area = (W * H) / (1280 * 720);

    // Parámetros del frente (ligeramente más austeros en áreas grandes)
    const spanBase = Math.max(60*DPR, (wordMaxX - wordMinX) * 0.10);
    const span  = spanBase / (area > 2.2 ? 1.15 : 1.0);
    const freqY = 0.012 * DPR;
    const ampX  = (area > 2.2 ? 11 : 14) * DPR;
    const noiseT= now * 0.0015;

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for(let i=0;i<pts.length;i++){
      const a = pts[i];

      // ⬇️ (Opcional) skipping ultra-ligero solo en áreas enormes
      // if (area > 2.8 && (i % 5 === 0)) continue;

      const wobble = Math.sin(a.ty * freqY + noiseT + a.seed*0.1) * ampX;
      const dx = (a.tx - (baseFront + wobble));
      const w = Math.exp(- (dx*dx) / (2*span*span));
      if (w > 0.02){
        // Alpha/blur más comedidos a pantalla grande
        const alphaMax = area > 2.2 ? 0.55 : 0.75;
        const blurMax  = area > 2.2 ? (18 * DPR) : (22 * DPR);

        const alpha = 0.10 + alphaMax * w;
        const blur  = (8 + blurMax * w);
        const rr    = a.r + (0.6 + 1.2*w) * DPR;

        ctx.shadowColor = `rgba(255,255,255,${alpha})`;
        ctx.shadowBlur  = blur;
        ctx.fillStyle   = `rgba(255,255,255,${alpha})`;

        ctx.beginPath();
        ctx.arc(a.tx, a.ty, rr, 0, Math.PI*2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  function tick(now){
    const elapsed = now - t0;

    // fondo negro
    ctx.fillStyle = '#000';
    ctx.fillRect(0,0,W,H);

    if(phase === 'build'){
      const p = clamp01(elapsed / BUILD_MS);
      const e = easeInOutCubic(p);

      // (OPTIMIZADO) batch draw durante build
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      for(let i=0;i<pts.length;i++){
        const a = pts[i];
        const dx = (a.tx - a.x);
        const dy = (a.ty - a.y);
        a.vx = a.vx*0.85 + dx*0.08*e;
        a.vy = a.vy*0.85 + dy*0.08*e;
        a.x += a.vx;
        a.y += a.vy;

        ctx.moveTo(a.x + a.r, a.y);
        ctx.arc(a.x, a.y, a.r, 0, Math.PI*2);
      }
      ctx.fill();

      if(elapsed >= BUILD_MS){
        phase = 'hold';
        t0 = now;
      }
    }
    else if(phase === 'hold'){
      drawWordParticles(); // ya optimizado
      if(elapsed >= HOLD_SOLID_MS){
        phase = 'shimmer';
        t0 = now;
      }
    }
    else if(phase === 'shimmer'){
      drawWordParticles();                // partículas formando la palabra
      drawInternalGlow(elapsed / SHIMMER_MS, now); // brillo interno fluido

      if(elapsed >= SHIMMER_MS){
        phase = 'fade';
        t0 = now;
        wrap.style.transition = `opacity ${FADE_MS}ms ease`;
        wrap.classList.add('hide');
      }
    }
    else if(phase === 'fade'){
      const k = clamp01(elapsed / FADE_MS);
      drawWordParticles(1 - k);
      if(elapsed >= FADE_MS){
        wrap.style.display = 'none';
        cancelAnimationFrame(rafId);
        return;
      }
    }

    rafId = requestAnimationFrame(tick);
  }

  // Inicializa
  window.addEventListener('resize', resize);
  resize();
  makeTargets();
  t0 = performance.now();
  rafId = requestAnimationFrame(tick);
})();





// Espera a que todo el HTML esté cargado
document.addEventListener('DOMContentLoaded', () => {

  /* ==================================================
     SCRIPT 1: ANIMACIÓN DE SCROLL (Intersection Observer)
     ================================================== */
  // (Este script funcionará para TUS .feat-card,
  // y también para la nueva .devices-section)
  
  // 1. Opciones para el observador
  const revealOptions = {
    root: null, // Observa en relación al viewport
    rootMargin: '0px',
    threshold: 0.1 // Se activa cuando el 10% del elemento es visible
  };

  // 2. La función que se ejecuta cuando el elemento entra/sale
  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Si el elemento es visible, añade la clase 'show'
        entry.target.classList.add('show');
        
        // (Opcional) Deja de observar este elemento una vez mostrado
        // para que no se repita la animación.
        // observer.unobserve(entry.target); 
      } else {
        // (Opcional) Si quieres que se oculte al salir, descomenta esto
        // entry.target.classList.remove('show');
      }
    });
  };

  // 3. Crear el observador
  const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

  // 4. Buscar todos los elementos .reveal y observarlos
  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach(el => {
    revealObserver.observe(el);
  });


  /* ==================================================
     SCRIPT 2: MOSTRAR/OCULTAR ICONOS DE DISPOSITIVOS
     ================================================== */
  
  // 1. Seleccionar el botón y el contenedor de iconos
  const devicesButton = document.getElementById('show-devices-btn');
  const devicesIcons = document.getElementById('devices-icons');

  // 2. Asegurarnos de que existen antes de añadir el evento
  if (devicesButton && devicesIcons) {
    
    // 3. Añadir el evento 'click' al botón
    devicesButton.addEventListener('click', () => {
      
      // Alterna (pone o quita) la clase 'show' en el contenedor
      devicesIcons.classList.toggle('show');

      // (Opcional) Cambia el texto del botón
      if (devicesIcons.classList.contains('show')) {
        devicesButton.textContent = 'Ocultar dispositivos';
      } else {
        devicesButton.textContent = 'Ver dispositivos compatibles';
      }
    });
  }

});


/* ==================================================
     SCRIPT 3: LÓGICA DEL ACORDEÓN DE FAQ
     ================================================== */
  
  // 1. Selecciona TODAS las preguntas
  const allFaqQuestions = document.querySelectorAll('.faq-question');

  // 2. Itera sobre cada botón de pregunta
  allFaqQuestions.forEach(button => {
    
    // 3. Añade un evento de 'click' a cada uno
    button.addEventListener('click', () => {
      
      // Selecciona el div de la respuesta (es el siguiente elemento)
      const answer = button.nextElementSibling;
      // Comprueba si la pregunta clickeada ya estaba activa
      const isActive = button.classList.contains('active');

      // Cierra todas las demás preguntas
      allFaqQuestions.forEach(otherButton => {
        if (otherButton !== button) {
          otherButton.classList.remove('active');
          otherButton.nextElementSibling.classList.remove('show');
        }
      });

      // Abre o cierra la pregunta actual
      // Si no estaba activa, la abre. Si ya estaba activa, el bucle anterior ya la cerró.
      if (!isActive) {
        button.classList.add('active');
        answer.classList.add('show');
      }
      
    });
  });



