# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild anjula.tech as a dark, terminal-aesthetic portfolio using vanilla HTML/CSS + Tailwind CDN, replacing the Bootstrap/jQuery template with a clean from-scratch design.

**Architecture:** Single `index.html` with a rewritten `css/style.css` (CSS vars + animations) and `js/main.js` (vanilla JS, no jQuery). Tailwind CSS loaded via CDN handles layout/spacing. All dynamic content (Medium blog, YouTube videos) fetched client-side via existing API keys.

**Tech Stack:** HTML5, Tailwind CSS (CDN), vanilla JS (ES2020), Google Fonts (Inter + JetBrains Mono), CSS custom properties.

**Design tokens:**
```
--bg:             #0f172a   (page background)
--surface:        #1e293b   (cards, timeline items)
--border:         #334155   (all borders)
--text:           #f8fafc   (primary text)
--text-secondary: #94a3b8   (body text, bullets)
--text-muted:     #475569   (dates, labels)
--accent:         #22d3ee   (cyan — prompts, highlights, CTAs)
--accent-dim:     rgba(34,211,238,0.12)
```

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `index.html` | Full rewrite | All HTML structure |
| `css/style.css` | Full rewrite | CSS vars, animations, custom styles Tailwind can't handle |
| `js/main.js` | Full rewrite | Vanilla JS: nav scroll, mobile nav, back-to-top, Medium RSS, YouTube API |
| `.gitignore` | Modify | Add `.superpowers/` |

**Removed dependencies (delete `<script>`/`<link>` tags only — keep `lib/` files on disk):**
- `lib/bootstrap/` — replaced by Tailwind CDN
- `lib/jquery/` — replaced by vanilla JS
- `lib/owlcarousel/` — unused
- `lib/superfish/` — unused
- `lib/easing/` — unused
- `lib/modal-video/` — unused
- `lib/wow/` — unused
- `lib/font-awesome/` — replaced by Unicode (↑, →, ▸, ▶)
- `lib/animate/` — unused

**Kept:**
- Google Analytics script tag (`G-ETPDNG19ZF`)
- Buy Me a Coffee script tag
- `img/image.png` (hero profile image)
- `img/favicon.ico`

---

## Task 1: Scaffold — HTML shell + CSS variables + Tailwind

**Files:**
- Rewrite: `index.html`
- Rewrite: `css/style.css`
- Modify: `.gitignore`

- [ ] **Step 1: Add `.superpowers/` to `.gitignore`**

Append to `.gitignore`:
```
.superpowers/
```

- [ ] **Step 2: Write `css/style.css` — CSS vars + resets + animations**

Replace entire file content with:
```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #0f172a;
  --surface: #1e293b;
  --border: #334155;
  --text: #f8fafc;
  --text-secondary: #94a3b8;
  --text-muted: #475569;
  --accent: #22d3ee;
  --accent-dim: rgba(34, 211, 238, 0.12);
}

html { scroll-behavior: smooth; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Inter', sans-serif;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

.mono { font-family: 'JetBrains Mono', monospace; }

/* Blinking cursor */
.cursor {
  display: inline-block;
  width: 10px;
  height: 1em;
  background: var(--accent);
  vertical-align: text-bottom;
  animation: blink 1s step-end infinite;
}
@keyframes blink { 50% { opacity: 0; } }

/* Dot-grid hero background */
.hero-grid-bg {
  background-image: radial-gradient(circle at 1px 1px, rgba(34, 211, 238, 0.06) 1px, transparent 0);
  background-size: 32px 32px;
}

/* Scroll bounce animation */
@keyframes bounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50%       { transform: translateX(-50%) translateY(6px); }
}
.scroll-hint { animation: bounce 2s ease-in-out infinite; }

/* Nav transition */
#main-nav {
  transition: background 0.3s, box-shadow 0.3s;
}
#main-nav.scrolled {
  background: rgba(15, 23, 42, 0.95);
  box-shadow: 0 1px 0 var(--border);
}

/* Mobile nav overlay */
#mobile-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  z-index: 90;
}
#mobile-overlay.open { display: block; }

/* Mobile menu */
#mobile-menu {
  display: none;
  position: fixed;
  top: 0; right: 0;
  width: 260px; height: 100vh;
  background: var(--surface);
  border-left: 1px solid var(--border);
  z-index: 95;
  padding: 5rem 2rem 2rem;
  flex-direction: column;
  gap: 1.5rem;
}
#mobile-menu.open { display: flex; }
#mobile-menu a {
  color: var(--text-secondary);
  text-decoration: none;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
}
#mobile-menu a:hover { color: var(--accent); }

/* Back to top */
#back-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 40px; height: 40px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--accent);
  font-size: 1.1rem;
  display: none;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 80;
  transition: border-color 0.2s;
  text-decoration: none;
}
#back-to-top:hover { border-color: var(--accent); }
#back-to-top.visible { display: flex; }

/* Section labels */
.section-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.14em;
  margin-bottom: 0.4rem;
}

/* Timeline */
.timeline-item { border-bottom: 1px solid var(--border); }
.timeline-item:last-child { border-bottom: none; }

/* Badge current */
.badge-current {
  display: inline-block;
  background: var(--accent-dim);
  color: var(--accent);
  border: 1px solid rgba(34, 211, 238, 0.25);
  border-radius: 3px;
  font-size: 0.62rem;
  font-family: 'JetBrains Mono', monospace;
  padding: 1px 6px;
  margin-left: 6px;
  vertical-align: middle;
}

/* Skill tags */
.tag {
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 4px 12px;
  font-size: 0.78rem;
  color: var(--text-secondary);
  font-family: 'JetBrains Mono', monospace;
  transition: border-color 0.2s, color 0.2s;
  cursor: default;
}
.tag:hover { border-color: var(--accent); color: var(--accent); }
.tag.featured {
  border-color: rgba(34, 211, 238, 0.4);
  color: var(--accent);
  background: var(--accent-dim);
}

/* Project cards */
.project-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1.25rem;
  transition: border-color 0.2s, transform 0.2s;
}
.project-card:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
}

/* Video cards */
.video-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  transition: border-color 0.2s, transform 0.2s;
}
.video-card:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
}
.video-card img { width: 100%; aspect-ratio: 16/9; object-fit: cover; }
.video-card-body { padding: 0.85rem; }
.video-card-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 0.4rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.video-card-desc {
  font-size: 0.75rem;
  color: var(--text-muted);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 0.75rem;
}
.video-card-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: var(--accent);
  text-decoration: none;
  font-family: 'JetBrains Mono', monospace;
}
.video-card-link:hover { text-decoration: underline; }

/* Blog cards */
.blog-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  transition: border-color 0.2s, transform 0.2s;
}
.blog-card:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
}
.blog-card img { width: 100%; aspect-ratio: 16/9; object-fit: cover; }
.blog-card-body { padding: 1rem; }
.blog-card-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text);
  text-decoration: none;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.blog-card-title:hover { color: var(--accent); }
.blog-card-excerpt {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin: 0.5rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.blog-card-meta {
  font-size: 0.72rem;
  color: var(--text-muted);
  font-family: 'JetBrains Mono', monospace;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.75rem;
}
.blog-card-meta a {
  color: var(--accent);
  text-decoration: none;
  font-size: 0.72rem;
}
.blog-card-meta a:hover { text-decoration: underline; }

/* Dividers */
.section-divider { height: 1px; background: var(--border); max-width: 820px; margin: 0 auto; }

/* Responsive */
@media (max-width: 768px) {
  #nav-links { display: none; }
  #hamburger { display: flex; }
  .projects-grid { grid-template-columns: 1fr !important; }
  .timeline-grid { grid-template-columns: 1fr !important; }
  .hero-name { font-size: clamp(2.2rem, 10vw, 3rem) !important; }
}
@media (min-width: 769px) {
  #hamburger { display: none; }
}
```

- [ ] **Step 3: Write `index.html` — scaffold only (head + empty body)**

Replace entire `index.html` with:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Buy Me a Coffee -->
  <script data-name="BMC-Widget" data-cfasync="false"
    src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
    data-id="anjisvj"
    data-description="Support me on Buy me a coffee!"
    data-message="Thank you for visiting! Now you can keep me awake with some coffee ☕️"
    data-color="#40DCA5" data-position="Right" data-x_margin="18" data-y_margin="18"></script>

  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-ETPDNG19ZF"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'G-ETPDNG19ZF');
  </script>

  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>Anjula Samarasinghe | Software Engineer</title>
  <meta name="title" content="Anjula Samarasinghe | Software Engineer">
  <meta name="description" content="Software Engineer at Tilli Kids. GSoC '22 contributor and mentor at openMRS. CTO at SEF. Building products across edtech, healthcare, and social impact.">

  <meta property="og:type" content="website">
  <meta property="og:url" content="https://anjula.tech/">
  <meta property="og:title" content="Anjula Samarasinghe | Software Engineer">
  <meta property="og:description" content="Software Engineer at Tilli Kids. GSoC '22 contributor and mentor at openMRS. CTO at SEF.">
  <meta property="og:image" content="img/image.png">

  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="https://anjula.tech/">
  <meta property="twitter:title" content="Anjula Samarasinghe | Software Engineer">
  <meta property="twitter:description" content="Software Engineer at Tilli Kids. GSoC '22 contributor and mentor at openMRS. CTO at SEF.">
  <meta property="twitter:image" content="img/image.png">

  <link href="img/favicon.ico" rel="icon">
  <link href="img/favicon.ico" rel="apple-touch-icon">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">

  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            'bg':      '#0f172a',
            'surface': '#1e293b',
            'accent':  '#22d3ee',
          },
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
            mono: ['"JetBrains Mono"', 'monospace'],
          }
        }
      }
    }
  </script>

  <link href="css/style.css" rel="stylesheet">
</head>
<body class="bg-bg text-slate-50">

  <!-- sections added in Tasks 2–10 -->

  <script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 4: Verify scaffold in browser**

Open `index.html`. Expect: blank dark page (`#0f172a`). No console errors.

- [ ] **Step 5: Commit**

```bash
git add index.html css/style.css .gitignore
git commit -m "feat: scaffold dark portfolio — Tailwind CDN, CSS vars, fonts"
```

---

## Task 2: Navigation + JS foundation

**Files:**
- Modify: `index.html`
- Rewrite: `js/main.js`

- [ ] **Step 1: Add nav HTML inside `<body>` before `<!-- sections added in Tasks 2–10 -->`**

```html
<!-- NAV -->
<nav id="main-nav" class="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-6 md:px-10 bg-bg/80 backdrop-blur-md border-b border-slate-800">
  <a href="#hero" class="font-black text-lg text-slate-50 no-underline">
    anjula<span class="text-accent">.</span>
  </a>
  <ul id="nav-links" class="flex gap-6 list-none">
    <li><a href="#experience" class="text-slate-400 hover:text-accent text-sm font-mono transition-colors no-underline">experience</a></li>
    <li><a href="#skills"     class="text-slate-400 hover:text-accent text-sm font-mono transition-colors no-underline">skills</a></li>
    <li><a href="#projects"   class="text-slate-400 hover:text-accent text-sm font-mono transition-colors no-underline">projects</a></li>
    <li><a href="#education"  class="text-slate-400 hover:text-accent text-sm font-mono transition-colors no-underline">education</a></li>
    <li><a href="#blog"       class="text-slate-400 hover:text-accent text-sm font-mono transition-colors no-underline">blog</a></li>
    <li><a href="#knowledge"  class="text-slate-400 hover:text-accent text-sm font-mono transition-colors no-underline">videos</a></li>
  </ul>
  <button id="hamburger" class="flex flex-col gap-1.5 p-1 cursor-pointer bg-transparent border-none" aria-label="Open menu">
    <span class="w-5 h-0.5 bg-slate-400 block"></span>
    <span class="w-5 h-0.5 bg-slate-400 block"></span>
    <span class="w-5 h-0.5 bg-slate-400 block"></span>
  </button>
</nav>

<div id="mobile-overlay"></div>

<div id="mobile-menu">
  <a href="#experience" class="mobile-nav-link">experience</a>
  <a href="#skills"     class="mobile-nav-link">skills</a>
  <a href="#projects"   class="mobile-nav-link">projects</a>
  <a href="#education"  class="mobile-nav-link">education</a>
  <a href="#blog"       class="mobile-nav-link">blog</a>
  <a href="#knowledge"  class="mobile-nav-link">videos</a>
</div>
```

- [ ] **Step 2: Rewrite `js/main.js` — vanilla JS only**

Replace entire file with:
```javascript
// ─── Nav scroll ────────────────────────────────────────────────────────────
const nav      = document.getElementById('main-nav');
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
  if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 300);
});

// ─── Mobile nav ────────────────────────────────────────────────────────────
const hamburger     = document.getElementById('hamburger');
const mobileMenu    = document.getElementById('mobile-menu');
const mobileOverlay = document.getElementById('mobile-overlay');

function openMobileNav() {
  mobileMenu.classList.add('open');
  mobileOverlay.classList.add('open');
}
function closeMobileNav() {
  mobileMenu.classList.remove('open');
  mobileOverlay.classList.remove('open');
}

hamburger.addEventListener('click', openMobileNav);
mobileOverlay.addEventListener('click', closeMobileNav);
document.querySelectorAll('.mobile-nav-link').forEach(link =>
  link.addEventListener('click', closeMobileNav)
);

// ─── Back to top ───────────────────────────────────────────────────────────
if (backToTop) {
  backToTop.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ─── Blog: Medium RSS ──────────────────────────────────────────────────────
function fetchBlogs() {
  const container = document.getElementById('blog-posts');
  if (!container) return;

  fetch('https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@anjulashanaka')
    .then(res => res.json())
    .then(data => {
      const posts = data.items.filter(item => item.categories.length > 0);
      container.innerHTML = posts.map(item => {
        const excerpt = item.content.replace(/<[^>]+>/g, '').slice(0, 280) + '…';
        const date    = item.pubDate.slice(0, 10);
        return `
          <div class="blog-card">
            <a href="${item.link}" target="_blank" rel="noopener">
              <img src="${item.thumbnail}" alt="${item.title}" loading="lazy">
            </a>
            <div class="blog-card-body">
              <a class="blog-card-title" href="${item.link}" target="_blank" rel="noopener">${item.title}</a>
              <p class="blog-card-excerpt">${excerpt}</p>
              <div class="blog-card-meta">
                <span>${date}</span>
                <a href="${item.link}" target="_blank" rel="noopener">read more →</a>
              </div>
            </div>
          </div>`;
      }).join('');
    })
    .catch(() => {
      container.innerHTML = '<p class="font-mono text-slate-500 text-sm col-span-3">// Could not load posts.</p>';
    });
}

// ─── YouTube videos ────────────────────────────────────────────────────────
const ytPageTokens = { knowledge: null, sessions: null, simulations: null };

async function fetchYoutubeVideos(type) {
  const config = {
    knowledge:   { playlist: 'PLx4Ro8e0E8S_GmG75brlX1yGbILEiuY7m', section: 'knowledge-sharing-videos' },
    sessions:    { playlist: 'PLx4Ro8e0E8S8A8NpNfLWtelLFnqgeW5pz', section: 'web-development-videos'    },
    simulations: { playlist: 'PLx4Ro8e0E8S90j80OTgEgjTQSRGLixP5p', section: 'simulation-videos'          },
  };
  const { playlist, section } = config[type];
  const token  = ytPageTokens[type];
  const apiKey = 'AIzaSyBTfMNlg_WsL7cMiOIh7XQs0oZqLEkhl2c';
  const url    = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=9&playlistId=${playlist}&key=${apiKey}${token ? `&pageToken=${token}` : ''}`;

  try {
    const res  = await fetch(url);
    const data = await res.json();
    ytPageTokens[type] = data.nextPageToken || null;

    const container = document.getElementById(section);
    if (!container) return;

    container.insertAdjacentHTML('beforeend', data.items.map(item => `
      <div class="video-card">
        <img src="${item.snippet.thumbnails.medium.url}" alt="${item.snippet.title}" loading="lazy">
        <div class="video-card-body">
          <div class="video-card-title">${item.snippet.title}</div>
          <div class="video-card-desc">${item.snippet.description}</div>
          <a class="video-card-link"
             href="https://youtube.com/watch?v=${item.snippet.resourceId.videoId}"
             target="_blank" rel="noopener">▶ Watch Now</a>
        </div>
      </div>`).join(''));

    if (!data.nextPageToken) {
      const btn = document.getElementById(`${section}-view-more`);
      if (btn) btn.style.display = 'none';
    }
  } catch {
    console.error(`Failed to load YouTube playlist: ${type}`);
  }
}

// ─── Init ──────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  fetchBlogs();
  fetchYoutubeVideos('knowledge');
  fetchYoutubeVideos('sessions');
  fetchYoutubeVideos('simulations');
});
```

- [ ] **Step 3: Verify nav in browser**

Open `index.html`. Expect: dark nav bar at top, "anjula." logo with cyan dot, 6 links on desktop. Scroll — nav gains shadow. On mobile viewport — hamburger shows, tapping opens side menu, tapping a link closes it.

- [ ] **Step 4: Commit**

```bash
git add index.html js/main.js
git commit -m "feat: nav — sticky scroll-aware, mobile hamburger, vanilla JS"
```

---

## Task 3: Hero Section

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add hero after nav/overlay divs, before `<!-- sections added in Tasks 2–10 -->`**

```html
<!-- HERO -->
<section id="hero" class="relative min-h-screen flex flex-col justify-center px-6 md:px-10 pt-20 pb-16 hero-grid-bg" style="max-width:820px;margin:0 auto;">
  <p class="font-mono text-accent text-sm mb-5 flex items-center gap-2">
    &gt; whoami <span class="cursor"></span>
  </p>

  <h1 class="hero-name font-black leading-none tracking-tight mb-3" style="font-size:clamp(2.8rem,7vw,5rem);">
    Anjula<br>
    <span class="text-accent">Samarasinghe</span>
  </h1>

  <p class="text-slate-400 text-base mb-5">
    <strong class="text-slate-100 font-semibold">Software Engineer</strong>
    &nbsp;·&nbsp; GSoC '22 &nbsp;·&nbsp; CTO @SEF
  </p>

  <p class="text-slate-400 text-sm leading-relaxed mb-8 max-w-lg">
    Building products at <strong class="text-slate-200">Tilli Kids</strong> (SF) · Open source contributor at
    <strong class="text-slate-200">openMRS</strong> · Led engineering at
    <strong class="text-slate-200">SEF</strong> · 4+ years across edtech, healthcare, and social impact.
  </p>

  <div class="flex gap-3 flex-wrap mb-10">
    <a href="#experience"
       class="bg-accent text-bg font-bold text-sm px-5 py-2.5 rounded no-underline hover:opacity-80 transition-opacity">
      View Work
    </a>
    <a href="latest-cv.pdf" target="_blank"
       class="border border-accent text-accent font-semibold text-sm px-5 py-2.5 rounded no-underline hover:bg-accent/10 transition-colors">
      Download CV
    </a>
  </div>

  <div class="flex gap-5 flex-wrap">
    <a href="https://github.com/anjula-sack" target="_blank" rel="noopener"
       class="font-mono text-slate-500 hover:text-accent text-xs no-underline transition-colors">→ GitHub</a>
    <a href="https://linkedin.com/in/anjula-sack" target="_blank" rel="noopener"
       class="font-mono text-slate-500 hover:text-accent text-xs no-underline transition-colors">→ LinkedIn</a>
    <a href="https://www.medium.com/@anjulashanaka" target="_blank" rel="noopener"
       class="font-mono text-slate-500 hover:text-accent text-xs no-underline transition-colors">→ Medium</a>
    <a href="https://www.youtube.com/channel/UCLjQYVhICeegPX6ah4-dQpw" target="_blank" rel="noopener"
       class="font-mono text-slate-500 hover:text-accent text-xs no-underline transition-colors">→ YouTube</a>
  </div>

  <div class="scroll-hint absolute bottom-8 left-1/2 flex flex-col items-center gap-1.5 font-mono text-slate-600 text-xs">
    scroll<span class="text-accent text-base">↓</span>
  </div>
</section>

<div class="section-divider"></div>
```

- [ ] **Step 2: Verify hero in browser**

Open `index.html`. Expect:
- Full-viewport dark section with subtle dot grid pattern
- Blinking cyan cursor after `> whoami`
- "Anjula" white, "Samarasinghe" cyan, large font
- Cyan-filled "View Work" button + ghost "Download CV" button
- 4 social links in muted mono with `→` prefix, hover → cyan
- Bouncing "scroll ↓" at bottom center

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: hero — full-viewport, terminal prompt, blinking cursor"
```

---

## Task 4: Experience Section

**Files:**
- Modify: `index.html` (append after hero `section-divider`)

- [ ] **Step 1: Add experience HTML**

```html
<!-- EXPERIENCE -->
<section id="experience" class="px-6 md:px-10 py-20" style="max-width:820px;margin:0 auto;">
  <div class="section-label">// experience</div>
  <h2 class="text-2xl font-extrabold mb-10">Where I've Worked</h2>

  <div class="timeline">

    <div class="timeline-item timeline-grid grid gap-6 py-6" style="grid-template-columns:1fr 3fr;">
      <div>
        <div class="font-mono text-slate-500 text-xs leading-relaxed">Sept 2023<br>Present</div>
        <div class="text-accent font-semibold text-sm mt-1">Tilli Kids Inc.</div>
        <div class="text-slate-500 text-xs">San Francisco, USA</div>
      </div>
      <div>
        <div class="font-bold text-base mb-2">Software Engineer <span class="badge-current">current</span></div>
        <ul class="space-y-1.5">
          <li class="text-slate-400 text-sm pl-4 relative before:content-['▸'] before:absolute before:left-0 before:text-accent before:text-xs before:top-0.5">Developed Teacher Dashboard for Tilli's SEL app — enabling teachers to track student progress and make informed decisions.</li>
          <li class="text-slate-400 text-sm pl-4 relative before:content-['▸'] before:absolute before:left-0 before:text-accent before:text-xs before:top-0.5">Built inventory dashboard with SKU generator and product registration feature.</li>
          <li class="text-slate-400 text-sm pl-4 relative before:content-['▸'] before:absolute before:left-0 before:text-accent before:text-xs before:top-0.5">Created LLM-powered parenting tool with multi-language support.</li>
        </ul>
      </div>
    </div>

    <div class="timeline-item timeline-grid grid gap-6 py-6" style="grid-template-columns:1fr 3fr;">
      <div>
        <div class="font-mono text-slate-500 text-xs leading-relaxed">Jul 2022<br>Present</div>
        <div class="text-accent font-semibold text-sm mt-1">SEF</div>
      </div>
      <div>
        <div class="font-bold text-base mb-2">Chief Technical Officer <span class="badge-current">current</span></div>
        <ul class="space-y-1.5">
          <li class="text-slate-400 text-sm pl-4 relative before:content-['▸'] before:absolute before:left-0 before:text-accent before:text-xs before:top-0.5">Leads the SEF Engineering team, overseeing development of SEF projects — particularly the ScholarX mentoring platform.</li>
        </ul>
      </div>
    </div>

    <div class="timeline-item timeline-grid grid gap-6 py-6" style="grid-template-columns:1fr 3fr;">
      <div>
        <div class="font-mono text-slate-500 text-xs leading-relaxed">May 2023<br>Sep 2023</div>
        <div class="text-accent font-semibold text-sm mt-1">openMRS</div>
      </div>
      <div>
        <div class="font-bold text-base mb-2">Google Summer of Code Mentor</div>
        <ul class="space-y-1.5">
          <li class="text-slate-400 text-sm pl-4 relative before:content-['▸'] before:absolute before:left-0 before:text-accent before:text-xs before:top-0.5">Mentored two GSoC projects on Playwright and Jest testing, significantly increasing test coverage for openMRS 3.0.</li>
        </ul>
      </div>
    </div>

    <div class="timeline-item timeline-grid grid gap-6 py-6" style="grid-template-columns:1fr 3fr;">
      <div>
        <div class="font-mono text-slate-500 text-xs leading-relaxed">Nov 2022<br>Jun 2023</div>
        <div class="text-accent font-semibold text-sm mt-1">ASCII Corporation</div>
        <div class="text-slate-500 text-xs">Colombo, Sri Lanka</div>
      </div>
      <div>
        <div class="font-bold text-base mb-2">Software Engineer</div>
        <ul class="space-y-1.5">
          <li class="text-slate-400 text-sm pl-4 relative before:content-['▸'] before:absolute before:left-0 before:text-accent before:text-xs before:top-0.5">Led development of a ticket management platform, streamlining Zendesk/Jira ticket handling and workload management.</li>
          <li class="text-slate-400 text-sm pl-4 relative before:content-['▸'] before:absolute before:left-0 before:text-accent before:text-xs before:top-0.5">Integrated GPT wrapper with Messenger via Meta Cloud APIs.</li>
        </ul>
      </div>
    </div>

    <div class="timeline-item timeline-grid grid gap-6 py-6" style="grid-template-columns:1fr 3fr;">
      <div>
        <div class="font-mono text-slate-500 text-xs leading-relaxed">Jul 2022<br>Jul 2023</div>
        <div class="text-accent font-semibold text-sm mt-1">Lanka Software Foundation</div>
      </div>
      <div>
        <div class="font-bold text-base mb-2">Community Developer</div>
        <ul class="space-y-1.5">
          <li class="text-slate-400 text-sm pl-4 relative before:content-['▸'] before:absolute before:left-0 before:text-accent before:text-xs before:top-0.5">Built "Elixir" with Red Cross Sri Lanka to address medical shortages — raising over $800,000 worth of medicine.</li>
        </ul>
      </div>
    </div>

    <div class="timeline-item timeline-grid grid gap-6 py-6" style="grid-template-columns:1fr 3fr;">
      <div>
        <div class="font-mono text-slate-500 text-xs leading-relaxed">May 2022<br>Sep 2022</div>
        <div class="text-accent font-semibold text-sm mt-1">openMRS</div>
      </div>
      <div>
        <div class="font-bold text-base mb-2">Google Summer of Code Contributor</div>
        <ul class="space-y-1.5">
          <li class="text-slate-400 text-sm pl-4 relative before:content-['▸'] before:absolute before:left-0 before:text-accent before:text-xs before:top-0.5">Rebuilt the Cohort Builder from scratch as part of openMRS 3.0 — new UI, more query options, save and export queries.</li>
        </ul>
      </div>
    </div>

    <div class="timeline-item timeline-grid grid gap-6 py-6" style="grid-template-columns:1fr 3fr;">
      <div>
        <div class="font-mono text-slate-500 text-xs leading-relaxed">Jul 2021<br>Dec 2022</div>
        <div class="text-accent font-semibold text-sm mt-1">promiseQ</div>
        <div class="text-slate-500 text-xs">Berlin, Germany</div>
      </div>
      <div>
        <div class="font-bold text-base mb-2">Software Developer</div>
        <ul class="space-y-1.5">
          <li class="text-slate-400 text-sm pl-4 relative before:content-['▸'] before:absolute before:left-0 before:text-accent before:text-xs before:top-0.5">Developed ML-powered alarm verification web app with real-time alarm updates and email notifications. VueJs + Firebase.</li>
        </ul>
      </div>
    </div>

    <div class="timeline-item timeline-grid grid gap-6 py-6" style="grid-template-columns:1fr 3fr;">
      <div>
        <div class="font-mono text-slate-500 text-xs leading-relaxed">Jul 2020<br>Jul 2021</div>
        <div class="text-accent font-semibold text-sm mt-1">rootcode labs</div>
        <div class="text-slate-500 text-xs">Colombo, Sri Lanka</div>
      </div>
      <div>
        <div class="font-bold text-base mb-2">Software Engineer Intern</div>
        <ul class="space-y-1.5">
          <li class="text-slate-400 text-sm pl-4 relative before:content-['▸'] before:absolute before:left-0 before:text-accent before:text-xs before:top-0.5">Worked on LRIMS for Afghanistan — map comparisons and export options.</li>
          <li class="text-slate-400 text-sm pl-4 relative before:content-['▸'] before:absolute before:left-0 before:text-accent before:text-xs before:top-0.5">Co-created expert/customer dashboard with call logs, payments, and service management.</li>
        </ul>
      </div>
    </div>

  </div>
</section>

<div class="section-divider"></div>
```

- [ ] **Step 2: Verify experience in browser**

Scroll to experience. Expect: 8 entries in 2-col timeline grid. Cyan company names. "current" badge on Tilli and SEF. Cyan `▸` bullets. Horizontal dividers between entries.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: experience section — 8-entry timeline from CV"
```

---

## Task 5: Skills Section

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add skills HTML after experience `section-divider`**

```html
<!-- SKILLS -->
<section id="skills" class="px-6 md:px-10 py-20" style="max-width:820px;margin:0 auto;">
  <div class="section-label">// skills</div>
  <h2 class="text-2xl font-extrabold mb-10">What I Work With</h2>

  <div class="space-y-6">
    <div>
      <div class="font-mono text-slate-500 text-xs uppercase tracking-widest mb-3">Languages &amp; Libraries</div>
      <div class="flex flex-wrap gap-2">
        <span class="tag featured">TypeScript</span>
        <span class="tag featured">React.js</span>
        <span class="tag">JavaScript</span>
        <span class="tag">Java</span>
        <span class="tag">Python</span>
        <span class="tag">SQL</span>
        <span class="tag">React Query</span>
        <span class="tag">Redux Toolkit</span>
        <span class="tag">RHF</span>
        <span class="tag">React Testing Library</span>
      </div>
    </div>
    <div>
      <div class="font-mono text-slate-500 text-xs uppercase tracking-widest mb-3">Frameworks</div>
      <div class="flex flex-wrap gap-2">
        <span class="tag featured">Next.js</span>
        <span class="tag">Vue.js</span>
        <span class="tag">Node.js</span>
        <span class="tag">Flask</span>
        <span class="tag">Tailwind CSS</span>
        <span class="tag">Playwright</span>
      </div>
    </div>
    <div>
      <div class="font-mono text-slate-500 text-xs uppercase tracking-widest mb-3">Developer Tools</div>
      <div class="flex flex-wrap gap-2">
        <span class="tag">Git</span>
        <span class="tag">Docker</span>
        <span class="tag">GitHub Actions</span>
        <span class="tag">Nginx</span>
      </div>
    </div>
    <div>
      <div class="font-mono text-slate-500 text-xs uppercase tracking-widest mb-3">Platforms &amp; Services</div>
      <div class="flex flex-wrap gap-2">
        <span class="tag">GCP</span>
        <span class="tag">AWS</span>
        <span class="tag">Firebase</span>
      </div>
    </div>
  </div>
</section>

<div class="section-divider"></div>
```

- [ ] **Step 2: Verify skills in browser**

Scroll to skills. Expect: 4 categories with mono labels. TypeScript, React.js, Next.js have cyan featured style. All tags show hover → cyan.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: skills section — 4 categories, featured tags"
```

---

## Task 6: Projects Section

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add projects HTML after skills `section-divider`**

```html
<!-- PROJECTS -->
<section id="projects" class="px-6 md:px-10 py-20" style="max-width:820px;margin:0 auto;">
  <div class="section-label">// projects</div>
  <h2 class="text-2xl font-extrabold mb-10">Things I've Built</h2>

  <div class="projects-grid grid gap-4" style="grid-template-columns:1fr 1fr;">

    <div class="project-card">
      <div class="font-mono text-accent text-xs mb-1">openMRS <span class="text-slate-500 float-right">2022</span></div>
      <div class="font-bold text-base mb-2">Cohort Builder</div>
      <p class="text-slate-400 text-sm leading-relaxed mb-3">Rebuilt from scratch as part of openMRS 3.0. Ad-hoc patient queries with save and export.</p>
      <div class="flex flex-wrap gap-1 mb-3">
        <span class="font-mono text-xs text-slate-500 border border-slate-700 rounded px-2 py-0.5">TypeScript</span>
        <span class="font-mono text-xs text-slate-500 border border-slate-700 rounded px-2 py-0.5">React</span>
        <span class="font-mono text-xs text-slate-500 border border-slate-700 rounded px-2 py-0.5">Carbon</span>
      </div>
      <a href="https://github.com/openmrs/openmrs-esm-cohortbuilder" target="_blank" rel="noopener" class="font-mono text-accent text-xs no-underline hover:underline">GitHub →</a>
    </div>

    <div class="project-card">
      <div class="font-mono text-accent text-xs mb-1">promiseQ <span class="text-slate-500 float-right">2021</span></div>
      <div class="font-bold text-base mb-2">promiseQ Web App</div>
      <p class="text-slate-400 text-sm leading-relaxed mb-3">ML-powered alarm verification. Real-time alarm updates, human-in-the-loop verification.</p>
      <div class="flex flex-wrap gap-1 mb-3">
        <span class="font-mono text-xs text-slate-500 border border-slate-700 rounded px-2 py-0.5">VueJs</span>
        <span class="font-mono text-xs text-slate-500 border border-slate-700 rounded px-2 py-0.5">Vuetify</span>
        <span class="font-mono text-xs text-slate-500 border border-slate-700 rounded px-2 py-0.5">Firebase</span>
      </div>
      <a href="https://promiseq.com/" target="_blank" rel="noopener" class="font-mono text-accent text-xs no-underline hover:underline">Visit →</a>
    </div>

    <div class="project-card">
      <div class="font-mono text-accent text-xs mb-1">rootcode labs <span class="text-slate-500 float-right">2020–21</span></div>
      <div class="font-bold text-base mb-2">Expert Republic Enterprise</div>
      <p class="text-slate-400 text-sm leading-relaxed mb-3">Expert/customer platform with call logs, payments, and service management.</p>
      <div class="flex flex-wrap gap-1 mb-3">
        <span class="font-mono text-xs text-slate-500 border border-slate-700 rounded px-2 py-0.5">React</span>
        <span class="font-mono text-xs text-slate-500 border border-slate-700 rounded px-2 py-0.5">TypeScript</span>
        <span class="font-mono text-xs text-slate-500 border border-slate-700 rounded px-2 py-0.5">Tailwind</span>
      </div>
    </div>

    <div class="project-card">
      <div class="font-mono text-accent text-xs mb-1">SEF <span class="text-slate-500 float-right">2020</span></div>
      <div class="font-bold text-base mb-2">ScholarX Frontend</div>
      <p class="text-slate-400 text-sm leading-relaxed mb-3">Frontend for the ScholarX mentoring platform connecting mentors and mentees.</p>
      <div class="flex flex-wrap gap-1 mb-3">
        <span class="font-mono text-xs text-slate-500 border border-slate-700 rounded px-2 py-0.5">React</span>
        <span class="font-mono text-xs text-slate-500 border border-slate-700 rounded px-2 py-0.5">TypeScript</span>
        <span class="font-mono text-xs text-slate-500 border border-slate-700 rounded px-2 py-0.5">Ant Design</span>
      </div>
      <a href="https://github.com/sef-global/scholarx-frontend" target="_blank" rel="noopener" class="font-mono text-accent text-xs no-underline hover:underline">GitHub →</a>
    </div>

    <div class="project-card">
      <div class="font-mono text-accent text-xs mb-1">rootcode labs <span class="text-slate-500 float-right">2020</span></div>
      <div class="font-bold text-base mb-2">Aphelia Web</div>
      <p class="text-slate-400 text-sm leading-relaxed mb-3">Marketing site for Aphelia AI — a resume parser powered by ML.</p>
      <div class="flex flex-wrap gap-1 mb-3">
        <span class="font-mono text-xs text-slate-500 border border-slate-700 rounded px-2 py-0.5">React</span>
        <span class="font-mono text-xs text-slate-500 border border-slate-700 rounded px-2 py-0.5">JavaScript</span>
      </div>
      <a href="https://aphelia.ai/" target="_blank" rel="noopener" class="font-mono text-accent text-xs no-underline hover:underline">Visit →</a>
    </div>

    <div class="project-card">
      <div class="font-mono text-accent text-xs mb-1">SEF <span class="text-slate-500 float-right">2020</span></div>
      <div class="font-bold text-base mb-2">SEF Academix</div>
      <p class="text-slate-400 text-sm leading-relaxed mb-3">Frontend for SEF Academix — connecting students with academic opportunities.</p>
      <div class="flex flex-wrap gap-1 mb-3">
        <span class="font-mono text-xs text-slate-500 border border-slate-700 rounded px-2 py-0.5">React</span>
        <span class="font-mono text-xs text-slate-500 border border-slate-700 rounded px-2 py-0.5">TypeScript</span>
        <span class="font-mono text-xs text-slate-500 border border-slate-700 rounded px-2 py-0.5">Ant Design</span>
      </div>
      <a href="https://github.com/sef-global/academix-frontend" target="_blank" rel="noopener" class="font-mono text-accent text-xs no-underline hover:underline">GitHub →</a>
    </div>

    <div class="project-card">
      <div class="font-mono text-accent text-xs mb-1">rootcode labs <span class="text-slate-500 float-right">2020–21</span></div>
      <div class="font-bold text-base mb-2">LRIMS for Afghanistan</div>
      <p class="text-slate-400 text-sm leading-relaxed mb-3">Land Resources Information Management System with map comparisons and export options.</p>
      <div class="flex flex-wrap gap-1 mb-3">
        <span class="font-mono text-xs text-slate-500 border border-slate-700 rounded px-2 py-0.5">React</span>
        <span class="font-mono text-xs text-slate-500 border border-slate-700 rounded px-2 py-0.5">Django</span>
      </div>
    </div>

    <div class="project-card">
      <div class="font-mono text-accent text-xs mb-1">openMRS <span class="text-slate-500 float-right">2020–21</span></div>
      <div class="font-bold text-base mb-2">DHIS2 Connector Module</div>
      <p class="text-slate-400 text-sm leading-relaxed mb-3">Bug fixes and improvements for the openMRS DHIS2 data integration module.</p>
      <div class="flex flex-wrap gap-1 mb-3">
        <span class="font-mono text-xs text-slate-500 border border-slate-700 rounded px-2 py-0.5">JavaScript</span>
        <span class="font-mono text-xs text-slate-500 border border-slate-700 rounded px-2 py-0.5">JSP</span>
        <span class="font-mono text-xs text-slate-500 border border-slate-700 rounded px-2 py-0.5">jQuery</span>
      </div>
      <a href="https://github.com/openmrs/openmrs-module-dhisconnector/pulls?q=is%3Apr+author%3A%40me+is%3Aclosed" target="_blank" rel="noopener" class="font-mono text-accent text-xs no-underline hover:underline">GitHub →</a>
    </div>

  </div>
</section>

<div class="section-divider"></div>
```

- [ ] **Step 2: Verify projects in browser**

Scroll to projects. Expect: 8 cards in 2-col grid. Hover → cyan border + slight lift. Org names cyan, year muted, stack tags dark pill style.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: projects section — 8 cards with stack tags and links"
```

---

## Task 7: Education Section

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add education HTML after projects `section-divider`**

```html
<!-- EDUCATION -->
<section id="education" class="px-6 md:px-10 py-20" style="max-width:820px;margin:0 auto;">
  <div class="section-label">// education</div>
  <h2 class="text-2xl font-extrabold mb-10">Education</h2>

  <div class="bg-surface border border-slate-700 rounded-lg p-6">
    <div class="font-bold text-base mb-1">BSc. Physical Science — ICT</div>
    <div class="text-accent font-semibold text-sm mb-1">University of Sri Jayewardenepura</div>
    <div class="font-mono text-slate-500 text-xs mb-4">2021 – 2024 · Nugegoda, Sri Lanka</div>
    <div class="text-slate-400 text-sm">
      Data Structures &amp; Algorithms &nbsp;·&nbsp; Computer Architecture &nbsp;·&nbsp;
      Software Engineering &nbsp;·&nbsp; Database Systems &amp; Administration
    </div>
  </div>
</section>

<div class="section-divider"></div>
```

- [ ] **Step 2: Verify education in browser**

Scroll to education. Expect: single card, cyan university name, mono date/location, modules in muted text.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: education section"
```

---

## Task 8: Blog Section

**Files:**
- Modify: `index.html` (`fetchBlogs()` already in `js/main.js` from Task 2)

- [ ] **Step 1: Add blog HTML after education `section-divider`**

```html
<!-- BLOG -->
<section id="blog" class="px-6 md:px-10 py-20" style="max-width:820px;margin:0 auto;">
  <div class="section-label">// blog</div>
  <h2 class="text-2xl font-extrabold mb-10">Writing</h2>

  <div id="blog-posts" class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <p class="font-mono text-slate-500 text-sm col-span-3">// Loading posts...</p>
  </div>
</section>

<div class="section-divider"></div>
```

- [ ] **Step 2: Verify blog in browser**

Scroll to blog. Expect: "// Loading posts..." replaces with Medium post cards showing thumbnail, title, excerpt, date, "read more →" link. Hover → cyan border.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: blog section — Medium RSS"
```

---

## Task 9: YouTube Sections

**Files:**
- Modify: `index.html` (`fetchYoutubeVideos()` already in `js/main.js` from Task 2)

- [ ] **Step 1: Add three YouTube sections after blog `section-divider`**

```html
<!-- KNOWLEDGE SHARING -->
<section id="knowledge" class="px-6 md:px-10 py-20" style="max-width:820px;margin:0 auto;">
  <div class="section-label">// knowledge sharing</div>
  <h2 class="text-2xl font-extrabold mb-4">Knowledge Sharing</h2>
  <p class="text-slate-500 text-sm mb-8">Sessions from the SEF Dev Team knowledge sharing series.</p>
  <div id="knowledge-sharing-videos" class="grid grid-cols-1 md:grid-cols-3 gap-4"></div>
  <div class="flex justify-center mt-8">
    <button id="knowledge-sharing-videos-view-more" onclick="fetchYoutubeVideos('knowledge')"
      class="border border-slate-700 hover:border-accent text-slate-400 hover:text-accent font-mono text-sm px-6 py-2.5 rounded transition-colors bg-transparent cursor-pointer">
      Load More
    </button>
  </div>
</section>

<div class="section-divider"></div>

<!-- WEB DEV SESSIONS -->
<section id="web-development" class="px-6 md:px-10 py-20" style="max-width:820px;margin:0 auto;">
  <div class="section-label">// web development</div>
  <h2 class="text-2xl font-extrabold mb-4">Web Development Sessions</h2>
  <p class="text-slate-500 text-sm mb-8">Web development tutorials and walkthroughs.</p>
  <div id="web-development-videos" class="grid grid-cols-1 md:grid-cols-3 gap-4"></div>
  <div class="flex justify-center mt-8">
    <button id="web-development-videos-view-more" onclick="fetchYoutubeVideos('sessions')"
      class="border border-slate-700 hover:border-accent text-slate-400 hover:text-accent font-mono text-sm px-6 py-2.5 rounded transition-colors bg-transparent cursor-pointer">
      Load More
    </button>
  </div>
</section>

<div class="section-divider"></div>

<!-- SIMULATIONS -->
<section id="simulations" class="px-6 md:px-10 py-20" style="max-width:820px;margin:0 auto;">
  <div class="section-label">// simulations</div>
  <h2 class="text-2xl font-extrabold mb-4">Simulations</h2>
  <p class="text-slate-500 text-sm mb-8">Physics and algorithm simulations recreated with Unity.</p>
  <div id="simulation-videos" class="grid grid-cols-1 md:grid-cols-3 gap-4"></div>
  <div class="flex justify-center mt-8">
    <button id="simulation-videos-view-more" onclick="fetchYoutubeVideos('simulations')"
      class="border border-slate-700 hover:border-accent text-slate-400 hover:text-accent font-mono text-sm px-6 py-2.5 rounded transition-colors bg-transparent cursor-pointer">
      Load More
    </button>
  </div>
</section>

<div class="section-divider"></div>
```

- [ ] **Step 2: Verify YouTube sections in browser**

Scroll to each YouTube section. Expect: video cards load with thumbnails, 2-line-clamp titles, "▶ Watch Now" in cyan. "Load More" hides when playlist exhausted.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: YouTube sections — knowledge sharing, web dev, simulations"
```

---

## Task 10: Footer + Back-to-Top

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add footer and back-to-top before `<script src="js/main.js">`**

```html
<!-- FOOTER -->
<footer class="border-t border-slate-800 py-8 px-6 text-center font-mono text-slate-500 text-xs">
  <p>
    anjula<a href="#hero" class="text-accent no-underline hover:underline">.</a>tech
    &nbsp;·&nbsp;
    <a href="https://github.com/anjula-sack" target="_blank" rel="noopener" class="text-slate-500 hover:text-accent no-underline transition-colors">github</a>
    &nbsp;·&nbsp;
    <a href="https://linkedin.com/in/anjula-sack" target="_blank" rel="noopener" class="text-slate-500 hover:text-accent no-underline transition-colors">linkedin</a>
    &nbsp;·&nbsp;
    <a href="https://www.medium.com/@anjulashanaka" target="_blank" rel="noopener" class="text-slate-500 hover:text-accent no-underline transition-colors">medium</a>
  </p>
  <p class="mt-2 text-slate-700">Built with HTML · Tailwind CSS · vanilla JS</p>
</footer>

<!-- BACK TO TOP -->
<a href="#" id="back-to-top" aria-label="Back to top">↑</a>
```

- [ ] **Step 2: Verify footer and back-to-top in browser**

Scroll to bottom — footer visible with muted links. Scroll past 300px — back-to-top button appears bottom-right. Click — smooth scroll to top.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: footer and back-to-top"
```

---

## Task 11: Final Smoke Test + Cleanup

**Files:**
- Verify: `index.html` (no old lib tags)
- Verify: `js/main.js` (no jQuery/old lib calls)

- [ ] **Step 1: Confirm old lib tags are absent from `index.html`**

Open `index.html` and confirm none of these strings exist:
- `lib/bootstrap`
- `lib/jquery`
- `lib/owlcarousel`
- `lib/superfish`
- `lib/easing`
- `lib/modal-video`
- `lib/wow`
- `lib/font-awesome`
- `lib/animate`
- `contactform/contactform.js`

Only `<script>` tags in `<body>` should be `js/main.js`.

- [ ] **Step 2: Confirm `js/main.js` has no jQuery**

Open `js/main.js` and confirm:
- No `$()` or `jQuery()` calls
- No `new WOW()`, `.superfish()`, `new ModalVideo()`, `.owlCarousel()`
- `fetchBlogs()` uses `fetch()`
- `fetchYoutubeVideos()` uses `await fetch()`

- [ ] **Step 3: Full page smoke test in browser**

- [ ] Page background is `#0f172a`
- [ ] Nav: "anjula." logo with cyan dot, 6 links on desktop
- [ ] Hero: blinking cursor, "Anjula" white + "Samarasinghe" cyan, 2 CTA buttons, 4 social links
- [ ] Experience: 8 entries, "current" badges on Tilli and SEF
- [ ] Skills: 4 categories, featured tags cyan
- [ ] Projects: 8 cards in 2-col grid, hover lift + cyan border
- [ ] Education: 1 card with cyan university name
- [ ] Blog: Medium posts loaded dynamically
- [ ] 3 YouTube sections: videos loaded, Load More works
- [ ] Footer visible with links
- [ ] Back-to-top appears on scroll, click scrolls to top
- [ ] Mobile: hamburger opens side menu, links close it
- [ ] No console errors

- [ ] **Step 4: Final commit**

```bash
git add index.html js/main.js .gitignore css/style.css
git commit -m "feat: complete portfolio redesign — dark theme, Tailwind CDN, vanilla JS"
```
