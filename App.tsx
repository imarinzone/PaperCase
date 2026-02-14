import React, { useState } from 'react';
import { Header } from './components/Header';
import { ModelSelector } from './components/ModelSelector';
import { ImageCustomizer } from './components/ImageCustomizer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PhoneModel } from './types';
import { AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<PhoneModel | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const handleHomeRequest = () => {
    // If we are already on home screen, do nothing or maybe refresh?
    if (!selectedModel) return;
    
    // Show custom modal instead of native confirm which can get stuck
    setShowExitConfirm(true);
  };

  const confirmExit = () => {
    setSelectedModel(null);
    setShowExitConfirm(false);
  };

  const cancelExit = () => {
    setShowExitConfirm(false);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-black text-white selection:bg-brand-500/30">
        <Header onHome={selectedModel ? handleHomeRequest : () => setSelectedModel(null)} />
        
        <main>
          {!selectedModel ? (
            <ModelSelector onSelect={setSelectedModel} />
          ) : (
            <ImageCustomizer 
              model={selectedModel} 
              onBack={handleHomeRequest} 
            />
          )}
        </main>

        {/* Custom Exit Confirmation Modal */}
        {showExitConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-zinc-900 border border-white/10 rounded-2xl max-w-sm w-full p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center mb-4 text-yellow-500">
                  <AlertTriangle size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Leave Customizer?</h3>
                <p className="text-zinc-400 text-sm mb-6">
                  Your current design progress will be lost if you go back to the model selection screen.
                </p>
                
                <div className="flex gap-3 w-full">
                  <button 
                    onClick={cancelExit}
                    className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium transition-colors"
                  >
                    Stay
                  </button>
                  <button 
                    onClick={confirmExit}
                    className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium transition-colors shadow-lg shadow-red-900/20"
                  >
                    Leave
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default App;