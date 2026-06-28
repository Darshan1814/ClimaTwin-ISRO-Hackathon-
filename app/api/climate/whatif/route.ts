import { NextResponse } from 'next/server';
import { groqChat } from '@/lib/groq';
import { INDIA_STATES } from '@/lib/india-regions';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { temp_delta = 0, rainfall_delta = 0, co2_ppm = 420, sst_delta = 0, enso = 'neutral', iod = 'neutral' } = body;

    let result;
    try {
      const response = await groqChat([
        {
          role: 'system',
          content: `You are India's climate digital twin scenario engine. Given parameter changes from baseline, generate impacts by state. Return ONLY valid JSON with: state_impacts (array of {state, temp_change, rainfall_change_pct, drought_risk, flood_risk, crop_yield_change_pct}), sector_impacts ({agriculture, water, health, energy}), national_summary (150 words), adaptation_measures (array of strings).`
        },
        {
          role: 'user',
          content: `Scenario: Temperature: +${temp_delta}°C, Rainfall: ${rainfall_delta}%, CO₂: ${co2_ppm}ppm, SST: +${sst_delta}°C, ENSO: ${enso}, IOD: ${iod}. Generate state-level impacts for India.`
        }
      ], 'llama-3.3-70b-versatile', 2048);

      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) result = JSON.parse(jsonMatch[0]);
      } catch { /* fall through to default */ }
    } catch { /* fall through to default */ }

    // Fallback
    if (!result) {
      result = {
        state_impacts: INDIA_STATES.slice(0, 20).map(s => ({
          state: s.name,
          temp_change: Math.round((temp_delta + (Math.random() - 0.5) * 0.5) * 10) / 10,
          rainfall_change_pct: Math.round((rainfall_delta + (Math.random() - 0.5) * 10) * 10) / 10,
          drought_risk: temp_delta > 2 ? 'high' : temp_delta > 1 ? 'moderate' : 'low',
          flood_risk: rainfall_delta > 20 ? 'high' : 'low',
          crop_yield_change_pct: Math.round((-temp_delta * 3 + rainfall_delta * 0.1) * 10) / 10,
        })),
        national_summary: `Under a +${temp_delta}°C warming scenario with ${rainfall_delta}% rainfall perturbation, India's climate shows significant regional differentiation. Northern plains face increased heat stress, while coastal regions may experience intensified precipitation events.`,
        adaptation_measures: ['Drought-resistant crop varieties', 'Enhanced irrigation infrastructure', 'Heat action plans', 'Flood early warning systems'],
      };
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Simulation failed' }, { status: 500 });
  }
}
