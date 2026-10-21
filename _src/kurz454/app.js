"use strict";

/* =====================================================================
   SETTINGS: adjust these lines for your own set-up
   ===================================================================== */
const SETTINGS = {
  QUOTE_EMAIL: "sales@swiftyquote.com", // where quotation requests are sent (Kurz sales)
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
    a:"<p>The product data and photos belong to Kurz Instruments and are used here for demonstration only. This page is not an official Kurz tool and you cannot place orders on it. Please contact Kurz Instruments directly for real enquiries about the Series 454FTB.</p>" },
  { q:"Can you build this for my own products?",
    a:"<p>Yes. The configurator is built around your product range, your options and your rules, and it takes on your branding: your logo, colours and fonts. It works for anything a buyer has to specify before they can get a quote, such as range, power, approvals, outputs or accessories.</p>" },
  { q:"What do you need from me to get started?",
    a:"<ul><li>A link to the product page, or the datasheets and catalogue.</li><li>Your logo and brand guidelines (or we take them from your website).</li><li>The options a buyer can choose, and any rules, such as which combinations are possible or which approvals apply.</li><li>The email address (or system) where quotation requests should go.</li></ul>" },
  { q:"How much does it cost?",
    a:"<p>The price depends on how many products and options are covered, whether you need extra languages, and whether it should connect to your other systems. We give you a fixed quote after a short conversation, so there are no surprises.</p><p>Write to <a href=\"mailto:sales@swiftyquote.com?subject=Configurator%20price%20enquiry\">sales@swiftyquote.com</a> with a link to your product and we will come back with a price.</p>" },
  { q:"How long does implementation take?",
    a:"<p>The timeline depends on the size of your range and the features you choose. A single-product configurator like this one is quicker than a full catalogue with several product families. You receive a clear timeline together with your quote, and you see a first working version early so you can give feedback before we finish.</p>" },
  { q:"Can it use our branding and languages?",
    a:"<p>Yes. This demo already follows the Kurz Instruments colours and fonts. Your version follows yours. Additional languages can be added.</p>" },
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
   Source: Kurz Series 454FTB Technical Specifications (367551M, 7 pages; ordering information pp6-7).
   Part number: 756xxx (parent number) followed by features F1 to F12:
   F1 enclosure & power | F2 sensor + probe support material | F3 support length | F4 temperature compensation |
   F5 support diameter & flange | F6 flange U dimension | F7 velocity range | F8 gas calibration | F9 approvals |
   F10 process pressure (PSIA) | F11 communications & I/O | F12 process temperature (deg Rankine) [+ "S" for SIL1]
   ===================================================================== */
const APPS = [
  { id:"comb",  title:"Combustion air",           desc:"Primary, secondary, tertiary and overfire air; coal pulverizer air." },
  { id:"stack", title:"Stack and flue gas",       desc:"Boilers, recovery boilers, cement plants." },
  { id:"epa",   title:"EPA / AMS emissions monitoring", desc:"Greenhouse-gas reporting with zero-mid-span drift checks." },
  { id:"flare", title:"Flare gas",                desc:"Flare headers and vent lines." },
  { id:"cair",  title:"Compressed air",           desc:"Plant air headers and consumption metering." },
  { id:"bio",   title:"Aeration air and biogas",  desc:"Wastewater aeration blowers, digester gas." },
  { id:"proc",  title:"Industrial or process gas", desc:"Nitrogen, oxygen, CO₂, natural gas and other gases." },
  { id:"other", title:"Something else",           desc:"We will look at it together with you." }
];
const AREAS = [
  { id:"safe", title:"Ordinary (non-hazardous) area", desc:"No flammable gas expected around the meter." },
  { id:"z2",   title:"Zone 2 / Division 2",  desc:"Flammable gas only in abnormal conditions." },
  { id:"z1",   title:"Zone 1 / Division 1",  desc:"Flammable gas can be present in normal operation." }
];
const P_UNITS = [ { id:"psig", title:"psig" }, { id:"barg", title:"bar(g)" }, { id:"psia", title:"psia" } ];
const T_UNITS = [ { id:"F", title:"°F" }, { id:"C", title:"°C" } ];

/* F8 gas calibrations: [id, name, laboratory code, correlation code, short description] */
const GASES = [
  ["air",  "Air at atmospheric pressure", "01", null, "Combustion air, ducts, stacks, aeration blowers."],
  ["cair", "Compressed air",              "07", "0M", "Plant air. Correlation calibration to 70,000 SFPM."],
  ["n2",   "Nitrogen",                    "40", "90", null],
  ["o2",   "Oxygen",                      "44", "94", null],
  ["co2",  "Carbon dioxide",              "14", "64", null],
  ["ch4",  "Methane",                     "32", "82", null],
  ["dg50", "Digester gas 50% CH₄ / 50% CO₂", "35", "85", null],
  ["dg60", "Digester gas 60% CH₄ / 40% CO₂", "36", "86", null],
  ["dg70", "Digester gas 70% CH₄ / 30% CO₂", "37", "87", null],
  ["ar",   "Argon",                       "08", "58", null],
  ["he",   "Helium",                      "26", "76", null],
  ["h2",   "Hydrogen",                    "28", null, "Laboratory calibration only."],
  ["c2h6", "Ethane",                      "20", "70", null],
  ["c2h4", "Ethylene",                    "22", "72", null],
  ["c3h8", "Propane",                     "46", "96", "Laboratory calibration up to 50 PSIA."],
  ["c4",   "Butane",                      null, "60", "Correlation calibration only."],
  ["nh3",  "Dry ammonia",                 null, "56", "Correlation calibration only."],
  ["cl2",  "Dry chlorine",                null, "68", "Correlation calibration only."],
  ["bin",  "Mixture of two gases (your composition)", null, "8K", "User-defined binary gas composition."],
  ["multi","Several gases or mixes",      null, "8M", "Up to five calibration curves in one meter; up to a 5-gas mix per curve."]
].map(([id,title,lab,corr,note]) => ({ id, title, lab, corr, note }));
const CURVES = [
  { id:"8M", n:1, title:"One gas curve" }, { id:"8N", n:2, title:"Two gas curves" }, { id:"8O", n:3, title:"Three gas curves" },
  { id:"8P", n:4, title:"Four gas curves" }, { id:"8Q", n:5, title:"Five gas curves" }
];
const CALS = [
  { id:"lab",  title:"Laboratory calibration in your gas", desc:"High-purity gas, NIST traceable, at your process pressure." },
  { id:"corr", title:"Correlation calibration",            desc:"Calibrated in air and correlated to your gas, with velocity-temperature mapping. Add ±5% of reading to the accuracy." }
];
/* F7 velocity calibration range (maximum): [code, SFPM, NMPS] */
const VELS = [
  ["A", null, null], ["B",300,"1.4"], ["C",600,"2.8"], ["E",1000,"4.7"], ["G",2000,"9.3"], ["I",3000,"14"], ["K",4000,"18.6"],
  ["M",6000,"28"], ["P",9000,"41.9"], ["R",12000,"56"], ["T",15000,"70"], ["V",18000,"84"], ["X",24000,"112"]
].map(([id,sfpm,nmps]) => ({ id, sfpm, nmps,
  title: sfpm ? `Up to ${sfpm.toLocaleString("en-US")} SFPM` : "Vmax (maximum for your gas)",
  desc: sfpm ? `${nmps} NMPS (normal metres per second)` : "The highest velocity Kurz calibrates for the chosen gas." }));
/* F4 process temperature compensation (limits in deg C) */
const COMPS = [
  { id:"1", lo:-40, hi:125, title:"Standard compensation, −40 to 125 °C", desc:"Accuracy ±(1 + 2000/V) % of reading at 25 °C (V in SFPM).", short:"STC −40 to 125 °C" },
  { id:"2", lo:0,   hi:260, title:"Standard compensation, 0 to 260 °C",   desc:"Accuracy ±(2 + 2000/V) % of reading at 125 °C.", short:"STC 0 to 260 °C" },
  { id:"3", lo:0,   hi:260, title:"Velocity-temperature mapping, 0 to 260 °C", desc:"For widely varying temperature and velocity. Accuracy ±(2 + 2000/V) %.", short:"VTM 0 to 260 °C" },
  { id:"4", lo:0,   hi:500, title:"Velocity-temperature mapping, 0 to 500 °C", desc:"High-temperature (HHT) models only. Accuracy ±(3 + 3000/V) %.", short:"VTM 0 to 500 °C", hht:true }
];
const MODELS = [
  { id:"std",   title:"Standard probe (454FTB)", desc:"For clean or moderately dirty gases, 1/2″, 3/4″ or 1″ probe." },
  { id:"purge", title:"Air-purge probe (454PFTB)", desc:"For very dirty ducts with dry dust that builds up on the sensor. Air at ambient pressure, 1″ probe." }
];
/* F3 probe support length: [code, inches, mm, allowed diameters] */
const LENGTHS = [
  ["B",6,152,["08","12","16"]], ["C",9,229,["08","12","16"]], ["D",12,305,["08","12","16"]],
  ["F",18,457,["12","16"]], ["H",24,610,["12","16"]], ["J",30,762,["12","16"]], ["K",36,914,["12","16"]],
  ["M",48,1219,["16"]], ["P",60,1524,["16"]]
].map(([id,inch,mm,dias]) => ({ id, inch, mm, dias, title:`${inch}″ (${mm} mm)` }));
const DIAS = [
  { id:"08", title:"1/2″ (12.7 mm)" }, { id:"12", title:"3/4″ (19.05 mm)" }, { id:"16", title:"1″ (25.4 mm)" }
];
/* F2 materials */
const SENSMATS = [
  { id:"3", title:"C-276 alloy", desc:"All-welded sensor. Standard.", badge:"Standard" },
  { id:"7", title:"C-276 alloy with AlTiN coating", desc:"Abrasion-resistant aluminium titanium nitride coating for dusty, abrasive gas." }
];
const SUPPMATS = [
  { id:"2", title:"316L stainless steel", desc:"Standard probe support.", badge:"Standard" },
  { id:"3", title:"C-276 alloy", desc:"For corrosive gases." },
  { id:"8", title:"C-276 alloy with PTFE coating", desc:"Cured coating for chemical resistance. HHT models, up to 260 °C." }
];
/* F5 sensor support diameter & flange: [code, flange, allowed diameters] */
const FLANGES = [
  ["A","No flange connection",["08","12","16"]],
  ["B","1/2″, Class 150",["08"]], ["C","1/2″, Class 300",["08"]],
  ["D","3/4″, Class 150",["08","12"]], ["E","3/4″, Class 300",["08","12"]],
  ["F","1″, Class 150",["08","12","16"]], ["G","1″, Class 300",["12","16"]],
  ["H","1-1/4″, Class 150",["12","16"]], ["I","1-1/4″, Class 300",["12","16"]],
  ["J","1-1/2″, Class 150",["12","16"]], ["K","1-1/2″, Class 300",["12","16"]],
  ["L","2″, Class 150",["12","16"]], ["M","2″, Class 300",["12","16"]],
  ["N","2-1/2″, Class 150",["16"]], ["P","2-1/2″, Class 300",["16"]],
  ["S","3″, Class 150",["16"]], ["T","3″, Class 300",["16"]],
  ["U","4″, Class 150",["16"]], ["V","4″, Class 300",["16"]]
].map(([id,title,dias]) => ({ id, title: id === "A" ? title : `${title} ANSI B16.5 flange`, dias }));
const MOUNTS = [
  { id:"noflange", title:"No flange", desc:"Fitted through a compression fitting, packing gland or ball valve (ordered as hardware)." },
  { id:"flange",   title:"Flanged probe", desc:"ANSI B16.5 flange welded to the probe support at a set position." }
];
const LOCS = [
  { id:"direct", title:"On the probe (directly attached)", desc:"Transmitter sits on top of the probe. Compact, one unit." },
  { id:"remote", title:"Remote, up to a few metres away", desc:"Probe with a junction box; transmitter mounted where it is easy to reach and read." }
];
const ENCLS = [
  { id:"al", title:"Aluminium, dual chamber", desc:"Type 4, IP66 polyester powder-coated. On the probe or remote.", badge:"Standard" },
  { id:"ss", title:"Stainless steel", desc:"Type 4X, IP66. Remote only." },
  { id:"pc", title:"Polycarbonate", desc:"Wall-mount, Type 4, IP54. Remote only, AC or DC power." }
];
const POWERS = [
  { id:"ac", title:"AC mains, 85 to 264 V 50/60 Hz", desc:"24 W maximum." },
  { id:"dc", title:"24 V DC ±10%", desc:"1 A maximum." }
];
const DISPS = [
  { id:"yes", title:"With display and keypad", desc:"Backlit 2 × 16 character display; set up the meter on site.", badge:"Recommended" },
  { id:"no",  title:"Without display", desc:"Blind transmitter, set up by USB or Modbus." }
];
const ORIENTS = [
  { id:"std", title:"Standard orientation", desc:"Display faces the side, as in the drawing." },
  { id:"rot", title:"Rotated 180° for viewing", desc:"Enclosure turned for easier reading from the other side." }
];
/* F9 safety approvals */
const APPRS = [
  { id:"A", title:"Increased safety (Ex ec), Zone 2 / Class I Div 2", desc:"cETLus, ATEX, IECEx. Aluminium enclosure. Groups A, B, C and D." },
  { id:"B", title:"Flameproof (Ex db), Zone 1 / Class I Div 1", desc:"cETLus, ATEX, IECEx. Aluminium enclosure. IIB + H2; Div 1 Groups B, C and D." },
  { id:"D", title:"Separate transmitter and sensor (polycarbonate)", desc:"Transmitter Ex ec (Zone 2 / Div 2); sensor enclosure flameproof (Zone 1 / Div 1)." },
  { id:"H", title:"Separate transmitter and sensor (stainless steel)", desc:"Both flameproof Ex db, Zone 1 / Class I Div 1, Groups B, C and D." }
];
/* F11 communications and I/O */
const IOS = [
  { id:"B", title:"Standard: two 4-20 mA outputs", desc:"Two isolated 4-20 mA outputs (flow and temperature). USB and Modbus RS-485 included." },
  { id:"C", title:"Full: 4-20 mA, relays and inputs", desc:"Two 4-20 mA outputs, two relays, two digital inputs, one 4-20 mA input." },
  { id:"E", title:"HART, one output", desc:"One 4-20 mA HART output, two relays, two digital inputs, one 4-20 mA input." },
  { id:"H", title:"HART, two outputs", desc:"Two 4-20 mA outputs with HART, two relays, two digital inputs, one 4-20 mA input." },
  { id:"K", title:"Profibus DP", desc:"Profibus DP plus two 4-20 mA outputs, two relays, two digital inputs, one 4-20 mA input." }
];
/* Hardware accessories named on page 2 (ordered separately; codes not in the ordering table) */
const HW = [
  { id:"comp",   title:"Compression fitting", desc:"Simple fixed mounting through a threaded port." },
  { id:"pack",   title:"Packing gland", desc:"Lets you adjust the insertion depth." },
  { id:"ball",   title:"Ball valve", desc:"Remove the probe without shutting down (hot tap)." },
  { id:"retr",   title:"Retractor", desc:"Safe insertion and removal under pressure." },
  { id:"restr",  title:"Restraint", desc:"Keeps the probe from being pushed out under pressure." },
  { id:"branch", title:"Branch fitting", desc:"Weld-on branch for the mounting connection." },
  { id:"gland",  title:"Cable glands" },
  { id:"seal",   title:"Conduit seals", desc:"For hazardous-area conduit entries." },
  { id:"cable",  title:"Interconnect cable", desc:"5-conductor shielded cable between probe and remote transmitter.", remote:true },
  { id:"m146",   title:"Model 146 air sensor cleaning system", desc:"Solenoid valves and air blow-down tank for the 454PFTB.", purge:true }
];

const SPECS = [
  ["Measurement",       "Constant temperature thermal mass flow, single-point insertion; flow rate, velocity and temperature"],
  ["Velocity range",    "0 to 70,000 SFPM (325 NMPS); accuracy +/-(1 + 2000/v) % of reading; repeatability < 0.25% of reading"],
  ["Response",          "Velocity time constant 1 s; temperature 8 s (at 6,000 SFPM)"],
  ["Process ratings",   "Up to 300 PSIG (20 BARg); -40 to 260 C (HT) or -40 to 500 C (HHT)"],
  ["Sensor and support","C-276 all-welded sensor; 316L SS, C-276 or PTFE-coated support, 1/2, 3/4 or 1 in, 6 to 60 in long"],
  ["Outputs",           "4-20 mA NAMUR NE43, relays, USB and RS-485 Modbus (ASCII/RTU); HART v7 or Profibus DP options"],
  ["Power",             "85-264 VAC 50/60 Hz (24 W max.) or 24 VDC +/-10% (1 A max.)"],
  ["Approvals",         "cETLus, ATEX, IECEx; EPA 40 CFR 98.34(c)(1); CE; CRN; SIL1 option; 3-year warranty"]
];

/* =====================================================================
   STATE
   ===================================================================== */
const STEPS = [
  { id:"app",    label:"Application" },
  { id:"gas",    label:"Gas & range" },
  { id:"probe",  label:"Probe" },
  { id:"elec",   label:"Electronics" },
  { id:"extras", label:"Outputs & extras" },
  { id:"review", label:"Review" }
];
const $ = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => [...el.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const byId = (arr,id) => arr.find(x => x.id === id);

function newState(){
  return { step:0, maxStep:0, app:null, area:null, pUnit:"psig", pVal:"", tUnit:"F", tNorm:"", tMax:"",
           gas:null, curves:"8M", cal:null, vel:null, comp:null,
           model:"std", len:null, dia:null, sens:"3", supp:"2", mount:null, flange:null, uDim:"",
           loc:null, encl:null, power:null, disp:null, orient:"std", appr:null,
           io:null, sil:false, hw:[], qty:1, notes:"", ref:makeRef(), helpOpen:{} };
}
function makeRef(){
  const d = new Date(), p = n => String(n).padStart(2,"0");
  const rnd = Math.random().toString(36).slice(2,6).toUpperCase();
  return `KI-${String(d.getFullYear()).slice(2)}${p(d.getMonth()+1)}${p(d.getDate())}-${rnd}`;
}
let S = newState();

/* ---------- process conditions ---------- */
const num = v => /^-?\d+(\.\d+)?$/.test(String(v).trim()) ? parseFloat(v) : null;
function press(){
  const v = num(S.pVal); if (v === null) return { ok:false, empty:!String(S.pVal).trim(), why:"Please enter a number." };
  const psig = S.pUnit === "psig" ? v : S.pUnit === "barg" ? v * 14.5038 : v - 14.7;
  const psia = psig + 14.7;
  if (psia < 1) return { ok:false, why:"That is below a full vacuum. Please check the value and unit." };
  if (psig > 300.05) return { ok:false, why:"The 454FTB is rated up to 300 psig (20 bar g)." };
  return { ok:true, psig, psia, code:String(Math.max(1, Math.round(psia))).padStart(3,"0") };
}
const toC = v => S.tUnit === "C" ? v : (v - 32) * 5 / 9;
const toF = v => S.tUnit === "F" ? v : v * 9 / 5 + 32;
function temps(){
  const n = num(S.tNorm), mxRaw = String(S.tMax).trim() ? num(S.tMax) : n;
  if (n === null) return { ok:false, empty:!String(S.tNorm).trim(), field:"tNorm", why:"Please enter a number." };
  if (mxRaw === null) return { ok:false, field:"tMax", why:"Please enter a number, or leave the highest temperature empty." };
  const nc = toC(n), mc = toC(mxRaw);
  if (nc < -40.05) return { ok:false, field:"tNorm", why:"The 454FTB measures from −40 °C (−40 °F)." };
  if (mc < nc - 0.01) return { ok:false, field:"tMax", why:"The highest temperature must be at least the normal temperature." };
  if (mc > 500.05) return { ok:false, field:"tMax", why:"The 454FTB is rated up to 500 °C (932 °F)." };
  return { ok:true, nc, mc, lo:Math.min(nc, mc), rank:String(Math.round(toF(n) + 460)).padStart(4,"0") };
}
const fmtT = c => `${Math.round(c)} °C (${Math.round(c * 9 / 5 + 32)} °F)`;
const tInfo = () => { const t = temps(); return t.ok ? t : null; };

/* ---------- rules ---------- */
const gasObj = () => byId(GASES, S.gas || "");
const isPurge = () => S.model === "purge";
function hht(){ const t = tInfo(); return !isPurge() && (!!(t && t.mc > 260) || S.supp === "8" || S.comp === "4"); }
const dia = () => isPurge() ? "16" : S.dia;
const lenObj = () => byId(LENGTHS, S.len || "");
function modelName(){ const d = dia(); if (!d) return null; return isPurge() ? "454PFTB-16-HT" : `454FTB-${d}-${hht() ? "HHT" : "HT"}`; }
function parentNo(){
  const m = modelName(); if (!m) return null;
  return ({ "454FTB-08-HT":"756051", "454FTB-08-HHT":"756052", "454FTB-12-HT":"756053", "454FTB-12-HHT":"756054",
            "454FTB-16-HT":"756055", "454FTB-16-HHT":"756056", "454PFTB-16-HT":"756057" })[m];
}
function gasCode(){
  const g = gasObj(); if (!g || !S.cal) return null;
  if (g.id === "multi") return S.curves;
  return S.cal === "lab" ? g.lab : g.corr;
}
function calOffWhy(c){
  const g = gasObj(); if (!g) return null;
  if (c.id === "lab" && !g.lab) return `No laboratory calibration is listed for ${g.title.toLowerCase()}: correlation calibration only.`;
  if (c.id === "corr" && !g.corr) return `No correlation calibration is listed for ${g.title.toLowerCase()}: laboratory calibration only.`;
  const p = press();
  if (c.id === "lab" && p.ok){
    const lim = g.id === "c3h8" ? 50 : 150;
    if (p.psia > lim + 0.5) return `Laboratory calibrations run up to ${lim} PSIA${g.id === "c3h8" ? " for propane" : ""}; your process is ${Math.round(p.psia)} PSIA.`;
  }
  return null;
}
function compOffWhy(c){
  const t = tInfo();
  if (c.hht && isPurge()) return "The air-purge 454PFTB is a standard-temperature (HT) model.";
  if (!t) return null;
  if (t.lo < c.lo - 0.01) return `Covers ${c.lo} to ${c.hi} °C; your normal temperature is ${fmtT(t.lo)}.`;
  if (t.mc > c.hi + 0.01) return `Covers up to ${c.hi} °C; your highest temperature is ${fmtT(t.mc)}.`;
  return null;
}
function modelOffWhy(m){
  if (m.id !== "purge") return null;
  if (S.gas && S.gas !== "air") return "The 454PFTB measures air at ambient pressure only.";
  const t = tInfo(); if (t && t.mc > 260) return "The 454PFTB is an HT model (up to 260 °C).";
  if (S.supp === "8") return "The PTFE-coated support is for HHT models only.";
  return null;
}
function lenOffWhy(l){ const d = dia(); return d && !l.dias.includes(d) ? `Not with a ${byId(DIAS,d).title.split(" ")[0]} probe: ${l.inch >= 48 ? "1″ probe only" : "3/4″ or 1″ probe only"}.` : null; }
function diaOffWhy(d){
  if (isPurge() && d.id !== "16") return "The air-purge 454PFTB comes with a 1″ probe.";
  const l = lenObj(); if (l && !l.dias.includes(d.id)) return `Not available at ${l.inch}″ length.`;
  return null;
}
function suppOffWhy(m){
  if (m.id !== "8") return null;
  if (isPurge()) return "Not for the air-purge 454PFTB (HHT models only).";
  const t = tInfo(); if (t && t.mc > 260) return "PTFE coating is limited to 260 °C.";
  return null;
}
function flangeOffWhy(f){ const d = dia(); return d && !f.dias.includes(d) ? `Not for a ${byId(DIAS,d).title.split(" ")[0]} probe.` : null; }
function enclOffWhy(e){ return S.loc === "direct" && e.id !== "al" ? "On-the-probe electronics use the aluminium enclosure. Choose remote for this one." : null; }
function apprOffWhy(a){
  const e = S.encl;
  if (!e) return null;
  if ((a.id === "A" || a.id === "B") && e !== "al") return "For the aluminium enclosure.";
  if (a.id === "D" && e !== "pc") return "For the remote polycarbonate enclosure only.";
  if (a.id === "H" && e !== "ss") return "For the remote stainless steel enclosure only.";
  if (a.id === "A" && S.area === "z1") return "Increased safety is for Zone 2 / Division 2, not Zone 1.";
  return null;
}
function f1(){
  const { loc, encl, power, disp } = S; if (!loc || !encl || !power || !disp) return null;
  const y = disp === "yes", rot = S.orient === "rot" && loc === "direct" && y;
  if (encl === "pc") return y ? "R" : "S";
  if (encl === "ss") return power === "ac" ? (y ? "T" : "V") : (y ? "W" : "X");
  if (loc === "direct") return power === "ac" ? (y ? (rot ? "C" : "A") : "B") : (y ? (rot ? "G" : "F") : "H");
  return power === "ac" ? (y ? "D" : "E") : (y ? "I" : "J");
}
const flanged = () => S.mount === "flange";
function uMax(){ const l = lenObj(); if (!l) return null; return l.inch - (hht() ? 8 : 5) + (isPurge() ? 0.98 : 1.47); }
function uState(){
  if (!flanged()) return { ok:true, code:"000" };
  const v = num(S.uDim);
  if (v === null) return { ok:false, empty:!String(S.uDim).trim(), why:"Please enter the U dimension in inches." };
  if (v < 0.1 || v > 99.9) return { ok:false, why:"Enter 0.1 to 99.9 inches (one decimal)." };
  return { ok:true, v, code:String(Math.round(v * 10)).padStart(3,"0") };
}
function constrain(){
  const g = gasObj();
  if (S.gas && S.gas !== "multi") S.curves = "8M";
  if (S.cal && byId(CALS,S.cal) && calOffWhy(byId(CALS,S.cal))) S.cal = null;
  if (g && !S.cal){ const ok = CALS.filter(c => !calOffWhy(c)); if (ok.length === 1) S.cal = ok[0].id; }
  if (S.model === "purge" && modelOffWhy(byId(MODELS,"purge"))) S.model = "std";
  if (S.supp && suppOffWhy(byId(SUPPMATS,S.supp))) S.supp = "2";
  if (S.comp && compOffWhy(byId(COMPS,S.comp))) S.comp = null;
  if (isPurge()) S.dia = "16";
  if (S.dia && diaOffWhy(byId(DIAS,S.dia))) S.dia = null;
  if (S.len && lenOffWhy(lenObj())) S.len = null;
  if (S.flange && (!flanged() || flangeOffWhy(byId(FLANGES,S.flange)))) S.flange = null;
  if (S.mount === "noflange") S.flange = "A";
  if (!flanged()) S.uDim = "";
  if (S.encl && enclOffWhy(byId(ENCLS,S.encl))) S.encl = null;
  if (S.encl === "pc" && !S.power) S.power = "ac";
  if (S.appr && apprOffWhy(byId(APPRS,S.appr))) S.appr = null;
  if (S.encl && !S.appr){ const ok = APPRS.filter(a => !apprOffWhy(a)); if (ok.length === 1) S.appr = ok[0].id; else if (S.encl === "al") S.appr = S.area === "z1" ? "B" : "A"; }
  if (S.loc !== "direct" || S.disp !== "yes") S.orient = "std";
  S.hw = S.hw.filter(h => { const o = byId(HW,h); return !(o.remote && S.loc !== "remote") && !(o.purge && !isPurge()); });
}

/* ---------- derived values ---------- */
function features(){
  const p = press(), t = tInfo(), u = uState();
  return [
    ["F1",  f1(),                               "Electronics enclosure and power"],
    ["F2",  S.sens && S.supp ? S.sens + S.supp : null, "Sensor / probe support material"],
    ["F3",  S.len,                              "Probe support length"],
    ["F4",  S.comp,                             "Temperature compensation"],
    ["F5",  S.flange,                           "Support diameter and flange"],
    ["F6",  S.mount ? (u.ok ? u.code : null) : null, "Flange U dimension"],
    ["F7",  S.vel,                              "Velocity calibration range"],
    ["F8",  gasCode(),                          "Gas calibration"],
    ["F9",  S.appr,                             "Safety approvals"],
    ["F10", p.ok ? p.code : null,               "Process pressure, PSIA"],
    ["F11", S.io,                               "Communications and I/O"],
    ["F12", t ? t.rank + (S.sil ? "S" : "") : null, "Process temperature, °R" + (S.sil ? " + SIL1" : "")]
  ];
}
function partNumber(){
  const q = (v, n) => v || "?".repeat(n);
  const w = { F2:2, F6:3, F8:2, F10:3, F12:4 };
  return `${parentNo() || "756???"}-${features().map(([k,v]) => q(v, w[k] || 1)).join("")}`;
}
const codeIsFinal = () => !partNumber().includes("?");
function pressText(){ const p = press(); if (!p.ok) return null; return `${String(S.pVal).trim()} ${byId(P_UNITS,S.pUnit).title} (${Math.round(p.psia)} PSIA)`; }
function tempText(){
  const t = tInfo(); if (!t) return null; const u = S.tUnit === "C" ? "°C" : "°F";
  const n = String(S.tNorm).trim(), m = String(S.tMax).trim();
  return m && num(m) !== num(n) ? `Normal ${n} ${u}, highest ${m} ${u}` : `${n} ${u}`;
}
function gasText(){
  const g = gasObj(); if (!g) return null;
  let t = g.id === "multi" ? `${g.title}: ${byId(CURVES,S.curves).title.toLowerCase()}` : g.title;
  if (S.cal) t += `, ${S.cal === "lab" ? "laboratory" : "correlation"} calibration`;
  return t;
}
function probeText(){
  const d = dia(), l = lenObj(); if (!d && !l) return null;
  return [d ? `${byId(DIAS,d).title.split(" ")[0]} diameter` : null, l ? `${l.inch}″ (${l.mm} mm) long` : null].filter(Boolean).join(", ");
}
function matText(){ if (!S.sens || !S.supp) return null; return `Sensor ${byId(SENSMATS,S.sens).title}; support ${byId(SUPPMATS,S.supp).title}`; }
function mountText(){
  if (!S.mount) return null;
  if (!flanged()) return "No flange";
  const f = byId(FLANGES, S.flange || ""); if (!f) return "Flanged (size to choose)";
  const u = uState(); return `${f.title}${u.ok ? `, U = ${u.v}″` : ""}`;
}
function elecText(){
  if (!S.loc || !S.encl || !S.power || !S.disp) return null;
  const pw = S.encl === "pc" ? "AC or DC" : (S.power === "ac" ? "AC power" : "24 VDC");
  return `${S.loc === "direct" ? "On the probe" : "Remote"}, ${byId(ENCLS,S.encl).title.toLowerCase()}, ${pw}, ${S.disp === "yes" ? "with display" : "no display"}${S.orient === "rot" ? ", rotated 180°" : ""}`;
}
function areaText(){ const a = byId(AREAS, S.area || ""); return a ? a.title : null; }
function extrasText(){
  const t = [];
  if (S.sil) t.push("SIL1 certification (TÜV Rheinland)");
  S.hw.forEach(h => t.push(byId(HW,h).title));
  return t.length ? t.join("; ") : "None";
}

function validStep(id){
  switch(id){
    case "app":    return !!(S.app && S.area && press().ok && temps().ok);
    case "gas":    return !!(S.gas && S.cal && gasCode() && S.vel && S.comp);
    case "probe":  return !!(S.model && S.len && dia() && S.sens && S.supp && S.mount && S.flange && uState().ok);
    case "elec":   return !!(f1() && S.appr);
    case "extras": return !!S.io;
    default:       return true;
  }
}
const isComplete = () => STEPS.slice(0,-1).every(s => validStep(s.id));

function getNotes(){
  const warn = [], info = [];
  const g = gasObj(), p = press(), t = tInfo(), u = uState(), l = lenObj();
  if (S.app === "other") warn.push("Application to be clarified with you before quotation.");
  if (S.vel === "A") warn.push("Vmax: the maximum calibrated velocity for your gas is set by the manufacturer. Confirm with the manufacturer.");
  if (S.cal === "corr") info.push("Correlation calibration: add ±5% of reading to the accuracy specification.");
  if (S.cal === "lab") info.push("Laboratory calibration is done at your process pressure (feature F10) with high-purity gas, NIST traceable.");
  if (S.gas === "o2") warn.push("Oxygen: you are responsible for making sure the sensor is clean of hydrocarbons and safe for oxygen use.");
  if (S.gas === "bin" || S.gas === "multi") warn.push("Please give the gas composition(s) in the notes. Contact Kurz Sales Support if hydrogen is part of a mix.");
  if (S.gas === "cair" && S.cal === "corr") info.push("Compressed air correlation (0M) is correlated up to 70,000 SFPM.");
  if (["3","4"].includes(S.comp) && g && !["air","cair"].includes(g.id)) info.push("Velocity-temperature mapping is based on air; specific gas correlations are needed for accuracy at high temperatures.");
  if (hht() && !isPurge()) info.push(`High-temperature (HHT) model selected${t && t.mc > 260 ? " because your highest temperature is above 260 °C" : S.supp === "8" ? " because the PTFE-coated support is for HHT models" : ""}.`);
  if (hht() && l && l.inch <= 6) warn.push("HHT models need at least 8″ between the enclosure and the mounting point (L2). A 6″ probe is to be confirmed with the manufacturer.");
  if (flanged() && u.ok && uMax() !== null && u.v > uMax() + 0.005) warn.push(`U dimension ${u.v}″ looks long for a ${l.inch}″ probe (L = L2 + U − ${isPurge() ? "0.98" : "1.47"}″, L2 at least ${hht() ? "8.00" : "5.00"}″). Confirm the length.`);
  if (isPurge()){
    if (p.ok && p.psig > 1) warn.push("The 454PFTB is designed for air at ambient pressure. Your process pressure is to be confirmed.");
    info.push("454PFTB: the Model 146 cleaning system needs instrument-quality compressed air at 60 to 125 psig (average use below 0.125 SCFM). Canadian Registration (CRN) is not available for this model.");
    if (S.io === "B") warn.push("The purge cycle uses the meter's relays; the Standard I/O option has no relays. To be confirmed.");
  }
  if (S.app === "epa" && S.io === "B") warn.push("EPA zero-mid-span drift checks are usually started by a contact closure on a digital input; the Standard I/O option has no digital inputs (Modbus or a timed check can also start it). To be confirmed.");
  if (S.area === "z1") info.push("Division 1 approvals cover Groups B, C and D (gas group IIB + H2). Group A (acetylene) is not covered.");
  if (S.appr === "D") info.push("With the polycarbonate transmitter (approval D) only the probe may sit in Zone 1 / Division 1; the transmitter goes in Zone 2 / Division 2 or a safe area, ambient −25 to 50 °C.");
  if (S.loc === "remote") info.push("Remote electronics: the 5-conductor shielded cable between probe and transmitter runs in rigid conduit or as cable with a perimeter-bonded shield.");
  if (S.mount === "noflange") info.push("Mounting hardware such as compression fittings, packing glands or ball valves is quoted separately: tick it in the next step.");
  if (p.ok && S.pUnit !== "psia") info.push(`Process pressure converted to ${Math.round(p.psia)} PSIA with a sea-level atmosphere (14.7 psi). Tell us if the site is at high altitude.`);
  info.push("All 4-20 mA outputs follow NAMUR NE43. Every meter has a built-in zero-mid-span drift check, totalizers and USB / Modbus access.");
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
const offRadios = (name, list, why, meta) => list.map(o => { const w = why(o); return optHtml({ name, value:o.id, checked:S[name]===o.id, title:o.title, desc:w || o.desc, badge:o.badge, meta:meta ? meta(o) : null, off:!!w }); }).join("");
const unitRow = (name, list) => `<div class="opts opts--inline" style="margin-top:12px">${list.map(o => optHtml({ name, value:o.id, checked:S[name]===o.id, title:o.title })).join("")}</div>`;
const inv = bad => bad ? ' aria-invalid="true"' : "";

/* =====================================================================
   STEP VIEWS
   ===================================================================== */
const VIEWS = {
  app(){
    const p = press(), t = temps();
    return `<div class="step">
      ${head(1,"Where will the 454FTB measure?","The 454FTB is a single-point insertion meter for industrial gas flow. Tell us about the application and the process conditions.")}
      ${group("What is the application?", null, radios("app", APPS))}
      ${group("Hazardous area classification", "Where the meter is installed.", radios("area", AREAS))}
      <div class="group"><div class="group__title">Normal process pressure</div><div class="group__sub">Up to 300 psig (20 bar g). Choose the unit, then enter the value.</div>${unitRow("pUnit", P_UNITS)}
        <div class="inline-field"><label class="field"><span class="l">Process pressure (${esc(byId(P_UNITS,S.pUnit).title)})</span><input id="pVal" type="text" inputmode="decimal" value="${esc(S.pVal)}" placeholder="e.g. 2"${inv(!p.ok && !p.empty)}></label></div></div>
      <div class="group"><div class="group__title">Process temperature</div><div class="group__sub">−40 to 500 °C (−40 to 932 °F). The normal value goes into the calibration; the highest value decides the probe version.</div>${unitRow("tUnit", T_UNITS)}
        <div class="inline-field"><div class="grid2"><label class="field"><span class="l">Normal temperature (${S.tUnit === "C" ? "°C" : "°F"})</span><input id="tNorm" type="text" inputmode="decimal" value="${esc(S.tNorm)}" placeholder="e.g. 77"${inv(!t.ok && !t.empty && t.field === "tNorm")}></label>
        <label class="field"><span class="l">Highest temperature (optional)</span><input id="tMax" type="text" inputmode="decimal" value="${esc(S.tMax)}" placeholder="same as normal"${inv(!t.ok && t.field === "tMax")}></label></div></div></div>
      ${helpHtml("app","Not sure about the area classification?",`<p>Your site's hazardous-area drawing shows the zone or division. If there is no drawing and no flammable gas, choose <strong>ordinary area</strong>.</p><ul><li><strong>Zone 2 / Division 2:</strong> the aluminium enclosure with increased safety (Ex ec) approval.</li><li><strong>Zone 1 / Division 1:</strong> the flameproof (Ex db) aluminium or stainless steel versions, or a probe in Zone 1 with the transmitter outside it.</li></ul><p>Every 454FTB carries cETLus, ATEX and IECEx approvals, so the same meter also suits ordinary areas.</p>`)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  gas(){
    const g = gasObj();
    return `<div class="step">
      ${head(2,"Gas and flow range","The meter is calibrated for your gas and your highest velocity, so it reads accurately from day one.")}
      ${group("Which gas will it measure?", "Each gas has its own calibration.", offRadios("gas", GASES.map(x => ({ ...x, desc:x.note })), () => null, x => [x.lab ? `Lab ${x.lab}` : null, x.corr ? `Correlation ${x.corr}` : null].filter(Boolean).join(" · ")))}
      ${S.gas === "multi" ? group("How many calibration curves?", "Up to five curves are stored in the meter. Each curve may be a mix of up to five gases.", radios("curves", CURVES, c => ({ meta:c.id }))) : ""}
      ${group("Type of calibration", g ? null : "Choose the gas first.", offRadios("cal", CALS, calOffWhy))}
      ${group("Highest gas velocity to calibrate", "Pick the range just above your highest expected velocity.", radios("vel", VELS, v => ({ meta:v.id })))}
      ${group("Temperature compensation", "Options that do not cover your process temperature are greyed out.", offRadios("comp", COMPS, compOffWhy, c => `Option ${c.id}`), "opts--wide")}
      ${helpHtml("gas","How do I find the gas velocity?",`<p>Velocity is the flow divided by the inside area of the pipe or duct. For example, 1,000 SCFM in a 12″ pipe (0.785 ft²) is about 1,270 SFPM. Choose the next range up.</p><p><strong>Laboratory</strong> calibrations use the real gas and are NIST traceable. <strong>Correlation</strong> calibrations use air and proven correlation factors; they are quicker but add ±5% of reading to the accuracy.</p><p><strong>Velocity-temperature mapping</strong> stores several calibrations at different temperatures: choose it when the temperature changes a lot, for example in stacks and combustion air.</p>`)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  probe(){
    const u = uState(), um = uMax();
    return `<div class="step">
      ${head(3,"The probe","Choose the probe that fits your pipe or duct and the way it is mounted.")}
      ${group("Which probe type?", null, offRadios("model", MODELS, modelOffWhy), "opts--wide")}
      ${group("Probe support length", "From the enclosure to the sensor tip: long enough to reach the measuring point in your duct plus the mounting.", offRadios("len", LENGTHS, lenOffWhy, l => l.id))}
      ${group("Probe diameter", "Longer probes need a stiffer, larger diameter.", offRadios("dia", DIAS, diaOffWhy, d => `-${d.id}`))}
      ${group("Sensor material", null, radios("sens", SENSMATS, m => ({ meta:m.id })))}
      ${group("Probe support material", null, offRadios("supp", SUPPMATS, suppOffWhy, m => m.id))}
      ${group("How is the probe mounted?", null, radios("mount", MOUNTS), "opts--wide")}
      ${flanged() ? `<div class="group"><div class="group__title">Flange size</div><div class="group__sub">ANSI B16.5 flanges that fit your probe diameter.</div><div class="opts">${offRadios("flange", FLANGES.filter(f => f.id !== "A"), flangeOffWhy, f => f.id)}</div>
        <div class="inline-field"><label class="field"><span class="l">U dimension: flange face to sensor centre, inches${um !== null && um > 0 ? ` (about ${um.toFixed(1)}″ max. for this probe)` : ""}</span><span class="unit-input"><input id="uDim" type="text" inputmode="decimal" value="${esc(S.uDim)}" placeholder="e.g. 7.7"${inv(!u.ok && !u.empty)}><em>in</em></span></label></div></div>` : ""}
      ${helpHtml("probe","Which length and mounting do I need?",`<p>The sensor usually sits near the centre of the pipe or at a representative point in the duct. Add the wall thickness, the mounting fitting and the distance to the enclosure (at least 5″, or 8″ for high-temperature HHT models).</p><p>Without a flange, the probe slides through a <strong>compression fitting</strong> or <strong>packing gland</strong>, so you can set the depth on site. A <strong>flange</strong> fixes the depth: the <strong>U dimension</strong> is measured from the flange face to the sensor centre.</p><p>The <strong>air-purge 454PFTB</strong> blows the sensor clean with a short blast of compressed air, for stacks with fly ash and dry dust.</p>`)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  elec(){
    const direct = S.loc === "direct";
    return `<div class="step">
      ${head(4,"Electronics and approvals","Where the transmitter goes, how it is powered and which hazardous-area approval it carries.")}
      ${group("Where should the transmitter be?", null, radios("loc", LOCS), "opts--wide")}
      ${group("Enclosure", null, offRadios("encl", ENCLS, enclOffWhy), "opts--wide")}
      ${group("Power supply", S.encl === "pc" ? "The polycarbonate transmitter takes AC or DC: the same model." : null, radios("power", POWERS))}
      ${group("Display", null, radios("disp", DISPS), "opts--wide")}
      ${direct && S.disp === "yes" ? group("Display orientation", null, radios("orient", ORIENTS)) : ""}
      ${group("Hazardous-area approval", "All versions carry cETLus, ATEX and IECEx approvals.", offRadios("appr", APPRS, apprOffWhy, a => `F9 ${a.id}`), "opts--wide")}
      ${helpHtml("elec","On the probe or remote?",`<p><strong>On the probe</strong> is the simplest: one unit to install. Choose <strong>remote</strong> when the measuring point is hot, vibrating or hard to reach: the transmitter can then be mounted at eye level.</p><p>The <strong>stainless steel</strong> version suits corrosive or washdown areas; the <strong>polycarbonate</strong> wall box is a light, cost-effective remote transmitter.</p>`)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  extras(){
    const hw = HW.filter(h => (!h.remote || S.loc === "remote") && (!h.purge || isPurge()));
    return `<div class="step">
      ${head(5,"Outputs and extras","How the meter talks to your control system, and anything else to include in the quotation.")}
      ${group("Communications and outputs", "USB and Modbus RS-485 (ASCII or RTU) are always included.", radios("io", IOS, o => ({ meta:`F11 ${o.id}` })), "opts--wide")}
      ${group("Safety certification", null, optHtml({ type:"checkbox", name:"sil", value:"1", checked:S.sil, title:"SIL1 certification via TÜV Rheinland", desc:"Adds the letter S to the end of the part number.", meta:"S" }))}
      ${group("Mounting and installation hardware (optional)", "Quoted as separate items. Their part numbers are not in the ordering table, so confirm them with the manufacturer.", hw.map(h => optHtml({ type:"checkbox", name:"hw", value:h.id, checked:S.hw.includes(h.id), title:h.title, desc:h.desc })).join(""))}
      ${helpHtml("extras","Which output option do I need?",`<ul><li><strong>Standard:</strong> two 4-20 mA signals, typically flow and temperature.</li><li><strong>Full:</strong> adds two relays (alarms, pulsed totalizer or purge), two digital inputs (for example to start the EPA drift check) and a 4-20 mA input.</li><li><strong>HART</strong> or <strong>Profibus DP:</strong> digital communication with your control system, plus the relays and inputs.</li></ul><p>A <strong>PID flow-control</strong> function using one 4-20 mA output is also available: mention it in the notes.</p>`)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  review(){
    const rows = summaryRows(true), n = getNotes();
    return `<div class="step">
      ${head(6,"Review your configuration","Check everything below. You can change any answer, then download the PDF or ask for a quotation.")}
      <div class="code-box"><div class="k">Part number</div><div class="v">${esc(partNumber())}</div><div class="s">${codeIsFinal() ? "Built from the parent number and features F1 to F12 of the Kurz ordering table. Illustrative only: confirm with the manufacturer." : "“?” marks a choice we will confirm with you."}</div>
        <div class="code-grid">${[["Parent", parentNo() || "?", modelName() || ""], ...features()].map(([k,v,l]) => `<span><b>${esc(k)} ${esc(v || "?")}</b>${esc(l)}</span>`).join("")}</div></div>
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
        <label class="field"><span class="l">Notes for our team (optional)</span><textarea id="notes" placeholder="e.g. pipe or duct size, flow range, gas composition, tag numbers, delivery date…">${esc(S.notes)}</textarea></label>
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
    const out = [], p = press(), t = temps();
    if (!p.ok && !p.empty) out.push(msg("warn", p.why));
    if (!t.ok && !t.empty) out.push(msg("warn", t.why));
    if (p.ok) out.push(msg("ok", `Process pressure ${Math.round(p.psia)} PSIA: inside the 300 psig rating.`));
    if (t.ok) out.push(msg(t.mc > 260 ? "info" : "ok", t.mc > 260 ? `Highest temperature ${fmtT(t.mc)}: the high-temperature HHT probe (up to 500 °C) will be used.` : `Temperature fits the standard HT probe (up to 260 °C).`));
    if (S.area === "z1") out.push(msg("info","Zone 1 / Division 1: the flameproof versions are offered in step 4."));
    return out.join("");
  },
  gas(){
    const out = [], g = gasObj();
    if (g && g.id === "c4" || g && g.id === "nh3" || g && g.id === "cl2") out.push(msg("info", `${g.title}: correlation calibration only.`));
    if (S.cal && gasCode()) out.push(msg("ok", `Gas calibration code ${gasCode()}.`));
    if (S.gas === "o2") out.push(msg("warn","Oxygen: the sensor must be kept clean of hydrocarbons and safe for oxygen use."));
    if (S.vel === "A") out.push(msg("info","Vmax for your gas: confirm with the manufacturer."));
    const t = tInfo(); if (t && COMPS.every(c => compOffWhy(c))) out.push(msg("warn","No temperature compensation covers your temperature range. Please check the temperatures in step 1 or talk to us."));
    return out.join("");
  },
  probe(){
    const out = [], u = uState();
    if (flanged() && !u.ok && !u.empty) out.push(msg("warn", u.why));
    if (dia()) out.push(msg("ok", `Your model: ${modelName()} (parent number ${parentNo()}).`));
    getNotes().warn.filter(w => /U dimension|HHT models need|ambient pressure/.test(w)).forEach(w => out.push(msg("warn", w)));
    return out.join("");
  },
  elec(){
    const out = [];
    if (f1()) out.push(msg("ok", `Enclosure and power code F1 = ${f1()}.`));
    if (S.appr === "D") out.push(msg("info","Only the probe may sit in Zone 1; mount the polycarbonate transmitter in Zone 2 or a safe area."));
    return out.join("");
  },
  extras(){
    return getNotes().warn.filter(w => /Standard I\/O/.test(w)).map(w => msg("warn",w)).join("");
  }
};

/* =====================================================================
   SUMMARY PANEL
   ===================================================================== */
function summaryRows(forReview){
  const g = i => forReview ? i : null;
  return [
    { k:"Application",      v:byId(APPS,S.app||"")?.title || null, step:g(0) },
    { k:"Area",             v:areaText(), step:g(0) },
    { k:"Process pressure", v:pressText(), step:g(0) },
    { k:"Process temperature", v:tempText(), step:g(0) },
    { k:"Gas",              v:gasText(), step:g(1) },
    { k:"Velocity range",   v:S.vel ? byId(VELS,S.vel).title : null, step:g(1) },
    { k:"Temperature compensation", v:S.comp ? byId(COMPS,S.comp).short : null, step:g(1) },
    { k:"Model",            v:modelName(), step:g(2) },
    { k:"Probe",            v:probeText(), step:g(2) },
    { k:"Materials",        v:S.maxStep > 2 || forReview ? matText() : null, step:g(2) },
    { k:"Mounting",         v:mountText(), step:g(2) },
    { k:"Electronics",      v:elecText(), step:g(3) },
    { k:"Approval",         v:S.appr && S.maxStep > 3 || forReview && S.appr ? byId(APPRS,S.appr).title : null, step:g(3) },
    { k:"Outputs",          v:S.io ? byId(IOS,S.io).title : null, step:g(4) },
    { k:"Extras",           v:S.maxStep > 4 || forReview ? extrasText() : null, step:g(4) },
    { k:"Quantity",         v:S.step >= 5 ? String(S.qty) : null, step:null }
  ];
}
function renderSummary(){
  const m = modelName();
  $("#sumModel").textContent = m ? `Kurz ${m}` : "Series 454FTB flow meter";
  const bits = [gasObj() ? gasObj().title : null, areaText()].filter(Boolean);
  $("#sumSub").textContent = bits.length ? bits.join(" · ") : "Your choices appear here as you go.";
  $("#sumCode").textContent = S.maxStep >= 1 && (S.gas || S.len) ? partNumber() : "";
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
  if (id === "app") return !press().ok || !temps().ok ? "Please enter a valid pressure and temperature." : "Please answer all questions.";
  if (id === "gas") return "Please choose gas, calibration, range and compensation.";
  if (id === "probe") return flanged() && !uState().ok ? "Please choose the flange and enter the U dimension." : "Please answer all probe questions.";
  if (id === "elec") return "Please answer all electronics questions.";
  if (id === "extras") return "Please choose the outputs.";
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
function markInvalid(){
  const p = press(), t = temps(), u = uState();
  const set = (id, bad) => { const el = $("#" + id); if (el){ if (bad) el.setAttribute("aria-invalid","true"); else el.removeAttribute("aria-invalid"); } };
  set("pVal", !p.ok && !p.empty);
  set("tNorm", !t.ok && !t.empty && t.field === "tNorm");
  set("tMax", !t.ok && t.field === "tMax");
  set("uDim", flanged() && !u.ok && !u.empty);
}

/* =====================================================================
   EVENTS
   ===================================================================== */
const RERENDER = { gas:1, cal:0, model:1, len:1, dia:1, supp:1, mount:1, flange:1, loc:1, encl:1, disp:1, power:1, appr:0, pUnit:1, tUnit:1, area:1, comp:1, io:0, curves:0, vel:0, sens:0, orient:0, app:0 };
document.addEventListener("change", e => {
  const t = e.target;
  if (t.type !== "radio" && t.type !== "checkbox") return;
  if (!t.closest("#stage")) return;
  const n = t.name, v = t.value;
  if (n === "hw"){ if (t.checked){ if (!S.hw.includes(v)) S.hw.push(v); } else S.hw = S.hw.filter(x => x !== v); }
  else if (n === "sil") S.sil = t.checked;
  else if (n === "gas" && S.gas !== v){ S.gas = v; S.cal = null; }
  else if (n === "encl" && S.encl !== v){ S.encl = v; S.appr = null; }
  else if (n === "area" && S.area !== v){ S.area = v; if (S.encl === "al") S.appr = null; }
  else S[n] = v;
  constrain();
  S.maxStep = Math.max(S.maxStep, S.step);
  if (RERENDER[n] || n === "hw" || n === "sil"){
    const y = window.scrollY; $("#stage").innerHTML = VIEWS[STEPS[S.step].id](); window.scrollTo(0,y);
    const el = $(`input[name="${n}"][value="${v}"]`); if (el) el.focus({preventScroll:true});
  }
  refresh();
});
document.addEventListener("input", e => {
  const t = e.target;
  if (["pVal","tNorm","tMax","uDim"].includes(t.id)){
    S[t.id] = t.value; constrain();
    if (t.id !== "uDim"){ /* calibration and compensation choices depend on these values */ }
    markInvalid(); refresh();
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
  .replace(/[“”]/g,'"').replace(/[’‘]/g,"'").replace(/™/g,"(TM)").replace(/®/g,"(R)").replace(/²/g,"2").replace(/Ω/g,"ohm")
  .replace(/₂/g,"2").replace(/₄/g,"4").replace(/Ü/g,"U")
  .replace(/\s?°C/g," C").replace(/\s?°F/g," F").replace(/°R/g,"R").replace(/°/g," deg").replace(/±/g,"+/-")
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
  const NAVY = [58,58,60], INK = [69,69,69], GREY = [122,124,128], LINE = [214,218,222], BLUE = [0,97,170], AMBER = [200,120,0];
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
  small("Series 454FTB insertion thermal mass flow meter", W - M, 26.5, { size:8, align:"right" });
  hair(M, 32, W - M);
  y = 42;

  const IW = 24, IH = IW * 380 / 260;
  if (photo) doc.addImage(photo, "JPEG", W - M - IW, y - 6, IW, IH, undefined, "FAST");
  doc.setFont("helvetica","bold"); doc.setFontSize(17); doc.setTextColor(...NAVY);
  const cl = doc.splitTextToSize(code, CW - IW - 8);
  doc.text(cl, M, y + 4);
  let ty = y + 4 + cl.length * 7;
  small(`${modelName()}  |  ${gasText()}`, M, ty, { size:9.5 });
  ty = para("Constant temperature thermal mass flow meter for industrial gases: direct mass flow and temperature, fast response, zero velocity as a valid data point and continuous self-monitoring electronics.", M, ty + 6, CW - IW - 8, { size:8.6, color:GREY });
  small(codeIsFinal() ? "Part number built from the parent number and features F1 to F12; illustrative only, confirm with the manufacturer." : "\"?\" in the part number marks a choice to be confirmed.", M, ty + 1, { size:7.2 });
  y = Math.max(ty + 6, y + IH - 2);

  const R = Object.fromEntries(summaryRows(true).map(r => [r.k, r.v]));
  let yl = section("Application", X1, y, COL), yr = section("Flow meter", X2, y, COL);
  yl = item("Application", R["Application"], X1, yl, COL);
  yl = item("Hazardous area", R["Area"], X1, yl, COL);
  yl = item("Process pressure", R["Process pressure"], X1, yl, COL);
  yl = item("Process temperature", R["Process temperature"], X1, yl, COL);
  yl = item("Gas and calibration", R["Gas"], X1, yl, COL);
  yl = item("Velocity range  |  compensation", `${R["Velocity range"]}  |  ${R["Temperature compensation"]}`, X1, yl, COL);
  yr = item("Model  |  quantity", `${R["Model"]} (${parentNo()})  |  ${S.qty} pcs`, X2, yr, COL);
  yr = item("Probe", R["Probe"], X2, yr, COL);
  yr = item("Materials", R["Materials"], X2, yr, COL);
  yr = item("Mounting", R["Mounting"], X2, yr, COL);
  yr = item("Electronics", R["Electronics"], X2, yr, COL);
  yr = item("Approval", R["Approval"], X2, yr, COL);
  y = Math.max(yl, yr) + 3;

  need(40);
  y = section("Outputs and extras", M, y, CW);
  yl = item("Communications and I/O", R["Outputs"], X1, y, COL);
  yr = item("Certification and hardware", R["Extras"], X2, y, COL);
  y = Math.max(yl, yr) + 3;

  const fs = [["Parent", parentNo(), modelName()], ...features()];
  need(12 + Math.ceil(fs.length / 2) * 6);
  y = section("Ordering code breakdown", M, y, CW);
  const half = Math.ceil(fs.length / 2);
  yl = y; yr = y;
  fs.forEach(([k, v, l], i) => { const x = i < half ? X1 : X2, yy = i < half ? yl : yr;
    small(`${k}`, x, yy, { size:7.5, bold:true, color:BLUE }); small(v || "?", x + 13, yy, { size:8.4, bold:true, color:NAVY }); small(l, x + 30, yy, { size:7.5 });
    if (i < half) yl += 5.2; else yr += 5.2; });
  y = Math.max(yl, yr) + 3;

  const n = getNotes();
  /* full-width lists so long notes break cleanly across pages */
  const list = (title, items, color) => { need(20); y = section(title, M, y, CW); items.forEach(t => { need(10); y = bullet(t, M, y + .6, CW, color) + .2; }); y += 3; };
  if (n.warn.length) list("Points we will check with you", n.warn, AMBER);
  if (S.notes.trim()){ need(22); y = section("Your notes", M, y, CW); y = para(S.notes.trim(), M, y, CW, { size:8.8 }) + 3; }
  list("Good to know", n.info, BLUE);

  const halfS = Math.ceil(SPECS.length / 2);
  need(10 + halfS * 12);
  y = section("Technical data (from the Kurz 454FTB technical specifications)", M, y + 1, CW);
  yl = y; yr = y;
  SPECS.forEach(([k, v], i) => { if (i < halfS) yl = compact(k, v, X1, yl, COL); else yr = compact(k, v, X2, yr, COL); });

  const pages = doc.getNumberOfPages();
  doc.setPage(pages);
  small("Demo only, not for ordering. Illustrative: confirm all specifications with the manufacturer. Source: Kurz technical specifications, document 367551M.", M, 280.5, { size:6.8 });
  for (let p = 1; p <= pages; p++){
    doc.setPage(p); hair(M, 284, W - M);
    small("Unofficial demo by SwiftyQuote  |  sales@swiftyquote.com  |  Not affiliated with Kurz", M, 289, { size:6.8 });
    small(`${p} / ${pages}`, W - M, 289, { size:7, align:"right" });
  }
  return doc;
}
const pdfName = () => `Kurz_454FTB_${partNumber().replace(/\?/g,"x")}_${S.ref}.pdf`;
async function downloadPdf(){
  if (!isComplete()){ toast("Please complete all steps first."); return; }
  const btns = $$("#btnPdf,#doneDownload"); btns.forEach(b => b.disabled = true);
  try {
    const logo = null;
    const photo = await loadImg(IMG.M, 260, 380).catch(() => null);
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
  out.push(`Ordering features: ${[["Parent", parentNo()], ...features()].map(([k,v]) => `${k} ${v || "?"}`).join(", ")}`);
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
    `Quotation request | Series 454FTB insertion thermal mass flow meter | Ref. ${S.ref}`, "",
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
  $("#faqCta").href = `mailto:${DEMO_CONTACT.email}?subject=${encodeURIComponent("Configurator enquiry (from the Kurz Instruments demo)")}`;
  $("#faqContact").innerHTML = `Or write to <a href="mailto:${DEMO_CONTACT.email}">${DEMO_CONTACT.email}</a> · <a href="${DEMO_CONTACT.site}" target="_blank" rel="noopener">swiftyquote.com</a>`;
})();

window.__cfg = { get S(){ return S; }, set S(v){ S = v; }, newState, go, partNumber, features, parentNo, modelName, getNotes, buildPdf, buildMailto, quoteText, isComplete, renderStep, constrain, validStep, calOffWhy, compOffWhy, lenOffWhy, diaOffWhy, suppOffWhy, flangeOffWhy, apprOffWhy, enclOffWhy, modelOffWhy, f1, press, temps };
renderStep(false);
