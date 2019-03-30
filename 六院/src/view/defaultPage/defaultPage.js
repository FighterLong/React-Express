import React, { Component } from 'react'
import defaultLogo from '@/common/imgs/defaultLogo.png'
import './defaultPage.styl'
export default class defaultPage extends Component{
  render () {
    return <section className="container">
        <img src={defaultLogo} alt="logo"/>
        <p>Copyright  &copy;2018 中山大学附属第六医院（广东省胃肠肛门医院） 版权所有 粤ICP备10008071号-1</p>
    </section>
  }
}