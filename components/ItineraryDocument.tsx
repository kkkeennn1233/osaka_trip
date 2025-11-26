import React, { useState, useEffect } from 'react';
import { MapPin, Utensils, ShoppingBag, Hotel, AlertCircle, CheckSquare, CloudSun, CalendarClock, Sun, Cloud, ThermometerSun, Umbrella, Wind, Calculator, Languages, Volume2, RefreshCw, ShoppingCart, Train, MessageCircle, Shirt, CreditCard, HelpCircle } from 'lucide-react';

// --- Weather Data (Historical Average for Late Nov/Early Dec in Kyoto/Osaka) ---
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
    <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 border border-blue-100 rounded-xl p-3 mb-5 flex items-center justify-between shadow-sm animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="bg-white p-2 rounded-full shadow-sm text-amber-500">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-stone-800">{data.loc}</span>
            <span className="text-xs text-stone-500 font-medium">{data.condition}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-bold text-stone-800">{data.tempHigh}°</span>
            <span className="text-stone-400">/</span>
            <span className="text-stone-600">{data.tempLow}°C</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col items-end gap-1 text-xs text-stone-600">
        <div className="flex items-center gap-1 bg-white/60 px-2 py-0.5 rounded-full">
          <Umbrella className="w-3 h-3 text-blue-500" />
          <span>{data.precip}%</span>
        </div>
        <div className="flex items-center gap-1 bg-white/60 px-2 py-0.5 rounded-full">
          <Wind className="w-3 h-3 text-stone-400" />
          <span>{data.note}</span>
        </div>
      </div>
    </div>
  );
};

const ExchangeRateWidget = () => {
  const [jpy, setJpy] = useState<string>('');
  const [twd, setTwd] = useState<string>('');
  const [rate, setRate] = useState<number>(0.218); // Default slightly higher for cash sell estimation
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchRate = async () => {
    setLoading(true);
    try {
      // Using a free public API for exchange rates
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/JPY');
      const data = await response.json();
      if (data && data.rates && data.rates.TWD) {
        // Bank of Taiwan Cash Sell is usually slightly higher than mid-market rate
        // We add a small buffer (~1.5%) to approximate the "Cash Sell" rate
        const estimatedCashRate = Number((data.rates.TWD * 1.015).toFixed(4));
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

  // Initial fetch
  useEffect(() => {
    fetchRate();
  }, []);

  const handleJpyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setJpy(val);
    if (val && !isNaN(Number(val))) {
      setTwd((Number(val) * rate).toFixed(0));
    } else {
      setTwd('');
    }
  };

  const handleTwdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTwd(val);
    if (val && !isNaN(Number(val))) {
      setJpy((Number(val) / rate).toFixed(0));
    } else {
      setJpy('');
    }
  };

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 mb-8">
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
        <input 
          type="number" 
          value={jpy}
          onChange={handleJpyChange}
          placeholder="輸入日幣"
          className="text-right font-mono text-xl font-bold text-stone-800 outline-none w-full ml-4 bg-transparent"
        />
      </div>

      <div className="flex justify-center -my-3 z-10 relative">
        <div className="bg-stone-100 rounded-full p-1.5 border border-stone-200">
          <RefreshCw className="w-4 h-4 text-stone-400" />
        </div>
      </div>

      <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-stone-200 mt-0 shadow-sm focus-within:ring-2 focus-within:ring-green-500/20 focus-within:border-green-500 transition-all">
        <span className="font-bold text-stone-500 text-sm">TWD $</span>
        <input 
          type="number" 
          value={twd}
          onChange={handleTwdChange}
          placeholder="輸入台幣"
          className="text-right font-mono text-xl font-bold text-stone-800 outline-none w-full ml-4 bg-transparent"
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-stone-400 px-1">
        <span>{lastUpdated ? `更新於: ${lastUpdated}` : '台灣銀行現金賣出估算'}</span>
        <div className="flex items-center gap-2">
          <span>匯率:</span>
          <input 
            type="number" 
            value={rate} 
            step="0.001"
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-16 bg-stone-100 rounded px-1 py-0.5 text-right border border-stone-200 text-stone-600"
          />
        </div>
      </div>
    </div>
  );
};

const JapanesePhraseWidget = () => {
  const categories = [
    {
      id: 'shopping_q',
      title: '購物詢問 (尺寸/顏色/試穿)',
      icon: Shirt,
      color: 'text-indigo-600 bg-indigo-50',
      phrases: [
        { cn: '這個多少錢？', jp: 'これ、いくらですか？', romaji: 'Kore, ikura desu ka?' },
        { cn: '不好意思，請問這個在哪裡？', jp: 'すみません、これ、どこにありますか？', romaji: 'Sumimasen, kore, doko ni arimasu ka?' },
        { cn: '有大一點的尺寸嗎？', jp: 'もう少し大きいサイズはありますか？', romaji: 'Mō sukoshi ōkii saizu wa arimasu ka?' },
        { cn: '有其他顏色嗎？', jp: '他の色はありますか？', romaji: 'Hoka no iro wa arimasu ka?' },
        { cn: '可以試穿嗎？', jp: '試着してもいいですか？', romaji: 'Shichaku shite mo ii desu ka?' },
      ]
    },
    {
      id: 'checkout',
      title: '結帳應對 (刷卡/袋子)',
      icon: CreditCard,
      color: 'text-pink-600 bg-pink-50',
      phrases: [
        { cn: '可以刷卡嗎？', jp: 'クレジットカードは使えますか？', romaji: 'Kurejitto kādo wa tsukaemasu ka?' },
        { cn: '有免稅嗎？', jp: '免税はありますか？', romaji: 'Menzei wa arimasu ka?' },
        { cn: '(店員問) 需要袋子嗎？', jp: '袋は必要ですか？', romaji: 'Fukuro wa hitsuyō desu ka?', isQuestion: true },
        { cn: '沒關係，不用了。(拒絕)', jp: 'いえ、大丈夫です。', romaji: 'Ie, daijōbu desu.' },
        { cn: '好的，麻煩裝袋。(答應)', jp: 'はい、お願いします。', romaji: 'Hai, onegaishimasu.' },
      ]
    },
    {
      id: 'hotel',
      title: '飯店 / 寄放行李',
      icon: Hotel,
      color: 'text-blue-600 bg-blue-50',
      phrases: [
        { cn: '我是網路預約的。', jp: 'ネットで予約しました。', romaji: 'Netto de yoyaku shimashita.' },
        { cn: '麻煩幫我 Check-in。', jp: 'チェックイン、お願いします。', romaji: 'Chekku-in, onegaishimasu.' },
        { cn: '可以寄放行李嗎？(入住前/後)', jp: '荷物を預けてもいいですか？', romaji: 'Nimotsu o azukete mo ii desu ka?' },
        { cn: '可以麻煩保管行李嗎？', jp: '荷物を預かってもらえますか？', romaji: 'Nimotsu o azukatte moraemasu ka?' },
      ]
    },
    {
      id: 'survival',
      title: '生存萬用 (廁所/謝謝)',
      icon: HelpCircle,
      color: 'text-orange-600 bg-orange-50',
      phrases: [
        { cn: '不好意思...', jp: 'すみません...', romaji: 'Sumimasen...' },
        { cn: '廁所在哪裡？', jp: 'トイレはどこですか？', romaji: 'Toire wa doko desu ka?' },
        { cn: '謝謝', jp: 'ありがとうございます', romaji: 'Arigatō gozaimasu' },
        { cn: '聽不懂', jp: 'わかりません', romaji: 'Wakarimasen' },
      ]
    }
  ];

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Cancel previous speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.85; // Slightly slower for clarity
      window.speechSynthesis.speak(utterance);
    } else {
      alert("您的瀏覽器不支援發音功能");
    }
  };

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 mb-8">
      <h3 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">
        <div className="bg-indigo-100 p-1.5 rounded-md text-indigo-700">
          <Languages className="w-5 h-5" />
        </div>
        手指日語 (點擊發音)
      </h3>

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
  <div className="mb-6 animate-fade-in">
    <div className="flex items-center gap-3 mb-2">
      <span className="bg-red-700 text-white px-3 py-1 rounded-md font-bold text-lg shadow-sm whitespace-nowrap shrink-0">
        {day}
      </span>
      <h2 className="text-2xl font-bold text-stone-800 leading-tight">{title}</h2>
    </div>
    <div className="text-stone-500 font-medium ml-1 mb-3 flex items-center gap-2">
      <CalendarClock className="w-4 h-4"/>
      {date}
    </div>

    {/* Weather Widget Inserted Here */}
    {dayId && <WeatherWidget dayId={dayId} />}
    
    <div className="flex flex-wrap gap-2 mb-4 text-sm text-stone-600">
      {tags.map((tag, i) => (
        <span key={i} className="bg-stone-100 px-2.5 py-1 rounded-full border border-stone-200 text-stone-600 text-xs font-medium">#{tag}</span>
      ))}
    </div>
    
    {accommodation && (
      <div className="flex items-start gap-3 text-stone-700 bg-orange-50 p-3 rounded-lg border border-orange-100">
        <Hotel className="w-5 h-5 text-orange-600 mt-0.5 shrink-0" />
        <div className="flex flex-col">
          <span className="text-xs text-orange-600 font-bold uppercase">Accommodation</span>
          <span className="font-bold">{accommodation}</span>
        </div>
      </div>
    )}
    <hr className="mt-6 border-stone-100" />
  </div>
);

const ScheduleTable = ({ items }: { items: { time: string, title: string, desc: React.ReactNode, highlight?: boolean, link?: string }[] }) => (
  <div className="mb-8 relative">
    <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-stone-200"></div>
    <div className="space-y-6">
      {items.map((item, idx) => (
        <div key={idx} className={`relative pl-10 ${item.highlight ? "bg-orange-50/50 -mx-4 px-4 py-3 rounded-xl border border-orange-100/50 pl-14" : ""}`}>
          <div className={`absolute left-3 w-3 h-3 rounded-full border-2 border-white shadow-sm z-10 top-1.5 ${item.highlight ? 'bg-red-500 left-7' : 'bg-stone-300'}`}></div>
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
            <span className={`font-mono font-bold text-sm ${item.highlight ? 'text-red-600' : 'text-stone-400'}`}>{item.time}</span>
            <div className="flex items-center gap-2">
                {item.link ? (
                    <a href={item.link} target="_blank" rel="noreferrer" className={`font-bold text-base flex items-center gap-1 transition-colors hover:underline ${item.highlight ? 'text-blue-700' : 'text-blue-600'}`}>
                        {item.title}
                        <MapPin className="w-3.5 h-3.5" />
                    </a>
                ) : (
                    <h3 className={`font-bold text-base ${item.highlight ? 'text-red-900' : 'text-stone-800'}`}>{item.title}</h3>
                )}
            </div>
          </div>
          <div className="text-sm text-stone-600 mt-1 whitespace-pre-wrap leading-relaxed">{item.desc}</div>
        </div>
      ))}
    </div>
  </div>
);

const SectionList = ({ title, icon: Icon, children }: { title: string, icon: any, children?: React.ReactNode }) => (
  <div className="mb-8">
    <h3 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2 pb-2 border-b border-stone-100">
      <div className="bg-red-50 p-1.5 rounded-md text-red-700">
        <Icon className="w-5 h-5" />
      </div>
      {title}
    </h3>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

const ListItem = ({ title, desc, link, note }: { title: string, desc?: string, link?: string, note?: string }) => (
  <div className="flex flex-col gap-1 p-3 rounded-lg hover:bg-stone-50 transition-colors border border-transparent hover:border-stone-100">
    <div className="flex items-start justify-between gap-2">
      <div className="font-bold text-stone-800 flex items-center gap-2">
        {title}
        {note && <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded border border-orange-200">{note}</span>}
      </div>
      {link && (
        <a href={link} target="_blank" rel="noreferrer" className="text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs font-medium hover:bg-blue-100 flex items-center gap-1 shrink-0">
          <MapPin className="w-3 h-3" /> 導航
        </a>
      )}
    </div>
    {desc && <div className="text-sm text-stone-500 leading-snug">{desc}</div>}
  </div>
);

const InfoBox = ({ children }: { children?: React.ReactNode }) => (
  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 text-sm text-blue-900 shadow-sm">
    {children}
  </div>
);

// --- Main Document Component ---

const ItineraryDocument = ({ activeTab }: { activeTab: string }) => {
  return (
    <div className="font-sans text-stone-800 animate-fade-in">
      
      {/* DAY 1 CONTENT */}
      {activeTab === 'day1' && (
        <div className="animate-slide-up">
           <DayHeader 
            dayId="day1"
            day="DAY 1" 
            date="11/29 (五)" 
            title="啟程・前往京都" 
            tags={['移動日', 'Haruka 特急', '清水寺住宿']}
            accommodation="RESI STAY 五条坂 (清水寺山腳)"
          />

          <InfoBox>
            <h4 className="font-bold mb-2 flex items-center gap-2 text-blue-800"><AlertCircle className="w-4 h-4"/> 旅遊小幫手</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CloudSun className="w-4 h-4 text-blue-500"/>
                <a href="https://tenki.jp/forecast/6/29/6110/26100/" target="_blank" rel="noreferrer" className="underline hover:text-blue-600">查看京都一週天氣</a>
              </li>
              <li className="flex items-start gap-2">
                <CheckSquare className="w-4 h-4 text-blue-500 mt-0.5"/>
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
            <ListItem title="Negibouzu (蔥坊主)" desc="鐵板料理、御好燒 (~22:00)" link="https://maps.app.goo.gl/YfP375H7UjQrGbjJ6" />
            <ListItem title="Mon Chan" desc="日式料理、居酒屋 (營業時間不一定)" link="https://maps.app.goo.gl/Dq9Z1YzFXgU4w2aY6" />
            <ListItem title="Gion Negiyaki Kana East" desc="深夜選擇，蔥燒/大阪燒 (~02:00)" link="https://maps.app.goo.gl/fsvMvfwryJ4QcZgk8" note="推" />
          </SectionList>
          
          <SectionList title="超商超市" icon={ShoppingBag}>
            <ListItem title="FRESCO 超市" desc="24H，補給水、水果推薦" link="https://maps.app.goo.gl/gC8DKNt6XNd9KyEu5" />
            <ListItem title="Lawson" link="https://maps.app.goo.gl/2wjpaSjv3UwxVKxdA" />
            <ListItem title="7-11" link="https://maps.app.goo.gl/oSjcdw7WegRmr9sT7" />
            <ListItem title="全家 FamilyMart" link="https://maps.app.goo.gl/4X3sEzKWJy77MHD48" />
          </SectionList>
        </div>
      )}

      {/* DAY 2 CONTENT */}
      {activeTab === 'day2' && (
        <div className="animate-slide-up">
          <DayHeader 
            dayId="day2"
            day="DAY 2" 
            date="11/30 (六)" 
            title="京都：清水寺 & 祇園" 
            tags={['早起避人潮', '千年古都', '錦市場']}
            accommodation="RESI STAY 五条坂"
          />

          <ScheduleTable items={[
            { time: '05:30', title: '⏰ 起床梳洗', desc: '痛苦一下，照片會很美！', highlight: true },
            { time: '06:00', title: '📸 二三年坂 & 清水寺', desc: '抵達後右轉，享受寧靜空景', link: 'https://www.google.com/maps/search/?api=1&query=Kiyomizu-dera' },
            { time: '07:50', title: '☕ 二年坂星巴克', desc: '拍復古外觀，喝杯草莓限定星冰樂', link: 'https://www.google.com/maps/search/?api=1&query=Starbucks+Coffee+Kyoto+Ninenzaka+Yasaka+Chaya' },
            { time: '09:30', title: '🍡 清水坂', desc: '商店陸續開門，邊走邊吃', link: 'https://www.google.com/maps/search/?api=1&query=Kiyomizu-zaka' },
            { time: '10:30', title: '⛩️ 八坂神社 & 花見小路', desc: '沿路下坡散步，輕鬆逛', link: 'https://www.google.com/maps/search/?api=1&query=Yasaka+Shrine' },
            { time: '11:30', title: '🦆 祇園白川 & 鴨川', desc: '京都最美的散步路徑', link: 'https://www.google.com/maps/search/?api=1&query=Gion+Shirakawa' },
            { time: '12:30', title: '🍤 午餐時間', desc: '⚠️ 週末熱門時段可能需排隊' },
            { time: '13:30', title: '🛍️ 錦市場 & 新京極', desc: '逛街、買伴手禮、吃小吃', link: 'https://www.google.com/maps/search/?api=1&query=Nishiki+Market' },
            { time: '16:00', title: '🦊 伏見稻荷大社', desc: '千本鳥居 (傍晚氣氛神秘)', link: 'https://www.google.com/maps/search/?api=1&query=Fushimi+Inari+Taisha' },
            { time: '17:30', title: '🎁 京都車站', desc: '伴手禮採購 / 站前地下街', link: 'https://www.google.com/maps/search/?api=1&query=Kyoto+Station' },
            { time: '18:30', title: '🍁 夜楓', desc: '清水寺 或 東寺 夜間拜觀', link: 'https://www.google.com/maps/search/?api=1&query=Kiyomizu-dera' },
            { time: '20:00', title: '🥢 晚餐', desc: '視參觀地點決定' },
          ]} />

           <SectionList title="清水坂甜點" icon={Utensils}>
            <ListItem title="本家 西尾八橋" desc="08:30~，試吃很大方" link="https://maps.app.goo.gl/NWu2XXGyLvMP5EXH9" />
            <ListItem title="MALEBRANCHE" desc="09:00~，必買茶之菓" link="https://maps.app.goo.gl/rwkCyid9hkpVvTxTA" />
            <ListItem title="Kyo-Baum" desc="抹茶年輪蛋糕" link="https://maps.app.goo.gl/S2wsL3gpmPfRmr3P6" />
            <ListItem title="藤菜美" desc="醬油糰子/洛水，有座位" link="https://maps.app.goo.gl/EWdwDg8ofGZgB5nJ8" />
            <ListItem title="GOKAGO" desc="現刷抹茶飲品" link="https://maps.app.goo.gl/S2wsL3gpmPfRmr3P6" />
          </SectionList>

          <SectionList title="午餐口袋名單" icon={Utensils}>
            <ListItem title="La Curry" desc="咖哩 (11:00~14:30)" link="https://maps.app.goo.gl/knNKuKEW7AMa7eXY7" />
            <ListItem title="麵屋 豬一" desc="拉麵 (11:00~14:30)，米其林推薦" link="https://maps.app.goo.gl/aFfvhCdkCESZ33a19" />
            <ListItem title="有喜屋 先斗町本店" desc="天婦羅/蕎麥 (11:30~15:00)" link="https://maps.app.goo.gl/fvesVrcDi4tmah589" />
            <ListItem title="Ajisai no Toyo" desc="鰻魚飯 (11:00~15:00)" link="https://maps.app.goo.gl/7FgdDgMM6GthngsL9" />
            <ListItem title="Sukiyaki Kimura" desc="壽喜燒 (12:00~20:30)" link="https://maps.app.goo.gl/NkcDHDFYtFhz2PxX7" />
            <ListItem title="Makino 天丼" desc="現炸大碗滿意 (11:00~20:30)" link="https://maps.app.goo.gl/hWgj3g6kJkRZTmp29" />
          </SectionList>

          <SectionList title="錦市場 & 河原町推薦" icon={ShoppingBag}>
              <ListItem title="Nanaya Kyoto Sanjo" desc="世界最濃抹茶冰淇淋 (1~7級)" link="https://www.google.com/maps/search/?api=1&query=Nanaya+Kyoto+Sanjo" />
              <ListItem title="こんなもんじゃ" desc="豆乳甜甜圈、豆乳冰淇淋" link="https://www.google.com/maps/search/?api=1&query=Konnamonja+Nishiki+Market" />
              <ListItem title="博士章魚燒" desc="口感軟爛派，價格親民" link="https://www.google.com/maps/search/?api=1&query=Karikari+Hakase+Kyoto" />
              <ListItem title="錦 魚力" desc="炸海鮮串、天婦羅 (必吃)" link="https://www.google.com/maps/search/?api=1&query=Nishiki+Uoriki" />
              <ListItem title="3 COINS+ plus" desc="Mina京都店，質感雜貨" link="https://maps.app.goo.gl/ateBfTvoS45nxgx86" />
              <ListItem title="Standard Products" desc="京都河原町店，大創高級版必逛" link="https://maps.app.goo.gl/fQfDwFobHVTn1P6r8" />
          </SectionList>

          <SectionList title="晚餐口袋名單 (或超市)" icon={Utensils}>
             <ListItem title="Tsukumo烏龍" desc="鹽小路本店" link="https://maps.app.goo.gl/BQYMqz39ME83GVo58" />
             <ListItem title="Gion Negiyaki Kana - East" desc="大阪燒/蔥燒" link="https://maps.app.goo.gl/1xJr2V5eAcktanVC6" />
          </SectionList>
        </div>
      )}

      {/* DAY 3 CONTENT */}
      {activeTab === 'day3' && (
        <div className="animate-slide-up">
          <DayHeader 
            dayId="day3"
            day="DAY 3" 
            date="12/01 (日)" 
            title="嵐山・teamLab・移動至大阪" 
            tags={['竹林小徑', 'teamLab', '搬家到大阪']}
            accommodation="The OneFive Osaka Namba"
          />

          <ScheduleTable items={[
            { time: '06:30', title: '👋 退房出發', desc: '計程車 → 京都車站 寄放行李', link: 'https://www.google.com/maps/search/?api=1&query=Kyoto+Station' },
            { time: '08:00', title: '🎋 嵐山', desc: '到 嵯峨小學校前 搭車去 愛宕念佛寺 (避開人潮)', link: 'https://www.google.com/maps/search/?api=1&query=Otagi+Nenbutsuji+Temple' },
            { time: '11:00', title: '🍱 嵐山午餐', desc: '喜重郎 (牛排飯) 或 亀山家 (天婦羅)' },
            { time: '14:00', title: '🎨 teamLab', desc: 'Biovortex Kyoto (⚠️ 需預約)', link: 'https://www.google.com/maps/search/?api=1&query=teamLab+Biovortex+Kyoto' },
            { time: '15:30', title: '🛍️ 京都車站', desc: 'JR前往難波＆領行李＆最後伴手禮採購', link: 'https://www.google.com/maps/search/?api=1&query=Kyoto+Station' },
            { time: '17:00', title: '🚆 前往難波', desc: '入住 The OneFive Osaka Namba', link: 'https://www.google.com/maps/search/?api=1&query=The+OneFive+Osaka+Namba' },
            { time: '19:00', title: '🦀 道頓堀 & 心齋橋', desc: '跑跑人、晚餐、逛藥妝', link: 'https://www.google.com/maps/search/?api=1&query=Dotonbori' },
          ]} />

          <SectionList title="嵐山午餐口袋名單" icon={Utensils}>
             <ListItem title="亀山家 (Kameyamya)" desc="溫馨老店，天婦羅丼飯、蕎麥麵 (11:30~)" link="https://www.google.com/maps/search/?api=1&query=Kameyamya+Arashiyama" />
             <ListItem title="嵐山 喜重郎" desc="日式庭園，必吃和牛牛排重 (11:00~)" link="https://www.google.com/maps/search/?api=1&query=Arashiyama+Kijuro" />
          </SectionList>

          <SectionList title="嵐山小吃與名店" icon={Utensils}>
             <ListItem title="京豆庵" desc="必挑戰！倒立也不會掉的豆腐冰淇淋" link="https://www.google.com/maps/search/?api=1&query=Kyozuan+Arashiyama" />
             <ListItem title="古都芋本舗" desc="大玉炙燒醬油糰子、四色霜淇淋" link="https://www.google.com/maps/search/?api=1&query=Kotoimo+Honpo+Arashiyama" />
             <ListItem title="Mamemono to Taiyaki" desc="賞味期限一分鐘鯛魚燒 (整塊奶油)" link="https://www.google.com/maps/search/?api=1&query=Mamemono+to+Taiyaki+Arashiyama" />
             <ListItem title="MALEBRANCHE 嵐山店" desc="限定「茶茶棒」(抹茶閃電泡芙)" link="https://www.google.com/maps/search/?api=1&query=MALEBRANCHE+Arashiyama" />
             <ListItem title="米菲櫻花廚房" desc="Miffy 造型紅豆麵包、周邊商品" link="https://www.google.com/maps/search/?api=1&query=Miffy+Sakura+Kitchen+Arashiyama" />
             <ListItem title="雲ノ茶 (Kumonocha Cafe)" desc="雲朵慕斯蛋糕、竹炭抹茶拿鐵" link="https://www.google.com/maps/search/?api=1&query=Kumonocha+Cafe+Arashiyama" />
             <ListItem title="金之華 (Kin-no-Hana)" desc="栗子地瓜甜點、現擠蒙布朗" link="https://www.google.com/maps/search/?api=1&query=Kin-no-Hana+Arashiyama" />
          </SectionList>
          
          <SectionList title="大阪甜點與小吃" icon={Utensils}>
            <ListItem title="鳴門鯛燒本舖" desc="天然鯛魚燒 (千日前)" link="https://www.google.com/maps/search/?api=1&query=Naruto+Taiyaki+Honpo+Sennichimae+Aiaibashi" />
            <ListItem title="Strawberry Mania" desc="草莓大福、可麗餅" link="https://www.google.com/maps/search/?api=1&query=Strawberry+Mania+Shinsaibashi" />
            <ListItem title="BAKE CHEESE TART" desc="半熟起司塔 (高島屋)" link="https://www.google.com/maps/search/?api=1&query=BAKE+CHEESE+TART+Osaka+Takashimaya" />
            <ListItem title="Canele du Japon" desc="可麗露專賣 (長堀橋)" link="https://www.google.com/maps/search/?api=1&query=Canele+du+Japon+Nagahoribashi" />
            <ListItem title="Takoyaki Wanaka" desc="必吃章魚燒 (千日前本店)" link="https://www.google.com/maps/search/?api=1&query=Takoyaki+Wanaka+Sennichimae" />
          </SectionList>

          <SectionList title="大阪晚餐口袋名單 (難波/心齋橋)" icon={Utensils}>
            <ListItem title="Yasaikushimaki Narutoya" desc="蔬菜肉捲串燒 (23:00~)" link="https://www.google.com/maps/search/?api=1&query=Yasaikushimaki+Narutoya+Namba" />
            <ListItem title="Tempura Tarojiro" desc="天婦羅居酒屋，現點現炸" link="https://www.google.com/maps/search/?api=1&query=Tempura+Tarojiro+Shinsaibashi" />
            <ListItem title="Kamojin Yakitori" desc="炭火燒鳥 & 鴨肉料理" link="https://www.google.com/maps/search/?api=1&query=Kamojin+Yakitori+Osaka" />
            <ListItem title="Mugen ramen" desc="濃郁系拉麵 (22:30~)" link="https://www.google.com/maps/search/?api=1&query=Mugen+Ramen+Sennichimae" />
            <ListItem title="福太郎 本店" desc="大阪燒名店，必點蔥燒" link="https://www.google.com/maps/search/?api=1&query=Fukutaro+Honten+Osaka" />
            <ListItem title="Gyutan Yoshiji" desc="炭烤牛舌專賣 (~02:00)" link="https://www.google.com/maps/search/?api=1&query=Gyutan+Yoshiji+Shinsaibashi" />
            <ListItem title="Robatayaki Kakurechaya" desc="爐端燒，船槳遞食物" link="https://www.google.com/maps/search/?api=1&query=Rikimaru+Robatayaki+Kakurechaya" />
          </SectionList>
        </div>
      )}

      {/* DAY 4 CONTENT */}
      {activeTab === 'day4' && (
        <div className="animate-slide-up">
          <DayHeader 
            dayId="day4"
            day="DAY 4" 
            date="12/02 (一)" 
            title="箕面勝尾寺・梅田購物・夜景" 
            tags={['勝尾寺達摩', '箕面瀑布', '百貨公司']}
            accommodation="The OneFive Osaka Namba"
          />

          <ScheduleTable items={[
            { time: '06:30', title: '🚇 前往箕面萱野', desc: '難波 → 梅田 → 箕面萱野 → 計程車', link: 'https://www.google.com/maps/search/?api=1&query=Minoh-kayano+Station' },
            { time: '08:00', title: '👹 勝尾寺', desc: '滿山滿谷的小達摩，必拍！📸', link: 'https://www.google.com/maps/search/?api=1&query=Katsuoji+Temple' },
            { time: '10:30', title: '🚕 箕面瀑布', desc: '搭計程車去，走路下山 (約40分) 吸芬多精', link: 'https://www.google.com/maps/search/?api=1&query=Minoh+Waterfall' },
            { time: '13:00', title: '🏙️ 梅田市區午餐', desc: 'Grand Front 或 LUCUA 百貨', link: 'https://www.google.com/maps/search/?api=1&query=Grand+Front+Osaka' },
            { time: '15:00', title: '🛍️ 梅田 / 天滿', desc: '購物迷宮，想買什麼都有', link: 'https://www.google.com/maps/search/?api=1&query=Umeda+Shopping' },
            { time: '17:30', title: '🎄 聖誕市集巡禮', desc: '阪急梅田 (9F)、梅田藍天大廈 (1F)、Grand Front (1F)、梅北廣場 (聖誕熊)', link: 'https://www.google.com/maps/search/?api=1&query=Umeda+Sky+Building' },
            { time: '18:30', title: '🌃 WowUs', desc: '大阪地標絕美夜景', link: 'https://www.google.com/maps/search/?api=1&query=Grand+Front+Osaka' },
            { time: '19:30', title: '🏯 回難波', desc: '晚餐、LIFE超市、唐吉訶德補貨', link: 'https://www.google.com/maps/search/?api=1&query=Dotonbori' },
          ]} />

          <SectionList title="梅田 & 天滿午餐" icon={Utensils}>
             <ListItem title="Unatoto" desc="平價鰻魚飯 (南森町)" link="https://www.google.com/maps/search/?api=1&query=Unatoto+Minamimorimachi" />
             <ListItem title="Robata to Kamameshi Ioroi" desc="爐端燒、釜飯" link="https://www.google.com/maps/search/?api=1&query=Robata+to+Kamameshi+Ioroi+Tenma" />
             <ListItem title="お好み焼き 千草" desc="老牌大阪燒" link="https://www.google.com/maps/search/?api=1&query=Okonomiyaki+Chigusa+Tenma" />
             <ListItem title="Rojiura Curry SAMURAI" desc="北海道湯咖哩" link="https://www.google.com/maps/search/?api=1&query=Rojiura+Curry+Samurai+Grand+Front+Osaka" />
             <ListItem title="Unagi Kushiyaki Izumo" desc="巨無霸鰻魚玉子燒蓋飯" link="https://www.google.com/maps/search/?api=1&query=Unagi+Kushiyaki+Izumo+Lucua" />
          </SectionList>
          
          <SectionList title="梅田 & 天滿小吃" icon={Utensils}>
            <ListItem title="OSA COFFEE" desc="中崎町文青布丁" link="https://www.google.com/maps/search/?api=1&query=OSA+COFFEE+Nakazakicho" />
            <ListItem title="Umaiya (うまい屋)" desc="米其林推薦章魚燒" link="https://www.google.com/maps/search/?api=1&query=Umaiya+Takoyaki+Tenma" />
            <ListItem title="前田豆腐店" desc="豆腐冰、豆漿布丁" link="https://www.google.com/maps/search/?api=1&query=Maeda+Tofu+Shop+Tenma" />
            <ListItem title="中村屋" desc="現炸可樂餅名店" link="https://www.google.com/maps/search/?api=1&query=Nakamuraya+Croquette+Tenma" />
            <ListItem title="grenier" desc="烤布蕾千層酥 (LUCUA 1100)" link="https://www.google.com/maps/search/?api=1&query=grenier+Umeda+Lucua" />
            <ListItem title="Sugar Butter Tree" desc="砂糖奶油樹 (阪急B1)" link="https://www.google.com/maps/search/?api=1&query=Sugar+Butter+Tree+Hankyu+Umeda" />
          </SectionList>

          <SectionList title="難波 & 心齋橋晚餐 (宵夜)" icon={Utensils}>
            <ListItem title="Shinjuku Yakiniku Gyutan no Lemon" desc="厚切牛舌 (21:00~)" link="https://www.google.com/maps/search/?api=1&query=Shinjuku+Yakiniku+Gyutan+no+Lemon+Osaka" />
            <ListItem title="Chiyomatsu Katsudon" desc="5cm超厚切豬排丼 (21:30~)" link="https://www.google.com/maps/search/?api=1&query=Chiyomatsu+Katsudon+Osaka" />
            <ListItem title="Gyutan Yoshiji" desc="炭烤仙台牛舌 (~02:00)" link="https://www.google.com/maps/search/?api=1&query=Gyutan+Yoshiji+Shinsaibashi" />
            <ListItem title="Yasaikushimaki Narutoya" desc="蔬菜肉捲串燒 (23:00~)" link="https://www.google.com/maps/search/?api=1&query=Yasaikushimaki+Narutoya+Namba" />
            <ListItem title="Mugen ramen" desc="濃郁系拉麵 (22:30~)" link="https://www.google.com/maps/search/?api=1&query=Mugen+Ramen+Sennichimae" />
          </SectionList>
        </div>
      )}

      {/* DAY 5 CONTENT */}
      {activeTab === 'day5' && (
        <div className="animate-slide-up">
          <DayHeader 
            dayId="day5"
            day="DAY 5" 
            date="12/03 (二)" 
            title="大阪 → 溫暖的家" 
            tags={['大阪城', '黑門市場', '搭機返台']}
          />

          <ScheduleTable items={[
            { time: '08:00', title: '🍳 起床吃早餐', desc: '超商 or 麥當勞' },
            { time: '09:00', title: '🏯 大阪城公園', desc: '搭電車到 大阪商務園區站', link: 'https://www.google.com/maps/search/?api=1&query=Osaka+Castle+Park' },
            { time: '11:00', title: '🍣 黑門市場 午餐', desc: '狂吃和牛、生魚片、烤扇貝', link: 'https://www.google.com/maps/search/?api=1&query=Kuromon+Ichiba+Market' },
            { time: '14:00', title: '🛍️ 最後補貨', desc: '難波周邊最後採買', link: 'https://www.google.com/maps/search/?api=1&query=Namba+Station' },
            { time: '15:00', title: '🚆 前往機場', desc: '難波站 搭乘南海 Rapi:t 特急 → 關西機場', link: 'https://www.google.com/maps/search/?api=1&query=Kansai+International+Airport' },
            { time: '18:55', title: '🛫 起飛回台灣 (IT213)', desc: '滿載而歸！', highlight: true },
          ]} />
        </div>
      )}

      {/* TOOLS & INFO CONTENT */}
      {activeTab === 'tools' && (
        <div className="animate-slide-up">
           <div className="mb-6">
            <h2 className="text-2xl font-bold text-stone-800 mb-2">旅行工具箱</h2>
            <p className="text-stone-500">生存必備 & 實用資訊</p>
            <hr className="mt-4 border-stone-100" />
          </div>

          <ExchangeRateWidget />
          <JapanesePhraseWidget />

          <div className="space-y-6">
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-red-700"/> 物品檢查表
              </h3>
              <div className="space-y-3">
                {['護照 (效期6個月+)', '身分證', 'VJW QR Code 截圖', '網卡/漫遊 開通', '日幣現金 (5-7萬)', '信用卡 (2張)', '好走的球鞋', '行動電源', '手機充電器/充電線', '個人藥品'].map(item => (
                  <label key={item} className="flex items-center gap-3 p-2 bg-white rounded-lg border border-stone-100 shadow-sm">
                    <input type="checkbox" className="w-5 h-5 text-red-600 rounded focus:ring-red-500" />
                    <span className="text-stone-700 font-medium">{item}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
                <Hotel className="w-5 h-5 text-red-700"/> 住宿資訊
              </h3>
              
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-stone-100 shadow-sm">
                  <span className="text-xs font-bold bg-stone-100 text-stone-500 px-2 py-0.5 rounded mb-2 inline-block">KYOTO</span>
                  <h4 className="font-bold text-stone-900 text-lg">RESI STAY 五条坂</h4>
                  <p className="text-sm text-stone-500 mt-1">〒605-0846 京都府京都市東山区五条橋東</p>
                  <a href="tel:+81753537744" className="text-sm text-blue-600 block mt-1">+81-75-353-7744</a>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-stone-100 shadow-sm">
                   <span className="text-xs font-bold bg-stone-100 text-stone-500 px-2 py-0.5 rounded mb-2 inline-block">OSAKA</span>
                  <h4 className="font-bold text-stone-900 text-lg">The OneFive Osaka Namba</h4>
                  <p className="text-sm text-stone-500 mt-1">〒542-0073 大阪府大阪市中央区日本橋</p>
                  <a href="tel:+81666306655" className="text-sm text-blue-600 block mt-1">+81-6-6630-6655</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ItineraryDocument;