import React, { Component } from 'react';
import { Layout } from 'antd';
import {withRouter} from 'react-router-dom'
import SiderMenu from './creatmenu';
import {connect} from 'react-redux'
import {updataNarBar} from '@/store/nav-bar/action'
// import MenuList from './menu-list'
import axios from 'axios'
import {URL} from '@/common/js/url.js'
import Logo from '@/common/imgs/logo.png'
// import {setNavList} from '@/store/sub-site/reducer'
// import {subSite} from '@/store/sub-site/action'
// import {updataNarBar} from '@/store/nav-bar/action'
// import { createStore } from 'redux';
// const store = createStore(setNavList);
const { Sider } = Layout;

// const callback = () => {
//   return store.getState()
// }

@connect(
  state => ({navBarList: state.navBarList}),

  {updataNarBar}
)


class SiderBar extends Component {
  // state = {
  //   MenuList: []
  // }
  state = {
    curPath: [''],
    rootSubmenuKeys: ['首页信息', '新媒体交互', '专题网站', '医院概况', '科室导航', '招聘招标', '科研', '教学', '资讯信息', '就医指南', '医务社工', '权限管理', '信息管理', '日志管理'],
    // cihldSubmenuKeys: ['学科介绍', '重点科室', '人才招聘', '招标采购', '重点科室', '重点科室']
  }
  componentDidMount() {
    // var store = redux.createStore(reducer, []);

    // api.navBar.getNavBarList().then(res => {
    //   console.log(res)
    // })
    // store.subscribe(()=>{
    //   console.log('Redux状态改变了')
    //   console.log(store.getState())
    //   this.setState({MenuList: store.getState()})
    // })
    if(this.props.location.pathname.indexOf('SonDepart') === -1){
      this.getNavList()
    }else {
      // 通过session获取科室id
      var id = sessionStorage.getItem('sonId')
      // ,{
      //   "id": 108,
      //   "name": "科研教学",
      //   "sort": 20,
      //   "path": "SonDepart/"+id+"/SCIENTIFIC_RESEARCH_TEACH",
      // }
      this.props.updataNarBar([{
        "id": 108,
        "name": "科室动态",
        "sort": 20,
        "path": "SonDepart/"+id+"/DYNAMIC",
      },{
        "id": 108,
        "name": "健康教育",
        "sort": 20,
        "path": "SonDepart/"+id+"/HEALTH_EDUCATION",
      },{
        "id": 108,
        "name": "特色诊疗与护理",
        "sort": 20,
        "path": "SonDepart/"+id+"/TREATMENT_NURSING",
      },{
        "id": 108,
        "name": "先进技术及设备",
        "sort": 20,
        "path": "SonDepart/"+id+"/ADVANCED_TECHNOLOGY_EQUIPMENT",
      }])
    }
    
  }

  getNavList = () => {
    axios.get(URL+'/admin/navbar/openGetManagementHomeNavbar').then(res => {
      if(res.data.code === 200) {
        // var rootSubmenuKeys = []
        res.data.data.forEach(item=>{
          // rootSubmenuKeys.push(item.name)
          if(item.name === '科室导航' || item.name === '医务社工' || item.name === '科研' || item.name === '教学' || item.name === '招聘招标' || item.name === '医院概况' || item.name === '专题网站'){
            // console.log(item.name + 'path:' + item.path)
            this.setData(item.submenu,true)
          }
        })
        // this.setState({rootSubmenuKeys})
        this.props.updataNarBar(res.data.data)
      }
    })
  }

  // 递归处理拼接ID
  setData(arr,flag) {
    // console.log('进来了----')
    arr.forEach(item=>{
      if(item.submenu.length){
        this.setData(item.submenu,false)
      }else if((item.path === 'secondDepart' || item.path === 'researchProject' || item.path === 'teachingProject' || item.path === 'SpecialWebsite') && flag){
        item.path = 'ErrorURL'
      }else {
        item.path = item.path + '/' + item.id
      }
    })
  }
  // 获取用户登陆信息
  getUserInfo = () => {
    axios.post(`${URL}/user/getInfo`).then(res=>{
      if(res.data.returnCode === '20011'){
        // this.props.location.push('/Login')
        // message.error('请登陆')
        // this.props.history.push(`/Login`)
      }
    })
  }
  // componentDidMount() {
  //   this.getUserInfo()
  // }
  // props发生变化时 组件重新渲染调用的生命周期函数之一
  // componentWillReceiveProps(nextRoute) {
  //   if(nextRoute.location.pathname.indexOf('SEED') !== -1){
  //     console.log('执行了')
  //     // nextRoute.updataNarBar([{
  //     //   "id": 108,
  //     //   "name": "科室介绍",
  //     //   "sort": 20,
  //     //   "path": "KeyDepart/36/Brief/SEED",
  //     // },{
  //     //   "id": 108,
  //     //   "name": "科室动态",
  //     //   "sort": 20,
  //     //   "path": "KeyDepart/36/SEED",
  //     // },{
  //     //   "id": 108,
  //     //   "name": "健康教育",
  //     //   "sort": 20,
  //     //   "path": "KeyDepart/36/SEED",
  //     // },{
  //     //   "id": 108,
  //     //   "name": "科研教学",
  //     //   "sort": 20,
  //     //   "path": "KeyDepart/36/SEED",
  //     // },{
  //     //   "id": 108,
  //     //   "name": "特色诊疗与护理",
  //     //   "sort": 20,
  //     //   "path": "KeyDepart/36/SEED",
  //     // },{
  //     //   "id": 108,
  //     //   "name": "先进技术及设备",
  //     //   "sort": 20,
  //     //   "path": "KeyDepart/36/SEED",
  //     // }])
  //     console.log(this.props)
  //   }
  //   console.log(this.props)
  //   // console.log(this.props)
  //   // this.props.updataNarBar([{
  //   //         "id": 106,
  //   //         "name": "信息管理",
  //   //         "sort": 110,
  //   //         "path": "",
  //   //         "submenu": [
  //   //           {
  //   //             "id": 107,
  //   //             "name": "网站留言",
  //   //             "sort": 10,
  //   //             "path": "leaveMessage",
  //   //             "submenu": []
  //   //           },
  //   //           {
  //   //             "id": 108,
  //   //             "name": "人才招聘处理",
  //   //             "sort": 20,
  //   //             "path": "authorityUser",
  //   //             "submenu": []
  //   //           }
  //   //         ]
  //   //       }])
  // }
  
  onOpenChange = (openKeys) => {
    const latestOpenKey = openKeys.find(key => this.state.curPath.indexOf(key) === -1);
    if (this.state.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ curPath : openKeys });
    } else {
      this.setState({
        curPath: latestOpenKey ? [latestOpenKey] : [],
      });
    }
  }
  clickItem = (e) => {
    sessionStorage.setItem('key',e.key)
    console.log(e.item.props.id)
    this.getColumenList(e)
    sessionStorage.setItem('pageIndex',1)
  }
  
  getColumenList = (e) => {
    axios.get(`${URL}/admin/navbar/openGetManagementHomeNavbar`).then(res=>{
      let navList = res.data.data
      navList.forEach(item=>{
        if(item.name === '专题网站') {
          item.submenu.forEach(items => {
            // items.submenu.forEach(item2 => {
              if (this.checkNavId(items.submenu, e)){
                sessionStorage.setItem('websiteData',JSON.stringify(items))
              }
            // })
          })
        }
      })
      this.setState({treeData: navList})
    })
  }

  checkNavId = (arr, e) => {
    let temp = false;
    arr.forEach(item => {
      if (item.id === e.item.props.id) {
        temp = true
      }
    })
    return temp
  }
  render() {
    // console.log('******************************')
    // console.log(this.props.navBarList)
    // let maxPath = ''
    // let routeArr = []
    // this.state.curPath.forEach(item => {
    //   if (this.state.rootSubmenuKeys.indexOf(item) !== -1) {
    //     maxPath = item
    //   } else {
    //     routeArr.push(item)
    //   }
    // })
    // routeArr.push(maxPath)
    // console.log(routeArr)
    return (
      <Sider
        style={{overflowY: 'auto'}}
        trigger={null}
        collapsible
        collapsed={this.props.collapsed}>
        <img style={{boxSizing: 'border-box',height: 'auto',padding: '15px 0',marginLeft: '20px'}} width="70%" src={Logo} alt="logo"/>
        {/* {this.state.curPath} */}
        <SiderMenu
          menus={this.props.navBarList}
          onClick={(e,e2)=>{this.clickItem(e)}}
          theme="dark"
          mode="inline"
          openKeys={this.state.curPath}
          onOpenChange={this.onOpenChange}
          defaultOpenKeys={['']}
          defaultSelectedKeys={['']} />
      </Sider>
    );
  }
}


// 此页面不是route导入页面，如果要用router的方法，需要将组件传入withRouter再导出
export default withRouter(SiderBar)

