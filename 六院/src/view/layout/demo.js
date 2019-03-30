import React, { Component } from 'react';
import { connect } from 'react-redux';
import {saveUserInfo} from '@/store/base-info/action'

// 如果装了babel-plugin-transform-decorators-legacy
// 要在dev.config里面配置
// 就可以简写
// console.log(state)
@connect(
  //  你要声明属性放到props里
  state => ({userInfo:state.userInfo}),
  // 你要什么方法，放到props里，自动dispatch
  {saveUserInfo}
)


class Layout extends Component {

  updateUserInfo = () => {
    let value = {name: 'zhang', phoneNo: '1705116517'}
    this.props.saveUserInfo(value)
    console.log(this.props)
  }

  render() {
    return (
      <div>
        这是layout页面
        <p>{this.props.userInfo.name}</p>
        <p>{this.props.userInfo.phoneNo}</p>
        <button onClick={this.updateUserInfo}>haha</button>
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

export default Layout;
