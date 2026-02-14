(function () {
  // ====== BLOG POST DATA ======
  var posts = [
    {
      id: 'feature-engineering',
      title: 'Why Feature Engineering Is Still the Most Underrated Skill in ML',
      excerpt: 'Everyone talks about model architecture, but the real competitive edge in machine learning comes from understanding your data deeply enough to craft meaningful features.',
      tags: ['ML', 'Data Science'],
      date: 'Feb 10, 2026',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=300&fit=crop',
      content: '<p>In the era of AutoML and pre-trained transformers, it\'s tempting to think that feature engineering is a relic of the past. But after working on real-world ML projects, I keep coming back to the same lesson: feature engineering remains the single most impactful step in any modeling pipeline.</p>' +
        '<h3>Why Models Alone Aren\'t Enough</h3>' +
        '<p>A Random Forest on well-crafted features will consistently outperform a deep neural network on raw, poorly understood data. No algorithm can discover that "days since last purchase" matters more than "total purchases" without being told. That insight comes from domain knowledge, and domain knowledge comes from spending time with the data before you ever touch a model.</p>' +
        '<p>There\'s also the interpretability angle. Stakeholders trust models they can explain. When your features map directly to business concepts, the conversation shifts from "trust the black box" to "here\'s exactly why the model recommends this."</p>' +
        '<h3>What I Actually Do</h3>' +
        '<p>I always start with EDA -distributions, missing patterns, correlations. Then I move to domain encoding: converting business rules into numeric signals like recency, frequency, and monetary value. Interaction features (ratios, differences) come next, followed by temporal features for time-dependent data. And I always validate for leakage. If a feature looks too good to be true, it probably is.</p>' +
        '<p>In my direct mail response modeling project, this approach (PCA + domain-driven variables) pushed the AUC from 0.78 to <strong>0.902</strong>. No amount of hyperparameter tuning alone could have gotten there.</p>' +
        '<h3>The Bottom Line</h3>' +
        '<p>Learn your algorithms, absolutely. But invest equally in understanding your data. The best data scientists I\'ve worked with spend 60-70% of their time on data preparation and feature engineering. That\'s not inefficiency -it\'s where the real value gets created.</p>'
    },
    {
      id: 'mba-to-data-science',
      title: 'From MBA to Data Science: My Non-Linear Career Path',
      excerpt: 'How an MBA in Technology Management became the unexpected foundation for a career in machine learning and analytics.',
      tags: ['Career', 'Personal'],
      date: 'Jan 25, 2026',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=300&fit=crop',
      content: '<p>When people see "MBA" and "Data Scientist" on the same resume, they often ask: "How did you get from there to here?" The answer is: it wasn\'t a pivot -it was an evolution.</p>' +
        '<h3>What the MBA Actually Gave Me</h3>' +
        '<p>My MBA in Technology Management taught me things no Python bootcamp ever could. Understanding why a model matters is as important as building it. Stakeholders don\'t care about your AUC -they care about revenue impact. Translating "the model\'s precision is 0.87" into "we\'ll correctly identify 87% of high-value leads" is where real impact happens.</p>' +
        '<p>The coursework in RDBMS and information systems gave me a systems-level view of how data flows through organizations. That perspective is something I use every single day.</p>' +
        '<h3>The Path</h3>' +
        '<p>My B.Tech in Electrical Engineering built the quantitative foundation -signal processing, linear algebra, probability. Then an IoT internship gave me my first taste of real data: sensor logs, anomaly detection, root-cause analysis. The MBA added the business layer. Data analyst roles built the practical muscle with Power BI, SQL, and KPI tracking. And now the M.S. in Data Analytics is giving me the deep technical rigor in ML and statistical modeling.</p>' +
        '<p>Each step made the next one possible. None of it was wasted.</p>' +
        '<h3>For Career Switchers</h3>' +
        '<p>If you\'re coming from a non-traditional background, don\'t apologize for it -leverage it. Domain expertise is rare and valuable. Build projects that showcase both technical skill and business thinking. And remember that your "soft skills" are actually hard skills in data science. Communication, stakeholder management, and project scoping are what separate good data scientists from great ones.</p>'
    },
    {
      id: 'kaggle-real-world',
      title: 'The Real-World Gap: What Kaggle Teaches You (and What It Doesn\'t)',
      excerpt: 'Kaggle competitions are incredible for learning. But the skills that win competitions are different from the skills that deliver business value.',
      tags: ['ML', 'AI'],
      date: 'Jan 12, 2026',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&h=300&fit=crop',
      content: '<p>I love Kaggle. My analytics notebooks there have taught me more about EDA than any textbook. But after applying these skills in professional settings, I\'ve noticed a real gap between competition ML and production ML.</p>' +
        '<h3>What Kaggle Does Well</h3>' +
        '<p>Kaggle teaches you to squeeze every bit of performance out of your models. You learn ensemble methods, careful cross-validation, and how to avoid overfitting. The EDA discipline that competition winners develop transfers perfectly to real work. And reading top solutions is genuinely one of the fastest ways to level up as a data scientist.</p>' +
        '<h3>The Gap</h3>' +
        '<p>On Kaggle, the data arrives in a neat CSV. In reality, you\'re writing SQL joins across 15 tables, handling missing schemas, and negotiating data access with IT. Nobody on Kaggle asks "but what does this mean for our Q3 strategy?" Real projects require translating model outputs into business decisions.</p>' +
        '<p>Then there\'s everything Kaggle doesn\'t touch: data governance, PII handling, GDPR compliance, model deployment, drift detection, monitoring. And probably the hardest part of real-world data science -figuring out what question to ask in the first place. In Kaggle, the metric is defined for you. In the real world, choosing the right metric IS the problem.</p>' +
        '<h3>My Advice</h3>' +
        '<p>Use Kaggle for learning algorithms and EDA patterns -it\'s excellent for that. But also build end-to-end projects with messy, self-collected data. Practice explaining your results to non-technical people. Learn SQL deeply (it\'s honestly 60% of a working data scientist\'s day). And study data governance and ethics, because these are increasingly non-negotiable in any serious organization.</p>'
    },
    {
      id: 'data-governance',
      title: 'Why Every Data Scientist Should Understand Data Governance',
      excerpt: 'Data governance isn\'t just for compliance teams. It directly impacts model quality, stakeholder trust, and your ability to ship projects.',
      tags: ['Data Science', 'AI'],
      date: 'Dec 28, 2025',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=300&fit=crop',
      content: '<p>Early in my career, I thought data governance was someone else\'s problem. Then I spent three weeks building a model on data that turned out to contain PII in an unmasked column. The entire pipeline had to be rebuilt. That experience changed how I think about every project.</p>' +
        '<p>Governance isn\'t about bureaucracy. It\'s about knowing where your data comes from, who can access it, and whether the definitions you\'re using are consistent across the organization. When I say "customer," does the marketing team mean the same thing as the finance team? Usually not, and that\'s where models start to fall apart.</p>' +
        '<h3>How This Affects Your Models</h3>' +
        '<p>I\'ve seen teams ship models that looked great in notebooks but failed in production because nobody checked whether the training features would actually be available at inference time. Feature leakage, inconsistent labels, silent schema changes upstream -these aren\'t edge cases. They happen all the time when governance is an afterthought.</p>' +
        '<p>GDPR, CCPA, HIPAA -these aren\'t just legal checkboxes. They determine which features you can use, how you store predictions, and whether your model can even be deployed. I learned this the hard way.</p>' +
        '<h3>What I Do Now</h3>' +
        '<p>For every project, I maintain a data dictionary that documents where each feature comes from and how often it updates. I run automated quality checks in the pipeline -null rates, distribution shifts, schema validation. And I version-control my training datasets alongside the model artifacts, so I can always reproduce a result from six months ago.</p>' +
        '<p>It\'s extra work upfront, but it\'s the difference between a model that works in a Jupyter notebook and one that works in production. If you\'re building models without thinking about governance, you\'re building on sand.</p>'
    }
  ];

  // ====== STORAGE FOR LIKES (per-post keys) ======
  var LIKES_PREFIX = 'blog_like_';

  // Migrate old shared-object format to individual keys
  (function migrateLikes() {
    try {
      var old = localStorage.getItem('blog_likes');
      if (old) {
        var data = JSON.parse(old);
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          Object.keys(data).forEach(function (id) {
            if (data[id]) localStorage.setItem(LIKES_PREFIX + id, '1');
          });
        }
        localStorage.removeItem('blog_likes');
      }
    } catch (e) { }
  })();

  function isPostLiked(id) {
    try { return localStorage.getItem(LIKES_PREFIX + id) === '1'; } catch (e) { return false; }
  }

  function setPostLike(id, liked) {
    try {
      if (liked) localStorage.setItem(LIKES_PREFIX + id, '1');
      else localStorage.removeItem(LIKES_PREFIX + id);
    } catch (e) { }
  }

  // ====== RENDERING ======
  var currentFilter = 'All';
  var blogGridEl, overlayEl;

  function getAllTags() {
    var tagSet = {};
    posts.forEach(function (p) {
      p.tags.forEach(function (t) { tagSet[t] = true; });
    });
    return ['All'].concat(Object.keys(tagSet).sort());
  }

  function renderFilters() {
    var container = document.querySelector('.blog-filters');
    if (!container) return;
    var tags = getAllTags();
    container.innerHTML = '';
    tags.forEach(function (tag) {
      var btn = document.createElement('button');
      btn.className = 'blog-filter-btn' + (tag === currentFilter ? ' active' : '');
      btn.textContent = tag;
      btn.addEventListener('click', function () {
        currentFilter = tag;
        renderFilters();
        renderPostGrid();
      });
      container.appendChild(btn);
    });
  }

  function renderPostGrid() {
    if (!blogGridEl) return;
    var filtered = currentFilter === 'All' ? posts : posts.filter(function (p) {
      return p.tags.indexOf(currentFilter) !== -1;
    });

    blogGridEl.innerHTML = '';
    filtered.forEach(function (post) {
      var card = document.createElement('div');
      card.className = 'blog-card';
      card.innerHTML =
        '<img class="blog-card-image" src="' + post.image + '" alt="' + post.title + '" loading="lazy">' +
        '<div class="blog-card-body">' +
          '<div class="blog-card-tags">' + post.tags.map(function (t) { return '<span>' + t + '</span>'; }).join('') + '</div>' +
          '<h3>' + post.title + '</h3>' +
          '<p class="blog-excerpt">' + post.excerpt + '</p>' +
          '<div class="blog-card-meta">' +
            '<span>' + post.date + '</span>' +
            '<span class="read-time"><i class="fas fa-clock"></i> ' + post.readTime + '</span>' +
          '</div>' +
        '</div>';
      card.addEventListener('click', function () { openPost(post.id); });
      blogGridEl.appendChild(card);
    });
    observeCards();
  }

  function openPost(id) {
    var post = posts.find(function (p) { return p.id === id; });
    if (!post || !overlayEl) return;

    var isLiked = isPostLiked(id);

    overlayEl.innerHTML =
      '<div class="blog-expanded">' +
        '<button class="blog-expanded-close"><i class="fas fa-times"></i></button>' +
        '<div class="blog-expanded-tags">' + post.tags.map(function (t) { return '<span>' + t + '</span>'; }).join('') + '</div>' +
        '<h2>' + post.title + '</h2>' +
        '<div class="blog-expanded-meta">' +
          '<span><i class="fas fa-calendar"></i> ' + post.date + '</span>' +
          '<span><i class="fas fa-clock"></i> ' + post.readTime + '</span>' +
        '</div>' +
        '<div class="blog-expanded-content">' + post.content + '</div>' +
        '<div class="blog-actions">' +
          '<button class="blog-like-btn' + (isLiked ? ' liked' : '') + '" data-id="' + id + '">' +
            '<i class="' + (isLiked ? 'fas' : 'far') + ' fa-heart"></i> ' +
            '<span>' + (isLiked ? 'Liked' : 'Like') + '</span>' +
          '</button>' +
          '<div class="blog-share-btns">' +
            '<button class="blog-share-btn" data-share="linkedin" title="Share on LinkedIn"><i class="fab fa-linkedin-in"></i></button>' +
            '<button class="blog-share-btn" data-share="twitter" title="Share on Twitter"><i class="fab fa-twitter"></i></button>' +
            '<button class="blog-share-btn" data-share="copy" title="Copy Link"><i class="fas fa-link"></i></button>' +
          '</div>' +
        '</div>' +
        '<div class="blog-disqus-container">' +
          '<h4><i class="fas fa-comments"></i> Discussion</h4>' +
          '<div id="disqus_thread"></div>' +
        '</div>' +
      '</div>';

    overlayEl.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Close button
    overlayEl.querySelector('.blog-expanded-close').addEventListener('click', closePost);

    // Click overlay backdrop to close (use onclick to prevent stacking handlers)
    overlayEl.onclick = function (e) {
      if (e.target === overlayEl) closePost();
    };

    // Like button - read post id from data-id attribute, not closure
    var likeBtn = overlayEl.querySelector('.blog-like-btn');
    likeBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      handleLike(likeBtn);
    });

    // Share buttons
    var shareBtns = overlayEl.querySelectorAll('.blog-share-btn');
    shareBtns.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        handleShare(btn.getAttribute('data-share'), post, btn);
      });
    });

    // Load Disqus
    loadDisqus(id, post.title);
  }

  function closePost() {
    if (!overlayEl) return;
    overlayEl.classList.remove('open');
    document.body.style.overflow = '';
    // Reset Disqus
    if (window.DISQUS) {
      try { window.DISQUS.reset({}); } catch (e) { }
    }
  }

  function handleLike(btn) {
    var id = btn.getAttribute('data-id');
    if (!id) return;
    var liked = isPostLiked(id);
    setPostLike(id, !liked);
    if (!liked) {
      btn.classList.add('liked');
      btn.innerHTML = '<i class="fas fa-heart"></i> <span>Liked</span>';
    } else {
      btn.classList.remove('liked');
      btn.innerHTML = '<i class="far fa-heart"></i> <span>Like</span>';
    }
  }

  function handleShare(type, post, btn) {
    var url = 'https://pratyusha108.github.io/blog.html#post-' + post.id;
    var text = post.title + ' by Sai Pratyusha Gorapalli';

    if (type === 'linkedin') {
      window.open('https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(url), '_blank', 'width=600,height=500');
    } else if (type === 'twitter') {
      window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(text) + '&url=' + encodeURIComponent(url), '_blank', 'width=600,height=400');
    } else if (type === 'copy') {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(function () {
          btn.classList.add('copied');
          btn.innerHTML = '<i class="fas fa-check"></i>';
          setTimeout(function () {
            btn.classList.remove('copied');
            btn.innerHTML = '<i class="fas fa-link"></i>';
          }, 2000);
        });
      }
    }
  }

  function loadDisqus(id, title) {
    // Use the deployed GitHub Pages URL so Disqus works consistently
    var baseUrl = 'https://pratyusha108.github.io/blog.html';

    window.disqus_config = function () {
      this.page.url = baseUrl + '#post-' + id;
      this.page.identifier = 'blog-' + id;
      this.page.title = title;
    };

    if (window.DISQUS) {
      window.DISQUS.reset({
        reload: true,
        config: window.disqus_config
      });
    } else {
      var d = document.createElement('script');
      d.src = 'https://pratyusha-portfolio.disqus.com/embed.js';
      d.setAttribute('data-timestamp', +new Date());
      (document.head || document.body).appendChild(d);
    }
  }

  // ====== INITIALIZE ======
  function initBlog() {
    blogGridEl = document.querySelector('.blog-grid');
    overlayEl = document.querySelector('.blog-overlay');
    if (!blogGridEl) return; // Not on blog page

    renderFilters();
    renderPostGrid();

    // Handle hash-based deep links
    if (window.location.hash && window.location.hash.startsWith('#post-')) {
      var postId = window.location.hash.replace('#post-', '');
      setTimeout(function () { openPost(postId); }, 500);
    } else {
      // Auto-scroll to hero for immediate visual impact
      var hero = document.querySelector('.blog-hero');
      if (hero) {
        setTimeout(function () {
          hero.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 700);
      }
    }
  }

  // ====== SCROLL-TRIGGERED CARD ENTRANCE ======
  function observeCards() {
    var cards = document.querySelectorAll('.blog-card');
    if (!('IntersectionObserver' in window)) {
      cards.forEach(function (c) { c.classList.add('blog-card-visible'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('blog-card-visible');
          var delay = parseFloat(entry.target.style.transitionDelay) || 0;
          setTimeout(function () { entry.target.style.transitionDelay = ''; }, (delay + 0.6) * 1000);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    cards.forEach(function (card, i) {
      card.style.transitionDelay = (i * 0.12) + 's';
      observer.observe(card);
    });
  }

  // ====== 3D CARD TILT + GLOW TRACKING ======
  function initCardEffects() {
    var grid = document.querySelector('.blog-grid');
    if (!grid || 'ontouchstart' in window) return;

    var currentCard = null;

    grid.addEventListener('mousemove', function (e) {
      var card = e.target.closest('.blog-card');
      if (!card) {
        if (currentCard) { currentCard.style.transform = ''; currentCard = null; }
        return;
      }
      if (card !== currentCard) {
        if (currentCard) currentCard.style.transform = '';
        currentCard = card;
      }
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var centerX = rect.width / 2;
      var centerY = rect.height / 2;
      var rotateX = ((y - centerY) / centerY) * -5;
      var rotateY = ((x - centerX) / centerX) * 5;
      card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-8px)';
      card.style.setProperty('--glow-x', ((x / rect.width) * 100) + '%');
      card.style.setProperty('--glow-y', ((y / rect.height) * 100) + '%');
    });

    grid.addEventListener('mouseleave', function () {
      if (currentCard) { currentCard.style.transform = ''; currentCard = null; }
    });
  }

  // ====== MOUSE-INTERACTIVE PARTICLE NETWORK ======
  function initBlogParticles() {
    var canvas = document.getElementById('blog-particle-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var particles = [];
    var particleCount = 80;
    var maxDist = 120;
    var mouseRadius = 160;
    var mouseX = -1000;
    var mouseY = -1000;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    document.addEventListener('mouseleave', function () {
      mouseX = -1000;
      mouseY = -1000;
    });

    for (var i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 3.5 + 1,
        color: i % 3 === 0 ? 'rgba(255, 107, 107, 0.7)' : 'rgba(255, 159, 0, 0.7)'
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Connect to nearby particles
        for (var j = i + 1; j < particles.length; j++) {
          var p2 = particles[j];
          var dx = p.x - p2.x;
          var dy = p.y - p2.y;
          var dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.lineWidth = 0.5;
            ctx.strokeStyle = 'rgba(255, 159, 0, ' + (1 - dist / maxDist) * 0.15 + ')';
            ctx.stroke();
          }
        }

        // Connect to mouse cursor - neural network effect
        var dxm = p.x - mouseX;
        var dym = p.y - mouseY;
        var distM = Math.sqrt(dxm * dxm + dym * dym);
        if (distM < mouseRadius) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouseX, mouseY);
          ctx.lineWidth = 0.8;
          ctx.strokeStyle = 'rgba(255, 159, 0, ' + (1 - distM / mouseRadius) * 0.25 + ')';
          ctx.stroke();
          // Gentle attraction toward cursor
          p.x -= dxm * 0.002;
          p.y -= dym * 0.002;
        }
      }

      // Draw cursor node
      if (mouseX > 0 && mouseY > 0) {
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 159, 0, 0.6)';
        ctx.fill();
      }

      requestAnimationFrame(animate);
    }
    animate();
  }

  function initAll() {
    initBlog();
    initBlogParticles();
    initCardEffects();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
