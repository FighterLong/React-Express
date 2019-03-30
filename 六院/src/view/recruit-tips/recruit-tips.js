import React,{Component} from 'react'
import { Input, Button, Table, Select, Form, Divider, message} from 'antd';
import api from '@/api'
import {timeFillter, statusFillter} from '../../common/js/public.js'
import './recruit-tips.styl'
import { spawn } from 'child_process';
import axios from 'axios'
import {URL} from '@/common/js/url.js'

const FormItem = Form.Item;
const Search = Input.Search;
const Option = Select.Option

class RecruitTips extends Component {
  columns=[
    {title:'内容标题',
     dataIndex:'titleZH',
     width:'23%'},
     {title:'标签',
     dataIndex:'',
     render:(text,record,index)=>(
       <div>
       {
          text.labelSet && text.labelSet.map(item => {
            return <span>{item.nameZH}、</span>
          })
       }
       </div>
     )},
     {
       title: '创建时间',
       dataIndex: '',
       render:(text,index)=>(
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
    {title:'截止时间',
    dataIndex:'',
    render:(text,record,index)=>(
      text.deadline?timeFillter(text.deadline):0
    )},
    {title:'创建人',
    dataIndex:'creator'},
    {title:'点击数',
    dataIndex:'hits'},
    {title:'排序号',
    dataIndex:'',
    render:(text,record,index)=>(
      <div style={{cursor: 'pointer', color: '#1890ff'}}  onClick={() => {this.clickSEQ(text)}}>{this.state.seqShow === text.id ?
         <Input value={this.state.seq} onInput={this.setSEQ} onBlur={() => {this.saveSEQ(text)}}/> :  <span>{text.seq ? text.seq : 0}</span>}</div>
    )},
    {title:'状态',
    dataIndex:'',
    render:(text,record,index)=>(
      text.status?statusFillter(text.status):''
    )},
    {title:'操作',
    dataIndex:'',
    render:(text,record,index)=>(
      <span style={{whiteSpace: 'nowrap'}}>
        {
          this.state.permissionInfo.includes(`${this.state.urlType.toLocaleLowerCase()}:update`) ? <a href='javascript:;' onClick={()=>this.editor(text.id)}>编辑</a> : null
        }
        {/* <a href='javascript:;' onClick={()=>this.editor(text.id)}>编辑</a> */}
        {
          text.status === 'PUBLISH' && this.state.permissionInfo.includes(`${this.state.urlType.toLocaleLowerCase()}:publish`)
          ? <span><Divider type="vertical" /><a href="javascript:;" onClick={() => this.publishData([text.id],false)}>取消发布</a></span>
          : null
        }
        {
          text.status === 'UNPUBLISH' && this.state.permissionInfo.includes(`${this.state.urlType.toLocaleLowerCase()}:publish`)
          ?  <span><Divider type="vertical" /><a href="javascript:;" onClick={() => this.publishData([text.id],true)}>发布</a></span>
          : null
        }
         
          {/* <a href='javascript:;' onClick={()=>this.top(text)}>{text.state === 'TOP' ? '取消置顶' : '置顶'}</a> */}
      </span>
    )}
  ];
  state={
    visible:false,
    type:'ALL',
    selectedRowKeys:[],
    name: '',
    urlType: 'recruitment',
    params: {
      "keyword": "",
      biddingPurchasingLabelIdList: [],
      "navbarId": 20,
      "pageIndex": 1,
      "pageSize": 10,
      "status": "ALL"
    },
    data:[],
    permissionInfo: [],
    labelList: [],
    pagination:{
      total:200
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
    data.seq = this.state.seq
    if (sessionStorage.getItem('key') === '招聘启事') {
      axios.post(`${URL}/admin/recruitment/update`,data).then((res)=>{
        if(res.data.code === 200) {
          message.success('保存成功');
          this.getData()
        }else{
          message.error(res.msg);
        }
        this.setState({seqShow: false})
      }).catch(error => {
        this.setState({seqShow: false})
        message.error('异常请求')
      })
    } else {
      axios.post(`${URL}/admin/biddingPurchasing/update`,data).then((res)=>{
        if(res.data.code === 200) {
          message.success('保存成功');
          // this.props.history.goBack()
          this.getData()
        }else{
          message.error(res.msg);
        }
        this.setState({seqShow: false})
      }).catch(error => {
        this.setState({seqShow: false})
        message.error('异常请求')
      })
    }
  }
  //  生周期
  componentDidMount() {
    this.getLabel()
    this.setState({name:sessionStorage.getItem('key'), selectedRowKeys: []})
    console.log(this.props.location)
    this.setState({permissionInfo: (JSON.parse(sessionStorage.getItem('permissionInfo'))?JSON.parse(sessionStorage.getItem('permissionInfo')):[]).map(item =>{
      return item ? item.toLocaleLowerCase() : item
    })})
    let pageIndex = sessionStorage.getItem('pageIndex') ? parseInt(sessionStorage.getItem('pageIndex')) : 1;
    // this.setState({params: {...this.state.params,navbarId: this.props.match.params.id}},()=>{ this.getAll('') })
    if(this.props.location.pathname.indexOf('BIDDING') !== -1) {
      this.setState({params: {...this.state.params,navbarId: parseInt(this.props.match.params.id),pageIndex}, urlType: 'biddingPurchasing' },()=>{
        this.getData() })
    }else{
      this.setState({params: {...this.state.params,navbarId: parseInt(this.props.match.params.id),pageIndex}, urlType: 'recruitment' },()=>{ 
        this.getData() })
    }
    
    // this.setState({params: {...this.state.params}})
  }
  componentWillReceiveProps(next) {
    this.setState({name:sessionStorage.getItem('key'), selectedRowKeys: []})
    
    let pageIndex = sessionStorage.getItem('pageIndex') ? parseInt(sessionStorage.getItem('pageIndex')) : 1;
    if(next.location.pathname.indexOf('BIDDING') !== -1) {
      this.setState({params: {...this.state.params,navbarId: parseInt(next.match.params.id),pageIndex}, urlType: 'biddingPurchasing' },()=>{
        this.getData() })
    }else{
      this.setState({params: {...this.state.params,navbarId: parseInt(next.match.params.id),pageIndex}, urlType: 'recruitment' },()=>{ 
        this.getData() })
    }
  }
  /*********************** 数据操作区  start **************************/
  // 获取数据
  getData = () => {
    axios.post(`${URL}/admin/${this.state.urlType}/retrieveList`,this.state.params).then(res => {
      if(res.data.code === 200) {
        if (!res.data.data.content.length && this.state.params.pageIndex > 1) {
          this.setState({params: {...this.state.params,pageIndex: this.state.params.pageIndex - 1}}, () => {
            this.getData(this.state.params)
          })
          return
        }
        this.setState({ data : res.data.data.content,pagination:{...this.state.pagination,total:res.data.data.totalElements,pageSize: 10}})
        if (res.data.data.content && res.data.data.content[0] && res.data.data.content[0].seq) {
          sessionStorage.setItem('maxLength', res.data.data.content[0].seq)
        } else {
          sessionStorage.setItem('maxLength', 0)
        }
      }else { message.error(res.data.msg) }
     })
  }
  // 删除数据
  delData = () => {
    axios.post(`${URL}/admin/${this.state.urlType}/delete?ids=${this.state.selectedRowKeys}`).then(res => {
      if(res.data.code === 200) {
        message.success('删除成功')
        this.setState({ selectedRowKeys: []},()=>{this.getData()})
      }else {
        message.error(res.data.msg)
      }
    }).catch(error => { message.error('异常请求') })
  }
  // 发布/取消发布
  publishData = (ids,status) => {
    axios.post(`${URL}/admin/${this.state.urlType}/publish?ids=${ids}&status=${status}`).then(res => {
      if(res.data.code === 200) {
        status?message.success('发布成功'):message.success('取消发布成功')
        this.setState({ selectedRowKeys:[] }, ()=>{this.getData()})
      }else {
        message.error(res.data.msg)
      }
    }).catch(error => { message.error('异常请求') })
  }
  /*********************** 数据操作区  end   **************************/

  search_value = (value) => {
    this.setState({params: {...this.state.params,keyword: value}}, ()=>{ this.getData() })
  }

  hideModal = () => {
    this.setState({visible: false})
  }

  editor = (text) => {
    this.setState({modelData: text})
    this.setState({visible: true})
  }

  top = (text) => {
    text.state = text.state === 'TOP' ? 'UNPUBLISH' : 'TOP'
    this.setState(this.state.data)
  }
  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  }

  // type
  typeChange = (value) => {
    if(value === 'TOP') {
      this.setState({params: { ...this.state.params,overDeadline: true}},()=>{this.getData()})
      return
    }
    this.setState({params: { ...this.state.params,status: value}},()=>{this.getData()})
    // this.setState({type: value})
  }

  // 新建/编辑
  editor = (type) => {
    // console.log(this.props.match.params.id)
    sessionStorage.setItem('urlType',this.props.location.pathname)
    sessionStorage.getItem('key') === '招聘启事'? this.props.history.push(`/recruitTipsUpdate/${this.props.match.params.id}/${type}`) : this.props.history.push(`/RecruitArticleEditor/${this.props.match.params.id}/${type}`)
  }

  setPage = (index) => {
    this.setState({params: { ...this.state.params,pageIndex: index}},()=>{
      sessionStorage.setItem('pageIndex', index)
      this.getData()
    })
  }

  getLabel = () => {
    axios.get(`${URL}/admin/biddingPurchasing/listAllLabel`).then(res => {
      if (res.data.data) {
        this.setState({labelList: res.data.data})
      }
    })
  }
  chengeLabel = (e) => {
    this.setState({params: {...this.state.params,biddingPurchasingLabelIdList: e}}, () => {
      this.getData()
    })
  }

  // getData = (params = {}) => {
  //   api.newMedia.getWechatInfo(params).then(res => {

  //   })
  // }
  render(){
    const { selectedRowKeys } = this.state;
    let pagination = {...this.state.pagination,onChange: this.setPage, current: this.state.params.pageIndex}
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <div className='recruit-tips'>
        <p style={{fontWeight: 'bold',fontSize: '18px'}}>招聘招标/{this.state.name}</p>
        <Form layout="inline">
        <FormItem layout="inline">
        <Search
              placeholder="输入搜索"
              onSearch={value => this.search_value(value)}
              style={{ width: 140 }}
              maxLength={20}
            />
        </FormItem>
        <FormItem label="状态">
        <Select defaultValue={this.state.type} style={{ width: 120 }} onChange={this.typeChange}
              getPopupContainer={triggerNode => triggerNode.parentNode}>
              <Option value="ALL">全部</Option>
              <Option value="UNPUBLISH">未发布</Option>
              <Option value="PUBLISH">已发布</Option>
              {this.props.location.pathname.indexOf('recruitTips') !== -1? <Option value="TOP">已截止</Option> : null}
            </Select>
        </FormItem>
        {this.props.location.pathname.indexOf('recruitTips') !== -1? null:
          <FormItem label="分类">
            <Select mode="multiple" defaultValue={this.state.params.biddingPurchasingLabelIdList} style={{ width: 120 }} onChange={this.chengeLabel}
              getPopupContainer={triggerNode => triggerNode.parentNode}>
              {this.state.labelList.map(item => {
                return <Option value={item.id}>{item.nameZH}</Option>
              })}
            
            </Select>
          </FormItem>
        }
        <FormItem style={{float: 'right'}}>
            {
              this.state.permissionInfo.includes(`${this.state.urlType.toLocaleLowerCase()}:delete`) ?
                <span>
                  <Button className="search__button" type="danger" disabled={this.state.selectedRowKeys.length === 0} onClick={this.delData}>批量删除</Button>
                </span>
              :  null
            }
            {
              this.state.permissionInfo.includes(`${this.state.urlType.toLocaleLowerCase()}:publish`) ?
                <span>
                  <Button className="search__button" type="primary" disabled={this.state.selectedRowKeys.length === 0} onClick={()=>{this.publishData(this.state.selectedRowKeys,false)}}>批量取消发布</Button>
                  <Button className="search__button" type="primary" disabled={this.state.selectedRowKeys.length === 0} onClick={()=>{this.publishData(this.state.selectedRowKeys,true)}}>批量发布</Button>
                </span>
              :  null
            }
            {
              this.state.permissionInfo.includes(`${this.state.urlType.toLocaleLowerCase()}:create`) ?
                <span>
                  <Button className="search__button" type="primary" onClick={() => this.editor('NEW')}>新建</Button>
                </span>
              :  null
            }
            {/* <Button className="search__button" type="danger" disabled={this.state.selectedRowKeys.length === 0} onClick={this.delData}>批量删除</Button> */}
            {/* <Button className="search__button" type="primary" disabled={this.state.selectedRowKeys.length === 0} onClick={()=>{this.publishData(this.state.selectedRowKeys,false)}}>批量取消发布</Button>
            <Button className="search__button" type="primary" disabled={this.state.selectedRowKeys.length === 0} onClick={()=>{this.publishData(this.state.selectedRowKeys,true)}}>批量发布</Button> */}
            {/* <Button className="search__button" type="primary" onClick={() => this.editor('NEW')}>新建</Button> */}
          </FormItem>
        </Form>
        <Divider/>
        <Table
          rowKey="id"
          columns={sessionStorage.getItem('key') === '招聘启事'? this.columns.filter(item => {return item.title !== '标签'}) : this.columns.filter(item => {return item.title !== '截止时间'})}
          dataSource={this.state.data}
          rowSelection={rowSelection}
          pagination={pagination}
          loading={this.state.loading}
        />
      </div>
    )
  }

}
export default RecruitTips