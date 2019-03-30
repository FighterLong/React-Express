import * as info from './action-type'

let defaultState = {
  name: '',
  phoneNo: ''
}

// 用户信息
export const userInfo = (state = defaultState, action = {}) => {
  switch (action.type) {
    case info.SAVEUSERINFO:
      return {...state, ...action.value};
    
    default:
      return state;
  }
}