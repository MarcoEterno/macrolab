'use client';
import { ExternalLink } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { useI18n } from '@/lib/i18n';
import {
  COUNTRY_CONTROLS,
  COEFFICIENTS,
  COEFFICIENT_LABELS,
  DATA_SNAPSHOT,
  CALIBRATION_DATE,
  SOURCES,
  COUNTRIES,
} from '@/lib/economy';
import type { Country } from '@/lib/economy';
export function Methodology({ country }: { country: Country }) {
  const { t, number } = useI18n();
  const data =
    DATA_SNAPSHOT.countries[country.id as keyof typeof DATA_SNAPSHOT.countries];
  const preset = COUNTRIES.find((c) => c.id === country.id)!;
  return (
    <Tabs defaultValue="framework" className="methodology-tabs">
      <TabsList>
        <TabsTrigger value="framework">{t('Framework')}</TabsTrigger>
        <TabsTrigger value="equations">{t('Equations')}</TabsTrigger>
        <TabsTrigger value="data">{t('Country data')}</TabsTrigger>
        <TabsTrigger value="sources">{t('Sources')}</TabsTrigger>
      </TabsList>
      <TabsContent value="framework">
        <div className="method-content">
          <h3>{t('A scenario model with explicit limits')}</h3>
          <p>
            {t(
              'This educational model connects demand, productive capacity, wages, prices and government accounts in quarterly steps. It is not estimated or backtested against country histories. Its numerical results are hypotheses, not reliable forecasts.',
            )}
          </p>
          <div className="framework-grid">
            {[
              [
                '01',
                'Demand',
                'Fiscal measures and wage redistribution affect spending. Their demand effect fades as private demand adjusts; productive investment can persist.',
              ],
              [
                '02',
                'Supply',
                'Private capital, infrastructure, training and the workforce affect potential output. All response strengths and delays are assumptions.',
              ],
              [
                '03',
                'Labor',
                'Synthetic wage groups model uncertain hiring responses. Sensitivity includes no direct employment loss; no universal minimum-wage effect is assumed.',
              ],
              [
                '04',
                'Prices & money',
                'Domestic and imported cost levels change prices once. Core inflation evolves separately. Euro members share an external monetary path.',
              ],
              [
                '05',
                'Government',
                'The budget records taxes, purchases, transfers, interest, debt and surplus assets. Assets can finance later deficits.',
              ],
              [
                '06',
                'Households',
                'The household distribution receives exactly the taxes and transfers recorded in the government budget, including automatic benefits. Nominal income is divided by consumer prices.',
              ],
            ].map(([id, title, copy]) => (
              <div key={id}>
                <span>{id}</span>
                <h4>{t(title)}</h4>
                <p>{t(copy)}</p>
              </div>
            ))}
          </div>
          <h3>{t('How to read the sensitivity band')}</h3>
          <p>
            {t(
              'Every exposed assumption is varied individually in both directions, with additional joint cases and a zero hiring-loss case. Policy differences use matching baselines. Shading is an envelope of these hypotheses, not a probability interval or a complete account of uncertainty.',
            )}
          </p>
          <h3>{t('Where this model stops')}</h3>
          <p>
            {t(
              'Country wage surveys, tax-benefit rules, banks, defaults, sector detail, housing, migration skill composition and optimizing expectations are not modeled. Fiscal-demand fading and exchange-rate responses are explicit approximations. Long horizons and large policy changes remain exploratory.',
            )}
          </p>
          <p>
            {t(
              'Consumption is an accounting residual, not a household spending forecast. The model does not provide a complete set of private balance sheets or an estimated national income distribution. Invalid paths are withheld from the normal results.',
            )}
          </p>
          <p>
            {t(
              'Italy and Sweden have no national statutory wage floor; collective bargaining is not explicitly modeled. Zero therefore does not mean that actual wages are unregulated.',
            )}
          </p>
        </div>
      </TabsContent>
      <TabsContent value="equations">
        <div className="method-content">
          <h3>{t('Core relationships')}</h3>
          {[
            [
              'Real output',
              'Y = potential × (1 + gap / 100)',
              'Potential follows trend growth, relative capital, worker supply and training. Reference and scenario capital use the same investment timing.',
            ],
            [
              'Demand adjustment',
              'gap[t] = 0.74 × gap[t−1] + 0.26 × demandTarget',
              'The demand breakdown shows fiscal measures, private-demand adjustment, redistribution, trade, borrowing, energy, worker adjustment and automatic benefits.',
            ],
            [
              'Prices & central bank',
              'core π[t] = 0.86 × core π[t−1] + 0.14 × target + κ × gap',
              'Consumer prices equal core prices multiplied by domestic and imported cost factors. GDP uses the domestic deflator. Headline inflation is calculated from the actual quarterly price ratio; cost changes do not enter persistent core inflation.',
            ],
            [
              'Employment',
              'employment = labor force × (1 − unemployment / 100)',
              'Migration adds the specified fraction of the initial labor force each year. Its temporary demand cost depends on new inflows and fades after they stop.',
            ],
            [
              'Government debt',
              'net debt[t] = net debt[t−1] + (annual spending − annual revenue) / 4',
              'Surpluses repay debt first and then accumulate assets. Later deficits draw down assets first. Household benefits and taxes reconcile with these fiscal flows.',
            ],
            [
              'National accounts',
              'C = Y − I − G − X + M',
              'This residual checks feasibility; it is not an independent consumption model. Non-positive consumption or numerical boundaries invalidate the projection.',
            ],
          ].map(([title, equation, description]) => (
            <div className="equation" key={title}>
              <b>{t(title)}</b>
              <code>{equation}</code>
              <p>{t(description)}</p>
            </div>
          ))}
          <h3>{t('Structural assumptions')}</h3>
          <p>
            {t(
              'These constants define the model structure. They are illustrative, not measured facts. The separate Model assumptions panel controls the parameters varied in the sensitivity analysis.',
            )}
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('Parameter')}</TableHead>
                <TableHead>{t('Value')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(COEFFICIENTS).map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell>
                    {t(COEFFICIENT_LABELS[key as keyof typeof COEFFICIENTS])}
                  </TableCell>
                  <TableCell>
                    {number(value, Number.isInteger(value) ? 0 : 3)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TabsContent>
      <TabsContent value="data">
        <div className="method-content">
          <h3>
            {country.flag} {t(country.name)}
            {t(': what is measured?')}
          </h3>
          <p>
            {t(
              'Observation snapshot retrieved {date}. GDP uses 2025 for all presets. Other statistics retain their own reference years. Annual CPI observations initialize a hypothetical quarter; they are not current quarterly inflation.',
              { date: CALIBRATION_DATE },
            )}
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('Observed anchor')}</TableHead>
                <TableHead>{t('Value')}</TableHead>
                <TableHead>{t('Year')}</TableHead>
                <TableHead>{t('Source')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(data.observations).map(([key, observation]) => (
                <TableRow key={key}>
                  <TableCell>
                    {t(
                      (
                        {
                          gdp: 'GDP',
                          population: 'Population',
                          inflation: 'Inflation',
                          unemployment: 'Unemployment',
                        } as Record<string, string>
                      )[key],
                    )}
                  </TableCell>
                  <TableCell>
                    {number(observation.value, key === 'population' ? 2 : 1)}{' '}
                    {t(observation.unit)}
                  </TableCell>
                  <TableCell>{observation.year}</TableCell>
                  <TableCell>
                    <a href={observation.url} target="_blank" rel="noreferrer">
                      {observation.indicator}
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p>
            <a href="/data-snapshot.json" download>
              {t('Download the exact observation snapshot')}
            </a>
          </p>
          <h3>{t('Measured anchors and editable assumptions')}</h3>
          <p>
            {t(
              'Public finances, policy rates, trend growth, workforce participation, trade structure, energy exposure and wage distributions remain illustrative. They are not a synchronized current-country dataset. Modified observed anchors become user assumptions.',
            )}
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('Parameter')}</TableHead>
                <TableHead>{t('Current input')}</TableHead>
                <TableHead>{t('Provenance')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {COUNTRY_CONTROLS.map((spec) => (
                <TableRow key={spec.key}>
                  <TableCell>{t(spec.label)}</TableCell>
                  <TableCell>
                    {number(country[spec.key as keyof Country] as number)}{' '}
                    {t(spec.unit)}
                  </TableCell>
                  <TableCell>
                    {t(
                      (spec.key === 'inflation' ||
                        spec.key === 'unemployment') &&
                        country[spec.key] === preset[spec.key]
                        ? 'World Bank observation'
                        : 'Editable assumption',
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TabsContent>
      <TabsContent value="sources">
        <div className="method-content">
          <p>
            {t(
              'References support specific mechanisms and observations. They do not validate this model or supply every coefficient. Source years and retrieval dates are kept separately.',
            )}
          </p>
          {SOURCES.map((source) => (
            <a
              className="source-card"
              href={source.url}
              target="_blank"
              rel="noreferrer"
              key={source.title}
            >
              <div>
                <h4>{t(source.title)}</h4>
                <p>{t(source.note)}</p>
              </div>
              <ExternalLink size={16} />
            </a>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
