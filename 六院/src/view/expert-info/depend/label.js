// import React, { Component } from 'react';
// import './label.styl'

// export default class MapLabel extends Component {
//     render() {
//         return <label className="mapLabel" style={this.props.style}>
//                     <div className="mapLabel-title">{this.props.title} :</div>
//                     <div className="mapLabel-value">{this.props.value}</div>
//                </label>
//     }
// }
import React from 'react';
import { Form, Row, Col, Input, Button, Icon } from 'antd';
const FormItem = Form.Item;

export default class MapLabel extends React.Component {

  render() {
    const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
    };
    let element = []
    // console.log(this.props.data.forEach())
    if(this.props.data instanceof Array){
        this.props.data.forEach((item,index) => {
            element.push( /* 通过时间戳加上特殊字符区分唯一键 */
                <FormItem  style={{width: '33%',float: 'left',textAlign: 'left'}} {...formItemLayout} label={item.title} key={new Date().getTime()+'_'+index}>
                    {item.value}
                </FormItem>)
        })
    }else {
        element.push(
            <FormItem {...formItemLayout} label={this.props.data.title} key={new Date().getTime()}>
                {this.props.data.value}
            </FormItem>)
    }
    return (
        <Form layout="horizontal">
           {element}
        </Form>
    );
  }
}