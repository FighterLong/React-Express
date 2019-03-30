import {createStore, compose, combineReducers, applyMiddleware} from 'redux'
// redux-thunk中间件的作用是让redux可以使用异步
import thunk from 'redux-thunk'
import * as baseInfo from './base-info/reducer.js'
import * as navBar from './nav-bar/reducer.js'

export default createStore(
  combineReducers({
    ...baseInfo,
    ...navBar
  }),
  compose(
    applyMiddleware(thunk),
    // 调试redux
    window.devToolsExtension?window.devToolsExtension():f=>f
  )
)