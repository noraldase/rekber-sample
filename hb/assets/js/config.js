// Shared config — auto-detect API base
window.API_BASE = window.location.origin;

// Hamburger menu (mobile)
document.addEventListener('DOMContentLoaded', () => {
  const burger = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  if (burger && links) {
    burger.addEventListener('click', () => links.classList.toggle('open'));
    links.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') links.classList.remove('open');
    });
  }
});
