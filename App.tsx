import React, { useState, useEffect } from 'react';
import { Printer, Download, Leaf, AlertTriangle, X, Eye } from 'lucide-react';
import ItineraryDocument from './components/ItineraryDocument';

export default function App() {
  const [isPreview, setIsPreview] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  // Function to handle the actual system print call
  const triggerSystemPrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      try {
        if (typeof window !== 'undefined' && window.print) {
          window.print();
        } else {
          alert('您的瀏覽器不支援自動列印，請使用瀏覽器選單中的「分享」或「列印」功能。');
        }
      } catch (e) {
        console.error('Print failed', e);
        alert('列印功能發生錯誤，請嘗試使用瀏覽器選單列印。');
      } finally {
        setTimeout(() => setIsPrinting(false), 1000);
      }
    }, 100);
  };

  // If in preview mode, render the simplified print view
  if (isPreview) {
    return (
      <div className="min-h-screen bg-stone-100 flex flex-col print:bg-white">
        {/* Preview Toolbar - Hidden when printing */}
        <div className="sticky top-0 z-50 bg-stone-900 text-white p-4 shadow-lg print:hidden flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsPreview(false)}
              className="flex items-center gap-2 px-3 py-2 text-stone-300 hover:text-white hover:bg-stone-800 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
              <span className="hidden sm:inline">關閉預覽</span>
            </button>
            <span className="font-bold text-lg">列印預覽模式</span>
          </div>
          
          <button
            onClick={triggerSystemPrint}
            disabled={isPrinting}
            className={`
              flex items-center gap-2 px-6 py-2 rounded-lg font-bold shadow-md transition-all
              ${isPrinting 
                ? 'bg-stone-600 text-stone-400 cursor-wait' 
                : 'bg-red-600 hover:bg-red-500 text-white active:scale-95'
              }
            `}
          >
            <Printer className="w-5 h-5" />
            <span>{isPrinting ? '處理中...' : '確認列印'}</span>
          </button>
        </div>

        {/* Preview Content Area - Mimics A4 Paper */}
        <div className="flex-grow overflow-auto p-4 sm:p-8 print:p-0 print:overflow-visible">
          <div className="max-w-[210mm] mx-auto bg-white shadow-2xl min-h-screen print:shadow-none print:w-full print:max-w-none">
            <div className="p-8 sm:p-12 print:p-0">
              <ItineraryDocument />
            </div>
          </div>
          
          {/* Helper Text for Preview Mode */}
          <div className="max-w-[210mm] mx-auto mt-6 text-center text-stone-500 text-sm print:hidden pb-12">
            <p>💡 這是預覽畫面。如果上方按鈕無效，您可以直接截圖此畫面，或是使用瀏覽器選單的「列印」功能。</p>
          </div>
        </div>
      </div>
    );
  }

  // Main App View
  return (
    <div className="min-h-screen flex flex-col print:hidden">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-[100] bg-white border-b border-red-100 shadow-md h-16 flex items-center">
        <div className="max-w-4xl mx-auto px-4 w-full flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-800">
            <Leaf className="w-6 h-6" />
            <h1 className="font-bold text-lg hidden sm:block">2025 京阪紅葉・家族旅行手冊</h1>
            <h1 className="font-bold text-lg sm:hidden">京阪紅葉旅行</h1>
          </div>
          <button
            onClick={() => setIsPreview(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all shadow-sm select-none touch-manipulation bg-red-700 hover:bg-red-800 active:scale-95 text-white cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>預覽 / 列印</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow pt-20 pb-8 px-4 sm:px-6 bg-stone-50">
        <div className="max-w-4xl mx-auto">
          {/* Instructions Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 shadow-sm">
            <h3 className="text-blue-800 font-bold mb-2 flex items-center gap-2">
              <Download className="w-4 h-4" />
              如何下載 PDF？
            </h3>
            <div className="text-sm text-blue-700 space-y-2">
              <p>1. 點擊右上角的 <strong>「預覽 / 列印」</strong> 按鈕進入預覽模式。</p>
              <p>2. 在預覽頁面點擊紅色的 <strong>「確認列印」</strong>。</p>
              <p>3. 在系統視窗選擇 <strong>「另存為 PDF」</strong>。</p>
              <div className="bg-white/60 p-2 rounded text-xs border border-blue-100 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0" />
                <span>
                  <strong>按鈕沒反應？</strong>
                  <br/>
                  請進入「預覽模式」後，直接使用手機截圖，或是點選瀏覽器選單 (三點符號) 中的「分享」&rarr;「列印」。
                </span>
              </div>
            </div>
          </div>

          {/* Document Container (Visual Only) */}
          <div className="bg-white shadow-xl rounded-xl overflow-hidden cursor-pointer hover:shadow-2xl transition-shadow" onClick={() => setIsPreview(true)}>
            <div className="p-6 sm:p-12 pointer-events-none opacity-90 hover:opacity-100 transition-opacity">
               {/* Overlay to encourage clicking */}
               <div className="mb-4 text-center text-stone-400 text-sm border-b pb-4">
                 點擊此處或右上角按鈕進入完整預覽模式...
               </div>
              <ItineraryDocument />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-8 text-center">
        <p className="text-sm">Created for the best autumn memories 🍁</p>
      </footer>
    </div>
  );
}