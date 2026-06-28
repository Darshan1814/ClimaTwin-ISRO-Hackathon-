import { NextResponse } from 'next/server';
import { generateExtremeEvents } from '@/lib/climate-data';

export async function GET() {
  const today = new Date().toISOString().split('T')[0];
  const events = generateExtremeEvents(today);

  return NextResponse.json({
    events,
    count: events.length,
    generated_at: new Date().toISOString(),
  });
}
