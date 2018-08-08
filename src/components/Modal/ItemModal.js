import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Modal } from 'antd';

const FormItem = Form.Item;

class ItemEditModal extends Component {
  static propTypes = {
    title: PropTypes.string,
    record: PropTypes.object,
    onOk: PropTypes.func,
  };

  static defaultProps = {
    title: '',
    record: {},
    onOk: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  handleShowModel = e => {
    if (e) e.stopPropagation();
    this.setState({
      visible: true,
    });
  };

  handleHideModel = () => {
    this.setState({
      visible: false,
    });
  };

  handleOk = () => {
    const { form, onOk } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      onOk(fieldsValue);
      form.resetFields();
      this.handleHideModel();
    });
  };

  render() {
    const { title, children, form, record } = this.props;
    const { name } = record;
    const { visible } = this.state;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };

    return (
      <span>
        <span onClick={this.handleShowModel}>{children}</span>
        <Modal title={title} visible={visible} onOk={this.handleOk} onCancel={this.handleHideModel}>
          <FormItem {...formItemLayout} label="项目名称">
            {form.getFieldDecorator('item', {
              initialValue: name,
              rules: [{ required: true, message: '请输入实验项目名称...' }],
            })(<Input placeholder="请输入" />)}
          </FormItem>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(ItemEditModal);
