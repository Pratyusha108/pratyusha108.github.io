document.addEventListener('DOMContentLoaded', function () {

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
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute('id');
            navLinks.forEach(function (link) {
              var linkHref = link.getAttribute('href');
              if (linkHref === '#' + id) {
                link.classList.add('active');
              } else if (linkHref.startsWith('#')) {
                link.classList.remove('active');
              }
            });
          }
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

});
