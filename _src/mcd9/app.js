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
    a:"<p>The product data and photos belong to McDaniel Controls, Inc. and are used here for demonstration only. This page is not an official McDaniel Controls tool and you cannot place orders on it. Please contact McDaniel Controls directly for real enquiries about the Series 9 gauges.</p>" },
  { q:"Can you build this for my own products?",
    a:"<p>Yes. The configurator is built around your product range, your options and your rules, and it takes on your branding: your logo, colours and fonts. It works for anything a buyer has to specify before they can get a quote, such as range, power, approvals, outputs or accessories.</p>" },
  { q:"What do you need from me to get started?",
    a:"<ul><li>A link to the product page, or the datasheets and catalogue.</li><li>Your logo and brand guidelines (or we take them from your website).</li><li>The options a buyer can choose, and any rules, such as which combinations are possible or which approvals apply.</li><li>The email address (or system) where quotation requests should go.</li></ul>" },
  { q:"How much does it cost?",
    a:"<p>The price depends on how many products and options are covered, whether you need extra languages, and whether it should connect to your other systems. We give you a fixed quote after a short conversation, so there are no surprises.</p><p>Write to <a href=\"mailto:sales@swiftyquote.com?subject=Configurator%20price%20enquiry\">sales@swiftyquote.com</a> with a link to your product and we will come back with a price.</p>" },
  { q:"How long does implementation take?",
    a:"<p>The timeline depends on the size of your range and the features you choose. A single-product configurator like this one is quicker than a full catalogue with several product families. You receive a clear timeline together with your quote, and you see a first working version early so you can give feedback before we finish.</p>" },
  { q:"Can it use our branding and languages?",
    a:"<p>Yes. This demo already follows the McDaniel Controls colours and fonts. Your version follows yours. Additional languages can be added.</p>" },
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
   Source: McDaniel Controls Series 9 brochure K9E9G91201 (2 pages; "How to order", range table and
   "Special Configuration Adder Codes" on p2) and the Series 9 brochure page on mcdanielcontrols.com.
   Part number: [model][range code][mounting]-[special codes]-[filling]   e.g. K9D-GF (data sheet example)
   Blank positions are left out.
   ===================================================================== */
const MEDIA = [
  { id:"gen",   title:"Water, air, oil or hydraulic fluid", desc:"General utility service." },
  { id:"corr",  title:"Corrosive liquids or gases",         desc:"Chemicals, salt water, sour or wet process media." },
  { id:"oxid",  title:"Strong oxidizers",                   desc:"Chlorine, nitric acid, hydrogen peroxide and similar." },
  { id:"o2",    title:"Oxygen",                             desc:"Oxygen gas lines and cylinders." },
  { id:"nh3",   title:"Ammonia",                            desc:"Ammonia refrigeration systems." },
  { id:"other", title:"Something else",                     desc:"We will look at it together with you." }
];
const VIBS = [
  { id:"yes", title:"Yes, vibration or pulsation", desc:"Pumps, compressors, engines, hydraulic power units." },
  { id:"no",  title:"No, a steady pressure",       desc:"Static lines, tanks, regulators." },
  { id:"unk", title:"Not sure",                    desc:"We will check it with you." }
];
/* Model, data sheet p1 (dial, stem and socket) and p2 (How to order step 1) */
const MODELS = [
  { id:"K9", dial:"2 1/2″ (63 mm)", npt:"1/4″ NPT", back:"L", backTxt:"lower-back", title:"K9: 2 1/2″ dial (63 mm), 1/4″ NPT",
    desc:"Compact gauge. Removable restrictor screw standard. 1/8″ NPT by special order.", badge:"Most compact" },
  { id:"E9", dial:"4″ (100 mm)",     npt:"1/4″ NPT", back:"C", backTxt:"center-back", title:"E9: 4″ dial (100 mm), 1/4″ NPT",
    desc:"Large, easy-to-read dial on a 1/4″ NPT connection." },
  { id:"G9", dial:"4″ (100 mm)",     npt:"1/2″ NPT", back:"C", backTxt:"center-back", title:"G9: 4″ dial (100 mm), 1/2″ NPT",
    desc:"Large dial on a sturdier 1/2″ NPT connection." }
];
const MOUNTS = [
  { id:"bottom", title:"Bottom connection",            desc:"Stem at the bottom of the case: the gauge is carried by the pipe. Standard, no code.", badge:"Standard" },
  { id:"back",   title:"Back connection",              desc:"Stem at the back of the case: lower-back on the K9 (L), center-back on the E9 and G9 (C)." },
  { id:"U",      title:"U-clamp panel mounting",       desc:"Back connected gauge, held in a panel cut-out by a U-clamp from behind." },
  { id:"P",      title:"Front flange panel mounting",  desc:"Back connected gauge with a front flange screwed to the front of the panel." },
  { id:"R",      title:"Rear flange (surface mounting)", desc:"Flange on the back of the case to mount the gauge on a wall or bracket. Back or bottom connection." }
];
const THREADS = [
  { id:"std", code:"",    title:"Standard connection thread", badge:"Standard" },
  { id:"18",  code:"1/8", title:"1/8″ NPT (special order)",   desc:"Smaller thread for the K9. Non-stock." }
];
const TYPES = [
  { id:"press", title:"Pressure",                   desc:"0 to 15 psi up to 0 to 10,000 psi." },
  { id:"vac",   title:"Vacuum",                     desc:"30″Hg vacuum to 0." },
  { id:"comp",  title:"Vacuum and pressure (compound)", desc:"30″Hg vacuum to +15 psi up to +300 psi." },
  { id:"rec",   title:"Pneumatic receiver, 3–15 psi", desc:"Reads a 3–15 psi pneumatic signal. Dual scale 0–100% and 0–10 square root." }
];
/* Range codes and minor increments (K9 / E9 and G9), data sheet p2 */
const RANGES = [
  ["A","press",15,".5",".25"], ["B","press",30,"1",".5"], ["C","press",60,"2","1"], ["D","press",100,"2","1"],
  ["E","press",160,"5","2"], ["F","press",200,"4","2"], ["G","press",300,"10","5"], ["H","press",400,"10","5"],
  ["I","press",600,"20","10"], ["J","press",800,"20","10"], ["K","press",1000,"20","10"], ["L","press",1500,"50","25"],
  ["M","press",2000,"40","20"], ["N","press",3000,"100","50"], ["4k","press",4000,"100",null], ["O","press",5000,"100","50"],
  ["6k","press",6000,"200","100"], ["P","press",10000,"200","100"],
  ["S","vac",0,"1",".5"],
  ["T","rec",15,"2","2"],
  ["U","comp",15,"2-0-1","2-0-1"], ["V","comp",30,"2-0-1","2-0-1"], ["W","comp",60,"5-0-2","1-0-1"], ["X","comp",100,"5-0-2","5-0-2"],
  ["Y","comp",160,"5-0-5","5-0-5"], ["2k","comp",200,"10-0-5","10-0-5"], ["Z","comp",300,"10-0-10","10-0-5"]
].map(([id,type,hi,k9,e9]) => ({ id, type, hi, k9, e9,
  title: type === "press" ? `0–${hi.toLocaleString("en-US")} psi` : type === "vac" ? "30″Hg vacuum – 0" : type === "rec" ? "3–15 psi receiver" : `30″Hg vacuum – ${hi} psi` }));
const bar = p => { const v = p * 0.0689476; return v < 10 ? v.toFixed(v < 1 ? 2 : 1).replace(/\.0+$/,"") : String(Math.round(v)); };
const SCALES = [
  { id:"psi", code:"",    title:"psi only",                badge:"Standard" },
  { id:"B",   code:"B",   title:"psi and bar (dual scale)", desc:"Second scale in bar. Non-stock." },
  { id:"K",   code:"K",   title:"psi and kPa (dual scale)", desc:"Second scale in kPa. Non-stock." },
  { id:"NH3", code:"NH3", title:"Ammonia scale",            desc:"Dial with an ammonia scale for refrigeration service." }
];
const OXYS = [
  { id:"no", code:"",  title:"No oxygen cleaning",      desc:"For all other media." },
  { id:"O",  code:"O", title:"Oxygen cleaned (O2 service)", desc:"Cleaned for oxygen service. Non-stock." }
];
const LENSES = [
  { id:"poly",  title:"Polycarbonate",          desc:"Standard lens.", badge:"Standard" },
  { id:"glass", title:"Laminated safety glass", desc:"By special order." }
];
const FILLS = [
  { id:"dry", code:"",   title:"Dry, liquid fillable later", desc:"Supplied unfilled. Can be filled in the field later." },
  { id:"GF",  code:"GF", title:"Glycerin filled at the factory", desc:"Steadies the pointer against vibration and pulsation." }
];
const RESTRS = [
  { id:"yes", title:"With removable restrictor screw", desc:"Small orifice in the socket that damps pressure spikes and pulsation." },
  { id:"no",  title:"Without restrictor screw",        desc:"Open socket." }
];

const SPECS = [
  ["Dial sizes",        "2 1/2 in (63 mm) K9; 4 in (100 mm) E9 and G9"],
  ["Accuracy",          "ASME B40.1 Grade A (2-1-2%)"],
  ["Case and ring",     "304 stainless steel, filled or fillable; ring crimped on; case and socket welded"],
  ["Bourdon tube",      "316 stainless steel; C form 1000 psi and below, spiral 1500 psi and above"],
  ["Stem and socket",   "316 stainless steel; K9 and E9 1/4 in NPT, G9 1/2 in NPT"],
  ["Pressure utilization", "300% of full scale without rupture; 130% without loss of accuracy"],
  ["Dial and pointer",  "White enameled aluminum dial, black figures; black enameled aluminum pointer"],
  ["Lens and movement", "Polycarbonate lens (laminated safety glass by special order); stainless steel movement"]
];

/* =====================================================================
   STATE
   ===================================================================== */
const STEPS = [
  { id:"app",   label:"Application" },
  { id:"size",  label:"Size & mounting" },
  { id:"range", label:"Range" },
  { id:"dial",  label:"Dial & options" },
  { id:"fill",  label:"Filling" },
  { id:"review",label:"Review" }
];
const $ = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => [...el.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const byId = (arr,id) => arr.find(x => x.id === id);

function newState(){
  return { step:0, maxStep:0, media:null, vib:null, pMax:"",
           model:null, mount:null, thread:null, ptype:null, range:null,
           scale:null, oxy:null, lens:null, fill:null, restr:null,
           qty:1, notes:"", ref:makeRef(), helpOpen:{} };
}
function makeRef(){
  const d = new Date(), p = n => String(n).padStart(2,"0");
  const rnd = Math.random().toString(36).slice(2,6).toUpperCase();
  return `MC-${String(d.getFullYear()).slice(2)}${p(d.getMonth()+1)}${p(d.getDate())}-${rnd}`;
}
let S = newState();

/* ---------- rules ---------- */
const num = v => { const t = String(v).trim().replace(/,/g, ""); return /^\d+(\.\d+)?$/.test(t) ? +t : null; };
function pres(){
  const v = num(S.pMax), bad = !!S.pMax.trim() && (v === null || v <= 0);
  return { v: bad ? null : v, bad, ok: !bad };
}
const modelObj = () => byId(MODELS, S.model || "");
const rangeObj = () => byId(RANGES, S.range || "");
const inc = r => { const m = modelObj(); return m && m.id !== "K9" ? r.e9 : r.k9; };
function rawRangeWhy(r){
  const p = pres();
  if (p.v !== null && (r.type === "press" || r.type === "comp") && r.hi < p.v) return `Full scale (${r.hi.toLocaleString("en-US")} psi) is below your highest working pressure of ${p.v.toLocaleString("en-US")} psi.`;
  return null;
}
/* if no range covers the pressure, the pressure rule is dropped and a note explains it */
const noRangeFits = () => { const p = pres(); return p.v !== null && p.v > 10000; };
function rangeOffWhy(r){
  const m = modelObj();
  if (r.id === "4k" && m && m.id !== "K9") return "The data sheet lists the 0–4000 psi range (4k) for the K9 only.";
  return noRangeFits() ? null : rawRangeWhy(r);
}
/* suggested: the smallest range of the chosen type whose full scale is at least 4/3 of the highest pressure (pressure at most 75% of scale) */
function suggested(){
  const p = pres(); if (p.v === null || !(S.ptype === "press" || S.ptype === "comp")) return null;
  return RANGES.find(r => r.type === S.ptype && !rangeOffWhy(r) && r.hi * 0.75 >= p.v) || null;
}
function threadOffWhy(t){
  if (t.id === "18" && S.model && S.model !== "K9") return `1/8″ NPT is a special order for the K9 only. The ${S.model} comes with ${modelObj().npt}.`;
  return null;
}
function scaleOffWhy(s){
  if (S.range === "T" && s.id !== "psi") return "The receiver gauge already has its own dual scale: 0–100% and 0–10 square root.";
  return null;
}
function fillOffWhy(f){
  if (f.id !== "GF") return null;
  if (S.media === "oxid" || S.media === "o2") return "Data sheet warning: glycerin filled gauges should not be used with strong oxidizing agents (chlorine, nitric acid, hydrogen peroxide).";
  if (S.oxy === "O") return "Glycerin filling is not used on an oxygen cleaned gauge: oxygen is a strong oxidizing agent.";
  return null;
}
function restrOffWhy(r){
  if (r.id === "no" && S.model === "K9") return "The removable restrictor screw is standard on the K9.";
  return null;
}
function constrain(){
  const to = byId(THREADS, S.thread || ""); if (to && threadOffWhy(to)) S.thread = null;
  const ro = rangeObj(); if (ro && (ro.type !== S.ptype || rangeOffWhy(ro))) S.range = null;
  const so = byId(SCALES, S.scale || ""); if (so && scaleOffWhy(so)) S.scale = null;
  const fo = byId(FILLS, S.fill || ""); if (fo && fillOffWhy(fo)) S.fill = null;
  const re = byId(RESTRS, S.restr || ""); if (re && restrOffWhy(re)) S.restr = null;
  if (S.model === "K9" && !S.restr) S.restr = "yes";
}

/* ---------- derived values ---------- */
function mountCode(){
  if (!S.mount) return "?";
  if (S.mount === "bottom") return "";
  if (S.mount === "back") { const m = modelObj(); return m ? m.back : "?"; }
  return S.mount;
}
function specials(){
  const out = [];
  const sc = byId(SCALES, S.scale || ""), ox = byId(OXYS, S.oxy || ""), th = byId(THREADS, S.thread || "");
  /* same order as the data sheet's adder code list: B, K, O, 1/8, NH3 */
  if (!sc) out.push("?"); else if (sc.code && sc.code !== "NH3") out.push(sc.code);
  if (!ox) out.push("?"); else if (ox.code) out.push(ox.code);
  if (!th) out.push("?"); else if (th.code) out.push(th.code);
  if (sc && sc.code === "NH3") out.push("NH3");
  return out;
}
function partNumber(){
  const r = rangeObj(), f = byId(FILLS, S.fill || "");
  let out = (S.model || "??") + (r ? r.id : "?") + mountCode();
  specials().forEach(c => { out += "-" + c; });
  out += f ? (f.code ? "-" + f.code : "") : "-?";
  return out;
}
const codeIsFinal = () => !partNumber().includes("?");
function presText(){
  const p = pres(); if (!p.ok) return null;
  return p.v !== null ? `${p.v.toLocaleString("en-US")} psi (${bar(p.v)} bar)` : "Not given";
}
function rangeText(){
  const r = rangeObj(); if (!r) return null;
  const b = r.type === "press" ? ` (0–${bar(r.hi)} bar)` : "";
  return `${r.title}${b}, code ${r.id}`;
}
function mountText(){
  const m = byId(MOUNTS, S.mount || ""); if (!m) return null;
  if (m.id === "back"){ const mo = modelObj(); return mo ? `Back connection, ${mo.backTxt} (${mo.back})` : "Back connection"; }
  return m.id === "bottom" ? "Bottom connection (standard)" : `${m.title} (${m.id})`;
}
function threadText(){
  const t = byId(THREADS, S.thread || ""), m = modelObj(); if (!t) return null;
  return t.id === "std" ? `${m ? m.npt : "Standard"} (standard)` : "1/8″ NPT (special order)";
}
function restrText(){
  const r = byId(RESTRS, S.restr || ""); if (!r) return null;
  return S.model === "K9" && r.id === "yes" ? "Removable restrictor screw (standard on K9)" : r.title;
}

function validStep(id){
  switch(id){
    case "app":   return !!(S.media && S.vib && pres().ok);
    case "size":  return !!(S.model && S.mount && S.thread);
    case "range": return !!(S.ptype && S.range);
    case "dial":  return !!(S.scale && S.oxy && S.lens);
    case "fill":  return !!(S.fill && S.restr);
    default:      return true;
  }
}
const isComplete = () => STEPS.slice(0,-1).every(s => validStep(s.id));

function getNotes(){
  const warn = [], info = [];
  const r = rangeObj(), p = pres();
  if (S.media === "other") warn.push("Medium to be clarified with you before quotation.");
  if (S.media === "o2" && S.oxy === "no") warn.push("Oxygen medium without oxygen cleaning (code O): please check. Oxygen service normally needs an oxygen cleaned gauge.");
  if ((S.media === "oxid" || S.media === "o2") && S.vib === "yes") warn.push("Vibration or pulsation, but glycerin filling cannot be used with your medium. Damping (restrictor screw or another fill fluid) to be confirmed with the manufacturer.");
  if (S.vib === "unk") warn.push("Vibration or pulsation at the mounting point to be confirmed with you.");
  if (p.ok && noRangeFits()) warn.push(`Your highest pressure (${presText()}) is above the largest Series 9 range of 0–10,000 psi. McDaniel will advise.`);
  if (r && p.v !== null && (r.type === "press" || r.type === "comp") && r.hi >= p.v && p.v > r.hi * 0.75) warn.push(`Your highest pressure is above 75% of the ${r.title} scale. The gauge stays accurate up to 130% of full scale, but a larger range gives a longer life. Please check the range.`);
  if (S.mount === "R") warn.push("Rear flange: back or bottom connection is possible. The connection position is to be confirmed with you.");
  if (S.scale === "NH3") warn.push("Ammonia scale (NH3): the dial layout and the ranges it is offered for are not in the data sheet. To be confirmed with the manufacturer.");
  if ((S.scale === "B" || S.scale === "K") && (S.range === "S" || (r && r.type === "comp"))) warn.push("Dual scale on a vacuum or compound range: the vacuum part of the second scale is to be confirmed with the manufacturer.");
  const nonstock = [S.scale === "B" ? "psi/bar dual scale" : null, S.scale === "K" ? "psi/kPa dual scale" : null, S.oxy === "O" ? "oxygen cleaning" : null, S.thread === "18" ? "1/8″ NPT" : null].filter(Boolean);
  if (nonstock.length) warn.push(`Non-stock option${nonstock.length > 1 ? "s" : ""} (${nonstock.join(", ")}): lead time to be confirmed with the manufacturer.`);
  if (S.lens === "glass") warn.push("Laminated safety glass lens is a special order without a code in the data sheet. To be confirmed with the manufacturer.");
  if (S.restr === "yes" && S.model && S.model !== "K9") warn.push(`Restrictor screw on the ${S.model}: optional, but the data sheet gives no code for it. To be confirmed with the manufacturer.`);
  if (specials().filter(c => c !== "?").length) warn.push("Special configuration codes: their order and separators in the part number are to be confirmed with the manufacturer (the data sheet example K9D-GF has none).");
  if (S.media === "nh3" && S.scale && S.scale !== "NH3") info.push("For ammonia refrigeration McDaniel also offers an ammonia scale (code NH3).");
  if (r && r.type === "press") info.push(r.hi <= 1000 ? "Ranges up to 1000 psi use a C-form 316 stainless steel bourdon tube." : "Ranges of 1500 psi and above use a spiral 316 stainless steel bourdon tube.");
  if (S.range === "T") info.push("Receiver gauge: dual scale, 0–100% primary and 0–10 square root secondary.");
  if (S.mount && S.mount !== "bottom" && S.mount !== "R") info.push("Panel, U-clamp and back connected gauges come with a polished ring.");
  if (S.fill === "dry") info.push("The gauge is liquid fillable: it can be filled in the field later.");
  info.push("Blank code positions are left out of the part number, as in the data sheet example K9D-GF (K9, 0–100 psi, bottom connection, glycerin filled).");
  info.push("316 stainless steel wetted parts, 304 stainless steel case, welded case and socket. Accuracy ASME B40.1 Grade A (2-1-2%).");
  info.push("Withstands 300% of full scale without rupture of the bourdon tube and 130% without loss of accuracy.");
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
    const p = pres();
    return `<div class="step">
      ${head(1,"What will the gauge measure?","The Series 9 is an all stainless steel utility gauge for corrosive media and harsh environments. Tell us about your installation.")}
      ${group("What is the medium?", "The wetted parts are 316 stainless steel.", radios("media", MEDIA))}
      ${group("Is there vibration or pressure pulsation?", "This tells us whether a liquid filled gauge is the better choice.", radios("vib", VIBS))}
      <div class="group"><div class="group__title">Highest working pressure</div><div class="group__sub">In psi (1 bar = 14.5 psi). We use it to suggest the range. Leave empty for vacuum, or if you do not know yet.</div>
        <div class="inline-field"><label class="field" style="margin-top:12px;max-width:320px"><span class="l">Highest working pressure, psi (optional)</span><span class="unit-input"><input id="pMax" type="text" inputmode="decimal" value="${esc(S.pMax)}" placeholder="e.g. 120"${inv(p.bad)}><em>psi</em></span></label></div></div>
      ${helpHtml("app","Why do you ask about vibration?",`<p>Vibration and pulsation make the pointer flutter, which wears the movement and makes the gauge hard to read. A <strong>glycerin filled</strong> gauge damps this. The Series 9 can be filled at the factory or later in the field.</p><p>Glycerin must not be used with <strong>strong oxidizing agents</strong> such as chlorine, nitric acid, hydrogen peroxide or oxygen (data sheet warning, see ASME B40.1).</p>`)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  size(){
    const m = modelObj();
    return `<div class="step">
      ${head(2,"Dial size and mounting","Choose the gauge model, then how it is connected and mounted.")}
      ${group("Gauge model", "All three have a 304 stainless steel case and 316 stainless steel wetted parts.", radios("model", MODELS), "opts--wide")}
      ${group("How is the gauge mounted?", null, MOUNTS.map(o => {
        const code = o.id === "bottom" ? "no code" : o.id === "back" ? (m ? m.back : "L / C") : o.id;
        return optHtml({ name:"mount", value:o.id, checked:S.mount===o.id, title:o.title, desc:o.desc, badge:o.badge, meta:code }); }).join(""))}
      ${group("Connection thread", m ? `Standard for the ${m.id}: ${m.npt}.` : null, THREADS.map(t => { const why = threadOffWhy(t);
        const desc = why || (t.id === "std" ? (m ? `${m.npt}. Nothing added to the part number.` : "Nothing added to the part number.") : t.desc);
        return optHtml({ name:"thread", value:t.id, checked:S.thread===t.id, title:t.id === "std" && m ? `${m.npt} (standard)` : t.title, desc, badge:t.badge, meta:t.code || null, off:!!why }); }).join(""), "opts--wide")}
      ${helpHtml("size","Which mounting do I need?",`<ul><li><strong>Bottom connection:</strong> the gauge screws straight into a pipe or fitting. The most common choice.</li><li><strong>Back connection:</strong> the stem leaves the back of the case, for gauges against a wall or on a manifold.</li><li><strong>U-clamp</strong> or <strong>front flange:</strong> for gauges in a control panel cut-out.</li><li><strong>Rear flange:</strong> to screw the gauge to a wall or bracket.</li></ul>`)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  range(){
    const m = modelObj(), sug = suggested();
    const list = RANGES.filter(r => r.type === S.ptype);
    return `<div class="step">
      ${head(3,"Pressure range","Ranges below your highest working pressure are greyed out.")}
      ${group("What kind of range?", null, radios("ptype", TYPES), "opts--wide")}
      ${S.ptype ? group("Range", m ? `Minor scale increments are shown for the ${m.id}.` : null, list.map(r => { const why = rangeOffWhy(r), i = inc(r);
        const unit = r.type === "vac" ? "″Hg" : r.type === "rec" ? "" : " psi";
        const desc = why || [r.type === "press" ? `0–${bar(r.hi)} bar.` : null, i ? `Minor increment ${i}${r.type === "comp" ? "" : unit}.` : null].filter(Boolean).join(" ");
        return optHtml({ name:"range", value:r.id, checked:S.range===r.id, title:r.title, desc, meta:r.id, badge:sug && sug.id === r.id ? "Suggested" : null, off:!!why }); }).join("")) : ""}
      ${helpHtml("range","How do I choose the range?",`<p>A common rule of thumb is a full scale of about <strong>twice your normal working pressure</strong>, and at least a third above your highest pressure. The gauge then reads in the middle of the dial, where it is easiest to read and lasts longest.</p><p>Series 9 gauges withstand <strong>130% of full scale</strong> without loss of accuracy and <strong>300%</strong> without rupture of the bourdon tube.</p><p>Choose <strong>compound</strong> when the line can go from vacuum to pressure, for example on pump suction.</p>`)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  dial(){
    return `<div class="step">
      ${head(4,"Dial and options","White enameled aluminum dial with black figures and a black pointer.")}
      ${group("Dial scale", null, SCALES.map(s => { const why = scaleOffWhy(s);
        return optHtml({ name:"scale", value:s.id, checked:S.scale===s.id, title:s.title, desc:why || s.desc, badge:s.badge, meta:s.code || null, off:!!why }); }).join(""))}
      ${group("Oxygen service", "Oxygen cleaned gauges are free of oil and grease.", OXYS.map(o => optHtml({ name:"oxy", value:o.id, checked:S.oxy===o.id, title:o.title, desc:o.desc, meta:o.code || null })).join(""), "opts--wide")}
      ${group("Lens", null, radios("lens", LENSES), "opts--wide")}
      ${helpHtml("dial","Do I need a dual scale?",`<p>A <strong>dual scale</strong> shows a second unit (bar or kPa) next to psi, handy for equipment used or inspected outside the US. Dual scales and oxygen cleaning are <strong>non-stock</strong> items, so allow a little more lead time.</p>`)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  fill(){
    return `<div class="step">
      ${head(5,"Filling and damping","The Series 9 is liquid fillable, at the factory or later in the field.")}
      ${group("Liquid filling", null, FILLS.map(f => { const why = fillOffWhy(f);
        return optHtml({ name:"fill", value:f.id, checked:S.fill===f.id, title:f.title, desc:why || f.desc, badge:f.id === "GF" && S.vib === "yes" && !why ? "Recommended" : null, meta:f.code || "no code", off:!!why }); }).join(""), "opts--wide")}
      ${group("Restrictor screw", S.model === "K9" ? "Standard on the K9." : "Optional on the E9 and G9.", RESTRS.map(o => { const why = restrOffWhy(o);
        return optHtml({ name:"restr", value:o.id, checked:S.restr===o.id, title:o.title, desc:why || o.desc, badge:o.id === "yes" && S.model === "K9" ? "Standard" : null, off:!!why }); }).join(""), "opts--wide")}
      ${helpHtml("fill","Filled or dry?",`<p>Choose <strong>glycerin filled</strong> for pumps, compressors and anything that shakes or pulses: the pointer stays steady and the movement lasts longer. A <strong>dry</strong> gauge is fine for steady pressure, and can still be filled later.</p><p>Do not use glycerin with strong oxidizing agents such as chlorine, nitric acid, hydrogen peroxide or oxygen.</p>`)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  review(){
    const rows = summaryRows(true), n = getNotes();
    return `<div class="step">
      ${head(6,"Review your configuration","Check everything below. You can change any answer, then download the PDF or ask for a quotation.")}
      <div class="code-box"><div class="k">Part number</div><div class="v">${esc(partNumber())}</div><div class="s">${codeIsFinal() ? "Built from the data sheet's How to order. Illustrative only: confirm with the manufacturer." : "“?” marks a choice we will confirm with you."}</div></div>
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
        <label class="field"><span class="l">Notes for our team (optional)</span><textarea id="notes" placeholder="e.g. medium and temperature, tag numbers, panel cut-out, delivery date…">${esc(S.notes)}</textarea></label>
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
    const out = [], p = pres();
    if (S.media === "gen" || S.media === "corr") out.push(msg("ok","Good fit: 316 stainless steel wetted parts and a welded stainless steel case."));
    if (S.media === "oxid" || S.media === "o2") out.push(msg("info","Data sheet warning: glycerin filled gauges should not be used with strong oxidizing agents. The glycerin option will be greyed out."));
    if (S.media === "o2") out.push(msg("info","For oxygen, choose “Oxygen cleaned” in step 4."));
    if (S.media === "nh3") out.push(msg("info","An ammonia scale (NH3) is available in step 4."));
    if (!p.ok) out.push(msg("warn","Please enter the pressure as a number greater than 0, e.g. 120 or 7.5."));
    else if (noRangeFits()) out.push(msg("warn",`${presText()} is above the largest Series 9 range (0–10,000 psi). You can still continue: McDaniel will advise.`));
    else if (p.v !== null){ const r = RANGES.find(x => x.type === "press" && x.hi * 0.75 >= p.v); if (r) out.push(msg("ok",`Suggested pressure range: ${r.title} (code ${r.id}).`)); }
    getNotes().warn.filter(w => /clarified|to be confirmed with you/i.test(w) && !/connection position/.test(w)).forEach(w => out.push(msg("warn",w)));
    return out.join("");
  },
  size(){
    const out = [], m = modelObj();
    if (m) out.push(msg("ok",`${m.id}: ${m.dial} dial, ${m.npt}.`));
    if (S.mount === "back" && m) out.push(msg("info",`Back connection on the ${m.id} is ${m.backTxt}: code ${m.back}.`));
    getNotes().warn.filter(w => /Rear flange|Non-stock/.test(w)).forEach(w => out.push(msg("warn",w)));
    return out.join("");
  },
  range(){
    const out = [], r = rangeObj(), sug = suggested();
    if (sug && !r) out.push(msg("info",`Suggested for your highest pressure: ${sug.title} (code ${sug.id}).`));
    if (r) out.push(msg("ok",`${r.title}, range code ${r.id}.`));
    if (S.ptype === "press" && S.model && S.model !== "K9") out.push(msg("info","0–4000 psi (4k) is listed for the K9 only."));
    getNotes().warn.filter(w => /75%|10,000/.test(w)).forEach(w => out.push(msg("warn",w)));
    return out.join("");
  },
  dial(){
    const out = [];
    if (S.range === "T") out.push(msg("info","The receiver gauge has its own dual scale (0–100% and 0–10 square root), so the other scales are greyed out."));
    if (S.oxy === "O") out.push(msg("info","Oxygen cleaned: glycerin filling will be greyed out in step 5."));
    getNotes().warn.filter(w => /NH3|Dual scale|Non-stock|safety glass|Oxygen medium/.test(w)).forEach(w => out.push(msg("warn",w)));
    return out.join("");
  },
  fill(){
    const out = [];
    if (S.fill === "GF") out.push(msg("ok","Glycerin filled at the factory: “-GF” at the end of the part number."));
    if (S.vib === "yes" && S.fill === "dry" && !fillOffWhy(FILLS[1])) out.push(msg("info","You told us about vibration or pulsation: a glycerin filled gauge keeps the pointer steady."));
    getNotes().warn.filter(w => /Restrictor|glycerin filling cannot/.test(w)).forEach(w => out.push(msg("warn",w)));
    return out.join("");
  }
};

/* =====================================================================
   SUMMARY PANEL
   ===================================================================== */
function summaryRows(forReview){
  const g = i => forReview ? i : null;
  const past = i => S.maxStep > i || forReview;
  return [
    { k:"Medium",            v:byId(MEDIA,S.media||"")?.title || null, step:g(0) },
    { k:"Vibration",         v:byId(VIBS,S.vib||"")?.title || null, step:g(0) },
    { k:"Highest pressure",  v:past(0) ? presText() : null, step:g(0) },
    { k:"Model",             v:modelObj() ? `${S.model}: ${modelObj().dial} dial` : null, step:g(1) },
    { k:"Mounting",          v:mountText(), step:g(1) },
    { k:"Connection",        v:threadText(), step:g(1) },
    { k:"Range",             v:rangeText(), step:g(2) },
    { k:"Dial scale",        v:byId(SCALES,S.scale||"")?.title || null, step:g(3) },
    { k:"Oxygen service",    v:byId(OXYS,S.oxy||"")?.title || null, step:g(3) },
    { k:"Lens",              v:byId(LENSES,S.lens||"")?.title || null, step:g(3) },
    { k:"Filling",           v:byId(FILLS,S.fill||"")?.title || null, step:g(4) },
    { k:"Restrictor screw",  v:S.maxStep >= 4 || forReview ? restrText() : null, step:g(4) },
    { k:"Quantity",          v:S.step >= 5 ? String(S.qty) : null, step:null }
  ];
}
function renderSummary(){
  const m = modelObj(), r = rangeObj();
  $("#sumModel").textContent = m ? `Series 9 gauge ${m.id}, ${m.dial}` : "Series 9 stainless utility gauge";
  const bits = [r ? r.title : null, S.fill === "GF" ? "glycerin filled" : null, byId(MEDIA,S.media||"")?.title].filter(Boolean);
  $("#sumSub").textContent = bits.length ? bits.join(" · ") : "Your choices appear here as you go.";
  $("#sumCode").textContent = S.model ? partNumber() : "";
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
  if (id === "app") return pres().ok ? "Please answer all questions." : "Please check the pressure.";
  if (id === "size") return !S.model ? "Please choose a gauge model." : !S.mount ? "Please choose the mounting." : "Please choose the connection thread.";
  if (id === "range") return !S.ptype ? "Please choose the kind of range." : "Please choose a range.";
  if (id === "dial") return !S.scale ? "Please choose the dial scale." : !S.oxy ? "Please answer the oxygen question." : "Please choose the lens.";
  if (id === "fill") return !S.fill ? "Please choose the filling." : "Please answer the restrictor question.";
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
  S.step = i; S.maxStep = Math.max(S.maxStep, i);
  renderStep(true);
}
function refresh(){ renderStepper(); renderNav(); renderSummary(); refreshFeedback(); }

/* =====================================================================
   EVENTS
   ===================================================================== */
const RERENDER = { model:1, ptype:1, mount:0, thread:0, range:0, media:0, vib:0, scale:0, oxy:0, lens:0, fill:0, restr:0 };
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
  if (t.id === "pMax"){
    S.pMax = t.value; const p = pres();
    if (p.bad) t.setAttribute("aria-invalid","true"); else t.removeAttribute("aria-invalid");
    refresh();
  }
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
  const NAVY = [20,20,94], INK = [52,49,58], GREY = [118,113,126], LINE = [216,212,222], PURPLE = [123,2,130], AMBER = [200,120,0];
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
  small("Series 9 liquid fillable, all stainless steel utility gauge", W - M, 26.5, { size:8, align:"right" });
  hair(M, 32, W - M);
  y = 42;

  const IW = 32;
  if (photo) doc.addImage(photo, "JPEG", W - M - IW, y - 6, IW, IW * 420/407, undefined, "FAST");
  doc.setFont("helvetica","bold"); doc.setFontSize(19); doc.setTextColor(...NAVY);
  const cl = [];
  code.split("-").forEach((part, i) => { const piece = (i ? "-" : "") + part, last = cl.length - 1;
    if (last >= 0 && doc.getTextWidth(cl[last] + piece) <= CW - IW - 8) cl[last] += piece; else cl.push(piece); });
  doc.text(cl, M, y + 4);
  let ty = y + 4 + cl.length * 7.5;
  const m = modelObj();
  small(`${m ? `${m.id}: ${m.dial} dial, ${S.thread === "18" ? "1/8″ NPT" : m.npt}` : ""}  |  ${rangeObj()?.title || ""}`, M, ty, { size:9.5 });
  ty = para("All stainless steel utility gauge: 316 stainless steel wetted parts, 304 stainless steel case with crimped-on ring, welded case and socket, liquid fillable in the field or at the factory. Accuracy ASME B40.1 Grade A (2-1-2%).", M, ty + 6, CW - IW - 8, { size:8.6, color:GREY });
  small(codeIsFinal() ? "Part number built from the data sheet's How to order; illustrative only, confirm with the manufacturer." : "\"?\" in the part number marks a choice to be confirmed.", M, ty + 1, { size:7.2 });
  y = Math.max(ty + 9, y + IW + 2);

  const R = Object.fromEntries(summaryRows(true).map(r => [r.k, r.v]));
  let yl = section("Application", X1, y, COL), yr = section("Gauge", X2, y, COL);
  yl = item("Medium", R["Medium"], X1, yl, COL);
  yl = item("Vibration or pulsation", R["Vibration"], X1, yl, COL);
  yl = item("Highest working pressure", R["Highest pressure"], X1, yl, COL);
  yr = item("Model", R["Model"], X2, yr, COL);
  yr = item("Mounting", R["Mounting"], X2, yr, COL);
  yr = item("Connection", R["Connection"], X2, yr, COL);
  yr = item("Range  |  quantity", `${R["Range"]}  |  ${S.qty} pcs`, X2, yr, COL);
  y = Math.max(yl, yr) + 3;

  need(40);
  y = section("Dial, options and filling", M, y, CW);
  yl = item("Dial scale", R["Dial scale"], X1, y, COL);
  yl = item("Oxygen service", R["Oxygen service"], X1, yl, COL);
  yl = item("Lens", R["Lens"], X1, yl, COL);
  yr = item("Filling", R["Filling"], X2, y, COL);
  yr = item("Restrictor screw", R["Restrictor screw"], X2, yr, COL);
  y = Math.max(yl, yr) + 3;

  const n = getNotes();
  need(30);
  if (!n.warn.length && !S.notes.trim()){ y = section("Good to know", M, y, CW); n.info.forEach(t => { y = bullet(t, M, y + .6, CW, PURPLE) + .2; }); y += 3; }
  else {
    yl = section(n.warn.length ? "Points we will check with you" : "Your notes", X1, y, COL); yr = section("Good to know", X2, y, COL);
    if (n.warn.length) n.warn.forEach(t => { yl = bullet(t, X1, yl + .6, COL, AMBER) + .6; }); else yl = para(S.notes.trim(), X1, yl, COL, { size:8.8 });
    n.info.forEach(t => { yr = bullet(t, X2, yr + .6, COL, PURPLE) + .6; });
    y = Math.max(yl, yr) + 3;
    if (n.warn.length && S.notes.trim()){ need(22); y = section("Your notes", M, y, CW); y = para(S.notes.trim(), M, y, CW, { size:8.8 }) + 3; }
  }

  const half = Math.ceil(SPECS.length / 2);
  need(10 + half * 10);
  y = section("Technical data (from the McDaniel Controls Series 9 data sheet)", M, y + 1, CW);
  yl = y; yr = y;
  SPECS.forEach(([k, v], i) => { if (i < half) yl = compact(k, v, X1, yl, COL); else yr = compact(k, v, X2, yr, COL); });

  const pages = doc.getNumberOfPages();
  doc.setPage(pages);
  small("Demo only, not for ordering. Illustrative: confirm all specifications with the manufacturer. Source: McDaniel Controls data sheet K9E9G91201.", M, 280.5, { size:6.8 });
  for (let p = 1; p <= pages; p++){
    doc.setPage(p); hair(M, 284, W - M);
    small("Unofficial demo by SwiftyQuote  |  sales@swiftyquote.com  |  Not affiliated with McDaniel Controls", M, 289, { size:6.8 });
    small(`${p} / ${pages}`, W - M, 289, { size:7, align:"right" });
  }
  return doc;
}
const pdfName = () => `McDaniel_${partNumber().replace(/\?/g,"x").replace(/[\/ ]/g,"_")}_${S.ref}.pdf`;
async function downloadPdf(){
  if (!isComplete()){ toast("Please complete all steps first."); return; }
  const btns = $$("#btnPdf,#doneDownload"); btns.forEach(b => b.disabled = true);
  try {
    const logo = null;
    const photo = await loadImg(IMG.M, 407, 420).catch(() => null);
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
    `Quotation request | McDaniel Series 9 stainless utility gauge | Ref. ${S.ref}`, "",
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
  $("#faqCta").href = `mailto:${DEMO_CONTACT.email}?subject=${encodeURIComponent("Configurator enquiry (from the McDaniel Controls demo)")}`;
  $("#faqContact").innerHTML = `Or write to <a href="mailto:${DEMO_CONTACT.email}">${DEMO_CONTACT.email}</a> · <a href="${DEMO_CONTACT.site}" target="_blank" rel="noopener">swiftyquote.com</a>`;
})();

window.__cfg = { get S(){ return S; }, set S(v){ S = v; }, newState, go, partNumber, getNotes, buildPdf, buildMailto, quoteText, isComplete, renderStep, constrain, rangeOffWhy, threadOffWhy, scaleOffWhy, fillOffWhy, restrOffWhy, suggested, pres };
renderStep(false);
