import React, { useState, useRef, useEffect } from 'react';
import { PhoneModel, EditState, TextLayer } from '../types';
import { DEFAULT_PATTERNS, FONTS } from '../constants';
import { generatePrintablePdf } from '../utils/canvasUtils';
import { GoogleGenAI } from "@google/genai";
import { 
  Upload, Sliders, Move, ArrowLeft, Download, 
  RotateCcw, ZoomIn, FlipHorizontal, FlipVertical,
  Image as ImageIcon, RefreshCw, Sun, Contrast, Droplet, EyeOff, Aperture,
  Type, Plus, Trash2, Sparkles, Wand2, Loader2, ChevronDown
} from 'lucide-react';

interface Props {
  model: PhoneModel;
  onBack: () => void;
}

const INITIAL_STATE: EditState = {
  scale: 1,
  translateX: 0,
  translateY: 0,
  rotation: 0,
  brightness: 100,
  contrast: 100,
  saturation: 100,
  grayscale: 0,
  blur: 0,
  flipX: false,
  flipY: false,
  textLayers: []
};

type ToolTab = 'upload' | 'adjust' | 'transform' | 'text' | 'export';

export const ImageCustomizer: React.FC<Props> = ({ model, onBack }) => {
  const [image, setImage] = useState<string | null>(null);
  const [editState, setEditState] = useState<EditState>(INITIAL_STATE);
  const [activeTab, setActiveTab] = useState<ToolTab>('upload');
  const [activeTextId, setActiveTextId] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(true); // For mobile toggle
  
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [isDraggingText, setIsDraggingText] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isGenerating, setIsGenerating] = useState(false);

  // AI Generation State
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-switch tab on image upload
  useEffect(() => {
    if (image && activeTab === 'upload' && window.innerWidth < 768) {
       // On mobile, keep panel open but switch tab to transform to encourage interaction
       setActiveTab('transform');
    }
  }, [image]);

  // File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImage(ev.target?.result as string);
        setEditState({ ...INITIAL_STATE, textLayers: [] }); 
        setActiveTab('transform'); 
      };
      reader.readAsDataURL(file);
    }
  };

  // AI Generation
  const handleAiGeneration = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const fullPrompt = `High resolution, 4k, detailed, artistic wallpaper of ${aiPrompt}`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: fullPrompt }],
        },
      });

      let foundImage = false;
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const base64EncodeString = part.inlineData.data;
            const mimeType = part.inlineData.mimeType || 'image/png';
            const imageUrl = `data:${mimeType};base64,${base64EncodeString}`;
            setImage(imageUrl);
            setEditState({ ...INITIAL_STATE, textLayers: [] });
            setActiveTab('transform');
            foundImage = true;
            break;
          }
        }
      }
      
      if (!foundImage) {
          alert("No image was generated. Please try a different prompt.");
      }
    } catch (error) {
      console.error("AI Generation failed", error);
      alert("Failed to generate image. Please try again.");
    } finally {
      setIsAiGenerating(false);
    }
  };

  // PDF Generation
  const handleDownload = async () => {
    if (!image) return;
    setIsGenerating(true);
    try {
      await generatePrintablePdf(model, image, editState);
    } catch (err) {
      console.error(err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // --- Drag Logic ---
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (!image) return;
    setIsDraggingImage(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    setDragStart({ x: clientX, y: clientY });
  };

  const handleTextMouseDown = (e: React.MouseEvent | React.TouchEvent, id: string) => {
    e.stopPropagation(); 
    setActiveTextId(id);
    setIsDraggingText(true);
    setActiveTab('text'); 
    setIsPanelOpen(true);

    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    setDragStart({ x: clientX, y: clientY });
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if ((!isDraggingImage && !isDraggingText) || !containerRef.current) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;
    const rect = containerRef.current.getBoundingClientRect();
    const percentX = (deltaX / rect.width) * 100;
    const percentY = (deltaY / rect.height) * 100;

    if (isDraggingImage) {
      setEditState(prev => ({
        ...prev,
        translateX: prev.translateX + percentX,
        translateY: prev.translateY + percentY
      }));
    } else if (isDraggingText && activeTextId) {
      setEditState(prev => ({
        ...prev,
        textLayers: prev.textLayers.map(layer => 
          layer.id === activeTextId ? { ...layer, x: layer.x + percentX, y: layer.y + percentY } : layer
        )
      }));
    }
    setDragStart({ x: clientX, y: clientY });
  };

  const handleMouseUp = () => {
    setIsDraggingImage(false);
    setIsDraggingText(false);
  };

  // --- Text Logic ---
  const addTextLayer = () => {
    const newLayer: TextLayer = {
      id: Math.random().toString(36).substr(2, 9),
      text: 'SkinForge',
      fontFamily: FONTS[0].family,
      color: '#ffffff',
      fontSize: 15,
      x: 50,
      y: 50,
      rotation: 0
    };
    setEditState(prev => ({ ...prev, textLayers: [...prev.textLayers, newLayer] }));
    setActiveTextId(newLayer.id);
  };

  const updateActiveText = (key: keyof TextLayer, value: any) => {
    if (!activeTextId) return;
    setEditState(prev => ({
      ...prev,
      textLayers: prev.textLayers.map(l => l.id === activeTextId ? { ...l, [key]: value } : l)
    }));
  };

  const deleteActiveText = () => {
    if (!activeTextId) return;
    setEditState(prev => ({
      ...prev,
      textLayers: prev.textLayers.filter(l => l.id !== activeTextId)
    }));
    setActiveTextId(null);
  };

  const resetAdjustments = () => {
    setEditState(prev => ({
      ...prev,
      brightness: 100,
      contrast: 100,
      saturation: 100,
      grayscale: 0,
      blur: 0
    }));
  };

  const resetTransforms = () => {
    setEditState(prev => ({
      ...prev,
      scale: 1,
      translateX: 0,
      translateY: 0,
      rotation: 0,
      flipX: false,
      flipY: false
    }));
  };

  const togglePanel = (tab: ToolTab) => {
    if (activeTab === tab) {
      setIsPanelOpen(!isPanelOpen);
    } else {
      setActiveTab(tab);
      setIsPanelOpen(true);
    }
  };

  const previewFilter = `brightness(${editState.brightness}%) contrast(${editState.contrast}%) saturate(${editState.saturation}%) grayscale(${editState.grayscale}%) blur(${editState.blur}px)`;
  const activeTextLayer = editState.textLayers.find(l => l.id === activeTextId);

  return (
    <div className="flex flex-col-reverse md:flex-row h-[calc(100vh-64px)] bg-black overflow-hidden">
      
      {/* -------------------------------------------------------------
          SIDEBAR / BOTTOM SHEET (Tools & Panels)
         ------------------------------------------------------------- */}
      <div className={`flex-shrink-0 flex flex-col-reverse md:flex-row w-full md:w-80 bg-zinc-900 border-t md:border-t-0 md:border-r border-white/5 z-20 shadow-2xl transition-all duration-300 ${isPanelOpen ? 'h-[50vh] md:h-full' : 'h-16 md:h-full'}`}>
        
        {/* ICON RAIL */}
        <div className="w-full md:w-16 h-16 md:h-full flex flex-row md:flex-col items-center justify-around md:justify-start md:py-4 gap-0 md:gap-4 bg-zinc-950 border-t md:border-t-0 md:border-r border-white/5 shrink-0">
          <button 
            onClick={() => togglePanel('upload')}
            className={`p-3 rounded-xl transition-all ${activeTab === 'upload' && isPanelOpen ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
            title="Uploads"
          >
            <ImageIcon size={20} />
          </button>
          
          <button 
            onClick={() => togglePanel('transform')}
            disabled={!image}
            className={`p-3 rounded-xl transition-all ${activeTab === 'transform' && isPanelOpen ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50' : 'text-zinc-500 hover:text-white hover:bg-white/5 disabled:opacity-30'}`}
            title="Transform"
          >
            <Move size={20} />
          </button>

          <button 
            onClick={() => togglePanel('adjust')}
            disabled={!image}
            className={`p-3 rounded-xl transition-all ${activeTab === 'adjust' && isPanelOpen ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50' : 'text-zinc-500 hover:text-white hover:bg-white/5 disabled:opacity-30'}`}
            title="Adjustments"
          >
            <Sliders size={20} />
          </button>

          <button 
            onClick={() => togglePanel('text')}
            disabled={!image}
            className={`p-3 rounded-xl transition-all ${activeTab === 'text' && isPanelOpen ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50' : 'text-zinc-500 hover:text-white hover:bg-white/5 disabled:opacity-30'}`}
            title="Text"
          >
            <Type size={20} />
          </button>

          <button 
            onClick={() => togglePanel('export')}
            disabled={!image}
            className={`p-3 rounded-xl transition-all ${activeTab === 'export' && isPanelOpen ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50' : 'text-zinc-500 hover:text-white hover:bg-white/5 disabled:opacity-30'}`}
            title="Export"
          >
            <Download size={20} />
          </button>

          <div className="md:mt-auto md:mb-2 hidden md:block">
            <button 
              onClick={onBack}
              className="p-3 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
              title="Exit"
            >
              <ArrowLeft size={20} />
            </button>
          </div>
        </div>

        {/* PANEL CONTENT */}
        <div className={`flex-1 flex flex-col min-w-0 bg-zinc-900 w-full overflow-hidden ${!isPanelOpen ? 'hidden md:flex' : 'flex'}`}>
          <div className="px-4 py-3 md:px-5 md:py-4 border-b border-white/5 flex justify-between items-center bg-zinc-900/95 sticky top-0 z-10 shrink-0 h-14">
            <div>
              <h2 className="text-base md:text-lg font-bold text-white capitalize">{activeTab}</h2>
            </div>
            <button onClick={() => setIsPanelOpen(false)} className="md:hidden text-zinc-500 p-2">
               <ChevronDown size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 md:px-5 space-y-4 custom-scrollbar">
            
            {/* --- UPLOAD PANEL --- */}
            {activeTab === 'upload' && (
              <div className="space-y-4 animate-fade-in">
                <label className="flex flex-col items-center justify-center w-full h-20 border border-dashed border-white/20 rounded-xl hover:border-brand-500 hover:bg-brand-500/5 transition-all cursor-pointer group bg-zinc-900">
                  <div className="flex items-center gap-3">
                    <Upload className="w-5 h-5 text-zinc-500 group-hover:text-brand-400 transition-colors" />
                    <p className="text-xs text-zinc-400 group-hover:text-white">Upload Image</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                </label>
                
                {/* AI Generation Section */}
                <div className="pt-3 border-t border-white/5">
                    <h3 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Sparkles size={10} className="text-brand-400"/> AI Generator
                    </h3>
                    <div className="space-y-2">
                        <textarea 
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            placeholder="Describe your design..."
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand-500/50 resize-none h-14"
                        />
                        <button 
                            onClick={handleAiGeneration}
                            disabled={isAiGenerating || !aiPrompt.trim()}
                            className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isAiGenerating ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                            Generate
                        </button>
                    </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">Presets</h3>
                  <div className="grid grid-cols-4 md:grid-cols-3 gap-2">
                    {DEFAULT_PATTERNS.slice(0, 6).map((url, i) => (
                      <button 
                        key={i}
                        onClick={() => {
                          setImage(url);
                          setEditState({ ...INITIAL_STATE, textLayers: [] });
                          setActiveTab('transform');
                        }}
                        className="aspect-square rounded-md overflow-hidden border border-white/5 hover:border-brand-500 transition-all group relative"
                      >
                        <img src={url} alt="Preset" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* --- TRANSFORM PANEL --- */}
            {activeTab === 'transform' && image && (
              <div className="space-y-5 animate-fade-in">
                
                {/* Scale */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs text-zinc-400 flex items-center gap-2"><ZoomIn size={12}/> Scale</label>
                    <span className="text-[10px] font-mono text-zinc-500">{Math.round(editState.scale * 100)}%</span>
                  </div>
                  <input 
                    type="range" min="0.1" max="3" step="0.01" 
                    value={editState.scale}
                    onChange={(e) => setEditState({...editState, scale: parseFloat(e.target.value)})}
                    className="w-full accent-brand-500 bg-white/10 h-1 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Rotation */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs text-zinc-400 flex items-center gap-2"><RotateCcw size={12}/> Rotate</label>
                    <span className="text-[10px] font-mono text-zinc-500">{editState.rotation}°</span>
                  </div>
                  <input 
                    type="range" min="0" max="360" step="1" 
                    value={editState.rotation}
                    onChange={(e) => setEditState({...editState, rotation: parseInt(e.target.value)})}
                    className="w-full accent-brand-500 bg-white/10 h-1 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex gap-1.5">
                    {[0, 90, 180, 270].map(deg => (
                      <button 
                        key={deg}
                        onClick={() => setEditState({...editState, rotation: deg})}
                        className="flex-1 py-1.5 text-[10px] bg-white/5 hover:bg-white/10 rounded border border-white/5 text-zinc-400"
                      >
                        {deg}°
                      </button>
                    ))}
                  </div>
                </div>

                {/* Flip */}
                <div className="flex gap-2">
                    <button 
                      onClick={() => setEditState(s => ({...s, flipX: !s.flipX}))}
                      className={`flex-1 py-2 flex items-center justify-center gap-1.5 rounded-lg border transition-all ${editState.flipX ? 'bg-brand-500/20 border-brand-500 text-brand-400' : 'bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10'}`}
                    >
                      <FlipHorizontal size={14} /> <span className="text-[10px]">Flip X</span>
                    </button>
                    <button 
                      onClick={() => setEditState(s => ({...s, flipY: !s.flipY}))}
                      className={`flex-1 py-2 flex items-center justify-center gap-1.5 rounded-lg border transition-all ${editState.flipY ? 'bg-brand-500/20 border-brand-500 text-brand-400' : 'bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10'}`}
                    >
                      <FlipVertical size={14} /> <span className="text-[10px]">Flip Y</span>
                    </button>
                </div>

                <button onClick={resetTransforms} className="w-full py-2.5 text-xs text-zinc-500 hover:text-white flex items-center justify-center gap-2 border border-dashed border-zinc-700 rounded-lg">
                  <RefreshCw size={12} /> Reset All
                </button>
              </div>
            )}

            {/* --- ADJUST PANEL --- */}
            {activeTab === 'adjust' && image && (
              <div className="space-y-4 animate-fade-in">
                {[
                  { label: 'Brightness', icon: Sun, key: 'brightness' as keyof EditState, min: 0, max: 200 },
                  { label: 'Contrast', icon: Contrast, key: 'contrast' as keyof EditState, min: 0, max: 200 },
                  { label: 'Saturation', icon: Droplet, key: 'saturation' as keyof EditState, min: 0, max: 200 },
                  { label: 'Blur', icon: Aperture, key: 'blur' as keyof EditState, min: 0, max: 10 },
                  { label: 'Grayscale', icon: EyeOff, key: 'grayscale' as keyof EditState, min: 0, max: 100 },
                ].map((control) => (
                  <div key={control.key} className="space-y-1.5">
                     <div className="flex justify-between items-center">
                        <label className="text-[10px] font-medium text-zinc-400 flex items-center gap-1.5">
                          <control.icon size={10} /> {control.label}
                        </label>
                        <span className="text-[10px] font-mono text-zinc-500">{Math.round(editState[control.key] as number)}</span>
                      </div>
                      <input 
                        type="range" min={control.min} max={control.max} 
                        value={editState[control.key] as number}
                        onChange={(e) => setEditState({...editState, [control.key]: parseFloat(e.target.value)})}
                        className="w-full accent-brand-500 bg-white/10 h-1 rounded-lg appearance-none cursor-pointer"
                      />
                  </div>
                ))}
                <button onClick={resetAdjustments} className="w-full py-2.5 text-xs text-zinc-500 hover:text-white flex items-center justify-center gap-2 border border-dashed border-zinc-700 rounded-lg mt-2">
                  <RefreshCw size={12} /> Reset All
                </button>
              </div>
            )}

            {/* --- TEXT PANEL --- */}
            {activeTab === 'text' && image && (
              <div className="space-y-4 animate-fade-in">
                
                <button 
                  onClick={addTextLayer}
                  className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg flex items-center justify-center gap-2 font-semibold shadow-lg shadow-brand-900/50 transition-all text-sm"
                >
                  <Plus size={16} /> Add Text
                </button>

                {activeTextLayer ? (
                  <div className="space-y-3 bg-white/5 p-3 rounded-xl border border-white/5">
                    <div className="flex justify-between items-center">
                      <h3 className="text-[10px] font-bold text-zinc-400 uppercase">Properties</h3>
                      <button onClick={deleteActiveText} className="text-red-400 hover:text-red-300 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="space-y-1">
                      <input 
                        type="text" 
                        value={activeTextLayer.text}
                        onChange={(e) => updateActiveText('text', e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-brand-500"
                        placeholder="Enter text..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                         {FONTS.map(font => (
                           <button
                            key={font.name}
                            onClick={() => updateActiveText('fontFamily', font.family)}
                            className={`py-1.5 text-[10px] rounded border transition-all ${activeTextLayer.fontFamily === font.family ? 'bg-brand-500 text-white border-brand-500' : 'bg-white/5 text-zinc-400 border-white/5 hover:bg-white/10'}`}
                            style={{ fontFamily: font.family }}
                           >
                             {font.name}
                           </button>
                         ))}
                    </div>

                    <div className="flex gap-3 pt-1">
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500">Color</label>
                        <input 
                          type="color" 
                          value={activeTextLayer.color}
                          onChange={(e) => updateActiveText('color', e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <label className="text-[10px] text-zinc-500">Size</label>
                        <input 
                          type="range" min="5" max="50" 
                          value={activeTextLayer.fontSize}
                          onChange={(e) => updateActiveText('fontSize', parseInt(e.target.value))}
                          className="w-full accent-brand-500 h-1 bg-white/10 rounded-lg appearance-none mt-3"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-zinc-500 text-xs">
                    {editState.textLayers.length > 0 ? 'Select a text layer to edit' : 'Tap above to add text'}
                  </div>
                )}
              </div>
            )}
            
            {/* --- EXPORT PANEL (UPDATED) --- */}
            {activeTab === 'export' && image && (
               <div className="flex flex-col h-full justify-center space-y-4 animate-fade-in pb-10">
                  <div className="text-center">
                     <h3 className="text-base font-bold text-white mb-0.5">Print Template</h3>
                     <p className="text-[10px] text-zinc-500">
                         High-res PDF for {model.name}
                     </p>
                  </div>

                  <button
                    onClick={handleDownload}
                    disabled={isGenerating}
                    className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                        isGenerating 
                        ? 'bg-zinc-800 text-zinc-500' 
                        : 'bg-gradient-to-r from-brand-600 to-violet-600 hover:from-brand-500 hover:to-violet-500 text-white shadow-lg shadow-brand-900/50'
                    }`}
                  >
                    {isGenerating ? (
                        <>
                            <Loader2 size={18} className="animate-spin" /> Rendering...
                        </>
                    ) : (
                        <>
                            <Download size={18} /> Download PDF
                        </>
                    )}
                  </button>
                 
                 <div className="p-3 bg-yellow-500/5 border border-yellow-500/10 rounded-lg text-[10px] text-yellow-200/60 text-center leading-relaxed">
                     <span className="font-bold text-yellow-500/80 mr-1">Note:</span>
                     Print at 100% scale (Do not "Fit to Page")
                 </div>
               </div>
            )}
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          WORKSPACE (Canvas)
         ------------------------------------------------------------- */}
      <div 
        className="flex-1 relative bg-black flex items-center justify-center p-6 md:p-8 overflow-hidden" 
        style={{ touchAction: 'none' }} // Critical for dragging
      >
        {/* Mobile Top Bar (Back button) */}
        <div className="md:hidden absolute top-4 left-4 z-40">
           <button 
              onClick={onBack}
              className="p-2 rounded-full bg-zinc-900/80 text-white border border-white/10 backdrop-blur"
           >
              <ArrowLeft size={18} />
           </button>
        </div>

        {/* Background Grid */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none" 
          style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '30px 30px' }} 
        />
        
        {/* Workspace Info */}
        <div className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center gap-4 z-30">
           <div className="px-3 py-1 bg-zinc-900/80 backdrop-blur rounded-full border border-white/5 text-[10px] md:text-xs text-zinc-400">
             {model.name}
           </div>
        </div>

        {!image && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0 text-zinc-800 p-4 text-center">
             <div className="text-5xl md:text-8xl font-black opacity-20 tracking-tighter">CREATE</div>
             <p className="opacity-40 font-mono mt-4 text-sm">Tap Upload to start</p>
          </div>
        )}

        {/* PHONE CANVAS */}
        <div 
          className="relative shadow-2xl transition-all duration-300 ease-out z-10 ring-1 ring-white/10"
          style={{
            aspectRatio: `${model.widthMm} / ${model.heightMm}`,
            height: 'min(70vh, 700px)', // Allow more height on mobile vs previous 85vh which might overlap
            maxHeight: isPanelOpen ? '50vh' : '70vh', // Shrink canvas when panel is open on mobile
            borderRadius: `${model.cornerRadiusMm}mm`,
          }}
        >
          {/* Mask & Interactive Area */}
          <div 
            ref={containerRef}
            className={`w-full h-full relative overflow-hidden bg-zinc-900 ${image ? (isDraggingImage ? 'cursor-grabbing' : 'cursor-move') : ''}`}
            style={{ borderRadius: 'inherit' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
          >
            {image && (
              <img 
                src={image}
                alt="Design"
                draggable={false}
                className="absolute origin-center max-w-none select-none"
                style={{
                  top: '50%',
                  left: '50%',
                  width: `${editState.scale * 100}%`,
                  transform: `
                    translate(-50%, -50%) 
                    translate(${editState.translateX}%, ${editState.translateY}%) 
                    rotate(${editState.rotation}deg)
                    scaleX(${editState.flipX ? -1 : 1})
                    scaleY(${editState.flipY ? -1 : 1})
                  `,
                  filter: previewFilter
                }}
              />
            )}
            
            {/* Text Layers */}
            {editState.textLayers.map(layer => (
              <div
                key={layer.id}
                onMouseDown={(e) => handleTextMouseDown(e, layer.id)}
                onTouchStart={(e) => handleTextMouseDown(e, layer.id)}
                className={`absolute select-none whitespace-nowrap cursor-move ${activeTextId === layer.id ? 'ring-2 ring-brand-500 ring-offset-2 ring-offset-black/20' : ''}`}
                style={{
                  left: `${layer.x}%`,
                  top: `${layer.y}%`,
                  transform: `translate(-50%, -50%) rotate(${layer.rotation}deg)`,
                  fontFamily: layer.fontFamily,
                  fontSize: `${(layer.fontSize / 100) * (containerRef.current?.offsetWidth || 0)}px`, 
                  color: layer.color,
                  zIndex: 25,
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}
              >
                {layer.text}
              </div>
            ))}
            
            {/* Camera Overlay */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-20">
               <svg viewBox={`0 0 ${model.widthMm} ${model.heightMm}`} className="w-full h-full" preserveAspectRatio="none">
                 <path d={model.cameraPath} fill="rgba(0,0,0,0.85)" />
                 <path d={model.cameraPath} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
               </svg>
            </div>

            {/* Gloss */}
            <div className="absolute inset-0 pointer-events-none z-30 opacity-50 bg-gradient-to-tr from-white/10 via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
};