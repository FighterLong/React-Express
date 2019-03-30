import React, {Component} from 'react'
import './tools.styl'
class Tools extends Component {
  goView (name) {
    console.log('触发')
    let el  = document.querySelector(name)
    if (el) {
      el.scrollIntoView({
        behavior: 'smooth',
        block: "start"
      })
    }
  }
  render() {
    return (
      <div>
      {/* <div className="toolbox"> */}
        {/* <div className="toolItem">跳转至</div> */}
        {/* <div className="toolItem cover" onClick={() => {this.goView('#messsage')}}>基础信息</div>
        
        {
          window.location.href.indexOf('expertInfoUpdate') === -1 ?
          <div>
            <div className="toolItem cover" onClick={() => {this.goView('#contentZH')}}>中文内容</div>
            <div className="toolItem cover" onClick={() => {this.goView('#contentUS')}}>英文内容</div>
          </div> : null
        }
        {
          window.location.href.indexOf('expertInfoUpdate') !== -1 ?
          <div>
            <div className="toolItem cover" onClick={() => {this.goView('#contentE')}}>详细介绍</div>
            <div className="toolItem cover" onClick={() => {this.goView('#resume')}}>个人简历</div>
            <div className="toolItem cover" onClick={() => {this.goView('#academic')}}>学术任职</div>
            <div className="toolItem cover" onClick={() => {this.goView('#research')}}>科研教学</div>
            <div className="toolItem cover" onClick={() => {this.goView('#honor')}}>荣誉奖项</div>
            <div className="toolItem cover" onClick={() => {this.goView('#medicalSpecialty')}}>医疗专长</div>
          </div> : null
        }
        
        {
          window.location.href.indexOf('expertInfoUpdate') === -1 ?
          <div>
            <div className="toolItem cover" onClick={() => {this.goView('#bottom')}}>附属信息</div>
          </div> : null
        } */}
      </div>
    )
  }
}

// Form.create()()
export default Tools