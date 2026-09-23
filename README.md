# SwiftyQuote demos

Landing page and deploy target for [demo.swiftyquote.com](https://demo.swiftyquote.com) —
a hub linking to each buyer-friendly product configurator demo.

Each subfolder is a snapshot of that demo's self-contained `index.html`, deployed here so
it's reachable at `demo.swiftyquote.com/<name>/`. The editable source for each demo lives
in its own repository:

| Demo | Live path | Source repo |
|---|---|---|
| 4Tex Chemical Liquid Temperature Sensors | [`/4tex-sensor-configurator/`](https://demo.swiftyquote.com/4tex-sensor-configurator/) | [4tex-sensor-configurator](https://github.com/precilynrose/4tex-sensor-configurator) |
| Ashcroft T4/T7 Temperature Switches | [`/ashcroft-temp-switch-configurator/`](https://demo.swiftyquote.com/ashcroft-temp-switch-configurator/) | [ashcroft-temp-switch-configurator](https://github.com/precilynrose/ashcroft-temp-switch-configurator) |
| WIKA TR10-L Resistance Thermometer | [`/wika-tr10-l-configurator/`](https://demo.swiftyquote.com/wika-tr10-l-configurator/) | [wika-tr10-l-configurator](https://github.com/precilynrose/wika-tr10-l-configurator) |

## Adding a new demo

1. Build and test the demo in its own repo as usual.
2. Copy its finished, self-contained `index.html` into a new folder here, named after the repo.
3. Add a row to the table above and a card to `index.html`'s landing list.
4. Commit and push — GitHub Pages redeploys `demo.swiftyquote.com` automatically.

## Ownership

All product data, photos and logos in each demo belong to the respective manufacturer and
are used for demonstration purposes only. These are unofficial, third-party demos, not the
manufacturers' own tools.
