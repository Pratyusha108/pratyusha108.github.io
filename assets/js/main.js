document.addEventListener('DOMContentLoaded', function () {

  // ====== PAGE LOADER ======
  window.addEventListener('load', function () {
    var loader = document.querySelector('.page-loader');
    if (loader) {
      loader.classList.add('loaded');
      setTimeout(function () {
        loader.remove();
      }, 600);
    }
  });

  // ====== DARK MODE TOGGLE ======
  var toggleButton = document.getElementById('dark-mode-toggle');
  var body = document.body;
  var toggleIcon = document.querySelector('.toggle-icon');

  var currentTheme = localStorage.getItem('theme') || 'light-mode';
  body.classList.add(currentTheme);
  updateToggleIcon(currentTheme);

  toggleButton.addEventListener('click', function () {
    body.classList.toggle('dark-mode');
    body.classList.toggle('light-mode');
    var newTheme = body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode';
    localStorage.setItem('theme', newTheme);
    updateToggleIcon(newTheme);
  });

  function updateToggleIcon(theme) {
    toggleIcon.textContent = theme === 'dark-mode' ? '\u2600\uFE0F' : '\uD83C\uDF19';
  }

  // ====== KEYBOARD SHORTCUT: D to toggle dark mode ======
  document.addEventListener('keydown', function (e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'd' || e.key === 'D') {
      toggleButton.click();
    }
  });

  // ====== SCROLL PROGRESS BAR ======
  var scrollProgress = document.querySelector('.scroll-progress');
  if (scrollProgress) {
    window.addEventListener('scroll', function () {
      var scrollTop = document.documentElement.scrollTop;
      var scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      scrollProgress.style.width = progress + '%';
    });
  }

  // ====== BACK TO TOP BUTTON ======
  var backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 300) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ====== FADE-IN ON SCROLL ======
  var fadeElements = document.querySelectorAll('.fade-in');
  var fadeObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  fadeElements.forEach(function (el) {
    fadeObserver.observe(el);
  });

  // ====== HAMBURGER MENU ======
  var hamburger = document.querySelector('.hamburger');
  var nav = document.querySelector('header nav');
  if (hamburger && nav) {
    hamburger.addEventListener('click', function () {
      nav.classList.toggle('nav-open');
      hamburger.innerHTML = nav.classList.contains('nav-open')
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
    });
  }

  // ====== ACTIVE NAV HIGHLIGHTING ======
  var navLinks = document.querySelectorAll('header nav a');
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Scroll spy for index.html sections
  if (currentPage === 'index.html' || currentPage === '' || currentPage === '/') {
    var sections = document.querySelectorAll('section[id]');
    if (sections.length > 0) {
      var sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var id = entry.target.getAttribute('id');
          navLinks.forEach(function (link) {
            var linkHref = link.getAttribute('href');
            if (linkHref === '#' + id) {
              if (entry.isIntersecting) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            }
          });
        });
      }, { threshold: 0.3 });
      sections.forEach(function (s) { sectionObserver.observe(s); });
    }
  }

  // ====== ANIMATED STAT COUNTERS ======
  var statNumbers = document.querySelectorAll('.stat .number');
  if (statNumbers.length > 0) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          if (el.dataset.counted) return;
          el.dataset.counted = 'true';

          var text = el.textContent.trim();
          var match = text.match(/(\d+)/);
          if (!match) return;

          var target = parseInt(match[1]);
          var suffix = text.replace(match[1], '');
          var duration = 1500;
          var start = performance.now();

          function animate(now) {
            var elapsed = now - start;
            var progress = Math.min(elapsed / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = Math.floor(eased * target);
            el.textContent = current + suffix;
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              el.textContent = target + suffix;
            }
          }
          requestAnimationFrame(animate);
        }
      });
    }, { threshold: 0.5 });
    statNumbers.forEach(function (el) { counterObserver.observe(el); });
  }

  // ====== TYPEWRITER EFFECT ======
  var typewriterEl = document.getElementById('typewriter');
  if (typewriterEl) {
    var phrases = ['Data Scientist', 'ML Engineer', 'Analytics Expert', 'AI Researcher'];
    var phraseIndex = 0;
    var charIndex = 0;
    var isDeleting = false;

    function typewrite() {
      var current = phrases[phraseIndex];

      if (isDeleting) {
        charIndex--;
        typewriterEl.textContent = current.substring(0, charIndex);
      } else {
        charIndex++;
        typewriterEl.textContent = current.substring(0, charIndex);
      }

      var delay = isDeleting ? 50 : 100;

      if (!isDeleting && charIndex === current.length) {
        delay = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 500;
      }

      setTimeout(typewrite, delay);
    }
    typewrite();
  }

  // ====== TESTIMONIAL CAROUSEL ======
  var carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    var track = carousel.querySelector('.testimonial-track');
    var cards = carousel.querySelectorAll('.testimonial-card');
    var dots = carousel.querySelectorAll('.carousel-dot');
    var prevBtn = carousel.querySelector('.carousel-prev');
    var nextBtn = carousel.querySelector('.carousel-next');
    var currentSlide = 0;
    var autoPlay;

    function goToSlide(index) {
      currentSlide = index;
      track.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
      dots.forEach(function (d, i) {
        d.classList.toggle('active', i === currentSlide);
      });
    }

    function nextSlide() {
      goToSlide((currentSlide + 1) % cards.length);
    }

    function prevSlide() {
      goToSlide((currentSlide - 1 + cards.length) % cards.length);
    }

    if (nextBtn) nextBtn.addEventListener('click', function () { nextSlide(); resetAutoPlay(); });
    if (prevBtn) prevBtn.addEventListener('click', function () { prevSlide(); resetAutoPlay(); });
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goToSlide(i); resetAutoPlay(); });
    });

    function resetAutoPlay() {
      clearInterval(autoPlay);
      autoPlay = setInterval(nextSlide, 5000);
    }
    autoPlay = setInterval(nextSlide, 5000);
  }

  // ====== PARTICLE BACKGROUND ======
  var canvas = document.getElementById('particle-canvas');
  if (canvas) {
    var ctx = canvas.getContext('2d');
    var particles = [];
    var particleCount = 50;
    var maxDist = 120;

    function resizeCanvas() {
      var hero = canvas.parentElement;
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    for (var i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1
      });
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 159, 0, 0.5)';
        ctx.fill();

        for (var j = i + 1; j < particles.length; j++) {
          var p2 = particles[j];
          var dx = p.x - p2.x;
          var dy = p.y - p2.y;
          var dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = 'rgba(255, 159, 0, ' + (1 - dist / maxDist) * 0.2 + ')';
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // ====== PAGE PARTICLE BACKGROUND (About & Projects) ======
  var pageCanvas = document.getElementById('page-particle-canvas');
  if (pageCanvas) {
    var pCtx = pageCanvas.getContext('2d');
    var pParticles = [];
    var pCount = 70;
    var pMaxDist = 110;
    var pMouseRadius = 150;
    var pMouseX = -1000;
    var pMouseY = -1000;

    function resizePageCanvas() {
      pageCanvas.width = window.innerWidth;
      pageCanvas.height = window.innerHeight;
    }

    resizePageCanvas();
    window.addEventListener('resize', resizePageCanvas);

    document.addEventListener('mousemove', function (e) {
      pMouseX = e.clientX;
      pMouseY = e.clientY;
    });
    document.addEventListener('mouseleave', function () {
      pMouseX = -1000;
      pMouseY = -1000;
    });

    for (var pi = 0; pi < pCount; pi++) {
      pParticles.push({
        x: Math.random() * pageCanvas.width,
        y: Math.random() * pageCanvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 3.5 + 1,
        color: pi % 3 === 0 ? 'rgba(255, 107, 107, 0.7)' : 'rgba(255, 159, 0, 0.7)'
      });
    }

    function animatePageParticles() {
      pCtx.clearRect(0, 0, pageCanvas.width, pageCanvas.height);

      for (var i = 0; i < pParticles.length; i++) {
        var p = pParticles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > pageCanvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > pageCanvas.height) p.vy *= -1;

        pCtx.beginPath();
        pCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        pCtx.fillStyle = p.color;
        pCtx.fill();

        for (var j = i + 1; j < pParticles.length; j++) {
          var p2 = pParticles[j];
          var dx = p.x - p2.x;
          var dy = p.y - p2.y;
          var dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < pMaxDist) {
            pCtx.beginPath();
            pCtx.moveTo(p.x, p.y);
            pCtx.lineTo(p2.x, p2.y);
            pCtx.lineWidth = 0.5;
            pCtx.strokeStyle = 'rgba(255, 159, 0, ' + (1 - dist / pMaxDist) * 0.15 + ')';
            pCtx.stroke();
          }
        }

        var dxm = p.x - pMouseX;
        var dym = p.y - pMouseY;
        var distM = Math.sqrt(dxm * dxm + dym * dym);
        if (distM < pMouseRadius) {
          pCtx.beginPath();
          pCtx.moveTo(p.x, p.y);
          pCtx.lineTo(pMouseX, pMouseY);
          pCtx.lineWidth = 0.8;
          pCtx.strokeStyle = 'rgba(255, 159, 0, ' + (1 - distM / pMouseRadius) * 0.25 + ')';
          pCtx.stroke();
          p.x -= dxm * 0.002;
          p.y -= dym * 0.002;
        }
      }

      if (pMouseX > 0 && pMouseY > 0) {
        pCtx.beginPath();
        pCtx.arc(pMouseX, pMouseY, 3, 0, Math.PI * 2);
        pCtx.fillStyle = 'rgba(255, 159, 0, 0.6)';
        pCtx.fill();
      }

      requestAnimationFrame(animatePageParticles);
    }
    animatePageParticles();
  }

  // ====== SKILL BAR ANIMATION ======
  var skillsContainer = document.querySelector('.skills-container');
  if (skillsContainer) {
    var skillObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var bars = entry.target.querySelectorAll('.bar-fill');
          bars.forEach(function (bar, index) {
            setTimeout(function () {
              bar.style.width = bar.getAttribute('data-width') + '%';
            }, index * 100);
          });
          skillObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    skillObserver.observe(skillsContainer);
  }

  // ====== CUSTOM CURSOR ======
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    var cursorRing = document.createElement('div');
    cursorRing.className = 'cursor-ring';
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorRing);

    var cursorX = 0, cursorY = 0, ringX = 0, ringY = 0;

    document.addEventListener('mousemove', function (e) {
      cursorX = e.clientX;
      cursorY = e.clientY;
      cursorDot.style.left = cursorX + 'px';
      cursorDot.style.top = cursorY + 'px';
    });

    function updateCursorRing() {
      ringX += (cursorX - ringX) * 0.15;
      ringY += (cursorY - ringY) * 0.15;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(updateCursorRing);
    }
    updateCursorRing();

    document.addEventListener('mouseover', function (e) {
      if (e.target.closest('a, button, [onclick], .project-link, .filter-btn, .blog-card, .project-card, .chatbot-toggle')) {
        cursorRing.classList.add('hover');
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
      }
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest('a, button, [onclick], .project-link, .filter-btn, .blog-card, .project-card, .chatbot-toggle')) {
        cursorRing.classList.remove('hover');
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
      }
    });
  }

  // ====== SMOOTH PAGE TRANSITIONS ======
  var pageTransition = document.createElement('div');
  pageTransition.className = 'page-transition';
  document.body.appendChild(pageTransition);

  if (sessionStorage.getItem('page-transitioning')) {
    pageTransition.classList.add('active');
    sessionStorage.removeItem('page-transitioning');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        pageTransition.classList.remove('active');
      });
    });
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || link.target === '_blank') return;
    e.preventDefault();
    sessionStorage.setItem('page-transitioning', '1');
    pageTransition.classList.add('active');
    setTimeout(function () {
      window.location.href = href;
    }, 450);
  });

  // ====== TEXT REVEAL ON SCROLL ======
  var revealTargets = document.querySelectorAll('section h1, section h2, .showcase-intro, .section-subtitle');
  revealTargets.forEach(function (el) {
    if (!el.closest('header') && !el.closest('.modal-box') && !el.closest('.blog-overlay') && !el.closest('.fade-in')) {
      el.classList.add('text-reveal');
    }
  });
  var textRevealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        textRevealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.text-reveal').forEach(function (el) {
    textRevealObserver.observe(el);
  });

  // ====== MAGNETIC BUTTONS ======
  document.querySelectorAll('.resume-btn, .project-link, .filter-btn, .modal-github-btn, .paper-link').forEach(function (el) {
    el.addEventListener('mousemove', function (e) {
      var rect = el.getBoundingClientRect();
      var x = e.clientX - rect.left - rect.width / 2;
      var y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = 'translate(' + (x * 0.3) + 'px, ' + (y * 0.3) + 'px)';
    });
    el.addEventListener('mouseleave', function () {
      el.style.transform = '';
    });
  });

  // ====== CONFETTI ON RESUME DOWNLOAD ======
  function launchConfetti(ox, oy) {
    var cc = document.createElement('canvas');
    cc.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:100003';
    document.body.appendChild(cc);
    var cCtx = cc.getContext('2d');
    cc.width = window.innerWidth;
    cc.height = window.innerHeight;
    var pieces = [];
    var colors = ['#ff9f00', '#ff6b6b', '#ffd700', '#00c853', '#2196f3', '#e040fb'];
    for (var i = 0; i < 120; i++) {
      pieces.push({
        x: ox, y: oy,
        vx: (Math.random() - 0.5) * 16,
        vy: Math.random() * -20 - 4,
        w: Math.random() * 8 + 4, h: Math.random() * 6 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        rot: Math.random() * 360, rotV: (Math.random() - 0.5) * 12,
        gravity: 0.35 + Math.random() * 0.2, opacity: 1
      });
    }
    var frame = 0;
    function animateC() {
      cCtx.clearRect(0, 0, cc.width, cc.height);
      var alive = false;
      pieces.forEach(function (p) {
        if (p.opacity <= 0) return;
        alive = true;
        p.x += p.vx; p.vy += p.gravity; p.y += p.vy;
        p.rot += p.rotV; p.vx *= 0.98;
        if (frame > 60) p.opacity -= 0.015;
        cCtx.save();
        cCtx.translate(p.x, p.y);
        cCtx.rotate(p.rot * Math.PI / 180);
        cCtx.globalAlpha = Math.max(0, p.opacity);
        cCtx.fillStyle = p.color;
        cCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        cCtx.restore();
      });
      frame++;
      if (alive && frame < 200) requestAnimationFrame(animateC);
      else cc.remove();
    }
    animateC();
  }

  // Sparkle burst for cert cards
  function launchSparkles(ox, oy) {
    var sc = document.createElement('canvas');
    sc.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:100003';
    document.body.appendChild(sc);
    var sCtx = sc.getContext('2d');
    sc.width = window.innerWidth;
    sc.height = window.innerHeight;
    var sparks = [];
    for (var i = 0; i < 28; i++) {
      var angle = (Math.PI * 2 / 28) * i + (Math.random() - 0.5) * 0.4;
      var speed = 3 + Math.random() * 5;
      sparks.push({
        x: ox, y: oy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3 + 1.5,
        color: Math.random() > 0.5 ? '#ff9f00' : '#ffd700',
        opacity: 1, life: 0
      });
    }
    var frame = 0;
    function animateS() {
      sCtx.clearRect(0, 0, sc.width, sc.height);
      var alive = false;
      sparks.forEach(function (s) {
        if (s.opacity <= 0) return;
        alive = true;
        s.x += s.vx; s.y += s.vy;
        s.vx *= 0.96; s.vy *= 0.96;
        s.life++;
        if (s.life > 15) s.opacity -= 0.06;
        sCtx.save();
        sCtx.globalAlpha = Math.max(0, s.opacity);
        sCtx.fillStyle = s.color;
        sCtx.shadowColor = s.color;
        sCtx.shadowBlur = 8;
        // Draw 4-point star
        sCtx.beginPath();
        var sz = s.size;
        sCtx.moveTo(s.x, s.y - sz * 2);
        sCtx.quadraticCurveTo(s.x + sz * 0.3, s.y - sz * 0.3, s.x + sz * 2, s.y);
        sCtx.quadraticCurveTo(s.x + sz * 0.3, s.y + sz * 0.3, s.x, s.y + sz * 2);
        sCtx.quadraticCurveTo(s.x - sz * 0.3, s.y + sz * 0.3, s.x - sz * 2, s.y);
        sCtx.quadraticCurveTo(s.x - sz * 0.3, s.y - sz * 0.3, s.x, s.y - sz * 2);
        sCtx.fill();
        sCtx.restore();
      });
      frame++;
      if (alive && frame < 80) requestAnimationFrame(animateS);
      else sc.remove();
    }
    animateS();
  }

  document.addEventListener('click', function (e) {
    var certLink = e.target.closest('.cert-card');
    if (certLink) {
      launchSparkles(e.clientX, e.clientY);
      return;
    }
    var link = e.target.closest('a[href*="drive.google.com"], .resume-btn');
    if (link) launchConfetti(e.clientX, e.clientY);
  });

  // ====== SCROLL PARALLAX ======
  (function () {
    var heroContent = document.querySelector('.blog-hero-content') || document.querySelector('.project-showcase > h1');
    if (!heroContent) return;
    window.addEventListener('scroll', function () {
      var scrollY = window.pageYOffset;
      if (scrollY < window.innerHeight * 1.5) {
        heroContent.style.transform = 'translateY(' + (scrollY * 0.12) + 'px)';
        heroContent.style.opacity = Math.max(0.4, 1 - (scrollY / window.innerHeight) * 0.4);
      }
    }, { passive: true });
  })();

  // ====== INTERACTIVE RADAR CHART ======
  var radarCanvas = document.getElementById('radar-chart');
  if (radarCanvas) {
    var rCtx = radarCanvas.getContext('2d');
    var radarSkills = [
      { name: 'Python', value: 92 },
      { name: 'SQL', value: 90 },
      { name: 'Power BI', value: 88 },
      { name: 'R', value: 85 },
      { name: 'ML', value: 90 },
      { name: 'DL', value: 82 },
      { name: 'Cloud', value: 80 },
      { name: 'NLP', value: 78 }
    ];
    var numSkills = radarSkills.length;
    var rCenterX, rCenterY, rMaxRadius;

    function drawRadarChart() {
      var container = radarCanvas.parentElement;
      var size = Math.min(container.offsetWidth, 400);
      radarCanvas.width = size;
      radarCanvas.height = size;
      rCenterX = size / 2;
      rCenterY = size / 2;
      rMaxRadius = size * 0.32;
      rCtx.clearRect(0, 0, size, size);
      var angleStep = (Math.PI * 2) / numSkills;
      var startAngle = -Math.PI / 2;

      // Guide octagons
      [0.2, 0.4, 0.6, 0.8, 1.0].forEach(function (scale) {
        rCtx.beginPath();
        for (var i = 0; i < numSkills; i++) {
          var angle = startAngle + i * angleStep;
          var x = rCenterX + Math.cos(angle) * rMaxRadius * scale;
          var y = rCenterY + Math.sin(angle) * rMaxRadius * scale;
          if (i === 0) rCtx.moveTo(x, y); else rCtx.lineTo(x, y);
        }
        rCtx.closePath();
        rCtx.strokeStyle = 'rgba(255, 159, 0, 0.12)';
        rCtx.lineWidth = 1;
        rCtx.stroke();
      });

      // Axis lines
      for (var i = 0; i < numSkills; i++) {
        var angle = startAngle + i * angleStep;
        rCtx.beginPath();
        rCtx.moveTo(rCenterX, rCenterY);
        rCtx.lineTo(rCenterX + Math.cos(angle) * rMaxRadius, rCenterY + Math.sin(angle) * rMaxRadius);
        rCtx.strokeStyle = 'rgba(255, 159, 0, 0.08)';
        rCtx.stroke();
      }

      // Skill polygon
      rCtx.beginPath();
      for (var i = 0; i < numSkills; i++) {
        var angle = startAngle + i * angleStep;
        var r = rMaxRadius * (radarSkills[i].value / 100);
        var x = rCenterX + Math.cos(angle) * r;
        var y = rCenterY + Math.sin(angle) * r;
        if (i === 0) rCtx.moveTo(x, y); else rCtx.lineTo(x, y);
      }
      rCtx.closePath();
      var gradient = rCtx.createRadialGradient(rCenterX, rCenterY, 0, rCenterX, rCenterY, rMaxRadius);
      gradient.addColorStop(0, 'rgba(255, 159, 0, 0.35)');
      gradient.addColorStop(1, 'rgba(255, 107, 107, 0.1)');
      rCtx.fillStyle = gradient;
      rCtx.fill();
      rCtx.strokeStyle = 'rgba(255, 159, 0, 0.8)';
      rCtx.lineWidth = 2;
      rCtx.stroke();

      // Data points
      for (var i = 0; i < numSkills; i++) {
        var angle = startAngle + i * angleStep;
        var r = rMaxRadius * (radarSkills[i].value / 100);
        var x = rCenterX + Math.cos(angle) * r;
        var y = rCenterY + Math.sin(angle) * r;
        rCtx.beginPath();
        rCtx.arc(x, y, 4, 0, Math.PI * 2);
        rCtx.fillStyle = '#ff9f00';
        rCtx.fill();
        rCtx.strokeStyle = '#fff';
        rCtx.lineWidth = 1.5;
        rCtx.stroke();
      }

      // Labels
      var isLight = document.body.classList.contains('light-mode');
      rCtx.fillStyle = isLight ? '#333' : '#e6e6e6';
      rCtx.font = '600 11px Roboto, sans-serif';
      for (var i = 0; i < numSkills; i++) {
        var angle = startAngle + i * angleStep;
        var labelR = rMaxRadius + 22;
        var lx = rCenterX + Math.cos(angle) * labelR;
        var ly = rCenterY + Math.sin(angle) * labelR;
        if (Math.cos(angle) > 0.1) rCtx.textAlign = 'left';
        else if (Math.cos(angle) < -0.1) rCtx.textAlign = 'right';
        else rCtx.textAlign = 'center';
        if (Math.sin(angle) > 0.3) ly += 6;
        else if (Math.sin(angle) < -0.3) ly -= 3;
        rCtx.fillText(radarSkills[i].name + ' ' + radarSkills[i].value + '%', lx, ly);
      }
    }

    drawRadarChart();
    window.addEventListener('resize', drawRadarChart);
    new MutationObserver(function () { drawRadarChart(); })
      .observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }

  // ====== GITHUB ACTIVITY HEATMAP ======
  var heatmapEl = document.getElementById('github-heatmap');
  if (heatmapEl) {
    var hWeeks = 20;
    var hToday = new Date();
    var hStart = new Date(hToday);
    hStart.setDate(hStart.getDate() - hWeeks * 7 + 1);
    hStart.setDate(hStart.getDate() - hStart.getDay());

    var dayLabels = document.createElement('div');
    dayLabels.className = 'heatmap-day-labels';
    dayLabels.innerHTML = '<span></span><span>Mon</span><span></span><span>Wed</span><span></span><span>Fri</span><span></span>';
    heatmapEl.appendChild(dayLabels);

    var hGrid = document.createElement('div');
    hGrid.className = 'heatmap-grid';
    var hCells = {};

    for (var w = 0; w < hWeeks; w++) {
      var col = document.createElement('div');
      col.className = 'heatmap-col';
      for (var d = 0; d < 7; d++) {
        var cellDate = new Date(hStart);
        cellDate.setDate(hStart.getDate() + w * 7 + d);
        var cell = document.createElement('div');
        cell.className = 'heatmap-cell';
        if (cellDate > hToday) {
          cell.classList.add('empty');
        } else {
          var key = cellDate.toISOString().split('T')[0];
          cell.setAttribute('title', key);
          hCells[key] = cell;
        }
        col.appendChild(cell);
      }
      hGrid.appendChild(col);
    }
    heatmapEl.appendChild(hGrid);

    fetch('https://api.github.com/users/Pratyusha108/events?per_page=100')
      .then(function (res) { return res.json(); })
      .then(function (events) {
        if (!Array.isArray(events)) return;
        var counts = {};
        events.forEach(function (ev) {
          var date = ev.created_at.split('T')[0];
          counts[date] = (counts[date] || 0) + 1;
        });
        Object.keys(counts).forEach(function (date) {
          if (hCells[date]) {
            var count = counts[date];
            var level = count >= 8 ? 4 : count >= 5 ? 3 : count >= 2 ? 2 : 1;
            hCells[date].setAttribute('data-level', level);
            hCells[date].setAttribute('title', date + ': ' + count + ' events');
          }
        });
      })
      .catch(function () {});
  }

  // ====== KONAMI CODE EASTER EGG ======
  var konamiSeq = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
  var konamiIdx = 0;
  document.addEventListener('keydown', function (e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.keyCode === konamiSeq[konamiIdx]) {
      konamiIdx++;
      if (konamiIdx === konamiSeq.length) {
        konamiIdx = 0;
        triggerMatrixRain();
      }
    } else {
      konamiIdx = 0;
    }
  });

  function triggerMatrixRain() {
    var mc = document.createElement('canvas');
    mc.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:100003;pointer-events:none';
    document.body.appendChild(mc);
    var mCtx = mc.getContext('2d');
    mc.width = window.innerWidth;
    mc.height = window.innerHeight;

    var chars = '0123456789ABCDEF<>{}[]()=+-*/DATA ML AI NLP CNN RNN LSTM';
    var columns = Math.floor(mc.width / 14);
    var drops = [];
    for (var c = 0; c < columns; c++) drops[c] = Math.floor(Math.random() * -50);

    var mFrames = 0;
    function drawMatrix() {
      mCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      mCtx.fillRect(0, 0, mc.width, mc.height);
      for (var i = 0; i < drops.length; i++) {
        var ch = chars[Math.floor(Math.random() * chars.length)];
        mCtx.fillStyle = Math.random() > 0.3
          ? 'rgba(255, 159, 0, ' + (0.5 + Math.random() * 0.5) + ')'
          : 'rgba(255, 107, 107, 0.7)';
        mCtx.font = '14px monospace';
        mCtx.fillText(ch, i * 14, drops[i] * 14);
        if (drops[i] * 14 > mc.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      mFrames++;
      if (mFrames < 300) {
        requestAnimationFrame(drawMatrix);
      } else {
        var fadeOp = 1;
        function fadeMatrix() {
          fadeOp -= 0.03;
          mc.style.opacity = Math.max(0, fadeOp);
          if (fadeOp > 0) requestAnimationFrame(fadeMatrix);
          else mc.remove();
        }
        fadeMatrix();
      }
    }
    drawMatrix();
  }

});
