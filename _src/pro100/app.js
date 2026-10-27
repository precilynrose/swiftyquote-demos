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
    a:"<p>The product data and photos belong to Proteus and are used here for demonstration only. This page is not an official Proteus tool and you cannot place orders on it. Please contact Proteus directly for real enquiries about the 100 Series.</p>" },
  { q:"Can you build this for my own products?",
    a:"<p>Yes. The configurator is built around your product range, your options and your rules, and it takes on your branding: your logo, colours and fonts. It works for anything a buyer has to specify before they can get a quote, such as model, power, approvals, outputs or accessories.</p>" },
  { q:"What do you need from me to get started?",
    a:"<ul><li>A link to the product page, or the datasheets and catalogue.</li><li>Your logo and brand guidelines (or we take them from your website).</li><li>The options a buyer can choose, and any rules, such as which combinations are possible or which approvals apply.</li><li>The email address (or system) where quotation requests should go.</li></ul>" },
  { q:"How much does it cost?",
    a:"<p>The price depends on how many products and options are covered, whether you need extra languages, and whether it should connect to your other systems. We give you a fixed quote after a short conversation, so there are no surprises.</p><p>Write to <a href=\"mailto:sales@swiftyquote.com?subject=Configurator%20price%20enquiry\">sales@swiftyquote.com</a> with a link to your product and we will come back with a price.</p>" },
  { q:"How long does implementation take?",
    a:"<p>The timeline depends on the size of your range and the features you choose. A single-product configurator like this one is quicker than a full catalogue with several product families. You receive a clear timeline together with your quote, and you see a first working version early so you can give feedback before we finish.</p>" },
  { q:"Can it use our branding and languages?",
    a:"<p>Yes. This demo already follows the Proteus colours and fonts. Your version follows yours. Additional languages can be added.</p>" },
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



const IMG = { MAIN:"__IMG_MAIN__" };
const LOGO_URL = "";

/* =====================================================================
   PRODUCT DATA
   Source: Proteus Industries "100 Series Flow Switches" product data sheet 100DS Rev 005 01/2019 (p2 "Flow Ranges,
   Connections, and Model Numbers", "Temperature and Pressure Limits"; p3 specifications), the 100 Series Technical
   Reference Manual 100TRM Rev 003 01/2019 (materials table, other wetted materials, selectable flow range models,
   factory trip point), the U.S. price list 100PL Rev 010 08/2023 (standard model numbers incl. SAE "A" versions)
   and the product page (add-on options: brass / stainless steel faceplate, custom trip point).
   Model number: [base 0100/0104/0101/0105/0103/0150/0155/0160/0170][body C (L on 0104) / P / B / SS][A = SAE ports][24 / 110]
   e.g. 0103SS24, 0101SSA24, 0104L24, 0155B110
   Faceplate, rotor shaft and O-ring options and the factory trip point have no published code.
   ===================================================================== */
const LPM_PER_GPM = 3.785;
const LIQUIDS = [
  { id:"water",  title:"Cooling water",                 desc:"Chiller, tower or city water cooling a machine, laser or furnace.", badge:"Most common" },
  { id:"glycol", title:"Water-glycol coolant",          desc:"Antifreeze mixtures in closed cooling loops." },
  { id:"di",     title:"Deionised or process water",    desc:"e.g. cooling for lasers, RF generators or semiconductor tools." },
  { id:"oil",    title:"Oil or another thicker liquid", desc:"Up to 120 cSt at operating temperature." },
  { id:"chem",   title:"A chemical or another liquid",  desc:"Tell us the liquid and we will check the materials." },
  { id:"gas",    title:"Air or another gas",            desc:"", off:"The 100 Series is a liquid flow switch. It is not for air or gas." }
];
const TEMPS = [
  { id:"t70",  rank:1, title:"Up to 70 °C (158 °F)",     desc:"All body materials possible.", badge:"Most common" },
  { id:"t75",  rank:2, title:"70 to 75 °C (158 to 167 °F)", desc:"Celcon®, brass or stainless steel body." },
  { id:"t85",  rank:3, title:"75 to 85 °C (167 to 185 °F)", desc:"Brass or stainless steel body." },
  { id:"t100", rank:4, title:"85 to 100 °C (185 to 212 °F)", desc:"Brass or stainless steel body; electronics mounted away from the sensor." },
  { id:"hot",  rank:5, title:"Above 100 °C (212 °F)", desc:"", off:"Above the 100 °C / 212 °F limit of every 100 Series body." },
  { id:"unk",  rank:1, title:"Not sure",                 desc:"We will check it with you." }
];
const PRESSURES = [
  { id:"p75",  rank:1, title:"Up to 5.2 bar (75 psi)",       desc:"All body materials possible.", badge:"Most common" },
  { id:"p100", rank:2, title:"5.2 to 6.9 bar (75 to 100 psi)", desc:"Brass or stainless steel body." },
  { id:"p250", rank:3, title:"6.9 to 17.2 bar (100 to 250 psi)", desc:"Brass or stainless steel body with a metal faceplate." },
  { id:"high", rank:4, title:"Above 17.2 bar (250 psi)", desc:"", off:"Above the 1724 kPa / 250 psi limit of the 100 Series (metal faceplate)." },
  { id:"unk",  rank:1, title:"Not sure",                 desc:"We will check it with you." }
];
const UNITS = [
  { id:"LPM", title:"Litres per minute (LPM)" },
  { id:"GPM", title:"US gallons per minute (GPM)" }
];
/* flow ranges for water at 25 °C (data sheet p2); sae = SAE straight-thread version in the 2023 price list (stainless steel only) */
const RANGES = [
  { id:"0104", lpm:[0.2,2.3], gpm:[0.06,0.6], port:"1/4″ FNPT" },
  { id:"0101", lpm:[0.4,3.8], gpm:[0.1,1.0],  port:"1/4″ FNPT", sae:"9/16-18 SAE" },
  { id:"0105", lpm:[1.9,9.5], gpm:[0.5,2.5],  port:"1/4″ FNPT", sae:"9/16-18 SAE" },
  { id:"0103", lpm:[3.0,23],  gpm:[0.8,6.0],  port:"1/4″ FNPT", sae:"9/16-18 SAE" },
  { id:"0150", lpm:[5.7,45],  gpm:[1.5,12],   port:"1/2″ FNPT", sae:"3/4-16 SAE" },
  { id:"0155", lpm:[15,76],   gpm:[4.0,20],   port:"1/2″ FNPT" },
  { id:"0160", lpm:[23,114],  gpm:[6.0,30],   port:"3/4″ FNPT", sae:"1 1/16-12 SAE", noCelcon:true },
  { id:"0170", lpm:[38,227],  gpm:[10,60],    port:"1″ FNPT", noCelcon:true },
  { id:"0100", lpm:[0.4,23],  gpm:[0.1,6.0],  port:"1/4″ FNPT", selectable:true }
];
/* selectable-range 0100 models: configuration set by the position of two blanking plugs (manual p7) */
const CONFIGS = [
  { id:"101", lpm:[0.4,3.8], gpm:[0.1,1.0], ports:"In A, out B, plugs D and C" },
  { id:"105", lpm:[1.9,9.5], gpm:[0.5,2.5], ports:"In B, out C, plugs A and D; induction coil connections reversed" },
  { id:"103", lpm:[3.0,23],  gpm:[0.8,6.0], ports:"In D, out C, plugs A and B" }
];
const MATS = [
  { id:"C",  title:"Celcon® (acetal)",     desc:"Economical plastic body. Up to 75 °C and 75 psi." },
  { id:"P",  title:"Polypropylene",        desc:"Plastic body for many chemicals. Up to 70 °C and 75 psi." },
  { id:"B",  title:"Brass",                desc:"Up to 100 °C; 100 psi with the clear faceplate, 250 psi with a metal faceplate.", badge:"Popular" },
  { id:"SS", title:"316 stainless steel",  desc:"Up to 100 °C; 100 psi with the clear faceplate, 250 psi with a metal faceplate." }
];
const CONNS = [
  { id:"NPT", title:"Female NPT threads",           badge:"Standard" },
  { id:"SAE", title:"SAE straight-thread O-ring ports", desc:"Listed for stainless steel models only." }
];
const FACES = [
  { id:"PS", title:"Clear polysulfone",  desc:"You can see the rotor turning at a glance.", badge:"Standard" },
  { id:"MB", title:"Brass faceplate",    desc:"Raises the operating pressure limit to 1724 kPa / 250 psi." },
  { id:"MS", title:"Stainless steel faceplate", desc:"Raises the operating pressure limit to 1724 kPa / 250 psi." }
];
const SHAFTS = [
  { id:"SS",  title:"316 stainless steel", badge:"Standard" },
  { id:"ALU", title:"Alumina (ceramic)",   desc:"Optional rotor shaft material." }
];
const ORINGS = [
  { id:"BUNA",  title:"Buna-N (nitrile)", desc:"Water, coolants and oils.", badge:"Standard" },
  { id:"VITON", title:"Viton® (FKM)",     desc:"Optional." },
  { id:"EPDM",  title:"EPDM",             desc:"Optional." },
  { id:"SIL",   title:"Silicone rubber",  desc:"Optional." }
];
const POWERS = [
  { id:"24",  title:"24 VDC",  desc:"±10 %, 30 mA. One 5-core cable (0.9 m / 3 ft) for power and relay.", badge:"Most common" },
  { id:"110", title:"120 VAC, 50/60 Hz", desc:"±10 %, 30 mA. 3-core relay cable (0.9 m) and a 1.8 m power cord with 2-pin plug." }
];
const TRIPS = [
  { id:"adj", title:"I will set it on site", desc:"20-turn potentiometer in a recess at the back of the electronics.", badge:"Standard" },
  { id:"fac", title:"Factory-set trip point", desc:"Preset for water with falling flow, unless you tell us otherwise." }
];

const SPECS = [
  ["Principle",        "Paddlewheel flow switch: magnets in the rotor induce a voltage in a coil; the relay drops out when the flow falls below the trip point or stops"],
  ["Flow ranges",      "0.2 to 227 LPM / 0.06 to 60 GPM in 8 fixed ranges plus a selectable-range model (water at 25 C)"],
  ["Process limits",   "Celcon 75 C, polypropylene 70 C, both 75 psi; brass and 316 SS 100 C, 100 psi (clear faceplate) or 250 psi (metal faceplate)"],
  ["Switch",           "SPDT relay, N.O. and N.C. contacts, 3 A at 30 VDC non-inductive; hysteresis typically 15 % of the trip point"],
  ["Power",            "24 VDC +/-10 %, 30 mA or 120 VAC +/-10 %, 30 mA, 50-60 Hz"],
  ["Electrical",       "24 VDC: 5-core cable 0.9 m; 120 VAC: 3-core relay cable 0.9 m plus 1.8 m power cord with 2-pin plug"],
  ["Wetted materials", "Body Celcon, polypropylene, brass or 316 SS; faceplate polysulfone (brass or SS option); rotor PPS; shaft 316 SS (alumina option); O-ring Buna-N (Viton, EPDM, silicone)"],
  ["Other",            "Viscosity up to 120 cSt; pressure drop typically < 41 kPa / 6 psi at maximum flow; electronics max. 50 C; 0.9 to 2.7 kg"]
];

/* =====================================================================
   STATE
   ===================================================================== */
const STEPS = [
  { id:"app",   label:"Liquid & conditions" },
  { id:"flow",  label:"Flow range" },
  { id:"body",  label:"Body & ports" },
  { id:"opts",  label:"Faceplate & seals" },
  { id:"power", label:"Power & trip point" },
  { id:"review",label:"Review" }
];
const $ = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => [...el.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const byId = (arr,id) => arr.find(x => x.id === id);

function newState(){
  return { step:0, maxStep:0, liquid:null, temp:null, pressure:null, units:null, nominal:"",
           range:null, config:null, mat:null, conn:null, face:null, shaft:null, oring:null,
           power:null, trip:null, tripVal:"", qty:1, notes:"", ref:makeRef(), helpOpen:{} };
}
function makeRef(){
  const d = new Date(), p = n => String(n).padStart(2,"0");
  const rnd = Math.random().toString(36).slice(2,6).toUpperCase();
  return `PI-${String(d.getFullYear()).slice(2)}${p(d.getMonth()+1)}${p(d.getDate())}-${rnd}`;
}
let S = newState();

/* ---------- numbers ---------- */
const num = s => { const t = String(s).trim().replace(",", "."); return /^\d*\.?\d+$/.test(t) ? parseFloat(t) : NaN; };
const nominalOk = () => S.nominal.trim() === "" || num(S.nominal) > 0;
const toLpm = v => S.units === "GPM" ? v * LPM_PER_GPM : v;
const nomLpm = () => { const v = num(S.nominal); return v > 0 && S.units ? toLpm(v) : null; };
const unitRange = r => S.units === "GPM" ? r.gpm : r.lpm;
const nf = v => v < 10 ? v.toFixed(v < .1 ? 2 : 1) : String(v);
const rangeTxt = r => `${nf(r.lpm[0])}–${nf(r.lpm[1])} LPM / ${nf(r.gpm[0])}–${nf(r.gpm[1])} GPM`;
const curRange = () => { const r = byId(RANGES, S.range || ""); if (!r) return null; if (r.selectable){ const c = byId(CONFIGS, S.config || ""); return c ? { ...r, lpm:c.lpm, gpm:c.gpm } : r; } return r; };
const tripOk = () => {
  if (S.trip !== "fac") return true;
  const v = num(S.tripVal), r = curRange();
  if (!(v > 0)) return false;
  if (!r || !S.units) return true;
  const [lo, hi] = unitRange(r);
  return v > lo && v < hi;
};

/* ---------- rules (data sheet 100DS p2, manual 100TRM, price list 100PL) ---------- */
const tRank = () => (byId(TEMPS, S.temp || "") || {}).rank || 0;
const pRank = () => (byId(PRESSURES, S.pressure || "") || {}).rank || 0;
function fitWhy(lpm){
  const n = nomLpm(); if (n == null) return null;
  if (n > lpm[1]) return `Your normal flow (${S.nominal.trim()} ${S.units}) is above the maximum of this range.`;
  if (n <= lpm[0]) return `Your normal flow (${S.nominal.trim()} ${S.units}) is at or below the minimum of this range.`;
  return null;
}
const goodFit = lpm => { const n = nomLpm(); return n != null && n >= .4 * lpm[1] && n <= .7 * lpm[1] && n >= lpm[0] + .2 * (lpm[1] - lpm[0]); };
function rangeOffWhy(r){
  if (r.selectable) return CONFIGS.every(c => fitWhy(c.lpm)) ? fitWhy(r.lpm) || "Your normal flow does not suit any of the three selectable ranges." : null;
  return fitWhy(r.lpm);
}
const configOffWhy = c => fitWhy(c.lpm);
function matOffWhy(o){
  const r = byId(RANGES, S.range || "");
  if (o.id === "C" && r && r.noCelcon) return "Celcon is not available for the 3/4″ and 1″ models (0160, 0170).";
  if ((o.id === "C" || o.id === "P") && pRank() >= 2) return "Plastic bodies are rated to 517 kPa / 75 psi.";
  if (o.id === "C" && tRank() >= 3) return "Celcon is rated to 75 °C / 167 °F.";
  if (o.id === "P" && tRank() >= 2) return "Polypropylene is rated to 70 °C / 158 °F.";
  return null;
}
function connOffWhy(o){
  if (o.id !== "SAE") return null;
  const r = byId(RANGES, S.range || "");
  if (S.mat !== "SS") return "SAE ports are listed only for 316 stainless steel bodies.";
  if (r && !r.sae) return "No SAE version is listed for this flow range (listed: 0101, 0103, 0105, 0150, 0160).";
  return null;
}
function faceOffWhy(o){
  const plastic = S.mat === "C" || S.mat === "P";
  if (o.id === "PS" && pRank() === 3) return "The clear faceplate is rated to 689 kPa / 100 psi. Above 100 psi a metal faceplate is needed.";
  if (o.id !== "PS" && plastic) return "Metal faceplates are only for brass or stainless steel bodies.";
  return null;
}
function tripOffWhy(o){
  if (o.id === "fac" && S.range === "0100") return "Not available on the selectable-range 0100 models.";
  return null;
}
const offWhy = { range:rangeOffWhy, config:configOffWhy, mat:matOffWhy, conn:connOffWhy, face:faceOffWhy, trip:tripOffWhy };
const LISTS = { range:RANGES, config:CONFIGS, mat:MATS, conn:CONNS, face:FACES, trip:TRIPS };
function constrain(){
  if (S.liquid && byId(LIQUIDS, S.liquid).off) S.liquid = null;
  if (S.range !== "0100") S.config = null;
  ["range","config","mat","conn","face","trip"].forEach(k => { if (S[k] && offWhy[k](byId(LISTS[k], S[k]))) S[k] = null; });
  if (S.trip !== "fac") S.tripVal = "";
}

/* ---------- derived values ---------- */
function matCode(){ if (!S.mat) return "?"; if (S.mat === "C") return S.range === "0104" ? "L" : "C"; return S.mat; }
function partNumber(){
  return `${S.range || "01??"}${matCode()}${S.conn === "SAE" ? "A" : ""}${S.power || "?"}`;
}
const codeIsFinal = () => !partNumber().includes("?");
function rangeText(){
  const r = byId(RANGES, S.range || ""); if (!r) return null;
  if (!r.selectable) return `${rangeTxt(r)} (${r.id})`;
  const c = byId(CONFIGS, S.config || "");
  return `Selectable (0100)${c ? `, set to ${rangeTxt(c)} (configuration ${c.id})` : ""}`;
}
function portSize(){
  const r = byId(RANGES, S.range || ""); if (!r) return null;
  if (S.conn === "SAE") return r.sae;
  if (r.id === "0103" && S.mat === "P") return "1/4″ FNPT (manual lists 3/8″ FNPT for 0103P)";
  return r.port;
}
function connText(){ if (!S.conn) return null; const p = portSize(); return S.conn === "SAE" ? `SAE straight thread${p ? `, ${p}` : ""}` : (p || "Female NPT"); }
const matText = () => byId(MATS, S.mat || "")?.title || null;
const faceText = () => byId(FACES, S.face || "")?.title || null;
const shaftText = () => byId(SHAFTS, S.shaft || "")?.title || null;
const oringText = () => byId(ORINGS, S.oring || "")?.title || null;
const powerText = () => byId(POWERS, S.power || "")?.title || null;
function tripText(){
  if (!S.trip) return null;
  if (S.trip === "adj") return "Adjustable on site";
  return `Factory-set${S.tripVal.trim() && tripOk() ? ` at ${S.tripVal.trim()} ${S.units || ""} (falling flow)` : ""}`;
}
const nominalText = () => S.units ? (S.nominal.trim() && nominalOk() ? `${S.nominal.trim()} ${S.units}` : "To be advised") : null;
const extrasChosen = () => (S.face && S.face !== "PS") || S.shaft === "ALU" || (S.oring && S.oring !== "BUNA") || S.trip === "fac";
function extrasText(){
  const x = [];
  if (S.face && S.face !== "PS") x.push(faceText());
  if (S.shaft === "ALU") x.push("alumina rotor shaft");
  if (S.oring && S.oring !== "BUNA") x.push(`${oringText()} O-ring`);
  if (S.trip === "fac") x.push(`factory-set trip point${S.tripVal.trim() && tripOk() ? ` at ${S.tripVal.trim()} ${S.units || ""}` : ""}`);
  return x.join(", ");
}

function validStep(id){
  switch(id){
    case "app":   return !!(S.liquid && S.temp && S.pressure && S.units && nominalOk());
    case "flow":  return !!(S.range && (S.range !== "0100" || S.config));
    case "body":  return !!(S.mat && S.conn);
    case "opts":  return !!(S.face && S.shaft && S.oring);
    case "power": return !!(S.power && S.trip && tripOk());
    default:      return true;
  }
}
const isComplete = () => STEPS.slice(0,-1).every(s => validStep(s.id));

function getNotes(){
  const warn = [], info = [];
  const r = curRange(), n = nomLpm();
  if (S.liquid === "oil") warn.push("Flow ranges and trip points are for water at 25 °C. With oil or another thicker liquid (up to 120 cSt) the flow response differs: range and trip point to be confirmed with the manufacturer.");
  if (S.liquid === "glycol") warn.push("Flow ranges are for water at 25 °C. With a water-glycol mix the trip point may differ slightly: tell us the mix ratio.");
  if (S.liquid === "chem") warn.push("Chemical compatibility of the body, faceplate, rotor (PPS) and O-ring with your liquid to be confirmed with the manufacturer.");
  if (S.liquid === "chem" && S.face === "PS") warn.push("The manual warns that solvent vapours can crack the clear polysulfone faceplate. Faceplate material to be confirmed for your liquid.");
  if (S.temp === "unk") warn.push("Liquid temperature to be confirmed (Celcon to 75 °C, polypropylene to 70 °C, brass and stainless steel to 100 °C).");
  if (S.temp === "t100") warn.push("Above 85 °C / 185 °F the manual says the electronics should be mounted away from the flow sensor. Remote mounting has no code in the model number: to be confirmed with the manufacturer.");
  if (S.pressure === "unk") warn.push("Operating pressure to be confirmed (plastic bodies 75 psi, metal bodies 100 psi with the clear faceplate, 250 psi with a metal faceplate).");
  if (r && n != null && !rangeOffWhy(byId(RANGES, S.range))){
    if (n < r.lpm[0] + .2 * (r.lpm[1] - r.lpm[0])) warn.push("Your normal flow is in the bottom 20 % of this range, so the trip point would sit close to both your normal flow and the bottom of the range. A smaller range may suit better.");
    else if (n > .8 * r.lpm[1]) warn.push("Your normal flow is close to the top of this range. The manufacturer recommends a normal flow of about 50 to 60 % of the upper limit; a larger range may suit better.");
  }
  if (S.range === "0100") warn.push("The 0100 models are set to one of three ranges by the position of two blanking plugs. Whether the factory presets your configuration is to be confirmed; it can also be changed on site.");
  if (S.mat === "P") warn.push("Polypropylene models are in the data sheet (Rev 005, 2019) but not in the U.S. price list (Rev 010, 2023): availability to be confirmed with the manufacturer.");
  if (S.mat === "P" && S.range === "0103") warn.push("Port size for 0103P: the data sheet lists 1/4″ FNPT, the manual 3/8″ FNPT. To be confirmed.");
  if (S.conn === "SAE" && S.power === "110") warn.push("The price list shows SAE versions only with 24 VDC (e.g. 0101SSA24). The 120 VAC SAE version is to be confirmed.");
  if (S.face && S.face !== "PS" && S.mat && ((S.face === "MB") !== (S.mat === "B"))) warn.push(`${faceText()} on a ${matText().toLowerCase()} body: mixing faceplate and body metals to be confirmed with the manufacturer.`);
  if (extrasChosen()) warn.push(`Options without a published code (${extrasText()}): listed on the product page or in the manual and added to the order as separate items. Ordering details to be confirmed with the manufacturer.`);
  if (S.trip === "fac" && n != null && num(S.tripVal) > 0 && toLpm(num(S.tripVal)) > .9 * n) warn.push("The trip point should be at least 10 % below your normal flow rate.");
  if (S.mat === "C" && S.range === "0104") info.push("The Celcon version of the 0.2–2.3 LPM model is coded 0104L…, as in the data sheet and price list.");
  if (S.range === "0100" && S.config === "105") info.push("Configuration 105 also needs the two induction-coil wires swapped (white to B, black to W), as shown in the manual.");
  if (S.mat === "C" || S.mat === "P") info.push("Use plastic fittings in Celcon or polypropylene bodies, not metal ones, and do not over-tighten mounting screws.");
  if (S.power === "24") info.push("24 VDC wiring: brown +24 V, white 0 V, red N.O., green N.C., black relay common.");
  if (S.power === "110") info.push("120 VAC version: relay wires red N.O., green N.C., black common; power through the 2-pin plug.");
  info.push("Fail-safe: if the rotor is blocked or the liquid stops, the relay drops out. Relay SPDT, 3 A at 30 VDC; hysteresis typically 15 % of the trip point.");
  info.push("Install with at least 10 pipe diameters of straight pipe upstream, ideally in a horizontal line with the faceplate vertical.");
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
const ruled = (name, list, why, meta) => radios(name, list, o => { const w = why(o); return { desc:w || o.desc, off:!!w, meta:meta ? meta(o) : null }; });
const textField = (id, label, val, ph) => `<div class="inline-field"><label class="field"><span class="l">${esc(label)}</span><input id="${id}" type="text" inputmode="decimal" value="${esc(val)}" placeholder="${esc(ph)}" autocomplete="off"></label></div>`;

/* =====================================================================
   STEP VIEWS
   ===================================================================== */
const VIEWS = {
  app(){
    return `<div class="step">
      ${head(1,"Your liquid and conditions","The 100 Series watches a liquid flow, often cooling water, and trips a relay when the flow drops too low.")}
      ${group("What flows through the switch?", null, ruled("liquid", LIQUIDS, o => o.off || null))}
      ${group("Highest liquid temperature", "This decides which body materials are possible.", ruled("temp", TEMPS, o => o.off || null))}
      ${group("Highest operating pressure", null, ruled("pressure", PRESSURES, o => o.off || null))}
      ${group("Which flow units do you use?", "Then enter your normal flow rate below. We use it to suggest a flow range.", radios("units", UNITS), "opts--wide")}
      ${textField("nominal", `Normal flow rate${S.units ? ` in ${S.units}` : ""} (optional)`, S.nominal, S.units === "GPM" ? "e.g. 2.5" : "e.g. 8")}
      ${helpHtml("app","Why does the flow switch care about temperature and pressure?",`<p>Each body material has its own limits: Celcon® to 75 °C, polypropylene to 70 °C, both to 75 psi; brass and stainless steel to 100 °C and 100 psi with the clear faceplate, or 250 psi with a metal faceplate. Ask us if you are not sure.</p>`)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  flow(){
    const meta = r => r.selectable ? "0100" : r.id;
    const rlist = RANGES.map(r => ({ ...r, title:r.selectable ? "Selectable range (0.4–23 LPM / 0.1–6.0 GPM)" : rangeTxt(r),
      desc:r.selectable ? `One of three ranges, set with blanking plugs. ${r.port}.` : r.port, badge:!r.selectable && goodFit(r.lpm) ? "Good fit for your flow" : null }));
    const clist = CONFIGS.map(c => ({ ...c, title:rangeTxt(c), desc:c.ports, badge:goodFit(c.lpm) ? "Good fit for your flow" : null }));
    return `<div class="step">
      ${head(2,"Flow range","Choose a range where your normal flow sits around 50 to 60 % of the upper limit.")}
      ${group("Which flow range?", nomLpm() != null ? `Your normal flow: ${S.nominal.trim()} ${S.units}. Ranges are for water at 25 °C.` : "Ranges are for water at 25 °C.", ruled("range", rlist, rangeOffWhy, meta))}
      ${S.range === "0100" ? group("Which range should the selectable model be set to?", null, ruled("config", clist, configOffWhy, c => c.id)) : ""}
      ${helpHtml("flow","How do I pick the right range?",`<p>The manufacturer's rule of thumb: your normal flow should be about 50 to 60 % of the upper limit, your highest flow below the upper limit, and your trip point above the lower limit. The trip point is usually set at least 10 % below the normal flow.</p><p>The selectable 0100 model covers three ranges in one body; you choose the range with two blanking plugs, which is handy if you are not sure yet or want one spare for several machines.</p>`)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  body(){
    return `<div class="step">
      ${head(3,"Body material and ports","The flow body is in contact with your liquid.")}
      ${group("Flow body material", "Choose the best chemical match for your liquid.", ruled("mat", MATS, matOffWhy, o => o.id === "C" && S.range === "0104" ? "L" : o.id), "opts--wide")}
      ${group("Port type", null, ruled("conn", CONNS.map(c => ({ ...c, desc:c.id === "NPT" ? (byId(RANGES, S.range || "") || {}).port || c.desc : (byId(RANGES, S.range || "") || {}).sae || c.desc })), connOffWhy, o => o.id === "SAE" ? "A" : "–"), "opts--wide")}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  opts(){
    return `<div class="step">
      ${head(4,"Faceplate and seals","Standard parts suit most cooling-water systems; options are there for higher pressure or special liquids.")}
      ${group("Faceplate", "The cover you look through to see the rotor.", ruled("face", FACES, faceOffWhy), "opts--wide")}
      ${group("Rotor shaft", "The rotor itself is PPS.", radios("shaft", SHAFTS), "opts--wide")}
      ${group("O-ring seal", null, radios("oring", ORINGS))}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  power(){
    const r = curRange();
    return `<div class="step">
      ${head(5,"Power supply and trip point","What you have on site, and who sets the switching point.")}
      ${group("Power supply", null, radios("power", POWERS, o => ({ meta:o.id })), "opts--wide")}
      ${group("Trip point", "The flow below which the relay switches off.", ruled("trip", TRIPS, tripOffWhy), "opts--wide")}
      ${S.trip === "fac" ? textField("tripVal", `Trip point flow rate in ${S.units || "LPM"}${r && S.units ? ` (between ${unitRange(r)[0]} and ${unitRange(r)[1]})` : ""}`, S.tripVal, "e.g. 3") : ""}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  review(){
    const rows = summaryRows(true), n = getNotes();
    return `<div class="step">
      ${head(6,"Review your configuration","Check everything below. You can change any answer, then download the PDF or ask for a quotation.")}
      <div class="code-box"><div class="k">Model number</div><div class="v">${esc(partNumber())}</div><div class="s">${codeIsFinal() ? "Built from the published model numbers. Illustrative only: confirm with the manufacturer." : "“?” marks a choice we will confirm with you."}</div></div>
      ${extrasChosen() ? `<div class="code-box" style="margin-top:10px"><div class="k">Options</div><div class="v" style="font-size:1rem">${esc(extrasText())}</div><div class="s">No published code: ordered as separate items, to be confirmed.</div></div>` : ""}
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
        <label class="field"><span class="l">Notes for our team (optional)</span><textarea id="notes" placeholder="e.g. machine or laser model, liquid, cable length, tag numbers, delivery date…">${esc(S.notes)}</textarea></label>
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
    getNotes().warn.filter(w => /^Flow ranges|^Chemical compat|^Above 85/.test(w)).forEach(w => out.push(msg("warn",w)));
    if (!nominalOk()) out.push(msg("warn","Please enter the flow as a number, e.g. 8 or 2.5."));
    const n = nomLpm();
    if (n != null && n > 227) out.push(msg("warn","Above 227 LPM / 60 GPM, the top of the 100 Series. Please talk to us about a larger switch."));
    if (n != null && n <= .2) out.push(msg("warn","Below 0.2 LPM / 0.06 GPM, the bottom of the 100 Series. Please talk to us."));
    return out.join("");
  },
  flow(){
    const out = [];
    getNotes().warn.filter(w => /bottom 20 %|close to the top|^The 0100 models/.test(w)).forEach(w => out.push(msg("warn",w)));
    if (RANGES.every(r => rangeOffWhy(r))) out.push(msg("warn","No range suits the normal flow you entered. Go back and check the value and units, or leave it empty."));
    return out.join("");
  },
  body(){
    const out = [];
    getNotes().warn.filter(w => /^Polypropylene models|^Port size/.test(w)).forEach(w => out.push(msg("warn",w)));
    if (S.mat === "C" && S.range === "0104") out.push(msg("info","The Celcon version of this range is coded 0104L…"));
    return out.join("");
  },
  opts(){
    const out = [];
    getNotes().warn.filter(w => /^Options without|mixing faceplate|solvent vapours/.test(w)).forEach(w => out.push(msg("warn",w)));
    if (S.face && S.face !== "PS") out.push(msg("ok","With a metal faceplate the switch is rated to 1724 kPa / 250 psi."));
    return out.join("");
  },
  power(){
    const out = [];
    if (S.trip === "fac" && S.tripVal.trim() && !tripOk()) out.push(msg("warn","Please enter a number inside the flow range of your switch."));
    getNotes().warn.filter(w => /^The price list shows SAE|at least 10 %/.test(w)).forEach(w => out.push(msg("warn",w)));
    if (validStep("power") && isComplete()) out.push(msg("ok",`Your model number: ${partNumber()}.`));
    return out.join("");
  }
};

/* =====================================================================
   SUMMARY PANEL
   ===================================================================== */
function summaryRows(forReview){
  const g = i => forReview ? i : null;
  return [
    { k:"Liquid",           v:byId(LIQUIDS,S.liquid||"")?.title || null, step:g(0) },
    { k:"Temperature",      v:byId(TEMPS,S.temp||"")?.title || null, step:g(0) },
    { k:"Pressure",         v:byId(PRESSURES,S.pressure||"")?.title || null, step:g(0) },
    { k:"Normal flow",      v:nominalText(), step:g(0) },
    { k:"Flow range",       v:rangeText(), step:g(1) },
    { k:"Body",             v:matText(), step:g(2) },
    { k:"Ports",            v:connText(), step:g(2) },
    { k:"Faceplate",        v:faceText(), step:g(3) },
    { k:"Rotor shaft",      v:shaftText(), step:g(3) },
    { k:"O-ring",           v:oringText(), step:g(3) },
    { k:"Power",            v:powerText(), step:g(4) },
    { k:"Trip point",       v:tripText(), step:g(4) },
    { k:"Quantity",         v:S.step >= 5 ? String(S.qty) : null, step:null }
  ];
}
function sumImgKey(){ return "MAIN"; }
function renderSummary(){
  const key = sumImgKey(), img = $("#sumImg");
  if (img.dataset.key !== key){ img.src = IMG[key]; img.dataset.key = key; }
  const r = byId(RANGES, S.range || "");
  $("#sumModel").textContent = r ? `100 Series flow switch ${r.id}` : "100 Series flow switch";
  const bits = [r ? (r.selectable ? "Selectable range" : rangeTxt(r)) : null, matText()].filter(Boolean);
  $("#sumSub").textContent = bits.length ? bits.join(" · ") : "Your choices appear here as you go.";
  $("#sumCode").textContent = S.range || S.mat || S.power ? partNumber() : "";
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
  if (id === "app" && !nominalOk()) return "Please check the flow rate.";
  if (id === "flow" && S.range === "0100" && !S.config) return "Please choose the range setting.";
  if (id === "power" && S.trip === "fac" && !tripOk()) return "Please enter the trip point.";
  return "Please answer all questions.";
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
const RERENDER = { units:1, range:1, mat:1, trip:1 };
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
  if (t.id === "nominal"){ S.nominal = t.value.slice(0, 12); t.setAttribute("aria-invalid", nominalOk() ? "false" : "true"); refresh(); }
  else if (t.id === "tripVal"){ S.tripVal = t.value.slice(0, 12); t.setAttribute("aria-invalid", !S.tripVal.trim() || tripOk() ? "false" : "true"); refresh(); }
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
  .replace(/[“”]/g,'"').replace(/[’‘]/g,"'").replace(/™/g,"(TM)").replace(/®/g,"(R)").replace(/²/g,"2").replace(/Ω/g," ohm").replace(/ k ohm/g," kohm")
  .replace(/\s?°C/g," C").replace(/\s?°F/g," F").replace(/°/g," deg").replace(/±/g,"+/-")
  .replace(/·/g,"|").replace(/×/g,"x").replace(/÷/g,"/").replace(/−/g,"-").replace(/³/g,"3").replace(/…/g,"...").replace(/→/g,"->");
function loadImg(src, w){
  return new Promise((res, rej) => {
    const i = new Image();
    i.onload = () => { const h = Math.round(w * i.naturalHeight / i.naturalWidth); const c = document.createElement("canvas"); c.width = w; c.height = h; const x = c.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0,0,w,h); x.drawImage(i,0,0,w,h); res({ data:c.toDataURL("image/jpeg", .9), r:h / w }); };
    i.onerror = rej; i.src = src;
  });
}
function buildPdf(logo, photo){
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit:"mm", format:"a4" });
  const W = 210, M = 18, CW = W - 2*M, GAP = 12, COL = (CW - GAP)/2, X1 = M, X2 = M + COL + GAP;
  const NAVY = [45,45,48], INK = [51,53,56], GREY = [122,126,134], LINE = [214,218,224], BLUE = [0,131,169], AMBER = [200,120,0];
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
  small("100 Series paddlewheel flow switch", W - M, 26.5, { size:8, align:"right" });
  hair(M, 32, W - M);
  y = 42;

  const IW = 38, IH = photo ? Math.min(42, IW * photo.r) : 0;
  if (photo) doc.addImage(photo.data, "JPEG", W - M - IW, y - 6, IW, IH, undefined, "FAST");
  doc.setFont("helvetica","bold"); doc.setFontSize(17); doc.setTextColor(...NAVY);
  const cl = doc.splitTextToSize(T(code), CW - IW - 8);
  doc.text(cl, M, y + 4);
  let ty = y + 4 + (cl.length - 1) * 6 + 7.5;
  ty = para(rangeText() || "Flow range to be chosen", M, ty, CW - IW - 8, { size:9.5, color:GREY, lh:4.4, gap:0 }) - 4.4;
  ty = para("Paddlewheel flow switch for cooling water and other liquids. A spinning rotor induces a voltage in a coil; when the flow drops below the trip point or stops, the SPDT relay switches to its alarm state.", M, ty + 6, CW - IW - 8, { size:8.6, color:GREY });
  small(codeIsFinal() ? "Model number built from the published model numbers; illustrative only, confirm with the manufacturer." : "\"?\" in the model number marks a choice to be confirmed.", M, ty + 1, { size:7.2 });
  y = Math.max(ty + 6, y + IH - 2);

  const R = Object.fromEntries(summaryRows(true).map(r => [r.k, r.v]));
  let yl = section("Application", X1, y, COL), yr = section("Flow switch", X2, y, COL);
  yl = item("Liquid", R["Liquid"], X1, yl, COL);
  yl = item("Temperature", R["Temperature"], X1, yl, COL);
  yl = item("Pressure", R["Pressure"], X1, yl, COL);
  yl = item("Normal flow rate", R["Normal flow"], X1, yl, COL);
  yl = item("Power  |  trip point", `${R["Power"]}  |  ${R["Trip point"]}`, X1, yl, COL);
  yr = item("Flow range", R["Flow range"], X2, yr, COL);
  yr = item("Body  |  ports", `${R["Body"]}  |  ${R["Ports"]}`, X2, yr, COL);
  yr = item("Faceplate", R["Faceplate"], X2, yr, COL);
  yr = item("Rotor shaft  |  O-ring", `${R["Rotor shaft"]}  |  ${R["O-ring"]}`, X2, yr, COL);
  yr = item("Quantity", `${S.qty} pcs`, X2, yr, COL);
  y = Math.max(yl, yr) + 3;

  const n = getNotes();
  need(30);
  if (!n.warn.length && !S.notes.trim()){ y = section("Good to know", M, y, CW); n.info.forEach(t => { need(10); y = bullet(t, M, y + .6, CW, BLUE) + .2; }); y += 3; }
  else {
    yl = section(n.warn.length ? "Points we will check with you" : "Your notes", X1, y, COL); yr = section("Good to know", X2, y, COL);
    if (n.warn.length) n.warn.forEach(t => { yl = bullet(t, X1, yl + .6, COL, AMBER) + .6; }); else yl = para(S.notes.trim(), X1, yl, COL, { size:8.8 });
    n.info.forEach(t => { yr = bullet(t, X2, yr + .6, COL, BLUE) + .6; });
    y = Math.max(yl, yr) + 3;
    if (n.warn.length && S.notes.trim()){ need(22); y = section("Your notes", M, y, CW); y = para(S.notes.trim(), M, y, CW, { size:8.8 }) + 3; }
  }

  const half = Math.ceil(SPECS.length / 2);
  need(10 + half * 12);
  y = section("Technical data (from the Proteus 100 Series data sheet and manual)", M, y + 1, CW);
  yl = y; yr = y;
  SPECS.forEach(([k, v], i) => { if (i < half) yl = compact(k, v, X1, yl, COL); else yr = compact(k, v, X2, yr, COL); });

  const pages = doc.getNumberOfPages();
  doc.setPage(pages);
  small("Demo only, not for ordering. Illustrative: confirm all specifications with the manufacturer. Source: data sheet 100DS Rev 005, manual 100TRM Rev 003.", M, 280.5, { size:6.8 });
  for (let p = 1; p <= pages; p++){
    doc.setPage(p); hair(M, 284, W - M);
    small("Unofficial demo by SwiftyQuote  |  sales@swiftyquote.com  |  Not affiliated with Proteus Industries Inc.", M, 289, { size:6.8 });
    small(`${p} / ${pages}`, W - M, 289, { size:7, align:"right" });
  }
  return doc;
}
const pdfName = () => `Proteus_100_${partNumber().replace(/[?\/]/g,"x")}_${S.ref}.pdf`;
async function downloadPdf(){
  if (!isComplete()){ toast("Please complete all steps first."); return; }
  const btns = $$("#btnPdf,#doneDownload"); btns.forEach(b => b.disabled = true);
  try {
    const logo = null;
    const photo = await loadImg(IMG[sumImgKey()], 420).catch(() => null);
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
  if (extrasChosen()) out.push(`Options (no published code): ${extrasText()}`);
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
    `Quotation request | 100 Series paddlewheel flow switch | Ref. ${S.ref}`, "",
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
  $("#faqCta").href = `mailto:${DEMO_CONTACT.email}?subject=${encodeURIComponent("Configurator enquiry (from the Proteus demo)")}`;
  $("#faqContact").innerHTML = `Or write to <a href="mailto:${DEMO_CONTACT.email}">${DEMO_CONTACT.email}</a> · <a href="${DEMO_CONTACT.site}" target="_blank" rel="noopener">swiftyquote.com</a>`;
})();

window.__cfg = { get S(){ return S; }, set S(v){ S = v; }, newState, go, partNumber, rangeText, getNotes, buildPdf, loadImg, buildMailto, quoteText, isComplete, renderStep, constrain, validStep, rangeOffWhy, matOffWhy, connOffWhy, faceOffWhy, tripOffWhy };
renderStep(false);
