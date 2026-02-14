(function () {
  // ====== STORAGE HELPERS ======
  var STORAGE_KEY = 'portfolio_stats';

  function getStats() {
    try {
      var data = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (data && typeof data === 'object') return data;
    } catch (e) { }
    return { totalViews: 0, pages: [], visitorId: null, sessionStart: null, totalTime: 0 };
  }

  function saveStats(data) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) { }
  }

  // ====== TRACK PAGE VIEW ======
  var stats = getStats();
  var currentPage = location.pathname.split('/').pop() || 'index.html';

  // Assign visitor number on first visit
  if (!stats.visitorId) {
    stats.visitorId = Math.floor(Math.random() * 9000) + 1000;
  }

  // Track total page views
  stats.totalViews = (stats.totalViews || 0) + 1;

  // Track unique pages
  if (!Array.isArray(stats.pages)) stats.pages = [];
  if (stats.pages.indexOf(currentPage) === -1) {
    stats.pages.push(currentPage);
  }

  // Session timer
  stats.sessionStart = Date.now();
  stats.totalTime = stats.totalTime || 0;

  saveStats(stats);

  // ====== FORMAT TIME ======
  function formatTime(seconds) {
    if (seconds < 60) return seconds + 's';
    var m = Math.floor(seconds / 60);
    var s = seconds % 60;
    if (m < 60) return m + 'm ' + s + 's';
    var h = Math.floor(m / 60);
    m = m % 60;
    return h + 'h ' + m + 'm';
  }

  // ====== BUILD WIDGET ======
  function buildStatsWidget() {
    // Toggle Button
    var toggle = document.createElement('button');
    toggle.className = 'stats-toggle';
    toggle.innerHTML = '<i class="fas fa-chart-pie"></i> Stats <span class="stats-toggle-count">' + stats.totalViews + '</span>';

    // Panel
    var panel = document.createElement('div');
    panel.className = 'stats-panel';
    panel.innerHTML =
      '<div class="stats-panel-header">' +
        '<h4><i class="fas fa-chart-line"></i> Portfolio Stats</h4>' +
        '<button class="stats-panel-close"><i class="fas fa-times"></i></button>' +
      '</div>' +
      '<div class="stats-grid">' +
        '<div class="stat-item">' +
          '<div class="stat-icon"><i class="fas fa-eye"></i></div>' +
          '<span class="stat-value" id="stat-views">0</span>' +
          '<span class="stat-label">Page Views</span>' +
        '</div>' +
        '<div class="stat-item">' +
          '<div class="stat-icon"><i class="fas fa-compass"></i></div>' +
          '<span class="stat-value" id="stat-pages">0</span>' +
          '<span class="stat-label">Pages Explored</span>' +
        '</div>' +
        '<div class="stat-item">' +
          '<div class="stat-icon"><i class="fas fa-clock"></i></div>' +
          '<span class="stat-value" id="stat-time">0s</span>' +
          '<span class="stat-label">Time on Site</span>' +
        '</div>' +
        '<div class="stat-item">' +
          '<div class="stat-icon"><i class="fas fa-user"></i></div>' +
          '<span class="stat-value" id="stat-visitor">#0</span>' +
          '<span class="stat-label">Visitor Number</span>' +
        '</div>' +
      '</div>';

    document.body.appendChild(toggle);
    document.body.appendChild(panel);

    var closeBtn = panel.querySelector('.stats-panel-close');
    var isOpen = false;

    // Animated counter
    function animateValue(el, end, duration) {
      var start = 0;
      var startTime = null;
      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var val = Math.floor(progress * end);
        el.textContent = el.id === 'stat-visitor' ? '#' + val : val;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    function updateDisplay() {
      var current = getStats();
      var elapsed = Math.floor((Date.now() - current.sessionStart) / 1000);
      var totalSec = (current.totalTime || 0) + elapsed;

      document.getElementById('stat-views').textContent = current.totalViews;
      document.getElementById('stat-pages').textContent = current.pages.length;
      document.getElementById('stat-time').textContent = formatTime(totalSec);
      document.getElementById('stat-visitor').textContent = '#' + current.visitorId;
    }

    function openPanel() {
      isOpen = true;
      panel.classList.add('open');
      // Animate counters on open
      animateValue(document.getElementById('stat-views'), stats.totalViews, 600);
      animateValue(document.getElementById('stat-pages'), stats.pages.length, 600);
      animateValue(document.getElementById('stat-visitor'), stats.visitorId, 800);
      updateDisplay();
    }

    toggle.addEventListener('click', function () {
      if (isOpen) {
        isOpen = false;
        panel.classList.remove('open');
      } else {
        openPanel();
      }
    });

    closeBtn.addEventListener('click', function () {
      isOpen = false;
      panel.classList.remove('open');
    });

    // Real-time time update
    setInterval(function () {
      if (isOpen) updateDisplay();
    }, 1000);

    // Save accumulated time before leaving
    window.addEventListener('beforeunload', function () {
      var current = getStats();
      var elapsed = Math.floor((Date.now() - current.sessionStart) / 1000);
      current.totalTime = (current.totalTime || 0) + elapsed;
      current.sessionStart = Date.now();
      saveStats(current);
    });
  }

  // ====== INITIALIZE ======
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildStatsWidget);
  } else {
    buildStatsWidget();
  }
})();
