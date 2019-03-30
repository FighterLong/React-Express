/*
    测试编辑器
*/
import React, {Component} from 'react'
import { message } from 'antd';
// import {URL} from '@/common/js/url.js'
// var Editor = require('wangeditor')// 使用 npm 安装
class Editor extends Component {
  state = {
    editorID: new Date().getTime(),
    // editor: null,
    oneLoad: false,
    ue: '',
    initialContent: '',
    // menus: [
    //     'head',  // 标题
    //     'bold',  // 粗体
    //     'fontSize',  // 字号
    //     'fontName',  // 字体
    //     'italic',  // 斜体
    //     'underline',  // 下划线
    //     'strikeThrough',  // 删除线
    //     'foreColor',  // 文字颜色
    //     'backColor',  // 背景颜色
    //     'link',  // 插入链接
    //     // 'list',  // 列表
    //     'justify',  // 对齐方式
    //     // 'quote',  // 引用
    //     // 'emoticon',  // 表情
    //     'image',  // 插入图片
    //     // 'table',  // 表格
    //     // 'video',  // 插入视频
    //     // 'code',  // 插入代码
    //     'undo',  // 撤销
    //     'redo'  // 重复
    // ]
    // editorID: 1
  }
  contentChange (html) {
    // console.log(html)
  }
  componentWillUnmount() {
    // 组件卸载后，清除放入库的id
    try {
        // window.UE.delEditor('editor' + (this.props.contentId || this.state.editorID));
    } catch (error) {
        // console.error('编辑器渲染失败！！！')
    }
  }
  componentWillReceiveProps (newProps) {
      this.setState({initialContent: this.props.initialContent})
    // console.log(this.props.initialContent)
    //   if (newProps.initialContent &&  this.state.ue && this.state.ue.getContent()) {
    //     this.state.ue.setContent(newProps.initialContent);
    //   }
    // try {
    //     window.UE.delEditor('editor' + (this.props.contentId || this.state.editorID));
    // } catch (error) {
    //     message.error('编辑器渲染失败,请尝试刷新')
    // }
    // var ue = window.UE.getEditor('editor' + (this.props.contentId || this.state.editorID), {
    //     initialFrameWidth: null,
    //     initialContent: this.props.initialContent,
    //     // autoHeightEnabled : true,
    //     autoFloatEnabled: false,
    //     callbacks: {
    //         uploadCompleteCallback: function(data){
    //             console.log('上传成功的回掉')
    //         },
    //         uploadErrorCallback: function(data){
    //             console.log('上传失败的回掉')
    //         }
    //     }
    //     // imagePopup: false
    //     // height: 500
    // });
    // this.setState({ue}, () => {
    //     this.state.ue.addListener("ready", () => {
    //         this.state.ue.setContent(this.props.initialContent);
    //     });
    //     this.state.ue.addListener('contentChange', () => {
    //         this.props.editorOnChange(this.state.ue.getContent())
    //     })
    // })


    // console.log('*****************编辑器的componentWillReceiveProps*************************')
    // console.log(newProps)
    // if(newProps.initialContent && this.state.ue && this.state.ue.getContent() === ''){
    //     console.log('触发了')
    // }
  }
  componentDidMount () {
        // console.log('加载了编辑器')
    // var key = setTimeout(() => {
        try {
            window.UE.delEditor('editor' + (this.props.contentId || this.state.editorID));
        } catch (error) {
            console.error('编辑器渲染失败！！！')
        }
        var ue = window.UE.getEditor('editor' + (this.props.contentId || this.state.editorID), {
            initialFrameWidth: null,
            initialContent: this.state.initialContent,
            autoHeightEnabled : false,
            autoFloatEnabled: false,
            imagePopup: false,
            imageScaleEnabled: false
            // height: 500
        });
        this.setState({ue}, () => {
            this.state.ue.addListener("ready", () => {
                // console.log('ready触发' + this.props.initialContent)
                this.state.ue.setContent(this.props.initialContent);
                // this.state.ue.addListener('contentChange', () => {
                //     this.props.editorOnChange(this.state.ue.getContent())
                // })
            });
            this.state.ue.addListener('contentChange', () => {
                // console.log('contentChange触发' + this.props.initialContent)
                this.props.editorOnChange(this.state.ue.getContent())
            })
        })
    // }, 500)
  }

//   // 获取内容
//   getContent = () => {
//       return this.state.ue.getContent()
//   }

  render () {
    if (this.state.ue && this.props.initialContent && !this.state.oneLoad) {
        // this.state.editor.txt.html(this.props.initialContent || '')
        // this.state.ue.setContent(this.props.initialContent);
        try {
            this.state.ue.setContent(this.props.initialContent);
            this.setState({oneLoad: true})
        } catch (error) {
            this.state.ue.addListener("ready", () => {
                this.state.ue.setContent(this.props.initialContent);
                this.setState({oneLoad: true})
            });
        }
        // console.error('进来了')
        // this.state.ue.addListener("ready", () => {
        //     this.state.ue.setContent(this.props.initialContent);
        //     this.setState({oneLoad: true})
        // });
    }
    return (
        <div style={{marginBottom: '5px', zIndex: 1,height: 'auto',overflow: 'hidden'}}>
            <script id={"editor" + (this.props.contentId || this.state.editorID)} style={{height: '600px',position: 'relative'}} name="content" type="text/plain">
            </script>
        </div>
    )
  }
}
export default Editor