export interface IndiaState {
  id: string;
  name: string;
  lat: number;
  lon: number;
  coastal: boolean;
  zone: string;
  annualRainfall: number; // mm climatological average
  avgMaxTemp: number; // °C annual avg
  avgMinTemp: number; // °C annual avg
}

export const INDIA_STATES: IndiaState[] = [
  { id: 'AN', name: 'Andaman & Nicobar', lat: 11.74, lon: 92.66, coastal: true, zone: 'Island', annualRainfall: 3000, avgMaxTemp: 31, avgMinTemp: 23 },
  { id: 'AP', name: 'Andhra Pradesh', lat: 15.91, lon: 79.74, coastal: true, zone: 'South', annualRainfall: 940, avgMaxTemp: 34, avgMinTemp: 22 },
  { id: 'AR', name: 'Arunachal Pradesh', lat: 28.21, lon: 94.72, coastal: false, zone: 'Northeast', annualRainfall: 2800, avgMaxTemp: 22, avgMinTemp: 10 },
  { id: 'AS', name: 'Assam', lat: 26.14, lon: 91.77, coastal: false, zone: 'Northeast', annualRainfall: 2820, avgMaxTemp: 28, avgMinTemp: 15 },
  { id: 'BR', name: 'Bihar', lat: 25.09, lon: 85.31, coastal: false, zone: 'East', annualRainfall: 1210, avgMaxTemp: 33, avgMinTemp: 17 },
  { id: 'CH', name: 'Chandigarh', lat: 30.73, lon: 76.78, coastal: false, zone: 'North', annualRainfall: 1100, avgMaxTemp: 32, avgMinTemp: 15 },
  { id: 'CG', name: 'Chhattisgarh', lat: 21.27, lon: 81.86, coastal: false, zone: 'Central', annualRainfall: 1370, avgMaxTemp: 34, avgMinTemp: 19 },
  { id: 'DL', name: 'Delhi', lat: 28.70, lon: 77.10, coastal: false, zone: 'North', annualRainfall: 790, avgMaxTemp: 34, avgMinTemp: 17 },
  { id: 'GA', name: 'Goa', lat: 15.29, lon: 74.12, coastal: true, zone: 'West', annualRainfall: 2930, avgMaxTemp: 33, avgMinTemp: 22 },
  { id: 'GJ', name: 'Gujarat', lat: 22.25, lon: 71.19, coastal: true, zone: 'West', annualRainfall: 800, avgMaxTemp: 35, avgMinTemp: 19 },
  { id: 'HR', name: 'Haryana', lat: 29.05, lon: 76.09, coastal: false, zone: 'North', annualRainfall: 550, avgMaxTemp: 33, avgMinTemp: 15 },
  { id: 'HP', name: 'Himachal Pradesh', lat: 31.10, lon: 77.17, coastal: false, zone: 'North', annualRainfall: 1520, avgMaxTemp: 22, avgMinTemp: 7 },
  { id: 'JK', name: 'Jammu & Kashmir', lat: 33.73, lon: 76.92, coastal: false, zone: 'North', annualRainfall: 1140, avgMaxTemp: 18, avgMinTemp: 4 },
  { id: 'JH', name: 'Jharkhand', lat: 23.61, lon: 85.27, coastal: false, zone: 'East', annualRainfall: 1400, avgMaxTemp: 33, avgMinTemp: 17 },
  { id: 'KA', name: 'Karnataka', lat: 15.31, lon: 75.71, coastal: true, zone: 'South', annualRainfall: 1280, avgMaxTemp: 33, avgMinTemp: 20 },
  { id: 'KL', name: 'Kerala', lat: 10.85, lon: 76.27, coastal: true, zone: 'South', annualRainfall: 3050, avgMaxTemp: 32, avgMinTemp: 23 },
  { id: 'LA', name: 'Ladakh', lat: 34.22, lon: 77.58, coastal: false, zone: 'North', annualRainfall: 100, avgMaxTemp: 12, avgMinTemp: -8 },
  { id: 'MP', name: 'Madhya Pradesh', lat: 22.97, lon: 78.65, coastal: false, zone: 'Central', annualRainfall: 1160, avgMaxTemp: 34, avgMinTemp: 18 },
  { id: 'MH', name: 'Maharashtra', lat: 19.75, lon: 75.71, coastal: true, zone: 'West', annualRainfall: 1170, avgMaxTemp: 34, avgMinTemp: 20 },
  { id: 'MN', name: 'Manipur', lat: 24.66, lon: 93.90, coastal: false, zone: 'Northeast', annualRainfall: 1470, avgMaxTemp: 26, avgMinTemp: 12 },
  { id: 'ML', name: 'Meghalaya', lat: 25.46, lon: 91.36, coastal: false, zone: 'Northeast', annualRainfall: 4000, avgMaxTemp: 24, avgMinTemp: 12 },
  { id: 'MZ', name: 'Mizoram', lat: 23.16, lon: 92.94, coastal: false, zone: 'Northeast', annualRainfall: 2500, avgMaxTemp: 26, avgMinTemp: 13 },
  { id: 'NL', name: 'Nagaland', lat: 26.15, lon: 94.56, coastal: false, zone: 'Northeast', annualRainfall: 1800, avgMaxTemp: 25, avgMinTemp: 12 },
  { id: 'OR', name: 'Odisha', lat: 20.94, lon: 85.09, coastal: true, zone: 'East', annualRainfall: 1490, avgMaxTemp: 34, avgMinTemp: 20 },
  { id: 'PB', name: 'Punjab', lat: 31.14, lon: 75.34, coastal: false, zone: 'North', annualRainfall: 650, avgMaxTemp: 33, avgMinTemp: 14 },
  { id: 'RJ', name: 'Rajasthan', lat: 27.02, lon: 74.21, coastal: false, zone: 'West', annualRainfall: 350, avgMaxTemp: 37, avgMinTemp: 18 },
  { id: 'SK', name: 'Sikkim', lat: 27.53, lon: 88.51, coastal: false, zone: 'Northeast', annualRainfall: 2740, avgMaxTemp: 19, avgMinTemp: 6 },
  { id: 'TN', name: 'Tamil Nadu', lat: 11.12, lon: 78.65, coastal: true, zone: 'South', annualRainfall: 960, avgMaxTemp: 34, avgMinTemp: 23 },
  { id: 'TS', name: 'Telangana', lat: 18.11, lon: 79.01, coastal: false, zone: 'South', annualRainfall: 950, avgMaxTemp: 35, avgMinTemp: 20 },
  { id: 'TR', name: 'Tripura', lat: 23.94, lon: 91.98, coastal: false, zone: 'Northeast', annualRainfall: 2100, avgMaxTemp: 30, avgMinTemp: 15 },
  { id: 'UP', name: 'Uttar Pradesh', lat: 26.84, lon: 80.94, coastal: false, zone: 'North', annualRainfall: 990, avgMaxTemp: 34, avgMinTemp: 16 },
  { id: 'UK', name: 'Uttarakhand', lat: 30.06, lon: 79.01, coastal: false, zone: 'North', annualRainfall: 1530, avgMaxTemp: 24, avgMinTemp: 9 },
  { id: 'WB', name: 'West Bengal', lat: 22.98, lon: 87.74, coastal: true, zone: 'East', annualRainfall: 1750, avgMaxTemp: 32, avgMinTemp: 18 },
];

export const ZONES = ['North', 'South', 'East', 'West', 'Central', 'Northeast', 'Island'] as const;

export const MAJOR_CITIES = [
  { name: 'Delhi', state: 'DL', lat: 28.70, lon: 77.10 },
  { name: 'Mumbai', state: 'MH', lat: 19.07, lon: 72.87 },
  { name: 'Chennai', state: 'TN', lat: 13.08, lon: 80.27 },
  { name: 'Kolkata', state: 'WB', lat: 22.57, lon: 88.36 },
  { name: 'Bangalore', state: 'KA', lat: 12.97, lon: 77.59 },
  { name: 'Bhopal', state: 'MP', lat: 23.26, lon: 77.41 },
  { name: 'Jaipur', state: 'RJ', lat: 26.91, lon: 75.78 },
  { name: 'Lucknow', state: 'UP', lat: 26.84, lon: 80.94 },
  { name: 'Hyderabad', state: 'TS', lat: 17.38, lon: 78.48 },
  { name: 'Ahmedabad', state: 'GJ', lat: 23.02, lon: 72.57 },
];

export const AGRO_CLIMATIC_ZONES = [
  { id: 1, name: 'Western Himalayan', states: ['JK', 'HP', 'UK', 'LA'] },
  { id: 2, name: 'Eastern Himalayan', states: ['AR', 'SK', 'ML', 'NL', 'MN', 'MZ', 'TR', 'AS'] },
  { id: 3, name: 'Lower Gangetic Plains', states: ['WB'] },
  { id: 4, name: 'Middle Gangetic Plains', states: ['UP', 'BR'] },
  { id: 5, name: 'Upper Gangetic Plains', states: ['UP'] },
  { id: 6, name: 'Trans-Gangetic Plains', states: ['PB', 'HR', 'DL', 'CH'] },
  { id: 7, name: 'Eastern Plateau & Hills', states: ['JH', 'OR', 'CG'] },
  { id: 8, name: 'Central Plateau & Hills', states: ['MP', 'RJ'] },
  { id: 9, name: 'Western Plateau & Hills', states: ['MH'] },
  { id: 10, name: 'Southern Plateau & Hills', states: ['AP', 'TS', 'KA'] },
  { id: 11, name: 'East Coast Plains & Hills', states: ['TN', 'AP', 'OR'] },
  { id: 12, name: 'West Coast Plains & Ghat', states: ['KL', 'GA', 'KA', 'MH'] },
  { id: 13, name: 'Gujarat Plains & Hills', states: ['GJ'] },
  { id: 14, name: 'Western Dry Region', states: ['RJ'] },
  { id: 15, name: 'Island Region', states: ['AN'] },
];

export function getStateById(id: string): IndiaState | undefined {
  return INDIA_STATES.find(s => s.id === id);
}

export function getStatesByZone(zone: string): IndiaState[] {
  return INDIA_STATES.filter(s => s.zone === zone);
}
