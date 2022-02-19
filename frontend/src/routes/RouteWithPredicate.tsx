import { Redirect, Route } from 'react-router-dom'
import { RouteProps } from 'react-router'
import React from 'react'

export type RouteWithPredicateProps = RouteProps & { predicate: () => boolean, redirectTo: string }

const RouteWithPredicate = ({
  component: Component,
  predicate,
  redirectTo,
  ...rest
}: RouteWithPredicateProps) => {
  const routeRender = (props: any) => {
    if (!predicate()) {
      return <Redirect to={redirectTo} />
    }
    /* eslint-disable react/jsx-props-no-spreading */
    // @ts-ignore
    return <Component {...props} />
  }
  /* eslint-disable react/jsx-props-no-spreading */
  return <Route {...rest} render={routeRender} />
}

export default RouteWithPredicate
