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

/* Each exhibit runs once on entry; replay/pause is explicit and independent. */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const sceneControllers = [];
const messages = {
 automation: ['Source files received', 'Quality checks complete', 'Request assigned to the team', 'Report ready for review'],
 analytics: ['Reading opening balances', 'Applying journal movements', 'Comparing closing balances', 'Two account-level exceptions identified'],
 transformation: ['Finance connected', 'Customer workflows connected', 'People processes connected', 'Inventory connected · ready for adoption']
};
document.querySelectorAll('.project-feature').forEach(card => {
 const stage = card.querySelector('.project-stage');
 const button = card.querySelector('.scene-play');
 const status = card.querySelector('[data-scene-status]');
 let step = -1, timer = null, started = false;
 const label = text => { button.textContent = text; button.setAttribute('aria-label', `${text}: ${card.dataset.category}`); };
 const pause = () => { clearTimeout(timer); timer = null; stage.classList.remove('is-playing'); label(step === 3 ? 'Replay animation ↻' : 'Play animation ↗'); };
 const render = () => {
  stage.dataset.phase = String(step);
  stage.querySelectorAll('[data-phase]').forEach(node => node.classList.toggle('is-connected', Number(node.dataset.phase) <= step));
  status.textContent = messages[card.dataset.category][step];
 };
 const tick = () => {
  step++; render();
  if (step < 3) timer = setTimeout(tick, 1800); else pause();
 };
 const play = () => {
  if (timer !== null) { pause(); return; }
  started = true;
  if (reduceMotion.matches) { step = 3; render(); pause(); return; }
  if (step === 3) { step = -1; stage.dataset.phase = '-1'; }
  stage.classList.add('is-playing'); label('Pause animation Ⅱ'); tick();
 };
 button.hidden = false;
 button.addEventListener('click', play);
 sceneControllers.push({card, pause});
 if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
   if (entry.isIntersecting && !started && !reduceMotion.matches) play();
   else if (!entry.isIntersecting) pause();
  }), {threshold: .35}); observer.observe(stage);
 }
 reduceMotion.addEventListener('change', () => { pause(); if (reduceMotion.matches) { step = 3; render(); } });
});
document.addEventListener('visibilitychange', () => { if(document.hidden) sceneControllers.forEach(scene => scene.pause()); });
filters.addEventListener('click', () => sceneControllers.forEach(scene => { if(scene.card.hidden) scene.pause(); }));
const dashboard = document.querySelector('.dashboard');
dashboard.querySelector('.dashboard-filter').addEventListener('click', event => {
 const button = event.target.closest('[data-rows]'); if(!button) return;
 dashboard.querySelectorAll('[data-rows]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
 dashboard.querySelectorAll('tbody tr').forEach(row => { row.hidden = button.dataset.rows === 'exceptions' && !row.hasAttribute('data-exception'); });
 dashboard.querySelector('.dashboard-status').textContent = button.dataset.rows === 'exceptions' ? 'Showing 2 exceptions' : 'Showing all 6 accounts';
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
