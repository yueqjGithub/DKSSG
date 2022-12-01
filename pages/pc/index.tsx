import { GetStaticProps, NextPage } from "next"
import { useContext, useEffect, useMemo, useRef, useState } from "react"
import PcLayout from "../../layout/PcLayout"
import { httpGet, httpPost } from "../../service/http"
import urls from "../../service/urls"
import { Context } from "../../store"
import { getTarget } from "../../utils"
import SectionOne from "../../components/pc/sectionOne"
import SectionTwo from '../../components/pc/sectionTwo'
import SectionThree from '../../components/pc/sectionThree'
import SectionFour from '../../components/pc/sectionFour'
import SectionFive from '../../components/pc/sectionFive'
import styles from './index.module.scss'
import Script from "next/script"
import { FbLogin } from "../../utils/fbLogin"
import ShareModal from '../../components/pc/shareModal'
import PrizeModal from '../../components/pc/prizeModal'
import { useRouter } from "next/router"
import CusDialog from '../../components/common/dialog'

type Props = {
  shareLink: FixedContentItem<FixedTypeEnum.IMAGES>['content']
  downBtnList: FixedContentItem<FixedTypeEnum.IMAGES>['content']
  qrcodeList: FixedContentItem<FixedTypeEnum.IMAGES>['content']
  showReserve: boolean
  videoSource: {
    [key: string]: FixedContentItem<FixedTypeEnum.VIDEO>['content']
  }
  reserves: any
  fbAndInvite: {
    fb: any[]
    invite: any[]
  }
  banners: FixedContentItem<FixedTypeEnum.IMAGES>
  roleList: any[]
  isGrey?: boolean
}

const PcHome: NextPage<Props> = ({ isGrey, shareLink, downBtnList, qrcodeList, showReserve, videoSource, reserves, fbAndInvite, banners, roleList }) => {
  const { state, dispatch } = useContext(Context)
  const contRef = useRef<any>()
  const { currentScreen, sideTab, imgPrefix, denyScroll, showDialog, sharePrefix, frontBaseUrl } = state
  const [sharePath, setSharePath] = useState<string>()
  const [showShare, setShowShare] = useState<boolean>(false)
  const [showPrize, setShowPrize] = useState<boolean>(false)
  const tabs = useMemo(() => {
    return showReserve ? sideTab : ['首頁', '業務特色', '員工簡歷']
  }, [showReserve])

  const router = useRouter()
  
  const timer = useRef<any>(null)
  // 获取滚轮事件
  const getDirection = (e: any) => {
    if (denyScroll) {
      return false
    }
    if (e.deltaY > 0) {
      if (currentScreen < tabs.length) {
        if (dispatch) {
          dispatch({ type: 'set', key: 'currentScreen', val: currentScreen + 1 })
        }
      }
    } else {
      if (currentScreen > 0) {
        if (dispatch) {
          dispatch({ type: 'set', key: 'currentScreen', val: currentScreen - 1 })
        }
      }
    }
  }
  const changeScreen = (e: any) => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      getDirection(e)
    }, 100)
  }
  // 初始化userId
  const initUserId = async () => {
    if (!state.isLogin && showReserve) {
      const uid = window.localStorage.getItem('uid')
      const token = window.localStorage.getItem('token')
      if (uid && token) {
        dispatch && dispatch({ type: 'set', key: 'auth', val: { uid, token } })
        dispatch && dispatch({ type: 'set', key: 'isLogin', val: true })
        try {
          const { data: codeData } = await queryCode()
          dispatch && dispatch({ type: 'set', key: 'codes', val: codeData })
        } catch {
          console.log('登录后获取code失败')
        }
      }
    }
  }
  useEffect(() => {
    const w = document.documentElement.clientWidth
    if (w < 750) {
      router.push('/mobile')
    }
    initUserId()
  }, [])
  // 登录
  const loginHandler = async () => {
    const shareFrom = window.localStorage.getItem('shareFrom')
    try {
      const res = await FbLogin()
      const requestData:any = {
        accessToken: res.result.accessToken,
        platformUid: res.result.uid
      }
      if (shareFrom) {
        requestData['shareLink'] = shareFrom
      }
      const { data: _res } = await httpPost(`${frontBaseUrl}${urls.login}`, requestData)
      const _uid = _res.data.userId
      const _token = _res.data.token
      window.localStorage.setItem('uid', _uid)
      window.localStorage.setItem('token', _token)
      if (dispatch) {
        dispatch({ type: 'set', key: 'auth', val: { uid: _uid, token: _token } })
        dispatch({ type: 'set', key: 'isLogin', val: true })
        dispatch({ type: 'set', key: 'showDialog', val: true })
        const { data: codeData } = await queryCode()
        dispatch && dispatch({ type: 'set', key: 'codes', val: codeData })
      }
    } catch (e: any) {
      if (e.message) {
        alert(e.message)
      } else {
        alert("登錄失敗，請重新嘗試")
      }
    }
  }
  // 查询兑换码
  const queryCode = async () => {
    try {
      const { data: _res } = await httpGet(`${frontBaseUrl}${urls.getExchangeCode}`, {
        userId: window.localStorage.getItem('uid'),
        token: window.localStorage.getItem('token')
      })
      return _res
    } catch (e) {
      alert(e || (e as Error).message)
    }
  }
  // 获取已有兑换码
  const getCode = async () => {
    if (!state.auth?.uid) { // 未登录
      const toLogin = confirm('請先登錄')
      if (toLogin) {
        loginHandler()
      } else {
        return false
      }
    } else { // 已登录但未预约-》预约
      try {
        const { data: _res } = await httpGet(`${frontBaseUrl}${urls.doReserve}`, {
          userId: state.auth.uid,
          token: state.auth.token
        })
        if (_res.status === 0) {
          const copy = [...state.codes]
          const al = copy.find(item => item.codeType === 'RESERVE')
          if (!al) {
            copy.push(_res.data)
          }
          dispatch && dispatch({ type: 'set', key: 'codes', val: copy })
          setShowPrize(true)
        } else {
          alert(_res.message)
        }
      } catch (e: any) {
        if (e.message) {
          alert(e.message)
        } else {
          alert("預約失敗，請稍後再試")
        }
      }
    }
  }
  // 邀请
  const inviteHandler = async () => {
    if (!state.auth?.uid) { // 未登录
      const toLogin = confirm('請先登錄')
      if (toLogin) {
        loginHandler()
      } else {
        return false
      }
    } else {
      try {
        const { data: _res } = await httpGet(`${frontBaseUrl}${urls.getInvite}`, {
          userId: state.auth.uid,
          token: state.auth.token,
          shareBaseUrl: `${window.location.origin}${sharePrefix || ''}`
        })
        if (_res.status === 0) {
          setSharePath(_res.data)
          setShowShare(true)
        } else {
          alert(_res.message)
        }
      } catch (e: any) {
        if (e.message) {
          alert(e.message)
        } else {
          alert("獲取邀請鏈接失敗，請重試")
        }
      }
    }
  }
  
  // 奖励查询
  const queryPrize = async () => {
    if (!state.auth?.uid) { // 未登录
      const toLogin = confirm('請先登錄')
      if (toLogin) {
        loginHandler()
      } else {
        return false
      }
    } else {
      const { data: codeData } = await queryCode()
      dispatch && dispatch({ type: 'set', key: 'codes', val: codeData })
      setShowPrize(true)
    }
  }
  // 打開獎勵彈窗
  return (
    <>
      <Script
      src='https://connect.facebook.net/zh_TW/all.js'
      strategy='afterInteractive'
      async
      defer
      crossOrigin='anonymous'
      onReady={() => {
        window.fbAsyncInit = function() {
          window.FB.init({
            appId            : '518346400123153',
            autoLogAppEvents : true,
            xfbml            : true,
            version          : 'v14.0'
          });
        };
      }}
    ></Script>
    <PcLayout
      shareLink={shareLink}
      downBtnList={downBtnList}
      qrcode={qrcodeList[0]}
      showReserve={showReserve}
      openPrize={queryPrize}
      isGrey={isGrey}
    >
      <>
        {
          showDialog && <CusDialog />
        }
        {
          showShare && <ShareModal sharePath={sharePath} closeHandler={() => setShowShare(false)}></ShareModal>
        }
        {
          showPrize && <PrizeModal closeHandler={() => setShowPrize(false)}></PrizeModal>
        }
        <div ref={contRef} className={styles.pageContainer} onWheel={(e) => changeScreen(e)}
        style={{ top: currentScreen < tabs.length ? `-${currentScreen * 100}vh` : `-${(currentScreen - 1) * 100 + 12}vh` }}
        >
          <SectionOne video={videoSource.video[0]} loginHandler={getCode}></SectionOne>
          {
            showReserve && (
              <>
                <SectionTwo reserves={reserves} loginHandler={getCode}></SectionTwo>
                <SectionThree fbAndInvite={fbAndInvite} inviteHandler={inviteHandler}></SectionThree>
              </>
            )
          }
          <SectionFour banners={banners}></SectionFour>
          <SectionFive roleList={roleList}></SectionFive>
          <div className={styles.footer}>
            <div className={styles.introdcution}>
              <div className={styles.introEn}>
                <div>© 2022.All RIGHTS RESERVED</div>
                <div onClick={() => window.open('https://avalon-sdk-resource.avalongames.com/v1/en-us/usa.html')}>TERMS OF SERVICE</div>
                <div onClick={() => window.open('https://avalon-sdk-resource.avalongames.com/v1/en-us/pp.html')}>PRIVACY POLICY</div>
                <img src={`${imgPrefix}/pc/btm/top_logo.png`} alt="" className={styles.btmLogo} />
              </div>
            </div>
          </div>
        </div>
      </>
    </PcLayout>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data: shares } = await httpGet(urls.shareLink)
  const { data: downsData } = await httpGet(urls.downBtn)
  const { data: qrcodeData } = await httpGet(urls.qrCode)
  const { data: attrData } = await httpGet(urls.getAttr)
  const { data: videoRes } = await httpGet(urls.queryVideoSource)
  const shareList: FixedContentItem<FixedTypeEnum.IMAGES> = getTarget('images', shares.data)
  const downBtnList: FixedContentItem<FixedTypeEnum.IMAGES> = getTarget('images', downsData.data)
  const qrcodeInfo: FixedContentItem<FixedTypeEnum.IMAGES> = getTarget('images', qrcodeData.data)
  const videoResult = {
    video: getTarget('video', videoRes.data).content
  }
  // banners
  const { data: bannerData } = await httpGet(urls.getBanner)
  // 员工简历
  const { data: rolesData } = await httpGet(urls.getGameRoles)
  const roleList = rolesData.data.map((item: any) => {
    return {
      images: getTarget('images', item).content,
      text: getTarget('text', item).content,
      richText: getTarget('richText', item).content
    }
  })
  const bannerList: FixedContentItem<FixedTypeEnum.IMAGES> = getTarget('images', bannerData.data)
  const showReserve = attrData.data.find((item: any) => item.code === 'showReserve').val === 'true'
  const isGrey = attrData.data.find((item: any) => item.code === 'isgrey').val === 'true'
  if (showReserve) {
    // 第二屏接口
    const { data: reserveOne } = await httpGet(urls.getReserveOne)
    const { data: reserveTwo } = await httpGet(urls.getReserveTwo)
    const { data: reserveThree } = await httpGet(urls.getReserveThree)
    const { data: reserveFour } = await httpGet(urls.getReserveFour)
    const { data: reserveFive } = await httpGet(urls.getReserveFive)
    const reserves = [
      {
        images: getTarget('images', reserveOne.data).content,
        text: getTarget('text', reserveOne.data).content
      },
      {
        images: getTarget('images', reserveTwo.data).content,
        text: getTarget('text', reserveTwo.data).content
      },
      {
        images: getTarget('images', reserveThree.data).content,
        text: getTarget('text', reserveThree.data).content
      },
      {
        images: getTarget('images', reserveFour.data).content,
        text: getTarget('text', reserveFour.data).content
      },
      {
        images: getTarget('images', reserveFive.data).content,
        text: getTarget('text', reserveFive.data).content
      }
    ]
    // 第三屏接口
    const { data: fbOne } = await httpGet(urls.getFbOne)
    const { data: fbTwo } = await httpGet(urls.getFbTwo)
    const { data: inviteOne } = await httpGet(urls.getInviteOne)
    const { data: inviteTwo } = await httpGet(urls.getInviteTwo)
    const { data: inviteThree } = await httpGet(urls.getInviteThree)
    const fbAndInvite = {
      fb: [
        {
          images: getTarget('images', fbOne.data).content,
          text: getTarget('text', fbOne.data).content
        },
        {
          images: getTarget('images', fbTwo.data).content,
          text: getTarget('text', fbTwo.data).content
        }
      ],
      invite: [
        {
          images: getTarget('images', inviteOne.data).content,
          text: getTarget('text', inviteOne.data).content
        },
        {
          images: getTarget('images', inviteTwo.data).content,
          text: getTarget('text', inviteTwo.data).content
        },
        {
          images: getTarget('images', inviteThree.data).content,
          text: getTarget('text', inviteThree.data).content
        }
      ]
    }
    return {
      props: {
        isGrey,
        shareLink: shareList.content,
        downBtnList: downBtnList.content,
        qrcodeList: qrcodeInfo.content,
        videoSource: videoResult,
        banners: bannerList,
        roleList,
        showReserve,
        reserves,
        fbAndInvite
      }
    }
  } else {
    return {
      props: {
        isGrey,
        shareLink: shareList.content,
        downBtnList: downBtnList.content,
        qrcodeList: qrcodeInfo.content,
        videoSource: videoResult,
        banners: bannerList,
        roleList,
        showReserve
      }
    }
  }
}

export default PcHome
