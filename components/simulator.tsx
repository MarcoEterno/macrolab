'use client';
import { Chart, DemandBreakdown } from '@/components/economy-chart';
import { Methodology } from '@/components/methodology';
import { DATA_SNAPSHOT, MODEL_VERSION } from '@/lib/economy';
import {
  initialScenario,
  parseScenario,
  serializeScenario,
  encodeScenario,
  decodeScenario,
  SCENARIO_STORAGE_KEY,
} from '@/lib/scenario';
import type { ScenarioConfig } from '@/lib/scenario';

import {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
  useId,
} from 'react';
import { flushSync } from 'react-dom';
import Link from 'next/link';
import {
  Activity,
  ArrowDownToLine,
  ArrowUpRight,
  BookOpen,
  ChevronDown,
  Globe2,
  RotateCcw,
  SlidersHorizontal,
  Play,
  Pause,
  Info,
  TrendingUp,
  Users,
  Landmark,
  ArrowRight,
  Settings2,
  ChartNoAxesCombined,
  TriangleAlert,
  X,
  Languages,
  Moon,
  Sun,
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  COUNTRIES,
  POLICY_GROUPS,
  COUNTRY_CONTROLS,
  ASSUMPTION_CONTROLS,
  DEFAULT_ASSUMPTIONS,
  METRICS,
  SOURCES,
  neutralPolicies,
  runScenario,
  validateConfiguration,
  clamp,
} from '@/lib/economy';
import { I18nProvider, useI18n } from '@/lib/i18n';
import {
  LANGUAGE_STORAGE_KEY,
  isLanguage,
  defaultCountryId,
} from '@/lib/locale';
import type { Language } from '@/lib/locale';
import type {
  Country,
  Policies,
  Assumptions,
  Settings,
  ControlSpec,
  Metric,
  Point,
} from '@/lib/economy';

const percentChange = (v: number, b: number) => (v / b - 1) * 100;
const scalar = (v: number | readonly number[]) =>
  typeof v === 'number' ? v : v[0];
type Result = ReturnType<typeof runScenario>;

function Picker({
  value,
  onChange,
  options,
  label,
  className = '',
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  label: string;
  className?: string;
}) {
  return (
    <Select
      value={value}
      onValueChange={(v) => {
        if (v !== null) onChange(String(v));
      }}
      items={options}
    >
      <SelectTrigger aria-label={label} className={className}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem value={o.value} key={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
function Control({
  spec,
  value,
  onChange,
  base,
}: {
  spec: ControlSpec;
  value: number;
  onChange: (value: number) => void;
  base?: number;
}) {
  const { t, locale, number } = useI18n();
  const controlId = useId();
  const changed = base !== undefined && Math.abs(value - base) > 0.001;
  const [draft, setDraft] = useState(String(value));
  const cancelEdit = useRef(false);
  const [lastValue, setLastValue] = useState(value);
  if (lastValue !== value) {
    setLastValue(value);
    setDraft(String(value));
  }
  const commit = () => {
    const parsed = Number(draft.replace(',', '.'));
    if (draft.trim() !== '' && Number.isFinite(parsed)) {
      const next = Number(
        clamp(
          Math.round(parsed / spec.step) * spec.step,
          spec.min,
          spec.max,
        ).toFixed(6),
      );
      setDraft(String(next));
      onChange(next);
    } else setDraft(String(value));
  };
  return (
    <div className={`control ${changed ? 'changed' : ''}`}>
      <div className="control-label">
        <div className="label-with-help">
          <label id={controlId} htmlFor={`${controlId}-number`}>
            {t(spec.label)}
          </label>
          <Tooltip>
            <TooltipTrigger
              aria-label={t('About {label}', { label: t(spec.label) })}
              className="help-icon"
            >
              <Info size={13} />
            </TooltipTrigger>
            <TooltipContent side="right" className="help-content">
              {t(spec.description)}
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="numeric-control">
          <input
            id={`${controlId}-number`}
            inputMode="decimal"
            value={draft}
            aria-label={t('Set {label}', { label: t(spec.label) })}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={() => {
              if (cancelEdit.current) cancelEdit.current = false;
              else commit();
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.currentTarget.blur();
              }
              if (event.key === 'Escape') {
                cancelEdit.current = true;
                setDraft(String(value));
                event.currentTarget.blur();
              }
            }}
          />
          <span>{t(spec.unit)}</span>
        </div>
      </div>
      <Slider
        locale={locale}
        value={[value]}
        min={spec.min}
        max={spec.max}
        step={spec.step}
        onValueChange={(v) => onChange(scalar(v))}
        aria-labelledby={controlId}
      />
      <div className="range-labels">
        <span>
          {number(spec.min, Number.isInteger(spec.min) ? 0 : 2)}
          {spec.unit === '%' ? '%' : ''}
        </span>
        {changed && (
          <span className="base-value">
            {t('Base')} {number(base!, spec.step < 1 ? 1 : 0)}
          </span>
        )}
        <span>
          {number(spec.max, Number.isInteger(spec.max) ? 0 : 2)}
          {spec.unit === '%' ? '%' : ''}
        </span>
      </div>
    </div>
  );
}
function Distribution({ point, base }: { point: Point; base: Point }) {
  const { t, number, signed } = useI18n();
  const values = point.quintiles.map((v, i) =>
    percentChange(v, base.quintiles[i]),
  );
  const max = Math.max(1, ...values.map(Math.abs));
  return (
    <div className="distribution">
      <div className="section-intro">
        <h3>{t('Who feels the change?')}</h3>
        <p>
          {t(
            'Real disposable income vs. no new policy, by starting wage group.',
          )}
        </p>
      </div>
      <div className="income-bars">
        {values.map((v, i) => (
          <div className="income-row" key={i}>
            <span>
              {
                [
                  t('Lowest 20%'),
                  t('Lower middle'),
                  t('Middle 20%'),
                  t('Upper middle'),
                  t('Highest 20%'),
                ][i]
              }
            </span>
            <div className="income-track">
              <span className="zero-line" />
              <i
                style={{
                  left: v < 0 ? `${50 - (Math.abs(v) / max) * 48}%` : '50%',
                  width: `${(Math.abs(v) / max) * 48}%`,
                  background:
                    v < 0 ? 'var(--chart-negative)' : 'var(--chart-policy)',
                }}
              />
            </div>
            <strong className={v < 0 ? 'negative' : 'positive'}>
              {signed(v)}%
            </strong>
          </div>
        ))}
      </div>
      <div className="distribution-foot">
        <div>
          <small>{t('MODELED INCOME DISPERSION')}</small>
          <strong>
            {number(point.gini)}{' '}
            <span>
              {signed(point.gini - base.gini)} {t('points vs. baseline')}
            </span>
          </strong>
        </div>
        <div>
          <small>{t('WORKERS AFFECTED BY HIGHER FLOOR')}</small>
          <strong>
            {number(point.coverage)}% <span>{t('of starting workers')}</span>
          </strong>
        </div>
      </div>
      <p className="footnote">
        {t(
          '100 synthetic wage groups, summarized into quintiles. Includes expected employment losses, transfers, taxes, and a stylized capital-income component. This is not a survey-based poverty or national Gini estimate.',
        )}
      </p>
    </div>
  );
}
function Balance({ point, base }: { point: Point; base: Point }) {
  const { t, number, signed } = useI18n();
  return (
    <div className="balance-view">
      <div className="section-intro">
        <h3>{t('The public balance sheet')}</h3>
        <p>{t('Annualized flows as a share of current nominal GDP.')}</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('Public finances')}</TableHead>
            <TableHead>{t('Scenario')}</TableHead>
            <TableHead>{t('No new policy')}</TableHead>
            <TableHead>{t('Change')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(
            [
              [t('Public revenue'), 'revenue'],
              [t('Total expenditure'), 'expenditure'],
              [t('Interest payments'), 'interest'],
              [t('Primary balance'), 'primaryBalance'],
              [t('Overall balance'), 'balance'],
              [t('Public debt'), 'debt'],
            ] as const
          ).map(([name, key]) => (
            <TableRow key={key}>
              <TableCell>{t(name)}</TableCell>
              <TableCell>{number(point[key])}%</TableCell>
              <TableCell>{number(base[key])}%</TableCell>
              <TableCell>
                {signed(point[key] - base[key])} {t('pp')}
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell>{t('Public financial assets')}</TableCell>
            <TableCell>
              {number((point.publicAssets / point.nominalGdp) * 100)}%
            </TableCell>
            <TableCell>
              {number((base.publicAssets / base.nominalGdp) * 100)}%
            </TableCell>
            <TableCell>
              {signed(
                (point.publicAssets / point.nominalGdp) * 100 -
                  (base.publicAssets / base.nominalGdp) * 100,
              )}{' '}
              {t('pp')}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div className="accounting-note">
        <Landmark size={18} />
        <p>
          {t(
            'Borrowing adds to the debt stock every quarter. Growth and inflation also change the GDP denominator. Transfers count in the budget, but do not count directly as GDP.',
          )}
        </p>
      </div>
    </div>
  );
}
function Simulator({
  onLanguageChange,
  initial,
  initialNotice = '',
  initialDark = false,
}: {
  onLanguageChange: (language: Language) => void;
  initial: ScenarioConfig;
  initialNotice?: string;
  initialDark?: boolean;
}) {
  const { t, language, number, signed, period, gdpLabel } = useI18n();
  const [dark, setDark] = useState(initialDark);
  const [country, setCountry] = useState<Country>(initial.country);
  const [policies, setPolicies] = useState<Policies>(initial.policies);
  const [assumptions, setAssumptions] = useState<Assumptions>(
    initial.assumptions,
  );
  const [settings, setSettings] = useState<Settings>(initial.settings);
  const [backup, setBackup] = useState<ScenarioConfig | null>(null);
  const [difference, setDifference] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const importRef = useRef<HTMLInputElement>(null);
  const [metric, setMetric] = useState<Metric>('gdp');
  const [quarter, setQuarter] = useState(initial.quarter);
  const [playing, setPlaying] = useState(false);
  const [showBand, setShowBand] = useState(true);
  const [modelOpen, setModelOpen] = useState(false);
  const [assumptionsOpen, setAssumptionsOpen] = useState(false);
  const [notice, setNotice] = useState(initialNotice);
  const preset = COUNTRIES.find((c) => c.id === country.id)!;
  const neutral = useMemo(() => neutralPolicies(country), [country]);
  const changed = Object.entries(policies).filter(
    ([key, val]) => Math.abs(val - neutral[key as keyof Policies]) > 0.001,
  );
  const custom = JSON.stringify(country) !== JSON.stringify(preset);
  const computation = useMemo(() => {
    try {
      return {
        result: runScenario(country, policies, assumptions, settings, false),
        error: null,
      };
    } catch (e) {
      return {
        result: null,
        error: e instanceof Error ? e.message : String(e),
      };
    }
  }, [country, policies, assumptions, settings]);
  const configurationKey = JSON.stringify({
    country,
    policies,
    assumptions,
    settings,
  });
  const [sensitivity, setSensitivity] = useState<{
    key: string;
    result: Result;
  } | null>(null);
  useEffect(() => {
    if (
      computation.error ||
      computation.result?.invalidAt !== null ||
      computation.result?.invalidBaselineAt !== null
    )
      return;
    const timer = window.setTimeout(() => {
      try {
        setSensitivity({
          key: configurationKey,
          result: runScenario(country, policies, assumptions, settings),
        });
      } catch {
        /* Central validation provides the actionable error. */
      }
    }, 180);
    return () => clearTimeout(timer);
  }, [configurationKey, country, policies, assumptions, settings, computation]);
  const result =
    sensitivity?.key === configurationKey
      ? sensitivity.result
      : computation.result;
  const calculatingSensitivity =
    !!result && sensitivity?.key !== configurationKey;

  const point = result?.scenario[quarter],
    base = result?.baseline[quarter];
  const metricInfo = METRICS.find((m) => m.key === metric)!;
  const chooseCountry = useCallback((id: string) => {
    const next = COUNTRIES.find((c) => c.id === id);
    if (!next) throw new Error('Unknown country');
    setCountry({ ...next });
    setPolicies(neutralPolicies(next));
    setPlaying(false);
    setNotice('Country loaded. Policies reset to its starting conditions.');
  }, []);
  const snapshot = useMemo(
    () => ({ country, policies, assumptions, settings, quarter }),
    [country, policies, assumptions, settings, quarter],
  );
  const remember = () => setBackup(snapshot);
  const restore = (config: ScenarioConfig) => {
    setCountry(config.country);
    setPolicies(config.policies);
    setAssumptions(config.assumptions);
    setSettings(config.settings);
    setQuarter(config.quarter);
    setPlaying(false);
  };
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(
          SCENARIO_STORAGE_KEY,
          JSON.stringify(serializeScenario(snapshot)),
        );
      } catch {
        setStorageAvailable(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [snapshot]);
  const importScenario = async (file: File) => {
    try {
      if (file.size > 2000000) throw new Error('Invalid scenario file.');
      const { config, migrated } = parseScenario(JSON.parse(await file.text()));
      remember();
      restore(config);
      setNotice(
        migrated
          ? 'Previous-version settings imported. Results use the revised model.'
          : 'Scenario restored.',
      );
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : 'Invalid scenario file.',
      );
    } finally {
      if (importRef.current) importRef.current.value = '';
    }
  };
  const shareScenario = async () => {
    const url = new URL(window.location.href);
    url.hash = 'scenario=' + encodeScenario(snapshot);
    try {
      await navigator.clipboard.writeText(url.href);
      setNotice('Scenario link copied.');
    } catch {
      window.history.replaceState(null, '', url);
      setNotice('Scenario link is ready in the address bar.');
    }
  };
  const updatePolicy = (key: string, value: number) => {
    setPolicies((p) => ({ ...p, [key]: value }));
    setNotice('');
  };
  const selectQuarter = (q: number) => {
    setQuarter(q);
    setPlaying(false);
  };
  const selectYears = (v: string) => {
    const years = Number(v);
    setSettings((s) => ({ ...s, years }));
    setQuarter((q) => Math.min(q, years * 4));
    setPlaying(false);
  };
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(
      () =>
        setQuarter((q) => {
          if (q >= settings.years * 4) {
            setPlaying(false);
            return q;
          }
          return q + 1;
        }),
      500,
    );
    return () => clearInterval(id);
  }, [playing, settings.years]);
  const configRef = useRef({
    country,
    policies,
    assumptions,
    settings,
    quarter,
  });
  useEffect(() => {
    configRef.current = { country, policies, assumptions, settings, quarter };
  }, [country, policies, assumptions, settings, quarter]);
  useEffect(() => {
    type Registry = {
      registerTool: (
        tool: Record<string, unknown>,
        options: { signal: AbortSignal },
      ) => void | Promise<void>;
    };
    const context = (document as Document & { modelContext?: Registry })
      .modelContext;
    if (!context?.registerTool) return;
    const controller = new AbortController();
    const register = (tool: Record<string, unknown>) => {
      try {
        void Promise.resolve(
          context.registerTool(tool, { signal: controller.signal }),
        ).catch(() => {});
      } catch {
        /* Optional browser capability; simulator works without it. */
      }
    };
    register({
      name: 'read_economy_scenario',
      description:
        'Read current country, policy settings, assumptions, and selected-quarter outcomes.',
      inputSchema: {
        type: 'object',
        properties: {},
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true },
      execute: () => {
        const cfg = configRef.current;
        const r = runScenario(
          cfg.country,
          cfg.policies,
          cfg.assumptions,
          cfg.settings,
          false,
        );
        return {
          ...cfg,
          scenario: r.scenario[cfg.quarter],
          baseline: r.baseline[cfg.quarter],
          invalidAt: r.invalidAt,
          invalidBaselineAt: r.invalidBaselineAt,
        };
      },
    });
    register({
      name: 'configure_economy_scenario',
      description:
        'Set a country preset and/or a batch of policy sliders, simulate, and update the visible results. Selecting a country resets policies before applying the provided policy changes.',
      inputSchema: {
        type: 'object',
        properties: {
          countryId: { type: 'string', enum: COUNTRIES.map((c) => c.id) },
          policies: {
            type: 'object',
            properties: Object.fromEntries(
              POLICY_GROUPS.flatMap((g) => g.items).map((s) => [
                s.key,
                { type: 'number', minimum: s.min, maximum: s.max },
              ]),
            ),
            additionalProperties: false,
          },
        },
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false },
      execute: (input: unknown) => {
        if (!input || typeof input !== 'object' || Array.isArray(input))
          throw new Error('Expected an object');
        const obj = input as Record<string, unknown>;
        if (
          Object.keys(obj).some((k) => !['countryId', 'policies'].includes(k))
        )
          throw new Error('Unknown configuration field');
        const cfg = configRef.current;
        let nextCountry = cfg.country;
        if (obj.countryId !== undefined) {
          const found = COUNTRIES.find((c) => c.id === obj.countryId);
          if (!found) throw new Error('Unknown country');
          nextCountry = { ...found };
        }
        let nextPolicies = obj.countryId
          ? neutralPolicies(nextCountry)
          : { ...cfg.policies };
        if (obj.policies !== undefined) {
          if (
            !obj.policies ||
            typeof obj.policies !== 'object' ||
            Array.isArray(obj.policies)
          )
            throw new Error('Policies must be an object');
          for (const [key, v] of Object.entries(obj.policies)) {
            if (!Object.hasOwn(nextPolicies, key) || typeof v !== 'number')
              throw new Error('Unknown policy or invalid value');
            nextPolicies = { ...nextPolicies, [key]: v };
          }
        }
        validateConfiguration(
          nextCountry,
          nextPolicies,
          cfg.assumptions,
          cfg.settings,
        );
        const r = runScenario(
          nextCountry,
          nextPolicies,
          cfg.assumptions,
          cfg.settings,
          false,
        );
        flushSync(() => {
          setCountry(nextCountry);
          setPolicies(nextPolicies);
          setPlaying(false);
        });
        return {
          country: nextCountry.name,
          quarter: cfg.quarter,
          scenario: r.scenario[cfg.quarter],
          baseline: r.baseline[cfg.quarter],
          invalidAt: r.invalidAt,
          invalidBaselineAt: r.invalidBaselineAt,
        };
      },
    });
    return () => controller.abort();
  }, []);
  const download = (kind: 'csv' | 'json') => {
    if (!result) return;
    let contents: string;
    if (kind === 'json')
      contents = JSON.stringify(
        {
          ...serializeScenario(snapshot),
          language,
          status: 'Educational scenario; not an empirically validated forecast',
          dataSnapshot: DATA_SNAPSHOT,
          country,
          policies,
          assumptions,
          settings,
          sources: SOURCES,
          sensitivity:
            'Every exposed assumption varies; includes zero hiring-loss and joint cases. Not a confidence interval.',
          ...(calculatingSensitivity
            ? runScenario(country, policies, assumptions, settings)
            : result),
        },
        null,
        2,
      );
    else {
      const keys: Metric[] = METRICS.map((m) => m.key);
      contents = [
        'quarter,years,series,' + keys.join(','),
        ...(['scenario', 'baseline'] as const).flatMap((series) =>
          result[series].map((p) =>
            [
              p.quarter,
              p.year,
              series,
              ...keys.map((k) => p[k].toFixed(6)),
            ].join(','),
          ),
        ),
      ].join('\n');
    }
    const url = URL.createObjectURL(
      new Blob([contents], {
        type: kind === 'json' ? 'application/json' : 'text/csv',
      }),
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = `macrolab-${country.id.toLowerCase()}-scenario.${kind}`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice(t('{format} exported.', { format: kind.toUpperCase() }));
  };
  const experiment = (name: string) => {
    remember();
    const p = neutralPolicies(country);
    if (name === 'wage')
      p.minimumWage = Math.min(120, Math.max(60, country.floor + 15));
    if (name === 'investment') p.infrastructure = 3;
    if (name === 'inflation') p.rateChange = 2;
    setPolicies(p);
    setNotice('Example applied. Adjust any slider to make it yours.');
  };
  const warnings = result
    ? [...new Set(result.scenario.flatMap((p) => p.warnings))]
    : [];
  const invalidQuarter = result
    ? [result.invalidAt, result.invalidBaselineAt]
        .filter((q): q is number => q !== null)
        .sort((a, b) => a - b)[0]
    : undefined;
  const displayError =
    computation.error ??
    (invalidQuarter !== undefined
      ? t(
          'This combination leaves the model’s valid range at {period}. Adjust the inputs before interpreting results.',
          { period: period(invalidQuarter) },
        )
      : null);
  const headline = point && base ? percentChange(point.gdp, base.gdp) : 0;
  const employmentDelta =
    point && base ? (point.employment - base.employment) * 1e6 : 0;
  return (
    <TooltipProvider>
      <div className="app-shell" lang={language}>
        <header className="topbar">
          <Link href="/" className="brand">
            <span className="brand-icon">
              <Activity size={23} />
            </span>
            macro<span>lab</span>
            <span className="brand-divider" />
            <small>{t('ECONOMY SIMULATOR')}</small>
          </Link>
          <div className="header-actions">
            <button
              type="button"
              className="quiet theme-toggle"
              aria-pressed={dark}
              aria-label={t('Dark mode')}
              title={t(dark ? 'Switch to light mode' : 'Switch to dark mode')}
              onClick={() => {
                const next = !dark;
                setDark(next);
                document.documentElement.classList.toggle('dark', next);
                document.cookie = `macrolab-theme=${next ? 'dark' : 'light'};Path=/;Max-Age=31536000;SameSite=Lax`;
              }}
            >
              {dark ? (
                <Sun size={17} aria-hidden="true" />
              ) : (
                <Moon size={17} aria-hidden="true" />
              )}
              <span>{t('Dark mode')}</span>
            </button>
            <div className="language-control">
              <Languages size={16} />
              <Picker
                label={t('Interface language')}
                value={language}
                onChange={(v) => {
                  if (isLanguage(v)) onLanguageChange(v);
                }}
                options={[
                  { value: 'en', label: 'English' },
                  { value: 'it', label: 'Italiano' },
                ]}
                className="language-picker"
              />
              <Tooltip>
                <TooltipTrigger
                  className="help-icon"
                  aria-label={t(
                    'Changing language preserves your experiment. New Italian experiments start with Italy.',
                  )}
                >
                  <Info size={13} />
                </TooltipTrigger>
                <TooltipContent>
                  {t(
                    'Changing language preserves your experiment. New Italian experiments start with Italy.',
                  )}
                </TooltipContent>
              </Tooltip>
            </div>
            <span className="calibrated-label">
              <span className="status-dot" />
              {t('Scenario lab')}
            </span>
            <button className="quiet" onClick={() => setModelOpen(true)}>
              <BookOpen size={16} />
              {t('Model & sources')}
            </button>
          </div>
        </header>
        <main className="workspace">
          <div className="page-heading">
            <div>
              <div className="eyebrow">
                <span className="status-dot" />
                {t('THE POLICY WORKBENCH')}
              </div>
              <h1>
                {t('Small changes.')} <span>{t('Economy-wide effects.')}</span>
              </h1>
              <p>
                {t(
                  'Build a country. Change a policy. Explore what happens next.',
                )}
              </p>
            </div>
            <span className="model-badge">
              {t('QUARTERLY MODEL')} <span>v{MODEL_VERSION}</span>
            </span>
          </div>
          <div className="scenario-tools">
            <button
              className="quiet"
              onClick={() => {
                remember();
                restore(initialScenario(defaultCountryId(language)));
                setNotice('New experiment started.');
              }}
            >
              {t('New experiment')}
            </button>
            <button className="quiet" onClick={shareScenario}>
              {t('Copy scenario link')}
            </button>
            <button
              className="quiet"
              onClick={() => importRef.current?.click()}
            >
              {t('Import scenario')}
            </button>
            <button
              className="quiet"
              disabled={!backup}
              onClick={() => {
                if (backup) {
                  const previous = backup;
                  setBackup(snapshot);
                  restore(previous);
                  setNotice('Previous experiment restored.');
                }
              }}
            >
              {t('Undo replacement')}
            </button>
            <span>
              {t(
                storageAvailable
                  ? 'Autosave on this device'
                  : 'Device saving unavailable; export to keep your experiment.',
              )}
            </span>
            <input
              ref={importRef}
              type="file"
              accept="application/json,.json"
              hidden
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void importScenario(file);
              }}
            />
          </div>
          <div className="mobile-jump">
            <a href="#results">{t('View results')}</a>
            <a href="#controls">{t('Edit policies')}</a>
          </div>
          <div className="workbench">
            <aside id="controls" className="control-panel">
              <div className="panel-title">
                <span className="step">01</span>
                <h2>{t('Your economy')}</h2>
                <Globe2 size={18} />
              </div>
              <Picker
                label={t('Country preset')}
                value={country.id}
                onChange={(id) => {
                  remember();
                  chooseCountry(id);
                }}
                className="country-picker"
                options={COUNTRIES.map((c) => ({
                  value: c.id,
                  label: `${c.flag}  ${t(c.name)}`,
                }))}
              />
              <div className="country-detail">
                <span>{t(country.description)}</span>
                {custom && <b>{t('Customized')}</b>}
              </div>
              <div className="mini-stats">
                <div>
                  <small>
                    {t('GDP ·')} {country.gdpYear}
                  </small>
                  <b>{gdpLabel(country.gdp)}</b>
                </div>
                <div>
                  <small>{t('Population')}</small>
                  <b>{number(country.population, 0)}M</b>
                </div>
                <div>
                  <small>
                    {t('Inflation')} ·{' '}
                    {
                      DATA_SNAPSHOT.countries[
                        country.id as keyof typeof DATA_SNAPSHOT.countries
                      ].observations.inflation.year
                    }
                  </small>
                  <b>{number(country.inflation)}%</b>
                </div>
              </div>
              <details className="economy-settings">
                <summary>
                  <Settings2 size={14} />
                  {t('Customize starting conditions')}
                  <ChevronDown size={14} />
                </summary>
                <div className="country-controls">
                  <p className="footnote">
                    {t(
                      'GDP, population, inflation and unemployment have dated World Bank anchors. Other starting conditions are assumptions. Changes affect both scenario and baseline.',
                    )}
                  </p>
                  {COUNTRY_CONTROLS.map((spec) => (
                    <Control
                      key={spec.key}
                      spec={spec}
                      value={country[spec.key as keyof Country] as number}
                      base={preset[spec.key as keyof Country] as number}
                      onChange={(v) =>
                        setCountry((c) => ({ ...c, [spec.key]: v }))
                      }
                    />
                  ))}
                  <button
                    className="reset"
                    onClick={() => {
                      remember();
                      chooseCountry(country.id);
                    }}
                  >
                    <RotateCcw size={14} />
                    {t('Restore country preset')}
                  </button>
                </div>
              </details>
              <div className="panel-title policy-title">
                <span className="step">02</span>
                <h2>{t('Policy experiment')}</h2>
                <span className="count-badge">{changed.length}</span>
              </div>
              <Tabs defaultValue="labor" className="policy-tabs">
                <TabsList className="policy-tabs-list">
                  {POLICY_GROUPS.map((g) => (
                    <TabsTrigger value={g.id} key={g.id}>
                      {t(g.name)}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {POLICY_GROUPS.map((group) => (
                  <TabsContent value={group.id} key={group.id}>
                    <div className="policy-controls">
                      {group.items.map((spec) => (
                        <Control
                          key={spec.key}
                          spec={spec}
                          value={policies[spec.key as keyof Policies]}
                          base={neutral[spec.key as keyof Policies]}
                          onChange={(v) => updatePolicy(spec.key, v)}
                        />
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
              <details className="timing-settings">
                <summary>
                  <Settings2 size={14} />
                  {t('Timing & central bank')}
                  <ChevronDown size={14} />
                </summary>
                <div className="settings-fields">
                  <label>
                    {t('Start after')}
                    <Picker
                      value={String(settings.startQuarter)}
                      label={t('Policy start quarter')}
                      onChange={(v) =>
                        setSettings((s) => ({ ...s, startQuarter: Number(v) }))
                      }
                      options={[
                        { value: '1', label: t('Now · next quarter') },
                        { value: '5', label: t('1 year') },
                        { value: '9', label: t('2 years') },
                        { value: '17', label: t('4 years') },
                      ]}
                    />
                  </label>
                  <label>
                    {t('Phase in over')}
                    <Picker
                      value={String(settings.ramp)}
                      label={t('Policy phase-in period')}
                      onChange={(v) =>
                        setSettings((s) => ({ ...s, ramp: Number(v) }))
                      }
                      options={[
                        { value: '1', label: t('Immediately') },
                        { value: '4', label: t('1 year') },
                        { value: '8', label: t('2 years') },
                        { value: '12', label: t('3 years') },
                      ]}
                    />
                  </label>
                  <label>
                    {t('Policy duration')}
                    <Picker
                      value={String(settings.duration)}
                      label={t('Policy duration')}
                      onChange={(v) =>
                        setSettings((s) => ({ ...s, duration: Number(v) }))
                      }
                      options={[
                        { value: '0', label: t('Permanent') },
                        { value: '8', label: t('2 years') },
                        { value: '20', label: t('5 years') },
                      ]}
                    />
                  </label>
                  <div className="switch-row">
                    <label htmlFor="auto-rates">
                      {t('Automatic rate response')}
                    </label>
                    <Switch
                      id="auto-rates"
                      checked={settings.automaticRates}
                      onCheckedChange={(v) =>
                        setSettings((s) => ({ ...s, automaticRates: v }))
                      }
                    />
                  </div>
                  <p className="footnote">
                    {settings.automaticRates
                      ? t(
                          'The central bank responds to core inflation and demand. Temporary import-price spikes are looked through.',
                        )
                      : t(
                          'Interest rates stay at their starting value plus your policy adjustment.',
                        )}
                    {country.currencyUnion
                      ? t(
                          ' For euro members, national policies do not change the ECB path. Monetary bias represents an external ECB scenario.',
                        )
                      : ''}
                  </p>
                  <p className="footnote">
                    {t(
                      'External shocks decay independently of the policy duration.',
                    )}
                    {settings.duration > 0 && settings.duration < settings.ramp
                      ? ' ' +
                        t(
                          'This policy expires before reaching its full setting.',
                        )
                      : ''}
                  </p>
                </div>
              </details>
              <button
                className="reset"
                onClick={() => {
                  remember();
                  setPolicies(neutralPolicies(country));
                  setNotice(
                    'All policies reset. Scenario now matches the no-policy baseline.',
                  );
                }}
              >
                <RotateCcw size={14} />
                {t('Reset policies')}
              </button>
              <button
                className="assumptions-button"
                onClick={() => setAssumptionsOpen(true)}
              >
                <SlidersHorizontal size={14} />
                {t('Model assumptions')}
                <ArrowUpRight size={14} />
              </button>
              <p className="calibration-note">
                {t('Country-inspired assumptions.')}
                <br />
                {t('Explore scenarios, not forecasts.')}
              </p>
            </aside>
            <section id="results" className="results">
              <div className="results-heading">
                <div>
                  <span className="eyebrow">{t('SIMULATION OUTLOOK')}</span>
                  <h2>
                    {period(quarter)}{' '}
                    <span className="outlook-subtitle">
                      {t('in')} {t(country.name)}
                    </span>
                  </h2>
                </div>
                <div className="outlook-actions">
                  <span className="live-badge">
                    <span className="status-dot" />
                    {t('Live scenario')}
                  </span>
                  <Picker
                    value={String(settings.years)}
                    onChange={selectYears}
                    label={t('Simulation horizon')}
                    options={[
                      { value: '5', label: t('5-year horizon') },
                      { value: '10', label: t('10-year horizon') },
                      { value: '20', label: t('20 years · exploratory') },
                    ]}
                  />
                </div>
              </div>
              {displayError ? (
                <div className="error-card" role="alert">
                  <TriangleAlert />
                  <h3>{t('This scenario cannot be interpreted.')}</h3>
                  <p>{t(displayError)}</p>
                  <button
                    className="quiet"
                    onClick={() => {
                      remember();
                      chooseCountry(country.id);
                    }}
                  >
                    {t('Restore country preset')}
                  </button>
                </div>
              ) : (
                result &&
                point &&
                base && (
                  <>
                    <div className="metric-grid">
                      {(
                        ['gdp', 'unemployment', 'inflation', 'debt'] as Metric[]
                      ).map((k) => {
                        const delta =
                          k === 'gdp'
                            ? percentChange(point[k], base[k])
                            : point[k] - base[k];
                        return (
                          <button
                            className={`metric-card ${metric === k ? 'selected' : ''}`}
                            onClick={() => setMetric(k)}
                            key={k}
                            aria-pressed={metric === k}
                          >
                            <span>
                              {t(METRICS.find((m) => m.key === k)!.name)}
                              <ArrowUpRight size={14} />
                            </span>
                            <strong>
                              {number(point[k])}
                              <em>{k === 'gdp' ? '' : '%'}</em>
                            </strong>
                            <div
                              className={`metric-change ${Math.abs(delta) < 0.05 ? 'unchanged' : (k === 'inflation' ? Math.abs(point.inflation - country.target) < Math.abs(base.inflation - country.target) : k === 'gdp' ? delta >= 0 : delta <= 0) ? 'positive' : 'negative'}`}
                            >
                              {signed(delta)} {k === 'gdp' ? '%' : t('pp')}
                              <small> {t('vs. baseline')}</small>
                            </div>
                            <small>
                              {k === 'gdp'
                                ? t('Output index · start = 100')
                                : k === 'debt'
                                  ? t('Share of nominal GDP')
                                  : k === 'inflation'
                                    ? t('Annualized quarterly rate')
                                    : t('Share of labor force')}
                            </small>
                          </button>
                        );
                      })}
                    </div>
                    <p className="evidence-note">
                      {t(
                        'Illustrative model · numerical effects are not validated country estimates.',
                      )}
                      {settings.years > 10
                        ? ' ' + t('Twenty-year results are exploratory.')
                        : ''}
                    </p>
                    <div className="chart-card">
                      <div className="chart-heading">
                        <div>
                          <h3>{t('How the economy evolves')}</h3>
                          <p>{t(metricInfo.description)}</p>
                        </div>
                        <Picker
                          value={metric}
                          onChange={(v) => setMetric(v as Metric)}
                          label={t('Chart outcome')}
                          options={METRICS.map((m) => ({
                            value: m.key,
                            label: t(m.name),
                          }))}
                        />
                      </div>
                      <div className="chart-toolbar">
                        <div className="chart-legend">
                          <span>
                            <i />
                            {t('Policy scenario')}
                          </span>
                          <span>
                            <i className="baseline-dot" />
                            {t('No new policy')}
                          </span>
                        </div>
                        <div className="band-switch">
                          <Switch
                            id="show-band"
                            size="sm"
                            checked={showBand}
                            onCheckedChange={setShowBand}
                          />
                          <label htmlFor="show-band">
                            {t('Sensitivity range')}
                          </label>
                        </div>
                      </div>
                      <div className="difference-switch">
                        <Switch
                          id="difference-view"
                          size="sm"
                          checked={difference}
                          onCheckedChange={setDifference}
                        />
                        <label htmlFor="difference-view">
                          {t('Show policy difference')}
                        </label>
                      </div>
                      <Chart
                        result={result}
                        metric={metric}
                        quarter={quarter}
                        setQuarter={selectQuarter}
                        showBand={showBand && !calculatingSensitivity}
                        difference={difference}
                      />
                      <div className="timeline">
                        <button
                          className="play-button"
                          aria-label={
                            playing
                              ? t('Pause simulation playback')
                              : t('Play simulation timeline')
                          }
                          onClick={() => {
                            if (quarter === settings.years * 4) setQuarter(0);
                            setPlaying((p) => !p);
                          }}
                        >
                          {playing ? <Pause size={15} /> : <Play size={15} />}
                        </button>
                        <Slider
                          value={[quarter]}
                          min={0}
                          max={settings.years * 4}
                          step={1}
                          onValueChange={(v) => selectQuarter(scalar(v))}
                          aria-label={t('Selected simulation quarter')}
                        />
                        <span>{period(quarter)}</span>
                      </div>
                      <p className="band-note">
                        {calculatingSensitivity
                          ? t('Calculating sensitivity…')
                          : showBand
                            ? t(
                                'Shading shows {count} assumption cases, including no direct hiring loss. It is not a confidence interval.',
                                { count: result.sensitivityCases },
                              )
                            : t(
                                'The baseline uses your same starting conditions, without the policy changes.',
                              )}
                      </p>
                    </div>
                    {result.excludedSensitivityCases > 0 && (
                      <p className="warning-box">
                        {t(
                          '{count} sensitivity cases cross model limits; their invalid sections are excluded.',
                          { count: result.excludedSensitivityCases },
                        )}
                      </p>
                    )}
                    <DemandBreakdown point={point} base={base} />
                    {changed.length === 0 ? (
                      <div className="starter-card">
                        <div className="starter-title">
                          <span className="insight-icon">
                            <SlidersHorizontal size={19} />
                          </span>
                          <div>
                            <h3>{t('What would you change?')}</h3>
                            <p>
                              {t(
                                'The lines overlap until you change a policy. Try an experiment.',
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="example-buttons">
                          <button onClick={() => experiment('wage')}>
                            <Users size={15} />
                            {t('Raise the wage floor')}
                            <ArrowRight size={14} />
                          </button>
                          <button onClick={() => experiment('investment')}>
                            <Landmark size={15} />
                            {t('Build infrastructure')}
                            <ArrowRight size={14} />
                          </button>
                          <button onClick={() => experiment('inflation')}>
                            <TrendingUp size={15} />
                            {t('Raise interest rates')}
                            <ArrowRight size={14} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="insight-card">
                        <span className="insight-icon">
                          <ChartNoAxesCombined size={21} />
                        </span>
                        <div>
                          <h3>
                            {quarter === 0
                              ? t('Your experiment begins next.')
                              : Math.abs(headline) < 0.05
                                ? t('The overall output effect is small.')
                                : t(
                                    'Output is {change}% {direction} than the baseline.',
                                    {
                                      change: number(Math.abs(headline)),
                                      direction: t(
                                        headline > 0 ? 'higher' : 'lower',
                                      ),
                                    },
                                  )}
                          </h3>
                          <p>
                            {quarter === 0
                              ? t(
                                  'Move the time slider to follow the policy effects.',
                                )
                              : t(
                                  'At {period}, the model implies about {jobs} {direction} employed people and an inflation difference of {inflation} percentage points. These are conditional model results.',
                                  {
                                    period: period(quarter).toLowerCase(),
                                    jobs: new Intl.NumberFormat(
                                      language === 'it' ? 'it-IT' : 'en-US',
                                      { maximumSignificantDigits: 2 },
                                    ).format(Math.abs(employmentDelta)),
                                    direction: t(
                                      employmentDelta >= 0 ? 'more' : 'fewer',
                                    ),
                                    inflation: signed(
                                      point.inflation - base.inflation,
                                    ),
                                  },
                                )}
                          </p>
                          {!calculatingSensitivity && (
                            <p className="effect-range">
                              {t(
                                'Employment difference across tested assumptions: {low} to {high}.',
                                {
                                  low: new Intl.NumberFormat(
                                    language === 'it' ? 'it-IT' : 'en-US',
                                    {
                                      notation: 'compact',
                                      maximumSignificantDigits: 2,
                                      signDisplay: 'exceptZero',
                                    },
                                  ).format(
                                    (result.bands[quarter].employment[0] -
                                      base.employment) *
                                      1e6,
                                  ),
                                  high: new Intl.NumberFormat(
                                    language === 'it' ? 'it-IT' : 'en-US',
                                    {
                                      notation: 'compact',
                                      maximumSignificantDigits: 2,
                                      signDisplay: 'exceptZero',
                                    },
                                  ).format(
                                    (result.bands[quarter].employment[1] -
                                      base.employment) *
                                      1e6,
                                  ),
                                },
                              )}
                            </p>
                          )}
                          {policies.rateChange !== 0 && (
                            <p>
                              {t(
                                'Delivered interest-rate difference: {change} pp.',
                                { change: signed(point.rate - base.rate) },
                              )}
                            </p>
                          )}
                          <div className="policy-chips">
                            {changed.map(([key, v]) => (
                              <span key={key}>
                                {t(
                                  POLICY_GROUPS.flatMap((g) => g.items).find(
                                    (s) => s.key === key,
                                  )?.label ?? key,
                                )}{' '}
                                <b>
                                  {signed(v - neutral[key as keyof Policies])}
                                  {key === 'minimumWage'
                                    ? t(' pp of median')
                                    : ` ${t(POLICY_GROUPS.flatMap((g) => g.items).find((spec) => spec.key === key)?.unit ?? '')}`}
                                </b>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    {warnings.length > 0 && (
                      <output className="warning-box">
                        <TriangleAlert size={18} />
                        <div>
                          {warnings.map((w) => (
                            <p key={t(w)}>{t(w)}</p>
                          ))}
                        </div>
                      </output>
                    )}
                    <div className="detail-card">
                      <Tabs defaultValue="distribution">
                        <div className="detail-toolbar">
                          <TabsList variant="line">
                            <TabsTrigger value="distribution">
                              <Users size={15} />
                              {t('Households')}
                            </TabsTrigger>
                            <TabsTrigger value="finances">
                              <Landmark size={15} />
                              {t('Public finances')}
                            </TabsTrigger>
                            <TabsTrigger value="data">
                              {t('All outcomes')}
                            </TabsTrigger>
                          </TabsList>
                          <span className="detail-period">
                            {period(quarter)}
                          </span>
                        </div>
                        <TabsContent value="distribution">
                          <Distribution point={point} base={base} />
                        </TabsContent>
                        <TabsContent value="finances">
                          <Balance point={point} base={base} />
                        </TabsContent>
                        <TabsContent value="data">
                          <div className="data-view">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>{t('Outcome')}</TableHead>
                                  <TableHead>{t('Scenario')}</TableHead>
                                  <TableHead>{t('Baseline')}</TableHead>
                                  <TableHead>{t('Unit')}</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {METRICS.map((m) => (
                                  <TableRow key={m.key}>
                                    <TableCell>{t(m.name)}</TableCell>
                                    <TableCell>
                                      {number(
                                        point[m.key],
                                        m.key === 'employment' ? 3 : 2,
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      {number(
                                        base[m.key],
                                        m.key === 'employment' ? 3 : 2,
                                      )}
                                    </TableCell>
                                    <TableCell>{t(m.unit)}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                            <p className="footnote">
                              {t(
                                'Employment levels use the calibrated population and workforce share. A growth rate can differ from a level change; the GDP chart displays levels. Income results are synthetic expected income.',
                              )}
                            </p>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                    <div className="results-footer">
                      <p>
                        <Info size={14} />
                        {t('Conditional scenarios. No historical backtesting.')}
                      </p>
                      <div>
                        <button onClick={() => download('csv')}>
                          <ArrowDownToLine size={14} />
                          CSV
                        </button>
                        <button onClick={() => download('json')}>
                          <ArrowDownToLine size={14} />
                          {t('Full scenario')}
                        </button>
                      </div>
                    </div>
                  </>
                )
              )}
              <output className="notice" aria-live="polite">
                {t(notice)}
              </output>
            </section>
          </div>
          <footer className="app-footer">
            <span>
              MACROLAB <i>—</i> {t('Think in systems.')}
            </span>
            <button onClick={() => setModelOpen(true)}>
              {t('Transparent assumptions. Open methodology.')}
              <ArrowUpRight size={13} />
            </button>
          </footer>
        </main>
        <Dialog open={modelOpen} onOpenChange={setModelOpen}>
          <DialogContent className="large-dialog" showCloseButton={false}>
            <DialogClose
              className="localized-dialog-close"
              aria-label={t('Close')}
            >
              <X size={19} />
            </DialogClose>
            <DialogHeader>
              <div className="eyebrow">{t('UNDER THE HOOD')}</div>
              <DialogTitle>{t('Model & sources')}</DialogTitle>
              <DialogDescription>
                {t(
                  'Understand the mechanisms, inspect the assumptions, and know the limits.',
                )}
              </DialogDescription>
            </DialogHeader>
            <Methodology country={country} />
          </DialogContent>
        </Dialog>
        <Dialog open={assumptionsOpen} onOpenChange={setAssumptionsOpen}>
          <DialogContent className="assumptions-dialog" showCloseButton={false}>
            <DialogClose
              className="localized-dialog-close"
              aria-label={t('Close')}
            >
              <X size={19} />
            </DialogClose>
            <DialogHeader>
              <div className="eyebrow">{t('MAKE THE ASSUMPTIONS YOURS')}</div>
              <DialogTitle>{t('Model assumptions')}</DialogTitle>
              <DialogDescription>
                {t(
                  'These are calibrated choices, not measured constants. Changes apply to the scenario and its matching baseline.',
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="assumption-controls">
              {ASSUMPTION_CONTROLS.map((spec) => (
                <Control
                  key={spec.key}
                  spec={spec}
                  value={assumptions[spec.key as keyof Assumptions]}
                  base={DEFAULT_ASSUMPTIONS[spec.key as keyof Assumptions]}
                  onChange={(v) =>
                    setAssumptions((a) => ({ ...a, [spec.key]: v }))
                  }
                />
              ))}
            </div>
            <button
              className="reset"
              onClick={() => {
                remember();
                setAssumptions({ ...DEFAULT_ASSUMPTIONS });
              }}
            >
              <RotateCcw size={14} />
              {t('Restore default assumptions')}
            </button>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}

export default function Home({
  initialLanguage = 'en',
  initialDark = false,
}: {
  initialLanguage?: Language;
  initialDark?: boolean;
}) {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const [initial, setInitial] = useState<ScenarioConfig | null>(null);
  const [initialNotice, setInitialNotice] = useState('');
  useEffect(() => {
    let language = initialLanguage;
    try {
      const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (isLanguage(saved)) language = saved;
    } catch {}
    // Browser storage is external state, read after hydration to keep the
    // server and client markup identical. Only the loading screen precedes it.
    // oxlint-disable-next-line react/react-compiler
    setLanguage(language);
    let config = initialScenario(defaultCountryId(language));
    try {
      const hash = new URLSearchParams(window.location.hash.slice(1)).get(
        'scenario',
      );
      let restored;
      if (hash) restored = decodeScenario(hash);
      else {
        const saved = window.localStorage.getItem(SCENARIO_STORAGE_KEY);
        if (saved) restored = parseScenario(JSON.parse(saved));
      }
      if (restored) {
        config = restored.config;
        if (restored.migrated)
          setInitialNotice(
            'Previous-version settings imported. Results use the revised model.',
          );
      }
    } catch {
      setInitialNotice(
        'The saved experiment could not be restored. A new one was opened.',
      );
    }
    setInitial(config);
  }, [initialLanguage]);
  const changeLanguage = (next: Language) => {
    setLanguage(next);
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
      document.cookie = `macrolab-language=${next};Path=/;Max-Age=31536000;SameSite=Lax`;
    } catch {}
  };
  return (
    <I18nProvider language={language}>
      {initial ? (
        <Simulator
          onLanguageChange={changeLanguage}
          initial={initial}
          initialNotice={initialNotice}
          initialDark={initialDark}
        />
      ) : (
        <output className="restore-screen">
          {initialLanguage === 'it'
            ? 'Preparazione dell’esperimento…'
            : 'Preparing your experiment…'}
        </output>
      )}
    </I18nProvider>
  );
}
