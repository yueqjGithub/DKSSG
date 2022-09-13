import { useContext, useState } from 'react'
import { Context } from '../../../store'
import styles from './index.module.scss'
type Props = {
  banners: FixedContentItem<FixedTypeEnum.IMAGES>
}
const SectionFour = ({ banners }: Props) => {
  const { state } = useContext(Context)
  const { imgPrefix } = state
  const { content: bannerList } = banners
  const [cur, setCur] = useState<number>(0)
  const changeHandler = (index: number) => {
    setCur(index)
  }
  const toLeft = () => {
    if (cur === 0) {
      setCur(bannerList.length - 1)
    } else {
      setCur(cur - 1)
    }
  }
  const toRight = () => {
    if (cur === bannerList.length - 1) {
      setCur(0)
    } else {
      setCur(cur + 1)
    }
  }
  return (
    <div className={`${styles.container} flex-col flex-jst-start flex-ali-center`} style={{ backgroundImage: `url(${imgPrefix}/mobileImg/sec4BG.png)` }}>
      <div className={styles.tv} style={{ backgroundImage: `url(${bannerList[cur].data})` }}></div>
      <div className={`${styles.tvList} flex-row flex-wrap flex-jst-btw flex-ali-start`}>
        {
          bannerList.map((item, index) => {
            return (
              <div key={index} className={`${styles.tvItem} ${cur === index ? styles.active : ''}`}
              style={{ backgroundImage: `url(${item.data})` }}
              onClick={() => changeHandler(index)}
              ></div>
            )
          })
        }
      </div>
      {/* <div className={`${styles.dotContainer} flex-row flex-jst-center flex-ali-center`}>
        <div className={`${styles.dotOut} flex-row flex-jst-btw flex-ali-center`}>
          <img src={`${imgPrefix}/mobileImg/cars_arrow.png`} alt="" className={`${styles.arrow} ${styles.left}`} onClick={() => toLeft()}/>
          <div className={`${styles.dotUl} flex-row flex-jst-center flex-ali-center flex-1`}>
            {
              bannerList.map((item, idx) => {
                return (
                  <div className={`${styles.dotItem} ${cur === idx ? styles.active : ''} click-scale flex-row flex-jst-center flex-ali-center`} key={idx} onClick={() => changeHandler(idx)}>
                    <div></div>
                  </div>
                )
              })
            }
          </div>
          <img src={`${imgPrefix}/mobileImg/cars_arrow.png`} alt="" className={`${styles.arrow} ${styles.right}`} onClick={() => toRight()}/>
        </div>
      </div> */}
    </div>
  )
}

export default SectionFour