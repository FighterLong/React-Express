import React,{Component} from 'react'
import {Form, Input, Upload, Button, Modal, Icon, Divider,Select,message, DatePicker} from 'antd'
import moment from 'moment';
import Title from '@/component/title'
// import BraftEditor from 'braft-editor'
import Editor from '@/component/editor'
// import api from 'api'
import axios from 'axios'
import {URL} from '@/common/js/url.js'
import '../../common/stylus/public.styl'

const FormItem = Form.Item
const Option = Select.Option
// const URL = 'http://192.168.0.122:7979'

class scienceReaderEditor extends Component {
  state={
    fileList:[],
    type:[],
    title:'',
    isSave: false,
    editorZHID: 0,
    editorUSID: 1,
    modelZH: false,
    modelUS: false,
    params:{
        "accessoryIds": "",
        "accessoryList": [
          {
            "id": 0,
            "showName": "",
            "storageName": "",
            "uploadTime": 0,
            "url": ""
          }
        ],
        "contentUS": "",
        "contentZH": "",
        "createTime": 0,
        "creator": "",
        "hits": 0,
        "id": 0,
        "publishTime": 0,
        "status": "",
        "titleUS": "",
        "titleZH": "",
        "type": "EMERGRNCY_TREATMENT_GUIDE"
      }
  }

  componentWillMount() {
    this.setState({params: {...this.state.params,type: this.props.match.params.type}})
  }

  componentDidMount(){
    if(this.props.match.params.id !== 'NEW') {
      this.getData();
    }else{
      let seq = sessionStorage.getItem('maxLength') ? parseInt(sessionStorage.getItem('maxLength')) + 1 : 0
      this.setState({params: {...this.state.params, seq}})
    }
  }

  /************************ 数据操作区 start **************************/
  // 获取数据
  getData = () => {
    axios.post(`${URL}/admin/medicalGuide/retrieveOne?id=${this.props.match.params.id}`).then(res => {
      if (res.data.code === 200) {
        this.setState({
          params: res.data.data || this.state.params,
          editorZHID: new Date().getTime()+'ZH',
          editorUSID: new Date().getTime()+'US'
        })
        var arr = [];
      res.data.data.accessoryList.forEach((item,index) => {
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
      console.log(res.data.data)
    }).catch(error => {
      message.error('请求异常')
    })
  }
  // 添加数据
  addData = () => {
    // if (this.state.isSave) {
    //   message.error('频繁操作');
    //   return;
    // }
    let fileIds = [];
    this.state.fileList.forEach(item=>{
      fileIds.push(item.uid)
    })
    fileIds = '['+fileIds.toString() +']'
    fileIds = fileIds.length === 2 ? '': fileIds
    let contentZH = ''
    let contentUS = ''
    if (this.state.params.contentZH) {
      contentZH = typeof this.state.params.contentZH === 'string' ? this.state.params.contentZH : this.state.params.contentZH.toHTML()
    }
    if (this.state.params.contentUS) {
      contentUS = typeof this.state.params.contentUS === 'string' ? this.state.params.contentUS : this.state.params.contentUS.toHTML()
    }
    // let contentUS = typeof this.state.params.contentUS === 'string' ? this.state.params.contentUS : this.state.params.contentUS.toHTML()
    // let contentZH = typeof this.state.params.contentZH === 'string' ? this.state.params.contentZH : this.state.params.contentZH.toHTML()
    this.setState({isSave: true,params: {...this.state.params,accessoryIds:fileIds,contentZH,contentUS}},()=>{
    axios.post(`${URL}/admin/medicalGuide/save`,this.state.params).then(res => {
      if (res.data.code === 200) {
        message.success('添加成功')
        this.issue()
      }else{
        message.error(res.data.msg)
      }
      this.setState({isSave: false})
    }).catch(error => {
      this.setState({isSave: false})
      message.error('请求异常')
    })
  })
  }
  // 修改保存
  updateData = () => {
    if (this.state.isSave) {
      message.error('频繁操作');
      return;
    }
    
    let fileIds = [];
    this.state.fileList.forEach(item=>{
      fileIds.push(item.uid)
    })
    fileIds = '['+fileIds.toString() +']'
    fileIds = fileIds.length === 2 ? '': fileIds
    let contentZH = ''
    let contentUS = ''
    if (this.state.params.contentZH) {
      contentZH = typeof this.state.params.contentZH === 'string' ? this.state.params.contentZH : this.state.params.contentZH.toHTML()
    }
    if (this.state.params.contentUS) {
      contentUS = typeof this.state.params.contentUS === 'string' ? this.state.params.contentUS : this.state.params.contentUS.toHTML()
    }
    // let contentUS
    // if(this.state.params.contentUS){
    //   contentUS = typeof this.state.params.contentUS === 'string' ? this.state.params.contentUS : this.state.params.contentUS.toHTML()
    // }
    // let contentZH = typeof this.state.params.contentZH === 'string' ? this.state.params.contentZH : this.state.params.contentZH.toHTML()
    this.setState({isSave: true,params: {...this.state.params,accessoryIds:fileIds,contentUS,contentZH}},()=>{
      axios.post(`${URL}/admin/medicalGuide/update`,this.state.params).then(res => {
        if (res.data.code === 200) {
          message.success('保存成功')
        }else{
          message.error(res.data.msg)
        }
        this.setState({isSave: false})
      }).catch(error => {
        this.setState({isSave: false})
        message.error('请求异常')
      })
    })
  }
  /************************ 数据操作区 end   **************************/






  /************************ 数据双向绑定区 start  ***************************/
    // 设置中文标题
    setScienceTitleZH = (e)=> {
      this.setState({ params: {...this.state.params, titleZH: e.target.value} })
    }
    // 设置中文副标题的值
    setSubheadingZH = (e) => {
      this.setState({
        params: {...this.state.params,subheadingZH: e.target.value}
      })
    }
    // 设置英文标题
    setScienceTitleUS = (e)=> {
      this.setState({ params: {...this.state.params, titleUS: e.target.value} })
    }
    // 设置英文副标题的值
    setSubheadingUS = (e) => {
      this.setState({
        params: {...this.state.params,subheadingUS: e.target.value}
      })
    }
    // 设置中文内容
    setContentZH = (content)=>{
      this.setState({params:Object.assign({},this.state.params,{contentZH:content})})
    }
    // 设置英文内容
    setContentUS = (content)=>{
      this.setState({params:Object.assign({},this.state.params,{contentUS:content})})
    }
    setSEQ = (e)=>{
      if (isNaN(e.target.value)) {
        return
      }
      this.setState({ params: {...this.state.params, seq: e.target.value} })
      // this.setState({params:Object.assign({},this.state.params,{seq:content})})
    }
  /************************ 数据双向绑定区 end    ***************************/
    // 上传视频
  handleChange = (file) => {
    var fromData = new FormData()
    fromData.append('file',file.file.originFileObj)
    axios.post(`${URL}/admin/file/upload`,fromData).then(res => {
      if(res.data.code === 200) {
        message.success('上传成功')
        let arr = this.state.fileList
        file.file.status = 'deno'
        file.file.uid = res.data.data
        file.file.name = '附件'+ (arr.length + 1) + ':' + file.file.name
        arr.push(file.file)
        this.setState({fileList: arr})
      }else {
        message.error(res.data.msg)
      }
    }).catch(error => {
      message.error('上传失败')
    })
  }

    
  save=()=>{
    if (!this.state.params.seq) {
      message.error('排序号为必填项')
      return
    }
    this.props.match.params.id !== 'NEW' ? this.updateData() : this.addData();
  }



  typeChange=()=>{
  }
  issue=()=>{
    window.history.back(-1)
  }
  nameChange=(e)=>{
    this.setState({ title: e.target.value });
  }
  editorOnRawChange=(rawcon)=>{
    //console.log(rawcon)
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
  render(){

    /****************************** 编辑器初始化赋值 start *********************************/
    // let editorPageZH = {initialContent: this.state.params.contentZH, editorOnChange: this.setContentZH,contentId: this.state.editorZHID}
    // let editorPageUS = {initialContent: this.state.params.contentUS, editorOnChange: this.setContentUS,contentId: this.state.editorUSID}
    /****************************** 编辑器初始化赋值 end   *********************************/


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
    const props={onChange: this.handleChange, multiple: true, onRemove: this.removeFile}
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    )
    return (
      <div className='science-reader-editor'>
        <Title title='编辑内容' />
        <span style={{float: 'right'}}>
          <Button style={{marginLeft: '15px'}} onClick={this.issue}>返回</Button>
          <Button style={{marginLeft: '15px'}} onClick={() => {this.setState({modelZH: true})}}>预览文章(中文)</Button>
          <Button style={{marginLeft: '15px'}} onClick={() => {this.setState({modelUS: true})}}>预览文章(英文)</Button>
          <Button style={{marginLeft: '15px'}} loading={this.state.isSave} type="primary" onClick={this.save}>保存</Button>
        </span>
        <Divider />
        <Form layout="horizontal">
           <FormItem {...formItemLayout} label="中文标题">
             <Input style={{width: '300px'}} maxLength={30} onChange={this.setScienceTitleZH} value={this.state.params.titleZH}/>
           </FormItem>
           <FormItem {...formItemLayout} label="中文副标题">
             <Input style={{width: '300px'}} maxLength={30} onChange={this.setSubheadingZH} value={this.state.params.subheadingZH}/>
           </FormItem>
           <FormItem {...formItemLayout} label="英文标题">
             <Input style={{width: '300px'}} maxLength={50} onChange={this.setScienceTitleUS} value={this.state.params.titleUS}/>
           </FormItem>
           <FormItem {...formItemLayout} label="英文副标题">
             <Input style={{width: '300px'}} maxLength={50} onChange={this.setSubheadingUS} value={this.state.params.subheadingUS}/>
           </FormItem>
           <FormItem {...formItemLayout} label="排序号">
             <Input style={{width: '300px'}} maxLength={6} onChange={this.setSEQ} value={this.state.params.seq}/>
           </FormItem>
          {
              this.state.params.publishTime ?
              <FormItem {...formItemLayout} label="发布时间">
              <DatePicker defaultValue={''} placeholder={this.state.params.publishTime ? this.formatTime(this.state.params.publishTime) :"请选择日期"} format={'YYYY/MM/DD'} onChange={this.setTime}/>
              </FormItem>
              : null
          }
          {/* <FormItem {...formItemLayout} label="相关科室">
            <Select defaultValue={this.state.type} style={{ width: 120 }} >
            </Select>
          </FormItem> */}
          <FormItem {...formItemLayout} label="中文内容">
            <Editor controls={['media']} initialContent={this.state.params.contentZH} contentFormat="html" editorOnChange={this.setContentZH} contentId="1"/>
            {/* <BraftEditor style={{border: '1px solid #666'}} {...editorPageZH}/> */}
          </FormItem>
          <FormItem {...formItemLayout} label="英文内容">
            <Editor controls={['media']} initialContent={this.state.params.contentUS} contentFormat="html" editorOnChange={this.setContentUS} contentId="2"/>
            {/* <Editor controls={['media']}  {...editorPageUS}/> */}
            {/* <BraftEditor style={{border: '1px solid #666'}} {...editorPageUS}/> */}
          </FormItem>
          <FormItem {...formItemLayout} label="附件">
            <Upload  style={{width: '300px'}}  {...props}  fileList={this.state.fileList}>
              <Button>
                <Icon type="upload" /> 上传附件
              </Button>
            </Upload>
          </FormItem>
          {/* <FormItem {...formItemLayout} label="上传轮播图">
          <Upload
            action="//jsonplaceholder.typicode.com/posts/"
            listType="picture-card"
            fileList={this.fileList}
            onPreview={this.handlePreview}
            onChange={this.handleChange}
          >
          {this.state.fileList.length >= 3 ? null : uploadButton}
          </Upload> */}
          {/* </FormItem> */}
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
          <h1 style={{textAlign: 'center', fontSize: '20px'}}>{this.state.params.titleUS}</h1>
          <h1 style={{textAlign: 'center', fontSize: '18px'}}>{this.state.params.subheadingUS}</h1>
          <div dangerouslySetInnerHTML={{__html: this.state.params.contentUS}}></div>
        </Modal>
      </div>
    )
  }
}
export default scienceReaderEditor
