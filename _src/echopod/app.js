"use strict";

/* =====================================================================
   SETTINGS: adjust these lines for your own set-up
   ===================================================================== */
const SETTINGS = {
  QUOTE_EMAIL: "level.solution@flowline.com", // where quotation requests are sent (Flowline sales)
  QUOTE_CC: "sales@swiftyquote.com",           // always copied on every quotation request
  TRACKING_TAG: "swiftyquote.com",             // always added to the email subject so requests can be tracked
  QUOTE_ENDPOINT: ""                           // optional: URL of a form service (e.g. Formspree). If set, requests are POSTed there instead of opening the mail app.
};

/* =====================================================================
   DEMO FAQ
   ===================================================================== */
const DEMO_CONTACT = { email:"sales@swiftyquote.com", site:"https://www.swiftyquote.com" };
const DEMO_FAQ = [
  { q:"What is this demo?",
    a:"<p>A working example of a custom product configurator with a built-in quotation request, made by SwiftyQuote. It guides buyers through the choices for a product in plain language, then lets them download their configuration as a PDF or request a quotation.</p>" },
  { q:"Is the product information real? Can I order from this page?",
    a:"<p>The product data, photos and logo belong to Flowline and are used here for demonstration only. This page is not an official Flowline tool and you cannot place orders on it. Please contact Flowline directly for real enquiries about the EchoPod.</p>" },
  { q:"Can you build this for my own products?",
    a:"<p>Yes. The configurator is built around your product range, your options and your rules, and it takes on your branding: your logo, colours and fonts. It works for anything a buyer has to specify before they can get a quote, such as range, power, approvals, outputs or accessories.</p>" },
  { q:"What do you need from me to get started?",
    a:"<ul><li>A link to the product page, or the datasheets and catalogue.</li><li>Your logo and brand guidelines (or we take them from your website).</li><li>The options a buyer can choose, and any rules, such as which combinations are possible or which approvals apply.</li><li>The email address (or system) where quotation requests should go.</li></ul>" },
  { q:"How much does it cost?",
    a:"<p>The price depends on how many products and options are covered, whether you need extra languages, and whether it should connect to your other systems. We give you a fixed quote after a short conversation, so there are no surprises.</p><p>Write to <a href=\"mailto:sales@swiftyquote.com?subject=Configurator%20price%20enquiry\">sales@swiftyquote.com</a> with a link to your product and we will come back with a price.</p>" },
  { q:"How long does implementation take?",
    a:"<p>The timeline depends on the size of your range and the features you choose. A single-product configurator like this one is quicker than a full catalogue with several product families. You receive a clear timeline together with your quote, and you see a first working version early so you can give feedback before we finish.</p>" },
  { q:"Can it use our branding and languages?",
    a:"<p>Yes. This demo already follows the Flowline colours, fonts and logo. Your version follows yours. Additional languages can be added.</p>" },
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

const IMG = { U6:"__IMG_U6__", U12:"__IMG_U12__" };
const LOGO_URL = "__LOGO__";

/* =====================================================================
   PRODUCT DATA
   Source: flowline.com EchoPod UG06 & UG12 product page, data sheet DS310140 (2 pages, "Ordering" p2)
   and manual MN310140 Rev A7 (installation and fitting selection pp28-31).
   Part number: UG [range 06/12] -00 [process mount 0/1] 1-0 [Fob 0/1]   e.g. UG06-0001-00
   ===================================================================== */
const LIQUIDS = [
  { id:"water", title:"Water or wastewater", desc:"Clean water, RO/DI water, wastewater, sumps." },
  { id:"chem",  title:"Chemicals",           desc:"Acids, caustics, hypochlorite, ferric chloride and similar." },
  { id:"oil",   title:"Oil or fuel",         desc:"Lube oil, used oil, diesel." },
  { id:"other", title:"Something else",      desc:"We will look at it together with you." }
];
const TANKS = [
  { id:"vert",  title:"Closed vertical tank",   desc:"Flat or dome top." },
  { id:"horiz", title:"Closed horizontal tank", desc:"Cylinder lying on its side." },
  { id:"cone",  title:"Cone-bottom tank",       desc:"Conical or rounded bottom." },
  { id:"open",  title:"Open tank, sump or basin", desc:"Open to the air, no roof." }
];
const FOAMS = [
  { id:"none",  title:"No foam",            desc:"Calm or lightly moving surface.", badge:"Best fit" },
  { id:"light", title:"Light, occasional foam", desc:"A thin layer now and then." },
  { id:"heavy", title:"Foam is common",     desc:"A standpipe keeps foam away from the sensor." }
];
const VAPOURS = [
  { id:"none",  title:"No vapour or condensation" },
  { id:"mild",  title:"Mild vapour or condensation", desc:"Reflective Technology™ handles condensation.", badge:"Handled" },
  { id:"heavy", title:"Heavy fumes or steam",       desc:"We will check this with you." }
];
const TEMPS = [
  { id:"ok",   title:"−40 to 80 °C",      desc:"−40 to 176 °F. The EchoPod process temperature range.", badge:"Most common" },
  { id:"hot",  title:"Hotter than 80 °C", desc:"Above 176 °F" },
  { id:"cold", title:"Colder than −40 °C", desc:"Below −40 °F" },
  { id:"unk",  title:"Not sure",          desc:"We will check it with you." }
];
const PRESSES = [
  { id:"atm",  title:"Vented (atmospheric)",   desc:"No pressure in the tank." },
  { id:"low",  title:"Up to 2 bar (30 psi)",    desc:"Within the EchoPod pressure rating." },
  { id:"high", title:"Above 2 bar (30 psi)" },
  { id:"vac",  title:"Vacuum" }
];
const AREAS = [
  { id:"safe", title:"Ordinary (non-hazardous) area", desc:"No flammable gas, vapour or dust." },
  { id:"haz",  title:"Classified hazardous area",     desc:"Zone or Class/Division area." }
];
/* Sensor ranges (data sheet p2) */
const RANGES = [
  { id:"06", title:"UG06: up to 6 m (19.6 ft)",  max:6.0,  dead:0.203, deadTxt:"8″ (20.3 cm)",  beam:"3″ (7.6 cm)",  res:"2 mm (0.079″)", thread:"2″", short:"6 m (19.6 ft)",
    desc:"Measures from 8″ to 19.6 ft (20 cm to 6 m). Dead band 8″, beam width 3″, 2″ process thread." },
  { id:"12", title:"UG12: up to 12 m (39.3 ft)", max:12.0, dead:0.457, deadTxt:"18″ (45.7 cm)", beam:"6″ (15.2 cm)", res:"5 mm (0.196″)", thread:"3″", short:"12 m (39.3 ft)",
    desc:"Measures from 18″ to 39.3 ft (45.7 cm to 12 m). Dead band 18″, beam width 6″, 3″ process thread." }
];
const THREADS = [
  { id:"0", title:"NPT thread", badge:"Most common" },
  { id:"1", title:"G thread",   desc:"Supplied with a Viton® gasket." }
];
const MOUNTS = [
  { id:"adapter",  title:"Tank adapter (bulkhead fitting)", desc:"Through a hole in the tank top." },
  { id:"flange",   title:"Flange",                          desc:"On a flanged nozzle." },
  { id:"bracket",  title:"Side mount bracket",              desc:"Over open tanks and sumps." },
  { id:"standpipe",title:"Standpipe",                       desc:"A pipe that runs the measuring span, to calm turbulence or keep foam out." },
  { id:"existing", title:"Into a larger threaded port",     desc:"A reducer bushing fits the sensor into an existing bigger port." },
  { id:"own",      title:"Into my own fitting",             desc:"A fitting with the same thread as the sensor." }
];
const PORTS = [
  { id:"3", title:"3″ threaded port" },
  { id:"4", title:"4″ threaded port" }
];
/* Flowline accessory part numbers (product page "Compatible accessories" and manual pp7, 28-31) */
const ACC = {
  "LM52-2890":"Tank adapter, 2″ NPT bulkhead, PVC",
  "LM52-3890":"Tank adapter, 3″ NPT bulkhead, PVC",
  "LM52-2800":"Reducer bushing, 3″ × 2″ NPT, PVC",
  "LM52-3800":"Reducer bushing, 4″ × 2″ thread",
  "LM52-2850":"Flange, 2″ × 2″ NPT, CPVC, schedule 80",
  "LM52-3850":"Flange, 3″ × 3″ NPT, CPVC, schedule 80",
  "LM50-1001":"Side mount bracket, 2″ NPT, PP",
  "LM50-1061":"Side mount bracket, 2″ G, PP",
  "LM52-2400":"Reducer bushing, 3″ thread × 2″ thread (standpipe)",
  "LM52-2410":"Reducer, 3″ slip × 2″ thread (standpipe)",
  "LM90-1001":"Liquid tight fitting for the 1/2″ NPT conduit entry",
  "LC95-2001":"Power supply, 100-240 VAC in, 24 VDC @ 0.45 A out",
  "LI23-1001":"Level indicator, 12-30 VDC, relay & repeater options",
  "LI55-1001":"Level controller, 85-265 VAC, relay & repeater options",
  "LM92-1002":"Single NEMA box, 1/8 DIN, windowed, PC",
  "LM92-2002":"Double NEMA box, 1/8 DIN, windowed, PC"
};
const SETUPS = [
  { id:"button", title:"With the push buttons on the display", desc:"Three buttons and a 6-digit LCD under the clear cap. No extra tools.", badge:"Standard" },
  { id:"webcal", title:"On a PC with WebCal® software",        desc:"Free Flowline software: set up, save the configuration, print a wiring diagram. Needs one LI99-2001 USB Fob." }
];
const FOBS = [
  { id:"0", title:"Without Fob" },
  { id:"1", title:"With LI99-2001 USB Fob", desc:"One Fob works with every WebCal-compatible Flowline sensor." }
];
const DISP_U = [
  { id:"in",  title:"Inches" }, { id:"cm", title:"Centimetres" }, { id:"pct", title:"Percent of span" }
];
const MA = [
  { id:"norm", title:"4 mA at empty, 20 mA at full", badge:"Standard" },
  { id:"rev",  title:"Reversed: 20 mA at empty, 4 mA at full" }
];
const LOSTS = [
  { id:"site", title:"Decide on site" }, { id:"4", title:"4 mA" }, { id:"20", title:"20 mA" },
  { id:"21", title:"21 mA" }, { id:"22", title:"22 mA" }, { id:"hold", title:"Hold last value" }
];
const PRECONF = [
  { id:"site",    title:"We set it up on site", desc:"Sensor height, fill height and the other settings are entered at commissioning.", badge:"Standard" },
  { id:"factory", title:"Please set it up before shipping", desc:"Needs your tank dimensions. Not listed on the data sheet: to be confirmed by Flowline." }
];
const POWERS = [
  { id:"have",  title:"I have a 24 VDC loop supply or PLC input", desc:"The EchoPod needs 14-28 VDC, max. 500 Ω loop resistance at 24 VDC." },
  { id:"LC95",  title:"Add a Flowline power supply (LC95-2001)",  desc:"100-240 VAC in, 24 VDC @ 0.45 A out." }
];
const DISPLAYS = [
  { id:"none", title:"No remote display", desc:"The level is shown on the EchoPod itself and sent as 4-20 mA." },
  { id:"LI23-1001", title:"Level indicator (LI23-1001)", desc:"12-30 VDC. Relay and repeater options." },
  { id:"LI55-1001", title:"Level controller (LI55-1001)", desc:"85-265 VAC. Relay and repeater options." }
];
const BOXES = [
  { id:"none", title:"No enclosure" },
  { id:"LM92-1002", title:"Single NEMA box (LM92-1002)", desc:"1/8 DIN, windowed, polycarbonate." },
  { id:"LM92-2002", title:"Double NEMA box (LM92-2002)", desc:"For two 1/8 DIN units, windowed, polycarbonate." }
];

const SPECS = [
  ["Measurement",     "Non-contact reflective ultrasonic; accuracy +/-0.2% of range"],
  ["Range",           "UG06: 8 in to 19.6 ft (20 cm to 6 m); UG12: 18 in to 39.3 ft (45.7 cm to 12 m)"],
  ["Dead band / beam","UG06: 8 in, 3 in beam; UG12: 18 in, 6 in beam"],
  ["Output",          "4-20 mA two-wire (or 20-4 mA); fail-safe 4, 20, 21, 22 mA or hold last"],
  ["Supply",          "14-28 VDC, 0.5 W; loop resistance 500 ohm at 24 VDC"],
  ["Process",         "-40 to 80 C (-40 to 176 F); 30 psi (2 bar); ambient -35 to 60 C"],
  ["Materials",       "PVDF transducer, PP enclosure (Type 6P/IP68), clear polycarbonate cap"],
  ["Approvals",       "General purpose; UL 61010-1; CE, RoHS"]
];

/* =====================================================================
   STATE
   ===================================================================== */
const STEPS = [
  { id:"app",    label:"Application" },
  { id:"range",  label:"Tank & range" },
  { id:"mount",  label:"Mounting" },
  { id:"setup",  label:"Setup & output" },
  { id:"extras", label:"Extras" },
  { id:"review", label:"Review" }
];
const $ = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => [...el.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const byId = (arr,id) => arr.find(x => x.id === id);

function newState(){
  return { step:0, maxStep:0, liquid:null, tank:null, foam:null, vapour:null, temp:null, press:null, area:null,
           dims:"yes", dimU:"m", dimH:"", dimF:"", range:null,
           thread:null, mount:null, port:null, fit:null,
           setup:null, fob:null, dispU:null, mA:"norm", lost:"site", preconf:"site",
           power:"have", display:"none", box:"none", gland:false,
           qty:1, notes:"", ref:makeRef(), helpOpen:{} };
}
function makeRef(){
  const d = new Date(), p = n => String(n).padStart(2,"0");
  const rnd = Math.random().toString(36).slice(2,6).toUpperCase();
  return `FL-${String(d.getFullYear()).slice(2)}${p(d.getMonth()+1)}${p(d.getDate())}-${rnd}`;
}
let S = newState();

/* ---------- rules ---------- */
const rangeObj = () => byId(RANGES, S.range || "");
const isU6 = () => S.range === "06";
const isNPT = () => S.thread === "0";
const num = v => /^\d+(\.\d+)?$/.test(String(v).trim());
const toM = v => S.dimU === "ft" ? +v * 0.3048 : +v;
const fmtLen = m => S.dimU === "ft" ? `${(m / 0.3048).toFixed(1)} ft` : `${m.toFixed(2)} m`;
function dimsState(){
  if (S.dims !== "yes") return "skip";
  if (!num(S.dimH) || !num(S.dimF)) return (S.dimH === "" || S.dimF === "") ? "empty" : "bad";
  const h = toM(S.dimH), f = toM(S.dimF);
  if (h <= 0 || f <= 0 || f >= h) return "bad";
  return "ok";
}
const dimsOk = () => dimsState() === "ok";
const sensorH = () => dimsOk() ? toM(S.dimH) : null;
const gapM = () => dimsOk() ? toM(S.dimH) - toM(S.dimF) : null;   /* distance from sensor to the highest liquid level */

/* hard limits from the data sheet / manual that rule the EchoPod out */
function blockers(){
  const b = [];
  if (S.area === "haz") b.push("The EchoPod is a general purpose sensor and should not be used within classified hazardous environments. Flowline offers sensors for hazardous areas (for example the EchoBeam LR83 in an IS version): please ask Flowline.");
  if (S.press === "vac") b.push("The EchoPod must not be installed in applications with vacuum.");
  if (S.press === "high") b.push("The EchoPod is rated to 30 psi (2 bar). Your tank pressure is higher.");
  if (S.temp === "hot") b.push("The process temperature limit is 80 °C (176 °F). Your process is hotter.");
  if (S.temp === "cold") b.push("The process temperature limit is −40 °C (−40 °F). Your process is colder.");
  return b;
}
function rangeOffWhy(r){
  const h = sensorH(), g = gapM();
  if (h != null && h > r.max) return `Your sensor height (${fmtLen(h)}) is more than the ${r.short} range.`;
  if (g != null && g < r.dead) return `The liquid would come within ${fmtLen(g)} of the sensor, inside the ${r.deadTxt} dead band. Lower the highest level or raise the sensor.`;
  return null;
}
function recommendedRange(){
  const ok = RANGES.filter(r => !rangeOffWhy(r));
  return ok.length ? ok[0].id : null;
}
function mountOffWhy(m){
  if (m.id === "bracket" && S.tank && S.tank !== "open") return "The side mount bracket is for open tanks and sumps. For a closed tank use a tank adapter or a flange.";
  return null;
}
/* fittings that suit the chosen sensor, thread and mounting (manual pp28-31) */
function fitChoices(){
  const out = [], u6 = isU6(), npt = isNPT(), sz = u6 ? "2″" : "3″", th = npt ? "NPT" : "G";
  let tbc = null;
  const add = (codes, title, desc, badge) => out.push({ id:codes.join("+"), codes, title, desc, badge });
  const own = () => add(["none"], "No fitting: I have my own", `Your fitting must take the ${sz} ${th} thread of the ${u6 ? "UG06" : "UG12"}.`);
  switch (S.mount){
    case "adapter":
      if (npt && u6){ add(["LM52-3890","LM52-2800"], "3″ tank adapter with 3″ × 2″ reducer bushing", "LM52-3890 + LM52-2800, PVC. Flowline's choice for best results.", "Recommended"); add(["LM52-2890"], "2″ tank adapter", "LM52-2890, 2″ NPT bulkhead, PVC."); }
      else if (npt) add(["LM52-3890"], "3″ tank adapter", "LM52-3890, 3″ NPT bulkhead, PVC.", "Recommended");
      else tbc = "The Flowline tank adapters listed for the EchoPod are NPT. A tank adapter for the G-thread version is to be confirmed with Flowline.";
      break;
    case "flange":
      if (npt && u6){ add(["LM52-2850"], "2″ flange", "LM52-2850, 2″ × 2″ NPT, CPVC, schedule 80."); add(["LM52-3850","LM52-2800"], "3″ flange with 3″ × 2″ reducer bushing", "LM52-3850 + LM52-2800."); }
      else if (npt) add(["LM52-3850"], "3″ flange", "LM52-3850, 3″ × 3″ NPT, CPVC, schedule 80.", "Recommended");
      else tbc = "The Flowline flanges listed for the EchoPod are NPT. A flange for the G-thread version is to be confirmed with Flowline.";
      break;
    case "bracket":
      if (u6) add([npt ? "LM50-1001" : "LM50-1061"], `Side mount bracket, 2″ ${th}`, `${npt ? "LM50-1001" : "LM50-1061"}, polypropylene. For open tanks and sumps.`, "Recommended");
      else tbc = "The LM50 side mount brackets listed are for 2″ sensors (UG06). A bracket for the 3″ UG12 is to be confirmed with Flowline.";
      break;
    case "standpipe":
      if (u6 && npt){ add(["LM52-2400"], "3″ thread × 2″ thread reducer bushing", "LM52-2400. Screws into a 3″ threaded coupling on top of the pipe.", "Recommended"); add(["LM52-2410"], "3″ slip × 2″ thread reducer", "LM52-2410. Glues onto a 3″ slip coupling."); }
      else tbc = u6 ? "The standpipe reducers listed (LM52-2400, LM52-2410) have a 2″ NPT thread. The adapter for the G-thread version is to be confirmed." : "The UG12 needs a standpipe of at least 4″ ID. The matching reducer for its 3″ thread is to be confirmed with Flowline.";
      break;
    case "existing":
      if (u6 && npt && S.port === "3") add(["LM52-2800"], "3″ × 2″ reducer bushing", "LM52-2800, NPT, PVC.", "Recommended");
      else if (u6 && npt && S.port === "4") add(["LM52-3800"], "4″ × 2″ reducer bushing", "LM52-3800.", "Recommended");
      else if (S.port) tbc = `A reducer bushing for the ${sz} ${th} thread into your ${S.port}″ port is to be confirmed with Flowline.`;
      break;
  }
  own();
  return { list:out, tbc };
}
function portOffWhy(p){
  if (!isU6() && p.id === "3") return "Same size as the 3″ UG12 thread: choose “Into my own fitting”.";
  return null;
}
function fitObj(){ return fitChoices().list.find(f => f.id === S.fit) || null; }

function constrain(){
  if (S.tank === "open") S.press = "atm";
  const r = rangeObj(); if (r && rangeOffWhy(r)) S.range = null;
  const m = byId(MOUNTS, S.mount || ""); if (m && mountOffWhy(m)) S.mount = null;
  if (S.mount !== "existing") S.port = null;
  const p = byId(PORTS, S.port || ""); if (p && portOffWhy(p)) S.port = null;
  if (S.fit && !fitChoices().list.some(f => f.id === S.fit)) S.fit = null;
  if (S.preconf === "factory" && !dimsOk()) S.preconf = "site";
  if (S.display === "none") S.box = "none";
}

/* ---------- derived values ---------- */
function partNumber(){
  return `UG${S.range || "??"}-00${S.thread != null ? S.thread : "?"}1-0${S.fob != null ? S.fob : "?"}`;
}
const codeIsFinal = () => !partNumber().includes("?");
function accessories(){        /* [code, description] per instrument */
  const a = [];
  const f = fitObj(); if (f) f.codes.filter(c => c !== "none").forEach(c => a.push(c));
  if (S.power === "LC95") a.push("LC95-2001");
  if (S.display !== "none") a.push(S.display);
  if (S.box !== "none") a.push(S.box);
  if (S.gland) a.push("LM90-1001");
  return a.map(c => [c, ACC[c]]);
}
function processText(){
  const t = byId(TEMPS, S.temp || ""), p = byId(PRESSES, S.press || "");
  return [t ? t.title : null, p ? p.title : null].filter(Boolean).join(", ") || null;
}
function condText(){
  const f = byId(FOAMS, S.foam || ""), v = byId(VAPOURS, S.vapour || "");
  return [f ? f.title : null, v ? v.title : null].filter(Boolean).join(", ") || null;
}
function dimsText(){
  if (S.dims !== "yes") return "To be confirmed";
  if (!dimsOk()) return null;
  return `Sensor height ${S.dimH} ${S.dimU}, highest level ${S.dimF} ${S.dimU} (clearance ${fmtLen(gapM())})`;
}
function rangeText(){ const r = rangeObj(); return r ? `EchoPod ${r.title}` : null; }
function threadText(){
  if (S.thread == null) return null;
  const sz = S.range ? (isU6() ? "2″ " : "3″ ") : "";
  return `${sz}${isNPT() ? "NPT" : "G thread with Viton® gasket"}`;
}
function mountText(){
  const m = byId(MOUNTS, S.mount || ""); if (!m) return null;
  return m.id === "existing" && S.port ? `${m.title} (${S.port}″)` : m.title;
}
function fitText(){
  const f = fitObj(); if (!f) return null;
  return f.codes[0] === "none" ? "Own fitting" : f.codes.map(c => `${c} ${ACC[c]}`).join(" + ");
}
function setupText(){
  const s = byId(SETUPS, S.setup || ""); if (!s) return null;
  return s.id === "button" ? "Push buttons on the display" : "WebCal® software on a PC";
}
function outputText(){
  if (!S.dispU) return null;
  const l = byId(LOSTS, S.lost);
  return `Display in ${byId(DISP_U,S.dispU).title.toLowerCase()}; ${byId(MA,S.mA).title}; on lost echo: ${S.lost === "site" ? "decide on site" : l.title}`;
}
function extrasText(){
  const a = accessories().filter(([c]) => !(fitObj()?.codes || []).includes(c));
  return a.length ? a.map(([c,d]) => `${c} ${d}`).join("; ") : "None";
}

function validStep(id){
  switch(id){
    case "app":    return !!(S.liquid && S.tank && S.foam && S.vapour && S.temp && S.press && S.area) && !blockers().length;
    case "range":  return !!S.range && (S.dims !== "yes" || dimsOk());
    case "mount":  return !!(S.thread != null && S.mount && (S.mount !== "existing" || S.port) && S.fit);
    case "setup":  return !!(S.setup && S.fob != null && S.dispU);
    case "extras": return true;
    default:       return true;
  }
}
const isComplete = () => STEPS.slice(0,-1).every(s => validStep(s.id));

function getNotes(){
  const warn = [], info = [];
  const r = rangeObj(), fc = S.mount ? fitChoices() : null;
  if (S.temp === "unk") warn.push("Process temperature to be confirmed (EchoPod: −40 to 80 °C, −40 to 176 °F).");
  if (S.foam === "light") warn.push("Light foam can weaken the echo. The data sheet recommends the EchoPod for non-foaming liquids: to be confirmed for your application.");
  if (S.foam === "heavy" && S.mount !== "standpipe") warn.push("Foam is common in your tank. Flowline recommends a standpipe to keep foam away from the sensor.");
  if (S.vapour === "heavy") warn.push("Heavy fumes or steam: the EchoPod is meant for non-foaming or mildly vaporous liquids. To be confirmed with Flowline.");
  if (S.liquid === "other") warn.push("Liquid to be clarified with you before quotation.");
  if (S.liquid === "chem" || S.liquid === "other") warn.push("Chemical compatibility to be confirmed: wetted parts are PVDF (transducer) and polypropylene (enclosure), with a Viton® gasket on G threads.");
  if (S.dims !== "yes") warn.push("Tank dimensions to be confirmed: they decide the range (UG06 or UG12) and the 4-20 mA span.");
  if (fc && fc.tbc) warn.push(fc.tbc);
  if (S.preconf === "factory") warn.push("Setting up the sensor before shipping is not listed on the data sheet: to be confirmed by Flowline.");
  if (S.mount === "standpipe") info.push(`Standpipe: at least ${isU6() ? "3″" : "4″"} inner diameter, running the full measuring span, bottom always under the liquid, a 45° notch at the bottom and a 1/4″ vent hole in the dead band. Pipe supplied by you.`);
  if (["adapter","flange","existing"].includes(S.mount)) info.push("Risers: keep a 2:1 ratio of inner diameter to height (a 3″ riser no taller than 6″, larger risers no taller than 12″).");
  if (S.tank === "cone") info.push("Cone-bottom tank: mount the sensor over the deepest part of the tank.");
  if (S.tank === "vert" || S.tank === "horiz") info.push("Do not mount in the centre of a dome top.");
  if (S.thread === "1") info.push("G-thread versions come with a Viton® gasket: always fit it.");
  if (r) info.push(`Mount the sensor vertically, at least 3″ from the tank wall, with no objects in the ${r.beam} beam. The liquid must never enter the ${r.deadTxt} dead band.`);
  if (S.setup === "webcal" && S.fob === "0") info.push("WebCal needs one LI99-2001 USB Fob. Choose “without Fob” only if you already have one.");
  if (S.display !== "none" || S.power === "have") info.push("Make sure the 4-20 mA loop is powered with 14-28 VDC: by your PLC or controller, or by a supply such as the LC95-2001.");
  info.push("Sensor height sets the 4 mA point and fill height the 20 mA point. Settings are kept in non-volatile memory.");
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
      ${head(1,"What will the EchoPod measure?","The EchoPod measures liquid level without touching the liquid and sends it as a 4-20 mA signal. Tell us about your liquid and your tank.")}
      ${group("What liquid is in the tank?", null, radios("liquid", LIQUIDS))}
      ${group("What kind of tank?", null, radios("tank", TANKS))}
      ${group("Foam on the surface", null, radios("foam", FOAMS))}
      ${group("Vapour and condensation", null, radios("vapour", VAPOURS))}
      ${group("Liquid temperature", null, radios("temp", TEMPS))}
      ${S.tank && S.tank !== "open" ? group("Pressure in the tank", null, radios("press", PRESSES)) : ""}
      ${group("Where is the tank installed?", null, radios("area", AREAS))}
      ${helpHtml("app","Why do foam and vapour matter?",`<p>An ultrasonic sensor sends a sound pulse down to the liquid and times the echo. <strong>Foam</strong> soaks up the sound, so the echo gets weak. <strong>Condensation</strong> on the sensor face does the same on most sensors, but the EchoPod's transducer stands vertically and bounces the pulse off a 45° reflector, so droplets simply run off.</p><p>If foam is common, a <strong>standpipe</strong> (step 3) keeps the foam away from the sensor.</p>`)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  range(){
    const rec = recommendedRange(), u = S.dimU;
    return `<div class="step">
      ${head(2,"Tank size and sensor range","Two measurements from your tank tell us which EchoPod fits.")}
      ${group("Do you know the tank dimensions?", null,
        optHtml({ name:"dims", value:"yes", checked:S.dims==="yes", title:"Yes, I'll enter them", badge:"Recommended" }) +
        optHtml({ name:"dims", value:"no", checked:S.dims==="no", title:"Not yet", desc:"Choose the range yourself; we confirm it with you." }))}
      ${S.dims === "yes" ? `<div class="group"><div class="group__title">Tank dimensions</div>
        <div class="group__sub">Measured from the tank bottom (or the lowest level you need) up to the bottom of the sensor's mounting nut.</div>
        <div class="opts" style="margin-top:12px">${optHtml({ name:"dimU", value:"m", checked:u==="m", title:"Metres" })}${optHtml({ name:"dimU", value:"ft", checked:u==="ft", title:"Feet" })}</div>
        <div class="dims">
          <label class="field"><span class="l">Sensor height</span><span class="unit-input"><input id="dimH" type="text" inputmode="decimal" value="${esc(S.dimH)}" placeholder="${u==="m" ? "e.g. 3.5" : "e.g. 12"}"><em>${u}</em></span></label>
          <label class="field"><span class="l">Highest liquid level</span><span class="unit-input"><input id="dimF" type="text" inputmode="decimal" value="${esc(S.dimF)}" placeholder="${u==="m" ? "e.g. 3.0" : "e.g. 10"}"><em>${u}</em></span></label>
        </div></div>` : ""}
      ${group("Sensor range", rec && dimsOk() ? "Ranges that do not fit your tank are greyed out." : "Pick a range longer than your sensor height.",
        RANGES.map(r => { const why = rangeOffWhy(r);
          return optHtml({ name:"range", value:r.id, checked:S.range===r.id, title:r.title, desc:why || r.desc, meta:`UG${r.id}`, badge:!why && dimsOk() && r.id === rec ? "Best fit" : null, off:!!why }); }).join(""), "opts--wide")}
      ${helpHtml("range","What are sensor height and dead band?",`<p><strong>Sensor height</strong> is the distance from the empty level up to the bottom of the sensor's mounting nut, including any riser or fitting. It sets the 4 mA point. The <strong>highest liquid level</strong> sets the 20 mA point.</p><p>Right under the sensor is a short <strong>dead band</strong> where it cannot measure: 8″ for the UG06, 18″ for the UG12. The liquid must never rise into it.</p>`)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  mount(){
    const r = rangeObj(), fc = S.mount ? fitChoices() : null;
    return `<div class="step">
      ${head(3,"How will it be mounted?",`The ${r ? `UG${r.id} has a ${r.thread}` : "sensor has a"} process thread. Fittings that match your sensor are shown below.`)}
      ${group("Process thread", null, THREADS.map(t => optHtml({ name:"thread", value:t.id, checked:S.thread===t.id, title:`${r ? r.thread + " " : ""}${t.title}`, desc:t.desc, badge:t.badge, meta:`Code ${t.id}` })).join(""))}
      ${group("Mounting method", null, MOUNTS.map(m => { const why = mountOffWhy(m);
        return optHtml({ name:"mount", value:m.id, checked:S.mount===m.id, title:m.title, desc:why || m.desc, badge:m.id === "standpipe" && S.foam === "heavy" ? "Recommended for foam" : null, off:!!why }); }).join(""))}
      ${S.mount === "existing" ? group("Size of the existing port", null, PORTS.map(p => { const why = portOffWhy(p);
        return optHtml({ name:"port", value:p.id, checked:S.port===p.id, title:p.title, desc:why, off:!!why }); }).join("")) : ""}
      ${fc && S.thread != null && (S.mount !== "existing" || S.port) ? group("Fitting", fc.tbc ? null : "Flowline installation fittings for your sensor and thread.",
        fc.list.map(f => optHtml({ name:"fit", value:f.id, checked:S.fit===f.id, title:f.title, desc:f.desc, badge:f.badge, meta:f.codes[0] === "none" ? null : f.codes.join(" + ") })).join(""), "opts--wide") : ""}
      ${helpHtml("mount","Which mounting do I need?",`<ul><li><strong>Tank adapter:</strong> the usual choice on a closed tank top. Mount it so most of the fitting is outside the tank.</li><li><strong>Flange:</strong> use one whose thread sits above the flange face.</li><li><strong>Side mount bracket:</strong> holds the sensor over an open tank or sump. Not for standpipes.</li><li><strong>Standpipe:</strong> calms turbulence and keeps foam out.</li></ul><p>Always hand-tighten the sensor and check for leaks before start-up.</p>`)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  setup(){
    return `<div class="step">
      ${head(4,"Setup and 4-20 mA output","How will you set up the sensor, and how should it report the level?")}
      ${group("How will you set it up?", null, radios("setup", SETUPS), "opts--wide")}
      ${S.setup ? group("USB Fob adapter (LI99-2001)", S.setup === "webcal" ? "WebCal needs one Fob. Skip it if you already have one." : "Only needed if you also want to use WebCal.", radios("fob", FOBS, o => ({ meta:`Code ${o.id}` })), "opts--wide") : ""}
      ${group("Display units", "Shown on the 6-digit LCD.", radios("dispU", DISP_U))}
      ${group("4-20 mA direction", null, radios("mA", MA), "opts--wide")}
      ${group("Output when the echo is lost", "The fail-safe signal your control system will see.", radios("lost", LOSTS))}
      ${group("Who sets it up?", null, PRECONF.map(p => { const off = p.id === "factory" && !dimsOk();
        return optHtml({ name:"preconf", value:p.id, checked:S.preconf===p.id, title:p.title, desc:off ? "Enter your tank dimensions in step 2 first." : p.desc, badge:p.badge, off }); }).join(""), "opts--wide")}
      ${helpHtml("setup","What does fail-safe mean?",`<p>If the sensor stops getting an echo, for example because of heavy foam or an obstruction, it sends a fixed signal so your control system knows. Choose <strong>21 or 22 mA</strong> to show a fault above the normal range, <strong>4 or 20 mA</strong> to show empty or full, or <strong>hold</strong> to keep the last reading.</p>`)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  extras(){
    return `<div class="step">
      ${head(5,"Display, power and extras","All optional. Flowline accessories that work with the EchoPod.")}
      ${group("Loop power", null, radios("power", POWERS, o => ({ meta:o.id === "LC95" ? "LC95-2001" : null })), "opts--wide")}
      ${group("Remote display or controller", null, radios("display", DISPLAYS, o => ({ meta:o.id === "none" ? null : o.id })), "opts--wide")}
      ${group("Enclosure for the display", null, BOXES.map(b => { const off = b.id !== "none" && S.display === "none";
        return optHtml({ name:"box", value:b.id, checked:S.box===b.id, title:b.title, desc:off ? "Choose a display or controller first." : b.desc, meta:b.id === "none" ? null : b.id, off }); }).join(""), "opts--wide")}
      ${group("Cable entry", null, optHtml({ type:"checkbox", name:"gland", value:"1", checked:S.gland, title:"Liquid tight fitting (LM90-1001)", desc:"For the 1/2″ NPT conduit entry. Cable 0.170″ to 0.450″ (4.3 to 11.4 mm).", meta:"LM90-1001" }))}
      ${helpHtml("extras","Do I need a display or controller?",`<p>The EchoPod shows the level on its own display. A <strong>remote indicator</strong> or <strong>controller</strong> shows it elsewhere, for example at eye level or in a control room, and can switch pumps or alarms with relays.</p>`)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  review(){
    const rows = summaryRows(true), n = getNotes(), acc = accessories();
    return `<div class="step">
      ${head(6,"Review your configuration","Check everything below. You can change any answer, then download the PDF or ask for a quotation.")}
      <div class="code-box"><div class="k">Part number</div><div class="v">${esc(partNumber())}</div>
        <div class="s">${codeIsFinal() ? "Built from the data sheet's ordering code. Confirmed by Flowline in the quotation." : "“?” marks a choice we will confirm with you."}</div>
        ${acc.length ? `<div class="k" style="margin-top:14px">Accessories (each, per sensor)</div><div class="acc">${acc.map(([c,d]) => `${esc(c)} <span style="font-weight:400;font-family:var(--font)">${esc(d)}</span>`).join("<br>")}</div>` : ""}</div>
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
        <label class="field"><span class="l">Notes for our team (optional)</span><textarea id="notes" placeholder="e.g. tank tag numbers, tank drawing, liquid name, delivery date…">${esc(S.notes)}</textarea></label>
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
    blockers().forEach(b => out.push(msg("warn", b)));
    if (!blockers().length && S.temp === "ok" && S.area === "safe" && S.press) out.push(msg("ok","Good news: your process is inside the EchoPod's temperature and pressure ratings."));
    getNotes().warn.filter(w => /foam|fumes|temperature to be/i.test(w) && !/standpipe/.test(w)).forEach(w => out.push(msg("warn",w)));
    if (S.foam === "heavy") out.push(msg("info","With frequent foam we will suggest a standpipe in step 3."));
    return out.join("");
  },
  range(){
    const out = [], st = dimsState(), r = rangeObj();
    if (st === "bad") out.push(msg("warn","Please enter two numbers: the highest liquid level must be lower than the sensor height."));
    if (st === "ok" && !recommendedRange()) out.push(msg("warn",`No EchoPod fits: the sensor height must be at most 12 m (39.3 ft) and the liquid must stay out of the dead band. Please contact Flowline or adjust the mounting.`));
    if (st === "ok" && recommendedRange()) out.push(msg("ok",`Clearance between the highest level and the sensor: ${fmtLen(gapM())}.`));
    if (r) out.push(msg("info",`UG${r.id}: dead band ${r.deadTxt}, beam width ${r.beam}, resolution ${r.res}, accuracy ±0.2% of range.`));
    return out.join("");
  },
  mount(){
    const out = [], fc = S.mount ? fitChoices() : null;
    if (fc && fc.tbc && S.thread != null) out.push(msg("warn", fc.tbc));
    if (S.mount === "standpipe") out.push(msg("info", getNotes().info.find(t => /^Standpipe/.test(t))));
    if (S.thread === "1") out.push(msg("info","G-thread versions come with a Viton® gasket: always fit it."));
    if (S.foam === "heavy" && S.mount && S.mount !== "standpipe") out.push(msg("warn","Foam is common in your tank: a standpipe is recommended."));
    return out.join("");
  },
  setup(){
    const out = [];
    if (S.setup === "webcal" && S.fob === "0") out.push(msg("info","Without a Fob you need one you already own to connect WebCal."));
    if (S.preconf === "factory") out.push(msg("warn","Setting up before shipping is not listed on the data sheet: to be confirmed by Flowline."));
    if (S.fob != null && S.range && S.thread != null) out.push(msg("ok",`Your part number: ${partNumber()}.`));
    return out.join("");
  },
  extras(){
    const out = [];
    if (S.display === "LI55-1001" && S.power === "have") out.push(msg("info","Check whether your loop is powered: by the controller, your PLC, or a 24 VDC supply such as the LC95-2001."));
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
    { k:"Liquid",            v:byId(LIQUIDS,S.liquid||"")?.title || null, step:g(0) },
    { k:"Tank",              v:byId(TANKS,S.tank||"")?.title || null, step:g(0) },
    { k:"Surface",           v:condText(), step:g(0) },
    { k:"Process",           v:processText(), step:g(0) },
    { k:"Area",              v:byId(AREAS,S.area||"")?.title || null, step:g(0) },
    { k:"Tank dimensions",   v:past(1) ? dimsText() : null, step:g(1) },
    { k:"Sensor",            v:rangeText(), step:g(1) },
    { k:"Process thread",    v:threadText(), step:g(2) },
    { k:"Mounting",          v:mountText(), step:g(2) },
    { k:"Fitting",           v:fitText(), step:g(2) },
    { k:"Setup",             v:setupText() ? `${setupText()}${S.fob === "1" ? ", with LI99-2001 Fob" : S.fob === "0" ? ", without Fob" : ""}` : null, step:g(3) },
    { k:"Output settings",   v:outputText(), step:g(3) },
    { k:"Pre-configuration", v:past(3) ? byId(PRECONF,S.preconf).title : null, step:g(3) },
    { k:"Extras",            v:past(4) ? extrasText() : null, step:g(4) },
    { k:"Quantity",          v:S.step >= 5 ? String(S.qty) : null, step:null }
  ];
}
function sumImgKey(){ return S.range === "12" ? "U12" : "U6"; }
function renderSummary(){
  const key = sumImgKey(), img = $("#sumImg");
  if (img.dataset.key !== key){ img.src = IMG[key]; img.dataset.key = key; }
  const r = rangeObj();
  $("#sumModel").textContent = r ? `EchoPod® UG${r.id}` : "EchoPod® UG06 / UG12";
  const bits = [r ? `${r.short} range` : null, byId(TANKS,S.tank||"")?.title, byId(LIQUIDS,S.liquid||"")?.title].filter(Boolean);
  $("#sumSub").textContent = bits.length ? bits.join(" · ") : "Your choices appear here as you go.";
  $("#sumCode").textContent = S.range || S.thread != null ? partNumber() : "";
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
  if (id === "app") return blockers().length ? "The EchoPod does not suit this application: see the note." : "Please answer all questions.";
  if (id === "range") return S.dims === "yes" && !dimsOk() ? "Please enter both tank dimensions." : "Please choose a sensor range.";
  if (id === "mount") return S.thread == null ? "Please choose the thread." : !S.mount ? "Please choose how to mount it." : (S.mount === "existing" && !S.port) ? "Please choose the port size." : "Please choose a fitting.";
  if (id === "setup") return !S.setup ? "Please choose how you set it up." : S.fob == null ? "Please choose with or without Fob." : "Please choose the display units.";
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
  if (i === 1 && !S.range && dimsOk() && recommendedRange()) S.range = recommendedRange();
  if (i === 2 && S.mount && !S.fit){ const l = fitChoices().list; if (l.length) S.fit = l[0].id; }
  S.step = i; S.maxStep = Math.max(S.maxStep, i);
  renderStep(true);
}
function refresh(){ renderStepper(); renderNav(); renderSummary(); refreshFeedback(); }
/* re-draw the range list after a dimension is typed, without losing the cursor */
function refreshRanges(){
  constrain();
  if (!S.range && dimsOk() && recommendedRange()) S.range = recommendedRange();
  if (S.step !== 1) return refresh();
  const a = document.activeElement, id = a && a.id, pos = a && a.selectionStart;
  const y = window.scrollY; $("#stage").innerHTML = VIEWS.range(); window.scrollTo(0,y);
  if (id){ const el = document.getElementById(id); if (el){ el.focus({preventScroll:true}); try { el.setSelectionRange(pos,pos); } catch {} } }
  refresh();
}

/* =====================================================================
   EVENTS
   ===================================================================== */
const RERENDER = { tank:1, foam:1, area:1, press:1, temp:1, dims:1, dimU:1, range:1, thread:1, mount:1, port:1, setup:1, display:1, power:1, preconf:1 };
document.addEventListener("change", e => {
  const t = e.target;
  if (t.type !== "radio" && t.type !== "checkbox") return;
  const n = t.name, v = t.value;
  if (n === "gland") S.gland = t.checked;
  else if (n === "setup" && S.setup !== v){ S.setup = v; S.fob = v === "webcal" ? "1" : "0"; }
  else if (n === "tank" && S.tank === "open" && v !== "open"){ S.tank = v; S.press = null; }
  else S[n] = v;
  if (["range","thread","mount","port"].includes(n)){ const l = (S.mount && (S.mount !== "existing" || S.port)) ? fitChoices().list : []; S.fit = l.length ? l[0].id : null; }
  constrain();
  S.maxStep = Math.max(S.maxStep, S.step);
  if (RERENDER[n]){
    const y = window.scrollY; $("#stage").innerHTML = VIEWS[STEPS[S.step].id](); window.scrollTo(0,y);
    const el = $(`input[name="${n}"][value="${v}"]`); if (el) el.focus({preventScroll:true});
    if (n === "dims" && v === "yes"){ const f = $("#dimH"); if (f) f.focus(); }
  }
  refresh();
});
document.addEventListener("input", e => {
  const t = e.target;
  if (t.id === "dimH" || t.id === "dimF"){ S[t.id] = t.value.replace(",", "."); refreshRanges(); }
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
  const NAVY = [61,64,69], INK = [68,68,68], GREY = [122,124,128], LINE = [214,218,222], ORANGE = [224,135,27], AMBER = [200,120,0];
  const code = partNumber();
  const today = new Date().toLocaleDateString("en-GB", { day:"2-digit", month:"long", year:"numeric" });
  const PAGE_END = 277; let y = 0;
  const T = t => pdfText(t);
  const hair = (x1, yy, x2) => { doc.setDrawColor(...LINE); doc.setLineWidth(.25); doc.line(x1, yy, x2, yy); };
  const small = (t, x, yy, o = {}) => { doc.setFont("helvetica", o.bold ? "bold" : "normal"); doc.setFontSize(o.size || 8); doc.setTextColor(...(o.color || GREY)); if (o.space) doc.setCharSpace(o.space); doc.text(T(t), x, yy, o.align ? { align:o.align } : undefined); if (o.space) doc.setCharSpace(0); };
  const newPage = () => { doc.addPage(); small(`Flowline  |  Product configuration ${code}  |  Ref. ${S.ref}`, M, 14, { size:7.5 }); hair(M, 17, W - M); y = 28; };
  const need = h => { if (y + h > PAGE_END) newPage(); };
  const section = (title, x, yy, w) => { small(title.toUpperCase(), x, yy, { size:7, bold:true, space:.5 }); hair(x, yy + 2.2, x + w); return yy + 8; };
  const item = (label, value, x, yy, w) => { small(label, x, yy, { size:7.5 }); doc.setFont("helvetica","bold"); doc.setFontSize(9.6); doc.setTextColor(...NAVY); const vl = doc.splitTextToSize(T(value || "-"), w); doc.text(vl, x, yy + 4.2); return yy + 4.2 + vl.length * 4.1 + 2.4; };
  const compact = (label, value, x, yy, w) => { small(label, x, yy, { size:7 }); doc.setFont("helvetica","bold"); doc.setFontSize(8.6); doc.setTextColor(...NAVY); const vl = doc.splitTextToSize(T(value || "-"), w); doc.text(vl, x, yy + 3.9); return yy + 3.9 + vl.length * 3.7 + 2.8; };
  const para = (t, x, yy, w, o = {}) => { doc.setFont("helvetica","normal"); doc.setFontSize(o.size || 8.6); doc.setTextColor(...(o.color || INK)); const l = doc.splitTextToSize(T(t), w); doc.text(l, x, yy); return yy + l.length * (o.lh || 4.1) + (o.gap == null ? 2 : o.gap); };
  const bullet = (t, x, yy, w, color) => { doc.setFillColor(...color); doc.rect(x, yy - 2, 1.4, 1.4, "F"); return para(t, x + 4.5, yy, w - 4.5); };

  if (logo) doc.addImage(logo, "JPEG", M, 15, 40, 40*80/274);
  small("Product configuration", W - M, 17, { size:10, bold:true, color:NAVY, align:"right" });
  small(`Ref. ${S.ref}   |   ${today}`, W - M, 22, { size:8, align:"right" });
  small("EchoPod(R) reflective ultrasonic level transmitter", W - M, 26.5, { size:8, align:"right" });
  hair(M, 32, W - M);
  y = 42;

  const IW = 32;
  if (photo) doc.addImage(photo, "JPEG", W - M - IW, y - 6, IW, IW, undefined, "FAST");
  doc.setFont("helvetica","bold"); doc.setFontSize(19); doc.setTextColor(...NAVY);
  doc.text(T(code), M, y + 4);
  let ty = y + 4 + 7.5;
  const r = rangeObj();
  small(`${r ? `EchoPod UG${r.id}, ${r.short} range` : "EchoPod"}  |  ${threadText() || ""}`, M, ty, { size:9.5 });
  ty = para("Non-contact reflective ultrasonic liquid level transmitter with 4-20 mA two-wire output, 6-digit LCD and push-button setup (or WebCal(R) software). Reflective Technology(TM) measures reliably with condensation. PVDF transducer, IP68 polypropylene enclosure.", M, ty + 6, CW - IW - 8, { size:8.6, color:GREY });
  small(codeIsFinal() ? "Part number built from the data sheet's ordering code; confirmed by Flowline in the quotation." : "\"?\" in the part number marks a choice to be confirmed.", M, ty + 1, { size:7.2 });
  y = Math.max(ty + 6, y + IW - 2);

  const R = Object.fromEntries(summaryRows(true).map(r => [r.k, r.v]));
  let yl = section("Application", X1, y, COL), yr = section("Instrument", X2, y, COL);
  yl = item("Liquid", R["Liquid"], X1, yl, COL);
  yl = item("Tank", R["Tank"], X1, yl, COL);
  yl = item("Surface", R["Surface"], X1, yl, COL);
  yl = item("Temperature and pressure", R["Process"], X1, yl, COL);
  yl = item("Area", R["Area"], X1, yl, COL);
  yr = item("Sensor", R["Sensor"], X2, yr, COL);
  yr = item("Tank dimensions", R["Tank dimensions"], X2, yr, COL);
  yr = item("Process thread  |  quantity", `${R["Process thread"]}  |  ${S.qty} pcs`, X2, yr, COL);
  yr = item("Setup", R["Setup"], X2, yr, COL);
  y = Math.max(yl, yr) + 3;

  need(40);
  y = section("Mounting, output and accessories", M, y, CW);
  yl = item("Mounting", R["Mounting"], X1, y, COL);
  yl = item("Fitting", R["Fitting"], X1, yl, COL);
  yl = item("Pre-configuration", R["Pre-configuration"], X1, yl, COL);
  yr = item("Output settings", R["Output settings"], X2, y, COL);
  yr = item("Extras", R["Extras"], X2, yr, COL);
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
  y = section("Technical data (from the Flowline EchoPod UG06 & UG12 data sheet)", M, y + 1, CW);
  yl = y; yr = y;
  SPECS.forEach(([k, v], i) => { if (i < half) yl = compact(k, v, X1, yl, COL); else yr = compact(k, v, X2, yr, COL); });

  const pages = doc.getNumberOfPages();
  doc.setPage(pages);
  small("Not a binding offer. Part number, price and availability are confirmed in a written quotation from Flowline. Specifications per data sheet DS310140 Rev A3.", M, 280.5, { size:6.8 });
  for (let p = 1; p <= pages; p++){
    doc.setPage(p); hair(M, 284, W - M);
    small("Flowline, Inc.  |  10500 Humbolt Street, Los Alamitos, CA 90720 USA  |  +1 562 598 3015  |  level.solution@flowline.com", M, 289, { size:6.8 });
    small(`${p} / ${pages}`, W - M, 289, { size:7, align:"right" });
  }
  return doc;
}
const pdfName = () => `Flowline_EchoPod_${partNumber().replace(/\?/g,"x")}_${S.ref}.pdf`;
async function downloadPdf(){
  if (!isComplete()){ toast("Please complete all steps first."); return; }
  const btns = $$("#btnPdf,#doneDownload"); btns.forEach(b => b.disabled = true);
  try {
    const logo = await loadImg(LOGO_URL, 548, 160).catch(() => null);
    const photo = await loadImg(IMG[sumImgKey()], 288, 288).catch(() => null);
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
  accessories().forEach(([c,d]) => out.push(`Accessory: ${c} ${d} (x ${S.qty})`));
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
    `Quotation request | EchoPod reflective ultrasonic level transmitter | Ref. ${S.ref}`, "",
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
  $("#quoteChip").textContent = `${partNumber()} × ${S.qty}${accessories().length ? ` + ${accessories().length} accessor${accessories().length > 1 ? "ies" : "y"}` : ""}`;
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
  $("#faqCta").href = `mailto:${DEMO_CONTACT.email}?subject=${encodeURIComponent("Configurator enquiry (from the Flowline demo)")}`;
  $("#faqContact").innerHTML = `Or write to <a href="mailto:${DEMO_CONTACT.email}">${DEMO_CONTACT.email}</a> · <a href="${DEMO_CONTACT.site}" target="_blank" rel="noopener">swiftyquote.com</a>`;
})();

window.__cfg = { get S(){ return S; }, set S(v){ S = v; }, newState, go, partNumber, accessories, getNotes, blockers, buildPdf, buildMailto, quoteText, isComplete, renderStep, constrain, rangeOffWhy, mountOffWhy, fitChoices, validStep, loadImg, IMG, LOGO_URL };
renderStep(false);
