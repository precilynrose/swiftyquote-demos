/* SwiftyQuote demo data sheet: shared two-column PDF layout (v1, 3 Nov 2026).
 * Paste this whole block into a <script> tag AFTER the page's main script (just before </body>).
 * How it works: the page's own buildPdf(logo, photo) still decides WHAT goes in the PDF.
 * This wrapper runs it once against a recording copy of jsPDF, reads back the header, part number,
 * sections, label/value rows, bullets and footer it drew, and lays the same content out again as:
 *   header band | full-width part number | left column: large centred photo, intro, check points, notes
 *   | right column: selected options and technical data | footer + disclaimer on every page,
 *   with a light diagonal "SAMPLE" watermark behind the content on every page.
 * Every value is wrapped to its column width (long codes are broken at "-", "/" or by character if needed),
 * and page breaks are made per row, so nothing can run into the footer.
 * If anything unexpected happens it falls back to the page's original PDF, so the download never breaks.
 */
(function(){
  if (typeof buildPdf !== "function" || !window.jspdf || window.__sqDatasheetV1) return;
  window.__sqDatasheetV1 = true;
  const ORIGINAL = buildPdf;
  const WATERMARK = "SAMPLE";          // set to "" to turn the watermark off

  /* ---------- 1. record what the page's own buildPdf draws ---------- */
  function record(logo, photo){
    const J = window.jspdf, rec = [];
    const st = { style:"normal", size:16, color:[0,0,0], cs:0, fill:[0,0,0], page:1 };
    const Fake = function(opts){
      const real = new J.jsPDF(opts);
      const proxy = new Proxy(real, { get(t, p){
        const v = t[p]; if (typeof v !== "function") return v;
        return (...a) => {
          if (p === "setFont"){ if (a[1]) st.style = a[1]; }
          else if (p === "setFontSize") st.size = a[0];
          else if (p === "setTextColor") st.color = a.length === 1 ? a[0] : a.slice(0,3);
          else if (p === "setCharSpace") st.cs = a[0];
          else if (p === "setFillColor") st.fill = a.slice(0,3);
          else if (p === "addPage") st.page = t.getNumberOfPages() + 1;
          else if (p === "setPage") st.page = a[0];
          if (p === "text"){
            const txt = Array.isArray(a[0]) ? a[0].join(" ") : String(a[0]);
            rec.push({ op:"text", t:txt.replace(/\s+/g," ").trim(), x:a[1], y:a[2], align:(a[3] && a[3].align) || "left",
                       bold:/bold/.test(st.style), size:st.size, cs:st.cs, color:JSON.stringify(st.color), page:st.page });
          } else if (p === "rect" && a[2] < 3 && a[3] < 3){
            rec.push({ op:"dot", x:a[0], y:a[1], fill:st.fill.slice(), page:st.page });
          } else if (p === "addImage" && a[0]){
            (rec.imgs = rec.imgs || []).push({ data:a[0], fmt:typeof a[1] === "string" ? a[1] : "JPEG", w:+a[4] || 0, h:+a[5] || 0 });
          } else if (p === "line"){
            rec.push({ op:"line", x1:a[0], y:a[1], x2:a[2], page:st.page });
          }
          const r = v.apply(t, a); return r === t ? proxy : r;
        };
      }});
      return proxy;
    };
    window.jspdf = Object.assign({}, J, { jsPDF: Fake });
    try { ORIGINAL(logo, photo); } finally { window.jspdf = J; }
    return rec;
  }

  /* ---------- 2. turn the drawing back into content ---------- */
  function parse(rec){
    const m = { brandLine:"", title:"", headRight:[], code:[], intro:[], sections:[], disclaimer:"", footer:"" };
    const texts = rec.filter(r => r.op === "text");
    // section rule widths tell whether a section is full width, left or right column
    const ruleW = s => { const l = rec.find(r => r.op === "line" && r.page === s.page && Math.abs(r.y - (s.y + 2.2)) < .6 && Math.abs(r.x1 - s.x) < .6); return l ? l.x2 - l.x1 : 999; };
    let cur = { L:null, R:null }, pendingLabel = null, pendingDot = null, firstSection = false, codeY = null;
    const colOf = x => x > 95 ? "R" : "L";
    const target = x => cur[colOf(x)] || cur.L || cur.R;
    for (let i = 0; i < rec.length; i++){
      const r = rec[i];
      if (r.op === "dot"){ pendingDot = r; continue; }
      if (r.op !== "text" || !r.t) continue;
      if (r.y >= 279){ if (r.y < 285){ if (!m.disclaimer) m.disclaimer = r.t; } else if (!/^\d+\s*\/\s*\d+$/.test(r.t) && !m.footer) m.footer = r.t; continue; }
      if (r.page > 1 && r.y < 20) continue;                          // old continuation header
      if (r.page === 1 && r.y < 31 && !firstSection && codeY === null){
        if (r.align === "right"){ if (m.title) m.headRight.push(r.t); else m.title = r.t; }
        else m.brandLine = m.brandLine || r.t;
        continue;
      }
      if (r.size >= 12 && r.bold && !firstSection){                  // part number, possibly drawn in pieces
        const last = m.code[m.code.length - 1];
        if (last && Math.abs(last.y - r.y) < .5) last.t += r.t; else m.code.push({ t:r.t, y:r.y });
        codeY = r.y; continue;
      }
      if (r.bold && r.cs > 0){                                         // section title
        firstSection = true;
        const w = ruleW(r), s = { title:r.t, rows:[], bullets:[], paras:[] };
        m.sections.push(s);
        if (w > 120){ cur.L = s; cur.R = s; } else cur[colOf(r.x)] = s;
        pendingLabel = null; continue;
      }
      if (!firstSection){ m.intro.push({ t:r.t, size:r.size, bold:r.bold, grey:isGrey(r.color) }); continue; }
      const sec = target(r.x); if (!sec) continue;
      if (pendingDot && Math.abs(r.x - pendingDot.x - 4.5) < 1){
        sec.bullets.push({ t:r.t, warn:pendingDot.fill[0] > 150 && pendingDot.fill[2] < 100 }); pendingDot = null; continue;
      }
      pendingDot = null;
      // small tables drawn as cells on one line (e.g. feature | code | meaning) become one label/value row
      const cells = [r];
      for (let j = i + 1; j < rec.length; j++){
        const q = rec[j]; if (q.op !== "text") break;
        if (q.page !== r.page || Math.abs(q.y - r.y) > .3 || q.x <= cells[cells.length - 1].x || q.x - r.x > 45) break;
        cells.push(q);
      }
      if (cells.length >= 2){
        const vi = cells.findIndex((c, k) => k > 0 && c.bold), v = vi > 0 ? cells[vi] : cells[1];
        const k = cells.filter(c => c !== v).map(c => c.t).join("  ");
        sec.rows.push({ k, v:v.t, spec:true }); i += cells.length - 1; pendingLabel = null; continue;
      }
      if (!r.bold && isGrey(r.color) && r.size <= 7.6){
        const nx = rec.slice(i + 1).find(q => q.op === "text");
        if (nx && nx.bold && Math.abs(nx.x - r.x) < .6 && nx.y > r.y){ pendingLabel = r.t; continue; }
      }
      if (r.bold && pendingLabel !== null){ sec.rows.push({ k:pendingLabel, v:r.t, spec:r.size < 9.2 }); pendingLabel = null; continue; }
      if (r.bold) { sec.rows.push({ k:"", v:r.t, spec:r.size < 9.2 }); continue; }
      sec.paras.push(r.t);
    }
    // an item label drawn on a row of its own with "|" values, e.g. "Surface  |  movement", stays as one row
    if (!m.code.length || !m.sections.length) throw new Error("data sheet layout not recognised");
    m.code = m.code.map(c => c.t);
    return m;
  }

  // mid-grey label colour (the templates use 122,124,128 / 118,124,132 / 118,113,126)
  function isGrey(c){
    let a = Array.isArray(c) ? c.map(Number) : String(c).trim().startsWith("#")
      ? [1,3,5].map(i => parseInt(String(c).trim().slice(i, i + 2), 16)) : String(c).replace(/[\[\]"]/g, "").split(/[ ,]+/).filter(Boolean).map(Number);
    if (a.length < 3 || a.some(isNaN)) return false;
    if (a.every(v => v <= 1)) a = a.map(v => v * 255);
    return a.every(v => v >= 95 && v <= 145) && Math.max(...a) - Math.min(...a) < 25;
  }

  /* ---------- 3. lay it out again ---------- */
  function render(m, photo, imgMax, moveIdx){
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit:"mm", format:"a4" });
    const W = 210, H = 297, M = 16, CW = W - 2*M;
    const LW = 66, GAP = 8, RX = M + LW + GAP, RW = W - M - RX;   // left 66 mm, right 104 mm
    const TOP2 = 24, BOTTOM = 270;                                  // body area on pages 2+ / last body line
    const NAVY = [37,43,51], INK = [51,51,51], GREY = [122,124,128], LINE = [214,218,222], BLUE = [0,114,177], AMBER = [200,120,0], WASH = [246,247,249];

    const font = (b, s, c) => { doc.setFont("helvetica", b ? "bold" : "normal"); doc.setFontSize(s); doc.setTextColor(...(c || INK)); };
    const lh = s => s * 0.3528 * 1.28;                              // line height in mm for a font size in pt
    // wrap that never leaves a word wider than the column: breaks long codes at - / _ . or by character
    function wrap(t, w){
      const out = [];
      String(t || "-").split(/\n/).forEach(par => {
        let line = "";
        par.split(/ +/).forEach(word => {
          const pieces = [];
          if (doc.getTextWidth(word) <= w) pieces.push(word);
          else { let chunk = ""; for (const tok of word.split(/(?<=[-\/_.,;:])/)){
            if (doc.getTextWidth(chunk + tok) <= w) chunk += tok;
            else { if (chunk) pieces.push(chunk); chunk = "";
              for (const ch of tok){ if (doc.getTextWidth(chunk + ch) > w && chunk){ pieces.push(chunk); chunk = ""; } chunk += ch; } } }
            if (chunk) pieces.push(chunk); }
          pieces.forEach((p, idx) => {
            const sep = idx === 0 && line ? " " : "";
            if (doc.getTextWidth(line + sep + p) <= w) line += sep + p;
            else { if (line) out.push(line); line = p; }
          });
        });
        out.push(line);
      });
      return out;
    }
    const hair = (x1, y, x2, c) => { doc.setDrawColor(...(c || LINE)); doc.setLineWidth(.25); doc.line(x1, y, x2, y); };

    function watermark(){
      // very light grey, behind everything: drawn first on every page
      if (!WATERMARK) return;
      doc.setFont("helvetica","bold"); doc.setFontSize(120); doc.setTextColor(238,240,243);
      const word = WATERMARK, w = doc.getTextWidth(word), a = 52 * Math.PI / 180, capH = 120 * 0.3528 * 0.72;
      const cx = W/2, cy = H/2 + 4;
      const x = cx - (w/2) * Math.cos(a) - (capH/2) * Math.sin(a);
      const y = cy + (w/2) * Math.sin(a) - (capH/2) * Math.cos(a) + capH;
      doc.text(word, x, y, { angle:52 });
    }
    const refLine = m.headRight[0] || "";
    function pageFrame(first){
      watermark();
      if (first){
        font(true, 9, GREY); doc.text(m.brandLine || "Unofficial demo by SwiftyQuote", M, 17);
        font(true, 10.5, NAVY); doc.text(m.title || "Product configuration", W - M, 15, { align:"right" });
        font(false, 8, GREY); m.headRight.forEach((t, i) => doc.text(wrap(t, 110)[0], W - M, 20 + i * 4.3, { align:"right" }));
        hair(M, 20 + Math.max(1, m.headRight.length) * 4.3 + .5, W - M);
      } else {
        font(false, 7.5, GREY);
        doc.text(wrap(`${m.brandLine || "Unofficial demo by SwiftyQuote"}  |  ${m.code.join(" ")}`, CW - 60)[0], M, 13);
        doc.text(wrap(refLine, 58)[0], W - M, 13, { align:"right" });
        hair(M, 16, W - M);
      }
    }
    function footers(){
      const n = doc.getNumberOfPages();
      for (let p = 1; p <= n; p++){
        doc.setPage(p);
        if (m.disclaimer){ font(false, 6.8, GREY); const dl = wrap(m.disclaimer, CW); doc.text(dl, M, 279 - (dl.length - 1) * lh(6.8)); }
        hair(M, 283, W - M);
        font(false, 6.8, GREY); doc.text(wrap(m.footer || "Unofficial demo by SwiftyQuote  |  sales@swiftyquote.com", CW - 20)[0], M, 288);
        font(false, 7, GREY); doc.text(`${p} / ${n}`, W - M, 288, { align:"right" });
      }
    }

    pageFrame(true);
    let y = 20 + Math.max(1, m.headRight.length) * 4.3 + 9;

    // full-width part number and its one-line summary
    font(true, 17, NAVY);
    const codeLines = [].concat(...m.code.map(c => wrap(c, CW)));
    doc.text(codeLines, M, y); y += (codeLines.length - 1) * lh(17) + 6;
    const intro = m.intro.slice();
    if (intro.length && !intro[0].bold && intro[0].size >= 9){       // the "Type K | Welded | 20 in" line
      font(false, 9.5, GREY); const l = wrap(intro.shift().t, CW); doc.text(l, M, y); y += l.length * lh(9.5);
    }
    y += 2.5; hair(M, y, W - M); y += 7;
    const colTop = y;

    // column cursors that add pages when needed
    const cols = { L:{ x:M, w:LW, page:1, y:colTop }, R:{ x:RX, w:RW, page:1, y:colTop } };
    function ensure(c, h){
      if (c.y + h <= BOTTOM) return;
      c.page += 1;
      while (doc.getNumberOfPages() < c.page){ doc.addPage(); pageFrame(false); }
      doc.setPage(c.page); c.y = TOP2 + 4;
    }
    const at = c => doc.setPage(c.page);
    function heading(c, t){
      font(true, 7, GREY);
      // letter spacing (.5 mm per character) is not included in getTextWidth, so wrap on a narrower width
      const up = t.toUpperCase(), ratio = doc.getTextWidth(up) / (doc.getTextWidth(up) + .5 * up.length);
      const hl = wrap(up, c.w * ratio - 1);
      ensure(c, 14 + (hl.length - 1) * lh(7)); at(c); font(true, 7, GREY);
      doc.setCharSpace(.5); hl.forEach((line, i) => doc.text(line, c.x, c.y + i * lh(7))); doc.setCharSpace(0);
      c.y += (hl.length - 1) * lh(7); hair(c.x, c.y + 2, c.x + c.w); c.y += 7;
    }
    function para(c, t, o = {}){
      const s = o.size || 8.4; font(!!o.bold, s, o.color || INK);
      const l = wrap(t, c.w - (o.indent || 0));
      l.forEach((line, i) => { ensure(c, lh(s) + .5); at(c); doc.text(line, c.x + (o.indent || 0), c.y); c.y += lh(s); });
      c.y += o.gap == null ? 1.6 : o.gap;
    }
    function bullet(c, t, color){
      font(false, 8.4, INK); const l = wrap(t, c.w - 4.5);
      ensure(c, Math.min(l.length, 2) * lh(8.4) + 1); at(c);
      doc.setFillColor(...color); doc.rect(c.x, c.y - 2.1, 1.4, 1.4, "F");
      l.forEach(line => { ensure(c, lh(8.4)); at(c); font(false, 8.4, INK); doc.text(line, c.x + 4.5, c.y); c.y += lh(8.4); });
      c.y += 1.8;
    }
    // label | value rows; when the label is long the value starts below it
    function row(c, k, v, spec){
      if (c.w < 80){                                                    // narrow (left) column: label above value
        font(false, 7.2, GREY); const kl = k ? wrap(k, c.w) : [];
        font(true, spec ? 8.4 : 9, NAVY); const vl = wrap(v, c.w), vs = spec ? 8.4 : 9;
        ensure(c, kl.length * lh(7.2) + vl.length * lh(vs) + 4); at(c);
        if (kl.length){ font(false, 7.2, GREY); doc.text(kl, c.x, c.y); c.y += kl.length * lh(7.2) + .4; }
        vl.forEach(line => { ensure(c, lh(vs)); at(c); font(true, vs, NAVY); doc.text(line, c.x, c.y); c.y += lh(vs); });
        c.y += 2.6; return;
      }
      const KW = 36, VX = c.x + KW + 3, VW = c.w - KW - 3, s = spec ? 8.4 : 9;
      font(false, 7.6, GREY); const kl = k ? wrap(k, KW) : [];
      font(true, s, NAVY); const vl = wrap(v, VW);
      const last = Math.max((kl.length - 1) * lh(7.6), (vl.length - 1) * lh(s)), h = last + 6.6;
      if (h > BOTTOM - TOP2 - 10){                                      // very long value: let it run across pages
        if (kl.length){ ensure(c, lh(7.6) * kl.length + 4); at(c); font(false, 7.6, GREY); doc.text(kl, c.x, c.y); }
        vl.forEach(line => { ensure(c, lh(s)); at(c); font(true, s, NAVY); doc.text(line, VX, c.y); c.y += lh(s); });
        c.y += 2.2 - lh(s); hair(c.x, c.y, c.x + c.w, [232,234,237]); c.y += 4.4; return;
      }
      ensure(c, h + 1); at(c);
      if (kl.length){ font(false, 7.6, GREY); doc.text(kl, c.x, c.y); }
      font(true, s, NAVY); doc.text(vl, VX, c.y);
      c.y += last + 2.2; hair(c.x, c.y, c.x + c.w, [232,234,237]); c.y += 4.4;
    }

    // LEFT: large photo, centred in a soft panel
    const L = cols.L;
    if (photo){     // photo = the largest image the page's own buildPdf drew (data URL, canvas or image element)
      let iw = photo.w, ih = photo.h; try { const p = doc.getImageProperties(photo.data); if (p.width && p.height){ iw = p.width; ih = p.height; } } catch(e){}
      if (iw && ih){
        const boxW = LW, boxH = Math.min(imgMax || 78, Math.max(30, LW * ih / iw + 12));
        const s = Math.min((boxW - 10) / iw, (boxH - 10) / ih), w = iw * s, h = ih * s;
        doc.setFillColor(...WASH); doc.setDrawColor(...LINE); doc.setLineWidth(.25);
        doc.roundedRect(L.x, L.y - 4, boxW, boxH, 2, 2, "FD");
        doc.addImage(photo.data, photo.fmt, L.x + (boxW - w)/2, L.y - 4 + (boxH - h)/2, w, h, undefined, "FAST");
        L.y += boxH + 3;
      }
    }
    intro.forEach(t => para(L, t.t, { size: t.size < 8 ? 7.2 : 8.4, color: t.grey ? GREY : INK, gap: t.size < 8 ? 3 : 2 }));
    L.y += 2;

    // sections: bullet/notes sections go left, option rows and technical data go right
    const R = cols.R;
    // moveIdx: one option/data section goes to the bottom of the left column (used only when that saves a page)
    const rowSecs = m.sections.filter(s => s.rows.length), moved = moveIdx != null && rowSecs.length > 1 ? rowSecs[moveIdx] : null;
    const order = moved ? m.sections.filter(s => s !== moved).concat([moved]) : m.sections;
    order.forEach(s => {
      if (s === moved){
        heading(L, s.title);
        s.rows.forEach(r => row(L, r.k, r.v, r.spec));
        s.bullets.forEach(b => bullet(L, b.t, b.warn ? AMBER : BLUE));
        s.paras.forEach(p => para(L, p));
        L.y += 3;
      } else if (s.rows.length){
        heading(R, s.title);
        s.rows.forEach(r => row(R, r.k, r.v, r.spec));
        s.bullets.forEach(b => bullet(R, b.t, b.warn ? AMBER : BLUE));
        s.paras.forEach(p => para(R, p));
        R.y += 3;
      } else {
        heading(L, s.title);
        s.bullets.forEach(b => bullet(L, b.t, b.warn ? AMBER : BLUE));
        s.paras.forEach(p => para(L, p, { size:8.6 }));
        L.y += 3;
      }
    });

    footers();
    doc.setPage(doc.getNumberOfPages());
    doc.__sqCols = { L:{ page:L.page, y:L.y }, R:{ page:R.page, y:R.y } };
    return doc;
  }

  buildPdf = function(logo, photo){
    try {
      const rec = record(logo, photo), m = parse(rec);
      const img = (rec.imgs || []).sort((a, b) => b.w * b.h - a.w * a.h)[0] || null;
      let doc = render(m, img, 78);
      const c = doc.__sqCols;
      // if only the left column spills onto an extra page, a smaller photo panel (down to 46 mm) may keep it on one page
      if (img && c.L.page > c.R.page && c.L.page === 2 && c.L.y - 28 < 32){
        const smaller = render(m, img, Math.max(46, 78 - (c.L.y - 28) - 4));
        if (smaller.__sqCols.L.page <= c.R.page) doc = smaller;
      }
      // if the right column spills onto an extra page while the left has room, try moving its last section left
      const pages = d => d.getNumberOfPages();
      if (doc.__sqCols.R.page > doc.__sqCols.L.page){
        const n = m.sections.filter(s => s.rows.length).length;
        for (let k = n - 1; k >= 0 && n > 1; k--){
          const alt = render(m, img, 78, k);
          if (pages(alt) < pages(doc)) doc = alt;
        }
      }
      return doc;
    }
    catch (err){ console.warn("SwiftyQuote data sheet layout: using the original layout", err); return ORIGINAL(logo, photo); }
  };
})();
