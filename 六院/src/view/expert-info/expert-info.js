import React,{Component} from 'react'
import { Input, Button, Table, Select, Form, Divider, message} from 'antd';
import axios from 'axios'
import {timeFillter, statusFillter} from '../../common/js/public.js'

import './expert-info.styl'
import {URL} from '@/common/js/url.js'

const FormItem = Form.Item
const Search = Input.Search
const Option = Select.Option

let element = []

class expertInfo extends Component{
  columns=[
    {
      title:'专家姓名',
      dataIndex:'expertNameZH'
    },
    {
      title:'专家科室',
      dataIndex: '',
      width: '30%',
      render:(text,record,index)=>(
        <div>{(element = [],text.departments?text.departments:[]).forEach((item,index)=> {
          element.push(<span style={{marginRight: '8px'}} key={index}>{item.name}</span>)
        })}{element}</div>
        // <div>{typeof text.departments}</div>
      )
    },{
      title:'创建时间',
      dataIndex:'',
      render:(text,record,index)=>(
        text.createTime && timeFillter(text.createTime)
      )
    },{
      title:'发布时间',
      dataIndex: '',
      render:(text,record,index)=>(
        text.publishTime && timeFillter(text.publishTime)
      )
    },{
      title:'创建人',
      dataIndex:'creator'
    },{
      title:'状态',
      dataIndex:'',
      render:(text,record,index)=>(
        text.status && statusFillter(text.status)
      )
    },
    {
      title: '排序号',
      dataIndex: '',
      render:(text,record,index)=>(
          <div style={{cursor: 'pointer', color: '#1890ff'}}  onClick={() => {this.clickSEQ(text)}}>{this.state.seqShow === text.id ?
             <Input style={{width: '60px'}} value={this.state.seq} onInput={this.setSEQ} onBlur={() => {this.saveSEQ(text)}}/> : <span>{text.seq ? text.seq : 0}</span>}</div>
      )
    },{
      title:'操作',
      dataIndex:'',
      render:(text,record,index)=>(
        <span style={{whiteSpace: 'nowrap'}}>
          {
            this.state.permissionInfo.includes(`expert:update`) ? <a href="javascript:;" onClick={() => this.editor(text.id)}>编辑</a> : null
          }
          {
            text.status === 'PUBLISH' && this.state.permissionInfo.includes(`expert:publish`)
            ? <span><Divider type="vertical" /><a href="javascript:;" onClick={() => this.publishData([text.id],false)}>取消发布</a></span>
            : null
          }
          
          {
            text.status === 'UNPUBLISH' && this.state.permissionInfo.includes(`expert:publish`)
            ? <span><Divider type="vertical" /><a href="javascript:;" onClick={() => this.publishData([text.id],true)}>发布</a></span>
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
    selectedRowKeys: [],
    data: [],
    pagination: {
      total: 0
    },
    permissionInfo: [],
    params: {
      "keyword": "",
      "pageIndex": 1,
      "pageSize": 10,
      "appliedDepartmentPost": "",
      "status": "ALL",
      "type": ''
    }
  }

    componentDidMount() {
      // element = []
      this.setState({name:sessionStorage.getItem('key')})
      this.setState({permissionInfo: (JSON.parse(sessionStorage.getItem('permissionInfo'))?JSON.parse(sessionStorage.getItem('permissionInfo')):[]).map(item =>{
        return item ? item.toLocaleLowerCase() : item
      })})
      let pageIndex = sessionStorage.getItem('pageIndex') ? parseInt(sessionStorage.getItem('pageIndex')) : 1;
      this.setState({params: {...this.state.params, pageIndex}},()=>{
        this.getData(this.state.params)
        this.getRelativeDepartMent()
      })
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
      axios.post(`${URL}/admin/expert/update`,data).then(res => {
        if(res.data.code === 200){
          message.success('保存成功',1);
          this.getData(this.state.params);
          // this.goBack()
        }else{
          message.error(res.data.msg)
        }
      
        setTimeout(()=>{this.setState({seqShow:false})},500)
      }).catch(error => {message.error('异常请求');this.setState({ seqShow: false })})
    }
  // 切换状态
  typeChange = (value) => {
    // 改变state是异步过程  所以要通过回调获取数据
    this.setState({params: { ...this.state.params, status: value }},() => {
      this.getData(this.state.params);
    })
  }

  // 获取数据
  getData = (params) => {
    axios.post(`${URL}/admin/expert/retrieve`,params).then(res => {
      if(res.data.code === 200) {
        
        if (!res.data.data.content.length && this.state.params.pageIndex > 1) {
          this.setState({params: {...this.state.params,pageIndex: this.state.params.pageIndex - 1}}, () => {
            this.getData(this.state.params)
          })
          return
        }
        this.setState({
          data: res.data.data.content,
          pagination: {
            total: res.data.data.totalElements,
            pageSize: 10
          }
        })
        if (res.data.data.content && res.data.data.content[0] && res.data.data.content[0].seq) {
          sessionStorage.setItem('maxLength', res.data.data.content[0].seq)
        } else {
          sessionStorage.setItem('maxLength', 0)
        }
        // sessionStorage.setItem('maxLength', res.data.data.totalElements)
      }
    })
  }
  // 获取相关科室
  getRelativeDepartMent = () => {
    axios.get(`${URL}/admin/department/departmentReminder`).then(res => {
    if(res.data.code === 200 && res.data.data) {
        let option = []
        res.data.data.forEach((item,index)=>{
        option.push(<Option value={item.id} key={item.id}>{item.name}</Option>);
        })
        this.setState({option})
    }
    })
  }

  // 删除数据
  delData = (arr) => {
    axios.get(`${URL}/admin/expert/delete?ids=${arr}`).then(res => {
      if(res.data.code === 200){
        this.getData(this.state.params)
        this.setState({
          selectedRowKeys: []
        })
        message.success('删除成功',1) 
      }else {
        message.error(res.data.msg,1)
      }
    })
  }

  // 发布
  publishData = (arr,status) => {
    axios.get(`${URL}/admin/expert/publish?ids=${arr}&status=${status}`).then(res => {
      if(res.data.code === 200) {
        status ? message.success('发布成功') : message.success('取消发布成功')
        this.getData(this.state.params)
        this.setState({
          selectedRowKeys: []
        })
      }else {
        message.error(res.data.msg)
      }
    })
  }

  editor = (text) => {
    this.setState({modelData: text})
    this.setState({visible: true})
  }
  
  // 切换分页
  setPage = (index) => {
    this.setState({params: {...this.state.params,pageIndex: index}},()=>{
      sessionStorage.setItem('pageIndex', index)
      this.getData(this.state.params)
    })
  }

  // 新建/编辑
  editor = (type) => {
    this.props.history.push(`/expertInfoUpdate/${type}`)
  }
  render(){
    // const {selectedRowKeys} = this.state
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        // console.log(selectedRowKeys)
        this.setState({
          selectedRowKeys: selectedRowKeys
        })
        // console.log(selectedRowKeys)
        // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
    }
    let pagination = { ...this.state.pagination,onChange: this.setPage, current: this.state.params.pageIndex}
    return(
      <div className='expert-info'>
        <p style={{fontWeight: 'bold',fontSize: '18px'}}>{this.state.name}</p>
        <Form layout='inline'>
        <FormItem>
        <Search
              placeholder="输入搜索"
              onSearch={value => {this.setState({params: {...this.state.params,keyword: value,pageIndex: 1}},()=>{this.getData(this.state.params)})}}
              style={{ width: 140 }}
              getPopupContainer={triggerNode => triggerNode.parentNode}
              maxLength={20}
            />
        </FormItem>
        <FormItem label='科室'>
        <Select showSearch optionFilterProp={'children'} multiple style={{width:160}} onChange={(val) => {this.setState({params: {...this.state.params,departmentIds: `[${val}]`}},()=>{this.getData(this.state.params)})}}>
          {this.state.option}
        </Select>
        </FormItem>
        <FormItem label="类型">
            <Select defaultValue={this.state.type} style={{ width: 120 }} onChange={this.typeChange}>
              <Option value="ALL">全部</Option>
              <Option value="UNPUBLISH">未发布</Option>
              <Option value="PUBLISH">已发布</Option>
            </Select>
          </FormItem>
          <FormItem style={{float: 'right'}}>
            {
              this.state.permissionInfo.includes(`expert:delete`) ?
                <span>
                  <Button className="search__button" type="danger" disabled={this.state.selectedRowKeys.length === 0} onClick={()=>{this.delData(this.state.selectedRowKeys)}}>批量删除</Button>
                </span>
              :  null
            }
            {
              this.state.permissionInfo.includes(`expert:publish`) ?
                <span>
                <Button className="search__button" type="primary" disabled={this.state.selectedRowKeys.length === 0} onClick={()=>{this.publishData(this.state.selectedRowKeys,false)}}>批量取消发布</Button>
                <Button className="search__button" type="primary" disabled={this.state.selectedRowKeys.length === 0} onClick={()=>{this.publishData(this.state.selectedRowKeys,true)}}>批量发布</Button>
                </span>
              :  null
            }
            {
              this.state.permissionInfo.includes(`expert:create`) ?
                <span>
                  <Button className="search__button" type="primary" onClick={() => this.editor('NEW')}>新建</Button>
                </span>
              :  null
            }
            {/* <Button className="search__button" type="danger" disabled={this.state.selectedRowKeys.length === 0} onClick={()=>{this.delData(this.state.selectedRowKeys)}}>批量删除</Button> */}
            {/* <Button className="search__button" type="primary" disabled={this.state.selectedRowKeys.length === 0} onClick={()=>{this.publishData(this.state.selectedRowKeys,false)}}>批量取消发布</Button>
            <Button className="search__button" type="primary" disabled={this.state.selectedRowKeys.length === 0} onClick={()=>{this.publishData(this.state.selectedRowKeys,true)}}>批量发布</Button> */}
            {/* <Button className="search__button" type="primary" onClick={() => this.editor('NEW')}>新建</Button> */}
          </FormItem>
        </Form>
        <Divider/>
        <Table
          rowKey="id"
          columns={this.columns}
          dataSource={this.state.data}
          rowSelection={rowSelection}
          pagination={pagination}
          loading={this.state.loading}
        />
      </div>
    )
  }
}
export default expertInfo;