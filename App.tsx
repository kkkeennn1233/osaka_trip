import React, { useState, useEffect } from 'react';
import { Leaf, ChevronRight, ChevronLeft, Map, Calendar } from 'lucide-react';
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
    { id: 'info', label: '必備', date: 'INFO', sub: '住宿/清單' },
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

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-[100] bg-white border-b border-red-100 shadow-sm h-14 flex items-center justify-center">
        <div className="flex items-center gap-2 text-red-800 font-bold text-lg">
          <Leaf className="w-5 h-5" />
          <span>2025 京阪紅葉手冊</span>
        </div>
      </header>

      {/* Sticky Tabs Navigation */}
      <nav className="fixed top-14 left-0 right-0 z-[90] bg-white/95 backdrop-blur border-b border-stone-200 overflow-x-auto hide-scrollbar">
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
      <main className="flex-grow pt-32 pb-24 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          {/* Web View Container */}
          <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-stone-100 min-h-[60vh]">
            <div className="p-5 sm:p-8">
              <ItineraryDocument activeTab={activeTab} />
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 p-4 pb-6 z-50 flex justify-between items-center max-w-2xl mx-auto w-full shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
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
          disabled={activeTab === 'info'}
          className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'info' 
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
      `}</style>
    </div>
  );
}