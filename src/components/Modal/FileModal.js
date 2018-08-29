import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Modal, Upload, Button, Icon } from 'antd';

const FormItem = Form.Item;

class ThinkingEditModal extends Component {
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
      fileList: [],
      visible: false,
      uploading: false,
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
    const { fileList } = this.state;
    const formData = new FormData();
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { name, describe } = fieldsValue;
      const file = fileList[0];
      formData.append('name', name);
      formData.append('describe', describe);
      if (file) formData.append('file', fileList[0]);

      this.setState({
        uploading: true,
      });

      onOk(formData);

      this.setState({
        fileList: [],
        uploading: false,
      });
      form.resetFields();
      this.handleHideModel();
    });
  };

  render() {
    const { title, children, form, record } = this.props;
    const { name, describe } = record;
    const { visible, uploading, fileList } = this.state;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };
    const props = {
      action: '',
      fileList,
      onRemove: () => {
        this.setState(() => {
          return {
            fileList: [],
          };
        });
      },
      beforeUpload: file => {
        this.setState(() => ({
          fileList: [file],
        }));
        return false;
      },
    };

    return (
      <span>
        <span onClick={this.handleShowModel}>{children}</span>
        <Modal title={title} visible={visible} onOk={this.handleOk} onCancel={this.handleHideModel}>
          <FormItem {...formItemLayout} label="文件名">
            {form.getFieldDecorator('name', {
              initialValue: name,
              rules: [{ required: true, message: '请输入文件名...' }],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} fileList={fileList} label="文件描述">
            {form.getFieldDecorator('describe', {
              initialValue: describe,
              rules: [{ required: true, message: '请输入文件描述...' }],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="文件">
            {form.getFieldDecorator('file')(
              <Upload {...props}>
                <Button loading={uploading} disabled={fileList.length >= 1}>
                  <Icon type="upload" /> 上传
                </Button>
              </Upload>
            )}
          </FormItem>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(ThinkingEditModal);
