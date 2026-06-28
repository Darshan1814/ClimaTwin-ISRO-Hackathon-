import { NextResponse } from 'next/server';
import { generateAllStatesData } from '@/lib/climate-data';

export async function GET() {
  const today = new Date().toISOString().split('T')[0];
  const data = generateAllStatesData(today);
  const droughtStates = data.filter(d => d.drought_index < 0.3).map(d => ({
    state: d.state, stateId: d.stateId, drought_index: d.drought_index, spi: Math.round((d.drought_index * 4 - 2) * 100) / 100,
  }));
  return NextResponse.json({ droughtStates, date: today });
}
