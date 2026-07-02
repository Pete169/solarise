# SolaRise — Solar Inverter Solutions & Installation (Nigeria)

A fast, mobile-first advisor-style site for a multi-brand solar inverter business.
Built with plain HTML/CSS/JS — no build step, hosts anywhere.

## What's inside
- **Hero** with live backup-duration card and animated trust counters
- **Multi-brand wedge** — the "we match you to the right brand" advisor positioning
- **Brand Matcher** — 3 questions → best-fit inverter brand + honest trade-off + runner-up
- **Savings calculator** — grid + generator-fuel spend → recommended system, savings, payback
- **System packages** (Starter / Home / Max) framed as tailored starting points
- **Financing calculator** — deposit + term → monthly payment, compared to their fuel bill
- **How it works**, project gallery, testimonials, FAQ
- **Lead form** with capture-everywhere backend + WhatsApp, plus honeypot spam guard
- SEO + Open Graph share previews, favicon, sitemap, robots.txt

## Make it yours
Open `assets/script.js` → edit the `CONFIG` block at the top:
- `whatsappNumber` — your number, international format, **no `+`** (already set: 2347034394459)
- `whatsappMessage` — the greeting the WhatsApp chat opens with
- `captureEndpoint` — **paste a free [Formspree](https://formspree.io) URL** so every
  enquiry is emailed to you even if the customer never finishes the WhatsApp chat.
  Leave `""` for WhatsApp-only.
- `openWhatsAppOnSubmit` — keep `true` for your WhatsApp-first workflow.

Edit `SYSTEMS` (prices/specs), `FINANCING` (deposit/term/rate), and `BRANDS`
(the brands you stock + your honest view of each) in the same file.

In `index.html`: update phone, email, and address in the footer, and the
`from ₦…` prices in the Systems section. Swap project gradients for real photos by
replacing the `.proj__img` divs with `<img>` tags.

## ⚠️ Update your domain in 3 places (after you pick one)
The share-preview and SEO tags use a placeholder domain `https://www.solarise.ng/`.
After deploying, replace it in:
1. `index.html` — `<link rel="canonical">` + all `og:` / `twitter:` URLs
2. `robots.txt` — the `Sitemap:` line
3. `sitemap.xml` — the `<loc>` line

(The site works without this — but WhatsApp/Facebook link previews need the real
domain to show the share image.)

## Run locally
Open `index.html` in a browser, or serve it:
```
node server.js         # then visit http://localhost:4173
# or:  python3 -m http.server 8000
```

## Go live (free options)
- **Netlify** — drag this folder onto [app.netlify.com/drop](https://app.netlify.com/drop). Live in seconds.
- **Vercel** — `vercel` in this folder, or import from Git.
- **Cloudflare Pages / GitHub Pages** — connect a repo or upload directly.
- Any shared cPanel host — upload via FTP to `public_html`.

## Launch checklist
- [x] WhatsApp number wired in
- [x] Professional pricing defaults (update with your real quotes)
- [x] Advisor voice + multi-brand positioning
- [x] SEO + social share preview (og-image) + favicon
- [x] Lead capture backend hook + spam honeypot
- [x] Formspree `captureEndpoint` connected (leads hit tosin.peter@gmail.com)
- [x] Deployed live on Netlify (solarisee.netlify.app)
- [x] Domain updated in the 3 places (canonical, robots, sitemap)
- [x] GitHub repo + continuous deployment (push to `main` → auto-deploy)
- [x] Google Analytics 4 live (Meta Pixel still pending — add ID when running ads)
- [x] Privacy policy page (`privacy.html`) — linked from footer + cookie banner
- [x] Structured data (LocalBusiness + FAQ rich results)
- [ ] Point a custom domain (optional)
- [ ] Swap gradient placeholders for real install photos
- [ ] Update email + office address in the footer
- [ ] Add real Google reviews / testimonials + set up a Google Business Profile

---
_Update brand, pricing, contact and legal details to match your business before going live._
