import React, { useState, useEffect, useRef } from 'react';
import { Leaf, ChevronRight, ChevronLeft, Printer, Palette, X, Check, FileText, Settings2, Download } from 'lucide-react';
import ItineraryDocument from './components/ItineraryDocument';
import { ThemeProvider, useTheme } from './components/ThemeContext';

export interface PrintConfig {
  selectedDays: string[];
  orientation: 'portrait' | 'landscape';
  pageSize: 'A4' | 'Letter';
}

const ALL_DAYS = [
  { id: 'day1', label: 'Day 1 (啟程)' },
  { id: 'day2', label: 'Day 2 (清水寺)' },
  { id: 'day3', label: 'Day 3 (嵐山)' },
  { id: 'day4', label: 'Day 4 (箕面)' },
  { id: 'day5', label: 'Day 5 (返台)' },
  { id: 'tools', label: '實用工具' },
];

function PdfSettingsModal({ isOpen, onClose, onPrint }: { isOpen: boolean; onClose: () => void; onPrint: (config: PrintConfig) => void }) {
  const { currentTheme } = useTheme();
  const [selectedDays, setSelectedDays] = useState<string[]>(ALL_DAYS.map(d => d.id));
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [pageSize, setPageSize] = useState<'A4' | 'Letter'>('A4');
  const p = currentTheme.primary;

  if (!isOpen) return null;

  const toggleDay = (id: string) => {
    if (selectedDays.includes(id)) {
      setSelectedDays(selectedDays.filter(d => d !== id));
    } else {
      setSelectedDays([...selectedDays, id]);
    }
  };

  const handleSelectAll = () => setSelectedDays(ALL_DAYS.map(d => d.id));
  const handleDeselectAll = () => setSelectedDays([]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fade-in print:hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm relative overflow-hidden flex flex-col max-h-[90vh]">
        <div className={`p-4 border-b flex justify-between items-center bg-${p}-50 border-${p}-100`}>
          <h3 className={`font-bold text-lg flex items-center gap-2 text-${p}-800`}>
            <Printer className="w-5 h-5" />
            PDF 匯出設定
          </h3>
          <button onClick={onClose} className={`p-1 rounded-full hover:bg-${p}-100 text-${p}-600 transition-colors`}>
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="overflow-y-auto p-5 space-y-6">
          {/* Day Selection */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider">選擇包含內容</h4>
              <div className="flex gap-2 text-xs">
                <button onClick={handleSelectAll} className={`text-${p}-600 hover:underline`}>全選</button>
                <span className="text-gray-300">|</span>
                <button onClick={handleDeselectAll} className="text-gray-500 hover:underline">取消全選</button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {ALL_DAYS.map((day) => (
                <button
                  key={day.id}
                  onClick={() => toggleDay(day.id)}
                  className={`flex items-center gap-2 p-2 rounded-lg border text-sm transition-all text-left ${
                    selectedDays.includes(day.id)
                      ? `border-${p}-500 bg-${p}-50 text-${p}-900` 
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedDays.includes(day.id) ? `bg-${p}-500 border-${p}-500` : 'border-gray-300 bg-white'}`}>
                    {selectedDays.includes(day.id) && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span>{day.label}</span>
                </button>
              ))}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Page Settings */}
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">頁面方向</h4>
              <div className="flex gap-2">
                {[
                  { id: 'portrait', label: '直向 (Portrait)' },
                  { id: 'landscape', label: '橫向 (Landscape)' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setOrientation(opt.id as any)}
                    className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                      orientation === opt.id
                        ? `border-${p}-500 bg-${p}-600 text-white shadow-md`
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">紙張大小</h4>
              <div className="flex gap-2">
                {['A4', 'Letter'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setPageSize(size as any)}
                    className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                      pageSize === size
                        ? `border-${p}-500 bg-${p}-600 text-white shadow-md`
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t bg-gray-50 flex gap-3">
           <button 
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 active:scale-95 transition-transform"
          >
            取消
          </button>
          <button 
            onClick={() => onPrint({ selectedDays, orientation, pageSize })}
            disabled={selectedDays.length === 0}
            className={`flex-[2] py-2.5 rounded-xl font-bold text-white shadow-sm active:scale-95 transition-transform flex items-center justify-center gap-2 ${
              selectedDays.length === 0 ? 'bg-gray-300 cursor-not-allowed' : `bg-${p}-600 hover:bg-${p}-700`
            }`}
          >
            <Download className="w-4 h-4" />
            建立 PDF / 列印
          </button>
        </div>
      </div>
    </div>
  );
}

function ThemeSettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { themes, fonts, currentTheme, currentFont, setThemeId, setFontId } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fade-in print:hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xs relative overflow-hidden flex flex-col max-h-[90vh]">
        <div className={`p-4 border-b flex justify-between items-center bg-${currentTheme.primary}-50 border-${currentTheme.primary}-100`}>
          <h3 className={`font-bold text-lg flex items-center gap-2 text-${currentTheme.primary}-800`}>
            <Palette className="w-5 h-5" />
            外觀設定
          </h3>
          <button onClick={onClose} className={`p-1 rounded-full hover:bg-${currentTheme.primary}-100 text-${currentTheme.primary}-600 transition-colors`}>
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="overflow-y-auto p-4 space-y-6">
          {/* Theme Selection */}
          <div>
            <h4 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">主題配色</h4>
            <div className="grid grid-cols-2 gap-2">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setThemeId(theme.id)}
                  className={`flex items-center gap-3 p-2 rounded-lg border transition-all ${
                    currentTheme.id === theme.id 
                      ? `border-${theme.primary}-500 bg-${theme.primary}-50 text-${theme.primary}-900 ring-1 ring-${theme.primary}-500` 
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full bg-${theme.primary}-500 border-2 border-white shadow-sm flex items-center justify-center shrink-0`}>
                    {currentTheme.id === theme.id && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="font-medium text-sm">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Font Selection */}
          <div>
            <h4 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">字體風格</h4>
            <div className="space-y-2">
              {fonts.map((font) => (
                <button
                  key={font.id}
                  onClick={() => setFontId(font.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${font.className} ${
                    currentFont.id === font.id 
                      ? `border-${currentTheme.primary}-500 bg-${currentTheme.primary}-50 text-${currentTheme.primary}-900` 
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span className="text-base">{font.name}</span>
                  {currentFont.id === font.id && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t bg-gray-50">
          <button 
            onClick={onClose}
            className={`w-full py-2.5 rounded-xl font-bold text-white shadow-sm active:scale-95 transition-transform bg-${currentTheme.primary}-600 hover:bg-${currentTheme.primary}-700`}
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const [activeTab, setActiveTab] = useState('day1');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [printConfig, setPrintConfig] = useState<PrintConfig>({
    selectedDays: ALL_DAYS.map(d => d.id),
    orientation: 'portrait',
    pageSize: 'A4'
  });
  
  const { currentTheme, currentFont } = useTheme();

  // 捲動到頂部當切換分頁時
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const tabs = [
    { id: 'day1', label: 'Day 1', date: '11/29', sub: '啟程' },
    { id: 'day2', label: 'Day 2', date: '11/30', sub: '清水寺' },
    { id: 'day3', label: 'Day 3', date: '12/01', sub: '嵐山' },
    { id: 'day4', label: 'Day 4', date: '12/02', sub: '箕面' },
    { id: 'day5', label: 'Day 5', date: '12/03', sub: '返台' },
    { id: 'tools', label: '工具', date: 'TOOLS', sub: '匯率/日語' },
  ];

  const handleNext = () => {
    const currentIndex = tabs.findIndex(t => t.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    }
  };

  const handlePrev = () => {
    const currentIndex = tabs.findIndex(t => t.id === activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
    }
  };

  const handlePrintRequest = (config: PrintConfig) => {
    setPrintConfig(config);
    // 這裡我們不立刻關閉 Modal，而是透過 CSS 的 print:hidden 來隱藏
    // 這樣可以避免手機瀏覽器因為 DOM 變動而失去 "使用者互動" 的 Context
    // setIsPdfModalOpen(false); 
    
    // 短暫延遲讓 React 更新 State (注入 @media print CSS)
    setTimeout(() => {
      window.print();
      // 列印對話框彈出後（或取消後），再關閉 Modal
      // 雖然 JS 會在 print() 阻塞，但某些瀏覽器不會，所以這裡只做一個延遲關閉作為備案
      // 更好的方式是使用者手動關閉，或者我們在 print 之後關閉
      setIsPdfModalOpen(false);
    }, 100);
  };

  const p = currentTheme.primary;
  const n = currentTheme.neutral;

  return (
    <div className={`min-h-screen flex flex-col relative print:bg-white print:block ${currentFont.className}`}>
      
      {/* Dynamic Print Styles */}
      <style>{`
        @media print {
          @page {
            size: ${printConfig.pageSize} ${printConfig.orientation};
            margin: 10mm;
          }
          /* Ensure backgrounds are printed */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Hide non-selected days is handled in ItineraryDocument via class names */
        }
      `}</style>

      {/* Background Image Layer */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-500"
        style={{
          // 使用 Unsplash 高畫質京都秋景替代 (若您有 Google Drive 圖片連結的公開直連網址，請替換此處)
          backgroundImage: `url('https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop')` 
        }}
      />
      {/* Overlay Layer for better text readability */}
      <div className={`fixed inset-0 z-0 bg-${n}-50/40 backdrop-blur-[3px]`} />

      <ThemeSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <PdfSettingsModal 
        isOpen={isPdfModalOpen} 
        onClose={() => setIsPdfModalOpen(false)} 
        onPrint={handlePrintRequest} 
      />

      {/* Fixed Header - Hidden on Print */}
      <header className={`fixed top-0 left-0 right-0 z-[100] bg-white/90 backdrop-blur-md border-b border-${p}-100 shadow-sm h-14 flex items-center justify-between px-4 print:hidden transition-colors duration-300`}>
        <div className={`flex items-center gap-2 text-${p}-800 font-bold text-lg`}>
          <Leaf className="w-5 h-5" />
          <span>2025 京阪紅葉手冊</span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className={`flex items-center justify-center w-8 h-8 rounded-full bg-${n}-100/80 text-${n}-600 hover:bg-${p}-100 hover:text-${p}-700 transition-colors`}
            title="外觀設定"
          >
            <Palette className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setIsPdfModalOpen(true)}
            className={`flex items-center gap-1.5 bg-${p}-700 text-white px-3 py-1.5 rounded-full text-xs font-medium hover:bg-${p}-800 transition-colors shadow-sm active:scale-95`}
          >
            <Printer className="w-4 h-4" />
            <span>列印 / PDF</span>
          </button>
        </div>
      </header>

      {/* Sticky Tabs Navigation - Hidden on Print */}
      <nav className={`fixed top-14 left-0 right-0 z-[90] bg-white/80 backdrop-blur-md border-b border-${n}-200 overflow-x-auto hide-scrollbar print:hidden transition-colors duration-300`}>
        <div className="flex px-2 min-w-full sm:justify-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-2 px-4 min-w-[70px] transition-colors relative ${
                activeTab === tab.id 
                  ? `text-${p}-700 font-bold` 
                  : `text-${n}-500 hover:text-${n}-700`
              }`}
            >
              <span className="text-xs mb-0.5 opacity-80">{tab.date}</span>
              <span className="text-sm whitespace-nowrap">{tab.sub}</span>
              {activeTab === tab.id && (
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-${p}-600 mx-2 rounded-t-full`} />
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 relative z-10 print:p-0 print:m-0 print:block">
        <div className="max-w-2xl mx-auto print:max-w-none print:w-full">
          {/* Print Header (Visible only on print) */}
          <div className="hidden print:block mb-8 text-center border-b-2 border-red-700 pb-4">
            <h1 className="text-3xl font-bold text-stone-900 mb-2">2025 京阪紅葉・家族旅行手冊</h1>
            <p className="text-stone-500">日期：11/29 (五) ~ 12/03 (二)</p>
          </div>

          {/* Web View Container */}
          <div className={`bg-white/90 backdrop-blur-sm shadow-lg rounded-xl overflow-hidden border border-${n}-100 min-h-[60vh] print:shadow-none print:border-none print:min-h-0 print:rounded-none print:overflow-visible print:bg-white transition-colors duration-300`}>
            <div className="p-5 sm:p-8 print:p-0">
              <ItineraryDocument activeTab={activeTab} printOptions={printConfig} />
            </div>
          </div>
          
          {/* Print Footer Instructions */}
           <div className={`hidden print:block mt-8 text-center text-xs text-${n}-400 border-t border-${n}-200 pt-4 break-before-avoid`}>
            <p>本手冊由網頁自動生成。祝旅途愉快！</p>
          </div>
        </div>
      </main>

      {/* Bottom Navigation Bar - Hidden on Print - COMPACT VERSION */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-${n}-200 px-4 py-2 z-50 flex justify-between items-center max-w-2xl mx-auto w-full shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] print:hidden transition-colors duration-300`}>
        <button 
          onClick={handlePrev}
          disabled={activeTab === 'day1'}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeTab === 'day1' 
              ? `text-${n}-300 cursor-not-allowed` 
              : `text-${n}-600 hover:bg-${n}-100 active:scale-95`
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="hidden sm:inline">上一天</span>
        </button>

        <span className={`text-sm font-bold text-${n}-600`}>
          {tabs.findIndex(t => t.id === activeTab) + 1} / {tabs.length}
        </span>

        <button 
          onClick={handleNext}
          disabled={activeTab === 'tools'}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeTab === 'tools' 
              ? `text-${n}-300 cursor-not-allowed` 
              : `bg-${p}-600 text-white hover:bg-${p}-700 shadow-md active:scale-95`
          }`}
        >
          <span className="hidden sm:inline">下一天</span>
          <span className="sm:hidden">下一頁</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @media print {
          @page {
            /* Styles injected dynamically via React state, this is fallback */
            margin: 10mm;
          }
          html, body {
            height: auto !important;
            overflow: visible !important;
            background-color: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          body, #root, .min-h-screen, main, .flex-col {
             display: block !important;
             position: static !important;
             width: 100% !important;
             height: auto !important;
             overflow: visible !important;
          }
          .break-after-page {
            page-break-after: always !important;
            break-after: page !important;
            display: block !important;
            height: 1px !important;
            width: 100% !important;
            clear: both !important;
            margin-bottom: 20px !important;
          }
          .break-inside-avoid {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}