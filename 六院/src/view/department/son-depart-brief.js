import React, {Component} from 'react'
// import {connect} from 'react-redux'
import {Input, Divider, Button, Form, Modal, Upload, Icon, message, Row, Col, DatePicker} from 'antd'
import moment from 'moment';
import Title from '@/component/title'
// import DetailModel from './detail-model'
import Editor from '@/component/editor'
import {URL} from '@/common/js/url.js'
// import {updataNarBar} from '@/store/nav-bar/action'

import CropBox from '@/component/crop-box'
import axios from 'axios'
import './index.styl'


// import {subSite,noSubSite} from '@/store/sub-site/action'
// import {setNavList} from '@/store/sub-site/reducer'
// const store = createStore(setNavList);
// const URL = 'http://192.168.0.122:7979'

const FormItem = Form.Item
const {TextArea} = Input

// @connect(
//   state => ({navBarList: state.navBarList}),

//   {updataNarBar}
// )
// setTimeout(function(){
//   store.dispatch({
//     type: 'SUB_SITE',
//     value: [1,2,2]
//   });console.log(store.getState())},2000)
  
// store.subscribe(()=>{
//   console.log('Redux状态改变了')
//   console.log(store.getState())
// })
export default class SonDepartBrief extends Component {

  state = {
    id: 'NEW',
    visible: false,
    previewVisible : false,
    loading: false,
    previewImage: '',
    departmentId: '',
    // 选择的文件
    uploadFile: '',
    fileNmae: '',
    // 裁剪后的图片
    cropImg: '',
    fileList: [],
    params: {
        "accessoryIds": "",
        "accessoryList": [],
        "contentUS": "",
        "contentZH": "",
        "createTime": 0,
        "creator": "string",
        "departmentId": 1,
        "hits": 0,
        "id": 0,
        "publishTime": 0,
        "status": "ALL",
        "titleUS": "",
        "titleZH": "",
        "type": ""
      }
  }


  /********************* 数据操作 start  ***********************/
  // 上传文件
  uploadFile = (file) => {
    var fromData = new FormData()
    fromData.append('file',file.file.originFileObj)
    // var fileArr = this.state.fileList
    console.log(file)
    axios.post(`${URL}/admin/file/upload`,fromData).then(res => {
      if(res.data.code === 200) {
        message.success('上传成功')
        file.file.status = 'done'
        // console.log(file.fileList)
        file.fileList[file.fileList.length-1].uid = res.data.data
        this.setState({fileList: file.fileList})
      }else {
        message.error(res.data.msg)
      }
    }).catch(error => {
      message.error('上传失败')
    })
  }

  // 新建子网站文章
  saveSonArticle = () => {
    let fileIds = [];
    this.state.fileList.forEach(item=>{
      fileIds.push(item.uid)
    })
    fileIds = '['+fileIds.toString() +']'
    fileIds = fileIds.length === 2 ? '' : fileIds
    // let contentZH = ''
    // let contentUS = ''
    // if (this.state.params.contentZH) {
    //   contentZH = typeof this.state.params.contentZH === 'string' ? this.state.params.contentZH : this.state.params.contentZH.toHTML()
    // }
    // if (this.state.params.contentUS) {
    //   contentUS = typeof this.state.params.contentUS === 'string' ? this.state.params.contentUS : this.state.params.contentUS.toHTML()
    // }
    // let contentZH = typeof this.state.params.contentZH === 'string' ? this.state.params.contentZH : this.state.params.contentZH.toHTML()
    // let contentUS = typeof this.state.params.contentUS === 'string' ? this.state.params.contentUS : this.state.params.contentUS.toHTML()

    this.setState({params: {...this.state.params,accessoryIds:fileIds}}, () => {
      axios.post(`${URL}/admin/department/updateDepartmentSaveArticle`,this.state.params).then((res)=>{
          // res.data.code === 200?message.success('保存成功！'):message.success(message.error(res.data.msg));
          if (res.data.code === 200) {
            message.success('创建成功')
            this.props.history.goBack()
          } else {
            message.error(res.data.msg)
          }
          this.setState({ loading: false })
          // this.props.history.goBack()
      })
    })
  }
  // 保存修改   子网站文章
  updateSonArticle = () => {
    let fileIds = [];
    this.state.fileList.forEach(item=>{
      fileIds.push(item.uid)
    })
    fileIds = '['+fileIds.toString() +']'
    fileIds = fileIds.length === 2 ? '' : fileIds
    // let contentZH = ''
    // let contentUS = ''
    // if (this.state.params.contentZH) {
    //   contentZH = typeof this.state.params.contentZH === 'string' ? this.state.params.contentZH : this.state.params.contentZH.toHTML()
    // }
    // if (this.state.params.contentUS) {
    //   contentUS = typeof this.state.params.contentUS === 'string' ? this.state.params.contentUS : this.state.params.contentUS.toHTML()
    // }
    // let contentZH = typeof this.state.params.contentZH === 'string' ? this.state.params.contentZH : this.state.params.contentZH.toHTML()
    // let contentUS = typeof this.state.params.contentUS === 'string' ? this.state.params.contentUS : this.state.params.contentUS.toHTML()
    this.setState({params: {...this.state.params,accessoryIds:fileIds}}, () => {
      axios.post(`${URL}/admin/department/updateDepartmentUpdateArticle`,this.state.params).then((res)=>{
          res.data.code === 200?message.success('保存成功！'):message.success(message.error(res.data.msg));
          this.setState({ loading: false })
      })
    })
  }
  // 保存子网站简介
  saveSonDesc = () =>{
    axios.post(`${URL}/admin/department/updateWebsiteIntroduction`,this.state.params).then((res)=>{
        res.data.code === 200?message.success('保存成功！'):message.success(message.error(res.data.msg));
        this.setState({ loading: false })
    })
  }
  // 获取文章内容
  getSonArticle = () => {
    axios.get(`${URL}/admin/department/retrieveOneWebsiteArticle?id=${this.state.id}`).then(res => {
        if(res.data.code === 200) {
            this.setState({ params: res.data.data||this.state.params})
            let fileList = [];
            (res.data.data.accessoryList?res.data.data.accessoryList:[]).forEach(item => {
              fileList.push({
                name: item.showName,
                uid: item.id,
                thumbUrl: item.url,
                url: item.url
              })
              // item.name = item.showName;
              // item.uid = item.id;
              // item.thumbUrl = item.url;
            })
            this.setState({ fileList: fileList},() => {
              console.log(this.state.fileList)
            })
        }else {
            message.error(res.data.msg)
        }
    })
  }

  // 获取子网站简介信息
  getSonDesc = () => {
    axios.get(`${URL}/admin/department/retrieveOneWebsiteIntroduction?departmentId=${this.state.params.departmentId}`).then(res => {
        if(res.data.code === 200) {
            this.setState({ params: res.data.data||this.state.params},() => {
              let imgList = [];
              (this.state.params.slideshowList?this.state.params.slideshowList:[]).forEach(item => {
                imgList.push({
                  name: item.showName,
                  uid: item.id,
                  thumbUrl: URL + '/' + item.url + item.storageName,
                  url:  URL + '/' + item.url + item.storageName
                })
              })
              this.setState({ fileList: imgList})
            })
           
        }else {
            message.error(res.data.msg)
        }
    })
  }

  /********************* 数据操作 end    ***********************/
  
  /********************* 数据双向绑定 start ********************/
  setData = (e) => {
    this.setState({ params: {...this.state.params,[e.target.name]: e.target.value}})
  }
  setContentZH = (value) => {
    this.setState({params: {...this.state.params,contentZH: value}})
  }
  setContentUS = (value) => {
    this.setState({params: {...this.state.params,contentUS: value}})
  }
  /********************* 数据双向绑定 end   ********************/
  componentWillReceiveProps(next) {
     // 子网站编辑或者新建内容时  以此为判断 储存科室ID
      // console.log(this.props.match.params.id)
      this.setState({params: {...this.state.params,type: next.match.params.type,departmentId: parseInt(sessionStorage.getItem('sonId'))}},() => {
        // 地址栏ID等于UPDATE时  为子网站简介编辑
       if(next.match.params.id === 'UPDATE') {
         this.getSonDesc();
       }else if(next.match.params.id !== 'NEW' && next.match.params.id !== 'UPDATE'){//为子网站文章编辑
         // console.logg('进来了')
         this.setState({ id: next.match.params.id },()=>{  // 储存文章ID 并获取文章信息
             this.getSonArticle()
         })
       }
     })
  }
  // 根据Route中的参数设置ID
  componentDidMount() {
      // 子网站编辑或者新建内容时  以此为判断 储存科室ID
      // console.log(this.props.match.params.id)
      this.setState({params: {...this.state.params,type: this.props.match.params.type,departmentId: parseInt(sessionStorage.getItem('sonId'))}},() => {
         // 地址栏ID等于UPDATE时  为子网站简介编辑
        if(this.props.match.params.id === 'UPDATE') {
          this.getSonDesc();
        }else if(this.props.match.params.id !== 'NEW' && this.props.match.params.id !== 'UPDATE'){//为子网站文章编辑
          // console.logg('进来了')
          this.setState({ id: this.props.match.params.id },()=>{  // 储存文章ID 并获取文章信息
              this.getSonArticle()
          })
        }
      })
  }
  
  // 返回
  goBack() {
    window.history.back(-1)
  }
  handleOk = () => {
    this.setState({
      lodding: true,
      fileIndex: -1
    })
    // console.log(this.state.cropImg)
    axios.post(`${URL}/admin/file/upload`,this.state.cropImg).then(res => {
      if(res.data.code === 200) {
        message.success('上传成功')
        let ids = this.state.params.slideshowIds ? JSON.parse(this.state.params.slideshowIds) : [];
        ids.push(res.data.data)
        ids = '['+ids.toString()+']'

        this.setState({params: {...this.state.params,slideshowIds: ids}})
      }else {
        message.error(res.data.msg)
      }
      this.setState({
        visible: false,
        lodding: false
      })
    }).catch(error => {
      this.setState({
        visible: false,
        lodding: false
      })
    })
  }
  handlePreview = (file) => {
    // console.log(file)
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }
  handleCancel = () => {
    this.setState({visible: false})
  }

  handleChange = (e) => {
    let reader = new FileReader()
    reader.onload = (file) => {
      this.setState({uploadFile: file.target.result, visible: true})
      // handleChange = ({ fileList }) => this.setState({ fileList })
    }
    reader.readAsDataURL(e);
    
    return false
  }

  // handlePreview = (e) => {
  //   console.log(e)
  // }
// 裁剪后的base64
  cutting = (cropImg,previewImage) => {
    this.setState({cropImg,previewImage})
  }
  // 子网站编辑
  toSeed = () =>{
    window.open(window.location.href.replace('keyDepart','keyDepartSoon/'+this.state.id))
  }


  // 保存编辑
  saveEditor = () => {
    this.setState({
      loading: true
    })
    if(this.props.match.params.id === 'NEW') {
      console.log('新建子网站文章')
      this.saveSonArticle()
    }else if(this.props.match.params.id === 'UPDATE'){
      console.log('编辑子网站简介')
      this.saveSonDesc()
    }else {
      console.log('修改子网站文章')
      this.updateSonArticle()
    }
  }

  uploadFileNme = (fileData) => {
    this.setState({
      fileNmae: fileData.file.name,
      fileList: fileData.fileList
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
  beforeUpload = (file) => {
      const isLt2M = file.size / 1024 / 1024 < 30;
      if (!isLt2M) {
        message.error('附件大小不能超过30M');
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

    const {fileList, previewVisible, previewImage} = this.state

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
    const formItemLayoutBox = {
      labelCol: {
        xs: { span: 2 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 22 },
        sm: { span: 22 },
      },
    };

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="department-ant-upload-text">Upload</div>
      </div>
    );
    // onRemove: this.removeFile
    
    const pageZH =  {
        controls: ['media'],
        video: true,
        audio: true,
        externalMedias: {
            // 上传图片
            image: true,
            // 上传音频
            audio: true,
            // 上传视频
            video: true,
            // 外链
            embed: true },
        height: 300,
        contentId: '1',
        initialContent: this.state.params.contentZH,
        editorOnChange: this.setContentZH,
        placeholder: 'Please enter the content'
    }
    const pageUS =  {
        controls: ['media'],
        video: true,
        audio: true,
        externalMedias: {
            // 上传图片
            image: true,
            // 上传音频
            audio: true,
            // 上传视频
            video: true,
            // 外链
            embed: true },
        height: 300,
        contentId: '2',
        initialContent: this.state.params.contentUS,
        editorOnChange: this.setContentUS,
        placeholder: 'Please enter the content'
    }
    return (
      <div className="department">
        <Title title="编辑内容" />
        <span style={{float: 'right'}}>
          <Button style={{marginLeft: '15px'}} onClick={this.goBack}>返回</Button>
          <Button style={{marginLeft: '15px'}} type="primary" loading={this.state.loading} onClick={this.saveEditor}>保存</Button>
        </span>
        <Divider />
        <Form layout="horizontal">
          <FormItem {...formItemLayout} label="中文标题">
            <Input style={{width: '300px'}} maxLength={30} value={this.state.params.titleZH} name="titleZH" onChange={(e)=>{this.setData(e)}}/>
          </FormItem>
          <FormItem {...formItemLayout} label="英文标题">
            <Input style={{width: '300px'}} maxLength={50} value={this.state.params.titleUS} name="titleUS" onChange={(e)=>{this.setData(e)}}/>
          </FormItem>
          {
            this.state.params.publishTime ?
            <FormItem {...formItemLayout} label="发布时间">
            <DatePicker defaultValue={''} placeholder={this.state.params.publishTime ? this.formatTime(this.state.params.publishTime) :"请选择日期"} format={'YYYY/MM/DD'} onChange={this.setTime}/>
            </FormItem>
            : null
          }
          <FormItem {...formItemLayout} label="中文内容">
            {
                this.props.match.params.id === 'UPDATE'?
                <TextArea
                placeholder="请输入中文内容"
                autosize={{ minRows: 4}} maxLength={5000} value={this.state.params.contentZH} name="contentZH" onChange={(e)=>{this.setData(e)}} />
                :
                 <Editor {...pageZH}/>
            }
          </FormItem>
          <FormItem {...formItemLayout} label="英文内容">
            {
                this.props.match.params.id === 'UPDATE'?
                <TextArea
                  placeholder="请输入英文内容"
                  autosize={{ minRows: 4}} maxLength={10000} value={this.state.params.contentUS} name="contentUS" onChange={(e)=>{this.setData(e)}} />
                :
                 <Editor {...pageUS}/>
            }
          </FormItem>
          {
            this.props.match.params.id === 'UPDATE'?
            <FormItem {...formItemLayout} label="轮播图">
                <Upload
                    // action="//jsonplaceholder.typicode.com/posts/"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    beforeUpload={this.handleChange}
                    onChange={this.uploadFileNme}
                    // customRequest={this.handleChange}
                >
                    {fileList.length >= 3 ? null : uploadButton}
                </Upload>
            </FormItem>
            :
            <FormItem {...formItemLayout} label="附件">
                <Upload
                accept="image/*,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/pdf,application/vnd.ms-excel,text/plain,
                application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                fileList={fileList}
                // onPreview={this.handlePreview}
                beforeUpload={this.beforeUpload}
                onRemove={this.removeFile}
                onChange={this.uploadFile}
                // customRequest={this.handleChange}
                >
                <Button>
                    <Icon type="upload" /> 上传附件
                </Button>
                {/* {fileList.length >= 3 ? null : uploadButton} */}
                </Upload>
            </FormItem>
          }
        </Form>
        <Modal visible={previewVisible} footer={null} onCancel={()=>{this.setState({previewVisible : false})}}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
        <Modal
          title="裁剪图片"
          visible={this.state.visible}
          width="70%"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText="确定"
          cancelText="取消"
          confirmLoading={this.state.lodding}>
          <CropBox
            aspectRatio={16 / 9}
            uploadFile={this.state.uploadFile}
            cutting={this.cutting} 
            fileName={this.state.fileNmae}/>
        </Modal>
      </div>
    )
  }
}