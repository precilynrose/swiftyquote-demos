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
    a:"<p>The product data and photos belong to Absolute Process Instruments and are used here for demonstration only. This page is not an official API tool and you cannot place orders on it. Please contact Absolute Process Instruments directly for real enquiries about the APD 2000 DuoPak.</p>" },
  { q:"Can you build this for my own products?",
    a:"<p>Yes. The configurator is built around your product range, your options and your rules, and it takes on your branding: your logo, colours and fonts. It works for anything a buyer has to specify before they can get a quote, such as range, power, approvals, outputs or accessories.</p>" },
  { q:"What do you need from me to get started?",
    a:"<ul><li>A link to the product page, or the datasheets and catalogue.</li><li>Your logo and brand guidelines (or we take them from your website).</li><li>The options a buyer can choose, and any rules, such as which combinations are possible or which approvals apply.</li><li>The email address (or system) where quotation requests should go.</li></ul>" },
  { q:"How much does it cost?",
    a:"<p>The price depends on how many products and options are covered, whether you need extra languages, and whether it should connect to your other systems. We give you a fixed quote after a short conversation, so there are no surprises.</p><p>Write to <a href=\"mailto:sales@swiftyquote.com?subject=Configurator%20price%20enquiry\">sales@swiftyquote.com</a> with a link to your product and we will come back with a price.</p>" },
  { q:"How long does implementation take?",
    a:"<p>The timeline depends on the size of your range and the features you choose. A single-product configurator like this one is quicker than a full catalogue with several product families. You receive a clear timeline together with your quote, and you see a first working version early so you can give feedback before we finish.</p>" },
  { q:"Can it use our branding and languages?",
    a:"<p>Yes. This demo already follows the Absolute Process Instruments colours. Your version follows yours. Additional languages can be added.</p>" },
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
   Source: api-usa.com/2000 and the datasheet "APD 2000 DuoPak Two Channel Signal Converter/Isolator/Transmitter,
   Factory Ranged" (© 03-22, 2 pages). It replaces the discontinued API 4390 DIN (api4390-4391-4392.pdf, © 07-09).
   Model number: APD 2000 [D] + options R1/R2/R3, M19/M29/M39, U. Ranges for each channel are stated on the order.
   ===================================================================== */
const APPS = [
  { id:"isolate", title:"Isolate two signals",      desc:"Break ground loops and block noise between transmitters and a PLC, DCS or recorder." },
  { id:"convert", title:"Convert signal types",     desc:"For example 0–10 V into 4–20 mA, or a mV signal into volts." },
  { id:"redund",  title:"Keep two loops independent", desc:"Two loops in one module, so a failed device does not take the other loop down." },
  { id:"dualx",   title:"Dual-output transmitter",  desc:"Isolate or convert both outputs of one transmitter." },
  { id:"other",   title:"Something else",           desc:"We will look at it together with you." }
];
const USES = [
  { id:"both", title:"Both channels",                    desc:"Two signals in, two signals out." },
  { id:"one",  title:"One channel now, one kept spare",  desc:"Both channels are factory ranged, so the spare still needs ranges on the order." }
];
const MOUNTS = [
  { id:"panel", title:"In a control panel or enclosure", desc:"On a 35 mm DIN rail.", badge:"Standard" },
  { id:"field", title:"In the open plant, no cabinet",   desc:"Outdoors or on a machine frame." }
];
const AMBS = [
  { id:"ok",  title:"Between −10 and +60 °C", desc:"14 to 140 °F. The module's operating range." },
  { id:"out", title:"Colder or hotter than that" },
  { id:"unk", title:"Not sure",               desc:"We will check it with you." }
];
const MOISTS = [
  { id:"dry",   title:"Dry, clean cabinet" },
  { id:"humid", title:"Humid, condensing or corrosive air", desc:"Conformal coating (option U) is recommended." }
];

/* Signal types and ranges (datasheet: Channel 1 / Channel 2 DC Input Range, Output Ranges) */
const IN_T = [
  { id:"ma", title:"DC current (mA)",       desc:"0–1 mA up to 0–50 mA, and 4–20 mA. The usual transmitter signal.", badge:"Most common" },
  { id:"v",  title:"DC voltage",            desc:"0–10 mV up to 0–100 V." },
  { id:"bv", title:"Bipolar voltage (±)",   desc:"±50 mV up to ±10 V, for signals that go negative." }
];
const OUT_T = [
  { id:"ma", title:"DC current (mA)",       desc:"0–1 mA up to 0–20 mA, and 4–20 mA. 20 V compliance, 1000 Ω at 20 mA.", badge:"Most common" },
  { id:"v",  title:"DC voltage",            desc:"0–1 V up to 0–10 V, 10 mA max. Up to 20 V with the high-voltage option." },
  { id:"bv", title:"Bipolar voltage (±)",   desc:"±1 V up to ±10 V." }
];
const R = (id, lo, hi, unit, o = {}) => ({ id, lo, hi, unit, bip:lo < 0, ...o });
const CUSTOM = { id:"custom", custom:true };
const IN_R = {
  ma: [R("4-20",4,20,"mA",{ badge:"Most common" }), R("0-20",0,20,"mA"), R("0-10",0,10,"mA"), R("0-1",0,1,"mA"), R("0-50",0,50,"mA",{ desc:"Highest current input." }), CUSTOM],
  v:  [R("0-10V",0,10,"V"), R("0-5V",0,5,"V"), R("1-5V",1,5,"V",{ desc:"Live-zero range: to be confirmed." }), R("0-1V",0,1,"V"), R("0-100mV",0,.1,"V"), R("0-10mV",0,.01,"V",{ desc:"Smallest voltage input." }), R("0-100V",0,100,"V",{ desc:"Highest voltage input." }), CUSTOM],
  bv: [R("pm10V",-10,10,"V"), R("pm5V",-5,5,"V"), R("pm1V",-1,1,"V"), R("pm100mV",-.1,.1,"V"), R("pm50mV",-.05,.05,"V",{ desc:"Smallest bipolar input." }), CUSTOM]
};
const OUT_R = {
  ma: [R("4-20",4,20,"mA",{ badge:"Most common" }), R("0-20",0,20,"mA"), R("0-10",0,10,"mA"), R("0-1",0,1,"mA"), CUSTOM],
  v:  [R("0-10V",0,10,"V"), R("0-5V",0,5,"V"), R("1-5V",1,5,"V",{ desc:"Live-zero range: to be confirmed." }), R("0-1V",0,1,"V"), R("0-15V",0,15,"V",{ hv:true }), R("0-20V",0,20,"V",{ hv:true }), CUSTOM],
  bv: [R("pm10V",-10,10,"V"), R("pm5V",-5,5,"V"), R("pm1V",-1,1,"V"), CUSTOM]
};
/* limits for a range of your own: max = highest value, span = smallest span, min/max for ± ranges */
const LIM = {
  in:  { ma:{ unit:"mA", max:50, span:1 }, v:{ unit:"V", max:100, span:.01 }, bv:{ min:.05, max:10 } },
  out: { ma:{ unit:"mA", max:20, span:1 }, v:{ unit:"V", max:20,  span:1 },   bv:{ min:1,   max:10 } }
};
const IN_LOOPS = [
  { id:"ext", title:"The transmitter or another supply", desc:"A 3- or 4-wire transmitter with a powered mA output. The DuoPak input sinks the current." },
  { id:"mod", title:"The DuoPak (2-wire transmitter)",   desc:"The module's built-in 15 VDC supply (25 mA) powers the loop." }
];
const OUT_LOOPS = [
  { id:"mod", title:"No, the DuoPak powers the loop",       desc:"Passive mA input on the PLC or display. The built-in 20 VDC supply drives up to 1000 Ω at 20 mA." },
  { id:"ext", title:"Yes, the receiving device powers it",  desc:"Active mA input. The DuoPak output sinks the current." }
];
const DIRS = [
  { id:"norm", title:"Normal",   desc:"The output rises when the input rises.", badge:"Standard" },
  { id:"rev",  title:"Reversed", desc:"The output falls when the input rises, e.g. 20–4 mA." }
];
const SAMES = [
  { id:"same", title:"Same as channel 1" },
  { id:"diff", title:"Different signals",  desc:"Choose the input and output of channel 2 separately." }
];
const ULS = [
  { id:"no",  title:"Not required" },
  { id:"yes", title:"Yes, it must be UL listed", desc:"UL file E145968." }
];
const POWERS = [
  { id:"u", title:"85–265 VAC or 60–300 VDC", desc:"Universal power, 50/60 Hz, 6 W max.", meta:"APD 2000", badge:"Standard" },
  { id:"d", title:"9–30 VDC or 10–32 VAC",    desc:"Low-voltage power, for example a 24 VDC panel supply. 6 W max.", meta:"APD 2000 D" }
];
const COATS = [
  { id:"none", title:"No coating" },
  { id:"u",    title:"Conformal coating", desc:"Protects the electronics against moisture.", meta:"Option U" }
];
const PLUGS = [
  { id:"none", title:"No spare plugs" },
  { id:"bp4",  title:"Add spare plugs", desc:"Removable 4-terminal plug, black. Ordered as a separate line item.", meta:"API BP4" }
];
/* terminals (datasheet p2, Outputs and Inputs, DC tables) */
const TERM = {
  1: { in:{ std:"17 (–) and 19 (+)", mod:"19 (–) and 18 (+15 V)" }, out:{ v:"3 (–) and 4 (+)", mod:"3 (–) and 4 (+20 V)", ext:"2 (–) and 3 (+)" } },
  2: { in:{ std:"21 (–) and 23 (+)", mod:"23 (–) and 22 (+15 V)" }, out:{ v:"7 (–) and 8 (+)", mod:"7 (–) and 8 (+20 V)", ext:"6 (–) and 7 (+)" } }
};

const SPECS = [
  ["Function",        "Two independent channels: DC voltage or current in, optically isolated DC voltage or current out, factory ranged"],
  ["Inputs",          "0-10 mV to 0-100 V; +/-50 mV to +/-10 V; 0-1 to 0-50 mA, 4-20 mA. 200 kohm (V) / 50 ohm (mA); 15 VDC loop supply per input"],
  ["Outputs",         "0-1 to 0-10 V, 10 mA max (to 20 V with M19/M29/M39); +/-1 to +/-10 V; 0-1 to 0-20 mA, 4-20 mA, 20 V compliance"],
  ["Accuracy",        "Linearity better than +/-0.1% of span; stability better than +/-0.04% of span per C; response 70 ms nominal"],
  ["Isolation",       "Full 5-way (input 1, input 2, output 1, output 2, power), 1200 VRMS minimum"],
  ["Adjustment",      "Zero and span potentiometers per channel (+/-15% of span); output test button with adjustable level per channel"],
  ["Power",           "85-265 VAC 50/60 Hz or 60-300 VDC; D: 9-30 VDC or 10-32 VAC; 6 W max."],
  ["Housing",         "45 x 117 x 122 mm, 35 mm DIN rail, IP 40, -10 to +60 C ambient, removable plugs for 14 AWG wire"]
];

/* =====================================================================
   STATE
   ===================================================================== */
const STEPS = [
  { id:"app",   label:"Application" },
  { id:"ch1",   label:"Channel 1" },
  { id:"ch2",   label:"Channel 2" },
  { id:"power", label:"Power & options" },
  { id:"review",label:"Review" }
];
const $ = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => [...el.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const byId = (arr,id) => arr.find(x => x.id === id);

const newChan = () => ({ inT:null, inR:null, inLo:"", inHi:"", inLoop:null, outT:null, outR:null, outLo:"", outHi:"", outLoop:null, rev:null });
function newState(){
  return { step:0, maxStep:0, app:null, use:null, mount:null, amb:null, moist:null,
           c1:newChan(), same2:null, c2:newChan(),
           ul:null, power:null, coat:null, plugs:null, plugQty:"",
           qty:1, notes:"", ref:makeRef(), helpOpen:{} };
}
function makeRef(){
  const d = new Date(), p = n => String(n).padStart(2,"0");
  const rnd = Math.random().toString(36).slice(2,6).toUpperCase();
  return `API-${String(d.getFullYear()).slice(2)}${p(d.getMonth()+1)}${p(d.getDate())}-${rnd}`;
}
let S = newState();

/* ---------- ranges ---------- */
const num = v => /^\s*\d+(\.\d+)?\s*$/.test(String(v)) ? parseFloat(v) : NaN;
const nf = x => String(+(+x).toFixed(4));
function fmtR(r){
  if (!r) return null;
  if (r.unit === "mA") return `${nf(r.lo)}–${nf(r.hi)} mA`;
  const mv = Math.abs(r.hi) < 1, k = mv ? 1000 : 1, u = mv ? "mV" : "V";
  return r.bip ? `±${nf(r.hi*k)} ${u}` : `${nf(r.lo*k)}–${nf(r.hi*k)} ${u}`;
}
/* chosen channel: channel 2 can copy channel 1 */
const ch = n => (n === 2 && S.same2 === "same") ? S.c1 : S[`c${n}`];
function customRange(c, side){
  const t = c[side+"T"], L = (LIM[side] || {})[t]; if (!L) return { err:"" };
  if (t === "bv"){
    const raw = String(c[side+"Hi"]).trim(), h = num(raw);
    if (isNaN(h)) return { err: raw ? "Please enter a number, for example 2.5." : "" };
    if (h < L.min || h > L.max) return { err:`Please enter a value from ${nf(L.min)} to ${nf(L.max)} V.` };
    return { r:{ lo:-h, hi:h, unit:"V", bip:true, custom:true } };
  }
  const rl = String(c[side+"Lo"]).trim(), rh = String(c[side+"Hi"]).trim(), lo = num(rl), hi = num(rh);
  if ((rl && isNaN(lo)) || (rh && isNaN(hi))) return { err:"Please enter positive numbers only. For signals that go negative, choose bipolar voltage." };
  if (isNaN(lo) || isNaN(hi)) return { err:"" };
  if (hi <= lo) return { err:"The high end must be above the low end." };
  if (hi > L.max) return { err:`The high end can be at most ${nf(L.max)} ${L.unit}.` };
  if (hi - lo < L.span - 1e-9) return { err:`The span must be at least ${L.unit === "V" && L.span < 1 ? nf(L.span*1000)+" mV" : nf(L.span)+" "+L.unit}.` };
  return { r:{ lo, hi, unit:L.unit, bip:false, custom:true } };
}
function rangeOf(c, side){
  const list = (side === "in" ? IN_R : OUT_R)[c[side+"T"]] || [];
  const r = byId(list, c[side+"R"] || ""); if (!r) return null;
  return r.custom ? (customRange(c, side).r || null) : r;
}
const isLiveZero = r => r && !r.bip && r.lo > 0 && !(r.unit === "mA" && r.lo === 4 && r.hi === 20);
const hv = n => { const c = ch(n), r = rangeOf(c,"out"); return c.outT === "v" && !!r && r.hi > 10; };
function chanValid(c){
  return !!(c.inT && rangeOf(c,"in") && (c.inT !== "ma" || c.inLoop) && c.outT && rangeOf(c,"out") && (c.outT !== "ma" || c.outLoop) && c.rev);
}

/* ---------- rules ---------- */
function powerOffWhy(p){
  if (p.id === "d" && S.ul === "yes") return "The UL listing (file E145968) covers the 85–265 VAC / 60–300 VDC model only.";
  return null;
}
function plugQtyValid(){ const v = +S.plugQty; return Number.isInteger(v) && v >= 1 && v <= 99 && /^\s*\d+\s*$/.test(S.plugQty); }
function constrain(){
  [S.c1, S.c2].forEach(c => {
    ["in","out"].forEach(side => {
      const list = (side === "in" ? IN_R : OUT_R)[c[side+"T"]] || [];
      if (c[side+"R"] && !byId(list, c[side+"R"])) c[side+"R"] = null;
      if (c[side+"R"] !== "custom"){ c[side+"Lo"] = ""; c[side+"Hi"] = ""; }
      if (c[side+"T"] !== "ma") c[side+"Loop"] = null;
    });
  });
  const po = byId(POWERS, S.power || ""); if (po && powerOffWhy(po)) S.power = null;
  if (S.plugs !== "bp4") S.plugQty = "";
}

/* ---------- derived values ---------- */
function optionCodes(){
  const c = [], pick = (a, b, x1, x2, x3) => { if (a && b) c.push(x3); else if (a) c.push(x1); else if (b) c.push(x2); };
  pick(ch(1).rev === "rev", ch(2).rev === "rev", "R1", "R2", "R3");
  pick(hv(1), hv(2), "M19", "M29", "M39");
  if (S.coat === "u") c.push("U");
  return c;
}
function partNumber(){
  const base = S.power === "d" ? "APD 2000 D" : S.power === "u" ? "APD 2000" : "APD 2000 ?";
  return [base, ...optionCodes()].join(" ");
}
const codeIsFinal = () => !partNumber().includes("?");
function sideText(n, side, long){
  const c = ch(n), r = rangeOf(c, side); if (!r) return null;
  let t = fmtR(r);
  if (long && c[side+"T"] === "ma"){
    if (side === "in") t += c.inLoop === "mod" ? " (2-wire, loop powered by the DuoPak)" : c.inLoop === "ext" ? " (externally powered loop)" : "";
    else t += c.outLoop === "mod" ? " (DuoPak powers the loop)" : c.outLoop === "ext" ? " (receiver powers the loop)" : "";
  }
  return t;
}
function chanText(n, long){
  const c = ch(n), i = sideText(n,"in",long), o = sideText(n,"out",long);
  if (!i && !o) return null;
  return `${i || "?"} → ${o || "?"}${c.rev === "rev" ? ", reversed" : ""}`;
}
function wiringText(n){
  const c = ch(n), t = TERM[n]; if (!c.inT || !c.outT) return null;
  const inn = c.inT === "ma" && c.inLoop === "mod" ? t.in.mod : t.in.std;
  const out = c.outT === "ma" ? (c.outLoop === "ext" ? t.out.ext : t.out.mod) : t.out.v;
  return `input terminals ${inn}; output terminals ${out}`;
}
function installText(){
  const m = byId(MOUNTS, S.mount || ""), a = byId(AMBS, S.amb || ""), w = byId(MOISTS, S.moist || "");
  const bits = [m && m.title, a && (S.amb === "ok" ? "−10 to +60 °C" : S.amb === "out" ? "outside −10 to +60 °C" : "ambient not sure"), w && w.title.toLowerCase()].filter(Boolean);
  return bits.length ? bits.join(", ") : null;
}
function optsText(){
  return S.coat === "u" ? "Conformal coating (U)" : S.coat ? "None" : null;
}
function accText(){
  if (!S.plugs) return null;
  return S.plugs === "bp4" ? `Spare 4-terminal plugs API BP4 × ${plugQtyValid() ? +S.plugQty : "?"}` : "None";
}

function validStep(id){
  switch(id){
    case "app":   return !!(S.app && S.use && S.mount && S.amb && S.moist);
    case "ch1":   return chanValid(S.c1);
    case "ch2":   return !!S.same2 && (S.same2 === "same" || chanValid(S.c2));
    case "power": return !!(S.ul && S.power && S.coat && S.plugs && (S.plugs !== "bp4" || plugQtyValid()));
    default:      return true;
  }
}
const isComplete = () => STEPS.slice(0,-1).every(s => validStep(s.id));

function getNotes(forPdf){
  const warn = [], info = [];
  if (S.app === "other") warn.push("Application to be clarified with you before quotation.");
  if (S.mount === "field") warn.push("The DuoPak housing is IP 40: it must be installed in a panel or enclosure with adequate ventilation (Pollution Degree 2). Please plan an enclosure, or talk to us.");
  if (S.amb === "out") warn.push("Your ambient is outside the −10 to +60 °C operating range. Please talk to us before ordering.");
  if (S.amb === "unk") warn.push("Ambient temperature to be confirmed (operating range −10 to +60 °C).");
  [1,2].forEach(n => ["in","out"].forEach(side => {
    const r = rangeOf(ch(n), side);
    if (isLiveZero(r)) warn.push(`Channel ${n} ${side === "in" ? "input" : "output"} ${fmtR(r)}: the datasheet lists ranges from zero (plus 4–20 mA). Live-zero ranges are to be confirmed with the manufacturer.`);
  }));
  if (S.moist === "humid" && S.coat === "none") warn.push("Humid or condensing air: we recommend the conformal coating (option U).");
  if (S.use === "one") info.push("Spare channel: do not leave unused mA inputs or outputs disconnected. Fit a 1000 Ω ½ W resistor across unused mA terminals.");
  if (!forPdf) [1,2].forEach(n => { const w = wiringText(n); if (w) info.push(`Channel ${n} wiring: ${w}.`); });
  if (hv(1) || hv(2)) info.push("High-voltage output (M19 / M29 / M39): voltage outputs above 10 V up to 20 V, 10 mA max.");
  if ([1,2].some(n => ch(n).outT === "ma")) info.push("mA outputs: 20 V compliance, up to 1000 Ω loop resistance at 20 mA.");
  if (S.ul === "yes") info.push("UL file E145968 covers the 85–265 VAC / 60–300 VDC model.");
  if (S.mount === "panel") info.push("Mount vertically on a 35 mm DIN rail with 1″ (25 mm) free space above and below the housing vents.");
  if (S.plugs === "bp4") info.push("Spare plugs (API BP4) are quoted as a separate line item.");
  info.push("All ranges are set at the factory. Zero and span potentiometers and an output test button for each channel help at start-up.");
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
const radios = (name, list, extra = () => ({})) => list.map(o => optHtml({ name, value:o.id, checked:S[name]===o.id, title:o.title, desc:o.desc, badge:o.badge, meta:o.meta, ...extra(o) })).join("");
const cRadios = (cn, key, list, extra = () => ({})) => list.map(o => optHtml({ name:`${cn}.${key}`, value:o.id, checked:S[cn][key]===o.id, title:o.title, desc:o.desc, badge:o.badge, ...extra(o) })).join("");

/* fields for a range of your own */
function customFields(cn, side){
  const c = S[cn], t = c[side+"T"], L = LIM[side][t], bad = !!customRange(c, side).err;
  const inv = bad ? ' aria-invalid="true"' : "";
  if (t === "bv") return `<div class="inline-field"><label class="field"><span class="l">Plus/minus value (${nf(L.min)} to ${nf(L.max)} V)</span><span class="unit-input"><input id="${cn}-${side}Hi" type="text" inputmode="decimal" value="${esc(c[side+"Hi"])}" placeholder="e.g. 2.5"${inv}><em>± V</em></span></label></div>`;
  const u = L.unit;
  return `<div class="inline-field"><label class="field"><span class="l">Low end (${u})</span><span class="unit-input"><input id="${cn}-${side}Lo" type="text" inputmode="decimal" value="${esc(c[side+"Lo"])}" placeholder="e.g. 0"${inv}><em>${u}</em></span></label>
    <label class="field"><span class="l">High end (${u}, max ${nf(L.max)})</span><span class="unit-input"><input id="${cn}-${side}Hi" type="text" inputmode="decimal" value="${esc(c[side+"Hi"])}" placeholder="e.g. ${u === "mA" ? "16" : "2.5"}"${inv}><em>${u}</em></span></label></div>`;
}
function rangeGroup(n, cn, side){
  const c = S[cn], t = c[side+"T"], list = (side === "in" ? IN_R : OUT_R)[t], code = n === 1 ? "M19" : "M29";
  const L = LIM[side][t];
  const lim = t === "bv" ? `±${nf(L.min)} to ±${nf(L.max)} V` : `span ${L.unit === "V" && L.span < 1 ? nf(L.span*1000)+" mV" : nf(L.span)+" "+L.unit} up to ${nf(L.max)} ${L.unit}`;
  const inner = list.map(r => r.custom
    ? optHtml({ name:`${cn}.${side}R`, value:"custom", checked:c[side+"R"]==="custom", title:"A range of my own", desc:`Within ${lim}.` })
    : optHtml({ name:`${cn}.${side}R`, value:r.id, checked:c[side+"R"]===r.id, title:fmtR(r), desc:r.hv ? `Above 10 V: adds the high-voltage option ${code}.` : r.desc, badge:r.badge, meta:r.hv ? code : null })).join("");
  return group(side === "in" ? `Input range on channel ${n}` : `Output range on channel ${n}`, side === "in" ? "The signal range your transmitter or sensor sends." : "The range your PLC, display or recorder expects.", inner)
    + (c[side+"R"] === "custom" ? customFields(cn, side) : "");
}
function chanGroups(n){
  const cn = `c${n}`, c = S[cn], rev = n === 1 ? "R1" : "R2";
  return group(`What signal comes in on channel ${n}?`, null, cRadios(cn, "inT", IN_T))
    + (c.inT ? rangeGroup(n, cn, "in") : "")
    + (c.inT === "ma" ? group(`Who powers the input loop on channel ${n}?`, "No order code: the DuoPak is wired for either case.", cRadios(cn, "inLoop", IN_LOOPS), "opts--wide") : "")
    + group(`What signal should go out on channel ${n}?`, null, cRadios(cn, "outT", OUT_T))
    + (c.outT ? rangeGroup(n, cn, "out") : "")
    + (c.outT === "ma" ? group(`Does the receiving device power the output loop on channel ${n}?`, "No order code: the DuoPak output can source or sink.", cRadios(cn, "outLoop", OUT_LOOPS), "opts--wide") : "")
    + group(`Output direction on channel ${n}`, null, cRadios(cn, "rev", DIRS, o => o.id === "rev" ? { desc:`${o.desc} Adds option ${rev} (R3 if both channels are reversed).` } : {}));
}
const CHAN_HELP = `<ul><li><strong>Sinking or sourcing?</strong> A 2-wire transmitter has no power of its own: the DuoPak's 15 VDC supply powers its loop. A 3- or 4-wire transmitter powers the loop itself.</li><li>On the output side, a <strong>passive</strong> PLC input needs loop power from the DuoPak (20 VDC); an <strong>active</strong> input powers the loop itself.</li><li>Both are a matter of wiring, so they do not change the model number. We still note them so the wiring is right first time.</li></ul>`;

/* =====================================================================
   STEP VIEWS
   ===================================================================== */
const VIEWS = {
  app(){
    return `<div class="step">
      ${head(1,"What will the DuoPak do?","The APD 2000 DuoPak takes two DC signals and gives two fully isolated DC outputs in one 45 mm DIN-rail module. Tell us about your application.")}
      ${group("What is the job?", null, radios("app", APPS))}
      ${group("How many channels will you use?", null, radios("use", USES), "opts--wide")}
      ${group("Where will the module be mounted?", null, radios("mount", MOUNTS))}
      ${group("Ambient temperature around the module", null, radios("amb", AMBS))}
      ${group("Air in the cabinet", null, radios("moist", MOISTS))}
      ${helpHtml("app","Why two channels in one module?",`<p>Each channel has its own input, output and isolation. One module replaces two single-channel isolators, saves DIN-rail space and still keeps the loops apart: a fault on one loop does not affect the other.</p><p>Full 5-way isolation (input 1, input 2, output 1, output 2 and power, 1200 VRMS) removes ground loops and common-mode noise.</p>`)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  ch1(){
    return `<div class="step">
      ${head(2,"Channel 1: input and output","Choose the signal coming in and the signal you need out. Ranges are set at the factory.")}
      ${chanGroups(1)}
      ${helpHtml("ch1","Sinking or sourcing mA loops?", CHAN_HELP)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  ch2(){
    const t1 = chanText(1, false);
    return `<div class="step">
      ${head(3,"Channel 2: input and output","Channel 2 is fully independent: it can use completely different signals.")}
      ${group("Is channel 2 the same as channel 1?", null, radios("same2", SAMES, o => o.id === "same" ? { desc:t1 ? `${t1}.` : null } : {}), "opts--wide")}
      ${S.same2 === "diff" ? chanGroups(2) : ""}
      ${helpHtml("ch2","Sinking or sourcing mA loops?", CHAN_HELP)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  power(){
    const coat = COATS.map(o => ({ ...o, badge:o.id === "u" && S.moist === "humid" ? "Recommended" : (o.id === "none" ? "Standard" : null) }));
    return `<div class="step">
      ${head(4,"Power and options","How the module is powered, plus coating and spare parts.")}
      ${group("Do you need a UL-listed module?", null, radios("ul", ULS), "opts--wide")}
      ${group("Which power supply is available in the panel?", null, POWERS.map(p => { const why = powerOffWhy(p);
        return optHtml({ name:"power", value:p.id, checked:S.power===p.id, title:p.title, desc:why || p.desc, meta:`Model ${p.meta}`, badge:p.badge, off:!!why }); }).join(""), "opts--wide")}
      ${group("Conformal coating", null, radios("coat", coat), "opts--wide")}
      ${group("Spare plugs", null, radios("plugs", PLUGS), "opts--wide")}
      ${S.plugs === "bp4" ? `<div class="inline-field"><label class="field"><span class="l">Number of spare plugs (1 to 99)</span><span class="unit-input"><input id="plugQty" type="text" inputmode="numeric" value="${esc(S.plugQty)}" placeholder="e.g. 4"${S.plugQty && !plugQtyValid() ? ' aria-invalid="true"' : ""}><em>pcs</em></span></label></div>` : ""}
      ${helpHtml("power","Which power option do I need?",`<ul><li><strong>APD 2000</strong> runs on almost any mains or DC supply: 85–265 VAC or 60–300 VDC. It is also the UL-listed model.</li><li><strong>APD 2000 D</strong> is for low-voltage panels: 9–30 VDC or 10–32 VAC.</li><li><strong>Conformal coating (U)</strong> protects the circuit boards in damp or dirty air.</li></ul>`)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  review(){
    const rows = summaryRows(true), n = getNotes();
    return `<div class="step">
      ${head(5,"Review your configuration","Check everything below. You can change any answer, then download the PDF or ask for a quotation.")}
      <div class="code-box"><div class="k">Model number</div><div class="v">${esc(partNumber())}</div>
        <div class="r">Channel 1: ${esc(chanText(1,false) || "–")}<br>Channel 2: ${esc(chanText(2,false) || "–")}</div>
        <div class="s">${codeIsFinal() ? "Built from the datasheet's model and option codes; the ranges are stated with the order. Illustrative only: confirm with the manufacturer." : "“?” marks a choice we will confirm with you."}</div></div>
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
        <label class="field"><span class="l">Notes for our team (optional)</span><textarea id="notes" placeholder="e.g. tag numbers, transmitter models, PLC input type, delivery date…">${esc(S.notes)}</textarea></label>
      </div>
      <div class="actions">
        <button class="btn btn--primary btn--lg" type="button" id="btnQuote">${ICON.mail} Get a quotation</button>
        <button class="btn btn--ghost btn--lg" type="button" id="btnPdf">${ICON.pdf} Download as PDF</button>
        <button class="btn btn--text" type="button" id="btnReset">Start over</button>
      </div>
    </div>`;
  }
};

function chanFeedback(n){
  const out = [], c = ch(n);
  ["in","out"].forEach(side => {
    if (c[side+"R"] === "custom"){ const e = customRange(c, side).err; if (e) out.push(msg("warn", `${side === "in" ? "Input" : "Output"} range: ${e}`)); }
    const r = rangeOf(c, side);
    if (isLiveZero(r)) out.push(msg("warn", `${fmtR(r)} is a live-zero range: the datasheet lists ranges from zero (plus 4–20 mA), so this is to be confirmed with the manufacturer.`));
  });
  if (hv(n)) out.push(msg("info", `Output above 10 V: option ${n === 1 ? "M19" : "M29"} is added to the model number.`));
  if (chanValid(c)) out.push(msg("ok", `Channel ${n}: ${chanText(n, false)}.`));
  return out.join("");
}
const FEEDBACK = {
  app(){
    const out = [];
    if (S.mount === "panel" && S.amb === "ok") out.push(msg("ok","A panel between −10 and +60 °C is exactly where the DuoPak is made to work."));
    getNotes().warn.filter(w => /IP 40|ambient|Ambient/.test(w)).forEach(w => out.push(msg("warn",w)));
    if (S.moist === "humid") out.push(msg("info","Conformal coating (option U) will be suggested in step 4."));
    if (S.use === "one") out.push(msg("info","The spare channel is factory ranged too: in step 3 you can simply copy channel 1."));
    return out.join("");
  },
  ch1(){ return chanFeedback(1); },
  ch2(){ return S.same2 === "same" ? (chanValid(S.c1) ? msg("ok", `Channel 2 copies channel 1: ${chanText(1,false)}.`) : "") : S.same2 === "diff" ? chanFeedback(2) : ""; },
  power(){
    const out = [];
    if (S.ul === "yes") out.push(msg("info","UL listing: the low-voltage D model is not covered, so the universal-power model is used."));
    if (S.plugs === "bp4" && S.plugQty && !plugQtyValid()) out.push(msg("warn","Please enter a whole number from 1 to 99."));
    if (S.power) out.push(msg("ok",`Your model: ${partNumber()}.`));
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
    { k:"Channels in use",   v:byId(USES,S.use||"")?.title || null, step:g(0) },
    { k:"Installation",      v:installText(), step:g(0) },
    { k:"Channel 1",         v:chanText(1, true), step:g(1) },
    { k:"Channel 2",         v:S.same2 === "same" && chanText(1,true) ? `Same as channel 1: ${chanText(2, true)}` : chanText(2, true), step:g(2) },
    { k:"Power supply",      v:byId(POWERS,S.power||"")?.title || null, step:g(3) },
    { k:"UL listing",        v:S.ul ? (S.ul === "yes" ? "Required" : "Not required") : null, step:g(3) },
    { k:"Options",           v:past(3) ? optsText() : null, step:g(3) },
    { k:"Accessories",       v:past(3) ? accText() : null, step:g(3) },
    { k:"Model",             v:S.power ? partNumber() : null, step:g(3) },
    { k:"Quantity",          v:S.step >= 4 ? String(S.qty) : null, step:null }
  ];
}
function renderSummary(){
  const img = $("#sumImg");
  if (img.dataset.key !== "MAIN"){ img.src = IMG.MAIN; img.dataset.key = "MAIN"; }
  $("#sumModel").textContent = S.power ? `DuoPak ${partNumber()}` : "APD 2000 DuoPak";
  const bits = [chanText(1,false) ? `Ch 1: ${chanText(1,false)}` : null, chanText(2,false) ? `Ch 2: ${chanText(2,false)}` : null].filter(Boolean);
  $("#sumSub").textContent = bits.length ? bits.join(" · ") : "Your choices appear here as you go.";
  $("#sumCode").textContent = S.c1.inT || S.power ? partNumber() : "";
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
  if (id === "ch1" || id === "ch2") return "Please complete the input and output.";
  if (id === "power") return S.plugs === "bp4" && S.power ? "Please enter the number of spare plugs." : "Please answer all questions.";
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
  if (i === 3 && !S.coat && S.moist === "humid") S.coat = "u";
  S.step = i; S.maxStep = Math.max(S.maxStep, i);
  renderStep(true);
}
function refresh(){ renderStepper(); renderNav(); renderSummary(); refreshFeedback(); }

/* =====================================================================
   EVENTS
   ===================================================================== */
const RERENDER = { same2:1, ul:1, plugs:1, moist:0 };
document.addEventListener("change", e => {
  const t = e.target;
  if (t.type !== "radio" && t.type !== "checkbox") return;
  const n = t.name, v = t.value;
  let rerender = !!RERENDER[n];
  if (n.includes(".")){
    const [cn, k] = n.split("."), c = S[cn];
    if ((k === "inT" || k === "outT") && c[k] !== v){ const sd = k.slice(0, -1); c[sd+"R"] = null; c[sd+"Lo"] = ""; c[sd+"Hi"] = ""; c[sd+"Loop"] = null; }
    c[k] = v; rerender = /T$|R$/.test(k);
  }
  else S[n] = v;
  constrain();
  S.maxStep = Math.max(S.maxStep, S.step);
  if (rerender){
    const y = window.scrollY; $("#stage").innerHTML = VIEWS[STEPS[S.step].id](); window.scrollTo(0,y);
    const el = $(`input[name="${n}"][value="${v}"]`); if (el) el.focus({preventScroll:true});
    if (v === "custom"){ const f = $(".inline-field input"); if (f) f.focus(); }
  }
  refresh();
});
document.addEventListener("input", e => {
  const t = e.target, m = /^(c[12])-(in|out)(Lo|Hi)$/.exec(t.id || "");
  if (m){
    const c = S[m[1]]; c[m[2]+m[3]] = t.value;
    const bad = !!customRange(c, m[2]).err;
    $$(`#${m[1]}-${m[2]}Lo,#${m[1]}-${m[2]}Hi`).forEach(i => bad ? i.setAttribute("aria-invalid","true") : i.removeAttribute("aria-invalid"));
    refresh();
  }
  else if (t.id === "plugQty"){ S.plugQty = t.value; if (S.plugQty && !plugQtyValid()) t.setAttribute("aria-invalid","true"); else t.removeAttribute("aria-invalid"); refresh(); }
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
  const NAVY = [45,47,121], INK = [51,52,59], GREY = [122,124,128], LINE = [214,215,222], RED = [193,38,27], AMBER = [200,120,0];
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
  small("APD 2000 DuoPak two-channel DC isolator", W - M, 26.5, { size:8, align:"right" });
  hair(M, 32, W - M);
  y = 42;

  const IW = 16, IH = 35;
  if (photo) doc.addImage(photo, "JPEG", W - M - IW, y - 6, IW, IH, undefined, "FAST");
  doc.setFont("helvetica","bold"); doc.setFontSize(19); doc.setTextColor(...NAVY);
  const cl = doc.splitTextToSize(T(code), CW - IW - 8);
  doc.text(cl, M, y + 4);
  let ty = y + 4 + cl.length * 7.5;
  small(`Channel 1: ${chanText(1,false)}   |   Channel 2: ${chanText(2,false)}`, M, ty, { size:9.5 });
  ty = para("Two-channel DC signal converter, isolator and transmitter in a 45 mm DIN-rail housing: two independent factory-ranged channels, full 5-way isolation, built-in input and output loop supplies, LoopTracker(R) LEDs and an output test function for each channel.", M, ty + 6, CW - IW - 8, { size:8.6, color:GREY });
  small(codeIsFinal() ? "Model number built from the datasheet's model and option codes; ranges are stated with the order. Illustrative only, confirm with the manufacturer." : "\"?\" in the model number marks a choice to be confirmed.", M, ty + 1, { size:7.2 });
  y = Math.max(ty + 6, y + IH - 2);

  const Rw = Object.fromEntries(summaryRows(true).map(r => [r.k, r.v]));
  let yl = section("Application", X1, y, COL), yr = section("Module", X2, y, COL);
  yl = item("Application", Rw["Application"], X1, yl, COL);
  yl = item("Channels in use", Rw["Channels in use"], X1, yl, COL);
  yl = item("Installation", Rw["Installation"], X1, yl, COL);
  yr = item("Model", Rw["Model"], X2, yr, COL);
  yr = item("Power supply  |  UL listing", `${Rw["Power supply"]}  |  UL ${S.ul === "yes" ? "required" : "not required"}`, X2, yr, COL);
  yr = item("Options  |  accessories", `${Rw["Options"]}  |  ${Rw["Accessories"]}`, X2, yr, COL);
  yr = item("Quantity", `${S.qty} pcs`, X2, yr, COL);
  y = Math.max(yl, yr) + 3;

  need(46);
  yl = section("Channel 1 (factory ranged)", X1, y, COL); yr = section("Channel 2 (factory ranged)", X2, y, COL);
  [[1, X1], [2, X2]].forEach(([n, x]) => {
    let yy = n === 1 ? yl : yr;
    yy = item("Input", sideText(n,"in",true), x, yy, COL);
    yy = item("Output", `${sideText(n,"out",true)}${ch(n).rev === "rev" ? ", reversed" : ""}`, x, yy, COL);
    yy = item("Wiring", wiringText(n), x, yy, COL);
    if (n === 1) yl = yy; else yr = yy;
  });
  y = Math.max(yl, yr) + 3;

  const n = getNotes(true);
  need(30);
  if (!n.warn.length && !S.notes.trim()){ y = section("Good to know", M, y, CW); n.info.forEach(t => { need(8); y = bullet(t, M, y + .6, CW, RED) + .2; }); y += 3; }
  else {
    yl = section(n.warn.length ? "Points we will check with you" : "Your notes", X1, y, COL); yr = section("Good to know", X2, y, COL);
    if (n.warn.length) n.warn.forEach(t => { yl = bullet(t, X1, yl + .6, COL, AMBER) + .6; }); else yl = para(S.notes.trim(), X1, yl, COL, { size:8.8 });
    n.info.forEach(t => { yr = bullet(t, X2, yr + .6, COL, RED) + .6; });
    y = Math.max(yl, yr) + 3;
    if (n.warn.length && S.notes.trim()){ need(22); y = section("Your notes", M, y, CW); y = para(S.notes.trim(), M, y, CW, { size:8.8 }) + 3; }
  }

  const half = Math.ceil(SPECS.length / 2);
  need(10 + half * 11);
  y = section("Technical data (from the API APD 2000 datasheet)", M, y + 1, CW);
  yl = y; yr = y;
  SPECS.forEach(([k, v], i) => { if (i < half) yl = compact(k, v, X1, yl, COL); else yr = compact(k, v, X2, yr, COL); });

  const pages = doc.getNumberOfPages();
  doc.setPage(pages);
  small("Demo only, not for ordering. Illustrative: confirm all specifications with the manufacturer. Source: API APD 2000 datasheet (c) 03-22.", M, 280.5, { size:6.8 });
  for (let p = 1; p <= pages; p++){
    doc.setPage(p); hair(M, 284, W - M);
    small("Unofficial demo by SwiftyQuote  |  sales@swiftyquote.com  |  Not affiliated with Absolute Process Instruments", M, 289, { size:6.8 });
    small(`${p} / ${pages}`, W - M, 289, { size:7, align:"right" });
  }
  return doc;
}
const pdfName = () => `API_DuoPak_${partNumber().replace(/\?/g,"x").replace(/\s+/g,"-")}_${S.ref}.pdf`;
async function downloadPdf(){
  if (!isComplete()){ toast("Please complete all steps first."); return; }
  const btns = $$("#btnPdf,#doneDownload"); btns.forEach(b => b.disabled = true);
  try {
    const logo = null;
    const photo = await loadImg(IMG.MAIN, 200, 436).catch(() => null);
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
  summaryRows(true).forEach(r => { if (r.k !== "Quantity" && r.k !== "Model") out.push(`${r.k}: ${r.v || "-"}`); });
  [1,2].forEach(n => out.push(`Channel ${n} wiring: ${wiringText(n) || "-"}`));
  out.push(`Quantity: ${S.qty}`);
  return out;
}
const quoteSubject = () => `Quotation request: ${partNumber()} (${S.ref}) | ${SETTINGS.TRACKING_TAG}`;
function quoteText(withHeaders){
  const f = Object.fromEntries(new FormData($("#quoteForm")).entries());
  const n = getNotes();
  return [
    ...(withHeaders ? [`To: ${SETTINGS.QUOTE_EMAIL}`, ...(SETTINGS.QUOTE_CC ? [`Cc: ${SETTINGS.QUOTE_CC}`] : []), `Subject: ${quoteSubject()}`, ""] : []),
    `Quotation request | APD 2000 DuoPak two-channel DC isolator | Ref. ${S.ref}`, "",
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
  $("#faqCta").href = `mailto:${DEMO_CONTACT.email}?subject=${encodeURIComponent("Configurator enquiry (from the Absolute Process Instruments demo)")}`;
  $("#faqContact").innerHTML = `Or write to <a href="mailto:${DEMO_CONTACT.email}">${DEMO_CONTACT.email}</a> · <a href="${DEMO_CONTACT.site}" target="_blank" rel="noopener">swiftyquote.com</a>`;
})();

window.__cfg = { get S(){ return S; }, set S(v){ S = v; }, newState, go, partNumber, getNotes, buildPdf, buildMailto, quoteText, isComplete, renderStep, constrain, rangeOf, customRange, powerOffWhy, ch, chanText, wiringText, optionCodes };
renderStep(false);
