
import React, { Component } from 'react';
// import { Input, Button, Col, Row, Radio, Divider, Table, Modal } from 'antd';
import {Button,Select} from 'antd';
// import InputTitle from '@/component/input-title/input-title.js'
import api from '@/api'

import './hospital-training.styl'

/*
    MapLabel===>键值对组件： data: {                或：[{title: lebel,
                                    title: lebel,       value: value,
                                    value: value,       }}]
                                    key: 唯一值
                                  }
                                   
*/
import MapLabel from './depend/label.js'
import axios from 'axios'
import { timeFillter } from '../../common/js/public';
import {URL} from '@/common/js/url.js'

const Option = Select.Option;

// const URL = 'http://192.168.0.122:7979'


export default class HospitalTraining extends Component {
    constructor(props) {
        super();
        this.state = {
            language: 'Chinese',
            navbarId: '',
            params: {
                titleZH: '',
                titleUS: '',
                contentZH: '',
                contentUS: '',
                createTime: '',
                publishTime: '',
                creator: ''
            }
        }
        this.goUpdate = this.goUpdate.bind(this);
        this.changeLanguage = this.changeLanguage.bind(this);
    }

    componentWillReceiveProps(next) {
        this.setState({name:sessionStorage.getItem('key')})
        this.setState({navbarId: next.match.params.id},()=>{
            this.getData()
        })
    }
    componentDidMount(){
        this.setState({name:sessionStorage.getItem('key')})
        this.setState({navbarId: this.props.match.params.id},()=>{
            this.getData()
        })
    }
    goUpdate() {
        // this.props.history.push({pathname:`/HospitalTraining/update/${this.props.match.params.id}`,query:{language:this.state.language}})
        this.props.history.push(`/HospitalTrainingUpdate/${this.props.match.params.id}`)
        // SpecialWebsites
    }

    changeLanguage(val) {
        this.setState({
            language: val
        })
    }

    // 获取数据
    getData = () => {
        axios.post(`${URL}/admin/hospitalSituation/retrieveOne?navbarId=${this.state.navbarId}`).then(res => {
            console.log(res.data.data)
            if( res.data.code === 200) this.setState({params: {...res.data.data}},()=>{
                document.querySelector('.zh').innerHTML = this.state.params.contentZH
                document.querySelector('.us').innerHTML = this.state.params.contentUS
            })
        })
    }

    render() {
        let data =[{
            title: '中文标题',
            value: this.state.params.titleZH
        },{
            title: '中文副标题',
            value: this.state.params.subheadingZH
        },{
            title: '英文标题',
            value: this.state.params.titleUS
        },{
            title: '英文副标题',
            value: this.state.params.subheadingUS
        },{
            title: '发布时间',
            value: timeFillter(this.state.params.publishTime)
        }] 
        // ,{
        //     title: '作者',
        //     value: this.state.params.creator
        // },{
        //     title: '创建时间',
        //     value: timeFillter(this.state.params.createTime)
        // }
        // let temp = [];
        // data.forEach((item,index)=>{
        //     temp.push(<MapLabel title={item.title} value={item.value} key={index} />)
        // })
        return <section className="hospital-training">
                    <p style={{fontWeight: 'bold',fontSize: '18px'}}>医院概况/{this.state.name}</p>
                    <div className="hospital-training-top">
                        {/* <Select defaultValue={this.state.language} style={{ width: 120, marginRight: '20px' }} onChange={this.changeLanguage}>
                            <Option value="Chinese">中文</Option>
                            <Option value="English">English</Option>
                        </Select> */}
                        <Button style={{backgroundColor: '#f5f5f5'}} onClick={this.goUpdate}>编辑</Button>
                        {/* <Button type="primary">发布</Button> */}
                    </div>
                    <div className="hospital-training-content">
                        <div className="hospital-training-box">
                        <MapLabel data={data} />
                        </div>
                        <div className="hospital-training-main">
                            <p>正文 :</p>
                            <div className="content">
                                <div className="box">
                                    <h1 className="box-title">中文内容</h1>
                                    <div className="box-content zh">
                                        {this.state.params.contentZH}
                                    </div>
                                </div>
                                <div className="box">
                                    <h1 className="box-title">英文内容</h1>
                                    <div className="box-content us">
                                        {this.state.params.contentUS}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <MapLabel data={{
                            title: '视频',
                            value: this.state.params.accessoryList&&this.state.params.accessoryList.length ? this.state.params.accessoryList[0].showName:'无' ,
                            key: 0
                        }} />
                    </div>
               </section>
    }
}