(function () {
  // ====== CHATBOT SOUND ======
  var chatSoundEnabled = localStorage.getItem('chatbot_sound') !== '0';
  var audioCtx = null;
  var tickCounter = 0;

  function playTickSound() {
    if (!chatSoundEnabled) return;
    // Only play every 4th character for a subtle, non-overwhelming feel
    tickCounter++;
    if (tickCounter % 7 !== 0) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      var now = audioCtx.currentTime;
      var dur = 0.018 + Math.random() * 0.01;

      // Soft click using quiet noise burst
      var bufSize = Math.floor(audioCtx.sampleRate * dur);
      var buf = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
      var data = buf.getChannelData(0);
      for (var i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1);

      var noise = audioCtx.createBufferSource();
      noise.buffer = buf;

      var filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 3000 + Math.random() * 1500;
      filter.Q.value = 1.2;

      var gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.025 + Math.random() * 0.01, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start(now);
      noise.stop(now + dur);
    } catch (e) {}
  }

  // ====== LEVENSHTEIN DISTANCE (Fuzzy Matching) ======
  function levenshtein(a, b) {
    var m = a.length, n = b.length;
    if (m === 0) return n;
    if (n === 0) return m;
    var d = [];
    for (var i = 0; i <= m; i++) { d[i] = [i]; }
    for (var j = 0; j <= n; j++) { d[0][j] = j; }
    for (i = 1; i <= m; i++) {
      for (j = 1; j <= n; j++) {
        var cost = a[i - 1] === b[j - 1] ? 0 : 1;
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      }
    }
    return d[m][n];
  }

  function fuzzyMatch(word, keyword) {
    // Exact match always works
    if (word === keyword) return true;
    // Short words/keywords (3 chars or less): exact match ONLY
    // This prevents false positives like "her" matching "hey", "his" matching "hi"
    if (word.length <= 3 || keyword.length <= 3) return false;
    // Substring match: only allow if the matched word length is at least 50% of the keyword length
    if (keyword.indexOf(word) !== -1 && word.length >= keyword.length * 0.5) return true;
    if (word.indexOf(keyword) !== -1 && keyword.length >= word.length * 0.5) return true;
    // Fuzzy match via Levenshtein for typo handling (4+ char words only)
    var maxDist = word.length <= 4 ? 1 : 2;
    return levenshtein(word, keyword) <= maxDist;
  }

  // ====== SYNONYM EXPANSION ======
  var synonyms = {
    'hire': ['recruit', 'employ', 'hiring', 'recruitment'],
    'skills': ['abilities', 'expertise', 'competencies', 'proficiency'],
    'experience': ['background', 'career'],
    'education': ['degree', 'university', 'college', 'academic'],
    'projects': ['portfolio', 'built', 'created', 'developed'],
    'contact': ['reach', 'connect'],
    'resume': ['cv', 'download'],
    'location': ['city', 'based'],
    'available': ['seeking', 'freelance'],
    'certifications': ['certified', 'certificate', 'credential'],
    'leadership': ['manage', 'soft skills'],
    'blog': ['article', 'writing']
  };

  function expandWithSynonyms(input) {
    var words = input.toLowerCase().split(/\s+/);
    var expanded = words.slice();
    for (var key in synonyms) {
      if (!synonyms.hasOwnProperty(key)) continue;
      var syns = synonyms[key];
      for (var i = 0; i < words.length; i++) {
        if (words[i].length < 3) continue; // Skip short words for synonym expansion
        for (var j = 0; j < syns.length; j++) {
          if (fuzzyMatch(words[i], syns[j])) {
            if (expanded.indexOf(key) === -1) expanded.push(key);
          }
        }
      }
    }
    return expanded;
  }

  // ====== JOKE POOL ======
  var jokes = [
    '<em>Why did the data scientist break up with the statistician?</em><br><strong>Because they found someone with more <em>significant</em> features!</strong>',
    '<em>Why do data scientists make great gardeners?</em><br><strong>Because they know how to handle decision trees!</strong>',
    '<em>What\'s a data scientist\'s favorite movie?</em><br><strong>The Matrix... of confusion!</strong>',
    '<em>Why was the neural network so good at its job?</em><br><strong>It had deep connections!</strong>',
    '<em>How does a data scientist stay cool?</em><br><strong>They use more fans in their random forest!</strong>',
    '<em>What did the data say to the model?</em><br><strong>"You\'re overfit for this relationship!"</strong>'
  ];
  var jokeIndex = 0;

  function getNextJoke() {
    var joke = jokes[jokeIndex % jokes.length];
    jokeIndex++;
    return joke;
  }

  // ====== MAGIC 8-BALL POOL ======
  var magic8Responses = [
    '<strong>The Magic 8-Ball says:</strong> "Without a doubt - you should hire Pratyusha!"',
    '<strong>The Magic 8-Ball says:</strong> "All signs point to checking out her Projects page!"',
    '<strong>The Magic 8-Ball says:</strong> "Outlook very positive - especially if you reach out!"',
    '<strong>The Magic 8-Ball says:</strong> "My sources say... you\'ll be impressed by her portfolio."',
    '<strong>The Magic 8-Ball says:</strong> "Concentrate and ask again... or just read her blog!"'
  ];

  // ====== KNOWLEDGE BASE ======
  // NOTE: No em-dashes anywhere. Use " - " instead.
  var knowledge = [
    // === CONVERSATIONAL / GREETINGS (priority entries) ===
    {
      keywords: ['hello', 'hi', 'hey', 'greetings', 'sup', 'yo', 'howdy'],
      priority: 100,
      answer: 'Hey there! Nice to meet you! I\'m doing great, thanks for stopping by.<br><br>' +
        'I\'m Pratyusha\'s AI Assistant, and I\'m here to help! You can ask me about:<br>' +
        '&#8226; Her work experience and career path<br>' +
        '&#8226; Technical skills and tools<br>' +
        '&#8226; Projects and achievements<br>' +
        '&#8226; Education and certifications<br>' +
        '&#8226; Blog posts and insights<br><br>' +
        'What would you like to know?',
      suggestions: ['Tell me about her experience', 'What are her skills?', 'Tell me a joke']
    },
    {
      keywords: ['good morning'],
      priority: 100,
      answer: 'Good morning! Hope you\'re having a great start to your day.<br><br>' +
        'I\'m Pratyusha\'s AI Assistant. How can I help you today?',
      suggestions: ['Tell me about Pratyusha', 'What are her skills?', 'Is she available?']
    },
    {
      keywords: ['good evening', 'good afternoon', 'good night'],
      priority: 100,
      answer: 'Hello! Great to see you here.<br><br>' +
        'I\'m Pratyusha\'s AI Assistant. What can I help you with?',
      suggestions: ['Tell me about Pratyusha', 'What are her skills?', 'View projects']
    },
    {
      keywords: ['how are you', 'how r u', 'how you doing', 'whats up', 'what\'s up', 'wassup', 'hows it going'],
      priority: 100,
      answer: 'I\'m doing awesome, thanks for asking!<br><br>' +
        'I\'m always ready to chat about Pratyusha\'s work. What would you like to know?',
      suggestions: ['Who is Pratyusha?', 'Tell me about her skills', 'Tell me a joke']
    },
    {
      keywords: ['bye', 'goodbye', 'see you', 'later', 'gotta go', 'take care'],
      priority: 100,
      answer: 'Goodbye! It was great chatting with you.<br><br>' +
        'Feel free to come back anytime. And don\'t forget to check out the <a href="contact.html">Contact page</a> if you\'d like to connect with Pratyusha!',
      suggestions: ['Contact her', 'Download resume', 'View projects']
    },
    {
      keywords: ['thank', 'thanks', 'thx', 'ty', 'appreciate'],
      priority: 90,
      answer: 'You\'re welcome! Happy to help.<br><br>' +
        'Feel free to ask anything else, or explore:<br>' +
        '&#8226; <a href="projects.html">Projects</a> - Full portfolio<br>' +
        '&#8226; <a href="blog.html">Blog</a> - Insights and articles<br>' +
        '&#8226; <a href="contact.html">Contact</a> - Get in touch',
      suggestions: ['View projects', 'Read the blog', 'Download resume']
    },
    {
      keywords: ['awesome', 'great', 'cool', 'nice', 'impressive', 'amazing', 'wow', 'wonderful'],
      priority: 80,
      answer: 'Glad you think so! Pratyusha puts a lot of effort into her work.<br><br>' +
        'Want to dive deeper into anything specific?',
      suggestions: ['Her best project?', 'Why hire her?', 'View the blog']
    },
    {
      keywords: ['help', 'what can you do', 'options', 'menu'],
      priority: 80,
      answer: 'I can help you with:<br><br>' +
        '&#8226; <strong>Experience</strong> - Work history and roles<br>' +
        '&#8226; <strong>Skills</strong> - Technical proficiencies<br>' +
        '&#8226; <strong>Projects</strong> - Portfolio highlights<br>' +
        '&#8226; <strong>Education</strong> - Degrees and certifications<br>' +
        '&#8226; <strong>Blog</strong> - Articles and insights<br>' +
        '&#8226; <strong>Contact</strong> - How to reach Pratyusha<br>' +
        '&#8226; <strong>Why hire her?</strong> - The full pitch<br><br>' +
        'Just type naturally!',
      suggestions: ['Tell me about her experience', 'What are her skills?', 'Why hire her?']
    },

    // === PROFESSIONAL KNOWLEDGE (no priority) ===
    {
      keywords: ['experience', 'work history', 'job', 'career', 'background', 'role', 'position', 'professional', 'worked', 'working', 'company', 'internship', 'intern', 'research assistant', 'analyst'],
      answer: '<strong>Professional Experience (2+ years)</strong><br><br>' +
        '<strong>1. Graduate Research Assistant</strong> - Osmania University<br>' +
        '<em>Jan 2022 - Dec 2022</em><br>' +
        '&#8226; Applied research in <strong>cybersecurity and data analytics</strong><br>' +
        '&#8226; Statistical modeling, stakeholder reporting, data quality checks<br>' +
        '&#8226; Produced executive summaries for risk assessment<br><br>' +
        '<strong>2. Data Analyst</strong> - Independent Engagements<br>' +
        '<em>Jan 2021 - Feb 2022</em><br>' +
        '&#8226; Built <strong>Power BI dashboards</strong> for revenue, segmentation, KPIs<br>' +
        '&#8226; SQL analytics, data validation, actionable business insights<br><br>' +
        '<strong>3. Data Analyst Intern (IoT)</strong> - IBM Collaboration<br>' +
        '<em>May - Jun 2019</em><br>' +
        '&#8226; RFID smart access-control system in C/C++<br>' +
        '&#8226; Anomaly detection, root-cause analysis, event logging',
      suggestions: ['What are her skills?', 'Tell me about her projects', 'Why should I hire her?']
    },
    {
      keywords: ['education', 'degree', 'university', 'study', 'school', 'college', 'masters', 'mba', 'btech', 'academic', 'electrical', 'engineering', 'webster', 'eee', 'undergrad', 'undergraduate', 'bachelors', 'bachelor', 'graduated', 'graduation', 'coursework', 'osmania', 'b.tech', 'm.s.', 'studied'],
      answer: '<strong>Education</strong><br><br>' +
        '<strong>M.S. in Data Analytics</strong> - Webster University, St. Louis<br>' +
        '<em>Aug 2023 - May 2026</em><br>' +
        'Coursework: ML, Time Series, Data Visualization, Databases<br><br>' +
        '<strong>MBA in Technology Management</strong> - Osmania University<br>' +
        '<em>2020 - 2022</em><br>' +
        'Coursework: Business Analytics, RDBMS, Information Systems<br><br>' +
        '<strong>B.Tech in Electrical and Electronics Engineering</strong> - Osmania University<br>' +
        '<em>2016 - 2020</em><br>' +
        'Strong analytical foundation in engineering, signal processing, and quantitative reasoning.',
      suggestions: ['What are her certifications?', 'Tell me about her experience', 'Where is she located?']
    },
    {
      keywords: ['skill', 'tools', 'technology', 'tech', 'programming', 'language', 'stack', 'abilities', 'expertise', 'proficiency', 'proficient', 'capable', 'strengths', 'knows', 'technologies'],
      answer: '<strong>Technical Skills</strong><br><br>' +
        '<strong>Languages:</strong> Python (92%), R (85%), SQL (90%), Java, C/C++<br>' +
        '<strong>ML/DL:</strong> Scikit-learn, TensorFlow, PyTorch, XGBoost<br>' +
        '<strong>BI and Viz:</strong> Power BI (DAX, Power Query), Tableau, Excel<br>' +
        '<strong>Cloud:</strong> Azure ML, Databricks, Apache Spark<br>' +
        '<strong>NLP:</strong> BERT, RoBERTa, Transformers, LLMs<br>' +
        '<strong>Databases:</strong> MySQL, PostgreSQL, Azure SQL<br>' +
        '<strong>MLOps:</strong> Git, REST APIs, CI/CD, Airflow, Docker',
      suggestions: ['Tell me about her ML expertise', 'What about cloud skills?', 'Python details']
    },
    {
      keywords: ['project', 'portfolio', 'built', 'made', 'created', 'developed', 'work samples', 'showcase', 'demo', 'github projects'],
      answer: '<strong>Key Projects</strong><br><br>' +
        '&#8226; <strong>LLM-Assisted Data Exploration</strong> - Feasibility assessment with AI<br>' +
        '&#8226; <strong>Direct Mail Response Modeling</strong> - AUC <strong>0.902</strong>, PCA + domain features<br>' +
        '&#8226; <strong>DJIA Time-Series Forecasting</strong> - ETS, TBATS, STL decomposition<br>' +
        '&#8226; <strong>COVID-19 Mortality Prediction</strong> - End-to-end ML pipeline<br>' +
        '&#8226; <strong>Smartphone Resale Pricing</strong> - Regression + classification<br>' +
        '&#8226; <strong>Power BI Ninja Warriors Dashboard</strong> - 10 seasons analyzed<br>' +
        '&#8226; <strong>Predictive Viability Check</strong> - Pre-modeling feasibility framework<br><br>' +
        'Visit the <a href="projects.html">Projects page</a> for full details!',
      suggestions: ['Tell me about her ML skills', 'What is her best project?', 'How can I contact her?']
    },
    {
      keywords: ['certif', 'dp-100', 'certified', 'certificate', 'credential'],
      answer: '<strong>Professional Certifications</strong><br><br>' +
        '&#8226; <strong>Microsoft Certified: Azure Data Scientist Associate (DP-100)</strong> - Jan 2026<br>' +
        '&#8226; <strong>Python for Data Science and ML Bootcamp</strong> - Udemy, Oct 2024<br>' +
        '&#8226; <strong>Research Skills: Statistical Tests</strong> - HCDC, Jun 2023<br>' +
        '&#8226; <strong>Java Full Stack Development</strong> - Sathya Technologies, May 2023<br>' +
        '&#8226; <strong>Embedded Systems Development</strong> - Smart Bridge (IBM), Jun 2019',
      suggestions: ['Tell me about Azure experience', 'What are her skills?', 'Education details']
    },
    {
      keywords: ['contact', 'email', 'reach', 'connect', 'phone', 'call', 'message', 'talk to', 'get in touch', 'linkedin profile'],
      answer: '<strong>Get in Touch</strong><br><br>' +
        '<strong>Email:</strong> sgorapalli@webster.edu<br>' +
        '<strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/pratyusha-g-a92915229/" target="_blank">pratyusha-g</a><br>' +
        '<strong>GitHub:</strong> <a href="https://github.com/Pratyusha108" target="_blank">Pratyusha108</a><br>' +
        '<strong>Kaggle:</strong> <a href="https://www.kaggle.com/saipgorapalli" target="_blank">saipgorapalli</a><br><br>' +
        'Or visit the <a href="contact.html">Contact page</a> to send a message!',
      suggestions: ['Is she available for hire?', 'Where is she located?', 'Download resume']
    },
    {
      keywords: ['resume', 'cv', 'download'],
      answer: '<strong>Resume</strong><br><br>' +
        'You can download Pratyusha\'s full resume from the <strong>Resume</strong> link in the navigation bar.<br><br>' +
        'It includes:<br>' +
        '&#8226; Professional experience and internships<br>' +
        '&#8226; Technical skills and proficiencies<br>' +
        '&#8226; Projects with metrics<br>' +
        '&#8226; Education and certifications<br>' +
        '&#8226; Research publications',
      suggestions: ['Tell me about her experience', 'What are her skills?', 'How to contact her?']
    },
    {
      keywords: ['research', 'paper', 'publication', 'publish', 'whitepaper'],
      answer: '<strong>Research and Publications</strong><br><br>' +
        '<strong>"Exploring Future Trends in Data Analytics"</strong><br>' +
        '<em>From Traditional Analysis to Intelligent Decision Systems</em><br>' +
        'Published: Jan 2026<br><br>' +
        'Covers the evolution from descriptive/predictive analytics to <strong>AI-driven decision systems</strong>, including ML, automation, governance, and enterprise analytics.',
      suggestions: ['Tell me about her projects', 'What are her AI skills?', 'Education details']
    },
    {
      keywords: ['python', 'pandas', 'numpy', 'scikit', 'matplotlib'],
      answer: '<strong>Python Expertise (92% proficiency)</strong><br><br>' +
        'Python is Pratyusha\'s strongest language. She works with:<br><br>' +
        '&#8226; <strong>Data:</strong> Pandas, NumPy, SciPy<br>' +
        '&#8226; <strong>ML:</strong> Scikit-learn, XGBoost, LightGBM<br>' +
        '&#8226; <strong>DL:</strong> TensorFlow, PyTorch, Keras<br>' +
        '&#8226; <strong>Viz:</strong> Matplotlib, Seaborn, Plotly<br>' +
        '&#8226; <strong>NLP:</strong> Transformers, NLTK, SpaCy<br>' +
        '&#8226; <strong>Dev:</strong> Jupyter, VS Code, Git<br><br>' +
        'Used across <strong>50+ projects</strong> for ML pipelines, EDA, feature engineering, and data cleaning.',
      suggestions: ['SQL skills?', 'Machine Learning details', 'Tell me about her projects']
    },
    {
      keywords: ['sql', 'database', 'query', 'mysql', 'postgres'],
      answer: '<strong>SQL Expertise (90% proficiency)</strong><br><br>' +
        '<strong>Databases:</strong> MySQL, PostgreSQL, Azure SQL, MS SQL Server<br><br>' +
        '&#8226; Complex queries with CTEs, window functions, subqueries<br>' +
        '&#8226; Multi-table JOINs and data aggregation<br>' +
        '&#8226; ETL pipeline design and optimization<br>' +
        '&#8226; Analytics-ready table design and indexing<br>' +
        '&#8226; KPI tracking queries and data validation',
      suggestions: ['Python skills?', 'Power BI experience?', 'Tell me about cloud skills']
    },
    {
      keywords: ['power bi', 'tableau', 'dashboard', 'bi', 'visualization'],
      answer: '<strong>Data Visualization (88% proficiency)</strong><br><br>' +
        '<strong>Power BI:</strong> DAX measures, Power Query, star-schema modeling, drill-through pages<br>' +
        '<strong>Tableau:</strong> Interactive dashboards for KPI monitoring and trend analysis<br>' +
        '<strong>Excel:</strong> Pivot tables, VLOOKUP, conditional formatting, advanced charts<br><br>' +
        'Built dashboards for revenue performance, customer segmentation, forecasting, and operations.',
      suggestions: ['See her projects', 'SQL expertise?', 'Cloud and MLOps?']
    },
    {
      keywords: ['machine learning', 'ml', 'model', 'predict', 'classification', 'regression'],
      answer: '<strong>Machine Learning Expertise (90% proficiency)</strong><br><br>' +
        '<strong>Techniques:</strong> Logistic Regression, Random Forest, SVM, Decision Trees, kNN, k-Means, PCA, Ensemble Methods, Time Series (ETS, TBATS, ARIMA)<br><br>' +
        '<strong>Evaluation:</strong> ROC-AUC, Lift/Deciles, Precision/Recall, F1-Score<br><br>' +
        '<strong>Best Result:</strong> AUC of <strong>0.902</strong> on direct mail response modeling - achieved through careful feature engineering.',
      suggestions: ['Deep Learning skills?', 'Best project results?', 'Python details']
    },
    {
      keywords: ['deep learning', 'neural', 'cnn', 'rnn', 'transformer', 'bert', 'nlp', 'llm', 'ai'],
      answer: '<strong>Deep Learning and NLP</strong><br><br>' +
        '<strong>Frameworks:</strong> PyTorch, TensorFlow, Transfer Learning<br>' +
        '<strong>NLP:</strong> BERT, RoBERTa, Transformers, Text Classification, Embeddings<br>' +
        '<strong>AI:</strong> LLM Evaluation, Prompt Engineering, Agentic AI Workflows, Generative AI<br>' +
        '<strong>Also:</strong> Information Retrieval, Ranking and Relevance, Recommendation Systems',
      suggestions: ['Cloud and MLOps?', 'Machine Learning details?', 'Tell me about her research']
    },
    {
      keywords: ['cloud', 'azure', 'databricks', 'spark', 'mlops', 'deploy', 'deployment'],
      answer: '<strong>Cloud and MLOps (80% proficiency)</strong><br><br>' +
        '<strong>Azure:</strong> Azure ML, Azure SQL, Blob Storage, Azure DevOps<br>' +
        '<strong>Big Data:</strong> Apache Spark, Databricks, Hadoop<br>' +
        '<strong>MLOps:</strong> CI/CD Pipelines, Model Monitoring, Drift Awareness<br>' +
        '<strong>Deployment:</strong> REST APIs, Batch Scoring, ADF, Airflow<br><br>' +
        'Microsoft Certified Azure Data Scientist Associate (DP-100).',
      suggestions: ['Certifications?', 'Python expertise?', 'Experience details']
    },
    {
      keywords: ['about', 'introduce', 'summary', 'overview', 'pratyusha', 'who is she', 'who is pratyusha', 'about pratyusha', 'tell me about', 'describe', 'profile', 'biography'],
      answer: '<strong>Sai Pratyusha Gorapalli</strong><br><br>' +
        'Data Science professional with <strong>2+ years</strong> of experience in analytics, dashboards, and decision-support reporting.<br><br>' +
        '&#8226; Currently pursuing <strong>M.S. in Data Analytics</strong> at Webster University<br>' +
        '&#8226; <strong>Microsoft Certified Azure Data Scientist (DP-100)</strong><br>' +
        '&#8226; Specializes in Python, SQL, Power BI, ML, and NLP<br>' +
        '&#8226; Experience across healthcare, finance, cybersecurity, and IoT<br>' +
        '&#8226; <strong>50+ projects</strong> spanning ML, forecasting, BI, and AI',
      suggestions: ['Experience details', 'Skills overview', 'View her projects']
    },
    {
      keywords: ['available', 'open to work', 'seeking', 'opportunity', 'openings', 'looking for', 'hiring', 'relocate', 'remote', 'hybrid', 'on-site', 'willing'],
      answer: '<strong>Yes! Actively Seeking Opportunities</strong><br><br>' +
        'Pratyusha is open to:<br>' +
        '&#8226; <strong>Data Science</strong> roles<br>' +
        '&#8226; <strong>Data Analyst</strong> positions<br>' +
        '&#8226; <strong>ML Engineering</strong> roles<br>' +
        '&#8226; <strong>Business Intelligence / Analytics</strong><br><br>' +
        'Based in <strong>St. Louis, MO</strong><br>' +
        'Open to <strong>remote, hybrid, and on-site</strong><br><br>' +
        'Email: <strong>sgorapalli@webster.edu</strong>',
      suggestions: ['Download resume', 'Why hire her?', 'Contact info']
    },
    {
      keywords: ['kaggle', 'competition', 'notebook'],
      answer: '<strong>Kaggle Profile</strong><br><br>' +
        'Active on Kaggle as an <strong>Analytics Contributor</strong> since Jun 2024.<br>' +
        'Conducts EDA, builds reproducible workflows, and creates clear visualizations.<br><br>' +
        'Profile: <a href="https://www.kaggle.com/saipgorapalli" target="_blank">kaggle.com/saipgorapalli</a>',
      suggestions: ['GitHub profile?', 'Projects?', 'Python skills?']
    },
    {
      keywords: ['location', 'where is she', 'city', 'state', 'based', 'lives', 'living', 'from where', 'st. louis', 'missouri'],
      answer: '<strong>Location</strong><br><br>' +
        'Based in <strong>St. Louis, Missouri, USA</strong><br><br>' +
        'Open to remote, hybrid, and on-site roles (willing to relocate).',
      suggestions: ['Is she available?', 'Contact info', 'Experience details']
    },
    {
      keywords: ['why hire', 'hire her', 'recruit', 'employ', 'why should', 'worth', 'stand out', 'unique', 'compare', 'special'],
      answer: '<strong>Why Hire Pratyusha?</strong><br><br>' +
        '<strong>Proven Technical Depth</strong><br>' +
        '&#8226; 92% Python proficiency, 90% SQL and ML, DP-100 certified<br>' +
        '&#8226; 50+ projects across ML, NLP, forecasting, and BI<br>' +
        '&#8226; Best AUC: <strong>0.902</strong> (direct mail response modeling)<br><br>' +
        '<strong>Rare Business + Tech Combination</strong><br>' +
        '&#8226; MBA in Technology Management + M.S. in Data Analytics<br>' +
        '&#8226; Translates complex models into executive-ready insights<br><br>' +
        '<strong>Multi-Domain Experience</strong><br>' +
        '&#8226; Healthcare, finance, cybersecurity, IoT, retail<br><br>' +
        '<em>"Her ability to learn rapidly, deliver high-quality work on time, and uplift peers made her one of the most standout individuals I have mentored."</em> - Dr. P. Venkataiah',
      suggestions: ['See her experience', 'View projects', 'Contact her']
    },
    {
      keywords: ['leadership', 'lead', 'team', 'soft skill', 'communication', 'interpersonal'],
      answer: '<strong>Leadership and Soft Skills</strong><br><br>' +
        '&#8226; <strong>Stakeholder Communication:</strong> Translates complex analytics into executive-ready insights<br>' +
        '&#8226; <strong>Cross-functional Collaboration:</strong> Works across technical and business teams<br>' +
        '&#8226; <strong>Project Management:</strong> Delivers high-quality work on tight deadlines<br>' +
        '&#8226; <strong>Mentorship:</strong> Recognized for uplifting peers and team members<br><br>' +
        '<em>"She approaches complex problems with clarity, discipline, and a rare balance of technical depth and managerial insight."</em> - Dr. Y. Jahangir',
      suggestions: ['Technical skills?', 'Experience details', 'Why hire her?']
    },
    {
      keywords: ['domain', 'industry', 'healthcare', 'finance', 'cybersecurity', 'iot', 'sector'],
      answer: '<strong>Domain Expertise</strong><br><br>' +
        '&#8226; <strong>Healthcare:</strong> COVID-19 mortality prediction, epidemiological modeling<br>' +
        '&#8226; <strong>Finance:</strong> Mortgage payback analytics, revenue forecasting<br>' +
        '&#8226; <strong>Cybersecurity:</strong> Graduate research in security analytics, risk assessment<br>' +
        '&#8226; <strong>IoT:</strong> RFID access-control systems, sensor data analysis<br>' +
        '&#8226; <strong>Retail/Marketing:</strong> Direct mail optimization, customer segmentation',
      suggestions: ['Projects in these domains?', 'Experience details', 'ML expertise']
    },
    {
      keywords: ['blog', 'article', 'post', 'writing', 'insight'],
      answer: '<strong>Blog and Insights</strong><br><br>' +
        'Pratyusha writes about ML, Data Science, AI, and career growth:<br><br>' +
        '&#8226; Why Feature Engineering Is Still the Most Underrated Skill in ML<br>' +
        '&#8226; From MBA to Data Science: My Non-Linear Career Path<br>' +
        '&#8226; The Real-World Gap: What Kaggle Teaches You (and What It Doesn\'t)<br>' +
        '&#8226; Why Every Data Scientist Should Understand Data Governance<br><br>' +
        'Visit the <a href="blog.html">Blog page</a> to read them!',
      suggestions: ['View projects', 'About Pratyusha', 'Contact her']
    },
    {
      keywords: ['github', 'repo', 'repository', 'open source', 'code'],
      answer: '<strong>GitHub Profile</strong><br><br>' +
        '15+ repositories covering ML, analytics, and data science.<br>' +
        '50+ commits with active development across 6 languages.<br><br>' +
        'Profile: <a href="https://github.com/Pratyusha108" target="_blank">github.com/Pratyusha108</a>',
      suggestions: ['View projects', 'Kaggle profile?', 'Technical skills']
    },

    // === EASTER EGGS (priority 90) ===
    {
      keywords: ['joke', 'funny', 'laugh', 'humor', 'another joke'],
      priority: 90,
      answer: '__JOKE__',
      suggestions: ['Tell me another joke', 'Who are you?', 'Magic 8 ball']
    },
    {
      keywords: ['magic 8 ball', '8 ball', 'magic ball', 'fortune', 'predict my future'],
      priority: 90,
      answer: '__MAGIC8__',
      suggestions: ['Tell me a joke', 'Who are you?', 'View projects']
    },
    {
      keywords: ['meaning of life', '42', 'universe'],
      priority: 90,
      answer: 'The meaning of life? <strong>42</strong>, obviously.<br><br>' +
        'But more practically? It\'s about turning raw data into meaningful insights that help people make better decisions.<br><br>' +
        '<em>At least, that\'s what Pratyusha\'s data models suggest with 95% confidence.</em>',
      suggestions: ['Tell me a joke', 'Magic 8 ball', 'About Pratyusha']
    },
    {
      keywords: ['who are you', 'what are you', 'your name', 'are you real', 'are you ai', 'bot'],
      priority: 90,
      answer: 'I\'m Pratyusha\'s AI Assistant!<br><br>' +
        'I was built to help visitors learn about Sai Pratyusha Gorapalli - her skills, experience, projects, and more.<br><br>' +
        'Feel free to ask about anything on her profile!',
      suggestions: ['Tell me a joke', 'Magic 8 ball', 'Meaning of life']
    },

    // === BASIC CHAT (priority 70) ===
    {
      keywords: ['2+2', 'math', 'calculate', 'plus', 'add', 'equals'],
      priority: 70,
      answer: 'I\'m more of a data science chatbot than a calculator, but 2+2 is definitely <strong>4</strong>!<br><br>' +
        'Ask me about Pratyusha\'s skills and I\'ll crunch some real numbers for you.',
      suggestions: ['What are her skills?', 'Tell me about her projects', 'Tell me a joke']
    },
    {
      keywords: ['weather', 'rain', 'sunny', 'cold', 'hot', 'temperature'],
      priority: 70,
      answer: 'I don\'t have a weather API, but I can tell you the forecast for Pratyusha\'s career is <strong>sunny with a high chance of success</strong>!<br><br>' +
        'Want to know about her skills or projects instead?',
      suggestions: ['What are her skills?', 'View projects', 'Tell me a joke']
    }
  ];

  var fallback = 'I\'m not sure about that one. Try asking about:<br><br>' +
    '&#8226; <strong>Experience</strong> - Work history and roles<br>' +
    '&#8226; <strong>Skills</strong> - Technical abilities<br>' +
    '&#8226; <strong>Projects</strong> - Portfolio highlights<br>' +
    '&#8226; <strong>Education</strong> - Degrees and certifications<br>' +
    '&#8226; <strong>Contact</strong> - How to reach her<br>' +
    '&#8226; <strong>Why hire her?</strong> - The full pitch';

  var fallbackSuggestions = ['Tell me about her experience', 'What are her skills?', 'Why should I hire her?'];

  // ====== CONVERSATION MEMORY ======
  // Only track professional topic keywords; never track greetings, easter eggs, or basic chat
  var discussedTopics = [];

  // Keys for entries that should NOT be tracked in conversation memory
  function isTrackableTopic(entry) {
    // If the entry has a priority field, it's conversational/easter-egg/basic-chat - don't track
    return !entry.priority;
  }

  // ====== MATCHING ENGINE ======
  function scoreEntry(entry, inputWords) {
    var score = 0;
    var kw = entry.keywords;

    for (var j = 0; j < kw.length; j++) {
      var kwParts = kw[j].split(' ');

      // Multi-word keyword: check if all parts appear in input
      if (kwParts.length > 1) {
        var allFound = true;
        for (var p = 0; p < kwParts.length; p++) {
          var partFound = false;
          for (var w = 0; w < inputWords.length; w++) {
            if (fuzzyMatch(inputWords[w], kwParts[p])) { partFound = true; break; }
          }
          if (!partFound) { allFound = false; break; }
        }
        if (allFound) score += kw[j].length * 2;
      } else {
        // Single-word keyword
        for (var w = 0; w < inputWords.length; w++) {
          if (fuzzyMatch(inputWords[w], kw[j])) {
            score += kw[j].length;
            break;
          }
        }
      }
    }

    // BUG FIX: Only add priority boost when at least one keyword actually matched (score > 0)
    if (entry.priority && score > 0) {
      score += entry.priority;
    }

    return score;
  }

  function findAnswer(input) {
    var expandedWords = expandWithSynonyms(input);
    var scores = [];

    for (var i = 0; i < knowledge.length; i++) {
      var s = scoreEntry(knowledge[i], expandedWords);
      if (s > 0) scores.push({ index: i, score: s });
    }

    scores.sort(function (a, b) { return b.score - a.score; });

    if (scores.length === 0) {
      return { answer: fallback, suggestions: fallbackSuggestions };
    }

    var best = scores[0];
    var entry = knowledge[best.index];
    var answer = entry.answer;
    var suggestions = entry.suggestions || fallbackSuggestions;

    // Handle dynamic answers
    if (answer === '__JOKE__') {
      answer = getNextJoke() + '<br><br>Want another one? Just ask! Or try <strong>"magic 8 ball"</strong> or <strong>"meaning of life"</strong>';
    } else if (answer === '__MAGIC8__') {
      answer = magic8Responses[Math.floor(Math.random() * magic8Responses.length)];
    }

    // Multi-topic fusion: combine answers when top 2 scores are within 30%
    // But NEVER fuse priority (conversational/easter-egg) entries
    if (scores.length >= 2 && !entry.priority) {
      var second = scores[1];
      var secondEntry = knowledge[second.index];
      if (!secondEntry.priority) {
        var ratio = second.score / best.score;
        if (ratio >= 0.7 && second.index !== best.index) {
          answer = answer + '<br><br>' + secondEntry.answer;
          var merged = (entry.suggestions || []).concat(secondEntry.suggestions || []);
          var unique = [];
          for (var u = 0; u < merged.length; u++) {
            if (unique.indexOf(merged[u]) === -1 && unique.length < 4) unique.push(merged[u]);
          }
          suggestions = unique.length > 0 ? unique : fallbackSuggestions;
        }
      }
    }

    // Conversation memory - only track professional topics, not greetings/easter-eggs/basic-chat
    var prefix = '';
    if (isTrackableTopic(entry)) {
      var topicKey = entry.keywords[0];
      if (discussedTopics.indexOf(topicKey) !== -1) {
        prefix = '<em>We covered this before, but here\'s a refresher:</em><br><br>';
      } else {
        discussedTopics.push(topicKey);
      }
    }

    return { answer: prefix + answer, suggestions: suggestions };
  }

  // ====== TYPEWRITER EFFECT (preserves HTML tags) ======
  function typewriterEffect(element, html, callback) {
    var i = 0;
    var speed = 8;
    var displayedHtml = '';
    var inTag = false;

    function step() {
      if (i >= html.length) {
        element.innerHTML = html;
        if (callback) callback();
        return;
      }

      var char = html[i];
      if (char === '<') inTag = true;
      if (inTag) {
        var tagEnd = html.indexOf('>', i);
        if (tagEnd !== -1) {
          displayedHtml += html.substring(i, tagEnd + 1);
          i = tagEnd + 1;
          inTag = false;
        } else {
          displayedHtml += char;
          i++;
        }
      } else {
        displayedHtml += char;
        i++;
        playTickSound();
      }

      element.innerHTML = displayedHtml;
      element.parentElement.scrollTop = element.parentElement.scrollHeight;

      var nextSpeed = speed;
      if (char === '.' || char === '!' || char === '?') nextSpeed = speed * 6;
      else if (char === ',') nextSpeed = speed * 3;
      else if (char === '\n') nextSpeed = speed * 2;

      setTimeout(step, nextSpeed);
    }

    step();
  }

  // ====== BUILD CHAT UI ======
  function buildChatbot() {
    var toggle = document.createElement('button');
    toggle.className = 'chatbot-toggle';
    toggle.innerHTML = '<i class="fas fa-comment-dots"></i><span class="badge"></span>';
    toggle.setAttribute('title', 'Chat with AI Assistant');

    var win = document.createElement('div');
    win.className = 'chatbot-window';
    win.innerHTML =
      '<div class="chatbot-header">' +
        '<div class="chatbot-avatar"><i class="fas fa-robot"></i></div>' +
        '<div class="chatbot-header-info">' +
          '<h4>Pratyusha\'s AI Assistant</h4>' +
          '<span>Ask me anything about her background</span>' +
        '</div>' +
        '<button class="chatbot-sound-toggle" title="Toggle typing sounds"><i class="fas fa-volume-up"></i></button>' +
        '<button class="chatbot-close"><i class="fas fa-times"></i></button>' +
      '</div>' +
      '<div class="chatbot-messages"></div>' +
      '<div class="chatbot-suggestions"></div>' +
      '<div class="chatbot-input">' +
        '<input type="text" placeholder="Ask me anything...">' +
        '<button><i class="fas fa-paper-plane"></i></button>' +
      '</div>';

    document.body.appendChild(toggle);
    document.body.appendChild(win);

    var messages = win.querySelector('.chatbot-messages');
    var suggestionsContainer = win.querySelector('.chatbot-suggestions');
    var input = win.querySelector('.chatbot-input input');
    var sendBtn = win.querySelector('.chatbot-input button');
    var closeBtn = win.querySelector('.chatbot-close');
    var soundBtn = win.querySelector('.chatbot-sound-toggle');
    var isOpen = false;
    var greeted = false;
    var isTyping = false;

    function addUserMessage(text) {
      var msg = document.createElement('div');
      msg.className = 'chat-message user';
      // XSS-safe: use textContent for user input
      msg.textContent = text;
      messages.appendChild(msg);
      messages.scrollTop = messages.scrollHeight;
    }

    function addBotMessage(html, suggestions, useTypewriter) {
      var msg = document.createElement('div');
      msg.className = 'chat-message bot';
      messages.appendChild(msg);

      if (useTypewriter && html.length < 1500) {
        isTyping = true;
        typewriterEffect(msg, html, function () {
          isTyping = false;
          renderSuggestions(suggestions);
        });
      } else {
        // Safe: all content is hardcoded, not user-supplied
        msg.innerHTML = html;
        messages.scrollTop = messages.scrollHeight;
        renderSuggestions(suggestions);
      }
    }

    function renderSuggestions(suggestions) {
      if (!suggestions || suggestions.length === 0) {
        suggestionsContainer.innerHTML = '';
        return;
      }
      suggestionsContainer.innerHTML = '';
      for (var i = 0; i < suggestions.length; i++) {
        (function (text) {
          var chip = document.createElement('button');
          chip.className = 'suggestion-chip';
          chip.textContent = text;
          chip.addEventListener('click', function () {
            if (!isTyping) sendMessage(text);
          });
          suggestionsContainer.appendChild(chip);
        })(suggestions[i]);
      }
    }

    function showThinking() {
      var thinking = document.createElement('div');
      thinking.className = 'thinking-indicator';
      thinking.innerHTML = '<span class="thinking-dots"><span></span><span></span><span></span></span><span class="thinking-text">Analyzing...</span>';
      messages.appendChild(thinking);
      messages.scrollTop = messages.scrollHeight;
      return thinking;
    }

    function sendMessage(text) {
      if (!text.trim() || isTyping) return;
      addUserMessage(text);
      input.value = '';
      suggestionsContainer.innerHTML = '';

      var thinking = showThinking();
      var delay = 500 + Math.random() * 500;

      setTimeout(function () {
        thinking.remove();
        var result = findAnswer(text);
        addBotMessage(result.answer, result.suggestions, true);
      }, delay);
    }

    toggle.addEventListener('click', function () {
      isOpen = !isOpen;
      if (isOpen) {
        win.classList.add('open');
        toggle.innerHTML = '<i class="fas fa-times"></i>';
        if (!greeted) {
          greeted = true;
          setTimeout(function () {
            addBotMessage(
              'Hey there! Welcome to Pratyusha\'s portfolio.<br><br>' +
              'I\'m her AI Assistant. Ask me about her experience, skills, projects, education, or anything else!',
              ['Tell me about her', 'What are her skills?', 'Why should I hire her?', 'Tell me a joke'],
              true
            );
          }, 300);
        }
        input.focus();
      } else {
        win.classList.remove('open');
        toggle.innerHTML = '<i class="fas fa-comment-dots"></i><span class="badge"></span>';
      }
    });

    closeBtn.addEventListener('click', function () {
      isOpen = false;
      win.classList.remove('open');
      toggle.innerHTML = '<i class="fas fa-comment-dots"></i><span class="badge"></span>';
    });

    soundBtn.addEventListener('click', function () {
      chatSoundEnabled = !chatSoundEnabled;
      localStorage.setItem('chatbot_sound', chatSoundEnabled ? '1' : '0');
      soundBtn.innerHTML = chatSoundEnabled ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
    });
    if (!chatSoundEnabled) {
      soundBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') sendMessage(input.value);
    });

    sendBtn.addEventListener('click', function () {
      sendMessage(input.value);
    });
  }

  // ====== INITIALIZE ======
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildChatbot);
  } else {
    buildChatbot();
  }
})();
