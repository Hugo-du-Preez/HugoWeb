const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;

// ===== SMOOTH SCROLL (in-page only) =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  });
});

// ===== DYNAMIC YEAR IN FOOTER =====
const yearElements = document.querySelectorAll('.current-year');
yearElements.forEach(el => {
    el.textContent = new Date().getFullYear();
});

// ===== LIGHT / DARK MODE TOGGLE =====
const themeToggleBtn = document.querySelector('.theme-toggle-btn');
const rootEl = document.documentElement;

function setTheme(theme) {
    rootEl.setAttribute('data-theme', theme);
    try {
        localStorage.setItem('theme', theme);
    } catch {
        // ignore (e.g. storage blocked)
    }

    if (!themeToggleBtn) return;
    const isLight = theme === 'light';
    themeToggleBtn.setAttribute('aria-pressed', String(isLight));
    themeToggleBtn.setAttribute(
        'aria-label',
        isLight ? 'Switch to dark mode' : 'Switch to light mode'
    );
}

let savedTheme = null;
try {
    savedTheme = localStorage.getItem('theme');
} catch {
    // ignore
}

const initialTheme = savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'dark';
setTheme(initialTheme);

themeToggleBtn?.addEventListener('click', () => {
    const current = rootEl.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    setTheme(current === 'dark' ? 'light' : 'dark');
});

// ===== NAVIGATION BACK LINK =====
const backLinks = document.querySelectorAll('.back-link');
backLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        if (window.history.length > 1) {
            e.preventDefault();
            window.history.back();
        }
    });
});

// Project hover effects are handled in CSS to avoid conflicts

// ===== CERTIFICATION BADGE ANIMATION =====
// (cert animations removed — certifications now have their own section)

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

if (!prefersReducedMotion) {
  document.querySelectorAll('.project-card, .blog-card, .edu-card').forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// ===== ARCHITECTURE DIAGRAM ZOOM =====
const archDiagrams = document.querySelectorAll('.architecture-diagram');
archDiagrams.forEach(diagram => {
    diagram.addEventListener('click', function() {
        // Create modal for full-size view
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(15, 23, 42, 0.95);
            z-index: 3000;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: zoom-out;
            padding: 2rem;
        `;
        
        const img = document.createElement('img');
        img.src = this.src;
        img.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
            border-radius: 12px;
        `;
        
        modal.appendChild(img);
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        modal.addEventListener('click', function() {
            document.body.removeChild(modal);
            document.body.style.overflow = 'auto';
        });
    });
    
    diagram.style.cursor = 'zoom-in';
});

// ===== YOUTUBE PLACEHOLDER HANDLING =====
document.querySelectorAll('iframe[src*="youtube.com/embed/"]').forEach((frame) => {
  const src = frame.getAttribute('src') || '';
  if (!src.includes('YOUR_VIDEO_ID')) return;

  const container = frame.closest('.video-container');
  if (!container) return;

  container.innerHTML = `
    <div style="height:100%; display:flex; align-items:center; justify-content:center; text-align:center; padding:1.5rem;">
      <div>
        <div style="font-size:2rem; margin-bottom:0.75rem;">🎥</div>
        <div style="font-weight:800; margin-bottom:0.25rem;">Walkthrough video coming soon</div>
        <div style="color:#94A3B8; font-size:0.95rem;">Replace <code>YOUR_VIDEO_ID</code> in the project page to enable the embed.</div>
      </div>
    </div>
  `;
});

// Open external links in a new tab
document.querySelectorAll('a[href^="http://"], a[href^="https://"]').forEach((link) => {
  link.setAttribute('target', '_blank');
  link.setAttribute('rel', 'noopener noreferrer');
});

// Avoid noisy logging in production

// ===== MOBILE MENU TOGGLE =====
const nav = document.querySelector('nav');
const navLinks = document.querySelector('.nav-links');

function getIndexHref(hash) {
  const path = window.location.pathname.replace(/\\/g, '/');
  const isNested = /\/(blog|projects)\//.test(path);
  const base = isNested ? '../index.html' : 'index.html';
  return `${base}${hash}`;
}

function ensureNavLink(label, href, { beforeHref } = {}) {
  if (!navLinks) return;
  const targetHash = (() => {
    try { return new URL(href, window.location.href).hash || ''; } catch { return ''; }
  })();

  const existing = Array.from(navLinks.querySelectorAll('a')).find((a) => {
    const raw = a.getAttribute('href') || '';
    if (raw === href) return true;
    try {
      const parsed = new URL(raw, window.location.href);
      return targetHash && parsed.hash === targetHash;
    } catch {
      return false;
    }
  });
  if (existing) return;

  const li = document.createElement('li');
  const a = document.createElement('a');
  a.textContent = label;
  a.href = href;
  li.appendChild(a);

  if (beforeHref) {
    const beforeAnchor = Array.from(navLinks.querySelectorAll('a')).find((el) => (el.getAttribute('href') || '') === beforeHref);
    const beforeLi = beforeAnchor?.closest('li') ?? null;
    if (beforeLi && beforeLi.parentElement === navLinks) {
      navLinks.insertBefore(li, beforeLi);
      return;
    }
  }

  navLinks.appendChild(li);
}

function ensureCtaLast() {
  if (!navLinks) return;
  const cta = navLinks.querySelector('a.nav-cta');
  const li = cta?.closest('li') ?? null;
  if (li && li.parentElement === navLinks) navLinks.appendChild(li);
}

function normalizeNavOrder() {
  if (!navLinks) return;

  const desired = [
    { label: 'Home', hash: '#top' },
    { label: 'Projects', hash: '#projects' },
    { label: 'Skills', hash: '#skills' },
    { label: 'Certifications', hash: '#certifications' },
    { label: 'Education', hash: '#education' },
{ label: 'Blog', hash: '#blog' }
  ];
  const isMobile = window.matchMedia('(max-width: 968px)').matches;
  if (isMobile) {
    desired.push({ label: '🤖 Ask Hugo\'s AI', onclick: 'toggleChat(); return false;', href: '#' });
  }

  // Ensure links exist
  desired.forEach(({ label, hash }) => ensureNavLink(label, getIndexHref(hash)));

  // Build map of hash -> <li>
  const liByHash = new Map();
  Array.from(navLinks.querySelectorAll('a')).forEach((a) => {
    const li = a.closest('li');
    if (!li) return;
    try {
      const parsed = new URL(a.getAttribute('href') || '', window.location.href);
      if (parsed.hash) liByHash.set(parsed.hash, li);
    } catch {
      // ignore
    }
  });

  // Append in correct order (moves existing nodes)
  desired.forEach(({ hash }) => {
    const li = liByHash.get(hash);
    if (li && li.parentElement === navLinks) navLinks.appendChild(li);
  });

  ensureCtaLast();
}

function ensureMobileMenuButton() {
  if (!nav || !navLinks) return null;

  let btn = nav.querySelector('.mobile-menu-btn');
  if (btn) return btn;

  btn = document.createElement('button');
  btn.className = 'mobile-menu-btn';
  btn.setAttribute('aria-label', 'Toggle menu');
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = '<span></span><span></span><span></span>';

  nav.insertBefore(btn, navLinks);
  return btn;
}

const mobileMenuBtn = ensureMobileMenuButton();

if (navLinks) normalizeNavOrder();

if (mobileMenuBtn && navLinks) {
  mobileMenuBtn.addEventListener('click', function () {
    const isActive = this.classList.toggle('active');
    navLinks.classList.toggle('active', isActive);
    mobileMenuBtn.setAttribute('aria-expanded', String(isActive));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenuBtn.classList.remove('active');
      navLinks.classList.remove('active');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

// ===== SCROLL TO TOP BUTTON =====
const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '↑';
scrollTopBtn.className = 'scroll-top-btn';
scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
document.body.appendChild(scrollTopBtn);

const mobileScrollToTopMq = window.matchMedia?.('(max-width: 640px)') ?? { matches: false };
let mobileScrollHideTimer = null;

function setScrollTopVisible(isVisible) {
  scrollTopBtn.classList.toggle('visible', Boolean(isVisible));
}

function handleScrollTopVisibility() {
  const y = window.pageYOffset || document.documentElement.scrollTop || 0;
  const isMobile = Boolean(mobileScrollToTopMq.matches);

  if (!isMobile) {
    // Desktop/tablet: standard behavior (persistent once you scroll far enough)
    setScrollTopVisible(y > 500);
    return;
  }

  // Mobile: show while actively scrolling (scroll event updates timer),
  // then hide after 1s of no scrolling.
  if (y <= 200) {
    setScrollTopVisible(false);
    if (mobileScrollHideTimer) clearTimeout(mobileScrollHideTimer);
    mobileScrollHideTimer = null;
    return;
  }

  setScrollTopVisible(true);
  if (mobileScrollHideTimer) clearTimeout(mobileScrollHideTimer);
  mobileScrollHideTimer = setTimeout(() => setScrollTopVisible(false), 700);
}

window.addEventListener('scroll', handleScrollTopVisibility, { passive: true });
mobileScrollToTopMq.addEventListener?.('change', handleScrollTopVisibility);
handleScrollTopVisibility();

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
  });
});

// ===== YOUTUBE LINK NORMALIZATION =====
function extractYouTubeId(input) {
  try {
    const url = new URL(input);
    const host = url.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      return url.pathname.split('/').filter(Boolean)[0] || null;
    }

    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
      if (url.pathname === '/watch') return url.searchParams.get('v');
      if (url.pathname.startsWith('/embed/')) return url.pathname.split('/')[2] || null;
      if (url.pathname.startsWith('/shorts/')) return url.pathname.split('/')[2] || null;
    }
  } catch {
    // ignore
  }

  return null;
}

function toEmbedUrl(videoId) {
  // Build a broadly compatible embed URL (iOS Safari + Android Chrome).
  const url = new URL(`https://www.youtube.com/embed/${encodeURIComponent(videoId)}`);
  url.searchParams.set('playsinline', '1');
  url.searchParams.set('rel', '0');
  url.searchParams.set('modestbranding', '1');
  try {
    // Helps some environments that validate embed context.
    url.searchParams.set('origin', window.location.origin);
  } catch {
    // ignore
  }
  return url.toString();
}

// ===== CLICK-TO-LOAD YOUTUBE (no iframe requests until user click) =====
function normalizeYouTubeVideoId(input) {
  const raw = String(input ?? '').trim();
  if (!raw || raw.includes('YOUR_VIDEO_ID')) return null;

  // Accept either a plain video id or a full youtube URL.
  // Examples:
  // - dQw4w9WgXcQ
  // - https://youtu.be/dQw4w9WgXcQ
  // - https://www.youtube.com/watch?v=dQw4w9WgXcQ
  // - https://www.youtube.com/embed/dQw4w9WgXcQ
  const patterns = [
    /youtu\.be\/([^?&/]+)/i,
    /youtube\.com\/watch\?v=([^?&/]+)/i,
    /youtube\.com\/watch\?.*&v=([^?&/]+)/i,
    /youtube\.com\/embed\/([^?&/]+)/i,
    /youtube\.com\/shorts\/([^?&/]+)/i,
  ];

  for (const re of patterns) {
    const match = raw.match(re);
    if (match?.[1]) return match[1];
  }

  // If it looks like an ID already, accept it.
  if (/^[a-zA-Z0-9_-]{6,}$/.test(raw) && !raw.includes('/')) return raw;

  return null;
}

document.querySelectorAll('.youtube-click-to-load').forEach((wrapper) => {
  wrapper.addEventListener('click', () => {
    const videoId = normalizeYouTubeVideoId(wrapper.getAttribute('data-youtube-id'));
    if (!videoId) return;
    if (wrapper.dataset.loaded === 'true') return;

    const container = wrapper.closest('.video-container');
    if (!container) return;

    wrapper.dataset.loaded = 'true';
    container.innerHTML = '';

    const iframe = document.createElement('iframe');
    iframe.src = `${toEmbedUrl(videoId)}&autoplay=1`;
    iframe.title = 'Project Walkthrough';
    iframe.loading = 'eager';
    iframe.setAttribute(
      'allow',
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
    );
    iframe.setAttribute('allowfullscreen', '');

    container.appendChild(iframe);
  });

  wrapper.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    wrapper.click();
  });
});

document.querySelectorAll('iframe').forEach((frame) => {
  const src = frame.getAttribute('src') || '';
  if (!src) return;

  const id = extractYouTubeId(src);
  if (!id) return;

  // Convert watch/shorts/youtu.be URLs to embeddable format
  frame.setAttribute('src', toEmbedUrl(id));
  frame.setAttribute('loading', frame.getAttribute('loading') || 'lazy');

  // Always set allow list for consistent mobile playback.
  frame.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
  frame.setAttribute('allowfullscreen', '');
});

// (intentionally no console logging)
// ===== AI CHATBOT =====
let chatOpen = false;
let messageHistory = [];
let isRateLimited = false;
let rateLimitResetTime = 0;

function toggleChat() {
    chatOpen = !chatOpen;
    const widget = document.getElementById('chat-widget');
    const toggle = document.getElementById('chat-toggle');
    widget.style.display = chatOpen ? 'flex' : 'none';
    toggle.style.display = chatOpen ? 'none' : 'flex';
    if (chatOpen) document.getElementById('chat-input').focus();
}

function setRateLimit(seconds) {
    isRateLimited = true;
    rateLimitResetTime = Date.now() + (seconds * 1000);
    const sendBtn = document.getElementById('chat-send-btn');
    const warning = document.getElementById('chat-rate-warning');
    const input = document.getElementById('chat-input');

    sendBtn.disabled = true;
    warning.style.display = 'block';
    input.placeholder = `Wait ${seconds}s before next message...`;

    const countdown = setInterval(() => {
        const remaining = Math.ceil((rateLimitResetTime - Date.now()) / 1000);
        if (remaining <= 0) {
            clearInterval(countdown);
            isRateLimited = false;
            sendBtn.disabled = false;
            warning.style.display = 'none';
            input.placeholder = 'Ask me anything...';
        } else {
            input.placeholder = `Wait ${remaining}s before next message...`;
        }
    }, 1000);
}

async function sendMessage() {
    if (isRateLimited) return;

    const input = document.getElementById('chat-input');
    const messages = document.getElementById('chat-messages');
    const text = input.value.trim();
    if (!text) return;

    // Add user message
    messages.innerHTML += `<div class="chat-user-msg">${escapeHtml(text)}</div>`;
    input.value = '';
    messages.scrollTop = messages.scrollHeight;

    // Add to history
    messageHistory.push({ role: 'user', content: text });

    // Show typing
    const typingId = 'typing-' + Date.now();
    messages.innerHTML += `<div id="${typingId}" class="chat-bot-msg chat-typing">Thinking...</div>`;
    messages.scrollTop = messages.scrollHeight;

    try {
        const response = await fetch('/.netlify/functions/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: text,
                history: messageHistory.slice(-6)
            })
        });

        const data = await response.json();
        document.getElementById(typingId).remove();

        // Handle rate limiting from server
        if (response.status === 429) {
            const retryAfter = data.error?.match(/(\d+)\s*seconds/)?.[1] || 60;
            setRateLimit(parseInt(retryAfter));
            messages.innerHTML += `<div class="chat-bot-msg chat-rate-error">⚠️ ${escapeHtml(data.error || 'Rate limit exceeded. Please wait.')}</div>`;
            return;
        }

        if (data.error) throw new Error(data.error);

        // Add bot response
        messages.innerHTML += `<div class="chat-bot-msg">${escapeHtml(data.reply)}</div>`;
        messageHistory.push({ role: 'assistant', content: data.reply });

    } catch (error) {
        document.getElementById(typingId).remove();
        messages.innerHTML += `<div class="chat-bot-msg chat-error">❌ Error: ${escapeHtml(error.message)}</div>`;
    }

    messages.scrollTop = messages.scrollHeight;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize chat toggle button on load
document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('chat-toggle');
    if (toggle) toggle.style.display = 'flex';
});