import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Button, Card, Input, Divider, Alert } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;

@connect(({ user, loading }) => ({
  user,
  submitting: loading.effects['user/setting'],
}))
@Form.create()
export default class BasicForms extends PureComponent {
  state = {
    confirmDirty: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });
  }

  handleConfirmBlur = e => {
    const { value } = e.target;
    const { confirmDirty } = this.state;
    this.setState({ confirmDirty: confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('passwordNew')) {
      callback('两次输入的密码不一致!');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    const { confirmDirty } = this.state;
    if (value && confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  checkPassword = (rule, value, callback) => {
    const { status } = this.props;
    if (status === 'error') {
      callback('密码错误');
    } else {
      callback();
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'user/setting',
          payload: {
            last_name: values.last_name,
            first_name: values.first_name,
            password_new: values.passwordNew,
            password: values.password,
          },
        });
        // form.resetFields();
      }
    });
  };

  renderMessage = content => {
    return <Alert message={content} type="error" showIcon />;
  };

  render() {
    const {
      user: { currentUser, status },
      submitting,
      form,
    } = this.props;
    // const { getFieldDecorator, getFieldValue } = form;
    // eslint-disable-next-line camelcase
    const { last_name, first_name } = currentUser;
    if (status === 'changed') form.resetFields();

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    return (
      <PageHeaderLayout title="设置">
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <Divider>个人信息</Divider>
            <FormItem {...formItemLayout} label="姓">
              {form.getFieldDecorator('last_name', {
                initialValue: last_name,
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="名">
              {form.getFieldDecorator('first_name', {
                initialValue: first_name,
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <Divider>修改密码</Divider>
            <FormItem {...formItemLayout} label="新密码">
              {form.getFieldDecorator('passwordNew', {
                rules: [{ validator: this.validateToNextPassword }],
              })(<Input placeholder="请输入" type="password" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="重复密码">
              {form.getFieldDecorator('confirm', {
                rules: [{ validator: this.compareToFirstPassword }],
              })(<Input placeholder="请输入" type="password" onBlur={this.handleConfirmBlur} />)}
            </FormItem>
            <Divider />
            <FormItem {...formItemLayout} label="密码">
              {form.getFieldDecorator('password', {
                rules: [
                  { required: true, message: '请输入密码' },
                  { validator: this.checkPassword },
                ],
              })(<Input placeholder="请输入" type="password" />)}
            </FormItem>
            <FormItem {...submitFormLayout} label="">
              {status === 'error' && this.renderMessage('密码错误！')}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
