// Configuration
const API_BASE = window.location.origin; // Auto-detect domain

// Theme
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  const saved = localStorage.getItem('rekber-theme') || 'dark';
  document.documentElement.dataset.theme = saved;
  themeToggle.textContent = saved === 'dark' ? '☀️' : '🌙';
  themeToggle.onclick = () => {
    const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = t;
    localStorage.setItem('rekber-theme', t);
    themeToggle.textContent = t === 'dark' ? '☀️' : '🌙';
  };
}

document.getElementById('year').textContent = new Date().getFullYear();

// Helpers
function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Load stats
async function loadStats() {
  try {
    const res = await fetch(`${API_BASE}/api/hb/list?limit=1`);
    const json = await res.json();
    if (json.ok) {
      document.getElementById('count').textContent = json.total || 0;
      document.getElementById('statApproved').textContent = json.total || 0;
      document.getElementById('statTotal').textContent = json.total || 0;
      document.getElementById('statPending').textContent = '0'; // TODO: add stats endpoint
    }
  } catch (err) {
    console.error('Stats error:', err);
  }
}

// Search
const searchForm = document.getElementById('searchForm');
if (searchForm) {
  searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = searchForm.gameId.value.replace(/\D/g, '');
    if (!input) return;

    const box = document.getElementById('searchResult');
    box.style.display = 'block';
    box.className = 'search-result show';
    box.innerHTML = '<div class="loading"><span class="dot"></span> Mencari...</div>';

    try {
      const res = await fetch(`${API_BASE}/api/hb/search?id=${encodeURIComponent(input)}`);
      const json = await res.json();

      if (json.ok && json.found && json.data) {
        const r = json.data;
        box.className = 'search-result show found';
        box.innerHTML = `
          <div class="result-header">
            <span class="status-badge danger">⚠️ AKUN BERBAHAYA</span>
          </div>
          <div class="result-body">
            ${r.image_path ? `<img src="${API_BASE}/uploads/${r.image_path}" alt="Foto akun">` : ''}
            <div class="result-info">
              <h3>${escapeHtml(r.id_game)} (${escapeHtml(r.server)})</h3>
              <p><strong>Nama Pelaku:</strong> ${escapeHtml(r.offender_name)}</p>
              <p><strong>Tanggal HB:</strong> ${r.hb_date || '-'}</p>
              <p><strong>Dilapor oleh:</strong> ${escapeHtml(r.reporter_fb)}</p>
              ${r.approved_by ? `<p class="approved">✓ Approved by ${escapeHtml(r.approved_by)}</p>` : ''}
            </div>
          </div>
          <a href="view.html?id=${encodeURIComponent(r.id_game)}" class="btn-detail">Lihat Detail →</a>
        `;
      } else {
        box.className = 'search-result show clean';
        box.innerHTML = `
          <div class="result-header">
            <span class="status-badge safe">✅ ID Bersih</span>
          </div>
          <p>ID <strong>${escapeHtml(input)}</strong> tidak terdaftar dalam database akun HB.</p>
          <p class="hint">Tetap hati-hati dan gunakan jasa rekber untuk transaksi.</p>
        `;
      }
    } catch (err) {
      box.className = 'search-result show error';
      box.innerHTML = `<p>Gagal menghubungi server: ${escapeHtml(err.message)}</p>`;
    }
  });
}

loadStats();
