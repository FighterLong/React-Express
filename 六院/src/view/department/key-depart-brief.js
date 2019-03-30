import React, {Component} from 'react'
// import {connect} from 'react-redux'
import {Input, Divider, Button, Form, Modal, Upload, Icon, message, Row, Col, DatePicker} from 'antd'
import moment from 'moment';
import Title from '@/component/title'
import DetailModel from './detail-model'
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
const confirm = Modal.confirm;

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
export default class KeyDepartBrief extends Component {

  state = {
    id: 'NEW',
    visible: false,
    previewVisible : false,
    lodding: false,
    success: false,
    contentZHID: 0,
    contentUSID: 0,
    previewImage: '',
    // 选择的文件
    uploadFile: '',
    fileNmae: '',
    // 裁剪后的图片
    cropImg: '',
    fileList: [],

    // 病区
    inpatientAreaList: [],
    inpatientAreaFileList: [],
    fileIndex: -1,
    params: {
      "contentUS": "<p></P>",
      "contentZH": "<p></P>",
      "createTime": 0,
      "creator": "",
      "id": 0,
      "inpatientAreaList": [],
      "nameUS": "",
      "nameZH": "",
      "navbarId": 21,
      "parrern": "CONTENT",
      "parrernContent": "",
      "publishTime": 0,
      "slideshowIds": "",
      "slideshowList": [],
      "status": "UNPUBLISH"
    }
  }


  /********************* 数据操作 start  ***********************/
  // 获取单个数据
  getOneData = () => {
    axios.get(`${URL}/admin/department/retrieveOne?id=${this.state.id}`).then(res => {
      if(res.data.code === 200) {
        let data = res.data.data
        this.setState({params: data},()=>{
          let inpatientAreaList = data.inpatientAreaList.map(item => {
            item.id = 0
            return item
          })
          inpatientAreaList.forEach(item => {
            let imgList = []
            item.slideshowList.forEach(item => {
              imgList.push({
                name: item.showName,
                uid: item.id,
                thumbUrl: URL + '/' + item.url + item.storageName,
                url:  URL + '/' + item.url + item.storageName
              })
            })
            item.slideshowList = imgList
          })
          this.setState({inpatientAreaList: data.inpatientAreaList})
        })
        
        let imgList = [];
        this.state.params.slideshowList.forEach(item => {
          imgList.push({
            name: item.showName,
            uid: item.id,
            thumbUrl: URL + '/' + item.url + item.storageName,
            url:  URL + '/' + item.url + item.storageName
          })
        })
        this.setState({ fileList: imgList})
      }else {
        message.error(res.data.msg)
      }
    })
  }
  // 保存科室简介
  saveDesc = () => {
    // let fileIds = [];
    // this.state.fileList.forEach(item=>{
    //   fileIds.push(item.uid)
    // })
    // fileIds = '['+fileIds.toString() +']'
    // fileIds = fileIds.length === 2 ? '' : fileIds
    let slideshowIds = this.state.params.slideshowIds
    slideshowIds = slideshowIds.length <= 2 ? '' : slideshowIds
    this.setState({
      isSave: true,
      params: {
        ...this.state.params,
        // slideshowIds: fileIds,
        slideshowIds: slideshowIds,
        slideshowList: this.state.fileList
      }},()=>{
      axios.post(`${URL}/admin/department/saveOrUpdateIntroduction`,this.state.params).then(res=>{
        res.data.code === 200 ? message.success('保存成功'):message.error(res.data.msg)
        this.setState({lodding: false})
      }).catch(error=>{message.error('异常请求')
      this.setState({lodding: false})})
    })
  }
  // 添加
  addData = (toSeed) => {
    // let contentUS =  ''
    // let contentZH =  ''
    // contentUS = contentUS || ''
    // contentZH = contentZH || ''
    // console.log(contentUS )
    // console.log(contentZH )
    this.setState({
      params: {...this.state.params,parrern: this.state.params.parrern?this.state.params.parrern: 'CONTENT',
        slideshowIds: this.state.params.slideshowIds?this.state.params.slideshowIds: '',
        slideshowList: this.state.params.slideshowList?this.state.params.slideshowList: [],
        id: this.state.params.id?this.state.params.id: 0,
        parrernContent: this.state.params.parrernContent ? this.state.params.parrernContent: '',
        status: this.state.params.status ? this.state.params.status : 'ALL',
        // contentUS,
        // contentZH
      }
    },()=>{
      axios.post(`${URL}/admin/department/create`,this.state.params).then(res => {
        if(res.data.code === 200) {
          message.success('添加成功')
          toSeed && sessionStorage.setItem('sonId',res.data.data)
          toSeed && this.setState({id: res.data.data},() => {
            let windowObj = window.open(window.location.href.replace('keyDepartUpdate','SonDepart/'+this.state.id+'/DYNAMIC'))
            if (windowObj === null || window === undefined) {
              alert('浏览器禁止弹出窗口，请手动允许')
            }
          })
          this.props.history.goBack()
          // alert('不执行')
          // console.log(windowObj)
          // toSeed && this.goBack()
        }else {
          message.error(res.data.msg)
        }
        this.setState({lodding: false})
      }).catch(error => {
        message.error('异常请求')
        this.setState({lodding: false})
      })
    })
  }
  // 保存修改
  saveData = (toSeed) => {
    // let contentUS =  ''
    // let contentZH =  ''
    // contentUS = contentUS || ''
    // contentZH = contentZH || ''
    // typeof this.state.params.contentUS === 'string' ? this.state.params.contentUS : this.state.params.contentUS.toHTML()
    // let contentZH = typeof this.state.params.contentZH === 'string' ? this.state.params.contentZH : this.state.params.contentZH.toHTML()
    this.setState({params: {...this.state.params}},() => {
      axios.post(`${URL}/admin/department/update`,this.state.params).then(res => {
        if(res.data.code === 200) {
          message.success('保存成功')
          toSeed && window.open(window.location.href.replace('keyDepartUpdate','SonDepart/'+this.state.id+'/DYNAMIC'))
        }else {
          message.error(res.data.msg)
        }
        this.setState({lodding: false})
      }).catch(error => {
        message.error('异常请求')
        this.setState({lodding: false})
      })
    })
  }
  // 获取单个科室简介
  getSeedInfo = () => {
    axios.get(`${URL}/admin/department/retrieveOneIntroduction?navbarId=${this.props.match.params.navId}`).then(res => {
      if(res.data.code === 200) {
        this.setState({ params: res.data.data||this.state.params,
          contentZHID: new Date().getTime() + 'ZH',
          contentUSID: new Date().getTime() + 'US',})

          let imgList = [];
          res.data.data && res.data.data.slideshowList.forEach(item => {
            imgList.push({
              name: item.showName,
              uid: item.id,
              thumbUrl: URL + '/' + item.url + item.storageName,
              url:  URL + '/' + item.url + item.storageName
            })
          })
          this.setState({ fileList: imgList})
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
  /********************* 数据双向绑定 end   ********************/
  
  // 根据Route中的参数设置ID
  componentDidMount() {
    // console.log()
    this.setState({params: {...this.params, navbarId: this.props.match.params.navId ? this.props.match.params.navId : 0}})
    if(this.props.match.params.id !== 'NEW' && this.props.match.params.id !== 'UPDATE'){
        this.setState({ id: this.props.match.params.id },()=>{this.getOneData()})
      // }
    }else {
      this.setState({ id: this.props.match.params.id })
    }
    if(this.props.match.params.id === 'UPDATE') {
      this.getSeedInfo()
    }
  }
  // componentWillReceiveProps() {
  //   // console.log(this.props.match.params.navId)
  //   this.setState({params: {...this.params, navbarId: this.props.match.params.navId ? this.props.match.params.navId : 0}})
  //   if(this.props.match.params.id !== 'NEW' && this.props.match.params.id !== 'UPDATE'){
  //       this.setState({ id: this.props.match.params.id },()=>{this.getOneData()})
  //     // }
  //   }else {
  //     this.setState({ id: this.props.match.params.id })
  //   }
  //   if(this.props.match.params.id === 'UPDATE') {
  //     this.getSeedInfo()
  //   }
  // }
  // 返回
  goBack() {
    window.history.back(-1)
  }
  handleOk = () => {
    // console.log(this.state.fileIndex)
    this.state.fileIndex !== -1 ? this.inpatientAreaListFile(this.state.fileIndex) : this.uploadFileDepart()
  }

  uploadFileDepart = () => {
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

        // let fileList = [];
        // this.state.fileList.forEach(item => {
        //   item.thumbUrl = this.state.cropImg
        //   fileList.push(item)
        // })
        this.setState({params: {...this.state.params,slideshowIds: ids}})
      }else {
        message.error(res.data.msg)
      }
      this.setState({
        visible: false,
        lodding: false
      })
    }).catch(error => {
      // message.error('上传失败')
      this.setState({
        // fileList: [],
        visible: false,
        lodding: false
      })
    })
  }


  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    })
  }
  handleCancel = () => {
    let fileList = this.state.fileList
    fileList.splice(fileList.length-1,1)
    this.setState({visible: false,cropImg: '',fileList})
  }


  // 移除轮播图
  removeFile = (info) => {
    // console.log(info)
    let arr = this.state.fileList;
    
    let ids = typeof this.state.params.slideshowIds === 'string' ? JSON.parse(this.state.params.slideshowIds) : this.state.params.slideshowIds;
    // console.log(Array.isArray(JSON.parse(this.state.params.slideshowIds)))
    arr.forEach((item,index)=>{
      if(item.uid === info.uid){
        arr.splice(index,1)
        ids.splice(ids.indexOf(info.uid),1)
      }
    })
    this.setState({fileList2: arr,params: {...this.state.params,slideshowIds: `[${ids.toString()}]`}})
    // console.log(ids)
    // console.log(e)
  }
  // 移除病区轮播图
  removeFile2 = (info,index) => {
    // console.log(info)
    let arr = this.state.inpatientAreaFileList;
    
    let ids = typeof this.state.inpatientAreaList[index].slideshowIds === 'string' ? JSON.parse(this.state.inpatientAreaList[index].slideshowIds) : this.state.inpatientAreaList[index].slideshowIds;
    // console.log(Array.isArray(JSON.parse(this.state.params.slideshowIds)))
    arr.forEach((item,index)=>{
      if(item.uid === info.uid){
        arr.splice(index,1)
        ids.splice(ids.indexOf(info.uid),1)
      }
    })
    let inpatientAreaList = this.state.inpatientAreaList
    inpatientAreaList[index].slideshowIds = ids.toString()? `[${ids.toString()}]`:''
    this.setState({inpatientAreaFileList: arr,inpatientAreaList: inpatientAreaList})
    // console.log(ids)
    // console.log(e)
  }

  handleChange = (e,index) => {
    let reader = new FileReader()
    reader.onload = (file) => {
      if(typeof index === 'number'){
        this.setState({uploadFile: file.target.result, fileIndex: index}, () => {
          this.setState({visible: true})
        })
      }else{
        this.setState({uploadFile: file.target.result, fileIndex: -1}, () => {
          this.setState({visible: true})
        })
      }
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
    // console.log(previewImage)
    console.log(this.state.fileIndex)
    let fileList = this.state.fileIndex === -1 ? this.state.fileList : this.state.inpatientAreaFileList
    fileList[fileList.length-1].url = previewImage
    this.state.fileIndex === -1 ? this.setState({cropImg,previewImage,fileList}) : this.setState({cropImg,previewImage,inpatientAreaFileList: fileList})
  }
  // 子网站编辑
  toSeed = () =>{
    if(this.state.id === 'NEW') {
      confirm({
        title: '提示',
        content: '必须创建科室才能编辑其子网站，确定创建吗',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk:() =>{
          this.addData('toSeed')
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    }else{
      confirm({
        title: '提示',
        content: '会保存现有的操作，确定保存吗？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk:() => {
          sessionStorage.setItem('sonId',this.state.id)
          this.saveData('toSeed')
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    }
    // sessionStorage.setItem('departmentName',sessionStorage.getItem('key'))
    // window.open(window.location.href.replace('keyDepartUpdate','SonDepart/'+this.state.id+'/DYNAMIC'))
  }

  // 保存编辑
  saveEditor = () => {
    this.setState({
      lodding: true
    })
    let inpatientAreaList = this.state.inpatientAreaList.map(item => {
      // if (item.contentUS){
      //   item.contentUS = typeof item.contentUS === 'string' ? item.contentUS : item.contentUS.toHTML()
      // }
      // if (item.contentZH) {
      //   item.contentZH = typeof item.contentZH === 'string' ? item.contentZH : item.contentZH.toHTML()
      // }
      return item
    })
    if(this.state.id === 'NEW') {
      this.setState({params: {...this.state.params,inpatientAreaList }},()=>{
        this.addData()
      })
    }else if(this.state.id === 'UPDATE'){
      this.saveDesc()
    }else {
      this.setState({params: {...this.state.params,inpatientAreaList}},()=>{
        this.saveData()
      })
    }
  }

  uploadFileNme = (fileData,flag) => {
    // console.log(fileData.fileList)
    if(flag) {
      this.setState({
        fileNmae: fileData.file.name,
        inpatientAreaFileList: fileData.fileList
      })
      return
    }
    this.setState({
      fileNmae: fileData.file.name,
      fileList: fileData.fileList
    })
  }

  // 添加病区
  addInpatientAreaList = () => {
    let arr = this.state.inpatientAreaList
    if(arr.length >= 8){
      message.error('病区最多添加8个！!');
      return
    }
    arr.push({
        "contentUS": "",
        "contentZH": "",
        "id": 0,
        "slideshowIds": "",
        "slideshowList": [],
        "titleUS": "",
        "titleZH": ""
    })
    this.setState({inpatientAreaList: arr})
  }
  // 删除病区
  delInpatientAreaList = (index) => {
    let arr = this.state.inpatientAreaList
    arr.splice(index,1)
    this.setState({inpatientAreaList: arr}, () => {
      let zhElement = document.querySelector(`#editor${index}ZH`)
      let usElement = document.querySelector(`#editor${index}US`)
      zhElement.parentNode.removeChild(zhElement)
      usElement.parentNode.removeChild(usElement)
    })
  }
  // 病区的文件上传
  inpatientAreaListFile = (index) => {
    this.setState({
      lodding: true
    })
    var inpatientAreaList = this.state.inpatientAreaList
    axios.post(`${URL}/admin/file/upload`,this.state.cropImg).then(res => {
      if(res.data.code === 200) {
        message.success('上传成功')
        let ids = inpatientAreaList[index].slideshowIds ? JSON.parse(inpatientAreaList[index].slideshowIds) : [];
        // console.log(this.state.fileList)
        // this.setState({fileList})
        this.state.inpatientAreaFileList.map(item => {
          item.status = 'done'
        })
        
        inpatientAreaList[index].slideshowList =  this.state.inpatientAreaFileList
        ids.push(res.data.data)
        ids = '['+ids.toString()+']'
        inpatientAreaList[index].slideshowIds =  ids 
        this.setState({inpatientAreaList: inpatientAreaList})
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
  // 病区的标题双向绑定
  setInpatientAreaListTitle = (e,index) => {
    let arr = this.state.inpatientAreaList
    arr[index][e.target.name] = e.target.value
    this.setState({inpatientAreaList: arr})
  }
  // 病区的中文内容双向绑定
  setInpatientAreaListContentZH = (value,index) => {
    let arr = this.state.inpatientAreaList
    arr[index].contentZH = value
    this.setState({inpatientAreaList: arr})
  }
  // 
  editorOnChange = (editorContent) => {
    this.setState({params:{...this.state.params,contentZH:editorContent}})
  }

  editorOnChangeUS = (editorContent) => {
    this.setState({params:{...this.state.params,contentUS: editorContent}})
  }
  // 病区的英文内容双向绑定
  setInpatientAreaListContentUS = (value,index) => {
    let arr = this.state.inpatientAreaList
    arr[index].contentUS = value
    this.setState({inpatientAreaList: arr})
  }

  changeType = (val) => {
    this.setState({params: {...this.state.params,parrern: val}})
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
    
    const page =  {
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
        // initialContent: '',
        editorOnChange: function(){},
        placeholder: '请输入内容'
    }
    // const fileList2 = []
    // 病区
    let inpatientAreaList = []

    return (
      <div className="department">
        <Title title="编辑内容" />
        <span style={{float: 'right'}}>
          <Button style={{marginLeft: '15px'}} onClick={this.goBack}>返回</Button>
          <Button style={{marginLeft: '15px'}} type="primary" loading={this.state.lodding} onClick={this.saveEditor}>保存</Button>
        </span>
        <Divider />
        <Form layout="horizontal">
          {
            this.state.id !== 'UPDATE'?
            <div>
              <FormItem {...formItemLayout} label="中文科室名称">
                <Input maxLength={30} style={{width: '300px'}} value={this.state.params.nameZH} name="nameZH" onChange={(e)=>{this.setData(e)}}/>
              </FormItem>
              <FormItem {...formItemLayout} label="英文科室名称">
                <Input maxLength={50} style={{width: '300px'}} value={this.state.params.nameUS} name="nameUS" onChange={(e)=>{this.setData(e)}}/>
              </FormItem>
            </div>
            :
            <div>
              <FormItem {...formItemLayout} label="中文科室名称">
                <Input maxLength={30} style={{width: '300px'}} value={this.state.params.titleZH} name="titleZH" onChange={(e)=>{this.setData(e)}}/>
              </FormItem>
              <FormItem {...formItemLayout} label="英文科室名称">
                <Input maxLength={50} style={{width: '300px'}} value={this.state.params.titleUS} name="titleUS" onChange={(e)=>{this.setData(e)}}/>
              </FormItem>
            </div>
          }
          {
            this.state.id === 'UPDATE'?
            <div>
              <FormItem {...formItemLayout} label="中文简介">
                {/* <Editor {...page} contentId={this.state.params.contentZHID} initialContent={this.state.params.contentZH} editorOnChange={(val)=>{this.editorOnChange(val)}}/> */}
                <TextArea
                  placeholder="请输入中文内容"
                  autosize={{ minRows: 4}} maxLength={5000} value={this.state.params.contentZH} name="contentZH" onChange={(e)=>{this.setData(e)}} />
              </FormItem>
              <FormItem {...formItemLayout} label="英文简介">
                {/* <Editor {...page} contentId={this.state.params.contentUSID} initialContent={this.state.params.contentUS} editorOnChange={(val)=>{this.editorOnChangeUS(val)}}/> */}
                  <TextArea
                    placeholder="请输入英文内容"
                    autosize={{ minRows: 4}} maxLength={10000} value={this.state.params.contentUS} name="contentUS" onChange={(e)=>{this.setData(e)}} />
                </FormItem>
            </div>
            :
            <div>
              {
                  this.state.params.publishTime ?
                  <FormItem {...formItemLayout} label="发布时间">
                  <DatePicker defaultValue={''} placeholder={this.state.params.publishTime ? this.formatTime(this.state.params.publishTime) :"请选择日期"} format={'YYYY/MM/DD'} onChange={this.setTime}/>
                  </FormItem>
                  : null
              }
              <FormItem {...formItemLayout} label="中文科室内容">
              <Editor initialContent={this.state.params.contentZH} contentFormat="html" contentId={'zwksnr'} editorOnChange={this.editorOnChange}/>
                {/* <Editor {...page}  contentId={'zwksnr'}  initialContent={this.state.params.contentZH} editorOnChange={this.editorOnChange}/> */}
                {/* <TextArea
                  placeholder="请输入中文内容"
                  autosize={{ minRows: 4}} maxLength={5000} value={this.state.params.contentZH} name="contentZH" onChange={(e)=>{this.setData(e)}} /> */}
              </FormItem>
              <FormItem {...formItemLayout} label="英文科室内容">
                <Editor {...page} placeholder='Please enter the content' contentId={'ywksnr'} initialContent={this.state.params.contentUS} editorOnChange={this.editorOnChangeUS}/>
                  {/* <TextArea
                    placeholder="请输入英文内容"
                    autosize={{ minRows: 4}} maxLength={10000} value={this.state.params.contentUS} name="contentUS" onChange={(e)=>{this.setData(e)}} /> */}
                </FormItem>
            </div>
          }
          {/* <FormItem {...formItemLayout} label="中文内容">
            <Editor {...page} contentId={this.state.params.contentZHID} initialContent={this.state.params.contentZH} editorOnChange={(val)=>{this.editorOnChange(val)}}/> */}
            {/* <TextArea
              placeholder="请输入中文内容"
              autosize={{ minRows: 4}} maxLength={5000} value={this.state.params.contentZH} name="contentZH" onChange={(e)=>{this.setData(e)}} /> */}
          {/* </FormItem>
          <FormItem {...formItemLayout} label="英文内容">
          <Editor {...page} contentId={this.state.params.contentUSID} initialContent={this.state.params.contentUS} editorOnChange={(val)=>{this.editorOnChangeUS(val)}}/> */}
            {/* <TextArea
              placeholder="请输入英文内容"
              autosize={{ minRows: 4}} maxLength={10000} value={this.state.params.contentUS} name="contentUS" onChange={(e)=>{this.setData(e)}} /> */}
          {/* </FormItem> */}
          <FormItem {...formItemLayout} label="图片建议尺寸">
            {this.state.id === 'UPDATE'?
            <p style={{fontWeight: 'bold'}}> 1110*448</p>:
            <p style={{fontWeight: 'bold'}}> 880*448</p>
            }
          </FormItem>
          <FormItem {...formItemLayout} label="轮播图">
            <Upload
              // action="//jsonplaceholder.typicode.com/posts/"
              accept="image/*"
              listType="picture-card"
              fileList={fileList}
              onPreview={this.handlePreview}
              beforeUpload={this.handleChange}
              onChange={this.uploadFileNme}
              onRemove={this.removeFile}
              // customRequest={this.handleChange}
            >
              {fileList.length >= 5 ? null : uploadButton}
            </Upload>
          </FormItem>
          {
            this.state.id !== 'UPDATE'
            ?
            <FormItem {...formItemLayout} label="详情按钮模式">
              <DetailModel ref="DetailModel" type={this.state.params.parrern}
              to={this.toSeed}
              link={this.state.params.parrernContent || ''}
              changeLink={(val)=>{this.setState({params: {...this.state.params,parrernContent: val}})}}
              changeType={this.changeType}/>
            </FormItem>
            :
            null
          }

          {this.state.inpatientAreaList.forEach((item,index) => {
              inpatientAreaList.push(
                <div className="box" key={index}>
                    <h1 className="box-title">病区-{index+1}</h1>
                    <div className="box-content">
                      <Row style={{paddingBottom: '40px'}}>
                        <Col span={12}>
                          <FormItem {...formItemLayout} label="中文标题">
                            <Input maxLength={30} value={item.titleZH} key={item.id+'titleZH'} name="titleZH" onChange={(e)=>{this.setInpatientAreaListTitle(e,index)}} style={{width: '300px'}}/>
                          </FormItem>
                        </Col>
                        <Col span={12}>
                          <FormItem {...formItemLayout} label="英文标题">
                            <Input maxLength={50} value={item.titleUS} key={item.id+'titleUS'}  name="titleUS" onChange={(e)=>{this.setInpatientAreaListTitle(e,index)}} style={{width: '300px'}}/>
                          </FormItem>
                        </Col>
                      </Row>
                    {/*富文本编辑框*/}
                      <FormItem {...formItemLayoutBox} label="中文内容">
                        <Editor {...page} key={item.id +'ZH'} placeholder="请输入内容" contentId={index +'ZH'} initialContent={item.contentZH} editorOnChange={(val)=>{this.setInpatientAreaListContentZH(val,index)}}/>
                      </FormItem>
                      <FormItem {...formItemLayoutBox} label="英文内容">
                        <Editor {...page} key={item.id +'US'} contentId={index +'US'} initialContent={item.contentUS} editorOnChange={(val)=>{this.setInpatientAreaListContentUS(val,index)}}/>
                      </FormItem>
                      <FormItem {...formItemLayout} label="图片建议尺寸">
                        <p style={{fontWeight: 'bold'}}> 880*448</p>
                      </FormItem>
                      <FormItem {...formItemLayoutBox} label="上传图片">
                        <Upload
                          accept="image/*"
                          key={index+item.id+'file'}
                          listType="picture-card"
                          fileList={item.slideshowList}
                          // defaultFileList={this.state.params.accessoryList}
                          onPreview={this.handlePreview}
                          beforeUpload={(e) => {this.handleChange(e,index)}}
                          onChange={(file)=>{this.uploadFileNme(file,true)}}
                          onRemove={(file)=>{this.removeFile2(file,index)}}
                          // customRequest={this.handleChange}
                        >
                          {item.slideshowList.length >= 5 ? null : uploadButton}
                        </Upload>
                      </FormItem>
                      <Button style={{float: 'right',marginBottom: '20px'}} type="danger" onClick={()=>{this.delInpatientAreaList(index)}}>删除病区</Button>
                    </div>
                </div>)
            })}

          {
            this.state.id !== 'UPDATE' ?
            <FormItem {...formItemLayout} label="病区">
              {inpatientAreaList}
              <Button type="primary" onClick={this.addInpatientAreaList}>添加病区</Button>
            </FormItem>
          : null
          }
          
        </Form>
        <Modal visible={previewVisible} footer={null} onCancel={()=>{this.setState({previewVisible : false})}} style={{maxWidth: '750px'}}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
        <Modal
          title="裁剪图片"
          visible={this.state.visible}
          width="70%"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          maskClosable={false}
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