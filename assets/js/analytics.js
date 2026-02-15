(function () {
  'use strict';

  // ====== TAB NAVIGATION ======
  var tabBtns = document.querySelectorAll('.tab-btn');
  var tabPanels = document.querySelectorAll('.tab-panel');
  var initFlags = {};
  var animFrameIds = {};

  function switchTab(tabId) {
    tabBtns.forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });
    tabPanels.forEach(function (panel) {
      panel.classList.toggle('active', panel.id === 'tab-' + tabId);
    });

    // Force fade-in sections visible inside the active tab
    // (IntersectionObserver misses elements inside display:none panels)
    var activePanel = document.getElementById('tab-' + tabId);
    if (activePanel) {
      activePanel.querySelectorAll('.fade-in').forEach(function (el) {
        el.classList.add('visible');
      });
    }

    // Cancel running animations from other tabs
    Object.keys(animFrameIds).forEach(function (key) {
      if (animFrameIds[key]) {
        cancelAnimationFrame(animFrameIds[key]);
        animFrameIds[key] = null;
      }
    });

    // Lazy init features on first view
    if (tabId === 'dashboard' && !initFlags.dashboard) {
      initFlags.dashboard = true;
      initDashboardTab();
    } else if (tabId === 'ml-lab' && !initFlags.mlLab) {
      initFlags.mlLab = true;
      initMLLabTab();
    } else if (tabId === 'statistics' && !initFlags.statistics) {
      initFlags.statistics = true;
      initStatisticsTab();
    } else if (tabId === 'data-story' && !initFlags.dataStory) {
      initFlags.dataStory = true;
      initDataStoryTab();
    } else if (tabId === 'deep-learning' && !initFlags.deepLearning) {
      initFlags.deepLearning = true;
      initDeepLearningTab();
    } else if (tabId === 'data-tools' && !initFlags.dataTools) {
      initFlags.dataTools = true;
      initDataToolsTab();
    }

    // Update URL hash
    history.replaceState(null, '', '#' + tabId);
  }

  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      switchTab(btn.getAttribute('data-tab'));
    });
  });

  // Hash-based navigation
  var hash = window.location.hash.replace('#', '');
  var validTabs = ['dashboard', 'ml-lab', 'deep-learning', 'statistics', 'data-story', 'data-tools'];
  if (validTabs.indexOf(hash) !== -1) {
    switchTab(hash);
  } else {
    switchTab('dashboard');
  }

  // ====== CHART.JS INITIALIZATION ======
  var chartInstances = {};

  function getChartColors() {
    var isLight = document.body.classList.contains('light-mode');
    return {
      text: isLight ? '#444' : '#ccc',
      grid: isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)',
      tooltipBg: isLight ? '#333' : '#1a1a1a',
      tooltipText: isLight ? '#fff' : '#e6e6e6'
    };
  }

  var animDuration = 2500;
  var animEasing = 'easeOutQuart';

  function initSkillsChart() {
    if (typeof Chart === 'undefined') return;
    var colors = getChartColors();
    var el = document.getElementById('skills-bar-chart');
    if (!el) return;
    if (chartInstances.skills) chartInstances.skills.destroy();
    chartInstances.skills = new Chart(el, {
      type: 'bar',
      data: {
        labels: ['Python', 'SQL', 'ML/AI', 'Power BI', 'R', 'Deep Learning', 'Cloud/MLOps', 'NLP'],
        datasets: [{
          label: 'Proficiency %',
          data: [92, 90, 90, 88, 85, 82, 80, 78],
          backgroundColor: [
            'rgba(255, 159, 0, 0.8)',
            'rgba(255, 140, 0, 0.75)',
            'rgba(255, 120, 30, 0.7)',
            'rgba(255, 107, 107, 0.7)',
            'rgba(255, 90, 60, 0.65)',
            'rgba(230, 80, 80, 0.65)',
            'rgba(200, 70, 70, 0.6)',
            'rgba(180, 60, 60, 0.6)'
          ],
          borderColor: '#ff9f00',
          borderWidth: 1,
          borderRadius: 6,
          barPercentage: 0.7
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: animDuration, easing: animEasing },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: colors.tooltipBg, titleColor: colors.tooltipText, bodyColor: colors.tooltipText,
            callbacks: { label: function (ctx) { return ctx.parsed.x + '%'; } }
          }
        },
        scales: {
          x: { max: 100, grid: { color: colors.grid }, ticks: { callback: function (v) { return v + '%'; } } },
          y: { grid: { display: false } }
        }
      }
    });
  }

  function initDomainChart() {
    if (typeof Chart === 'undefined') return;
    var colors = getChartColors();
    var el = document.getElementById('domain-doughnut-chart');
    if (!el) return;
    if (chartInstances.domain) chartInstances.domain.destroy();
    chartInstances.domain = new Chart(el, {
      type: 'doughnut',
      data: {
        labels: ['Machine Learning', 'Analytics/BI', 'Deep Learning/NLP', 'Time Series', 'Computer Vision', 'Other'],
        datasets: [{
          data: [18, 12, 8, 5, 4, 3],
          backgroundColor: ['#ff9f00', '#ff6b6b', '#ffd700', '#4caf50', '#2196f3', '#9c27b0'],
          borderColor: document.body.classList.contains('light-mode') ? '#fff' : '#1a1a1a',
          borderWidth: 2, hoverOffset: 8
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '55%',
        animation: { duration: animDuration, easing: animEasing },
        plugins: {
          legend: { position: 'bottom', labels: { padding: 16, usePointStyle: true, pointStyleWidth: 10 } },
          tooltip: {
            backgroundColor: colors.tooltipBg, titleColor: colors.tooltipText, bodyColor: colors.tooltipText,
            callbacks: { label: function (ctx) { return ctx.label + ': ' + ctx.parsed + ' projects'; } }
          }
        }
      }
    });
  }

  function initRadarChart() {
    if (typeof Chart === 'undefined') return;
    var colors = getChartColors();
    var el = document.getElementById('tech-radar-chart');
    if (!el) return;
    if (chartInstances.radar) chartInstances.radar.destroy();
    chartInstances.radar = new Chart(el, {
      type: 'radar',
      data: {
        labels: ['Python', 'SQL', 'ML', 'Power BI', 'R', 'Deep Learning', 'Cloud', 'NLP'],
        datasets: [
          {
            label: 'Current (2026)', data: [92, 90, 90, 88, 85, 82, 80, 78],
            borderColor: '#ff9f00', backgroundColor: 'rgba(255, 159, 0, 0.15)',
            borderWidth: 2, pointBackgroundColor: '#ff9f00', pointRadius: 4
          },
          {
            label: '2024 Level', data: [78, 75, 72, 70, 68, 55, 50, 45],
            borderColor: 'rgba(255, 107, 107, 0.6)', backgroundColor: 'rgba(255, 107, 107, 0.08)',
            borderWidth: 1.5, borderDash: [5, 5],
            pointBackgroundColor: 'rgba(255, 107, 107, 0.6)', pointRadius: 3
          }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        animation: { duration: animDuration, easing: animEasing },
        scales: {
          r: {
            beginAtZero: true, max: 100,
            ticks: { stepSize: 20, display: false },
            grid: { color: colors.grid }, angleLines: { color: colors.grid },
            pointLabels: { font: { size: 11, weight: 600 } }
          }
        },
        plugins: {
          legend: { position: 'bottom', labels: { padding: 16, usePointStyle: true } },
          tooltip: { backgroundColor: colors.tooltipBg, titleColor: colors.tooltipText, bodyColor: colors.tooltipText }
        }
      }
    });
  }

  function initTimelineChart() {
    if (typeof Chart === 'undefined') return;
    var colors = getChartColors();
    var el = document.getElementById('career-timeline-chart');
    if (!el) return;
    if (chartInstances.timeline) chartInstances.timeline.destroy();
    var ctx2d = el.getContext('2d');
    var gradient = ctx2d.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(255, 159, 0, 0.4)');
    gradient.addColorStop(1, 'rgba(255, 159, 0, 0.02)');
    chartInstances.timeline = new Chart(el, {
      type: 'line',
      data: {
        labels: ['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'],
        datasets: [{
          label: 'Skills Growth Index',
          data: [10, 15, 22, 30, 38, 48, 58, 68, 78, 88, 95],
          borderColor: '#ff9f00', backgroundColor: gradient, borderWidth: 2.5,
          fill: true, tension: 0.4, pointBackgroundColor: '#ff9f00',
          pointBorderColor: '#fff', pointBorderWidth: 2, pointRadius: 4, pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        animation: { duration: animDuration, easing: animEasing },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: colors.tooltipBg, titleColor: colors.tooltipText, bodyColor: colors.tooltipText,
            callbacks: {
              title: function (items) {
                var milestones = {
                  '2016': 'B.Tech Started', '2019': 'IoT Internship (IBM)',
                  '2020': 'B.Tech + MBA Started', '2021': 'Data Analyst Role',
                  '2022': 'Research Assistant + MBA', '2023': 'M.S. Data Analytics',
                  '2024': 'Python/ML Bootcamp', '2026': 'Azure DP-100 Certified'
                };
                var year = items[0].label;
                return milestones[year] ? year + ' - ' + milestones[year] : year;
              },
              label: function (ctx) { return 'Growth Index: ' + ctx.parsed.y; }
            }
          }
        },
        scales: {
          x: { grid: { color: colors.grid } },
          y: { beginAtZero: true, max: 100, grid: { color: colors.grid }, ticks: { callback: function (v) { return v + '%'; } } }
        }
      }
    });
  }

  // Map each canvas ID to its init function
  var chartInitMap = {
    'skills-bar-chart': initSkillsChart,
    'domain-doughnut-chart': initDomainChart,
    'tech-radar-chart': initRadarChart,
    'career-timeline-chart': initTimelineChart
  };

  function initDashboardTab() {
    // Observe each chart card individually
    var chartCards = document.querySelectorAll('.chart-card');
    if (chartCards.length > 0) {
      var cardObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var canvas = entry.target.querySelector('canvas');
            if (canvas && chartInitMap[canvas.id] && !canvas.dataset.initialized) {
              canvas.dataset.initialized = 'true';
              chartInitMap[canvas.id]();
            }
            cardObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      chartCards.forEach(function (card) { cardObserver.observe(card); });
    }
  }

  // Re-render all active charts on theme toggle
  var themeObserver = new MutationObserver(function () {
    Object.keys(chartInitMap).forEach(function (id) {
      var canvas = document.getElementById(id);
      if (canvas && canvas.dataset.initialized) {
        chartInitMap[id]();
      }
    });
    // Re-render feature charts that need theme updates
    if (initFlags.statistics) {
      if (chartInstances.abChart) initABChart();
      if (chartInstances.tsOriginal) initTimeSeries();
    }
    if (initFlags.mlLab) {
      if (chartInstances.biasApproval) initBiasCharts();
    }
  });
  themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

  // ====== ML LAB TAB ======
  function initMLLabTab() {
    initMLPrediction();
    initConfusionMatrix();
    initKMeans();
    initDecisionTree();
    initBiasFairness();
    initRegression();
  }

  // ====== ML PREDICTION ENGINE ======
  function initMLPrediction() {
    var predictBtn = document.getElementById('ml-predict-btn');
    if (!predictBtn) return;

    var coefficients = {
      intercept: 120,
      brand: { apple: 180, samsung: 0, xiaomi: -40, oneplus: 60, google: 90 },
      ram: 22,
      storage: 0.45,
      age: -55,
      condition: 35
    };

    predictBtn.addEventListener('click', function () {
      var brand = document.getElementById('ml-brand').value;
      var ram = parseFloat(document.getElementById('ml-ram').value);
      var storage = parseFloat(document.getElementById('ml-storage').value);
      var age = parseFloat(document.getElementById('ml-age').value);
      var condition = parseFloat(document.getElementById('ml-condition').value);

      var price = coefficients.intercept
        + (coefficients.brand[brand] || 0)
        + coefficients.ram * ram
        + coefficients.storage * storage
        + coefficients.age * age
        + coefficients.condition * condition;

      price = Math.max(25, Math.min(950, price));
      price = Math.round(price);

      var centrality = 1;
      centrality -= Math.abs(ram - 8) * 0.03;
      centrality -= Math.abs(storage - 128) * 0.0003;
      centrality -= Math.abs(age - 2) * 0.04;
      centrality -= Math.abs(condition - 3) * 0.03;
      var confidence = Math.max(65, Math.min(95, Math.round(centrality * 90)));

      animatePrice(price);
      drawConfidenceGauge(confidence);

      var brandImpact = coefficients.brand[brand] || 0;
      var factors = [
        { name: 'Base Price', impact: coefficients.intercept },
        { name: 'Brand (' + brand.charAt(0).toUpperCase() + brand.slice(1) + ')', impact: brandImpact },
        { name: 'RAM (' + ram + ' GB)', impact: coefficients.ram * ram },
        { name: 'Storage (' + storage + ' GB)', impact: coefficients.storage * storage },
        { name: 'Age (' + age + ' yr)', impact: coefficients.age * age },
        { name: 'Condition (' + condition + '/5)', impact: coefficients.condition * condition }
      ];

      var tbody = document.getElementById('ml-factors-body');
      tbody.innerHTML = '';
      factors.forEach(function (f) {
        var tr = document.createElement('tr');
        var sign = f.impact >= 0 ? '+' : '';
        var cls = f.impact >= 0 ? 'positive' : 'negative';
        tr.innerHTML = '<td>' + f.name + '</td><td class="' + cls + '">' + sign + '$' + Math.round(f.impact) + '</td>';
        tbody.appendChild(tr);
      });

      document.getElementById('ml-conf-text').textContent = confidence + '%';
    });

    function animatePrice(target) {
      var el = document.getElementById('ml-price');
      var start = performance.now();
      var duration = 1200;

      function tick(now) {
        var elapsed = now - start;
        var progress = Math.min(elapsed / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.round(eased * target);
        el.textContent = '$' + current;
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = '$' + target;
      }
      requestAnimationFrame(tick);
    }

    function drawConfidenceGauge(value) {
      var canvas = document.getElementById('ml-confidence-gauge');
      if (!canvas) return;
      var ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      var cx = canvas.width / 2;
      var cy = canvas.height - 10;
      var radius = 60;
      var startAngle = Math.PI;
      var endAngle = 2 * Math.PI;
      var valueAngle = startAngle + ((value - 0) / 100) * Math.PI;

      ctx.beginPath();
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.lineWidth = 12;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineCap = 'round';
      ctx.stroke();

      var grad = ctx.createLinearGradient(cx - radius, cy, cx + radius, cy);
      grad.addColorStop(0, '#ff6b6b');
      grad.addColorStop(0.5, '#ffd700');
      grad.addColorStop(1, '#4caf50');
      ctx.beginPath();
      ctx.arc(cx, cy, radius, startAngle, valueAngle);
      ctx.lineWidth = 12;
      ctx.strokeStyle = grad;
      ctx.lineCap = 'round';
      ctx.stroke();

      var dotX = cx + Math.cos(valueAngle) * radius;
      var dotY = cy + Math.sin(valueAngle) * radius;
      ctx.beginPath();
      ctx.arc(dotX, dotY, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#ff9f00';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  // ====== CONFUSION MATRIX EXPLORER ======
  function initConfusionMatrix() {
    // Generate 200 synthetic predictions
    var cmData = [];
    for (var i = 0; i < 200; i++) {
      var actual = Math.random() < 0.4 ? 1 : 0;
      var prob;
      if (actual === 1) {
        prob = 0.3 + Math.random() * 0.6; // positive class: higher probabilities
      } else {
        prob = Math.random() * 0.7; // negative class: lower probabilities
      }
      cmData.push({ actual: actual, probability: prob });
    }

    // Pre-compute ROC curve points
    var rocPoints = [];
    for (var t = 0; t <= 1.0; t += 0.01) {
      var tp = 0, fp = 0, fn = 0, tn = 0;
      cmData.forEach(function (d) {
        var pred = d.probability >= t ? 1 : 0;
        if (d.actual === 1 && pred === 1) tp++;
        else if (d.actual === 0 && pred === 1) fp++;
        else if (d.actual === 1 && pred === 0) fn++;
        else tn++;
      });
      var tpr = tp + fn > 0 ? tp / (tp + fn) : 0;
      var fpr = fp + tn > 0 ? fp / (fp + tn) : 0;
      rocPoints.push({ threshold: Math.round(t * 100) / 100, fpr: fpr, tpr: tpr });
    }

    // Compute AUC via trapezoidal rule
    rocPoints.sort(function (a, b) { return a.fpr - b.fpr; });
    var auc = 0;
    for (var j = 1; j < rocPoints.length; j++) {
      auc += (rocPoints[j].fpr - rocPoints[j - 1].fpr) * (rocPoints[j].tpr + rocPoints[j - 1].tpr) / 2;
    }
    auc = Math.round(auc * 1000) / 1000;

    var slider = document.getElementById('cm-threshold');
    var thresholdVal = document.getElementById('cm-threshold-val');

    function updateCM(threshold) {
      var tp = 0, fp = 0, fn = 0, tn = 0;
      cmData.forEach(function (d) {
        var pred = d.probability >= threshold ? 1 : 0;
        if (d.actual === 1 && pred === 1) tp++;
        else if (d.actual === 0 && pred === 1) fp++;
        else if (d.actual === 1 && pred === 0) fn++;
        else tn++;
      });

      document.getElementById('cm-tp').textContent = 'TP: ' + tp;
      document.getElementById('cm-fn').textContent = 'FN: ' + fn;
      document.getElementById('cm-fp').textContent = 'FP: ' + fp;
      document.getElementById('cm-tn').textContent = 'TN: ' + tn;

      var accuracy = (tp + tn) / (tp + tn + fp + fn);
      var precision = tp + fp > 0 ? tp / (tp + fp) : 0;
      var recall = tp + fn > 0 ? tp / (tp + fn) : 0;
      var f1 = precision + recall > 0 ? 2 * precision * recall / (precision + recall) : 0;

      document.getElementById('cm-accuracy').textContent = (accuracy * 100).toFixed(1) + '%';
      document.getElementById('cm-precision').textContent = (precision * 100).toFixed(1) + '%';
      document.getElementById('cm-recall').textContent = (recall * 100).toFixed(1) + '%';
      document.getElementById('cm-f1').textContent = (f1 * 100).toFixed(1) + '%';

      thresholdVal.textContent = threshold.toFixed(2);

      drawROC(threshold);
    }

    function drawROC(threshold) {
      var canvas = document.getElementById('cm-roc-canvas');
      if (!canvas) return;
      var ctx = canvas.getContext('2d');
      var w = canvas.width;
      var h = canvas.height;
      var pad = 40;
      var isLight = document.body.classList.contains('light-mode');

      ctx.clearRect(0, 0, w, h);

      // Background
      ctx.fillStyle = isLight ? '#f9f9f9' : 'rgba(0,0,0,0.3)';
      ctx.fillRect(pad, 0, w - pad, h - pad);

      // Diagonal line
      ctx.beginPath();
      ctx.moveTo(pad, h - pad);
      ctx.lineTo(w, 0);
      ctx.strokeStyle = 'rgba(150,150,150,0.3)';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);

      // Axes
      ctx.beginPath();
      ctx.moveTo(pad, 0);
      ctx.lineTo(pad, h - pad);
      ctx.lineTo(w, h - pad);
      ctx.strokeStyle = isLight ? '#ccc' : 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Axis labels
      ctx.fillStyle = isLight ? '#777' : '#888';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('FPR', (pad + w) / 2, h - 5);
      ctx.save();
      ctx.translate(12, (h - pad) / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('TPR', 0, 0);
      ctx.restore();

      // ROC curve
      ctx.beginPath();
      var plotW = w - pad;
      var plotH = h - pad;
      rocPoints.forEach(function (pt, idx) {
        var x = pad + pt.fpr * plotW;
        var y = (h - pad) - pt.tpr * plotH;
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = '#ff9f00';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Fill under curve
      ctx.lineTo(pad + plotW, h - pad);
      ctx.lineTo(pad, h - pad);
      ctx.closePath();
      ctx.fillStyle = 'rgba(255, 159, 0, 0.1)';
      ctx.fill();

      // Current threshold point
      var currentTPR = 0, currentFPR = 0;
      var closest = Infinity;
      rocPoints.forEach(function (pt) {
        var diff = Math.abs(pt.threshold - threshold);
        if (diff < closest) {
          closest = diff;
          currentTPR = pt.tpr;
          currentFPR = pt.fpr;
        }
      });

      var cx = pad + currentFPR * plotW;
      var cy = (h - pad) - currentTPR * plotH;
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#ff6b6b';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      document.getElementById('cm-auc-badge').textContent = 'AUC: ' + auc.toFixed(3);
    }

    slider.addEventListener('input', function () {
      updateCM(parseFloat(slider.value));
    });
    updateCM(0.5);
  }

  // ====== K-MEANS CLUSTERING ======
  function initKMeans() {
    var canvas = document.getElementById('kmeans-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var points = [];
    var centroids = [];
    var assignments = [];
    var k = 3;
    var running = false;
    var statusEl = document.getElementById('kmeans-status');
    var clusterColors = ['#ff9f00', '#ff6b6b', '#4caf50', '#42a5f5', '#ab47bc', '#ffd700'];

    // Handle canvas click
    canvas.addEventListener('click', function (e) {
      if (running) return;
      var rect = canvas.getBoundingClientRect();
      var scaleX = canvas.width / rect.width;
      var scaleY = canvas.height / rect.height;
      var x = (e.clientX - rect.left) * scaleX;
      var y = (e.clientY - rect.top) * scaleY;
      points.push({ x: x, y: y });
      assignments = [];
      centroids = [];
      drawKMeans();
      statusEl.textContent = points.length + ' points placed';
    });

    // K selector
    document.querySelectorAll('.kmeans-k-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.kmeans-k-btn').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        k = parseInt(btn.getAttribute('data-k'));
      });
    });

    // Clear
    document.getElementById('kmeans-clear').addEventListener('click', function () {
      points = [];
      centroids = [];
      assignments = [];
      running = false;
      drawKMeans();
      statusEl.textContent = 'Click canvas to add points';
    });

    // Random points
    document.getElementById('kmeans-random').addEventListener('click', function () {
      points = [];
      centroids = [];
      assignments = [];
      running = false;
      // Generate clusters of random points
      var numClusters = 3 + Math.floor(Math.random() * 3);
      for (var c = 0; c < numClusters; c++) {
        var cx = 80 + Math.random() * (canvas.width - 160);
        var cy = 60 + Math.random() * (canvas.height - 120);
        var count = 15 + Math.floor(Math.random() * 15);
        for (var p = 0; p < count; p++) {
          points.push({
            x: cx + (Math.random() - 0.5) * 100,
            y: cy + (Math.random() - 0.5) * 80
          });
        }
      }
      drawKMeans();
      statusEl.textContent = points.length + ' random points generated';
    });

    // Run K-Means
    document.getElementById('kmeans-run').addEventListener('click', function () {
      if (running || points.length < k) {
        statusEl.textContent = points.length < k ? 'Need at least ' + k + ' points' : 'Already running...';
        return;
      }
      running = true;
      statusEl.textContent = 'Initializing centroids...';

      // Initialize centroids randomly from points
      var shuffled = points.slice().sort(function () { return Math.random() - 0.5; });
      centroids = shuffled.slice(0, k).map(function (p) { return { x: p.x, y: p.y }; });
      assignments = new Array(points.length).fill(0);

      var iteration = 0;
      var maxIter = 50;

      function step() {
        // Assign points to nearest centroid
        var changed = false;
        for (var i = 0; i < points.length; i++) {
          var minDist = Infinity;
          var nearest = 0;
          for (var j = 0; j < centroids.length; j++) {
            var dx = points[i].x - centroids[j].x;
            var dy = points[i].y - centroids[j].y;
            var dist = dx * dx + dy * dy;
            if (dist < minDist) {
              minDist = dist;
              nearest = j;
            }
          }
          if (assignments[i] !== nearest) {
            assignments[i] = nearest;
            changed = true;
          }
        }

        // Update centroids
        for (var c = 0; c < k; c++) {
          var sumX = 0, sumY = 0, count = 0;
          for (var i = 0; i < points.length; i++) {
            if (assignments[i] === c) {
              sumX += points[i].x;
              sumY += points[i].y;
              count++;
            }
          }
          if (count > 0) {
            centroids[c] = { x: sumX / count, y: sumY / count };
          }
        }

        iteration++;
        drawKMeans();
        statusEl.textContent = 'Iteration ' + iteration;

        if (changed && iteration < maxIter) {
          animFrameIds.kmeans = requestAnimationFrame(function () {
            setTimeout(step, 200);
          });
        } else {
          running = false;
          statusEl.textContent = 'Converged! (' + iteration + ' iterations)';
        }
      }

      step();
    });

    function drawKMeans() {
      var isLight = document.body.classList.contains('light-mode');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1;
      for (var gx = 0; gx < canvas.width; gx += 50) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, canvas.height);
        ctx.stroke();
      }
      for (var gy = 0; gy < canvas.height; gy += 50) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(canvas.width, gy);
        ctx.stroke();
      }

      // Draw points
      points.forEach(function (pt, i) {
        var color = assignments.length > 0 ? clusterColors[assignments[i] % clusterColors.length] : (isLight ? '#666' : '#aaa');
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = isLight ? '#fff' : 'rgba(0,0,0,0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Draw centroids
      centroids.forEach(function (c, i) {
        ctx.beginPath();
        ctx.arc(c.x, c.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = clusterColors[i % clusterColors.length];
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Cross mark
        ctx.beginPath();
        ctx.moveTo(c.x - 5, c.y - 5);
        ctx.lineTo(c.x + 5, c.y + 5);
        ctx.moveTo(c.x + 5, c.y - 5);
        ctx.lineTo(c.x - 5, c.y + 5);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    }

    drawKMeans();
  }

  // ====== DECISION TREE BUILDER ======
  function initDecisionTree() {
    var dataset = [
      { Outlook: 'Sunny', Temp: 'Hot', Humidity: 'High', Wind: 'Weak', Play: 'No' },
      { Outlook: 'Sunny', Temp: 'Hot', Humidity: 'High', Wind: 'Strong', Play: 'No' },
      { Outlook: 'Overcast', Temp: 'Hot', Humidity: 'High', Wind: 'Weak', Play: 'Yes' },
      { Outlook: 'Rain', Temp: 'Mild', Humidity: 'High', Wind: 'Weak', Play: 'Yes' },
      { Outlook: 'Rain', Temp: 'Cool', Humidity: 'Normal', Wind: 'Weak', Play: 'Yes' },
      { Outlook: 'Rain', Temp: 'Cool', Humidity: 'Normal', Wind: 'Strong', Play: 'No' },
      { Outlook: 'Overcast', Temp: 'Cool', Humidity: 'Normal', Wind: 'Strong', Play: 'Yes' },
      { Outlook: 'Sunny', Temp: 'Mild', Humidity: 'High', Wind: 'Weak', Play: 'No' },
      { Outlook: 'Sunny', Temp: 'Cool', Humidity: 'Normal', Wind: 'Weak', Play: 'Yes' },
      { Outlook: 'Rain', Temp: 'Mild', Humidity: 'Normal', Wind: 'Weak', Play: 'Yes' },
      { Outlook: 'Sunny', Temp: 'Mild', Humidity: 'Normal', Wind: 'Strong', Play: 'Yes' },
      { Outlook: 'Overcast', Temp: 'Mild', Humidity: 'High', Wind: 'Strong', Play: 'Yes' },
      { Outlook: 'Overcast', Temp: 'Hot', Humidity: 'Normal', Wind: 'Weak', Play: 'Yes' },
      { Outlook: 'Rain', Temp: 'Mild', Humidity: 'High', Wind: 'Strong', Play: 'No' }
    ];

    var features = ['Outlook', 'Temp', 'Humidity', 'Wind'];

    // Populate dataset table
    var tbody = document.querySelector('#dtree-dataset tbody');
    dataset.forEach(function (row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row.Outlook + '</td><td>' + row.Temp + '</td><td>' + row.Humidity + '</td><td>' + row.Wind + '</td><td style="font-weight:700;color:' + (row.Play === 'Yes' ? '#4caf50' : '#ff6b6b') + '">' + row.Play + '</td>';
      tbody.appendChild(tr);
    });

    var narratorEl = document.getElementById('dtree-narrator');
    var narratorText = document.getElementById('dtree-narrator-text');
    var treeEl = document.getElementById('dtree-tree');
    var stepTimer = null;

    function narrate(msg) {
      narratorEl.style.display = 'flex';
      narratorText.innerHTML = msg;
    }

    function hideNarrator() {
      narratorEl.style.display = 'none';
    }

    // Plain-English question for a feature
    var featureQuestions = {
      'Outlook': 'What is the weather outlook?',
      'Temp': 'What is the temperature?',
      'Humidity': 'How humid is it?',
      'Wind': 'How strong is the wind?'
    };

    var featureEmojis = {
      'Outlook': 'fa-cloud-sun',
      'Temp': 'fa-thermometer-half',
      'Humidity': 'fa-tint',
      'Wind': 'fa-wind'
    };

    function entropy(data) {
      var total = data.length;
      if (total === 0) return 0;
      var yes = data.filter(function (d) { return d.Play === 'Yes'; }).length;
      var no = total - yes;
      if (yes === 0 || no === 0) return 0;
      var pYes = yes / total;
      var pNo = no / total;
      return -(pYes * Math.log2(pYes) + pNo * Math.log2(pNo));
    }

    function infoGain(data, feature) {
      var parentEntropy = entropy(data);
      var values = {};
      data.forEach(function (d) {
        if (!values[d[feature]]) values[d[feature]] = [];
        values[d[feature]].push(d);
      });
      var weightedEntropy = 0;
      Object.keys(values).forEach(function (val) {
        weightedEntropy += (values[val].length / data.length) * entropy(values[val]);
      });
      return parentEntropy - weightedEntropy;
    }

    function majorityClass(data) {
      var yes = data.filter(function (d) { return d.Play === 'Yes'; }).length;
      return yes >= data.length - yes ? 'Yes' : 'No';
    }

    function buildTreeFull(data, availableFeatures) {
      var yes = data.filter(function (d) { return d.Play === 'Yes'; }).length;
      var no = data.length - yes;

      if (yes === 0 || no === 0 || availableFeatures.length === 0) {
        return { leaf: true, label: majorityClass(data), count: data.length, yes: yes, no: no };
      }

      var bestFeature = null;
      var bestIG = -1;
      availableFeatures.forEach(function (f) {
        var ig = infoGain(data, f);
        if (ig > bestIG) {
          bestIG = ig;
          bestFeature = f;
        }
      });

      var values = {};
      data.forEach(function (d) {
        if (!values[d[bestFeature]]) values[d[bestFeature]] = [];
        values[d[bestFeature]].push(d);
      });

      var remaining = availableFeatures.filter(function (f) { return f !== bestFeature; });
      var children = {};
      Object.keys(values).forEach(function (val) {
        children[val] = buildTreeFull(values[val], remaining);
      });

      return {
        leaf: false,
        feature: bestFeature,
        ig: bestIG,
        count: data.length,
        yes: yes,
        no: data.length - yes,
        children: children
      };
    }

    function renderTreeHTML(node, depth) {
      depth = depth || 0;
      if (node.leaf) {
        var reason = node.yes === node.count ? 'All ' + node.count + ' cases played'
          : node.no === node.count ? 'None of the ' + node.count + ' cases played'
          : node.yes + ' of ' + node.count + ' played (majority)';
        return '<div class="dtree-leaf ' + (node.label === 'Yes' ? 'yes' : 'no') + '">' +
          '<i class="fas fa-' + (node.label === 'Yes' ? 'check-circle' : 'times-circle') + '"></i> ' +
          (node.label === 'Yes' ? 'Play Tennis!' : 'Stay Home') +
          ' <span class="dtree-leaf-reason">(' + reason + ')</span>' +
          '</div>';
      }

      var question = featureQuestions[node.feature] || 'Check ' + node.feature;
      var icon = featureEmojis[node.feature] || 'fa-question';

      var html = '<div class="dtree-node">';
      html += '<div class="dtree-node-question"><i class="fas ' + icon + '"></i> ' + question + '</div>';
      html += '<div class="dtree-node-why">Best question to ask here (separates outcomes ' + (node.ig * 100).toFixed(0) + '% better than random)</div>';
      html += '<div class="dtree-node-stats">';
      html += '<span><i class="fas fa-database"></i> ' + node.count + ' days</span>';
      html += '<span style="color:#4caf50"><i class="fas fa-check"></i> ' + node.yes + ' played</span>';
      html += '<span style="color:#ff6b6b"><i class="fas fa-times"></i> ' + node.no + ' stayed home</span>';
      html += '</div>';
      html += '<div class="dtree-node-children">';
      Object.keys(node.children).forEach(function (val) {
        html += '<div class="dtree-branch-label"><i class="fas fa-arrow-right"></i> If ' + node.feature.toLowerCase() + ' is <strong>' + val + '</strong>:</div>';
        html += renderTreeHTML(node.children[val], depth + 1);
      });
      html += '</div></div>';
      return html;
    }

    // Collect nodes in BFS order for step-by-step
    function collectNodes(node, path) {
      path = path || 'Root';
      var result = [];
      if (!node.leaf) {
        result.push({ node: node, path: path });
        Object.keys(node.children).forEach(function (val) {
          collectNodes(node.children[val], path + ' > ' + node.feature + '=' + val).forEach(function (n) {
            result.push(n);
          });
        });
      }
      return result;
    }

    // Step-by-step build
    function buildStepByStep() {
      clearStepTimer();
      hideNarrator();
      treeEl.innerHTML = '<div class="dtree-prompt">Building...</div>';

      var fullTree = buildTreeFull(dataset, features.slice());
      var allNodes = collectNodes(fullTree);
      var stepIndex = 0;

      // Start narrating
      narrate('Starting with all 14 days of data. The algorithm will look at each weather feature (Outlook, Temperature, Humidity, Wind) and pick the one that best predicts whether we play tennis...');

      function nextStep() {
        if (stepIndex >= allNodes.length) {
          treeEl.innerHTML = renderTreeHTML(fullTree);
          narrate('<strong>Done!</strong> The tree is complete. Now for any new day, just follow the questions from top to bottom to predict: Play Tennis or Stay Home? This is exactly how decision trees work in real ML models, just with more features and data.');
          return;
        }

        var current = allNodes[stepIndex];
        var n = current.node;
        var featureScores = features.map(function (f) {
          return f + ': ' + (infoGain(dataset, f) * 100).toFixed(0) + '%';
        }).join(', ');

        var stepNarration;
        if (stepIndex === 0) {
          stepNarration = '<strong>Step 1:</strong> Which question separates "Play" from "Stay Home" the best? The algorithm scores each feature: ' + featureScores + '. <strong>"' + n.feature + '"</strong> wins because it creates the cleanest groups. Now we split the data by ' + n.feature.toLowerCase() + '...';
        } else {
          var vals = Object.keys(n.children);
          stepNarration = '<strong>Step ' + (stepIndex + 1) + ':</strong> In this branch (' + current.path + '), we have ' + n.count + ' days (' + n.yes + ' played, ' + n.no + ' stayed home). Still mixed, so we ask another question: <strong>"' + featureQuestions[n.feature] + '"</strong> This splits into: ' + vals.join(', ') + '.';
        }

        narrate(stepNarration);
        // Show tree up to this step (render full tree)
        treeEl.innerHTML = renderTreeHTML(fullTree);

        stepIndex++;
        stepTimer = setTimeout(nextStep, 3500);
      }

      stepTimer = setTimeout(nextStep, 2000);
    }

    function clearStepTimer() {
      if (stepTimer) {
        clearTimeout(stepTimer);
        stepTimer = null;
      }
    }

    // Step-by-Step button
    document.getElementById('dtree-auto').addEventListener('click', function () {
      buildStepByStep();
    });

    // Instant build button
    document.getElementById('dtree-instant').addEventListener('click', function () {
      clearStepTimer();
      var fullTree = buildTreeFull(dataset, features.slice());
      treeEl.innerHTML = renderTreeHTML(fullTree);
      narrate('<strong>Tree built!</strong> Read it top-to-bottom: each orange box is a question about the weather. Follow the arrows based on the answer. The green/red boxes at the bottom are the predictions. For example: if it is Overcast, always play tennis (all 4 overcast days were "Play").');
    });

    // Reset
    document.getElementById('dtree-reset').addEventListener('click', function () {
      clearStepTimer();
      hideNarrator();
      treeEl.innerHTML = '<div class="dtree-prompt">Click "Build Tree Step-by-Step" to watch the algorithm learn rules from the data</div>';
    });
  }

  // ====== BIAS/FAIRNESS DETECTOR ======
  function initBiasFairness() {
    var scenarios = {
      'default': {
        groupA: { total: 500, approved: 320, tp: 280, fn: 40, fp: 40, tn: 140 },
        groupB: { total: 500, approved: 260, tp: 220, fn: 60, fp: 40, tn: 180 }
      },
      'biased': {
        groupA: { total: 500, approved: 380, tp: 320, fn: 20, fp: 60, tn: 100 },
        groupB: { total: 500, approved: 160, tp: 130, fn: 90, fp: 30, tn: 250 }
      },
      'fair': {
        groupA: { total: 500, approved: 300, tp: 260, fn: 40, fp: 40, tn: 160 },
        groupB: { total: 500, approved: 290, tp: 250, fn: 45, fp: 40, tn: 165 }
      }
    };

    var select = document.getElementById('bias-scenario');

    function updateBias(scenarioKey) {
      var s = scenarios[scenarioKey];
      var rateA = s.groupA.approved / s.groupA.total;
      var rateB = s.groupB.approved / s.groupB.total;
      var tprA = s.groupA.tp / (s.groupA.tp + s.groupA.fn);
      var tprB = s.groupB.tp / (s.groupB.tp + s.groupB.fn);

      var di = rateB / rateA;
      var spd = rateB - rateA;
      var eod = tprB - tprA;

      document.getElementById('bias-di-val').textContent = di.toFixed(3);
      document.getElementById('bias-spd-val').textContent = spd.toFixed(3);
      document.getElementById('bias-eod-val').textContent = eod.toFixed(3);

      // Traffic lights
      setTrafficLight('bias-di-light', di >= 0.8 && di <= 1.25 ? 'green' : (di >= 0.7 && di <= 1.35 ? 'yellow' : 'red'));
      setTrafficLight('bias-spd-light', Math.abs(spd) <= 0.1 ? 'green' : (Math.abs(spd) <= 0.15 ? 'yellow' : 'red'));
      setTrafficLight('bias-eod-light', Math.abs(eod) <= 0.1 ? 'green' : (Math.abs(eod) <= 0.15 ? 'yellow' : 'red'));

      initBiasCharts(s, rateA, rateB, tprA, tprB);
    }

    function setTrafficLight(id, color) {
      var el = document.getElementById(id);
      el.className = 'bias-traffic-light ' + color;
    }

    select.addEventListener('change', function () {
      updateBias(select.value);
    });

    updateBias('default');
  }

  function initBiasCharts(scenario, rateA, rateB, tprA, tprB) {
    if (typeof Chart === 'undefined') return;
    var colors = getChartColors();

    // Approval rate chart
    var el1 = document.getElementById('bias-approval-chart');
    if (el1) {
      if (chartInstances.biasApproval) chartInstances.biasApproval.destroy();
      chartInstances.biasApproval = new Chart(el1, {
        type: 'bar',
        data: {
          labels: ['Group A', 'Group B'],
          datasets: [{
            label: 'Approval Rate',
            data: [(rateA * 100).toFixed(1), (rateB * 100).toFixed(1)],
            backgroundColor: ['rgba(255, 159, 0, 0.7)', 'rgba(66, 165, 245, 0.7)'],
            borderColor: ['#ff9f00', '#42a5f5'],
            borderWidth: 2,
            borderRadius: 6
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          animation: { duration: 800 },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: colors.tooltipBg, titleColor: colors.tooltipText, bodyColor: colors.tooltipText,
              callbacks: { label: function (ctx) { return ctx.parsed.y + '%'; } }
            }
          },
          scales: {
            y: { max: 100, grid: { color: colors.grid }, ticks: { callback: function (v) { return v + '%'; } } },
            x: { grid: { display: false } }
          }
        }
      });
    }

    // TPR chart
    var el2 = document.getElementById('bias-tpr-chart');
    if (el2) {
      if (chartInstances.biasTPR) chartInstances.biasTPR.destroy();
      chartInstances.biasTPR = new Chart(el2, {
        type: 'bar',
        data: {
          labels: ['Group A', 'Group B'],
          datasets: [{
            label: 'True Positive Rate',
            data: [(tprA * 100).toFixed(1), (tprB * 100).toFixed(1)],
            backgroundColor: ['rgba(255, 159, 0, 0.7)', 'rgba(66, 165, 245, 0.7)'],
            borderColor: ['#ff9f00', '#42a5f5'],
            borderWidth: 2,
            borderRadius: 6
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          animation: { duration: 800 },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: colors.tooltipBg, titleColor: colors.tooltipText, bodyColor: colors.tooltipText,
              callbacks: { label: function (ctx) { return ctx.parsed.y + '%'; } }
            }
          },
          scales: {
            y: { max: 100, grid: { color: colors.grid }, ticks: { callback: function (v) { return v + '%'; } } },
            x: { grid: { display: false } }
          }
        }
      });
    }
  }

  // ====== STATISTICS TAB ======
  function initStatisticsTab() {
    initABTest();
    initMonteCarlo();
    initBayesian();
    initTimeSeries();
    initCorrelation();
  }

  // ====== A/B TEST CALCULATOR ======
  function initABTest() {
    var calcBtn = document.getElementById('ab-calculate');
    if (!calcBtn) return;

    function normalCDF(x) {
      var a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429;
      var p = 0.3275911;
      var sign = x < 0 ? -1 : 1;
      x = Math.abs(x) / Math.sqrt(2);
      var t = 1.0 / (1.0 + p * x);
      var y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
      return 0.5 * (1.0 + sign * y);
    }

    function calculate() {
      var nA = parseInt(document.getElementById('ab-sampleA').value) || 1;
      var cA = parseInt(document.getElementById('ab-convA').value) || 0;
      var nB = parseInt(document.getElementById('ab-sampleB').value) || 1;
      var cB = parseInt(document.getElementById('ab-convB').value) || 0;

      var rateA = cA / nA;
      var rateB = cB / nB;
      var lift = rateA > 0 ? ((rateB - rateA) / rateA * 100) : 0;

      var pooledP = (cA + cB) / (nA + nB);
      var se = Math.sqrt(pooledP * (1 - pooledP) * (1 / nA + 1 / nB));
      var z = se > 0 ? (rateB - rateA) / se : 0;
      var pValue = 2 * (1 - normalCDF(Math.abs(z)));

      var seDiff = Math.sqrt(rateA * (1 - rateA) / nA + rateB * (1 - rateB) / nB);
      var ciLow = (rateB - rateA) - 1.96 * seDiff;
      var ciHigh = (rateB - rateA) + 1.96 * seDiff;

      var significant = pValue < 0.05;

      document.getElementById('ab-rateA').textContent = (rateA * 100).toFixed(2) + '%';
      document.getElementById('ab-rateB').textContent = (rateB * 100).toFixed(2) + '%';
      document.getElementById('ab-lift').textContent = (lift >= 0 ? '+' : '') + lift.toFixed(1) + '%';
      document.getElementById('ab-pvalue').textContent = pValue < 0.001 ? '<0.001' : pValue.toFixed(4);
      document.getElementById('ab-zstat').textContent = z.toFixed(3);
      document.getElementById('ab-ci').textContent = '[' + (ciLow * 100).toFixed(2) + '%, ' + (ciHigh * 100).toFixed(2) + '%]';

      var verdictEl = document.getElementById('ab-verdict');
      if (significant) {
        verdictEl.className = 'abtest-verdict significant';
        verdictEl.innerHTML = '<i class="fas fa-check-circle"></i> Statistically Significant (p = ' + (pValue < 0.001 ? '<0.001' : pValue.toFixed(4)) + ')';
      } else {
        verdictEl.className = 'abtest-verdict not-significant';
        verdictEl.innerHTML = '<i class="fas fa-minus-circle"></i> Not Statistically Significant (p = ' + pValue.toFixed(4) + ')';
      }

      initABChart(rateA, rateB, seDiff);
    }

    calcBtn.addEventListener('click', calculate);
    calculate(); // Run with defaults
  }

  function initABChart(rateA, rateB, seDiff) {
    if (typeof Chart === 'undefined') return;
    var colors = getChartColors();
    var el = document.getElementById('ab-chart');
    if (!el) return;
    if (chartInstances.abChart) chartInstances.abChart.destroy();

    // Provide defaults if called without arguments (theme toggle)
    if (rateA === undefined) {
      var nA = parseInt(document.getElementById('ab-sampleA').value) || 1;
      var cA = parseInt(document.getElementById('ab-convA').value) || 0;
      var nB = parseInt(document.getElementById('ab-sampleB').value) || 1;
      var cB = parseInt(document.getElementById('ab-convB').value) || 0;
      rateA = cA / nA;
      rateB = cB / nB;
      seDiff = Math.sqrt(rateA * (1 - rateA) / nA + rateB * (1 - rateB) / nB);
    }

    chartInstances.abChart = new Chart(el, {
      type: 'bar',
      data: {
        labels: ['Control (A)', 'Variant (B)'],
        datasets: [{
          label: 'Conversion Rate',
          data: [(rateA * 100).toFixed(2), (rateB * 100).toFixed(2)],
          backgroundColor: ['rgba(150, 150, 150, 0.6)', 'rgba(255, 159, 0, 0.7)'],
          borderColor: ['#999', '#ff9f00'],
          borderWidth: 2,
          borderRadius: 6
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        animation: { duration: 800 },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: colors.tooltipBg, titleColor: colors.tooltipText, bodyColor: colors.tooltipText,
            callbacks: { label: function (ctx) { return ctx.parsed.y + '%'; } }
          }
        },
        scales: {
          y: { grid: { color: colors.grid }, ticks: { callback: function (v) { return v + '%'; } } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // ====== MONTE CARLO SIMULATOR ======
  function initMonteCarlo() {
    var runBtn = document.getElementById('mc-run');
    if (!runBtn) return;

    runBtn.addEventListener('click', function () {
      var investment = parseFloat(document.getElementById('mc-investment').value) || 10000;
      var annualReturn = parseFloat(document.getElementById('mc-return').value) / 100 || 0.08;
      var volatility = parseFloat(document.getElementById('mc-volatility').value) / 100 || 0.15;
      var years = parseInt(document.getElementById('mc-years').value) || 10;
      var numSims = parseInt(document.getElementById('mc-sims').value) || 200;

      numSims = Math.max(50, Math.min(1000, numSims));
      years = Math.max(1, Math.min(30, years));

      // Box-Muller transform for normal random
      function randNormal() {
        var u1 = Math.random();
        var u2 = Math.random();
        return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      }

      // Run simulations
      var allPaths = [];
      var finalValues = [];
      var monthlyReturn = annualReturn / 12;
      var monthlyVol = volatility / Math.sqrt(12);
      var totalMonths = years * 12;

      for (var s = 0; s < numSims; s++) {
        var path = [investment];
        var value = investment;
        for (var m = 1; m <= totalMonths; m++) {
          var shock = monthlyReturn + monthlyVol * randNormal();
          value = value * (1 + shock);
          if (value < 0) value = 0;
          path.push(value);
        }
        allPaths.push(path);
        finalValues.push(value);
      }

      finalValues.sort(function (a, b) { return a - b; });

      var mean = finalValues.reduce(function (s, v) { return s + v; }, 0) / finalValues.length;
      var median = finalValues[Math.floor(finalValues.length / 2)];
      var p5 = finalValues[Math.floor(finalValues.length * 0.05)];
      var p95 = finalValues[Math.floor(finalValues.length * 0.95)];
      var lossCount = finalValues.filter(function (v) { return v < investment; }).length;
      var lossProb = (lossCount / finalValues.length * 100);

      function formatMoney(v) {
        if (v >= 1000000) return '$' + (v / 1000000).toFixed(1) + 'M';
        if (v >= 1000) return '$' + (v / 1000).toFixed(1) + 'K';
        return '$' + v.toFixed(0);
      }

      document.getElementById('mc-mean').textContent = formatMoney(mean);
      document.getElementById('mc-median').textContent = formatMoney(median);
      document.getElementById('mc-p5').textContent = formatMoney(p5);
      document.getElementById('mc-p95').textContent = formatMoney(p95);
      document.getElementById('mc-loss-prob').textContent = lossProb.toFixed(1) + '%';

      // Draw paths on canvas
      drawMCPaths(allPaths, investment, years);
    });

    function drawMCPaths(paths, investment, years) {
      var canvas = document.getElementById('mc-paths-canvas');
      if (!canvas) return;
      var ctx = canvas.getContext('2d');
      var w = canvas.width;
      var h = canvas.height;
      var pad = { top: 20, right: 20, bottom: 40, left: 70 };
      var isLight = document.body.classList.contains('light-mode');

      ctx.clearRect(0, 0, w, h);

      // Find max value for scaling
      var maxVal = 0;
      paths.forEach(function (path) {
        path.forEach(function (v) {
          if (v > maxVal) maxVal = v;
        });
      });
      maxVal *= 1.1;

      var plotW = w - pad.left - pad.right;
      var plotH = h - pad.top - pad.bottom;

      // Axes
      ctx.strokeStyle = isLight ? '#ccc' : 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pad.left, pad.top);
      ctx.lineTo(pad.left, h - pad.bottom);
      ctx.lineTo(w - pad.right, h - pad.bottom);
      ctx.stroke();

      // Y-axis labels
      ctx.fillStyle = isLight ? '#777' : '#888';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'right';
      for (var yt = 0; yt <= 4; yt++) {
        var val = maxVal * yt / 4;
        var yp = (h - pad.bottom) - (yt / 4) * plotH;
        ctx.fillText(val >= 1000 ? '$' + (val / 1000).toFixed(0) + 'K' : '$' + val.toFixed(0), pad.left - 8, yp + 3);

        ctx.beginPath();
        ctx.moveTo(pad.left, yp);
        ctx.lineTo(w - pad.right, yp);
        ctx.strokeStyle = isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)';
        ctx.stroke();
      }

      // X-axis labels
      ctx.textAlign = 'center';
      for (var yr = 0; yr <= years; yr += Math.max(1, Math.floor(years / 5))) {
        var xp = pad.left + (yr / years) * plotW;
        ctx.fillText('Y' + yr, xp, h - pad.bottom + 18);
      }

      // Draw paths
      var totalMonths = paths[0].length - 1;
      paths.forEach(function (path) {
        ctx.beginPath();
        path.forEach(function (v, idx) {
          var x = pad.left + (idx / totalMonths) * plotW;
          var y = (h - pad.bottom) - (v / maxVal) * plotH;
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = 'rgba(255, 159, 0, 0.08)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Draw median path
      var medianPath = [];
      for (var m = 0; m < paths[0].length; m++) {
        var vals = paths.map(function (p) { return p[m]; }).sort(function (a, b) { return a - b; });
        medianPath.push(vals[Math.floor(vals.length / 2)]);
      }
      ctx.beginPath();
      medianPath.forEach(function (v, idx) {
        var x = pad.left + (idx / totalMonths) * plotW;
        var y = (h - pad.bottom) - (v / maxVal) * plotH;
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = '#ff9f00';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Investment line
      var invY = (h - pad.bottom) - (investment / maxVal) * plotH;
      ctx.beginPath();
      ctx.moveTo(pad.left, invY);
      ctx.lineTo(w - pad.right, invY);
      ctx.strokeStyle = 'rgba(255, 107, 107, 0.5)';
      ctx.setLineDash([6, 4]);
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#ff6b6b';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Initial', w - pad.right - 40, invY - 6);
    }
  }

  // ====== BAYESIAN VISUALIZER ======
  function initBayesian() {
    var alphaSlider = document.getElementById('bayes-alpha');
    var betaSlider = document.getElementById('bayes-beta');
    var successesInput = document.getElementById('bayes-successes');
    var trialsInput = document.getElementById('bayes-trials');
    if (!alphaSlider) return;

    // Log-gamma approximation (Stirling)
    function logGamma(z) {
      if (z < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * z)) - logGamma(1 - z);
      z -= 1;
      var x = 0.99999999999980993;
      var p = [676.5203681218851, -1259.1392167224028, 771.32342877765313,
        -176.61502916214059, 12.507343278686905, -0.13857109526572012,
        9.9843695780195716e-6, 1.5056327351493116e-7];
      for (var i = 0; i < p.length; i++) {
        x += p[i] / (z + i + 1);
      }
      var t = z + p.length - 0.5;
      return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
    }

    function betaPDF(x, a, b) {
      if (x <= 0 || x >= 1) return 0;
      var logB = logGamma(a) + logGamma(b) - logGamma(a + b);
      return Math.exp((a - 1) * Math.log(x) + (b - 1) * Math.log(1 - x) - logB);
    }

    function update() {
      var alpha = parseInt(alphaSlider.value);
      var beta = parseInt(betaSlider.value);
      var successes = parseInt(successesInput.value) || 0;
      var trials = parseInt(trialsInput.value) || 0;

      successes = Math.min(successes, trials);

      var postAlpha = alpha + successes;
      var postBeta = beta + (trials - successes);

      document.getElementById('bayes-alpha-val').textContent = alpha;
      document.getElementById('bayes-beta-val').textContent = beta;
      document.getElementById('bp-prior-a').textContent = alpha;
      document.getElementById('bp-prior-b').textContent = beta;
      document.getElementById('bp-post-a').textContent = postAlpha;
      document.getElementById('bp-post-b').textContent = postBeta;
      document.getElementById('bp-post-mean').textContent = (postAlpha / (postAlpha + postBeta)).toFixed(3);

      drawBayesian(alpha, beta, successes, trials, postAlpha, postBeta);
    }

    function drawBayesian(a, b, successes, trials, pa, pb) {
      var canvas = document.getElementById('bayes-canvas');
      if (!canvas) return;
      var ctx = canvas.getContext('2d');
      var w = canvas.width;
      var h = canvas.height;
      var pad = { top: 20, right: 20, bottom: 40, left: 50 };
      var isLight = document.body.classList.contains('light-mode');

      ctx.clearRect(0, 0, w, h);

      var plotW = w - pad.left - pad.right;
      var plotH = h - pad.top - pad.bottom;
      var steps = 200;

      // Compute all three curves
      var priorVals = [], likelihoodVals = [], posteriorVals = [];
      var maxY = 0;
      for (var i = 0; i <= steps; i++) {
        var x = i / steps;
        var pv = betaPDF(x, a, b);
        var lv = trials > 0 ? betaPDF(x, successes + 1, trials - successes + 1) : 0;
        var postv = betaPDF(x, pa, pb);
        priorVals.push(pv);
        likelihoodVals.push(lv);
        posteriorVals.push(postv);
        maxY = Math.max(maxY, pv, lv, postv);
      }
      if (maxY === 0) maxY = 1;

      // Axes
      ctx.strokeStyle = isLight ? '#ccc' : 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pad.left, pad.top);
      ctx.lineTo(pad.left, h - pad.bottom);
      ctx.lineTo(w - pad.right, h - pad.bottom);
      ctx.stroke();

      // X-axis labels
      ctx.fillStyle = isLight ? '#777' : '#888';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      for (var xt = 0; xt <= 10; xt += 2) {
        var xPos = pad.left + (xt / 10) * plotW;
        ctx.fillText((xt / 10).toFixed(1), xPos, h - pad.bottom + 18);
      }

      function drawCurve(values, color, dashed, fill) {
        ctx.beginPath();
        for (var i = 0; i <= steps; i++) {
          var x = pad.left + (i / steps) * plotW;
          var y = (h - pad.bottom) - (values[i] / maxY) * plotH;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        if (dashed) ctx.setLineDash([6, 4]);
        else ctx.setLineDash([]);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.setLineDash([]);

        if (fill) {
          ctx.lineTo(pad.left + plotW, h - pad.bottom);
          ctx.lineTo(pad.left, h - pad.bottom);
          ctx.closePath();
          ctx.fillStyle = fill;
          ctx.fill();
        }
      }

      // Draw in order: likelihood (back), prior, posterior (front)
      if (trials > 0) drawCurve(likelihoodVals, '#888', false, 'rgba(136,136,136,0.05)');
      drawCurve(priorVals, '#42a5f5', true, false);
      drawCurve(posteriorVals, '#ff9f00', false, 'rgba(255,159,0,0.12)');
    }

    alphaSlider.addEventListener('input', update);
    betaSlider.addEventListener('input', update);
    successesInput.addEventListener('input', update);
    trialsInput.addEventListener('input', update);

    update();
  }

  // ====== TIME SERIES DECOMPOSITION ======
  function initTimeSeries() {
    // Classic airline passengers dataset (monthly, 1949-1960, 144 points)
    var rawData = [
      112, 118, 132, 129, 121, 135, 148, 148, 136, 119, 104, 118,
      115, 126, 141, 135, 125, 149, 170, 170, 158, 133, 114, 140,
      145, 150, 178, 163, 172, 178, 199, 199, 184, 162, 146, 166,
      171, 180, 193, 181, 183, 218, 230, 242, 209, 191, 172, 194,
      196, 196, 236, 235, 229, 243, 264, 272, 237, 211, 180, 201,
      204, 188, 235, 227, 234, 264, 302, 293, 259, 229, 203, 229,
      242, 233, 267, 269, 270, 315, 364, 347, 312, 274, 237, 278,
      284, 277, 317, 313, 318, 374, 413, 405, 355, 306, 271, 306,
      315, 301, 356, 348, 355, 422, 465, 467, 404, 347, 305, 336,
      340, 318, 362, 348, 363, 435, 491, 505, 404, 359, 310, 337,
      360, 342, 406, 396, 420, 472, 548, 559, 463, 407, 362, 405,
      417, 391, 419, 461, 472, 535, 622, 606, 508, 461, 390, 432
    ];

    var windowSlider = document.getElementById('ts-window');
    var windowVal = document.getElementById('ts-window-val');
    if (!windowSlider) return;

    function decompose(windowSize) {
      var n = rawData.length;

      // Centered moving average (proper even-window: 2x12 MA method)
      // For even window: compute windowSize-period MA, then average pairs to center
      var trend = new Array(n).fill(null);

      // Step 1: trailing MA of windowSize
      var trailingMA = new Array(n).fill(null);
      for (var i = windowSize - 1; i < n; i++) {
        var sum = 0;
        for (var j = i - windowSize + 1; j <= i; j++) {
          sum += rawData[j];
        }
        trailingMA[i] = sum / windowSize;
      }

      // Step 2: center by averaging consecutive trailing MA values
      if (windowSize % 2 === 0) {
        for (var i = windowSize; i < n; i++) {
          if (trailingMA[i] !== null && trailingMA[i - 1] !== null) {
            trend[i - Math.floor(windowSize / 2)] = (trailingMA[i] + trailingMA[i - 1]) / 2;
          }
        }
      } else {
        // Odd window: trailing MA is already centered at i - floor(windowSize/2)
        var halfW = Math.floor(windowSize / 2);
        for (var i = windowSize - 1; i < n; i++) {
          trend[i - halfW] = trailingMA[i];
        }
      }

      // Detrended = original - trend
      var detrended = new Array(n);
      for (var i = 0; i < n; i++) {
        detrended[i] = trend[i] !== null ? rawData[i] - trend[i] : null;
      }

      // Seasonal: average deviation per calendar month
      var monthSum = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      var monthCnt = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      for (var i = 0; i < n; i++) {
        if (detrended[i] !== null) {
          monthSum[i % 12] += detrended[i];
          monthCnt[i % 12]++;
        }
      }
      var monthAvg = new Array(12);
      for (var m = 0; m < 12; m++) {
        monthAvg[m] = monthCnt[m] > 0 ? monthSum[m] / monthCnt[m] : 0;
      }

      // Center seasonal (remove mean so it sums to ~0)
      var seasonalMean = 0;
      for (var m = 0; m < 12; m++) seasonalMean += monthAvg[m];
      seasonalMean /= 12;
      for (var m = 0; m < 12; m++) monthAvg[m] -= seasonalMean;

      var seasonal = new Array(n);
      for (var i = 0; i < n; i++) {
        seasonal[i] = monthAvg[i % 12];
      }

      // Residual = original - trend - seasonal
      var residual = new Array(n);
      for (var i = 0; i < n; i++) {
        residual[i] = trend[i] !== null ? rawData[i] - trend[i] - seasonal[i] : null;
      }

      // Forecast: extend 12 months using last trend slope + seasonal
      var lastValidTrends = [];
      for (var i = 0; i < n; i++) {
        if (trend[i] !== null) lastValidTrends.push(trend[i]);
      }
      var trendSlope = 0;
      if (lastValidTrends.length >= 2) {
        // Average slope over last 12 valid trend points for stability
        var slopeCount = Math.min(12, lastValidTrends.length - 1);
        for (var s = 0; s < slopeCount; s++) {
          trendSlope += lastValidTrends[lastValidTrends.length - 1 - s] - lastValidTrends[lastValidTrends.length - 2 - s];
        }
        trendSlope /= slopeCount;
      }
      var lastTrend = lastValidTrends.length > 0 ? lastValidTrends[lastValidTrends.length - 1] : rawData[n - 1];

      var forecast = new Array(12);
      for (var f = 0; f < 12; f++) {
        var fTrend = lastTrend + trendSlope * (f + 1);
        var fSeasonal = monthAvg[(n + f) % 12];
        forecast[f] = fTrend + fSeasonal;
      }

      return { trend: trend, seasonal: seasonal, residual: residual, forecast: forecast };
    }

    // Generate labels once
    var labels = [];
    for (var yr = 1949; yr <= 1960; yr++) {
      for (var mo = 1; mo <= 12; mo++) {
        labels.push(yr + '-' + (mo < 10 ? '0' : '') + mo);
      }
    }
    var forecastLabels = [];
    for (var mo = 1; mo <= 12; mo++) {
      forecastLabels.push('1961-' + (mo < 10 ? '0' : '') + mo);
    }
    var allLabels = labels.concat(forecastLabels);

    function makeChartOpts(colors) {
      return {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 600 },
        plugins: {
          legend: { display: false },
          tooltip: { backgroundColor: colors.tooltipBg, titleColor: colors.tooltipText, bodyColor: colors.tooltipText }
        },
        scales: {
          x: {
            grid: { color: colors.grid },
            ticks: {
              maxTicksLimit: 8,
              callback: function (val) {
                var label = this.getLabelForValue(val);
                return label && label.endsWith('-01') ? label.substring(0, 4) : '';
              }
            }
          },
          y: { grid: { color: colors.grid } }
        }
      };
    }

    function renderTSCharts(windowSize) {
      var result = decompose(windowSize);
      var colors = getChartColors();

      // Original + Forecast
      var origData = rawData.slice();
      var forecastData = new Array(rawData.length).fill(null);
      forecastData[rawData.length - 1] = rawData[rawData.length - 1];
      for (var f = 0; f < result.forecast.length; f++) forecastData.push(result.forecast[f]);
      for (var i = rawData.length; i < allLabels.length; i++) origData.push(null);

      var el1 = document.getElementById('ts-original-chart');
      if (el1) {
        if (chartInstances.tsOriginal) chartInstances.tsOriginal.destroy();
        var opts1 = makeChartOpts(colors);
        opts1.plugins.legend = { display: true, position: 'top', labels: { boxWidth: 12, padding: 8 } };
        chartInstances.tsOriginal = new Chart(el1, {
          type: 'line',
          data: {
            labels: allLabels,
            datasets: [
              { label: 'Passengers', data: origData, borderColor: '#ff9f00', borderWidth: 1.5, pointRadius: 0, tension: 0.1, fill: false },
              { label: 'Forecast', data: forecastData, borderColor: '#ff6b6b', borderWidth: 2, borderDash: [6, 4], pointRadius: 0, tension: 0.1, fill: false }
            ]
          },
          options: opts1
        });
      }

      // Trend
      var el2 = document.getElementById('ts-trend-chart');
      if (el2) {
        if (chartInstances.tsTrend) chartInstances.tsTrend.destroy();
        chartInstances.tsTrend = new Chart(el2, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [{ label: 'Trend', data: result.trend.slice(), borderColor: '#42a5f5', borderWidth: 2, pointRadius: 0, tension: 0.3, spanGaps: false, fill: false }]
          },
          options: makeChartOpts(colors)
        });
      }

      // Seasonal
      var el3 = document.getElementById('ts-seasonal-chart');
      if (el3) {
        if (chartInstances.tsSeasonal) chartInstances.tsSeasonal.destroy();
        var opts3 = makeChartOpts(colors);
        // Fixed y-axis range so seasonal changes are clearly visible across slider values
        opts3.scales.y = { grid: { color: colors.grid }, suggestedMin: -120, suggestedMax: 120 };
        chartInstances.tsSeasonal = new Chart(el3, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [{ label: 'Seasonal', data: result.seasonal.slice(), borderColor: '#4caf50', borderWidth: 1.5, pointRadius: 0, tension: 0.1, fill: false }]
          },
          options: opts3
        });
      }

      // Residual
      var el4 = document.getElementById('ts-residual-chart');
      if (el4) {
        if (chartInstances.tsResidual) chartInstances.tsResidual.destroy();
        chartInstances.tsResidual = new Chart(el4, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [{ label: 'Residual', data: result.residual.slice(), borderColor: '#ab47bc', borderWidth: 1.5, pointRadius: 0, tension: 0.1, spanGaps: false, fill: false }]
          },
          options: makeChartOpts(colors)
        });
      }
    }

    windowSlider.addEventListener('input', function () {
      var val = parseInt(windowSlider.value);
      windowVal.textContent = val;
      renderTSCharts(val);
    });

    renderTSCharts(12);
  }

  // ====== DATA STORY TAB ======
  function initDataStoryTab() {
    var chapters = document.querySelectorAll('.story-chapter');
    var storySteps = document.querySelectorAll('.story-step');
    var progressFill = document.getElementById('story-progress-fill');

    if (chapters.length > 0) {
      var chapterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            var idx = parseInt(entry.target.getAttribute('data-chapter'));

            var pct = ((idx + 1) / chapters.length) * 100;
            if (progressFill) progressFill.style.width = pct + '%';

            storySteps.forEach(function (step) {
              var stepIdx = parseInt(step.getAttribute('data-step'));
              if (stepIdx <= idx) {
                step.classList.add('active');
              }
            });
          }
        });
      }, { threshold: 0.3 });

      chapters.forEach(function (ch) { chapterObserver.observe(ch); });
    }
  }

  // ====== DATA TOOLS TAB ======
  // SQL Terminal is now in sql-terminal.js (shared with home page)
  function initDataToolsTab() {
    initPipeline();
  }

  // ====== DEEP LEARNING TAB ======
  function initDeepLearningTab() {
    initNeuralNetwork();
    initSentiment();
    initGradientDescent();
  }

  // ====== REGRESSION PLAYGROUND ======
  function initRegression() {
    var canvas = document.getElementById('reg-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var points = [];
    var regType = 'linear';
    var typeBtns = document.querySelectorAll('.reg-type-btn');
    var eqEl = document.getElementById('reg-equation');
    var r2El = document.getElementById('reg-r2');

    function getIsLight() { return document.body.classList.contains('light-mode'); }

    typeBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        typeBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        regType = btn.getAttribute('data-type');
        draw();
      });
    });

    canvas.addEventListener('click', function (e) {
      var rect = canvas.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width * canvas.width;
      var y = (e.clientY - rect.top) / rect.height * canvas.height;
      points.push({ x: x, y: y });
      draw();
    });

    document.getElementById('reg-clear').addEventListener('click', function () {
      points = [];
      eqEl.textContent = 'y = ?';
      r2El.textContent = '--';
      draw();
    });

    document.getElementById('reg-random').addEventListener('click', function () {
      points = [];
      var slope = (Math.random() - 0.5) * 0.8;
      var intercept = 100 + Math.random() * 200;
      for (var i = 0; i < 30; i++) {
        var px = 50 + Math.random() * (canvas.width - 100);
        var py = intercept + slope * (px - canvas.width / 2) + (Math.random() - 0.5) * 120;
        py = Math.max(20, Math.min(canvas.height - 20, py));
        points.push({ x: px, y: py });
      }
      draw();
    });

    function fitRegression() {
      if (points.length < 2) return null;
      var n = points.length;
      var xs = points.map(function (p) { return p.x; });
      var ys = points.map(function (p) { return p.y; });

      var degree = regType === 'linear' ? 1 : (regType === 'quadratic' ? 2 : 3);
      // Polynomial regression via normal equations
      var m = degree + 1;
      var X = [];
      for (var i = 0; i < n; i++) {
        var row = [];
        for (var j = 0; j < m; j++) {
          row.push(Math.pow(xs[i], j));
        }
        X.push(row);
      }
      // X^T * X
      var XtX = [];
      for (var a = 0; a < m; a++) {
        XtX[a] = [];
        for (var b = 0; b < m; b++) {
          var s = 0;
          for (var k = 0; k < n; k++) s += X[k][a] * X[k][b];
          XtX[a][b] = s;
        }
      }
      // X^T * Y
      var XtY = [];
      for (var a = 0; a < m; a++) {
        var s = 0;
        for (var k = 0; k < n; k++) s += X[k][a] * ys[k];
        XtY[a] = s;
      }
      // Solve via Gaussian elimination
      var aug = [];
      for (var a = 0; a < m; a++) {
        aug[a] = XtX[a].slice();
        aug[a].push(XtY[a]);
      }
      for (var col = 0; col < m; col++) {
        var maxRow = col;
        for (var row = col + 1; row < m; row++) {
          if (Math.abs(aug[row][col]) > Math.abs(aug[maxRow][col])) maxRow = row;
        }
        var tmp = aug[col]; aug[col] = aug[maxRow]; aug[maxRow] = tmp;
        if (Math.abs(aug[col][col]) < 1e-10) return null;
        for (var row = col + 1; row < m; row++) {
          var factor = aug[row][col] / aug[col][col];
          for (var j = col; j <= m; j++) aug[row][j] -= factor * aug[col][j];
        }
      }
      var coeffs = new Array(m);
      for (var row = m - 1; row >= 0; row--) {
        coeffs[row] = aug[row][m];
        for (var j = row + 1; j < m; j++) coeffs[row] -= aug[row][j] * coeffs[j];
        coeffs[row] /= aug[row][row];
      }

      // R-squared
      var yMean = 0;
      for (var i = 0; i < n; i++) yMean += ys[i];
      yMean /= n;
      var ssTot = 0, ssRes = 0;
      for (var i = 0; i < n; i++) {
        var yPred = 0;
        for (var j = 0; j < m; j++) yPred += coeffs[j] * Math.pow(xs[i], j);
        ssRes += (ys[i] - yPred) * (ys[i] - yPred);
        ssTot += (ys[i] - yMean) * (ys[i] - yMean);
      }
      var r2 = ssTot > 0 ? 1 - ssRes / ssTot : 0;

      return { coeffs: coeffs, r2: r2 };
    }

    function formatEquation(coeffs) {
      if (!coeffs) return 'y = ?';
      var parts = [];
      var c0 = coeffs[0].toFixed(1);
      parts.push(c0);
      if (coeffs.length > 1) {
        var c1 = coeffs[1];
        parts.push((c1 >= 0 ? ' + ' : ' - ') + Math.abs(c1).toFixed(3) + 'x');
      }
      if (coeffs.length > 2) {
        var c2 = coeffs[2];
        parts.push((c2 >= 0 ? ' + ' : ' - ') + Math.abs(c2).toFixed(5) + 'x^2');
      }
      if (coeffs.length > 3) {
        var c3 = coeffs[3];
        parts.push((c3 >= 0 ? ' + ' : ' - ') + Math.abs(c3).toFixed(7) + 'x^3');
      }
      return 'y = ' + parts.join('');
    }

    function draw() {
      var isLight = getIsLight();
      var bgColor = isLight ? '#f5f5f5' : 'rgba(0,0,0,0.2)';
      var gridColor = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)';
      var ptColor = '#ff9f00';
      var lineColor = '#ff6b6b';

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      for (var gx = 0; gx <= canvas.width; gx += 50) {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, canvas.height); ctx.stroke();
      }
      for (var gy = 0; gy <= canvas.height; gy += 50) {
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(canvas.width, gy); ctx.stroke();
      }

      // Points
      points.forEach(function (p) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = ptColor;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      // Fit and draw curve
      var fit = fitRegression();
      if (fit) {
        ctx.beginPath();
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 2.5;
        for (var px = 0; px <= canvas.width; px += 2) {
          var py = 0;
          for (var j = 0; j < fit.coeffs.length; j++) py += fit.coeffs[j] * Math.pow(px, j);
          if (px === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
        eqEl.textContent = formatEquation(fit.coeffs);
        r2El.textContent = fit.r2.toFixed(4);
      }
    }

    draw();
  }

  // ====== NEURAL NETWORK PLAYGROUND ======
  function initNeuralNetwork() {
    var canvas = document.getElementById('nn-canvas');
    var archCanvas = document.getElementById('nn-arch-canvas');
    if (!canvas || !archCanvas) return;
    var ctx = canvas.getContext('2d');
    var archCtx = archCanvas.getContext('2d');
    var epochEl = document.getElementById('nn-epoch');
    var lossEl = document.getElementById('nn-loss');
    var statusEl = document.getElementById('nn-status');
    var trainBtn = document.getElementById('nn-train');
    var resetBtn = document.getElementById('nn-reset');
    var training = false;
    var network = null;
    var dataPoints = [];
    var epoch = 0;

    function getIsLight() { return document.body.classList.contains('light-mode'); }

    function generateData() {
      var type = document.getElementById('nn-dataset').value;
      var pts = [];
      var n = 200;
      if (type === 'circles') {
        for (var i = 0; i < n; i++) {
          var angle = Math.random() * Math.PI * 2;
          var inner = Math.random() < 0.5;
          var r = inner ? Math.random() * 0.3 : 0.5 + Math.random() * 0.3;
          pts.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r, label: inner ? 0 : 1 });
        }
      } else if (type === 'xor') {
        for (var i = 0; i < n; i++) {
          var x = Math.random() * 2 - 1;
          var y = Math.random() * 2 - 1;
          var label = (x > 0) !== (y > 0) ? 1 : 0;
          x += (Math.random() - 0.5) * 0.2;
          y += (Math.random() - 0.5) * 0.2;
          pts.push({ x: x, y: y, label: label });
        }
      } else { // spiral
        for (var i = 0; i < n; i++) {
          var cls = i < n / 2 ? 0 : 1;
          var r = (i % (n / 2)) / (n / 2) * 0.8;
          var t = r * 4 + cls * Math.PI;
          var x = r * Math.cos(t) + (Math.random() - 0.5) * 0.15;
          var y = r * Math.sin(t) + (Math.random() - 0.5) * 0.15;
          pts.push({ x: x, y: y, label: cls });
        }
      }
      return pts;
    }

    function createNetwork() {
      var numHidden = parseInt(document.getElementById('nn-hidden').value);
      var neuronsPerLayer = parseInt(document.getElementById('nn-neurons').value);
      var layers = [2]; // input
      for (var i = 0; i < numHidden; i++) layers.push(neuronsPerLayer);
      layers.push(1); // output

      var weights = [];
      var biases = [];
      for (var l = 1; l < layers.length; l++) {
        var w = [];
        var b = [];
        for (var j = 0; j < layers[l]; j++) {
          var wRow = [];
          for (var k = 0; k < layers[l - 1]; k++) {
            wRow.push((Math.random() - 0.5) * 2 / Math.sqrt(layers[l - 1]));
          }
          w.push(wRow);
          b.push(0);
        }
        weights.push(w);
        biases.push(b);
      }
      return { layers: layers, weights: weights, biases: biases };
    }

    function sigmoid(x) { return 1 / (1 + Math.exp(-Math.max(-10, Math.min(10, x)))); }

    // Leaky ReLU prevents dead neurons (gradient never fully zero)
    function leakyRelu(x) { return x > 0 ? x : 0.01 * x; }
    function leakyReluDeriv(x) { return x > 0 ? 1 : 0.01; }

    function forward(net, input) {
      var activations = [input];
      var preActivations = [input]; // store pre-activation for backprop
      var current = input;
      for (var l = 0; l < net.weights.length; l++) {
        var next = [];
        var pre = [];
        for (var j = 0; j < net.weights[l].length; j++) {
          var sum = net.biases[l][j];
          for (var k = 0; k < current.length; k++) {
            sum += net.weights[l][j][k] * current[k];
          }
          pre.push(sum);
          next.push(l === net.weights.length - 1 ? sigmoid(sum) : leakyRelu(sum));
        }
        preActivations.push(pre);
        activations.push(next);
        current = next;
      }
      return { activations: activations, preActivations: preActivations };
    }

    function shuffleArray(arr) {
      for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
      }
    }

    function trainStep(net, data, lr) {
      var totalLoss = 0;
      // Shuffle data each epoch for better convergence
      shuffleArray(data);

      for (var d = 0; d < data.length; d++) {
        var result = forward(net, [data[d].x, data[d].y]);
        var activations = result.activations;
        var preActivations = result.preActivations;
        var output = activations[activations.length - 1][0];
        var target = data[d].label;

        // Binary cross-entropy loss (much stronger gradients than MSE with sigmoid)
        var eps = 1e-7;
        var clipped = Math.max(eps, Math.min(1 - eps, output));
        totalLoss += -(target * Math.log(clipped) + (1 - target) * Math.log(1 - clipped));

        // Backprop: cross-entropy + sigmoid output gradient = (output - target)
        var deltas = [[]];
        deltas[0] = [output - target];

        for (var l = net.weights.length - 2; l >= 0; l--) {
          var layerDelta = [];
          for (var j = 0; j < net.weights[l].length; j++) {
            var sum = 0;
            for (var k = 0; k < net.weights[l + 1].length; k++) {
              sum += deltas[0][k] * net.weights[l + 1][k][j];
            }
            // Leaky ReLU derivative using pre-activation values
            layerDelta.push(sum * leakyReluDeriv(preActivations[l + 1][j]));
          }
          deltas.unshift(layerDelta);
        }

        // Update weights
        for (var l = 0; l < net.weights.length; l++) {
          for (var j = 0; j < net.weights[l].length; j++) {
            for (var k = 0; k < net.weights[l][j].length; k++) {
              net.weights[l][j][k] -= lr * deltas[l][j] * activations[l][k];
            }
            net.biases[l][j] -= lr * deltas[l][j];
          }
        }
      }
      return totalLoss / data.length;
    }

    function drawDecisionBoundary() {
      var isLight = getIsLight();
      var w = canvas.width;
      var h = canvas.height;
      var imageData = ctx.createImageData(w, h);
      var res = 4; // pixel resolution
      for (var py = 0; py < h; py += res) {
        for (var px = 0; px < w; px += res) {
          var x = (px / w) * 2 - 1;
          var y = (py / h) * 2 - 1;
          var fwd = forward(network, [x, y]);
          var val = fwd.activations[fwd.activations.length - 1][0];
          // Orange vs blue
          var r, g, b;
          if (val > 0.5) {
            r = 255; g = Math.round(159 * (1 - (val - 0.5) * 2) + 80 * (val - 0.5) * 2);
            b = Math.round(0 + 107 * (val - 0.5) * 2);
          } else {
            r = Math.round(66 + 30 * val * 2); g = Math.round(165 - 40 * val * 2);
            b = Math.round(245 - 40 * val * 2);
          }
          var alpha = isLight ? 60 : 80;
          for (var dy = 0; dy < res && py + dy < h; dy++) {
            for (var dx = 0; dx < res && px + dx < w; dx++) {
              var idx = ((py + dy) * w + (px + dx)) * 4;
              imageData.data[idx] = r;
              imageData.data[idx + 1] = g;
              imageData.data[idx + 2] = b;
              imageData.data[idx + 3] = alpha;
            }
          }
        }
      }
      ctx.putImageData(imageData, 0, 0);

      // Draw data points
      dataPoints.forEach(function (p) {
        var px = (p.x + 1) / 2 * w;
        var py = (p.y + 1) / 2 * h;
        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = p.label === 1 ? '#ff9f00' : '#42a5f5';
        ctx.fill();
        ctx.strokeStyle = isLight ? '#333' : '#fff';
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    }

    // Sample a random data point and forward pass to get activations for animation
    var archActivations = null;

    function drawArchitecture() {
      var isLight = getIsLight();
      var w = archCanvas.width;
      var h = archCanvas.height;
      archCtx.clearRect(0, 0, w, h);

      if (!network) return;
      var layers = network.layers;
      var numLayers = layers.length;
      var maxNeurons = 0;
      layers.forEach(function (n) { if (n > maxNeurons) maxNeurons = n; });

      var layerSpacing = w / (numLayers + 1);
      var nodeRadius = Math.min(12, h / (maxNeurons * 3));

      // Get live activations from a random data point
      if (dataPoints.length > 0 && training) {
        var sampleIdx = Math.floor(Math.random() * dataPoints.length);
        var sample = dataPoints[sampleIdx];
        var fwd = forward(network, [sample.x, sample.y]);
        archActivations = fwd.activations;
      } else if (!archActivations && dataPoints.length > 0) {
        var fwd = forward(network, [dataPoints[0].x, dataPoints[0].y]);
        archActivations = fwd.activations;
      }

      var positions = [];
      for (var l = 0; l < numLayers; l++) {
        var layerPositions = [];
        var count = layers[l];
        var totalHeight = (count - 1) * nodeRadius * 3;
        var startY = (h - totalHeight) / 2;
        for (var n = 0; n < count; n++) {
          layerPositions.push({ x: (l + 1) * layerSpacing, y: startY + n * nodeRadius * 3 });
        }
        positions.push(layerPositions);
      }

      // Compute bias node positions: one "+1" node above each non-input layer
      var biasRadius = Math.max(6, nodeRadius * 0.6);
      var biasPositions = []; // biasPositions[l] = {x,y} for the bias feeding into layer l+1
      for (var l = 0; l < numLayers - 1; l++) {
        var targetLayer = l + 1;
        var topNeuronY = positions[targetLayer][0].y;
        var biasY = Math.max(biasRadius + 4, topNeuronY - nodeRadius * 3.5);
        biasPositions.push({ x: positions[targetLayer][0].x, y: biasY });
      }

      // Draw weight connections
      for (var l = 0; l < numLayers - 1; l++) {
        for (var a = 0; a < positions[l].length; a++) {
          for (var b = 0; b < positions[l + 1].length; b++) {
            var wVal = network.weights[l][b] ? network.weights[l][b][a] : 0;
            var intensity = Math.min(1, Math.abs(wVal) * 2);

            // Show signal flow: brighten connections where source neuron is active
            var signalStrength = 0;
            if (archActivations && archActivations[l]) {
              var srcAct = Math.abs(archActivations[l][a] || 0);
              signalStrength = Math.min(1, srcAct * intensity);
            }

            archCtx.beginPath();
            archCtx.moveTo(positions[l][a].x, positions[l][a].y);
            archCtx.lineTo(positions[l + 1][b].x, positions[l + 1][b].y);

            if (training && signalStrength > 0.1) {
              archCtx.strokeStyle = wVal > 0 ?
                'rgba(255, 159, 0, ' + (0.2 + signalStrength * 0.6) + ')' :
                'rgba(66, 165, 245, ' + (0.2 + signalStrength * 0.6) + ')';
              archCtx.lineWidth = 1 + signalStrength * 2.5;
            } else {
              archCtx.strokeStyle = wVal > 0 ?
                'rgba(255, 159, 0, ' + (0.08 + intensity * 0.3) + ')' :
                'rgba(66, 165, 245, ' + (0.08 + intensity * 0.3) + ')';
              archCtx.lineWidth = 0.5 + intensity * 1.5;
            }
            archCtx.stroke();
          }
        }
      }

      // Draw bias connections (from bias node to each neuron in target layer)
      for (var l = 0; l < numLayers - 1; l++) {
        var bp = biasPositions[l];
        for (var j = 0; j < positions[l + 1].length; j++) {
          var bVal = network.biases[l][j];
          var bIntensity = Math.min(1, Math.abs(bVal) * 2);

          archCtx.beginPath();
          archCtx.moveTo(bp.x, bp.y);
          archCtx.lineTo(positions[l + 1][j].x, positions[l + 1][j].y);
          archCtx.setLineDash([3, 3]);

          if (training && bIntensity > 0.05) {
            archCtx.strokeStyle = bVal > 0 ?
              'rgba(76, 175, 80, ' + (0.2 + bIntensity * 0.5) + ')' :
              'rgba(244, 67, 54, ' + (0.2 + bIntensity * 0.5) + ')';
            archCtx.lineWidth = 0.8 + bIntensity * 1.5;
          } else {
            archCtx.strokeStyle = bVal > 0 ?
              'rgba(76, 175, 80, ' + (0.1 + bIntensity * 0.25) + ')' :
              'rgba(244, 67, 54, ' + (0.1 + bIntensity * 0.25) + ')';
            archCtx.lineWidth = 0.5 + bIntensity;
          }
          archCtx.stroke();
          archCtx.setLineDash([]);
        }
      }

      // Draw bias nodes
      for (var l = 0; l < biasPositions.length; l++) {
        var bp = biasPositions[l];

        // Subtle glow during training
        if (training) {
          archCtx.beginPath();
          archCtx.arc(bp.x, bp.y, biasRadius + 3, 0, Math.PI * 2);
          archCtx.fillStyle = 'rgba(76, 175, 80, 0.15)';
          archCtx.fill();
        }

        // Rounded rect-ish shape (use arc for simplicity, but smaller + distinct color)
        archCtx.beginPath();
        archCtx.arc(bp.x, bp.y, biasRadius, 0, Math.PI * 2);
        archCtx.fillStyle = isLight ? 'rgba(76, 175, 80, 0.85)' : 'rgba(76, 175, 80, 0.75)';
        archCtx.fill();
        archCtx.strokeStyle = isLight ? '#2e7d32' : '#a5d6a7';
        archCtx.lineWidth = 1.2;
        archCtx.stroke();

        // "+1" label
        archCtx.fillStyle = '#fff';
        archCtx.font = 'bold ' + Math.max(6, biasRadius * 0.9) + 'px sans-serif';
        archCtx.textAlign = 'center';
        archCtx.textBaseline = 'middle';
        archCtx.fillText('+1', bp.x, bp.y);
      }

      // Draw neuron nodes with activation-based glow
      for (var l = 0; l < numLayers; l++) {
        for (var n = 0; n < positions[l].length; n++) {
          var activation = 0;
          if (archActivations && archActivations[l]) {
            activation = Math.min(1, Math.abs(archActivations[l][n] || 0));
          }

          // Glow effect for active neurons
          if (training && activation > 0.1) {
            archCtx.beginPath();
            archCtx.arc(positions[l][n].x, positions[l][n].y, nodeRadius + 4, 0, Math.PI * 2);
            var glowColor = l === 0 ? 'rgba(66, 165, 245, ' + (activation * 0.3) + ')' :
              (l === numLayers - 1 ? 'rgba(255, 159, 0, ' + (activation * 0.4) + ')' :
              'rgba(255, 200, 50, ' + (activation * 0.25) + ')');
            archCtx.fillStyle = glowColor;
            archCtx.fill();
          }

          // Node circle
          archCtx.beginPath();
          archCtx.arc(positions[l][n].x, positions[l][n].y, nodeRadius, 0, Math.PI * 2);

          // Color based on activation level
          if (l === 0) {
            var bright = 0.6 + activation * 0.4;
            archCtx.fillStyle = 'rgba(66, 165, 245, ' + bright + ')';
          } else if (l === numLayers - 1) {
            var bright = 0.6 + activation * 0.4;
            archCtx.fillStyle = 'rgba(255, 159, 0, ' + bright + ')';
          } else {
            var g = Math.round(100 + activation * 155);
            archCtx.fillStyle = 'rgb(' + Math.round(180 + activation * 75) + ',' + g + ',' + Math.round(50 + activation * 50) + ')';
          }
          archCtx.fill();
          archCtx.strokeStyle = isLight ? '#333' : '#fff';
          archCtx.lineWidth = 1.5;
          archCtx.stroke();

          // Show activation value inside node
          if (nodeRadius >= 10 && archActivations && archActivations[l]) {
            archCtx.fillStyle = '#fff';
            archCtx.font = 'bold 7px sans-serif';
            archCtx.textAlign = 'center';
            archCtx.textBaseline = 'middle';
            var val = archActivations[l][n];
            if (val !== undefined) {
              archCtx.fillText(val.toFixed(1), positions[l][n].x, positions[l][n].y);
            }
          }

          // Show bias value below neuron (for non-input layers)
          if (l > 0 && nodeRadius >= 8) {
            var biasVal = network.biases[l - 1][n];
            archCtx.fillStyle = isLight ? 'rgba(76, 175, 80, 0.9)' : 'rgba(165, 214, 167, 0.85)';
            archCtx.font = Math.max(6, nodeRadius * 0.55) + 'px sans-serif';
            archCtx.textAlign = 'center';
            archCtx.textBaseline = 'top';
            archCtx.fillText('b:' + biasVal.toFixed(2), positions[l][n].x, positions[l][n].y + nodeRadius + 2);
          }
        }
        // Layer label
        var labelY = h - 8;
        archCtx.fillStyle = isLight ? '#666' : '#888';
        archCtx.font = '10px sans-serif';
        archCtx.textAlign = 'center';
        archCtx.textBaseline = 'alphabetic';
        var lbl = l === 0 ? 'Input' : (l === numLayers - 1 ? 'Output' : 'Hidden ' + l);
        archCtx.fillText(lbl, positions[l][0].x, labelY);
      }
    }

    function reset() {
      training = false;
      trainBtn.innerHTML = '<i class="fas fa-play"></i> Train';
      epoch = 0;
      epochEl.textContent = '0';
      lossEl.textContent = '--';
      statusEl.textContent = 'Ready';
      dataPoints = generateData();
      network = createNetwork();
      drawDecisionBoundary();
      drawArchitecture();
    }

    trainBtn.addEventListener('click', function () {
      if (training) {
        training = false;
        trainBtn.innerHTML = '<i class="fas fa-play"></i> Train';
        statusEl.textContent = 'Paused (Epoch ' + epoch + ')';
        return;
      }
      training = true;
      trainBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
      statusEl.textContent = 'Training...';
      var lr = parseFloat(document.getElementById('nn-lr').value);
      var maxEpoch = epoch + 2000; // allow 2000 more from current position

      function step() {
        if (!training) return;
        for (var i = 0; i < 5; i++) {
          var loss = trainStep(network, dataPoints, lr);
          epoch++;
        }
        epochEl.textContent = epoch;
        lossEl.textContent = loss.toFixed(4);
        drawDecisionBoundary();
        drawArchitecture();
        if (epoch < maxEpoch && training && loss > 0.01) {
          animFrameIds.nn = requestAnimationFrame(step);
        } else {
          training = false;
          trainBtn.innerHTML = '<i class="fas fa-play"></i> Train';
          statusEl.textContent = loss <= 0.01 ? 'Converged!' : 'Done (Epoch ' + epoch + ')';
        }
      }
      step();
    });

    resetBtn.addEventListener('click', reset);

    document.getElementById('nn-dataset').addEventListener('change', reset);
    document.getElementById('nn-hidden').addEventListener('change', reset);
    document.getElementById('nn-neurons').addEventListener('change', reset);

    reset();
  }

  // ====== SENTIMENT ANALYZER ======
  function initSentiment() {
    var analyzeBtn = document.getElementById('sentiment-analyze');
    var inputEl = document.getElementById('sentiment-input');
    if (!analyzeBtn || !inputEl) return;

    // Lexicon - positive/negative word scores
    var lexicon = {
      // Positive - strong (3)
      'amazing': 3, 'awesome': 3, 'excellent': 3, 'fantastic': 3, 'outstanding': 3,
      'brilliant': 3, 'wonderful': 3, 'superb': 3, 'perfect': 3, 'incredible': 3,
      'phenomenal': 3, 'magnificent': 3, 'thrilled': 3, 'ecstatic': 3, 'overjoyed': 3,
      'extraordinary': 3, 'spectacular': 3, 'glorious': 3, 'blissful': 3, 'euphoric': 3,
      // Positive - moderate (2)
      'love': 2, 'great': 2, 'good': 2, 'happy': 2, 'best': 2, 'beautiful': 2,
      'enjoy': 2, 'impressive': 2, 'remarkable': 2, 'exceptional': 2, 'delightful': 2,
      'recommend': 2, 'favorite': 2, 'satisfied': 2, 'pleased': 2, 'elegant': 2,
      'innovative': 2, 'exciting': 2, 'grateful': 2, 'thankful': 2, 'cheerful': 2,
      'joyful': 2, 'proud': 2, 'confident': 2, 'hopeful': 2, 'motivated': 2,
      'inspired': 2, 'blessed': 2, 'caring': 2, 'kind': 2, 'generous': 2,
      'warm': 2, 'passionate': 2, 'positive': 2, 'optimistic': 2, 'enthusiastic': 2,
      'excited': 2, 'thriving': 2, 'alive': 2, 'free': 2, 'strong': 2, 'brave': 2,
      // Positive - mild (1)
      'like': 1, 'nice': 1, 'fine': 1, 'pleasant': 1, 'cool': 1,
      'useful': 1, 'helpful': 1, 'easy': 1, 'fast': 1, 'smooth': 1, 'clean': 1,
      'thank': 1, 'thanks': 1, 'reliable': 1, 'efficient': 1,
      'creative': 1, 'intuitive': 1, 'friendly': 1, 'comfortable': 1,
      'absolutely': 1, 'definitely': 1, 'highly': 1, 'truly': 1,
      'calm': 1, 'peaceful': 1, 'relaxed': 1, 'steady': 1, 'okay': 1, 'decent': 1,
      // Negative - strong (-3)
      'terrible': -3, 'horrible': -3, 'awful': -3, 'worst': -3, 'disgusting': -3,
      'dreadful': -3, 'atrocious': -3, 'abysmal': -3, 'devastating': -3,
      'miserable': -3, 'depressed': -3, 'suicidal': -3, 'hopeless': -3,
      'heartbroken': -3, 'agonizing': -3, 'unbearable': -3, 'nightmarish': -3,
      'toxic': -3, 'despise': -3, 'loathe': -3, 'detest': -3, 'furious': -3,
      // Negative - moderate (-2)
      'bad': -2, 'poor': -2, 'hate': -2, 'ugly': -2, 'broken': -2, 'useless': -2,
      'boring': -2, 'annoying': -2, 'disappointing': -2, 'frustrating': -2,
      'sad': -2, 'unhappy': -2, 'upset': -2, 'angry': -2, 'mad': -2,
      'lonely': -2, 'scared': -2, 'afraid': -2, 'anxious': -2, 'worried': -2,
      'stressed': -2, 'tired': -2, 'exhausted': -2, 'sick': -2, 'hurt': -2,
      'painful': -2, 'suffering': -2, 'crying': -2, 'helpless': -2, 'lost': -2,
      'rejected': -2, 'abandoned': -2, 'betrayed': -2, 'jealous': -2, 'ashamed': -2,
      'guilty': -2, 'embarrassed': -2, 'regret': -2, 'bitter': -2, 'resentful': -2,
      'overpriced': -2, 'waste': -2, 'crash': -2, 'fail': -2, 'failed': -2,
      'clunky': -2, 'laggy': -2, 'unreliable': -2, 'pathetic': -2, 'rubbish': -2,
      // Negative - mild (-1)
      'slow': -1, 'difficult': -1, 'confusing': -1, 'mediocre': -1, 'average': -1,
      'expensive': -1, 'problem': -1, 'issue': -1, 'bug': -1, 'error': -1,
      'complicated': -1, 'down': -1, 'low': -1, 'weak': -1, 'rough': -1,
      'nervous': -1, 'tense': -1, 'bored': -1, 'irritated': -1, 'annoyed': -1,
      'confused': -1, 'uncertain': -1, 'doubtful': -1, 'uncomfortable': -1,
      'unfortunate': -1, 'struggle': -1, 'struggling': -1, 'miss': -1, 'missing': -1,
      // Negation markers (scored 0 but flagged as negators)
      'never': -1, 'not': -1, 'no': -1, 'don\'t': -1, 'doesn\'t': -1, 'didn\'t': -1,
      'wouldn\'t': -1, 'couldn\'t': -1, 'shouldn\'t': -1, 'won\'t': -1
    };

    // Negation words that flip sentiment
    var negators = ['not', 'no', 'never', 'neither', 'nobody', 'nothing',
      'nowhere', 'nor', 'cannot', 'can\'t', 'don\'t', 'doesn\'t', 'didn\'t',
      'won\'t', 'wouldn\'t', 'couldn\'t', 'shouldn\'t', 'isn\'t', 'aren\'t', 'wasn\'t'];

    function analyze(text) {
      var words = text.toLowerCase().replace(/[^a-z'\s-]/g, '').split(/\s+/).filter(function (w) { return w.length > 0; });
      var results = [];
      var totalScore = 0;
      var posCount = 0, negCount = 0, neuCount = 0;
      var negateNext = false;

      for (var i = 0; i < words.length; i++) {
        var word = words[i];
        var score = lexicon[word] || 0;

        if (negators.indexOf(word) !== -1) {
          negateNext = true;
          results.push({ word: word, score: 0, type: 'neu', originalScore: 0 });
          neuCount++;
          continue;
        }

        if (negateNext && score !== 0) {
          score = -score * 0.5;
          negateNext = false;
        } else {
          negateNext = false;
        }

        totalScore += score;
        var type = score > 0 ? 'pos' : (score < 0 ? 'neg' : 'neu');
        if (score > 0) posCount++;
        else if (score < 0) negCount++;
        else neuCount++;

        results.push({ word: word, score: score, type: type, originalScore: lexicon[word] || 0 });
      }

      // Normalize score to -1 to 1 range
      // Use only scored words for normalization so neutral filler words don't dilute the result
      var scoredCount = posCount + negCount;
      var maxPossible = Math.max(1, scoredCount * 3);
      var normalized = Math.max(-1, Math.min(1, totalScore / maxPossible));

      return {
        words: results,
        score: normalized,
        rawScore: totalScore,
        posCount: posCount,
        negCount: negCount,
        neuCount: neuCount
      };
    }

    function drawGauge(score) {
      var gaugeCanvas = document.getElementById('sentiment-gauge');
      if (!gaugeCanvas) return;
      var gCtx = gaugeCanvas.getContext('2d');
      var w = gaugeCanvas.width;
      var h = gaugeCanvas.height;
      gCtx.clearRect(0, 0, w, h);

      var cx = w / 2;
      var cy = h - 10;
      var radius = 80;

      // Background arc
      gCtx.beginPath();
      gCtx.arc(cx, cy, radius, Math.PI, 2 * Math.PI);
      gCtx.lineWidth = 14;
      gCtx.strokeStyle = 'rgba(255,255,255,0.08)';
      gCtx.lineCap = 'round';
      gCtx.stroke();

      // Gradient arc
      var grad = gCtx.createLinearGradient(cx - radius, cy, cx + radius, cy);
      grad.addColorStop(0, '#ff6b6b');
      grad.addColorStop(0.5, '#ffd700');
      grad.addColorStop(1, '#4caf50');
      gCtx.beginPath();
      gCtx.arc(cx, cy, radius, Math.PI, 2 * Math.PI);
      gCtx.lineWidth = 14;
      gCtx.strokeStyle = grad;
      gCtx.lineCap = 'round';
      gCtx.stroke();

      // Needle
      var normalizedAngle = Math.PI + ((score + 1) / 2) * Math.PI;
      var needleLen = radius - 20;
      var nx = cx + Math.cos(normalizedAngle) * needleLen;
      var ny = cy + Math.sin(normalizedAngle) * needleLen;
      gCtx.beginPath();
      gCtx.moveTo(cx, cy);
      gCtx.lineTo(nx, ny);
      gCtx.strokeStyle = '#ff9f00';
      gCtx.lineWidth = 3;
      gCtx.lineCap = 'round';
      gCtx.stroke();

      // Center dot
      gCtx.beginPath();
      gCtx.arc(cx, cy, 5, 0, Math.PI * 2);
      gCtx.fillStyle = '#ff9f00';
      gCtx.fill();
    }

    analyzeBtn.addEventListener('click', function () {
      var text = inputEl.value.trim();
      if (!text) return;

      var result = analyze(text);
      var resultsEl = document.getElementById('sent-results');
      resultsEl.style.display = 'block';

      // Draw gauge
      drawGauge(result.score);

      // Verdict
      var verdictEl = document.getElementById('sent-verdict');
      var scoreEl = document.getElementById('sent-score');
      if (result.score > 0.1) {
        verdictEl.textContent = 'Positive';
        verdictEl.className = 'sent-verdict positive';
      } else if (result.score < -0.1) {
        verdictEl.textContent = 'Negative';
        verdictEl.className = 'sent-verdict negative';
      } else {
        verdictEl.textContent = 'Neutral';
        verdictEl.className = 'sent-verdict neutral';
      }
      scoreEl.textContent = 'Score: ' + result.score.toFixed(3);

      // Word breakdown
      var wordsEl = document.getElementById('sent-words');
      wordsEl.innerHTML = '';
      result.words.forEach(function (w) {
        var span = document.createElement('span');
        span.className = 'sent-word ' + w.type;
        var scoreLabel = w.score !== 0 ? ' (' + (w.score > 0 ? '+' : '') + w.score.toFixed(1) + ')' : '';
        span.innerHTML = w.word + '<span class="sent-word-score">' + scoreLabel + '</span>';
        wordsEl.appendChild(span);
      });

      // Stats
      document.getElementById('sent-pos-count').textContent = result.posCount;
      document.getElementById('sent-neg-count').textContent = result.negCount;
      document.getElementById('sent-neu-count').textContent = result.neuCount;
    });
  }

  // ====== GRADIENT DESCENT VISUALIZER ======
  function initGradientDescent() {
    var canvas = document.getElementById('gd-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var startBtn = document.getElementById('gd-start');
    var resetBtn = document.getElementById('gd-reset');
    var lrSlider = document.getElementById('gd-lr');
    var lrVal = document.getElementById('gd-lr-val');
    var stepsEl = document.getElementById('gd-steps');
    var lossEl = document.getElementById('gd-loss');
    var posXEl = document.getElementById('gd-pos-x');
    var posYEl = document.getElementById('gd-pos-y');
    var running = false;
    var path = [];
    var posX = 0, posY = 0;

    function getIsLight() { return document.body.classList.contains('light-mode'); }

    lrSlider.addEventListener('input', function () {
      lrVal.textContent = parseFloat(lrSlider.value).toFixed(3);
    });

    var functions = {
      bowl: {
        f: function (x, y) { return x * x + y * y; },
        gx: function (x, y) { return 2 * x; },
        gy: function (x, y) { return 2 * y; },
        range: 3, minVal: 0, maxVal: 18
      },
      rosenbrock: {
        f: function (x, y) { return (1 - x) * (1 - x) + 10 * (y - x * x) * (y - x * x); },
        gx: function (x, y) { return -2 * (1 - x) - 40 * x * (y - x * x); },
        gy: function (x, y) { return 20 * (y - x * x); },
        range: 2.5, minVal: 0, maxVal: 100
      },
      saddle: {
        f: function (x, y) { return x * x - y * y; },
        gx: function (x, y) { return 2 * x; },
        gy: function (x, y) { return -2 * y; },
        range: 3, minVal: -9, maxVal: 9
      }
    };

    function toCanvas(x, y, fn) {
      var range = fn.range;
      var px = ((x + range) / (2 * range)) * canvas.width;
      var py = ((y + range) / (2 * range)) * canvas.height;
      return { px: px, py: py };
    }

    function drawContour() {
      var isLight = getIsLight();
      var funcName = document.getElementById('gd-function').value;
      var fn = functions[funcName];
      var w = canvas.width;
      var h = canvas.height;
      var imageData = ctx.createImageData(w, h);
      var range = fn.range;

      for (var py = 0; py < h; py++) {
        for (var px = 0; px < w; px++) {
          var x = (px / w) * 2 * range - range;
          var y = (py / h) * 2 * range - range;
          var val = fn.f(x, y);
          var norm = Math.max(0, Math.min(1, (val - fn.minVal) / (fn.maxVal - fn.minVal)));
          norm = Math.sqrt(norm); // compress high values

          var idx = (py * w + px) * 4;
          if (isLight) {
            // Light: white -> orange -> red
            imageData.data[idx] = Math.round(255 - norm * 60);
            imageData.data[idx + 1] = Math.round(255 - norm * 200);
            imageData.data[idx + 2] = Math.round(255 - norm * 255);
          } else {
            // Dark: dark blue -> orange -> red
            imageData.data[idx] = Math.round(norm * 255);
            imageData.data[idx + 1] = Math.round(norm * 100);
            imageData.data[idx + 2] = Math.round(30 + (1 - norm) * 80);
          }
          imageData.data[idx + 3] = 200;
        }
      }
      ctx.putImageData(imageData, 0, 0);

      // Draw contour lines
      ctx.strokeStyle = isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 0.5;
      var levels = 15;
      for (var level = 1; level <= levels; level++) {
        var threshold = fn.minVal + (fn.maxVal - fn.minVal) * level / levels;
        // March along grid
        for (var gx = 0; gx < w; gx += 8) {
          for (var gy = 0; gy < h; gy += 8) {
            var x = (gx / w) * 2 * range - range;
            var y = (gy / h) * 2 * range - range;
            var x2 = ((gx + 8) / w) * 2 * range - range;
            var y2 = ((gy + 8) / h) * 2 * range - range;
            var v00 = fn.f(x, y);
            var v10 = fn.f(x2, y);
            var v01 = fn.f(x, y2);
            if ((v00 < threshold) !== (v10 < threshold) || (v00 < threshold) !== (v01 < threshold)) {
              ctx.beginPath();
              ctx.arc(gx, gy, 1, 0, Math.PI * 2);
              ctx.stroke();
            }
          }
        }
      }
    }

    function drawPath() {
      var funcName = document.getElementById('gd-function').value;
      var fn = functions[funcName];

      if (path.length < 2) return;

      ctx.beginPath();
      ctx.strokeStyle = '#ff9f00';
      ctx.lineWidth = 2;
      for (var i = 0; i < path.length; i++) {
        var pt = toCanvas(path[i].x, path[i].y, fn);
        if (i === 0) ctx.moveTo(pt.px, pt.py);
        else ctx.lineTo(pt.px, pt.py);
      }
      ctx.stroke();

      // Draw dots at each step
      path.forEach(function (p, i) {
        var pt = toCanvas(p.x, p.y, fn);
        ctx.beginPath();
        ctx.arc(pt.px, pt.py, i === path.length - 1 ? 6 : 3, 0, Math.PI * 2);
        ctx.fillStyle = i === path.length - 1 ? '#ff9f00' : 'rgba(255, 159, 0, 0.6)';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = i === path.length - 1 ? 2 : 1;
        ctx.stroke();
      });
    }

    function reset() {
      running = false;
      startBtn.innerHTML = '<i class="fas fa-play"></i> Start Descent';
      var funcName = document.getElementById('gd-function').value;
      var fn = functions[funcName];
      // Random start position
      posX = (Math.random() - 0.5) * fn.range * 1.5;
      posY = (Math.random() - 0.5) * fn.range * 1.5;
      path = [{ x: posX, y: posY }];
      stepsEl.textContent = '0';
      lossEl.textContent = fn.f(posX, posY).toFixed(3);
      posXEl.textContent = posX.toFixed(2);
      posYEl.textContent = posY.toFixed(2);
      drawContour();
      drawPath();
    }

    startBtn.addEventListener('click', function () {
      if (running) {
        running = false;
        startBtn.innerHTML = '<i class="fas fa-play"></i> Start Descent';
        return;
      }
      running = true;
      startBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';

      var funcName = document.getElementById('gd-function').value;
      var fn = functions[funcName];
      var lr = parseFloat(lrSlider.value);
      var step = 0;

      function iterate() {
        if (!running) return;
        var gx = fn.gx(posX, posY);
        var gy = fn.gy(posX, posY);
        posX -= lr * gx;
        posY -= lr * gy;
        // Clamp to range
        posX = Math.max(-fn.range, Math.min(fn.range, posX));
        posY = Math.max(-fn.range, Math.min(fn.range, posY));
        path.push({ x: posX, y: posY });
        step++;
        stepsEl.textContent = step;
        lossEl.textContent = fn.f(posX, posY).toFixed(4);
        posXEl.textContent = posX.toFixed(3);
        posYEl.textContent = posY.toFixed(3);

        drawContour();
        drawPath();

        if (step < 200 && running && (Math.abs(gx) > 0.0001 || Math.abs(gy) > 0.0001)) {
          animFrameIds.gd = requestAnimationFrame(iterate);
        } else {
          running = false;
          startBtn.innerHTML = '<i class="fas fa-play"></i> Start Descent';
        }
      }
      iterate();
    });

    resetBtn.addEventListener('click', reset);
    document.getElementById('gd-function').addEventListener('change', reset);

    reset();
  }

  // ====== CORRELATION HEATMAP ======
  function initCorrelation() {
    var canvas = document.getElementById('corr-canvas');
    var scatterCanvas = document.getElementById('corr-scatter-canvas');
    if (!canvas || !scatterCanvas) return;
    var ctx = canvas.getContext('2d');
    var sctx = scatterCanvas.getContext('2d');
    var datasetSelect = document.getElementById('corr-dataset');
    var scatterTitle = document.getElementById('corr-scatter-title');
    var scatterStats = document.getElementById('corr-scatter-stats');
    var infoEl = document.getElementById('corr-info');

    function getIsLight() { return document.body.classList.contains('light-mode'); }

    // Pre-computed datasets with correlation matrices
    var datasets = {
      auto: {
        vars: ['MPG', 'Cylinders', 'Displacement', 'Horsepower', 'Weight'],
        corr: [
          [1.000, -0.778, -0.805, -0.778, -0.832],
          [-0.778, 1.000, 0.950, 0.843, 0.898],
          [-0.805, 0.950, 1.000, 0.897, 0.933],
          [-0.778, 0.843, 0.897, 1.000, 0.865],
          [-0.832, 0.898, 0.933, 0.865, 1.000]
        ],
        // Scatter data: approximate relationships
        generateScatter: function (i, j) {
          var pts = [];
          var corr = this.corr[i][j];
          for (var k = 0; k < 80; k++) {
            var x = Math.random();
            var y = corr * x + Math.sqrt(1 - corr * corr) * (Math.random() - 0.5) * 0.8;
            pts.push({ x: x, y: Math.max(0, Math.min(1, (y + 0.4) / 1.4)) });
          }
          return pts;
        }
      },
      health: {
        vars: ['Age', 'BMI', 'Blood Pressure', 'Cholesterol', 'Exercise'],
        corr: [
          [1.000, 0.150, 0.450, 0.380, -0.250],
          [0.150, 1.000, 0.420, 0.350, -0.480],
          [0.450, 0.420, 1.000, 0.300, -0.350],
          [0.380, 0.350, 0.300, 1.000, -0.220],
          [-0.250, -0.480, -0.350, -0.220, 1.000]
        ],
        generateScatter: function (i, j) {
          var pts = [];
          var corr = this.corr[i][j];
          for (var k = 0; k < 80; k++) {
            var x = Math.random();
            var y = corr * x + Math.sqrt(Math.max(0, 1 - corr * corr)) * (Math.random() - 0.5) * 0.8;
            pts.push({ x: x, y: Math.max(0, Math.min(1, (y + 0.4) / 1.4)) });
          }
          return pts;
        }
      },
      housing: {
        vars: ['Price', 'SqFt', 'Bedrooms', 'Bathrooms', 'Age'],
        corr: [
          [1.000, 0.720, 0.530, 0.540, -0.380],
          [0.720, 1.000, 0.680, 0.650, -0.100],
          [0.530, 0.680, 1.000, 0.600, 0.050],
          [0.540, 0.650, 0.600, 1.000, -0.050],
          [-0.380, -0.100, 0.050, -0.050, 1.000]
        ],
        generateScatter: function (i, j) {
          var pts = [];
          var corr = this.corr[i][j];
          for (var k = 0; k < 80; k++) {
            var x = Math.random();
            var y = corr * x + Math.sqrt(Math.max(0, 1 - corr * corr)) * (Math.random() - 0.5) * 0.8;
            pts.push({ x: x, y: Math.max(0, Math.min(1, (y + 0.4) / 1.4)) });
          }
          return pts;
        }
      }
    };

    function corrColor(val) {
      // Blue (-1) -> White (0) -> Orange/Red (+1)
      if (val >= 0) {
        var intensity = val;
        return 'rgb(' + Math.round(255) + ',' + Math.round(159 * (1 - intensity) + 80 * intensity) + ',' + Math.round(255 * (1 - intensity)) + ')';
      } else {
        var intensity = -val;
        return 'rgb(' + Math.round(66 + (1 - intensity) * 189) + ',' + Math.round(165 + (1 - intensity) * 90) + ',' + Math.round(245 + (1 - intensity) * 10) + ')';
      }
    }

    function drawHeatmap() {
      var isLight = getIsLight();
      var ds = datasets[datasetSelect.value];
      var n = ds.vars.length;
      var w = canvas.width;
      var h = canvas.height;
      var margin = 80;
      var cellW = (w - margin) / n;
      var cellH = (h - margin) / n;

      ctx.clearRect(0, 0, w, h);

      // Draw cells
      for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
          var val = ds.corr[i][j];
          var x = margin + j * cellW;
          var y = margin + i * cellH;

          ctx.fillStyle = corrColor(val);
          ctx.globalAlpha = 0.85;
          ctx.fillRect(x + 1, y + 1, cellW - 2, cellH - 2);
          ctx.globalAlpha = 1;

          // Value text
          ctx.fillStyle = Math.abs(val) > 0.6 ? '#fff' : (isLight ? '#333' : '#ccc');
          ctx.font = 'bold 12px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(val.toFixed(2), x + cellW / 2, y + cellH / 2);
        }
      }

      // Labels
      ctx.fillStyle = isLight ? '#555' : '#ccc';
      ctx.font = '11px sans-serif';
      for (var i = 0; i < n; i++) {
        // Top labels
        ctx.save();
        ctx.translate(margin + i * cellW + cellW / 2, margin - 8);
        ctx.rotate(-Math.PI / 4);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(ds.vars[i], 0, 0);
        ctx.restore();

        // Left labels
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(ds.vars[i], margin - 8, margin + i * cellH + cellH / 2);
      }
    }

    function drawScatter(varI, varJ) {
      var isLight = getIsLight();
      var ds = datasets[datasetSelect.value];
      var pts = ds.generateScatter(varI, varJ);
      var w = scatterCanvas.width;
      var h = scatterCanvas.height;
      var pad = 30;

      sctx.clearRect(0, 0, w, h);
      sctx.fillStyle = isLight ? '#f9f9f9' : 'rgba(0,0,0,0.2)';
      sctx.fillRect(0, 0, w, h);

      // Axes
      sctx.strokeStyle = isLight ? '#ddd' : 'rgba(255,255,255,0.1)';
      sctx.lineWidth = 1;
      sctx.beginPath();
      sctx.moveTo(pad, pad);
      sctx.lineTo(pad, h - pad);
      sctx.lineTo(w - pad, h - pad);
      sctx.stroke();

      // Points
      pts.forEach(function (p) {
        var px = pad + p.x * (w - 2 * pad);
        var py = h - pad - p.y * (h - 2 * pad);
        sctx.beginPath();
        sctx.arc(px, py, 3.5, 0, Math.PI * 2);
        sctx.fillStyle = 'rgba(255, 159, 0, 0.7)';
        sctx.fill();
        sctx.strokeStyle = isLight ? '#333' : '#fff';
        sctx.lineWidth = 0.5;
        sctx.stroke();
      });

      // Axis labels
      sctx.fillStyle = isLight ? '#555' : '#aaa';
      sctx.font = '11px sans-serif';
      sctx.textAlign = 'center';
      sctx.fillText(ds.vars[varJ], w / 2, h - 5);
      sctx.save();
      sctx.translate(10, h / 2);
      sctx.rotate(-Math.PI / 2);
      sctx.fillText(ds.vars[varI], 0, 0);
      sctx.restore();

      scatterTitle.textContent = ds.vars[varI] + ' vs ' + ds.vars[varJ];
      scatterStats.textContent = 'r = ' + ds.corr[varI][varJ].toFixed(3) + ' | n = ' + pts.length;
    }

    canvas.addEventListener('click', function (e) {
      var ds = datasets[datasetSelect.value];
      var n = ds.vars.length;
      var rect = canvas.getBoundingClientRect();
      var mx = (e.clientX - rect.left) / rect.width * canvas.width;
      var my = (e.clientY - rect.top) / rect.height * canvas.height;

      var margin = 80;
      var cellW = (canvas.width - margin) / n;
      var cellH = (canvas.height - margin) / n;

      var col = Math.floor((mx - margin) / cellW);
      var row = Math.floor((my - margin) / cellH);

      if (col >= 0 && col < n && row >= 0 && row < n) {
        drawScatter(row, col);
      }
    });

    canvas.addEventListener('mousemove', function (e) {
      var ds = datasets[datasetSelect.value];
      var n = ds.vars.length;
      var rect = canvas.getBoundingClientRect();
      var mx = (e.clientX - rect.left) / rect.width * canvas.width;
      var my = (e.clientY - rect.top) / rect.height * canvas.height;

      var margin = 80;
      var cellW = (canvas.width - margin) / n;
      var cellH = (canvas.height - margin) / n;

      var col = Math.floor((mx - margin) / cellW);
      var row = Math.floor((my - margin) / cellH);

      if (col >= 0 && col < n && row >= 0 && row < n) {
        infoEl.textContent = ds.vars[row] + ' vs ' + ds.vars[col] + ': r = ' + ds.corr[row][col].toFixed(3);
        canvas.style.cursor = 'pointer';
      } else {
        infoEl.textContent = 'Hover over cells to see correlation values. Click to view scatter plot.';
        canvas.style.cursor = 'default';
      }
    });

    datasetSelect.addEventListener('change', function () {
      drawHeatmap();
      scatterTitle.textContent = 'Select a cell to view scatter plot';
      scatterStats.textContent = '';
      sctx.clearRect(0, 0, scatterCanvas.width, scatterCanvas.height);
    });

    drawHeatmap();
  }

  // ====== DATA PIPELINE SIMULATOR ======
  function initPipeline() {
    var startBtn = document.getElementById('pipeline-start');
    var resetBtnEl = document.getElementById('pipeline-reset');
    if (!startBtn) return;

    var stages = ['ingest', 'clean', 'transform', 'validate', 'load'];
    var running = false;
    var pipeInterval = null;
    var startTime = 0;
    var counts = { ingest: 0, clean: 0, transform: 0, validate: 0, load: 0 };
    var totalProcessed = 0;
    var totalDropped = 0;
    var totalErrors = 0;
    var logEl = document.getElementById('pipeline-log');

    function getSpeed() {
      var val = document.getElementById('pipe-speed').value;
      return val === 'slow' ? 800 : (val === 'fast' ? 150 : 400);
    }

    function addLog(stage, message) {
      var entry = document.createElement('div');
      entry.className = 'pipe-log-entry ' + stage;
      var elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      entry.innerHTML = '<span class="pipe-log-time">[' + elapsed + 's]</span> [' + stage.toUpperCase() + '] ' + message;
      logEl.appendChild(entry);
      logEl.scrollTop = logEl.scrollHeight;
      // Keep max 50 entries
      while (logEl.children.length > 50) logEl.removeChild(logEl.firstChild);
    }

    function updateStageUI(stage, status) {
      var el = document.querySelector('.pipe-stage[data-stage="' + stage + '"]');
      if (!el) return;
      el.className = 'pipe-stage ' + status;
      var statusEl = document.getElementById('pipe-status-' + stage);
      if (statusEl) {
        if (status === 'active') statusEl.textContent = 'Processing';
        else if (status === 'done') statusEl.textContent = 'Complete';
        else if (status === 'error') statusEl.textContent = 'Error';
        else statusEl.textContent = 'Waiting';
      }
    }

    function updateCounts() {
      stages.forEach(function (s) {
        var el = document.getElementById('pipe-count-' + s);
        if (el) el.textContent = counts[s];
      });
      document.getElementById('pipe-total').textContent = totalProcessed;
      document.getElementById('pipe-dropped').textContent = totalDropped;
      document.getElementById('pipe-errors').textContent = totalErrors;
      var elapsed = Math.max(1, (Date.now() - startTime) / 1000);
      document.getElementById('pipe-throughput').textContent = (totalProcessed / elapsed).toFixed(1) + '/s';
      document.getElementById('pipe-uptime').textContent = elapsed.toFixed(0) + 's';
    }

    function updateArrows() {
      var arrows = document.querySelectorAll('.pipe-arrow');
      arrows.forEach(function (a, i) {
        if (i < stages.length - 1) {
          var currentStage = stages[i];
          var nextStage = stages[i + 1];
          var currentEl = document.querySelector('.pipe-stage[data-stage="' + currentStage + '"]');
          if (currentEl && (currentEl.classList.contains('active') || currentEl.classList.contains('done'))) {
            a.classList.add('active');
          } else {
            a.classList.remove('active');
          }
        }
      });
    }

    function simulateBatch() {
      var batchSize = 5 + Math.floor(Math.random() * 10);
      var currentBatch = batchSize;

      // Stage 1: Ingest
      counts.ingest += currentBatch;
      updateStageUI('ingest', 'active');
      addLog('ingest', 'Ingested ' + currentBatch + ' records from source');

      setTimeout(function () {
        updateStageUI('ingest', 'done');

        // Stage 2: Clean - some records may be dropped
        var dropped = Math.floor(Math.random() * 3);
        currentBatch -= dropped;
        totalDropped += dropped;
        counts.clean += currentBatch;
        updateStageUI('clean', 'active');
        if (dropped > 0) {
          addLog('clean', 'Cleaned data, dropped ' + dropped + ' invalid records');
        } else {
          addLog('clean', 'All ' + currentBatch + ' records passed validation');
        }
        updateArrows();
        updateCounts();

        setTimeout(function () {
          updateStageUI('clean', 'done');

          // Stage 3: Transform
          var hasError = Math.random() < 0.08;
          if (hasError) {
            totalErrors++;
            var errCount = 1;
            currentBatch -= errCount;
            addLog('error', 'Transform error: Schema mismatch on ' + errCount + ' record(s)');
          }
          counts.transform += currentBatch;
          updateStageUI('transform', 'active');
          addLog('transform', 'Applied feature engineering to ' + currentBatch + ' records');
          updateArrows();
          updateCounts();

          setTimeout(function () {
            updateStageUI('transform', 'done');

            // Stage 4: Validate
            counts.validate += currentBatch;
            updateStageUI('validate', 'active');
            addLog('validate', 'Validated ' + currentBatch + ' records against schema');
            updateArrows();
            updateCounts();

            setTimeout(function () {
              updateStageUI('validate', 'done');

              // Stage 5: Load
              counts.load += currentBatch;
              totalProcessed += currentBatch;
              updateStageUI('load', 'active');
              addLog('load', 'Loaded ' + currentBatch + ' records to data warehouse');
              updateArrows();
              updateCounts();

              setTimeout(function () {
                updateStageUI('load', 'done');
                updateArrows();
                updateCounts();
              }, getSpeed() * 0.5);

            }, getSpeed() * 0.5);

          }, getSpeed() * 0.7);

        }, getSpeed() * 0.6);

      }, getSpeed() * 0.5);
    }

    startBtn.addEventListener('click', function () {
      if (running) {
        running = false;
        startBtn.innerHTML = '<i class="fas fa-play"></i> Start Pipeline';
        clearInterval(pipeInterval);
        return;
      }
      running = true;
      startBtn.innerHTML = '<i class="fas fa-pause"></i> Pause Pipeline';
      startTime = Date.now();
      addLog('ingest', 'Pipeline started');

      simulateBatch();
      pipeInterval = setInterval(function () {
        if (running && totalProcessed < 500) {
          simulateBatch();
        } else {
          running = false;
          startBtn.innerHTML = '<i class="fas fa-play"></i> Start Pipeline';
          clearInterval(pipeInterval);
          addLog('load', 'Pipeline completed. Total: ' + totalProcessed + ' records');
        }
      }, getSpeed() * 3);
    });

    resetBtnEl.addEventListener('click', function () {
      running = false;
      clearInterval(pipeInterval);
      startBtn.innerHTML = '<i class="fas fa-play"></i> Start Pipeline';
      counts = { ingest: 0, clean: 0, transform: 0, validate: 0, load: 0 };
      totalProcessed = 0;
      totalDropped = 0;
      totalErrors = 0;
      stages.forEach(function (s) {
        updateStageUI(s, '');
        var countEl = document.getElementById('pipe-count-' + s);
        if (countEl) countEl.textContent = '0';
      });
      document.getElementById('pipe-total').textContent = '0';
      document.getElementById('pipe-dropped').textContent = '0';
      document.getElementById('pipe-errors').textContent = '0';
      document.getElementById('pipe-throughput').textContent = '0/s';
      document.getElementById('pipe-uptime').textContent = '0s';
      logEl.innerHTML = '';
      var arrows = document.querySelectorAll('.pipe-arrow');
      arrows.forEach(function (a) { a.classList.remove('active'); });
    });
  }

  // ====== PARALLAX DATA SCIENCE HERO ======

  function initParallaxHero() {
    var canvas = document.getElementById('network-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var nodes = [];
    var nodeCount = 50;
    var connectionDist = 180;
    var mouseX = -1000;
    var mouseY = -1000;
    var isVisible = true;
    var raf = null;
    var isLight = document.body.classList.contains('light-mode');

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function initNodes() {
      nodes = [];
      for (var i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          baseX: Math.random() * canvas.width,
          baseY: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: Math.random() * 2 + 1.5,
          phase: Math.random() * Math.PI * 2
        });
      }
    }

    function drawFrame(time) {
      if (!isVisible) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      isLight = document.body.classList.contains('light-mode');
      var nodeColor = isLight ? 'rgba(230, 138, 0,' : 'rgba(255, 159, 0,';
      var lineColor = isLight ? 'rgba(230, 138, 0,' : 'rgba(255, 159, 0,';
      var t = time * 0.001;

      // Update node positions
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x = n.baseX + Math.sin(t * 0.5 + n.phase) * 30;
        n.y = n.baseY + Math.cos(t * 0.3 + n.phase) * 20;
        n.baseX += n.vx;
        n.baseY += n.vy;

        // Wrap around edges
        if (n.baseX < -20) n.baseX = canvas.width + 20;
        if (n.baseX > canvas.width + 20) n.baseX = -20;
        if (n.baseY < -20) n.baseY = canvas.height + 20;
        if (n.baseY > canvas.height + 20) n.baseY = -20;
      }

      // Draw connections
      for (var i = 0; i < nodes.length; i++) {
        for (var j = i + 1; j < nodes.length; j++) {
          var dx = nodes[i].x - nodes[j].x;
          var dy = nodes[i].y - nodes[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDist) {
            var alpha = (1 - dist / connectionDist) * 0.25;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = lineColor + alpha + ')';
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        var dxM = n.x - mouseX;
        var dyM = n.y - mouseY;
        var distM = Math.sqrt(dxM * dxM + dyM * dyM);
        var glow = distM < 150 ? (1 - distM / 150) * 0.6 : 0;
        var alpha = 0.5 + glow;

        // Glow effect
        if (glow > 0) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius + 6, 0, Math.PI * 2);
          ctx.fillStyle = nodeColor + (glow * 0.3) + ')';
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor + alpha + ')';
        ctx.fill();
      }

      raf = requestAnimationFrame(drawFrame);
    }

    resize();
    initNodes();
    raf = requestAnimationFrame(drawFrame);

    // Mouse tracking (desktop only)
    var isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouchDevice) {
      canvas.parentElement.addEventListener('mousemove', function (e) {
        var rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
      });
      canvas.parentElement.addEventListener('mouseleave', function () {
        mouseX = -1000;
        mouseY = -1000;
      });
    }

    // Pause when off-screen
    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entries) {
        isVisible = entries[0].isIntersecting;
        if (isVisible && !raf) {
          raf = requestAnimationFrame(drawFrame);
        }
      }, { threshold: 0.05 });
      obs.observe(canvas.parentElement);
    }

    // Resize handler
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        resize();
        initNodes();
      }, 200);
    });
  }

  // Parallax scroll handler
  var heroSection = document.querySelector('.parallax-hero');
  if (heroSection) {
    var pLayers = {
      network: document.querySelector('.parallax-network'),
      floats: document.querySelector('.parallax-floats'),
      content: document.querySelector('.parallax-content'),
      lines: document.querySelector('.parallax-lines')
    };

    window.addEventListener('scroll', function () {
      var scrollY = window.pageYOffset;
      var vh = window.innerHeight;
      if (scrollY > vh * 1.2) return;

      if (pLayers.network) pLayers.network.style.transform = 'translateY(' + (scrollY * 0.1) + 'px)';
      if (pLayers.floats) pLayers.floats.style.transform = 'translateY(' + (scrollY * 0.35) + 'px)';
      if (pLayers.content) {
        pLayers.content.style.transform = 'translateY(' + (scrollY * 0.6) + 'px)';
        pLayers.content.style.opacity = Math.max(0, 1 - scrollY / (vh * 0.6));
      }
      if (pLayers.lines) pLayers.lines.style.transform = 'translateY(' + (scrollY * 0.8) + 'px)';
    }, { passive: true });

    initParallaxHero();
  }

})();
