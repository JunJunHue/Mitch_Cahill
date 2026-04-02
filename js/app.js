/**
 * app.js — Rendering engine for the portfolio
 *
 * Reads from window.portfolioState.data (loaded from data.js + localStorage)
 * and builds each section of the page.
 *
 * You don't need to edit this file to update content — use data.js or Edit Mode.
 */

/* ══════════════════════════════════════════════════════════
   STATE
══════════════════════════════════════════════════════════ */

window.portfolioState = {
  data: null,

  load() {
    const saved = localStorage.getItem('portfolio_data');
    if (saved) {
      try {
        this.data = JSON.parse(saved);
        return;
      } catch (e) {
        console.warn('Saved data corrupt, using defaults');
      }
    }
    this.data = JSON.parse(JSON.stringify(PORTFOLIO_DATA));
  },

  save() {
    localStorage.setItem('portfolio_data', JSON.stringify(this.data));
  },

  reset() {
    localStorage.removeItem('portfolio_data');
    this.data = JSON.parse(JSON.stringify(PORTFOLIO_DATA));
  },
};

portfolioState.load();

/* ══════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════ */
const $ = (id) => document.getElementById(id);

function setHTML(id, html) { const el = $(id); if (el) el.innerHTML = html; }
function setText(id, txt)  { const el = $(id); if (el) el.textContent = txt || ''; }

function tagClass(type = '') {
  const map = {
    'Finance':          'tag-finance',
    'VC/Investing':     'tag-vc-investing',
    'Product':          'tag-product',
    'Entrepreneurship': 'tag-entrepreneurship',
    'Operations':       'tag-operations',
  };
  return map[type] || 'tag-default';
}

function cardControls(section, id) {
  return `
    <div class="card-controls">
      <button class="cc-btn"     onclick="openEditCard('${section}','${id}')"   title="Edit">✏</button>
      <button class="cc-btn del" onclick="confirmDeleteCard('${section}','${id}')" title="Delete">✕</button>
    </div>`;
}

/* ══════════════════════════════════════════════════════════
   RENDER FUNCTIONS
══════════════════════════════════════════════════════════ */

function renderNav() {
  const d = portfolioState.data.personal;
  const initials = d.name.split(' ').map(w => w[0]).join('');
  const logo = document.querySelector('.logo-initials');
  if (logo) logo.textContent = initials;
  document.title = `${d.name} — Portfolio`;
}

function renderHero() {
  const d  = portfolioState.data;
  const p  = d.personal;

  setText('hero-eyebrow', p.subtitle);
  setText('hero-name-first', p.name.split(' ')[0] || '');
  setText('hero-name-last',  p.name.split(' ').slice(1).join(' ') || '');
  setText('hero-tagline', p.tagline);
  setText('hc-name', p.name);
  setText('hc-title', p.title);

  const resumeBtn = $('resume-btn');
  if (resumeBtn) resumeBtn.href = p.resumeUrl || '#';

  // Stats card
  setHTML('hc-stats', (d.heroStats || []).map(s => `
    <div class="hc-stat">
      <div class="hc-stat-val">${s.value}</div>
      <div class="hc-stat-label">${s.label}</div>
    </div>
  `).join(''));

  // Tags
  const tags = ['Finance', 'VC/PE', 'Product Mgmt', 'Data Science'];
  setHTML('hc-tags', tags.map(t => `<span class="hc-tag">${t}</span>`).join(''));
}

function renderExperience() {
  const items = portfolioState.data.experience;
  if (!items.length) {
    setHTML('experience-list', '<p class="no-items">No experience entries yet.</p>');
    return;
  }
  setHTML('experience-list', items.map((item, i) => `
    <div class="tl-item fade-up card-wrap" data-id="${item.id}" data-section="experience" style="transition-delay:${i*90}ms">
      <div class="tl-dot"><div class="tl-dot-inner"></div></div>
      <div class="tl-card">
        <div class="tl-top">
          <div class="tl-company editable" data-field="experience.${i}.company">${item.company}</div>
          <div style="display:flex;align-items:center;gap:8px;">
            <span class="tl-type-tag ${tagClass(item.type)} editable" data-field="experience.${i}.type">${item.type || 'Work'}</span>
            <span class="tl-period editable" data-field="experience.${i}.period">${item.period}</span>
          </div>
        </div>
        <div class="tl-meta">
          <span class="tl-role editable" data-field="experience.${i}.role">${item.role}</span>
          <span style="color:var(--cream-dark)">·</span>
          <span class="tl-location editable" data-field="experience.${i}.location">${item.location}</span>
        </div>
        <ul class="tl-bullets">
          ${item.bullets.map((b, bi) => `
            <li class="tl-bullet editable" data-field="experience.${i}.bullets.${bi}">${b}</li>
          `).join('')}
        </ul>
        ${cardControls('experience', item.id)}
      </div>
    </div>
  `).join(''));
}

function renderLeadership() {
  const items = portfolioState.data.leadership;
  if (!items.length) {
    setHTML('leadership-list', '<p class="no-items">No activities yet.</p>');
    return;
  }
  setHTML('leadership-list', items.map((item, i) => `
    <div class="lead-card card-wrap fade-up" data-id="${item.id}" data-section="leadership" style="transition-delay:${i*60}ms">
      <div class="lc-top">
        <div class="lc-left">
          <div class="lc-tag ${tagClass(item.type)}">${item.type || 'Club'}</div>
          <div class="lc-org editable" data-field="leadership.${i}.organization">${item.organization}</div>
          <div class="lc-role editable" data-field="leadership.${i}.role">${item.role}</div>
        </div>
        <span class="lc-period editable" data-field="leadership.${i}.period">${item.period}</span>
      </div>
      <ul class="lc-bullets">
        ${item.bullets.slice(0,2).map((b, bi) => `
          <li class="lc-bullet editable" data-field="leadership.${i}.bullets.${bi}">${b}</li>
        `).join('')}
        ${item.bullets.length > 2 ? `
          <button class="lc-more" onclick="expandBullets(this, ${JSON.stringify(item.bullets.slice(2)).replace(/"/g,'&quot;')})">
            +${item.bullets.length - 2} more
          </button>
        ` : ''}
      </ul>
      ${cardControls('leadership', item.id)}
    </div>
  `).join(''));
}

function renderEducation() {
  const items = portfolioState.data.education;
  setHTML('education-list', items.map((item, i) => `
    <div class="edu-card card-wrap fade-up" data-id="${item.id}" style="transition-delay:${i*100}ms">
      <div class="edu-top">
        <div>
          <div class="edu-school editable" data-field="education.${i}.institution">${item.institution}</div>
          ${item.school ? `<div class="edu-school-sub editable" data-field="education.${i}.school">${item.school}</div>` : ''}
        </div>
        <span class="edu-location editable" data-field="education.${i}.location">${item.location}</span>
      </div>
      <div class="edu-degree editable" data-field="education.${i}.degree">${item.degree}</div>
      <div class="edu-period editable" data-field="education.${i}.period">${item.period}</div>
      ${item.gpa ? `<div class="edu-gpa">GPA: <strong>${item.gpa}</strong></div>` : ''}
      <ul class="edu-highlights">
        ${item.highlights.map((h, hi) => `
          <li class="edu-hl editable" data-field="education.${i}.highlights.${hi}">${h}</li>
        `).join('')}
      </ul>
    </div>
  `).join(''));
}

function renderSkills() {
  const d = portfolioState.data;
  const groups = Object.entries(d.skills).map(([cat, skills]) => `
    <div class="skill-group">
      <div class="sg-title">${cat}</div>
      <div class="sg-tags">
        ${skills.map(s => `<span class="sg-tag">${s}</span>`).join('')}
      </div>
    </div>
  `).join('');

  const interests = `
    <div class="interests-section">
      <div class="interests-title">Interests</div>
      <div class="interests-tags">
        ${d.interests.map(i => `<span class="int-tag">${i}</span>`).join('')}
      </div>
    </div>
  `;

  setHTML('skills-content', `<div class="skills-layout">${groups}</div>${interests}`);
}

function renderWorks() {
  const items = portfolioState.data.publishedWorks;

  if (!items.length) {
    setHTML('works-content', `
      <div class="works-empty">
        <div class="we-icon">📄</div>
        <div class="we-title">No published works yet</div>
        <div class="we-desc">Enable Edit Mode (lock icon, bottom-right) to add research papers, articles, or other published work.</div>
      </div>
    `);
    return;
  }

  setHTML('works-content', `
    <div class="works-grid">
      ${items.map((item, i) => `
        <div class="work-card card-wrap fade-up" data-id="${item.id}" data-section="works" style="transition-delay:${i*80}ms">
          <span class="work-type-tag">${item.type || 'Research'}</span>
          <div class="work-title editable" data-field="publishedWorks.${i}.title">${item.title}</div>
          <div class="work-meta">
            ${item.publication ? `<span class="editable" data-field="publishedWorks.${i}.publication">${item.publication}</span>` : ''}
            ${item.date ? ` &middot; <span class="editable" data-field="publishedWorks.${i}.date">${item.date}</span>` : ''}
          </div>
          ${item.description ? `<div class="work-desc editable" data-field="publishedWorks.${i}.description">${item.description}</div>` : ''}
          ${item.url ? `<a href="${item.url}" target="_blank" rel="noopener" class="work-link">Read &rarr;</a>` : ''}
          ${cardControls('works', item.id)}
        </div>
      `).join('')}
    </div>
  `);
}

function renderContact() {
  const p = portfolioState.data.personal;

  const links = [
    p.email    && { icon: iconEmail(),    label: p.email,    href: `mailto:${p.email}` },
    p.phone    && { icon: iconPhone(),    label: p.phone,    href: `tel:${p.phone.replace(/\D/g,'')}` },
    p.linkedin && { icon: iconLinkedIn(), label: 'LinkedIn', href: p.linkedin },
    p.github   && { icon: iconGitHub(),   label: 'GitHub',   href: p.github },
    p.twitter  && { icon: iconTwitter(),  label: 'Twitter',  href: p.twitter },
  ].filter(Boolean);

  setHTML('contact-content', `
    <div class="contact-eyebrow">Get In Touch</div>
    <h2 class="contact-heading">
      <span class="editable" data-field="personal.contactHeading">${p.contactHeading || "Let's Connect"}</span>
    </h2>
    <p class="contact-sub editable" data-field="personal.contactSub">${p.contactSub || 'Open to opportunities in finance, venture capital, and product strategy.'}</p>
    <div class="contact-links">
      ${links.map(l => `
        <a href="${l.href}" class="contact-link" target="_blank" rel="noopener">
          ${l.icon} ${l.label}
        </a>
      `).join('')}
    </div>
    <div class="contact-footer">© ${new Date().getFullYear()} ${p.name} &nbsp;·&nbsp; Built with care</div>
  `);
}

/* ══════════════════════════════════════════════════════════
   ICONS
══════════════════════════════════════════════════════════ */
const svg = (d) => `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">${d}</svg>`;
const iconEmail    = () => svg('<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>');
const iconPhone    = () => svg('<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.34 2 2 0 0 1 3.59 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91A16 16 0 0 0 16 18l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 24 18h-2z"/>');
const iconLinkedIn = () => svg('<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>');
const iconGitHub   = () => svg('<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>');
const iconTwitter  = () => svg('<path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>');

/* ══════════════════════════════════════════════════════════
   INTERACTIVE HELPERS
══════════════════════════════════════════════════════════ */
function expandBullets(btn, moreBullets) {
  const ul = btn.closest('ul') || btn.previousElementSibling;
  moreBullets.forEach(b => {
    const li = document.createElement('li');
    li.className = 'lc-bullet';
    li.textContent = b;
    btn.before(li);
  });
  btn.remove();
}

/* ══════════════════════════════════════════════════════════
   NAV SCROLL SPY
══════════════════════════════════════════════════════════ */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');
  const navbar   = $('navbar');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 10);

    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 110) current = s.id;
    });
    links.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === `#${current}`);
    });
  }, { passive: true });
}

/* ══════════════════════════════════════════════════════════
   HAMBURGER
══════════════════════════════════════════════════════════ */
function initHamburger() {
  const btn    = $('hamburger');
  const drawer = $('nav-drawer');
  btn?.addEventListener('click', () => drawer?.classList.toggle('hidden'));
  document.querySelectorAll('.drawer-link').forEach(l => {
    l.addEventListener('click', () => drawer?.classList.add('hidden'));
  });
}

/* ══════════════════════════════════════════════════════════
   FADE ANIMATIONS
══════════════════════════════════════════════════════════ */
function initFadeAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════════════════════════
   HERO ENTRANCE ANIMATION
══════════════════════════════════════════════════════════ */
function initHeroAnimation() {
  const items = [
    '.hero-eyebrow',
    '.hero-name .name-line:nth-child(1)',
    '.hero-name .name-line:nth-child(2)',
    '.hero-tagline',
    '.hero-actions',
    '.hero-card-wrap',
  ];
  items.forEach((sel, i) => {
    const el = document.querySelector(sel);
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    setTimeout(() => {
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 100 + i * 120);
  });
}

/* ══════════════════════════════════════════════════════════
   MAIN RENDER
══════════════════════════════════════════════════════════ */
function renderAll() {
  renderNav();
  renderHero();
  renderExperience();
  renderLeadership();
  renderEducation();
  renderSkills();
  renderWorks();
  renderContact();

  // Re-init scroll animations after re-render
  setTimeout(() => {
    initFadeAnimations();
    // Re-attach editable listeners if in edit mode
    if (window.editState && window.editState.active) {
      attachEditableListeners();
    }
  }, 60);
}

document.addEventListener('DOMContentLoaded', () => {
  renderAll();
  initScrollSpy();
  initHamburger();
  initHeroAnimation();
});
