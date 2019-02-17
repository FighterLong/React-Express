import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu, Icon, Input, Pagination, message, Button, Radio } from 'antd';
import axios from '../../api/index'
import formatTime from '../../utils/public'
import defaultImg from '../../common/image/articleDefault.jpg'
import './index.css'

const RadioGroup = Radio.Group;
const { SubMenu } = Menu;
const { Content, Sider, } = Layout;
const Search = Input.Search;
class Note extends Component {
    static contextTypes = {
        router: PropTypes.object.isRequired,
    }
    state = {
        showItemType: 'image',
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
    // 获取所有文章
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
    // 查看文章详情
    articleInform = (id) => {
        this.context.router.history.push('/ArticleMessage/' + id)
    }
    // 编辑文章
    updateArticle = (id) => {
        this.context.router.history.push('/ArticleOperation/' + id)
    }
    // 新建文章
    goAddArticle = () => {
        this.context.router.history.push('/ArticleOperation/add')
    }
    // 切换文章列表显示方式
    changeShowItem = (e) => {
        this.setState({
            showItemType: e.target.value,
        });
    }

    render() {
        let articleCard = []
        let articleElement = []
        this.state.list.forEach((item, index) => {
            articleElement.push((
                <li className="article-item" key={index}>
                    <h1 className="article-item-title" onClick={() => {this.articleInform(item.id)}}>{item.article_title} </h1>
                    <div className="article-item-tools">时间：{formatTime(item.create_time)} &nbsp;&nbsp;|&nbsp;&nbsp; 浏览量： {item.browse_num}</div>
                    <div className="article-item-desc">{item.article_desc}</div>
                    <span className="queryBtn" onClick={() => {this.articleInform(item.id)}}>查看详情</span>
                    <span className="queryBtn" style={{marginLeft: '20px'}} onClick={() => {this.updateArticle(item.id)}}>编辑此文章</span>
                </li>)
            )
            
            articleCard.push(
                <li className="article-card">
                    <div className="imgBox">
                        <img src={defaultImg} alt="" />
                        <h1 className="article-card-title">
                            <span>
                                {item.article_title}
                            </span>
                        </h1>
                    </div>
                    <div className="article-card-desc">
                        {item.article_desc}
                    </div>
                </li>
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
                
                <RadioGroup style={{float: 'right'}} onChange={this.changeShowItem} value={this.state.showItemType}>
                    <Radio value={'text'}>文字列表</Radio>
                    <Radio value={'image'}>图文列表</Radio>
                </RadioGroup>
                
                {this.state.showItemType === 'image' ?
                // 卡片形式
                <ul className="article-card-list">
                    {articleCard}
                </ul> :
                // 列表形式
                <ul className="article-list">
                    {articleElement}
                </ul>
                }
                {noneElement}
            </Content>
        </Layout>)
    }
}
export default Note