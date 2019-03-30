import React, {Component} from 'react'
import {Input, Divider, Button,Modal, Form, Select, Upload, Icon, message,DatePicker } from 'antd'
import moment from 'moment';
// import Title from '@/component/title'
import Editor from '@/component/editor'
import Tools from '@/component/tools/tools.js'

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
    urlType: 'message',
    // 提交中
    submitting: false,
    editorZHID: 1,// 编辑器ID
    editorUSID: 2,
    // 中英文标题
    messageNameZH: '',
    messageNameUS: '',
    modelZH: false,
    modelUS: false,
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
      "createTime": 0,
      "creator": "string",
      "departmentIds": "",
      "hits": 0,
      "id": 0,
      "seq": 0,
      "messageContentUS": '',
      "messageContentZH": '',
      "messageNameUS": '',
      "messageNameZH": '',
      "publishTime": 0,
      "status": "ALL",
      "top": true,
      "type": "DYNAMIC"
    }
  }



  componentDidMount () {
    // console.log(this.props)
    // if(this.props.match.params.from === 'MEDICAL_MATTERS') {
    //   this.setState({urlType: 'medicalVolunteer'})
    // }
    if(this.props.match.params.id !== 'NEW') {
        this.setState({params: {...this.state.params, id: this.props.match.params.id, type: this.props.match.params.from}},() => {
        this.getDataById(this.props.match.params.id);
      })
    }else {
      let seq = sessionStorage.getItem('maxLength') ? parseInt(sessionStorage.getItem('maxLength')) + 1 : 0
      this.setState({params: {...this.state.params, type: this.props.match.params.from, seq}})
    }
    // const {lang, id} = this.props.match.params
    // this.setState({
    //   id,
    //   lang
    // })
    this.getRelativeDepartMent();
  }

  saveEditor = (lang = this.state.lang) => {
    if(!this.state.params.messageNameZH){
      message.error('中文标题不能为空');
      return;
    }
    let arr = this.state.params.departmentIds
    // console.log(arr)
    arr = typeof arr === 'object' ? `[${arr.toString()}]` : arr
    arr = arr.length ? arr : ''
    // console.log(arr)
    this.setState({submitting: true,params: {...this.state.params,departmentIds:arr}},()=>{
    //   console.log(arr)
    //   // axios请求
      if(this.props.match.params.id !== 'NEW') {
        this.saveUpateHospitalDynamic();
      }else {
        this.saveAddHospitalDynamic();
      }
    })
    // setTimeout(() => {
    //   this.setState({submitting: false})
    // }, 1000)
  }

  // 医院公告编辑内容接口
  saveUpateHospitalDynamic = () => {
    if (!this.state.params.seq) {
      this.setState({submitting: false})
      message.error('排序号为必填项')
      return
    }
    if(!this.state.params.messageNameZH){
      message.error('中文标题不能为空');
      this.setState({submitting: false})
      return;
    }
    let fileIds = [];
    this.state.fileList.forEach(item=>{
      fileIds.push(item.uid)
    })
    fileIds = '['+fileIds.toString() +']'
    fileIds = fileIds.length === 2 ? '' : fileIds
    
    let messageContentUS = ''
    let messageContentZH = ''
    if (this.state.params.messageContentUS) {
      messageContentUS = this.state.params.messageContentUS
    }
    if (this.state.params.messageContentZH) {
      messageContentZH = this.state.params.messageContentZH
    }
    // let messageContentUS = typeof this.state.params.messageContentUS === 'string' ? this.state.params.messageContentUS : this.state.params.messageContentUS.toHTML()
    // let messageContentZH = typeof this.state.params.messageContentZH === 'string' ? this.state.params.messageContentZH : this.state.params.messageContentZH.toHTML()
    this.setState({params: {...this.state.params,
        messageContentUS,
        messageContentZH,
        accessoryIds: fileIds,accessoryList: this.state.fileList
      }},()=>{

      ajx.post(`${URL}/admin/${this.state.urlType}/update`,this.state.params).then((res)=>{
        if(res.code === 200) {
          message.success('保存成功');
          // this.props.history.goBack()
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
    if (!this.state.params.seq) {
      this.setState({submitting: false})
      message.error('排序号为必填项')
      return
    }
    if(!this.state.params.messageNameZH){
      message.error('中文标题不能为空');
      this.setState({submitting: false})
      return;
    }
    let fileIds = [];
    this.state.fileList.forEach(item=>{
      fileIds.push(item.uid)
    })
    fileIds = '['+fileIds.toString() +']'
    fileIds = fileIds.length === 2 ? '' : fileIds
    let messageContentUS = ''
    let messageContentZH = ''
    if (this.state.params.messageContentUS) {
      messageContentUS = typeof this.state.params.messageContentUS === 'string' ? this.state.params.messageContentUS : this.state.params.messageContentUS.toHTML()
    }
    if (this.state.params.messageContentZH) {
      messageContentZH = typeof this.state.params.messageContentZH === 'string' ? this.state.params.messageContentZH : this.state.params.messageContentZH.toHTML()
    }
    // let messageContentUS = typeof this.state.params.messageContentUS === 'string' ? this.state.params.messageContentUS : this.state.params.messageContentUS.toHTML()
    // let messageContentZH = typeof this.state.params.messageContentZH === 'string' ? this.state.params.messageContentZH : this.state.params.messageContentZH.toHTML()
    this.setState({params: {...this.state.params,messageContentZH,messageContentUS,accessoryIds: fileIds,accessoryList: this.state.fileList}},()=>{
      ajx.post(`${URL}/admin/${this.state.urlType}/create`,this.state.params).then(res => {
        if(res.code === 200) {
          message.success('保存成功');
          this.props.history.goBack()
          // this.
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

  // 根据id获取内容
  getDataById = (id) => {
    ajx.post(`${URL}/admin/${this.state.urlType}/retrieveOne?id=${id}`).then((res)=>{
        if(res.code === 200) {
          try {
            // let arrs = [];
            // console.log(res.data.departmentIds)
            // JSON.parse(res.data.departmentIds).forEach(item=>{
            //   arrs.push(item+'')
            // })
            this.setState({
              editorZHID: new Date().getTime() + 'ZH',
              editorUSID: new Date().getTime() + 'US',
              defaultDepartment: res.data.departmentIds ? JSON.parse(res.data.departmentIds) : [],
              params: {...res.data,
                messageNameZH: res.data.messageNameZH || '',
                messageNameUS: res.data.messageNameUS || '',
                messageContentZH: res.data.messageContentZH || '',
                messageContentUS: res.data.messageContentUS || ''}
            },()=>{
              let arr = typeof this.state.defaultDepartment === 'string' ? JSON.parse(this.state.defaultDepartment): this.state.defaultDepartment
              let arr2 =  []
              arr.forEach(item=>{
                item +=''
                arr2.push(item)
                console.log( typeof item)
              })
              
              // console.log(typeof arr2[0])
              this.setState({
                params: {...this.state.params},
                defaultDepartment: arr2
              })
              // this.state.params.departmentIds = [...this.state.params.departmentIds+'']
            })
          } catch (error) {
              message.error(res.msg)
          }
          let fileList = [];
          res.data.accessoryList.forEach((item, index) => {
            fileList.push({
              name: '附件' + (index + 1) + ':' + item.showName,
              uid: item.id,
              thumbUrl: item.url,
              url: URL + '/' + item.url + item.storageName
            })
            // item.name = item.showName;
            // item.uid = item.id;
            // item.thumbUrl = item.url;
          })
          this.setState({ fileList: fileList},() => {
            console.log(this.state.fileList)
          })
        }
    })
  }

  editorOnChange = (editorContent) => {
    this.setState({params:{...this.state.params,messageContentZH:editorContent}})
  }

  editorOnChangeUS = (editorContent) => {
    this.setState({params:{...this.state.params,messageContentUS:editorContent}})
  }

  // 获取相关科室
  getRelativeDepartMent = () => {
    axios.get(`${URL}/admin/department/departmentReminder`).then(res => {
      if(res.data.code === 200 && res.data.data) {
        let option = []
        res.data.data.forEach((item,index)=>{
          option.push(<Option key={item.id}>{item.name}</Option>);
        })
        this.setState({option})
      }
    })
  }

  // 选择相关科室
  selectOption = (value) => {
    value = value.length ? value : ''
    this.setState({params: {...this.state.params,departmentIds: value},defaultDepartment: value?value: []},() => {
      console.log(this.state.params.departmentIds)
    })
  }

  // 
  uploadFile = (file) => {
    if(!this.beforeUpload(file.file)){
      return
    }
    var fromData = new FormData()
    file.fileList.forEach(item => {
      fromData.append('file',item.originFileObj)

    })
    // fromData.append('file',file.file.originFileObj)
    // var fileArr = this.state.fileList
    console.log(file)
    axios.post(`${URL}/admin/file/upload`,fromData).then(res => {
      if(res.data.code === 200) {
        message.success('上传成功')
        file.file.status = 'done'
        // console.log(file.fileList)
        file.file.uid = res.data.data
        let fileData = this.state.fileList
        file.file.name = '附件'+ (fileData.length + 1) + ':' + file.file.name
        fileData.push(file.file)
        // Object.assign(fileData, file.fileList)
        console.log(fileData)
        this.setState({fileList: fileData})
      }else {
        message.error(res.data.msg)
      }
    }).catch(error => {
      message.error('上传失败')
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
  
  setSEQ = (e) => {
    if (isNaN(e.target.value)) {
      return
    }
    this.setState({
      params: {...this.state.params,seq: e.target.value}
    })
  }
  // 设置中文标题的值
  setMessageNameZH = (e) => {
    this.setState({
      params: {...this.state.params,messageNameZH: e.target.value}
    })
  }
  // 设置中文副标题的值
  setSubheadingZH = (e) => {
    this.setState({
      params: {...this.state.params,subheadingZH: e.target.value}
    })
  }
  // 设置英文副标题的值
  setSubheadingUS = (e) => {
    this.setState({
      params: {...this.state.params,subheadingUS: e.target.value}
    })
  }
  
  // 设置英文标题
  setMessageNameUS = (e) => {
    this.setState({
      params: {...this.state.params,messageNameUS: e.target.value}
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
      name: 'file',
      
      // action: `${URL}/admin/file/upload`,
      accept: `image/*,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,
      application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/pdf,application/vnd.ms-excel,text/plain,
      application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation`,
      onChange: this.uploadFile,
      multiple: true,
      beforeUpload: this.beforeUpload,
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
        <div id="messsage"></div>
        <Tools></Tools>
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
            <Input style={{width: '300px'}} maxLength={100} value={this.state.params.messageNameZH} onChange={this.setMessageNameZH}/>
          </FormItem>
          <FormItem {...formItemLayout} label="中文副标题">
            <Input style={{width: '300px'}} maxLength={100} value={this.state.params.subheadingZH} onChange={this.setSubheadingZH}/>
          </FormItem>
          <FormItem {...formItemLayout} label="英文标题">
            <Input style={{width: '300px'}} maxLength={250} value={this.state.params.messageNameUS} onChange={this.setMessageNameUS}/>
          </FormItem>
          <FormItem {...formItemLayout} label="英文副标题">
            <Input style={{width: '300px'}} maxLength={250} value={this.state.params.subheadingUS} onChange={this.setSubheadingUS}/>
          </FormItem>
          <FormItem {...formItemLayout} label="排序号">
            <Input style={{width: '300px'}} maxLength={30} value={this.state.params.seq} onInput={this.setSEQ}/>
          </FormItem>
          {
              this.state.params.publishTime ?
              <FormItem {...formItemLayout} label="发布时间">
              <DatePicker defaultValue={''} placeholder={this.state.params.publishTime ? this.formatTime(this.state.params.publishTime) :"请选择日期"} format={'YYYY/MM/DD'} onChange={this.setTime}/>
              </FormItem>
              : null
          }
          <div id="contentZH"></div>
          <FormItem {...formItemLayout} label="中文内容">
            <Editor ref="editorZH" controls={['media']} initialContent={this.state.params.messageContentZH} contentFormat="html" contentId={this.state.editorZHID} editorOnChange={this.editorOnChange}/>
            {/* <TextArea subheadingUS 
              placeholder="请输入视频简介"
              autosize={{ minRows: 4}} /> */}
          </FormItem>
          <div id="contentUS"></div>
          <FormItem {...formItemLayout} label="英文内容">
            <Editor  ref="editorUS"  controls={['media']} initialContent={this.state.params.messageContentUS} contentFormat="html" contentId={this.state.editorUSID} editorOnChange={this.editorOnChangeUS} />
            {/* <TextArea
              placeholder="请输入视频简介"
              autosize={{ minRows: 4}} /> */}
          </FormItem>
          <FormItem {...formItemLayout} label="相关科室">
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Please select"
              value={this.state.defaultDepartment}
              onChange={this.selectOption}
              optionFilterProp={'children'}
              getPopupContainer={triggerNode => triggerNode.parentNode}
            >
              {this.state.option}
            </Select>
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
          <h1 style={{textAlign: 'center', fontSize: '20px'}}>{this.state.params.messageNameZH}</h1>
          <h1 style={{textAlign: 'center', fontSize: '18px'}}>{this.state.params.subheadingZH}</h1>
          <div dangerouslySetInnerHTML={{__html: typeof this.state.params.messageContentZH === 'string' ? this.state.params.messageContentZH : this.state.params.messageContentZH.toHTML()}}></div>
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
          <h1 style={{textAlign: 'center', fontSize: '20px'}}>{this.state.params.messageNameUS}</h1>
          <h1 style={{textAlign: 'center', fontSize: '18px'}}>{this.state.params.subheadingUS}</h1>
          <div dangerouslySetInnerHTML={{__html: typeof this.state.params.messageContentUS === 'string' ? this.state.params.messageContentUS : this.state.params.messageContentUS.toHTML()}}></div>
        </Modal>
          <div id="bottom"></div>
      </div>
    )
  }
}