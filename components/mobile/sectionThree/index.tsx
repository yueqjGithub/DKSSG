import { useContext, useEffect, useMemo, useRef, useState } from 'react'
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
      '1. 活動時間：即日起至全平台上線當天00:00，上線時間請留意官方後續發佈的公告。（以GMT+8時區為準）',
      '2. 若官方Facebook主頁追蹤人數突破2萬人，遊戲上線後全伺服器玩家都將獲得對應獎勵；',
      '3. 若官方Facebook主頁點讚人數突破2萬人，遊戲上線後全伺服器玩家都將獲得對應獎勵；'
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
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          console.log(containerRef.current!.offsetTop)
          const container = document.querySelector('.m-page-container')
          container!.scrollTo(0, containerRef.current!.offsetTop)
        }
      })
    }, {
      threshold: [0.15]
    })
    if (containerRef.current) {
      io.observe(containerRef.current)
    }
    return () => {
      io.disconnect()
    }
  }, [containerRef])
  return (
    <div ref={containerRef} className={`${styles.container} flex-col flex-jst-start flex-ali-center`}
      style={{ backgroundImage: `url(${imgPrefix}/mobileImg/sec3bg.png)` }}
    >
      {/* rule */}
      {
        showRule && (
          <div className={`${styles.ruleContainer} cus-slide-top-in flex-col flex-jst-center flex-ali-center`}>
            <div className={`${styles.ruleContent} flex-col flex-jst-center flex-ali-center`} style={{ backgroundImage: `url(${imgPrefix}/mobileImg/modalBg.png)` }}>
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
      {/* content */}
      <div className={`${styles.contentContainer} flex-col flex-jst-start flex-ali-center`}>
        <div className={`${styles.ruleTips} full-width flex-row flex-jst-center flex-ali-center`}>
          <p>*社群平台關注達成獎勵</p>
          <img src={`${imgPrefix}/pc/sec3/symbol.png`} alt="" className='cursor-pointer click-scale' onClick={() => openRule('fb')}/>
        </div>
        <div className={`${styles.contTop} flex-row flex-jst-center flex-ali-start`} style={{ backgroundImage: `url(${imgPrefix}/pc/sec3/c_bg.png)` }}>
          {
            leftList.map((item, idx) => {
              return (
                <div className={`${styles.leftItem} flex-col flex-jst-btw flex-ali-center self-stretch`} key={idx}
                >
                  <div className={`${styles.leftItemTop} flex-1 flex-col flex-jst-start flex-ali-center`} style={{ backgroundImage: `url(${imgPrefix}/pc/sec3/c_out.png)` }}>
                    <p className={styles.titP}>{item.text}</p>
                    <div className='flex-row flex-jst-center flex-ali-center'>
                      <p>突破</p>
                      <p>{fb[idx]?.text[0].data}</p>
                    </div>
                    <div className={`flex-col flex-jst-start flex-ali-center ${styles.fbPrizeItem} ${styles.first}`}>
                      <div className={`${styles.imgContainer} flex-row flex-jst-center flex-ali-center`}
                        style={{ backgroundImage: `url(${imgPrefix}/pc/sec3/c_img_out.png)` }}
                      >
                        <img src={fb[idx]?.images[0].data} alt=""/>
                      </div>
                      <span className={styles.allowWidth}>{fb[idx]?.images[0].link}</span>
                    </div>
                    <div className='flex-row flex-jst-center flex-ali-start'>
                      <div className={`${styles.fbPrizeItem} flex-col flex-jst-start flex-ali-center`}>
                        <div className={`${styles.imgContainer} flex-row flex-jst-center flex-ali-center`}
                          style={{ backgroundImage: `url(${imgPrefix}/pc/sec3/c_img_out.png)` }}
                        >
                          <img src={fb[idx]?.images[1].data} alt=""/>
                        </div>
                        <span>{fb[idx]?.images[1].link}</span>
                      </div>
                      <div className={`${styles.fbPrizeItem} flex-col flex-jst-start flex-ali-center`}>
                        <div className={`${styles.imgContainer} flex-row flex-jst-center flex-ali-center`}
                          style={{ backgroundImage: `url(${imgPrefix}/pc/sec3/c_img_out.png)` }}
                        >
                          <img src={fb[idx]?.images[2].data} alt=""/>
                        </div>
                        <span>{fb[idx]?.images[2].link}</span>
                      </div>
                    </div>
                  </div>
                  <img src={`${imgPrefix}${item.img}`} alt="" className={`${styles.hBtn} hover-scale cursor-pointer`} onClick={() => openLink(fb[idx]?.text[0].link)}/>
                </div>
              )
            })
          }
        </div>
        {/* 鏈接出 */}
        <div className={`${styles.lineContainer} flex-row flex-jst-center flex-ali-center`}>
          <img src={`${imgPrefix}/pc/sec3/c_line.png`} alt="" />
          <div className={`${styles.ruleTips} ${styles.ruleTipsR} flex-row flex-jst-center flex-ali-center`}>
            <p>*社群平台關注達成獎勵</p>
            <img src={`${imgPrefix}/pc/sec3/symbol.png`} alt=""  className='cursor-pointer click-scale'  onClick={() => openRule('invite')}/>
          </div>
          <img src={`${imgPrefix}/pc/sec3/c_line.png`} alt="" />
        </div>
        {/* btm */}
        <div className={`${styles.contBtm} flex-col flex-jst-start flex-ali-center`} style={{ backgroundImage: `url(${imgPrefix}/pc/sec3/c_bg.png)` }}>
          <div className={`${styles.inviteUl} flex-row flex-ali-start`}>
            {
              invite.map((item, idx) => {
                return (
                  <div key={idx} className={`${styles.rPrizeItem} flex-col flex-jst-start flex-ali-center self-stretch`}
                  style={{ backgroundImage: `url(${imgPrefix}/pc/sec3/c_out.png)` }}
                  >
                    <div className={`${styles.rPrizeTit} flex-row flex-jst-center flex-ali-end`}>
                      <p>邀请</p>
                      <p>{item.text[0].data}</p>
                    </div>
                    <div className={`flex-col flex-jst-start flex-ali-center ${styles.rPrize}`}>
                      <div className={`${styles.imgContainer} flex-row flex-jst-center flex-ali-center`}
                        style={{ backgroundImage: `url(${imgPrefix}/pc/sec3/c_img_out.png)` }}
                      >
                        <img src={item.images[0].data} alt="" />
                      </div>
                      <span>{item.images[0].link}</span>
                    </div>
                    <div className={`flex-col flex-jst-start flex-ali-center ${styles.rPrize}`}>
                      <div className={`${styles.imgContainer} flex-row flex-jst-center flex-ali-center`}
                        style={{ backgroundImage: `url(${imgPrefix}/pc/sec3/c_img_out.png)` }}
                      >
                        <img src={item.images[1].data} alt="" />
                      </div>
                      <span>{item.images[1].link}</span>
                    </div>
                  </div>
                )
              })
            }
          </div>
          <img src={`${imgPrefix}/pc/sec3/yq.png`} alt="" className={`${styles.inviteBtn} cursor-pointer hover-scale`} onClick={() => inviteHandler()}/>
        </div>
      </div>
      {/* <div className={styles.contentContainer}>
        <img src={`${imgPrefix}/mobileImg/sec3cg.png`} alt="" className={styles.bgImg}/>
        <div className={styles.content}>
          <div className={`flex-row flex-jst-center flex-ali-start ${styles.topOut}`}>
            
            {
              leftList.map((item, idx) => {
                return (
                  <div className={`${styles.leftItem} flex-col flex-jst-start flex-ali-center`} key={idx}>
                    <p className={styles.titP}>{item.text}</p>
                    <div className='flex-row flex-jst-center flex-ali-center'>
                      <p>突破</p>
                      <p>{fb[idx]?.text[0].data}</p>
                    </div>
                    <div className={`flex-col flex-jst-start flex-ali-center ${styles.fbPrizeItem} ${styles.first}`}>
                      <img src={fb[idx]?.images[0].data} alt=""/>
                      <span>{fb[idx]?.images[0].link}</span>
                    </div>
                    <div className='flex-row flex-jst-center flex-ali-start'>
                      <div className={`${styles.fbPrizeItem} flex-col flex-jst-start flex-ali-center`}>
                        <img src={fb[idx]?.images[1].data} alt=""/>
                        <span>{fb[idx]?.images[1].link}</span>
                      </div>
                      <div className={`${styles.fbPrizeItem} flex-col flex-jst-start flex-ali-center`}>
                        <img src={fb[idx]?.images[2].data} alt=""/>
                        <span>{fb[idx]?.images[2].link}</span>
                      </div>
                    </div>
                    <img src={`${imgPrefix}${item.img}`} alt="" className={`${styles.hBtn} hover-scale cursor-pointer`} onClick={() => openLink(fb[idx]?.text[0].link)}/>
                  </div>
                )
              })
            }
          </div>
          <div className={`${styles.ruleTipsR} full-width flex-row flex-jst-center flex-ali-center`}>
            <p>*社群平台關注達成獎勵</p>
            <img src={`${imgPrefix}/pc/sec3/symbol.png`} alt=""  className='cursor-pointer click-scale'  onClick={() => openRule('invite')}/>
          </div>
          <div className={`${styles.contContainer} flex-row flex-wrap flex-jst-center flex-ali-start`}>
            {
              invite.map((item, idx) => {
                return (
                  <div key={idx} className={`${styles.rPrizeItem} flex-col flex-jst-start flex-ali-center`}>
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
      </div> */}
    </div>
  )
}

export default SectionThree
