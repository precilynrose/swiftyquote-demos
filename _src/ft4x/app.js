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
    a:"<p>The product data and photos belong to Fox Thermal and are used here for demonstration only. This page is not an official Fox Thermal tool and you cannot place orders on it. Please contact Fox Thermal directly for real enquiries about the FT4X.</p>" },
  { q:"Can you build this for my own products?",
    a:"<p>Yes. The configurator is built around your product range, your options and your rules, and it takes on your branding: your logo, colours and fonts. It works for anything a buyer has to specify before they can get a quote, such as size, range, materials, approvals, outputs or accessories.</p>" },
  { q:"What do you need from me to get started?",
    a:"<ul><li>A link to the product page, or the datasheets and catalogue.</li><li>Your logo and brand guidelines (or we take them from your website).</li><li>The options a buyer can choose, and any rules, such as which combinations are possible or which approvals apply.</li><li>The email address (or system) where quotation requests should go.</li></ul>" },
  { q:"How much does it cost?",
    a:"<p>The price depends on how many products and options are covered, whether you need extra languages, and whether it should connect to your other systems. We give you a fixed quote after a short conversation, so there are no surprises.</p><p>Write to <a href=\"mailto:sales@swiftyquote.com?subject=Configurator%20price%20enquiry\">sales@swiftyquote.com</a> with a link to your product and we will come back with a price.</p>" },
  { q:"How long does implementation take?",
    a:"<p>The timeline depends on the size of your range and the features you choose. A single-product configurator like this one is quicker than a full catalogue with several product families. You receive a clear timeline together with your quote, and you see a first working version early so you can give feedback before we finish.</p>" },
  { q:"Can it use our branding and languages?",
    a:"<p>Yes. This demo already follows the Fox Thermal colours and fonts. Your version follows yours. Additional languages can be added.</p>" },
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

const IMG = { INS:"__IMG_INS__", INL:"__IMG_INL__" };
const LOGO_URL = "";

/* =====================================================================
   PRODUCT DATA
   Source: foxthermal.com FT4X product page, FT4X datasheet Rev. J (8 pages; specifications p5, configurations p6)
   and FT4X Model Codes Rev G (p1 insertion meter, p2 inline meter).
   Model code: FT4X-[Feature 1: probe or flow body]-[Feature 1b: S2, insertion only, optional]-[Feature 2: enclosure/power]-[Feature 3: communications]
   ===================================================================== */
const GASES = [
  { id:"ng",    title:"Natural gas",            desc:"Fuel or pipeline gas." },
  { id:"air",   title:"Air",                    desc:"Compressed, combustion or aeration air.", best:true },
  { id:"n2",    title:"Nitrogen",               desc:"Blanketing, purging, inerting.", best:true },
  { id:"bio",   title:"Biogas / digester gas",  desc:"Methane and CO₂ mix, often wet.", mix:true },
  { id:"flare", title:"Flare or vent gas",      desc:"Hydrocarbon mix that changes over time.", mix:true },
  { id:"ch4",   title:"Methane" },
  { id:"c3h8",  title:"Propane" },
  { id:"co2",   title:"Carbon dioxide (CO₂)" },
  { id:"h2",    title:"Hydrogen" },
  { id:"o2",    title:"Oxygen" },
  { id:"other", title:"Another gas or mix",     desc:"Gas-SelectX® covers 39 pure gases plus custom mixes." }
];
const APPS = [
  { id:"flare",  title:"Flare and vent monitoring", desc:"Emissions reporting, leak checks." },
  { id:"fuel",   title:"Burner or boiler fuel",     desc:"Combustion control and energy use." },
  { id:"air",    title:"Compressed air",            desc:"Consumption, leak detection, sub-metering." },
  { id:"aer",    title:"Wastewater aeration",       desc:"Blower air to the basins." },
  { id:"dig",    title:"Biogas production",         desc:"Digester and landfill gas." },
  { id:"alloc",  title:"Gas allocation",            desc:"Sub-metering between users or wells." },
  { id:"other",  title:"Something else",            desc:"We will look at it together with you." }
];
const GAS_T = [
  { id:"tcold", title:"−40 to −29 °C",  desc:"−40 to −20 °F. Cold climates and chilled gas." },
  { id:"tnorm", title:"−29 to 121 °C",  desc:"−20 to 250 °F. Most applications.", badge:"Most common" },
  { id:"thot",  title:"Hotter than 121 °C", desc:"Above 250 °F." },
  { id:"tunk",  title:"Not sure",       desc:"We will check it with you." }
];
/* [id, label, bar, max psig] */
const PRESS = [
  ["p60",  "Up to 60 psig",     "Up to 4.1 barg", 60],
  ["p150", "60 to 150 psig",    "4.1 to 10.3 barg", 150],
  ["p230", "150 to 230 psig",   "10.3 to 16 barg", 230],
  ["p285", "230 to 285 psig",   "16 to 20 barg", 285],
  ["p500", "285 to 500 psig",   "20 to 34.5 barg", 500],
  ["p600", "500 to 600 psig",   "34.5 to 41 barg", 600],
  ["p740", "600 to 740 psig",   "41 to 51 barg", 740],
  ["phigh","Above 740 psig",    "Above 51 barg", Infinity],
  ["punk", "Not sure",          "We will check it with you.", null]
].map(([id,title,desc,max]) => ({ id, title, desc, max }));
const AREAS = [
  { id:"safe", title:"Ordinary (non-hazardous) area", desc:"No flammable gas or dust." },
  { id:"div2", title:"Class I Div 2 / Zone 2",  desc:"Flammable gas only in abnormal conditions." },
  { id:"div1", title:"Class I Div 1 / Zone 1",  desc:"Flammable gas can be present in normal operation." },
  { id:"dust", title:"Combustible dust (Class II / Zone 21)", desc:"Dust layers or clouds around the meter." },
  { id:"z0",   title:"Zone 0",                  desc:"Flammable gas present continuously." }
];
const STYLES = [
  { id:"ins", title:"Insertion probe", desc:"A probe through a branch fitting on your pipe. For pipes of 1.5″ (40 mm) and larger, also ducts and stacks.", badge:"Most flexible" },
  { id:"inl", title:"Inline flow body", desc:"A complete pipe section with built-in flow conditioner, ½″ to 6″. Shorter straight runs (8D/4D)." }
];
const UNITS = [
  { id:"scfm",  title:"SCFM",   f:1 },
  { id:"mscfd", title:"MSCFD",  f:1/1.44 },
  { id:"nm3h",  title:"Nm³/h",  f:1/1.5775 }
];
const MOUNTS = [
  { id:"fixed", title:"Compression fitting", desc:"Probe held by a 1″ MNPT compression fitting (¾″ MNPT with the ½″ probe), included. Simplest and up to 740 psig.", badge:"Standard" },
  { id:"retr",  title:"150-psi retractor with valve", desc:"Remove the probe without shutting down the line. Includes a full-port valve. 150 psig max." },
  { id:"crank", title:"High-pressure crank retractor", desc:"Flanged crank retractor for higher pressures. No valve included; for pipes from 2″." }
];
/* insertion probes (model codes p1). mt: fixed / retr / crank; len in inches */
const PROBES = [
  ...[6,9,12,15,18,24,30,36].map(l => ({ id:`${String(l).padStart(2,"0")}I`, mt:"fixed", len:l, title:`${l}″ probe`, desc:`${(l*2.54).toFixed(1)} cm insertion probe.` })),
  ...[15,18,24,30,36].map(l => ({ id:`${l}R`, mt:"retr", len:l, title:`${l}″ probe with 150-psi retractor`, desc:"Full-port valve, 1″ MNPT (¾″ MNPT with the ½″ probe), 316 SS wetted parts." })),
  { id:"24C1A1", mt:"crank", len:24, lim:19.5, title:"24″ probe, 1½″ 150# flange", desc:"High-pressure crank retractor, 316 SS wetted parts, no valve." },
  { id:"24C1A2", mt:"crank", len:24, lim:19.5, title:"24″ probe, 1½″ 300# flange", desc:"High-pressure crank retractor, 316 SS wetted parts, no valve." },
  { id:"36C2A1", mt:"crank", len:36, lim:31.5, title:"36″ probe, 2″ 150# flange",  desc:"High-pressure crank retractor, 316 SS wetted parts, no valve." },
  { id:"36C2A2", mt:"crank", len:36, lim:31.5, title:"36″ probe, 2″ 300# flange",  desc:"High-pressure crank retractor, 316 SS wetted parts, no valve." }
];
const DIAS = [
  { id:"std", title:"¾″ probe",  desc:"With 1″ MNPT compression fitting.", badge:"Standard" },
  { id:"s2",  title:"½″ probe (S2)", desc:"With ¾″ MNPT compression fitting. For smaller branch outlets." }
];
/* inline flow bodies, schedule 40 (model codes p2). ends: P = male NPT, F = 150# RF flanges, G = 300# RF flanges; cs = carbon steel version (code + "C") */
const SIZES = [
  { id:"05",  label:"½″",   inch:0.5,  idIn:0.622, ftf:12, ends:["P","F"],     cs:false },
  { id:"075", label:"¾″",   inch:0.75, idIn:0.824, ftf:12, ends:["P","F"],     cs:false },
  { id:"10",  label:"1″",   inch:1,    idIn:1.049, ftf:12, ends:["P","F"],     cs:false },
  { id:"125", label:"1¼″",  inch:1.25, idIn:1.380, ftf:12, ends:["P","F"],     cs:false },
  { id:"15",  label:"1½″",  inch:1.5,  idIn:1.610, ftf:12, ends:["P","F","G"], cs:false },
  { id:"20",  label:"2″",   inch:2,    idIn:2.067, ftf:12, ends:["P","F","G"], cs:true },
  { id:"25",  label:"2½″",  inch:2.5,  idIn:2.469, ftf:18, ends:["P","F","G"], cs:true },
  { id:"30",  label:"3″",   inch:3,    idIn:3.068, ftf:18, ends:["P","F","G"], cs:true },
  { id:"40",  label:"4″",   inch:4,    idIn:4.026, ftf:18, ends:["F","G"],     cs:true, consult:true },
  { id:"60",  label:"6″",   inch:6,    idIn:6.065, ftf:24, ends:["F","G"],     cs:true, consult:true }
];
const ENDS = [
  { id:"P", title:"Male NPT ends",          short:"male NPT" },
  { id:"F", title:"150# raised-face flanges", short:"150# RF flanges" },
  { id:"G", title:"300# raised-face flanges", short:"300# RF flanges" }
];
/* maximum gas pressure at 100 °F, psig (datasheet p5) */
const RATING = { ss:{ P:500, F:230, G:600 }, cs:{ P:500, F:285, G:740 } };
const MATS = [
  { id:"ss", title:"316 stainless steel", desc:"Standard flow body." },
  { id:"cs", title:"Carbon steel", desc:"A106 Grade B pipe with A105 flanges." }
];
const LOCS = [
  { id:"local",  title:"On the meter",  desc:"Display and electronics sit on the probe or flow body.", badge:"Standard" },
  { id:"remote", title:"Remote, up to 100 ft away", desc:"Electronics where they are easy to reach; an explosion-proof junction box stays at the sensor. Remote mounting kit included." }
];
const POWERS = [
  { id:"dc", title:"24 VDC", desc:"12 to 24 VDC (10 to 30 VDC), 6 W. A 20 W or larger supply is recommended." },
  { id:"ac", title:"100 to 240 VAC", desc:"50/60 Hz (85 to 264 VAC), 7 W." }
];
const COMMS = [
  { id:"B0", title:"No digital communication", desc:"Two 4-20 mA outputs, pulse/alarm output, contact input and USB are always included." },
  { id:"RS", title:"Modbus RTU (RS485)", desc:"For SCADA links and the ModbusView™ remote software." },
  { id:"BH", title:"HART", desc:"HART on the primary 4-20 mA output." }
];
const CABLES = [
  { id:"fox",  title:"Yes, include the cable", desc:"8-conductor, 18 AWG PVC shielded cable (part 106958), 100 ft max." },
  { id:"none", title:"No, we supply our own",  desc:"8-conductor, 18 AWG, twisted pair, shielded; 100 ft max." }
];
/* accessories: separate part numbers (model codes p1-p2) */
const OPTS = [
  { id:"106415", title:"Teflon ferrule kit for ¾″ probe", desc:"Lets the probe slide for positioning. 60 psig max." },
  { id:"102878", title:"Teflon ferrule kit for ½″ probe", desc:"Lets the probe slide for positioning. 60 psig max." },
  { id:"101331", title:"¾″ MNPT compression fitting for the ¾″ probe", desc:"Instead of fitting a 1″ branch outlet." },
  { id:"990099", title:"Canadian Registration Number (CRN) on flow body", desc:"Engraved on stainless steel inline flow bodies." },
  { id:"890000", title:"Cleaned and bagged for oxygen service" },
  { id:"106728", title:"AC to 24 VDC power converter", desc:"With DIN mounting rail." },
  { id:"106658", title:"M20×1.5 wiring connection adapters", desc:"Quantity 2 per meter." },
  { id:"109040", title:"Sun shade" },
  { id:"999004", title:"ModbusView™ software licence", desc:"Remote connectivity software." },
  { id:"114144", title:"USB remote connectivity kit", desc:"ModbusView RS485-to-USB converter." },
  { id:"114143", title:"RJ45 remote connectivity kit", desc:"ModbusView RS485-to-RJ45 converter." },
  { id:"107698", title:"USB cable, 6 ft", desc:"A-male to micro USB-B male, for FT4X View™." },
  { id:"100657", title:"Stainless steel tags" },
  { id:"106796", title:"Extra FT4X instruction manual" },
  { id:"999992", title:"Certificate of Conformance" },
  { id:"999995", title:"Certificate of Origin" },
  { id:"999986", title:"Material certificates for wetted parts" }
];

const SPECS = [
  ["Principle",        "Constant temperature differential thermal mass flow, DDC-Sensor with two RTDs; no P/T compensation needed"],
  ["Accuracy",         "Air and nitrogen +/-1% of reading +/-0.2% of full scale; other gases +/-1.5% of reading +/-0.5% of full scale; repeatability +/-0.2% FS"],
  ["Range",            "15 to 60,000 SFPM (0.07 to 280 NMPS); turndown up to 1000:1, 100:1 typical; response 0.8 s"],
  ["Outputs",          "Two isolated 4-20 mA (NAMUR NE43), pulse/alarm 0-100 Hz, remote switch input, USB; optional Modbus RTU or HART"],
  ["Temperatures",     "Sensor -40 to 121 C (-40 to 250 F); enclosure -40 to 70 C; gas temperature accuracy +/-0.6 C"],
  ["Pressure",         "Insertion 740 psig; retractor 150 psig; inline 230 to 740 psig depending on ends and material (at 100 F)"],
  ["Enclosure",        "NEMA 4X (IP67) aluminium, dual 3/4 in FNPT conduit entries; 316 SS sensor; remote cable up to 100 ft"],
  ["Approvals",        "FM/FMc Class I Div 1 Groups B, C, D; ATEX, IECEx, UKEX Ex db IIB + H2 T6/T4 Gb, Ex tb IIIC; CE"]
];

/* =====================================================================
   STATE
   ===================================================================== */
const STEPS = [
  { id:"app",    label:"Application" },
  { id:"pipe",   label:"Pipe & flow" },
  { id:"body",   label:"Probe or body" },
  { id:"elec",   label:"Electronics" },
  { id:"extras", label:"Extras" },
  { id:"review", label:"Review" }
];
const $ = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => [...el.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const byId = (arr,id) => arr.find(x => x.id === id);

function newState(){
  return { step:0, maxStep:0, gas:null, gasOther:"", app:null, gasT:null, press:null, area:null,
           style:null, flow:"", unit:"scfm", pipeId:"", ins:"", size:null,
           mount:null, valve:"", dia:"std", probe:null, ends:null, mat:null,
           loc:null, power:null, comm:null, cable:null, cableLen:"",
           opts:[], qty:1, notes:"", ref:makeRef(), helpOpen:{} };
}
function makeRef(){
  const d = new Date(), p = n => String(n).padStart(2,"0");
  const rnd = Math.random().toString(36).slice(2,6).toUpperCase();
  return `FT-${String(d.getFullYear()).slice(2)}${p(d.getMonth()+1)}${p(d.getDate())}-${rnd}`;
}
let S = newState();

/* ---------- numbers ---------- */
const num = v => { const t = String(v).trim().replace(",", "."); return /^\d+(\.\d+)?$/.test(t) ? +t : NaN; };
const fmt = (n, d=1) => (Math.round(n * 10**d) / 10**d).toLocaleString("en-US");
const flowVal = () => num(S.flow);
const flowValid = () => flowVal() > 0;
const flowScfm = () => flowValid() ? flowVal() * byId(UNITS, S.unit).f : null;
const pipeVal = () => num(S.pipeId);
const pipeValid = () => pipeVal() >= 1.5 && pipeVal() <= 200;
const insVal = () => String(S.ins).trim() === "" ? 0 : num(S.ins);
const insValid = () => insVal() >= 0 && insVal() <= 24;
const valveVal = () => num(S.valve);
const valveValid = () => valveVal() > 0 && valveVal() <= 40;
const cableValid = () => { const v = num(S.cableLen); return Number.isInteger(v) && v >= 1 && v <= 100; };
/* full scale at 60,000 SFPM for a pipe inside diameter in inches (matches the datasheet flow range tables) */
const maxScfm = idIn => 60000 * Math.PI / 4 * (idIn / 12) ** 2;
const minFsScfm = idIn => 500 * Math.PI / 4 * (idIn / 12) ** 2;

/* ---------- rules ---------- */
const isIns = () => S.style === "ins";
const isInl = () => S.style === "inl";
const pMax = () => { const p = byId(PRESS, S.press || ""); return p ? p.max : null; };
const sizeObj = () => byId(SIZES, S.size || "");
const probeObj = () => byId(PROBES, S.probe || "");
const flowIdIn = () => isIns() ? (pipeValid() ? pipeVal() : null) : (sizeObj() ? sizeObj().idIn : null);
function needLen(mt){
  if (!pipeValid() || !insValid()) return null;
  return pipeVal() / 2 + 3 + insVal() + (mt === "retr" ? 10 : 0);
}
function probeFits(p){
  if (!pipeValid()) return true;
  if (p.mt === "crank"){ if (pipeVal() < 2) return false; return valveValid() ? pipeVal() / 2 + valveVal() <= p.lim : true; }
  const n = needLen(p.mt); return n == null || p.len >= n;
}
const anyFits = mt => PROBES.some(p => p.mt === mt && probeFits(p));
function mountOffWhy(m){
  if (m.id === "retr" && pMax() > 150) return "The 150-psi retractor is rated 150 psig (10.3 barg). Your pressure is higher.";
  if (m.id === "crank" && pipeValid() && pipeVal() < 2) return "Crank retractors need a pipe of 2″ (50 mm) or larger.";
  return null;
}
function probeOffWhy(p){
  if (p.mt === "crank" && pipeValid() && pipeVal() < 2) return "Crank retractors need a pipe of 2″ (50 mm) or larger.";
  if (!probeFits(p) && anyFits(p.mt)){
    if (p.mt === "crank") return `Half your pipe ID plus the valve (${fmt(pipeVal()/2 + valveVal())}″) is more than the ${p.lim}″ this probe allows.`;
    return `Too short: your pipe needs at least ${fmt(needLen(p.mt))}″.`;
  }
  return null;
}
function recommendedProbe(){
  const list = PROBES.filter(p => p.mt === S.mount && !probeOffWhy(p) && probeFits(p));
  return list.length ? list[0].id : null;
}
function sizeOffWhy(z){
  const f = flowScfm();
  if (f && f > maxScfm(z.idIn)) return `Your maximum flow is above this size's range (about ${fmt(maxScfm(z.idIn),0)} SCFM).`;
  return null;
}
function endsOffWhy(e){
  const z = sizeObj(); if (!z) return null;
  if (!z.ends.includes(e.id)) return `Not offered on the ${z.label} flow body.`;
  const best = Math.max(RATING.ss[e.id], z.cs ? RATING.cs[e.id] : 0);
  if (pMax() > best) return `Rated ${best} psig at 100 °F. Your pressure is higher.`;
  return null;
}
function matOffWhy(m){
  const z = sizeObj();
  if (m.id === "cs"){
    if (z && !z.cs) return "Carbon steel flow bodies start at 2″.";
    if (S.gasT === "tcold") return "Carbon steel flow bodies are not rated below −29 °C (EU Pressure Equipment Directive note in the datasheet).";
  }
  if (S.ends && pMax() > RATING[m.id][S.ends]) return `Rated ${RATING[m.id][S.ends]} psig with ${byId(ENDS,S.ends).short}. Your pressure is higher.`;
  return null;
}
/* accessory rules - null = allowed */
function optOffWhy(id){
  const pm = pMax();
  switch(id){
    case "106415": case "102878":
      if (!isIns()) return "Insertion meters only.";
      if (id === "106415" && S.dia === "s2") return "For the ¾″ probe. Use 102878 for the ½″ probe.";
      if (id === "102878" && S.dia !== "s2") return "For the ½″ probe. Use 106415 for the ¾″ probe.";
      if (pm > 60) return "Teflon ferrules limit the gas pressure to 60 psig (4.1 barg). Your pressure is higher.";
      return null;
    case "101331":
      if (!isIns()) return "Insertion meters only.";
      if (S.dia === "s2") return "For the ¾″ probe diameter.";
      if (S.mount !== "fixed") return "For probes held by a compression fitting (06I to 36I).";
      return null;
    case "990099":
      if (!isInl()) return "Inline flow bodies only.";
      return S.mat === "cs" ? "Not available on carbon steel flow bodies." : null;
    case "106728": return S.power === "ac" ? "Your meter is already AC powered." : null;
    case "999004": case "114144": case "114143":
      return S.comm !== "RS" ? "Needs Modbus RTU (RS485) as the communication option." : null;
    default: return null;
  }
}
function constrain(){
  if (!isIns()){ S.mount = null; S.probe = null; S.valve = ""; S.dia = "std"; S.pipeId = ""; S.ins = ""; }
  if (!isInl()){ S.size = null; S.ends = null; S.mat = null; }
  const m = byId(MOUNTS, S.mount || ""); if (m && mountOffWhy(m)) { S.mount = null; S.probe = null; }
  if (S.mount !== "crank") S.valve = "";
  const p = probeObj(); if (p && (p.mt !== S.mount || probeOffWhy(p))) S.probe = null;
  const z = sizeObj(); if (z && sizeOffWhy(z)) S.size = null;
  const e = byId(ENDS, S.ends || ""); if (e && (!sizeObj() || endsOffWhy(e))) S.ends = null;
  const mt = byId(MATS, S.mat || ""); if (mt && (!S.ends || matOffWhy(mt))) S.mat = null;
  if (S.loc !== "remote"){ S.cable = null; S.cableLen = ""; }
  if (S.cable !== "fox") S.cableLen = "";
  if (S.gas !== "other") S.gasOther = "";
  for (let i = S.opts.length - 1; i >= 0; i--){ if (optOffWhy(S.opts[i])) S.opts.splice(i,1); }
}

/* ---------- derived values ---------- */
function feature1(){
  if (isIns()) return S.probe || null;
  if (!isInl() || !S.size || !S.ends || !S.mat) return null;
  return S.size + S.ends + (S.size === "05" ? "S2" : "") + (S.mat === "cs" ? "C" : "");
}
function encCode(){
  if (!S.loc || !S.power) return null;
  return S.loc === "local" ? (S.power === "dc" ? "E1" : "E2") : (S.power === "dc" ? "E3" : "E4");
}
function partNumber(){
  const parts = ["FT4X", feature1() || "???"];
  if (isIns() && S.dia === "s2") parts.push("S2");
  parts.push(encCode() || "??", S.comm || "??");
  return parts.join("-");
}
const codeIsFinal = () => !partNumber().includes("?");
function accessories(){
  const a = [];
  if (S.cable === "fox") a.push({ pn:"106958", t:`8-conductor shielded cable for the remote electronics, ${cableValid() ? S.cableLen + " ft" : "length to be stated"}` });
  S.opts.forEach(o => a.push({ pn:o, t:byId(OPTS,o).title + (o === "106658" ? " (2 per meter)" : "") }));
  return a;
}
function gasText(){
  const g = byId(GASES, S.gas || ""); if (!g) return null;
  return S.gas === "other" ? (S.gasOther.trim() ? `${S.gasOther.trim()} (other gas or mix)` : "Other gas or mix (to be specified)") : g.title;
}
function flowText(){ return flowValid() ? `${fmt(flowVal(), 2)} ${byId(UNITS,S.unit).title}` : null; }
function pipeText(){
  if (isIns()) return pipeValid() ? `${fmt(pipeVal(), 2)}″ inside diameter${insVal() > 0 ? `, ${fmt(insVal(), 2)}″ insulation` : ""}` : null;
  const z = sizeObj(); return z ? `${z.label} schedule 40 line` : null;
}
function bodyText(){
  if (isIns()){
    const p = probeObj(); if (!p) return null;
    return `${p.id}: ${p.title}${p.mt === "fixed" ? " with compression fitting" : ""}`;
  }
  const z = sizeObj(), e = byId(ENDS, S.ends || ""), m = byId(MATS, S.mat || "");
  if (!z || !e || !m) return null;
  return `${feature1()}: ${z.label} ${m.id === "ss" ? "316 SS" : "carbon steel"} flow body, ${e.short}, ${z.ftf}″ face-to-face`;
}
function encText(){
  const l = byId(LOCS, S.loc || ""), p = byId(POWERS, S.power || ""); if (!l || !p) return null;
  return `${encCode()}: ${S.loc === "local" ? "local" : "remote"} explosion-proof enclosure, ${p.title}`;
}
function cableText(){
  if (S.loc !== "remote") return S.loc ? "Not needed (local electronics)" : null;
  if (S.cable === "fox") return `Fox cable 106958, ${cableValid() ? S.cableLen + " ft" : "length to be stated"}`;
  if (S.cable === "none") return "Supplied by you (max. 100 ft)";
  return null;
}
function accText(){ const a = accessories().filter(x => x.pn !== "106958"); return a.length ? a.map(x => `${x.pn} ${x.t}`).join("; ") : "None"; }

function validStep(id){
  switch(id){
    case "app":   return !!(S.gas && S.app && S.gasT && S.press && S.area);
    case "pipe":  return !!(S.style && flowValid() && (isIns() ? pipeValid() && insValid() : S.size));
    case "body":  return isIns() ? !!(S.mount && S.dia && S.probe && (S.mount !== "crank" || valveValid())) : !!(S.ends && S.mat);
    case "elec":  return !!(S.loc && S.power && S.comm && (S.loc !== "remote" || (S.cable && (S.cable === "none" || cableValid()))));
    case "extras":return true;
    default:      return true;
  }
}
const isComplete = () => STEPS.slice(0,-1).every(s => validStep(s.id));

function getNotes(){
  const warn = [], info = [];
  const g = byId(GASES, S.gas || ""), f = flowScfm(), idIn = flowIdIn(), p = probeObj(), z = sizeObj();
  if (S.gasT === "thot") warn.push("Your gas is hotter than 121 °C (250 °F), the DDC-Sensor™ limit. Please talk to us before ordering.");
  if (S.gasT === "tunk") warn.push("Gas temperature to be confirmed (sensor rating −40 to 121 °C).");
  if (S.press === "phigh") warn.push("Your pressure is above 740 psig, the highest rating in the datasheet. Higher-pressure options must be checked with the manufacturer.");
  if (S.press === "punk") warn.push("Maximum gas pressure to be confirmed: it decides the retractor, end connections and flow body material.");
  if (S.area === "z0") warn.push("Zone 0 is not covered by the approvals listed in the datasheet (Class I Div 1 / Zone 1). To be checked before ordering.");
  if (S.app === "other") warn.push("Application to be clarified with you before quotation.");
  if (S.gas === "other") warn.push(`Gas composition to be stated with the order${S.gasOther.trim() ? ` (${S.gasOther.trim()})` : ""}: the meter is calibrated for it.`);
  if (g && g.mix) warn.push("Please send the gas composition (or a range) with your request: Gas-SelectX® mixes are set up from it.");
  if (S.gas === "bio" || S.app === "dig") warn.push("Biogas is often wet. Condensing liquids on the sensor can cause erratic readings, so plan for moisture removal or a high mounting point.");
  if (S.gas === "o2" && !S.opts.includes("890000")) warn.push("Oxygen: cleaning for oxygen service (890000) is normally required. Add it in the extras step.");
  if (f && idIn && f > maxScfm(idIn)) warn.push(`Your maximum flow (${fmt(f,0)} SCFM) is above the range for this pipe (about ${fmt(maxScfm(idIn),0)} SCFM at 60,000 SFPM).`);
  if (f && idIn && f < minFsScfm(idIn)) warn.push(`Your maximum flow (${fmt(f,1)} SCFM) is below the smallest calibrated range for this pipe (full scale about ${fmt(minFsScfm(idIn),1)} SCFM, 500 SFPM). We will check the sizing with you${isInl() ? "; a smaller line size may suit better" : ""}.`);
  if (isIns() && S.mount && !anyFits(S.mount) && S.mount !== "crank") warn.push(`Your pipe needs a probe of at least ${fmt(needLen(S.mount))}″, longer than the longest standard probe. Longer probes must be checked with the manufacturer.`);
  if (isIns() && S.mount === "crank" && valveValid() && !anyFits("crank")) warn.push("Half the pipe ID plus the valve length is more than 31.5″: no standard crank retractor probe fits. To be checked with the manufacturer.");
  if (p && p.mt === "crank"){
    warn.push("Crank retractor: the pressure rating and the use of the ½″ probe are not given in the datasheet. To be confirmed with the manufacturer.");
    info.push("The model-code footnote names crank retractor codes R2/R3 and R8/R9; we read them as the 24″ and 36″ probes. The isolation valve is not included.");
  }
  if (isInl() && z && z.consult && f > 2500) warn.push("4″ and 6″ flow bodies above 2,500 SCFM: application review by the manufacturer (may need third-party calibration).");
  if (S.cable === "fox" && !cableValid()) warn.push("Remote cable length to be stated (1 to 100 ft).");
  if (S.opts.some(o => o === "106415" || o === "102878")) info.push("With a Teflon ferrule kit the gas pressure is limited to 60 psig (4.1 barg).");
  if (isIns()) info.push("Straight pipe: about 15 diameters upstream and 10 downstream. FC20 flow conditioners for insertion meters are quoted separately.");
  if (isInl()) info.push("Inline flow bodies have a built-in flow conditioner: about 8 diameters upstream and 4 downstream.");
  if (p && p.mt === "retr") info.push("Probe length includes 10″ for the retractor.");
  if (S.comm === "RS") info.push("Modbus RTU gives access to the data logger (40 daily totals, alarm and event logs) and ModbusView™.");
  if (encCode()) info.push(S.loc === "local" ? `Temperature code with ${encCode()}: T4.` : `Temperature code with ${encCode()}: T6 at the electronics enclosure, T4 at the sensor junction box.`);
  if (g) info.push(g.best ? "Accuracy on air and nitrogen: ±1% of reading ±0.2% of full scale." : "Accuracy on this gas: ±1.5% of reading ±0.5% of full scale.");
  info.push("Every FT4X includes Gas-SelectX®, CAL-V™ calibration validation, a data logger, a backlit display and a USB port.");
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
/* a typed question: one .group holding a text field (kept as text so the caret survives re-rendering) */
function fieldGroup(title, sub, id, label, val, unit, ph, extra){
  return `<div class="group"><div class="group__title">${esc(title)}</div>${sub?`<div class="group__sub">${esc(sub)}</div>`:""}
    <div class="inline-field"><label class="field"><span class="l">${esc(label)}</span><span class="unit-input"><input id="${id}" type="text" inputmode="decimal" autocomplete="off" value="${esc(val)}" placeholder="${esc(ph)}"><em>${esc(unit)}</em></span></label></div>${extra || ""}</div>`;
}

/* =====================================================================
   STEP VIEWS
   ===================================================================== */
const VIEWS = {
  app(){
    return `<div class="step">
      ${head(1,"What gas will the FT4X measure?","The FT4X measures gas mass flow directly, in standard units, without pressure or temperature compensation. Tell us about your gas and where the meter goes.")}
      ${group("Which gas?", "You can switch gas in the field later with Gas-SelectX®.", radios("gas", GASES))}
      ${S.gas === "other" ? `<div class="inline-field"><label class="field" style="flex:1"><span class="l">Gas or mix composition (optional)</span><input id="gasOther" type="text" value="${esc(S.gasOther)}" placeholder="e.g. 60% methane, 40% CO₂"></label></div>` : ""}
      ${group("What is it for?", null, radios("app", APPS))}
      ${group("Gas temperature at the meter", "The sensor is rated −40 to 121 °C (−40 to 250 °F).", radios("gasT", GAS_T))}
      ${group("Highest gas pressure in the line", "This decides the retractor, end connections and flow body material.", radios("press", PRESS))}
      ${group("Hazardous area classification", "Where the meter is installed. Every FT4X has an explosion-proof enclosure.", radios("area", AREAS))}
      ${helpHtml("app","Not sure about the area classification?",`<p>Your site's hazardous-area drawing shows the zone or division. If there is no drawing and no flammable gas or dust, choose <strong>ordinary area</strong>.</p><p>The FT4X is approved for Class I Div 1 Groups B, C, D and for Zone 1 gas group IIB + H<sub>2</sub> (FM, FMc, ATEX, IECEx, UKEX), so it also suits Div 2 / Zone 2 areas and combustible dust (Class II, Ex tb IIIC).</p>`)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  pipe(){
    const unitRadios = `<div class="opts" style="margin-top:12px">${radios("unit", UNITS)}</div>`;
    let inner = group("Insertion probe or inline flow body?", null, radios("style", STYLES), "opts--wide");
    if (S.style){
      inner += fieldGroup("What is your maximum flow rate?", "The meter is calibrated for your range; low flows down to 1% of it are measured too.", "flow", "Maximum flow", S.flow, byId(UNITS,S.unit).title, "e.g. 850", unitRadios);
    }
    if (isIns()){
      inner += fieldGroup("Inside diameter of your pipe", "Insertion meters fit pipes and ducts of 1.5″ (40 mm) and larger. For metric pipe: 25.4 mm = 1″.", "pipeId", "Pipe inside diameter", S.pipeId, "in", "e.g. 10");
      inner += fieldGroup("Insulation thickness", "Leave empty if the pipe is not insulated.", "ins", "Insulation (optional)", S.ins, "in", "0");
    }
    if (isInl()){
      inner += group("Line size", "Schedule 40 flow bodies. Sizes that cannot carry your maximum flow are greyed out.", SIZES.map(z => { const why = sizeOffWhy(z);
        return optHtml({ name:"size", value:z.id, checked:S.size===z.id, title:`${z.label} line`, desc:why || `Up to about ${fmt(maxScfm(z.idIn),0)} SCFM. ${z.ftf}″ face-to-face.`, off:!!why }); }).join(""));
    }
    return `<div class="step">
      ${head(2,"Your pipe and flow","We use your pipe size and maximum flow to size the meter and check its range.")}
      ${inner}
      ${helpHtml("pipe","Insertion or inline?",`<p><strong>Insertion</strong> meters slide a probe through a branch outlet welded to the pipe. They suit large pipes and ducts and can be removed under pressure with a retractor.</p><p><strong>Inline</strong> meters are a complete flow body with built-in flow conditioning, so they need less straight pipe. They suit smaller lines from ½″ to 6″.</p><p>The flow range is 15 to 60,000 standard feet per minute; we convert that into SCFM for your pipe.</p>`)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  body(){
    if (isInl()){
      const z = sizeObj();
      return `<div class="step">
        ${head(3,"Flow body",`Your ${z ? z.label : ""} flow body: choose the end connections and the material.`)}
        ${group("End connections", "Pressure ratings are at 100 °F.", ENDS.map(e => { const why = endsOffWhy(e);
          return optHtml({ name:"ends", value:e.id, checked:S.ends===e.id, title:e.title, desc:why || `316 SS ${RATING.ss[e.id]} psig${z && z.cs ? `, carbon steel ${RATING.cs[e.id]} psig` : ""}.`, off:!!why }); }).join(""))}
        ${group("Flow body material", null, MATS.map(m => { const why = matOffWhy(m);
          return optHtml({ name:"mat", value:m.id, checked:S.mat===m.id, title:m.title, desc:why || m.desc, badge:m.id === "ss" ? "Standard" : null, off:!!why }); }).join(""))}
        ${helpHtml("body","Which ends and material?",`<ul><li><strong>Male NPT</strong> ends screw into the line (up to 3″).</li><li><strong>150# or 300# flanges</strong> match ASME raised-face flanges; 300# takes higher pressure.</li><li><strong>Carbon steel</strong> bodies (2″ and up) suit natural gas and air lines where stainless is not needed. Sensor and probe stay 316 stainless steel.</li></ul>`)}
        <div class="feedback" id="feedback"></div>
      </div>`;
    }
    const rec = recommendedProbe(), need = needLen(S.mount);
    const list = PROBES.filter(p => p.mt === S.mount);
    return `<div class="step">
      ${head(3,"Probe and mounting","How the probe goes into your pipe, and how long it needs to be to reach the centre.")}
      ${group("How should the probe be mounted?", null, MOUNTS.map(m => { const why = mountOffWhy(m);
        return optHtml({ name:"mount", value:m.id, checked:S.mount===m.id, title:m.title, desc:why || m.desc, badge:m.badge, off:!!why }); }).join(""), "opts--wide")}
      ${S.mount === "crank" ? fieldGroup("Face-to-face length of your isolation valve", "The crank retractor has no valve: tell us the valve you will fit.", "valve", "Valve length", S.valve, "in", "e.g. 6") : ""}
      ${S.mount ? group("Probe diameter", null, radios("dia", DIAS)) : ""}
      ${S.mount ? group("Probe length", S.mount === "crank" ? "Half the pipe inside diameter plus the valve length must stay within the limit of each probe." : `Your pipe needs at least ${need != null ? fmt(need) + "″" : "?"}: ½ pipe ID + 3″ fitting${insVal() > 0 ? " + insulation" : ""}${S.mount === "retr" ? " + 10″ retractor" : ""}, rounded up.`,
        list.map(p => { const why = probeOffWhy(p);
          return optHtml({ name:"probe", value:p.id, checked:S.probe===p.id, title:p.title, desc:why || p.desc, meta:p.id, badge:p.id === rec ? "Recommended" : null, off:!!why }); }).join("")) : ""}
      ${helpHtml("body","Which mounting do I need?",`<ul><li><strong>Compression fitting:</strong> the probe is fixed in a branch outlet. To remove it the line must be depressurised.</li><li><strong>150-psi retractor:</strong> pull the probe out through a full-port valve while the line stays in service.</li><li><strong>Crank retractor:</strong> for higher pressures; a crank moves the probe in and out. You fit your own flanged valve.</li></ul><p>The probe tip should sit in the centre of the pipe: ½ the pipe inside diameter + 3″ for the fitting + insulation + 10″ for the retractor.</p>`)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  elec(){
    return `<div class="step">
      ${head(4,"Electronics and communication","Where the display goes, how the meter is powered and how it talks to your control system.")}
      ${group("Where should the electronics be?", null, radios("loc", LOCS), "opts--wide")}
      ${group("Power supply", null, radios("power", POWERS))}
      ${group("Digital communication", null, radios("comm", COMMS))}
      ${S.loc === "remote" ? group("Should we include the remote cable?", "The cable is sold separately from the meter.", radios("cable", CABLES)) : ""}
      ${S.cable === "fox" ? fieldGroup("Cable length", "Between the sensor junction box and the electronics. 100 ft maximum.", "cableLen", "Cable length (1 to 100 ft)", S.cableLen, "ft", "e.g. 50") : ""}
      ${helpHtml("elec","What do I need?",`<ul><li><strong>Remote electronics</strong> help when the measuring point is hot, high up or hard to reach.</li><li><strong>Modbus RTU</strong> connects to SCADA and gives remote access to the data logger and ModbusView™.</li><li><strong>HART</strong> runs on the primary 4-20 mA loop, for HART-based asset management.</li><li>Every FT4X has two isolated 4-20 mA outputs, a pulse/alarm output, a contact input to reset the totaliser, and a USB port.</li></ul>`)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  extras(){
    return `<div class="step">
      ${head(5,"Accessories and documents","All optional. Items that do not fit your meter are greyed out.")}
      ${group("Accessories and documents", null, OPTS.map(o => { const why = optOffWhy(o.id), on = S.opts.includes(o.id);
        return optHtml({ type:"checkbox", name:"opts", value:o.id, checked:on, title:o.title, desc:why || o.desc, meta:o.id, off:!on && !!why }); }).join(""))}
      ${helpHtml("extras","What do I need?",`<ul><li><strong>Oxygen service</strong> cleaning is needed for oxygen lines.</li><li>The <strong>ModbusView™</strong> licence and the USB or RJ45 kits connect a PC to the meter over RS485.</li><li><strong>Certificates</strong> of conformance, origin and wetted-part materials are often asked for by inspectors.</li><li><strong>FT4X View™</strong> software is free; the USB cable connects it to the meter.</li></ul>`)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  review(){
    const rows = summaryRows(true), n = getNotes(), acc = accessories();
    return `<div class="step">
      ${head(6,"Review your configuration","Check everything below. You can change any answer, then download the PDF or ask for a quotation.")}
      <div class="code-box"><div class="k">Model code</div><div class="v">${esc(partNumber())}</div>
        ${acc.length ? `<div class="r">Plus accessories: ${esc(acc.map(a => a.pn).join(", "))}</div>` : ""}
        <div class="s">${codeIsFinal() ? "Built from the FT4X model codes (Rev G). Illustrative only: confirm with the manufacturer." : "“?” marks a choice we will confirm with you."}</div></div>
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
        <label class="field"><span class="l">Notes for our team (optional)</span><textarea id="notes" placeholder="e.g. tag numbers, minimum flow, gas analysis, delivery date…">${esc(S.notes)}</textarea></label>
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
    if (S.gasT === "tnorm") out.push(msg("ok","Your gas temperature is inside the sensor rating."));
    if (S.gasT === "tcold") out.push(msg("info","Inside the sensor rating. Carbon steel inline bodies are not offered for gas below −29 °C."));
    getNotes().warn.filter(w => /hotter than|to be confirmed|above 740|Zone 0/.test(w)).forEach(w => out.push(msg("warn",w)));
    if (S.area === "div1" || S.area === "div2" || S.area === "dust") out.push(msg("ok","The FT4X explosion-proof enclosure is approved for this area."));
    return out.join("");
  },
  pipe(){
    const out = [], f = flowScfm(), idIn = flowIdIn();
    if (S.flow && !flowValid()) out.push(msg("warn","Please enter the maximum flow as a number."));
    if (isIns() && S.pipeId && !pipeValid()) out.push(msg("warn", pipeVal() < 1.5 ? "Insertion meters need a pipe of at least 1.5″ (40 mm) inside diameter. For smaller lines choose the inline flow body." : "Please enter the inside diameter in inches (1.5 to 200)."));
    if (isIns() && String(S.ins).trim() && !insValid()) out.push(msg("warn","Please enter the insulation thickness in inches (0 to 24), or leave it empty."));
    if (f && idIn){
      if (f > maxScfm(idIn)) out.push(msg("warn",`Above the range for this pipe: about ${fmt(maxScfm(idIn),0)} SCFM at 60,000 SFPM.`));
      else if (f < minFsScfm(idIn)) out.push(msg("warn",`Below the smallest calibrated range for this pipe (full scale about ${fmt(minFsScfm(idIn),1)} SCFM). We will check the sizing with you.`));
      else out.push(msg("ok",`${fmt(f,0)} SCFM is within the range for this pipe (up to about ${fmt(maxScfm(idIn),0)} SCFM).`));
    }
    if (isIns() && pipeValid() && insValid()) out.push(msg("info",`Probe length to reach the pipe centre: ${fmt(needLen("fixed"))}″, or ${fmt(needLen("retr"))}″ with a retractor.`));
    return out.join("");
  },
  body(){
    const out = [];
    if (S.mount === "crank" && S.valve && !valveValid()) out.push(msg("warn","Please enter the valve length in inches."));
    getNotes().warn.filter(w => /longer than the longest|no standard crank|2,500 SCFM/.test(w)).forEach(w => out.push(msg("warn",w)));
    const f1 = feature1(); if (f1) out.push(msg("ok",`Feature 1 of your model code: ${f1}${isIns() && S.dia === "s2" ? "-S2" : ""}.`));
    return out.join("");
  },
  elec(){
    const out = [];
    if (S.cable === "fox" && S.cableLen && !cableValid()) out.push(msg("warn","Please enter a whole number of feet from 1 to 100."));
    if (encCode() && S.comm) out.push(msg("ok",`Your model code: ${partNumber()}.`));
    return out.join("");
  },
  extras(){
    return getNotes().warn.filter(w => /Oxygen/.test(w)).map(w => msg("warn",w)).join("");
  }
};

/* =====================================================================
   SUMMARY PANEL
   ===================================================================== */
function summaryRows(forReview){
  const g = i => forReview ? i : null;
  const past = i => S.maxStep > i || forReview;
  const pr = byId(PRESS, S.press || "");
  return [
    { k:"Gas",                v:gasText(), step:g(0) },
    { k:"Application",        v:byId(APPS,S.app||"")?.title || null, step:g(0) },
    { k:"Gas temperature",    v:byId(GAS_T,S.gasT||"")?.title || null, step:g(0) },
    { k:"Max. pressure",      v:pr ? (pr.id === "punk" ? "Not sure" : `${pr.title} (${pr.desc.toLowerCase()})`) : null, step:g(0) },
    { k:"Area",               v:byId(AREAS,S.area||"")?.title || null, step:g(0) },
    { k:"Meter style",        v:byId(STYLES,S.style||"")?.title || null, step:g(1) },
    { k:"Max. flow",          v:flowText(), step:g(1) },
    { k:"Pipe",               v:pipeText(), step:g(1) },
    { k:isInl() ? "Flow body" : "Probe",  v:bodyText(), step:g(2) },
    ...(isIns() ? [{ k:"Probe diameter", v:S.probe ? byId(DIAS,S.dia).title : null, step:g(2) }] : []),
    { k:"Enclosure & power",  v:encText(), step:g(3) },
    { k:"Communication",      v:S.comm ? `${S.comm}: ${byId(COMMS,S.comm).title}` : null, step:g(3) },
    { k:"Remote cable",       v:cableText(), step:g(3) },
    { k:"Accessories",        v:past(4) ? accText() : null, step:g(4) },
    { k:"Quantity",           v:S.step >= 5 ? String(S.qty) : null, step:null }
  ];
}
const sumImgKey = () => isInl() ? "INL" : "INS";
function renderSummary(){
  const key = sumImgKey(), img = $("#sumImg");
  if (img.dataset.key !== key){ img.src = IMG[key]; img.dataset.key = key; }
  $("#sumModel").textContent = S.style ? `FT4X ${isIns() ? "insertion" : "inline"} flow meter` : "FT4X thermal gas mass flow meter";
  const bits = [gasText(), bodyText() ? bodyText().split(": ")[1] : pipeText()].filter(Boolean);
  $("#sumSub").textContent = bits.length ? bits.join(" · ") : "Your choices appear here as you go.";
  $("#sumCode").textContent = feature1() || encCode() || S.comm ? partNumber() : "";
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
  if (id === "pipe") return !S.style ? "Please choose the meter style." : !flowValid() ? "Please enter the maximum flow." : isIns() ? "Please enter a valid pipe size." : "Please choose the line size.";
  if (id === "body") return isIns() ? (S.mount === "crank" && !valveValid() ? "Please enter the valve length." : "Please choose the mounting and probe.") : "Please choose ends and material.";
  if (id === "elec") return S.loc === "remote" && S.cable === "fox" && !cableValid() ? "Please enter the cable length." : "Please answer all questions.";
  return "";
}
/* typed fields: flag invalid values so the one-question view keeps Continue disabled */
function markFields(){
  const set = (id, bad) => { const el = $("#" + id); if (el) el.setAttribute("aria-invalid", bad ? "true" : "false"); };
  set("flow", S.flow !== "" && !flowValid());
  set("pipeId", S.pipeId !== "" && !pipeValid());
  set("ins", String(S.ins).trim() !== "" && !insValid());
  set("valve", S.valve !== "" && !valveValid());
  set("cableLen", S.cableLen !== "" && !cableValid());
}
function renderStep(focus){
  const id = STEPS[S.step].id;
  $("#stage").innerHTML = VIEWS[id]();
  markFields();
  renderStepper(); renderNav(); renderSummary(); refreshFeedback();
  if (focus){ const h = $("#stepTitle"); if (h){ h.focus({preventScroll:true}); }
    (function(el){ if(!el) return; var hd=document.querySelector('header'); var off=(hd&&/sticky|fixed/.test(getComputedStyle(hd).position))?hd.offsetHeight:0; var html=document.documentElement, sb=html.style.scrollBehavior; html.style.scrollBehavior='auto'; window.scrollTo(0,Math.max(0,el.getBoundingClientRect().top+window.pageYOffset-off-8)); html.style.scrollBehavior=sb; })($("#stepper")); }
}
function refreshFeedback(){ const id = STEPS[S.step].id, el = $("#feedback"); if (el && FEEDBACK[id]) el.innerHTML = FEEDBACK[id](); }
function go(i){
  if (i < 0 || i >= STEPS.length) return;
  constrain();
  if (i === 2 && isIns() && S.mount && !S.probe) S.probe = recommendedProbe();
  S.step = i; S.maxStep = Math.max(S.maxStep, i);
  renderStep(true);
}
function refresh(){ markFields(); renderStepper(); renderNav(); renderSummary(); refreshFeedback(); }
function rerenderStage(focusSel){
  const y = window.scrollY, a = document.activeElement, caret = a && a.id && a.selectionStart != null ? [a.id, a.selectionStart] : null;
  const html = document.documentElement, sb = html.style.scrollBehavior; html.style.scrollBehavior = "auto";
  $("#stage").innerHTML = VIEWS[STEPS[S.step].id]();
  if (caret){ const el = $("#" + caret[0]); if (el){ el.focus({preventScroll:true}); try { el.setSelectionRange(caret[1], caret[1]); } catch {} } }
  else if (focusSel){ const el = $(focusSel); if (el) el.focus({preventScroll:true}); }
  window.scrollTo(0,y);
  /* the one-question view hides the other questions right after this; keep the page where it was */
  queueMicrotask(() => { window.scrollTo(0,y); html.style.scrollBehavior = sb; });
}

/* =====================================================================
   EVENTS
   ===================================================================== */
const RERENDER = { gas:1, style:1, unit:1, size:1, mount:1, dia:1, ends:1, mat:1, loc:1, power:1, comm:1, cable:1, press:1, gasT:1, opts:1 };
document.addEventListener("change", e => {
  const t = e.target;
  if (t.type !== "radio" && t.type !== "checkbox") return;
  const n = t.name, v = t.value;
  if (n === "opts"){ if (t.checked){ if (!S.opts.includes(v)) S.opts.push(v); } else S.opts = S.opts.filter(x => x !== v); }
  else if (n === "style" && S.style !== v){ S.style = v; S.size = null; S.ends = null; S.mat = null; S.mount = null; S.probe = null; S.valve = ""; }
  else if (n === "mount" && S.mount !== v){ S.mount = v; S.probe = null; constrain(); S.probe = recommendedProbe(); }
  else S[n] = v;
  constrain();
  if ((n === "mount" || n === "dia") && !S.probe) S.probe = recommendedProbe();
  S.maxStep = Math.max(S.maxStep, S.step);
  if (RERENDER[n]){ rerenderStage(`input[name="${n}"][value="${v}"]`); if (n === "mount" && v === "crank"){ const f = $("#valve"); if (f) f.focus({preventScroll:true}); } if (n === "cable" && v === "fox"){ const f = $("#cableLen"); if (f) f.focus({preventScroll:true}); } }
  refresh();
});
const TYPED = { flow:1, pipeId:1, ins:1, valve:1 };
document.addEventListener("input", e => {
  const t = e.target;
  if (TYPED[t.id]){ S[t.id] = t.value; constrain(); if (S.step === 2 && isIns() && S.mount && !S.probe) S.probe = recommendedProbe(); rerenderStage(); refresh(); }
  else if (t.id === "cableLen"){ S.cableLen = t.value; refresh(); }
  else if (t.id === "gasOther"){ S.gasOther = t.value; renderSummary(); }
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
  .replace(/″/g,'"').replace(/′/g,"'").replace(/¼/g,"1/4").replace(/½/g,"1/2").replace(/¾/g,"3/4").replace(/[–—]/g,"-").replace(/≤/g,"<=").replace(/≥/g,">=")
  .replace(/[“”]/g,'"').replace(/[’‘]/g,"'").replace(/™/g,"(TM)").replace(/®/g,"(R)").replace(/²/g,"2").replace(/³/g,"3").replace(/₂/g,"2").replace(/Ω/g,"ohm")
  .replace(/\s?°C/g," C").replace(/\s?°F/g," F").replace(/°/g," deg").replace(/±/g,"+/-")
  .replace(/·/g,"|").replace(/×/g,"x").replace(/−/g,"-").replace(/→/g,"->");
function loadImg(src, w, h){
  return new Promise((res, rej) => {
    const i = new Image();
    i.onload = () => { const c = document.createElement("canvas"); const sc = Math.min(w / i.naturalWidth, h / i.naturalHeight); c.width = w; c.height = h; const x = c.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0,0,w,h);
      const dw = i.naturalWidth * sc, dh = i.naturalHeight * sc; x.drawImage(i,(w-dw)/2,(h-dh)/2,dw,dh); res(c.toDataURL("image/jpeg", .9)); };
    i.onerror = rej; i.src = src;
  });
}
function buildPdf(logo, photo){
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit:"mm", format:"a4" });
  const W = 210, M = 18, CW = W - 2*M, GAP = 12, COL = (CW - GAP)/2, X1 = M, X2 = M + COL + GAP;
  const NAVY = [0,31,97], INK = [51,51,51], GREY = [122,124,128], LINE = [214,218,222], BLUE = [0,50,160], AMBER = [200,120,0];
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
  small("FT4X thermal gas mass flow meter", W - M, 26.5, { size:8, align:"right" });
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
  small(`${byId(STYLES,S.style).title}  |  ${gasText()}`, M, ty, { size:9.5 });
  ty = para("Thermal gas mass flow meter with DDC-Sensor(TM), Gas-SelectX(R) gas menu, CAL-V(TM) calibration validation and data logger. Two 4-20 mA outputs, pulse/alarm output, contact input, backlit display and USB port included.", M, ty + 6, CW - IW - 8, { size:8.6, color:GREY });
  small(codeIsFinal() ? "Model code built from the FT4X model codes (Rev G); illustrative only, confirm with the manufacturer." : "\"?\" in the model code marks a choice to be confirmed.", M, ty + 1, { size:7.2 });
  y = Math.max(ty + 6, y + IW - 2);

  const R = Object.fromEntries(summaryRows(true).map(r => [r.k, r.v]));
  let yl = section("Application", X1, y, COL), yr = section("Meter", X2, y, COL);
  yl = item("Gas", R["Gas"], X1, yl, COL);
  yl = item("Application", R["Application"], X1, yl, COL);
  yl = item("Gas temperature  |  max. pressure", `${R["Gas temperature"]}  |  ${R["Max. pressure"]}`, X1, yl, COL);
  yl = item("Hazardous area", R["Area"], X1, yl, COL);
  yl = item("Maximum flow  |  pipe", `${R["Max. flow"]}  |  ${R["Pipe"]}`, X1, yl, COL);
  yr = item(isInl() ? "Flow body" : "Probe", R[isInl() ? "Flow body" : "Probe"], X2, yr, COL);
  if (isIns()) yr = item("Probe diameter", R["Probe diameter"], X2, yr, COL);
  yr = item("Enclosure and power", R["Enclosure & power"], X2, yr, COL);
  yr = item("Communication  |  quantity", `${R["Communication"]}  |  ${S.qty} pcs`, X2, yr, COL);
  yr = item("Remote cable", R["Remote cable"], X2, yr, COL);
  y = Math.max(yl, yr) + 3;

  const acc = accessories();
  need(20 + acc.length * 5);
  y = section("Accessories and documents (separate part numbers)", M, y, CW);
  if (!acc.length) y = para("None selected.", M, y, CW, { size:8.8 }) + 2;
  acc.forEach(a => { small(a.pn, M, y, { size:8.6, bold:true, color:NAVY }); y = para(a.t, M + 18, y, CW - 18, { size:8.6 }) + .2; });
  y += 3;

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
  need(10 + half * 12);
  y = section("Technical data (from the Fox Thermal FT4X datasheet)", M, y + 1, CW);
  yl = y; yr = y;
  SPECS.forEach(([k, v], i) => { if (i < half) yl = compact(k, v, X1, yl, COL); else yr = compact(k, v, X2, yr, COL); });

  const pages = doc.getNumberOfPages();
  doc.setPage(pages);
  small("Demo only, not for ordering. Illustrative: confirm all specifications with the manufacturer. Source: FT4X datasheet Rev. J, FT4X Model Codes Rev G.", M, 280.5, { size:6.8 });
  for (let p = 1; p <= pages; p++){
    doc.setPage(p); hair(M, 284, W - M);
    small("Unofficial demo by SwiftyQuote  |  sales@swiftyquote.com  |  Not affiliated with Fox Thermal", M, 289, { size:6.8 });
    small(`${p} / ${pages}`, W - M, 289, { size:7, align:"right" });
  }
  return doc;
}
const pdfName = () => `FoxThermal_FT4X_${partNumber().replace(/\?/g,"x")}_${S.ref}.pdf`;
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
  const out = [`Model code: ${partNumber()}`];
  summaryRows(true).forEach(r => { if (r.k !== "Quantity" && r.k !== "Accessories") out.push(`${r.k}: ${r.v || "-"}`); });
  const acc = accessories();
  out.push(`Accessories: ${acc.length ? acc.map(a => `${a.pn} ${a.t}`).join("; ") : "None"}`);
  out.push(`Quantity: ${S.qty}`);
  return out;
}
const quoteSubject = () => `Quotation request: ${partNumber()} (${S.ref}) | ${SETTINGS.TRACKING_TAG}`;
function quoteText(withHeaders){
  const f = Object.fromEntries(new FormData($("#quoteForm")).entries());
  const n = getNotes();
  return [
    ...(withHeaders ? [`To: ${SETTINGS.QUOTE_EMAIL}`, ...(SETTINGS.QUOTE_CC ? [`Cc: ${SETTINGS.QUOTE_CC}`] : []), `Subject: ${quoteSubject()}`, ""] : []),
    `Quotation request | FT4X thermal gas mass flow meter | Ref. ${S.ref}`, "",
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
  $("#faqCta").href = `mailto:${DEMO_CONTACT.email}?subject=${encodeURIComponent("Configurator enquiry (from the Fox Thermal demo)")}`;
  $("#faqContact").innerHTML = `Or write to <a href="mailto:${DEMO_CONTACT.email}">${DEMO_CONTACT.email}</a> · <a href="${DEMO_CONTACT.site}" target="_blank" rel="noopener">swiftyquote.com</a>`;
})();

window.__cfg = { get S(){ return S; }, set S(v){ S = v; }, newState, go, partNumber, feature1, getNotes, buildPdf, buildMailto, quoteText, isComplete, renderStep, constrain, optOffWhy, probeOffWhy, sizeOffWhy, endsOffWhy, matOffWhy, mountOffWhy, recommendedProbe, accessories };
renderStep(false);
