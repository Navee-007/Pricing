# Naveen.Dev — Portfolio Site of Naveen Kumar K

A multi-page portfolio and services website for **Naveen Kumar K**, a Full Stack Developer based in Coimbatore, India, working under the brand **Naveen.Dev**.

Built as a static site: HTML5, Bootstrap 5, a custom CSS design system, and vanilla JavaScript. No build step, no framework, no dependencies to install — open `index.html` and it runs.

**Live contact channels**
- Email: naveenkumar.coder@gmail.com
- Phone / WhatsApp: +91 76018 80138
- Upwork: https://www.upwork.com/freelancers/~010cbae54f7f3a4a92
- LinkedIn: https://www.linkedin.com/in/naveen-kumar-a76729263

---

## 🧑‍💻 Who this site is for

It is a freelance portfolio, not a company site. Everything on it describes one developer's own work: 3 years and 7 months of production experience across three employers, and 14 systems shipped — SaaS platforms, real-time banking portals, ERP, POS, accounting software, e-commerce, digital signature workflows and React Native apps.

**Content rule for this repo: no placeholder people, no invented clients, no unverifiable statistics.** If a number or a name cannot be backed up, it does not go on the site.

Client project screenshots are deliberately **not** published — the systems are covered by confidentiality. Project cards use designed icon covers instead, and the portfolio page says so openly.

---

## 🎨 Design system

Light premium aesthetic, in the same family as Vercel, Stripe and Freshworks. All tokens live in `:root` at the top of `style.css`:

| Token | Value | Used for |
| --- | --- | --- |
| `--bg-white` / `--bg-light` | `#FFFFFF` / `#F8FAFC` | Page canvas and alternating sections |
| `--primary` | `#2563EB` | Buttons, links, focus states |
| `--accent` / `--sky` | `#4F46E5` / `#0EA5E9` | Gradients and tags |
| `--success` | `#10B981` | Checks, stats, availability dot |
| `--text-heading` / `--text-body` | `#1E293B` / `#475569` | Headings and body copy |
| `--radius-card` | `20px` | Card corner radius |

Typography is **Outfit** (Google Fonts), loaded via `<link>` with `preconnect` in each page head — not `@import` inside the CSS, which would block first paint.

---

## 📁 Structure

```text
Pricing-main/                     # everything lives in one flat folder
├── index.html                    # Home
├── about.html                    # Bio, experience timeline, education
├── services.html                 # 15 services
├── web-development.html          # Service detail
├── mobile-development.html       # Service detail
├── custom-software.html          # Service detail - ERP / CRM
├── ui-ux.html                    # Service detail + design concept gallery
├── portfolio.html                # 14 project cards, Problem -> Solution
├── technologies.html             # Stack
├── pricing.html                  # Hourly rate + packages
├── process.html                  # Delivery process
├── faq.html                      # Pre-project questions
├── contact.html                  # Contact channels + enquiry form
├── style.css                     # Design system + components
├── script.js                     # Preloader, scroll effects, counters, filters, form
├── naveen-profile.jpg            # Profile photo (web-optimised, 194KB)
├── IMG_9297.JPG                  # Original photo (backup, not referenced)
├── Naveen-Kumar-K-Resume.pdf     # Downloadable CV
├── hero_tech.png                 # Hero illustration
├── ecommerce_home.png            # UI design concept - storefront
├── ecommerce_admin.png           # UI design concept - admin dashboard
├── ecommerce_mobile.png          # UI design concept - mobile app
├── about_office.png              # unused
├── portfolio_admin.png           # unused
├── portfolio_corp.png            # unused
├── portfolio_ecommerce.png       # unused
└── README.md
```

No subfolders: every file sits in the project root, so paths in the HTML are plain filenames (`style.css`, `script.js`, `hero_tech.png`).

---

## ⚡ How the JavaScript works

`script.js` runs on `DOMContentLoaded` and wires seven things:

1. **Preloader** — fades out on `window.load`, with a 1.5s safety timeout so it can never trap the page.
2. **Sticky navbar** — adds `.navbar-scrolled` past 50px of scroll.
3. **Back-to-top button** — appears past 500px, scrolls smoothly.
4. **Scroll entrance animations** — `IntersectionObserver` adds `.animated` to any `.animate-on-scroll` element, then unobserves it.
5. **Stat counters** — `.counter` elements count from 0 to their `data-target` over 1.5s using `requestAnimationFrame` with ease-out easing.
6. **Portfolio filters** — `filterPortfolio(category)` matches each card's `data-category` (`web`, `software`, `mobile`) and scales non-matching cards out.
7. **Contact form** — composes the enquiry into a `mailto:` addressed to naveenkumar.coder@gmail.com and hands it to the visitor's mail client.

### Swapping the contact form to a hosted endpoint

The `mailto:` approach needs no signup and no server, but it depends on the visitor having a mail client configured. To receive submissions directly instead, sign up with [Web3Forms](https://web3forms.com) or [Formspree](https://formspree.io), then in `contact.html` set the form's `action` to your endpoint and `method="POST"`, and delete the submit handler in section 7 of `script.js`.

---

## 📜 Coding standards

- **Semantic HTML5** — `header`, `nav`, `section`, `footer`, one `h1` per page, `alt` text on every image.
- **Bootstrap 5 grid** — scales from phones to wide screens; custom components layer on top rather than overriding Bootstrap internals.
- **No external JS dependencies** beyond the Bootstrap bundle and Bootstrap Icons, both from CDN, both `defer`red.

---

## ✅ Editing checklist

Before publishing a change, confirm:

- [ ] No placeholder names (Alex Morgan, John Doe) or fake companies anywhere.
- [ ] No statistic on the page that cannot be proven.
- [ ] No client screenshots — icon covers only.
- [ ] Every `href` resolves; no leftover `href="#"` on a link that should go somewhere.
- [ ] Phone links use `tel:+917601880138`, times are stated in IST.
