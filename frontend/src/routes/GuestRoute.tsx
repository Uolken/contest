import { RouteProps } from 'react-router'
import React from 'react'
import { observer } from 'mobx-react-lite'
import sessionInfo from '../store/sessionInfo'
import RouteWithPredicate from './RouteWithPredicate'

const GuestRoute = observer((props: RouteProps) => {
  const isAuthorized = sessionInfo.isAuthorized()
  return (
    <RouteWithPredicate
      predicate={() => !isAuthorized}
      redirectTo="/profile"
      /* eslint-disable-next-line react/jsx-props-no-spreading */
      {...props}
    />
  )
})

export default GuestRoute
