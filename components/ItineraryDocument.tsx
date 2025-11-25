import React from 'react';
import { MapPin, Utensils, ShoppingBag, Moon, Sun, Plane, Train, Hotel, AlertCircle, CheckSquare } from 'lucide-react';

// --- Reusable Components ---

const DayHeader = ({ day, date, title, tags, accommodation }: { day: string, date: string, title: string, tags: string[], accommodation?: string }) => (
  <div className="mb-6 break-inside-avoid page-break-after-avoid">
    <div className="flex items-center gap-3 mb-2">
      <span className="bg-red-700 text-white px-3 py-1 rounded-md font-bold text-lg print:text-black print:border print:border-black print:bg-transparent">
        {day}
      </span>
      <h2 className="text-2xl font-bold text-stone-800">{date} {title}</h2>
    </div>
    
    <div className="flex flex-wrap gap-2 mb-3 text-sm text-stone-600">
      {tags.map((tag, i) => (
        <span key={i} className="bg-stone-100 px-2 py-0.5 rounded border border-stone-200 print:border-stone-400">#{tag}</span>
      ))}
    </div>
    
    {accommodation && (
      <div className="flex items-center gap-2 text-stone-700 bg-orange-50 p-2 rounded border border-orange-100 print:bg-transparent print:border-stone-300">
        <Hotel className="w-4 h-4 text-orange-600 print:text-black" />
        <span className="font-medium">住宿：</span>
        <span>{accommodation}</span>
      </div>
    )}
    <hr className="mt-4 border-red-200" />
  </div>
);

const ScheduleTable = ({ items }: { items: { time: string, title: string, desc: React.ReactNode, highlight?: boolean }[] }) => (
  <div className="mb-8 border border-stone-200 rounded-lg overflow-hidden break-inside-avoid">
    <table className="w-full text-sm text-left">
      <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200">
        <tr>
          <th className="px-4 py-2 w-20">時間</th>
          <th className="px-4 py-2 w-1/3">行程內容</th>
          <th className="px-4 py-2">說明 / 導航</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-stone-100">
        {items.map((item, idx) => (
          <tr key={idx} className={item.highlight ? "bg-orange-50 print:bg-stone-100" : ""}>
            <td className="px-4 py-3 font-bold text-stone-800 align-top">{item.time}</td>
            <td className="px-4 py-3 font-medium text-stone-900 align-top">{item.title}</td>
            <td className="px-4 py-3 text-stone-600 align-top whitespace-pre-wrap">{item.desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const SectionList = ({ title, icon: Icon, children }: { title: string, icon: any, children?: React.ReactNode }) => (
  <div className="mb-8 break-inside-avoid">
    <h3 className="text-lg font-bold text-red-800 mb-3 flex items-center gap-2 border-b border-red-100 pb-1">
      <Icon className="w-5 h-5" />
      {title}
    </h3>
    <div className="space-y-3">
      {children}
    </div>
  </div>
);

const ListItem = ({ title, desc, link, note }: { title: string, desc?: string, link?: string, note?: string }) => (
  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 text-sm">
    <div className="font-bold text-stone-800 shrink-0">
        {title}
    </div>
    <div className="text-stone-600 flex-grow">
      {desc}
      {note && <span className="ml-1 text-xs text-orange-600 border border-orange-200 rounded px-1">{note}</span>}
    </div>
    {link && (
      <a href={link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-xs shrink-0 flex items-center gap-0.5 print:text-black print:no-underline">
        <MapPin className="w-3 h-3" /> 地圖
      </a>
    )}
  </div>
);

const InfoBox = ({ children }: { children?: React.ReactNode }) => (
  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 text-sm text-yellow-900 break-inside-avoid print:border-black print:bg-transparent">
    {children}
  </div>
);

// --- Main Document Component ---

const ItineraryDocument = () => {
  return (
    <div className="font-sans text-stone-800 max-w-none">
      
      {/* Cover / Title */}
      <div className="text-center mb-10 pb-8 border-b-2 border-red-800">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-red-800 mb-2">🍁 2025 京阪紅葉・家族旅行手冊</h1>
        <p className="text-lg text-stone-600 font-medium">11/29 (五) — 12/03 (二)</p>
      </div>

      {/* Intro Info */}
      <InfoBox>
        <h4 className="font-bold mb-2 flex items-center gap-2"><AlertCircle className="w-4 h-4"/> 旅遊小幫手</h4>
        <ul className="list-disc list-inside space-y-1">
          <li>天氣預測：<a href="https://tenki.jp/forecast/6/29/6110/26100/" className="underline text-yellow-800 print:no-underline print:text-black">京都一週天氣 (tenki.jp)</a></li>
          <li>緊急準備：請務必將 <strong>VJW QR Code</strong> 截圖，並隨身攜帶護照。</li>
        </ul>
      </InfoBox>

      {/* DAY 1 */}
      <section className="mb-12">
        <DayHeader 
          day="DAY 1" 
          date="11/29 (五)" 
          title="啟程・前往京都" 
          tags={['移動日', 'Haruka 特急', '清水寺住宿']}
          accommodation="RESI STAY 五条坂 (清水寺山腳)"
        />
        
        <ScheduleTable items={[
          { time: '09:20', title: '🏠 HOME', desc: '出發前往高鐵站' },
          { time: '10:00', title: '🚅 台中高鐵站', desc: '搭乘高鐵前往桃園' },
          { time: '10:30', title: '🚄 桃園高鐵站', desc: '轉機捷 (10:47 或 11:02 發車)' },
          { time: '12:10', title: '🛫 桃園機場 T1', desc: '虎航櫃檯報到 (7號櫃檯)\n先去晃晃再進候機室' },
          { time: '14:40', title: '✈️ 起飛 (IT212)', desc: '台北 TPE → 大阪 KIX', highlight: true },
          { time: '17:55', title: '🛬 抵達關西機場', desc: '準備 VJW 截圖、護照\n預留入境審查時間' },
          { time: '19:30', title: '🚆 Haruka 特急', desc: '前往京都車站\n⚠️ 用 Klook 憑證兌換實體票', highlight: true },
          { time: '21:00', title: '🚕 移動至飯店', desc: '京都車站 → RESI STAY\n建議搭 Uber 或計程車' },
          { time: '21:15', title: '🍜 晚餐 / 補給', desc: '飯店附近覓食' },
          { time: '23:00', title: '💤 休息睡覺', desc: '⚠️ 明天要超級早起，請早睡！' },
        ]} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SectionList title="晚餐與補給 (步行 3~5 分)" icon={Utensils}>
            <ListItem title="Negibouzu (蔥坊主)" desc="鐵板料理、御好燒 (~22:00)" link="https://maps.app.goo.gl/YfP375H7UjQrGbjJ6" />
            <ListItem title="Mon Chan" desc="日式料理、居酒屋" link="https://maps.app.goo.gl/Dq9Z1YzFXgU4w2aY6" />
            <ListItem title="Gion Negiyaki Kana East" desc="深夜選擇，蔥燒/大阪燒 (~02:00)" link="https://maps.app.goo.gl/fsvMvfwryJ4QcZgk8" note="推" />
          </SectionList>
          
          <SectionList title="超商超市" icon={ShoppingBag}>
            <ListItem title="FRESCO 超市" desc="24H，補給水、水果推薦" link="https://maps.app.goo.gl/gC8DKNt6XNd9KyEu5" />
            <ListItem title="Lawson" link="https://maps.app.goo.gl/2wjpaSjv3UwxVKxdA" />
            <ListItem title="7-11" link="https://maps.app.goo.gl/oSjcdw7WegRmr9sT7" />
            <ListItem title="全家 FamilyMart" link="https://maps.app.goo.gl/4X3sEzKWJy77MHD48" />
          </SectionList>
        </div>
      </section>
      
      {/* Page break for printing */}
      <div className="print:break-before-page"></div>

      {/* DAY 2 */}
      <section className="mb-12">
        <DayHeader 
          day="DAY 2" 
          date="11/30 (六)" 
          title="京都：清水寺 & 祇園" 
          tags={['早起避人潮', '千年古都', '錦市場']}
          accommodation="RESI STAY 五条坂"
        />

        <ScheduleTable items={[
          { time: '05:30', title: '⏰ 起床梳洗', desc: '痛苦一下，照片會很美！', highlight: true },
          { time: '06:00', title: '📸 二三年坂 & 清水寺', desc: '抵達後右轉，享受寧靜空景' },
          { time: '07:50', title: '☕ 二年坂星巴克', desc: '拍復古外觀，喝杯草莓限定星冰樂' },
          { time: '09:30', title: '🍡 清水坂', desc: '商店陸續開門，邊走邊吃' },
          { time: '10:30', title: '⛩️ 八坂神社 & 花見小路', desc: '沿路下坡散步，輕鬆逛' },
          { time: '11:30', title: '🦆 祇園白川 & 鴨川', desc: '京都最美的散步路徑' },
          { time: '12:30', title: '🍤 午餐時間', desc: '⚠️ 週末熱門時段可能需排隊' },
          { time: '13:30', title: '🛍️ 錦市場 & 新京極', desc: '逛街、買伴手禮、吃小吃' },
          { time: '16:00', title: '🦊 伏見稻荷大社', desc: '千本鳥居 (傍晚氣氛神秘)' },
          { time: '17:30', title: '🎁 京都車站', desc: '伴手禮採購 / 站前地下街' },
          { time: '18:30', title: '🍁 夜楓', desc: '清水寺 或 東寺 夜間拜觀' },
          { time: '20:00', title: '🥢 晚餐', desc: '視參觀地點決定' },
        ]} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <SectionList title="清水坂甜點" icon={Utensils}>
            <ListItem title="本家 西尾八橋" desc="08:30~，試吃很大方" link="https://maps.app.goo.gl/NWu2XXGyLvMP5EXH9" />
            <ListItem title="MALEBRANCHE" desc="09:00~，必買茶之菓" link="https://maps.app.goo.gl/rwkCyid9hkpVvTxTA" />
            <ListItem title="Kyo-Baum" desc="抹茶年輪蛋糕" link="https://maps.app.goo.gl/S2wsL3gpmPfRmr3P6" />
            <ListItem title="藤菜美" desc="醬油糰子/洛水，有座位" link="https://maps.app.goo.gl/EWdwDg8ofGZgB5nJ8" />
            <ListItem title="GOKAGO" desc="現刷抹茶飲品" link="https://maps.app.goo.gl/S2wsL3gpmPfRmr3P6" />
          </SectionList>

          <SectionList title="午餐口袋名單" icon={Utensils}>
            <ListItem title="La Curry" desc="咖哩 (11:00~)" link="https://maps.app.goo.gl/knNKuKEW7AMa7eXY7" />
            <ListItem title="麵屋 豬一" desc="拉麵，米其林推薦需排隊" link="https://maps.app.goo.gl/aFfvhCdkCESZ33a19" />
            <ListItem title="有喜屋 先斗町本店" desc="天婦羅/蕎麥" link="https://maps.app.goo.gl/fvesVrcDi4tmah589" />
            <ListItem title="Makino 天丼" desc="現炸大碗滿意" link="https://maps.app.goo.gl/hWgj3g6kJkRZTmp29" />
          </SectionList>
        </div>

        <SectionList title="錦市場 & 河原町推薦" icon={ShoppingBag}>
            <ListItem title="Nanaya Kyoto Sanjo" desc="世界最濃抹茶冰淇淋 (1~7級)" />
            <ListItem title="こんなもんじゃ" desc="豆乳甜甜圈、豆乳冰淇淋" link="https://www.google.com/maps/search/?api=1&query=Konnamonja+Nishiki+Market" />
            <ListItem title="博士章魚燒" desc="口感軟爛派，價格親民" link="https://www.google.com/maps/search/?api=1&query=Karikari+Hakase+Kyoto" />
            <ListItem title="錦 魚力" desc="炸海鮮串、天婦羅 (必吃)" link="https://www.google.com/maps/search/?api=1&query=Nishiki+Uoriki" />
            <ListItem title="3 COINS+ plus" desc="Mina京都店，質感雜貨" link="https://maps.app.goo.gl/ateBfTvoS45nxgx86" />
            <ListItem title="Standard Products" desc="京都河原町店，大創高級版必逛" link="https://maps.app.goo.gl/fQfDwFobHVTn1P6r8" />
        </SectionList>
      </section>

      <div className="print:break-before-page"></div>

      {/* DAY 3 */}
      <section className="mb-12">
        <DayHeader 
          day="DAY 3" 
          date="12/01 (日)" 
          title="嵐山・teamLab・移動至大阪" 
          tags={['竹林小徑', 'teamLab', '搬家到大阪']}
          accommodation="The OneFive Osaka Namba"
        />

        <ScheduleTable items={[
          { time: '06:30', title: '👋 退房出發', desc: '計程車 → 京都車站 寄放行李' },
          { time: '08:00', title: '🎋 嵐山', desc: '到 嵯峨小學校前 搭車去 愛宕念佛寺 (避開人潮)' },
          { time: '11:00', title: '🍱 嵐山午餐', desc: '喜重郎 (牛排飯) 或 亀山家 (天婦羅)' },
          { time: '14:00', title: '🎨 teamLab', desc: 'Biovortex Kyoto (⚠️ 需預約)' },
          { time: '15:30', title: '🛍️ 京都車站', desc: 'JR前往難波＆領行李＆最後伴手禮採購' },
          { time: '17:00', title: '🚆 前往難波', desc: '入住 The OneFive Osaka Namba' },
          { time: '19:00', title: '🦀 道頓堀 & 心齋橋', desc: '跑跑人、晚餐、逛藥妝' },
        ]} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SectionList title="嵐山推薦" icon={Utensils}>
             <ListItem title="嵐山 喜重郎" desc="和牛牛排重，庭園景觀" link="https://www.google.com/maps/search/?api=1&query=Arashiyama+Kijuro" note="午餐" />
             <ListItem title="亀山家" desc="蕎麥麵、天婦羅，溫馨老店" link="https://www.google.com/maps/search/?api=1&query=Kameyamya+Arashiyama" note="午餐" />
             <ListItem title="京豆庵" desc="倒立也不掉的豆腐冰淇淋" link="https://www.google.com/maps/search/?api=1&query=Kyozuan+Arashiyama" />
             <ListItem title="古都芋本舗" desc="大玉炙燒醬油糰子" link="https://www.google.com/maps/search/?api=1&query=Kotoimo+Honpo+Arashiyama" />
             <ListItem title="MALEBRANCHE" desc="茶茶棒 (抹茶閃電泡芙)" link="https://www.google.com/maps/search/?api=1&query=MALEBRANCHE+Arashiyama" />
             <ListItem title="米菲櫻花廚房" desc="Miffy 造型紅豆麵包" link="https://www.google.com/maps/search/?api=1&query=Miffy+Sakura+Kitchen+Arashiyama" />
          </SectionList>
          
          <SectionList title="大阪甜點與小吃" icon={Utensils}>
            <ListItem title="鳴門鯛燒本舖" desc="天然鯛魚燒 (千日前)" link="https://www.google.com/maps/search/?api=1&query=Naruto+Taiyaki+Honpo+Sennichimae+Aiaibashi" />
            <ListItem title="Strawberry Mania" desc="草莓大福、可麗餅" link="https://www.google.com/maps/search/?api=1&query=Strawberry+Mania+Shinsaibashi" />
            <ListItem title="BAKE CHEESE TART" desc="半熟起司塔 (高島屋)" link="https://www.google.com/maps/search/?api=1&query=BAKE+CHEESE+TART+Osaka+Takashimaya" />
            <ListItem title="Canele du Japon" desc="可麗露專賣 (長堀橋)" link="https://www.google.com/maps/search/?api=1&query=Canele+du+Japon+Nagahoribashi" />
            <ListItem title="Takoyaki Wanaka" desc="必吃章魚燒 (千日前本店)" link="https://www.google.com/maps/search/?api=1&query=Takoyaki+Wanaka+Sennichimae" />
          </SectionList>
        </div>
      </section>

      <div className="print:break-before-page"></div>

      {/* DAY 4 */}
      <section className="mb-12">
        <DayHeader 
          day="DAY 4" 
          date="12/02 (一)" 
          title="箕面勝尾寺・梅田購物・夜景" 
          tags={['勝尾寺達摩', '箕面瀑布', '百貨公司']}
          accommodation="The OneFive Osaka Namba"
        />

        <ScheduleTable items={[
          { time: '06:30', title: '🚇 前往箕面萱野', desc: '難波 → 梅田 → 箕面萱野 → 計程車' },
          { time: '08:00', title: '👹 勝尾寺', desc: '滿山滿谷的小達摩，必拍！📸' },
          { time: '10:30', title: '🚕 箕面瀑布', desc: '搭計程車去，走路下山 (約40分) 吸芬多精' },
          { time: '13:00', title: '🏙️ 梅田市區午餐', desc: 'Grand Front 或 LUCUA 百貨' },
          { time: '15:00', title: '🛍️ 梅田 / 天滿', desc: '購物迷宮，想買什麼都有' },
          { time: '17:30', title: '🎄 聖誕市集巡禮', desc: '阪急梅田 (9F)、梅田藍天大廈 (1F)、Grand Front (1F)、梅北廣場 (聖誕熊)' },
          { time: '18:30', title: '🌃 WowUs', desc: '大阪地標絕美夜景' },
          { time: '19:30', title: '🏯 回難波', desc: '晚餐、LIFE超市、唐吉訶德補貨' },
        ]} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SectionList title="梅田 & 天滿午餐" icon={Utensils}>
             <ListItem title="Unatoto" desc="平價鰻魚飯 (南森町)" link="https://maps.app.goo.gl/query=Unatoto+Minamimorimachi" />
             <ListItem title="Robata to Kamameshi Ioroi" desc="爐端燒、釜飯" link="https://maps.app.goo.gl/query=Robata+to+Kamameshi+Ioroi+Tenma" />
             <ListItem title="お好み焼き 千草" desc="老牌大阪燒" link="https://maps.app.goo.gl/query=Okonomiyaki+Chigusa+Tenma" />
             <ListItem title="Rojiura Curry SAMURAI" desc="北海道湯咖哩" link="https://maps.app.goo.gl/query=Rojiura+Curry+Samurai+Grand+Front+Osaka" />
          </SectionList>
          
          <SectionList title="梅田 & 天滿小吃" icon={Utensils}>
            <ListItem title="OSA COFFEE" desc="中崎町文青布丁" link="https://maps.app.goo.gl/query=OSA+COFFEE+Nakazakicho" />
            <ListItem title="Umaiya (うまい屋)" desc="米其林推薦章魚燒" link="https://maps.app.goo.gl/query=Umaiya+Takoyaki+Tenma" />
            <ListItem title="前田豆腐店" desc="豆腐冰、豆漿布丁" link="https://maps.app.goo.gl/query=Maeda+Tofu+Shop+Tenma" />
            <ListItem title="中村屋" desc="現炸可樂餅名店" link="https://maps.app.goo.gl/query=Nakamuraya+Croquette+Tenma" />
            <ListItem title="grenier" desc="烤布蕾千層酥 (LUCUA 1100)" link="https://maps.app.goo.gl/query=grenier+Umeda+Lucua" />
            <ListItem title="Sugar Butter Tree" desc="砂糖奶油樹 (阪急B1)" link="https://maps.app.goo.gl/query=Sugar+Butter+Tree+Hankyu+Umeda" />
          </SectionList>
        </div>
      </section>

      {/* DAY 5 */}
      <section className="mb-12 break-inside-avoid">
        <DayHeader 
          day="DAY 5" 
          date="12/03 (二)" 
          title="大阪 → 溫暖的家" 
          tags={['大阪城', '黑門市場', '搭機返台']}
        />

        <ScheduleTable items={[
          { time: '08:00', title: '🍳 起床吃早餐', desc: '超商 or 麥當勞' },
          { time: '09:00', title: '🏯 大阪城公園', desc: '搭電車到 大阪商務園區站' },
          { time: '11:00', title: '🍣 黑門市場 午餐', desc: '狂吃和牛、生魚片、烤扇貝' },
          { time: '14:00', title: '🛍️ 最後補貨', desc: '難波周邊最後採買' },
          { time: '15:00', title: '🚆 前往機場', desc: '難波站 搭乘南海 Rapi:t 特急 → 關西機場' },
          { time: '18:55', title: '🛫 起飛回台灣 (IT213)', desc: '滿載而歸！', highlight: true },
        ]} />
      </section>

      <div className="print:break-before-page"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Checklist */}
        <div className="bg-stone-50 border border-stone-200 rounded-lg p-6 break-inside-avoid">
          <h3 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-red-700"/> 必備物品檢查表
          </h3>
          <ul className="space-y-2 text-stone-700">
            {['護照 (效期6個月+)', '身分證', 'VJW QR Code 截圖', '網卡/漫遊 開通', '日幣現金 (5-7萬)', '信用卡 (2張)', '好走的球鞋', '行動電源', '個人藥品'].map(item => (
              <li key={item} className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-stone-400 rounded-sm"></div>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Accommodation Info */}
        <div className="bg-stone-50 border border-stone-200 rounded-lg p-6 break-inside-avoid">
          <h3 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
            <Hotel className="w-5 h-5 text-red-700"/> 住宿資訊
          </h3>
          
          <div className="mb-4">
            <h4 className="font-bold text-stone-900">京都：RESI STAY 五条坂</h4>
            <p className="text-sm text-stone-600">〒605-0846 京都府京都市東山区五条橋東</p>
            <p className="text-sm text-stone-600">+81-75-353-7744</p>
          </div>
          
          <div>
            <h4 className="font-bold text-stone-900">大阪：The OneFive Osaka Namba</h4>
            <p className="text-sm text-stone-600">〒542-0073 大阪府大阪市中央区日本橋</p>
            <p className="text-sm text-stone-600">+81-6-6630-6655</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryDocument;