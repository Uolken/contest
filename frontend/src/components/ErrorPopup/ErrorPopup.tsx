import styles from "./ErrorPopup.module.css"
import { ReactComponent as CrossIcon } from "../../images/icons/cross.svg"

type ErrorPopupProps = {
  errorMessage: string
  onClose: () => void
}

const ErrorPopup = (
  {
    errorMessage,
    onClose
  }: ErrorPopupProps
) => {
  return  <>
    <div className={styles.errorPopupBackground} onClick={onClose}/>
    <div className={styles.errorPopup} onClick={e => e.stopPropagation()}>
      <div className={styles.header}>
        <div>Ошибка</div>
        <div onClick={onClose}>
          <CrossIcon/>
        </div>
      </div>
      <div className={styles.errorMessage}>
        {errorMessage}
      </div>
    </div>
  </>
}

export default ErrorPopup
