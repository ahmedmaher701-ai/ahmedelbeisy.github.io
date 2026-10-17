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
