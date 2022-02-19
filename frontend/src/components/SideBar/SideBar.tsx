import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import sideBar from '../../store/components/sideBar'
import styles from './SideBar.module.css'
import SideBarUserInfo from './SideBarUserInfo/SideBarUserInfo'
import avatar from '../../images/avatar.png'
import user from '../../store/user'
import SideBarItem from './SideBarItem/SideBarItem'
import sessionInfo from "../../store/sessionInfo"

const SideBar = observer(() => {
  const [isHovered, setHovered] = useState(0)

  return (
    // eslint-disable-next-line no-return-assign,max-len
    <div className={styles.sideBar} onMouseEnter={() => setHovered(1)}
         onMouseLeave={() => setHovered(0)}>
      <div className={styles.sideBarGroup}>
        {/* eslint-disable-next-line max-len */}
        <SideBarUserInfo avatar={avatar} fullName={user.fullName} groupName={user.group.name}
                         hasNotification isOpened={!!isHovered}/>
      </div>
      <div className={styles.sideBarGroup}>
        <ul className={styles.sideBarElementsList}>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          {sideBar.firstGroup.map((el) => <SideBarItem {...el} isOpened={!!isHovered} key={el.name}/>)}
        </ul>
      </div>

      {
        sessionInfo.isTeacher() && <div className={styles.sideBarGroup}>
              <ul className={styles.sideBarElementsList}>
                {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                {sideBar.teacherGroup.map((el) => <SideBarItem {...el} isOpened={!!isHovered}
                                                               key={el.name}/>)}
              </ul>
          </div>
      }
      <div className={styles.sideBarGroup}>
        <ul className={styles.sideBarElementsList}>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          {sideBar.secondGroup.map((el) => <SideBarItem {...el} isOpened={!!isHovered}
                                                        key={el.name}/>)}
        </ul>
      </div>
    </div>
  )
})

export default SideBar
