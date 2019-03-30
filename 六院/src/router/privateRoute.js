import React from 'react'
import {
  Route,
  Redirect
} from 'react-router-dom'
import Cookies from 'js-cookie'

const hasCookies = () => {
  Cookies.set('user', 'zhang')
  return !!Cookies.get('user')
}

export const EnterRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      hasCookies ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location }
          }}
        />
      )
    }
  />)