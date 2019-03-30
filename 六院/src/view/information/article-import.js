import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Modal, Button} from 'antd'

class ArticleImport extends Component {

  render () {
    const { modalVisible, modalLoading, modalTitle, modalSubmit, modalHide } = this.props;
    return (
      <Modal
        visible={modalVisible}
        title={modalTitle}
        width='68%'
        onOk={modalSubmit}
        onCancel={modalHide}
        footer={[
          <Button key="back" onClick={modalHide}>取消</Button>,
          <Button key="submit" type="primary" loading={modalLoading} onClick={modalSubmit}>
            确定
          </Button>
        ]}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    );
  }
}

ArticleImport.propTypes = {
  modalVisible: PropTypes.bool.isRequired,
  modalLoading: PropTypes.bool.isRequired,
  modalTitle: PropTypes.string,
  modalHide: PropTypes.func,
  modalSubmit: PropTypes.func
}


export default ArticleImport