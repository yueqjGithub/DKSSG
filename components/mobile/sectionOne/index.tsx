import { useContext, useMemo } from 'react'
import { Context } from '../../../store'
import styles from './index.module.scss'

type Props = {
  count: number
  showReserve: boolean
  downBtnList: FixedContentItem<FixedTypeEnum.IMAGES>['content']
  loginHandler: Function
}

const SectionOne = ({ count, showReserve, loginHandler, downBtnList }: Props) => {
  const { state } = useContext(Context)
  const { isLogin, codes, imgPrefix } = state
  const storeLink = useMemo(() => {
    return downBtnList?.pop()?.link
  }, [downBtnList])
  const alreadyReserve = useMemo(() => {
    return codes?.find(item => item.codeType === 'RESERVE') !== undefined
  }, [codes])
  return (
    <div className={`${styles.container} flex-row flex-jst-center flex-ali-end`} style={{ backgroundImage: `url(${imgPrefix}/mobileImg/sec1Bg.png)` }}>
      <img src={`${imgPrefix}/mobileImg/sec1P.png`} alt="" className={styles.bgPerson}/>
      <div className={`${styles.contentShow} full-width flex-col flex-jst-start flex-ali-center`}>
        {
          showReserve && (
            <>
              <div className={styles.countShow}><p>已有<span>{count}</span>人應徵</p></div>
              <img src={`${imgPrefix}/mobileImg/${!alreadyReserve ? 'sec1Res.png' : 'al_res.png'}`} alt="" onClick={() => {
              if (isLogin && alreadyReserve) return
              loginHandler()
            }}/>
            </>
          )
        }
        <img src={`${imgPrefix}/mobileImg/store.png`} alt="" onClick={() => {
          if (storeLink) {
            window.open(storeLink)
          }
        }}/>
      </div>
    </div>
  )
}

export default SectionOne
