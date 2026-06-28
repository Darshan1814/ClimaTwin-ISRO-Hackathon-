'use client';

import { useState, useMemo } from 'react';
import { INDIA_STATES } from '@/lib/india-regions';
import { ClimateDataPoint } from '@/lib/climate-data';

// Simplified SVG paths for Indian states (approximate outlines for visualization)
// Using viewBox coordinates that map to India's approximate bounding box
const STATE_PATHS: Record<string, string> = {
  'JK': 'M 145,25 L 165,20 180,30 185,50 175,65 160,60 140,55 135,40 Z',
  'LA': 'M 185,15 L 210,10 225,25 220,45 200,50 185,50 180,30 Z',
  'HP': 'M 160,60 L 175,65 180,75 170,85 155,80 150,70 Z',
  'PB': 'M 140,65 L 155,60 155,80 145,85 135,80 Z',
  'HR': 'M 145,85 L 160,82 168,95 155,105 140,100 Z',
  'CH': 'M 155,77 L 160,75 162,80 157,82 Z',
  'UK': 'M 175,65 L 195,60 200,75 190,85 175,80 Z',
  'DL': 'M 155,95 L 163,92 165,100 158,102 Z',
  'RJ': 'M 100,95 L 145,85 155,105 150,140 120,155 90,140 85,115 Z',
  'UP': 'M 165,95 L 200,80 230,90 240,110 220,120 190,115 170,120 155,110 Z',
  'BR': 'M 240,110 L 270,105 280,115 270,125 245,120 Z',
  'SK': 'M 275,90 L 285,85 290,95 282,100 Z',
  'AR': 'M 310,70 L 340,65 345,80 330,85 310,80 Z',
  'NL': 'M 330,85 L 345,82 348,95 335,98 Z',
  'MN': 'M 330,98 L 348,95 350,110 335,112 Z',
  'MZ': 'M 325,112 L 340,110 345,130 330,132 Z',
  'TR': 'M 315,115 L 325,112 328,125 318,127 Z',
  'ML': 'M 295,95 L 315,90 320,100 305,105 Z',
  'AS': 'M 290,80 L 330,75 335,98 305,105 295,95 Z',
  'WB': 'M 270,110 L 290,105 295,130 285,155 270,145 265,125 Z',
  'JH': 'M 245,120 L 270,115 268,135 250,140 Z',
  'OR': 'M 240,140 L 268,135 275,155 260,175 240,165 Z',
  'CG': 'M 210,135 L 240,130 245,155 230,165 210,155 Z',
  'MP': 'M 150,115 L 210,110 215,135 210,155 170,155 140,140 Z',
  'GJ': 'M 75,130 L 100,120 120,155 110,175 90,180 70,165 65,145 Z',
  'MH': 'M 110,155 L 170,155 175,180 165,205 140,215 115,200 95,185 Z',
  'TS': 'M 170,175 L 210,170 215,195 195,210 170,200 Z',
  'AP': 'M 175,200 L 215,195 230,220 220,250 195,255 175,235 Z',
  'KA': 'M 115,200 L 165,195 170,225 155,255 130,260 110,240 Z',
  'GA': 'M 105,195 L 115,192 118,205 108,208 Z',
  'KL': 'M 125,255 L 140,250 148,280 140,310 130,310 120,285 Z',
  'TN': 'M 150,250 L 190,240 210,260 200,295 175,310 150,295 Z',
  'AN': 'M 330,220 L 340,215 345,260 338,280 330,275 328,240 Z',
  'DN': 'M 90,175 L 100,172 102,180 92,182 Z',
  'DD': 'M 82,178 L 90,175 92,182 84,184 Z',
  'PY': 'M 192,258 L 198,255 200,262 194,264 Z',
  'LD': 'M 80,275 L 88,270 92,285 85,290 Z',
};

interface IndiaMapProps {
  data?: ClimateDataPoint[];
  variable?: 'rainfall' | 'temperature' | 'drought' | 'humidity';
  onStateClick?: (stateId: string) => void;
  selectedState?: string | null;
  height?: number;
}

function getColorScale(value: number, variable: string): string {
  switch (variable) {
    case 'rainfall': {
      // Blue scale: light (dry) → dark (wet)
      const t = Math.min(value / 100, 1);
      const r = Math.round(20 + (1 - t) * 60);
      const g = Math.round(80 + (1 - t) * 100);
      const b = Math.round(150 + t * 105);
      return `rgb(${r},${g},${b})`;
    }
    case 'temperature': {
      // Cool blue → warm red
      const t = Math.min(Math.max((value - 15) / 33, 0), 1);
      if (t < 0.5) {
        const s = t * 2;
        return `rgb(${Math.round(50 + s * 205)},${Math.round(100 + s * 100)},${Math.round(255 - s * 155)})`;
      } else {
        const s = (t - 0.5) * 2;
        return `rgb(${Math.round(255)},${Math.round(200 - s * 160)},${Math.round(100 - s * 80)})`;
      }
    }
    case 'drought': {
      // Green (wet) → Yellow → Orange → Red (drought)
      const t = 1 - Math.min(Math.max(value, 0), 1); // invert: low drought_index = drought
      if (t < 0.33) {
        return `rgb(${Math.round(50 + t * 3 * 50)},${Math.round(180 + t * 3 * 50)},${Math.round(50)})`;
      } else if (t < 0.66) {
        const s = (t - 0.33) * 3;
        return `rgb(${Math.round(255)},${Math.round(230 - s * 100)},${Math.round(50)})`;
      } else {
        const s = (t - 0.66) * 3;
        return `rgb(${Math.round(255 - s * 50)},${Math.round(130 - s * 100)},${Math.round(50 - s * 30)})`;
      }
    }
    case 'humidity': {
      const t = Math.min(value / 100, 1);
      return `rgb(${Math.round(40 + (1 - t) * 100)},${Math.round(150 + t * 80)},${Math.round(180 + t * 75)})`;
    }
    default:
      return '#334155';
  }
}

function getValueForVariable(data: ClimateDataPoint, variable: string): number {
  switch (variable) {
    case 'rainfall': return data.rainfall_mm;
    case 'temperature': return data.max_temp_c;
    case 'drought': return data.drought_index;
    case 'humidity': return data.humidity_pct;
    default: return 0;
  }
}

function getValueUnit(variable: string): string {
  switch (variable) {
    case 'rainfall': return 'mm';
    case 'temperature': return '°C';
    case 'drought': return '';
    case 'humidity': return '%';
    default: return '';
  }
}

export default function IndiaMap({
  data = [],
  variable = 'rainfall',
  onStateClick,
  selectedState = null,
  height = 500,
}: IndiaMapProps) {
  const [tooltip, setTooltip] = useState<{
    show: boolean;
    x: number;
    y: number;
    stateId: string;
    stateName: string;
    value: number;
  } | null>(null);

  const stateDataMap = useMemo(() => {
    const map: Record<string, ClimateDataPoint> = {};
    data.forEach(d => { map[d.stateId] = d; });
    return map;
  }, [data]);

  return (
    <div className="india-map-container" style={{ height }}>
      <svg
        viewBox="50 0 320 330"
        style={{ width: '100%', height: '100%' }}
        onMouseLeave={() => setTooltip(null)}
      >
        {Object.entries(STATE_PATHS).map(([stateId, path]) => {
          const stateData = stateDataMap[stateId];
          const value = stateData ? getValueForVariable(stateData, variable) : 0;
          const color = stateData ? getColorScale(value, variable) : 'rgba(100,100,100,0.3)';
          const isSelected = selectedState === stateId;

          return (
            <path
              key={stateId}
              d={path}
              fill={color}
              fillOpacity={isSelected ? 1 : 0.85}
              strokeWidth={isSelected ? 2 : 0.5}
              stroke={isSelected ? '#FFD700' : 'rgba(0,212,255,0.3)'}
              style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
              onClick={() => onStateClick?.(stateId)}
              onMouseMove={(e) => {
                const rect = (e.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect();
                const stateInfo = INDIA_STATES.find(s => s.id === stateId);
                setTooltip({
                  show: true,
                  x: e.clientX - rect.left,
                  y: e.clientY - rect.top - 10,
                  stateId,
                  stateName: stateInfo?.name || stateId,
                  value: Math.round(value * 10) / 10,
                });
              }}
              onMouseLeave={() => setTooltip(null)}
            />
          );
        })}
      </svg>

      {/* Tooltip */}
      {tooltip?.show && (
        <div
          className="map-tooltip"
          style={{
            left: tooltip.x + 15,
            top: tooltip.y,
            transform: 'translateY(-50%)',
          }}
        >
          <div style={{ fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '0.25rem' }}>
            {tooltip.stateName}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
            <span style={{ textTransform: 'capitalize' }}>{variable}:</span>
            <span className="mono-value" style={{ fontSize: '0.85rem' }}>
              {tooltip.value}{getValueUnit(variable)}
            </span>
          </div>
          {stateDataMap[tooltip.stateId] && (
            <>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Temp: {stateDataMap[tooltip.stateId].min_temp_c}° - {stateDataMap[tooltip.stateId].max_temp_c}°C
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                Humidity: {stateDataMap[tooltip.stateId].humidity_pct}%
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
