import { useContext, useMemo, useState } from 'react'
import { Context } from '../../../store'
import styles from './index.module.scss'
type Props = {
  banners: FixedContentItem<FixedTypeEnum.IMAGES>
}

const SectionFour = ({ banners }: Props) => {
  const { state } = useContext(Context)
  const { imgPrefix } = state
  const { content: bannerList } = banners
  const [cur, setCur] = useState(0)
  const pre = useMemo(() => {
    return cur === 0 ? bannerList.length - 1 : cur - 1
  }, [bannerList.length, cur])
  const next = useMemo(() => {
    return cur === bannerList.length - 1 ? 0 : cur + 1
  }, [bannerList.length, cur])
  const curList = useMemo(() => {
    const result = [pre, cur, next]
    return result
  }, [cur, pre, next])
  const toRight = () => {
    setCur((pre) => {
      return pre === bannerList.length - 1 ? 0 : pre + 1
    })
  }
  const toLeft = () => {
    setCur((pre) => {
      return pre === 0 ? bannerList.length - 1 : pre - 1
    })
  }
  const changeCur = (index: number, current: number) => {
    let comp = current
    if (index > current) {
      comp = current + 1
      setCur(comp)
      setTimeout(() => {
        changeCur(index, comp)
      }, 100)
    } else if (index < current) {
      comp = current - 1
      setCur(comp)
      setTimeout(() => {
        changeCur(index, comp)
      }, 100)
    }

  }
  return (
    <div className={`${styles.container} flex-col flex-jst-center flex-ali-center`} style={{ backgroundImage: `url(${imgPrefix}/pc/sec4/sec4Bg.png)` }}>
      <div className={`${styles.bannerContainer} flex-row flex-jst-center flex-ali-center`}>
        {/* 撐開父元素 */}
        <img src={bannerList[0].data} alt="" style={{ width: '70%', visibility: 'hidden' }}/>
        {/* 控制板 */}
        <div className={`${styles.control} full-width full-height flex-row flex-jst-btw flex-ali-center`}>
          <div className={styles.lCtrl} onClick={() => toLeft()}>
            <img src={`${imgPrefix}/pc/sec4/leftBtn.png`} alt="" />
          </div>
          <div className={styles.rCtrl} onClick={() => toRight()}>
            <img src={`${imgPrefix}/pc/sec4/leftBtn.png`} alt="" />
          </div>
        </div>
        {/* bannerList.map.data */}
        {
          bannerList.map((item, idx) => {
            return (
              <div
              className={[
                styles.bannerItem,
                curList.includes(idx) ? styles.show : styles.hide,
                idx === pre ? styles.prev : '',
                idx === cur ? styles.cur : '',
                idx === next ? styles.next : '',
              ].join(' ')} 
              key={idx}
              >
                <img src={item.data} alt="" />
                {/* {idx} */}
              </div>
            )
          })
        }
      </div>
      <div className={`${styles.dotContainer} full-width flex-row flex-jst-center flex-ali-center`}>
        {
          bannerList.map((item, idx) => {
            return (
              <div key={idx} className={`${styles.dotItem} ${cur === idx ? styles.active : ''} flex-row flex-jst-center flex-ali-center`} onClick={() => changeCur(idx, cur)}>
                <div></div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default SectionFour
