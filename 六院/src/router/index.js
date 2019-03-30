import React, {Component} from 'react'
import {HashRouter as Router, Route, Switch} from 'react-router-dom'

import Login from '../view/login/index.js'
import Layout from '../view/layout/index.js'

// react-router4 不再推荐将所有路由规则放在同一个地方集中式路由，子路由应该由父组件动态配置，组件在哪里匹配就在哪里渲染，更加灵活
export default class Routers extends Component {
  render () {
    return (
      <Router>
        <Switch>
          <Route exact path="/login" component={Login}/>
          <Route component={Layout}/>
        </Switch>
      </Router>
    )
  }
}