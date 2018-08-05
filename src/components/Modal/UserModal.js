import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Modal, Switch } from 'antd';

const FormItem = Form.Item;

class UserEditModal extends Component {
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
    // eslint-disable-next-line camelcase
    const { username, last_name, first_name, is_admin } = record;
    const { visible } = this.state;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };

    return (
      <span>
        <span onClick={this.handleShowModel}>{children}</span>
        <Modal title={title} visible={visible} onOk={this.handleOk} onCancel={this.handleHideModel}>
          <FormItem {...formItemLayout} label="用户名">
            {form.getFieldDecorator('username', {
              initialValue: username,
              rules: [{ required: true, message: '请输入用户名...' }],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="姓">
            {form.getFieldDecorator('last_name', { initialValue: last_name })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="名">
            {form.getFieldDecorator('first_name', { initialValue: first_name })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="管理员">
            {form.getFieldDecorator('is_admin', {
              initialValue: is_admin,
              valuePropName: 'checked',
            })(<Switch />)}
          </FormItem>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(UserEditModal);
