#!/usr/bin/perl
# Legal/wording pass over the live demo pages (2026-10-21).
# usage: perl patch.pl <in.html> <out.html> <key>
use strict; use warnings; use utf8;
binmode STDOUT, ':utf8'; binmode STDERR, ':utf8';
my ($in, $out, $key) = @ARGV;

my %C = (
  '4tex-sensor' => { brand=>'4Tex', maker=>'4Tex', legal=>'4Tex GmbH', products=>'FT and FX series',
    ds=>'4Tex FT/FX product information, 4tex.at downloads',
    title=>'Demo configurator for 4Tex FT/FX–style chemical liquid temperature sensors',
    desc=>'FT & FX series PT100 sensors: pick your application, installation, size and options.' },
  'ashcroft-temp-switch' => { brand=>'Ashcroft', maker=>'Ashcroft', legal=>'Ashcroft Inc.', products=>'T4 and T7',
    ds=>'Ashcroft T4/T7 data sheet, Rev I, 10-18-23',
    title=>'Demo configurator for Ashcroft T4/T7–style temperature switches',
    desc=>'NEMA 4X watertight and NEMA 7/9 explosion-proof temperature switches.' },
  'wika-tr10-l' => { brand=>'WIKA', maker=>'WIKA', legal=>'WIKA Alexander Wiegand SE & Co. KG', products=>'TR10-L',
    ds=>'WIKA data sheet TE 60.12',
    title=>'Demo configurator for WIKA TR10-L–style resistance thermometers',
    desc=>'Sensor, housing, signal output and process fitting for the TR10-L.' },
  'dwyeromega-tj36' => { brand=>'DwyerOmega', maker=>'DwyerOmega', legal=>'Dwyer Instruments, LLC (d/b/a DwyerOmega)', products=>'TJ36',
    ds=>'DwyerOmega datasheet TJ36-ICIN',
    title=>'Demo configurator for DwyerOmega TJ36–style transition joint probes',
    desc=>'Rugged thermocouple probes: pick the type, junction, size, sheath, temperature rating, cable and termination.' },
  'midwest-142' => { brand=>'Mid-West Instrument', maker=>'Mid-West Instrument', legal=>'Mid-West Instrument', products=>'Model 142',
    ds=>'Mid-West Instrument Bulletin No. 142/18-rev1',
    title=>'Demo configurator for Mid-West Instrument Model 142–style DP gauges',
    desc=>'Diaphragm differential pressure gauges, switches and 4-20 mA transmitters: range, body, dial, seals, electrical and connections.' },
  'ue-one-series' => { brand=>'United Electric Controls', maker=>'United Electric Controls', legal=>'United Electric Controls Co.', products=>'One Series',
    ds=>'UE bulletin One Series B-14',
    title=>'Demo configurator for United Electric Controls One Series–style transmitter-switches',
    desc=>'Electronic pressure, DP and temperature transmitter-switches: hazardous area, sensor range, power and outputs, switch programming and approvals.' },
  'flowline-echopod' => { brand=>'Flowline', maker=>'Flowline', legal=>'Flowline, Inc.', products=>'EchoPod UG06 and UG12',
    ds=>'Flowline data sheet DS310140 Rev A3',
    title=>'Demo configurator for Flowline EchoPod UG06/UG12–style ultrasonic level transmitters',
    desc=>'Reflective ultrasonic liquid level transmitters: application check, tank dimensions and sensor range, process thread, mounting fittings, setup and 4-20 mA output.' },
  'onicon-f1000' => { brand=>'ONICON', maker=>'ONICON', legal=>'ONICON Incorporated', products=>'F-1000 Series',
    ds=>'ONICON catalog sheet DOC-0003616 Rev. C',
    title=>'Demo configurator for ONICON F-1000–style turbine flow meters',
    desc=>'Insertion and inline turbine flow meters: application and temperature, pipe size and material, single or dual turbine, outputs, wetted materials and calibration data.' },
  'bluewhite-f1000' => { brand=>'Blue-White', maker=>'Blue-White', legal=>'Blue-White Industries, Ltd.', products=>'F-1000',
    ds=>'Blue-White datasheet P.N. 85000-170 rev 9',
    title=>'Demo configurator for Blue-White F-1000–style paddlewheel flow meters',
    desc=>'Digital paddlewheel flow meters: application and liquid, temperature and pressure check, fitting, pipe size and flow range, display, calibration units and O-rings.' },
  'kurz-454ftb' => { brand=>'Kurz', maker=>'Kurz', legal=>'Kurz Instruments, Inc.', products=>'454FTB',
    ds=>'Kurz technical specifications, document 367551M',
    title=>'Demo configurator for Kurz 454FTB–style insertion thermal mass flow meters',
    desc=>'Insertion thermal mass flow meters: application, hazardous area, gas calibration, velocity range, probe, flange, electronics, approvals, outputs and SIL1.' },
  'mcdaniel-series9' => { brand=>'McDaniel Controls', maker=>'McDaniel Controls', legal=>'McDaniel Controls, Inc.', products=>'Series 9 (K9, E9, G9)',
    ds=>'McDaniel Controls data sheet K9E9G91201',
    title=>'Demo configurator for McDaniel Controls Series 9–style stainless steel utility gauges',
    desc=>'All stainless steel utility pressure gauges: medium, vibration, pressure, model and dial size, mounting, connection, range, dial scale, lens and filling options.' },
  'turbines-tmsa' => { brand=>'Turbines, Inc.', maker=>'Turbines, Inc.', legal=>'Turbines, Inc.', products=>'TMSA 3A Series',
    ds=>'Turbines, Inc. TMSA 3A Series data sheet V2',
    title=>'Demo configurator for Turbines, Inc. TMSA 3A–style sanitary turbine flow meters',
    desc=>'Sanitary turbine flow meters and rebuild kits: application, 3A requirement, temperature, flow rate and meter size, end fittings, bearings, pickup coil and display.' },
);
my $c = $C{$key} or die "unknown key $key\n";
my ($brand, $maker, $legal, $prod, $ds) = @$c{qw(brand maker legal products ds)};

open my $fh, '<:utf8', $in or die $!; local $/; my $h = <$fh>; close $fh;
my $n = 0; my @miss;
sub esc { my $s = shift; $s =~ s/&/&amp;/g; $s =~ s/</&lt;/g; $s =~ s/>/&gt;/g; $s =~ s/"/&quot;/g; $s }
sub jsq { my $s = shift; $s =~ s/\\/\\\\/g; $s =~ s/'/\\'/g; $s }
# s///: count, and record a miss when the pattern is required
sub sub_ { my ($label, $req, $re, $code, $g) = @_;
  my $k = $g ? ($h =~ s/$re/$code->()/ge) : ($h =~ s/$re/$code->()/e);
  $k ||= 0; $n += $k; push @miss, $label if $req && !$k; $k }

my $MAKERS = qr/(?:Ashcroft Inc\.|Ashcroft|WIKA|Blue-White|DwyerOmega|Flowline|Kurz|McDaniel Controls|McDaniel|Mid-West Instrument|ONICON|Turbines, Inc\.|United Electric Controls|UE|4Tex GmbH|4Tex)/;
my $E = { maker=>esc($maker), brand=>esc($brand), legal=>esc($legal), prod=>esc($prod), ds=>esc($ds) };

my $footer_line = "Unofficial demo by SwiftyQuote. Not affiliated with, sponsored or endorsed by $E->{maker}. $E->{brand} and product names are trademarks of their owners. Not for ordering: verify all specifications with $E->{maker}. Takedown requests: <a href=\"mailto:sales\@swiftyquote.com\">sales\@swiftyquote.com</a>";
my $req_note = "This request is sent to SwiftyQuote (sales\@swiftyquote.com), not to $E->{maker}. This is a demo; for a real quotation contact $E->{maker} directly.";
my $block = <<"HTML";
<section class="sq-legal" aria-labelledby="sqLegalTitle"><div class="sq-legal__box">
  <h2 id="sqLegalTitle">Independent demonstration – not an official $E->{maker} tool</h2>
  <p>This configurator was built by SwiftyQuote to demonstrate our configurator-building service. SwiftyQuote is not affiliated with, authorised, sponsored or endorsed by $E->{legal} or any of its affiliates or distributors.</p>
  <p>$E->{brand}, $E->{prod} and any other trademarks shown are the property of their respective owners and are used only to identify the products this demo is based on.</p>
  <p>Product information is drawn from publicly available manufacturer documentation ($E->{ds}) and may be incomplete, out of date or wrong. Product photos are shown for demonstration purposes only.</p>
  <p><strong>This demo is not for ordering.</strong> It does not create a quotation, offer or order with $E->{maker} or SwiftyQuote. Any ordering code or specification shown is illustrative only. Always confirm model codes, specifications, approvals and suitability for your application (including any hazardous-area classification) directly with $E->{maker} or its authorised representative before buying.</p>
  <p>Any request you submit through this demo goes to <strong>SwiftyQuote</strong>, not to $E->{maker}. We use your details only to reply to you about SwiftyQuote's services (see our <a href="https://swiftyquote.com/privacy-policy" target="_blank" rel="noopener">Privacy Policy</a>).</p>
  <p>If you are $E->{maker} or another rights holder and would like this demo changed or removed, email <a href="mailto:sales\@swiftyquote.com">sales\@swiftyquote.com</a> and we will act promptly.</p>
</div></section>
HTML
my $css = '<meta name="robots" content="noindex, nofollow">'."\n".'<style>.sq-legal{max-width:1180px;margin:32px auto;padding:0 16px;font:14px/1.65 -apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;color:#374151}.sq-legal__box{border:1px solid #e3e5e8;border-radius:12px;padding:20px 22px;background:#fafafa}.sq-legal h2{font-size:15px;line-height:1.4;margin:0 0 10px;color:#111827}.sq-legal p{margin:0 0 10px}.sq-legal p:last-child{margin:0}.sq-legal a{color:inherit;text-decoration:underline}.sq-req-note{margin:10px 0 0;font-size:.8rem;line-height:1.5;color:#5b6170}.sq-demo-tag{font-size:.85rem;color:#5b6170}.brand__title{display:inline!important}</style>'."\n";

# ---------- head: title, description, noindex ----------
sub_('title', 1, qr{<title>[^<]*</title>}, sub { '<title>'.esc($c->{title}).' | SwiftyQuote</title>' });
sub_('desc', 1, qr{<meta name="description" content="[^"]*">}, sub { '<meta name="description" content="'.esc("Unofficial SwiftyQuote demo based on public $brand data. $c->{desc}").'">' });
sub_('head css', 1, qr{</head>}, sub { $css.'</head>' });

# ---------- full disclaimer block before the footer ----------
sub_('block', 1, qr{\n<footer\b}, sub { "\n".$block."\n<footer" });

# ---------- image alt text (non-empty alts only) ----------
sub_('alt', 0, qr{(<img\b[^>]*?\balt=")[^"]+(")}, sub { $1.'Illustrative product image (demo)'.$2 }, 1);

# ---------- "X confirms" wording ----------
sub_('c1', 0, qr{Confirmed by $MAKERS in the quotation\.}, sub { 'Illustrative only: confirm with the manufacturer.' }, 1);
sub_('c2', 0, qr{; confirmed by $MAKERS in the quotation\.}, sub { '; illustrative only, confirm with the manufacturer.' }, 1);
sub_('c3', 0, qr{([Tt])o be confirmed (?:by|with) $MAKERS(?![A-Za-z])}, sub { $1.'o be confirmed with the manufacturer' }, 1);
sub_('c4', 0, qr{: confirmed by the factory\.}, sub { ': confirm with the manufacturer.' }, 1);
sub_('c5', 0, qr{until $MAKERS confirms it}, sub { 'until it is confirmed with the manufacturer' }, 1);
sub_('c6', 0, qr{so $MAKERS confirms them in the quotation}, sub { 'so confirm them with the manufacturer' }, 1);
sub_('c7', 0, qr{$MAKERS confirms the final ordering code in the quotation}, sub { 'Confirm the final ordering code with the manufacturer' }, 1);
sub_('c8', 0, qr{Vmax will be confirmed by Kurz for your gas\.}, sub { 'Vmax for your gas: confirm with the manufacturer.' }, 1);
sub_('c9', 0, qr{\. $MAKERS will confirm the }, sub { '. Confirm the ' }, 1);
sub_('c10', 0, qr{the maximum calibrated velocity for your gas is set by Kurz\. To be confirmed in the quotation\.}, sub { 'the maximum calibrated velocity for your gas is set by the manufacturer. Confirm with the manufacturer.' }, 1);
sub_('c11', 0, qr{Blue-White will confirm}, sub { 'confirm with the manufacturer' }, 1);
sub_('c12', 0, qr{, and $MAKERS confirms the best option\.}, sub { ', and confirm the best option with the manufacturer.' }, 1);

# ---------- FAQ: no logo any more ----------
sub_('faq1', 0, qr{The product data, photos and logo belong to}, sub { 'The product data and photos belong to' }, 1);
sub_('faq2', 0, qr{colours, fonts and logo\.}, sub { 'colours and fonts.' }, 1);

if ($key eq 'ashcroft-temp-switch') {
  sub_('a header logo', 1, qr{\s*<a href="https://www\.ashcroft\.com/"[^>]*><img[^>]*></a>}, sub { "\n    <span class=\"sq-demo-tag\">Unofficial demo by SwiftyQuote</span>" });
  sub_('a footer contact', 1, qr{<div>\s*<h4>Ashcroft Inc\.</h4>.*?</div>\s*}s, sub { '' });
  sub_('a footer line', 1, qr{<p>All data and photos are the property of Ashcroft Inc\.[^<]*(?:&reg;[^<]*)*</p>}, sub { "<p>$footer_line</p>" });
  sub_('a settings', 1, qr{COMPANY: 'Ashcroft Inc\.',\s*ADDRESS: '[^']*',\s*PHONE: '[^']*',}, sub { "COMPANY: 'SwiftyQuote (unofficial demo)',\n  ADDRESS: 'sales\@swiftyquote.com',\n  PHONE: '',"});
  sub_('a pdf footer', 1, qr{doc\.text\(T\(SETTINGS\.COMPANY\+', '\+SETTINGS\.ADDRESS\+'  \|  '\+SETTINGS\.WEBSITE\+'  \|  '\+SETTINGS\.PHONE\),M,H-10\);}, sub { "doc.text(T('Unofficial demo by SwiftyQuote  |  sales\@swiftyquote.com  |  Not affiliated with ".jsq($maker)."  |  Not for ordering'),M,H-10);" });
  sub_('a pdf logo props', 1, qr{var lp=doc\.getImageProperties\(IMG\.logo\), lw=36, lh=lw\*lp\.height/lp\.width;}, sub { 'var lh=8.5;' });
  sub_('a pdf logo 1', 1, qr{doc\.addImage\(IMG\.logo,'PNG',M,12,lw,lh\);}, sub { "doc.setFont('helvetica','bold'); doc.setFontSize(10); doc.setTextColor(GREY[0],GREY[1],GREY[2]); doc.text('Unofficial demo by SwiftyQuote',M,18);" });
  sub_('a pdf logo 2', 1, qr{doc\.addImage\(IMG\.logo,'PNG',M,8,20,20\*lp\.height/lp\.width\);}, sub { "doc.setFont('helvetica','bold'); doc.setFontSize(8.5); doc.setTextColor(GREY[0],GREY[1],GREY[2]); doc.text('Unofficial demo by SwiftyQuote',M,12);" });
  sub_('a img logo', 1, qr{logo:'data:image/[a-z]+;base64,[^']*'}, sub { "logo:''" });
  sub_('a pdf para', 1, qr{are confirmed by Ashcroft Inc\. in the quotation\. Specifications are subject to change without notice\. Ashcroft and Trust the Shield are trademarks of Ashcroft Inc\. Data and photos: Ashcroft Inc\. \('}, sub { "must be confirmed with the manufacturer. Unofficial SwiftyQuote demo, not for ordering and not affiliated with ".jsq($maker).". Ashcroft, T4, T7 and other trademarks belong to their owners. Source: public manufacturer documentation ('" });
  sub_('a send note', 1, qr{(<div class="btnrow"><button type="submit"[^>]*>Send request</button><button[^>]*>Cancel</button></div>)}, sub { $1."<p class=\"small sq-req-note\">".jsq($req_note)."</p>" });
} elsif ($key eq 'wika-tr10-l') {
  sub_('w header logo', 1, qr{<a class="logo" href="https://www\.wika\.com/[^"]*"[^>]*><svg id="logoSvg".*?</svg></a>}s, sub { '' });
  sub_('w noscript', 1, qr{<noscript><p>[^<]*</p></noscript>}, sub { '<noscript><p>This configurator needs JavaScript. Please enable it to use this demo.</p></noscript>' });
  sub_('w footer contact', 1, qr{<div>\s*<h4>WIKA Instrumentation Pte\. Ltd\.</h4>.*?</div>\s*}s, sub { '' });
  sub_('w footer line', 1, qr{<p style="margin-top:6px">All data and photos are the property of WIKA[^<]*</p>}, sub { "<p style=\"margin-top:6px\">$footer_line</p>" });
  sub_('w settings', 1, qr{COMPANY_NAME: '[^']*',\s*COMPANY_ADDRESS: '[^']*',\s*COMPANY_PHONE: '[^']*',\s*COMPANY_EMAIL: '[^']*',}, sub { "COMPANY_NAME: 'SwiftyQuote (unofficial demo)',\n  COMPANY_ADDRESS: '',\n  COMPANY_PHONE: '',\n  COMPANY_EMAIL: 'sales\@swiftyquote.com'," });
  sub_('w pdf footer', 1, qr{txt\(SETTINGS\.COMPANY_NAME\+'  \|  '\+SETTINGS\.COMPANY_ADDRESS\+'  \|  Tel '\+SETTINGS\.COMPANY_PHONE\+'  \|  '\+SETTINGS\.COMPANY_EMAIL,L,287\);}, sub { "txt('Unofficial demo by SwiftyQuote  |  sales\@swiftyquote.com  |  Not affiliated with ".jsq($maker)."  |  Not for ordering',L,287);" });
  sub_('w pdf logo', 1, qr{if\(logo\) doc\.addImage\(logo,'PNG',L,first\?12:10,first\?30:20,first\?10\.3:6\.8\); else \{ font\('bold',15,BLUE\); txt\('WIKA',L,19\); \}}, sub { "font('bold',first?10:8,BLUE); txt('Unofficial demo by SwiftyQuote',L,first?19:15);" });
  sub_('w pdf logo load', 1, qr{const logo=await logoPng\(\);}, sub { 'const logo=null;' });
  sub_('w pdf disc', 1, qr{Availability of all options and the technical suitability for your process are confirmed by WIKA\. All data and photos are the property of WIKA Alexander Wiegand SE & Co\. KG and were used for demo purposes only\.}, sub { 'Availability of all options and the technical suitability for your process: confirm with the manufacturer. Unofficial SwiftyQuote demo, not for ordering and not affiliated with WIKA. WIKA, TR10-L and other trademarks belong to their owners.' });
  sub_('w lead', 1, qr{We send your whole configuration to WIKA Singapore\.}, sub { 'We send your whole configuration to SwiftyQuote.' });
  sub_('w send note', 1, qr{(<div class="m-actions"><button type="button" class="btn secondary" data-close>Cancel</button><button type="submit" class="btn navy">Send request</button></div>)}, sub { $1."<p class=\"sq-req-note\">".jsq($req_note)."</p>" });
} else {
  # built demos (and 4Tex, same template)
  sub_('header brand', 1, qr{<a class="brand"[^>]*>\s*<img[^>]*>\s*<span class="brand__sep"[^>]*></span>\s*(<span class="brand__title">.*?</span>)\s*</a>}s, sub { "<span class=\"brand\">$1</span>" });
  sub_('header contact', 1, qr{<div class="header__contact">.*?</div>}s, sub { '<div class="header__contact"><span class="sq-demo-tag">Unofficial demo by SwiftyQuote</span></div>' });
  sub_('summary help', 1, qr{<div class="summary__help">.*?</div>}s, sub { '<div class="summary__help">Questions about this demo? Write to <a href="mailto:sales@swiftyquote.com">sales@swiftyquote.com</a>.</div>' });
  sub_('footer address', 1, qr{(<div class="site-footer__in">\s*)<span>[^<]*</span>\s*}, sub { $1 });
  sub_('footer contact', 0, qr{ · <a href="(?:mailto:(?!sales\@swiftyquote)[^"]*|https://www\.4tex\.at/contact[^"]*)"[^>]*>Contact</a>}, sub { '' });
  sub_('footer line', 1, qr{<p>All data and photos are the property of .*?</p>}s, sub { "<p>$footer_line</p>" });
  sub_('send note', 1, qr{(<button class="btn btn--primary btn--lg" type="submit" id="quoteSubmit">.*?</div>)}s, sub { $1."\n        <p class=\"sq-req-note\">$req_note</p>" });
  sub_('pdf logo url', 1, qr{const (LOGO(?:_SVG)?_URL) = "(?:data:[^"]*|__LOGO__)";}, sub { "const $1 = \"\";" });
  sub_('pdf logo load', 1, qr{const logo = await loadImg\(LOGO(?:_SVG)?_URL[^;]*;}, sub { 'const logo = null;' });
  sub_('pdf logo draw', 1, qr{if \(logo\) doc\.addImage\(logo,[^;]*;}, sub { 'small("Unofficial demo by SwiftyQuote", M, 20, { size:9, bold:true });' });
  sub_('pdf newpage head', 1, qr{small\(`[^`|]*?  \|  Product configuration}, sub { 'small(`SwiftyQuote demo  |  Product configuration' });
  sub_('pdf disclaimer', 1, qr{small\("Not a binding offer\.[^"]*"}, sub { 'small("'.jsq("Demo only, not for ordering. Illustrative: confirm all specifications with the manufacturer. Source: $ds.").'"' });
  sub_('pdf address', 1, qr{small\("[^"]*\|[^"]*\|[^"]*@[^"]*", M, 289}, sub { 'small("'.jsq("Unofficial demo by SwiftyQuote  |  sales\@swiftyquote.com  |  Not affiliated with $maker").'", M, 289' });
}

open my $oh, '>:utf8', $out or die $!; print $oh $h; close $oh;
print "$key: $n replacements", (@miss ? "  MISSING: ".join(', ', @miss) : ''), "\n";
