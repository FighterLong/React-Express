// 普通用户管理
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



class ordinaryUser extends Component {
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
    pagination: {
      total: 10,
      pageSize: 10,
      defaultPageSize: 10,
    },
    params: {
      "keyword": "",
      "pageIndex": 1,
      "pageSize": 10,
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
    axios.post(`${URL}/admin/normalUser/retrieveList`,this.state.params).then(res => {
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
  // 新建用户
  addUser = () => {
      console.log('再次输入：'+this.state.password)
      console.log('密码：'+this.state.userInfo.password)
      if(this.state.password !== this.state.userInfo.password){
          message.error('两次密码不一致')
          return
      }
    axios.post(`${URL}/admin/normalUser/save`, this.state.userInfo).then(res => {
      if(res.data.code === 200) {
        message.success('添加成功');
        this.setState({userInfo: {
            "accountEmail": "",
            "createTime": 0,
            "name": "",
            "password": "",
            "sex": ""
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
    axios.get(`${URL}/admin/normalUser/delete?emails=${this.state.selectedRowKeys}`).then(res => {
      if(res.data.code === 200) {
        message.success('删除成功')
        this.setState({selectedRowKeys: []})
        this.getInfo()
      }else{
        message.error(res.data.msg)
      }
    })
  }
  // 修改用户
  updateUser = () => {
    axios.post(`${URL}/admin/normalUser/update`, this.state.userInfo).then(res => {
      if(res.data.code === 200) {
        message.success('保存成功');
        this.setState({userInfo: {
            "accountEmail": "",
            "createTime": 0,
            "name": "",
            "password": "",
            "sex": ""
          },upModel: false,resetModel: false},() => {
          this.getInfo()
        })
      }else{
        message.error(res.data.msg)
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
        "accountEmail": "",
        "createTime": 0,
        "name": "",
        "password": "",
        "sex": ""
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
    this.setState({userInfo: {...this.state.userInfo,sex: key}})
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
  render(){
    // let userGroupEl = []
    // this.state.userGroup.forEach(item => {
    //   userGroupEl.push(<Option value={item.id} key={item.id}>{item.roleName}</Option>)
    // })
    const columns = [{
        title: '账号',
        dataIndex: 'accountEmail',
        // render: text => <a href="javascript:;">{text}</a>,
      }, {
        title: '名称',
        dataIndex: 'name',
      }, {
        title: '性别',
        dataIndex: 'sex',
        // render:(text,record,index)=>(
        //   this.returnRank(text.roleId)
        // )
      }, {
        title: '创建时间',
        dataIndex: '',
        render:(text,record,index)=>(
          timeFillter(text.createTime,true)
        )
      }, {
        title: '操作',
        dataIndex: '',
        render: text => (<div><span style={{color: '#40a9ff',margin: '0 5px',cursor: 'pointer'}} onClick={()=>{this.updateModel(text)}}>编辑</span>
        <span style={{color: '#f5222d',margin: '0 5px',cursor: 'pointer'}} onClick={()=>{this.reset(text)}}>重置密码</span></div>),
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
            <Table  pagination={pagination} rowKey="accountEmail" rowSelection={rowSelection} columns={columns} dataSource={this.state.data} />
            {/* 编辑的弹窗 */}
            <Modal title="Title"
              visible={this.state.upModel}
              onOk={this.updateUser}
              confirmLoading={false}
              onCancel={this.close}
              {...modelPage}
              >
              <Form>
                <FormItem label="名称：" {...formItemLayout}>
                  <Input value={this.state.userInfo.name} name="name" onChange={this.setData}></Input>
                </FormItem> 
                <FormItem label="性别：" {...formItemLayout}>
                <Select value={this.state.userInfo.sex} style={{ width: 120 }} onChange={this.setSelect} 
                getPopupContainer={triggerNode => triggerNode.parentNode}>
                    <Option value="男士">男士</Option>
                    <Option value="女士">女士</Option>
                </Select>
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
                    <Input value={this.state.userInfo.accountEmail} name="accountEmail" onChange={this.setData}></Input>
                  </FormItem>
                  <FormItem label="名称：" {...formItemLayout}>
                    <Input value={this.state.userInfo.name} name="name" onChange={this.setData}></Input>
                  </FormItem>
                  <FormItem label="性别：" {...formItemLayout}>
                    <Select value={this.state.userInfo.sex} style={{ width: 120 }} onChange={this.setSelect}>
                        <Option value="男士">男士</Option>
                        <Option value="女士">女士</Option>
                    </Select>
                  </FormItem> 
                  <FormItem label="密码：" {...formItemLayout}>
                    <Input value={this.state.userInfo.password} type="password" name="password" onChange={this.setData}></Input>
                  </FormItem> 
                  <FormItem label="确认密码：" {...formItemLayout}>
                    <Input type="password" onChange={(e)=>{this.setState({password: e.target.value})}}></Input>
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
export default ordinaryUser
