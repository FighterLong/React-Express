import axios from 'axios'
import {message} from 'antd';
import {URL} from '@/common/js/url.js'
// 资讯模块的api
//获取资讯列表
export  function getData_information(params,callback) {
    axios({
        url: URL+'/admin/message/retrieve',
        data: params,
        method: 'post',
      }).then((res)=>{
        if(res.data.code === 200) {
            callback(res)
        }else {
            message.error(res.data.msg)
        }
    }).catch(error => {
        message.error('异常请求')
    })
}
// 删除资讯
export  function delData_information(params,callback) {
    axios.get(`${URL}/admin/message/delete?ids=${params}`).then((res)=>{
        if(res.data.code === 200) {
            callback(res)
            message.success('删除成功');
        }else {
            message.error(res.data.msg)
        }
    }).catch(error => {
        message.error('异常请求')
    })
}
// 置顶/取消置顶 资讯
export  function topData_information(params,callback) {
    axios.get(`${URL}/admin/message/top?ids=${params.ids}&top=${params.top}`).then((res)=>{
        if(res.data.code === 200) {
            params.top ? message.success('置顶成功') : message.success('取消置顶成功')
            callback(res)
        }else {
          message.error(res.data.msg)
        }
    }).catch(error => {
      message.error('异常请求')
    })
}
export  function publishData_information(params,callback) {
    axios.post(`${URL}/admin/message/publish?ids=${params.ids}&status=${params.status}&message=${params.message}`).then((res) => {
        if(res.data.code === 200) {
            params.status ? message.success('发布成功') :  message.success('取消发布成功')
            callback(res)
        }else {
          message.error(res.data.msg)
        }
    }).catch(error => {
        message.error('异常请求')
    })
}
// 复制
export function copyData(params,callback) {
    axios.post(`${URL}/admin/message/copy?messageIds=${params.selectedRowKeys}&typeIds=${params.typeIds}`).then(res => {
        if(res.data.code === 200) {
            message.success('复制成功')
            callback(res)
        }else {
            message.error(res.data.msg)
        }
    })
}

/**************************   医务志愿模块的API *************************/
// 获取义务志愿列表
export function getData_medical(params,callback) {
    axios({
        url: URL+'/admin/medicalVolunteer/retrieveList',
        data: params,
        method: 'post',
      }).then((res)=>{
          callback(res)
    }).catch(error => {
        // message.error('异常请求')
    })
}
// 删除数据
export function delData_medical(params,callback) {
    axios.get(`${URL}/admin/medicalVolunteer/delete?ids=${params}`).then((res)=>{
        if(res.data.code === 200) {
            callback(res)
            message.success('删除成功');
        }else {
            message.error(res.data.msg)
        }
    }).catch(error => {
        message.error('异常请求')
    })
}
export function publishData_medical(params,callback) {
    axios.post(`${URL}/admin/medicalVolunteer/publish?ids=${params.ids}&status=${params.status}`).then((res) => {
        if(res.data.code === 200) {
            params.status ? message.success('发布成功') :  message.success('取消发布成功')
            callback(res)
        }else {
          message.error(res.data.msg)
        }
    }).catch(error => {
    message.error('异常请求')
    })
}