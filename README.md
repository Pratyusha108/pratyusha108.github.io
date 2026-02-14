# Sai Pratyusha Gorapalli - Data Scientist Portfolio

A modern, interactive portfolio website showcasing my data science projects, skills, certifications, and professional experience.

**Live Site:** [pratyusha108.github.io](https://pratyusha108.github.io)

---

## Pages

| Page | Description |
|------|-------------|
| **Home** | Hero section with particle animation, data visualization portfolio, skills cloud, certifications, featured projects, GitHub activity, testimonials, and contact form |
| **About** | Professional background, core competencies, interactive radar chart, skills breakdown, work experience timeline, education, achievements, and GitHub heatmap |
| **Projects** | Full project showcase with filter tabs, detailed modals (overview, tech stack, approach, results), and 3D tilt hover effects |
| **Blog** | Data science blog with categorized posts, likes, social sharing, and Disqus comments |
| **Contact** | Professional contact page with form, social links, availability status, and response promise |

---

## Features

### Visual & Interactive
- **Particle Animation** - Canvas-based neural network particles with mouse interactivity on all pages
- **Custom Cursor** - Dot + ring cursor with hover scaling (desktop only)
- **3D Tilt Effect** - Perspective-based card tilt on the projects page
- **Glassmorphism** - Frosted glass effects on dashboard cards and blog elements
- **Floating Tag Cloud** - Animated skill pills with staggered bobbing motion
- **Gradient Text** - Orange-to-coral gradient on all section headings
- **Shimmer Effect** - Light sweep animation on certification cards
- **Dark/Light Mode** - Full theme toggle with localStorage persistence
- **Smooth Page Transitions** - Fade overlay between page navigations
- **Scroll Progress Bar** - Visual indicator of scroll position
- **Magnetic Buttons** - Subtle cursor-follow effect on interactive buttons
- **Text Reveal** - Scroll-triggered fade-in animations
- **Parallax Scrolling** - Depth effect on hero sections
- **Typewriter Effect** - Animated role titles in the hero section

### Content & Functionality
- **AI Chatbot** - Knowledge-base powered assistant with fuzzy matching, typing sounds, suggestion chips, and conversation memory
- **Blog System** - Full blog with localStorage likes, Web Share API, filter tabs, and deep linking
- **Portfolio Stats** - Visitor tracking with session/page analytics
- **Project Modals** - Detailed project views with tech stack, approach, and results
- **Filter Tabs** - Category-based filtering on projects and blog pages
- **Interactive Radar Chart** - Canvas-drawn skills visualization
- **GitHub Activity Heatmap** - Live contribution data from GitHub API
- **Confetti Animation** - Celebratory burst on resume download
- **Sparkle Burst** - Golden star effect on certification clicks
- **Konami Code Easter Egg** - Hidden matrix rain animation

### Technical & SEO
- **PWA Support** - Web app manifest for mobile installability
- **JSON-LD Structured Data** - Schema.org Person markup for search engines
- **Google Analytics** - GA4 integration for visitor tracking
- **Open Graph Tags** - Social media preview cards on all pages
- **Responsive Design** - Mobile-first with breakpoints at 968px, 768px, and 480px
- **Lazy Loading** - Deferred image loading for performance
- **Custom 404 Page** - Branded error page with particle animation

---

## Tech Stack

- **HTML5** / **CSS3** / **Vanilla JavaScript**
- **Font Awesome 6** for icons
- **Canvas API** for particle animations, radar chart, and heatmap
- **Web Audio API** for chatbot typing sounds
- **localStorage** for theme, likes, stats, and chatbot memory
- **GitHub Pages** for hosting

---

## Project Structure

```
/
|-- index.html              # Home page
|-- about.html              # About page
|-- projects.html           # Projects showcase
|-- blog.html               # Blog page
|-- contact.html            # Contact page
|-- 404.html                # Custom error page
|-- manifest.json           # PWA manifest
|-- CNAME                   # Custom domain config
|-- assets/
|   |-- css/
|   |   |-- base.css        # Global styles, cursor, transitions
|   |   |-- layout.css      # Header, footer, nav, floating elements
|   |   |-- home.css         # Home page styles
|   |   |-- about.css        # About page styles
|   |   |-- projects.css     # Projects page + modal styles
|   |   |-- blog.css         # Blog page styles
|   |   |-- contact.css      # Contact page styles
|   |   |-- chatbot.css      # Chatbot widget styles
|   |   |-- stats.css        # Stats panel styles
|   |-- js/
|   |   |-- main.js          # Shared: theme, particles, cursor, transitions, charts
|   |   |-- chatbot.js       # Chatbot engine (IIFE)
|   |   |-- stats.js         # Portfolio stats tracker (IIFE)
|   |   |-- blog.js          # Blog rendering + interactions (IIFE)
|   |   |-- projects.js      # Project modals, filters, tilt effect
|   |   |-- contact.js       # Contact form handling
|   |-- images/              # All images and icons
```

---

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Pratyusha108/pratyusha108.github.io.git
   ```

2. Open `index.html` in a browser, or use a local server:
   ```bash
   npx serve .
   ```

3. For Google Analytics, replace `G-XXXXXXXXXX` in all HTML files with your GA4 Measurement ID.

---

## License

This project is open source and available for personal portfolio inspiration.
