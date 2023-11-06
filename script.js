// Auto-type
var typed = new Typed('.auto-typed', {
  strings: ["an Analyst.", "a Programmer.", "a Writter.","a UI Designer."],
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
quotebtn.addEventListener('click', quoteken);
cryptoBtn.addEventListener('click', cryptoken);
colFlipBtn.addEventListener('click', colFlipken);
infiBtn.addEventListener('click', infiken);



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



