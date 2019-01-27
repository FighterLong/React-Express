import { combineReducers } from 'redux'
import * as userAction from './userAction'
const userState = {
  userInfo: userAction.USER_INFO,
//   userInfo: {}
}
function getUserInfo (state = userState, action) {
  switch (action.type) {
    case 'USER_INFO':
      return Object.assign({}, state, {
        userInfo: action.filter
    })
    default:
      return state
    }
}
export default combineReducers({getUserInfo})