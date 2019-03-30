import React, { Component } from 'react';
import './input-title.styl'

class InputTitle extends Component {

  render() {
    return (
      <div className="input-title">{this.props.title}</div>
    );
  }
}

export default InputTitle;
