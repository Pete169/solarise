/* ============================================================
   SolaRise — site interactions
   Edit CONFIG below to point at your real business details.
   ============================================================ */
const CONFIG = {
  whatsappNumber: "2347034394459",         // <-- your WhatsApp number, intl format, no +
  whatsappMessage: "Hello SolaRise, I'd like a free consultation and quote for a solar inverter system.",

  // ---- LEAD CAPTURE (so no enquiry is ever lost) ----
  // Paste a free Formspree endpoint (or your own API URL) to have EVERY form
  // submission emailed to you / saved to a dashboard — even if the customer
  // never finishes the WhatsApp chat. Get one free at https://formspree.io
  // Example: "https://formspree.io/f/abcdwxyz"
  captureEndpoint: "https://formspree.io/f/xkolqgwo",

  // After submitting, also open WhatsApp to start the conversation immediately.
  // Keep true for your WhatsApp-first workflow. If captureEndpoint is empty,
  // WhatsApp is the only channel, so leave this true.
  openWhatsAppOnSubmit: true,
};

/* ---------- SYSTEM PRICING MODEL (edit to match your real prices) ---------- */
const SYSTEMS = {
  starter:  { name: "Starter 3.5kVA Hybrid", spec: "3.5kVA inverter • 5kWh lithium • 4× 550W panels", price: 2800000, dailyKwh: 8 },
  home:     { name: "Home 5kVA Hybrid",      spec: "5kVA inverter • 10kWh lithium • 6× 550W panels",  price: 5200000, dailyKwh: 14 },
  max:      { name: "Max 10kVA Hybrid",      spec: "10kVA inverter • 15kWh lithium • 10× 550W panels", price: 9800000, dailyKwh: 24 },
};

/* ---------- FINANCING SETTINGS (edit to match your real plans) ---------- */
const FINANCING = {
  defaultSystem: "home",
  defaultDownPct: 30,
  defaultTenure: 12,
  // Indicative annual interest on the financed balance. 0 = simple "spread the cost".
  // Set your financing partner's real rate here (e.g. 24 for 24%/yr) when known.
  annualInterestPct: 0,
};

const naira = n => "₦" + Math.round(n).toLocaleString("en-NG");
const nairaShort = n => n >= 1e6 ? "₦" + (n/1e6).toFixed(1).replace(/\.0$/,"") + "M" : naira(n);

/* ============ NAV ============ */
const nav = document.getElementById("nav");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

window.addEventListener("scroll", () => nav.classList.toggle("scrolled", window.scrollY > 12));
navToggle.addEventListener("click", () => {
  navToggle.classList.toggle("open");
  navLinks.classList.toggle("open");
});
navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  navToggle.classList.remove("open");
  navLinks.classList.remove("open");
}));

/* ============ WHATSAPP LINKS ============ */
const waHref = (msg) => `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg || CONFIG.whatsappMessage)}`;
["waLink", "waFloat", "waFooter"].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.href = waHref();
});

/* ============ CALCULATOR ============ */
const els = {
  grid: document.getElementById("gridBill"),
  fuel: document.getElementById("fuelSpend"),
  type: document.getElementById("propType"),
  backup: document.getElementById("backup"),
  backupVal: document.getElementById("backupVal"),
  name: document.getElementById("resName"),
  spec: document.getElementById("resSpec"),
  savings: document.getElementById("resSavings"),
  payback: document.getElementById("resPayback"),
  price: document.getElementById("resPrice"),
  energy: document.getElementById("resEnergy"),
  lifetime: document.getElementById("resLifetime"),
  bar: document.getElementById("resBar"),
  barLabel: document.getElementById("resBarLabel"),
  cta: document.getElementById("resCta"),
};
const BACKUP_LABELS = ["", "Essentials only", "Essentials + comfort", "Whole home"];

function pickSystem() {
  const monthly = (+els.grid.value || 0) + (+els.fuel.value || 0);
  const type = els.type.value;
  const backup = +els.backup.value;
  // Score by spend + property + backup priority
  let score = 0;
  score += monthly > 90000 ? 2 : monthly > 45000 ? 1 : 0;
  score += { apartment: 0, house: 1, large: 2, business: 2 }[type];
  score += backup - 1;
  if (score >= 4) return "max";
  if (score >= 2) return "home";
  return "starter";
}

function runCalc() {
  els.backupVal.textContent = BACKUP_LABELS[+els.backup.value];
  const monthlySpend = (+els.grid.value || 0) + (+els.fuel.value || 0);
  const key = pickSystem();
  const sys = SYSTEMS[key];

  // Solar offsets ~85% of current spend on a right-sized system
  const monthlySavings = Math.max(0, monthlySpend * 0.85);
  const paybackMonths = monthlySavings > 0 ? sys.price / monthlySavings : 0;
  const lifetime = monthlySavings * 12 * 10; // 10-yr avoided cost

  els.name.textContent = sys.name;
  els.spec.textContent = sys.spec;
  els.savings.textContent = naira(monthlySavings) + "/mo";
  els.price.textContent = naira(sys.price);
  els.energy.textContent = sys.dailyKwh + " kWh/day";
  els.lifetime.textContent = nairaShort(lifetime);
  els.cta.dataset.system = sys.name;

  if (paybackMonths > 0) {
    const totalMos = Math.round(paybackMonths);   // round first so 71.9 → 72, not "5y 12m"
    const yrs = Math.floor(totalMos / 12);
    const mos = totalMos % 12;
    els.payback.textContent = yrs > 0 ? `${yrs}y ${mos}m` : `${mos} mo`;
    // bar: shorter payback = fuller (capped at 5 yrs reference)
    const pct = Math.max(8, Math.min(100, (1 - paybackMonths / 60) * 100));
    els.bar.style.width = pct + "%";
    els.barLabel.textContent = paybackMonths <= 36 ? "Fast payback — great fit ⚡" : "Steady payback";
  } else {
    els.payback.textContent = "—";
    els.bar.style.width = "8%";
    els.barLabel.textContent = "Enter your bills above";
  }
}
["input", "change"].forEach(ev => {
  document.getElementById("calcForm").addEventListener(ev, runCalc);
});
runCalc();

// CTA carries the chosen system into the quote form
els.cta.addEventListener("click", () => {
  const sel = document.getElementById("qSystem");
  const chosen = els.cta.dataset.system || "";
  [...sel.options].forEach(o => { if (chosen.includes(o.text.split(" ")[0])) sel.value = o.value; });
});

/* ============ ANIMATED COUNTERS ============ */
function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  const decimals = +(el.dataset.decimals || 0);
  const suffix = el.dataset.suffix || "";
  const dur = 1400; const start = performance.now();
  function tick(now) {
    const p = Math.min(1, (now - start) / dur);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = (target * eased).toFixed(decimals) + suffix;
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = target.toFixed(decimals) + suffix;
  }
  requestAnimationFrame(tick);
}

/* ============ SCROLL REVEAL + COUNTERS ============ */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    e.target.querySelectorAll("[data-count]").forEach(animateCount);
    if (e.target.matches("[data-count]")) animateCount(e.target);
    io.unobserve(e.target);
  });
}, { threshold: 0.18 });

document.querySelectorAll(".section, .hero__trust").forEach(el => { el.classList.add("reveal"); io.observe(el); });

/* ============ QUOTE FORM ============ */
const form = document.getElementById("quoteForm");
const status = document.getElementById("formStatus");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Honeypot: real users leave this hidden field empty; bots fill it.
  const hp = document.getElementById("qCompany");
  if (hp && hp.value) { form.reset(); return; }

  const data = {
    name: document.getElementById("qName").value.trim(),
    phone: document.getElementById("qPhone").value.trim(),
    location: document.getElementById("qLocation").value.trim(),
    system: document.getElementById("qSystem").value,
    message: document.getElementById("qMsg").value.trim(),
    _subject: "New SolaRise consultation request",
  };
  if (!data.name || !data.phone || !data.location) {
    status.textContent = "Please add your name, phone and location so we can reach you.";
    status.className = "form__status err";
    return;
  }

  const waText =
    `New solar consultation request%0A%0A` +
    `Name: ${data.name}%0APhone: ${data.phone}%0ALocation: ${data.location}%0A` +
    `Interested in: ${data.system}%0ANotes: ${data.message || "—"}`;
  const waUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${waText}`;

  status.textContent = "Sending…";
  status.className = "form__status";

  let captured = false;
  if (CONFIG.captureEndpoint) {
    try {
      const res = await fetch(CONFIG.captureEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      captured = res.ok;
    } catch (err) { captured = false; }   // network fail — WhatsApp still catches the lead
  }

  let opened = false;
  if (CONFIG.openWhatsAppOnSubmit) {
    window.open(waUrl, "_blank");
    opened = true;
  }

  if (captured || opened) {
    let msg = captured
      ? "✅ Thanks! Your request is in — we'll reach out within 24 hours."
      : "✅ Thanks! Sending your request now.";
    if (opened) msg += " WhatsApp is opening so we can chat right away.";
    status.textContent = msg;
    status.className = "form__status ok";
    form.reset();
  } else {
    status.textContent = "Couldn't send automatically — please WhatsApp or call us and we'll sort it out.";
    status.className = "form__status err";
  }
});

/* ============ BRAND MATCHER ============ */
// Honest, advisor-style brand profiles. attrs scored 0–5 across four dimensions.
// Edit these to reflect the brands you actually stock and your real view of them.
const BRANDS = {
  deye:    { name: "Deye", tagline: "Top-tier hybrid performance",
    attrs: { value: 3, perf: 5, support: 4, premium: 3 },
    why: ["Excellent for heavy loads and future expansion", "Modern hybrid tech with strong efficiency", "Widely respected — a popular premium choice in Nigeria"],
    trade: "Not the cheapest option, but you're paying for genuine performance." },
  growatt: { name: "Growatt", tagline: "The reliable all-rounder",
    attrs: { value: 4, perf: 4, support: 4, premium: 2 },
    why: ["A strong balance of performance and price", "Proven, widely used across Nigerian homes", "Solid monitoring app and easy support"],
    trade: "Not as feature-loaded as the premium European brands — but most homes don't need that." },
  felicity:{ name: "Felicity", tagline: "Trusted and easy to service",
    attrs: { value: 4, perf: 3, support: 5, premium: 1 },
    why: ["Strong local presence — easy to service and source parts", "Dependable batteries with a good track record", "Great value for everyday home backup"],
    trade: "Performance ceiling is lower than Deye for very heavy or commercial loads." },
  luminous:{ name: "Luminous", tagline: "Familiar and budget-friendly",
    attrs: { value: 5, perf: 2, support: 4, premium: 1 },
    why: ["The most wallet-friendly entry into solar", "A familiar, widely-recognised household name", "Dependable for lights, fans, fridge and essentials"],
    trade: "Best for lighter loads — not ideal for multiple ACs or business-critical use." },
  victron: { name: "Victron", tagline: "Best-in-class European engineering",
    attrs: { value: 1, perf: 5, support: 2, premium: 5 },
    why: ["Reference-grade reliability and flexibility", "Ideal for complex or business-critical setups", "Exceptional build quality and long lifespan"],
    trade: "Premium pricing — usually overkill for a simple apartment." },
  sma:     { name: "SMA", tagline: "Premium European dependability",
    attrs: { value: 2, perf: 4, support: 2, premium: 5 },
    why: ["German engineering with a rock-solid reputation", "Excellent for grid-tie and high-reliability needs", "Long service life and strong efficiency"],
    trade: "Premium price and fewer local service centres than the popular brands." },
};

const mState = { priority: "perf", budget: "balanced", use: "home" };

function scoreBrands() {
  // base weights per dimension
  const w = { value: 1, perf: 1, support: 1, premium: 1 };
  w[mState.priority] += 2.5;                                  // what matters most
  if (mState.budget === "tight")    { w.value += 2; w.premium -= 1.5; }
  if (mState.budget === "premium")  { w.premium += 1.5; w.perf += 1; }
  if (mState.use === "apartment")   { w.value += 1; w.premium -= 0.5; }
  if (mState.use === "business")    { w.perf += 1.5; w.support += 1; w.premium += 0.5; }

  const ranked = Object.entries(BRANDS).map(([key, b]) => {
    const raw = b.attrs.value*w.value + b.attrs.perf*w.perf + b.attrs.support*w.support + b.attrs.premium*w.premium;
    return { key, b, raw };
  }).sort((a, z) => z.raw - a.raw);

  const max = ranked[0].raw, min = ranked[ranked.length-1].raw;
  ranked.forEach(r => r.match = Math.round(72 + ((r.raw - min) / (max - min || 1)) * 26)); // 72–98%
  return ranked;
}

function renderMatch() {
  const ranked = scoreBrands();
  const top = ranked[0], runner = ranked[1];
  document.getElementById("mBrand").textContent = top.b.name;
  document.getElementById("mTagline").textContent = top.b.tagline;
  document.getElementById("mFill").style.width = top.match + "%";
  document.getElementById("mMatchLabel").textContent = top.match + "% match to your answers";
  document.getElementById("mWhy").innerHTML = top.b.why.map(x => `<li>${x}</li>`).join("");
  document.getElementById("mTrade").textContent = top.b.trade;
  document.getElementById("mRunner").textContent = `${runner.b.name} — ${runner.b.tagline.toLowerCase()}.`;
  document.getElementById("mCta").dataset.brand = top.b.name;
}

const matcherForm = document.getElementById("matcherForm");
if (matcherForm) {
  matcherForm.querySelectorAll(".mq__opts").forEach(group => {
    group.addEventListener("click", (e) => {
      const btn = e.target.closest("button"); if (!btn) return;
      mState[group.dataset.q] = btn.dataset.v;
      group.querySelectorAll("button").forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      renderMatch();
    });
  });
  renderMatch();
}

/* ============ FINANCING CALCULATOR ============ */
const finForm = document.getElementById("finForm");
if (finForm) {
  const finSel = document.getElementById("finSystem");
  // populate system options from SYSTEMS (single source of truth for prices)
  finSel.innerHTML = Object.entries(SYSTEMS)
    .map(([k, s]) => `<option value="${k}">${s.name} — ${naira(s.price)}</option>`).join("");
  finSel.value = FINANCING.defaultSystem;

  const finState = { system: FINANCING.defaultSystem, downPct: FINANCING.defaultDownPct, tenure: FINANCING.defaultTenure };

  function renderFinance() {
    const price = SYSTEMS[finState.system].price;
    const deposit = price * (finState.downPct / 100);
    const spread = price - deposit;
    const interest = spread * (FINANCING.annualInterestPct / 100) * (finState.tenure / 12);
    const monthly = (spread + interest) / finState.tenure;

    document.getElementById("finDownVal").textContent = `${finState.downPct}% · ${naira(deposit)}`;
    document.getElementById("finMonthly").textContent = naira(monthly) + "/mo";
    document.getElementById("finTerm").textContent = `over ${finState.tenure} months`;
    document.getElementById("finPrice").textContent = naira(price);
    document.getElementById("finDeposit").textContent = naira(deposit);
    document.getElementById("finSpread").textContent = naira(spread);

    const intRow = document.getElementById("finInterestRow");
    if (interest > 0) { intRow.hidden = false; document.getElementById("finInterest").textContent = naira(interest); }
    else { intRow.hidden = true; }

    // Tie back to the savings calculator: compare to their generator-fuel spend if entered
    const fuel = +(document.getElementById("fuelSpend")?.value || 0);
    const compare = document.getElementById("finCompare");
    if (fuel > 0) {
      if (monthly <= fuel) {
        compare.textContent = `That's about ${naira(fuel - monthly)}/mo LESS than the ₦${fuel.toLocaleString("en-NG")} you spend on generator fuel — your power could cost less than it does today.`;
      } else {
        compare.textContent = `Roughly ${naira(monthly - fuel)}/mo more than your current ₦${fuel.toLocaleString("en-NG")} fuel bill — and at the end of the term, the power is yours for good.`;
      }
    } else {
      compare.textContent = "Many customers find this is close to their current generator-fuel bill — except it ends, and then the power is free.";
    }
  }

  finSel.addEventListener("change", () => { finState.system = finSel.value; renderFinance(); });
  document.getElementById("finDown").addEventListener("input", (e) => { finState.downPct = +e.target.value; renderFinance(); });
  document.getElementById("finTenure").addEventListener("click", (e) => {
    const btn = e.target.closest("button"); if (!btn) return;
    finState.tenure = +btn.dataset.v;
    document.querySelectorAll("#finTenure button").forEach(b => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    renderFinance();
  });
  // keep the fuel-comparison fresh if they change the savings calculator
  document.getElementById("fuelSpend")?.addEventListener("input", renderFinance);
  renderFinance();
}

/* ============ FOR-BUSINESS CTA ============ */
document.getElementById("bizCta")?.addEventListener("click", () => {
  const sel = document.getElementById("qSystem");
  if (sel) [...sel.options].forEach(o => { if (o.text.includes("Commercial")) sel.value = o.value; });
});

/* ============ YEAR ============ */
document.getElementById("year").textContent = new Date().getFullYear();
