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
import ExperimentModal from '../../components/Modal/ExperimentModal';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ experiment, item, course, loading }) => ({
  experiment,
  item,
  course,
  loading: loading.models.experiment,
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
      type: 'experiment/fetch',
    });
    dispatch({
      type: 'item/fetch',
    });
    dispatch({
      type: 'course/fetch',
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
        type: 'experiment/fetch',
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
      type: 'experiment/fetch',
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
          type: 'experiment/remove',
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
    const { dispatch } = this.props;
    const { item, describe, course, remark } = fields;
    dispatch({
      type: 'experiment/create',
      payload: {
        item,
        describe,
        course,
        remark,
      },
    });
  };

  handleEdit = (id, values) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'experiment/patch',
      payload: { id, values },
    });
  };

  handelDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'experiment/remove',
      payload: id,
    });
  };

  renderForm() {
    const {
      form,
      item: { items },
      course,
    } = this.props;
    const courseList = course.data.list;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="实验名">
              {getFieldDecorator('item')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  {items.map(i => {
                    return <Option value={i.id}>{i.name}</Option>;
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="课程">
              {getFieldDecorator('course')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  {courseList.map(i => {
                    return <Option value={i.id}>{i.name}</Option>;
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
      experiment: { data },
      item: { items },
      course,
      loading,
    } = this.props;
    const courseList = course.data.list;
    const { selectedRows } = this.state;

    const columns = [
      {
        title: '实验项目',
        dataIndex: 'item',
        render(val) {
          for (const i in items) {
            if (items[i].id === val) return items[i].name;
          }
          return '';
        },
      },
      {
        title: '描述',
        dataIndex: 'describe',
      },
      {
        title: '课程',
        dataIndex: 'info',
        // render(val) {
        //   for (const i in courseList) {
        //     if (courseList[i].id === val) return courseList[i].name;
        //   }
        //   return '';
        // },
      },
      {
        title: '备注',
        dataIndex: 'remark',
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <ExperimentModal
              title="编辑实验"
              items={items}
              courseList={courseList}
              record={record}
              onOk={this.handleEdit.bind(null, record.id)}
            >
              <a>编辑</a>
            </ExperimentModal>
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
      <PageHeaderLayout title="实验管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <ExperimentModal
                title="新建实验"
                items={items}
                courseList={courseList}
                record={{}}
                onOk={this.handleAdd}
              >
                <Button icon="plus" type="primary">
                  新建
                </Button>
              </ExperimentModal>
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
              data={data}
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
