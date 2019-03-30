import React, { Component } from 'react';
import { Layout } from 'antd';
import CRouter from '@/router/route.js'
import Head from './child/head'
import SiderBar from './child/sider-bar'
import './index.styl'
// import axios from 'axios'
import Loading from './Loading.js'

const {Content} = Layout

export default class layout extends Component {
  
  state = {
    collapsed: false,
    loadding: false,
  };
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  // componentWillMount() {
  //   // 响应拦截
  //   axios.interceptors.response.use((res)=>{
  //       this.setState({loadding: false})
  //       // if(res.data.errCode === 6001){
  //       //     location.href = '/login/index.html';
  //       // }
  //       return res
  //   })
  // // 请求拦截
  //   axios.interceptors.request.use(
  //     config => {
  //         config.withCredentials=true;
  //         this.setState({loadding: true})
  //         return config;
  //     },
  //     err => {
  //         this.setState({loadding: false})
  //         return Promise.reject(err);
  //   });
  // }

  render() {
    return (
      <Layout className="layout">
        <SiderBar collapsed={this.state.collapsed} />
        <Layout>
            <Loading />
            <Head collapsed={this.state.collapsed} toggle={this.toggle} />
            <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
                {/* {this.state.loadding ? 
                  <div className="loadding_Model">
                    <Icon className="loading_icon" type="loading" />
                  </div>
                  :
                  null  
                } */}
              <CRouter />
            </Content>
        </Layout>
      </Layout>
    );
  }
}
// react-redux的connect方法--主要作用是不需要从父组件传state和crecter
// const mapStatetoProps = (state) => {
//   return {num:state}
// }
// const actionCreators = {addGun, removeGun}
// Layout = connect(mapStatetoProps, actionCreators)(Layout)

// export default Layout;
