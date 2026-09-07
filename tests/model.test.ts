import assert from 'node:assert/strict';
import {
  COUNTRIES,
  neutralPolicies,
  simulate,
  runScenario,
  wageEffects,
  DEFAULT_ASSUMPTIONS as a,
  DEFAULT_SETTINGS as s,
  POLICY_GROUPS,
  validateConfiguration,
  ASSUMPTION_CONTROLS,
} from '../lib/economy.ts';
import type { Assumptions } from '../lib/economy.ts';
let checks = 0;
const near = (v: number, e: number, message: string, tol = 1e-8) => {
  assert.ok(Math.abs(v - e) < tol, `${message}: ${v} vs ${e}`);
  checks++;
};
const ok = (b: boolean, m: string) => {
  assert.ok(b, m);
  checks++;
};
for (const c of COUNTRIES) {
  const n = neutralPolicies(c);
  const r = runScenario(c, n, a, s);
  assert.deepEqual(r.scenario, r.baseline);
  checks++;
  for (let q = 0; q < r.scenario.length; q++)
    for (const [metric, [low, high]] of Object.entries(r.bands[q])) {
      near(low, high, `${c.id}: neutral sensitivity ${metric}`);
    }
  const experiments = [
    n,
    ...POLICY_GROUPS.flatMap((g) => g.items).flatMap((spec) => [
      { ...n, [spec.key]: spec.min },
      { ...n, [spec.key]: spec.max },
    ]),
  ];
  for (const p of experiments) {
    const path = simulate(c, p, a, s);
    for (let i = 0; i < path.length; i++) {
      const x = path[i];
      for (const [key, v] of Object.entries(x))
        if (typeof v === 'number')
          ok(Number.isFinite(v), `${c.id} finite ${key}`);
      near(
        x.consumption + x.investment + x.government + x.exports - x.imports,
        x.gdp,
        `${c.id}: GDP identity`,
      );
      near(
        x.revenue - x.expenditure,
        x.balance,
        `${c.id}: fiscal flow balance`,
      );
      near(
        (x.debtStock / x.nominalGdp) * 100,
        x.debt,
        `${c.id}: debt denominator`,
      );
      ok(
        x.employment > 0 && x.unemployment >= 0.5 && x.unemployment <= 55,
        'bounded employment',
      );
      if (i > 0)
        near(
          x.debtStock - x.publicAssets,
          path[i - 1].debtStock -
            path[i - 1].publicAssets -
            ((x.balance / 100) * x.nominalGdp) / 4,
          `${c.id}: quarterly debt accumulation`,
          1e-7,
        );
    }
  }
  const delayed = simulate(c, { ...n, spending: 3, minimumWage: 90 }, a, {
    ...s,
    startQuarter: 9,
  });
  const b = simulate(c, n, a, { ...s, startQuarter: 9 });
  assert.deepEqual(delayed.slice(0, 9), b.slice(0, 9));
  checks++;
}
const c = COUNTRIES[0],
  n = neutralPolicies(c),
  base = simulate(c, n, a, s);
const rate = simulate(c, { ...n, rateChange: 3 }, a, s);
ok(rate[8].gdp < base[8].gdp, 'Higher rates reduce output at year two');
ok(
  rate[12].inflation < base[12].inflation,
  'Higher rates reduce inflation after a lag',
);
const wage = simulate(c, { ...n, minimumWage: 100 }, a, s);
ok(
  wage[12].employment < base[12].employment,
  'Binding high wage floor lowers employment under default hiring assumptions',
);
const investment = simulate(c, { ...n, infrastructure: 3 }, a, s);
ok(
  investment[4].gdp > base[4].gdp,
  'Infrastructure increases near-term demand',
);
ok(
  investment[20].potential > base[20].potential,
  'Infrastructure builds productive capacity',
);
ok(
  investment[4].debtStock > base[4].debtStock,
  'Infrastructure increases nominal debt stock',
);
const smallFloor = wageEffects(
  c,
  { ...n, minimumWage: 40 },
  { ...a, laborElasticity: 0, marketPower: 0.6 },
  1,
);
ok(
  smallFloor.jobs > 0,
  'Market power can produce employment gains from small wage floors',
);
const noCompliance = wageEffects(
  { ...c, informality: 90 },
  { ...n, minimumWage: 100 },
  a,
  1,
);
const compliance = wageEffects(
  { ...c, informality: 0 },
  { ...n, minimumWage: 100 },
  a,
  1,
);
near(
  noCompliance.jobs,
  compliance.jobs * 0.1,
  'Informality scales labor effects',
);
const tax = simulate(c, { ...n, incomeTax: 5 }, a, s);
ok(tax[4].revenue > base[4].revenue, 'Higher income tax raises revenue share');
const temporary = simulate(c, { ...n, spending: 2 }, a, { ...s, duration: 8 });
near(temporary[9].phase, 0, 'Temporary policy ends on time');
const invalid = { ...n, minimumWage: NaN };
assert.throws(() => validateConfiguration(c, invalid, a, s));
checks++;
assert.throws(() =>
  validateConfiguration(
    { ...c, exports: 60, investment: 40, government: 35, imports: 5 },
    n,
    a,
    s,
  ),
);
checks++;
const sensitivity = runScenario(
  c,
  { ...n, infrastructure: 3, minimumWage: 75 },
  a,
  s,
);
ok(
  sensitivity.bands[20].gdp[1] > sensitivity.bands[20].gdp[0],
  'Sensitivity bands vary for active policies',
);
for (const spec of ASSUMPTION_CONTROLS) {
  for (const v of [spec.min, spec.max]) {
    const stress = simulate(
      c,
      { ...n, minimumWage: 90, infrastructure: 4, rateChange: -2 },
      { ...a, [spec.key]: v } as Assumptions,
      { ...s, years: 20 },
    );
    ok(
      stress.every((p) => Number.isFinite(p.gdp) && Number.isFinite(p.debt)),
      `20-year parameter boundary ${spec.key}`,
    );
  }
}
const start = performance.now();
runScenario(c, { ...n, minimumWage: 60 }, a, s);
console.log(
  `PASS: ${checks.toLocaleString()} economic invariants and policy checks. Full sensitivity simulation: ${Math.round(performance.now() - start)} ms.`,
);
