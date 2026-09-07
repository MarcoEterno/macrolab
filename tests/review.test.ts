import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import {
  COUNTRIES,
  DEFAULT_ASSUMPTIONS as a,
  DEFAULT_SETTINGS as s,
  neutralPolicies,
  simulate,
  runScenario,
  priceStep,
  fiscalStep,
  wageEffects,
  validateConfiguration,
  COEFFICIENT_LABELS,
  POLICY_GROUPS,
  COUNTRY_CONTROLS,
  ASSUMPTION_CONTROLS,
  METRICS,
  SOURCES,
  DATA_SNAPSHOT,
} from '../lib/economy.ts';
import {
  initialScenario,
  serializeScenario,
  parseScenario,
  encodeScenario,
  decodeScenario,
} from '../lib/scenario.ts';
import { italian } from '../lib/italian.ts';
import { createI18n, defaultCountryId } from '../lib/locale.ts';
const near = (actual: number, expected: number, tolerance = 1e-7) =>
  assert.ok(
    Math.abs(actual - expected) < tolerance,
    `${actual} != ${expected}`,
  );
const us = COUNTRIES[0],
  n = neutralPolicies(us);
// A cost shock must not be repeatedly fed into core inflation.
let core = 2,
  corePrice = 100,
  price = 100;
for (let q = 1; q <= 40; q++) {
  const step = priceStep(
    core,
    corePrice,
    price,
    0,
    { domestic: 1, imported: 2 },
    { ...us, target: 2 },
    a,
  );
  near(step.coreInflation, 2);
  near(step.price, 100 * 1.02 ** (q / 4) * Math.exp(0.03));
  near(step.gdpDeflator, 100 * 1.02 ** (q / 4) * Math.exp(0.01));
  core = step.coreInflation;
  corePrice = step.corePrice;
  price = step.price;
}
const reversed = priceStep(
  core,
  corePrice,
  price,
  0,
  { domestic: 0, imported: 0 },
  { ...us, target: 2 },
  a,
);
near(reversed.price, 100 * 1.02 ** (41 / 4));
near(reversed.coreInflation, 2);
// Stationarity is tested at an actual model equilibrium, not arbitrary country observations.
const calm = {
  ...us,
  gap: 0,
  inflation: 2,
  target: 2,
  rate: 3,
  neutralRate: 1,
  debt: 0,
  government: 17,
  transfers: 10,
  revenue: 27,
};
const equilibrium = simulate(calm, neutralPolicies(calm), a, s);
for (const [q, p] of equilibrium.entries()) {
  near(p.gap, 0);
  near(p.gdp, 100 * 1.02 ** (q / 4));
  near(p.unemployment, calm.unemployment);
  near(p.inflation, 2);
  assert.ok(p.valid);
}
assert.equal(COUNTRIES.find((c) => c.id === 'BR')!.neutralRate, 5);
assert.equal(COUNTRIES.find((c) => c.id === 'JP')!.neutralRate, -0.5);
// Domestic fiscal shocks do not set the ECB's common rate or euro path.
for (const id of ['IT', 'DE']) {
  const c = COUNTRIES.find((c) => c.id === id)!;
  const r = runScenario(c, { ...neutralPolicies(c), spending: 3 }, a, s, false);
  for (let q = 0; q < r.scenario.length; q++) {
    near(r.scenario[q].rate, r.baseline[q].rate);
    near(r.scenario[q].fx, r.baseline[q].fx);
  }
}
// Additional migration is measured against the initial labor force, including fractional ramps.
const constantLabor = {
  ...us,
  population: 340,
  laborForce: 50,
  laborGrowth: 0,
};
const migration = simulate(
  constantLabor,
  { ...neutralPolicies(constantLabor), immigration: 2 },
  a,
  { ...s, ramp: 1, years: 20 },
);
near(migration[80].laborForce, 238);
const temporary = simulate(
  constantLabor,
  { ...neutralPolicies(constantLabor), immigration: 2 },
  a,
  { ...s, ramp: 1, duration: 8 },
);
near(temporary[40].laborForce, 176.8);
assert.ok(Math.abs(temporary[40].demand.migration) < 0.0001);
const fiscal = simulate(calm, { ...neutralPolicies(calm), spending: 3 }, a, {
  ...s,
  ramp: 1,
  years: 20,
});
assert.ok(
  Math.abs(fiscal[80].demand.fiscal + fiscal[80].demand.adjustment) < 0.06,
  'Permanent fiscal demand fades instead of generating a perpetual demand gap',
);
const wage = simulate(calm, { ...neutralPolicies(calm), minimumWage: 60 }, a, {
  ...s,
  ramp: 1,
  years: 20,
});
assert.ok(
  Math.abs(wage[80].demand.wages + wage[80].demand.adjustment) < 0.015,
  'Wage redistribution also allows long-run demand reallocation',
);
const fx = runScenario(
  calm,
  { ...neutralPolicies(calm), rateChange: 1 },
  a,
  { ...s, ramp: 1, automaticRates: false },
  false,
);
assert.ok(
  fx.scenario[20].fx < fx.baseline[20].fx - 0.5,
  'Currency response has meaningful and explicit units',
);
// Budget and household amounts are reconciled in money, not just as chart percentages.
for (const c of COUNTRIES) {
  const x = simulate(
    c,
    { ...neutralPolicies(c), transfers: 2, minimumWage: 60, incomeTax: 2 },
    a,
    s,
  );
  for (const [i, p] of x.entries()) {
    near(p.transfers, p.householdTransfers);
    near(
      p.householdIncomeNominal,
      p.nominalGdp * (1 - p.revenue / 100) + p.transfers,
      1e-6,
    );
    if (i)
      near(
        p.debtStock - p.publicAssets,
        x[i - 1].debtStock -
          x[i - 1].publicAssets -
          ((p.balance / 100) * p.nominalGdp) / 4,
        1e-6,
      );
  }
}
const assetCountry = { ...calm, revenue: 15 };
const w = wageEffects(assetCountry, neutralPolicies(assetCountry), a, 0);
const draw = fiscalStep(
  assetCountry,
  neutralPolicies(assetCountry),
  w,
  0,
  100,
  100,
  100,
  assetCountry.unemployment,
  35,
  14,
  3,
  0,
  0,
  10000,
  3,
  true,
);
assert.equal(draw.debtStock, 0);
assert.ok(draw.publicAssets < 10000 && draw.publicAssets > 0);
// Pure nominal scaling does not arbitrarily lower real household incomes.
const c0 = {
  ...calm,
  growth: 0,
  laborGrowth: 0,
  target: 0,
  inflation: 0,
  rate: 1,
};
const zero = simulate(c0, neutralPolicies(c0), a, s);
const two = simulate(
  { ...c0, target: 2, inflation: 2, rate: 3 },
  neutralPolicies(c0),
  a,
  s,
);
near(zero.at(-1)!.wages, two.at(-1)!.wages);
for (const [key, value] of [
  ['rateChange', 2],
  ['energyShock', 40],
  ['tariff', 10],
  ['immigration', 1],
] as const) {
  const r = runScenario(us, { ...n, [key]: value }, a, s);
  assert.ok(
    r.bands[20].gdp[1] - r.bands[20].gdp[0] > 1e-4,
    `${key} needs relevant sensitivity coverage`,
  );
}
const edge = { ...us, investment: 40, government: 35, exports: 15, imports: 5 };
const invalid = runScenario(
  edge,
  {
    ...neutralPolicies(edge),
    minimumWage: 120,
    tariff: 30,
    spending: 8,
    infrastructure: 6,
    training: 3,
    energyShock: 100,
  },
  a,
  s,
  false,
);
assert.notEqual(invalid.invalidAt, null);
assert.ok(invalid.scenario.some((p) => p.consumption <= 0));
assert.throws(() =>
  validateConfiguration({ ...us, population: '340' } as never, n, a, s),
);
// Stored/shareable state is validated and includes exact parameters and timing.
for (const id of ['US', 'IT']) {
  const cfg = initialScenario(id);
  cfg.policies.transfers = 2.5;
  const parsed = decodeScenario(encodeScenario(cfg));
  assert.equal(JSON.stringify(parsed.config), JSON.stringify(cfg));
  assert.equal(parsed.migrated, false);
}
const old = {
  ...serializeScenario(initialScenario('BR')),
  model: 'MacroLab 1.0',
  assumptions: { ...a, neutralRate: 1 },
};
const migrated = parseScenario(old);
assert.equal(migrated.migrated, true);
assert.equal(migrated.config.country.neutralRate, 1);
assert.equal(migrated.config.assumptions.neutralRate, 0);
assert.throws(() =>
  parseScenario({
    ...serializeScenario(initialScenario()),
    policies: { ...n, tariff: 100 },
  }),
);
assert.throws(() => decodeScenario('x'.repeat(21000)));
assert.equal(defaultCountryId('it'), 'IT');
assert.equal(defaultCountryId('en'), 'US');
// The public downloadable snapshot must exactly match the model's immutable source observations.
assert.deepEqual(
  JSON.parse(
    fs.readFileSync(
      new URL('../public/data-snapshot.json', import.meta.url),
      'utf8',
    ),
  ),
  DATA_SNAPSHOT,
);
assert.ok(COUNTRIES.every((c) => c.gdpYear === 2025 && c.population > 1));
// Cover literal UI text, dynamic control labels, methodology tables and notices.
const keys = new Set([
  ...COUNTRIES.flatMap((c) => [c.name, c.description]),
  ...POLICY_GROUPS.map((g) => g.name),
  ...[
    ...POLICY_GROUPS.flatMap((g) => g.items),
    ...COUNTRY_CONTROLS,
    ...ASSUMPTION_CONTROLS,
  ].flatMap((x) => [x.label, x.description, x.unit]),
  ...METRICS.flatMap((x) => [x.name, x.description, x.unit]),
  ...SOURCES.flatMap((x) => [x.title, x.note]),
  ...Object.values(COEFFICIENT_LABELS),
]);
function addExpression(node: ts.Node) {
  if (ts.isStringLiteral(node)) keys.add(node.text);
  else if (ts.isConditionalExpression(node)) {
    addExpression(node.whenTrue);
    addExpression(node.whenFalse);
  }
}
for (const file of [
  'components/simulator.tsx',
  'components/methodology.tsx',
  'components/economy-chart.tsx',
  'lib/economy.ts',
  'lib/scenario.ts',
]) {
  const source = ts.createSourceFile(
    file,
    fs.readFileSync(new URL('../' + file, import.meta.url), 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  function visit(node: ts.Node) {
    if (ts.isCallExpression(node) && node.arguments[0]) {
      if (
        ts.isIdentifier(node.expression) &&
        ['t', 'setNotice', 'setInitialNotice'].includes(node.expression.text)
      )
        addExpression(node.arguments[0]);
      if (
        ts.isPropertyAccessExpression(node.expression) &&
        node.expression.getText(source) === 'warnings.push'
      )
        addExpression(node.arguments[0]);
    }
    if (
      file.endsWith('methodology.tsx') &&
      ts.isArrayLiteralExpression(node) &&
      node.elements.length >= 3 &&
      node.elements.every(ts.isStringLiteral)
    ) {
      for (const child of node.elements)
        if (ts.isStringLiteral(child) && !/^0\d$|=/.test(child.text))
          keys.add(child.text);
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
}
const missing = [...keys].filter(
  (key) => !['', '%', 'σ'].includes(key) && !Object.hasOwn(italian, key),
);
assert.deepEqual(missing, []);
for (const [key, value] of Object.entries(italian))
  assert.deepEqual(
    (key.match(/\{\w+\}/g) ?? []).sort(),
    (value.match(/\{\w+\}/g) ?? []).sort(),
    key,
  );
assert.equal(createI18n('it').number(1234.5), '1.234,5');
assert.equal(
  createI18n('it').t('Invalid country value: population'),
  'Dato iniziale del paese non valido.',
);
// Fixed output magnitudes make later calibration changes deliberate. This is
// software regression protection, not validation against observed economies.
const fixture = JSON.parse(
  fs.readFileSync(new URL('./fixtures/model-v2.json', import.meta.url), 'utf8'),
);
for (const record of fixture.records) {
  const country = COUNTRIES.find((c) => c.id === record.countryId)!;
  const path = simulate(
    country,
    { ...neutralPolicies(country), ...record.policyChanges },
    a,
    s,
  );
  for (const point of record.points) {
    for (const [key, expected] of Object.entries(point)) {
      const actual = path[point.quarter][key as keyof (typeof path)[number]];
      assert.equal(typeof actual, 'number');
      near(actual as number, expected as number, fixture.tolerance);
    }
  }
}
console.log(
  `PASS: model-review regression checks, ${keys.size} translation keys, scenario round-trips and fixed source snapshots.`,
);
