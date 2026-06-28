import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ message: 'Agriculture API - yield prediction endpoint', status: 'active' });
}
