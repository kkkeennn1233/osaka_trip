import React, { useState, useEffect } from 'react';
import { MapPin, Utensils, ShoppingBag, Hotel, AlertCircle, CheckSquare, CloudSun, CalendarClock, Sun, Cloud, ThermometerSun, Umbrella, Wind, Calculator, Languages, Volume2, RefreshCw, ShoppingCart, Train, Shirt, CreditCard, HelpCircle, Coffee, Camera, Sunset, Moon, Gift, Home, Plane, Ticket, Trees, Mountain, Phone, Ambulance, ShieldAlert, Timer, Check, Edit3, Plus, Trash2, ArrowUp, ArrowDown, Save, RotateCcw, ImagePlus, Sparkles, XCircle, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { useScheduleDatabase, ScheduleItem } from './ScheduleDatabase';
import { GoogleGenAI } from "@google/genai";

// --- Weather Data (Historical Average) ---
const WEATHER_DATA: Record<string, { loc: string, tempHigh: number, tempLow: number, condition: string, icon: any, precip: number, note: string }> = {
  day1: { loc: 'Kyoto', tempHigh: 15, tempLow: 7, condition: 'Sunny', icon: Sun, precip: 10, note: '早晚溫差大，建議洋蔥式穿搭' },
  day2: { loc: 'Kyoto', tempHigh: 14, tempLow: 5, condition: 'Partly Cloudy', icon: CloudSun, precip: 20, note: '清晨山區較冷，必備圍巾' },
  day3: { loc: 'Arashiyama', tempHigh: 13, tempLow: 6, condition: 'Cloudy', icon: Cloud, precip: 30, note: '嵐山風大，建議戴帽子' },
  day4: { loc: 'Minoh (Osaka)', tempHigh: 14, tempLow: 6, condition: 'Sunny', icon: Sun, precip: 0, note: '適合健行的乾爽好天氣' },
  day5: { loc: 'Osaka', tempHigh: 16, tempLow: 8, condition: 'Sunny', icon: ThermometerSun, precip: 10, note: '市區溫暖，舒適的移動日' },
};

// --- Widgets ---

const WeatherWidget = ({ dayId }: { dayId: string }) => {
  const data = WEATHER_DATA[dayId];
  const { currentTheme } = useTheme();
  const n = currentTheme.neutral;

  if (!data) return null;

  const Icon = data.icon;

  return (
    <div className={`bg-gradient-to-r from-${n}-50 to-${n}-100/50 border border-${n}-100 rounded-xl p-3 mb-5 flex items-center justify-between shadow-sm animate-fade-in print:border-stone-300 print:bg-none print:shadow-none break-inside-avoid`}>
      <div className="flex items-center gap-3">
        <div className="bg-white p-2 rounded-full shadow-sm text-amber-500 print:hidden">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className={`font-bold text-${n}-800`}>{data.loc}</span>
            <span className={`text-xs text-${n}-500 font-medium print:text-stone-600`}>{data.condition}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className={`font-bold text-${n}-800`}>{data.tempHigh}°</span>
            <span className={`text-${n}-400`}>/</span>
            <span className={`text-${n}-600`}>{data.tempLow}°C</span>
          </div>
        </div>
      </div>
      
      <div className={`flex flex-col items-end gap-1 text-xs text-${n}-600`}>
        <div className="flex items-center gap-1 bg-white/60 px-2 py-0.5 rounded-full print:bg-transparent">
          <Umbrella className="w-3 h-3 text-blue-500 print:text-stone-800" />
          <span>{data.precip}%</span>
        </div>
        <div className="flex items-center gap-1 bg-white/60 px-2 py-0.5 rounded-full print:bg-transparent">
          <Wind className={`w-3 h-3 text-${n}-400 print:text-stone-800`} />
          <span>{data.note}</span>
        </div>
      </div>
    </div>
  );
};

const CountdownWidget = () => {
  const [daysLeft, setDaysLeft] = useState(0);
  const { currentTheme } = useTheme();
  const p = currentTheme.primary;
  
  useEffect(() => {
    const targetDate = new Date('2025-11-29T00:00:00');
    const now = new Date();
    const diffTime = targetDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDaysLeft(diffDays);
  }, []);

  if (daysLeft < 0) return null;

  return (
    <div className={`bg-${p}-50 border border-${p}-100 rounded-xl p-4 mb-6 flex items-center justify-between print:hidden`}>
      <div className="flex items-center gap-3">
        <div className={`bg-${p}-100 p-2 rounded-full text-${p}-600`}>
          <Timer className="w-5 h-5" />
        </div>
        <div>
          <div className={`text-xs text-${p}-600 font-bold uppercase`}>Trip Countdown</div>
          <div className={`text-${p}-900 font-medium text-sm`}>距離出發還有</div>
        </div>
      </div>
      <div className={`text-3xl font-bold text-${p}-600 font-mono`}>
        {daysLeft} <span className={`text-sm text-${p}-400 font-sans`}>天</span>
      </div>
    </div>
  );
};

// New Structure for Menu Items
interface MenuItem {
  name_jp: string;
  name_zh: string;
  price: string;
  desc: string;
}

interface MenuCategory {
  category: string;
  items: MenuItem[];
}

const MenuTranslator = () => {
  const [image, setImage] = useState<string | null>(null);
  const [menuData, setMenuData] = useState<MenuCategory[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  
  const { currentTheme } = useTheme();
  const p = currentTheme.primary;
  const n = currentTheme.neutral;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setMenuData(null); // Clear previous
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTranslate = async () => {
    if (!image) return;
    setLoading(true);
    setError('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const match = image.match(/^data:(.*);base64,(.*)$/);
      if (!match) throw new Error("Invalid image format");
      
      const mimeType = match[1];
      const base64Data = match[2];

      const prompt = `
        您是專業的日文菜單翻譯員。請分析這張菜單圖片。
        請根據內容將菜色分類（例如：飲料、炸物、生魚片、主食、甜點等）。
        若只有一種分類，請設為「菜單內容」。
        
        請回傳一個純 JSON Array (不要用 Markdown code block)，格式如下：
        [
          {
            "category": "類別名稱",
            "items": [
              {
                "name_jp": "日文菜名",
                "name_zh": "繁體中文翻譯",
                "price": "價格 (含貨幣符號，如 ¥1000，若無則留空)",
                "desc": "簡短的一句話口感或食材說明 (繁體中文)"
              }
            ]
          }
        ]
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
          parts: [
            { inlineData: { mimeType, data: base64Data } },
            { text: prompt }
          ]
        },
        config: {
          responseMimeType: "application/json"
        }
      });

      const text = response.text;
      if (text) {
        const parsedData = JSON.parse(text);
        setMenuData(parsedData);
      } else {
        throw new Error("Empty response");
      }
      
    } catch (err: any) {
      console.error("Translation error:", err);
      setError("翻譯失敗，請確認 API Key 或圖片清晰度。");
    } finally {
      setLoading(false);
    }
  };

  const clearImage = () => {
    setImage(null);
    setMenuData(null);
    setError('');
  };

  return (
    <div className={`bg-${n}-50 border border-${n}-200 rounded-xl overflow-hidden mb-8 print:hidden flex flex-col`}>
      {/* Header */}
      <div className={`p-4 border-b border-${n}-100 bg-white/50 backdrop-blur-sm flex justify-between items-center`}>
        <h3 className={`text-lg font-bold text-${n}-800 flex items-center gap-2`}>
          <div className={`bg-${p}-100 p-1.5 rounded-md text-${p}-700`}>
            <Camera className="w-5 h-5" />
          </div>
          菜單翻譯 (對照模式)
        </h3>
        {image && (
          <button onClick={clearImage} className={`text-xs text-${n}-500 hover:text-red-500 flex items-center gap-1`}>
            <RotateCcw className="w-3 h-3" /> 重拍
          </button>
        )}
      </div>

      {!image ? (
        <div className="p-5">
           <label className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-${n}-300 rounded-xl cursor-pointer bg-white hover:bg-${n}-50 transition-all group`}>
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <div className={`bg-${n}-100 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform`}>
                 <ImagePlus className={`w-8 h-8 text-${n}-500`} />
              </div>
              <p className={`text-sm text-${n}-600 font-bold`}>點擊拍照或上傳菜單</p>
              <p className={`text-xs text-${n}-400 mt-1`}>支援手寫日文菜單辨識</p>
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
          </label>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          {/* TOP: Image View */}
          <div className="relative bg-black/5 min-h-[200px] max-h-[40vh] overflow-auto border-b border-gray-200">
            <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-md z-10">
              原始圖片
            </div>
            <img 
              src={image} 
              alt="Menu Original" 
              className="w-full h-full object-contain mx-auto" 
            />
          </div>

          {/* BOTTOM: Translation View */}
          <div className="flex-1 bg-white min-h-[300px]">
             {!menuData && !loading && !error && (
               <div className="p-6 text-center">
                 <p className="text-gray-500 text-sm mb-4">照片已載入，準備好進行 AI 分析了嗎？</p>
                 <button
                  onClick={handleTranslate}
                  className={`w-full py-3 bg-${p}-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-${p}-700 active:scale-95 transition-all shadow-md`}
                >
                  <Sparkles className="w-5 h-5" />
                  開始辨識與翻譯
                </button>
               </div>
             )}

             {loading && (
               <div className="p-10 flex flex-col items-center justify-center space-y-4 text-gray-500 h-full">
                 <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                 <div className="text-center">
                   <p className="font-bold text-gray-700">AI 正在閱讀菜單...</p>
                   <p className="text-xs mt-1">正在辨識日文、翻譯並整理排版</p>
                 </div>
               </div>
             )}
             
             {error && (
                <div className="p-6">
                  <div className="p-4 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 shrink-0" /> {error}
                  </div>
                  <button onClick={handleTranslate} className="mt-4 w-full py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-600">重試</button>
                </div>
             )}

             {menuData && (
               <div className="p-4 space-y-6 animate-fade-in bg-white pb-10">
                 {/* Translation Header */}
                 <div className="flex items-center justify-center gap-2 text-gray-400 text-xs uppercase tracking-widest mb-2">
                   <ChevronDown className="w-3 h-3" /> 數位中文菜單 <ChevronDown className="w-3 h-3" />
                 </div>

                 {menuData.map((cat, idx) => (
                   <div key={idx} className="space-y-3">
                     <h4 className={`font-bold text-lg text-${p}-800 border-b-2 border-${p}-100 pb-1 flex items-center justify-between`}>
                       {cat.category}
                       <span className="text-xs font-normal text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{cat.items.length} 品項</span>
                     </h4>
                     <div className="grid gap-3">
                       {cat.items.map((item, i) => (
                         <div key={i} className="flex flex-col bg-white border border-gray-100 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                           {/* Decorative accent */}
                           <div className={`absolute left-0 top-0 bottom-0 w-1 bg-${p}-200 group-hover:bg-${p}-500 transition-colors`}></div>
                           
                           <div className="pl-3 flex justify-between items-start gap-2">
                             <div>
                               <div className="font-bold text-gray-800 text-base">{item.name_zh}</div>
                               <div className="text-xs text-gray-400 font-mono mt-0.5">{item.name_jp}</div>
                             </div>
                             {item.price && (
                               <div className="font-mono font-bold text-lg text-amber-600 shrink-0 bg-amber-50 px-2 rounded">
                                 {item.price}
                               </div>
                             )}
                           </div>
                           {item.desc && (
                             <div className="pl-3 mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded leading-relaxed">
                               💡 {item.desc}
                             </div>
                           )}
                         </div>
                       ))}
                     </div>
                   </div>
                 ))}
               </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
};

const EmergencyWidget = () => {
  const red = 'red';
  const stone = 'stone';

  return (
    <div className={`bg-${red}-50 border border-${red}-200 rounded-xl p-4 mb-8 print:border-stone-300 print:bg-white break-inside-avoid`}>
      <h3 className={`text-lg font-bold text-${red}-800 mb-3 flex items-center gap-2`}>
        <ShieldAlert className="w-5 h-5" />
        緊急救援 (按一下撥打)
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <a href="tel:110" className={`flex items-center justify-between bg-white p-3 rounded-lg border border-${red}-100 shadow-sm hover:bg-${red}-50 active:scale-95 transition-all text-left`}>
          <div className="flex items-center gap-3">
            <div className={`bg-${red}-100 p-1.5 rounded-full text-${red}-600`}><Phone className="w-4 h-4"/></div>
            <div>
              <div className={`font-bold text-${stone}-800`}>警察局</div>
              <div className={`text-xs text-${stone}-500`}>遇到事故/遺失</div>
            </div>
          </div>
          <div className={`text-xl font-bold text-${red}-600 font-mono`}>110</div>
        </a>
        
        <a href="tel:119" className={`flex items-center justify-between bg-white p-3 rounded-lg border border-${red}-100 shadow-sm hover:bg-${red}-50 active:scale-95 transition-all text-left`}>
          <div className="flex items-center gap-3">
            <div className={`bg-${red}-100 p-1.5 rounded-full text-${red}-600`}><Ambulance className="w-4 h-4"/></div>
            <div>
              <div className={`font-bold text-${stone}-800`}>救護/消防</div>
              <div className={`text-xs text-${stone}-500`}>受傷/火災</div>
            </div>
          </div>
          <div className={`text-xl font-bold text-${red}-600 font-mono`}>119</div>
        </a>

        <a href="tel:+81-6-6227-8623" className={`flex items-center justify-between bg-white p-3 rounded-lg border border-${red}-100 shadow-sm hover:bg-${red}-50 active:scale-95 transition-all text-left sm:col-span-3`}>
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-1.5 rounded-full text-blue-600"><Home className="w-4 h-4"/></div>
            <div>
              <div className={`font-bold text-${stone}-800`}>大阪辦事處 (急難救助)</div>
              <div className={`text-xs text-${stone}-500`}>護照遺失/重大事故</div>
            </div>
          </div>
          <div className="text-sm font-bold text-blue-600 font-mono">+81-6-6227-8623</div>
        </a>
      </div>
    </div>
  );
};

const ExchangeRateWidget = () => {
  const [jpy, setJpy] = useState<string>('');
  const [twd, setTwd] = useState<string>('');
  const [rate, setRate] = useState<number>(0.218); 
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  
  const { currentTheme } = useTheme();
  const n = currentTheme.neutral;
  const p = currentTheme.primary;

  const fetchRate = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/JPY');
      const data = await response.json();
      if (data && data.rates && data.rates.TWD) {
        const estimatedCashRate = Number((data.rates.TWD * 1.018).toFixed(4));
        setRate(estimatedCashRate);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (error) {
      console.error("Failed to fetch rate", error);
      // alert("無法取得即時匯率，將使用預設值");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRate(); }, []);

  const handleJpyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setJpy(val);
    if (val && !isNaN(Number(val))) setTwd((Number(val) * rate).toFixed(0));
    else setTwd('');
  };

  const handleTwdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTwd(val);
    if (val && !isNaN(Number(val))) setJpy((Number(val) / rate).toFixed(0));
    else setJpy('');
  };

  return (
    <div className={`bg-${n}-50 border border-${n}-200 rounded-xl p-5 mb-8 print:hidden`}>
      <h3 className={`text-lg font-bold text-${n}-800 mb-4 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <div className={`bg-${p}-100 p-1.5 rounded-md text-${p}-700`}>
            <Calculator className="w-5 h-5" />
          </div>
          匯率計算機
        </div>
        <button 
          onClick={fetchRate} 
          disabled={loading}
          className={`text-xs bg-white border border-${n}-200 px-2 py-1 rounded-full flex items-center gap-1 text-${n}-500 hover:text-${p}-600 active:scale-95 transition-all`}
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          {loading ? '更新中...' : '更新匯率'}
        </button>
      </h3>
      
      <div className={`flex items-center justify-between bg-white rounded-lg p-3 border border-${n}-200 mb-3 shadow-sm focus-within:ring-2 focus-within:ring-${p}-500/20 focus-within:border-${p}-500 transition-all`}>
        <span className={`font-bold text-${n}-500 text-sm`}>JPY ¥</span>
        <input type="number" value={jpy} onChange={handleJpyChange} placeholder="輸入日幣" className={`text-right font-mono text-xl font-bold text-${n}-800 outline-none w-full ml-4 bg-transparent`} />
      </div>

      <div className="flex justify-center -my-3 z-10 relative">
        <div className={`bg-${n}-100 rounded-full p-1.5 border border-${n}-200`}>
          <RefreshCw className={`w-4 h-4 text-${n}-400`} />
        </div>
      </div>

      <div className={`flex items-center justify-between bg-white rounded-lg p-3 border border-${n}-200 mt-0 shadow-sm focus-within:ring-2 focus-within:ring-${p}-500/20 focus-within:border-${p}-500 transition-all`}>
        <span className={`font-bold text-${n}-500 text-sm`}>TWD $</span>
        <input type="number" value={twd} onChange={handleTwdChange} placeholder="輸入台幣" className={`text-right font-mono text-xl font-bold text-${n}-800 outline-none w-full ml-4 bg-transparent`} />
      </div>

      <div className={`mt-3 flex items-center justify-between text-xs text-${n}-400 px-1`}>
        <span>{lastUpdated ? `更新於: ${lastUpdated}` : '台灣銀行現金賣出估算'}</span>
        <div className="flex items-center gap-2">
          <span>匯率:</span>
          <input type="number" value={rate} step="0.001" onChange={(e) => setRate(Number(e.target.value))} className={`w-16 bg-${n}-100 rounded px-1 py-0.5 text-right border border-${n}-200 text-${n}-600`} />
        </div>
      </div>
    </div>
  );
};

const JapanesePhraseWidget = () => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const { currentTheme } = useTheme();
  const n = currentTheme.neutral;

  useEffect(() => {
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      setVoices(v);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  const categories = [
    {
      id: 'dining', title: '餐廳用餐 (點餐/結帳)', icon: Utensils, color: 'text-amber-600 bg-amber-50',
      phrases: [
        { cn: '請給我菜單', jp: 'メニューをお願いします。', romaji: 'Menyū o onegaishimasu.' },
        { cn: '請問有推薦的嗎？', jp: 'おすすめはありますか？', romaji: 'Osusume wa arimasu ka?' },
        { cn: '我要這個。', jp: 'これをお願いします。', romaji: 'Kore o onegaishimasu.' },
        { cn: '請給我水。', jp: 'お水をお願いします。', romaji: 'Omizu o onegaishimasu.' },
        { cn: '不好意思，結帳。', jp: 'すみません、お会計をお願いします。', romaji: 'Sumimasen, okaikei o onegaishimasu.' },
        { cn: '很好吃！', jp: '美味しかったです！', romaji: 'Oishikatta desu!' },
      ]
    },
    {
      id: 'transport', title: '交通移動 (車站/買票)', icon: Train, color: 'text-green-600 bg-green-50',
      phrases: [
        { cn: '請問車站在哪裡？', jp: '駅はどこですか？', romaji: 'Eki wa doko desu ka?' },
        { cn: '這班車去京都嗎？', jp: 'この電車は京都に行きますか？', romaji: 'Kono densha wa Kyōto ni ikimasu ka?' },
        { cn: '售票處在哪裡？', jp: '切符売り場はどこですか？', romaji: 'Kippu uriba wa doko desu ka?' },
      ]
    },
    {
      id: 'shopping_q', title: '購物詢問 (尺寸/顏色/試穿)', icon: Shirt, color: 'text-indigo-600 bg-indigo-50',
      phrases: [
        { cn: '這個多少錢？', jp: 'これ、いくらですか？', romaji: 'Kore, ikura desu ka?' },
        { cn: '不好意思，請問這個在哪裡？', jp: 'すみません、これ、どこにありますか？', romaji: 'Sumimasen, kore, doko ni arimasu ka?' },
        { cn: '有大一點的尺寸嗎？', jp: 'もう少し大きいサイズはありますか？', romaji: 'Mō sukoshi ōkii saizu wa arimasu ka?' },
        { cn: '有其他顏色嗎？', jp: '他の色はありますか？', romaji: 'Hoka no iro wa arimasu ka?' },
        { cn: '可以試穿嗎？', jp: '試着してもいいですか？', romaji: 'Shichaku shite mo ii desu ka?' },
        { cn: '請問有試穿用的面罩嗎？', jp: 'フェイスカバーはありますか？', romaji: 'Feisukabā wa arimasu ka?' },
      ]
    },
    {
      id: 'checkout', title: '結帳應對 (刷卡/袋子)', icon: CreditCard, color: 'text-pink-600 bg-pink-50',
      phrases: [
        { cn: '可以刷卡嗎？', jp: 'クレジットカードは使えますか？', romaji: 'Kurejitto kādo wa tsukaemasu ka?' },
        { cn: '有免稅嗎？', jp: '免税はありますか？', romaji: 'Menzei wa arimasu ka?' },
        { cn: '(店員問) 需要袋子嗎？', jp: '袋は必要ですか？', romaji: 'Fukuro wa hitsuyō desu ka?', isQuestion: true },
        { cn: '沒關係，不用了。(拒絕)', jp: 'いえ、大丈夫です。', romaji: 'Ie, daijōbu desu.' },
        { cn: '好的，麻煩裝袋。(答應)', jp: 'はい、お願いします。', romaji: 'Hai, onegaishimasu.' },
      ]
    },
    {
      id: 'hotel', title: '飯店 / 寄放行李', icon: Hotel, color: 'text-blue-600 bg-blue-50',
      phrases: [
        { cn: '我是網路預約的。', jp: 'ネットで予約しました。', romaji: 'Netto de yoyaku shimashita.' },
        { cn: '麻煩幫我 Check-in。', jp: 'チェックイン、お願いします。', romaji: 'Chekku-in, onegaishimasu.' },
        { cn: '可以寄放行李嗎？(入住前/後)', jp: '荷物を預けてもいいですか？', romaji: 'Nimotsu o azukete mo ii desu ka?' },
        { cn: '可以麻煩保管行李嗎？', jp: '荷物を預かってもらえますか？', romaji: 'Nimotsu o azukatte moraemasu ka?' },
      ]
    },
    {
      id: 'survival', title: '生存萬用 (廁所/謝謝)', icon: HelpCircle, color: 'text-orange-600 bg-orange-50',
      phrases: [
        { cn: '不好意思...', jp: 'すみません...', romaji: 'Sumimasen...' },
        { cn: '廁所在哪裡？', jp: 'トイレはどこですか？', romaji: 'Toire wa doko desu ka?' },
        { cn: '謝謝', jp: 'ありがとうございます', romaji: 'Arigatō gozaimasu' },
        { cn: '聽不懂', jp: 'わかりません', romaji: 'Wakarimasen' },
      ]
    }
  ];

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert("您的瀏覽器不支援發音功能");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    // 嘗試多種方式抓取日語語音
    const jpVoice = voices.find(v => v.lang === 'ja-JP') || voices.find(v => v.lang.includes('ja'));
    if (jpVoice) {
      utterance.voice = jpVoice;
    }
    
    utterance.lang = 'ja-JP';
    utterance.rate = 1; 
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className={`bg-${n}-50 border border-${n}-200 rounded-xl p-5 mb-8 print:hidden`}>
      <h3 className={`text-lg font-bold text-${n}-800 mb-1 flex items-center gap-2`}>
        <div className="bg-indigo-100 p-1.5 rounded-md text-indigo-700">
          <Languages className="w-5 h-5" />
        </div>
        手指日語 (點擊發音)
      </h3>
      <p className={`text-xs text-${n}-400 mb-4 ml-1`}>🔊 沒聲音請檢查 iPhone 是否開了靜音模式</p>

      <div className="space-y-6">
        {categories.map((cat) => {
          const CatIcon = cat.icon;
          return (
            <div key={cat.id}>
              <h4 className={`text-sm font-bold mb-3 flex items-center gap-2 px-1 ${cat.color.split(' ')[0]}`}>
                <CatIcon className="w-4 h-4" />
                {cat.title}
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {cat.phrases.map((p, i) => (
                  <button 
                    key={i}
                    onClick={() => speak(p.jp)}
                    className={`flex items-center justify-between bg-white p-3 rounded-lg border shadow-sm hover:shadow-md active:scale-[0.98] transition-all text-left group
                      ${p.isQuestion ? 'border-amber-200 bg-amber-50/30' : `border-${n}-200 hover:border-red-200`}
                    `}
                  >
                    <div className="w-full">
                      <div className="flex justify-between items-start">
                        <div className={`text-sm font-bold mb-0.5 ${p.isQuestion ? 'text-amber-700' : `text-${n}-800`}`}>
                          {p.isQuestion && <span className="bg-amber-100 text-amber-700 text-[10px] px-1 rounded mr-1">聽</span>}
                          {p.cn}
                        </div>
                        <div className={`bg-${n}-50 p-1.5 rounded-full text-${n}-300 group-hover:text-red-500 group-hover:bg-red-50 transition-colors shrink-0 ml-2`}>
                           <Volume2 className="w-4 h-4" />
                        </div>
                      </div>
                      <div className={`text-xs text-${n}-500 font-mono mb-1 font-medium`}>{p.romaji}</div>
                      <div className={`text-sm text-${n}-700 font-medium`}>{p.jp}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};

// --- Reusable Layout Components ---

const DayHeader = ({ dayId, day, date, title, tags, accommodation, isEditing, onToggleEdit }: { dayId?: string, day: string, date: string, title: string, tags: string[], accommodation?: string, isEditing?: boolean, onToggleEdit?: () => void }) => {
  const { currentTheme } = useTheme();
  const p = currentTheme.primary;
  const n = currentTheme.neutral;
  const a = currentTheme.accent;

  return (
    <div className="mb-6 animate-fade-in print:mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <span className={`bg-${p}-700 text-white px-3 py-1 rounded-md font-bold text-lg shadow-sm whitespace-nowrap shrink-0 print:border print:border-red-700 print:text-red-700 print:bg-white`}>
            {day}
          </span>
          <h2 className={`text-2xl font-bold text-${n}-800 leading-tight`}>{title}</h2>
        </div>
        {onToggleEdit && (
          <button 
            onClick={onToggleEdit}
            className={`p-2 rounded-full transition-colors print:hidden ${isEditing ? `bg-${p}-100 text-${p}-600` : `text-${n}-400 hover:bg-${n}-100`}`}
            title="編輯行程"
          >
            {isEditing ? <Save className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
          </button>
        )}
      </div>
      <div className={`text-${n}-500 font-medium ml-1 mb-3 flex items-center gap-2`}>
        <CalendarClock className="w-4 h-4"/>
        {date}
      </div>

      {dayId && <WeatherWidget dayId={dayId} />}
      
      <div className={`flex flex-wrap gap-2 mb-4 text-sm text-${n}-600`}>
        {tags.map((tag, i) => (
          <span key={i} className={`bg-${n}-100 px-2.5 py-1 rounded-full border border-${n}-200 text-${n}-600 text-xs font-medium print:border-stone-300`}>{tag}</span>
        ))}
      </div>
      
      {accommodation && (
        <div className={`flex items-start gap-3 text-${n}-700 bg-${a}-50 p-3 rounded-lg border border-${a}-100 print:bg-white print:border-stone-300`}>
          <Hotel className={`w-5 h-5 text-${a}-600 mt-0.5 shrink-0 print:text-stone-800`} />
          <div className="flex flex-col">
            <span className={`text-xs text-${a}-600 font-bold uppercase print:text-stone-600`}>Accommodation</span>
            <span className="font-bold">{accommodation}</span>
          </div>
        </div>
      )}
      <hr className={`mt-6 border-${n}-100 print:border-stone-300`} />
    </div>
  );
};

interface ScheduleTableProps {
  items: ScheduleItem[];
  isEditing?: boolean;
  onMove?: (index: number, dir: 'up' | 'down') => void;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, item: Partial<ScheduleItem>) => void;
  onAdd?: () => void;
}

const ScheduleTable = ({ items, isEditing, onMove, onDelete, onUpdate, onAdd }: ScheduleTableProps) => {
  const { currentTheme } = useTheme();
  const p = currentTheme.primary;
  const n = currentTheme.neutral;
  const a = currentTheme.accent;
  
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="mb-8 relative print:mb-4 break-inside-avoid">
      <div className={`absolute left-[19px] top-2 bottom-2 w-0.5 bg-${n}-200 print:border-l print:border-stone-300 print:bg-transparent`}></div>
      <div className="space-y-6 print:space-y-4">
        {items.map((item, idx) => {
          if (editingId === item.id) {
            return (
              <div key={item.id} className="pl-10 mb-6">
                  <ScheduleItemForm 
                    initialData={item}
                    onSave={(updated) => {
                        onUpdate?.(item.id, updated);
                        setEditingId(null);
                    }}
                    onCancel={() => setEditingId(null)}
                  />
              </div>
            );
          }

          return (
            <div key={item.id} className={`relative pl-10 group ${item.highlight ? `bg-${a}-50/50 -mx-4 px-4 py-3 rounded-xl border border-${a}-100/50 pl-14 print:bg-white print:border-none print:px-0 print:mx-0 print:pl-10` : ""}`}>
              <div className={`absolute left-3 w-3 h-3 rounded-full border-2 border-white shadow-sm z-10 top-1.5 print:border-stone-500 print:shadow-none ${item.highlight ? `bg-${p}-500 left-7 print:left-3 print:bg-black` : `bg-${n}-300 print:bg-white`}`}></div>
              
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                <span className={`font-mono font-bold text-sm ${item.highlight ? `text-${p}-600 print:text-black` : `text-${n}-400 print:text-stone-600`}`}>{item.time}</span>
                <div className="flex items-center gap-2 flex-1">
                    {item.link ? (
                        <a href={item.link} target="_blank" rel="noreferrer" className={`font-bold text-base flex items-center gap-1 transition-colors hover:underline print:no-underline ${item.highlight ? 'text-blue-700 print:text-black' : 'text-blue-600 print:text-black'}`}>
                            {item.title}
                            <MapPin className="w-3.5 h-3.5 print:hidden" />
                        </a>
                    ) : (
                        <h3 className={`font-bold text-base ${item.highlight ? `text-${p}-900 print:text-black` : `text-${n}-800`}`}>{item.title}</h3>
                    )}
                </div>
                
                {/* Edit Controls */}
                {isEditing && (
                  <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                     <button onClick={() => setEditingId(item.id)} className={`p-1 hover:bg-${p}-100 text-${n}-400 hover:text-${p}-600 rounded`} title="編輯">
                        <Edit3 className="w-4 h-4" />
                     </button>
                     <button onClick={() => onMove && onMove(idx, 'up')} disabled={idx === 0} className={`p-1 hover:bg-${p}-100 text-${n}-400 hover:text-${p}-600 rounded`}>
                       <ArrowUp className="w-4 h-4" />
                     </button>
                     <button onClick={() => onMove && onMove(idx, 'down')} disabled={idx === items.length - 1} className={`p-1 hover:bg-${p}-100 text-${n}-400 hover:text-${p}-600 rounded`}>
                       <ArrowDown className="w-4 h-4" />
                     </button>
                     <button onClick={() => onDelete && onDelete(item.id)} className={`p-1 hover:bg-red-100 text-${n}-400 hover:text-red-600 rounded ml-1`}>
                       <Trash2 className="w-4 h-4" />
                     </button>
                  </div>
                )}
              </div>
              <div className={`text-sm text-${n}-600 mt-1 whitespace-pre-wrap leading-relaxed print:text-stone-800`}>{item.desc}</div>
            </div>
          );
        })}
      </div>
      
      {/* Add Button */}
      {isEditing && onAdd && (
         <div className="mt-4 pl-10">
            <button onClick={onAdd} className={`flex items-center gap-2 text-sm text-${p}-600 font-bold hover:bg-${p}-50 px-3 py-2 rounded-lg transition-colors border border-dashed border-${p}-200 w-full justify-center`}>
              <Plus className="w-4 h-4" /> 新增行程
            </button>
         </div>
      )}
    </div>
  );
};

const ScheduleItemForm = ({ initialData, onSave, onCancel }: { initialData?: ScheduleItem, onSave: (item: Omit<ScheduleItem, 'id'>) => void, onCancel: () => void }) => {
   const { currentTheme } = useTheme();
   const p = currentTheme.primary;
   const n = currentTheme.neutral;
   
   const [time, setTime] = useState(initialData?.time || '');
   const [title, setTitle] = useState(initialData?.title || '');
   const [desc, setDesc] = useState(initialData?.desc || '');
   const [link, setLink] = useState(initialData?.link || '');
   const [highlight, setHighlight] = useState(initialData?.highlight || false);

   const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     if (!time || !title) return;

     // Auto-generate Google Maps link if empty but title exists
     let finalLink = link;
     if (!finalLink && title) {
        finalLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(title)}`;
     }

     onSave({ time, title, desc, link: finalLink, highlight }); 
   };

   return (
     <form onSubmit={handleSubmit} className={`bg-${n}-50 p-4 rounded-xl border border-${n}-200 mb-6 animate-fade-in relative z-20 shadow-sm`}>
        <h4 className={`text-sm font-bold text-${n}-700 mb-3`}>{initialData ? '編輯行程' : '新增行程'}</h4>
        <div className="grid grid-cols-3 gap-3 mb-3">
           <div className="col-span-1">
              <label className="block text-xs font-bold text-gray-500 mb-1">時間</label>
              <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" required />
           </div>
           <div className="col-span-2">
              <label className="block text-xs font-bold text-gray-500 mb-1">標題</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="例: 吃午餐" required />
           </div>
        </div>
        <div className="mb-3">
           <label className="block text-xs font-bold text-gray-500 mb-1">連結 (Google Maps)</label>
           <input type="text" value={link} onChange={e => setLink(e.target.value)} className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="留空將自動產生搜尋連結" />
        </div>
        <div className="mb-3">
           <label className="block text-xs font-bold text-gray-500 mb-1">備註 / 描述</label>
           <textarea value={desc} onChange={e => setDesc(e.target.value)} className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm" rows={2} placeholder="詳細內容..." />
        </div>
        <div className="flex items-center gap-2 mb-4">
           <input type="checkbox" id="hl" checked={highlight} onChange={e => setHighlight(e.target.checked)} className="rounded text-blue-600" />
           <label htmlFor="hl" className="text-sm text-gray-600">標記為重要 (Highlight)</label>
        </div>
        <div className="flex gap-2">
           <button type="button" onClick={onCancel} className="flex-1 py-2 bg-white border border-gray-300 rounded-lg text-gray-600 text-sm font-bold hover:bg-gray-50">取消</button>
           <button type="submit" className={`flex-1 py-2 bg-${p}-600 text-white rounded-lg text-sm font-bold hover:bg-${p}-700`}>
             {initialData ? '儲存變更' : '新增'}
           </button>
        </div>
     </form>
   );
}

const SectionList = ({ title, icon: Icon, children }: { title: string, icon: any, children?: React.ReactNode }) => {
  const { currentTheme } = useTheme();
  const p = currentTheme.primary;
  const n = currentTheme.neutral;

  return (
    <div className="mb-8 print:mb-4 break-inside-avoid">
      <h3 className={`text-lg font-bold text-${n}-800 mb-4 flex items-center gap-2 pb-2 border-b border-${n}-100 print:border-stone-300 print:mb-2`}>
        <div className={`bg-${p}-50 p-1.5 rounded-md text-${p}-700 print:hidden`}>
          <Icon className="w-5 h-5" />
        </div>
        <Icon className="w-5 h-5 hidden print:block" />
        {title}
      </h3>
      <div className="space-y-4 print:space-y-2">
        {children}
      </div>
    </div>
  );
};

const ListItem = ({ title, desc, link, note }: { title: string, desc?: string, link?: string, note?: string }) => {
  const { currentTheme } = useTheme();
  const n = currentTheme.neutral;
  const a = currentTheme.accent;

  return (
    <div className={`flex flex-col gap-1 p-3 rounded-lg hover:bg-${n}-50 transition-colors border border-transparent hover:border-${n}-100 print:p-0 print:border-none break-inside-avoid`}>
      <div className="flex items-start justify-between gap-2">
        <div className={`font-bold text-${n}-800 flex items-center gap-2 text-sm`}>
          {title}
          {note && <span className={`text-[10px] bg-${a}-100 text-${a}-700 px-1.5 py-0.5 rounded border border-${a}-200 print:border-stone-400 print:bg-white print:text-black`}>{note}</span>}
        </div>
        {link && (
          <a href={link} target="_blank" rel="noreferrer" className="text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs font-medium hover:bg-blue-100 flex items-center gap-1 shrink-0 print:hidden">
            <MapPin className="w-3 h-3" /> 導航
          </a>
        )}
      </div>
      {desc && <div className={`text-sm text-${n}-500 leading-snug print:text-stone-700`}>{desc}</div>}
    </div>
  );
};

const InfoBox = ({ children }: { children?: React.ReactNode }) => {
  const { currentTheme } = useTheme();
  const n = currentTheme.neutral;
  const p = currentTheme.primary; // Use primary theme color instead of hardcoded blue

  return (
    <div className={`bg-${p}-50 border border-${p}-100 rounded-xl p-4 mb-8 text-sm text-${p}-900 shadow-sm print:bg-white print:border-stone-300 print:text-black break-inside-avoid`}>
      {children}
    </div>
  );
};

// --- New Interactive Checklist Component ---
const InteractiveChecklist = () => {
  const initialItems = [
    { id: 1, text: '護照 (效期6個月+)', checked: false },
    { id: 2, text: '身分證', checked: false },
    { id: 3, text: 'VJW QR Code', checked: false },
    { id: 4, text: '網卡/漫遊', checked: false },
    { id: 5, text: '日幣現金', checked: false },
    { id: 6, text: '信用卡 (2張)', checked: false },
    { id: 7, text: '好走的球鞋', checked: false },
    { id: 8, text: '行動電源', checked: false },
    { id: 9, text: '手機充電器 / 線', checked: false },
    { id: 10, text: '個人藥品', checked: false },
    { id: 11, text: '耳塞 (淺眠必備)', checked: false },
  ];

  const [items, setItems] = useState(initialItems);
  const { currentTheme } = useTheme();
  const n = currentTheme.neutral;
  const p = currentTheme.primary; // Use primary theme color

  const toggleItem = (id: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => toggleItem(item.id)}
          className={`flex items-center gap-2 text-sm p-2 rounded border transition-all text-left
            ${item.checked 
              ? `bg-${p}-100 border-${p}-200 text-${p}-800` 
              : `bg-white border-${p}-100 text-${n}-700 hover:bg-${p}-50`
            } print:border-stone-300`}
        >
          <div className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-colors
            ${item.checked ? `bg-${p}-500 border-${p}-500` : `border-${p}-300 bg-white`}
          `}>
            {item.checked && <Check className="w-3 h-3 text-white" />}
          </div>
          <span className={item.checked ? 'line-through opacity-70' : ''}>{item.text}</span>
        </button>
      ))}
    </div>
  );
};

// --- Content Components Wrapper ---

const DayContent = ({ 
  dayKey, 
  titleData, 
  tags, 
  accommodation, 
  scheduleItems, 
  children,
  topContent,
  db
}: { 
  dayKey: string, 
  titleData: { day: string, date: string, title: string },
  tags: string[],
  accommodation?: string,
  scheduleItems: ScheduleItem[],
  children?: React.ReactNode,
  topContent?: React.ReactNode,
  db: ReturnType<typeof useScheduleDatabase>
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <>
      <div className={dayKey === 'day1' ? 'print:hidden' : ''}>
         {/* Top Content (e.g., Weather Helper) - Placed BEFORE Header */}
         {topContent}
      </div>

      <DayHeader 
        dayId={dayKey}
        day={titleData.day} 
        date={titleData.date} 
        title={titleData.title} 
        tags={tags}
        accommodation={accommodation}
        isEditing={isEditing}
        onToggleEdit={() => setIsEditing(!isEditing)}
      />
      
      {dayKey === 'day1' && <CountdownWidget />}

      <ScheduleTable 
        items={scheduleItems} 
        isEditing={isEditing}
        onMove={(idx, dir) => db.moveItem(dayKey, idx, dir)}
        onDelete={(id) => db.deleteItem(dayKey, id)}
        onUpdate={(id, updates) => db.updateItem(dayKey, id, updates)}
        onAdd={() => setShowAddForm(true)}
      />

      {showAddForm && (
        <ScheduleItemForm 
          onSave={(item) => {
            db.addItem(dayKey, item);
            setShowAddForm(false);
          }} 
          onCancel={() => setShowAddForm(false)} 
        />
      )}

      {children}
    </>
  );
}


// --- Main Document Component ---

export default function ItineraryDocument({ activeTab, printOptions }: { activeTab: string, printOptions?: { selectedDays: string[] } }) {
  const db = useScheduleDatabase();
  const { currentTheme } = useTheme();

  // Helper to determine if a section should be visible
  const isVisible = (dayId: string) => {
    const isActive = activeTab === dayId;
    const isSelectedForPrint = printOptions?.selectedDays.includes(dayId);
    return `${isActive ? 'block' : 'hidden'} ${isSelectedForPrint ? 'print:block' : 'print:hidden'}`;
  };

  if (!db.isLoaded) return <div className="p-8 text-center text-gray-500">Loading schedule...</div>;

  return (
    <div>
      {/* Day 1 */}
      <div className={isVisible('day1')}>
        <DayContent 
          dayKey="day1"
          titleData={{ day: "DAY 1", date: "11/29 (五)", title: "啟程・前往京都" }}
          tags={['移動日', 'Haruka 特急', '清水寺住宿']}
          accommodation="RESI STAY 五条坂 (清水寺山腳)"
          scheduleItems={db.schedule.day1 || []}
          db={db}
          topContent={
            <InfoBox>
              <h4 className="font-bold mb-2 flex items-center gap-2 opacity-90 print:text-black"><AlertCircle className="w-4 h-4"/> 旅遊小幫手</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CloudSun className="w-4 h-4 opacity-75 print:text-black"/>
                  <a href="https://tenki.jp/forecast/6/29/6110/26100/" target="_blank" rel="noreferrer" className="underline hover:opacity-75 print:text-black print:no-underline">查看京都一週天氣</a>
                </li>
                <li className="flex items-start gap-2">
                  <CheckSquare className="w-4 h-4 opacity-75 mt-0.5 print:text-black"/>
                  <span>請務必將 <a href="https://www.vjw.digital.go.jp/" target="_blank" rel="noreferrer" className="font-bold underline hover:text-blue-600 print:text-black print:no-underline">VJW QR Code</a> 截圖，並隨身攜帶護照。</span>
                </li>
              </ul>
            </InfoBox>
          }
        >
          <SectionList title="晚餐與補給 (步行 3~5 分)" icon={Utensils}>
            <ListItem title="Negibouzu (蔥坊主)" desc="鐵板料理、御好燒 (~22:00)" link="https://www.google.com/maps/search/?api=1&query=Negibouzu+Kyoto" />
            <ListItem title="Mon Chan" desc="日式料理、居酒屋 (營業時間不一定)" link="https://www.google.com/maps/search/?api=1&query=Mon+Chan+Kyoto" />
            <ListItem title="Gion Negiyaki Kana East" desc="深夜選擇，蔥燒/大阪燒 (~02:00)" link="https://www.google.com/maps/search/?api=1&query=Gion+Negiyaki+Kana+East" note="推" />
          </SectionList>
          <SectionList title="超商超市" icon={ShoppingBag}>
            <ListItem title="FRESCO 超市" desc="24H，補給水、水果推薦" link="https://www.google.com/maps/search/?api=1&query=FRESCO+Supermarket+Kyoto" />
            <ListItem title="Lawson" link="https://www.google.com/maps/search/?api=1&query=Lawson+Kyoto" />
            <ListItem title="7-11" link="https://www.google.com/maps/search/?api=1&query=7-Eleven+Kyoto" />
            <ListItem title="全家 FamilyMart" link="https://www.google.com/maps/search/?api=1&query=FamilyMart+Kyoto" />
          </SectionList>
        </DayContent>
        <div className="break-after-page"></div>
      </div>

      {/* Day 2 */}
      <div className={isVisible('day2')}>
        <DayContent
          dayKey="day2"
          titleData={{ day: "DAY 2", date: "11/30 (六)", title: "京都：清水寺 & 祇園" }}
          tags={['早起避人潮', '千年古都', '錦市場']}
          accommodation="RESI STAY 五条坂"
          scheduleItems={db.schedule.day2 || []}
          db={db}
        >
          <SectionList title="上午：甜點與伴手禮 (清水坂)" icon={ShoppingBag}>
            <ListItem title="本家 西尾八橋" desc="08:30~，試吃很大方" link="https://www.google.com/maps/search/?api=1&query=Honke+Nishio+Yatsuhashi" />
            <ListItem title="MALEBRANCHE 京都北山" desc="09:00~，必買茶之菓" link="https://www.google.com/maps/search/?api=1&query=MALEBRANCHE+Kiyomizuzaka" />
            <ListItem title="Kyo-Baum" desc="10:00~，抹茶年輪蛋糕" link="https://www.google.com/maps/search/?api=1&query=Kyo-Baum+Kiyomizuzaka" />
            <ListItem title="藤菜美 三年坂本店" desc="10:00~，醬油糰子" link="https://www.google.com/maps/search/?api=1&query=Fujinami+Sannenzaka" />
            <ListItem title="GOKAGO" desc="10:30~，現刷抹茶飲品" link="https://www.google.com/maps/search/?api=1&query=GOKAGO+Kyoto" />
          </SectionList>
          <SectionList title="午餐口袋名單" icon={Utensils}>
            <ListItem title="La Curry" desc="11:00~14:30，咖哩" link="https://www.google.com/maps/search/?api=1&query=La+Curry+Kyoto" />
            <ListItem title="麵屋 豬一" desc="11:00~14:30，米其林推薦拉麵 (需排隊)" link="https://www.google.com/maps/search/?api=1&query=Menya+Inoichi" />
            <ListItem title="有喜屋 先斗町本店" desc="11:30~15:00，天婦羅/蕎麥" link="https://www.google.com/maps/search/?api=1&query=Ukiya+Pontocho" />
            <ListItem title="Ajisai no Toyo" desc="11:00~15:00，鰻魚飯" link="https://www.google.com/maps/search/?api=1&query=Ajisai+no+Toyo" />
            <ListItem title="Sukiyaki Kimura" desc="12:00~20:30，壽喜燒" link="https://www.google.com/maps/search/?api=1&query=Sukiyaki+Kimura" />
            <ListItem title="Makino 天丼" desc="11:00~20:30，現炸大碗滿意" link="https://www.google.com/maps/search/?api=1&query=Makino+Tendon+Kyoto" />
          </SectionList>
          <SectionList title="晚餐口袋名單" icon={Utensils}>
              <ListItem title="Tsukumo烏龍 鹽小路本店" link="https://www.google.com/maps/search/?api=1&query=Tsukumo+Udon+Shiokoji" />
              <ListItem title="Gion Negiyaki Kana - East" desc="大阪燒" link="https://www.google.com/maps/search/?api=1&query=Gion+Negiyaki+Kana+East" />
          </SectionList>
        </DayContent>
        <div className="break-after-page"></div>
      </div>

      {/* Day 3 */}
      <div className={isVisible('day3')}>
        <DayContent
          dayKey="day3"
          titleData={{ day: "DAY 3", date: "12/01 (日)", title: "嵐山・teamLab・移動至大阪" }}
          tags={['竹林小徑', '搬家到大阪', '道頓堀']}
          accommodation="The OneFive Osaka Namba"
          scheduleItems={db.schedule.day3 || []}
          db={db}
        >
          <SectionList title="嵐山午餐口袋名單" icon={Utensils}>
            <ListItem title="亀山家 (Kameyamya)" desc="11:30~，天婦羅丼飯、蕎麥麵" link="https://www.google.com/maps/search/?api=1&query=Kameyamya+Arashiyama" />
            <ListItem title="嵐山 喜重郎 (Kijurou)" desc="11:00~，和牛牛排重" link="https://www.google.com/maps/search/?api=1&query=Arashiyama+Kijuro" note="推" />
          </SectionList>
          <SectionList title="嵐山小吃與名店" icon={Coffee}>
            <ListItem title="京豆庵" desc="倒立不掉豆腐冰淇淋" link="https://www.google.com/maps/search/?api=1&query=Kyozuan+Arashiyama" />
            <ListItem title="古都芋本舗" desc="大玉炙燒醬油糰子" link="https://www.google.com/maps/search/?api=1&query=Kotoimo+Honpo+Arashiyama" />
            <ListItem title="Mamemono to Taiyaki" desc="賞味期限一分鐘鯛魚燒" link="https://www.google.com/maps/search/?api=1&query=Mamemono+to+Taiyaki+Arashiyama" />
            <ListItem title="MALEBRANCHE 嵐山" desc="茶茶棒" link="https://www.google.com/maps/search/?api=1&query=MALEBRANCHE+Arashiyama" />
            <ListItem title="雲ノ茶 (Kumonocha)" desc="雲朵慕斯蛋糕" link="https://www.google.com/maps/search/?api=1&query=Kumonocha+Cafe+Arashiyama" />
            <ListItem title="金之華" desc="現擠蒙布朗" link="https://www.google.com/maps/search/?api=1&query=Kin-no-Hana+Arashiyama" />
          </SectionList>
          <SectionList title="大阪晚餐口袋名單 (難波)" icon={Utensils}>
            <ListItem title="やさい串巻き なるとや" desc="蔬菜肉捲串燒" link="https://www.google.com/maps/search/?api=1&query=Yasaikushimaki+Narutoya+Namba" />
            <ListItem title="福太郎 本店" desc="大阪燒 (蔥燒)" link="https://www.google.com/maps/search/?api=1&query=Fukutaro+Honten+Osaka" />
            <ListItem title="牛たん炭火焼 吉次" desc="厚切牛舌" link="https://www.google.com/maps/search/?api=1&query=Gyutan+Yoshiji+Shinsaibashi" />
            <ListItem title="無限ラーメン" desc="濃郁拉麵" link="https://www.google.com/maps/search/?api=1&query=Mugen+Ramen+Sennichimae" />
          </SectionList>
        </DayContent>
        <div className="break-after-page"></div>
      </div>

      {/* Day 4 */}
      <div className={isVisible('day4')}>
         <DayContent
          dayKey="day4"
          titleData={{ day: "DAY 4", date: "12/02 (一)", title: "箕面勝尾寺・梅田購物・夜景" }}
          tags={['勝尾寺達摩', '箕面瀑布', '百貨公司']}
          accommodation="The OneFive Osaka Namba"
          scheduleItems={db.schedule.day4 || []}
          db={db}
        >
          <SectionList title="梅田 & 天滿 午餐推薦" icon={Utensils}>
            <ListItem title="宇奈とと 南森町店" desc="平價鰻魚飯" link="https://www.google.com/maps/search/?api=1&query=Unatoto+Minamimorimachi" />
            <ListItem title="お好み焼き 千草" desc="老牌大阪燒" link="https://www.google.com/maps/search/?api=1&query=Okonomiyaki+Chigusa+Tenma" />
            <ListItem title="Rojiura Curry SAMURAI" desc="濃郁湯咖哩 (Grand Front)" link="https://www.google.com/maps/search/?api=1&query=Rojiura+Curry+Samurai+Grand+Front+Osaka" />
            <ListItem title="Unagi Kushiyaki Izumo" desc="巨無霸鰻魚玉子燒 (LUCUA)" link="https://www.google.com/maps/search/?api=1&query=Unagi+Kushiyaki+Izumo+Lucua" />
          </SectionList>
          <SectionList title="難波 & 心齋橋 晚餐推薦" icon={Utensils}>
            <ListItem title="新宿焼肉 牛たんの檸檬" desc="厚切牛舌 (21:00~)" link="https://www.google.com/maps/search/?api=1&query=Shinjuku+Yakiniku+Gyutan+no+Lemon+Osaka" />
            <ListItem title="千代松勝蓋飯" desc="5cm厚切豬排丼 (21:30~)" link="https://www.google.com/maps/search/?api=1&query=Chiyomatsu+Katsudon+Osaka" />
            <ListItem title="炭火焼き鳥 鴨尽" desc="鴨肉料理" link="https://www.google.com/maps/search/?api=1&query=Kamojin+Yakitori+Osaka" />
          </SectionList>
        </DayContent>
        <div className="break-after-page"></div>
      </div>

      {/* Day 5 */}
      <div className={isVisible('day5')}>
         <DayContent
          dayKey="day5"
          titleData={{ day: "DAY 5", date: "12/03 (二)", title: "大阪 → 溫暖的家" }}
          tags={['大阪城', '黑門市場', '搭機返台']}
          scheduleItems={db.schedule.day5 || []}
          db={db}
        />
        <div className="break-after-page"></div>
      </div>

      {/* Tools */}
      <div className={isVisible('tools')}>
        <DayHeader 
          day="TOOLS" 
          date="實用工具" 
          title="匯率 / 日語 / 救援" 
          tags={['血拼神器', '生存日語', '緊急電話']}
        />
        <ExchangeRateWidget />
        <MenuTranslator />
        <JapanesePhraseWidget />
        <InfoBox>
          <div className="flex justify-between items-center mb-3">
             <h4 className="font-bold flex items-center gap-2 opacity-90 print:text-black"><CheckSquare className="w-4 h-4"/> 必備物品檢查表</h4>
             <button onClick={db.resetToDefault} className={`text-xs flex items-center gap-1 text-${currentTheme.neutral}-400 hover:text-red-500`}>
               <RotateCcw className="w-3 h-3" /> 重置行程
             </button>
          </div>
          <InteractiveChecklist />
        </InfoBox>
        <EmergencyWidget />
      </div>
    </div>
  );
}