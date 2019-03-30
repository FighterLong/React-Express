import React, {Component} from 'react'
import {Radio, Button, Input} from 'antd'

const RadioGroup = Radio.Group

export default class DetailModel extends Component {

  state = {
    // 子网站模板
    link: '',
    modelValue: 'TEMPLATE'
  }


  componentWillReceiveProps(next) {
    // console.log(this.props.link)
    // this.props.type&&this.setState({ modelValue: this.props.type})
    if (this.state.link !== next.link) {
      let link = next.link
      this.setState({ link })
    }
  }
  // componentWillUpdate() {
  //   this.props.type&&this.setState({ modelValue: this.props.type})
  // }
  // 子网站
  modelChange = (e) => {
    // console.log(e.target.value)
    this.setState({modelValue: e.target.value})
    this.props.changeType(e.target.value)
  }

  inputLink = (e) => {
    // console.log(e.target.value)
    this.props.changeLink(e.target.value)
    this.setState({link: e.target.value})
  }

  render () {
    // 
    const radioStyle = {
      display: 'block',
      height: '40px',
      lineHeight: '40px'
    }

    return (
      <RadioGroup onChange={this.modelChange} value={this.props.type}>
        <Radio style={radioStyle} value="TEMPLATE">
          <span>套用子网站模板</span>
          {this.props.type === 'TEMPLATE' ? <Button type="primary" style={{marginLeft: '100px'}} onClick={this.props.to}>科室子网站编辑</Button> : null}
        </Radio>
        <Radio style={radioStyle} value="OUT_URL">
          <span>跳转专用外部链接</span>
          {this.props.type === 'OUT_URL' ? <Input style={{marginLeft: '100px'}} placeholder="请输入链接" value={this.state.link} onInput={this.inputLink} /> : null}
        </Radio>
        <Radio style={radioStyle} value="CONTENT">只显示详情内容</Radio>
      </RadioGroup>
    )
  }
}