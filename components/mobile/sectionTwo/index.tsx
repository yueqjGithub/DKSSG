import { useContext } from 'react'
import { Context } from '../../../store'
import styles from './index.module.scss'

type Props = {
  reserves: {
    images: { data: string, link?: string }[]
    text: { data: string, link?: string }[]
  }[]
  count: number
  curDeg: number
}
const prizeList = [
  { count: '10萬', isFirst: true },
  { count: '20萬' },
  { count: '30萬' },
  { count: '40萬' },
  { count: '50萬', isLast: true }
]
const SectionTwo = ({ count, reserves, curDeg }: Props) => {
  const { state } = useContext(Context)
  const { imgPrefix } = state
  return (
    <div className={`${styles.container} flex-col flex-jst-start flex-ali-center`}
      style={{ backgroundImage: `url(${imgPrefix}/mobileImg/sec2Bg.png)` }}
    >
      {/* 人數顯示 */}
      <div className={`${styles.countShow} flex-col flex-jst-start flex-ali-end`}>
        <p>已有<span>{count}</span>人應徵</p>
        <div className={styles.tips}>*預約數據每日0點刷新</div>
      </div>
      {/* 進度展示 */}
      <div className={styles.degContainer}>
        {
          prizeList.map((item, index) => {
            return (
              <div key={index} className={`${curDeg <= index ? styles.waitDeg : ''} ${styles.degItem} ${item.isFirst ? styles.start : ''} ${item.isLast ? styles.end : ''} full-width flex-row flex-jst-start flex-ali-center`}>
                {/* 左側進度 */}
                <div className={`${styles.degLine} self-stretch`}>
                  <div className={styles.degSquare}></div>
                </div>
                {/* 右側暫時 */}
                <div className={styles.prizeOut}>
                  <img src={`${imgPrefix}/mobileImg/degBg.png`} alt="" className={styles.prizeBg}/>
                  <div className={`${styles.content} flex-col flex-jst-start flex-ali-center`}>
                    <p className={styles.title}><span>{item.count}</span>事前登錄人數突破</p>
                    <div className={`${styles.prizeList} flex-row flex-jst-center flex-ali-start`}>
                      {/* <img src={reserves[index]?.images[0].data} alt="" className={styles.reservePrizeImg}/>
                      <img src={reserves[index]?.images[1].data} alt="" className={styles.reservePrizeImg}/>
                      <p>{reserves[index]?.text[0].data}</p>
                      <p>{reserves[index]?.text[1].data}</p> */}
                      <div className={`${styles.prizeItem} flex-col flex-jst-start flex-ali-center`}>
                        <img src={reserves[index]?.images[0].data} alt="" className={styles.reservePrizeImg}/>
                        <p>{reserves[index]?.text[0].data}</p>
                      </div>
                      <div className={`${styles.prizeItem} flex-col flex-jst-start flex-ali-center`}>
                        <img src={reserves[index]?.images[1].data} alt="" className={styles.reservePrizeImg}/>
                        <p>{reserves[index]?.text[1].data}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
      {/* tips */}
      <div className={`${styles.tips} full-width flex-row flex-jst-center flex-ali-center font-12`}>
        *達成集結目標，所有獎勵將在正式開服後發放給全伺服器玩家
      </div>
    </div>
  )
}

export default SectionTwo
