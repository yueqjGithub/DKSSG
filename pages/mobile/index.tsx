import { GetStaticProps, NextPage } from "next"
import Script from "next/script"
import { useContext, useState, useEffect, useRef, useMemo } from "react";
import PrizeModal from "../../components/mobile/prizeModal";
import MobileLayout from "../../layout/MobileLayout"
import { httpGet, httpPost } from "../../service/http";
import urls from "../../service/urls"
import { Context } from "../../store";
import { getTarget } from "../../utils"
import { FbLogin } from "../../utils/fbLogin";
import styles from './index.module.scss'
import SectionOne from '../../components/mobile/sectionOne'
import SectionTwo from '../../components/mobile/sectionTwo'
import SectionThree from '../../components/mobile/sectionThree'
import ShareModal from "../../components/mobile/shareModal"
import SectionFour from "../../components/mobile/sectionFour"
import SectionFive from "../../components/mobile/sectionFive"
import CusDialog from "../../components/common/dialog";

type Props = {
  topData: {
    images: FixedContentItem<FixedTypeEnum.IMAGES>['content'],
    text: FixedContentItem<FixedTypeEnum.TEXT>['content']
  }
  showReserve: boolean
  shareLink: FixedContentItem<FixedTypeEnum.IMAGES>['content']
  downBtnList: FixedContentItem<FixedTypeEnum.IMAGES>['content']
  downLinks: FixedContentItem<FixedTypeEnum.TEXT>['content']
  videoSource: {
    [key: string]: FixedContentItem<FixedTypeEnum.VIDEO>['content']
  }
  reserves: any
  fbAndInvite: {
    fb: any[]
    invite: any[]
  }
  roleList: any[]
  banners: FixedContentItem<FixedTypeEnum.IMAGES>
  isGrey?: boolean
}

const MobileHome: NextPage<Props> = ({ isGrey, topData, downLinks, showReserve, shareLink, downBtnList, reserves, fbAndInvite, banners, roleList, videoSource }) => {
  const [sysType, setSys] = useState<'android' | 'ios'>('ios')
  useEffect(() => {
    const u = navigator.userAgent;
    const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isAndroid) {
      setSys('android')
    } else if (isiOS) {
      setSys('ios')
    }
  }, [])
  const downLink = useMemo(() => {
    return downLinks?.find(item => item.data === sysType)?.link
  }, [downLinks, sysType])
  const { state, dispatch } = useContext(Context)
  const { imgPrefix, showDialog, sharePrefix, frontBaseUrl } = state
  const touchRef = useRef<any>()
  const [sharePath, setSharePath] = useState<string>()
  const [showShare, setShowShare] = useState<boolean>(false)
  const [showPrize, setShowPrize] = useState<boolean>(false)
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
          console.log('初始化获取code失败')
        }
      }
    }
  }
  useEffect(() => {
    initUserId()
  })
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
        try {
          const { data: codeData } = await queryCode()
          dispatch && dispatch({ type: 'set', key: 'codes', val: codeData })
        } catch {
          console.log('登录后获取code失败')
        }
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
      alert("查詢兌換碼出錯")
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
          alert("查詢兌換碼出錯")
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
          alert("生成邀請鏈接失敗，請重試")
        }
      }
    }
  }
  // 獲取預約人數
  const [curDeg, setDeg] = useState<number>(2)
  const [count, setCount] = useState<number>(0)
  const getCountHandler = async () => {
    const { data: res } = await httpGet(`${frontBaseUrl}${urls.getReserveCount}`)
    // console.log(res.data)
    const target = Math.floor(res.data / 100000)
    setCount(res.data)
    setDeg(target)
  }
  useEffect(() => {
    if (showReserve) {
      getCountHandler()
    }
  }, [showReserve])
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
    <MobileLayout
      showReserve={showReserve}
      topData={topData}
      reserveHandler={getCode}
      shareLink={shareLink}
      openPrize={queryPrize}
      downBtnList={downBtnList} 
      downLink={downLink}
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
        <div ref={touchRef} className={styles.pageContainer}>
          <SectionOne count={count} showReserve={showReserve} downLink={downLink} downBtnList={downBtnList} loginHandler={getCode} video={videoSource.video[0]}></SectionOne>
          {
            showReserve && (
              <>
                <SectionTwo count={count} reserves={reserves} curDeg={curDeg}></SectionTwo>
                <SectionThree fbAndInvite={fbAndInvite} inviteHandler={inviteHandler}></SectionThree>
              </>
            )
          }
          <SectionFour banners={banners}></SectionFour>
          <SectionFive roleList={roleList}></SectionFive>
          <div className={styles.footerOut}>
        <div className={styles.footer}>
            {/* <div className={styles.followTit}>FOLLOW US</div>
            <div className={styles.shareList}>
              <div className="share-item share-wx" onClick={() => window.open('https://www.youtube.com/channel/UCMqPPCyC6sS27FM6ZzkBrGA')}>
                  <img className="share-icon" src={`${imgPrefix}/pc/btm/share_ytb.png`} alt="" />
              </div>
              <div className="share-item share-bl" onClick={() => window.open('https://discord.gg/SzECKcDAzA')}>
                  <img className="share-icon" src={`${imgPrefix}/pc/btm/share_gm.png`} alt="" />
              </div>
              <div className="share-item share-dy" onClick={() => window.open('https://www.tiktok.com/@avalongamesofficial')}>
                  <img className="share-icon" src={`${imgPrefix}/pc/btm/share_dy.png`} alt="" />
              </div>
              <div className="share-item share-qq" onClick={() => window.open('https://space.bilibili.com/1957566079')}>
                  <img className="share-icon" src={`${imgPrefix}/pc/btm/share_bl.png`} alt="" />
              </div>
            </div>
            <p className={styles.btmEmail}>Contact Us: bd@avalongames.cn</p> */}
            <div className={styles.protocolContainer}>
              <div>© 2022.All RIGHTS RESERVED</div>
              <div onClick={() => window.open('https://avalon-sdk-resource.avalongames.com/v1/en-us/usa.html')}>TERMS OF SERVICE</div>
              <div onClick={() => window.open('https://avalon-sdk-resource.avalongames.com/v1/en-us/pp.html')}>PRIVACY POLICY</div>
            </div>
        </div>
        </div>
        </div>

      </>
    </MobileLayout>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data: shares } = await httpGet(urls.shareLink)
  const { data: topInfo } = await httpGet(urls.getMTopInfo)
  const { data: attrData } = await httpGet(urls.getAttr)
  const { data: downsData } = await httpGet(urls.downBtn)
  const { data: mLink } = await httpGet(urls.mLink)
  const downLinks: FixedContentItem<FixedTypeEnum.TEXT> = getTarget('text', mLink.data)
  const downBtnList: FixedContentItem<FixedTypeEnum.IMAGES> = getTarget('images', downsData.data)
  const shareList: FixedContentItem<FixedTypeEnum.IMAGES> = getTarget('images', shares.data)
  const showReserve = attrData.data.find((item: any) => item.code === 'showReserve').val === 'true'
  const isGrey = attrData.data.find((item: any) => item.code === 'isgrey').val === 'true'
  const topData: {
    images: FixedContentItem<FixedTypeEnum.IMAGES>['content'],
    text: FixedContentItem<FixedTypeEnum.TEXT>['content']
  } = {
    images: getTarget('images', topInfo.data).content,
    text: getTarget('text', topInfo.data).content
  }
  // banners
  const { data: bannerData } = await httpGet(urls.getBanner)
  const bannerList: FixedContentItem<FixedTypeEnum.IMAGES> = getTarget('images', bannerData.data)
  // 员工简历
  const { data: rolesData } = await httpGet(urls.getGameRoles)
  const roleList = rolesData.data.map((item: any) => {
    return {
      images: getTarget('images', item).content,
      text: getTarget('text', item).content,
      richText: getTarget('richText', item).content
    }
  })
  const { data: videoRes } = await httpGet(urls.queryVideoSource)
  const videoResult = {
    video: getTarget('video', videoRes.data).content
  }
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
        shareLink: shareList.content,
        downBtnList: downBtnList.content,
        downLinks: downLinks.content,
        topData,
        banners: bannerList,
        roleList,
        videoSource: videoResult,
        showReserve,
        reserves,
        fbAndInvite,
        isGrey
      }
    }
  } else {
    return {
      props: {
        shareLink: shareList.content,
        downBtnList: downBtnList.content,
        downLinks: downLinks.content,
        topData,
        banners: bannerList,
        roleList,
        videoSource: videoResult,
        showReserve,
        isGrey
      }
    }
  }
}

export default MobileHome
