/* PORTFOLIO MODAL DATA */
const modalData = {
  timeSeries: {
    title: "Applied Time Series Analytics & Forecasting",
    img: "assets/images/project-time-series.png",
    desc: "End-to-end time series research portfolio using multi-domain datasets to model and forecast complex temporal behavior.",
    tech: "R, forecast, tsfeatures, zoo, tidyverse, Exponential Smoothing, ETS, TBATS, STL",
    approach: `
      The work focuses on contrasting classical and modern forecasting across diverse datasets. Methods included:
      \u2022 Decomposition (trend/seasonality/noise)
      \u2022 Benchmark models (Na\u00efve, sNa\u00efve, MA)
      \u2022 Statistical forecasting (SES, Holt, Holt-Winters)
      \u2022 Hybrid STL + ETS models and TBATS for multi-seasonal data
      \u2022 Train-test splits, error metrics, and visual diagnostics
      The analytical workflow mirrors how forecasting teams evaluate temporal dependence, structural patterns, and model suitability in production settings.
    `,
    result: "Consistently demonstrated that seasonality-aware models outperform na\u00efve baselines, with TBATS handling complex multi-seasonality and Holt-Winters excelling in retail/seasonal data.",
    tags: ["Time Series", "ETS", "TBATS", "R", "Forecasting"],
    github: "https://github.com/Pratyusha108/TIME-SERIES-ANALYSIS-PROJECT"
  },

  covidMortality: {
    title: "COVID-19 Mortality Prediction & Analytics",
    img: "assets/images/project-covid-mortality.png",
    desc: "Epidemiological data engineering + machine learning pipeline to understand COVID-19 mortality dynamics and outcomes.",
    tech: "Python, Pandas, NumPy, Matplotlib, Seaborn, Scikit-learn, Basemap",
    approach: `
      \u2022 Built ETL pipelines for global COVID datasets (cleaning, enrichment, transformations)
      \u2022 Engineered health metrics such as fatality and recovery rates
      \u2022 Performed EDA to analyze temporal and regional dynamics
      \u2022 Modeled mortality using Random Forest & SVM regression
      \u2022 Classified outcome severity using Random Forest classification
      \u2022 Used geospatial + time-series visualizations to explain global severity trends
      The project reflects public-health analytics workflows emphasizing interpretability and model-driven policy insight.
    `,
    result: "Active case counts and confirmed case volumes emerged as strong mortality predictors. Random Forest regression showed best performance with interpretable feature importance.",
    tags: ["COVID-19", "ML", "Regression", "EDA", "Python"],
    github: "https://github.com/Pratyusha108/COVID-19-MORTALITY-RATE-PREDICTION-ANALYSIS-USING-PYTHON"
  },

  predictiveViability: {
    title: "Predictive Viability Check (Pre-Modeling Feasibility)",
    img: "assets/images/project-predictive-viability.png",
    desc: "A pre-modeling analytics framework to evaluate whether a dataset is suitable, safe, and stable enough for machine learning before any model is built.",
    tech: "Python, Pandas, NumPy, Matplotlib, Scikit-learn",
    approach: `
      \u2022 Performed data quality assessment (missingness, duplicates, outliers)
      \u2022 Checked target and temporal leakage risks prior to modeling
      \u2022 Evaluated feature stability and distribution drift indicators
      \u2022 Assessed signal strength and predictive feasibility before ML investment
      \u2022 Designed a structured go / no-go decision framework
      This approach mirrors industry best practices used to prevent wasted modeling effort and governance risk.
    `,
    result: "Enabled early identification of data risks, leakage issues, and low-signal datasets - helping avoid unreliable models and ensuring only viable datasets proceed to ML development.",
    tags: ["Python", "EDA", "Data Quality", "Leakage", "Drift", "Governance"],
    github: "https://github.com/Pratyusha108/predictive-viability-check"
  },

  mortgageAnalytics: {
    title: "Mortgage Payback Analytics",
    img: "assets/images/project-mortgage-analytics.webp",
    desc: "Predictive analytics on U.S. residential mortgage performance to identify payoff likelihood and portfolio risk drivers.",
    tech: "Python, Logistic Regression, Decision Trees, Random Forest, PCA, Pandas",
    approach: `
      \u2022 Used panel loan data (~622k loan-month records) across 60 months
      \u2022 Cleaned borrower, loan term, and macroeconomic factors
      \u2022 Engineered loan age, maturity, and balance dynamics
      \u2022 Modeled payoff events using supervised learning (logistic + RF)
      \u2022 Applied PCA + clustering for behavioral borrower segmentation
      \u2022 Interpreted payoff drivers in a financial context (LTV, unemployment, HPI)
      Workflow mirrors institutional finance analytics for liquidity and portfolio lifecycle modeling.
    `,
    result: "Lower LTV and rising housing prices significantly increase payoff likelihood; payoff rates peak mid-loan lifecycle, matching observed mortgage economics.",
    tags: ["Finance", "Python", "Random Forest", "PCA", "Clustering"],
    github: "https://github.com/Pratyusha108/Mortage_payback_Analytics"
  },

  mailingAnalytics: {
    title: "Software Mailing List Response Analytics",
    img: "assets/images/project-mailing-analytics.png",
    desc: "Direct marketing response modeling + customer targeting optimization using supervised & unsupervised learning.",
    tech: "R, Logistic Regression, K-Means, PCA, ROC/AUC, Gains/Lift",
    approach: `
      \u2022 Cleaned and validated consortium mailing data
      \u2022 Engineered behavioral & source features influencing response
      \u2022 Modeled purchase response using Logistic Regression, Trees, KNN
      \u2022 Ranked customers into deciles for mailing prioritization
      \u2022 Clustered customers (K-Means) into execution tiers (A/B/C)
      \u2022 Validated response lift, decile gains, and ROC-AUC for ranking quality
      Designed to reflect real marketing science workflows for scalable direct-mail targeting.
    `,
    result: "Logistic Regression produced best decile lift and interpretability. High-value deciles showed strong concentration of responders, supporting profit-first mailing strategy.",
    tags: ["Marketing", "R", "Logistic Regression", "Clustering", "PCA"],
    github: "https://github.com/Pratyusha108/software-mailing-list-response-analytics"
  },

  smartphonePricing: {
    title: "Smartphone Resale Price Prediction",
    img: "assets/images/project-smartphone-pricing.png",
    desc: "Regression + classification system for consistent used-device pricing and operational tiering.",
    tech: "R, Multiple Linear Regression, kNN, Random Forest, Logistic Regression, C5.0",
    approach: `
      \u2022 Analyzed 3,400+ device records with specs + usage history
      \u2022 Modeled normalized_used_price via MLR, kNN, and RF
      \u2022 Classified devices into High/Low pricing tiers for quoting
      \u2022 Standardized numeric predictors and engineered categorical dummies
      \u2022 Evaluated regression via RMSE & R\u00B2, classification via accuracy & confusion matrix
      \u2022 Produced business-aligned outputs for pricing and tiering decisions
      Mimics real resale pricing workflows balancing accuracy + interpretability.
    `,
    result: "Multiple Linear Regression achieved R\u00B2 \u2248 0.78 with stable validation/test performance; Logistic Regression achieved \u224886% accuracy for High/Low pricing tiers.",
    tags: ["R", "Regression", "Classification", "ML", "Pricing"],
    github: "https://github.com/Pratyusha108/smartphone-resale-price-prediction"
  },

  nexus: {
    title: "NEXUS - Local AI Research Agent",
    img: "assets/images/project-nexus.png",
    desc: "Commercial-grade AI research agent that runs entirely on local hardware. 35+ commands, 8 expert personas, a 7-phase research pipeline, and persistent knowledge base - all with zero API costs and full data privacy.",
    tech: "Python, Ollama, SearXNG, ChromaDB, Docker, Click, Rich, Jinja2, MCP/A2A Protocols",
    approach: `
      \u2022 Designed a 7-phase research pipeline: reasoning, decomposition, multi-source search, cross-validation, synthesis, formatting, and adversarial self-critique
      \u2022 Built an intelligent multi-model router that selects optimal LLM size per task type (7B for quick lookups, 70B+ for deep analysis)
      \u2022 Implemented source reliability scoring on a 1-10 scale across 6 weighted factors, plus contradiction detection and logical fallacy identification
      \u2022 Created 8 expert personas (Scientist, Financial Analyst, Data Scientist, Legal Researcher, etc.) with domain-specific research behavior
      \u2022 Integrated persistent knowledge base with ChromaDB for cross-session memory, staleness detection, and semantic deduplication
      \u2022 Added plugin system with auto-discovery, MCP protocol support for Obsidian/Notion/databases, and A2A agent-to-agent delegation
      The architecture mirrors enterprise research platforms while maintaining complete local execution and zero telemetry.
    `,
    result: "Delivers research quality comparable to commercial tools like Perplexity Pro and Google Deep Research, with 4 adaptive depth levels, hypothesis testing, probabilistic forecasting, and full audit trails - entirely self-hosted.",
    tags: ["Python", "AI", "LLM", "Docker", "ChromaDB", "RAG"],
    github: "https://github.com/Pratyusha108/nexus"
  },

  rag0: {
    title: "rag0 - In-Browser RAG Search Engine",
    img: "assets/images/project-rag0.png",
    desc: "A complete retrieval-augmented generation pipeline running entirely in the browser. Zero API keys, zero servers - embedding, vector search, and text generation all happen client-side.",
    tech: "JavaScript, Transformers.js, ONNX Runtime, WebGPU, all-MiniLM-L6-v2, SmolLM2-135M, Cosine Similarity",
    approach: `
      \u2022 Implemented client-side text embedding using all-MiniLM-L6-v2 via Transformers.js ONNX runtime (~50ms per query after warmup)
      \u2022 Built an in-memory vector store with cosine similarity search and sessionStorage caching for knowledge base embeddings
      \u2022 Integrated SmolLM2-135M for WebGPU-accelerated text generation conditioned on retrieved context
      \u2022 Designed graceful degradation: WebGPU browsers get full LLM-generated answers, others receive template-based retrieval results
      \u2022 Created a configurable pipeline with adjustable top-K retrieval count and similarity thresholds (default 0.25)
      \u2022 Zero external dependencies - the entire stack runs in a single browser tab with vanilla JavaScript, no frameworks
      This project proves that the full RAG pipeline (embed, retrieve, generate) is viable entirely client-side without any cloud infrastructure.
    `,
    result: "Successfully demonstrated end-to-end RAG in the browser with sub-50ms embedding, sub-millisecond vector retrieval, and coherent LLM generation - proving that meaningful AI-powered search is possible without servers or API keys.",
    tags: ["JavaScript", "RAG", "AI", "WebGPU", "NLP", "Transformers.js"],
    github: "https://github.com/Pratyusha108/rag0"
  },

  ninjaWarrior: {
    title: "American Ninja Warrior - Power BI Analytics Dashboard",
    img: "assets/images/project-ninja-warrior.png",
    desc: "Interactive multi-page Power BI dashboard analyzing obstacle design patterns, competition structure, and geographical distribution across 10 seasons of American Ninja Warrior.",
    tech: "Power BI Desktop, DAX Measures, Data Modeling, Bing Maps, KPI Cards, Interactive Drill-Downs",
    approach: `
      \u2022 Built 4 interconnected dashboard pages: Location Analysis, Obstacle Count by Season, Distribution by Round, and Popularity & Frequency
      \u2022 Designed DAX measures for dynamic KPI calculation and cross-filtering across competition stages and seasons
      \u2022 Mapped geographical distribution using Bing Maps integration, revealing Las Vegas as the dominant National Finals host
      \u2022 Identified structural patterns in obstacle staging: Stage 1 (~9 obstacles), Stage 2 (~6), Stage 3 (~8), Stage 4 (final climb only)
      \u2022 Tracked obstacle reuse trends showing Warped Wall as the most consistently used obstacle across all seasons
      \u2022 Implemented drill-down filtering and interactive slicers for season, round, and location dimensions
      Demonstrates practical BI skills: turning raw competition data into structured analytical insights through data modeling and visual storytelling.
    `,
    result: "Revealed that obstacle count spiked significantly from Season 3 to 4, semi-finals existed only in early seasons, and experimental obstacles increased from Season 5 onward - actionable insights mapping competition evolution.",
    tags: ["Power BI", "DAX", "Data Visualization", "Analytics"],
    github: "https://github.com/Pratyusha108/american-ninja-warrior-powerbi-dashboard"
  },

  tableauDashboards: {
    title: "Data Visualization with Tableau",
    img: "assets/images/project-tableau.png",
    desc: "Portfolio of interactive Tableau dashboards designed for business insight, trend analysis, and executive-level decision support across sales and performance domains.",
    tech: "Tableau Desktop, Calculated Fields, Parameters, Actions, KPI Cards, Geographic Visualizations",
    approach: `
      \u2022 Built a World Bike Sales Dashboard with global sales performance, regional trends, and product category comparisons using geographic visualizations
      \u2022 Created a Sales Performance Dashboard analyzing growth/decline patterns, category-wise performance, and executive summary views
      \u2022 Applied time-based aggregations, calculated fields, and KPI cards for dynamic business metric monitoring
      \u2022 Optimized dashboard layouts for stakeholder readability and non-technical audience consumption
      \u2022 Designed interactive filters, parameters, and dashboard actions for drill-down exploration at regional and product levels
      \u2022 Emphasized business storytelling over raw data presentation, focusing on actionable insight delivery
      These dashboards reflect real-world business reporting scenarios, demonstrating executive-ready communication and visual analytics skills.
    `,
    result: "Delivered stakeholder-ready dashboards that transform complex sales datasets into clear visual narratives, enabling data-driven decisions through interactive trend analysis and KPI monitoring.",
    tags: ["Tableau", "Data Visualization", "Business Intelligence", "Analytics"],
    github: "https://github.com/Pratyusha108/data-visualization-tableau"
  },

  dockerApp: {
    title: "Multi-Container Docker Application",
    img: "assets/images/project-docker.png",
    desc: "Containerized full-stack Todo application with Node.js, Express, and MongoDB, orchestrated using Docker Compose. Implements both production deployment and development workflow configurations.",
    tech: "Docker, Docker Compose, Node.js 19, Express.js, MongoDB 6, Mongoose, EJS, Nodemon, LiveReload",
    approach: `
      \u2022 Architected two distinct deployment configurations: production (named volumes for persistence) and development (bind mounts with live reload via Nodemon)
      \u2022 Implemented Docker networking with internal DNS resolution between services - connection strings reference service names, no hardcoded IPs
      \u2022 Optimized Dockerfiles with cache mounts on npm ci, non-root user execution (USER node), and layer-ordered builds for maximum cache efficiency
      \u2022 Built full CRUD operations (create, list, delete) with Mongoose ODM and EJS server-side templating
      \u2022 Configured named volumes for persistent MongoDB storage independent of container lifecycle, with anonymous volumes preserving node_modules
      \u2022 Published container image to Docker Hub (pratyusha108/welcome-to-docker), completing the full build-ship workflow
      Gained hands-on experience debugging real container issues: port conflicts, compose context errors, and image pull vs. local build distinctions.
    `,
    result: "Successfully deployed a production-ready multi-service application demonstrating Docker Compose orchestration, persistent storage strategies, development workflows with live reload, and the complete build-to-Docker-Hub pipeline.",
    tags: ["Docker", "Node.js", "MongoDB", "DevOps", "Express.js"],
    github: "https://github.com/Pratyusha108/welcome-to-docker"
  }
};

/* OPEN MODAL */
function openModal(key) {
  const m = modalData[key];

  document.getElementById("modal-img").src = m.img;
  document.getElementById("modal-title").innerText = m.title;

  document.getElementById("modal-desc").innerHTML = '<h4>Overview:</h4>' + m.desc;
  document.getElementById("modal-tech").innerHTML = '<h4>Tech Stack:</h4>' + m.tech;
  document.getElementById("modal-approach").innerHTML = '<h4>Approach:</h4><p>' + m.approach + '</p>';
  document.getElementById("modal-result").innerHTML = '<h4>Results:</h4>' + m.result;

  const tagsDiv = document.getElementById("modal-tags");
  tagsDiv.innerHTML = "";
  m.tags.forEach(function (t) {
    tagsDiv.innerHTML += '<span>' + t + '</span>';
  });

  document.getElementById("modal-github").href = m.github;

  document.getElementById("modal").style.display = "flex";
}

/* CLOSE MODAL */
function closeModal() {
  document.getElementById("modal").style.display = "none";
}

/* CLOSE WHEN CLICKING BACKDROP */
function closeOnBack(e) {
  if (e.target.id === 'modal') closeModal();
}

/* AUTO-OPEN FROM URL PARAM + ALL FEATURES */
document.addEventListener('DOMContentLoaded', function () {
  // Auto-open modal from URL
  var params = new URLSearchParams(window.location.search);
  var openKey = params.get('open');
  if (openKey && modalData[openKey]) {
    openModal(openKey);
  }

  var filterBtns = document.querySelectorAll('.filter-btn');
  var projectCards = document.querySelectorAll('.project-showcase .project-card');
  var searchInput = document.querySelector('.project-search');
  var searchClear = document.querySelector('.search-clear');
  var noResults = document.querySelector('.no-results');
  var projectGrid = document.querySelector('.project-grid');
  var activeTechPill = null;

  // ====== UNIFIED FILTER FUNCTION ======
  function applyFilters() {
    var activeFilter = document.querySelector('.filter-btn.active');
    var category = activeFilter ? activeFilter.dataset.filter : 'all';
    var query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    var techFilter = activeTechPill ? activeTechPill.toLowerCase() : '';
    var visibleCount = 0;

    projectCards.forEach(function (card) {
      var matchesCategory = (category === 'all' || card.dataset.categories.indexOf(category) !== -1);

      var matchesSearch = true;
      if (query) {
        var title = card.querySelector('h3') ? card.querySelector('h3').textContent.toLowerCase() : '';
        var desc = card.querySelector('.project-content p') ? card.querySelector('.project-content p').textContent.toLowerCase() : '';
        var tags = card.querySelector('.project-tags') ? card.querySelector('.project-tags').textContent.toLowerCase() : '';
        matchesSearch = title.indexOf(query) !== -1 || desc.indexOf(query) !== -1 || tags.indexOf(query) !== -1;
      }

      var matchesTech = true;
      if (techFilter) {
        var cardTags = card.querySelector('.project-tags') ? card.querySelector('.project-tags').textContent.toLowerCase() : '';
        matchesTech = cardTags.indexOf(techFilter) !== -1;
      }

      if (matchesCategory && matchesSearch && matchesTech) {
        card.classList.remove('hidden');
        visibleCount++;
      } else {
        card.classList.add('hidden');
      }
    });

    if (noResults) {
      if (visibleCount === 0) {
        noResults.classList.add('visible');
      } else {
        noResults.classList.remove('visible');
      }
    }

    triggerStaggerEntrance();
  }

  // ====== FILTER TABS ======
  if (filterBtns.length > 0) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        applyFilters();
      });
    });
  }

  // ====== SEARCH BAR ======
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      if (searchClear) {
        searchClear.classList.toggle('visible', searchInput.value.length > 0);
      }
      applyFilters();
    });
  }

  if (searchClear) {
    searchClear.addEventListener('click', function () {
      searchInput.value = '';
      searchClear.classList.remove('visible');
      applyFilters();
      searchInput.focus();
    });
  }

  // ====== STAGGERED CARD ENTRANCE ======
  function triggerStaggerEntrance() {
    var visibleCards = [];
    projectCards.forEach(function (card) {
      if (!card.classList.contains('hidden')) {
        visibleCards.push(card);
      }
    });

    visibleCards.forEach(function (card) {
      card.classList.remove('card-visible');
      card.style.animationDelay = '';
    });

    // Force reflow
    if (projectGrid) projectGrid.offsetHeight;

    visibleCards.forEach(function (card, index) {
      card.style.animationDelay = (index * 0.12) + 's';
      card.classList.add('card-visible');
    });
  }

  // Initial entrance on page load
  var cardObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        triggerStaggerEntrance();
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  if (projectGrid) {
    cardObserver.observe(projectGrid);
  }

  // ====== VIEW TOGGLE (Grid / List) ======
  var viewBtns = document.querySelectorAll('.view-btn');
  var savedView = localStorage.getItem('projects_view') || 'grid';

  function setView(view) {
    if (projectGrid) {
      if (view === 'list') {
        projectGrid.classList.add('list-view');
      } else {
        projectGrid.classList.remove('list-view');
      }
    }
    viewBtns.forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.view === view);
    });
    localStorage.setItem('projects_view', view);
    triggerStaggerEntrance();
  }

  // Restore saved view
  setView(savedView);

  viewBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      setView(btn.dataset.view);
    });
  });

  // ====== STATS COUNTER ANIMATION ======
  var statNumbers = document.querySelectorAll('.project-stat-number');
  if (statNumbers.length > 0) {
    var statsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          if (el.dataset.counted) return;
          el.dataset.counted = 'true';

          var target = parseInt(el.getAttribute('data-target')) || 0;
          var duration = 1500;
          var start = performance.now();

          function animateStat(now) {
            var elapsed = now - start;
            var progress = Math.min(elapsed / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) {
              requestAnimationFrame(animateStat);
            } else {
              el.textContent = target;
            }
          }
          requestAnimationFrame(animateStat);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(function (el) { statsObserver.observe(el); });
  }

  // ====== TECH STACK PILLS ======
  var pillsWrap = document.querySelector('.tech-pills-wrap');
  if (pillsWrap) {
    var allTags = {};
    projectCards.forEach(function (card) {
      var tagSpans = card.querySelectorAll('.project-tags span');
      tagSpans.forEach(function (span) {
        var tag = span.textContent.trim();
        allTags[tag] = true;
      });
    });

    var tagList = Object.keys(allTags).sort();
    tagList.forEach(function (tag, i) {
      var pill = document.createElement('span');
      pill.className = 'tech-pill';
      pill.textContent = tag;
      pill.style.setProperty('--i', i);
      pill.addEventListener('click', function () {
        if (pill.classList.contains('active')) {
          pill.classList.remove('active');
          activeTechPill = null;
        } else {
          document.querySelectorAll('.tech-pill.active').forEach(function (p) {
            p.classList.remove('active');
          });
          pill.classList.add('active');
          activeTechPill = tag;
        }
        applyFilters();
      });
      pillsWrap.appendChild(pill);
    });
  }

  // ====== AUTO-SCROLL TO PORTFOLIO HEADING ======
  if (!params.get('open')) {
    var showcase = document.querySelector('.project-showcase');
    if (showcase) {
      setTimeout(function () {
        showcase.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 700);
    }
  }

  // ====== 3D TILT EFFECT ON PROJECT CARDS ======
  if (projectGrid && !('ontouchstart' in window)) {
    projectGrid.addEventListener('mousemove', function (e) {
      var card = e.target.closest('.project-card');
      if (!card) return;
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -8;
      var rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 8;
      card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-5px)';
      card.style.setProperty('--glow-x', x + 'px');
      card.style.setProperty('--glow-y', y + 'px');
    });
    projectGrid.addEventListener('mouseleave', function () {
      projectGrid.querySelectorAll('.project-card').forEach(function (card) {
        card.style.transform = '';
      });
    });
  }
});
