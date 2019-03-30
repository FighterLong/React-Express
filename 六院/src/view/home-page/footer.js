
import React, {Component} from 'react'
import {Form, Input, Upload, Button, Icon, Row, Col, Modal, message} from 'antd'
import axios from 'axios'
import './home-page.styl'
import {URL} from '@/common/js/url.js'
const FormItem = Form.Item
// const {TextArea} = Input
export default class Footer extends Component {
    state = {
        loading: false,
        ischeckFile: false,
        data: {
            "addressUS": "",
            "addressZH": "",
            "hospitalTel": "",
            "medicalComplaintTel": "",
            "medicalEthicsComplaintTel": "",
            "partners": [],
            "postcode": "510655",
            "qrCodes": []
          },
        params: {
            "homePageFooter": {
              "addressUS": "",
              "addressZH": "",
              "hospitalTel": "",
              "medicalComplaintTel": "",
              "medicalEthicsComplaintTel": "",
              "partners": [],
              "postcode": "",
              "qrCodes": []
            },
            "homePageSlideshow": [],
            "id": 0
          },
          checkHospitalTel: true,
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
                    params: res.data.data,
                    data: res.data.data.homePageFooter
                })
            }
        }).catch(error => {
            message.error('异常请求')
        })
    }
    addData = () => {
        let arr = this.state.data.partners
        // if(arr.length >= 12) {
        //     message.error('合作伙伴最多要有12个');
        //     return
        // }
        arr.push({
              "nameUS": "",
              "nameZH": "",
              "url": ""
            })
        this.setState({
            data: {...this.state.data,partners: arr}
        })
    }
    delData = (index) => {
        let arr = this.state.data.partners
        if(arr.length <= 1) {
            message.error('合作伙伴最低要有1个');
            return
        }
        arr.splice(index,1)
        this.setState({
            data: {...this.state.data,partners: arr}
        })
    }
    saveData = () => {
        console.log(this.state.data)
        this.setState({params: {...this.state.params,homePageFooter: this.state.data}},()=>{
            axios.post(`${URL}/admin/homePage/update?type=FOOTER `,this.state.params).then(res=>{
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
    
    getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    handleChange = (info,index) => {
        if(this.state.ischeckFile){
            return;
        }
        this.setState({
            ischeckFile: true
        })
        // if (info.file.status === 'uploading') {
        //     this.setState({ loading: true });
        //     return;
        // }
        // if (info.file.status === 'done') {
            // Get this url from response in real world.
           
            var fromData = new FormData()
            fromData.append('file',info.file.originFileObj)
            
            var urlData = this.state.data.qrCodes;
            this.getBase64(info.file.originFileObj, imageUrl => {
                urlData[index].picUrl = imageUrl;
            });
            axios.post(`${URL}/admin/file/upload`,fromData).then(res => {
                console.log(res.data.code)
                if(res.data.code === 200) {
                    var urlData = this.state.data.qrCodes;
                    urlData[index].picId = res.data.data ? `[${res.data.data}]` : ''
                    // urlData = res.data.data ? `[${res.data.data}]` : ''
                    this.getBase64(info.file.originFileObj, imageUrl => {
                        urlData[index].picUrl = imageUrl;
                    });
                    this.setState({
                        data: {...this.state.data, qrCodes: urlData},
                        ischeckFile: false
                    })
                    // console.log(urlData)
                    // urlData.push(res.data.data)
                    
                    message.success('上传成功')
                }else {
                    message.error(res.data.msg)
                }
            }).catch(error => {
                message.error('上传失败')
            })
        // }
    } 
    setData = (e,index) => {
        if(e.target.name === 'hospitalTel') {
            console.log(this.isCheck(e.target.value,'-'))
            this.setState({checkHospitalTel: this.isCheck(e.target.value,'-')})
        }
        let arr = this.state.data
        arr[e.target.name] = e.target.value
        this.setState({
          data:arr
        })
    }

    // 添加友情链接
    addLink = () => {
        let linkList = this.state.data.qrCodes
        if(linkList.length >=3 ){
            message.error('友情链接最多可添加3个')
            return
        }
        linkList.push({
            picId: '',
            picUrl: '',
            qrNameUS: '',
            qrNameZH: ''})
        this.setState({
            data: {...this.state.data,qrCodes: linkList}
        })
    }

    // 删除友情链接
    delLink = () => {
        let linkList = this.state.data.qrCodes
        if(linkList.length <=1 ){
            message.error('友情链接最少要有1个')
            return
        }
        linkList.splice(linkList.length-1,1)
        this.setState({
            data: {...this.state.data,qrCodes: linkList}
        })
    }

    // 合作伙伴双向绑定 e为事件对象 index当前操作数据的下标
    setUserData = (e,index) => {
        let arr = this.state.data.partners
        console.log(arr[index][e.target.name])
        arr[index][e.target.name] = e.target.value
        this.setState({
            data: {...this.state.data,partners: arr}
        })
    }
    // 友情链接双向绑定
    setLinkData = (e,index) => {
        let arr = this.state.data.qrCodes
        arr[index][e.target.name] = e.target.value
        this.setState({
            data: {...this.state.data,qrCodes: arr}
        })
    }

    // 校验 数字或数字+-
    isCheck(str,falg) {
        str = str? str: ''
        if(falg) {
            return /(0\d{2,3}-\d{7,8})/.test(str)
        }else{
            return /\d/.test(str)
        }
    }

    render() {
        // const { getFieldDecorator } = this.props.form;
        const uploadButton = (
            <div>
              <Icon type={this.state.loading ? 'loading' : 'plus'} />
              <div className="ant-upload-text">Upload</div>
            </div>
          );
        const formItemLayout = {
            labelCol: {
              xs: { span: 8 },
              sm: { span: 8},
            },
            wrapperCol: {
              xs: { span: 16 },
              sm: { span: 16 },
            },
        };
        const formItemLayout2 = {
            labelCol: {
              xs: { span: 6 },
              sm: { span: 6 },
            },
            wrapperCol: {
              xs: { span: 18 },
              sm: { span: 18 },
            },
        };
        let temp = [];
        var urlList = [];
        return <section>
                <div className="updateHospitalTraining-main">
                    <span style={{fontWeight: 'bold',fontSize: '18px'}}>首页信息/{sessionStorage.getItem('key')}</span>
                    <div style={{textAlign: 'right'}}>
                        <Button onClick={this.saveData} style={{marginBottom: '20px'}}>保存</Button>
                    </div>
                    <div className="content">
                        <div className="box">
                            <p className="box-title">微信微博</p>
                            <Form style={{padding: '10px 15px'}}>
                                <FormItem>
                                <div style={{overflow: 'hidden'}}>
                                    <p>图片建议尺寸： 80*80</p>
                                    {
                                        this.state.data.qrCodes.forEach((item,index)=>{
                                            urlList.push(
                                            <div style={{float: 'left',width: '25%',marginRight: '20px'}} key={index}>
                                                <FormItem {...formItemLayout} label='二维码' className={'hide'} >
                                                    <div style={{display: 'flex',alignItems: 'center'}}>
                                                        <Upload
                                                            name="avatar"
                                                            listType="picture-card"
                                                            className="avatar-uploader"
                                                            showUploadList={false}
                                                            // action="//jsonplaceholder.typicode.com/posts/"
                                                            beforeUpload={this.beforeUpload}
                                                            onChange={(info)=>{this.handleChange(info,index)}}
                                                        >
                                                        {item.picUrl? <img width="100%" src={item.picUrl.indexOf('base64') !== -1 ?item.picUrl: URL+ '/'+item.picUrl} alt="avatar" /> : uploadButton}
                                                        </Upload>
                                                        <Button style={{marginLeft: '20px'}} onClick={() => {this.setState({curImg: item.picUrl.indexOf('base64') !== -1 ?item.picUrl: URL + '/'+item.picUrl, previewVisible: true})}}>图片预览</Button>
                                                    </div>
                                                    <Modal visible={this.state.previewVisible} footer={null} onCancel={() => {this.setState({previewVisible: false})}}>
                                                        <img alt="example" style={{ width: '100%' }} src={this.state.curImg} />
                                                    </Modal>
                                                </FormItem>
                                                <FormItem {...formItemLayout} label="中文标题" >
                                                    <Input name='qrNameZH' value={item.qrNameZH} onChange={(e) => {this.setLinkData(e,index)}} maxLength={6}/>
                                                </FormItem>
                                                <FormItem {...formItemLayout}  label="英文标题" >
                                                    <Input name='qrNameUS' value={item.qrNameUS}  onChange={(e) => {this.setLinkData(e,index)}} maxLength={12}/>
                                                </FormItem>
                                            </div>)
                                        })
                                    }
                                    {urlList}
                                        {/* <div style={{float: 'left',width: '20%',marginRight: '20px'}}>
                                            
                                            <FormItem {...formItemLayout} label="二维码">
                                                <Upload
                                                    name="avatar"
                                                    listType="picture-card"
                                                    className="avatar-uploader"
                                                    showUploadList={false}
                                                    // action="//jsonplaceholder.typicode.com/posts/"
                                                    // beforeUpload={this.beforeUpload}
                                                    onChange={this.handleChange2}
                                                >
                                                    {this.state.imageUrl2 ? <img  width="100%"  src={this.state.imageUrl2} alt="avatar" /> : uploadButton}
                                                </Upload>
                                            </FormItem>
                                            <FormItem {...formItemLayout} label="中文标题">
                                                <Input name='titleZH' onChange={(e) => {this.setData(e)}} />
                                            </FormItem>
                                            <FormItem {...formItemLayout} label="英文标题">
                                                <Input name='titleUS'  onChange={(e) => {this.setData(e)}} />
                                            </FormItem>
                                        </div>
                                        <div style={{float: 'left',width: '20%',marginRight: '20px'}}>
                                            <FormItem {...formItemLayout} >
                                                <Upload
                                                    name="avatar"
                                                    listType="picture-card"
                                                    className="avatar-uploader"
                                                    showUploadList={false}
                                                    // action="//jsonplaceholder.typicode.com/posts/"
                                                    // beforeUpload={this.beforeUpload}
                                                    onChange={this.handleChange3}
                                                >
                                                    {this.state.imageUrl3 ? <img width="100%" src={this.state.imageUrl3} alt="avatar" /> : uploadButton}
                                                </Upload>
                                            </FormItem>
                                            <FormItem {...formItemLayout}  >
                                                <Input name='titleZH' onChange={(e) => {this.setData(e)}} />
                                            </FormItem>
                                            <FormItem {...formItemLayout}  >
                                                <Input name='titleUS'  onChange={(e) => {this.setData(e)}} />
                                            </FormItem>
                                        </div> */}
                                        
                                    </div>
                                    <Button type="primary" style={{marginRight: '20px'}} onClick={this.addLink}>添加微信微博</Button>
                                    <Button type="danger" onClick={this.delLink}>删除微信微博</Button>
                                </FormItem>
                            </Form>
                        </div>
                        <div className="box">
                            <p className="box-title">联系方式</p>
                            <Form style={{padding: '10px 15px'}}>
                                <FormItem label="医院总机">
                                    <Input name='hospitalTel' maxLength={15} style={this.state.checkHospitalTel ? {width: '400px'} : {width: '400px',borderColor: '#f00'}} value={this.state.data.hospitalTel} onChange={(e) => {this.setData(e)}} />
                                </FormItem>
                                <FormItem label="医院投诉">
                                    <Input name='medicalComplaintTel' maxLength={15} style={{width: '400px'}} value={this.state.data.medicalComplaintTel} onChange={(e) => {this.setData(e)}} />
                                </FormItem>
                                <FormItem label="医德医风投诉">
                                    <Input name='medicalEthicsComplaintTel  maxLength={15}' style={{width: '400px'}} value={this.state.data.medicalEthicsComplaintTel} onChange={(e) => {this.setData(e)}} />
                                </FormItem>
                                <FormItem label="邮编">
                                    <Input name='postcode'  maxLength={6} style={{width: '400px'}} value={this.state.data.postcode} onChange={(e) => {this.setData(e)}} />
                                    {/* <Input name='postcode' style={{width: '400px',borderColor: '#f00'}} value={this.state.data.postcode} onChange={(e) => {this.setData(e)}} /> */}
                                </FormItem>
                                <FormItem label="地址">
                                    <Input name='addressZH'  maxLength={30} style={{width: '400px'}} value={this.state.data.addressZH} onChange={(e) => {this.setData(e)}} />
                                </FormItem>
                                <FormItem label="英文地址">
                                    <Input name='addressUS'  maxLength={50} style={{width: '400px'}} value={this.state.data.addressUS} onChange={(e) => {this.setData(e)}} />
                                </FormItem>
                            </Form>
                        </div>
                        <div className="box">
                            <p className="box-title">友情链接</p>
                            <Form style={{padding: '10px 15px'}}>
                                {this.state.data.partners&&this.state.data.partners.forEach((item,index)=>{
                                    temp.push(
                                        <Row style={{marginTop: '15px'}} key={index}>
                                            <Col span={7}>
                                                <FormItem label="名称" {...formItemLayout2}  >
                                                    <Input name='nameZH'  maxLength={11} value={item.nameZH} onChange={(e) => {this.setUserData(e,index)}} />
                                                </FormItem>
                                            </Col>
                                            <Col span={7}>
                                                <FormItem label="英文名称" {...formItemLayout2}  >
                                                    <Input name='nameUS'  maxLength={20}  value={item.nameUS}  onChange={(e) => {this.setUserData(e,index)}} />
                                                </FormItem>
                                            </Col>
                                            <Col span={7}>
                                                <FormItem label="链接" {...formItemLayout2}  >
                                                    <Input name='url'  maxLength={40} value={item.url} onChange={(e) => {this.setUserData(e,index)}} />
                                                </FormItem>
                                            </Col>
                                            <Col span={3} style={{marginTop: '4px',textAlign: 'center'}}>
                                                <Button type="danger" onClick={()=>{this.delData(index)}}>删除</Button>
                                            </Col>
                                        </Row>
                                    )
                                }) }
                                {temp}
                                <div style={{textAlign: 'center'}}><Button type="primary" onClick={this.addData}>添加</Button></div>
                            </Form>
                        </div>
                    </div>
                </div>
            </section>
    }
}