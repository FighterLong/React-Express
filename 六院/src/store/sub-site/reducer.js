import * as nav from './action-type'

let MenuList = []

// 子网站导航
export const setNavList = (state = MenuList, action = {}) => {
  switch (action.type) {
    case nav.SUB_SITE:
      return action.value;
    case nav.NO_SUB_SITE:
      return action.value
    default:
      return state;
  }
}