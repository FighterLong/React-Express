import React, { Component } from 'react';
// import { Layout, Menu, Breadcrumb, Avatar,Dropdown,Icon } from 'antd';
import { Template } from '../../component/template'
import Note from '../note/index.js'
// const { Header, Content, Footer } = Layout;
export default class Layouts extends Component {
  render () {
      return (
        <Template>
          <Note></Note>
        </Template>
    )
  }
}