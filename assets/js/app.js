// ═══ REKBER HB — home: stats, search, latest ═══

(async function () {
  // Stats
  try {
    const list = await api('/api/hb/list?limit=1');
    if (list.ok) {
      const total = list.total || 0;
      const el = (id, v) => { const n = document.getElementById(id); if (n) n.textContent = v; };
      el('statTotal', total);
      el('statApproved', total);
      el('statDanger', total);
      el('stripInfo', `${total} akun tercatat · dicek ${new Date().toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}`);
    }
  } catch (e) {
    const s = document.getElementById('stripInfo');
    if (s) s.textContent = 'Server data belum terhubung (frontend preview)';
  }

  // Latest table
  try {
    const list = await api('/api/hb/list?page=1&limit=6');
    const box = document.getElementById('latestTable');
    if (!box) return;
    if (!list.ok || !list.data.length) {
      box.innerHTML = '<div class="table-row head"><span>ID + Server</span><span>Pelaku</span><span>Tanggal HB</span><span>Dilaporkan</span><span>Status</span></div><div class="empty">Belum ada data. Jadi yang pertama lapor? → <a href="lapor.html" style="color:var(--mint)">Laporkan akun</a></div>';
      return;
    }
    box.innerHTML = '<div class="table-row head"><span>ID + Server</span><span>Pelaku</span><span>Tanggal HB</span><span>Dilaporkan</span><span>Status</span></div>' +
      list.data.map(r => `
        <a class="table-row" href="view.html?id=${encodeURIComponent(r.id_game)}" style="cursor:pointer">
          <span class="id">${esc(r.id_game)} (${esc(r.server)})</span>
          <span class="who">${esc(r.offender_name)}</span>
          <span class="date">${esc(r.hb_date || '-')}</span>
          <span class="who">${esc(r.reporter_fb || '-')}</span>
          <span><span class="tag danger">⚠ HB</span></span>
        </a>
      `).join('');
  } catch (e) {
    const box = document.getElementById('latestTable');
    if (box) box.innerHTML = '<div class="empty">Data belum bisa dimuat — pastikan server backend sudah jalan.</div>';
  }

  // Search
  const form = document.getElementById('searchForm');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = form.gameId.value.replace(/\D/g, '');
    if (!id) return;
    const box = document.getElementById('result');
    box.className = 'result show';
    box.innerHTML = '<div class="loading"><span class="dot"></span> Mencari…</div>';
    try {
      const json = await api(`/api/hb/search?id=${encodeURIComponent(id)}`);
      if (json.ok && json.found && json.data) {
        const r = json.data;
        box.className = 'result show found';
        box.innerHTML = `
          <span class="badge danger">⚠️ AKUN BERBAHAYA</span>
          <div class="result-body">
            ${r.image ? `<img src="${window.API_BASE}/${r.image}" alt="Foto akun">` : ''}
            <div class="result-info">
              <h3>${esc(r.id_game)} (${esc(r.server)})</h3>
              <p><strong>Pelaku:</strong> ${esc(r.offender_name)}</p>
              <p><strong>Tanggal HB:</strong> ${esc(r.hb_date || '-')}</p>
              <p><strong>Dilaporkan oleh:</strong> ${esc(r.reporter_fb)}</p>
              ${r.approved_by ? `<div class="approved">✓ Diverifikasi ${esc(r.approved_by)}</div>` : ''}
            </div>
          </div>
          <a class="btn-detail" href="view.html?id=${encodeURIComponent(r.id_game)}">Lihat Detail →</a>`;
      } else {
        box.className = 'result show clean';
        box.innerHTML = `
          <span class="badge safe">✅ ID BERSIH</span>
          <p style="font-size:15px">ID <strong>${esc(id)}</strong> tidak terdaftar dalam database akun berbahaya.</p>
          <p class="hint">Tetap hati-hati — gunakan jasa rekber &amp; verifikasi manual sebelum transaksi besar.</p>`;
      }
    } catch (err) {
      box.className = 'result show';
      box.innerHTML = `<div class="loading">Gagal menghubungi server: ${esc(err.message)}</div>`;
    }
  });
})();
