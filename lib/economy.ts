/** MacroLab 2.0: an auditable scenario model, not a validated country forecast.
 * Annual percentage rates; quarterly integration. USD billion at base FX.
 */
import {
  COUNTRIES,
  COUNTRY_CONTROLS,
  POLICY_GROUPS,
  ASSUMPTION_CONTROLS,
  COEFFICIENTS as K,
  METRICS,
  neutralPolicies,
} from './economy-config.ts';
import type {
  Country,
  Policies,
  Assumptions,
  Settings,
  Metric,
} from './economy-config.ts';
export * from './economy-config.ts';
export const clamp = (value: number, low: number, high: number) =>
  Math.max(low, Math.min(high, value));
const mean = (values: number[]) =>
  values.reduce((sum, value) => sum + value, 0) / values.length;
const sum = (values: number[]) =>
  values.reduce((total, value) => total + value, 0);
function normalQuantile(p: number): number {
  const a = [
      -39.6968302866538, 220.946098424521, -275.928510446969, 138.357751867269,
      -30.6647980661472, 2.50662827745924,
    ],
    b = [
      -54.4760987982241, 161.585836858041, -155.698979859887, 66.8013118877197,
      -13.2806815528857,
    ],
    c = [
      -0.00778489400243029, -0.322396458041136, -2.40075827716184,
      -2.54973253934373, 4.37466414146497, 2.93816398269878,
    ],
    d = [
      0.00778469570904146, 0.32246712907004, 2.445134137143, 3.75440866190742,
    ];
  if (p < 0.02425) {
    const q = Math.sqrt(-2 * Math.log(p));
    return (
      (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    );
  }
  if (p > 1 - 0.02425) return -normalQuantile(1 - p);
  const q = p - 0.5,
    r = q * q;
  return (
    ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) *
      q) /
    (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)
  );
}

export function wageEffects(
  c: Country,
  p: Policies,
  a: Assumptions,
  phase: number,
) {
  const floor = (c.floor + (p.minimumWage - c.floor) * phase) / 100;
  const enforcement = 1 - c.informality / 100;
  const wages = Array.from({ length: 100 }, (_, i) =>
    Math.exp(c.dispersion * normalQuantile((i + 0.5) / 100)),
  );
  const rows = wages.map((wage) => {
    const old = Math.max(wage, c.floor / 100),
      next = Math.max(wage, floor);
    const change = Math.log(next / old);
    // Monopsony benefit is deliberately bounded; this is a sensitivity hypothesis.
    const offset =
      a.marketPower *
      Math.min(Math.max(change, 0), K.monopsonyGainLimit) *
      Math.max(0, 1 - floor / K.monopsonyFloorCutoff);
    const retention = clamp(1 - a.laborElasticity * change + offset, 0.25, 1.1);
    return {
      old,
      next,
      retention,
      earnings: old * (1 - enforcement) + next * retention * enforcement,
    };
  });
  const oldBill = sum(rows.map((row) => row.old));
  return {
    rows,
    coverage:
      rows.filter((row) => row.next > row.old + 1e-8).length * enforcement,
    jobs: mean(rows.map((row) => (row.retention - 1) * enforcement)) * 100,
    bill: (sum(rows.map((row) => row.earnings)) / oldBill - 1) * 100,
    grossRaise:
      (sum(rows.map((row) => (row.next - row.old) * enforcement)) / oldBill) *
      100,
  };
}

type Wages = ReturnType<typeof wageEffects>;
export type DemandComponents = {
  fiscal: number;
  adjustment: number;
  wages: number;
  trade: number;
  rates: number;
  energy: number;
  migration: number;
  stabilizers: number;
};
export type Point = {
  quarter: number;
  year: number;
  gdp: number;
  growth: number;
  potential: number;
  gap: number;
  inflation: number;
  coreInflation: number;
  price: number;
  gdpDeflator: number;
  rate: number;
  unemployment: number;
  employment: number;
  laborForce: number;
  debt: number;
  debtStock: number;
  publicAssets: number;
  nominalGdp: number;
  balance: number;
  primaryBalance: number;
  revenue: number;
  expenditure: number;
  interest: number;
  transfers: number;
  householdTransfers: number;
  householdIncomeNominal: number;
  consumption: number;
  investment: number;
  government: number;
  exports: number;
  imports: number;
  netExports: number;
  wages: number;
  gini: number;
  quintiles: number[];
  fx: number;
  laborImpact: number;
  coverage: number;
  phase: number;
  demand: DemandComponents;
  valid: boolean;
  warnings: string[];
};
function gini(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b),
    total = sum(sorted);
  return (
    100 *
    ((2 * sorted.reduce((acc, value, i) => acc + (i + 1) * value, 0)) /
      (sorted.length * total) -
      (sorted.length + 1) / sorted.length)
  );
}
export function validateConfiguration(
  c: Country,
  p: Policies,
  a: Assumptions,
  s: Settings,
) {
  const template = COUNTRIES.find((preset) => preset.id === c.id);
  if (!template) throw new Error('Unknown country');
  for (const [key, value] of Object.entries(template)) {
    if (
      typeof value === 'number' &&
      (typeof c[key as keyof Country] !== 'number' ||
        !Number.isFinite(c[key as keyof Country]))
    )
      throw new Error(`Invalid country value: ${key}`);
  }
  for (const [key, v] of Object.entries(c))
    if (typeof v === 'number' && !Number.isFinite(v))
      throw new Error(`Invalid country value: ${key}`);
  for (const [specs, object] of [
    [COUNTRY_CONTROLS, c],
    [POLICY_GROUPS.flatMap((g) => g.items), p],
    [ASSUMPTION_CONTROLS, a],
  ] as const) {
    for (const spec of specs) {
      const v = (object as unknown as Record<string, number>)[spec.key];
      if (!Number.isFinite(v) || v < spec.min - 1e-8 || v > spec.max + 1e-8)
        throw new Error(
          `${spec.label} must be between ${spec.min} and ${spec.max}.`,
        );
    }
  }
  if (100 - c.investment - c.government - c.exports + c.imports < 15)
    throw new Error(
      'These expenditure shares leave less than 15% of GDP for household consumption. Reduce exports, investment, or government purchases, or increase imports.',
    );
  if (
    !COUNTRIES.some((x) => x.id === c.id) ||
    c.gdp <= 0 ||
    c.population <= 0 ||
    c.laborForce <= 0 ||
    c.laborForce > 100 ||
    !Number.isFinite(c.floor) ||
    c.floor < 0 ||
    c.floor > 120
  )
    throw new Error('GDP, population, and the labor force must be positive.');
  if (
    !Number.isInteger(s.years) ||
    s.years < 2 ||
    s.years > 20 ||
    !Number.isInteger(s.startQuarter) ||
    s.startQuarter < 1 ||
    s.startQuarter > 20 ||
    !Number.isInteger(s.ramp) ||
    s.ramp < 1 ||
    s.ramp > 12 ||
    !Number.isInteger(s.duration) ||
    s.duration < 0 ||
    s.duration > 80 ||
    typeof s.automaticRates !== 'boolean'
  )
    throw new Error('Invalid simulation timing or monetary setting.');
}

/** A cost-level shock changes the price level once, never the persistent core state. */
export function priceStep(
  coreInflation: number,
  corePrice: number,
  lastPrice: number,
  gap: number,
  costs: { domestic: number; imported: number },
  c: Country,
  a: Assumptions,
) {
  const rawCore =
    K.inflationPersistence * coreInflation +
    (1 - K.inflationPersistence) * c.target +
    a.phillips * gap;
  const core = clamp(rawCore, -8, 40);
  const nextCorePrice = corePrice * (1 + core / 100) ** 0.25;
  const gdpDeflator = nextCorePrice * Math.exp(costs.domestic / 100);
  const price = gdpDeflator * Math.exp(costs.imported / 100);
  return {
    coreInflation: core,
    corePrice: nextCorePrice,
    gdpDeflator,
    price,
    inflation: ((price / lastPrice) ** 4 - 1) * 100,
    bounded: core !== rawCore,
  };
}

/** Every household tax and transfer is the same monetary flow used in the budget. */
export function fiscalStep(
  c: Country,
  p: Policies,
  w: Wages,
  phase: number,
  Y: number,
  reference: number,
  gdpDeflator: number,
  u: number,
  government: number,
  imports: number,
  rate: number,
  risk: number,
  debtStock: number,
  publicAssets: number,
  effectiveDebtRate: number,
  advance: boolean,
) {
  const nominalGdp = (((c.gdp * Y) / 100) * gdpDeflator) / 100;
  const referenceNominal = (((c.gdp * reference) / 100) * gdpDeflator) / 100;
  const averageWageRaise = (1 + w.bill / 100) / (1 + w.jobs / 100);
  const payroll = K.laborShare * nominalGdp * averageWageRaise;
  const capitalIncome = nominalGdp - payroll;
  const laborTaxRate = clamp(
    (c.revenue * K.revenueFromLabor) / K.laborShare / 100 +
      (p.incomeTax * phase) / 100,
    0,
    0.8,
  );
  const corporateTaxRate = clamp(
    (c.revenue * K.revenueFromProfit) / K.corporateProfitShare / 100 +
      (p.corporateTax * phase) / 100,
    0,
    0.8,
  );
  const laborTaxes = laborTaxRate * payroll;
  const corporateTaxes =
    corporateTaxRate *
    Math.min(K.corporateProfitShare * nominalGdp, Math.max(0, capitalIncome));
  const otherTaxes =
    ((c.revenue * (1 - K.revenueFromLabor - K.revenueFromProfit)) / 100) *
    nominalGdp;
  const tariffTaxes = ((((p.tariff * phase) / 100) * imports) / Y) * nominalGdp;
  const revenue = laborTaxes + corporateTaxes + otherTaxes + tariffTaxes;
  const transfers =
    ((c.transfers + p.transfers * phase) / 100) * referenceNominal +
    (Math.max(-3, (u - c.unemployment) * K.automaticTransfers) / 100) *
      nominalGdp;
  const purchases =
    ((government + (p.infrastructure * phase * reference) / 100) / Y) *
    nominalGdp;
  const debtRate = advance
    ? K.debtRatePersistence * effectiveDebtRate +
      (1 - K.debtRatePersistence) * Math.max(0.1, rate + risk)
    : effectiveDebtRate;
  const interest = (debtStock * debtRate) / 100;
  const expenditure = purchases + transfers + interest;
  const balance = ((revenue - expenditure) / nominalGdp) * 100;
  // Track surplus assets, so later deficits use savings before issuing new debt.
  const financingNeed = advance ? (expenditure - revenue) / 4 : 0;
  let debt = debtStock,
    assets = publicAssets;
  if (financingNeed > 0) {
    const draw = Math.min(assets, financingNeed);
    assets -= draw;
    debt += financingNeed - draw;
  } else {
    const repayment = Math.min(debt, -financingNeed);
    debt -= repayment;
    assets += -financingNeed - repayment;
  }
  return {
    nominalGdp,
    payroll,
    capitalIncome,
    laborTaxes,
    corporateTaxes,
    otherTaxes: otherTaxes + tariffTaxes,
    revenue,
    transfers,
    purchases,
    interest,
    expenditure,
    balance,
    primaryBalance: balance + (interest / nominalGdp) * 100,
    debtStock: debt,
    publicAssets: assets,
    effectiveDebtRate: debtRate,
  };
}

export function householdStep(
  w: Wages,
  fiscal: ReturnType<typeof fiscalStep>,
  laborForce: number,
  price: number,
) {
  const wageWeights = w.rows.map((row) => row.earnings),
    capitalWeights = w.rows.map(
      (row) => row.old ** K.capitalIncomeConcentration,
    );
  const transferWeights = w.rows.map(
    (_, i) =>
      1 + K.transferTilt - (2 * K.transferTilt * i) / (w.rows.length - 1),
  );
  const laborTotal = sum(wageWeights),
    capitalTotal = sum(capitalWeights),
    transferTotal = sum(transferWeights);
  const nominal = w.rows.map((_, i) => {
    const labor = wageWeights[i] / laborTotal,
      capital = capitalWeights[i] / capitalTotal;
    const gross = fiscal.payroll * labor + fiscal.capitalIncome * capital;
    return (
      gross -
      fiscal.laborTaxes * labor -
      fiscal.corporateTaxes * capital -
      (fiscal.otherTaxes * gross) / fiscal.nominalGdp +
      (fiscal.transfers * transferWeights[i]) / transferTotal
    );
  });
  const realPerWorker = nominal.map(
    (value) => value / (laborForce / 100) / (price / 100),
  );
  return {
    incomes: realPerWorker,
    totalNominal: sum(nominal),
    transfers: fiscal.transfers,
    valid:
      realPerWorker.every((value) => value > 0) && fiscal.capitalIncome >= 0,
  };
}

export function demandStep(
  c: Country,
  p: Policies,
  a: Assumptions,
  w: Wages,
  phase: number,
  gap: number,
  realRateGap: number,
  risk: number,
  fx: number,
  energy: number,
  external: number,
  fiscalAbsorption: number,
  migrationCost: number,
  u: number,
) {
  const multiplier =
    a.fiscalMultiplier *
    (1 - c.imports / K.importLeakageScale) *
    (1 + Math.max(0, -gap) * K.spareCapacityMultiplier) *
    (1 + (a.lowMpc - K.fiscalMpcReference) * K.fiscalMpcSensitivity);
  const fiscal =
    multiplier *
    ((p.spending + p.infrastructure + p.training) * phase +
      a.lowMpc * p.transfers * phase -
      (a.lowMpc * K.laborTaxLowMpcWeight +
        a.highMpc * (1 - K.laborTaxLowMpcWeight)) *
        p.incomeTax *
        K.laborShare *
        phase -
      a.highMpc * p.corporateTax * K.corporateProfitShare * phase);
  const wages =
    (w.bill * K.laborShare * a.lowMpc -
      w.grossRaise * K.laborShare * (1 - a.passThrough) * a.highMpc) *
    K.wageDemandWeight;
  const trade =
    ((external * c.exports) / 100) * K.foreignDemandElasticity +
    ((Math.log(fx / 100) * 100 * (c.exports + c.imports)) / 100) *
      K.tradeDemandElasticity -
    ((p.tariff * phase * c.imports) / 100) * K.tariffDemand;
  const components: DemandComponents = {
    fiscal,
    adjustment: -fiscalAbsorption,
    wages,
    trade,
    rates: -K.rateDemand * (realRateGap + risk),
    energy:
      ((-energy * c.energyShare) / 100) *
      a.energyPassThrough *
      K.energyDemandWeight,
    migration: -migrationCost,
    stabilizers: K.automaticTransfers * (u - c.unemployment) * a.lowMpc,
  };
  return {
    components,
    target: sum(Object.values(components)),
    fiscalAbsorption:
      fiscalAbsorption +
      (1 - 0.5 ** (1 / (4 * a.fiscalFadeYears))) *
        (fiscal + wages - fiscalAbsorption),
  };
}

export function simulate(
  c: Country,
  p: Policies,
  a: Assumptions,
  s: Settings,
): Point[] {
  validateConfiguration(c, p, a, s);
  const points: Point[] = [];
  const initialW = wageEffects(c, neutralPolicies(c), a, 0);
  const startLabor = (c.population * c.laborForce) / 100;
  const structuralU = clamp(c.unemployment + a.okun * c.gap, 1, 45);
  const depreciation = a.depreciation / 100 / 4,
    baseCapital = c.investment / (a.depreciation + c.growth);
  let capital = baseCapital,
    refCapital = baseCapital,
    publicCapital = 0,
    extraLabor = 0,
    trainingStock = 0;
  let gap = c.gap,
    coreInflation = c.inflation,
    corePrice = 100,
    price = 100,
    gdpDeflator = 100,
    rate = c.rate,
    fx = 100,
    u = c.unemployment;
  let debtStock = (c.gdp * c.debt) / 100,
    publicAssets = 0,
    effectiveDebtRate = Math.max(
      0.1,
      c.rate * K.initialDebtPolicyRateWeight +
        c.target * (1 - K.initialDebtPolicyRateWeight),
    );
  let previousY = 100,
    previousInvestment = c.investment,
    fiscalAbsorption = 0,
    migrationCost = 0;
  const initialFiscal = fiscalStep(
    c,
    p,
    initialW,
    0,
    100,
    100,
    100,
    u,
    c.government,
    c.imports,
    rate,
    0,
    debtStock,
    0,
    effectiveDebtRate,
    false,
  );
  const initialIncomes = householdStep(
    initialW,
    initialFiscal,
    startLabor,
    100,
  ).incomes;
  for (let q = 0; q <= s.years * 4; q++) {
    const warnings: string[] = [];
    const reference = 100 * (1 + c.growth / 100) ** (q / 4),
      priorReference = 100 * (1 + c.growth / 100) ** ((q - 1) / 4);
    const baselineLabor = startLabor * (1 + c.laborGrowth / 100) ** (q / 4);
    const active =
      q >= s.startQuarter &&
      (s.duration === 0 || q < s.startQuarter + s.duration);
    const phase = active ? Math.min(1, (q - s.startQuarter + 1) / s.ramp) : 0;
    const w = wageEffects(c, p, a, phase);
    const neutral = c.neutralRate + a.neutralRate;
    let investment = c.investment,
      government = c.government,
      exports = c.exports,
      imports = c.imports;
    let Y = 100,
      potential = 100 / (1 + c.gap / 100),
      inflation = c.inflation,
      risk = 0;
    let demand: DemandComponents = {
      fiscal: 0,
      adjustment: 0,
      wages: 0,
      trade: 0,
      rates: 0,
      energy: 0,
      migration: 0,
      stabilizers: 0,
    };
    if (q > 0) {
      const energy =
        q >= s.startQuarter
          ? p.energyShock * 0.5 ** ((q - s.startQuarter) / K.energyHalfLife)
          : 0;
      const external =
        q >= s.startQuarter
          ? p.worldDemand *
            0.5 ** ((q - s.startQuarter) / K.foreignDemandHalfLife)
          : 0;
      const realRateGap = rate - coreInflation - neutral;
      risk =
        Math.max(
          0,
          (debtStock / ((((c.gdp * previousY) / 100) * gdpDeflator) / 100)) *
            100 -
            c.debt,
        ) * K.debtRisk;
      const flow = (startLabor * p.immigration * phase) / 100 / 4;
      extraLabor += flow;
      migrationCost =
        K.migrationRetention * migrationCost +
        (1 - K.migrationRetention) *
          a.migrationAdjustment *
          p.immigration *
          phase;
      const nextDemand = demandStep(
        c,
        p,
        a,
        w,
        phase,
        gap,
        realRateGap,
        risk,
        fx,
        energy,
        external,
        fiscalAbsorption,
        migrationCost,
        u,
      );
      demand = nextDemand.components;
      fiscalAbsorption = nextDemand.fiscalAbsorption;
      const rawGap =
        K.gapPersistence * gap + (1 - K.gapPersistence) * nextDemand.target;
      gap = clamp(rawGap, -25, 18);
      if (gap !== rawGap)
        warnings.push(
          'Output-gap stability boundary reached. Results outside normal model scope.',
        );
      const rawInvestment =
        c.investment +
        K.investmentAccelerator * gap -
        a.investmentSensitivity * (realRateGap + risk) -
        K.corporateInvestment * p.corporateTax * phase;
      investment = (clamp(rawInvestment, 3, 55) * reference) / 100;
      if (rawInvestment < 3 || rawInvestment > 55)
        warnings.push(
          'Investment boundary reached. Results outside normal model scope.',
        );
      refCapital =
        refCapital * (1 - depreciation) +
        ((c.investment / 100) * priorReference) / 100 / 4;
      capital = capital * (1 - depreciation) + previousInvestment / 100 / 4;
      // Use actual spending at the lagged quarter, not today's larger trend GDP.
      const lagged = points[q - K.publicCapitalLag],
        trained = points[q - K.trainingLag];
      publicCapital =
        publicCapital * (1 - depreciation) +
        (lagged
          ? (((p.infrastructure * lagged.phase) / 100) *
              (1 + c.growth / 100) ** (lagged.quarter / 4)) /
            4
          : 0);
      trainingStock =
        trainingStock * K.trainingRetention +
        (p.training * (trained?.phase ?? 0) * K.trainingEfficiency) / 4;
      const laborRatio = (baselineLabor + extraLabor) / baselineLabor;
      potential =
        (100 / (1 + c.gap / 100)) *
        (1 + c.growth / 100) ** (q / 4) *
        (capital / refCapital) ** K.privateCapitalElasticity *
        laborRatio ** K.laborCapitalElasticity *
        (1 + publicCapital / refCapital) ** K.publicCapitalElasticity *
        Math.exp(trainingStock / 100) *
        Math.max(0.5, 1 + w.jobs / 100) ** K.laborCapitalElasticity;
      Y = potential * (1 + gap / 100);
      const targetU =
        structuralU - a.okun * gap - w.jobs * (1 - structuralU / 100);
      const rawU =
        K.unemploymentPersistence * u +
        (1 - K.unemploymentPersistence) * targetU;
      u = clamp(rawU, 0.5, 55);
      if (u !== rawU)
        warnings.push(
          'Employment boundary reached. Results outside normal model scope.',
        );
      const costs = {
        domestic: w.grossRaise * K.laborShare * a.passThrough,
        imported:
          ((p.tariff * phase * c.imports) / 100) * a.importPassThrough +
          ((energy * c.energyShare) / 100) * a.energyPassThrough +
          Math.log(fx / 100) * c.imports * a.importPassThrough,
      };
      const prices = priceStep(
        coreInflation,
        corePrice,
        price,
        gap,
        costs,
        c,
        a,
      );
      ({ coreInflation, corePrice, price, gdpDeflator, inflation } = prices);
      if (prices.bounded || inflation < -20 || inflation > 60)
        warnings.push(
          'Inflation stability boundary reached. This is a stress scenario, not a forecast.',
        );
      // For euro members national shocks do not control the common central bank.
      const rule = c.currencyUnion
        ? c.target + neutral
        : c.target +
          neutral +
          K.inflationRule * (coreInflation - c.target) +
          K.gapRule * gap;
      const rawRate = s.automaticRates
        ? K.ratePersistence * rate +
          (1 - K.ratePersistence) * (rule + p.rateChange * phase)
        : c.rate + p.rateChange * phase;
      rate = clamp(rawRate, -0.5, 35);
      if (rate !== rawRate)
        warnings.push(
          'Policy-rate boundary reached. Results outside normal model scope.',
        );
      const currencyRealGap =
        rate - (c.currencyUnion ? c.target : coreInflation) - neutral;
      const fxTarget =
        -a.fxSensitivity * currencyRealGap +
        (c.currencyUnion ? 0 : K.fxRiskSensitivity * risk);
      const fxLog =
        (1 - K.fxAdjustment) * Math.log(fx / 100) * 100 +
        K.fxAdjustment * fxTarget;
      fx = clamp(100 * Math.exp(fxLog / 100), 60, 170);
      if (fx === 60 || fx === 170)
        warnings.push(
          'Exchange-rate boundary reached. Results outside normal model scope.',
        );
      government =
        ((c.government + (p.spending + p.training) * phase) * reference) / 100;
      investment += (p.infrastructure * phase * reference) / 100;
      exports =
        ((c.exports * reference) / 100) *
        Math.max(
          0.35,
          1 +
            external / 100 +
            K.exportFxElasticity * Math.log(fx / 100) -
            (K.tariffRetaliation * p.tariff * phase) / 100,
        );
      imports =
        ((c.imports * Y) / 100) *
        Math.max(
          0.3,
          1 -
            K.importFxElasticity * Math.log(fx / 100) -
            (K.importTariffElasticity * p.tariff * phase) / 100,
        );
    }
    const consumption = Y - investment - government - exports + imports;
    if (consumption <= 0)
      warnings.push(
        'Implied household consumption is non-positive. This combination is outside model scope.',
      );
    const fiscal = fiscalStep(
      c,
      p,
      w,
      phase,
      Y,
      reference,
      gdpDeflator,
      u,
      government,
      imports,
      rate,
      risk,
      debtStock,
      publicAssets,
      effectiveDebtRate,
      q > 0,
    );
    ({ debtStock, publicAssets, effectiveDebtRate } = fiscal);
    const laborForce = baselineLabor + extraLabor;
    const households = householdStep(w, fiscal, laborForce, price);
    if (!households.valid)
      warnings.push(
        'Household or profit income is non-positive. This combination is outside model scope.',
      );
    const quintiles = Array.from(
      { length: 5 },
      (_, i) =>
        (mean(households.incomes.slice(i * 20, (i + 1) * 20)) /
          mean(initialIncomes.slice(i * 20, (i + 1) * 20))) *
        100,
    );
    points.push({
      quarter: q,
      year: q / 4,
      gdp: Y,
      growth: q ? ((Y / previousY) ** 4 - 1) * 100 : c.growth,
      potential,
      gap,
      inflation,
      coreInflation,
      price,
      gdpDeflator,
      rate,
      unemployment: u,
      employment: laborForce * (1 - u / 100),
      laborForce,
      debt: (debtStock / fiscal.nominalGdp) * 100,
      debtStock,
      publicAssets,
      nominalGdp: fiscal.nominalGdp,
      balance: fiscal.balance,
      primaryBalance: fiscal.primaryBalance,
      revenue: (fiscal.revenue / fiscal.nominalGdp) * 100,
      expenditure: (fiscal.expenditure / fiscal.nominalGdp) * 100,
      interest: (fiscal.interest / fiscal.nominalGdp) * 100,
      transfers: fiscal.transfers,
      householdTransfers: households.transfers,
      householdIncomeNominal: households.totalNominal,
      consumption,
      investment,
      government,
      exports,
      imports,
      netExports: ((exports - imports) / Y) * 100,
      wages: (mean(households.incomes) / mean(initialIncomes)) * 100,
      gini: households.valid ? gini(households.incomes) : 0,
      quintiles,
      fx,
      laborImpact: w.jobs,
      coverage: w.coverage,
      phase,
      demand,
      valid: warnings.length === 0,
      warnings,
    });
    previousY = Y;
    previousInvestment =
      investment - (p.infrastructure * phase * reference) / 100;
  }
  return points;
}

/** One-at-a-time variations plus joint cases, always compared with matched baselines.
 * Includes labor elasticity zero; there are no probability weights.
 */
export function sensitivityAssumptions(a: Assumptions): Assumptions[] {
  const variants: Assumptions[] = [];
  for (const spec of ASSUMPTION_CONTROLS) {
    const key = spec.key as keyof Assumptions,
      delta = Math.max(Math.abs(a[key]) * 0.3, (spec.max - spec.min) * 0.1);
    for (const direction of [-1, 1])
      variants.push({
        ...a,
        [key]: clamp(a[key] + direction * delta, spec.min, spec.max),
      });
  }
  variants.push(
    { ...a, laborElasticity: 0 },
    { ...a, laborElasticity: Math.max(0.4, a.laborElasticity) },
  );
  for (const direction of [-1, 1]) {
    const varied = { ...a };
    for (const spec of ASSUMPTION_CONTROLS) {
      const key = spec.key as keyof Assumptions;
      varied[key] = clamp(
        a[key] +
          direction *
            Math.max(Math.abs(a[key]) * 0.3, (spec.max - spec.min) * 0.1),
        spec.min,
        spec.max,
      );
    }
    variants.push(varied);
  }
  return variants;
}
export function runScenario(
  c: Country,
  p: Policies,
  a: Assumptions,
  s: Settings,
  withSensitivity = true,
) {
  const baseline = simulate(c, neutralPolicies(c), a, s),
    scenario = simulate(c, p, a, s);
  const variants = withSensitivity
    ? sensitivityAssumptions(a).map((varied) => ({
        baseline: simulate(c, neutralPolicies(c), varied, s),
        scenario: simulate(c, p, varied, s),
      }))
    : [];
  const bands = scenario.map(
    (point, q) =>
      Object.fromEntries(
        METRICS.map(({ key }) => {
          const values = [
            point[key],
            ...variants
              .filter(
                (v) =>
                  v.scenario.slice(0, q + 1).every((p) => p.valid) &&
                  v.baseline.slice(0, q + 1).every((p) => p.valid),
              )
              .map(
                (v) =>
                  baseline[q][key] + v.scenario[q][key] - v.baseline[q][key],
              ),
          ];
          return [key, [Math.min(...values), Math.max(...values)]];
        }),
      ) as Record<Metric, [number, number]>,
  );
  const invalidAt = scenario.find((p) => !p.valid)?.quarter ?? null;
  const invalidBaselineAt = baseline.find((p) => !p.valid)?.quarter ?? null;
  const excludedSensitivityCases = variants.filter(
    (v) => v.scenario.some((p) => !p.valid) || v.baseline.some((p) => !p.valid),
  ).length;
  return {
    baseline,
    scenario,
    bands,
    sensitivityCases: variants.length,
    excludedSensitivityCases,
    invalidAt,
    invalidBaselineAt,
  };
}
