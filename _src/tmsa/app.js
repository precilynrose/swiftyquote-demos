"use strict";

/* =====================================================================
   SETTINGS: adjust these lines for your own set-up
   ===================================================================== */
const SETTINGS = {
  QUOTE_EMAIL: "sales@swiftyquote.com",  // where quotation requests are sent
  QUOTE_CC: "",        // always copied on every quotation request
  TRACKING_TAG: "swiftyquote.com",          // always added to the email subject so requests can be tracked
  QUOTE_ENDPOINT: ""                        // optional: URL of a form service (e.g. Formspree). If set, requests are POSTed there instead of opening the mail app.
};

/* =====================================================================
   DEMO FAQ
   ===================================================================== */
const DEMO_CONTACT = { email:"sales@swiftyquote.com", site:"https://www.swiftyquote.com" };
const DEMO_FAQ = [
  { q:"What is this demo?",
    a:"<p>A working example of a custom product configurator with a built-in quotation request, made by SwiftyQuote. It guides buyers through the choices for a product in plain language, then lets them download their configuration as a PDF or request a quotation.</p>" },
  { q:"Is the product information real? Can I order from this page?",
    a:"<p>The product data and photos belong to Turbines, Inc. and are used here for demonstration only. This page is not an official Turbines, Inc. tool and you cannot place orders on it. Please contact Turbines, Inc. directly for real enquiries about the TMSA 3A Series.</p>" },
  { q:"Can you build this for my own products?",
    a:"<p>Yes. The configurator is built around your product range, your options and your rules, and it takes on your branding: your logo, colours and fonts. It works for anything a buyer has to specify before they can get a quote, such as range, power, approvals, outputs or accessories.</p>" },
  { q:"What do you need from me to get started?",
    a:"<ul><li>A link to the product page, or the datasheets and catalogue.</li><li>Your logo and brand guidelines (or we take them from your website).</li><li>The options a buyer can choose, and any rules, such as which combinations are possible or which approvals apply.</li><li>The email address (or system) where quotation requests should go.</li></ul>" },
  { q:"How much does it cost?",
    a:"<p>The price depends on how many products and options are covered, whether you need extra languages, and whether it should connect to your other systems. We give you a fixed quote after a short conversation, so there are no surprises.</p><p>Write to <a href=\"mailto:sales@swiftyquote.com?subject=Configurator%20price%20enquiry\">sales@swiftyquote.com</a> with a link to your product and we will come back with a price.</p>" },
  { q:"How long does implementation take?",
    a:"<p>The timeline depends on the size of your range and the features you choose. A single-product configurator like this one is quicker than a full catalogue with several product families. You receive a clear timeline together with your quote, and you see a first working version early so you can give feedback before we finish.</p>" },
  { q:"Can it use our branding and languages?",
    a:"<p>Yes. This demo already follows the Turbines, Inc. colours and fonts. Your version follows yours. Additional languages can be added.</p>" },
  { q:"Where do the quotation requests go?",
    a:"<p>To whichever address or system you choose. In this demo, the button opens a pre-filled email that contains the full configuration. Your own version can send requests straight to your sales inbox or another system, so your team receives them in a clean, complete format.</p>" },
  { q:"Can it show prices or connect to our ERP or CRM?",
    a:"<p>This demo deliberately shows no prices: buyers get a quotation instead. If you want, indicative prices from your price list can be shown, and connections to your CRM or other systems can be discussed as part of the scope.</p>" },
  { q:"How do I put it on my website?",
    a:"<p>It can be delivered as a page you link to, or embedded in your existing website. It is a lightweight page that does not depend on a specific website platform.</p>" },
  { q:"Does it work on phones and tablets?",
    a:"<p>Yes. It is designed for phones first: large tap targets, a fixed Back and Continue bar, and a layout that adapts down to small screens. Try it on your phone.</p>" },
  { q:"What happens to the details buyers enter?",
    a:"<p>They are used only to send the quotation request to you. Nothing is stored in the page itself. Let us know your data-protection requirements and we will build them in.</p>" },
  { q:"Can I change products or options later?",
    a:"<p>Yes. Products, options, texts and rules are kept in one place, so updates such as a new range or a new option are quick to make.</p>" }
];

const IMG = { M:"__IMG_M__" };
const LOGO_URL = "";

/* =====================================================================
   PRODUCT DATA
   Source: Turbines, Inc. TMSA 3A Series data sheet V2 (2 pages; "Model Number Designation for 3A Turbine Meter and 3A Rebuild Kit" p2)
   and the TMSA product page on turbinesincorporated.com.
   Part number: [style][size][end fitting]-[3A]-[bearing]-[pickup]   e.g. TMSA0100X2-3A-G-2HUB (data sheet example)
   Blank positions are left out.
   ===================================================================== */
const INDUSTRIES = [
  { id:"dairy",  title:"Dairy",                      desc:"Milk, cream, whey, yoghurt bases." },
  { id:"food",   title:"Food and beverage",          desc:"Juice, beer, wine, syrups, sauces, water." },
  { id:"pharma", title:"Pharmaceutical or biotech",  desc:"Purified water, buffers, process liquids." },
  { id:"care",   title:"Cosmetics and personal care", desc:"Lotions, shampoos, liquid ingredients." },
  { id:"other",  title:"Something else",             desc:"We will look at it together with you." }
];
const NEEDS = [
  { id:"yes", title:"Yes, it must comply with the 3A Sanitary Standard", desc:"Often required for dairy and other inspected food lines." },
  { id:"no",  title:"No, a sanitary design is enough",                  desc:"Sanitary connections and stainless steel, without the 3A listing." },
  { id:"unk", title:"Not sure",                                         desc:"We will check it with you." }
];
const TEMPS = [
  { id:"t400", title:"−100 to 400 °F",  desc:"−73 to 204 °C. Cold product, ambient, hot fill and CIP.", badge:"Most common" },
  { id:"t450", title:"400 to 450 °F",   desc:"204 to 232 °C. Up to the 450 °F limit in the data sheet." },
  { id:"tout", title:"Below −100 °F or above 450 °F", desc:"Outside the standard range: Turbines, Inc. advises on other options.", flag:"high" },
  { id:"tunk", title:"Not sure",        desc:"We will check it with you." }
];
const KINDS = [
  { id:"meter", code:"TMSA", title:"A new TMSA meter",               desc:"Complete sanitary style turbine flow meter.", badge:"Most common" },
  { id:"kit",   code:"TKSA", title:"A TKSA rebuild kit",             desc:"Sanitary style turbine meter rebuild kit for a meter you already have." }
];
/* Turbine flow meter size, data sheet p1 (flow range) and p2 (code, standard end fitting) */
const SIZES = [
  ["0050","1/2″",  1.25, 10,  "1″",    "1.984″"],
  ["0058","5/8″",  1.75, 16,  "1″",    "1.984″"],
  ["0075","3/4″",  2.5,  30,  "1″",    "1.984″"],
  ["0100","1″",    4,    60,  "1″",    "1.984″"],
  ["0125","1 1/4″",6,    93,  "1 1/2″","1.984″"],
  ["0150","1 1/2″",8,    130, "1 1/2″","1.984″"],
  ["0200","2″",    15,   225, "2″",    "2.516″"],
  ["0300","3″",    40,   650, "3″",    "3.579″"]
].map(([id,title,lo,hi,inlet,flange]) => ({ id, title, lo, hi, inlet, flange,
  desc:`${lo}–${hi} GPM (${lpm(lo)}–${lpm(hi)} L/min). Standard ends: ${inlet} inlet diameter, ${flange} flange.` }));
function lpm(g){ const v = g * 3.785; return v < 10 ? v.toFixed(1) : String(Math.round(v)); }
/* Optional end fitting size, data sheet p2 */
const FITS = [
  { id:"std",  code:"",       inlet:null,     title:"Standard end fitting",   badge:"Standard" },
  { id:"X1/2", code:"X1/2",   inlet:"1/2″",   title:"1/2″ inlet, 0.984″ flange" },
  { id:"X3/4", code:"X3/4",   inlet:"3/4″",   title:"3/4″ inlet, 0.984″ flange" },
  { id:"X114", code:"X1 1/4", inlet:"1 1/4″", title:"1 1/4″ inlet, 1.984″ flange" },
  { id:"X112", code:"X1 1/2", inlet:"1 1/2″", title:"1 1/2″ inlet, 1.984″ flange" },
  { id:"X2",   code:"X2",     inlet:"2″",     title:"2″ inlet, 2.516″ flange" },
  { id:"X3",   code:"X3",     inlet:"3″",     title:"3″ inlet, 3.579″ flange" }
];
/* 3A compliant materials, surface finish, etc. */
const COMPS = [
  { id:"3A",   code:"3A", title:"3A Sanitary Standard compliant",       desc:"3A compliant materials and surface finish (3A Sanitary Standard 28-04)." },
  { id:"none", code:"",   title:"Not 3A compliant (standard sanitary)", desc:"Same sanitary meter without 3A compliance. Code position left blank." }
];
const BEARINGS = [
  { id:"G",   code:"G", title:"Carbon graphite M100", desc:"Hard carbon composite bearings." },
  { id:"R",   code:"R", title:"Rulon® 123",           desc:"Rulon® 123 bearings." },
  { id:"unk", code:"?", title:"Not sure, please advise", desc:"Turbines, Inc. recommends the bearing for your liquid." }
];
const PICKUPS = [
  { id:"std",  code:"",     title:"Standard single magnetic coil",               desc:"One pulse signal to a display, flow monitor or PLC counter input.", badge:"Standard" },
  { id:"2HUB", code:"2HUB", title:"Two magnetic pickup coils",                   desc:"Two separate pulse signals, e.g. for two instruments or a back-up signal." },
  { id:"PAI",  code:"PAI",  title:"Single coil with integrated pulse amplifier",  desc:"Amplified pulse output from the meter itself." },
  { id:"2PAI", code:"2PAI", title:"Two coils with integrated pulse amplifiers",   desc:"Two amplified pulse outputs." }
];
const ELECTRONICS = [
  { id:"no",  title:"No, the meter only",                  desc:"Your own display, PLC or flow computer reads the pulses." },
  { id:"yes", title:"Yes, include a display or flow monitor", desc:"Turbines, Inc. offers matching electronics: quoted as a separate item." }
];

const SPECS = [
  ["Meter sizes",       "1/2 in to 3 in; 1.25 to 650 GPM"],
  ["Linearity",         "+/-0.5% over standard flow range"],
  ["Repeatability",     "+/-0.1% over standard flow range"],
  ["Operating temperature", "-100 F to 450 F (consult factory for other options)"],
  ["Cleaning methods",  "CIP / SIP / COP / SOP; surface finish minimum 32 uin Ra"],
  ["Materials",         "Body 316 stainless steel; rotor 17-4 PH stainless steel; bearings hard carbon composite or Rulon(R) 123"],
  ["Connections",       "Sanitary"],
  ["Certifications",    "3A Sanitary Standards 28-04, CRN certified, NIST"]
];

/* =====================================================================
   STATE
   ===================================================================== */
const STEPS = [
  { id:"app",    label:"Application" },
  { id:"meter",  label:"Meter size" },
  { id:"ends",   label:"End fittings" },
  { id:"build",  label:"Build" },
  { id:"signal", label:"Signal & extras" },
  { id:"review", label:"Review" }
];
const $ = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => [...el.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const byId = (arr,id) => arr.find(x => x.id === id);

function newState(){
  return { step:0, maxStep:0, industry:null, need:null, temp:null, fMin:"", fMax:"",
           kind:null, size:null, serial:"", fit:null, comp:null, bearing:null, pickup:null, elec:null,
           qty:1, notes:"", ref:makeRef(), helpOpen:{} };
}
function makeRef(){
  const d = new Date(), p = n => String(n).padStart(2,"0");
  const rnd = Math.random().toString(36).slice(2,6).toUpperCase();
  return `TI-${String(d.getFullYear()).slice(2)}${p(d.getMonth()+1)}${p(d.getDate())}-${rnd}`;
}
let S = newState();

/* ---------- rules ---------- */
const num = v => { const t = String(v).trim().replace(",", "."); return /^\d+(\.\d+)?$/.test(t) ? +t : null; };
function flow(){
  const mn = num(S.fMin), mx = num(S.fMax);
  const badMin = !!S.fMin.trim() && (mn === null || mn <= 0);
  const badMax = !!S.fMax.trim() && (mx === null || mx <= 0);
  const order = mn !== null && mx !== null && mn > mx;
  return { mn: badMin ? null : mn, mx: badMax ? null : mx, badMin: badMin || order, badMax, order, ok: !badMin && !badMax && !order };
}
const sizeObj = () => byId(SIZES, S.size || "");
function rawSizeWhy(s){
  const f = flow(); if (!f.ok) return null;
  if (f.mx !== null && f.mx > s.hi) return `Your highest flow (${f.mx} GPM) is above this size's range of ${s.lo}–${s.hi} GPM.`;
  if (f.mn !== null && f.mn < s.lo) return `Your lowest flow (${f.mn} GPM) is below this size's range of ${s.lo}–${s.hi} GPM.`;
  return null;
}
/* if no single size covers the flow, nothing is greyed out and a note explains it */
const noSizeFits = () => SIZES.every(s => rawSizeWhy(s));
const sizeOffWhy = s => noSizeFits() ? null : rawSizeWhy(s);
function fitOffWhy(f){
  const s = sizeObj();
  if (s && f.inlet && f.inlet === s.inlet) return `This is already the standard end fitting of the ${s.title} meter: choose "Standard end fitting".`;
  return null;
}
function compOffWhy(c){
  if (c.id === "none" && S.need === "yes") return "You told us the line must comply with the 3A Sanitary Standard.";
  return null;
}
function constrain(){
  const so = sizeObj(); if (so && sizeOffWhy(so)) S.size = null;
  const fo = byId(FITS, S.fit || ""); if (fo && fitOffWhy(fo)) S.fit = null;
  const co = byId(COMPS, S.comp || ""); if (co && compOffWhy(co)) S.comp = null;
  if (S.kind !== "kit") S.serial = "";
}

/* ---------- derived values ---------- */
function partNumber(){
  const k = byId(KINDS, S.kind || ""), s = sizeObj(), f = byId(FITS, S.fit || ""), c = byId(COMPS, S.comp || ""), b = byId(BEARINGS, S.bearing || ""), p = byId(PICKUPS, S.pickup || "");
  let out = (k ? k.code : "TMSA") + (s ? s.id : "????") + (f ? f.code : "");
  out += c ? (c.code ? "-" + c.code : "") : "-?";
  out += "-" + (b ? b.code : "?");
  out += p ? (p.code ? "-" + p.code : "") : "-?";
  return out;
}
const codeIsFinal = () => !partNumber().includes("?");
function flowText(){
  const f = flow(); if (!f.ok) return null;
  const u = g => `${g} GPM (${lpm(g)} L/min)`;
  if (f.mn !== null && f.mx !== null) return `${f.mn}–${f.mx} GPM (${lpm(f.mn)}–${lpm(f.mx)} L/min)`;
  if (f.mx !== null) return `Up to ${u(f.mx)}`;
  if (f.mn !== null) return `From ${u(f.mn)}`;
  return "Not given";
}
function sizeText(){ const s = sizeObj(); return s ? `${s.title} (${s.id}): ${s.lo}–${s.hi} GPM` : null; }
function fitText(){
  const f = byId(FITS, S.fit || ""), s = sizeObj(); if (!f) return null;
  if (f.id === "std") return s ? `Standard: ${s.inlet} inlet, ${s.flange} flange` : "Standard end fitting";
  return `${f.code}: ${f.title}`;
}
function kindText(){ const k = byId(KINDS, S.kind || ""); if (!k) return null; return S.kind === "kit" && S.serial.trim() ? `${k.title} (existing meter: ${S.serial.trim()})` : k.title; }

function validStep(id){
  switch(id){
    case "app":    return !!(S.industry && S.need && S.temp && flow().ok);
    case "meter":  return !!(S.kind && S.size);
    case "ends":   return !!S.fit;
    case "build":  return !!(S.comp && S.bearing);
    case "signal": return !!(S.pickup && S.elec);
    default:       return true;
  }
}
const isComplete = () => STEPS.slice(0,-1).every(s => validStep(s.id));

function getNotes(){
  const warn = [], info = [];
  const s = sizeObj(), f = flow();
  if (S.temp === "t450") warn.push("400 to 450 °F: the data sheet lists −100 to 450 °F, the product page −100 to +400 °F. The temperature limit for your meter is to be confirmed with the manufacturer");
  if (S.temp === "tout") warn.push("Your temperature is outside −100 to 450 °F. The data sheet says to consult the factory for other options.");
  if (S.temp === "tunk") warn.push("Process temperature to be confirmed (standard range −100 to 450 °F).");
  if (S.need === "unk") warn.push("Whether the line needs 3A compliance is to be confirmed with you.");
  if (S.industry === "other") warn.push("Application to be clarified with you before quotation.");
  if (f.ok && noSizeFits() && (f.mn !== null || f.mx !== null)) warn.push(`No single size covers ${flowText()}. Turbines, Inc. will advise on the size (sizes cover 1.25 to 650 GPM in total).`);
  if (S.fit && S.fit !== "std") warn.push("Optional end fitting: the data sheet does not list which optional end fittings are offered for each meter size. To be confirmed with the manufacturer");
  if (S.kind === "kit") warn.push("Rebuild kit (TKSA): the data sheet uses the same code structure as for the meter. The match with your existing meter is to be confirmed (please give its serial or model number).");
  if (S.bearing === "unk") warn.push("Bearing material to be chosen with Turbines, Inc. (shown as “?” in the part number).");
  if (S.pickup === "PAI" || S.pickup === "2PAI") warn.push("Integrated pulse amplifier: supply voltage, output signal and temperature limits are not in the data sheet. To be confirmed with the manufacturer");
  if (s && f.ok && f.mx !== null && f.mx > s.hi * 0.9 && !rawSizeWhy(s)) info.push(`Your highest flow is close to the top of the ${s.title} meter's range (${s.hi} GPM).`);
  if (S.comp === "3A") info.push("3A build: 3A compliant materials and surface finish to 3A Sanitary Standard 28-04. CRN certified.");
  if (S.elec === "yes") info.push("Display or flow monitor: quoted as a separate item. Tell us in the notes if you need rate, total, an analog output or batching.");
  info.push("Blank code positions are left out of the part number, as in the data sheet example TMSA0100X2-3A-G-2HUB.");
  info.push("Each meter's K-factor is individually documented with NIST-traceable calibration.");
  info.push("Suitable for CIP, SIP, COP and SOP cleaning. Surface finish minimum 32 µin Ra.");
  return { warn, info };
}

/* =====================================================================
   RENDER HELPERS
   ===================================================================== */
const ICON = {
  warn:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>',
  info:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
  ok:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6"/></svg>',
  pdf:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m0 0-4-4m4 4 4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>',
  mail:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>'
};
const msg = (kind, text) => `<div class="msg msg--${kind}">${ICON[kind]}<div>${esc(text)}</div></div>`;
function optHtml({name, value, checked, title, desc, meta, badge, off, type}){
  const box = type === "checkbox";
  return `<label class="opt${off?" is-off":""}">
    <input type="${box?"checkbox":"radio"}" name="${name}" value="${esc(value)}" ${checked?"checked":""} ${off?"disabled":""}>
    <span class="opt__body"><span class="opt__mark${box?" sq":""}"></span>
      <span class="opt__txt" style="flex:1"><span class="opt__title">${esc(title)}${badge?`<span class="badge">${esc(badge)}</span>`:""}</span>
      ${desc?`<span class="opt__desc">${esc(desc)}</span>`:""}${meta?`<span class="opt__meta">${esc(meta)}</span>`:""}</span>
    </span></label>`;
}
function helpHtml(stepId, title, body){
  return `<details class="help" data-help="${stepId}" ${S.helpOpen[stepId]?"open":""}><summary>${esc(title)}</summary><div class="help__body">${body}</div></details>`;
}
function head(n, title, lead){
  return `<div class="step__count">Step ${n} of ${STEPS.length}</div><h2 tabindex="-1" id="stepTitle">${esc(title)}</h2>${lead?`<p class="lead">${esc(lead)}</p>`:""}`;
}
const group = (title, sub, inner, cls) => `<div class="group"><div class="group__title">${esc(title)}</div>${sub?`<div class="group__sub">${esc(sub)}</div>`:""}<div class="opts${cls?" "+cls:""}">${inner}</div></div>`;
const radios = (name, list, extra = () => ({})) => list.map(o => optHtml({ name, value:o.id, checked:S[name]===o.id, title:o.title, desc:o.desc, badge:o.badge, ...extra(o) })).join("");
const inv = b => b ? ' aria-invalid="true"' : "";

/* =====================================================================
   STEP VIEWS
   ===================================================================== */
const VIEWS = {
  app(){
    const f = flow();
    return `<div class="step">
      ${head(1,"Where will the meter be used?","The TMSA is a sanitary turbine flow meter for liquids: 316 stainless steel body, sanitary connections and cleanable in place. Tell us about your line.")}
      ${group("What does the line carry?", null, radios("industry", INDUSTRIES))}
      ${group("Does the line need 3A compliance?", "3A Sanitary Standards apply to equipment for dairy and many other food products.", radios("need", NEEDS), "opts--wide")}
      ${group("Product temperature", "Include cleaning and sterilising temperatures (CIP/SIP).", radios("temp", TEMPS))}
      <div class="group"><div class="group__title">Flow rate</div><div class="group__sub">In US gallons per minute (1 GPM = 3.785 L/min). We use it to suggest the meter size. Leave empty if you do not know yet.</div>
        <div class="inline-field"><div class="grid2" style="margin-top:12px">
          <label class="field"><span class="l">Lowest flow, GPM (optional)</span><span class="unit-input"><input id="fMin" type="text" inputmode="decimal" value="${esc(S.fMin)}" placeholder="e.g. 10"${inv(f.badMin)}><em>GPM</em></span></label>
          <label class="field"><span class="l">Highest flow, GPM (optional)</span><span class="unit-input"><input id="fMax" type="text" inputmode="decimal" value="${esc(S.fMax)}" placeholder="e.g. 50"${inv(f.badMax)}><em>GPM</em></span></label>
        </div></div></div>
      ${helpHtml("app","Not sure whether you need 3A?",`<p>The <strong>3A Sanitary Standard</strong> is a US hygienic design standard for equipment in contact with dairy and other food products. Your quality department or the inspector's requirements tell you whether it is needed. If in doubt, choose <strong>Not sure</strong>: we check it with you.</p><p>All TMSA meters are suitable for <strong>CIP, SIP, COP and SOP</strong> cleaning.</p>`)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  meter(){
    return `<div class="step">
      ${head(2,"Which meter size?","Sizes whose flow range does not cover your flow rate are greyed out.")}
      ${group("What do you need?", null, radios("kind", KINDS), "opts--wide")}
      ${group("Meter size", "Linearity ±0.5% and repeatability ±0.1% over the standard flow range of each size.",
        SIZES.map(s => { const why = sizeOffWhy(s);
          return optHtml({ name:"size", value:s.id, checked:S.size===s.id, title:`${s.title} meter`, desc:why || s.desc, meta:s.id, off:!!why }); }).join(""))}
      ${S.kind === "kit" ? `<div class="group"><div class="group__title">Your existing meter</div><div class="group__sub">Helps Turbines, Inc. match the kit to your meter.</div>
        <div class="inline-field"><label class="field" style="margin-top:12px"><span class="l">Serial or model number of the existing meter (optional)</span><input id="serial" type="text" value="${esc(S.serial)}" placeholder="e.g. TMSA0100-3A-G"></label></div></div>` : ""}
      ${helpHtml("meter","How do I choose the size?",`<p>A turbine meter measures accurately inside its <strong>standard flow range</strong>. Pick the size whose range covers both your lowest and your highest flow. If two sizes fit, the smaller one usually keeps your normal flow further from the bottom of the range.</p><p>The meter size does not have to match your pipe size: the standard end fittings of the 1/2″ to 1″ meters have a 1″ inlet, so they fit a 1″ sanitary line.</p>`)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  ends(){
    const s = sizeObj();
    return `<div class="step">
      ${head(3,"End fittings","Sanitary clamp-style ends. Choose the standard ends of your meter size, or an optional end fitting size to match your line.")}
      ${group("End fitting size", s ? `Standard for the ${s.title} meter: ${s.inlet} inlet diameter, ${s.flange} flange.` : null,
        FITS.map(f => { const why = fitOffWhy(f);
          const desc = why || (f.id === "std" ? (s ? `${s.inlet} inlet diameter, ${s.flange} flange. Nothing added to the part number.` : "Nothing added to the part number.") : "Optional end fitting size: its code is added to the part number.");
          return optHtml({ name:"fit", value:f.id, checked:S.fit===f.id, title:f.title, desc, badge:f.badge, meta:f.code || null, off:!!why }); }).join(""))}
      ${helpHtml("ends","Which fitting do I need?",`<p>Most buyers keep the <strong>standard end fitting</strong>. Choose an optional size when your line is a different size, for example a 1/2″ meter in a 3/4″ line (option X3/4), so that no reducers are needed.</p><p>The flange diameter tells you the clamp size: 0.984″, 1.984″, 2.516″ or 3.579″.</p>`)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  build(){
    return `<div class="step">
      ${head(4,"3A build and bearings","The body is 316 stainless steel and the rotor 17-4 PH stainless steel on every meter.")}
      ${group("3A compliant materials and surface finish", null, COMPS.map(c => { const why = compOffWhy(c);
        return optHtml({ name:"comp", value:c.id, checked:S.comp===c.id, title:c.title, desc:why || c.desc, meta:c.code || "blank", off:!!why }); }).join(""), "opts--wide")}
      ${group("Bearing material", null, BEARINGS.map(b => optHtml({ name:"bearing", value:b.id, checked:S.bearing===b.id, title:b.title, desc:b.desc, meta:b.id === "unk" ? null : b.code })).join(""))}
      ${helpHtml("build","Which bearing should I choose?",`<p>Both bearing materials are listed for the TMSA. The best choice depends on your liquid, its temperature and your cleaning cycle. If you are not sure, choose <strong>Not sure, please advise</strong> and Turbines, Inc. recommends one in the quotation.</p>`)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  signal(){
    return `<div class="step">
      ${head(5,"Signal and extras","How the meter sends its flow signal, and whether you need a display.")}
      ${group("Pickup coil", "The magnetic pickup coil turns the rotor's rotation into pulses.", PICKUPS.map(p => optHtml({ name:"pickup", value:p.id, checked:S.pickup===p.id, title:p.title, desc:p.desc, badge:p.badge, meta:p.code || "blank" })).join(""), "opts--wide")}
      ${group("Do you also need a display or flow monitor?", null, radios("elec", ELECTRONICS), "opts--wide")}
      ${helpHtml("signal","Which pickup do I need?",`<ul><li><strong>Single coil:</strong> the standard choice for one display, flow monitor or counter input.</li><li><strong>Two coils:</strong> two separate pulse signals from one meter, for example one for a local display and one for the control system.</li><li><strong>Integrated pulse amplifier:</strong> the meter sends an amplified pulse. Tell us your receiving instrument and the cable length, and confirm the best option with the manufacturer.</li></ul>`)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  review(){
    const rows = summaryRows(true), n = getNotes();
    return `<div class="step">
      ${head(6,"Review your configuration","Check everything below. You can change any answer, then download the PDF or ask for a quotation.")}
      <div class="code-box"><div class="k">Part number</div><div class="v">${esc(partNumber())}</div><div class="s">${codeIsFinal() ? "Built from the data sheet's model number designation. Illustrative only: confirm with the manufacturer." : "“?” marks a choice we will confirm with you."}</div></div>
      <div class="review"><table><tbody>
        ${rows.map(r => `<tr><th scope="row">${esc(r.k)}</th><td>${r.v?esc(r.v):'<span style="color:var(--grey-400)">–</span>'}
          ${r.step!=null?`<button class="edit" type="button" data-goto="${r.step}">Change</button>`:""}</td></tr>`).join("")}
      </tbody></table></div>
      <div class="feedback" style="margin-top:16px">${n.warn.map(t => msg("warn",t)).join("")}${n.info.map(t => msg("info",t)).join("")}</div>
      <div class="group">
        <div class="group__title">Quantity</div>
        <div style="margin-top:10px" class="qty"><button type="button" data-qty="-1" aria-label="Less">−</button><input id="qty" type="number" min="1" max="9999" value="${S.qty}" aria-label="Quantity"><button type="button" data-qty="1" aria-label="More">+</button></div>
      </div>
      <div class="group">
        <label class="field"><span class="l">Notes for our team (optional)</span><textarea id="notes" placeholder="e.g. product name and viscosity, line size, tag numbers, receiving instrument, delivery date…">${esc(S.notes)}</textarea></label>
      </div>
      <div class="actions">
        <button class="btn btn--primary btn--lg" type="button" id="btnQuote">${ICON.mail} Get a quotation</button>
        <button class="btn btn--ghost btn--lg" type="button" id="btnPdf">${ICON.pdf} Download as PDF</button>
        <button class="btn btn--text" type="button" id="btnReset">Start over</button>
      </div>
    </div>`;
  }
};

const FEEDBACK = {
  app(){
    const out = [], f = flow();
    if (S.temp === "t400") out.push(msg("ok","Good news: your temperature is inside the standard range of the TMSA."));
    if (f.order) out.push(msg("warn","The lowest flow is higher than the highest flow. Please check the two values."));
    else if (!f.ok) out.push(msg("warn","Please enter the flow as a number greater than 0, e.g. 25 or 12.5."));
    else if (f.mn !== null || f.mx !== null){
      const fit = SIZES.filter(s => !rawSizeWhy(s));
      out.push(fit.length ? msg("ok",`Sizes that cover your flow: ${fit.map(s => s.title).join(", ")}.`) : msg("warn",`No single size covers ${flowText()}. You can still choose a size: we will advise.`));
    }
    getNotes().warn.filter(w => /400 to 450|outside|to be confirmed|clarified/i.test(w)).forEach(w => out.push(msg("warn",w)));
    if (S.need === "yes") out.push(msg("info","The 3A compliant build will be preselected in step 4."));
    return out.join("");
  },
  meter(){
    const out = [], s = sizeObj();
    if (noSizeFits() && flowText() && flowText() !== "Not given") out.push(msg("warn",`No single size covers ${flowText()}: all sizes are shown. Turbines, Inc. will advise.`));
    if (s) out.push(msg("ok",`${s.title} meter, code ${s.id}: ${s.lo}–${s.hi} GPM.`));
    getNotes().info.filter(i => /close to the top/.test(i)).forEach(i => out.push(msg("info",i)));
    if (S.kind === "kit") out.push(msg("info","For a rebuild kit choose the size of your existing meter."));
    return out.join("");
  },
  ends(){
    const out = [];
    if (S.fit === "std") out.push(msg("ok","Standard end fittings: nothing is added to the part number."));
    getNotes().warn.filter(w => /end fitting/.test(w)).forEach(w => out.push(msg("warn",w)));
    return out.join("");
  },
  build(){
    const out = [];
    if (S.comp === "3A") out.push(msg("ok","3A Sanitary Standard 28-04 compliant build: “-3A” in the part number."));
    if (S.bearing === "unk") out.push(msg("info","Fine: the bearing shows as “?” in the part number until it is confirmed with the manufacturer."));
    return out.join("");
  },
  signal(){
    return getNotes().warn.filter(w => /amplifier/.test(w)).map(w => msg("warn",w)).join("");
  }
};

/* =====================================================================
   SUMMARY PANEL
   ===================================================================== */
function summaryRows(forReview){
  const g = i => forReview ? i : null;
  const past = i => S.maxStep > i || forReview;
  return [
    { k:"Line carries",        v:byId(INDUSTRIES,S.industry||"")?.title || null, step:g(0) },
    { k:"3A required",         v:byId(NEEDS,S.need||"")?.title || null, step:g(0) },
    { k:"Product temperature", v:byId(TEMPS,S.temp||"")?.title || null, step:g(0) },
    { k:"Flow rate",           v:past(0) ? flowText() : null, step:g(0) },
    { k:"Product",             v:kindText(), step:g(1) },
    { k:"Meter size",          v:sizeText(), step:g(1) },
    { k:"End fittings",        v:fitText(), step:g(2) },
    { k:"3A build",            v:byId(COMPS,S.comp||"")?.title || null, step:g(3) },
    { k:"Bearings",            v:byId(BEARINGS,S.bearing||"")?.title || null, step:g(3) },
    { k:"Pickup coil",         v:byId(PICKUPS,S.pickup||"")?.title || null, step:g(4) },
    { k:"Display / monitor",   v:byId(ELECTRONICS,S.elec||"")?.title || null, step:g(4) },
    { k:"Quantity",            v:S.step >= 5 ? String(S.qty) : null, step:null }
  ];
}
function renderSummary(){
  const s = sizeObj();
  $("#sumModel").textContent = s ? `${S.kind === "kit" ? "TKSA rebuild kit" : "TMSA meter"} ${s.title}` : (S.kind === "kit" ? "TKSA 3A rebuild kit" : "TMSA 3A sanitary turbine meter");
  const bits = [s ? `${s.lo}–${s.hi} GPM` : null, S.comp === "3A" ? "3A compliant" : null, byId(INDUSTRIES,S.industry||"")?.title].filter(Boolean);
  $("#sumSub").textContent = bits.length ? bits.join(" · ") : "Your choices appear here as you go.";
  $("#sumCode").textContent = S.kind || S.size ? partNumber() : "";
  $("#sumList").innerHTML = summaryRows(false).map(r =>
    `<div class="row"><dt>${esc(r.k)}</dt><dd class="${r.v?"":"empty"}">${r.v?esc(r.v):"–"}</dd></div>`).join("");
}

/* =====================================================================
   NAVIGATION
   ===================================================================== */
function renderStepper(){
  $("#stepper").innerHTML = STEPS.map((s,i) => {
    const cls = i === S.step ? "current" : (i < S.step ? "done" : "");
    const reachable = i <= S.maxStep && (i === S.step || STEPS.slice(0,i).every(x => validStep(x.id)));
    return `<li class="${cls}"><button type="button" data-goto="${i}" ${reachable?"":"disabled"} ${i===S.step?'aria-current="step"':""}>
      <span class="bar"></span><span class="lbl">${i+1}. ${esc(s.label)}</span></button></li>`;
  }).join("");
}
function renderNav(){
  const id = STEPS[S.step].id, last = S.step === STEPS.length - 1, ok = validStep(id);
  $("#nav").innerHTML = `
    ${S.step > 0 ? `<button class="btn btn--ghost" type="button" id="btnBack">← Back</button>` : "<span></span>"}
    ${last ? "" : `<div style="display:flex;align-items:center;gap:14px">${ok ? "" : `<span class="nav__hint">${hintFor(id)}</span>`}<button class="btn btn--primary" type="button" id="btnNext" ${ok?"":"disabled"}>Continue →</button></div>`}`;
}
function hintFor(id){
  if (id === "app") return flow().ok ? "Please answer all questions." : "Please check the flow rate.";
  if (id === "meter") return !S.kind ? "Please choose a meter or a rebuild kit." : "Please choose a meter size.";
  if (id === "ends") return "Please choose the end fittings.";
  if (id === "build") return !S.comp ? "Please choose the 3A build." : "Please choose the bearing material.";
  if (id === "signal") return !S.pickup ? "Please choose the pickup coil." : "Please answer the display question.";
  return "";
}
function renderStep(focus){
  const id = STEPS[S.step].id;
  $("#stage").innerHTML = VIEWS[id]();
  renderStepper(); renderNav(); renderSummary(); refreshFeedback();
  if (focus){ const h = $("#stepTitle"); if (h){ h.focus({preventScroll:true}); }
    (function(el){ if(!el) return; var hd=document.querySelector('header'); var off=(hd&&/sticky|fixed/.test(getComputedStyle(hd).position))?hd.offsetHeight:0; var html=document.documentElement, sb=html.style.scrollBehavior; html.style.scrollBehavior='auto'; window.scrollTo(0,Math.max(0,el.getBoundingClientRect().top+window.pageYOffset-off-8)); html.style.scrollBehavior=sb; })($("#stepper")); }
}
function refreshFeedback(){ const id = STEPS[S.step].id, el = $("#feedback"); if (el && FEEDBACK[id]) el.innerHTML = FEEDBACK[id](); }
function go(i){
  if (i < 0 || i >= STEPS.length) return;
  constrain();
  if (i === 3 && !S.comp && S.need === "yes") S.comp = "3A";
  S.step = i; S.maxStep = Math.max(S.maxStep, i);
  renderStep(true);
}
function refresh(){ renderStepper(); renderNav(); renderSummary(); refreshFeedback(); }

/* =====================================================================
   EVENTS
   ===================================================================== */
const RERENDER = { kind:1, size:1, need:0, fit:0, comp:0, bearing:0, pickup:0, elec:0, industry:0, temp:0 };
document.addEventListener("change", e => {
  const t = e.target;
  if (t.type !== "radio" && t.type !== "checkbox") return;
  const n = t.name, v = t.value;
  S[n] = v;
  constrain();
  S.maxStep = Math.max(S.maxStep, S.step);
  if (RERENDER[n]){
    const y = window.scrollY; $("#stage").innerHTML = VIEWS[STEPS[S.step].id](); window.scrollTo(0,y);
    const el = $(`input[name="${n}"][value="${v}"]`); if (el) el.focus({preventScroll:true});
  }
  refresh();
});
document.addEventListener("input", e => {
  const t = e.target;
  if (t.id === "fMin" || t.id === "fMax"){
    S[t.id] = t.value; const f = flow();
    const a = $("#fMin"), b = $("#fMax");
    const mark = (el, bad) => { if (el){ if (bad) el.setAttribute("aria-invalid","true"); else el.removeAttribute("aria-invalid"); } };
    mark(a, f.badMin); mark(b, f.badMax);
    refresh();
  }
  else if (t.id === "serial"){ S.serial = t.value; renderSummary(); }
  else if (t.id === "notes"){ S.notes = t.value; }
  else if (t.id === "qty"){ S.qty = Math.max(1, Math.min(9999, parseInt(t.value,10) || 1)); renderSummary(); }
});
document.addEventListener("toggle", e => { const d = e.target; if (d.matches && d.matches("details[data-help]")) S.helpOpen[d.dataset.help] = d.open; }, true);
document.addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  if (b.id === "btnNext") go(S.step + 1);
  else if (b.id === "btnBack") go(S.step - 1);
  else if (b.dataset.goto != null && !b.disabled) go(+b.dataset.goto);
  else if (b.dataset.qty){ S.qty = Math.max(1, Math.min(9999, S.qty + +b.dataset.qty)); $("#qty").value = S.qty; renderSummary(); }
  else if (b.id === "btnPdf") downloadPdf();
  else if (b.id === "btnQuote") openQuote();
  else if (b.id === "btnReset"){ if (confirm("Start over and clear all your choices?")){ S = newState(); renderStep(true); } }
  else if (b.dataset.close != null) closeQuote();
  else if (b.id === "doneDownload") downloadPdf();
  else if (b.id === "doneCopy") copyText(quoteText(true));
});

/* =====================================================================
   PDF
   ===================================================================== */
const pdfText = s => String(s)
  .replace(/″/g,'"').replace(/′/g,"'").replace(/¼/g,"1/4").replace(/½/g,"1/2").replace(/[–—]/g,"-").replace(/≤/g,"<=").replace(/≥/g,">=")
  .replace(/[“”]/g,'"').replace(/[’‘]/g,"'").replace(/™/g,"(TM)").replace(/®/g,"(R)").replace(/²/g,"2").replace(/Ω/g,"ohm").replace(/µ/g,"u")
  .replace(/\s?°C/g," C").replace(/\s?°F/g," F").replace(/°/g," deg").replace(/±/g,"+/-")
  .replace(/·/g,"|").replace(/×/g,"x").replace(/−/g,"-").replace(/→/g,"->");
function loadImg(src, w, h){
  return new Promise((res, rej) => {
    const i = new Image();
    i.onload = () => { const c = document.createElement("canvas"); c.width = w; c.height = h; const x = c.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0,0,w,h); x.drawImage(i,0,0,w,h); res(c.toDataURL("image/jpeg", .9)); };
    i.onerror = rej; i.src = src;
  });
}
function buildPdf(logo, photo){
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit:"mm", format:"a4" });
  const W = 210, M = 18, CW = W - 2*M, GAP = 12, COL = (CW - GAP)/2, X1 = M, X2 = M + COL + GAP;
  const NAVY = [10,42,102], INK = [51,58,66], GREY = [118,124,132], LINE = [209,213,216], RED = [229,25,55], AMBER = [200,120,0];
  const code = partNumber();
  const today = new Date().toLocaleDateString("en-GB", { day:"2-digit", month:"long", year:"numeric" });
  const PAGE_END = 277; let y = 0;
  const T = t => pdfText(t);
  const hair = (x1, yy, x2) => { doc.setDrawColor(...LINE); doc.setLineWidth(.25); doc.line(x1, yy, x2, yy); };
  const small = (t, x, yy, o = {}) => { doc.setFont("helvetica", o.bold ? "bold" : "normal"); doc.setFontSize(o.size || 8); doc.setTextColor(...(o.color || GREY)); if (o.space) doc.setCharSpace(o.space); doc.text(T(t), x, yy, o.align ? { align:o.align } : undefined); if (o.space) doc.setCharSpace(0); };
  const newPage = () => { doc.addPage(); small(`SwiftyQuote demo  |  Product configuration ${code}  |  Ref. ${S.ref}`, M, 14, { size:7.5 }); hair(M, 17, W - M); y = 28; };
  const need = h => { if (y + h > PAGE_END) newPage(); };
  const section = (title, x, yy, w) => { small(title.toUpperCase(), x, yy, { size:7, bold:true, space:.5 }); hair(x, yy + 2.2, x + w); return yy + 8; };
  const item = (label, value, x, yy, w) => { small(label, x, yy, { size:7.5 }); doc.setFont("helvetica","bold"); doc.setFontSize(9.6); doc.setTextColor(...NAVY); const vl = doc.splitTextToSize(T(value || "-"), w); doc.text(vl, x, yy + 4.2); return yy + 4.2 + vl.length * 4.1 + 2.4; };
  const compact = (label, value, x, yy, w) => { small(label, x, yy, { size:7 }); doc.setFont("helvetica","bold"); doc.setFontSize(8.6); doc.setTextColor(...NAVY); const vl = doc.splitTextToSize(T(value || "-"), w); doc.text(vl, x, yy + 3.9); return yy + 3.9 + vl.length * 3.7 + 2.8; };
  const para = (t, x, yy, w, o = {}) => { doc.setFont("helvetica","normal"); doc.setFontSize(o.size || 8.6); doc.setTextColor(...(o.color || INK)); const l = doc.splitTextToSize(T(t), w); doc.text(l, x, yy); return yy + l.length * (o.lh || 4.1) + (o.gap == null ? 2 : o.gap); };
  const bullet = (t, x, yy, w, color) => { doc.setFillColor(...color); doc.rect(x, yy - 2, 1.4, 1.4, "F"); return para(t, x + 4.5, yy, w - 4.5); };

  small("Unofficial demo by SwiftyQuote", M, 20, { size:9, bold:true });
  small("Product configuration", W - M, 17, { size:10, bold:true, color:NAVY, align:"right" });
  small(`Ref. ${S.ref}   |   ${today}`, W - M, 22, { size:8, align:"right" });
  small(S.kind === "kit" ? "TKSA 3A sanitary turbine meter rebuild kit" : "TMSA 3A sanitary turbine flow meter", W - M, 26.5, { size:8, align:"right" });
  hair(M, 32, W - M);
  y = 42;

  const IW = 32;
  if (photo) doc.addImage(photo, "JPEG", W - M - IW, y - 6, IW, IW, undefined, "FAST");
  doc.setFont("helvetica","bold"); doc.setFontSize(19); doc.setTextColor(...NAVY);
  const cl = [];
  code.split("-").forEach((part, i) => { const piece = (i ? "-" : "") + part, last = cl.length - 1;
    if (last >= 0 && doc.getTextWidth(cl[last] + piece) <= CW - IW - 8) cl[last] += piece; else cl.push(piece); });
  doc.text(cl, M, y + 4);
  let ty = y + 4 + cl.length * 7.5;
  small(`${sizeText() || ""}  |  ${byId(COMPS,S.comp||"")?.title || ""}`, M, ty, { size:9.5 });
  ty = para("Sanitary style turbine flow meter for liquids: 316 stainless steel body, 17-4 PH stainless steel rotor, sanitary connections, CIP/SIP/COP/SOP cleanable. Linearity +/-0.5% and repeatability +/-0.1% over the standard flow range.", M, ty + 6, CW - IW - 8, { size:8.6, color:GREY });
  small(codeIsFinal() ? "Part number built from the data sheet's model number designation; illustrative only, confirm with the manufacturer." : "\"?\" in the part number marks a choice to be confirmed.", M, ty + 1, { size:7.2 });
  y = Math.max(ty + 6, y + IW - 2);

  const R = Object.fromEntries(summaryRows(true).map(r => [r.k, r.v]));
  let yl = section("Application", X1, y, COL), yr = section("Meter", X2, y, COL);
  yl = item("Line carries", R["Line carries"], X1, yl, COL);
  yl = item("3A required", R["3A required"], X1, yl, COL);
  yl = item("Product temperature", R["Product temperature"], X1, yl, COL);
  yl = item("Flow rate", R["Flow rate"], X1, yl, COL);
  yr = item("Product", R["Product"], X2, yr, COL);
  yr = item("Meter size", R["Meter size"], X2, yr, COL);
  yr = item("End fittings", R["End fittings"], X2, yr, COL);
  yr = item("3A build  |  quantity", `${R["3A build"]}  |  ${S.qty} pcs`, X2, yr, COL);
  y = Math.max(yl, yr) + 3;

  need(40);
  y = section("Bearings, signal and extras", M, y, CW);
  yl = item("Bearing material", R["Bearings"], X1, y, COL);
  yl = item("Display or flow monitor", R["Display / monitor"], X1, yl, COL);
  yr = item("Pickup coil", R["Pickup coil"], X2, y, COL);
  y = Math.max(yl, yr) + 3;

  const n = getNotes();
  need(30);
  if (!n.warn.length && !S.notes.trim()){ y = section("Good to know", M, y, CW); n.info.forEach(t => { y = bullet(t, M, y + .6, CW, RED) + .2; }); y += 3; }
  else {
    yl = section(n.warn.length ? "Points we will check with you" : "Your notes", X1, y, COL); yr = section("Good to know", X2, y, COL);
    if (n.warn.length) n.warn.forEach(t => { yl = bullet(t, X1, yl + .6, COL, AMBER) + .6; }); else yl = para(S.notes.trim(), X1, yl, COL, { size:8.8 });
    n.info.forEach(t => { yr = bullet(t, X2, yr + .6, COL, RED) + .6; });
    y = Math.max(yl, yr) + 3;
    if (n.warn.length && S.notes.trim()){ need(22); y = section("Your notes", M, y, CW); y = para(S.notes.trim(), M, y, CW, { size:8.8 }) + 3; }
  }

  const half = Math.ceil(SPECS.length / 2);
  need(10 + half * 10);
  y = section("Technical data (from the Turbines, Inc. TMSA 3A Series data sheet)", M, y + 1, CW);
  yl = y; yr = y;
  SPECS.forEach(([k, v], i) => { if (i < half) yl = compact(k, v, X1, yl, COL); else yr = compact(k, v, X2, yr, COL); });

  const pages = doc.getNumberOfPages();
  doc.setPage(pages);
  small("Demo only, not for ordering. Illustrative: confirm all specifications with the manufacturer. Source: Turbines, Inc. TMSA 3A Series data sheet V2.", M, 280.5, { size:6.8 });
  for (let p = 1; p <= pages; p++){
    doc.setPage(p); hair(M, 284, W - M);
    small("Unofficial demo by SwiftyQuote  |  sales@swiftyquote.com  |  Not affiliated with Turbines, Inc.", M, 289, { size:6.8 });
    small(`${p} / ${pages}`, W - M, 289, { size:7, align:"right" });
  }
  return doc;
}
const pdfName = () => `Turbines_${partNumber().replace(/\?/g,"x").replace(/[\/ ]/g,"_")}_${S.ref}.pdf`;
async function downloadPdf(){
  if (!isComplete()){ toast("Please complete all steps first."); return; }
  const btns = $$("#btnPdf,#doneDownload"); btns.forEach(b => b.disabled = true);
  try {
    const logo = null;
    const photo = await loadImg(IMG.M, 400, 400).catch(() => null);
    buildPdf(logo, photo).save(pdfName());
    toast("PDF downloaded");
  } catch (err){ console.error(err); toast("Could not create the PDF. Opening the print dialog instead."); setTimeout(() => window.print(), 600); }
  finally { btns.forEach(b => b.disabled = false); }
}

/* =====================================================================
   QUOTATION
   ===================================================================== */
function configLines(){
  const out = [`Part number: ${partNumber()}`];
  summaryRows(true).forEach(r => { if (r.k !== "Quantity") out.push(`${r.k}: ${r.v || "-"}`); });
  out.push(`Quantity: ${S.qty}`);
  return out;
}
const quoteSubject = () => `Quotation request: ${partNumber()} (${S.ref}) | ${SETTINGS.TRACKING_TAG}`;
function quoteText(withHeaders){
  const f = Object.fromEntries(new FormData($("#quoteForm")).entries());
  const n = getNotes();
  return [
    ...(withHeaders ? [`To: ${SETTINGS.QUOTE_EMAIL}`, ...(SETTINGS.QUOTE_CC ? [`Cc: ${SETTINGS.QUOTE_CC}`] : []), `Subject: ${quoteSubject()}`, ""] : []),
    `Quotation request | ${S.kind === "kit" ? "TKSA 3A rebuild kit" : "TMSA 3A sanitary turbine flow meter"} | Ref. ${S.ref}`, "",
    "CONFIGURATION", ...configLines(),
    ...(n.warn.length ? ["", "TO BE CHECKED", ...n.warn.map(w => "- " + w)] : []),
    ...(S.notes.trim() ? ["", "CUSTOMER NOTES", S.notes.trim()] : []),
    ...(f.message && f.message.trim() ? ["", "MESSAGE", f.message.trim()] : []),
    "", "CONTACT",
    `Name: ${f.name || ""}`, `Company: ${f.company || ""}`, `Email: ${f.email || ""}`, `Phone: ${f.phone || ""}`, `Delivery to: ${f.place || ""}`
  ].join("\n");
}
const buildMailto = body => `mailto:${SETTINGS.QUOTE_EMAIL}?${SETTINGS.QUOTE_CC ? `cc=${encodeURIComponent(SETTINGS.QUOTE_CC)}&` : ""}subject=${encodeURIComponent(quoteSubject())}&body=${encodeURIComponent(body)}`;
let lastFocus = null;
function openQuote(){
  if (!isComplete()){ toast("Please complete all steps first."); return; }
  lastFocus = document.activeElement;
  $("#quoteChip").textContent = `${partNumber()} × ${S.qty}`;
  $("#quoteFormView").hidden = false; $("#quoteDoneView").hidden = true;
  $("#quoteModal").classList.add("open"); document.body.style.overflow = "hidden";
  setTimeout(() => $("#quoteForm [name=name]").focus(), 30);
}
function closeQuote(){ $("#quoteModal").classList.remove("open"); document.body.style.overflow = ""; if (lastFocus) lastFocus.focus(); }
$("#quoteModal").addEventListener("mousedown", e => { if (e.target.id === "quoteModal") closeQuote(); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && $("#quoteModal").classList.contains("open")) closeQuote(); });
$("#quoteForm").addEventListener("submit", async e => {
  e.preventDefault();
  const form = e.target; let ok = true;
  ["name","company","email"].forEach(k => {
    const el = form.elements[k]; const bad = !el.value.trim() || (k === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(el.value.trim()));
    el.classList.toggle("invalid", bad); if (bad && ok){ el.focus(); ok = false; }
  });
  if (!ok) return;
  const subject = quoteSubject(), body = quoteText();
  const done = (title, text) => { $("#doneTitle").textContent = title; $("#doneText").textContent = text; $("#quoteFormView").hidden = true; $("#quoteDoneView").hidden = false; };
  if (SETTINGS.QUOTE_ENDPOINT){
    try {
      const r = await fetch(SETTINGS.QUOTE_ENDPOINT, { method:"POST", headers:{ "Content-Type":"application/json", "Accept":"application/json" },
        body: JSON.stringify({ subject, to: SETTINGS.QUOTE_EMAIL, cc: SETTINGS.QUOTE_CC, message: body, email: form.elements.email.value, name: form.elements.name.value, ref: S.ref }) });
      if (!r.ok) throw new Error(r.status);
      done("Request sent", `Thank you, ${form.elements.name.value.split(" ")[0]}. We received your request (ref. ${S.ref}) and will get back to you shortly.`);
      return;
    } catch (err){ console.error(err); toast("Sending failed. Opening your email app instead."); }
  }
  window.__lastMailto = buildMailto(body);
  window.location.href = window.__lastMailto;
  done("Your email is ready to send", `We opened a pre-filled email to ${SETTINGS.QUOTE_EMAIL} in your mail app. Please press Send there. If nothing opened, use "Copy request text" and paste it into an email (the copied text includes the recipient and the subject line). Tip: download the PDF and attach it for a faster reply.`);
});
async function copyText(t){
  try { await navigator.clipboard.writeText(t); toast("Copied to clipboard"); }
  catch { const ta = document.createElement("textarea"); ta.value = t; document.body.appendChild(ta); ta.select(); try{ document.execCommand("copy"); toast("Copied to clipboard"); }catch{ toast("Copy not available"); } ta.remove(); }
}
let toastTimer;
function toast(t){ const el = $("#toast"); el.textContent = t; el.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove("show"), 3200); }

(function renderFaq(){
  $("#faqList").innerHTML = DEMO_FAQ.map(f => `<details><summary>${esc(f.q)}</summary><div class="faq__a">${f.a}</div></details>`).join("");
  $("#faqCta").href = `mailto:${DEMO_CONTACT.email}?subject=${encodeURIComponent("Configurator enquiry (from the Turbines, Inc. demo)")}`;
  $("#faqContact").innerHTML = `Or write to <a href="mailto:${DEMO_CONTACT.email}">${DEMO_CONTACT.email}</a> · <a href="${DEMO_CONTACT.site}" target="_blank" rel="noopener">swiftyquote.com</a>`;
})();

window.__cfg = { get S(){ return S; }, set S(v){ S = v; }, newState, go, partNumber, getNotes, buildPdf, buildMailto, quoteText, isComplete, renderStep, constrain, sizeOffWhy, fitOffWhy, compOffWhy, flow };
renderStep(false);
