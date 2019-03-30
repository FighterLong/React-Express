// 普通用户管理
import React,{Component} from 'react'
// import axios from 'axios'
import {Button} from 'antd'
import './authority-management.styl'
import {URL} from '@/common/js/url.js'
import axios from 'axios'
import {timeFillter} from '../../common/js/public.js'
// const Search = Input.SearCh
// const URL = 'http://192.168.0.122:7979'



class Message extends Component {
  state={
  }

  componentDidMount(){
      this.queryContent()
  }

  /************************ 数据操作区 start **************************/
 
  // 查看内容
  queryContent = () => {
    axios.get(`${URL}/admin/logManagement/operationLog/retrieveOne?id=${this.props.match.params.id}`).then(res => {
      if(res.data.code === 200) {
        this.setState({content: res.data.data.content})
      }
    })
  }
  /************************ 数据操作区 end   **************************/
  render(){
    return(
        <section className="authorityUser">
            <div style={{textAlign: 'right'}}>
                 <Button onClick={() => {this.props.history.goBack()}}>返回</Button>
            </div>
            <div style={{marginTop: '20px'}} dangerouslySetInnerHTML={{ __html: this.state.content }}></div>
        </section>
    )
  }
}
export default Message
