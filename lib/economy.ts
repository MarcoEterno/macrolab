/** MacroLab 1.0. A transparent, calibrated quarterly scenario model; not an estimated forecasting model.
 * GDP levels are in starting-year USD equivalents at a fixed exchange rate. Rates are annual percent.
 * Fiscal flows are annualized and divided by four before changing the nominal debt stock.
 */
export type Country = {id:string;name:string;flag:string;description:string;gdp:number;gdpYear:number;population:number;growth:number;inflation:number;unemployment:number;debt:number;rate:number;target:number;imports:number;exports:number;investment:number;government:number;revenue:number;transfers:number;laborForce:number;laborGrowth:number;informality:number;floor:number;dispersion:number;gap:number;currencyUnion?:boolean};
export const COUNTRIES:Country[]=[
 {id:'US',name:'United States',flag:'🇺🇸',description:'Large domestic market',gdp:28750,gdpYear:2024,population:340,growth:2,inflation:2.9,unemployment:4,debt:121,rate:4.5,target:2,imports:14,exports:11,investment:21,government:17,revenue:30,transfers:15,laborForce:50,laborGrowth:.5,informality:8,floor:35,dispersion:.65,gap:.5},
 {id:'DE',name:'Germany',flag:'🇩🇪',description:'Export-led industrial economy',gdp:4685.593,gdpYear:2024,population:83.5,growth:1.2,inflation:2.5,unemployment:3.5,debt:63,rate:3,target:2,imports:38,exports:43,investment:22,government:22,revenue:46,transfers:25,laborForce:54,laborGrowth:0,informality:10,floor:52,dispersion:.5,gap:-1,currencyUnion:true},
 {id:'SE',name:'Sweden',flag:'🇸🇪',description:'Open economy · broad safety net',gdp:669,gdpYear:2025,population:10.6,growth:1.8,inflation:2,unemployment:8,debt:34,rate:2.5,target:2,imports:48,exports:54,investment:25,government:26,revenue:48,transfers:21,laborForce:56,laborGrowth:.4,informality:8,floor:0,dispersion:.43,gap:-1},
 {id:'JP',name:'Japan',flag:'🇯🇵',description:'Aging population · high debt',gdp:4030,gdpYear:2024,population:124,growth:.8,inflation:2.7,unemployment:2.6,debt:240,rate:.5,target:2,imports:23,exports:22,investment:26,government:21,revenue:36,transfers:18,laborForce:56,laborGrowth:-.5,informality:10,floor:45,dispersion:.5,gap:-.3},
 {id:'BR',name:'Brazil',flag:'🇧🇷',description:'Emerging market · informal work',gdp:2185.822,gdpYear:2024,population:211,growth:2.3,inflation:4.4,unemployment:7,debt:87,rate:10.5,target:3,imports:16,exports:18,investment:17,government:20,revenue:38,transfers:20,laborForce:50,laborGrowth:.7,informality:40,floor:55,dispersion:.9,gap:.4},
 {id:'IN',name:'India',flag:'🇮🇳',description:'Fast growth · young workforce',gdp:3909.892,gdpYear:2024,population:1450,growth:6,inflation:4.9,unemployment:4.5,debt:82,rate:6.5,target:4,imports:24,exports:22,investment:32,government:11,revenue:22,transfers:13,laborForce:42,laborGrowth:1.2,informality:80,floor:25,dispersion:.85,gap:0},
 {id:'IT',name:'Italy',flag:'🇮🇹',description:'Mature economy · limited fiscal space',gdp:2380.825,gdpYear:2024,population:59,growth:.8,inflation:1.5,unemployment:6.5,debt:135,rate:3,target:2,imports:30,exports:33,investment:22,government:20,revenue:47,transfers:27,laborForce:44,laborGrowth:-.3,informality:18,floor:0,dispersion:.55,gap:-.5,currencyUnion:true},
 {id:'ZA',name:'South Africa',flag:'🇿🇦',description:'High unemployment · supply constraints',gdp:401.145,gdpYear:2024,population:64,growth:1.6,inflation:4.4,unemployment:32,debt:76,rate:8,target:4.5,imports:30,exports:31,investment:15,government:20,revenue:28,transfers:10,laborForce:40,laborGrowth:1,informality:30,floor:45,dispersion:1.05,gap:-2}
];
export type Policies={minimumWage:number;incomeTax:number;corporateTax:number;spending:number;transfers:number;infrastructure:number;rateChange:number;tariff:number;immigration:number;training:number;energyShock:number;worldDemand:number};
export type Assumptions={laborElasticity:number;marketPower:number;lowMpc:number;highMpc:number;fiscalMultiplier:number;phillips:number;passThrough:number;investmentSensitivity:number;okun:number;neutralRate:number;depreciation:number};
export type Settings={years:number;startQuarter:number;ramp:number;duration:number;automaticRates:boolean};
export const DEFAULT_ASSUMPTIONS:Assumptions={laborElasticity:.25,marketPower:.15,lowMpc:.9,highMpc:.55,fiscalMultiplier:1,phillips:.12,passThrough:.3,investmentSensitivity:.6,okun:.4,neutralRate:1,depreciation:5};
export const DEFAULT_SETTINGS:Settings={years:10,startQuarter:1,ramp:4,duration:0,automaticRates:true};
export const neutralPolicies=(c:Country):Policies=>({minimumWage:c.floor,incomeTax:0,corporateTax:0,spending:0,transfers:0,infrastructure:0,rateChange:0,tariff:0,immigration:0,training:0,energyShock:0,worldDemand:0});
export type ControlSpec={key:string;label:string;min:number;max:number;step:number;unit:string;description:string};
export const POLICY_GROUPS:{id:string;name:string;items:ControlSpec[]}[]=[
 {id:'labor',name:'Jobs & wages',items:[{key:'minimumWage',label:'Minimum wage',min:0,max:120,step:1,unit:'% median',description:'Statutory wage floor relative to the starting median wage. Indexed to underlying nominal wages; 0 means no statutory floor. Coverage is modeled from the wage distribution and informality.'},{key:'incomeTax',label:'Income tax change',min:-10,max:15,step:.5,unit:'pp',description:'Change in the effective tax rate on labor income. The government budget includes the revenue effect.'},{key:'immigration',label:'Working-age migration',min:-1,max:2,step:.1,unit:'% labor force/yr',description:'Additional net workers each year, relative to the starting labor force. Capital and demand take time to adjust.'},{key:'training',label:'Education & training',min:0,max:3,step:.1,unit:'% GDP',description:'Additional annual public spending. Productivity improves gradually, after an eight-quarter lag.'}]},
 {id:'fiscal',name:'Tax & spending',items:[{key:'spending',label:'Government purchases',min:-5,max:8,step:.1,unit:'% GDP',description:'Additional annual public consumption, relative to the no-policy trend GDP. Negative values are spending cuts.'},{key:'transfers',label:'Household transfers',min:-3,max:6,step:.1,unit:'% GDP',description:'Additional annual payments, weighted toward lower earners. Financed through taxes or borrowing.'},{key:'infrastructure',label:'Infrastructure investment',min:0,max:6,step:.1,unit:'% GDP',description:'Additional annual public investment. Demand rises first; productive public capital becomes available after four quarters.'},{key:'corporateTax',label:'Corporate tax change',min:-10,max:15,step:.5,unit:'pp',description:'Change in the effective tax rate on a stylized corporate-profit base of 20% of GDP.'}]},
 {id:'money',name:'Money & trade',items:[{key:'rateChange',label:'Interest-rate adjustment',min:-5,max:8,step:.25,unit:'pp',description:'Offset to the automatic central-bank rule, or to the initial policy rate when automatic response is off. A −0.5% lower bound applies.'},{key:'tariff',label:'Additional import tariff',min:0,max:30,step:1,unit:'pp',description:'A broad tariff raises import prices, reduces trade, creates revenue, and triggers assumed partial retaliation.'}]},
 {id:'shocks',name:'External shocks',items:[{key:'energyShock',label:'Energy price shock',min:-40,max:100,step:5,unit:'%',description:'A temporary change in world energy prices. Begins at the selected start quarter and decays with a four-quarter half-life.'},{key:'worldDemand',label:'Foreign demand shock',min:-10,max:10,step:.5,unit:'%',description:'Temporary change in demand for exports. Decays with an eight-quarter half-life.'}]}
];
export const COUNTRY_CONTROLS:ControlSpec[]=[
 {key:'growth',label:'Trend output growth',min:0,max:8,step:.1,unit:'%/yr',description:'Calibrated long-run growth in real output, including normal investment and workforce growth.'},
 {key:'inflation',label:'Starting inflation',min:-2,max:20,step:.1,unit:'%',description:'Annualized starting inflation. Calibrated assumption, not a live statistical release.'},
 {key:'unemployment',label:'Starting unemployment',min:1,max:40,step:.1,unit:'%',description:'Share of the labor force without work. The model treats this as the initial structural benchmark.'},
 {key:'debt',label:'Public debt',min:0,max:280,step:1,unit:'% GDP',description:'Starting gross government debt. Calibrated general-government-style assumption; not World Bank central-government debt.'},
 {key:'rate',label:'Starting policy rate',min:-.5,max:20,step:.25,unit:'%',description:'Starting annual nominal interest rate; the existing debt stock reprices gradually.'},
 {key:'target',label:'Inflation target',min:0,max:8,step:.25,unit:'%',description:'Long-run inflation anchor and target for automatic monetary policy.'},
 {key:'imports',label:'Import dependence',min:5,max:60,step:1,unit:'% GDP',description:'Initial import share. More imports mean more demand leaks abroad.'},
 {key:'exports',label:'Exports',min:5,max:60,step:1,unit:'% GDP',description:'Initial export share. A higher share raises exposure to foreign demand and exchange rates.'},
 {key:'investment',label:'Private investment',min:10,max:40,step:1,unit:'% GDP',description:'Initial real private investment share. Capital depreciates and adjusts over time.'},
 {key:'government',label:'Government purchases',min:8,max:35,step:1,unit:'% GDP',description:'Initial government consumption share, excluding transfers and debt service.'},
 {key:'revenue',label:'Public revenue',min:15,max:55,step:1,unit:'% GDP',description:'Effective total public revenue relative to nominal output before policy changes.'},
 {key:'transfers',label:'Existing transfers',min:5,max:30,step:1,unit:'% GDP',description:'Initial annual social transfers. Kept separate from government purchases in GDP.'},
 {key:'informality',label:'Informal employment',min:0,max:90,step:1,unit:'%',description:'Share of workers assumed outside statutory minimum-wage enforcement.'},
 {key:'laborGrowth',label:'Workforce growth',min:-1.5,max:2.5,step:.1,unit:'%/yr',description:'Baseline labor-force growth. Normal growth is already embedded in trend output; changes affect the decomposition.'},
 {key:'dispersion',label:'Wage dispersion',min:.3,max:1.2,step:.05,unit:'σ',description:'Log wage dispersion in a synthetic 100-group labor market; not an observed national income distribution.'},
 {key:'gap',label:'Spare capacity / overheating',min:-8,max:5,step:.25,unit:'% output gap',description:'Negative values mean spare capacity; positive values mean output is above sustainable capacity.'}
];
export const ASSUMPTION_CONTROLS:ControlSpec[]=[
 {key:'laborElasticity',label:'Hiring sensitivity to wage costs',min:0,max:1,step:.05,unit:'elasticity',description:'A 1% wage rise for affected workers changes their employment by approximately minus this percent before market-power offsets.'},
 {key:'marketPower',label:'Employer market-power offset',min:0,max:.6,step:.05,unit:'coefficient',description:'Allows modest wage floors to improve retention and hiring. This benefit fades for high wage floors.'},
 {key:'lowMpc',label:'Lower-income spending response',min:.5,max:.98,step:.02,unit:'MPC',description:'Share of additional income spent by lower earners.'},
 {key:'highMpc',label:'Higher-income spending response',min:.2,max:.85,step:.05,unit:'MPC',description:'Share of additional income spent by higher earners.'},
 {key:'fiscalMultiplier',label:'Fiscal demand strength',min:.3,max:2,step:.1,unit:'multiplier',description:'Base spending multiplier; adjusted for import leakage, spare capacity, and household spending.'},
 {key:'phillips',label:'Inflation response to demand',min:.03,max:.3,step:.01,unit:'coefficient',description:'Annualized inflation response to a one-point output gap per quarterly step.'},
 {key:'passThrough',label:'Cost-to-price pass-through',min:.1,max:.8,step:.05,unit:'share',description:'Share of labor-cost changes passed into prices; remaining incidence falls on firms.'},
 {key:'investmentSensitivity',label:'Investment response to rates',min:.1,max:1.5,step:.1,unit:'coefficient',description:'Private investment sensitivity to the real borrowing-rate gap.'},
 {key:'okun',label:'Jobs response to output',min:.15,max:.7,step:.05,unit:'coefficient',description:'Unemployment-point change associated with a one-point output gap.'},
 {key:'neutralRate',label:'Neutral real interest rate',min:-1,max:4,step:.25,unit:'%',description:'Real interest rate consistent with neither stimulating nor restraining demand.'},
 {key:'depreciation',label:'Capital depreciation',min:2,max:10,step:.5,unit:'%/yr',description:'Annual wear on private and public capital stocks.'}
];
export const clamp=(v:number,lo:number,hi:number)=>Math.max(lo,Math.min(hi,v));
const mean=(v:number[])=>v.reduce((s,x)=>s+x,0)/v.length;
// Acklam inverse standard normal CDF, used for equal-population synthetic wage groups.
function normalQuantile(p:number):number{const a=[-39.6968302866538,220.946098424521,-275.928510446969,138.357751867269,-30.6647980661472,2.50662827745924],b=[-54.4760987982241,161.585836858041,-155.698979859887,66.8013118877197,-13.2806815528857],c=[-.00778489400243029,-.322396458041136,-2.40075827716184,-2.54973253934373,4.37466414146497,2.93816398269878],d=[.00778469570904146,.32246712907004,2.445134137143,3.75440866190742];if(p<.02425){const q=Math.sqrt(-2*Math.log(p));return (((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5])/((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1)}if(p>1-.02425)return -normalQuantile(1-p);const q=p-.5,r=q*q;return (((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])*q/(((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1)}
export function wageEffects(c:Country,p:Policies,a:Assumptions,phase:number){
 const floor=(c.floor+(p.minimumWage-c.floor)*phase)/100,enforcement=1-c.informality/100;
 const wages=Array.from({length:100},(_,i)=>Math.exp(c.dispersion*normalQuantile((i+.5)/100)));
 const rows=wages.map(w=>{const old=Math.max(w,c.floor/100),next=Math.max(w,floor),change=Math.log(next/old);const offset=a.marketPower*Math.min(Math.max(change,0),.15)*Math.max(0,1-floor/.9);const retention=clamp(1-a.laborElasticity*change+offset,.25,1.1);return {old,next,retention,earnings:old*(1-enforcement)+next*retention*enforcement}});
 const oldBill=rows.reduce((s,r)=>s+r.old,0);const grossRaise=rows.reduce((s,r)=>s+(r.next-r.old)*enforcement,0)/oldBill;
 return {rows,coverage:100*rows.filter(r=>r.next>r.old+1e-8).length/100*enforcement,jobs:mean(rows.map(r=>(r.retention-1)*enforcement))*100,bill:(rows.reduce((s,r)=>s+r.earnings,0)/oldBill-1)*100,grossRaise:grossRaise*100};
}
export type Point={quarter:number;year:number;gdp:number;growth:number;potential:number;gap:number;inflation:number;price:number;rate:number;unemployment:number;employment:number;debt:number;debtStock:number;nominalGdp:number;balance:number;primaryBalance:number;revenue:number;expenditure:number;interest:number;consumption:number;investment:number;government:number;exports:number;imports:number;netExports:number;wages:number;gini:number;quintiles:number[];fx:number;laborImpact:number;coverage:number;phase:number;warnings:string[]};
function gini(values:number[]){const s=[...values].sort((a,b)=>a-b),total=s.reduce((a,b)=>a+b,0);return 100*(2*s.reduce((a,b,i)=>a+(i+1)*b,0)/(s.length*total)-(s.length+1)/s.length)}
export function validateConfiguration(c:Country,p:Policies,a:Assumptions,s:Settings){
 for(const [key,v] of Object.entries(c)){if(typeof v==='number'&&!Number.isFinite(v))throw new Error(`Invalid country value: ${key}`)}
 for(const specs of [COUNTRY_CONTROLS,POLICY_GROUPS.flatMap(g=>g.items),ASSUMPTION_CONTROLS])for(const spec of specs){const obj=specs===COUNTRY_CONTROLS?c:specs===ASSUMPTION_CONTROLS?a:p;const v=(obj as unknown as Record<string,number>)[spec.key];if(!Number.isFinite(v)||v<spec.min-1e-8||v>spec.max+1e-8)throw new Error(`${spec.label} must be between ${spec.min} and ${spec.max}.`)}
 if(100-c.investment-c.government-c.exports+c.imports<15)throw new Error('These expenditure shares leave less than 15% of GDP for household consumption. Reduce exports, investment, or government purchases, or increase imports.');
 if(c.gdp<=0||c.population<=0||c.laborForce<=0||c.laborForce>100)throw new Error('GDP, population, and the labor force must be positive.');
 if(!Number.isInteger(s.years)||s.years<2||s.years>20||!Number.isInteger(s.startQuarter)||s.startQuarter<1||s.startQuarter>20||!Number.isInteger(s.ramp)||s.ramp<1||s.ramp>12||!Number.isInteger(s.duration)||s.duration<0||s.duration>80||typeof s.automaticRates!=='boolean')throw new Error('Invalid simulation timing or monetary setting.');
}
export function simulate(c:Country,p:Policies,a:Assumptions,s:Settings):Point[]{
 validateConfiguration(c,p,a,s);
 const points:Point[]=[];const n=neutralPolicies(c);const initialW=wageEffects(c,n,a,0);const startLabor=c.population*c.laborForce/100;const structuralU=clamp(c.unemployment+a.okun*c.gap,1,45);const depreciation=a.depreciation/100/4;
 const baseCapital=c.investment/(a.depreciation+c.growth);let capital=baseCapital,refCapital=baseCapital,publicCapital=0,laborExtra=1,trainingStock=0;
 let gap=c.gap,pi=c.inflation,rate=c.rate,price=100,fx=100,u=c.unemployment,debtStock=c.gdp*c.debt/100,effectiveDebtRate=Math.max(.1,c.rate*.6+c.target*.4),lastCost=0,prevY=100,prevPotential=100/(1+c.gap/100),previousInvestment=c.investment;
 const initialTax=clamp(c.revenue*.45/.55/100,.05,.5);
 const incomeAt=(w:ReturnType<typeof wageEffects>,Y:number,unemployment:number,phase:number,priceIndex:number,reference:number,laborSupply=1)=>{const wageScale=Math.pow(reference/100/laborSupply,.65)*Math.pow(Y/reference,.4)*Math.pow(priceIndex/100,-.3);const tax=clamp(initialTax+p.incomeTax*phase/100,0,.8);const initialMean=mean(initialW.rows.map(r=>r.old));return w.rows.map((r,i)=>{const employmentRate=clamp((100-unemployment)/(100-c.unemployment)/(1+w.jobs/100),.1,2);const earnings=r.earnings*wageScale*employmentRate*(1-tax);const transfer=(c.transfers+p.transfers*phase)*initialMean/.55/100*(1.6-1.2*i/99)*Math.pow(reference/100,.65);const capitalIncome=.18*Math.pow(r.old,1.4)*Math.pow(Y/100,.8)*(1-p.corporateTax*phase/100);return Math.max(.001,earnings+transfer+capitalIncome)})};
 const initialIncomes=incomeAt(initialW,100,u,0,100,100);
 for(let q=0;q<=s.years*4;q++){
 const reference=100*Math.pow(1+c.growth/100,q/4);const laborBaseline=startLabor*Math.pow(1+c.laborGrowth/100,q/4);const active=q>=s.startQuarter&&(s.duration===0||q<s.startQuarter+s.duration);const phase=active?Math.min(1,(q-s.startQuarter+1)/s.ramp):0;
 const w=wageEffects(c,p,a,phase);let investment=c.investment,government=c.government,exports=c.exports,imports=c.imports,consumption=100-investment-government-exports+imports;let Y=100,potential=prevPotential,interest=debtStock*effectiveDebtRate/100,nominalGdp=c.gdp,rev=c.revenue,spend=c.government+c.transfers+interest/c.gdp*100,balance=rev-spend,primary=rev-c.government-c.transfers;const warnings:string[]=[];
 if(q>0){
  const energy=q>=s.startQuarter?p.energyShock*Math.pow(.5,(q-s.startQuarter)/4):0;
  const external=q>=s.startQuarter?p.worldDemand*Math.pow(.5,(q-s.startQuarter)/8):0;
  const realRateGap=rate-pi-a.neutralRate;
  const risk=Math.max(0,debtStock/(c.gdp*prevY/100*price/100)*100-c.debt)*.012;
  const multip=a.fiscalMultiplier*(1-c.imports/125)*(1+Math.max(0,-gap)*.04)*(1+(a.lowMpc-.8)*.5);
  const laborTax=p.incomeTax*.55*phase,profitTax=p.corporateTax*.2*phase;
  const wageDemand=w.bill*.55*a.lowMpc-w.grossRaise*.55*(1-a.passThrough)*a.highMpc;
  const fiscalDemand=multip*((p.spending+p.infrastructure+p.training)*phase+(a.lowMpc*p.transfers*phase)-(a.lowMpc*.65+a.highMpc*.35)*laborTax-a.highMpc*profitTax);
  const tariffCost=p.tariff*phase*c.imports/100;
  const tradeDemand=external*c.exports/100*.8+Math.log(fx/100)*100*(c.exports+c.imports)/100*.25-tariffCost*.22;
  const targetGap=fiscalDemand+wageDemand*.7+tradeDemand-.45*(realRateGap+risk)-.02*energy*c.imports/20-((laborExtra-1)*100)*.12;
  const rawGap=.74*gap+.26*targetGap;gap=clamp(rawGap,-25,18);if(gap!==rawGap)warnings.push('Output-gap stability boundary reached. Results outside normal model scope.');
  const rawInvestment=c.investment+.7*gap-a.investmentSensitivity*(realRateGap+risk)-.15*p.corporateTax*phase;
  investment=clamp(rawInvestment,3,55)*reference/100;
  refCapital=refCapital*(1-depreciation)+(c.investment/100*reference/100)/4;
  capital=capital*(1-depreciation)+previousInvestment/100/4;
  const lagPhase=points[q-4]?.phase??0;publicCapital=publicCapital*(1-depreciation)+p.infrastructure*lagPhase/100*reference/100/4;
  const trainPhase=points[q-8]?.phase??0;trainingStock=trainingStock*.995+p.training*trainPhase*.035/4;
  laborExtra*=Math.pow(1+p.immigration*phase/100,.25);
  potential=100/(1+c.gap/100)*Math.pow(1+c.growth/100,q/4)*Math.pow(capital/refCapital,.32)*Math.pow(laborExtra,.68)*Math.pow(1+publicCapital/Math.max(refCapital,.1),.2)*Math.exp(trainingStock/100)*Math.pow(Math.max(.5,1+w.jobs/100),.68);
  Y=potential*(1+gap/100);
  const targetU=structuralU-a.okun*gap-w.jobs*(1-structuralU/100);u=clamp(.65*u+.35*targetU,.5,55);
  const costLevel=w.grossRaise*.55*a.passThrough+tariffCost*.65+energy*.04;
  const rawPi=.86*pi+.14*c.target+a.phillips*gap+(costLevel-lastCost)*4+.03*Math.log(fx/100)*100;
  pi=clamp(rawPi,-8,40);if(pi!==rawPi)warnings.push('Inflation stability boundary reached. This is a stress scenario, not a forecast.');lastCost=costLevel;
  price*=Math.pow(1+pi/100,.25);
  const rule=c.target+a.neutralRate+1.5*(pi-c.target)+.5*gap;
  rate=clamp(s.automaticRates?.8*rate+.2*(rule+p.rateChange*phase):c.rate+p.rateChange*phase,-.5,35);
  fx=clamp(fx*Math.exp((-.08*(rate-pi-a.neutralRate)+risk*.1-.12*Math.log(fx/100)*100)/400),60,170);
  government=(c.government+(p.spending+p.training)*phase)*reference/100;
  investment+=p.infrastructure*phase*reference/100;
  exports=c.exports*reference/100*Math.max(.35,1+external/100+.7*Math.log(fx/100)-.25*p.tariff*phase/100);
  imports=c.imports*Y/100*Math.max(.3,1-.5*Math.log(fx/100)-.6*p.tariff*phase/100);
  consumption=Y-investment-government-exports+imports;
  if(consumption<=0)warnings.push('Implied household consumption is non-positive. This combination is outside model scope.');
  nominalGdp=c.gdp*Y/100*price/100;
  const referenceNominal=c.gdp*reference/100*price/100;
  const revenueNominal=(c.revenue/100+laborTax/100+profitTax/100)*nominalGdp+(p.tariff*phase/100)*(imports/Y)*nominalGdp;
  const transfersNominal=(c.transfers+p.transfers*phase)/100*referenceNominal+Math.max(-3,(u-c.unemployment)*.45)/100*nominalGdp;
  const purchasesNominal=(government+p.infrastructure*phase*reference/100)/Y*nominalGdp;
  effectiveDebtRate=.96*effectiveDebtRate+.04*Math.max(.1,rate+risk);
  interest=debtStock*effectiveDebtRate/100;
  const expenditureNominal=purchasesNominal+transfersNominal+interest;
  balance=(revenueNominal-expenditureNominal)/nominalGdp*100;primary=balance+interest/nominalGdp*100;
  debtStock+=(expenditureNominal-revenueNominal)/4;
  if(debtStock<0){debtStock=0;warnings.push('Gross public debt reaches zero; further surpluses are not tracked as public assets.');}
  rev=revenueNominal/nominalGdp*100;spend=expenditureNominal/nominalGdp*100;
  previousInvestment=investment-p.infrastructure*phase*reference/100;
 }
 const incomes=incomeAt(w,Y,u,phase,price,reference,laborBaseline/startLabor*laborExtra);
 const quintiles=Array.from({length:5},(_,i)=>mean(incomes.slice(i*20,(i+1)*20))/mean(initialIncomes.slice(i*20,(i+1)*20))*100);
 const employment=laborBaseline*laborExtra*(1-u/100);
 points.push({quarter:q,year:q/4,gdp:Y,growth:q?((Y/prevY)**4-1)*100:c.growth,potential,gap,inflation:pi,price,rate,unemployment:u,employment,debt:debtStock/nominalGdp*100,debtStock,nominalGdp,balance,primaryBalance:primary,revenue:rev,expenditure:spend,interest:interest/nominalGdp*100,consumption,investment,government,exports,imports,netExports:(exports-imports)/Y*100,wages:mean(incomes)/mean(initialIncomes)*100,gini:gini(incomes),quintiles,fx,laborImpact:w.jobs,coverage:w.coverage,phase,warnings});prevY=Y;prevPotential=potential;
 }
 return points;
}
export type Metric='gdp'|'unemployment'|'inflation'|'debt'|'wages'|'employment'|'balance'|'rate';
export const METRICS:{key:Metric;name:string;unit:string;description:string}[]=[{key:'gdp',name:'Real GDP',unit:'index',description:'Output volume · starting economy = 100'},{key:'unemployment',name:'Unemployment',unit:'%',description:'Share of the labor force without work'},{key:'inflation',name:'Inflation',unit:'%',description:'Annualized quarterly price change'},{key:'debt',name:'Public debt',unit:'% GDP',description:'Gross debt / annualized nominal GDP'},{key:'wages',name:'Real household income',unit:'index',description:'Synthetic expected disposable income · start = 100'},{key:'employment',name:'Employment',unit:'million',description:'Number of employed workers'},{key:'balance',name:'Budget balance',unit:'% GDP',description:'Public revenue minus total expenditure'},{key:'rate',name:'Policy interest rate',unit:'%',description:'Annual nominal central-bank rate'}];
export function runScenario(c:Country,p:Policies,a:Assumptions,s:Settings,withSensitivity=true){
 const baseline=simulate(c,neutralPolicies(c),a,s),scenario=simulate(c,p,a,s);
 const variants:{baseline:Point[];scenario:Point[]}[]=[];
 if(withSensitivity)for(const fiscal of [.75,1,1.25])for(const labor of [.5,1,1.5])for(const prices of [.75,1,1.25]){
  const varied={...a,fiscalMultiplier:clamp(a.fiscalMultiplier*fiscal,.3,2),laborElasticity:clamp(a.laborElasticity*labor,0,1),passThrough:clamp(a.passThrough*prices,.1,.8)};
  variants.push({baseline:simulate(c,neutralPolicies(c),varied,s),scenario:simulate(c,p,varied,s)});
 }
 const bands=scenario.map((point,q)=>Object.fromEntries(METRICS.map(({key})=>{const vals=[point[key],...variants.map(v=>baseline[q][key]+v.scenario[q][key]-v.baseline[q][key])];return [key,[Math.min(...vals),Math.max(...vals)]]})) as Record<Metric,[number,number]>);
 return {baseline,scenario,bands};
}
export const SOURCES=[
 {title:'World Bank: 2024 GDP ranking',url:'https://datacatalogfiles.worldbank.org/ddh-published/0038130/DR0046441/GDP.pdf',note:'GDP size anchors for Germany, India, Italy, Brazil, and South Africa, rounded from the 2024 ranking snapshot. The live source may be revised.'},
 {title:'World Bank: United States',url:'https://data.worldbank.org/country/US',note:'2024 GDP anchor: $28.75 trillion. Other preset fields are illustrative calibration.'},
 {title:'World Bank: Japan',url:'https://data.worldbank.org/country/japan?locations=JP&name_desc=true',note:'2024 GDP anchor: approximately $4.03 trillion. Other preset fields are illustrative calibration.'},
 {title:'World Bank: Sweden',url:'https://data.worldbank.org/country/SE',note:'2025 GDP anchor: $669 billion. Other preset fields are illustrative calibration.'},
 {title:'IMF: Quarterly projection framework',url:'https://www.elibrary.imf.org/view/journals/001/2017/032/article-A001-en.xml',note:'Conceptual reference for output-gap, inflation, interest-rate, and exchange-rate links. Our coefficients are not estimated from this paper.'},
 {title:'IMF: Fiscal multiplier determinants',url:'https://www.elibrary.imf.org/view/journals/001/2014/093/article-A001-en.xml',note:'Reference for state dependence and import leakage. This app uses explicit illustrative calibrations.'},
 {title:'Nobel Prize: Understanding labor markets',url:'https://www.nobelprize.org/uploads/2021/10/popular-economicsciencesprize2021-3.pdf',note:'Evidence motivating conditional minimum-wage effects rather than an assumed universal employment loss.'}
];
