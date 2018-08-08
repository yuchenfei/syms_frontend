import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Select, Button, Card, InputNumber } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ classes, course, experiment, exam, loading }) => ({
  classes,
  course,
  experiment,
  exam,
  submitting: loading.effects['exam/create'],
}))
@Form.create()
export default class BasicForms extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'classes/fetch',
    });
  }

  handleClassesChange = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'course/fetch',
      payload: { classes: value },
    });
  };

  handleCourseChange = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'experiment/fetch',
      payload: { course: value },
    });
    dispatch({
      type: 'item/fetch',
      payload: {},
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'exam/create',
          payload: {
            experiment: values.experiment,
            duration: values.duration,
          },
        });
      }
    });
  };

  render() {
    const {
      submitting,
      form,
      classes: { classes },
      course,
      experiment,
    } = this.props;
    const courseList = course.data.list;
    const experimentList = experiment.data.list;
    const { getFieldDecorator, getFieldValue } = form;

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
      <PageHeaderLayout title="答题设置">
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="班级">
              {getFieldDecorator('classes', {
                rules: [
                  {
                    required: true,
                    message: '请选择班级',
                  },
                ],
              })(
                <Select placeholder="请选择" onChange={this.handleClassesChange}>
                  {classes.map(i => {
                    return <Option value={i.id}>{i.name}</Option>;
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="课程">
              {getFieldDecorator('course', {
                rules: [
                  {
                    required: true,
                    message: '请选择课程',
                  },
                ],
              })(
                <Select
                  placeholder="请选择"
                  disabled={!getFieldValue('classes')}
                  onChange={this.handleCourseChange}
                >
                  {courseList.map(i => {
                    return <Option value={i.id}>{i.name}</Option>;
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="实验">
              {getFieldDecorator('experiment', {
                rules: [
                  {
                    required: true,
                    message: '请选择实验',
                  },
                ],
              })(
                <Select placeholder="请选择" disabled={!getFieldValue('course')}>
                  {experimentList.map(i => {
                    return <Option value={i.id}>{i.name}</Option>;
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="时间（分钟）">
              {getFieldDecorator('duration', {
                initialValue: 10,
                rules: [
                  {
                    required: true,
                    message: '请输入时间',
                  },
                ],
              })(<InputNumber min={1} max={60} />)}
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
