import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ message: 'PDF export API - triggered client-side via html2canvas + jsPDF' });
}
