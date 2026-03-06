import { Brand, PhoneModel } from './types';

export const PPI_PRINT = 300; // Standard print resolution (300 DPI) for balance of quality and performance
export const PX_PER_MM = PPI_PRINT / 25.4;

export const FONTS = [
  { name: 'Inter', family: 'Inter, sans-serif' },
  { name: 'Roboto', family: 'Roboto, sans-serif' },
  { name: 'Serif', family: 'Playfair Display, serif' },
  { name: 'Modern', family: 'Montserrat, sans-serif' },
  { name: 'Condensed', family: 'Oswald, sans-serif' },
  { name: 'Handwritten', family: 'Dancing Script, cursive' },
];

/**
 * ------------------------------------------------------------------
 * MODEL-SPECIFIC CAMERA PATHS
 * ------------------------------------------------------------------
 * Unique SVG paths for each device to ensure exact cutout precision.
 * Coordinates are in millimeters (mm).
 */
const CAMERA_DUMPS = {
  // --- APPLE ---
  
  // iPhone 16 Plus: Vertical Pill + Side Flash
  // Island: ~18mm x 37mm, positioned ~9mm from top-left
  // Flash: ~7mm diameter, centered vertically with island
  IPHONE_16_PLUS: `
    M 9 18.5 a 9 9 0 0 1 18 0 v 19 a 9 9 0 0 1 -18 0 z
    M 36 27.5 m -3.5 0 a 3.5 3.5 0 1 0 7 0 a 3.5 3.5 0 1 0 -7 0
  `,

  // iPhone 16: Slightly smaller body, similar island ratio
  IPHONE_16: `
    M 8 17 a 8.5 8.5 0 0 1 17 0 v 18 a 8.5 8.5 0 0 1 -17 0 z
    M 33 26 m -3 0 a 3 3 0 1 0 6 0 a 3 3 0 1 0 -6 0
  `,

  // Pro Max Island (Large Triangle Layout)
  IPHONE_16_PRO_MAX: "M 12 12 h 28 a 9 9 0 0 1 9 9 v 28 a 9 9 0 0 1 -9 9 h -28 a 9 9 0 0 1 -9 -9 v -28 a 9 9 0 0 1 9 -9 z",
  IPHONE_16_PRO: "M 11 11 h 26 a 9 9 0 0 1 9 9 v 26 a 9 9 0 0 1 -9 9 h -26 a 9 9 0 0 1 -9 -9 v -26 a 9 9 0 0 1 9 -9 z",

  // 15 Series
  IPHONE_15_PRO_MAX: "M 12 12 h 27 a 9 9 0 0 1 9 9 v 27 a 9 9 0 0 1 -9 9 h -27 a 9 9 0 0 1 -9 -9 v -27 a 9 9 0 0 1 9 -9 z",
  IPHONE_15_PRO: "M 11 11 h 26 a 9 9 0 0 1 9 9 v 26 a 9 9 0 0 1 -9 9 h -26 a 9 9 0 0 1 -9 -9 v -26 a 9 9 0 0 1 9 -9 z",
  IPHONE_15_PLUS: `
    M 11.5 3.5 h 13.5 a 8 8 0 0 1 8 8 v 13.5 a 8 8 0 0 1 -8 8 h -13.5 a 8 8 0 0 1 -8 -8 v -13.5 a 8 8 0 0 1 8 -8 z
    M 10.9 10.9 m -2.75 0 a 2.75 2.75 0 1 0 5.5 0 a 2.75 2.75 0 1 0 -5.5 0
    M 25.6 10.9 m -7.25 0 a 7.25 7.25 0 1 0 14.5 0 a 7.25 7.25 0 1 0 -14.5 0
  `,
  IPHONE_15: `
    M 10.5 3.5 h 13 a 8 8 0 0 1 8 8 v 13 a 8 8 0 0 1 -8 8 h -13 a 8 8 0 0 1 -8 -8 v -13 a 8 8 0 0 1 8 -8 z
    M 10 10 m -2.5 0 a 2.5 2.5 0 1 0 5 0 a 2.5 2.5 0 1 0 -5 0
    M 24 10 m -7 0 a 7 7 0 1 0 14 0 a 7 7 0 1 0 -14 0
  `,

  // --- SAMSUNG ---
  // S24 Ultra: 5 Individual Lenses
  SAMSUNG_S24_ULTRA: `
    M 12 15 a 4 4 0 1 0 8 0 a 4 4 0 1 0 -8 0 
    M 12 30 a 4 4 0 1 0 8 0 a 4 4 0 1 0 -8 0 
    M 12 45 a 4 4 0 1 0 8 0 a 4 4 0 1 0 -8 0 
    M 28 15 a 3 3 0 1 0 6 0 a 3 3 0 1 0 -6 0
    M 28 30 a 3 3 0 1 0 6 0 a 3 3 0 1 0 -6 0
  `,
  // S24+: 3 Vertical Lenses
  SAMSUNG_S24_PLUS: `
    M 11 12 a 3.5 3.5 0 1 0 7 0 a 3.5 3.5 0 1 0 -7 0 
    M 11 27 a 3.5 3.5 0 1 0 7 0 a 3.5 3.5 0 1 0 -7 0 
    M 11 42 a 3.5 3.5 0 1 0 7 0 a 3.5 3.5 0 1 0 -7 0 
  `,
  SAMSUNG_S24: `
    M 10 12 a 3.5 3.5 0 1 0 7 0 a 3.5 3.5 0 1 0 -7 0 
    M 10 26 a 3.5 3.5 0 1 0 7 0 a 3.5 3.5 0 1 0 -7 0 
    M 10 40 a 3.5 3.5 0 1 0 7 0 a 3.5 3.5 0 1 0 -7 0 
  `,
  SAMSUNG_Z_FOLD_6: `
    M 12 12 a 3.5 3.5 0 1 0 7 0 a 3.5 3.5 0 1 0 -7 0 
    M 12 26 a 3.5 3.5 0 1 0 7 0 a 3.5 3.5 0 1 0 -7 0 
    M 12 40 a 3.5 3.5 0 1 0 7 0 a 3.5 3.5 0 1 0 -7 0 
    M 33.05 0 h 2 v 153.5 h -2 z
  `,
  SAMSUNG_Z_FLIP_6: `M 5 5 h 60 v 35 h -60 z M 10 12 a 6 6 0 1 0 12 0 a 6 6 0 1 0 -12 0 M 30 12 a 6 6 0 1 0 12 0 a 6 6 0 1 0 -12 0 M 0 81.5 h 71.9 v 2 h -71.9 z`,

  // --- GOOGLE ---
  // Pixel 9 Series (Pill Island)
  GOOGLE_PIXEL_9_PRO_XL: "M 8 30 h 55 a 10 10 0 0 1 10 10 v 15 a 10 10 0 0 1 -10 10 h -55 a 10 10 0 0 1 -10 -10 v -15 a 10 10 0 0 1 10 -10 z M 18 38 a 6 6 0 1 0 0 12 a 6 6 0 1 0 0 -12 M 36 38 a 6 6 0 1 0 0 12 a 6 6 0 1 0 0 -12 M 54 38 a 6 6 0 1 0 0 12 a 6 6 0 1 0 0 -12",
  GOOGLE_PIXEL_9_PRO: "M 8 30 h 50 a 10 10 0 0 1 10 10 v 15 a 10 10 0 0 1 -10 10 h -50 a 10 10 0 0 1 -10 -10 v -15 a 10 10 0 0 1 10 -10 z M 16 38 a 6 6 0 1 0 0 12 a 6 6 0 1 0 0 -12 M 34 38 a 6 6 0 1 0 0 12 a 6 6 0 1 0 0 -12 M 52 38 a 6 6 0 1 0 0 12 a 6 6 0 1 0 0 -12",
  GOOGLE_PIXEL_9_FOLD: "M 5 5 h 28 a 6 6 0 0 1 6 6 v 32 a 6 6 0 0 1 -6 6 h -28 a 6 6 0 0 1 -6 -6 v -32 a 6 6 0 0 1 6 -6 z M 12 14 a 5 5 0 1 0 0 10 a 5 5 0 1 0 0 -10 M 12 30 a 5 5 0 1 0 0 10 a 5 5 0 1 0 0 -10 M 26 14 a 5 5 0 1 0 0 10 a 5 5 0 1 0 0 -10 M 26 30 a 5 5 0 1 0 0 10 a 5 5 0 1 0 0 -10 M 37.55 0 h 2 v 155.2 h -2 z",
  
  // Pixel 8/7/6 Series (Visor Bar)
  // Pixel 6: Visor starts approx 20mm from top, height approx 15mm
  GOOGLE_PIXEL_8_PRO: "M -5 22 h 200 v 26 h -200 z M 10 30 h 35 a 5 5 0 0 1 5 5 v 0 a 5 5 0 0 1 -5 5 h -35 a 5 5 0 0 1 -5 -5 v 0 a 5 5 0 0 1 5 -5 z M 55 35 a 5 5 0 1 1 0 10 a 5 5 0 1 1 0 -10 z",
  GOOGLE_PIXEL_8: "M -5 22 h 200 v 26 h -200 z M 10 30 h 30 a 5 5 0 0 1 5 5 v 0 a 5 5 0 0 1 -5 5 h -30 a 5 5 0 0 1 -5 -5 v 0 a 5 5 0 0 1 5 -5 z",
  GOOGLE_PIXEL_6: "M -5 18 h 200 v 30 h -200 z M 14 33 a 6 6 0 1 1 0 12 a 6 6 0 1 1 0 -12 M 30 33 a 6 6 0 1 1 0 12 a 6 6 0 1 1 0 -12",
};

// Re-export as CAMERA_PRESETS for backward compatibility if needed, 
// though we use CAMERA_DUMPS for the database below.
export const CAMERA_PRESETS = CAMERA_DUMPS;

/**
 * ------------------------------------------------------------------
 * PHONE MODEL DATABASE
 * ------------------------------------------------------------------
 * Add new models here. 
 * Ensure widthMm and heightMm are exact dimensions from specs.
 */
export const PHONE_MODELS: PhoneModel[] = [
  // --- APPLE ---
  {
    id: 'iphone-16-pro-max',
    name: 'iPhone 16 Pro Max',
    brand: Brand.APPLE,
    widthMm: 77.6,
    heightMm: 163.0,
    cornerRadiusMm: 12, // Smoother rounded corners
    releaseYear: 2024,
    cameraPath: CAMERA_DUMPS.IPHONE_16_PRO_MAX
  },
  {
    id: 'iphone-16-pro',
    name: 'iPhone 16 Pro',
    brand: Brand.APPLE,
    widthMm: 71.5,
    heightMm: 149.6,
    cornerRadiusMm: 12,
    releaseYear: 2024,
    cameraPath: CAMERA_DUMPS.IPHONE_16_PRO
  },
  {
    id: 'iphone-16-plus',
    name: 'iPhone 16 Plus',
    brand: Brand.APPLE,
    widthMm: 77.8, // Verified 3.06"
    heightMm: 160.9, // Verified 6.33"
    cornerRadiusMm: 13, // Visual estimate from schematic
    releaseYear: 2024,
    cameraPath: CAMERA_DUMPS.IPHONE_16_PLUS
  },
  {
    id: 'iphone-16',
    name: 'iPhone 16',
    brand: Brand.APPLE,
    widthMm: 71.6,
    heightMm: 147.6,
    cornerRadiusMm: 12,
    releaseYear: 2024,
    cameraPath: CAMERA_DUMPS.IPHONE_16
  },
  {
    id: 'iphone-15-pro-max',
    name: 'iPhone 15 Pro Max',
    brand: Brand.APPLE,
    widthMm: 76.7,
    heightMm: 159.9,
    cornerRadiusMm: 12,
    releaseYear: 2023,
    cameraPath: CAMERA_DUMPS.IPHONE_15_PRO_MAX
  },
  {
    id: 'iphone-15-pro',
    name: 'iPhone 15 Pro',
    brand: Brand.APPLE,
    widthMm: 70.6,
    heightMm: 146.6,
    cornerRadiusMm: 12,
    releaseYear: 2023,
    cameraPath: CAMERA_DUMPS.IPHONE_15_PRO
  },
  {
    id: 'iphone-15-plus',
    name: 'iPhone 15 Plus',
    brand: Brand.APPLE,
    widthMm: 77.8,
    heightMm: 160.9,
    cornerRadiusMm: 12,
    releaseYear: 2023,
    cameraPath: CAMERA_DUMPS.IPHONE_15_PLUS
  },
  {
    id: 'iphone-15',
    name: 'iPhone 15',
    brand: Brand.APPLE,
    widthMm: 71.6,
    heightMm: 147.6,
    cornerRadiusMm: 12,
    releaseYear: 2023,
    cameraPath: CAMERA_DUMPS.IPHONE_15
  },
  
  // --- SAMSUNG ---
  {
    id: 's24-ultra',
    name: 'Galaxy S24 Ultra',
    brand: Brand.SAMSUNG,
    widthMm: 79.0,
    heightMm: 162.3,
    cornerRadiusMm: 1.5, // Sharp corners
    releaseYear: 2024,
    cameraPath: CAMERA_DUMPS.SAMSUNG_S24_ULTRA
  },
  {
    id: 's24-plus',
    name: 'Galaxy S24+',
    brand: Brand.SAMSUNG,
    widthMm: 75.9,
    heightMm: 158.5,
    cornerRadiusMm: 7,
    releaseYear: 2024,
    cameraPath: CAMERA_DUMPS.SAMSUNG_S24_PLUS
  },
  {
    id: 's24',
    name: 'Galaxy S24',
    brand: Brand.SAMSUNG,
    widthMm: 70.6,
    heightMm: 147.0,
    cornerRadiusMm: 7,
    releaseYear: 2024,
    cameraPath: CAMERA_DUMPS.SAMSUNG_S24
  },
  {
    id: 'z-fold-6',
    name: 'Galaxy Z Fold6',
    brand: Brand.SAMSUNG,
    widthMm: 68.1,
    heightMm: 153.5,
    cornerRadiusMm: 2,
    releaseYear: 2024,
    cameraPath: CAMERA_DUMPS.SAMSUNG_Z_FOLD_6
  },
  {
    id: 'z-flip-6',
    name: 'Galaxy Z Flip6',
    brand: Brand.SAMSUNG,
    widthMm: 71.9,
    heightMm: 165.1,
    cornerRadiusMm: 5,
    releaseYear: 2024,
    cameraPath: CAMERA_DUMPS.SAMSUNG_Z_FLIP_6
  },

  // --- GOOGLE ---
  {
    id: 'pixel-9-pro-xl',
    name: 'Pixel 9 Pro XL',
    brand: Brand.GOOGLE,
    widthMm: 76.6,
    heightMm: 162.8,
    cornerRadiusMm: 10,
    releaseYear: 2024,
    cameraPath: CAMERA_DUMPS.GOOGLE_PIXEL_9_PRO_XL
  },
  {
    id: 'pixel-9-pro',
    name: 'Pixel 9 Pro',
    brand: Brand.GOOGLE,
    widthMm: 72.0,
    heightMm: 152.8,
    cornerRadiusMm: 10,
    releaseYear: 2024,
    cameraPath: CAMERA_DUMPS.GOOGLE_PIXEL_9_PRO
  },
  {
    id: 'pixel-9',
    name: 'Pixel 9',
    brand: Brand.GOOGLE,
    widthMm: 72.0,
    heightMm: 152.8,
    cornerRadiusMm: 10,
    releaseYear: 2024,
    cameraPath: CAMERA_DUMPS.GOOGLE_PIXEL_9_PRO
  },
  {
    id: 'pixel-9-pro-fold',
    name: 'Pixel 9 Pro Fold',
    brand: Brand.GOOGLE,
    widthMm: 77.1,
    heightMm: 155.2,
    cornerRadiusMm: 9,
    releaseYear: 2024,
    cameraPath: CAMERA_DUMPS.GOOGLE_PIXEL_9_FOLD
  },
  {
    id: 'pixel-8-pro',
    name: 'Pixel 8 Pro',
    brand: Brand.GOOGLE,
    widthMm: 76.5,
    heightMm: 162.6,
    cornerRadiusMm: 10,
    releaseYear: 2023,
    cameraPath: CAMERA_DUMPS.GOOGLE_PIXEL_8_PRO
  },
  {
    id: 'pixel-8',
    name: 'Pixel 8',
    brand: Brand.GOOGLE,
    widthMm: 70.8,
    heightMm: 150.5,
    cornerRadiusMm: 10,
    releaseYear: 2023,
    cameraPath: CAMERA_DUMPS.GOOGLE_PIXEL_8
  },
  {
    id: 'pixel-6',
    name: 'Pixel 6',
    brand: Brand.GOOGLE,
    widthMm: 74.8, // Verified 2.94"
    heightMm: 158.6, // Verified 6.24"
    cornerRadiusMm: 3, 
    releaseYear: 2021,
    cameraPath: CAMERA_DUMPS.GOOGLE_PIXEL_6
  }
];

export const DEFAULT_PATTERNS = [
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=1000&auto=format&fit=crop'
];