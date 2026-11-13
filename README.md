# ElevareIT Website

A static marketing site for ElevareIT: a cool-blue, Chicago-at-night theme with a skyline hero,
a "What we do" section, a services grid, a process section and a contact form that emails you.

No build step. It's plain HTML, CSS and JavaScript, so it can be hosted anywhere (GitHub Pages, Netlify, Cloudflare Pages, any web host).

```
index.html            Home: hero, About / What we do, Services, How we work, CTA
contact.html          Contact page with the email form
assets/css/styles.css All styling (colors are variables at the top)
assets/js/main.js     Mobile menu, scroll animations, form submission
assets/img/           Skyline illustration + logo/favicon (SVG)
```

## Preview locally

Open `index.html` in a browser, or run `python3 -m http.server` in this folder and visit http://localhost:8000.

## Make the contact form email you

The form uses [Formspree](https://formspree.io) (free tier: 50 submissions/month), which works on any static host.

1. Sign up at formspree.io with the email address that should receive inquiries.
2. Create a new form. Formspree gives you an endpoint like `https://formspree.io/f/xyzabcd`.
3. In `contact.html`, replace `YOUR_FORM_ID` in the form's `action` with your ID (`xyzabcd`).
4. Submit the form once and confirm the verification email from Formspree.

Until step 3 is done, the form shows a "not connected yet" notice instead of sending.

**Alternatives:** if you host on Netlify, you can use Netlify Forms instead (add `data-netlify="true"` to the `<form>` and remove the `action`).
Other drop-in services include Web3Forms and Basin. Each one only requires changing the form's `action` URL.

## Filling in your details

Search the HTML files for `[` brackets. Every placeholder is wrapped like `[Your tagline here]`:

- Hero tagline and stats (`[XX]+` clients, `[<1hr]` response time)
- About paragraph and the mission/testimonial card (remove the yellow "Placeholder" tag when done)
- Email and phone in the footer and on the contact page (update both the visible text **and** the `mailto:` / `tel:` links)
- Business hours on the contact page
- Services: edit, add or remove `<article class="service-card">` blocks in `index.html`, and keep the
  "Service of interest" dropdown in `contact.html` in sync

## Changing colors

All colors are CSS variables at the top of `assets/css/styles.css` (`--blue-500`, `--sky-300`, `--navy-*`, etc.).
