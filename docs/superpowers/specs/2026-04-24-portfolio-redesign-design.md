# Portfolio Redesign — Design Spec
**Date:** 2026-04-24

## Decisions

| Decision | Choice |
|---|---|
| Visual style | Dark & Technical |
| Layout | Full-viewport hero + sections scroll below |
| Accent color | Cyan `#22d3ee` |
| Implementation | Full HTML rebuild + Tailwind CSS CDN + vanilla JS |
| Sections | All (Hero, Experience, Skills, Projects, Education, Blog, Knowledge Sharing, Web Dev Sessions, Simulations) |

---

## Color Palette

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0f172a` | Page background |
| `--surface` | `#1e293b` | Cards, timeline items |
| `--border` | `#334155` | All borders |
| `--text` | `#f8fafc` | Primary text |
| `--text-secondary` | `#94a3b8` | Body text, bullets |
| `--text-muted` | `#475569` | Dates, labels, socials |
| `--accent` | `#22d3ee` | Cyan — prompts, highlights, CTAs |
| `--accent-dim` | `rgba(34,211,238,0.12)` | Tag backgrounds, hover fills |

---

## Typography

- **Body font:** Inter (Google Fonts) — weights 300–900
- **Mono font:** JetBrains Mono — used for terminal prompts, dates, skill tags, nav links
- **H1 (hero):** 900 weight, `clamp(2.8rem, 7vw, 5rem)`, letter-spacing `-0.03em`
- **Section titles:** 800 weight, `1.75rem`
- **Section labels:** JetBrains Mono, `0.72rem`, uppercase, `letter-spacing: 0.14em`, cyan

---

## Structure

### Navigation
- Fixed top, `height: 56px`
- `background: rgba(15,23,42,0.85)` + `backdrop-filter: blur(12px)`
- Bottom border `1px solid #334155`
- Logo: `anjula.` — dot in cyan
- Links: experience · skills · projects · education · blog · videos
- Links font: Inter 500, `0.82rem`, muted — cyan on hover

### Hero Section
- `min-height: 100vh`, centered vertically, max-width `820px`
- Subtle dot-grid background: `radial-gradient` at 32px intervals, 6% cyan opacity
- Terminal prompt: `> whoami` in JetBrains Mono cyan, blinking cursor
- H1: "Anjula" (white) + "Samarasinghe" (cyan), two lines
- Role line: "Software Engineer · GSoC '22 · CTO @SEF"
- Bio: 1–2 sentences, `max-width: 520px`
- CTA buttons: [View Work] (cyan filled) + [Download CV] (ghost outline)
- Social links: GitHub · LinkedIn · Medium · YouTube — mono font, `→` prefix, muted → cyan on hover
- Scroll hint: bouncing "scroll ↓" at bottom center

### Experience Section
- Label: `// experience` · Title: "Where I've Worked"
- Two-column timeline grid: `1fr 3fr`
- Left col: period (mono), company name (cyan), location (muted)
- Right col: role title (bold), bullet list with `▸` accent markers
- Current roles: `[current]` badge — cyan bg-dim, cyan border
- Entries: ongoing roles first (by start date desc), then ended roles (by end date desc)
  1. Software Engineer — Tilli Kids Inc. (Sept 2023–Present, SF)
  2. Chief Technical Officer — SEF (Jul 2022–Present)
  3. GSoC Mentor — openMRS (May–Sep 2023)
  4. Software Engineer — ASCII Corporation (Nov 2022–Jun 2023, Colombo)
  5. Community Developer — Lanka Software Foundation (Jul 2022–Jul 2023)
  6. GSoC Contributor — openMRS (May–Sep 2022)
  7. Software Developer — promiseQ (Jul 2021–Dec 2022, Berlin)
  8. Software Engineer Intern — rootcode labs (Jul 2020–Jul 2021, Colombo)

### Skills Section
- Label: `// skills` · Title: "What I Work With"
- Four categories with mono category labels:
  - **Languages & Libraries:** TypeScript★, React.js★, JavaScript, Java, Python, SQL, React Query, Redux Toolkit, RHF, React Testing Library
  - **Frameworks:** Next.js★, Vue.js, Node.js, Flask, Tailwind CSS, Playwright
  - **Developer Tools:** Git, Docker, GitHub Actions, Nginx
  - **Platforms & Services:** GCP, AWS, Firebase
- ★ = featured tag (cyan border + cyan text + dim bg)
- All tags: JetBrains Mono, `0.8rem`, hover → cyan

### Projects Section
- Label: `// projects` · Title: "Things I've Built"
- 2-column card grid
- Each card: surface bg, border, hover → cyan border + `-2px` translateY
- Card fields: org name (cyan mono), project name (bold), year (muted mono, float right), description, stack tags, links
- Projects:
  1. Cohort Builder — openMRS (2022) — TypeScript, React, Carbon
  2. promiseQ Web App — promiseQ (2021) — VueJs, Vuetify, Firebase
  3. Expert Republic Enterprise — rootcode labs (2020–21) — React, TypeScript, Tailwind
  4. ScholarX Frontend — SEF (2020) — React, TypeScript, Ant Design
  5. Aphelia Web — rootcode labs (2020) — React, JavaScript
  6. SEF Academix — SEF (2020) — React, TypeScript, Ant Design
  7. DHIS2 Connector — openMRS (2020–21) — JavaScript, JSP, jQuery
  8. LRIMS for Afghanistan — rootcode labs (2020–21) — map comparisons, export

### Education Section
- Label: `// education` · Title: "Education"
- Single card (surface bg, border)
- BSc. Physical Science — ICT, University of Sri Jayewardenepura, 2021–2024, Nugegoda Sri Lanka
- Modules: Data Structures & Algorithms, Computer Architecture, Software Engineering, Database Systems

### Blog Section
- Label: `// blog` · Title: "Writing"
- Dynamic: load latest Medium posts via RSS-to-JSON API
- Cards showing: title, published date, read time, link
- "View More" button — same style as current

### Knowledge Sharing / Web Dev Sessions / Simulations
- Three separate sections, each with label + title
- Dynamic: load YouTube videos via Google API (keep existing `fetchYoutubeVideos` JS)
- Video cards in responsive grid
- "View More" button per section

### Footer
- `border-top: 1px solid #334155`
- `anjula.tech · github · linkedin · medium` — mono, muted
- "Built with HTML · Tailwind CSS · vanilla JS"

---

## Implementation Notes

- **Tailwind:** load via CDN `<script src="https://cdn.tailwindcss.com">` with custom config block for CSS vars
- **Custom CSS:** single `css/style.css` — CSS vars, animations (blink cursor, scroll bounce), hover transitions. Tailwind handles layout/spacing.
- **JS:** keep `js/main.js` for YouTube API + Medium RSS. No other JS framework.
- **Remove:** Bootstrap, jQuery, owl carousel, superfish, wow.js, easing, modal-video libs. Replace with CSS transitions.
- **Keep:** Google Analytics (`G-ETPDNG19ZF`), Buy Me a Coffee widget, favicon
- **Meta tags:** update title to "Anjula Samarasinghe | Software Engineer", update description
- **Images:** `img/image.png` (hero profile) and `img/favicon.ico` kept. All icon SVGs from `img/icons/` no longer needed (replaced by text tags).
- **`.gitignore`:** add `.superpowers/`

---

## Files Changed

| File | Action |
|---|---|
| `index.html` | Full rewrite |
| `css/style.css` | Full rewrite |
| `js/main.js` | Keep, minor updates (section IDs may change) |
| `lib/` directory | Remove Bootstrap, jQuery, owl carousel, superfish, easing, modal-video, wow |
| `.gitignore` | Add `.superpowers/` |
