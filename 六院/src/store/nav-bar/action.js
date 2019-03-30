import * as nav from './action-type';

export const updataNarBar = (value) => {
  return {
    type: nav.UPDATE_NAV_BAR,
    value
  }
}
export const test = (value) => {
  return dispatch => {
    setTimeout(() => {
      dispatch({
        type: nav.TEST,
        value: value
      })
    }, 2000)
  }
}