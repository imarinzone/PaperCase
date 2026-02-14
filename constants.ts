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

// REUSABLE CAMERA PATHS
const CAM_IPHONE_PRO = "M 12 12 h 28 a 8 8 0 0 1 8 8 v 28 a 8 8 0 0 1 -8 8 h -28 a 8 8 0 0 1 -8 -8 v -28 a 8 8 0 0 1 8 -8 z";
const CAM_IPHONE_BASE_DIAGONAL = `
  M 11.5 3.5 h 13.5 a 8 8 0 0 1 8 8 v 13.5 a 8 8 0 0 1 -8 8 h -13.5 a 8 8 0 0 1 -8 -8 v -13.5 a 8 8 0 0 1 8 -8 z
  M 10.9 10.9 m -2.75 0 a 2.75 2.75 0 1 0 5.5 0 a 2.75 2.75 0 1 0 -5.5 0
  M 25.6 10.9 m -7.25 0 a 7.25 7.25 0 1 0 14.5 0 a 7.25 7.25 0 1 0 -14.5 0
  M 10.9 25.6 m -7.75 0 a 7.75 7.75 0 1 0 15.5 0 a 7.75 7.75 0 1 0 -15.5 0
  M 25.6 25.6 m -0.5 0 a 0.5 0.5 0 1 0 1 0 a 0.5 0.5 0 1 0 -1 0
`;
// New iPhone 16 vertical pill style
const CAM_IPHONE_16_VERTICAL = "M 10 10 h 14 a 7 7 0 0 1 7 7 v 24 a 7 7 0 0 1 -7 7 h -14 a 7 7 0 0 1 -7 -7 v -24 a 7 7 0 0 1 7 -7 z M 17 16 a 4 4 0 1 0 0 8 a 4 4 0 1 0 0 -8 M 17 32 a 4 4 0 1 0 0 8 a 4 4 0 1 0 0 -8";

const CAM_SAMSUNG_ULTRA = `
  M 12 15 a 4 4 0 1 0 8 0 a 4 4 0 1 0 -8 0 
  M 12 30 a 4 4 0 1 0 8 0 a 4 4 0 1 0 -8 0 
  M 12 45 a 4 4 0 1 0 8 0 a 4 4 0 1 0 -8 0 
  M 28 15 a 3 3 0 1 0 6 0 a 3 3 0 1 0 -6 0
  M 28 30 a 3 3 0 1 0 6 0 a 3 3 0 1 0 -6 0
`;
const CAM_SAMSUNG_VERTICAL_3 = `
  M 10 12 a 3.5 3.5 0 1 0 7 0 a 3.5 3.5 0 1 0 -7 0 
  M 10 26 a 3.5 3.5 0 1 0 7 0 a 3.5 3.5 0 1 0 -7 0 
  M 10 40 a 3.5 3.5 0 1 0 7 0 a 3.5 3.5 0 1 0 -7 0 
`;

const CAM_PIXEL_VISOR = "M 0 25 h 100% v 24 h -100% z M 10 32 h 35 a 5 5 0 0 1 5 5 v 0 a 5 5 0 0 1 -5 5 h -35 a 5 5 0 0 1 -5 -5 v 0 a 5 5 0 0 1 5 -5 z M 55 37 a 5 5 0 1 1 0 10 a 5 5 0 1 1 0 -10 z";
// Pixel 9 Floating Bar
const CAM_PIXEL_9_ISLAND = "M 8 30 h 55 a 10 10 0 0 1 10 10 v 15 a 10 10 0 0 1 -10 10 h -55 a 10 10 0 0 1 -10 -10 v -15 a 10 10 0 0 1 10 -10 z M 18 38 a 6 6 0 1 0 0 12 a 6 6 0 1 0 0 -12 M 36 38 a 6 6 0 1 0 0 12 a 6 6 0 1 0 0 -12 M 54 38 a 6 6 0 1 0 0 12 a 6 6 0 1 0 0 -12";

// Pixel 9 Pro Fold Square Island
const CAM_PIXEL_9_FOLD = "M 5 5 h 28 a 6 6 0 0 1 6 6 v 32 a 6 6 0 0 1 -6 6 h -28 a 6 6 0 0 1 -6 -6 v -32 a 6 6 0 0 1 6 -6 z M 12 14 a 5 5 0 1 0 0 10 a 5 5 0 1 0 0 -10 M 12 30 a 5 5 0 1 0 0 10 a 5 5 0 1 0 0 -10 M 26 14 a 5 5 0 1 0 0 10 a 5 5 0 1 0 0 -10 M 26 30 a 5 5 0 1 0 0 10 a 5 5 0 1 0 0 -10";

export const PHONE_MODELS: PhoneModel[] = [
  // --- APPLE ---
  
  // iPhone 16 Series
  {
    id: 'iphone-16-pro-max',
    name: 'iPhone 16 Pro Max',
    brand: Brand.APPLE,
    widthMm: 77.6,
    heightMm: 163.0,
    cornerRadiusMm: 8.5,
    releaseYear: 2024,
    cameraPath: CAM_IPHONE_PRO
  },
  {
    id: 'iphone-16-pro',
    name: 'iPhone 16 Pro',
    brand: Brand.APPLE,
    widthMm: 71.5,
    heightMm: 149.6,
    cornerRadiusMm: 8.5,
    releaseYear: 2024,
    cameraPath: CAM_IPHONE_PRO
  },
  {
    id: 'iphone-16-plus',
    name: 'iPhone 16 Plus',
    brand: Brand.APPLE,
    widthMm: 77.8,
    heightMm: 160.9,
    cornerRadiusMm: 8.5,
    releaseYear: 2024,
    cameraPath: CAM_IPHONE_16_VERTICAL
  },
  {
    id: 'iphone-16',
    name: 'iPhone 16',
    brand: Brand.APPLE,
    widthMm: 71.6,
    heightMm: 147.6,
    cornerRadiusMm: 8.5,
    releaseYear: 2024,
    cameraPath: CAM_IPHONE_16_VERTICAL
  },

  // iPhone 15 Series
  {
    id: 'iphone-15-pro-max',
    name: 'iPhone 15 Pro Max',
    brand: Brand.APPLE,
    widthMm: 76.7,
    heightMm: 159.9,
    cornerRadiusMm: 8.5,
    releaseYear: 2023,
    cameraPath: CAM_IPHONE_PRO
  },
  {
    id: 'iphone-15-pro',
    name: 'iPhone 15 Pro',
    brand: Brand.APPLE,
    widthMm: 70.6,
    heightMm: 146.6,
    cornerRadiusMm: 8.5,
    releaseYear: 2023,
    cameraPath: CAM_IPHONE_PRO
  },
  {
    id: 'iphone-15-plus',
    name: 'iPhone 15 Plus',
    brand: Brand.APPLE,
    widthMm: 77.8,
    heightMm: 160.9,
    cornerRadiusMm: 8.5,
    releaseYear: 2023,
    cameraPath: CAM_IPHONE_BASE_DIAGONAL
  },
  {
    id: 'iphone-15',
    name: 'iPhone 15',
    brand: Brand.APPLE,
    widthMm: 71.6,
    heightMm: 147.6,
    cornerRadiusMm: 8.5,
    releaseYear: 2023,
    specs: {
      device_model: "iPhone 15 (17th Gen)",
      units: "millimeters",
      dimensions_outer: { height: 147.6, width: 71.6, depth: 7.8, weight_grams: 171 },
      chassis: { material: "Aluminum", corner_radius_mm: 8.5, corner_type: "continuous_curvature_squircle", bezel_thickness_approx: 2.2 },
      screen: { diagonal_inch: 6.1, diagonal_mm: 155, width_mm: 64.5, height_mm: 139.8, resolution_px: { width: 1179, height: 2556 }, pixel_density_ppi: 460, refresh_rate_hz: 60, features: ["Dynamic Island"], dynamic_island: { width_approx: 20.0, height_approx: 5.5, position_from_top: 7.5 } },
      camera_module_rear: { type: "Dual Lens Diagonal", island_dimensions: { width: 29.5, height: 29.5, protrusion_depth: 2.6, corner_radius: 8.0, position_from_left_edge: 3.5, position_from_top_edge: 3.5 }, lenses: [], flash: { position: "Top-Left", diameter: 5.5 }, mic: { position: "Bottom-Right", diameter: 1.0 } },
      buttons_and_ports: { left_side: [], right_side: [], bottom: [] }
    },
    cameraPath: CAM_IPHONE_BASE_DIAGONAL
  },

  // iPhone 14 Series
  {
    id: 'iphone-14-pro-max',
    name: 'iPhone 14 Pro Max',
    brand: Brand.APPLE,
    widthMm: 77.6,
    heightMm: 160.7,
    cornerRadiusMm: 8.5,
    releaseYear: 2022,
    cameraPath: CAM_IPHONE_PRO
  },
  {
    id: 'iphone-14-pro',
    name: 'iPhone 14 Pro',
    brand: Brand.APPLE,
    widthMm: 71.5,
    heightMm: 147.5,
    cornerRadiusMm: 8.5,
    releaseYear: 2022,
    cameraPath: CAM_IPHONE_PRO
  },
  {
    id: 'iphone-14-plus',
    name: 'iPhone 14 Plus',
    brand: Brand.APPLE,
    widthMm: 78.1,
    heightMm: 160.8,
    cornerRadiusMm: 8.5,
    releaseYear: 2022,
    cameraPath: CAM_IPHONE_BASE_DIAGONAL
  },
  {
    id: 'iphone-14',
    name: 'iPhone 14',
    brand: Brand.APPLE,
    widthMm: 71.5,
    heightMm: 146.7,
    cornerRadiusMm: 8.5,
    releaseYear: 2022,
    cameraPath: CAM_IPHONE_BASE_DIAGONAL
  },

  // iPhone 13 Series
  {
    id: 'iphone-13-pro-max',
    name: 'iPhone 13 Pro Max',
    brand: Brand.APPLE,
    widthMm: 78.1,
    heightMm: 160.8,
    cornerRadiusMm: 8.5,
    releaseYear: 2021,
    cameraPath: CAM_IPHONE_PRO
  },
  {
    id: 'iphone-13',
    name: 'iPhone 13',
    brand: Brand.APPLE,
    widthMm: 71.5,
    heightMm: 146.7,
    cornerRadiusMm: 8.5,
    releaseYear: 2021,
    cameraPath: CAM_IPHONE_BASE_DIAGONAL
  },

  // --- SAMSUNG ---
  
  // Z Fold Series (Folded Back Panel + Vertical Center Cut)
  {
    id: 'z-fold-6',
    name: 'Galaxy Z Fold6',
    brand: Brand.SAMSUNG,
    widthMm: 68.1,
    heightMm: 153.5,
    cornerRadiusMm: 2,
    releaseYear: 2024,
    cameraPath: `
      M 12 12 a 3.5 3.5 0 1 0 7 0 a 3.5 3.5 0 1 0 -7 0 
      M 12 26 a 3.5 3.5 0 1 0 7 0 a 3.5 3.5 0 1 0 -7 0 
      M 12 40 a 3.5 3.5 0 1 0 7 0 a 3.5 3.5 0 1 0 -7 0 
      M 33.05 0 h 2 v 153.5 h -2 z
    `
  },
  {
    id: 'z-fold-5',
    name: 'Galaxy Z Fold5',
    brand: Brand.SAMSUNG,
    widthMm: 67.1,
    heightMm: 154.9,
    cornerRadiusMm: 3,
    releaseYear: 2023,
    // Pill Island + Vertical Cut
    cameraPath: `
      M 10 10 h 12 a 6 6 0 0 1 6 6 v 30 a 6 6 0 0 1 -6 6 h -12 a 6 6 0 0 1 -6 -6 v -30 a 6 6 0 0 1 6 -6 z 
      M 16 16 a 3 3 0 1 0 0 6 a 3 3 0 1 0 0 -6 M 16 29 a 3 3 0 1 0 0 6 a 3 3 0 1 0 0 -6 M 16 42 a 3 3 0 1 0 0 6 a 3 3 0 1 0 0 -6
      M 32.55 0 h 2 v 154.9 h -2 z
    `
  },

  // Z Flip Series (Unfolded Back Panel + Horizontal Center Cut)
  {
    id: 'z-flip-6',
    name: 'Galaxy Z Flip6',
    brand: Brand.SAMSUNG,
    widthMm: 71.9,
    heightMm: 165.1,
    cornerRadiusMm: 5,
    releaseYear: 2024,
    cameraPath: `M 5 5 h 60 v 35 h -60 z M 10 12 a 6 6 0 1 0 12 0 a 6 6 0 1 0 -12 0 M 30 12 a 6 6 0 1 0 12 0 a 6 6 0 1 0 -12 0 
                 M 0 81.5 h 71.9 v 2 h -71.9 z`
  },
  {
    id: 'z-flip-5',
    name: 'Galaxy Z Flip5',
    brand: Brand.SAMSUNG,
    widthMm: 71.9,
    heightMm: 165.1,
    cornerRadiusMm: 5,
    releaseYear: 2023,
    cameraPath: `M 5 5 h 60 v 35 h -60 z M 10 12 a 6 6 0 1 0 12 0 a 6 6 0 1 0 -12 0 M 30 12 a 6 6 0 1 0 12 0 a 6 6 0 1 0 -12 0 
                 M 0 81.5 h 71.9 v 2 h -71.9 z`
  },
  {
    id: 'z-flip-4',
    name: 'Galaxy Z Flip4',
    brand: Brand.SAMSUNG,
    widthMm: 71.9,
    heightMm: 165.2,
    cornerRadiusMm: 5,
    releaseYear: 2022,
    cameraPath: `
      M 15 15 m -5 0 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0 
      M 15 32 m -5 0 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0 
      M 0 81.6 h 71.9 v 2 h -71.9 z
    `
  },

  // S24 Series
  {
    id: 's24-ultra',
    name: 'Galaxy S24 Ultra',
    brand: Brand.SAMSUNG,
    widthMm: 79.0,
    heightMm: 162.3,
    cornerRadiusMm: 1.5,
    releaseYear: 2024,
    cameraPath: CAM_SAMSUNG_ULTRA
  },
  {
    id: 's24-plus',
    name: 'Galaxy S24+',
    brand: Brand.SAMSUNG,
    widthMm: 75.9,
    heightMm: 158.5,
    cornerRadiusMm: 6,
    releaseYear: 2024,
    cameraPath: CAM_SAMSUNG_VERTICAL_3
  },
  {
    id: 's24',
    name: 'Galaxy S24',
    brand: Brand.SAMSUNG,
    widthMm: 70.6,
    heightMm: 147.0,
    cornerRadiusMm: 6,
    releaseYear: 2024,
    cameraPath: CAM_SAMSUNG_VERTICAL_3
  },

  // S23 Series
  {
    id: 's23-ultra',
    name: 'Galaxy S23 Ultra',
    brand: Brand.SAMSUNG,
    widthMm: 78.1,
    heightMm: 163.4,
    cornerRadiusMm: 2,
    releaseYear: 2023,
    cameraPath: CAM_SAMSUNG_ULTRA
  },
  {
    id: 's23-plus',
    name: 'Galaxy S23+',
    brand: Brand.SAMSUNG,
    widthMm: 76.2,
    heightMm: 157.8,
    cornerRadiusMm: 6,
    releaseYear: 2023,
    cameraPath: CAM_SAMSUNG_VERTICAL_3
  },
  {
    id: 's23',
    name: 'Galaxy S23',
    brand: Brand.SAMSUNG,
    widthMm: 70.9,
    heightMm: 146.3,
    cornerRadiusMm: 6,
    releaseYear: 2023,
    cameraPath: CAM_SAMSUNG_VERTICAL_3
  },


  // --- GOOGLE ---
  
  // Pixel Fold Series (Vertical Cut for Book Fold)
  {
    id: 'pixel-9-pro-fold',
    name: 'Pixel 9 Pro Fold',
    brand: Brand.GOOGLE,
    widthMm: 77.1,
    heightMm: 155.2,
    cornerRadiusMm: 8,
    releaseYear: 2024,
    cameraPath: CAM_PIXEL_9_FOLD + " M 37.55 0 h 2 v 155.2 h -2 z"
  },
  {
    id: 'pixel-fold',
    name: 'Pixel Fold',
    brand: Brand.GOOGLE,
    widthMm: 79.5,
    heightMm: 139.7,
    cornerRadiusMm: 5,
    releaseYear: 2023,
    // Floating bar + Vertical Cut
    cameraPath: "M 20 15 h 40 a 5 5 0 0 1 5 5 v 10 a 5 5 0 0 1 -5 5 h -40 a 5 5 0 0 1 -5 -5 v -10 a 5 5 0 0 1 5 -5 z M 25 25 a 3 3 0 1 0 0 1 a 3 3 0 1 0 0 -1 M 35 25 a 3 3 0 1 0 0 1 a 3 3 0 1 0 0 -1 M 38.75 0 h 2 v 139.7 h -2 z"
  },

  // Pixel 9 Series
  {
    id: 'pixel-9-pro-xl',
    name: 'Pixel 9 Pro XL',
    brand: Brand.GOOGLE,
    widthMm: 76.6,
    heightMm: 162.8,
    cornerRadiusMm: 8.5,
    releaseYear: 2024,
    cameraPath: CAM_PIXEL_9_ISLAND
  },
  {
    id: 'pixel-9-pro',
    name: 'Pixel 9 Pro',
    brand: Brand.GOOGLE,
    widthMm: 72.0,
    heightMm: 152.8,
    cornerRadiusMm: 8.5,
    releaseYear: 2024,
    cameraPath: CAM_PIXEL_9_ISLAND
  },
  {
    id: 'pixel-9',
    name: 'Pixel 9',
    brand: Brand.GOOGLE,
    widthMm: 72.0,
    heightMm: 152.8,
    cornerRadiusMm: 8.5,
    releaseYear: 2024,
    cameraPath: CAM_PIXEL_9_ISLAND
  },

  // Pixel 8 Series
  {
    id: 'pixel-8-pro',
    name: 'Pixel 8 Pro',
    brand: Brand.GOOGLE,
    widthMm: 76.5,
    heightMm: 162.6,
    cornerRadiusMm: 9,
    releaseYear: 2023,
    cameraPath: CAM_PIXEL_VISOR
  },
  {
    id: 'pixel-8',
    name: 'Pixel 8',
    brand: Brand.GOOGLE,
    widthMm: 70.8,
    heightMm: 150.5,
    cornerRadiusMm: 9,
    releaseYear: 2023,
    cameraPath: CAM_PIXEL_VISOR
  },

  // Pixel 7 Series
  {
    id: 'pixel-7-pro',
    name: 'Pixel 7 Pro',
    brand: Brand.GOOGLE,
    widthMm: 76.6,
    heightMm: 162.9,
    cornerRadiusMm: 6,
    releaseYear: 2022,
    cameraPath: CAM_PIXEL_VISOR
  },
  {
    id: 'pixel-7',
    name: 'Pixel 7',
    brand: Brand.GOOGLE,
    widthMm: 73.2,
    heightMm: 155.6,
    cornerRadiusMm: 6,
    releaseYear: 2022,
    cameraPath: CAM_PIXEL_VISOR
  }
];

export const DEFAULT_PATTERNS = [
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=1000&auto=format&fit=crop'
];