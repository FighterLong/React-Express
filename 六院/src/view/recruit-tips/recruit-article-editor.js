/*
 * @Author: kaiback__zgt_1430666237@qq.com 
 * @Date: 2018-05-15 09:26:49 
 * @Last Modified by: kaiback__zgt_1430666237@qq.com
 * @Last Modified time: 2018-05-18 15:20:55
 */

import React, {Component} from 'react'
import {Form, Input, Upload,Select, Button, Icon, Divider, message,DatePicker} from 'antd'
import moment from 'moment';
// import Title from '@/component/title'
import axios from 'axios'
import Editor from '@/component/editor'
import {URL} from '@/common/js/url.js'
import {administrative, claim, education} from './data.js'
import './content.styl'
import { type } from 'os';
const FormItem = Form.Item
const Option = Select.Option
// const {TextArea} = Input
// const URL = 'http://192.168.0.122:7979'

class RecruitArticleEditor extends Component {

  state = {
    fileList: [],
    loading: false,
    isCheckFile: false,
    editorZHID: 0,
    editorUSID: 0,
    labelList: [],
    urlType: 'recruitment',
    params:  {
        "accessoryIds": "",
        "accessoryList": [],
        labelIdList: [],
        "contentUS": "",
        "contentZH": "",
        "createTime": 0,
        "creator": "",
        "deadline": 0,
        "departmentRequirement": "",
        "educationalRequirement": "",
        "hits": 0,
        "id": 0,
        "jobRequirement": "",
        "navbarId": 20,
        "publishTime": 0,
        "recruitingNumbers": 0,
        "status": "ALL",
        "titleUS": "",
        "titleZH": ""
      }
  }
  componentDidMount () {
    this.getLabel()
    if(sessionStorage.getItem('urlType').indexOf('BIDDING') !== -1) {
      this.setState({urlType: 'biddingPurchasing' })
    }else{
      this.setState({urlType: 'recruitment' })
    }
    if(this.props.match.params.id !== 'NEW'){
      this.setState({params: {...this.state.params, id: this.props.match.params.id,navbarId: this.props.match.params.navId}},()=>{
        console.log(this.state.params.id);
        this.getData(this.state.params.id)
      });
    }else {
      let seq = sessionStorage.getItem('maxLength') ? parseInt(sessionStorage.getItem('maxLength')) + 1 : 0
      this.setState({params: {...this.state.params, navbarId: this.props.match.params.navId, seq}})
    }
  }
  
  getLabel = () => {
    axios.get(`${URL}/admin/biddingPurchasing/listAllLabel`).then(res => {
      if (res.data.data) {
        this.setState({labelList: res.data.data})
      }
    })
  }
  // 设置中文标题  实现数据双向绑定
  setSpecialVideoNameZH = (e) => {
      console.log(e.target.value)
    this.setState({params: {...this.state.params,titleZH: e.target.value}})
  }
  // 设置英文标题 实现数据双向绑定
  setSpecialVideoNameUS  = (e) => {
    this.setState({params: {...this.state.params,titleUS: e.target.value}})
  }

  // 设置中文内容 实现数据双向绑定
  setcontentZH = (value) => {
    //   console.log(value)
    this.setState({params: {...this.state.params,contentZH: value}})
  }
  // 设置英文内容 实现数据双向绑定
  setcontentUS = (value) => {
    this.setState({params: {...this.state.params,contentUS: value}})
  }

  // 保存数据 添加/编辑
  saveData = () => {
    let contentZH = ""
    let contentUS = ""
    if (this.state.params.contentZH) {
      contentZH = typeof this.state.params.contentZH === 'string' ? this.state.params.contentZH : this.state.params.contentZH.toHTML()
    }
    if (this.state.params.contentUS) {
      contentUS = typeof this.state.params.contentUS === 'string' ? this.state.params.contentUS : this.state.params.contentUS.toHTML()
    }
    // let contentZH = typeof this.state.params.contentZH === 'string' ? this.state.params.contentZH : this.state.params.contentZH.toHTML()
    // let contentUS = typeof this.state.params.contentUS === 'string' ? this.state.params.contentUS : this.state.params.contentUS.toHTML()
    this.setState({ loading: true ,params: {...this.state.params,contentUS,contentZH}},() => {
      // 若有传ID则为编辑否则就为添加
      if (this.props.match.params.id !== 'NEW') {
        axios.post(`${URL}/admin/${this.state.urlType}/update`,this.state.params).then(res => {
          if(res.data.code === 200){
            message.success('保存成功',1);
            setTimeout(()=>{this.setState({loading:false})},500)
          }else {
            message.error(res.data.msg)
            setTimeout(()=>{this.setState({loading:false})},500)
          }
        }).catch(error => {message.error('异常请求');this.setState({ loading: false })})
      } else {
        axios.post(`${URL}/admin/${this.state.urlType}/save`,this.state.params).then(res => {
          if(res.data.code === 200){
            message.success('保存成功',1);
            this.goBack()
            setTimeout(()=>{this.setState({loading:false})},500)
          }else {
            message.error(res.data.msg)
            setTimeout(()=>{this.setState({loading:false})},500)
          }
        }).catch(error => {message.error('异常请求');this.setState({ loading: false })})
      }
    })
  }

  // 获取数据
  getData = (id) => {
    axios.get(`${URL}/admin/${this.state.urlType}/retrieveOne?id=${id}`).then(res => {
      this.setState({
        params: {...res.data.data},
        editorZHID: new Date().getTime()+'ZH',
        editorUSID: new Date().getTime()+'US'
      })
      let arr = []
      res.data.data.accessoryList= res.data.data && res.data.data.accessoryList ? res.data.data.accessoryList : []
      res.data.data && res.data.data.accessoryList.forEach((item, index) => {
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
    if(!this.beforeUpload(file.file)) {
      return
    }
    this.setState({isCheckFile: true})
    var fromData = new FormData()
    
    // var fromData = new FormData()
    file.fileList.forEach(item => {
      fromData.append('file',item.originFileObj)

    })
    axios.post(`${URL}/admin/file/upload`,fromData).then(res => {
      if(res.data.code === 200) {
        let arr = this.state.fileList
        file.file.name = '附件'+ (arr.length + 1) + ':' + file.file.name
        arr.push(file.file)
        message.success('上传成功')
        file.file.status = 'done'
        let Ids = this.state.params.accessoryIds?JSON.parse(this.state.params.accessoryIds):[];
        Ids.push(res.data.data)
        Ids = `[${Ids.toString()}]`
        console.log(Ids)
        this.setState({params:{...this.state.params,accessoryIds: Ids},isCheckFile: false,fileList: arr})
      }else {
        message.error(res.data.msg)
      }
      this.setState({isCheckFile: false})
    }).catch(error => {
      this.setState({isCheckFile: false})
      // message.error('上传失败')
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
      message.error('上传的视频不能大于30M');
    }
    return isLt2M;
  }
  // 移除文件
  removeFile = (info) => {
    // console.log(info)
    let arr = this.state.fileList;
    let Ids = JSON.parse(this.state.params.accessoryIds)
    arr.forEach((item,index)=>{
      if(item.uid === info.uid){
        arr.splice(index,1)
        Ids.splice(index,1)
      }
    })
    this.setState({fileList: arr,params: {...this.state.params,accessoryIds: Ids}})
    // console.log(e)
  }
  handleChange = (value) => { // 岗位要求
    console.log(`selected ${value}`);
    let arr = `[${value.toString()}]`
    arr = arr.length === 2?"":arr
    this.setState({
      params:{...this.state.params,jobRequirement: arr}
    })
  }
  handleChange2 = (value) => { // 岗位要求
    console.log(`selected ${value}`);
    let arr = `[${value.toString()}]`
    arr = arr.length === 2?"":arr
    this.setState({
      params:{...this.state.params,departmentRequirement: arr}
    })
  }
  handleChange3 = (value) => { // 岗位要求
    console.log(`selected ${value}`);
    let arr = `[${value.toString()}]`
    arr = arr.length === 2?"":arr
    this.setState({
      params:{...this.state.params,educationalRequirement: arr}
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
  
  chengeLabel = (e) => {
    this.setState({params: {...this.state.params,labelIdList: e}})
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
      onChange: this.updateFile,
      beforeUpload: this.beforeUpload,
      multiple: true,
      onRemove: this.removeFile
    };

    const administrativeList = [];
    administrative.departmentAdmin.forEach(function(item) {
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
               <FormItem {...formItemLayout} label="中文标题">
                   <Input style={{width: '300px'}} maxLength={100} value={this.state.params.titleZH} onChange={this.setSpecialVideoNameZH}/>
               </FormItem>
               <FormItem {...formItemLayout} label="英文标题">
                   <Input style={{width: '300px'}} maxLength={250} value={this.state.params.titleUS} onChange={this.setSpecialVideoNameUS}/>
               </FormItem>
              <FormItem {...formItemLayout} label="排序号">
                <Input style={{width: '300px'}} maxLength={30} value={this.state.params.seq} onInput={this.setSEQ}/>
              </FormItem>
              <FormItem {...formItemLayout} label="分类">
                <Select style={{width: '300px'}} mode="multiple" defaultValue={this.state.params.labelIdList} onChange={this.chengeLabel}
                  getPopupContainer={triggerNode => triggerNode.parentNode}>
                  {this.state.labelList.map(item => {
                    return <Option value={item.id}>{item.nameZH}</Option>
                  })}
                
                  {/* <Option value="UNPUBLISH">未发布</Option>
                  <Option value="PUBLISH">已发布</Option> */}
                </Select>
              </FormItem>
              {
                  this.state.params.publishTime ?
                  <FormItem {...formItemLayout} label="发布时间">
                  <DatePicker defaultValue={''} placeholder={this.state.params.publishTime ? this.formatTime(this.state.params.publishTime) :"请选择日期"} format={'YYYY/MM/DD'} onChange={this.setTime}/>
                  </FormItem>
                  : null
              }
               <FormItem {...formItemLayout} label="中文内容">
                    <Editor controls={['media']} initialContent={this.state.params.contentZH} editorOnChange={this.setcontentZH} contentFormat="html" contentId={'1'}/>
               </FormItem>
               <FormItem {...formItemLayout} label="英文内容">
               <Editor controls={['media']} initialContent={this.state.params.contentUS} editorOnChange={this.setcontentUS} contentFormat="html" contentId={'2'}/>
               </FormItem>
                <FormItem {...formItemLayout} label="附件" style={{width: '400px',marginLeft: '150px'}}>
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
export default RecruitArticleEditor