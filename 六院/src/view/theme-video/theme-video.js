/*
 * @Author: kaiback__zgt_1430666237@qq.com 
 * @Date: 2018-05-12 00:53:09 
 * @Last Modified by: kaiback__zgt_1430666237@qq.com
 * @Last Modified time: 2018-05-17 09:19:10
 */

import React, { Component } from 'react';
// import { Input, Button, Col, Row, Radio, Divider, Table, Modal } from 'antd';
import { Input, Button, Table, Select, Form, Divider, message} from 'antd';
import {timeFillter, statusFillter} from '../../common/js/public.js'
// import InputTitle from '@/component/input-title/input-title.js'
// import api from '@/api'

import './theme-video.styl'
import {URL} from '@/common/js/url.js'
import Axios from 'axios';

const FormItem = Form.Item;
const Search = Input.Search;

const Option = Select.Option
// const URL = 'http://192.168.0.122:7979'

class ThemeVideo extends Component {
  
  columns = [
    {
      title: '内容标题',
      dataIndex: 'specialVideoNameZH',
      width: '30%',
    },
    {
      title: '专题',
      dataIndex: 'special'
    },
    {
      title: '创建时间',
      dataIndex: '',
      render:(text,record,index)=>(
        timeFillter(text.createTime)
      )
    },
    {
      title: '发布时间',
      dataIndex: '',
      render:(text,record,index)=>(
        text.publishTime && timeFillter(text.publishTime)
      )
    },
    {
      title: '创建人',
      dataIndex: 'creator',
    },
    {
      title: '状态',
      dataIndex: '',
      render:(text,record,index)=>(
        text.top ? '置顶':statusFillter(text.status)
      )
    },
    {
      title: '操作',
      dataIndex: '',
      render: (text, record, index) => (
        <span style={{whiteSpace: 'nowrap'}}>
          { 
            this.state.permissionInfo.includes(`specialvideo:update`) ? <a href="javascript:;" onClick={() => this.editor(text.id)}>编辑</a> : null
          }
          {/* <a href="javascript:;" onClick={() => this.editor(text.id)}>编辑</a> */}
          {
            text.status === 'PUBLISH' && this.state.permissionInfo.includes(`specialvideo:publish`) 
            ? <span><Divider type="vertical" /><a href="javascript:;" onClick={() => this.publishData([text.id],false)}>取消发布</a></span>
            : null
          }
          
          {
            text.status === 'UNPUBLISH' && this.state.permissionInfo.includes(`specialvideo:publish`)
            ? <span><Divider type="vertical" /><a href="javascript:;" onClick={() => this.publishData([text.id],true)}>发布</a></span>
            : null
          }
          {/* <Divider type="vertical" /> */}
          {/* {
            
            text.status !== 'UNPUBLISH' 
            ? <a href="javascript:;" onClick={() => this.setStick([text.id],!text.top)}>{text.top ? '取消置顶' : '置顶'}</a>
            : null
          } */}
        </span>
      )
    }
  ];
  
  state = {
    visible: false,
    type: 'ALL',
    selectedRowKeys: [],
    name: '',
    data: [
      {
        title: '视频标题1',
        subject: '2017-01-08 15:34',
        createTime: '2017-01-09 10:10',
        publishTime: 66,
        creater: 66,
        state: 66,
        id: 11
      },
      {
        title: '视频标题2',
        subject: '2017-01-08 15:34',
        createTime: '2017-01-09 10:10',
        publishTime: 66,
        creater: 66,
        state: 66,
        id: 22
      },
      {
        title: '视频标题3',
        subject: '2017-01-08 15:34',
        createTime: '2017-01-09 10:10',
        publishTime: 66,
        creater: 66,
        state: 66,
        id: 33
      }
    ],
    pagination: {
      total: 200
    },
    params: {
      "departmentIds": "",
      "keyword": " ",
      "navbarId": 20,
      "pageIndex": 1,
      "pageSize": 10,
      "special": null,
      "specialWebsiteType": "LEARNING_DYNAMIC",
      "status": "ALL",
      "top": true,
      "type": "DYNAMIC"
    },
    permissionInfo:[]
    // selectedRowKeys: []
  }

  componentDidMount () {
    this.setState({name:sessionStorage.getItem('key')})
    this.setState({permissionInfo: (JSON.parse(sessionStorage.getItem('permissionInfo'))?JSON.parse(sessionStorage.getItem('permissionInfo')):[]).map(item =>{
      return item ? item.toLocaleLowerCase() : item
    })})
    let pageIndex = sessionStorage.getItem('pageIndex') ? parseInt(sessionStorage.getItem('pageIndex')) : 1;
    this.setState({params: {...this.state.params, pageIndex}},()=>{
      this.getData(this.state.params)
    })
  }

  hideModal = () => {
    this.setState({visible: false})
  }

  editor = (text) => {
    this.setState({modelData: text})
    this.setState({visible: true})
  }

  publish = (text) => {
    text.state = text.state === 'PUBLISHED' ? 'UNPUBLISH' : 'PUBLISHED'
    this.setState(this.state.data)
  }

  // checkBox
  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  }

  // type
  typeChange = (value) => {
    // 改变state是异步过程  所以要通过回调获取数据
    this.setState({params: { ...this.state.params, status: value,pageIndex: 1 }},() => {
      this.getData(this.state.params);
    })
  }

  // 新建/编辑
  editor = (type) => {
    this.props.history.push(`/ThemeVideoUpdate/${type}`)
  }

  // 检查是否包含未发布的数据
  checkPublish = (arr) => {
    var temp = false;
    this.state.data.forEach(item => {
      arr.forEach(id => {
        if(item.id === id && item.status === 'UNPUBLISH') {
          temp = true;
          return;
        }
      })
      if(temp) return;
    })
    return temp;
  }

  // 发布/取消发布
  publishData = (arr,status) => {
    Axios.post(`${URL}/admin/specialVideo/publish?ids=${arr}&status=${status}`).then(res => {
      if(res.data.code === 200) {
        status ? message.success('发布成功') : message.success('取消发布成功');
        this.setState({selectedRowKeys:[]});
        this.getData(this.state.params);
      } else  {
        message.error(res.data.msg, 1)
      }
    })
  }

  // 设置置顶 批量置顶、单个置顶 取消置顶  接收两个参数 一个ID数组 一个置顶状态
  setStick = (arr, status) => {
    if (this.checkPublish(arr)) {
      message.error('包含未发布的文章,无法置顶');
      return;
    }
    Axios.get(`${URL}/admin/specialVideo/top?ids=${arr}&top=${status}`).then(res => {
      if(res.data.code === 200) {
        status ? message.success('置顶成功') : message.success('取消置顶成功');
        this.setState({selectedRowKeys: []});
        this.getData(this.state.params)
      }else{
        message.error(res.data.msg)
      }
    })
  }

  //删除数据  接收ID数组
  deleteData = () => {
    console.log(this.state.selectedRowKeys)
    Axios.get(`${URL}/admin/specialVideo/delete?ids=${ this.state.selectedRowKeys}`).then(res => {
      if(res.data.code === 200) {
        message.success('删除成功',1);
        this.getData(this.state.params);
        // 清空选中状态 ***
        this.setState({selectedRowKeys: []})
      } else {
        message.error(res.data.msg, 1)
      }
    })
  }

  // 获取数据
  getData = (params = {}) => {
    Axios.post(`${URL}/admin/specialVideo/retrieve`, params).then(res => {
      if(res.data.code === 200) {
        if (!res.data.data.content.length && this.state.params.pageIndex > 1) {
          this.setState({params: {...this.state.params,pageIndex: this.state.params.pageIndex - 1}}, () => {
            this.getData(this.state.params)
          })
          return
        }
        this.setState({ data: res.data.data.content ,
          pagination: {
            total: res.data.data.totalElements,
            pageSize: 10
          }});
      }
      if(res.data.code !== 200) {
        message.error(res.data.msg)
      }
    })
  }

  // 切换分页
  setPage = (pageIndex) => {
    this.setState({params: {...this.state.params,pageIndex: pageIndex}},() => {
      sessionStorage.setItem('pageIndex', pageIndex)
      this.getData(this.state.params)
    })
  }
  render() {

    const { selectedRowKeys } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const pagination = {...this.state.pagination,onChange: this.setPage, current: this.state.params.pageIndex}
    return (
      <div className="new-media">
        <p style={{fontWeight: 'bold',fontSize: '18px'}}>{this.state.name}</p>
        <Form layout="inline">
          <FormItem>
            <Search
              placeholder="输入搜索"
              onSearch={value =>{this.setState({params: {...this.state.params,keyword: value,pageIndex: 1}},()=>{this.getData(this.state.params)});}}
              style={{ width: 140 }}
              maxLength={20}
            />
          </FormItem>
          <FormItem label="类型">
            <Select defaultValue={this.state.type} style={{ width: 120 }} onChange={this.typeChange}
              getPopupContainer={triggerNode => triggerNode.parentNode}>
              <Option value="ALL">全部</Option>
              <Option value="UNPUBLISH">未发布</Option>
              <Option value="PUBLISH">已发布</Option>
            </Select>
          </FormItem>
          <FormItem style={{float: 'right'}}>
            {
              this.state.permissionInfo.includes(`specialvideo:delete`) ?
              <Button className="search__button" type="danger" disabled={this.state.selectedRowKeys.length === 0} onClick={this.deleteData}>批量删除</Button>
              :  null
            }
            {
              this.state.permissionInfo.includes(`specialvideo:publish`) ?
                <span>
                <Button className="search__button" type="primary" disabled={this.state.selectedRowKeys.length === 0} onClick={() => {this.publishData(this.state.selectedRowKeys,false)}}>批量取消发布</Button>
                <Button className="search__button" type="primary" disabled={this.state.selectedRowKeys.length === 0} onClick={() => {this.publishData(this.state.selectedRowKeys,true)}}>批量发布</Button>
                </span>
              :  null
            }
            
            {/* {
              this.state.permissionInfo.includes(`specialvideo:top`) ?
                <span>
                <Button className="search__button" type="primary" disabled={this.state.selectedRowKeys.length === 0} onClick={() => {this.setStick(this.state.selectedRowKeys,false)}}>批量取消置顶</Button>
                <Button className="search__button" type="primary" disabled={this.state.selectedRowKeys.length === 0} onClick={() => {this.setStick(this.state.selectedRowKeys,true)}}>批量置顶</Button>
                </span>
              :  null
            } */}
            {/* <Button className="search__button" type="danger" disabled={this.state.selectedRowKeys.length === 0} onClick={this.deleteData}>批量删除</Button> */}
            {/* <Button className="search__button" type="primary" disabled={this.state.selectedRowKeys.length === 0} onClick={() => {this.publishData(this.state.selectedRowKeys,false)}}>批量取消发布</Button>
            <Button className="search__button" type="primary" disabled={this.state.selectedRowKeys.length === 0} onClick={() => {this.publishData(this.state.selectedRowKeys,true)}}>批量发布</Button> */}
            {/* <Button className="search__button" type="primary" disabled={this.state.selectedRowKeys.length === 0} onClick={() => {this.setStick(this.state.selectedRowKeys,false)}}>批量取消置顶</Button>
            <Button className="search__button" type="primary" disabled={this.state.selectedRowKeys.length === 0} onClick={() => {this.setStick(this.state.selectedRowKeys,true)}}>批量置顶</Button> */}
            {
              this.state.permissionInfo.includes(`specialvideo:create`) ?
              <Button className="search__button" type="primary" onClick={() => this.editor('NEW')}>新建</Button> 
              :  null
            }
            {/* <Button className="search__button" type="primary" onClick={() => this.editor('NEW')}>新建</Button> */}
          </FormItem>
        </Form>
        <Divider />
        <Table
          rowKey="id"
          columns={this.columns}
          dataSource={this.state.data}
          rowSelection={rowSelection}
          pagination={pagination}
          loading={this.state.loading}
        />
      </div>
    );
  }
  
}

export default ThemeVideo;
