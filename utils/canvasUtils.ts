import { EditState, PhoneModel } from '../types';
import { PX_PER_MM } from '../constants';
import { jsPDF } from 'jspdf';

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

export const generatePrintableImage = (
  model: PhoneModel,
  imageUrl: string,
  editState: EditState
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;

    img.onload = () => {
      if (!ctx) return reject('No context');

      // 1. Setup Canvas Dimensions (A4 at 450 DPI)
      canvas.width = A4_WIDTH_MM * PX_PER_MM;
      canvas.height = A4_HEIGHT_MM * PX_PER_MM;

      // Enable High Quality Smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Fill Background White (Paper Color)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Calculations for centering the phone on the A4 page
      const phoneW = model.widthMm * PX_PER_MM;
      const phoneH = model.heightMm * PX_PER_MM;
      const skinX = (canvas.width - phoneW) / 2;
      const skinY = (canvas.height - phoneH) / 2;
      const radius = model.cornerRadiusMm * PX_PER_MM;
      
      // Bleed settings (3mm)
      const bleedMm = 3;
      const bleedPx = bleedMm * PX_PER_MM;

      // ----------------------------------------------------------
      // 2. Draw the Phone Skin (With Bleed)
      // ----------------------------------------------------------
      
      // Save state for clipping
      ctx.save();
      ctx.translate(skinX, skinY);

      // Create Mask (Phone Shape + Bleed)
      ctx.beginPath();
      if (ctx.roundRect) {
        // Expand rect by bleed in all directions
        ctx.roundRect(-bleedPx, -bleedPx, phoneW + (2 * bleedPx), phoneH + (2 * bleedPx), radius + bleedPx);
      } else {
        ctx.rect(-bleedPx, -bleedPx, phoneW + (2 * bleedPx), phoneH + (2 * bleedPx));
      }
      ctx.clip(); 

      // Draw User Image
      // CSS width is set to `${editState.scale * 100}%` of the container.
      const drawWidth = phoneW * editState.scale;
      const imgAspect = img.width / img.height;
      const drawHeight = drawWidth / imgAspect;

      const centerX = phoneW / 2;
      const centerY = phoneH / 2;
      
      // Calculate offset based on drawWidth/drawHeight.
      const offsetX = (editState.translateX / 100) * drawWidth;
      const offsetY = (editState.translateY / 100) * drawHeight;

      ctx.save(); // Save before transform for image
      ctx.translate(centerX + offsetX, centerY + offsetY);
      ctx.rotate((editState.rotation * Math.PI) / 180);
      
      // Apply Flip
      const scaleX = editState.flipX ? -1 : 1;
      const scaleY = editState.flipY ? -1 : 1;
      ctx.scale(scaleX, scaleY);

      // Apply Filters
      ctx.filter = `brightness(${editState.brightness}%) contrast(${editState.contrast}%) saturate(${editState.saturation}%) grayscale(${editState.grayscale}%) blur(${editState.blur * (PX_PER_MM/4)}px)`; 
      
      ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
      ctx.restore(); // Restore after image draw, but keep clip

      // ----------------------------------------------------------
      // 2.5 Draw Text Layers
      // ----------------------------------------------------------
      if (editState.textLayers && editState.textLayers.length > 0) {
        editState.textLayers.forEach(layer => {
          ctx.save();
          // Position relative to phone bounding box
          const x = (layer.x / 100) * phoneW;
          const y = (layer.y / 100) * phoneH;
          
          ctx.translate(x, y);
          ctx.rotate((layer.rotation * Math.PI) / 180);
          
          // Calculate font size relative to phone width (mm -> px)
          const fontSizePx = (layer.fontSize / 100) * phoneW;
          
          ctx.font = `${fontSizePx}px ${layer.fontFamily}`;
          ctx.fillStyle = layer.color;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(layer.text, 0, 0);
          
          ctx.restore();
        });
      }

      ctx.restore(); // Restore clip (End of image drawing)

      // ----------------------------------------------------------
      // 4. Draw Cutting Guides (High Contrast)
      // ----------------------------------------------------------
      ctx.save();
      ctx.translate(skinX, skinY);
      
      // Define styles for high visibility (Double stroke: White glow + Black line)
      const drawCutPath = (path: Path2D | null, isRect: boolean = false) => {
        // Outer Glow (White)
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.setLineDash([10, 5]);
        if (isRect) {
           ctx.beginPath();
           if (ctx.roundRect) ctx.roundRect(0, 0, phoneW, phoneH, radius);
           else ctx.rect(0, 0, phoneW, phoneH);
           ctx.stroke();
        } else if (path) {
           ctx.stroke(path);
        }

        // Inner Line (Black)
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#000000';
        ctx.setLineDash([10, 5]);
        if (isRect) {
           ctx.beginPath();
           if (ctx.roundRect) ctx.roundRect(0, 0, phoneW, phoneH, radius);
           else ctx.rect(0, 0, phoneW, phoneH);
           ctx.stroke();
        } else if (path) {
           ctx.stroke(path);
        }
      };

      // Outer Border
      drawCutPath(null, true);
      
      // Camera Border
      ctx.scale(PX_PER_MM, PX_PER_MM);
      
      const cameraPath = new Path2D(model.cameraPath);
      
      // White Glow
      ctx.lineWidth = 4 / PX_PER_MM;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.setLineDash([5, 3]); // Tighter dash
      ctx.stroke(cameraPath);

      // Black Line
      ctx.lineWidth = 2 / PX_PER_MM;
      ctx.strokeStyle = '#000000';
      ctx.setLineDash([5, 3]);
      ctx.stroke(cameraPath);

      ctx.restore();

      // ----------------------------------------------------------
      // 5. Page Layout & Info
      // ----------------------------------------------------------
      ctx.fillStyle = '#111827'; // Dark gray text
      const marginPx = 20 * PX_PER_MM;
      
      // Title
      ctx.font = `bold ${16 * PX_PER_MM / 2.54}px sans-serif`;
      ctx.fillText("SkinForge Template", marginPx, marginPx);
      
      // Subtitle / Instructions
      ctx.font = `${10 * PX_PER_MM / 2.54}px sans-serif`;
      let textY = marginPx + (30 * PX_PER_MM / 2.54);
      ctx.fillText(`Device: ${model.name}`, marginPx, textY);
      
      textY += (20 * PX_PER_MM / 2.54);
      ctx.fillStyle = '#dc2626'; // Red warning
      ctx.font = `bold ${11 * PX_PER_MM / 2.54}px sans-serif`;
      ctx.fillText("IMPORTANT: PRINT AT 100% SCALE (DO NOT 'FIT TO PAGE')", marginPx, textY);
      
      textY += (20 * PX_PER_MM / 2.54);
      ctx.fillStyle = '#4b5563';
      ctx.font = `${9 * PX_PER_MM / 2.54}px sans-serif`;
      ctx.fillText("Ensure page size is set to A4 in printer settings.", marginPx, textY);
      
      // Legend
      textY += (25 * PX_PER_MM / 2.54);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(marginPx, textY - 4 * PX_PER_MM / 2.54); 
      ctx.lineTo(marginPx + (30 * PX_PER_MM), textY - 4 * PX_PER_MM / 2.54);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 5]);
      ctx.stroke();
      ctx.restore();
      
      ctx.fillStyle = '#000000';
      ctx.fillText("Cut Line (Image bleeds 3mm outside)", marginPx + (35 * PX_PER_MM), textY);


      // ----------------------------------------------------------
      // 6. Accurate Scale Ruler
      // ----------------------------------------------------------
      // 10cm Ruler
      const rulerY = canvas.height - marginPx - (20 * PX_PER_MM);
      const rulerX = marginPx;
      const rulerLenMm = 100; // 10cm
      const rulerLenPx = rulerLenMm * PX_PER_MM;
      
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.setLineDash([]); // Reset dash
      ctx.beginPath();
      ctx.moveTo(rulerX, rulerY);
      ctx.lineTo(rulerX + rulerLenPx, rulerY);
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.font = `${8 * PX_PER_MM / 2.54}px sans-serif`;
      
      for(let i=0; i<=10; i++) {
        const x = rulerX + (i * 10 * PX_PER_MM);
        const h = i % 5 === 0 ? (8 * PX_PER_MM) : (4 * PX_PER_MM); // Tick height
        ctx.fillRect(x, rulerY, 2, h); // Draw tick
        
        if (i % 5 === 0) {
          ctx.fillText(`${i}cm`, x - (5 * PX_PER_MM), rulerY + h + (10 * PX_PER_MM));
        }
      }
      
      ctx.fillText("SCALE CHECK (10cm)", rulerX + rulerLenPx + (10 * PX_PER_MM), rulerY + (5 * PX_PER_MM));

      // Branding watermark bottom right
      ctx.textAlign = 'right';
      ctx.fillStyle = '#e5e7eb';
      ctx.font = `bold ${32 * PX_PER_MM / 2.54}px sans-serif`;
      ctx.fillText("SkinForge", canvas.width - marginPx, canvas.height - marginPx);

      // Return Data URL
      resolve(canvas.toDataURL('image/png', 1.0));
    };
    
    img.onerror = (e) => reject(e);
  });
};

export const generatePrintablePdf = async (
  model: PhoneModel,
  imageUrl: string,
  editState: EditState
): Promise<void> => {
  try {
    const imgData = await generatePrintableImage(model, imageUrl, editState);
    
    // Create PDF (p = portrait, mm = millimeters, a4 = format)
    // The canvas was generated with A4 aspect ratio specifically for this.
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Add image to PDF. 
    // The high-res image is placed to exactly fill the A4 page (210mm x 297mm).
    // This ensures physical accuracy when printed at 100% scale.
    pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
    
    // Save
    pdf.save(`SkinForge-${model.name.replace(/\s+/g, '-')}-Template.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};