const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const header = document.querySelector('.site-header');

// Header turns solid once the page scrolls
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Mobile navigation
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
navToggle.addEventListener('click', () => {
  const open = navMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});
const closeNav = () => { navMenu.classList.remove('open'); navToggle.setAttribute('aria-expanded', 'false'); };

// Smooth scroll that accounts for the fixed header
const scrollToEl = (el) => {
  const y = el.getBoundingClientRect().top + window.scrollY - header.offsetHeight + 1;
  window.scrollTo({ top: Math.max(0, y), behavior: reduceMotion ? 'auto' : 'smooth' });
};

// ---------- Collapsible sections ----------
// A toggle button has aria-controls="<id of .collapse-body>".
function setCollapse(body, open) {
  body.classList.toggle('open', open);
  document.querySelectorAll(`[aria-controls="${body.id}"]`).forEach(t => t.setAttribute('aria-expanded', String(open)));
}
const isOpen = (body) => body.classList.contains('open');

document.querySelectorAll('.collapse-head, [data-toggle-form]').forEach(btn => {
  const body = document.getElementById(btn.getAttribute('aria-controls'));
  btn.addEventListener('click', () => {
    setCollapse(body, !isOpen(body));
    if (body.id === 'form-panel' && isOpen(body)) {
      setTimeout(() => body.querySelector('input:not([type=hidden])').focus({ preventScroll: true }), 350);
    }
  });
});

// Links with data-opens="<collapse id>" open that section, then scroll to it
document.querySelectorAll('a[data-opens]').forEach(link => {
  link.addEventListener('click', (e) => {
    const body = document.getElementById(link.dataset.opens);
    if (!body) return;
    e.preventDefault();
    closeNav();
    setCollapse(body, true);
    const target = body.id === 'form-panel' ? document.getElementById('contact') : body.closest('section');
    scrollToEl(target);
    history.replaceState(null, '', link.getAttribute('href'));
  });
});

// Other in-page links: scroll below the fixed header and close the mobile menu
document.querySelectorAll('a[href^="#"]:not([data-opens])').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href').slice(1);
    const target = id === 'top' ? document.body : document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    closeNav();
    if (id === 'top') window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    else scrollToEl(target);
  });
});

// Opening the page at #services or #contact opens that section
if (location.hash === '#services') setCollapse(document.getElementById('services-panel'), true);

// ---------- "Learn more" on each service: details open below the row ----------
const detailsArea = document.querySelector('.service-details');
const learnButtons = [...document.querySelectorAll('.learn-more')];
learnButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const wasOpen = btn.getAttribute('aria-expanded') === 'true';
    learnButtons.forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      b.closest('.service').classList.remove('active');
      document.getElementById(b.getAttribute('aria-controls')).hidden = true;
    });
    if (!wasOpen) {
      btn.setAttribute('aria-expanded', 'true');
      btn.closest('.service').classList.add('active');
      const detail = document.getElementById(btn.getAttribute('aria-controls'));
      detail.hidden = false;
      // Bring the details into view if they open below the bottom of the screen
      requestAnimationFrame(() => {
        const r = detail.getBoundingClientRect();
        if (r.bottom > window.innerHeight) {
          window.scrollBy({ top: Math.min(r.bottom - window.innerHeight + 24, r.top - header.offsetHeight - 16), behavior: reduceMotion ? 'auto' : 'smooth' });
        }
      });
    }
    detailsArea.classList.toggle('has-open', !wasOpen);
  });
});

// Highlight the nav link for the section in view
const navLinks = [...document.querySelectorAll('.nav-links a')];
const sections = ['top', 'services', 'industries', 'about', 'contact'].map(id => id === 'top' ? document.querySelector('.hero') : document.getElementById(id));
const markActive = () => {
  const y = window.scrollY + header.offsetHeight + 120;
  let idx = 0;
  sections.forEach((s, i) => { if (s.offsetTop <= y) idx = i; });
  if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) idx = sections.length - 1;
  navLinks.forEach((a, i) => a.classList.toggle('active', i === idx));
};
markActive();
window.addEventListener('scroll', markActive, { passive: true });

// Footer year
document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

// ---------- Consultation form -> email (via Formspree; see README) ----------
const form = document.querySelector('#contact-form');
if (form) {
  const status = form.querySelector('.form-status');
  const button = form.querySelector('button[type="submit"]');
  const show = (type, msg) => { status.className = `form-status ${type}`; status.textContent = msg; };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    if (form.querySelector('.hp input').value) return; // bot filled the honeypot

    if (form.action.includes('YOUR_FORM_ID')) {
      show('error', 'Form not connected yet: replace YOUR_FORM_ID in index.html with your Formspree form ID (see README).');
      return;
    }

    button.disabled = true;
    const label = button.innerHTML;
    button.textContent = 'Sending…';
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      form.reset();
      show('success', "Thanks! Your request is on its way. We'll be in touch within one business day.");
    } catch {
      show('error', 'Something went wrong sending your request. Please call 630-699-8897 or email hello@elevareit.net.');
    } finally {
      button.disabled = false;
      button.innerHTML = label;
    }
  });
}
