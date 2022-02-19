import { RouteProps } from 'react-router'
import React from 'react'
import { observer } from 'mobx-react-lite'
import sessionInfo from '../store/sessionInfo'
import RouteWithPredicate from './RouteWithPredicate'

const TeacherRoute = observer((props: RouteProps) => {
  return (
    <RouteWithPredicate
      predicate={() => sessionInfo.isTeacher()}
      redirectTo="/profile"
      /* eslint-disable-next-line react/jsx-props-no-spreading */
      {...props}
    />
  )
})

export default TeacherRoute
