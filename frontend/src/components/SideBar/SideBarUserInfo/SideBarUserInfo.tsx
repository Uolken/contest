import React from 'react'
import styles from './SideBarUserInfo.module.css'
import notificationIcon from '../../../images/icons/notification.svg'

const SideBarUserInfo = ({
  avatar,
  fullName,
  groupName,
  hasNotification,
  isOpened,
}: {
  avatar: string,
  fullName: string,
  groupName: string,
  hasNotification: boolean,
  isOpened: boolean
}) => {
  const state = isOpened ? '' : styles.closed
  return (
    <div className={`${styles.userShortInfo} ${state}`}>
      <img src={avatar} alt="avatar" className={styles.avatar} />
      <div className={styles.fullNameAndGroup}>
        <div className={styles.fullName}>{fullName}</div>
        <div className={styles.group}>{groupName}</div>
      </div>
      <div className={styles.notification}>
        <img src={notificationIcon} alt="notification icon" className={styles.notificationIcon} />
      </div>
    </div>
  )
}

export default SideBarUserInfo
