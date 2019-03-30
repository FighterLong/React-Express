import React, {Component} from 'react'
import './index.styl'

export default class Title extends Component {

  render () {
    return (
      <h3 className="title-component-style">{this.props.title}</h3>
    )
  }
}