import React, { Component } from 'react';
// import { Input, Button, Col, Row, Radio, Divider, Table, Modal } from 'antd';
import { Input, Button, Table, Select, Form, Divider, Checkbox,Modal,message} from 'antd';
import api from '@/api'
import ArticleImport from './article-import'
import { statusFillter} from '../../common/js/public.js'
// import axios from 'axios'timeFillter,

import './hospital.styl'
// import Axios from 'axios';
import ajx from 'axios';
import * as axios from '@/component/api.js'
import {URL} from '@/common/js/url.js'

const FormItem = Form.Item;
const Search = Input.Search;
const CheckboxGroup = Checkbox.Group;

const Option = Select.Option


class ThemeVideo extends Component {

  columns = [
    {
      title: '内容标题',
      dataIndex: 'messageNameZH'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
    },
    {
      title: '创建人',
      dataIndex: 'creator',
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
          {/* <a href="javascript:;" onClick={() => this.editor(text.id)}>编辑</a>
          {
            text.state === 'PUBLISHED'
            ? <span><Divider type="vertical" /><a href="javascript:;" onClick={() => this.publish(text)}>取消发布</a></span>
            : null
          }
          <Divider type="vertical" />
          <a href="javascript:;" onClick={() => this.top(text)}>{text.top ? '取消置顶' : '置顶'}</a> */}
          <a href="javascript:;" onClick={() => this.editor(text.id)}>编辑</a>
          {
            text.status === 'PUBLISH'
            ? <span><Divider type="vertical" />
            {this.state.permissionInfo.includes(`message${this.state.urlType.toLocaleLowerCase()}:publish`) || this.props.location.pathname.indexOf('MEDICAL_MATTERS') !== -1 ?
              <a href="javascript:;" onClick={() => this.batchPublish([text.id],false)}>取消发布</a>
              :  null
            }</span>
            : null
          }
          
          {
            text.status === 'UNPUBLISH'
            ? <span><Divider type="vertical" />
            {this.state.permissionInfo.includes(`message${this.state.urlType.toLocaleLowerCase()}:publish`) || this.props.location.pathname.indexOf('MEDICAL_MATTERS') !== -1 ?
              <a href="javascript:;" onClick={() => this.batchPublish([text.id],true)}>发布</a>
              :  null
            }
            </span>
            : null
          }
          <Divider type="vertical" />
          {
            
            text.status !== 'UNPUBLISH' 
            ?  this.state.permissionInfo.includes(`message${this.state.urlType.toLocaleLowerCase()}:top`) || this.props.location.pathname.indexOf('MEDICAL_MATTERS') !== -1 ?
              
              <a href="javascript:;" onClick={() => this.top([text.id],!text.top)}>{text.top ? '取消置顶' : '置顶'}</a>
              :  null
          
            : null
          }
        </span>
      )
    }
  ];
  columns2 = [
    {
      title: '内容标题',
      dataIndex: 'titleZH'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
    },
    {
      title: '创建人',
      dataIndex: 'creator',
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
           <Input value={this.state.seq} onInput={this.setSEQ} onBlur={() => {this.saveSEQ2(text)}}/> :  <span>{text.seq ? text.seq : 0}</span>}</div>
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
        <span>
          {/* <a href="javascript:;" onClick={() => this.editor(text.id)}>编辑</a>
          {
            text.state === 'PUBLISHED'
            ? <span><Divider type="vertical" /><a href="javascript:;" onClick={() => this.publish(text)}>取消发布</a></span>
            : null
          }
          <Divider type="vertical" />
          <a href="javascript:;" onClick={() => this.top(text)}>{text.top ? '取消置顶' : '置顶'}</a> */}
          {
            this.state.permissionInfo.includes(`${this.state.permissionType}:update`) ? <a href="javascript:;" onClick={() => this.editor(text.id)}>编辑</a> : null
          }
          
          {
            text.status === 'PUBLISH' &&  this.state.permissionInfo.includes(`${this.state.permissionType}:publish`)
            ? <span><Divider type="vertical" /><a href="javascript:;" onClick={() => this.batchPublish([text.id],false)}>取消发布</a></span>
            : null
          }
          
          {
            text.status === 'UNPUBLISH' &&  this.state.permissionInfo.includes(`${this.state.permissionType}:publish`)
            ? <span><Divider type="vertical" /><a href="javascript:;" onClick={() => this.batchPublish([text.id],true)}>发布</a></span>
            : null
          }
          <Divider type="vertical" />
          {/* {
            
            text.status !== 'UNPUBLISH' 
            ? <a href="javascript:;" onClick={() => this.top([text.id],!text.top)}>{text.top ? '取消置顶' : '置顶'}</a>
            : null
          } */}
        </span>
      )
    }
  ];
  state = {
    type: 'ALL',
    top: false,
    lang: 'ZH',
    urlType: '',
    isAllTop: false,// 是否批量置顶
    isPublish: false, // 是否批量发布
    selectedRowKeys: [],
    seqShow: false,
    typeIds: [],
    seq: '',
    copyModel: false,
    data: [],
    permissionType: '',
    permissionInfo: [],
    name: '医院动态',
    pageIndex: 1,
    pagination: {
      total: 10,
      pageSize: 10,
      defaultPageSize: 10,
    },
    options: [{
      label: '医院动态',
      value: 'DYNAMIC'
    },{
      label: '医院公告',
      value: 'NOTICE'
    },{
      label: '媒体报道',
      value: 'REPORT'
    },{
      label: '党工团建设',
      value: 'PARTY'
    }],
    // modal
    modalLoading: false,
    modalVisible: false
  }
  // componentWillMount () {
  //   this.setState({name:sessionStorage.getItem('key')})
  //   if (this.props.location.pathname.indexOf('MEDICAL_MATTERS') === -1) {
  //     let arrUrl = this.props.location.pathname.split('/')
  //     this.setState({
  //       urlType: arrUrl[arrUrl.length-1]
  //     },()=>{this.getAll('');})
  //   }else{
  //     this.getAll('');
  //   }
  // }
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
    ajx.post(`${URL}/admin/message/update`,data).then((res)=>{
      if(res.data.code === 200) {
        message.success('保存成功');
        this.getAll()
        // this.props.history.goBack()
      }else{
        message.error(res.msg);
      }
      this.setState({seqShow: false})
    }).catch(error => {
      this.setState({seqShow: false})
      message.error('异常请求')
    })
  }
  saveSEQ2 = (data) => {
    if (!this.state.seq) {
      message.error('排序号为必填项')
      return
    }
    data.seq = parseInt(this.state.seq)
    data.createTime = new Date(data.createTime).getTime()
    data.publishTime = new Date(data.publishTime).getTime()
    ajx.post(`${URL}/admin/medicalVolunteer/update`,data).then((res)=>{
      if(res.data.code === 200) {
        message.success('保存成功');
        // this.props.history.goBack()
      }else{
        message.error(res.msg);
      }
      this.setState({seqShow: false})
    }).catch(error => {
      this.setState({seqShow: false})
      message.error('异常请求')
    })
  }

  publish = (text) => {
    text.state = text.state === 'PUBLISHED' ? 'UNPUBLISH' : 'PUBLISHED'
    this.setState(this.state.data)
  }

  top = (text,flag) => {
    // text.top = text.top ? false : true;
    this.batchTop(text.toString(),flag)
  }

  //  生周期
  componentDidMount() {
    // alert('执行了componentDidMount')
    // console.log(this.props.match.params.id)
    // console.log(this.props.location.pathname)
    let pageIndex = sessionStorage.getItem('pageIndex') ? parseInt(sessionStorage.getItem('pageIndex')) : 1
    this.setState({name:sessionStorage.getItem('key'),pageIndex,permissionInfo: (JSON.parse(sessionStorage.getItem('permissionInfo'))?JSON.parse(sessionStorage.getItem('permissionInfo')):[]).map(item =>{
      return item ? item.toLocaleLowerCase() : item
    }), selectedRowKeys: []})
    if (this.props.location.pathname.indexOf('MEDICAL_MATTERS') === -1) {
      let arrUrl = this.props.location.pathname.split('/')
      this.setState({
        urlType: arrUrl[arrUrl.length-1],id: this.props.match.params.id,
        pageIndex,
        permissionType: 'messagedynamic'
      },()=>{this.getAll('');})
    // 
    }else{
      this.setState({
        pageIndex,
        permissionType: 'medicalvolunteer'
      },()=>{this.getAll('');})
      // this.getAll('');
    }
  }
  // componentDidUpdate() {
  //   this.setState({name:sessionStorage.getItem('key')})
  //   if (this.props.location.pathname.indexOf('MEDICAL_MATTERS') === -1) {
  //     let arrUrl = this.props.location.pathname.split('/')
  //     this.setState({
  //       urlType: arrUrl[arrUrl.length-1],id: this.props.match.params.id
  //     },()=>{this.getAll('');})
  //   }else{
  //     this.getAll('');
  //   }
  // }
  componentWillReceiveProps(next){
    let pageIndex = sessionStorage.getItem('pageIndex') ? parseInt(sessionStorage.getItem('pageIndex')) : 1
    this.setState({name:sessionStorage.getItem('key'),pageIndex, selectedRowKeys: []})
    // alert('执行了componentWillReceiveProps')
    if (this.props.location.pathname.indexOf('MEDICAL_MATTERS') === -1) {
      let arrUrl = this.props.location.pathname.split('/')
      this.setState({
        urlType: arrUrl[arrUrl.length-1]
      })
    }else{
      this.setState({name:sessionStorage.getItem('key'),id: next.match.params.id},()=>{
        this.getAll('');
      })
    }
  }
  // checkBox
  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  }

  // type
  typeChange = (value) => {
    this.setState({type: value})
    this.getAll('')
  }

  // 新建/编辑
  editor = (type) => {
    const {path} = this.props.match
    const {lang} = this.state
    if( this.props.location.pathname.indexOf('MEDICAL_MATTERS') !== -1){
      var str = `/MedicalMattersEditor/${this.props.match.params.id}${path}`.replace(':id',type)
      this.props.history.push(str)
    }else{
      this.props.history.push(`/Information/${lang}${path}/${type}`)
    }
  }
  // 切换语言
  langChange = (lang) => {
    this.setState({lang})
    this.submitContent()
  }
  // 提交编辑内容
  submitContent = () => {
    console.log('提交编辑内容')
  }

  getData = (params = {}) => {
    api.newMedia.getWechatInfo(params).then(res => {

    })
  }

  // 批量导入
  modalSubmit = () => {
    this.setState({ modalLoading: true });
    setTimeout(() => {
      this.setState({ modalLoading: false, modalVisible: false });
    }, 3000);
  }

  modalHide = () => {
    this.setState({modalVisible: false})
  }

  // 切换状态
  checkStatus = (val) => {
    this.setState({
      pageIndex: 1,
      type: val
    },()=>{this.getAll('')})
  
    // console.log(val);
  }

  // 过滤时间
  filterTime(time){
    let d = new Date(time);
    let year =  d.getFullYear();
    let month = (d.getMonth()+1) >= 10 ?(d.getMonth()+1):'0'+(d.getMonth()+1);
    let day = d.getDate() >= 10 ? d.getDate() :'0'+ d.getDate();
    let hour = d.getHours() >= 10 ? d.getHours()  :'0'+ d.getHours() ;
    let minutes = d.getMinutes() >= 10 ? d.getMinutes() :'0'+ d.getMinutes();
    return year+'-'+month+'-'+day+' '+hour+':'+minutes;
  }

  // 获取数据列表
  getAll = (keyword) => {
    // 医务社工的
    if(this.props.location.pathname.indexOf('MEDICAL_MATTERS') !== -1 && this.props.match.params.id){
      let params = {
        "deadlineTime": 1532584454545,
        "departmentId": 0,
        "departmentIds": "",
        "departmentRequirement": "",
        "educationalRequirement": "",
        "jobRequirement": "",
        "keyword": keyword,
        "navbarId": this.props.match.params.id,
        "normalUserEmail": "",
        "overDeadline": true,
        "pageIndex": this.state.pageIndex,
        "pageSize": 10,
        "publishTime": 1532584454545,
        "special": "2018",
        "specialWebsiteType": "",
        "status": this.state.type,
        "top": this.state.top,
        "type": "ALL"
      }
      axios.getData_medical(params,res=>{
        if (!res.data.data.content.length && this.state.pageIndex > 1) {
          this.setState({pageIndex: this.state.pageIndex - 1}, () => {
            this.getData()
          })
          return
        }
        res.data.data.content.forEach((item)=>{
          if(item.createTime)item.createTime = this.filterTime(item.createTime);
          if(item.publishTime)item.publishTime = this.filterTime(item.publishTime);
        })
        this.setState({
          data: res.data.data.content,
          pagination: {
            total: res.data.data.totalElements,
            pageSize: 10
          }
        },()=>{console.log(this.state.pagination.total)})
        if (res.data.data.content && res.data.data.content[0] && res.data.data.content[0].seq) {
          console.log(res.data.data.content[0].seq)
          sessionStorage.setItem('maxLength', res.data.data.content[0].seq)
        } else {
          sessionStorage.setItem('maxLength', res.data.data.totalElements)
        }
      })
      return
    }
    // 资讯的
    axios.getData_information({
      "departmentIds": "",
      "keyword": keyword,
      "navbarId": 20,
      "pageIndex": this.state.pageIndex,
      "pageSize": 10,
      "special": "2018",
      "status": this.state.type,
      "type": this.state.urlType
    },(res)=>{
      
      if (!res.data.data.content.length && this.state.pageIndex > 1) {
        this.setState({pageIndex: this.state.pageIndex - 1}, () => {
          this.getData()
        })
        return
      }
      res.data.data.content.forEach((item)=>{
        if(item.createTime)item.createTime = this.filterTime(item.createTime);
        if(item.publishTime)item.publishTime = this.filterTime(item.publishTime);
      })
      this.setState({
        data: res.data.data.content,
        pagination: {
          total: res.data.data.totalElements,
          pageSize: 10
        }
      },()=>{console.log(this.state.pagination.total)})
      if (res.data.data.content && res.data.data.content[0] && res.data.data.content[0].seq) {
        sessionStorage.setItem('maxLength', res.data.data.content[0].seq)
      } else {
        sessionStorage.setItem('maxLength', res.data.data.totalElements)
      }
    })
  }

  // 批量删除
  delData = () => {
    var arr = this.state.selectedRowKeys;
    if(this.props.location.pathname.indexOf('MEDICAL_MATTERS') !== -1){
      console.log('删除异物志远')
        
      axios.delData_medical(arr,(res)=>{
        this.setState({
          selectedRowKeys: []
        })
        this.getAll('');
      })
      return
    }
    axios.delData_information(arr,(res)=>{
      this.setState({
        selectedRowKeys: []
      })
      this.getAll('');
    })
  }

  // 批量置顶/取消置顶
  batchTop = (arr,flag) => {
    this.setState({
      isAllTop: flag
    },() => { // 防止异步操作
      axios.topData_information({ids: arr,top: this.state.isAllTop},(res)=>{
        this.setState({
          selectedRowKeys: []
        })
        this.getAll('');
      })
    })
  }

  // 批量发布/取消发布
  batchPublish = (arr,flag) => {
    let template = { // 后台要求定义的模板
      "accessoryIds": "",
      "accessoryList": "",
      "createTime": 0,
      "creator": "string",
      "departmentIds": "",
      "hits": 0,
      "id": 0,
      "messageContentUS": "english content",
      "messageContentZH": "中文内容",
      "messageNameUS": "english title",
      "messageNameZH": "中文标题",
      "publishTime": 0,
      "status": "UNPUBLISH",
      "top": true,
      "type": this.state.urlType
    }
    // let arr = this.state.selectedRowKeys
    
    if(this.props.location.pathname.indexOf('MEDICAL_MATTERS') !== -1){
      axios.publishData_medical({ids: arr,status: flag},()=>{
        this.setState({
          selectedRowKeys: []
        })
        this.getAll('');
      })
      return
    }
    axios.publishData_information({ids: arr,status: flag, message: template},()=>{
      this.setState({
        selectedRowKeys: []
      })
      this.getAll('');
    })
    // ajx.post(`${URL}/admin/message/publish?ids=${arr}&status=${flag}&message=${template}`).then((res) => {
    //   if(res.code === 200) {
    //     this.setState({
    //       selectedRowKeys: []
    //     })
    //     this.getAll('');
    //     flag ? message.success('发布成功') :  message.success('取消发布成功')
    //   }else {
    //     message.error(res.msg)
    //   }
    // }).catch(error => {
    //   message.error('异常请求')
    // })
  }

  // 批量复制
  copyData = () => {
    axios.copyData({selectedRowKeys: this.state.selectedRowKeys,typeIds: this.state.typeIds},res => {
      // console.log(res)
      this.setState({copyModel: false})
    })
  }

  setPage = (index) => {
    this.setState({pageIndex: index},()=>{
      this.getAll('')
      sessionStorage.setItem('pageIndex', index)
    })
  }

  render() {
    const { selectedRowKeys } = this.state;
    let pagination = {...this.state.pagination,onChange: this.setPage,current: this.state.pageIndex}
    // this.getAll();
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    console.log(this.state.permissionType)
    return (
      <div className="hospital">
        <p style={{fontWeight: 'bold',fontSize: '18px'}}>{this.props.location.pathname.indexOf('MEDICAL_MATTERS') !== -1?'医务社工':'资讯信息'}/{this.state.name}</p>
        <Form layout="inline">
          <FormItem>
            <Search
              placeholder="输入搜索"
              onSearch={value => {this.setState({pageIndex: 1},()=>{this.getAll(value)})}}
              style={{ width: 200 }}
              maxLength={20}
            />
          </FormItem>
          <FormItem label="类型">
            <Select defaultValue={this.state.type} style={{ width: 120 }} onChange={this.checkStatus}
              getPopupContainer={triggerNode => triggerNode.parentNode}>
              <Option value="ALL">全部</Option>
              <Option value="UNPUBLISH">未发布</Option>
              <Option value="PUBLISH">已发布</Option>
              {this.props.location.pathname.includes('MEDICAL_MATTERS') ? null :<Option value="TOP">已置顶</Option>}
            </Select>
          </FormItem>
          {/* <FormItem label="语言">
            <Select defaultValue={this.state.lang} style={{ width: 120 }} onChange={this.langChange}>
              <Option value="ZH">中文</Option>
              <Option value="EN">英文</Option>
            </Select>
          </FormItem> */}
          <FormItem style={{float: 'right'}}>
            {this.state.permissionInfo.includes(`${this.state.permissionType}:delete`)  ?
              <Button className="search__button" type="danger" disabled={this.state.selectedRowKeys.length === 0} onClick={this.delData}>批量删除</Button>
              :  null
            }
            {this.state.permissionInfo.includes(`${this.state.permissionType}:copy`) && this.props.location.pathname.indexOf('MEDICAL_MATTERS') === -1 ?
              <Button className="search__button" type="primary" disabled={this.state.selectedRowKeys.length === 0} onClick={()=>{this.setState({copyModel: true})}}>批量复制</Button>
              :  null
            }
            {this.state.permissionInfo.includes(`${this.state.permissionType}:publish`)?
              <span>
                <Button className="search__button" type="primary" disabled={this.state.selectedRowKeys.length === 0} onClick={()=>{this.batchPublish(this.state.selectedRowKeys,true)}}>批量发布</Button>
                <Button className="search__button" type="primary" disabled={this.state.selectedRowKeys.length === 0} onClick={()=>{this.batchPublish(this.state.selectedRowKeys,false)}}>批量取消发布</Button>
              </span>
              :  null
            }
            
           
            {
              this.props.location.pathname.indexOf('MEDICAL_MATTERS') === -1 && this.state.permissionInfo.includes(`${this.state.permissionType}:top`)?
                <span>
                  <Button className="search__button" type="primary" disabled={this.state.selectedRowKeys.length === 0} onClick={()=>{this.batchTop(this.state.selectedRowKeys,false)}}>批量取消置顶</Button>
                  <Button className="search__button" type="primary" disabled={this.state.selectedRowKeys.length === 0} onClick={()=>{this.batchTop(this.state.selectedRowKeys,true)}}>批量置顶</Button>
                </span>
              :
              null
            }
            
            {/* <Button className="search__button" type="primary" disabled={this.state.selectedRowKeys.length === 0} onClick={()=>this.setState({modalVisible: true})} >批量复制</Button> */}
            {
              this.state.permissionInfo.includes(`${this.state.permissionType}:create`)?
                <Button className="search__button" type="primary" onClick={() => this.editor('NEW')}>新建</Button>
              :
              null
            }
            {/* {
              this.state.permissionInfo.includes(`medicalvolunteer:create`) && this.props.location.pathname.indexOf('MEDICAL_MATTERS') !== -1?
                <Button className="search__button" type="primary" onClick={() => this.editor('NEW')}>新建</Button>
              :
              null
            } */}
          </FormItem>
        </Form>
        <Divider />
        {
          this.props.location.pathname.indexOf('MEDICAL_MATTERS') !== -1?
            <Table
            rowKey="id"
            columns={this.columns2}
            dataSource={this.state.data}
            rowSelection={rowSelection}
            pagination={pagination}
            loading={this.state.loading}
          />
          :
          <Table
            rowKey="id"
            columns={this.columns}
            dataSource={this.state.data}
            rowSelection={rowSelection}
            pagination={pagination}
            loading={this.state.loading}
          />
        }
        <ArticleImport
          modalVisible={this.state.modalVisible}
          modalLoading={this.state.modalLoading}
          modalTitle='批量导入'
          modalSubmit={this.modalSubmit}
          modalHide={this.modalHide}
        />
        <Modal
          title="批量复制"
          visible={this.state.copyModel}
          onOk={this.copyData}
          okText="确定"
          cancelText="取消"
          onCancel={()=>{this.setState({copyModel: false,typeIds: []})}}
        >
          <CheckboxGroup options={this.state.options} defaultValue={[]} onChange={(ids) => {this.setState({typeIds: ids})}} />
        </Modal>
        
      </div>
    );
  }
  
}

export default ThemeVideo;
