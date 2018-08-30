import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
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
  Alert,
  Table,
} from 'antd';
import Result from '../../components/Result';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import StandardTable from '../../components/StandardTable';
import StudentModal from '../../components/Modal/StudentModal';
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

@connect(({ student, classes, loading }) => ({
  student,
  classes,
  loading: loading.models.student,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
    step: -1,
    uploadData: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'student/fetch',
    });
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
      type: 'student/fetch',
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
        type: 'student/fetch',
        payload: values,
      });
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'student/fetch',
      payload: {},
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'student/remove',
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
    }
  };

  handleImportConfirmClick = () => {
    const { form } = this.props;
    const { uploadData } = this.state;
    const { getFieldValue } = form;
    const { data } = uploadData;
    const classes = getFieldValue('classes_import');
    fetch(`${config.domain}/api/student/import`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
      credentials: 'include',
      method: 'POST',
      body: JSON.stringify({ classes, data }),
    }).then(response => {
      if (response.status === 200) {
        this.setState({
          step: 2,
        });
      }
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    const { xh, name, classes } = fields;
    dispatch({
      type: 'student/create',
      payload: {
        xh,
        name,
        classes,
      },
    });
  };

  handleEdit = (id, values) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'student/patch',
      payload: { id, values },
    });
  };

  handelDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'student/remove',
      payload: id,
    });
  };

  renderForm() {
    const {
      form,
      classes: { classes },
    } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="姓名">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="班级">
              {getFieldDecorator('classes')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
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
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      form,
      student: { data },
      classes: { classes },
      loading,
    } = this.props;
    const { selectedRows, step, uploadData } = this.state;
    const { getFieldDecorator, getFieldValue } = form;
    const { warning } = uploadData;

    let warningMessage = '';
    if (warning && warning.length > 0) {
      warningMessage = warning.join();
      warningMessage = `${warningMessage} 已存在，将不会导入`;
    }

    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };

    const columns = [
      {
        title: '学号',
        dataIndex: 'xh',
      },
      {
        title: '姓名',
        dataIndex: 'name',
      },
      {
        title: '班级',
        dataIndex: 'classes',
        render(val) {
          for (const i in classes) {
            if (classes[i].id === val) return classes[i].name;
          }
          return '';
        },
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <StudentModal
              title="编辑学生信息"
              classesList={classes}
              record={record}
              onOk={this.handleEdit.bind(null, record.id)}
            >
              <a>编辑</a>
            </StudentModal>
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
      action: `${config.domain}/api/student/import`,
      data: { classes: getFieldValue('classes_import') },
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

    return (
      <PageHeaderLayout title="学生管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <StudentModal
                title="新建学生"
                classesList={classes}
                record={{}}
                onOk={this.handleAdd}
              >
                <Button icon="plus" type="primary" disabled={step >= 0}>
                  新建
                </Button>
              </StudentModal>
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
              <Button icon="cloud-upload-o" type="primary" onClick={this.handleUploadButtonClick}>
                {step < 0 && '批量上传'}
                {step >= 0 && '返回'}
              </Button>
            </div>
            {step < 0 && (
              <StandardTable
                selectedRows={selectedRows}
                loading={loading}
                data={data}
                columns={columns}
                rowKey="id"
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
              />
            )}
            {step >= 0 && (
              <div>
                <Steps current={step} style={{ maxWidth: '750px', margin: '16px auto' }}>
                  <Step title="上传文件" />
                  <Step title="预览信息" />
                  <Step title="完成导入" />
                </Steps>
                <Form
                  layout="horizontal"
                  hideRequiredMark
                  style={{ maxWidth: '750px', margin: '16px auto' }}
                >
                  <FormItem label="班级" {...formItemLayout}>
                    {getFieldDecorator('classes_import')(
                      <Select
                        placeholder="请选择导入班级"
                        disabled={step > 0}
                        onChange={this.handleClassesChange}
                      >
                        {classes &&
                          classes.map(i => {
                            return (
                              <Option key={i.id} value={i.id}>
                                {i.name}
                              </Option>
                            );
                          })}
                      </Select>
                    )}
                  </FormItem>
                </Form>
              </div>
            )}
            {step === 0 && (
              <div style={{ margin: '40px auto 0', maxWidth: '500px' }}>
                <Dragger disabled={!getFieldValue('classes_import')} {...props}>
                  <p className="ant-upload-drag-icon">
                    <Icon type="inbox" />
                  </p>
                  <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
                  <p className="ant-upload-hint">支持扩展名：.xls .xlsx</p>
                  <p className="ant-upload-hint">
                    模板：
                    <a href={`${config.domain}/static/template_student.xlsx`}>下载链接</a>
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
                      title: '姓名',
                      dataIndex: 'name',
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
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
