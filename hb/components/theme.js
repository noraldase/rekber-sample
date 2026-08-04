// REKBER HB - Theme Toggle Component (Dark/Light Mode)
// Include this file AFTER header.js on every page.
// Works on both file:// and http:// protocols.
(function () {
  // Detect base path from the script src (handles subdirectories like /blog/)
  var scripts = document.getElementsByTagName('script');
  var basePath = '';
  for (var i = 0; i < scripts.length; i++) {
    var src = scripts[i].getAttribute('src') || '';
    var idx = src.indexOf('components/theme.js');
    if (idx !== -1) {
      basePath = src.substring(0, idx);
      break;
    }
  }

  // Get stored theme or default to dark
  var storedTheme = localStorage.getItem('jsn-theme') || 'dark';

  // Apply theme to <html> immediately
  document.documentElement.dataset.theme = storedTheme;

  // Find all toggle buttons (injected by header.js)
  function applyTheme(theme) {
    var isLight = theme === 'light';
    document.documentElement.dataset.theme = theme;

    var toggles = document.querySelectorAll('[data-theme-toggle]');
    toggles.forEach(function (toggle) {
      var label = toggle.querySelector('.theme-toggle-text');
      var icon = toggle.querySelector('.theme-toggle-icon');
      toggle.setAttribute('aria-pressed', String(isLight));
      toggle.setAttribute('aria-label', isLight ? 'Current mode: Day mode' : 'Current mode: Night mode');
      if (label) label.textContent = isLight ? 'Day mode' : 'Night mode';
      if (icon) icon.src = basePath + (isLight ? 'assets/img/toggle-light.svg' : 'assets/img/toggle-dark.svg');
    });

    localStorage.setItem('jsn-theme', theme);
  }

  // Apply stored theme to existing buttons
  applyTheme(storedTheme);

  // Bind click events to all toggle buttons
  function bindToggles() {
    var toggles = document.querySelectorAll('[data-theme-toggle]');
    toggles.forEach(function (toggle) {
      // Prevent duplicate listeners
      if (toggle.dataset.themeBound) return;
      toggle.dataset.themeBound = 'true';

      toggle.addEventListener('click', function () {
        var current = document.documentElement.dataset.theme;

        // Mobile animation
        if (toggle.closest('.nav-container') && window.matchMedia('(max-width: 1024px)').matches) {
          toggle.classList.remove('is-switching');
          void toggle.offsetWidth;
          toggle.classList.add('is-switching');
          setTimeout(function () { toggle.classList.remove('is-switching'); }, 1180);
        }

        // Smooth transition
        document.documentElement.classList.add('theme-transitioning');
        setTimeout(function () { document.documentElement.classList.remove('theme-transitioning'); }, 700);

        applyTheme(current === 'light' ? 'dark' : 'light');
      });
    });
  }

  bindToggles();

  // Expose globally so loadComponents() can re-bind after fetch-based loading
  window.initThemeToggle = function () {
    applyTheme(localStorage.getItem('jsn-theme') || 'dark');
    bindToggles();
  };
})();
