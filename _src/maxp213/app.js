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
    a:"<p>The product data and photos belong to Max Machinery and are used here for demonstration only. This page is not an official Max Machinery tool and you cannot place orders on it. Please contact Max Machinery directly for real enquiries about the P213.</p>" },
  { q:"Can you build this for my own products?",
    a:"<p>Yes. The configurator is built around your product range, your options and your rules, and it takes on your branding: your logo, colours and fonts. It works for anything a buyer has to specify before they can get a quote, such as range, power, approvals, outputs or accessories.</p>" },
  { q:"What do you need from me to get started?",
    a:"<ul><li>A link to the product page, or the datasheets and catalogue.</li><li>Your logo and brand guidelines (or we take them from your website).</li><li>The options a buyer can choose, and any rules, such as which combinations are possible or which approvals apply.</li><li>The email address (or system) where quotation requests should go.</li></ul>" },
  { q:"How much does it cost?",
    a:"<p>The price depends on how many products and options are covered, whether you need extra languages, and whether it should connect to your other systems. We give you a fixed quote after a short conversation, so there are no surprises.</p><p>Write to <a href=\"mailto:sales@swiftyquote.com?subject=Configurator%20price%20enquiry\">sales@swiftyquote.com</a> with a link to your product and we will come back with a price.</p>" },
  { q:"How long does implementation take?",
    a:"<p>The timeline depends on the size of your range and the features you choose. A single-product configurator like this one is quicker than a full catalogue with several product families. You receive a clear timeline together with your quote, and you see a first working version early so you can give feedback before we finish.</p>" },
  { q:"Can it use our branding and languages?",
    a:"<p>Yes. This demo already follows the Max Machinery colours. Your version follows yours. Additional languages can be added.</p>" },
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

const IMG = { IND:"__IMG_IND__", EX:"__IMG_EX__", HT:"__IMG_HT__" };
const LOGO_URL = "";

/* =====================================================================
   PRODUCT DATA
   Source: maxmachinery.com P213 product page, spec sheets P213F-SPEC-REV2022 (frequency) and P213A-SPEC-REV2022 (analog),
   and the "P-Series 3000 psi (210 bar) Part Number Matrix" (PSeries-PartNumber-Selector-3000PSI Rev2018A, also p6 of both spec sheets).
   Part number: P213 MS [fluid connection][seal][option NA/HT] / [signal][electrical connection][temperature rating][output] / 0 [-BID]
   Example from Max's sample calibration certificate: P213MS11NA/P11N/0
   ===================================================================== */
const FLUIDS = [
  { id:"fuel",  title:"Fuel: gasoline, diesel, kerosene", desc:"Injector, pump and engine fuel measurement." },
  { id:"hyd",   title:"Hydraulic or lubricating oil", desc:"Pumps, motors, cylinders and actuators." },
  { id:"chem",  title:"Chemical additive or odorant", desc:"Small, precise injection flows." },
  { id:"brake", title:"Brake fluid", desc:"In-line flow testing." },
  { id:"water", title:"Water or a water-based fluid", desc:"Aqueous solutions, glycol mixes.", flag:"check" },
  { id:"other", title:"Something else", desc:"We will look at it together with you." }
];
const APPS = [
  { id:"test",   title:"Test stand", desc:"Injectors, pumps, valves, hydraulic components." },
  { id:"inject", title:"Chemical injection or dosing", desc:"Additives, odorant, catalysts." },
  { id:"leak",   title:"Leak or performance testing", desc:"Valve leak testing, certification runs." },
  { id:"proc",   title:"Process monitoring", desc:"Continuous low-flow measurement in a line." },
  { id:"other",  title:"Something else", desc:"We will look at it together with you." }
];
const FLOWS = [
  { id:"low",  title:"Below 0.5 cc/min", desc:"Under the published P213 range.", flag:"low" },
  { id:"in",   title:"0.5 to 1800 cc/min", desc:"Up to 1.8 L/min (0.48 gpm). The P213 range.", badge:"P213 range" },
  { id:"high", title:"Above 1800 cc/min", desc:"More than 1.8 L/min.", flag:"high" },
  { id:"unk",  title:"Not sure", desc:"We will check it with you." }
];
const TEMPS = [
  { id:"t75",  title:"Up to 75 °C",    desc:"Up to 167 °F. Covered by every build." },
  { id:"t90",  title:"75 to 90 °C",    desc:"167 to 194 °F." },
  { id:"t130", title:"90 to 130 °C",   desc:"194 to 266 °F. Two-part (remote electronics) build." },
  { id:"t225", title:"130 to 225 °C",  desc:"266 to 437 °F. Two-part high-temperature build, industrial areas only." },
  { id:"thot", title:"Above 225 °C",   desc:"Above 437 °F", flag:"high" },
  { id:"tunk", title:"Not sure",       desc:"We will check it with you." }
];
const AREAS = [
  { id:"safe", title:"Ordinary (non-hazardous) area", desc:"No flammable gas or vapour around the meter." },
  { id:"haz",  title:"Hazardous area: gas groups C/D or IIA/IIB", desc:"Class I, Division 1 / Zone 1 (also suits Division 2 / Zone 2). Fuels, solvents, most hydrocarbons." },
  { id:"iic",  title:"Hazardous area with hydrogen or acetylene", desc:"Groups A/B or gas group IIC.", flag:"check" },
  { id:"unk",  title:"Not sure", desc:"We will check it with you." }
];
const CONNS = [
  { id:"1", title:"1/8″ NPT ports", desc:"Female pipe thread on the meter body.", badge:"Most common" },
  { id:"2", title:"#4 SAE ports", desc:"SAE straight-thread O-ring boss." },
  { id:"4", title:"Manifold mount", desc:"Bottom ports with O-ring seals, 4 through holes on a 1.875″ (47.6 mm) square." }
];
const SEALS = [
  { id:"1", title:"Viton® (FKM)", desc:"Standard O-ring material.", badge:"Standard" },
  { id:"3", title:"Teflon® (PTFE)", desc:"Optional O-ring material." },
  { id:"5", title:"Perfluoroelastomer (FFKM)", desc:"Optional O-ring material." },
  { id:"7", title:"Neoprene", desc:"Optional O-ring material." }
];
const SIGNALS = [
  { id:"P", title:"Pulse (frequency)", desc:"5 V square wave, single phase, 1,000 pulses/cc. For counters, totalisers and PLC high-speed inputs.", badge:"Most common" },
  { id:"Q", title:"Quadrature (two-phase pulse)", desc:"5 V, two phases, 500 pulses/cc per phase (2,000 pulses/cc 4x decoded). Shows flow direction." },
  { id:"A", title:"Analog", desc:"4-20 mA or 0-10 V, linearised and damped with anti-dither protection, uni- or bi-directional." }
];
/* output code letter = id[1]; signal = id[0] */
const OUTPUTS = [
  { id:"PN", title:"5 V pulse, powered by 5-26 Vdc", desc:"Standard frequency output. 30 mA supply.", badge:"Standard" },
  { id:"PS", title:"Current sinking, single phase", desc:"Open-collector style output, 20 mA max. Powered by 5-26 Vdc." },
  { id:"QN", title:"5 V quadrature, powered by 5-26 Vdc", desc:"Phase A and phase B outputs. 30 mA supply." },
  { id:"AA", title:"4-20 mA, powered by 24 Vdc", desc:"24 Vdc at 45 mA." },
  { id:"AB", title:"4-20 mA, powered by 12 Vdc", desc:"12 Vdc at 90 mA." },
  { id:"AC", title:"0-10 V, powered by 24 Vdc", desc:"24 Vdc at 45 mA." },
  { id:"AD", title:"0-10 V, powered by 12 Vdc", desc:"12 Vdc at 90 mA." }
];
const TRATES = [
  { id:"1", title:"Standard: 90 °C industrial / 75 °C hazardous location", desc:"One-piece meter with the electronics on top." },
  { id:"2", title:"130 °C hazardous location, two-part", desc:"Electronics in a separate remote enclosure, explosion-proof meter housing." },
  { id:"3", title:"225 °C industrial, two-part", desc:"High-temperature build with remote electronics and a 2 m interconnect cable." }
];
const ELECS = [
  { id:"1", title:"Industrial, Turck® connector", desc:"M12-style 5-pin connector on top of the meter. For ordinary areas.", badge:"Standard" },
  { id:"2", title:"Hazardous location, 1/2″ NPT conduit", desc:"Explosion-proof housing: ATEX/IECEx II 2 G Ex db IIB Tx Gb and UL/cUL Class I, Div 1, Groups C and D." }
];

const SPECS = [
  ["Flow range",         "0.5 to 1800 cc/min (0 to 0.48 gpm)"],
  ["Accuracy",           "+/-0.2% of reading over a 200:1 range at 3 cP (analog: or +/-2 mV / 4 uA, whichever is greater)"],
  ["Max. pressure",      "3000 psi (210 bar)"],
  ["Fluids",             "Most non-aqueous, hydrocarbon based fluids; 10 micron filtration recommended"],
  ["Wetted materials",   "Stainless steel 303, nitrided 303, 440C; Alnico magnet; O-rings as selected"],
  ["External",           "Stainless steel 303; Xylan coated bolts; weight 1.0 kg"],
  ["Ambient",            "-40 to 80 C single piece; two piece to 110 C"],
  ["Fluid temperature",  "-40 to 90 C standard; -40 to 225 C two piece high temperature (based on 20 C ambient)"]
];

/* =====================================================================
   STATE
   ===================================================================== */
const STEPS = [
  { id:"app",    label:"Application" },
  { id:"meter",  label:"Ports & seals" },
  { id:"signal", label:"Output" },
  { id:"elec",   label:"Electronics" },
  { id:"extras", label:"Calibration" },
  { id:"review", label:"Review" }
];
const $ = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => [...el.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const byId = (arr,id) => arr.find(x => x.id === id);

function newState(){
  return { step:0, maxStep:0, fluid:null, fluidName:"", app:null, flow:null, temp:null, area:null,
           conn:null, seal:null, sig:null, out:null, trate:null, elec:null, bid:false, ht:false,
           qty:1, notes:"", ref:makeRef(), helpOpen:{} };
}
function makeRef(){
  const d = new Date(), p = n => String(n).padStart(2,"0");
  const rnd = Math.random().toString(36).slice(2,6).toUpperCase();
  return `MAX-${String(d.getFullYear()).slice(2)}${p(d.getMonth()+1)}${p(d.getDate())}-${rnd}`;
}
let S = newState();

/* ---------- rules ---------- */
const isHaz = () => S.area === "haz" || S.area === "iic";
/* hazardous locations are limited to 130 °C fluid (selector footnote †) */
const hazTooHot = () => isHaz() && ["t225","thot"].includes(S.temp);
function outOffWhy(o){
  if (S.sig && o.id[0] !== S.sig) return `For the ${byId(SIGNALS,o.id[0]).title.toLowerCase()} signal type.`;
  return null;
}
/* temperature rating (selector: 1 = 90 °C industrial / 75 °C Haz-Loc, 2 = 130 °C Haz-Loc 2 part, 3 = 225 °C industrial 2 part †) */
function trateOffWhy(t){
  const tp = S.temp;
  if (t.id === "1"){
    if (isHaz() && ["t90","t130"].includes(tp)) return "In hazardous locations the standard build is rated to 75 °C fluid.";
    if (["t130","t225","thot"].includes(tp)) return "Rated to 90 °C fluid.";
  }
  if (t.id === "2"){
    if (!isHaz()) return "This is the hazardous-location two-part build. In ordinary areas use the 225 °C industrial build.";
    if (["t225","thot"].includes(tp)) return "Rated to 130 °C fluid.";
  }
  if (t.id === "3"){
    if (isHaz()) return "Not available for hazardous locations (exceeds the 130 °C limit).";
  }
  return null;
}
function elecOffWhy(e){
  if (e.id === "1" && isHaz()) return "The Turck® connector housing is for ordinary (industrial) areas. Hazardous locations need the conduit housing.";
  if (e.id === "1" && S.trate === "2") return "The 130 °C two-part build is the hazardous-location version with the conduit housing.";
  if (e.id === "2" && S.trate === "3") return "The 225 °C industrial build is not available for hazardous locations.";
  return null;
}
const bidOffWhy = () => (S.sig && S.sig !== "P") ? null : (S.sig === "P" ? "Bi-directional calibration is offered for analog and quadrature meters only." : "Choose the signal type first.");
function allowed(list, fn){ return list.filter(x => !fn(x)); }
function constrain(){
  if (S.out && (outOffWhy(byId(OUTPUTS,S.out)) || !S.sig)) S.out = null;
  if (S.sig === "Q") S.out = "QN";
  const tr = byId(TRATES, S.trate || ""); if (tr && trateOffWhy(tr)) S.trate = null;
  const el = byId(ELECS, S.elec || ""); if (el && elecOffWhy(el)) S.elec = null;
  if (S.bid && bidOffWhy()) S.bid = false;
}

/* ---------- derived values ---------- */
const outCode = () => S.out ? S.out[1] : null;
function partNumber(){
  const q = v => v || "?";
  return `P213MS${q(S.conn)}${q(S.seal)}${S.ht ? "HT" : "NA"}/${q(S.sig)}${q(S.elec)}${q(S.trate)}${q(outCode())}/0${S.bid ? "-BID" : ""}`;
}
const codeIsFinal = () => !partNumber().includes("?");
const twoPart = () => S.trate === "2" || S.trate === "3";
function areaText(){ const a = byId(AREAS, S.area || ""); return a ? a.title : null; }
function outText(){ const o = byId(OUTPUTS, S.out || ""); return o ? o.title : null; }
function fluidText(){
  const f = byId(FLUIDS, S.fluid || ""); if (!f) return null;
  return f.title + (S.fluidName.trim() ? ` (${S.fluidName.trim()})` : "");
}
function calText(){
  const t = ["Single-direction calibration (included)"];
  if (S.bid) t[0] = "Bi-directional calibration (BID)";
  if (S.ht) t.push("Heat trace option (HT)");
  return t.join("; ");
}

function validStep(id){
  switch(id){
    case "app":    return !!(S.fluid && S.app && S.flow && S.temp && S.area) && !hazTooHot();
    case "meter":  return !!(S.conn && S.seal);
    case "signal": return !!(S.sig && S.out);
    case "elec":   return !!(S.trate && S.elec);
    case "extras": return true;
    default:       return true;
  }
}
const isComplete = () => STEPS.slice(0,-1).every(s => validStep(s.id));

function getNotes(){
  const warn = [], info = [];
  if (hazTooHot()) warn.push("Above 130 °C the P213 is not available for hazardous locations. Please talk to us about the installation.");
  if (S.flow === "low") warn.push("Your flow is below the published P213 range of 0.5 cc/min. Please talk to us before ordering.");
  if (S.flow === "high") warn.push("Your flow is above 1800 cc/min, the top of the P213 range. The same part-number matrix lists larger piston meters (P214 to 10 L/min, P215 to 35 L/min): we will check which one fits.");
  if (S.flow === "unk") warn.push("Flow rate to be confirmed (P213: 0.5 to 1800 cc/min).");
  if (S.fluid === "water") warn.push("The spec sheet lists the P213 for most non-aqueous, hydrocarbon based fluids. Suitability for water-based fluids must be confirmed with the manufacturer.");
  if (S.fluid === "other") warn.push("Fluid to be clarified with you: please name it and its viscosity in the notes.");
  if (S.temp === "thot") warn.push("Your fluid is hotter than 225 °C, the top of the published range. Please talk to us before ordering.");
  if (S.temp === "tunk") warn.push("Fluid temperature to be confirmed: it decides the temperature rating.");
  if (S.area === "iic") warn.push("The published Ex approvals cover gas groups IIB and Class I, Groups C and D. Hydrogen and acetylene (IIC, Groups A/B) are not covered: to be confirmed with the manufacturer.");
  if (S.area === "unk") warn.push("Area classification to be confirmed: it decides the housing and electrical connection.");
  if (S.app === "other") warn.push("Application to be clarified with you before quotation.");
  if (S.trate === "2") warn.push("130 °C hazardous-location two-part build: the receiver (remote electronics) of two-part transmitters is not rated explosion-proof, and the interconnect cable is supplied by the user. To be confirmed with the manufacturer.");
  if (S.elec === "2") warn.push("Ex temperature class (Tx) depends on the fluid and ambient temperature (temperature chart in the product manual): to be confirmed for your installation.");
  if (S.ht) warn.push("Heat trace option (HT): listed in the part-number matrix without further details. Scope to be confirmed with the manufacturer.");
  if (S.seal && S.seal !== "1") info.push("Check the O-ring material against your fluid's chemical compatibility chart.");
  info.push("Accuracy ±0.2% of reading over a 200:1 range at 3 cP. Higher viscosity raises the pressure drop: see the pressure drop graph in the spec sheet.");
  info.push("A 10 micron filter upstream of the meter is recommended.");
  if (S.trate === "3") info.push("Two-part industrial build: the remote electronics enclosure comes with a 2 m interconnect cable.");
  if (S.elec === "1" && S.trate === "1") info.push("Ambient range −40 to 80 °C for the one-piece meter (two-piece builds to 110 °C).");
  if (S.sig === "A") info.push("The analog output can be set to any range within ±10 V or ±20 mA; tell us the flow that should equal full scale.");
  if (!S.bid && (S.sig === "A" || S.sig === "Q")) info.push("A single-direction calibration is included. Bi-directional calibration (BID) is optional.");
  if (S.sig === "P" || S.sig === "Q") info.push("Frequency transmitters run on 5-26 Vdc at 30 mA.");
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
const withWhy = (name, list, fn, meta) => list.map(o => { const why = fn(o);
  return optHtml({ name, value:o.id, checked:S[name]===o.id, title:o.title, desc:why || o.desc, badge:o.badge, meta:meta ? meta(o) : null, off:!!why }); }).join("");

/* =====================================================================
   STEP VIEWS
   ===================================================================== */
const VIEWS = {
  app(){
    return `<div class="step">
      ${head(1,"What will the P213 measure?","A positive displacement piston meter for low flows up to 1.8 L/min and 3000 psi. It is not sensitive to flow profile, density or viscosity, and needs no straight pipe runs. Tell us about your fluid and installation.")}
      ${group("Which fluid will flow through the meter?", null, radios("fluid", FLUIDS))}
      <div class="text-field"><label class="field"><span class="l">Fluid name and viscosity (optional)</span><input id="fluidName" type="text" value="${esc(S.fluidName)}" placeholder="e.g. ISO VG 46 hydraulic oil, 46 cSt"></label></div>
      ${group("Where is it used?", null, radios("app", APPS))}
      ${group("Flow rate you need to measure", "The P213 measures 0.5 to 1800 cc/min with ±0.2% of reading over a 200:1 range.", radios("flow", FLOWS))}
      ${group("Fluid temperature at the meter", null, radios("temp", TEMPS))}
      ${group("Where is the meter installed?", "Hazardous-area classification at the meter.", radios("area", AREAS))}
      ${helpHtml("app","Not sure about the area classification?",`<p>Your site's hazardous-area drawing shows the zone or division. If there is no drawing and no flammable gas or vapour around the meter, choose <strong>ordinary area</strong>.</p><ul><li><strong>Ordinary area:</strong> industrial housing with a Turck® connector.</li><li><strong>Hazardous area:</strong> explosion-proof housing with a 1/2″ NPT conduit entry, ATEX/IECEx Ex db IIB and UL/cUL Class I, Division 1, Groups C and D. Hazardous locations are limited to 130 °C fluid.</li></ul>`)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  meter(){
    return `<div class="step">
      ${head(2,"Ports and seals","All P213 meters are rated 3000 psi (210 bar) with stainless steel wetted parts. Choose how the meter connects and which O-ring material suits your fluid.")}
      ${group("Fluid connection", null, withWhy("conn", CONNS, () => null, o => `Code ${o.id}`))}
      ${group("O-ring seal material", "Wetted metals: stainless steel 303, nitrided 303 and 440C, with an Alnico magnet.", withWhy("seal", SEALS, () => null, o => `Code ${o.id}`))}
      ${helpHtml("meter","Which port do I need?",`<ul><li><strong>1/8″ NPT</strong> is the simplest for tubing and pipe fittings.</li><li><strong>#4 SAE</strong> uses an O-ring boss: common on hydraulic test stands.</li><li><strong>Manifold mount</strong> bolts the meter straight onto a block: no fittings, very compact.</li></ul><p>Viton® is the standard seal for fuels and oils. Choose another material if your fluid attacks FKM.</p>`)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  signal(){
    const outs = OUTPUTS.filter(o => !S.sig || o.id[0] === S.sig);
    return `<div class="step">
      ${head(3,"Output signal","How should the meter talk to your counter, PLC or data acquisition?")}
      ${group("Signal type", null, withWhy("sig", SIGNALS, () => null, o => `Code ${o.id}`), "opts--wide")}
      ${S.sig ? group("Output and supply", S.sig === "Q" ? "Quadrature meters have one output version." : "Output and supply voltage for your signal type.", withWhy("out", outs, outOffWhy, o => `Code ${o.id[1]}`), "opts--wide") : ""}
      ${helpHtml("signal","Which signal do I need?",`<ul><li><strong>Pulse</strong> gives the highest resolution: 1,000 pulses per cc. Ideal for totalising small doses and fast valve cycling.</li><li><strong>Quadrature</strong> sends two phases, so your counter can tell the flow direction (bi-directional flow).</li><li><strong>Analog</strong> sends a flow rate as 4-20 mA or 0-10 V for a PLC or chart recorder.</li></ul>`)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  elec(){
    return `<div class="step">
      ${head(4,"Electronics and temperature","Choose the build that suits your fluid temperature and installation area. Builds that do not fit your answers are greyed out.")}
      ${group("Temperature rating", `Your fluid: ${byId(TEMPS,S.temp||"")?.title || "not specified"}; ${isHaz() ? "hazardous area" : "ordinary area"}.`, withWhy("trate", TRATES, trateOffWhy, o => `Code ${o.id}`), "opts--wide")}
      ${group("Electrical connection", null, withWhy("elec", ELECS, elecOffWhy, o => `Code ${o.id}`), "opts--wide")}
      ${helpHtml("elec","What is a two-part meter?",`<p>For hot fluids the electronics move off the meter into a small <strong>remote enclosure</strong>, joined by a cable. The industrial 225 °C build comes with a 2 m cable; with the explosion-proof 130 °C build the interconnect cable is supplied by you, and the remote receiver is not rated explosion-proof.</p>`)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  extras(){
    const bw = bidOffWhy();
    return `<div class="step">
      ${head(5,"Calibration and options","All optional. Every meter is calibrated in one flow direction as standard.")}
      ${group("Calibration and options", null,
        optHtml({ type:"checkbox", name:"bid", value:"1", checked:S.bid, title:"Bi-directional calibration", desc:bw || "Calibrated in both flow directions. For analog and quadrature meters.", meta:"BID", off:!S.bid && !!bw }) +
        optHtml({ type:"checkbox", name:"ht", value:"1", checked:S.ht, title:"Heat trace option", desc:"Listed in the part-number matrix; scope to be confirmed with the manufacturer.", meta:"HT" }))}
      ${helpHtml("extras","Do I need bi-directional calibration?",`<p>Only if the fluid flows both ways through the meter and you need the reverse flow measured to the same accuracy, for example on hydraulic cylinders or reversing pumps. Pulse (single-phase) meters cannot show direction, so BID is offered with quadrature and analog outputs.</p>`)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  review(){
    const rows = summaryRows(true), n = getNotes();
    return `<div class="step">
      ${head(6,"Review your configuration","Check everything below. You can change any answer, then download the PDF or ask for a quotation.")}
      <div class="code-box"><div class="k">Part number</div><div class="v">${esc(partNumber())}</div><div class="s">${codeIsFinal() ? "Built from the P-Series part number matrix. Illustrative only: confirm with the manufacturer." : "“?” marks a choice we will confirm with you."}</div></div>
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
        <label class="field"><span class="l">Notes for our team (optional)</span><textarea id="notes" placeholder="e.g. fluid viscosity, analog full-scale flow, tag numbers, delivery date…">${esc(S.notes)}</textarea></label>
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
    const out = [];
    if (S.flow === "in") out.push(msg("ok","Good news: your flow is inside the P213 range."));
    if (hazTooHot()) out.push(msg("warn","Above 130 °C the P213 is not available for hazardous locations. Please change the temperature or area, or contact us."));
    getNotes().warn.filter(w => /below the published|above 1800|non-aqueous|hotter than 225|IIC/.test(w)).forEach(w => out.push(msg("warn",w)));
    if (S.area === "haz" && !hazTooHot()) out.push(msg("info","The explosion-proof housing with a 1/2″ NPT conduit entry will be used."));
    return out.join("");
  },
  meter(){
    const out = [];
    if (S.seal && S.seal !== "1") out.push(msg("info","Check the O-ring material against your fluid's chemical compatibility chart."));
    if (S.conn && S.seal) out.push(msg("ok",`Meter body: P213MS${S.conn}${S.seal}.`));
    return out.join("");
  },
  signal(){
    const out = [];
    if (S.sig === "Q") out.push(msg("info","Quadrature: 2,000 pulses/cc when 4x decoded, with flow direction."));
    if (S.out) out.push(msg("ok",`Signal ${S.sig}, output code ${outCode()}.`));
    return out.join("");
  },
  elec(){
    const out = [];
    if (S.trate && S.elec) out.push(msg("ok",`Transmitter code: ${S.sig || "?"}${S.elec}${S.trate}${outCode() || "?"}.`));
    getNotes().warn.filter(w => /two-part build|Tx/.test(w)).forEach(w => out.push(msg("warn",w)));
    return out.join("");
  },
  extras(){
    return S.ht ? msg("warn", getNotes().warn.find(w => /HT/.test(w))) : "";
  }
};

/* =====================================================================
   SUMMARY PANEL
   ===================================================================== */
function summaryRows(forReview){
  const g = i => forReview ? i : null;
  const past = i => S.maxStep > i || forReview;
  return [
    { k:"Fluid",                v:fluidText(), step:g(0) },
    { k:"Application",          v:byId(APPS,S.app||"")?.title || null, step:g(0) },
    { k:"Flow rate",            v:byId(FLOWS,S.flow||"")?.title || null, step:g(0) },
    { k:"Fluid temperature",    v:byId(TEMPS,S.temp||"")?.title || null, step:g(0) },
    { k:"Area",                 v:areaText(), step:g(0) },
    { k:"Fluid connection",     v:byId(CONNS,S.conn||"")?.title || null, step:g(1) },
    { k:"Seals",                v:byId(SEALS,S.seal||"")?.title || null, step:g(1) },
    { k:"Signal",               v:byId(SIGNALS,S.sig||"")?.title || null, step:g(2) },
    { k:"Output",               v:outText(), step:g(2) },
    { k:"Temperature rating",   v:byId(TRATES,S.trate||"")?.title || null, step:g(3) },
    { k:"Electrical connection",v:byId(ELECS,S.elec||"")?.title || null, step:g(3) },
    { k:"Calibration & options",v:past(4) ? calText() : null, step:g(4) },
    { k:"Quantity",             v:S.step >= 5 ? String(S.qty) : null, step:null }
  ];
}
function sumImgKey(){ return S.elec === "2" || (!S.elec && isHaz()) ? "EX" : (S.trate === "3" ? "HT" : "IND"); }
function renderSummary(){
  const key = sumImgKey(), img = $("#sumImg");
  if (img.dataset.key !== key){ img.src = IMG[key]; img.dataset.key = key; }
  const sg = byId(SIGNALS, S.sig || "");
  $("#sumModel").textContent = sg ? `P213 piston flow meter, ${sg.id === "A" ? "analog" : sg.id === "Q" ? "quadrature" : "pulse"}` : "P213 piston flow meter";
  const bits = [byId(FLOWS,S.flow||"")?.title, areaText()].filter(Boolean);
  $("#sumSub").textContent = bits.length ? bits.join(" · ") : "Your choices appear here as you go.";
  $("#sumCode").textContent = S.conn || S.sig ? partNumber() : "";
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
  if (id === "app") return hazTooHot() ? "Above 130 °C: not for hazardous areas." : "Please answer all questions.";
  if (id === "meter") return "Please choose the port and the seals.";
  if (id === "signal") return !S.sig ? "Please choose the signal type." : "Please choose the output.";
  if (id === "elec") return !S.trate ? "Please choose the temperature rating." : "Please choose the electrical connection.";
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
  if (i === 3){
    const tr = allowed(TRATES, trateOffWhy); if (!S.trate && tr.length === 1) S.trate = tr[0].id;
    const el = allowed(ELECS, elecOffWhy); if (!S.elec && el.length === 1) S.elec = el[0].id;
  }
  S.step = i; S.maxStep = Math.max(S.maxStep, i);
  renderStep(true);
}
function refresh(){ renderStepper(); renderNav(); renderSummary(); refreshFeedback(); }

/* =====================================================================
   EVENTS
   ===================================================================== */
const RERENDER = { sig:1, trate:1, elec:1, bid:1, ht:1 };
document.addEventListener("change", e => {
  const t = e.target;
  if (t.type !== "radio" && t.type !== "checkbox") return;
  const n = t.name, v = t.value;
  if (n === "bid" || n === "ht") S[n] = t.checked;
  else S[n] = v;
  constrain();
  if (n === "trate"){ const el = allowed(ELECS, elecOffWhy); if (!S.elec && el.length === 1) S.elec = el[0].id; }
  S.maxStep = Math.max(S.maxStep, S.step);
  if (RERENDER[n]){
    const y = window.scrollY; $("#stage").innerHTML = VIEWS[STEPS[S.step].id](); window.scrollTo(0,y);
    const el = $(`input[name="${n}"][value="${v}"]`); if (el) el.focus({preventScroll:true});
  }
  refresh();
});
document.addEventListener("input", e => {
  const t = e.target;
  if (t.id === "fluidName"){ S.fluidName = t.value; renderSummary(); }
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
  .replace(/[“”]/g,'"').replace(/[’‘]/g,"'").replace(/™/g,"(TM)").replace(/®/g,"(R)").replace(/²/g,"2").replace(/Ω/g,"ohm")
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
  const NAVY = [44,58,69], INK = [51,51,51], GREY = [122,124,128], LINE = [214,218,222], ORANGE = [244,123,32], AMBER = [200,120,0];
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
  small("P213 piston flow meter", W - M, 26.5, { size:8, align:"right" });
  hair(M, 32, W - M);
  y = 42;

  const IW = 32;
  if (photo) doc.addImage(photo, "JPEG", W - M - IW, y - 6, IW, IW, undefined, "FAST");
  doc.setFont("helvetica","bold"); doc.setFontSize(19); doc.setTextColor(...NAVY);
  const cl = [];
  code.split("/").forEach((part, i) => { const piece = (i ? "/" : "") + part, last = cl.length - 1;
    if (last >= 0 && doc.getTextWidth(cl[last] + piece) <= CW - IW - 8) cl[last] += piece; else cl.push(piece); });
  doc.text(cl, M, y + 4);
  let ty = y + 4 + cl.length * 7.5;
  small(`${byId(SIGNALS,S.sig||"")?.title || ""}  |  ${areaText() || ""}`, M, ty, { size:9.5 });
  ty = para("Positive displacement piston flow meter for 0.5 to 1800 cc/min at up to 3000 psi (210 bar). Not sensitive to flow profile, fluid density or viscosity; no straight pipe runs or flow conditioners needed.", M, ty + 6, CW - IW - 8, { size:8.6, color:GREY });
  small(codeIsFinal() ? "Part number built from the P-Series part number matrix; illustrative only, confirm with the manufacturer." : "\"?\" in the part number marks a choice to be confirmed.", M, ty + 1, { size:7.2 });
  y = Math.max(ty + 6, y + IW - 2);

  const R = Object.fromEntries(summaryRows(true).map(r => [r.k, r.v]));
  let yl = section("Application", X1, y, COL), yr = section("Flow meter", X2, y, COL);
  yl = item("Fluid", R["Fluid"], X1, yl, COL);
  yl = item("Application", R["Application"], X1, yl, COL);
  yl = item("Flow rate", R["Flow rate"], X1, yl, COL);
  yl = item("Fluid temperature", R["Fluid temperature"], X1, yl, COL);
  yl = item("Installation area", R["Area"], X1, yl, COL);
  yr = item("Fluid connection", R["Fluid connection"], X2, yr, COL);
  yr = item("Seals", R["Seals"], X2, yr, COL);
  yr = item("Signal and output", `${R["Signal"]}: ${R["Output"]}`, X2, yr, COL);
  yr = item("Temperature rating", R["Temperature rating"], X2, yr, COL);
  yr = item("Electrical connection", R["Electrical connection"], X2, yr, COL);
  y = Math.max(yl, yr) + 3;

  need(26);
  y = section("Calibration and quantity", M, y, CW);
  yl = item("Calibration and options", R["Calibration & options"], X1, y, COL);
  yr = item("Quantity", `${S.qty} pcs`, X2, y, COL);
  y = Math.max(yl, yr) + 3;

  const n = getNotes();
  need(30);
  if (!n.warn.length && !S.notes.trim()){ y = section("Good to know", M, y, CW); n.info.forEach(t => { y = bullet(t, M, y + .6, CW, ORANGE) + .2; }); y += 3; }
  else {
    yl = section(n.warn.length ? "Points we will check with you" : "Your notes", X1, y, COL); yr = section("Good to know", X2, y, COL);
    if (n.warn.length) n.warn.forEach(t => { yl = bullet(t, X1, yl + .6, COL, AMBER) + .6; }); else yl = para(S.notes.trim(), X1, yl, COL, { size:8.8 });
    n.info.forEach(t => { yr = bullet(t, X2, yr + .6, COL, ORANGE) + .6; });
    y = Math.max(yl, yr) + 3;
    if (n.warn.length && S.notes.trim()){ need(22); y = section("Your notes", M, y, CW); y = para(S.notes.trim(), M, y, CW, { size:8.8 }) + 3; }
  }

  const half = Math.ceil(SPECS.length / 2);
  need(10 + half * 10);
  y = section("Technical data (from the Max Machinery P213 spec sheets)", M, y + 1, CW);
  yl = y; yr = y;
  SPECS.forEach(([k, v], i) => { if (i < half) yl = compact(k, v, X1, yl, COL); else yr = compact(k, v, X2, yr, COL); });

  const pages = doc.getNumberOfPages();
  doc.setPage(pages);
  small("Demo only, not for ordering. Illustrative: confirm all specifications with the manufacturer. Source: Max Machinery P213F/P213A-SPEC-REV2022, P-Series selector Rev2018A.", M, 280.5, { size:6.8 });
  for (let p = 1; p <= pages; p++){
    doc.setPage(p); hair(M, 284, W - M);
    small("Unofficial demo by SwiftyQuote  |  sales@swiftyquote.com  |  Not affiliated with Max Machinery", M, 289, { size:6.8 });
    small(`${p} / ${pages}`, W - M, 289, { size:7, align:"right" });
  }
  return doc;
}
const pdfName = () => `Max_P213_${partNumber().replace(/\?/g,"x").replace(/\//g,"_")}_${S.ref}.pdf`;
async function downloadPdf(){
  if (!isComplete()){ toast("Please complete all steps first."); return; }
  const btns = $$("#btnPdf,#doneDownload"); btns.forEach(b => b.disabled = true);
  try {
    const logo = null;
    const photo = await loadImg(IMG[sumImgKey()], 400, 400).catch(() => null);
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
    `Quotation request | P213 piston flow meter | Ref. ${S.ref}`, "",
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
  $("#faqCta").href = `mailto:${DEMO_CONTACT.email}?subject=${encodeURIComponent("Configurator enquiry (from the Max Machinery demo)")}`;
  $("#faqContact").innerHTML = `Or write to <a href="mailto:${DEMO_CONTACT.email}">${DEMO_CONTACT.email}</a> · <a href="${DEMO_CONTACT.site}" target="_blank" rel="noopener">swiftyquote.com</a>`;
})();

window.__cfg = { get S(){ return S; }, set S(v){ S = v; }, newState, go, partNumber, getNotes, buildPdf, buildMailto, quoteText, isComplete, renderStep, constrain, trateOffWhy, elecOffWhy, outOffWhy, bidOffWhy, validStep };
renderStep(false);
