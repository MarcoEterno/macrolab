# MacroLab

An interactive quarterly economy and policy scenario workbench.

## Use

Install the pinned dependencies with `npm install`, run `npm run dev`, and open the printed local URL. Run `npm run build` for production.

Choose one of eight representative countries; optionally edit its starting conditions. Changes to starting conditions affect both baseline and policy paths. Policy sliders apply only to the scenario. Use the quarterly timeline, chart metric picker, household distribution, and fiscal table to inspect outcomes. The full JSON export preserves all parameters, sources, paths, and sensitivity envelopes.

## Model status

This is a calibrated, backward-looking semi-structural educational model, not a validated forecast, an estimated DSGE, a microsimulation on household survey data, or a complete stock-flow consistent economy. The World Bank sources anchor nominal GDP size only. Other country fields and behavioral coefficients are illustrative, editable calibrations. “Today” is scenario time zero, not an assertion about today's macroeconomic state.

Mechanisms, equations, provenance, and limitations are available in the application's Model & sources dialog. The implementation is in `lib/economy.ts`.

The 27-case band is the envelope of paired policy effects under explicit parameter variations. It is not a statistical confidence interval. Country-specific estimation and historical out-of-sample backtesting have not been performed. Values in extreme scenarios can hit numerical boundaries; applicable warnings are displayed.

## Verification

- `node --experimental-strip-types tests/model.test.ts` checks unchanged-policy equivalence, national-accounts identity, public debt flows, delayed and temporary policies, selected comparative statics, extreme slider values, finite outputs, and sensitivity behavior across country presets.
- `node_modules/.bin/tsc --noEmit` checks TypeScript.
- `npm run build` checks the production build.

Broader browser UI QA was not requested and was not performed. Optional WebMCP tools are feature-detected. If the browser lacks a supported model-context registry, the simulator operates normally without them.

Synced ChatGPT project reference material outside this site's checkout remains read-only.
