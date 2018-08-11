import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  Divider,
  Popconfirm,
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './style.less';
import GradeModal from '../../components/Modal/GradeModal';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ grade, classes, course, experiment, student, loading }) => ({
  grade,
  classes,
  course,
  experiment,
  student,
  loading: loading.models.grade,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'classes/fetch',
    });
  }

  getClassesName = id => {
    const {
      classes: { classes },
    } = this.props;
    for (const i in classes) {
      if (classes[i].id === id) return classes[i].name;
    }
    return '';
  };

  getCourseName = id => {
    const { course } = this.props;
    const courseList = course.data.list;
    for (const i in courseList) {
      if (courseList[i].id === id) return courseList[i].name;
    }
    return '';
  };

  getExperimentName = id => {
    const { experiment } = this.props;
    const experimentList = experiment.data.list;
    for (const i in experimentList) {
      if (experimentList[i].id === id) return experimentList[i].name;
    }
    return '';
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    console.log('change');
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const { experiment } = formValues;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      experiment,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'grade/fetch',
      payload: params,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'grade/fetch',
        payload: { experiment: values.experiment },
      });
    });
  };

  handleClassesChange = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'course/fetch',
      payload: { classes: value },
    });
    dispatch({
      type: 'student/fetch',
      payload: { classes: value },
    });
  };

  handleCourseChange = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'experiment/fetch',
      payload: { course: value },
    });
  };

  handleExperimentChange = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'grade/fetch',
      payload: { experiment: value },
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'grade/remove',
          payload: {
            userName: selectedRows.map(row => row.username).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleAdd = fields => {
    const { dispatch, form } = this.props;
    const { student, grade, comment } = fields;
    const { getFieldValue } = form;
    const experiment = getFieldValue('experiment');
    dispatch({
      type: 'grade/create',
      payload: {
        experiment,
        student,
        grade,
        comment,
      },
      experiment: { experiment },
    });
  };

  handleEdit = (id, values) => {
    const { dispatch, form } = this.props;
    const { getFieldValue } = form;
    const experiment = getFieldValue('experiment');
    dispatch({
      type: 'grade/patch',
      payload: { id, values },
      experiment: { experiment },
    });
  };

  handelDelete = id => {
    const { dispatch, form } = this.props;
    const { getFieldValue } = form;
    const experiment = getFieldValue('experiment');
    dispatch({
      type: 'grade/remove',
      payload: id,
      experiment: { experiment },
    });
  };

  renderForm() {
    const {
      form,
      classes: { classes },
      course,
      experiment,
    } = this.props;
    const courseList = course.data.list;
    const experimentList = experiment.data.list;
    const { getFieldDecorator, getFieldValue } = form;
    return (
      <Form onSubmit={this.handleSearch} hideRequiredMark style={{ marginTop: 8 }}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
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
                    return <Option value={i.id}>{i.name}</Option>;
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
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
                    return <Option value={i.id}>{i.name}</Option>;
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="实验">
              {getFieldDecorator('experiment', {
                rules: [
                  {
                    required: true,
                    message: '请选择实验',
                  },
                ],
              })(
                <Select
                  placeholder="请选择"
                  disabled={!getFieldValue('course')}
                  onChange={this.handleExperimentChange}
                >
                  {experimentList.map(i => {
                    return <Option value={i.id}>{i.name}</Option>;
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
      grade: { data },
      student,
      loading,
    } = this.props;
    const { selectedRows } = this.state;
    const studentList = student.data.list;
    const { getFieldValue } = form;
    let info = '';
    if (getFieldValue('experiment')) {
      const classes = this.getClassesName(getFieldValue('classes'));
      const course = this.getCourseName(getFieldValue('course'));
      const experiment = this.getExperimentName(getFieldValue('experiment'));
      info = `${classes} / ${course} / ${experiment}`;
    }

    const columns = [
      {
        title: '学生',
        dataIndex: 'studentName',
      },
      {
        title: '成绩',
        dataIndex: 'grade',
      },
      {
        title: '评语',
        dataIndex: 'comment',
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <GradeModal
              title="编辑成绩"
              info={info}
              record={record}
              studentList={studentList}
              onOk={this.handleEdit.bind(null, record.id)}
            >
              <a>编辑</a>
            </GradeModal>
            <Divider type="vertical" />
            <Popconfirm title="确认删除？" onConfirm={this.handelDelete.bind(this, record.id)}>
              <a href="">删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
      </Menu>
    );

    return (
      <PageHeaderLayout title="成绩管理" content="请先选择实验">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <GradeModal
                title="新建成绩"
                info={info}
                studentList={studentList}
                record={{}}
                onOk={this.handleAdd}
              >
                <Button icon="plus" type="primary" disabled={!getFieldValue('experiment')}>
                  新建
                </Button>
              </GradeModal>
              {selectedRows.length > 0 && (
                <span>
                  <Button>批量操作</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={info ? data : []}
              columns={columns}
              rowKey="id"
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
