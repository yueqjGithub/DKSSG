import { useContext } from 'react'
import { Context } from '../../../store'
import styles from './index.module.scss'



const CusDialog = () => {
  const { state, dispatch } = useContext(Context)
  const { dialogContent, imgPrefix } = state
  const closeDialog = () => {
    dispatch && dispatch({ type: 'set', key: 'showDialog', val: false })
  }
  return (
    <div className={styles.dialogContainer}>
      <div className={`${styles.dialogOut} flex-col flex-jst-center flex-ali-center`} style={{ backgroundImage: `url(${imgPrefix}/pc/sec3/rule_bg.png)` }}>
        <div className={styles.title}>信息</div>
        <p className={styles.content}>{dialogContent}</p>
        <div className={`${styles.btn} click-scale cursor-pointer`} onClick={() => closeDialog()}>確認</div>
      </div>
    </div>
  )
}

export default CusDialog