(function () {
  // ====== CHATBOT SOUND ======
  var chatSoundEnabled = localStorage.getItem('chatbot_sound') !== '0';
  var audioCtx = null;
  var tickCounter = 0;

  function playTickSound() {
    if (!chatSoundEnabled) return;
    tickCounter++;
    if (tickCounter % 7 !== 0) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      var now = audioCtx.currentTime;
      var dur = 0.018 + Math.random() * 0.01;
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

  // ====== LEVENSHTEIN DISTANCE ======
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
    if (word === keyword) return true;
    if (word.length <= 3 || keyword.length <= 3) return false;
    if (keyword.indexOf(word) !== -1 && word.length >= keyword.length * 0.5) return true;
    if (word.indexOf(keyword) !== -1 && keyword.length >= word.length * 0.5) return true;
    var maxDist = word.length <= 4 ? 1 : 2;
    return levenshtein(word, keyword) <= maxDist;
  }

  // ====== INPUT NORMALIZATION ======
  function normalizeInput(text) {
    return text.toLowerCase()
      .replace(/['''`]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // ====== SAFE MATH EVALUATOR ======
  function tryMathEval(rawInput) {
    var text = rawInput.toLowerCase().trim();

    // Strip conversational wrappers
    text = text
      .replace(/^(what\s*('?s|is)|calculate|compute|solve|evaluate|tell me|whats)\s*/i, '')
      .replace(/[=?]+\s*$/, '')
      .trim();

    // Must contain at least one digit
    if (!/\d/.test(text)) return null;
    // Must contain an operator or math function to be a math expression
    if (!/[+\-*\/\^%x()]/.test(text) && !/sqrt|pow|pi|sin|cos|tan|log|abs|mod|factorial/.test(text)) return null;
    // Reject if too many letters (probably a sentence, not math)
    var letterCount = (text.match(/[a-z]/g) || []).length;
    var digitCount = (text.match(/[0-9]/g) || []).length;
    if (letterCount > digitCount + 10) return null;

    // Build safe expression
    var expr = text
      .replace(/\s+/g, '')
      .replace(/x(?=\d)/gi, '*')      // 2x3 -> 2*3
      .replace(/(\d)\(/g, '$1*(')     // 2(3) -> 2*(3)
      .replace(/\)\(/g, ')*(')        // (2)(3) -> (2)*(3)
      .replace(/\^/g, '**')           // power
      .replace(/mod/gi, '%')          // modulo
      .replace(/pi/gi, '(' + Math.PI + ')')
      .replace(/e(?![a-z])/gi, '(' + Math.E + ')');

    // Handle math functions -> Math.fn()
    expr = expr.replace(/sqrt\(/gi, 'Math.sqrt(');
    expr = expr.replace(/abs\(/gi, 'Math.abs(');
    expr = expr.replace(/sin\(/gi, 'Math.sin(');
    expr = expr.replace(/cos\(/gi, 'Math.cos(');
    expr = expr.replace(/tan\(/gi, 'Math.tan(');
    expr = expr.replace(/log\(/gi, 'Math.log10(');
    expr = expr.replace(/ln\(/gi, 'Math.log(');
    expr = expr.replace(/pow\(/gi, 'Math.pow(');
    expr = expr.replace(/ceil\(/gi, 'Math.ceil(');
    expr = expr.replace(/floor\(/gi, 'Math.floor(');
    expr = expr.replace(/round\(/gi, 'Math.round(');

    // Handle factorial: n!
    expr = expr.replace(/(\d+)!/g, function (m, n) {
      var num = parseInt(n, 10);
      if (num > 20 || num < 0) return 'Infinity';
      var f = 1; for (var i = 2; i <= num; i++) f *= i;
      return '' + f;
    });

    // Safety: only allow safe characters after transformations
    if (!/^[0-9+\-*\/().%\s,Math.sqrtabceilflognpow10]+$/.test(expr)) return null;

    try {
      var result = new Function('return (' + expr + ')')();
      if (typeof result !== 'number' || !isFinite(result)) return null;

      var formatted = Number.isInteger(result) ? result.toLocaleString() : parseFloat(result.toFixed(6)).toString();

      // Clean up the display expression
      var display = rawInput.trim().replace(/^(what\s*('?s|is)|calculate|compute|solve|evaluate)\s*/i, '').replace(/[?]+$/, '').trim();

      return {
        answer: '<strong>&#128270; ' + display + ' = ' + formatted + '</strong><br><br>' +
          'I can do basic math! Try things like:<br>' +
          '&#8226; <strong>Arithmetic:</strong> 25 * 4 + 10<br>' +
          '&#8226; <strong>Powers:</strong> 2^10<br>' +
          '&#8226; <strong>Roots:</strong> sqrt(144)<br>' +
          '&#8226; <strong>Trig:</strong> sin(3.14), cos(0)<br>' +
          '&#8226; <strong>Factorial:</strong> 5!<br><br>' +
          'Or ask me about <strong>math formulas</strong>!',
        suggestions: ['Math formulas', 'Statistics formulas', 'Geometry formulas']
      };
    } catch (e) {
      return null;
    }
  }

  // ====== UTILITY ======
  function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // ====== PRE-FILTER (catches off-topic input before knowledge base) ======
  var insultWords = ['idiot', 'stupid', 'dumb', 'suck', 'sucks', 'trash', 'useless', 'garbage',
    'terrible', 'horrible', 'awful', 'pathetic', 'lame', 'loser', 'ugly', 'rubbish', 'crap',
    'fool', 'moron', 'worthless', 'ridiculous', 'jerk', 'noob', 'stink', 'stinks', 'troll',
    'scam', 'fake', 'fraud', 'worst', 'sucky', 'incompetent', 'braindead', 'brainless',
    'pointless', 'hopeless', 'ass', 'shit', 'damn', 'hell', 'wtf', 'stfu', 'fk', 'fck'];

  var insultResponses = [
    'Ouch! I may just be a chatbot, but I have thick skin. How about we talk about something impressive? Ask about Pratyusha\'s projects!',
    'I\'ll take that as feedback! I\'m still learning. Want to ask me something about Pratyusha\'s skills or experience?',
    'Well, that\'s one way to start a conversation! I\'d rather show you something cool though. Try asking about her achievements!',
    'My training data didn\'t prepare me for that one! Let me redirect to something I\'m great at - ask about Pratyusha\'s work!'
  ];

  var offTopicWords = ['politics', 'president', 'election', 'religion', 'dating', 'boyfriend',
    'girlfriend', 'married', 'divorce', 'gossip', 'celebrity', 'netflix', 'tiktok', 'anime',
    'manga', 'zodiac', 'horoscope', 'astrology', 'bitcoin', 'crypto', 'forex', 'nft',
    'minecraft', 'fortnite', 'valorant', 'roblox', 'warzone', 'twitch'];

  var offTopicResponses = [
    'I wish I could help with that! But I\'m Pratyusha\'s portfolio assistant. I\'m great at answering questions about her data science career though!',
    'That\'s outside my expertise! I specialize in everything about Pratyusha. Try asking about her skills, projects, or experience.',
    'Interesting topic, but I\'m better at talking about data science! Ask me about Pratyusha\'s work and I\'ll impress you.'
  ];

  var casualWords = ['lol', 'lmao', 'haha', 'hahaha', 'rofl', 'hmm', 'hmmm', 'idk', 'bruh',
    'bro', 'dude', 'omg', 'yikes', 'oof', 'meh', 'kk', 'xd', 'smh', 'tbh', 'ngl',
    'ikr', 'fr', 'fam', 'slay', 'sus', 'vibe', 'vibes', 'lit', 'bet', 'cap', 'nocap',
    'sheesh', 'bussin', 'rizz', 'goat', 'goated', 'based', 'mid', 'ratio', 'periodt',
    'sksks', 'yas', 'queen', 'king', 'bestie', 'girly', 'guurl', 'chile'];

  var casualResponses = [
    'Ha! I appreciate the energy. Want to learn something cool about Pratyusha\'s portfolio?',
    'Fair enough! If you\'re curious, try asking about her projects, skills, or experience. There\'s some impressive stuff!',
    'I like the vibe! But I\'m at my best when talking about Pratyusha\'s data science work. Ask me anything!'
  ];

  var affirmativeWords = ['yes', 'no', 'ok', 'okay', 'sure', 'nope', 'yep', 'yeah', 'nah',
    'maybe', 'definitely', 'absolutely', 'alright', 'fine', 'agreed', 'correct', 'right',
    'wrong', 'true', 'false', 'yea', 'nay', 'kinda', 'sorta', 'probably', 'certainly'];

  var affirmativeResponses = [
    'What would you like to know? I can tell you about Pratyusha\'s skills, experience, projects, education, or more!',
    'Feel free to ask me anything about Pratyusha! I\'m here to help.',
    'I\'m ready when you are! Ask about her data science background, projects, certifications, or anything else.'
  ];

  function preFilter(normalized) {
    var words = normalized.split(' ');

    // Insults
    for (var i = 0; i < words.length; i++) {
      if (insultWords.indexOf(words[i]) !== -1) {
        return { matched: true, answer: randomFrom(insultResponses), suggestions: ['Tell me about her skills', 'View projects', 'Why hire her?'] };
      }
    }

    // Gibberish (too short or no letters)
    if (normalized.length <= 1 || !/[a-z]/.test(normalized)) {
      return { matched: true, answer: 'I didn\'t quite catch that. Try asking something like "What are her skills?" or "Tell me about her projects."', suggestions: ['What are her skills?', 'Tell me about her projects', 'Why hire her?'] };
    }

    // Single affirmative/negative with no context
    if (words.length <= 2 && affirmativeWords.indexOf(normalized) !== -1) {
      return { matched: true, answer: randomFrom(affirmativeResponses), suggestions: ['Tell me about her experience', 'What are her skills?', 'View projects'] };
    }

    // Casual slang
    if (words.length <= 3 && casualWords.indexOf(words[0]) !== -1) {
      return { matched: true, answer: randomFrom(casualResponses), suggestions: ['Tell me about Pratyusha', 'What are her skills?', 'Tell me a joke'] };
    }

    // Off-topic
    for (var j = 0; j < words.length; j++) {
      if (offTopicWords.indexOf(words[j]) !== -1) {
        return { matched: true, answer: randomFrom(offTopicResponses), suggestions: ['Tell me about her skills', 'View projects', 'About Pratyusha'] };
      }
    }

    return { matched: false };
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
    'location': ['city', 'based', 'located'],
    'available': ['seeking', 'freelance', 'openings'],
    'certifications': ['certified', 'certificate', 'credential'],
    'leadership': ['manage', 'soft skills'],
    'blog': ['article', 'writing'],
    'interview': ['meeting', 'schedule', 'discuss', 'call'],
    'salary': ['compensation', 'package', 'ctc', 'wage']
  };

  function expandWithSynonyms(input) {
    var words = input.split(/\s+/);
    var expanded = words.slice();
    for (var key in synonyms) {
      if (!synonyms.hasOwnProperty(key)) continue;
      var syns = synonyms[key];
      for (var i = 0; i < words.length; i++) {
        if (words[i].length < 3) continue;
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
  var knowledge = [

    // ============ CONVERSATIONAL (priority entries) ============

    {
      keywords: ['hello', 'hi', 'hey', 'greetings', 'sup', 'yo', 'howdy'],
      priority: 100,
      answer: 'Hey there! Nice to meet you! I\'m Pratyusha\'s AI Assistant, and I\'m here to help!<br><br>' +
        'You can ask me about:<br>' +
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
      keywords: ['how are you', 'how r u', 'how you doing', 'whats up', 'whats new', 'wassup', 'hows it going'],
      priority: 100,
      answer: 'I\'m doing awesome, thanks for asking!<br><br>' +
        'I\'m always ready to chat about Pratyusha\'s work. What would you like to know?',
      suggestions: ['Who is Pratyusha?', 'Tell me about her skills', 'Tell me a joke']
    },
    {
      keywords: ['bye', 'goodbye', 'see you', 'later', 'gotta go', 'take care', 'peace out', 'cya', 'ttyl'],
      priority: 100,
      answer: 'Goodbye! It was great chatting with you.<br><br>' +
        'Feel free to come back anytime. And don\'t forget to check out the <a href="contact.html">Contact page</a> if you\'d like to connect with Pratyusha!',
      suggestions: ['Contact her', 'Download resume', 'View projects']
    },
    {
      keywords: ['thank', 'thanks', 'thx', 'ty', 'appreciate', 'thankyou', 'thank you'],
      priority: 90,
      answer: 'You\'re welcome! Happy to help.<br><br>' +
        'Feel free to ask anything else, or explore:<br>' +
        '&#8226; <a href="projects.html">Projects</a> - Full portfolio<br>' +
        '&#8226; <a href="blog.html">Blog</a> - Insights and articles<br>' +
        '&#8226; <a href="contact.html">Contact</a> - Get in touch',
      suggestions: ['View projects', 'Read the blog', 'Download resume']
    },
    {
      keywords: ['awesome', 'great', 'cool', 'impressive', 'amazing', 'wow', 'wonderful', 'fantastic', 'excellent', 'brilliant', 'outstanding', 'incredible'],
      priority: 80,
      answer: 'Glad you think so! Pratyusha puts a lot of effort into her work.<br><br>' +
        'Want to dive deeper into anything specific?',
      suggestions: ['Her best project?', 'Why hire her?', 'View the blog']
    },
    {
      keywords: ['help', 'what can you do', 'options', 'menu', 'commands', 'what do you know', 'how to use', 'instructions'],
      priority: 80,
      answer: 'I can help you with:<br><br>' +
        '&#8226; <strong>Experience</strong> - Work history and roles<br>' +
        '&#8226; <strong>Skills</strong> - Technical proficiencies<br>' +
        '&#8226; <strong>Projects</strong> - Portfolio highlights<br>' +
        '&#8226; <strong>Education</strong> - Degrees and certifications<br>' +
        '&#8226; <strong>Blog</strong> - Articles and insights<br>' +
        '&#8226; <strong>Contact</strong> - How to reach Pratyusha<br>' +
        '&#8226; <strong>Why hire her?</strong> - The full pitch<br><br>' +
        'Just type naturally - I understand most questions!',
      suggestions: ['Tell me about her experience', 'What are her skills?', 'Why hire her?']
    },

    // ============ PROFESSIONAL KNOWLEDGE ============

    {
      keywords: ['experience', 'work history', 'job', 'career', 'role', 'position', 'professional', 'worked', 'working', 'company', 'internship', 'intern', 'research assistant', 'analyst', 'employment', 'employer', 'past work', 'job history'],
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
      keywords: ['education', 'degree', 'university', 'study', 'school', 'college', 'masters', 'mba', 'btech', 'academic', 'electrical', 'engineering', 'webster', 'eee', 'undergrad', 'undergraduate', 'bachelors', 'bachelor', 'graduated', 'graduation', 'coursework', 'osmania', 'studied'],
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
      keywords: ['skill', 'tools', 'technology', 'tech', 'programming', 'language', 'stack', 'abilities', 'expertise', 'proficiency', 'proficient', 'capable', 'strengths', 'knows', 'technologies', 'java', 'html', 'css', 'javascript', 'excel', 'competent'],
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
      keywords: ['research', 'paper', 'publication', 'publish', 'whitepaper', 'journal'],
      answer: '<strong>Research and Publications</strong><br><br>' +
        '<strong>"Exploring Future Trends in Data Analytics"</strong><br>' +
        '<em>From Traditional Analysis to Intelligent Decision Systems</em><br>' +
        'Published: Jan 2026<br><br>' +
        'Covers the evolution from descriptive/predictive analytics to <strong>AI-driven decision systems</strong>, including ML, automation, governance, and enterprise analytics.',
      suggestions: ['Tell me about her projects', 'What are her AI skills?', 'Education details']
    },
    {
      keywords: ['python', 'pandas', 'numpy', 'scikit', 'matplotlib', 'seaborn', 'scipy', 'jupyter'],
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
      keywords: ['r programming', 'r language', 'rstudio', 'ggplot', 'tidyverse', 'dplyr', 'shiny'],
      answer: '<strong>R Programming (85% proficiency)</strong><br><br>' +
        'Pratyusha uses R extensively for statistical analysis and visualization:<br><br>' +
        '&#8226; <strong>Stats:</strong> Hypothesis testing, regression, time series analysis<br>' +
        '&#8226; <strong>Viz:</strong> ggplot2, Shiny dashboards<br>' +
        '&#8226; <strong>Data:</strong> dplyr, tidyr, data.table<br>' +
        '&#8226; <strong>ML:</strong> caret, randomForest, xgboost<br><br>' +
        'Used heavily in her DJIA forecasting project with ETS, TBATS, and STL decomposition.',
      suggestions: ['Python skills?', 'Time series projects?', 'Statistical analysis?']
    },
    {
      keywords: ['sql', 'database', 'query', 'mysql', 'postgres', 'postgresql'],
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
      keywords: ['power bi', 'tableau', 'dashboard', 'visualization', 'visualisation', 'chart', 'report', 'reporting'],
      answer: '<strong>Data Visualization (88% proficiency)</strong><br><br>' +
        '<strong>Power BI:</strong> DAX measures, Power Query, star-schema modeling, drill-through pages<br>' +
        '<strong>Tableau:</strong> Interactive dashboards for KPI monitoring and trend analysis<br>' +
        '<strong>Excel:</strong> Pivot tables, VLOOKUP, conditional formatting, advanced charts<br><br>' +
        'Built dashboards for revenue performance, customer segmentation, forecasting, and operations.',
      suggestions: ['See her projects', 'SQL expertise?', 'Cloud and MLOps?']
    },
    {
      keywords: ['machine learning', 'ml', 'model', 'predict', 'prediction', 'classification', 'regression', 'algorithm', 'supervised', 'unsupervised'],
      answer: '<strong>Machine Learning Expertise (90% proficiency)</strong><br><br>' +
        '<strong>Techniques:</strong> Logistic Regression, Random Forest, SVM, Decision Trees, kNN, k-Means, PCA, Ensemble Methods, Time Series (ETS, TBATS, ARIMA)<br><br>' +
        '<strong>Evaluation:</strong> ROC-AUC, Lift/Deciles, Precision/Recall, F1-Score<br><br>' +
        '<strong>Best Result:</strong> AUC of <strong>0.902</strong> on direct mail response modeling - achieved through careful feature engineering.',
      suggestions: ['Deep Learning skills?', 'Best project results?', 'Python details']
    },
    {
      keywords: ['deep learning', 'neural', 'cnn', 'rnn', 'transformer', 'bert', 'nlp', 'llm', 'ai', 'artificial intelligence', 'generative', 'gpt', 'chatgpt', 'openai', 'natural language'],
      answer: '<strong>Deep Learning and NLP</strong><br><br>' +
        '<strong>Frameworks:</strong> PyTorch, TensorFlow, Transfer Learning<br>' +
        '<strong>NLP:</strong> BERT, RoBERTa, Transformers, Text Classification, Embeddings<br>' +
        '<strong>AI:</strong> LLM Evaluation, Prompt Engineering, Agentic AI Workflows, Generative AI<br>' +
        '<strong>Also:</strong> Information Retrieval, Ranking and Relevance, Recommendation Systems',
      suggestions: ['Cloud and MLOps?', 'Machine Learning details?', 'Tell me about her research']
    },
    {
      keywords: ['cloud', 'azure', 'databricks', 'spark', 'mlops', 'deploy', 'deployment', 'docker', 'kubernetes', 'hadoop', 'linux', 'devops', 'pipeline'],
      answer: '<strong>Cloud and MLOps (80% proficiency)</strong><br><br>' +
        '<strong>Azure:</strong> Azure ML, Azure SQL, Blob Storage, Azure DevOps<br>' +
        '<strong>Big Data:</strong> Apache Spark, Databricks, Hadoop<br>' +
        '<strong>MLOps:</strong> CI/CD Pipelines, Model Monitoring, Drift Awareness<br>' +
        '<strong>Deployment:</strong> REST APIs, Batch Scoring, ADF, Airflow, Docker<br><br>' +
        'Microsoft Certified Azure Data Scientist Associate (DP-100).',
      suggestions: ['Certifications?', 'Python expertise?', 'Experience details']
    },
    {
      keywords: ['time series', 'forecast', 'forecasting', 'arima', 'ets', 'tbats', 'trend', 'seasonal', 'djia', 'stock'],
      answer: '<strong>Time Series Analysis</strong><br><br>' +
        'Pratyusha has deep expertise in time series forecasting:<br><br>' +
        '&#8226; <strong>DJIA Forecasting Project:</strong> ETS, TBATS, STL decomposition for stock market prediction<br>' +
        '&#8226; <strong>Methods:</strong> ARIMA, Exponential Smoothing, Seasonal Decomposition<br>' +
        '&#8226; <strong>Tools:</strong> R (forecast, tseries packages), Python (statsmodels)<br>' +
        '&#8226; <strong>Applications:</strong> Financial forecasting, demand planning, trend analysis',
      suggestions: ['ML expertise?', 'R programming?', 'View projects']
    },
    {
      keywords: ['about', 'introduce', 'summary', 'overview', 'pratyusha', 'who is she', 'who is pratyusha', 'about pratyusha', 'tell me about', 'describe', 'profile', 'biography', 'about her', 'who are they'],
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
      keywords: ['available', 'open to work', 'seeking', 'opportunity', 'looking for', 'hiring', 'relocate', 'remote', 'hybrid', 'on-site', 'willing', 'open for', 'ready to join', 'when can she start', 'start date', 'notice period', 'notice'],
      answer: '<strong>Yes! Actively Seeking Opportunities</strong><br><br>' +
        'Pratyusha is open to:<br>' +
        '&#8226; <strong>Data Science</strong> roles<br>' +
        '&#8226; <strong>Data Analyst</strong> positions<br>' +
        '&#8226; <strong>ML Engineering</strong> roles<br>' +
        '&#8226; <strong>Business Intelligence / Analytics</strong><br><br>' +
        'Based in <strong>St. Louis, MO</strong><br>' +
        'Open to <strong>remote, hybrid, and on-site</strong><br>' +
        'Available to start quickly - reach out to discuss timeline!<br><br>' +
        'Email: <strong>sgorapalli@webster.edu</strong>',
      suggestions: ['Download resume', 'Why hire her?', 'Contact info']
    },
    {
      keywords: ['kaggle', 'competition', 'notebook', 'kaggle profile'],
      answer: '<strong>Kaggle Profile</strong><br><br>' +
        'Active on Kaggle as an <strong>Analytics Contributor</strong> since Jun 2024.<br>' +
        'Conducts EDA, builds reproducible workflows, and creates clear visualizations.<br><br>' +
        'Profile: <a href="https://www.kaggle.com/saipgorapalli" target="_blank">kaggle.com/saipgorapalli</a>',
      suggestions: ['GitHub profile?', 'Projects?', 'Python skills?']
    },
    {
      keywords: ['location', 'where is she', 'city', 'state', 'based', 'lives', 'living', 'from where', 'st louis', 'missouri', 'where does she live', 'country'],
      answer: '<strong>Location</strong><br><br>' +
        'Based in <strong>St. Louis, Missouri, USA</strong><br><br>' +
        'Open to remote, hybrid, and on-site roles (willing to relocate).',
      suggestions: ['Is she available?', 'Contact info', 'Experience details']
    },
    {
      keywords: ['why hire', 'hire her', 'recruit', 'employ', 'why should', 'worth', 'stand out', 'unique', 'compare', 'special', 'what sets her apart', 'differentiator', 'competitive advantage'],
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
      keywords: ['leadership', 'lead', 'team', 'soft skill', 'communication', 'interpersonal', 'teamwork', 'collaborate', 'collaboration'],
      answer: '<strong>Leadership and Soft Skills</strong><br><br>' +
        '&#8226; <strong>Stakeholder Communication:</strong> Translates complex analytics into executive-ready insights<br>' +
        '&#8226; <strong>Cross-functional Collaboration:</strong> Works across technical and business teams<br>' +
        '&#8226; <strong>Project Management:</strong> Delivers high-quality work on tight deadlines<br>' +
        '&#8226; <strong>Mentorship:</strong> Recognized for uplifting peers and team members<br><br>' +
        '<em>"She approaches complex problems with clarity, discipline, and a rare balance of technical depth and managerial insight."</em> - Dr. Y. Jahangir',
      suggestions: ['Technical skills?', 'Experience details', 'Why hire her?']
    },
    {
      keywords: ['domain', 'industry', 'healthcare', 'finance', 'cybersecurity', 'iot', 'sector', 'field', 'vertical'],
      answer: '<strong>Domain Expertise</strong><br><br>' +
        '&#8226; <strong>Healthcare:</strong> COVID-19 mortality prediction, epidemiological modeling<br>' +
        '&#8226; <strong>Finance:</strong> Mortgage payback analytics, revenue forecasting<br>' +
        '&#8226; <strong>Cybersecurity:</strong> Graduate research in security analytics, risk assessment<br>' +
        '&#8226; <strong>IoT:</strong> RFID access-control systems, sensor data analysis<br>' +
        '&#8226; <strong>Retail/Marketing:</strong> Direct mail optimization, customer segmentation',
      suggestions: ['Projects in these domains?', 'Experience details', 'ML expertise']
    },
    {
      keywords: ['blog', 'article', 'post', 'writing', 'insight', 'read', 'content'],
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
      keywords: ['github', 'repo', 'repository', 'open source', 'code', 'git', 'commits', 'contributions'],
      answer: '<strong>GitHub Profile</strong><br><br>' +
        '15+ repositories covering ML, analytics, and data science.<br>' +
        '50+ commits with active development across 6 languages.<br><br>' +
        'Profile: <a href="https://github.com/Pratyusha108" target="_blank">github.com/Pratyusha108</a>',
      suggestions: ['View projects', 'Kaggle profile?', 'Technical skills']
    },

    // ============ NEW PROFESSIONAL ENTRIES ============

    {
      keywords: ['salary', 'compensation', 'pay', 'money', 'earning', 'package', 'ctc', 'wage', 'stipend', 'how much'],
      answer: '<strong>Compensation</strong><br><br>' +
        'Salary expectations are best discussed directly with Pratyusha based on the specific role, location, and scope of the position.<br><br>' +
        'She\'s flexible and focused on finding the right opportunity where she can make an impact.<br><br>' +
        'Reach out via the <a href="contact.html">Contact page</a> to discuss!',
      suggestions: ['Is she available?', 'Contact her', 'Why hire her?']
    },
    {
      keywords: ['visa', 'authorization', 'sponsor', 'sponsorship', 'h1b', 'opt', 'cpt', 'work permit', 'immigration', 'work authorization', 'legal', 'eligible'],
      answer: '<strong>Work Authorization</strong><br><br>' +
        'For specific details about work authorization and visa status, please connect with Pratyusha directly.<br><br>' +
        'She\'s currently pursuing her M.S. at Webster University in St. Louis and is actively seeking opportunities.<br><br>' +
        'Email: <strong>sgorapalli@webster.edu</strong>',
      suggestions: ['Is she available?', 'Contact her', 'Location details']
    },
    {
      keywords: ['learning', 'studying now', 'current focus', 'improving', 'growth', 'upskilling', 'what is she learning', 'future goals', 'roadmap'],
      answer: '<strong>Current Focus and Growth</strong><br><br>' +
        'Pratyusha is constantly expanding her skill set:<br><br>' +
        '&#8226; <strong>Advancing:</strong> Agentic AI workflows and LLM evaluation<br>' +
        '&#8226; <strong>Deepening:</strong> Cloud-native ML deployment on Azure<br>' +
        '&#8226; <strong>Exploring:</strong> Generative AI applications in enterprise settings<br>' +
        '&#8226; <strong>Completing:</strong> M.S. in Data Analytics (graduating May 2026)<br><br>' +
        'She believes in lifelong learning and stays current with the latest in AI and data science.',
      suggestions: ['What are her AI skills?', 'Certifications?', 'Why hire her?']
    },
    {
      keywords: ['website', 'this site', 'this portfolio', 'how built', 'built this', 'who made this', 'web development', 'frontend', 'design'],
      answer: '<strong>About This Portfolio</strong><br><br>' +
        'This portfolio website was built from scratch to showcase Pratyusha\'s data science work:<br><br>' +
        '&#8226; <strong>Tech:</strong> Pure HTML, CSS, and vanilla JavaScript<br>' +
        '&#8226; <strong>Features:</strong> Particle animations, AI chatbot (that\'s me!), 3D effects, dark mode<br>' +
        '&#8226; <strong>No frameworks</strong> - every animation and interaction is hand-written<br>' +
        '&#8226; <strong>6,500+ lines</strong> of code<br><br>' +
        'But remember - Pratyusha is a <strong>data scientist</strong>, not a web developer. This site is just the presentation layer for her real expertise!',
      suggestions: ['What are her real skills?', 'View projects', 'Tell me about her ML work']
    },
    {
      keywords: ['freelance', 'contract', 'consulting', 'part time', 'gig', 'side project', 'contractor', 'consultant'],
      answer: '<strong>Freelance and Consulting</strong><br><br>' +
        'Pratyusha is open to:<br>' +
        '&#8226; Full-time positions (preferred)<br>' +
        '&#8226; Contract/consulting engagements<br>' +
        '&#8226; Freelance data science projects<br><br>' +
        'She has prior experience with independent data analytics engagements including building Power BI dashboards and SQL analytics.<br><br>' +
        'Reach out via <a href="contact.html">Contact</a> to discuss!',
      suggestions: ['Is she available?', 'Experience details', 'Contact her']
    },
    {
      keywords: ['reference', 'recommend', 'testimonial', 'vouch', 'recommendation', 'referral', 'endorsement'],
      answer: '<strong>References and Testimonials</strong><br><br>' +
        '<em>"Her ability to learn rapidly, deliver high-quality work on time, and uplift peers made her one of the most standout individuals I have mentored."</em><br>' +
        '- <strong>Dr. P. Venkataiah</strong>, Professor<br><br>' +
        '<em>"She approaches complex problems with clarity, discipline, and a rare balance of technical depth and managerial insight."</em><br>' +
        '- <strong>Dr. Y. Jahangir</strong>, Professor<br><br>' +
        'Additional professional references available upon request.',
      suggestions: ['Why hire her?', 'Experience details', 'Contact her']
    },
    {
      keywords: ['gpa', 'grades', 'academic performance', 'cgpa', 'marks', 'score', 'academic record', 'transcript'],
      answer: '<strong>Academic Performance</strong><br><br>' +
        'Pratyusha maintains a strong academic record across all three degrees:<br><br>' +
        '&#8226; <strong>M.S. in Data Analytics</strong> (Webster University) - In progress, strong standing<br>' +
        '&#8226; <strong>MBA in Technology Management</strong> (Osmania University) - Completed<br>' +
        '&#8226; <strong>B.Tech in EEE</strong> (Osmania University) - Completed<br><br>' +
        'Her academic excellence is complemented by hands-on project work and certifications.',
      suggestions: ['Education details', 'Certifications?', 'Projects?']
    },
    {
      keywords: ['hobby', 'hobbies', 'interest', 'interests', 'fun', 'free time', 'outside work', 'personal', 'passion', 'enjoy', 'enjoys'],
      answer: '<strong>Interests and Passions</strong><br><br>' +
        'Beyond data science, Pratyusha is passionate about:<br><br>' +
        '&#8226; <strong>Tech Exploration:</strong> Building projects, exploring new AI tools<br>' +
        '&#8226; <strong>Writing:</strong> Data science blog posts and career reflections<br>' +
        '&#8226; <strong>Continuous Learning:</strong> Online courses, Kaggle competitions, research papers<br>' +
        '&#8226; <strong>Community:</strong> Sharing knowledge and mentoring peers<br><br>' +
        'She believes a well-rounded perspective makes for better data science.',
      suggestions: ['View her blog', 'Kaggle profile?', 'About Pratyusha']
    },
    {
      keywords: ['best project', 'favorite project', 'proudest', 'top project', 'highlight', 'strongest project', 'most impressive'],
      answer: '<strong>Standout Project: Direct Mail Response Modeling</strong><br><br>' +
        'This is Pratyusha\'s strongest project result:<br><br>' +
        '&#8226; <strong>Goal:</strong> Predict customer response to direct mail campaigns<br>' +
        '&#8226; <strong>Approach:</strong> PCA for dimensionality reduction + domain-specific feature engineering<br>' +
        '&#8226; <strong>Result:</strong> AUC of <strong>0.902</strong> - significantly above baseline<br>' +
        '&#8226; <strong>Impact:</strong> Optimized marketing spend by targeting likely responders<br><br>' +
        'See all projects on the <a href="projects.html">Projects page</a>!',
      suggestions: ['Other projects?', 'ML expertise?', 'Why hire her?']
    },
    {
      keywords: ['meet', 'interview', 'schedule', 'appointment', 'talk to her', 'speak with', 'set up a call', 'book', 'arrange'],
      answer: '<strong>Let\'s Set Up a Conversation!</strong><br><br>' +
        'Pratyusha would love to connect. Here\'s how to reach her:<br><br>' +
        '&#8226; <strong>Email:</strong> sgorapalli@webster.edu<br>' +
        '&#8226; <strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/pratyusha-g-a92915229/" target="_blank">Send a message</a><br>' +
        '&#8226; <strong>Contact Form:</strong> <a href="contact.html">Fill out the form</a><br><br>' +
        'She typically responds within 24 hours!',
      suggestions: ['Download resume', 'Is she available?', 'Why hire her?']
    },
    {
      keywords: ['surprise', 'interesting fact', 'fun fact', 'something cool', 'did you know', 'random', 'wow me', 'impress me'],
      answer: '<strong>Fun Facts About Pratyusha</strong><br><br>' +
        '&#8226; She\'s built <strong>50+ data science projects</strong> across 5 different industries<br>' +
        '&#8226; She holds <strong>3 degrees</strong>: B.Tech + MBA + M.S. (in progress)<br>' +
        '&#8226; She got her <strong>Azure DP-100 certification</strong> while still in grad school<br>' +
        '&#8226; This portfolio has a <strong>hidden easter egg</strong> - try the Konami code on desktop!<br>' +
        '&#8226; Her chatbot (hi, that\'s me!) uses Levenshtein distance for fuzzy text matching<br><br>' +
        'Pretty cool, right?',
      suggestions: ['What\'s the Konami code?', 'Tell me about her projects', 'Tell me a joke']
    },
    {
      keywords: ['age', 'old', 'birthday', 'born', 'young', 'how old'],
      answer: 'I appreciate the curiosity, but personal details like age aren\'t something I share.<br><br>' +
        'What I can tell you is that Pratyusha has <strong>2+ years of professional experience</strong>, <strong>3 degrees</strong>, and a track record of delivering results.<br><br>' +
        'Would you like to know about her experience or skills instead?',
      suggestions: ['Experience details', 'Education', 'Skills overview']
    },
    {
      keywords: ['problem solving', 'approach', 'methodology', 'process', 'how does she work', 'work style', 'workflow', 'method'],
      answer: '<strong>Pratyusha\'s Data Science Approach</strong><br><br>' +
        '&#8226; <strong>1. Understand the business problem</strong> - Not just the data, but the "why"<br>' +
        '&#8226; <strong>2. Explore and validate data</strong> - EDA, quality checks, domain research<br>' +
        '&#8226; <strong>3. Feature engineering</strong> - Her secret weapon (she wrote a blog post about this!)<br>' +
        '&#8226; <strong>4. Model selection and evaluation</strong> - Multiple techniques, rigorous metrics<br>' +
        '&#8226; <strong>5. Communicate results</strong> - Executive-ready dashboards and reports<br><br>' +
        'She believes the best data science starts with the right questions, not the fanciest algorithms.',
      suggestions: ['View projects', 'ML expertise?', 'Why hire her?']
    },
    {
      keywords: ['why data science', 'chose data science', 'passion for data', 'motivation', 'career switch', 'mba to data', 'non linear', 'career path', 'career change'],
      answer: '<strong>Why Data Science?</strong><br><br>' +
        'Pratyusha\'s journey is uniquely non-linear:<br><br>' +
        '&#8226; Started with a <strong>B.Tech in Electrical Engineering</strong> - built a strong analytical foundation<br>' +
        '&#8226; Pursued an <strong>MBA in Technology Management</strong> - developed business acumen<br>' +
        '&#8226; Discovered her passion for <strong>data-driven decision making</strong> during her MBA<br>' +
        '&#8226; Now completing an <strong>M.S. in Data Analytics</strong> - combining all three backgrounds<br><br>' +
        'This unique path gives her a rare ability to bridge technical depth and business impact.',
      suggestions: ['Education details', 'Experience', 'Why hire her?']
    },
    {
      keywords: ['konami', 'easter egg', 'hidden', 'secret', 'cheat code', 'matrix'],
      answer: '<strong>Easter Egg!</strong><br><br>' +
        'Yes, this portfolio has a hidden feature!<br><br>' +
        'On a desktop keyboard, type this sequence:<br>' +
        '<strong>Up Up Down Down Left Right Left Right B A</strong><br><br>' +
        'Try it and see what happens! (Hint: it involves green falling code...)',
      suggestions: ['More fun facts', 'Tell me a joke', 'View projects']
    },
    {
      keywords: ['data science', 'data scientist', 'what is data science', 'data analytics', 'analytics'],
      answer: '<strong>Data Science is Pratyusha\'s Core Expertise</strong><br><br>' +
        'She covers the full data science lifecycle:<br><br>' +
        '&#8226; <strong>Data Collection and Cleaning:</strong> SQL, Python, ETL pipelines<br>' +
        '&#8226; <strong>Exploratory Analysis:</strong> Statistical testing, visualization, pattern discovery<br>' +
        '&#8226; <strong>Machine Learning:</strong> Supervised, unsupervised, ensemble methods<br>' +
        '&#8226; <strong>Deep Learning/NLP:</strong> Transformers, LLMs, text classification<br>' +
        '&#8226; <strong>Deployment:</strong> Azure ML, REST APIs, dashboards<br>' +
        '&#8226; <strong>Communication:</strong> Stakeholder reports, executive summaries<br><br>' +
        'With <strong>50+ projects</strong> and <strong>2+ years</strong> of experience, she\'s ready for real-world impact.',
      suggestions: ['View her projects', 'Skills breakdown', 'Why hire her?']
    },

    // ============ EASTER EGGS (priority 90) ============

    {
      keywords: ['joke', 'funny', 'laugh', 'humor', 'another joke', 'make me laugh'],
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
      keywords: ['who are you', 'what are you', 'your name', 'are you real', 'are you ai', 'bot', 'are you human', 'are you chatgpt', 'are you claude', 'sentient', 'alive', 'robot'],
      priority: 90,
      answer: 'I\'m Pratyusha\'s AI Assistant!<br><br>' +
        'I was custom-built into this portfolio to help visitors learn about Sai Pratyusha Gorapalli - her skills, experience, projects, and more.<br><br>' +
        'I\'m not ChatGPT or any external AI - I\'m a knowledge-based chatbot designed specifically for this portfolio. Ask me anything about Pratyusha!',
      suggestions: ['Tell me a joke', 'Magic 8 ball', 'Meaning of life']
    },

    // ============ BASIC CHAT (priority 70) ============

    {
      keywords: ['math', 'mathematics', 'math formulas', 'formulas', 'formula', 'equations', 'equation', 'calculate', 'calculator', 'computation'],
      priority: 70,
      answer: '<strong>Math Formulas I Know</strong><br><br>' +
        'I can help with formulas across these areas:<br><br>' +
        '&#8226; <strong>Geometry</strong> - Area, perimeter, volume, surface area<br>' +
        '&#8226; <strong>Algebra</strong> - Quadratic, binomial, logarithms, exponents<br>' +
        '&#8226; <strong>Statistics</strong> - Mean, variance, std dev, z-score, Bayes<br>' +
        '&#8226; <strong>Trigonometry</strong> - Sin, cos, tan, identities<br>' +
        '&#8226; <strong>Calculus</strong> - Derivatives, integrals, limits<br>' +
        '&#8226; <strong>Probability</strong> - Permutations, combinations, distributions<br><br>' +
        'I can also solve basic calculations! Try: <strong>5! + sqrt(144)</strong><br><br>' +
        'Ask about any specific topic!',
      suggestions: ['Geometry formulas', 'Statistics formulas', 'Algebra formulas', 'Calculus formulas']
    },
    {
      keywords: ['geometry', 'area', 'perimeter', 'volume', 'surface area', 'circle', 'triangle', 'rectangle', 'square', 'sphere', 'cylinder', 'cone', 'cube', 'trapezoid', 'parallelogram', 'circumference'],
      priority: 70,
      answer: '<strong>Geometry Formulas</strong><br><br>' +
        '<strong>2D Shapes:</strong><br>' +
        '&#8226; <strong>Circle:</strong> Area = &pi;r<sup>2</sup> | Circumference = 2&pi;r<br>' +
        '&#8226; <strong>Rectangle:</strong> Area = l &times; w | Perimeter = 2(l + w)<br>' +
        '&#8226; <strong>Triangle:</strong> Area = &frac12; &times; b &times; h | Heron\'s: &radic;[s(s-a)(s-b)(s-c)]<br>' +
        '&#8226; <strong>Trapezoid:</strong> Area = &frac12;(a + b) &times; h<br>' +
        '&#8226; <strong>Parallelogram:</strong> Area = b &times; h<br><br>' +
        '<strong>3D Shapes:</strong><br>' +
        '&#8226; <strong>Sphere:</strong> Volume = (4/3)&pi;r<sup>3</sup> | SA = 4&pi;r<sup>2</sup><br>' +
        '&#8226; <strong>Cylinder:</strong> Volume = &pi;r<sup>2</sup>h | SA = 2&pi;r(r + h)<br>' +
        '&#8226; <strong>Cone:</strong> Volume = (1/3)&pi;r<sup>2</sup>h | SA = &pi;r(r + l)<br>' +
        '&#8226; <strong>Cube:</strong> Volume = a<sup>3</sup> | SA = 6a<sup>2</sup><br><br>' +
        '<strong>Pythagorean Theorem:</strong> a<sup>2</sup> + b<sup>2</sup> = c<sup>2</sup>',
      suggestions: ['Algebra formulas', 'Trigonometry', 'Statistics formulas', 'More math']
    },
    {
      keywords: ['algebra', 'quadratic', 'binomial', 'logarithm', 'exponent', 'polynomial', 'factoring', 'linear equation', 'slope', 'distance formula', 'midpoint'],
      priority: 70,
      answer: '<strong>Algebra Formulas</strong><br><br>' +
        '<strong>Quadratic Formula:</strong><br>' +
        '&#8226; x = (-b &plusmn; &radic;(b<sup>2</sup> - 4ac)) / 2a<br>' +
        '&#8226; Discriminant: &Delta; = b<sup>2</sup> - 4ac<br><br>' +
        '<strong>Binomial Theorem:</strong><br>' +
        '&#8226; (a + b)<sup>2</sup> = a<sup>2</sup> + 2ab + b<sup>2</sup><br>' +
        '&#8226; (a - b)<sup>2</sup> = a<sup>2</sup> - 2ab + b<sup>2</sup><br>' +
        '&#8226; (a + b)(a - b) = a<sup>2</sup> - b<sup>2</sup><br><br>' +
        '<strong>Logarithm Rules:</strong><br>' +
        '&#8226; log(ab) = log(a) + log(b)<br>' +
        '&#8226; log(a/b) = log(a) - log(b)<br>' +
        '&#8226; log(a<sup>n</sup>) = n &times; log(a)<br><br>' +
        '<strong>Coordinate Geometry:</strong><br>' +
        '&#8226; Slope: m = (y<sub>2</sub> - y<sub>1</sub>) / (x<sub>2</sub> - x<sub>1</sub>)<br>' +
        '&#8226; Distance: d = &radic;[(x<sub>2</sub>-x<sub>1</sub>)<sup>2</sup> + (y<sub>2</sub>-y<sub>1</sub>)<sup>2</sup>]<br>' +
        '&#8226; Midpoint: ((x<sub>1</sub>+x<sub>2</sub>)/2, (y<sub>1</sub>+y<sub>2</sub>)/2)',
      suggestions: ['Geometry formulas', 'Calculus formulas', 'Statistics formulas']
    },
    {
      keywords: ['statistics', 'stats', 'mean', 'median', 'mode', 'standard deviation', 'variance', 'z score', 'zscore', 'correlation', 'bayes', 'bayesian', 'probability distribution', 'normal distribution', 'bell curve', 'hypothesis', 'p value', 'confidence interval'],
      priority: 70,
      answer: '<strong>Statistics Formulas</strong><br><br>' +
        '<strong>Central Tendency:</strong><br>' +
        '&#8226; Mean: &mu; = &Sigma;x<sub>i</sub> / n<br>' +
        '&#8226; Median: Middle value (sorted data)<br>' +
        '&#8226; Mode: Most frequent value<br><br>' +
        '<strong>Spread:</strong><br>' +
        '&#8226; Variance: &sigma;<sup>2</sup> = &Sigma;(x<sub>i</sub> - &mu;)<sup>2</sup> / n<br>' +
        '&#8226; Std Deviation: &sigma; = &radic;variance<br>' +
        '&#8226; Z-Score: z = (x - &mu;) / &sigma;<br><br>' +
        '<strong>Correlation and Regression:</strong><br>' +
        '&#8226; Pearson r = &Sigma;(x-x&#772;)(y-y&#772;) / &radic;[&Sigma;(x-x&#772;)<sup>2</sup> &times; &Sigma;(y-y&#772;)<sup>2</sup>]<br>' +
        '&#8226; R<sup>2</sup> = 1 - (SS<sub>res</sub> / SS<sub>tot</sub>)<br><br>' +
        '<strong>Bayes\' Theorem:</strong><br>' +
        '&#8226; P(A|B) = P(B|A) &times; P(A) / P(B)<br><br>' +
        '<strong>Confidence Interval:</strong> x&#772; &plusmn; z &times; (&sigma; / &radic;n)<br><br>' +
        '<em>These are core to Pratyusha\'s data science work!</em>',
      suggestions: ['Probability formulas', 'Her ML expertise', 'Algebra formulas']
    },
    {
      keywords: ['trigonometry', 'trig', 'sine', 'cosine', 'tangent', 'pythagorean', 'sin cos tan', 'unit circle', 'radian', 'degree', 'inverse trig', 'soh cah toa', 'sohcahtoa'],
      priority: 70,
      answer: '<strong>Trigonometry Formulas</strong><br><br>' +
        '<strong>Basic Ratios (SOH CAH TOA):</strong><br>' +
        '&#8226; sin(&theta;) = Opposite / Hypotenuse<br>' +
        '&#8226; cos(&theta;) = Adjacent / Hypotenuse<br>' +
        '&#8226; tan(&theta;) = Opposite / Adjacent<br><br>' +
        '<strong>Pythagorean Identities:</strong><br>' +
        '&#8226; sin<sup>2</sup>(&theta;) + cos<sup>2</sup>(&theta;) = 1<br>' +
        '&#8226; 1 + tan<sup>2</sup>(&theta;) = sec<sup>2</sup>(&theta;)<br>' +
        '&#8226; 1 + cot<sup>2</sup>(&theta;) = csc<sup>2</sup>(&theta;)<br><br>' +
        '<strong>Key Values:</strong><br>' +
        '&#8226; sin(0) = 0, sin(30) = 0.5, sin(45) = &radic;2/2, sin(60) = &radic;3/2, sin(90) = 1<br>' +
        '&#8226; cos(0) = 1, cos(30) = &radic;3/2, cos(45) = &radic;2/2, cos(60) = 0.5, cos(90) = 0<br><br>' +
        '<strong>Conversion:</strong> Radians = Degrees &times; &pi; / 180',
      suggestions: ['Geometry formulas', 'Algebra formulas', 'Calculus formulas']
    },
    {
      keywords: ['calculus', 'derivative', 'integral', 'differentiation', 'integration', 'limit', 'limits', 'chain rule', 'product rule', 'quotient rule', 'antiderivative'],
      priority: 70,
      answer: '<strong>Calculus Formulas</strong><br><br>' +
        '<strong>Derivative Rules:</strong><br>' +
        '&#8226; Power Rule: d/dx [x<sup>n</sup>] = nx<sup>n-1</sup><br>' +
        '&#8226; Product Rule: d/dx [fg] = f\'g + fg\'<br>' +
        '&#8226; Quotient Rule: d/dx [f/g] = (f\'g - fg\') / g<sup>2</sup><br>' +
        '&#8226; Chain Rule: d/dx [f(g(x))] = f\'(g(x)) &times; g\'(x)<br><br>' +
        '<strong>Common Derivatives:</strong><br>' +
        '&#8226; d/dx [sin(x)] = cos(x)<br>' +
        '&#8226; d/dx [cos(x)] = -sin(x)<br>' +
        '&#8226; d/dx [e<sup>x</sup>] = e<sup>x</sup><br>' +
        '&#8226; d/dx [ln(x)] = 1/x<br><br>' +
        '<strong>Basic Integrals:</strong><br>' +
        '&#8226; &int; x<sup>n</sup> dx = x<sup>n+1</sup>/(n+1) + C<br>' +
        '&#8226; &int; e<sup>x</sup> dx = e<sup>x</sup> + C<br>' +
        '&#8226; &int; 1/x dx = ln|x| + C<br>' +
        '&#8226; &int; sin(x) dx = -cos(x) + C<br><br>' +
        '<strong>Limits:</strong> lim(x->a) f(x) = L',
      suggestions: ['Algebra formulas', 'Statistics formulas', 'Trigonometry']
    },
    {
      keywords: ['probability', 'permutation', 'combination', 'factorial', 'ncr', 'npr', 'choose', 'counting', 'binomial distribution', 'poisson', 'expected value'],
      priority: 70,
      answer: '<strong>Probability Formulas</strong><br><br>' +
        '<strong>Counting:</strong><br>' +
        '&#8226; Permutations: P(n,r) = n! / (n-r)!<br>' +
        '&#8226; Combinations: C(n,r) = n! / [r!(n-r)!]<br>' +
        '&#8226; Factorial: n! = n &times; (n-1) &times; ... &times; 1<br><br>' +
        '<strong>Probability Rules:</strong><br>' +
        '&#8226; P(A or B) = P(A) + P(B) - P(A and B)<br>' +
        '&#8226; P(A and B) = P(A) &times; P(B|A)<br>' +
        '&#8226; Complement: P(A\') = 1 - P(A)<br><br>' +
        '<strong>Distributions:</strong><br>' +
        '&#8226; Binomial: P(X=k) = C(n,k) p<sup>k</sup>(1-p)<sup>n-k</sup><br>' +
        '&#8226; Poisson: P(X=k) = (&lambda;<sup>k</sup> e<sup>-&lambda;</sup>) / k!<br>' +
        '&#8226; Normal: f(x) = (1/&sigma;&radic;2&pi;) e<sup>-(x-&mu;)<sup>2</sup>/2&sigma;<sup>2</sup></sup><br><br>' +
        '<strong>Expected Value:</strong> E(X) = &Sigma; x<sub>i</sub> &times; P(x<sub>i</sub>)',
      suggestions: ['Statistics formulas', 'Bayes theorem?', 'Her data science skills']
    },
    {
      keywords: ['linear algebra', 'matrix', 'matrices', 'determinant', 'eigenvalue', 'eigenvector', 'vector', 'dot product', 'cross product', 'transpose', 'inverse matrix'],
      priority: 70,
      answer: '<strong>Linear Algebra Formulas</strong><br><br>' +
        '<strong>Vectors:</strong><br>' +
        '&#8226; Dot Product: a &middot; b = &Sigma;a<sub>i</sub>b<sub>i</sub> = |a||b|cos(&theta;)<br>' +
        '&#8226; Magnitude: |v| = &radic;(v<sub>1</sub><sup>2</sup> + v<sub>2</sub><sup>2</sup> + ... + v<sub>n</sub><sup>2</sup>)<br><br>' +
        '<strong>Matrices:</strong><br>' +
        '&#8226; (AB)<sup>T</sup> = B<sup>T</sup>A<sup>T</sup><br>' +
        '&#8226; (AB)<sup>-1</sup> = B<sup>-1</sup>A<sup>-1</sup><br>' +
        '&#8226; det(AB) = det(A) &times; det(B)<br>' +
        '&#8226; 2x2 Determinant: ad - bc<br><br>' +
        '<strong>Eigenvalues:</strong> Av = &lambda;v (solve det(A - &lambda;I) = 0)<br><br>' +
        '<em>Linear algebra is fundamental to machine learning - used in PCA, SVD, neural networks, and more. Pratyusha applies these daily!</em>',
      suggestions: ['Her ML expertise', 'Statistics formulas', 'Calculus formulas']
    },
    {
      keywords: ['advanced math', 'complex math', 'higher math', 'differential equation', 'partial derivative', 'fourier', 'laplace', 'topology', 'abstract algebra', 'number theory', 'real analysis', 'complex analysis', 'tensor'],
      priority: 70,
      answer: 'That\'s getting into advanced mathematics territory! I know the fundamentals, but for topics like differential equations, Fourier transforms, or abstract algebra, I\'d recommend dedicated math resources.<br><br>' +
        'What I <em>can</em> tell you is that Pratyusha applies advanced math concepts daily in her data science work:<br><br>' +
        '&#8226; <strong>Linear Algebra</strong> for ML model internals<br>' +
        '&#8226; <strong>Calculus</strong> for gradient descent and optimization<br>' +
        '&#8226; <strong>Statistics</strong> for hypothesis testing and inference<br>' +
        '&#8226; <strong>Probability</strong> for Bayesian methods and distributions<br><br>' +
        'Want to know how she applies math in her projects?',
      suggestions: ['Her ML expertise', 'View projects', 'Statistics formulas']
    },
    {
      keywords: ['weather', 'rain', 'sunny', 'cold', 'hot', 'temperature', 'climate'],
      priority: 70,
      answer: 'I don\'t have a weather API, but I can tell you the forecast for Pratyusha\'s career is <strong>sunny with a high chance of success</strong>!<br><br>' +
        'Want to know about her skills or projects instead?',
      suggestions: ['What are her skills?', 'View projects', 'Tell me a joke']
    },
    {
      keywords: ['food', 'eat', 'hungry', 'recipe', 'cook', 'pizza', 'burger', 'coffee', 'tea'],
      priority: 70,
      answer: 'I run on data, not food! But I appreciate the thought.<br><br>' +
        'How about I feed you some information about Pratyusha\'s data science work instead?',
      suggestions: ['Tell me about her skills', 'View projects', 'About Pratyusha']
    },
    {
      keywords: ['music', 'song', 'sing', 'movie', 'film', 'tv', 'show', 'game', 'gaming', 'play', 'sport', 'sports', 'football', 'basketball', 'cricket', 'soccer'],
      priority: 70,
      answer: 'I wish I could chat about that! But I\'m a specialist - I know everything about Pratyusha\'s data science career and not much else.<br><br>' +
        'Try asking about her projects, skills, or experience!',
      suggestions: ['Tell me about her projects', 'What are her skills?', 'Fun facts about her']
    },
    {
      keywords: ['love', 'love you', 'crush', 'marry', 'date me', 'flirt', 'cute', 'pretty', 'handsome', 'beautiful'],
      priority: 70,
      answer: 'Ha! I\'m flattered, but I\'m just a chatbot. My heart belongs to data science!<br><br>' +
        'If you\'d like to connect with Pratyusha professionally though, check out the <a href="contact.html">Contact page</a>.',
      suggestions: ['Contact her', 'About Pratyusha', 'Tell me a joke']
    },
    {
      keywords: ['stop', 'reset', 'clear', 'restart', 'start over', 'new chat'],
      priority: 70,
      answer: 'I don\'t have a reset button, but every message is a fresh start! Ask me anything about Pratyusha\'s background.<br><br>' +
        'Try: "What are her skills?" or "Tell me about her projects"',
      suggestions: ['What are her skills?', 'View projects', 'About Pratyusha']
    },
    {
      keywords: ['what time', 'what day', 'what date', 'today', 'time zone', 'clock'],
      priority: 70,
      answer: 'I don\'t have a clock, but I can tell you that it\'s always a good time to check out Pratyusha\'s portfolio!<br><br>' +
        'What would you like to know about her work?',
      suggestions: ['View projects', 'Skills overview', 'Contact her']
    },
    {
      keywords: ['where are you', 'where do you live', 'what country', 'are you from'],
      priority: 70,
      answer: 'I live inside this portfolio website! My whole world is Pratyusha\'s data science career.<br><br>' +
        'Pratyusha herself is based in <strong>St. Louis, Missouri</strong>. Want to know more about her?',
      suggestions: ['About Pratyusha', 'Is she available?', 'Contact her']
    }
  ];

  // ====== FALLBACK POOL ======
  var fallbacks = [
    {
      answer: 'I\'m not sure about that one, but here\'s what I\'m great at:<br><br>' +
        '&#8226; <strong>Experience</strong> - Work history and roles<br>' +
        '&#8226; <strong>Skills</strong> - Technical abilities<br>' +
        '&#8226; <strong>Projects</strong> - Portfolio highlights<br>' +
        '&#8226; <strong>Education</strong> - Degrees and certifications<br>' +
        '&#8226; <strong>Contact</strong> - How to reach her<br>' +
        '&#8226; <strong>Why hire her?</strong> - The full pitch',
      suggestions: ['Tell me about her experience', 'What are her skills?', 'Why should I hire her?']
    },
    {
      answer: 'That\'s a great question, but it\'s outside my knowledge base. I specialize in Pratyusha\'s data science background!<br><br>' +
        'Try asking about her <strong>skills</strong>, <strong>projects</strong>, <strong>experience</strong>, or <strong>certifications</strong>.',
      suggestions: ['Skills overview', 'View projects', 'About Pratyusha']
    },
    {
      answer: 'Hmm, I don\'t have a confident answer for that. I\'d rather be honest than give you wrong information!<br><br>' +
        'I can tell you about Pratyusha\'s technical skills, projects, work experience, or education. What interests you?',
      suggestions: ['Technical skills', 'Her projects', 'Experience details']
    },
    {
      answer: 'I\'m still learning! That one stumped me. But I know a lot about Pratyusha\'s:<br><br>' +
        '&#8226; Python, SQL, and ML expertise<br>' +
        '&#8226; 50+ data science projects<br>' +
        '&#8226; Azure certification<br>' +
        '&#8226; Career path and education<br><br>' +
        'Ask about any of these!',
      suggestions: ['Python skills', 'View projects', 'Certifications']
    },
    {
      answer: 'I don\'t want to give you inaccurate information, so I\'ll be upfront - I\'m not sure about that.<br><br>' +
        'For questions outside my scope, you can reach Pratyusha directly at <strong>sgorapalli@webster.edu</strong>.<br><br>' +
        'Or try asking me something I know well!',
      suggestions: ['What do you know?', 'Contact her', 'Why hire her?']
    },
    {
      answer: 'That\'s not something I have information on. But if you ask about Pratyusha\'s data science work, I promise I won\'t disappoint!<br><br>' +
        'Try: "What are her skills?" or "Tell me about her projects" or "Why should I hire her?"',
      suggestions: ['What are her skills?', 'Her best project?', 'Why hire her?']
    }
  ];
  var fallbackIndex = 0;

  function getRotatingFallback(isPersonalContext) {
    if (isPersonalContext) {
      return {
        answer: 'I don\'t have specific details on that aspect of Pratyusha\'s background. She\'d be happy to discuss it directly!<br><br>' +
          'Email: <strong>sgorapalli@webster.edu</strong><br>' +
          'Or visit the <a href="contact.html">Contact page</a>.',
        suggestions: ['Contact her', 'What do you know?', 'View projects']
      };
    }
    var fb = fallbacks[fallbackIndex % fallbacks.length];
    fallbackIndex++;
    return fb;
  }

  // ====== CONVERSATION MEMORY ======
  var discussedTopics = [];
  var memoryPrefixes = [
    '<em>We touched on this earlier, but here\'s a refresher:</em><br><br>',
    '<em>You asked about this before! Here\'s the info again:</em><br><br>',
    '<em>Good to revisit this topic:</em><br><br>'
  ];

  function isTrackableTopic(entry) {
    return !entry.priority;
  }

  // ====== MATCHING ENGINE ======
  function scoreEntry(entry, inputWords) {
    var score = 0;
    var kw = entry.keywords;

    for (var j = 0; j < kw.length; j++) {
      var kwParts = kw[j].split(' ');

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
        for (var w = 0; w < inputWords.length; w++) {
          if (fuzzyMatch(inputWords[w], kw[j])) {
            score += kw[j].length;
            break;
          }
        }
      }
    }

    if (entry.priority && score > 0) {
      score += entry.priority;
    }

    return score;
  }

  // ====== FIND ANSWER ======
  function findAnswer(input) {
    // Step 1: Try math evaluation on raw input (before normalization strips operators)
    var mathResult = tryMathEval(input);
    if (mathResult) return mathResult;

    // Step 2: Normalize input
    var normalized = normalizeInput(input);

    // Step 3: Pre-filter (catches insults, off-topic, gibberish, slang, affirmatives)
    var filtered = preFilter(normalized);
    if (filtered.matched) {
      return { answer: filtered.answer, suggestions: filtered.suggestions };
    }

    // Step 4: Expand with synonyms and score against knowledge base
    var expandedWords = expandWithSynonyms(normalized);
    var scores = [];

    for (var i = 0; i < knowledge.length; i++) {
      var s = scoreEntry(knowledge[i], expandedWords);
      if (s > 0) scores.push({ index: i, score: s });
    }

    scores.sort(function (a, b) { return b.score - a.score; });

    // Step 5: Threshold check - require minimum score for non-priority entries
    if (scores.length === 0) {
      var personalContext = /pratyusha|portfolio|resume|hire|career/.test(normalized);
      var fb = getRotatingFallback(personalContext);
      return { answer: fb.answer, suggestions: fb.suggestions };
    }

    var best = scores[0];
    var entry = knowledge[best.index];

    // For non-priority entries, require minimum base score of 3
    var baseScore = entry.priority ? best.score - entry.priority : best.score;
    if (!entry.priority && baseScore < 3) {
      var personalContext = /pratyusha|portfolio|resume|hire|career/.test(normalized);
      var fb = getRotatingFallback(personalContext);
      return { answer: fb.answer, suggestions: fb.suggestions };
    }

    var answer = entry.answer;
    var suggestions = entry.suggestions || [];

    // Handle dynamic answers
    if (answer === '__JOKE__') {
      answer = getNextJoke() + '<br><br>Want another one? Just ask! Or try <strong>"magic 8 ball"</strong> or <strong>"meaning of life"</strong>';
    } else if (answer === '__MAGIC8__') {
      answer = magic8Responses[Math.floor(Math.random() * magic8Responses.length)];
    }

    // Multi-topic fusion: combine answers when top 2 scores are within 30%
    // NEVER fuse priority (conversational/easter-egg) entries
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
          suggestions = unique.length > 0 ? unique : suggestions;
        }
      }
    }

    // Conversation memory - only track professional topics
    var prefix = '';
    if (isTrackableTopic(entry)) {
      var topicKey = entry.keywords[0];
      if (discussedTopics.indexOf(topicKey) !== -1) {
        prefix = randomFrom(memoryPrefixes);
      } else {
        discussedTopics.push(topicKey);
      }
    }

    return { answer: prefix + answer, suggestions: suggestions };
  }

  // ====== TYPEWRITER EFFECT ======
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
