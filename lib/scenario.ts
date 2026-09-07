import {
  COUNTRIES,
  DEFAULT_ASSUMPTIONS,
  DEFAULT_SETTINGS,
  MODEL_VERSION,
  neutralPolicies,
  validateConfiguration,
} from './economy.ts';
import type { Country, Policies, Assumptions, Settings } from './economy.ts';
export const SCENARIO_STORAGE_KEY = 'macrolab.scenario.v2';
export type ScenarioConfig = {
  country: Country;
  policies: Policies;
  assumptions: Assumptions;
  settings: Settings;
  quarter: number;
};
export function initialScenario(countryId = 'US'): ScenarioConfig {
  const country = {
    ...(COUNTRIES.find((c) => c.id === countryId) ?? COUNTRIES[0]),
  };
  return {
    country,
    policies: neutralPolicies(country),
    assumptions: { ...DEFAULT_ASSUMPTIONS },
    settings: { ...DEFAULT_SETTINGS },
    quarter: 20,
  };
}
const record = (value: unknown): Record<string, unknown> => {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new Error('Invalid scenario file.');
  return value as Record<string, unknown>;
};
export function parseScenario(input: unknown): {
  config: ScenarioConfig;
  migrated: boolean;
} {
  const raw = record(input),
    country = record(raw.country);
  const preset = COUNTRIES.find((c) => c.id === country.id);
  if (!preset) throw new Error('Unknown country');
  const legacy = raw.model === 'MacroLab 1.0';
  if (!legacy && raw.model !== `MacroLab ${MODEL_VERSION}`)
    throw new Error('Unsupported scenario version.');
  const start = initialScenario(preset.id);
  const pick = <T extends object>(defaults: T, unknown: unknown): T => {
    const data = record(unknown);
    const result = { ...defaults };
    for (const key of Object.keys(defaults) as (keyof T)[])
      if (Object.hasOwn(data, key))
        result[key] = data[key as string] as T[keyof T];
    return result;
  };
  const config: ScenarioConfig = {
    country: pick(start.country, country),
    policies: pick(start.policies, raw.policies),
    assumptions: pick(start.assumptions, raw.assumptions),
    settings: pick(start.settings, raw.settings),
    quarter: typeof raw.quarter === 'number' ? raw.quarter : 20,
  };
  // Names and institutional membership belong to the preset, not uploaded text.
  config.country.name = preset.name;
  config.country.flag = preset.flag;
  config.country.description = preset.description;
  config.country.currencyUnion = preset.currencyUnion;
  if (legacy) {
    config.country.neutralRate = Number(record(raw.assumptions).neutralRate);
    config.assumptions.neutralRate = 0;
  }
  validateConfiguration(
    config.country,
    config.policies,
    config.assumptions,
    config.settings,
  );
  if (!Number.isInteger(config.quarter) || config.quarter < 0)
    throw new Error('Invalid simulation timing or monetary setting.');
  config.quarter = Math.min(config.quarter, config.settings.years * 4);
  return { config, migrated: legacy };
}
export function serializeScenario(config: ScenarioConfig) {
  return { model: `MacroLab ${MODEL_VERSION}`, ...config };
}
export function encodeScenario(config: ScenarioConfig) {
  const bytes = new TextEncoder().encode(
    JSON.stringify(serializeScenario(config)),
  );
  return btoa(String.fromCharCode(...bytes))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');
}
export function decodeScenario(value: string) {
  if (value.length > 20000) throw new Error('Invalid scenario file.');
  const base64 = value.replaceAll('-', '+').replaceAll('_', '/');
  const decoded = atob(base64);
  return parseScenario(
    JSON.parse(
      new TextDecoder().decode(
        Uint8Array.from(decoded, (c) => c.charCodeAt(0)),
      ),
    ),
  );
}
