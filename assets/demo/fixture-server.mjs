/**
 * Stands in for Apple, for the README demo only.
 *
 * The demo records a real agent session against a real Heimdall server over
 * real MCP — only the App Store Connect account behind it is invented, so the
 * GIF can be public without confirming which apps or prices a real account
 * holds. Same mechanism the tests use: `ASC_BASE_URL` repoints
 * `AscHttpClient`, and host pinning follows it (see src/core/http.ts).
 *
 * The data is shaped like Apple's, including the parts that make the macro
 * worth having: prices live on the included price point, the currency lives on
 * the included territory, and neither is in the row itself.
 */
import { createServer } from 'node:http';

const APP = { id: '1000000001', name: 'Nimbus Notes', bundleId: 'com.example.nimbus' };
const SUB = { id: '2000000002', name: 'nimbus pro weekly', productId: 'com.example.nimbus.pro.weekly' };

// Three price groups, the shape a real catalogue has: one big USD tier, a
// euro-zone tier, and a handful of one-off currencies.
const TIERS = [
  // Mirrors the real shape: most storefronts sit in one big tier, the euro
  // zone in another, and large markets bill in their own currency. Currency
  // follows the territory, as Apple does it — a demo that put JPN in the USD
  // tier made the agent stop and flag it, correctly.
  { price: '4.99', proceeds: '4.24', currency: 'USD', territories: ['USA','AFG','AGO','AIA','ATG','BHS','BLZ','BMU','BRB','ECU'] },
  { price: '5.99', proceeds: '5.09', currency: 'EUR', territories: ['DEU','FRA','ESP','ITA','NLD','BEL','AUT','IRL'] },
  { price: '199.99', proceeds: '169.99', currency: 'TRY', territories: ['TUR'] },
  { price: '700', proceeds: '595', currency: 'JPY', territories: ['JPN'] },
  { price: '7.99', proceeds: '6.79', currency: 'AUD', territories: ['AUS'] },
  { price: '19.99', proceeds: '16.18', currency: 'AED', territories: ['ARE'] },
];

const prices = [];
const included = [];
for (const tier of TIERS) {
  for (const t of tier.territories) {
    const pointId = `pp-${t}`;
    prices.push({
      type: 'subscriptionPrices',
      id: `price-${t}`,
      attributes: { startDate: null, preserved: false },
      relationships: {
        territory: { data: { type: 'territories', id: t } },
        subscriptionPricePoint: { data: { type: 'subscriptionPricePoints', id: pointId } },
      },
    });
    included.push({ type: 'territories', id: t, attributes: { currency: tier.currency } });
    included.push({
      type: 'subscriptionPricePoints',
      id: pointId,
      attributes: { customerPrice: tier.price, proceeds: tier.proceeds },
    });
  }
}

const json = (res, body) => {
  res.writeHead(200, { 'content-type': 'application/json' });
  res.end(JSON.stringify(body));
};

const server = createServer((req, res) => {
  const path = req.url.split('?')[0];

  if (path === '/v1/apps') {
    return json(res, { data: [{ type: 'apps', id: APP.id, attributes: { name: APP.name, bundleId: APP.bundleId } }] });
  }
  if (path === `/v1/apps/${APP.id}`) {
    return json(res, { data: { type: 'apps', id: APP.id, attributes: { name: APP.name, bundleId: APP.bundleId } } });
  }
  if (path === `/v1/apps/${APP.id}/subscriptionGroups`) {
    return json(res, {
      data: [{ type: 'subscriptionGroups', id: 'g-1', attributes: { referenceName: 'Nimbus Pro' } }],
      included: [{ type: 'subscriptions', id: SUB.id, attributes: { name: SUB.name, productId: SUB.productId, state: 'APPROVED', subscriptionPeriod: 'ONE_WEEK' } }],
    });
  }
  if (path === `/v1/subscriptions/${SUB.id}/prices`) {
    return json(res, { data: prices, included });
  }

  res.writeHead(404, { 'content-type': 'application/json' });
  res.end(JSON.stringify({ errors: [{ status: '404', title: 'Not Found', detail: path }] }));
});

const port = Number(process.argv[2]) || 8787;
server.listen(port, '127.0.0.1', () => console.log(`fixture on http://127.0.0.1:${port}`));
