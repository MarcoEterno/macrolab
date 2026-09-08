// SVG is the interactive chart, with keyboard slider semantics. Replacing it
// with an input would discard the plot; a native time slider is also provided.
/* oxlint-disable jsx-a11y/prefer-tag-over-role */
'use client';
import { useEffect, useRef, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { METRICS, clamp } from '@/lib/economy';
import type { Metric, Point, runScenario } from '@/lib/economy';
type Result = ReturnType<typeof runScenario>;
export function niceScale(min: number, max: number, count = 4) {
  const raw = Math.max(max - min, 0.5) / count,
    magnitude = 10 ** Math.floor(Math.log10(raw)),
    fraction = raw / magnitude;
  const step =
    (fraction <= 1
      ? 1
      : fraction <= 2
        ? 2
        : fraction <= 2.5
          ? 2.5
          : fraction <= 5
            ? 5
            : 10) * magnitude;
  const lo = Math.floor(min / step) * step,
    hi = Math.ceil(max / step) * step;
  return { lo, hi: hi === lo ? lo + step : hi, step };
}
export function Chart({
  result,
  metric,
  quarter,
  setQuarter,
  showBand,
  difference = false,
}: {
  result: Result;
  metric: Metric;
  quarter: number;
  setQuarter: (q: number) => void;
  showBand: boolean;
  difference?: boolean;
}) {
  const { t, number, period } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(900);
  const [hover, setHover] = useState<number | null>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver((entries) =>
      setWidth(Math.max(240, entries[0].contentRect.width)),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const { scenario, baseline, bands } = result,
    info = METRICS.find((m) => m.key === metric)!;
  const transform = (value: number, i: number) =>
    difference
      ? metric === 'gdp'
        ? (value / baseline[i][metric] - 1) * 100
        : value - baseline[i][metric]
      : value;
  const values = scenario.map((p, i) => transform(p[metric], i)),
    base = baseline.map((p, i) => transform(p[metric], i));
  const upper = bands.map((band, i) => transform(band[metric][1], i)),
    lower = bands.map((band, i) => transform(band[metric][0], i));
  const all = [...values, ...base, ...(showBand ? [...upper, ...lower] : [])];
  const padding = Math.max((Math.max(...all) - Math.min(...all)) * 0.12, 0.1);
  const { lo, hi, step } = niceScale(
    Math.min(...all) - padding,
    Math.max(...all) + padding,
  );
  const W = width,
    H = 300,
    L = 54,
    R = 14,
    T = 28,
    B = 34;
  const x = (i: number) => L + (i / (scenario.length - 1)) * (W - L - R),
    y = (value: number) => T + ((hi - value) / (hi - lo)) * (H - T - B);
  const path = (points: number[]) =>
    points.map((value, i) => `${i ? 'L' : 'M'}${x(i)},${y(value)}`).join(' ');
  const area =
    path(upper) +
    ' ' +
    [...lower]
      .reverse()
      .map((value, i) => `L${x(lower.length - 1 - i)},${y(value)}`)
      .join(' ') +
    ' Z';
  const q = clamp(hover ?? quarter, 0, scenario.length - 1);
  const ticks = Array.from(
    { length: Math.round((hi - lo) / step) + 1 },
    (_, i) => lo + i * step,
  );
  const intervals = Math.max(2, Math.min(5, Math.floor((W - L - R) / 100)));
  const unit = difference
    ? metric === 'gdp'
      ? '%'
      : metric === 'wages' || metric === 'fx'
        ? 'index points'
        : metric === 'employment'
          ? 'million'
          : 'pp'
    : info.unit;
  return (
    <div className="chart-wrap" ref={ref}>
      <div className="chart-readout">
        <b>{period(q)}</b>
        <span className="scenario-value">
          {number(values[q])}
          <small> {t(unit)}</small>
        </span>
        <span>
          {difference
            ? t('Difference from baseline')
            : t('Baseline') + ' ' + number(base[q])}
        </span>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ height: H }}
        role="slider"
        tabIndex={0}
        aria-valuemin={0}
        aria-valuemax={scenario.length - 1}
        aria-valuenow={quarter}
        aria-valuetext={period(quarter)}
        onKeyDown={(event) => {
          if (
            ![
              'ArrowLeft',
              'ArrowRight',
              'ArrowUp',
              'ArrowDown',
              'Home',
              'End',
            ].includes(event.key)
          )
            return;
          event.preventDefault();
          setHover(null);
          setQuarter(
            event.key === 'Home'
              ? 0
              : event.key === 'End'
                ? scenario.length - 1
                : clamp(
                    quarter +
                      (['ArrowRight', 'ArrowUp'].includes(event.key) ? 1 : -1),
                    0,
                    scenario.length - 1,
                  ),
          );
        }}
        aria-label={t(
          '{name} across {years} years. Selected {period}: scenario {scenario}, baseline {baseline}. Use the time slider for precise values.',
          {
            name: t(info.name),
            years: number((scenario.length - 1) / 4, 0),
            period: period(quarter),
            scenario: number(scenario[quarter][metric]),
            baseline: number(baseline[quarter][metric]),
          },
        )}
        onPointerMove={(event) => {
          const box = event.currentTarget.getBoundingClientRect();
          setHover(
            clamp(
              Math.round(
                ((event.clientX - box.left - L) / (W - L - R)) *
                  (scenario.length - 1),
              ),
              0,
              scenario.length - 1,
            ),
          );
        }}
        onPointerLeave={() => setHover(null)}
        onClick={(event) => {
          const box = event.currentTarget.getBoundingClientRect();
          setQuarter(
            clamp(
              Math.round(
                ((event.clientX - box.left - L) / (W - L - R)) *
                  (scenario.length - 1),
              ),
              0,
              scenario.length - 1,
            ),
          );
        }}
      >
        <text x={L} y={15} fill="var(--chart-text)" fontSize="12">
          {t(unit)}
        </text>
        {ticks.map((value) => (
          <g key={value}>
            <line
              x1={L}
              x2={W - R}
              y1={y(value)}
              y2={y(value)}
              stroke={
                Math.abs(value) < 1e-8
                  ? 'var(--chart-zero)'
                  : 'var(--chart-grid)'
              }
              strokeDasharray="3 4"
            />
            <text
              x={L - 9}
              y={y(value) + 4}
              textAnchor="end"
              fill="var(--chart-text)"
              fontSize="12"
            >
              {number(value, step >= 1 ? 0 : step >= 0.1 ? 1 : 2)}
            </text>
          </g>
        ))}
        {showBand && <path d={area} fill="var(--chart-policy)" opacity=".14" />}
        <path
          d={path(base)}
          fill="none"
          stroke="var(--chart-baseline)"
          strokeWidth="2"
          strokeDasharray="5 6"
        />
        <path
          d={path(values)}
          fill="none"
          stroke="var(--chart-policy)"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <line
          x1={x(q)}
          x2={x(q)}
          y1={T}
          y2={H - B}
          stroke="var(--chart-cursor)"
          strokeDasharray="3 4"
        />
        <circle
          cx={x(q)}
          cy={y(values[q])}
          r="5"
          fill="var(--chart-policy)"
          stroke="var(--card)"
          strokeWidth="2"
        />
        {Array.from({ length: intervals + 1 }, (_, i) => {
          const q = Math.round(((scenario.length - 1) * i) / intervals);
          return (
            <text
              key={q}
              x={x(q)}
              y={H - 6}
              textAnchor={
                i === 0 ? 'start' : i === intervals ? 'end' : 'middle'
              }
              fill="var(--chart-text)"
              fontSize="12"
            >
              {q === 0
                ? t('Today')
                : t('Year {year}', { year: number(q / 4, q % 4 ? 1 : 0) })}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
export function DemandBreakdown({
  point,
  base,
}: {
  point: Point;
  base: Point;
}) {
  const { t, signed } = useI18n();
  const labels = {
    fiscal: 'Fiscal demand',
    adjustment: 'Private-demand adjustment',
    wages: 'Wage redistribution',
    trade: 'Trade',
    rates: 'Borrowing costs',
    energy: 'Energy costs',
    migration: 'Worker-inflow adjustment',
    stabilizers: 'Automatic benefits',
  };
  const entries = Object.entries(point.demand).map(([key, value]) => ({
    key,
    label: labels[key as keyof typeof labels],
    value: value - base.demand[key as keyof typeof base.demand],
  }));
  const scale = Math.max(0.25, ...entries.map((row) => Math.abs(row.value)));
  return (
    <details className="demand-breakdown">
      <summary>{t('Why does demand change?')}</summary>
      <p>
        {t(
          'Contributions to the desired output-gap difference, in percentage points. These are demand channels, not an additive breakdown of GDP growth.',
        )}
      </p>
      <div className="income-bars">
        {entries.map(({ key, label, value }) => (
          <div className="income-row" key={key}>
            <span>{t(label)}</span>
            <div className="income-track">
              <span className="zero-line" />
              <i
                style={{
                  left:
                    value < 0
                      ? `${50 - (Math.abs(value) / scale) * 48}%`
                      : '50%',
                  width: `${(Math.abs(value) / scale) * 48}%`,
                  background:
                    value < 0 ? 'var(--chart-negative)' : 'var(--chart-policy)',
                }}
              />
            </div>
            <strong>
              {signed(value)} {t('pp')}
            </strong>
          </div>
        ))}
      </div>
      <p>
        {t(
          'Potential output also changes through capital, training, and the workforce.',
        )}
      </p>
    </details>
  );
}
