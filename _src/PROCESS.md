# How to build one SwiftyQuote configurator demo

Reference demo: ~/SwiftyQuote-demos/_src/ue1 (shell.html + app.js + img/), live at https://demo.swiftyquote.com/ue-one-series-configurator/.
Match that structure, style, tone and level of detail exactly.

## Environment facts (macOS, this Mac)
- The shell cannot read ~/Downloads, ~/Desktop or ~/Documents (macOS privacy). Work in ~/SwiftyQuote-demos and the session scratchpad.
- There is no python, node or git (Xcode tools missing). Use perl, ruby, curl, sips, base64 and `gh` (logged in as precilynrose, repo scope).
- In zsh never name a variable `path` (it overwrites PATH).
- The Read tool reads PDFs of 10 pages or fewer directly. For longer PDFs, or when page rendering is needed, use the pdf.js tool:
  1. Copy `_src/tools/pdftool.html` and the PDF into one work folder.
  2. Run `ruby _src/tools/sink.rb <workfolder> <outfolder>` in the background (port 8766).
  3. In the browser pane, open http://127.0.0.1:8766/pdftool.html and run `await run('/file.pdf','prefix',[pages],2)`. It saves `prefix.txt` (all text) and `prefix-pN.png` renders to the out folder. Read the PNGs to see the tables.
- Fetch with `curl -sL -A "Mozilla/5.0"`. If a site blocks the request (bot challenge), mark the row skipped and move to the next one.

## Steps
1. Read `_src/QUEUE.md` and take the first `todo` row.
2. Download the datasheet and product page. Read the ordering-code page(s) and the spec pages. Get the real ordering code structure, every option, and every combination rule and limit. Never invent codes: anything uncertain goes in a "to be confirmed" note.
3. Gather brand assets from the manufacturer's site: logo (dark version for white background; crop it from a high-res PDF render if needed), 1–3 clean product photos (convert big PNGs to JPEG at about 420 px with `sips -s format jpeg -Z 420`), brand colours, phone, email and address.
4. Create `_src/<shortname>/shell.html` and `app.js` by copying ue1 and rewriting the product-specific parts:
   - brand tokens in :root, header, hero, footer, contact details and the trademark line
   - SETTINGS.QUOTE_EMAIL = the manufacturer's sales email (QUOTE_CC stays sales@swiftyquote.com, TRACKING_TAG "swiftyquote.com")
   - the DEMO_FAQ texts with the brand name swapped (same questions)
   - 5–6 buyer-friendly steps in plain language (application first, then the main choices, extras, review), with greyed-out options and a reason when a rule forbids them
   - live summary, part number built from the ordering code, warnings and info notes, PDF (jsPDF) and mailto quotation, ref prefix from the brand initials
   - `window.__cfg` test hooks
5. Build: `perl _src/common/build.pl _src/<shortname> ~/SwiftyQuote-demos/<slug>/index.html LOGO=... IMG_X=...` (placeholders `__LOGO__`, `__IMG_X__`, `/*__BASECSS__*/`, `<!--__JSPDF__-->`, `/*__APP__*/`). Slug pattern: `<brand>-<product>-configurator`.
6. Test: serve ~/SwiftyQuote-demos with `ruby -run -e httpd . -p 8765 -b 127.0.0.1` (background) and open http://127.0.0.1:8765/<slug>/ in the browser pane.
   - No console errors.
   - Walk 3–4 scenarios through `__cfg`, including the standard configuration and a few forbidden combinations. Check the part numbers against the datasheet example.
   - `buildPdf()` must not throw. Visually check one PDF: build it in the page, POST it to http://127.0.0.1:8766/save/x.pdf with Content-Type text/plain, then Read it.
   - Check phone width (375 px): no horizontal scroll.
   - Fix anything wrong, rebuild and retest.
7. Add a card to ~/SwiftyQuote-demos/index.html, after the last `<a class="item">`, in the same format: name, one-line description listing the configurable choices, and the site domain in lowercase.
8. Publish to GitHub (precilynrose/swiftyquote-demos, branch main; GitHub Pages serves demo.swiftyquote.com) through the contents API:
   - PUT `<slug>/index.html` (new file, no sha).
   - Fetch the current sha of `index.html`, then PUT the updated index.
   - Build the JSON body as `{"message":..., "branch":"main", "content":"<base64>"[, "sha":...]}` with `base64 -i file | tr -d '\n'`, and send it with `gh api -X PUT repos/precilynrose/swiftyquote-demos/contents/<file> --input body.json`.
   - End commit messages with: `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`
   - Wait for `gh api repos/precilynrose/swiftyquote-demos/pages/builds/latest` to report `built`, then check the live URL returns 200.
9. Copy the sources (shell.html, app.js, img/) into `_src/<shortname>/`. Update QUEUE.md (`done YYYY-MM-DD <slug>`), and add the demo to the "Done" line in the memory file /Users/tablan/.claude/projects/-Users-tablan-Downloads/memory/swiftyquote-demo-build.md.
10. Card image for the user's demo page: in the browser pane set the viewport to 1280x800 (resize_window width 1280, height 800) and open the LIVE URL. Run `document.querySelector('.sq-back')?.remove(); window.scrollTo(0,0)`, then take a full screenshot. The tool output names the saved .jpg (".../tool-results/mcp-Claude_Browser-blob-....jpg"): copy it to ~/SwiftyQuote-demos/_thumbs/<slug>.jpg, then reset the viewport (preset desktop). Send the image with SendUserFile (status "proactive", display "attach") if that tool is available.
11. Final message, exactly this format and nothing else:

**<Card name>**
- Link: https://demo.swiftyquote.com/<slug>/
- Description: <card description>
- Site: <DOMAIN IN CAPITALS>
- Image: ~/SwiftyQuote-demos/_thumbs/<slug>.jpg

If the row had to be skipped (blocked site, no usable ordering data), mark it skipped with the reason and build the next `todo` row in the same run. Only one demo is published per run. If nothing is left in the queue, say so.
