import { NextResponse } from 'next/server';
import { generateAllStatesData, getNationalAverage } from '@/lib/climate-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

  const states = generateAllStatesData(date);
  const nationalAvg = getNationalAverage(states);

  return NextResponse.json({
    states,
    nationalAvg,
    date,
    source: 'ClimaTwin Synthetic Data Engine (IMD + INSAT simulation)',
  });
}
