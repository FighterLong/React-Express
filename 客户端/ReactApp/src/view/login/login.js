import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { message } from 'antd';
import axios from '../../api/index'
import LoginForm from './module/loginForm.js'
import logo from '../../logo.svg';
import './login.css'
export default class Login extends Component{
  static contextTypes = {
      router: PropTypes.object.isRequired,
  }
  login = (data) => {
    axios.get('/users/login', {
       params: {
        username: data.userName,
        password: data.password
       }
    }).then(res => {
      if (res.code === 200) {
        message.success('登陆成功')
        this.context.router.history.push('/')
      } else {
        message.error(res.msg)
      }
    })
  }
  render() {
    console.log(this)
    return (
      <div className="el-contian">
        <div className="el-loginBox">
          <h1 className="login-title">
            <img src={logo} alt="logo" />
            <p style={{marginBottom: '20px'}}>React</p>
          </h1>
          <LoginForm submit={this.login}></LoginForm>
        </div>
      </div>
    );
  }
}