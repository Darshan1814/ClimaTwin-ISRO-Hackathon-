import { NextResponse } from 'next/server';
import { generateHistoricalData } from '@/lib/climate-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get('state') || 'MH';
  const variable = searchParams.get('variable') || 'rainfall';
  const years = parseInt(searchParams.get('years') || '30');

  const data = generateHistoricalData(state, variable, years);

  return NextResponse.json(data);
}
