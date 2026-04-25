// ─── Nav scroll ────────────────────────────────────────────────────────────
const nav       = document.getElementById('main-nav');
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 60);
  backToTop?.classList.toggle('visible', window.scrollY > 300);
});

// ─── Mobile nav ────────────────────────────────────────────────────────────
const hamburger     = document.getElementById('hamburger');
const mobileMenu    = document.getElementById('mobile-menu');
const mobileOverlay = document.getElementById('mobile-overlay');

function openMobileNav() {
  mobileMenu.classList.add('open');
  mobileOverlay.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
}
function closeMobileNav() {
  mobileMenu.classList.remove('open');
  mobileOverlay.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
}

hamburger.addEventListener('click', openMobileNav);
mobileOverlay.addEventListener('click', closeMobileNav);
document.querySelectorAll('.mobile-nav-link').forEach(link =>
  link.addEventListener('click', closeMobileNav)
);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
    closeMobileNav();
    hamburger.focus();
  }
});

// ─── Back to top ───────────────────────────────────────────────────────────
if (backToTop) {
  backToTop.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ─── XSS helpers ───────────────────────────────────────────────────────────
function escHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function safeUrl(url) {
  try {
    const u = new URL(url);
    return (u.protocol === 'https:' || u.protocol === 'http:') ? url : '#';
  } catch { return '#'; }
}

// ─── Blog: Medium RSS ──────────────────────────────────────────────────────
function fetchBlogs() {
  const container = document.getElementById('blog-posts');
  if (!container) return;

  fetch('https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@anjulashanaka')
    .then(res => res.json())
    .then(data => {
      if (!Array.isArray(data?.items)) throw new Error('Invalid RSS response');
      const posts = data.items.filter(item => item.categories.length > 0);
      container.innerHTML = posts.map(item => {
        const excerpt = item.content.replace(/<[^>]+>/g, '').slice(0, 280) + '…';
        const date    = item.pubDate.slice(0, 10);
        const thumb   = item.thumbnail && safeUrl(item.thumbnail) !== '#' ? safeUrl(item.thumbnail) : '';
        return `
          <div class="blog-card">
            ${thumb ? `<a href="${safeUrl(item.link)}" target="_blank" rel="noopener"><img src="${thumb}" alt="${escHtml(item.title)}" loading="lazy"></a>` : ''}
            <div class="blog-card-body">
              <a class="blog-card-title" href="${safeUrl(item.link)}" target="_blank" rel="noopener">${escHtml(item.title)}</a>
              <p class="blog-card-excerpt">${escHtml(excerpt)}</p>
              <div class="blog-card-meta">
                <span>${escHtml(date)}</span>
                <a href="${safeUrl(item.link)}" target="_blank" rel="noopener">read more →</a>
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
    const items = data.items;
    if (!Array.isArray(items)) throw new Error(`YouTube API error: ${data?.error?.message ?? 'unknown'}`);
    ytPageTokens[type] = data.nextPageToken || null;

    const container = document.getElementById(section);
    if (!container) return;

    container.insertAdjacentHTML('beforeend', items.map(item => `
      <div class="video-card">
        <img src="${safeUrl(item.snippet.thumbnails.medium.url)}" alt="${escHtml(item.snippet.title)}" loading="lazy">
        <div class="video-card-body">
          <div class="video-card-title">${escHtml(item.snippet.title)}</div>
          <div class="video-card-desc">${escHtml(item.snippet.description)}</div>
          <a class="video-card-link"
             href="https://youtube.com/watch?v=${escHtml(item.snippet.resourceId?.videoId ?? '')}"
             target="_blank" rel="noopener">▶ Watch Now</a>
        </div>
      </div>`).join(''));

    if (!data.nextPageToken) {
      const btn = document.getElementById(`${section}-view-more`);
      if (btn) btn.style.display = 'none';
    }
  } catch {
    const container = document.getElementById(config[type]?.section);
    if (container && !container.hasChildNodes()) {
      container.innerHTML = '<p class="font-mono text-slate-500 text-sm col-span-3">// Could not load videos.</p>';
    }
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
