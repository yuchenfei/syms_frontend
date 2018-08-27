import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Modal, Select } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

class QuestionEditModal extends Component {
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
    const { titleModal, items, children, form, record } = this.props;
    const { item, title, a, b, c, d, answer } = record;
    const { visible } = this.state;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
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
          <FormItem {...formItemLayout} label="题目">
            {form.getFieldDecorator('title', {
              initialValue: title,
              rules: [{ required: true, message: '请输入题目...' }],
            })(<TextArea style={{ minHeight: 32 }} placeholder="请输入" rows={4} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="选项A">
            {form.getFieldDecorator('a', { initialValue: a })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="选项B">
            {form.getFieldDecorator('b', { initialValue: b })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="选项C">
            {form.getFieldDecorator('c', { initialValue: c })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="选项D">
            {form.getFieldDecorator('d', { initialValue: d })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="答案">
            {form.getFieldDecorator('answer', {
              initialValue: answer,
              rules: [{ required: true, message: '请选择答案...' }],
            })(
              <Select placeholder="请选择" style={{ width: '100%' }}>
                <Option value="a">选项A</Option>
                <Option value="b">选项B</Option>
                <Option value="c">选项C</Option>
                <Option value="d">选项D</Option>
              </Select>
            )}
          </FormItem>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(QuestionEditModal);
