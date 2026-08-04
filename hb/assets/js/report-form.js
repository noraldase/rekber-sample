/**
 * REKBER HB V5 — Report Form (API-driven)
 * Submits reports to POST /api/reports endpoint.
 */
(function () {
  const API_BASE = window.JSN_API_BASE || "";

  // ── XSS Prevention ─────────────────────────────────────────────
  function escapeHtml(str) {
    if (str == null) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  const form = document.querySelector("[data-report-form]");
  if (!form) return;

  const photoInput = document.querySelector("[data-photo-input]");
  const photoPreview = document.querySelector("[data-photo-preview]");
  const photoName = document.querySelector("[data-photo-name]");
  const pendingBox = document.querySelector("[data-pending-box]");
  const intro = document.querySelector(".report-intro");

  function showLoading() {
    const overlay = document.createElement("div");
    overlay.className = "report-loading-overlay";
    overlay.innerHTML = `<div><span></span><strong>Laporan sedang dikirim ke database...</strong></div>`;
    document.body.appendChild(overlay);
    return overlay;
  }

  function hideLoading(overlay) {
    if (overlay && overlay.parentNode) overlay.remove();
  }

  // Photo preview
  photoInput?.addEventListener("change", () => {
    const file = photoInput.files?.[0];
    if (!file || !photoPreview) return;
    photoPreview.src = URL.createObjectURL(file);
    photoPreview.classList.add("show");
    photoPreview.closest(".report-upload")?.classList.add("has-photo");
    if (photoName) photoName.textContent = `File: ${file.name}`;
  });

  // Submit form
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const overlay = showLoading();

    try {
      const formData = new FormData(form);

      const res = await fetch(`${API_BASE}/api/reports`, {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      hideLoading(overlay);

      if (!json.ok) {
        alert(`Gagal mengirim laporan: ${json.message || "Unknown error"}`);
        return;
      }

      // Success — show result
      const data = json.data || {};
      const reportCode = data.report_code || "-";
      const idLabel = `${data.id_game || "-"} (${data.server || "-"})`;

      const message = [
        `Halo Admin Rekber, saya ingin melampirkan bukti laporan HB.`,
        `Code Laporan: ${reportCode}`,
        `ID: ${data.id_game || "-"}`,
        `Server: ${data.server || "-"}`,
        `Tanggal Transaksi: ${data.transaction_date || "-"}`,
        `Tanggal ke HB: ${data.hb_date || "-"}`,
        `Nama Pelaku: ${data.offender_name || "-"}`,
        `WA Pelaku: ${data.offender_wa || "-"}`,
        `Nama FB Pelapor: ${data.reporter_fb || "-"}`,
        `Nomor WA Korban: ${data.victim_wa || "-"}`
      ].join("\n");

      document.body.classList.add("report-sent");
      intro?.remove();
      form.remove();

      const homeHref = document.querySelector(".report-home")?.getAttribute("href") || "index.html";

      pendingBox?.classList.add("show");
      if (pendingBox) {
        pendingBox.innerHTML = `
          <div class="report-code-table">
            <div><span>Code Laporan</span><strong>${escapeHtml(reportCode)}</strong></div>
            <div><span>ID & Server</span><strong>${escapeHtml(idLabel)}</strong></div>
          </div>
          <h1>Laporan berhasil dikirim</h1>
          <p>Laporan masuk ke list pending, tinggal nunggu persetujuan Admin.</p>
          <p>Lampirkan bukti transaksi ke WhatsApp Admin agar laporan bisa dicek dan di-approve.</p>
          <p>WA: 081234567890</p>
          <div class="report-actions">
            <a class="admin-wa" href="https://wa.me/6281234567890?text=${encodeURIComponent(message)}" target="_blank"><svg viewBox="0 0 24 24"><path d="M12 3a8.8 8.8 0 0 0-7.5 13.4L3.7 21l4.7-1.2A8.9 8.9 0 1 0 12 3zm0 2a6.9 6.9 0 0 1 0 13.8c-1.2 0-2.4-.3-3.4-.9l-.4-.2-1.8.5.5-1.8-.3-.4A6.9 6.9 0 0 1 12 5zm-2.3 3.4c-.2 0-.5 0-.7.3-.2.3-.8.8-.8 2s.8 2.3 1 2.5c.1.2 1.6 2.6 4 3.5 2 .8 2.4.5 2.8.5.4 0 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1-.1-.1-.2-.2-.5-.3l-1.7-.8c-.2-.1-.4-.1-.6.1l-.7.9c-.1.2-.3.2-.5.1-1.3-.5-2.2-1.2-2.9-2.5-.1-.2 0-.4.1-.5l.5-.6c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5L11 8.9c-.2-.4-.4-.5-.7-.5h-.6z"/></svg> WhatsApp Admin</a>
            <a class="report-home" href="${escapeHtml(homeHref)}">Halaman Utama</a>
          </div>
        `;

        // Scroll ke atas halaman agar user langsung lihat kode laporan
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      hideLoading(overlay);
      alert(`Error: ${err.message}\n\nTerjadi kesalahan saat mengirim laporan, tolong beritahu admin.`);
    }
  });
})();
