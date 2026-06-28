import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Air Quality API', cities: [] });
}
