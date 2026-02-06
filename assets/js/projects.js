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
    result: "Enabled early identification of data risks, leakage issues, and low-signal datasets\u2014helping avoid unreliable models and ensuring only viable datasets proceed to ML development.",
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

/* AUTO-OPEN FROM URL PARAM */
document.addEventListener('DOMContentLoaded', function () {
  var params = new URLSearchParams(window.location.search);
  var openKey = params.get('open');
  if (openKey && modalData[openKey]) {
    openModal(openKey);
  }
});
