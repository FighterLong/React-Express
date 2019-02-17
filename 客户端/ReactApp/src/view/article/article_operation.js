// 文章操作页  根据path不同区分编辑还是添加
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {  Input, Button, Form, Radio, message } from 'antd';
import { Template } from '../../component/template'
import axios from '../../api/index'
import './article_operation.css'
const RadioGroup = Radio.Group;
const Editor = require('wangeditor')
const { TextArea } = Input;
class ArticleOperation extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    Editor: null,
    navList: ['react', 'vue', 'javaScript', 'HTML5', 'CSS3' , 'node', 'webGL', 'java', 'python', '微信小程序'],
    params: {
      article_title: '',
      article_desc: '',
      article_content: '',
      article_type: 'react'
    }
  }
  componentDidMount(){
    if (this.props.match.params.id !== 'add') {
      this.getArticleInfo(this.props.match.params.id)
    }
    // 当页面渲染完之后渲染编辑器
    var editor = new Editor('#editor')
    // 把编辑器返回的对象记录下来
    this.setState({Editor: editor}, () => {
      // 创建编辑器
      editor.create()
    })
  }
  saveData = () => {
    this.setState({params: {...this.state.params, article_content: this.state.Editor.txt.html()}}, () => {
      if (this.props.match.params.id === 'add') {
        this.addArticle()
      } else {
        this.updateArticle()
      }
    })
  }

  // 新建文章
  addArticle = () => {
    axios.post('/article/addArticle', this.state.params).then(res => {
      if (res.code === 200) {
        message.success('创建成功')
        this.setState({params: {
          article_title: '',
          article_desc: '',
          article_content: '',
          article_type: 'react'
        }})
        this.state.Editor.txt.html('')
      } else {
        message.error(res.msg)
      }
    })
  }
  // 编辑文章
  updateArticle = () => {
    console.log(document.cookie)
    axios.post('/article/updateArticle', this.state.params).then(res => {
      if (res.code === 200) {
        message.success('保存成功')
      } else {
        message.error(res.msg)
      }
    })
  }

  // 编辑时获取文章内容
  getArticleInfo = (id) => {
    axios.get('/article/getArticleMessage?id=' + id).then(res => {
      if (res.code === 200) {
        this.setState({params: {...res.data}}, () => {
          this.state.Editor.txt.html(this.state.params.article_content)
        })
      }
    })
  }
  // 设置文章类型
  setArticleType = (e) => {
    this.setState({params: {...this.state.params, article_type: e.target.value}})
  }
  // 设置输入框Input、TextArea的双向绑定
  setTextData = (e) => {
    this.setState({params: {...this.state.params, [e.target.name]: e.target.value}})
  }
  // 返回首页
  goIndex = () => {
    this.context.router.history.push('/')
  }
  render () {
    const formItemLayout = {
      required: true,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    }
    const plainOptions = this.state.navList;
    return(
      <Template>
       <div className="article_operation">
          <div className="article_box">
            <div className="article_operation-top">
              <Button onClick={this.goIndex}>返回首页</Button>
              <Button type="primary" onClick={this.saveData}>保存</Button>
            </div>
            <Form.Item
              {...formItemLayout}
              label='文章标题'
            >
              <Input name="article_title" value={this.state.params.article_title} onChange={this.setTextData}></Input>
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              label='文章简介'
            >
              <TextArea rows={4} value={this.state.params.article_desc}  name="article_desc" onChange={this.setTextData}></TextArea>
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              label='文章类型'
            > 
              <RadioGroup options={plainOptions} value={this.state.params.article_type} onChange={this.setArticleType}/>
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              label='文章内容'
            >
              <div className="editor-box">
                  <div id="editor"></div>
              </div>
            </Form.Item>
          </div>
  </div> </Template> )
  }
}
export default ArticleOperation