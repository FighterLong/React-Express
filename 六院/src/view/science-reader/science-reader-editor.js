import React,{Component} from 'react'
import {Form, Input, Upload, Button, Modal, Icon, Divider,Select,message,DatePicker} from 'antd'
import moment from 'moment';
import Title from '@/component/title'
import Editor from '@/component/editor'
// import api from '@/api/index.js'
import axios from 'axios'
import {URL} from '@/common/js/url.js'
import '../../common/stylus/public.styl'

const FormItem = Form.Item
const Option = Select.Option
// const URL = 'http://192.168.0.122:7979'

class scienceReaderEditor extends Component {
  state={
    fileList:[],
    fileList2:[],
    option:[],
    modelZH: false,
    modelUS: false,
    defaultDepartment: [],
    title:'',
    isSave: false,
    editorZHID: new Date().getTime()+'ZH',
    editorUSID: new Date().getTime()+'US',
    params:{
      "accessoryIds": "",
      "accessoryList": [],
      "createTime": 1527311484000,
      "creator": "开发者",
      "departmentIds": "",
      "hits": 1000,
      "id": 0,
      "publishTime": 0,
      "scienceContentUS": "",
      "scienceContentZH": "",
      "scienceTitleUS": "",
      "scienceTitleZH": "",
      "slideshowIds": "",
      "slideshowList": [],
      "seq": 0,
      "status": "UNPUBLISH"
    }
  }

  componentDidMount(){
    if(this.props.match.params.id !== 'NEW') {
      this.getData();
    }
    let seq = sessionStorage.getItem('maxLength') ? parseInt(sessionStorage.getItem('maxLength')) + 1 : 0
    this.setState({params: {...this.state.params, seq}})
    this.getRelativeDepartMent()
  }

  /************************ 数据操作区 start **************************/
  // 获取数据
  getData = () => {
    axios.post(`${URL}/admin/science/retrieveOne?id=${this.props.match.params.id}`).then(res => {
      if (res.data.code === 200) {
        res.data.data&&this.setState({
          params: res.data.data,
          defaultDepartment: res.data.data.departmentIds || [],
          editorZHID: new Date().getTime()+'ZH',
          editorUSID: new Date().getTime()+'US',
        },()=>{
          // let arr =[]
          let arr = (typeof this.state.defaultDepartment  === 'string' ? JSON.parse(this.state.defaultDepartment): this.state.defaultDepartment)
          let arr2 =  []
          arr.forEach(item=>{
            item +=''
            arr2.push(item)
          })
          this.setState({
            defaultDepartment: arr2
          })
          
          var arrs = [];
          this.state.params.accessoryList.forEach((item,index) => {
            arrs.push({
              name: '附件' + (index + 1) + ':' + item.showName,
              uid: item.id,
              thumbUrl: item.url,
              url: URL + '/' + item.url + item.storageName
            })
          })

          var imgList = [];
          this.state.params.slideshowList.forEach(item => {
            imgList.push({
              name: item.showName,
              uid: item.id,
              thumbUrl: URL + '/' + item.url + item.storageName,
              url:  URL + '/' + item.url + item.storageName
            })
          })

          this.setState({ fileList: arrs,fileList2: imgList})
        })
      }
    }).catch(error => {
      message.error('请求异常')
    })
  }
  // 添加数据
  addData = () => {
    if (this.state.isSave) {
      message.error('频繁操作');
      return;
    }
    this.setState({isSave: true})
    // 附件
    let fileIds = [];
    this.state.fileList.forEach(item=>{
      fileIds.push(item.uid)
    })
    fileIds = '['+fileIds.toString() +']'
    fileIds = fileIds.length === 2 ? '' : fileIds
    // 轮播图
    let fileIds2 = [];
    this.state.fileList2.forEach(item=>{
      fileIds2.push(item.uid)
    })
    fileIds2 = '['+fileIds2.toString() +']'
    fileIds2 = fileIds2.length === 2 ? '' : fileIds2

    let arr =this.state.params.departmentIds
    arr = arr.length ? `[${arr.toString()}]` : ''
    // 编辑器内容处理
    console.log(this.state.params.scienceContentZH)
    let scienceContentUS = typeof this.state.params.scienceContentUS === 'string' ? this.state.params.scienceContentUS : (this.state.params.scienceContentUS.toHTML ? this.state.params.scienceContentUS.toHTML() : this.state.params.scienceContentUS)
    let scienceContentZH = typeof this.state.params.scienceContentZH === 'string' ? this.state.params.scienceContentZH : (this.state.params.scienceContentZH.toHTML ? this.state.params.scienceContentZH.toHTML() : this.state.params.scienceContentZH)
    
    // this.state.params.scienceContentZH.toHTML()
    this.setState({
      isSave: true,
      params: {
        ...this.state.params,
        departmentIds:arr,
        accessoryIds: fileIds,
        accessoryList: this.state.fileList,
        slideshowIds: fileIds2,
        slideshowList: this.state.fileList2,
        scienceContentZH,
        scienceContentUS
      }},()=>{
    axios.post(`${URL}/admin/science/save`,this.state.params).then(res => {
      if (res.data.code === 200) {
        this.setState({isSave: false})
        message.success('添加成功')
        this.props.history.goBack(-1)
      }else {
        message.error(res.data.msg)
      }
    }).catch(error => {
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
    // 附件
    let fileIds = [];
    this.state.fileList.forEach(item=>{
      fileIds.push(item.uid)
    })
    fileIds = '['+fileIds.toString() +']'
    fileIds = fileIds.length === 2 ? '' : fileIds
    // 轮播图
    let fileIds2 = [];
    this.state.fileList2.forEach(item=>{
      fileIds2.push(item.uid)
    })
    fileIds2 = '['+fileIds2.toString() +']'
    fileIds2 = fileIds2.length === 2 ? '' : fileIds2
    // 科室
    let arr;
    if(typeof this.state.params.departmentIds  === 'string' && this.state.params.departmentIds.length){
        arr = JSON.parse(this.state.params.departmentIds)
    }else {
        arr = this.state.params.departmentIds
    }
    arr = arr.length ? `[${arr.toString()}]` : ''
    // 编辑器内容处理
    let scienceContentZH,scienceContentUS
    if(this.state.params.scienceContentZH) {
      scienceContentZH = typeof this.state.params.scienceContentZH === 'string' ? this.state.params.scienceContentZH : (this.state.params.scienceContentZH.toHTML ? this.state.params.scienceContentZH.toHTML() : this.state.params.scienceContentZH)
      
    }
    if(this.state.params.scienceContentUS){
      scienceContentUS = typeof this.state.params.scienceContentUS === 'string' ? this.state.params.scienceContentUS : (this.state.params.scienceContentUS.toHTML ? this.state.params.scienceContentUS.toHTML() : this.state.params.scienceContentUS)
    }
   
    
    
    this.setState({
      isSave: true,
      params: {
        ...this.state.params,
        departmentIds:arr,
        accessoryIds: fileIds,
        accessoryList: this.state.fileList,
        slideshowIds: fileIds2,
        slideshowList: this.state.fileList2,
        scienceContentUS,
        scienceContentZH
      }},()=>{
      axios.post(`${URL}/admin/science/update`,this.state.params).then(res => {
        if (res.data.code === 200) {
          this.setState({isSave: false})
          message.success('保存成功')
        }else {
          message.error(res.data.msg)
        }
      }).catch(error => {
        message.error('请求异常')
      })
    })
  }
  // 获取相关科室
  getRelativeDepartMent = () => {
    axios.get(`${URL}/admin/department/departmentReminder`).then(res => {
    if (!res.data) {
      return
    }
    if(res.data.code === 200 && res.data.data) {
        let option = []
        res.data.data.forEach((item,index)=>{
        option.push(<Option key={item.id}>{item.name}</Option>);
        })
        this.setState({option})
    }else {
      message.error(res.data.msg)
    }
    })
  }
  /************************ 数据操作区 end   **************************/

  /************************ 数据双向绑定区 start  ***************************/
    // 设置双向绑定  name=字段名  必填项
    setFromData = (e) => {
      if (e.target.name === 'seq' && isNaN(e.target.value)) {
        return
      }
      this.setState({params: {...this.state.params,[e.target.name]: e.target.value}})
    }
    // 设置中文内容
    setContentZH = (content)=>{
      // content = content.replace(/href/g,'xxx')
      this.setState({params: {...this.state.params,scienceContentZH: content}})
      // this.setState({params:Object.assign({},this.state.params,{scienceContentZH:content})})
    }
    // 设置英文内容
    setContentUS = (content)=>{
      // content = content.replace(/href/g,'xxx')
      // console.log(content.toHTML())
      this.setState({params: {...this.state.params,scienceContentUS: content}})
      // this.setState({params:Object.assign({},this.state.params,{scienceContentUS:content})})
    }
  /************************ 数据双向绑定区 end    ***************************/
  
  setdepartmentIds = (value) => {
    value = value.length ? value : ''
    this.setState({params: {...this.state.params,departmentIds: value},defaultDepartment: value?value: []})
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
    this.setState({params:Object.assign({},this.state.params,{status:'UNPUBLISH'})})
    // api.scienceReader.newWrite(this.state.params).then(res=>{
    //   console.log(res)
    // })
  }
  nameChange=(e)=>{
    this.setState({ title: e.target.value });
  }
  editorOnRawChange=(rawcon)=>{
    //console.log(rawcon)
  }

  // 移除附件
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
  // 移除轮播图
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

  // 上传附件
  uploadOtherFile = (file) => {
    
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
  }

  // 上传轮播图
  uploadImgFile = (file) => {
    var fromData = new FormData()
    fromData.append('file',file.file.originFileObj)

    axios.post(`${URL}/admin/file/upload`,fromData).then(res => {
      if(res.data.code === 200) {
        message.success('上传成功')
        file.file.status = 'done'
        file.fileList[file.fileList.length-1].uid = res.data.data
        this.setState({fileList2: file.fileList})
      }else {
        message.error(res.data.msg)
      }
    }).catch(error => {
      message.error('上传失败')
    })
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
  render(){
    const editorProps = {
      controls: ['media'],
      height: 500,
      contentFormat: 'html',
      initialContent: '<p>请输入内容</p>',
      editorOnChange:this.editorOnChange,
      onRawChange:this.editorOnRawChange
    }

    /****************************** 编辑器初始化赋值 start *********************************/
    let editorPageZH = {...editorProps,initialContent: this.state.params.scienceContentZH, editorOnChange: this.setContentZH,contentId: 1}
    let editorPageUS = {...editorProps,initialContent: this.state.params.scienceContentUS, editorOnChange: this.setContentUS,contentId: 2}
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
    const props={
      multiple: true,
      onChange: this.uploadOtherFile,
      onRemove: this.removeFile,
    }
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
          <Button style={{marginLeft: '15px'}}  onClick={() => {this.props.history.goBack(-1)}}>返回</Button>
          <Button style={{marginLeft: '15px'}} onClick={() => {this.setState({modelZH: true})}}>预览文章(中文)</Button>
          <Button style={{marginLeft: '15px'}} onClick={() => {this.setState({modelUS: true})}}>预览文章(英文)</Button>
          <Button style={{marginLeft: '15px'}} type="primary" onClick={this.save}>保存</Button>
        </span>
        <Divider />
        <Form layout="horizontal">
           <FormItem {...formItemLayout} label="中文标题">
             <Input style={{width: '300px'}} maxLength={100} onChange={(e)=>{this.setFromData(e)}} name="scienceTitleZH" value={this.state.params.scienceTitleZH}/>
           </FormItem>
           <FormItem {...formItemLayout} label="中文副标题">
             <Input style={{width: '300px'}} maxLength={100} onChange={(e)=>{this.setFromData(e)}} name="subheadingZH" value={this.state.params.subheadingZH}/>
           </FormItem>
           <FormItem {...formItemLayout} label="英文标题">
             <Input style={{width: '300px'}} maxLength={250} onChange={(e)=>{this.setFromData(e)}} name="scienceTitleUS" value={this.state.params.scienceTitleUS}/>
           </FormItem>
           <FormItem {...formItemLayout} label="英文副标题">
             <Input style={{width: '300px'}} maxLength={250} onChange={(e)=>{this.setFromData(e)}} name="subheadingUS" value={this.state.params.subheadingUS}/>
           </FormItem>
           <FormItem {...formItemLayout} label="排序号">
             <Input style={{width: '300px'}} maxLength={6} onChange={(e)=>{this.setFromData(e)}} name="seq" value={this.state.params.seq}/>
           </FormItem>
          {
              this.state.params.publishTime ?
              <FormItem {...formItemLayout} label="发布时间">
              <DatePicker defaultValue={''} placeholder={this.state.params.publishTime ? this.formatTime(this.state.params.publishTime) :"请选择日期"} format={'YYYY/MM/DD'} onChange={this.setTime}/>
              </FormItem>
              : null
          }
          <FormItem {...formItemLayout} label="相关科室">
            <Select
              mode="multiple"
              style={{ width: '300px' }}
              placeholder="Please select"
              value={this.state.defaultDepartment}
              name="departmentIds"
              optionFilterProp={'children'}
              onChange={this.setdepartmentIds}
              getPopupContainer={triggerNode => triggerNode.parentNode}
            >
              {this.state.option}
            </Select>
          </FormItem>
          <FormItem {...formItemLayout} label="中文内容">
            <Editor style={{border: '1px solid #666'}} {...editorPageZH}/>
          </FormItem>
          <FormItem {...formItemLayout} label="英文内容">
            <Editor style={{border: '1px solid #666'}} {...editorPageUS}/>
          </FormItem>
          <FormItem {...formItemLayout} label="图片建议尺寸">
            <p>880*448</p>
          </FormItem>
          <FormItem {...formItemLayout} label="上传轮播图">
          <Upload
            // action="//jsonplaceholder.typicode.com/posts/"
            listType="picture-card"
            fileList={this.state.fileList2}
            onPreview={this.handlePreview}
            onRemove={this.removeFile2}
            onChange={this.uploadImgFile}
          >
          {this.state.fileList2.length >= 5 ? null : uploadButton}
          </Upload>
          </FormItem>
          <FormItem {...formItemLayout} label="附件">
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
          <h1 style={{textAlign: 'center', fontSize: '20px'}}>{this.state.params.scienceTitleZH}</h1>
          <h1 style={{textAlign: 'center', fontSize: '18px'}}>{this.state.params.subheadingZH}</h1>
          <div dangerouslySetInnerHTML={{__html: this.state.params.scienceContentZH}}></div>
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
          <h1 style={{textAlign: 'center', fontSize: '20px'}}>{this.state.params.scienceTitleUS}</h1>
          <h1 style={{textAlign: 'center', fontSize: '18px'}}>{this.state.params.subheadingUS}</h1>
          <div dangerouslySetInnerHTML={{__html: this.state.params.scienceContentUS}}></div>
        </Modal>
        <Modal visible={this.state.previewVisible} footer={null} onCancel={()=>{this.setState({previewVisible : false})}} style={{maxWidth: '750px'}}>
          <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
        </Modal>
      </div>
    )
  }
}
export default scienceReaderEditor
