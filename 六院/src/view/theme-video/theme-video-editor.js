/*
 * @Author: kaiback__zgt_1430666237@qq.com 
 * @Date: 2018-05-15 09:26:49 
 * @Last Modified by: kaiback__zgt_1430666237@qq.com
 * @Last Modified time: 2018-05-18 15:20:55
 */

import React, {Component} from 'react'
import {Form, Input, Upload, Button, Icon, Radio, Divider, Modal, message, DatePicker} from 'antd'
import moment from 'moment';
import Title from '@/component/title'
import axios from 'axios'
import {URL} from '@/common/js/url.js'

const RadioGroup = Radio.Group;
const FormItem = Form.Item
const {TextArea} = Input
// const URL = 'http://192.168.0.122:7979'

class ThemeVideoEditor extends Component {

  state = {
    fileList: [],
    fileList2: [],
    loading: false,
    isMP4: false,
    params: {
      "accessoryIds": "",
      "accessoryList": [
      ],
      "createTime": 0,
      "creator": "string",
      "id": 0,
      "publishTime": 0,
      "coverIds": "",
      "pattern": 'CONTENT',
      "special": "string",
      "specialVideoContentUS": "", // 英文内容
      "specialVideoContentZH": "", // 中文内容
      "specialVideoNameUS": "", // 英文标题
      "specialVideoNameZH": "", // 中文标题
      "status": "All",
      "top": true,
      "videoIds": ""
    }
  }
  componentDidMount () {
    if(this.props.match.params.id !== 'NEW')
    this.setState({params: {...this.state.params, id: this.props.match.params.id}},()=>{
      console.log(this.state.params.id);
      this.getData(this.state.params.id)
    });

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
  // 设置中文标题  实现数据双向绑定
  setSpecialVideoNameZH = (e) => {
    this.setState({params: {...this.state.params,specialVideoNameZH: e.target.value}})
  }
  // 设置英文标题 实现数据双向绑定
  setSpecialVideoNameUS = (e) => {
    this.setState({params: {...this.state.params,specialVideoNameUS: e.target.value}})
  }

  // 设置中文内容 实现数据双向绑定
  setSpecialVideoContentZH = (e) => {
    this.setState({params: {...this.state.params,specialVideoContentZH: e.target.value}})
  }
  // 设置英文内容 实现数据双向绑定
  setSpecialVideoContentUS = (e) => {
    this.setState({params: {...this.state.params,specialVideoContentUS: e.target.value}})
  }

  // 保存数据 添加/编辑
  saveData = (params) => {
    this.setState({ loading: true })
    let fileIds = [];
    this.state.fileList.forEach(item=>{
      fileIds.push(item.uid)
    })
    fileIds = '['+fileIds.toString() +']'
    fileIds = fileIds.length === 2 ? '' : fileIds
    // let coverIds = [];
    // this.state.fileList2.forEach(item=>{
    //   coverIds.push(item.uid)
    // })
    // coverIds = '['+coverIds.toString() +']'
    // console.log(coverIds)
    // coverIds = coverIds.length === 2 ? '' : coverIds
    // console.log(coverIds)
    let specialVideoContentUS = ''
    let specialVideoContentZH = ''
    if (this.state.params.specialVideoContentUS) {
      specialVideoContentUS = typeof this.state.params.specialVideoContentUS === 'string' ? this.state.params.specialVideoContentUS : this.state.params.specialVideoContentUS.toHTML()
    }
    if (this.state.params.specialVideoContentZH) {
      specialVideoContentZH = typeof this.state.params.specialVideoContentZH === 'string' ? this.state.params.specialVideoContentZH : this.state.params.specialVideoContentZH.toHTML()
    }

    if (this.state.params.pattern === 'CONTENT' && !this.state.params.videoIds) {
      message.error('内容模式必须上传视频')
      return
    }if (this.state.params.pattern === 'LINK' && !this.state.params.coverUrl) {
      message.error('外链模式必须上传封面图')
      return
    }

    // let specialVideoContentUS = typeof this.state.params.specialVideoContentUS === 'string' ? this.state.params.specialVideoContentUS : this.state.params.specialVideoContentUS.toHTML()
    // let specialVideoContentZH = typeof this.state.params.specialVideoContentZH === 'string' ? this.state.params.specialVideoContentZH : this.state.params.specialVideoContentZH.toHTML()

    this.setState({params: {...this.state.params,specialVideoContentUS,specialVideoContentZH}},()=>{
      // 若有传ID则为编辑否则就为添加
      if (this.props.match.params.id !== 'NEW') {
        axios.post(`${URL}/admin/specialVideo/update`,params).then(res => {
          if(res.data.code === 200) message.success('保存成功',1);
          if(res.data.code !== 200) message.error(res.data.msg);
          setTimeout(()=>{this.setState({loading:false})},500)
        }).catch(error => {message.error('异常请求');this.setState({ loading: false })})
      } else {
        axios.post(`${URL}/admin/specialVideo/create`,params).then(res => {
          if(res.data.code === 200){
            this.goBack();
            message.success('添加成功',1);
          }else{
            message.error(res.data.msg);
          }
          setTimeout(()=>{this.setState({loading:false})},500)
        }).catch(error => {message.error('异常请求');this.setState({ loading: false })})
      }
    })
  }

  // 获取数据
  getData = (id) => {
    axios.post(`${URL}/admin/specialVideo/retrieveOne?id=${id}`).then(res => {
      this.setState({
        params: {...res.data.data}
      })
      var arr = [];
      res.data.data.accessoryList.forEach(item => {
        arr.push({
          name: item.showName,
          uid: item.id,
          thumbUrl: item.url ? item.url : '',
          url: (item.url + item.storageName) ? URL +'/'+ (item.url + item.storageName) : ''
        })
        
        // item.name = item.showName;
        // item.uid = item.id;
        // item.thumbUrl = item.url;
      })
      this.setState({ fileList: arr,fileList2: [{name: '封面图', uid: new Date().getTime(), url:  res.data.data.coverPicUrl? URL+'/' + res.data.data.coverPicUrl : ''}]})
    })
  }
  // 返回
  goBack() {
    window.history.back(-1)
  }

  // 上传视频
  handleChange = (file) => {
    // if(!this.beforeUpload(file.file)) {
    //   return
    // }
    var ids = this.state.params.accessoryIds;
    var fromData = new FormData()
    fromData.append('file',file.file.originFileObj)
    axios.post(`${URL}/admin/file/upload`,fromData).then(res => {
      if(res.data.code === 200) {
        ids = res.data.data? `[${res.data.data}]`:'';
        file.file.uid = res.data.data
        file.file.status = 'done'
        this.setState({params: {...this.state.params,videoIds: ids},fileList: [file.file]})
        message.success('上传成功')
      }else {
        message.error(res.data.msg)
      }
    }).catch(error => {
      message.error('上传失败')
    })
  }
  // 限制文件大小和文件格式
  beforeUpload(file) {
    // console.log(file)
    // const isJPG = file.name.indexOf('.mp4') !== -1;
    // // this.setState({isMP4:isJPG })
    // if (!isJPG) {
    //   // message.error('请上传mp4视频格式');
    //   return false
    // }
    const isLt2M = file.size / 1024 / 1024 < 10;
    if (!isLt2M) {
      message.error('上传的图片不能大于10M');
    }
    return isLt2M;
    // return true
  }

  // 切换模式
  changePattern = (e) => {
    this.setState({
      params: {...this.state.params,pattern: e.target.value},
    })
  }

  setValue = (e) => {
    this.setState({
      params: {...this.state.params, [e.target.name]: e.target.value}
    })
  }

  // 上传封面图
  uploadImgFile = (file) => {
    var fromData = new FormData()
    fromData.append('file',file.file.originFileObj)

    axios.post(`${URL}/admin/file/uploadReturnPath`,fromData).then(res => {
      if(res.data.code === 200) {
        message.success('上传成功')
        file.file.status = 'done'
        file.fileList[file.fileList.length-1].uid = res.data.data
        this.setState({fileList2: file.fileList,params: {...this.state.params,coverUrl: res.data.data}})
      }else {
        message.error(res.data.msg)
      }
    }).catch(error => {
      message.error('上传失败')
    })
  }
  // 移除封面图
  removeFile2 = (info) => {
    // console.log(info)
    let arr = this.state.fileList2;
    arr.forEach((item,index)=>{
      if(item.uid === info.uid){
        arr.splice(index,1)
      }
    })
    this.setState({fileList2: arr})
    // console.log(e)
  }

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
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
      // action: ``,
      accept: `audio/mp4,video/mp4`,
      onChange: this.handleChange,
      onRemove: this.removeFile
    };
    
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    )

    return (
      <div className="theme-video-editor">
        <Title title="编辑内容" />
        <span style={{float: 'right'}}>
          <Button style={{marginLeft: '15px'}} onClick={this.goBack}>返回</Button>
          {/* <Button style={{marginLeft: '15px'}} >发布</Button> */}
          <Button style={{marginLeft: '15px'}} loading={this.state.loading} type="primary" onClick={() => {this.saveData(this.state.params)}}>保存</Button>
        </span>
        <Divider />
        <Form layout="horizontal">
          <FormItem {...formItemLayout} label="中文标题">
            <Input style={{width: '300px'}} maxLength={30}  value={this.state.params.specialVideoNameZH} onChange={this.setSpecialVideoNameZH}/>
          </FormItem>
          <FormItem {...formItemLayout} label="英文标题">
            <Input style={{width: '300px'}} maxLength={50} value={this.state.params.specialVideoNameUS} onChange={this.setSpecialVideoNameUS}/>
          </FormItem>
          {
            this.state.params.publishTime ?
            <FormItem {...formItemLayout} label="发布时间">
              <DatePicker defaultValue={''} placeholder={this.state.params.publishTime ? this.formatTime(this.state.params.publishTime) :"请选择日期"} format={'YYYY/MM/DD'} onChange={this.setTime}/>
            </FormItem>
            : null
          }
          <FormItem {...formItemLayout} label="视频模式">
            <RadioGroup onChange={this.changePattern} value={this.state.params.pattern}>
              <Radio value={"CONTENT"}>内容模式</Radio>
              <Radio value={"LINK"}>外链模式</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem {...formItemLayout} label="视频">
          {this.state.params.pattern === 'CONTENT' ?
           <div style={{display: 'flex'}}>
           封面图：
           <Upload
             // action="//jsonplaceholder.typicode.com/posts/"
             accept="image/*"
             listType="picture-card"
             fileList={this.state.fileList2}
             onPreview={this.handlePreview}
             onRemove={this.removeFile2}
             onChange={this.uploadImgFile}
             beforeUpload= {this.beforeUpload}
           >
           {this.state.fileList2.length >= 1 ? null : uploadButton}
           </Upload>
           <span style={{marginLeft: '20px'}}>
              提示：最佳图片宽高比例为3:2
              <p>视频：
              <Upload  style={{width: '300px'}} {...props} fileList={this.state.fileList}>
              <Button>
                <Icon type="upload" /> 上传视频
              </Button>
            </Upload></p></span>
           {/* <p style={{marginLeft: '20px'}}>
            <p>视频：</p>
            <Upload  style={{width: '300px'}} {...props} fileList={this.state.fileList}>
              <Button>
                <Icon type="upload" /> 上传视频
              </Button>
            </Upload>
            </p> */}
         </div>
            :
            <div style={{display: 'flex'}}>
              封面图：
              <Upload
                // action="//jsonplaceholder.typicode.com/posts/"
                accept="image/*"
                listType="picture-card"
                fileList={this.state.fileList2}
                onPreview={this.handlePreview}
                onRemove={this.removeFile2}
                onChange={this.uploadImgFile}
                beforeUpload= {this.beforeUpload}
              >
              {this.state.fileList2.length >= 1 ? null : uploadButton}
              </Upload>
              <span style={{marginLeft: '20px'}}>
              提示：最佳图片宽高比例为3:2
              <p>链接：<Input style={{width: '300px'}} value={this.state.params.link} name="link" onChange={this.setValue}/></p></span>
            </div>
            }
          </FormItem>
          <FormItem {...formItemLayout} label="中文简介">
            <TextArea
              placeholder="请输入视频简介"
              autosize={{ minRows: 4}}
              value={this.state.params.specialVideoContentZH}
              onChange={this.setSpecialVideoContentZH}
              maxLength={500}/>
          </FormItem>
          <FormItem {...formItemLayout} label="英文简介">
            <TextArea
              placeholder="请输入视频简介"
              autosize={{ minRows: 4}}
              value={this.state.params.specialVideoContentUS}
              onChange={this.setSpecialVideoContentUS}
              maxLength={1000} />
          </FormItem>
        </Form>
        <Modal visible={this.state.previewVisible} footer={null} onCancel={()=>{this.setState({previewVisible : false})}}>
          <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
        </Modal>
      </div>
    )
  }
}

export default ThemeVideoEditor