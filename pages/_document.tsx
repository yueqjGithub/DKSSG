import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html>
      <Head>
        <meta name="keywords" content="魔爾街之王,阿哇龍,手游,官方,下載,正版,預約,事前登錄,塔防對決,Q版,塔防,策略,roguelike,自走棋,戰術,攻防,卡牌,魔爾街,經理,魔王,勇者,魔物,地下城,迷因,招聘,美女,工作,求職,實習,明日方舟,骰子塔防" />
        <meta name="description" content="《魔爾街之王》是一款結合自走棋與Roguelike玩法的策略塔防手游，遊戲中玩家將入職「魔爾街」，成為一名實習經理，經受來自魔王的重重考驗，率領魔物們建設魔爾街，收復被勇者霸佔的領地。最終誰會通過考核，贏得魔王寶座和財富？ "/>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}