import React from 'react'
import { Layout, Menu, Avatar,Dropdown,Icon } from 'antd';
const { Header, Content, Footer } = Layout;
// 头部跟尾部模板





export const Template = (props) => {
    function exitLogin() {
        // window.document.cookie = ''
        window.location.href = window.location.origin + '/#/login'
    }
    const menu = (
        <Menu style={{zIndex: 7777777}}>
          <Menu.Item>
            <p style={{width: '105px', display: 'flex', alignItems: 'center'}}> <Icon type="user"  style={{padding: '3px 5px 0 5px'}}/> 个人信息 </p>
          </Menu.Item>
          <Menu.Item>
            <p style={{width: '105px', display: 'flex', alignItems: 'center'}}> <Icon type="solution"  style={{padding: '3px 5px 0 5px'}}/> 我的文章 </p>
          </Menu.Item>
          <Menu.Item>
            <p onClick={() => {exitLogin(props)}} style={{width: '105px', display: 'flex', alignItems: 'center'}}> <Icon type="export"  style={{padding: '3px 5px 0 5px'}}/> 退出登陆 </p>
          </Menu.Item>
        </Menu>
    );
   return (
            // window.location.href.includes('/login') || window.location.href.includes('/signin') 
            // ? props.children : 
        <Layout style={{minHeight: '100%'}}>
            <Header className="header" style={{width: '100%', position: 'fixed', zIndex: 666666666, display: 'flex', justifyContent: 'space-between'}}>
                <div className="logo" />
                <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={['1']}
                style={{ lineHeight: '64px', flex: '1'}}
                >
                <Menu.Item key="1">笔记</Menu.Item>
                <Menu.Item key="2">文件</Menu.Item>
                <Menu.Item key="3">留言</Menu.Item>
                </Menu>
                {
                    true ? 
                    <Dropdown overlay={menu}>
                        <div style={{float: 'right', display: 'flex', alignItems: 'center', height: '64px',cursor: 'pointer'}}>
                            <Avatar style={{backgroundColor: 'rgba(255, 255, 255, 0.5)'}} className="ant-dropdown-link" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" size={50}/> 
                            <p style={{color: 'rgba(255, 255, 255, 0.65)', marginLeft: '5px'}} onClick={() => {exitLogin(props)}}>去登陆</p>
                        </div>
                    </Dropdown>
                    :
                    <div style={{float: 'right', display: 'flex', alignItems: 'center', height: '64px',cursor: 'pointer'}}>
                        <Avatar style={{backgroundColor: 'rgba(255, 255, 255, 0.5)'}} className="ant-dropdown-link" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" size={50}/> 
                        <p style={{color: 'rgba(255, 255, 255, 0.65)', marginLeft: '5px'}} onClick={() => {exitLogin(props)}}>去登陆</p>
                    </div>
                }
            </Header>
            <Content style={{ padding: '0 50px', paddingTop: '100px'}}>
                    {props.children}
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                欢迎大家一起交流学习，一起进步
            </Footer>
        </Layout>
        )
}