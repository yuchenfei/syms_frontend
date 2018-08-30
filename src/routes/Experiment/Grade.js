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
  Steps,
  Upload,
  message,
  Table,
  Alert,
} from 'antd';
import { ChartCard, Bar, Field, MiniBar } from '../../components/Charts';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import StandardTable from '../../components/StandardTable';
import Result from '../../components/Result';
import GradeModal from '../../components/Modal/GradeModal';
import styles from './style.less';
import config from '../../config';
import fetch from '../../../node_modules/dva/fetch';

const FormItem = Form.Item;
const { Option } = Select;
const { Step } = Steps;
const { Dragger } = Upload;
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
    step: -1,
    uploadData: {},
    analyseData: {},
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

  reloadData = () => {
    const { dispatch, form } = this.props;
    const { getFieldValue } = form;
    const experiment = getFieldValue('experiment');
    dispatch({
      type: 'grade/fetch',
      payload: { experiment },
    });
  };

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
      experiment: formValues,
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

  handleClassesChange = value => {
    const { form, dispatch } = this.props;
    const { resetFields } = form;
    resetFields('course');
    resetFields('experiment');
    this.setState({
      step: -1,
      uploadData: {},
    });
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
    const { form, dispatch } = this.props;
    const { resetFields } = form;
    resetFields('experiment');
    this.setState({
      step: -1,
      uploadData: {},
    });
    dispatch({
      type: 'experiment/fetch',
      payload: { course: value },
    });
  };

  handleExperimentChange = value => {
    const { dispatch } = this.props;
    this.setState({
      formValues: value,
    });
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

  handleUploadButtonClick = () => {
    const { step } = this.state;
    if (step < 0) {
      this.setState({
        step: 0,
      });
    } else {
      this.setState({
        step: -1,
        uploadData: {},
      });
      this.reloadData();
    }
  };

  handleImportConfirmClick = () => {
    const { form } = this.props;
    const { uploadData } = this.state;
    const { getFieldValue } = form;
    const { data } = uploadData;
    const experiment = getFieldValue('experiment');
    fetch(`${config.domain}/api/grade/import`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
      credentials: 'include',
      method: 'POST',
      body: JSON.stringify({ experiment, data }),
    }).then(response => {
      if (response.status === 200) {
        this.setState({
          step: 2,
        });
      } else {
        message.error('导入出错！');
      }
    });
  };

  handleAnalyseButtonClick = () => {
    const {
      grade: { data },
    } = this.props;
    const { list } = data;
    const { step } = this.state;
    // 分析数据
    const gradeAll = [];
    const gradeRange = [
      { x: '60以下', y: 0 },
      { x: '60-69', y: 0 },
      { x: '70-79', y: 0 },
      { x: '80-89', y: 0 },
      { x: '90-100', y: 0 },
    ];
    let average = 0;
    let maxIndex = 0;
    let minIndex = 0;
    list.forEach((item, index) => {
      gradeAll.push({ x: item.studentName, y: item.grade });
      average += item.grade;
      if (item.grade > list[maxIndex].grade) maxIndex = index;
      if (item.grade < list[minIndex].grade) minIndex = index;
      switch (Math.floor(item.grade / 10)) {
        case 10:
        case 9:
          gradeRange[4].y += 1;
          break;
        case 8:
          gradeRange[3].y += 1;
          break;
        case 7:
          gradeRange[2].y += 1;
          break;
        case 6:
          gradeRange[1].y += 1;
          break;
        default:
          gradeRange[0].y += 1;
      }
    });
    average /= list.length;

    // 跳转逻辑
    let stepTo = -1;
    if (step < 0) stepTo = 3;
    else stepTo = -1;
    // 写入State
    this.setState({
      step: stepTo,
      analyseData: { average, gradeAll, gradeRange, maxIndex, minIndex },
    });
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
      <Form hideRequiredMark style={{ marginTop: 8 }}>
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
    const { selectedRows, step, uploadData, analyseData } = this.state;
    const { getFieldValue } = form;
    const { list } = data;
    const studentList = student.data.list;
    const { warning } = uploadData;
    const { average, gradeAll, gradeRange, maxIndex, minIndex } = analyseData;

    let info = '';
    if (getFieldValue('experiment')) {
      const classes = this.getClassesName(getFieldValue('classes'));
      const course = this.getCourseName(getFieldValue('course'));
      const experiment = this.getExperimentName(getFieldValue('experiment'));
      info = `${classes} / ${course} / ${experiment}`;
    }

    let warningMessage = '';
    if (warning && warning.length > 0) {
      warningMessage = warning.join();
      warningMessage = `${warningMessage} 的成绩已存在，将不会导入`;
    }

    const columns = [
      {
        title: '学号',
        dataIndex: 'xh',
      },
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

    const props = {
      name: 'file',
      accept: '.xls,.xlsx',
      action: `${config.domain}/api/grade/import`,
      data: { experiment: getFieldValue('experiment') },
      withCredentials: true,
      onChange: i => {
        const { file } = i;
        const { name, status, response } = file;
        if (status === 'done') {
          if (response.status === 'ok') {
            message.success(`${name} 上传成功！`);
            this.setState({
              uploadData: response,
              step: 1,
            });
          }
          if (response.status === 'error') {
            message.error(`${name} 文件格式出错！`);
          }
        } else if (status === 'error') {
          message.error(`${name} 上传失败！`);
        }
      },
    };

    const colProps = {
      xs: 24,
      sm: 24,
      md: 24,
      lg: 12,
      xl: 12,
    };

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
                <Button
                  icon="plus"
                  type="primary"
                  disabled={!getFieldValue('experiment') || step >= 0}
                >
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
              <Button
                icon="cloud-upload-o"
                type="primary"
                onClick={this.handleUploadButtonClick}
                disabled={!getFieldValue('experiment') || step === 3}
              >
                {step >= 0 && step < 3 && '返回'}
                {(step < 0 || step === 3) && '批量上传'}
              </Button>
              <Button
                icon="area-chart"
                type="primary"
                onClick={this.handleAnalyseButtonClick}
                disabled={!getFieldValue('experiment') || (step >= 0 && step < 3)}
              >
                {step === 3 && '返回'}
                {step < 3 && '成绩分析'}
              </Button>
            </div>
            {step < 0 && (
              <StandardTable
                selectedRows={selectedRows}
                loading={loading}
                data={info ? data : []}
                columns={columns}
                rowKey="id"
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
              />
            )}
            {step >= 0 &&
              step < 3 && (
                <Steps current={step} style={{ maxWidth: '750px', margin: '16px auto' }}>
                  <Step title="上传文件" />
                  <Step title="预览信息" />
                  <Step title="完成导入" />
                </Steps>
              )}
            {step === 0 && (
              <div style={{ margin: '40px auto 0', maxWidth: '500px' }}>
                <Dragger {...props}>
                  <p className="ant-upload-drag-icon">
                    <Icon type="inbox" />
                  </p>
                  <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
                  <p className="ant-upload-hint">支持扩展名：.xls .xlsx</p>
                  <p className="ant-upload-hint">
                    模板：
                    <a
                      href={`${config.domain}/api/grade/import_template?classes=${getFieldValue(
                        'classes'
                      )}`}
                    >
                      下载链接
                    </a>
                  </p>
                </Dragger>
              </div>
            )}
            {step === 1 && (
              <div>
                {warning && warning.length > 0 && <Alert message={warningMessage} type="warning" />}
                <Table
                  dataSource={uploadData.data}
                  columns={[
                    {
                      title: '学号',
                      dataIndex: 'xh',
                    },
                    {
                      title: '学生',
                      dataIndex: 'name',
                    },
                    {
                      title: '成绩',
                      dataIndex: 'grade',
                    },
                    {
                      title: '评语',
                      dataIndex: 'comment',
                    },
                  ]}
                />
                <Button
                  type="primary"
                  onClick={this.handleImportConfirmClick}
                  disabled={uploadData.data && uploadData.data.length < 1}
                  style={{ marginTop: '12px' }}
                >
                  确认
                </Button>
              </div>
            )}
            {step === 2 && <Result type="success" title="导入成功" className={styles.result} />}
            {step === 3 && (
              <Row>
                <Col {...colProps}>
                  <ChartCard
                    bordered={false}
                    title="平均分"
                    total={average}
                    footer={
                      <Field
                        label="最高分/最低分:"
                        value={`${list[maxIndex].grade}(${list[maxIndex].studentName}) / ${
                          list[minIndex].grade
                        }(${list[minIndex].studentName})`}
                      />
                    }
                    contentHeight={170}
                  >
                    <MiniBar data={gradeAll} average={average} />
                  </ChartCard>
                </Col>
                <Col {...colProps}>
                  <Bar height={300} title="成绩分布" data={gradeRange} />
                </Col>
              </Row>
            )}
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
