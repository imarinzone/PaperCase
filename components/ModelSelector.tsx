import React, { useState } from 'react';
import { PhoneModel, Brand } from '../types';
import { PHONE_MODELS } from '../constants';
import { Search, ChevronRight, ScanLine, Loader2, Plus, Wifi, ExternalLink } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { getCameraPathForStyle, CAMERA_STYLES_PROMPT } from '../utils/cameraPatterns';

interface Props {
  onSelect: (model: PhoneModel) => void;
}

export const ModelSelector: React.FC<Props> = ({ onSelect }) => {
  const [activeBrand, setActiveBrand] = useState<Brand | 'All'>('All');
  const [search, setSearch] = useState('');
  const [models, setModels] = useState<PhoneModel[]>(PHONE_MODELS);
  const [isScanning, setIsScanning] = useState(false);
  const [scanSources, setScanSources] = useState<{title: string, uri: string}[]>([]);

  const filteredModels = models.filter(m => {
    const matchesBrand = activeBrand === 'All' || m.brand === activeBrand;
    const searchLower = search.toLowerCase();
    
    // Combine brand and name for search (e.g. "Samsung Galaxy")
    const fullName = `${m.brand} ${m.name}`.toLowerCase();
    
    const matchesSearch = fullName.includes(searchLower);
    return matchesBrand && matchesSearch;
  });

  const handleNeuralScan = async () => {
    if (!search.trim()) return;
    setIsScanning(true);
    setScanSources([]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview", 
        contents: `Retrieve the exact physical body dimensions (height, width) for "${search}" in millimeters.
                   Search for "dimensions.com ${search}", "gsmarena ${search} dimensions", or "phonearena ${search} specs" to find precise schematics.
                   
                   IMPORTANT: 
                   1. Pay special attention to the corner radius (sharp vs rounded).
                   2. Identify the specific rear camera layout style from this list:
                   ${CAMERA_STYLES_PROMPT}

                   Return a JSON object. Do not include markdown formatting.
                   
                   JSON Structure:
                   {
                     "found": boolean,
                     "brand": "Apple" | "Samsung" | "Google" | "Other",
                     "widthMm": number, // The shorter side of the phone body, precise to 1 decimal place
                     "heightMm": number, // The longer side of the phone body, precise to 1 decimal place
                     "cornerRadiusMm": number, // Estimate: 1-2 for sharp (S24 Ultra), 4-8 for standard rounded, 8-10 for very rounded
                     "releaseYear": number,
                     "cameraStyle": "samsung_vertical_3_detached" | "samsung_vertical_2_detached" | "samsung_vertical_3_island" | "iphone_pro_island" | "iphone_base_island" | "pixel_visor" | "center_circle" | "vertical_pill_left"
                   }`,
        config: {
          tools: [{googleSearch: {}}]
        }
      });

      // 1. Extract Sources
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = chunks
        .map((c: any) => c.web ? { title: c.web.title, uri: c.web.uri } : null)
        .filter((s): s is {title: string, uri: string} => !!s);
      
      setScanSources(sources);

      // 2. Parse JSON
      let text = response.text || "";
      text = text.replace(/```json\n?|```/g, '').trim();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) text = jsonMatch[0];

      const data = JSON.parse(text);

      if (data && data.found) {
        const newModel: PhoneModel = {
          id: search.toLowerCase().replace(/\s+/g, '-'),
          name: search, // Use user search term or capitalize it
          brand: data.brand as Brand,
          widthMm: data.widthMm,
          heightMm: data.heightMm,
          cornerRadiusMm: data.cornerRadiusMm || 6,
          releaseYear: data.releaseYear,
          cameraPath: getCameraPathForStyle(data.cameraStyle)
        };

        setModels(prev => [newModel, ...prev]);
        setActiveBrand('All');
      } else {
        alert("Could not retrieve precise specifications for this device. Please try a more specific model name.");
      }

    } catch (error) {
      console.error("Neural Scan failed", error);
      alert("Neural Scan failed. Please check connection.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 animate-fade-in pb-20">
      <div className="text-center mb-8 md:mb-10">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-3 md:mb-4 font-['Oswald'] uppercase tracking-tighter">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-violet-400">Device</span>
        </h1>
        <p className="text-sm md:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed font-medium">
          Forge your signature style and print it into reality.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 md:mb-8 justify-between items-center">
        <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/5 overflow-x-auto max-w-full w-full md:w-auto no-scrollbar">
          {['All', ...Object.values(Brand)].map(brand => (
            <button
              key={brand}
              onClick={() => setActiveBrand(brand as Brand | 'All')}
              className={`px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap flex-1 md:flex-none ${
                activeBrand === brand 
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
          <input 
            type="text" 
            placeholder="Search or add model..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && filteredModels.length === 0 && search.length > 3) {
                handleNeuralScan();
              }
            }}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
          />
        </div>
      </div>

      {/* Source Citations */}
      {scanSources.length > 0 && (
        <div className="mb-6 animate-fade-in">
          <p className="text-[10px] text-zinc-500 mb-2 uppercase tracking-wider font-semibold">Specs Verified Via:</p>
          <div className="flex flex-wrap gap-2">
            {scanSources.slice(0, 3).map((source, i) => (
              <a 
                key={i} 
                href={source.uri} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-900/20 border border-brand-500/20 rounded-lg text-[10px] text-brand-300 hover:bg-brand-900/40 transition-colors"
              >
                {source.title.slice(0, 30)}... <ExternalLink size={10} />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {filteredModels.map(model => (
          <button
            key={model.id}
            onClick={() => onSelect(model)}
            className="group relative bg-zinc-900/50 border border-white/5 hover:border-brand-500/50 hover:bg-zinc-800/50 rounded-2xl p-5 md:p-6 text-left transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/0 to-violet-500/0 group-hover:from-brand-500/5 group-hover:to-violet-500/5 transition-all" />
            
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <span className="text-[10px] font-semibold text-brand-400 mb-1 block uppercase tracking-wider">{model.brand}</span>
                <h3 className="text-base md:text-lg font-bold text-white group-hover:text-brand-100 transition-colors">{model.name}</h3>
                <p className="text-zinc-500 text-xs md:text-sm mt-1">{model.widthMm}mm x {model.heightMm}mm</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-brand-500 group-hover:text-white transition-all">
                <ChevronRight size={16} />
              </div>
            </div>
            
            {/* Simple wireframe preview */}
            <div className="mt-6 flex justify-center opacity-30 group-hover:opacity-50 transition-opacity">
              <div 
                style={{ 
                  width: model.widthMm * 0.7, 
                  height: model.heightMm * 0.7,
                  borderRadius: model.cornerRadiusMm * 0.7,
                }} 
                className="border-2 border-dashed border-white"
              />
            </div>
          </button>
        ))}

        {/* Neural Spec Retrieval Card */}
        {filteredModels.length === 0 && search.length > 0 && (
          <button
            onClick={handleNeuralScan}
            disabled={isScanning}
            className="group relative border-2 border-dashed border-white/10 hover:border-brand-500/50 hover:bg-zinc-900/50 rounded-2xl p-6 text-left transition-all duration-300 flex flex-col items-center justify-center text-center min-h-[180px]"
          >
             {isScanning ? (
                <div className="flex flex-col items-center">
                   <Loader2 size={32} className="text-brand-500 animate-spin mb-3" />
                   <p className="text-sm font-bold text-white animate-pulse">Scanning Neural Net...</p>
                   <p className="text-xs text-zinc-500 mt-1">Retrieving specs for "{search}"</p>
                </div>
             ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-brand-500/10 flex items-center justify-center mb-3 group-hover:bg-brand-500/20 text-brand-400 transition-colors">
                     <Wifi size={24} />
                  </div>
                  <h3 className="text-base font-bold text-white">Import "{search}"?</h3>
                  <p className="text-xs text-zinc-500 mt-2 max-w-[200px]">
                    Use AI to auto-retrieve dimensions and blueprints for this device via Google Search.
                  </p>
                  <div className="mt-4 px-4 py-2 bg-white/5 rounded-lg text-xs font-mono text-brand-300 flex items-center gap-2 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                    <ScanLine size={12} /> INITIALIZE SCAN
                  </div>
                </>
             )}
          </button>
        )}
      </div>
      
      {filteredModels.length === 0 && search.length === 0 && (
        <div className="text-center py-20">
          <p className="text-zinc-500">Search for a device to begin...</p>
        </div>
      )}
    </div>
  );
};