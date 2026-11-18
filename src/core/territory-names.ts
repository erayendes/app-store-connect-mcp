/**
 * Territory code → country name. Data only.
 *
 * Apple does not return a name anywhere: `/v1/territories` carries the code and
 * the currency and nothing else, and price rows carry only the code. So an agent
 * asked for a per-country price table writes this dictionary itself — a live
 * eval session did exactly that, 175 entries hand-typed inside a shelled-out
 * python3, and did it again on the run after the macro was widened to all
 * territories. Shipping the table is what stops that.
 *
 * ISO-3166 alpha-3 English short names, for the 175 territories Apple's own
 * list returns. `XKS` is Apple's code for Kosovo, which has no ISO alpha-3.
 *
 * ponytail: static. A territory Apple adds later resolves to null rather than a
 * wrong name — regenerate from `/v1/territories` if that ever shows up.
 */
export const TERRITORY_NAMES: Record<string, string> = {
  AFG: 'Afghanistan', AGO: 'Angola', AIA: 'Anguilla', ALB: 'Albania',
  ARE: 'United Arab Emirates', ARG: 'Argentina', ARM: 'Armenia',
  ATG: 'Antigua and Barbuda', AUS: 'Australia', AUT: 'Austria',
  AZE: 'Azerbaijan', BEL: 'Belgium', BEN: 'Benin', BFA: 'Burkina Faso',
  BGR: 'Bulgaria', BHR: 'Bahrain', BHS: 'Bahamas',
  BIH: 'Bosnia and Herzegovina', BLR: 'Belarus', BLZ: 'Belize',
  BMU: 'Bermuda', BOL: 'Bolivia', BRA: 'Brazil', BRB: 'Barbados',
  BRN: 'Brunei', BTN: 'Bhutan', BWA: 'Botswana', CAN: 'Canada',
  CHE: 'Switzerland', CHL: 'Chile', CHN: 'China mainland',
  CIV: 'Côte d’Ivoire', CMR: 'Cameroon',
  COD: 'Congo, Democratic Republic of the', COG: 'Congo, Republic of the',
  COL: 'Colombia', CPV: 'Cabo Verde', CRI: 'Costa Rica',
  CYM: 'Cayman Islands', CYP: 'Cyprus', CZE: 'Czechia', DEU: 'Germany',
  DMA: 'Dominica', DNK: 'Denmark', DOM: 'Dominican Republic',
  DZA: 'Algeria', ECU: 'Ecuador', EGY: 'Egypt', ESP: 'Spain',
  EST: 'Estonia', FIN: 'Finland', FJI: 'Fiji', FRA: 'France',
  FSM: 'Micronesia', GAB: 'Gabon', GBR: 'United Kingdom', GEO: 'Georgia',
  GHA: 'Ghana', GMB: 'Gambia', GNB: 'Guinea-Bissau', GRC: 'Greece',
  GRD: 'Grenada', GTM: 'Guatemala', GUY: 'Guyana', HKG: 'Hong Kong',
  HND: 'Honduras', HRV: 'Croatia', HUN: 'Hungary', IDN: 'Indonesia',
  IND: 'India', IRL: 'Ireland', IRQ: 'Iraq', ISL: 'Iceland',
  ISR: 'Israel', ITA: 'Italy', JAM: 'Jamaica', JOR: 'Jordan',
  JPN: 'Japan', KAZ: 'Kazakhstan', KEN: 'Kenya', KGZ: 'Kyrgyzstan',
  KHM: 'Cambodia', KNA: 'Saint Kitts and Nevis', KOR: 'South Korea',
  KWT: 'Kuwait', LAO: 'Laos', LBN: 'Lebanon', LBR: 'Liberia',
  LBY: 'Libya', LCA: 'Saint Lucia', LKA: 'Sri Lanka', LTU: 'Lithuania',
  LUX: 'Luxembourg', LVA: 'Latvia', MAC: 'Macao', MAR: 'Morocco',
  MDA: 'Moldova', MDG: 'Madagascar', MDV: 'Maldives', MEX: 'Mexico',
  MKD: 'North Macedonia', MLI: 'Mali', MLT: 'Malta', MMR: 'Myanmar',
  MNE: 'Montenegro', MNG: 'Mongolia', MOZ: 'Mozambique',
  MRT: 'Mauritania', MSR: 'Montserrat', MUS: 'Mauritius', MWI: 'Malawi',
  MYS: 'Malaysia', NAM: 'Namibia', NER: 'Niger', NGA: 'Nigeria',
  NIC: 'Nicaragua', NLD: 'Netherlands', NOR: 'Norway', NPL: 'Nepal',
  NRU: 'Nauru', NZL: 'New Zealand', OMN: 'Oman', PAK: 'Pakistan',
  PAN: 'Panama', PER: 'Peru', PHL: 'Philippines', PLW: 'Palau',
  PNG: 'Papua New Guinea', POL: 'Poland', PRT: 'Portugal',
  PRY: 'Paraguay', QAT: 'Qatar', ROU: 'Romania', RUS: 'Russia',
  RWA: 'Rwanda', SAU: 'Saudi Arabia', SEN: 'Senegal', SGP: 'Singapore',
  SLB: 'Solomon Islands', SLE: 'Sierra Leone', SLV: 'El Salvador',
  SRB: 'Serbia', STP: 'São Tomé and Príncipe', SUR: 'Suriname',
  SVK: 'Slovakia', SVN: 'Slovenia', SWE: 'Sweden', SWZ: 'Eswatini',
  SYC: 'Seychelles', TCA: 'Turks and Caicos Islands', TCD: 'Chad',
  THA: 'Thailand', TJK: 'Tajikistan', TKM: 'Turkmenistan', TON: 'Tonga',
  TTO: 'Trinidad and Tobago', TUN: 'Tunisia', TUR: 'Türkiye',
  TWN: 'Taiwan', TZA: 'Tanzania', UGA: 'Uganda', UKR: 'Ukraine',
  URY: 'Uruguay', USA: 'United States', UZB: 'Uzbekistan',
  VCT: 'Saint Vincent and the Grenadines', VEN: 'Venezuela',
  VGB: 'British Virgin Islands', VNM: 'Vietnam', VUT: 'Vanuatu',
  XKS: 'Kosovo', YEM: 'Yemen', ZAF: 'South Africa', ZMB: 'Zambia',
  ZWE: 'Zimbabwe',
};

/**
 * ISO-3166 alpha-2 → Apple's code, for the same 175 territories. People say
 * TR and US; Apple answers those with 200 and an empty list, so they are
 * turned into TUR and USA before a request is built. `XK` is Kosovo.
 */
const ALPHA3_OF: Record<string, string> = Object.fromEntries(
  'AF:AFG AO:AGO AI:AIA AL:ALB AE:ARE AR:ARG AM:ARM AG:ATG AU:AUS AT:AUT AZ:AZE BE:BEL BJ:BEN BF:BFA BG:BGR BH:BHR BS:BHS BA:BIH BY:BLR BZ:BLZ BM:BMU BO:BOL BR:BRA BB:BRB BN:BRN BT:BTN BW:BWA CA:CAN CH:CHE CL:CHL CN:CHN CI:CIV CM:CMR CD:COD CG:COG CO:COL CV:CPV CR:CRI KY:CYM CY:CYP CZ:CZE DE:DEU DM:DMA DK:DNK DO:DOM DZ:DZA EC:ECU EG:EGY ES:ESP EE:EST FI:FIN FJ:FJI FR:FRA FM:FSM GA:GAB GB:GBR GE:GEO GH:GHA GM:GMB GW:GNB GR:GRC GD:GRD GT:GTM GY:GUY HK:HKG HN:HND HR:HRV HU:HUN ID:IDN IN:IND IE:IRL IQ:IRQ IS:ISL IL:ISR IT:ITA JM:JAM JO:JOR JP:JPN KZ:KAZ KE:KEN KG:KGZ KH:KHM KN:KNA KR:KOR KW:KWT LA:LAO LB:LBN LR:LBR LY:LBY LC:LCA LK:LKA LT:LTU LU:LUX LV:LVA MO:MAC MA:MAR MD:MDA MG:MDG MV:MDV MX:MEX MK:MKD ML:MLI MT:MLT MM:MMR ME:MNE MN:MNG MZ:MOZ MR:MRT MS:MSR MU:MUS MW:MWI MY:MYS NA:NAM NE:NER NG:NGA NI:NIC NL:NLD NO:NOR NP:NPL NR:NRU NZ:NZL OM:OMN PK:PAK PA:PAN PE:PER PH:PHL PW:PLW PG:PNG PL:POL PT:PRT PY:PRY QA:QAT RO:ROU RU:RUS RW:RWA SA:SAU SN:SEN SG:SGP SB:SLB SL:SLE SV:SLV RS:SRB ST:STP SR:SUR SK:SVK SI:SVN SE:SWE SZ:SWZ SC:SYC TC:TCA TD:TCD TH:THA TJ:TJK TM:TKM TO:TON TT:TTO TN:TUN TR:TUR TW:TWN TZ:TZA UG:UGA UA:UKR UY:URY US:USA UZ:UZB VC:VCT VE:VEN VG:VGB VN:VNM VU:VUT XK:XKS YE:YEM ZA:ZAF ZM:ZMB ZW:ZWE'.split(' ').map((pair) => pair.split(':'))
);

/** A territory code as Apple wants it: `tr`, `TR` and `tur` all become `TUR`. Anything unknown is returned as given. */
export function toAlpha3(code: string): string {
  const upper = code.trim().toUpperCase();
  return ALPHA3_OF[upper] ?? (TERRITORY_NAMES[upper] ? upper : code);
}

const TERRITORY_KEY = /^(territory|territories|storefront_country_codes|filter(\[|_)(review)?[Tt]erritory\]?)$/;

/**
 * Every territory code in a tool's arguments, as Apple wants it: the
 * territory parameters themselves, comma lists included, and `{ type:
 * 'territories', id }` anywhere in a body. Runs once, before any tool.
 */
export function withAlpha3<T>(value: T, key = ''): T {
  if (TERRITORY_KEY.test(key)) {
    if (typeof value === 'string') return value.split(',').map(toAlpha3).join(',') as T;
    if (Array.isArray(value)) return value.map((v) => (typeof v === 'string' ? toAlpha3(v) : v)) as T;
  }
  if (Array.isArray(value)) return value.map((v) => withAlpha3(v)) as T;
  if (!value || typeof value !== 'object') return value;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value)) out[k] = withAlpha3(v, k);
  if (out.type === 'territories' && typeof out.id === 'string') out.id = toAlpha3(out.id);
  return out as T;
}
