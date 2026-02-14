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

There are two ways to add phone specifications:

### 1. Static Addition (Recommended for Common Models)
Edit `constants.ts` to add a new object to the `PHONE_MODELS` array.

```typescript
{
  id: 'new-model-id',
  name: 'New Phone Model',
  brand: Brand.OTHER,
  widthMm: 70.0,
  heightMm: 150.0,
  cornerRadiusMm: 10,
  releaseYear: 2024,
  cameraPath: "SVG PATH DATA HERE" 
}
```

### 2. Camera Styles (For Neural Retrieval)
If the AI detection struggles with a new camera layout style:
1. Open `utils/cameraPatterns.ts`.
2. Add a new prompt description to `CAMERA_STYLES_PROMPT`.
3. Add the corresponding SVG path to `getCameraPathForStyle` function.

```typescript
// utils/cameraPatterns.ts

export const CAMERA_STYLES_PROMPT = `
...
- "new_style_name": Description of the camera layout...
`;

export const getCameraPathForStyle = (style: string): string => {
  const genericPaths = {
    ...
    'new_style_name': "M ... (SVG Path)",
  };
  ...
}
```

## 🔧 Technology Stack

- **React 19**: UI Framework
- **Vite**: Build Tool
- **TailwindCSS**: Styling
- **Google GenAI SDK**: Spec Retrieval & Image Generation
- **jsPDF**: PDF Generation
- **Docker/Nginx**: Deployment
