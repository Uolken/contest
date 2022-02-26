import React from 'react'
import styles from './TwoColumnsWithLogo.module.css'
import sstuLogo from '../../images/icons/sstu-logo.svg'

const TwoColumnsWithLogo = ({ children }: { children: any }) => (
  <div className={styles.loginPage}>
    <div className={styles.leftColumn}>
      {children}
    </div>
    <div className={styles.rightColumn}>
      <div className={styles.logoWrapper}>
        <img src={sstuLogo} alt="sstu logo" className={styles.logo} />
      </div>
    </div>
  </div>
)

export default TwoColumnsWithLogo
