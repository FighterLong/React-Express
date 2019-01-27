import React, { Component } from 'react';
import { message } from 'antd';
import PropTypes from 'prop-types';
import SignInForm from './module/signInForm'
import logo from '../../logo.svg';
import axios from '../../api/index'
import './signin.css'
export default class Login extends Component{
  static contextTypes = {
    router: PropTypes.object.isRequired,
  } 
  signin = (data) => {
    axios.post('/users/signin', data).then(res => {
      if (res.code === 200) {
        message.success('注册成功,2秒后将为您跳转到登陆')
        setTimeout(() => { this.context.router.history.push('/login') }, 2000)
      } else {
        message.error(res.msg)
      }
    })
  }
  render() {
    console.log(this)
    return (
      <div className="el-contian">
        <div className="el-signinBox">
          <h1 className="signin-title">
            <img src={logo} alt="logo" />
            <p>React</p>
          </h1>
          <SignInForm submit={this.signin}></SignInForm>
        </div>
      </div>
    );
  }
}