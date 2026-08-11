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
