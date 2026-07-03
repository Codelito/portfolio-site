(function () {
  var root = document.documentElement;
  root.classList.add('js');

  var reduce = window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- header shadow once the page is scrolled --- */
  var bar = document.querySelector('header.bar');
  if (bar) {
    var onScroll = function () {
      bar.classList.toggle('scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* --- mobile hamburger menu --- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      nav.classList.toggle('open', open);
    };
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    // close when a link is chosen
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') setOpen(false);
    });
    // close when tapping outside
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('open')
          && !nav.contains(e.target) && e.target !== toggle) {
        setOpen(false);
      }
    });
    // close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
    // reset when growing back to desktop
    var wide = window.matchMedia('(min-width:721px)');
    var onWide = function (m) { if (m.matches) setOpen(false); };
    if (wide.addEventListener) wide.addEventListener('change', onWide);
    else if (wide.addListener) wide.addListener(onWide);
  }

  /* --- reveal on scroll --- */
  var reveals = document.querySelectorAll('.reveal');
  var notes = document.querySelectorAll('.note');

  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
    notes.forEach(function (el) { el.classList.add('in'); });
    return;
  }

  // gentle stagger for children inside a .stagger container
  document.querySelectorAll('.stagger').forEach(function (group) {
    group.querySelectorAll('.reveal').forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i, 6) * 70 + 'ms';
    });
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });

  reveals.forEach(function (el) { io.observe(el); });
  notes.forEach(function (el) { io.observe(el); });
})();
