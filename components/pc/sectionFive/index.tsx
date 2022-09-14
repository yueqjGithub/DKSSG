import { useContext, useMemo, useState } from 'react'
import { Context } from '../../../store'
import styles from './index.module.scss'

type Props = {
  roleList: any[]
}

const SectionFive = ({ roleList }: Props) => {
  const { state } = useContext(Context)
  const { imgPrefix } = state
  const [cur, setCur] = useState(0)
  const avatarList = useMemo(() => {
    return roleList.map((item) => {
      return item.images[2] // { data: url, link: color }
    })
  }, [roleList])
  const roleImgList = useMemo(() => {
    return roleList.map((item) => {
      return item.images[0] // { data: url, link: color }
    })
  }, [roleList])
  const rightInfoList = useMemo(() => {
    return roleList.map((item) => {
      const len = item.text.length
      return {
        name: item.text[len - 1]?.data || '',
        keys: item.text.map((j: { data: string }) => j.data).filter((i: string, idx: number) => idx < len - 1),
        desc: item.richText[0].data,
        qShow: item.images[1].data
      }
    })
  }, [roleList])
  return (
    <div className={`${styles.container} flex-row flex-jst-start flex-ali-start`} style={{ backgroundImage: `url(${imgPrefix}/pc/normalBg.png)` }}>
      <div className={styles.roleShow}>
        {
          roleImgList.map((item, index) => {
            return (
              <div className={`${styles.roleImgItem} ${cur === index ? styles.show : styles.hide} ${cur === index ? 'cus-slide-left-in' : ''}`} key={index}>
                <img src={item.data} alt="" />
              </div>
            )
          })
        }
      </div>
      <div className={styles.wordShow}>
        <img src={`${imgPrefix}/pc/sec5Tit.png`} alt="" className={styles.titImg}/>
        <img src={`${imgPrefix}/pc/sec5Com.png`} alt="" className={styles.splitImg}/>
        {
          rightInfoList.map((item, idx) => {
            return (
              <div className={`${styles.wordContainer} ${cur === idx ? styles.show : styles.hide} flex-col flex-jst-start flex-ali-start`} key={idx}>
                <div className={styles.title}>{item.name}</div>
                <div className={`${styles.keyContainer} flex-row flex-jst-start flex-ali-center`}>
                  {
                    item.keys.map((keyItem: string, keyIdx: number) => {
                      return (
                        <div key={keyIdx} className='flex-row flex-jst-start flex-ali-center'>
                          {
                            keyIdx === 0 ? (
                              <div className={styles.keyItem}>{keyItem}</div>
                            ) : (
                              <>
                                <div className={styles.cusDot}></div>
                                <div className={styles.keyItem}>{keyItem}</div>
                              </>
                            )
                          }
                        </div>
                      )
                    })
                  }
                </div>
                {/* desc */}
                <div className={styles.desc}>{item.desc}</div>
                {/* qShow */}
                <img src={item.qShow} alt="" className={`${styles.qShow} cus-slide-right-in`}/>
              </div>
            )
          })
        }
      </div>
      {/* 底部 */}
      <div className={`${styles.ctrlOut} full-width flex-wrap flex-row flex-jst-center flex-ali-center`}>
        {
          avatarList.map((item, index) => {
            return (
              <div key={index} className={`${styles.avatarItem} ${index === cur ? styles.active : ''} cursor-pointer`}
              style={{ filter: cur === index ? `drop-shadow(5px 0px 2px ${item.link})` : '' }}
              onClick={() => setCur(index)}
              >
                <img src={item.data} alt=""  style={{ filter: cur === index ? `drop-shadow(-5px 0px 2px ${item.link})` : '' }}/>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default SectionFive

