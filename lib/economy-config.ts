import snapshot from '../data/world-bank-snapshot.json' with { type: 'json' };
/** MacroLab 1.0. A transparent, calibrated quarterly scenario model; not an estimated forecasting model.
 * GDP levels are in starting-year USD equivalents at a fixed exchange rate. Rates are annual percent.
 * Fiscal flows are annualized and divided by four before changing the nominal debt stock.
 */
export type Country = {
  id: string;
  name: string;
  flag: string;
  description: string;
  gdp: number;
  gdpYear: number;
  population: number;
  growth: number;
  inflation: number;
  unemployment: number;
  debt: number;
  rate: number;
  target: number;
  imports: number;
  exports: number;
  investment: number;
  government: number;
  revenue: number;
  transfers: number;
  laborForce: number;
  laborGrowth: number;
  informality: number;
  floor: number;
  dispersion: number;
  gap: number;
  neutralRate: number;
  energyShare: number;
  currencyUnion?: boolean;
};
const PRESETS = [
  {
    id: 'US',
    name: 'United States',
    flag: '🇺🇸',
    description: 'Large domestic market',
    gdp: 28750,
    gdpYear: 2024,
    population: 340,
    growth: 2,
    inflation: 2.9,
    unemployment: 4,
    debt: 121,
    rate: 4.5,
    target: 2,
    imports: 14,
    exports: 11,
    investment: 21,
    government: 17,
    revenue: 30,
    transfers: 15,
    laborForce: 50,
    laborGrowth: 0.5,
    informality: 8,
    floor: 35,
    dispersion: 0.65,
    gap: 0.5,
  },
  {
    id: 'DE',
    name: 'Germany',
    flag: '🇩🇪',
    description: 'Export-led industrial economy',
    gdp: 4685.593,
    gdpYear: 2024,
    population: 83.5,
    growth: 1.2,
    inflation: 2.5,
    unemployment: 3.5,
    debt: 63,
    rate: 3,
    target: 2,
    imports: 38,
    exports: 43,
    investment: 22,
    government: 22,
    revenue: 46,
    transfers: 25,
    laborForce: 54,
    laborGrowth: 0,
    informality: 10,
    floor: 52,
    dispersion: 0.5,
    gap: -1,
    currencyUnion: true,
  },
  {
    id: 'SE',
    name: 'Sweden',
    flag: '🇸🇪',
    description: 'Open economy · broad safety net',
    gdp: 669,
    gdpYear: 2025,
    population: 10.6,
    growth: 1.8,
    inflation: 2,
    unemployment: 8,
    debt: 34,
    rate: 2.5,
    target: 2,
    imports: 48,
    exports: 54,
    investment: 25,
    government: 26,
    revenue: 48,
    transfers: 21,
    laborForce: 56,
    laborGrowth: 0.4,
    informality: 8,
    floor: 0,
    dispersion: 0.43,
    gap: -1,
  },
  {
    id: 'JP',
    name: 'Japan',
    flag: '🇯🇵',
    description: 'Aging population · high debt',
    gdp: 4030,
    gdpYear: 2024,
    population: 124,
    growth: 0.8,
    inflation: 2.7,
    unemployment: 2.6,
    debt: 240,
    rate: 0.5,
    target: 2,
    imports: 23,
    exports: 22,
    investment: 26,
    government: 21,
    revenue: 36,
    transfers: 18,
    laborForce: 56,
    laborGrowth: -0.5,
    informality: 10,
    floor: 45,
    dispersion: 0.5,
    gap: -0.3,
  },
  {
    id: 'BR',
    name: 'Brazil',
    flag: '🇧🇷',
    description: 'Emerging market · informal work',
    gdp: 2185.822,
    gdpYear: 2024,
    population: 211,
    growth: 2.3,
    inflation: 4.4,
    unemployment: 7,
    debt: 87,
    rate: 10.5,
    target: 3,
    imports: 16,
    exports: 18,
    investment: 17,
    government: 20,
    revenue: 38,
    transfers: 20,
    laborForce: 50,
    laborGrowth: 0.7,
    informality: 40,
    floor: 55,
    dispersion: 0.9,
    gap: 0.4,
  },
  {
    id: 'IN',
    name: 'India',
    flag: '🇮🇳',
    description: 'Fast growth · young workforce',
    gdp: 3909.892,
    gdpYear: 2024,
    population: 1450,
    growth: 6,
    inflation: 4.9,
    unemployment: 4.5,
    debt: 82,
    rate: 6.5,
    target: 4,
    imports: 24,
    exports: 22,
    investment: 32,
    government: 11,
    revenue: 22,
    transfers: 13,
    laborForce: 42,
    laborGrowth: 1.2,
    informality: 80,
    floor: 25,
    dispersion: 0.85,
    gap: 0,
  },
  {
    id: 'IT',
    name: 'Italy',
    flag: '🇮🇹',
    description: 'Mature economy · limited fiscal space',
    gdp: 2380.825,
    gdpYear: 2024,
    population: 59,
    growth: 0.8,
    inflation: 1.5,
    unemployment: 6.5,
    debt: 135,
    rate: 3,
    target: 2,
    imports: 30,
    exports: 33,
    investment: 22,
    government: 20,
    revenue: 47,
    transfers: 27,
    laborForce: 44,
    laborGrowth: -0.3,
    informality: 18,
    floor: 0,
    dispersion: 0.55,
    gap: -0.5,
    currencyUnion: true,
  },
  {
    id: 'ZA',
    name: 'South Africa',
    flag: '🇿🇦',
    description: 'High unemployment · supply constraints',
    gdp: 401.145,
    gdpYear: 2024,
    population: 64,
    growth: 1.6,
    inflation: 4.4,
    unemployment: 32,
    debt: 76,
    rate: 8,
    target: 4.5,
    imports: 30,
    exports: 31,
    investment: 15,
    government: 20,
    revenue: 28,
    transfers: 10,
    laborForce: 40,
    laborGrowth: 1,
    informality: 30,
    floor: 45,
    dispersion: 1.05,
    gap: -2,
  },
];
export const DATA_SNAPSHOT = snapshot;
export const MODEL_VERSION = '2.0';
export const CALIBRATION_DATE = snapshot.retrievedAt.slice(0, 10);
const NEUTRAL_RATES: Record<string, number> = {
  US: 1,
  DE: 0.5,
  SE: 0.5,
  JP: -0.5,
  BR: 5,
  IN: 1.5,
  IT: 0.5,
  ZA: 2.5,
};
const ENERGY_SHARES: Record<string, number> = {
  US: 4,
  DE: 7,
  SE: 5,
  JP: 7,
  BR: 5,
  IN: 7,
  IT: 7,
  ZA: 6,
};
export const COUNTRIES: Country[] = PRESETS.map((c) => {
  const data =
    snapshot.countries[c.id as keyof typeof snapshot.countries].observations;
  return {
    ...c,
    gdp: data.gdp.value,
    gdpYear: data.gdp.year,
    population: data.population.value,
    inflation: data.inflation.value,
    unemployment: data.unemployment.value,
    neutralRate: NEUTRAL_RATES[c.id],
    energyShare: ENERGY_SHARES[c.id],
  };
});
export type Policies = {
  minimumWage: number;
  incomeTax: number;
  corporateTax: number;
  spending: number;
  transfers: number;
  infrastructure: number;
  rateChange: number;
  tariff: number;
  immigration: number;
  training: number;
  energyShock: number;
  worldDemand: number;
};
export type Assumptions = {
  laborElasticity: number;
  marketPower: number;
  lowMpc: number;
  highMpc: number;
  fiscalMultiplier: number;
  phillips: number;
  passThrough: number;
  investmentSensitivity: number;
  okun: number;
  neutralRate: number;
  depreciation: number;
  fxSensitivity: number;
  importPassThrough: number;
  energyPassThrough: number;
  fiscalFadeYears: number;
  migrationAdjustment: number;
};
export type Settings = {
  years: number;
  startQuarter: number;
  ramp: number;
  duration: number;
  automaticRates: boolean;
};
export const DEFAULT_ASSUMPTIONS: Assumptions = {
  laborElasticity: 0.15,
  marketPower: 0.15,
  lowMpc: 0.9,
  highMpc: 0.55,
  fiscalMultiplier: 1,
  phillips: 0.12,
  passThrough: 0.3,
  investmentSensitivity: 0.6,
  okun: 0.4,
  neutralRate: 0,
  depreciation: 5,
  fxSensitivity: 2,
  importPassThrough: 0.65,
  energyPassThrough: 0.5,
  fiscalFadeYears: 3,
  migrationAdjustment: 0.25,
};
export const DEFAULT_SETTINGS: Settings = {
  years: 10,
  startQuarter: 1,
  ramp: 4,
  duration: 0,
  automaticRates: true,
};
export const neutralPolicies = (c: Country): Policies => ({
  minimumWage: c.floor,
  incomeTax: 0,
  corporateTax: 0,
  spending: 0,
  transfers: 0,
  infrastructure: 0,
  rateChange: 0,
  tariff: 0,
  immigration: 0,
  training: 0,
  energyShock: 0,
  worldDemand: 0,
});
export type ControlSpec = {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  description: string;
};
export const POLICY_GROUPS: {
  id: string;
  name: string;
  items: ControlSpec[];
}[] = [
  {
    id: 'labor',
    name: 'Jobs & wages',
    items: [
      {
        key: 'minimumWage',
        label: 'Minimum wage',
        min: 0,
        max: 120,
        step: 1,
        unit: '% median',
        description:
          'Statutory wage floor relative to the starting median wage. Indexed to underlying nominal wages; 0 means no statutory floor. Coverage is modeled from the wage distribution and informality.',
      },
      {
        key: 'incomeTax',
        label: 'Income tax change',
        min: -10,
        max: 15,
        step: 0.5,
        unit: 'pp',
        description:
          'Change in the effective tax rate on labor income. The government budget includes the revenue effect.',
      },
      {
        key: 'immigration',
        label: 'Working-age migration',
        min: -1,
        max: 2,
        step: 0.1,
        unit: '% labor force/yr',
        description:
          'Additional workers per year as a percent of the initial labor force. Inflows add linearly; temporary adjustment costs fade after inflows stop.',
      },
      {
        key: 'training',
        label: 'Education & training',
        min: 0,
        max: 3,
        step: 0.1,
        unit: '% GDP',
        description:
          'Additional annual public spending. Productivity improves gradually, after an eight-quarter lag.',
      },
    ],
  },
  {
    id: 'fiscal',
    name: 'Tax & spending',
    items: [
      {
        key: 'spending',
        label: 'Government purchases',
        min: -5,
        max: 8,
        step: 0.1,
        unit: '% GDP',
        description:
          'Additional annual public consumption, relative to the no-policy trend GDP. Negative values are spending cuts.',
      },
      {
        key: 'transfers',
        label: 'Household transfers',
        min: -3,
        max: 6,
        step: 0.1,
        unit: '% GDP',
        description:
          'Additional annual payments, weighted toward lower earners. Financed through taxes or borrowing.',
      },
      {
        key: 'infrastructure',
        label: 'Infrastructure investment',
        min: 0,
        max: 6,
        step: 0.1,
        unit: '% GDP',
        description:
          'Additional annual public investment. Demand rises first; productive public capital becomes available after four quarters.',
      },
      {
        key: 'corporateTax',
        label: 'Corporate tax change',
        min: -10,
        max: 15,
        step: 0.5,
        unit: 'pp',
        description:
          'Change in the effective tax rate on a stylized corporate-profit base of 20% of GDP.',
      },
    ],
  },
  {
    id: 'money',
    name: 'Money & trade',
    items: [
      {
        key: 'rateChange',
        label: 'Monetary-policy bias',
        min: -5,
        max: 8,
        step: 0.25,
        unit: 'pp',
        description:
          'A shift in the central-bank rule, not a guaranteed change in the delivered rate. With automatic response off, it changes the fixed rate. For euro members this is an external ECB scenario.',
      },
      {
        key: 'tariff',
        label: 'Additional import tariff',
        min: 0,
        max: 30,
        step: 1,
        unit: 'pp',
        description:
          'A broad tariff raises import prices, reduces trade, creates revenue, and triggers assumed partial retaliation.',
      },
    ],
  },
  {
    id: 'shocks',
    name: 'External shocks',
    items: [
      {
        key: 'energyShock',
        label: 'Energy price shock',
        min: -40,
        max: 100,
        step: 5,
        unit: '%',
        description:
          'A temporary change in world energy prices. Begins at the selected start quarter and decays with a four-quarter half-life.',
      },
      {
        key: 'worldDemand',
        label: 'Foreign demand shock',
        min: -10,
        max: 10,
        step: 0.5,
        unit: '%',
        description:
          'Temporary change in demand for exports. Decays with an eight-quarter half-life.',
      },
    ],
  },
];
export const COUNTRY_CONTROLS: ControlSpec[] = [
  {
    key: 'neutralRate',
    label: 'Neutral real rate',
    min: -2,
    max: 8,
    step: 0.25,
    unit: '%',
    description:
      'Country-specific long-run real rate assumption. Japan and Brazil use research-informed anchors; other values are illustrative. Not a measured constant.',
  },
  {
    key: 'energyShare',
    label: 'Energy price exposure',
    min: 1,
    max: 15,
    step: 0.5,
    unit: '%',
    description:
      'Assumed consumer-price exposure to world energy prices, before pass-through. Country values are illustrative.',
  },
  {
    key: 'growth',
    label: 'Trend output growth',
    min: 0,
    max: 8,
    step: 0.1,
    unit: '%/yr',
    description:
      'Calibrated long-run growth in real output, including normal investment and workforce growth.',
  },
  {
    key: 'inflation',
    label: 'Starting inflation',
    min: -2,
    max: 20,
    step: 0.1,
    unit: '%',
    description:
      'Annualized starting inflation. Calibrated assumption, not a live statistical release.',
  },
  {
    key: 'unemployment',
    label: 'Starting unemployment',
    min: 1,
    max: 40,
    step: 0.1,
    unit: '%',
    description:
      'Share of the labor force without work. The model treats this as the initial structural benchmark.',
  },
  {
    key: 'debt',
    label: 'Public debt',
    min: 0,
    max: 280,
    step: 1,
    unit: '% GDP',
    description:
      'Starting gross government debt. Calibrated general-government-style assumption; not World Bank central-government debt.',
  },
  {
    key: 'rate',
    label: 'Starting policy rate',
    min: -0.5,
    max: 20,
    step: 0.25,
    unit: '%',
    description:
      'Starting annual nominal interest rate; the existing debt stock reprices gradually.',
  },
  {
    key: 'target',
    label: 'Inflation target',
    min: 0,
    max: 8,
    step: 0.25,
    unit: '%',
    description:
      'Long-run inflation anchor and target for automatic monetary policy.',
  },
  {
    key: 'imports',
    label: 'Import dependence',
    min: 5,
    max: 60,
    step: 1,
    unit: '% GDP',
    description:
      'Initial import share. More imports mean more demand leaks abroad.',
  },
  {
    key: 'exports',
    label: 'Exports',
    min: 5,
    max: 60,
    step: 1,
    unit: '% GDP',
    description:
      'Initial export share. A higher share raises exposure to foreign demand and exchange rates.',
  },
  {
    key: 'investment',
    label: 'Private investment',
    min: 10,
    max: 40,
    step: 1,
    unit: '% GDP',
    description:
      'Initial real private investment share. Capital depreciates and adjusts over time.',
  },
  {
    key: 'government',
    label: 'Government purchases',
    min: 8,
    max: 35,
    step: 1,
    unit: '% GDP',
    description:
      'Initial government consumption share, excluding transfers and debt service.',
  },
  {
    key: 'revenue',
    label: 'Public revenue',
    min: 15,
    max: 55,
    step: 1,
    unit: '% GDP',
    description:
      'Effective total public revenue relative to nominal output before policy changes.',
  },
  {
    key: 'transfers',
    label: 'Existing transfers',
    min: 5,
    max: 30,
    step: 1,
    unit: '% GDP',
    description:
      'Initial annual social transfers. Kept separate from government purchases in GDP.',
  },
  {
    key: 'informality',
    label: 'Informal employment',
    min: 0,
    max: 90,
    step: 1,
    unit: '%',
    description:
      'Share of workers assumed outside statutory minimum-wage enforcement.',
  },
  {
    key: 'laborGrowth',
    label: 'Workforce growth',
    min: -1.5,
    max: 2.5,
    step: 0.1,
    unit: '%/yr',
    description:
      'Baseline labor-force growth. Normal growth is already embedded in trend output; changes affect the decomposition.',
  },
  {
    key: 'dispersion',
    label: 'Wage dispersion',
    min: 0.3,
    max: 1.2,
    step: 0.05,
    unit: 'σ',
    description:
      'Log wage dispersion in a synthetic 100-group labor market; not an observed national income distribution.',
  },
  {
    key: 'gap',
    label: 'Spare capacity / overheating',
    min: -8,
    max: 5,
    step: 0.25,
    unit: '% output gap',
    description:
      'Negative values mean spare capacity; positive values mean output is above sustainable capacity.',
  },
];
export const ASSUMPTION_CONTROLS: ControlSpec[] = [
  {
    key: 'fxSensitivity',
    label: 'Exchange-rate response',
    min: 0.5,
    max: 4,
    step: 0.25,
    unit: '%/pp',
    description:
      'Currency depreciation per point of lower real interest rates. A reduced-form assumption, not an exchange-rate forecast.',
  },
  {
    key: 'importPassThrough',
    label: 'Import-price pass-through',
    min: 0.2,
    max: 1,
    step: 0.05,
    unit: 'share',
    description:
      'Share of tariff and exchange-rate import-cost changes reaching consumer prices.',
  },
  {
    key: 'energyPassThrough',
    label: 'Energy-price pass-through',
    min: 0.1,
    max: 1,
    step: 0.05,
    unit: 'share',
    description:
      'Share of world energy price changes reaching the exposed part of the consumer basket.',
  },
  {
    key: 'fiscalFadeYears',
    label: 'Demand adjustment time',
    min: 1,
    max: 8,
    step: 0.5,
    unit: 'years',
    description:
      'Half-life of fiscal and wage-redistribution demand effects as private demand adjusts. Productive infrastructure and training stocks remain.',
  },
  {
    key: 'migrationAdjustment',
    label: 'Migration adjustment cost',
    min: 0,
    max: 0.6,
    step: 0.05,
    unit: 'coefficient',
    description:
      'Temporary demand adjustment per point of new worker inflow. The cost fades after inflows stop.',
  },
  {
    key: 'laborElasticity',
    label: 'Hiring sensitivity to wage costs',
    min: 0,
    max: 1,
    step: 0.05,
    unit: 'elasticity',
    description:
      'A 1% wage rise for affected workers changes their employment by approximately minus this percent before market-power offsets.',
  },
  {
    key: 'marketPower',
    label: 'Employer market-power offset',
    min: 0,
    max: 0.6,
    step: 0.05,
    unit: 'coefficient',
    description:
      'Allows modest wage floors to improve retention and hiring. This benefit fades for high wage floors.',
  },
  {
    key: 'lowMpc',
    label: 'Lower-income spending response',
    min: 0.5,
    max: 0.98,
    step: 0.02,
    unit: 'MPC',
    description: 'Share of additional income spent by lower earners.',
  },
  {
    key: 'highMpc',
    label: 'Higher-income spending response',
    min: 0.2,
    max: 0.85,
    step: 0.05,
    unit: 'MPC',
    description: 'Share of additional income spent by higher earners.',
  },
  {
    key: 'fiscalMultiplier',
    label: 'Fiscal demand strength',
    min: 0.3,
    max: 2,
    step: 0.1,
    unit: 'multiplier',
    description:
      'Base spending multiplier; adjusted for import leakage, spare capacity, and household spending.',
  },
  {
    key: 'phillips',
    label: 'Inflation response to demand',
    min: 0.03,
    max: 0.3,
    step: 0.01,
    unit: 'coefficient',
    description:
      'Annualized inflation response to a one-point output gap per quarterly step.',
  },
  {
    key: 'passThrough',
    label: 'Cost-to-price pass-through',
    min: 0.1,
    max: 0.8,
    step: 0.05,
    unit: 'share',
    description:
      'Share of labor-cost changes passed into prices; remaining incidence falls on firms.',
  },
  {
    key: 'investmentSensitivity',
    label: 'Investment response to rates',
    min: 0.1,
    max: 1.5,
    step: 0.1,
    unit: 'coefficient',
    description:
      'Private investment sensitivity to the real borrowing-rate gap.',
  },
  {
    key: 'okun',
    label: 'Jobs response to output',
    min: 0.15,
    max: 0.7,
    step: 0.05,
    unit: 'coefficient',
    description:
      'Unemployment-point change associated with a one-point output gap.',
  },
  {
    key: 'neutralRate',
    label: 'Neutral-rate uncertainty',
    min: -3,
    max: 3,
    step: 0.25,
    unit: 'pp',
    description:
      'Adjustment to the country-specific neutral real rate. Applies to both scenario and baseline.',
  },
  {
    key: 'depreciation',
    label: 'Capital depreciation',
    min: 2,
    max: 10,
    step: 0.5,
    unit: '%/yr',
    description: 'Annual wear on private and public capital stocks.',
  },
];
export type Metric =
  | 'gdp'
  | 'unemployment'
  | 'inflation'
  | 'debt'
  | 'wages'
  | 'employment'
  | 'balance'
  | 'fx'
  | 'rate';
export const METRICS: {
  key: Metric;
  name: string;
  unit: string;
  description: string;
}[] = [
  {
    key: 'gdp',
    name: 'Real GDP',
    unit: 'index',
    description: 'Output volume · starting economy = 100',
  },
  {
    key: 'unemployment',
    name: 'Unemployment',
    unit: '%',
    description: 'Share of the labor force without work',
  },
  {
    key: 'inflation',
    name: 'Inflation',
    unit: '%',
    description: 'Annualized quarterly price change',
  },
  {
    key: 'debt',
    name: 'Public debt',
    unit: '% GDP',
    description: 'Gross debt / annualized nominal GDP',
  },
  {
    key: 'wages',
    name: 'Real household income',
    unit: 'index',
    description:
      'Real disposable income per labor-force member · synthetic distribution · start = 100',
  },
  {
    key: 'employment',
    name: 'Employment',
    unit: 'million',
    description: 'Number of employed workers',
  },
  {
    key: 'balance',
    name: 'Budget balance',
    unit: '% GDP',
    description: 'Public revenue minus total expenditure',
  },
  {
    key: 'rate',
    name: 'Policy interest rate',
    unit: '%',
    description: 'Annual nominal central-bank rate',
  },
  {
    key: 'fx',
    name: 'Exchange rate',
    unit: 'index',
    description: 'Starting currency = 100 · higher means depreciation',
  },
];

// Structural constants are explicit hypotheses, not econometric estimates.
export const COEFFICIENTS = {
  monopsonyGainLimit: 0.15,
  monopsonyFloorCutoff: 0.9,
  fiscalMpcReference: 0.8,
  fiscalMpcSensitivity: 0.5,
  laborTaxLowMpcWeight: 0.65,
  energyDemandWeight: 0.3,
  initialDebtPolicyRateWeight: 0.6,
  laborShare: 0.55,
  corporateProfitShare: 0.2,
  revenueFromLabor: 0.45,
  revenueFromProfit: 0.15,
  transferTilt: 0.6,
  capitalIncomeConcentration: 1.4,
  gapPersistence: 0.74,
  inflationPersistence: 0.86,
  ratePersistence: 0.8,
  unemploymentPersistence: 0.65,
  debtRatePersistence: 0.96,
  rateDemand: 0.45,
  investmentAccelerator: 0.7,
  corporateInvestment: 0.15,
  wageDemandWeight: 0.7,
  foreignDemandElasticity: 0.8,
  tradeDemandElasticity: 0.25,
  tariffDemand: 0.22,
  tariffRetaliation: 0.25,
  exportFxElasticity: 0.7,
  importFxElasticity: 0.5,
  importTariffElasticity: 0.6,
  importLeakageScale: 125,
  spareCapacityMultiplier: 0.04,
  laborCapitalElasticity: 0.68,
  privateCapitalElasticity: 0.32,
  publicCapitalElasticity: 0.2,
  trainingEfficiency: 0.035,
  trainingRetention: 0.995,
  automaticTransfers: 0.45,
  debtRisk: 0.012,
  fxRiskSensitivity: 2,
  fxAdjustment: 0.2,
  migrationRetention: 0.75,
  inflationRule: 1.5,
  gapRule: 0.5,
  publicCapitalLag: 4,
  trainingLag: 8,
  energyHalfLife: 4,
  foreignDemandHalfLife: 8,
};
export const COEFFICIENT_LABELS: Record<keyof typeof COEFFICIENTS, string> = {
  monopsonyGainLimit: 'Maximum log-wage rise receiving a monopsony offset',
  monopsonyFloorCutoff: 'Wage-floor ratio where the monopsony offset ends',
  fiscalMpcReference: 'Reference propensity to consume for fiscal transmission',
  fiscalMpcSensitivity: 'Fiscal multiplier response to consumption propensity',
  laborTaxLowMpcWeight: 'Labor-tax share assigned the lower-income propensity',
  energyDemandWeight: 'Energy-cost demand coefficient',
  initialDebtPolicyRateWeight: 'Initial debt-rate weight on the policy rate',
  laborShare: 'Initial labor share of income',
  corporateProfitShare: 'Corporate taxable profit share',
  revenueFromLabor: 'Revenue share from labor taxes',
  revenueFromProfit: 'Revenue share from profit taxes',
  transferTilt: 'Transfer distribution tilt',
  capitalIncomeConcentration: 'Capital-income concentration',
  gapPersistence: 'Quarterly output-gap persistence',
  inflationPersistence: 'Quarterly core-inflation persistence',
  ratePersistence: 'Quarterly policy-rate persistence',
  unemploymentPersistence: 'Quarterly unemployment persistence',
  debtRatePersistence: 'Quarterly debt-rate persistence',
  rateDemand: 'Demand response per real-rate point',
  investmentAccelerator: 'Investment response per output-gap point',
  corporateInvestment: 'Investment response per corporate-tax point',
  wageDemandWeight: 'Wage redistribution demand weight',
  foreignDemandElasticity: 'Foreign-demand export elasticity',
  tradeDemandElasticity: 'Exchange-rate trade-demand elasticity',
  tariffDemand: 'Tariff demand cost',
  tariffRetaliation: 'Assumed export retaliation',
  exportFxElasticity: 'Export exchange-rate elasticity',
  importFxElasticity: 'Import exchange-rate elasticity',
  importTariffElasticity: 'Import tariff elasticity',
  importLeakageScale: 'Import-leakage scaling',
  spareCapacityMultiplier: 'Multiplier increase per spare-capacity point',
  laborCapitalElasticity: 'Labor elasticity of potential output',
  privateCapitalElasticity: 'Private-capital elasticity of output',
  publicCapitalElasticity: 'Public-capital elasticity of output',
  trainingEfficiency: 'Training productivity coefficient',
  trainingRetention: 'Quarterly training-stock retention',
  automaticTransfers: 'Benefit spending per unemployment point',
  debtRisk: 'Borrowing-risk increase per extra debt point',
  fxRiskSensitivity: 'Currency response per borrowing-risk point',
  fxAdjustment: 'Quarterly currency adjustment',
  migrationRetention: 'Quarterly migration-cost retention',
  inflationRule: 'Policy-rate response to core inflation',
  gapRule: 'Policy-rate response to output gap',
  publicCapitalLag: 'Infrastructure delay in quarters',
  trainingLag: 'Training delay in quarters',
  energyHalfLife: 'Energy-shock half-life in quarters',
  foreignDemandHalfLife: 'Foreign-demand half-life in quarters',
};
export const SOURCES = [
  {
    title: 'World Bank: archived country observations',
    url: 'https://data.worldbank.org/',
    note: 'GDP and population anchors, CPI inflation and ILO-modeled unemployment were read from public country cards. Each observation has its own year, indicator, URL and displayed precision in the exported snapshot. Other inputs remain assumptions.',
  },
  {
    title: 'IMF: Inflation-Forecast Targeting for India (WP/17/32)',
    url: 'https://www.imf.org/-/media/files/publications/wp/wp1732.pdf',
    note: 'Conceptual inspiration for demand, inflation and monetary transmission. The app is not this model and its coefficients are not estimated from the paper.',
  },
  {
    title: 'IMF: A Simple Method to Compute Fiscal Multipliers (WP/14/93)',
    url: 'https://www.imf.org/en/publications/wp/issues/2016/12/31/a-simple-method-to-compute-fiscal-multipliers-41627',
    note: 'Evidence that fiscal multipliers depend on country structure and economic conditions. The app uses explicit illustrative assumptions.',
  },
  {
    title: 'Dube: Impacts of minimum wages, international evidence (2019)',
    url: 'https://www.gov.uk/government/publications/impacts-of-minimum-wages-review-of-the-international-evidence',
    note: 'Evidence for uncertain, often small employment effects. A 0.15 central hiring sensitivity is illustrative; sensitivity cases include zero and stronger responses, not an estimated confidence interval.',
  },
  {
    title: 'Nobel Prize: Understanding labour markets (2021)',
    url: 'https://www.nobelprize.org/uploads/2021/10/popular-economicsciencesprize2021-3.pdf',
    note: 'Why minimum-wage employment effects cannot be assumed to have one universal sign.',
  },
  {
    title: 'IMF: Brazil, 2026 Article IV',
    url: 'https://www.elibrary.imf.org/view/journals/002/2026/191/article-A001-en.xml',
    note: 'A 5% neutral real rate is a research-informed Brazil anchor. It remains uncertain and editable.',
  },
  {
    title: 'IMF: Japan, 2026 Article IV',
    url: 'https://www.elibrary.imf.org/view/journals/002/2026/075/article-A001-en.xml',
    note: 'Published Japanese neutral-rate estimates span negative and positive values. The app uses an illustrative −0.5% anchor within the discussed range.',
  },
  {
    title: 'ECB: Why inflation differs across countries',
    url: 'https://data.ecb.europa.eu/blog/blog-posts/why-inflation-differs-across-countries',
    note: 'The ECB targets the whole euro area. National fiscal shocks in the Italy and Germany presets do not independently set ECB rates or the euro exchange rate.',
  },
];
