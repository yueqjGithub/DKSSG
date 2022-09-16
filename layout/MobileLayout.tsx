import Head from 'next/head'
import { useContext, useEffect, useMemo, useState } from 'react'
import { httpPost } from '../service/http'
import urls from '../service/urls'
import { Context } from '../store'
import styles from './mobile.module.scss'

type Props = {
  children: React.ReactElement
  topData: {
    images: FixedContentItem<FixedTypeEnum.IMAGES>['content'],
    text: FixedContentItem<FixedTypeEnum.TEXT>['content']
  }
  showReserve: boolean
  reserveHandler: Function
  openPrize: Function
  shareLink: FixedContentItem<FixedTypeEnum.IMAGES>['content']
}

const MobileLayout = ({ children, topData, showReserve, reserveHandler, shareLink, openPrize }: Props) => {
  const { state, dispatch } = useContext(Context)
  const { isLogin, codes, imgPrefix } = state
  const [expand, setExpand] = useState<boolean>(false)
  const alreadyReserve = useMemo(() => {
    return codes?.find(item => item.codeType === 'RESERVE') !== undefined
  }, [codes])
  useEffect(() => {
    if (dispatch) {
      dispatch({ type: 'set', key: 'showReserve', val: showReserve })
    }
  }, [dispatch, showReserve])
  const logoutHandler = async () => {
    window.FB.logout(async function () {
      const { data } = await httpPost(urls.logout, {
        token: localStorage.getItem('token'),
        userId: localStorage.getItem('uid')
      })
      window.localStorage.removeItem('token')
      window.localStorage.removeItem('uid')
      if (dispatch) {
        dispatch({ type: 'set', key: 'isLogin', val: false })
        dispatch({ type: 'set', key: 'codes', val: [] })
        dispatch({ type: 'set', key: 'auth', val: undefined })
      }
    })
  }
  const openLink = (link?: string) => {
    if (link) {
      window.open(link)
    }
  }
  const topComputed = useMemo(() => {
    if (isLogin && !alreadyReserve) {
      return {
        flex: 1
      }
    } else {
      return {
        width: '24%'
      }
    }
  }, [isLogin, alreadyReserve])
  return (
    <>
      <Head>
        <title>魔爾街之王-DungeonOverlord-要素過多的Roguelike塔防手游</title>
      </Head>
      <div className='m-page-container'>
        {/* header */}
        <div className={`${styles.headerContainer} flex-row flex-jst-btw flex-ali-center`}>
          <div className={`${styles.leftSide} flex-row flex-jst-start flex-ali-center`}>
            <img src={topData.images[0].data} alt="" />
            <div className={`${styles.topName} flex-col flex-jst-btw flex-ali-start`}>
              <p>{topData.text[0].data}</p>
              <span>{topData.text[1].data}</span>
            </div>
          </div>
          {/* 右边 */}
          <div className={`${styles.rightSide} flex-row flex-nowrap flex-jst-end flex-ali-center`} style={topComputed}>
            {
              isLogin && <img src={`${imgPrefix}/mobileImg/logout.png`} alt="" className='click-scale flex-1' onClick={() => logoutHandler()}/>
            }
            {
              !alreadyReserve && <img src={`${imgPrefix}/mobileImg/reserve.png`} alt="" className='click-scale flex-1' onClick={() => reserveHandler()}/>
            }
          </div>
        </div>
        {/* slide */}
        <div className={styles.slideRight} style={{ right: expand ? '0' : '-30vw' }}>
          <img src={`${imgPrefix}/mobileImg/slideBg.png`} alt="" className={styles.slideBg}/>
          <img src={`${imgPrefix}/mobileImg/slideArrow.png`} alt="" className={`${styles.slideArr} ${expand ? '' : styles.dexpand}`}  onClick={() => {
            setExpand(!expand)
          }}/>
          {/* content */}
          <div className={`${styles.contContainer} flex-col flex-jst-center flex-ali-center`}>
            {
              shareLink.map((item, index) => {
                return (
                  <div className={`${styles.shareLinkIcon} click-scale`} key={index} onClick={() => openLink(item.link)}>
                    <img src={item.data} alt={item.link} style={{ width: '100%', height: 'auto' }}></img>
                  </div>
                )
              })
            }
            {
              showReserve && (
                <div className={`${styles.shareLinkIcon} click-scale`}  onClick={() => openPrize()}>
                  <img src={`${imgPrefix}/mobileImg/prizeQ.png`} alt='' style={{ width: '100%', height: 'auto' }}></img>
                </div>
              )
            }
          </div>
        </div>
        {children}
      </div>
    </>
  )
}

export default MobileLayout
