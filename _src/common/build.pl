# usage: perl build.pl <dir> <out> KEY=path ...   (shell.html + app.js in <dir>)
use strict; local $/;
my ($dir, $out, @maps) = @ARGV;
sub slurp { open my $f, '<', shift or die "$!"; binmode $f; my $d = <$f>; close $f; $d }
sub b64 { my $p = shift; my %t = (png=>'image/png', jpg=>'image/jpeg', jpeg=>'image/jpeg'); my ($e) = $p =~ /\.(\w+)$/; my $d = `base64 -i "$p"`; $d =~ s/\s+//g; "data:$t{lc $e};base64,$d" }
my $common = $0; $common =~ s{/[^/]+$}{};
my $html = slurp("$dir/shell.html");
my $app = slurp("$dir/app.js");
$html =~ s{/\*__APP__\*/}{$app};
my $css = slurp("$common/base.css"); my $js = slurp("$common/jspdf.html");
$html =~ s{/\*__BASECSS__\*/}{$css};
$html =~ s{<!--__JSPDF__-->}{$js};
for my $m (@maps){ my ($k, $p) = split /=/, $m, 2; my $d = b64($p); $html =~ s/__${k}__/$d/g; }
# one question at a time: added to every demo before the last </body>
my $oq = slurp("$common/one-question.html");
$html =~ s{</body>(?!.*</body>)}{$oq\n</body>}s or die "no </body>\n";
die "unreplaced: $1\n" if $html =~ /(__(?:IMG_[A-Z0-9]+|LOGO)__)/;
open my $o, '>', $out or die $!; binmode $o; print $o $html; close $o;
print "ok ", length($html), "\n";
