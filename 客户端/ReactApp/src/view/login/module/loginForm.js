import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Icon, Input, Button } from 'antd';
import '../login.css'
class LoginForm extends Component {
    static contextTypes = {
      router: PropTypes.object.isRequired,
    }
    handleSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          this.props.submit(values)
        }
      });
    }
  
    render() {
      const { getFieldDecorator } = this.props.form;
      return (
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item>
            {getFieldDecorator('userName', {
              rules: [{ required: true, message: '请输入账号' }],
            })(
              <Input style={{height: '38px'}} prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="账号" />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入密码' }],
            })(
              <Input style={{height: '38px'}} prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
            )}
          </Form.Item>
          <Button type="primary" htmlType="submit" style={{width: '100%',height: '38px', marginBottom: '5px'}} className="login-form-button">
              登陆
          </Button>
          <Form.Item style={{textAlign: 'center'}}>
            {/* {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(
              <Checkbox>记住密码</Checkbox>
            )}
            <span style={{color: '#1890ff', cursor: 'pointer'}} onClick={() => {this.context.router.history.push('/login')}}>忘记密码</span> */}
            {/* <a className="login-form-forgot" href="/">忘记密码</a> */}
            <span style={{color: '#1890ff', cursor: 'pointer'}} onClick={() => {this.context.router.history.push('/signin')}}>现在注册</span>
          </Form.Item>
        </Form>
      );
    }
  }
const Login = Form.create()(LoginForm)
export default Login