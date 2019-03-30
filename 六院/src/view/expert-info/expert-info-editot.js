import React, { Component } from 'react';
// import { Input, Button, Col, Row, Radio, Divider, Table, Modal } from 'antd';
import { Input, Upload, Icon, Button, message, Row, Col, Select, Form, Modal, DatePicker} from 'antd';
import Tools from '@/component/tools/tools.js'
import moment from 'moment';

// import InputTitle from '@/component/input-title/input-title.js'
// import api from '@/api'
import Editor from '@/component/editor'
/*
    MapLabel键值对布局
*/
// import MapLabel from './depend/label.js'

// import BraftEditor from 'braft-editor'
// import 'braft-editor/dist/braft.css'

import './expert-info-editot.styl'
import axios from 'axios'
import {URL} from '@/common/js/url.js'

const Option = Select.Option
const FormItem = Form.Item;

// import './hospital-training.styl'
export default class expertInfoEditot extends  Component {
    constructor(props) {
        super();
        this.state = {
            isCheckFile: false,
            language: 'Chinese',
            defaultDepartment: [],
            resumeContentUSId: 0,
            resumeContentZHId: 1,
            researchTeachingUSId: 2,
            researchTeachingZHId: 3,
            academicWorkZHId: 4,
            academicWorkUSId: 5,
            introductioinContentZHId: 6,
            introductioinContentUSId: 7,
            honoraryAwardZHId: 8,
            honoraryAwardUSId: 9,
            medicalSpecialtyUSId: 10,
            medicalSpecialtyZHId: 11,
            params: {
                "academicWorkUS": "",
                "academicWorkZH": "",
                "consultLinkUrl": "",
                "consultTimeUS": "",
                "consultTimeZH": "",
                "createTime": "",
                "creator": "",
                "departmentIds": "",
                "expertJobTitleUS": "",
                "expertJobTitleZH": "",
                "expertNameUS": "",
                "expertNameZH": "",
                "expertPositionUS": "",
                "expertPositionZH": "",
                "medicalSpecialtyZH": "",
                "medicalSpecialtyUS": "",
                "honoraryAwardUS": "",
                "honoraryAwardZH": "",
                "id": 0,
                "introductioinContentUS": "",
                "introductioinContentZH": "",
                "levelText": "SENIOR",
                "publishTime": 0,
                "researchTeachingUS": "",
                "researchTeachingZH": "",
                "resumeContentUS": "",
                "resumeContentZH": ""
              }
        }
        // let language = props.location.query;
        // console.log(language);
    }
    componentDidMount() {
        // 获取父组件传过来的语言
        // this.getLanguage();
        console.log(this.props.location)
        if(this.props.match.params.id !== 'NEW'){
            this.setState({params: {...this.state.params}}, () => {
                this.getData(this.props.match.params.id)
            })
        } else {
            let seq = sessionStorage.getItem('maxLength') ? parseInt(sessionStorage.getItem('maxLength')) + 1 : 0
            this.setState({params: {...this.state.params, seq}})
        }
        this.getRelativeDepartMent()
    }

    
    /************************* 数据操作区 start *****************************/
    // 获取数据
    getData = (id) => {
        console.log('传过来的ID：'+id)
        axios.get(`${URL}/admin/expert/retrieveOne?id=${id}`).then(res => {
            console.log(res.data.data)
            if( res.data.code === 200) this.setState({
                defaultDepartment: res.data.data.departmentIds || [],
                params: {...res.data.data},
                resumeContentUSId: new Date().getTime()+'resumeContentUSId',
                resumeContentZHId: new Date().getTime()+'resumeContentZHId',
                researchTeachingUSId: new Date().getTime()+'researchTeachingUSId',
                researchTeachingZHId: new Date().getTime()+'researchTeachingZHId',
                academicWorkZHId: new Date().getTime()+'academicWorkZHId',
                academicWorkUSId: new Date().getTime()+'academicWorkUSId',
                introductioinContentZHId: new Date().getTime()+'introductioinContentZHId',
                introductioinContentUSId: new Date().getTime()+'introductioinContentUSId',
                honoraryAwardZHId: new Date().getTime()+'honoraryAwardZHId',
                honoraryAwardUSId: new Date().getTime()+'honoraryAwardUSId',
                medicalSpecialtyUSId: new Date().getTime()+'medicalSpecialtyUSId',
                medicalSpecialtyZHId: new Date().getTime()+'medicalSpecialtyZHId',
                imageUrl: res.data.data.iconUrl},()=>{
                    console.log( this.state.defaultDepartment)
                    console.log(typeof this.state.defaultDepartment  === 'string' ? JSON.parse(this.state.defaultDepartment): this.state.defaultDepartment)
                    // let arr =[]
                    let arr = (typeof this.state.defaultDepartment  === 'string' ? JSON.parse(this.state.defaultDepartment): this.state.defaultDepartment)
                    let arr2 =  []
                    arr.forEach(item=>{
                      item +=''
                      arr2.push(item)
                    })
                    console.log(arr2)
                    this.setState({
                      defaultDepartment: arr2
                    })
                  })
        }).catch(error => {
            message.error('请求异常')
        })
    }
    // 添加数据
    addData = () => {
        // let arr =this.state.params.departmentIds
        if (!this.state.params.seq) {
            message.error('排序号为必填项')
            return
        }
        let arr;
        if(typeof this.state.params.departmentIds  === 'string' && this.state.params.departmentIds.length){
            arr = JSON.parse(this.state.params.departmentIds)
        }else {
            
            arr = this.state.params.departmentIds
        }
        arr = arr.length ? `[${arr.toString()}]` : ''
        /*"academicWorkUS": "",
                "academicWorkZH": "",
                "consultLinkUrl": "",
                "consultTimeUS": "",
                "consultTimeZH": "",
                "createTime": "",
                "creator": "",
                "departmentIds": "",
                "expertJobTitleUS": "",
                "expertJobTitleZH": "",
                "expertNameUS": "",
                "expertNameZH": "",
                "expertPositionUS": "",
                "expertPositionZH": "",
                "honoraryAwardUS": "",
                "honoraryAwardZH": "",
                "id": 0,
                "introductioinContentUS": "",
                "introductioinContentZH": "",
                "levelText": "SENIOR",
                "publishTime": 0,
                "researchTeachingUS": "",
                "researchTeachingZH": "",
                "resumeContentUS": "",
                "resumeContentZH": "" */
        let academicWorkZH = typeof this.state.params.academicWorkZH === 'string' ? this.state.params.academicWorkZH : this.state.params.academicWorkZH.toHTML()
        let academicWorkUS = typeof this.state.params.academicWorkUS === 'string' ? this.state.params.academicWorkUS : this.state.params.academicWorkUS.toHTML()
        let honoraryAwardUS = typeof this.state.params.honoraryAwardUS === 'string' ? this.state.params.honoraryAwardUS : this.state.params.honoraryAwardUS.toHTML()
        let honoraryAwardZH = typeof this.state.params.honoraryAwardZH === 'string' ? this.state.params.honoraryAwardZH : this.state.params.honoraryAwardZH.toHTML()
        let introductioinContentUS = typeof this.state.params.introductioinContentUS === 'string' ? this.state.params.introductioinContentUS : this.state.params.introductioinContentUS.toHTML()
        let introductioinContentZH = typeof this.state.params.introductioinContentZH === 'string' ? this.state.params.introductioinContentZH : this.state.params.introductioinContentZH.toHTML()
        let resumeContentUS = typeof this.state.params.resumeContentUS === 'string' ? this.state.params.resumeContentUS : this.state.params.resumeContentUS.toHTML()
        let resumeContentZH = typeof this.state.params.resumeContentZH === 'string' ? this.state.params.resumeContentZH : this.state.params.resumeContentZH.toHTML()
        let researchTeachingUS = typeof this.state.params.researchTeachingUS === 'string' ? this.state.params.researchTeachingUS : this.state.params.researchTeachingUS.toHTML()
        let researchTeachingZH = typeof this.state.params.researchTeachingZH === 'string' ? this.state.params.researchTeachingZH : this.state.params.researchTeachingZH.toHTML()
        
        this.setState({submitting: true,params: {...this.state.params,departmentIds:arr,
            academicWorkZH,
            academicWorkUS,
            honoraryAwardUS,
            honoraryAwardZH,
            introductioinContentUS,
            introductioinContentZH,
            resumeContentUS,
            resumeContentZH,
            researchTeachingUS,
            researchTeachingZH
        }},()=>{
            axios.post(`${URL}/admin/expert/save`, this.state.params).then(res => {
                if(res.data.code === 200){
                    this.goBack();
                    message.success('添加成功',1);
                  }else{
                    message.error(res.data.msg);
                  }
            }).catch(e => {
                message.error('请求异常')
            })
        })
    }
    // 修改保存
    updateData = () => {
        let arr;
        if(typeof this.state.params.departmentIds  === 'string' && this.state.params.departmentIds.length){
            arr = JSON.parse(this.state.params.departmentIds)
        }else {
            
            arr = this.state.params.departmentIds
        }
        console.log(arr)
        console.log(this.state.params)
        arr = arr.length ? `[${arr.toString()}]` : ''
        let academicWorkZH = ''
        let academicWorkUS = ''
        if (this.state.params.academicWorkUS && typeof this.state.params.academicWorkUS === 'object') {
          academicWorkUS = this.state.params.academicWorkUS.toHTML()
        } else {
            academicWorkUS = this.state.params.academicWorkUS
        }
        if (this.state.params.academicWorkZH && typeof this.state.params.academicWorkZH === 'object') {
          academicWorkZH = this.state.params.academicWorkZH.toHTML()
        } else {
          academicWorkZH = this.state.params.academicWorkZH
        }
        let honoraryAwardZH = ''
        let honoraryAwardUS = ''
        if (this.state.params.honoraryAwardUS && typeof this.state.params.honoraryAwardUS === 'object') {
            honoraryAwardUS = this.state.params.honoraryAwardUS.toHTML()
        } else {
            honoraryAwardUS = this.state.params.honoraryAwardUS
        }
        if (this.state.params.honoraryAwardZH && typeof this.state.params.honoraryAwardZH === 'object') {
            honoraryAwardZH = this.state.params.honoraryAwardZH.toHTML()
        } else {
            honoraryAwardZH = this.state.params.honoraryAwardZH
        }
        let introductioinContentUS = ''
        let introductioinContentZH = ''
        if (this.state.params.introductioinContentUS && typeof this.state.params.introductioinContentUS === 'object') {
            introductioinContentUS = this.state.params.introductioinContentUS.toHTML()
        } else {
            introductioinContentUS = this.state.params.introductioinContentUS
        }
        if (this.state.params.introductioinContentZH && typeof this.state.params.introductioinContentZH === 'object') {
            introductioinContentZH = this.state.params.introductioinContentZH.toHTML()
        } else {
            introductioinContentZH = this.state.params.introductioinContentZH
        }
        let resumeContentUS = ''
        let resumeContentZH = ''
        if (this.state.params.resumeContentUS &&typeof this.state.params.resumeContentUS === 'object') {
            resumeContentUS = this.state.params.resumeContentUS.toHTML()
        } else {
            resumeContentUS = this.state.params.resumeContentUS
        }
        if (this.state.params.resumeContentZH && typeof this.state.params.resumeContentZH === 'object') {
            resumeContentZH = this.state.params.resumeContentZH.toHTML()
        } else {
            resumeContentZH = this.state.params.resumeContentZH
        }
        let researchTeachingUS = ''
        let researchTeachingZH = ''
        if (this.state.params.researchTeachingUS && typeof this.state.params.researchTeachingUS === 'object') {
            researchTeachingUS = this.state.params.researchTeachingUS.toHTML()
        } else {
            researchTeachingUS = this.state.params.researchTeachingUS
        }
        if (this.state.params.researchTeachingZH && typeof this.state.params.researchTeachingZH === 'object') {
            researchTeachingZH = this.state.params.researchTeachingZH.toHTML()
        } else {
            researchTeachingZH = this.state.params.researchTeachingZH
        }
        // let academicWorkZH = typeof this.state.params.academicWorkZH === 'string' ? this.state.params.academicWorkZH : this.state.params.academicWorkZH.toHTML()
        // let academicWorkUS = typeof this.state.params.academicWorkUS === 'string' ? this.state.params.academicWorkUS : this.state.params.academicWorkUS.toHTML()
        // let honoraryAwardUS = typeof this.state.params.honoraryAwardUS === 'string' ? this.state.params.honoraryAwardUS : this.state.params.honoraryAwardUS.toHTML()
        // let honoraryAwardZH = typeof this.state.params.honoraryAwardZH === 'string' ? this.state.params.honoraryAwardZH : this.state.params.honoraryAwardZH.toHTML()
        // let introductioinContentUS = typeof this.state.params.introductioinContentUS === 'string' ? this.state.params.introductioinContentUS : this.state.params.introductioinContentUS.toHTML()
        // let introductioinContentZH = typeof this.state.params.introductioinContentZH === 'string' ? this.state.params.introductioinContentZH : this.state.params.introductioinContentZH.toHTML()
        // let resumeContentUS = typeof this.state.params.resumeContentUS === 'string' ? this.state.params.resumeContentUS : this.state.params.resumeContentUS.toHTML()
        // let resumeContentZH = typeof this.state.params.resumeContentZH === 'string' ? this.state.params.resumeContentZH : this.state.params.resumeContentZH.toHTML()
        // let researchTeachingUS = typeof this.state.params.researchTeachingUS === 'string' ? this.state.params.researchTeachingUS : this.state.params.researchTeachingUS.toHTML()
        // let researchTeachingZH = typeof this.state.params.researchTeachingZH === 'string' ? this.state.params.researchTeachingZH : this.state.params.researchTeachingZH.toHTML()
        
        this.setState({submitting: true,params: {...this.state.params,departmentIds:arr,
            academicWorkZH,
            academicWorkUS,
            honoraryAwardUS,
            honoraryAwardZH,
            introductioinContentUS,
            introductioinContentZH,
            resumeContentUS,
            resumeContentZH,
            researchTeachingUS,
            researchTeachingZH
        }},()=>{
            axios.post(`${URL}/admin/expert/update`, this.state.params).then(res => {
                res.data.code === 200 ? message.success('编辑成功',1) : message.error(res.data.msg,1)
            }).catch(error => {
                message.error('请求异常')
            })
        })
       
    }
    
    // 获取相关科室
    getRelativeDepartMent = () => {
        axios.get(`${URL}/admin/department/departmentReminder`).then(res => {
        if(res.data.code === 200 && res.data.data) {
            let option = []
            res.data.data.forEach((item,index)=>{
            option.push(<Option key={item.id}>{item.name}</Option>);
            })
            this.setState({option})
        }
        })
    }
    /************************* 数据操作区 end ********************************/

    
    /************************* 数据双向绑定区  start *************************/
    // 设置双向绑定  name=字段名  必填项  局限于表单元素
    setFromData = (e) => {
        if (e.target.name === 'seq' && isNaN(e.target.value)) {
            return
        }
        this.setState({params: {...this.state.params,[e.target.name]: e.target.value}})
    }
    setlevelText = (value) => {
        this.setState({params: {...this.state.params,levelText: value}})
    }
    setdepartmentIds = (value) => {
        value = value.length ? value : ''
        this.setState({params: {...this.state.params,departmentIds: value},defaultDepartment: value?value: []})
    }
    // 富文本
    // 设置中文简历
    setResumeContentZH = (value) => {
        this.setState({ params: {...this.state.params, resumeContentZH: value} })
    }
    // 设置英文简历
    setResumeContentUS = (value) => {
        this.setState({ params: {...this.state.params, resumeContentUS: value} })
    }
    // 设置英文科研教学
    setResearchTeachingUS = (value) => {
        this.setState({ params: {...this.state.params, researchTeachingUS: value} })
    }
    // 设置中文科研教学
    setResearchTeachingZH = (value) => {
        this.setState({ params: {...this.state.params, researchTeachingZH: value} })
    }
    // 设置英文学术任职
    setAcademicWorkUS = (value) => {
        this.setState({ params: {...this.state.params, academicWorkUS: value} })
    }
    // 设置中文学术任职
    setAcademicWorkZH = (value) => {
        this.setState({ params: {...this.state.params, academicWorkZH: value} })
    }
    // 设置英文详细介绍
    setIntroductioinContentUS = (value) => {
        this.setState({ params: {...this.state.params, introductioinContentUS: value} })
    }
    // 设置中文详细介绍
    setIntroductioinContentZH = (value) => {
        this.setState({ params: {...this.state.params, introductioinContentZH: value} })
    }
    // 设置英文荣誉奖项
    setHonoraryAwardUS = (value) => {
        this.setState({ params: {...this.state.params, honoraryAwardUS: value} })
    }
    // 设置中文荣誉奖项
    setHonoraryAwardZH = (value) => {
        this.setState({ params: {...this.state.params, honoraryAwardZH: value} })
    }

    // 设置中文医疗专长
    setMedicalSpecialtyZH = (value) => {
        this.setState({params: {...this.state.params, medicalSpecialtyZH: value}})
    }

    // 设置英文医疗专长
    setMedicalSpecialtyUS = (value) => {
        this.setState({params: {...this.state.params, medicalSpecialtyUS: value}})
    }

    /************************* 数据双向绑定区  end ***************************/


    /************************* 其他操作区 start ******************************/
    // 返回
    goBack() {
        window.history.back(-1)
    }
    // 判断是否为添加
    isAdd = () => {
        this.props.match.params.id === 'NEW' ? this.addData() : this.updateData();
    }
    // 上次头像的格式判断
    beforeUpload = (file) => {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJPG) {
            message.error('请上传jpg或png图片!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
        message.error('文件大小最多不能超过2MB!');
        }
        return isJPG && isLt2M;
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
    /************************* 其他操作区 end ********************************/
    getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
    handleChange = (file) => {
        if(this.state.isCheckFile){
            return
        }
        if(!this.beforeUpload(file.file)) {
          return
        }
        this.setState({
            isCheckFile: true
        })
        var fromData = new FormData()
        fromData.append('file',file.file.originFileObj)
        console.log(file)
        this.getBase64(file.file.originFileObj, imageUrl => this.setState({
            imageUrl,
            loading: false,
        }));
        axios.post(`${URL}/admin/file/upload`,fromData).then(res => {
          if(res.data.code === 200) {
            message.success('上传成功')
            this.setState({params: {...this.state.params,icon: res.data.data?`[${res.data.data}]`:''},isCheckFile: false})
          }else {
            message.error(res.data.msg)
          }
        }).catch(error => {
          message.error('上传失败')
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
        // const fileList = [];
        // const props = {
        //     // action: '//jsonplaceholder.typicode.com/posts/',
        //     listType: 'picture',
        //     defaultFileList: [...fileList]
        // }

        // 富文本框配置信息  模板
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
            initialContent: '',
            editorOnChange: '',
            placeholder: '请输入内容'
        }

        /**************************************** 富文本配置区 start ************************************/
        //  英文个人简历
        let resumeContentUSPage = {...page,initialContent: this.state.params.resumeContentUS,editorOnChange: this.setResumeContentUS,contentId: this.state.resumeContentUSId}
        //  中文个人简历
        let resumeContentZHPage = {...page,initialContent: this.state.params.resumeContentZH,editorOnChange: this.setResumeContentZH,contentId: this.state.resumeContentZHId}
        //  英文科研教学
        let researchTeachingUSPage =  {...page,initialContent: this.state.params.researchTeachingUS,editorOnChange: this.setResearchTeachingUS,contentId: this.state.researchTeachingUSId}
        //  中文科研教学
        let researchTeachingZHPage =  {...page,initialContent: this.state.params.researchTeachingZH,editorOnChange: this.setResearchTeachingZH,contentId: this.state.researchTeachingZHId}
        //  英文学术任职
        let academicWorkUSPage = {...page,initialContent: this.state.params.academicWorkUS,editorOnChange: this.setAcademicWorkUS,contentId: this.state.academicWorkUSId}
        //  中文学术任职
        let academicWorkZHPage = {...page,initialContent: this.state.params.academicWorkZH,editorOnChange: this.setAcademicWorkZH,contentId: this.state.academicWorkZHId}
        //  英文详细介绍
        let introductioinContentUSPage = {...page,initialContent: this.state.params.introductioinContentUS,editorOnChange: this.setIntroductioinContentUS,contentId: this.state.introductioinContentUSId}
        //  英文详细介绍
        let introductioinContentZHPage = {...page,initialContent: this.state.params.introductioinContentZH,editorOnChange: this.setIntroductioinContentZH,contentId: this.state.introductioinContentZHId}
        //  英文荣誉奖项
        let honoraryAwardUSPage = {...page,initialContent: this.state.params.honoraryAwardUS,editorOnChange: this.setHonoraryAwardUS,contentId: this.state.honoraryAwardUSId}
        //  英文荣誉奖项
        let honoraryAwardZHPage = {...page,initialContent: this.state.params.honoraryAwardZH,editorOnChange: this.setHonoraryAwardZH,contentId: this.state.honoraryAwardZHId}
       
        // 医疗专长
        let medicalSpecialtyZHPage = {...page,initialContent: this.state.params.medicalSpecialtyZH,editorOnChange: this.setMedicalSpecialtyZH,contentId: this.state.medicalSpecialtyZHId}
        let medicalSpecialtyUSPage =  {...page,initialContent: this.state.params.medicalSpecialtyUS,editorOnChange: this.setMedicalSpecialtyUS,contentId: this.state.medicalSpecialtyUSId}
        
        /***************************************** 富文本配置区 end ***********************************/

        /***************************************** 富文本编辑框定义区 start  ***********************************/
        let contentE = <div className="box">
                        <h1 className="box-title">英文详细介绍</h1>
                        <div className="box-content">
                            <Editor {...introductioinContentUSPage}/>
                        </div>
                    </div>

        let contentC = <div className="box">
                            <h1 className="box-title">中文详细介绍</h1>
                            <div className="box-content">
                                <Editor {...introductioinContentZHPage}/>
                            </div>
                        </div>

        let resumeUS = <div className="box">
                        <h1 className="box-title">英文个人简历</h1>
                        <div className="box-content">
                            <Editor {...resumeContentUSPage}/>
                        </div>
                    </div>

        let resumeZH = <div className="box">
                            <h1 className="box-title">中文个人简历</h1>
                            <div className="box-content">
                                <Editor {...resumeContentZHPage}/>
                            </div>
                        </div>

        let academicZH = <div className="box">
                        <h1 className="box-title">中文学术任职</h1>
                        <div className="box-content">
                            <Editor {...academicWorkZHPage}/>
                        </div>
                    </div>

        let academicUS = <div className="box">
                            <h1 className="box-title">英文学术任职</h1>
                            <div className="box-content">
                                <Editor {...academicWorkUSPage}/>
                            </div>
                        </div>

        let researchZH = <div className="box">
                            <h1 className="box-title">中文科研教学</h1>
                            <div className="box-content">
                                <Editor {...researchTeachingZHPage}/>
                            </div>
                        </div>

        let researchUS = <div className="box">
                            <h1 className="box-title">英文科研教学</h1>
                            <div className="box-content">
                                <Editor {...researchTeachingUSPage}/>
                            </div>
                        </div>
        
        let honorZH = <div className="box">
                        <h1 className="box-title">中文荣誉奖项</h1>
                        <div className="box-content">
                            <Editor {...honoraryAwardZHPage}/>
                        </div>
                    </div>

        let honorUS = <div className="box">
                        <h1 className="box-title">英文荣誉奖项</h1>
                        <div className="box-content">
                            <Editor {...honoraryAwardUSPage}/>
                        </div>
                    </div>

        let medicalSpecialtyUS = <div className="box">
            <h1 className="box-title">英文医疗专长</h1>
            <div className="box-content">
                <Editor {...medicalSpecialtyUSPage}/>
            </div>
        </div>

        let medicalSpecialtyZH = <div className="box">
            <h1 className="box-title">中文医疗专长</h1>
            <div className="box-content">
                <Editor {...medicalSpecialtyZHPage}/>
            </div>
        </div>
        /***************************************** 富文本编辑框定义区 end  ***********************************/
                    
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
        const uploadButton = (
            <div>
              <Icon type={this.state.loading ? 'loading' : 'plus'} />
              <div className="ant-upload-text">Upload</div>
            </div>
          );
        const imageUrl = this.state.imageUrl;
      
        return <section className="updateHospitalTraining">
                    <div id="messsage"></div>
                    <Tools></Tools>
                    <div className="updateHospitalTraining-top" style={{justifyContent: 'flex-end'}}>
                        <div>
                            <Button onClick={this.goBack}>返回</Button>
                            {/* <Button type="primary">发布</Button> */}
                            <Button type="primary" onClick={this.isAdd}>保存</Button>
                        </div>
                    </div>
                    <p style={{fontWeight: 'bold'}}>头像推荐尺寸：176*226</p>
                    <FormItem {...formItemLayout} label="专家头像">
                        <div style={{display: 'flex',alignItems: 'center'}}>
                            <Upload
                                name="avatar"
                                accept="image/*"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                onChange={this.handleChange}
                            >
                                {imageUrl? <img width="100%" src={imageUrl.indexOf('base64') !== -1 ?imageUrl:URL+'/'+imageUrl} alt="avatar" /> : uploadButton}
                            </Upload>
                            <Button style={{marginLeft: '20px'}} onClick={() => {this.setState({curImg: imageUrl.indexOf('base64') !== -1 ?imageUrl: URL+'/' +imageUrl, previewVisible: true})}}>图片预览</Button>
                        </div>
                        <Modal visible={this.state.previewVisible} footer={null} onCancel={() => {this.setState({previewVisible: false})}}>
                            <img alt="example" style={{ width: '100%' }} src={this.state.curImg} />
                        </Modal>
                    </FormItem>
                    <Row>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label="专家中文姓名">
                                <Input placeholder="请输入中文姓名" maxLength={10} value={this.state.params.expertNameZH} name="expertNameZH" onChange={this.setFromData} />
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label="中文职位">
                                <Input placeholder="请输入中文职位" maxLength={15} value={this.state.params.expertPositionZH} name="expertPositionZH" onChange={this.setFromData} />
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label="中文职称">
                                <Input placeholder="请输入中文职称" maxLength={15} value={this.state.params.expertJobTitleZH} name="expertJobTitleZH" onChange={this.setFromData} />
                            </FormItem>
                        </Col>
                    </Row>

                    {/* 英文信息 */}
                    <Row>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label="专家英文姓名">
                                <Input placeholder="请输入英文姓名" maxLength={18} value={this.state.params.expertNameUS} name="expertNameUS" onChange={this.setFromData} />
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label="英文职位">
                                <Input placeholder="请输入英文职位" maxLength={26} value={this.state.params.expertPositionUS} name="expertPositionUS" onInput={this.setFromData} />
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label="英文职称">
                                <Input placeholder="请输入英文职称" maxLength={26} value={this.state.params.expertJobTitleUS} name="expertJobTitleUS" onInput={this.setFromData} />
                            </FormItem>
                        </Col>
                    </Row>
                    {/* 科室  级别*/}
                    <Row>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label="科室">
                                <Select
                                    mode="multiple"
                                    style={{ width: '100%' }}
                                    placeholder="请选择科室"
                                    value={this.state.defaultDepartment}
                                    name="departmentIds"
                                    onChange={this.setdepartmentIds}
                                    optionFilterProp={'children'}
                                    getPopupContainer={triggerNode => triggerNode.parentNode}
                                >
                                   {this.state.option}
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label="排序号">
                                <Input placeholder="请输入排序号" maxLength={18} value={this.state.params.seq} name="seq" onChange={this.setFromData} />
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label="级别">
                                <Select defaultValue="jack" getPopupContainer={triggerNode => triggerNode.parentNode} style={{ width: 120 }} value={this.state.params.levelText}  onChange={this.setlevelText}>
                                    <Option value="SENIOR">正高</Option>
                                    <Option value="SUB_SENIOR">副高</Option>
                                    <Option value="MIDDLE">中级</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>

                    {/* 咨询链接 诊时 */}
                    <Row>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label="咨询链接">
                                <Input placeholder="请输入咨询链接" maxLength={100} value={this.state.params.consultLinkUrl} name="consultLinkUrl" onInput={this.setFromData} />
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label="中文诊时">
                                <Input placeholder="请输入中文诊时" maxLength={30} value={this.state.params.consultTimeZH} name="consultTimeZH" onInput={this.setFromData} />
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label="英文诊时">
                                <Input placeholder="请输入英文诊时" maxLength={56} value={this.state.params.consultTimeUS} name="consultTimeUS" onInput={this.setFromData} />
                            </FormItem>
                        </Col>
                    </Row>
                    {
                        this.state.params.publishTime ?
                        <FormItem {...formItemLayout} label="发布时间">
                        <DatePicker defaultValue={''} placeholder={this.state.params.publishTime ? this.formatTime(this.state.params.publishTime) :"请选择日期"} format={'YYYY/MM/DD'} onChange={this.setTime}/>
                        </FormItem>
                        : null
                    }


                    {/* 富文本编辑框区 */}
                    <div className="updateHospitalTraining-main">
                        {/* <p>正文 :</p> */}
                        <div className="content">
                            <div id="contentE"></div>
                            {contentC}
                            {contentE}
                            <div id="resume"></div>
                            {resumeZH}
                            {resumeUS}
                            <div id="academic"></div>
                            {academicZH}
                            {academicUS}
                            <div id="research"></div>
                            {researchZH}
                            {researchUS}
                            <div id="honor"></div>
                            {honorZH}
                            {honorUS}
                            <div id="medicalSpecialty"></div>
                            {medicalSpecialtyZH}
                            {medicalSpecialtyUS}
                        </div>
                    </div>
               </section>
    }
}