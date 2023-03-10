import { useContext, useMemo, useState } from 'react'
import { Context } from '../../../store'
import { copyHandler } from '../../../utils'
import styles from './index.module.scss'
type Props = {
  closeHandler: Function
}

const codeTypes = [
  { id: 'RESERVE', typeName: '預約獎勵'},
  { id: 'SHARE1', typeName: '分享1人'},
  { id: 'SHARE3', typeName: '分享3人'},
  { id: 'SHARE5', typeName: '分享5人'},
]

const PrizeModal = ({ closeHandler }: Props) => {
  const { state, dispatch } = useContext(Context)
  const { codes, imgPrefix } = state
  const [cur, setCur] = useState<number>(-1)
  // const [copyName, setName] = useState<'複製' | '已複製'>('複製')
  const codeList = useMemo(() => {
    const list = codeTypes.map((item, index) => {
      const code = codes.find(c => c.codeType === item.id)
      return {
        code: code?.code || '',
        typeName: item.typeName,
        status: code?.code ? true : false
      }
    })
    return list
  }, [codes])
  const copyPath = async (path: string) => {
    try {
      await copyHandler(path)
    } catch {
      alert("複製失敗，請手動複製")
    }
  }
  return (
    <div className={`${styles.modal} cus-slide-top-in`}>
      <div className={styles.contModal} style={{ backgroundImage: `url(${imgPrefix}/mobileImg/modalBg.png)` }}>
        <p className={styles.title}>《魔爾街之王》事前登錄</p>
        <div className={styles.cusSplit}></div>
        <div className={`${styles.copyContainer} flex-row flex-jst-btw flex-ali-center flex-wrap`}>
          {
            codeList.map((item, idx) => {
              return <div className={`${styles.copyItem} ${item.status ? '' : styles.wait} flex-row flex-ali-center`} key={idx}>
                <div className={styles.typeName}>{item.typeName}</div>
                <div className={styles.cusInput}>{item.code}</div>
                <div className={styles.copyBtn} onClick={() => {
                  if (item.status) {
                    copyPath(item.code)
                    setCur(idx)
                  }
                }}>{cur === idx ? '已複製' : (item.status ? '複製' : '未獲得')}</div>
              </div>
            })
          }
          <div className={styles.rulesContainer}>
            <div className={styles.rulesOut}>虛寶碼使用說明：進入遊戲後，點擊頭像，進入個人設置界面，輸入對應虛寶碼後即可領取獎勵。</div>
          </div>
          <div className={styles.tips}>
          *集結獎勵和關注獎勵將在正式開服後發放給全服務器玩家
          </div>
        </div>
      </div>
      <img src={`${imgPrefix}/pc/sec3/closeBtn.png`} alt="" className={`${styles.closeBtn} click-scale`} onClick={() => closeHandler()}/>
    </div>
  )
}

export default PrizeModal
