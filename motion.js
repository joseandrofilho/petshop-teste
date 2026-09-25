// GSAP is optional: the page and its controls still work if the local scripts are unavailable.
(() => {
  const gsap = window.gsap;
  const scrollTrigger = window.ScrollTrigger;
  if (!gsap || !scrollTrigger) return;

  const scrollSmoother = window.ScrollSmoother;
  const drawSVG = window.DrawSVGPlugin;
  const textPlugin = window.TextPlugin;

  [scrollTrigger, scrollSmoother, drawSVG, textPlugin]
    .filter(Boolean)
    .forEach((plugin) => gsap.registerPlugin(plugin));

  // The header and floating WhatsApp button stay outside the transformed content.
  if (scrollTrigger && scrollSmoother) {
    gsap.matchMedia().add('(min-width: 821px)', () => {
      const smoother = scrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        smooth: 1.15,
        smoothTouch: 0,
        effects: false
      });
      return () => smoother.kill();
    });

    const scrollToSection = (hash, smooth = true) => {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      const smoother = scrollSmoother.get();
      if (!target || !smoother) return false;
      const headerHeight = document.querySelector('.site-header').offsetHeight;
      smoother.scrollTo(target, smooth, `top ${headerHeight + 12}px`);
      return true;
    };

    document.addEventListener('click', (event) => {
      const link = event.target.closest('a[href^="#"]');
      if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const hash = link.getAttribute('href');
      if (!hash || hash === '#' || !scrollToSection(hash)) return;
      event.preventDefault();
      if (location.hash !== hash) history.pushState(null, '', hash);
      if (link.classList.contains('skip-link')) document.getElementById('conteudo').focus({ preventScroll: true });
    });

    window.addEventListener('hashchange', () => {
      if (location.hash) scrollToSection(location.hash, false);
    });
    window.addEventListener('load', () => {
      if (location.hash) scrollToSection(location.hash, false);
    });
  }

  const hero = gsap.timeline({ defaults: { ease: 'power3.out' } });
  hero
    .from('.hero-copy > .eyebrow', { y: 18, autoAlpha: 0, duration: 0.6 })
    .from('.hero h1', { y: 32, autoAlpha: 0, duration: 0.8 }, '-=0.35')
    .from('.hero-copy > p', { y: 20, autoAlpha: 0, duration: 0.65 }, '-=0.5')
    .from('.hero-actions', { y: 20, autoAlpha: 0, duration: 0.65 }, '-=0.42')
    .from('.hero-note', { y: 15, autoAlpha: 0, duration: 0.6 }, '-=0.35')
    .from('.hero-orbit', { scale: 0.88, rotation: -9, autoAlpha: 0, duration: 1.05 }, 0.18)
    .from('.hero-image-wrap', { scale: 0.92, y: 22, autoAlpha: 0, duration: 1.05 }, 0.38)
    .from('.hero-sticker', { scale: 0.55, rotation: -28, autoAlpha: 0, duration: 0.65, ease: 'back.out(1.7)' }, 0.95)
    .from('.hero-star', { scale: 0, autoAlpha: 0, duration: 0.5, stagger: 0.18, ease: 'back.out(2)' }, 1.05);

  if (drawSVG) {
    hero.fromTo('.hero-trail-line', { drawSVG: '0%' }, {
      drawSVG: '100%', duration: 1.65, ease: 'power2.inOut'
    }, 0.45);
  }

  if (textPlugin) {
    const note = document.querySelector('.hero-note-animated');
    const phrases = ['de carinho de verdade.', 'de atenção só dele.', 'de cuidado especial.'];
    const words = gsap.timeline({ repeat: -1, delay: 3.4, repeatDelay: 1.2 });
    phrases.forEach((phrase) => {
      words.to(note, { duration: 1.1, text: { value: phrase }, ease: 'none' });
      words.to({}, { duration: 2.2 });
    });
  }

  const reveal = (selector, trigger, options = {}) => {
    const elements = gsap.utils.toArray(selector);
    if (!elements.length) return;
    gsap.from(elements, {
      y: options.y ?? 28,
      autoAlpha: 0,
      duration: options.duration ?? 0.8,
      stagger: options.stagger ?? 0.1,
      ease: 'power2.out',
      clearProps: 'transform,opacity,visibility',
      scrollTrigger: { trigger, start: 'top 83%', once: true }
    });
  };

  // A restrained, section-by-section rhythm follows the site's editorial layout.
  document.querySelectorAll('.section-intro, .section-heading, .reviews-header').forEach((heading) => {
    reveal(heading, heading, { y: 24, duration: 0.75 });
  });
  reveal('.benefit-card', '.benefits-grid', { stagger: 0.13 });
  reveal('.about-photos', '.about-grid', { y: 38, duration: 1 });
  reveal('.about-copy > :not(.about-decoration)', '.about-copy', { stagger: 0.08 });
  reveal('.service-tabs', '.service-tabs');
  reveal('.service-panel.active', '.service-tabs', { y: 35, duration: 0.95 });
  reveal('.filter-group', '.filter-group');
  reveal('.product-card', '.product-grid', { stagger: 0.12 });
  reveal('.gallery-item', '.gallery-grid', { stagger: 0.12, y: 36 });
  reveal('.location-card, .map-wrap', '.location-grid', { stagger: 0.17 });
  reveal('.review-card', '.reviews-track', { stagger: 0.12 });
  reveal('.reviews-note', '.reviews-note');
  reveal('.cta-copy > *', '.final-cta', { stagger: 0.1 });
  reveal('.cta-art', '.final-cta', { y: 42, duration: 1 });

  gsap.to('.hero-star-one', {
    y: 45, rotation: 40, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });
  gsap.to('.hero-star-two', {
    y: -35, rotation: -35, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });
  gsap.to('.about-decoration', {
    y: -65, rotation: 24, ease: 'none',
    scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: true }
  });

  // Each service opens like a fresh portrait while its controls remain native.
  const animateActiveService = () => {
    const panel = document.querySelector('.service-panel.active');
    if (!panel) return;
    gsap.fromTo(panel.querySelector('.service-image'),
      { x: -24, autoAlpha: 0.5 },
      { x: 0, autoAlpha: 1, duration: 0.55, ease: 'power2.out', clearProps: 'transform,opacity,visibility' });
    gsap.fromTo(panel.querySelectorAll('.service-content > *'),
      { y: 14, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.045, ease: 'power2.out', clearProps: 'transform,opacity,visibility' });
    scrollTrigger.refresh();
  };

  // Tabs change the panel height; refresh the scroll measurements afterwards.
  document.querySelectorAll('.service-tab').forEach((tab) => {
    tab.addEventListener('click', () => requestAnimationFrame(animateActiveService));
    tab.addEventListener('keydown', (event) => {
      if (['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) {
        requestAnimationFrame(animateActiveService);
      }
    });
  });
  window.addEventListener('load', () => scrollTrigger.refresh(), { once: true });
})();
