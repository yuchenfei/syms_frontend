import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Button, Popconfirm, Table, DatePicker, Divider } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import config from '../../config';
import styles from './style.less';

const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ exam, experiment, loading }) => ({
  exam,
  experiment,
  loading: loading.models.exam,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'exam/fetch',
    });
    dispatch({
      type: 'experiment/fetch',
    });
  }

  handleTableChange = (pagination, filtersArg, sorter) => {
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
      type: 'exam/fetch',
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
        type: 'exam/fetch',
        payload: { date: values.date ? values.date.format('YYYY-MM-DD') : '' },
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
      type: 'exam/fetch',
      payload: {},
    });
  };

  handelDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'exam/remove',
      payload: id,
    });
  };

  renderForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="日期">
              {getFieldDecorator('date')(
                <DatePicker style={{ width: '100%' }} placeholder="请选择日期" />
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
      exam: { data },
      experiment,
      loading,
    } = this.props;
    const { list, pagination } = data;
    const experimentList = experiment.data.list;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };

    const columns = [
      {
        title: '日期',
        dataIndex: 'datetime',
      },
      {
        title: '实验',
        dataIndex: 'experiment',
        render(val) {
          for (const i in experimentList) {
            if (experimentList[i].id === val) return experimentList[i].name;
          }
          return '';
        },
      },
      {
        title: '课程',
        dataIndex: 'info',
      },
      {
        title: '操作',
        render: (text, record) => {
          const url = `${config.domain}/api/exam/report/${record.id}`;
          return (
            <Fragment>
              <Popconfirm title="确认删除？" onConfirm={this.handelDelete.bind(this, record.id)}>
                <a href="">删除</a>
              </Popconfirm>
              {record.report && <Divider type="vertical" />}
              {record.report && <a href={url}>下载报告</a>}
            </Fragment>
          );
        },
      },
    ];

    return (
      <PageHeaderLayout title="学生管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <Table
              loading={loading}
              rowKey="id"
              // rowSelection={rowSelection}
              dataSource={list}
              columns={columns}
              pagination={paginationProps}
              onChange={this.handleTableChange}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
