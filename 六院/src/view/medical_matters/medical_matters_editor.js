import React, {Component} from 'react'
import {Input, Divider, Button,Modal, Form, Select, Upload, Icon, message, DatePicker } from 'antd'
import moment from 'moment';
// import Title from '@/component/title'
import Editor from '@/component/editor'
import ajx from '../../api/request';
import {URL} from '@/common/js/url.js'
import axios from 'axios'
import '../../common/stylus/public.styl'

const FormItem = Form.Item
// const {TextArea} = Input
const Option = Select.Option

// const URL = 'http://192.168.0.122:7979'

export default class KeyDepartBrief extends Component {

  state = {
    // 编辑的语言
    lang: 'ZH',
    id: 'NEW',
    // 提交中
    submitting: false,
    modelZH: false,
    modelUS: false,
    // 中英文标题
    messageNameZH: '',
    messageNameUS: '',
    contentZHID: 0,
    contentUSID: 0,
    // 编辑器的内容--编辑器空内容默认是'<p></p>'
    // messageContentZH: '<p></p>',
    // messageContentUS: '<p></p>',
    // 相关科室
    defaultDepartment: [],
    // 相关科室下拉列表
    option: [],
    // 文件列表
    fileList: [],
    params: {
      "accessoryIds": "",
      "accessoryList": [
        {
          "id": 0,
          "showName": "string",
          "storageName": "string",
          "uploadTime": 0,
          "url": "string"
        }
      ],
      "contentUS": "",
      "contentZH": "",
      "createTime": 0,
      "creator": "string",
      "hits": 0,
      "id": 0,
      "navbarId": 1,
      "publishTime": 0,
      "slidoshowIds": "",
      "slidoshowList": [
        {
          "id": 0,
          "showName": "string",
          "storageName": "string",
          "uploadTime": 0,
          "url": "string"
        }
      ],
      "status": "UNPUBLISH",
      "titleUS": "",
      "titleZH": ""
    }
  }



  componentDidMount () {
    // console.log(this.props.match.params)
    if(this.props.match.params.id !== 'NEW') {
      this.setState({params: {...this.state.params, id: this.props.match.params.id, type: this.props.match.params.from, navbarId: this.props.match.params.lang}},() => {
        this.getDataById(this.props.match.params.id);
      })
    }else {
      let seq = sessionStorage.getItem('maxLength') ? parseInt(sessionStorage.getItem('maxLength')) + 1 : 0
      this.setState({params: {...this.state.params, type: this.props.match.params.from,seq,navbarId: this.props.match.params.lang}})
    }
    // const {lang, id} = this.props.match.params
    // this.setState({
    //   id,
    //   lang
    // })
    this.getRelativeDepartMent();
  }

  saveEditor = (lang = this.state.lang) => {
    this.setState({submitting: true})
    // axios请求
    if(this.props.match.params.id !== 'NEW') {
      this.saveUpateHospitalDynamic();
    }else {
      this.saveAddHospitalDynamic();
    }
    // setTimeout(() => {
    //   this.setState({submitting: false})
    // }, 1000)
  }
  removeFile = (info) => {
    // console.log(info)
    let arr = this.state.fileList;
    console.log(arr)
    arr.forEach((item,index)=>{
      if(item.uid === info.uid){
        arr.splice(index,1)
      }
    })
    this.setState({fileList: arr})
    // console.log(e)
  }
  // 医院公告编辑内容接口
  saveUpateHospitalDynamic = () => {
    let fileIds = [];
    this.state.fileList.forEach(item=>{
      fileIds.push(item.uid)
    })
    fileIds = '['+fileIds.toString() +']'
    fileIds = fileIds.length === 2 ? '' : fileIds
    let contentUS = ""
    if(this.state.params.contentUS){
      contentUS = typeof this.state.params.contentUS === 'string' ? this.state.params.contentUS : this.state.params.contentUS.toHTML()
    }
    let contentZH = ""
    if(this.state.params.contentZH){
      contentZH = typeof this.state.params.contentZH === 'string' ? this.state.params.contentZH : this.state.params.contentZH.toHTML()
    }
    // let contentZH = typeof this.state.params.contentZH === 'string' ? this.state.params.contentZH : this.state.params.contentZH.toHTML()
    this.setState({params: {...this.state.params,accessoryIds: fileIds,accessoryList: this.state.fileList,contentUS,contentZH}},()=>{
      ajx.post(`${URL}/admin/medicalVolunteer/update`,this.state.params).then((res)=>{
        if(res.code === 200) {
          message.success('保存成功');
        }else{
          message.error(res.msg);
        }
        this.setState({submitting: false})
      }).catch(error => {
        this.setState({submitting: false})
        message.error('异常请求')
      })
    })
  }
  saveAddHospitalDynamic = () => {
    let fileIds = [];
    this.state.fileList.forEach(item=>{
      fileIds.push(item.uid)
    })
    fileIds = '['+fileIds.toString() +']'
    fileIds = fileIds.length === 2 ? '' : fileIds
    
    let contentUS = ""
    if(this.state.params.contentUS){
      contentUS = typeof this.state.params.contentUS === 'string' ? this.state.params.contentUS : this.state.params.contentUS.toHTML()
    }
    let contentZH = ""
    if(this.state.params.contentZH){
      contentZH = typeof this.state.params.contentZH === 'string' ? this.state.params.contentZH : this.state.params.contentZH.toHTML()
    }
    this.setState({params: {...this.state.params,accessoryIds: fileIds,accessoryList: this.state.fileList,contentUS,contentZH}},()=>{
      ajx.post(`${URL}/admin/medicalVolunteer/create`,this.state.params).then(res => {
        if(res.code === 200) {
          message.success('保存成功');
          this.props.history.goBack()
        }else{
          message.error(res.msg);
        }
        this.setState({submitting: false})
      }).catch(error => {
        message.error('异常请求')
        this.setState({submitting: false})
      })
    })
  }

  // 根据id获取内容
  getDataById = (id) => {
    ajx.post(`${URL}/admin/medicalVolunteer/retrieveOne?id=${id}`).then((res)=>{
        if(res.code === 200) {
          try {
            this.setState({
              params: res.data,
              contentUSID: new Date().getTime()+'US',
              contentZHID: new Date().getTime()+'ZH'
            })
          } catch (error) {
              message.error(res.msg)
          }
          var arr = [];
          res.data.accessoryList.forEach((item,index) => {
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
        }
    })
  }

  editorOnChange = (editorContent) => {
    let contentZH = editorContent
    this.setState({params:{...this.state.params,contentZH}})
  }

  editorOnChangeUS = (editorContent) => {
    let contentUS =  editorContent
    this.setState({params:{...this.state.params,contentUS}})
  }

  // 获取相关科室
  getRelativeDepartMent = () => {
    let option = []
    for (let i = 10; i < 36; i++) {
      option.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
    }
    this.setState({option})
  }

  // 选择相关科室
  selectOption = (value) => {
    console.log(value)
  }

  // 
  uploadFile = (file) => {
    var fromData = new FormData()
    fromData.append('file',file.file.originFileObj)
    // var fileArr = this.state.fileList
    // console.log(file)
    axios.post(`${URL}/admin/file/upload`,fromData).then(res => {
      if(res.data.code === 200) {
        message.success('上传成功')
        file.file.status = 'done'
        // console.log(file.fileList)
        file.file.uid = res.data.data
        let fileList = this.state.fileList
        file.file.name = '附件'+ (fileList.length + 1) + ':' + file.file.name
        fileList.push(file.file)
        this.setState({fileList: fileList})
      }else {
        message.error(res.data.msg)
      }
    }).catch(error => {
      message.error('上传失败')
    })
  }

  // 设置中文副标题的值
  setSubheadingZH = (e) => {
    this.setState({
      params: {...this.state.params,subheadingZH: e.target.value}
    })
  }

  // 设置中文标题的值
  setMessageNameZH = (e) => {
    this.setState({
      params: {...this.state.params,titleZH: e.target.value}
    })
  }

  // 设置英文标题
  setMessageNameUS = (e) => {
    this.setState({
      params: {...this.state.params,titleUS: e.target.value}
    })
  }
  
  // 设置英文副标题的值
  setSubheadingUS = (e) => {
    this.setState({
      params: {...this.state.params,subheadingUS: e.target.value}
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


  // 限制文件大小和文件格式
  beforeUpload(file) {
    // console.log(file)
    // const isJPG = file.name.indexOf('.exe') === -1;
    // if (!isJPG) {
    //   message.error('请上传图片或者文档');
    // }
    const isLt2M = file.size / 1024 / 1024 < 30;
    if (!isLt2M) {
      message.error('上传的附件不能大于30M');
    }
    return isLt2M;
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
    
    // const editorProps = {
    //   height: 500,
    //   contentFormat: 'html',
    //   initialContent: this.state.messageContentZH,
    //   onChange:this.editorOnChange,
    //   onRawChange:this.editorOnRawChange
    // }
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
      accept: `image/*,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,
      application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/pdf,application/vnd.ms-excel,text/plain,
      application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation`,
      onChange: this.uploadFile,
      beforeUpload: this.beforeUpload,
      multiple: true,
      onRemove: this.removeFile
    };
    
    // this.setState({
    //   messageNameZH: this.state.messageNameZH,
    //   messageNameUS: this.state.messageNameUS,
    //   messageContentZH: this.state.messageContentZH,
    //   messageContentUS:this.state.messageContentUS
    // })
    // let value = ''
    // function changeValue() {
    //   console.log(value)
    // }
    return (
      <div className="department">
        {/* <Title title={`编辑内容：${this.state.lang === 'ZH' ? '中文' : '英文'}`} /> */}
        
        <span style={{float: 'right',paddingBottom: '20px'}}>
          <Button style={{marginLeft: '15px'}} onClick={() => {this.props.history.goBack()}}>返回</Button>
          <Button style={{marginLeft: '15px'}} onClick={() => {this.setState({modelZH: true})}}>预览文章(中文)</Button>
          <Button style={{marginLeft: '15px'}} onClick={() => {this.setState({modelUS: true})}}>预览文章(英文)</Button>
          <Button style={{marginLeft: '15px'}} type="primary" loading={this.state.submitting} onClick={this.saveEditor} >保存</Button>
        </span>
        <Divider />
        <Form layout="horizontal">
          {/* <Input style={{width: '300px'}} value={value} onChange={changeValue}/> */}
          <FormItem {...formItemLayout} label="中文标题">
            <Input style={{width: '300px'}} maxLength={100} value={this.state.params.titleZH} onChange={this.setMessageNameZH}/>
          </FormItem>
           <FormItem {...formItemLayout} label="中文副标题">
             <Input style={{width: '300px'}} maxLength={100} onChange={this.setSubheadingZH} value={this.state.params.subheadingZH}/>
           </FormItem>
          <FormItem {...formItemLayout} label="英文标题">
            <Input style={{width: '300px'}} maxLength={250} value={this.state.params.titleUS} onChange={this.setMessageNameUS}/>
          </FormItem>
           <FormItem {...formItemLayout} label="英文副标题">
             <Input style={{width: '300px'}} maxLength={250} onChange={this.setSubheadingUS} value={this.state.params.subheadingUS}/>
           </FormItem>
           <FormItem {...formItemLayout} label="排序号">
             <Input style={{width: '300px'}} maxLength={50} onChange={this.setSEQ} value={this.state.params.seq}/>
           </FormItem>
          {
              this.state.params.publishTime ?
              <FormItem {...formItemLayout} label="发布时间">
              <DatePicker defaultValue={''} placeholder={this.state.params.publishTime ? this.formatTime(this.state.params.publishTime) :"请选择日期"} format={'YYYY/MM/DD'} onChange={this.setTime}/>
              </FormItem>
              : null
          }
          <FormItem {...formItemLayout} label="中文内容">
            <Editor controls={['media']} initialContent={this.state.params.contentZH} contentFormat="html" contentId={5} editorOnChange={this.editorOnChange}/>
            {/* <TextArea
              placeholder="请输入视频简介"
              autosize={{ minRows: 4}} /> */}
          </FormItem>
          <FormItem {...formItemLayout} label="英文内容">
            <Editor controls={['media']} initialContent={this.state.params.contentUS} contentFormat="html" contentId={6} editorOnChange={this.editorOnChangeUS} />
            {/* <TextArea
              placeholder="请输入视频简介"
              autosize={{ minRows: 4}} /> */}
          </FormItem>
          <FormItem {...formItemLayout} label="附件（可选）">
          <Upload {...props} fileList={this.state.fileList}>
            <Button>
              <Icon type="upload" /> upload
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
          <h1 style={{textAlign: 'center', fontSize: '20px'}}>{this.state.params.titleZH}</h1>
          <h1 style={{textAlign: 'center', fontSize: '18px'}}>{this.state.params.subheadingZH}</h1>
          <div dangerouslySetInnerHTML={{__html: typeof this.state.params.contentZH === 'string' ? this.state.params.contentZH : this.state.params.contentZH.toHTML()}}></div>
        </Modal>
        <Modal
          title="文章预览"
          width={800}
          visible={this.state.modelUS}
          onCancel={()=>{this.setState({modelUS: false})}}
          onOk={()=>{this.setState({modelUS: false})}}
          okText='确定'
          cancelText='取消'
        >
          <h1 style={{textAlign: 'center', fontSize: '20px'}}>{this.state.params.titleUS}</h1>
          <h1 style={{textAlign: 'center', fontSize: '18px'}}>{this.state.params.subheadingUS}</h1>
          <div dangerouslySetInnerHTML={{__html: typeof this.state.params.contentUS === 'string' ? this.state.params.contentUS : this.state.params.contentUS.toHTML()}}></div>
        </Modal>
      </div>
    )
  }
}