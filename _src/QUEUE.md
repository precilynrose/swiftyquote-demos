# SwiftyQuote demo build queue

Build the first entry with status `todo`, then change it to `done YYYY-MM-DD <slug>` (or `skipped YYYY-MM-DD: reason`).
The order puts instrumentation first (gauges, transmitters, flow, level), then temperature sensors.
Source: ~/Downloads/SwiftyQuote-product-links.xlsx (sheet "Product links"); the links below are copied from it.

| # | Status | Company | Product | Product page | Datasheet (ordering page) |
|---|---|---|---|---|---|
| 1 | done 2026-10-19 midwest-142-configurator | Mid-West Instrument | Model 142 diaphragm DP gauge/switch | https://midwestinstrument.com/product/model-142/ | https://midwestinstrument.com/wp-content/uploads/2018/10/Bulletin_142.pdf (p4) |
| 2 | done 2026-10-19 ue-one-series-configurator | United Electric Controls | One Series electronic switch/transmitter | https://www.ueonline.com/all-products/one-series-electronic-switch-and-transmitter/ | https://www.ueonline.com/bulletins/oneseries-b.pdf (pp8-10) |
| 3 | done 2026-10-19 flowline-echopod-configurator | Flowline, Inc. | EchoPod UG06/UG12 ultrasonic level transmitter | https://www.flowline.com/product/echopod-ug06-ug12-reflective-ultrasonic-liquid-level-transmitter/ | https://www.flowline.com/wp-content/uploads/EchoPod_UG06_UG12_Data_Sheet.pdf (p2) |
| 4 | done 2026-10-19 onicon-f1000-configurator | ONICON Incorporated | F-1000 series insertion turbine flow meters | (none captured) | https://www.onicon.com/wp-content/uploads/f-1000-series-turbine-flow-meter-catalog-sheet-doc-0003616.pdf (p7); ordering guide https://www.onicon.com/wp-content/uploads/0266-6-Ordering-Guide-07-18.pdf (p1) |
| 5 | done 2026-10-20 bluewhite-f1000-configurator | Blue-White Industries | F-1000 paddlewheel flowmeter | (none captured) | https://www.blue-white.com/?wpdmdl=79289 (p4, ordering from p3) |
| 6 | done 2026-10-20 kurz-454ftb-configurator | Kurz Instruments | 454FTB insertion thermal mass flow meter | (none captured) | https://www.kurzinstruments.com/downloads/454ftb/Kurz-Model-454FTB-Technical-Specifications.pdf (p6) |
| 7 | todo | Turbines, Inc. | TMSA 3A sanitary turbine flow meter | (none captured) | https://www.turbinesincorporated.com/wp-content/uploads/TMSA-Data-Sheet-1.pdf (p2) |
| 8 | todo | McDaniel Controls | Series 9 stainless utility gauge | (none captured) | https://www.mcdanielcontrols.com/pdf_files/k91201.pdf (p2) |
| 9 | todo | Max Machinery | P213 piston flow meter | https://www.maxmachinery.com/product-category/piston-flow-meters/ | https://www.maxmachinery.com/wp-content/uploads/2018/08/P213-Pulse.pdf (p1) |
| 10 | todo | Absolute Process Instruments | API 4390 DIN isolated transmitter | (none captured) | https://api-usa.com/pdf/old/api4390-4391-4392.pdf (p1; file is in an /old/ folder) |
| 11 | todo | Fox Thermal | FT4X thermal gas mass flow meter | https://www.foxthermal.com/products/ft4x.php | https://www.foxthermal.com/products/pdf/ft4x/ft4x-datasheet.pdf (p6; full codes in a separate model-codes document) |
| 12 | todo | Dimens (RST Elektronik) | Ultrasonic level sensors | https://www.dimens.com.tr/product-details/digital-pressure-switch/ | https://www.dimens.com.tr/wp-content/uploads/2026/04/mini-catalogue-dimens-EN.pdf (p17, more on p19) |
| 13 | todo | Thermometrics Corporation | RTD immersion probes | https://thermometricscorp.com/rtd-immersion-probe.html | https://thermometricscorp.com/PDFs/catalogue.pdf (p5) |
| 14 | todo | H O Trerice | B8 rear-connect bimetal thermometer | (none captured) | https://trerice.com/pdfs/2016/Temperature/BimetalRearConnect_132_133.pdf (p1) |
| 15 | todo | Palmer Wahl Instruments | 3AA/2AA all-angle industrial thermometers | (none captured) | https://cdn-documents.yodify.com/documents/Palmer-Wahl/2AA-3AA-All-Angle-Thermometers/egmne/2cd981db-0f14-4a31-959b-91478f0c0148/All_Angle_3AA_2AA.pdf (p1) |
| 16 | todo | Durex Industries | RTD with probe & plug | https://www.durexindustries.com/temperature-sensors/resistance-temperature-detectors/general-purpose-rtds/rtd-with-probe-plug | https://www.durexindustries.com/documents/pages/Temperature-Sensors-Catalog-1-28-2015.pdf (p8) |
| 17 | todo | Globe United FZE | Thermowells (FTW01/FTW02) | https://globeunitedae.com/ | https://globeunitedae.com/wp-content/uploads/2024/07/Thermowell-Catalog.pdf (p3, p5) |
| 18 | todo | ELIMKO | Straight thermocouples | (none captured) | https://elimko.com.tr/files/D%C3%BCzTipTermokupllar.pdf (p2) |
| 19 | todo | System Dynamics Pte Ltd | TSD96 thermocouple assembly | https://www.sydynamics.com/products | https://www.sydynamics.com/_files/ugd/16ec04_b3952ec2760e49aaaff6fc331b2fd09f.pdf (p1) |
| 20 | todo | Dpstar Group (Maltec-T) | Maltec-T MI thermocouples | https://dpstar.com.my/product/industrial-thermocouple-maltec-t-ta-1001/ | https://dpstar.com.my/wp-content/uploads/2020/07/Maltec-T-Thermocouple_DpstarGroup.pdf (pp4-5) |

Not queued: rows marked EXCLUDED (SOR, Dynisco, FTI, Universal Flow Monitors), distributors and reps, rows with no ordering data, third-party-hosted datasheets, and image-only PDFs.
