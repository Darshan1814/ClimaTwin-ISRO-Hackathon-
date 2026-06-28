import { INDIA_STATES, IndiaState } from './india-regions';

export interface ClimateDataPoint {
  state: string;
  stateId: string;
  lat: number;
  lon: number;
  date: string;
  rainfall_mm: number;
  max_temp_c: number;
  min_temp_c: number;
  humidity_pct: number;
  wind_speed_kmh: number;
  cloud_cover_pct: number;
  lst_insat: number;
  sst_insat: number | null;
  drought_index: number;
  crop_stress_index: number;
}

// Deterministic seeded random - consistent output for same inputs
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

// Get month-based seasonal multiplier for rainfall
function getRainfallSeasonalMultiplier(month: number): number {
  // month is 0-indexed (0=Jan)
  const multipliers = [0.05, 0.05, 0.08, 0.1, 0.15, 0.6, 0.95, 1.0, 0.85, 0.4, 0.15, 0.05];
  return multipliers[month];
}

// Get temperature seasonal offset (added to base)
function getTempSeasonalOffset(month: number, lat: number): number {
  // Northern India has much larger seasonal variation
  const latFactor = (lat - 10) / 25; // 0 for south, ~1 for north
  const winterOffset = [  -4, -2, 2, 6, 10, 8, 4, 3, 3, 2, -1, -3 ];
  const base = winterOffset[month] * (0.5 + latFactor * 1.2);
  return base;
}

export function generateClimateData(
  state: IndiaState,
  dateStr: string,
  stateIndex: number
): ClimateDataPoint {
  const date = new Date(dateStr);
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  const month = date.getMonth();
  const year = date.getFullYear();

  const seed = (stateIndex * 7 + dayOfYear * 13 + year * 3) % 10000;
  const r1 = seededRandom(seed);
  const r2 = seededRandom(seed + 1);
  const r3 = seededRandom(seed + 2);
  const r4 = seededRandom(seed + 3);
  const r5 = seededRandom(seed + 4);
  const r6 = seededRandom(seed + 5);

  // Rainfall calculation
  const seasonalMult = getRainfallSeasonalMultiplier(month);
  const dailyFraction = state.annualRainfall / 365;
  const baseRainfall = dailyFraction * seasonalMult * 12;
  const variation = (r1 - 0.3) * baseRainfall * 2;
  const rainfall_mm = clamp(Math.round((baseRainfall + variation) * 10) / 10, 0, 300);

  // Temperature
  const tempOffset = getTempSeasonalOffset(month, state.lat);
  const max_temp_c = clamp(
    Math.round((state.avgMaxTemp + tempOffset + (r2 - 0.5) * 4) * 10) / 10,
    5, 48
  );
  const min_temp_c = clamp(
    Math.round((state.avgMinTemp + tempOffset * 0.7 + (r3 - 0.5) * 3) * 10) / 10,
    -10, max_temp_c - 3
  );

  // Humidity - higher in monsoon, coastal states
  const coastalBonus = state.coastal ? 10 : 0;
  const monsoonHumidity = month >= 5 && month <= 8 ? 20 : 0;
  const humidity_pct = clamp(
    Math.round(50 + coastalBonus + monsoonHumidity + (r4 - 0.5) * 30),
    20, 100
  );

  // Wind
  const wind_speed_kmh = clamp(
    Math.round((10 + (r5 - 0.3) * 25 + (state.coastal ? 8 : 0)) * 10) / 10,
    0, 80
  );

  // Cloud cover
  const cloud_cover_pct = clamp(
    Math.round(rainfall_mm > 5 ? 60 + r6 * 35 : 15 + r6 * 40),
    0, 100
  );

  // INSAT Land Surface Temperature (slightly higher than max_temp for daytime)
  const lst_insat = clamp(
    Math.round((max_temp_c + 2 + (r1 + r2 - 1) * 3) * 10) / 10,
    -5, 55
  );

  // SST - only for coastal states
  const sst_insat = state.coastal
    ? clamp(Math.round((26 + (month >= 3 && month <= 10 ? 2 : -1) + r3 * 3) * 10) / 10, 22, 32)
    : null;

  // Drought index (SPI-like, 0=severe drought, 1=wet)
  const rainfallDeficit = rainfall_mm / (dailyFraction * 3 + 0.1);
  const drought_index = clamp(Math.round(rainfallDeficit * 100) / 100, 0, 1);

  // Crop stress (combines temperature and water stress)
  const heatStress = max_temp_c > 38 ? (max_temp_c - 38) / 10 : 0;
  const waterStress = drought_index < 0.3 ? (0.3 - drought_index) * 2 : 0;
  const crop_stress_index = clamp(Math.round((heatStress + waterStress) * 100) / 100, 0, 1);

  return {
    state: state.name,
    stateId: state.id,
    lat: state.lat,
    lon: state.lon,
    date: dateStr,
    rainfall_mm,
    max_temp_c,
    min_temp_c,
    humidity_pct,
    wind_speed_kmh,
    cloud_cover_pct,
    lst_insat,
    sst_insat,
    drought_index,
    crop_stress_index,
  };
}

export function generateAllStatesData(dateStr: string): ClimateDataPoint[] {
  return INDIA_STATES.map((state, idx) => generateClimateData(state, dateStr, idx));
}

export function generateHistoricalData(
  stateId: string,
  variable: string,
  years: number = 30
): { years: number[]; values: number[]; trend_slope: number; anomalies: number[] } {
  const state = INDIA_STATES.find(s => s.id === stateId) || INDIA_STATES[0];
  const stateIndex = INDIA_STATES.findIndex(s => s.id === stateId);
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - years;

  const yearList: number[] = [];
  const values: number[] = [];

  for (let y = startYear; y <= currentYear; y++) {
    yearList.push(y);
    let annualValue = 0;

    // Generate monthly data and aggregate
    for (let m = 0; m < 12; m++) {
      const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-15`;
      const data = generateClimateData(state, dateStr, stateIndex);

      switch (variable) {
        case 'rainfall':
          annualValue += data.rainfall_mm * 30; // monthly estimate
          break;
        case 'temperature':
        case 'max_temp':
          annualValue += data.max_temp_c / 12;
          break;
        case 'min_temp':
          annualValue += data.min_temp_c / 12;
          break;
        case 'humidity':
          annualValue += data.humidity_pct / 12;
          break;
        default:
          annualValue += data.rainfall_mm * 30;
      }
    }

    // Add climate change trend signal
    const yearsFromStart = y - startYear;
    if (variable === 'temperature' || variable === 'max_temp') {
      annualValue += yearsFromStart * 0.025; // +0.025°C/year warming
    } else if (variable === 'rainfall') {
      // Slight variability increase
      annualValue *= (1 + (seededRandom(y * stateIndex) - 0.5) * 0.15);
    }

    values.push(Math.round(annualValue * 10) / 10);
  }

  // Calculate trend
  const n = values.length;
  const xMean = (n - 1) / 2;
  const yMean = values.reduce((a, b) => a + b, 0) / n;
  let num = 0, den = 0;
  for (let i = 0; i < n; i++) {
    num += (i - xMean) * (values[i] - yMean);
    den += (i - xMean) * (i - xMean);
  }
  const trend_slope = Math.round((num / den) * 1000) / 1000;

  // Anomalies from mean
  const anomalies = values.map(v => Math.round((v - yMean) * 10) / 10);

  return { years: yearList, values, trend_slope, anomalies };
}

export function generateMonthlyData(stateId: string, year: number): ClimateDataPoint[] {
  const state = INDIA_STATES.find(s => s.id === stateId) || INDIA_STATES[0];
  const stateIndex = INDIA_STATES.findIndex(s => s.id === stateId);
  const months: ClimateDataPoint[] = [];

  for (let m = 0; m < 12; m++) {
    const dateStr = `${year}-${String(m + 1).padStart(2, '0')}-15`;
    months.push(generateClimateData(state, dateStr, stateIndex));
  }

  return months;
}

export function getNationalAverage(data: ClimateDataPoint[]): {
  avg_rainfall: number;
  avg_max_temp: number;
  avg_min_temp: number;
  avg_humidity: number;
  total_rainfall: number;
} {
  const n = data.length;
  return {
    avg_rainfall: Math.round(data.reduce((s, d) => s + d.rainfall_mm, 0) / n * 10) / 10,
    avg_max_temp: Math.round(data.reduce((s, d) => s + d.max_temp_c, 0) / n * 10) / 10,
    avg_min_temp: Math.round(data.reduce((s, d) => s + d.min_temp_c, 0) / n * 10) / 10,
    avg_humidity: Math.round(data.reduce((s, d) => s + d.humidity_pct, 0) / n),
    total_rainfall: Math.round(data.reduce((s, d) => s + d.rainfall_mm, 0) * 10) / 10,
  };
}

// Generate 7-day forecast data
export function generateForecastData(stateId: string, variable: string, days: number = 7) {
  const state = INDIA_STATES.find(s => s.id === stateId) || INDIA_STATES[0];
  const stateIndex = INDIA_STATES.findIndex(s => s.id === stateId);
  const today = new Date();
  const forecast = [];

  for (let d = 1; d <= days; d++) {
    const futureDate = new Date(today);
    futureDate.setDate(futureDate.getDate() + d);
    const dateStr = futureDate.toISOString().split('T')[0];
    const data = generateClimateData(state, dateStr, stateIndex);

    let value: number;
    switch (variable) {
      case 'rainfall': value = data.rainfall_mm; break;
      case 'temperature': value = data.max_temp_c; break;
      case 'humidity': value = data.humidity_pct; break;
      default: value = data.rainfall_mm;
    }

    const confidence = Math.max(0.5, 0.95 - d * 0.06);
    const spread = value * (1 - confidence) * 0.5;

    forecast.push({
      day: d,
      date: dateStr,
      value: Math.round(value * 10) / 10,
      min: Math.round((value - spread) * 10) / 10,
      max: Math.round((value + spread) * 10) / 10,
      confidence: Math.round(confidence * 100) / 100,
    });
  }

  return forecast;
}

// Generate extreme events
export function generateExtremeEvents(dateStr: string) {
  const date = new Date(dateStr);
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  const seed = (dayOfYear * 17 + date.getFullYear() * 5) % 10000;
  const month = date.getMonth();

  const events: {
    event_type: string;
    state: string;
    severity: string;
    description: string;
    impact_score: number;
  }[] = [];

  // Monsoon season: more floods
  if (month >= 5 && month <= 9) {
    const floodIdx = Math.floor(seededRandom(seed) * 10);
    if (floodIdx < 6) {
      const floodStates = ['AS', 'BR', 'KL', 'MH', 'WB', 'OR'];
      const chosen = floodStates[Math.floor(seededRandom(seed + 10) * floodStates.length)];
      const st = INDIA_STATES.find(s => s.id === chosen);
      events.push({
        event_type: 'flood',
        state: st?.name || chosen,
        severity: seededRandom(seed + 11) > 0.5 ? 'severe' : 'moderate',
        description: `Heavy rainfall-induced flooding in ${st?.name}. Rivers flowing above danger levels.`,
        impact_score: Math.round((0.5 + seededRandom(seed + 12) * 0.5) * 100) / 100,
      });
    }
  }

  // Summer: heatwaves
  if (month >= 3 && month <= 6) {
    const heatIdx = Math.floor(seededRandom(seed + 20) * 10);
    if (heatIdx < 5) {
      const heatStates = ['RJ', 'MP', 'UP', 'DL', 'TS', 'MH', 'GJ'];
      const chosen = heatStates[Math.floor(seededRandom(seed + 21) * heatStates.length)];
      const st = INDIA_STATES.find(s => s.id === chosen);
      events.push({
        event_type: 'heatwave',
        state: st?.name || chosen,
        severity: seededRandom(seed + 22) > 0.6 ? 'extreme' : 'severe',
        description: `Maximum temperatures exceeding 45°C in multiple districts of ${st?.name}.`,
        impact_score: Math.round((0.6 + seededRandom(seed + 23) * 0.4) * 100) / 100,
      });
    }
  }

  // Cyclone season: Oct-Dec, Apr-Jun
  if ((month >= 9 && month <= 11) || (month >= 3 && month <= 5)) {
    const cycloneIdx = Math.floor(seededRandom(seed + 30) * 10);
    if (cycloneIdx < 3) {
      const cycloneStates = ['OR', 'AP', 'TN', 'WB', 'GJ'];
      const chosen = cycloneStates[Math.floor(seededRandom(seed + 31) * cycloneStates.length)];
      const st = INDIA_STATES.find(s => s.id === chosen);
      events.push({
        event_type: 'cyclone',
        state: st?.name || chosen,
        severity: 'severe',
        description: `Cyclonic storm approaching the coast near ${st?.name}. Wind speeds 80-100 km/h expected.`,
        impact_score: Math.round((0.7 + seededRandom(seed + 32) * 0.3) * 100) / 100,
      });
    }
  }

  // Drought can happen anytime
  const droughtIdx = Math.floor(seededRandom(seed + 40) * 10);
  if (droughtIdx < 4) {
    const droughtStates = ['RJ', 'GJ', 'MH', 'KA', 'AP', 'MP'];
    const chosen = droughtStates[Math.floor(seededRandom(seed + 41) * droughtStates.length)];
    const st = INDIA_STATES.find(s => s.id === chosen);
    events.push({
      event_type: 'drought',
      state: st?.name || chosen,
      severity: seededRandom(seed + 42) > 0.5 ? 'severe' : 'moderate',
      description: `Rainfall deficit exceeding 40% in ${st?.name}. Agricultural distress reported.`,
      impact_score: Math.round((0.4 + seededRandom(seed + 43) * 0.5) * 100) / 100,
    });
  }

  return events;
}
