(() => {
  'use strict';

  // Year
  const y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();

  // Sticky nav shadow
  const nav = document.querySelector('[data-nav]');
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu toggle
  const navToggle = document.querySelector('[data-nav-toggle]');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    navLinks.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Reveal on scroll
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = document.querySelectorAll('[data-reveal]');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(el => io.observe(el));
  }

  // Before/After Sliders
  const sliders = document.querySelectorAll('[data-slider]');
  sliders.forEach(initSlider);

  function initSlider(slider) {
    const handle = slider.querySelector('.slider-handle');
    let pos = parseFloat(slider.dataset.pos || '50');
    let dragging = false;
    let rafId = null;
    let pendingPos = pos;

    const apply = (p) => {
      slider.style.setProperty('--pos', p + '%');
    };
    apply(pos);

    const setPos = (clientX) => {
      const rect = slider.getBoundingClientRect();
      const x = clientX - rect.left;
      let p = (x / rect.width) * 100;
      p = Math.max(0, Math.min(100, p));
      pendingPos = p;
      if (rafId == null) {
        rafId = requestAnimationFrame(() => {
          apply(pendingPos);
          pos = pendingPos;
          rafId = null;
        });
      }
    };

    const onDown = (e) => {
      dragging = true;
      slider.classList.add('dragging');
      slider.setPointerCapture(e.pointerId);
      setPos(e.clientX);
      e.preventDefault();
    };
    const onMove = (e) => {
      if (!dragging) return;
      setPos(e.clientX);
    };
    const onUp = (e) => {
      if (!dragging) return;
      dragging = false;
      slider.classList.remove('dragging');
      try { slider.releasePointerCapture(e.pointerId); } catch (_) {}
    };

    slider.addEventListener('pointerdown', onDown);
    slider.addEventListener('pointermove', onMove);
    slider.addEventListener('pointerup', onUp);
    slider.addEventListener('pointercancel', onUp);
    slider.addEventListener('pointerleave', onUp);

    // Click to jump (when not dragging on handle)
    slider.addEventListener('click', (e) => {
      if (e.target.closest('.slider-handle')) return;
      setPos(e.clientX);
    });

    // Keyboard
    handle.addEventListener('keydown', (e) => {
      const step = e.shiftKey ? 10 : 4;
      if (e.key === 'ArrowLeft') { pos = Math.max(0, pos - step); apply(pos); e.preventDefault(); }
      else if (e.key === 'ArrowRight') { pos = Math.min(100, pos + step); apply(pos); e.preventDefault(); }
      else if (e.key === 'Home') { pos = 0; apply(pos); e.preventDefault(); }
      else if (e.key === 'End') { pos = 100; apply(pos); e.preventDefault(); }
    });
  }

  // Contact form (Netlify)
  const form = document.querySelector('[data-form]');
  const status = document.querySelector('[data-form-status]');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (status) { status.textContent = ''; status.classList.remove('error', 'success'); }
      form.classList.add('sending');

      const data = new FormData(form);
      const body = new URLSearchParams();
      for (const [k, v] of data.entries()) body.append(k, v);

      try {
        const res = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: body.toString(),
        });
        if (!res.ok) throw new Error('Network');
        form.classList.remove('sending');
        form.classList.add('sent');
        form.reset();
        if (status) {
          status.textContent = 'Thanks. We will get back to you shortly.';
          status.classList.add('success');
        }
      } catch (err) {
        form.classList.remove('sending');
        if (status) {
          status.textContent = 'Something went wrong. Call (828) 544-2797 or email us directly.';
          status.classList.add('error');
        }
      }
    });
  }
})();
