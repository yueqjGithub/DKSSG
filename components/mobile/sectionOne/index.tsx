import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Context } from '../../../store'
import styles from './index.module.scss'

type Props = {
  count: number
  showReserve: boolean
  downBtnList: FixedContentItem<FixedTypeEnum.IMAGES>['content']
  loginHandler: Function
  video: {
    data: string
  }
}

type VideoPx = {
  width: number
  height: number
}

const SectionOne = ({ count, showReserve, loginHandler, downBtnList, video }: Props) => {
  const { state, dispatch } = useContext(Context)
  const { isLogin, codes, imgPrefix } = state
  const storeLink = useMemo(() => {
    return downBtnList?.pop()?.link
  }, [downBtnList])
  const alreadyReserve = useMemo(() => {
    return codes?.find(item => item.codeType === 'RESERVE') !== undefined
  }, [codes])
  const [isPlay, setPlay] = useState<boolean>(false)
  const [videoInfo, setInfo] = useState<VideoPx>({ width: 0, height: 0 })
  const changePlay = (status: boolean) => {
    setPlay(status)
    if (status) {
      vRef.current?.play()
    } else {
      vRef.current?.pause()
    }
  }
  const vRef = useRef<HTMLVideoElement>(null)
  const setVideoSize = () => {
    let v = document.createElement('video')
    v.setAttribute('preload', 'true')
    v.src = video.data
    v.onloadeddata = () => {
      const w = v.videoWidth
      const h = v.videoHeight
      const cH = window.innerHeight
      const cW = window.innerWidth
      setInfo({
        width: w >= cW ? cW * 0.7 : v.videoWidth,
        height: h >= cH ? cH * 0.9 : v.videoHeight
      })
    }
  }
  useEffect(() => {
    setVideoSize()
  }, [])
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
    <div ref={containerRef} className={`${styles.container} flex-row flex-jst-center flex-ali-end`} style={{ backgroundImage: `url(${imgPrefix}/mobileImg/sec1Bg.png)` }}>
      <img src={`${imgPrefix}/mobileImg/sec1P.png`} alt="" className={styles.bgPerson}/>
      <img src={`${imgPrefix}/mobileImg/playBtn.png`} alt="" className={`${styles.playBtn} click-scale`} onClick={() => setPlay(true)}/>
      {
        isPlay && (
          <div className={styles.videoModal}>
            <video ref={vRef} autoPlay={true} preload="true" loop controls={true} width={videoInfo.width} height={videoInfo.height} style={{ background: '#000' }}>
              <source src={video.data} />
            </video>
            <img src={`${imgPrefix}/pc/sec3/closeBtn.png`} alt="" onClick={() => setPlay(false)} style={{ width: '50%', marginTop: '.1rem' }} className='click-scale'/>
          </div>
        )
      }
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
