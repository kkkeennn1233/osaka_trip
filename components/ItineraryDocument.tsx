import React, { useState, useEffect } from 'react';
import { MapPin, Utensils, ShoppingBag, Hotel, AlertCircle, CheckSquare, CloudSun, CalendarClock, Sun, Cloud, ThermometerSun, Umbrella, Wind, Calculator, Languages, Volume2, RefreshCw, ShoppingCart, Train, Shirt, CreditCard, HelpCircle, Coffee, Camera, Sunset, Moon, Gift, Home, Plane, Ticket, Trees, Mountain } from 'lucide-react';

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
  if (!data) return null;

  const Icon = data.icon;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 border border-blue-100 rounded-xl p-3 mb-5 flex items-center justify-between shadow-sm animate-fade-in print:border-stone-300 print:bg-none print:shadow-none">
      <div className="flex items-center gap-3">
        <div className="bg-white p-2 rounded-full shadow-sm text-amber-500 print:hidden">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-stone-800">{data.loc}</span>
            <span className="text-xs text-stone-500 font-medium print:text-stone-600">{data.condition}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-bold text-stone-800">{data.tempHigh}°</span>
            <span className="text-stone-400">/</span>
            <span className="text-stone-600">{data.tempLow}°C</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col items-end gap-1 text-xs text-stone-600">
        <div className="flex items-center gap-1 bg-white/60 px-2 py-0.5 rounded-full print:bg-transparent">
          <Umbrella className="w-3 h-3 text-blue-500 print:text-stone-800" />
          <span>{data.precip}%</span>
        </div>
        <div className="flex items-center gap-1 bg-white/60 px-2 py-0.5 rounded-full print:bg-transparent">
          <Wind className="w-3 h-3 text-stone-400 print:text-stone-800" />
          <span>{data.note}</span>
        </div>
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

  const fetchRate = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/JPY');
      const data = await response.json();
      if (data && data.rates && data.rates.TWD) {
        // Add a small spread to simulate cash selling rate (approx 1.5% - 2%)
        const estimatedCashRate = Number((data.rates.TWD * 1.018).toFixed(4));
        setRate(estimatedCashRate);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (error) {
      console.error("Failed to fetch rate", error);
      alert("無法取得即時匯率，將使用預設值");
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
    <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 mb-8 print:hidden">
      <h3 className="text-lg font-bold text-stone-800 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-green-100 p-1.5 rounded-md text-green-700">
            <Calculator className="w-5 h-5" />
          </div>
          匯率計算機
        </div>
        <button 
          onClick={fetchRate} 
          disabled={loading}
          className="text-xs bg-white border border-stone-200 px-2 py-1 rounded-full flex items-center gap-1 text-stone-500 hover:text-green-600 active:scale-95 transition-all"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          {loading ? '更新中...' : '更新匯率'}
        </button>
      </h3>
      
      <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-stone-200 mb-3 shadow-sm focus-within:ring-2 focus-within:ring-green-500/20 focus-within:border-green-500 transition-all">
        <span className="font-bold text-stone-500 text-sm">JPY ¥</span>
        <input type="number" value={jpy} onChange={handleJpyChange} placeholder="輸入日幣" className="text-right font-mono text-xl font-bold text-stone-800 outline-none w-full ml-4 bg-transparent" />
      </div>

      <div className="flex justify-center -my-3 z-10 relative">
        <div className="bg-stone-100 rounded-full p-1.5 border border-stone-200">
          <RefreshCw className="w-4 h-4 text-stone-400" />
        </div>
      </div>

      <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-stone-200 mt-0 shadow-sm focus-within:ring-2 focus-within:ring-green-500/20 focus-within:border-green-500 transition-all">
        <span className="font-bold text-stone-500 text-sm">TWD $</span>
        <input type="number" value={twd} onChange={handleTwdChange} placeholder="輸入台幣" className="text-right font-mono text-xl font-bold text-stone-800 outline-none w-full ml-4 bg-transparent" />
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-stone-400 px-1">
        <span>{lastUpdated ? `更新於: ${lastUpdated}` : '台灣銀行現金賣出估算'}</span>
        <div className="flex items-center gap-2">
          <span>匯率:</span>
          <input type="number" value={rate} step="0.001" onChange={(e) => setRate(Number(e.target.value))} className="w-16 bg-stone-100 rounded px-1 py-0.5 text-right border border-stone-200 text-stone-600" />
        </div>
      </div>
    </div>
  );
};

const JapanesePhraseWidget = () => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

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
    const jpVoice = voices.find(v => v.lang === 'ja-JP') || voices.find(v => v.lang.includes('ja'));
    if (jpVoice) utterance.voice = jpVoice;
    utterance.lang = 'ja-JP';
    utterance.rate = 1; 
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 mb-8 print:hidden">
      <h3 className="text-lg font-bold text-stone-800 mb-1 flex items-center gap-2">
        <div className="bg-indigo-100 p-1.5 rounded-md text-indigo-700">
          <Languages className="w-5 h-5" />
        </div>
        手指日語 (點擊發音)
      </h3>
      <p className="text-xs text-stone-400 mb-4 ml-1">🔊 沒聲音請檢查 iPhone 是否開了靜音模式</p>

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
                      ${p.isQuestion ? 'border-amber-200 bg-amber-50/30' : 'border-stone-200 hover:border-red-200'}
                    `}
                  >
                    <div className="w-full">
                      <div className="flex justify-between items-start">
                        <div className={`text-sm font-bold mb-0.5 ${p.isQuestion ? 'text-amber-700' : 'text-stone-800'}`}>
                          {p.isQuestion && <span className="bg-amber-100 text-amber-700 text-[10px] px-1 rounded mr-1">聽</span>}
                          {p.cn}
                        </div>
                        <div className="bg-stone-50 p-1.5 rounded-full text-stone-300 group-hover:text-red-500 group-hover:bg-red-50 transition-colors shrink-0 ml-2">
                           <Volume2 className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="text-xs text-stone-500 font-mono mb-1 font-medium">{p.romaji}</div>
                      <div className="text-sm text-stone-700 font-medium">{p.jp}</div>
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

const DayHeader = ({ dayId, day, date, title, tags, accommodation }: { dayId?: string, day: string, date: string, title: string, tags: string[], accommodation?: string }) => (
  <div className="mb-6 animate-fade-in print:mb-4">
    <div className="flex items-center gap-3 mb-2">
      <span className="bg-red-700 text-white px-3 py-1 rounded-md font-bold text-lg shadow-sm whitespace-nowrap shrink-0 print:border print:border-red-700 print:text-red-700 print:bg-white">
        {day}
      </span>
      <h2 className="text-2xl font-bold text-stone-800 leading-tight">{title}</h2>
    </div>
    <div className="text-stone-500 font-medium ml-1 mb-3 flex items-center gap-2">
      <CalendarClock className="w-4 h-4"/>
      {date}
    </div>

    {dayId && <WeatherWidget dayId={dayId} />}
    
    <div className="flex flex-wrap gap-2 mb-4 text-sm text-stone-600">
      {tags.map((tag, i) => (
        <span key={i} className="bg-stone-100 px-2.5 py-1 rounded-full border border-stone-200 text-stone-600 text-xs font-medium print:border-stone-300">{tag}</span>
      ))}
    </div>
    
    {accommodation && (
      <div className="flex items-start gap-3 text-stone-700 bg-orange-50 p-3 rounded-lg border border-orange-100 print:bg-white print:border-stone-300">
        <Hotel className="w-5 h-5 text-orange-600 mt-0.5 shrink-0 print:text-stone-800" />
        <div className="flex flex-col">
          <span className="text-xs text-orange-600 font-bold uppercase print:text-stone-600">Accommodation</span>
          <span className="font-bold">{accommodation}</span>
        </div>
      </div>
    )}
    <hr className="mt-6 border-stone-100 print:border-stone-300" />
  </div>
);

const ScheduleTable = ({ items }: { items: { time: string, title: string, desc: React.ReactNode, highlight?: boolean, link?: string }[] }) => (
  <div className="mb-8 relative print:mb-4">
    <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-stone-200 print:border-l print:border-stone-300 print:bg-transparent"></div>
    <div className="space-y-6 print:space-y-4">
      {items.map((item, idx) => (
        <div key={idx} className={`relative pl-10 ${item.highlight ? "bg-orange-50/50 -mx-4 px-4 py-3 rounded-xl border border-orange-100/50 pl-14 print:bg-white print:border-none print:px-0 print:mx-0 print:pl-10" : ""}`}>
          <div className={`absolute left-3 w-3 h-3 rounded-full border-2 border-white shadow-sm z-10 top-1.5 print:border-stone-500 print:shadow-none ${item.highlight ? 'bg-red-500 left-7 print:left-3 print:bg-black' : 'bg-stone-300 print:bg-white'}`}></div>
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
            <span className={`font-mono font-bold text-sm ${item.highlight ? 'text-red-600 print:text-black' : 'text-stone-400 print:text-stone-600'}`}>{item.time}</span>
            <div className="flex items-center gap-2">
                {item.link ? (
                    <a href={item.link} target="_blank" rel="noreferrer" className={`font-bold text-base flex items-center gap-1 transition-colors hover:underline print:no-underline ${item.highlight ? 'text-blue-700 print:text-black' : 'text-blue-600 print:text-black'}`}>
                        {item.title}
                        <MapPin className="w-3.5 h-3.5 print:hidden" />
                    </a>
                ) : (
                    <h3 className={`font-bold text-base ${item.highlight ? 'text-red-900 print:text-black' : 'text-stone-800'}`}>{item.title}</h3>
                )}
            </div>
          </div>
          <div className="text-sm text-stone-600 mt-1 whitespace-pre-wrap leading-relaxed print:text-stone-800">{item.desc}</div>
        </div>
      ))}
    </div>
  </div>
);

const SectionList = ({ title, icon: Icon, children }: { title: string, icon: any, children?: React.ReactNode }) => (
  <div className="mb-8 print:mb-4 break-inside-avoid">
    <h3 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2 pb-2 border-b border-stone-100 print:border-stone-300 print:mb-2">
      <div className="bg-red-50 p-1.5 rounded-md text-red-700 print:hidden">
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

const ListItem = ({ title, desc, link, note }: { title: string, desc?: string, link?: string, note?: string }) => (
  <div className="flex flex-col gap-1 p-3 rounded-lg hover:bg-stone-50 transition-colors border border-transparent hover:border-stone-100 print:p-0 print:border-none">
    <div className="flex items-start justify-between gap-2">
      <div className="font-bold text-stone-800 flex items-center gap-2 text-sm">
        {title}
        {note && <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded border border-orange-200 print:border-stone-400 print:bg-white print:text-black">{note}</span>}
      </div>
      {link && (
        <a href={link} target="_blank" rel="noreferrer" className="text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs font-medium hover:bg-blue-100 flex items-center gap-1 shrink-0 print:hidden">
          <MapPin className="w-3 h-3" /> 導航
        </a>
      )}
    </div>
    {desc && <div className="text-sm text-stone-500 leading-snug print:text-stone-700">{desc}</div>}
  </div>
);

const InfoBox = ({ children }: { children?: React.ReactNode }) => (
  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 text-sm text-blue-900 shadow-sm print:bg-white print:border-stone-300 print:text-black">
    {children}
  </div>
);

// --- Content Components ---

const Day1Content = () => (
  <>
    <DayHeader 
      dayId="day1"
      day="DAY 1" 
      date="11/29 (五)" 
      title="啟程・前往京都" 
      tags={['移動日', 'Haruka 特急', '清水寺住宿']}
      accommodation="RESI STAY 五条坂 (清水寺山腳)"
    />
    <InfoBox>
      <h4 className="font-bold mb-2 flex items-center gap-2 text-blue-800 print:text-black"><AlertCircle className="w-4 h-4"/> 旅遊小幫手</h4>
      <ul className="space-y-2">
        <li className="flex items-center gap-2">
          <CloudSun className="w-4 h-4 text-blue-500 print:text-black"/>
          <a href="https://tenki.jp/forecast/6/29/6110/26100/" target="_blank" rel="noreferrer" className="underline hover:text-blue-600 print:text-black print:no-underline">查看京都一週天氣</a>
        </li>
        <li className="flex items-start gap-2">
          <CheckSquare className="w-4 h-4 text-blue-500 mt-0.5 print:text-black"/>
          <span>請務必將 <strong>VJW QR Code</strong> 截圖，並隨身攜帶護照。</span>
        </li>
      </ul>
    </InfoBox>
    <ScheduleTable items={[
      { time: '09:20', title: '🏠 HOME', desc: '出發前往高鐵站' },
      { time: '10:00', title: '🚅 台中高鐵站', desc: '搭乘高鐵前往桃園' },
      { time: '10:30', title: '🚄 桃園高鐵站', desc: '轉機捷 (10:47 或 11:02 發車)' },
      { time: '12:10', title: '🛫 桃園機場 T1', desc: '虎航櫃檯報到 (7號櫃檯)\n先去晃晃再進候機室', link: 'https://www.google.com/maps/search/?api=1&query=Taoyuan+Airport+Terminal+1' },
      { time: '14:40', title: '✈️ 起飛 (IT212)', desc: '台北 TPE → 大阪 KIX', highlight: true },
      { time: '17:55', title: '🛬 抵達關西機場', desc: '準備 VJW 截圖、護照\n預留入境審查時間', link: 'https://www.google.com/maps/search/?api=1&query=Kansai+International+Airport' },
      { time: '19:30', title: '🚆 Haruka 特急', desc: '前往京都車站\n⚠️ 用 Klook 憑證兌換實體票', highlight: true },
      { time: '21:00', title: '🚕 移動至飯店', desc: '京都車站 → RESI STAY\n建議搭 Uber 或計程車', link: 'https://www.google.com/maps/search/?api=1&query=RESI+STAY+Gojozaka' },
      { time: '21:15', title: '🍜 晚餐 / 補給', desc: '飯店附近覓食' },
      { time: '23:00', title: '💤 休息睡覺', desc: '⚠️ 明天要超級早起，請早睡！' },
    ]} />
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
  </>
);

const Day2Content = () => (
  <>
    <DayHeader 
      dayId="day2"
      day="DAY 2" 
      date="11/30 (六)" 
      title="京都：清水寺 & 祇園" 
      tags={['早起避人潮', '千年古都', '錦市場']}
      accommodation="RESI STAY 五条坂"
    />
    <ScheduleTable items={[
      { time: '05:30', title: '⏰ 起床梳洗', desc: '痛苦一下，照片會很美！' },
      { time: '06:00', title: '📸 二三年坂 & 清水寺', desc: '抵達後右轉，享受寧靜', highlight: true, link: 'https://www.google.com/maps/search/?api=1&query=Kiyomizu-dera' },
      { time: '07:50', title: '☕ 二年坂星巴克', desc: '拍復古外觀，喝杯草莓限定星冰樂', link: 'https://www.google.com/maps/search/?api=1&query=Starbucks+Coffee+Kyoto+Ninenzaka+Yasaka+Chaya' },
      { time: '09:30', title: '🍡 清水坂', desc: '商店陸續開門，邊走邊吃', link: 'https://www.google.com/maps/search/?api=1&query=Kiyomizu-zaka' },
      { time: '10:30', title: '⛩️ 八坂神社 & 花見小路', desc: '沿路下坡散步，輕鬆逛', link: 'https://www.google.com/maps/search/?api=1&query=Yasaka+Shrine' },
      { time: '11:30', title: '🦆 祇園白川 & 鴨川', desc: '京都最美的散步路徑', link: 'https://www.google.com/maps/search/?api=1&query=Gion+Shirakawa' },
      { time: '12:30', title: '🍤 午餐時間', desc: '⚠️ 週末熱門時段可能需排隊' },
      { time: '13:30', title: '🛍️ 錦市場 & 新京極', desc: '逛街、買伴手禮、吃小吃', link: 'https://www.google.com/maps/search/?api=1&query=Nishiki+Market' },
      { time: '16:00', title: '🦊 伏見稻荷大社', desc: '千本鳥居 (傍晚氣氛神秘)', link: 'https://www.google.com/maps/search/?api=1&query=Fushimi+Inari+Taisha' },
      { time: '17:30', title: '🎁 京都車站', desc: '伴手禮採購 / 站前地下街', link: 'https://www.google.com/maps/search/?api=1&query=Kyoto+Station' },
      { time: '18:30', title: '🍁 夜楓', desc: '清水寺 或 東寺 夜間拜觀', link: 'https://www.google.com/maps/search/?api=1&query=Kiyomizu-dera+Night+Viewing' },
      { time: '20:00', title: '🥢 晚餐', desc: '視參觀地點決定' },
    ]} />
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
  </>
);

const Day3Content = () => (
  <>
    <DayHeader 
      dayId="day3"
      day="DAY 3" 
      date="12/01 (日)" 
      title="嵐山・teamLab・移動至大阪" 
      tags={['竹林小徑', '搬家到大阪', '道頓堀']}
      accommodation="The OneFive Osaka Namba"
    />
    <ScheduleTable items={[
      { time: '06:30', title: '👋 退房出發', desc: '搭計程車前往京都車站寄放行李', link: 'https://www.google.com/maps/search/?api=1&query=Kyoto+Station' },
      { time: '08:00', title: '🎋 嵐山', desc: '搭車去愛宕念佛寺 (避開人潮)', link: 'https://www.google.com/maps/search/?api=1&query=Otagi+Nenbutsu-ji' },
      { time: '11:00', title: '🍱 嵐山午餐', desc: '推薦喜重郎或亀山家', highlight: true },
      { time: '14:00', title: '🎨 teamLab Biovortex', desc: '京都最新開幕！沈浸式藝術體驗 (需預約)', link: 'https://www.google.com/maps/search/?api=1&query=teamLab+Biovortex+Kyoto' },
      { time: '15:30', title: '🛍️ 京都車站', desc: 'JR前往難波 & 領行李 & 最後採購', link: 'https://www.google.com/maps/search/?api=1&query=Kyoto+Station' },
      { time: '17:00', title: '🚆 前往難波', desc: '入住 The OneFive Osaka Namba', link: 'https://www.google.com/maps/search/?api=1&query=The+OneFive+Osaka+Namba' },
      { time: '19:00', title: '🦀 道頓堀 & 心齋橋', desc: '跑跑人看板合照、晚餐、逛藥妝', link: 'https://www.google.com/maps/search/?api=1&query=Dotonbori' },
    ]} />
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
  </>
);

const Day4Content = () => (
  <>
    <DayHeader 
      dayId="day4"
      day="DAY 4" 
      date="12/02 (一)" 
      title="箕面勝尾寺・梅田購物・夜景" 
      tags={['勝尾寺達摩', '箕面瀑布', '百貨公司']}
      accommodation="The OneFive Osaka Namba"
    />
    <ScheduleTable items={[
      { time: '06:30', title: '🚇 出發前往箕面萱野', desc: '難波 → 梅田 → 箕面萱野 → 計程車', link: 'https://www.google.com/maps/search/?api=1&query=Minoh-Kayano+Station' },
      { time: '08:00', title: '👹 勝尾寺 (達摩寺)', desc: '滿山滿谷的小達摩，必拍！', highlight: true, link: 'https://www.google.com/maps/search/?api=1&query=Katsuo-ji' },
      { time: '10:30', title: '🚕 前往 箕面瀑布', desc: '走路下山吸芬多精', link: 'https://www.google.com/maps/search/?api=1&query=Minoh+Waterfall' },
      { time: '13:00', title: '🏙️ 返回梅田市區午餐', desc: 'Grand Front 或 LUCUA 百貨', link: 'https://www.google.com/maps/search/?api=1&query=Grand+Front+Osaka' },
      { time: '15:00', title: '🛍️ 梅田商圈 / 天滿', desc: '購物迷宮 (天滿有小吃)', link: 'https://www.google.com/maps/search/?api=1&query=Umeda+Shopping+District' },
      { time: '17:30', title: '🎄 梅田聖誕市集', desc: 'Grand Front、梅田藍天大廈', link: 'https://www.google.com/maps/search/?api=1&query=Umeda+Sky+Building' },
      { time: '18:30', title: '🌃 WowUs (ワオアス)', desc: '大阪地標絕美夜景', link: 'https://www.google.com/maps/search/?api=1&query=Grand+Front+Osaka+South+Building' },
      { time: '19:30', title: '🏯 回 難波', desc: '晚餐、超市、唐吉訶德', link: 'https://www.google.com/maps/search/?api=1&query=Namba+Station' },
    ]} />
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
  </>
);

const Day5Content = () => (
  <>
    <DayHeader 
      dayId="day5"
      day="DAY 5" 
      date="12/03 (二)" 
      title="大阪 → 溫暖的家" 
      tags={['大阪城', '黑門市場', '搭機返台']}
    />
    <ScheduleTable items={[
      { time: '08:00', title: '🍳 起床吃早餐', desc: '超商 or 麥當勞', link: 'https://www.google.com/maps/search/?api=1&query=McDonalds' },
      { time: '09:00', title: '🏯 大阪城公園', desc: '搭電車到 大阪商務園區站', link: 'https://www.google.com/maps/search/?api=1&query=Osaka+Castle+Park' },
      { time: '11:00', title: '🍣 黑門市場 午餐', desc: '狂吃和牛、生魚片、烤扇貝', highlight: true, link: 'https://www.google.com/maps/search/?api=1&query=Kuromon+Ichiba+Market' },
      { time: '14:00', title: '🛍️ 最後補貨', desc: '難波周邊做最後採買', link: 'https://www.google.com/maps/search/?api=1&query=Namba+Parks' },
      { time: '15:00', title: '🚆 前往機場', desc: '南海 Rapi:t 特急 → 關西機場', link: 'https://www.google.com/maps/search/?api=1&query=Nankai+Namba+Station' },
      { time: '18:55', title: '🛫 起飛回台灣 (IT213)', desc: '滿載而歸！' },
    ]} />
  </>
);

const ToolsContent = () => (
  <>
    <DayHeader 
      day="TOOLS" 
      date="實用工具" 
      title="匯率 / 日語 / 檢查表" 
      tags={['血拼神器', '生存日語', '清單']}
    />
    <ExchangeRateWidget />
    <JapanesePhraseWidget />
    <InfoBox>
      <h4 className="font-bold mb-3 flex items-center gap-2 text-blue-800 print:text-black"><CheckSquare className="w-4 h-4"/> 必備物品檢查表</h4>
      <div className="grid grid-cols-2 gap-2 text-stone-700">
        {['護照 (效期6個月+)', '身分證', 'VJW QR Code', '網卡/漫遊', '日幣現金', '信用卡 (2張)', '好走的球鞋', '行動電源', '手機充電器 / 線', '個人藥品'].map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-sm bg-white p-2 rounded border border-blue-100 print:border-stone-300">
            <div className="w-4 h-4 border-2 border-blue-200 rounded-sm print:border-stone-400"></div>
            {item}
          </div>
        ))}
      </div>
    </InfoBox>
  </>
);

// --- Main Document Component ---

export default function ItineraryDocument({ activeTab }: { activeTab: string }) {
  // Logic: 
  // - On Screen: Display ONLY the active tab content using conditional CSS classes (block/hidden).
  // - On Print: Use 'print:block' on ALL tab contents so everything is printed sequentially.
  // - We wrap Day 2-5 & Tools in 'break-before-page' to force pagination on print.

  return (
    <div>
      <div className={activeTab === 'day1' ? 'block' : 'hidden print:block'}>
        <Day1Content />
      </div>

      <div className={`${activeTab === 'day2' ? 'block' : 'hidden print:block'} break-before-page`}>
        <Day2Content />
      </div>

      <div className={`${activeTab === 'day3' ? 'block' : 'hidden print:block'} break-before-page`}>
        <Day3Content />
      </div>

      <div className={`${activeTab === 'day4' ? 'block' : 'hidden print:block'} break-before-page`}>
        <Day4Content />
      </div>

      <div className={`${activeTab === 'day5' ? 'block' : 'hidden print:block'} break-before-page`}>
        <Day5Content />
      </div>

      <div className={`${activeTab === 'tools' ? 'block' : 'hidden print:block'} break-before-page`}>
        <ToolsContent />
      </div>
    </div>
  );
}