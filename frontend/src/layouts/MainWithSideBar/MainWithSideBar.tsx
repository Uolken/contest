import React from 'react'
import styles from '../../pages/AuthorizedUsersPages/ProfilePage/ProfilePage.module.css'
import SideBar from '../../components/SideBar/SideBar'

const MainWithSideBar = ({ children }: { children: any }) => (
  <div className={styles.profilePage}>
    <SideBar/>
    <div className={styles.main}>
      {children}
    </div>
  </div>
)

export default MainWithSideBar
