import React,{ Component } from 'react';
import { Input, Button, Table, Select, Form, message, Row, Col, Spin} from 'antd'
import axios from 'axios'
import {URL} from '@/common/js/url.js'
import {timeFillter} from '../../common/js/public.js'
const FormItem = Form.Item;
const TextArea = Input
const Option = Select.Option

class leaveMessageEditor extends Component {
    state = {
        id: '',
        cutOut: false,
        recommendExpert: [{}],//推荐专家
        allExpert: [{id: 0,name: '仙掌人'},{id: 1,name: '仙掌人222'}],// 所有专家
        recommendExpertSearch: false,// 用于搜索专家时节流
        recommendDepartment: [{}],// 推荐科室
        allDepartment: [{id: 0,name: '主角光环'}],
        recommendDepartmentSearch: false,// 用于搜索科室时节流
        params: {}
    }

    componentDidMount(){
        if(this.props.match.params.id){
            this.setState({id:this.props.match.params.id},()=>{this.getInfo();this.getAllDepartment();this.getAllExpert()})
        }
    }

    /************************ 数据操作区 start *********************/
    // 获取留言信息
    getInfo = () => {
        axios.get(`${URL}/admin/leaveAMessage/retrieveOne?id=${this.state.id}`).then(res => {
            if(res.data.code === 200){
                this.setState({
                    params: res.data.data,
                    recommendExpert: Object.assign(this.state.recommendExpert,res.data.data.expertList),
                    recommendDepartment: Object.assign(this.state.recommendDepartment,res.data.data.departmentList),
                })
            }
        })
    }
    // 回复留言
    save = () => {
        let departmentIds = this.state.recommendDepartment.map(item => {
            return item.id
        })
        let expertIds = this.state.recommendExpert.map(item => {
            return item.id
        })
        this.setState({cutOut: true,params: {...this.state.params,departmentIds: `[${departmentIds.toString()}]`,expertIds: `[${expertIds.toString()}]`}},() => {
            axios.post(`${URL}/admin/leaveAMessage/replyLeaveAMessage`,this.state.params).then(res => {
                res.data.code === 200 ? message.success('回复成功！') : message.error(res.data.msg)
                this.setState({cutOut: false})
            }).catch(err => {
                this.setState({cutOut: false})
            })
        })
    }
    // 获取所有科室
    getAllDepartment = () => {
        axios.get(`${URL}/admin/leaveAMessage/departmentReminder`).then(res => {
            let arr = res.data.data ? res.data.data : []
            this.setState({allDepartment: arr})
        })
    }
    // 获取所有专家
    getAllExpert = (keyword) => {
        keyword = keyword ? keyword : ''
        axios.get(`${URL}/admin/leaveAMessage/expertReminder?name=${keyword}&type=PUBLISH`).then(res => {
            let arr = res.data.data ? res.data.data : []
            this.setState({allExpert: arr})
        }) 
    }
    /************************ 数据操作区 end *********************/
    /************************ 其他操作 start ********************/
    // 回复留言输入  双向绑定
    setReplyValue = (e) => {
        this.setState({params: {...this.state.params,replyContent: e.target.value}})
    }
    // 添加推荐专家
    addRecommendExpert = () => {
        let arr = this.state.recommendExpert;
        console.log(arr)
        arr.push({name: '',id: ''})
        this.setState({recommendExpert: arr})
    }
    // 添加推荐科室
    addRecommendDepartment = () => {
        let arr = this.state.recommendDepartment;
        arr.push({id: ''})
        console.log(arr)
        this.setState({recommendDepartment: arr})
    }
    // 删除推荐专家
    delRecommendExpert = (index) => {
        if(this.state.recommendExpert.length === 1){
            message.error('至少保留一个推荐专家（非必填项）')
            return
        }
        let arr = this.state.recommendExpert;
        arr.splice(index,1)
        this.setState({recommendExpert: arr})
    }
    // 删除推荐科室
    delRecommendDepartment = (index) => {
        if(this.state.recommendDepartment.length === 1){
            message.error('至少保留一个推荐专家（非必填项）')
            return
        }
        let arr = this.state.recommendDepartment;
        arr.splice(index,1)
        this.setState({recommendDepartment: arr})
    }
    // 推荐专家onChange时 返回key值
    setExpert = (value,list,index) => {
        // console.log(list)
        let arr = this.state.recommendExpert;
        arr[index].id = value
        this.setState({recommendExpert: arr},()=>{console.log(this.state.recommendExpert[index].id)})
    }
    // 推荐科室onChange时 返回key值
    setDepartment = (value,list,index) => {
        let arr = this.state.recommendDepartment;
        arr[index].id = value
        this.setState({recommendDepartment: arr},()=>{console.log(this.state.recommendDepartment[index].id)})
        // this.setState({recommendDepartment: value})
    }
    // 返回
    goBack() {
        window.history.back(-1)
    }
    /************************ 其他操作 end *********************/
    render() {
        const formItemLayout = {
          labelCol: { span: 6 },
          wrapperCol: { span: 18 },
        }
        let tempExpert = []// 用于渲染推荐专家
        let tempDepartment = []// 用于渲染推荐专家
        return <section>
                    <div style={{marginBottom: '20px'}}>
                        <h1 style={{fontSize: '16px', fontWeight: '700'}}>留言详情
                        <span style={{float: 'right'}}>
                            <Button style={{marginLeft: '15px'}} onClick={this.goBack}>返回</Button>
                            <Button style={{marginLeft: '15px'}} type="primary" loading={this.state.cutOut} onClick={this.save}>回复</Button>
                        </span>
                        </h1>
                    </div>
                    <Form>
                        <Row>
                            <Col span={8}>
                                <FormItem {...formItemLayout} label="留言人">{this.state.params.questioner}</FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...formItemLayout} label="性别">{this.state.params.questionerSex}</FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...formItemLayout} label="留言时间">{this.state.params.leaveTime?timeFillter(this.state.params.leaveTime,true):''}</FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem {...formItemLayout} label="点击数">{this.state.params.hits}</FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...formItemLayout}  label="主题">{this.state.params.subject}</FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={2}>
                                <FormItem label="留言内容" style={{textAlign: 'right'}}></FormItem>
                            </Col>
                            <Col span={18}>
                                <FormItem>{this.state.params.content}</FormItem>
                                
                            </Col>
                            
                            {/* <Col span={18}></Col> */}
                        </Row>
                    </Form>
                    <h1 style={{fontSize: '16px', fontWeight: '700', marginTop: '50px'}}>回复留言</h1>
                    <Form>
                        <Row>
                            <Col span={2}>
                                <FormItem label="回复内容：" style={{textAlign: 'right'}}></FormItem>
                            </Col>
                            <Col span={18}>
                              <FormItem>
                                <textarea maxLength={200} style={{width: '100%',minHeight: '150px',padding: '0 5px'}} onChange={this.setReplyValue} value={this.state.params.replyContent?this.state.params.replyContent:''}></textarea>
                              </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem {...formItemLayout} label="回复时间：">{this.state.params.replyTime?timeFillter(this.state.params.replyTime,true):''}</FormItem>
                            </Col>
                            <Col span={14}></Col>
                        </Row>
                    </Form>
                    <h1 style={{fontSize: '16px', fontWeight: '700', marginTop: '50px'}}>推荐专家</h1>
                    <Form>
                            { this.state.recommendExpert.forEach((item,index)=>{
                                    tempExpert.push(<Row key={index+'z'}>
                                    <Col span={6}>
                                        <FormItem label="姓名" {...formItemLayout}>
                                            <Select
                                                showSearch
                                                // key={item.id}
                                                // labelInValue
                                                value={typeof item.id === 'number'?item.name: item.id}
                                                placeholder="搜素专家"
                                                notFoundContent={this.state.recommendExpertSearch ? <Spin size="small" /> : null}
                                                filterOption={false}
                                                onSearch={this.getAllExpert}
                                                onChange={(e,list)=>{this.setExpert(e,list,index)}}
                                                style={{ width: '100%' }}
                                                getPopupContainer={triggerNode => triggerNode.parentNode}
                                            >
                                                {this.state.allExpert.map(d => <Option key={d.id}>{d.name}</Option>)}
                                            </Select>
                                        </FormItem>
                                    </Col>
                                    <Col span={2} style={{textAlign: 'left',marginLeft: '20px'}}>
                                        <p style={{color: '#f00',cursor: 'pointer',marginTop: '8px'}} onClick={()=>{this.delRecommendExpert(index)}}>删除</p>
                                    </Col>
                                </Row>)
                                })
                            }
                            {tempExpert}
                        <Button type="primary" style={{marginLeft: '20px'}} onClick={this.addRecommendExpert}>添加专家</Button>
                    </Form>
                    <h1 style={{fontSize: '16px', fontWeight: '700', marginTop: '50px'}}>推荐科室</h1>
                    <Form>
                        {
                            this.state.recommendDepartment.forEach((item,index) => {
                                tempDepartment.push(
                                <Row key={index+'d'}>
                                    <Col span={6}>
                                        <FormItem label="科室" {...formItemLayout}>
                                            <Select
                                                // mode="multiple"
                                                // labelInValue
                                                showSearch
                                                // defaultValue = {[]}
                                                value={typeof item.id === 'number'?item.name: item.id}
                                                // value={typeof item.id === Number?item.name: item.id}
                                                placeholder="搜素科室"
                                                notFoundContent={this.state.recommendDepartmentSearch ? <Spin size="small" /> : null}
                                                filterOption={false}
                                                // onSearch={this.getAllDepartment}
                                                onChange={(e,list)=>{this.setDepartment(e,list,index)}}
                                                style={{ width: '100%' }}
                                                getPopupContainer={triggerNode => triggerNode.parentNode}
                                            >
                                                {this.state.allDepartment.map(d => <Option key={d.id}>{d.name}</Option>)}
                                                {/* // 搜索时触发的回调 // 改变是触发的回调 <Option key={d.id}>{d.name}</Option>*/}
                                            </Select>
                                        </FormItem>
                                    </Col>
                                    <Col span={2} style={{textAlign: 'left',marginLeft: '20px'}}>
                                        <p style={{color: '#f00',cursor: 'pointer',marginTop: '8px'}} onClick={() => {this.delRecommendDepartment(index)}}>删除</p>
                                    </Col>
                                </Row>)
                            })
                        }{tempDepartment}
                        <Button type="primary" style={{textAlign: 'left',marginLeft: '20px'}} onClick={this.addRecommendDepartment}>添加科室</Button>
                    </Form>
                </section>
    }
}
export default leaveMessageEditor