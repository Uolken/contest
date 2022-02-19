import { observer } from 'mobx-react-lite'
import React from 'react'
import sessionInfo from '../../../store/sessionInfo'
import sideBar from "../../../store/components/sideBar"

const ProfilePage = observer(() => {
  return (
    <div className="page">
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a href="#" onClick={() => sessionInfo.logout()}>logout</a>
    </div>
  )
})
export default ProfilePage
