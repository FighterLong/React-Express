import React, { Component } from 'react';
import { connect } from 'react-redux';
import {test} from '@/store/nav-bar/action'
import { Button } from 'antd';

@connect(
  //  你要声明属性放到props里
  state => ({navBarList:state.navBarList}),
  // 你要什么方法，放到props里，自动dispatch
  {test}
)

export default class HospitalInfo extends Component {

  render() {
    return (
      <div>
        <p>
          {this.props.navBarList.join()}
        </p>
        <Button type="primary" onClick={() => {this.props.test([999, 111, 222])}}>Primary</Button>
      </div>
    );
  }
}
