// ═══ REKBER HB — shared config & helpers ═══

// API base. '' = same origin (deploy backend+frontend satu server).
// Kalau frontend di Vercel/GitHub Pages & backend di VPS, isi: window.API_BASE = 'https://api.domainmu.com';
window.API_BASE = '';

// Config admin — GANTI sebelum live
window.RBK_CONFIG = {
  adminWa: '6281234567890',        // nomor WA admin (format 628xxx)
  adminWaDisplay: '081234567890',  // nomor WA admin (format 08xxx)
  brand: 'REKBER HB',
  tagline: 'Database Akun Berbahaya — Lindungi Komunitas dari Penipuan'
};

// ═══ Theme ═══
(function () {
  const saved = localStorage.getItem('rbk-theme') || 'dark';
  document.documentElement.dataset.theme = saved;
  const btn = document.getElementById('themeToggle');
  if (btn) {
    btn.textContent = saved === 'dark' ? '☀️' : '🌙';
    btn.onclick = () => {
      const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = t;
      localStorage.setItem('rbk-theme', t);
      btn.textContent = t === 'dark' ? '☀️' : '🌙';
    };
  }
  // Hamburger
  document.addEventListener('DOMContentLoaded', () => {
    const burger = document.getElementById('hamburger');
    const links = document.getElementById('navLinks');
    if (burger && links) {
      burger.addEventListener('click', () => links.classList.toggle('open'));
      links.addEventListener('click', (e) => { if (e.target.tagName === 'A') links.classList.remove('open'); });
    }
  });
  // Year
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();
})();

// ═══ Helpers ═══
function esc(str) {
  if (str == null) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

async function api(path, opts) {
  const res = await fetch(`${window.API_BASE}${path}`, opts);
  return res.json();
}
