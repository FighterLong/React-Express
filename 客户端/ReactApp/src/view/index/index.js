import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb, Avatar,Dropdown } from 'antd';
import Note from '../note/index.js'
const { Header, Content, Footer } = Layout;
export default class Layouts extends Component {
  render () {
    const menu = (
      <Menu style={{zIndex: 7777777}}>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">1st menu item</a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">2nd menu item</a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">3rd menu item</a>
        </Menu.Item>
      </Menu>
    );
      return <Layout style={{minHeight: '100%'}}>
      <Header className="header" style={{width: '100%', position: 'fixed', zIndex: 2, display: 'flex', justifyContent: 'space-between'}}>
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
          <Dropdown overlay={menu}>
            <div style={{float: 'right', display: 'flex', alignItems: 'center', height: '64px',cursor: 'pointer'}}>
                <Avatar className="ant-dropdown-link" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" size={50}/>
            </div>
          </Dropdown>
      </Header>
      <Content style={{ padding: '0 50px', paddingTop: '64px'}}>
        <Breadcrumb style={{ margin: '16px 0'}}>
          <Breadcrumb.Item>笔记</Breadcrumb.Item>
          <Breadcrumb.Item>朝花夕拾</Breadcrumb.Item>
          <Breadcrumb.Item>文章1</Breadcrumb.Item>
        </Breadcrumb>
        
        {/* 笔记内容页 */}
        <Note></Note>

      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Ant Design ©2018 Created by Ant UED
      </Footer>
    </Layout>
  }
}