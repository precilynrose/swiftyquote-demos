"use strict";

/* =====================================================================
   SETTINGS: adjust these lines for your own set-up
   ===================================================================== */
const SETTINGS = {
  QUOTE_EMAIL: "sales@swiftyquote.com",      // where quotation requests are sent (Blue-White sales)
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
    a:"<p>The product data and photos belong to Blue-White Industries and are used here for demonstration only. This page is not an official Blue-White tool and you cannot place orders on it. Please contact Blue-White Industries directly for real enquiries about the F-1000.</p>" },
  { q:"Can you build this for my own products?",
    a:"<p>Yes. The configurator is built around your product range, your options and your rules, and it takes on your branding: your logo, colours and fonts. It works for anything a buyer has to specify before they can get a quote, such as range, power, approvals, outputs or accessories.</p>" },
  { q:"What do you need from me to get started?",
    a:"<ul><li>A link to the product page, or the datasheets and catalogue.</li><li>Your logo and brand guidelines (or we take them from your website).</li><li>The options a buyer can choose, and any rules, such as which combinations are possible or which approvals apply.</li><li>The email address (or system) where quotation requests should go.</li></ul>" },
  { q:"How much does it cost?",
    a:"<p>The price depends on how many products and options are covered, whether you need extra languages, and whether it should connect to your other systems. We give you a fixed quote after a short conversation, so there are no surprises.</p><p>Write to <a href=\"mailto:sales@swiftyquote.com?subject=Configurator%20price%20enquiry\">sales@swiftyquote.com</a> with a link to your product and we will come back with a price.</p>" },
  { q:"How long does implementation take?",
    a:"<p>The timeline depends on the size of your range and the features you choose. A single-product configurator like this one is quicker than a full catalogue with several product families. You receive a clear timeline together with your quote, and you see a first working version early so you can give feedback before we finish.</p>" },
  { q:"Can it use our branding and languages?",
    a:"<p>Yes. This demo already follows the Blue-White Industries colours and fonts. Your version follows yours. Additional languages can be added.</p>" },
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

const IMG = { MOLDED:"__IMG_MOLDED__", PVC:"__IMG_PVC__", SADDLE:"__IMG_SADDLE__" };
const LOGO_URL = "";

/* =====================================================================
   PRODUCT DATA
   Source: blue-white.com F-1000 product page and datasheet "F-1000 Engineering and Technical Data"
   (P.N. 85000-170 rev 9, 4 pages: specifications p2, ordering information p3, model number matrix p4).
   Model number: [variation]-[pipe size][fitting type]-[units][range]-[O-rings][pipe fitting]
   Sample from the datasheet: RB-375MI-GPM1
   ===================================================================== */
const APPS = [
  { id:"water",  title:"Water or wastewater treatment", desc:"Treated water, filtration, RO and process lines." },
  { id:"dose",   title:"Chemical feed and dosing",      desc:"Monitoring a metering pump or a chemical line." },
  { id:"irr",    title:"Irrigation and agriculture",    desc:"Fertigation, greenhouse and field irrigation." },
  { id:"pool",   title:"Pools and aquatics",            desc:"Circulation and filter flow." },
  { id:"cool",   title:"Cooling or process water",      desc:"Cooling towers, chillers, wash water." },
  { id:"other",  title:"Something else",                desc:"We will look at it together with you." }
];
const FLUIDS = [
  { id:"water", title:"Water",                         desc:"Clean or treated water." },
  { id:"mix",   title:"Water with added chemicals",    desc:"For example chlorinated water or fertilizer solution." },
  { id:"chem",  title:"A chemical solution",           desc:"Acid, caustic, hypochlorite or another chemical." },
  { id:"unk",   title:"Not sure",                      desc:"We will check it with you." }
];
/* [low, high] °F used for the temperature / pressure check */
const TEMPS = [
  { id:"t70",  title:"Up to 70 °F (21 °C)",          desc:"Full 300 psi rating.", lo:32,  hi:70, badge:"Most common" },
  { id:"t105", title:"70 to 105 °F (21 to 40 °C)",   desc:"Pressure rating reduces as temperature rises.", lo:70, hi:105 },
  { id:"t140", title:"105 to 140 °F (40 to 60 °C)",  desc:"PVC parts reach their limit at 140 °F.", lo:105, hi:140 },
  { id:"t200", title:"140 to 200 °F (60 to 93 °C)",  desc:"Polypropylene tees and PVDF saddles only.", lo:140, hi:200 },
  { id:"thot", title:"Above 200 °F (93 °C)",         desc:"Above the F-1000 rating.", flag:"high" },
  { id:"tunk", title:"Not sure",                     desc:"We will check it with you." }
];
const PRESS = [
  { id:"p50",   title:"Up to 50 psi (3.4 bar)",          lo:0,   hi:50 },
  { id:"p100",  title:"50 to 100 psi (3.4 to 6.9 bar)",  lo:50,  hi:100 },
  { id:"p150",  title:"100 to 150 psi (6.9 to 10.3 bar)", lo:100, hi:150 },
  { id:"p300",  title:"150 to 300 psi (10.3 to 20.7 bar)", lo:150, hi:300 },
  { id:"phigh", title:"Above 300 psi (20.7 bar)",        desc:"Above the F-1000 rating.", flag:"high" },
  { id:"punk",  title:"Not sure",                        desc:"We will check it with you." }
];
/* maximum fluid temperature at 0 psi per material (datasheet p2); 300 psi at 70 °F, linear between (temp/pressure graph) */
const TMAX = { PP:200, PVDF:200, PVC:140 };
const MAT_NAME = { PP:"Polypropylene", PVDF:"PVDF", PVC:"PVC" };
const matLow = m => m === "PP" ? "polypropylene" : MAT_NAME[m];

const TYPES = [
  { id:"MI", fam:"molded", title:"Molded inline tee, male NPT threads", desc:"Polypropylene body, 3/8″ to 2″ M/NPT. Up to 8 psi pressure drop.", img:"MOLDED" },
  { id:"MB", fam:"molded", title:"Molded inline tee, male BSPT threads", desc:"Polypropylene body, 3/8″ to 2″ M/BSPT. Up to 8 psi pressure drop.", img:"MOLDED" },
  { id:"AT", fam:"tee",    title:"PVC tee, solvent weld (slip/socket)", desc:"Molded PVC tee for 1″, 1-1/2″, 2″ and 3″ PVC pipe.", img:"PVC" },
  { id:"S4", fam:"ips",    title:"Saddle on Schedule 40 pipe (PVC or iron)", desc:"1-1/2″ to 12″ IPS. No pressure drop.", img:"SADDLE" },
  { id:"S8", fam:"ips",    title:"Saddle on Schedule 80 PVC pipe", desc:"1-1/2″ to 12″ IPS. No pressure drop.", img:"SADDLE" },
  { id:"P0", fam:"din",    title:"Saddle on metric PN10 pipe (DIN 8062)", desc:"50 to 315 mm. No pressure drop.", img:"SADDLE" },
  { id:"P6", fam:"din",    title:"Saddle on metric PN16 pipe (DIN 8062)", desc:"50 to 200 mm. No pressure drop.", img:"SADDLE" }
];
/* star: 1 = not in LPD, 2 = not in GPD or LPD, 3 = not in GPD, LPD or LPH (datasheet p3 footnotes) */
const SIZES = {
  /* molded in-line, polypropylene: [size, code, GPM, LPM, m3/h, range digit] -> fitting number e.g. 38M1 / 38MB1 */
  molded: [
    ["3/8″","375",[.8,8],[3,30],[0.2,1.8],1,"38"], ["3/8″","375",[.4,4],[1,10],[0.1,0.6],2,"38"],
    ["1/2″","500",[2,20],[7,70],[0.4,4.2],1,"50"], ["3/4″","750",[3,30],[11,110],[0.7,6.6],1,"75"],
    ["1″","100",[5,50],[20,200],[1.2,12],1,"10"], ["1-1/2″","150",[6,60],[25,250],[1.5,15],2,"15"],
    ["2″","200",[10,100],[40,400],[2.4,24],3,"20"], ["2″","200",[20,200],[70,700],[4.2,42],4,"20"]
  ].map(([size,code,gpm,lpm,m3h,range,fn]) => ({ key:`${code}-${range}`, size, code, gpm, lpm, m3h, range, fn, mat:"PP", star:0 })),
  /* PVC solvent weld tee */
  tee: [
    ["1″","100",[6,60],[25,250],0,"10AT"], ["1-1/2″","150",[15,150],[60,600],0,"15AT"],
    ["2″","200",[30,300],[100,1000],1,"20AT"], ["3″","300",[60,600],[230,2300],1,"30AT"]
  ].map(([size,code,gpm,lpm,star,fn]) => ({ key:`${code}-1`, size, code, gpm, lpm, m3h:null, range:1, fn, mat:"PVC", star })),
  /* saddles, IPS: fitting number [Sch 40, Sch 80] */
  ips: [
    ["1-1/2″","150",[15,150],[3.5,34.5],"PVDF",0,"15K"], ["2″","200",[30,300],[6.9,69],"PVDF",0,"20K"],
    ["2-1/2″","250",[40,400],[9.2,92],"PVC",1,"25A"], ["3″","300",[60,600],[13.8,138],"PVDF",1,"30K"],
    ["4″","400",[100,1000],[23,230],"PVC",2,"40A"], ["6″","600",[250,2500],[57.5,575],"PVC",2,"60A"],
    ["8″","800",[400,4000],[92,920],"PVC",2,"80A"], ["10″","1000",[600,6000],[138,1380],"PVC",3,"100A"],
    ["12″","1200",[800,8000],[184,1840],"PVC",3,"120A"]
  ].map(([size,code,gpm,m3h,mat,star,fn]) => ({ key:`${code}-1`, size, code, gpm, lpm:null, m3h, range:1, fn, mat, star })),
  /* saddles, DIN 8062 metric: fitting number [PN10, PN16] */
  din: [
    ["50 mm","050",[70,700],[4.2,42],"PVDF",0,"05K",1], ["63 mm","063",[110,1100],[6.6,66],"PVDF",1,"06K",1],
    ["75 mm","075",[150,1500],[9,90],"PVC",1,"08A",1], ["90 mm","090",[230,2300],[13.8,138],"PVDF",1,"09K",1],
    ["110 mm","110",[350,3500],[21,210],"PVC",2,"11A",1], ["160 mm","160",[720,7200],[43.2,432],"PVC",2,"16A",1],
    ["200 mm","200",[1150,11500],[69,690],"PVC",2,"20A",1], ["250 mm","250",[1700,17000],[102,1020],"PVC",3,"25A",0],
    ["315 mm","315",[2700,27000],[162,1620],"PVC",3,"31A",0]
  ].map(([size,code,lpm,m3h,mat,star,fn,pn16]) => ({ key:`${code}-1`, size, code, gpm:[+(lpm[0]/3.78541).toFixed(1), +(lpm[1]/3.78541).toFixed(0)], lpm, m3h, range:1, fn, mat, star, pn16:!!pn16, metric:true }))
};

const VARS = [
  { id:"RB", title:"Flow rate only",            desc:"Shows the current flow rate." },
  { id:"TB", title:"Total only",                desc:"Shows the total volume that has passed." },
  { id:"RT", title:"Flow rate and total",       desc:"Shows both; the Mode button switches between them.", badge:"Most choice" }
];
/* calibration units, model matrix p4; k = factor from US gallons per minute */
const UNITS = [
  { id:"GPM", title:"US gallons per minute", k:1 },
  { id:"GPH", title:"US gallons per hour",   k:60 },
  { id:"GPD", title:"US gallons per day",    k:1440 },
  { id:"OZM", title:"US ounces per minute",  k:128 },
  { id:"CFM", title:"Cubic feet per minute", k:0.133681 },
  { id:"AFD", title:"Acre-feet per day",     k:1440/325851 },
  { id:"LPM", title:"Liters per minute",     k:3.78541 },
  { id:"LPH", title:"Liters per hour",       k:227.125 },
  { id:"LPD", title:"Liters per day",        k:5450.99 },
  { id:"M3H", title:"Cubic meters per hour", k:0.227125 },
  { id:"IGM", title:"Imperial gallons per minute", k:0.832674 },
  { id:"IGH", title:"Imperial gallons per hour",   k:49.9604 }
];
const ORINGS = [
  { id:"std", code:"",  title:"FKM O-rings", desc:"Standard sensor seals.", badge:"Standard" },
  { id:"E",   code:"E", title:"EPDM O-rings", desc:"Option E. Often chosen for some chemicals, such as certain caustics." }
];
const FITS = [
  { id:"std", code:"",  title:"Meter with pipe fitting", desc:"The fitting you chose in step 2 is included.", badge:"Standard" },
  { id:"P",   code:"P", title:"Meter without pipe fitting", desc:"Option P. For example to replace a meter on a fitting that is already installed." }
];

const SPECS = [
  ["Measuring principle", "Digital paddlewheel; 6-digit LCD, up to 4 decimal places; tamper-proof factory programming"],
  ["Flow range",          ".4 to 8,000 GPM (1 to 27,000 LPM), depending on fitting and size"],
  ["Accuracy",            "+/-2% of full scale"],
  ["Max working pressure","300 psi (20.7 bar) at 70 F; derated with temperature"],
  ["Max fluid temperature","200 F at 0 psi (PP tees, PVDF saddles); 140 F at 0 psi (PVC saddles and tees)"],
  ["Ambient temperature", "14 to 110 F (-10 to 43 C)"],
  ["Pressure drop",       "Up to 8 psi (polypropylene tees); none on saddle models"],
  ["Wetted materials",    "Sensor, paddlewheel and axle PVDF; O-rings FKM (EPDM optional); fitting PP, PVC or PVDF"],
  ["Power",               "2 AAA batteries (included)"],
  ["Enclosure",           "ABS, NEMA 4X (IP56); RoHS and BABAA compliant"]
];

/* =====================================================================
   STATE
   ===================================================================== */
const STEPS = [
  { id:"app",     label:"Application" },
  { id:"install", label:"Pipe & fitting" },
  { id:"display", label:"Display" },
  { id:"extras",  label:"Seals & extras" },
  { id:"review",  label:"Review" }
];
const $ = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => [...el.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const byId = (arr,id) => arr.find(x => x.id === id);

function newState(){
  return { step:0, maxStep:0, app:null, fluid:null, temp:null, press:null, flow:"",
           type:null, size:null, vari:null, unit:null, oring:"std", fit:"std",
           qty:1, notes:"", ref:makeRef(), helpOpen:{} };
}
function makeRef(){
  const d = new Date(), p = n => String(n).padStart(2,"0");
  const rnd = Math.random().toString(36).slice(2,6).toUpperCase();
  return `BW-${String(d.getFullYear()).slice(2)}${p(d.getMonth()+1)}${p(d.getDate())}-${rnd}`;
}
let S = newState();

/* ---------- rules ---------- */
const typeObj = () => byId(TYPES, S.type || "");
function sizeList(t){ const o = byId(TYPES, t || ""); if (!o) return []; return SIZES[o.fam].filter(s => !(t === "P6" && !s.pn16)); }
const sizeObj = () => sizeList(S.type).find(s => s.key === S.size) || null;
function flowNum(){ const v = String(S.flow).trim().replace(",", "."); if (!v) return null; return /^\d+(\.\d+)?$/.test(v) && +v > 0 && +v <= 30000 ? +v : NaN; }
const flowValid = () => !Number.isNaN(flowNum());
/* pressure allowed at temperature T (°F) for a material, from the temperature/pressure graph */
function maxPsi(mat, T){ const tm = TMAX[mat]; if (T <= 70) return 300; if (T >= tm) return 0; return 300 * (tm - T) / (tm - 70); }
/* "off" = clearly outside the rating, "check" = only the top of the chosen bands is outside, null = fine */
function ptStatus(mat){
  const t = byId(TEMPS, S.temp || ""), p = byId(PRESS, S.press || "");
  if (!t || !p || t.lo == null || p.lo == null) return null;
  if (t.lo >= TMAX[mat] && t.lo > 70) return "off";
  if (p.lo > maxPsi(mat, t.lo)) return "off";
  if (p.hi > maxPsi(mat, t.hi)) return "check";
  return null;
}
function sizeOffWhy(s){
  const st = ptStatus(s.mat);
  if (st === "off") return `${MAT_NAME[s.mat]} is not rated for your temperature and pressure (max. ${TMAX[s.mat]} °F at 0 psi, 300 psi at 70 °F).`;
  const f = flowNum();
  if (f && (f < s.gpm[0] || f > s.gpm[1])) return `Your flow of ${fmt(f)} GPM is outside this range (${rangeTxt(s)}).`;
  return null;
}
function typeOffWhy(t){
  const list = sizeList(t.id);
  if (list.every(s => sizeOffWhy(s))){
    const f = flowNum();
    if (f && list.every(s => f < s.gpm[0] || f > s.gpm[1])) return `No size of this fitting covers ${fmt(f)} GPM.`;
    return "Not rated for your temperature and pressure.";
  }
  return null;
}
function unitOffWhy(u){
  const s = sizeObj(); if (!s) return null;
  if (s.star >= 1 && u.id === "LPD") return "Not available for this pipe size: the total would exceed the 6-digit display.";
  if (s.star >= 2 && u.id === "GPD") return "Not available for this pipe size: the total would exceed the 6-digit display.";
  if (s.star >= 3 && u.id === "LPH") return "Not available for this pipe size: the total would exceed the 6-digit display.";
  return null;
}
/* not excluded by the datasheet footnotes, but the full-scale value has more than 6 digits */
function unitDigitsCheck(){
  const s = sizeObj(), u = byId(UNITS, S.unit || ""); if (!s || !u) return false;
  const maxGpm = s.lpm ? s.lpm[1] / 3.78541 : s.gpm[1];
  return maxGpm * u.k > 999999;
}
function constrain(){
  if (S.type && typeOffWhy(typeObj())) { S.type = null; }
  if (S.size && (!sizeObj() || sizeOffWhy(sizeObj()))) S.size = null;
  const u = byId(UNITS, S.unit || ""); if (u && unitOffWhy(u)) S.unit = null;
}

/* ---------- derived values ---------- */
const fmt = n => (+n).toLocaleString("en-US", { maximumFractionDigits:2 });
function rangeTxt(s){ return `${fmt(s.gpm[0])} to ${fmt(s.gpm[1])} GPM`; }
function rangeLong(s){
  const bits = [s.metric ? `${fmt(s.lpm[0])} to ${fmt(s.lpm[1])} LPM` : rangeTxt(s)];
  if (s.lpm && !s.metric) bits.push(`${fmt(s.lpm[0])} to ${fmt(s.lpm[1])} LPM`);
  if (s.metric) bits.push(`approx. ${rangeTxt(s)}`);
  if (s.m3h) bits.push(`${fmt(s.m3h[0])} to ${fmt(s.m3h[1])} m³/h`);
  return bits.join(" · ");
}
function rangeOther(s){ return rangeLong(s).split(" · ").slice(1).join(" · "); }
function fittingNo(){
  const s = sizeObj(); if (!s) return null;
  if (S.type === "MI") return `${s.fn}M${s.range}`;
  if (S.type === "MB") return `${s.fn}MB${s.range}`;
  if (S.type === "AT") return s.fn;
  return s.fn + ({ S4:"4", S8:"8", P0:"0", P6:"6" })[S.type];
}
function suffix(){ return (byId(ORINGS, S.oring) || {}).code + (byId(FITS, S.fit) || {}).code; }
function partNumber(){
  const s = sizeObj();
  const v = S.vari || "??", sz = s ? s.code : "???", t = S.type || "??", u = S.unit || "???", r = s ? s.range : "?";
  const sfx = suffix();
  return `${v}-${sz}${t}-${u}${r}${sfx ? "-" + sfx : ""}`;
}
const codeIsFinal = () => !partNumber().includes("?");
function sizeText(){ const s = sizeObj(); if (!s) return null; return `${s.size}, ${rangeTxt(s)}${S.type && byId(TYPES,S.type).fam === "molded" ? ` (range ${s.range})` : ""}`; }
function flowText(){ const f = flowNum(); if (f === null) return "Not given"; if (Number.isNaN(f)) return null; return `${fmt(f)} GPM (${fmt(f * 3.78541)} LPM)`; }
function matText(){ const s = sizeObj(); if (!s) return null; return `${MAT_NAME[s.mat]} ${byId(TYPES,S.type).fam === "ips" || byId(TYPES,S.type).fam === "din" ? "saddle" : "body"}`; }
function displayText(){ const v = byId(VARS, S.vari || ""); return v ? v.title : null; }
function unitText(){ const u = byId(UNITS, S.unit || ""); return u ? `${u.title} (${u.id})` : null; }
function extrasText(){ return `${byId(ORINGS,S.oring).title}; ${byId(FITS,S.fit).title.toLowerCase()}`; }

function validStep(id){
  switch(id){
    case "app":     return !!(S.app && S.fluid && S.temp && S.press && flowValid());
    case "install": return !!(S.type && S.size);
    case "display": return !!(S.vari && S.unit);
    case "extras":  return !!(S.oring && S.fit);
    default:        return true;
  }
}
const isComplete = () => STEPS.slice(0,-1).every(s => validStep(s.id));

function getNotes(){
  const warn = [], info = [];
  const s = sizeObj(), t = typeObj();
  if (S.temp === "thot") warn.push("Your liquid is hotter than 200 °F, above the F-1000 rating. Please talk to Blue-White before ordering.");
  if (S.temp === "tunk") warn.push("Fluid temperature to be confirmed: it sets the pressure rating of the fitting.");
  if (S.press === "phigh") warn.push("Your pressure is above the F-1000 maximum of 300 psi (20.7 bar). Please talk to Blue-White before ordering.");
  if (S.press === "punk") warn.push("Operating pressure to be confirmed against the temperature/pressure graph.");
  if (s && ptStatus(s.mat) === "check") warn.push(`At the top of your temperature and pressure ranges the ${matLow(s.mat)} ${t.fam === "molded" || t.fam === "tee" ? "tee" : "saddle"} is outside its rating (${Math.round(maxPsi(s.mat, byId(TEMPS,S.temp).hi))} psi max. at ${byId(TEMPS,S.temp).hi} °F). To be checked against the datasheet graph.`);
  if (S.fluid === "chem" || S.fluid === "mix") warn.push(`Chemical compatibility to be confirmed: wetted parts are PVDF (sensor, paddlewheel, axle), ${S.oring === "E" ? "EPDM" : "FKM"} O-rings${s ? ` and a ${matLow(s.mat)} fitting` : ""}.`);
  if (S.fluid === "unk") warn.push("Liquid to be confirmed with you (chemical compatibility of the wetted parts).");
  if (S.app === "other") warn.push("Application to be clarified with you before quotation.");
  if (unitDigitsCheck()) warn.push(`The full-scale value in ${S.unit} would have more than 6 digits. The datasheet says such calibrations may not be available: to be confirmed with the manufacturer.`);
  if (suffix()) warn.push(`Option suffix "-${suffix()}" written as in the datasheet's model number matrix; exact format to be confirmed with the manufacturer.`);
  if (S.fit === "P") warn.push("Without pipe fitting (option P): please tell us which existing fitting the meter will be mounted on.");
  if (S.type === "S4") info.push("Schedule 40 saddles fit PVC or iron pipe.");
  if (t && (t.fam === "ips" || t.fam === "din")) info.push("Saddle models cause no pressure drop. Saddle fittings over 3″ and 90 mm are PVC; 1-1/2″, 2″, 3″, 50, 63 and 90 mm are PVDF.");
  if (t && t.fam === "molded") info.push("Molded polypropylene tees cause a pressure drop of up to 8 psi, depending on size and flow.");
  if (S.vari === "TB" || S.vari === "RT") info.push("The totalizer can be reset; the reset function can also be disabled.");
  if (S.temp && S.temp !== "thot") info.push("The temperature rating is for the F-1000 only; the rating of your pipe may differ.");
  info.push("Accuracy +/-2% of full scale. Powered by 2 AAA batteries (included). NEMA 4X (IP56) enclosure.");
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
    const bad = !flowValid();
    return `<div class="step">
      ${head(1,"What will the F-1000 measure?","A battery-powered paddlewheel meter with a 6-digit display for liquid lines from 3/8″ to 12″. Tell us about your liquid first.")}
      ${group("Where is it used?", null, radios("app", APPS))}
      ${group("Which liquid flows through it?", "The sensor, paddlewheel and axle are PVDF.", radios("fluid", FLUIDS))}
      ${group("Highest fluid temperature", "The F-1000 is rated up to 200 °F (93 °C) at 0 psi, depending on the fitting material.", radios("temp", TEMPS))}
      ${group("Highest operating pressure", "Up to 300 psi (20.7 bar) at 70 °F; the rating reduces as temperature rises.", radios("press", PRESS))}
      <div class="group"><div class="group__title">Normal flow rate</div><div class="group__sub">Helps us show only the pipe sizes whose range covers your flow. Leave empty if you do not know.</div>
        <div class="inline-field" style="margin-top:12px"><label class="field"><span class="l">Normal flow, US gallons per minute (optional)</span><span class="unit-input"><input id="flow" type="text" inputmode="decimal" value="${esc(S.flow)}" placeholder="e.g. 25" ${bad?'aria-invalid="true" class="invalid"':""}><em>GPM</em></span></label></div></div>
      ${helpHtml("app","Why do temperature and pressure matter?",`<p>The pipe fittings are plastic. At 70 °F (21 °C) every fitting handles 300 psi. As the liquid gets warmer, the allowed pressure drops in a straight line to 0 psi at <strong>140 °F</strong> for PVC parts and at <strong>200 °F</strong> for polypropylene tees and PVDF saddles.</p><p>If you are not sure, choose the higher band: we will check it with you.</p>`)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  install(){
    const list = sizeList(S.type);
    return `<div class="step">
      ${head(2,"How is it fitted to your pipe?","Choose the fitting style first, then the pipe size. Each size covers its own flow range.")}
      ${group("Fitting style", null, TYPES.map(t => { const why = typeOffWhy(t);
        return optHtml({ name:"type", value:t.id, checked:S.type===t.id, title:t.title, desc:why || t.desc, meta:`Code ${t.id}`, off:!!why }); }).join(""), "opts--wide")}
      ${S.type ? group("Pipe size and flow range", typeObj().fam === "molded" ? "Some sizes come in two flow ranges: pick the one around your flow." : "Pick the size of your pipe.",
        list.map(s => { const why = sizeOffWhy(s);
          return optHtml({ name:"size", value:s.key, checked:S.size===s.key, title:`${s.size}${s.metric ? "" : " pipe"} · ${s.metric ? `${fmt(s.lpm[0])}–${fmt(s.lpm[1])} LPM` : `${fmt(s.gpm[0])}–${fmt(s.gpm[1])} GPM`}`,
            desc:why || `${rangeOther(s)}. ${MAT_NAME[s.mat]} ${typeObj().fam === "ips" || typeObj().fam === "din" ? "saddle" : "body"}.`, meta:`Fitting ${S.type === "MI" ? s.fn + "M" + s.range : S.type === "MB" ? s.fn + "MB" + s.range : S.type === "AT" ? s.fn : s.fn + ({S4:"4",S8:"8",P0:"0",P6:"6"})[S.type]}`, off:!!why }); }).join("")) : ""}
      ${helpHtml("install","Inline tee or saddle?",`<ul><li><strong>Molded inline tees</strong> (3/8″ to 2″) screw into the line with male NPT or BSPT threads. Simple and low cost, with a small pressure drop.</li><li><strong>PVC tees</strong> are glued into PVC pipe (solvent weld).</li><li><strong>Saddles</strong> clamp onto a larger existing pipe (1-1/2″ to 12″, or 50 to 315 mm) over a drilled hole. No pressure drop.</li></ul>`)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  display(){
    return `<div class="step">
      ${head(3,"What should the display show?","The meter is programmed at the factory for your units. The 6-digit LCD shows up to 4 decimal places.")}
      ${group("Display function", null, radios("vari", VARS, v => ({ meta:v.id })))}
      ${group("Units on the display", sizeObj() ? `Some units are not available for ${sizeObj().size} because the total would need more than 6 digits.` : null,
        UNITS.map(u => { const why = unitOffWhy(u);
          return optHtml({ name:"unit", value:u.id, checked:S.unit===u.id, title:u.title, desc:why, meta:u.id, badge:u.id === "GPM" ? "Most common" : null, off:!!why }); }).join(""))}
      ${helpHtml("display","Rate, total or both?",`<p><strong>Flow rate</strong> tells you how fast the liquid flows right now, for example 25 GPM. <strong>Total</strong> counts the volume that has passed, like a water meter: useful for billing, batching or checking chemical use. <strong>Rate and total</strong> gives you both.</p>`)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  extras(){
    return `<div class="step">
      ${head(4,"Seals and pipe fitting","Both have a standard choice. Change them only if you need to.")}
      ${group("Sensor O-rings", null, radios("oring", ORINGS, o => ({ meta:o.code ? `-${o.code}` : null })), "opts--wide")}
      ${group("Pipe fitting", null, radios("fit", FITS, o => ({ meta:o.code ? `-${o.code}` : null })), "opts--wide")}
      ${helpHtml("extras","FKM or EPDM?",`<p>FKM is the standard and suits water and many chemicals. EPDM is an alternative for some chemicals where FKM is not recommended. If you are unsure, tell us the chemical in the notes: confirm with the manufacturer the right seal.</p>`)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  review(){
    const rows = summaryRows(true), n = getNotes();
    return `<div class="step">
      ${head(5,"Review your configuration","Check everything below. You can change any answer, then download the PDF or ask for a quotation.")}
      <div class="code-box"><div class="k">Model number</div><div class="v">${esc(partNumber())}</div><div class="s">${codeIsFinal() ? "Built from the datasheet's model number matrix. Illustrative only: confirm with the manufacturer." : "“?” marks a choice we will confirm with you."}</div></div>
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
        <label class="field"><span class="l">Notes for our team (optional)</span><textarea id="notes" placeholder="e.g. chemical name and concentration, tag numbers, existing meter model, delivery date…">${esc(S.notes)}</textarea></label>
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
    const out = [], f = flowNum();
    if (Number.isNaN(f)) out.push(msg("warn","Please enter the flow as a number of US gallons per minute, or leave it empty."));
    else if (f) out.push(msg("ok",`${fmt(f)} GPM is ${fmt(f * 3.78541)} LPM or ${fmt(f * 0.227125)} m³/h. Sizes that cover it are shown in the next step.`));
    if (S.temp === "t200") out.push(msg("info","Above 140 °F only the polypropylene tees and the PVDF saddles can be used."));
    getNotes().warn.filter(w => /above the F-1000|to be confirmed: it sets|Operating pressure to be confirmed/.test(w)).forEach(w => out.push(msg("warn",w)));
    return out.join("");
  },
  install(){
    const out = [], s = sizeObj();
    if (s) out.push(msg("ok",`Fitting ${fittingNo()}: ${s.size}, ${rangeLong(s)}, ${MAT_NAME[s.mat]}.`));
    if (s && ptStatus(s.mat) === "check") out.push(msg("warn",getNotes().warn.find(w => /top of your temperature/.test(w))));
    if (S.type && !s && flowNum()) out.push(msg("info","Sizes whose range does not cover your flow are greyed out."));
    return out.join("");
  },
  display(){
    const out = [];
    if (S.vari && S.unit) out.push(msg("ok",`Your model number so far: ${partNumber()}.`));
    if (unitDigitsCheck()) out.push(msg("warn",getNotes().warn.find(w => /6 digits/.test(w))));
    return out.join("");
  },
  extras(){
    const out = [];
    if (S.fit === "P") out.push(msg("warn","Without pipe fitting (option P): please tell us which existing fitting the meter will be mounted on."));
    if (S.fluid === "chem" || S.fluid === "mix") out.push(msg("info","For chemicals, add the chemical name and concentration in the notes on the last step."));
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
    { k:"Application",        v:byId(APPS,S.app||"")?.title || null, step:g(0) },
    { k:"Liquid",             v:byId(FLUIDS,S.fluid||"")?.title || null, step:g(0) },
    { k:"Fluid temperature",  v:byId(TEMPS,S.temp||"")?.title || null, step:g(0) },
    { k:"Operating pressure", v:byId(PRESS,S.press||"")?.title || null, step:g(0) },
    { k:"Normal flow",        v:past(0) ? flowText() : null, step:g(0) },
    { k:"Fitting style",      v:typeObj()?.title || null, step:g(1) },
    { k:"Pipe size & range",  v:sizeText(), step:g(1) },
    { k:"Fitting number",     v:fittingNo() ? `${fittingNo()} (${matText()})` : null, step:g(1) },
    { k:"Display",            v:displayText(), step:g(2) },
    { k:"Units",              v:unitText(), step:g(2) },
    { k:"Seals & fitting",    v:past(3) ? extrasText() : null, step:g(3) },
    { k:"Quantity",           v:S.step >= 4 ? String(S.qty) : null, step:null }
  ];
}
function sumImgKey(){ return typeObj() ? typeObj().img : "MOLDED"; }
function renderSummary(){
  const key = sumImgKey(), img = $("#sumImg");
  if (img.dataset.key !== key){ img.src = IMG[key]; img.dataset.key = key; }
  const s = sizeObj();
  $("#sumModel").textContent = S.vari ? `F-1000-${S.vari} ${byId(VARS,S.vari).title.toLowerCase()}` : "F-1000 paddlewheel flow meter";
  const bits = [s ? `${s.size} ${typeObj().fam === "ips" || typeObj().fam === "din" ? "saddle" : "tee"}` : null, s ? rangeTxt(s) : null].filter(Boolean);
  $("#sumSub").textContent = bits.length ? bits.join(" · ") : "Your choices appear here as you go.";
  $("#sumCode").textContent = S.type || S.vari ? partNumber() : "";
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
  if (id === "app") return !flowValid() ? "Please check the flow rate." : "Please answer all questions.";
  if (id === "install") return !S.type ? "Please choose a fitting style." : "Please choose a pipe size.";
  if (id === "display") return !S.vari ? "Please choose the display function." : "Please choose the units.";
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
const RERENDER = { temp:1, press:1, type:1, size:1, fluid:0, app:0, vari:0, unit:0, oring:0, fit:1 };
document.addEventListener("change", e => {
  const t = e.target;
  if (t.type !== "radio" && t.type !== "checkbox") return;
  const n = t.name, v = t.value;
  if (n === "type" && S.type !== v){ S.type = v; S.size = null; }
  else S[n] = v;
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
  if (t.id === "flow"){ S.flow = t.value; const bad = !flowValid(); t.classList.toggle("invalid", bad); if (bad) t.setAttribute("aria-invalid","true"); else t.removeAttribute("aria-invalid"); constrain(); refresh(); }
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
  .replace(/[“”]/g,'"').replace(/[’‘]/g,"'").replace(/™/g,"(TM)").replace(/®/g,"(R)").replace(/²/g,"2").replace(/³/g,"3").replace(/Ω/g,"ohm")
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
  const NAVY = [22,48,79], INK = [51,51,51], GREY = [122,124,128], LINE = [214,218,222], BLUE = [0,94,184], AMBER = [200,120,0];
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
  small("F-1000 digital paddlewheel flow meter", W - M, 26.5, { size:8, align:"right" });
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
  small(`${sizeText()}  |  ${typeObj().title}`, M, ty, { size:9.5 });
  ty = para("Battery-powered digital paddlewheel flow meter with a 6-digit LCD (up to 4 decimal places), tamper-proof factory programming and a resettable totalizer on totalizing models. NEMA 4X (IP56) enclosure.", M, ty + 6, CW - IW - 8, { size:8.6, color:GREY });
  small(codeIsFinal() ? "Model number built from the datasheet's model number matrix; illustrative only, confirm with the manufacturer." : "\"?\" in the model number marks a choice to be confirmed.", M, ty + 1, { size:7.2 });
  y = Math.max(ty + 6, y + IW - 2);

  const R = Object.fromEntries(summaryRows(true).map(r => [r.k, r.v]));
  let yl = section("Application", X1, y, COL), yr = section("Flow meter", X2, y, COL);
  yl = item("Application", R["Application"], X1, yl, COL);
  yl = item("Liquid", R["Liquid"], X1, yl, COL);
  yl = item("Highest fluid temperature", R["Fluid temperature"], X1, yl, COL);
  yl = item("Highest operating pressure", R["Operating pressure"], X1, yl, COL);
  yl = item("Normal flow", R["Normal flow"], X1, yl, COL);
  yr = item("Fitting style", R["Fitting style"], X2, yr, COL);
  yr = item("Pipe size and flow range", R["Pipe size & range"], X2, yr, COL);
  yr = item("Fitting number", R["Fitting number"], X2, yr, COL);
  yr = item("Display  |  units", `${R["Display"]}  |  ${R["Units"]}`, X2, yr, COL);
  yr = item("Seals and fitting  |  quantity", `${R["Seals & fitting"]}  |  ${S.qty} pcs`, X2, yr, COL);
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
  y = section("Technical data (from the Blue-White F-1000 datasheet)", M, y + 1, CW);
  yl = y; yr = y;
  SPECS.forEach(([k, v], i) => { if (i < half) yl = compact(k, v, X1, yl, COL); else yr = compact(k, v, X2, yr, COL); });

  const pages = doc.getNumberOfPages();
  doc.setPage(pages);
  small("Demo only, not for ordering. Illustrative: confirm all specifications with the manufacturer. Source: Blue-White datasheet P.N. 85000-170 rev 9.", M, 280.5, { size:6.8 });
  for (let p = 1; p <= pages; p++){
    doc.setPage(p); hair(M, 284, W - M);
    small("Unofficial demo by SwiftyQuote  |  sales@swiftyquote.com  |  Not affiliated with Blue-White", M, 289, { size:6.8 });
    small(`${p} / ${pages}`, W - M, 289, { size:7, align:"right" });
  }
  return doc;
}
const pdfName = () => `BlueWhite_F1000_${partNumber().replace(/\?/g,"x")}_${S.ref}.pdf`;
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
    ...(withHeaders ? [`To: ${SETTINGS.QUOTE_EMAIL}`, ...(SETTINGS.QUOTE_CC ? [`Cc: ${SETTINGS.QUOTE_CC}`] : []), `Subject: ${quoteSubject()}`, ""] : []),
    `Quotation request | F-1000 digital paddlewheel flow meter | Ref. ${S.ref}`, "",
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
  $("#faqCta").href = `mailto:${DEMO_CONTACT.email}?subject=${encodeURIComponent("Configurator enquiry (from the Blue-White Industries demo)")}`;
  $("#faqContact").innerHTML = `Or write to <a href="mailto:${DEMO_CONTACT.email}">${DEMO_CONTACT.email}</a> · <a href="${DEMO_CONTACT.site}" target="_blank" rel="noopener">swiftyquote.com</a>`;
})();

window.__cfg = { get S(){ return S; }, set S(v){ S = v; }, newState, go, partNumber, fittingNo, getNotes, buildPdf, buildMailto, quoteText, isComplete, renderStep, constrain, sizeOffWhy, typeOffWhy, unitOffWhy, ptStatus, maxPsi, sizeList };
renderStep(false);
