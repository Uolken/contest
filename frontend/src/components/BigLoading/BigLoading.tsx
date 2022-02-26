import { TailSpin } from "react-loader-spinner"
import sstuLogo from "../../images/icons/sstu-logo.svg"
import spinningCircle from "../../images/icons/spining-circle.svg"
import styles from "./BigLoading.module.css"
import React from "react"

export default () => {
  return <div className={styles.loading}>
    <img src={sstuLogo} className={styles.logo}/>
    <div className={styles.circleBlock}>
      <img src={spinningCircle} className={styles.circle}/>
    </div>

  </div>
}
