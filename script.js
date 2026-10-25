/* Progressive enhancement: navigation, project content and CV work without JS. */
'use strict';
document.documentElement.classList.add('js');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
const mobileViewport = window.matchMedia('(max-width: 800px)');
function setMenu(open, returnFocus = false) {
  navigation.classList.toggle('is-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.innerHTML = `${open ? 'Close' : 'Menu'} <span aria-hidden="true">${open ? '−' : '+'}</span>`;
  if (returnFocus) menuButton.focus();
}
function syncNavigation() {
  menuButton.hidden = !mobileViewport.matches;
  setMenu(false);
}
syncNavigation();
mobileViewport.addEventListener('change', syncNavigation);
menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
navigation.addEventListener('click', (event) => {
  const link = event.target.closest('a');
  if (!link) return;
  setMenu(false);
  // Move keyboard focus to the destination rather than leaving it in a hidden menu.
  if (mobileViewport.matches && link.hash) {
    const section = document.querySelector(link.hash);
    if (section) {
      section.setAttribute('tabindex', '-1');
      section.focus({ preventScroll: true });
    }
  }
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navigation.classList.contains('is-open')) setMenu(false, true);
});
document.addEventListener('click', (event) => {
  if (!event.target.closest('.site-header')) setMenu(false);
});
const filters = document.querySelector('.filters');
const cards = [...document.querySelectorAll('.project-card')];
filters.hidden = false;
filters.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-filter]');
  if (!button) return;
  filters.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  cards.forEach(card => { card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter; });
  const count = cards.filter(card => !card.hidden).length;
  document.querySelector('#project-count').textContent = `${count} project${count === 1 ? '' : 's'}`;
});
// Native anchor navigation retains URL fragments and respects CSS reduced motion.

/* Accessible, manually paced demonstrations. No client data is simulated. */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
document.querySelectorAll('.project-card').forEach((card) => {
  const toggle = card.querySelector('.demo-toggle');
  const demo = card.querySelector('.project-demo');
  const steps = [...demo.querySelectorAll('.demo-flow li')];
  const next = demo.querySelector('[data-demo-next]');
  const reset = demo.querySelector('[data-demo-reset]');
  const status = demo.querySelector('.demo-status');
  let current = -1;
  const showStep = (index) => {
    current = index;
    steps.forEach((step, i) => {
      step.classList.toggle('is-active', i === current);
      step.classList.toggle('is-complete', i < current);
    });
    status.textContent = current < 0 ? 'Ready to explore' : current === steps.length - 1 ? 'Workflow complete' : 'Step ' + (current + 1) + ' of ' + steps.length;
    next.disabled = current === steps.length - 1;
    next.textContent = current === steps.length - 1 ? 'Complete' : 'Next step';
  };
  toggle.addEventListener('click', () => {
    const open = demo.hidden;
    demo.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.firstChild.textContent = open ? 'Hide workflow ' : 'Explore animated workflow ';
    if (open) showStep(-1);
  });
  next.addEventListener('click', () => showStep(Math.min(steps.length - 1, current + 1)));
  reset.addEventListener('click', () => showStep(-1));
});
/* IntersectionObserver never conceals meaningful content when unsupported. */
if ('IntersectionObserver' in window && !reduceMotion.matches) {
  const targets = [...document.querySelectorAll('.project-card, .section-heading, .hero-summary')];
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove('motion-pending');
      entry.target.classList.add('motion-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
  targets.forEach(target => {
    target.classList.add('motion-reveal');
    if (target.getBoundingClientRect().top > window.innerHeight) {
      target.classList.add('motion-pending');
      observer.observe(target);
    } else target.classList.add('motion-visible');
  });
}
