/* =========================================================
   Samriddhi — product pages (shared behaviour)
   ========================================================= */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var body = document.body;
  var curtain = document.querySelector('.sp-curtain');

  /* ---------- page enter ---------- */
  function ready() { requestAnimationFrame(function () { body.classList.add('is-ready'); }); }
  var came = false;
  try { came = sessionStorage.getItem('spTransition') === '1'; sessionStorage.removeItem('spTransition'); } catch (e) {}
  if (came && curtain && !reduce) {
    curtain.classList.add('off');
    setTimeout(ready, 250);
    setTimeout(function () { curtain.classList.remove('off'); }, 1100);
  } else { ready(); }
  window.addEventListener('pageshow', function (e) { if (e.persisted && curtain) { curtain.className = 'sp-curtain'; ready(); } });

  /* ---------- page leave (circle curtain from the click point) ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[data-go]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
    if (reduce || !curtain) return;
    e.preventDefault();
    curtain.style.setProperty('--cx', e.clientX + 'px');
    curtain.style.setProperty('--cy', e.clientY + 'px');
    var b = curtain.querySelector('b'); if (b) b.textContent = a.getAttribute('data-go') || '';
    curtain.className = 'sp-curtain on';
    try { sessionStorage.setItem('spTransition', '1'); } catch (err) {}
    setTimeout(function () { location.href = a.href; }, 650);
  });

  /* ---------- header ---------- */
  var header = document.querySelector('.sp-header'), lastY = 0;
  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    if (header) header.classList.toggle('is-hidden', y > 300 && y > lastY);
    lastY = y;
  }, { passive: true });
  var burger = document.querySelector('.sp-burger'), nav = document.querySelector('.sp-nav');
  if (burger && nav) burger.addEventListener('click', function () { nav.classList.toggle('open'); });

  /* ---------- hero: 3D card follows pointer + scroll ---------- */
  var stage = document.querySelector('.sp-stage'), card = document.querySelector('.sp-card3d');
  var bignum = document.querySelector('.sp-bignum'), hero = document.querySelector('.sp-hero');
  var mx = 0, my = 0, tx = 0, ty = 0;
  if (stage && card && !reduce) {
    window.addEventListener('pointermove', function (e) {
      mx = (e.clientX / window.innerWidth) * 2 - 1;
      my = (e.clientY / window.innerHeight) * 2 - 1;
      var r = card.getBoundingClientRect();
      card.style.setProperty('--gx', ((e.clientX - r.left) / r.width * 100) + '%');
      card.style.setProperty('--gy', ((e.clientY - r.top) / r.height * 100) + '%');
    });
    (function tick() {
      tx += (mx - tx) * 0.08; ty += (my - ty) * 0.08;
      var h = hero ? hero.offsetHeight : window.innerHeight;
      var p = Math.min(Math.max(window.scrollY / h, 0), 1);       /* 0..1 while the hero scrolls away */
      var rotY = -14 * (1 - p) + tx * 12;
      var rotX = 7 * (1 - p) - ty * 10 + p * 18;
      var z = p * 160, s = 1 + p * 0.08;
      card.style.transform = 'translate3d(0,' + (p * -40).toFixed(1) + 'px,' + z.toFixed(1) + 'px) rotateY(' + rotY.toFixed(2) + 'deg) rotateX(' + rotX.toFixed(2) + 'deg) scale(' + s.toFixed(3) + ')';
      if (bignum) bignum.style.transform = 'translate3d(' + (tx * -20).toFixed(1) + 'px,' + (p * 120 + ty * -14).toFixed(1) + 'px,0)';
      requestAnimationFrame(tick);
    })();
  }

  /* ---------- hero particles (grain / seed / fibre themed) ---------- */
  var cv = document.querySelector('.sp-particles');
  if (cv && !reduce) {
    var ctx = cv.getContext('2d'), dpr = Math.min(window.devicePixelRatio || 1, 2), W, H, parts = [];
    var kind = body.getAttribute('data-particles') || 'grain';
    var palette = (body.getAttribute('data-palette') || '#D9A441,#E8C36A,#B9852B').split(',');
    function size() { W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    size(); window.addEventListener('resize', size);
    var N = window.innerWidth < 760 ? 34 : 70;
    for (var i = 0; i < N; i++) parts.push({ x: Math.random(), y: Math.random(), z: Math.random(), r: Math.random() * Math.PI, vr: (Math.random() - .5) * .01, vy: .00025 + Math.random() * .0006, c: palette[i % palette.length] });
    (function draw() {
      ctx.clearRect(0, 0, W, H);
      var sy = window.scrollY;
      parts.sort(function (a, b) { return a.z - b.z; });
      for (var k = 0; k < parts.length; k++) {
        var q = parts[k];
        q.y -= q.vy * (0.5 + q.z); q.r += q.vr;
        if (q.y < -0.05) { q.y = 1.05; q.x = Math.random(); }
        var depth = 0.35 + q.z * 0.9;
        var px = q.x * W + tx * 40 * depth, py = q.y * H + ty * 30 * depth - sy * 0.25 * depth;
        var sz = (kind === 'dust' ? 2.2 : kind === 'fluff' ? 7 : 4.2) * depth;
        ctx.save(); ctx.translate(px, py); ctx.rotate(q.r);
        ctx.globalAlpha = 0.25 + q.z * 0.55;
        ctx.fillStyle = q.c;
        ctx.beginPath();
        if (kind === 'round') ctx.arc(0, 0, sz * 1.1, 0, Math.PI * 2);
        else if (kind === 'fluff') { ctx.shadowColor = q.c; ctx.shadowBlur = 12 * depth; ctx.arc(0, 0, sz, 0, Math.PI * 2); }
        else if (kind === 'dust') { ctx.shadowColor = q.c; ctx.shadowBlur = 6; ctx.arc(0, 0, sz, 0, Math.PI * 2); }
        else ctx.ellipse(0, 0, sz * 1.9, sz, 0, 0, Math.PI * 2);
        ctx.fill(); ctx.restore();
      }
      requestAnimationFrame(draw);
    })();
  }

  /* ---------- reveal on scroll ---------- */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (ents) {
    ents.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' }) : null;
  document.querySelectorAll('[data-reveal], .sp-term').forEach(function (el, i) {
    var d = el.getAttribute('data-delay'); if (d) el.style.transitionDelay = d + 's';
    if (io) io.observe(el); else el.classList.add('in');
  });

  /* ---------- flip cards: tap to flip on touch ---------- */
  document.querySelectorAll('.sp-flip').forEach(function (f) {
    f.addEventListener('click', function (e) { if (e.target.closest('a')) return; f.classList.toggle('flipped'); });
    f.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); f.classList.toggle('flipped'); } });
  });

  /* ---------- process line draws with scroll ---------- */
  var proc = document.querySelector('.sp-process');
  if (proc) {
    var steps = proc.querySelectorAll('.sp-step');
    var onScroll = function () {
      var r = proc.getBoundingClientRect(), vh = window.innerHeight;
      var p = Math.min(Math.max((vh * 0.85 - r.top) / (r.height + vh * 0.35), 0), 1);
      proc.style.setProperty('--p', p.toFixed(3));
      steps.forEach(function (s, i) { s.classList.toggle('on', p >= (i + 0.3) / steps.length || window.innerWidth <= 980 && s.getBoundingClientRect().top < vh * 0.8); });
    };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  /* ---------- 3D coverflow of the other commodities ---------- */
  var flow = document.querySelector('.sp-flow');
  if (flow) {
    var items = Array.prototype.slice.call(flow.querySelectorAll('.sp-flow-item')), cur = Math.floor(items.length / 2);
    var layout = function () {
      var mob = window.innerWidth < 760, gap = mob ? 150 : 250;
      items.forEach(function (it, i) {
        var d = i - cur, ad = Math.abs(d);
        it.style.transform = 'translateX(' + (d * gap) + 'px) translateZ(' + (-ad * 160) + 'px) rotateY(' + (d * -32) + 'deg)';
        it.style.zIndex = 10 - ad;
        it.style.opacity = ad > 2 ? 0 : 1 - ad * 0.18;
        it.style.filter = ad ? 'brightness(.78)' : 'none';
        it.setAttribute('aria-current', ad === 0 ? 'true' : 'false');
      });
    };
    var go = function (n) { cur = (n + items.length) % items.length; layout(); };
    items.forEach(function (it, i) {
      it.addEventListener('click', function (e) { if (i !== cur) { e.preventDefault(); e.stopPropagation(); go(i); } }, true);
    });
    var prev = document.querySelector('[data-flow="prev"]'), next = document.querySelector('[data-flow="next"]');
    if (prev) prev.addEventListener('click', function () { go(cur - 1); });
    if (next) next.addEventListener('click', function () { go(cur + 1); });
    var sx = null;
    flow.addEventListener('pointerdown', function (e) { sx = e.clientX; });
    flow.addEventListener('pointerup', function (e) { if (sx === null) return; var dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1)); });
    window.addEventListener('resize', layout); layout();
  }
})();