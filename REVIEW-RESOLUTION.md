# MacroLab review resolution

7 September 2026. This combines the earlier review with the supplied “MacroLab 1.0 — review of model, sources and design.” The supplied review is preserved as `REVIEW.md`. Changes target the existing simulator and retain its visual identity.

## Model corrections

| Finding | Resolution |
|---|---|
| One-off costs repeatedly amplified through persistent inflation | **Fixed.** Separate core inflation, core prices, domestic GDP deflator and imported CPI costs. A constant cost-level change is applied once to the price level. A 40-quarter isolated-channel regression checks its magnitude and reversal. Demand and monetary feedback may still alter total inflation. |
| One neutral real rate imposed on every country | **Fixed structurally.** Each preset has an editable neutral real rate, with a separate common assumption offset. Japan starts at −0.5% and Brazil at 5%; other profiles are explicit hypotheses. The country slider supports −2% to 8%. These choices do not validate all baseline paths. |
| Permanent fiscal stimulus permanently repeated as new demand | **Fixed at the demand-channel level.** An editable adjustment half-life gradually offsets fiscal and wage-redistribution demand. Persistent capital, debt, monetary and trade feedback remain. Full long-run equilibrium is still outside this model. |
| Germany or Italy controls the ECB through its national output gap | **Fixed.** Euro members use an external common-rate scenario; national fiscal shocks cannot independently change the ECB path or euro exchange rate. This is a small-member approximation, not a full euro-area model. |
| Exchange-rate channel effectively inert | **Fixed.** Explicit real-rate sensitivity and currency adjustment now produce an observable response. FX is an available chart metric. Magnitudes remain assumptions rather than econometric estimates. |
| Migration accumulates exponentially and causes perpetual integration costs | **Fixed.** Annual additions use the initial labor force. Costs follow lagged inflows and decay after arrivals stop; the extra workers remain in productive capacity. |
| Real household income arbitrarily loses value under on-target inflation | **Fixed.** Nominal wage and capital incomes, taxes and transfers are allocated to synthetic bins, then deflated once by CPI. Values are per labor-force member, not survey household incomes. |
| Household automatic benefits differ from public expenditure | **Fixed.** Both panels use the same transfer total, including automatic stabilization. Regressions reconcile household net income with GDP, taxes and transfers. |
| Imported inflation artificially inflates domestic nominal GDP and fiscal bases | **Fixed.** Imported price shocks affect CPI separately from the domestic GDP deflator. |
| Energy price response is not scaled by exposure | **Fixed.** An explicit editable energy exposure and pass-through coefficient determine the direct price effect. The repair removes artificial persistence; it does not prohibit genuine disinflation or negative inflation. |
| Monetary-policy slider promises a rate increase it does not deliver | **Fixed.** Renamed as a policy-rule bias, with a description of the fixed-rate alternative and a separate delivered-rate difference. Chips include units. |
| Negative consumption or numerical limits still produce ordinary recommendations | **Fixed.** Invalid central or baseline paths withhold normal results and identify the first invalid period. Invalid sensitivity paths are excluded from the envelope and their count is disclosed. |
| Debt silently stops at zero | **Fixed.** Surpluses beyond debt repayment accumulate public financial assets; deficits draw assets before issuing debt. Net public liabilities reconcile to fiscal flows. |
| Capital accumulation contains timing mismatches | **Fixed.** Private/reference investment use the previous quarter, and lagged infrastructure uses the spending period's trend level. A controlled equilibrium regression checks consistency. |
| Minimum-wage employment effect assumes excessive certainty | **Improved.** Central labor elasticity is an explicitly illustrative 0.15; sensitivity includes zero direct elasticity, stronger responses and market-power alternatives. Results report a range and conditional language. This does not establish the true effect in a given country. |
| Sensitivity bands ignore rates, energy, tariffs and migration | **Fixed for exposed assumptions.** 36 variants cover all 16 controls, matched against their own baselines. Regression checks require nonzero ranges for those shocks. The envelope is not probabilistic and does not span every structural alternative. |

## Sources and presentation

| Finding | Resolution |
|---|---|
| GDP anchors do not consistently match a single source vintage | **Fixed.** A frozen World Bank public-card snapshot uses 2025 GDP for all eight countries and records exact displayed precision. Population, inflation and unemployment are also sourced and carry individual years. |
| A “sources checked” date looks like a data reference year | **Fixed.** Retrieval time and observation years are separate. Source provenance is shown per field, and the same snapshot is exported. |
| Misnamed IMF papers and overstated calibration | **Fixed.** Correct paper titles and links; notes distinguish conceptual inspiration, research-informed assumptions and sourced observations. The interface does not claim the coefficients were estimated from these papers. |
| Many preset fields look like current country data | **Partly fixed.** Four fields now have dated observations. Remaining values are explicitly labeled assumptions. No unsupported claim that all values represent end-2024 or September 2026 was substituted. |
| Phone chart text shrinks with a fixed large SVG | **Implemented; visual verification blocked.** The plot measures its container and keeps labels at a readable physical size, adjusts tick density and uses rounded ticks and units. |
| Weak contrast, small supporting text and cramped mobile controls | **Implemented; visual verification blocked.** Increased text sizing and contrast, improved label wrapping, added exact numeric entry and mobile jumps between inputs and results. |
| Inflation falling into deflation is always green | **Fixed.** Color reflects movement toward or away from the selected inflation target. |
| False precision in employment headlines | **Fixed.** Two significant digits plus the tested assumption range. Results are labeled conditional and illustrative. |
| Language change destroys the experiment | **Fixed.** Language only changes presentation. A new experiment uses Italy in Italian and the US in English. Language cookies support initial document metadata, and a loading state prevents a wrong-country scenario flash while saved settings load. |
| No persistence, share links, import or replacement undo | **Fixed.** Browser autosave, URL-fragment scenario links, versioned JSON import/export and undo for configuration replacements. Storage and malformed-input failures are handled. |
| No explanation of the demand channels | **Fixed.** A collapsible per-quarter breakdown shows fiscal, adjustment, wage, trade, monetary, energy, migration and stabilization contributions. It explicitly describes the desired output gap, rather than falsely claiming an additive decomposition of realized GDP. |
| Accessibility of chart interaction | **Improved.** Keyboard controls, selected-period semantics and the existing native time slider. A manual assistive-technology audit remains unverified. |
| Dead dark-theme variables | **Fixed.** Removed the unused custom dark palette; the existing light design remains. |

## Engineering and validation

The model and interface are formatted and separated into configuration, scenario serialization, chart, methodology and simulation modules. Demand, prices, public finances and household distribution are separate functions; behavioral coefficients have names and an in-app table. Numerical approximation constants, unit conversions and domain guards remain in the implementation rather than becoming dozens of confusing sliders.

Added regression coverage for price-level magnitude, equilibrium consistency, migration, FX, monetary-union behavior, transfer reconciliation, public assets, sensitivity channels, extreme configurations, saved/imported/shared scenarios, language defaults and translation placeholders. A fixed fixture covers eight scenarios at four horizons. These are regression tests, not empirical validation.

Dependencies were updated, including the React server-component and deployment stack. The dependency audit reported **zero known vulnerabilities** at the time of this repair. The app passes focused code checks and type checking. The broad repository check still reports existing issues in unused starter components; no rule was globally disabled to hide them.

## What remains, and why

1. **Country-specific statistical estimation and historical backtesting.** This needs harmonized historical data, parameter estimation, documented identification assumptions, holdout periods and comparison with benchmark models. Passing accounting tests or copying a paper's coefficient cannot substitute for that work. The app now explicitly says its paths are not validated forecasts.
2. **A synchronized and complete country calibration.** Policy rates, debt maturity, government consumption versus transfers, tax bases, trade exposure and labor-market institutions require comparable definitions and dates. The four reliable World Bank fields were refreshed; unverified fiscal components were not adjusted simply to force Japan's deficit, Sweden's balance or South Africa's trend toward numbers quoted in a review. Those preset fiscal levels remain illustrative.
3. **A full consumption/saving, private-wealth and international balance-sheet model.** Expenditure consumption still closes the national-accounts identity residually. The synthetic income panel is now internally reconciled for taxes and transfers, but it is not a complete household budget/wealth system; private saving, asset ownership, all interest-income counterparts and the full external account are not jointly solved. Fixing this requires a different model architecture and data calibration.
4. **Empirical wage distributions and reliable minimum-wage estimates.** The 100 income bins are synthetic. Country wage surveys, hours, employment participation, enforcement and actual policy coverage would be required for credible distributional forecasts. Broader assumptions and honest ranges improve exploration without inventing those data.
5. **Probabilistic uncertainty and complete long-run neutrality.** The parameter envelope is deterministic. The fiscal half-life is an explicit approximation. Estimating joint parameter uncertainty and an expectations/equilibrium system is required before calling the bands confidence intervals or the 20-year results reliable forecasts.
6. **Manual browser, mobile and screen-reader verification.** The browser denied access because its admin-enforced security policy could not be verified. No alternate route was used to bypass that check. Interface fixes were implemented, but visual and interaction quality cannot be claimed as verified until this access issue is resolved.
7. **Pruning the unused UI starter catalogue and its lint warnings.** These components are not used by the simulator and were preserved under the Sites workflow's instruction against unrelated starter cleanup. They are tree-shaken, and the current dependency audit is clean. The active application files pass their focused check; catalogue cleanup remains separate maintenance.

Two proposed tests were deliberately not copied literally: forcing every observed country to remain within one percentage point of its initial rate/inflation/unemployment would conceal genuine transitional dynamics; forcing every total policy price effect to match the direct pass-through coefficient would suppress valid demand and monetary feedback. A controlled steady-state test and an isolated direct-cost price test address the actual defects instead.
