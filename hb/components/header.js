// REKBER HB - Header Component (auto-inject)
// Works with <script src="components/header.js" defer> in <head>
(function() {
  function inject() {
    var el = document.getElementById('header-placeholder');
    if (!el) return;
  el.outerHTML = `<!-- NAVBAR -->
<nav class="navbar" id="navbar">
  <div class="nav-container">
    <a href="index.html" class="nav-logo">
      <img src="assets/img/logojsn.png" alt="REKBER HB Team Logo" class="nav-logo-img">
      <div class="nav-logo-text">REKBER HB <span>REKBER</span></div>
    </a>
    <div class="nav-links" id="navLinks">
      <a href="index.html">Home</a>
      <div class="nav-dropdown">
        <a href="#" class="nav-dropdown-toggle" onclick="event.preventDefault()">Panduan Transaksi <svg
            viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"
            style="vertical-align: middle; margin-left: 4px;">
            <path d="M6 9l6 6 6-6" />
          </svg></a>
        <div class="nav-dropdown-menu">
          <a href="index.html#cara-kerja">Cara Kerja</a>
          <a href="index.html#aturan">Aturan Transaksi</a>
          <a href="index.html#garansi">Penjelasan Garansi</a>
          <a href="index.html#fee">Fee Rekber</a>
        </div>
      </div>
      <a href="search.html">Cek Akun Berbahaya</a>
      <a href="lapor.html">Laporkan Akun Berbahaya</a>
      <a href="index.html#kontak">Kontak</a>
      <a href="https://www.facebook.com/julieseanrekberverifieds" target="_blank" class="nav-cta">\u{1F4AC} Hubungi
        Kami</a>
    </div>
    <button class="theme-toggle" type="button" data-theme-toggle aria-label="Switch to Day mode" aria-pressed="false">
      <img class="theme-toggle-icon" src="assets/img/toggle-light.svg" alt="" aria-hidden="true">
      <span class="theme-toggle-text">Day mode</span>
    </button>
    <div class="hamburger" id="hamburger" onclick="toggleMenu()"><span></span><span></span><span></span></div>
  </div>
  <div class="theme-dock" aria-label="Theme mode">
    <button class="theme-toggle theme-toggle-docked" type="button" data-theme-toggle aria-label="Switch to Day mode"
      aria-pressed="false">
      <img class="theme-toggle-icon" src="assets/img/toggle-light.svg" alt="" aria-hidden="true">
      <span class="theme-toggle-text">Day mode</span>
    </button>
  </div>
</nav>`;
  }
  // Run immediately if DOM ready, otherwise wait
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
