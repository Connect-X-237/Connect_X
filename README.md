CONNECT X — Website

Dark-themed single-page website for the CONNECT X student activity organization. Built with plain HTML, CSS, and JavaScript.

Features
- Sticky header with brand, navigation (Home, About, Vision, Mission, Meet Us, Gallery, Projects, Committees) and Join Us CTA
- Hero with dark background image and Audiowide heading
- About section + separate Vision and Mission sections (variant styling)
- Meet Us horizontal carousel with arrows and progress bar
- Committees mega dropdown (Technical, Organizing, Creative) and a futuristic Committees section
- Footer with brand/logo, social links, and Committees columns
- Scroll-reveal animations and hover effects (reduced-motion friendly)

File structure
```
C:\Projects\ConnectXWebsite
├─ index.html        # Page markup
├─ styles.css        # Dark theme styles, layout, animations
├─ script.js         # Carousel + scroll-reveal logic
├─ logo.jpg          # Site logo
├─ bg.png            # Hero background image
├─ meetUs\           # Meet Us member images
└─ gallary\           # gallary for memories images
```

Quick start
- Open `index.html` in any modern browser.
- No build step or server required.

Optionally, you can use a simple static server for local dev (any tool you like) to get correct caching headers.

Customize
- Logo: replace `logo.jpg` in the root.
- Hero background: replace `bg.png` or adjust the overlay in `.hero` (in `styles.css`).
- Navigation: edit the header nav in `index.html` to add/remove sections.
- About / Vision / Mission: update text in their respective sections in `index.html`.
- Meet Us members: replace images inside `meetUs\` and update the card items in the `Meet Us` section.
- Committees dropdown: edit the lists inside the header `Committees` mega menu.
- Committees section: update nodes inside the `#committees` section (`.nodes`).
- Social links: edit the Footer `Follow` column links; email uses `mailto:`.

Carousel tips
- Images are displayed with a 3:4 aspect ratio via CSS (`.card-image { aspect-ratio: 3 / 4; }`).
- Navigation arrows move one card at a time; a progress bar indicates scroll position.

Fonts
- Uses Google Fonts `Audiowide` for brand/section titles and `Inter` for UI/body.

Accessibility & motion
- Keyboard focusable links/buttons.
- Scroll-reveal animations are disabled when `prefers-reduced-motion: reduce` is enabled.

Browser support
- Modern evergreen browsers (Chromium, Firefox, Safari). For older browsers, some effects may degrade gracefully.

License
- For internal CONNECT X use. Replace or add a license if you intend to publish.


