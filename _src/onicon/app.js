"use strict";

/* =====================================================================
   SETTINGS: adjust these lines for your own set-up
   ===================================================================== */
const SETTINGS = {
  QUOTE_EMAIL: "sales@onicon.com",          // where quotation requests are sent (ONICON sales)
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
    a:"<p>The product data, photos and logo belong to ONICON and are used here for demonstration only. This page is not an official ONICON tool and you cannot place orders on it. Please contact ONICON directly for real enquiries about the F-1000 Series.</p>" },
  { q:"Can you build this for my own products?",
    a:"<p>Yes. The configurator is built around your product range, your options and your rules, and it takes on your branding: your logo, colours and fonts. It works for anything a buyer has to specify before they can get a quote, such as range, power, approvals, outputs or accessories.</p>" },
  { q:"What do you need from me to get started?",
    a:"<ul><li>A link to the product page, or the datasheets and catalogue.</li><li>Your logo and brand guidelines (or we take them from your website).</li><li>The options a buyer can choose, and any rules, such as which combinations are possible or which approvals apply.</li><li>The email address (or system) where quotation requests should go.</li></ul>" },
  { q:"How much does it cost?",
    a:"<p>The price depends on how many products and options are covered, whether you need extra languages, and whether it should connect to your other systems. We give you a fixed quote after a short conversation, so there are no surprises.</p><p>Write to <a href=\"mailto:sales@swiftyquote.com?subject=Configurator%20price%20enquiry\">sales@swiftyquote.com</a> with a link to your product and we will come back with a price.</p>" },
  { q:"How long does implementation take?",
    a:"<p>The timeline depends on the size of your range and the features you choose. A single-product configurator like this one is quicker than a full catalogue with several product families. You receive a clear timeline together with your quote, and you see a first working version early so you can give feedback before we finish.</p>" },
  { q:"Can it use our branding and languages?",
    a:"<p>Yes. This demo already follows the ONICON colours, fonts and logo. Your version follows yours. Additional languages can be added.</p>" },
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

const IMG = { FAM:"__IMG_FAM__", INL:"__IMG_INL__" };
const IMG_SIZE = { FAM:[245,420], INL:[420,420] };
const LOGO_URL = "__LOGO__";

/* =====================================================================
   PRODUCT DATA
   Source: ONICON F-1000 Series catalog sheet DOC-0003616 Rev. C (7 pages, "Meter ordering information" p7,
   specifications pp3-4) and the ONICON Turbine Flow Meter Ordering Guide 0266-6.
   Part number: F-1ABB-CC-DD-EFGH-SPC
   ===================================================================== */
const APPS = [
  { id:"chw",    title:"Chilled water",             desc:"HVAC hydronic chilled water loops." },
  { id:"hhw",    title:"Heating hot water",         desc:"HVAC hydronic heating loops." },
  { id:"glycol", title:"Water/glycol solution",     desc:"Hydronic systems with glycol." },
  { id:"dom",    title:"Domestic or municipal water", desc:"Potable water. Insertion meters, 316 SS, NSF certified." },
  { id:"proc",   title:"Clean process water",       desc:"Insertion meters only." },
  { id:"cond",   title:"Condensate",                desc:"Needs 316 stainless steel wetted parts." },
  { id:"other",  title:"Something else",            desc:"We will look at it together with you." }
];
const TEMPS = [
  { id:"t150", title:"Up to 150 °F",       desc:"−20 to 150 °F (−29 to 66 °C). Chilled and domestic cold water.", badge:"Most common" },
  { id:"t200", title:"150 to 200 °F",      desc:"66 to 93 °C. Most heating hot water." },
  { id:"t250", title:"200 to below 250 °F", desc:"93 to 121 °C." },
  { id:"t280", title:"250 to 280 °F",      desc:"121 to 138 °C. Insertion meters need 316 SS." },
  { id:"thot", title:"Above 280 °F",       desc:"Above 138 °C. Beyond the continuous rating.", flag:"high" },
  { id:"tunk", title:"Not sure",           desc:"We will check it with you." }
];
const LOCS = [
  { id:"in",   title:"Mechanical room or indoors",  desc:"NEMA 4 weathertight enclosure." },
  { id:"plen", title:"Plenum ceiling space",        desc:"Air-handling space: plenum-rated cable." },
  { id:"out",  title:"Outdoors",                    desc:"NEMA 4 weathertight enclosure." },
  { id:"sub",  title:"Pit or vault that can flood", desc:"NEMA 6 submersible enclosure, insertion meters only." }
];
/* Nominal pipe sizes. [id, label, inches, GPM at 0.1 ft/s, GPM at 20 ft/s] (catalog p4 operating range table; none above 36") */
const PIPES = [
  ["075","¾″",0.75,0.4,38], ["1","1″",1,0.4,38], ["125","1¼″",1.25,0.8,95], ["15","1½″",1.5,1,130], ["2","2″",2,2,210],
  ["25","2½″",2.5,2.5,230], ["3","3″",3,4,460], ["4","4″",4,8,800], ["6","6″",6,15,1800], ["8","8″",8,26,3100],
  ["10","10″",10,42,4900], ["12","12″",12,60,7050], ["14","14″",14,72,8600], ["16","16″",16,98,11400], ["18","18″",18,120,14600],
  ["20","20″",20,150,18100], ["24","24″",24,230,26500], ["30","30″",30,360,41900], ["36","36″",36,510,60900],
  ["42","42″",42], ["48","48″",48], ["54","54″",54], ["60","60″",60], ["66","66″",66], ["72","72″",72]
].map(([id,title,d,lo,hi]) => ({ id, title, d, lo:lo || null, hi:hi || null }));
const MATS = [
  { id:"steel",   title:"Steel" },
  { id:"copper",  title:"Copper" },
  { id:"ss",      title:"Stainless steel" },
  { id:"iron",    title:"Ductile or cast iron" },
  { id:"plastic", title:"PVC, CPVC or other plastic", desc:"Insertion meters need 316 SS." },
  { id:"other",   title:"Other / not sure" }
];
/* A = number of turbines, BB = meter type */
const TYPES = [
  { id:"ins1", A:"1", title:"Insertion, single turbine", desc:"Hot-tap insertion meter for 1¼″ to 72″ pipe. Removable by hand without shutting the system down." },
  { id:"ins2", A:"2", title:"Insertion, dual turbine",   desc:"Two counter-rotating turbines cancel swirl from bends and elbows, so less straight pipe is needed upstream. 2½″ to 72″.", badge:"Best accuracy" },
  { id:"inl",  A:"1", title:"Inline, ¾″ or 1″",         desc:"Compact meter with threaded or sweat union fittings for small pipes." }
];
/* DD = pipe size range */
const RANGES = [
  { id:"A1", lo:1,   hi:2.5, single:true }, { id:"B2", lo:1,   hi:4,  single:true },
  { id:"C3", lo:2.5, hi:10 }, { id:"D4", lo:2.5, hi:16 }, { id:"E5", lo:2.5, hi:22 }, { id:"F6", lo:2.5, hi:72 }
].map(r => ({ ...r, title:`${fmtIn(r.lo)} to ${fmtIn(r.hi)} pipe` }));
function fmtIn(v){ return ({0.75:"¾″",1.25:"1¼″",1.5:"1½″",2.5:"2½″"})[v] || `${v}″`; }
/* CC = outputs */
const OUTPUTS = [
  { id:"00", title:"Frequency and scaled pulse",              desc:"0-15 V frequency signal for an ONICON display or Btu meter, plus an isolated dry-contact pulse (e.g. 1 pulse = 10 gal) for totalizing.", power:"24 VAC 65 mA (1.6 VA) or 24 VDC 30 mA (1 W)" },
  { id:"10", title:"Analog, frequency and scaled pulse",      desc:"4-20 mA, 0-10 V or 0-5 V (field programmable) for your building automation system, plus frequency and scaled pulse.", badge:"Most common", power:"24 VAC 115 mA (2.8 VA) or 24 VDC 60 mA (1.5 W)" },
  { id:"11", title:"Isolated analog, frequency and scaled pulse", desc:"As above, with the analog signal ground isolated from the power supply and pipe ground.", power:"24 VAC 150 mA (3.6 VA) or 24 VDC 75 mA (2 W)" }
];
/* E = wetted materials */
const MATERIALS = [
  { id:"1", title:"Nickel-plated brass",  desc:"For hydronic water in metal pipe." },
  { id:"2", title:"316 stainless steel",  desc:"Insertion meters. Required for non-metallic pipe, condensate, water at or above 250 °F, NSF potable water and submersible installations." },
  { id:"3", title:"Bronze body",          desc:"Inline meters only." }
];
/* F = electronics enclosure (follows the location) */
const ENCLOSURES = { "2":"NEMA 4 weathertight enclosure", "3":"NEMA 6 submersible enclosure" };
/* G = wiring connection */
const WIRING = [
  { id:"2", title:"10′ PVC-jacketed cable, pigtail",       desc:"With ½″ conduit adapter." },
  { id:"5", title:"10′ plenum-rated cable, DIN connector", desc:"With ½″ conduit adapter. For plenum spaces." },
  { id:"7", title:"10′ submersible cable with connector",  desc:"For the NEMA 6 submersible enclosure." }
];
/* H = process adapter */
const ADAPTERS = [
  { id:"1", title:"1″ NPT adapter, medium temperature",          desc:"Fluid up to 150 °F." },
  { id:"2", title:"1″ NPT adapter, high temperature",            desc:"Fluid up to 280 °F." },
  { id:"3", title:"1″ NPT adapter, NSF certified, domestic water", desc:"Fluid up to 200 °F. NSF/ANSI 61 and 372." },
  { id:"9", title:"Inline coupling adapters",                     desc:"Chosen to suit your pipe material." }
];
const PERIPH = [
  { id:"disp", title:"D-100 or D-1200 display module", desc:"Local flow rate and total. Quoted as a separate item." },
  { id:"btu",  title:"System-10 Btu meter",             desc:"Energy metering with supply and return temperature sensors. Quoted separately." }
];

const SPECS = [
  ["Accuracy (insertion)", "+/-1% of reading from 3 to 30 ft/s; +/-2% of reading from 0.4 to 20 ft/s"],
  ["Accuracy (inline)",    "+/-2% of reading from 0.8 to 38 GPM"],
  ["Sensing",              "Electronic impedance sensing (non-magnetic, non-photoelectric); +/-0.5% of reading at calibrated velocity"],
  ["Fluid temperature",    "-20 to 150 F (low temp); 150 to 280 F continuous, 300 F peak (high temp)"],
  ["Pressure",             "400 psi maximum; insertion drop < 0.16 psi at 8 ft/s, inline 0.48 psi at maximum flow"],
  ["Outputs",              "Frequency 0-15 V; scaled pulse dry contact 100 mA, 50 V; analog 4-20 mA, 0-10 V or 0-5 V (field programmable)"],
  ["Conductivity",         "Default 100-5000 uS/cm; extended range as low as 5 uS/cm"],
  ["Ambient",              "-5 to 160 F; USB programming and diagnostics; NIST-traceable wet calibration"]
];

/* =====================================================================
   STATE
   ===================================================================== */
const STEPS = [
  { id:"app",    label:"Application" },
  { id:"pipe",   label:"Pipe & meter" },
  { id:"out",    label:"Outputs" },
  { id:"build",  label:"Construction" },
  { id:"extras", label:"Calibration & extras" },
  { id:"review", label:"Review" }
];
const $ = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => [...el.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const byId = (arr,id) => arr.find(x => x.id === id);

function newState(){
  return { step:0, maxStep:0, app:null, temp:null, loc:null,
           pipe:null, mat:null, type:null, dd:null,
           cc:null, bt:false, e:null, g:null, h:null,
           flowMin:"", flowMax:"", sched:"", kit:false, hottap:false, periph:[],
           qty:1, notes:"", ref:makeRef(), helpOpen:{} };
}
function makeRef(){
  const d = new Date(), p = n => String(n).padStart(2,"0");
  const rnd = Math.random().toString(36).slice(2,6).toUpperCase();
  return `ON-${String(d.getFullYear()).slice(2)}${p(d.getMonth()+1)}${p(d.getDate())}-${rnd}`;
}
let S = newState();

/* ---------- rules ---------- */
const pipeObj = () => byId(PIPES, S.pipe || "");
const isInline = () => S.type === "inl";
const isInsertion = () => S.type === "ins1" || S.type === "ins2";
const encl = () => S.loc === "sub" ? "3" : (S.loc ? "2" : null);
const hotTemp = () => S.temp === "t280" || S.temp === "thot";
function need316(){
  if (isInline()) return [];
  const r = [];
  if (S.app === "dom") r.push("NSF potable water");
  if (S.app === "cond") r.push("condensate");
  if (hotTemp()) r.push("water at or above 250 °F");
  if (S.mat === "plastic") r.push("non-metallic pipe");
  if (S.loc === "sub") r.push("the submersible enclosure");
  return r;
}
function typeOffWhy(t){
  const p = pipeObj();
  if (t.id === "inl"){
    if (p && p.d > 1) return "Inline meters are made for ¾″ and 1″ pipe only.";
    if (S.app === "dom" || S.app === "proc") return "Domestic and process water: insertion meters only.";
    if (S.loc === "sub") return "The submersible NEMA 6 enclosure is for insertion meters only.";
    return null;
  }
  if (p && p.d < 1) return "Insertion meters need 1¼″ pipe or larger (1″ with the ONICON copper tee).";
  if (t.id === "ins2" && p && p.d < 2.5) return "Dual turbine ranges start at 2½″ pipe (A1 and B2 are single turbine only).";
  return null;
}
function rangeOffWhy(r){
  const p = pipeObj();
  if (p && (p.d < r.lo || p.d > r.hi)) return `For ${fmtIn(r.lo)} to ${fmtIn(r.hi)} pipe.`;
  if (r.single && S.type === "ins2") return "Single turbine (F-1100) only.";
  return null;
}
const rangesAllowed = () => isInsertion() ? RANGES.filter(r => !rangeOffWhy(r)) : [];
function eOffWhy(m){
  if (!S.type) return null;
  if (m.id === "3" && !isInline()) return "The bronze body is for inline meters only.";
  if (m.id === "2" && isInline()) return "316 stainless steel is for insertion meters only.";
  if (m.id === "1" && need316().length) return `316 stainless steel is required for ${need316().join(", ")}.`;
  return null;
}
function gOffWhy(w){
  if (w.id === "7" && encl() !== "3") return "Only with the submersible NEMA 6 enclosure (pit or vault that can flood).";
  if (w.id !== "7" && encl() === "3") return "The submersible enclosure uses the submersible cable (G=7).";
  return null;
}
function hOffWhy(a){
  if (isInline()) return a.id === "9" ? null : "Inline meters use coupling adapters (H=9).";
  if (a.id === "9") return "For inline meters only.";
  if (a.id === "1" && ["t200","t250","t280","thot"].includes(S.temp)) return "Rated to 150 °F: your water is hotter.";
  if (a.id === "3" && ["t250","t280","thot"].includes(S.temp)) return "Rated to 200 °F: your water is hotter.";
  if (a.id === "3" && S.e && S.e !== "2") return "NSF potable water requires 316 stainless steel wetted parts (E=2).";
  return null;
}
function btOffWhy(){ return encl() === "3" ? "Bluetooth is available with the NEMA 4 enclosure only." : null; }
function recommendedRange(){ const a = rangesAllowed(); return a.length ? a[0].id : null; }
function recommendedE(){ if (isInline()) return "3"; return need316().length ? "2" : "1"; }
function recommendedG(){ return encl() === "3" ? "7" : (S.loc === "plen" ? "5" : "2"); }
function recommendedH(){
  if (isInline()) return "9";
  if (S.app === "dom" && !hOffWhy(byId(ADAPTERS,"3"))) return "3";
  return S.temp === "t150" ? "1" : "2";
}
function constrain(){
  const t = byId(TYPES, S.type || ""); if (t && typeOffWhy(t)) S.type = null;
  if (isInline()) S.dd = "00";
  else if (isInsertion()){ const r = byId(RANGES, S.dd || ""); if (!r || rangeOffWhy(r)) S.dd = recommendedRange(); }
  else S.dd = null;
  const m = byId(MATERIALS, S.e || ""); if (m && eOffWhy(m)) S.e = null;
  const w = byId(WIRING, S.g || ""); if (w && gOffWhy(w)) S.g = null;
  const a = byId(ADAPTERS, S.h || ""); if (a && hOffWhy(a)) S.h = null;
  if (btOffWhy()) S.bt = false;
  if (!isInsertion()){ S.kit = false; S.hottap = false; }
}

/* ---------- derived values ---------- */
function bb(){ if (isInsertion()) return "00"; if (isInline()) return pipeObj() && pipeObj().d < 1 ? "34" : "01"; return null; }
function partNumber(){
  const t = byId(TYPES, S.type || ""), q = v => v || "?";
  return `F-1${t ? t.A : "?"}${bb() || "??"}-${S.cc || "??"}-${S.dd || "??"}-${q(S.e)}${q(encl())}${q(S.g)}${q(S.h)}${S.bt ? "-503" : ""}`;
}
const codeIsFinal = () => !partNumber().includes("?");
const modelShort = () => { const t = byId(TYPES, S.type || ""); return t ? `F-1${t.A}${bb()}` : null; };
const num = v => /^\d+(\.\d+)?$/.test(String(v).trim());
function flowValid(){
  const a = String(S.flowMin).trim(), b = String(S.flowMax).trim();
  if (a && !num(a)) return false; if (b && !num(b)) return false;
  if (a && b && +a >= +b) return false;
  return true;
}
function flowText(){
  const a = String(S.flowMin).trim(), b = String(S.flowMax).trim();
  if (!a && !b) return "To be confirmed";
  return `${a || "?"} to ${b || "?"} GPM`;
}
function pipeText(){ const p = pipeObj(), m = byId(MATS, S.mat || ""); if (!p) return null; return `${p.title} ${m ? m.title.toLowerCase() : ""}`.trim(); }
function typeText(){ const t = byId(TYPES, S.type || ""); return t ? t.title : null; }
function rangeText(){ if (isInline()) return "Inline (00)"; const r = byId(RANGES, S.dd || ""); return r ? `${r.id}: ${r.title}` : null; }
function outText(){ const o = byId(OUTPUTS, S.cc || ""); return o ? `${o.id}: ${o.title}` : null; }
function extrasText(){
  const t = [];
  if (S.bt) t.push("Bluetooth interface (503)");
  if (S.kit) t.push("Installation hardware kit");
  if (S.hottap) t.push("Hot tap installation");
  S.periph.forEach(p => t.push(byId(PERIPH,p).title));
  return t.length ? t.join("; ") : "None";
}
function calText(){
  const s = String(S.sched).trim();
  return `Flow ${flowText()}; pipe schedule/ID ${s || "to be confirmed"}`;
}

function validStep(id){
  switch(id){
    case "app":    return !!(S.app && S.temp && S.loc);
    case "pipe":   return !!(S.pipe && S.mat && S.type && S.dd);
    case "out":    return !!S.cc;
    case "build":  return !!(S.e && S.g && S.h);
    case "extras": return flowValid();
    default:       return true;
  }
}
const isComplete = () => STEPS.slice(0,-1).every(s => validStep(s.id));

function getNotes(){
  const warn = [], info = [], p = pipeObj();
  if (S.temp === "thot") warn.push("Above 280 °F: the F-1000 is rated 280 °F continuous (300 °F peak). Please talk to ONICON before ordering.");
  if (S.temp === "tunk") warn.push("Fluid temperature to be confirmed: it decides the process adapter and, from 250 °F, the wetted materials.");
  if (S.app === "other") warn.push("Application to be clarified with you before quotation.");
  if (S.app === "cond" || S.app === "proc") warn.push("Please confirm the conductivity of your fluid: the default range is 100-5000 µS/cm, extended as low as 5 µS/cm on request.");
  if (S.mat === "other") warn.push("Pipe material to be confirmed: it is needed for the calibration and the installation hardware.");
  if (isInline() && S.mat === "plastic") warn.push("Inline meter in plastic pipe: coupling adapters to be confirmed by ONICON.");
  if (isInline()) warn.push(`Inline meters are coded with a single turbine (${modelShort()}): to be confirmed by ONICON.`);
  if (isInline() && S.e === "1") warn.push("Inline meter in nickel-plated brass: the catalog lists the inline meter with a bronze body (E=3). To be confirmed.");
  if (isInsertion() && p && p.d === 1) warn.push(`1″ insertion meters are installed in the ONICON copper tee${S.mat && S.mat !== "copper" ? " (copper pipe)" : ""}: tee part number to be confirmed.`);
  if (S.app === "dom" && isInsertion() && S.h && S.h !== "3") warn.push("For domestic (potable) water the catalog lists the NSF-certified adapter (H=3), rated to 200 °F.");
  if (S.loc === "plen" && S.g === "2") warn.push("Plenum space: plenum-rated cable (G=5) is usually required by code.");
  const a = String(S.flowMin).trim(), b = String(S.flowMax).trim();
  if (!a || !b) warn.push("Flow range (minimum and maximum GPM) to be confirmed: every meter is wet-calibrated for its application.");
  if (!String(S.sched).trim()) warn.push("Pipe schedule or inside diameter to be confirmed for the calibration.");
  if (p && p.hi && b && num(b) && +b > p.hi) warn.push(`Maximum flow ${b} GPM is above 20 ft/s in ${p.title} pipe (${p.hi.toLocaleString("en-US")} GPM).`);
  if (p && p.lo && a && num(a) && +a < p.lo) warn.push(`Minimum flow ${a} GPM is below the measuring range in ${p.title} pipe (${p.lo} GPM at 0.1 ft/s).`);
  else if (p && p.lo && a && num(a) && !isInline() && +a < p.lo * 4) info.push(`±2% accuracy starts at 0.4 ft/s (about ${+(p.lo * 4).toFixed(1)} GPM in ${p.title} pipe).`);
  if (isInline() && a && num(a) && +a >= 0.4 && +a < 0.8) info.push("Inline accuracy ±2% of reading from 0.8 GPM.");
  if (S.kit) warn.push("Installation hardware kit: the part number depends on the pipe material and is confirmed in the quotation.");
  if (S.type === "ins2") info.push("Dual turbine: counter-rotating turbines reduce the effect of swirl from bends and elbows.");
  if (S.cc === "00") info.push("The frequency output is meant for an ONICON display or Btu meter: it is too fast for most building control systems.");
  const o = byId(OUTPUTS, S.cc || ""); if (o) info.push(`Power: ${o.power}.`);
  if (S.hottap) info.push("Hot tap: isolation valve, close nipple and welded branch outlet must be 1¼″ NPT minimum.");
  if (S.bt) info.push("Bluetooth 5.1 Low Energy, range up to 50 ft.");
  info.push("Every meter is wet-calibrated against NIST-traceable standards and ships with a calibration certificate.");
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
      ${head(1,"What will the F-1000 measure?","ONICON turbine meters measure the flow of water and water/glycol in HVAC and water systems. Tell us about the fluid and where the meter goes.")}
      ${group("What flows through the pipe?", null, radios("app", APPS))}
      ${group("Fluid temperature", "The highest continuous temperature at the meter.", radios("temp", TEMPS))}
      ${group("Where is the meter installed?", "Ambient −5 to 160 °F.", radios("loc", LOCS))}
      ${helpHtml("app","Why do temperature and location matter?",`<p>The <strong>temperature</strong> decides the process adapter: medium temperature up to 150 °F, high temperature up to 280 °F, and the NSF-certified domestic water adapter up to 200 °F. From 250 °F insertion meters are built in 316 stainless steel.</p><p>The <strong>location</strong> decides the enclosure and cable: the standard NEMA 4 weathertight enclosure, plenum-rated cable for ceiling plenums, or the NEMA 6 submersible version for pits and vaults that can flood.</p>`)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  pipe(){
    const p = pipeObj();
    const types = TYPES.map(t => { const why = typeOffWhy(t);
      return optHtml({ name:"type", value:t.id, checked:S.type===t.id, title:t.title, desc:why || t.desc, badge:why ? null : t.badge, meta:`Model F-1${t.A}${t.id === "inl" ? (p && p.d < 1 ? "34" : p && p.d === 1 ? "01" : "34/01") : "00"}`, off:!!why }); }).join("");
    const rec = recommendedRange();
    const ranges = isInsertion() ? group("Pipe size range", "The meter is built for a range of pipe sizes. The smallest range that fits is preselected.",
      RANGES.map(r => { const why = rangeOffWhy(r);
        return optHtml({ name:"dd", value:r.id, checked:S.dd===r.id, title:r.title, desc:why || (r.single ? "Single turbine only." : null), meta:`Code ${r.id}`, badge:!why && r.id === rec ? "Recommended" : null, off:!!why }); }).join("")) : "";
    return `<div class="step">
      ${head(2,"Pipe and meter type","The meter is calibrated for your pipe, so we need its size and material.")}
      ${group("Nominal pipe size", null, PIPES.map(x => optHtml({ name:"pipe", value:x.id, checked:S.pipe===x.id, title:x.title })).join(""), "opts--sizes")}
      ${group("Pipe material", null, radios("mat", MATS))}
      ${group("Meter type", null, types, "opts--wide")}
      ${ranges}
      ${helpHtml("pipe","Insertion or inline? Single or dual turbine?",`<ul><li><strong>Insertion</strong> meters go through a 1″ NPT branch outlet into pipes from 1¼″ to 72″. With a full-port valve they can be installed and removed without draining the system (hot tap).</li><li><strong>Dual turbine</strong> meters reduce the effect of swirl after bends and elbows, so they need less straight pipe upstream.</li><li><strong>Inline</strong> meters are for small ¾″ and 1″ pipes and come with threaded or sweat union fittings.</li></ul>`)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  out(){
    const why = btOffWhy();
    return `<div class="step">
      ${head(3,"Outputs and connectivity","How should the meter talk to your control system?")}
      ${group("Output signals", "All outputs include the frequency signal and an isolated scaled-pulse dry contact (100 mA, 50 V).",
        OUTPUTS.map(o => optHtml({ name:"cc", value:o.id, checked:S.cc===o.id, title:o.title, desc:o.desc, badge:o.badge, meta:`Code ${o.id} · ${o.power}` })).join(""), "opts--wide")}
      ${group("Wireless set-up", null, optHtml({ type:"checkbox", name:"bt", value:"1", checked:S.bt, title:"Bluetooth® interface", desc:why || "Real-time data and diagnostics on your phone for fast commissioning. Bluetooth 5.1 LE, up to 50 ft.", meta:"Code 503", off:!!why }))}
      ${helpHtml("out","Which output do I need?",`<ul><li><strong>Analog (10)</strong> is the usual choice for a building automation system: 4-20 mA, 0-10 V or 0-5 V, set in the field.</li><li><strong>Isolated analog (11)</strong> helps when the controller and the pipe are at different ground potentials.</li><li><strong>Frequency (00)</strong> is meant for an ONICON display or Btu meter.</li></ul><p>All versions are powered with 24 VAC or 24 VDC and can be programmed over USB.</p>`)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  build(){
    const f = encl();
    return `<div class="step">
      ${head(4,"Materials and connections","We preselected what fits your application. Options that do not fit are greyed out with the reason.")}
      ${group("Wetted materials", null, MATERIALS.map(m => { const why = eOffWhy(m);
        return optHtml({ name:"e", value:m.id, checked:S.e===m.id, title:m.title, desc:why || m.desc, meta:`Code ${m.id}`, off:!!why }); }).join(""))}
      <div class="group"><div class="group__title">Electronics enclosure</div><div class="group__sub">Follows the location you chose in step 1.</div>
        <div class="opts">${optHtml({ name:"encl", value:f, checked:true, title:ENCLOSURES[f] || "–", desc:f === "3" ? "Epoxy-coated aluminum, submersible." : "Cast aluminum, epoxy coated.", meta:`Code ${f}` })}</div></div>
      ${group("Wiring connection", null, WIRING.map(w => { const why = gOffWhy(w);
        return optHtml({ name:"g", value:w.id, checked:S.g===w.id, title:w.title, desc:why || w.desc, meta:`Code ${w.id}`, badge:!why && w.id === "5" && S.loc === "plen" ? "Recommended" : null, off:!!why }); }).join(""))}
      ${group("Process adapter", null, ADAPTERS.map(a => { const why = hOffWhy(a);
        return optHtml({ name:"h", value:a.id, checked:S.h===a.id, title:a.title, desc:why || a.desc, meta:`Code ${a.id}`, off:!!why }); }).join(""))}
      ${helpHtml("build","Brass or stainless steel?",`<p><strong>Nickel-plated brass</strong> suits most chilled and heating water in metal pipe. <strong>316 stainless steel</strong> is required for non-metallic pipe, condensate, hot water at or above 250 °F, NSF potable water and submersible installations. Inline meters have a <strong>bronze body</strong>.</p>`)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  extras(){
    return `<div class="step">
      ${head(5,"Calibration data and extras","ONICON wet-calibrates every meter for your application. Give us what you know: anything left open is confirmed with you.")}
      <div class="group"><div class="group__title">Flow range</div><div class="group__sub">${pipeObj() && pipeObj().hi ? `In ${pipeObj().title} pipe the meter measures about ${pipeObj().lo} to ${pipeObj().hi.toLocaleString("en-US")} GPM (0.1 to 20 ft/s).` : "Minimum and maximum flow in US gallons per minute."}</div>
        <div class="dims">
          <label class="field"><span class="l">Minimum flow</span><span class="unit-input"><input id="flowMin" type="text" inputmode="decimal" value="${esc(S.flowMin)}" placeholder="e.g. 20"><em>GPM</em></span></label>
          <label class="field"><span class="l">Maximum flow</span><span class="unit-input"><input id="flowMax" type="text" inputmode="decimal" value="${esc(S.flowMax)}" placeholder="e.g. 400"><em>GPM</em></span></label>
        </div>
        <label class="field" style="margin-top:14px;max-width:362px"><span class="l">Pipe schedule or inside diameter</span><input id="sched" type="text" value="${esc(S.sched)}" placeholder="e.g. Schedule 40, Type L, ID 4.026″"></label>
      </div>
      ${group("Installation", null,
        optHtml({ type:"checkbox", name:"kit", value:"1", checked:S.kit, title:"Installation hardware kit", desc:isInsertion() ? "Strongly recommended by ONICON. The kit depends on the pipe material." : "For insertion meters only.", off:!isInsertion() }) +
        optHtml({ type:"checkbox", name:"hottap", value:"1", checked:S.hottap, title:"Hot tap installation", desc:isInsertion() ? "Install and remove the meter without draining the system." : "For insertion meters only.", off:!isInsertion() }))}
      ${group("Also quote", null, PERIPH.map(o => optHtml({ type:"checkbox", name:"periph", value:o.id, checked:S.periph.includes(o.id), title:o.title, desc:o.desc })).join(""))}
      ${helpHtml("extras","What is in the installation kit?",`<p>For an insertion meter in steel pipe the typical installation is a welded branch outlet, a threaded close nipple and a full-port isolation valve, all 1″ NPT minimum (1¼″ NPT minimum for hot tap installations), plus the hot tap adapter and depth gauge. ONICON offers kits matched to the pipe material.</p>`)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  review(){
    const rows = summaryRows(true), n = getNotes();
    return `<div class="step">
      ${head(6,"Review your configuration","Check everything below. You can change any answer, then download the PDF or ask for a quotation.")}
      <div class="code-box"><div class="k">Model number</div><div class="v">${esc(partNumber())}</div><div class="s">${codeIsFinal() ? "Built from the catalog's model number codification. Confirmed by ONICON in the quotation." : "“?” marks a choice we will confirm with you."}</div></div>
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
        <label class="field"><span class="l">Notes for our team (optional)</span><textarea id="notes" placeholder="e.g. tag numbers, straight run available, BAS make, delivery date…">${esc(S.notes)}</textarea></label>
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
    if (S.temp === "t150" || S.temp === "t200") out.push(msg("ok","Your temperature is within the standard ratings."));
    if (S.temp === "t280") out.push(msg("info","From 250 °F insertion meters are built in 316 stainless steel."));
    getNotes().warn.filter(w => /280 °F|Fluid temperature|conductivity|clarified/.test(w)).forEach(w => out.push(msg("warn",w)));
    if (S.loc === "sub") out.push(msg("info","Submersible NEMA 6 enclosure: insertion meter in 316 SS with the submersible cable."));
    if (S.app === "dom") out.push(msg("info","Domestic water: insertion meter in 316 SS with the NSF-certified adapter."));
    return out.join("");
  },
  pipe(){
    const out = [];
    if (S.type) out.push(msg("ok",`Your meter: ${modelShort()}${S.dd ? `, range ${S.dd}` : ""}.`));
    getNotes().warn.filter(w => /copper tee|single turbine|Pipe material|plastic pipe/.test(w)).forEach(w => out.push(msg("warn",w)));
    if (S.type === "ins2") out.push(msg("info","Dual turbine: counter-rotating turbines reduce the effect of swirl from bends and elbows."));
    return out.join("");
  },
  out(){
    const out = [], o = byId(OUTPUTS, S.cc || "");
    if (o) out.push(msg("info",`Power: ${o.power}.`));
    if (S.cc === "00") out.push(msg("warn","The frequency output is meant for an ONICON display or Btu meter: it is too fast for most building control systems."));
    return out.join("");
  },
  build(){
    const out = [];
    if (need316().length) out.push(msg("info",`316 stainless steel is required for ${need316().join(", ")}.`));
    getNotes().warn.filter(w => /NSF-certified|Plenum|bronze body/.test(w)).forEach(w => out.push(msg("warn",w)));
    return out.join("");
  },
  extras(){
    const out = [];
    if (!flowValid()) out.push(msg("warn","Please enter numbers only, with the minimum below the maximum."));
    else getNotes().warn.filter(w => /20 ft\/s|measuring range/.test(w)).forEach(w => out.push(msg("warn",w)));
    getNotes().info.filter(w => /0\.4 ft\/s|0\.8 GPM|Hot tap/.test(w)).forEach(w => out.push(msg("info",w)));
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
    { k:"Application",       v:byId(APPS,S.app||"")?.title || null, step:g(0) },
    { k:"Fluid temperature", v:byId(TEMPS,S.temp||"")?.title || null, step:g(0) },
    { k:"Location",          v:byId(LOCS,S.loc||"")?.title || null, step:g(0) },
    { k:"Pipe",              v:pipeText(), step:g(1) },
    { k:"Meter type",        v:typeText(), step:g(1) },
    { k:"Pipe size range",   v:rangeText(), step:g(1) },
    { k:"Outputs",           v:outText(), step:g(2) },
    { k:"Wetted materials",  v:S.e ? byId(MATERIALS,S.e).title : null, step:g(3) },
    { k:"Enclosure",         v:past(3) && encl() ? ENCLOSURES[encl()] : null, step:g(0) },
    { k:"Wiring",            v:S.g ? byId(WIRING,S.g).title : null, step:g(3) },
    { k:"Process adapter",   v:S.h ? byId(ADAPTERS,S.h).title : null, step:g(3) },
    { k:"Calibration data",  v:past(4) ? calText() : null, step:g(4) },
    { k:"Extras",            v:past(4) || S.bt ? extrasText() : null, step:g(4) },
    { k:"Quantity",          v:S.step >= 5 ? String(S.qty) : null, step:null }
  ];
}
function sumImgKey(){ return isInline() ? "INL" : "FAM"; }
function renderSummary(){
  const key = sumImgKey(), img = $("#sumImg");
  if (img.dataset.key !== key){ img.src = IMG[key]; img.dataset.key = key; }
  const m = modelShort();
  $("#sumModel").textContent = m ? `ONICON ${m}` : "F-1000 Series turbine flow meter";
  const bits = [typeText(), pipeText()].filter(Boolean);
  $("#sumSub").textContent = bits.length ? bits.join(" · ") : "Your choices appear here as you go.";
  $("#sumCode").textContent = S.type || S.cc ? partNumber() : "";
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
  if (id === "pipe") return !S.pipe ? "Please choose the pipe size." : !S.mat ? "Please choose the pipe material." : "Please choose the meter type.";
  if (id === "out") return "Please choose the outputs.";
  if (id === "build") return "Please complete all choices.";
  if (id === "extras") return "Please check the flow range.";
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
    if (!S.e) S.e = recommendedE();
    if (!S.g) S.g = recommendedG();
    if (!S.h) S.h = recommendedH();
    constrain();
  }
  S.step = i; S.maxStep = Math.max(S.maxStep, i);
  renderStep(true);
}
function refresh(){ renderStepper(); renderNav(); renderSummary(); refreshFeedback(); }

/* =====================================================================
   EVENTS
   ===================================================================== */
document.addEventListener("change", e => {
  const t = e.target;
  if (t.type !== "radio" && t.type !== "checkbox") return;
  const n = t.name, v = t.value;
  if (n === "encl") return;
  if (n === "periph"){ if (t.checked){ if (!S.periph.includes(v)) S.periph.push(v); } else S.periph = S.periph.filter(x => x !== v); }
  else if (n === "bt" || n === "kit" || n === "hottap") S[n] = t.checked;
  else S[n] = v;
  /* a new location, application or temperature can change the materials, cable and adapter: re-propose them */
  if (["app","temp","loc","type","pipe","mat"].includes(n) && S.maxStep >= 3){
    constrain();
    if (!S.e) S.e = recommendedE();
    if (!S.g) S.g = recommendedG();
    if (!S.h) S.h = recommendedH();
  }
  if (n === "e" && S.app === "dom" && v === "2" && isInsertion() && !hOffWhy(byId(ADAPTERS,"3"))) S.h = S.h || "3";
  constrain();
  S.maxStep = Math.max(S.maxStep, S.step);
  const y = window.scrollY; $("#stage").innerHTML = VIEWS[STEPS[S.step].id](); window.scrollTo(0,y);
  const el = $(`input[name="${n}"][value="${v}"]`); if (el) el.focus({preventScroll:true});
  refresh();
});
document.addEventListener("input", e => {
  const t = e.target;
  if (t.id === "flowMin" || t.id === "flowMax" || t.id === "sched"){ S[t.id] = t.value; refresh(); }
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
  .replace(/″/g,'"').replace(/′/g,"'").replace(/(\d)¼/g,"$1 1/4").replace(/(\d)½/g,"$1 1/2").replace(/¼/g,"1/4").replace(/½/g,"1/2").replace(/¾/g,"3/4").replace(/[–—]/g,"-").replace(/≤/g,"<=").replace(/≥/g,">=")
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
  const NAVY = [44,46,53], INK = [51,51,51], GREY = [122,124,128], LINE = [214,218,222], BLUE = [20,103,184], AMBER = [200,120,0];
  const code = partNumber();
  const today = new Date().toLocaleDateString("en-GB", { day:"2-digit", month:"long", year:"numeric" });
  const PAGE_END = 277; let y = 0;
  const T = t => pdfText(t);
  const hair = (x1, yy, x2) => { doc.setDrawColor(...LINE); doc.setLineWidth(.25); doc.line(x1, yy, x2, yy); };
  const small = (t, x, yy, o = {}) => { doc.setFont("helvetica", o.bold ? "bold" : "normal"); doc.setFontSize(o.size || 8); doc.setTextColor(...(o.color || GREY)); if (o.space) doc.setCharSpace(o.space); doc.text(T(t), x, yy, o.align ? { align:o.align } : undefined); if (o.space) doc.setCharSpace(0); };
  const newPage = () => { doc.addPage(); small(`ONICON  |  Product configuration ${code}  |  Ref. ${S.ref}`, M, 14, { size:7.5 }); hair(M, 17, W - M); y = 28; };
  const need = h => { if (y + h > PAGE_END) newPage(); };
  const section = (title, x, yy, w) => { small(title.toUpperCase(), x, yy, { size:7, bold:true, space:.5 }); hair(x, yy + 2.2, x + w); return yy + 8; };
  const item = (label, value, x, yy, w) => { small(label, x, yy, { size:7.5 }); doc.setFont("helvetica","bold"); doc.setFontSize(9.6); doc.setTextColor(...NAVY); const vl = doc.splitTextToSize(T(value || "-"), w); doc.text(vl, x, yy + 4.2); return yy + 4.2 + vl.length * 4.1 + 2.4; };
  const compact = (label, value, x, yy, w) => { small(label, x, yy, { size:7 }); doc.setFont("helvetica","bold"); doc.setFontSize(8.6); doc.setTextColor(...NAVY); const vl = doc.splitTextToSize(T(value || "-"), w); doc.text(vl, x, yy + 3.9); return yy + 3.9 + vl.length * 3.7 + 2.8; };
  const para = (t, x, yy, w, o = {}) => { doc.setFont("helvetica","normal"); doc.setFontSize(o.size || 8.6); doc.setTextColor(...(o.color || INK)); const l = doc.splitTextToSize(T(t), w); doc.text(l, x, yy); return yy + l.length * (o.lh || 4.1) + (o.gap == null ? 2 : o.gap); };
  const bullet = (t, x, yy, w, color) => { doc.setFillColor(...color); doc.rect(x, yy - 2, 1.4, 1.4, "F"); return para(t, x + 4.5, yy, w - 4.5); };

  if (logo) doc.addImage(logo, "JPEG", M, 12, 36, 36*172/490);
  small("Product configuration", W - M, 17, { size:10, bold:true, color:NAVY, align:"right" });
  small(`Ref. ${S.ref}   |   ${today}`, W - M, 22, { size:8, align:"right" });
  small("F-1000 Series turbine flow meter", W - M, 26.5, { size:8, align:"right" });
  hair(M, 32, W - M);
  y = 42;

  const [pw, ph] = IMG_SIZE[sumImgKey()], IH = 34, IW = IH * pw / ph;
  if (photo) doc.addImage(photo, "JPEG", W - M - IW, y - 6, IW, IH, undefined, "FAST");
  doc.setFont("helvetica","bold"); doc.setFontSize(19); doc.setTextColor(...NAVY);
  const cl = [];
  code.split("-").forEach((part, i) => { const piece = (i ? "-" : "") + part, last = cl.length - 1;
    if (last >= 0 && doc.getTextWidth(cl[last] + piece) <= CW - IW - 8) cl[last] += piece; else cl.push(piece); });
  doc.text(cl, M, y + 4);
  let ty = y + 4 + cl.length * 7.5;
  small(`${typeText()}  |  ${pipeText()} pipe`, M, ty, { size:9.5 });
  ty = para("Turbine flow meter with patented electronic impedance sensing and low-mass jewel-bearing turbines. Individually wet-calibrated against NIST-traceable standards, programmable over USB with built-in diagnostics.", M, ty + 6, CW - IW - 8, { size:8.6, color:GREY });
  small(codeIsFinal() ? "Model number built from the catalog's codification; confirmed by ONICON in the quotation." : "\"?\" in the model number marks a choice to be confirmed.", M, ty + 1, { size:7.2 });
  y = Math.max(ty + 6, y + IH - 2);

  const R = Object.fromEntries(summaryRows(true).map(r => [r.k, r.v]));
  let yl = section("Application", X1, y, COL), yr = section("Flow meter", X2, y, COL);
  yl = item("Application", R["Application"], X1, yl, COL);
  yl = item("Fluid temperature", R["Fluid temperature"], X1, yl, COL);
  yl = item("Location", R["Location"], X1, yl, COL);
  yl = item("Pipe", R["Pipe"], X1, yl, COL);
  yr = item("Meter type", R["Meter type"], X2, yr, COL);
  yr = item("Pipe size range", R["Pipe size range"], X2, yr, COL);
  yr = item("Outputs", R["Outputs"], X2, yr, COL);
  yr = item("Quantity", `${S.qty} pcs`, X2, yr, COL);
  y = Math.max(yl, yr) + 3;

  need(46);
  y = section("Construction, calibration and extras", M, y, CW);
  yl = item("Wetted materials", R["Wetted materials"], X1, y, COL);
  yl = item("Enclosure  |  wiring", `${R["Enclosure"]}  |  ${R["Wiring"]}`, X1, yl, COL);
  yl = item("Process adapter", R["Process adapter"], X1, yl, COL);
  yr = item("Calibration data", R["Calibration data"], X2, y, COL);
  yr = item("Extras", R["Extras"], X2, yr, COL);
  y = Math.max(yl, yr) + 3;

  const n = getNotes();
  need(30);
  if (!n.warn.length && !S.notes.trim()){ y = section("Good to know", M, y, CW); n.info.forEach(t => { y = bullet(t, M, y + .6, CW, BLUE) + .2; }); y += 3; }
  else {
    yl = section(n.warn.length ? "Points we will check with you" : "Your notes", X1, y, COL); yr = section("Good to know", X2, y, COL);
    if (n.warn.length) n.warn.forEach(t => { yl = bullet(t, X1, yl + .6, COL, AMBER) + .6; }); else yl = para(S.notes.trim(), X1, yl, COL, { size:8.8 });
    n.info.forEach(t => { yr = bullet(t, X2, yr + .6, COL, BLUE) + .6; });
    y = Math.max(yl, yr) + 3;
    if (n.warn.length && S.notes.trim()){ need(22); y = section("Your notes", M, y, CW); y = para(S.notes.trim(), M, y, CW, { size:8.8 }) + 3; }
  }

  const half = Math.ceil(SPECS.length / 2);
  need(10 + half * 10);
  y = section("Technical data (from the ONICON F-1000 Series catalog sheet)", M, y + 1, CW);
  yl = y; yr = y;
  SPECS.forEach(([k, v], i) => { if (i < half) yl = compact(k, v, X1, yl, COL); else yr = compact(k, v, X2, yr, COL); });

  const pages = doc.getNumberOfPages();
  doc.setPage(pages);
  small("Not a binding offer. Model number, price, availability and calibration are confirmed in a written quotation from ONICON. Specifications per DOC-0003616 Rev. C.", M, 280.5, { size:6.8 });
  for (let p = 1; p <= pages; p++){
    doc.setPage(p); hair(M, 284, W - M);
    small("ONICON Incorporated  |  11451 Belcher Road South, Largo, FL 33773 USA  |  +1 727 447 6140  |  sales@onicon.com", M, 289, { size:6.8 });
    small(`${p} / ${pages}`, W - M, 289, { size:7, align:"right" });
  }
  return doc;
}
const pdfName = () => `ONICON_F-1000_${partNumber().replace(/\?/g,"x")}_${S.ref}.pdf`;
async function downloadPdf(){
  if (!isComplete()){ toast("Please complete all steps first."); return; }
  const btns = $$("#btnPdf,#doneDownload"); btns.forEach(b => b.disabled = true);
  try {
    const logo = await loadImg(LOGO_URL, 490, 172).catch(() => null);
    const [pw, ph] = IMG_SIZE[sumImgKey()];
    const photo = await loadImg(IMG[sumImgKey()], pw, ph).catch(() => null);
    buildPdf(logo, photo).save(pdfName());
    toast("PDF downloaded");
  } catch (err){ console.error(err); toast("Could not create the PDF. Opening the print dialog instead."); setTimeout(() => window.print(), 600); }
  finally { btns.forEach(b => b.disabled = false); }
}

/* =====================================================================
   QUOTATION
   ===================================================================== */
function configLines(){
  const out = [`Model number: ${partNumber()}`];
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
    `Quotation request | F-1000 Series turbine flow meter | Ref. ${S.ref}`, "",
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
  $("#faqCta").href = `mailto:${DEMO_CONTACT.email}?subject=${encodeURIComponent("Configurator enquiry (from the ONICON demo)")}`;
  $("#faqContact").innerHTML = `Or write to <a href="mailto:${DEMO_CONTACT.email}">${DEMO_CONTACT.email}</a> · <a href="${DEMO_CONTACT.site}" target="_blank" rel="noopener">swiftyquote.com</a>`;
})();

window.__cfg = { get S(){ return S; }, set S(v){ S = v; }, newState, go, partNumber, getNotes, buildPdf, buildMailto, quoteText, isComplete, renderStep, constrain,
  typeOffWhy, rangeOffWhy, eOffWhy, gOffWhy, hOffWhy, need316, loadImg, IMG, IMG_SIZE, LOGO_URL, sumImgKey };
renderStep(false);
