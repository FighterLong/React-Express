import React, {Component} from 'react'
import {HashRouter as Router, Route, Switch} from 'react-router-dom'

import PrivateRoute from './privateRoute'
import Login from '../view/login/login.js'
import Signin from '../view/signIn/signin.js'
import Indexs from '../view/index/index.js'
import Errors from '../view/404/error.js'
import ArticleMessage from '../view/article/article_message'
import ArticleOperation from '../view/article/article_operation'

export default class Routers extends Component {
    render () {
      return (
        <Router>
          <Switch>
            <Route exact path="/login" component={Login}/>
            <Route exact path="/" component={Indexs}/>
            <Route exact path="/signin" component={Signin}/>
            <Route exact path="/ArticleMessage/:id" component={ArticleMessage}/>
            <PrivateRoute path="/ArticleOperation/:id" component={ArticleOperation}></PrivateRoute>
            {/* <Route exact path="/ArticleOperation/:id" component={ArticleOperation}/> */}
            <Route component={Errors}/>
          </Switch>
        </Router>
      )
    }
  }