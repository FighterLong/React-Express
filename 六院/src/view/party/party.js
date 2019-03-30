import React, { Component } from 'react';
// import { Input, Button, Col, Row, Radio, Divider, Table, Modal } from 'antd';
import { Input, Button, Table, Select, Form, Divider, message,Modal, Radio} from 'antd';
import api from '@/api'
// import ArticleImport from './article-import'
import {timeFillter, statusFillter} from '../../common/js/public.js'

import './hospital.styl'
import axios from 'axios';
import {URL} from '@/common/js/url.js'
// import ajx from '../../api/request';
// import * as axios from '@/component/api.js'
// const URL = 'http://192.168.0.122:7979'

// const URL = 'http://192.168.0.122:7979'
const FormItem = Form.Item;
const Search = Input.Search;

const Option = Select.Option
// const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;


class Party extends Component {

  columns = [
    {
      title: '内容标题',
      dataIndex: 'nameZH'
    },
    {
      title: '创建时间',
      dataIndex: '',
      render:(text,record,index)=>(
        text.createTime && timeFillter(text.createTime,true)
      )
    },
    {
      title: '发布时间',
      dataIndex: '',
      render:(text,record,index)=>(
        text.publishTime && timeFillter(text.publishTime,true)
      )
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
          {
            this.state.permissionInfo.includes(`${this.state.urlType.toLowerCase()}:update`) ? <a href="javascript:;" onClick={() => this.editor(text.id)}>编辑</a> : null
          }
          {/* {
            text.state === 'PUBLISHED'
            ? <span><Divider type="vertical" /><a href="javascript:;" onClick={() => this.publish(text)}>取消发布</a></span>
            : null
          } */}
         {
            text.status === 'PUBLISH' && this.state.permissionInfo.includes(`${this.state.urlType.toLowerCase()}:publish`)
            ? <span><Divider type="vertical" /><a href="javascript:;" onClick={() => this.batchPublish([text.id],false)}>取消发布</a></span>
            : null
          }
          
          {
            text.status === 'UNPUBLISH' && this.state.permissionInfo.includes(`${this.state.urlType.toLowerCase()}:publish`)
            ? <span><Divider type="vertical" /><a href="javascript:;" onClick={() => this.batchPublish([text.id],true)}>发布</a></span>
            : null
          }<Divider type="vertical" />
          {
            this.state.permissionInfo.includes(`${this.state.urlType.toLocaleLowerCase()}:top`) ?
            <a href="javascript:;" onClick={() => this.topData([text.id],!text.top)}>{text.top ? '取消置顶' : '置顶'}</a>
            :  null
          }
        </span>
      )
    }
  ];
  
  state = {
    type: 'ALL',
    lang: 'ZH',
    urlType: '',
    isAllTop: false,// 是否批量置顶
    isPublish: false, // 是否批量发布
    selectedRowKeys: [],
    moveModel: false,
    columnList: [],
    columnId: -1,
    data: [],
    pagination: {
      total: 0
    },
    name: '',
    permissionInfo: [],
    // modal
    modalLoading: false,
    modalVisible: false,
    params: {
        "deadlineTime": 1532584454545,
        "departmentId": 0,
        "departmentIds": "",
        "departmentRequirement": "",
        "educationalRequirement": "",
        "jobRequirement": "",
        "keyword": " ",
        "navbarId": 20,
        "normalUserEmail": "",
        "overDeadline": true,
        "pageIndex": 1,
        "pageSize": 10,
        "publishTime": 1532584454545,
        "special": "",
        "specialWebsiteType": "",
        "status": "ALL",
        "top": true,
        "type": ""
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
    axios.post(`${URL}/admin/${this.state.urlType}/update`,data).then(res => {
      if(res.data.code === 200){
        message.success('保存成功',1);
        this.getAll('')
        // this.goBack()
      }else{
        message.error(res.data.msg)
      }
    
      setTimeout(()=>{this.setState({seqShow:false})},500)
    }).catch(error => {message.error('异常请求');this.setState({ seqShow: false })})
  }
  

  publish = (text) => {
    text.state = text.state === 'PUBLISHED' ? 'UNPUBLISH' : 'PUBLISHED'
    this.setState(this.state.data)
  }

  top = (text) => {
    text.top = text.top ? false : true;
    this.batchTop([text.id].toString(),text.top)
  }

  //  生周期
  componentDidMount() {
    this.setState({name:sessionStorage.getItem('key'), selectedRowKeys: []})
    this.setState({permissionInfo: (JSON.parse(sessionStorage.getItem('permissionInfo'))?JSON.parse(sessionStorage.getItem('permissionInfo')):[]).map(item =>{
      return item ? item.toLocaleLowerCase() : item
    })})
    // this.setState({params: {...this.state.params,navbarId: this.props.match.params.id}},()=>{ this.getAll('') })
    // console.log(this.props.location.pathname)
    let urlType = 'researchTeaching'
    if (this.props.location.pathname.indexOf('researchProject') !== -1) {
      urlType = 'researchTeaching'
    } else {
      urlType = 'teaching'
    }
    let pageIndex = sessionStorage.getItem('pageIndex') ? parseInt(sessionStorage.getItem('pageIndex')) : 1;
    this.setState({params: {...this.state.params,pageIndex,navbarId: this.props.match.params.id},columnId: this.props.match.params.id,urlType},()=>{ 
        this.getColumn()
        this.getAll('') })
  }
  componentWillReceiveProps(next) {
    this.setState({name:sessionStorage.getItem('key'), selectedRowKeys: []})
    //   console.log('执行')
    let urlType = 'researchTeaching'
    if (this.props.location.pathname.indexOf('researchProject') !== -1) {
      urlType = 'researchTeaching'
    } else {
      urlType = 'teaching'
    }
    let pageIndex = sessionStorage.getItem('pageIndex') ? parseInt(sessionStorage.getItem('pageIndex')) : 1;
    this.setState({params: {...this.state.params,pageIndex,navbarId: next.match.params.id},columnId: next.match.params.id,urlType},()=>{
      this.getColumn()
      this.getAll('') })
  }
  // checkBox
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }

  // type
  typeChange = (value) => {
    this.setState({type: value})
    this.getAll('')
  }

  // 新建/编辑
  editor = (type) => {
    // const {path} = this.props.match
    // const {lang} = this.state
    this.props.location.pathname.indexOf('researchProject') !== -1 ? 
    this.props.history.push(`/ResearchEditor/${this.props.match.params.id}/${type}`)
    : this.props.history.push(`/teachingEditor/${this.props.match.params.id}/${type}`)
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
    this.setState({params: {...this.state.params,status: val,pageIndex: 1}},()=>{this.getAll()})
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
    axios({
        url: URL + `/admin/${this.state.urlType}/retrieveList`,
        data: this.state.params,
        method: 'post',
      }).then((res)=>{
        this.setState({data: res.data.data.content,
          pagination: {
            total: res.data.data.totalElements,
            pageSize: 10
          }})
          if (res.data.data.content && res.data.data.content[0] && res.data.data.content[0].seq) {
            sessionStorage.setItem('maxLength', res.data.data.content[0].seq)
          } else {
            sessionStorage.setItem('maxLength', 0)
          }
    }).catch(error => {
        message.error('异常请求')
    })
  }

  // 批量删除
  delData = () => {
    axios.post(`${URL}/admin/${this.state.urlType}/delete?ids=${this.state.selectedRowKeys}`).then((res)=>{
        if(res.data.code === 200) {
            message.success('删除成功');
            this.setState({
              selectedRowKeys: [],
              params: {...this.state.params, pageIndex: (this.state.pageIndex - 1) > 0 ? (this.state.pageIndex - 1) : 1}
            }, () => {
              this.getAll('')
            })
        }else {
            message.error(res.data.msg)
        }
    }).catch(error => {
        message.error('异常请求')
    })
  }

  // 批量发布/取消发布
  batchPublish = (ids,flag) => {
    axios.post(`${URL}/admin/${this.state.urlType}/publish?ids=${ids}&status=${flag}`).then((res) => {
        if(res.data.code === 200) {
            flag ? message.success('发布成功') :  message.success('取消发布成功')
            this.getAll()
        }else {
          message.error(res.data.msg)
        }
    }).catch(error => {
        message.error('异常请求')
    })
  }

  // 批量置顶/取消置顶
  topData = (ids, flag) => {
    axios.get(`${URL}/admin/${this.state.urlType}/top?ids=${ids}&top=${flag}`).then((res) => {
        if(res.data.code === 200) {
            flag ? message.success('置顶成功') :  message.success('取消置顶成功')
            this.getAll()
        }else {
          message.error(res.data.msg)
        }
    }).catch(error => {
        message.error('异常请求')
    })
  }

  // 获取可以移动的同级栏目
  getColumn = () => {
    axios.get(`${URL}/admin/navbar/listTheSameLevelNavbarById?navbarId=${this.props.match.params.id}`).then(res => {
      if (res.data.code === 200) {
        let arr = []
        res.data.data && res.data.data.forEach(element => {
          if (element.listNavbar.length) {
            element.listNavbar.forEach(item => {
              arr.push({
                id: item.id,
                name: item.navbarNameZH
              })
            })
            // arr = Object.assign(arr, element.listNavbar)
          }
        });
        this.setState({columnList: arr})
      }
    })
  }

  moveArticle = () => {
    axios.get(`${URL}/admin/${this.state.urlType}/move?ids=${this.state.selectedRowKeys}&columnId=${this.state.columnId}`).then(res => {
      if (res.data.code === 200) {
        message.success('移动成功')
        this.setState({selectedRowKeys: []})
        this.getAll('')
      } else {
        message.error(res.data.msg)
      }
      this.setState({moveModel: false})
    })
  }

  // 切换分页
  setPage = (pageIndex) => {
    this.setState({params: {...this.state.params,pageIndex: pageIndex}},() => {
      sessionStorage.setItem('pageIndex', pageIndex)
      this.getAll()
    })
  }
  // 切换移动的栏目并设置
  setColumnId = (e) => {
    this.setState({columnId: e.target.value})
  }
  render() {

    const { selectedRowKeys } = this.state;

    // this.getAll();
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const pagination = {...this.state.pagination,onChange: this.setPage, current: this.state.params.pageIndex}

    // 单选的栏目列表
    let columnElement = []
    this.state.columnList.forEach(item => {
      columnElement.push(<Radio value={item.id}>{item.name}</Radio>)
    })

    return (
      <div className="hospital">
      <p style={{fontWeight: 'bold',fontSize: '18px'}}>{this.props.location.pathname.indexOf('researchProject') !== -1 ? '科研' : '教学'}/{this.state.name}</p>
        <Form layout="inline">
          <FormItem>
            <Search
              placeholder="输入搜索"
              onSearch={value => {this.setState({params: {...this.state.params,keyword: value,pageIndex: 1}},() => {this.getAll()})}}
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
              {/* <Option value="TOP">已置顶</Option> */}
            </Select>
          </FormItem>
          {/* <FormItem label="语言">
            <Select defaultValue={this.state.lang} style={{ width: 120 }} onChange={this.langChange}>
              <Option value="ZH">中文</Option>
              <Option value="EN">英文</Option>
            </Select>
          </FormItem> */}
          <FormItem style={{float: 'right'}}>
          {
              this.state.permissionInfo.includes(`${this.state.urlType.toLowerCase()}:update`) ?
                <span>
                   <Button className="search__button" type="primary" disabled={this.state.selectedRowKeys.length === 0} onClick={() => this.setState({moveModel: true})}>批量移动</Button>
                </span>
              :  null
            }
            {
              this.state.permissionInfo.includes(`${this.state.urlType.toLowerCase()}:delete`) ?
                <span>
                  <Button className="search__button" type="danger" disabled={this.state.selectedRowKeys.length === 0} onClick={this.delData}>批量删除</Button>
                </span>
              :  null
            }
            {
              this.state.permissionInfo.includes(`${this.state.urlType.toLowerCase()}:publish`) ?
                <span>
                  <Button className="search__button" type="primary" disabled={this.state.selectedRowKeys.length === 0} onClick={()=>{this.batchPublish(this.state.selectedRowKeys,true)}}>批量发布</Button>
                  <Button className="search__button" type="primary" disabled={this.state.selectedRowKeys.length === 0} onClick={()=>{this.batchPublish(this.state.selectedRowKeys,false)}}>批量取消发布</Button>
                </span>
              :  null
            }
            {
              this.state.permissionInfo.includes(`${this.state.urlType.toLowerCase()}:top`) ?
                <span>
                  <Button className="search__button" type="primary" disabled={this.state.selectedRowKeys.length === 0} onClick={()=>{this.topData(this.state.selectedRowKeys,true)}}>批量置顶</Button>
                  <Button className="search__button" type="primary" disabled={this.state.selectedRowKeys.length === 0} onClick={()=>{this.topData(this.state.selectedRowKeys,false)}}>批量取消置顶</Button>
                </span>
              :  null
            }
            {
              this.state.permissionInfo.includes(`${this.state.urlType.toLowerCase()}:create`) ?
                <span>
                  <Button className="search__button" type="primary" onClick={() => this.editor('NEW')}>新建</Button>
                </span>
              :  null
            }
            {/* <Button className="search__button" type="danger" disabled={this.state.selectedRowKeys.length === 0} onClick={this.delData}>批量删除</Button> */}
            {/* <Button className="search__button" type="primary" disabled={this.state.selectedRowKeys.length === 0} onClick={()=>{this.batchPublish(this.state.selectedRowKeys,true)}}>批量发布</Button>
            <Button className="search__button" type="primary" disabled={this.state.selectedRowKeys.length === 0} onClick={()=>{this.batchPublish(this.state.selectedRowKeys,false)}}>批量取消发布</Button> */}
            {/* <Button className="search__button" type="primary" disabled={this.state.selectedRowKeys.length === 0} onClick={()=>this.setState({modalVisible: true})} >批量复制</Button> */}
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
        {/* <ArticleImport
          modalVisible={this.state.modalVisible}
          modalLoading={this.state.modalLoading}
          modalTitle='批量导入'
          modalSubmit={this.modalSubmit}
          modalHide={this.modalHide}
        /> */}
        <Modal
          title="批量移动"
          visible={this.state.moveModel}
          onOk={this.moveArticle}
          okText="确定"
          cancelText="取消"
          onCancel={()=>{this.setState({moveModel: false,columnId: ''})}}
        >
        {/* onChange={this.setColumnId} */}
          <RadioGroup onChange={this.setColumnId} defaultValue={this.state.columnId}>
            {columnElement}
          </RadioGroup>
          {/* <RadioGroup options={this.state.options} defaultValue={[]} onChange={(ids) => {this.setState({typeIds: ids})}} /> */}
        </Modal>
      </div>
    );
  }
  
}

export default Party;
