import React,{ Component } from 'react';
import { Input, Button, Table, Select, Form, Divider,message,DatePicker, Modal} from 'antd';
import api from '@/api/index.js'
import {timeFillter} from '../../common/js/public.js'
import {administrative, claim, education} from './data.js'

import './science-reader.styl'
import { spawn } from 'child_process';
import Axios from 'axios';
import {URL} from '@/common/js/url.js'

const FormItem = Form.Item;
const Search = Input.Search;

const Option = Select.Option

// const URL = 'http://192.168.0.122:7979'

class Talents extends Component{
  columns=[
    {
      title:'招聘主题',
    dataIndex: 'title',
    width: '25%'
    },{
      title:'姓名',
      dataIndex:'applicantName',
    //   render:(text,record,index)=>(
    //     timeFillter(text.leaveTime,true)
    //   )
    },{
      title:'应聘科室/岗位',
      dataIndex:'',
      render:(text,record,index)=>(
        <div>{text.appliedDepartment}/{text.appliedPost}</div>
      )
    },{
      title:'身高',
      dataIndex:'',
      render:(text,record,index)=>(
        <div>{text.height}cm</div>
      )
    },{
      title:'学历',
      dataIndex:'',
      render:(text,record,index)=>(
        <div>{text.form.highestDegree}</div>
      )
    },{
      title:'手机',
      dataIndex:'cellPhoneNumber'
    },{
        title:'申请时间',
        dataIndex:'',
        render:(text,record,index)=>(
          text.applicationTime && timeFillter(text.applicationTime,true)
        )
    },{
        title:'资格审查结果',
        dataIndex:'qualificationResult'
    },{
        title:'录取结果',
        dataIndex:'admissionResult'
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
    departmentType: 'departmentAdmin',
    name: '',
    selectedRowKeys: [],
    getListParams:{
      keyword:'',
      pageIndex:1,
      pageSize:15,
      status:'ALL'
    },
    data: [],
    // params: {
    //   "keyword": " ",
    //   "pageIndex": 1,
    //   "pageSize": 10,
    //   "appliedDepartmentPost": '',
    //   "status": "",//UNREPLY未回复REPLY已回复
    // },
    params: {
      "deadlineTime": 0,
      "departmentIds": "",
      "departmentRequirement": "",
      "keyword": " ",
      "pageIndex": 1,
      "pageSize": 10,
      "requiredDegreeList": [],
      "tallerThan158CM": false,
    },
    pagination: {
      total: 200
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
    this.setState({params:Object.assign({},this.state.params,{keyword:value,pageIndex: 1})},()=>{
        this.getInfo()
    })
  }

  // 获取数据
  getInfo=()=>{
    Axios.post(`${URL}/admin/employmentApplication/retrieveList`,this.state.params).then(res=>{
      if (res.data.data && !res.data.data.content.length && this.state.params.pageIndex) {
        this.setState({params: {...this.state.params, pageIndex: this.state.params.pageIndex}})
        return
      }
      this.setState({data:res.data.data.content})
      this.setState({pagination: {...this.state.pagination, total: res.data.data.totalElements}})
      console.log(res)
    }).catch(error => {
      message.error('请求异常')
    })
  }
  
  // 删除数据
  delData = () => {
    Axios.post(`${URL}/admin/employmentApplication/delete?ids=${this.state.selectedRowKeys}`).then(res => {
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

  // 导出Excel
  exportExcel = () => {
        window.open(`${URL}/admin/employmentApplication/expert?ids=${this.state.selectedRowKeys}`)
  }
  // 获取标签
  getLabel = () => {}

  /********************************* 数据操作区 end *****************************/
  // editor = (text) => {
  //   this.setState({modelData: text})
  //   this.setState({visible: true})
  // }
  /********************************* 其他操作 start *****************************/
  // 新建/编辑  跳转
  editor = (type) => {
    this.props.history.push(`/TalentsEditor/${type}`)
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

  
  handleChange = (value) => { // 岗位要求
    // let arr = `[${value.toString()}]`
    // arr = arr.length === 2?"":arr
    this.setState({
      params:{...this.state.params,jobRequirement: value.toString()}
    }, () => {
      this.getInfo('')
    })
  }
  handleChange2 = (value) => { // 岗位要求
    this.setState({
      params:{...this.state.params,departmentRequirement: value.toString()}
    }, () => {
      this.getInfo('')
    })
  }
  handleChange3 = (value) => { // 岗位要求
    // console.log(`selected ${value}`);
    // let arr = `[${value.toString()}]`
    // arr = arr.length === 2?"":arr
    this.setState({
      params:{...this.state.params,requiredDegreeList: value}
    }, () => {
      this.getInfo('')
    })
  }
  changeHeight = (value) => {
    this.setState({
      params:{...this.state.params,tallerThan158CM: value}
    }, () => {
      this.getInfo('')
    })
  }
  changeTime = (e) => {
    let time = new Date(e).getTime()
    this.setState({params: {...this.state.params, deadlineTime: time}}, () => {
      this.getInfo('')
    })
  }
  
  render(){
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
    let pagination  = {...this.state.pagination,onChange: this.setPageIndex, current: this.state.params.pageIndex}
    const educationList = [];
    education.forEach(function(item){
        educationList.push(<Option key={item}>{item}</Option>);
    })
    const administrativeList = [];
    administrative[this.state.departmentType].forEach(function(item) {
        administrativeList.push(<Option key={item}>{item}</Option>);
    })

    const claimList = [];
    claim.forEach(function(item){
        claimList.push(<Option key={item}>{item}</Option>);
    })
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
          {/* <FormItem>
            <Search
                placeholder="输入应聘科室/岗位搜索"
                onSearch={value => {this.setState({params: {...this.state.params,appliedDepartmentPost: value,pageIndex: 1}},()=>{this.getInfo()})}}
                style={{ width: 200 }}
                getPopupContainer={triggerNode => triggerNode.parentNode}
                maxLength={20}
              />
          </FormItem> */}
          <FormItem label="状态">
            <Select defaultValue={this.state.params.status} style={{ width: 120 }} onChange={this.typeChange}
              getPopupContainer={triggerNode => triggerNode.parentNode}>
              <Option value="">全部</Option>
              <Option value="0">待定</Option>
              <Option value="1">已通过</Option>
              <Option value="2">未通过</Option>
              <Option value="3">已录取</Option>
              <Option value="4">未录取</Option>
            </Select>
          </FormItem>
          <FormItem label="学历">
            <Select defaultValue={this.state.params.status}
            
            value={this.state.params.requiredDegreeList || []}
            onChange={this.handleChange3} style={{ width: 120 }} 
            
            mode="multiple"
              getPopupContainer={triggerNode => triggerNode.parentNode}>
              {educationList}
            </Select>
          </FormItem>
          <FormItem label="毕业年限">
            <DatePicker onChange={this.changeTime}/>
          </FormItem>
          <FormItem label="身高">
            <Select defaultValue={this.state.params.tallerThan158CM} style={{ width: 120 }} onChange={this.changeHeight}
              getPopupContainer={triggerNode => triggerNode.parentNode}>
              <Option value={false}>全部</Option>
              <Option value={true}>158cm以上</Option>
            </Select>
          </FormItem>
          {/* <div></div> */}
          <FormItem label="岗位类别">
            <Select
                mode="multiple"
                style={{ width: '230px' }}
                placeholder="请选择岗位类别"
                value={this.state.params.jobRequirement || []}
                onChange={this.handleChange}
                getPopupContainer={triggerNode => triggerNode.parentNode}
            >
                {claimList}
            </Select>
          </FormItem>
          <FormItem label="用人科室">
            <Select
                style={{ width: '120px' }}
                placeholder="科室类别"
                optionFilterProp={'children'}
                getPopupContainer={triggerNode => triggerNode.parentNode}
                >
                  <Option key="departmentAdmin">管理类科室</Option>
                  <Option key="departmentky">科研机构</Option>
                  <Option key="departmentzy">专业科室</Option>
                </Select>
            <Select
                    // mode="multiple"
                    mode="tags"
                    style={{ width: '200px' }}
                    placeholder="请选择用人科室"
                    optionFilterProp={'children'}
                    value={this.state.params.departmentRequirement || []}
                    onChange={this.handleChange2}
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                >
                    {administrativeList}
                </Select>
              </FormItem>
              <div>
              <Button style={{marginLeft: '15px'}} type="danger" disabled={this.state.selectedRowKeys.length === 0} onClick={this.examineData}>批量审核</Button>
              <Button style={{marginLeft: '15px'}} type="danger" disabled={this.state.selectedRowKeys.length === 0} onClick={this.delData}>批量删除</Button>
              <Button style={{marginLeft: '15px'}} type="primary" disabled={this.state.selectedRowKeys.length === 0} onClick={this.exportExcel}>批量导出Excel</Button>
              </div>
        </Form>
        <Divider />
        <Table
          rowKey="id"
          scroll={{ x: 1500 }}
          columns={this.columns}
          dataSource={this.state.data}
          rowSelection={rowSelection}
          pagination={pagination}
          loading={this.state.loading}
        />

        <Modal
          visible={false}
          title="批量审核"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>Return</Button>,
            <Button key="submit" type="primary" loading={this.state.loading} onClick={this.handleOk}>
              Submit
            </Button>,
          ]}
        >
        </Modal>
      </div>
    );
  }
}

export default Talents;
