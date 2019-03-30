import * as info from './action-type';

export const saveUserInfo = (value) => {
  return {
    type: info.SAVEUSERINFO,
    value
  }
}