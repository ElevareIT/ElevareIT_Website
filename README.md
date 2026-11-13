# Elevare IT website

A self-contained static website. The `dist` folder contains the website code and all its images. There is no package installation or build step.

## Open the website

Unzip the download and open `dist/index.html` in a modern browser. The navigation, service dialogs, industry explorer, FAQs, and IT review work locally.

For an HTTP preview, install Node.js 20 or newer and run:

```sh
npm start
```

Open `http://localhost:3000`. Set `PORT` or pass a port (`node scripts/serve.mjs 4000`) if needed. Run `npm run check` to check JavaScript syntax.

## Files

```text
dist/
  index.html          Homepage, services, industry explorer, FAQs
  styles.css          Responsive layout and visual design
  review.css          Accessible review wizard and result styles
  app.js              Navigation, keyboard tabs, service and privacy dialogs
  review.js           Three-step IT review and personalised brief download
  assets/             Original Chicago illustration, logo mark, and favicon
scripts/serve.mjs     Dependency-free local preview server
ASSETS.md            Image provenance and original artwork notes
```

## IT review behaviour

Visitors select an industry, team size, and IT priorities. The site generates a practical planning brief in the browser. Visitors can go back, edit answers, download a plain text copy, or start again. Answers are not transmitted or stored. Refreshing the page clears them.

This is a planning tool, not a contact submission or an assessment of the visitor's systems. No inquiry email, booking system, CRM, database, or backend is connected. The interface and privacy notice explain that behaviour.

## Content to review before a business launch

The recovered brief supplied the name Elevare IT, the line “Technology with a Purpose,” a Chicago identity, and the scope of services, industries, and an IT review journey. The original design attachment and detailed business copy were not available in this conversation.

This source is a new implementation of that brief. Service descriptions, industry examples, and approach text are proposed marketing copy for owner review; they are not verified evidence of particular commercial offerings. There are no invented client logos, testimonials, certifications, performance statistics, staff profiles, telephone numbers, addresses, or email destinations.

To add an inquiry or booking flow, supply the correct destination and connect a real backend or approved booking service. Only say a message was sent after an actual successful submission.

## Edit and host

Edit the HTML, CSS, and JavaScript files directly. Deploy `dist` to any static web host.

This repository includes `.github/workflows/pages.yml`, which publishes `dist` to GitHub Pages on every push to `main`. To turn it on, open the repository's Settings → Pages and set **Source** to **GitHub Actions**. The ZIP contains no Git history, access tokens, environment files, dependencies, or private review answers.

The site includes semantic landmarks, a skip link, labelled forms, native dialogs, keyboard-operable industry tabs, mobile navigation, visible focus indicators, and reduced-motion support. All assets are local; no analytics or third-party runtime requests are used.
