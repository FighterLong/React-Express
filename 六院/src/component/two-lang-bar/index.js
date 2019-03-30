import React, {Component} from 'react'
import { Divider, Button, Popconfirm, Radio } from 'antd'
import PropTypes from 'prop-types'
import Title from '@/component/title'

class KeyDepartBrief extends Component {

  state = {
    // 编辑的语言
    lang: 'CH',
    // popconfig是否可见
    visible: false,
    // 提交中
    submitting: false
  }

  saveEditor = (lang = this.state.lang) => {
    this.setState({submitting: true})
    this.setState({visible: false})
    // axios请求
    setTimeout(() => {
      this.setState({submitting: false})
    }, 1000)
  }

  visibleChange = (visible) => {
    if (this.props.condition) {
      this.setState({visible: true})
    } else {
      this.saveEditor()
    }
  }

  langChange = (e) => {
    this.setState({lang: e.target.value})
  }

  render () {

    return (
      <div className="department">
        <Title title="编辑内容" />
        {
          this.props.condition
          ?
          null
          :
          <Radio.Group onChange={this.langChange} size='small' defaultValue={this.state.lang} style={{marginLeft: '25px'}}>
            <Radio.Button value="CH">中文</Radio.Button>
            <Radio.Button value="EN">English</Radio.Button>
          </Radio.Group>
        }
        <span style={{float: 'right'}}>
          <Popconfirm
            title="请选择您发布的:"
            placement='bottom'
            visible={this.state.visible}
            onVisibleChange={this.visibleChange}
            onConfirm={() => this.saveEditor('CH')}
            onCancel={() => this.saveEditor('EN')}
            okText="中文"
            cancelText="英文">
            <Button style={{marginLeft: '15px'}} type="primary" loading={this.state.submitting} >保存</Button>
          </Popconfirm>
          <Button style={{marginLeft: '15px'}} type="primary" onClick={() => {this.props.history.goBack()}}>返回</Button>
        </span>
        <Divider />
      </div>
    )
  }
}

KeyDepartBrief.propTypes = {
  // 编辑&&添加
  condition: PropTypes.bool,
  // 当前语言--添加状态不传
  lang: PropTypes.string,
  // 更新语言
  updataLang: PropTypes.func,
  // 提交中
  submitting: PropTypes.bool
}

KeyDepartBrief.propTypes 

export default KeyDepartBrief