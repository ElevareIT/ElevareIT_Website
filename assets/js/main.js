// Mobile navigation toggle
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
if (toggle && links) {
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
}

// Collapsible menu: one button open at a time, all sharing one panel area.
// Click a button to open its panel; click it again to close; click another to switch.
// Links like href="#services" anywhere on the page open that panel too.
const explore = document.querySelector('#explore');
if (explore) {
  const buttons = [...explore.querySelectorAll('.menu-btn')];
  const panelsWrap = explore.querySelector('.menu-panels');
  const names = buttons.map(b => b.dataset.panel);
  let current = null;

  const headerHeight = () => document.querySelector('.site-header').offsetHeight;
  const scrollToMenu = () => {
    const y = explore.getBoundingClientRect().top + window.scrollY - headerHeight();
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
  };

  const open = (name, { scroll = false } = {}) => {
    current = name;
    buttons.forEach(b => b.setAttribute('aria-expanded', String(b.dataset.panel === name)));
    names.forEach(n => { document.getElementById(`panel-${n}`).hidden = n !== name; });
    panelsWrap.classList.toggle('open', !!name);
    explore.classList.toggle('has-open', !!name);
    history.replaceState(null, '', name ? `#${name}` : location.pathname + location.search);
    // Line the menu bar up at the top of the screen so the buttons and the new panel are both in view.
    if (name && (scroll || Math.abs(explore.getBoundingClientRect().top - headerHeight()) > 4)) scrollToMenu();
  };

  buttons.forEach(b => b.addEventListener('click', () => {
    open(current === b.dataset.panel ? null : b.dataset.panel);
  }));

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    const name = a.getAttribute('href').slice(1);
    if (!names.includes(name)) return;
    a.addEventListener('click', e => { e.preventDefault(); open(name, { scroll: true }); });
  });

  const fromHash = location.hash.slice(1);
  if (names.includes(fromHash)) open(fromHash, { scroll: true });
}

// Reveal-on-scroll animation
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('visible'));
}

// Footer year
document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

// Contact form -> email (via Formspree; see README for setup)
const form = document.querySelector('#contact-form');
if (form) {
  const status = form.querySelector('.form-status');
  const button = form.querySelector('button[type="submit"]');

  const show = (type, msg) => {
    status.className = `form-status ${type}`;
    status.textContent = msg;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    if (form.querySelector('.hp input').value) return; // bot filled the honeypot

    if (form.action.includes('YOUR_FORM_ID')) {
      show('error', 'Form not connected yet: replace YOUR_FORM_ID in index.html with your Formspree form ID (see README).');
      return;
    }

    button.disabled = true;
    const label = button.textContent;
    button.textContent = 'Sending…';
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      form.reset();
      show('success', "Thanks! Your message is on its way. We'll get back to you within one business day.");
    } catch (err) {
      show('error', 'Something went wrong sending your message. Please try again or email us directly.');
    } finally {
      button.disabled = false;
      button.textContent = label;
    }
  });
}
