import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    products: [
      { id: 'LST', name: 'INSAT 3RIMG_L2B_LST', status: 'Active', lastUpdate: new Date().toISOString(), coverage: 98.2, resolution: '4km' },
      { id: 'SST', name: 'INSAT 3RIMG_L2B_SST', status: 'Active', lastUpdate: new Date().toISOString(), coverage: 95.7, resolution: '4km' },
      { id: 'IMC', name: 'INSAT 3RIMG_L2B_IMC', status: 'Active', lastUpdate: new Date().toISOString(), coverage: 97.1, resolution: '4km' },
    ],
    satellites: [
      { name: 'INSAT-3D', longitude: '82°E', status: 'Operational' },
      { name: 'INSAT-3DR', longitude: '74°E', status: 'Operational' },
      { name: 'INSAT-3DS', longitude: '93.5°E', status: 'Operational' },
    ],
    acquisition_time: new Date().toISOString(),
  });
}
