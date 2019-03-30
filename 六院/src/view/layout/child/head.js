import React, { Component } from 'react';
import { Layout,Modal } from 'antd';
import ExitIcon from '@/common/imgs/exit.png'
import axios from 'axios';
import {URL} from '@/common/js/url.js'

const Header = Layout.Header;
const confirm = Modal.confirm;
// const onClick = function ({ key }) {
// };



class Head extends Component {
  tuichu = (key) => {
    // console.log(this)
    confirm({
      title: '提示',
      content: '您确定要退出吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        axios.get(`${URL}/admin/user/logout`).then(res  => {
          window.location.href = window.location.origin+'/page/admin/index.html#/login'
        })
      },
      onCancel() {
        console.log('Cancel');
      },
    });
    
    // this.props.history.push(`/Login`)
  }
  render() {
    // const menu = (
    //   <Menu onClick={this.tuichu}>
    //     {/* <Menu.Item key="1">修改账号</Menu.Item> */}
    //     <Menu.Item key="2">退出登入</Menu.Item>
    //   </Menu>
    // );
    return (
      <Header className="head" style={{ background: '#fff', padding: 0 }}>
        {/* <Icon
          className="layout__trigger"
          type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.props.toggle}
        /> */}
        <div className="head__admin">
        
          {sessionStorage.getItem('userInfo') ? <span style={{fontSize: '16px',marginRight: '20px'}}>操作员:  {JSON.parse(sessionStorage.getItem('userInfo')).nickname}</span> : null} 
          <img src={ExitIcon} alt="exit" width="28" onClick={this.tuichu}/>
          {/* <Dropdown overlay={menu}>
            <div>
              <img className="head__admin-img" src={userLogo} alt="头像" />超级管理员
            </div>
          </Dropdown> */}
        </div>
      </Header>
    );
  }
}

export default Head;
