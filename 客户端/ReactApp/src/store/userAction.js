export const USER_INFO = 'USER_INFO'

export function userLogin (text) {
  return { type: USER_INFO, text}
}