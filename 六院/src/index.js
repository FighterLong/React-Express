import React from 'react';
import ReactDOM from 'react-dom';
import Routers from './router'
import {Provider} from 'react-redux'
import store from '@/store/index.js'
import registerServiceWorker from './registerServiceWorker';
// import axios from 'axios'
import './common/stylus/index.styl'

import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

document.title = '中山六院管理端'
// porvider组件再应用最外层，传入store即可，只用一次
// connect负责从外部获取组件需要的参数
// connect可以用装饰器的方式来写
// axios.interceptors.request.use(
//   config => {
//       config.withCredentials=true;
//       return config;
//   },
//   err => {
//       return Promise.reject(err);
// });
ReactDOM.render(
  (
    <Provider store={store}>
      <Routers/>
    </Provider>
  ), document.getElementById('root'));
registerServiceWorker();
