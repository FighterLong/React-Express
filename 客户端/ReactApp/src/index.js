import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import store from './store/index'
// import {HashRouter as Router, Route, Switch} from 'react-router-dom'
// import Layouts from './view/index/index'
// import 'antd/dist/antd.css'
import './index.css';
import Router from './router/index.js'
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    // <Router>
    //     <Switch>
    //     <Route exact path="/login" component={Login}/>
    //     <Route component={Layouts}/>
    //     </Switch>
    // </Router>
    <Provider store={store}>
        <Router />
    </Provider>
  , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
