/*
 * @Author: kaiback__zgt_1430666237@qq.com
 * @Date: 2018-05-09 14:37:32
 * @Last Modified by:   kaiback__zgt_1430666237@qq.com
 * @Last Modified time: 2018-05-09 14:37:32
 */

import ajx from '../request.js'
// 登入
export function login (params) {
  return ajx.get(`URL`, {params})
}
