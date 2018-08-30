import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Select, Table } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ classes, course, courseGrade, loading }) => ({
  classes,
  course,
  courseGrade,
  loading: loading.models.courseGrade,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'classes/fetch',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'experiment/fetch',
      payload: params,
    });
  };

  handleClassesChange = value => {
    const { form, dispatch } = this.props;
    const { resetFields } = form;
    resetFields('course');
    dispatch({
      type: 'course/fetch',
      payload: { classes: value },
    });
    dispatch({
      type: 'courseGrade/fetch',
      payload: {},
    });
  };

  handleCourseChange = value => {
    const { dispatch } = this.props;
    this.setState({
      formValues: value,
    });
    dispatch({
      type: 'courseGrade/fetch',
      payload: { course: value },
    });
  };

  renderForm() {
    const {
      form,
      classes: { classes },
      course,
    } = this.props;
    const courseList = course.data.list;
    const { getFieldDecorator, getFieldValue } = form;
    return (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="班级">
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
                    return (
                      <Option key={i.id} value={i.id}>
                        {i.name}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="课程">
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
                    return (
                      i.status && (
                        <Option key={i.id} value={i.id}>
                          {i.name}
                        </Option>
                      )
                    );
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      form,
      courseGrade: { data },
      loading,
    } = this.props;
    const { getFieldValue } = form;
    const { list } = data;

    return (
      <PageHeaderLayout
        title="实验管理"
        content="课程【结课】后可以看到课程成绩，课程成绩为该课程下所有实验成绩的平均分"
      >
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <Table
              loading={loading}
              dataSource={getFieldValue('course') ? list : []}
              columns={[
                {
                  title: '学号',
                  dataIndex: 'xh',
                },
                {
                  title: '姓名',
                  dataIndex: 'name',
                },
                {
                  title: '成绩',
                  dataIndex: 'grade',
                },
              ]}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
