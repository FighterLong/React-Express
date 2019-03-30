import React, {Component} from 'react'
import {Input, Divider, Table, Select, Form, Button, message} from 'antd'
// import Text from '@/component/text'
import axios from 'axios'
import {timeFillter, statusFillter} from '../../common/js/public.js'
import {URL} from '@/common/js/url.js'

const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;

class KeyDepart extends Component {

  columns = [
    {
      title: '科室名称',
      dataIndex: 'nameZH'
    },
    {
      title: '详情模式',
      dataIndex: '',
      render:(text,record,index)=>(
        text.parrern === 'OUT_URL'?'外部链接':(text.parrern === 'CONTENT'?'内容':(text.parrern === 'TEMPLATE'?'子模版':''))
      )
    },
    {
      title: '创建时间',
      dataIndex: '',
      render:(text,record,index)=>(
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
    {
      title: '创建人',
      dataIndex: 'creator',
    },
    {
      title: '状态',
      dataIndex: '',
      render:(text,record,index)=>(
        text.status?statusFillter(text.status):0
      )
    },
    {
      title: '操作',
      dataIndex: '',
      render: (text, record, index) => (
        <span style={{whiteSpace: 'nowrap'}}>
          {
            this.state.permissionInfo.includes(`department:update`) ? <a href="javascript:;" onClick={() => this.editor(text.id,text.nameZH)}>编辑</a>: null
          }
          {/* {
            text.state === 'PUBLISHED'
            ? <span><Divider type="vertical" /><a href="javascript:;" onClick={this.cancelPublish}>取消发布</a></span>
            : null
          } */}
          {
            text.status === 'PUBLISH' && this.state.permissionInfo.includes(`department:publish`)
            ? <span><Divider type="vertical" /><a href="javascript:;" onClick={() => this.getPublish([text.id],false)}>取消发布</a></span>
            : null
          }
          
          {
            text.status === 'UNPUBLISH' && this.state.permissionInfo.includes(`department:publish`)
            ? <span><Divider type="vertical" /><a href="javascript:;" onClick={() => this.getPublish([text.id],true)}>发布</a></span>
            : null
          }
        </span>
      )
    }
  ];
  
  state = {
    currentModel: true,
    selectedRowKeys: [],
    data: [],
    name: '',
    KeyDepart: {
      introduce: '',
      title: '',
      banner: [
        {src: '', id: 1}
      ]
    },
    pagination: {
      total: 10,
      pageSize: 10,
      defaultPageSize: 10,
    },
    permissionInfo: [],
    content: '',
    params: {
      "departmentId": 0,
      "departmentIds": "",
      "keyword": " ",
      "navbarId": 21,
      "pageIndex": 1,
      "pageSize": 10,
      "special": "2018",
      "specialWebsiteType": "",
      "status": "ALL",
      // "top": true,
      // "type": ""
    }
  }

  componentWillReceiveProps (next) {
    this.setState({name:sessionStorage.getItem('key'),selectedRowKeys: []})
    let pageIndex = sessionStorage.getItem('pageIndex') ? parseInt(sessionStorage.getItem('pageIndex')) : 1;
    this.setState({params: {...this.state.params,navbarId: next.match.params.id,pageIndex}},()=>{
      this.getData()
    })
    // const {localtion} = this.props
    // this.setState({currentModel: /^\/KeyDepart\//.test(localtion.pathname)})
  }
  componentDidMount(){
    this.setState({name:sessionStorage.getItem('key'), selectedRowKeys: []})
    this.setState({permissionInfo: (JSON.parse(sessionStorage.getItem('permissionInfo'))?JSON.parse(sessionStorage.getItem('permissionInfo')):[]).map(item =>{
      return item ? item.toLocaleLowerCase() : item
    })})
    let pageIndex = sessionStorage.getItem('pageIndex') ? parseInt(sessionStorage.getItem('pageIndex')) : 1;
    this.setState({params: {...this.state.params,navbarId: this.props.match.params.id,pageIndex}},()=>{
      this.getData()
    })
  }


  /************************ 数据操作区 start ***********************/
  // 获取列表数据
  getData = () => {
    axios.post(`${URL}/admin/department/retrieveList`,this.state.params).then(res => {
      if(res.data.code === 200) {
        if (!res.data.data.content.length && this.state.params.pageIndex > 1) {
          this.setState({params: {...this.state.params,pageIndex: this.state.params.pageIndex - 1}}, () => {
            this.getData()
          })
          return
        }
        this.setState({data: res.data.data.content,
          pagination: {
            total: res.data.data.totalElements,
            pageSize: 10
          }})
      }else {
        message.error(res.data.msg)
      }
    }).catch(error => {
      message.error('异常请求')
    })
  }
  // 发布/取消发布
  getPublish = (ids,status) => {
      axios.post(`${URL}/admin/department/publish?ids=${ids}&status=${status}`).then(res => {
        if(res.data.code === 200) {
          status ? message.success('发布成功') : message.success('取消发布成功')
          this.setState({
            selectedRowKeys: []
          },() => {
            this.getData()
          })
        }else {
          message.error(res.data.msg)
        }
      }).catch(error => {
        message.error('异常请求')
      })
    // }else {// 子网站
    //   axios.post(`${URL}/admin/department/updateDepartmentPublishArticle?ids=${ids}&status=${status}`).then(res => {
    //     if(res.data.code === 200) {
    //       status ? message.success('发布成功') : message.success('取消发布成功')
    //       this.setState({
    //         selectedRowKeys: []
    //       },() => {
    //         this.getData()
    //       })
    //     }else {
    //       message.error(res.data.msg)
    //     }
    //   }).catch(error => {
    //     message.error('异常请求')
    //   })
    // }
  }

  // 删除
  delData = (ids) => {
    if(!this.props.match.params.type) {// 科室
      // message.success('不是子网站')
      axios.post(`${URL}/admin/department/delete?ids=${this.state.selectedRowKeys}`).then(res => {
        if(res.data.code === 200) {
          message.success('删除成功')
          this.setState({ selectedRowKeys: [] },() => { this.getData() })
        }else {
          message.error(res.data.msg)
        }
      }).catch(error => {
        message.error('异常请求')
      })
    }else {// 子网站
      // message.success('子网站')
      axios.post(`${URL}/admin/department/updateDepartmentDeleteArtile?ids=${this.state.selectedRowKeys}`).then(res => {
        if(res.data.code === 200) {
          message.success('删除成功')
          this.setState({ selectedRowKeys: [] },() => { this.getData() })
        }else {
          message.error(res.data.error)
        }
      }).catch(error => {
        message.error('异常请求')
      })
    }
  }

  /************************ 数据操作区 end   ***********************/
  editor = (id,name) => {
    sessionStorage.setItem('departmentName',name)
    this.props.history.push({pathname: `/keyDepartUpdate/${id}/${this.props.match.params.id}`,query: { navbarId: this.props.match.params.id}})
  }

  cancelPublish = () => {

  }

  typeChange = (value) => {
    this.setState({params: {...this.state.params,status: value,pageIndex: 1}},function(){
      this.getData()
    })
  }

  newContent = () => {
    this.props.history.push({pathname: `/keyDepartUpdate/NEW/${this.props.match.params.id}`,query: { navbarId: this.props.match.params.id}})
  }

  briefEditor = () => {
    // const {match} = this.props
    console.log(this.props.match.params.id)
    this.props.history.push({pathname: `/keyDepartUpdate/UPDATE/${this.props.match.params.id}`,query: { navbarId: this.props.match.params.id }})
  }
  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  }
  
  setPage = (index) => {
    this.setState({params:{...this.state.params,pageIndex: index}},()=>{
      sessionStorage.setItem('pageIndex', index)
      this.getData()
    })
  }

  render () {

    const { selectedRowKeys } = this.state;
    let pagination = {...this.state.pagination,onChange: this.setPage, current: this.state.params.pageIndex}

    const rowSelection = {
      selectedRowKeys,
      // data: [],
      onChange: this.onSelectChange,
    };


    return (
      <div>
        <p style={{fontWeight: 'bold',fontSize: '18px'}}>科室导航/{this.state.name}</p>
        <Form layout="inline">
          <FormItem>
            <Search
              placeholder="输入搜索"
              onSearch={value => {this.setState({params: {...this.state.params,keyword: value,pageIndex: 1}},()=>{this.getData()})}}
              maxLength={20}
            />
          </FormItem>
          <FormItem label="类型">
            <Select defaultValue={this.state.params.status} style={{ width: 120 }} onChange={this.typeChange}
              getPopupContainer={triggerNode => triggerNode.parentNode}>
              <Option value="ALL">全部</Option>
              <Option value="UNPUBLISH">未发布</Option>
              <Option value="PUBLISH">已发布</Option>
            </Select>
          </FormItem>
          <FormItem style={{float: 'right'}}>
            {
              this.state.permissionInfo.includes(`department:delete`) ?
              <Button style={{marginLeft: '15px'}} type="danger" disabled={this.state.selectedRowKeys.length === 0} onClick={this.delData}>批量删除</Button>
              :  null
            }
            {
              this.state.permissionInfo.includes(`department:publish`) ?
                <span>
                  <Button style={{marginLeft: '15px'}} type="primary" disabled={this.state.selectedRowKeys.length === 0} onClick={()=>{this.getPublish(this.state.selectedRowKeys,true)}}>批量发布</Button>
                  <Button style={{marginLeft: '15px'}} type="primary" disabled={this.state.selectedRowKeys.length === 0} onClick={()=>{this.getPublish(this.state.selectedRowKeys,false)}}>批量取消发布</Button>
                </span>
              :  null
            }
            {
              this.state.permissionInfo.includes(`department:create`) ?
              <Button style={{marginLeft: '15px'}} type="primary" onClick={this.newContent} >新建科室</Button>
              :  null
            }
            {/* <Button style={{marginLeft: '15px'}} type="danger" disabled={this.state.selectedRowKeys.length === 0} onClick={this.delData}>批量删除</Button> */}
            {/* <Button style={{marginLeft: '15px'}} type="primary" disabled={this.state.selectedRowKeys.length === 0} onClick={()=>{this.getPublish(this.state.selectedRowKeys,true)}}>批量发布</Button> */}
            {/* <Button style={{marginLeft: '15px'}} type="primary" disabled={this.state.selectedRowKeys.length === 0} onClick={()=>{this.getPublish(this.state.selectedRowKeys,false)}}>批量取消发布</Button> */}
            {/* <Button style={{marginLeft: '15px'}} type="primary" onClick={this.newContent} >新建内容</Button> */}
            <Button style={{marginLeft: '15px'}} type="primary" onClick={this.briefEditor} >科室简介编辑</Button>
          </FormItem>
        </Form>
        <Divider />
        <Table
          rowKey="id"
          columns={this.columns}
          dataSource={this.state.data}
          rowSelection={rowSelection}
          pagination={pagination}
        />
      </div>
    )
  }
}

export default KeyDepart