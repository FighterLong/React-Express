// 普通用户管理
import React,{Component} from 'react'
import {Button, Select,message, Table} from 'antd'
// import axios from 'axios'
import './authority-management.styl'
import {URL} from '@/common/js/url.js'
import { Input } from 'antd'
import axios from 'axios'
import {timeFillter} from '../../common/js/public.js'
const Search = Input.Search
// const Search = Input.SearCh
const Option = Select.Option
// const URL = 'http://192.168.0.122:7979'



class LoginLog extends Component {
  state={
    selectedRowKeys: [],
    addModel: false,
    upModel: false,
    resetModel: false,
    isUpdate: false,// 判断是否为修改
    userGroup: [],// 用户组下拉
    data: [],
    newPass: '',
    newPass2: '',
    password: '',
    params: {
      "keyword": "",
      "pageIndex": 1,
      "pageSize": 10,
      "type": "全部"
    },
    userInfo: {
      "accountEmail": "",
      "createTime": 0,
      "name": "",
      "password": "",
      "sex": ""
    },
    pagination: {}
  }

  componentDidMount(){
    this.setState({name:sessionStorage.getItem('key')})
    this.getInfo()
  }

  /************************ 数据操作区 start **************************/
  // 获取数据
  getInfo = () => {
    axios.post(`${URL}/admin/logManagement/loginLog/retrieveList`,this.state.params).then(res => {
      if(res.data.code === 200) {
        if (!res.data.data.content.length && this.state.params.pageIndex > 1) {
          this.setState({params: {...this.state.params, pageIndex: this.state.params.pageIndex - 1}}, () => {
            this.getInfo()
          })
          return
        }
        this.setState({data: res.data.data.content,
          pagination: {
            total: res.data.data.totalElements,
            pageSize: 10
          }})
      }
    })
  }
  // 删除用户
  delUser = () => {
    axios.get(`${URL}/admin/logManagement/loginLog/delete?ids=${this.state.selectedRowKeys}`).then(res => {
      if(res.data.code === 200) {
        message.success('删除成功')
        this.setState({selectedRowKeys: []},()=>{ this.getInfo() })
      }else{
        message.error(res.data.msg)
      }
    })
  }
  /************************ 数据操作区 end   **************************/
  /************************ 数据双向绑定区 start  ***************************/
  changeType = (value) => {
    this.setState({params: {...this.state.params,type: value,pageIndex: 1}},() => {this.getInfo()})
  }
  setPage = (index) => {
    this.setState({params: {...this.state.params,pageIndex: index}},() => {this.getInfo()})
  }
  checkBox = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRowKeys: selectedRowKeys
    })
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  }
  /************************ 数据双向绑定区 end    ***************************/

  render(){
    
    let pagination = {...this.state.pagination,onChange: this.setPage}
    const columns = [{
        title: '管理员',
        dataIndex: 'user'
      }, {
        title: '状态',
        dataIndex: '',
        render:(text,record,index)=>(
          text.logName === '登录成功' ? '登陆' :'退出'
        )

      }, {
        title: 'IP',
        dataIndex: 'ip'
      }, {
        title: '时间',
        dataIndex: '',
        render:(text,record,index)=>(
          timeFillter(text.createTime,true)
        )
      }];
      
    const rowSelection = {
        onChange:this.checkBox,
    };
    return(
        <section className="authorityUser">
            <p style={{fontWeight: 'bold',fontSize: '18px'}}>日志管理/{this.state.name}</p>
            <div className="authorityUser-top">
              <div>
                <Search
                    placeholder="搜索关键字"
                    onSearch={value => this.setState({params: {...this.state.params,keyword: value,pageIndex: 1}},() => {this.getInfo()})}
                    style={{ width: 200 }}/>
                <Select value={this.state.params.type} onChange={this.changeType} style={{width: '150px',marginLeft: '20px'}}
                getPopupContainer={triggerNode => triggerNode.parentNode}>
                    <Option value="全部">全部</Option>
                    <Option value="登陆">登陆</Option>
                    <Option value="退出">退出</Option>
                </Select>
              </div>
              <div className="top-btn-list">
                <Button type="danger" disabled={this.state.selectedRowKeys.length === 0 ? true : false} onClick={this.delUser}>批量删除</Button>
                {/* <Button type="primary">导出Excel</Button> */}
              </div>
            </div>
            <Table rowSelection={rowSelection} 
            rowKey="id"
            pagination={pagination} columns={columns} dataSource={this.state.data} />
        </section>
    )
  }
}
export default LoginLog
