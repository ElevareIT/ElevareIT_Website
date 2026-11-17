# Elevare IT Website

A static, single-page site for Elevare IT built from the approved mockup: navy / Chicago-at-dusk look,
serif headlines, and these sections:

1. **Hero**: "Enterprise-Level IT for Growing Businesses", skyline photo, consultation and call buttons
2. **Our Services**: a collapsible block. Visitors see the heading "Real Solutions for Real Business Needs."
   in a bordered bar; clicking it expands the six services below it. Each service's **Learn more** opens a
   details box under the row (one at a time) instead of going to another page.
3. **Industries We Serve**: cream band with six industries
4. **Why Elevare IT**: lobby photo, checklist, founder quote and signature
5. **Contact**: CTA, QR code, phone / email / location. **Book Your Free Consultation** expands the
   consultation form in place. Every "Book a consultation" / "Schedule a free IT review" button opens it too.

No build step. It's plain HTML, CSS and JavaScript, so it can be hosted anywhere (GitHub Pages, Netlify, Cloudflare Pages, any web host).

```
index.html            The whole site
assets/css/styles.css All styling (colors and fonts are variables at the top)
assets/js/main.js     Expand/collapse, "Learn more" details, header, mobile menu, form submission
assets/img/           hero-city.jpg, lobby.jpg, cta-city.jpg (photos), qr-site.svg, favicon.svg
```

## Preview locally

Open `index.html` in a browser, or run `python3 -m http.server` in this folder and visit http://localhost:8000.

## Make the consultation form email you

The form uses [Formspree](https://formspree.io) (free tier: 50 submissions/month), which works on any static host.

1. Sign up at formspree.io with the email address that should receive requests (e.g. hello@elevareit.net).
2. Create a new form. Formspree gives you an endpoint like `https://formspree.io/f/xyzabcd`.
3. In `index.html`, replace `YOUR_FORM_ID` in the form's `action` with your ID (`xyzabcd`).
4. Submit the form once and confirm the verification email from Formspree.

Until step 3 is done, the form shows a "not connected yet" notice instead of sending.

## Photos

The three photos were cut from the mockup image, so they are lower resolution than ideal. For a sharper site,
replace them with the original full-size images, keeping the same file names:

- `assets/img/hero-city.jpg`: skyline / laptop / mug scene (right side of the hero)
- `assets/img/lobby.jpg`: lobby with the ELEVARE IT sign
- `assets/img/cta-city.jpg`: dark city background behind the contact section

## Things to fill in

- **Learn more details**: each service's details box (`detail-...` in `index.html`) has starter text marked `[Edit]`
- **Social links**: the four icons in the contact section point to `#`; add your LinkedIn, Facebook, Instagram and Google profile URLs
- **QR code**: `assets/img/qr-site.svg` points to https://elevareit.net. If your domain is different, regenerate it
- Keep the "Service of interest" dropdown in the form in sync with the six services

## Changing colors and fonts

All colors are CSS variables at the top of `assets/css/styles.css`. Fonts: DM Serif Display (headlines),
Jost (text), Caveat ("Scan to visit our site") and Mrs Saint Delafield (signature), loaded from Google Fonts.
