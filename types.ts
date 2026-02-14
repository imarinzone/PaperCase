
export enum Brand {
  APPLE = 'Apple',
  SAMSUNG = 'Samsung',
  GOOGLE = 'Google'
}

export interface CameraCutout {
  type: 'path' | 'circle' | 'rect';
  data: string; // SVG Path data or coordinate string
}

export interface DeviceSpecs {
  device_model: string;
  units: string;
  dimensions_outer: {
    height: number;
    width: number;
    depth: number;
    weight_grams: number;
  };
  chassis: {
    material: string;
    corner_radius_mm: number;
    corner_type: string;
    bezel_thickness_approx: number;
  };
  screen: {
    diagonal_inch: number;
    diagonal_mm: number;
    width_mm: number;
    height_mm: number;
    resolution_px: {
      width: number;
      height: number;
    };
    pixel_density_ppi: number;
    refresh_rate_hz: number;
    features: string[];
    dynamic_island: {
      width_approx: number;
      height_approx: number;
      position_from_top: number;
    };
  };
  camera_module_rear: {
    type: string;
    island_dimensions: {
      width: number;
      height: number;
      protrusion_depth: number;
      corner_radius: number;
      position_from_left_edge: number;
      position_from_top_edge: number;
    };
    lenses: Array<{
      name: string;
      position: string;
      diameter_ring: number;
      diameter_glass: number;
      protrusion_from_island: number;
      focal_length_equiv: string;
    }>;
    flash: {
      position: string;
      diameter: number;
    };
    mic: {
      position: string;
      diameter: number;
    };
  };
  buttons_and_ports: {
    left_side: Array<{
      name: string;
      type: string;
      height: number;
      width: number;
      distance_from_top: number;
    }>;
    right_side: Array<{
      name: string;
      type: string;
      height: number;
      width: number;
      distance_from_top: number;
    }>;
    bottom: Array<{
      name: string;
      width?: number;
      height?: number;
      count?: string;
      drill_holes?: string;
    }>;
  };
}

export interface PhoneModel {
  id: string;
  name: string;
  brand: Brand;
  widthMm: number;
  heightMm: number;
  cornerRadiusMm: number;
  // Simplified camera representation for the demo
  // In a real app, this would be complex SVG paths
  cameraPath: string; 
  releaseYear: number;
  specs?: DeviceSpecs;
}

export interface TextLayer {
  id: string;
  text: string;
  fontFamily: string;
  color: string;
  fontSize: number; // percentage of phone width
  x: number; // percentage X (0-100)
  y: number; // percentage Y (0-100)
  rotation: number;
}

export interface EditState {
  scale: number;
  translateX: number;
  translateY: number;
  rotation: number;
  // Image Adjustments
  brightness: number; // 100 default
  contrast: number;   // 100 default
  saturation: number; // 100 default
  grayscale: number;  // 0 default
  blur: number;       // 0 default
  // Transforms
  flipX: boolean;
  flipY: boolean;
  // Text
  textLayers: TextLayer[];
}
