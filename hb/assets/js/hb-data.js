/**
 * REKBER HB V5 — HB Data Module (API-driven)
 * Fetches data from /api/hb/* endpoints instead of static array.
 */

const API_BASE = window.JSN_API_BASE || "";

// ── XSS Prevention ───────────────────────────────────────────────
function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const fbIcon = '<svg class="hb-label-icon" viewBox="0 0 24 24"><path d="M14 8h3V4h-3c-3.3 0-5 2-5 5v2H6v4h3v5h4v-5h3l1-4h-4V9c0-.7.3-1 1-1z"/></svg>';
const waIcon = '<svg class="hb-label-icon" viewBox="0 0 24 24"><path d="M12 3a8.8 8.8 0 0 0-7.5 13.4L3.7 21l4.7-1.2A8.9 8.9 0 1 0 12 3zm0 2a6.9 6.9 0 0 1 0 13.8c-1.2 0-2.4-.3-3.4-.9l-.4-.2-1.8.5.5-1.8-.3-.4A6.9 6.9 0 0 1 12 5zm-2.3 3.4c-.2 0-.5 0-.7.3-.2.3-.8.8-.8 2s.8 2.3 1 2.5c.1.2 1.6 2.6 4 3.5 2 .8 2.4.5 2.8.5.4 0 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1-.1-.1-.2-.2-.5-.3l-1.7-.8c-.2-.1-.4-.1-.6.1l-.7.9c-.1.2-.3.2-.5.1-1.3-.5-2.2-1.2-2.9-2.5-.1-.2 0-.4.1-.5l.5-.6c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5L11 8.9c-.2-.4-.4-.5-.7-.5h-.6z"/></svg>';

function renderHbRows(record) {
  return `
    <div class="hb-detail-row"><span>ID + Server</span><strong>${escapeHtml(record.id_game)} (${escapeHtml(record.server)})</strong></div>
    <div class="hb-detail-row"><span>Tanggal transaksi</span><strong>${escapeHtml(record.transaction_date) || "-"}</strong></div>
    <div class="hb-detail-row"><span>Tanggal ke HB</span><strong>${escapeHtml(record.hb_date) || "-"}</strong></div>
    <div class="hb-detail-row"><span>Nama Lengkap/Nama fb pelaku</span><strong>${escapeHtml(record.offender_name) || "-"}</strong></div>
    <div class="hb-detail-row"><span>WhatsApp Pelaku</span><strong>${escapeHtml(record.offender_wa) || "-"}</strong></div>
    <div class="hb-detail-row"><span>${fbIcon}FB Pelapor</span><strong>${escapeHtml(record.reporter_fb) || "-"}</strong></div>
    <div class="hb-detail-row"><span>${waIcon}WA Pelapor</span><strong>${escapeHtml(record.victim_wa) || "-"}</strong></div>
  `;
}

// ── Search Page ───────────────────────────────────────────────────
function initHbSearch() {
  const form = document.querySelector("[data-search-form]");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const id = form.gameId.value.replace(/\D/g, "");
    if (!id) { form.gameId.focus(); return; }

    const box = document.querySelector("[data-search-result]");
    box.className = "hb-search-result show";
    box.innerHTML = `<div class="hb-loading"><span class="dot"></span> Mencari...</div>`;

    try {
      const res = await fetch(`${API_BASE}/api/hb/search?id=${encodeURIComponent(id)}`);
      const json = await res.json();

      if (json.ok && json.found && json.data) {
        const r = json.data;
        box.className = "hb-search-result show found";
        box.innerHTML = `
          <img src="${escapeHtml(r.image)}" alt="Foto akun ${escapeHtml(r.id_game)}">
          <div>
            <strong>${escapeHtml(r.id_game)} (${escapeHtml(r.server)})</strong>
            <span>AKUN BERBAHAYA - Tanggal HB ${escapeHtml(r.hb_date)}</span>
          </div>
          <a href="view.html?id=${encodeURIComponent(r.id_game)}">Lihat Detail</a>
        `;
      } else {
        box.className = "hb-search-result show missing";
        box.innerHTML = `
          <strong>ID tidak ditemukan</strong>
          <span>ID ${escapeHtml(id)} tidak terdaftar dalam data akun HB.</span>
        `;
      }
    } catch (err) {
      box.className = "hb-search-result show missing";
      box.innerHTML = `<strong>Gagal menghubungi server</strong><span>${escapeHtml(err.message)}</span>`;
    }
  });
}

// ── Directory (List) Page ─────────────────────────────────────────
function initHbDirectory() {
  const list = document.querySelector("[data-hb-list]");
  if (!list) return;

  const pagination = document.querySelector("[data-hb-pagination]");
  const count = document.querySelector("[data-hb-count]");
  const perPage = 5;
  let currentPage = 1;

  async function render(page) {
    currentPage = page;
    list.innerHTML = `<div class="hb-loading"><span class="dot"></span> Memuat data...</div>`;

    try {
      const res = await fetch(`${API_BASE}/api/hb/list?page=${page}&limit=${perPage}`);
      const json = await res.json();

      if (!json.ok) {
        list.innerHTML = `<div class="hb-loading">Gagal memuat data</div>`;
        return;
      }

      const records = json.data || [];
      const total = json.total || 0;
      const totalPages = json.total_pages || 1;

      if (count) count.textContent = `${total} akun`;

      if (records.length === 0) {
        list.innerHTML = `<div class="hb-loading">Belum ada data akun HB.</div>`;
      } else {
        list.innerHTML = records.map((r) => `
          <a class="hb-directory-card" href="view.html?id=${encodeURIComponent(r.id_game)}">
            <img src="${escapeHtml(r.image)}" alt="Foto akun ${escapeHtml(r.id_game)}">
            <div>
              <strong>${escapeHtml(r.id_game)} (${escapeHtml(r.server)})</strong>
              <span>Tanggal HB ${escapeHtml(r.hb_date)}</span>
            </div>
          </a>
        `).join("");
      }

      // Pagination
      if (!pagination || totalPages <= 1) {
        if (pagination) pagination.innerHTML = "";
        return;
      }
      pagination.innerHTML = Array.from({ length: totalPages }, (_, i) => {
        const p = i + 1;
        return `<button type="button" class="${p === currentPage ? "active" : ""}" data-page="${p}">${p}</button>`;
      }).join("");
    } catch (err) {
      list.innerHTML = `<div class="hb-loading">Error: ${escapeHtml(err.message)}</div>`;
    }
  }

  pagination?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-page]");
    if (!button) return;
    render(Number(button.dataset.page));
  });

  render(1);
}

// ── View Detail Page ──────────────────────────────────────────────
async function initHbView() {
  const detailCard = document.querySelector(".hb-detail-card");
  if (!detailCard) return;

  const params = new URLSearchParams(location.search);
  const requestedId = params.get("id");
  if (!requestedId) {
    location.replace("search.html");
    return;
  }

  const image = document.querySelector(".hb-account-image img");
  const imageWrap = document.querySelector(".hb-account-image");
  const title = document.querySelector(".hb-header h1");
  const status = document.querySelector(".hb-status, .hb-label, .hb-badge");
  const dateEl = document.querySelector(".hb-date");
  const subtitle = document.querySelector(".hb-report p");
  const correction = document.querySelector(".hb-correction");
  const share = document.querySelector(".hb-share");

  // Show loading
  detailCard.innerHTML = `<div class="hb-detail-row"><span>Status</span><strong>Memuat data...</strong></div>`;

  try {
    const res = await fetch(`${API_BASE}/api/hb/${encodeURIComponent(requestedId)}`);
    const json = await res.json();

    if (!json.ok || !json.data) {
      // Not found
      if (imageWrap) imageWrap.style.display = "none";
      if (title) title.textContent = `${requestedId || "ID"} TIDAK TERDAFTAR`;
      if (status) status.textContent = "ID HB TIDAK DITEMUKAN";
      if (dateEl) dateEl.textContent = "-";
      if (subtitle) subtitle.textContent = "ID tersebut tidak terdaftar dalam data akun HB REKBER HB.";
      detailCard.innerHTML = `<div class="hb-detail-row"><span>Status</span><strong>ID tidak terdaftar dalam akun HB</strong></div>`;
      if (correction) correction.style.display = "none";
      if (share) share.style.display = "none";
      document.body.dataset.hbShareTitle = "ID tidak terdaftar - REKBER HB";
      return;
    }

    const record = json.data;
    if (image) {
      image.src = record.image;
      image.style.display = "";
    }
    if (title) title.textContent = `${record.id_game} (AKUN BERBAHAYA) ❌`;
    if (status) status.innerHTML = `<span class="dot"></span> ID HB Valid Ditemukan`;
    if (dateEl) dateEl.textContent = record.hb_date;

    // Insert "Approve by Admin" badge below the title
    if (record.approved_by && title && title.parentElement) {
      const existing = title.parentElement.querySelector(".hb-approved-badge");
      if (existing) existing.remove();
      const badge = document.createElement("div");
      badge.className = "hb-approved-badge";
      badge.innerHTML = `<span class="hb-approved-icon">✓</span><span class="hb-approved-text">Approved by</span><strong>${escapeHtml(record.approved_by)}</strong>`;
      title.parentElement.insertBefore(badge, title.nextSibling);
    }

    detailCard.innerHTML = renderHbRows(record);

    // Set dynamic titles in head for browser and share metadata
    const shareTitleText = `ID HB ${escapeHtml(record.id_game)} Valid Ditemukan - REKBER HB`;
    document.title = shareTitleText;
    document.body.dataset.hbShareTitle = shareTitleText;

    // Dynamically update OG and Twitter tags in <head> for client-side sharing scrapers
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", shareTitleText);
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute("content", shareTitleText);
  } catch (err) {
    detailCard.innerHTML = `<div class="hb-detail-row"><span>Error</span><strong>${escapeHtml(err.message)}</strong></div>`;
  }
}

// ── Init ──────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initHbSearch();
  initHbDirectory();
  initHbView();
});
