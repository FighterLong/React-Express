/*
 * @Author: kaiback__zgt_1430666237@qq.com 
 * @Date: 2018-05-12 00:53:09 
 * @Last Modified by: kaiback__zgt_1430666237@qq.com
 * @Last Modified time: 2018-05-14 17:09:02
 */

import React, { Component } from 'react';
import { Input, Button, Col, Row, Divider, Table, Modal, message, Select } from 'antd';
import {timeFillter, statusFillter} from '../../common/js/public.js'

import './wechat-info.styl'
import axios from 'axios'
import {URL} from '@/common/js/url.js'

const Option = Select.Option
const Search = Input.Search;

class WechatInfo extends Component {

  columns = [
    {
      title: '内容标题',
      dataIndex: 'name',
      width: '25%',
    },
    {
      title: '文章模式',
      render:(text,record,index)=>(
        text.type  === 'CONTENT'? '内容模式': '外链模式'
      )
    },
    {
      title: '创建时间',
      dataIndex: '',
      render:(text,record,index)=>(
        text.createTime?timeFillter(text.createTime):0
      )
    },
    {
      title: '发布时间',
      dataIndex: '',
      render:(text,record,index)=>(
        text.publishTime?timeFillter(text.publishTime):0
      )
    },
    {
      title: '排序号',
      dataIndex: '',
      render:(text,record,index)=>(
          <div style={{cursor: 'pointer', color: '#1890ff'}}  onClick={() => {this.clickSEQ(text)}}>{this.state.seqShow === text.id ?
             <Input style={{width: '60px'}} value={this.state.seq} onInput={this.setSEQ} onBlur={() => {this.saveSEQ(text)}}/> : <span>{text.seq ? text.seq : 0}</span>}</div>
      )
    },
    {
      title: '点击数',
      dataIndex: 'hits',
    },
    {
      title: '状态',
      dataIndex: '',
      render:(text,record,index)=>(
        text.top&&text.status==='PUBLISH'?'置顶':statusFillter(text.status)
      )
    },
    {
      title: '操作',
      dataIndex: '',
      render: (text, record, index) => (
        <span style={{whiteSpace: 'nowrap'}}>
          
          {this.state.permissionInfo.includes(`wechatinfo:update`) ?
            <a href="javascript:;" onClick={() => this.queryData(text.id)}>编辑</a>
            :  null
          }
          {
            text.status === 'PUBLISH' && this.state.permissionInfo.includes(`wechatinfo:publish`)
            ? <span><Divider type="vertical" /><a href="javascript:;" onClick={() => this.getPublish([text.id],false)}>取消发布</a></span>
            : null
          }
          
          {
            text.status === 'UNPUBLISH' && this.state.permissionInfo.includes(`wechatinfo:publish`)
            ? <span><Divider type="vertical" /><a href="javascript:;" onClick={() => this.getPublish([text.id],true)}>发布</a></span>
            : null
          }
          <Divider type="vertical" />
          {/* {
            
            text.status !== 'UNPUBLISH' 
            ? <a href="javascript:;" onClick={() => this.topData([text.id],!text.top)}>{text.top ? '取消置顶' : '置顶'}</a>
            : null
          } */}
        </span>
      )
    }
  ];
  
  state = {
    visible: false,
    seqShow: false,
    modelData: {},
    selectedRows: [],
    iframeUrl: '',
    data: [],
    seq: 0,
    permissionInfo: [],
    pagination: {},
    params:{
      "keyword": "",
      "pageIndex": 1,
      "pageSize": 10,
      "status": "ALL"
    },
    selectedRowKeys: []
  }
  
  setSEQ = (e) => {
    if (isNaN(e.target.value)) {
      return
      // this.setState({seq: 0})
    }else {
      this.setState({seq: e.target.value})
    }
  }
  clickSEQ = (data) => {
    if (isNaN(data.seq)) {
      this.setState({seq: 0, seqShow: data.id})
    }else {
      this.setState({seq:  data.seq, seqShow: data.id})
    }
    // this.setState({seq: data.seq, seqShow: data.id})
  }

  saveSEQ = (data) => {
    if (!this.state.seq) {
      message.error('排序号为必填项')
      return
    }
    data.seq = parseInt(this.state.seq)
    
    // this.setState({params: {...data}},()=>{
      axios.post(`${URL}/admin/wechatInfo/update`,data).then((res)=>{
        if(res.data.code === 200) {
          message.success('保存成功');
          this.setState({seqShow: false})
        }else{
          message.error(res.data.msg);
        }
      }).catch(error => {
        message.error('异常请求')
      })
    // })
  }
  componentDidMount() {
    this.setState({permissionInfo: (JSON.parse(sessionStorage.getItem('permissionInfo'))?JSON.parse(sessionStorage.getItem('permissionInfo')):[]).map(item =>{
      return item ? item.toLocaleLowerCase() : item
    })})
    let pageIndex = sessionStorage.getItem('pageIndex') ? parseInt(sessionStorage.getItem('pageIndex')) : 1
    this.setState({params: {...this.state.params, pageIndex}}, () => {
      this.getData()
    })
  }
  /************************** 数据操作区 start ************************/
  // 获取列表数据
  getData = () => {
    axios.post(`${URL}/admin/wechatInfo/retrieve`,this.state.params).then(res => {
      if(res.data.code === 200) {
        // console.log(res.data.data.totalElements)
        // this.setState({ pageination: res.data.data.totalElements},() => {console.log(this.state.pagination.total)})
        if (!res.data.data.content.length && this.state.params.pageIndex > 1) {
          this.setState({params: {...this.state.params,pageIndex: this.state.params.pageIndex - 1}}, () => {
            this.getData()
          })
          return
        }
        this.setState({
          pagination: {
            total: res.data.data.totalElements,
            pageSize: 10
          },
          data: res.data.data.content
        })
        if (res.data.data.content && res.data.data.content[0] && res.data.data.content[0].seq) {
          sessionStorage.setItem('maxLength', res.data.data.content[0].seq)
        } else {
          sessionStorage.setItem('maxLength', 0)
        }
      }else {
        message.error(res.data.msg)
      }
    })
  }
  // 发布/取消发布
  getPublish = (ids,status) => {
    axios.post(`${URL}/admin/wechatInfo/publish?ids=${ids}&status=${status}`).then(res => {
      if(res.data.code === 200) {
        status ? message.success('发布成功') : message.success('取消发布成功')
        this.setState({ selectedRowKeys: [] },()=>{ this.getData() })
      }else {
        message.error(res.data.msg)
      }
    }).catch(error => {
      message.error('异常请求')
    })
  }
  // 删除
  delData = (ids) => {
    axios.get(`${URL}/admin/wechatInfo/delete?ids=${ids}`).then(res => {
      if(res.data.code === 200) {
        message.success('删除成功')
        this.setState({ selectedRowKeys: [] },()=>{ this.getData() })
      }else {
        message.error(res.data.msg)
      }
    }).catch(error => {
      message.error('异常请求')
    })
  }
  // 置顶/取消置顶
  topData = (ids,status) => {
    axios.get(`${URL}/admin/wechatInfo/top?ids=${ids}&top=${status}`).then(res => {
      if(res.data.code === 200) {
        status ? message.success('置顶成功') : message.success('取消置顶成功')
        this.setState({ selectedRowKeys: [] },()=>{ this.getData() })
      }else {
        message.error(res.data.msg)
      }
    }).catch(error => {
      message.error('异常请求')
    })
  }
  // 查看
  queryData = (id) => {
    this.props.history.push('/WechatInfoEditor/' + id)
  }
  // 搜索时触发的回掉
  search = (value) => {
    this.setState({params: {...this.state.params,keyword: value,pageIndex: 1}},() => { this.getData() })
  }
  // 切换分页时触发
  changePage = (page) => {
    this.setState({params: {...this.state.params,pageIndex: page}},() => {
      sessionStorage.setItem('pageIndex', page)
      this.getData()
    })
  }
  // 切换type时触发
  changeType = (value) => {
    this.setState({params: {...this.state.params,status: value,pageIndex: 1}},() => { this.getData() })
  }
  /************************** 数据操作区 end   ************************/

  handleTableChange = (pageination, filters) => {
    
  }

  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  }

  render() {
    const { selectedRowKeys } = this.state;
    let pagination = {...this.state.pagination,onChange: this.changePage, current: this.state.params.pageIndex};
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <div className="new-media">
      <p style={{fontWeight: 'bold',fontSize: '18px'}}>新媒体交互/{sessionStorage.getItem('key')}</p>
        <Row className="search">
          <Col span={10}>
            <Search
              placeholder="输入搜索"
              onSearch={this.search}
              style={{ width: 200 }}
              maxLength={20}
            />
            <Select style={{width: '120px',marginLeft: '20px'}} value={this.state.params.status} onChange={this.changeType}
              getPopupContainer={triggerNode => triggerNode.parentNode}>
              <Option value="ALL">全部</Option>
              <Option value="PUBLISH">已发布</Option>
              <Option value="UNPUBLISH">未发布</Option>
            </Select>
          </Col>
          <Col className="search__type" span={14}>
            {this.state.permissionInfo.includes(`wechatinfo:delete`) ?
            <Button className="search__button" type="danger" disabled={this.state.selectedRowKeys.length === 0 ? true : false} onClick={()=>{this.delData(this.state.selectedRowKeys)}}>批量删除</Button>
              :  null
            }
            
            {this.state.permissionInfo.includes(`wechatinfo:publish`) ?
            <span> <Button className="search__button" type="primary" disabled={this.state.selectedRowKeys.length === 0 ? true : false} onClick={()=>{this.getPublish(this.state.selectedRowKeys,false)}}>批量取消发布</Button>
            <Button className="search__button" type="primary" disabled={this.state.selectedRowKeys.length === 0 ? true : false} onClick={()=>{this.getPublish(this.state.selectedRowKeys,true)}}>批量发布</Button></span>
              :  null
            }
            
            {/* <Button className="search__button" type="danger" disabled={this.state.selectedRowKeys.length === 0 ? true : false} onClick={()=>{this.delData(this.state.selectedRowKeys)}}>批量删除</Button> */}
            {/* <Button className="search__button" type="primary" disabled={this.state.selectedRowKeys.length === 0 ? true : false} onClick={()=>{this.getPublish(this.state.selectedRowKeys,false)}}>批量取消发布</Button> */}
            {/* <Button className="search__button" type="primary" disabled={this.state.selectedRowKeys.length === 0 ? true : false} onClick={()=>{this.getPublish(this.state.selectedRowKeys,true)}}>批量发布</Button> */}
            {/* <Button className="search__button" type="primary" disabled={this.state.selectedRowKeys.length === 0 ? true : false} onClick={()=>{this.topData(this.state.selectedRowKeys,false)}} >批量取消置顶</Button>
            <Button className="search__button" type="primary" disabled={this.state.selectedRowKeys.length === 0 ? true : false} onClick={()=>{this.topData(this.state.selectedRowKeys,true)}} >批量置顶</Button> */}
            {/* <Button className="search__button" type="primary" onClick={()=>{this.props.history.push('/WechatInfoEditor/NEW')}} >新建</Button> */}
            
          {this.state.permissionInfo.includes(`wechatinfo:create`) ?
              <Button className="search__button" type="primary" onClick={()=>{this.props.history.push('/WechatInfoEditor/NEW')}} >新建</Button>
              :  null
            }
          </Col>
        </Row>
        <Divider />
        <Table
          rowKey="id"
          columns={this.columns}
          dataSource={this.state.data}
          rowSelection={rowSelection}
          pagination={pagination}
          loading={this.state.loading}
          onChange={this.handleTableChange}
        />
        <Modal
          title="文章内容"
          width="60%"
          visible={this.state.visible}
          footer={[<Button key="back" type="primary" onClick={this.hideModal}>确认</Button>]}
          onOk={this.hideModal}
          onCancel={this.hideModal}
        >
        {/* {this.state.content} */}
        </Modal>
      </div>
    );
  }
  
}

export default WechatInfo;
