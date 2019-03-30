
import React, {Component} from 'react'
import {Form, Input, Upload, Button, Icon, Row, Col, Divider, message, Modal} from 'antd'
import axios from 'axios'
import './top-image.styl'
import {URL} from '@/common/js/url.js'
// const {TextArea} = Input
export default class homePage extends Component {
    state = {
        loading: false,
        data: [{
            "modeName": "资讯信息",
            "modeCode": "HOMEPAGE",
            "picId": 0,
            "picUrl": ""
        },{
            "modeName": "医院概况",
            "modeCode": "HOSP_SITUATION",
            "picId": 0,
            "picUrl": ""
        },{
            "modeName": "科室导航",
            "modeCode": "DEPT_NAVIGATION",
            "picId": 0,
            "picUrl": ""
        },{
            "modeName": "专家信息",
            "modeCode": "EXPERT",
            "picId": 0,
            "picUrl": ""
        },{
            "modeName": "招聘招标",
            "modeCode": "RECURITMENT_BIDDING",
            "picId": 0,
            "picUrl": ""
        },{
            "modeName": "科研",
            "modeCode": "RESEARCH",
            "picId": 0,
            "picUrl": ""
        },{
            "modeName": "教学",
            "modeCode": "TEACHING",
            "picId": 0,
            "picUrl": ""
        },{
            "modeName": "疾病科普",
            "modeCode": "SCIENCE",
            "picId": 0,
            "picUrl": ""
        },{
            "modeName": "医务社工-新闻动态",
            "modeCode": "MEDICAL_VOLUNTEER_DYNAMIC",
            "picId": 0,
            "picUrl": ""
        },{
            "modeName": "医务社工-社工服务",
            "modeCode": "MEDICAL_VOLUNTEER_WORKER_SERVICE",
            "picId": 0,
            "picUrl": ""
        },{
            "modeName": "医务社工-公益慈善",
            "modeCode": "MEDICAL_VOLUNTEER_CHARITY",
            "picId": 0,
            "picUrl": ""
        },{
            "modeName": "医务社工-志愿服务",
            "modeCode": "MEDICAL_VOLUNTEER_SERVICE",
            "picId": 0,
            "picUrl": ""
        },{
            "modeName": "医务社工-资料下载",
            "modeCode": "MEDICAL_VOLUNTEER_DOWNLOAD",
            "picId": 0,
            "picUrl": ""
        }],
        isCheckFile: false,
        previewVisible: false,
        fileList:[],
        curImgUrl: '',
        showImgModel: false,
        previewImage: '',
        params: {
            "homePageFooter": {
            },
            "homePageSlideshow": [
            ],
            "topPictrueList": [{
                "modeName": "资讯信息",
                "modeCode": "HOMEPAGE",
                "picId": 0,
                "picUrl": ""
            },{
                "modeName": "医院概况",
                "modeCode": "HOSP_SITUATION",
                "picId": 0,
                "picUrl": ""
            },{
                "modeName": "科室导航",
                "modeCode": "DEPT_NAVIGATION",
                "picId": 0,
                "picUrl": ""
            },{
                "modeName": "专家信息",
                "modeCode": "EXPERT",
                "picId": 0,
                "picUrl": ""
            },{
                "modeName": "招聘招标",
                "modeCode": "RECURITMENT_BIDDING",
                "picId": 0,
                "picUrl": ""
            },{
                "modeName": "科研",
                "modeCode": "RESEARCH",
                "picId": 0,
                "picUrl": ""
            },{
                "modeName": "教学",
                "modeCode": "TEACHING",
                "picId": 0,
                "picUrl": ""
            },{
                "modeName": "疾病科普",
                "modeCode": "SCIENCE",
                "picId": 0,
                "picUrl": ""
            },{
                "modeName": "医务社工-新闻动态",
                "modeCode": "MEDICAL_VOLUNTEER_DYNAMIC",
                "picId": 0,
                "picUrl": ""
            },{
                "modeName": "医务社工-社工服务",
                "modeCode": "MEDICAL_VOLUNTEER_WORKER_SERVICE",
                "picId": 0,
                "picUrl": ""
            },{
                "modeName": "医务社工-科研教学",
                "modeCode": "MEDICAL_VOLUNTEER_REASEARCH_TEACH",
                "picId": 0,
                "picUrl": ""
            },{
                "modeName": "医务社工-公益慈善",
                "modeCode": "MEDICAL_VOLUNTEER_CHARITY",
                "picId": 0,
                "picUrl": ""
            },{
                "modeName": "医务社工-志愿服务",
                "modeCode": "MEDICAL_VOLUNTEER_SERVICE",
                "picId": 0,
                "picUrl": ""
            },{
                "modeName": "医务社工-资料下载",
                "modeCode": "MEDICAL_VOLUNTEER_DOWNLOAD",
                "picId": 0,
                "picUrl": ""
            }],
            "id": 0
          }
    };
    componentDidMount() {
        this.getData()
    }
    /*,{
                "modeName": "专题网站",
                "modeCode": "SPECIAL_WEBSITE",
                "picId": 0,
                "picUrl": ""
            } */
    /*************************** 数据操作区 start ************************/
    
    saveData = () => {
        // console.log()
        this.state.params.topPictrueList.forEach(item => {
            if (item.modeName === '科研') {
                item.modeCode = 'RESEARCH'
            } else if (item.modeName === '教学') {
                item.modeCode = 'TEACHING'
            }
        })
        axios.post(`${URL}/admin/homePage/update?type=TOP_PICTURE`,this.state.params).then(res=>{
            if(res.data.code === 200) {
                this.getData()
            }else {
                message.error(res.data.msg)
            }
        })
    }
    getData = () => {
        let arr = this.state.data
        arr.forEach(item => {
            if (item.modeName === '科研') {
                item.modeCode = 'RESEARCH'
            } else if (item.modeName === '教学') {
                item.modeCode = 'TEACHING'
            }
        })
        axios.get(`${URL}/admin/homePage/retrieveOne`).then(res => {
            if(res.data.code === 200) {
                res.data.data && res.data.data.topPictrueList && res.data.data.topPictrueList.forEach((item,index) => {
                    if (item) {
                        item.modeName = arr[index].modeName
                    }
                })
                this.setState({
                    data: res.data.data.topPictrueList || this.state.data
                })
            }
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

    setData = (e,index) => {
        let arr = this.state.data
        arr[index][e.target.name] = e.target.value
        this.setState({
          data:arr
        })
    }
    getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    uploadFile = (file,index) => {
        if(this.isCheckFile) {
            return
        }
        this.setState({isCheckFile: true},() => {
            var fromData = new FormData()
            fromData.append('file',file.file.originFileObj)
            var arr =  this.state.data
            
            axios.post(`${URL}/admin/file/upload`,fromData).then(res => {
            if(res.data.code === 200) {
                arr[index].picId = res.data.data
                this.setState({
                    data: arr,
                    params: {...this.state.params,topPictrueList: arr}
                },() => {
                    // console.log(this.state.params)
                    this.saveData()
                })
            }else {
                message.error(res.data.msg)
            }
            }).catch(error => {
            message.error('上传失败')
            })
        })
        
      }
      delData = () => {
          let arr = this.state.data;
          if(arr.length <= 1){
              message.error('轮播图必须要有1张！')
              return
          }
          arr.splice(arr.length-1,1);
          this.setState({data: arr})
      }
    
    // handleCancel = () => this.setState({ previewVisible: false })

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
        let imgList = []
        return <section>
                <p style={{fontWeight: 'bold'}}>图片建议尺寸： 1440*330</p>
               {this.state.data.forEach((item,index) => {
                   imgList.push(<div className="top-image-box" key={index}>
                    <p className="imgName">{item.modeName}：</p>
                    <div className="imgBox" style={{display: 'flex'}}>
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            style={{width: '100%'}}
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
                            {item.picUrl ? <img width="100%" src={URL + '/' +item.picUrl} alt="avatar" /> : uploadButton}
                            {/* {item.picURl? <img width="100%" src={item.picURl} alt="avatar" /> : uploadButton} */}
                        </Upload>
                        <Button style={{marginLeft: '20px'}} onClick={() => {this.setState({curImgUrl: window.location.origin+item.picUrl,showImgModel: true})}}>预览</Button>
                    </div>
                    </div>)
               })}
                {imgList}
                <Modal
                    title="预览"
                    footer={null}
                    visible={this.state.showImgModel}
                    onOk={() => {this.setState({showImgModel: false})}}
                    onCancel={() => {this.setState({showImgModel: false})}}
                    >
                    {this.state.curImgUrl ? <img src={this.state.curImgUrl} style={{width: '100%'}} alt='img'/> : ''}
                </Modal>
            </section>
    }
}