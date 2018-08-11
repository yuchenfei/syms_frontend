import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, InputNumber, Modal, Select } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

class GradeEditModal extends Component {
  static propTypes = {
    title: PropTypes.string,
    info: PropTypes.string,
    studentList: PropTypes.array,
    record: PropTypes.object,
    onOk: PropTypes.func,
  };

  static defaultProps = {
    title: '',
    info: '',
    studentList: [],
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
    const { title, children, form, record, info, studentList } = this.props;
    const { student, grade, comment } = record;
    const { visible } = this.state;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };

    return (
      <span>
        <span onClick={this.handleShowModel}>{children}</span>
        <Modal title={title} visible={visible} onOk={this.handleOk} onCancel={this.handleHideModel}>
          <FormItem {...formItemLayout} label="所属实验">
            {info}
          </FormItem>
          <FormItem {...formItemLayout} label="学生">
            {form.getFieldDecorator('student', {
              initialValue: student,
              rules: [{ required: true, message: '请选择学生...' }],
            })(
              <Select placeholder="请选择" style={{ width: '100%' }}>
                {studentList.map(i => {
                  return <Option value={i.id}>{i.name}</Option>;
                })}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="分数">
            {form.getFieldDecorator('grade', {
              initialValue: grade,
              rules: [{ required: true, message: '请输入分数' }],
            })(<InputNumber min={0} max={100} style={{ width: '100%' }} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="评语">
            {form.getFieldDecorator('comment', {
              initialValue: comment,
            })(<TextArea style={{ minHeight: 32 }} placeholder="请输入" rows={4} />)}
          </FormItem>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(GradeEditModal);
