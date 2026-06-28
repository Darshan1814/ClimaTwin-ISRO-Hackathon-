import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ message: 'HTML export API - generates self-contained HTML' });
}
