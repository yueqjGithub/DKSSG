import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Context } from '../../../store'
import styles from './index.module.scss'

type Props = {
  video: {
    data: string
  }
  loginHandler: Function
}

type VideoPx = {
  width: number
  height: number
}

const SectionOne = ({ video, loginHandler }: Props) => {
  const { state } = useContext(Context)
  const { showReserve, codes, isLogin, imgPrefix } = state
  const alreadyReserve = useMemo(() => {
    return codes.find(item => item.codeType === 'RESERVE') !== undefined
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
  const iRef = useRef<HTMLImageElement>(null)
  const moveRole = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // 中心點
    const cx = document.documentElement.clientWidth / 2
    const cy = document.documentElement.clientHeight / 2
    const px = e.clientX
    const py = e.clientY
    const ox = (px - cx) / cx
    const oy = (py - cy) / cy
    const tx = `${(5 * ox) * -1}px`
    const ty = `${(3 * oy) * -1}px`
    if (iRef.current) {
      iRef.current.style.transform = `translate(${tx},${ty})`
    }
  }
  return (
    <div className={`${styles.container} flex-row flex-jst-center flex-ali-center`} style={{ backgroundImage: `url(${imgPrefix}/pc/sec1Bg.png)` }}
      onMouseMove={moveRole}
    >
      <div className={styles.roleContainer}>
        <img src={`${imgPrefix}/pc/sec1person.png`} alt="" className={styles.roleImg} ref={iRef}/>
        <div className={`${styles.roleTit} flex-row flex-jst-center flex-ali-center`}>
          <img src={`${imgPrefix}/pc/sec1tit.png`} alt="" className={styles.roleTitImg}/>
          <div className={`${styles.playContainer} cursor-pointer`} onClick={() => changePlay(true)}>
            <img src={`${imgPrefix}/pc/playBtn.png`} alt="" className='hover-scale'/>
          </div>
        </div>
      </div>
      <div className={`${styles.videoFlowContainer}`} style={{ display: isPlay ? 'block' : 'none' }}>
          <div className="full-width full-height flex-col flex-jst-center flex-ali-center">
            <div className={`${styles.videoOut}`}>
              <div className={styles.vFlow} onClick={() => changePlay(false)}></div>
              <div className={styles.vPosition}>
                <div className={`${styles.closeBtn} flex-row flex-jst-center flex-ali-center`} onClick={() => changePlay(false)}>
                  <img src='/common/close-bold.png' alt=""/>
                </div>
                {
                  isPlay ? (
                    <video ref={vRef} autoPlay={true} preload="true" loop controls={true} width={videoInfo.width} height={videoInfo.height} style={{ background: '#000' }}>
                    <source src={video.data} />
                  </video>
                  ) : ''
                }
              </div>
            </div>
          </div>
      </div>
      {/* 透明蒙版 */}
      <div className={`${styles.flowModal} flex-row flex-jst-center flex-ali-end`}>
        {
          showReserve && (
            <img
              src={`${imgPrefix}${isLogin && alreadyReserve ? '/pc/login_Btn_a1.png' : "/pc/loginBtn.png"}`}
              alt="" className={`${isLogin && alreadyReserve ? '' : 'hover-scale cursor-pointer'}`} onClick={() => {
              if (isLogin && alreadyReserve) return
              loginHandler()
            }}/>
          )
        }
      </div>
    </div>
  )
}

export default SectionOne
