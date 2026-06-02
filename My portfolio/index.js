// ── AOS ──
AOS.init({ duration: 650, easing: 'ease-in-out', once: true });

// ── Preloader ──
window.addEventListener('load', () => {
  const pre = document.getElementById('preloader');
  if (pre) {
    pre.style.opacity = '0';
    setTimeout(() => pre.remove(), 600);
  }
});

// ── Typed.js ──
const selectTyped = document.querySelector('.typed');
if (selectTyped) {
  const items = selectTyped.getAttribute('data-typed-items').split(',');
  new Typed('.typed', {
    strings: items,
    loop: true,
    typeSpeed: 90,
    backSpeed: 45,
    backDelay: 1800
  });
}

// ── Nav scroll state ──
const header = document.getElementById('header');
const toggleScrolled = () => {
  if (!header) return;
  window.scrollY > 80
    ? header.classList.add('scrolled')
    : header.classList.remove('scrolled');
};
window.addEventListener('scroll', toggleScrolled);
toggleScrolled();

// ── Scroll top ──
const scrollTopBtn = document.getElementById('scroll-top');
if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    window.scrollY > 150
      ? scrollTopBtn.classList.add('active')
      : scrollTopBtn.classList.remove('active');
  });

  scrollTopBtn.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ── Skill bars ──
const bars = document.querySelectorAll('.skill-bar-fill');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bar = entry.target;
      const w = bar.getAttribute('data-width') || bar.getAttribute('aria-valuenow');
      if (w) bar.style.width = w + '%';
      observer.unobserve(bar);
    }
  });
}, { threshold: 0.3 });

bars.forEach(bar => observer.observe(bar));

// ── Mobile nav ──
const mobileToggle = document.getElementById('mobileToggle');
const mobileMenu = document.getElementById('mobile-menu');
const menuIcon = document.getElementById('menuIcon');

if (mobileToggle && mobileMenu && menuIcon) {
  mobileToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    menuIcon.className = mobileMenu.classList.contains('open')
      ? 'bi bi-x'
      : 'bi bi-list';
  });

  document.querySelectorAll('#mobile-menu a').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      menuIcon.className = 'bi bi-list';
    });
  });
}

// ── Theme toggle ──
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

const saved = localStorage.getItem('theme') || 'dark';
if (saved === 'light') html.classList.remove('dark');

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    html.classList.toggle('dark');
    localStorage.setItem(
      'theme',
      html.classList.contains('dark') ? 'dark' : 'light'
    );
  });
}

// ── Scrollspy ──
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

const scrollSpy = () => {
  const pos = window.scrollY + 200;

  sections.forEach(sec => {
    const link = document.querySelector(`.nav-link[href="#${sec.id}"]`);
    if (!link) return;

    if (pos >= sec.offsetTop && pos <= sec.offsetTop + sec.offsetHeight) {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
};

window.addEventListener('scroll', scrollSpy);



// ═══════════════════════════════════════════
// 🌌 SPACE CANVAS — PURPLE THEME
// ═══════════════════════════════════════════
(function () {
  const canvas = document.getElementById('space-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, stars = [], shooters = [], nebulae = [], frame = 0;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    buildNebulae();
    buildStars();
  }

  function buildNebulae() {
    nebulae = [
      { x: W * .12, y: H * .3, r: W * .3, c: '139,92,246', a: .03 },
      { x: W * .85, y: H * .65, r: W * .25, c: '124,58,237', a: .025 },
      { x: W * .5, y: H * .1, r: W * .22, c: '80,100,255', a: .02 },
      { x: W * .68, y: H * .85, r: W * .2, c: '139,92,246', a: .018 },
      { x: W * .3, y: H * .7, r: W * .18, c: '160,120,255', a: .012 },
    ];
  }

  function starColor() {
    const r = Math.random();
    if (r < .55) return '#ffffff';
    if (r < .75) return '#c8c2ff';
    return '#8B5CF6';
  }

  function buildStars() {
    stars = [];
    const n = Math.floor(W * H / 2400);

    for (let i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.5,
        ba: .25 + Math.random() * .75,
        a: 0,
        ts: .004 + Math.random() * .018,
        to: Math.random() * Math.PI * 2,
        col: starColor(),
        glow: Math.random() > .92
      });
    }
  }

  function spawnShooter() {
    shooters.push({
      x: Math.random() * W,
      y: Math.random() * H * .4,
      vx: 10,
      vy: 4,
      col: '#8B5CF6',
      alpha: 1,
      tail: [],
      life: 0,
      maxLife: 40
    });
  }

  function drawStars() {
    stars.forEach(s => {
      s.a = s.ba * (.5 + .5 * Math.sin(frame * s.ts + s.to));
      ctx.globalAlpha = s.a;
      ctx.fillStyle = s.col;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  function drawShooters() {
    shooters.forEach(s => {
      s.tail.push({ x: s.x, y: s.y });
      if (s.tail.length > 20) s.tail.shift();

      s.x += s.vx;
      s.y += s.vy;
      s.life++;

      ctx.strokeStyle = s.col;
      ctx.beginPath();
      s.tail.forEach((p, i) => {
        i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();
    });

    shooters = shooters.filter(s => s.life < s.maxLife);
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawStars();
    drawShooters();

    if (Math.random() < 0.01) spawnShooter();

    frame++;
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  resize();
  loop();
})();