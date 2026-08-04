// REKBER HB - Footer Component (auto-inject)
// Works with <script src="components/footer.js" defer> in <head>
(function () {
  function inject() {
    var el = document.getElementById('footer-placeholder');
    if (!el) return;

    // === HITUNG STATUS ONLINE/OFFLINE (WIB UTC+7) ===
    var now = new Date();
    var wib = new Date(now.getTime() + (7 * 3600 * 1000));
    var hours = wib.getUTCHours();
    var minutes = wib.getUTCMinutes();
    var curMin = hours * 60 + minutes;

    var startMin = 7 * 60 + 30; // 07:30
    var endMin = 0 * 60 + 30;   // 00:30

    var wibDay = wib.getUTCDay(); // 0 = Sun, 1 = Mon, ..., 5 = Fri, 6 = Sat
    var isOnline = false;
    var statusText = 'Offline — Buka Jam 07.30 WIB';
    var statusClass = 'is-offline';

    // Shift Yesterday (active if curMin < 00:30)
    if (curMin < endMin) {
      var yesterdayDay = (wibDay - 1 + 7) % 7;
      if (yesterdayDay === 5) {
        statusText = 'Libur — Buka Hari Ini Jam 07.30 WIB';
        statusClass = 'is-offline';
      } else {
        isOnline = true;
        statusText = 'Online';
        statusClass = '';
      }
    }
    // Shift Today (active if curMin >= 07:30)
    else if (curMin >= startMin) {
      if (wibDay === 5) {
        statusText = 'Libur — Buka Besok Jam 07.30 WIB';
        statusClass = 'is-offline';
      } else {
        isOnline = true;
        statusText = 'Online';
        statusClass = '';
      }
    }
    // Outside of shifts (00:30 to 07:30)
    else {
      if (wibDay === 5) {
        statusText = 'Libur — Buka Besok Jam 07.30 WIB';
        statusClass = 'is-offline';
      } else {
        statusText = 'Offline — Buka Jam 07.30 WIB';
        statusClass = 'is-offline';
      }
    }

    el.outerHTML = `<!-- FOOTER -->
<footer class="view-footer">
  <div class="view-footer-panel">
    <div class="view-footer-brand">
      <img src="assets/img/logojsn.png" alt="REKBER HB Team Logo">
      <h2>REKBER HB</h2>
      <p>Rekber HB adalah Jasa Rekber yang membantu transaksi antara penjual dan pembeli , Dipercaya sejak 2016.</p>
      <div class="view-footer-socials">
        <a href="https://www.facebook.com/julieseanrekberverifieds" target="_blank"
          aria-label="Facebook"><svg viewBox="0 0 24 24">
            <path d="M14 8h3V4h-3c-3.3 0-5 2-5 5v2H6v4h3v5h4v-5h3l1-4h-4V9c0-.7.3-1 1-1z" />
          </svg></a>
        <a href="index.html#kontak" aria-label="WhatsApp"><svg viewBox="0 0 24 24">
            <path
              d="M12 3a8.8 8.8 0 0 0-7.5 13.4L3.7 21l4.7-1.2A8.9 8.9 0 1 0 12 3zm0 2a6.9 6.9 0 0 1 0 13.8c-1.2 0-2.4-.3-3.4-.9l-.4-.2-1.8.5.5-1.8-.3-.4A6.9 6.9 0 0 1 12 5zm-2.3 3.4c-.2 0-.5 0-.7.3-.2.3-.8.8-.8 2s.8 2.3 1 2.5c.1.2 1.6 2.6 4 3.5 2 .8 2.4.5 2.8.5.4 0 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1-.1-.1-.2-.2-.5-.3l-1.7-.8c-.2-.1-.4-.1-.6.1l-.7.9c-.1.2-.3.2-.5.1-1.3-.5-2.2-1.2-2.9-2.5-.1-.2 0-.4.1-.5l.5-.6c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5L11 8.9c-.2-.4-.4-.5-.7-.5h-.6z" />
          </svg></a>
        <a href="index.html#kontak" aria-label="TikTok"><svg viewBox="0 0 24 24">
            <path
              d="M16 3c.4 3 2.1 4.8 5 5v3.5a8.7 8.7 0 0 1-5-1.6V16a5 5 0 1 1-5-5c.3 0 .7 0 1 .1V15a2 2 0 1 0 1.5 1.9V3h2.5z" />
          </svg></a>
      </div>
      <a class="view-backtop" href="#">↑ Back To Top</a>
    </div>
    <div class="view-footer-links">
      <div>
        <h3>Site Map</h3>
        <a href="index.html">Home</a>
        <a href="index.html#cara-kerja">Cara Kerja</a>
        <a href="index.html#aturan">Aturan Transaksi</a>
        <a href="index.html#garansi">Penjelasan Garansi</a>
        <a href="index.html#fee">Fee Rekber</a>
        <a href="search.html">Cek akun berbahaya</a>
        <a href="lapor.html">Laporkan akun berbahaya</a>
        <a href="index.html#faq">FAQ</a>
        <a href="index.html#kontak">Kontak</a>
      </div>
      <div>
        <h3>Legal</h3>
        <a href="index.html#aturan">Terms of Service</a>
        <a href="index.html#garansi">Kebijakan Garansi</a>
        <a href="index.html#kontak">Pusat Bantuan</a>
      </div>
    </div>
  </div>
  <div class="view-footer-copy">© 2026 REKBER HB. All rights reserved.</div>
</footer>

<!-- IMAGE LIGHTBOX -->
<div class="lightbox-overlay" id="lightbox" aria-hidden="true">
  <div class="lightbox-content">
    <button class="lightbox-close" aria-label="Close image">&times;</button>
    <img src="" alt="Enlarged view" id="lightbox-img">
  </div>
</div>

<!-- FLOATING ADMIN BUTTON -->
<button class="floating-admin-btn" id="floatingAdminBtn" aria-label="Buka Menu Kontak Admin">
  <div class="floating-admin-text">
    <span>Hubungi</span>
    <strong>Admin Rekber HB</strong>
  </div>
  <div class="floating-admin-ring"></div>
  <div class="floating-admin-icon">
    <svg class="icon-default" viewBox="0 0 20 20"
      style="width: 100%; height: 100%; display: block; border-radius: 50%;">
      <circle cx="10" cy="10" r="10" fill="#1877f2" />
      <g transform="translate(3.5, 3.5) scale(0.81)">
        <path
          d="M0 7.76C0 3.301 3.493 0 8 0s8 3.301 8 7.76-3.493 7.76-8 7.76c-.81 0-1.586-.107-2.316-.307a.64.64 0 0 0-.427.03l-1.588.702a.64.64 0 0 1-.898-.566l-.044-1.423a.64.64 0 0 0-.215-.456C.956 12.108 0 10.092 0 7.76m5.546-1.459-2.35 3.728c-.225.358.214.761.551.506l2.525-1.916a.48.48 0 0 1 .578-.002l1.869 1.402a1.2 1.2 0 0 0 1.735-.32l2.35-3.728c.226-.358-.214-.761-.551-.506L9.728 7.381a.48.48 0 0 1-.578.002L7.281 5.98a1.2 1.2 0 0 0-1.735.32z"
          fill="#ffffff" fill-rule="evenodd" />
      </g>
    </svg>
    <svg class="icon-active" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
      stroke-linecap="round" stroke-linejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  </div>
</button>

<!-- ADMIN CHAT WIDGET -->
<div class="admin-chat-widget" id="adminChatWidget" aria-hidden="true">
  <div class="admin-chat-header">
    <div class="admin-chat-profile">
      <div class="admin-chat-avatar">
        <svg viewBox="2 2 20 20" fill="currentColor">
          <path
            d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
        </svg>
      </div>
      <div>
        <h4>Admin Rekber HB</h4>
        <span class="${statusClass}" id="adminStatusText">${statusText}</span>
      </div>
    </div>
    <button class="admin-chat-close" id="adminChatClose" aria-label="Close">&times;</button>
  </div>
  <div class="admin-chat-body">
    <div class="chat-bubble admin">
      <p>Halo! Transaksi Rekber <strong>HANYA</strong> di Facebook, tidak ada platform lainnya. WhatsApp hanya
        digunakan untuk mengamankan identitas penjual yang bertransaksi <strong>GARANSI</strong>. Jika ingin melakukan
        transaksi Rekber Silahkan klik lanjut ke Facebook</p>
    </div>
    <div class="admin-chat-actions">
      <a href="https://www.facebook.com/julieseanrekberverifieds" target="_blank"
        class="chat-action-btn btn-fb">
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
          <path
            d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
        </svg>
        Lanjut ke Facebook
      </a>
    </div>
  </div>
</div>`;
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
