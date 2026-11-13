# ElevareIT Website

A static marketing site for ElevareIT: a bright summer-in-Chicago theme with a daytime skyline over the lake,
and a menu of four buttons (Services, About, Inquiries, Markets Supported). Each button expands its
content in one shared area below the menu, so visitors can switch topics without scrolling. Inquiries holds a
contact form that emails you.

No build step. It's plain HTML, CSS and JavaScript, so it can be hosted anywhere (GitHub Pages, Netlify, Cloudflare Pages, any web host).

```
index.html            The whole site: hero, the 4-button menu and its panels, CTA, footer
assets/css/styles.css All styling (colors are variables at the top)
assets/js/main.js     Collapsible menu, mobile nav, scroll animations, form submission
assets/img/           Skyline illustration + logo/favicon (SVG)
```

## Preview locally

Open `index.html` in a browser, or run `python3 -m http.server` in this folder and visit http://localhost:8000.

## Make the contact form email you

The form uses [Formspree](https://formspree.io) (free tier: 50 submissions/month), which works on any static host.

1. Sign up at formspree.io with the email address that should receive inquiries.
2. Create a new form. Formspree gives you an endpoint like `https://formspree.io/f/xyzabcd`.
3. In `index.html`, replace `YOUR_FORM_ID` in the form's `action` with your ID (`xyzabcd`).
4. Submit the form once and confirm the verification email from Formspree.

Until step 3 is done, the form shows a "not connected yet" notice instead of sending.

**Alternatives:** if you host on Netlify, you can use Netlify Forms instead (add `data-netlify="true"` to the `<form>` and remove the `action`).
Other drop-in services include Web3Forms and Basin. Each one only requires changing the form's `action` URL.

## Filling in your details

Search the HTML files for `[` brackets. Every placeholder is wrapped like `[Your tagline here]`:

- Hero tagline and stats (`[XX]+` clients, `[<1hr]` response time)
- About paragraph and the mission/testimonial card (remove the yellow "Placeholder" tag when done)
- Email and phone in the footer and in the Inquiries panel (update both the visible text **and** the `mailto:` / `tel:` links)
- Business hours in the Inquiries panel
- Services: edit, add or remove `<article class="service-card">` blocks in the `panel-services` section, and keep
  the "Service of interest" dropdown in the Inquiries form in sync
- Markets Supported: edit the industry cards (`market-card`) and the "Areas we serve" list in `panel-markets`

## The menu

Each menu button has `data-panel="name"` and opens the matching `<div class="panel" id="panel-name">`.
To add a fifth menu, copy one button and one panel and give them a new name. Any link to `#name`
(for example `href="#inquiries"`) opens that panel, so you can link straight to a menu from anywhere.

## Changing colors

All colors are CSS variables at the top of `assets/css/styles.css` (`--blue-500`, `--sky-300`, `--navy-*`, etc.).
