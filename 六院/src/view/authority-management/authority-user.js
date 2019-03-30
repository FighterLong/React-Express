import React,{Component} from 'react'
import {Form,  Upload, Button, Icon, Divider,Select,message,Checkbox, Table, Modal} from 'antd'
// import axios from 'axios'
import './authority-management.styl'
import {URL} from '@/common/js/url.js'
import { Input } from 'antd'
import axios from 'axios'
import {timeFillter} from '../../common/js/public.js'
const Search = Input.Search
// const Search = Input.SearCh
const FormItem = Form.Item
const {TextArea} = Input
const Option = Select.Option
// const URL = 'http://192.168.0.122:7979'



class authorityUser extends Component {
  state={
    selectedRowKeys: [],
    addModel: false,
    upModel: false,
    resetModel: false,
    isUpdate: false,// 判断是否为修改
    userGroup: [],// 用户组下拉
    data: [],
    pagination: {
      total: 10,
      pageSize: 10,
      defaultPageSize: 10,
    },
    newPass: '',
    newPass2: '',
    params: {
      "keyword": " ",
      "pageIndex": 1,
      "pageSize": 10,
    },
    userInfo: {
      "backupInstructions": "",
      "createTime": 0,
      "id": '',
      "nickname": "",
      "password": "",
      "roleId": "",
      "updateTime": 0,
      "username": ""
    }
  }

  componentDidMount(){
    this.setState({name:sessionStorage.getItem('key')})
    this.getInfo()
    this.getUserGroup()
  }

  /************************ 数据操作区 start **************************/
  // 获取数据
  getInfo = () => {
    axios.post(`${URL}/admin/user/retrieveList`,this.state.params).then(res => {
      if(res.data.code === 200) {
        if (!res.data.data.content.length && this.state.params.pageIndex) {
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
  // 获取用户组
  getUserGroup = () => {
    axios.post(`${URL}/admin/user/retrieveAllRoleList`).then(res => {
      if(res.status === 200) {
        let data = res.data || []
        this.setState({userGroup: data})
      }
    })
  }
  // 新建用户
  addUser = () => {
    axios.post(`${URL}/admin/user/create`, this.state.userInfo).then(res => {
      if(res.data.code === 200) {
        message.success('添加成功');
        this.setState({userInfo: {
          "backupInstructions": "",
          "createTime": 0,
          "id": '',
          "nickname": "",
          "password": "",
          "roleId": "",
          "updateTime": 0,
          "username": ""
        },addModel: false},() => {
          this.getInfo()
        })
      }else {
        message.error(res.data.msg)
      }
    })
  }
  // 删除用户
  delUser = () => {
    axios.get(`${URL}/admin/user/delete?ids=${this.state.selectedRowKeys}`).then(res => {
      if(res.data.code === 200) {
        message.success('删除成功')
        this.setState({selectedRowKeys: [] })
        this.getInfo()
      }else{
        message.error(res.data.msg)
      }
    })
  }
  // 修改用户
  updateUser = () => {
    if(this.state.newPass !== this.state.newPass2) {
      message.error('两次密码不一致')
      return
    }
    axios.post(`${URL}/admin/user/update`, this.state.userInfo).then(res => {
      if(res.data.code === 200) {
        message.success('保存成功');
        this.setState({userInfo: {
          "backupInstructions": "",
          "createTime": 0,
          "id": '',
          "nickname": "",
          "password": "",
          "roleId": "",
          "updateTime": 0,
          "username": ""
        },upModel: false,resetModel: false},() => {
          this.getInfo()
        })
      }else {
        message.error(res.data.msg);
      }
    })
  }
  
  // 弹框按钮确定时
  save = () => {
    if(this.state.isUpdate) {
      this.updateUser()
    }else{
      this.addUser()
    }
  }
  /************************ 数据操作区 end   **************************/
  // 关闭弹窗时的回调  初始化数据模板
  close = () => {
    this.setState({userInfo: {
      "backupInstructions": "",
      "createTime": 0,
      "id": '',
      "nickname": "",
      "password": "",
      "roleId": "",
      "updateTime": 0,
      "username": ""
    },addModel: false,upModel: false,resetModel: false,newPass: '',newPass2:''})
  }
  // 返回身份
  returnRank = (id) => {
    let str = ""
    this.state.userGroup.forEach(item => {
      item.id === id && (str = item.roleName)
    })
    return str
  }
  // 编辑时弹窗显示
  updateModel = (data) => {
    this.setState({upModel: true,userInfo: data})
  }
  reset = (data) => {
    this.setState({resetModel: true,userInfo: data})
  }
  savePass = () => {
    if(this.state.newPass !== this.state.newPass2) {
      message.error('两次密码不一致')
      return
    }
    this.setState({userInfo: {...this.state.userInfo,password: this.state.newPass}}, () => {
      this.updateUser()
    })
  }
  /************************ 数据双向绑定区 start  ***************************/
  // 输入框 用户名和描述
  setData = (e) => {
    this.setState({userInfo: {...this.state.userInfo,[e.target.name]:e.target.value}})
  }
  // 设置下拉框
  setSelect = (key) => {
    this.setState({userInfo: {...this.state.userInfo,roleId: key}})
  }
  // 设置密码
  setPass = (e) => {
    this.setState({...this.state,[e.target.name]:e.target.value})
  }
  //设置分页
  setPage = (pageIndex) => {
    this.setState({params: {...this.state.params,pageIndex: pageIndex}},()=>{this.getInfo()})
  }
  /************************ 数据双向绑定区 end    ***************************/
  // checkBox
  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  }
  setselectedRowKeys = (selectedRowKeys, selectedRows) => {
    let arr = []
    selectedRows.forEach(item => {
      arr.push(item.id)
    })
    this.setState({
      selectedRowKeys: arr
    })
  }
  render(){
    let userGroupEl = []
    this.state.userGroup.forEach(item => {
      userGroupEl.push(<Option value={item.id} key={item.id}>{item.roleName}</Option>)
    })
    const columns = [{
        title: '账号',
        dataIndex: 'username',
        // render: text => <a href="javascript:;">{text}</a>,
      }, {
        title: '名称',
        dataIndex: 'nickname',
      }, {
        title: '身份权限',
        dataIndex: '',
        render:(text,record,index)=>(
          this.returnRank(text.roleId)
        )
      }, {
        title: '创建时间',
        dataIndex: '',
        render:(text,record,index)=>(
          timeFillter(text.createTime,true)
        )
      }, {
        title: '备注说明',
        dataIndex: '',
        render:(text,record,index)=>(
          (<div style={{maxWidth: '120px'}}>{text.backupInstructions}</div>)
        )
      }, {
        title: '操作',
        dataIndex: '',
        render: text => (<div><span style={{color: '#40a9ff',margin: '0 5px',cursor: 'pointer'}} onClick={()=>{this.updateModel(text)}}>编辑</span></div>),
      }];
      
  
    const rowSelection = {
        onChange: this.onSelectChange,
        getCheckboxProps: record => ({
          disabled: record.name === 'Disabled User', // Column configuration not to be checked
          name: record.name,
        }),
    };
    const modelPage = {
        title: '编辑用户',
        width: 400,
        cancelText: '取消',
        okText: '确定'
    }
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 },
    }
    const pagination = {...this.state.pagination,onChange: this.setPage}
    return(
        <section className="authorityUser">
            <p style={{fontWeight: 'bold',fontSize: '18px'}}>权限管理/{this.state.name}</p>
            <div className="authorityUser-top">
              <Search
                placeholder="搜索关键字"
                onSearch={value => this.setState({params: {...this.state.params,keyword: value,pageIndex: 1}},() => {this.getInfo()})}
                style={{ width: 200 }}/>
              <div className="top-btn-list">
                <Button type="danger" disabled={this.state.selectedRowKeys.length === 0 ? true : false} onClick={this.delUser}>批量删除</Button>
                <Button type="primary" onClick={()=>{this.setState({addModel: true})}}>新建用户</Button>
              </div>
            </div>
            <Table pagination={pagination} rowKey="id" rowSelection={rowSelection} columns={columns} dataSource={this.state.data} />
            {/* 编辑的弹窗 */}
            <Modal title="Title"
              visible={this.state.upModel}
              onOk={this.savePass}
              confirmLoading={false}
              onCancel={this.close}
              {...modelPage}
              >
              <Form>
                <FormItem label="名称：" {...formItemLayout}>
                  <Input value={this.state.userInfo.nickname} name="nickname" onChange={this.setData}></Input>
                </FormItem> 
                <FormItem label="身份权限：" {...formItemLayout}>
                <Select value={this.state.userInfo.roleId} style={{ width: 120 }} onChange={this.setSelect}
                getPopupContainer={triggerNode => triggerNode.parentNode}>
                  {userGroupEl}
                </Select>
                </FormItem>
                <FormItem label="重置密码：" {...formItemLayout}>
                    <Input value={this.state.newPass} name="newPass" type="password" onChange={this.setPass}></Input>
                  </FormItem>
                  <FormItem label="再次输入：" {...formItemLayout}>
                    <Input value={this.state.newPass2} name="newPass2" type="password" onChange={this.setPass}></Input>
                  </FormItem> 
                <FormItem label="备注说明：" {...formItemLayout}>
                  <TextArea rows={4} value={this.state.userInfo.backupInstructions} name="backupInstructions" onChange={this.setData}/>
                </FormItem> 
              </Form>
             </Modal>
             {/* 新建的弹窗 */}
             <Modal title="Title"
                visible={this.state.addModel}
                onOk={this.addUser}
                confirmLoading={false}
                onCancel={this.close}
                {...modelPage}
                title = "新建用户"
                >
                <Form>
                  <FormItem label="账号：" {...formItemLayout}>
                    <Input value={this.state.userInfo.username} name="username" onChange={this.setData}></Input>
                  </FormItem>
                  <FormItem label="名称：" {...formItemLayout}>
                    <Input value={this.state.userInfo.nickname} name="nickname" onChange={this.setData}></Input>
                  </FormItem>
                  <FormItem label="密码：" {...formItemLayout}>
                    <Input value={this.state.userInfo.password} type="password" name="password" onChange={this.setData}></Input>
                  </FormItem> 
                  <FormItem label="身份权限：" {...formItemLayout}>
                  <Select value={this.state.userInfo.roleId} style={{ width: 120 }} onChange={this.setSelect}>
                    {userGroupEl}
                  </Select>
                  </FormItem> 
                  <FormItem label="备注说明：" {...formItemLayout}>
                    <TextArea rows={4} value={this.state.userInfo.backupInstructions} name="backupInstructions" onChange={this.setData}/>
                  </FormItem> 
                </Form>
             </Modal>
             {/* 重置密码 */}
             <Modal title="Title"
                visible={this.state.resetModel}
                onOk={this.savePass}
                confirmLoading={false}
                onCancel={this.close}
                {...modelPage}
                title = "重置密码"
                >
                <Form>
                  <FormItem label="新密码：" {...formItemLayout}>
                    <Input value={this.state.newPass} name="newPass" type="password" onChange={this.setPass}></Input>
                  </FormItem>
                  <FormItem label="再次输入：" {...formItemLayout}>
                    <Input value={this.state.newPass2} name="newPass2" type="password" onChange={this.setPass}></Input>
                  </FormItem> 
                </Form>
             </Modal>
        </section>
    )
  }
}
export default authorityUser
