import { useState, useEffect } from 'react';

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  desc: string;
  link?: string;
  highlight?: boolean;
}

export type ScheduleData = Record<string, ScheduleItem[]>;

// 初始預設資料 (從原本的 ItineraryDocument 移出並加上 ID)
export const INITIAL_SCHEDULE: ScheduleData = {
  day1: [
    { id: 'd1-1', time: '09:20', title: '🏠 HOME', desc: '出發前往高鐵站' },
    { id: 'd1-2', time: '10:00', title: '🚅 台中高鐵站', desc: '搭乘高鐵前往桃園' },
    { id: 'd1-3', time: '10:30', title: '🚄 桃園高鐵站', desc: '轉機捷 (10:47 或 11:02 發車)' },
    { id: 'd1-4', time: '12:10', title: '🛫 桃園機場 T1', desc: '虎航櫃檯報到 (7號櫃檯)\n先去晃晃再進候機室', link: 'https://www.google.com/maps/search/?api=1&query=Taoyuan+Airport+Terminal+1' },
    { id: 'd1-5', time: '14:40', title: '✈️ 起飛 (IT212)', desc: '台北 TPE → 大阪 KIX', highlight: true },
    { id: 'd1-6', time: '17:55', title: '🛬 抵達關西機場', desc: '準備 VJW 截圖、護照\n預留入境審查時間', link: 'https://www.google.com/maps/search/?api=1&query=Kansai+International+Airport' },
    { id: 'd1-7', time: '19:30', title: '🚆 Haruka 特急', desc: '前往京都車站\n⚠️ 用 Klook 憑證兌換實體票', highlight: true },
    { id: 'd1-8', time: '21:00', title: '🚕 移動至飯店', desc: '京都車站 → RESI STAY\n建議搭 Uber 或計程車', link: 'https://www.google.com/maps/search/?api=1&query=RESI+STAY+Gojozaka' },
    { id: 'd1-9', time: '21:15', title: '🍜 晚餐 / 補給', desc: '飯店附近覓食' },
    { id: 'd1-10', time: '23:00', title: '💤 休息睡覺', desc: '⚠️ 明天要超級早起，請早睡！' },
  ],
  day2: [
    { id: 'd2-1', time: '05:30', title: '⏰ 起床梳洗', desc: '痛苦一下，照片會很美！' },
    { id: 'd2-2', time: '06:00', title: '📸 二三年坂 & 清水寺', desc: '抵達後右轉，享受寧靜', highlight: true, link: 'https://www.google.com/maps/search/?api=1&query=Kiyomizu-dera' },
    { id: 'd2-3', time: '07:50', title: '☕ 二年坂星巴克', desc: '拍復古外觀，喝杯草莓限定星冰樂', link: 'https://www.google.com/maps/search/?api=1&query=Starbucks+Coffee+Kyoto+Ninenzaka+Yasaka+Chaya' },
    { id: 'd2-4', time: '09:30', title: '🍡 清水坂', desc: '商店陸續開門，邊走邊吃', link: 'https://www.google.com/maps/search/?api=1&query=Kiyomizu-zaka' },
    { id: 'd2-5', time: '10:30', title: '⛩️ 八坂神社 & 花見小路', desc: '沿路下坡散步，輕鬆逛', link: 'https://www.google.com/maps/search/?api=1&query=Yasaka+Shrine' },
    { id: 'd2-6', time: '11:30', title: '🦆 祇園白川 & 鴨川', desc: '京都最美的散步路徑', link: 'https://www.google.com/maps/search/?api=1&query=Gion+Shirakawa' },
    { id: 'd2-7', time: '12:30', title: '🍤 午餐時間', desc: '⚠️ 週末熱門時段可能需排隊' },
    { id: 'd2-8', time: '13:30', title: '🛍️ 錦市場 & 新京極', desc: '逛街、買伴手禮、吃小吃', link: 'https://www.google.com/maps/search/?api=1&query=Nishiki+Market' },
    { id: 'd2-9', time: '16:00', title: '🦊 伏見稻荷大社', desc: '千本鳥居 (傍晚氣氛神秘)', link: 'https://www.google.com/maps/search/?api=1&query=Fushimi+Inari+Taisha' },
    { id: 'd2-10', time: '17:30', title: '🎁 京都車站', desc: '伴手禮採購 / 站前地下街', link: 'https://www.google.com/maps/search/?api=1&query=Kyoto+Station' },
    { id: 'd2-11', time: '18:30', title: '🍁 夜楓', desc: '清水寺 或 東寺 夜間拜觀', link: 'https://www.google.com/maps/search/?api=1&query=Kiyomizu-dera+Night+Viewing' },
    { id: 'd2-12', time: '20:00', title: '🥢 晚餐', desc: '視參觀地點決定' },
  ],
  day3: [
    { id: 'd3-1', time: '06:30', title: '👋 退房出發', desc: '搭計程車前往京都車站寄放行李', link: 'https://www.google.com/maps/search/?api=1&query=Kyoto+Station' },
    { id: 'd3-2', time: '08:00', title: '🎋 嵐山', desc: '搭車去愛宕念佛寺 (避開人潮)', link: 'https://www.google.com/maps/search/?api=1&query=Otagi+Nenbutsu-ji' },
    { id: 'd3-3', time: '11:00', title: '🍱 嵐山午餐', desc: '推薦喜重郎或亀山家', highlight: true },
    { id: 'd3-4', time: '14:00', title: '🎨 teamLab Biovortex', desc: '京都最新開幕！沈浸式藝術體驗 (需預約)', link: 'https://www.google.com/maps/search/?api=1&query=teamLab+Biovortex+Kyoto' },
    { id: 'd3-5', time: '15:30', title: '🛍️ 京都車站', desc: 'JR前往難波 & 領行李 & 最後採購', link: 'https://www.google.com/maps/search/?api=1&query=Kyoto+Station' },
    { id: 'd3-6', time: '17:00', title: '🚆 前往難波', desc: '入住 The OneFive Osaka Namba', link: 'https://www.google.com/maps/search/?api=1&query=The+OneFive+Osaka+Namba' },
    { id: 'd3-7', time: '19:00', title: '🦀 道頓堀 & 心齋橋', desc: '跑跑人看板合照、晚餐、逛藥妝', link: 'https://www.google.com/maps/search/?api=1&query=Dotonbori' },
  ],
  day4: [
    { id: 'd4-1', time: '06:30', title: '🚇 出發前往箕面萱野', desc: '難波 → 梅田 → 箕面萱野 → 計程車', link: 'https://www.google.com/maps/search/?api=1&query=Minoh-Kayano+Station' },
    { id: 'd4-2', time: '08:00', title: '👹 勝尾寺 (達摩寺)', desc: '滿山滿谷的小達摩，必拍！', highlight: true, link: 'https://www.google.com/maps/search/?api=1&query=Katsuo-ji' },
    { id: 'd4-3', time: '10:30', title: '🚕 前往 箕面瀑布', desc: '走路下山吸芬多精', link: 'https://www.google.com/maps/search/?api=1&query=Minoh+Waterfall' },
    { id: 'd4-4', time: '13:00', title: '🏙️ 返回梅田市區午餐', desc: 'Grand Front 或 LUCUA 百貨', link: 'https://www.google.com/maps/search/?api=1&query=Grand+Front+Osaka' },
    { id: 'd4-5', time: '15:00', title: '🛍️ 梅田商圈 / 天滿', desc: '購物迷宮 (天滿有小吃)', link: 'https://www.google.com/maps/search/?api=1&query=Umeda+Shopping+District' },
    { id: 'd4-6', time: '17:30', title: '🎄 梅田聖誕市集', desc: 'Grand Front、梅田藍天大廈', link: 'https://www.google.com/maps/search/?api=1&query=Umeda+Sky+Building' },
    { id: 'd4-7', time: '18:30', title: '🌃 WowUs (ワオアス)', desc: '大阪地標絕美夜景', link: 'https://www.google.com/maps/search/?api=1&query=Grand+Front+Osaka+South+Building' },
    { id: 'd4-8', time: '19:30', title: '🏯 回 難波', desc: '晚餐、超市、唐吉訶德', link: 'https://www.google.com/maps/search/?api=1&query=Namba+Station' },
  ],
  day5: [
    { id: 'd5-1', time: '08:00', title: '🍳 起床吃早餐', desc: '超商 or 麥當勞', link: 'https://www.google.com/maps/search/?api=1&query=McDonalds' },
    { id: 'd5-2', time: '09:00', title: '🏯 大阪城公園', desc: '搭電車到 大阪商務園區站', link: 'https://www.google.com/maps/search/?api=1&query=Osaka+Castle+Park' },
    { id: 'd5-3', time: '11:00', title: '🍣 黑門市場 午餐', desc: '狂吃和牛、生魚片、烤扇貝', highlight: true, link: 'https://www.google.com/maps/search/?api=1&query=Kuromon+Ichiba+Market' },
    { id: 'd5-4', time: '14:00', title: '🛍️ 最後補貨', desc: '難波周邊做最後採買', link: 'https://www.google.com/maps/search/?api=1&query=Namba+Parks' },
    { id: 'd5-5', time: '15:00', title: '🚆 前往機場', desc: '南海 Rapi:t 特急 → 關西機場', link: 'https://www.google.com/maps/search/?api=1&query=Nankai+Namba+Station' },
    { id: 'd5-6', time: '18:55', title: '🛫 起飛回台灣 (IT213)', desc: '滿載而歸！' },
  ]
};

const DB_KEY = 'kyoto_itinerary_db_v1';

export function useScheduleDatabase() {
  const [schedule, setSchedule] = useState<ScheduleData>(INITIAL_SCHEDULE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DB_KEY);
      if (saved) {
        setSchedule(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load schedule", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to LocalStorage
  const save = (newData: ScheduleData) => {
    setSchedule(newData);
    localStorage.setItem(DB_KEY, JSON.stringify(newData));
  };

  const addItem = (day: string, item: Omit<ScheduleItem, 'id'>) => {
    const newItem = { ...item, id: Date.now().toString() };
    const dayItems = schedule[day] ? [...schedule[day]] : [];
    dayItems.push(newItem);
    // Sort by time simple string comparison
    dayItems.sort((a, b) => a.time.localeCompare(b.time));
    save({ ...schedule, [day]: dayItems });
  };

  const deleteItem = (day: string, id: string) => {
    if (!schedule[day]) return;
    const newDayItems = schedule[day].filter(i => i.id !== id);
    save({ ...schedule, [day]: newDayItems });
  };

  const updateItem = (day: string, id: string, updates: Partial<ScheduleItem>) => {
     if (!schedule[day]) return;
     const newDayItems = schedule[day].map(item => item.id === id ? { ...item, ...updates } : item);
     // Re-sort if time changed
     if (updates.time) {
       newDayItems.sort((a, b) => a.time.localeCompare(b.time));
     }
     save({ ...schedule, [day]: newDayItems });
  };

  const moveItem = (day: string, index: number, direction: 'up' | 'down') => {
    if (!schedule[day]) return;
    const items = [...schedule[day]];
    
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    // Smart Sort: Content moves, Time stays.
    // 1. Get the original times for the two slots
    const timeAtCurrent = items[index].time;
    const timeAtTarget = items[targetIndex].time;

    // 2. Get the items (content)
    const itemToMove = { ...items[index] };
    const itemAtTarget = { ...items[targetIndex] };

    // 3. Swap the items in the array
    items[index] = itemAtTarget;
    items[targetIndex] = itemToMove;

    // 4. Restore the times to match the slot
    items[index].time = timeAtCurrent;
    items[targetIndex].time = timeAtTarget;
    
    save({ ...schedule, [day]: items });
  };
  
  const resetToDefault = () => {
    if (confirm('確定要重置所有行程嗎？您的修改將會消失。')) {
      save(INITIAL_SCHEDULE);
    }
  };

  return { schedule, isLoaded, addItem, deleteItem, updateItem, moveItem, resetToDefault };
}