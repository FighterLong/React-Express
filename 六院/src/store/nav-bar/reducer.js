import * as nav from './action-type'

let defaultState = []

// 用户信息
export const navBarList = (state = defaultState, action = {}) => {
  switch (action.type) {
    case nav.UPDATE_NAV_BAR:
      return action.value;
    case nav.TEST:
      return action.value
    default:
      return state;
  }
}