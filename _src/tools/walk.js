(async () => {
  const wait = ms => new Promise(r => setTimeout(r, ms)); const trail = []; let stuck = 0, lastSig = "";
  const C = Object.assign({ container:"#stage", next:"#btnNext" }, window.OQ_CONFIG || {});
  const errs = []; window.addEventListener("error", e => errs.push(e.message));
  const titleTxt = () => ((document.querySelector("#stepTitle") || {}).textContent || "").trim().slice(0, 26);
  for (let it = 0; it < 160; it++){
    const bl = __oq.blocks(); const cur = bl ? bl[__oq.Q] : [document.querySelector(C.container)];
    const sig = titleTxt() + "|" + (bl ? __oq.Q + "/" + bl.length : "-");
    if (sig !== lastSig){ trail.push(sig); lastSig = sig; stuck = 0; } else stuck++;
    if (stuck > 5) break;
    let acted = false;
    const els = cur.flatMap(e => [...e.querySelectorAll("input,select")]).filter(i => i.offsetParent !== null);
    const names = [...new Set(els.filter(i => i.type === "radio").map(i => i.name))];
    for (const n of names){
      const g = els.filter(i => i.name === n);
      if (!g.some(i => i.checked)){
        const pick = g.find(i => !i.disabled && !/other|unk|tbc|custom|sure|none_?known/i.test(i.value)) || g.find(i => !i.disabled);
        if (pick){ pick.click(); acted = true; await wait(60); }
      }
    }
    for (const s of els.filter(i => i.tagName === "SELECT" && !i.value)){ const o = [...s.options].find(o => o.value); if (o){ s.value = o.value; s.dispatchEvent(new Event("change", { bubbles:true })); acted = true; } }
    const fill = (list, asc) => list.forEach((i, k) => { i.value = String(asc ? 2 + k : Math.max(2, 4 - k)); i.dispatchEvent(new Event("input", { bubbles:true })); });
    const typed = els.filter(i => (i.type === "text" || i.type === "number") && !i.value && !i.disabled);
    if (typed.length){ const asc0 = /min|low/i.test(typed[0].id + typed[0].name + ((typed[0].closest("label,.field") || {}).textContent || "")); fill(typed, asc0); acted = true; await wait(250); if (typed.some(i => i.getAttribute("aria-invalid") === "true")) fill(typed, true); }
    await wait(acted ? 700 : 60);
    const b2 = __oq.blocks(); const sig2 = titleTxt() + "|" + (b2 ? __oq.Q + "/" + b2.length : "-");
    if (sig2 === sig){ const n = document.querySelector(C.next); if (n && !n.disabled && n.offsetParent !== null){ n.click(); await wait(450); } }
  }
  /* back navigation check: from the end, press Back twice */
  const back = () => { const b = document.getElementById("oqBack") || document.querySelector(C.back || "#btnBack"); if (b && !b.disabled) b.click(); };
  const end = titleTxt(); back(); await wait(300); const b1 = titleTxt() + "|" + (__oq.blocks() ? __oq.Q : "-"); back(); await wait(300); const b2 = titleTxt() + "|" + (__oq.blocks() ? __oq.Q : "-");
  return JSON.stringify({ trail, final:end, back:[b1, b2], errs });
})()
