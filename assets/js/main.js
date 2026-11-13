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
      show('error', 'Form not connected yet: replace YOUR_FORM_ID in contact.html with your Formspree form ID (see README).');
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
