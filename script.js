// =========================================================
// Small helpers so the site never breaks if storage is blocked
// (e.g. some private-browsing modes)
// =========================================================
function safeGet(key) {
  try { return localStorage.getItem(key); } catch (e) { return null; }
}
function safeSet(key, value) {
  try { localStorage.setItem(key, value); } catch (e) { /* ignore */ }
}

// =========================================================
// AUTO-TYPE (Typed.js). If the library fails to load
// (ad blocker, slow network), show plain text instead of crashing.
// =========================================================
const typedTarget = document.querySelector('.auto-typed');
if (window.Typed && typedTarget) {
  new Typed('.auto-typed', {
    strings: ['an Analyst.', 'a Programmer.', 'a Writer.', 'a UI Designer.'],
    typeSpeed: 100,
    backSpeed: 100,
    loop: true
  });
} else if (typedTarget) {
  typedTarget.textContent = 'an Analyst.';
}

// =========================================================
// MOBILE MENU (hamburger)
// =========================================================
const hamburger = document.querySelector('.hamburger');
const navUl = document.querySelector('.nav-ul');

function setMenu(open) {
  hamburger.classList.toggle('active', open);
  navUl.classList.toggle('active', open);
  document.body.classList.toggle('menu-open', open);
  hamburger.setAttribute('aria-expanded', String(open));
  hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}

hamburger.addEventListener('click', function () {
  setMenu(!navUl.classList.contains('active'));
});

// Close the menu after tapping a link
navUl.querySelectorAll('a').forEach(function (link) {
  link.addEventListener('click', function () { setMenu(false); });
});

// Close with the Escape key
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && navUl.classList.contains('active')) {
    setMenu(false);
    hamburger.focus();
  }
});

// If the screen is rotated / resized to desktop width, reset the menu
window.matchMedia('(min-width: 800px)').addEventListener('change', function (e) {
  if (e.matches) setMenu(false);
});

// Portfolio + contact links are now normal <a href> links in index.html,
// so they no longer need JavaScript to open.

// =========================================================
// THEME TOGGLE (dark / light, remembered between visits)
// =========================================================
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const rootEl = document.documentElement;
const themeColorMeta = document.querySelectorAll('meta[name="theme-color"]');

function applyTheme(theme) {
  const isLight = theme === 'light';
  if (isLight) {
    rootEl.setAttribute('data-theme', 'light');
  } else {
    rootEl.removeAttribute('data-theme');
  }
  themeIcon.className = isLight ? 'ri-sun-line' : 'ri-moon-line';
  // Keep the phone's browser bar the same color as the header
  themeColorMeta.forEach(function (m) {
    m.setAttribute('content', isLight ? '#ffffff' : '#0c1c55');
  });
}

const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
applyTheme(safeGet('kts-theme') || (prefersLight ? 'light' : 'dark'));

themeToggle.addEventListener('click', function () {
  const next = rootEl.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  applyTheme(next);
  safeSet('kts-theme', next);
});

// =========================================================
// SCROLL REVEAL
// =========================================================
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(function (el) { observer.observe(el); });
} else {
  revealEls.forEach(function (el) { el.classList.add('visible'); });
}

// =========================================================
// BACK TO TOP
// =========================================================
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', function () {
  backToTop.classList.toggle('visible', window.scrollY > 400);
}, { passive: true }); // passive = smoother scrolling on phones

backToTop.addEventListener('click', function () {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// =========================================================
// FOOTER YEAR
// =========================================================
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// =========================================================
// CONTACT FORM (Formspree)
// Until you add a real Formspree ID in index.html, the form falls
// back to opening the visitor's email app with the message filled in.
// =========================================================
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const MY_EMAIL = 'sanchez.kent0411@gmail.com';

if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const submitBtn = document.getElementById('cf-submit');
    const data = new FormData(contactForm);

    if (contactForm.action.indexOf('YOUR_FORM_ID') !== -1) {
      const subject = encodeURIComponent('Portfolio message from ' + data.get('name'));
      const body = encodeURIComponent(data.get('message') + '\n\n— ' + data.get('name') + ' (' + data.get('email') + ')');
      window.location.href = 'mailto:' + MY_EMAIL + '?subject=' + subject + '&body=' + body;
      return;
    }

    submitBtn.disabled = true;
    formStatus.textContent = 'Sending...';
    formStatus.className = 'form-status';

    fetch(contactForm.action, {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    })
      .then(function (response) {
        if (response.ok) {
          formStatus.textContent = 'Thanks! Your message is on its way.';
          formStatus.className = 'form-status success';
          contactForm.reset();
        } else {
          throw new Error('Bad response');
        }
      })
      .catch(function () {
        formStatus.textContent = 'Something went wrong — please email me directly at ' + MY_EMAIL + '.';
        formStatus.className = 'form-status error';
      })
      .finally(function () {
        submitBtn.disabled = false;
      });
  });
}
