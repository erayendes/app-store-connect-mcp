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
import { pathToFileURL } from 'node:url';

const APP = { id: '1000000001', name: 'Nimbus Notes', bundleId: 'com.example.nimbus' };
const SUB = { id: '2000000002', name: 'nimbus pro weekly', productId: 'com.example.nimbus.pro.weekly' };

// Price groups, the shape a real catalogue has: one big USD tier, a
// euro-zone tier, and a handful of one-off currencies.
const TIERS = [
  // Mirrors the real shape: most storefronts sit in one big tier, the euro
  // zone in another, and large markets bill in their own currency. Currency
  // follows the territory, as Apple does it — a demo that put JPN in the USD
  // tier made the agent stop and flag it, correctly.
  { price: '4.99', proceeds: '4.24', currentPrice: '3.99', currentProceeds: '3.39', currency: 'USD', territories: ['USA','AFG','AGO','AIA','ATG','BHS','BLZ','BMU','BRB','ECU'] },
  { price: '5.99', proceeds: '5.09', currency: 'EUR', territories: ['DEU','FRA','ESP','ITA','NLD','BEL','AUT','IRL'] },
  { price: '199.99', proceeds: '169.99', currency: 'TRY', territories: ['TUR'] },
  { price: '700', proceeds: '595', currency: 'JPY', territories: ['JPN'] },
  { price: '7.99', proceeds: '6.79', currency: 'AUD', territories: ['AUS'] },
  { price: '19.99', proceeds: '16.18', currency: 'AED', territories: ['ARE'] },
];

const json = (res, body, status = 200) => {
  res.writeHead(status, { 'content-type': 'application/json' });
  res.end(JSON.stringify(body));
};

const error = (res, status, detail) => json(res, {
  errors: [{ status: String(status), title: status === 404 ? 'Not Found' : 'Invalid Request', detail }],
}, status);

/** Each recording starts with its own prices. No upstream requests, even on a miss. */
export function createDemoFixtureHandler() {
  const prices = new Map();
  const points = new Map();
  const territories = [];
  for (const tier of TIERS) {
    for (const territory of tier.territories) {
      const relationships = { territory: { data: { type: 'territories', id: territory } } };
      const point = (id, price, proceeds) => ({
        type: 'subscriptionPricePoints', id,
        attributes: { customerPrice: price, proceeds },
        relationships,
      });
      const target = point(`pp-${territory}`, tier.price, tier.proceeds);
      const current = point(`current-${territory}`, tier.currentPrice ?? tier.price, tier.currentProceeds ?? tier.proceeds);
      points.set(target.id, target);
      points.set(current.id, current);
      territories.push({ type: 'territories', id: territory, attributes: { currency: tier.currency } });
      prices.set(territory, {
        type: 'subscriptionPrices', id: `price-${territory}`,
        attributes: { startDate: null, preserved: false },
        relationships: {
          ...relationships,
          subscriptionPricePoint: { data: { type: 'subscriptionPricePoints', id: current.id } },
        },
      });
    }
  }

  return async (req, res) => {
    const url = new URL(req.url, 'http://127.0.0.1');
    const path = url.pathname;
    const territory = url.searchParams.get('filter[territory]');

    if (req.method === 'POST' && path === '/v1/subscriptionPrices') {
      let body;
      try {
        const chunks = [];
        for await (const chunk of req) chunks.push(chunk);
        body = JSON.parse(Buffer.concat(chunks).toString());
      } catch {
        return error(res, 400, 'Expected a JSON subscription price.');
      }
      const data = body?.data;
      const point = points.get(data?.relationships?.subscriptionPricePoint?.data?.id);
      if (data?.type !== 'subscriptionPrices' ||
          data.relationships?.subscription?.data?.id !== SUB.id || !point ||
          typeof data.attributes?.preserveCurrentPrice !== 'boolean') {
        return error(res, 400, 'Expected the Nimbus weekly subscription, a known price point and preserveCurrentPrice.');
      }
      const code = point.relationships.territory.data.id;
      const row = {
        type: 'subscriptionPrices', id: `price-${code}`,
        attributes: { startDate: data.attributes.startDate ?? null, preserved: data.attributes.preserveCurrentPrice },
        relationships: {
          territory: point.relationships.territory,
          subscriptionPricePoint: { data: { type: 'subscriptionPricePoints', id: point.id } },
        },
      };
      prices.set(code, row);
      return json(res, { data: row }, 201);
    }
    if (req.method !== 'GET') return error(res, 404, `${req.method} ${path}`);

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
      const rows = [...prices.values()].filter((p) => !territory || p.relationships.territory.data.id === territory);
      return json(res, {
        data: rows,
        included: [
          ...territories.filter((t) => !territory || t.id === territory),
          ...rows.map((p) => points.get(p.relationships.subscriptionPricePoint.data.id)),
        ],
      });
    }
    if (path === `/v1/subscriptions/${SUB.id}`) {
      return json(res, { data: { type: 'subscriptions', id: SUB.id, attributes: {
        name: SUB.name, productId: SUB.productId, state: 'APPROVED', subscriptionPeriod: 'ONE_WEEK',
      } } });
    }
    if (path === `/v1/subscriptions/${SUB.id}/pricePoints`) {
      return json(res, { data: [...points.values()].filter((p) => !territory || p.relationships.territory.data.id === territory) });
    }
    // Apple's equivalent tiers, deliberately different numbers in each currency.
    if (path === '/v1/subscriptionPricePoints/pp-USA/equalizations') {
      return json(res, {
        data: [...points.values()].filter((p) => p.id.startsWith('pp-') && p.id !== 'pp-USA'),
        included: territories.filter((t) => t.id !== 'USA'),
      });
    }
    const pointId = path.match(/^\/v1\/subscriptionPricePoints\/([^/]+)$/)?.[1];
    if (pointId && points.has(pointId)) {
      const point = points.get(pointId);
      return json(res, { data: point, included: territories.filter((t) => t.id === point.relationships.territory.data.id) });
    }

    return error(res, 404, path);
  };
}

export const createDemoFixtureServer = () => createServer(createDemoFixtureHandler());

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const server = createDemoFixtureServer();
  const port = Number(process.argv[2] ?? 8787);
  server.listen(port, '127.0.0.1', () => console.log(`fixture on http://127.0.0.1:${server.address().port}`));
}
