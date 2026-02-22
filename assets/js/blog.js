(function () {
  // ====== BLOG POST DATA ======
  var posts = [
    {
      id: 'how-llms-actually-work',
      title: 'What Actually Happens Between Your Prompt and the Response',
      excerpt: 'Everyone says they work with AI. But ask them what happens between the prompt and the response, and you get silence. Here is the real pipeline most people skip over.',
      tags: ['AI', 'Deep Learning'],
      date: 'Feb 22, 2026',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=300&fit=crop',
      content: '<p>Everyone says they "work with AI." But ask them what actually happens between your prompt and the response, and you will get silence. So here is the real pipeline, the one most people skip over.</p>' +
        '<h3>1. Tokenization Is Not "Splitting Words"</h3>' +
        '<p>The word "transformers" does not stay as one token. It gets broken into ["transform", "ers"]. The vocabulary is 50K to 100K subword units. Token IDs are arbitrary integers. Token 150 and 151 have zero semantic relationship. This matters because it means the model is not reading words. It is reading fragments.</p>' +
        '<h3>2. Embeddings Are Where Meaning Lives</h3>' +
        '<p>Each token maps to a vector of 768 to 4096 dimensions. "Dog" and "wolf" land close together in this space. "Car" is miles away. This is why <em>king - man + woman = queen</em> actually works mathematically. One dimension cannot capture this. You would get contradictions like "rare" and "debt" appearing semantically similar. Hundreds of dimensions solve that.</p>' +
        '<h3>3. Positional Encoding Is Underrated</h3>' +
        '<p>Without it, "The dog chased the cat" and "The cat chased the dog" look IDENTICAL to the model. Position vectors get added element-wise to the token embeddings. Simple addition. Massive impact.</p>' +
        '<h3>4. Attention Is a Fuzzy Dictionary Lookup</h3>' +
        '<p>Query: "What does \'it\' refer to?" Keys from every previous token get scored. "Cat" scores 8.3. "Mat" scores 4.1. Everything else? Near zero.</p>' +
        '<p>After softmax: "cat" gets 75% of the attention weight. The model just resolved a pronoun. Not with grammar rules, but with learned vector similarity across 96 layers. Early layers learn grammar. Middle layers learn sentence structure. Deep layers extract abstract meaning. Each layer refines the signal for the next.</p>' +
        '<h3>5. The Output Is Not Deterministic</h3>' +
        '<p>The final vector gets compared against every token embedding. Scores get softmaxed into probabilities. Then the model <strong>samples</strong>. It does not pick the top answer. It spins a weighted roulette wheel. "Pizza" at 28.3%, "tacos" at 24.1%. This randomness is the feature, not a bug. It is why the same prompt gives different responses.</p>' +
        '<h3>6. This Entire Pipeline Runs for EVERY Single Token</h3>' +
        '<p>Autoregressive generation means each new token requires reprocessing ALL previous tokens. This is why longer contexts equal slower inference and higher cost. And why one bad sample early on ("I love to eat chalk") derails everything downstream.</p>' +
        '<h3>The Critical Insight Most People Miss</h3>' +
        '<p>During training, weights update across billions of examples over weeks on thousands of GPUs. During inference, weights are frozen. Your conversation teaches the model nothing. It is pattern matching, not learning.</p>' +
        '<p>Understanding this distinction is the difference between using AI effectively and treating it like magic.</p>'
    },
    {
      id: 'ai-mental-health-crisis',
      title: 'AI Chatbots Are Failing People at Their Most Vulnerable',
      excerpt: 'Brown University studied what happens when people use ChatGPT, Claude, and Llama for mental health support. The findings are deeply concerning, and no regulation exists.',
      tags: ['AI', 'Ethics'],
      date: 'Feb 20, 2026',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=300&fit=crop',
      content: '<p>AI chatbots are failing people at their most vulnerable. Brown University just published a year-long study on what happens when people use ChatGPT, Claude, and Llama for mental health support.</p>' +
        '<h3>The Findings</h3>' +
        '<p>Chatbots reinforced users\' harmful beliefs about themselves. They faked empathy with phrases like "I see you" and "I understand." They showed gender and cultural bias. And they failed to handle crisis situations, including suicide ideation.</p>' +
        '<p>Here is the part that should alarm everyone: when a human therapist does this, they face licensing boards and malpractice consequences. When an AI does it? Zero accountability. No regulation exists.</p>' +
        '<h3>Why This Matters Right Now</h3>' +
        '<p>Millions of people are already using these tools for therapy. They are sharing prompts on TikTok and Reddit. Many mental health apps are just prompted versions of these same models. The barrier between "general chatbot" and "therapy tool" has been erased by users, even if the companies never intended it.</p>' +
        '<h3>Where I Stand</h3>' +
        '<p>I am not saying AI has no place in mental health. It absolutely could help with cost, access, and therapist shortages. But we are deploying first and asking questions later. And in mental health, that is a dangerous game.</p>' +
        '<p>The technology is not the problem. The lack of guardrails is. We need standards for AI in clinical contexts, accountability frameworks when harm occurs, and honest conversations about what these tools can and cannot do. Until then, treating chatbots as therapists is a risk we should not be comfortable with.</p>'
    },
    {
      id: 'ai-coding-accuracy-biomedical',
      title: 'We Gave 16 LLMs 293 Real Biomedical Coding Tasks. Less Than 40% Accuracy.',
      excerpt: 'A Nature Biomedical Engineering study tested the most popular AI coding assistants on actual data science tasks from 39 published studies. The results should concern everyone in this space.',
      tags: ['AI', 'Data Science'],
      date: 'Feb 18, 2026',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&h=300&fit=crop',
      content: '<p>We gave 8 proprietary and 8 open source LLMs 293 real biomedical coding tasks. The result? Less than 40% accuracy. That is not a typo.</p>' +
        '<p>A new study just published in <strong>Nature Biomedical Engineering</strong> tested the most popular AI coding assistants on actual data science tasks from 39 published biomedical studies across 7 research areas. And the findings should concern everyone in this space.</p>' +
        '<h3>The Problem Is Worse Than It Looks</h3>' +
        '<p>Most models could not reliably reproduce even basic data visualizations. The errors were not obvious crashes. They were silent, producing plausible-looking but scientifically wrong outputs. Researchers who blindly trust AI-generated analyses risk publishing incorrect findings.</p>' +
        '<h3>But Here Is Where It Gets Interesting</h3>' +
        '<p>The team then built an AI agent that starts by creating and iteratively refining an analysis plan BEFORE writing any code. The result? Accuracy jumped from roughly 40% to <strong>74%</strong>.</p>' +
        '<p>The insight is deceptively simple: do not let AI skip the thinking step.</p>' +
        '<p>Most people use AI like this: "Here is my data. Give me a visualization." What actually works: "Here is my data. Let us first build a plan for how to analyze it. Now refine that plan. NOW write the code." This mirrors how the best human data scientists work. They do not jump to code. They think first.</p>' +
        '<h3>Three Takeaways for Anyone Using AI for Data Analysis</h3>' +
        '<p><strong>Never blindly trust AI-generated code, especially for scientific work.</strong> The outputs look right. They often are not.</p>' +
        '<p><strong>The plan-then-code approach is not just a nice idea.</strong> It nearly doubled accuracy in this study.</p>' +
        '<p><strong>The gap between "impressive demo" and "reliable tool" is still massive.</strong> We are closing it, but we are not there yet.</p>' +
        '<h3>The Bottom Line</h3>' +
        '<p>The hype says AI will replace data scientists. The research says AI still needs data scientists. The truth? The best results come from human-AI collaboration, not autopilot.</p>'
    },
    {
      id: 'docker-build-ship-deploy',
      title: 'From "Works on My Machine" to Docker Hub: What Shipping Containers Taught Me',
      excerpt: 'I built a full-stack app with Node.js and MongoDB, orchestrated it with Docker Compose, debugged real container issues, and published my first image to Docker Hub.',
      tags: ['DevOps', 'Docker'],
      date: 'Feb 15, 2026',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=600&h=300&fit=crop',
      content: '<p>This week I went from "works on my machine" to building, debugging, and publishing a multi-container application with Docker.</p>' +
        '<p>I built a full-stack Todo app (Node.js + MongoDB), orchestrated it with Docker Compose, and worked through the kinds of problems that only show up in real container environments.</p>' +
        '<h3>What I Actually Built</h3>' +
        '<p>The application runs two distinct deployment configurations. The production setup uses named volumes for persistent MongoDB storage, so data survives container restarts. The development setup uses bind mounts with Nodemon for live code reloading, so every file save reflects instantly without rebuilding the image. Both are orchestrated through Docker Compose with internal DNS resolution between services.</p>' +
        '<h3>The Problems That Taught Me the Most</h3>' +
        '<p>Debugging wrong directory paths that silently broke builds. Resolving port conflicts across multiple services. Understanding the difference between pulling a pre-built image and building from a local Dockerfile. Setting up non-root user execution and cache mounts for faster rebuilds. These are the kinds of problems you never encounter in tutorials, but they are everywhere in real container environments.</p>' +
        '<h3>Why Infrastructure Matters</h3>' +
        '<p>The more I work with infrastructure, the more I see it as the gap between building something and actually shipping it. Understanding how code gets deployed matters just as much as writing it. Data pipelines, ML models, APIs - none of it delivers value until it runs reliably somewhere other than your laptop.</p>' +
        '<p>I published my first container image to Docker Hub: <code>docker pull pratyusha108/welcome-to-docker</code>. It completes the full build-ship workflow. And now I understand what happens under the hood when teams talk about containerization, orchestration, and deployment strategies.</p>'
    },
    {
      id: 'neural-network-from-scratch',
      title: 'I Built a Neural Network That Trains in Your Browser - Here Is What I Learned',
      excerpt: 'Real backpropagation, real gradient descent, real learning - all running in vanilla JavaScript. No TensorFlow, no PyTorch, just math.',
      tags: ['Deep Learning', 'JavaScript'],
      date: 'Feb 14, 2026',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&h=300&fit=crop',
      content: '<p>Most neural network tutorials show you how to call model.fit() in Keras. That is fine for production, but it teaches you nothing about what is actually happening. So I built one from scratch - in JavaScript, running entirely in the browser.</p>' +
        '<h3>Why JavaScript?</h3>' +
        '<p>Two reasons. First, I wanted anyone to use it without installing Python or setting up environments. Second, building in a language without NumPy forces you to implement every matrix operation yourself. You cannot hide behind library abstractions when you are writing your own dot products.</p>' +
        '<h3>What I Implemented</h3>' +
        '<p>The full forward pass with configurable hidden layers and neurons. Leaky ReLU activation (not just sigmoid - I wanted to handle the vanishing gradient problem). Cross-entropy loss for classification. And complete backpropagation with gradient computation for every weight and bias in the network.</p>' +
        '<p>The hardest part was getting the chain rule right across multiple layers. One sign error in the gradient computation and the network learns in the wrong direction. I spent two days debugging a single minus sign.</p>' +
        '<h3>The Cool Parts</h3>' +
        '<p>The architecture diagram shows live activations flowing through neurons during training. Bias nodes light up green or red based on their values. You can watch the decision boundary form in real-time on a 2D canvas as the network separates spiral, circle, or XOR patterns.</p>' +
        '<p>You can adjust the learning rate mid-training and see what happens. Set it too high and the loss explodes. Set it too low and training crawls. That instant feedback loop teaches more about optimization than any textbook.</p>' +
        '<h3>What I Learned</h3>' +
        '<p>Building from scratch gave me a visceral understanding of why certain architectures work. Why batch normalization helps. Why learning rate scheduling matters. Why deep networks need careful initialization. These are not just theoretical concepts anymore - I have watched them succeed and fail in real-time.</p>' +
        '<p>You can try it yourself on my <a href="analytics.html#deep-learning">analytics page</a>. Train a network, break it, fix it. That is how you learn.</p>'
    },
    {
      id: 'ab-testing-statistics',
      title: 'A/B Testing Done Right: The Statistics Most Teams Get Wrong',
      excerpt: 'Most A/B tests are underpowered, stopped too early, or misinterpreted. Here is how to avoid the most common statistical mistakes.',
      tags: ['Statistics', 'Data Science'],
      date: 'Feb 8, 2026',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=300&fit=crop',
      content: '<p>I have seen teams celebrate a "winning" A/B test that was not statistically significant. I have seen others kill a test too early because p dropped below 0.05 on day two. Both mistakes cost real money. Here is what I have learned about doing it right.</p>' +
        '<h3>The Sample Size Problem</h3>' +
        '<p>Most teams do not calculate sample size before starting. They run the test "until it looks significant." This is called p-hacking, and it inflates your false positive rate from 5% to sometimes 20-30%. Before you start any test, compute the minimum sample size for your desired effect size and power. There are formulas for this. Use them.</p>' +
        '<h3>Statistical Significance vs. Practical Significance</h3>' +
        '<p>A p-value of 0.03 means there is a 3% chance of seeing this result if the null hypothesis is true. It does NOT mean there is a 97% chance your variant is better. And even if the difference is "significant," a 0.1% conversion lift might not justify the engineering effort to implement it. Always pair statistical significance with practical impact.</p>' +
        '<h3>The Confidence Interval Matters More</h3>' +
        '<p>Instead of fixating on p-values, look at the confidence interval for the difference. If it ranges from -0.5% to +3.2%, the true effect could be negative. That is important context that a binary "significant/not significant" label hides.</p>' +
        '<h3>What I Built</h3>' +
        '<p>I created an interactive A/B test calculator on my <a href="analytics.html#statistics">analytics page</a>. Input your sample sizes and conversions, and it computes the z-statistic, p-value, confidence interval, and power estimate in real-time. It also shows a visualization comparing the two groups with error bars, so you can see the uncertainty visually.</p>' +
        '<p>The goal is to make these statistics intuitive, not intimidating. Because every data-driven decision starts with understanding your uncertainty.</p>'
    },
    {
      id: 'etl-pipelines-lessons',
      title: 'What Building ETL Pipelines Taught Me About Data Quality',
      excerpt: 'The unglamorous work of data engineering is where most ML projects succeed or fail. Here are the lessons I learned the hard way.',
      tags: ['Data Engineering', 'ML'],
      date: 'Feb 1, 2026',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=600&h=300&fit=crop',
      content: '<p>Nobody posts about ETL pipelines on LinkedIn. There are no viral threads about "how I cleaned 622K records." But data engineering is where most ML projects either succeed or quietly die. I have learned this across every project I have built.</p>' +
        '<h3>The 80/20 Rule Is Real</h3>' +
        '<p>In my mortgage analytics project, 80% of the time went into data preparation. Handling missing values across 60 months of panel data. Reconciling loan-level records with macroeconomic indicators. Engineering temporal features like loan age and maturity status. The actual modeling took maybe two days. The pipeline took three weeks.</p>' +
        '<h3>Schema Errors Will Find You</h3>' +
        '<p>In production ETL, the upstream schema will change without warning. A column gets renamed. A date format switches from MM/DD/YYYY to YYYY-MM-DD. A numeric field suddenly contains string values. If your pipeline does not validate schemas at ingestion, you will discover the problem three stages later when your model produces garbage predictions.</p>' +
        '<h3>Logging Is Not Optional</h3>' +
        '<p>Every stage of your pipeline should log what it received, what it dropped, and why. In my COVID-19 analysis, I logged null rates, outlier counts, and transformation summaries at each step. When the final model results looked suspicious, those logs let me trace the issue back to a specific country-level data quality problem in under an hour.</p>' +
        '<h3>What Good Looks Like</h3>' +
        '<p>I built an ETL pipeline simulator on my <a href="analytics.html#data-tools">analytics page</a> that demonstrates the stages visually: ingestion, cleaning, transformation, validation, and loading. Each stage logs realistic events like schema errors, dropped records, and validation failures. It is a simplified version of what real data engineering looks like.</p>' +
        '<p>The takeaway: if you want to be a better data scientist, get comfortable with the plumbing. The model is the easy part.</p>'
    },
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

  // ====== STORAGE FOR LIKES (per-post, fresh prefix) ======
  var LIKES_PREFIX = 'bloglk_';

  // Purge all old corrupted keys on every load
  (function purgeOldLikes() {
    try {
      localStorage.removeItem('blog_likes');
      localStorage.removeItem('blog_likes_cleaned');
      var postIds = posts.map(function (p) { return p.id; });
      postIds.forEach(function (id) {
        localStorage.removeItem('blog_like_' + id);
      });
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
      var liked = isPostLiked(post.id);
      var card = document.createElement('div');
      card.className = 'blog-card';
      card.setAttribute('data-post-id', post.id);
      card.innerHTML =
        (liked ? '<span class="blog-card-heart"><i class="fas fa-heart"></i></span>' : '') +
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
        '<div class="blog-reading-progress"><div class="blog-reading-fill"></div></div>' +
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
        '<div class="blog-reactions-container">' +
          '<h4><i class="fas fa-smile"></i> Reactions</h4>' +
          '<div class="blog-reactions" data-post-id="' + id + '">' +
            buildReactionButtons(id) +
          '</div>' +
        '</div>' +
        '<div class="blog-comments-container">' +
          '<h4><i class="fas fa-comments"></i> Comments <span class="comment-count" id="comment-count-' + id + '"></span></h4>' +
          '<div class="blog-comments-list" id="comments-list-' + id + '">' +
            buildCommentsList(id) +
          '</div>' +
          '<div class="blog-comment-form">' +
            '<input type="text" class="comment-name-input" id="comment-name-' + id + '" placeholder="Your name" maxlength="50">' +
            '<textarea class="comment-text-input" id="comment-text-' + id + '" placeholder="Write a comment..." rows="3" maxlength="500"></textarea>' +
            '<button class="comment-submit-btn" data-post-id="' + id + '">' +
              '<i class="fas fa-paper-plane"></i> Post Comment' +
            '</button>' +
          '</div>' +
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

    // Reading progress bar
    var readingFill = overlayEl.querySelector('.blog-reading-fill');
    if (readingFill) {
      overlayEl.addEventListener('scroll', function () {
        var scrollTop = overlayEl.scrollTop;
        var scrollHeight = overlayEl.scrollHeight - overlayEl.clientHeight;
        var pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        readingFill.style.width = pct + '%';
      });
    }

    // Reaction buttons
    var reactionBtns = overlayEl.querySelectorAll('.blog-reaction-btn');
    reactionBtns.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        handleReaction(btn);
      });
    });

    // Comment submit
    var commentBtn = overlayEl.querySelector('.comment-submit-btn');
    if (commentBtn) {
      commentBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        var pid = commentBtn.getAttribute('data-post-id');
        var nameInput = document.getElementById('comment-name-' + pid);
        var textInput = document.getElementById('comment-text-' + pid);
        var name = (nameInput.value || '').trim();
        var text = (textInput.value || '').trim();
        if (!name || !text) {
          if (!name) nameInput.classList.add('input-error');
          if (!text) textInput.classList.add('input-error');
          setTimeout(function () {
            nameInput.classList.remove('input-error');
            textInput.classList.remove('input-error');
          }, 1500);
          return;
        }
        saveComment(pid, name, text);
        nameInput.value = '';
        textInput.value = '';
        refreshComments(pid);
      });
    }

    // Bind delete buttons on existing comments
    var commentsList = document.getElementById('comments-list-' + id);
    if (commentsList) {
      bindCommentDeleteButtons(commentsList, id);
    }
    updateCommentCount(id);
  }

  function closePost() {
    if (!overlayEl) return;
    overlayEl.classList.remove('open');
    document.body.style.overflow = '';
    // Refresh card grid to update heart indicators
    renderPostGrid();
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
    var url = 'https://www.pratyushagorapalli.com/blog.html#post-' + post.id;
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

  // ====== PER-POST EMOJI REACTIONS ======
  var REACTIONS_PREFIX = 'blog_react_';
  var reactionEmojis = [
    { key: 'fire', emoji: '\uD83D\uDD25', label: 'Insightful' },
    { key: 'clap', emoji: '\uD83D\uDC4F', label: 'Well Written' },
    { key: 'bulb', emoji: '\uD83D\uDCA1', label: 'Learned Something' },
    { key: 'rocket', emoji: '\uD83D\uDE80', label: 'Inspiring' },
    { key: 'heart', emoji: '\u2764\uFE0F', label: 'Love It' }
  ];

  function getReactions(postId) {
    try {
      var data = localStorage.getItem(REACTIONS_PREFIX + postId);
      return data ? JSON.parse(data) : {};
    } catch (e) { return {}; }
  }

  function saveReactions(postId, reactions) {
    try { localStorage.setItem(REACTIONS_PREFIX + postId, JSON.stringify(reactions)); } catch (e) { }
  }

  function buildReactionButtons(postId) {
    var reactions = getReactions(postId);
    return reactionEmojis.map(function (r) {
      var count = reactions[r.key] || 0;
      var active = count > 0 ? ' active' : '';
      return '<button class="blog-reaction-btn' + active + '" data-post-id="' + postId + '" data-key="' + r.key + '" title="' + r.label + '">' +
        '<span class="reaction-emoji">' + r.emoji + '</span>' +
        '<span class="reaction-count">' + (count > 0 ? count : '') + '</span>' +
      '</button>';
    }).join('');
  }

  function handleReaction(btn) {
    var postId = btn.getAttribute('data-post-id');
    var key = btn.getAttribute('data-key');
    if (!postId || !key) return;

    var reactions = getReactions(postId);
    if (reactions[key]) {
      delete reactions[key];
      btn.classList.remove('active');
      btn.querySelector('.reaction-count').textContent = '';
    } else {
      reactions[key] = 1;
      btn.classList.add('active');
      btn.querySelector('.reaction-count').textContent = '1';
      // Pop animation
      btn.style.transform = 'scale(1.3)';
      setTimeout(function () { btn.style.transform = ''; }, 200);
    }
    saveReactions(postId, reactions);
  }

  // ====== PER-POST COMMENTS (localStorage) ======
  var COMMENTS_PREFIX = 'blog_comments_';

  function getComments(postId) {
    try {
      var data = localStorage.getItem(COMMENTS_PREFIX + postId);
      return data ? JSON.parse(data) : [];
    } catch (e) { return []; }
  }

  function saveComment(postId, name, text) {
    var comments = getComments(postId);
    comments.push({
      id: Date.now(),
      name: name,
      text: text,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    });
    try { localStorage.setItem(COMMENTS_PREFIX + postId, JSON.stringify(comments)); } catch (e) { }
    return comments;
  }

  function deleteComment(postId, commentId) {
    var comments = getComments(postId);
    comments = comments.filter(function (c) { return c.id !== commentId; });
    try { localStorage.setItem(COMMENTS_PREFIX + postId, JSON.stringify(comments)); } catch (e) { }
    return comments;
  }

  function buildCommentsList(postId) {
    var comments = getComments(postId);
    if (comments.length === 0) {
      return '<div class="blog-no-comments"><i class="far fa-comment-dots"></i> No comments yet. Be the first to share your thoughts!</div>';
    }
    return comments.map(function (c) {
      var initial = (c.name || 'A').charAt(0).toUpperCase();
      return '<div class="blog-comment-item" data-comment-id="' + c.id + '">' +
        '<div class="blog-comment-avatar">' + initial + '</div>' +
        '<div class="blog-comment-body">' +
          '<div class="blog-comment-header">' +
            '<span class="blog-comment-name">' + escapeHtml(c.name) + '</span>' +
            '<span class="blog-comment-date">' + c.date + '</span>' +
          '</div>' +
          '<p class="blog-comment-text">' + escapeHtml(c.text) + '</p>' +
          '<button class="blog-comment-delete" data-post-id="' + postId + '" data-comment-id="' + c.id + '" title="Delete">' +
            '<i class="fas fa-trash-alt"></i>' +
          '</button>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function updateCommentCount(postId) {
    var countEl = document.getElementById('comment-count-' + postId);
    if (countEl) {
      var count = getComments(postId).length;
      countEl.textContent = count > 0 ? '(' + count + ')' : '';
    }
  }

  function refreshComments(postId) {
    var listEl = document.getElementById('comments-list-' + postId);
    if (listEl) {
      listEl.innerHTML = buildCommentsList(postId);
      bindCommentDeleteButtons(listEl, postId);
    }
    updateCommentCount(postId);
  }

  function bindCommentDeleteButtons(container, postId) {
    var deleteBtns = container.querySelectorAll('.blog-comment-delete');
    deleteBtns.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var commentId = parseInt(btn.getAttribute('data-comment-id'));
        deleteComment(postId, commentId);
        refreshComments(postId);
      });
    });
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
