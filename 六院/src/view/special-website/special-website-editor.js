/*
 * @Author: kaiback__zgt_1430666237@qq.com 
 * @Date: 2018-05-15 09:26:49 
 * @Last Modified by: kaiback__zgt_1430666237@qq.com
 * @Last Modified time: 2018-05-18 15:20:55
 */

import React, {Component} from 'react'
import {Form, Input, Upload, Button,Modal, Icon, Row, Col, Divider, message, DatePicker} from 'antd'
import moment from 'moment';
import Title from '@/component/title'
import axios from 'axios'
import {URL} from '@/common/js/url.js'
import Editor from '@/component/editor'
import '../../common/stylus/public.styl'
const FormItem = Form.Item
// const {TextArea} = Input
// const URL = 'http://192.168.0.122:7979'

class ThemeVideoEditor extends Component {

  state = {
    fileList: [],
    loading: false,
    editorZHID: 0,// 编辑器id
    editorUSID: 0,// 编辑器id
    modelZH: false,
    modelUS: false,
    params:  {
      "accessoryIds": "",
      "accessoryList": [],
      "authorUS": "",
      "authorZH": "",
      "contentUS": "",
      "contentZH": "",
      "createTime": 0,
      "hits": 0,
      "id": 0,
      "nameUS": "",
      "nameZH": "",
      "publishTime": 0,
      "status": "ALL",
      "top": false,
    }
  }
  componentDidMount () {
    if(this.props.match.params.id !== 'NEW'){
      this.setState({params: {...this.state.params, id: this.props.match.params.id,navbarId: parseInt(this.props.match.params.type)}},()=>{
        this.getData(this.state.params.id)
      });
    }else{
      let seq = sessionStorage.getItem('maxLength') ? parseInt(sessionStorage.getItem('maxLength')) + 1 : 0
      this.setState({params: {...this.state.params,navbarId: parseInt(this.props.match.params.type), seq: seq}})
    }
  }


  // 设置双向绑定  name=字段名  必填项
  setFromData = (e) => {
    if (e.target.name === 'seq' && isNaN(e.target.value)) {
      return
    }
    this.setState({params: {...this.state.params,[e.target.name]: e.target.value}})
  }
  
  // 保存数据 添加/编辑
  saveData = (params) => {
    if (!params.seq) {
      message.error('排序号为必填项！！！')
      return
    }
    this.setState({ loading: true })
    // 若有传ID则为编辑否则就为添加
    let contentZH = ""
    let contentUS = ""
    if (params.contentZH) {
      contentZH = typeof params.contentZH === 'string' ? params.contentZH : params.contentZH.toHTML()
    }
    if (params.contentUS) {
      contentUS = typeof params.contentUS === 'string' ? params.contentUS : params.contentUS.toHTML()
    }
    // let contentUS = typeof params.contentUS === 'string' ? params.contentUS : params.contentUS.toHTML()
    // let contentZH = typeof params.contentZH === 'string' ? params.contentZH : params.contentZH.toHTML()
    let accessoryIds = this.state.fileList.map(item => {
      return item.uid
    })
    accessoryIds = accessoryIds.length ? `[${accessoryIds}]` : ''
    params = {...params,contentUS,contentZH,accessoryIds}
    if (this.props.match.params.id !== 'NEW') {
      axios.post(`${URL}/admin/specialWebsite/update`,params).then(res => {
        if(res.data.code === 200){
          message.success('保存成功',1);
          // this.goBack()
        }else{
          message.error(res.data.msg)
        }
      
        setTimeout(()=>{this.setState({loading:false})},500)
      }).catch(error => {message.error('异常请求');this.setState({ loading: false })})
    } else {
      if (!params.seq) {
        params.seq = 10000
      }
      axios.post(`${URL}/admin/specialWebsite/create`,params).then(res => {
        if(res.data.code === 200){
          message.success('保存成功',1);
          this.goBack()
        }else{
          message.error(res.data.msg)
        }
      
        setTimeout(()=>{this.setState({loading:false})},500)
      }).catch(error => {message.error('异常请求');this.setState({ loading: false })})
    }
  }

  // 获取数据
  getData = (id) => {
    axios.post(`${URL}/admin/specialWebsite/retrieveOne?id=${id}`).then(res => {
      this.setState({
        editorZHID: new Date().getTime() + 'ZH',
        editorUSID: new Date().getTime() + 'US',
        params: {...res.data.data}
      })
      var arr = [];
      // console.lo

      try {
        
        res.data.data.accessoryList.forEach((item,index) => {
          arr.push({
            showName: item.showName,
            name: '附件' + (index + 1) + ':' + item.showName,
            uid: item.id,
            thumbUrl: URL + '/' + item.url + item.storageName,
            url: URL + '/' + item.url + item.storageName
          })
        })
      } catch (error) {
        
      }

      this.setState({ fileList: arr})
    })
  }
  // 返回
  goBack = () => {
    this.props.history.goBack(-1)
    console.log(this.props)
    // window.history.back(-1)
  }
  removeFile = (info) => {
    // console.log(info)
    let arr = this.state.fileList;
    arr.forEach((item,index)=>{
      if(item.uid === info.uid){
        arr.splice(index,1)
      }
      // item.name = '附件'+ (index + 1) + ':' + item.name
    })
    this.setState({fileList: arr})
    // console.log(e)
  }

  // 上传视频
  handleChange = (file) => {
    // if(!this.beforeUpload(file.file)) {
    //   return
    // }
    var fromData = new FormData()
    file.fileList.forEach(item => {
      console.log(item.originFileObj)
      fromData.append('file',item.originFileObj)
    })
    // fromData.append('file',file.file.originFileObj)
    // var fileArr = this.state.fileList
    // console.log(file)
    axios.post(`${URL}/admin/file/upload`,fromData).then(res => {
      if(res.data.code === 200) {
        message.success('上传成功')
        file.file.status = 'done'
        // console.log(file.fileList)
        file.file.uid = res.data.data
        let fileData = this.state.fileList
        console.log(this.state.fileList)
        file.file.name = '附件'+ (fileData.length + 1) + ':' + file.file.name
        fileData.push(file.file)
        // Object.assign(fileData, file.fileList)
        // console.log(fileData)
        this.setState({fileList: fileData})
      }else {
        message.error(res.data.msg)
      }
    }).catch(error => {
      message.error('上传失败')
    })
  }
  // 限制文件大小和文件格式
  // beforeUpload(file) {
  //   // console.log(file)
  //   const isJPG = file.name.indexOf('.mp4') !== -1;
  //   // this.setState({isMP4:isJPG })
  //   if (!isJPG) {
  //     message.error('请上传mp4视频格式');
  //   }
  //   const isLt2M = file.size / 1024 / 1024 < 500;
  //   if (!isLt2M) {
  //     message.error('上传的视频不能大于500M');
  //   }
  //   return isJPG && isLt2M;
  // }

  editorOnChange = (editorContent) => {
    this.setState({params:{...this.state.params,contentZH:editorContent}})
  }

  editorOnChangeUS = (editorContent) => {
    this.setState({params:{...this.state.params,contentUS:editorContent}})
  }
  beforeUpload = (file) => {
      // const isJPG = file.type === 'image/jpeg';
      // if (!isJPG) {
      // message.error('You can only upload JPG file!');
      // }
      const isLt2M = file.size / 1024 / 1024 < 30;
      if (!isLt2M) {
        message.error('附件大小不能超过30M');
      }
      return isLt2M;
  }

  setShowFileName = () => {
    this.state.fileList.forEach((item,index) => {})
    // this.pa
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
      // action: '//jsonplaceholder.typicode.com/posts/',
      // accept: '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      accept: `image/*,*.zip,*.rar,aplication/zip,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,
      application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/pdf,application/vnd.ms-excel,text/plain,
      application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation`,
      multiple: true,
      onRemove: this.removeFile,
      beforeUpload: this.beforeUpload,
      onChange: this.handleChange
      // beforeUpload: (file) => {
      //   this.setState(({ fileList }) => ({
      //     fileList: [...fileList, file],
      //   }));
      //   return false;
      // }
    };

    return (
      <div className="theme-video-editor">
        <Title title="编辑内容" />
        <span style={{float: 'right'}}>
          <Button style={{marginLeft: '15px'}} onClick={this.goBack}>返回</Button>
          <Button style={{marginLeft: '15px'}} onClick={() => {this.setState({modelZH: true})}}>预览文章(中文)</Button>
          {/* <Button style={{marginLeft: '15px'}} onClick={() => {this.setState({modelUS: true})}}>预览文章(英文)</Button> */}
          {/* <Button style={{marginLeft: '15px'}} >发布</Button> */}
          <Button style={{marginLeft: '15px'}} type="primary" loading={this.state.loading} onClick={() => {this.saveData(this.state.params)}}>保存</Button>
        </span>
        <Divider />
        <Form layout="horizontal">
          <Row  style={{width: '80%',margin: '0 auto'}}>
            <Col span="12">
              <FormItem {...formItemLayout} label="中文标题">
                <Input style={{width: '300px'}} maxLength={100}  value={this.state.params.nameZH} name="nameZH" onChange={this.setFromData}/>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem {...formItemLayout} label="中文作者">
                <Input style={{width: '300px'}} maxLength={10}  value={this.state.params.authorZH} name="authorZH" onChange={this.setFromData}/>
              </FormItem>
            </Col>
          </Row>
          {/* <Row style={{width: '80%',margin: '0 auto'}}>
            <Col span="12">
              <FormItem {...formItemLayout} label="英文标题">
                <Input style={{width: '300px'}} maxLength={50}  value={this.state.params.nameUS} name="nameUS" onChange={this.setFromData}/>
              </FormItem>
            </Col>
            <Col span="12" style={{textAlign: 'left'}}>
              <FormItem {...formItemLayout} label="英文作者">
                <Input style={{width: '300px'}} maxLength={20} value={this.state.params.authorUS} name="authorUS" onChange={this.setFromData}/>
              </FormItem>
            </Col>
          </Row> */}
          <Row style={{width: '80%',margin: '0 auto'}}>
            <Col span="12">
              <FormItem {...formItemLayout} label="中文副标题">
                <Input style={{width: '300px'}} maxLength={100}  value={this.state.params.subheadingZH} name="subheadingZH" onChange={this.setFromData}/>
              </FormItem>
            </Col>
            {/* <Col span="12" style={{textAlign: 'left'}}>
              <FormItem {...formItemLayout} label="英文副标题">
                <Input style={{width: '300px'}} maxLength={20} value={this.state.params.subheadingUS} name="subheadingUS" onChange={this.setFromData}/>
              </FormItem>
            </Col> */}
          </Row>
          <FormItem {...formItemLayout} label="排序号">
            <Input style={{width: '300px'}} maxLength={6} value={this.state.params.seq} name="seq" onInput={this.setFromData}/>
          </FormItem>
          {
            this.state.params.publishTime ?
            <FormItem {...formItemLayout} label="发布时间">
              <DatePicker defaultValue={''} placeholder={this.state.params.publishTime ? this.formatTime(this.state.params.publishTime) :"请选择日期"} format={'YYYY/MM/DD'} onChange={this.setTime}/>
            </FormItem>
            : null
          }
          <FormItem {...formItemLayout} label="中文内容">
          <Editor controls={['media']} initialContent={this.state.params.contentZH} contentFormat="html" contentId={this.state.editorZHID} editorOnChange={this.editorOnChange}/>
            {/* <TextArea
              placeholder="请输入中文简介"
              autosize={{ minRows: 4}}
              name="contentZH"
              value={this.state.params.contentZH}
              onChange={this.setFromData} /> */}
          </FormItem>
          {/* <FormItem {...formItemLayout} label="英文内容">
          <Editor controls={['media']} initialContent={this.state.params.contentUS} contentFormat="html" contentId={this.state.editorUSID} editorOnChange={this.editorOnChangeUS} /> */}
            {/* <TextArea
              placeholder="请输入中文简介"
              name="contentUS"
              autosize={{ minRows: 4}}
              value={this.state.params.contentUS}
              onChange={this.setFromData} /> */}
          {/* </FormItem> */}
          <FormItem {...formItemLayout} label="附件" style={{width: '400px',marginLeft: '150px'}}>
            <Upload  style={{width: '300px'}} {...props}  fileList={this.state.fileList}>
              <Button>
                <Icon type="upload" /> 上传附件
              </Button>
            </Upload>
          </FormItem>
        </Form>
        <Modal
          title="文章预览"
          width={800}
          visible={this.state.modelZH}
          onCancel={()=>{this.setState({modelZH: false})}}
          onOk={()=>{this.setState({modelZH: false})}}
          okText='确定'
          cancelText='取消'
        >
          <h1 style={{textAlign: 'center', fontSize: '20px'}}>{this.state.params.nameZH}</h1>
          <h1 style={{textAlign: 'center', fontSize: '18px'}}>{this.state.params.subheadingZH}</h1>
          <div dangerouslySetInnerHTML={{__html: typeof this.state.params.contentZH === 'string' ? this.state.params.contentZH : this.state.params.contentZH.toHTML()}}></div>
        </Modal>
        {/* <Modal
          title="文章预览"
          width={800}
          visible={this.state.modelUS}
          onCancel={()=>{this.setState({modelUS: false})}}
          onOk={()=>{this.setState({modelUS: false})}}
          okText='确定'
          cancelText='取消'
        >
          <h1 style={{textAlign: 'center', fontSize: '20px'}}>{this.state.params.nameUS}</h1>
          <h1 style={{textAlign: 'center', fontSize: '18px'}}>{this.state.params.subheadingUS}</h1>
          <div dangerouslySetInnerHTML={{__html: typeof this.state.params.contentUS === 'string' ? this.state.params.contentUS : this.state.params.contentUS.toHTML()}}></div>
        </Modal> */}
      </div>
    )
  }
}

export default ThemeVideoEditor