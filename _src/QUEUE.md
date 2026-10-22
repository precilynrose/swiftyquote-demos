# SwiftyQuote demo build queue

Build the first entry with status `todo`, then change it to `done YYYY-MM-DD <slug>` (or `skipped YYYY-MM-DD: reason`).
The order puts instrumentation first (gauges, transmitters, flow, level), then temperature sensors.
Source: ~/Downloads/SwiftyQuote-product-links.xlsx (sheet "Product links"); the links below are copied from it.
Rows 13-23, 24 and 33 were added on 2026-10-21 after re-screening the 79 spreadsheet rows that were not queued (see "Re-screen 2026-10-21" below). Within each block they are ordered by score.

| # | Status | Company | Product | Product page | Datasheet (ordering page) |
|---|---|---|---|---|---|
| 1 | done 2026-10-19 midwest-142-configurator | Mid-West Instrument | Model 142 diaphragm DP gauge/switch | https://midwestinstrument.com/product/model-142/ | https://midwestinstrument.com/wp-content/uploads/2018/10/Bulletin_142.pdf (p4) |
| 2 | done 2026-10-19 ue-one-series-configurator | United Electric Controls | One Series electronic switch/transmitter | https://www.ueonline.com/all-products/one-series-electronic-switch-and-transmitter/ | https://www.ueonline.com/bulletins/oneseries-b.pdf (pp8-10) |
| 3 | done 2026-10-19 flowline-echopod-configurator | Flowline, Inc. | EchoPod UG06/UG12 ultrasonic level transmitter | https://www.flowline.com/product/echopod-ug06-ug12-reflective-ultrasonic-liquid-level-transmitter/ | https://www.flowline.com/wp-content/uploads/EchoPod_UG06_UG12_Data_Sheet.pdf (p2) |
| 4 | done 2026-10-19 onicon-f1000-configurator | ONICON Incorporated | F-1000 series insertion turbine flow meters | (none captured) | https://www.onicon.com/wp-content/uploads/f-1000-series-turbine-flow-meter-catalog-sheet-doc-0003616.pdf (p7); ordering guide https://www.onicon.com/wp-content/uploads/0266-6-Ordering-Guide-07-18.pdf (p1) |
| 5 | done 2026-10-20 bluewhite-f1000-configurator | Blue-White Industries | F-1000 paddlewheel flowmeter | (none captured) | https://www.blue-white.com/?wpdmdl=79289 (p4, ordering from p3) |
| 6 | done 2026-10-20 kurz-454ftb-configurator | Kurz Instruments | 454FTB insertion thermal mass flow meter | (none captured) | https://www.kurzinstruments.com/downloads/454ftb/Kurz-Model-454FTB-Technical-Specifications.pdf (p6) |
| 7 | done 2026-10-21 turbines-tmsa-configurator | Turbines, Inc. | TMSA 3A sanitary turbine flow meter | (none captured) | https://www.turbinesincorporated.com/wp-content/uploads/TMSA-Data-Sheet-1.pdf (p2) |
| 8 | done 2026-10-21 mcdaniel-series9-configurator | McDaniel Controls | Series 9 stainless utility gauge | (none captured) | https://www.mcdanielcontrols.com/pdf_files/k91201.pdf (p2) |
| 9 | done 2026-10-22 max-p213-configurator | Max Machinery | P213 piston flow meter | https://www.maxmachinery.com/product-category/piston-flow-meters/ | The queued P213-Pulse.pdf is only a sample calibration certificate; built from https://www.maxmachinery.com/wp-content/uploads/2022/07/PSeries-PartNumber-Selector-3000PSI-Rev2018A.pdf (part number matrix, also p6 of the P213F/P213A spec sheets REV2022) |
| 10 | todo | Absolute Process Instruments | API 4390 DIN isolated transmitter | (none captured) | https://api-usa.com/pdf/old/api4390-4391-4392.pdf (p1; file is in an /old/ folder) |
| 11 | todo | Fox Thermal | FT4X thermal gas mass flow meter | https://www.foxthermal.com/products/ft4x.php | https://www.foxthermal.com/products/pdf/ft4x/ft4x-datasheet.pdf (p6; full codes in a separate model-codes document) |
| 12 | todo | Dimens (RST Elektronik) | Ultrasonic level sensors | https://www.dimens.com.tr/product-details/digital-pressure-switch/ | https://www.dimens.com.tr/wp-content/uploads/2026/04/mini-catalogue-dimens-EN.pdf (p17, more on p19) |
| 13 | todo (score 10) | JOGLER, LLC | JMG magnetic level gauge & JXC external chamber | https://jogler.com/product/magnetic-level-gauge/ | https://jogler.com/wp-content/uploads/2025/09/JMGMagneticLevelGaugeandJXCExternalChamberConfigurationGuide_Rev.B07.2018.pdf ("How to order" + Model Number Guide from p3; 16 pages, official copy now on jogler.com) |
| 14 | todo (score 8) | NOSHOK, Inc. | 1100 Series diaphragm DP gauge (with switch / 4-20 mA options) | https://www.noshok.com/ | https://www.noshok.com/images/gauges/differential/1100_series_diaphragm_type/1100_Series_Differential_Gauge_Ordering_Info.pdf (p1, full code table with combination footnotes; needs a full Chrome user agent). Alternative: PT40 on-page ordering table |
| 15 | todo (score 8) | Moore Industries-International | STZ functional-safety dual-input HART temperature transmitter | https://www.miinet.com/ | https://www.miinet.com/images/pdf/datasheets/STZ_Datasheet_Moore_Industries.pdf (p12 "Ordering Information": Unit / Input / Output / Power / Options / Housing; input ranges in Table 1; 20 pages, use pdftool) |
| 16 | todo (score 7) | Hoffer Flow Controls | HO Teflon Series turbine flowmeter | https://www.hofferflow.com/ | https://hofferflow.com/wp-content/uploads/applications/teflonDS.pdf (p2 "Ordering Information" A-J; size chart p1; needs a full Chrome user agent) |
| 17 | todo (score 7) | Trafag AG (via Accutech Middle East) | NAT 8252 industrial pressure transmitter | https://www.trafag.com/H72303 | https://media.trafag.com/datasheet/H72303al_EN_8252_NAT_Industrial_Pressure_Transmitter.pdf (type code 8252 XX XX XX XX XX XX, rev H72303al 05/2026) |
| 18 | todo (score 7) | Electro-Sensors, Inc. | Series 18 shaft speed sensor | https://www.electro-sensors.com/products/shaft-speed-sensors/series-18 | "Building a Model Number" on the product page (e.g. 18BHSNO-010); Series 18 data sheet linked there |
| 19 | todo (score 7, provisional) | Monitor Technologies, LLC | KA/KAX rotary paddle bin level switch | https://www.monitortech.com/product_p_rotary.shtml | Bulletin 213 (KA & KAX): check its ordering table first. Part numbers are catalogue numbers (1-83xx-x), so skip if there is no code structure |
| 20 | todo (score 6) | Thermal Instrument Company | Model 62-9MP (9500) insertion thermal mass flow meter | https://thermalinstrument.com/products/insertion-thermal-mass-flow-meters/model-62-9mp/specifications | "Model numbering system" on the specifications page (electronics mounting, fluid, material, process connection, power) |
| 21 | todo (score 6) | Proteus Industries Inc. | 100 Series flow switch | https://www.proteusind.com/product/100-series-flow-switch/ | https://www.proteusind.com/wp-content/uploads/2016/05/100DS.pdf (model number by flow range x body material, p2; 3 pages) |
| 22 | todo (score 6) | King Instrument Company | 7200 Series acrylic tube flowmeter | https://kinginstrumentco.com/7200-series-acrylic-tube-flowmeter/ | "Ordering" guide on the product page (e.g. 7205-0281-3-1-W); small option set |
| 23 | todo (score 5) | Orange Research | 1201 PG/PGS DP piston gauge | https://orangeresearch.com/products/1201-pg-pgs/ | "How to order" on the product page (e.g. 1201PGS-1A-2.5B-A). Note: their site already has a basic part-number builder |
| 24 | todo (score 7) | Tel-Tru Manufacturing Co. | Sanitary bimetal thermometers (SGT/SBC/SAA) | https://www.teltru.com/ | https://www.teltru.com/wp-content/uploads/SBTSHT804a-3.26.pdf ("How to order", model / stem / range / Tri-Clamp fitting; 2 pages) |
| 25 | todo | Thermometrics Corporation | RTD immersion probes | https://thermometricscorp.com/rtd-immersion-probe.html | https://thermometricscorp.com/PDFs/catalogue.pdf (p5) |
| 26 | todo | H O Trerice | B8 rear-connect bimetal thermometer | (none captured) | https://trerice.com/pdfs/2016/Temperature/BimetalRearConnect_132_133.pdf (p1) |
| 27 | todo | Palmer Wahl Instruments | 3AA/2AA all-angle industrial thermometers | (none captured) | https://cdn-documents.yodify.com/documents/Palmer-Wahl/2AA-3AA-All-Angle-Thermometers/egmne/2cd981db-0f14-4a31-959b-91478f0c0148/All_Angle_3AA_2AA.pdf (p1) |
| 28 | todo | Durex Industries | RTD with probe & plug | https://www.durexindustries.com/temperature-sensors/resistance-temperature-detectors/general-purpose-rtds/rtd-with-probe-plug | https://www.durexindustries.com/documents/pages/Temperature-Sensors-Catalog-1-28-2015.pdf (p8) |
| 29 | todo | Globe United FZE | Thermowells (FTW01/FTW02) | https://globeunitedae.com/ | https://globeunitedae.com/wp-content/uploads/2024/07/Thermowell-Catalog.pdf (p3, p5) |
| 30 | todo | ELIMKO | Straight thermocouples | (none captured) | https://elimko.com.tr/files/D%C3%BCzTipTermokupllar.pdf (p2) |
| 31 | todo | System Dynamics Pte Ltd | TSD96 thermocouple assembly | https://www.sydynamics.com/products | https://www.sydynamics.com/_files/ugd/16ec04_b3952ec2760e49aaaff6fc331b2fd09f.pdf (p1) |
| 32 | todo | Dpstar Group (Maltec-T) | Maltec-T MI thermocouples | https://dpstar.com.my/product/industrial-thermocouple-maltec-t-ta-1001/ | https://dpstar.com.my/wp-content/uploads/2020/07/Maltec-T-Thermocouple_DpstarGroup.pdf (pp4-5) |
| 33 | todo (score 5) | Nanmac Corporation | Exposed-ribbon surface thermocouples | https://www.nanmac.com/product-specification/exposed-ribbon-thermocouples-for-surface-measurement | Part number format on the spec page (e.g. B2-3-J-20, suffix IT); small option set |

Not queued: rows marked EXCLUDED (SOR, Dynisco, FTI, Universal Flow Monitors), distributors and reps, rows with no ordering data, third-party-hosted datasheets, and image-only PDFs.

## Re-screen 2026-10-21

The 79 spreadsheet rows not in the original queue were checked again with a full Chrome user agent (which got past the earlier bot challenges) and pdf.js for long PDFs.

Score (max 10) = ordering-code clarity (1-3) + option depth (1-3) + fills a gap on the demo page (0-2: level, functional safety) + pitch fit (0-2: independent maker without its own online configurator = 2, large maker or partial tool = 1, already has a part-number builder = 0).

Qualified: 13 (rows 13-24 and 33 above).

Screened out, with reasons:
- No ordering code in the official datasheet or page: GP:50 (code only in an install manual), Taber Industries (aerospace data sheets, no code), Marlin Manufacturing (no code on page), Conax, Kulite (application form only), Validyne and Stellar Technology (no product-level codes found), Marsh Bellofram (ordering only through their website), Cleveland Electric Labs.
- Image-only or unreadable: ATL Products (code page is a script-loaded image), Ordel (catalogue PDF broken, OT01 image-only), Terkor (image-only PDF), Bass Instruments, Taber 2911.
- Blocked or unreachable: Babbitt International and Temp-Pro (HTTP 403), Ensim Sensors (no response), McMillan (only a third-party PDF, official site has no product pages).
- Acez Sensing: no code on the product page any more, and you already have an "Acez Sensing Product Configurator" Lovable project, so it is likely a client.
- Owned by a group we exclude: Magnetrol (AMETEK; resold by PT Multitek), SOR (resold by Ronsor and TECS).
- Brands with their own online configurators: JUMO (Seven Star), Baumer/Siemens (Flowmaster), KROHNE (PRO-QUIP).
- Distributors whose brands are already built: Ashcroft (Stellite, AARICO), WIKA (Haris), Mid-West (Flotech, Caltrols), ONICON (ALMI).
- No official datasheets found for the resold brand: SmartMeasurement (Totalmas), BAMO (ISME), AFRISO (EMS).
- No product data captured at all (distributors, reps or makers without online documents): Lesman, TALON, Process Solutions, Cross Company, Tech-Quip, Huynh Bang, Thermotron-CE, GIIC, PLIC Thermo, WR&W, Instrumac, Instrumentations Inc., HTH, PT Tolinco, PT Hade Permata, VATCOM, PNR, P.T. Cerna, Unijin, KLEEV, AMI Elite, PTE Sensor, Alex Electronics, Contec Egypt, Pakkens, QIE, Thermotec Egypt, KEFAC, Smartech.
