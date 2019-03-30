/*
 * @Author: kaiback__zgt_1430666237@qq.com 
 * @Date: 2018-05-12 00:56:40 
 * @Last Modified by:   kaiback__zgt_1430666237@qq.com 
 * @Last Modified time: 2018-05-12 00:56:40 
 */

import ajx from '../request.js'
// 登入
export function getWechatInfo (params) {
  return ajx.get(`URL`, {params})
}
