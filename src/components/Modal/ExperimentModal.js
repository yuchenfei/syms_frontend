import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Modal, Select } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

class ExperimentModal extends Component {
  static propTypes = {
    title: PropTypes.string,
    items: PropTypes.array,
    CourseList: PropTypes.array,
    record: PropTypes.object,
    onOk: PropTypes.func,
  };

  static defaultProps = {
    title: '',
    items: [],
    CourseList: [],
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
    const { title, children, form, record, items, courseList } = this.props;
    const { item, describe, course, remark } = record;
    const { visible } = this.state;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };

    return (
      <span>
        <span onClick={this.handleShowModel}>{children}</span>
        <Modal title={title} visible={visible} onOk={this.handleOk} onCancel={this.handleHideModel}>
          <FormItem {...formItemLayout} label="实验项目">
            {form.getFieldDecorator('item', {
              initialValue: item,
              rules: [{ required: true, message: '请选择实验项目...' }],
            })(
              <Select placeholder="请选择" style={{ width: '100%' }}>
                {items.map(i => {
                  return <Option value={i.id}>{i.name}</Option>;
                })}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="描述">
            {form.getFieldDecorator('describe', { initialValue: describe })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="课程">
            {form.getFieldDecorator('course', {
              initialValue: course,
              rules: [{ required: true, message: '请选择课程...' }],
            })(
              <Select placeholder="请选择" style={{ width: '100%' }}>
                {courseList.map(i => {
                  return <Option value={i.id}>{i.name}</Option>;
                })}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="备注">
            {form.getFieldDecorator('remark', { initialValue: remark })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(ExperimentModal);
