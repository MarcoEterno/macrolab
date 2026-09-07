import fs from 'node:fs/promises';
import crypto from 'node:crypto';
const fields = {
  gdp: ['NY.GDP.MKTP.CD', 'USD billion'],
  population: ['SP.POP.TOTL', 'million people'],
  inflation: ['FP.CPI.TOTL.ZG', 'annual %'],
  unemployment: ['SL.UEM.TOTL.ZS', '% labor force'],
};
const strip = (text) =>
  text
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, '')
    .trim();
const countries = {};
for (const id of ['US', 'DE', 'SE', 'JP', 'BR', 'IN', 'IT', 'ZA']) {
  const url = `https://data.worldbank.org/country/${id}`;
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`${id}: HTTP ${response.status}`);
  const html = await response.text();
  const observations = {};
  for (const [key, [indicator, unit]] of Object.entries(fields)) {
    const pos = html.indexOf(`href="/indicator/${indicator}?`);
    if (pos < 0) throw new Error(`${id}: missing ${indicator}`);
    const card = html.slice(pos, pos + 16000);
    const valueMatch = card.match(
      /class="indicator-item__data-info"[^>]*>([\s\S]*?)<\/div>/,
    );
    const yearMatch = card.match(
      /class="indicator-item__data-info-year"[^>]*>([\s\S]*?)<\/p>/,
    );
    if (!valueMatch || !yearMatch)
      throw new Error(`${id}: incomplete ${indicator}`);
    const displayedValue = strip(valueMatch[1]),
      displayedPeriod = strip(yearMatch[1]);
    let value = Number(displayedValue.replaceAll(',', ''));
    if (!Number.isFinite(value))
      throw new Error(`${id}: invalid ${displayedValue}`);
    if (key === 'gdp')
      value *= displayedPeriod.includes('trillion')
        ? 1000
        : displayedPeriod.includes('billion')
          ? 1
          : 1e-9;
    if (key === 'population')
      value *= displayedPeriod.includes('billion')
        ? 1000
        : displayedPeriod.includes('million')
          ? 1
          : 1e-6;
    if (key === 'population' && value < 1)
      throw new Error(`${id}: population units failed validation`);
    observations[key] = {
      indicator,
      value,
      unit,
      year: Number(displayedPeriod.match(/\d{4}/)?.[0]),
      displayedValue,
      displayedPeriod,
      url: `https://data.worldbank.org/indicator/${indicator}?locations=${id}`,
    };
  }
  countries[id] = {
    url,
    htmlSha256: crypto.createHash('sha256').update(html).digest('hex'),
    observations,
  };
  console.log(id, JSON.stringify(observations));
}
const snapshot = {
  retrievedAt: new Date().toISOString(),
  provider: 'World Bank, World Development Indicators',
  method:
    'Public country cards. Values preserve displayed precision; observations have individual reference years. Snapshot fixes what was read; upstream revisions are not applied automatically.',
  countries,
};
await fs.writeFile(
  new URL('../data/world-bank-snapshot.json', import.meta.url),
  JSON.stringify(snapshot, null, 2) + '\n',
);

await fs.writeFile(
  new URL('../public/data-snapshot.json', import.meta.url),
  JSON.stringify(snapshot, null, 2) + '\n',
);
