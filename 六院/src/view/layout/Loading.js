import React, { Component } from 'react';
import { Icon } from 'antd';
import './index.styl'
import axios from 'axios'

export default class Loading extends Component {

  state = {
    loadding: false,
  };
  componentWillMount() {
    // 响应拦截
    axios.interceptors.response.use((res)=>{
        this.setState({loadding: false})
        if(res.data.code === '20011'){
            window.location.href = window.location.origin + '/page/admin/index.html#/login';
        }
        return res
    }, () => {
      this.setState({loadding: false})
    })
  // 请求拦截
    axios.interceptors.request.use(
      config => {
          if(typeof config.data === 'object'){
            let data = config.data
            data.homePageSlideshow && data.homePageSlideshow.map(item => {
              item.picUrl && (item.picUrl = '')
            })
            data.homePageFooter && data.homePageFooter.qrCodes && data.homePageFooter.qrCodes.map(item => {
              item.picUrl && (item.picUrl = '')
            })
            data.picUrl && (data.picUrl = '')
          }
          config.withCredentials = true
          this.setState({loadding: true})
          return config;
      },
      err => {
          this.setState({loadding: false})
          return Promise.reject(err);
    });
  }

  render() {
    return (
        <div>
              {this.state.loadding ? 
                <div className="loadding_Model">
                  <Icon className="loading_icon" type="loading" />
                </div>
                :
                null  
              }
        </div>
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
