import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { message } from 'antd';
import axios from '../../api/index'
import formatTime from '../../utils/public'
import { Template } from '../../component/template'
import './article_message.css'
export default class ArticleMessage extends Component{
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
      params: {
        article_title: '',
        article_content: '',
        article_type: '',
        browse_num: 0,
        create_time: 0
      }
  }
  componentDidMount() {
    this.getArticleMessage()
  }
  getArticleMessage = () => {
    let articleId = this.props.match.params.id
    if (!articleId) {
        message.error('未找到此文章')
        this.context.router.history.push('/');
        return
    }
    axios.get('/article/getArticleMessage?id=' + articleId).then(res => {
      this.setState({params: {...res.data}})
    })
  }
  render () {
    return (
      
    <Template>
      <div className="article_message">
        <div className="article_box">
          <h1 className="article_title">{this.state.params.article_title}</h1>
          <div className="article_date">类型： {this.state.params.article_type} &nbsp;&nbsp; 时间： {formatTime(this.state.params.create_time)} &nbsp;&nbsp; 浏览量： {this.state.params.browse_num}</div>
          <div className="article_content" dangerouslySetInnerHTML={{__html: this.state.params.article_content}}></div>
        </div>
      </div>
    </Template>
    )
  }
}