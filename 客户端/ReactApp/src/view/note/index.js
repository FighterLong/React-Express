import React, { Component } from 'react';
import { Layout, Menu, Icon, Input, Pagination, message, } from 'antd';
import axios from '../../api/index'
import './index.css'
const { SubMenu } = Menu;
const { Content, Sider, } = Layout;
const Search = Input.Search;
class Note extends Component {
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

    render() {
        let articleElement = []
        this.state.list.forEach((item, index) => {
            articleElement.push((
                <li className="article-item" key={index}>
                    <h1 className="article-item-title">{item.article_title}</h1>
                    <div className="article-item-tools">时间：{item.create_time} &nbsp;&nbsp;|&nbsp;&nbsp; 浏览数： {item.browse_num}</div>
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
                        {/* <Menu.Item key="react">React</Menu.Item>
                        <Menu.Item key="vue">Vue</Menu.Item>
                        <Menu.Item key="javaScript">javaScript</Menu.Item>
                        <Menu.Item key="HTML5">HTML5</Menu.Item>
                        <Menu.Item key="CSS3">CSS3</Menu.Item>
                        <Menu.Item key="node">Node</Menu.Item>
                        <Menu.Item key="webGL">WebGL</Menu.Item>
                        <Menu.Item key="java">Java</Menu.Item>
                        <Menu.Item key="python">Python</Menu.Item>
                        <Menu.Item key="微信小程序">微信小程序</Menu.Item> */}
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
                <ul className="article-list">
                    {articleElement}
                </ul>
                {noneElement}
            </Content>
        </Layout>)
    }
}
export default Note