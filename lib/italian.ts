import { italianV2 } from './italian-v2.ts';
/** Italian interface copy. English keys preserve the existing English interface. */
export const italian: Record<string, string> = {
  English: 'English',
  Italiano: 'Italiano',
  Language: 'Lingua',
  'Interface language': 'Lingua dell’interfaccia',
  Close: 'Chiudi',
  Today: 'Oggi',
  'Year {year} · Q{quarter}': 'Anno {year} · T{quarter}',
  'Year {year}': 'Anno {year}',
  'About {label}': 'Informazioni: {label}',
  '{name} across {years} years. Selected {period}: scenario {scenario}, baseline {baseline}. Use the time slider for precise values.':
    '{name} su {years} anni. Periodo selezionato: {period}. Scenario: {scenario}; scenario di base: {baseline}. Usa il cursore del tempo per i valori precisi.',
  'Output is {change}% {direction} than the baseline.':
    'La produzione è {direction} del {change}% rispetto allo scenario di base.',
  higher: 'superiore',
  lower: 'inferiore',
  more: 'in più',
  fewer: 'in meno',
  'At {period}, the model implies about {jobs} {direction} employed people and an inflation difference of {inflation} percentage points. These are conditional model results.':
    'Nel periodo {period}, il modello indica circa {jobs} occupati {direction} e una differenza di inflazione di {inflation} punti percentuali. Questi risultati dipendono dalle ipotesi del modello.',
  '{format} exported.': 'Esportazione {format} completata.',
  'Changing language loads its default country and resets policies.':
    'Il cambio di lingua carica il paese predefinito e reimposta le politiche.',
  Base: 'Base',
  Baseline: 'Scenario di base',
  'points vs. baseline': 'punti rispetto alla base',
  'vs. baseline': 'rispetto alla base',
  pp: 'p.p.',
  ' pp of median': ' p.p. della mediana',
  'Who feels the change?': 'Chi risente del cambiamento?',
  'Real disposable income vs. no new policy, by starting wage group.':
    'Reddito disponibile reale rispetto allo scenario senza nuove politiche, per fascia salariale iniziale.',
  'Lowest 20%': '20% più basso',
  'Lower middle': 'Medio-basso',
  'Middle 20%': '20% centrale',
  'Upper middle': 'Medio-alto',
  'Highest 20%': '20% più alto',
  'MODELED INCOME DISPERSION': 'DISPERSIONE DEI REDDITI NEL MODELLO',
  'WORKERS AFFECTED BY HIGHER FLOOR': 'LAVORATORI INTERESSATI DAL NUOVO MINIMO',
  'of starting workers': 'dei lavoratori iniziali',
  '100 synthetic wage groups, summarized into quintiles. Includes expected employment losses, transfers, taxes, and a stylized capital-income component. This is not a survey-based poverty or national Gini estimate.':
    '100 gruppi salariali sintetici, riassunti in quintili. Include le perdite occupazionali attese, i trasferimenti, le imposte e una componente semplificata di reddito da capitale. Non è una stima della povertà o dell’indice di Gini nazionale basata su indagini statistiche.',
  'The public balance sheet': 'Il bilancio pubblico',
  'Annualized flows as a share of current nominal GDP.':
    'Flussi annualizzati in percentuale del PIL nominale corrente.',
  'Public finances': 'Finanze pubbliche',
  Scenario: 'Scenario',
  'No new policy': 'Senza nuove politiche',
  Change: 'Variazione',
  'Public revenue': 'Entrate pubbliche',
  'Total expenditure': 'Spesa totale',
  'Interest payments': 'Spesa per interessi',
  'Primary balance': 'Saldo primario',
  'Overall balance': 'Saldo complessivo',
  'Public debt': 'Debito pubblico',
  'Borrowing adds to the debt stock every quarter. Growth and inflation also change the GDP denominator. Transfers count in the budget, but do not count directly as GDP.':
    'L’indebitamento aumenta lo stock di debito ogni trimestre. Crescita e inflazione modificano anche il PIL al denominatore. I trasferimenti rientrano nel bilancio, ma non contribuiscono direttamente al PIL.',
  Framework: 'Modello',
  Equations: 'Equazioni',
  'Country data': 'Dati del paese',
  Sources: 'Fonti',
  'A connected economy, one quarter at a time.':
    'Un’economia interconnessa, un trimestre alla volta.',
  'A calibrated, backward-looking semi-structural model combines an output-gap equation, a Phillips curve, a monetary-policy rule, capital accumulation, a synthetic wage distribution, and explicit government debt accounting. It is inspired by projection-model methods; it is not an IMF model or an estimated DSGE.':
    'Un modello semistrutturale calibrato, con dinamiche basate sui periodi precedenti, combina un’equazione dell’output gap, una curva di Phillips, una regola di politica monetaria, l’accumulazione di capitale, una distribuzione salariale sintetica e una contabilità esplicita del debito pubblico. Si ispira ai metodi dei modelli di previsione; non è un modello del FMI né un modello DSGE stimato.',
  Demand: 'Domanda',
  Supply: 'Offerta',
  Labor: 'Lavoro',
  'Prices & money': 'Prezzi e moneta',
  Government: 'Settore pubblico',
  Households: 'Famiglie',
  'Purchases, transfers, taxes, wages, interest rates, and trade move spending. Import dependence and spare capacity change fiscal effects.':
    'Acquisti, trasferimenti, imposte, salari, tassi di interesse e commercio influenzano la spesa. La dipendenza dalle importazioni e la capacità produttiva inutilizzata modificano gli effetti della politica fiscale.',
  'Private investment, public infrastructure, worker inflows, and delayed training investment change productive capacity.':
    'Gli investimenti privati, le infrastrutture pubbliche, gli afflussi di lavoratori e gli effetti ritardati della formazione modificano la capacità produttiva.',
  '100 equal-population wage groups determine wage coverage and hiring effects. Informality reduces enforcement; employer market power can offset small wage-cost increases.':
    '100 gruppi salariali di uguale numerosità determinano la copertura del salario minimo e gli effetti sulle assunzioni. Il lavoro informale riduce l’applicazione della norma; il potere di mercato dei datori di lavoro può compensare piccoli aumenti del costo del lavoro.',
  'Demand, wage costs, tariffs, and energy affect inflation. An optional central-bank rule raises rates, cooling demand and investment.':
    'Domanda, costi salariali, dazi ed energia influenzano l’inflazione. Una regola opzionale della banca centrale aumenta i tassi, frenando domanda e investimenti.',
  'Revenue, purchases, transfers, automatic stabilizers, and gradually repricing debt determine quarterly borrowing.':
    'Entrate, acquisti, trasferimenti, stabilizzatori automatici e il graduale adeguamento degli interessi sul debito determinano l’indebitamento trimestrale.',
  'Expected earnings, employment, taxes, transfers, prices, and stylized capital income produce a synthetic distribution.':
    'Redditi da lavoro attesi, occupazione, imposte, trasferimenti, prezzi e redditi da capitale semplificati generano una distribuzione sintetica.',
  'How to read the sensitivity band': 'Come leggere la fascia di sensibilità',
  '27 deterministic combinations vary the fiscal multiplier by −25% / 0 / +25%, hiring sensitivity by −50% / 0 / +50%, and wage-cost pass-through by −25% / 0 / +25%, within their allowed ranges. Each has its own matched no-policy baseline. The envelope of policy differences is added to the central baseline. It is an assumption-sensitivity range, not a confidence interval or probability forecast.':
    '27 combinazioni deterministiche variano il moltiplicatore fiscale del −25% / 0 / +25%, la sensibilità delle assunzioni del −50% / 0 / +50% e la trasmissione dei costi salariali ai prezzi del −25% / 0 / +25%, entro i limiti consentiti. Ogni combinazione ha il proprio scenario di base senza nuove politiche. L’intervallo delle differenze dovute alle politiche viene aggiunto allo scenario di base centrale. È una fascia di sensibilità alle ipotesi, non un intervallo di confidenza né una previsione probabilistica.',
  'Where this model stops': 'I limiti del modello',
  'Coefficients and wage distributions are illustrative; no country-specific econometric estimation or historical backtesting has been performed. Expenditure components are an accounting decomposition, with consumption as the residual of GDP. The model does not clear every market or track all private balance sheets. It does not model banks, defaults, expectations optimization, industry detail, housing, evasion responses, or crises. Large policy changes and long horizons are exploratory extrapolations.':
    'I coefficienti e le distribuzioni salariali sono illustrativi: non sono state effettuate stime econometriche specifiche per paese né verifiche su dati storici. Le componenti della spesa sono una scomposizione contabile, con i consumi come residuo del PIL. Il modello non determina l’equilibrio di ogni mercato e non tiene traccia di tutti i bilanci privati. Non rappresenta banche, insolvenze, ottimizzazione delle aspettative, singoli settori, mercato immobiliare, reazioni dell’evasione fiscale o crisi. Grandi cambiamenti di politica e orizzonti lunghi sono estrapolazioni esplorative.',
  'For Sweden and Italy, a zero statutory floor does not imply unregulated wages: collective bargaining is absorbed into the synthetic starting wage distribution. For euro-area members, the monetary controls describe a hypothetical currency-area response, not unilateral national authority.':
    'Per Svezia e Italia, un minimo legale pari a zero non implica salari privi di regole: la contrattazione collettiva è incorporata nella distribuzione salariale sintetica iniziale. Per i paesi dell’area euro, i controlli monetari descrivono una risposta ipotetica dell’intera area valutaria, non una decisione nazionale unilaterale.',
  'Core relationships': 'Relazioni principali',
  'All rates are annual percentages; one time step is one quarter. “pp” means percentage points. The scenario export records all inputs, assumptions, and quarterly outputs so experiments can be reproduced with this model version.':
    'Tutti i tassi sono percentuali annue; ogni passo temporale corrisponde a un trimestre. “p.p.” significa punti percentuali. L’esportazione dello scenario registra tutti i dati iniziali, le ipotesi e i risultati trimestrali per consentire di riprodurre gli esperimenti con questa versione del modello.',
  'Real output': 'Produzione reale',
  'Y = Y* × (1 + output gap / 100)': 'Y = Y* × (1 + output gap / 100)',
  'Potential output follows the calibrated growth trend, multiplied by relative private capital^0.32, additional labor^0.68, public capital effects, training productivity, and the structural hiring effect.':
    'La produzione potenziale segue la crescita tendenziale calibrata, moltiplicata per il capitale privato relativo^0,32, il lavoro aggiuntivo^0,68, gli effetti del capitale pubblico, la produttività della formazione e l’effetto strutturale sulle assunzioni.',
  'Demand adjustment': 'Adeguamento della domanda',
  'gap[t] = 0.74 × gap[t−1] + 0.26 × targetGap':
    'gap[t] = 0,74 × gap[t−1] + 0,26 × gapObiettivo',
  'The target combines fiscal demand, wage-income demand, trade, real interest-rate restraint, energy costs, and migration adjustment. Fiscal strength is adjusted by (1 − import share / 125) and spare capacity.':
    'L’obiettivo combina domanda fiscale, domanda generata dai redditi salariali, commercio, effetto restrittivo dei tassi reali, costi energetici e adeguamento alla migrazione. L’intensità fiscale è corretta per (1 − quota di importazioni / 125) e per la capacità inutilizzata.',
  'Prices & central bank': 'Prezzi e banca centrale',
  'π[t] = 0.86π[t−1] + 0.14π* + κ × gap + 4Δcost + FX effect':
    'π[t] = 0,86π[t−1] + 0,14π* + κ × gap + 4Δcosti + effetto cambio',
  'i* = π* + r* + 1.5(π − π*) + 0.5gap + policy offset':
    'i* = π* + r* + 1,5(π − π*) + 0,5gap + correzione di politica',
  'The automatic rate moves 20% toward the rule each quarter. The fixed-rate option uses the initial policy rate plus the policy offset.':
    'Il tasso automatico colma ogni trimestre il 20% della distanza dalla regola. L’opzione a tasso fisso usa il tasso iniziale più la variazione di politica scelta.',
  Employment: 'Occupazione',
  'u* = structural u − Okun coefficient × gap − direct hiring effect':
    'u* = u strutturale − coefficiente di Okun × gap − effetto diretto sulle assunzioni',
  'Unemployment moves 35% toward its target each quarter. Direct hiring depends on log wage changes, wage sensitivity, market power, and compliance. Employment = labor force × (1 − unemployment).':
    'La disoccupazione colma ogni trimestre il 35% della distanza dal proprio obiettivo. Le assunzioni dirette dipendono dalle variazioni logaritmiche dei salari, dalla sensibilità ai salari, dal potere di mercato e dal rispetto della norma. Occupazione = forza lavoro × (1 − disoccupazione).',
  'Government debt': 'Debito pubblico',
  'Debt[t] = Debt[t−1] + (annual spending − annual revenue) / 4':
    'Debito[t] = Debito[t−1] + (spesa annua − entrate annue) / 4',
  'Nominal GDP = initial GDP × real output index × price index / 10,000':
    'PIL nominale = PIL iniziale × indice della produzione reale × indice dei prezzi / 10.000',
  'Debt service uses a rate that reprices 4% of the gap each quarter. Revenue includes effective income/profit tax changes and tariff receipts. Gross debt cannot go below zero; surplus assets beyond that point are not tracked.':
    'Il servizio del debito usa un tasso che colma ogni trimestre il 4% della distanza dal tasso corrente. Le entrate includono le variazioni delle imposte effettive su redditi e profitti e il gettito dei dazi. Il debito lordo non può scendere sotto zero; le attività accumulate grazie agli avanzi successivi non sono rilevate.',
  'National accounts': 'Contabilità nazionale',
  'Y = C + I + G + X − M': 'Y = C + I + G + X − M',
  'Government investment is in I; transfers are excluded from G. C is the residual for accounting consistency. Prices and exchange rates are reduced-form proxies; GDP size stays in starting-year USD equivalents, not predicted dollar exchange values.':
    'Gli investimenti pubblici sono inclusi in I; i trasferimenti sono esclusi da G. C è il residuo che garantisce la coerenza contabile. Prezzi e tassi di cambio sono rappresentazioni semplificate; la dimensione del PIL resta espressa in dollari equivalenti dell’anno iniziale, non in valori previsti del cambio con il dollaro.',
  'Timing & boundaries': 'Tempi e limiti',
  'Policies phase in over the selected number of quarters and can expire. Existing public capital and training effects persist after expiration. Energy and foreign-demand shocks decay with half-lives of four and eight quarters, independent of policy duration. Output gaps, inflation, rates, and employment have explicit numerical bounds. The app flags scenarios that reach key stability limits.':
    'Le politiche entrano in vigore gradualmente nel numero di trimestri scelto e possono scadere. Il capitale pubblico esistente e gli effetti della formazione persistono dopo la scadenza. Gli shock energetici e della domanda estera si dimezzano rispettivamente ogni quattro e otto trimestri, indipendentemente dalla durata della politica. Output gap, inflazione, tassi e occupazione hanno limiti numerici espliciti. L’app segnala gli scenari che raggiungono i principali limiti di stabilità.',
  ': what is measured?': ': quali dati sono misurati?',
  'GDP size anchor ·': 'PIL di riferimento ·',
  'in current USD, from the linked World Bank snapshot. Snapshots can change after statistical revisions.':
    'in dollari correnti, dalla rilevazione della Banca Mondiale collegata. I dati possono cambiare a seguito di revisioni statistiche.',
  'All other preset values are calibration assumptions':
    'Tutti gli altri valori predefiniti sono ipotesi di calibrazione',
  'Population, workforce, inflation, unemployment, growth, public finances, trade, informality, and the wage distribution are rounded illustrative inputs chosen to represent different economic structures. They are not a harmonized national statistical dataset or a current forecast.':
    'Popolazione, forza lavoro, inflazione, disoccupazione, crescita, finanze pubbliche, commercio, informalità e distribuzione salariale sono valori illustrativi arrotondati, scelti per rappresentare strutture economiche diverse. Non costituiscono un insieme armonizzato di statistiche nazionali né una previsione aggiornata.',
  '“Today” means the start of your hypothetical scenario. It does not mean the country’s economy on today’s calendar date. Editing any country slider creates a custom version of that preset.':
    '“Oggi” indica l’inizio dello scenario ipotetico. Non descrive l’economia del paese alla data odierna. Modificare un cursore del paese crea una versione personalizzata del profilo predefinito.',
  Parameter: 'Parametro',
  'Current input': 'Valore attuale',
  Provenance: 'Provenienza',
  'Editable calibration': 'Calibrazione modificabile',
  'Sources checked September 7, 2026. Research informs the mechanisms, not a claim that these coefficients have been empirically validated.':
    'Fonti consultate il 7 settembre 2026. La ricerca informa i meccanismi del modello; ciò non significa che i coefficienti siano stati validati empiricamente.',
  'Country loaded. Policies reset to its starting conditions.':
    'Paese caricato. Le politiche sono state reimpostate alle condizioni iniziali.',
  'Example applied. Adjust any slider to make it yours.':
    'Esempio applicato. Personalizzalo modificando i cursori.',
  'ECONOMY SIMULATOR': 'SIMULATORE ECONOMICO',
  'Scenario lab': 'Laboratorio di scenari',
  'Model & sources': 'Modello e fonti',
  'THE POLICY WORKBENCH': 'IL LABORATORIO DELLE POLITICHE',
  'Small changes.': 'Piccoli cambiamenti.',
  'Economy-wide effects.': 'Effetti su tutta l’economia.',
  'Build a country. Change a policy. Explore what happens next.':
    'Configura un paese. Cambia una politica. Esplora le conseguenze.',
  'QUARTERLY MODEL': 'MODELLO TRIMESTRALE',
  'Your economy': 'La tua economia',
  'Country preset': 'Paese predefinito',
  Customized: 'Personalizzato',
  'GDP ·': 'PIL ·',
  'Population*': 'Popolazione*',
  'Inflation*': 'Inflazione*',
  'Customize starting conditions': 'Personalizza le condizioni iniziali',
  '*Illustrative assumptions. GDP is a sourced size anchor. Changes here affect both the policy and baseline economies.':
    '*Ipotesi illustrative. Il PIL di riferimento proviene da una fonte statistica. Queste modifiche si applicano sia allo scenario di politica sia a quello di base.',
  'Restore country preset': 'Ripristina il paese predefinito',
  'Policy experiment': 'Esperimento di politica',
  'Timing & central bank': 'Tempi e banca centrale',
  'Start after': 'Inizio dopo',
  'Policy start quarter': 'Trimestre di avvio della politica',
  'Now · next quarter': 'Ora · prossimo trimestre',
  '1 year': '1 anno',
  '2 years': '2 anni',
  '4 years': '4 anni',
  'Phase in over': 'Introduzione in',
  'Policy phase-in period': 'Periodo di introduzione graduale',
  Immediately: 'Immediata',
  '3 years': '3 anni',
  'Policy duration': 'Durata della politica',
  Permanent: 'Permanente',
  '5 years': '5 anni',
  'Automatic rate response': 'Risposta automatica dei tassi',
  'The central bank responds to inflation and demand.':
    'La banca centrale reagisce all’inflazione e alla domanda.',
  'Interest rates stay at their starting value plus your policy adjustment.':
    'I tassi restano al valore iniziale più la variazione di politica scelta.',
  ' For this euro-area preset, monetary controls represent a hypothetical currency-area response.':
    ' Per questo paese dell’area euro, i controlli monetari rappresentano una risposta ipotetica dell’intera area valutaria.',
  'External shocks decay independently of the policy duration.':
    'Gli shock esterni si attenuano indipendentemente dalla durata della politica.',
  'All policies reset. Scenario now matches the no-policy baseline.':
    'Tutte le politiche sono state reimpostate. Lo scenario ora coincide con quello di base, senza nuove politiche.',
  'Reset policies': 'Reimposta le politiche',
  'Model assumptions': 'Ipotesi del modello',
  'Country-inspired calibration.': 'Calibrazione ispirata ai paesi.',
  'Explore scenarios, not forecasts.': 'Esplora scenari, non previsioni.',
  'SIMULATION OUTLOOK': 'RISULTATI DELLA SIMULAZIONE',
  in: 'in',
  'Live scenario': 'Scenario in tempo reale',
  'Simulation horizon': 'Orizzonte di simulazione',
  '5-year horizon': 'Orizzonte: 5 anni',
  '10-year horizon': 'Orizzonte: 10 anni',
  '20-year horizon': 'Orizzonte: 20 anni',
  'These starting conditions conflict.':
    'Queste condizioni iniziali sono incompatibili.',
  'Output index · start = 100': 'Indice della produzione · inizio = 100',
  'Share of nominal GDP': 'Quota del PIL nominale',
  'Annualized quarterly rate': 'Tasso trimestrale annualizzato',
  'Share of labor force': 'Quota della forza lavoro',
  'How the economy evolves': 'Come evolve l’economia',
  'Chart outcome': 'Indicatore del grafico',
  'Policy scenario': 'Scenario di politica',
  'Sensitivity range': 'Fascia di sensibilità',
  'Pause simulation playback': 'Metti in pausa la simulazione',
  'Play simulation timeline': 'Avvia la sequenza temporale',
  'Selected simulation quarter': 'Trimestre selezionato',
  'Shading shows 27 assumption combinations, not a statistical confidence interval.':
    'La fascia rappresenta 27 combinazioni di ipotesi, non un intervallo di confidenza statistico.',
  'The baseline uses your same starting conditions, without the policy changes.':
    'Lo scenario di base usa le stesse condizioni iniziali, senza le modifiche di politica.',
  'What would you change?': 'Cosa cambieresti?',
  'The lines overlap until you change a policy. Try an experiment.':
    'Le linee coincidono finché non modifichi una politica. Prova un esperimento.',
  'Raise the wage floor': 'Alza il salario minimo',
  'Build infrastructure': 'Investi in infrastrutture',
  'Raise interest rates': 'Alza i tassi di interesse',
  'Your experiment begins next.': 'Il tuo esperimento sta per iniziare.',
  'The overall output effect is small.':
    'L’effetto complessivo sulla produzione è contenuto.',
  'Move the time slider to follow the policy effects.':
    'Sposta il cursore del tempo per seguire gli effetti della politica.',
  'All outcomes': 'Tutti i risultati',
  Outcome: 'Indicatore',
  Unit: 'Unità',
  'Employment levels use the calibrated population and workforce share. A growth rate can differ from a level change; the GDP chart displays levels. Income results are synthetic expected income.':
    'I livelli occupazionali usano la popolazione e la quota di forza lavoro calibrate. Un tasso di crescita è diverso da una variazione di livello; il grafico del PIL mostra i livelli. I risultati sui redditi rappresentano redditi attesi sintetici.',
  'Conditional scenarios. No historical backtesting.':
    'Scenari condizionati alle ipotesi. Nessuna verifica su dati storici.',
  'Full scenario': 'Scenario completo',
  'Think in systems.': 'Pensa per sistemi.',
  'Transparent assumptions. Open methodology.':
    'Ipotesi trasparenti. Consulta la metodologia.',
  'UNDER THE HOOD': 'COME FUNZIONA',
  'Understand the mechanisms, inspect the assumptions, and know the limits.':
    'Comprendi i meccanismi, esamina le ipotesi e conosci i limiti.',
  'MAKE THE ASSUMPTIONS YOURS': 'PERSONALIZZA LE IPOTESI',
  'These are calibrated choices, not measured constants. Changes apply to the scenario and its matching baseline.':
    'Queste sono scelte di calibrazione, non costanti misurate. Le modifiche si applicano allo scenario e alla corrispondente base di confronto.',
  'Restore default assumptions': 'Ripristina le ipotesi predefinite',
  'United States': 'Stati Uniti',
  'Large domestic market': 'Ampio mercato interno',
  Germany: 'Germania',
  'Export-led industrial economy': 'Economia industriale orientata all’export',
  Sweden: 'Svezia',
  'Open economy · broad safety net':
    'Economia aperta · ampia protezione sociale',
  Japan: 'Giappone',
  'Aging population · high debt': 'Popolazione anziana · debito elevato',
  Brazil: 'Brasile',
  'Emerging market · informal work': 'Mercato emergente · lavoro informale',
  India: 'India',
  'Fast growth · young workforce': 'Crescita rapida · forza lavoro giovane',
  Italy: 'Italia',
  'Mature economy · limited fiscal space':
    'Economia matura · margini fiscali limitati',
  'South Africa': 'Sudafrica',
  'High unemployment · supply constraints':
    'Disoccupazione elevata · vincoli produttivi',
  'Jobs & wages': 'Lavoro e salari',
  'Minimum wage': 'Salario minimo',
  '% median': '% mediana',
  'Statutory wage floor relative to the starting median wage. Indexed to underlying nominal wages; 0 means no statutory floor. Coverage is modeled from the wage distribution and informality.':
    'Salario minimo legale rispetto al salario mediano iniziale. È indicizzato ai salari nominali sottostanti; 0 indica l’assenza di un minimo legale. La copertura dipende dalla distribuzione salariale e dal lavoro informale.',
  'Income tax change': 'Variazione imposta sui redditi',
  'Change in the effective tax rate on labor income. The government budget includes the revenue effect.':
    'Variazione dell’aliquota effettiva sui redditi da lavoro. Il bilancio pubblico include l’effetto sul gettito.',
  'Working-age migration': 'Migrazione in età lavorativa',
  '% labor force/yr': '% forza lavoro/anno',
  'Additional net workers each year, relative to the starting labor force. Capital and demand take time to adjust.':
    'Lavoratori netti aggiuntivi ogni anno, in rapporto alla forza lavoro iniziale. Capitale e domanda richiedono tempo per adeguarsi.',
  'Education & training': 'Istruzione e formazione',
  '% GDP': '% PIL',
  'Additional annual public spending. Productivity improves gradually, after an eight-quarter lag.':
    'Spesa pubblica annua aggiuntiva. La produttività migliora gradualmente dopo un ritardo di otto trimestri.',
  'Tax & spending': 'Fisco e spesa',
  'Government purchases': 'Acquisti pubblici',
  'Additional annual public consumption, relative to the no-policy trend GDP. Negative values are spending cuts.':
    'Consumi pubblici annui aggiuntivi, in rapporto al PIL tendenziale senza nuove politiche. I valori negativi indicano tagli alla spesa.',
  'Household transfers': 'Trasferimenti alle famiglie',
  'Additional annual payments, weighted toward lower earners. Financed through taxes or borrowing.':
    'Pagamenti annui aggiuntivi, con maggiore peso per i redditi bassi. Sono finanziati con imposte o indebitamento.',
  'Infrastructure investment': 'Investimenti infrastrutturali',
  'Additional annual public investment. Demand rises first; productive public capital becomes available after four quarters.':
    'Investimenti pubblici annui aggiuntivi. La domanda aumenta subito; il capitale pubblico produttivo diventa disponibile dopo quattro trimestri.',
  'Corporate tax change': 'Variazione imposta sui profitti',
  'Change in the effective tax rate on a stylized corporate-profit base of 20% of GDP.':
    'Variazione dell’aliquota effettiva su una base semplificata di profitti societari pari al 20% del PIL.',
  'Money & trade': 'Moneta e scambi',
  'Interest-rate adjustment': 'Variazione del tasso',
  'Offset to the automatic central-bank rule, or to the initial policy rate when automatic response is off. A −0.5% lower bound applies.':
    'Correzione alla regola automatica della banca centrale, oppure al tasso iniziale se la risposta automatica è disattivata. Si applica un limite inferiore del −0,5%.',
  'Additional import tariff': 'Dazio aggiuntivo sulle importazioni',
  'A broad tariff raises import prices, reduces trade, creates revenue, and triggers assumed partial retaliation.':
    'Un dazio generalizzato aumenta i prezzi delle importazioni, riduce gli scambi, genera gettito e provoca una ritorsione parziale ipotizzata dal modello.',
  'External shocks': 'Shock esterni',
  'Energy price shock': 'Shock dei prezzi energetici',
  'A temporary change in world energy prices. Begins at the selected start quarter and decays with a four-quarter half-life.':
    'Variazione temporanea dei prezzi energetici mondiali. Inizia nel trimestre scelto e si dimezza ogni quattro trimestri.',
  'Foreign demand shock': 'Shock della domanda estera',
  'Temporary change in demand for exports. Decays with an eight-quarter half-life.':
    'Variazione temporanea della domanda di esportazioni. Si dimezza ogni otto trimestri.',
  'Trend output growth': 'Crescita tendenziale',
  '%/yr': '%/anno',
  'Calibrated long-run growth in real output, including normal investment and workforce growth.':
    'Crescita di lungo periodo calibrata della produzione reale, comprensiva dei normali investimenti e della crescita della forza lavoro.',
  'Starting inflation': 'Inflazione iniziale',
  'Annualized starting inflation. Calibrated assumption, not a live statistical release.':
    'Inflazione iniziale annualizzata. È un’ipotesi calibrata, non una rilevazione statistica in tempo reale.',
  'Starting unemployment': 'Disoccupazione iniziale',
  'Share of the labor force without work. The model treats this as the initial structural benchmark.':
    'Quota della forza lavoro senza impiego. Il modello la tratta come riferimento strutturale iniziale.',
  'Starting gross government debt. Calibrated general-government-style assumption; not World Bank central-government debt.':
    'Debito pubblico lordo iniziale. Ipotesi calibrata riferita al settore delle amministrazioni pubbliche; non è il dato della Banca Mondiale sul debito del governo centrale.',
  'Starting policy rate': 'Tasso di interesse iniziale',
  'Starting annual nominal interest rate; the existing debt stock reprices gradually.':
    'Tasso nominale annuo iniziale; gli interessi sul debito esistente si adeguano gradualmente.',
  'Inflation target': 'Obiettivo di inflazione',
  'Long-run inflation anchor and target for automatic monetary policy.':
    'Riferimento di inflazione di lungo periodo e obiettivo della politica monetaria automatica.',
  'Import dependence': 'Dipendenza dalle importazioni',
  'Initial import share. More imports mean more demand leaks abroad.':
    'Quota iniziale delle importazioni. Più importazioni implicano una maggiore quota di domanda rivolta all’estero.',
  Exports: 'Esportazioni',
  'Initial export share. A higher share raises exposure to foreign demand and exchange rates.':
    'Quota iniziale delle esportazioni. Una quota maggiore aumenta l’esposizione alla domanda estera e ai tassi di cambio.',
  'Private investment': 'Investimenti privati',
  'Initial real private investment share. Capital depreciates and adjusts over time.':
    'Quota iniziale degli investimenti privati reali. Il capitale si deprezza e si adegua nel tempo.',
  'Initial government consumption share, excluding transfers and debt service.':
    'Quota iniziale dei consumi pubblici, esclusi trasferimenti e servizio del debito.',
  'Effective total public revenue relative to nominal output before policy changes.':
    'Entrate pubbliche totali effettive in rapporto alla produzione nominale prima delle modifiche di politica.',
  'Existing transfers': 'Trasferimenti esistenti',
  'Initial annual social transfers. Kept separate from government purchases in GDP.':
    'Trasferimenti sociali annui iniziali. Nel PIL sono trattati separatamente dagli acquisti pubblici.',
  'Informal employment': 'Occupazione informale',
  'Share of workers assumed outside statutory minimum-wage enforcement.':
    'Quota di lavoratori per i quali si presume non venga applicato il salario minimo legale.',
  'Workforce growth': 'Crescita della forza lavoro',
  'Baseline labor-force growth. Normal growth is already embedded in trend output; changes affect the decomposition.':
    'Crescita della forza lavoro nello scenario di base. La crescita ordinaria è già inclusa nella produzione tendenziale; le modifiche ne influenzano la scomposizione.',
  'Wage dispersion': 'Dispersione salariale',
  'Log wage dispersion in a synthetic 100-group labor market; not an observed national income distribution.':
    'Dispersione logaritmica dei salari in un mercato del lavoro sintetico di 100 gruppi; non è una distribuzione nazionale dei redditi osservata.',
  'Spare capacity / overheating': 'Capacità inutilizzata / surriscaldamento',
  '% output gap': '% output gap',
  'Negative values mean spare capacity; positive values mean output is above sustainable capacity.':
    'I valori negativi indicano capacità inutilizzata; quelli positivi indicano produzione superiore alla capacità sostenibile.',
  'Hiring sensitivity to wage costs': 'Sensibilità delle assunzioni ai salari',
  elasticity: 'elasticità',
  'A 1% wage rise for affected workers changes their employment by approximately minus this percent before market-power offsets.':
    'Un aumento salariale dell’1% per i lavoratori interessati riduce la loro occupazione di circa questa percentuale, prima delle compensazioni dovute al potere di mercato.',
  'Employer market-power offset': 'Compensazione del potere datoriale',
  coefficient: 'coefficiente',
  'Allows modest wage floors to improve retention and hiring. This benefit fades for high wage floors.':
    'Consente a salari minimi moderati di favorire la permanenza dei lavoratori e le assunzioni. Il beneficio si attenua con salari minimi elevati.',
  'Lower-income spending response': 'Spesa dei redditi più bassi',
  MPC: 'PMC',
  'Share of additional income spent by lower earners.':
    'Quota di reddito aggiuntivo spesa da chi ha redditi più bassi.',
  'Higher-income spending response': 'Spesa dei redditi più alti',
  'Share of additional income spent by higher earners.':
    'Quota di reddito aggiuntivo spesa da chi ha redditi più alti.',
  'Fiscal demand strength': 'Intensità della domanda fiscale',
  multiplier: 'moltiplicatore',
  'Base spending multiplier; adjusted for import leakage, spare capacity, and household spending.':
    'Moltiplicatore di base della spesa; corretto per domanda rivolta alle importazioni, capacità inutilizzata e spesa delle famiglie.',
  'Inflation response to demand': 'Inflazione in risposta alla domanda',
  'Annualized inflation response to a one-point output gap per quarterly step.':
    'Risposta dell’inflazione annualizzata a un punto di output gap in ogni passo trimestrale.',
  'Cost-to-price pass-through': 'Trasmissione dei costi ai prezzi',
  share: 'quota',
  'Share of labor-cost changes passed into prices; remaining incidence falls on firms.':
    'Quota delle variazioni del costo del lavoro trasferita ai prezzi; la parte restante ricade sulle imprese.',
  'Investment response to rates': 'Investimenti in risposta ai tassi',
  'Private investment sensitivity to the real borrowing-rate gap.':
    'Sensibilità degli investimenti privati allo scostamento del tasso reale di finanziamento.',
  'Jobs response to output': 'Occupazione in risposta al PIL',
  'Unemployment-point change associated with a one-point output gap.':
    'Variazione in punti della disoccupazione associata a un punto di output gap.',
  'Neutral real interest rate': 'Tasso reale neutrale',
  'Real interest rate consistent with neither stimulating nor restraining demand.':
    'Tasso di interesse reale che non stimola né frena la domanda.',
  'Capital depreciation': 'Deprezzamento del capitale',
  'Annual wear on private and public capital stocks.':
    'Usura annua degli stock di capitale privato e pubblico.',
  'These expenditure shares leave less than 15% of GDP for household consumption. Reduce exports, investment, or government purchases, or increase imports.':
    'Queste quote di spesa lasciano meno del 15% del PIL ai consumi delle famiglie. Riduci esportazioni, investimenti o acquisti pubblici, oppure aumenta le importazioni.',
  'GDP, population, and the labor force must be positive.':
    'PIL, popolazione e forza lavoro devono essere positivi.',
  'Invalid simulation timing or monetary setting.':
    'Tempi della simulazione o impostazione monetaria non validi.',
  '{label} must be between {min} and {max}.':
    '{label} deve essere compreso tra {min} e {max}.',
  'Invalid country value: {key}': 'Valore del paese non valido: {key}',
  'Output-gap stability boundary reached. Results outside normal model scope.':
    'Raggiunto il limite di stabilità dell’output gap. I risultati sono fuori dall’ambito ordinario del modello.',
  'Inflation stability boundary reached. This is a stress scenario, not a forecast.':
    'Raggiunto il limite di stabilità dell’inflazione. Questo è uno scenario di stress, non una previsione.',
  'Implied household consumption is non-positive. This combination is outside model scope.':
    'I consumi impliciti delle famiglie non sono positivi. Questa combinazione è fuori dall’ambito del modello.',
  'Gross public debt reaches zero; further surpluses are not tracked as public assets.':
    'Il debito pubblico lordo raggiunge zero; gli avanzi successivi non sono rilevati come attività pubbliche.',
  'Real GDP': 'PIL reale',
  index: 'indice',
  'Output volume · starting economy = 100':
    'Volume della produzione · economia iniziale = 100',
  Unemployment: 'Disoccupazione',
  'Share of the labor force without work':
    'Quota della forza lavoro senza impiego',
  Inflation: 'Inflazione',
  'Annualized quarterly price change':
    'Variazione trimestrale dei prezzi annualizzata',
  'Gross debt / annualized nominal GDP':
    'Debito lordo / PIL nominale annualizzato',
  'Real household income': 'Reddito reale delle famiglie',
  'Synthetic expected disposable income · start = 100':
    'Reddito disponibile atteso sintetico · inizio = 100',
  million: 'milioni',
  'Number of employed workers': 'Numero di lavoratori occupati',
  'Budget balance': 'Saldo di bilancio',
  'Public revenue minus total expenditure':
    'Entrate pubbliche meno spesa totale',
  'Policy interest rate': 'Tasso di politica monetaria',
  'Annual nominal central-bank rate':
    'Tasso nominale annuo della banca centrale',
  'World Bank: 2024 GDP ranking': 'Banca Mondiale: classifica del PIL 2024',
  'GDP size anchors for Germany, India, Italy, Brazil, and South Africa, rounded from the 2024 ranking snapshot. The live source may be revised.':
    'Valori del PIL di riferimento per Germania, India, Italia, Brasile e Sudafrica, arrotondati dalla classifica 2024. La fonte online può essere aggiornata.',
  'World Bank: United States': 'Banca Mondiale: Stati Uniti',
  '2024 GDP anchor: $28.75 trillion. Other preset fields are illustrative calibration.':
    'PIL di riferimento 2024: 28.750 miliardi di dollari. Gli altri valori predefiniti sono una calibrazione illustrativa.',
  'World Bank: Japan': 'Banca Mondiale: Giappone',
  '2024 GDP anchor: approximately $4.03 trillion. Other preset fields are illustrative calibration.':
    'PIL di riferimento 2024: circa 4.030 miliardi di dollari. Gli altri valori predefiniti sono una calibrazione illustrativa.',
  'World Bank: Sweden': 'Banca Mondiale: Svezia',
  '2025 GDP anchor: $669 billion. Other preset fields are illustrative calibration.':
    'PIL di riferimento 2025: 669 miliardi di dollari. Gli altri valori predefiniti sono una calibrazione illustrativa.',
  'IMF: Quarterly projection framework':
    'FMI: modello di previsione trimestrale',
  'Conceptual reference for output-gap, inflation, interest-rate, and exchange-rate links. Our coefficients are not estimated from this paper.':
    'Riferimento concettuale per i legami tra output gap, inflazione, tassi di interesse e tassi di cambio. I nostri coefficienti non sono stimati a partire da questo studio.',
  'IMF: Fiscal multiplier determinants':
    'FMI: determinanti dei moltiplicatori fiscali',
  'Reference for state dependence and import leakage. This app uses explicit illustrative calibrations.':
    'Riferimento per la dipendenza dalla congiuntura e la domanda rivolta alle importazioni. L’app usa calibrazioni illustrative esplicite.',
  'Nobel Prize: Understanding labor markets':
    'Premio Nobel: comprendere i mercati del lavoro',
  'Evidence motivating conditional minimum-wage effects rather than an assumed universal employment loss.':
    'Evidenze che motivano effetti condizionati del salario minimo, anziché una riduzione dell’occupazione assunta come universale.',
  ...italianV2,
};
