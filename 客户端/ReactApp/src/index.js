import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import store from './store/index'
// import LocaleProvider from 'antd/lib/localeprovider';
import { LocaleProvider } from 'antd';
import ja_JP from 'antd/lib/locale-provider/ja_JP';
// import {HashRouter as Router, Route, Switch} from 'react-router-dom'
// import Layouts from './view/index/index'
// import 'antd/dist/antd.css'
import './index.css';
import Router from './router/index.js'
import * as serviceWorker from './serviceWorker';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('ja_JP');
ReactDOM.render(
    // <Router>
    //     <Switch>
    //     <Route exact path="/login" component={Login}/>
    //     <Route component={Layouts}/>
    //     </Switch>
    // </Router>
    <Provider store={store}>
        <LocaleProvider locale={ja_JP}>
            <Router />
        </LocaleProvider>
    </Provider>
  , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
