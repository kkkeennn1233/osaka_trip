import React, { useState, useEffect } from 'react';
import { Leaf, ChevronRight, ChevronLeft, Printer } from 'lucide-react';
import ItineraryDocument from './components/ItineraryDocument';

export default function App() {
  const [activeTab, setActiveTab] = useState('day1');

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

  const handlePrint = () => {
    // 提供明確的用戶回饋，解決 "按了沒反應" 的疑慮
    const isConfirmed = window.confirm("即將開啟列印/PDF 預覽視窗。\n\n💡 提示：\n1. 請在目的地選擇「另存為 PDF」。\n2. 若手機沒有自動彈出視窗，請使用瀏覽器選單的「分享」->「列印」。\n\n是否繼續？");
    
    if (isConfirmed) {
      // 延遲執行以確保 UI 狀態更新，並避開某些瀏覽器的同步阻塞問題
      setTimeout(() => {
        window.print();
      }, 100);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 print:bg-white print:block">
      {/* Fixed Header - Hidden on Print */}
      <header className="fixed top-0 left-0 right-0 z-[100] bg-white border-b border-red-100 shadow-sm h-14 flex items-center justify-between px-4 print:hidden">
        <div className="flex items-center gap-2 text-red-800 font-bold text-lg">
          <Leaf className="w-5 h-5" />
          <span>2025 京阪紅葉手冊</span>
        </div>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-1.5 bg-red-700 text-white px-3 py-1.5 rounded-full text-xs font-medium hover:bg-red-800 transition-colors shadow-sm active:scale-95"
        >
          <Printer className="w-4 h-4" />
          <span>列印 / 另存 PDF</span>
        </button>
      </header>

      {/* Sticky Tabs Navigation - Hidden on Print */}
      <nav className="fixed top-14 left-0 right-0 z-[90] bg-white/95 backdrop-blur border-b border-stone-200 overflow-x-auto hide-scrollbar print:hidden">
        <div className="flex px-2 min-w-full sm:justify-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-2 px-4 min-w-[70px] transition-colors relative ${
                activeTab === tab.id 
                  ? 'text-red-700 font-bold' 
                  : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              <span className="text-xs mb-0.5 opacity-80">{tab.date}</span>
              <span className="text-sm whitespace-nowrap">{tab.sub}</span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 mx-2 rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 print:p-0 print:m-0 print:block">
        <div className="max-w-2xl mx-auto print:max-w-none print:w-full">
          {/* Print Header (Visible only on print) */}
          <div className="hidden print:block mb-8 text-center border-b-2 border-red-700 pb-4">
            <h1 className="text-3xl font-bold text-stone-900 mb-2">2025 京阪紅葉・家族旅行手冊</h1>
            <p className="text-stone-500">日期：11/29 (五) ~ 12/03 (二)</p>
          </div>

          {/* Web View Container */}
          <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-stone-100 min-h-[60vh] print:shadow-none print:border-none print:min-h-0 print:rounded-none">
            <div className="p-5 sm:p-8 print:p-0">
              <ItineraryDocument activeTab={activeTab} />
            </div>
          </div>
          
          {/* Print Footer Instructions */}
           <div className="hidden print:block mt-8 text-center text-xs text-stone-400 border-t border-stone-200 pt-4">
            <p>本手冊由網頁自動生成。建議使用 A4 紙張列印。</p>
          </div>
        </div>
      </main>

      {/* Bottom Navigation Bar - Hidden on Print */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 p-4 pb-6 z-50 flex justify-between items-center max-w-2xl mx-auto w-full shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] print:hidden">
        <button 
          onClick={handlePrev}
          disabled={activeTab === 'day1'}
          className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'day1' 
              ? 'text-stone-300 cursor-not-allowed' 
              : 'text-stone-600 hover:bg-stone-100 active:scale-95'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="hidden sm:inline">上一天</span>
        </button>

        <span className="text-sm font-bold text-stone-400">
          {tabs.findIndex(t => t.id === activeTab) + 1} / {tabs.length}
        </span>

        <button 
          onClick={handleNext}
          disabled={activeTab === 'tools'}
          className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'tools' 
              ? 'text-stone-300 cursor-not-allowed' 
              : 'bg-red-600 text-white hover:bg-red-700 shadow-md active:scale-95'
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
            margin: 10mm;
            size: A4 portrait;
          }
          /* Reset Styles for Print to ensure pages break correctly */
          html, body {
            height: auto !important;
            overflow: visible !important;
            background-color: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          /* Important: Kill flexbox on main containers during print to allow page breaks */
          body, #root, .min-h-screen, main, .flex-col {
             display: block !important;
             position: static !important;
             width: 100% !important;
          }
          
          /* Define the page break class */
          .break-before-page {
            page-break-before: always !important;
            break-before: page !important;
            display: block !important;
            margin-top: 0 !important;
            padding-top: 20px !important;
            clear: both !important;
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