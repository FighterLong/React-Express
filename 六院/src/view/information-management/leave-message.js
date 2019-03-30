import React,{ Component } from 'react';
import { Input, Button, Table, Select, Form, Divider,message} from 'antd';
import api from '@/api/index.js'
import {timeFillter} from '../../common/js/public.js'

import './science-reader.styl'
import { spawn } from 'child_process';
import Axios from 'axios';
import {URL} from '@/common/js/url.js'

const FormItem = Form.Item;
const Search = Input.Search;

const Option = Select.Option

// const URL = 'http://192.168.0.122:7979'

class leaveMessage extends Component{
  columns=[
    {
      title:'主题',
    dataIndex: 'subject',
    width: '25%'
    },{
      title:'留言时间',
      dataIndex:'',
      render:(text,record,index)=>(
        timeFillter(text.leaveTime,true)
      )
    },{
      title:'留言人',
      dataIndex:'questioner'
    },{
      title:'点击数',
      dataIndex:'hits'
    },{
      title:'状态',
      dataIndex:'',
      render:(text,record,index)=>(
        text.replyStatus?'已回复':'未回复'
      )
    },{
      title:'公开状态',
      dataIndex:'',
      render:(text,record,index)=>(
        text.visible?'公开':'未公开'
      )
    },{
        title:'回复人',
        dataIndex:'',
        render:(text,record,index)=>(
          text.replyer?text.replyer:'无'
        )
      },{
      title:'操作',
      dataIndex:'',
      render:(text,record,index)=>(
        <span>
          <a href="javascript:;" onClick={() => this.editor(text.id)}>查看</a>
        </span>
      )
    }
  ];
  state={
    visible:false,
    type:'ALL',
    name: '',
    selectedRowKeys: [],
    getListParams:{
      keyword:'',
      pageIndex:1,
      pageSize:15,
      status:'ALL'
    },
    data: [],
    params: {
      "keyword": " ",
      "pageIndex": 1,
      "pageSize": 10,
      "special": "",
      "status": "",//UNREPLY未回复REPLY已回复
    },
    pagination: {
      total: 0
    }
  }
  // checkbox多选
  onSelectChange = (row) => {
    console.log(row)
    this.setState({selectedRowKeys:row})
  }


  /********************************* 数据操作区 start *****************************/
  
  // 选择状态
  typeChange=(text)=>{
    this.setState({params: {...this.state.params,status: text,pageIndex: 1}},()=>{ this.getInfo() })
  }
  //输入关键字
  searchKey=(value)=>{
    this.setState({params:Object.assign({},this.state.params,{keyword:value,pageIndex: 1})})
    this.getInfo()
  }

  // 获取数据
  getInfo=()=>{
    Axios.post(`${URL}/admin/leaveAMessage/retrieveList`,this.state.params).then(res=>{
      
      if (res.data.data && !res.data.data.content.length && this.state.params.pageIndex) {
        this.setState({params: {...this.state.params, pageIndex: this.state.params.pageIndex - 1}}, () => {
          this.getInfo()
        })
        return
      }
     res.data.data ? this.setState({data:res.data.data.content}) : this.setState({data: []}) 
     res.data.data && this.setState({pagination: {...this.state.pagination, total: res.data.data.totalElements}})
    }).catch(error => {
      message.error('请求异常')
    })
    // api.scienceReader.getList(this.state.getListParams).then(res=>{
    //   this.setState({data:res.data.data.content})
    //   this.setState({pagination: {...this.state.pagination, total: res.data.data.totalPages}})
    //   console.log(res)
    // })
  }
  
  // 删除数据
  delData = () => {
    Axios.post(`${URL}/admin/leaveAMessage/delete?ids=${this.state.selectedRowKeys}`).then(res => {
      if(res.data.code === 200) {
        message.success('删除成功')
        this.setState({selectedRowKeys: []}, () => {
          this.getInfo()
        })
      } else {
        message.error(res.data.msg)
      }
    }).catch(error => {
      message.error('异常请求')
    })
  }

  // 发布/取消发布  arr为ID数据  status为是否发布
  publishData = (arr,status) => {
    Axios.post(`${URL}/admin/leaveAMessage/updateVisible?ids=${arr}&visible=${status}`).then(res => {
      if (res.data.code === 200) {
        status ? message.success('公开成功') : message.success('取消公开成功')
        this.setState({selectedRowKeys: []})
        this.getInfo()
      }else {
        message.error(res.data.msg)
      }
    }).catch(error => {
      message.error('异常请求')
    })
  }
  /********************************* 数据操作区 end *****************************/
  // editor = (text) => {
  //   this.setState({modelData: text})
  //   this.setState({visible: true})
  // }
  /********************************* 其他操作 start *****************************/
  // 新建/编辑  跳转
  editor = (type) => {
    this.props.history.push(`/leaveMessageEditor/${type}`)
  }
  // 切换分页
  setPageIndex = (page) => {
    this.setState({params: {...this.state.params,pageIndex: page}},()=>{
      sessionStorage.setItem('pageIndex', page)
      this.getInfo()
    })
  }
  
  /********************************* 其他操作 end *******************************/

  componentDidMount() {
    this.setState({name:sessionStorage.getItem('key')})
    let pageIndex = sessionStorage.getItem('pageIndex') ? parseInt(sessionStorage.getItem('pageIndex')) : 1;
    this.setState({params: {...this.state.params,pageIndex}},()=>{
      this.getInfo()
    })
  }
  
  render(){
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
    let pagination  = {...this.state.pagination,onChange: this.setPageIndex, current: this.state.params.pageIndex}
    return (
      <div className="science-reader">
        <p style={{fontWeight: 'bold',fontSize: '18px'}}>信息管理/{this.state.name}</p>
        <Form layout="inline">
          <FormItem>
            <Search
              placeholder="输入搜索"
              onSearch={this.searchKey}
              style={{ width: 200 }}
              maxLength={20}
            />
          </FormItem>
          <FormItem label="类型">
            <Select defaultValue={this.state.params.status} style={{ width: 120 }} onChange={this.typeChange}
              getPopupContainer={triggerNode => triggerNode.parentNode}>
              <Option value="">全部</Option>
              <Option value="UNREPLY">未回复</Option>
              <Option value="REPLY">已回复</Option>
            </Select>
          </FormItem>
              <Button style={{marginLeft: '15px',float: 'right'}} type="danger" disabled={this.state.selectedRowKeys.length === 0} onClick={this.delData}>批量删除</Button>
              <Button style={{marginLeft: '15px',float: 'right'}} type="primary" disabled={this.state.selectedRowKeys.length === 0} onClick={()=>{this.publishData(this.state.selectedRowKeys,true)}}>批量公开</Button>
              <Button style={{marginLeft: '15px',float: 'right'}} type="primary" disabled={this.state.selectedRowKeys.length === 0} onClick={()=>{this.publishData(this.state.selectedRowKeys,false)}}>批量取消公开</Button>
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

export default leaveMessage;
