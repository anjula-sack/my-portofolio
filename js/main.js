// ─── Nav scroll ────────────────────────────────────────────────────────────
const nav       = document.getElementById('main-nav');
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
