/*
 * @Author: kaiback__zgt_1430666237@qq.com 
 * @Date: 2018-06-26 14:17:23 
 * @Last Modified by: kaiback__zgt_1430666237@qq.com
 * @Last Modified time: 2018-06-27 10:34:21
 */

/**
 * 编辑器具体配置见：https://github.com/margox/braft-editor
 * ['media', 'link]工具默认不显示，需要自己根据props传参过来
 * 
 */

import React, {Component} from 'react'
import PropTypes from 'prop-types'
// import axios from 'axios'
// import {URL} from '@/common/js/url.js'

class Editortest extends Component {
  componentDidMount() {
    var ue = window.UE.getEditor('container');
    //对编辑器的操作最好在编辑器ready之后再做
    ue.ready(function() {
        //设置编辑器的内容
        ue.setContent('hello');
        //获取html内容，返回: <p>hello</p>
        var html = ue.getContent();
        //获取纯文本内容，返回: hello
        var txt = ue.getContentTxt();
    });
    ue.addListener('contentChange', function(){
      console.log(ue.getContent())
    })
  }
  render () {
    return (
      <div style={{border: '1px solid rgb(228, 224, 224)'}}>
      asdasd
        <script id="container" name="content" type="text/plain">
        </script>
      </div>
    )
  }
}


Editortest.propTypes = {
  //工具栏 media---上传图片、链接、视频、音频；link----链接
  controls: PropTypes.array,
  // 在工具栏添加了media后，对是否允许上传视频进行配置（这两个默认不允许）,配置这两个后要配置相应的upload函数
  video: PropTypes.bool,
  audio: PropTypes.bool,
  // 是否允许外链功能--不建议，默认没有
  externalMedias: PropTypes.object,
  // 编辑器的高度
  height: PropTypes.number,
  // 编辑器初始值
  initialContent: PropTypes.object,
  // 编辑器内容发生变化时的回调,通过回调获取编辑器的值
  editorOnChange: PropTypes.func.isRequired,
  // placeholder
  placeholder: PropTypes.string
}

Editortest.defaultProps = {
  controls: [],
  video: true,
  audio: true,
  // 是否显示多媒体外链功能，默认不允许
  externalMedias: {
    // 上传图片
    image: false,
    // 上传音频
    audio: false,
    // 上传视频
    video: false,
    // 外链
    embed: false
  },
  height: 600,
  initialContent: '<p></p>',
  placeholder: '请编辑内容'
}

export default Editortest