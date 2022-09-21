import styles from './index.module.scss'
import { useContext, useEffect, useMemo, useState } from 'react';
import { httpGet } from '../../../service/http';
import urls from '../../../service/urls';
import { Context } from '../../../store';

type PrizeListType = {
  count: string;
  prizeImg: string;
  prizeImg2: string;
  prizeDesc1: string;
  prizeDesc2: string;
  isFirst?: boolean;
  isLast?: boolean;
}[]

type Props = {
  reserves: any[]
  loginHandler: Function
}

const prizeList = [
  { count: '10W', prizeImg: '/pc/prize/prize1.png', prizeImg2: '/pc/prize/prize2.png', prizeDesc1: '金幣*6666', prizeDesc2: '初級靈能核心*10', isFirst: true },
  { count: '20W', prizeImg: '/pc/prize/prize1.png', prizeImg2: '/pc/prize/prize2.png', prizeDesc1: '金幣*6666', prizeDesc2: '初級靈能核心*10' },
  { count: '30W', prizeImg: '/pc/prize/prize1.png', prizeImg2: '/pc/prize/prize2.png', prizeDesc1: '金幣*6666', prizeDesc2: '初級靈能核心*10' },
  { count: '40W', prizeImg: '/pc/prize/prize1.png', prizeImg2: '/pc/prize/prize2.png', prizeDesc1: '金幣*6666', prizeDesc2: '初級靈能核心*10' },
  { count: '50W', prizeImg: '/pc/prize/prize1.png', prizeImg2: '/pc/prize/prize2.png', prizeDesc1: '金幣*6666', prizeDesc2: '初級靈能核心*10', isLast: true }
]

const SectionTwo = ({reserves, loginHandler}: Props) => {
  const { state } = useContext(Context)
  const { codes, isLogin, imgPrefix, frontBaseUrl } = state
  const alreadyReserve = useMemo(() => {
    return codes.find(item => item.codeType === 'RESERVE') !== undefined
  }, [codes])
  const [curDeg, setDeg] = useState<number>(2)
  const [count, setCount] = useState<number>(0)
  const getCountHandler = async () => {
    const { data: res } = await httpGet(`${frontBaseUrl}${urls.getReserveCount}`)
    // console.log(res.data)
    const target = Math.floor(res.data / 10000)
    setCount(res.data)
    setDeg(target)
  }
  useEffect(() => {
    getCountHandler()
  }, [])
  return (
    <div className={styles.container} style={{ backgroundImage: `url(${imgPrefix}/pc/sec2Bg.png)` }}>
      <div className={`${styles.contentContainer} flex-col flex-jst-start flex-ali-center`}>
        <div className='flex-col flex-jst-start flex-ali-end'>
          <div className={`${styles.countShow} flex-row flex-jst-center flex-ali-end`}>
            <span>已有</span>
            <span>{count}</span>
            <span>人應徵</span>
          </div>
          <div className={styles.updateTip}>*預約數據每日0點刷新</div>
        </div>
        {/* 进度 */}
        <div className='full-width flex-row flex-jst-start flex-ali-start'>
          {
            prizeList.map((item, index) => {
              return (
                <div
                className={`flex-1 ${curDeg <= index ? styles.waitDeg : ''} ${styles.prizeItemContainer} ${item.isFirst && styles.first} ${item.isLast && styles.last} flex-col flex-jst-start flex-ali-center`}
                key={item.count}
                >
                  <div className={`${styles.degreeLine}`}>
                    <div className={styles.degreeSquare}></div>
                  </div>
                  <div className={styles.btmOut}>
                    <div className={styles.sand}></div>
                    <img src={`${imgPrefix}/pc/degreeBg.png`} alt="" className={`full-width ${styles.degBg}`}/>
                    <div className={`${styles.reserveOut} flex-col flex-jst-start flex-ali-center`}>
                      <p>事前登錄人數突破</p>
                      <p>{reserves[index]?.text[2].data}</p>
                      <img src={reserves[index]?.images[0].data} alt="" className={styles.reservePrizeImg}/>
                      <img src={reserves[index]?.images[1].data} alt="" className={styles.reservePrizeImg}/>
                      <p>{reserves[index]?.text[0].data}</p>
                      <p>{reserves[index]?.text[1].data}</p>
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>
        {/* tip */}
        <div className={`${styles.tips} full-width flex-row flex-jst-end`}>
        *達成集結目標，所有獎勵將在正式開服後發放給全伺服器玩家
        </div>
        <div className={`full-width flex-row flex-jst-center flex-ali-center ${styles.logBtnContainer}`}>
          <img src={`${imgPrefix}${isLogin && alreadyReserve ? '/pc/login_Btn_a2.png' : "/pc/loginBtn_ye.png"}`} alt="" className={`${isLogin && alreadyReserve ? '' : 'hover-scale cursor-pointer'}`} onClick={() => {
              if (isLogin && alreadyReserve) return
              loginHandler()
            }}/>
        </div>
      </div>
    </div>
  )
}

export default SectionTwo
