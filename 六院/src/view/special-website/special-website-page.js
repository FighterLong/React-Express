import React, {Component} from 'react';
import Title from '@/component/title'
import { Input, Button, Radio, Upload, Form, Icon, message, Modal} from 'antd';
import {URL} from '@/common/js/url.js'
import axios from 'axios'
import './page.styl'
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
export default class specialWebsitePage extends Component{
    state = {
        previewVisible: false,
        previewImage: '',
        params: {},
        coverMapVisible: false,
        coverMapImage: '',
        coverMapFile: [],
        topGraphFile: [],
        topGraphImage: '',
        topGraphVisible: false,
        fileList: [{
          uid: '-1',
          name: 'xxx.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        }],
        loading: false
    }
    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
      this.setState({
        previewImage: file.url || file.thumbUrl,
        previewVisible: true,
      });
    }
  
    handleChange = ({ fileList, file }) => {
        this.uploadFile(file)
        this.setState({ fileList })
    }
  
    // 返回
    goBack = () => {
      this.props.history.goBack(-1)
      console.log(this.props)
      // window.history.back(-1)
    }

    // 预览封面图
    showCoverMapImage = () => {
        this.setState({coverMapVisible: true})
    }

    // 上传封面
    uploadCoverMap = ({file}) => {
        if (this.state.coverMapFile.length) {
            return
        }
        this.uploadFile(file).then(res => {
            let url = res.data.data
            if (url) {
                this.setState({coverMapImage: url, coverMapFile: [file]}, () => {
                    // message.success('上传成功')
                })
            } else {
                message.error('上传失败')
            }
        })
       
    }

    // 删除封面
    removeCoverMap = () => {
        this.setState({coverMapFile: []})
    }

    // 预览顶部图
    showTopGraph = () => {
        this.setState({topGraphVisible: true})
    }

    // 上传顶部图
    uploadTopGraph = ({file}) => {
        if (this.state.topGraphFile.length) {
            return
        }
        this.uploadFile(file).then(res => {
            let url = res.data.data
            if (url) {
                this.setState({topGraphImage: url, topGraphFile: [file]}, () => {
                    // message.success('上传成功')
                })
            } else {
                message.error('上传失败')
            }
        })
    }

    // 删除顶部图
    removeTopGraph = () => {
        this.setState({topGraphFile: []})
    }

    // 上传文件
    uploadFile =  async (file) => {
        let formData = new FormData()
        formData.append('file', file.originFileObj)

        let temp = ''
        await axios.post(`${URL}/admin/file/uploadReturnPath`, formData).then(res => {
            file.status = 'done'
            temp = res
        })
        return temp
    }

    // 保存网站配置
    saveWebsite = () => {
        let styleType = this.state.params.styleType.trim()
        // if (!this.state.coverMapImage || !this.state.topGraphImage) {
        //     message.error('顶部图与封面图为必填项')
        //     return
        // }
        axios.get(`${URL}/admin/specialWebsite/updateConfig?navbarId=${this.state.params.id}&styleType=${styleType}&coverPicUrl=${this.state.coverMapImage}&topPicUrl=${this.state.topGraphImage}`).then(res => {
            this.setState({params: {...this.state.params,coverPictureUrl: this.state.coverMapImage, topPictureUrl: this.state.topGraphImage}}, () => {
                if (res.data.code === 200) {
                    message.success('保存成功')
                    sessionStorage.setItem('websiteData', JSON.stringify(this.state.params))
                } else {
                    message.error(res.data.msg)
                }
                
            })

        })
    }

    componentDidMount() {
        let data = JSON.parse(sessionStorage.getItem('websiteData'))
        let coverMapFile = []
        let topGraphFile = []
        var obj = {
            uid: '-1',
            name: 'xxx.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        }
        if (data.coverPictureUrl) {
            var temp = {...obj, url: URL + '/' + data.coverPictureUrl}
            coverMapFile.push(temp)
        }
        if (data.topPictureUrl) {
            var temp = {...obj, url: URL + '/' + data.topPictureUrl}
            topGraphFile.push(temp)
        }
        this.setState({params: data,coverMapFile,topGraphFile, coverMapImage: data.coverPictureUrl, topGraphImage: data.topPictureUrl})
    }
    render () {
        const uploadButton = (
          <div>
            <Icon type="plus" />
            <div className="ant-upload-text">Upload</div>
          </div>
        );
        return (<div>
            <Title title="网站配置" />
            <span style={{float: 'right'}}>
              <Button style={{marginLeft: '15px'}} onClick={this.goBack}>返回</Button>
              <Button style={{marginLeft: '15px'}} type="primary" loading={this.state.loading} onClick={this.saveWebsite}>保存</Button>
            </span>
            <Form style={{padding: '0 60px'}}>
                <FormItem label="网站名称">
                    <h1 className="websiteTitle">{this.state.params.name}</h1>
                </FormItem>
                <FormItem label="主题颜色">
                <div style={{display: 'flex'}}>
                    <div className="backgroundPage color1" onClick={() => {this.setState({params: {...this.state.params,styleType: 'RED'}})}}>{this.state.params.styleType === 'RED' ? <Icon className="page" type="check-circle" />: null}</div>
                    <div className="backgroundPage color2" onClick={() => {this.setState({params: {...this.state.params,styleType: 'GREEN'}})}}>{this.state.params.styleType === 'GREEN' ? <Icon className="page" type="check-circle" />: null}</div>
                    <div className="backgroundPage color3" onClick={() => {this.setState({params: {...this.state.params,styleType: 'BLUE'}})}}>{this.state.params.styleType === 'BLUE' ? <Icon className="page" type="check-circle" />: null}</div>
                </div>
                </FormItem>
                <FormItem label="网站封面图">
                    <Upload
                        accept="image/*"
                        listType="picture-card"
                        name="avatar"
                        className="avatar-uploader"
                        fileList={this.state.coverMapFile}
                        onPreview={this.showCoverMapImage}
                        onChange={this.uploadCoverMap}
                        onRemove={this.removeCoverMap}
                    >
                        {this.state.coverMapFile.length >= 1 ? null : uploadButton}
                    </Upload>
                    <Modal visible={this.state.coverMapVisible} footer={null} onCancel={() => { this.setState({coverMapVisible: false})}}>
                       {this.state.coverMapImage ?  <img alt="example" style={{ width: '100%' }} src={URL + '/' + this.state.coverMapImage } /> : null}
                    </Modal>
                </FormItem>
                <FormItem label="网站顶部图">
                    <Upload
                        accept="image/*"
                        listType="picture-card"
                        name="avatar"
                        fileList={this.state.topGraphFile}
                        onPreview={this.showTopGraph}
                        onChange={this.uploadTopGraph}
                        onRemove={this.removeTopGraph}
                    >
                        {this.state.topGraphFile.length >= 1 ? null : uploadButton}
                    </Upload>
                    <Modal visible={this.state.topGraphVisible} footer={null} onCancel={() => { this.setState({topGraphVisible: false})}}>
                       {this.state.topGraphImage ?  <img alt="example" style={{ width: '100%' }} src={URL + '/' + this.state.topGraphImage } /> : null}
                    </Modal>
                </FormItem>
            </Form>
        </div>)
    }
}