import React, {Component} from 'react'
// import {connect} from 'react-redux'
import {Input, Divider, Button, Form, Modal, Upload, Icon, message, Row, Col} from 'antd'
import Title from '@/component/title'
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
export default class KeyDepartBrief extends Component {

  state = {
    id: 'NEW',
    visible: false,
    previewVisible : false,
    lodding: false,
    previewImage: '',
    // 选择的文件
    uploadFile: '',
    fileNmae: '',
    // 裁剪后的图片
    cropImg: '',
    fileList: [],
    isAdd: false,

    // 病区
    fileIndex: -1,
    params: {
      "contentUS": "",
      "contentZH": "",
      "createTime": 0,
      "creator": "",
      "id": 0,
      "inpatientAreaList": [],
      "nameUS": "",
      "nameZH": "",
      "navbarId": 184,
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
    axios.get(`${URL}/admin/medicalVolunteer/retrieveOne?navbarId=184`).then(res => {
      if(res.data.code === 200) {
        let data = res.data.data
        
        axios.post(`${URL}/admin/medicalVolunteer/retrieveOne?id=${data.id}`).then((res)=>{
            this.setState({params: res.data.data},()=>{
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
        })
        

         console.log(this.state.inpatientAreaList)

      }else {
        message.error(res.data.msg)
      }
    })
  }
  // 保存科室简介
  saveDesc = () => {
    let slideshowIds = this.state.params.slideshowIds || []
    // console.log(this.state.params.slidoshowIds)
    slideshowIds = slideshowIds.length <= 2 ? '' : slideshowIds
    this.setState({
      isSave: true,
      params: {
        ...this.state.params,
        // slideshowIds: fileIds,
        slideshowIds: slideshowIds,
        slideshowList: this.state.fileList
      }},()=>{
      this.state.isAdd ?
      axios.post(`${URL}/admin/medicalVolunteer/create`,this.state.params).then(res=>{
        res.data.code === 200 ? message.success('保存成功'):message.error(res.data.msg)
        this.setState({lodding: false})
      }).catch(error=>{message.error('异常请求')
      this.setState({lodding: false})})
      : 
      axios.post(`${URL}/admin/medicalVolunteer/update`,this.state.params).then(res=>{
        res.data.code === 200 ? message.success('保存成功'):message.error(res.data.msg)
        this.setState({lodding: false})
      }).catch(error=>{message.error('异常请求')
      this.setState({lodding: false})})
    })
  }
  // 保存修改
  saveData = () => {
    axios.post(`${URL}/admin/department/update`,this.state.params).then(res => {
      if(res.data.code === 200) {
        message.success('保存成功')
      }else {
        message.error(res.data.msg)
      }
      this.setState({lodding: false})
    }).catch(error => {
      message.error('异常请求')
      this.setState({lodding: false})
    })
  }
  // 获取单个科室简介
  getSeedInfo = () => {
    axios.post(`${URL}/admin/medicalVolunteer/retrieveList`,{navbarId :184,pageIndex:1,pageSize:10,keyowrd:'',status: 'ALL'}).then(res => {
      if(res.data.code === 200) {
        // console.log(res.data.data.content)
        if (!res.data.data.content.length) {
          this.setState({isAdd: true})
          return
        }
        axios.post(`${URL}/admin/medicalVolunteer/retrieveOne?id=${res.data.data.content[0].id}`).then((res)=>{
            // if(!res.data.data.content.length){
            //     this.setState({isAdd: true})
            // }
            this.setState({ params: res.data.data},() => {
                let imgList = [];
                this.state.params.slideshowList && this.state.params.slideshowList.forEach(item => {
                    imgList.push({
                        name: item.showName,
                        uid: item.id,
                        thumbUrl: URL + '/' + item.url + item.storageName,
                        url:  URL + '/' + item.url + item.storageName
                    })
                })
                this.setState({ fileList: imgList, isAdd: false})
            })
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
  /********************* 数据双向绑定 end   ********************/
  
  // 根据Route中的参数设置ID
  componentDidMount() {
      this.getSeedInfo()
  }
  
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
  handleChange = (e,index) => {
    let reader = new FileReader()
    reader.onload = (file) => {
      if(typeof index === 'number'){
        this.setState({uploadFile: file.target.result, visible: true, fileIndex: index})
      }else{
        this.setState({uploadFile: file.target.result, visible: true, fileIndex: -1})
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
  // 保存编辑
  saveEditor = () => {
    this.setState({
      lodding: true
    })
    this.saveDesc()
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
        placeholder: 'Please enter the content'
    }

    return (
      <div className="department">
        <Title title="编辑简介" />
        <span style={{float: 'right'}}>
          {/* <Button style={{marginLeft: '15px'}} onClick={this.goBack}>返回</Button> */}
          <Button style={{marginLeft: '15px'}} type="primary" loading={this.state.lodding} onClick={this.saveEditor}>保存</Button>
        </span>
        <Divider />
        <Form layout="horizontal">
            <FormItem {...formItemLayout} label="中文标题">
                <Input style={{width: '300px'}} maxLength={100} value={this.state.params.titleZH} name="titleZH" onChange={(e)=>{this.setData(e)}}/>
            </FormItem>
            <FormItem {...formItemLayout} maxLength={250} label="英文标题">
                <Input style={{width: '300px'}} value={this.state.params.titleUS} name="titleUS" onChange={(e)=>{this.setData(e)}}/>
            </FormItem>
          <FormItem {...formItemLayout} label="中文简介">
            <TextArea
              placeholder="请输入中文简介"
              autosize={{ minRows: 4}} value={this.state.params.contentZH} name="contentZH" onChange={(e)=>{this.setData(e)}}
              maxLength={500}/>
          </FormItem>
          <FormItem {...formItemLayout} label="英文简介">
            <TextArea
              placeholder="请输入英文简介"
              autosize={{ minRows: 4}} value={this.state.params.contentUS} name="contentUS" onChange={(e)=>{this.setData(e)}}
              maxLength={1000}/>
          </FormItem>
          <FormItem {...formItemLayout} label="图片建议尺寸">
            <p>1110*448</p>
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
        </Form>
        <Modal visible={previewVisible} footer={null} onCancel={()=>{this.setState({previewVisible : false})}} style={{maxWidth: '750px',width: '750px'}}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
        <Modal
          title="裁剪图片"
          visible={this.state.visible}
          width="70%"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          maskClosable={false}
          cancelText=""
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