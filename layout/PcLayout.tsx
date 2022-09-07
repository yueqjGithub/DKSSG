import { useContext, useEffect, useMemo, useState } from 'react'
import styles from './pclayout.module.scss'
import { Context } from '../store'
import { httpPost } from '../service/http'
import urls from '../service/urls'
type Props = {
  children: React.ReactElement
  shareLink: FixedContentItem<FixedTypeEnum.IMAGES>['content']
  downBtnList: FixedContentItem<FixedTypeEnum.IMAGES>['content']
  qrcode: FixedContentItem<FixedTypeEnum.IMAGES>['content'][0]
  showReserve: boolean
  openPrize: Function
}

const PcLayout = ({ children, shareLink, downBtnList, qrcode, showReserve, openPrize }: Props) => {
  const { state, dispatch } = useContext(Context)
  const { isLogin, imgPrefix } = state
  const { sideExpand, currentScreen, sideTab } = state
  useEffect(() => {
    if (dispatch) {
      dispatch({ type: 'set', key: 'showReserve', val: showReserve })
    }
  }, [dispatch, showReserve])
  const tabs = useMemo(() => {
    return showReserve ? sideTab : ['首頁', '業務特色', '員工簡歷']
  }, [showReserve])
  const openLink = (link?: string) => {
    if (link) {
      window.open(link)
    }
  }
  const setTab = (idx: number) => {
    if (dispatch) {
      dispatch({ type: 'set', key: 'currentScreen', val: idx })
    }
  }
  const logoutHandler = async () => {
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
  }
  return (
    <div className="page-pc-container">
    {children}
    {/* 左侧slider */}
    <div className={`flex-row flex-jst-start flex-ali-start ${styles.sideShareContainer}`} style={{ left: sideExpand ? '0' : '-1.36rem' }}>
      <div className={styles.bgImg}>
        {/* <Image src='/pc/left_slid_bg.png' alt='' width={136} height={608}></Image> */}
        <div className={`${styles.shareContentContainer} flex-col flex-jst-start flex-ali-center`} style={{ backgroundImage: `url(${imgPrefix}/pc/left_slid_bg.png)` }}>
          {/* 内容 */}
          {
            shareLink.map((item, index) => {
              return (
                <div className={`${styles.shareLinkIcon} cursor-pointer`} key={index} onClick={() => openLink(item.link)}>
                  <img src={item.data} alt={item.link} style={{ width: '100%', height: 'auto' }}></img>
                </div>
              )
            })
          }
          <div style={{ height: 14 }}></div>
          {/* 下载按钮 */}
          {
            downBtnList.map((item, index) => {
              return (
                <div className={`${styles.donwBtn} cursor-pointer`} key={index}>
                  {
                    item.link ? (
                      <img src={item.data} alt={item.link} style={{ width: '100%', height: 'auto' }} onClick={() => openLink(item.link)}></img>
                    ) : (
                      <>
                        {
                          showReserve && <img src={item.data} style={{ width: '100%', height: 'auto' }} alt={item.link} onClick={() => openPrize()}></img>
                        }
                      </>
                    )
                  }
                </div>
              )
            })
          }
          {
            showReserve && (
              <>
              <div className={styles.qrContainer}>
                <img alt={qrcode.link} src={qrcode.data} style={{ width: '100%' }}></img>
              </div>
              <p className={styles.qrTips}>掃碼手機預約</p>
              </>
            )
          }
        </div>
      </div>
      <div className={styles.expandBtn} onClick={() => {
        if (dispatch) {
          dispatch({ type: 'set', key: 'sideExpand', val: !sideExpand })
        }
      }}>
        {
          sideExpand ? (
            <img src={`${imgPrefix}/pc/un_expand.png`} alt='' style={{ width: '100%' }}></img>
          ) : (
            <img src={`${imgPrefix}/pc/expand.png`} alt='' style={{ width: '100%' }}></img>
          )
        }
      </div>
    </div>
    {/* 右侧导航 */}
    <div className={`${styles.rightSide} flex-col flex-jst-start flex-ali-end`}>
      {
        tabs.map((item, idx) => {
          return <div className={`${styles.tabItem} ${currentScreen === idx ? styles.tabActive : ''} cursor-pointer`} key={item}
            onClick={() => setTab(idx)}
          >
            <span>{item}</span>
            <div className={styles.activeBg}>
            </div>
          </div>
        })
      }
    </div>
    {
      isLogin && <img src={`${imgPrefix}/pc/logout.png`} alt="" className={`${styles.logout} cursor-pointer hover-scale`} onClick={() => logoutHandler()}/>
    }
  </div>

  )
}

export default PcLayout
