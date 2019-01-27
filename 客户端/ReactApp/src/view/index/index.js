import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import Note from '../note/index.js'
const { Header, Content, Footer } = Layout;
export default class Layouts extends Component {
  render () {
      return <Layout style={{minHeight: '100%'}}>
      <Header className="header" style={{width: '100%', position: 'fixed', zIndex: 66666}}>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          style={{ lineHeight: '64px' }}
        >
          <Menu.Item key="1">笔记</Menu.Item>
          <Menu.Item key="2">文件</Menu.Item>
          <Menu.Item key="3">留言</Menu.Item>
        </Menu>
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