import React,{ Component } from 'react';
import { Input, Button, Table, Select, Form, Divider,message} from 'antd';
import api from '@/api/index.js'
import {timeFillter} from '../../common/js/public.js'

import '../science-reader/science-reader.styl'
import { spawn } from 'child_process';
import Axios from 'axios';
import {URL} from '@/common/js/url.js'

const FormItem = Form.Item;
const Search = Input.Search;

const Option = Select.Option

// const URL = 'http://192.168.0.122:7979'


class scienceReader extends Component{
  columns=[
    {
      title:'内容标题',
    dataIndex: 'titleZH',
    width: '25%'
    },{
      title:'创建时间',
      dataIndex:'',
      render:(text,record,index)=>(
        timeFillter(text.createTime)
      )
    },{
      title:'发布时间',
      dataIndex:'',
      render:(text,record,index)=>(
        text.publishTime&&timeFillter(text.publishTime)
      )
    },{
      title:'创建人',
      dataIndex:'creator'
    },{
      title:'点击数',
      dataIndex:'hits'
    },{
      title:'排序号',
      dataIndex: '',
      render:(text,record,index)=>(
          <div style={{cursor: 'pointer', color: '#1890ff'}}  onClick={() => {this.clickSEQ(text)}}>{this.state.seqShow === text.id ?
             <Input style={{width: '60px'}} value={this.state.seq} onChange={this.setSEQ} onBlur={() => {this.saveSEQ(text)}}/> : <span>{text.seq ? text.seq : 0}</span>}</div>
      )
    },{
      title:'状态',
      dataIndex:'',
      render:(text,record,index)=>(
        text.status === 'PUBLISH'?'已发布':'未发布'
      )
    },{
      title:'操作',
      dataIndex:'',
      render:(text,record,index)=>(
        <span style={{whiteSpace: 'nowrap'}}>
          {
            this.state.permissionInfo.includes(`medicalguide:update`) ? <a href="javascript:;" onClick={() => this.editor(text.id)}>编辑</a> : null
          }
          {/* <a href="javascript:;" onClick={() => this.editor(text.id)}>编辑</a> */}
          {
            text.status === 'PUBLISH' && this.state.permissionInfo.includes(`medicalguide:publish`)
            ? <span><Divider type="vertical" /><a href="javascript:;" onClick={() => this.publishData([text.id],false)}>取消发布</a></span>
            : null
          }
          {
            text.status === 'UNPUBLISH' && this.state.permissionInfo.includes(`medicalguide:publish`)
            ?  <span><Divider type="vertical" /><a href="javascript:;" onClick={() => this.publishData([text.id],true)}>发布</a></span>
            : null
          }
          <Divider type="vertical" />
        </span>
      )
    }
  ];
  state={
    visible:false,
    type:'ALL',
    name: '',
    urlType: 'EMERGRNCY_TREATMENT_GUIDE',
    selectedRowKeys: [],
    permissionInfo: [],
    getListParams:{
      keyword:'',
      pageIndex:1,
      pageSize: 10,
      status:'ALL'
    },
    data: [],
    pagination: {
      total: 200
    }
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
    data.createTime = new Date(data.createTime).getTime()
    data.publishTime = new Date(data.publishTime).getTime()
    Axios.post(`${URL}/admin/medicalGuide/update`,data).then(res => {
      if(res.data.code === 200){
        message.success('保存成功',1);
        this.getInfo()
        // this.goBack()
      }else{
        message.error(res.data.msg)
      }
    
      setTimeout(()=>{this.setState({seqShow:false})},500)
    }).catch(error => {message.error('异常请求');this.setState({ seqShow: false })})
  }
  // checkbox多选
  onSelectChange = (row) => {
    this.setState({selectedRowKeys:row})
    
  }
  // 单条发布
  publish=(text)=>{
    console.log(text)
    let arr = [text.id]
    api.scienceReader.publish({ids:JSON.stringify(arr)}).then(res=>{
      if(res.data.code===200){
        message.success('操作成功')
        this.getInfo()
      }
    })
  }
  // 批量删除
  delAll=()=>{
    console.log(123)
    let r = window.confirm('确定要删除吗？')
    if(r===true){
      api.scienceReader.del({ids:JSON.stringify(this.state.selectedRowKeys)}).then(res=>{
        if(res.data.code===200){
          message.success('操作成功')
          this.setState({selectedRowKeys:[]})
          this.getInfo()
        }
      })
    }
  }
  // 批量发布
  publishAll=()=>{
    api.scienceReader.publish({ids:JSON.stringify(this.state.selectedRowKeys)}).then(res=>{
      if(res.data.code===200){
        message.success('操作成功')
        this.setState({selectedRowKeys:[]})
        this.getInfo()
      }
    })
  }
  // 单条取消发布
  delPublish=(text)=>{
    let arr = [text.id]
    api.scienceReader.delList({ids: JSON.stringify(arr)}).then(res=>{
      if(res.data.code===200){
        message.success('操作成功')
        this.getInfo()
      }
    })
  }


  /********************************* 数据操作区 start *****************************/
  
  // 选择状态
  typeChange=(text)=>{
    this.setState({getListParams: {...this.state.getListParams,status: text,pageIndex: 1}},()=>{ this.getInfo() })
  }
  //输入关键字
  searchKey=(value)=>{
    this.setState({getListParams:Object.assign({},this.state.getListParams,{keyword:value,pageIndex: 1})},()=>{this.getInfo()})
    
  }

  // 获取数据
  getInfo=()=>{
    Axios.post(`${URL}/admin/medicalGuide/retrieveList`,{
        "departmentIds": "[1,3]",
        "keyword": " ",
        "navbarId": 20,
        "pageIndex": this.state.pageIndex,
        "pageSize": 10,
        "special": "2018",
        "specialWebsiteType": "",
        "status": this.state.type,
        "top": true,
        "type": this.state.urlType,
        ...this.state.getListParams
    }).then(res=>{
      if (!res.data.data.content.length && this.state.getListParams.pageIndex > 1) {
        this.setState({getListParams:{...this.state.getListParams,pageIndex: this.state.getListParams.pageIndex - 1}}, () => {
          this.getInfo()
        })
        return
      }
      this.setState({data:res.data.data.content,
        pagination: {
          total: res.data.data.totalElements,
          pageSize: 10
        }})
        if (res.data.data.content && res.data.data.content[0] && res.data.data.content[0].seq) {
          sessionStorage.setItem('maxLength', res.data.data.content[0].seq)
        } else {
          sessionStorage.setItem('maxLength', 0)
        }
      // this.setState({pagination: {...this.state.pagination, total: res.data.data.totalPages}})
      console.log(res)
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
  delData = (arr) => {
    Axios.get(`${URL}/admin/medicalGuide/delete?ids=${arr}`).then(res => {
      if(res.data.code === 200) {
        message.success('删除成功')
        this.setState({selectedRowKeys: []})
        this.getInfo()
      } else {
        message.error(res.data.msg)
      }
    }).catch(error => {
      message.error('异常请求')
    })
  }

  // 发布/取消发布  arr为ID数据  status为是否发布
  publishData = (arr,status) => {
    Axios.post(`${URL}/admin/medicalGuide/publish?ids=${arr}&status=${status}`).then(res => {
      if (res.data.code === 200) {
        status ? message.success('发布成功') : message.success('取消发布成功')
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
    this.props.history.push(`/hospitalGuideUpdate/${this.state.urlType}/${this.state.urlType}/${type}`)
  }
  
  /********************************* 其他操作 end *******************************/

  componentDidMount() {
    this.setState({name:sessionStorage.getItem('key')})
    this.setState({permissionInfo: (JSON.parse(sessionStorage.getItem('permissionInfo'))?JSON.parse(sessionStorage.getItem('permissionInfo')):[]).map(item =>{
      return item ? item.toLocaleLowerCase() : item
    })})
    
    let pageIndex = sessionStorage.getItem('pageIndex') ? parseInt(sessionStorage.getItem('pageIndex')) : 1;
    this.setState({getListParams: {...this.state.getListParams,pageIndex: pageIndex}},() => {
      this.getInfo()
    })
  }
  componentWillMount () {
    let arrUrl = this.props.location.pathname.split('/')
    this.setState({
      urlType: arrUrl[arrUrl.length-1]
    })
  }
  
  // 切换分页
  setPage = (pageIndex) => {
    this.setState({getListParams: {...this.state.getListParams,pageIndex: pageIndex}},() => {
      sessionStorage.setItem('pageIndex', pageIndex)
      this.getInfo()
    })
  }

  render(){
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
    const pagination = {...this.state.pagination,onChange: this.setPage, current: this.state.getListParams.pageIndex}
    return (
      <div className="science-reader">
        <p style={{fontWeight: 'bold',fontSize: '18px'}}>就医指南/{this.state.name}</p>
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
            <Select defaultValue={this.state.type} style={{ width: 120 }} onChange={this.typeChange}
              getPopupContainer={triggerNode => triggerNode.parentNode}>
              <Option value="ALL">全部</Option>
              <Option value="UNPUBLISH">未发布</Option>
              <Option value="PUBLISH">已发布</Option>
            </Select>
          </FormItem>
          <FormItem style={{float: 'right'}}>
            {
              this.state.permissionInfo.includes(`medicalguide:delete`) ?
                <span>
                <Button className="search__button" type="danger" disabled={this.state.selectedRowKeys.length === 0} onClick={()=>this.delData(this.state.selectedRowKeys)}>批量删除</Button>
                </span>
              :  null
            }
            {
              this.state.permissionInfo.includes(`medicalguide:publish`) ?
                <span>
                  <Button className="search__button" type="primary" disabled={this.state.selectedRowKeys.length === 0} onClick={()=>this.publishData(this.state.selectedRowKeys,false)}>批量取消发布</Button>
                  <Button className="search__button" type="primary" disabled={this.state.selectedRowKeys.length === 0} onClick={()=>this.publishData(this.state.selectedRowKeys,true)}>批量发布</Button>
                </span>
              :  null
            }
            {
              this.state.permissionInfo.includes(`medicalguide:create`) ?
                <span>
                 <Button className="search__button" type="primary" onClick={() => this.editor('NEW')}>新建</Button>
                </span>
              :  null
            }
            {/* <Button className="search__button" type="danger" disabled={this.state.selectedRowKeys.length === 0} onClick={()=>this.delData(this.state.selectedRowKeys)}>批量删除</Button> */}
            {/* <Button className="search__button" type="primary" disabled={this.state.selectedRowKeys.length === 0} onClick={()=>this.publishData(this.state.selectedRowKeys,false)}>批量取消发布</Button>
            <Button className="search__button" type="primary" disabled={this.state.selectedRowKeys.length === 0} onClick={()=>this.publishData(this.state.selectedRowKeys,true)}>批量发布</Button> */}
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

export default scienceReader;
