import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Modal, Switch, Select } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

class CourseEditModal extends Component {
  static propTypes = {
    title: PropTypes.string,
    classesList: PropTypes.array,
    record: PropTypes.object,
    onOk: PropTypes.func,
  };

  static defaultProps = {
    title: '',
    classesList: [],
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
    const { title, children, form, record, classesList } = this.props;
    const { name, classes, term, status } = record;
    const { visible } = this.state;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };

    return (
      <span>
        <span onClick={this.handleShowModel}>{children}</span>
        <Modal title={title} visible={visible} onOk={this.handleOk} onCancel={this.handleHideModel}>
          <FormItem {...formItemLayout} label="课程">
            {form.getFieldDecorator('name', {
              initialValue: name,
              rules: [{ required: true, message: '请输入课程名...' }],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="班级">
            {form.getFieldDecorator('classes', {
              initialValue: classes,
              rules: [{ required: true, message: '请选择班级...' }],
            })(
              <Select placeholder="请选择" style={{ width: '100%' }}>
                {classesList.map(i => {
                  return <Option value={i.id}>{i.name}</Option>;
                })}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="学期">
            {form.getFieldDecorator('term', {
              initialValue: term,
              rules: [{ required: true, message: '请输入学期...' }],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="状态">
            {form.getFieldDecorator('status', {
              initialValue: status,
              valuePropName: 'checked',
            })(<Switch checkedChildren="已结课" unCheckedChildren="进行中" />)}
          </FormItem>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(CourseEditModal);
