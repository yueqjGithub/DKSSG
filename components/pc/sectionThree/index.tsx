import { useContext, useMemo, useState } from 'react'
import { Context } from '../../../store'
import styles from './index.module.scss'

type Props = {
  fbAndInvite: {
    fb: any[]
    invite: any[]
  }
  inviteHandler: Function
}

const leftList = [
  { text: '*Facebook追蹤', img: '/pc/sec3/zz.png' },
  { text: '*Facebook點贊', img: '/pc/sec3/dz.png' }
]

const rules = {
  fb: {
    join: [
      '1. 活動時間：即日起至全平台上線當天00:00，上線時間請留意官方後續發佈的公告。（以GMT+8時區為準）',
      '2. 若官方Facebook主頁追蹤人數突破2萬人，遊戲上線後全伺服器玩家都將獲得對應獎勵；',
      '3. 若官方Facebook主頁點讚人數突破2萬人，遊戲上線後全伺服器玩家都將獲得對應獎勵；'
    ],
    care: [
      '1. 若活動期間經理遇到任何問題，請透過官方電子郵件信箱尋求幫助：cs.monsteroverload@avalongames.com；',
      '2. AvalonGames保留法律允許範圍內對活動進行補充解釋的權利。'
    ]
  },
  invite: {
    join: [
      '1. 活動時間：即日起至全平台上線當天00:00，上線時間請留意官方後續發佈的公告。（以GMT+8時區為準）；',
      '2. 玩家需要先點擊“我要應徵”進行預約，再進行邀請好友操作；',
      '3. 好友通過玩家專屬追蹤鏈接點擊進行預約後，視為成功邀請；',
      '4. 可以通過首頁“獎勵查詢”按鈕查詢到相應禮包碼，在遊戲上線後即可使用。'
    ],
    care: [
      '1. 若活動期間經理遇到任何問題，請透過官方電子郵件信箱尋求幫助：cs.monsteroverload@avalongames.com；',
      '2. AvalonGames保留法律允許範圍內對活動進行補充解釋的權利。'
    ]
  }
}

const SectionThree = ({ fbAndInvite, inviteHandler }: Props) => {
  const { state } = useContext(Context)
  const { imgPrefix } = state
  const { fb, invite } = fbAndInvite
  const openLink = (link?: string) => {
    if (link) {
      window.open(link)
    }
  }
  const [showRule, setShowRule] = useState(false)
  const [ruleType, setType] = useState<'fb' | 'invite'>('fb')
  const curRule = useMemo(() => {
    return rules[ruleType]
  }, [ruleType])
  const openRule = (type: 'fb' | 'invite') => {
    setType(type)
    setShowRule(true)
  }
  const closeRule = () => {
    setShowRule(false)
  }
  return (
    <div className={`${styles.container} flex-col flex-jst-center flex-ali-center`} style={{ backgroundImage: `url(${imgPrefix}/pc/normalBg.png)` }}>
      {
        showRule && (
          <div className={`${styles.ruleContainer} cus-slide-top-in flex-col flex-jst-center flex-ali-center`}>
            <div className={`${styles.ruleContent} flex-col flex-jst-center flex-ali-center`} style={{ backgroundImage: `url(${imgPrefix}/pc/sec3/rule_bg.png)` }}>
              <p className={styles.ruleTit}>参与方式</p>
              {
                curRule.join.map((item, index) => {
                  return <p key={index} className={styles.ruleDetail}>{item}</p>
                })
              }
              <p className={styles.ruleTit}>注意事项</p>
              {
                curRule.care.map((item, index) => {
                  return <p key={index} className={styles.ruleDetail}>{item}</p>
                })
              }
            </div>
            <img src={`${imgPrefix}/pc/sec3/closeBtn.png`} alt="" className={`${styles.closeBtn} cursor-pointer`} onClick={() => closeRule()}/>
          </div>
        )
      }
      {/* left */}
      <img src={`${imgPrefix}/pc/sec3tit.png`} alt="" className={styles.titImg}/>
      <div className='flex-row flex-jst-center flex-ali-start'>
        <div className={styles.lContainer}>
          <div className={`${styles.ruleTips} full-width flex-row flex-jst-center flex-ali-center`}>
            <p>*社群平台關注達成獎勵</p>
            <img src={`${imgPrefix}/pc/sec3/symbol.png`} alt="" className='cursor-pointer hover-scale' onClick={() => openRule('fb')}/>
          </div>
          <div className={styles.prizeBgContainer}>
            <img src={`${imgPrefix}/pc/sec3/bg_l.png`} alt="" className={styles.bgImg}/>
            <div className={`${styles.contContainer} flex-row flex-jst-center flex-ali-start`}>
              {
                leftList.map((item, idx) => {
                  return (
                    <div className={`${styles.leftItem} flex-col flex-jst-start flex-ali-center`} key={idx}>
                      <p className={styles.titP}>{item.text}</p>
                      <div className='flex-row flex-jst-center flex-ali-center'>
                        <p>突破</p>
                        <p>{fb[idx]?.text[0].data}</p>
                      </div>
                      {/* prize1 */}
                      <div className={`flex-col flex-jst-start flex-ali-center ${styles.fbPrizeItem} ${styles.first}`}>
                        <img src={fb[idx]?.images[0].data} alt=""/>
                        <span>{fb[idx]?.images[0].link}</span>
                      </div>
                      <div className={`${styles.leftBtmCont} flex-row flex-jst-center flex-ali-start`}>
                        <div className={`${styles.fbPrizeItem} flex-col flex-jst-start flex-ali-center`} style={{ transform: `translateX(-${idx === 0 ? 0.15 : 0.05}rem)` }}>
                          <img src={fb[idx]?.images[1].data} alt=""/>
                          <span>{fb[idx]?.images[1].link}</span>
                        </div>
                        <div className={`${styles.fbPrizeItem} flex-col flex-jst-start flex-ali-center`}>
                          <img src={fb[idx]?.images[2].data} alt=""/>
                          <span>{fb[idx]?.images[2].link}</span>
                        </div>
                      </div>
                      {/* btn */}
                      <img src={`${imgPrefix}${item.img}`} alt="" className={`${styles.hBtn} hover-scale cursor-pointer`} onClick={() => openLink(fb[idx]?.text[0].link)}/>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
        {/* center */}
        <img src={`${imgPrefix}/pc/sec3/lj.png`} alt="" className={styles.cContainer}/>
        {/* right */}
        <div className={styles.rContainer}>
          <div className={`${styles.ruleTips} full-width flex-row flex-jst-center flex-ali-center`}>
            <p>*邀請好友拿入職大禮</p>
            <img src={`${imgPrefix}/pc/sec3/symbol.png`} alt=""  className='cursor-pointer hover-scale'  onClick={() => openRule('invite')}/>
          </div>
          <div className={styles.prizeBgContainer}>
            <img src={`${imgPrefix}/pc/sec3/bg_r.png`} alt="" className={styles.bgImg}/>
            <div className={`${styles.contContainer} flex-row flex-wrap flex-jst-center flex-ali-start`}>
              {
                invite.map((item, idx) => {
                  return (
                    <div key={idx} className={`flex-1 ${styles.rPrizeItem} flex-col flex-jst-start flex-ali-center`}>
                      <div className={'flex-row flex-jst-center flex-ali-end'}>
                        <p>邀请</p>
                        <p>{item.text[0].data}</p>
                      </div>
                      <div className={`flex-col flex-jst-start flex-ali-center ${styles.rPrize}`}>
                        <img src={item.images[0].data} alt="" />
                        <span>{item.images[0].link}</span>
                      </div>
                      <div className={`flex-col flex-jst-start flex-ali-center ${styles.rPrize}`}>
                        <img src={item.images[1].data} alt="" />
                        <span>{item.images[1].link}</span>
                      </div>
                    </div>
                  )
                })
              }
              <img src={`${imgPrefix}/pc/sec3/yq.png`} alt="" className={`${styles.inviteBtn} cursor-pointer hover-scale`} onClick={() => inviteHandler()}/>
            </div>
          </div>
        </div>
      </div>
      {/* ty */}
      <img src={`${imgPrefix}/pc/sec3/ty.png`} alt="" className={styles.ty}/>
    </div>
  )
}

export default SectionThree
