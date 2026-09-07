# MacroLab

An interactive quarterly country-policy scenario workbench with English and Italian interfaces.

## Use

Install the pinned dependencies with `npm ci`, start with `npm run dev`, and open the printed local URL. `npm run build` creates the production build.

Choose a country, edit its starting conditions, then change policy sliders or type exact values. Starting conditions affect both the baseline and the policy path. The timeline, chart, policy-difference view, demand decomposition, synthetic income distribution and fiscal table explain the outcomes. The exchange-rate index is available in the chart picker.

Experiments autosave in browser storage when available. Copy a share link, export/import a full JSON scenario, or download a CSV path. Shared links encode settings in the URL fragment; there is no server scenario database. Anyone given the link can read its settings. An undo button restores the previous replaced configuration. Changing interface language preserves the experiment. **New experiment** starts from Italy in Italian and the United States in English. Version 1 configuration exports can be imported, but their results are recomputed with the revised model.

## Model and evidence

MacroLab 2.0 is a backward-looking, semi-structural educational scenario model. It is not a statistically estimated forecast, a household-survey microsimulation, a complete stock-flow consistent economy, or a validated DSGE model. Model output magnitudes depend on explicit hypotheses.

A fixed World Bank snapshot provides GDP, population, CPI inflation and ILO-modeled unemployment for eight countries. GDP uses the common 2025 reference year; each other observation retains its own year. Values preserve the World Bank country cards' displayed precision. `data/world-bank-snapshot.json` records each value, unit, year, indicator link, source page, retrieval timestamp and source-page hash. `public/data-snapshot.json` is the downloadable identical snapshot. All remaining preset fields are editable illustrative assumptions. Japan and Brazil's neutral-rate choices are informed by cited IMF discussions, but are not estimated by this app. Presets combine dated observations with assumptions; they are not synchronized current-country datasets.

`node scripts/refresh-country-data.mjs` explicitly refreshes the public-card snapshot. Refreshing is a data change: inspect units, reference years and values, then review regression fixtures before accepting it. It is never run automatically at startup or during tests. The API was unavailable in the repair environment, so this release records the public-card method instead of claiming API precision.

Mechanisms and coefficients are documented in **Model & sources**:

- Demand, capital accumulation, potential output, prices, public finances and synthetic income distribution are modeled explicitly. Consumption is the residual that closes expenditure accounts; it is not an estimated household consumption function.
- Core inflation is separate from one-off cost-level changes. Imported prices enter CPI separately from the domestic GDP deflator. A temporary energy shock uses an explicit exposure share.
- Neutral real rates are country-specific. For Germany and Italy, a common external ECB path replaces a national Taylor response. The monetary control describes a rule bias; the delivered rate is shown separately.
- Fiscal and wage-redistribution demand effects fade with an editable half-life. Capital, training, debt and other feedback can persist. This is an approximate long-run adjustment, not a proof of full long-run neutrality; 20-year paths are exploratory.
- Migration adds an annual fraction of the initial labor force. Adjustment costs follow flows and fade after flows cease.
- Household taxes and transfers reconcile to the modeled public budget. Synthetic disposable income is fully CPI-deflated and expressed per labor-force member. Public surpluses can accumulate financial assets after gross debt is repaid.
- Numerical or accounting failures invalidate the result instead of presenting a normal-looking policy conclusion.

The envelope uses **36 parameter variants**, each compared with its own baseline. It covers all 16 exposed assumptions, includes a zero direct labor-demand elasticity, and reports exclusions when variants leave the model's domain. It is a tested-assumption range, not a confidence interval or a comprehensive uncertainty distribution. It does not imply that minimum wages must reduce employment.

## Verification

`npm test` runs accounting, timing, comparative-static and domain checks across presets, followed by focused repair regressions. These include one-off price pass-through, equilibrium consistency, migration flow totals, currency response, ECB independence, fiscal/household reconciliation, sensitivity coverage, configuration round-trips and translation coverage.

`tests/fixtures/model-v2.json` locks selected model magnitudes. It is software regression evidence, not historical validation. Update it only after deliberately reviewing a model or source change.

`node_modules/.bin/tsc --noEmit --incremental false` checks types. `npm run lint` checks the entire retained application. Unused starter components and their dedicated dependencies have been removed; the existing eight UI primitives remain. Dependencies were updated and the current audit reported zero known vulnerabilities.

Browser interaction and screenshot verification were blocked by the browser's unavailable admin-policy check. Responsive layout, accessibility and interface changes have code-level checks, not a completed visual or screen-reader audit. See `REVIEW-RESOLUTION.md` for all review outcomes and remaining limits.

Synced ChatGPT reference material outside the site checkout is read-only. Optional WebMCP tools are feature-detected; the app works when the browser does not support them.
