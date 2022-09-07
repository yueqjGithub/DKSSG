import { useContext, useState } from 'react'
import { Context } from '../../../store'
import { copyHandler } from '../../../utils'
import styles from './index.module.scss'
type Props = {
  sharePath?: string
  closeHandler: Function
}

const ShareModal = ({ sharePath, closeHandler }: Props) => {
  const { state } = useContext(Context)
  const { imgPrefix } = state
  const pList = [
    '好友邀請説明：',
    '1.點擊複製按鈕後，可以將鏈接複製給好友，好友點擊您的鏈接預約成功後，則視爲分享成功',
    '2.若活動期間經理遇到任何問題，請透過官方電子郵件信箱尋求幫助',
    'cs.monsteroverload@avalongames.com'
  ]
  const [copyName, setName] = useState<'複製' | '已複製'>('複製')
  const copyPath = async (path: string) => {
    try {
      await copyHandler(path)
      setName('已複製')
    } catch {
      alert("複製失敗，請手動複製")
    }
  }
  return (
    <div className={`${styles.modal} cus-slide-top-in`}>
      <div className={styles.contModal} style={{ backgroundImage: `url(${imgPrefix}/pc/sec3/rule_bg.png)` }}>
        <p className={styles.title}>把《摩爾街之王》分享給好友</p>
        <div className={styles.copyContainer}>
          <input type="text" className={styles.cusInput} value={sharePath}/>
          <div className={`${styles.copyBtn} cursor-pointer hover-scale`} onClick={() => copyPath(sharePath!)}>{copyName}</div>
        </div>
        {
          pList.map((item, index) => {
            return <div key={index} className={styles.detail}>{item}</div>
          })
        }
        <img src={`${imgPrefix}/pc/sec3/closeBtn.png`} alt="" className={`${styles.closeBtn} cursor-pointer`} onClick={() => closeHandler()}/>
      </div>
    </div>
  )
}

export default ShareModal
