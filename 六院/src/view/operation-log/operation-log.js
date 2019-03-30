// 普通用户管理
import React,{Component} from 'react'
import { Button, Select,message, Table, Modal} from 'antd'
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



class OperationLog extends Component {
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
    pagination:{},
    content: '',
    model: false,
    params: {
      "keyword": "",
      "pageIndex": 1,
      "pageSize": 10,
      "type": ""
    },
    userInfo: {
      "accountEmail": "",
      "createTime": 0,
      "name": "",
      "password": "",
      "sex": ""
    }
  }

  componentDidMount(){
    this.setState({name:sessionStorage.getItem('key')})
    this.getInfo()
  }

  /************************ 数据操作区 start **************************/
  // 获取数据
  getInfo = () => {
    axios.post(`${URL}/admin/logManagement/operationLog/retrieveList`,this.state.params).then(res => {
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
    axios.get(`${URL}/admin/logManagement/operationLog/delete?ids=${this.state.selectedRowKeys}`).then(res => {
      if(res.data.code === 200) {
        message.success('删除成功')
        this.setState({selectedRowKeys: []},()=>{ this.getInfo() })
      }else{
        message.error(res.data.msg)
      }
    })
  }
  // 查看内容
  queryContent = (id) => {
    this.props.history.push(`/Message/${id}`)
    // axios.get(`${URL}/admin/logManagement/operationLog/retrieveOne?id=${id}`).then(res => {
    //   if(res.data.code === 200) {
    //     this.setState({content: res.data.data.content,model: true})
    //   }
    // })
  }
  /************************ 数据操作区 end   **************************/
  /************************ 数据双向绑定区 start  ***************************/
  changeType = (value) => {
    this.setState({params: {...this.state.params,type: value,pageIndex: 1}},() => {this.getInfo()})
  }
  setPage = (index) => {
    this.setState({params: {...this.state.params,pageIndex: index}},() => {this.getInfo()})
  }
  /************************ 数据双向绑定区 end    ***************************/

  render(){
    // let userGroupEl = []
    // this.state.userGroup.forEach(item => {
    //   userGroupEl.push(<Option value={item.id} key={item.id}>{item.roleName}</Option>)
    // })
    let pagination = {...this.state.pagination,onChange: this.setPage}
    const columns = [{
        title: '管理员',
        dataIndex: 'user',
        // render: text => <a href="javascript:;">{text}</a>,
      }, {
        title: '栏目',
        dataIndex: 'logName',
      }, {
        title: '类型',
        dataIndex: 'logType',
      }, 
      // {
      //   title: '数据表',
      //   dataIndex: 'name',
      // }, {
      //   title: '数据主键',
      //   dataIndex: 'name',
      // }, 
      {
        title: 'IP',
        dataIndex: 'ip',
        // render:(text,record,index)=>(
        //   this.returnRank(text.roleId)
        // )
      }, {
        title: '时间',
        dataIndex: '',
        render:(text,record,index)=>(
          timeFillter(text.createTime,true)
        )
      }, {
        title: '操作',
        dataIndex: '',
        render: text => (<div><span style={{color: '#40a9ff',margin: '0 5px',cursor: 'pointer'}} onClick={()=>{this.queryContent(text.id)}}>查看</span></div>),
      }];
      
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
          this.setState({
            selectedRowKeys: selectedRowKeys
          })
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        getCheckboxProps: record => ({
          disabled: record.name === 'Disabled User', // Column configuration not to be checked
          name: record.name,
        }),
    };
    // const formItemLayout = {
    //     labelCol: { span: 6 },
    //     wrapperCol: { span: 16 },
    // }
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
                    <Option value="">全部</Option>
                    <Option value="添加">添加</Option>
                    <Option value="修改">修改</Option>
                    <Option value="删除">删除</Option>
                    <Option value="发布">发布</Option>
                    {/* <Option value="取消发布">取消发布</Option> */}
                    <Option value="置顶">置顶</Option>
                    {/* <Option value="取消置顶">取消置顶</Option> */}
                    {/* <Option value="回复">回复</Option> */}
                    {/* <Option value="审核">审核</Option> */}
                    <Option value="导出">导出</Option>
                    <Option value="授权">授权</Option>
                    <Option value="复制">复制</Option>
                </Select>
              </div>
              <div className="top-btn-list">
                <Button type="danger" disabled={this.state.selectedRowKeys.length === 0 ? true : false} onClick={this.delUser}>批量删除</Button>
                {/* <Button type="primary">导出Excel</Button> */}
              </div>
            </div>
            <Table rowSelection={rowSelection}
            pagination={pagination}
            rowKey="id" columns={columns} dataSource={this.state.data} />
            <Modal
              width={'60%'}
              height={'80%'}
              title="查看内容"
              visible={this.state.model}
              onOk={()=>{this.setState({model: false})}}
              onCancel={()=>{this.setState({model: false})}}
              okText="确定"
              cancelText="取消"
              // content={}
            >
              <div dangerouslySetInnerHTML={{ __html: this.state.content }}></div>
              {/* {this.state.content} */}
            </Modal>
        </section>
    )
  }
}
export default OperationLog
