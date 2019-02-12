import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu, Icon, Input, Pagination, message, Button } from 'antd';
import axios from '../../api/index'
import formatTime from '../../utils/public'
import './index.css'
const { SubMenu } = Menu;
const { Content, Sider, } = Layout;
const Search = Input.Search;
class Note extends Component {
    static contextTypes = {
        router: PropTypes.object.isRequired,
    }
    state = {
        params: {
            keyword: '',
            type: 'react',
            pageIndex: 1,
            pageSize: 10,
        },
        navList: ['react', 'vue', 'javaScript', 'HTML5', 'CSS3' , 'node', 'webGL', 'java', 'python', '微信小程序'],
        list: [],
        totalPageSize: 0,
    }
    clickMenu = (data) => {
        this.setState({ params: { ...this.state.params, type: data.key } }, () => {
            this.getArticle()
        })
    }
    componentDidMount() {
        this.getArticle()
    }
    getArticle = () => {
        axios.get('/article/getAllArticle', {
            params: this.state.params
        }).then(res => {
            if (res.code === 200) {
                this.setState({ list: res.data.arr, totalPageSize: res.data.totalNum })
            } else {
                message.error(res.msg)
            }
        })
    }
    
    goAddArticle = () => {
        this.context.router.history.push('/ArticleOperation/add')
    }

    render() {
        let articleElement = []
        this.state.list.forEach((item, index) => {
            articleElement.push((
                <li className="article-item" key={index}>
                    <h1 className="article-item-title">{item.article_title}</h1>
                    <div className="article-item-tools">时间：{formatTime(item.create_time)} &nbsp;&nbsp;|&nbsp;&nbsp; 浏览量： {item.browse_num}</div>
                    <div className="article-item-desc">{item.article_desc}</div>
                    <span className="queryBtn">查看详情</span>
                </li>)
            )
        })
        let pageParams = {
          defaultCurrent: 1,
          total: this.state.totalPageSize,
          pageSize: this.state.params.pageSize,
          onChange: (index) => {
            this.setState({params: {...this.state.params, pageIndex: index}}, () => {
              this.getArticle()
            })
          }
        }
        let noneElement = articleElement.length ? (<div style={{ textAlign: 'center' }}> <Pagination {... pageParams}/> </div>) : (<h1 style={{ color: '#aaa', fontSize: '30px', textAlign: 'center', marginTop: '200px' }}>暂无数据</h1>)
        let navList = []
        this.state.navList.forEach(item => {
          navList.push(<Menu.Item key={item}>{item}</Menu.Item>)
        })
        return (<Layout style={{ padding: '24px 0', background: '#fff', minHeight: '570px' }}>
            <Sider width={200} style={{ background: '#fff' }}>
                <Menu
                    mode="inline"
                    defaultSelectedKeys={[this.state.params.type]}
                    defaultOpenKeys={['sub1']}
                    style={{ height: '100%' }}
                    onClick={this.clickMenu}
                >
                    <SubMenu key="sub1" title={<span><Icon type="user" />学习生涯</span>}>
                        {navList}
                    </SubMenu>
                    <SubMenu key="sub2" title={<span><Icon type="laptop" />朝花夕拾</span>}>
                        <Menu.Item key="5">option5</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub3" title={<span><Icon type="notification" />常见小栗子</span>}>
                        <Menu.Item key="9">option9</Menu.Item>
                    </SubMenu>
                </Menu>
            </Sider>
            <Content style={{ padding: '0 24px', minHeight: '280px' }}>
                <Search
                    placeholder="搜索文章"
                    onSearch={value => this.setState({params: {...this.state.params, keyword: value}}, () => {this.getArticle()})}
                    style={{ width: 250 }}
                />
                <Button type="primary" style={{float: 'right'}} onClick={this.goAddArticle}>新建文章</Button>
                <ul className="article-list">
                    {articleElement}
                </ul>
                {noneElement}
            </Content>
        </Layout>)
    }
}
export default Note