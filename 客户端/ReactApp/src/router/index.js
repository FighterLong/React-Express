import React, {Component} from 'react'
import {HashRouter as Router, Route, Switch} from 'react-router-dom'

import Login from '../view/login/login.js'
import Signin from '../view/signIn/signin.js'
import Indexs from '../view/index/index.js'
import Errors from '../view/404/error.js'
import ArticleOperation from '../view/article/article_operation'

export default class Routers extends Component {
    render () {
      return (
        <Router>
          <Switch>
            <Route exact path="/login" component={Login}/>
            <Route exact path="/" component={Indexs}/>
            <Route exact path="/signin" component={Signin}/>
            <Route exact path="/ArticleOperation/:id" component={ArticleOperation}/>
            <Route component={Errors}/>
          </Switch>
        </Router>
      )
    }
  }