import React, {Component} from 'react'
import Cropper from 'react-cropper'

import 'cropperjs/dist/cropper.css';

export default class CropBox extends Component {
  // componentWillReceiveProps () {
  //   let cropper = new Cropper()
  //   cropper.reset()
  //   console.log(cropper.reset)
  // }
  // dataURItoBlob (base64Data) {
  //   var byteString;
  //   if (base64Data.split(',')[0].indexOf('base64') >= 0)
  //       byteString = atob(base64Data.split(',')[1]);
  //   else
  //       byteString = unescape(base64Data.split(',')[1]);
  //   var mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
  //   var ia = new Uint8Array(byteString.length);
  //   for (var i = 0; i < byteString.length; i++) {
  //       ia[i] = byteString.charCodeAt(i);
  //   }
  //   return new Blob([ia], {type: mimeString});
  // }
  dataURLtoFile(dataurl, filename) {//将base64转换为文件
    // console.log(dataurl)
    // var arr = dataurl?dataurl.split(','):'', mime = arr[0].match(/:(.*?);/)[1],
    // bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    // while(n--){
    //     u8arr[n] = bstr.charCodeAt(n);
    // }
    // return new File([u8arr], filename, {type:mime});
    var bytes=window.atob(dataurl.split(',')[1]);        //去掉url的头，并转换为byte  

    //处理异常,将ascii码小于0的转换为大于0  
    var ab = new ArrayBuffer(bytes.length);  
    var ia = new Uint8Array(ab);  
    for (var i = 0; i < bytes.length; i++) {  
        ia[i] = bytes.charCodeAt(i);  
    }  

    return new File( [ab], filename , {type : 'image/jpg'});  
  }
  _crop(){
    let formData = new FormData()
    let blob = this.dataURLtoFile(this.refs.cropper.getCroppedCanvas().toDataURL(), this.props.fileName);
    // formData.append("fileName", "1.jpg")
    formData.append("file", blob)
    this.props.cutting(formData,this.refs.cropper.getCroppedCanvas().toDataURL())
  }

  render () {
    // Cropper.reset()
    // data.reset()
    return (
      <Cropper
        ref='cropper'
        src={this.props.uploadFile}
        style={{height: '400px', width: '652px'}}
        // Cropper.js options
        aspectRatio={this.props.aspectRatio}
        guides={false}
        crop={this._crop.bind(this)} />
    )
  }
}