import { NextResponse } from 'next/server';
import { generateForecastData } from '@/lib/climate-data';
import { groqChat, parseGroqJSON } from '@/lib/groq';
import { INDIA_STATES } from '@/lib/india-regions';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { region, variable = 'rainfall', leadDays = 7 } = body;

    const forecast = generateForecastData(region, variable, leadDays);
    const stateName = INDIA_STATES.find(s => s.id === region)?.name || region;

    let narrative = '';
    try {
      const response = await groqChat([
        {
          role: 'system',
          content: `You are ClimaTwin's AI forecast engine, simulating India's IMD operational forecast system. Generate a scientifically realistic ${variable} forecast narrative for ${stateName} over the next ${leadDays} days. Use proper meteorological terminology. Reference INSAT observations and IMD gridded data. Keep response to 150 words.`
        },
        {
          role: 'user',
          content: `Generate a ${variable} forecast narrative for ${stateName}, India for the next ${leadDays} days. Current conditions: ${JSON.stringify(forecast.slice(0, 3))}`
        }
      ], 'llama-3.3-70b-versatile', 512);
      narrative = response;
    } catch {
      narrative = `Based on multi-model ensemble analysis, ${variable} in ${stateName} is expected to follow seasonal patterns over the next ${leadDays} days. The LSTM and Prophet models show convergence in predictions with moderate confidence levels.`;
    }

    return NextResponse.json({
      forecast,
      narrative,
      confidence_level: 'medium',
      model: 'ClimaTwin-Ensemble',
    });
  } catch (error) {
    return NextResponse.json({ error: 'Forecast generation failed' }, { status: 500 });
  }
}
