import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Modal, Select, Upload, Button, Icon } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

class ThinkingEditModal extends Component {
  static propTypes = {
    title: PropTypes.string,
    items: PropTypes.array,
    record: PropTypes.object,
    onOk: PropTypes.func,
  };

  static defaultProps = {
    title: '',
    items: [],
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
      const { item, title } = fieldsValue;
      const file = fileList[0];
      formData.append('item', item);
      formData.append('title', title);
      if (file) formData.append('picture', fileList[0]);

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
    const { titleModal, children, form, record, items } = this.props;
    const { item, title } = record;
    const { visible, uploading, fileList } = this.state;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };
    const props = {
      action: '',
      fileList,
      onRemove: file => {
        this.setState(({ fl }) => {
          const index = fl.indexOf(file);
          const newFileList = fl.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
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
        <Modal
          title={titleModal}
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleHideModel}
        >
          <FormItem {...formItemLayout} label="实验项目">
            {form.getFieldDecorator('item', {
              initialValue: item,
              rules: [{ required: true, message: '请选择实验项目...' }],
            })(
              <Select placeholder="请选择" style={{ width: '100%' }}>
                {items.map(i => {
                  return (
                    <Option key={i.id} value={i.id}>
                      {i.name}
                    </Option>
                  );
                })}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} fileList={fileList} label="题目">
            {form.getFieldDecorator('title', {
              initialValue: title,
              rules: [{ required: true, message: '请输入题目...' }],
            })(<TextArea style={{ minHeight: 32 }} placeholder="请输入" rows={4} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="图片（可选）">
            {form.getFieldDecorator('picture')(
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
