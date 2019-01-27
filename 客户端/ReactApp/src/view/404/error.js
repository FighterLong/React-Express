import React, { Component } from 'react';
export default class Error extends Component{
  render () {
    return <div>
        <h1 style={{fontSize: '150px', color: '#aaa', textAlign: 'center', paddingTop: '200px'}}>404</h1>
        <p style={{fontSize: '28px', color: '#aaa', textAlign: 'center'}}>未找到相关页面,请检查地址是否正确</p>
    </div>
  }
}