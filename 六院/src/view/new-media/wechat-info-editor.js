import React, {Component} from 'react'
import {Input, Divider, Button,Modal, Form, Select, Upload, Icon, message, DatePicker, Radio } from 'antd'
import moment from 'moment';
// import Title from '@/component/title'
import Editor from '@/component/editor'
import ajx from '../../api/request';
import {URL} from '@/common/js/url.js'
import axios from 'axios'
const RadioGroup = Radio.Group;
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
    // 中英文标题
    name: '',
    contentID: 0,
    // 文件列表
    params: {
        "type": "LINK",
        "content": "",
        "createTime": 0,
        "hits": 0,
        "id": 0,
        "name": "",
        "publishTime": 0,
        "seq": 0,
        "url": '',
        "status": "UNPUBLISH"
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
      this.setState({params: {...this.state.params, type: this.props.match.params.from,navbarId: this.props.match.params.lang, seq}})
    }
  }

  // 切换模式
  changePattern = (e) => {
    this.setState({
      params: {...this.state.params,type: e.target.value},
    })
  }

  saveEditor = (lang = this.state.lang) => {
    if (!this.state.params.seq) {
      message.error('排序号为必填项')
      return
    }
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

  saveUpateHospitalDynamic = () => {
    if (!this.state.params.seq) {
      message.error('排序号为必填项')
      this.setState({submitting: false})
      return
    }
    let content = ""
    if(this.state.params.content){
      content = typeof this.state.params.content === 'string' ? this.state.params.content : this.state.params.content.toHTML()
    }
    // let content = typeof this.state.params.content === 'string' ? this.state.params.content : this.state.params.content.toHTML()
    this.setState({params: {...this.state.params,content}},()=>{
      axios.post(`${URL}/admin/wechatInfo/update`,this.state.params).then((res)=>{
        if(res.data.code === 200) {
          message.success('保存成功');
        }else{
          message.error(res.data.msg);
        }
        this.setState({submitting: false})
      }).catch(error => {
        message.error('异常请求')
      })
    })
  }
  saveAddHospitalDynamic = () => {
    if (!this.state.params.seq) {
      message.error('排序号为必填项')
      return
    }
    let content = ""
    if(this.state.params.content){
      content = typeof this.state.params.content === 'string' ? this.state.params.content : this.state.params.content.toHTML()
    }
    // let content = typeof this.state.params.content === 'string' ? this.state.params.content : this.state.params.content.toHTML()
    
    this.setState({params: {...this.state.params,content}},()=>{
      axios.post(`${URL}/admin/wechatInfo/create`,this.state.params).then(res => {
        if(res.data.code === 200) {
          message.success('保存成功');
          this.props.history.goBack();
        }else{
          message.error(res.data.msg);
        }
        this.setState({submitting: false})
      }).catch(error => {
        message.error('异常请求')
      })
    })
  }

  // 根据id获取内容
  getDataById = (id) => {
    axios.post(`${URL}/admin/wechatInfo/retrieveOne?id=${id}`).then(res => {
      if(res.data.code === 200) {
          res.data.data.content = res.data.data.content.indexOf('<p>') === -1 ? '<p>' + res.data.data.content +'</p>' : res.data.data.content
          this.setState({
            params: res.data.data,
            contentID: new Date().getTime()+'US'
          })
          // window.open(res.data.data.contentUrl)
          // this.setState({iframeUrl: res.data.data.contentUrl,visible: true})
      }else {
          message.error(res.data.msg)
      }
  })
  }

  editorOnChange = (editorContent) => {
    // let content = typeof editorContent === 'string' ? editorContent : editorContent.toHTML()
    this.setState({params:{...this.state.params,content: editorContent}})
  }

  // 设置中文标题的值
  setMessageNameZH = (e) => {
    this.setState({
      params: {...this.state.params,name: e.target.value}
    })
  }

  setMessageSEQ = (e) => {
    if (isNaN(e.target.value)) {
      return
    }
    this.setState({
      params: {...this.state.params,seq: e.target.value}
    })
  }
  setMessageURL = (e) => {
    this.setState({
      params: {...this.state.params,url: e.target.value}
    })
  }

  setSEQ = (e) => {
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

  render () {
    
    // const editorProps = {
    //   height: 500,
    //   contentFormat: 'html',
    //   initialContent: this.state.messagecontent,
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
      onChange: this.uploadFile,
      multiple: true,
      onRemove: this.removeFile
    };
    
    // this.setState({
    //   messageNameZH: this.state.messageNameZH,
    //   messageNameUS: this.state.messageNameUS,
    //   messagecontent: this.state.messagecontent,
    //   messageContentUS:this.state.messageContentUS
    // })
    // let value = ''
    // function changeValue() {
    //   console.log(value)
    // }
    // const dateFormat = 'YYYY/MM/DD';
    return (
      <div className="department">
        {/* <Title title={`编辑内容：${this.state.lang === 'ZH' ? '中文' : '英文'}`} /> */}
        
        <span style={{float: 'right',paddingBottom: '20px'}}>
          <Button style={{marginLeft: '15px'}} onClick={() => {this.props.history.goBack()}}>返回</Button>
          <Button style={{marginLeft: '15px'}} onClick={() => {this.setState({modelZH: true})}}>预览文章</Button>
          <Button style={{marginLeft: '15px'}} type="primary" loading={this.state.submitting} onClick={this.saveEditor} >保存</Button>
        </span>
        <Divider />
        <Form layout="horizontal">
          {/* <Input style={{width: '300px'}} value={value} onChange={changeValue}/> */}
          <FormItem {...formItemLayout} label="标题">
            <Input style={{width: '300px'}} maxLength={100} value={this.state.params.name} onChange={this.setMessageNameZH}/>
          </FormItem>
          <FormItem {...formItemLayout} label="排序号">
            <Input style={{width: '300px'}} maxLength={100} value={this.state.params.seq} onChange={this.setMessageSEQ}/>
          </FormItem>
          <FormItem {...formItemLayout} label="视频模式">
            <RadioGroup onChange={this.changePattern} value={this.state.params.type}>
              <Radio value="CONTENT">内容模式</Radio>
              <Radio value="LINK">外链模式</Radio>
            </RadioGroup>
          </FormItem>
          {
            this.state.params.publishTime ?
            <FormItem {...formItemLayout} label="发布时间">
              <DatePicker defaultValue={''} placeholder={this.state.params.publishTime ? this.formatTime(this.state.params.publishTime) :"请选择日期"} format={'YYYY/MM/DD'} onChange={this.setTime}/>
            </FormItem>
            : null
          }
           {/* <FormItem {...formItemLayout} label="排序号">
             <Input style={{width: '300px'}} maxLength={50} onChange={this.setSEQ} value={this.state.params.seq}/>
           </FormItem> */}
          <FormItem {...formItemLayout} label="中文内容">
            {this.state.params.type === 'LINK' ? <Input style={{width: '300px'}} value={this.state.params.url} onChange={this.setMessageURL}></Input> :
            <Editor controls={['media']} initialContent={this.state.params.content} contentFormat="html" contentId={this.state.contentID} editorOnChange={this.editorOnChange}/>
          }
            {/* <TextArea
              placeholder="请输入视频简介"
              autosize={{ minRows: 4}} /> */}
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
          <h1 style={{textAlign: 'center', fontSize: '20px'}}>{this.state.params.name}</h1>
          <div dangerouslySetInnerHTML={{__html: this.state.params.content}}></div>
        </Modal>
      </div>
    )
  }
}