"use strict";

/* =====================================================================
   SETTINGS: adjust these lines for your own set-up
   ===================================================================== */
const SETTINGS = {
  QUOTE_EMAIL: "insidesales@ueonline.com",  // where quotation requests are sent (UE inside sales)
  QUOTE_CC: "sales@swiftyquote.com",        // always copied on every quotation request
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
    a:"<p>The product data, photos and logo belong to United Electric Controls and are used here for demonstration only. This page is not an official UE tool and you cannot place orders on it. Please contact United Electric Controls directly for real enquiries about the One Series.</p>" },
  { q:"Can you build this for my own products?",
    a:"<p>Yes. The configurator is built around your product range, your options and your rules, and it takes on your branding: your logo, colours and fonts. It works for anything a buyer has to specify before they can get a quote, such as range, power, approvals, outputs or accessories.</p>" },
  { q:"What do you need from me to get started?",
    a:"<ul><li>A link to the product page, or the datasheets and catalogue.</li><li>Your logo and brand guidelines (or we take them from your website).</li><li>The options a buyer can choose, and any rules, such as which combinations are possible or which approvals apply.</li><li>The email address (or system) where quotation requests should go.</li></ul>" },
  { q:"How much does it cost?",
    a:"<p>The price depends on how many products and options are covered, whether you need extra languages, and whether it should connect to your other systems. We give you a fixed quote after a short conversation, so there are no surprises.</p><p>Write to <a href=\"mailto:sales@swiftyquote.com?subject=Configurator%20price%20enquiry\">sales@swiftyquote.com</a> with a link to your product and we will come back with a price.</p>" },
  { q:"How long does implementation take?",
    a:"<p>The timeline depends on the size of your range and the features you choose. A single-product configurator like this one is quicker than a full catalogue with several product families. You receive a clear timeline together with your quote, and you see a first working version early so you can give feedback before we finish.</p>" },
  { q:"Can it use our branding and languages?",
    a:"<p>Yes. This demo already follows the United Electric Controls colours, fonts and logo. Your version follows yours. Additional languages can be added.</p>" },
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

const IMG = { XP:"__IMG_XP__", W:"__IMG_W__", TEMP:"__IMG_TEMP__" };
const LOGO_URL = "__LOGO__";

/* =====================================================================
   PRODUCT DATA
   Source: ueonline.com One Series product page and bulletin One Series B-14 (16 pages, "How to order" pp8-10).
   Part number: [model]-[sensor]-[options]
   ===================================================================== */
const MEASURES = [
  { id:"gp",   title:"Pressure",              desc:"Gauge pressure in a line, vessel, pump or compressor." },
  { id:"dp",   title:"Differential pressure", desc:"The difference between two pressures, e.g. across a filter." },
  { id:"temp", title:"Temperature",           desc:"With a 100 Ω platinum RTD sensor, local or remote." }
];
const APPS = [
  { id:"pump",   title:"Pump or compressor",   desc:"Start/stop, staging, shutdown." },
  { id:"lube",   title:"Lube or hydraulic oil", desc:"Bearing pressure, sump temperature, ram cycling." },
  { id:"filter", title:"Filter monitoring",    desc:"Backwash, clog and change indication." },
  { id:"safety", title:"Alarm and shutdown",   desc:"Safety systems up to SIL 2." },
  { id:"upgrade",title:"Replacing a mechanical switch", desc:"Drop-in upgrade on the existing wires." },
  { id:"other",  title:"Something else",       desc:"We will look at it together with you." }
];
const AREAS = [
  { id:"safe", title:"Ordinary (non-hazardous) area", desc:"No flammable gas or dust." },
  { id:"z2",   title:"Zone 2 / Division 2",  desc:"Flammable gas only in abnormal conditions." },
  { id:"z1",   title:"Zone 1 / Division 1",  desc:"Flammable gas can be present in normal operation." },
  { id:"z0",   title:"Zone 0",               desc:"Flammable gas present continuously or for long periods." }
];
const PROTS = [
  { id:"xp", title:"Explosion-proof (2X, 4X, 8X models)", desc:"Flameproof enclosure with a glass window and rotatable display. All power options.", badge:"Most choice" },
  { id:"is", title:"Intrinsically safe (2W2D00)",          desc:"24 VDC 2-wire model through a suitable safety barrier (barrier not included)." }
];
const MEDIA_T = [
  { id:"m125", title:"Up to 125 °C",       desc:"Up to 257 °F. Within the sensor's media limit." },
  { id:"mhot", title:"Hotter than 125 °C", desc:"Above 257 °F", flag:"high" },
  { id:"munk", title:"Not sure",           desc:"We will check it with you." }
];
const PROC_T = [
  { id:"tcold", title:"−184 to −40 °C",  desc:"−300 to −40 °F. Cryogenic and cold duties." },
  { id:"tlow",  title:"−40 to 232 °C",   desc:"−40 to 450 °F. Most oils, water and air.", badge:"Most common" },
  { id:"tmid",  title:"232 to 538 °C",   desc:"450 to 1000 °F. Hot oil, exhaust, process heaters." },
  { id:"thot",  title:"Above 538 °C",    desc:"Above 1000 °F", flag:"high" },
  { id:"tunk",  title:"Not sure",        desc:"We will check it with you." }
];

/* Gauge pressure sensors: 316L SS, silicone oil fill, 1/2" NPT female. [id, range psig, bar, over-range psig, display "wc?] */
const P_SENSORS = [
  ["P06","−14.7 to 30 psig","−1 to 2.07 bar","60 psig",1], ["P08","−14.7 to 100 psig","−1 to 6.9 bar","200 psig",1],
  ["P10","0–5 psig","0–345 mbar","10 psig",1], ["P11","0–15 psig","0–1.03 bar","30 psig",1], ["P12","0–30 psig","0–2.07 bar","60 psig",1],
  ["P13","0–50 psig","0–3.45 bar","100 psig",1], ["P14","0–100 psig","0–6.9 bar","200 psig",1], ["P15","0–300 psig","0–20.7 bar","600 psig",0],
  ["P16","0–500 psig","0–34.5 bar","1000 psig",0], ["P17","0–1000 psig","0–69 bar","2000 psig",0], ["P18","0–3000 psig","0–207 bar","6000 psig",0],
  ["P19","0–4500 psig","0–310 bar","9000 psig",0], ["P20","0–6000 psig","0–414 bar","12000 psig",0]
].map(([id,r,m,o,wc]) => ({ id, title:r, metric:m, desc:`${m}. Over-range ${o}.`, over:o, wc:!!wc, max:parseFloat(r.replace(/[^\d.]/g," ").trim().split(/\s+/).pop()) }));
/* Differential pressure sensors: 316L SS, 1/4" NPT male. */
const K_SENSORS = [
  ["K10","0–5 psid","0–345 mbar","10 psid","50 psig (3.4 bar)",1], ["K11","0–50 psid","0–3.45 bar","100 psid","500 psig (34.5 bar)",1],
  ["K12","0–100 psid","0–6.9 bar","200 psid","1500 psig (103 bar)",1], ["K13","0–200 psid","0–13.8 bar","400 psid","1500 psig (103 bar)",0]
].map(([id,r,m,o,w,wc]) => ({ id, title:r, metric:m, desc:`${m}. Over-range ${o}; max working pressure ${w}.`, over:o, work:w, wc:!!wc, max:parseFloat(r.split("–")[1]) }));
/* Temperature: 4-wire Pt100 RTD, 0.25" OD 316 SS sheath */
const T_SENSORS = [
  { id:"TL1", grp:"TL", title:"Local, 4″ stem",  desc:"Mounted rigid to the enclosure, 4″ sheath. −40 to 232 °C.", t:["tlow"] },
  { id:"TL2", grp:"TL", title:"Local, 6″ stem",  desc:"Mounted rigid to the enclosure, 6″ sheath. −40 to 232 °C.", t:["tlow"] },
  { id:"TL3", grp:"TL", title:"Local, 10″ stem", desc:"Mounted rigid to the enclosure, 10″ sheath. −40 to 232 °C.", t:["tlow"] },
  { id:"TR1", grp:"TR", title:"Remote, 6′ Teflon® cable", desc:"6″ sheath on a fixed 6 ft Teflon® extension. −40 to 232 °C.", t:["tlow"] },
  { id:"TRC", grp:"TR", title:"Remote, Teflon® cable of your length", desc:"6″ sheath, extension 1 to 30 ft in 1 ft steps. −40 to 232 °C.", t:["tlow"], len:true },
  { id:"TH1", grp:"TH", title:"Remote high-temp, 6′ MI cable", desc:"2.5″ sheath on a fixed 6 ft mineral-insulated extension. −40 to 538 °C.", t:["tlow","tmid"] },
  { id:"THC", grp:"TH", title:"Remote high-temp, MI cable of your length", desc:"2.5″ sheath, MI extension 1 to 30 ft. −40 to 538 °C.", t:["tlow","tmid"], len:true },
  { id:"TC1", grp:"TC", title:"Remote cold, 6′ MI cable", desc:"2.5″ sheath on a fixed 6 ft MI extension. −184 to 93 °C.", t:["tcold"] },
  { id:"TCC", grp:"TC", title:"Remote cold, MI cable of your length", desc:"2.5″ sheath, MI extension 1 to 30 ft. −184 to 93 °C.", t:["tcold"], len:true }
];

/* Power / output choices -> model number. prefix, rest; letter W (Zone 2/Div 2 or IS) or X (explosion-proof) goes in between. */
const POWERS = [
  { id:"d24",   pre:"2", rest:"2D00", title:"2-wire, 24 VDC discrete input", out:"Switch", desc:"Powered from your PLC's 24 VDC discrete input (12-30 VDC). 40 mA switch. Drop-in for a mechanical switch." },
  { id:"d48",   pre:"2", rest:"4D00", title:"2-wire, 48 VDC discrete input", out:"Switch", desc:"30-50 VDC discrete input. 40 mA switch." },
  { id:"a120",  pre:"2", rest:"3A00", title:"2-wire, 120 V discrete input",  out:"Switch", desc:"90-130 VAC or VDC input. 100 mA switch." },
  { id:"lp41",  pre:"2", rest:"LP41", title:"2-wire 4-20 mA loop + switch",   out:"Switch + 4-20 mA", desc:"Loop powered (10-36 VDC) or 24 V external. Solid-state switch 0-140 VAC/VDC, 0.6 A." },
  { id:"lp43",  pre:"2", rest:"LP43", title:"2-wire 4-20 mA loop + higher-voltage switch", out:"Switch + 4-20 mA", desc:"Loop powered (10-36 VDC) or 24 V external. Solid-state switch 0-280 VAC/VDC, 0.3 A." },
  { id:"ac10",  pre:"4", rest:"3A01", title:"120 VAC supply, switches 10 A",  out:"Switch", desc:"4-wire, 90-130 VAC supply. Switches loads of 24-280 VAC up to 10 A directly." },
  { id:"dc8",   pre:"8", rest:"2D",   title:"24 VDC supply, two switches + 4-20 mA", out:"2 switches + 4-20 mA", desc:"8-wire, 10-30 VDC supply. Two independent solid-state switches." }
];
const DC8 = [
  { id:"42", title:"Both switches 75-250 VAC, 1.5 A", desc:"For AC loads such as contactors and motor starters." },
  { id:"44", title:"Switch 1: 75-250 VAC, 1.5 A · Switch 2: 0-140 VAC/VDC, 0.6 A", desc:"One AC load and one DC or low-voltage signal." },
  { id:"45", title:"Both switches 0-140 VAC/VDC, 0.6 A", desc:"For PLC inputs, relays and DC loads." }
];
const MODES = [
  { id:"or", title:"Open on rise" }, { id:"cr", title:"Close on rise" },
  { id:"of", title:"Open on fall" }, { id:"cf", title:"Close on fall" }
];
const DISPLAY_P = [
  { id:"psi",  code:null,   title:"psi",           badge:"Standard" },
  { id:"wc",   code:"M275", title:"Inches of water column" },
  { id:"bar",  code:"M276", title:"bar or mbar" },
  { id:"kpa",  code:"M277", title:"kPa or MPa" },
  { id:"kgcm", code:"M278", title:"kg/cm²" }
];
const DISPLAY_T = [
  { id:"F", code:null,   title:"°F", badge:"Standard" },
  { id:"C", code:"M270", title:"°C" }
];
/* Option codes (bulletin p10) */
const OPTS = [
  { id:"M041", title:"Dual Seal", desc:"Secondary process seal for pressure models." },
  { id:"M419", title:"ATEX approval", desc:"For 2W2D, 2W3A, 2WLP and 8W2D models. Standard on explosion-proof models." },
  { id:"M395", title:"KOSHA Ex d (Korea)", desc:"Flameproof compliance per KOSHA. Explosion-proof models only." },
  { id:"M406", title:"Russian Gosgortechnadzor compliance", desc:"Not for 2W4D." },
  { id:"M449", title:"Pipe or wall mounting bracket", desc:"Explosion-proof (2X, 4X, 8X) models." },
  { id:"M454", title:"Mounting adapter plate kit", desc:"Matches the JIC bolt pattern. 2W, 4W and 8W models." },
  { id:"M550", title:"Oxygen cleaning service" },
  { id:"M006", title:"Armor on the Teflon® extension", desc:"For TR1 and TRC sensors on 2W, 4W and 8W models." },
  { id:"M905", title:"Extra 1/2″ NPT conduit, right wall", desc:"2W2D, 2W3A, 2W4D and 4W3A models." },
  { id:"M906", title:"1/2″ NPT conduit moved to bottom wall", desc:"2W2D, 2W3A, 2W4D and 4W3A models. Approvals not applicable." },
  { id:"M907", title:"1/2″ NPT conduit moved to top wall", desc:"2WLP and 8W2D models. Approvals not applicable." },
  { id:"M444", title:"Paper tag" },
  { id:"M446", title:"Stainless steel tag" }
];
const FITTINGS = [
  { id:"none", title:"No fitting", desc:"Use your own fitting or thermowell adapter." },
  { id:"W073", title:"1/2″ NPT male compression fitting (W073)", desc:"Ferrule fits the 0.25″ sensor sheath." },
  { id:"W074", title:"1/2″ NPT male union connector (W074)", desc:"Fits the 0.125″ extension cable." },
  { id:"W080", title:"1/2″ NPT male union connector (W080)", desc:"Fits the 0.188″ extension cable." }
];

const SPECS = [
  ["Function",          "Digital electronic pressure or temperature switch with 4-20 mA output (LP and 8-wire models), local LCD and keypad"],
  ["Accuracy",          "0.5% of span; repeatability 0.1%; stability +/-0.25% of range per year"],
  ["Switch response",   "60 ms or less; programmable delay 250 ms to 2 s"],
  ["Diagnostics",       "IAW(R) self-diagnostics: open or shorted sensor, plugged port, power, over/under-range, processor and switch faults"],
  ["Pressure sensors",  "316L SS welded diaphragm, silicone oil fill; media -40 to 125 C"],
  ["Temperature sensors","4-wire Pt100 RTD, 0.25 in 316 SS sheath; -200 to 538 C (TH/TT), -40 to 260 C (TR/TL)"],
  ["Enclosure",         "Type 4X/IP66 epoxy-coated aluminum"],
  ["Approvals",         "cULus (Division) and cULus & ATEX (Zone); SIL 2 suitable"]
];

/* =====================================================================
   STATE
   ===================================================================== */
const STEPS = [
  { id:"app",    label:"Application" },
  { id:"sensor", label:"Sensor" },
  { id:"power",  label:"Power & output" },
  { id:"set",    label:"Settings" },
  { id:"extras", label:"Extras" },
  { id:"review", label:"Review" }
];
const $ = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => [...el.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const byId = (arr,id) => arr.find(x => x.id === id);

function newState(){
  return { step:0, maxStep:0, measure:null, app:null, area:null, prot:"xp", mediaT:null, procT:null,
           sensor:null, extLen:"", power:null, dc8:"45",
           disp:null, prog:"field", sp1:"", db1:"", mode1:"or", sp2:"", db2:"", mode2:"or",
           opts:[], fitting:"none", w081:false, adapter:"none",
           qty:1, notes:"", ref:makeRef(), helpOpen:{} };
}
function makeRef(){
  const d = new Date(), p = n => String(n).padStart(2,"0");
  const rnd = Math.random().toString(36).slice(2,6).toUpperCase();
  return `UE-${String(d.getFullYear()).slice(2)}${p(d.getMonth()+1)}${p(d.getDate())}-${rnd}`;
}
let S = newState();

/* ---------- rules ---------- */
const isTemp = () => S.measure === "temp";
const letter = () => (S.area === "z1" && S.prot === "xp") ? "X" : "W";
const isOnlyIS = () => S.area === "z0" || (S.area === "z1" && S.prot === "is");
function sensorList(){ return S.measure === "gp" ? P_SENSORS : S.measure === "dp" ? K_SENSORS : S.measure === "temp" ? T_SENSORS : []; }
const sensorObj = () => byId(sensorList(), S.sensor || "");
const tGroup = () => (sensorObj() || {}).grp || null;
function model(){
  const p = byId(POWERS, S.power || "");
  if (!p) return null;
  return p.pre + letter() + p.rest + (p.id === "dc8" ? S.dc8 : "");
}
const mkey = () => { const m = model(); return m ? m.slice(0,4) : null; };       /* e.g. 2W2D, 2XLP, 4W3A, 8X2D */
const isW = () => letter() === "W";
const is3A = () => S.power === "a120" || S.power === "ac10";
const twoSwitch = () => S.power === "dc8";

function sensorOffWhy(o){
  if (o.id === "P20" && letter() !== "X") return "0–6000 psig is available on explosion-proof (2X, 4X, 8X) models only.";
  if (isTemp() && S.procT && !["tunk","thot"].includes(S.procT) && !o.t.includes(S.procT)) return `Not for your process temperature. ${o.desc.split(". ").pop()}`;
  if (isTemp() && isOnlyIS() && o.len && o.grp !== "TR") return null;
  return null;
}
function powerOffWhy(p){
  if (isOnlyIS() && p.id !== "d24") return "In Zone 0 and with intrinsic safety only the 2W2D00 (24 VDC, 2-wire) is used.";
  if (S.area === "z2" && p.id === "d48") return "The 48 VDC 2-wire model (2W4D00) carries no hazardous-area approvals.";
  if (["THC","TCC"].includes(S.sensor) && (p.id === "a120" || p.id === "ac10")) return "MI cable of your own length is not available on 120 V models.";
  if (S.sensor === "TRC" && letter() === "X" && (p.id === "a120" || p.id === "ac10")) return "Custom extension lengths are not available on 2X3A or 4X3A.";
  return null;
}
/* option rules (bulletin p10) - null = allowed */
function optOffWhy(id){
  const k = mkey(), m = model() || "", w = isW(), has = x => S.opts.includes(x);
  switch(id){
    case "M041": return isTemp() ? "For pressure models only." : null;
    case "M419": if (!["2W2D","2W3A","2WLP","8W2D"].includes(k)) return w ? "Not available on this model." : "Standard on explosion-proof models.";
                 if (k === "2W3A" && S.sensor === "TRC") return "Not with the TRC sensor on 2W3A.";
                 if (S.area === "z2" || S.area === "safe" || isOnlyIS()) return null; return null;
    case "M395": return w ? "Explosion-proof (2X, 4X, 8X) models only." : null;
    case "M406": return k === "2W4D" ? "Not available on 2W4D." : null;
    case "M449": return w ? "Explosion-proof (2X, 4X, 8X) models only. Use the adapter plate instead." : null;
    case "M454": return !w ? "For 2W, 4W and 8W models only." : null;
    case "M006": if (!w) return "For 2W, 4W and 8W models only."; return ["TR1","TRC"].includes(S.sensor) ? null : "For TR1 and TRC sensors only.";
    case "M905": case "M906":
      if (!["2W2D","2W3A","2W4D","4W3A"].includes(k)) return "For 2W2D, 2W3A, 2W4D and 4W3A models only.";
      if (id === "M906" && S.measure === "dp") return "Not with differential pressure sensors.";
      if (id === "M906" && S.area !== "safe") return "Approvals do not apply with this option: ordinary areas only.";
      if (has(id === "M905" ? "M906" : "M905") || has("M907")) return "Choose one conduit option."; return null;
    case "M907":
      if (!["2WLP","8W2D"].includes(k)) return "For 2WLP and 8W2D models only.";
      if (S.area !== "safe") return "Approvals do not apply with this option: ordinary areas only.";
      if (has("M905") || has("M906")) return "Choose one conduit option."; return null;
    case "M444": return has("M446") ? "Choose one tag." : null;
    case "M446": return has("M444") ? "Choose one tag." : null;
    default: return null;
  }
}
/* thermowell fittings per "Table 1" (bulletin p11) */
function fittingsAllowed(){
  if (!isTemp() || !S.sensor || !S.power) return ["none"];
  const k = mkey(), g = tGroup(), id = S.sensor, atex = S.opts.includes("M419"), out = ["none"];
  const add = (f, ok) => { if (ok) out.push(f); };
  if (["2W2D","2W4D","2WLP","8W2D"].includes(k)){
    add("W073", g === "TL" || (g === "TR" && !atex));
    add("W074", ["TR","TH","TC"].includes(g));
  } else if (["2W3A","4W3A"].includes(k)){
    add("W073", g === "TL" || (g === "TR" && !atex));
    add("W074", g === "TR" && !atex);
    add("W080", ["TH1","TC1"].includes(id) || (atex && id === "TR1"));
  } else if (["2X2D","2X4D","2XLP","8X2D"].includes(k)){
    add("W073", g === "TL");
    add("W074", ["TR","TH","TC"].includes(g));
  } else if (["2X3A","4X3A"].includes(k)){
    add("W073", g === "TL");
    add("W080", ["TR1","TH1","TC1"].includes(id));
  }
  if (["THC","TCC"].includes(id)) return out.filter(f => f === "W074");     /* "USE OPTION W074 ONLY" */
  return out;
}
function adapterChoices(){
  if (S.measure === "gp") return ["none","W930"].concat([]);
  if (S.measure === "dp") return ["none","W932x1","W932x2"];
  return ["none"];
}
function constrain(){
  if (S.measure && S.sensor && !byId(sensorList(), S.sensor)) { S.sensor = null; }
  const so = sensorObj(); if (so && sensorOffWhy(so)) S.sensor = null;
  if (!so || !so.len) S.extLen = "";
  const po = byId(POWERS, S.power || ""); if (po && powerOffWhy(po)) S.power = null;
  if (S.area !== "z1") S.prot = "xp";
  const dl = isTemp() ? DISPLAY_T : DISPLAY_P;
  if (S.disp && !byId(dl, S.disp)) S.disp = null;
  if (S.disp === "wc" && so && !so.wc) S.disp = null;
  for (let i = S.opts.length - 1; i >= 0; i--){ const id = S.opts[i]; S.opts.splice(i,1); if (!optOffWhy(id)) S.opts.splice(i,0,id); }
  if (!fittingsAllowed().includes(S.fitting)) S.fitting = fittingsAllowed().includes("W074") && ["THC","TCC"].includes(S.sensor) ? "W074" : "none";
  if (!isTemp()) S.w081 = false;
  if (!adapterChoices().includes(S.adapter)) S.adapter = "none";
  if (S.adapter === "W930" && ["P06","P08"].includes(S.sensor)) S.adapter = "none";
}

/* ---------- derived values ---------- */
function dispCode(){ const d = byId(isTemp() ? DISPLAY_T : DISPLAY_P, S.disp || ""); return d ? d.code : null; }
function optionCodes(){
  const c = [];
  if (S.prog === "factory") c.push(twoSwitch() ? "M202" : "M201");
  const dc = dispCode(); if (dc) c.push(dc);
  S.opts.forEach(o => c.push(o));
  if (S.fitting !== "none") c.push(S.fitting);
  if (S.w081) c.push("W081");
  if (S.adapter === "W930") c.push("W930");
  if (S.adapter === "W932x1") c.push("W932");
  if (S.adapter === "W932x2") c.push("W932", "W932");
  return c.sort((a,b) => a[0] === b[0] ? a.localeCompare(b) : (a[0] === "M" ? -1 : 1));
}
function partNumber(){
  const m = model() || "??????", s = S.sensor || "???";
  return [m, s, ...optionCodes()].join("-");
}
const codeIsFinal = () => !partNumber().includes("?");
function extText(){ const v = parseInt(S.extLen,10); return v ? `${v} ft` : null; }
function extValid(){ const so = sensorObj(); if (!so || !so.len) return true; const v = +S.extLen; return Number.isInteger(v) && v >= 1 && v <= 30; }
function unitShort(){ if (isTemp()) return S.disp === "C" ? "°C" : "°F"; return ({psi:"psi",wc:"″wc",bar:"bar/mbar",kpa:"kPa/MPa",kgcm:"kg/cm²"})[S.disp] || "psi"; }
function progValid(){
  if (S.prog !== "factory") return true;
  const num = v => /^-?\d+(\.\d+)?$/.test(String(v).trim());
  const ok1 = num(S.sp1) && num(S.db1) && +S.db1 > 0;
  return twoSwitch() ? ok1 && num(S.sp2) && num(S.db2) && +S.db2 > 0 : ok1;
}
function progText(){
  if (S.prog !== "factory") return "Set in the field with the keypad";
  const md = id => byId(MODES,id).title.toLowerCase();
  const one = (n, sp, db, mo) => `${n}set point ${sp || "?"}, deadband ${db || "?"} ${unitShort()}, ${md(mo)}`;
  return twoSwitch() ? `${one("SW1: ", S.sp1, S.db1, S.mode1)}; ${one("SW2: ", S.sp2, S.db2, S.mode2)}` : one("", S.sp1, S.db1, S.mode1).replace(/^s/,"S");
}
function areaText(){
  const a = byId(AREAS, S.area || ""); if (!a) return null;
  if (S.area === "z1") return `${a.title}, ${S.prot === "xp" ? "explosion-proof" : "intrinsically safe"}`;
  if (S.area === "z0") return `${a.title}, intrinsically safe`;
  return a.title;
}
function powerText(){
  const p = byId(POWERS, S.power || ""); if (!p) return null;
  return p.id === "dc8" ? `${p.title} (${byId(DC8,S.dc8).title})` : p.title;
}
function sensorText(){
  const so = sensorObj(); if (!so) return null;
  if (isTemp()) return `${so.id}: ${so.title}${so.len && extText() ? `, ${extText()}` : ""}`;
  return `${so.id}: ${so.title} (${so.metric})`;
}
function optsText(){
  const t = S.opts.map(o => byId(OPTS,o).title);
  if (S.adapter === "W930") t.push("1/2″ NPT male to G1/2 male adapter (W930)");
  if (S.adapter === "W932x1") t.push("1/4″ NPT female to G1/2 male adapter (W932) × 1");
  if (S.adapter === "W932x2") t.push("1/4″ NPT female to G1/2 male adapter (W932) × 2");
  if (S.fitting !== "none") t.push(byId(FITTINGS,S.fitting).title);
  if (S.w081) t.push("Thermowell adapter 3/8″ to 1/4″ sheath (W081)");
  return t.length ? t.join("; ") : "None";
}

function validStep(id){
  switch(id){
    case "app":    return !!(S.measure && S.app && S.area && (isTemp() ? S.procT : S.mediaT));
    case "sensor": return !!(S.sensor && extValid());
    case "power":  return !!S.power;
    case "set":    return !!(S.disp && progValid());
    case "extras": return true;
    default:       return true;
  }
}
const isComplete = () => STEPS.slice(0,-1).every(s => validStep(s.id));

function getNotes(){
  const warn = [], info = [];
  const so = sensorObj();
  if (S.mediaT === "mhot") warn.push("Your process is hotter than 125 °C, the media limit of the pressure sensors. A siphon or cooling element is usually needed: we will check this with you.");
  if (S.mediaT === "munk") warn.push("Process temperature to be confirmed (pressure sensors: −40 to 125 °C media).");
  if (S.procT === "thot") warn.push("Your process is hotter than 538 °C. The TH sensors handle up to 538 °C, intermittently 593 °C. Please talk to us before ordering.");
  if (S.procT === "tunk") warn.push("Process temperature to be confirmed: it decides the sensor type.");
  if (isOnlyIS()) warn.push("Intrinsically safe installation: a suitable safety barrier is required (not included).");
  if (S.app === "other") warn.push("Application to be clarified with you before quotation.");
  if (so && so.len) warn.push(`Extension length ${extText() || "to be specified"} must be stated on the order (${so.id}).`);
  if (S.measure === "dp") warn.push("Differential pressure: the pressure on the H port must be equal to or higher than on the L port.");
  if (S.prog === "factory") info.push("Factory programming: set point and deadband are entered with four digits; the decimal places follow the display resolution of the sensor range.");
  if (S.opts.includes("M906") || S.opts.includes("M907")) warn.push("With the conduit moved (M906 / M907) hazardous-area approvals do not apply.");
  if (S.opts.includes("M419") && ["TR1","TRC"].includes(S.sensor)) info.push("With ATEX (M419) the TR sensors come with a 2.5″ sheath and MI extension.");
  if (S.adapter === "W932x1" || S.adapter === "W932x2") info.push("W932 adapters: one or two may be needed depending on your piping.");
  if (S.area === "z1" && S.prot === "xp") info.push("Explosion-proof models include a rotatable display and a 3/4″ NPT conduit entry.");
  if (S.power === "ac10") info.push("4-wire 10 A model: derate 1.8 A per 10 °C above 38 °C ambient.");
  if (S.power === "lp41" || S.power === "lp43" || S.power === "dc8") info.push("4-20 mA output is field scalable (2:1 turndown); faults show at 0, 3.5, 22 and 24 mA.");
  info.push("All models include IAW® self-diagnostics: on a fault the switch fails safe open.");
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

/* =====================================================================
   STEP VIEWS
   ===================================================================== */
const VIEWS = {
  app(){
    return `<div class="step">
      ${head(1,"What will the One Series monitor?","One instrument does the job of three: a switch, a gauge and (on most models) a 4-20 mA transmitter. Tell us about your process.")}
      ${group("What do you need to measure?", null, radios("measure", MEASURES))}
      ${group("Where is it used?", null, radios("app", APPS))}
      ${S.measure && S.measure !== "temp" ? group("Process temperature at the sensor", "The pressure sensors handle media from −40 to 125 °C.", radios("mediaT", MEDIA_T)) : ""}
      ${S.measure === "temp" ? group("Process temperature to measure", null, radios("procT", PROC_T)) : ""}
      ${group("Hazardous area classification", "Where the instrument is installed.", radios("area", AREAS))}
      ${S.area === "z1" ? group("Type of protection", null, radios("prot", PROTS), "opts--wide") : ""}
      ${helpHtml("app","Not sure about the area classification?",`<p>Your site's hazardous-area drawing shows the zone or division. If there is no drawing and no flammable gas or dust, choose <strong>ordinary area</strong>.</p><ul><li><strong>Zone 2 / Division 2:</strong> the compact 2W, 4W and 8W models.</li><li><strong>Zone 1 / Division 1:</strong> the explosion-proof 2X, 4X and 8X models, or the intrinsically safe 2W2D00 with a barrier.</li><li><strong>Zone 0:</strong> the intrinsically safe 2W2D00 with a barrier.</li></ul>`)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  sensor(){
    const list = sensorList(), so = sensorObj();
    let inner;
    if (isTemp()){
      const grpHtml = (title, ids) => group(title, null, list.filter(s => ids.includes(s.grp)).map(s => { const why = sensorOffWhy(s);
        return optHtml({ name:"sensor", value:s.id, checked:S.sensor===s.id, title:`${s.title}`, desc:why || s.desc, meta:s.id, off:!!why }); }).join(""));
      inner = grpHtml("Mounted on the instrument", ["TL"]) + grpHtml("Remote, on a Teflon® cable", ["TR"]) + grpHtml("Remote, on a mineral-insulated (MI) cable", ["TH","TC"]);
      if (so && so.len) inner += `<div class="inline-field"><label class="field"><span class="l">Extension length (1 to 30 ft)</span><span class="unit-input"><input id="extLen" type="number" min="1" max="30" step="1" inputmode="numeric" value="${esc(S.extLen)}" placeholder="e.g. 12"><em>ft</em></span></label></div>`;
    } else {
      inner = group(S.measure === "dp" ? "Differential pressure range" : "Pressure range", "Pick a range whose top is above your highest normal pressure. The set points can be anywhere in the range.",
        list.map(s => { const why = sensorOffWhy(s);
          return optHtml({ name:"sensor", value:s.id, checked:S.sensor===s.id, title:s.title, desc:why || s.desc, meta:s.id, off:!!why }); }).join(""));
    }
    return `<div class="step">
      ${head(2, isTemp() ? "Which temperature sensor?" : "Which pressure range?", isTemp() ? "All sensors are 4-wire 100 Ω platinum RTDs in a 316 stainless steel sheath." : (S.measure === "dp" ? "316L stainless steel wetted parts, silicone oil fill, 1/4″ NPT male ports." : "316L stainless steel wetted parts, silicone oil fill, 1/2″ NPT female port."))}
      ${inner}
      ${helpHtml("sensor", isTemp() ? "Local or remote?" : "How do I choose the range?", isTemp()
        ? `<p><strong>Local</strong> sensors stick straight out of the instrument: simplest when the instrument can sit at the measuring point. <strong>Remote</strong> sensors sit on a cable, so the instrument can be mounted where it is easy to read and cooler.</p><p>Teflon® cable suits up to 232 °C; mineral-insulated cable is used for hot (to 538 °C) and cold (to −184 °C) duties.</p>`
        : `<p>Choose a range where your normal pressure sits in the lower two-thirds. The <strong>over-range</strong> is the most the sensor can take without losing accuracy. Compound ranges (P06, P08) also read vacuum.</p>`)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  power(){
    const list = POWERS.map(p => ({ ...p, why:powerOffWhy(p) }));
    return `<div class="step">
      ${head(3,"Power and outputs","How will the instrument be powered, and what should it switch or send?")}
      ${group("Power and outputs", `Model letter ${letter()}: ${letter() === "X" ? "explosion-proof for Zone 1 / Division 1." : "compact enclosure for ordinary areas and Zone 2 / Division 2."}`,
        list.map(p => optHtml({ name:"power", value:p.id, checked:S.power===p.id, title:p.title, desc:p.why || p.desc, badge:p.out, meta:`Model ${p.pre}${letter()}${p.rest}${p.id === "dc8" ? "xx" : ""}`, off:!!p.why })).join(""), "opts--wide")}
      ${S.power === "dc8" ? group("Switch ratings", null, radios("dc8", DC8), "opts--wide") : ""}
      ${helpHtml("power","Which one do I need?",`<ul><li><strong>2-wire discrete input:</strong> replaces a mechanical switch on the same two wires, powered by the PLC input. No extra wiring or batteries.</li><li><strong>4-20 mA loop:</strong> sends the reading to your control system and switches at a set point.</li><li><strong>120 VAC, 10 A:</strong> switches a motor starter, solenoid or heater directly.</li><li><strong>24 VDC, 8-wire:</strong> two independent switches plus 4-20 mA, for example warning and shutdown.</li></ul>`)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  set(){
    const so = sensorObj(), dl = isTemp() ? DISPLAY_T : DISPLAY_P, two = twoSwitch();
    const prog = (n, sp, db, mo) => `<div class="group"><div class="group__title">${two ? `Switch ${n}` : "Switch"}</div>
      <div class="grid2" style="margin-top:10px"><label class="field"><span class="l">Set point (${esc(unitShort())})</span><input id="sp${n}" type="text" inputmode="decimal" value="${esc(sp)}" placeholder="e.g. 40.00"></label>
      <label class="field"><span class="l">Deadband (${esc(unitShort())})</span><input id="db${n}" type="text" inputmode="decimal" value="${esc(db)}" placeholder="e.g. 5.00"></label></div>
      <div class="opts" style="margin-top:12px">${MODES.map(m => optHtml({ name:`mode${n}`, value:m.id, checked:S[`mode${n}`]===m.id, title:m.title })).join("")}</div></div>`;
    return `<div class="step">
      ${head(4,"Display and switch settings","Choose the units on the display, and whether we program the switch for you.")}
      ${group("Display units", null, dl.map(d => { const off = d.id === "wc" && so && !so.wc;
        return optHtml({ name:"disp", value:d.id, checked:S.disp===d.id, title:d.title, badge:d.badge, desc:off ? "Not available for this range." : (d.code ? `Option ${d.code}` : null), off }); }).join(""))}
      ${group("Switch programming", null,
        optHtml({ name:"prog", value:"field", checked:S.prog==="field", title:"I'll set it on site", desc:"Set point, deadband and mode are set with the keypad, even while in service.", badge:"Standard" }) +
        optHtml({ name:"prog", value:"factory", checked:S.prog==="factory", title:"Program it at the factory", desc:`Option ${two ? "M202 (two switches)" : "M201"}: all settings are required with the order.` }), "opts--wide")}
      ${S.prog === "factory" ? prog(1, S.sp1, S.db1, S.mode1) + (two ? prog(2, S.sp2, S.db2, S.mode2) : "") : ""}
      ${helpHtml("set","What do set point and deadband mean?",`<p>The <strong>set point</strong> is where the switch acts, for example 40 psi. The <strong>deadband</strong> is how far the value must come back before the switch resets, for example 5 psi: it stops the switch from chattering. Both are 100% adjustable over the whole sensor range.</p><p><strong>Open on rise</strong> means the contact opens when the value goes up past the set point; choose the mode your control system expects.</p>`)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  extras(){
    const fits = fittingsAllowed(), ad = adapterChoices();
    const adTitle = { none:"No adapter", W930:"1/2″ NPT male to G1/2 male adapter (W930)", W932x1:"1/4″ NPT female to G1/2 male adapter (W932), one", W932x2:"1/4″ NPT female to G1/2 male adapter (W932), two" };
    const adDesc = { none:null, W930:["P06","P08"].includes(S.sensor) ? "For P10 to P20 sensors." : "For BSPP (G1/2) process connections.", W932x1:"For BSPP (G1/2) piping on one port.", W932x2:"For BSPP (G1/2) piping on both ports." };
    return `<div class="step">
      ${head(5,"Approvals, mounting and extras","All optional. Options that do not fit your model are greyed out.")}
      ${group("Options", null, OPTS.map(o => { const why = optOffWhy(o.id), on = S.opts.includes(o.id);
        return optHtml({ type:"checkbox", name:"opts", value:o.id, checked:on, title:o.title, desc:why || o.desc, meta:o.id, off:!on && !!why }); }).join(""))}
      ${isTemp() ? group("Process fitting", ["THC","TCC"].includes(S.sensor) ? "MI cable of your own length is used with the W074 union only." : "Fittings that match your sensor and model.", FITTINGS.filter(f => fits.includes(f.id)).map(f => optHtml({ name:"fitting", value:f.id, checked:S.fitting===f.id, title:f.title, desc:f.desc })).join("")) : ""}
      ${isTemp() ? group("Thermowell", null, optHtml({ type:"checkbox", name:"w081", value:"1", checked:S.w081, title:"Thermowell adapter (W081)", desc:"Adapts a 3/8″ thermowell to the 1/4″ sensor sheath." })) : ""}
      ${!isTemp() ? group("Process connection adapter", null, ad.map(a => optHtml({ name:"adapter", value:a, checked:S.adapter===a, title:adTitle[a], desc:adDesc[a], off:a === "W930" && ["P06","P08"].includes(S.sensor) })).join("")) : ""}
      ${helpHtml("extras","What do I need?",`<ul><li><strong>Dual Seal</strong> adds a secondary process seal (pressure models).</li><li><strong>ATEX</strong> is standard on explosion-proof models and an option on some 2W models.</li><li>A <strong>bracket</strong> (2X, 4X, 8X) or <strong>adapter plate</strong> (2W, 4W, 8W) helps mounting.</li><li>Thermowells themselves are listed separately: tell us the insertion length in the notes.</li></ul>`)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  review(){
    const rows = summaryRows(true), n = getNotes();
    return `<div class="step">
      ${head(6,"Review your configuration","Check everything below. You can change any answer, then download the PDF or ask for a quotation.")}
      <div class="code-box"><div class="k">Part number</div><div class="v">${esc(partNumber())}</div><div class="s">${codeIsFinal() ? "Built from the bulletin's model, sensor and option codes. Confirmed by United Electric Controls in the quotation." : "“?” marks a choice we will confirm with you."}</div></div>
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
        <label class="field"><span class="l">Notes for our team (optional)</span><textarea id="notes" placeholder="e.g. tag numbers, thermowell length, existing switch model, delivery date…">${esc(S.notes)}</textarea></label>
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
    if (S.mediaT === "m125") out.push(msg("ok","Good news: your process temperature is inside the pressure sensors' media limit."));
    if (S.procT === "tlow" || S.procT === "tmid" || S.procT === "tcold") out.push(msg("ok","Sensors that cover your temperature are shown in the next step."));
    getNotes().warn.filter(w => /hotter than|to be confirmed/.test(w)).forEach(w => out.push(msg("warn",w)));
    if (isOnlyIS()) out.push(msg("info","The intrinsically safe 2W2D00 (24 VDC, 2-wire) will be preselected. A suitable safety barrier is required."));
    if (S.area === "z1" && S.prot === "xp") out.push(msg("info","Explosion-proof 2X, 4X and 8X models: all power options and the 0–6000 psig range are available."));
    return out.join("");
  },
  sensor(){
    const out = [], so = sensorObj();
    if (so && so.len && S.extLen && !extValid()) out.push(msg("warn","Please enter a whole number of feet from 1 to 30."));
    if (so && so.len && !S.extLen) out.push(msg("info","Please enter the extension length: it must be specified with the order."));
    if (so && so.work) out.push(msg("info",`Maximum working pressure (both ports together): ${so.work}.`));
    if (so && !isTemp() && !so.work) out.push(msg("ok",`Over-range protection to ${so.over}.`));
    return out.join("");
  },
  power(){
    const out = [];
    if (S.power) out.push(msg("ok",`Your model: ${model()}.`));
    if (S.power === "ac10") out.push(msg("info","Derate the switch by 1.8 A per 10 °C above 38 °C ambient."));
    return out.join("");
  },
  set(){
    const out = [];
    if (S.prog === "factory" && !progValid()) out.push(msg("warn","Please enter a set point and a deadband (greater than 0) for each switch."));
    if (S.prog === "factory" && progValid()) out.push(msg("ok","Factory programming will be added to the part number."));
    return out.join("");
  },
  extras(){
    return getNotes().warn.filter(w => /M906/.test(w)).map(w => msg("warn",w)).join("");
  }
};

/* =====================================================================
   SUMMARY PANEL
   ===================================================================== */
function summaryRows(forReview){
  const g = i => forReview ? i : null;
  const past = i => S.maxStep > i || forReview;
  const tRow = isTemp() ? { k:"Process temperature", v:byId(PROC_T,S.procT||"")?.title || null, step:g(0) } : { k:"Process temperature", v:byId(MEDIA_T,S.mediaT||"")?.title || null, step:g(0) };
  return [
    { k:"Measuring",          v:byId(MEASURES,S.measure||"")?.title || null, step:g(0) },
    { k:"Application",        v:byId(APPS,S.app||"")?.title || null, step:g(0) },
    tRow,
    { k:"Area",               v:areaText(), step:g(0) },
    { k:"Sensor",             v:sensorText(), step:g(1) },
    { k:"Power & outputs",    v:powerText(), step:g(2) },
    { k:"Model",              v:model(), step:g(2) },
    { k:"Display units",      v:S.disp ? byId(isTemp() ? DISPLAY_T : DISPLAY_P, S.disp).title : null, step:g(3) },
    { k:"Switch settings",    v:past(3) ? progText() : null, step:g(3) },
    { k:"Options",            v:past(4) ? optsText() : null, step:g(4) },
    { k:"Quantity",           v:S.step >= 5 ? String(S.qty) : null, step:null }
  ];
}
function sumImgKey(){ return isTemp() ? "TEMP" : (letter() === "X" ? "XP" : "W"); }
function renderSummary(){
  const key = sumImgKey(), img = $("#sumImg");
  if (img.dataset.key !== key){ img.src = IMG[key]; img.dataset.key = key; }
  const m = model();
  $("#sumModel").textContent = m ? `One Series ${m}` : (S.measure ? `One Series ${byId(MEASURES,S.measure).title.toLowerCase()} switch` : "One Series transmitter-switch");
  const bits = [sensorObj() ? sensorObj().title : null, areaText()].filter(Boolean);
  $("#sumSub").textContent = bits.length ? bits.join(" · ") : "Your choices appear here as you go.";
  $("#sumCode").textContent = S.sensor || S.power ? partNumber() : "";
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
  if (id === "app") return "Please answer all questions.";
  if (id === "sensor") return !S.sensor ? "Please choose a sensor." : "Please enter the extension length.";
  if (id === "power") return "Please choose power and outputs.";
  if (id === "set") return !S.disp ? "Please choose the display units." : "Please complete the switch settings.";
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
  if (i === 2 && !S.power && isOnlyIS()) S.power = "d24";
  if (i === 3 && !S.disp) S.disp = isTemp() ? "F" : "psi";
  S.step = i; S.maxStep = Math.max(S.maxStep, i);
  renderStep(true);
}
function refresh(){ renderStepper(); renderNav(); renderSummary(); refreshFeedback(); }

/* =====================================================================
   EVENTS
   ===================================================================== */
const RERENDER = { measure:1, area:1, prot:1, procT:1, sensor:1, power:1, prog:1, opts:1, fitting:0, adapter:0, disp:0 };
document.addEventListener("change", e => {
  const t = e.target;
  if (t.type !== "radio" && t.type !== "checkbox") return;
  const n = t.name, v = t.value;
  if (n === "opts"){ if (t.checked){ if (!S.opts.includes(v)) S.opts.push(v); } else S.opts = S.opts.filter(x => x !== v); }
  else if (n === "w081") S.w081 = t.checked;
  else if (n === "measure" && S.measure !== v){ S.measure = v; S.sensor = null; S.extLen = ""; S.mediaT = null; S.procT = null; S.disp = null; S.fitting = "none"; S.adapter = "none"; }
  else S[n] = v;
  if (n === "sensor" && ["THC","TCC"].includes(v)) S.fitting = "W074";
  constrain();
  S.maxStep = Math.max(S.maxStep, S.step);
  if (RERENDER[n] || n === "opts" || n === "w081"){
    const y = window.scrollY; $("#stage").innerHTML = VIEWS[STEPS[S.step].id](); window.scrollTo(0,y);
    const el = $(`input[name="${n}"][value="${v}"]`); if (el) el.focus({preventScroll:true});
    if (n === "sensor" && sensorObj()?.len){ const f = $("#extLen"); if (f) f.focus(); }
  }
  refresh();
});
document.addEventListener("input", e => {
  const t = e.target;
  if (t.id === "extLen"){ S.extLen = t.value; refresh(); }
  else if (/^(sp|db)[12]$/.test(t.id)){ S[t.id] = t.value; refresh(); }
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
  const NAVY = [43,45,51], INK = [51,51,51], GREY = [122,124,128], LINE = [214,218,222], RED = [228,54,63], AMBER = [200,120,0];
  const code = partNumber();
  const today = new Date().toLocaleDateString("en-GB", { day:"2-digit", month:"long", year:"numeric" });
  const PAGE_END = 277; let y = 0;
  const T = t => pdfText(t);
  const hair = (x1, yy, x2) => { doc.setDrawColor(...LINE); doc.setLineWidth(.25); doc.line(x1, yy, x2, yy); };
  const small = (t, x, yy, o = {}) => { doc.setFont("helvetica", o.bold ? "bold" : "normal"); doc.setFontSize(o.size || 8); doc.setTextColor(...(o.color || GREY)); if (o.space) doc.setCharSpace(o.space); doc.text(T(t), x, yy, o.align ? { align:o.align } : undefined); if (o.space) doc.setCharSpace(0); };
  const newPage = () => { doc.addPage(); small(`United Electric Controls  |  Product configuration ${code}  |  Ref. ${S.ref}`, M, 14, { size:7.5 }); hair(M, 17, W - M); y = 28; };
  const need = h => { if (y + h > PAGE_END) newPage(); };
  const section = (title, x, yy, w) => { small(title.toUpperCase(), x, yy, { size:7, bold:true, space:.5 }); hair(x, yy + 2.2, x + w); return yy + 8; };
  const item = (label, value, x, yy, w) => { small(label, x, yy, { size:7.5 }); doc.setFont("helvetica","bold"); doc.setFontSize(9.6); doc.setTextColor(...NAVY); const vl = doc.splitTextToSize(T(value || "-"), w); doc.text(vl, x, yy + 4.2); return yy + 4.2 + vl.length * 4.1 + 2.4; };
  const compact = (label, value, x, yy, w) => { small(label, x, yy, { size:7 }); doc.setFont("helvetica","bold"); doc.setFontSize(8.6); doc.setTextColor(...NAVY); const vl = doc.splitTextToSize(T(value || "-"), w); doc.text(vl, x, yy + 3.9); return yy + 3.9 + vl.length * 3.7 + 2.8; };
  const para = (t, x, yy, w, o = {}) => { doc.setFont("helvetica","normal"); doc.setFontSize(o.size || 8.6); doc.setTextColor(...(o.color || INK)); const l = doc.splitTextToSize(T(t), w); doc.text(l, x, yy); return yy + l.length * (o.lh || 4.1) + (o.gap == null ? 2 : o.gap); };
  const bullet = (t, x, yy, w, color) => { doc.setFillColor(...color); doc.rect(x, yy - 2, 1.4, 1.4, "F"); return para(t, x + 4.5, yy, w - 4.5); };

  if (logo) doc.addImage(logo, "JPEG", M, 12, 20, 20*195/315);
  small("Product configuration", W - M, 17, { size:10, bold:true, color:NAVY, align:"right" });
  small(`Ref. ${S.ref}   |   ${today}`, W - M, 22, { size:8, align:"right" });
  small("One Series electronic transmitter-switch", W - M, 26.5, { size:8, align:"right" });
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
  small(`${sensorText()}  |  ${areaText()}`, M, ty, { size:9.5 });
  ty = para("Digital electronic switch with programmable set point and deadband, local display and keypad, IAW(R) self-diagnostics and no moving parts. Replaces a switch, a gauge and (on loop-powered and 8-wire models) a transmitter.", M, ty + 6, CW - IW - 8, { size:8.6, color:GREY });
  small(codeIsFinal() ? "Part number built from the bulletin's model, sensor and option codes; confirmed by UE in the quotation." : "\"?\" in the part number marks a choice to be confirmed.", M, ty + 1, { size:7.2 });
  y = Math.max(ty + 6, y + IW - 2);

  const R = Object.fromEntries(summaryRows(true).map(r => [r.k, r.v]));
  let yl = section("Application", X1, y, COL), yr = section("Instrument", X2, y, COL);
  yl = item("Measuring", R["Measuring"], X1, yl, COL);
  yl = item("Application", R["Application"], X1, yl, COL);
  yl = item("Process temperature", R["Process temperature"], X1, yl, COL);
  yl = item("Hazardous area", R["Area"], X1, yl, COL);
  yr = item("Model", R["Model"], X2, yr, COL);
  yr = item("Power and outputs", R["Power & outputs"], X2, yr, COL);
  yr = item("Sensor", R["Sensor"], X2, yr, COL);
  yr = item("Display units  |  quantity", `${R["Display units"]}  |  ${S.qty} pcs`, X2, yr, COL);
  y = Math.max(yl, yr) + 3;

  need(40);
  y = section("Switch settings and options", M, y, CW);
  yl = item("Switch programming", R["Switch settings"], X1, y, COL);
  yr = item("Options and fittings", R["Options"], X2, y, COL);
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
  y = section("Technical data (from the UE One Series bulletin)", M, y + 1, CW);
  yl = y; yr = y;
  SPECS.forEach(([k, v], i) => { if (i < half) yl = compact(k, v, X1, yl, COL); else yr = compact(k, v, X2, yr, COL); });

  const pages = doc.getNumberOfPages();
  doc.setPage(pages);
  small("Not a binding offer. Part number, price, availability and approvals are confirmed in a written quotation from UE. Specifications per bulletin One Series B-14.", M, 280.5, { size:6.8 });
  for (let p = 1; p <= pages; p++){
    doc.setPage(p); hair(M, 284, W - M);
    small("United Electric Controls  |  180 Dexter Avenue, Watertown, MA 02472 USA  |  +1 617 923 6900  |  insidesales@ueonline.com", M, 289, { size:6.8 });
    small(`${p} / ${pages}`, W - M, 289, { size:7, align:"right" });
  }
  return doc;
}
const pdfName = () => `UE_OneSeries_${partNumber().replace(/\?/g,"x")}_${S.ref}.pdf`;
async function downloadPdf(){
  if (!isComplete()){ toast("Please complete all steps first."); return; }
  const btns = $$("#btnPdf,#doneDownload"); btns.forEach(b => b.disabled = true);
  try {
    const logo = await loadImg(LOGO_URL, 315, 195).catch(() => null);
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
    ...(withHeaders ? [`To: ${SETTINGS.QUOTE_EMAIL}`, `Cc: ${SETTINGS.QUOTE_CC}`, `Subject: ${quoteSubject()}`, ""] : []),
    `Quotation request | One Series electronic transmitter-switch | Ref. ${S.ref}`, "",
    "CONFIGURATION", ...configLines(),
    ...(n.warn.length ? ["", "TO BE CHECKED", ...n.warn.map(w => "- " + w)] : []),
    ...(S.notes.trim() ? ["", "CUSTOMER NOTES", S.notes.trim()] : []),
    ...(f.message && f.message.trim() ? ["", "MESSAGE", f.message.trim()] : []),
    "", "CONTACT",
    `Name: ${f.name || ""}`, `Company: ${f.company || ""}`, `Email: ${f.email || ""}`, `Phone: ${f.phone || ""}`, `Delivery to: ${f.place || ""}`
  ].join("\n");
}
const buildMailto = body => `mailto:${SETTINGS.QUOTE_EMAIL}?cc=${encodeURIComponent(SETTINGS.QUOTE_CC)}&subject=${encodeURIComponent(quoteSubject())}&body=${encodeURIComponent(body)}`;
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
  done("Your email is ready to send", `We opened a pre-filled email to ${SETTINGS.QUOTE_EMAIL} in your mail app. Please press Send there. If nothing opened, use "Copy request text" and paste it into an email (the copied text includes the recipient, the copy address and the subject line). Tip: download the PDF and attach it for a faster reply.`);
});
async function copyText(t){
  try { await navigator.clipboard.writeText(t); toast("Copied to clipboard"); }
  catch { const ta = document.createElement("textarea"); ta.value = t; document.body.appendChild(ta); ta.select(); try{ document.execCommand("copy"); toast("Copied to clipboard"); }catch{ toast("Copy not available"); } ta.remove(); }
}
let toastTimer;
function toast(t){ const el = $("#toast"); el.textContent = t; el.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove("show"), 3200); }

(function renderFaq(){
  $("#faqList").innerHTML = DEMO_FAQ.map(f => `<details><summary>${esc(f.q)}</summary><div class="faq__a">${f.a}</div></details>`).join("");
  $("#faqCta").href = `mailto:${DEMO_CONTACT.email}?subject=${encodeURIComponent("Configurator enquiry (from the United Electric Controls demo)")}`;
  $("#faqContact").innerHTML = `Or write to <a href="mailto:${DEMO_CONTACT.email}">${DEMO_CONTACT.email}</a> · <a href="${DEMO_CONTACT.site}" target="_blank" rel="noopener">swiftyquote.com</a>`;
})();

window.__cfg = { get S(){ return S; }, set S(v){ S = v; }, newState, go, partNumber, model, getNotes, buildPdf, buildMailto, quoteText, isComplete, renderStep, constrain, optOffWhy, fittingsAllowed, powerOffWhy, sensorOffWhy };
renderStep(false);
