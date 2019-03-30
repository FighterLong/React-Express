import React, { Component } from 'react';
// import { Input, Button, Col, Row, Radio, Divider, Table, Modal } from 'antd';
import {Input,  Button, Form,Modal,  Upload, Icon, message, DatePicker } from 'antd'
import moment from 'moment';
// import InputTitle from '@/component/input-title/input-title.js'
// import api from '@/api'
import Editor from '@/component/editor'
import {URL} from '@/common/js/url.js'
/*
    MapLabel键值对布局
*/
// import MapLabel from './depend/label.js'

// import BraftEditor from 'braft-editor'
// import 'braft-editor/dist/braft.css'

import './updataHospitalTraining.styl'
import axios from 'axios'
import '../../common/stylus/public.styl'

const FormItem = Form.Item

// import './hospital-training.styl'
export default class UpdateHospitalTraining extends  Component {
    state = {
        language: 'Chinese',
        loading: false,
        isFile: false,
        editorZHID: 0,
        modelZH: false,
        modelUS: false,
        // editorZHID: 1,
        fileList: [],// 文件集合
        params: {
            "accessoryList": [],
            "accessoryVedioId": "",
            "contentUS": "",
            "contentZH": "",
            "createTime": 0,
            "creator": "",
            "id": 0,
            "navbarId": 20,
            "publishTime": 0,
            "regenerator": "",
            "titleUS": "",
            "titleZH": ""
        }
    }
    componentDidMount() {
        // 获取父组件传过来的语言
        // this.getLanguage();
        this.getData(this.props.match.params.id)
        // alert(123)
    }

    // getLanguage() { // 进行错误处理  发生错误时设置默认语言为Chinese
    //     try {
    //         this.setState({
    //             language: this.props.location.query.language
    //         })
    //     } catch (error) {
    //         this.setState({
    //             language: 'Chinese'
    //         })
    //     }
    // }

    // 获取数据
    getData = (id) => {
        console.log('传过来的ID：'+id)
        this.setState({params: {...this.state.params,navbarId: id}})
        axios.post(`${URL}/admin/hospitalSituation/retrieveOne?navbarId=${id}`).then(res => {
            console.log(res.data.data)
            if(res.data.data){
                var arr = [];
                res.data.data.accessoryList = res.data.data.accessoryList ? res.data.data.accessoryList:[]
                res.data.data.accessoryList.forEach(item => {
                    arr.push({
                        name: item.showName,
                        uid: item.id,
                        thumbUrl: item.url,
                        url: URL +'/'+ (item.url + item.storageName)
                    })
                })
                this.setState({ fileList: arr})
            }
            if( res.data.code === 200) this.setState({params: {...res.data.data,navbarId: id},editorUSID: new Date().getTime()+'US',editorZHID: new Date().getTime()+'ZH'},()=>{
                // console.log(this.state.params.titleZH)
                
            })
        })
    }
    // 保存数据
    saveData = () => {
        let contentZH = ''
        let contentUS = ''
        if (this.state.params.contentZH) {
        contentZH = typeof this.state.params.contentZH === 'string' ? this.state.params.contentZH : this.state.params.contentZH.toHTML()
        }
        if (this.state.params.contentUS) {
        contentUS = typeof this.state.params.contentUS === 'string' ? this.state.params.contentUS : this.state.params.contentUS.toHTML()
        }
        // let contentZH = typeof this.state.params.contentZH === 'string' ? this.state.params.contentZH : this.state.params.contentZH.toHTML()
        // let contentUS = typeof this.state.params.contentUS === 'string' ? this.state.params.contentUS : this.state.params.contentUS.toHTML()
        this.setState({loading: true,params: {...this.state.params,contentZH,contentUS} },() => {
            axios.post(`${URL}/admin/hospitalSituation/saveOrUpdate`, this.state.params).then(res => {
                res.data.code === 200 ? message.success('保存成功', 1) : message.error(res.data.msg, 1);
                setTimeout(()=>{this.setState({loading:false})},500)
            }).catch(e => {
                message.error('服务器异常');
                setTimeout(()=>{this.setState({loading:false})},500)
            })
        })
    }

    setTitle = (e) => {
        this.setState({
            params: {...this.state.params,[e.target.name]:e.target.value}
        })
    }
    goBack() {
        window.history.back(-1)
    }
    updateContentZH = (value) => {
        this.setState({
            params: {...this.state.params,contentZH: value}
        })
    }
    updateContentUS = (value) => {
        this.setState({
            params: {...this.state.params,contentUS: value}
        })
    }

    // 上传文件
    uploadFile = (file) => {
        if(this.state.isFile){
            return
        }
        this.setState({isFile: true})
        var ids = this.state.params.accessoryVedioId;
        var fromData = new FormData()
        fromData.append('file',file.file.originFileObj)
        console.log(file)
        axios.post(`${URL}/admin/file/upload`,fromData).then(res => {
          if(res.data.code === 200) {
            ids = res.data.data? `[${res.data.data}]`:'';
            file.file.status = 'done'
            this.setState({params: {...this.state.params,accessoryVedioId: ids},isFile: false,fileList: [file.file]})
            message.success('上传成功')
          }else {
            message.error(res.data.msg)
          }
        }).catch(error => {
          message.error('上传失败')
        })
    }

    // 移除上传文件
    removeFile = () =>{
        this.setState({
            fileList: [],
            params: {...this.state.params,accessoryVedioId: ''}
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

    render() {
        let style = {
            marginRight: '40px',
            width: '33%'
        }
        const props = {
            accept: `audio/mp4,video/mp4`,
            // action: '//jsonplaceholder.typicode.com/posts/',
            // listType: 'picture',
            fileList: this.state.fileList,
            onChange: this.uploadFile,
            onRemove: this.removeFile
        }

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
            initialContent: this.state.params.contentZH,
            editorOnChange: this.updateContentZH,
            placeholder: '请输入内容',
            contentId: 2
        }

        const page2 =  {
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
            initialContent: this.state.params.contentUS,
            editorOnChange: this.updateContentUS,
            placeholder: 'Please enter the content',
            contentId: 3
        }
        
    const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
    };

        

        // let temp3 = {
        //     title: "视频",
        //     value:  <Upload {...props}>
        //                 <Button>
        //                     <Icon type="upload" /> 上传视频
        //                 </Button>
        //             </Upload>
        // }

    //    let contentE = 

        // let contentC = 

        return <section className="updateHospitalTraining">
                    <div className="updateHospitalTraining-top" style={{justifyContent: 'flex-end'}}>
                        <div>
                            <Button onClick={this.goBack}>返回</Button>
                            <Button style={{marginLeft: '15px'}} onClick={() => {this.setState({modelZH: true})}}>预览文章(中文)</Button>
                            <Button style={{marginLeft: '15px'}} onClick={() => {this.setState({modelUS: true})}}>预览文章(英文)</Button>
                            {/* <Button type="primary">发布</Button> */}
                            <Button type="primary" onClick={this.saveData}>保存</Button>
                        </div>
                    </div>
                    <Form layout="horizontal">
                        <FormItem {...formItemLayout} label="中文标题">
                            <Input placeholder="请输入中文标题" maxLength={100} name="titleZH" value={this.state.params.titleZH} onChange={(e)=>{this.setTitle(e)}} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="中副文标题">
                            <Input placeholder="请输入中文副标题" maxLength={100} name="subheadingZH" value={this.state.params.subheadingZH} onChange={(e)=>{this.setTitle(e)}} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="英文标题">
                            <Input placeholder="Please enter the title" maxLength={250} name="titleUS" value={this.state.params.titleUS} onChange={(e)=>{this.setTitle(e)}} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="英副文标题">
                            <Input placeholder="请输入英文副标题" maxLength={250} name="subheadingUS" value={this.state.params.subheadingUS} onChange={(e)=>{this.setTitle(e)}} />
                        </FormItem>
                        {
                            this.state.params.publishTime ?
                            <FormItem {...formItemLayout} label="发布时间">
                            <DatePicker defaultValue={''} placeholder={this.state.params.publishTime ? this.formatTime(this.state.params.publishTime) :"请选择日期"} format={'YYYY/MM/DD'} onChange={this.setTime}/>
                            </FormItem>
                            : null
                        }
                        <div className="updateHospitalTraining-main">
                            {/* <p>正文 :</p> */}
                            <div className="content">
                                <div className="box" style={{display: 'flex',border: 'none', padding: 0}}>
                                    <h1 className="box-title" style={{background: 'none', width: '270px',padding: 0,fontWeight: 700}}>中文内容:</h1>
                                    <div className="box-content">
                                    {/*富文本编辑框*/}
                                        <Editor {...page}/>
                                    </div>
                                </div>
                                <div className="box" style={{display: 'flex',border: 'none', padding: 0, marginTop: '40px'}}>
                                    <h1 className="box-title" style={{background: 'none', width: '270px',padding: 0,fontWeight: 700}}>英文内容:</h1>
                                    <div className="box-content">
                                        {/*富文本编辑框*/}
                                        <Editor {...page2}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <FormItem {...formItemLayout} label="视频">
                            <Upload {...props}>
                                <Button>
                                    <Icon type="upload" /> 上传视频
                                </Button>
                            </Upload>
                        </FormItem>
                    </Form>
                    {/* <div style={{overflow: 'hidden'}}> 
                        <MapLabel data={temp3}/>
                    </div> */}
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
          <div dangerouslySetInnerHTML={{__html: typeof this.state.params.contentZH === 'string' ? this.state.params.contentZH : this.state.params.contentZH.toHTML()}}></div>
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
          <h1 style={{textAlign: 'center', fontSize: '20ox'}}>{this.state.params.titleUS}</h1>
          <h1 style={{textAlign: 'center', fontSize: '18px'}}>{this.state.params.subheadingUS}</h1>
          <div dangerouslySetInnerHTML={{__html: typeof this.state.params.contentUS === 'string' ? this.state.params.contentUS : this.state.params.contentUS.toHTML()}}></div>
        </Modal>
               </section>
    }
}
// export default UpdateHospitalTraining