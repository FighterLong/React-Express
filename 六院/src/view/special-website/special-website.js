/* 专题网站 */
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

import './special-website.styl'
import Axios from 'axios';
import {URL} from '@/common/js/url.js'

const FormItem = Form.Item;
const Search = Input.Search;

const Option = Select.Option
// const URL = 'http://192.168.0.122:7979'

class SpecialWebsite extends Component {
  
  columns = [
    {
      title: '内容标题',
      dataIndex: 'nameZH',
      width: '30%',
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
      title: '作者',
      dataIndex: 'authorZH',
    },
    {
      title: '点击数',
      dataIndex: 'hits',
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
            this.state.permissionInfo.includes(`specialwebsite:update`) ?
              <a href="javascript:;" onClick={() => this.editor(text.id)}>编辑</a>
            :  null
          }
          {/* {
            text.state === 'PUBLISHED'
            ? <span><Divider type="vertical" /><a href="javascript:;" onClick={() => this.publish(text)}>取消发布</a></span>
            : null
          } */}
          {/* <Divider type="vertical" />
          <a href="javascript:;" onClick={() => this.setStick([text.id],!text.top)}>{text.top ? '取消置顶' : '置顶'}</a> */}
          
          {
            text.status === 'PUBLISH' && this.state.permissionInfo.includes(`specialwebsite:publish`)
            ? <span><Divider type="vertical" /><a href="javascript:;" onClick={() => this.publishData([text.id],false)}>取消发布</a></span>
            : null
          }
          
          {
            text.status === 'UNPUBLISH' && this.state.permissionInfo.includes(`specialwebsite:publish`)
            ? <span><Divider type="vertical" /><a href="javascript:;" onClick={() => this.publishData([text.id],true)}>发布</a></span>
            : null
          }
          {/* <Divider type="vertical" />
          {
            
            text.status !== 'UNPUBLISH' && this.state.permissionInfo.includes(`specialwebsite:top`)
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
    name: '',
    selectedRowKeys: [],
    fileList: [],
    permissionInfo: [],
    data: [],
    pagination: {
      total: 200
    },
    params: {
      "departmentIds": "",
      "keyword": " ",
      "navbarId": 20,
      "pageIndex": 1,
      "pageSize": 10,
      "special": "2018",
      "status": "ALL",
      // "top": true,
      "type": "DYNAMIC"
    }
    // selectedRowKeys: []
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
  // clickSEQ = (data) => {
  //   this.setState({seq: data.seq, seqShow: data.id})
  // }

  saveSEQ = (data) => {
    if (!this.state.seq) {
      message.error('排序号为必填项')
      return
    }
    data.seq = parseInt(this.state.seq)
    data.createTime = new Date(data.createTime).getTime()
    data.publishTime = new Date(data.publishTime).getTime()
    Axios.post(`${URL}/admin/specialWebsite/update`,data).then(res => {
      if(res.data.code === 200){
        message.success('保存成功',1);
        this.getData(this.state.params)
        // this.goBack()
      }else{
        message.error(res.data.msg)
      }
    
      setTimeout(()=>{this.setState({seqShow:false})},500)
    }).catch(error => {message.error('异常请求');this.setState({ seqShow: false })})
  }

  // componentWillMount() {
  //   this.getColumenList()
  //   this.setState({name:sessionStorage.getItem('key')})
  //   let pageIndex = sessionStorage.getItem('pageIndex') ? parseInt(sessionStorage.getItem('pageIndex')) : 1;
  //   this.setState({permissionInfo: (JSON.parse(sessionStorage.getItem('permissionInfo'))?JSON.parse(sessionStorage.getItem('permissionInfo')):[]).map(item =>{
  //     return item ? item.toLocaleLowerCase() : item
  //   })})
  //   this.setState({params: {...this.state.params,navbarId: this.props.match.params.type,pageIndex}},()=>{
  //     this.getData(this.state.params)
  //   })
  // }
  componentWillReceiveProps (next) {
    // console.log('执行')
    this.getColumenList()
    this.setState({name:sessionStorage.getItem('key')})
    let pageIndex = sessionStorage.getItem('pageIndex') ? parseInt(sessionStorage.getItem('pageIndex')) : 1;
    this.setState({params: {...this.state.params,navbarId: parseInt(next.match.params.type), pageIndex}},()=>{
      this.getData(this.state.params)
    })
  }
  componentDidMount() {
    this.getColumenList()
    this.setState({name:sessionStorage.getItem('key')})
    let pageIndex = sessionStorage.getItem('pageIndex') ? parseInt(sessionStorage.getItem('pageIndex')) : 1;
    this.setState({permissionInfo: (JSON.parse(sessionStorage.getItem('permissionInfo'))?JSON.parse(sessionStorage.getItem('permissionInfo')):[]).map(item =>{
      return item ? item.toLocaleLowerCase() : item
    })})
    this.setState({params: {...this.state.params,navbarId: this.props.match.params.type,pageIndex}},()=>{
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
    this.props.history.push(`/SpecialWebsiteUpdate/${type}/${this.props.match.params.type}`)
    
    console.log(this.props)
  }

  // 发布/取消发布
  publishData = (arr,status) => {
    Axios.post(`${URL}/admin/specialWebsite/publish?ids=${arr}&status=${status}`).then(res => {
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
    Axios.get(`${URL}/admin/specialWebsite/top?ids=${arr}&top=${status}`).then(res => {
      if(res.data.code === 200) {
        status ? message.success('置顶成功') : message.success('取消置顶成功');
        this.setState({selectedRowKeys: []});
        this.getData(this.state.params)
      }
    })
  }

  //删除数据  接收ID数组
  deleteData = () => {
    console.log(this.state.selectedRowKeys)
    Axios.get(`${URL}/admin/specialWebsite/delete?ids=${ this.state.selectedRowKeys}`).then(res => {
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
    Axios.post(`${URL}/admin/specialWebsite/retrieve`, params).then(res => {
      if(res.data.code === 200) {
        
        if (!res.data.data.content.length && this.state.params.pageIndex > 1) {
          this.setState({params: {...this.state.params,pageIndex: this.state.params.pageIndex - 1}}, () => {
            this.getData(this.state.params)
          })
          return
        }
        this.setState({ data: res.data.data.content,
          pagination: {
            total: res.data.data.totalElements,
            pageSize: 10
          }});
      }
        if (res.data.data && res.data.data.content && res.data.data.content[0]  && res.data.data.content[0].seq) {
          sessionStorage.setItem('maxLength', res.data.data.content[0].seq)
        } else {
          sessionStorage.setItem('maxLength', 0)
        }
    })
  }

  // 切换分页
  setPage = (pageIndex) => {
    this.setState({params: {...this.state.params,pageIndex}},() => {
      sessionStorage.setItem('pageIndex', pageIndex)
      this.getData(this.state.params)
    })
  }
  setWebsit = () => {
    let data = sessionStorage.getItem('websiteData') 
    if (data) {
      data = JSON.parse(data)
      this.props.history.push(`/SpecialWebsitePage/${data.id}`)
    }
  }

   // 获取栏目列表
   getColumenList = () => {
    Axios.get(`${URL}/admin/navbar/openGetManagementHomeNavbar`).then(res=>{
      let navList = res.data.data
      navList.forEach(item=>{
        if(item.name === '专题网站') {
          item.submenu.forEach(items => {
            // items.submenu.forEach(item2 => {
              if (this.checkNavId(items.submenu)){
                console.log('进来了')
                sessionStorage.setItem('websiteData',JSON.stringify(items))
              }
            // })
          })
        }
      })
      this.setState({treeData: navList})
    })
  }

  checkNavId = (arr) => {
    let temp = false;
    arr.forEach(item => {
      if (item.id === this.state.params.navbarId) {
        temp = true
      }
    })
    return temp
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
        <p style={{fontWeight: 'bold',fontSize: '18px'}}>专题网站/{this.state.name}</p>
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
              this.state.permissionInfo.includes(`specialwebsite:delete`) ?
                <Button className="search__button" type="danger" disabled={this.state.selectedRowKeys.length === 0} onClick={this.deleteData}>批量删除</Button>
              :  null
            }
            
            {
              this.state.permissionInfo.includes(`specialwebsite:publish`) ?
                <span>
                  <Button className="search__button" type="primary" disabled={this.state.selectedRowKeys.length === 0} onClick={() => {this.publishData(this.state.selectedRowKeys,false)}}>批量取消发布</Button>
                  <Button className="search__button" type="primary" disabled={this.state.selectedRowKeys.length === 0} onClick={() => {this.publishData(this.state.selectedRowKeys,true)}}>批量发布</Button>
                </span>
              :  null
            }
            <Button className="search__button" type="primary" onClick={this.setWebsit}>网站设置</Button>
            {
              this.state.permissionInfo.includes(`specialwebsite:create`) ?
              <Button className="search__button" type="primary" onClick={() => this.editor('NEW')}>新建</Button>
              :  null
            }
            {/* <Button className="search__button" type="danger" disabled={this.state.selectedRowKeys.length === 0} onClick={this.deleteData}>批量删除</Button> */}
            {/* <Button className="search__button" type="primary" disabled={this.state.selectedRowKeys.length === 0} onClick={() => {this.publishData(this.state.selectedRowKeys,false)}}>批量取消发布</Button> */}
            {/* <Button className="search__button" type="primary" disabled={this.state.selectedRowKeys.length === 0} onClick={() => {this.publishData(this.state.selectedRowKeys,true)}}>批量发布</Button> */}
            {/* <Button className="search__button" type="primary" disabled={this.state.selectedRowKeys.length === 0} onClick={() => {this.setStick(this.state.selectedRowKeys,false)}}>批量取消置顶</Button> */}
            {/* <Button className="search__button" type="primary" disabled={this.state.selectedRowKeys.length === 0} onClick={() => {this.setStick(this.state.selectedRowKeys,true)}}>批量置顶</Button> */}
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

export default SpecialWebsite;
