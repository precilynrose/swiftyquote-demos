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
    a:"<p>The product data and photos belong to Jogler and are used here for demonstration only. This page is not an official Jogler tool and you cannot place orders on it. Please contact Jogler directly for real enquiries about JMG magnetic level gauges and JXC chambers.</p>" },
  { q:"Can you build this for my own products?",
    a:"<p>Yes. The configurator is built around your product range, your options and your rules, and it takes on your branding: your logo, colours and fonts. It works for anything a buyer has to specify before they can get a quote, such as materials, connections, ratings, lengths or accessories.</p>" },
  { q:"What do you need from me to get started?",
    a:"<ul><li>A link to the product page, or the datasheets and catalogue.</li><li>Your logo and brand guidelines (or we take them from your website).</li><li>The options a buyer can choose, and any rules, such as which combinations are possible or which limits apply.</li><li>The email address (or system) where quotation requests should go.</li></ul>" },
  { q:"How much does it cost?",
    a:"<p>The price depends on how many products and options are covered, whether you need extra languages, and whether it should connect to your other systems. We give you a fixed quote after a short conversation, so there are no surprises.</p><p>Write to <a href=\"mailto:sales@swiftyquote.com?subject=Configurator%20price%20enquiry\">sales@swiftyquote.com</a> with a link to your product and we will come back with a price.</p>" },
  { q:"How long does implementation take?",
    a:"<p>The timeline depends on the size of your range and the features you choose. A single-product configurator like this one is quicker than a full catalogue with several product families. You receive a clear timeline together with your quote, and you see a first working version early so you can give feedback before we finish.</p>" },
  { q:"Can it use our branding and languages?",
    a:"<p>Yes. This demo already follows the Jogler colours. Your version follows yours. Additional languages can be added.</p>" },
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
    a:"<p>Yes. Products, options, texts and rules are kept in one place, so updates such as a new material or a new option are quick to make.</p>" }
];

const IMG = { JMG:"__IMG_JMG__", IND:"__IMG_IND__" };
const LOGO_URL = "";

/* =====================================================================
   PRODUCT DATA
   Source: Jogler "JMG Magnetic Level Gauge & JXC External Chamber Configuration Guide", Revision B 07.2018
   (16 pages; Model Number Guide pp3-8, common configurations pp9-12, spec sheets pp13-15) and jogler.com product page.
   Model number positions: A product · B location · C material · D float chamber configuration · E connection ·
   F vent/drain · G indicator type/orientation · H ruler · I integral secondary chamber · J options · K measuring length · L C-C
   ===================================================================== */
const PRODUCTS = [
  { id:"JMG", title:"Magnetic level gauge (JMG)", desc:"A float inside a chamber turns magnetic flags or moves a shuttle you can read from up to 200 ft away. No fluid touches the glass.", badge:"Most common" },
  { id:"JXC", title:"External chamber only (JXC)", desc:"A chamber for a direct-insertion level transmitter or switch, such as a magnetostrictive probe." }
];
const LOCS = [
  { id:"S", title:"On the side of the tank", desc:"Chamber beside the vessel on two side nozzles.", badge:"Most common" },
  { id:"T", title:"On top of the tank",      desc:"Gauge on a top nozzle with the float chamber reaching into the tank." },
  { id:"B", title:"On the bottom of the tank", desc:"Gauge on a bottom nozzle." }
];
const SERVICES = [
  { id:"lvl", title:"Liquid level",        desc:"Vapour or gas above one liquid." },
  { id:"if",  title:"Interface level",     desc:"The boundary between two liquids (option IF). Difference in specific gravity as low as 0.025." },
  { id:"di",  title:"Total level and interface", desc:"Both on one gauge (option DI). Shuttle (ST) indicators only." }
];
/* f = highest process temperature of the band, in °F */
const TEMPS = [
  { id:"t140",  f:140,  title:"Up to 140 °F (60 °C)" },
  { id:"t200",  f:200,  title:"Up to 200 °F (93 °C)" },
  { id:"t300",  f:300,  title:"Up to 300 °F (149 °C)" },
  { id:"t450",  f:450,  title:"Up to 450 °F (232 °C)", badge:"Most common" },
  { id:"t550",  f:550,  title:"Up to 550 °F (288 °C)" },
  { id:"t750",  f:750,  title:"Up to 750 °F (399 °C)" },
  { id:"t1000", f:1000, title:"Up to 1000 °F (538 °C)", desc:"The JMG limit." },
  { id:"cryo",  f:100,  title:"Cryogenic", desc:"Below −20 °F (−29 °C), down to −320 °F (−196 °C).", cryo:true },
  { id:"tunk",  f:null, title:"Not sure", desc:"We will check it with you." }
];
const PRESS = [
  { id:"p50",   psig:50,   title:"Up to 50 psig (3.4 bar)", desc:"Also the limit of the plastic and fiberglass chambers." },
  { id:"p285",  psig:285,  title:"Up to 285 psig (19.6 bar)" },
  { id:"p740",  psig:740,  title:"Up to 740 psig (51 bar)" },
  { id:"p1480", psig:1480, title:"Up to 1480 psig (102 bar)" },
  { id:"p5000", psig:5000, title:"Up to 5000 psig (345 bar)", desc:"The JMG limit." },
  { id:"punk",  psig:null, title:"Not sure", desc:"We will check it with you." }
];

/* C | Material of construction (guide p3). grp: metal / coat / plastic; maxF/minF process limits in °F; len = max measuring length in inches */
const MATERIALS = [
  { id:"CS",   grp:"metal", title:"Carbon steel", desc:"JXC external chambers only.", jxcOnly:true, cs:true },
  { id:"4S",   grp:"metal", title:"304/304L SS chamber and flanges" },
  { id:"4C",   grp:"metal", title:"304/304L SS chamber, A105 carbon steel flanges", cs:true },
  { id:"6S",   grp:"metal", title:"316/316L SS chamber and flanges", badge:"Most common" },
  { id:"6C",   grp:"metal", title:"316/316L SS chamber, A105 carbon steel flanges", cs:true },
  { id:"1S",   grp:"metal", title:"321 SS chamber and flanges" },
  { id:"1C",   grp:"metal", title:"321 SS chamber, A105 carbon steel flanges", cs:true },
  { id:"7S",   grp:"metal", title:"347 SS chamber and flanges" },
  { id:"7C",   grp:"metal", title:"347 SS chamber, A105 carbon steel flanges", cs:true },
  { id:"9L",   grp:"metal", title:"904L SS" },
  { id:"A2",   grp:"metal", title:"Alloy 20" },
  { id:"HC",   grp:"metal", title:"Hastelloy C-276" },
  { id:"HCC",  grp:"metal", title:"Hastelloy C-276, A105 carbon steel lap-joint flanges", cs:true },
  { id:"HB",   grp:"metal", title:"Hastelloy B2/B3", desc:"Parts made from bar may be B2 due to availability; all other parts B3." },
  { id:"IN60", grp:"metal", title:"Incoloy 600" },
  { id:"IN62", grp:"metal", title:"Incoloy 625" },
  { id:"IN80", grp:"metal", title:"Incoloy 800" },
  { id:"IN82", grp:"metal", title:"Incoloy 825" },
  { id:"AL",   grp:"metal", title:"Aluminum" },
  { id:"T2",   grp:"metal", title:"Titanium Grade 2" },
  { id:"ZR",   grp:"metal", title:"Zirconium 702" },
  { id:"4T", grp:"coat", title:"304/304L SS, Teflon S internal coating", desc:"For slip resistance. 450 °F max.", maxF:450, len:240, flanged:true },
  { id:"6T", grp:"coat", title:"316/316L SS, Teflon S internal coating", desc:"For slip resistance. 450 °F max.", maxF:450, len:240, flanged:true },
  { id:"4H", grp:"coat", title:"304/304L SS, Halar internal coating", desc:"For corrosion resistance. 300 °F max.", maxF:300, len:192, flanged:true, noThread:true },
  { id:"6H", grp:"coat", title:"316/316L SS, Halar internal coating", desc:"For corrosion resistance. 300 °F max.", maxF:300, len:192, flanged:true, noThread:true },
  { id:"4Z", grp:"coat", title:"304/304L SS, Tefzel internal coating", desc:"For corrosion resistance. 300 °F max.", maxF:300, len:192, flanged:true, noThread:true },
  { id:"6Z", grp:"coat", title:"316/316L SS, Tefzel internal coating", desc:"For corrosion resistance. 300 °F max.", maxF:300, len:192, flanged:true, noThread:true },
  { id:"4P", grp:"coat", title:"304/304L SS, PFA internal coating", desc:"For corrosion resistance. 400 °F max.", maxF:400, len:192, flanged:true, noThread:true },
  { id:"6P", grp:"coat", title:"316/316L SS, PFA internal coating", desc:"For corrosion resistance. 400 °F max.", maxF:400, len:192, flanged:true, noThread:true },
  { id:"PV", grp:"plastic", title:"PVC",           desc:"0 to 140 °F, 50 psig max.",   minF:0,   maxF:140, len:480, psig:50 },
  { id:"CP", grp:"plastic", title:"CPVC",          desc:"0 to 200 °F, 50 psig max.",   minF:0,   maxF:200, len:480, psig:50 },
  { id:"PE", grp:"plastic", title:"Polyethylene",  desc:"−40 to 140 °F, 50 psig max.", minF:-40, maxF:140, len:216, psig:50 },
  { id:"PP", grp:"plastic", title:"Polypropylene", desc:"35 to 200 °F, 50 psig max.",  minF:35,  maxF:200, len:480, psig:50 },
  { id:"KY", grp:"plastic", title:"Kynar (PVDF)",  desc:"−40 to 280 °F, 50 psig max.", minF:-40, maxF:280, len:216, psig:50 },
  { id:"EP", grp:"plastic", title:"Epoxy resin fiberglass",      desc:"−20 to 175 °F, 50 psig max.", minF:-20, maxF:175, len:216, psig:50 },
  { id:"VE", grp:"plastic", title:"Vinyl ester resin fiberglass", desc:"−20 to 175 °F, 50 psig max.", minF:-20, maxF:175, len:216, psig:50 }
];
const MAX_LEN = 480;   /* "Length to 40 feet" */

/* D | Float chamber configuration (guide p4): top code + top/side code + bottom/side code + bottom code.
   vd = what the end carries as vent/drain: fnpt, socket, sched (nipple), flange, none; pc = kind when the end is the process connection */
const ENDS = [
  { id:"P0", title:"Welded flat pipe cap", vd:"none", pc:"none" },
  { id:"P1", title:"Flat pipe cap with FNPT", vd:"fnpt", pc:"coupling", thr:true },
  { id:"P2", title:"Flat pipe cap with FNPT and hex plug", vd:"fnpt", pc:"coupling", thr:true },
  { id:"P3", title:"Flat pipe cap with female socket", vd:"socket", pc:"coupling" },
  { id:"P4", title:"Flat pipe cap with MNPT nipple", vd:"sched", pc:"sched", thr:true },
  { id:"P5", title:"Flat pipe cap with flat-end nipple (socket weld)", vd:"sched", pc:"sched" },
  { id:"P6", title:"Flat pipe cap with bevelled nipple (butt weld)", vd:"sched", pc:"sched" },
  { id:"P7", title:"Flat pipe cap with nipple and flange", vd:"flange", pc:"flange" },
  { id:"B0", title:"Butt-weld pipe cap", vd:"none", pc:"none", bw:true },
  { id:"B1", title:"Butt-weld cap with FNPT half coupling", vd:"fnpt", pc:"coupling", thr:true, bw:true },
  { id:"B2", title:"Butt-weld cap with FNPT half coupling and plug", vd:"fnpt", pc:"coupling", thr:true, bw:true },
  { id:"B3", title:"Butt-weld cap with socket-weld half coupling", vd:"socket", pc:"coupling", bw:true },
  { id:"B4", title:"Butt-weld cap with MNPT nipple", vd:"sched", pc:"sched", thr:true, bw:true },
  { id:"B5", title:"Butt-weld cap with flat-end nipple (socket weld)", vd:"sched", pc:"sched", bw:true },
  { id:"B6", title:"Butt-weld cap with bevelled nipple (butt weld)", vd:"sched", pc:"sched", bw:true },
  { id:"B7", title:"Butt-weld cap with nipple and flange", vd:"flange", pc:"flange", bw:true },
  { id:"B8", title:"Concentric reducer with flange", vd:"flange", pc:"flange" },
  { id:"F",  title:"Flange", vd:"none", pc:"flange", fl:true },
  { id:"F0", title:"Flange with mating blind flange", vd:"none", pc:"flange", fl:true },
  { id:"F1", title:"Flange + blind flange with FNPT", vd:"fnpt", pc:"flange", fl:true, thr:true },
  { id:"F2", title:"Flange + blind flange with FNPT and hex plug", vd:"fnpt", pc:"flange", fl:true, thr:true },
  { id:"F3", title:"Flange + blind flange with female socket", vd:"socket", pc:"flange", fl:true },
  { id:"F4", title:"Flange + blind flange with MNPT nipple", vd:"sched", pc:"flange", fl:true, thr:true },
  { id:"F5", title:"Flange + blind flange with flat-end nipple (socket weld)", vd:"sched", pc:"flange", fl:true },
  { id:"F6", title:"Flange + blind flange with bevelled nipple (butt weld)", vd:"sched", pc:"flange", fl:true },
  { id:"F7", title:"Flange + blind flange with reduced vent/drain flange and nipple", vd:"flange", pc:"flange", fl:true },
  { id:"C",  title:"Custom (describe or send a drawing)", vd:"any", pc:"any", custom:true }
];
const SIDES = [
  { id:"X",   title:"No side connection", pc:"none" },
  { id:"FE",  title:"Flange welded to extruded outlet", pc:"flange", ext:true },
  { id:"FP",  title:"Flange with pipe between flange and chamber", pc:"flange" },
  { id:"FW",  title:"Flange with weld-o-let", pc:"flange", s40:true },
  { id:"FT",  title:"Flange with butt-weld tee in the chamber", pc:"flange" },
  { id:"FC",  title:"Flange with concentric reducer", pc:"flange" },
  { id:"NTE", title:"MNPT nipple on extruded outlet", pc:"sched", ext:true },
  { id:"NT",  title:"MNPT nipple welded to chamber", pc:"sched" },
  { id:"NSE", title:"Flat-end nipple (socket weld) on extruded outlet", pc:"sched", ext:true },
  { id:"NS",  title:"Flat-end nipple (socket weld) welded to chamber", pc:"sched" },
  { id:"NBE", title:"Bevelled nipple (butt weld) on extruded outlet", pc:"sched", ext:true },
  { id:"NB",  title:"Bevelled nipple (butt weld) welded to chamber", pc:"sched" },
  { id:"CT",  title:"FNPT half coupling", pc:"coupling" },
  { id:"CS",  title:"Socket-weld half coupling", pc:"coupling" },
  { id:"WO",  title:"Weld-o-let", pc:"sched", s40:true },
  { id:"SO",  title:"Soc-o-let", pc:"sched", s40:true },
  { id:"TO",  title:"Thread-o-let", pc:"sched", s40:true }
];
const TOPMOUNT = [
  { id:"TF",  title:"Flange", desc:"Gauge hangs from a flanged top nozzle.", pc:"flange" },
  { id:"TFS", title:"Flange with removable stilling well", desc:"Calms the surface for long or turbulent tanks.", pc:"flange" },
  { id:"TP",  title:"MNPT plug", desc:"Threaded into the tank nozzle.", pc:"coupling" },
  { id:"TPS", title:"MNPT plug with integral stilling well", desc:"Threaded, with its own stilling well.", pc:"coupling" }
];
/* common configurations shown in the guide (p9 JMG/S, p11 JMG/T, p12 JXC) as [top, top/side, bottom/side, bottom] */
const PRESETS = {
  S: [
    { id:"P2FPFPF2", parts:["P2","FP","FP","F2"], title:"Flanged side connections, capped top, flanged bottom", desc:"Top: flat cap with plugged FNPT vent. Bottom: blind flange with plugged FNPT drain.", badge:"Most common" },
    { id:"P2NTNTF2", parts:["P2","NT","NT","F2"], title:"Threaded side connections, capped top, flanged bottom", desc:"MNPT nipples to the tank. Plugged FNPT vent and drain." },
    { id:"F2FPFPF2", parts:["F2","FP","FP","F2"], title:"Flanged side connections, flanged top and bottom", desc:"Blind flanges top and bottom, both with a plugged FNPT connection: the float can be removed." },
    { id:"F2NTNTF2", parts:["F2","NT","NT","F2"], title:"Threaded side connections, flanged top and bottom", desc:"MNPT nipples to the tank, blind flanges with plugged FNPT top and bottom." },
    { id:"P7XFPF2",  parts:["P7","X","FP","F2"],  title:"Top end and lower side to the tank", desc:"Top: cap with nipple and flange. Lower side flange. Bottom: blind flange with plugged drain." },
    { id:"FXXF",     parts:["F","X","X","F"],     title:"No side connections: flanged top and bottom", desc:"The top and bottom flanges are the process connections." },
    { id:"F7XXF7",   parts:["F7","X","X","F7"],   title:"No side connections: blind flanges with reduced flanges", desc:"Top and bottom blind flanges, each with a reduced flange on a nipple." }
  ],
  JXC: [
    { id:"P1NTNTP2", parts:["P1","NT","NT","P2"], title:"Threaded side connections, capped ends", desc:"Top: flat cap with FNPT for the probe. Bottom: flat cap with plugged FNPT drain.", badge:"Most common" },
    { id:"P1FPFPP2", parts:["P1","FP","FP","P2"], title:"Flanged side connections, capped ends", desc:"Top: flat cap with FNPT. Bottom: plugged FNPT drain." },
    { id:"P1NTXP1",  parts:["P1","NT","X","P1"],  title:"Upper side and bottom end to the tank (threaded)", desc:"MNPT nipple on the upper side; the bottom FNPT is the lower process connection." },
    { id:"P1FPXP7",  parts:["P1","FP","X","P7"],  title:"Upper side and bottom end to the tank (flanged)", desc:"Upper side flange; bottom cap with nipple and flange." },
    { id:"FNTNTP2",  parts:["F","NT","NT","P2"],  title:"Flanged top, threaded side connections", desc:"Top flange for a flanged probe; plugged FNPT drain." },
    { id:"FFPFPP2",  parts:["F","FP","FP","P2"],  title:"Flanged top, flanged side connections", desc:"Top flange for a flanged probe; plugged FNPT drain." },
    { id:"FNTXP1",   parts:["F","NT","X","P1"],   title:"Flanged top, upper side and bottom end to the tank", desc:"MNPT nipple on the upper side; bottom FNPT to the tank." },
    { id:"FFPXP7",   parts:["F","FP","X","P7"],   title:"Flanged top, upper side flange and flanged bottom", desc:"Upper side flange; bottom cap with nipple and flange." }
  ]
};
/* E/F | connection description (guide p5) */
const SIZES = [ ["5","1/2″"], ["7","3/4″"], ["1","1″"], ["15","1-1/2″"], ["2","2″"], ["3","3″"], ["4","4″"] ].map(([id,t]) => ({ id, title:t, nps:{ "5":.5, "7":.75, "1":1, "15":1.5, "2":2, "3":3, "4":4 }[id] }));
const RATINGS = {
  flange:   [ ["1","150#"], ["3","300#"], ["6","600#"], ["9","900#"], ["15","1500#"], ["25","2500#"] ],
  sched:    [ ["4","Schedule 40"], ["8","Schedule 80"], ["16","Schedule 160"] ],
  coupling: [ ["30","3000#"], ["60","6000#"] ]
};
const RATING_KIND_TXT = { flange:"Flange rating", sched:"Nipple / o-let schedule", coupling:"Half coupling / hex plug rating" };
const faceTxt = id => byId(FACES, id).title.replace(/^[A-Z](?=[a-z])/, c => c.toLowerCase());
const FACES = [ ["R","Raised face"], ["F","Flat face"], ["T","RTJ (ring joint)"], ["L","Lap joint"], ["S","Stub end with loose flange"], ["C","Other (specify)"] ].map(([id,t]) => ({ id, title:t }));

/* G | Indicator type (guide p6). max = process °F; sf = bargraph types that accept H; frost = types that accept F; st = shuttle; glass */
const INDICATORS = [
  { id:"STP",  max:350,  st:true,  title:"Shuttle, polycarbonate tube", desc:"Standard width single tracker. 350 °F max." },
  { id:"STG",  max:450,  st:true,  glass:true, title:"Shuttle, glass tube", desc:"Standard width single tracker. 450 °F max." },
  { id:"STH",  max:1000, st:true,  glass:true, title:"Shuttle, high temperature, glass tube", desc:"Standard width single tracker. 1000 °F max." },
  { id:"SF1P", max:350,  sf:true,  frost:true, title:"Bargraph yellow/black, polycarbonate tube", desc:"Standard width magnetic flags. 350 °F max.", badge:"Popular" },
  { id:"SF1G", max:550,  sf:true,  glass:true, title:"Bargraph yellow/black, glass tube", desc:"Standard width magnetic flags. 550 °F max." },
  { id:"SF2P", max:350,  sf:true,  frost:true, title:"Bargraph red/white, polycarbonate tube", desc:"Standard width magnetic flags. 350 °F max." },
  { id:"SF2G", max:550,  sf:true,  glass:true, title:"Bargraph red/white, glass tube", desc:"Standard width magnetic flags. 550 °F max." },
  { id:"SFCP", max:350,  sf:true,  frost:true, color:true, title:"Bargraph in your colours, polycarbonate tube", desc:"Standard width. 350 °F max." },
  { id:"SFCG", max:550,  sf:true,  glass:true, color:true, title:"Bargraph in your colours, glass tube", desc:"Standard width. 550 °F max." },
  { id:"WF1P", max:450,  frost:true, wide:true, title:"Wide bargraph yellow/black, polycarbonate", desc:"Extra wide flags for reading from far away. 450 °F max." },
  { id:"WF2P", max:450,  frost:true, wide:true, title:"Wide bargraph red/white, polycarbonate", desc:"Extra wide flags. 450 °F max." },
  { id:"WFCP", max:450,  frost:true, wide:true, color:true, title:"Wide bargraph in your colours, polycarbonate window", desc:"Extra wide flags. 450 °F max." }
];
const ORIENTS = [
  { id:"",  title:"6 o'clock (standard)", desc:"Looking down from above with the side connections at 12 o'clock.", badge:"Standard" },
  { id:"3", title:"3 o'clock" },
  { id:"9", title:"9 o'clock" },
  { id:"C", title:"Custom position", desc:"Tell us the position in the notes." }
];
/* H | Ruler (guide p7) */
const RULERS = [
  { id:"N",  title:"No ruler" },
  { id:"F",  title:"Feet and inches, 1/2″ divisions", badge:"Common" },
  { id:"I",  title:"Inches, 1/2″ divisions", desc:"Laser-etched stainless steel." },
  { id:"I8", title:"Inches, 1/8″ divisions", desc:"Laser-etched stainless steel." },
  { id:"M",  title:"Metres and centimetres, 1 cm divisions" },
  { id:"P",  title:"Percent", desc:"Laser-etched stainless steel." },
  { id:"V",  title:"Volume", desc:"Laser-etched stainless steel. Units and graduation layout to specify.", spec:true },
  { id:"D",  title:"Dual scale", desc:"Laser-etched stainless steel. Both scale types to specify.", spec:true },
  { id:"C",  title:"Custom scale", desc:"Describe it below.", spec:true }
];
/* I | Integral secondary chamber (guide p7) */
const SEC_CFG = [
  { id:"",  title:"No secondary chamber", desc:"One chamber with the float and indicator.", badge:"Standard" },
  { id:"A", title:"Capped top with FNPT, 90° elbow at the bottom", desc:"A second chamber for a transmitter or switch on the same process connections.", top:true, small:true },
  { id:"B", title:"Flanged top, 90° elbow at the bottom", desc:"Second chamber with a top flange.", small:true },
  { id:"D", title:"Capped top and bottom with FNPT, plugged drain", desc:"Second chamber with its own drain.", top:true, drain:true },
  { id:"E", title:"Flanged top, capped bottom with plugged FNPT drain", desc:"Second chamber with a top flange and its own drain.", drain:true },
  { id:"C", title:"Custom secondary chamber", desc:"Describe it in the notes." }
];
const SEC_SIZES = [ ["15","1-1/2″ (standard)"], ["2","2″"], ["3","3″"], ["4","4″"] ].map(([id,t]) => ({ id, title:t }));
const SEC_TOPS = [ ["N5","1/2″ FNPT"], ["N7","3/4″ FNPT"], ["N1","1″ FNPT"], ["N15","1-1/2″ FNPT"], ["N2","2″ FNPT"],
  ["S5","1/2″ socket weld"], ["S7","3/4″ socket weld"], ["S1","1″ socket weld"], ["S15","1-1/2″ socket weld"], ["S2","2″ socket weld"],
  ...["1","3","6","9","15","25"].flatMap(r => ["R","F","T"].map(f => [`F${r}${f}`, `Flange ${RATINGS.flange.find(x => x[0] === r)[1]} ${FACES.find(x => x.id === f).title.toLowerCase()}`])) ];
const SEC_DRAINS = [ ["","No drain connection"], ["N5","1/2″ FNPT with 3000# hex plug"], ["N7","3/4″ FNPT with 3000# hex plug"], ["N1","1″ FNPT with 3000# hex plug"] ].map(([id,t]) => ({ id, title:t }));
const SEC_ORIENTS = [ ["3","3 o'clock"], ["6","6 o'clock"], ["9","9 o'clock"] ].map(([id,t]) => ({ id, title:t }));

/* J | Options (guide p8) */
const CH_OPTS = [
  { id:"WN", title:"Weld-neck flanges only" },
  { id:"S4", title:"Schedule 40 minimum chamber thickness", desc:"Schedule 10 is standard; the factory always designs the wall to ASME B31.3 / B31.1." },
  { id:"NE", title:"No extruded outlets" },
  { id:"G",  title:"Support gussets on side connections", desc:"For long gauges or high-vibration service." },
  { id:"OC", title:"Oversize chamber with guide rods", desc:"For flashing service." },
  { id:"SR", title:"Switch mount rod", desc:"For gauges with high-temperature insulation and switches.", jmg:true },
  { id:"AC", title:"Auxiliary connections", desc:"For a DP cell, gauge glass, displacer or other device. Specify type and location in the notes." },
  { id:"PC", title:"Powder coated" },
  { id:"BA", title:"Adjustable support brackets", qty:true },
  { id:"BW", title:"Support brackets welded to the chamber", desc:"Give the location in the notes.", qty:true }
];
const INSUL = [
  { id:"",    title:"No insulation", badge:"Standard" },
  { id:"IH",  title:"High-temperature insulation, chamber only", desc:"Also raises the bargraph indicator limit (+250 °F polycarbonate, +350 °F glass)." },
  { id:"IHF", title:"High-temperature insulation, chamber and top/bottom flanges" },
  { id:"CI",  title:"Cryogenic insulation, chamber and top/bottom flanges" }
];
const VALVES = [
  { id:"DV",  title:"Drain valve" },
  { id:"VV",  title:"Vent valve" },
  { id:"VDV", title:"Vent and drain valves" },
  { id:"IV",  title:"Isolation valves" }
];
const HEAT = [
  { id:"",     title:"No heating", badge:"Standard" },
  { id:"ST",   title:"Steam trace tubes", desc:"2 × 3/8″ × .035 316 SS." },
  { id:"HT1",  title:"Electric heat tracing, freeze protection", desc:"General-purpose area." },
  { id:"HT2",  title:"Electric heat tracing, fixed set point", desc:"35, 45, 60, 90 or 180 °F. Class I, Div. 2, Groups B, C, D." },
  { id:"HT3",  title:"Electric heat tracing, adjustable set point", desc:"300 °F max. Class I, Div. 2, Groups B, C, D." },
  { id:"HTXP", title:"Electric heat tracing, adjustable set point, explosion-proof", desc:"700 °F max. Class I, Div. 1, Groups C, D." },
  { id:"HTC",  title:"Custom electric heat tracing", desc:"Describe it in the notes." }
];
const HT2_SP = ["35","45","60","90","180"];

const SPECS = [
  ["Pressure",           "Full vacuum to 5000 psig (345 bar)"],
  ["Process temperature","-320 F to 1000 F (-196 C to 538 C)"],
  ["Fluid",              "Specific gravity as low as 0.25; interface difference in SG as low as 0.025"],
  ["Length",             "Measuring lengths to 40 feet"],
  ["Visibility",         "Indicator readable from up to 200 feet; no fluid in contact with the glass"],
  ["Chamber",            "Schedule 10 standard; wall thickness designed by the factory to ASME B31.3 or B31.1"],
  ["Extras",             "Magnetostrictive transmitter and switch options; high-temperature and cryogenic insulation"],
  ["Welding",            "Code welding in house"]
];

/* =====================================================================
   STATE
   ===================================================================== */
const STEPS = [
  { id:"app",   label:"Application" },
  { id:"mat",   label:"Material" },
  { id:"conn",  label:"Connections" },
  { id:"ind",   get label(){ return S && S.product === "JXC" ? "Chamber size" : "Indicator"; } },
  { id:"opts",  label:"Length & options" },
  { id:"review",label:"Review" }
];
const $ = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => [...el.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const byId = (arr,id) => arr.find(x => x.id === id);

function newState(){
  return { step:0, maxStep:0, product:null, loc:null, service:null, temp:null, press:null, fluid:"", sg:"",
           mat:null, cfg:null, cTop:"P2", cUp:"FP", cLow:"FP", cBot:"F2",
           eSize:null, eRate:null, eFace:null, vd:null, fSize:null, fRate:null, fFace:null,
           ind:null, indColor:"", indH:false, orient:"", ruler:null, rulerSpec:"",
           sec:"", secSize:"15", secTop:"N7", secDrain:"", secOr:"3", jxcSize:null,
           len:"", cc:"same", ccLen:"", opts:[], baQty:"1", bwQty:"1", insul:"", valves:[], valveType:"", heat:"", ht2:"60",
           qty:1, notes:"", ref:makeRef(), helpOpen:{} };
}
function makeRef(){
  const d = new Date(), p = n => String(n).padStart(2,"0");
  const rnd = Math.random().toString(36).slice(2,6).toUpperCase();
  return `JG-${String(d.getFullYear()).slice(2)}${p(d.getMonth()+1)}${p(d.getDate())}-${rnd}`;
}
let S = newState();

/* ---------- rules ---------- */
const isJMG = () => S.product === "JMG";
const isJXC = () => S.product === "JXC";
const topMount = () => isJMG() && (S.loc === "T" || S.loc === "B");
const sideStyle = () => isJXC() || (isJMG() && S.loc === "S");
const matObj = () => byId(MATERIALS, S.mat || "");
const tempObj = () => byId(TEMPS, S.temp || "");
const pressObj = () => byId(PRESS, S.press || "");
const tempF = () => { const t = tempObj(); return t ? t.f : null; };
const isCryo = () => S.temp === "cryo";

function presetList(){ if (topMount()) return TOPMOUNT; if (isJXC()) return PRESETS.JXC; if (isJMG() && S.loc === "S") return PRESETS.S; return []; }
/* the four parts of D for side-style chambers */
function parts(){
  if (!sideStyle() || !S.cfg) return null;
  if (S.cfg === "custom") return [S.cTop, S.cUp, S.cLow, S.cBot];
  const p = byId(presetList(), S.cfg); return p ? p.parts : null;
}
function dCode(){
  if (topMount()) return S.cfg || null;
  const p = parts(); return p ? p.join("") : null;
}
/* process-connection kind(s) for E, and vent/drain kind for F */
function pcKinds(){
  if (topMount()){ const t = byId(TOPMOUNT, S.cfg || ""); return t ? [t.pc] : []; }
  const p = parts(); if (!p) return [];
  const [t, u, l, b] = p.map((c, i) => byId(i === 1 || i === 2 ? SIDES : ENDS, c) || {});
  const k = [];
  if (u.id !== "X") k.push(u.pc); else k.push(t.pc);
  if (l.id !== "X") k.push(l.pc); else k.push(b.pc);
  return k.filter(x => x && x !== "none");
}
function eKind(){ const k = pcKinds().filter(x => x !== "any"); return k[0] || (pcKinds().includes("any") ? "flange" : null); }
function vdKind(){
  if (!sideStyle()) return "none";
  const p = parts(); if (!p) return "none";
  const t = byId(ENDS, p[0]) || {}, b = byId(ENDS, p[3]) || {};
  const cands = [];
  if (p[2] !== "X") cands.push(b.vd);    /* bottom end is a drain unless it is the lower process connection */
  if (p[1] !== "X") cands.push(t.vd);    /* top end is a vent unless it is the upper process connection */
  const k = cands.find(x => x && x !== "none");
  return k === "any" ? "flange" : (k || "none");
}
const vdAsked = () => vdKind() !== "none";
const vdSpecified = () => vdAsked() && (S.vd === "spec" || vdKind() !== "fnpt");

function matOffWhy(m){
  if (m.jxcOnly && !isJXC()) return "Carbon steel is for JXC external chambers only.";
  const f = tempF(), ps = (pressObj() || {}).psig;
  if (m.maxF && f != null && !isCryo() && f > m.maxF) return `Rated to ${m.maxF} °F: below your process temperature.`;
  if (m.grp === "plastic" && isCryo()) return `Not for cryogenic service (${m.desc.split(",")[0]}).`;
  if (m.psig && ps && ps > m.psig) return `${m.psig} psig maximum: below your process pressure.`;
  return null;
}
function endOffWhy(c){
  const m = matObj();
  if (m && m.flanged && !c.fl && !c.custom) return "Coated chambers need flanges on top and bottom.";
  if (m && m.noThread && c.thr) return "No threaded vent/drain connections with this coating.";
  return null;
}
function sideOffWhy(c){
  const m = matObj();
  if (c.ext && m && m.grp === "plastic") return "Extruded outlets are made on stainless steel chambers.";
  if (c.ext && S.opts.includes("NE")) return "You chose “No extruded outlets” (NE).";
  return null;
}
function presetOffWhy(p){
  if (!p.parts) return null;
  const [t, u, l, b] = p.parts;
  return endOffWhy(byId(ENDS, t)) || sideOffWhy(byId(SIDES, u)) || sideOffWhy(byId(SIDES, l)) || endOffWhy(byId(ENDS, b));
}
function topOffWhy(t){
  const m = matObj();
  if (m && m.noThread && t.pc === "coupling") return "No threaded connections with this coating.";
  return null;
}
function sizeOffWhy(z, forVd){
  const m = matObj();
  if (!forVd && m && m.flanged && z.nps < 2) return "Coated chambers need at least a 2″ process connection.";
  if (forVd && m && m.noThread && vdKind() === "flange" && z.nps < .75) return "3/4″ minimum vent/drain flange with this coating.";
  return null;
}
/* indicator: null = fine, {need:"H"} or {need:"IH"} = possible with that extra, string = not possible */
function indCheck(i){
  if (S.service === "di" && !i.st) return "Total and interface (DI) needs a shuttle (ST) indicator.";
  const f = tempF(); if (f == null || isCryo() || f <= i.max) return null;
  if (i.sf && f <= i.max + 200) return { need:"H" };
  if (i.sf && f <= i.max + (i.glass ? 350 : 250)) return { need:"IH" };
  return `${i.max} °F maximum${i.sf ? ` (${i.max + (i.glass ? 350 : 250)} °F with insulation)` : ""}: below your process temperature.`;
}
const indOffWhy = i => { const c = indCheck(i); return typeof c === "string" ? c : null; };
const indObj = () => byId(INDICATORS, S.ind || "");
const needH = () => { const i = indObj(); const c = i && indCheck(i); return !!(c && c.need === "H"); };
const needIH = () => { const i = indObj(); const c = i && indCheck(i); return !!(c && c.need === "IH"); };
const needFrost = () => { const i = indObj(); return !!(i && i.frost && isCryo()); };
function secOffWhy(c){
  if (c.id && !(isJMG() && S.loc === "S")) return "For side-mounted gauges only.";
  return null;
}
function optOffWhy(id){
  const m = matObj(), p = parts() || [];
  switch(id){
    case "WN": case "S4": return m && m.grp === "plastic" ? "For metal chambers." : null;
    case "NE": if (m && m.grp === "plastic") return "For metal chambers.";
               return p.some(c => (byId(SIDES, c) || {}).ext) ? "Your side connections use extruded outlets." : null;
    case "SR": if (!isJMG()) return "For JMG gauges."; return ["IH","IHF"].includes(S.insul) ? null : "With high-temperature insulation (IH or IHF) only.";
    case "G":  return p.length && p[1] === "X" && p[2] === "X" ? "Your chamber has no side connections." : null;
    default: return null;
  }
}
function insulOffWhy(id){
  if (needIH() && !["IH","IHF"].includes(id)) return "Your indicator needs high-temperature insulation at this process temperature.";
  return null;
}
function valveOffWhy(id){
  if (id === "VDV" && (S.valves.includes("DV") || S.valves.includes("VV"))) return "Already covered by the separate vent or drain valve.";
  if ((id === "DV" || id === "VV") && S.valves.includes("VDV")) return "Already covered by “Vent and drain valves”.";
  return null;
}
function lenMax(){ const m = matObj(); return Math.min(MAX_LEN, (m && m.len) || MAX_LEN); }
function lenValid(){ const v = +S.len; return /^\d+(\.\d+)?$/.test(String(S.len).trim()) && v >= 1 && v <= lenMax(); }
const ccAsked = () => { const p = parts(); return !!(p && p[1] !== "X" && p[2] !== "X"); };
function ccValid(){ if (!ccAsked() || S.cc === "same") return true; const v = +S.ccLen; return /^\d+(\.\d+)?$/.test(String(S.ccLen).trim()) && v >= 1 && v <= MAX_LEN + 48; }
const qtyOk = v => /^\d+$/.test(String(v).trim()) && +v >= 1 && +v <= 20;

function constrain(){
  if (isJXC()){ S.loc = null; S.service = null; S.ind = null; S.ruler = null; S.sec = ""; S.indH = false; S.orient = ""; }
  const m = matObj(); if (m && matOffWhy(m)) S.mat = null;
  const pl = presetList();
  if (S.cfg && S.cfg !== "custom" && !byId(pl, S.cfg)) S.cfg = null;
  if (S.cfg === "custom" && !sideStyle()) S.cfg = null;
  const pr = S.cfg && S.cfg !== "custom" ? byId(pl, S.cfg) : null;
  if (pr && (pr.parts ? presetOffWhy(pr) : topOffWhy(pr))) S.cfg = null;
  if (S.cfg === "custom"){
    const okEnd = c => !endOffWhy(byId(ENDS, c)), okSide = c => !sideOffWhy(byId(SIDES, c));
    const firstEnd = () => (ENDS.find(e => okEnd(e.id) && e.fl && e.vd === "fnpt") || ENDS.find(e => okEnd(e.id)) || {}).id;
    if (!okEnd(S.cTop)) S.cTop = firstEnd();
    if (!okEnd(S.cBot)) S.cBot = firstEnd();
    if (!okSide(S.cUp)) S.cUp = "FP";
    if (!okSide(S.cLow)) S.cLow = "FP";
  }
  const k = eKind();
  if (S.eSize && sizeOffWhy(byId(SIZES, S.eSize), false)) S.eSize = null;
  if (S.eRate && !(RATINGS[k] || []).some(r => r[0] === S.eRate)) S.eRate = null;
  if (k !== "flange") S.eFace = null;
  const vk = vdKind();
  if (!vdAsked()) { S.vd = null; }
  else if (vk !== "fnpt") S.vd = "spec";
  if (!vdSpecified()){ S.fSize = null; S.fRate = null; S.fFace = null; }
  else {
    if (S.fSize && sizeOffWhy(byId(SIZES, S.fSize), true)) S.fSize = null;
    const vr = RATINGS[vk === "fnpt" || vk === "socket" ? "coupling" : vk] || [];
    if (S.fRate && !vr.some(r => r[0] === S.fRate)) S.fRate = null;
    if (vk !== "flange") S.fFace = null;
  }
  const io = indObj(); if (io && indOffWhy(io)) S.ind = null;
  if (!indObj() || !indObj().sf) S.indH = false;
  if (needH()) S.indH = true;
  if (!indObj() || !indObj().color) S.indColor = "";
  const ro = byId(RULERS, S.ruler || ""); if (!ro || !ro.spec) S.rulerSpec = "";
  if (S.sec && secOffWhy(byId(SEC_CFG, S.sec))) S.sec = "";
  const sc = byId(SEC_CFG, S.sec);
  if (sc && sc.small && !["15","2"].includes(S.secSize)) S.secSize = "15";
  if (S.orient && S.orient === S.secOr) S.secOr = S.orient === "3" ? "9" : "3";
  if (!S.orient && S.secOr === "6") S.secOr = "3";
  if (needIH() && !["IH","IHF"].includes(S.insul)) S.insul = "IH";
  S.opts = S.opts.filter(o => !optOffWhy(o));
  for (const v of ["DV","VV"]) if (S.valves.includes("VDV")) S.valves = S.valves.filter(x => x !== v);
  if (!S.valves.some(v => v !== "IV") && !S.valves.includes("IV")) S.valveType = "";
  if (!ccAsked()) { S.cc = "same"; S.ccLen = ""; }
}

/* ---------- derived values ---------- */
function eCode(){
  const k = eKind(); if (!S.eSize || !S.eRate) return null;
  return S.eSize + S.eRate + (k === "flange" ? (S.eFace || "") : "");
}
function fCode(){
  if (!vdSpecified()) return "";
  if (!S.fSize || !S.fRate) return null;
  return S.fSize + S.fRate + (vdKind() === "flange" ? (S.fFace || "") : "");
}
function gCode(){
  if (!isJMG() || !S.ind) return isJMG() ? null : "";
  return S.ind + (S.indH ? "H" : "") + (needFrost() ? "F" : "") + S.orient;
}
function iCode(){
  if (isJXC()) return S.jxcSize || null;
  if (!S.sec || S.loc !== "S") return "";
  const c = byId(SEC_CFG, S.sec);
  if (c.id === "C") return "C";
  return c.id + S.secSize + (c.top ? S.secTop : "") + (c.drain ? S.secDrain : "") + S.secOr;
}
function serviceOpt(){ return S.service === "if" ? "IF" : S.service === "di" ? "DI" : null; }
function jCodes(){
  const c = [], so = serviceOpt();
  /* guide order: WN S4 NE IF DI G OC SR AC PC BA BW, then insulation, valves, heating */
  CH_OPTS.forEach(o => { if (o.id === "G" && so) c.push(so); if (S.opts.includes(o.id)) c.push(o.qty ? o.id + String(+(o.id === "BA" ? S.baQty : S.bwQty)) : o.id); });
  if (S.insul) c.push(S.insul);
  VALVES.forEach(v => { if (S.valves.includes(v.id)) c.push(v.id); });
  if (S.heat) c.push(S.heat);
  return c;
}
function lCode(){ return ccAsked() && S.cc === "diff" && S.ccLen ? String(+S.ccLen) : ""; }
/* every position A..L, "?" when still open, "" when left blank */
function positions(){
  const q = v => v == null ? "?" : v;
  return [
    ["A", q(S.product)],
    ["B", isJXC() ? "" : q(S.loc)],
    ["C", q(S.mat)],
    ["D", q(dCode())],
    ["E", q(eCode())],
    ["F", q(fCode())],
    ["G", q(gCode())],
    ["H", isJXC() ? "" : q(S.ruler)],
    ["I", q(iCode())],
    ["J", jCodes().join("-")],
    ["K", S.len && lenValid() ? String(+S.len) : "?"],
    ["L", lCode()]
  ];
}
function partNumber(){ return positions().map(p => p[1]).filter(v => v !== "").join("-"); }
const codeIsFinal = () => !partNumber().includes("?");

function sizeTxt(id){ return (byId(SIZES, id || "") || {}).title || "?"; }
function rateTxt(kind, id){ const r = (RATINGS[kind] || []).find(x => x[0] === id); return r ? r[1] : "?"; }
function connText(){
  const k = eKind(); if (!S.eSize) return null;
  return `${sizeTxt(S.eSize)} ${rateTxt(k, S.eRate)}${k === "flange" && S.eFace ? " " + faceTxt(S.eFace) : ""}${k === "sched" ? " nipple/o-let" : k === "coupling" ? (topMount() ? " MNPT plug" : " coupling") : " flange"}`;
}
function vdText(){
  if (!sideStyle() || !S.cfg) return null;
  if (!vdAsked()) return "None at the chamber ends";
  if (!vdSpecified()) return "Standard 1/2″ FNPT";
  if (!S.fSize) return null;
  const vk = vdKind(), rk = vk === "fnpt" || vk === "socket" ? "coupling" : vk;
  return `${sizeTxt(S.fSize)} ${rateTxt(rk, S.fRate)}${vk === "flange" && S.fFace ? " " + faceTxt(S.fFace) : ""} ${({ fnpt:"FNPT", socket:"socket weld", sched:"nipple", flange:"flange" })[vk]}`;
}
function cfgText(){
  if (!S.cfg) return null;
  if (topMount()) { const t = byId(TOPMOUNT, S.cfg); return `${t.id}: ${t.title}`; }
  if (S.cfg === "custom") return `${dCode()}: your own configuration`;
  const p = byId(presetList(), S.cfg); return p ? `${p.id}: ${p.title}` : null;
}
function indText(){
  if (isJXC()) return null;
  const i = indObj(); if (!i) return null;
  const ex = [S.indH ? "insulation pad (H)" : null, needFrost() ? "frost extension (F)" : null, i.color && S.indColor ? `colours: ${S.indColor}` : null].filter(Boolean);
  return `${i.title}${ex.length ? ", " + ex.join(", ") : ""}; ${byId(ORIENTS, S.orient).title}`;
}
function rulerText(){ const r = byId(RULERS, S.ruler || ""); return r ? r.title + (S.rulerSpec ? ` (${S.rulerSpec})` : "") : null; }
function secText(){
  if (isJXC()) return S.jxcSize ? `Chamber size ${byId(SEC_SIZES, S.jxcSize).title.replace(" (standard)","")}` : null;
  if (S.loc !== "S") return "Not available on top/bottom mounting";
  const c = byId(SEC_CFG, S.sec); if (!c.id) return "None";
  if (c.id === "C") return "Custom (see notes)";
  const top = c.top ? `, top ${SEC_TOPS.find(t => t[0] === S.secTop)[1]}` : "";
  const dr = c.drain ? `, drain: ${byId(SEC_DRAINS, S.secDrain).title.toLowerCase()}` : "";
  return `${c.id}: ${byId(SEC_SIZES, S.secSize).title.replace(" (standard)","")}${top}${dr}, at ${S.secOr} o'clock`;
}
function lenText(){ return S.len && lenValid() ? `${+S.len} in (${(+S.len * 25.4 / 1000).toFixed(2)} m)` : null; }
function ccText(){
  const p = parts();
  if (topMount() || (p && !ccAsked())) return "Set by the factory from the float length";
  if (!p) return null;
  return S.cc === "diff" ? (S.ccLen ? `${+S.ccLen} in` : null) : "Same as measuring length";
}
function optsText(){
  const t = [];
  const so = serviceOpt(); if (so) t.push(so === "IF" ? "Interface level indication (IF)" : "Total and interface indication (DI)");
  CH_OPTS.forEach(o => { if (S.opts.includes(o.id)) t.push(o.qty ? `${o.title} × ${o.id === "BA" ? S.baQty : S.bwQty}` : o.title); });
  if (S.insul) t.push(byId(INSUL, S.insul).title);
  VALVES.forEach(v => { if (S.valves.includes(v.id)) t.push(v.title); });
  if (S.valveType.trim()) t.push(`valve type: ${S.valveType.trim()}`);
  if (S.heat) t.push(byId(HEAT, S.heat).title + (S.heat === "HT2" ? ` at ${S.ht2} °F` : ""));
  return t.length ? t.join("; ") : "None";
}
function fluidText(){
  const bits = [S.fluid.trim() || null, S.sg.trim() ? `SG ${S.sg.trim()}` : null].filter(Boolean);
  return bits.length ? bits.join(", ") : "Not given";
}

function validStep(id){
  switch(id){
    case "app":  return !!(S.product && S.temp && S.press && (isJXC() || (S.loc && S.service)) && sgValid());
    case "mat":  return !!S.mat;
    case "conn": return !!(S.cfg && eKind() && S.eSize && S.eRate && (eKind() !== "flange" || S.eFace) &&
                   (!vdAsked() || (S.vd && (!vdSpecified() || (S.fSize && S.fRate && (vdKind() !== "flange" || S.fFace))))));
    case "ind":  if (isJXC()) return !!S.jxcSize;
                 return !!(S.ind && (!indObj().color || S.indColor.trim()) && S.ruler && (!byId(RULERS, S.ruler).spec || S.rulerSpec.trim()));
    case "opts": return lenValid() && ccValid() && (!S.opts.includes("BA") || qtyOk(S.baQty)) && (!S.opts.includes("BW") || qtyOk(S.bwQty));
    default:     return true;
  }
}
function sgValid(){ const v = S.sg.trim(); return !v || (/^\d*\.?\d+$/.test(v) && +v > 0 && +v < 5); }
const isComplete = () => STEPS.slice(0,-1).every(s => validStep(s.id));

function getNotes(){
  const warn = [], info = [];
  const m = matObj(), p = parts() || [], ind = indObj(), k = eKind();
  if (S.temp === "tunk") warn.push("Process temperature to be confirmed: it decides the material, indicator and insulation.");
  if (S.press === "punk") warn.push("Process pressure to be confirmed: it decides the chamber wall and the flange rating.");
  if (S.sg.trim() && sgValid() && +S.sg < .25) warn.push(`Specific gravity ${S.sg.trim()} is below 0.25, the lowest the JMG float handles. Please talk to us.`);
  if (S.service === "if" || S.service === "di") warn.push("Interface service: give both fluids and their specific gravities in the notes. The difference can be as low as 0.025.");
  if (m && m.flanged) info.push(`${m.title}: measuring length up to ${m.len / 12} ft, flanges on top and bottom, 2″ minimum process connection${m.noThread ? ", no threaded vent/drain, 3/4″ minimum vent/drain flange" : ""}.`);
  if (m && m.grp === "plastic") info.push(`${m.title}: ${m.desc.replace(/\.$/,"")}; measuring length up to ${m.len / 12} ft.`);
  if (m && m.id === "HB") info.push("Hastelloy B: parts made from bar may be B2 due to availability; all other parts are B3.");
  if (m && m.cs && isCryo()) warn.push("Cryogenic service with carbon steel (A105) parts: low-temperature material is likely needed. Please confirm with the manufacturer.");
  if (S.cfg === "custom") info.push(`Your own chamber configuration ${dCode()}: the factory checks it against your drawing or description.`);
  if (p.includes("C")) warn.push("Custom top or bottom end (C): describe it or send a drawing with your request.");
  if (p.some(c => (byId(ENDS, c) || {}).bw)) info.push("Butt-weld caps: the weld root cannot be ground smooth inside, so the float may touch it if the float stop spring is over-compressed. Flat pipe caps are standard.");
  if (p.includes("FT")) warn.push("Butt-weld tee side connections are liked by piping engineers but not preferred by the factory: the float may not move smoothly over the whole length.");
  if (p.some(c => (byId(SIDES, c) || {}).s40)) info.push("Weld-o-let style side connections need a schedule 40 minimum chamber.");
  if (p.some(c => (byId(SIDES, c) || {}).ext)) info.push("Extruded outlets give a smooth, full-bore float path. Available on all schedule 10 SS chambers and some schedule 40 SS chambers, depending on the maximum pressure.");
  if (p.includes("FP") && m && (m.cs || S.insul === "CI")) info.push("Flange with pipe (FP) is the usual choice with carbon steel flanges or cryogenic insulation.");
  const sz = byId(SIZES, S.eSize || "");
  if (sz && sz.nps > 2 && ["FE","FP","FW","FT"].some(c => p[1] === c || p[2] === c)) warn.push("Side process flanges larger than 2″ normally use a flange with concentric reducer (FC).");
  if (new Set(pcKinds()).size > 1) warn.push("Your two process connections are of different types; the model number describes one. We will confirm the second with you.");
  if (topMount() && ["TF","TP"].includes(S.cfg) && (+S.len > 24 || !S.len)) warn.push("Top/bottom mounting without a stilling well: above 24″ measuring length or in turbulent tanks, a stilling well you supply is needed (or choose TFS / TPS).");
  if (vdSpecified() && vdKind() === "flange" && byId(SIZES, S.fSize || "") && byId(SIZES, S.fSize).nps > .75) info.push("Vent/drain connections larger than 3/4″ may need high-hub blind flanges, which raise the price.");
  if (ind && ind.color) info.push(`Custom indicator colours: ${S.indColor.trim() || "to be specified"}.`);
  if (S.indH) info.push("Insulation pad behind the indicator (H) raises its process temperature limit by 200 °F.");
  if (needIH()) info.push("High-temperature insulation (IH) raises the bargraph limit by 250 °F (polycarbonate) or 350 °F (glass) at your temperature.");
  if (needFrost()) info.push("Frost extension (F) added to the indicator for cryogenic service.");
  if (isCryo() && ind && !ind.frost) warn.push("Cryogenic service with a glass-tube or shuttle indicator: frost protection to be confirmed with the manufacturer.");
  if (isCryo() && S.insul !== "CI") info.push("Cryogenic insulation (CI) is usually added for cryogenic service.");
  if (S.orient === "C") warn.push("Custom indicator position: tell us the position in the notes.");
  if (S.orient !== "C" && isJMG()) info.push("Indicator position can be changed in the field on uninsulated gauges.");
  const sc = byId(SEC_CFG, S.sec);
  if (sc && sc.id && sc.id !== "C"){
    if (S.secSize === "2") info.push("2″ secondary chamber: available on all schedule 10 JMGs, on some schedule 40 and heavier-wall JMGs (consult the factory).");
    if (["B","E"].includes(sc.id)) warn.push("Secondary chamber top flange size and rating: to be confirmed with the manufacturer.");
  }
  if (sc && sc.id === "C") warn.push("Custom secondary chamber: describe it in the notes.");
  if (isJXC()) warn.push("JXC chamber size: the guide puts it in position I; any top-connection code there is to be confirmed with the manufacturer.");
  if (S.opts.includes("AC")) warn.push("Auxiliary connections (AC): give the connection type and location in the notes.");
  if (S.opts.includes("BW")) warn.push("Welded support brackets (BW): give the bracket locations in the notes.");
  if (S.valves.length && !S.valveType.trim()) warn.push("Valves: type, size and make to be specified.");
  if (S.heat === "HTC") warn.push("Custom heat tracing (HTC): describe the requirement in the notes.");
  const ps = (pressObj() || {}).psig;
  if (k === "flange" && ps){ const sug = ps <= 285 ? "150#" : ps <= 740 ? "300#" : ps <= 1480 ? "600#" : ps <= 2220 ? "900#" : ps <= 3705 ? "1500#" : "2500#";
    info.push(`For up to ${ps} psig a ${sug} flange is typical at ambient temperature; ratings drop as temperature rises, so the factory confirms the class.`); }
  if (topMount() || (p.length && !ccAsked())) info.push("Centre-to-flange or flange-to-flange dimensions are set by the factory from the float length.");
  info.push("The factory designs the chamber wall (schedule 10 standard) to ASME B31.3 or B31.1 for your pressure and temperature.");
  info.push("Model number positions are joined with hyphens here for readability. The guide gives no complete example, so the exact layout is to be confirmed with the manufacturer.");
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
const field = (id, label, value, ph, unit, mode) => `<div class="inline-field"><label class="field"><span class="l">${esc(label)}</span>${unit ? `<span class="unit-input">` : ""}<input id="${id}" type="text" inputmode="${mode || "text"}" value="${esc(value)}" placeholder="${esc(ph || "")}">${unit ? `<em>${esc(unit)}</em></span>` : ""}</label></div>`;
const select = (key, label, list, offFn) => `<label class="field"><span class="l">${esc(label)}</span><select data-k="${key}">${list.map(o => { const why = offFn ? offFn(o) : null;
  return `<option value="${esc(o.id)}" ${S[key]===o.id?"selected":""} ${why?"disabled":""}>${esc(o.id)} · ${esc(o.title)}${why?" (not available)":""}</option>`; }).join("")}</select></label>`;
const rateList = kind => (RATINGS[kind] || []).map(([id,t]) => ({ id, title:t }));

/* =====================================================================
   STEP VIEWS
   ===================================================================== */
const VIEWS = {
  app(){
    return `<div class="step">
      ${head(1,"Tell us about your tank","A magnetic level gauge shows the level without any fluid touching the glass. A few questions about the application decide what fits.")}
      ${group("What do you need?", null, radios("product", PRODUCTS), "opts--wide")}
      ${isJMG() ? group("Where does the gauge mount?", null, radios("loc", LOCS)) : ""}
      ${isJMG() ? group("What should it show?", null, radios("service", SERVICES)) : ""}
      ${group("Highest process temperature", "At the chamber, including upsets.", radios("temp", TEMPS))}
      ${group("Highest process pressure", "Design pressure of the tank or line. Full vacuum is fine.", radios("press", PRESS))}
      <div class="group"><div class="group__title">Your fluid (optional)</div><div class="group__sub">Helps the factory size the float.</div>
        <div class="grid2" style="margin-top:12px"><label class="field"><span class="l">Fluid (optional)</span><input id="fluid" type="text" value="${esc(S.fluid)}" placeholder="e.g. diesel, water, ammonia"></label>
        <label class="field"><span class="l">Specific gravity (optional)</span><input id="sg" type="text" inputmode="decimal" value="${esc(S.sg)}" placeholder="e.g. 0.85"></label></div></div>
      ${helpHtml("app","Gauge or chamber only?",`<p>A <strong>JMG</strong> is the complete gauge: chamber, float, indicator and ruler. A <strong>JXC</strong> is just the chamber, for a level transmitter or switch that goes straight into it, such as a magnetostrictive or radar probe.</p><p><strong>Side mounting</strong> is the usual choice. <strong>Top or bottom mounting</strong> suits tanks without side nozzles.</p>`)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  mat(){
    const opt = m => { const why = matOffWhy(m); return optHtml({ name:"mat", value:m.id, checked:S.mat===m.id, title:m.title, desc:why || m.desc, meta:m.id, badge:m.badge, off:!!why }); };
    return `<div class="step">
      ${head(2,"Which material?","Wetted parts of the chamber. Materials that do not fit your temperature or pressure are greyed out.")}
      <div class="group"><div class="group__title">Chamber material</div><div class="group__sub">Stainless steels and alloys first, then internally coated stainless, then plastics and fiberglass.</div>
        <div class="opts">${MATERIALS.filter(m => m.grp === "metal").map(opt).join("")}</div>
        <div class="group__sub" style="margin-top:18px">Stainless steel with an internal coating</div>
        <div class="opts">${MATERIALS.filter(m => m.grp === "coat").map(opt).join("")}</div>
        <div class="group__sub" style="margin-top:18px">Plastics and fiberglass (50 psig max)</div>
        <div class="opts">${MATERIALS.filter(m => m.grp === "plastic").map(opt).join("")}</div></div>
      ${helpHtml("mat","How do I choose?",`<p><strong>316/316L stainless</strong> suits most water, hydrocarbon and chemical duties. Carbon steel (A105) flanges on a stainless chamber lower the price where the flanges are not wetted by an aggressive fluid.</p><p><strong>Coatings</strong> help with sticky fluids (Teflon S) or corrosive ones (Halar, Tefzel, PFA). <strong>Plastic chambers</strong> are for low pressure: 50 psig maximum.</p>`)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  conn(){
    const k = eKind(), vk = vdKind(), rk = vk === "fnpt" || vk === "socket" ? "coupling" : vk;
    let cfgHtml;
    if (topMount()){
      cfgHtml = group("How does it fit to the tank?", "Top and bottom mounted configuration codes (guide p4).", TOPMOUNT.map(t => { const why = topOffWhy(t);
        return optHtml({ name:"cfg", value:t.id, checked:S.cfg===t.id, title:t.title, desc:why || t.desc, meta:t.id, off:!!why }); }).join(""), "opts--wide");
    } else {
      cfgHtml = group("Chamber configuration", "Top end, upper connection, lower connection and bottom end. Pick one of the common layouts, or build your own.",
        presetList().map(p => { const why = presetOffWhy(p);
          return optHtml({ name:"cfg", value:p.id, checked:S.cfg===p.id, title:p.title, desc:why || p.desc, meta:p.id, badge:p.badge, off:!!why }); }).join("") +
        optHtml({ name:"cfg", value:"custom", checked:S.cfg==="custom", title:"Build my own", desc:"Choose each end and side connection from the full code list." }), "opts--wide");
      if (S.cfg === "custom") cfgHtml += `<div class="group"><div class="group__title">Build your chamber</div><div class="group__sub">Codes that do not fit your material are marked “not available”. Your code: <strong>${esc(dCode())}</strong></div>
        <div class="sel-grid">${select("cTop","Top end",ENDS,endOffWhy)}${select("cUp","Upper (top/side) connection",SIDES,sideOffWhy)}${select("cLow","Lower (bottom/side) connection",SIDES,sideOffWhy)}${select("cBot","Bottom end",ENDS,endOffWhy)}</div></div>`;
    }
    const sizes = (name, forVd) => SIZES.map(z => { const why = sizeOffWhy(z, forVd); return optHtml({ name, value:z.id, checked:S[name]===z.id, title:z.title, desc:why, meta:z.id, off:!!why }); }).join("");
    const kindTxt = { flange:"flanged", sched:"nipple or o-let", coupling: topMount() ? "MNPT plug" : "half coupling" }[k];
    return `<div class="step">
      ${head(3,"Chamber and connections","How the chamber is built and how it connects to your tank.")}
      ${cfgHtml}
      ${k ? group("Process connection size", `Your process connections are ${kindTxt}.`, sizes("eSize", false)) : ""}
      ${k ? group(RATING_KIND_TXT[k], null, radios("eRate", rateList(k), o => ({ meta:o.id }))) : ""}
      ${k === "flange" ? group("Flange face", null, radios("eFace", FACES, o => ({ meta:o.id }))) : ""}
      ${vdAsked() && vk === "fnpt" ? group("Vent and drain connections", "At the top and bottom ends of the chamber.",
          optHtml({ name:"vd", value:"std", checked:S.vd==="std", title:"Standard 1/2″ FNPT", desc:"Position F left blank.", badge:"Standard" }) +
          optHtml({ name:"vd", value:"spec", checked:S.vd==="spec", title:"Another size or rating", desc:"Choose size and rating next." }), "opts--wide") : ""}
      ${vdSpecified() ? group("Vent/drain connection size", vk === "fnpt" ? null : `Your chamber ends carry a ${({ socket:"socket", sched:"nipple", flange:"flange" })[vk]} vent/drain.`, sizes("fSize", true)) : ""}
      ${vdSpecified() ? group(`Vent/drain: ${RATING_KIND_TXT[rk].toLowerCase()}`, null, radios("fRate", rateList(rk), o => ({ meta:o.id }))) : ""}
      ${vdSpecified() && vk === "flange" ? group("Vent/drain flange face", null, radios("fFace", FACES, o => ({ meta:o.id }))) : ""}
      ${helpHtml("conn","What do the codes mean?",`<p>The chamber code has four parts: <strong>top end</strong>, <strong>upper connection</strong>, <strong>lower connection</strong> and <strong>bottom end</strong>. For example <strong>P2FPFPF2</strong> is a flat cap with a plugged vent on top, two side flanges, and a blind flange with a plugged drain at the bottom.</p><p>A flanged top or bottom lets the float be removed without cutting the chamber. Extruded outlets (FE, NTE…) give the smoothest float path.</p>`)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  ind(){
    if (isJXC()) return `<div class="step">
      ${head(4,"Chamber size","The JXC chamber holds your transmitter or switch probe.")}
      ${group("Chamber size", "From 1-1/2″ to 4″. Your transmitter or switch maker states the minimum.", radios("jxcSize", SEC_SIZES, o => ({ meta:o.id })))}
      ${helpHtml("ind","Which size?",`<p>Magnetostrictive and guided-wave radar probes usually fit a 2″ chamber; a larger chamber gives more clearance for floats or coaxial probes. The factory checks the size against the probe you name in the notes.</p>`)}
      <div class="feedback" id="feedback"></div>
    </div>`;
    const io = indObj(), sc = byId(SEC_CFG, S.sec), ro = byId(RULERS, S.ruler || "");
    const showExtras = io && (io.sf || needFrost());
    return `<div class="step">
      ${head(4,"Indicator and scale","How you read the level.")}
      ${group("Indicator type", "Shuttle: one coloured follower. Bargraph: magnetic flags that flip colour below the level.", INDICATORS.map(i => { const c = indCheck(i), why = typeof c === "string" ? c : null;
        return optHtml({ name:"ind", value:i.id, checked:S.ind===i.id, title:i.title, desc:why || (c && c.need ? `${i.desc} At your temperature with ${c.need === "H" ? "an insulation pad (H)" : "high-temperature insulation (IH)"}.` : i.desc), meta:i.id, badge:i.badge, off:!!why }); }).join(""))}
      ${io && io.color ? `<div class="group"><div class="group__title">Bargraph colours</div>${field("indColor","Colours of the flags (above / below the level)",S.indColor,"e.g. blue / white")}</div>` : ""}
      ${showExtras ? group("Indicator extras", null,
          (io.sf ? optHtml({ type:"checkbox", name:"indH", value:"1", checked:S.indH, off:needH(), title:"Insulation pad behind the indicator (H)", desc:needH() ? "Needed at your process temperature." : "Raises the indicator's process temperature limit by 200 °F." }) : "") +
          (needFrost() ? optHtml({ type:"checkbox", name:"frost", value:"1", checked:true, off:true, title:"Frost extension (F)", desc:"Added for cryogenic service." }) : "")) : ""}
      ${group("Indicator position", "Looking down from above, with the side connections at 12 o'clock.", radios("orient", ORIENTS, o => ({ meta:o.id || "blank" })))}
      ${group("Ruler", null, radios("ruler", RULERS, o => ({ meta:o.id })))}
      ${ro && ro.spec ? `<div class="group"><div class="group__title">Describe the scale</div>${field("rulerSpec","Units and graduations",S.rulerSpec,"e.g. 0–5000 gal, 100 gal steps")}</div>` : ""}
      ${S.loc === "S" ? group("Second chamber for a transmitter or switch?", "An integral secondary chamber on the same process connections.", radios("sec", SEC_CFG, o => ({ meta:o.id || "blank" })), "opts--wide") : ""}
      ${sc && sc.id && sc.id !== "C" ? group("Secondary chamber size", sc.small ? "1-1/2″ or 2″ with this layout." : null, radios("secSize", SEC_SIZES, o => ({ meta:o.id, off:sc.small && !["15","2"].includes(o.id), desc:sc.small && !["15","2"].includes(o.id) ? "Not with this layout." : null }))) : ""}
      ${sc && sc.top ? `<div class="group"><div class="group__title">Secondary chamber top connection</div><div class="sel-grid">${select("secTop","Top connection",SEC_TOPS.map(([id,t]) => ({ id, title:t })))}</div></div>` : ""}
      ${sc && sc.drain ? group("Secondary chamber drain", null, radios("secDrain", SEC_DRAINS, o => ({ meta:o.id || "blank" }))) : ""}
      ${sc && sc.id && sc.id !== "C" ? group("Secondary chamber position", "It cannot sit in the same position as the indicator.", radios("secOr", SEC_ORIENTS, o => { const same = o.id === (S.orient || "6"); return { meta:o.id, off:same, desc:same ? "This is where the indicator is." : null }; })) : ""}
      ${helpHtml("ind","Shuttle or bargraph?",`<p>A <strong>bargraph</strong> shows a solid column of colour that is easy to read from far away; the <strong>wide</strong> version reads furthest. A <strong>shuttle</strong> is a single follower: it goes to 1000 °F and is needed for total-and-interface gauges.</p><p>Glass tubes take more heat than polycarbonate. Extra heat margin comes from an insulation pad (H) or high-temperature insulation (IH).</p>`)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  opts(){
    const p = parts();
    return `<div class="step">
      ${head(5,"Length and options","The measuring length is the span the indicator covers.")}
      <div class="group"><div class="group__title">Measuring length</div><div class="group__sub">Usually the centre-to-centre distance of the side connections. Up to ${lenMax()} in (${lenMax() / 12} ft) with your material.</div>
        ${field("len","Measuring length (up to " + lenMax() + " in)",S.len,"e.g. 60","in","decimal")}</div>
      ${ccAsked() ? group("Centre-to-centre of the side connections", null,
          optHtml({ name:"cc", value:"same", checked:S.cc==="same", title:"Same as the measuring length", desc:"Position L left blank.", badge:"Standard" }) +
          optHtml({ name:"cc", value:"diff", checked:S.cc==="diff", title:"A different centre-to-centre", desc:"Enter it next." }), "opts--wide") : ""}
      ${ccAsked() && S.cc === "diff" ? `<div class="group"><div class="group__title">Centre-to-centre distance</div>${field("ccLen","Centre-to-centre",S.ccLen,"e.g. 72","in","decimal")}</div>` : ""}
      <div class="group"><div class="group__title">Chamber options</div><div class="group__sub">All optional. ${serviceOpt() ? `${serviceOpt()} (${S.service === "if" ? "interface" : "total and interface"}) is added from your answer in step 1.` : ""}</div>
        <div class="opts">${CH_OPTS.filter(o => !o.jmg || isJMG()).map(o => { const why = optOffWhy(o.id), on = S.opts.includes(o.id);
          return optHtml({ type:"checkbox", name:"opts", value:o.id, checked:on, title:o.title, desc:why || o.desc, meta:o.qty ? o.id + "_ (quantity)" : o.id, off:!on && !!why }); }).join("")}</div>
        ${S.opts.includes("BA") ? field("baQty","Number of adjustable brackets",S.baQty,"e.g. 2",null,"numeric") : ""}
        ${S.opts.includes("BW") ? field("bwQty","Number of welded brackets",S.bwQty,"e.g. 2",null,"numeric") : ""}</div>
      ${group("Insulation", null, INSUL.map(o => { const why = insulOffWhy(o.id); return optHtml({ name:"insul", value:o.id, checked:S.insul===o.id, title:o.title, desc:why || o.desc, meta:o.id || "none", badge:o.badge, off:!!why }); }).join(""), "opts--wide")}
      <div class="group"><div class="group__title">Valves</div><div class="group__sub">All optional.</div>
        <div class="opts">${VALVES.map(v => { const why = valveOffWhy(v.id), on = S.valves.includes(v.id);
          return optHtml({ type:"checkbox", name:"valves", value:v.id, checked:on, title:v.title, desc:why, meta:v.id, off:!on && !!why }); }).join("")}</div>
        ${S.valves.length ? field("valveType","Valve type, size and make (optional)",S.valveType,"e.g. 3/4″ ball valves, 316 SS") : ""}</div>
      ${group("Heating", null, radios("heat", HEAT, o => ({ meta:o.id || "none" })), "opts--wide")}
      ${S.heat === "HT2" ? group("Fixed set point", null, HT2_SP.map(v => optHtml({ name:"ht2", value:v, checked:S.ht2===v, title:`${v} °F` })).join("")) : ""}
      ${helpHtml("opts","Which options do I need?",`<ul><li><strong>Gussets</strong> stiffen the side connections on long gauges or in vibration.</li><li><strong>Insulation</strong> keeps hot or cold service safe and lets the indicator take more heat.</li><li><strong>Heat tracing</strong> stops the fluid freezing or setting in the chamber.</li><li><strong>Brackets</strong> support long gauges.</li></ul>`)}
      <div class="feedback" id="feedback"></div>
    </div>`;
  },
  review(){
    const rows = summaryRows(true), n = getNotes();
    return `<div class="step">
      ${head(6,"Review your configuration","Check everything below. You can change any answer, then download the PDF or ask for a quotation.")}
      <div class="code-box"><div class="k">Model number</div><div class="v">${esc(partNumber())}</div>
        <div class="code-pos">${positions().map(([k,v]) => `<span><b>${k}</b>${esc(v === "" ? "blank" : v)}</span>`).join("")}</div>
        <div class="s">${codeIsFinal() ? "Built from the guide's position codes A to L. Illustrative only: confirm with the manufacturer." : "“?” marks a choice we will confirm with you."}</div></div>
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
        <label class="field"><span class="l">Notes for our team (optional)</span><textarea id="notes" placeholder="e.g. tag numbers, nozzle drawing, interface fluids, transmitter or switch model…">${esc(S.notes)}</textarea></label>
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
    if (S.sg.trim() && !sgValid()) out.push(msg("warn","Please enter the specific gravity as a number, for example 0.85."));
    getNotes().warn.filter(w => /to be confirmed: it decides|below 0.25/.test(w)).forEach(w => out.push(msg("warn",w)));
    if (S.temp === "cryo") out.push(msg("info","Cryogenic service: frost extensions and cryogenic insulation are offered in the next steps."));
    if (S.press === "p50") out.push(msg("ok","Plastic and fiberglass chambers are available at this pressure."));
    return out.join("");
  },
  mat(){
    const m = matObj(); if (!m) return "";
    return getNotes().info.filter(t => t.startsWith(m.title) || /^Hastelloy B/.test(t)).map(t => msg("info",t)).join("") +
           getNotes().warn.filter(t => /carbon steel \(A105\)/.test(t)).map(t => msg("warn",t)).join("");
  },
  conn(){
    const out = [];
    if (S.cfg && !eKind()) out.push(msg("warn","This layout has no process connection: choose at least one side connection or a top/bottom end that connects to the tank."));
    if (S.cfg) out.push(msg("ok",`Chamber code (position D): ${dCode()}${eCode() ? ` · connection (E): ${eCode()}` : ""}${fCode() ? ` · vent/drain (F): ${fCode()}` : ""}.`));
    getNotes().warn.filter(w => /FC\)|different types|weld tee|Custom top/.test(w)).forEach(w => out.push(msg("warn",w)));
    return out.join("");
  },
  ind(){
    const out = [];
    if (needIH()) out.push(msg("info","High-temperature insulation (IH) will be preselected in step 5 for this indicator."));
    if (isJMG() && S.ind) out.push(msg("ok",`Indicator code (position G): ${gCode()}.`));
    return out.join("");
  },
  opts(){
    const out = [];
    if (S.len && !lenValid()) out.push(msg("warn",`Please enter a measuring length up to ${lenMax()} in.`));
    if (S.cc === "diff" && S.ccLen && !ccValid()) out.push(msg("warn","Please enter the centre-to-centre distance in inches."));
    if ((S.opts.includes("BA") && !qtyOk(S.baQty)) || (S.opts.includes("BW") && !qtyOk(S.bwQty))) out.push(msg("warn","Please enter a bracket quantity from 1 to 20."));
    getNotes().warn.filter(w => /stilling well/.test(w)).forEach(w => out.push(msg("warn",w)));
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
    { k:"Product",            v:byId(PRODUCTS,S.product||"")?.title || null, step:g(0) },
    ...(isJXC() ? [] : [{ k:"Mounting", v:byId(LOCS,S.loc||"")?.title || null, step:g(0) },
                        { k:"Service",  v:byId(SERVICES,S.service||"")?.title || null, step:g(0) }]),
    { k:"Max. temperature",   v:tempObj()?.title || null, step:g(0) },
    { k:"Max. pressure",      v:pressObj()?.title || null, step:g(0) },
    { k:"Fluid",              v:past(0) ? fluidText() : null, step:g(0) },
    { k:"Material",           v:matObj() ? `${matObj().id}: ${matObj().title}` : null, step:g(1) },
    { k:"Chamber layout",     v:cfgText(), step:g(2) },
    { k:"Process connection", v:connText(), step:g(2) },
    ...(topMount() ? [] : [{ k:"Vent/drain", v:vdText(), step:g(2) }]),
    ...(isJXC() ? [{ k:"Chamber size", v:secText(), step:g(3) }] :
                  [{ k:"Indicator", v:indText(), step:g(3) }, { k:"Ruler", v:rulerText(), step:g(3) }, { k:"Secondary chamber", v:past(3) ? secText() : null, step:g(3) }]),
    { k:"Measuring length",   v:lenText(), step:g(4) },
    { k:"Centre-to-centre",   v:past(4) || (S.step === 4 && S.len) ? ccText() : null, step:g(4) },
    { k:"Options",            v:past(4) ? optsText() : null, step:g(4) },
    { k:"Quantity",           v:S.step >= 5 ? String(S.qty) : null, step:null }
  ];
}
function sumImgKey(){ return isJMG() && S.step === 3 ? "IND" : "JMG"; }
function renderSummary(){
  const key = sumImgKey(), img = $("#sumImg");
  if (img.dataset.key !== key){ img.src = IMG[key]; img.dataset.key = key; }
  $("#sumModel").textContent = isJXC() ? "JXC external chamber" : (S.loc ? `JMG magnetic level gauge, ${({ S:"side", T:"top", B:"bottom" })[S.loc]} mounted` : "JMG magnetic level gauge");
  const bits = [matObj() ? matObj().title : null, lenText()].filter(Boolean);
  $("#sumSub").textContent = bits.length ? bits.join(" · ") : "Your choices appear here as you go.";
  $("#sumCode").textContent = S.product ? partNumber() : "";
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
  if (id === "app") return !sgValid() ? "Please check the specific gravity." : "Please answer all questions.";
  if (id === "mat") return "Please choose a material.";
  if (id === "conn") return !S.cfg ? "Please choose a chamber layout." : "Please complete the connections.";
  if (id === "ind") return isJXC() ? "Please choose the chamber size." : "Please choose the indicator and ruler.";
  if (id === "opts") return !lenValid() ? "Please enter the measuring length." : "Please complete the options.";
  return "";
}
function renderStep(focus){
  const id = STEPS[S.step].id;
  $("#stage").innerHTML = VIEWS[id]();
  renderStepper(); renderNav(); renderSummary(); refreshFeedback(); markInvalid();
  if (focus){ const h = $("#stepTitle"); if (h){ h.focus({preventScroll:true}); }
    (function(el){ if(!el) return; var hd=document.querySelector('header'); var off=(hd&&/sticky|fixed/.test(getComputedStyle(hd).position))?hd.offsetHeight:0; var html=document.documentElement, sb=html.style.scrollBehavior; html.style.scrollBehavior='auto'; window.scrollTo(0,Math.max(0,el.getBoundingClientRect().top+window.pageYOffset-off-8)); html.style.scrollBehavior=sb; })($("#stepper")); }
}
function refreshFeedback(){ const id = STEPS[S.step].id, el = $("#feedback"); if (el && FEEDBACK[id]) el.innerHTML = FEEDBACK[id](); }
function go(i){
  if (i < 0 || i >= STEPS.length) return;
  constrain();
  if (i === 2 && vdAsked() && !S.vd) S.vd = vdKind() === "fnpt" ? "std" : "spec";
  S.step = i; S.maxStep = Math.max(S.maxStep, i);
  renderStep(true);
}
function markInvalid(){
  const bad = { len: S.len !== "" && !lenValid(), ccLen: S.ccLen !== "" && !ccValid(), sg: !sgValid(), baQty: !qtyOk(S.baQty), bwQty: !qtyOk(S.bwQty) };
  Object.entries(bad).forEach(([id, b]) => { const el = document.getElementById(id); if (el) el.setAttribute("aria-invalid", b ? "true" : "false"); });
}
function refresh(){ renderStepper(); renderNav(); renderSummary(); refreshFeedback(); markInvalid(); }
function rerenderStage(focusSel){
  const y = window.scrollY; $("#stage").innerHTML = VIEWS[STEPS[S.step].id](); window.scrollTo(0,y);
  const el = focusSel && $(focusSel); if (el) el.focus({preventScroll:true});
}

/* =====================================================================
   EVENTS
   ===================================================================== */
document.addEventListener("change", e => {
  const t = e.target;
  if (t.tagName === "SELECT" && t.dataset.k){ S[t.dataset.k] = t.value; constrain(); rerenderStage(`select[data-k="${t.dataset.k}"]`); refresh(); return; }
  if (t.type !== "radio" && t.type !== "checkbox") return;
  const n = t.name, v = t.value;
  if (n === "opts" || n === "valves"){ if (t.checked){ if (!S[n].includes(v)) S[n].push(v); } else S[n] = S[n].filter(x => x !== v); }
  else if (n === "indH") S.indH = t.checked;
  else if (n === "frost") return;
  else if (n === "product" && S.product !== v){ S.product = v; S.cfg = null; S.mat = null; S.eSize = null; S.eRate = null; S.eFace = null; S.vd = null; S.jxcSize = null; S.opts = []; }
  else if (n === "loc" && S.loc !== v){ S.loc = v; S.cfg = null; S.eRate = null; S.eFace = null; S.vd = null; }
  else if (n === "cfg" && S.cfg !== v){ S.cfg = v; S.vd = null; }
  else S[n] = v;
  constrain();
  if (n === "cfg" && vdAsked() && !S.vd) S.vd = vdKind() === "fnpt" ? "std" : "spec";
  S.maxStep = Math.max(S.maxStep, S.step);
  rerenderStage(`input[name="${n}"][value="${v}"]`);
  if ((n === "ind" && indObj()?.color) || (n === "ruler" && byId(RULERS, v)?.spec) || (n === "cc" && v === "diff")){
    const f = $(n === "ind" ? "#indColor" : n === "ruler" ? "#rulerSpec" : "#ccLen"); if (f) setTimeout(() => f.focus(), 450);
  }
  refresh();
});
const TYPED = ["fluid","sg","indColor","rulerSpec","len","ccLen","baQty","bwQty","valveType"];
document.addEventListener("input", e => {
  const t = e.target;
  if (TYPED.includes(t.id)){ S[t.id] = t.value; refresh(); }
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
    i.onload = () => { const c = document.createElement("canvas"); c.width = w; c.height = h; const x = c.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0,0,w,h);
      const r = Math.min(w / i.width, h / i.height), dw = i.width * r, dh = i.height * r; x.drawImage(i,(w - dw) / 2,(h - dh) / 2,dw,dh); res(c.toDataURL("image/jpeg", .9)); };
    i.onerror = rej; i.src = src;
  });
}
function buildPdf(logo, photo){
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit:"mm", format:"a4" });
  const W = 210, M = 18, CW = W - 2*M, GAP = 12, COL = (CW - GAP)/2, X1 = M, X2 = M + COL + GAP;
  const NAVY = [15,47,89], INK = [61,66,72], GREY = [122,126,132], LINE = [214,218,224], BLUE = [26,102,176], AMBER = [200,120,0];
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
  small(isJXC() ? "JXC external chamber" : "JMG magnetic level gauge", W - M, 26.5, { size:8, align:"right" });
  hair(M, 32, W - M);
  y = 42;

  const IW = 22, IH = 42;
  if (photo) doc.addImage(photo, "JPEG", W - M - IW, y - 6, IW, IH, undefined, "FAST");
  doc.setFont("helvetica","bold"); doc.setFontSize(17); doc.setTextColor(...NAVY);
  const cl = [];
  code.split("-").forEach((part, i) => { const piece = (i ? "-" : "") + part, last = cl.length - 1;
    if (last >= 0 && doc.getTextWidth(cl[last] + piece) <= CW - IW - 8) cl[last] += piece; else cl.push(piece); });
  doc.text(cl, M, y + 4);
  let ty = y + 4 + cl.length * 6.8;
  small(`${matObj() ? matObj().title : ""}  |  ${lenText() || ""}`, M, ty, { size:9.5 });
  ty = para(isJXC() ? "External chamber for a direct-insertion level transmitter or switch, built to ASME B31.3 or B31.1." : "Magnetic level gauge: a float in the chamber drives a magnetic indicator readable from up to 200 feet, with no fluid in contact with the glass.", M, ty + 6, CW - IW - 8, { size:8.6, color:GREY });
  small(codeIsFinal() ? "Model number built from the guide's position codes A-L; illustrative only, confirm with the manufacturer." : "\"?\" in the model number marks a choice to be confirmed.", M, ty + 1, { size:7.2 });
  ty = para(positions().map(([k,v]) => `${k}: ${v === "" ? "blank" : v}`).join("   "), M, ty + 6, CW - IW - 8, { size:7.6, color:INK });
  y = Math.max(ty + 4, y + IH - 2);

  const R = Object.fromEntries(summaryRows(true).map(r => [r.k, r.v]));
  let yl = section("Application", X1, y, COL), yr = section("Instrument", X2, y, COL);
  yl = item("Product", R["Product"], X1, yl, COL);
  if (isJMG()){ yl = item("Mounting", R["Mounting"], X1, yl, COL); yl = item("Service", R["Service"], X1, yl, COL); }
  yl = item("Max. temperature  |  max. pressure", `${R["Max. temperature"]}  |  ${R["Max. pressure"]}`, X1, yl, COL);
  yl = item("Fluid", R["Fluid"], X1, yl, COL);
  yr = item("Material", R["Material"], X2, yr, COL);
  yr = item("Chamber layout", R["Chamber layout"], X2, yr, COL);
  yr = item("Process connection", R["Process connection"], X2, yr, COL);
  if (!topMount()) yr = item("Vent/drain", R["Vent/drain"], X2, yr, COL);
  yr = item("Measuring length  |  quantity", `${R["Measuring length"]}  |  ${S.qty} pcs`, X2, yr, COL);
  y = Math.max(yl, yr) + 3;

  need(40);
  y = section(isJXC() ? "Chamber and options" : "Indicator, scale and options", M, y, CW);
  if (isJXC()){ yl = item("Chamber size", R["Chamber size"], X1, y, COL); yl = item("Centre-to-centre", R["Centre-to-centre"], X1, yl, COL); }
  else { yl = item("Indicator", R["Indicator"], X1, y, COL); yl = item("Ruler", R["Ruler"], X1, yl, COL); yl = item("Secondary chamber", R["Secondary chamber"], X1, yl, COL); yl = item("Centre-to-centre", R["Centre-to-centre"], X1, yl, COL); }
  yr = item("Options", R["Options"], X2, y, COL);
  y = Math.max(yl, yr) + 3;

  const n = getNotes();
  need(30);
  if (!n.warn.length && !S.notes.trim()){ y = section("Good to know", M, y, CW); n.info.forEach(t => { need(10); y = bullet(t, M, y + .6, CW, BLUE) + .2; }); y += 3; }
  else {
    if (n.warn.length){ y = section("Points we will check with you", M, y, CW); n.warn.forEach(t => { need(10); y = bullet(t, M, y + .6, CW, AMBER) + .2; }); y += 3; }
    if (S.notes.trim()){ need(22); y = section("Your notes", M, y, CW); y = para(S.notes.trim(), M, y, CW, { size:8.8 }) + 3; }
    need(20); y = section("Good to know", M, y, CW); n.info.forEach(t => { need(10); y = bullet(t, M, y + .6, CW, BLUE) + .2; }); y += 3;
  }

  const half = Math.ceil(SPECS.length / 2);
  need(10 + half * 10);
  y = section("Technical data (from the Jogler JMG/JXC configuration guide)", M, y + 1, CW);
  yl = y; yr = y;
  SPECS.forEach(([k, v], i) => { if (i < half) yl = compact(k, v, X1, yl, COL); else yr = compact(k, v, X2, yr, COL); });

  const pages = doc.getNumberOfPages();
  doc.setPage(pages);
  small("Demo only, not for ordering. Illustrative: confirm all specifications with the manufacturer. Source: Jogler JMG/JXC Configuration Guide Rev. B 07.2018.", M, 280.5, { size:6.8 });
  for (let p = 1; p <= pages; p++){
    doc.setPage(p); hair(M, 284, W - M);
    small("Unofficial demo by SwiftyQuote  |  sales@swiftyquote.com  |  Not affiliated with Jogler", M, 289, { size:6.8 });
    small(`${p} / ${pages}`, W - M, 289, { size:7, align:"right" });
  }
  return doc;
}
const pdfName = () => `Jogler_${S.product || "JMG"}_${S.ref}.pdf`;
async function downloadPdf(){
  if (!isComplete()){ toast("Please complete all steps first."); return; }
  const btns = $$("#btnPdf,#doneDownload"); btns.forEach(b => b.disabled = true);
  try {
    const logo = null;
    const photo = await loadImg(IMG.JMG, 220, 420).catch(() => null);
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
    `Quotation request | ${isJXC() ? "JXC external chamber" : "JMG magnetic level gauge"} | Ref. ${S.ref}`, "",
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
  $("#faqCta").href = `mailto:${DEMO_CONTACT.email}?subject=${encodeURIComponent("Configurator enquiry (from the Jogler demo)")}`;
  $("#faqContact").innerHTML = `Or write to <a href="mailto:${DEMO_CONTACT.email}">${DEMO_CONTACT.email}</a> · <a href="${DEMO_CONTACT.site}" target="_blank" rel="noopener">swiftyquote.com</a>`;
})();

window.__cfg = { get S(){ return S; }, set S(v){ S = v; }, newState, go, partNumber, positions, dCode, eKind, vdKind, getNotes, buildPdf, buildMailto, quoteText, isComplete, validStep, renderStep, constrain, matOffWhy, indCheck, optOffWhy, endOffWhy, presetOffWhy };
renderStep(false);
