# SkinForge - Device Skin Generator

A premium web application for designing and printing custom smartphone back-cover skins.

## 🚀 Features

- **Neural Spec Retrieval**: Uses Google Gemini to fetch dimensions for any phone model via Google Search grounding.
- **Accurate Cutouts**: Supports various camera module styles (Detached S23/S24, iPhone Islands, Pixel Visors).
- **Print Ready**: Generates A4 PDF templates at 300 DPI with accurate millimeter sizing.
- **Customizer**: Upload images, add text, adjust filters, and transform layers.

## 🛠️ Development

### Prerequisites
- Node.js 18+
- API Key for Google Gemini (`@google/genai`)

### Installation

1. Clone the repo.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start dev server:
   ```bash
   # Make sure to set your API Key in your environment or .env file
   export API_KEY="your_google_ai_key"
   npm run dev
   ```

## 📦 Production Deployment

The project includes a multi-stage Dockerfile for production.

### Using Docker

1. **Build the image**:
   ```bash
   docker build -t skinforge .
   ```

2. **Run the container**:
   ```bash
   docker run -p 8080:80 -e API_KEY="your_api_key" skinforge
   ```
   Access at `http://localhost:8080`.

## 📱 Adding New Phone Specs

We use a standardized format to ensure print accuracy. To add a new device:

### 1. Locate the Database
Open `constants.ts` and scroll to the `PHONE_MODELS` array.

### 2. Add Your Model
Insert a new object following this strict schema:

```typescript
{
  id: 'kebab-case-model-name',
  name: 'Display Name',
  brand: Brand.BRAND_NAME, // Import Brand from ./types
  widthMm: 70.0,           // Exact width in millimeters
  heightMm: 150.0,         // Exact height in millimeters
  cornerRadiusMm: 6,       // Corner radius (approx: 1.5 for boxy, 8.5 for round)
  releaseYear: 2024,
  cameraPath: CAMERA_PRESETS.YOUR_CHOSEN_PRESET
}
```

### 3. Choosing a Camera Path
We provide pre-made SVG paths for common camera layouts in `constants.ts` under `CAMERA_PRESETS`.

**Available Presets:**
- `IPHONE_PRO_ISLAND` (Triple lens triangle)
- `IPHONE_BASE_DIAGONAL` (Dual lens diagonal)
- `IPHONE_16_VERTICAL` (Vertical pill)
- `SAMSUNG_ULTRA_ISLAND` (Floating detached lenses - 5 circles)
- `SAMSUNG_VERTICAL_3_CIRCLE` (Floating detached lenses - 3 circles)
- `PIXEL_VISOR_BAR` (Full width bar)
- `PIXEL_9_ISLAND` (Floating pill island)

**Need a custom camera shape?**
If a phone has a unique camera shape not listed above:
1. Create an SVG path string (`M ... z`). Coordinates are in millimeters relative to the top-left of the phone.
2. Add it to `CAMERA_PRESETS` in `constants.ts` first.
3. Reference it in your model object.

## 🔧 Technology Stack

- **React 19**: UI Framework
- **Vite**: Build Tool
- **TailwindCSS**: Styling
- **Google GenAI SDK**: Spec Retrieval & Image Generation
- **jsPDF**: PDF Generation
- **Docker/Nginx**: Deployment