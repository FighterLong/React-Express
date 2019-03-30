import React, { Component } from 'react';
import { Prompt } from 'react-router-dom';

export default class Exit extends Component{
  render(){
    return(
      <Prompt message={this.props.message} />
    )
  }
}
