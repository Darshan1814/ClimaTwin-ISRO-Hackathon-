import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    arabian_sea_sst: 29.2, bay_of_bengal_sst: 30.1, iod_index: 0.3, enso_nino34: -0.3,
    cyclone_potential: [
      { region: 'Bay of Bengal (North)', sst: 30.1, potential: 'High' },
      { region: 'Arabian Sea (East)', sst: 29.2, potential: 'Moderate' },
    ],
  });
}
