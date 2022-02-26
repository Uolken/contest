import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import sideBar from '../../store/components/sideBar'
import styles from './SideBar.module.css'
import SideBarUserInfo from './SideBarUserInfo/SideBarUserInfo'
import avatar from '../../images/avatar2.png'
import SideBarItem from './SideBarItem/SideBarItem'
import sessionInfo from "../../store/sessionInfo"
import { fullName } from "../../utils"
import { User } from "../../types"
import graphQLApi from "../../api/graphQLApi"
import { USER } from "../../api/queries"

const SideBar = observer(() => {
  const [isHovered, setHovered] = useState(0)
  const [user, setUser] = useState<User>()
  useEffect(() => {
    graphQLApi(USER, { userId: sessionInfo.userId })
    .then(r => setUser(r.user))
  }, [sessionInfo.userId])

  return (
    <div className={styles.sideBar} onMouseEnter={() => setHovered(1)}
         onMouseLeave={() => setHovered(0)}>
      <div>

        <div className={styles.sideBarGroup}>
          {user && <SideBarUserInfo avatar={avatar} fullName={fullName(user)}
                                    groupName={user.group?.name}
                                    hasNotification isOpened={!!isHovered}/>}
        </div>

        {
          !sessionInfo.isTeacher() &&         <div className={styles.sideBarGroup}>
                <ul className={styles.sideBarElementsList}>
                  {sideBar.studentGroup.map((el) => <SideBarItem {...el} isOpened={!!isHovered}
                                                                 key={el.name}/>)}
                </ul>
            </div>
        }
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

      <div>
        <div className={styles.sideBarGroup}>
          <ul className={styles.sideBarElementsList}>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            {sideBar.bottomGroup.map((el) => <SideBarItem isOpened={!!isHovered}
                                                          key={el.name} Icon={el.Icon}
                                                          name={el.name} action={el.action}/>)}
          </ul>
        </div>
      </div>
    </div>
  )
})

export default SideBar
