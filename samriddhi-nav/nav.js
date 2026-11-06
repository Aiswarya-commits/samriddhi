/* ===== Samriddhi fixed transparent navbar (all pages) ===== */
(function () {
  /* ---- EDIT LINKS HERE ---- */
  var LOGO_LINK = "/";
  var QUOTE = { text: "Request a Quote", url: "/contact" };
  var MENU = [
    { title: "About Samriddhi", items: [
      ["About Samriddhi", "/solutions/nature-based"],
      ["Quality & Compliance", "/solutions/supply-chain"],
      ["Sustainability", "/our-tech/amrv"] ] },
    { title: "Products", items: [
      ["Cereals & Grains", "/products/cereals.html"],
      ["Oilseeds", "/products/oilseeds.html"],
      ["Pulses", "/products/pulses.html"],
      ["Cotton", "/products/cotton.html"],
      ["Spices & Dry Fruits", "/products/spices.html"],
      ["Flour & Processed", "/products/flour.html"] ] },
    { title: "What We Do", items: [
      ["What We Do", "/our-company"],
      ["Our Supply Chain", "/our-tech/blockchain"],
      ["Markets", "/resources/case-studies/scaling-alethias-intelligence-with-ai"] ] },
    { title: "Markets", items: [
      ["Market Intelligence", "/resources/news-and-media"],
      ["For Buyers", "/resources/research-and-insights"],
      ["For Suppliers", "/resources/case-studies"],
      ["Insights", "/resources/research-and-insights/alethias-atmospheric-based-measurement-reporting-and-verification-approach"],
      ["Trade Stories / Case Studies", "/resources/case-studies/turning-regenerative-ag-into-verified-climate-performance"] ] }
  ];
  /* ------------------------- */

  var isProductPage = /^\/products\//.test(location.pathname);
  function norm(u) { return (u || '/').replace(/\/+$/, '') || '/'; }
  function isFramerRoute(u) { return u.charAt(0) === '/' && !/^\/products\//.test(u) && !/\.[a-z0-9]+$/i.test(u); }

  /* Framer switches pages inside the browser. Clicking one of its own links does that. */
  function framerLink(path) {
    var want = norm(path);
    var as = document.querySelectorAll('#main a[href]');
    for (var i = 0; i < as.length; i++) {
      var h = as[i].getAttribute('href') || '';
      var p; try { var U = new URL(h, location.href); if (U.origin !== location.origin) continue; p = norm(U.pathname); } catch (err) { continue; }
      if (p !== want) continue;
      if (as[i].getClientRects().length) return as[i];   /* prefer a live (rendered) Framer link */
    }
    return null;   /* hidden Framer links don't switch pages: fall back to a normal page load */
  }

  /* ---- smooth page transition: cover, switch, jump to top, wait until settled, reveal ---- */
  var curtain = null, busyNav = false;
  function getCurtain() {
    if (curtain && curtain.isConnected) return curtain;
    curtain = document.createElement('div');
    curtain.id = 'sn-curtain';
    curtain.innerHTML = '<img src="/samriddhi-nav/logo.png" alt="">';
    document.body.appendChild(curtain);
    return curtain;
  }
  function toTop() {
    try { window.scrollTo(0, 0); document.documentElement.scrollTop = 0; document.body.scrollTop = 0; } catch (e) {}
    var l = window.lenis || window.__lenis; if (l && l.scrollTo) l.scrollTo(0, { immediate: true, force: true });
  }
  function coverThen(action, keepTop) {
    if (busyNav) return; busyNav = true;
    var c = getCurtain();
    c.classList.add('on');
    setTimeout(function () {
      action();
      var t0 = performance.now(), still = 0, lastH = -1;
      (function settle() {
        if (keepTop) toTop();
        var h = document.documentElement.scrollHeight, y = window.scrollY;
        still = (Math.abs(h - lastH) < 2 && (!keepTop || y < 2)) ? still + 1 : 0; lastH = h;
        var t = performance.now() - t0;
        if ((t > 650 && still > 8) || t > 2600) {              /* page has stopped changing */
          if (keepTop) toTop();
          c.classList.remove('on'); busyNav = false; setTimeout(mark, 50);
        } else requestAnimationFrame(settle);
      })();
    }, 260);
  }
  function go(path) {
    var here = norm(location.pathname);
    if (isProductPage || !isFramerRoute(path)) { getCurtain().classList.add('on'); setTimeout(function () { location.href = path; }, 250); return; }
    if (norm(path) === here) { var l0 = window.lenis || window.__lenis; if (l0 && l0.scrollTo) l0.scrollTo(0); else window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    var a = framerLink(path);
    if (a) coverThen(function () { a.click(); toTop(); }, true);
    else { getCurtain().classList.add('on'); setTimeout(function () { location.href = path; }, 250); }
  }

  var nav;
  function mark() {
    if (!nav) return;
    var here = norm(location.pathname);
    nav.querySelectorAll('.sn-dd').forEach(function (dd) {
      var cur = false;
      dd.querySelectorAll('a').forEach(function (a) { var on = norm(a.getAttribute('href')) === here; a.classList.toggle('cur', on); cur = cur || on; });
      dd.classList.toggle('cur', cur);
    });
  }

  function build() {
    if (document.getElementById('snav')) return;
    nav = document.createElement('header');
    nav.id = 'snav';
    var menu = MENU.map(function (g) {
      return '<div class="sn-dd"><button class="sn-top" type="button">' + g.title + '<i class="sn-chev"></i></button><div class="sn-panel">' +
        g.items.map(function (it) { return '<a href="' + it[1] + '">' + it[0].replace('&', '&amp;') + '</a>'; }).join('') + '</div></div>';
    }).join('');
    nav.innerHTML = '<div class="sn-in"><a class="sn-logo" href="' + LOGO_LINK + '"><img src="/samriddhi-nav/logo.png" alt="Samriddhi Agro Trading and Exim LLP"></a>' +
      '<nav class="sn-menu">' + menu + '<a class="sn-cta sn-cta-m" href="' + QUOTE.url + '">' + QUOTE.text + '</a></nav>' +
      '<a class="sn-cta" href="' + QUOTE.url + '">' + QUOTE.text + '</a>' +
      '<button class="sn-burger" type="button" aria-label="Menu"><span></span><span></span><span></span></button></div>';
    document.body.appendChild(nav);
    mark();
    nav.addEventListener('click', function (e) {
      var a = e.target.closest('a[href]');
      if (a) {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        nav.classList.remove('mopen'); nav.querySelectorAll('.sn-dd.open').forEach(function (o) { o.classList.remove('open'); });
        go(a.getAttribute('href'));
        return;
      }
      var top = e.target.closest('.sn-top');
      if (top) {
        var dd = top.parentNode, was = dd.classList.contains('open');
        nav.querySelectorAll('.sn-dd.open').forEach(function (o) { o.classList.remove('open'); });
        if (!was) dd.classList.add('open');
      }
      if (e.target.closest('.sn-burger')) nav.classList.toggle('mopen');
    });
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target)) { nav.classList.remove('mopen'); nav.querySelectorAll('.sn-dd.open').forEach(function (o) { o.classList.remove('open'); }); }
    });
  }

  /* ---- transparent bar: dark text on light pages, white text over dark images/videos ---- */
  function isDarkAt(x, y) {
    var els = document.elementsFromPoint(x, y);
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (nav && nav.contains(el)) continue;
      var t = el.tagName;
      if (t === 'VIDEO' || t === 'CANVAS' || t === 'IMG') return true;
      var cs = getComputedStyle(el);
      if (cs.backgroundImage && cs.backgroundImage !== 'none' && cs.backgroundImage.indexOf('gradient') < 0) return true;
      var m = cs.backgroundColor.match(/[\d.]+/g);
      if (m && (m.length < 4 || parseFloat(m[3]) > 0.5)) {
        var l = 0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2];
        return l < 140;
      }
    }
    return false;
  }
  var tick = 0;
  function frame() {
    if (nav) {
      var y = window.scrollY || document.documentElement.scrollTop || 0;
      nav.classList.toggle('scrolled', y > 20);
      if ((tick++ % 24) === 0 && Math.abs(y - (frame._y || -1)) > 2 || tick === 1) {   /* re-check what's behind the bar only after scrolling */
        frame._y = y;
        var h = nav.offsetHeight + 6;
        var d = 0; [0.3, 0.7].forEach(function (f) { if (isDarkAt(window.innerWidth * f, h)) d++; });
        nav.classList.toggle('dark', d >= 1);
      }
    }
    requestAnimationFrame(frame);
  }

  /* ---- opening a sub-page directly (or refreshing it): let Framer show the right page ---- */
  function fixDirectLoad() {
    var path = norm(location.pathname);
    if (isProductPage || path === '/' || !isFramerRoute(path)) return;
    var tries = 0;
    (function wait() {
      var a = framerLink(path);
      var home = document.querySelector('[data-framer-name="Hero c ov"]');     /* home page content is showing */
      if (a && home) {
        history.replaceState(history.state, '', '/');
        getCurtain().classList.add('on', 'instant');
        busyNav = false;
        coverThen(function () { var b = framerLink(path); if (b) b.click(); toTop(); }, true);
        setTimeout(function () { curtain && curtain.classList.remove('instant'); }, 50);
      } else if (!home && tries > 4) { return; }
      else if (tries++ < 80) setTimeout(wait, 150);
    })();
  }

  function start() { build(); requestAnimationFrame(frame); fixDirectLoad(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
  new MutationObserver(function () { if (!document.getElementById('snav') && document.body) { nav = null; build(); } }).observe(document.body || document.documentElement, { childList: true });
  window.addEventListener('popstate', function () {
    if (isProductPage) return;
    var c = getCurtain(); c.classList.add('on', 'instant'); busyNav = false;
    coverThen(function () {}, false);
    setTimeout(function () { c.classList.remove('instant'); }, 30);
  });
  /* back from a product page (page restored from cache): make sure nothing stays covered */
  window.addEventListener('pageshow', function () { if (curtain) curtain.classList.remove('on'); busyNav = false; });
})();