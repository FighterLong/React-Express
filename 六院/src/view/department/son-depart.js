import React, {Component} from 'react'
import {Input, Divider, Table, Select, Form, Button, message} from 'antd'
// import Text from '@/component/text'
import axios from 'axios'
import {timeFillter, statusFillter} from '../../common/js/public.js'
import {URL} from '@/common/js/url.js'

const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;

class SonDepart extends Component {

  columns = [
    {
      title: '内容标题',
      dataIndex: 'titleZH'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render:(text,record,index)=>(
        text?timeFillter(text):0
      )
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      render:(text,record,index)=>(
        text?timeFillter(text):0
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
        <span>
          {
            this.state.permissionInfo.includes(`department:update`) ? <a href="javascript:;" onClick={() => this.editor(text.id)}>编辑</a>: null
          }
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
    permissionInfo: [],
    content: 'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
    params: {
      "departmentId": 0,
      "departmentIds": "",
      "keyword": "",
      "pageIndex": 1,
      "pageSize": 10,
      "special": "2018",
      "specialWebsiteType": "",
      "status": "ALL",
      "top": true,
      "type": ""
    }
  }

  componentWillReceiveProps (next) {
    this.setState({name:sessionStorage.getItem('key')})
    this.setState({params: {...this.state.params,departmentId: next.match.params.id,type: next.match.params.type}},()=>{
      this.getData()
    })
    // const {localtion} = this.props
    // this.setState({currentModel: /^\/KeyDepart\//.test(localtion.pathname)})
  }
  componentDidMount(){
    this.setState({name:sessionStorage.getItem('key')})
    this.setState({permissionInfo: (JSON.parse(sessionStorage.getItem('permissionInfo'))?JSON.parse(sessionStorage.getItem('permissionInfo')):[]).map(item =>{
      return item ? item.toLocaleLowerCase() : item
    })})
    this.setState({params: {...this.state.params,departmentId: this.props.match.params.id,type: this.props.match.params.type}},()=>{
      this.getData()
    })
  }


  /************************ 数据操作区 start ***********************/
  // 获取列表数据
  getData = () => {
    axios.post(`${URL}/admin/department/retrieveWebsiteArticleList`,this.state.params).then(res => {
      if (res.data.code === 200) {
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
    axios.post(`${URL}/admin/department/updateDepartmentPublishArticle?ids=${ids}&status=${status}`).then(res => {
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
  }

  // 删除
  delData = (ids) => {
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

  /************************ 数据操作区 end   ***********************/
  editor = (id) => {
    this.props.history.push({pathname: `/SonDepartBrief/${id}/${this.props.match.params.type}`})
  }

  cancelPublish = () => {

  }

  typeChange = (value) => {
    this.setState({params: {...this.state.params,status: value}},function(){
      this.getData()
    })
  }

  newContent = () => {
    this.props.history.push({pathname: `/SonDepartBrief/NEW/${this.props.match.params.type}`,query: { departmentId: this.props.match.params.id}})
  }

  briefEditor = () => {
    // const {match} = this.props
    this.props.history.push({pathname: `/SonDepartBrief/UPDATE/${this.props.match.params.type}`,query: { departmentId: this.props.match.params.id }})
  }
  onSelectChange = (selectedRowKeys) => {
    // console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  }
  setPage = (index) => {
    this.setState({params:{...this.state.params,pageIndex: index}},()=>{this.getData()})
  }
  render () {

    const { selectedRowKeys } = this.state;
    let pagination = {...this.state.pagination,onChange: this.setPage}

    const rowSelection = {
      selectedRowKeys,
      // data: [],
      onChange: this.onSelectChange,
    };


    return (
      <div>
    {/* this.getAll(''); */}
        <p style={{fontWeight: 'bold',fontSize: '18px'}}>{sessionStorage.getItem('departmentName')}</p>
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
                <span>
                 <Button style={{marginLeft: '15px'}} type="danger" disabled={this.state.selectedRowKeys.length === 0} onClick={this.delData}>批量删除</Button>
                </span>
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
                <span>
                  <Button style={{marginLeft: '15px'}} type="primary" onClick={this.newContent} >新建内容</Button>
                </span>
              :  null
            }
            {/* <Button style={{marginLeft: '15px'}} type="danger" disabled={this.state.selectedRowKeys.length === 0} onClick={this.delData}>批量删除</Button> */}
            {/* <Button style={{marginLeft: '15px'}} type="primary" disabled={this.state.selectedRowKeys.length === 0} onClick={()=>{this.getPublish(this.state.selectedRowKeys,true)}}>批量发布</Button>
            <Button style={{marginLeft: '15px'}} type="primary" disabled={this.state.selectedRowKeys.length === 0} onClick={()=>{this.getPublish(this.state.selectedRowKeys,false)}}>批量取消发布</Button> */}
            {/* <Button style={{marginLeft: '15px'}} type="primary" onClick={this.newContent} >新建内容</Button> */}
            <Button style={{marginLeft: '15px'}} type="primary" onClick={this.briefEditor} >子网站简介编辑</Button>
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

export default SonDepart