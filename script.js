// Auto-type
var typed = new Typed('.auto-typed', {
  strings: ["an Analyst.", "a Programmer.", "a Writer.", "a UI Designer."],
  typeSpeed: 100,
  backSpeed: 100,
  loop: true
  
});

// Burger
const hamburger = document.querySelector(".hamburger");
const navUl = document.querySelector(".nav-ul");

hamburger.addEventListener("click", function () {
  hamburger.classList.toggle("active");
  navUl.classList.toggle("active");
});

// PORTFOLIO
const quotebtn = document.getElementById('quote');
const cryptoBtn = document.getElementById('crypto');
const colFlipBtn = document.getElementById('col-flip');
const infiBtn = document.getElementById('infi-scroll');
const rpsgame = document.getElementById('rps-game');

function quoteken() {
  const quoteUrl = `https://imjavahater.github.io/kntquotegen.github.io/`;
  window.open(quoteUrl);
}
function cryptoken() {
  const cryptoUrl = `https://imjavahater.github.io/interactive-crypto-web/`;
  window.open(cryptoUrl);
}
function colFlipken() {
  const quoteUrl = `https://imjavahater.github.io/color-flipper/`;
  window.open(quoteUrl);
}
function infiken() {
  const quoteUrl = `https://imjavahater.github.io/js-infnt-scrl/`;
  window.open(quoteUrl);
}
function rockpapersci() {
  const quoteUrl = `https://imjavahater.github.io/RPS---Game/`;
  window.open(quoteUrl);
}
quotebtn.addEventListener('click', quoteken);
cryptoBtn.addEventListener('click', cryptoken);
colFlipBtn.addEventListener('click', colFlipken);
infiBtn.addEventListener('click', infiken);
rpsgame.addEventListener('click', rockpapersci);




// Contact button
const linkedinbtn = document.getElementById('linkedin');
const githubbtn = document.getElementById('github');
const mediumbtn = document.getElementById('medium');

function linkedinken() {
  const linkedinUrl = `https://www.linkedin.com/in/ktsanchez/`;
  window.open(linkedinUrl);
}
function githubken() {
  const githubUrl = `https://github.com/imjavahater`;
  window.open(githubUrl);
}
function mediumken() {
  const mediumUrl = `https://medium.com/@troysanchez`;
  window.open(mediumUrl);
}

linkedinbtn.addEventListener('click', linkedinken);
githubbtn.addEventListener('click', githubken);
mediumbtn.addEventListener('click', mediumken);

const facebookbtn = document.getElementById('facebook');
const instagrambtn = document.getElementById('instagram');

function facebookken() {
  const facebookUrl = `https://www.facebook.com/fghjkenl/`;
  window.open(facebookUrl);
}
function instagramken() {
  const instagramUrl = `https://www.instagram.com/ysk_kenn/`;
  window.open(instagramUrl);
}

facebookbtn.addEventListener('click', facebookken);
instagrambtn.addEventListener('click', instagramken);

// THEME TOGGLE (dark / light, remembered via localStorage)
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const rootEl = document.documentElement;

function applyTheme(theme) {
  if (theme === 'light') {
    rootEl.setAttribute('data-theme', 'light');
    themeIcon.className = 'ri-sun-line';
  } else {
    rootEl.removeAttribute('data-theme');
    themeIcon.className = 'ri-moon-line';
  }
}

const savedTheme = localStorage.getItem('kts-theme');
const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
applyTheme(savedTheme || (prefersLight ? 'light' : 'dark'));

themeToggle.addEventListener('click', function () {
  const isLight = rootEl.getAttribute('data-theme') === 'light';
  const next = isLight ? 'dark' : 'light';
  applyTheme(next);
  localStorage.setItem('kts-theme', next);
});

// SCROLL REVEAL
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

// BACK TO TOP
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', function () {
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});
backToTop.addEventListener('click', function () {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// FOOTER YEAR
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// CONTACT FORM (Formspree — swap in your own form ID, see notes)
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const submitBtn = document.getElementById('cf-submit');
    submitBtn.disabled = true;
    formStatus.textContent = 'Sending...';
    formStatus.className = 'form-status';

    fetch(contactForm.action, {
      method: 'POST',
      body: new FormData(contactForm),
      headers: { 'Accept': 'application/json' }
    })
      .then(function (response) {
        if (response.ok) {
          formStatus.textContent = 'Thanks! Your message is on its way.';
          formStatus.className = 'form-status success';
          contactForm.reset();
        } else {
          formStatus.textContent = 'Something went wrong — please email me directly instead.';
          formStatus.className = 'form-status error';
        }
      })
      .catch(function () {
        formStatus.textContent = 'Something went wrong — please email me directly instead.';
        formStatus.className = 'form-status error';
      })
      .finally(function () {
        submitBtn.disabled = false;
      });
  });
}
