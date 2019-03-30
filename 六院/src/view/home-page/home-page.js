
import React, {Component} from 'react'
import {Form, Input, Upload, Button, Icon, Row, Col, Divider, message, Modal} from 'antd'
import axios from 'axios'
import './home-page.styl'
import {URL} from '@/common/js/url.js'
const FormItem = Form.Item
// const {TextArea} = Input
export default class homePage extends Component {
    state = {
        loading: false,
        data: [],
        isCheckFile: false,
        previewVisible: false,
        fileList:[],
        previewImage: '',
        params: {
            "homePageFooter": {
            },
            "homePageSlideshow": [
              {
                "linkUrl": "",
                "picId": "[]",
                "titleUS": "",
                "titleZH": ""
              }
            ],
            "id": 0
          }
    };
    componentDidMount() {
        this.getData()
    }
    /*************************** 数据操作区 start ************************/
    getData = () => {
        axios.get(`${URL}/admin/homePage/retrieveOne`).then(res => {
            if(res.data.code === 200) {
                console.log(res.data.data)
                this.setState({
                    data: res.data.data.homePageSlideshow
                })
                // console.log(typeof res.data.data.homePageSlideshow)
                // res.data.data.homePageSlideshow.forEach(item => {
                //     let arr = [];
                //     console.log(item)
                //     // item.pic.forEach(file=>{
                //     //     arr.push({
                //     //         name: file.showName,
                //     //         uid: file.id,
                //     //         thumbUrl: file.url,
                //     //         url: file.url
                //     //     })
                //     // })
                //     // item.pic = arr;
                // })
                
                this.setState({ data: res.data.data.homePageSlideshow})
            }
        })
    }
    addData = () => {
        let arr = this.state.data
        if(arr.length >= 8){
            message.error('轮播图最多只能8张')
            return
        }
        arr.push({
            linkUrl: "",
            pic: {},
            picId: "",
            picUrl: "",
            titleUS: "",
            titleZH: ""
        })
        this.setState({
            data: arr
        })
    }
    saveData = () => {
        // console.log()
        this.setState({params: {...this.state.params,homePageSlideshow: this.state.data}},()=>{
            axios.post(`${URL}/admin/homePage/update?type=SLIDESHOW `,this.state.params).then(res=>{
                if(res.data.code === 200) {
                    message.success('保存成功')
                }else {
                    message.error(res.data.msg)
                }
            })
        })
    }
    /*************************** 数据操作区 end   ************************/

    getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    beforeUpload = (file) => {
        // const isJPG = file.type === 'image/jpeg';
        // if (!isJPG) {
        // message.error('You can only upload JPG file!');
        // }
        const isLt2M = file.size / 1024 / 1024 < 10;
        if (!isLt2M) {
        message.error('图片最大上传10M');
        }
        return isLt2M;
    }

    // handleChange = (info) => {
    //     if (info.file.status === 'uploading') {
    //         this.setState({ loading: true });
    //         return;
    //     }
    //     if (info.file.status === 'done') {
    //         // Get this url from response in real world.
    //         this.getBase64(info.file.originFileObj, imageUrl => this.setState({
    //             imageUrl,
    //             loading: false,
    //         }));
    //     }
    // }
    setData = (e,index) => {
        let arr = this.state.data
        arr[index][e.target.name] = e.target.value
        this.setState({
          data:arr
        })
        console.log(arr)
    }
    getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    uploadFile = (file,index) => {
        if(this.state.isCheckFile){
            return;
        }
        this.setState({
            isCheckFile: true
        })
        console.log(file.fileList)
        var fromData = new FormData()
        fromData.append('file',file.file.originFileObj)
        // console.log(file)
        // this.setState({
        //     fileList: file.fileList
        // })
        var arr =  this.state.data
        arr[index].fileList = file.fileList;
        
        this.getBase64(file.file.originFileObj, imageUrl => {
            arr[index].picUrl = imageUrl;
        });
        axios.post(`${URL}/admin/file/upload`,fromData).then(res => {
          if(res.data.code === 200) {
            message.success('上传成功')
            arr[index].picId = `[${res.data.data}]`
            this.setState({
                data: arr,
                isCheckFile: false
            })
            // file.fileList[file.fileList.length-1].uid = res.data.data
            // this.setState({fileList: file.fileList})
          }else {
            message.error(res.data.msg)
          }
        }).catch(error => {
          message.error('上传失败')
        })
      }
      delData = (index) => {
          let arr = this.state.data;
          if(arr.length <= 1){
              message.error('轮播图必须要有1张！')
              return
          }
          console.log(index)
          arr.splice(index,1);
          this.setState({data: arr})
      }
    
    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
        this.setState({
        previewImage: file.url || file.thumbUrl,
        previewVisible: true,
        });
    }
    render() {
        const uploadButton = (
            <div>
              <Icon type={this.state.loading ? 'loading' : 'plus'} />
              <div className="ant-upload-text">Upload</div>
            </div>
          );
        const formItemLayout = {
            labelCol: {
              xs: { span: 4 },
              sm: { span: 4},
            },
            wrapperCol: {
              xs: { span: 20 },
              sm: { span: 20 },
            },
        };
        let temp = [];
        return <section>
                <div className="updateHospitalTraining-main">
                    <span style={{fontWeight: 'bold',fontSize: '18px'}}>首页信息/{sessionStorage.getItem('key')}</span>
                    <div style={{textAlign: 'right'}}>
                        <Button onClick={this.saveData} style={{marginBottom: '20px'}}>保存</Button>
                    </div>
                    <div className="content">
                        <p>轮播图建议尺寸：1920*488</p>
                        {this.state.data.forEach((item,index)=>{
                            temp.push(
                                <div className="box" key={index}>
                                    <p className="box-title">轮播-{index+1}: <Button type="primary" onClick={() => {this.delData(index)}} style={{float: 'right', marginTop: '4px', marginRight: '8px'}}>删除此轮播图</Button></p>
                                    <Form style={{padding: '10px 15px'}}>
                                        <FormItem label="上传">
                                            <div style={{display: 'flex'}}>
                                            <Upload
                                                name="avatar"
                                                listType="picture-card"
                                                className="avatar-uploader"
                                                showUploadList={false}
                                                // action="//jsonplaceholder.typicode.com/posts/"
                                                beforeUpload={this.beforeUpload}
                                                onChange={(file)=>{this.uploadFile(file,index)}}
                                                defaultFileList={item.fileList}
                                                // onPreview={this.handlePreview}
                                                // onChange={this.handleChange}
                                                key={'upload'+item.id}
                                            >
                                                {/* {item.picUrl?'you':'no'} */}
                                                {item.picUrl? <img width="100%" src={item.picUrl.indexOf('base64') !== -1 ?item.picUrl: URL + '/'+item.picUrl} alt="avatar" /> : uploadButton}
                                                {/* {item.picURl? <img width="100%" src={item.picURl} alt="avatar" /> : uploadButton} */}
                                            </Upload>
                                            <Button style={{marginLeft: '20px'}} onClick={() => {this.setState({previewVisible: true,curImg: item.picUrl.indexOf('base64') !== -1 ?item.picUrl: URL + '/' + item.picUrl})}}>图片预览</Button>
                                            </div>
                                            <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
                                                <img alt="example" style={{ width: '100%' }} src={this.state.curImg} />
                                            </Modal>
                                        </FormItem>
                                        <FormItem {...formItemLayout} style={{width: '400px'}} label="中文标题" >
                                            <Input name='titleZH' value={item.titleZH} onChange={(e) => {this.setData(e,index)}} maxLength={40}  key={'title'+item.id}/>
                                        </FormItem>
                                        <FormItem {...formItemLayout} style={{width: '400px'}} label="英文标题" >
                                            <Input name='titleUS' value={item.titleUS} onChange={(e) => {this.setData(e,index)}} maxLength={60}  key={'title'+item.id}/>
                                        </FormItem>
                                        <FormItem {...formItemLayout} style={{width: '400px'}}  key={'link'+item.id} label="链接">
                                            <Input name="linkUrl" value={item.linkUrl} onChange={(e) => {this.setData(e,index)}} maxLength={100}
                                            style={/^((ht|f)tps?):\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([#\w\-\.,@?^=%&:\/~]*)+)?/.test(item.linkUrl)?null:{borderColor: '#f00'}}/>
                                        </FormItem>
                                    </Form>
                                </div>)
                        })}
                        {temp}
                        <Button type="primary" onClick={this.addData} style={{marginRight: '20px'}}>添加轮播图</Button>
                        {/* <Button type="primary" onClick={this.delData}>删除轮播图</Button> */}
                    </div>
                </div>
            </section>
    }
}