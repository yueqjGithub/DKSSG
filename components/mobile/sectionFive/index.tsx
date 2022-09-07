import { useContext, useState, useMemo } from 'react'
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
      return {
        name: item.text[4].data,
        keys: [
          item.text[0].data,
          item.text[1].data,
          item.text[2].data,
          item.text[3].data,
        ],
        desc: item.richText[0].data,
        qShow: item.images[1].data
      }
    })
  }, [roleList])
  return (
    <div className={styles.container} style={{ backgroundImage: `url(${imgPrefix}/mobileImg/sec5Bg.png)` }}>
      <div className={`${styles.avatorContainer} flex-col flex-jst-start flex-ali-center`}>
        {
          avatarList.map((item, idx) => {
            return (
              <div className={`${styles.avatarItem}`} key={idx}
              style={{ filter: cur === idx ? `drop-shadow(5px 0px 2px ${item.link})` : '' }}
              onClick={() => setCur(idx)}
              >
                <img src={item.data} alt="" style={{ filter: cur === idx ? `drop-shadow(-5px 0px 2px ${item.link})` : '' }}/>
              </div>
            )
          })
        }
      </div>
      {/* role */}
      {
        roleImgList.map((item, idx) => {
          return (
            <div
            className={`${styles.roleContainer} cus-slide-left-in ${idx === cur ? styles.show : styles.hide }`}
            style={{ backgroundImage: `url('${item.data}')` }}
            key={idx}>
            </div>
          )
        })
      }
      <div className={styles.shadowModal}></div>
      <div className={styles.descContainer}>
        <img src={`${imgPrefix}/mobileImg/sec5Tit.png`} alt="" className={styles.descTitImg}/>
        <img src={`${imgPrefix}/mobileImg/sec5Com.png`} alt="" className={styles.descSplit}/>
        <div className={styles.wordShow}>
          {
            rightInfoList.map((item, idx) => {
              return (
                <div className={`${styles.wordContainer} ${cur === idx ? styles.show : styles.hide} flex-col flex-jst-start flex-ali-start`} key={idx}>
                  <div className={`${styles.title} cus-slide-right-in any-delay-1`}>{item.name}</div>
                  <div className={`${styles.keyContainer} flex-row flex-jst-start flex-ali-center cus-slide-right-in any-delay-2`}>
                    {
                      item.keys.map((keyItem, keyIdx) => {
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
                  <img src={item.qShow} alt="" className={`${styles.qShow}`}/>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default SectionFive
