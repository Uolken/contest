import React from 'react'
import { RouteProps } from 'react-router'
import { observer } from 'mobx-react-lite'
import sessionInfo from '../store/sessionInfo'
import RouteWithPredicate from './RouteWithPredicate'

const AuthorizedRoute = observer((props: RouteProps) => (
  <RouteWithPredicate
    predicate={() => sessionInfo.isAuthorized()}
    redirectTo="/auth"
      /* eslint-disable-next-line react/jsx-props-no-spreading */
    {...props}
  />
))

export default AuthorizedRoute
