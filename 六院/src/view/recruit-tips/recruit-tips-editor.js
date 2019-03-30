/*
 * @Author: kaiback__zgt_1430666237@qq.com 
 * @Date: 2018-05-15 09:26:49 
 * @Last Modified by: kaiback__zgt_1430666237@qq.com
 * @Last Modified time: 2018-05-18 15:20:55
 */

import React, {Component} from 'react'
import {Form, Input, Upload,Select, Button,DatePicker, Icon, Row, Col, Divider, message} from 'antd'
import moment from 'moment';
import axios from 'axios'
import Editor from '@/component/editor'
import {URL} from '@/common/js/url.js'
import {administrative, claim, education} from './data.js'
const FormItem = Form.Item
const Option = Select.Option
const {TextArea} = Input
// const URL = 'http://192.168.0.122:7979'

class RecruitEditor extends Component {

  state = {
    fileList: [],
    loading: false,
    isCheckFile: false,
    departmentType: 'departmentAdmin',
    params:  {
        "accessoryIds": "",
        "accessoryList": [],
        "contentZH": "",
        "deadline": 0,
        "departmentRequirement": [],
        "educationalRequirement": [],
        "jobRequirement": [],
        "navbarId": 20,
        "recruitingNumbers": 0,
        "status": "ALL",
        "titleZH": ""
      }
  }
  componentDidMount () {
    if(this.props.match.params.id !== 'NEW'){
      console.log('修改')
      this.setState({params: {...this.state.params, id: this.props.match.params.id,navbarId: this.props.match.params.navId}},()=>{
        console.log(this.state.params.id);
        this.getData(this.state.params.id)
      });
    }else {
      console.log('新建')
      console.log(this.props.match.params)
      let seq = sessionStorage.getItem('maxLength') ? parseInt(sessionStorage.getItem('maxLength')) + 1 : 0
      this.setState({params: {...this.state.params, navbarId: this.props.match.params.navId,seq}})
    }
  }
  
  // 设置中文标题  实现数据双向绑定
  setSpecialVideoNameZH = (e) => {
      console.log(e.target.value)
    this.setState({params: {...this.state.params,titleZH: e.target.value}})
  }
  // 设置英文标题 实现数据双向绑定
  setrecruitingNumbers  = (e) => {
    this.setState({params: {...this.state.params,recruitingNumbers: e.target.value}})
  }

  // 设置中文内容 实现数据双向绑定
  setcontentZH = (value) => {
    //   console.log(value)
    this.setState({params: {...this.state.params,contentZH: value}})
  }
  // 设置英文内容 实现数据双向绑定
  setSpecialVideoContentUS = (e) => {
    this.setState({params: {...this.state.params,specialVideoContentUS: e.target.value}})
  }

  getShowTime = (date) => {
    if (!date) {
      return ''
    }
    let d = new Date(date)
    let year = d.getFullYear()
    let month = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)
    let day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate()
    return year + '-' + month + '-' + day
  }

  // 保存数据 添加/编辑
  saveData = () => {
    let contentZH = ''
    if (this.state.params.contentZH ) {
      contentZH = typeof this.state.params.contentZH === 'string' ? this.state.params.contentZH : this.state.params.contentZH.toHTML()
    }
    let deadline = 0
    if (typeof this.state.params.deadline === 'string') {
      deadline = new Date(this.state.params.deadline).getTime()
    } else {
      deadline = this.state.params.deadline
    }
    // let contentZH = typeof this.state.params.contentZH === 'string' ? this.state.params.contentZH : this.state.params.contentZH.toHTML()
    
    this.setState({ loading: true, params: {...this.state.params,contentZH,deadline}},() => {
      // 若有传ID则为编辑否则就为添加
      let jobRequirement = JSON.stringify(this.state.params.jobRequirement)
      let departmentRequirement = JSON.stringify(this.state.params.departmentRequirement)
      let educationalRequirement = JSON.stringify(this.state.params.educationalRequirement)
      if (this.props.match.params.id !== 'NEW') {
        axios.post(`${URL}/admin/recruitment/update`,{...this.state.params,departmentRequirement,jobRequirement,educationalRequirement}).then(res => {
          if(res.data.code === 200){
            message.success('保存成功',1);
            setTimeout(()=>{this.setState({loading:false})},500)
          }else {
            setTimeout(()=>{this.setState({loading:false})},500)
            message.error(res.data.msg)
          }
        }).catch(error => {message.error('异常请求');this.setState({ loading: false })})
      } else {
        axios.post(`${URL}/admin/recruitment/save`,{...this.state.params,departmentRequirement,jobRequirement,educationalRequirement}).then(res => {
          if(res.data.code === 200){
            message.success('保存成功',1);
            setTimeout(()=>{this.setState({loading:false})},500)
            this.goBack()
          }else {
            setTimeout(()=>{this.setState({loading:false})},500)
            message.error(res.data.msg)
          }
        }).catch(error => {message.error('异常请求');this.setState({ loading: false })})
      }
    })
    
  }

  // 获取数据
  getData = (id) => {
    axios.get(`${URL}/admin/recruitment/retrieveOne?id=${id}`).then(res => {
      if (res.data.data.educationalRequirement && res.data.data.educationalRequirement.indexOf('[') === -1) {
        let arr = []
        arr.push(res.data.data.educationalRequirement)
        res.data.data.educationalRequirement = JSON.stringify(arr)
      }
      let departmentRequirement = res.data.data.departmentRequirement ? JSON.parse(res.data.data.departmentRequirement) : []
      let jobRequirement = res.data.data.jobRequirement ? JSON.parse(res.data.data.jobRequirement) : []
      // let educationalRequirement = res.data.data.educationalRequirement ? JSON.parse(res.data.data.educationalRequirement) : []
      // let departmentRequirement = res.data.data.departmentRequirement.substring(1, res.data.data.departmentRequirement.length - 1).split(',')
      // let jobRequirement = res.data.data.jobRequirement.substring(1, res.data.data.jobRequirement.length - 1).split(',')
      let educationalRequirement = res.data.data.educationalRequirement ? JSON.parse(res.data.data.educationalRequirement) : []
      // console.log(departmentRequirement)
      // console.log(jobRequirement)
      // console.log(educationalRequirement)
      let d = new Date(res.data.data.deadline)
      let year = d.getFullYear()
      let month = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)
      let day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate()
      this.setState({
        params: {...res.data.data,
          departmentRequirement: departmentRequirement,
          jobRequirement: jobRequirement,
          educationalRequirement: educationalRequirement,
          deadline: year + '/' + month + '/' + day
        }
      })
      let arr = []
      res.data.data.accessoryList&&res.data.data.accessoryList.forEach((item,index) => {
            arr.push({
              name: '附件' + (index + 1) + ':' + item.showName,
              uid: item.id,
              thumbUrl: item.url,
              url: URL + '/' + item.url + item.storageName
            })
            // item.name = item.showName;
            // item.uid = item.id;
            // item.thumbUrl = item.url;
        })
      this.setState({ fileList: arr})
    })
  }
  // 返回
  goBack() {
    window.history.back(-1)
  }

  // 上传视频
  updateFile = (file) => {
    // if(this.state.isCheckFile) {
    //   return
    // }
    // if(!this.beforeUpload(file.file)) {
    //   return
    // }
    this.setState({isCheckFile: true})
    var fromData = new FormData()
    
    // var fromData = new FormData()
    file.fileList.forEach(item => {
      fromData.append('file',item.originFileObj)

    })
    // fromData.append('file',file.file.originFileObj)
    axios.post(`${URL}/admin/file/upload`,fromData).then(res => {
      if(res.data.code === 200) {
        message.success('上传成功')
        file.file.status = 'done'
        let Ids = this.state.params.accessoryIds?JSON.parse(this.state.params.accessoryIds):[];
        Ids.push(res.data.data)
        Ids = `[${Ids.toString()}]`
        let fileData = this.state.fileList
        file.file.name = '附件'+ (fileData.length + 1) + ':' + file.file.name
        fileData.push(file.file)
        this.setState({params:{...this.state.params,accessoryIds: Ids},isCheckFile: false,fileList: fileData})
      }else {
        message.error(res.data.msg)
      }
    }).catch(error => {
      message.error('上传失败')
    })
  }
  // 限制文件大小和文件格式
  beforeUpload(file) {
    // console.log(file)
    // const isJPG = file.name.indexOf('.exe') === -1;
    // // this.setState({isMP4:isJPG })
    // if (!isJPG) {
    //   message.error('请上传正确的文件格式');
    // }
    const isLt2M = file.size / 1024 / 1024 < 30;
    if (!isLt2M) {
      message.error('上传的附件不能大于30M');
    }
    return isLt2M;
  }
  handleChange = (value) => { // 岗位要求
    // console.log(`selected ${value}`);
    // let arr = `[${value.toString()}]`
    // arr = arr.length === 2?"":arr
    this.setState({
      params:{...this.state.params,jobRequirement: value}
    })
  }
  handleChange2 = (value) => { // 岗位要求
    // console.log(`selected ${value}`);
    // let arr = `[${value.toString()}]`
    // arr = arr.length === 2?"":arr
    this.setState({
      params:{...this.state.params,departmentRequirement: value}
    })
  }
  handleChange3 = (value) => { // 岗位要求
    // console.log(`selected ${value}`);
    // let arr = `[${value.toString()}]`
    // arr = arr.length === 2?"":arr
    this.setState({
      params:{...this.state.params,educationalRequirement: value}
    })
  }
  setSEQ = (e) => {
    if (isNaN(e.target.value)) {
      return
    }
    this.setState({
      params: {...this.state.params,seq: e.target.value}
    })
  }
  removeFile = (info) => {
    // console.log(info)
    let arr = this.state.fileList;
    arr.forEach((item,index)=>{
      if(item.uid === info.uid){
        arr.splice(index,1)
      }
    })
    this.setState({fileList: arr})
    // console.log(e)
  }
  setTime = (e) => {
    this.setState({
      params: {...this.state.params,publishTime:new Date(e).getTime()}
    })
  }
  formatTime(date) {
    if (!date) {
      return
    }
    let d = new Date(date)
    let year = d.getFullYear()
    let month = (d.getMonth() + 1) < 10 ? ('0' +  (d.getMonth() + 1)) :  (d.getMonth() + 1)
    let day = d.getDate() < 10 ? ('0' + d.getDate()) : d.getDate()
    return year + '/' + month + '/' + day
  }
  setDepartmentType = (value) => {
    this.setState({departmentType: value})
  }
  render () {

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };

    const props = {
      accept: `image/*,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,
      application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/pdf,application/vnd.ms-excel,text/plain,
      application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation`,
      // action: '//jsonplaceholder.typicode.com/posts/',
      multiple: true,
      onRemove: this.removeFile,
      onChange: this.updateFile,
      beforeUpload: this.beforeUpload
    };

    const administrativeList = [];
    administrative[this.state.departmentType].forEach(function(item) {
        administrativeList.push(<Option key={item}>{item}</Option>);
    })

    const claimList = [];
    claim.forEach(function(item){
        claimList.push(<Option key={item}>{item}</Option>);
    })

    const educationList = [];
    education.forEach(function(item){
        educationList.push(<Option key={item}>{item}</Option>);
    })
   

    return (
      <div className="theme-video-editor">
        {/* <Title title="编辑内容" /> */}
        <span style={{float: 'right',paddingBottom: '20px'}}>
          <Button style={{marginLeft: '15px'}} onClick={this.goBack}>返回</Button>
          {/* <Button style={{marginLeft: '15px'}} >发布</Button> */}
          <Button style={{marginLeft: '15px'}} loading={this.state.loading} type="primary" onClick={() => {this.saveData(this.state.params)}}>保存</Button>
        </span>
        <Divider />
        <Form layout="horizontal">
            <Row>
                <Col span={8}>
                    <FormItem {...formItemLayout} label="标题">
                        <Input style={{width: '300px'}} placeholder="请输入标题" maxLength={60} value={this.state.params.titleZH} onChange={this.setSpecialVideoNameZH}/>
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem {...formItemLayout} label="截止时间">
                        <DatePicker placeholder={this.getShowTime(this.state.params.deadline) || "请选择时间"} style={{ width: '300px' }} 
                        defaultValue={this.state.params.deadline} format={'YYYY/MM/DD'}
                        // defaultValue={moment(this.state.params.deadline, 'YYYY/MM/DD')} 
                        onChange={(value) => this.setState({params: {...this.state.params,deadline: new Date(value).getTime()}})}/>
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem {...formItemLayout} label="人数">
                        <Input style={{width: '300px'}} placeholder="请输入人数" maxLength={10} value={this.state.params.recruitingNumbers } onChange={this.setrecruitingNumbers}/>
                    </FormItem>
                </Col>
            </Row><Row>
                <Col span={8}>
                    <FormItem {...formItemLayout} label="岗位类别">
                        <Select
                            mode="multiple"
                            style={{ width: '300px' }}
                            placeholder="请选择岗位类别"
                            value={this.state.params.jobRequirement || []}
                            onChange={this.handleChange}
                            getPopupContainer={triggerNode => triggerNode.parentNode}
                        >
                            {claimList}
                        </Select>
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem {...formItemLayout} label="用人科室">
                        <Select
                                // mode="multiple"
                                // mode="tags"
                                style={{ width: '120px' }}
                                placeholder="科室类别"
                                value={this.state.departmentType}
                                onChange={this.setDepartmentType}
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
                                value={this.state.params.departmentRequirement || []}
                                onChange={this.handleChange2}
                                optionFilterProp={'children'}
                                getPopupContainer={triggerNode => triggerNode.parentNode}
                            >
                                {administrativeList}
                            </Select>
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem {...formItemLayout} label="学历要求">
                    <Select
                        mode="multiple"
                        style={{ width: '300px' }}
                        placeholder="请选择学历要求"
                        value={this.state.params.educationalRequirement}
                        onChange={this.handleChange3}
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                    >
                        {educationList}
                    </Select>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="排序号" style={{width: '400px'}}>
                    <Input style={{width: '300px'}} maxLength={30} value={this.state.params.seq} onInput={this.setSEQ}/>
                  </FormItem>
                </Col>
                <Col span={8}>
                    {
                        this.state.params.publishTime ?
                        <FormItem {...formItemLayout} label="发布时间">
                        <DatePicker defaultValue={''} placeholder={this.state.params.publishTime ? this.formatTime(this.state.params.publishTime) :"请选择日期"} format={'YYYY/MM/DD'} onChange={this.setTime}/>
                        </FormItem>
                        : null
                    }</Col>
                <Col span={8}></Col>
            </Row>
              
            <div style={{padding: '0 30px',paddingBottom: '30px'}}>
                <Editor controls={['media']} initialContent={this.state.params.contentZH} editorOnChange={this.setcontentZH} contentFormat="html" contentId="1" />
            </div>
          {/* <FormItem {...formItemLayout} label="人数">
            <Input style={{width: '300px'}}  value={this.state.params.specialVideoNameUS} onChange={this.setSpecialVideoNameUS}/>
          </FormItem> */}
          <FormItem  label="上传附件" {...formItemLayout} style={{width: '400px'}}>
            <Upload  style={{width: '300px'}} {...props}  fileList={this.state.fileList}>
              <Button>
                <Icon type="upload" /> 上传附件
              </Button>
            </Upload>
          </FormItem>
        </Form>
      </div>
    )
  }
}

export default RecruitEditor