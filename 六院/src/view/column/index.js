import React, {Component} from 'react'
import {Divider, Table, Icon, Form, InputNumber, Input, Popconfirm, TreeSelect, Button, Modal,message } from 'antd'
import axios from 'axios'
import {URL} from '@/common/js/url.js'
import { withRouter } from 'react-router-dom'
import Exit from '@/component/exit.js'

const FormItem = Form.Item;

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);
const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };
  render() {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      ...restProps
    } = this.props;
    return (
      <EditableContext.Consumer>
        {(form) => {
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {form.getFieldDecorator(dataIndex, {
                    rules: [{
                      required: title === '模块中文名',
                      message: `Please Input ${title}!`,
                    }],
                    initialValue: record[dataIndex],
                  })(this.getInput())}
                </FormItem>
              ) : restProps.children}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}

const AddModalForm = Form.create()(
  class extends Component {
    render () {
      const { visible, onOk, onCancel, form,flag } = this.props;
      const { getFieldDecorator } = form;

      return (
        <Modal
          title="增加模块"
          visible={visible}
          onOk={onOk}
          onCancel={onCancel}
          okText={flag? "下一步" : "确认"}
          cancelText="取消"
        >
          <Form>
            <FormItem
              label={flag? '网站中文名':'模块中文名：'}
            >
              {getFieldDecorator('navbarNameZH', {
                rules: [{ required: true, message: '请输入中文名' }],
              })(
                <Input placeholder="请输入模块中文名" maxLength={10} />
              )}
            </FormItem>
            <FormItem
              label={flag? '网站英文名':'模块英文名：'}>
              {getFieldDecorator('navbarNameUS', {
                rules: [{ required: true, message: '请输入英文名' }],
              })(
                <Input placeholder="不输入则客户端英文模块不显示"  maxLength={20} />
              )}
            </FormItem>
          </Form>
        </Modal>
      )
    }
  }
)

class ColumnManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addModalVisible: false,
      addModalTwon: false,
      editingKey: '',
      treeData: [],
      treeValue: '',
      isExit: false,
      isSave: false,
      curData: {},
      data: [],
      tempList: [{navbarNameZH: '',navbarNameUS: ''},{navbarNameZH: '',navbarNameUS: ''},{navbarNameZH: '',navbarNameUS: ''},{navbarNameZH: '',navbarNameUS: ''},{navbarNameZH: '',navbarNameUS: ''}],
      type: '',// 记录是否为二级或三级
      belong: '',// 记录属于哪一个大模块  用于保存时区分不同接口
    };
    this.columns = [
      {
        title: '模块中文名',
        dataIndex: 'navbarNameZH',
        width: '40%',
        editable: true,
      },
      {
        title: 'Module English Name',
        dataIndex: 'navbarNameUS',
        width: '40%',
        editable: true,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record, index) => {
          const editable = this.isEditing(record);
          return (
            <div>
              <Button style={{marginRight: '5px'}} onClick={() => {this.setIndex(index, -1)}}><Icon type="arrow-up" theme="outlined" /></Button>  
              <Button style={{marginRight: '5px'}}  onClick={() => {this.setIndex(index, 1)}}><Icon type="arrow-down" theme="outlined" /></Button>  
              {editable ? (
                <span>
                  <EditableContext.Consumer>
                    {form => (
                      <a
                        href="javascript:;"
                        onClick={() => this.save(form, record.id, index)}
                        style={{ marginRight: 8 }}
                      >
                        保存
                      </a>
                    )}
                  </EditableContext.Consumer>
                  <Popconfirm
                    title="确定要取消吗?"
                    okText="确定"
                    cancelText="取消"
                    onConfirm={() => this.cancel(record.id)}
                    onCancel={() => this.cancel()}
                  >
                    <a>取消</a>
                  </Popconfirm>
                </span>
              ) : (
                <span>
                  <a onClick={() => this.edit(record.id)}>编辑</a><Divider type="vertical" />
                  <Popconfirm
                    title="确定要删除吗?"
                    okText="确定"
                    cancelText="取消"
                    onConfirm={() => this.deleteItem(record, index)}
                    onCancel={() => this.cancel(record.id)}
                  >
                    {this.state.curData.flag === '专题网站' ? null : <a>删除</a>}
                  </Popconfirm>
                </span>
              )}
            </div>
          );
        },
      },
    ];
  }

  deleteItem = (record, index) => {
    const {data} = this.state
    data.splice(index, 1)
    this.setState({data, isExit: true})
    // api.navBar.DeleteColumenChild(record.id).then(res => {
    //   if (res.code !== 200) return false
    //   data.splice(index, 1)
    //   this.setState({data})
    // })
  }
  setIndex = (index, num) => {
    let data = this.state.data
    if(index+num < 0 ) {
      // console.log('到头了')
      return
    } else if (index + num >= data.length) {
      // console.log('到底了')
      return
    }
    let arr = data[index]
    data[index] = data[index+num]
    data[index+num] = arr
    this.setState({data: data})
  }
  isEditing = (record) => {
    return record.id === this.state.editingKey;
  };
  edit(id) {
    this.setState({ editingKey: id, isSave: true});
  }
  save(form, id, index) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      
      const newData = [...this.state.data];
      const index = newData.findIndex(item => id === item.id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({ data: newData, isExit: true, editingKey: '', isSave: false});
      } else {
        newData.push(this.state.data);
        this.setState({ data: newData, isExit: true, editingKey: '', isSave: false});
      }
    });
  }
  cancel = () => {
    this.setState({ editingKey: '', isSave: false});
  };
  treeChange = (treeValue, node, extra) => {
    // console.log(treeValue)
    // console.log(node)
    // console.log(treeValue)
    if (!treeValue) return
    this.setState({ treeValue,type: extra.triggerNode.props.type,belong: extra.triggerNode.props.belong, curData: extra.triggerNode.props}, () => {
      console.log(this.state.curData)
      this.getColumenChild(treeValue)
    });
    
  }
  
  // 格式化树的数据格式
  setTreeData = (arr,str,belong, flag) => {
    arr.forEach(item=>{
      item.key = item.id
      item.value = item.id+''
      item.label = item.name
      // item.children = item.submenu
      item.type = str
      item.belong = belong
      if (flag) {
        item.flag = flag
      }
      // if(item.submenu.length) {
      //   this.setTreeData(item.submenu,'THIRD',belong)
      // }
    })
  }

  // 获取栏目列表
  getColumenList = () => {
    axios.get(`${URL}/admin/navbar/openGetManagementHomeNavbar`).then(res=>{
      let navList = []
      res.data.data.forEach(item=>{
        if(item.name === '医院概况'){
          navList.push({
            key: item.id,
            value: item.id+'',
            label: item.name,
            type: 'SECOND',
            belong: item.name
          })
        }else if(item.name === '科室导航'){
          this.setTreeData(item.submenu, 'THIRD',item.name)
          navList.push({
            key: item.id,
            value: item.id+'',
            label: item.name,
            children: item.submenu,
            type: 'SECOND',
            belong: item.name
          })
        }else if(item.name === '科研'){
          this.setTreeData(item.submenu, 'THIRD',item.name)
          navList.push({
            key: item.id,
            value: item.id+'',
            label: item.name,
            children: item.submenu,
            type: 'SECOND',
            belong: item.name
          })
        }else if(item.name === '教学'){
          this.setTreeData(item.submenu, 'THIRD',item.name)
          navList.push({
            key: item.id,
            value: item.id+'',
            label: item.name,
            children: item.submenu,
            type: 'SECOND',
            belong: item.name
          })
        }else if(item.name === '招聘招标') {
          navList.push({
            key: item.submenu[1].id,
            value: item.submenu[1].id+'',
            label: item.submenu[1].name,
            type: 'THIRD',
            belong: item.submenu[1].name
          })
        } else if(item.name === '专题网站') {
          this.setTreeData(item.submenu, 'THIRD',item.name, '专题网站')
          navList.push({
            key: item.id,
            value: item.id+'',
            label: item.name,
            children: item.submenu,
            type: 'SECOND',
            belong: item.name
          })
          console.log(navList)
          console.log(item.name === '专题网站')
        }
      })
      this.setState({treeData: navList})
    })
  }
  
  // 获取栏目下的子模块
  getColumenChild = (parentId) => {
    axios.get(`${URL}/admin/navbar/exportChild?parentId=${parentId}`).then(res=>{
      // console.log(this.state.curData)
      let data = res.data.data
      if (this.state.curData.flag === '专题网站') {
        for (var i = 0; i< 5; i++) {
          if (!data[i]) {
            data.push({id: i + ''})
          }
        }
      }
      // if (this.state.curData.type === 'SECOND' && this.state.curData.name === '专题网站') {
      //   console.log('进来了')
      //   this.setState({data: [{},{},{}]})
      // } else {
        this.setState({data})
      // }
    })
  }

  // 保存所有操作
  saveData = () => {
    // axios
    if(!this.state.belong){
      message.error('请选择栏目')
      return
    }
    this.setState({isExit: false})
    let fnJson = {
      '医院概况': this.saveSurvey,
      '科室导航': this.saveDepartment,
      '科研': this.saveScientific,
      '招标采购': this.saveInvite,
      '教学': this.saveTreaching,
      '专题网站': this.savaWeb
    }
    fnJson[this.state.belong]()
  }

  // 保存招标采购
  saveInvite = () => {
    axios.post(`${URL}/admin/navbar/updateBiddPurchNavbar/${this.state.type}`,this.state.data).then(res => {
      res.data.code === 200 ? message.success('保存成功') : message.error(res.data.msg)
      this.getColumenList()
      this.getColumenChild(this.state.treeValue)
      this.setState({addModalVisible: false})
    }).catch(err => {
      message.error('异常请求')
    })
  }
  // 保存科室导航
  saveDepartment = () => {
    let arr = this.state.data;
    arr.forEach((item,index)=>{
      item.parentId = this.state.treeValue
    })
    this.setState({data: arr},()=>{
      axios.post(`${URL}/admin/navbar/updateDeptNavbar/${this.state.type}`,this.state.data).then(res => {
        res.data.code === 200 ? message.success('保存成功') : message.error(res.data.msg)
        this.getColumenList()
        this.setState({addModalVisible: false})
        this.getColumenChild(this.state.treeValue)
      }).catch(err => {
        message.error('异常请求')
      })
    })
  }
  // 保存医院概况
  saveSurvey = () => {
    axios.post(`${URL}/admin/navbar/updateHospSituNavbar/${this.state.type}`,this.state.data).then(res => {
      res.data.code === 200 ? message.success('保存成功') : message.error(res.data.msg)
      this.setState({addModalVisible: false})
      this.getColumenChild(this.state.treeValue)
    }).catch(err => {
      message.error('异常请求')
    })
  }
  // 保存科研教学
  saveScientific = () => {
    let arr = this.state.data;
    arr.forEach((item,index)=>{
      item.parentId = this.state.treeValue
    })
    this.setState({data: arr},()=>{
      axios.post(`${URL}/admin/navbar/updateResearchTeachNavbar/${this.state.type}`,this.state.data).then(res => {
        res.data.code === 200 ? message.success('保存成功') : message.error(res.data.msg)
        this.getColumenList()
        this.setState({addModalVisible: false})
        this.getColumenChild(this.state.treeValue)
      }).catch(err => {
        message.error('异常请求')
      })
    })
  }

  saveTreaching = () => {
    let arr = this.state.data;
    arr.forEach((item,index)=>{
      item.parentId = this.state.treeValue
    })
    this.setState({data: arr},()=>{
      axios.post(`${URL}/admin/navbar/updateTeachNavbar/${this.state.type}`,this.state.data).then(res => {
        res.data.code === 200 ? message.success('保存成功') : message.error(res.data.msg)
        this.getColumenList()
        this.getColumenChild(this.state.treeValue)
        this.setState({addModalVisible: false})
      }).catch(err => {
        message.error('异常请求')
      })
    })
  }

  savaWeb = (list) => {
    var temp = []
    if (this.state.addModalTwon) {
      temp = [...this.state.tempList]
    } else {
      temp = [...this.state.data]
    }
    var arr = [];
    temp.forEach((item,index)=>{
      if (this.state.addModalTwon) {
        item.parentId = this.state.data[this.state.data.length-1].id
      } else {
        item.parentId = this.state.treeValue
      }
      // item.parentId = this.state.treeValue
      if (item.navbarNameZH) {
        arr.push({...item})
      }
    })
    if (this.state.curData.title !== '专题网站' && arr.length < 3) {
      message.error('专题网站最少要有3个模块')
      return
    }
    if (this.state.addModalTwon) {
      // this.setState({data: arr},()=>{
        axios.post(`${URL}/admin/navbar/updateSpecialWebsiteNavbar/THIRD`,arr).then(res => {
          res.data.code === 200 ? message.success('保存成功') : message.error(res.data.msg)
          if (res.data.code !== 200) {
            let tempArr = this.state.data
            tempArr = tempArr.slice(0, tempArr.length - 1)
            this.setState({addModalTwon: false, data: tempArr}, () => {
              this.savaWeb()
            })
          } else {
            this.setState({addModalTwon: false, tempList: [{navbarNameZH: '',navbarNameUS: ''},{navbarNameZH: '',navbarNameUS: ''},{navbarNameZH: '',navbarNameUS: ''},{navbarNameZH: '',navbarNameUS: ''},{navbarNameZH: '',navbarNameUS: ''}]})
            this.getColumenList()
            this.getColumenChild(this.state.treeValue)
          }
          
        }).catch(err => {
          message.error('异常请求')
        })
      // })
    } else {
      this.setState({data: arr},()=>{
        axios.post(`${URL}/admin/navbar/updateSpecialWebsiteNavbar/${this.state.type}`,this.state.data).then(res => {
          res.data.code === 200 ? message.success('保存成功') : message.error(res.data.msg)
          this.getColumenList()
          if (this.state.addModalVisible) {
            this.setState({addModalVisible: false,addModalTwon: true})
          }
          this.getColumenChild(this.state.treeValue)
        }).catch(err => {
          message.error('异常请求')
        })
      })
    }
    // http://192.168.30.53:7979/admin/navbar/updateSpecialWebsiteNavbar/s
  }

  componentDidMount () {
    this.getColumenList()
    console.log(this.props)
    // this.props.router.setRouteLeaveHook(
    //     this.props.route,
    //     this.routerWillLeave
    // )
  }
  routerWillLeave = (nextLocation) => {
    return '确认要离开？';
  }

  // modal

  // hasErrors = (fieldsError) => {
  //   return Object.keys(fieldsError).some(field => fieldsError[field]);
  // }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  hideModal = () => {
    const form = this.formRef.props.form;
    form.resetFields();
    this.setState({addModalVisible: false})
  }

  showModal = () => {
    if(!this.state.treeValue){
      message.error('请先选择栏目！！！')
      return
    }
    this.setState({addModalVisible: true})
  }

  addModalBtn = (arrw) => {
    if (arrw.length) {
      this.setState({isExit: true }, () => {
        this.saveData()
      });
      return
    } else {
      const form = this.formRef.props.form;
      let arr = this.state.data
      form.validateFields((err, values) => {
        if (err) {
          return;
        }
        console.log('Received values of form: ', values);
        arr.push({...values})
        form.resetFields();
        this.setState({isExit: true,data: arr }, () => {
          this.saveData()
        });
      });
    }
  }

  setTempList = (e,index) => {
    let arr = this.state.tempList
    arr[index][e.target.name] = e.target.value
    this.setState({tempList: arr})
  }

  saveFormRef = (formRef) => {
    this.formRef = formRef;
  }
  closeAddModel = () => {
    let tempArr = this.state.data
    tempArr = tempArr.slice(0, tempArr.length - 1)
    this.setState({addModalTwon: false, data: tempArr,
      tempList: [{navbarNameZH: '',navbarNameUS: ''},{navbarNameZH: '',navbarNameUS: ''},{navbarNameZH: '',navbarNameUS: ''},{navbarNameZH: '',navbarNameUS: ''},{navbarNameZH: '',navbarNameUS: ''}]}, () => {
      this.savaWeb()
    })
  }
  render() {
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });


    let elementList = []
    this.state.tempList.forEach((item,index) => {
      elementList.push(
        <div style={{marginBottom: '10px'}} key={index}>
          模块--{index + 1}
          <FormItem style={{marginBottom: '0px'}}
            label='模块中文名：'>
            <Input placeholder="请输入模块中文名" value={item.navbarNameZH} name="navbarNameZH" onChange={(e) => {this.setTempList(e,index)}} maxLength={10} />
          </FormItem>
          <FormItem style={{marginBottom: '0px'}}
            label='模块英文名'>
              <Input placeholder="请输入模块英文名" value={item.navbarNameUS}  name="navbarNameUS" onChange={(e) => {this.setTempList(e,index)}} maxLength={20} />
          </FormItem>
        </div>)
    })


    return (
      <div>
        {this.state.isExit? <Exit message="有未保存的数据，确定要离开吗？"/> : null}
        
        <Form layout="inline">
           <FormItem label="栏目">
             <TreeSelect
              style={{ width: 300 }}
              value={this.state.treeValue}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={this.state.treeData}
              placeholder="Please select"
              treeDefaultExpandAll
              showCheckedStrategy="SHOW_CHILD"
              onChange={this.treeChange}
              getPopupContainer={triggerNode => triggerNode.parentNode}
            />
          </FormItem>
          <FormItem style={{float: 'right'}}>
            <Button style={{marginLeft: '15px'}} type="primary" onClick={this.showModal} disabled={this.state.curData.flag === '专题网站'}>增加模块</Button>
            <Button style={{marginLeft: '15px'}} type="primary" onClick={this.saveData} disabled={this.state.isSave}>保存</Button>
            {/* <Button style={{marginLeft: '15px'}} type="primary" onClick={this.edit} >科室简介编辑</Button> */}
          </FormItem>
        </Form>
        <Divider />
        <Table
          components={components}
          bordered
          dataSource={this.state.data}
          columns={columns}
          rowClassName="editable-row"
          rowKey="id"
          pagination={false}
        />
        <AddModalForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.addModalVisible}
          onOk={this.addModalBtn}
          onCancel={this.hideModal}
          flag={this.state.curData.title === '专题网站' ? true : false}
        />
        <Modal
          title="增加模块(模块至少填写3个)"
          visible={this.state.addModalTwon}
          onOk={() => {this.addModalBtn(this.state.tempList)}}
          onCancel={this.closeAddModel}
          okText="确认"
          cancelText="取消"
        >
          <Form  style={{height: '400px', overflow: 'auto'}}>
            {elementList}
          </Form>
        </Modal>
        {/* <Modal
          title="提示"
          visible={this.state.isExit}
          onOk={this.saveData}
          onCancel={()=>{this.setState({isExit: false})}}
          okText="确认"
          cancelText="取消"
        >
        有未保存的内容,是否保存？
        </Modal> */}
      </div>
    );
  }
}

// Form.create()()
export default withRouter(Form.create()(ColumnManage));