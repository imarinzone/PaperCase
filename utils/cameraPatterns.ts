// Centralized camera pattern definitions for maintainability
// Add new camera styles here to support new device form factors

export const CAMERA_STYLES_PROMPT = `
- "samsung_vertical_3_detached": 3 individual floating circular lenses vertically stacked on left (e.g. S23, S24, A54)
- "samsung_vertical_2_detached": 2 individual floating circular lenses vertically stacked on left (e.g. Z Flip 4/5, S23/S24 Base)
- "samsung_vertical_3_island": Vertical pill-shaped island on left (e.g. S21, S22)
- "iphone_pro_island": Large squircle top-left (3 lens triangle layout, e.g. iPhone 13/14/15 Pro)
- "iphone_base_island": Smaller squircle top-left (2 lens diagonal, e.g. iPhone 13/14/15)
- "pixel_visor": Horizontal bar across the entire back (e.g. Pixel 6/7/8)
- "center_circle": Large circular module in top center (e.g. OnePlus 11, Xiaomi 13 Ultra)
- "vertical_pill_left": Generic vertical pill on top left (older phones)
`;

// Helper to map AI-detected camera styles to SVG paths
// Dimensions are in millimeters to match the viewbox coordinate system
export const getCameraPathForStyle = (style: string): string => {
  const genericPaths: Record<string, string> = {
    // iPhone Pro models (Large Squircle Island top-left)
    'iphone_pro_island': "M 8 8 h 32 a 10 10 0 0 1 10 10 v 32 a 10 10 0 0 1 -10 10 h -32 a 10 10 0 0 1 -10 -10 v -32 a 10 10 0 0 1 10 -10 z",
    
    // iPhone Base models (Smaller Squircle top-left + Diagonal Lenses)
    'iphone_base_island': `
      M 13 6 h 14 a 8 8 0 0 1 8 8 v 14 a 8 8 0 0 1 -8 8 h -14 a 8 8 0 0 1 -8 -8 v -14 a 8 8 0 0 1 8 -8 z
      M 15 10 a 5.5 5.5 0 1 0 0 11 a 5.5 5.5 0 1 0 0 -11
      M 25 21 a 5.5 5.5 0 1 0 0 11 a 5.5 5.5 0 1 0 0 -11
    `,

    // Samsung S23/S24/A54 (3 Detached Vertical Circles "Floating" style)
    // Coordinates approx: Left offset 12mm, Radius 5mm, Spacing ~17mm
    'samsung_vertical_3_detached': `
      M 15 15 m -5 0 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0 
      M 15 32 m -5 0 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0 
      M 15 49 m -5 0 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0 
    `,

    // Samsung Z Flip / Base Models (2 Detached Vertical Circles)
    'samsung_vertical_2_detached': `
      M 15 15 m -5 0 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0 
      M 15 32 m -5 0 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0 
    `,

    // Samsung S21/S22 (Vertical Pill merged or island)
    'samsung_vertical_3_island': "M 8 8 h 22 a 5 5 0 0 1 5 5 v 45 a 5 5 0 0 1 -5 5 h -22 a 5 5 0 0 1 -5 -5 v -45 a 5 5 0 0 1 5 -5 z",

    // Pixel 6/7/8 (Visor Bar across width)
    // Uses a large width to ensure it covers the phone body when clipped
    'pixel_visor': "M -5 22 h 200 v 28 h -200 z M 12 30 h 30 a 5 5 0 0 1 5 5 v 0 a 5 5 0 0 1 -5 5 h -30 a 5 5 0 0 1 -5 -5 v 0 a 5 5 0 0 1 5 -5 z M 55 37 a 5 5 0 1 1 0 10 a 5 5 0 1 1 0 -10 z",

    // Large Center Circle (OnePlus 11, Xiaomi Ultra)
    'center_circle': "M 38 25 m -20 0 a 20 20 0 1 0 40 0 a 20 20 0 1 0 -40 0",

    // Generic Vertical Pill (Fallback)
    'vertical_pill_left': "M 10 10 h 20 a 5 5 0 0 1 5 5 v 40 a 5 5 0 0 1 -5 5 h -20 a 5 5 0 0 1 -5 -5 v -40 a 5 5 0 0 1 5 -5 z",
  };
  return genericPaths[style] || genericPaths['vertical_pill_left'];
};