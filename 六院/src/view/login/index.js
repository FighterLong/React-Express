import React, { Component } from 'react';
import { Form, Icon, Input, Button, message } from 'antd';
import './index.styl'
import axios from 'axios'
import {URL} from '@/common/js/url.js'
import LoginImg from '@/common/imgs/logo_login.png'
// import { connect } from 'react-redux';
const FormItem = Form.Item;
axios.defaults.withCredentials=true;

// @connect(
//   //  你要声明属性放到props里
//   state => ({userInfo:state.userInfo}),
//   // 你要什么方法，放到props里，自动dispatch
//   // {saveUserInfo}
// )

class LoginForm extends Component {
  state = {
    loading: false
  }
  handleSubmit = (e) => {
    this.setState({loading: true})
    e.preventDefault();
    // console.log(this.props)
    let data = {
      username: this.props.form.getFieldValue('username'),
      password: this.props.form.getFieldValue('password')
    }
    axios.post(`${URL}/admin/user/auth`,data).then(res => {
      if(res.data.code === "100") {
        message.success('登陆成功')
        this.setState({loading: false})
        this.getUserInfo()
      }else {
        this.setState({loading: false})
        message.error(res.data.msg)
      }
    }).catch(error=>{
      this.setState({loading: false})
    })


    // this.props.form.validateFields((err, values) => {
    //   if (!err) {
    //     // this.props
    //     this.props.history.push('/layout')
    //   }
    // });
  }

  // 获取用户登陆信息
  getUserInfo = () => {
    axios.get(`${URL}/admin/user/getInfo`).then(res=>{
      if(res.data.code === '100'){
        // console.log(res.data.data)
        sessionStorage.setItem('userInfo',JSON.stringify(res.data.data.userInfo))
        sessionStorage.setItem('permissionInfo',JSON.stringify(res.data.data.permissionInfo))
        this.props.history.push('/defaultPage')
      }else{
        message.error('读取用户信息失败,请重新尝试')
      }
    })
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="login">
        <Form onSubmit={this.handleSubmit} className="login__form">
          <div style={{padding: '20px 0',paddingTop: '10px',textAlign: 'center'}}>
            <img src={LoginImg} alt="login"/>
          </div>
          <FormItem>
            {getFieldDecorator('username', {
              rules: [{ required: true, message: '请输入用户名！' }],
            })(
              <Input name="username" prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入密码!' }],
            })(
              <Input  name="password" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
            )}
          </FormItem>
          <FormItem>
            {/* {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(
              <Checkbox>记住密码</Checkbox>
            )} */}
            <Button type="primary" htmlType="submit" loading={this.state.loading} className="login__form-button">
              登入
            </Button>
            {/* <a className="login__form-forgot" href="javascript:void(0);">忘记密码？</a> */}
          </FormItem>
        </Form>
      </div>
    );
  }
}

const Login = Form.create()(LoginForm)

export default Login;
