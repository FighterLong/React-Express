import React, {Component} from 'react'
import {Input, Divider, Button, Form, Modal, Select, Upload, Icon, message,DatePicker } from 'antd'
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


export default class KeyDepartBrief extends Component {

  state = {
    // 编辑的语言
    lang: 'ZH',
    id: 'NEW',
    // 提交中
    submitting: false,
    // 中英文标题
    messageNameZH: '',
    messageNameUS: '',
    urlType: 'researchTeaching',
    modelZH: false,
    modelUS: false,
    // 富文本编辑框contentId
    contentIdZH: 2,
    contentIdUS: 1,
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
        "accessoryList": [],
        "contentUS": "",
        "contentZH": "",
        "createTime": 0,
        "hits": 0,
        "id": 0,
        "nameUS": "",
        "nameZH": "",
        "navbarId": 20,
        "publishTime": 0,
        "slideshowIds": "",
        "slideshowList": [],
        "status": "UNPUBLISH"
      }
  }



  componentDidMount () {
    console.log(this.props.location.pathname)
    console.log(this.props.location.pathname.indexOf('ResearchEditor'))
    // console.log(this.props.match.params.from)
    let urlType = 'researchTeaching'
    if (this.props.location.pathname.indexOf('ResearchEditor') !== -1) {
      urlType = 'researchTeaching'
    } else {
      urlType = 'teaching'
    }
    if(this.props.match.params.id !== 'NEW') {
      this.setState({params: {...this.state.params, id: this.props.match.params.id, navbarId: this.props.match.params.navId},urlType},() => {
        this.getDataById(this.props.match.params.id);
      })
    }else {
      let seq = sessionStorage.getItem('maxLength') ? parseInt(sessionStorage.getItem('maxLength')) + 1 : 0
      this.setState({params: {...this.state.params, navbarId: this.props.match.params.navId,seq},urlType})
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

  // 医院公告编辑内容接口
  saveUpateHospitalDynamic = () => {
    if (!this.state.params.seq) {
      message.error('排序号为必填项')
      this.setState({submitting: false})
      return
    }
    
    let fileIds = [];
    this.state.fileList.forEach(item=>{
      fileIds.push(item.uid)
    })
    fileIds = '['+fileIds.toString() +']'
    fileIds = fileIds.length === 2 ? '' : fileIds
    // console.log(this.state.params.contentZH)
    let contentZH = ""
    let contentUS = ""
    if (this.state.params.contentZH) {
      contentZH = typeof this.state.params.contentZH === 'string' ? this.state.params.contentZH : this.state.params.contentZH.toHTML()
    }
    if (this.state.params.contentUS) {
      contentUS = typeof this.state.params.contentUS === 'string' ? this.state.params.contentUS : this.state.params.contentUS.toHTML()
    }
    // let contentUS = typeof this.state.params.contentUS === 'string' ? this.state.params.contentUS : this.state.params.contentUS.toHTML();
    // let contentZH = typeof this.state.params.contentZH === 'string' ? this.state.params.contentZH : this.state.params.contentZH.toHTML();
    this.setState({params: {...this.state.params,contentZH,contentUS,accessoryIds:fileIds}},() => {
      ajx.post(`${URL}/admin/${this.state.urlType}/update`,this.state.params).then((res)=>{
        if(res.code === 200) {
          message.success('保存成功');
          console.log(res)
          this.setState({submitting: false})
        }else{
          message.error(res.msg);
          this.setState({submitting: false})
        }
      }).catch(error => {
        message.error('异常请求')
        this.setState({submitting: false})
      })
    })
  }
  saveAddHospitalDynamic = () => {
    if (!this.state.params.seq) {
      message.error('排序号为必填项')
      this.setState({submitting: false})
      return
    }
    
    let fileIds = [];
    this.state.fileList.forEach(item=>{
      fileIds.push(item.uid)
    })
    fileIds = '['+fileIds.toString() +']'
    fileIds = fileIds.length === 2 ? '' : fileIds

    let contentZH = ""
    let contentUS = ""
    if (this.state.params.contentZH) {
      contentZH = typeof this.state.params.contentZH === 'string' ? this.state.params.contentZH : this.state.params.contentZH.toHTML()
    }
    if (this.state.params.contentUS) {
      contentUS = typeof this.state.params.contentUS === 'string' ? this.state.params.contentUS : this.state.params.contentUS.toHTML()
    }
    // let contentUS = typeof this.state.params.contentUS === 'string' ? this.state.params.contentUS : this.state.params.contentUS.toHTML()
    // let contentZH = typeof this.state.params.contentZH === 'string' ? this.state.params.contentZH : this.state.params.contentZH.toHTML()
    this.setState({params: {...this.state.params,contentUS,contentZH,accessoryIds:fileIds}},() => {
      ajx.post(`${URL}/admin/${this.state.urlType}/save`,this.state.params).then(res => {
        if(res.code === 200) {
          message.success('保存成功');
          this.setState({submitting: false})
          this.props.history.goBack()
        }else{
          message.error(res.msg);
          this.setState({submitting: false})
        }
      }).catch(error => {
        message.error('异常请求')
        this.setState({submitting: false})
      })
    })
  }

  // 根据id获取内容
  getDataById = (id) => {
    ajx.get(`${URL}/admin/${this.state.urlType}/retrieveOne?id=${id}`).then((res)=>{
        if(res.code === 200) {
          this.setState({
            params: res.data,
            contentIdZH: new Date().getTime() + 'ZH',
            contentIdUS: new Date().getTime() + 'US'
          })
          let arr = []
          res.data.accessoryList&&res.data.accessoryList.forEach((item, index) => {
                arr.push({
                name: '附件' + (index + 1) + ':' + item.showName,
                uid: item.id,
                thumbUrl: item.url,
                url: URL + '/' + item.url + item.storageName
                })
            })
          this.setState({ fileList: arr})
        }
    })
  }

  editorOnChange = (editorContent) => {
    this.setState({params:{...this.state.params,contentZH:editorContent}})
    console.log(editorContent)
  }

  editorOnChangeUS = (editorContent) => {
    this.setState({params:{...this.state.params,contentUS:editorContent}})
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
    file.fileList.forEach(item => {
      fromData.append('file',item.originFileObj)
    })
    axios.post(`${URL}/admin/file/upload`,fromData).then(res => {
      if(res.data.code === 200) {
        message.success('上传成功')
        file.file.status = 'done'
        file.file.uid = res.data.data
        let fileData = this.state.fileList
        file.file.name = '附件'+ (fileData.length + 1) + ':' + file.file.name
        fileData.push(file.file)
        this.setState({fileList: fileData})
      }else {
        message.error(res.data.msg)
      }
    }).catch(error => {
      message.error('上传失败')
    })
    // this.setState({isCheckFile: true})
    // var fromData = new FormData()
    // // fromData.append('file',file.file.originFileObj)
    // file.fileList.forEach(item => {
    //   fromData.append('file',item.originFileObj)
    // })
    // axios.post(`${URL}/admin/file/upload`,fromData).then(res => {
    //   if(res.data.code === 200) {
    //     message.success('上传成功')
    //     file.file.status = 'done'
    //     let Ids = this.state.params.accessoryIds?JSON.parse(this.state.params.accessoryIds):[];
    //     Ids.push(res.data.data)
    //     Ids = `[${Ids.toString()}]`
    //     let fileData = this.state.fileList
    //     file.file.name = '附件'+ (fileData.length + 1) + ':' + file.file.name
    //     fileData.push(file.file)
    //     this.setState({params:{...this.state.params,accessoryIds: Ids},isCheckFile: false,fileList: fileData})
    //   }else {
    //     message.error(res.data.msg)
    //   }
    // }).catch(error => {
    //   message.error('上传失败')
    // })
  }

  // 设置中文标题的值
  setMessageNameZH = (e) => {
    this.setState({
      params: {...this.state.params,nameZH: e.target.value}
    })
  }
  // 设置中文副标题的值
  setSubheadingZH = (e) => {
    this.setState({
      params: {...this.state.params,subheadingZH: e.target.value}
    })
  }
  
  // 设置英文标题
  setMessageNameUS = (e) => {
    this.setState({
      params: {...this.state.params,nameUS: e.target.value}
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
  removeFile = (info) => {
    // console.log(info)
    let arr = this.state.fileList;
    let arr2 = this.state.params.accessoryIds && JSON.parse(this.state.params.accessoryIds)
    arr.forEach((item,index)=>{
      // console.log(item)
      if(item.uid === info.uid){
        arr.splice(index,1)
        arr2.splice(index,1)
      }
    })
    this.setState({fileList: arr, params: {...this.state.params,accessoryIds: `[${arr2.toString()}]`}})
    // console.log(e)
  }

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
    //   action: '//jsonplaceholder.typicode.com/posts/',
      accept: `image/*,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,
      application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/pdf,application/vnd.ms-excel,text/plain,
      application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation`,
      onChange: this.uploadFile,
      onRemove: this.removeFile,
      beforeUpload: this.beforeUpload,
      multiple: true,
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
            <Input style={{width: '300px'}} maxLength={100} value={this.state.params.nameZH} onChange={this.setMessageNameZH}/>
          </FormItem>
          <FormItem {...formItemLayout} label="中文副标题">
            <Input style={{width: '300px'}} maxLength={100} value={this.state.params.subheadingZH} onChange={this.setSubheadingZH}/>
          </FormItem>
          <FormItem {...formItemLayout} label="英文标题">
            <Input style={{width: '300px'}} maxLength={250} value={this.state.params.nameUS} onChange={this.setMessageNameUS}/>
          </FormItem>
          <FormItem {...formItemLayout} label="英文副标题">
            <Input style={{width: '300px'}} maxLength={250} value={this.state.params.subheadingUS} onChange={this.setSubheadingUS}/>
          </FormItem>
          <FormItem {...formItemLayout} label="排序号">
            <Input style={{width: '300px'}} maxLength={30} value={this.state.params.seq} onChange={this.setSEQ}/>
          </FormItem>
          {
              this.state.params.publishTime ?
              <FormItem {...formItemLayout} label="发布时间">
              <DatePicker defaultValue={''} placeholder={this.state.params.publishTime ? this.formatTime(this.state.params.publishTime) :"请选择日期"} format={'YYYY/MM/DD'} onChange={this.setTime}/>
              </FormItem>
              : null
          }
          <FormItem {...formItemLayout} label="中文内容">
            <Editor controls={['media']} initialContent={this.state.params.contentZH} contentFormat="html" contentId={this.state.contentIdZH} editorOnChange={this.editorOnChange}/>
            {/* <TextArea
              placeholder="请输入视频简介"
              autosize={{ minRows: 4}} /> */}
          </FormItem>
          <FormItem {...formItemLayout} label="英文内容">
            <Editor controls={['media']} initialContent={this.state.params.contentUS} contentFormat="html" contentId={this.state.contentIdUS} editorOnChange={this.editorOnChangeUS} />
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
          <h1 style={{textAlign: 'center', fontSize: '20px'}}>{this.state.params.nameZH}</h1>
          <h1 style={{textAlign: 'center', fontSize: '18px'}}>{this.state.params.subheadingZH}</h1>
          <div dangerouslySetInnerHTML={{__html: this.state.params.contentZH}}></div>
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
          <h1 style={{textAlign: 'center', fontSize: '20px'}}>{this.state.params.nameUS}</h1>
          <h1 style={{textAlign: 'center', fontSize: '18px'}}>{this.state.params.subheadingUS}</h1>
          <div dangerouslySetInnerHTML={{__html: this.state.params.contentUS}}></div>
        </Modal>
      </div>
    )
  }
}