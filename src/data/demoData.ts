// Demo data for CYCLONE INTELLIGENCE prototype
// All values are simulated for demonstration purposes.

export type CycloneStatus = 'active' | 'dissipated' | 'forming';
export type CycloneCategory = 'Depression' | 'Deep Depression' | 'Cyclonic Storm' | 'Severe Cyclonic Storm' | 'Very Severe Cyclonic Storm' | 'Extremely Severe Cyclonic Storm' | 'Super Cyclonic Storm';

export interface TrackPoint {
  lat: number;
  lon: number;
  time: string;
  intensity: number; // knots
  pressure: number; // hPa
  category: CycloneCategory;
}

export interface Cyclone {
  id: string;
  name: string;
  basin: 'Bay of Bengal' | 'Arabian Sea';
  status: CycloneStatus;
  category: CycloneCategory;
  currentLat: number;
  currentLon: number;
  maxWind: number; // knots
  centralPressure: number; // hPa
  movementDir: string;
  movementSpeed: number; // km/h
  observedAt: string;
  confidence: number; // %
  track: TrackPoint[];
  forecastTrack: TrackPoint[];
  radius: number; // km
}

// Coordinate conversion for the map (Bay of Bengal / Arabian Sea region)
// Map bounds: lon 60-100, lat 0-30
export const MAP_BOUNDS = { minLon: 60, maxLon: 100, minLat: 0, maxLat: 30 };
export const MAP_W = 800;
export const MAP_H = 480;

export function lonToX(lon: number, width: number): number {
  return ((lon - MAP_BOUNDS.minLon) / (MAP_BOUNDS.maxLon - MAP_BOUNDS.minLon)) * width;
}
export function latToY(lat: number, height: number): number {
  return height - ((lat - MAP_BOUNDS.minLat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * height;
}

// India coastline (simplified but recognizable)
export const INDIA_COASTLINE: [number, number][] = [
  [68.0, 24.0], [68.5, 22.5], [69.5, 21.0], [70.0, 19.5], [71.0, 18.0],
  [72.0, 16.5], [72.5, 15.0], [73.0, 13.5], [73.5, 12.0], [74.0, 10.5],
  [75.0, 9.0], [76.0, 8.0], [77.0, 8.5], [78.0, 9.5], [79.0, 10.5],
  [80.0, 11.5], [80.5, 13.0], [80.5, 14.5], [81.0, 16.0], [82.0, 17.0],
  [83.0, 18.0], [84.0, 19.5], [85.0, 21.0], [86.0, 21.5], [87.0, 22.0],
  [88.0, 21.5], [89.0, 21.0], [90.0, 22.0], [91.0, 22.5], [92.0, 22.0],
  [93.0, 22.5], [94.0, 23.0], [95.0, 24.0], [96.0, 25.0], [97.0, 25.5],
  [98.0, 26.0], [99.0, 25.5], [99.5, 24.0], [99.0, 23.0], [98.0, 22.0],
  [97.0, 21.0], [96.0, 20.0], [95.0, 19.0], [94.0, 18.0], [93.0, 17.0],
  [92.0, 16.0], [91.0, 15.0], [90.5, 14.0], [90.0, 13.0], [89.0, 12.0],
  [88.0, 11.0], [87.0, 10.0], [86.0, 9.5], [85.0, 9.0], [84.0, 9.5],
  [83.0, 10.0], [82.0, 10.5], [81.0, 10.0], [80.0, 9.5], [79.0, 9.0],
  [78.0, 8.5], [77.5, 8.0], [77.0, 8.0], [76.0, 8.0], [75.0, 8.5],
  [74.0, 9.0], [73.0, 10.0], [72.0, 11.0], [71.0, 12.5], [70.5, 14.0],
  [70.0, 15.5], [69.5, 17.0], [69.0, 18.5], [68.5, 20.0], [68.0, 22.0],
  [67.5, 23.5], [68.0, 24.0],
];

// Sri Lanka (simplified)
export const SRI_LANKA: [number, number][] = [
  [80.0, 9.5], [80.5, 9.0], [81.0, 8.5], [81.5, 8.0], [82.0, 7.0],
  [82.0, 6.0], [81.5, 5.5], [81.0, 5.5], [80.5, 6.0], [80.0, 6.5],
  [79.5, 7.5], [79.5, 8.5], [80.0, 9.5],
];

export const CYCLONES: Cyclone[] = [
  {
    id: 'TC-DEMO-01',
    name: 'ASANI',
    basin: 'Bay of Bengal',
    status: 'active',
    category: 'Severe Cyclonic Storm',
    currentLat: 13.2,
    currentLon: 84.5,
    maxWind: 75,
    centralPressure: 982,
    movementDir: 'NNW',
    movementSpeed: 12,
    observedAt: '26 Sep 2026 • 18:00 UTC',
    confidence: 87,
    radius: 280,
    track: [
      { lat: 8.0, lon: 88.0, time: '23 Sep • 06:00', intensity: 25, pressure: 1004, category: 'Depression' },
      { lat: 9.0, lon: 87.5, time: '23 Sep • 18:00', intensity: 30, pressure: 1000, category: 'Deep Depression' },
      { lat: 10.0, lon: 87.0, time: '24 Sep • 06:00', intensity: 35, pressure: 996, category: 'Cyclonic Storm' },
      { lat: 10.8, lon: 86.5, time: '24 Sep • 18:00', intensity: 45, pressure: 992, category: 'Cyclonic Storm' },
      { lat: 11.5, lon: 86.0, time: '25 Sep • 06:00', intensity: 55, pressure: 988, category: 'Cyclonic Storm' },
      { lat: 12.2, lon: 85.5, time: '25 Sep • 18:00', intensity: 65, pressure: 984, category: 'Severe Cyclonic Storm' },
      { lat: 13.2, lon: 84.5, time: '26 Sep • 18:00', intensity: 75, pressure: 982, category: 'Severe Cyclonic Storm' },
    ],
    forecastTrack: [
      { lat: 14.0, lon: 84.0, time: '27 Sep • 06:00', intensity: 80, pressure: 980, category: 'Severe Cyclonic Storm' },
      { lat: 15.0, lon: 83.5, time: '27 Sep • 18:00', intensity: 85, pressure: 978, category: 'Severe Cyclonic Storm' },
      { lat: 16.0, lon: 83.0, time: '28 Sep • 06:00', intensity: 90, pressure: 976, category: 'Very Severe Cyclonic Storm' },
      { lat: 17.0, lon: 82.5, time: '28 Sep • 18:00', intensity: 85, pressure: 978, category: 'Severe Cyclonic Storm' },
      { lat: 18.0, lon: 82.0, time: '29 Sep • 06:00', intensity: 70, pressure: 985, category: 'Severe Cyclonic Storm' },
      { lat: 19.0, lon: 81.5, time: '29 Sep • 18:00', intensity: 50, pressure: 992, category: 'Cyclonic Storm' },
    ],
  },
  {
    id: 'TC-DEMO-02',
    name: 'TAUKTAE',
    basin: 'Arabian Sea',
    status: 'active',
    category: 'Cyclonic Storm',
    currentLat: 17.8,
    currentLon: 71.5,
    maxWind: 45,
    centralPressure: 994,
    movementDir: 'N',
    movementSpeed: 8,
    observedAt: '26 Sep 2026 • 18:00 UTC',
    confidence: 79,
    radius: 180,
    track: [
      { lat: 14.0, lon: 70.0, time: '25 Sep • 06:00', intensity: 25, pressure: 1006, category: 'Depression' },
      { lat: 15.0, lon: 70.5, time: '25 Sep • 18:00', intensity: 30, pressure: 1002, category: 'Deep Depression' },
      { lat: 16.0, lon: 71.0, time: '26 Sep • 06:00', intensity: 35, pressure: 998, category: 'Cyclonic Storm' },
      { lat: 17.8, lon: 71.5, time: '26 Sep • 18:00', intensity: 45, pressure: 994, category: 'Cyclonic Storm' },
    ],
    forecastTrack: [
      { lat: 18.5, lon: 71.5, time: '27 Sep • 06:00', intensity: 50, pressure: 990, category: 'Cyclonic Storm' },
      { lat: 19.5, lon: 71.5, time: '27 Sep • 18:00', intensity: 55, pressure: 988, category: 'Cyclonic Storm' },
      { lat: 20.5, lon: 71.0, time: '28 Sep • 06:00', intensity: 45, pressure: 994, category: 'Cyclonic Storm' },
      { lat: 21.5, lon: 70.5, time: '28 Sep • 18:00', intensity: 30, pressure: 1000, category: 'Deep Depression' },
    ],
  },
];

export interface SatelliteObservation {
  id: string;
  source: 'INSAT-3DR' | 'INSAT-3D' | 'NOAA-20' | 'NOAA-21' | 'Himawari-9' | 'Sentinel-1' | 'Sentinel-2' | 'MODIS-Aqua' | 'MODIS-Terra';
  sourceFamily: 'INSAT' | 'NOAA' | 'Himawari' | 'Sentinel' | 'MODIS';
  timestamp: string;
  region: string;
  sensor: string;
  product: string;
  resolution: string;
  status: 'Processed' | 'Processing' | 'Acquired' | 'Scheduled';
  cloudCover: number;
}

export const SATELLITE_OBSERVATIONS: SatelliteObservation[] = [
  { id: 'SAT-001', source: 'INSAT-3DR', sourceFamily: 'INSAT', timestamp: '26 Sep 2026 • 17:30 UTC', region: 'Bay of Bengal (Central)', sensor: 'Imager', product: 'IR Brightness Temperature', resolution: '4 km', status: 'Processed', cloudCover: 42 },
  { id: 'SAT-002', source: 'INSAT-3D', sourceFamily: 'INSAT', timestamp: '26 Sep 2026 • 17:00 UTC', region: 'Arabian Sea (East)', sensor: 'Sounder', product: 'Atmospheric Profile', resolution: '10 km', status: 'Processed', cloudCover: 35 },
  { id: 'SAT-003', source: 'Himawari-9', sourceFamily: 'Himawari', timestamp: '26 Sep 2026 • 18:00 UTC', region: 'Bay of Bengal (Full Disk)', sensor: 'AHI', product: 'Visible (Red Band)', resolution: '0.5 km', status: 'Processing', cloudCover: 48 },
  { id: 'SAT-004', source: 'NOAA-20', sourceFamily: 'NOAA', timestamp: '26 Sep 2026 • 16:45 UTC', region: 'North Indian Ocean', sensor: 'VIIRS', product: 'Day-Night Band', resolution: '0.75 km', status: 'Processed', cloudCover: 30 },
  { id: 'SAT-005', source: 'MODIS-Aqua', sourceFamily: 'MODIS', timestamp: '26 Sep 2026 • 15:30 UTC', region: 'Bay of Bengal (North)', sensor: 'MODIS', product: 'SST + Cloud Top Temp', resolution: '1 km', status: 'Processed', cloudCover: 55 },
  { id: 'SAT-006', source: 'Sentinel-1', sourceFamily: 'Sentinel', timestamp: '26 Sep 2026 • 14:10 UTC', region: 'Arabian Sea (West)', sensor: 'SAR-C', product: 'Wind Field (C-band)', resolution: '100 m', status: 'Acquired', cloudCover: 0 },
  { id: 'SAT-007', source: 'Sentinel-2', sourceFamily: 'Sentinel', timestamp: '26 Sep 2026 • 13:05 UTC', region: 'Coastal Tamil Nadu', sensor: 'MSI', product: 'True Color Composite', resolution: '10 m', status: 'Scheduled', cloudCover: 60 },
  { id: 'SAT-008', source: 'NOAA-21', sourceFamily: 'NOAA', timestamp: '26 Sep 2026 • 12:20 UTC', region: 'Equatorial Indian Ocean', sensor: 'VIIRS', product: 'IR Thermal', resolution: '0.75 km', status: 'Processed', cloudCover: 38 },
  { id: 'SAT-009', source: 'MODIS-Terra', sourceFamily: 'MODIS', timestamp: '26 Sep 2026 • 11:00 UTC', region: 'Bay of Bengal (South)', sensor: 'MODIS', product: 'Cloud Mask + Phase', resolution: '1 km', status: 'Processing', cloudCover: 65 },
  { id: 'SAT-010', source: 'INSAT-3DR', sourceFamily: 'INSAT', timestamp: '26 Sep 2026 • 10:30 UTC', region: 'Arabian Sea (Full)', sensor: 'Imager', product: 'WV Channel', resolution: '8 km', status: 'Processed', cloudCover: 40 },
];

export interface AlertItem {
  id: string;
  severity: 'Advisory' | 'Watch' | 'Warning';
  system: string;
  region: string;
  message: string;
  issuedAt: string;
  validUntil: string;
}

export const ALERTS: AlertItem[] = [
  { id: 'ALR-001', severity: 'Warning', system: 'TC-DEMO-01 (ASANI)', region: 'Andhra Pradesh Coast', message: 'Landfall expected within 48 hours. Sustained winds 70-80 kt. Fishermen advised to return to harbor.', issuedAt: '26 Sep 2026 • 15:00 UTC', validUntil: '28 Sep 2026 • 18:00 UTC' },
  { id: 'ALR-002', severity: 'Watch', system: 'TC-DEMO-01 (ASANI)', region: 'Odisha Coast', message: 'Cyclone track forecast indicates approach toward coastal districts. Precautionary measures recommended.', issuedAt: '26 Sep 2026 • 15:00 UTC', validUntil: '29 Sep 2026 • 06:00 UTC' },
  { id: 'ALR-003', severity: 'Advisory', system: 'TC-DEMO-02 (TAUKTAE)', region: 'Maharashtra Coast', message: 'Developing system in east-central Arabian Sea. Sea conditions likely rough. Small craft advisory in effect.', issuedAt: '26 Sep 2026 • 12:00 UTC', validUntil: '28 Sep 2026 • 12:00 UTC' },
  { id: 'ALR-004', severity: 'Watch', system: 'TC-DEMO-01 (ASANI)', region: 'Tamil Nadu Coast', message: 'Outer rain bands may affect coastal Tamil Nadu. Heavy rainfall warning for delta districts.', issuedAt: '26 Sep 2026 • 09:00 UTC', validUntil: '27 Sep 2026 • 18:00 UTC' },
];

export interface HistoricalEvent {
  id: string;
  name: string;
  year: number;
  basin: string;
  category: CycloneCategory;
  maxWind: number;
  minPressure: number;
  landfall: string;
  landfallLocation: string;
  casualties: string;
  damage: string;
  duration: string;
}

export const HISTORICAL_EVENTS: HistoricalEvent[] = [
  { id: 'H-001', name: 'Amphan', year: 2020, basin: 'Bay of Bengal', category: 'Super Cyclonic Storm', maxWind: 150, minPressure: 920, landfall: '20 May 2020', landfallLocation: 'West Bengal (Bakkhali)', casualties: '128', damage: '$13.5B', duration: '16-21 May' },
  { id: 'H-002', name: 'Fani', year: 2019, basin: 'Bay of Bengal', category: 'Extremely Severe Cyclonic Storm', maxWind: 140, minPressure: 932, landfall: '03 May 2019', landfallLocation: 'Odisha (Puri)', casualties: '89', damage: '$8.1B', duration: '27 Apr - 05 May' },
  { id: 'H-003', name: 'Tauktae', year: 2021, basin: 'Arabian Sea', category: 'Extremely Severe Cyclonic Storm', maxWind: 130, minPressure: 950, landfall: '17 May 2021', landfallLocation: 'Gujarat (Diuna)', casualties: '174', damage: '$2.1B', duration: '14-19 May' },
  { id: 'H-004', name: 'Yaas', year: 2021, basin: 'Bay of Bengal', category: 'Very Severe Cyclonic Storm', maxWind: 120, minPressure: 967, landfall: '26 May 2021', landfallLocation: 'Odisha (Balasore)', casualties: '20', damage: '$2.7B', duration: '23-28 May' },
  { id: 'H-005', name: 'Nisarga', year: 2020, basin: 'Arabian Sea', category: 'Severe Cyclonic Storm', maxWind: 65, minPressure: 984, landfall: '03 Jun 2020', landfallLocation: 'Maharashtra (Alibag)', casualties: '6', damage: '$0.8B', duration: '01-04 Jun' },
  { id: 'H-006', name: 'Phailin', year: 2013, basin: 'Bay of Bengal', category: 'Very Severe Cyclonic Storm', maxWind: 140, minPressure: 940, landfall: '12 Oct 2013', landfallLocation: 'Odisha (Gopalpur)', casualties: '45', damage: '$1.5B', duration: '08-14 Oct' },
  { id: 'H-007', name: 'Hudhud', year: 2014, basin: 'Bay of Bengal', category: 'Very Severe Cyclonic Storm', maxWind: 130, minPressure: 950, landfall: '12 Oct 2014', landfallLocation: 'Andhra Pradesh (Visakhapatnam)', casualties: '124', damage: '$3.4B', duration: '07-14 Oct' },
  { id: 'H-008', name: 'Vardah', year: 2016, basin: 'Bay of Bengal', category: 'Very Severe Cyclonic Storm', maxWind: 100, minPressure: 982, landfall: '12 Dec 2016', landfallLocation: 'Tamil Nadu (Chennai)', casualties: '38', damage: '$0.7B', duration: '06-13 Dec' },
  { id: 'H-009', name: 'Gaja', year: 2018, basin: 'Bay of Bengal', category: 'Very Severe Cyclonic Storm', maxWind: 90, minPressure: 972, landfall: '16 Nov 2018', landfallLocation: 'Tamil Nadu (Nagapattinam)', casualties: '52', damage: '$0.6B', duration: '10-19 Nov' },
  { id: 'H-010', name: 'Titli', year: 2018, basin: 'Bay of Bengal', category: 'Very Severe Cyclonic Storm', maxWind: 95, minPressure: 972, landfall: '11 Oct 2018', landfallLocation: 'Odisha (Palasa)', casualties: '77', damage: '$0.5B', duration: '08-13 Oct' },
  { id: 'H-011', name: 'Bulbul', year: 2019, basin: 'Bay of Bengal', category: 'Very Severe Cyclonic Storm', maxWind: 85, minPressure: 976, landfall: '09 Nov 2019', landfallLocation: 'West Bengal (Sagar Island)', casualties: '43', damage: '$2.7B', duration: '05-10 Nov' },
  { id: 'H-012', name: 'Mocha', year: 2023, basin: 'Bay of Bengal', category: 'Extremely Severe Cyclonic Storm', maxWind: 130, minPressure: 938, landfall: '14 May 2023', landfallLocation: 'Myanmar (Sittwe)', casualties: '463', damage: '$1.5B', duration: '11-15 May' },
];

export interface ModelMetric {
  metric: string;
  value: number;
  target: number;
  unit: string;
  description: string;
}

export const MODEL_METRICS: ModelMetric[] = [
  { metric: 'Detection Accuracy', value: 94.2, target: 95, unit: '%', description: 'Correct cyclone identification vs ground truth' },
  { metric: 'Classification F1-Score', value: 0.887, target: 0.90, unit: '', description: 'Multi-class cyclone intensity classification' },
  { metric: 'Track Error (24h)', value: 68, target: 60, unit: 'km', description: 'Mean track position error at 24-hour lead time' },
  { metric: 'Track Error (48h)', value: 142, target: 120, unit: 'km', description: 'Mean track position error at 48-hour lead time' },
  { metric: 'Intensity Error (24h)', value: 8.3, target: 7, unit: 'kt', description: 'Mean absolute wind error at 24-hour lead time' },
  { metric: 'Intensity Error (48h)', value: 14.1, target: 12, unit: 'kt', description: 'Mean absolute wind error at 48-hour lead time' },
  { metric: 'False Positive Rate', value: 3.1, target: 5, unit: '%', description: 'Incorrect cyclone detections in clear scenes' },
  { metric: 'Model Inference Time', value: 1.8, target: 2, unit: 's', description: 'Average time per satellite scene analysis' },
];

export const FUSION_STAGES = [
  { id: 'sources', label: 'Satellite Sources', detail: 'INSAT, NOAA, Himawari, Sentinel, and MODIS imagery are acquired in multiple spectral bands (VIS, IR, WV, microwave). Each source contributes complementary spatial, temporal, and spectral coverage of the North Indian Ocean basin.' },
  { id: 'ingestion', label: 'Data Ingestion', detail: 'Observations are ingested via direct broadcast and archive feeds. Metadata (timestamp, geolocation, sensor calibration) is validated and standardized into a common grid projection (0.05° lat/lon).' },
  { id: 'preprocess', label: 'Pre-processing', detail: 'Radiometric calibration, georeferencing, and re-projection are applied. Multi-source data is resampled to a common spatial resolution and temporal window for fusion.' },
  { id: 'cloud', label: 'Cloud / Noise Handling', detail: 'Cloud masking using thresholding and ML-based segmentation. Thin cirrus and noise artifacts are identified and flagged. Missing pixels are interpolated using temporal compositing.' },
  { id: 'features', label: 'Feature Extraction', detail: 'Deep convolutional features are extracted from each scene: cloud organization patterns, brightness temperature gradients, spiral band structure, eye detection, and Dvorak-style intensity parameters.' },
  { id: 'model', label: 'AI/ML Model', detail: 'A multi-branch CNN-LSTM architecture ingests fused multi-source features. The model performs detection (binary), classification (7 intensity categories), and prediction (track + intensity for 24/48/72h lead times).' },
  { id: 'detection', label: 'Cyclone Detection', detail: 'The model outputs bounding regions and center coordinates for detected cyclonic systems. Detection confidence is computed from ensemble agreement across input sources.' },
  { id: 'classification', label: 'Classification', detail: 'Each detected system is classified into IMD intensity categories (Depression through Super Cyclonic Storm) using wind-speed and pressure estimates derived from the model.' },
  { id: 'prediction', label: 'Prediction', detail: 'Track and intensity forecasts are generated for 24, 48, and 72-hour lead times. A forecast uncertainty corridor is computed from ensemble spread.' },
];

export const REGIONS = [
  'Bay of Bengal (Central)', 'Bay of Bengal (North)', 'Bay of Bengal (South)',
  'Arabian Sea (East)', 'Arabian Sea (West)', 'Arabian Sea (Central)',
  'Gulf of Mannar', 'Palk Strait', 'Andhra Pradesh Coast', 'Tamil Nadu Coast',
  'Odisha Coast', 'West Bengal Coast', 'Gujarat Coast', 'Sri Lanka (North)',
];
