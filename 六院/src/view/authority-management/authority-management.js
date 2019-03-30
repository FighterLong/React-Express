import React,{Component} from 'react'
import {Modal, Popover, Button, Icon,message,Checkbox, Table} from 'antd'
import axios from 'axios'
import './authority-management.styl'
import { Input } from 'antd'
import {URL} from '@/common/js/url.js'
import { Z_DEFAULT_COMPRESSION } from 'zlib';
const Search = Input.Search
// const Search = Input.SearCh
// const FormItem = Form.Item
// const Option = Select.Option
/* 
    >>>>>>> 注意,此模块比较坑爹,处理方式为：
    1.所有的权限用于渲染页面，注意根据menuCode字段区分同一个模块然后再根据permissionName区分它是可见还是具体操作权限
    2.所有的权限跟现有的权限两个数组比较，然后进行勾选，具体权限勾选时，可见权限相应勾选上，去掉可见权限时反之。。。
    3.修改权限时，需将所有的目前(已有权限)选中的权限id，储存到数组中发送给后台，
                                                                                          ---2018-8-20 15:00
*/

class authorityManagement extends Component {
  state={
    navIndex: 0,// 记录当前选中的下标 初始化为第一个
    model: false,// 编辑/添加 弹框
    userGroup: [],
    justify: [],// 权限数组 所有权限
    existingJustify: [],// 权限数组 已有的权限
    data: [],// dom数组  将格式化数据渲染到页面
    Ids: [],// 已有权限的ID数组
    params: {
      keyword: '',
      pageIndex: 1,
      pageSize: 50
    },
    addParams: {
      roleName: ''
    }
  }

  componentDidMount(){
    this.getUserGroup()
  }

  /************************ 数据操作区 start **************************/
  // 获取用户组
  getUserGroup = () => {
    axios.post(`${URL}/admin/rolePermission/retrieveListRole`,this.state.params).then(res => {
      if(res.data.code === 200) {
        res.data.data.content = res.data.data.content?res.data.data.content: []
        res.data.data.content.forEach(item => {
          item.isShow = false
        })
        this.setState({userGroup: res.data.data.content},()=>{
          this.getAllJurisdiction()// 获取完用户组之后获取 所有权限
        })
      }else {
        message.error(res.data.msg)
      }
    })
  }
  // 获取所有权限
  getAllJurisdiction = () => {
    axios.post(`${URL}/admin/rolePermission/retrieveAllPermission`).then(res => {
      res.data.forEach(item => {
        item.isAll = false
        // if (item.permissionName === '可见') {
        //   item.GLUSER = false
        //   item.FZUSER = false
        // }
      })
      this.setState({justify: res.data},() => {// 获取完所有权限之后获取已有权限
        // let data =this.state.justify.map(item => {
        //   item.isAll = false
        //   return item
        // })
        // this.setState({justify: data})
        this.state.userGroup[this.state.navIndex]&&this.getUserGroupMessage(this.state.userGroup[this.state.navIndex].id)
      })
    })
  }
  // 获取用户组权限
  getUserGroupMessage = (id) => {
    // let data = this.state.justify.map(item => {
    //   item.isAll = false
    //   return item
    // })
    // this.setState({justify: data})
    axios.post(`${URL}/admin/rolePermission/retrieveAllPermissionOfRole?roleId=${id}`).then(res => {
      // 用户组所有权限
      let userGroupPermiss = res.data.map(item => {
        return item.id
      })

      // 权限组所有权限
      // console.log(this.state.justify)
      let groupPermise = this.state.justify
      this.state.justify.map(item => {
        if (userGroupPermiss.includes(item.id)) {
          item.isAll = true
        }
      })
      // let Ids = groupPermise.map(item => {
      //   return item.id
      // })
      // console.log(data.length)
      // data.forEach(item => {
      //   console.log(item)
        // if(item.permissionName === '可见') {
        //   let userARRID = []
        //   // 所有每个模块的ID数组
        //   // console.log(item)
        //   let arrID1 = []
        //   data.map(item1 => {
        //     if(item1.menuCode === item.menuCode && (item1.menuName === '资讯信息（医院动态）' ||
        //     item1.menuName === '资讯信息（医院公告）' || item1.menuName === '资讯信息（媒体报道）'
        //     || item1.menuName === '资讯资讯（学术动态）' || item1.menuName === '资讯信息（党工团建设）') 
        //     && (item1.permissionName === '新建资讯' || item1.permissionName === '编辑资讯' ||
        //     item1.permissionName === '置顶资讯' || item1.permissionName === '复制资讯')){
        //       userARRID.push(item1.id)
        //     }else if(item1.menuCode === item.menuCode && item1.menuName === '新媒体交互' && (item1.permissionName === '新建内容' || item1.permissionName === '编辑内容' ||
        //     item1.permissionName === '置顶内容')){
        //       userARRID.push(item1.id)
        //     }else if(item1.menuCode === item.menuCode && item1.menuName === '专题视频'
        //     && (item1.permissionName === '新建视频' || item1.permissionName === '编辑视频' ||
        //     item1.permissionName === '置顶视频')){
        //       userARRID.push(item1.id)
        //     }else if(item1.menuCode === item.menuCode && item1.menuName === '专题网站'
        //     && (item1.permissionName !== '新建内容' || item1.permissionName === '编辑内容' ||
        //     item1.permissionName === '置顶内容' || item1.permissionName === '复制内容')){
        //       userARRID.push(item1.id)
        //     }else if(item1.menuCode === item.menuCode && item1.menuName === '医院概况'){
        //       userARRID.push(item1.id)
        //     }else if(item1.menuCode === item.menuCode && item1.menuName === '科室导航'
        //     && (item1.permissionName !== '新建科室' || item1.permissionName === '编辑科室')){
        //       userARRID.push(item1.id)
        //     }else if(item1.menuCode === item.menuCode && item1.menuName === '专家信息'
        //     && (item1.permissionName !== '新建专家' || item1.permissionName === '编辑专家')){
        //       userARRID.push(item1.id)
        //     }else if(item1.menuCode === item.menuCode && item1.menuName === '招聘招标（人才招聘）'
        //     && (item1.permissionName !== '新建内容' || item1.permissionName === '编辑内容')){
        //       userARRID.push(item1.id)
        //     }else if(item1.menuCode === item.menuCode && item1.menuName === '招聘招标（招标采购）'
        //     && (item1.permissionName !== '新建内容' || item1.permissionName === '编辑内容')){
        //       userARRID.push(item1.id)
        //     }else if(item1.menuCode === item.menuCode && item1.menuName === '科研'
        //     && (item1.permissionName !== '新建内容' || item1.permissionName === '编辑内容' ||
        //     item1.permissionName === '置顶内容')){
        //       userARRID.push(item1.id)
        //     }else if(item1.menuCode === item.menuCode && item1.menuName === '教学'
        //     && (item1.permissionName !== '新建内容' || item1.permissionName === '编辑内容'
        //     || item1.permissionName === '置顶内容')){
        //       userARRID.push(item1.id)
        //     }else if(item1.menuCode === item.menuCode && item1.menuName === '疾病科普'
        //     && (item1.permissionName !== '新建内容' || item1.permissionName === '编辑内容')){
        //       userARRID.push(item1.id)
        //     }else if(item1.menuCode === item.menuCode && item1.menuName === '就医指南'
        //     && (item1.permissionName !== '新建内容' || item1.permissionName === '编辑内容')){
        //       userARRID.push(item1.id)
        //     }else if(item1.menuCode === item.menuCode && item1.menuName === '首页信息'){
        //       userARRID.push(item1.id)
        //     }else if(item1.menuCode === item.menuCode && item1.menuName === '网站留言'){
        //       userARRID.push(item1.id)
        //     }else if(item1.menuCode === item.menuCode && item1.menuName === '人才招聘处理'){
        //       userARRID.push(item1.id)
        //     }else if(item1.menuCode === item.menuCode && item1.menuName === '医务社工'
        //     && (item1.permissionName !== '新建内容' || item1.permissionName === '编辑内容')){
        //       userARRID.push(item1.id)
        //     }
        //     // console.log(item1)


        //     if(item1.menuCode === item.menuCode && item1.permissionName !== '可见'){
        //       arrID1.push(item1.id)
        //     }
        //   })
        //   // 已有权限
        //   let arrID2 = []
        //   res.data.forEach(item1 => {
        //     if(item1.menuCode === item.menuCode && item1.permissionName !== '可见'){
        //       arrID2.push(item1.id)
        //     }
        //   })
        //   let temp = false
        //   // console.log('所有权限')
        //   // console.log(arrID1)
        //   // console.log('已有权限')
        //   // console.log(arrID2)
        //   // console.log('********************')
        //   for(var i=0,len = arrID1.length; i< len; i++) {
        //     temp =  arrID2.indexOf(arrID1[i]) === -1 ? false : true
        //     // console.log(item2 + '---------------------')
        //     if(!temp){
        //       break;
        //     }
        //   }
        //   // arrID1.forEach(item2 => {
        //   //   temp =  arrID2.indexOf(item2) === -1 ? false : true
        //   //   console.log(item2 + '---------------------')
        //   //   if(!temp){
        //   //     return
        //   //   }
        //   //   console.log(item2 + '************')
            
        //   // })
        //   let userFlag = false
        //   arrID2.forEach(item2 => {
        //     // if(userARRID.length){
        //     //   return
        //     // }
        //     // console.log(item2)
        //     if(userARRID.indexOf(item2) === -1) {
        //       userFlag = false
        //       return
        //     }else{
        //       userFlag = true
        //     }
        //     // userFlag = userARRID.includes(item2)
        //   })
        //   item.FZUSER = temp
        //   item.GLUSER = userFlag
        // }
      // })
      this.setState({existingJustify: res.data, justify: groupPermise},()=>{this.filteData()})
    })
  }
  // 保存修改权限
  saveExisting = () => {
    // console.log(this.state.Ids)
    axios.post(`${URL}/admin/rolePermission/roleAuthorization?roleId=${this.state.userGroup[this.state.navIndex].id}&pids=${this.state.Ids}`).then(res => {
      res.data.code === 200 ? message.success('保存成功！') : message.error(res.data.msg)
    }).catch(err => { message.error('异常请求') })
  }
  // 删除用户组
  delUserGroup = (data) => {
    axios.get(`${URL}/admin/rolePermission/deleteRole?ids=${[data.id]}`).then(res => {
      if(res.data.code === 200){
        message.success('删除成功!')
        this.getUserGroup()
      }else {
        message.error(res.data.msg)
      }
    }).catch(err =>{
      message.error('异常请求')
    })
  }
  // 添加用户组
  addUserGroup = () => {
    this.setState({model: true,isUpdate: false})
  }
  updateUserGroup = (item) => {
    this.setState({model: true,addParams: item,isUpdate: true})
  }
  // 保存用户组
  saveUserGroup = () => {
    if(this.state.isUpdate){
      axios.post(`${URL}/admin/rolePermission/updateRole`,this.state.addParams).then(res => {
        if(res.data.code === 200) {
          message.success('保存成功！')
          this.setState({model: false,addParams: { roleName: ''}})
          this.getUserGroup()
        }else{
          message.error(res.data.msg)
        }
      })
      return
    }
    axios.post(`${URL}/admin/rolePermission/createRole`,this.state.addParams).then(res => {
      if(res.data.code === 200) {
        message.success('添加成功！')
        this.setState({model: false,addParams: { roleName: ''}})
        this.getUserGroup()
      }else{
        message.error(res.data.msg)
      }
    })
  }
  /************************ 数据操作区 end   **************************/
  // 修改权限
  changeExisting = (id,data,paternal) => {//paternal 表示是存在上级的  也就是可见
    let Ids = this.state.Ids
    // console.log(Ids)
    // let existingJustify = this.state.existingJustify
    if(Ids.indexOf(id) === -1 && paternal && Ids.indexOf(paternal.id) === -1) {// 未选中的时候 选中当前和其可见
      // arr.push(data)
      // arr.push(paternal)
      Ids.push(id)
      Ids.push(paternal.id)
    }else if(Ids.indexOf(id) === -1 && paternal){// 选中权限
      // arr.push(data)
      Ids.push(id)
    } else {
      Ids.splice(Ids.indexOf(id),1)
      // 当前这块的所有权限v
      let isIncluds = false
      this.state.justify.forEach(item => {
        if (item.menuCode === data.menuCode) {
          if (Ids.includes(item.id) && item.id !== paternal.id) {
            isIncluds = true
          }
        }
      })
      if (!isIncluds){
        Ids.splice(Ids.indexOf(paternal.id),1)
      }
      if(!Ids.length){
        message.error('管理组必须包含一种权限')
        Ids.push(id)
        Ids.push(paternal.id)
        return
      }
    }
    // else 
    // if(Ids.indexOf(id) === -1 && !paternal && id !== '管理人' && id !== '负责人') {// 选中可见
    //   // existingJustify.push(data)
    //   Ids.push(id)
    // }else if(Ids.indexOf(id) !== -1 && !paternal && Ids.length && id !== '管理人' && id !== '负责人'){// 取消可见
    //   // this.state.existingJustify.forEach((item,index) => {
    //   //   if(item.menuCode === data.menuCode && Ids.indexOf(item.id) !== -1){
    //       Ids.splice(Ids.indexOf(id),1)
    //     // }
    //   // })
    // }else if(id === '管理人'){
    //   console.log('管理人')
    //   let falg = false // 定义一个临时标记
    //   // let index = 0 // 用于记录下标
    //   let allJustify = this.state.justify
    //   let temp = []
    //   allJustify.forEach(item => {
    //     // if(item.permissionName === '可见'){
    //     //   temp.push(item.id)
    //     // }
    //     if(item.menuCode === data.menuCode && item.permissionName === '可见'){
    //       item.GLUSER = !item.GLUSER
    //       item.FZUSER = false
    //       falg = item.GLUSER
    //       Ids = this.setIds(Ids,item.id,item.GLUSER || item.FZUSER)
    //     }
    //     if(item.menuCode === data.menuCode && item.permissionName !== '可见' && !falg) {
    //       Ids = this.setIds(Ids,item.id,false)
    //       this.setState({justify: allJustify},()=>{
    //         this.filteData()
    //       })
    //       return
    //     }
    //     // Ids = temp
    //     if(item.menuCode === data.menuCode && (item.menuName === '资讯信息（医院动态）' ||
    //     item.menuName === '资讯信息（医院公告）' || item.menuName === '资讯信息（媒体报道）'
    //     || item.menuName === '资讯资讯（学术动态）' || item.menuName === '资讯信息（党工团建设）') 
    //     && (item.permissionName === '新建资讯' || item.permissionName === '编辑资讯' ||
    //     item.permissionName === '置顶资讯' || item.permissionName === '复制资讯')){
    //       Ids = this.setIds(Ids,item.id,falg)
    //     }else if(item.menuCode === data.menuCode && item.menuName === '新媒体交互'&& item.menuName === '新媒体交互' && (item.permissionName === '新建内容' || item.permissionName === '编辑内容' ||
    //     item.permissionName === '置顶内容')){
    //       Ids = this.setIds(Ids,item.id,falg)
    //     }else if(item.menuCode === data.menuCode && item.menuName === '专题视频'
    //     && (item.permissionName === '新建视频' || item.permissionName === '编辑视频' ||
    //     item.permissionName === '置顶视频')){
    //       Ids = this.setIds(Ids,item.id,falg)
    //     }else if(item.menuCode === data.menuCode && item.menuName === '专题网站'
    //     && (item.permissionName === '新建内容' || item.permissionName === '编辑内容' ||
    //     item.permissionName === '置顶内容' || item.permissionName === '复制内容')){
    //       Ids = this.setIds(Ids,item.id,falg)
    //     }else if(item.menuCode === data.menuCode && item.menuName === '医院概况'){
    //       Ids = this.setIds(Ids,item.id,falg)
    //     }else if(item.menuCode === data.menuCode && item.menuName === '科室导航'
    //     && (item.permissionName === '新建科室' || item.permissionName === '编辑科室')){
    //       Ids = this.setIds(Ids,item.id,falg)
    //     }else if(item.menuCode === data.menuCode && item.menuName === '专家信息'
    //     && (item.permissionName === '新建专家' || item.permissionName === '编辑专家')){
    //       Ids = this.setIds(Ids,item.id,falg)
    //     }else if(item.menuCode === data.menuCode && item.menuName === '招聘招标（人才招聘）'
    //     && (item.permissionName === '新建内容' || item.permissionName === '编辑内容')){
    //       Ids = this.setIds(Ids,item.id,falg)
    //     }else if(item.menuCode === data.menuCode && item.menuName === '招聘招标（招标采购）'
    //     && (item.permissionName === '新建内容' || item.permissionName === '编辑内容')){
    //       Ids = this.setIds(Ids,item.id,falg)
    //     }else if(item.menuCode === data.menuCode && item.menuName === '科研'
    //     && (item.permissionName === '新建内容' || item.permissionName === '编辑内容')){
    //       Ids = this.setIds(Ids,item.id,falg)
    //     }else if(item.menuCode === data.menuCode && item.menuName === '教学'
    //     && (item.permissionName === '新建内容' || item.permissionName === '编辑内容')){
    //       Ids = this.setIds(Ids,item.id,falg)
    //     }else if(item.menuCode === data.menuCode && item.menuName === '疾病科普'
    //     && (item.permissionName === '新建内容' || item.permissionName === '编辑内容')){
    //       Ids = this.setIds(Ids,item.id,falg)
    //     }else if(item.menuCode === data.menuCode && item.menuName === '就医指南'
    //     && (item.permissionName === '新建内容' || item.permissionName === '编辑内容')){
    //       Ids = this.setIds(Ids,item.id,falg)
    //     }else if(item.menuCode === data.menuCode && item.menuName === '首页信息'){
    //       Ids = this.setIds(Ids,item.id,falg)
    //     }else if(item.menuCode === data.menuCode && item.menuName === '网站留言'){
    //       Ids = this.setIds(Ids,item.id,falg)
    //     }else if(item.menuCode === data.menuCode && item.menuName === '人才招聘处理'){
    //       Ids = this.setIds(Ids,item.id,falg)
    //     }else if(item.menuCode === data.menuCode && item.menuName === '医务社工'
    //     && (item.permissionName === '新建内容' || item.permissionName === '编辑内容')){
    //       Ids = this.setIds(Ids,item.id,falg)
    //     }
    //   })
    //   console.log(Ids)
    //   this.setState({justify: allJustify},()=>{
    //     this.filteData()
    //   })
    //   // console.log('管理人')
    // }else if(id === '负责人' ){
    //   console.log('负责人')
    //   let falg = false // 定义一个临时标记
    //   // let index = 0 // 用于记录下标
    //   let allJustify = this.state.justify
    //   allJustify.forEach(item => {
    //     if(item.menuCode === data.menuCode && item.permissionName === '可见'){
    //       item.FZUSER = !item.FZUSER
    //       item.GLUSER = item.FZUSER
    //       falg = item.FZUSER
    //       Ids = this.setIds(Ids,item.id,item.GLUSER || item.FZUSER)
    //     }
    //     if(item.menuCode === data.menuCode && item.permissionName !== '可见'){
    //       console.log(item)
    //       Ids = this.setIds(Ids,item.id,falg)
    //     }
    //   })
    //   console.log(Ids)
    //   this.setState({justify: allJustify},()=>{
    //     this.filteData()
    //   })
    // }
    // // else {
    // //   Ids.splice(Ids.indexOf(id),1)
    // // }
    // // if(!Ids.length){
    // //   message.error('管理组必须包含一种可见权限')
    // //   this.setState({Ids: []})
    // //   return
    // // }
    this.setState({Ids: Ids},()=>{
      this.filteData()})
  }

  setIds = (arr,id,flag) => {
    // arr = arr || [] // 当前权限
    if(flag && arr.indexOf(id) === -1) {
      arr.push(id)
    }else if(!flag && arr.indexOf(id) !== -1){
      arr.splice(arr.indexOf(id), 1)
    }
    // flag && arr.indexOf(id) === -1 ? arr.push(id) : arr.splice(arr.indexOf(id), 1)
    // arr2 = arr2 || [] // 所有权限
    // arr.forEach((item) => {
    //   if(flag === 'add' && arr2.indexOf(item) === -1) {
    //     arr2.push(item)
    //   }
    //   if(flag === 'del' && arr2.indexOf(item) !== -1) {
    //     arr2.splice(arr2.indexOf(item), 1)
    //   }
    // })
    return arr
  }

  // 切换用户组
  selectUser = (id,index) => {
    document.querySelectorAll('.allCheckBox input').forEach(item => {
      item.checked = false
      console.log(item.checked)
    })
    // document.querySelectorAll('[name="all"]').blur()
    // Checkbox.blur()
    this.setState({navIndex: index,Ids: []},()=>{
      this.getUserGroupMessage(id)
    })
  }
  // 全选
  setAll = (e,code) => {
    let arr = this.state.justify.filter(item=>{
      return  item.menuCode === code
    })
    let Ids = [...new Set(this.state.Ids)]
    arr.forEach(item=>{
      if(e.target.checked && Ids.indexOf(item.id) === -1){
        Ids.push(item.id)
      }else if(!e.target.checked && Ids.indexOf(item.id) !== -1){
        Ids.splice(Ids.indexOf(item.id),1)
      }
    })
    this.setState({Ids: Ids},()=>{this.filteData(2)})
  }
  // 过滤是否全选
  // isAll = (code) => {
  //   let falg = false;
  //   this.state.justify.forEach((item)=>{
  //     if(item.menuCode === code && this.state.Ids.indexOf(item.id) !== -1) {
  //       falg = true
  //     }
  //   })
  //   return falg
  // }
  // 格式化数据
  filteData = (flag) => {
    flag = flag || 1
    let arr = [];
    let Ids = this.state.Ids;
    if(Ids.length === 0 && flag === 1) {
      Ids = this.state.existingJustify.map(item => {
        return item?item.id:''
      })
      this.setState({Ids: Ids})
    }
    this.state.justify.forEach(item => {
      if(item.permissionName === '可见') {
        let children = []
        arr.push({
          key: item.id,
          name: <Checkbox checked={Ids.indexOf(item.id) !== -1 ? true : false} disabled={true} onChange={()=>{this.changeExisting(item.id,item)}}></Checkbox>,
          operation: item.menuName,
          address: <div>
          {/* <Checkbox checked={item.GLUSER} onChange={()=>{this.changeExisting('管理人',item)}}
          disabled={item.menuName === '新媒体交互' || item.menuName === '医院概况' || item.menuName === '首页信息'
          || item.menuName === '网站留言' || item.menuName === '人才招聘处理' 
           || item.menuName === '栏目管理' || item.menuName === '身份权限' || item.menuName === '管理员用户管理'
          || item.menuName === '普通用户管理' || item.menuName === '日志记录（登录日志）' || item.menuName === '日志记录（操作日志）' ? true : false}>管理人</Checkbox>
          <Checkbox checked={item.FZUSER} onChange={()=>{this.changeExisting('负责人',item)}}>负责人</Checkbox> */}
          {this.state.justify.forEach(item2=>{
            
            if(item.menuCode === item2.menuCode && item2.permissionName !== '可见') {
              children.push(<Checkbox checked={Ids.indexOf(item2.id) !== -1 ? true : false}  key={item2.id} onChange={()=>{this.changeExisting(item2.id,item2,item)}}> {item2.permissionName}</Checkbox>)
            }
          })}{children}
          </div>,
          // <Checkbox style={{float: 'right'}} className="allCheckBox" checked={item.isAll}  onChange={(e)=>{item.isAll = !item.isAll;this.setAll(e,item.menuCode)}}>全选</Checkbox>
        })
      }
    })
    this.setState({data: arr})
    // console.log(arr)
    // return <div></div>
  }

  
  /************************ 数据双向绑定区 start  ***************************/
  setRoleName = (e) => {
    this.setState({addParams: {...this.state.addParams,roleName: e.target.value}})
  }
  /************************ 数据双向绑定区 end    ***************************/

  render(){
    const columns = [{
        title: '可见',
        dataIndex: 'name',
        width: 100,
        // render: text => <a href="javascript:;">{text}</a>,
      }, {
        title: '操作对象',
        dataIndex: 'operation',
        width: 200,
      }, {
        title: '权限',
        dataIndex: 'address',
      }];
    let navList = []
    return(
        <div>
          <Button type="primary" style={{float: 'right',marginRight: '20px'}} onClick={this.saveExisting}>保存</Button>
          <section className="authorityManagement">
              <div className="authorityManagement-nav">
                  <div className="authorityManagement-nav-title">身份权限</div>
                  <div className="authorityManagement-nav-search">
                      <Search
                          placeholder="搜索关键字"
                          onSearch={value => {this.setState({params: {...this.state.params,keyword: value}},()=>{this.getUserGroup()})}}
                          style={{ width: 200 }}/>
                  </div>
                  <ul className="authorityManagement-nav-list">
                    {/* {this.state.Ids.toString()} */}
                      {this.state.userGroup.forEach((item,index) => {
                        navList.push(<li key={item.id} className={this.state.navIndex === index ? 'active' : ''}>
                            <Icon type="user" style={{ fontSize: 18, color: '#08c'}} />
                            <spen className="userName" onClick={()=>{this.selectUser(item.id,index)}}>{item.roleName}</spen>
                            <Popover
                                content={(
                                  <div>
                                    {/* {clickContent} */}
                                    <a style={{display: 'block'}} onClick={()=>{this.updateUserGroup(item)}}>编辑</a>
                                    <a style={{color: '#f00',display: 'block'}} onClick={()=>{this.delUserGroup(item)}}>删除</a>
                                  </div>
                                )}
                                title="操作"
                                trigger="click"
                                // visible={item.isShow}
                                // onFocus={()=>{this.closeModel(index)}}
                              >
                                <Icon type="form" style={{ fontSize: 16, color: '#08c' ,cursor: 'pointer' }}/>
                              </Popover>
                        </li>)
                      })}
                      <div style={{height: '430px',overflow: 'auto'}}>
                      {navList}
                      </div>
                      <li style={{justifyContent: 'flex-start', cursor: 'pointer',borderTop: '1px solid #ccc'}}>
                          <Icon type="plus-circle" style={{ fontSize: 16, color: '#08c'}} />
                          <spen className="userName" onClick={this.addUserGroup}>添加用户组</spen>
                      </li>
                  </ul>
              </div>
              <div style={{flex: 1,marginLeft: '20px'}}>
                  <Table dataSource={this.state.data} columns={columns} style={{textAlign: 'left',height: '100%'}} />
              </div>
          </section>
          <Modal
            title={this.state.isUpdate?'编辑':'添加'}
            visible={this.state.model}
            onOk={this.saveUserGroup}
            onCancel={()=>{this.setState({model: false})}}
            okText="保存"
            cancelText="取消"
          >
            <div>
              <p>权限组名称：</p><Input value={this.state.addParams.roleName} onChange={this.setRoleName}/>
            </div>
          </Modal>
        </div>
    )
  }
}
export default authorityManagement
