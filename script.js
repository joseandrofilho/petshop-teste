const WHATSAPP_NUMBER = '558391667053';

document.querySelectorAll('[data-whatsapp]').forEach((link) => {
  const message = link.dataset.whatsapp || 'Olá! Gostaria de falar com a Pet Salon.';
  link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
});

document.getElementById('year').textContent = new Date().getFullYear();

const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const closeMenu = () => {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
  mobileNav.hidden = true;
};

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
  mobileNav.hidden = isOpen;
});
mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 820) closeMenu();
});
const scrollProgress = document.querySelector('.scroll-progress');
const updateScrollState = () => {
  header.classList.toggle('scrolled', window.scrollY > 16);
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress.style.transform = `scaleX(${maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0})`;
};
window.addEventListener('scroll', updateScrollState, { passive: true });
window.addEventListener('resize', updateScrollState);
window.addEventListener('load', updateScrollState);
updateScrollState();

const tabs = [...document.querySelectorAll('.service-tab')];
function activateTab(tab, moveFocus = false) {
  tabs.forEach((item) => {
    const selected = item === tab;
    item.classList.toggle('active', selected);
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    const panel = document.getElementById(item.getAttribute('aria-controls'));
    panel.hidden = !selected;
    panel.classList.toggle('active', selected);
  });
  if (moveFocus) tab.focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateTab(tab));
  tab.addEventListener('keydown', (event) => {
    let nextIndex;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = tabs.length - 1;
    if (nextIndex !== undefined) {
      event.preventDefault();
      activateTab(tabs[nextIndex], true);
    }
  });
});

const productCopy = {
  todos: [
    ['Opções de alimentação para consultar com a equipe.', 'Olá! Gostaria de consultar as rações disponíveis na loja.'],
    ['Ideias para transformar a rotina em brincadeira.', 'Olá! Gostaria de consultar os brinquedos disponíveis na loja.'],
    ['Detalhes para acompanhar cada passeio e momento.', 'Olá! Gostaria de consultar os acessórios disponíveis na loja.'],
    ['Itens para uma rotina de atenção e bem-estar.', 'Olá! Gostaria de consultar os produtos de higiene e cuidados disponíveis na loja.']
  ],
  cachorros: [
    ['Consulte opções de alimentação para seu cachorro.', 'Olá! Gostaria de consultar rações para cachorro.'],
    ['Consulte brinquedos para divertir seu cachorro.', 'Olá! Gostaria de consultar brinquedos para cachorro.'],
    ['Consulte acessórios para a rotina do seu cachorro.', 'Olá! Gostaria de consultar acessórios para cachorro.'],
    ['Consulte itens de higiene para seu cachorro.', 'Olá! Gostaria de consultar produtos de higiene para cachorro.']
  ],
  gatos: [
    ['Consulte opções de alimentação para seu gato.', 'Olá! Gostaria de consultar rações para gato.'],
    ['Consulte brinquedos para divertir seu gato.', 'Olá! Gostaria de consultar brinquedos para gato.'],
    ['Consulte acessórios para a rotina do seu gato.', 'Olá! Gostaria de consultar acessórios para gato.'],
    ['Consulte itens de higiene para seu gato.', 'Olá! Gostaria de consultar produtos de higiene para gato.']
  ]
};
const productCards = [...document.querySelectorAll('.product-card')];
document.querySelectorAll('.filter-button').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter-button').forEach((item) => {
      const selected = item === button;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    productCards.forEach((card, index) => {
      const [description, message] = productCopy[button.dataset.filter][index];
      card.querySelector('.product-info p').textContent = description;
      const link = card.querySelector('.product-link');
      link.dataset.whatsapp = message;
      link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    });
  });
});

const navLinks = [...document.querySelectorAll('.desktop-nav .nav-link')];
const sections = [...document.querySelectorAll('#inicio, #sobre, #servicos, #localizacao, #contato')];
if ('IntersectionObserver' in window) {
  const navObserver = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) navLinks.forEach((link) => link.classList.toggle('active', link.hash === `#${visible.target.id}`));
  }, { rootMargin: '-25% 0px -60% 0px' });
  sections.forEach((section) => navObserver.observe(section));
}

const reviewsTrack = document.querySelector('.reviews-track');
if (reviewsTrack) {
  const reviewArrows = [...document.querySelectorAll('.reviews-arrow')];
  const updateReviewArrows = () => {
    reviewArrows[0].disabled = reviewsTrack.scrollLeft <= 2;
    reviewArrows[1].disabled = reviewsTrack.scrollLeft + reviewsTrack.clientWidth >= reviewsTrack.scrollWidth - 2;
  };
  reviewArrows.forEach((arrow) => arrow.addEventListener('click', () => {
    const card = reviewsTrack.querySelector('.review-card');
    const gap = parseFloat(getComputedStyle(reviewsTrack).columnGap) || 0;
    const direction = arrow.dataset.reviewDirection === 'next' ? 1 : -1;
    reviewsTrack.scrollBy({
      left: direction * (card.getBoundingClientRect().width + gap),
      behavior: 'smooth'
    });
  }));
  reviewsTrack.addEventListener('scroll', updateReviewArrows, { passive: true });
  window.addEventListener('resize', updateReviewArrows);
  updateReviewArrows();
}

// Animate elements once as they enter the viewport. Content remains visible without JS.
if ('IntersectionObserver' in window && (!window.gsap || !window.ScrollTrigger)) {
  const revealGroups = [
    '.benefit-card', '.product-card', '.gallery-item', '.review-card'
  ];
  const revealTargets = document.querySelectorAll([
    '.section-intro', '.section-heading', '.about-photos', '.about-copy',
    '.service-tabs', '.filter-group', '.location-card', '.map-wrap',
    '.reviews-note', '.cta-copy', '.cta-art',
    ...revealGroups
  ].join(', '));

  revealGroups.forEach((selector) => {
    document.querySelectorAll(selector).forEach((item, index) => {
      item.style.setProperty('--reveal-delay', `${Math.min(index, 3) * 65}ms`);
    });
  });

  revealTargets.forEach((item) => item.classList.add('reveal'));
  document.documentElement.classList.add('motion-ready');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.08 });

  revealTargets.forEach((item) => revealObserver.observe(item));
}
